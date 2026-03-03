<script setup lang="ts">
import { ref, useTemplateRef, onMounted, onUnmounted } from "vue";
import type { LabUser } from "../types";

defineProps<{
  user: LabUser;
}>();

const emit = defineEmits<{
  logout: [];
}>();

const menuOpen = ref(false);
const menuRef = useTemplateRef<HTMLElement>("menuRef");

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div ref="menuRef" relative>
    <button
      class="text-[#9E9EBF] hover:text-[#E0E0E0]"
      text-sm
      flex
      items-center
      gap-1
      bg-transparent
      border-none
      cursor-pointer
      py-1
      px-2
      rounded
      transition-colors
      @click="toggleMenu"
    >
      {{ user.name }}
      <span text-xs>{{ menuOpen ? "\u25B2" : "\u25BC" }}</span>
    </button>

    <div
      v-if="menuOpen"
      absolute
      right-0
      top-full
      mt-1
      py-1
      rounded
      min-w-32
      z-50
      border-1
      bg="[#1A1A2E]"
      border="[#2E2E52]"
    >
      <button
        class="text-[#9E9EBF] hover:text-[#E0E0E0]"
        w-full
        text-left
        text-sm
        px-3
        py-2
        bg-transparent
        border-none
        cursor-pointer
        transition-colors
        @click="emit('logout')"
      >
        Logout
      </button>
    </div>
  </div>
</template>
