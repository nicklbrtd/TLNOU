import { notFound } from "next/navigation";

import { DesktopChatLayout } from "@/components/chats/desktop-chat-layout";
import { MobileChatScreen } from "@/components/chats/mobile-chat-screen";
import { requireUser } from "@/lib/auth/guards";
import {
  ensureCoreChatRoomsForUser,
  getChatsForUser,
  getRoomForUser,
} from "@/lib/chats/service";

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const user = await requireUser();
  const { roomId } = await params;

  await ensureCoreChatRoomsForUser(user);

  const [chats, room] = await Promise.all([
    getChatsForUser(user.id, ""),
    getRoomForUser(user.id, roomId),
  ]);

  if (!room) {
    notFound();
  }

  return (
    <section className="-mx-4 -my-4 h-full md:mx-0 md:my-0">
      <MobileChatScreen room={room} currentUserId={user.id} />

      <DesktopChatLayout
        chats={chats}
        activeRoomId={room.roomId}
        activeRoom={room}
        currentUserId={user.id}
      />
    </section>
  );
}
