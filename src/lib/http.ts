import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function seeOther(path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: path,
    },
  });
}

export function getSafeReturnPath(request: NextRequest, fallback: string) {
  const referer = request.headers.get("referer");

  if (!referer) {
    return fallback;
  }

  try {
    const refererUrl = new URL(referer);
    const path = `${refererUrl.pathname}${refererUrl.search}`;

    if (!path.startsWith("/")) {
      return fallback;
    }

    return path;
  } catch {
    return fallback;
  }
}

export function coerceSafePath(path: unknown, fallback: string) {
  if (typeof path !== "string") {
    return fallback;
  }

  return path.startsWith("/") ? path : fallback;
}
