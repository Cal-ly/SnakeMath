<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  /** Panel title */
  title: string
  /** Start expanded */
  defaultExpanded?: boolean
  /** Icon class (Font Awesome) */
  icon?: string
  /** Variant styling */
  variant?: 'default' | 'card' | 'subtle'
  /** ID for ARIA (auto-generated if not provided) */
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: true,
  icon: undefined,
  variant: 'default',
  id: undefined,
})

const isExpanded = ref(props.defaultExpanded)
const contentId = computed(() => props.id || `panel-${Math.random().toString(36).slice(2, 9)}`)
const buttonId = computed(() => `${contentId.value}-button`)

function toggle() {
  isExpanded.value = !isExpanded.value
}

// Expose for parent components if needed
defineExpose({
  isExpanded,
  toggle,
  expand: () => {
    isExpanded.value = true
  },
  collapse: () => {
    isExpanded.value = false
  },
})
</script>

<template>
  <div
    :class="[
      'collapsible-panel',
      `variant-${variant}`,
      { 'is-expanded': isExpanded }
    ]"
  >
    <!-- Header/Toggle Button -->
    <button
      :id="buttonId"
      type="button"
      class="panel-header w-full flex items-center gap-3 text-left"
      :class="{
        'p-4 rounded-lg border border-border hover:bg-surface-alt': variant === 'card',
        'py-3 hover:text-primary': variant === 'default',
        'py-2 text-sm': variant === 'subtle',
      }"
      :aria-expanded="isExpanded"
      :aria-controls="contentId"
      @click="toggle"
    >
      <!-- Expand/Collapse Icon -->
      <span
        class="toggle-icon transition-transform duration-200"
        :class="{ 'rotate-90': isExpanded }"
        aria-hidden="true"
      >
        <i class="fa-solid fa-chevron-right text-xs text-text-muted" />
      </span>

      <!-- Custom Icon -->
      <span v-if="icon" class="text-primary" aria-hidden="true">
        <i :class="icon" />
      </span>

      <!-- Title -->
      <span
        class="flex-1 font-medium"
        :class="{
          'text-text-primary': variant !== 'subtle',
          'text-text-secondary': variant === 'subtle',
        }"
      >
        {{ title }}
      </span>

      <!-- Optional slot for header extras (like badges) -->
      <slot name="header-extra" />
    </button>

    <!-- Collapsible Content -->
    <div
      :id="contentId"
      role="region"
      :aria-labelledby="buttonId"
      class="panel-content overflow-hidden transition-all duration-200"
      :class="{
        'max-h-0 opacity-0': !isExpanded,
        'max-h-[2000px] opacity-100': isExpanded,
      }"
    >
      <div
        class="content-inner"
        :class="{
          'pt-4 pl-8': variant === 'default',
          'p-4 pt-0 border-t border-border mt-4': variant === 'card',
          'pt-2 pl-6': variant === 'subtle',
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth height animation */
.panel-content {
  will-change: max-height, opacity;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .panel-content,
  .toggle-icon {
    transition: none;
  }
}

/* Card variant enhancements */
.variant-card.is-expanded .panel-header {
  @apply rounded-b-none;
}

.variant-card .panel-content {
  @apply border border-t-0 border-border rounded-b-lg;
}

.variant-card .panel-content:not(.max-h-0) {
  @apply border-t-0;
}
</style>
