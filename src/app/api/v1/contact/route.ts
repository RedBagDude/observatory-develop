import { NextRequest } from "next/server";

import { GET_contact,POST_contact } from "@/lib/api-handlers/crud";
import { requireRole } from "@/lib/auth/middleware";

export async function POST(req: NextRequest) {
  return POST_contact(req);
}

export async function GET() {
  await requireRole("AUDITOR");
  return GET_contact();
}
