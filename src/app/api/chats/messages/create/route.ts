import type { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { getSafeReturnPath, seeOther } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { createChatMessageSchema } from "@/lib/validators/chat";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return seeOther("/login");
  }

  const formData = await request.formData();
  const parsed = createChatMessageSchema.safeParse({
    roomId: formData.get("roomId"),
    text: formData.get("text"),
  });

  const fallbackPath = getSafeReturnPath(request, "/chats");
  if (!parsed.success) {
    return seeOther(
      fallbackPath.includes("?")
        ? `${fallbackPath}&error=validation`
        : `${fallbackPath}?error=validation`,
    );
  }

  const successPath = fallbackPath.startsWith("/chats")
    ? fallbackPath
    : `/chats?room=${parsed.data.roomId}`;

  const membership = await prisma.chatMember.findUnique({
    where: {
      roomId_userId: {
        roomId: parsed.data.roomId,
        userId: user.id,
      },
    },
    select: { id: true },
  });

  if (!membership) {
    return seeOther("/forbidden");
  }

  await prisma.chatMessage.create({
    data: {
      roomId: parsed.data.roomId,
      authorId: user.id,
      text: parsed.data.text,
    },
  });

  await prisma.chatRoom.update({
    where: { id: parsed.data.roomId },
    data: { updatedAt: new Date() },
  });

  await prisma.chatMember.update({
    where: {
      roomId_userId: {
        roomId: parsed.data.roomId,
        userId: user.id,
      },
    },
    data: {
      lastReadAt: new Date(),
    },
  });

  return seeOther(successPath);
}
