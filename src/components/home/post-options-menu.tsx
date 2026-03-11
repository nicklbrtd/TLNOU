"use client";

import Link from "next/link";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

interface PostOptionsMenuProps {
  editHref: string;
  deleteAction: string;
  returnTo: string;
}

export function PostOptionsMenu({
  editHref,
  deleteAction,
  returnTo,
}: PostOptionsMenuProps) {
  return (
    <details className="relative">
      <summary className="flex h-8 w-8 list-none items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--card-muted)] [&::-webkit-details-marker]:hidden">
        <Ellipsis className="h-4 w-4" />
      </summary>

      <div className="absolute right-0 top-9 z-10 w-44 overflow-hidden rounded-xl border border-[var(--line)]/70 bg-white shadow-[0_12px_24px_rgba(24,32,28,0.12)]">
        <Link
          href={editHref}
          className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--card-muted)]"
        >
          <Pencil className="h-4 w-4 text-[var(--text-muted)]" />
          Редактировать
        </Link>

        <form action={deleteAction} method="post">
          <input type="hidden" name="returnTo" value={returnTo} />
          <button
            type="submit"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--danger)] transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Удалить
          </button>
        </form>
      </div>
    </details>
  );
}
