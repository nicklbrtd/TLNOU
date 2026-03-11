import type { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { AvatarUploadError, saveAvatarImage } from "@/lib/uploads/avatar";
import { createMemberSchema } from "@/lib/validators/auth";

export const runtime = "nodejs";

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

  if (authUser.role !== "ADMIN") {
    return redirectTo("/forbidden");
  }

  const formData = await request.formData();
  const avatarInput = formData.get("avatar");

  const parsed = createMemberSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    age: formData.get("age"),
    birthDate: formData.get("birthDate"),
    role: formData.get("role") || "USER",
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    return redirectTo("/admin/users?error=validation");
  }

  const { identifier, password, displayName, username, age, birthDate, role, bio } =
    parsed.data;

  const existing = await prisma.user.findUnique({
    where: { identifier },
    select: { id: true },
  });

  if (existing) {
    return redirectTo("/admin/users?error=identifier_taken");
  }

  let avatarUrl: string | null = null;
  if (avatarInput instanceof File && avatarInput.size > 0) {
    try {
      avatarUrl = await saveAvatarImage(avatarInput);
    } catch (error) {
      if (error instanceof AvatarUploadError) {
        return redirectTo(`/admin/users?error=${error.code}`);
      }

      return redirectTo("/admin/users?error=avatar_upload_failed");
    }
  }

  const passwordHash = await hashPassword(password);

  try {
    await prisma.user.create({
      data: {
        identifier,
        role,
        credential: {
          create: {
            passwordHash,
          },
        },
        profile: {
          create: {
            displayName,
            username: username ?? null,
            age: age ?? null,
            birthDate: birthDate ?? null,
            bio: bio || null,
            avatarUrl,
          },
        },
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return redirectTo("/admin/users?error=username_taken");
    }

    return redirectTo("/admin/users?error=validation");
  }

  return redirectTo("/admin/users?created=1");
}
