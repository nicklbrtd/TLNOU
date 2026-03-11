import { prisma } from "@/lib/prisma";

export default async function MemoryBoardPage() {
  const entries = await prisma.memoryBoardEntry.findMany({
    orderBy: [{ isPinned: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      media: {
        select: {
          url: true,
          caption: true,
          type: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-[var(--line)] bg-[var(--card-muted)] p-4">
        <h1 className="text-2xl font-semibold">Доска воспоминаний</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Отдельный архивный раздел для бывших участников и тёплых историй.
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card-muted)] px-4 py-8 text-sm text-[var(--text-muted)]">
          В архиве пока нет записей. Администратор может добавить их в разделе админки.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-[var(--line)] p-4">
              <h2 className="text-lg font-semibold">{entry.fullName}</h2>
              {entry.subtitle ? (
                <p className="mt-1 text-sm text-[var(--text-muted)]">{entry.subtitle}</p>
              ) : null}
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{entry.story}</p>
              {entry.media.length > 0 ? (
                <p className="mt-3 text-xs text-[var(--text-muted)]">
                  Медиа: {entry.media.length}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
