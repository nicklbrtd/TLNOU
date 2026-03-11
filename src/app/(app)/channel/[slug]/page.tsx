import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/time";

export default async function ChannelPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  await requireUser();
  const { slug } = await params;
  const query = await searchParams;

  const channel = await prisma.channel.findUnique({
    where: { slug },
    include: {
      owner: {
        include: {
          profile: { select: { displayName: true } },
        },
      },
      posts: {
        include: {
          _count: { select: { likes: true } },
          media: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { subscribers: true } },
    },
  });

  if (!channel || !channel.isActive) {
    notFound();
  }

  return (
    <section className="space-y-5">
      {query.created ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Канал создан и добавлен в раздел «Чаты».
        </p>
      ) : null}

      <header className="rounded-2xl border border-[var(--line)] bg-[var(--card-muted)] p-4">
        <h1 className="text-2xl font-semibold">{channel.title}</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Владелец: {channel.owner.profile?.displayName ?? `ID ${channel.owner.identifier}`}
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Подписчиков: {channel._count.subscribers}
        </p>
      </header>

      <p className="text-sm text-[var(--text-muted)]">
        {channel.description || "Описание канала пока пустое."}
      </p>

      {channel.posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card-muted)] px-4 py-8 text-sm text-[var(--text-muted)]">
          В канале пока нет постов.
        </div>
      ) : (
        <div className="space-y-3">
          {channel.posts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-[var(--line)] p-4">
              <p className="whitespace-pre-wrap text-sm leading-6">
                {post.text || "Без текста"}
              </p>
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                {formatDateTime(post.createdAt)} • медиа: {post.media.length} • лайки: {post._count.likes}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
