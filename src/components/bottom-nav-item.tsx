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
          ? "bg-[rgba(195,55,63,0.2)] text-[#ffd7dc]"
          : "text-[#9aa6c0] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#e6ecfb]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <AppIcon
        name={icon}
        className={`h-[17px] w-[17px] ${active ? "text-[#ffd7dc]" : "text-[#a2aec8]"}`}
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
