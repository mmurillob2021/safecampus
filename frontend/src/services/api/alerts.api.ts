import { apiClient } from "@/services/api/client";
import type { EmergencyAlert } from "@/types/alert";

export function createAlertRequest(coords: { latitude: number; longitude: number }) {
  return apiClient.post<EmergencyAlert>("/alerts", coords).then((r) => r.data);
}

export function resolveAlertRequest(alertId: string) {
  return apiClient.patch<EmergencyAlert>(`/alerts/${alertId}/resolve`).then((r) => r.data);
}

export function fetchMyAlerts() {
  return apiClient.get<EmergencyAlert[]>("/alerts/mine").then((r) => r.data);
}

export function fetchActiveAlerts() {
  return apiClient.get<EmergencyAlert[]>("/alerts").then((r) => r.data);
}
