import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-10">
      <section className="w-full rounded-3xl border border-[var(--line)] bg-[var(--card)] p-8 shadow-sm">
        <p className="font-mono text-sm text-[var(--text-muted)]">404</p>
        <h1 className="mt-3 text-2xl font-semibold">Страница не найдена</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Возможно, ссылка устарела или была удалена.
        </p>
        <Link
          href="/feed"
          className="mt-5 inline-flex rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Вернуться в ленту
        </Link>
      </section>
    </main>
  );
}
