"use client";

import Link from "next/link";

import { AppIcon, type AppIconName } from "@/components/icons";

interface BottomNavItemProps {
  href: string;
  label: string;
  icon: AppIconName;
  active: boolean;
}

export function BottomNavItem({ href, label, icon, active }: BottomNavItemProps) {
  return (
    <Link
      href={href}
      className={`flex h-12 w-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-center transition-colors duration-200 ${
        active
          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
          : "text-[var(--text-muted)] hover:bg-[var(--card-muted)] hover:text-[var(--text-primary)]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <AppIcon
        name={icon}
        className={`h-[17px] w-[17px] ${active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}
      />
      <span
        className={`max-w-full truncate whitespace-nowrap text-[10px] leading-none tracking-[0.01em] ${
          active ? "font-semibold" : "font-medium"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
