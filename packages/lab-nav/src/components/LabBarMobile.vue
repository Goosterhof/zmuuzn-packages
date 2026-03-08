<script setup lang="ts">
import { ref, computed } from "vue";
import type { ExperimentId, LabUser, LocalNavItem } from "../types";
import { experiments } from "../experiments";
import BrandMark from "./BrandMark.vue";

const { currentExperiment, localNav } = defineProps<{
  currentExperiment: ExperimentId;
  user: LabUser;
  localNav: LocalNavItem[];
}>();

const emit = defineEmits<{
  logout: [];
}>();

const drawerOpen = ref(false);

const currentConfig = computed(() => experiments.find((e) => e.id === currentExperiment));

const accentColor = computed(() => currentConfig.value?.accentColor ?? "#F5F0E8");

const exitLabel = computed(() => currentConfig.value?.exitLabel ?? "Logout");

const handleLogout = () => {
  drawerOpen.value = false;
  emit("logout");
};
</script>

<template>
  <header block md:hidden>
    <!-- Collapsed Bar -->
    <div flex items-center justify-between px-4 py-3 bg-lab-bg border-b-1 border-b-lab-border>
      <BrandMark size="xs" :current-experiment="currentExperiment" />
      <button
        text-lab-muted
        hover:text-lab-active
        lab-ghost-btn
        lab-focus
        p-2
        text-lg
        aria-label="Open menu"
        @click="drawerOpen = !drawerOpen"
      >
        &#9776;
      </button>
    </div>

    <!-- Drawer Overlay -->
    <Teleport to="body">
      <Transition
        enter-from-class="opacity-0"
        enter-active-class="transition-opacity duration-250 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-to-class="opacity-0"
      >
        <div v-if="drawerOpen" fixed inset-0 z-50 @keydown.escape="drawerOpen = false">
          <!-- Backdrop -->
          <div absolute inset-0 bg="black/60" backdrop-blur-sm @click="drawerOpen = false" />

          <!-- Drawer Panel -->
          <nav
            absolute
            right-0
            top-0
            h-full
            w-72
            overflow-y-auto
            p-6
            border-l-1
            bg-lab-bg
            border-l-lab-border
            :style="{ animation: 'slide-in-right 250ms ease-out' }"
          >
            <!-- Header -->
            <div flex items-center justify-between mb-6>
              <span text-lab-active lab-font-mono text-sm font-500>
                {{ user.name }}
              </span>
              <button
                text-lab-muted
                hover:text-lab-active
                lab-ghost-btn
                lab-focus
                text-lg
                p-2
                aria-label="Close menu"
                @click="drawerOpen = false"
              >
                &#10005;
              </button>
            </div>

            <!-- Section: Stations -->
            <div mb-6>
              <p lab-section-label mb-3 m-0>Stations</p>
              <div flex flex-col gap-1>
                <a
                  v-for="exp in experiments"
                  :key="exp.id"
                  :href="exp.url"
                  no-underline
                  lab-font-mono
                  lab-focus
                  text-sm
                  font-400
                  py-2
                  px-2
                  flex
                  items-center
                  gap-2.5
                  transition-colors
                  class="drawer-experiment"
                  :class="exp.id === currentExperiment ? 'font-500' : ''"
                  :style="{
                    color: exp.id === currentExperiment ? '#F5F0E8' : '#9E9EBF',
                    borderLeft:
                      exp.id === currentExperiment
                        ? `3px solid ${accentColor}`
                        : '3px solid transparent',
                  }"
                  @click="drawerOpen = false"
                >
                  <i
                    inline-block
                    w-1.5
                    h-1.5
                    rounded-full
                    shrink-0
                    class="drawer-dot"
                    :style="{
                      backgroundColor: exp.accentColor,
                      opacity: exp.id === currentExperiment ? 1 : 0.4,
                      boxShadow:
                        exp.id === currentExperiment ? `0 0 6px ${exp.accentColor}` : 'none',
                      transition: 'opacity 200ms ease',
                    }"
                  />
                  {{ exp.label }}
                </a>
              </div>
            </div>

            <!-- Section: Corridors -->
            <div v-if="localNav.length > 0" mb-6>
              <p lab-section-label mb-3 m-0>Corridors</p>
              <div flex flex-col gap-1>
                <router-link
                  v-for="item in localNav"
                  :key="item.to"
                  :to="item.to"
                  no-underline
                  lab-font-mono
                  lab-focus
                  text-sm
                  font-400
                  py-2
                  px-2
                  transition-colors
                  :class="item.isActive ? 'font-500' : ''"
                  :style="{
                    color: item.isActive ? '#F5F0E8' : '#9E9EBF',
                    borderLeft: item.isActive
                      ? `3px solid ${accentColor}`
                      : '3px solid transparent',
                  }"
                  @click="drawerOpen = false"
                >
                  {{ item.label }}
                </router-link>
              </div>
            </div>

            <!-- Section: Exit -->
            <div pt-4 border-t-1 border-t-lab-border>
              <button
                text-lab-muted
                hover:text-lab-active
                lab-font-mono
                lab-ghost-btn
                lab-focus
                w-full
                text-left
                text-sm
                font-400
                py-2
                px-2
                @click="handleLogout"
              >
                {{ exitLabel }}
              </button>
            </div>
          </nav>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
.drawer-experiment:hover .drawer-dot {
  opacity: 0.7 !important;
}
</style>
