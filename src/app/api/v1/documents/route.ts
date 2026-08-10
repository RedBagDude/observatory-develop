import { NextRequest } from "next/server";

import { GET_documents } from "@/lib/api-handlers/crud";

export async function GET(req: NextRequest) {
  return GET_documents(req);
}
