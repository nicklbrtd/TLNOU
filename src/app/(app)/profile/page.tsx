import { CompactProfileCard } from "@/components/profile/compact-profile-card";
import { ProfilePostsSection } from "@/components/profile/profile-posts-section";
import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const user = await requireUser();
  const query = await searchParams;

  const [profile, myPosts] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        displayName: true,
        username: true,
        avatarUrl: true,
        bio: true,
        age: true,
        birthDate: true,
      },
    }),
    prisma.post.findMany({
      where: {
        authorId: user.id,
        isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
      take: 16,
      include: {
        media: {
          select: { id: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
    }),
  ]);

  const displayName = profile?.displayName ?? `ID ${user.identifier}`;

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      {query.deleted ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          Публикация удалена.
        </p>
      ) : null}

      <CompactProfileCard
        displayName={displayName}
        username={profile?.username ?? null}
        avatarUrl={profile?.avatarUrl ?? null}
        bio={profile?.bio ?? null}
        age={profile?.age ?? null}
        birthDate={profile?.birthDate ?? null}
      />

      <ProfilePostsSection
        posts={myPosts.map((post) => ({
          id: post.id,
          text: post.text,
          createdAt: post.createdAt,
          likesCount: post._count.likes,
          commentsCount: post._count.comments,
          mediaCount: post.media.length,
        }))}
      />
    </section>
  );
}
