import type { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { createUniqueChannelSlug } from "@/lib/channels/slug";
import { seeOther } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { createChannelSchema } from "@/lib/validators/channel";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return seeOther("/login");
  }

  const existingChannel = await prisma.channel.findUnique({
    where: { ownerId: user.id },
    select: { slug: true },
  });

  if (existingChannel) {
    return seeOther(`/channel/${existingChannel.slug}`);
  }

  const formData = await request.formData();
  const parsed = createChannelSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return seeOther("/channel/new?error=validation");
  }

  const slug = await createUniqueChannelSlug({
    title: parsed.data.title,
    fallbackSeed: user.identifier,
  });

  const channel = await prisma.channel.create({
    data: {
      ownerId: user.id,
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
    },
  });

  const chatRoom = await prisma.chatRoom.upsert({
    where: { slug: `channel-${channel.slug}` },
    update: {
      title: `Канал: ${channel.title}`,
      isActive: true,
      updatedAt: new Date(),
    },
    create: {
      slug: `channel-${channel.slug}`,
      title: `Канал: ${channel.title}`,
      isActive: true,
    },
  });

  await prisma.chatMember.upsert({
    where: {
      roomId_userId: {
        roomId: chatRoom.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      roomId: chatRoom.id,
      userId: user.id,
    },
  });

  return seeOther(`/channel/${channel.slug}?created=1`);
}
