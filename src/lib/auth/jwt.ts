/**
 * JWT Authentication Utilities
 *
 * Uses jose for JWT signing/verification.
 * Implements access + refresh token pattern.
 */

import { cookies } from "next/headers";

import { jwtVerify,SignJWT } from "jose";

import { db } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ocem-secret-key-change-in-production-min-32-chars"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "ocem-refresh-secret-change-in-production"
);

const ACCESS_EXPIRY = "2h";
const REFRESH_EXPIRY_DAYS = 7;

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
}

// ============================================================
// TOKEN CREATION
// ============================================================

export async function createAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_EXPIRY)
    .sign(JWT_SECRET);
}

export async function createRefreshToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_EXPIRY_DAYS}d`)
    .sign(REFRESH_SECRET);

  // Store in DB
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRY_DAYS);

  await db.session.create({
    data: {
      userId,
      refreshToken: token,
      expiresAt,
    },
  });

  return token;
}

// ============================================================
// TOKEN VERIFICATION
// ============================================================

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    const session = await db.session.findFirst({
      where: { refreshToken: token },
    });
    if (!session || session.expiresAt < new Date()) return null;
    return payload.userId as string;
  } catch {
    return null;
  }
}

// ============================================================
// COOKIE HELPERS
// ============================================================

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("ocem_access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2, // 2 hours
  });
  cookieStore.set("ocem_refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 60 * 60 * 24 * REFRESH_EXPIRY_DAYS,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("ocem_access_token");
  cookieStore.delete("ocem_refresh_token");
}

// ============================================================
// SERVER-SIDE SESSION GETTER
// ============================================================

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("ocem_access_token")?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

// ============================================================
// ROLE CHECK HELPERS
// ============================================================

export const ROLES = {
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  AUDITOR: "AUDITOR",
  USER: "USER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

const ROLE_HIERARCHY: Record<string, number> = {
  ADMIN: 4,
  EDITOR: 3,
  AUDITOR: 2,
  USER: 1,
};

export function hasMinRole(userRole: string, minRole: string): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[minRole] || 0);
}
