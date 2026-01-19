<script setup lang="ts">
/**
 * IntegrationExplorer - Main widget for exploring definite integrals
 *
 * Orchestrates all subcomponents and manages state via useIntegration composable.
 *
 * D-120: Widget name IntegrationExplorer
 * D-121: Single view with collapsible panels
 * D-127: URL state sync for shareable configurations
 */

import { useIntegration } from '@/composables/useIntegration'
import FunctionSelector from './FunctionSelector.vue'
import BoundsControls from './BoundsControls.vue'
import MethodSelector from './MethodSelector.vue'
import ResultsDisplay from './ResultsDisplay.vue'
import IntegrationCanvas from './IntegrationCanvas.vue'
import ConvergenceAnimation from './ConvergenceAnimation.vue'
import CollapsiblePanel from '@/components/ui/CollapsiblePanel.vue'

// ============================================================================
// Props
// ============================================================================

interface Props {
  /** Enable URL state synchronization */
  syncUrl?: boolean
  /** Initial preset ID */
  initialPreset?: string
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: false,
  initialPreset: undefined,
})

// ============================================================================
// State
// ============================================================================

const {
  // State
  selectedPresetId,
  lowerBound,
  upperBound,
  subdivisions,
  method,
  viewDomain,
  // Computed
  selectedPreset,
  riemannResult,
  integrationResult,
  exactValue,
  functionPoints,
  isValidBounds,
  // Methods
  selectPreset,
  setLowerBound,
  setUpperBound,
  setSubdivisions,
  resetToPresetDefaults,
} = useIntegration({
  initialPreset: props.initialPreset,
  syncUrl: props.syncUrl,
})

// ============================================================================
// Handlers
// ============================================================================

function handlePresetChange(id: string) {
  selectPreset(id)
}

function handleAnimationNChange(n: number) {
  setSubdivisions(n)
}
</script>

<template>
  <div data-testid="integration-explorer" class="space-y-4 p-4 rounded-lg border border-border bg-surface">
    <!-- Header: Function selector -->
    <FunctionSelector
      :model-value="selectedPresetId"
      :preset="selectedPreset"
      @update:model-value="handlePresetChange"
    />

    <hr class="border-border" />

    <!-- Controls: Bounds and subdivisions -->
    <BoundsControls
      :lower-bound="lowerBound"
      :upper-bound="upperBound"
      :subdivisions="subdivisions"
      :is-valid-bounds="isValidBounds"
      @update:lower-bound="setLowerBound"
      @update:upper-bound="setUpperBound"
      @update:subdivisions="setSubdivisions"
    />

    <!-- Visualization -->
    <IntegrationCanvas
      :function-points="functionPoints"
      :riemann-result="riemannResult"
      :lower-bound="lowerBound"
      :upper-bound="upperBound"
      :view-domain="viewDomain"
      :method="method"
    />

    <!-- Results -->
    <ResultsDisplay
      :result="integrationResult"
      :preset="selectedPreset"
      :lower-bound="lowerBound"
      :upper-bound="upperBound"
    />

    <hr class="border-border" />

    <!-- Method selector -->
    <MethodSelector v-model="method" />

    <hr class="border-border" />

    <!-- Convergence Animation Panel (collapsible) -->
    <CollapsiblePanel
      title="Convergence Animation"
      :default-expanded="false"
    >
      <template #icon>
        <i class="fa-solid fa-play-circle text-primary" aria-hidden="true" />
      </template>
      <ConvergenceAnimation
        :current-n="subdivisions"
        :approximation="integrationResult?.approximation ?? null"
        :exact-value="exactValue"
        :relative-error="integrationResult?.relativeError ?? null"
        :is-valid="isValidBounds"
        @update:n="handleAnimationNChange"
      />
    </CollapsiblePanel>

    <!-- Reset button -->
    <div class="flex justify-end">
      <button
        type="button"
        class="px-3 py-1.5 text-sm rounded-md border border-border
               hover:border-primary hover:text-primary
               transition-colors"
        @click="resetToPresetDefaults"
      >
        <i class="fa-solid fa-rotate-left mr-1.5" aria-hidden="true" />
        Reset to Defaults
      </button>
    </div>
  </div>
</template>
