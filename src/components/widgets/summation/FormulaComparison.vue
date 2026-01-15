<script setup lang="ts">
import { computed } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'
import type { SummationPreset } from '@/data/summation'

interface Props {
  /** The preset configuration */
  preset: SummationPreset
  /** Number of terms (n) */
  n: number
  /** Result from loop calculation */
  loopTotal: number
}

const props = defineProps<Props>()

// Compute formula result
const formulaResult = computed(() => {
  if (!props.preset.closedForm) return null
  return props.preset.closedForm(props.n)
})

// Check if results match
const resultsMatch = computed(() => {
  if (formulaResult.value === null) return false
  return Math.abs(props.loopTotal - formulaResult.value) < 0.0001
})

// Generate the formula with n substituted
const substitutedFormula = computed(() => {
  if (!props.preset.closedFormLatex) return null

  // Replace n with actual value for display
  // This is a simple replacement - more complex formulas might need better handling
  return props.preset.closedFormLatex.replace(/n/g, props.n.toString())
})

// Format large numbers
function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toLocaleString()
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
}
</script>

<template>
  <div class="formula-comparison">
    <!-- Header -->
    <h4 class="text-sm font-medium text-text-muted mb-4">
      <i class="fa-solid fa-bolt mr-1.5" aria-hidden="true" />
      Closed-Form Formula
    </h4>

    <!-- No formula available -->
    <div v-if="!preset.closedForm" class="p-4 bg-surface-alt rounded-lg text-center">
      <p class="text-text-muted">
        <i class="fa-solid fa-question-circle mr-1" aria-hidden="true" />
        No closed-form formula known for this expression
      </p>
    </div>

    <!-- Formula display -->
    <div v-else class="space-y-4">
      <!-- Formula name and equation -->
      <div class="p-4 bg-surface-alt rounded-lg">
        <p class="text-xs text-primary font-medium uppercase tracking-wide mb-2">
          {{ preset.closedFormName }}
        </p>

        <!-- General formula -->
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs text-text-muted">Formula:</span>
          <MathBlock :formula="preset.closedFormLatex ?? ''" />
        </div>

        <!-- Substituted formula with result -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-text-muted">For n = {{ n }}:</span>
          <MathBlock v-if="substitutedFormula" :formula="`${substitutedFormula} = ${formatNumber(formulaResult ?? 0)}`" />
        </div>
      </div>

      <!-- Comparison result -->
      <div
        class="p-3 rounded-lg flex items-center gap-2"
        :class="
          resultsMatch
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        "
      >
        <i
          :class="resultsMatch ? 'fa-solid fa-check-circle text-green-500' : 'fa-solid fa-times-circle text-red-500'"
          aria-hidden="true"
        />
        <span :class="resultsMatch ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
          <template v-if="resultsMatch">
            Loop result ({{ formatNumber(loopTotal) }}) matches formula result!
          </template>
          <template v-else>
            Results don't match: loop = {{ formatNumber(loopTotal) }}, formula = {{ formatNumber(formulaResult ?? 0) }}
          </template>
        </span>
      </div>

      <!-- Why formulas matter -->
      <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p class="text-sm font-medium text-primary mb-2">
          <i class="fa-solid fa-lightbulb mr-1" aria-hidden="true" />
          Why Use Formulas?
        </p>
        <ul class="text-sm text-text-secondary space-y-1">
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-repeat text-text-muted mt-1 text-xs" aria-hidden="true" />
            <span>
              <strong>Loop:</strong> {{ n }} iterations (O(n) time)
            </span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-bolt text-text-muted mt-1 text-xs" aria-hidden="true" />
            <span>
              <strong>Formula:</strong> 1 calculation (O(1) time)
            </span>
          </li>
        </ul>
        <p class="text-xs text-text-muted mt-3">
          For n = 1,000,000, a loop needs 1,000,000 additions. The formula? Just one calculation!
        </p>
      </div>
    </div>
  </div>
</template>
