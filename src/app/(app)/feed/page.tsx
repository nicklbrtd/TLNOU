import { FeedList } from "@/components/home/feed-list";
import { HomeHeader } from "@/components/home/home-header";
import type {
  ChannelFeedItem,
  SearchChannelResult,
  SearchUserResult,
  UserFeedItem,
} from "@/components/home/types";
import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

const FEED_MESSAGES: Record<string, string> = {
  posted: "Пост опубликован.",
  updated: "Пост обновлён.",
  deleted: "Пост удалён.",
  post_not_found: "Пост не найден или уже удалён.",
};

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function feedScore(item: UserFeedItem | ChannelFeedItem) {
  const jitter = ((hashString(`${item.kind}:${item.id}`) % 19) - 9) * 2 * 60 * 1000;
  const sourceBoost = item.kind === "channel" ? 7 * 60 * 1000 : 0;
  return item.createdAt.getTime() + jitter + sourceBoost;
}

function buildFeedMix(items: Array<UserFeedItem | ChannelFeedItem>) {
  return [...items].sort((a, b) => feedScore(b) - feedScore(a));
}

function normalizeHandle(query: string) {
  return query.trim().toLowerCase().replace(/^@+/, "");
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{
    posted?: string;
    updated?: string;
    deleted?: string;
    error?: string;
    comment_error?: string;
    q?: string;
  }>;
}) {
  const user = await requireUser();
  const query = await searchParams;
  const searchQuery = (query.q ?? "").trim();
  const normalizedHandle = normalizeHandle(searchQuery);

  const userSearchConditions: object[] = [];
  if (searchQuery) {
    userSearchConditions.push({ identifier: { contains: searchQuery } });
    userSearchConditions.push({
      profile: { displayName: { contains: searchQuery, mode: "insensitive" } },
    });

    if (normalizedHandle) {
      userSearchConditions.push({
        profile: { username: { contains: normalizedHandle, mode: "insensitive" } },
      });
    }
  }

  const channelSearchConditions: object[] = [];
  if (searchQuery) {
    channelSearchConditions.push({
      title: { contains: searchQuery, mode: "insensitive" },
    });
    if (normalizedHandle) {
      channelSearchConditions.push({
        slug: { contains: normalizedHandle, mode: "insensitive" },
      });
    }
  }

  const [userPosts, channelPosts, usersFound, channelsFound] = await Promise.all([
    prisma.post.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 32,
      include: {
        author: {
          include: {
            profile: { select: { displayName: true, username: true, avatarUrl: true } },
          },
        },
        media: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, url: true, type: true },
        },
        likes: {
          where: { userId: user.id },
          select: { id: true },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          take: 2,
          include: {
            author: {
              include: {
                profile: { select: { displayName: true } },
              },
            },
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.channelPost.findMany({
      where: {
        channel: {
          OR: [{ ownerId: user.id }, { subscribers: { some: { userId: user.id } } }],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 32,
      include: {
        channel: {
          select: { slug: true, title: true },
        },
        media: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, url: true, type: true },
        },
        _count: { select: { likes: true } },
      },
    }),
    userSearchConditions.length > 0
      ? prisma.user.findMany({
          where: {
            isActive: true,
            OR: userSearchConditions,
          },
          take: 8,
          include: {
            profile: {
              select: { displayName: true, username: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    channelSearchConditions.length > 0
      ? prisma.channel.findMany({
          where: {
            isActive: true,
            OR: channelSearchConditions,
          },
          take: 8,
          select: {
            id: true,
            slug: true,
            title: true,
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const normalizedUsers: UserFeedItem[] = userPosts.map((post) => ({
    kind: "user",
    id: post.id,
    createdAt: post.createdAt,
    authorId: post.authorId,
    authorName: post.author.profile?.displayName ?? `ID ${post.author.identifier}`,
    authorUsername: post.author.profile?.username ?? null,
    authorAvatarUrl: post.author.profile?.avatarUrl ?? null,
    text: post.text,
    media: post.media,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    likedByMe: post.likes.length > 0,
    comments: [...post.comments].reverse().map((comment) => ({
      id: comment.id,
      text: comment.text,
      authorName: comment.author.profile?.displayName ?? `ID ${comment.author.identifier}`,
    })),
  }));

  const normalizedChannelPosts: ChannelFeedItem[] = channelPosts.map((post) => ({
    kind: "channel",
    id: post.id,
    createdAt: post.createdAt,
    channelSlug: post.channel.slug,
    channelTitle: post.channel.title,
    channelUsername: post.channel.slug,
    text: post.text,
    media: post.media,
    likesCount: post._count.likes,
  }));

  const feedItems = buildFeedMix([...normalizedUsers, ...normalizedChannelPosts]).slice(0, 42);

  const searchUsers: SearchUserResult[] = usersFound.map((entry) => ({
    id: entry.id,
    identifier: entry.identifier,
    displayName: entry.profile?.displayName ?? `ID ${entry.identifier}`,
    username: entry.profile?.username ?? null,
    avatarUrl: entry.profile?.avatarUrl ?? null,
  }));

  const searchChannels: SearchChannelResult[] = channelsFound.map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    username: entry.slug,
  }));

  const bannerMessage =
    (query.posted && FEED_MESSAGES.posted) ||
    (query.updated && FEED_MESSAGES.updated) ||
    (query.deleted && FEED_MESSAGES.deleted) ||
    (query.error ? FEED_MESSAGES[query.error] : null);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-2 sm:space-y-3">
      <div className="space-y-2 sm:space-y-3">
        <HomeHeader searchQuery={searchQuery} users={searchUsers} channels={searchChannels} />

        {bannerMessage ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {bannerMessage}
          </p>
        ) : null}

        {query.comment_error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
            Комментарий должен быть от 1 до 300 символов.
          </p>
        ) : null}

        <FeedList items={feedItems} currentUserId={user.id} />
      </div>
    </section>
  );
}
