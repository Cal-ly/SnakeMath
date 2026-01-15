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
        Content coming soon. This page will contain searchable tables of mathematical symbols with
        programming analogies.
      </p>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
