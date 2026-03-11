import Link from "next/link";
import { Heart, MessageCircle, Pencil, Radio, Trash2, UserRound } from "lucide-react";

import { Avatar } from "@/components/avatar";
import type { FeedItem, FeedMediaItem } from "@/components/home/types";
import { formatDateTime } from "@/lib/time";

interface FeedPostCardProps {
  item: FeedItem;
  currentUserId: string;
}

function FeedMediaGrid({ media }: { media: FeedMediaItem[] }) {
  if (media.length === 0) {
    return null;
  }

  const visibleMedia = media.slice(0, 3);
  const remaining = media.length - visibleMedia.length;

  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {visibleMedia.map((asset) => (
        <div
          key={asset.id}
          className="overflow-hidden rounded-2xl border border-[var(--line)]/75 bg-[var(--card-muted)]"
        >
          {asset.type === "VIDEO" ? (
            <video
              src={asset.url}
              controls
              preload="metadata"
              className="h-full max-h-[340px] w-full object-cover"
            />
          ) : (
            <img
              src={asset.url}
              alt="Медиа публикации"
              loading="lazy"
              className="h-full max-h-[340px] w-full object-cover"
            />
          )}
        </div>
      ))}

      {remaining > 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-[var(--line)]/75 bg-[var(--card-muted)] text-sm font-semibold text-[var(--text-muted)]">
          +{remaining} ещё
        </div>
      ) : null}
    </div>
  );
}

export function FeedPostCard({ item, currentUserId }: FeedPostCardProps) {
  if (item.kind === "channel") {
    return (
      <article className="rounded-3xl border border-[var(--line)]/70 bg-white/94 px-4 py-3.5 shadow-[0_10px_26px_rgba(22,31,27,0.06)] sm:px-5">
        <header className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)]/75 bg-[var(--accent-soft)]/70 text-[var(--accent)]">
                <Radio className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                  {item.channelTitle}
                </p>
                <p className="truncate text-xs text-[var(--text-muted)]">
                  Канал • @{item.channelUsername}
                </p>
              </div>
            </div>
          </div>
          <span className="shrink-0 text-xs text-[var(--text-muted)]">
            {formatDateTime(item.createdAt)}
          </span>
        </header>

        <p className="mt-3 whitespace-pre-wrap text-[15px] leading-6 text-[var(--text-primary)]">
          {item.text || "Без текста"}
        </p>

        <FeedMediaGrid media={item.media} />

        <div className="mt-3 flex items-center justify-between border-t border-[var(--line)]/65 pt-2.5">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-muted)]">
            <Heart className="h-3.5 w-3.5" />
            Лайки: {item.likesCount}
          </span>
          <Link
            href={`/channel/${item.channelSlug}`}
            className="rounded-xl border border-[var(--line)]/80 px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition hover:bg-[var(--card-muted)]"
          >
            Открыть канал
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-3xl border border-[var(--line)]/70 bg-white/95 px-4 py-3.5 shadow-[0_10px_26px_rgba(22,31,27,0.06)] sm:px-5">
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar
            name={item.authorName}
            avatarUrl={item.authorAvatarUrl}
            size="md"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/u/${item.authorId}`}
                className="truncate text-sm font-semibold text-[var(--text-primary)] hover:underline"
              >
                {item.authorName}
              </Link>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--card-muted)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
                <UserRound className="h-3 w-3" />
                Профиль
              </span>
            </div>
            <p className="truncate text-xs text-[var(--text-muted)]">
              {item.authorUsername ? `@${item.authorUsername}` : `ID ${item.authorId.slice(-6)}`}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-xs text-[var(--text-muted)]">
          {formatDateTime(item.createdAt)}
        </span>
      </header>

      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-6 text-[var(--text-primary)]">
        {item.text || "Без текста"}
      </p>

      <FeedMediaGrid media={item.media} />

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--line)]/65 pt-2.5">
        <form action={`/api/posts/${item.id}/like`} method="post">
          <button
            type="submit"
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              item.likedByMe
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--line)]/80 text-[var(--text-muted)] hover:bg-[var(--card-muted)]"
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            {item.likesCount}
          </button>
        </form>

        <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
          <MessageCircle className="h-3.5 w-3.5" />
          {item.commentsCount}
        </span>

        {item.authorId === currentUserId ? (
          <div className="ml-auto flex items-center gap-2">
            <Link
              href={`/post/${item.id}/edit`}
              className="inline-flex items-center gap-1 rounded-xl border border-[var(--line)]/80 px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--card-muted)]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Редактировать
            </Link>
            <form action={`/api/posts/${item.id}/delete`} method="post">
              <input type="hidden" name="returnTo" value="/feed" />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-[var(--danger)] transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Удалить
              </button>
            </form>
          </div>
        ) : null}
      </div>

      <div className="mt-3 space-y-1.5">
        {item.comments.length > 0 ? (
          item.comments.map((comment) => (
            <div key={comment.id} className="rounded-xl bg-[var(--card-muted)] px-3 py-2">
              <p className="text-xs font-semibold text-[var(--text-muted)]">{comment.authorName}</p>
              <p className="mt-0.5 text-sm text-[var(--text-primary)]">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="px-1 text-xs text-[var(--text-muted)]">Комментариев пока нет.</p>
        )}
      </div>

      <form
        action={`/api/posts/${item.id}/comment`}
        method="post"
        className="mt-3 flex items-center gap-2"
      >
        <input
          name="text"
          required
          maxLength={300}
          className="h-10 w-full rounded-xl border border-[var(--line)]/80 bg-[var(--card)] px-3 text-sm"
          placeholder="Написать комментарий..."
        />
        <button
          type="submit"
          className="h-10 rounded-xl bg-[var(--accent)] px-3 text-xs font-semibold text-white"
        >
          Отправить
        </button>
      </form>
    </article>
  );
}
