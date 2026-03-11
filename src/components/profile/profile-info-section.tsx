import { formatDate } from "@/lib/time";

interface ProfileInfoSectionProps {
  age: number | null;
  birthDate: Date | null;
}

export function ProfileInfoSection({ age, birthDate }: ProfileInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-[var(--card-muted)] px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Возраст
        </p>
        <p className="mt-1 text-base font-medium text-[var(--text-primary)]">{age ?? "—"}</p>
      </div>

      <div className="rounded-2xl bg-[var(--card-muted)] px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Дата рождения
        </p>
        <p className="mt-1 text-base font-medium text-[var(--text-primary)]">
          {birthDate ? formatDate(birthDate) : "—"}
        </p>
      </div>
    </div>
  );
}
