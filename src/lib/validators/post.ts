import { z } from "zod";

function normalizedText(min: number, max: number, fieldName: string) {
  return z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= min, `${fieldName} слишком короткий`)
    .refine((value) => value.length <= max, `${fieldName} слишком длинный`);
}

export const postTextSchema = z.object({
  text: normalizedText(1, 2000, "Текст поста"),
});

export const commentTextSchema = z.object({
  text: normalizedText(1, 300, "Комментарий"),
});
