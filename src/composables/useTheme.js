import { ref } from 'vue'

const STORAGE_KEY = 'task-manager.theme'

function readTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const theme = ref(readTheme())
applyTheme(theme.value)

export function useTheme() {
  function setTheme(next) {
    theme.value = next
    applyTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
