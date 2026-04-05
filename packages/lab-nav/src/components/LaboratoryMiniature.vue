<script setup lang="ts">
import { ref, computed } from "vue";
import type { ExperimentId, RegistryExperiment } from "../types";
import { useVisitHistory } from "../composables/useVisitHistory";
import RoomTile from "./RoomTile.vue";

const { experiments, current, visible } = defineProps<{
  experiments: RegistryExperiment[];
  current: ExperimentId;
  visible: boolean;
}>();

const emit = defineEmits<{
  navigate: [url: string];
}>();

const departingId = ref<string | null>(null);

const { getLastVisited, getVisitCount } = useVisitHistory();

const prefersReducedMotion = computed(
  () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
);

const handleDepart = (experimentId: string, url: string): void => {
  if (prefersReducedMotion.value) {
    emit("navigate", url);
    return;
  }

  departingId.value = experimentId;

  /* Wait for departure animation, then navigate */
  setTimeout(() => {
    emit("navigate", url);
  }, 250);
};
</script>

<template>
  <div class="laboratory-miniature">
    <div class="miniature-floor">
      <RoomTile
        v-for="(experiment, index) in experiments"
        :key="experiment.id"
        :experiment="experiment"
        :current="current"
        :last-visited="getLastVisited(experiment.id)"
        :visit-count="getVisitCount(experiment.id)"
        :departing="departingId === experiment.id"
        :sibling-fade="departingId !== null && departingId !== experiment.id"
        :style="{ transitionDelay: visible ? `${String(index * 30)}ms` : '0ms' }"
        @depart="(url: string) => handleDepart(experiment.id, url)"
      />
    </div>
  </div>
</template>

<style scoped>
.laboratory-miniature {
  perspective: 800px;
  perspective-origin: 50% 30%;
}

.miniature-floor {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  transform: rotateX(8deg);
  transform-origin: center bottom;
  transform-style: preserve-3d;
}

@media (prefers-reduced-motion: reduce) {
  .laboratory-miniature {
    perspective: none;
  }

  .miniature-floor {
    transform: none;
  }
}
</style>
