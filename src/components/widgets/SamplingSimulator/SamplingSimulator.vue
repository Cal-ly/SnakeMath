<script setup lang="ts">
import { computed } from 'vue'
import PopulationGrid from './PopulationGrid.vue'
import SamplingMethodSelector from './SamplingMethodSelector.vue'
import SampleSizeControls from './SampleSizeControls.vue'
import SamplingDistribution from './SamplingDistribution.vue'
import SamplingResults from './SamplingResults.vue'
import SamplingPresets from './SamplingPresets.vue'
import ConfidenceIntervalDemo from './ConfidenceIntervalDemo.vue'
import BootstrapPanel from './BootstrapPanel.vue'
import SampleSizeCalculator from './SampleSizeCalculator.vue'
import { useSamplingSimulator } from '@/composables/useSamplingSimulator'
import type { SamplingMethod } from '@/composables/useSamplingSimulator'
import { confidenceIntervalMean } from '@/utils/math/sampling'

interface Props {
  /** Initial sampling method */
  initialMethod?: SamplingMethod
  /** Initial preset ID to load */
  initialPreset?: string
  /** Whether to sync state to URL */
  syncUrl?: boolean
  /** Show CI demo panel */
  showCIDemo?: boolean
  /** Show bootstrap panel */
  showBootstrap?: boolean
  /** Show sample size calculator */
  showCalculator?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialMethod: 'simple',
  initialPreset: undefined,
  syncUrl: false,
  showCIDemo: true,
  showBootstrap: true,
  showCalculator: true,
})

const {
  // State
  population,
  samplingMethod,
  sampleSize,
  currentSample,
  sampleHistory,
  confidenceLevel,
  ciSimulationResults,
  bootstrapIterations,
  bootstrapResult,
  calcMarginOfError,
  calcStdDev,
  calcProportion,
  isAnimating,

  // Computed
  populationStats,
  trueMean,
  samplingDistributionBins,
  empiricalSE,
  theoreticalSE,
  ciCoverageRate,
  calculatedSampleSizeMean,
  calculatedSampleSizeProportion,

  // Static data
  samplingPresets,

  // Methods
  setSamplingMethod,
  setSampleSize,
  takeSample,
  takeMultipleSamples,
  resetSamples,
  runCISimulation,
  resetCISimulation,
  runBootstrap,
  setBootstrapIterations,
  startAnimation,
  stopAnimation,
  loadPreset,
  setCalcMarginOfError,
  setCalcStdDev,
  setCalcProportion,
  setConfidenceLevel,
} = useSamplingSimulator({
  initialMethod: props.initialMethod,
  initialPreset: props.initialPreset,
  syncUrl: props.syncUrl,
})

// Current sample CI
const currentCI = computed(() => {
  if (!currentSample.value || currentSample.value.values.length < 2) return null
  return confidenceIntervalMean(
    currentSample.value.mean,
    currentSample.value.standardDeviation,
    currentSample.value.values.length,
    confidenceLevel.value
  )
})

// Mean of sample means
const meanOfMeans = computed(() => {
  if (sampleHistory.value.length === 0) return undefined
  const sum = sampleHistory.value.reduce((acc, s) => acc + s.mean, 0)
  return sum / sampleHistory.value.length
})

// Event handlers
function handleMethodSelect(method: SamplingMethod) {
  setSamplingMethod(method)
}

function handleSampleSizeUpdate(size: number) {
  setSampleSize(size)
}

function handleTakeSample() {
  takeSample()
}

function handleTakeMultiple(count: number) {
  takeMultipleSamples(count)
}

function handleReset() {
  resetSamples()
}

function handleStartAnimation() {
  startAnimation(150)
}

function handleStopAnimation() {
  stopAnimation()
}

function handlePresetSelect(presetId: string) {
  loadPreset(presetId)
}

function handleRunCISimulation(count: number) {
  runCISimulation(count)
}

function handleResetCISimulation() {
  resetCISimulation()
}

function handleRunBootstrap() {
  runBootstrap()
}

function handleBootstrapIterationsUpdate(count: number) {
  setBootstrapIterations(count)
}
</script>

<template>
  <div class="sampling-simulator" data-testid="sampling-simulator">
    <!-- Presets -->
    <div class="mb-6">
      <SamplingPresets :presets="samplingPresets" @select="handlePresetSelect" />
    </div>

    <!-- Main Layout -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left Column: Population & Sampling Controls -->
      <div class="space-y-6">
        <!-- Population Grid -->
        <div class="card p-4">
          <PopulationGrid
            :population="population"
            :sampled-indices="currentSample?.indices ?? []"
            :stats="populationStats"
          />
        </div>

        <!-- Sampling Method -->
        <div class="card p-4">
          <SamplingMethodSelector
            :selected-method="samplingMethod"
            @select="handleMethodSelect"
          />
        </div>

        <!-- Sample Size Controls -->
        <div class="card p-4">
          <SampleSizeControls
            :sample-size="sampleSize"
            :max-size="population.length"
            :is-animating="isAnimating"
            @update:sample-size="handleSampleSizeUpdate"
            @take-sample="handleTakeSample"
            @take-multiple="handleTakeMultiple"
            @reset="handleReset"
            @start-animation="handleStartAnimation"
            @stop-animation="handleStopAnimation"
          />
        </div>
      </div>

      <!-- Right Column: Results & Distribution -->
      <div class="space-y-6">
        <!-- Current Sample Results -->
        <div class="card p-4">
          <SamplingResults
            :sample="currentSample"
            :ci="currentCI"
            :true-mean="trueMean"
            :confidence-level="confidenceLevel"
          />
        </div>

        <!-- Sampling Distribution -->
        <div class="card p-4">
          <SamplingDistribution
            :bins="samplingDistributionBins"
            :sample-count="sampleHistory.length"
            :true-mean="trueMean"
            :theoretical-s-e="theoreticalSE"
            :empirical-s-e="empiricalSE"
            :mean-of-means="meanOfMeans"
          />
        </div>
      </div>
    </div>

    <!-- CI Demo Section -->
    <div v-if="showCIDemo" class="mt-6">
      <div class="card p-4">
        <ConfidenceIntervalDemo
          :results="ciSimulationResults"
          :true-mean="trueMean"
          :confidence-level="confidenceLevel"
          :coverage-rate="ciCoverageRate"
          @run-simulation="handleRunCISimulation"
          @reset="handleResetCISimulation"
        />
      </div>
    </div>

    <!-- Bootstrap Section -->
    <div v-if="showBootstrap" class="mt-6">
      <div class="card p-4">
        <BootstrapPanel
          :result="bootstrapResult"
          :iterations="bootstrapIterations"
          :sample-values="currentSample?.values ?? []"
          :confidence-level="confidenceLevel"
          @run-bootstrap="handleRunBootstrap"
          @update:iterations="handleBootstrapIterationsUpdate"
        />
      </div>
    </div>

    <!-- Sample Size Calculator -->
    <div v-if="showCalculator" class="mt-6">
      <div class="card p-4">
        <SampleSizeCalculator
          :sample-size-mean="calculatedSampleSizeMean"
          :sample-size-proportion="calculatedSampleSizeProportion"
          :margin-of-error="calcMarginOfError"
          :std-dev="calcStdDev"
          :proportion="calcProportion"
          :confidence-level="confidenceLevel"
          @update:margin-of-error="setCalcMarginOfError"
          @update:std-dev="setCalcStdDev"
          @update:proportion="setCalcProportion"
          @update:confidence-level="setConfidenceLevel"
        />
      </div>
    </div>

    <!-- URL sync hint -->
    <p v-if="syncUrl" class="mt-4 text-xs text-text-muted text-center">
      <i class="fa-solid fa-link mr-1" aria-hidden="true" />
      Share this URL to show these settings to others
    </p>
  </div>
</template>

<style scoped>
.sampling-simulator {
  --min-touch-target: 44px;
}
</style>
