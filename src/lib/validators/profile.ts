import { z } from "zod";

function nullableTrimmedText(maxLength: number) {
  return z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return null;
      }

      const normalized = value.trim();
      return normalized.length > 0 ? normalized : null;
    },
    z.string().max(maxLength).nullable(),
  );
}

const usernameSchema = z
  .string()
  .regex(
    /^[a-z0-9_]{3,24}$/,
    "Username должен содержать 3-24 символа: a-z, 0-9 и _",
  );

function nullableUsername() {
  return z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return null;
      }

      const normalized = value.trim().toLowerCase().replace(/^@+/, "");
      return normalized.length > 0 ? normalized : null;
    },
    usernameSchema.nullable(),
  );
}

export const updateProfileSchema = z.object({
  username: nullableUsername(),
  bio: nullableTrimmedText(280),
});
