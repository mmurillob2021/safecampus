export type Role = "STUDENT" | "SECURITY" | "ADMIN";

export interface User {
  id: string;
  fullName: string;
  email: string;
  studentId?: string | null;
  phone?: string | null;
  role: Role;
  avatarUrl?: string | null;
  createdAt: string;
}
