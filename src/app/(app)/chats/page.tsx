import { DesktopChatLayout } from "@/components/chats/desktop-chat-layout";
import { MobileChatListScreen } from "@/components/chats/mobile-chat-list-screen";
import { requireUser } from "@/lib/auth/guards";
import {
  ensureCoreChatRoomsForUser,
  getChatsForUser,
  getDefaultRoomId,
  getRoomForUser,
} from "@/lib/chats/service";

export default async function ChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string; q?: string }>;
}) {
  const user = await requireUser();
  const query = await searchParams;
  const searchQuery = (query.q ?? "").trim();

  await ensureCoreChatRoomsForUser(user);
  const chats = await getChatsForUser(user.id, searchQuery);

  const requestedRoomId = query.room ?? null;
  const hasRequestedRoom = requestedRoomId
    ? chats.some((chat) => chat.roomId === requestedRoomId)
    : false;

  const activeRoomId =
    (hasRequestedRoom ? requestedRoomId : null) ?? getDefaultRoomId(chats);
  const activeRoom = activeRoomId ? await getRoomForUser(user.id, activeRoomId) : null;

  return (
    <section className="-mx-4 -my-4 h-full md:mx-0 md:my-0">
      <MobileChatListScreen chats={chats} searchQuery={searchQuery} />

      <DesktopChatLayout
        chats={chats}
        activeRoomId={activeRoomId}
        activeRoom={activeRoom}
        currentUserId={user.id}
      />
    </section>
  );
}
