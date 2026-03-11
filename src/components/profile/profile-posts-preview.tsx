import Link from "next/link";

import { formatDateTime } from "@/lib/time";

interface ProfilePostItem {
  id: string;
  text: string | null;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
}

interface ProfilePostsPreviewProps {
  posts: ProfilePostItem[];
}

export function ProfilePostsPreview({ posts }: ProfilePostsPreviewProps) {
  if (posts.length === 0) {
    return <p className="text-sm text-[var(--text-muted)]">Вы ещё не публиковали посты.</p>;
  }

  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li key={post.id} className="rounded-2xl border border-[var(--line)]/75 bg-[var(--card-muted)] px-4 py-3">
          <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">
            {post.text || "Без текста"}
          </p>

          <p className="mt-2 text-xs text-[var(--text-muted)]">
            {formatDateTime(post.createdAt)} • лайки: {post.likesCount} • комментарии: {post.commentsCount}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/post/${post.id}/edit`}
              className="inline-flex h-8 items-center rounded-full border border-[var(--line)] bg-white px-3 text-xs font-medium text-[var(--text-primary)] transition hover:bg-[var(--card)]"
            >
              Редактировать
            </Link>

            <form action={`/api/posts/${post.id}/delete`} method="post">
              <input type="hidden" name="returnTo" value="/profile" />
              <button
                type="submit"
                className="inline-flex h-8 items-center rounded-full border border-red-200 bg-white px-3 text-xs font-medium text-[var(--danger)] transition hover:bg-red-50"
              >
                Удалить
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
