<script setup lang="ts">
import { useClipboard } from '@/composables/useClipboard'

interface Props {
  text: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Copy to clipboard',
})

const { copy, copied } = useClipboard()

async function handleCopy() {
  await copy(props.text)
}
</script>

<template>
  <button
    type="button"
    :aria-label="copied ? 'Copied!' : ariaLabel"
    :class="[
      'copy-button p-1.5 rounded transition-all duration-200',
      'text-text-muted hover:text-text-primary hover:bg-surface-alt',
      { 'copy-success': copied }
    ]"
    @click="handleCopy"
  >
    <i
      :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'"
      class="text-sm"
      aria-hidden="true"
    />
  </button>
</template>

<style scoped>
.copy-success {
  @apply text-primary;
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  animation: copy-pulse 0.3s ease-out;
}

@keyframes copy-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .copy-success {
    animation: none;
  }
}
</style>
