<script setup lang="ts">
/**
 * DerivativeDisplay - Shows derivative value and tangent line information
 */

import { computed } from 'vue'
import type { DerivativeResult, TangentLine, DerivativeFunctionPreset } from '@/types/math'
import MathBlock from '@/components/content/MathBlock.vue'

// ============================================================================
// Props
// ============================================================================

interface Props {
  derivativeResult: DerivativeResult | null
  tangentLine: TangentLine | null
  pointX: number
  preset?: DerivativeFunctionPreset
}

const props = defineProps<Props>()

// ============================================================================
// Computed
// ============================================================================

const slopeValue = computed(() => {
  if (!props.derivativeResult?.exists) return null
  return props.derivativeResult.exactValue ?? props.derivativeResult.value
})

const slopeFormatted = computed(() => {
  if (slopeValue.value === null) return 'undefined'
  return slopeValue.value.toFixed(4)
})

const slopeInterpretation = computed(() => {
  const slope = slopeValue.value
  if (slope === null) return 'The derivative does not exist at this point'

  if (Math.abs(slope) < 0.0001) {
    return 'Horizontal tangent (critical point)'
  } else if (slope > 0) {
    return `Function is increasing (slope = ${slope.toFixed(2)})`
  } else {
    return `Function is decreasing (slope = ${slope.toFixed(2)})`
  }
})

const tangentEquation = computed(() => {
  if (!props.tangentLine) return null
  const { slope, yIntercept } = props.tangentLine

  // Format: y = mx + b
  const slopeStr = slope.toFixed(3)
  const interceptStr =
    yIntercept >= 0 ? `+ ${yIntercept.toFixed(3)}` : `- ${Math.abs(yIntercept).toFixed(3)}`

  return `y = ${slopeStr}x ${interceptStr}`
})

// Unused for now but may be used later for formula display
const _derivativeFormula = computed(() => {
  if (!props.preset) return null
  return `f'(${props.pointX.toFixed(2)}) = ${slopeFormatted.value}`
})
</script>

<template>
  <div class="derivative-display p-4 bg-surface-alt rounded-lg border border-border">
    <h4 class="text-sm font-semibold text-primary mb-3">
      <span class="mr-2" aria-hidden="true">∂</span>
      Derivative at x = {{ pointX.toFixed(2) }}
    </h4>

    <!-- Main derivative value -->
    <div class="mb-4">
      <div class="text-2xl font-mono font-bold text-center py-2 bg-surface rounded-lg">
        <span class="text-text-secondary">f'(x) = </span>
        <span :class="slopeValue !== null ? 'text-blue-600' : 'text-red-500'">
          {{ slopeFormatted }}
        </span>
      </div>
    </div>

    <!-- Slope interpretation -->
    <div
      class="p-2 rounded-md text-sm mb-3"
      :class="
        slopeValue === null
          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          : Math.abs(slopeValue) < 0.0001
            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
            : slopeValue > 0
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
      "
    >
      <span class="mr-1" aria-hidden="true">
        {{
          slopeValue === null
            ? '⚠'
            : Math.abs(slopeValue) < 0.0001
              ? '●'
              : slopeValue > 0
                ? '↗'
                : '↘'
        }}
      </span>
      {{ slopeInterpretation }}
    </div>

    <!-- Tangent line equation -->
    <div v-if="tangentEquation" class="mb-3">
      <p class="text-xs text-text-muted mb-1">Tangent line equation:</p>
      <div class="p-2 bg-surface rounded text-sm font-mono">
        {{ tangentEquation }}
      </div>
    </div>

    <!-- Exact formula (if preset has derivative) -->
    <div v-if="preset" class="text-xs text-text-muted">
      <p class="mb-1">Using derivative rule:</p>
      <MathBlock :formula="preset.derivativeLatex" class="text-sm" />
    </div>
  </div>
</template>
