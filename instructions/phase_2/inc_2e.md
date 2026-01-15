# SnakeMath - Increment 2E: TopicPage Layout Wrapper

## Context
Creating a reusable layout wrapper for content pages that provides consistent structure: breadcrumbs, title, description, main content slot, and optional related topics.

## Task
Create the TopicPage component and refactor views to use it.

## Requirements

### 1. Create TopicPage Component
Create `src/components/content/TopicPage.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBreadcrumbs, getSubtopicByPath, getTopicByPath } from '@/data/navigation'
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue'

interface Props {
  /** Page title - overrides auto-detected title */
  title?: string
  /** Page description - overrides auto-detected description */
  description?: string
  /** Custom icon (emoji or Font Awesome class) */
  icon?: string
  /** Whether to show breadcrumbs */
  showBreadcrumbs?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBreadcrumbs: true,
})

const route = useRoute()

// Auto-detect title and description from navigation data
const autoTitle = computed(() => {
  const subtopic = getSubtopicByPath(route.path)
  if (subtopic) return subtopic.title
  
  const topic = getTopicByPath(route.path)
  if (topic && topic.path === route.path) return topic.title
  
  return ''
})

const autoDescription = computed(() => {
  const subtopic = getSubtopicByPath(route.path)
  if (subtopic) return subtopic.description
  
  const topic = getTopicByPath(route.path)
  if (topic && topic.path === route.path) return topic.description
  
  return ''
})

const autoIcon = computed(() => {
  const topic = getTopicByPath(route.path)
  if (topic && topic.path === route.path) return topic.icon
  return ''
})

const displayTitle = computed(() => props.title || autoTitle.value)
const displayDescription = computed(() => props.description || autoDescription.value)
const displayIcon = computed(() => props.icon || autoIcon.value)

const breadcrumbs = computed(() => getBreadcrumbs(route.path))
</script>

<template>
  <article class="space-y-6">
    <!-- Breadcrumbs -->
    <Breadcrumbs 
      v-if="showBreadcrumbs" 
      :items="breadcrumbs" 
    />

    <!-- Page Header -->
    <header>
      <h1 class="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-3">
        <span v-if="displayIcon" aria-hidden="true">{{ displayIcon }}</span>
        {{ displayTitle }}
      </h1>
      <p 
        v-if="displayDescription" 
        class="text-text-secondary mt-2 text-lg"
      >
        {{ displayDescription }}
      </p>
    </header>

    <!-- Main Content Slot -->
    <div class="topic-content">
      <slot />
    </div>

    <!-- Related Topics Slot -->
    <aside v-if="$slots.related" class="mt-8 pt-6 border-t border-border">
      <slot name="related" />
    </aside>

    <!-- Navigation Slot (prev/next) -->
    <nav v-if="$slots.navigation" class="mt-8 pt-6 border-t border-border">
      <slot name="navigation" />
    </nav>
  </article>
</template>

<style scoped>
/* Content styling for consistent prose */
.topic-content {
  @apply space-y-6;
}

/* Ensure proper heading hierarchy in content */
.topic-content :deep(h2) {
  @apply text-xl font-semibold text-text-primary mt-8 mb-4;
}

.topic-content :deep(h3) {
  @apply text-lg font-medium text-text-primary mt-6 mb-3;
}

.topic-content :deep(p) {
  @apply text-text-secondary leading-relaxed;
}

.topic-content :deep(ul),
.topic-content :deep(ol) {
  @apply text-text-secondary ml-4 space-y-2;
}

.topic-content :deep(li) {
  @apply pl-2;
}

.topic-content :deep(code) {
  @apply bg-code-bg px-1.5 py-0.5 rounded text-sm font-mono;
}

.topic-content :deep(pre) {
  @apply bg-code-bg p-4 rounded-lg overflow-x-auto;
}

.topic-content :deep(pre code) {
  @apply bg-transparent p-0;
}
</style>
```

### 2. Create RelatedTopics Component
Create `src/components/content/RelatedTopics.vue`:

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface RelatedTopic {
  title: string
  path: string
  description?: string
  icon?: string
}

interface Props {
  topics: RelatedTopic[]
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Related Topics',
})
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold text-text-primary mb-4">
      <i class="fa-solid fa-link mr-2 text-primary" aria-hidden="true" />
      {{ title }}
    </h2>
    
    <div class="grid gap-3 sm:grid-cols-2">
      <RouterLink
        v-for="topic in topics"
        :key="topic.path"
        :to="topic.path"
        class="card p-4 hover:border-primary transition-colors group"
      >
        <div class="flex items-start gap-3">
          <span 
            v-if="topic.icon" 
            class="text-lg"
            aria-hidden="true"
          >
            {{ topic.icon }}
          </span>
          <div>
            <span class="font-medium text-text-primary group-hover:text-primary transition-colors">
              {{ topic.title }}
            </span>
            <p v-if="topic.description" class="text-sm text-text-muted mt-1">
              {{ topic.description }}
            </p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
```

### 3. Refactor Views to Use TopicPage

Update `src/views/basics/BasicsIndex.vue`:
```vue
<script setup lang="ts">
import { topics } from '@/data/navigation'
import TopicPage from '@/components/content/TopicPage.vue'

const topic = topics.find(t => t.id === 'basics')!
</script>

<template>
  <TopicPage>
    <section>
      <h2>
        <i class="fa-solid fa-book-open mr-2 text-primary" aria-hidden="true" />
        In This Section
      </h2>
      <div class="space-y-3 mt-4">
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
  </TopicPage>
</template>
```

Update `src/views/basics/FoundationsView.vue`:
```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'

const relatedTopics = [
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Learn the notation' },
  { title: 'Number Types', path: '/basics/number-types', description: 'ℕ, ℤ, ℚ, ℝ, ℂ' },
]
</script>

<template>
  <TopicPage
    title="Foundations"
    description="Everything in math breaks down to four operators and a set of rules."
  >
    <div class="card p-6">
      <p>
        Content coming soon. This page will cover the foundational concepts 
        that underpin all mathematics.
      </p>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
```

Update `src/views/basics/SymbolsView.vue`:
```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'

const relatedTopics = [
  { title: 'Foundations', path: '/basics/foundations', description: 'Core concepts' },
  { title: 'Number Types', path: '/basics/number-types', description: 'ℕ, ℤ, ℚ, ℝ, ℂ' },
]
</script>

<template>
  <TopicPage
    title="Math Symbols"
    description="A programmer's guide to mathematical notation."
  >
    <div class="card p-6">
      <p>
        Content coming soon. This page will contain searchable tables of 
        mathematical symbols with programming analogies.
      </p>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
```

Update `src/views/basics/NumberTypesView.vue`:
```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'

const relatedTopics = [
  { title: 'Foundations', path: '/basics/foundations', description: 'Core concepts' },
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Notation guide' },
]
</script>

<template>
  <TopicPage
    title="Number Types"
    description="Understanding ℕ, ℤ, ℚ, ℝ, and ℂ — and how they map to code."
  >
    <div class="card p-6">
      <p>
        Content and NumberTypeExplorer widget coming soon.
      </p>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
```

## Success Criteria
- [ ] TopicPage auto-detects title/description from navigation data
- [ ] Manual title/description props override auto-detection
- [ ] Breadcrumbs render correctly
- [ ] Related topics section appears when slot is used
- [ ] Content styles (headings, paragraphs, code) are consistent
- [ ] Layout is responsive
- [ ] Views are significantly simplified
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Next Increment
After completion, proceed to `inc_2f.md` for AppFooter component.
