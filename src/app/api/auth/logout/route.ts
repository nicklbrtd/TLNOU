import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { clearSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  await clearSession();
  void request;
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: "/login",
    },
  });
}
