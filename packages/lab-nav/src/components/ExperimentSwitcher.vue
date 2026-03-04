<script setup lang="ts">
import { computed } from "vue";
import type { ExperimentId } from "../types";
import { experiments } from "../experiments";

const { currentExperiment } = defineProps<{
  currentExperiment: ExperimentId;
}>();

const accentColor = computed(
  () => experiments.find((e) => e.id === currentExperiment)?.accentColor ?? "#F5F0E8",
);
</script>

<template>
  <nav aria-label="Experiments">
    <ul flex items-center gap-1 list-none m-0 p-0>
      <li v-for="exp in experiments" :key="exp.id">
        <span
          v-if="exp.id === currentExperiment"
          text-lab-active
          lab-font-mono
          text-sm
          font-500
          uppercase
          tracking-wider
          px-3
          py-1
          flex
          items-center
          gap-2
          border-b-2
          :style="{
            borderBottomColor: accentColor,
            boxShadow: `0 2px 8px ${accentColor}66`,
          }"
        >
          <i
            inline-block
            w-1.5
            h-1.5
            rounded-full
            shrink-0
            :style="{
              backgroundColor: accentColor,
              boxShadow: `0 0 6px ${accentColor}`,
              animation: 'lab-glow-pulse 3s ease-in-out infinite',
            }"
          />
          {{ exp.label }}
        </span>
        <a
          v-else
          :href="exp.url"
          text-lab-muted
          hover:text-lab-active
          lab-font-mono
          lab-focus
          text-sm
          font-400
          uppercase
          tracking-wider
          px-3
          py-1
          no-underline
          border-b-2
          border-transparent
          transition-colors
          flex
          items-center
          gap-2
        >
          <i
            inline-block
            w-1.5
            h-1.5
            rounded-full
            shrink-0
            :style="{ backgroundColor: exp.accentColor, opacity: 0.4 }"
          />
          {{ exp.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
