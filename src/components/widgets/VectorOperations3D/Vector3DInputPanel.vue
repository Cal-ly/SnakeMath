<script setup lang="ts">
import { computed } from 'vue'
import type { Vector3D } from '@/types/math'

interface Props {
  label: string
  vector: Vector3D
  color?: 'emerald' | 'violet' | 'amber'
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'emerald',
  min: -5,
  max: 5,
})

const emit = defineEmits<{
  'update:vector': [vector: Vector3D]
}>()

const colorClasses = computed(() => {
  const colors = {
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    violet: {
      bg: 'bg-violet-500/10 dark:bg-violet-500/20',
      border: 'border-violet-500/30',
      text: 'text-violet-600 dark:text-violet-400',
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400',
    },
  }
  return colors[props.color]
})

function handleXChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value)) {
    emit('update:vector', { ...props.vector, x: value })
  }
}

function handleYChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value)) {
    emit('update:vector', { ...props.vector, y: value })
  }
}

function handleZChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value)) {
    emit('update:vector', { ...props.vector, z: value })
  }
}
</script>

<template>
  <div
    class="vector-input-panel p-4 rounded-lg border"
    :class="[colorClasses.bg, colorClasses.border]"
    :data-testid="`vector-input-${label.toLowerCase()}`"
  >
    <div class="flex items-center gap-2 mb-3">
      <span
        class="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
        :class="colorClasses.text"
      >
        {{ label }}
      </span>
      <span class="text-sm text-text-muted">
        = ({{ vector.x }}, {{ vector.y }}, {{ vector.z }})
      </span>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <!-- X Component -->
      <div>
        <label
          :for="`vector-${label}-x`"
          class="block text-xs font-medium mb-1"
          :class="colorClasses.text"
        >
          X
        </label>
        <input
          :id="`vector-${label}-x`"
          type="number"
          :value="vector.x"
          :min="min"
          :max="max"
          step="1"
          class="w-full px-2 py-1.5 text-sm border border-border rounded bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
          :data-testid="`vector-${label.toLowerCase()}-x`"
          @input="handleXChange"
        />
      </div>

      <!-- Y Component -->
      <div>
        <label
          :for="`vector-${label}-y`"
          class="block text-xs font-medium mb-1"
          :class="colorClasses.text"
        >
          Y
        </label>
        <input
          :id="`vector-${label}-y`"
          type="number"
          :value="vector.y"
          :min="min"
          :max="max"
          step="1"
          class="w-full px-2 py-1.5 text-sm border border-border rounded bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
          :data-testid="`vector-${label.toLowerCase()}-y`"
          @input="handleYChange"
        />
      </div>

      <!-- Z Component -->
      <div>
        <label
          :for="`vector-${label}-z`"
          class="block text-xs font-medium mb-1"
          :class="colorClasses.text"
        >
          Z
        </label>
        <input
          :id="`vector-${label}-z`"
          type="number"
          :value="vector.z"
          :min="min"
          :max="max"
          step="1"
          class="w-full px-2 py-1.5 text-sm border border-border rounded bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
          :data-testid="`vector-${label.toLowerCase()}-z`"
          @input="handleZChange"
        />
      </div>
    </div>
  </div>
</template>
