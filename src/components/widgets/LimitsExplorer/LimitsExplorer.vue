<script setup lang="ts">
/**
 * LimitsExplorer - Interactive visualization of mathematical limits
 *
 * Features:
 * - Preset function selection
 * - Function curve rendering
 * - Approach point selection
 * - ε-δ band visualization with interactive controls
 * - Numerical approach animation
 * - URL state synchronization
 */

import { computed, ref } from 'vue'
import { useLimits } from '@/composables/useLimits'
import { findDeltaForEpsilon } from '@/utils/math/limits'
import FunctionSelector from './FunctionSelector.vue'
import LimitCanvas from './LimitCanvas.vue'
import LimitDisplay from './LimitDisplay.vue'
import EpsilonDeltaControls from './EpsilonDeltaControls.vue'
import ApproachAnimation from './ApproachAnimation.vue'

// ============================================================================
// Props
// ============================================================================

interface Props {
  /** Whether to sync state to URL */
  syncUrl?: boolean
  /** Initial preset function ID */
  initialPreset?: string
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: false,
  initialPreset: 'polynomial',
})

// ============================================================================
// State
// ============================================================================

const {
  selectedPresetId,
  approachPoint,
  approachDirection,
  epsilon,
  delta,
  viewDomain,
  selectedPreset,
  limitResult,
  continuityResult,
  functionPoints,
  selectPreset,
  setApproachPoint,
  setApproachDirection,
  setEpsilon,
  setDelta,
  selectInterestingPoint,
} = useLimits({
  syncUrl: props.syncUrl,
  initialPreset: props.initialPreset,
})

/** Whether to show advanced ε-δ controls */
const showAdvanced = ref(false)

// ============================================================================
// Computed
// ============================================================================

const presetDescription = computed(() => {
  return selectedPreset.value?.description ?? ''
})

const expectedBehavior = computed(() => {
  return selectedPreset.value?.expectedBehavior ?? ''
})

/**
 * Check if the current delta satisfies the epsilon condition
 * Tests whether all points within delta of approach point have f(x) within epsilon of L
 */
const deltaValid = computed(() => {
  if (!selectedPreset.value || !limitResult.value) return false
  if (limitResult.value.value === null || !isFinite(limitResult.value.value)) return false

  const fn = selectedPreset.value.fn
  const a = approachPoint.value
  const L = limitResult.value.value
  const eps = epsilon.value
  const del = delta.value

  // Test multiple points within the delta neighborhood
  const testPoints = 20
  for (let i = 1; i <= testPoints; i++) {
    // Test from both sides
    const fraction = i / testPoints
    const leftX = a - del * fraction
    const rightX = a + del * fraction

    const leftY = fn(leftX)
    const rightY = fn(rightX)

    // Check if f(x) is within epsilon of L
    if (isFinite(leftY) && Math.abs(leftY - L) >= eps) return false
    if (isFinite(rightY) && Math.abs(rightY - L) >= eps) return false
  }

  return true
})

// ============================================================================
// Methods
// ============================================================================

/**
 * Automatically find a suitable delta for the current epsilon
 */
function handleFindDelta(): void {
  if (!selectedPreset.value || !limitResult.value) return
  if (limitResult.value.value === null || !isFinite(limitResult.value.value)) return

  const foundDelta = findDeltaForEpsilon(
    selectedPreset.value.fn,
    approachPoint.value,
    limitResult.value.value,
    epsilon.value
  )

  if (foundDelta !== null) {
    setDelta(foundDelta)
  }
}
</script>

<template>
  <div class="limits-explorer space-y-4" data-testid="limits-explorer">
    <!-- Function Selection -->
    <FunctionSelector
      :selected-id="selectedPresetId"
      :selected-preset="selectedPreset"
      @select="selectPreset"
    />

    <!-- Description -->
    <div v-if="presetDescription" class="p-3 bg-surface-alt rounded-lg border border-border">
      <p class="text-sm text-text-secondary">
        {{ presetDescription }}
      </p>
      <p class="text-xs text-text-muted mt-1 italic">
        {{ expectedBehavior }}
      </p>
    </div>

    <!-- Advanced Toggle -->
    <div class="flex justify-end">
      <button
        class="px-3 py-1.5 text-sm rounded-lg transition-colors"
        :class="
          showAdvanced
            ? 'bg-primary text-white'
            : 'bg-surface-alt hover:bg-surface border border-border'
        "
        @click="showAdvanced = !showAdvanced"
      >
        <span class="mr-1" aria-hidden="true">{{ showAdvanced ? '▼' : '▶' }}</span>
        {{ showAdvanced ? 'Hide' : 'Show' }} ε-δ Controls & Animation
      </button>
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-4 lg:grid-cols-2">
      <!-- Canvas -->
      <div class="lg:col-span-1">
        <LimitCanvas
          :function-points="functionPoints"
          :approach-point="approachPoint"
          :view-domain="viewDomain"
          :epsilon="epsilon"
          :delta="delta"
          :limit-result="limitResult"
          :preset="selectedPreset"
          :show-epsilon-delta="showAdvanced"
          :delta-valid="deltaValid"
          @update:approach-point="setApproachPoint"
        />
      </div>

      <!-- Controls and Display -->
      <div class="lg:col-span-1 space-y-4">
        <!-- Approach Point Controls -->
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="text-sm font-semibold text-primary mb-3">
            <span class="mr-2" aria-hidden="true">⊕</span>
            Approach Point
          </h4>

          <!-- Interesting Points Quick Select -->
          <div
            v-if="selectedPreset && selectedPreset.interestingPoints.length > 0"
            class="flex flex-wrap gap-2 mb-3"
          >
            <button
              v-for="(point, index) in selectedPreset.interestingPoints"
              :key="index"
              class="px-3 py-1 text-sm rounded-md transition-colors"
              :class="
                Math.abs(approachPoint - point) < 0.01
                  ? 'bg-primary text-white'
                  : 'bg-surface hover:bg-surface-alt border border-border'
              "
              @click="selectInterestingPoint(index)"
            >
              x → {{ point }}
            </button>
          </div>

          <!-- Manual Approach Point Slider -->
          <div>
            <label class="block text-xs text-text-muted mb-1">
              a = {{ approachPoint.toFixed(2) }}
            </label>
            <input
              type="range"
              :min="viewDomain.min"
              :max="viewDomain.max"
              :step="0.1"
              :value="approachPoint"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              @input="
                setApproachPoint(parseFloat(($event.target as HTMLInputElement).value))
              "
            />
          </div>

          <!-- Direction Toggle -->
          <div class="mt-3">
            <label class="block text-xs text-text-muted mb-1"> Approach Direction </label>
            <div class="flex gap-2">
              <button
                v-for="dir in (['left', 'both', 'right'] as const)"
                :key="dir"
                class="flex-1 px-2 py-1 text-xs rounded-md transition-colors"
                :class="
                  approachDirection === dir
                    ? 'bg-primary text-white'
                    : 'bg-surface hover:bg-surface-alt border border-border'
                "
                @click="setApproachDirection(dir)"
              >
                {{ dir === 'left' ? 'x → a⁻' : dir === 'right' ? 'x → a⁺' : 'Both' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Limit Result Display -->
        <LimitDisplay
          :limit-result="limitResult"
          :continuity-result="continuityResult"
          :approach-point="approachPoint"
          :approach-direction="approachDirection"
        />
      </div>
    </div>

    <!-- Advanced ε-δ Section (conditionally shown) -->
    <div v-if="showAdvanced" class="grid gap-4 lg:grid-cols-2">
      <!-- ε-δ Controls -->
      <div class="lg:col-span-1">
        <EpsilonDeltaControls
          :epsilon="epsilon"
          :delta="delta"
          :limit-value="limitResult?.value ?? null"
          :approach-point="approachPoint"
          :delta-valid="deltaValid"
          @update:epsilon="setEpsilon"
          @update:delta="setDelta"
          @find-delta="handleFindDelta"
        />
      </div>

      <!-- Numerical Approach Animation -->
      <div class="lg:col-span-1">
        <ApproachAnimation
          :fn="selectedPreset?.fn ?? null"
          :approach-point="approachPoint"
          :direction="approachDirection"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Range slider styling */
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary, #10b981);
  border-radius: 50%;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--color-primary, #10b981);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
