<script setup lang="ts">
import type { InverseTrigPreset } from '@/utils/math/inverseTrig'

interface Props {
  presets: InverseTrigPreset[]
}

defineProps<Props>()

const emit = defineEmits<{
  select: [presetId: string]
}>()
</script>

<template>
  <div class="preset-selector" data-testid="preset-selector">
    <div class="text-sm font-medium text-text-secondary mb-2">
      Quick Examples
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.id"
        class="px-3 py-1.5 text-xs rounded border border-border bg-surface-alt hover:border-primary/50 transition-colors"
        :title="preset.description"
        @click="emit('select', preset.id)"
      >
        <span class="font-mono">{{ preset.name }}</span>
      </button>
    </div>
  </div>
</template>
