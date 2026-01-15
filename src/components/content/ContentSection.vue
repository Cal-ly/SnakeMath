<script setup lang="ts">
import CollapsiblePanel from '@/components/ui/CollapsiblePanel.vue'

interface Props {
  /** Section ID for deep linking */
  id: string
  /** Section title */
  title: string
  /** Font Awesome icon class */
  icon?: string
  /** Make section collapsible */
  collapsible?: boolean
  /** Start expanded (if collapsible) */
  defaultExpanded?: boolean
}

withDefaults(defineProps<Props>(), {
  icon: undefined,
  collapsible: false,
  defaultExpanded: true,
})
</script>

<template>
  <section :id="id" class="content-section scroll-mt-20">
    <!-- Non-collapsible version -->
    <template v-if="!collapsible">
      <h2 class="flex items-center gap-2 text-xl font-semibold text-text-primary mb-4">
        <i v-if="icon" :class="icon" class="text-primary" aria-hidden="true" />
        <a :href="`#${id}`" class="hover:text-primary transition-colors">
          {{ title }}
        </a>
      </h2>
      <div class="section-content">
        <slot />
      </div>
    </template>

    <!-- Collapsible version -->
    <CollapsiblePanel
      v-else
      :id="id"
      :title="title"
      :icon="icon"
      :default-expanded="defaultExpanded"
      variant="default"
    >
      <slot />
    </CollapsiblePanel>
  </section>
</template>

<style scoped>
/* Ensure anchor links account for sticky header */
.content-section {
  scroll-margin-top: 5rem;
}

/* Deep link indicator on hover */
.content-section h2 a:hover::before {
  content: '#';
  @apply absolute -ml-5 text-text-muted;
}

.content-section h2 {
  @apply relative;
}
</style>
