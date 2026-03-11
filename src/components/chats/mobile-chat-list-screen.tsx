import { MobileChatsHeader } from "@/components/chats/mobile-chats-header";
import { MobileChatsList } from "@/components/chats/mobile-chats-list";
import { MobileChatsSearch } from "@/components/chats/mobile-chats-search";
import type { ChatListItemData } from "@/components/chats/types";

interface MobileChatListScreenProps {
  chats: ChatListItemData[];
  searchQuery: string;
}

export function MobileChatListScreen({ chats, searchQuery }: MobileChatListScreenProps) {
  return (
    <section className="relative flex h-[calc(100dvh-8.2rem)] flex-col overflow-hidden bg-[linear-gradient(180deg,#f7faf7_0%,#eef5f0_62%,#f4f8f5_100%)] md:hidden">
      <div className="pointer-events-none absolute -left-16 top-6 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.16),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.2),transparent_70%)] blur-3xl" />

      <MobileChatsHeader chatsCount={chats.length} />
      <MobileChatsSearch defaultValue={searchQuery} />

      <div className="relative min-h-0 flex-1 rounded-t-[2rem] border-t border-[var(--line)]/65 bg-[rgba(249,252,249,0.76)] pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(22,30,26,0.06)] backdrop-blur-[2px]">
        <MobileChatsList items={chats} />
      </div>
    </section>
  );
}
