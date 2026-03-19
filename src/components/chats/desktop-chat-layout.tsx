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
    <div className="relative hidden h-[calc(100dvh-10.5rem)] min-h-[560px] overflow-hidden rounded-[30px] border border-[rgba(166,185,224,0.28)] bg-[linear-gradient(180deg,rgba(246,250,255,0.9)_0%,rgba(236,243,255,0.92)_100%)] shadow-[0_24px_44px_rgba(5,10,19,0.28)] md:grid md:grid-cols-[360px_1fr]">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(191,50,63,0.24),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(74,116,189,0.2),transparent_72%)] blur-3xl" />

      <div className="relative border-r border-[rgba(158,180,223,0.35)] bg-[rgba(248,251,255,0.85)]">
        <ChatsList items={chats} activeRoomId={activeRoomId} mobile={false} />
      </div>

      <div className="relative bg-[rgba(250,253,255,0.76)]">
        <ChatView room={activeRoom} currentUserId={currentUserId} mobile={false} />
      </div>
    </div>
  );
}
