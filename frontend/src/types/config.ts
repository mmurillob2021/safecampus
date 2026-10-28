export interface IncidentCategoryOption {
  code: string;
  label: string;
  order: number;
  active: boolean;
}

export interface SeverityLevel {
  code: string;
  label: string;
  color: string;
  order: number;
  active: boolean;
}

export interface SafetyPoint {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  order: number;
  active: boolean;
}

export interface AppSettingValue {
  value: string;
  updatedAt: string;
}

/** GET /config: active catalogs + settings used to render the app. */
export interface AppConfig {
  settings: Record<string, AppSettingValue>;
  incidentCategories: IncidentCategoryOption[];
  severityLevels: SeverityLevel[];
  safetyPoints: SafetyPoint[];
}

// --- Admin config module (GET /config/tables) ---

export type ConfigFieldType = "string" | "text" | "number" | "boolean" | "color";

export interface ConfigField {
  name: string;
  label: string;
  type: ConfigFieldType;
  required?: boolean;
  help?: string;
}

export interface ConfigTable {
  key: string;
  label: string;
  description: string;
  idField: string;
  idGenerated: boolean;
  fields: ConfigField[];
}

export type ConfigRow = Record<string, string | number | boolean | null>;
