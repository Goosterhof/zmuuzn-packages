export type ExperimentId = "gatekeeper" | "war-table" | "crucible" | "parlour" | "smokestacks";

export interface RegistryExperiment {
  id: ExperimentId;
  label: string;
  url: string;
  accentColor: string;
  icon?: string;
}

export interface VisitRecord {
  count: number;
  lastVisited: number;
}

/**
 * Shadow colors per experiment — darkened accent for hard offset shadows.
 * Applied as the structural shadow beneath each room tile.
 */
export const EXPERIMENT_SHADOW_COLORS: Record<ExperimentId, string> = {
  gatekeeper: "#8B5E0A",
  "war-table": "#9E8200",
  crucible: "#7E2601",
  parlour: "#4A2290",
  smokestacks: "#15803D",
};

/* --- Legacy exports (kept for backward compatibility until consumers migrate) --- */

export type { ExperimentId as ExperimentIdLegacy };

export interface ExperimentConfig {
  id: ExperimentId;
  label: string;
  url: string;
  accentColor: string;
  exitLabel: string;
}

export interface LabUser {
  name: string;
}

export interface LocalNavItem {
  label: string;
  to: string;
  isActive?: boolean;
}
