<script setup lang="ts">
import { computed } from "vue";
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
  const offset = isActive.value ? "3px 3px 0" : "2px 2px 0";
  const hard = `${offset} ${isActive.value ? experiment.accentColor : shadowColor.value}`;

  if (neverVisited.value) return hard;

  const ghost = `0 0 ${String(ghostSpread.value)}px rgba(${accentRgb.value}, ${String(ghostOpacity.value)})`;
  return `${hard}, ${ghost}`;
});

const computedBorder = computed(() => {
  const id = experiment.id;
  const accent = experiment.accentColor;
  const base = isActive.value ? accent : undefined;

  /* Per-experiment unique border treatments */
  if (id === "gatekeeper") {
    return {
      borderColor: base,
      borderLeftWidth: "4px",
    };
  }
  if (id === "war-table") {
    return {
      borderColor: base,
      borderWidth: "4px",
    };
  }
  if (id === "crucible") {
    return {
      borderColor: base,
      borderBottomColor: accent,
      borderBottomWidth: "3px",
    };
  }
  if (id === "smokestacks") {
    return {
      borderColor: base,
      borderTopColor: accent,
      borderTopWidth: "4px",
    };
  }

  /* Parlour + default */
  return { borderColor: base };
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
    @click="handleClick"
  >
    <span
      class="map-font-display block font-700 uppercase leading-tight"
      :class="neverVisited ? 'text-map-text-dim' : 'text-map-text'"
      style="font-size: 11px; letter-spacing: 1.5px"
    >
      {{ experiment.label }}
    </span>

    <span
      v-if="isActive"
      class="map-font-mono block font-600 uppercase mt-4px"
      :style="{ color: experiment.accentColor, fontSize: '8px', letterSpacing: '1px' }"
    >
      &#9679; YOU ARE HERE
    </span>
    <span
      v-else
      class="map-font-mono block font-500 mt-4px"
      :class="neverVisited ? 'text-map-text-dim' : 'text-map-text-muted'"
      style="font-size: 9px; letter-spacing: 0.5px"
    >
      {{ lastVisited }}
    </span>
  </a>
</template>

<style scoped>
.room-tile {
  transition-property: transform, opacity, filter, background-color, border-color, box-shadow;
  transition-duration: 120ms;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}

.room-tile:hover:not(.room-tile--departing):not(.room-tile--sibling-fade):not(
    [aria-current="page"]
  ) {
  background-color: #252545;
  border-color: #3d3d6b;
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
