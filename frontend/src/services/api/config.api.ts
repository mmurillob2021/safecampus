import { apiClient } from "@/services/api/client";
import type { AppConfig, ConfigRow, ConfigTable } from "@/types/config";

export function fetchAppConfig() {
  return apiClient.get<AppConfig>("/config").then((r) => r.data);
}

// --- Admin only ---

export function fetchConfigTables() {
  return apiClient.get<ConfigTable[]>("/config/tables").then((r) => r.data);
}

export function fetchConfigRows(tableKey: string) {
  return apiClient.get<ConfigRow[]>(`/config/tables/${tableKey}`).then((r) => r.data);
}

export function createConfigRow(tableKey: string, data: ConfigRow) {
  return apiClient.post<ConfigRow>(`/config/tables/${tableKey}`, data).then((r) => r.data);
}

export function updateConfigRow(tableKey: string, id: string, data: ConfigRow) {
  return apiClient
    .patch<ConfigRow>(`/config/tables/${tableKey}/${encodeURIComponent(id)}`, data)
    .then((r) => r.data);
}

export function deleteConfigRow(tableKey: string, id: string) {
  return apiClient.delete(`/config/tables/${tableKey}/${encodeURIComponent(id)}`);
}
