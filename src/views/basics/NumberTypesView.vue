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
      <p>Content and NumberTypeExplorer widget coming soon.</p>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
