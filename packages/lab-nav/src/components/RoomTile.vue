<script setup lang="ts">
import { computed, ref } from "vue";
import { type ExperimentId, type RegistryExperiment, EXPERIMENT_SHADOW_COLORS } from "../types";

const { experiment, current, lastVisited, visitCount, departing, siblingFade } = defineProps<{
  experiment: RegistryExperiment;
  current: ExperimentId;
  lastVisited: string;
  visitCount: number;
  departing: boolean;
  siblingFade: boolean;
}>();

const emit = defineEmits<{
  depart: [url: string];
}>();

const isHovered = ref(false);
const isActive = computed(() => experiment.id === current);

const ghostIntensity = computed(() => Math.min(visitCount / 20, 1.0));

const ghostSpread = computed(() => 4 + ghostIntensity.value * 12);

const ghostOpacity = computed(() => 0.1 + ghostIntensity.value * 0.5);

const isFrequent = computed(() => ghostIntensity.value > 0.5);

const neverVisited = computed(() => visitCount === 0 && !isActive.value);

const shadowColor = computed(() => EXPERIMENT_SHADOW_COLORS[experiment.id] ?? "#2E2E52");

/**
 * Convert hex accent to RGB components for rgba() in box-shadow.
 */
const accentRgb = computed(() => {
  const hex = experiment.accentColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${String(r)}, ${String(g)}, ${String(b)}`;
});

const computedShadow = computed(() => {
  const offset = isActive.value ? "3px 3px 0" : isHovered.value ? "1px 1px 0" : "2px 2px 0";
  const hard = `${offset} ${isActive.value ? experiment.accentColor : shadowColor.value}`;
  const inset = computedInset.value;

  const layers = [hard];
  if (!neverVisited.value) {
    layers.push(
      `0 0 ${String(ghostSpread.value)}px rgba(${accentRgb.value}, ${String(ghostOpacity.value)})`,
    );
  }
  if (inset !== "none") layers.push(inset);

  return layers.join(", ");
});

const computedBorder = computed(() => {
  const id = experiment.id;
  const accent = experiment.accentColor;
  const base = isActive.value ? accent : undefined;

  /* Crucible: always-hot bottom border via border color */
  if (id === "crucible") {
    return { borderColor: base, borderBottomColor: accent };
  }
  /* Smokestacks: pipe-top always visible via border color */
  if (id === "smokestacks") {
    return { borderColor: base, borderTopColor: accent };
  }

  return { borderColor: base };
});

/**
 * Per-experiment visual character expressed as inset box-shadows.
 * Uses inset shadows instead of asymmetric border widths to avoid
 * layout geometry shifts in the grid (VA-004/VA-005).
 */
const computedInset = computed(() => {
  const id = experiment.id;
  const accent = experiment.accentColor;
  const border = "#2E2E52";
  const color = isActive.value ? accent : border;

  /* Gatekeeper: reinforced left edge — vault door hinge */
  if (id === "gatekeeper") return `inset 2px 0 0 ${color}`;
  /* War Room: double-thick on all sides — military fortification */
  if (id === "war-table") return `inset 0 0 0 2px ${color}`;
  /* Crucible: hot floor glow beneath */
  if (id === "crucible") return `inset 0 -1px 0 ${accent}`;
  /* Smokestacks: pipe emerging from roof */
  if (id === "smokestacks") return `inset 0 2px 0 ${isActive.value ? accent : border}`;

  return "none";
});

const computedRadius = computed(() => (experiment.id === "parlour" ? "8px" : "0px"));

const handleClick = (event: MouseEvent): void => {
  event.preventDefault();
  if (isActive.value) return;
  emit("depart", experiment.url);
};
</script>

<template>
  <a
    :href="experiment.url"
    class="room-tile block bg-map-surface border-2 border-map-border p-8px min-h-72px no-underline transition-all map-focus"
    :class="[
      departing ? 'room-tile--departing' : '',
      siblingFade ? 'room-tile--sibling-fade' : '',
      isActive ? 'bg-map-elevated' : '',
      isFrequent && !isActive ? 'room-tile--frequent' : '',
      neverVisited ? 'room-tile--dormant' : '',
    ]"
    :style="{
      ...computedBorder,
      boxShadow: computedShadow,
      borderRadius: computedRadius,
    }"
    :aria-current="isActive ? 'page' : undefined"
    :aria-disabled="isActive ? 'true' : undefined"
    :tabindex="isActive ? -1 : undefined"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span class="map-text-room block" :class="neverVisited ? 'text-map-text-dim' : 'text-map-text'">
      {{ experiment.label }}
    </span>

    <span
      v-if="isActive"
      class="map-text-badge block mt-4px"
      :style="{ color: experiment.accentColor }"
    >
      &#9679; YOU ARE HERE
    </span>
    <span
      v-else
      class="map-text-timestamp block mt-4px"
      :class="neverVisited ? 'text-map-text-dim' : 'text-map-text-muted'"
    >
      {{ lastVisited }}
    </span>
  </a>
</template>

<style scoped>
.room-tile {
  /* Token aliases — single source for values used in pseudo-selectors */
  --room-bg-elevated: #252545;
  --room-border-strong: #3d3d6b;

  transition-property: transform, opacity, filter, background-color, border-color, box-shadow;
  transition-duration: 120ms;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}

.room-tile:hover:not(.room-tile--departing):not(.room-tile--sibling-fade):not(
    [aria-current="page"]
  ) {
  background-color: var(--room-bg-elevated);
  border-color: var(--room-border-strong);
  transform: translate(1px, 1px);
}

.room-tile--departing {
  transform: scale(1.08);
  filter: brightness(1.3);
  z-index: 9992;
  transition-duration: 250ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.room-tile--sibling-fade {
  opacity: 0.15;
  filter: blur(1px);
  transition-duration: 250ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.room-tile--frequent {
  animation: map-ghost-breathe 4s ease-in-out infinite;
}

.room-tile[aria-current="page"] {
  cursor: default;
}

.room-tile--dormant {
  cursor: pointer;
}

@media (prefers-reduced-motion: reduce) {
  .room-tile,
  .room-tile--departing,
  .room-tile--sibling-fade {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
