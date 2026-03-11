export interface FeedMediaItem {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
}

export interface FeedCommentItem {
  id: string;
  text: string;
  authorName: string;
}

export interface UserFeedItem {
  kind: "user";
  id: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
  authorUsername: string | null;
  authorAvatarUrl: string | null;
  text: string | null;
  media: FeedMediaItem[];
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  comments: FeedCommentItem[];
}

export interface ChannelFeedItem {
  kind: "channel";
  id: string;
  createdAt: Date;
  channelSlug: string;
  channelTitle: string;
  channelUsername: string;
  text: string | null;
  media: FeedMediaItem[];
  likesCount: number;
}

export type FeedItem = UserFeedItem | ChannelFeedItem;

export interface SearchUserResult {
  id: string;
  identifier: string;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
}

export interface SearchChannelResult {
  id: string;
  slug: string;
  title: string;
  username: string;
}
