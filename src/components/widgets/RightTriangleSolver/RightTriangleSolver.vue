<script setup lang="ts">
import { useRightTriangle } from '@/composables/useRightTriangle'
import TriangleDiagram from './TriangleDiagram.vue'
import ValueInputs from './ValueInputs.vue'
import SolutionDisplay from './SolutionDisplay.vue'

interface Props {
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: false,
})

const {
  inputA,
  inputB,
  inputC,
  inputAngleA,
  inputAngleB,
  enabledA,
  enabledB,
  enabledC,
  enabledAngleA,
  enabledAngleB,
  solvedTriangle,
  steps,
  isValid,
  errorMessage,
  area,
  perimeter,
  specialTriangleInfo,
  reset,
  setPreset,
} = useRightTriangle({ syncUrl: props.syncUrl })

// Example presets
const presets = [
  { name: '3-4-5', values: { a: 3, b: 4 } },
  { name: '5-12-13', values: { a: 5, b: 12 } },
  { name: '30-60-90', values: { A: 30, c: 10 } },
  { name: '45-45-90', values: { A: 45, c: 10 } },
]
</script>

<template>
  <div class="right-triangle-solver" data-testid="right-triangle-solver">
    <!-- Preset Buttons -->
    <div class="mb-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm text-text-muted">Examples:</span>
        <button
          v-for="preset in presets"
          :key="preset.name"
          class="px-3 py-1 text-sm bg-surface border border-border rounded hover:border-primary hover:text-primary transition-colors"
          @click="setPreset(preset.values)"
        >
          {{ preset.name }}
        </button>
        <button
          class="px-3 py-1 text-sm bg-surface border border-border rounded hover:border-red-500 hover:text-red-500 transition-colors ml-auto"
          @click="reset"
        >
          <i class="fa-solid fa-rotate-left mr-1" aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left Column: Diagram and Inputs -->
      <div class="space-y-6">
        <!-- Triangle Diagram -->
        <div class="card p-4">
          <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            <i class="fa-solid fa-draw-polygon mr-2" aria-hidden="true" />
            Triangle Diagram
          </h3>
          <div class="flex justify-center">
            <TriangleDiagram
              :triangle="solvedTriangle"
              :is-valid="isValid"
              :enabled-a="enabledA"
              :enabled-b="enabledB"
              :enabled-c="enabledC"
              :enabled-angle-a="enabledAngleA"
              :enabled-angle-b="enabledAngleB"
            />
          </div>
        </div>

        <!-- Value Inputs -->
        <div class="card p-4">
          <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            <i class="fa-solid fa-keyboard mr-2" aria-hidden="true" />
            Known Values
          </h3>
          <ValueInputs
            v-model:input-a="inputA"
            v-model:input-b="inputB"
            v-model:input-c="inputC"
            v-model:input-angle-a="inputAngleA"
            v-model:input-angle-b="inputAngleB"
            v-model:enabled-a="enabledA"
            v-model:enabled-b="enabledB"
            v-model:enabled-c="enabledC"
            v-model:enabled-angle-a="enabledAngleA"
            v-model:enabled-angle-b="enabledAngleB"
          />
        </div>
      </div>

      <!-- Right Column: Solution -->
      <div class="card p-4">
        <SolutionDisplay
          :triangle="solvedTriangle"
          :steps="steps"
          :is-valid="isValid"
          :error-message="errorMessage"
          :area="area"
          :perimeter="perimeter"
          :special-triangle="specialTriangleInfo"
        />
      </div>
    </div>

    <!-- Share link hint -->
    <p v-if="syncUrl" class="mt-4 text-xs text-text-muted text-center">
      <i class="fa-solid fa-link mr-1" aria-hidden="true" />
      Share this URL to show these values to others
    </p>
  </div>
</template>

<style scoped>
.card {
  @apply bg-surface border border-border rounded-lg;
}
</style>
