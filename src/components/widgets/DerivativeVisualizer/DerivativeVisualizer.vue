<script setup lang="ts">
/**
 * DerivativeVisualizer - Interactive visualization of derivatives
 *
 * Features:
 * - Preset function selection
 * - Function and derivative curve rendering
 * - Point of tangency selection with tangent line
 * - Secant line with h-value control
 * - Secant-to-tangent convergence animation
 * - URL state synchronization
 *
 * D-112: Focus on geometric interpretation (tangent slopes)
 * D-113: Preset functions consistent with LimitsExplorer
 * D-114: Secant-to-tangent animation
 */

import { ref, computed } from 'vue'
import { useDerivative } from '@/composables/useDerivative'
import { DERIVATIVE_PRESETS } from '@/utils/math/derivative'
import FunctionSelector from './FunctionSelector.vue'
import DerivativeCanvas from './DerivativeCanvas.vue'
import DerivativeDisplay from './DerivativeDisplay.vue'
import SecantControls from './SecantControls.vue'
import SecantAnimation from './SecantAnimation.vue'

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
  initialPreset: 'quadratic',
})

// ============================================================================
// State
// ============================================================================

const {
  selectedPresetId,
  pointX,
  hValue,
  showSecantLines,
  showDerivativeCurve,
  viewDomain,
  selectedPreset,
  derivativeResult,
  tangentLine,
  secantLine,
  secantSequence,
  functionPoints,
  derivativePoints,
  selectPreset,
  setPointX,
  setHValue,
  setShowSecantLines,
  setShowDerivativeCurve,
  selectInterestingPoint,
} = useDerivative({
  syncUrl: props.syncUrl,
  initialPreset: props.initialPreset,
})

/** Whether to show animation panel */
const showAnimation = ref(false)

// ============================================================================
// Computed
// ============================================================================

const presetDescription = computed(() => {
  return selectedPreset.value?.description ?? ''
})

const interestingPointsList = computed(() => {
  return selectedPreset.value?.interestingPoints ?? []
})
</script>

<template>
  <div class="derivative-visualizer space-y-4" data-testid="derivative-visualizer">
    <!-- Function Selection -->
    <FunctionSelector
      :presets="DERIVATIVE_PRESETS"
      :selected-id="selectedPresetId"
      :selected-preset="selectedPreset"
      @select="selectPreset"
    />

    <!-- Description -->
    <div v-if="presetDescription" class="p-3 bg-surface-alt rounded-lg border border-border">
      <p class="text-sm text-text-secondary">
        {{ presetDescription }}
      </p>
    </div>

    <!-- Toggle buttons -->
    <div class="flex flex-wrap gap-2">
      <button
        class="px-3 py-1.5 text-sm rounded-lg transition-colors"
        :class="
          showSecantLines
            ? 'bg-amber-500 text-white'
            : 'bg-surface-alt hover:bg-surface border border-border'
        "
        @click="setShowSecantLines(!showSecantLines)"
      >
        <span class="mr-1" aria-hidden="true">{{ showSecantLines ? '✓' : '' }}</span>
        Secant Line
      </button>

      <button
        class="px-3 py-1.5 text-sm rounded-lg transition-colors"
        :class="
          showDerivativeCurve
            ? 'bg-purple-500 text-white'
            : 'bg-surface-alt hover:bg-surface border border-border'
        "
        @click="setShowDerivativeCurve(!showDerivativeCurve)"
      >
        <span class="mr-1" aria-hidden="true">{{ showDerivativeCurve ? '✓' : '' }}</span>
        f'(x) Curve
      </button>

      <button
        class="px-3 py-1.5 text-sm rounded-lg transition-colors"
        :class="
          showAnimation
            ? 'bg-primary text-white'
            : 'bg-surface-alt hover:bg-surface border border-border'
        "
        @click="showAnimation = !showAnimation"
      >
        <span class="mr-1" aria-hidden="true">{{ showAnimation ? '▼' : '▶' }}</span>
        Animation
      </button>
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-4 lg:grid-cols-2">
      <!-- Canvas -->
      <div class="lg:col-span-1">
        <DerivativeCanvas
          :function-points="functionPoints"
          :derivative-points="derivativePoints"
          :point-x="pointX"
          :view-domain="viewDomain"
          :tangent-line="tangentLine"
          :secant-line="secantLine"
          :show-secant="showSecantLines"
          :show-derivative-curve="showDerivativeCurve"
          :preset="selectedPreset"
          @update:point-x="setPointX"
        />
      </div>

      <!-- Controls and Display -->
      <div class="lg:col-span-1 space-y-4">
        <!-- Point of Tangency Controls -->
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="text-sm font-semibold text-primary mb-3">
            <span class="mr-2" aria-hidden="true">●</span>
            Point of Tangency
          </h4>

          <!-- Interesting Points Quick Select -->
          <div v-if="interestingPointsList.length > 0" class="flex flex-wrap gap-2 mb-3">
            <button
              v-for="(point, index) in interestingPointsList"
              :key="index"
              class="px-3 py-1 text-sm rounded-md transition-colors"
              :class="
                Math.abs(pointX - point.x) < 0.01
                  ? 'bg-primary text-white'
                  : 'bg-surface hover:bg-surface-alt border border-border'
              "
              :title="point.description"
              @click="selectInterestingPoint(index)"
            >
              x = {{ point.x.toFixed(point.x % 1 === 0 ? 0 : 2) }}
            </button>
          </div>

          <!-- Point X Slider -->
          <div>
            <label class="block text-xs text-text-muted mb-1">
              x = {{ pointX.toFixed(2) }}
            </label>
            <input
              type="range"
              :min="viewDomain.min + 0.1"
              :max="viewDomain.max - 0.1"
              :step="0.05"
              :value="pointX"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              aria-label="Point of tangency"
              @input="setPointX(parseFloat(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- Derivative Result Display -->
        <DerivativeDisplay
          :derivative-result="derivativeResult"
          :tangent-line="tangentLine"
          :point-x="pointX"
          :preset="selectedPreset"
        />

        <!-- Secant Controls (when showing secant) -->
        <SecantControls
          v-if="showSecantLines"
          :h-value="hValue"
          :secant-line="secantLine"
          :tangent-slope="derivativeResult?.value ?? null"
          @update:h-value="setHValue"
        />
      </div>
    </div>

    <!-- Animation Section -->
    <SecantAnimation
      v-if="showAnimation"
      :secant-sequence="secantSequence"
      :tangent-slope="derivativeResult?.value ?? null"
      :point-x="pointX"
    />
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
