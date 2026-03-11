import type { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { getSafeReturnPath, seeOther } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return seeOther("/login");
  }

  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, isDeleted: true },
  });

  if (!post || post.isDeleted) {
    return seeOther("/feed?error=post_not_found");
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: user.id,
      },
    },
    select: { id: true },
  });

  if (existingLike) {
    await prisma.postLike.delete({
      where: {
        postId_userId: {
          postId,
          userId: user.id,
        },
      },
    });
  } else {
    await prisma.postLike.create({
      data: {
        postId,
        userId: user.id,
      },
    });
  }

  return seeOther(getSafeReturnPath(request, "/feed"));
}
