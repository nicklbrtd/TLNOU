import { SendHorizontal } from "lucide-react";

interface MessageComposerProps {
  roomId: string;
  mobile?: boolean;
}

export function MessageComposer({ roomId, mobile = false }: MessageComposerProps) {
  const mobileSafePadding = mobile
    ? { paddingBottom: "max(0.6rem, env(safe-area-inset-bottom))" }
    : undefined;

  const desktopForm = (
    <form action="/api/chats/messages/create" method="post" className="flex items-center gap-2.5">
      <input type="hidden" name="roomId" value={roomId} />

      <input
        name="text"
        required
        maxLength={1000}
        placeholder="Сообщение"
        className="h-11 w-full rounded-full border border-[var(--line)]/75 bg-white/92 px-4 text-sm outline-none shadow-[0_6px_14px_rgba(25,32,29,0.06)] transition focus:border-[var(--accent)] focus:shadow-[0_8px_18px_rgba(15,118,110,0.15)]"
      />

      <button
        type="submit"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(140deg,#17b2a7_0%,#0f766e_100%)] text-white shadow-[0_10px_18px_rgba(15,118,110,0.35)] transition hover:brightness-105"
        aria-label="Отправить сообщение"
      >
        <SendHorizontal className="h-[18px] w-[18px]" />
      </button>
    </form>
  );

  if (!mobile) {
    return (
      <div className="border-t border-[var(--line)]/65 bg-[rgba(251,253,251,0.94)] px-4 py-3 backdrop-blur-[8px]">
        {desktopForm}
      </div>
    );
  }

  return (
    <div
      className="sticky bottom-0 border-t border-[rgba(161,182,226,0.28)] bg-[rgba(10,15,26,0.86)] px-3 pt-2.5 shadow-[0_-16px_26px_rgba(4,8,15,0.44)] backdrop-blur-[10px]"
      style={mobileSafePadding}
    >
      <form action="/api/chats/messages/create" method="post" className="flex items-center gap-2">
        <input type="hidden" name="roomId" value={roomId} />

        <div className="flex h-11 flex-1 items-center rounded-full border border-[rgba(159,183,227,0.34)] bg-[rgba(19,28,45,0.84)] px-3 shadow-[0_6px_14px_rgba(5,10,18,0.32)]">
          <input
            name="text"
            required
            maxLength={1000}
            placeholder="Сообщение"
            className="w-full bg-transparent text-sm text-[#f0f4ff] outline-none placeholder:text-[#9aaacc]"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,#d5474e_0%,#a32939_100%)] text-white shadow-[0_10px_18px_rgba(160,37,51,0.45)] transition active:scale-[0.98]"
          aria-label="Отправить сообщение"
        >
          <SendHorizontal className="h-[18px] w-[18px]" />
        </button>
      </form>
    </div>
  );
}
