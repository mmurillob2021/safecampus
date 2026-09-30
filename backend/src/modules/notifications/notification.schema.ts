import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(2),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
