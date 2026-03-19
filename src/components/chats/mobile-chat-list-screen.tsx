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
    <section className="relative flex h-[calc(100dvh-8.2rem)] flex-col overflow-hidden bg-[linear-gradient(180deg,#090c13_0%,#0d1220_62%,#101729_100%)] md:hidden">
      <div className="pointer-events-none absolute -left-16 top-6 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(185,44,57,0.34),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(65,108,182,0.3),transparent_70%)] blur-3xl" />

      <MobileChatsHeader chatsCount={chats.length} />
      <MobileChatsSearch defaultValue={searchQuery} />

      <div className="relative min-h-0 flex-1 rounded-t-[2rem] border-t border-[rgba(169,189,232,0.28)] bg-[rgba(241,246,255,0.86)] pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-16px_28px_rgba(5,9,17,0.32)] backdrop-blur-[4px]">
        <MobileChatsList items={chats} />
      </div>
    </section>
  );
}
