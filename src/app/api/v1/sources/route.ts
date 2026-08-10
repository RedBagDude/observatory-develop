import { NextRequest } from "next/server";

import { GET_sources, PATCH_source } from "@/lib/api-handlers/crud";
import { requireRole } from "@/lib/auth/middleware";

export async function GET() {
  await requireRole("AUDITOR");
  return GET_sources();
}

export async function PATCH(req: NextRequest) {
  await requireRole("ADMIN");
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.length - 1] || "";
  return PATCH_source(req, id);
}
