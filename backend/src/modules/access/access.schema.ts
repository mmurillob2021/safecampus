import { z } from "zod";

export const QR_PREFIX = "SAFECAMPUS:";

export const verifyAccessPassSchema = z.object({
  // Accepts the raw token or the full QR text ("SAFECAMPUS:<token>").
  code: z
    .string()
    .trim()
    .min(1)
    .transform((v) => (v.startsWith(QR_PREFIX) ? v.slice(QR_PREFIX.length) : v)),
});

export const listAccessPassesQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date debe tener formato AAAA-MM-DD")
    .optional(),
});
