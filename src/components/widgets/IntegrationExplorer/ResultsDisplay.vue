<script setup lang="ts">
/**
 * ResultsDisplay - Shows approximation, exact value, and error
 */

import { computed } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'
import type { IntegrationResult, IntegrationFunctionPreset } from '@/types/math'

// ============================================================================
// Props
// ============================================================================

interface Props {
  result: IntegrationResult | null
  preset?: IntegrationFunctionPreset
  lowerBound: number
  upperBound: number
}

const props = defineProps<Props>()

// ============================================================================
// Computed
// ============================================================================

const approximationDisplay = computed(() => {
  if (!props.result) return '—'
  return props.result.approximation.toFixed(4)
})

const exactDisplay = computed(() => {
  if (!props.result?.exactValue) return '—'
  return props.result.exactValue.toFixed(4)
})

const absoluteErrorDisplay = computed(() => {
  if (!props.result?.absoluteError) return '—'
  return props.result.absoluteError.toFixed(6)
})

const relativeErrorDisplay = computed(() => {
  if (!props.result?.relativeError) return '—'
  return (props.result.relativeError * 100).toFixed(2) + '%'
})

const integralLatex = computed(() => {
  if (!props.preset) return ''
  const a = formatBound(props.lowerBound)
  const b = formatBound(props.upperBound)
  // Simple function name extraction (remove f(x) = prefix)
  const fnPart = props.preset.latex.replace('f(x) = ', '')
  return `\\int_{${a}}^{${b}} ${fnPart} \\, dx`
})

function formatBound(value: number): string {
  // Handle special values
  if (Math.abs(value - Math.PI) < 0.001) return '\\pi'
  if (Math.abs(value - Math.E) < 0.001) return 'e'
  if (Math.abs(value + Math.PI) < 0.001) return '-\\pi'
  // Format numbers nicely
  if (Number.isInteger(value)) return value.toString()
  return value.toFixed(2)
}
</script>

<template>
  <div class="space-y-3">
    <!-- Main results grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <!-- Approximation -->
      <div class="p-3 rounded-lg bg-primary/10 border border-primary/30">
        <div class="text-xs text-primary font-medium mb-1">Approximation</div>
        <div class="text-lg font-mono font-semibold text-primary">
          {{ approximationDisplay }}
        </div>
      </div>

      <!-- Exact value -->
      <div class="p-3 rounded-lg bg-surface-alt border border-border">
        <div class="text-xs text-text-secondary font-medium mb-1">Exact Value</div>
        <div class="text-lg font-mono font-semibold">
          {{ exactDisplay }}
        </div>
      </div>

      <!-- Absolute error -->
      <div class="p-3 rounded-lg bg-surface-alt border border-border">
        <div class="text-xs text-text-secondary font-medium mb-1">Abs. Error</div>
        <div class="text-lg font-mono font-semibold">
          {{ absoluteErrorDisplay }}
        </div>
      </div>

      <!-- Relative error -->
      <div
        class="p-3 rounded-lg border"
        :class="result && result.relativeError !== undefined && result.relativeError < 0.01
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-surface-alt border-border'"
      >
        <div
class="text-xs font-medium mb-1"
          :class="result && result.relativeError !== undefined && result.relativeError < 0.01
            ? 'text-green-600 dark:text-green-400'
            : 'text-text-secondary'">
          Rel. Error
        </div>
        <div
class="text-lg font-mono font-semibold"
          :class="result && result.relativeError !== undefined && result.relativeError < 0.01
            ? 'text-green-600 dark:text-green-400'
            : ''">
          {{ relativeErrorDisplay }}
        </div>
      </div>
    </div>

    <!-- Integral formula -->
    <div v-if="preset && result" class="p-3 rounded-lg bg-surface-alt border border-border">
      <div class="flex flex-wrap items-center gap-2">
        <MathBlock :formula="integralLatex" />
        <span class="text-text-muted">=</span>
        <span class="font-mono">{{ result.exactValue?.toFixed(4) ?? '?' }}</span>
        <span class="text-text-muted ml-2">
          ({{ preset.exactValueDisplay }})
        </span>
      </div>
    </div>
  </div>
</template>
