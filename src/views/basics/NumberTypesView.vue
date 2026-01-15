<script setup lang="ts">
  import { getBreadcrumbs } from '@/data/navigation'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const breadcrumbs = getBreadcrumbs(route.path)
</script>

<template>
  <div class="space-y-6">
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
      <h1 class="text-3xl font-bold text-text-primary">Number Types</h1>
      <p class="text-text-secondary mt-2">
        Understanding N, Z, Q, R, and C — and how they map to code.
      </p>
    </header>

    <div class="card p-6">
      <p class="text-text-secondary">Content and NumberTypeExplorer widget coming soon.</p>
    </div>
  </div>
</template>
