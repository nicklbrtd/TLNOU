import { ChatHeader } from "@/components/chats/chat-header";
import { MessageComposer } from "@/components/chats/message-composer";
import { MessageList } from "@/components/chats/message-list";
import type { ChatRoomViewData } from "@/components/chats/types";

interface MobileChatScreenProps {
  room: ChatRoomViewData;
  currentUserId: string;
}

export function MobileChatScreen({ room, currentUserId }: MobileChatScreenProps) {
  return (
    <section className="fixed inset-0 z-[70] flex flex-col bg-[linear-gradient(180deg,#090c13_0%,#0f1526_100%)] md:hidden">
      <ChatHeader title={room.title} isPinned={room.isPinned} mobile />
      <MessageList messages={room.messages} currentUserId={currentUserId} mobile />
      <MessageComposer roomId={room.roomId} mobile />
    </section>
  );
}
