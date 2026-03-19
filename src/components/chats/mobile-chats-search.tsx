import { Search } from "lucide-react";

interface MobileChatsSearchProps {
  defaultValue: string;
}

export function MobileChatsSearch({ defaultValue }: MobileChatsSearchProps) {
  return (
    <form action="/chats" method="get" className="px-4 pb-3">
      <label className="group flex h-11 items-center gap-2 rounded-2xl border border-[rgba(163,186,229,0.34)] bg-[rgba(20,29,46,0.84)] px-3 shadow-[0_8px_20px_rgba(6,10,18,0.32)] transition focus-within:border-[rgba(219,88,97,0.58)] focus-within:shadow-[0_10px_20px_rgba(164,37,51,0.24)]">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(196,62,72,0.22)] text-[#ffb8be]">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Поиск по чатам"
          className="w-full bg-transparent text-sm text-[#eef3ff] outline-none placeholder:text-[#9aaacb]"
        />
      </label>
    </form>
  );
}
