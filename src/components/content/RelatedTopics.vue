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
        class="card p-4 hover:border-primary transition-colors group"
      >
        <div class="flex items-start gap-3">
          <i
            v-if="topic.faIcon"
            :class="[topic.faIcon, 'text-lg text-primary']"
            aria-hidden="true"
          />
          <div>
            <span
              class="font-medium text-text-primary group-hover:text-primary transition-colors"
            >
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
