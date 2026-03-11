import { ChatListItem } from "@/components/chats/chat-list-item";
import type { ChatListItemData } from "@/components/chats/types";
import { Search } from "lucide-react";

interface ChatsListProps {
  items: ChatListItemData[];
  activeRoomId: string | null;
  mobile: boolean;
}

export function ChatsList({ items, activeRoomId, mobile }: ChatsListProps) {
  const pinned = items.filter((item) => item.isPinned);
  const regular = items.filter((item) => !item.isPinned);

  return (
    <section className="flex h-full min-h-0 flex-col bg-[linear-gradient(180deg,#f9fcf9_0%,#f4f9f6_100%)]">
      <header className={`${mobile ? "px-4 pt-3" : "px-4 pt-4"} pb-3`}>
        <h1 className="text-[34px] font-semibold leading-none tracking-tight text-[var(--text-primary)]">
          Чаты
        </h1>

        <form action="/chats" method="get" className="mt-3">
          {activeRoomId ? <input type="hidden" name="room" value={activeRoomId} /> : null}
          <label className="flex h-10 items-center gap-2 rounded-2xl border border-[var(--line)]/75 bg-white/88 px-3 shadow-[0_7px_16px_rgba(24,32,28,0.05)] transition focus-within:border-[var(--accent)]">
            <Search className="h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="search"
              name="q"
              placeholder="Поиск по чатам"
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            />
          </label>
        </form>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-[var(--line)]/65 pb-3">
        {items.length === 0 ? (
          <div className="px-4 py-6 text-sm text-[var(--text-muted)]">Нет доступных чатов.</div>
        ) : (
          <div className="space-y-3 px-3 pt-3">
            {pinned.length > 0 ? (
              <section>
                <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Закреплённые
                </p>
                <ul className="mt-1 divide-y divide-[var(--line)]/60 overflow-hidden rounded-2xl border border-[var(--line)]/70 bg-white/92 shadow-[0_10px_24px_rgba(24,32,28,0.06)]">
                  {pinned.map((item) => (
                    <li key={item.roomId}>
                      <ChatListItem
                        item={item}
                        href={`/chats?room=${item.roomId}`}
                        active={activeRoomId === item.roomId}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {regular.length > 0 ? (
              <section>
                <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Сообщения
                </p>
                <ul className="mt-1 divide-y divide-[var(--line)]/60 overflow-hidden rounded-2xl border border-[var(--line)]/70 bg-white/92 shadow-[0_10px_24px_rgba(24,32,28,0.06)]">
                  {regular.map((item) => (
                    <li key={item.roomId}>
                      <ChatListItem
                        item={item}
                        href={`/chats?room=${item.roomId}`}
                        active={activeRoomId === item.roomId}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
