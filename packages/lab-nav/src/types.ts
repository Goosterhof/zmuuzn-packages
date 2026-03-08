export type ExperimentId = "gatekeeper" | "war-table" | "crucible";

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
