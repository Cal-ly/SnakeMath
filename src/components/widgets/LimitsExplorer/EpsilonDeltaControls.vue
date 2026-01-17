<script setup lang="ts">
/**
 * EpsilonDeltaControls - Sliders for ε and δ parameters
 *
 * Allows users to interactively explore the ε-δ definition:
 * "For every ε > 0, there exists δ > 0 such that
 *  if 0 < |x - a| < δ then |f(x) - L| < ε"
 */

import { computed } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  epsilon: number
  delta: number
  limitValue: number | null
  approachPoint: number
  /** Whether a valid delta exists for current epsilon */
  deltaValid: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:epsilon': [value: number]
  'update:delta': [value: number]
  findDelta: []
}>()

// ============================================================================
// Constants
// ============================================================================

const MIN_VALUE = 0.01
const MAX_VALUE = 2
const STEP = 0.01

// ============================================================================
// Computed
// ============================================================================

/**
 * ε-δ condition display
 */
const epsilonCondition = computed(() => {
  if (props.limitValue === null || !isFinite(props.limitValue)) {
    return '|f(x) - L| < ε'
  }
  const L = props.limitValue.toFixed(2)
  const eps = props.epsilon.toFixed(2)
  return `|f(x) - ${L}| < ${eps}`
})

const deltaCondition = computed(() => {
  const a = props.approachPoint.toFixed(2)
  const del = props.delta.toFixed(2)
  return `0 < |x - ${a}| < ${del}`
})

// ============================================================================
// Methods
// ============================================================================

function handleEpsilonChange(event: Event): void {
  const value = parseFloat((event.target as HTMLInputElement).value)
  emit('update:epsilon', value)
}

function handleDeltaChange(event: Event): void {
  const value = parseFloat((event.target as HTMLInputElement).value)
  emit('update:delta', value)
}

function handleFindDelta(): void {
  emit('findDelta')
}
</script>

<template>
  <div class="epsilon-delta-controls p-4 bg-surface-alt rounded-lg border border-border">
    <h4 class="text-sm font-semibold text-primary mb-3">
      <span class="mr-2" aria-hidden="true">⚙</span>
      ε-δ Definition
    </h4>

    <!-- Formal Definition -->
    <div class="mb-4 p-3 bg-surface rounded-lg border border-border text-sm">
      <p class="text-text-secondary mb-2">
        For every <span class="text-blue-600 font-semibold">ε > 0</span>, there exists
        <span class="text-amber-600 font-semibold">δ > 0</span> such that:
      </p>
      <div class="text-center">
        <MathBlock
          :formula="`\\text{if } 0 < |x - a| < \\delta \\text{ then } |f(x) - L| < \\varepsilon`"
        />
      </div>
    </div>

    <!-- Epsilon Slider -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1">
        <label for="epsilon-slider" class="text-sm font-medium text-blue-600">
          ε (epsilon) = {{ epsilon.toFixed(2) }}
        </label>
        <span class="text-xs text-text-muted">
          {{ epsilonCondition }}
        </span>
      </div>
      <input
        id="epsilon-slider"
        type="range"
        :min="MIN_VALUE"
        :max="MAX_VALUE"
        :step="STEP"
        :value="epsilon"
        aria-describedby="epsilon-description"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer epsilon-slider"
        @input="handleEpsilonChange"
      />
      <p id="epsilon-description" class="text-xs text-text-muted mt-1">
        How close f(x) must be to L (the limit value)
      </p>
    </div>

    <!-- Delta Slider -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1">
        <label for="delta-slider" class="text-sm font-medium text-amber-600">
          δ (delta) = {{ delta.toFixed(2) }}
        </label>
        <span class="text-xs text-text-muted">
          {{ deltaCondition }}
        </span>
      </div>
      <input
        id="delta-slider"
        type="range"
        :min="MIN_VALUE"
        :max="MAX_VALUE"
        :step="STEP"
        :value="delta"
        aria-describedby="delta-description"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer delta-slider"
        @input="handleDeltaChange"
      />
      <p id="delta-description" class="text-xs text-text-muted mt-1">
        How close x must be to a (the approach point)
      </p>
    </div>

    <!-- Find Delta Button -->
    <div class="flex items-center gap-2">
      <button
        class="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="limitValue === null || !isFinite(limitValue)"
        @click="handleFindDelta"
      >
        <span class="mr-2" aria-hidden="true">🔍</span>
        Find δ for this ε
      </button>
    </div>

    <!-- Delta Validity Indicator -->
    <div
      class="mt-3 p-2 rounded-lg text-sm"
      :class="
        deltaValid
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      "
    >
      <span class="mr-2" aria-hidden="true">{{ deltaValid ? '✓' : '✗' }}</span>
      <span v-if="deltaValid">
        This δ works: all points within δ of a have f(x) within ε of L
      </span>
      <span v-else>
        This δ is too large: some points within δ have f(x) outside ε band
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Epsilon slider (blue) */
.epsilon-slider {
  background: linear-gradient(to right, #dbeafe, #3b82f6);
}

.epsilon-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.epsilon-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Delta slider (amber) */
.delta-slider {
  background: linear-gradient(to right, #fef3c7, #f59e0b);
}

.delta-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #d97706;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.delta-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #d97706;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
