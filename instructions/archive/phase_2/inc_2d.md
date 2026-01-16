# SnakeMath - Increment 2D: Breadcrumbs Component

## Context
Creating a reusable breadcrumbs component that shows the navigation path. On mobile, it uses horizontal scroll to show the full path without truncation.

## Design Decisions
- **Mobile behavior**: Full path with horizontal scroll
- **Separator**: Chevron icon
- **Current page**: Not a link, visually distinct

## Task
Create the Breadcrumbs component and update views to use it.

## Requirements

### 1. Create Breadcrumbs Component
Create `src/components/layout/Breadcrumbs.vue`:

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface BreadcrumbItem {
  label: string
  path?: string
  icon?: string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-4">
    <ol 
      class="flex items-center gap-1 text-sm overflow-x-auto scrollbar-hide pb-1"
      role="list"
    >
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="flex items-center shrink-0"
      >
        <!-- Separator (not for first item) -->
        <i 
          v-if="index > 0" 
          class="fa-solid fa-chevron-right text-text-muted mx-2 text-xs"
          aria-hidden="true"
        />
        
        <!-- Link or current page -->
        <RouterLink
          v-if="item.path"
          :to="item.path"
          class="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors whitespace-nowrap"
        >
          <i 
            v-if="item.icon" 
            :class="item.icon" 
            class="text-xs"
            aria-hidden="true"
          />
          <span>{{ item.label }}</span>
        </RouterLink>
        
        <span 
          v-else 
          class="flex items-center gap-1.5 text-text-primary font-medium whitespace-nowrap"
          aria-current="page"
        >
          <i 
            v-if="item.icon" 
            :class="item.icon" 
            class="text-xs"
            aria-hidden="true"
          />
          <span>{{ item.label }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
/* Fade hint on scroll edges - optional enhancement */
nav {
  position: relative;
}

/* Can add gradient fade indicators here if desired */
</style>
```

### 2. Create Composable for Breadcrumbs (Optional)
Create `src/composables/useBreadcrumbs.ts` for easy use in views:

```typescript
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBreadcrumbs } from '@/data/navigation'

/**
 * Composable to get breadcrumbs for current route
 */
export function useBreadcrumbs() {
  const route = useRoute()
  
  const breadcrumbs = computed(() => getBreadcrumbs(route.path))
  
  return {
    breadcrumbs,
  }
}
```

### 3. Update Composables Barrel Export
Update `src/composables/index.ts`:

```typescript
export { useTheme } from './useTheme'
export type { ThemeMode } from './useTheme'
export { useBreadcrumbs } from './useBreadcrumbs'
```

### 4. Update Views to Use Breadcrumbs Component

Update `src/views/basics/BasicsIndex.vue`:
```vue
<script setup lang="ts">
import { topics } from '@/data/navigation'
import { useBreadcrumbs } from '@/composables'
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue'

const topic = topics.find(t => t.id === 'basics')!
const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
  <div class="space-y-6">
    <Breadcrumbs :items="breadcrumbs" />

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
          class="card p-4 flex items-center gap-3 hover:border-primary transition-colors group"
        >
          <i 
            :class="subtopic.faIcon || 'fa-solid fa-file'" 
            class="text-primary text-lg w-6 text-center"
            aria-hidden="true"
          />
          <div class="flex-1">
            <span class="font-medium text-text-primary group-hover:text-primary transition-colors">
              {{ subtopic.title }}
            </span>
            <p v-if="subtopic.description" class="text-sm text-text-muted mt-0.5">
              {{ subtopic.description }}
            </p>
          </div>
          <i 
            class="fa-solid fa-chevron-right text-text-muted group-hover:text-primary transition-colors"
            aria-hidden="true"
          />
        </RouterLink>
      </div>
    </section>
  </div>
</template>
```

Update `src/views/basics/FoundationsView.vue`:
```vue
<script setup lang="ts">
import { useBreadcrumbs } from '@/composables'
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue'

const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
  <div class="space-y-6">
    <Breadcrumbs :items="breadcrumbs" />

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

Update `src/views/basics/SymbolsView.vue`:
```vue
<script setup lang="ts">
import { useBreadcrumbs } from '@/composables'
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue'

const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
  <div class="space-y-6">
    <Breadcrumbs :items="breadcrumbs" />

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

Update `src/views/basics/NumberTypesView.vue`:
```vue
<script setup lang="ts">
import { useBreadcrumbs } from '@/composables'
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue'

const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
  <div class="space-y-6">
    <Breadcrumbs :items="breadcrumbs" />

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

## Success Criteria
- [ ] Breadcrumbs show correct path on all pages
- [ ] Home link has house icon
- [ ] Current page is not a link, shows as bold/distinct
- [ ] Clicking breadcrumb links navigates correctly
- [ ] On mobile, breadcrumbs scroll horizontally (test with long paths)
- [ ] Scrollbar is hidden but scroll functionality works
- [ ] Screen reader announces "Breadcrumb" navigation
- [ ] `aria-current="page"` is set on current page item
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Mobile Testing
1. Resize browser to mobile width
2. Navigate to a subtopic (e.g., /basics/foundations)
3. Breadcrumbs should show "Home > Foundations > The Basics"
4. If content overflows, should be able to swipe/scroll horizontally

## Next Increment
After completion, proceed to `inc_2e.md` for TopicPage layout wrapper.
