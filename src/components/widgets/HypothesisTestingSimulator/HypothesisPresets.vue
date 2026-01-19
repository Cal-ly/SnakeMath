<script setup lang="ts">
import type { HypothesisTestPreset } from '@/composables/useHypothesisTesting'

interface Props {
  presets: HypothesisTestPreset[]
}

defineProps<Props>()

const emit = defineEmits<{
  select: [presetId: string]
}>()

function getTestTypeLabel(testType: string): string {
  switch (testType) {
    case 'one-sample-t':
      return 't'
    case 'two-sample-t':
      return 't'
    case 'one-prop-z':
      return 'z'
    case 'two-prop-z':
      return 'z'
    default:
      return ''
  }
}

function getTestTypeColor(testType: string): string {
  switch (testType) {
    case 'one-sample-t':
    case 'two-sample-t':
      return 'bg-blue-500/20 text-blue-400'
    case 'one-prop-z':
    case 'two-prop-z':
      return 'bg-purple-500/20 text-purple-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}
</script>

<template>
  <div>
    <h3 class="text-sm font-medium text-text-secondary mb-2">Quick Start Presets</h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.id"
        class="px-3 py-2 text-sm bg-bg-secondary hover:bg-bg-tertiary rounded-md transition-colors text-left flex items-center gap-2 min-h-[44px]"
        :title="preset.description"
        :data-testid="`preset-${preset.id}`"
        @click="emit('select', preset.id)"
      >
        <span :class="['text-xs font-mono px-1.5 py-0.5 rounded', getTestTypeColor(preset.testType)]">
          {{ getTestTypeLabel(preset.testType) }}
        </span>
        <span class="text-text-primary">{{ preset.name }}</span>
      </button>
    </div>
  </div>
</template>
