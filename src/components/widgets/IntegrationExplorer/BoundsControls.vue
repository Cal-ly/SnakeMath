<script setup lang="ts">
/**
 * BoundsControls - Integration bounds and subdivision controls
 *
 * Provides:
 * - Lower bound (a) input
 * - Upper bound (b) input
 * - Subdivisions (n) slider + number input
 */

import { computed } from 'vue'
import { MIN_N, MAX_N } from '@/utils/math/integration'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  lowerBound: number
  upperBound: number
  subdivisions: number
  isValidBounds: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:lowerBound': [value: number]
  'update:upperBound': [value: number]
  'update:subdivisions': [value: number]
}>()

// ============================================================================
// Computed
// ============================================================================

const localLowerBound = computed({
  get: () => props.lowerBound,
  set: (value: number) => emit('update:lowerBound', value),
})

const localUpperBound = computed({
  get: () => props.upperBound,
  set: (value: number) => emit('update:upperBound', value),
})

const localSubdivisions = computed({
  get: () => props.subdivisions,
  set: (value: number) => emit('update:subdivisions', value),
})

// ============================================================================
// Handlers
// ============================================================================

function handleLowerBoundInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (isFinite(value)) {
    localLowerBound.value = value
  }
}

function handleUpperBoundInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (isFinite(value)) {
    localUpperBound.value = value
  }
}

function handleSubdivisionsInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value, 10)
  if (isFinite(value)) {
    localSubdivisions.value = Math.max(MIN_N, Math.min(MAX_N, value))
  }
}
</script>

<template>
  <div class="space-y-3">
    <!-- Bounds row -->
    <div class="flex flex-wrap items-center gap-4">
      <!-- Lower bound -->
      <div class="flex items-center gap-2">
        <label for="lower-bound" class="text-sm font-medium text-text-secondary whitespace-nowrap">
          Lower (a):
        </label>
        <input
          id="lower-bound"
          type="number"
          step="0.1"
          :value="lowerBound"
          class="w-20 px-2 py-1 rounded-md border text-center
                 focus:ring-2 focus:ring-primary/30 focus:border-primary
                 transition-colors"
          :class="isValidBounds ? 'border-border bg-surface' : 'border-red-500 bg-red-50 dark:bg-red-900/20'"
          @input="handleLowerBoundInput"
        />
      </div>

      <!-- Upper bound -->
      <div class="flex items-center gap-2">
        <label for="upper-bound" class="text-sm font-medium text-text-secondary whitespace-nowrap">
          Upper (b):
        </label>
        <input
          id="upper-bound"
          type="number"
          step="0.1"
          :value="upperBound"
          class="w-20 px-2 py-1 rounded-md border text-center
                 focus:ring-2 focus:ring-primary/30 focus:border-primary
                 transition-colors"
          :class="isValidBounds ? 'border-border bg-surface' : 'border-red-500 bg-red-50 dark:bg-red-900/20'"
          @input="handleUpperBoundInput"
        />
      </div>
    </div>

    <!-- Invalid bounds warning -->
    <p v-if="!isValidBounds" class="text-xs text-red-600 dark:text-red-400">
      <i class="fa-solid fa-triangle-exclamation mr-1" aria-hidden="true" />
      Lower bound must be less than upper bound (a &lt; b)
    </p>

    <!-- Subdivisions row -->
    <div class="flex flex-wrap items-center gap-3">
      <label for="subdivisions" class="text-sm font-medium text-text-secondary whitespace-nowrap">
        Subdivisions (n):
      </label>
      <input
        id="subdivisions-slider"
        type="range"
        :min="MIN_N"
        :max="MAX_N"
        :value="subdivisions"
        class="flex-1 min-w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        @input="handleSubdivisionsInput"
      />
      <input
        id="subdivisions"
        type="number"
        :min="MIN_N"
        :max="MAX_N"
        :value="subdivisions"
        class="w-16 px-2 py-1 rounded-md border border-border bg-surface text-center
               focus:ring-2 focus:ring-primary/30 focus:border-primary
               transition-colors"
        @input="handleSubdivisionsInput"
      />
    </div>
  </div>
</template>
