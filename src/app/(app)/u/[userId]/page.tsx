import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/avatar";
import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/time";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await requireUser();
  const { userId } = await params;

  const target = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      ownedChannel: {
        select: {
          slug: true,
          title: true,
        },
      },
      posts: {
        where: { isDeleted: false },
        select: {
          id: true,
          text: true,
          createdAt: true,
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!target || !target.isActive) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-[var(--line)] bg-[var(--card-muted)] p-4">
        <div className="flex items-center gap-3">
          <Avatar
            name={target.profile?.displayName ?? `ID ${target.identifier}`}
            avatarUrl={target.profile?.avatarUrl}
            size="lg"
          />
          <div>
            <h1 className="text-2xl font-semibold">
              {target.profile?.displayName ?? `ID ${target.identifier}`}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {target.profile?.username
                ? `@${target.profile.username}`
                : `ID ${target.identifier}`}
            </p>
          </div>
        </div>
      </header>

      <article className="rounded-2xl border border-[var(--line)] p-4 text-sm">
        <p>
          <span className="text-[var(--text-muted)]">Возраст:</span>{" "}
          {target.profile?.age ?? "—"}
        </p>
        <p className="mt-1">
          <span className="text-[var(--text-muted)]">Дата рождения:</span>{" "}
          {target.profile?.birthDate ? formatDate(target.profile.birthDate) : "—"}
        </p>
        <p className="mt-1">
          <span className="text-[var(--text-muted)]">Bio:</span>{" "}
          {target.profile?.bio || "Пока нет описания"}
        </p>
        {target.ownedChannel ? (
          <Link
            href={`/channel/${target.ownedChannel.slug}`}
            className="mt-3 inline-flex rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
          >
            Канал: {target.ownedChannel.title}
          </Link>
        ) : null}
      </article>

      <section className="rounded-2xl border border-[var(--line)] p-4">
        <h2 className="text-lg font-semibold">Последние посты</h2>
        {target.posts.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--text-muted)]">У пользователя пока нет постов.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {target.posts.map((post) => (
              <li key={post.id} className="rounded-xl border border-[var(--line)] p-3 text-sm">
                <p>{post.text ?? "Без текста"}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {formatDate(post.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
