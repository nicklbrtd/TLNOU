import { Search } from "lucide-react";

interface MobileChatsSearchProps {
  defaultValue: string;
}

export function MobileChatsSearch({ defaultValue }: MobileChatsSearchProps) {
  return (
    <form action="/chats" method="get" className="px-4 pb-3">
      <label className="group flex h-11 items-center gap-2 rounded-2xl border border-[var(--line)]/75 bg-[rgba(255,255,255,0.9)] px-3 shadow-[0_8px_20px_rgba(27,34,30,0.06)] transition focus-within:border-[var(--accent)] focus-within:shadow-[0_10px_20px_rgba(15,118,110,0.14)]">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)]/75 text-[var(--accent)]">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Поиск по чатам"
          className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
        />
      </label>
    </form>
  );
}
