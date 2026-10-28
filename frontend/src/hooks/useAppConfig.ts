import { useEffect } from "react";
import { useConfigStore } from "@/store/configStore";

/** Loads the campus configuration once and exposes typed helpers. */
export function useAppConfig() {
  const config = useConfigStore((s) => s.config);
  const loading = useConfigStore((s) => s.loading);
  const error = useConfigStore((s) => s.error);
  const load = useConfigStore((s) => s.load);

  useEffect(() => {
    if (!config) load();
  }, [config, load]);

  function setting(key: string, fallback = ""): string {
    return config?.settings[key]?.value ?? fallback;
  }

  function numberSetting(key: string, fallback: number): number {
    const value = Number(config?.settings[key]?.value);
    return Number.isFinite(value) ? value : fallback;
  }

  return {
    config,
    loading,
    error,
    reload: load,
    setting,
    numberSetting,
    settingUpdatedAt: (key: string) => config?.settings[key]?.updatedAt,
    incidentCategories: config?.incidentCategories ?? [],
    severityLevels: config?.severityLevels ?? [],
    safetyPoints: config?.safetyPoints ?? [],
  };
}
