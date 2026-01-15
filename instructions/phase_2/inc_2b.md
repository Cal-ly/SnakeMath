# SnakeMath - Increment 2B: AppHeader Component

## Context
Building the site header with logo, desktop navigation, and mobile menu trigger. Font Awesome icons are used for consistent iconography.

## Design Decisions
- **Header**: Sticky at top
- **Theme toggle**: Only visible in mobile menu (not in header)
- **Icons**: Font Awesome (outlined style)
- **Favicon**: Snake emoji 🐍

## Task
Create the AppHeader component and set up Font Awesome.

## Requirements

### 1. Add Font Awesome
Update `index.html` to include Font Awesome CDN:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐍</text></svg>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="SnakeMath - Mathematics for programmers. Interactive, intuitive, and connected to code.">
    <meta name="theme-color" content="#27592D">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <title>SnakeMath</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### 2. Create Icon Component (Optional Helper)
Create `src/components/ui/FaIcon.vue` for consistent icon usage:

```vue
<script setup lang="ts">
interface Props {
  icon: string // e.g., 'fa-solid fa-bars' or 'fa-regular fa-sun'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  spin?: boolean
  fixedWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  spin: false,
  fixedWidth: false,
})

const sizeClasses: Record<string, string> = {
  xs: 'fa-xs',
  sm: 'fa-sm',
  md: '',
  lg: 'fa-lg',
  xl: 'fa-xl',
}
</script>

<template>
  <i 
    :class="[
      icon,
      sizeClasses[size],
      { 'fa-spin': spin, 'fa-fw': fixedWidth }
    ]"
    aria-hidden="true"
  />
</template>
```

### 3. Create AppHeader Component
Create `src/components/layout/AppHeader.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { topics } from '@/data/navigation'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const emit = defineEmits<{
  toggleMobileMenu: []
}>()

function handleMobileMenuToggle() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  emit('toggleMobileMenu')
}

function isActiveRoute(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <header class="bg-header-bg text-header-text sticky top-0 z-40 shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-14 md:h-16">
        <!-- Logo -->
        <RouterLink 
          to="/" 
          class="flex items-center gap-2 text-xl font-bold hover:opacity-90 transition-opacity"
        >
          <span class="text-2xl" aria-hidden="true">🐍</span>
          <span>SnakeMath</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1" aria-label="Main navigation">
          <RouterLink
            v-for="topic in topics"
            :key="topic.id"
            :to="topic.path"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[
              isActiveRoute(topic.path)
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            ]"
          >
            <span class="mr-2" aria-hidden="true">{{ topic.icon }}</span>
            {{ topic.title }}
          </RouterLink>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 -mr-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Open navigation menu"
          @click="handleMobileMenuToggle"
        >
          <i 
            :class="isMobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" 
            class="text-xl w-6 text-center"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </header>
</template>
```

### 4. Update Navigation Data
Update `src/data/navigation.ts` to ensure icons are suitable:

```typescript
export interface NavTopic {
  id: string
  title: string
  description: string
  icon: string
  faIcon: string // Font Awesome icon class
  path: string
  subtopics: NavSubtopic[]
}

export interface NavSubtopic {
  id: string
  title: string
  description?: string
  path: string
  faIcon?: string
}

export const topics: NavTopic[] = [
  {
    id: 'basics',
    title: 'Foundations',
    description: 'Core mathematical concepts every programmer should know',
    icon: '🧱',
    faIcon: 'fa-solid fa-cubes',
    path: '/basics',
    subtopics: [
      { 
        id: 'foundations', 
        title: 'The Basics', 
        description: 'Everything breaks down to four operators',
        path: '/basics/foundations',
        faIcon: 'fa-solid fa-plus-minus'
      },
      { 
        id: 'symbols', 
        title: 'Math Symbols', 
        description: 'A programmer\'s guide to mathematical notation',
        path: '/basics/symbols',
        faIcon: 'fa-solid fa-signs-post'
      },
      { 
        id: 'number-types', 
        title: 'Number Types', 
        description: 'Understanding ℕ, ℤ, ℚ, ℝ, and ℂ',
        path: '/basics/number-types',
        faIcon: 'fa-solid fa-hashtag'
      },
    ],
  },
  // Future topics will be added here:
  // { id: 'algebra', title: 'Algebra', ... },
  // { id: 'statistics', title: 'Statistics', ... },
]

export function getTopicByPath(path: string): NavTopic | undefined {
  return topics.find(t => path.startsWith(t.path))
}

export function getSubtopicByPath(path: string): NavSubtopic | undefined {
  for (const topic of topics) {
    const subtopic = topic.subtopics.find(s => s.path === path)
    if (subtopic) return subtopic
  }
  return undefined
}

export function getBreadcrumbs(path: string): Array<{ label: string; path?: string; icon?: string }> {
  const crumbs: Array<{ label: string; path?: string; icon?: string }> = [
    { label: 'Home', path: '/', icon: 'fa-solid fa-house' }
  ]
  
  const topic = getTopicByPath(path)
  if (topic && path !== '/') {
    if (path === topic.path) {
      // On topic index page
      crumbs.push({ label: topic.title })
    } else {
      // On subtopic page
      crumbs.push({ label: topic.title, path: topic.path })
      
      const subtopic = topic.subtopics.find(s => s.path === path)
      if (subtopic) {
        crumbs.push({ label: subtopic.title })
      }
    }
  }
  
  return crumbs
}
```

### 5. Update App.vue to Include Header
Update `src/App.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from '@/composables'
import AppHeader from '@/components/layout/AppHeader.vue'

const { isDark } = useTheme()
const isMobileMenuOpen = ref(false)

function handleMobileMenuToggle() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface transition-colors">
    <!-- Skip link for accessibility -->
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>

    <AppHeader @toggle-mobile-menu="handleMobileMenuToggle" />
    
    <!-- Mobile menu will be added in increment 2C -->
    
    <main id="main-content" class="flex-1 container mx-auto px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Skip link is defined in main.css */
</style>
```

## Success Criteria
- [ ] Snake emoji 🐍 appears as favicon in browser tab
- [ ] Header is sticky (stays at top when scrolling)
- [ ] Header background is Dark Emerald Green (#27592D)
- [ ] Desktop navigation shows topic links
- [ ] Active route is visually highlighted
- [ ] Mobile menu button appears on small screens (below md breakpoint)
- [ ] Mobile menu button toggles icon between bars and X
- [ ] Font Awesome icons load correctly
- [ ] Skip-to-content link is visible on keyboard focus
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Verification Steps
1. Open site in browser - favicon should be snake emoji
2. Scroll down - header should stay fixed at top
3. Resize browser to mobile width - hamburger menu should appear
4. Press Tab key - skip link should become visible

## Next Increment
After completion, proceed to `inc_2c.md` for Mobile Navigation (slide-out drawer).
