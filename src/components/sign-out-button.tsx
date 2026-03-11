export function SignOutButton() {
  return (
    <form action="/api/auth/logout" method="post">
      <button
        type="submit"
        className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--card-muted)]"
      >
        Выйти
      </button>
    </form>
  );
}
