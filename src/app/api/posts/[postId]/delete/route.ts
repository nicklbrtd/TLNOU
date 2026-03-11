import type { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { coerceSafePath, getSafeReturnPath, seeOther } from "@/lib/http";
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
    select: { id: true, authorId: true, isDeleted: true },
  });

  if (!post || post.isDeleted) {
    return seeOther("/feed?error=post_not_found");
  }

  if (post.authorId !== user.id) {
    return seeOther("/forbidden");
  }

  await prisma.post.update({
    where: { id: postId },
    data: { isDeleted: true },
  });

  const formData = await request.formData();
  const returnToRaw = formData.get("returnTo");
  const fallback = getSafeReturnPath(request, "/feed");
  const returnTo = coerceSafePath(returnToRaw, fallback);

  return seeOther(returnTo.includes("?") ? `${returnTo}&deleted=1` : `${returnTo}?deleted=1`);
}
