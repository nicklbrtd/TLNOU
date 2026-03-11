import type { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { getSafeReturnPath, seeOther } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { commentTextSchema } from "@/lib/validators/post";

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

  const formData = await request.formData();
  const parsed = commentTextSchema.safeParse({
    text: formData.get("text"),
  });

  const returnTo = getSafeReturnPath(request, "/feed");

  if (!parsed.success) {
    return seeOther(returnTo.includes("?") ? `${returnTo}&comment_error=1` : `${returnTo}?comment_error=1`);
  }

  await prisma.postComment.create({
    data: {
      postId,
      authorId: user.id,
      text: parsed.data.text,
    },
  });

  return seeOther(returnTo);
}
