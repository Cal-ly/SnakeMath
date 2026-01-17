<script setup lang="ts">
import { computed } from 'vue'
import VectorInputPanel from './VectorInputPanel.vue'
import VectorCanvas from './VectorCanvas.vue'
import OperationSelector from './OperationSelector.vue'
import ResultDisplay from './ResultDisplay.vue'
import VectorPresets from './VectorPresets.vue'
import { useVectors } from '@/composables/useVectors'
import type { Vector2D, VectorOperation } from '@/types/math'

interface Props {
  /** Initial vector A */
  initialVectorA?: Vector2D
  /** Initial vector B */
  initialVectorB?: Vector2D
  /** Initial operation */
  initialOperation?: VectorOperation
  /** Sync state to URL */
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialVectorA: () => ({ x: 3, y: 2 }),
  initialVectorB: () => ({ x: 1, y: 4 }),
  initialOperation: 'add',
  syncUrl: false,
})

const {
  vectorA,
  vectorB,
  operation,
  scalar,
  magnitudeA,
  magnitudeB,
  areParallel,
  arePerpendicular,
  angle,
  operationResult,
  presets,
  coordinateRange,
  setVectorA,
  setVectorB,
  setOperation,
  setScalar,
  loadPreset,
  swapVectors,
} = useVectors({
  initialVectorA: props.initialVectorA,
  initialVectorB: props.initialVectorB,
  initialOperation: props.initialOperation,
  syncUrl: props.syncUrl,
})

// Whether operation needs vector B
const needsVectorB = computed(() =>
  ['add', 'subtract', 'dot', 'angle'].includes(operation.value)
)

// Handlers
function handleVectorAUpdate(v: Vector2D) {
  setVectorA(v)
}

function handleVectorBUpdate(v: Vector2D) {
  setVectorB(v)
}

function handleOperationSelect(op: VectorOperation) {
  setOperation(op)
}

function handlePresetSelect(presetId: string) {
  loadPreset(presetId)
}

function handleScalarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value)) {
    setScalar(value)
  }
}
</script>

<template>
  <div class="vector-operations" data-testid="vector-operations">
    <!-- Vector Inputs -->
    <div class="grid gap-4 sm:grid-cols-2 mb-6">
      <VectorInputPanel
        label="A"
        :vector="vectorA"
        color="emerald"
        :min="coordinateRange.min"
        :max="coordinateRange.max"
        @update:vector="handleVectorAUpdate"
      />

      <div v-if="needsVectorB">
        <VectorInputPanel
          label="B"
          :vector="vectorB"
          color="blue"
          :min="coordinateRange.min"
          :max="coordinateRange.max"
          @update:vector="handleVectorBUpdate"
        />
      </div>

      <!-- Scalar input for scalar multiplication -->
      <div v-if="operation === 'scalar'" class="sm:col-span-2">
        <label class="block text-sm font-medium text-text-secondary mb-1">
          Scalar (k)
        </label>
        <input
          type="number"
          :value="scalar"
          min="-10"
          max="10"
          step="0.5"
          class="w-24 px-3 py-2 border border-border rounded-lg bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
          data-testid="scalar-input"
          @input="handleScalarChange"
        />
      </div>
    </div>

    <!-- Presets and Swap -->
    <div class="mb-6">
      <VectorPresets
        v-if="needsVectorB"
        :presets="presets"
        @select="handlePresetSelect"
        @swap="swapVectors"
      />
    </div>

    <!-- Operation Selector -->
    <div class="mb-6">
      <OperationSelector
        :selected-operation="operation"
        @select="handleOperationSelect"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left: Canvas -->
      <div class="card p-4">
        <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          Visualization
        </h3>
        <div class="flex justify-center">
          <VectorCanvas
            :vector-a="vectorA"
            :vector-b="vectorB"
            :result-vector="operationResult.resultVector"
            :operation="operation"
          />
        </div>
      </div>

      <!-- Right: Result -->
      <div class="card p-4">
        <ResultDisplay
          :result="operationResult"
          :magnitude-a="magnitudeA"
          :magnitude-b="magnitudeB"
          :angle="angle"
          :are-parallel="areParallel"
          :are-perpendicular="arePerpendicular"
          :show-vector-b="needsVectorB"
        />
      </div>
    </div>

    <!-- Share hint -->
    <p v-if="syncUrl" class="mt-4 text-xs text-text-muted text-center">
      Share this URL to show these settings to others
    </p>
  </div>
</template>

<style scoped>
.card {
  @apply bg-surface border border-border rounded-lg;
}
</style>
