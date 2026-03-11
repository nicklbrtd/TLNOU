import { subMinutes } from "@/lib/time";
import { prisma } from "@/lib/prisma";
import {
  RATE_LIMIT_MAX_IDENTIFIER,
  RATE_LIMIT_MAX_IP,
  RATE_LIMIT_WINDOW_MINUTES,
} from "@/lib/auth/constants";

interface LoginRateInput {
  identifier: string;
  ipAddress?: string | null;
}

export async function checkLoginRateLimit({
  identifier,
  ipAddress,
}: LoginRateInput) {
  const since = subMinutes(new Date(), RATE_LIMIT_WINDOW_MINUTES);

  const [byIdentifier, byIp] = await Promise.all([
    prisma.loginAttempt.count({
      where: {
        identifier,
        success: false,
        createdAt: { gte: since },
      },
    }),
    ipAddress
      ? prisma.loginAttempt.count({
          where: {
            ipAddress,
            success: false,
            createdAt: { gte: since },
          },
        })
      : Promise.resolve(0),
  ]);

  return {
    isLimited:
      byIdentifier >= RATE_LIMIT_MAX_IDENTIFIER || byIp >= RATE_LIMIT_MAX_IP,
    remainingIdentifier: Math.max(RATE_LIMIT_MAX_IDENTIFIER - byIdentifier, 0),
    remainingIp: Math.max(RATE_LIMIT_MAX_IP - byIp, 0),
  };
}

interface LoginAttemptInput {
  userId?: string | null;
  identifier: string;
  ipAddress?: string | null;
  success: boolean;
}

export async function recordLoginAttempt({
  userId,
  identifier,
  ipAddress,
  success,
}: LoginAttemptInput) {
  await prisma.loginAttempt.create({
    data: {
      userId: userId ?? null,
      identifier,
      ipAddress: ipAddress ?? null,
      success,
    },
  });
}
