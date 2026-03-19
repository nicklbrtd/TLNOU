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
      <header className="sticky top-0 z-20 -mx-4 border-b border-[rgba(152,66,74,0.32)] bg-[rgba(10,14,24,0.8)] px-4 pb-2 pt-[max(0.35rem,env(safe-area-inset-top))] text-[#eef3ff] backdrop-blur-[10px] sm:mx-0 sm:px-0">
        <div className="flex h-11 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#ff7277]">
              <House className="h-4 w-4" />
            </span>
            <h1 className="text-[26px] font-semibold tracking-tight text-[#f2f5ff]">
              Главная
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#b3bfda] transition hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f2f5ff]"
            aria-label="Открыть поиск"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {isSearchOpen ? (
        <div className="fixed inset-0 z-[90] bg-[linear-gradient(180deg,rgba(8,12,21,0.98)_0%,rgba(11,16,28,0.99)_100%)]">
          <div
            className="mx-auto flex h-full w-full max-w-3xl flex-col px-4 pb-[max(0.8rem,env(safe-area-inset-bottom))]"
            style={{ paddingTop: "max(0.7rem, env(safe-area-inset-top))" }}
          >
            <div className="flex items-center gap-2 border-b border-[rgba(156,179,226,0.24)] pb-3">
              <form action="/feed" method="get" className="flex flex-1 items-center gap-2">
                <label className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-[rgba(163,186,230,0.33)] bg-[rgba(20,27,43,0.85)] px-3">
                  <Search className="h-4 w-4 text-[#a8b4cf]" />
                  <input
                    autoFocus
                    type="search"
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="Поиск: имя, ID, @username, канал"
                    className="w-full bg-transparent text-sm text-[#f1f4ff] outline-none placeholder:text-[#8d9bb9]"
                  />
                </label>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[linear-gradient(140deg,#d2444b_0%,#9e2534_100%)] px-3.5 text-sm font-semibold text-white shadow-[0_12px_18px_rgba(164,38,48,0.35)]"
                >
                  Найти
                </button>
              </form>

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#9aa8c7] transition hover:bg-[rgba(255,255,255,0.08)]"
                aria-label="Закрыть поиск"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-2">
              {!searchQuery ? (
                <p className="text-sm leading-6 text-[#a9b5d0]">
                  Введите запрос и найдите участника по имени, ID или username, либо канал по
                  названию и slug.
                </p>
              ) : (
                <div className="space-y-6">
                  <section>
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a2b0cc]">
                      Пользователи
                    </h2>
                    {users.length === 0 ? (
                      <p className="mt-2 text-sm text-[#a2b0cc]">Ничего не найдено.</p>
                    ) : (
                      <ul className="mt-2 divide-y divide-[rgba(157,179,226,0.2)]">
                        {users.map((entry) => (
                          <li key={entry.id}>
                            <Link
                              href={`/u/${entry.id}`}
                              className="flex items-center gap-2.5 rounded-lg py-2.5 transition hover:bg-[rgba(255,255,255,0.06)]"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <Avatar
                                name={entry.displayName}
                                avatarUrl={entry.avatarUrl}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#f1f4ff]">
                                  {entry.displayName}
                                </p>
                                <p className="truncate text-xs text-[#a2b0cc]">
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
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a2b0cc]">
                      Каналы
                    </h2>
                    {channels.length === 0 ? (
                      <p className="mt-2 text-sm text-[#a2b0cc]">Каналы не найдены.</p>
                    ) : (
                      <ul className="mt-2 divide-y divide-[rgba(157,179,226,0.2)]">
                        {channels.map((entry) => (
                          <li key={entry.id}>
                            <Link
                              href={`/channel/${entry.slug}`}
                              className="flex items-center gap-2.5 rounded-lg py-2.5 transition hover:bg-[rgba(255,255,255,0.06)]"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(199,68,74,0.24)] text-xs font-semibold text-[#ffd0d4]">
                                #
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#f1f4ff]">
                                  {entry.title}
                                </p>
                                <p className="truncate text-xs text-[#a2b0cc]">
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
