import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(2),
  place: z.string().trim().max(200).optional(),
  // Code from the severity-levels parameter table.
  severity: z.string().trim().min(1).optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
