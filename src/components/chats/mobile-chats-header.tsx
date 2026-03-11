interface MobileChatsHeaderProps {
  chatsCount: number;
}

export function MobileChatsHeader({ chatsCount }: MobileChatsHeaderProps) {
  return (
    <header
      className="relative px-4 pb-3"
      style={{ paddingTop: "max(0.7rem, env(safe-area-inset-top))" }}
    >
      <div className="pointer-events-none absolute inset-x-8 -top-8 h-20 rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.16),transparent_68%)] blur-2xl" />

      <h1 className="text-[34px] font-semibold leading-none tracking-tight text-[var(--text-primary)]">
        Чаты
      </h1>

      <div className="mt-2 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-[var(--line)]/80 bg-white/88 px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)] shadow-[0_3px_10px_rgba(27,34,30,0.05)]">
          Приватное пространство
        </span>
        <span className="inline-flex items-center rounded-full border border-[var(--line)]/80 bg-white/88 px-2.5 py-1 text-[11px] font-semibold text-[var(--text-primary)] shadow-[0_3px_10px_rgba(27,34,30,0.05)]">
          {chatsCount} чатов
        </span>
      </div>
    </header>
  );
}
