import { z } from "zod";

export const createPersonalContactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
});

export type CreatePersonalContactInput = z.infer<typeof createPersonalContactSchema>;
