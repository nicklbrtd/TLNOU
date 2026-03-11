interface ProfileInterestsProps {
  interestsRaw: string | null;
}

function parseInterests(raw: string | null) {
  if (!raw) {
    return [];
  }

  return raw
    .split(/[\n,;|]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 16);
}

export function ProfileInterests({ interestsRaw }: ProfileInterestsProps) {
  const interests = parseInterests(interestsRaw);

  if (interests.length === 0) {
    return <p className="text-sm text-[var(--text-muted)]">Пока интересы не заполнены.</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {interests.map((interest) => (
        <li
          key={interest}
          className="rounded-full border border-[var(--line)]/80 bg-[var(--card-muted)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)]"
        >
          {interest}
        </li>
      ))}
    </ul>
  );
}
