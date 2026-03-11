"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { House, Search, X } from "lucide-react";

import { Avatar } from "@/components/avatar";
import type {
  SearchChannelResult,
  SearchUserResult,
} from "@/components/home/types";

interface HomeHeaderProps {
  searchQuery: string;
  users: SearchUserResult[];
  channels: SearchChannelResult[];
}

export function HomeHeader({ searchQuery, users, channels }: HomeHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(Boolean(searchQuery));

  useEffect(() => {
    if (searchQuery) {
      setIsSearchOpen(true);
    }
  }, [searchQuery]);

  return (
    <>
      <header className="sticky top-0 z-20 -mx-1 flex items-center justify-between rounded-2xl border border-[var(--line)]/70 bg-[rgba(248,252,248,0.9)] px-3 py-2.5 shadow-[0_8px_20px_rgba(24,32,28,0.06)] backdrop-blur-[8px] sm:px-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--line)]/80 bg-[radial-gradient(circle_at_24%_24%,#ffffff_0%,#ebf5ef_100%)] text-[var(--accent)] shadow-[0_6px_16px_rgba(15,118,110,0.18)]">
            <House className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[22px] font-semibold tracking-tight text-[var(--text-primary)]">
              Главная
            </p>
            <p className="-mt-0.5 text-[11px] text-[var(--text-muted)]">
              Лента профилей и каналов
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--line)]/80 bg-white/88 text-[var(--text-muted)] shadow-[0_4px_12px_rgba(24,32,28,0.06)] transition hover:text-[var(--text-primary)]"
          aria-label="Поиск пользователей и каналов"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
      </header>

      {isSearchOpen ? (
        <div
          className="fixed inset-0 z-[90] bg-[rgba(12,20,16,0.25)] px-3 pb-4 pt-[max(0.85rem,env(safe-area-inset-top))] backdrop-blur-[2px] sm:px-5"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="mx-auto flex h-full w-full max-w-2xl flex-col rounded-[28px] border border-[var(--line)]/75 bg-[linear-gradient(180deg,#fbfdfb_0%,#f2f8f4_100%)] shadow-[0_22px_46px_rgba(18,30,24,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-[var(--line)]/65 px-3 py-3">
              <form action="/feed" method="get" className="flex flex-1 items-center gap-2">
                <label className="flex h-11 flex-1 items-center gap-2 rounded-2xl border border-[var(--line)]/75 bg-white/92 px-3 shadow-[0_6px_14px_rgba(24,32,28,0.05)] focus-within:border-[var(--accent)]">
                  <Search className="h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    autoFocus
                    type="search"
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="Поиск: имя, ID, @username, канал"
                    className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  />
                </label>
                <button
                  type="submit"
                  className="h-11 rounded-2xl bg-[var(--accent)] px-4 text-sm font-semibold text-white"
                >
                  Найти
                </button>
              </form>

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-[var(--text-muted)] transition hover:bg-[var(--card-muted)]"
                aria-label="Закрыть поиск"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {!searchQuery ? (
                <div className="rounded-2xl border border-[var(--line)]/70 bg-white/85 px-4 py-4 text-sm text-[var(--text-muted)]">
                  Введите запрос, чтобы найти участника по `ID`, имени или `@username`, либо
                  канал по названию и slug.
                </div>
              ) : (
                <div className="space-y-4">
                  <section>
                    <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      Пользователи
                    </p>
                    {users.length === 0 ? (
                      <p className="mt-1 rounded-2xl border border-[var(--line)]/70 bg-white/88 px-3 py-2 text-sm text-[var(--text-muted)]">
                        Ничего не найдено.
                      </p>
                    ) : (
                      <ul className="mt-1 divide-y divide-[var(--line)]/65 overflow-hidden rounded-2xl border border-[var(--line)]/70 bg-white/92">
                        {users.map((entry) => (
                          <li key={entry.id}>
                            <Link
                              href={`/u/${entry.id}`}
                              className="flex items-center gap-2.5 px-3 py-2.5 transition hover:bg-[var(--card-muted)]/75"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <Avatar
                                name={entry.displayName}
                                avatarUrl={entry.avatarUrl}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                                  {entry.displayName}
                                </p>
                                <p className="truncate text-xs text-[var(--text-muted)]">
                                  ID {entry.identifier}
                                  {entry.username ? ` • @${entry.username}` : ""}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section>
                    <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      Каналы
                    </p>
                    {channels.length === 0 ? (
                      <p className="mt-1 rounded-2xl border border-[var(--line)]/70 bg-white/88 px-3 py-2 text-sm text-[var(--text-muted)]">
                        Каналы не найдены.
                      </p>
                    ) : (
                      <ul className="mt-1 divide-y divide-[var(--line)]/65 overflow-hidden rounded-2xl border border-[var(--line)]/70 bg-white/92">
                        {channels.map((entry) => (
                          <li key={entry.id}>
                            <Link
                              href={`/channel/${entry.slug}`}
                              className="flex items-center gap-2.5 px-3 py-2.5 transition hover:bg-[var(--card-muted)]/75"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--line)]/80 bg-[var(--accent-soft)]/60 text-[var(--accent)]">
                                #
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                                  {entry.title}
                                </p>
                                <p className="truncate text-xs text-[var(--text-muted)]">
                                  @{entry.username}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
