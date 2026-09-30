import { apiClient } from "@/services/api/client";
import type { User } from "@/types/user";

export function fetchMe() {
  return apiClient.get<User>("/users/me").then((r) => r.data);
}

export function updateMeRequest(input: { fullName?: string; phone?: string; avatarUrl?: string }) {
  return apiClient.patch<User>("/users/me", input).then((r) => r.data);
}
