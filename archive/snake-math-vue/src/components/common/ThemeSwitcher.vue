<template>
  <div class="theme-switcher">
    <button
      @click="toggleTheme"
      :aria-label="themeLabel"
      class="btn btn-outline-secondary d-flex align-items-center"
      :class="{ 'active': isDark }"
    >
      <i class="me-2" :class="themeIconClass"></i>
      <span class="theme-text d-none d-sm-inline">{{ themeText }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Theme state
const isDark = ref(false)

// Computed properties for UI
// Removed themeIcon - now using FontAwesome classes directly
const themeText = computed(() => isDark.value ? 'Dark' : 'Light')
const themeLabel = computed(() => 
  `Switch to ${isDark.value ? 'light' : 'dark'} theme`
)
const themeIconClass = computed(() => ({
  'fas fa-sun theme-icon theme-icon--sun': !isDark.value,
  'fas fa-moon theme-icon theme-icon--moon': isDark.value
}))

// Theme persistence key
const THEME_STORAGE_KEY = 'snake-math-theme'

// Get stored theme preference
const getStoredTheme = () => {
  if (typeof window === 'undefined') return null
  
  try {
    return localStorage.getItem(THEME_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error)
    return null
  }
}

// Store theme preference
const storeTheme = (theme) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (error) {
    console.warn('Failed to store theme in localStorage:', error)
  }
}

// Get system theme preference
const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light'
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light'
}

// Apply theme to document
const applyTheme = (theme) => {
  if (typeof document === 'undefined') return
  
  // Add transition class to prevent flash
  document.documentElement.classList.add('theme-transitioning')
  
  // Use Bootstrap's data-bs-theme attribute
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-bs-theme')
  }
  
  // Remove transition class after a brief delay
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning')
  }, 50)
  
  // Update state
  isDark.value = theme === 'dark'
}

// Initialize theme
const initializeTheme = () => {
  // Priority: stored preference > system preference > default (light)
  const storedTheme = getStoredTheme()
  const systemTheme = getSystemTheme()
  const initialTheme = storedTheme || systemTheme
  
  applyTheme(initialTheme)
}

// Toggle theme
const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark'
  applyTheme(newTheme)
  storeTheme(newTheme)
  
  // Emit event for other components that might need to know
  window.dispatchEvent(new CustomEvent('themeChange', {
    detail: { theme: newTheme, isDark: newTheme === 'dark' }
  }))
}

// Listen for system theme changes
const setupSystemThemeListener = () => {
  if (typeof window === 'undefined') return
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleSystemThemeChange = (e) => {
    // Only apply system theme if no stored preference exists
    const storedTheme = getStoredTheme()
    if (!storedTheme) {
      const systemTheme = e.matches ? 'dark' : 'light'
      applyTheme(systemTheme)
    }
  }
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleSystemThemeChange)
  }
  
  // Return cleanup function
  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    } else {
      mediaQuery.removeListener(handleSystemThemeChange)
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  initializeTheme()
  const cleanup = setupSystemThemeListener()
  
  // Cleanup on unmount
  return cleanup
})

// Watch for theme changes and emit events
watch(isDark, (newValue) => {
  // Emit Vue event for parent components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('snake-math:theme-change', {
      detail: { 
        theme: newValue ? 'dark' : 'light',
        isDark: newValue 
      }
    }))
  }
})

// Expose methods for programmatic control
const setTheme = (theme) => {
  if (!['light', 'dark'].includes(theme)) {
    console.warn('Invalid theme:', theme)
    return
  }
  
  applyTheme(theme)
  storeTheme(theme)
}

const getCurrentTheme = () => {
  return isDark.value ? 'dark' : 'light'
}

// Make methods available to parent components
defineExpose({
  setTheme,
  getCurrentTheme,
  toggleTheme,
  isDark: computed(() => isDark.value)
})
</script>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
}

/* Bootstrap handles most button styling, we just add theme-specific enhancements */

.theme-icon {
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
}

.theme-icon--sun {
  animation: rotate-sun 0.5s ease;
}

.theme-icon--moon {
  animation: rotate-moon 0.5s ease;
}

.theme-text {
  white-space: nowrap;
}

/* Animations */
@keyframes rotate-sun {
  from {
    transform: rotate(-90deg) scale(0.8);
    opacity: 0;
  }
  to {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

@keyframes rotate-moon {
  from {
    transform: rotate(90deg) scale(0.8);
    opacity: 0;
  }
  to {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

/* Hover effects */
.btn:hover .theme-icon {
  transform: scale(1.1);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .theme-icon {
    transition: none;
  }
  
  .theme-icon--sun,
  .theme-icon--moon {
    animation: none;
  }
  
  .btn:hover .theme-icon {
    transform: none;
  }
}

/* Print styles */
@media print {
  .theme-switcher {
    display: none;
  }
}
</style>