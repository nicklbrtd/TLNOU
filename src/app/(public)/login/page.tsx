import Link from "next/link";

const LOGIN_ERRORS: Record<string, string> = {
  invalid_identifier: "Неверный идентификационный номер.",
  invalid_password: "Неверный пароль.",
  account_not_found: "Аккаунт не найден.",
  account_inactive: "Аккаунт временно отключён.",
  too_many_attempts:
    "Слишком много попыток входа. Попробуйте снова чуть позже.",
  validation: "Проверьте корректность введённых данных.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? LOGIN_ERRORS[error] ?? LOGIN_ERRORS.validation : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-8 sm:px-8">
      <div className="grid w-full gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm sm:p-9">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            TLNOU DIGITAL SPACE
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            ТЛНОУ
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
            Закрытое пространство вашей учебной группы. Вход только для заранее
            созданных аккаунтов.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-[var(--text-muted)]">
            <li>• общая лента, посты и комментарии</li>
            <li>• личные каналы участников</li>
            <li>• архивная доска воспоминаний</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold">Вход в аккаунт</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Введите ID и пароль, которые выдал администратор.
          </p>

          {errorMessage ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
              {errorMessage}
            </p>
          ) : null}

          <form action="/api/auth/login" method="post" className="mt-5 space-y-4">
            <label className="block text-sm font-medium">
              Идентификационный номер
              <input
                name="identifier"
                inputMode="numeric"
                autoComplete="username"
                required
                minLength={3}
                maxLength={12}
                className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--accent)]"
                placeholder="Например: 1001"
              />
            </label>

            <label className="block text-sm font-medium">
              Пароль
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--accent)]"
                placeholder="Ваш пароль"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Войти
            </button>
          </form>

          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Нет доступа? Обратитесь к администратору вашей группы.
          </p>
          <Link href="/" className="mt-2 inline-block text-xs text-[var(--text-muted)]">
            На главную
          </Link>
        </section>
      </div>
    </main>
  );
}
