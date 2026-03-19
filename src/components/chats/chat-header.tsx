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
      className={`z-10 border-b ${
        mobile
          ? "border-[rgba(168,188,231,0.24)] bg-[rgba(8,12,21,0.78)] px-2 pb-2.5 text-[#edf2ff] backdrop-blur-[10px]"
          : "sticky top-0 border-[var(--line)]/65 bg-[rgba(251,253,251,0.92)] px-4 py-3 backdrop-blur-[8px]"
      }`}
      style={safeTopStyle}
    >
      <div className="flex items-center gap-2.5">
        {mobile ? (
          <Link
            href="/chats"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(163,186,229,0.35)] bg-[rgba(20,27,43,0.84)] text-[#b3c0de] shadow-[0_5px_12px_rgba(6,10,18,0.32)] transition hover:text-[#f0f4ff]"
            aria-label="Назад к чатам"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : null}

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-[0_5px_12px_rgba(23,31,27,0.08)] ${
            mobile
              ? "border-[rgba(169,191,236,0.35)] bg-[radial-gradient(circle_at_28%_24%,rgba(49,64,98,0.96)_0%,rgba(24,33,54,0.96)_100%)] text-[#d8e2ff]"
              : "border-[var(--line)]/80 bg-[radial-gradient(circle_at_28%_24%,#ffffff_0%,#eef5f0_100%)] text-[var(--text-muted)]"
          }`}
        >
          <MessageCircleMore className="h-[18px] w-[18px]" />
        </div>

        <div className="min-w-0">
          <p
            className={`truncate tracking-tight ${
              mobile ? "text-[16px] font-semibold text-[#f2f6ff]" : "text-[17px] font-semibold text-[var(--text-primary)]"
            }`}
          >
            {title}
          </p>
          <p
            className={`mt-0.5 inline-flex items-center gap-1.5 text-[11px] ${
              mobile ? "text-[#9daed3]" : "text-[var(--text-muted)]"
            }`}
          >
            {isPinned ? (
              <Pin className={`h-3.5 w-3.5 ${mobile ? "text-[#ff8e95]" : "text-[var(--accent)]"}`} />
            ) : null}
            {isPinned ? "Закреплённый чат" : "Приватный чат ТЛНОУ"}
          </p>
        </div>
      </div>
    </header>
  );
}
