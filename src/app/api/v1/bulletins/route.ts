import { NextRequest } from "next/server";

import { GET_bulletins, POST_bulletins } from "@/lib/api-handlers/crud";
import { requireRole } from "@/lib/auth/middleware";

export async function GET() {
  return GET_bulletins();
}

export async function POST(req: NextRequest) {
  await requireRole("EDITOR");
  return POST_bulletins(req);
}
