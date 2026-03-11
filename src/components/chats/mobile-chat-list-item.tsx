import Link from "next/link";
import { MessageCircleMore, Pin } from "lucide-react";

import { formatInboxTime } from "@/components/chats/format";
import type { ChatListItemData } from "@/components/chats/types";

interface MobileChatListItemProps {
  item: ChatListItemData;
}

export function MobileChatListItem({ item }: MobileChatListItemProps) {
  return (
    <Link
      href={`/chats/${encodeURIComponent(item.roomId)}`}
      className={`group relative grid min-h-20 grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition duration-200 active:scale-[0.996] ${
        item.isPinned
          ? "bg-[linear-gradient(90deg,rgba(15,118,110,0.12),rgba(15,118,110,0.02)_42%,transparent)]"
          : "hover:bg-[var(--card-muted)]/65"
      }`}
    >
      {item.isPinned ? (
        <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-[var(--accent)]/70" />
      ) : null}

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)]/80 bg-[radial-gradient(circle_at_28%_24%,#ffffff_0%,#f2f8f4_100%)] text-[var(--text-muted)] shadow-[0_4px_14px_rgba(23,31,27,0.08)] transition group-hover:shadow-[0_8px_18px_rgba(23,31,27,0.12)]">
        <MessageCircleMore className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
            {item.title}
          </p>
          {item.isPinned ? (
            <Pin className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
          ) : null}
        </div>

        <p className="mt-1 truncate text-[12px] text-[var(--text-muted)]">
          {item.latestMessageText
            ? `${item.latestMessageAuthor ?? ""}: ${item.latestMessageText}`
            : "Сообщений пока нет"}
        </p>
      </div>

      <div className="flex min-w-10 flex-col items-end gap-1">
        <span className="text-[11px] font-medium text-[var(--text-muted)]">
          {formatInboxTime(item.latestAt)}
        </span>

        {item.unreadCount > 0 ? (
          <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-semibold text-white shadow-[0_6px_12px_rgba(15,118,110,0.35)]">
            {item.unreadCount > 99 ? "99+" : item.unreadCount}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
