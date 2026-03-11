import Link from "next/link";

import { Avatar } from "@/components/avatar";
import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/time";

const PROFILE_ERRORS: Record<string, string> = {
  validation: "Проверьте заполнение полей и попробуйте снова.",
  username_taken: "Этот username уже занят. Выберите другой.",
};

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-[var(--line)]/75 bg-[var(--card-muted)] px-4 py-3.5">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          Редактирование профиля
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Можно менять только username и bio. Имя, возраст и дату рождения задаёт администратор.
        </p>
      </header>

      <article className="rounded-2xl border border-[var(--line)]/75 bg-white px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar
            name={profile?.displayName ?? `ID ${user.identifier}`}
            avatarUrl={profile?.avatarUrl}
            size="lg"
          />

          <div className="text-sm">
            <p className="font-semibold text-[var(--text-primary)]">
              {profile?.displayName ?? `ID ${user.identifier}`}
            </p>
            <p className="text-[var(--text-muted)]">ID: {user.identifier}</p>
            <p className="text-[var(--text-muted)]">
              Возраст: {profile?.age ?? "—"} • ДР:{" "}
              {profile?.birthDate ? formatDate(profile.birthDate) : "—"}
            </p>
          </div>
        </div>
      </article>

      {params.saved ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Профиль сохранён.
        </p>
      ) : null}

      {params.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          {PROFILE_ERRORS[params.error] ?? "Не удалось сохранить профиль."}
        </p>
      ) : null}

      <form
        action="/api/profile/update"
        method="post"
        className="space-y-4 rounded-2xl border border-[var(--line)]/75 bg-white p-4"
      >
        <label className="block text-sm font-medium">
          Username
          <div className="mt-1 flex items-center rounded-xl border border-[var(--line)] bg-[var(--card)] px-3">
            <span className="text-sm text-[var(--text-muted)]">@</span>
            <input
              name="username"
              defaultValue={profile?.username ?? ""}
              minLength={3}
              maxLength={24}
              pattern="[a-z0-9_]{3,24}"
              className="w-full bg-transparent px-1 py-2 text-sm outline-none"
              placeholder="nikita_3fvt"
            />
          </div>
          <span className="mt-1 block text-xs text-[var(--text-muted)]">
            3-24 символа: `a-z`, `0-9`, `_`
          </span>
        </label>

        <label className="block text-sm font-medium">
          Bio
          <textarea
            name="bio"
            rows={4}
            defaultValue={profile?.bio ?? ""}
            maxLength={280}
            className="mt-1 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
            placeholder="Коротко о себе"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Сохранить
          </button>
          <Link
            href="/profile"
            className="rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-medium"
          >
            Назад в профиль
          </Link>
        </div>
      </form>
    </section>
  );
}
