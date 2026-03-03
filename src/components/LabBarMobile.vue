<script setup lang="ts">
import { ref, computed } from "vue";
import type { ExperimentId, LabUser, LocalNavItem } from "../types";
import { experiments } from "../experiments";

const { currentExperiment, localNav } = defineProps<{
  currentExperiment: ExperimentId;
  user: LabUser;
  localNav: LocalNavItem[];
}>();

const emit = defineEmits<{
  logout: [];
}>();

const drawerOpen = ref(false);

const accentColor = computed(
  () => experiments.find((e) => e.id === currentExperiment)?.accentColor ?? "#E0E0E0",
);

const handleLogout = () => {
  drawerOpen.value = false;
  emit("logout");
};
</script>

<template>
  <header block md:hidden>
    <!-- Collapsed Bar -->
    <div flex items-center justify-between px-4 py-3 bg="[#0F0F1F]" border-b-1 border-b="[#2E2E52]">
      <span class="text-[#9E9EBF]" font-bold text-sm tracking-wider uppercase>Zmuuzn</span>
      <button
        class="text-[#9E9EBF]"
        bg-transparent
        border-none
        cursor-pointer
        p-1
        text-lg
        aria-label="Open menu"
        @click="drawerOpen = !drawerOpen"
      >
        &#9776;
      </button>
    </div>

    <!-- Drawer Overlay -->
    <Teleport to="body">
      <div v-if="drawerOpen" fixed inset-0 z-50>
        <!-- Backdrop -->
        <div absolute inset-0 bg="black/50" @click="drawerOpen = false" />

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
          bg="[#0F0F1F]"
          border-l="[#2E2E52]"
        >
          <!-- Header -->
          <div flex items-center justify-between mb-6>
            <span class="text-[#E0E0E0]" text-sm font-600>
              {{ user.name }}
            </span>
            <button
              class="text-[#9E9EBF]"
              bg-transparent
              border-none
              cursor-pointer
              text-lg
              p-1
              aria-label="Close menu"
              @click="drawerOpen = false"
            >
              &#10005;
            </button>
          </div>

          <!-- Section: Experiments -->
          <div mb-6>
            <p class="text-[#9E9EBF]" text-xs uppercase tracking-wider mb-3 m-0>Experiments</p>
            <div flex flex-col gap-1>
              <a
                v-for="exp in experiments"
                :key="exp.id"
                :href="exp.url"
                no-underline
                text-sm
                py-2
                px-2
                rounded
                :class="exp.id === currentExperiment ? 'font-600' : ''"
                :style="{
                  color: exp.id === currentExperiment ? '#E0E0E0' : '#9E9EBF',
                  borderLeft:
                    exp.id === currentExperiment
                      ? `3px solid ${accentColor}`
                      : '3px solid transparent',
                }"
                @click="drawerOpen = false"
              >
                {{ exp.label }}
              </a>
            </div>
          </div>

          <!-- Section: Navigation -->
          <div v-if="localNav.length > 0" mb-6>
            <p class="text-[#9E9EBF]" text-xs uppercase tracking-wider mb-3 m-0>Navigation</p>
            <div flex flex-col gap-1>
              <router-link
                v-for="item in localNav"
                :key="item.to"
                :to="item.to"
                no-underline
                text-sm
                py-2
                px-2
                rounded
                :class="item.isActive ? 'font-600' : ''"
                :style="{
                  color: item.isActive ? '#E0E0E0' : '#9E9EBF',
                  borderLeft: item.isActive ? `3px solid ${accentColor}` : '3px solid transparent',
                }"
                @click="drawerOpen = false"
              >
                {{ item.label }}
              </router-link>
            </div>
          </div>

          <!-- Section: Logout -->
          <div pt-4 border-t-1 border-t="[#2E2E52]">
            <button
              class="text-[#9E9EBF] hover:text-[#E0E0E0]"
              w-full
              text-left
              text-sm
              bg-transparent
              border-none
              cursor-pointer
              py-2
              px-2
              rounded
              transition-colors
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </Teleport>
  </header>
</template>
