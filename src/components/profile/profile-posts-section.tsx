import Link from "next/link";
import { Plus } from "lucide-react";

import { formatDateTime } from "@/lib/time";

interface ProfilePostItem {
  id: string;
  text: string | null;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  mediaCount: number;
}

interface ProfilePostsSectionProps {
  posts: ProfilePostItem[];
}

export function ProfilePostsSection({ posts }: ProfilePostsSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[20px] font-semibold tracking-tight text-[var(--text-primary)]">
          Мои публикации
        </h2>
        <Link
          href="/post/new"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[rgba(171,186,222,0.35)] bg-[rgba(247,250,255,0.84)] px-3 text-xs font-semibold text-[var(--text-primary)] shadow-[0_10px_18px_rgba(9,16,28,0.14)] transition hover:bg-[var(--card-muted)]"
        >
          <Plus className="h-4 w-4" />
          Создать пост
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)]/75 bg-[var(--card-muted)]/65 px-4 py-6 text-sm text-[var(--text-muted)]">
          У вас ещё нет публикаций. Создайте первую запись из профиля.
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-2xl border border-[rgba(164,183,222,0.3)] bg-[linear-gradient(160deg,rgba(249,252,255,0.92),rgba(239,245,255,0.94))] px-4 py-3 shadow-[0_12px_20px_rgba(8,15,28,0.12)]"
            >
              <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">
                {post.text || "Без текста"}
              </p>

              <p className="mt-2 text-xs text-[var(--text-muted)]">
                {formatDateTime(post.createdAt)} • медиа: {post.mediaCount} • лайки:{" "}
                {post.likesCount} • комментарии: {post.commentsCount}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <Link
                  href={`/post/${post.id}/edit`}
                  className="inline-flex h-8 items-center rounded-lg border border-[rgba(164,183,222,0.5)] px-3 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--card-muted)]"
                >
                  Редактировать
                </Link>
                <form action={`/api/posts/${post.id}/delete`} method="post">
                  <input type="hidden" name="returnTo" value="/profile" />
                  <button
                    type="submit"
                    className="inline-flex h-8 items-center rounded-lg border border-red-200 px-3 text-xs font-medium text-[var(--danger)] transition hover:bg-red-50"
                  >
                    Удалить
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
