import type { AuthUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

import type { ChatListItemData, ChatRoomViewData } from "@/components/chats/types";

function isPinnedSlug(slug: string) {
  return slug === "3fvt-vazhnoe";
}

export async function ensureCoreChatRoomsForUser(user: AuthUser) {
  const importantRoom = await prisma.chatRoom.upsert({
    where: { slug: "3fvt-vazhnoe" },
    update: {
      title: "3ФВТ ВАЖНОЕ",
      isActive: true,
    },
    create: {
      slug: "3fvt-vazhnoe",
      title: "3ФВТ ВАЖНОЕ",
      isActive: true,
    },
  });

  await prisma.chatMember.upsert({
    where: {
      roomId_userId: {
        roomId: importantRoom.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      roomId: importantRoom.id,
      userId: user.id,
    },
  });

  if (user.ownedChannel) {
    const channelRoom = await prisma.chatRoom.upsert({
      where: { slug: `channel-${user.ownedChannel.slug}` },
      update: {
        title: `Канал: ${user.ownedChannel.title}`,
        isActive: true,
      },
      create: {
        slug: `channel-${user.ownedChannel.slug}`,
        title: `Канал: ${user.ownedChannel.title}`,
        isActive: true,
      },
    });

    await prisma.chatMember.upsert({
      where: {
        roomId_userId: {
          roomId: channelRoom.id,
          userId: user.id,
        },
      },
      update: {},
      create: {
        roomId: channelRoom.id,
        userId: user.id,
      },
    });
  }
}

export async function getChatsForUser(userId: string, searchQuery: string) {
  const memberships = await prisma.chatMember.findMany({
    where: {
      userId,
      room: { isActive: true },
    },
    include: {
      room: {
        select: {
          id: true,
          slug: true,
          title: true,
          updatedAt: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              text: true,
              createdAt: true,
              author: {
                select: {
                  identifier: true,
                  profile: { select: { displayName: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  const unreadCounts = await Promise.all(
    memberships.map((membership) =>
      prisma.chatMessage.count({
        where: {
          roomId: membership.roomId,
          authorId: { not: userId },
          ...(membership.lastReadAt
            ? { createdAt: { gt: membership.lastReadAt } }
            : {}),
        },
      }),
    ),
  );

  const baseChats: ChatListItemData[] = memberships
    .map((membership, index) => {
      const latest = membership.room.messages[0] ?? null;

      return {
        roomId: membership.room.id,
        slug: membership.room.slug,
        title: membership.room.title,
        isPinned: isPinnedSlug(membership.room.slug),
        latestMessageText: latest?.text ?? null,
        latestMessageAuthor: latest
          ? latest.author.profile?.displayName ?? `ID ${latest.author.identifier}`
          : null,
        latestAt: latest?.createdAt ?? null,
        unreadCount: unreadCounts[index] ?? 0,
      };
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      const aTime = a.latestAt?.getTime() ?? 0;
      const bTime = b.latestAt?.getTime() ?? 0;
      return bTime - aTime;
    });

  const queryNormalized = searchQuery.trim().toLowerCase();

  if (!queryNormalized) {
    return baseChats;
  }

  return baseChats.filter((chat) => {
    if (chat.isPinned) {
      return true;
    }

    const titleMatch = chat.title.toLowerCase().includes(queryNormalized);
    const previewMatch = (chat.latestMessageText ?? "")
      .toLowerCase()
      .includes(queryNormalized);

    return titleMatch || previewMatch;
  });
}

export async function getRoomForUser(userId: string, roomId: string) {
  const member = await prisma.chatMember.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId,
      },
    },
    include: {
      room: {
        include: {
          members: { select: { id: true } },
          messages: {
            orderBy: { createdAt: "asc" },
            take: 200,
            select: {
              id: true,
              text: true,
              createdAt: true,
              authorId: true,
              author: {
                select: {
                  identifier: true,
                  profile: {
                    select: {
                      displayName: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!member || !member.room.isActive) {
    return null;
  }

  const room: ChatRoomViewData = {
    roomId: member.room.id,
    title: member.room.title,
    isPinned: isPinnedSlug(member.room.slug),
    membersCount: member.room.members.length,
    messages: member.room.messages.map((message) => ({
      id: message.id,
      text: message.text,
      createdAt: message.createdAt,
      authorId: message.authorId,
      authorName:
        message.author.profile?.displayName ?? `ID ${message.author.identifier}`,
      authorAvatarUrl: message.author.profile?.avatarUrl ?? null,
    })),
  };

  await prisma.chatMember.update({
    where: {
      roomId_userId: {
        roomId,
        userId,
      },
    },
    data: { lastReadAt: new Date() },
  });

  return room;
}

export function getDefaultRoomId(chats: ChatListItemData[]) {
  return chats.find((chat) => chat.isPinned)?.roomId ?? chats[0]?.roomId ?? null;
}
