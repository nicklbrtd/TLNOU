import Link from "next/link";
import { Heart, MessageCircle, Radio } from "lucide-react";

import { Avatar } from "@/components/avatar";
import { PostOptionsMenu } from "@/components/home/post-options-menu";
import type { FeedItem, FeedMediaItem } from "@/components/home/types";
import { formatDateTime } from "@/lib/time";

interface FeedPostCardProps {
  item: FeedItem;
  currentUserId: string;
}

function FeedMediaStrip({ media }: { media: FeedMediaItem[] }) {
  if (media.length === 0) {
    return null;
  }

  return (
    <div className="-mx-0.5 mt-2.5 flex snap-x gap-2 overflow-x-auto px-0.5 pb-1.5">
      {media.map((asset) => (
        <div key={asset.id} className="w-[86%] shrink-0 snap-start overflow-hidden rounded-md bg-[#eaf0ec] sm:w-[320px]">
          {asset.type === "VIDEO" ? (
            <video
              src={asset.url}
              controls
              preload="metadata"
              className="h-full max-h-[300px] w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.url}
              alt="Медиа публикации"
              loading="lazy"
              className="h-full max-h-[300px] w-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function UserPostCard({
  item,
  currentUserId,
}: {
  item: Extract<FeedItem, { kind: "user" }>;
  currentUserId: string;
}) {
  return (
    <article className="bg-transparent px-4 py-3.5 sm:px-5 sm:py-4">
      <header className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={item.authorName} avatarUrl={item.authorAvatarUrl} size="sm" />
          <div className="min-w-0">
            <Link
              href={`/u/${item.authorId}`}
              className="block truncate text-[14px] font-semibold leading-5 text-[var(--text-primary)] hover:underline"
            >
              {item.authorName}
            </Link>
            <p className="truncate text-[12px] text-[var(--text-muted)]">
              {item.authorUsername ? `@${item.authorUsername}` : "без username"} · профиль
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <span className="text-[11px] text-[var(--text-muted)]">{formatDateTime(item.createdAt)}</span>
          {item.authorId === currentUserId ? (
            <PostOptionsMenu
              editHref={`/post/${item.id}/edit`}
              deleteAction={`/api/posts/${item.id}/delete`}
              returnTo="/feed"
            />
          ) : null}
        </div>
      </header>

      <p className="mt-2 whitespace-pre-wrap text-[15px] leading-6 text-[var(--text-primary)]">
        {item.text || "Без текста"}
      </p>

      <FeedMediaStrip media={item.media} />

      <div className="mt-2 flex items-center gap-4 text-[12px]">
        <form action={`/api/posts/${item.id}/like`} method="post">
          <button
            type="submit"
            className={`inline-flex h-8 items-center gap-1 rounded-md px-2.5 font-medium transition ${
              item.likedByMe
                ? "text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:bg-[var(--card-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            {item.likesCount}
          </button>
        </form>

        <span className="inline-flex h-8 items-center gap-1 text-[var(--text-muted)]">
          <MessageCircle className="h-3.5 w-3.5" />
          {item.commentsCount}
        </span>
      </div>

      {item.comments.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {item.comments.map((comment) => (
            <li key={comment.id} className="text-[13px] leading-5">
              <span className="font-semibold text-[var(--text-muted)]">{comment.authorName}: </span>
              <span className="text-[var(--text-primary)]">{comment.text}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <form action={`/api/posts/${item.id}/comment`} method="post" className="mt-2.5 flex items-center gap-2">
        <input
          name="text"
          required
          maxLength={300}
          className="h-9 w-full rounded-md border border-[var(--line)]/70 bg-white px-3 text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          placeholder="Комментарий..."
        />
        <button
          type="submit"
          className="h-9 rounded-md px-2.5 text-[12px] font-semibold text-[var(--accent)] transition hover:bg-[var(--card-muted)]"
        >
          Отпр.
        </button>
      </form>
    </article>
  );
}

function ChannelPostCard({ item }: { item: Extract<FeedItem, { kind: "channel" }> }) {
  return (
    <article className="bg-transparent px-4 py-3.5 sm:px-5 sm:py-4">
      <header className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent-soft)]/75 text-[var(--accent)]">
            <Radio className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <Link
              href={`/channel/${item.channelSlug}`}
              className="block truncate text-[14px] font-semibold leading-5 text-[var(--text-primary)] hover:underline"
            >
              {item.channelTitle}
            </Link>
            <p className="truncate text-[12px] text-[var(--text-muted)]">@{item.channelUsername} · канал</p>
          </div>
        </div>

        <span className="shrink-0 text-[11px] text-[var(--text-muted)]">
          {formatDateTime(item.createdAt)}
        </span>
      </header>

      <p className="mt-2 whitespace-pre-wrap text-[15px] leading-6 text-[var(--text-primary)]">
        {item.text || "Без текста"}
      </p>

      <FeedMediaStrip media={item.media} />

      <div className="mt-2 flex items-center gap-4 text-[12px]">
        <span className="inline-flex h-8 items-center gap-1 text-[var(--text-muted)]">
          <Heart className="h-3.5 w-3.5" />
          {item.likesCount}
        </span>

        <Link
          href={`/channel/${item.channelSlug}`}
          className="inline-flex h-8 items-center rounded-md px-2.5 font-semibold text-[var(--accent)] transition hover:bg-[var(--card-muted)]"
        >
          Открыть
        </Link>
      </div>
    </article>
  );
}

export function FeedPostCard({ item, currentUserId }: FeedPostCardProps) {
  if (item.kind === "channel") {
    return <ChannelPostCard item={item} />;
  }

  return <UserPostCard item={item} currentUserId={currentUserId} />;
}
