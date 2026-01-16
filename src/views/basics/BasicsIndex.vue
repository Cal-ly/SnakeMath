<script setup lang="ts">
import { topics } from '@/data/navigation'
import TopicPage from '@/components/content/TopicPage.vue'

const topic = topics.find((t) => t.id === 'basics')!
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
          class="flex items-center gap-3 bg-surface-alt rounded-lg p-4 border border-border/50 hover:border-primary transition-colors group"
        >
          <i
            :class="subtopic.faIcon || 'fa-solid fa-file'"
            class="text-primary text-lg w-6 text-center"
            aria-hidden="true"
          />
          <div class="flex-1">
            <span
              class="font-medium text-text-primary group-hover:text-primary transition-colors"
            >
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
