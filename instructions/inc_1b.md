# SnakeMath - Increment 1B: Tailwind CSS Setup

## Context
Continuing from the initialized Vue 3 + TypeScript project. We need Tailwind CSS for styling with a custom configuration suitable for an educational math site.

**Important**: The `archive/` folder contains old Vue components that must be excluded from Tailwind's content scanning to prevent build issues.

## Task
Install and configure Tailwind CSS with PostCSS, properly excluding the archive folder.

## Requirements

### 1. Install Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // Explicitly exclude archive
    '!./archive/**/*',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors using CSS variables for theming
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        border: 'var(--color-border)',
        // Semantic colors
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        // Math-specific
        'math-highlight': 'var(--color-math-highlight)',
        'code-bg': 'var(--color-code-bg)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [],
}
```

### 3. Create Main CSS File
Create `src/assets/styles/main.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Theme CSS Variables */
:root {
  /* Primary brand color - Snake Green (Emerald) */
  --color-primary: #059669;           /* emerald-600 */
  --color-primary-hover: #047857;     /* emerald-700 */
  
  /* Surfaces */
  --color-surface: #ffffff;
  --color-surface-alt: #f9fafb;       /* gray-50 */
  --color-border: #e5e7eb;            /* gray-200 */
  
  /* Text */
  --color-text-primary: #111827;      /* gray-900 */
  --color-text-secondary: #374151;    /* gray-700 */
  --color-text-muted: #6b7280;        /* gray-500 */
  
  /* Math and code */
  --color-math-highlight: #fef3c7;    /* amber-100 */
  --color-code-bg: #f3f4f6;           /* gray-100 */
}

.dark {
  /* Primary - lighter for dark mode */
  --color-primary: #34d399;           /* emerald-400 */
  --color-primary-hover: #6ee7b7;     /* emerald-300 */
  
  /* Surfaces */
  --color-surface: #1f2937;           /* gray-800 */
  --color-surface-alt: #111827;       /* gray-900 */
  --color-border: #374151;            /* gray-700 */
  
  /* Text */
  --color-text-primary: #f9fafb;      /* gray-50 */
  --color-text-secondary: #e5e7eb;    /* gray-200 */
  --color-text-muted: #9ca3af;        /* gray-400 */
  
  /* Math and code */
  --color-math-highlight: #78350f;    /* amber-900 */
  --color-code-bg: #374151;           /* gray-700 */
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
  
  /* Ensure code blocks use mono font */
  code, pre {
    @apply font-mono;
  }
  
  /* Focus visible for accessibility */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-primary;
  }
}

/* Component layer for reusable patterns */
@layer components {
  /* Card pattern used throughout */
  .card {
    @apply bg-surface rounded-lg border border-border shadow-sm;
  }
  
  /* Section headers */
  .section-header {
    @apply text-lg font-semibold text-text-primary mb-4;
  }
  
  /* Interactive element base */
  .interactive-panel {
    @apply card p-4 md:p-6;
  }
}

/* Utility layer for custom utilities */
@layer utilities {
  /* Hide scrollbar but keep functionality */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### 4. Update `src/main.ts`
Add the CSS import at the top:

```typescript
import './assets/styles/main.css'
// ... rest of imports
```

### 5. Update `App.vue` to Verify
Replace the template content with a simple verification:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <div class="min-h-screen bg-surface transition-colors">
    <header class="bg-primary text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold">🐍 SnakeMath</h1>
        <button 
          @click="toggleTheme"
          class="px-3 py-1 rounded bg-primary-hover hover:bg-emerald-800 transition-colors"
        >
          {{ isDark ? '☀️ Light' : '🌙 Dark' }}
        </button>
      </div>
    </header>
    
    <main class="container mx-auto p-4">
      <div class="card p-6 mt-4">
        <h2 class="section-header">Tailwind CSS is Working! ✓</h2>
        <p class="text-text-secondary mb-4">
          If you can see this styled card with the green header, Tailwind is configured correctly.
        </p>
        <p class="text-text-muted text-sm">
          Toggle the theme button to verify dark mode works.
        </p>
      </div>
      
      <RouterView />
    </main>
  </div>
</template>
```

### 6. Add Google Fonts
Update `index.html` to include Inter and JetBrains Mono fonts:

```html
<head>
  <!-- ... existing head content ... -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
```

## Success Criteria
- [ ] `npm run dev` shows Tailwind styles applied (green header, styled card)
- [ ] Theme toggle switches between light and dark mode
- [ ] Custom colors (primary, surface, etc.) work via CSS variables
- [ ] No build warnings about files in `archive/`
- [ ] `npm run build` completes successfully
- [ ] Fonts load correctly (Inter for text, JetBrains Mono for code)

## Constraints
- Do not add Tailwind plugins yet (typography, forms, etc.)
- Keep configuration minimal but extensible
- Ensure archive folder is excluded from content scanning

## Next Increment
After completion, proceed to `inc_1c.md` for project structure and routing.
