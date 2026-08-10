/**
 * Auth Middleware — RBAC helper for API routes
 */

import { NextResponse } from "next/server";

import { getSession, hasMinRole, type JWTPayload } from "@/lib/auth/jwt";

export type AuthContext = {
  user: JWTPayload;
};

/**
 * Require authentication. Returns 401 if not authenticated.
 */
export async function requireAuth(): Promise<JWTPayload | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  return session;
}

/**
 * Require minimum role. Returns 403 if insufficient permissions.
 */
export async function requireRole(minRole: string): Promise<JWTPayload | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  if (!hasMinRole(session.role, minRole)) {
    return NextResponse.json({ error: "Acceso denegado. Rol insuficiente." }, { status: 403 });
  }
  return session;
}

/**
 * Optional auth — returns session or null without error.
 */
export async function optionalAuth(): Promise<JWTPayload | null> {
  return getSession();
}
