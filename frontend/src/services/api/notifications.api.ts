import { apiClient } from "@/services/api/client";
import type { Notification } from "@/types/notification";

export function fetchNotifications() {
  return apiClient.get<Notification[]>("/notifications").then((r) => r.data);
}

export function markNotificationReadRequest(notificationId: string) {
  return apiClient.patch(`/notifications/${notificationId}/read`);
}
