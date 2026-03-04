import type { ExperimentConfig } from "./types";

export const experiments: readonly ExperimentConfig[] = [
  {
    id: "gatekeeper",
    label: "Gatekeeper",
    url: "https://auth.zmuuzn.nl",
    accentColor: "#D97706",
  },
  {
    id: "war-table",
    label: "War Table",
    url: "https://helldivers.zmuuzn.nl",
    accentColor: "#FFD100",
  },
  {
    id: "crucible",
    label: "Crucible",
    url: "https://strava.zmuuzn.nl",
    accentColor: "#FC4C02",
  },
];
