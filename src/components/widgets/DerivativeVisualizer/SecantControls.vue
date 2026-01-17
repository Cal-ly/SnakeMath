<script setup lang="ts">
/**
 * SecantControls - Controls for the secant line h-value
 *
 * Shows how the secant slope approaches the tangent slope as h → 0
 */

import { computed } from 'vue'
import type { SecantLine } from '@/types/math'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  hValue: number
  secantLine: SecantLine | null
  tangentSlope: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:hValue': [value: number]
}>()

// ============================================================================
// Computed
// ============================================================================

const secantSlope = computed(() => props.secantLine?.slope ?? null)

const slopeDifference = computed(() => {
  if (secantSlope.value === null || props.tangentSlope === null) return null
  return Math.abs(secantSlope.value - props.tangentSlope)
})

const convergenceText = computed(() => {
  const diff = slopeDifference.value
  if (diff === null) return ''

  if (diff < 0.001) return 'Excellent! Nearly identical to tangent slope'
  if (diff < 0.01) return 'Very close to tangent slope'
  if (diff < 0.1) return 'Getting closer...'
  return 'Decrease h to approach tangent'
})
</script>

<template>
  <div class="secant-controls p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
    <h4 class="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-3">
      <span class="mr-2" aria-hidden="true">⟋</span>
      Secant Line: h → 0
    </h4>

    <!-- h slider -->
    <div class="mb-4">
      <label class="block text-xs text-amber-600 dark:text-amber-400 mb-1">
        h = {{ hValue.toFixed(3) }}
      </label>
      <input
        type="range"
        :min="0.001"
        :max="2"
        :step="0.001"
        :value="hValue"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500"
        aria-label="Secant line h value"
        @input="emit('update:hValue', parseFloat(($event.target as HTMLInputElement).value))"
      />
      <div class="flex justify-between text-xs text-amber-600/60 mt-1">
        <span>h → 0 (tangent)</span>
        <span>h = 2</span>
      </div>
    </div>

    <!-- Slope comparison -->
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="p-2 bg-amber-100 dark:bg-amber-800/30 rounded text-center">
        <p class="text-xs text-amber-600 dark:text-amber-400 mb-1">Secant slope</p>
        <p class="font-mono font-bold text-amber-700 dark:text-amber-300">
          {{ secantSlope !== null ? secantSlope.toFixed(4) : '—' }}
        </p>
      </div>
      <div class="p-2 bg-blue-100 dark:bg-blue-800/30 rounded text-center">
        <p class="text-xs text-blue-600 dark:text-blue-400 mb-1">Tangent slope</p>
        <p class="font-mono font-bold text-blue-700 dark:text-blue-300">
          {{ tangentSlope !== null ? tangentSlope.toFixed(4) : '—' }}
        </p>
      </div>
    </div>

    <!-- Convergence indicator -->
    <div v-if="slopeDifference !== null" class="text-xs">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-text-muted">Difference:</span>
        <span class="font-mono font-bold" :class="slopeDifference < 0.01 ? 'text-green-600' : 'text-amber-600'">
          {{ slopeDifference.toFixed(6) }}
        </span>
      </div>
      <p
        class="text-xs"
        :class="slopeDifference < 0.01 ? 'text-green-600' : 'text-amber-600'"
      >
        {{ convergenceText }}
      </p>
    </div>

    <!-- Educational note -->
    <div class="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
      <p class="text-xs text-amber-600/80 dark:text-amber-400/80">
        <strong>Key insight:</strong> As h gets smaller, the secant line
        <em>approaches</em> the tangent line. The derivative is the limit of
        this process: f'(x) = lim<sub>h→0</sub> [f(x+h) - f(x)] / h
      </p>
    </div>
  </div>
</template>

<style scoped>
input[type='range'] {
  background: linear-gradient(to right, #fbbf24 0%, #f59e0b 100%);
}

input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #f59e0b;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type='range']::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #f59e0b;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
