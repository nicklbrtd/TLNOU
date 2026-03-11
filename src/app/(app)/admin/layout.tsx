import Link from "next/link";

import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-[var(--line)] bg-[var(--card-muted)] p-4">
        <h1 className="text-2xl font-semibold">Admin Area</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Управление аккаунтами и архивным разделом.
        </p>
        <div className="mt-3 flex gap-2 text-sm">
          <Link href="/admin/users" className="rounded-xl border border-[var(--line)] px-3 py-2">
            Пользователи
          </Link>
          <Link href="/admin/memory" className="rounded-xl border border-[var(--line)] px-3 py-2">
            Доска воспоминаний
          </Link>
        </div>
      </header>
      {children}
    </section>
  );
}
