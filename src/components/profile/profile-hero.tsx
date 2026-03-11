import Link from "next/link";

import { Avatar } from "@/components/avatar";

interface ProfileHeroProps {
  displayName: string;
  avatarUrl: string | null;
  statusLine: string | null;
  signature: string | null;
}

export function ProfileHero({
  displayName,
  avatarUrl,
  statusLine,
  signature,
}: ProfileHeroProps) {
  const subtitle = statusLine || signature || "Личное пространство участника ТЛНОУ";

  return (
    <section className="rounded-[28px] border border-[var(--line)]/70 bg-[var(--card)] px-5 py-5 shadow-[0_14px_32px_rgba(27,36,31,0.06)] sm:px-7 sm:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={displayName} avatarUrl={avatarUrl} size="lg" />

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-[30px]">
              {displayName}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)] sm:text-[15px]">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 sm:justify-end">
          <Link
            href="/profile/edit"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Редактировать профиль
          </Link>
          <Link
            href="/post/new"
            className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--card-muted)]"
          >
            Создать пост
          </Link>
        </div>
      </div>
    </section>
  );
}
