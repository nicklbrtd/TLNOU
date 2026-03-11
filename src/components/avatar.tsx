import Image from "next/image";

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { className: "h-8 w-8 text-xs", pixels: 32 },
  md: { className: "h-10 w-10 text-sm", pixels: 40 },
  lg: { className: "h-14 w-14 text-base", pixels: 56 },
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((p) => p[0]?.toUpperCase()).join("");
  return initials || "?";
}

export function Avatar({ name, avatarUrl, size = "md" }: AvatarProps) {
  const sizeConfig = sizeClasses[size];
  const classes = sizeConfig.className;

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={sizeConfig.pixels}
        height={sizeConfig.pixels}
        className={`${classes} rounded-2xl border border-[var(--line)] object-cover`}
      />
    );
  }

  return (
    <div
      className={`${classes} flex items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--card-muted)] font-semibold text-[var(--text-muted)]`}
      aria-label={name}
    >
      {initialsFromName(name)}
    </div>
  );
}
