import { MobileChatListItem } from "@/components/chats/mobile-chat-list-item";
import type { ChatListItemData } from "@/components/chats/types";

interface MobileChatsListProps {
  items: ChatListItemData[];
}

export function MobileChatsList({ items }: MobileChatsListProps) {
  const pinned = items.filter((item) => item.isPinned);
  const regular = items.filter((item) => !item.isPinned);

  if (items.length === 0) {
    return (
      <div className="mx-4 mt-4 rounded-3xl border border-[var(--line)]/70 bg-white/88 px-4 py-10 text-center text-sm text-[var(--text-muted)] shadow-[0_14px_28px_rgba(24,32,28,0.06)]">
        Пока нет доступных чатов. Создайте канал или дождитесь новых обсуждений.
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto pb-4">
      {pinned.length > 0 ? (
        <section className="px-3 pt-2">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Закреплённые
          </p>
          <ul className="mt-1 divide-y divide-[var(--line)]/65 overflow-hidden rounded-2xl border border-[var(--line)]/70 bg-white/90 shadow-[0_10px_24px_rgba(24,32,28,0.06)]">
            {pinned.map((item) => (
              <li key={item.roomId}>
                <MobileChatListItem item={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {regular.length > 0 ? (
        <section className="px-3 pt-3">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Сообщения
          </p>
          <ul className="mt-1 divide-y divide-[var(--line)]/65 overflow-hidden rounded-2xl border border-[var(--line)]/70 bg-white/90 shadow-[0_10px_24px_rgba(24,32,28,0.06)]">
            {regular.map((item) => (
              <li key={item.roomId}>
                <MobileChatListItem item={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
