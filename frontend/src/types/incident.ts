export type IncidentCategory =
  | "THEFT"
  | "HARASSMENT"
  | "SUSPICIOUS_ACTIVITY"
  | "VANDALISM"
  | "OTHER";

export type IncidentStatus = "PENDING" | "REVIEWED" | "RESOLVED";

export interface Incident {
  id: string;
  userId: string;
  category: IncidentCategory;
  description: string;
  photoUrl?: string | null;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  createdAt: string;
}
