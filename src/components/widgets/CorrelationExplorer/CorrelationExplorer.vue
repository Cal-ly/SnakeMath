<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCorrelation } from '@/composables/useCorrelation'
import ScatterPlot from './ScatterPlot.vue'
import CorrelationStats from './CorrelationStats.vue'
import ResidualPlot from './ResidualPlot.vue'
import CorrelationPresets from './CorrelationPresets.vue'
import AnscombeQuartet from './AnscombeQuartet.vue'
import CausationWarning from './CausationWarning.vue'

interface Props {
  syncUrl?: boolean
  showPresets?: boolean
  showAnscombe?: boolean
  showResidualPlot?: boolean
  showCausationWarning?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: true,
  showPresets: true,
  showAnscombe: true,
  showResidualPlot: true,
  showCausationWarning: true,
})

// Use the correlation composable
const {
  // State
  points,
  showRegressionLine,
  showResiduals,
  showConfidenceIntervals,
  selectedPreset,
  selectedAnscombeId,
  activeTab,
  isDragging,
  draggedPointIndex,

  // Computed
  n,
  hasEnoughPoints,
  correlation,
  formattedCorrelation,
  correlationInterpretation,
  rSquared,
  formattedRSquared,
  regression,
  regressionEquation,
  standardError,
  confidenceIntervals,
  residualPoints,
  outlierIndices,
  dataRange,

  // Static data
  correlationPresets,
  anscombesQuartet,

  // Methods
  addPoint,
  removePoint,
  startDrag,
  drag,
  endDrag,
  clearPoints,
  loadPreset,
  loadAnscombeDataset,
  generateRandomPoints,
  toggleRegressionLine,
  toggleResiduals,
  toggleConfidenceIntervals,
  setActiveTab,
} = useCorrelation({ syncUrl: props.syncUrl })

// Local state
const causationWarningExpanded = ref(false)

// Tab configuration
const tabs = computed(() => {
  const tabList = [{ id: 'explorer', label: 'Explorer', icon: 'fa-chart-line' }]
  if (props.showAnscombe) {
    tabList.push({ id: 'anscombe', label: "Anscombe's Quartet", icon: 'fa-table-cells' })
  }
  if (props.showPresets) {
    tabList.push({ id: 'presets', label: 'Presets', icon: 'fa-bookmark' })
  }
  return tabList
})

// Event handlers
function handleCanvasClick(x: number, y: number) {
  addPoint(x, y)
}

function handlePointClick(index: number) {
  // Right-click or with modifier removes point
  removePoint(index)
}

function handlePointDragStart(index: number) {
  startDrag(index)
}

function handlePointDrag(x: number, y: number) {
  drag(x, y)
}

function handlePointDragEnd() {
  endDrag()
}

function handlePresetSelect(presetId: string) {
  loadPreset(presetId)
}

function handleAnscombeSelect(datasetId: string) {
  loadAnscombeDataset(datasetId)
}

function handleGenerateRandom() {
  generateRandomPoints(15, Math.random() * 2 - 1) // Random correlation between -1 and 1
}
</script>

<template>
  <div class="correlation-explorer" data-testid="correlation-explorer">
    <!-- Tabs -->
    <div class="flex border-b border-border mb-4 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
          activeTab === tab.id
            ? 'text-accent-primary border-b-2 border-accent-primary'
            : 'text-text-secondary hover:text-text-primary',
        ]"
        :data-testid="`tab-${tab.id}`"
        @click="setActiveTab(tab.id as 'explorer' | 'anscombe' | 'presets')"
      >
        <i :class="`fa-solid ${tab.icon} mr-2`" aria-hidden="true" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Explorer Tab -->
    <div v-if="activeTab === 'explorer'" class="explorer-tab">
      <!-- Controls -->
      <div class="flex flex-wrap gap-3 mb-4">
        <button
          class="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          data-testid="btn-generate-random"
          @click="handleGenerateRandom"
        >
          <i class="fa-solid fa-dice mr-1" aria-hidden="true" />
          Random Data
        </button>

        <button
          class="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-bg-secondary transition-colors"
          data-testid="btn-clear"
          @click="clearPoints"
        >
          <i class="fa-solid fa-trash mr-1" aria-hidden="true" />
          Clear
        </button>

        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            :checked="showRegressionLine"
            class="rounded"
            data-testid="toggle-regression"
            @change="toggleRegressionLine"
          />
          Show Regression Line
        </label>

        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            :checked="showResiduals"
            class="rounded"
            data-testid="toggle-residuals"
            @change="toggleResiduals"
          />
          Show Residuals
        </label>

        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            :checked="showConfidenceIntervals"
            class="rounded"
            data-testid="toggle-ci"
            @change="toggleConfidenceIntervals"
          />
          Show CI
        </label>
      </div>

      <!-- Main Content Grid -->
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Scatter Plot -->
        <div class="scatter-plot-container">
          <ScatterPlot
            :points="points"
            :slope="regression?.slope ?? 0"
            :intercept="regression?.intercept ?? 0"
            :show-regression-line="showRegressionLine && hasEnoughPoints"
            :show-residuals="showResiduals && hasEnoughPoints"
            :outlier-indices="outlierIndices"
            :x-min="dataRange.xMin"
            :x-max="dataRange.xMax"
            :y-min="dataRange.yMin"
            :y-max="dataRange.yMax"
            :is-dragging="isDragging"
            :dragged-point-index="draggedPointIndex"
            @canvas-click="handleCanvasClick"
            @point-click="handlePointClick"
            @point-drag-start="handlePointDragStart"
            @point-drag="handlePointDrag"
            @point-drag-end="handlePointDragEnd"
          />

          <p class="text-xs text-text-muted mt-2">
            Click to add points. Drag points to move them. Click a point to remove it.
          </p>
        </div>

        <!-- Statistics -->
        <div class="stats-container">
          <CorrelationStats
            :n="n"
            :correlation="correlation"
            :formatted-correlation="formattedCorrelation"
            :correlation-interpretation="correlationInterpretation"
            :r-squared="rSquared"
            :formatted-r-squared="formattedRSquared"
            :regression="regression"
            :regression-equation="regressionEquation"
            :standard-error="standardError"
            :confidence-intervals="confidenceIntervals"
            :show-confidence-intervals="showConfidenceIntervals"
          />
        </div>
      </div>

      <!-- Residual Plot -->
      <div v-if="showResidualPlot && showResiduals && hasEnoughPoints" class="mt-6">
        <ResidualPlot :residual-points="residualPoints" />
      </div>

      <!-- Causation Warning -->
      <div v-if="showCausationWarning" class="mt-6">
        <CausationWarning
          :expanded="causationWarningExpanded"
          @expand="causationWarningExpanded = true"
        />
      </div>
    </div>

    <!-- Anscombe's Quartet Tab -->
    <div v-if="activeTab === 'anscombe'" class="anscombe-tab">
      <AnscombeQuartet
        :datasets="anscombesQuartet"
        :selected-dataset-id="selectedAnscombeId"
        @select-dataset="handleAnscombeSelect"
      />

      <!-- Show selected dataset visualization -->
      <div v-if="selectedAnscombeId && points.length > 0" class="mt-6">
        <h4 class="font-medium text-text-primary mb-3">Visualization: {{ selectedAnscombeId }}</h4>
        <div class="grid gap-6 lg:grid-cols-2">
          <ScatterPlot
            :points="points"
            :slope="regression?.slope ?? 0"
            :intercept="regression?.intercept ?? 0"
            :show-regression-line="true"
            :show-residuals="false"
            :outlier-indices="outlierIndices"
            :x-min="dataRange.xMin"
            :x-max="dataRange.xMax"
            :y-min="dataRange.yMin"
            :y-max="dataRange.yMax"
            :is-dragging="isDragging"
            :dragged-point-index="draggedPointIndex"
            @canvas-click="handleCanvasClick"
            @point-click="handlePointClick"
            @point-drag-start="handlePointDragStart"
            @point-drag="handlePointDrag"
            @point-drag-end="handlePointDragEnd"
          />

          <CorrelationStats
            :n="n"
            :correlation="correlation"
            :formatted-correlation="formattedCorrelation"
            :correlation-interpretation="correlationInterpretation"
            :r-squared="rSquared"
            :formatted-r-squared="formattedRSquared"
            :regression="regression"
            :regression-equation="regressionEquation"
            :standard-error="standardError"
            :confidence-intervals="confidenceIntervals"
            :show-confidence-intervals="false"
          />
        </div>
      </div>
    </div>

    <!-- Presets Tab -->
    <div v-if="activeTab === 'presets'" class="presets-tab">
      <p class="text-text-secondary mb-4">
        Select a preset to see different correlation patterns and learn what they teach us.
      </p>

      <CorrelationPresets
        :presets="correlationPresets"
        :selected-preset-id="selectedPreset"
        @select-preset="handlePresetSelect"
      />

      <!-- Show selected preset visualization and lesson -->
      <div v-if="selectedPreset && points.length > 0" class="mt-6">
        <div
          v-if="correlationPresets.find((p) => p.id === selectedPreset)?.lesson"
          class="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-lg"
        >
          <p class="text-sm text-text-secondary">
            <strong class="text-primary">Lesson:</strong>
            {{ correlationPresets.find((p) => p.id === selectedPreset)?.lesson }}
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <ScatterPlot
            :points="points"
            :slope="regression?.slope ?? 0"
            :intercept="regression?.intercept ?? 0"
            :show-regression-line="true"
            :show-residuals="showResiduals"
            :outlier-indices="outlierIndices"
            :x-min="dataRange.xMin"
            :x-max="dataRange.xMax"
            :y-min="dataRange.yMin"
            :y-max="dataRange.yMax"
            :is-dragging="isDragging"
            :dragged-point-index="draggedPointIndex"
            @canvas-click="handleCanvasClick"
            @point-click="handlePointClick"
            @point-drag-start="handlePointDragStart"
            @point-drag="handlePointDrag"
            @point-drag-end="handlePointDragEnd"
          />

          <CorrelationStats
            :n="n"
            :correlation="correlation"
            :formatted-correlation="formattedCorrelation"
            :correlation-interpretation="correlationInterpretation"
            :r-squared="rSquared"
            :formatted-r-squared="formattedRSquared"
            :regression="regression"
            :regression-equation="regressionEquation"
            :standard-error="standardError"
            :confidence-intervals="confidenceIntervals"
            :show-confidence-intervals="showConfidenceIntervals"
          />
        </div>
      </div>
    </div>
  </div>
</template>
