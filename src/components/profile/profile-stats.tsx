import Link from "next/link";

interface ProfileStatsProps {
  postsCount: number;
  likesReceivedCount: number;
  commentsReceivedCount: number;
  hasChannel: boolean;
  channelHref: string;
  channelLabel: string;
}

const statItems = [
  { key: "posts", label: "Публикации" },
  { key: "likes", label: "Лайки" },
  { key: "comments", label: "Комментарии" },
  { key: "channel", label: "Канал" },
] as const;

export function ProfileStats({
  postsCount,
  likesReceivedCount,
  commentsReceivedCount,
  hasChannel,
  channelHref,
  channelLabel,
}: ProfileStatsProps) {
  const values = {
    posts: postsCount,
    likes: likesReceivedCount,
    comments: commentsReceivedCount,
    channel: hasChannel ? 1 : 0,
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5">
        {statItems.map((item) => (
          <div key={item.key} className="rounded-2xl bg-[var(--card-muted)] px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {item.label}
            </p>
            <p className="mt-1 text-xl font-semibold leading-none tracking-tight text-[var(--text-primary)]">
              {values[item.key]}
            </p>
          </div>
        ))}
      </div>

      <Link
        href={channelHref}
        className="mt-3 inline-flex h-10 items-center justify-center rounded-full border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--card-muted)]"
      >
        {channelLabel}
      </Link>
    </div>
  );
}
