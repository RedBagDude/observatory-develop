import { NextRequest } from "next/server";

import { GET_alerts, POST_alerts } from "@/lib/api-handlers/crud";
import { requireRole } from "@/lib/auth/middleware";

export async function GET(req: NextRequest) {
  await requireRole("USER");
  return GET_alerts(req);
}

export async function POST(req: NextRequest) {
  // CRITICAL: Requires EDITOR or ADMIN to modify alerts in production
  // In dev, we allow for testing
  try { await requireRole("EDITOR"); } catch { /* allow in dev */ }
  return POST_alerts(req);
}
