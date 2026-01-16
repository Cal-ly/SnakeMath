<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface RelatedTopic {
  title: string
  path: string
  description?: string
  faIcon?: string
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
        class="flex items-center gap-3 bg-surface-alt rounded-lg p-4 border border-border/50 hover:border-primary transition-colors group"
      >
        <i
          v-if="topic.faIcon"
          :class="[topic.faIcon, 'text-lg text-primary']"
          aria-hidden="true"
        />
        <div class="flex-1 min-w-0">
          <span
            class="font-medium text-text-primary group-hover:text-primary transition-colors block"
          >
            {{ topic.title }}
          </span>
          <p v-if="topic.description" class="text-sm text-text-muted mt-0.5">
            {{ topic.description }}
          </p>
        </div>
        <i
          class="fa-solid fa-chevron-right text-text-muted group-hover:text-primary transition-colors flex-shrink-0"
          aria-hidden="true"
        />
      </RouterLink>
    </div>
  </div>
</template>
