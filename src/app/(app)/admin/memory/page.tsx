import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminMemoryPage() {
  const entries = await prisma.memoryBoardEntry.findMany({
    orderBy: [{ isPinned: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: 40,
  });

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Управление доской воспоминаний</h2>
        <Link
          href="/memory"
          className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-medium"
        >
          Открыть публичный раздел
        </Link>
      </header>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card-muted)] p-4 text-sm text-[var(--text-muted)]">
        Stage 4: добавим полноценный CRUD для записей архива с загрузкой фото.
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">Записей пока нет.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-xl border border-[var(--line)] p-3">
              <p className="font-medium">{entry.fullName}</p>
              <p className="text-sm text-[var(--text-muted)]">{entry.subtitle || "Без подписи"}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
