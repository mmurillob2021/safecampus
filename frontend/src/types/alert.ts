export type AlertStatus = "ACTIVE" | "RESOLVED" | "CANCELLED";

export interface EmergencyAlert {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  status: AlertStatus;
  createdAt: string;
  resolvedAt?: string | null;
  user?: { fullName: string; phone?: string | null };
}
