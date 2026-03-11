"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppIcon, type AppIconName } from "@/components/icons";

interface NavLinkProps {
  href: string;
  label: string;
  icon: AppIconName;
}

export function NavLink({ href, label, icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-[var(--accent-soft)] text-[var(--accent)] shadow-[inset_0_0_0_1px_rgba(15,118,110,0.14)]"
          : "text-[var(--text-muted)] hover:bg-[var(--card-muted)] hover:text-[var(--text-primary)]"
      }`}
    >
      <AppIcon
        name={icon}
        className={`h-5 w-5 ${isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}
      />
      <span>{label}</span>
    </Link>
  );
}
