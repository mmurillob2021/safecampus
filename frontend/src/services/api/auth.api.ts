import { apiClient } from "@/services/api/client";
import type { User } from "@/types/user";

interface AuthResponse {
  token: string;
  user: User;
}

export function registerRequest(input: {
  fullName: string;
  email: string;
  password: string;
  studentId?: string;
  phone?: string;
}) {
  return apiClient.post<AuthResponse>("/auth/register", input).then((r) => r.data);
}

export function loginRequest(input: { email: string; password: string }) {
  return apiClient.post<AuthResponse>("/auth/login", input).then((r) => r.data);
}

export function forgotPasswordRequest(email: string) {
  return apiClient
    .post<{ message: string }>("/auth/forgot-password", { email })
    .then((r) => r.data);
}
