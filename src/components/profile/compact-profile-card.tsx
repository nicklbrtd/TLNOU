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
    <article className="relative rounded-3xl border border-[var(--line)]/70 bg-[linear-gradient(160deg,#ffffff_0%,#f3f8f4_100%)] px-4 py-4 shadow-[0_12px_28px_rgba(20,30,26,0.07)] sm:px-5">
      <Link
        href="/profile/edit"
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--line)]/80 bg-white/88 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
        aria-label="Редактировать профиль"
      >
        <PencilLine className="h-4 w-4" />
      </Link>

      <div className="flex items-center gap-3">
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

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">
        {bio || "Добавьте короткий bio, чтобы профиль выглядел живым и личным."}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
        <span className="rounded-full bg-white/85 px-2.5 py-1">Возраст: {age ?? "—"}</span>
        <span className="rounded-full bg-white/85 px-2.5 py-1">
          Дата рождения: {birthDate ? formatDate(birthDate) : "—"}
        </span>
      </div>
    </article>
  );
}
