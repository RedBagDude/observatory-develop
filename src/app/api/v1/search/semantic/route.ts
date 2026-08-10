import { NextRequest } from "next/server";

import { POST_search } from "@/lib/api-handlers/crud";

export async function POST(req: NextRequest) {
  return POST_search(req);
}
