<script setup lang="ts">
import { computed } from "vue";
import type { ExperimentId } from "../types";
import { experiments } from "../experiments";

const { currentExperiment } = defineProps<{
  currentExperiment: ExperimentId;
}>();

const accentColor = computed(
  () => experiments.find((e) => e.id === currentExperiment)?.accentColor ?? "#E0E0E0",
);
</script>

<template>
  <nav aria-label="Experiments">
    <ul flex items-center gap-1 list-none m-0 p-0>
      <li v-for="exp in experiments" :key="exp.id">
        <span
          v-if="exp.id === currentExperiment"
          class="text-[#E0E0E0]"
          text-sm
          font-600
          px-3
          py-1
          border-b-2
          :style="{ borderBottomColor: accentColor }"
        >
          {{ exp.label }}
        </span>
        <a
          v-else
          :href="exp.url"
          class="text-[#9E9EBF] hover:text-[#E0E0E0]"
          text-sm
          px-3
          py-1
          no-underline
          border-b-2
          border-transparent
          transition-colors
        >
          {{ exp.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
