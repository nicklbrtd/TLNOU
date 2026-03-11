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
        <div className="pointer-events-auto rounded-2xl border border-[#dde4de] bg-[rgba(255,255,255,0.96)] p-1.5 shadow-[0_10px_24px_rgba(25,33,29,0.12)] backdrop-blur-[4px]">
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
