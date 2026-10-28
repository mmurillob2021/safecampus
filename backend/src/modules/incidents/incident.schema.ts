import { z } from "zod";
import { INCIDENT_STATUSES } from "@/types/domain";

// category and severity are codes from the parameter tables
// (incident-categories, severity-levels); the service checks they are active.
export const createIncidentSchema = z.object({
  category: z.string().trim().min(1),
  severity: z.string().trim().min(1).optional(),
  description: z.string().trim().max(2000).default(""),
  anonymous: z.boolean().default(false),
  photoUrl: z.string().min(1).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const updateIncidentStatusSchema = z.object({
  status: z.enum(INCIDENT_STATUSES),
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
