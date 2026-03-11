import Link from "next/link";

import { requireUser } from "@/lib/auth/guards";

const CHANNEL_ERRORS: Record<string, string> = {
  validation: "Проверьте название и описание канала.",
};

export default async function NewChannelPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const query = await searchParams;

  if (user.ownedChannel) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Канал уже создан</h1>
        <p className="text-sm text-[var(--text-muted)]">
          У пользователя может быть только один канал.
        </p>
        <Link
          href={`/channel/${user.ownedChannel.slug}`}
          className="inline-flex rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Перейти в канал
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Создать канал</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          После создания канал автоматически появится в разделе «Чаты» у владельца.
        </p>
      </header>

      {query.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          {CHANNEL_ERRORS[query.error] ?? "Не удалось создать канал."}
        </p>
      ) : null}

      <form action="/api/channels/create" method="post" className="space-y-3 rounded-2xl border border-[var(--line)] p-4">
        <label className="block text-sm font-medium">
          Название канала
          <input
            name="title"
            required
            minLength={2}
            maxLength={80}
            className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
            placeholder="Например: Новости 3ФВТ"
          />
        </label>

        <label className="block text-sm font-medium">
          Описание
          <textarea
            name="description"
            rows={4}
            maxLength={1000}
            className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
            placeholder="Что публикуется в канале"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Создать канал
          </button>
          <Link
            href="/profile"
            className="rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-medium"
          >
            Отмена
          </Link>
        </div>
      </form>
    </section>
  );
}
