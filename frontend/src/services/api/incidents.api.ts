import { apiClient } from "@/services/api/client";
import type { Incident, IncidentCategory } from "@/types/incident";

export interface CreateIncidentInput {
  category: IncidentCategory;
  severity?: string;
  description: string;
  anonymous?: boolean;
  photoUrl?: string;
  latitude: number;
  longitude: number;
}

export function createIncidentRequest(input: CreateIncidentInput) {
  return apiClient.post<Incident>("/incidents", input).then((r) => r.data);
}

export function fetchMyIncidents() {
  return apiClient.get<Incident[]>("/incidents/mine").then((r) => r.data);
}
