/** Code from the incident-categories parameter table (e.g. "THEFT"). */
export type IncidentCategory = string;

export type IncidentStatus = "PENDING" | "REVIEWED" | "RESOLVED";

export interface Incident {
  id: string;
  userId: string;
  category: IncidentCategory;
  severity?: string | null;
  description: string;
  anonymous: boolean;
  photoUrl?: string | null;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  createdAt: string;
  categoryRef?: { label: string };
  severityRef?: { label: string; color: string } | null;
}
