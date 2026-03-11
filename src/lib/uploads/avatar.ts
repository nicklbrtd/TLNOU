import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_AVATAR_BYTES = 3 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const FALLBACK_EXT_ALLOWLIST = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export type AvatarUploadErrorCode = "avatar_too_large" | "avatar_invalid_type" | "avatar_upload_failed";

export class AvatarUploadError extends Error {
  code: AvatarUploadErrorCode;

  constructor(code: AvatarUploadErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

function getExtension(file: File) {
  const fromMime = MIME_TO_EXT[file.type.toLowerCase()];
  if (fromMime) {
    return fromMime;
  }

  const ext = path.extname(file.name).toLowerCase();
  if (FALLBACK_EXT_ALLOWLIST.has(ext)) {
    return ext === ".jpeg" ? ".jpg" : ext;
  }

  return null;
}

export async function saveAvatarImage(file: File) {
  if (file.size > MAX_AVATAR_BYTES) {
    throw new AvatarUploadError("avatar_too_large", "Avatar is too large");
  }

  const extension = getExtension(file);

  if (!extension) {
    throw new AvatarUploadError("avatar_invalid_type", "Avatar has invalid mime type");
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${randomUUID()}${extension}`;
    const relativePath = path.join("uploads", "avatars", fileName);
    const absolutePath = path.join(process.cwd(), "public", relativePath);

    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, bytes);

    return `/${relativePath.replaceAll(path.sep, "/")}`;
  } catch (error) {
    throw new AvatarUploadError("avatar_upload_failed", `Failed to upload avatar: ${String(error)}`);
  }
}
