interface ProfileSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ProfileSection({ title, subtitle, children }: ProfileSectionProps) {
  return (
    <section className="rounded-3xl border border-[var(--line)]/70 bg-[var(--card)] p-5 shadow-[0_10px_26px_rgba(27,36,31,0.04)] sm:p-6">
      <header className="border-b border-[var(--line)]/60 pb-3">
        <h3 className="text-[18px] font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h3>
        {subtitle ? <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p> : null}
      </header>

      <div className="pt-4">{children}</div>
    </section>
  );
}
