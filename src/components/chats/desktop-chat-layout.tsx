import { ChatsList } from "@/components/chats/chats-list";
import { ChatView } from "@/components/chats/chat-view";
import type { ChatListItemData, ChatRoomViewData } from "@/components/chats/types";

interface DesktopChatLayoutProps {
  chats: ChatListItemData[];
  activeRoomId: string | null;
  activeRoom: ChatRoomViewData | null;
  currentUserId: string;
}

export function DesktopChatLayout({
  chats,
  activeRoomId,
  activeRoom,
  currentUserId,
}: DesktopChatLayoutProps) {
  return (
    <div className="relative hidden h-[calc(100dvh-10.5rem)] min-h-[560px] overflow-hidden rounded-[30px] border border-[var(--line)]/75 bg-[linear-gradient(180deg,#fbfdfb_0%,#f4f8f5_100%)] shadow-[0_18px_42px_rgba(20,30,26,0.09)] md:grid md:grid-cols-[360px_1fr]">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.14),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.16),transparent_72%)] blur-3xl" />

      <div className="relative border-r border-[var(--line)]/70 bg-[rgba(250,253,250,0.85)]">
        <ChatsList items={chats} activeRoomId={activeRoomId} mobile={false} />
      </div>

      <div className="relative bg-[rgba(252,254,252,0.72)]">
        <ChatView room={activeRoom} currentUserId={currentUserId} mobile={false} />
      </div>
    </div>
  );
}
