<script setup lang="ts">
  import { topics } from '@/data/navigation'
  import { getBreadcrumbs } from '@/data/navigation'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const topic = topics.find((t) => t.id === 'basics')!
  const breadcrumbs = getBreadcrumbs(route.path)
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-text-muted">
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <RouterLink v-if="crumb.path" :to="crumb.path" class="hover:text-primary">
          {{ crumb.label }}
        </RouterLink>
        <span v-else>{{ crumb.label }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="mx-2">/</span>
      </template>
    </nav>

    <header>
      <h1 class="text-3xl font-bold text-text-primary">{{ topic.icon }} {{ topic.title }}</h1>
      <p class="text-text-secondary mt-2">{{ topic.description }}</p>
    </header>

    <section>
      <h2 class="section-header">In This Section</h2>
      <div class="space-y-3">
        <RouterLink
          v-for="subtopic in topic.subtopics"
          :key="subtopic.id"
          :to="subtopic.path"
          class="card p-4 flex items-center hover:border-primary transition-colors"
        >
          <span class="font-medium text-text-primary">{{ subtopic.title }}</span>
          <span class="ml-auto text-primary">→</span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
