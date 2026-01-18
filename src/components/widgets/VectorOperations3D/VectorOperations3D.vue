<script setup lang="ts">
import { computed } from 'vue'
import IsometricCanvas3D from './IsometricCanvas3D.vue'
import Vector3DInputPanel from './Vector3DInputPanel.vue'
import Operation3DSelector from './Operation3DSelector.vue'
import Result3DDisplay from './Result3DDisplay.vue'
import Vector3DPresets from './Vector3DPresets.vue'
import RightHandRuleDemo from './RightHandRuleDemo.vue'
import { useVectors3D } from '@/composables/useVectors3D'
import type { Vector3D, Vector3DOperation } from '@/types/math'

interface Props {
  /** Initial vector A */
  initialVectorA?: Vector3D
  /** Initial vector B */
  initialVectorB?: Vector3D
  /** Initial operation */
  initialOperation?: Vector3DOperation
  /** Sync state to URL */
  syncUrl?: boolean
  /** Show right-hand rule demo panel */
  showRightHandRule?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialVectorA: () => ({ x: 1, y: 0, z: 0 }),
  initialVectorB: () => ({ x: 0, y: 1, z: 0 }),
  initialOperation: 'cross',
  syncUrl: false,
  showRightHandRule: true,
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
  crossProduct,
  operationResult,
  presets,
  coordinateRange,
  setVectorA,
  setVectorB,
  setOperation,
  setScalar,
  loadPreset,
  swapVectors,
} = useVectors3D({
  initialVectorA: props.initialVectorA,
  initialVectorB: props.initialVectorB,
  initialOperation: props.initialOperation,
  syncUrl: props.syncUrl,
})

// Whether operation needs vector B
const needsVectorB = computed(() =>
  ['add', 'subtract', 'dot', 'cross', 'angle'].includes(operation.value)
)

// Show cross product info for operations that use both vectors
const showCrossInfo = computed(() =>
  needsVectorB.value && operation.value !== 'cross'
)

// Show right-hand rule for cross product
const showRightHandDemo = computed(() =>
  props.showRightHandRule && operation.value === 'cross'
)

// Handlers
function handleVectorAUpdate(v: Vector3D) {
  setVectorA(v)
}

function handleVectorBUpdate(v: Vector3D) {
  setVectorB(v)
}

function handleOperationSelect(op: Vector3DOperation) {
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
  <div class="vector-operations-3d" data-testid="vector-operations-3d">
    <!-- Vector Inputs -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
      <Vector3DInputPanel
        label="A"
        :vector="vectorA"
        color="emerald"
        :min="coordinateRange.min"
        :max="coordinateRange.max"
        @update:vector="handleVectorAUpdate"
      />

      <div v-if="needsVectorB">
        <Vector3DInputPanel
          label="B"
          :vector="vectorB"
          color="violet"
          :min="coordinateRange.min"
          :max="coordinateRange.max"
          @update:vector="handleVectorBUpdate"
        />
      </div>

      <!-- Scalar input for scalar multiplication -->
      <div v-if="operation === 'scalar'" class="flex flex-col justify-end">
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
          data-testid="scalar-multiplier"
          @input="handleScalarChange"
        />
      </div>
    </div>

    <!-- Presets and Swap -->
    <div v-if="needsVectorB" class="mb-6">
      <Vector3DPresets
        :presets="presets"
        @select="handlePresetSelect"
        @swap="swapVectors"
      />
    </div>

    <!-- Operation Selector -->
    <div class="mb-6">
      <Operation3DSelector
        :selected-operation="operation"
        @select="handleOperationSelect"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left: 3D Canvas -->
      <div class="card p-4">
        <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          3D Visualization
        </h3>
        <div class="flex justify-center">
          <IsometricCanvas3D
            :vector-a="vectorA"
            :vector-b="needsVectorB ? vectorB : undefined"
            :result-vector="operationResult.resultVector"
            :operation="operation"
            :show-drop-lines="true"
          />
        </div>
        <p class="mt-2 text-xs text-text-muted text-center">
          Isometric projection &bull;
          <span class="text-red-500">X</span> /
          <span class="text-green-500">Y</span> /
          <span class="text-blue-500">Z</span>
        </p>
      </div>

      <!-- Right: Result -->
      <div class="card p-4">
        <Result3DDisplay
          :result="operationResult"
          :magnitude-a="magnitudeA"
          :magnitude-b="magnitudeB"
          :angle="angle"
          :are-parallel="areParallel"
          :are-perpendicular="arePerpendicular"
          :show-vector-b="needsVectorB"
          :cross-product="crossProduct"
          :show-cross-product-info="showCrossInfo"
        />
      </div>
    </div>

    <!-- Right-Hand Rule Demo (for cross product) -->
    <div v-if="showRightHandDemo" class="mt-6 card p-4">
      <RightHandRuleDemo
        :vector-a="vectorA"
        :vector-b="vectorB"
        :show-animation="true"
      />
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
