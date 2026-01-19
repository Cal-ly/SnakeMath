<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useRoute } from 'vue-router'
import { topics as navTopics, getBreadcrumbs, getSubtopicByPath, getTopicByPath } from '@/data/navigation'
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'

interface RelatedTopicLink {
  title: string
  path: string
  description?: string
  faIcon?: string
}

interface Props {
  /** Page title - overrides auto-detected title */
  title?: string
  /** Page description - overrides auto-detected description */
  description?: string
  /** Custom icon (Font Awesome class) */
  faIcon?: string
  /** Whether to show breadcrumbs */
  showBreadcrumbs?: boolean
  /** Optional explicit related topics (overrides auto-generated) */
  relatedTopics?: RelatedTopicLink[]
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
  faIcon: undefined,
  showBreadcrumbs: true,
  relatedTopics: undefined,
})

const route = useRoute()
const slots = useSlots()

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

const autoRelatedTopics = computed<RelatedTopicLink[]>(() => {
  const topic = getTopicByPath(route.path)
  if (!topic || route.path === '/') return []

  const subtopic = getSubtopicByPath(route.path)
  if (subtopic) {
    const siblings = topic.subtopics
      .filter((s) => s.path !== route.path)
      .slice(0, 6)
      .map((s) => ({
        title: s.title,
        path: s.path,
        description: s.description,
        faIcon: s.faIcon,
      }))

    return [
      {
        title: `${topic.title} Overview`,
        path: topic.path,
        description: 'Back to the section index',
        faIcon: topic.faIcon,
      },
      ...siblings,
    ]
  }

  // Topic index page: link to other chapters
  return navTopics
    .filter((t) => t.path !== topic.path)
    .slice(0, 6)
    .map((t) => ({
      title: t.title,
      path: t.path,
      description: t.description,
      faIcon: t.faIcon,
    }))
})

const effectiveRelatedTopics = computed<RelatedTopicLink[]>(() => props.relatedTopics ?? autoRelatedTopics.value)
const hasRelatedSlot = computed(() => Boolean(slots.related))
const shouldShowRelated = computed(() => hasRelatedSlot.value || effectiveRelatedTopics.value.length > 0)
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

    <!-- Related Topics -->
    <ContentSection
      v-if="shouldShowRelated"
      id="related-topics"
      title="Related Topics"
      icon="fa-solid fa-link"
      collapsible
      :default-expanded="false"
    >
      <slot v-if="hasRelatedSlot" name="related" />
      <RelatedTopics v-else :topics="effectiveRelatedTopics" :show-title="false" />
    </ContentSection>

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
