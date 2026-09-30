import { create } from "zustand";
import type { User } from "@/types/user";

interface AuthState {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  updateUser: (user: User) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setSession: (token, user) => set({ token, user }),
  updateUser: (user) => set({ user }),
  clearSession: () => set({ token: null, user: null }),
}));
