<script setup lang="ts">
import { computed } from 'vue'
import type { InverseFunctionId } from '@/utils/math/inverseTrig'

interface Props {
  fn: InverseFunctionId
  value: number
  y?: number
  domain: { min: number; max: number }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:value': [value: number]
  'update:y': [value: number]
}>()

const isAtan2 = computed(() => props.fn === 'atan2')

// Determine slider ranges based on function
const sliderMin = computed(() => {
  if (props.fn === 'arcsin' || props.fn === 'arccos') return -1
  return -10
})

const sliderMax = computed(() => {
  if (props.fn === 'arcsin' || props.fn === 'arccos') return 1
  return 10
})

const sliderStep = computed(() => {
  if (props.fn === 'arcsin' || props.fn === 'arccos') return 0.01
  return 0.1
})

function handleValueInput(event: Event) {
  const target = event.target as HTMLInputElement
  const parsed = parseFloat(target.value)
  if (!isNaN(parsed)) {
    emit('update:value', parsed)
  }
}

function handleYInput(event: Event) {
  const target = event.target as HTMLInputElement
  const parsed = parseFloat(target.value)
  if (!isNaN(parsed)) {
    emit('update:y', parsed)
  }
}
</script>

<template>
  <div class="value-input" data-testid="value-input">
    <div class="space-y-4">
      <!-- Main value input (or x for atan2) -->
      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">
          {{ isAtan2 ? 'x coordinate' : 'Input value' }}
        </label>
        <div class="flex items-center gap-3">
          <input
            type="range"
            :min="sliderMin"
            :max="sliderMax"
            :step="sliderStep"
            :value="value"
            class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
            :aria-label="isAtan2 ? 'X coordinate' : 'Input value'"
            @input="handleValueInput"
          />
          <input
            type="number"
            :value="value"
            :step="sliderStep"
            class="w-24 px-2 py-1 text-center border border-border rounded bg-surface text-text-primary"
            :aria-label="isAtan2 ? 'X coordinate value' : 'Input value'"
            @input="handleValueInput"
          />
        </div>
        <p v-if="!isAtan2" class="text-xs text-text-muted mt-1">
          Domain: [{{ domain.min === -Infinity ? '-∞' : domain.min }}, {{ domain.max === Infinity ? '∞' : domain.max }}]
        </p>
      </div>

      <!-- Y input for atan2 -->
      <div v-if="isAtan2">
        <label class="block text-sm font-medium text-text-secondary mb-1">
          y coordinate
        </label>
        <div class="flex items-center gap-3">
          <input
            type="range"
            :min="-10"
            :max="10"
            :step="0.1"
            :value="y"
            class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
            aria-label="Y coordinate"
            @input="handleYInput"
          />
          <input
            type="number"
            :value="y"
            step="0.1"
            class="w-24 px-2 py-1 text-center border border-border rounded bg-surface text-text-primary"
            aria-label="Y coordinate value"
            @input="handleYInput"
          />
        </div>
      </div>
    </div>
  </div>
</template>
