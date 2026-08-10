import { NextRequest } from "next/server";

import { GET_users } from "@/lib/api-handlers/crud";
import { requireRole } from "@/lib/auth/middleware";

export async function GET(req: NextRequest) {
  await requireRole("ADMIN");
  return GET_users(req);
}
