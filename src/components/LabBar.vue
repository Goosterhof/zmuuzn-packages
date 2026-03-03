<script setup lang="ts">
import { computed } from "vue";
import type { ExperimentId, LabUser, LocalNavItem } from "../types";
import { experiments } from "../experiments";
import ExperimentSwitcher from "./ExperimentSwitcher.vue";
import UserMenu from "./UserMenu.vue";

const { currentExperiment, localNav } = defineProps<{
  currentExperiment: ExperimentId;
  user: LabUser;
  localNav: LocalNavItem[];
}>();

const emit = defineEmits<{
  logout: [];
}>();

const accentColor = computed(
  () => experiments.find((e) => e.id === currentExperiment)?.accentColor ?? "#E0E0E0",
);
</script>

<template>
  <header hidden md:block>
    <!-- Row 1: Laboratory Bar -->
    <div flex items-center justify-between px-6 py-2 bg="[#0F0F1F]" border-b-1 border-b="[#2E2E52]">
      <span class="text-[#9E9EBF]" font-bold text-sm tracking-wider uppercase>Zmuuzn</span>

      <ExperimentSwitcher :current-experiment="currentExperiment" />

      <UserMenu :user="user" @logout="emit('logout')" />
    </div>

    <!-- Row 2: Local Navigation -->
    <div
      v-if="localNav.length > 0"
      flex
      items-center
      gap-6
      px-6
      py-2
      bg="[#0F0F1F]"
      border-b-1
      border-b="[#2E2E52]"
    >
      <router-link
        v-for="item in localNav"
        :key="item.to"
        :to="item.to"
        text-sm
        no-underline
        pb-1
        transition-colors
        :class="item.isActive ? 'font-600' : ''"
        :style="{
          color: item.isActive ? '#E0E0E0' : '#9E9EBF',
          borderBottom: item.isActive ? `2px solid ${accentColor}` : '2px solid transparent',
        }"
      >
        {{ item.label }}
      </router-link>

      <slot name="local-nav-end" />
    </div>
  </header>
</template>
