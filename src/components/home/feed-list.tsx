import { FeedPostCard } from "@/components/home/feed-post-card";
import type { FeedItem } from "@/components/home/types";

interface FeedListProps {
  items: FeedItem[];
  currentUserId: string;
}

export function FeedList({ items, currentUserId }: FeedListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[var(--line)]/80 bg-[var(--card-muted)]/65 px-5 py-9 text-sm text-[var(--text-muted)]">
        В главной пока тихо. Публикации из профилей и каналов появятся здесь автоматически.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <FeedPostCard key={`${item.kind}-${item.id}`} item={item} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
