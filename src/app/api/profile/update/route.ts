import type { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validators/profile";

function redirectTo(path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: path,
    },
  });
}

export async function POST(request: NextRequest) {
  const authUser = await getCurrentUser();

  if (!authUser) {
    return redirectTo("/login");
  }

  const formData = await request.formData();
  const parsed = updateProfileSchema.safeParse({
    username: formData.get("username"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    return redirectTo("/profile/edit?error=validation");
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      profile: {
        select: {
          displayName: true,
          age: true,
          birthDate: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!user) {
    return redirectTo("/login");
  }

  try {
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: parsed.data,
      create: {
        userId: user.id,
        displayName: user.profile?.displayName ?? `ID ${user.identifier}`,
        age: user.profile?.age ?? null,
        birthDate: user.profile?.birthDate ?? null,
        avatarUrl: user.profile?.avatarUrl ?? null,
        ...parsed.data,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return redirectTo("/profile/edit?error=username_taken");
    }

    return redirectTo("/profile/edit?error=validation");
  }

  return redirectTo("/profile/edit?saved=1");
}
