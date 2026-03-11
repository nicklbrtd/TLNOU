import { FeedPostCard } from "@/components/home/feed-post-card";
import type { FeedItem } from "@/components/home/types";

interface FeedListProps {
  items: FeedItem[];
  currentUserId: string;
}

export function FeedList({ items, currentUserId }: FeedListProps) {
  if (items.length === 0) {
    return (
      <div className="px-1 py-8 text-sm text-[var(--text-muted)]">
        В главной пока тихо. Публикации из профилей и каналов появятся здесь автоматически.
      </div>
    );
  }

  return (
    <div className="-mx-4 sm:mx-0">
      <div className="divide-y divide-[var(--line)]/60 bg-transparent">
        {items.map((item) => (
          <FeedPostCard
            key={`${item.kind}-${item.id}`}
            item={item}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
