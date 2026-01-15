import { ref, watch, onMounted } from 'vue'

export type ThemeMode = 'light' | 'dark'

// Store outside function for singleton pattern
const isDark = ref(false)
const isInitialized = ref(false)

/**
 * Theme composable with system preference detection and persistence
 *
 * Behavior:
 * 1. On first load, check localStorage for saved preference
 * 2. If no saved preference, use system preference
 * 3. User toggle overrides and saves to localStorage
 * 4. System preference changes are respected only if no user override
 */
export function useTheme() {
  const STORAGE_KEY = 'snakemath-theme'

  /**
   * Get the user's system color scheme preference
   */
  function getSystemPreference(): ThemeMode {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  /**
   * Get saved theme from localStorage
   */
  function getSavedTheme(): ThemeMode | null {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
    return null
  }

  /**
   * Save theme preference to localStorage
   */
  function saveTheme(theme: ThemeMode): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, theme)
  }

  /**
   * Clear saved preference (revert to system)
   */
  function clearSavedTheme(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * Apply theme to document
   */
  function applyTheme(dark: boolean): void {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', dark)
  }

  /**
   * Toggle between light and dark mode
   * Saves the preference to localStorage
   */
  function toggleTheme(): void {
    isDark.value = !isDark.value
    saveTheme(isDark.value ? 'dark' : 'light')
  }

  /**
   * Set theme explicitly
   */
  function setTheme(theme: ThemeMode): void {
    isDark.value = theme === 'dark'
    saveTheme(theme)
  }

  /**
   * Reset to system preference
   */
  function resetToSystem(): void {
    clearSavedTheme()
    isDark.value = getSystemPreference() === 'dark'
  }

  /**
   * Initialize theme on mount
   */
  function initializeTheme(): void {
    if (isInitialized.value) return

    // Check for saved preference first
    const saved = getSavedTheme()
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      // Fall back to system preference
      isDark.value = getSystemPreference() === 'dark'
    }

    applyTheme(isDark.value)
    isInitialized.value = true

    // Listen for system preference changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-update if user hasn't set a preference
        if (!getSavedTheme()) {
          isDark.value = e.matches
        }
      })
    }
  }

  // Watch for changes and apply to DOM
  watch(isDark, (dark) => {
    applyTheme(dark)
  })

  // Initialize on first use (client-side only)
  onMounted(() => {
    initializeTheme()
  })

  return {
    isDark,
    toggleTheme,
    setTheme,
    resetToSystem,
    initializeTheme,
  }
}
