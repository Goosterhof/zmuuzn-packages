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
      lab-font-mono
      text-sm
      font-500
      flex
      items-center
      gap-1.5
      bg-transparent
      border-none
      cursor-pointer
      py-1.5
      px-3
      transition-colors
      @click="toggleMenu"
    >
      {{ user.name }}
      <span text-xs transition-transform duration-200 :class="menuOpen ? 'rotate-180' : ''"
        >&#9660;</span
      >
    </button>

    <Transition
      enter-from-class="opacity-0 translate-y-[-4px]"
      enter-active-class="transition-all duration-150 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      leave-to-class="opacity-0 translate-y-[-4px]"
    >
      <div
        v-if="menuOpen"
        absolute
        right-0
        top-full
        mt-1
        py-1
        min-w-32
        z-50
        border-1
        bg="[#1A1A2E]"
        border="[#2E2E52]"
      >
        <button
          class="text-[#9E9EBF] hover:text-[#E0E0E0]"
          lab-font-mono
          w-full
          text-left
          text-sm
          font-400
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
    </Transition>
  </div>
</template>
