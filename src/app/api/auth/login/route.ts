import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { checkLoginRateLimit, recordLoginAttempt } from "@/lib/auth/rate-limit";
import { createSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators/auth";

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) {
    return null;
  }

  return forwarded.split(",")[0]?.trim() ?? null;
}

function redirectTo(path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: path,
    },
  });
}

function loginRedirect(errorCode?: string) {
  if (!errorCode) {
    return redirectTo("/login");
  }

  return redirectTo(`/login?error=${encodeURIComponent(errorCode)}`);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.path.join("."));
    const code = issues.includes("identifier")
      ? "invalid_identifier"
      : "validation";
    return loginRedirect(code);
  }

  const { identifier, password } = parsed.data;
  const ipAddress = getClientIp(request);

  const limitState = await checkLoginRateLimit({ identifier, ipAddress });
  if (limitState.isLimited) {
    return loginRedirect("too_many_attempts");
  }

  const user = await prisma.user.findUnique({
    where: { identifier },
    include: { credential: true },
  });

  if (!user || !user.credential) {
    await recordLoginAttempt({
      identifier,
      ipAddress,
      success: false,
      userId: null,
    });
    return loginRedirect("account_not_found");
  }

  if (!user.isActive) {
    await recordLoginAttempt({
      identifier,
      ipAddress,
      success: false,
      userId: user.id,
    });
    return loginRedirect("account_inactive");
  }

  const passwordOk = await verifyPassword(password, user.credential.passwordHash);

  if (!passwordOk) {
    await recordLoginAttempt({
      identifier,
      ipAddress,
      success: false,
      userId: user.id,
    });
    return loginRedirect("invalid_password");
  }

  await recordLoginAttempt({
    identifier,
    ipAddress,
    success: true,
    userId: user.id,
  });

  await createSession(user.id, {
    ipAddress,
    userAgent: request.headers.get("user-agent"),
  });

  return redirectTo("/feed");
}
