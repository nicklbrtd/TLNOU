import Link from "next/link";

const POST_ERRORS: Record<string, string> = {
  validation: "Текст поста должен быть от 1 до 2000 символов.",
};

export default async function CreatePostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Новый пост</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          На этом этапе поддерживаем текстовые посты. Медиа добавим отдельным шагом.
        </p>
      </header>

      {params.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          {POST_ERRORS[params.error] ?? "Не удалось опубликовать пост."}
        </p>
      ) : null}

      <form action="/api/posts/create" method="post" className="space-y-3 rounded-2xl border border-[var(--line)] p-4">
        <textarea
          name="text"
          required
          minLength={1}
          maxLength={2000}
          rows={8}
          className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
          placeholder="Поделитесь мыслями с группой"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Опубликовать
          </button>
          <Link
            href="/feed"
            className="rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-medium"
          >
            Отмена
          </Link>
        </div>
      </form>
    </section>
  );
}
