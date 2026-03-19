import Link from "next/link";
import { PencilLine } from "lucide-react";

import { Avatar } from "@/components/avatar";
import { formatDate } from "@/lib/time";

interface CompactProfileCardProps {
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  age: number | null;
  birthDate: Date | null;
}

export function CompactProfileCard({
  displayName,
  username,
  avatarUrl,
  bio,
  age,
  birthDate,
}: CompactProfileCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-[rgba(151,169,207,0.3)] bg-[linear-gradient(160deg,rgba(248,251,255,0.94)_0%,rgba(238,244,255,0.95)_100%)] px-4 py-4 shadow-[0_20px_36px_rgba(7,13,24,0.24)] sm:px-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(193,55,63,0.22),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(54,91,166,0.18),transparent_72%)] blur-2xl" />
      <Link
        href="/profile/edit"
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[rgba(160,180,220,0.35)] bg-[rgba(255,255,255,0.7)] text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
        aria-label="Редактировать профиль"
      >
        <PencilLine className="h-4 w-4" />
      </Link>

      <div className="relative flex items-center gap-3">
        <Avatar name={displayName} avatarUrl={avatarUrl} size="lg" />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {displayName}
          </h1>
          <p className="truncate text-sm text-[var(--text-muted)]">
            {username ? `@${username}` : "Добавьте username в профиле"}
          </p>
        </div>
      </div>

      <p className="relative mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">
        {bio || "Добавьте короткий bio, чтобы профиль выглядел живым и личным."}
      </p>

      <div className="relative mt-3 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
        <span className="rounded-full border border-[rgba(164,181,217,0.35)] bg-[rgba(255,255,255,0.72)] px-2.5 py-1">
          Возраст: {age ?? "—"}
        </span>
        <span className="rounded-full border border-[rgba(164,181,217,0.35)] bg-[rgba(255,255,255,0.72)] px-2.5 py-1">
          Дата рождения: {birthDate ? formatDate(birthDate) : "—"}
        </span>
      </div>
    </article>
  );
}
