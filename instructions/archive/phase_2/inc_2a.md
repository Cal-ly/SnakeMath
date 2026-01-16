# SnakeMath - Increment 2A: Theme Composable

## Context
Phase 2 focuses on layout and navigation. This increment extracts theme logic from App.vue into a reusable composable with system preference detection and localStorage persistence.

## Design Decisions
- **Theme persistence**: System preference with user override
- **Behavior**: Follows OS dark/light setting by default; user choice overrides and persists
- **Primary color**: Dark Emerald Green `#27592D`

## Task
Create a theme composable that handles dark mode with system preference detection and persistence.

## Requirements

### 1. Create Theme Composable
Create `src/composables/useTheme.ts`:

```typescript
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
```

### 2. Update Theme Colors in CSS
Update `src/assets/styles/main.css` - change the primary color to Dark Emerald Green:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Theme CSS Variables */
:root {
  /* Primary brand color - Dark Emerald Green */
  --color-primary: #27592D;
  --color-primary-hover: #1e4423;
  --color-primary-light: #3d7a45;
  
  /* Surfaces */
  --color-surface: #ffffff;
  --color-surface-alt: #f9fafb;
  --color-border: #e5e7eb;
  
  /* Text */
  --color-text-primary: #111827;
  --color-text-secondary: #374151;
  --color-text-muted: #6b7280;
  
  /* Inverse text (for dark backgrounds) */
  --color-text-inverse: #ffffff;
  
  /* Math and code */
  --color-math-highlight: #fef3c7;
  --color-code-bg: #f3f4f6;
  
  /* Header specific */
  --color-header-bg: #27592D;
  --color-header-text: #ffffff;
}

.dark {
  /* Primary - slightly lighter for dark mode contrast */
  --color-primary: #4ade80;
  --color-primary-hover: #86efac;
  --color-primary-light: #22c55e;
  
  /* Surfaces */
  --color-surface: #1f2937;
  --color-surface-alt: #111827;
  --color-border: #374151;
  
  /* Text */
  --color-text-primary: #f9fafb;
  --color-text-secondary: #e5e7eb;
  --color-text-muted: #9ca3af;
  
  /* Inverse text */
  --color-text-inverse: #111827;
  
  /* Math and code */
  --color-math-highlight: #365314;
  --color-code-bg: #374151;
  
  /* Header - same dark green works in dark mode */
  --color-header-bg: #1e4423;
  --color-header-text: #ffffff;
}

/* Base styles */
@layer base {
  html {
    @apply scroll-smooth;
  }
  
  body {
    @apply bg-surface text-text-primary antialiased;
    @apply transition-colors duration-200;
  }
  
  code, pre {
    @apply font-mono;
  }
  
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-primary;
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  .card {
    @apply bg-surface rounded-lg border border-border shadow-sm;
  }
  
  .section-header {
    @apply text-lg font-semibold text-text-primary mb-4;
  }
  
  .interactive-panel {
    @apply card p-4 md:p-6;
  }
  
  /* Skip link for accessibility */
  .skip-link {
    @apply absolute -top-10 left-4 z-50 bg-primary text-text-inverse px-4 py-2 rounded;
    @apply focus:top-4 transition-all;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### 3. Update Tailwind Config
Update `tailwind.config.js` to include the new color variables:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '!./archive/**/*',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-inverse': 'var(--color-text-inverse)',
        'math-highlight': 'var(--color-math-highlight)',
        'code-bg': 'var(--color-code-bg)',
        'header-bg': 'var(--color-header-bg)',
        'header-text': 'var(--color-header-text)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

### 4. Update Composables Barrel Export
Update `src/composables/index.ts`:

```typescript
export { useTheme } from './useTheme'
export type { ThemeMode } from './useTheme'
```

### 5. Update App.vue to Use Composable
Simplify `src/App.vue` to use the new composable:

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from '@/composables'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <div class="min-h-screen bg-surface transition-colors">
    <!-- Temporary header - will be replaced in 2B -->
    <header class="bg-header-bg text-header-text p-4 sticky top-0 z-40">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold">🐍 SnakeMath</h1>
        <button 
          @click="toggleTheme"
          class="px-3 py-1 rounded bg-primary-light hover:bg-primary-hover transition-colors"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          {{ isDark ? '☀️ Light' : '🌙 Dark' }}
        </button>
      </div>
    </header>
    
    <main class="container mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>
```

## Success Criteria
- [ ] Theme persists across page reloads
- [ ] First visit respects system preference (test by changing OS dark mode)
- [ ] User toggle overrides system preference
- [ ] System preference changes are followed only if user hasn't manually toggled
- [ ] No flash of wrong theme on page load
- [ ] Primary color is Dark Emerald Green `#27592D`
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Verification Steps
1. Clear localStorage and reload - should match your OS setting
2. Toggle theme manually - should persist on reload
3. Change OS dark mode setting - should NOT change if you've manually toggled
4. Clear localStorage again - should now follow OS setting

## Next Increment
After completion, proceed to `inc_2b.md` for AppHeader component.
