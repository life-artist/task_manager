<script setup>
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-full border border-[#d8c9b0] bg-[#fff8ec] px-3 py-1.5 text-sm font-medium text-[#3d3226] transition hover:border-[#c45c26] hover:text-[#c45c26] dark:border-[#3d342b] dark:bg-[#241f1a] dark:text-[#f3e8d7] dark:hover:border-[#e07a3d] dark:hover:text-[#e07a3d]"
    :aria-pressed="theme === 'dark'"
    @click="toggleTheme"
  >
    <span
      class="grid h-5 w-5 place-items-center rounded-full bg-[#f0d9b5] text-xs dark:bg-[#3a2e22]"
      aria-hidden="true"
    >
      {{ theme === 'dark' ? '月' : '日' }}
    </span>
    {{ theme === 'dark' ? '深色' : '亮色' }}
  </button>
</template>
