import Link from "next/link";
import { Pin, UserRound } from "lucide-react";

import { formatInboxTime } from "@/components/chats/format";
import type { ChatListItemData } from "@/components/chats/types";

interface ChatListItemProps {
  item: ChatListItemData;
  href: string;
  active: boolean;
}

export function ChatListItem({ item, href, active }: ChatListItemProps) {
  return (
    <Link
      href={href}
      className={`group grid grid-cols-[46px_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 transition duration-200 ${
        active
          ? "bg-[linear-gradient(90deg,rgba(15,118,110,0.18),rgba(15,118,110,0.03)_55%,transparent)]"
          : "hover:bg-[var(--card-muted)]/75"
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)]/80 bg-[radial-gradient(circle_at_24%_24%,#ffffff_0%,#eef5f0_100%)] text-[var(--text-muted)] shadow-[0_4px_12px_rgba(23,31,27,0.06)] transition group-hover:shadow-[0_7px_15px_rgba(23,31,27,0.09)]">
        <UserRound className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
            {item.title}
          </p>
          {item.isPinned ? (
            <Pin className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" aria-label="Pinned" />
          ) : null}
        </div>

        <p className="mt-1 truncate text-[12px] text-[var(--text-muted)]">
          {item.latestMessageText
            ? `${item.latestMessageAuthor ?? ""}: ${item.latestMessageText}`
            : "Сообщений пока нет"}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-[11px] text-[var(--text-muted)]">
          {formatInboxTime(item.latestAt)}
        </span>

        {item.unreadCount > 0 ? (
          <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-white">
            {item.unreadCount > 99 ? "99+" : item.unreadCount}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
