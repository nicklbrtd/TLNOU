import type { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { seeOther } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { postTextSchema } from "@/lib/validators/post";

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

  const formData = await request.formData();
  const parsed = postTextSchema.safeParse({
    text: formData.get("text"),
  });

  if (!parsed.success) {
    return seeOther(`/post/${postId}/edit?error=validation`);
  }

  await prisma.post.update({
    where: { id: postId },
    data: { text: parsed.data.text },
  });

  return seeOther("/feed?updated=1");
}
