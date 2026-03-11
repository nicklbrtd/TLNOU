import { z } from "zod";

const usernameSchema = z
  .string()
  .regex(
    /^[a-z0-9_]{3,24}$/,
    "Username должен содержать 3-24 символа: a-z, 0-9 и _",
  );

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .regex(/^[0-9]{3,12}$/, "Укажите корректный идентификационный номер"),
  password: z
    .string()
    .min(6, "Пароль должен быть минимум 6 символов")
    .max(128, "Пароль слишком длинный"),
});

export const createMemberSchema = z.object({
  identifier: z
    .string()
    .trim()
    .regex(/^[0-9]{3,12}$/, "ID должен быть от 3 до 12 цифр"),
  password: z
    .string()
    .min(8, "Пароль должен быть минимум 8 символов")
    .max(128, "Пароль слишком длинный"),
  displayName: z
    .string()
    .trim()
    .min(2, "Имя слишком короткое")
    .max(60, "Имя слишком длинное"),
  username: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return undefined;
      }

      const normalized = value.trim().toLowerCase().replace(/^@+/, "");
      return normalized.length > 0 ? normalized : undefined;
    },
    usernameSchema.optional(),
  ),
  age: z
    .preprocess(
      (value) => {
        if (value === "" || value === null || value === undefined) {
          return undefined;
        }
        return Number(value);
      },
      z.number().int().min(14).max(99).optional(),
    )
    .optional(),
  birthDate: z.preprocess(
    (value) => {
      if (typeof value !== "string" || value.trim().length === 0) {
        return undefined;
      }
      return new Date(value);
    },
    z.date().optional(),
  ),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  bio: z
    .string()
    .trim()
    .max(280, "Bio слишком длинное")
    .optional()
    .or(z.literal("")),
});
