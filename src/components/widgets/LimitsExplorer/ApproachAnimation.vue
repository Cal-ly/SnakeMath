<script setup lang="ts">
/**
 * ApproachAnimation - Shows numerical approach sequence
 *
 * Displays the sequence of f(x) values as x approaches the limit point,
 * demonstrating numerical limit approximation.
 */

import { computed, ref, watch, onUnmounted } from 'vue'
import type { LimitApproximationStep, ApproachDirection } from '@/types/math'
import { numericalLimitApproximation } from '@/utils/math/limits'

// ============================================================================
// Props
// ============================================================================

interface Props {
  fn: ((x: number) => number) | null
  approachPoint: number
  direction: ApproachDirection
}

const props = defineProps<Props>()

// ============================================================================
// State
// ============================================================================

const isPlaying = ref(false)
const currentStep = ref(0)
const animationInterval = ref<ReturnType<typeof setInterval> | null>(null)

// ============================================================================
// Computed
// ============================================================================

/**
 * Generate approximation sequences for both directions
 */
const leftSequence = computed<LimitApproximationStep[]>(() => {
  if (!props.fn || props.direction === 'right') return []
  return numericalLimitApproximation(props.fn, props.approachPoint, 'left', 8)
})

const rightSequence = computed<LimitApproximationStep[]>(() => {
  if (!props.fn || props.direction === 'left') return []
  return numericalLimitApproximation(props.fn, props.approachPoint, 'right', 8)
})

interface DisplayStep extends LimitApproximationStep {
  side?: 'left' | 'right'
}

/**
 * Display sequence based on direction
 */
const displaySequence = computed<DisplayStep[]>(() => {
  if (props.direction === 'left') return leftSequence.value
  if (props.direction === 'right') return rightSequence.value
  // For 'both', interleave left and right
  const result: DisplayStep[] = []
  const maxLen = Math.max(leftSequence.value.length, rightSequence.value.length)
  for (let i = 0; i < maxLen; i++) {
    const leftStep = leftSequence.value[i]
    const rightStep = rightSequence.value[i]
    if (leftStep) {
      result.push({ ...leftStep, side: 'left' })
    }
    if (rightStep) {
      result.push({ ...rightStep, side: 'right' })
    }
  }
  return result
})

/**
 * Visible steps based on animation progress
 */
const visibleSteps = computed(() => {
  if (!isPlaying.value) return displaySequence.value
  return displaySequence.value.slice(0, currentStep.value + 1)
})

// ============================================================================
// Methods
// ============================================================================

function startAnimation(): void {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = 0

  animationInterval.value = setInterval(() => {
    if (currentStep.value < displaySequence.value.length - 1) {
      currentStep.value++
    } else {
      stopAnimation()
    }
  }, 500) // 500ms between steps
}

function stopAnimation(): void {
  isPlaying.value = false
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
    animationInterval.value = null
  }
}

function resetAnimation(): void {
  stopAnimation()
  currentStep.value = 0
}

/**
 * Format number for display
 */
function formatNumber(n: number): string {
  if (!isFinite(n)) return n > 0 ? '+∞' : '-∞'
  if (isNaN(n)) return 'undefined'
  return n.toFixed(6)
}

// ============================================================================
// Watchers
// ============================================================================

// Reset animation when inputs change
watch([() => props.fn, () => props.approachPoint, () => props.direction], () => {
  resetAnimation()
})

// Cleanup on unmount
onUnmounted(() => {
  stopAnimation()
})
</script>

<template>
  <div class="approach-animation p-4 bg-surface-alt rounded-lg border border-border">
    <div class="flex justify-between items-center mb-3">
      <h4 class="text-sm font-semibold text-primary">
        <span class="mr-2" aria-hidden="true">📈</span>
        Numerical Approximation
      </h4>
      <div class="flex gap-2">
        <button
          class="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isPlaying"
          @click="startAnimation"
        >
          <span class="mr-1" aria-hidden="true">▶</span>
          Play
        </button>
        <button
          class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          @click="resetAnimation"
        >
          <span class="mr-1" aria-hidden="true">↺</span>
          Reset
        </button>
      </div>
    </div>

    <!-- Sequence Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead>
          <tr class="border-b border-border">
            <th class="py-1 px-2 text-left text-text-muted">Step</th>
            <th v-if="direction === 'both'" class="py-1 px-2 text-left text-text-muted">
              Side
            </th>
            <th class="py-1 px-2 text-right text-text-muted">x</th>
            <th class="py-1 px-2 text-right text-text-muted">f(x)</th>
            <th class="py-1 px-2 text-right text-text-muted">|x - a|</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(step, i) in visibleSteps"
            :key="i"
            class="border-b border-border/50"
            :class="{ 'bg-primary/10': i === currentStep && isPlaying }"
          >
            <td class="py-1 px-2 font-mono">{{ i + 1 }}</td>
            <td
              v-if="direction === 'both'"
              class="py-1 px-2"
              :class="step.side === 'left' ? 'text-orange-600' : 'text-green-600'"
            >
              {{ step.side === 'left' ? '←' : '→' }}
            </td>
            <td class="py-1 px-2 text-right font-mono">{{ formatNumber(step.x) }}</td>
            <td class="py-1 px-2 text-right font-mono font-semibold">
              {{ formatNumber(step.fx) }}
            </td>
            <td class="py-1 px-2 text-right font-mono text-text-muted">
              {{ step.distance.toExponential(1) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Explanation -->
    <p class="text-xs text-text-muted mt-3">
      <span class="mr-1" aria-hidden="true">ℹ</span>
      As x gets closer to a (distance → 0), f(x) approaches the limit value.
    </p>
  </div>
</template>
