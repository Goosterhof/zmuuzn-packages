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
const triggerRef = useTemplateRef<HTMLButtonElement>("triggerRef");

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
  triggerRef.value?.focus();
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
      ref="triggerRef"
      text-lab-muted
      hover:text-lab-active
      lab-font-mono
      lab-ghost-btn
      lab-focus
      text-sm
      font-500
      flex
      items-center
      gap-1.5
      py-1.5
      px-3
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
        bg-lab-surface
        border-lab-border
        @keydown.escape="closeMenu"
      >
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
          px-3
          py-2
          @click="emit('logout')"
        >
          Logout
        </button>
      </div>
    </Transition>
  </div>
</template>
