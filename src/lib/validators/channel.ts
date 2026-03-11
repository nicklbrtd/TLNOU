import { z } from "zod";

export const createChannelSchema = z.object({
  title: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 2, "Название слишком короткое")
    .refine((value) => value.length <= 80, "Название слишком длинное"),
  description: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return null;
      }

      const normalized = value.trim();
      return normalized.length > 0 ? normalized : null;
    },
    z.string().max(1000).nullable(),
  ),
});
