import { create } from "zustand";
import { fetchAppConfig } from "@/services/api/config.api";
import type { AppConfig } from "@/types/config";

interface ConfigState {
  config: AppConfig | null;
  loading: boolean;
  error: string | null;
  /** Fetch the parameter tables from the API (SQLite). */
  load: () => Promise<void>;
  clear: () => void;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: null,
  loading: false,
  error: null,
  load: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      set({ config: await fetchAppConfig(), loading: false });
    } catch {
      set({ loading: false, error: "No se pudo cargar la configuración del campus." });
    }
  },
  clear: () => set({ config: null, error: null }),
}));
