import { Avatar } from "@/components/avatar";
import type { AppIconName } from "@/components/icons";
import { AppIcon } from "@/components/icons";
import { BottomNav } from "@/components/bottom-nav";
import { NavLink } from "@/components/nav-link";
import { SignOutButton } from "@/components/sign-out-button";
import { requireUser } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

const DESKTOP_LINKS: Array<{ href: string; label: string; icon: AppIconName }> = [
  { href: "/feed", label: "Главная", icon: "feed" },
  { href: "/chats", label: "Чаты", icon: "chats" },
  { href: "/profile", label: "Профиль", icon: "profile" },
  { href: "/memory", label: "Архив", icon: "memory" },
];

const MOBILE_BOTTOM_LINKS: Array<{ href: string; label: string; icon: AppIconName }> = [
  { href: "/feed", label: "Главная", icon: "feed" },
  { href: "/chats", label: "Чаты", icon: "chats" },
  { href: "/profile", label: "Профиль", icon: "profile" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const links = [...DESKTOP_LINKS];
  const displayName = user.profile?.displayName ?? `ID ${user.identifier}`;

  return (
    <div
      className="mx-auto min-h-screen w-full max-w-6xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10"
      style={{ paddingBottom: "calc(4.25rem + env(safe-area-inset-bottom))" }}
    >
      <div className="grid gap-4 lg:grid-cols-[250px_1fr]">
        <aside className="cinematic-surface hidden rounded-3xl p-4 cinematic-fade-up lg:block">
          <div className="rounded-2xl bg-[var(--card-muted)]/95 p-3">
            <div className="flex items-center gap-3">
              <Avatar name={displayName} avatarUrl={user.profile?.avatarUrl} size="md" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  ТЛНОУ
                </p>
                <p className="text-sm font-semibold">{displayName}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">Закрытый digital-space вашей группы</p>
          </div>

          <nav className="mt-4 flex flex-col gap-1">
            {links.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} icon={link.icon} />
            ))}
          </nav>

          <div className="mt-5 border-t border-[var(--line)] pt-4">
            <SignOutButton />
          </div>
        </aside>

        <main className="cinematic-surface cinematic-fade-up rounded-3xl p-4 sm:p-6">
          {children}
        </main>
      </div>

      <BottomNav links={MOBILE_BOTTOM_LINKS} />

      <div className="pointer-events-none fixed right-4 top-4 hidden rounded-full border border-[rgba(208,71,74,0.3)] bg-[rgba(249,236,238,0.75)] p-2 shadow-[0_8px_22px_rgba(164,27,43,0.24)] lg:block">
        <AppIcon name="spark" className="h-4 w-4 text-[var(--accent)]" />
      </div>
    </div>
  );
}
