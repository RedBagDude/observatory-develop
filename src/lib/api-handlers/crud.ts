/**
 * API Handlers: Core CRUD operations
 */

import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

// ============================================================
// ALERTS
// ============================================================
export async function GET_alerts(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const severity = searchParams.get("severity");
  const active = searchParams.get("active");

  const where: Record<string, unknown> = {};
  if (severity) where.severity = severity;
  if (active !== null) where.active = active === "true";

  const alerts = await db.alert.findMany({
    where,
    orderBy: { timestamp: "desc" },
    take: 50,
  });
  return NextResponse.json(alerts);
}

export async function POST_alerts(req: NextRequest) {
  const data = await req.json();
  const alert = await db.alert.create({ data });
  return NextResponse.json(alert, { status: 201 });
}

export async function PATCH_alert(req: NextRequest, id: string) {
  const data = await req.json();
  const alert = await db.alert.update({ where: { id }, data });
  return NextResponse.json(alert);
}

export async function DELETE_alert(_req: NextRequest, id: string) {
  await db.alert.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// ============================================================
// GEO RESOURCES
// ============================================================
export async function GET_georesources(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;

  const resources = await db.geoResource.findMany({ where });
  return NextResponse.json(resources);
}

// ============================================================
// DATA SOURCES
// ============================================================
export async function GET_sources() {
  const sources = await db.dataSource.findMany({ orderBy: { sourceName: "asc" } });
  return NextResponse.json(sources);
}

export async function PATCH_source(req: NextRequest, id: string) {
  const data = await req.json();
  const source = await db.dataSource.update({ where: { id }, data });
  return NextResponse.json(source);
}

// ============================================================
// USERS (ADMIN)
// ============================================================
export async function GET_users(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const role = searchParams.get("role");

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { username: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const users = await db.user.findMany({
    where,
    select: { id: true, username: true, email: true, role: true, status: true, lastActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function PATCH_user(req: NextRequest, id: string) {
  const data = await req.json();
  const user = await db.user.update({
    where: { id },
    data,
    select: { id: true, username: true, email: true, role: true, status: true, lastActive: true },
  });
  return NextResponse.json(user);
}

export async function DELETE_user(_req: NextRequest, id: string) {
  await db.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// ============================================================
// BULLETINS
// ============================================================
export async function GET_bulletins() {
  const bulletins = await db.bulletin.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(bulletins);
}

export async function POST_bulletins(req: NextRequest) {
  const data = await req.json();
  const bulletin = await db.bulletin.create({ data });
  return NextResponse.json(bulletin, { status: 201 });
}

// ============================================================
// DOCUMENTS
// ============================================================
export async function GET_documents(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;

  const docs = await db.document.findMany({
    where,
    select: { id: true, title: true, filePath: true, category: true, metadata: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(docs);
}

// ============================================================
// AUDIT LOGS
// ============================================================
export async function GET_audit(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = {};
  if (userId) where.userId = userId;

  const logs = await db.auditLog.findMany({
    where,
    orderBy: { timestamp: "desc" },
    take: Math.min(limit, 200),
  });
  return NextResponse.json(logs);
}

// ============================================================
// CONTACT
// ============================================================
export async function POST_contact(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    // Validate email domain (.cu for institutional)
    const isInstitutional = email.endsWith(".cu") || email.endsWith(".gob.cu");

    const contact = await db.contactMessage.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json({
      success: true,
      id: contact.id,
      message: isInstitutional
        ? "Mensaje recibido. Le responderemos pronto."
        : "Mensaje recibido.",
    }, { status: 201 });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 });
  }
}

export async function GET_contact() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(messages);
}

// ============================================================
// SEARCH (semantic / RAG)
// ============================================================
export async function POST_search(req: NextRequest) {
  try {
    const { query, category, limit = 10 } = await req.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ error: "Consulta muy corta" }, { status: 400 });
    }

    // Simple text search (pgvector-compatible in production)
    const where: Record<string, unknown> = {
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
      ],
    };
    if (category) where.category = category;

    const results = await db.document.findMany({
      where,
      select: { id: true, title: true, category: true, metadata: true, createdAt: true },
      take: limit,
    });

    return NextResponse.json({ results, query, total: results.length });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}

// ============================================================
// STATS
// ============================================================
export async function GET_stats() {
  const [userCount, alertCount, sourceCount, docCount, activeAlerts] = await Promise.all([
    db.user.count(),
    db.alert.count(),
    db.dataSource.count(),
    db.document.count(),
    db.alert.count({ where: { active: true } }),
  ]);

  const sourcesByStatus = await db.dataSource.groupBy({
    by: ["status"],
    _count: true,
  });

  return NextResponse.json({
    users: userCount,
    alerts: { total: alertCount, active: activeAlerts },
    sources: { total: sourceCount, byStatus: sourcesByStatus },
    documents: docCount,
  });
}
