export interface ChatListItemData {
  roomId: string;
  slug: string;
  title: string;
  isPinned: boolean;
  latestMessageText: string | null;
  latestMessageAuthor: string | null;
  latestAt: Date | null;
  unreadCount: number;
}

export interface ChatMessageData {
  id: string;
  text: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
}

export interface ChatRoomViewData {
  roomId: string;
  title: string;
  isPinned: boolean;
  membersCount: number;
  messages: ChatMessageData[];
}
