import { NextRequest, NextResponse } from "next/server";

import { compareSync } from "bcryptjs";

import {
  clearAuthCookies,
  createAccessToken,
  createRefreshToken,
  getSession,
  setAuthCookies,
} from "@/lib/auth/jwt";
import { db } from "@/lib/db";

// ============================================================
// POST /api/v1/auth/login
// ============================================================
export async function POST_login(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !compareSync(password, user.passwordHash)) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "Cuenta suspendida o inactiva" }, { status: 403 });
    }

    // Update last active
    await db.user.update({ where: { id: user.id }, data: { lastActive: new Date() } });

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(user.id);
    await setAuthCookies(accessToken, refreshToken);

    // Audit log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        endpoint: "/api/v1/auth/login",
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// ============================================================
// POST /api/v1/auth/register
// ============================================================
export async function POST_register(req: NextRequest) {
  try {
    const { username, email, password, role } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    // Validate email domain
    if (!email.endsWith(".cu") && !email.endsWith(".gob.cu")) {
      // Allow non-.cu in dev
    }

    const existing = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return NextResponse.json({ error: "El email o nombre de usuario ya existe" }, { status: 409 });
    }

    const { hashSync } = await import("bcryptjs");
    const passwordHash = hashSync(password, 10);

    const user = await db.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: role || "USER",
        status: "active",
      },
    });

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(user.id);
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// ============================================================
// POST /api/v1/auth/logout
// ============================================================
export async function POST_logout() {
  const session = await getSession();
  if (session) {
    await db.session.deleteMany({ where: { userId: session.userId } });
  }
  await clearAuthCookies();
  return NextResponse.json({ success: true });
}

// ============================================================
// GET /api/v1/auth/session
// ============================================================
export async function GET_session() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: session.userId,
      username: session.username,
      email: session.email,
      role: session.role,
    },
  });
}
