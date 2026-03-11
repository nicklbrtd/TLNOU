import { prisma } from "@/lib/prisma";

function normalizeBase(value: string) {
  const ascii = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 36);

  return ascii;
}

export async function createUniqueChannelSlug(params: {
  title: string;
  fallbackSeed: string;
}) {
  const normalized = normalizeBase(params.title);
  const base = normalized.length > 0 ? normalized : `channel-${params.fallbackSeed}`;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const exists = await prisma.channel.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!exists) {
      return candidate;
    }
  }

  return `${base}-${Date.now().toString(36)}`;
}
