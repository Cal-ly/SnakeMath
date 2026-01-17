<script setup lang="ts">
/**
 * LimitDisplay - Shows limit results and continuity status
 */

import { computed } from 'vue'
import type { LimitResult, ContinuityResult, ApproachDirection } from '@/types/math'
import MathBlock from '@/components/content/MathBlock.vue'

// ============================================================================
// Props
// ============================================================================

interface Props {
  limitResult: LimitResult | null
  continuityResult: ContinuityResult | null
  approachPoint: number
  approachDirection: ApproachDirection
}

const props = defineProps<Props>()

// ============================================================================
// Computed
// ============================================================================

/**
 * Format the limit notation based on direction
 */
const limitNotation = computed(() => {
  const a = props.approachPoint
  if (props.approachDirection === 'left') {
    return `\\lim_{x \\to ${a}^-}`
  }
  if (props.approachDirection === 'right') {
    return `\\lim_{x \\to ${a}^+}`
  }
  return `\\lim_{x \\to ${a}}`
})

/**
 * Format the limit value for display
 */
const limitValueDisplay = computed(() => {
  if (!props.limitResult) return 'N/A'

  if (props.limitResult.limitType === 'does-not-exist') {
    return '\\text{DNE}'
  }

  if (props.limitResult.value === Infinity) return '+\\infty'
  if (props.limitResult.value === -Infinity) return '-\\infty'

  if (props.limitResult.value !== null) {
    return props.limitResult.value.toFixed(4).replace(/\.?0+$/, '')
  }

  return '\\text{undefined}'
})

/**
 * Badge styling based on continuity type
 */
const continuityBadgeClass = computed(() => {
  if (!props.continuityResult) return ''

  switch (props.continuityResult.discontinuityType) {
    case 'none':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'removable':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'jump':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'infinite':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'oscillating':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
})

/**
 * Icon for continuity type
 */
const continuityIcon = computed(() => {
  if (!props.continuityResult) return ''

  switch (props.continuityResult.discontinuityType) {
    case 'none':
      return '✓'
    case 'removable':
      return '○'
    case 'jump':
      return '⌐'
    case 'infinite':
      return '∞'
    case 'oscillating':
      return '~'
    default:
      return '?'
  }
})

/**
 * Format left/right limit display
 */
function formatSideLimit(value: number | null): string {
  if (value === null) return 'N/A'
  if (value === Infinity) return '+∞'
  if (value === -Infinity) return '-∞'
  if (!isFinite(value)) return 'undefined'
  return value.toFixed(4).replace(/\.?0+$/, '')
}
</script>

<template>
  <div class="limit-display space-y-4">
    <!-- Main Limit Result -->
    <div class="p-4 bg-surface-alt rounded-lg border border-border">
      <h4 class="text-sm font-semibold text-primary mb-3">
        <span class="mr-2" aria-hidden="true">=</span>
        Limit Value
      </h4>

      <div class="text-center py-2">
        <MathBlock :formula="`${limitNotation} f(x) = ${limitValueDisplay}`" display />
      </div>

      <!-- One-sided limits (when both directions shown) -->
      <div
        v-if="approachDirection === 'both' && limitResult"
        class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border"
      >
        <div class="text-center">
          <p class="text-xs text-text-muted mb-1">Left limit</p>
          <p class="font-mono text-sm">
            lim x→{{ approachPoint }}⁻ = {{ formatSideLimit(limitResult.leftLimit) }}
          </p>
        </div>
        <div class="text-center">
          <p class="text-xs text-text-muted mb-1">Right limit</p>
          <p class="font-mono text-sm">
            lim x→{{ approachPoint }}⁺ = {{ formatSideLimit(limitResult.rightLimit) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Continuity Status -->
    <div class="p-4 bg-surface-alt rounded-lg border border-border">
      <h4 class="text-sm font-semibold text-primary mb-3">
        <span class="mr-2" aria-hidden="true">⊢</span>
        Continuity
      </h4>

      <div v-if="continuityResult" class="space-y-3">
        <!-- Status Badge -->
        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
            :class="continuityBadgeClass"
          >
            <span aria-hidden="true">{{ continuityIcon }}</span>
            {{
              continuityResult.isContinuous
                ? 'Continuous'
                : continuityResult.discontinuityType.charAt(0).toUpperCase() +
                  continuityResult.discontinuityType.slice(1)
            }}
          </span>
        </div>

        <!-- Description -->
        <p class="text-sm text-text-secondary">
          {{ continuityResult.description }}
        </p>
      </div>
    </div>

    <!-- Limit Type Info -->
    <div v-if="limitResult" class="p-3 bg-primary/10 border border-primary/30 rounded-lg">
      <p class="text-xs text-primary">
        <span class="mr-1" aria-hidden="true">ℹ</span>
        <span v-if="limitResult.limitType === 'finite'">
          The limit exists and is finite.
        </span>
        <span v-else-if="limitResult.limitType === 'infinite'">
          The function approaches infinity (vertical asymptote).
        </span>
        <span v-else>
          The limit does not exist (left and right limits differ or oscillate).
        </span>
      </p>
    </div>
  </div>
</template>
