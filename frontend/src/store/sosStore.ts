import { create } from "zustand";
import type { EmergencyAlert } from "@/types/alert";

interface SosState {
  activeAlert: EmergencyAlert | null;
  setActiveAlert: (alert: EmergencyAlert | null) => void;
}

export const useSosStore = create<SosState>((set) => ({
  activeAlert: null,
  setActiveAlert: (alert) => set({ activeAlert: alert }),
}));
