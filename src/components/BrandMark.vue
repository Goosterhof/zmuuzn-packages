<script setup lang="ts">
import { computed } from "vue";
import type { ExperimentId } from "../types";
import { experiments } from "../experiments";

const { size = "sm", currentExperiment } = defineProps<{
  size?: "sm" | "xs";
  currentExperiment?: ExperimentId;
}>();

const experimentLabel = computed(() => experiments.find((e) => e.id === currentExperiment)?.label);

const sizeTokens = computed(() =>
  size === "xs"
    ? {
        starSize: "5px",
        starGap: "1.5px",
        starsPadding: "5px 7px",
        wordmarkSize: "14px",
        wordmarkTracking: "0.5px",
        wordmarkPadding: "5px 10px",
        appNameSize: "9px",
        appNameTracking: "1px",
        appNamePadding: "5px 8px",
      }
    : {
        starSize: "7px",
        starGap: "2px",
        starsPadding: "8px 10px",
        wordmarkSize: "20px",
        wordmarkTracking: "1px",
        wordmarkPadding: "8px 14px",
        appNameSize: "11px",
        appNameTracking: "1.5px",
        appNamePadding: "8px 12px",
      },
);
</script>

<template>
  <div
    inline-flex
    items-stretch
    overflow-hidden
    :style="{
      border: '2px solid #1A1A1A',
      boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
    }"
  >
    <!-- Segment 1: Stars -->
    <div
      flex
      items-center
      :style="{
        backgroundColor: '#C8102E',
        padding: sizeTokens.starsPadding,
        borderRight: '2px solid #1A1A1A',
      }"
    >
      <div flex items-center :style="{ gap: sizeTokens.starGap }">
        <svg
          v-for="i in 7"
          :key="i"
          viewBox="0 0 12 12"
          :style="{ width: sizeTokens.starSize, height: sizeTokens.starSize }"
        >
          <polygon
            points="6,0 7.4,4.3 12,4.3 8.3,7 9.7,11.2 6,8.5 2.3,11.2 3.7,7 0,4.3 4.6,4.3"
            fill="#F0D040"
          />
        </svg>
      </div>
    </div>

    <!-- Segment 2: Wordmark -->
    <div flex items-center :style="{ padding: sizeTokens.wordmarkPadding }">
      <span
        lab-font-display
        :style="{
          fontSize: sizeTokens.wordmarkSize,
          fontWeight: 900,
          letterSpacing: sizeTokens.wordmarkTracking,
          color: '#F5F0E8',
          lineHeight: 1,
        }"
      >
        zmuuzn
      </span>
    </div>

    <!-- Segment 3: App Name (conditional) -->
    <div
      v-if="experimentLabel"
      flex
      items-center
      :style="{
        backgroundColor: '#1A1A1A',
        padding: sizeTokens.appNamePadding,
        borderLeft: '2px solid #1A1A1A',
      }"
    >
      <span
        lab-font-display
        :style="{
          fontSize: sizeTokens.appNameSize,
          fontWeight: 800,
          letterSpacing: sizeTokens.appNameTracking,
          textTransform: 'uppercase',
          color: '#F0D040',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }"
      >
        {{ experimentLabel }}
      </span>
    </div>
  </div>
</template>
