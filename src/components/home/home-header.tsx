"use client";

import Link from "next/link";
import { useState } from "react";
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
  const [isSearchOpen, setIsSearchOpen] = useState(() => Boolean(searchQuery));

  return (
    <>
      <header className="sticky top-0 z-20 -mx-4 border-b border-[var(--line)]/60 bg-[rgba(244,248,245,0.95)] px-4 pb-2 pt-[max(0.35rem,env(safe-area-inset-top))] backdrop-blur-[6px] sm:mx-0 sm:px-0">
        <div className="flex h-11 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--accent)]">
              <House className="h-4 w-4" />
            </span>
            <h1 className="text-[26px] font-semibold tracking-tight text-[var(--text-primary)]">
              Главная
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] transition hover:bg-[var(--card-muted)] hover:text-[var(--text-primary)]"
            aria-label="Открыть поиск"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {isSearchOpen ? (
        <div className="fixed inset-0 z-[90] bg-[rgba(245,249,246,0.98)]">
          <div
            className="mx-auto flex h-full w-full max-w-3xl flex-col px-4 pb-[max(0.8rem,env(safe-area-inset-bottom))]"
            style={{ paddingTop: "max(0.7rem, env(safe-area-inset-top))" }}
          >
            <div className="flex items-center gap-2 border-b border-[var(--line)]/65 pb-3">
              <form action="/feed" method="get" className="flex flex-1 items-center gap-2">
                <label className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-[var(--line)]/70 bg-white px-3">
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
                  className="h-10 rounded-lg bg-[var(--accent)] px-3.5 text-sm font-semibold text-white"
                >
                  Найти
                </button>
              </form>

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--card-muted)]"
                aria-label="Закрыть поиск"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-2">
              {!searchQuery ? (
                <p className="text-sm leading-6 text-[var(--text-muted)]">
                  Введите запрос и найдите участника по имени, ID или username, либо канал по
                  названию и slug.
                </p>
              ) : (
                <div className="space-y-6">
                  <section>
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      Пользователи
                    </h2>
                    {users.length === 0 ? (
                      <p className="mt-2 text-sm text-[var(--text-muted)]">Ничего не найдено.</p>
                    ) : (
                      <ul className="mt-2 divide-y divide-[var(--line)]/60">
                        {users.map((entry) => (
                          <li key={entry.id}>
                            <Link
                              href={`/u/${entry.id}`}
                              className="flex items-center gap-2.5 py-2.5 transition hover:bg-[var(--card-muted)]/55"
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
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      Каналы
                    </h2>
                    {channels.length === 0 ? (
                      <p className="mt-2 text-sm text-[var(--text-muted)]">Каналы не найдены.</p>
                    ) : (
                      <ul className="mt-2 divide-y divide-[var(--line)]/60">
                        {channels.map((entry) => (
                          <li key={entry.id}>
                            <Link
                              href={`/channel/${entry.slug}`}
                              className="flex items-center gap-2.5 py-2.5 transition hover:bg-[var(--card-muted)]/55"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent-soft)]/85 text-xs font-semibold text-[var(--accent)]">
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
