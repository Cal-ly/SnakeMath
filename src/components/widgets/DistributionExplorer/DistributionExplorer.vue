<script setup lang="ts">
import DistributionSelector from './DistributionSelector.vue'
import ParameterControls from './ParameterControls.vue'
import DistributionChart from './DistributionChart.vue'
import DistributionInfo from './DistributionInfo.vue'
import DistributionPresets from './DistributionPresets.vue'
import ProbabilityCalculator from './ProbabilityCalculator.vue'
import SampleHistogram from './SampleHistogram.vue'
import CLTDemonstration from './CLTDemonstration.vue'
import { useDistributionExplorer } from '@/composables/useDistributionExplorer'
import type { DistributionType } from '@/utils/math/distributions'

interface Props {
  /** Initial distribution type */
  initialType?: DistributionType
  /** Initial preset ID to load */
  initialPreset?: string
  /** Whether to sync state to URL */
  syncUrl?: boolean
  /** Show probability calculator panel */
  showProbCalc?: boolean
  /** Show sample histogram panel */
  showHistogram?: boolean
  /** Show CLT demonstration panel */
  showCLT?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialType: 'normal',
  initialPreset: undefined,
  syncUrl: false,
  showProbCalc: true,
  showHistogram: true,
  showCLT: false,
})

const {
  // State
  distributionType,
  normalParams,
  binomialParams,
  poissonParams,
  exponentialParams,
  uniformParams,
  sampleData,
  sampleCount,
  probCalcMode,
  probCalcA,
  probCalcB,

  // Computed
  isValid,
  stats,
  xRange,
  isDiscrete,
  pdfData,
  maxPdfValue,
  cdfData,
  histogramBins,
  probabilityResult,

  // Static data
  distributionPresets,

  // Methods
  setDistributionType,
  setNormalParams,
  setBinomialParams,
  setPoissonParams,
  setExponentialParams,
  setUniformParams,
  loadPreset,
  generateNewSamples,
  clearSamples,
  setProbCalcMode,
  setProbCalcBounds,
} = useDistributionExplorer({
  initialType: props.initialType,
  initialPreset: props.initialPreset,
  syncUrl: props.syncUrl,
})

function handleDistributionSelect(type: DistributionType) {
  setDistributionType(type)
}

function handlePresetSelect(presetId: string) {
  loadPreset(presetId)
}

function handleNormalUpdate(params: Record<string, number>) {
  setNormalParams(params)
}

function handleBinomialUpdate(params: Record<string, number>) {
  setBinomialParams(params)
}

function handlePoissonUpdate(params: Record<string, number>) {
  setPoissonParams(params)
}

function handleExponentialUpdate(params: Record<string, number>) {
  setExponentialParams(params)
}

function handleUniformUpdate(params: Record<string, number>) {
  setUniformParams(params)
}

function handleProbModeChange(mode: 'lessThan' | 'between') {
  setProbCalcMode(mode)
}

function handleProbBoundsChange(a: number, b: number) {
  setProbCalcBounds(a, b)
}

function handleGenerateSamples(count: number) {
  sampleCount.value = count
  generateNewSamples(count)
}

function handleClearSamples() {
  clearSamples()
}
</script>

<template>
  <div class="distribution-explorer" data-testid="distribution-explorer">
    <!-- Distribution Type Selection -->
    <div class="mb-6">
      <DistributionSelector
        :selected-type="distributionType"
        @select="handleDistributionSelect"
      />
    </div>

    <!-- Main Grid: Parameters + Chart + Info -->
    <div class="grid gap-6 lg:grid-cols-[300px,1fr]">
      <!-- Left Column: Controls -->
      <div class="space-y-6">
        <!-- Parameter Controls -->
        <div class="card p-4">
          <ParameterControls
            :distribution-type="distributionType"
            :normal-params="normalParams"
            :binomial-params="binomialParams"
            :poisson-params="poissonParams"
            :exponential-params="exponentialParams"
            :uniform-params="uniformParams"
            @update:normal-params="handleNormalUpdate"
            @update:binomial-params="handleBinomialUpdate"
            @update:poisson-params="handlePoissonUpdate"
            @update:exponential-params="handleExponentialUpdate"
            @update:uniform-params="handleUniformUpdate"
          />
        </div>

        <!-- Distribution Info -->
        <div class="card p-4">
          <DistributionInfo :stats="stats" :distribution-type="distributionType" />
        </div>
      </div>

      <!-- Right Column: Visualization -->
      <div class="space-y-6">
        <!-- PDF/PMF Chart -->
        <div class="card p-4">
          <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
            {{ isDiscrete ? 'Probability Mass Function (PMF)' : 'Probability Density Function (PDF)' }}
          </h3>

          <DistributionChart
            :pdf-data="pdfData"
            :x-range="xRange"
            :max-pdf-value="maxPdfValue"
            :is-discrete="isDiscrete"
            :mean="stats?.mean"
            :std-dev="stats?.stdDev"
            :show-cdf="false"
            :cdf-data="cdfData"
            :shaded-region="
              probabilityResult?.type === 'lessThan'
                ? { start: xRange.min, end: probabilityResult.b }
                : probabilityResult?.type === 'between'
                  ? { start: probabilityResult.a!, end: probabilityResult.b }
                  : null
            "
          />
        </div>

        <!-- Probability Calculator -->
        <div v-if="showProbCalc" class="card p-4">
          <ProbabilityCalculator
            :mode="probCalcMode"
            :a="probCalcA"
            :b="probCalcB"
            :x-range="xRange"
            :result="probabilityResult"
            :is-discrete="isDiscrete"
            @update:mode="handleProbModeChange"
            @update:bounds="handleProbBoundsChange"
          />
        </div>
      </div>
    </div>

    <!-- Sample Histogram Section -->
    <div v-if="showHistogram" class="mt-6">
      <div class="card p-4">
        <SampleHistogram
          :sample-data="sampleData"
          :histogram-bins="histogramBins"
          :sample-count="sampleCount"
          :distribution-type="distributionType"
          :x-range="xRange"
          :is-valid="isValid"
          @generate="handleGenerateSamples"
          @clear="handleClearSamples"
        />
      </div>
    </div>

    <!-- CLT Demonstration -->
    <div v-if="showCLT" class="mt-6">
      <CLTDemonstration :source-distribution="distributionType" />
    </div>

    <!-- Presets -->
    <div class="mt-6">
      <DistributionPresets :presets="distributionPresets" @select="handlePresetSelect" />
    </div>

    <!-- Share link hint -->
    <p v-if="syncUrl" class="mt-4 text-xs text-text-muted text-center">
      <i class="fa-solid fa-link mr-1" aria-hidden="true" />
      Share this URL to show these settings to others
    </p>
  </div>
</template>

<style scoped>
.distribution-explorer {
  --min-touch-target: 44px;
}
</style>
