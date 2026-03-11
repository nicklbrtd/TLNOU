import type { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { seeOther } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { postTextSchema } from "@/lib/validators/post";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return seeOther("/login");
  }

  const formData = await request.formData();
  const parsed = postTextSchema.safeParse({
    text: formData.get("text"),
  });

  if (!parsed.success) {
    return seeOther("/post/new?error=validation");
  }

  await prisma.post.create({
    data: {
      authorId: user.id,
      text: parsed.data.text,
    },
  });

  return seeOther("/feed?posted=1");
}
