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
        Content coming soon. This page will cover the foundational concepts that underpin all
        mathematics.
      </p>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
