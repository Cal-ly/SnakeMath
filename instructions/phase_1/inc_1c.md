# SnakeMath - Increment 1C: Project Structure and Routing

## Context
SnakeMath needs a specific folder structure for content components, widgets, composables, and data files. The router needs to be configured for the MVP routes.

**Important**: The `archive/` folder must be excluded from TypeScript compilation and Vite processing.

## Task
Create the folder structure, configure build tool exclusions, and set up Vue Router with MVP routes.

## Requirements

### 1. Update `vite.config.ts` to Exclude Archive

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // Exclude archive from processing
  build: {
    rollupOptions: {
      external: [/^\.\/archive\/.*/]
    }
  },
  // Exclude archive from file watching
  server: {
    watch: {
      ignored: ['**/archive/**']
    }
  }
})
```

### 2. Update `tsconfig.json` to Exclude Archive
Add to the existing `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... existing options
  },
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.vue"
  ],
  "exclude": [
    "node_modules",
    "archive",
    "archive/**/*",
    "dist"
  ]
}
```

Also check `tsconfig.app.json` and add the same exclude if it exists.

### 3. Create Folder Structure
Create the following directories under `src/`:

```
src/
├── components/
│   ├── layout/
│   │   └── .gitkeep
│   ├── content/
│   │   └── .gitkeep
│   ├── widgets/
│   │   └── .gitkeep
│   └── ui/
│       └── .gitkeep
├── views/
│   ├── HomeView.vue          (update existing or create)
│   └── basics/
│       ├── BasicsIndex.vue
│       ├── FoundationsView.vue
│       ├── SymbolsView.vue
│       └── NumberTypesView.vue
├── composables/
│   └── index.ts              (barrel export, empty for now)
├── data/
│   ├── symbols/
│   │   └── index.ts          (barrel export, empty for now)
│   └── navigation.ts         (navigation structure)
├── utils/
│   └── math/
│       └── index.ts          (barrel export, empty for now)
└── types/
    └── index.ts              (barrel export, empty for now)
```

### 4. Create Navigation Data
Create `src/data/navigation.ts`:

```typescript
export interface NavTopic {
  id: string
  title: string
  description: string
  icon: string
  path: string
  subtopics: NavSubtopic[]
}

export interface NavSubtopic {
  id: string
  title: string
  path: string
}

export const topics: NavTopic[] = [
  {
    id: 'basics',
    title: 'Mathematical Foundations',
    description: 'Core concepts every programmer should know',
    icon: '🧱',
    path: '/basics',
    subtopics: [
      { id: 'foundations', title: 'Foundations', path: '/basics/foundations' },
      { id: 'symbols', title: 'Math Symbols', path: '/basics/symbols' },
      { id: 'number-types', title: 'Number Types', path: '/basics/number-types' },
    ],
  },
  // Future topics will be added here
]

export function getTopicByPath(path: string): NavTopic | undefined {
  return topics.find(t => path.startsWith(t.path))
}

export function getBreadcrumbs(path: string): Array<{ label: string; path?: string }> {
  const crumbs: Array<{ label: string; path?: string }> = [
    { label: 'Home', path: '/' }
  ]
  
  const topic = getTopicByPath(path)
  if (topic) {
    crumbs.push({ label: topic.title, path: topic.path })
    
    const subtopic = topic.subtopics.find(s => s.path === path)
    if (subtopic) {
      crumbs.push({ label: subtopic.title })
    }
  }
  
  return crumbs
}
```

### 5. Configure Router
Update `src/router/index.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/basics',
      name: 'basics',
      component: () => import('@/views/basics/BasicsIndex.vue'),
    },
    {
      path: '/basics/foundations',
      name: 'basics-foundations',
      component: () => import('@/views/basics/FoundationsView.vue'),
    },
    {
      path: '/basics/symbols',
      name: 'basics-symbols',
      component: () => import('@/views/basics/SymbolsView.vue'),
    },
    {
      path: '/basics/number-types',
      name: 'basics-number-types',
      component: () => import('@/views/basics/NumberTypesView.vue'),
    },
    // Catch-all 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    // Handle hash anchors
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // Restore scroll position on back/forward
    if (savedPosition) {
      return savedPosition
    }
    // Scroll to top on new navigation
    return { top: 0 }
  },
})

export default router
```

### 6. Create View Placeholders

**`src/views/HomeView.vue`**:
```vue
<script setup lang="ts">
import { topics } from '@/data/navigation'
</script>

<template>
  <div class="space-y-8">
    <section class="text-center py-8">
      <h1 class="text-4xl font-bold text-primary mb-4">🐍 SnakeMath</h1>
      <p class="text-xl text-text-secondary max-w-2xl mx-auto">
        Mathematics for programmers. Interactive, intuitive, and connected to code.
      </p>
    </section>

    <section>
      <h2 class="section-header">Topics</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="topic in topics"
          :key="topic.id"
          :to="topic.path"
          class="card p-6 hover:border-primary transition-colors"
        >
          <div class="text-3xl mb-2">{{ topic.icon }}</div>
          <h3 class="font-semibold text-text-primary">{{ topic.title }}</h3>
          <p class="text-sm text-text-muted mt-1">{{ topic.description }}</p>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
```

**`src/views/basics/BasicsIndex.vue`**:
```vue
<script setup lang="ts">
import { topics } from '@/data/navigation'
import { getBreadcrumbs } from '@/data/navigation'
import { useRoute } from 'vue-router'

const route = useRoute()
const topic = topics.find(t => t.id === 'basics')!
const breadcrumbs = getBreadcrumbs(route.path)
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-text-muted">
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <RouterLink v-if="crumb.path" :to="crumb.path" class="hover:text-primary">
          {{ crumb.label }}
        </RouterLink>
        <span v-else>{{ crumb.label }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="mx-2">/</span>
      </template>
    </nav>

    <header>
      <h1 class="text-3xl font-bold text-text-primary">
        {{ topic.icon }} {{ topic.title }}
      </h1>
      <p class="text-text-secondary mt-2">{{ topic.description }}</p>
    </header>

    <section>
      <h2 class="section-header">In This Section</h2>
      <div class="space-y-3">
        <RouterLink
          v-for="subtopic in topic.subtopics"
          :key="subtopic.id"
          :to="subtopic.path"
          class="card p-4 flex items-center hover:border-primary transition-colors"
        >
          <span class="font-medium text-text-primary">{{ subtopic.title }}</span>
          <span class="ml-auto text-primary">→</span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
```

**`src/views/basics/FoundationsView.vue`**:
```vue
<script setup lang="ts">
import { getBreadcrumbs } from '@/data/navigation'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbs = getBreadcrumbs(route.path)
</script>

<template>
  <div class="space-y-6">
    <nav class="text-sm text-text-muted">
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <RouterLink v-if="crumb.path" :to="crumb.path" class="hover:text-primary">
          {{ crumb.label }}
        </RouterLink>
        <span v-else>{{ crumb.label }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="mx-2">/</span>
      </template>
    </nav>

    <header>
      <h1 class="text-3xl font-bold text-text-primary">Foundations</h1>
      <p class="text-text-secondary mt-2">
        Everything in math breaks down to four operators and a set of rules.
      </p>
    </header>

    <div class="card p-6">
      <p class="text-text-secondary">
        Content coming soon. This page will cover the foundational concepts 
        that underpin all mathematics.
      </p>
    </div>
  </div>
</template>
```

**`src/views/basics/SymbolsView.vue`**:
```vue
<script setup lang="ts">
import { getBreadcrumbs } from '@/data/navigation'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbs = getBreadcrumbs(route.path)
</script>

<template>
  <div class="space-y-6">
    <nav class="text-sm text-text-muted">
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <RouterLink v-if="crumb.path" :to="crumb.path" class="hover:text-primary">
          {{ crumb.label }}
        </RouterLink>
        <span v-else>{{ crumb.label }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="mx-2">/</span>
      </template>
    </nav>

    <header>
      <h1 class="text-3xl font-bold text-text-primary">Math Symbols</h1>
      <p class="text-text-secondary mt-2">
        A programmer's guide to mathematical notation.
      </p>
    </header>

    <div class="card p-6">
      <p class="text-text-secondary">
        Content coming soon. This page will contain searchable tables of 
        mathematical symbols with programming analogies.
      </p>
    </div>
  </div>
</template>
```

**`src/views/basics/NumberTypesView.vue`**:
```vue
<script setup lang="ts">
import { getBreadcrumbs } from '@/data/navigation'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbs = getBreadcrumbs(route.path)
</script>

<template>
  <div class="space-y-6">
    <nav class="text-sm text-text-muted">
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <RouterLink v-if="crumb.path" :to="crumb.path" class="hover:text-primary">
          {{ crumb.label }}
        </RouterLink>
        <span v-else>{{ crumb.label }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="mx-2">/</span>
      </template>
    </nav>

    <header>
      <h1 class="text-3xl font-bold text-text-primary">Number Types</h1>
      <p class="text-text-secondary mt-2">
        Understanding ℕ, ℤ, ℚ, ℝ, and ℂ — and how they map to code.
      </p>
    </header>

    <div class="card p-6">
      <p class="text-text-secondary">
        Content and NumberTypeExplorer widget coming soon.
      </p>
    </div>
  </div>
</template>
```

**`src/views/NotFoundView.vue`**:
```vue
<template>
  <div class="text-center py-16">
    <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
    <p class="text-xl text-text-secondary mb-8">Page not found</p>
    <RouterLink to="/" class="text-primary hover:underline">
      ← Back to Home
    </RouterLink>
  </div>
</template>
```

## Success Criteria
- [ ] All routes are navigable via browser URL
- [ ] Browser back/forward navigation works correctly
- [ ] No TypeScript errors (including no errors from archive folder)
- [ ] `npm run build` succeeds without processing archive files
- [ ] `npm run type-check` passes
- [ ] Breadcrumb navigation works on all pages
- [ ] Home page shows topic cards
- [ ] Basics index shows subtopic links
- [ ] 404 page shows for unknown routes

## Constraints
- Views should be minimal placeholders (we'll build them out later)
- Navigation UI in header will be added in a future increment
- Lazy loading is used for non-home routes (code splitting)

## Next Increment
After completion, proceed to `inc_1d.md` for TypeScript type definitions.
