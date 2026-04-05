import "./fonts.css";
import "virtual:uno.css";

/* --- New Lab Map (v1.0.0) --- */
export { default as LabMap } from "./components/LabMap.vue";
export type { RegistryExperiment, ExperimentId, VisitRecord } from "./types";

/* --- Legacy exports (kept for backward compatibility during consumer migration) --- */
export { default as BrandMark } from "./components/BrandMark.vue";
export { default as LabBar } from "./components/LabBar.vue";
export { default as LabBarMobile } from "./components/LabBarMobile.vue";
export { default as ExperimentSwitcher } from "./components/ExperimentSwitcher.vue";
export { default as UserMenu } from "./components/UserMenu.vue";
export type { ExperimentConfig, LabUser, LocalNavItem } from "./types";
export { experiments } from "./experiments";
