import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

const EDIT_ERRORS: Record<string, string> = {
  validation: "Текст поста должен быть от 1 до 2000 символов.",
};

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { postId } = await params;
  const query = await searchParams;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      authorId: true,
      text: true,
      isDeleted: true,
      createdAt: true,
    },
  });

  if (!post || post.isDeleted) {
    notFound();
  }

  if (post.authorId !== user.id) {
    redirect("/forbidden");
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Редактирование поста</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Изменения сохранятся в ленте и в вашем профиле.
        </p>
      </header>

      {query.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          {EDIT_ERRORS[query.error] ?? "Не удалось сохранить изменения."}
        </p>
      ) : null}

      <form
        action={`/api/posts/${post.id}/update`}
        method="post"
        className="space-y-3 rounded-2xl border border-[var(--line)] p-4"
      >
        <textarea
          name="text"
          required
          minLength={1}
          maxLength={2000}
          rows={8}
          defaultValue={post.text ?? ""}
          className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Сохранить
          </button>
          <Link
            href="/feed"
            className="rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-medium"
          >
            Отмена
          </Link>
        </div>
      </form>

      <form action={`/api/posts/${post.id}/delete`} method="post">
        <input type="hidden" name="returnTo" value="/feed" />
        <button
          type="submit"
          className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-[var(--danger)] hover:bg-red-50"
        >
          Удалить пост
        </button>
      </form>
    </section>
  );
}
