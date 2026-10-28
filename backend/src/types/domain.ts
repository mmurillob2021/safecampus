/**
 * Domain value sets. SQLite has no native enums in Prisma 5, so the columns
 * are strings and these constants are the single source of truth (used by
 * zod schemas and TypeScript types).
 */
export const ROLES = ["STUDENT", "SECURITY", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ALERT_STATUSES = ["ACTIVE", "RESOLVED", "CANCELLED"] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

export const INCIDENT_STATUSES = ["PENDING", "REVIEWED", "RESOLVED"] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];
