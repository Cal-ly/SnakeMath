<script setup lang="ts">
import { computed } from 'vue'
import type { Vector2D } from '@/types/math'

interface Props {
  label: string
  vector: Vector2D
  color: 'emerald' | 'blue'
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: -5,
  max: 5,
})

const emit = defineEmits<{
  'update:vector': [vector: Vector2D]
}>()

const colorClasses = computed(() => {
  return props.color === 'emerald'
    ? 'border-emerald-500 focus-within:ring-emerald-500/20'
    : 'border-blue-500 focus-within:ring-blue-500/20'
})

const labelColorClass = computed(() => {
  return props.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
})

function updateX(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value)) {
    emit('update:vector', {
      x: Math.max(props.min, Math.min(props.max, value)),
      y: props.vector.y,
    })
  }
}

function updateY(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value)) {
    emit('update:vector', {
      x: props.vector.x,
      y: Math.max(props.min, Math.min(props.max, value)),
    })
  }
}
</script>

<template>
  <div class="vector-input-panel">
    <div class="flex items-center gap-2 mb-2">
      <span
        class="w-3 h-3 rounded-full"
        :class="color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'"
      />
      <span class="font-semibold" :class="labelColorClass">{{ label }}</span>
    </div>

    <div
      class="flex items-center gap-2 p-2 rounded-lg border-2 bg-surface focus-within:ring-2"
      :class="colorClasses"
    >
      <span class="text-text-muted text-sm">(</span>

      <div class="flex flex-col items-center">
        <label :for="`${label}-x`" class="text-xs text-text-muted">x</label>
        <input
          :id="`${label}-x`"
          type="number"
          :value="vector.x"
          :min="min"
          :max="max"
          step="0.5"
          class="w-14 px-1 py-0.5 text-center bg-transparent border-b border-border focus:border-primary focus:outline-none text-sm font-mono"
          :data-testid="`vector-${label.toLowerCase()}-x`"
          @input="updateX"
        />
      </div>

      <span class="text-text-muted">,</span>

      <div class="flex flex-col items-center">
        <label :for="`${label}-y`" class="text-xs text-text-muted">y</label>
        <input
          :id="`${label}-y`"
          type="number"
          :value="vector.y"
          :min="min"
          :max="max"
          step="0.5"
          class="w-14 px-1 py-0.5 text-center bg-transparent border-b border-border focus:border-primary focus:outline-none text-sm font-mono"
          :data-testid="`vector-${label.toLowerCase()}-y`"
          @input="updateY"
        />
      </div>

      <span class="text-text-muted text-sm">)</span>
    </div>

    <div class="mt-1 text-xs text-text-muted">
      |{{ label }}| = {{ Math.sqrt(vector.x ** 2 + vector.y ** 2).toFixed(2) }}
    </div>
  </div>
</template>
