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
  /** Custom icon (Font Awesome class) */
  faIcon?: string
  /** Whether to show breadcrumbs */
  showBreadcrumbs?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
  faIcon: undefined,
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

const autoFaIcon = computed(() => {
  const topic = getTopicByPath(route.path)
  if (topic && topic.path === route.path) return topic.faIcon
  return ''
})

const displayTitle = computed(() => props.title || autoTitle.value)
const displayDescription = computed(() => props.description || autoDescription.value)
const displayFaIcon = computed(() => props.faIcon || autoFaIcon.value)

const breadcrumbs = computed(() => getBreadcrumbs(route.path))
</script>

<template>
  <article class="space-y-6">
    <!-- Breadcrumbs -->
    <Breadcrumbs v-if="showBreadcrumbs" :items="breadcrumbs" />

    <!-- Page Header -->
    <header>
      <h1 class="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-3">
        <i v-if="displayFaIcon" :class="[displayFaIcon, 'text-primary']" aria-hidden="true" />
        {{ displayTitle }}
      </h1>
      <p v-if="displayDescription" class="text-text-secondary mt-2 text-lg">
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
