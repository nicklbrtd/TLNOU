import { ChatHeader } from "@/components/chats/chat-header";
import { MessageComposer } from "@/components/chats/message-composer";
import { MessageList } from "@/components/chats/message-list";
import type { ChatRoomViewData } from "@/components/chats/types";

interface ChatViewProps {
  room: ChatRoomViewData | null;
  currentUserId: string;
  mobile: boolean;
}

export function ChatView({ room, currentUserId, mobile }: ChatViewProps) {
  if (!room) {
    return (
      <section className="flex h-full min-h-0 flex-col bg-[linear-gradient(180deg,#f8fbf8_0%,#f0f6f2_100%)]">
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <div className="rounded-3xl border border-[var(--line)]/70 bg-white/88 px-7 py-6 shadow-[0_12px_30px_rgba(24,32,28,0.08)]">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Выберите чат из списка
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Откройте комнату слева, чтобы начать общение.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-transparent">
      <ChatHeader title={room.title} isPinned={room.isPinned} mobile={mobile} />
      <MessageList messages={room.messages} currentUserId={currentUserId} mobile={mobile} />
      <MessageComposer roomId={room.roomId} mobile={mobile} />
    </section>
  );
}
