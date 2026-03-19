"use client";

import { usePathname } from "next/navigation";

import type { AppIconName } from "@/components/icons";
import { BottomNavItem } from "@/components/bottom-nav-item";

interface BottomNavLink {
  href: string;
  label: string;
  icon: AppIconName;
}

interface BottomNavProps {
  links: BottomNavLink[];
}

export function BottomNav({ links }: BottomNavProps) {
  const pathname = usePathname();

  const activeHref = links.find(
    (link) => pathname === link.href || pathname.startsWith(`${link.href}/`),
  )?.href;

  const shouldHideOnMobileChatScreen = pathname.startsWith("/chats/");

  if (shouldHideOnMobileChatScreen) {
    return null;
  }

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:hidden"
      aria-label="Нижняя навигация"
    >
      <div
        className="mx-auto w-full max-w-[430px] px-4"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="pointer-events-auto rounded-2xl border border-[rgba(181,71,75,0.3)] bg-[rgba(12,16,27,0.9)] p-1.5 shadow-[0_14px_32px_rgba(4,7,14,0.55)] backdrop-blur-[8px]">
          <div className="grid grid-cols-3 items-center gap-1">
            {links.map((link, index) => (
              <BottomNavItem
                key={`${link.href}-${index}`}
                href={link.href}
                label={link.label}
                icon={link.icon}
                active={activeHref === link.href}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
