import { z } from "zod";

export const createIncidentSchema = z.object({
  category: z.enum(["THEFT", "HARASSMENT", "SUSPICIOUS_ACTIVITY", "VANDALISM", "OTHER"]),
  description: z.string().min(10),
  photoUrl: z.string().url().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const updateIncidentStatusSchema = z.object({
  status: z.enum(["PENDING", "REVIEWED", "RESOLVED"]),
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
