<script setup lang="ts">
import { onMounted } from 'vue'
import { CoordinateSystem, PlotCurve, PlotPoint, PlotLine } from '@/components/visualizations'
import CoefficientControls from './CoefficientControls.vue'
import EquationDisplay from './EquationDisplay.vue'
import AnalysisPanel from './AnalysisPanel.vue'
import PresetSelector from './PresetSelector.vue'
import { useQuadraticExplorer } from './useQuadraticExplorer'
import { formatNumber } from '@/utils/math/quadratic'
import type { QuadraticPresetId } from './types'

interface Props {
  /** Initial preset to load */
  initialPreset?: QuadraticPresetId
  /** Sync state to URL */
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialPreset: 'standard',
  syncUrl: false,
})

const {
  a,
  b,
  c,
  currentPreset,
  loadPreset,
  initializeState,
  coefficients,
  vertex,
  discriminant,
  roots,
  vertexForm,
  factoredForm,
  quadraticFn,
  bounds,
  yIntercept,
  axisOfSymmetry,
  isValidQuadratic,
  preset,
} = useQuadraticExplorer({
  syncUrl: props.syncUrl,
  initialPreset: props.initialPreset,
})

onMounted(() => {
  initializeState()
})

function handlePresetChange(presetId: QuadraticPresetId) {
  loadPreset(presetId)
}

// Padding for the SVG coordinate system
const svgPadding = 30
</script>

<template>
  <div class="quadratic-explorer" data-testid="quadratic-explorer">
    <!-- Preset Selector -->
    <div class="mb-4">
      <PresetSelector :model-value="currentPreset" @update:model-value="handlePresetChange" />
    </div>

    <!-- Preset Explanation (for real-world presets) -->
    <div
      v-if="preset?.explanation"
      class="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-text-primary"
    >
      <i class="fa-solid fa-lightbulb text-primary mr-2" aria-hidden="true" />
      {{ preset.explanation }}
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left Column: Graph -->
      <div class="card p-4" data-testid="quadratic-graph">
        <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
          Graph
        </h3>

        <div class="flex justify-center">
          <CoordinateSystem
            :x-min="bounds.xMin"
            :x-max="bounds.xMax"
            :y-min="bounds.yMin"
            :y-max="bounds.yMax"
            :width="360"
            :height="360"
            :grid-step="2"
            aria-label="Quadratic function graph showing parabola"
          >
            <template #default="{ toSvgX, toSvgY }">
              <!-- Axis of Symmetry (dashed line) -->
              <PlotLine
                v-if="isValidQuadratic"
                type="vertical"
                :value="axisOfSymmetry"
                :to-svg-x="toSvgX"
                :to-svg-y="toSvgY"
                :svg-x-min="svgPadding"
                :svg-x-max="360 - svgPadding"
                :svg-y-min="svgPadding"
                :svg-y-max="360 - svgPadding"
                :dashed="true"
                stroke-color="var(--color-text-muted)"
                :stroke-width="1"
              />

              <!-- Parabola Curve -->
              <PlotCurve
                v-if="isValidQuadratic"
                :fn="quadraticFn"
                :x-min="bounds.xMin"
                :x-max="bounds.xMax"
                :to-svg-x="toSvgX"
                :to-svg-y="toSvgY"
                :samples="150"
                stroke-color="var(--color-primary)"
                :stroke-width="2.5"
              />

              <!-- Vertex Point -->
              <PlotPoint
                v-if="isValidQuadratic"
                :x="vertex.x"
                :y="vertex.y"
                :to-svg-x="toSvgX"
                :to-svg-y="toSvgY"
                color="var(--color-primary)"
                :size="6"
                :label="`(${formatNumber(vertex.x)}, ${formatNumber(vertex.y)})`"
              />

              <!-- Root Points -->
              <template v-if="roots.type !== 'two-complex'">
                <PlotPoint
                  v-for="(root, index) in roots.roots"
                  :key="`root-${index}`"
                  :x="root"
                  :y="0"
                  :to-svg-x="toSvgX"
                  :to-svg-y="toSvgY"
                  color="var(--color-accent, #f59e0b)"
                  :size="5"
                  :filled="true"
                />
              </template>

              <!-- Y-Intercept -->
              <PlotPoint
                :x="0"
                :y="yIntercept.y"
                :to-svg-x="toSvgX"
                :to-svg-y="toSvgY"
                color="var(--color-secondary, #8b5cf6)"
                :size="5"
                :filled="true"
              />
            </template>
          </CoordinateSystem>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap gap-4 justify-center mt-3 text-xs text-text-muted">
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-primary" />
            Vertex
          </div>
          <div v-if="roots.type !== 'two-complex'" class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full" style="background-color: #f59e0b" />
            Roots
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full" style="background-color: #8b5cf6" />
            Y-intercept
          </div>
        </div>
      </div>

      <!-- Right Column: Equations and Analysis -->
      <div class="space-y-4">
        <!-- Equation Display -->
        <div class="card p-4">
          <EquationDisplay
            :coefficients="coefficients"
            :vertex-form="vertexForm"
            :factored-form="factoredForm"
          />
        </div>

        <!-- Analysis Panel -->
        <div class="card p-4">
          <AnalysisPanel
            :discriminant="discriminant"
            :roots="roots"
            :vertex="vertex"
            :axis-of-symmetry="axisOfSymmetry"
            :is-valid-quadratic="isValidQuadratic"
          />
        </div>
      </div>
    </div>

    <!-- Coefficient Controls -->
    <div class="mt-6 card p-4">
      <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
        <i class="fa-solid fa-sliders mr-2" aria-hidden="true" />
        Adjust Coefficients
      </h3>
      <CoefficientControls
        :a="a"
        :b="b"
        :c="c"
        @update:a="(val) => (a = val)"
        @update:b="(val) => (b = val)"
        @update:c="(val) => (c = val)"
      />
    </div>

    <!-- Share Link hint -->
    <p v-if="syncUrl" class="mt-4 text-xs text-text-muted text-center">
      <i class="fa-solid fa-link mr-1" aria-hidden="true" />
      Share this URL to show these settings to others
    </p>
  </div>
</template>

<style scoped>
.card {
  @apply bg-surface border border-border rounded-lg;
}
</style>
