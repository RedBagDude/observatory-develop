import { NextRequest } from "next/server";

import { GET_audit } from "@/lib/api-handlers/crud";
import { requireRole } from "@/lib/auth/middleware";

export async function GET(req: NextRequest) {
  await requireRole("AUDITOR");
  return GET_audit(req);
}
