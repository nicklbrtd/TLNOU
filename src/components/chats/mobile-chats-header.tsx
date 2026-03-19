interface MobileChatsHeaderProps {
  chatsCount: number;
}

export function MobileChatsHeader({ chatsCount }: MobileChatsHeaderProps) {
  return (
    <header
      className="relative px-4 pb-3"
      style={{ paddingTop: "max(0.7rem, env(safe-area-inset-top))" }}
    >
      <div className="pointer-events-none absolute inset-x-8 -top-8 h-20 rounded-full bg-[radial-gradient(circle,rgba(201,58,68,0.35),transparent_68%)] blur-2xl" />

      <h1 className="text-[34px] font-semibold leading-none tracking-tight text-[#f2f6ff]">
        Чаты
      </h1>

      <div className="mt-2 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-[rgba(163,188,236,0.35)] bg-[rgba(19,28,45,0.84)] px-2.5 py-1 text-[11px] font-medium text-[#aab9d8] shadow-[0_3px_10px_rgba(6,10,18,0.25)]">
          Приватное пространство
        </span>
        <span className="inline-flex items-center rounded-full border border-[rgba(197,84,90,0.45)] bg-[rgba(197,62,72,0.18)] px-2.5 py-1 text-[11px] font-semibold text-[#ffd5da] shadow-[0_3px_10px_rgba(27,34,30,0.05)]">
          {chatsCount} чатов
        </span>
      </div>
    </header>
  );
}
