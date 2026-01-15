<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface BreadcrumbItem {
  label: string
  path?: string
  icon?: string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-4">
    <ol
      class="flex items-center gap-1 text-sm overflow-x-auto scrollbar-hide pb-1"
      role="list"
    >
      <li v-for="(item, index) in items" :key="index" class="flex items-center shrink-0">
        <!-- Separator (not for first item) -->
        <i
          v-if="index > 0"
          class="fa-solid fa-chevron-right text-text-muted mx-2 text-xs"
          aria-hidden="true"
        />

        <!-- Link or current page -->
        <RouterLink
          v-if="item.path"
          :to="item.path"
          class="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors whitespace-nowrap"
        >
          <i v-if="item.icon" :class="item.icon" class="text-xs" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </RouterLink>

        <span
          v-else
          class="flex items-center gap-1.5 text-text-primary font-medium whitespace-nowrap"
          aria-current="page"
        >
          <i v-if="item.icon" :class="item.icon" class="text-xs" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
/* Fade hint on scroll edges - optional enhancement */
nav {
  position: relative;
}

/* Can add gradient fade indicators here if desired */
</style>
