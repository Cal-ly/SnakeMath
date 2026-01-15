<script setup lang="ts">
  import { topics } from '@/data/navigation'
</script>

<template>
  <div class="space-y-8">
    <section class="text-center py-8">
      <h1 class="text-4xl font-bold text-primary mb-4">SnakeMath</h1>
      <p class="text-xl text-text-secondary max-w-2xl mx-auto">
        Mathematics for programmers. Interactive, intuitive, and connected to code.
      </p>
    </section>

    <section>
      <h2 class="section-header">Topics</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="topic in topics"
          :key="topic.id"
          :to="topic.path"
          class="card p-6 hover:border-primary transition-colors"
        >
          <div class="text-3xl mb-2">{{ topic.icon }}</div>
          <h3 class="font-semibold text-text-primary">{{ topic.title }}</h3>
          <p class="text-sm text-text-muted mt-1">{{ topic.description }}</p>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
