import { z } from "zod";

export const createChatMessageSchema = z.object({
  roomId: z.string().cuid(),
  text: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 1, "Сообщение пустое")
    .refine((value) => value.length <= 1000, "Слишком длинное сообщение"),
});
