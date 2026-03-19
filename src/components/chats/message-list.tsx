import { Avatar } from "@/components/avatar";
import { formatMessageDayLabel, formatMessageTime } from "@/components/chats/format";
import type { ChatMessageData } from "@/components/chats/types";

interface MessageListProps {
  messages: ChatMessageData[];
  currentUserId: string;
  mobile?: boolean;
}

type RenderedItem =
  | { type: "separator"; key: string; label: string }
  | { type: "message"; key: string; message: ChatMessageData };

function buildTimeline(messages: ChatMessageData[]): RenderedItem[] {
  const rendered: RenderedItem[] = [];
  let currentDayKey = "";

  for (const message of messages) {
    const dayKey = message.createdAt.toISOString().slice(0, 10);

    if (dayKey !== currentDayKey) {
      currentDayKey = dayKey;
      rendered.push({
        type: "separator",
        key: `day-${dayKey}`,
        label: formatMessageDayLabel(message.createdAt),
      });
    }

    rendered.push({
      type: "message",
      key: message.id,
      message,
    });
  }

  return rendered;
}

export function MessageList({ messages, currentUserId, mobile = false }: MessageListProps) {
  const backgroundClass = mobile
    ? "bg-[radial-gradient(circle_at_14%_8%,rgba(195,55,63,0.2),transparent_34%),radial-gradient(circle_at_88%_92%,rgba(84,124,194,0.2),transparent_35%),linear-gradient(180deg,#0c1222_0%,#111a2f_100%)]"
    : "bg-[radial-gradient(circle_at_8%_10%,rgba(15,118,110,0.08),transparent_34%),radial-gradient(circle_at_92%_88%,rgba(148,163,184,0.13),transparent_35%),linear-gradient(180deg,#f8fbf8_0%,#f1f6f2_100%)]";

  if (messages.length === 0) {
    return (
      <div className={`flex flex-1 items-center justify-center px-6 ${backgroundClass}`}>
        <div className="max-w-[280px] rounded-3xl border border-[var(--line)]/70 bg-white/88 px-5 py-4 text-center shadow-[0_12px_26px_rgba(24,32,28,0.07)]">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Пока тихо</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            Этот диалог уже готов к общению. Напишите первое сообщение.
          </p>
        </div>
      </div>
    );
  }

  const rendered = buildTimeline(messages);

  return (
    <div
      className={`relative flex-1 overflow-y-auto ${backgroundClass} ${
        mobile ? "px-3 py-4" : "px-5 py-5"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${
          mobile ? "bg-gradient-to-b from-black/20 to-transparent" : "bg-gradient-to-b from-white/30 to-transparent"
        }`}
      />

      <div className={`relative ${mobile ? "space-y-3" : "mx-auto max-w-3xl space-y-3.5"}`}>
        {rendered.map((item) => {
          if (item.type === "separator") {
            return (
            <div key={item.key} className="flex items-center gap-2 py-1.5">
                <div className={`h-px flex-1 ${mobile ? "bg-[#4f628f]/50" : "bg-[var(--line)]/65"}`} />
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium shadow-[0_2px_8px_rgba(25,32,29,0.05)] ${
                    mobile
                      ? "border-[#5f77ad]/45 bg-[rgba(20,30,52,0.72)] text-[#adc0e8]"
                      : "border-[var(--line)]/70 bg-white/88 text-[var(--text-muted)]"
                  }`}
                >
                  {item.label}
                </span>
                <div className={`h-px flex-1 ${mobile ? "bg-[#4f628f]/50" : "bg-[var(--line)]/65"}`} />
              </div>
            );
          }

          const message = item.message;
          const own = message.authorId === currentUserId;

          return (
            <div
              key={item.key}
              className={`flex items-end gap-2.5 ${own ? "justify-end" : "justify-start"}`}
            >
              {!own ? (
                <Avatar name={message.authorName} avatarUrl={message.authorAvatarUrl} size="sm" />
              ) : null}

              <div
                className={`${
                  mobile ? "max-w-[84%]" : "max-w-[76%]"
                } rounded-2xl px-3.5 py-2.5 shadow-[0_8px_16px_rgba(24,32,28,0.07)] ${
                  own
                    ? mobile
                      ? "rounded-br-md bg-[linear-gradient(145deg,#da4c54_0%,#b33242_95%)] text-white shadow-[0_10px_18px_rgba(161,38,52,0.42)]"
                      : "rounded-br-md bg-[linear-gradient(140deg,#15a39a_0%,#0f766e_92%)] text-white"
                    : mobile
                      ? "rounded-bl-md border border-[#7189bf]/40 bg-[rgba(222,232,252,0.92)] text-[#15203a]"
                      : "rounded-bl-md border border-[var(--line)]/75 bg-white/92 text-[var(--text-primary)]"
                }`}
              >
                {!own ? (
                  <p
                    className={`text-[11px] font-semibold ${
                      mobile ? "text-[#5d6f95]" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {message.authorName}
                  </p>
                ) : null}

                <p className="whitespace-pre-wrap text-sm leading-5">{message.text}</p>

                <p
                  className={`mt-1 text-[10px] ${
                    own ? "text-white/80" : "text-[var(--text-muted)]"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
