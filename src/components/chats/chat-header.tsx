import Link from "next/link";
import { ChevronLeft, MessageCircleMore, Pin } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  isPinned: boolean;
  mobile: boolean;
}

export function ChatHeader({ title, isPinned, mobile }: ChatHeaderProps) {
  const safeTopStyle = mobile
    ? { paddingTop: "max(0.4rem, env(safe-area-inset-top))" }
    : undefined;

  return (
    <header
      className={`z-10 border-b border-[var(--line)]/65 bg-[rgba(251,253,251,0.92)] ${
        mobile ? "px-2 pb-2.5 backdrop-blur-[8px]" : "sticky top-0 px-4 py-3 backdrop-blur-[8px]"
      }`}
      style={safeTopStyle}
    >
      <div className="flex items-center gap-2.5">
        {mobile ? (
          <Link
            href="/chats"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)]/75 bg-white/90 text-[var(--text-muted)] shadow-[0_5px_12px_rgba(23,31,27,0.08)] transition hover:text-[var(--text-primary)]"
            aria-label="Назад к чатам"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : null}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line)]/80 bg-[radial-gradient(circle_at_28%_24%,#ffffff_0%,#eef5f0_100%)] text-[var(--text-muted)] shadow-[0_5px_12px_rgba(23,31,27,0.08)]">
          <MessageCircleMore className="h-[18px] w-[18px]" />
        </div>

        <div className="min-w-0">
          <p
            className={`truncate tracking-tight text-[var(--text-primary)] ${
              mobile ? "text-[16px] font-semibold" : "text-[17px] font-semibold"
            }`}
          >
            {title}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            {isPinned ? <Pin className="h-3.5 w-3.5 text-[var(--accent)]" /> : null}
            {isPinned ? "Закреплённый чат" : "Приватный чат ТЛНОУ"}
          </p>
        </div>
      </div>
    </header>
  );
}
