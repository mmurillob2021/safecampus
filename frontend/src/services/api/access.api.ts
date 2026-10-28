import { apiClient } from "@/services/api/client";
import type { AccessPass } from "@/types/access";

/** Requests a new QR pass. The backend logs the request date and time. */
export function createAccessPassRequest() {
  return apiClient.post<AccessPass>("/access-passes").then((r) => r.data);
}

export function fetchActiveAccessPass() {
  return apiClient.get<{ pass: AccessPass | null }>("/access-passes/active").then((r) => r.data.pass);
}
