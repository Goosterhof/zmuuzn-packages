<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import type { ExperimentId } from "../types";
import { useRegistryFetcher } from "../composables/useRegistryFetcher";
import { useVisitHistory } from "../composables/useVisitHistory";
import LaboratoryMiniature from "./LaboratoryMiniature.vue";

const { current, position } = defineProps<{
  current: ExperimentId;
  position?: "bottom-right" | "bottom-left";
}>();

const resolvedPosition = computed(() => position ?? "bottom-right");

const isOpen = ref(false);
const buttonRef = ref<HTMLButtonElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);

const { experiments, loading, fetch: fetchRegistry } = useRegistryFetcher();
const { recordVisit } = useVisitHistory();

/* Record visit on mount */
onMounted(() => {
  recordVisit(current);
  document.addEventListener("keydown", handleEscape);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
  document.removeEventListener("click", handleClickOutside);
});

const toggle = async (): Promise<void> => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await fetchRegistry();
  }
};

const close = (): void => {
  isOpen.value = false;
  /* Return focus to button after closing */
  nextTick(() => {
    buttonRef.value?.focus();
  });
};

const handleEscape = (event: KeyboardEvent): void => {
  if (event.key === "Escape" && isOpen.value) {
    close();
  }
};

const handleClickOutside = (event: MouseEvent): void => {
  if (!isOpen.value) return;
  const target = event.target as Node;
  if (popoverRef.value?.contains(target) || buttonRef.value?.contains(target)) {
    return;
  }
  close();
};

const handleNavigate = (url: string): void => {
  globalThis.location.href = url;
};

/* Popover positioning: track if we have space above */
const openDirection = ref<"up" | "down">("up");
const popoverTop = ref<string | undefined>(undefined);

watch(isOpen, (open) => {
  if (!open) return;
  nextTick(() => {
    const rect = buttonRef.value?.getBoundingClientRect();
    if (!rect) return;
    if (rect.top < 400) {
      openDirection.value = "down";
      /* Position popover below the button: button bottom + 12px gap */
      popoverTop.value = `${String(Math.round(rect.bottom + 12))}px`;
    } else {
      openDirection.value = "up";
      popoverTop.value = undefined;
    }
  });
});
</script>

<template>
  <div class="lab-map-root">
    <!-- Map Button: Compass Rose -->
    <button
      ref="buttonRef"
      class="map-button map-focus"
      :class="{ 'map-button--open': isOpen }"
      :style="{
        bottom: '16px',
        right: resolvedPosition === 'bottom-right' ? '16px' : 'auto',
        left: resolvedPosition === 'bottom-left' ? '16px' : 'auto',
      }"
      aria-label="Open laboratory map"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      @click="toggle"
    >
      <!-- Compass Rose SVG Glyph -->
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <!-- Cardinal lines (muted) -->
        <line
          x1="12"
          y1="2"
          x2="12"
          y2="10"
          stroke="#9E9EBF"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <line
          x1="12"
          y1="14"
          x2="12"
          y2="22"
          stroke="#9E9EBF"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <line
          x1="2"
          y1="12"
          x2="10"
          y2="12"
          stroke="#9E9EBF"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <line
          x1="14"
          y1="12"
          x2="22"
          y2="12"
          stroke="#9E9EBF"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <!-- North pointer (gold, emphasized) -->
        <line
          x1="12"
          y1="1"
          x2="12"
          y2="9"
          stroke="#F0D040"
          stroke-width="2"
          stroke-linecap="round"
        />
        <!-- Center dot (gold) -->
        <circle cx="12" cy="12" r="3" fill="#F0D040" />
      </svg>
    </button>

    <!-- Popover -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="popoverRef"
        class="map-popover"
        :class="[openDirection === 'down' ? 'map-popover--down' : 'map-popover--up']"
        :style="{
          right: resolvedPosition === 'bottom-right' ? '16px' : 'auto',
          left: resolvedPosition === 'bottom-left' ? '16px' : 'auto',
          bottom: openDirection === 'up' ? '76px' : 'auto',
          top: openDirection === 'down' ? popoverTop : undefined,
        }"
        role="dialog"
        aria-label="Laboratory map"
      >
        <!-- Header -->
        <div
          class="map-font-display font-800 uppercase text-map-text-muted pb-8px"
          style="font-size: 11px; letter-spacing: 3px"
        >
          THE LABORATORY
        </div>

        <!-- Loading state -->
        <div
          v-if="loading && experiments.length === 0"
          class="map-font-mono text-9px text-map-text-dim py-24px text-center"
        >
          Mapping the laboratory...
        </div>

        <!-- Room grid -->
        <LaboratoryMiniature
          v-else
          :experiments="experiments"
          :current="current"
          :visible="isOpen"
          @navigate="handleNavigate"
        />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.map-button {
  position: fixed;
  z-index: 9990;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0a0a18;
  border: 3px solid #3d3d6b;
  border-radius: 0;
  cursor: pointer;
  transition: all 120ms cubic-bezier(0.25, 0.1, 0.25, 1);
  box-shadow: 3px 3px 0 #f0d040;
  animation: map-button-breathe 3s ease-in-out infinite;
}

.map-button:hover {
  background-color: #1a1a2e;
  border-color: #f0d040;
  box-shadow: 2px 2px 0 #f0d040;
  transform: translate(1px, 1px);
}

.map-button:active {
  background-color: #252545;
  box-shadow: 0 0 0 #f0d040;
  transform: translate(3px, 3px);
}

.map-button--open {
  background-color: #252545;
  border-color: #f0d040;
  box-shadow: 2px 2px 0 #f0d040;
  transform: translate(1px, 1px);
  animation: none;
}

.map-popover {
  position: fixed;
  z-index: 9991;
  width: 300px;
  max-height: 360px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #0a0a18;
  border: 3px solid #3d3d6b;
  border-radius: 0;
  padding: 12px;
  box-shadow: 6px 6px 0 #0a0a18;

  /* Entrance animation */
  animation: map-popover-enter 200ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.map-popover--up {
  /* Positioned via inline style */
}

.map-popover--down {
  /* When opening downward, position from button top */
  bottom: auto;
}

@keyframes map-popover-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .map-button {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }

  .map-popover {
    animation-duration: 0.01ms !important;
  }
}
</style>
