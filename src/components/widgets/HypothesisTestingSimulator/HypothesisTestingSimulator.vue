<script setup lang="ts">
import TestTypeSelector from './TestTypeSelector.vue'
import TestInputs from './TestInputs.vue'
import TestResults from './TestResults.vue'
import PValueVisualization from './PValueVisualization.vue'
import HypothesisPresets from './HypothesisPresets.vue'
import TypeErrorDemo from './TypeErrorDemo.vue'
import PowerAnalysis from './PowerAnalysis.vue'
import { useHypothesisTesting } from '@/composables/useHypothesisTesting'
import type { TestType } from '@/composables/useHypothesisTesting'

interface Props {
  /** Initial test type */
  initialTestType?: TestType
  /** Initial preset ID to load */
  initialPreset?: string
  /** Whether to sync state to URL */
  syncUrl?: boolean
  /** Show type error demo panel */
  showTypeErrorDemo?: boolean
  /** Show power analysis panel */
  showPowerAnalysis?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialTestType: 'two-sample-t',
  initialPreset: undefined,
  syncUrl: false,
  showTypeErrorDemo: true,
  showPowerAnalysis: true,
})

const {
  // State - Test Configuration
  testType,
  alternative,
  alpha,
  activeTab,

  // State - One-Sample T-Test
  oneSampleMean,
  oneSampleStdDev,
  oneSampleN,
  oneSampleHypothesized,

  // State - Two-Sample T-Test
  twoSampleMean1,
  twoSampleStdDev1,
  twoSampleN1,
  twoSampleMean2,
  twoSampleStdDev2,
  twoSampleN2,

  // State - One-Proportion Z-Test
  onePropSuccesses,
  onePropN,
  onePropHypothesized,

  // State - Two-Proportion Z-Test
  twoPropSuccesses1,
  twoPropN1,
  twoPropSuccesses2,
  twoPropN2,

  // State - Type Error Demo
  typeErrorAlpha,
  typeErrorEffectSize,
  typeErrorSampleSize,

  // State - Power Analysis
  powerEffectSize,
  powerDesired,
  powerTestType,

  // Computed - Test Results
  testResult,
  isTTest,
  testStatistic,
  degreesOfFreedom,
  formattedPValue,
  significanceStars,
  resultDescription,
  assumptionWarnings,

  // Computed - Distribution Visualization
  criticalValues,
  distributionCurve,

  // Computed - Type I/II Error Demo
  beta,
  typeErrorPower,
  nullDistributionCurve,
  alternativeDistributionCurve,

  // Computed - Power Analysis
  requiredSampleSize,
  powerCurve,
  sampleSizeFor80Power,
  sampleSizeFor90Power,

  // Static data
  hypothesisTestPresets,

  // Methods
  setTestType,
  setAlternative,
  setAlpha,
  setActiveTab,
  setOneSampleMean,
  setOneSampleStdDev,
  setOneSampleN,
  setOneSampleHypothesized,
  setTwoSampleMean1,
  setTwoSampleStdDev1,
  setTwoSampleN1,
  setTwoSampleMean2,
  setTwoSampleStdDev2,
  setTwoSampleN2,
  setOnePropSuccesses,
  setOnePropN,
  setOnePropHypothesized,
  setTwoPropSuccesses1,
  setTwoPropN1,
  setTwoPropSuccesses2,
  setTwoPropN2,
  setTypeErrorAlpha,
  setTypeErrorEffectSize,
  setTypeErrorSampleSize,
  setPowerEffectSize,
  setPowerDesired,
  setPowerTestType,
  loadPreset,
} = useHypothesisTesting({
  initialTestType: props.initialTestType,
  initialPreset: props.initialPreset,
  syncUrl: props.syncUrl,
})

// Event handlers
function handlePresetSelect(presetId: string) {
  loadPreset(presetId)
}

function handleTestTypeSelect(type: TestType) {
  setTestType(type)
}

function handleAlternativeSelect(alt: 'two-sided' | 'less' | 'greater') {
  setAlternative(alt)
}

function handleAlphaUpdate(value: number) {
  setAlpha(value)
}

// Tab definitions
const tabs = [
  { id: 'test', label: 'Run Test', icon: '📊' },
  { id: 'type-errors', label: 'Type I/II Errors', icon: '⚖️' },
  { id: 'power', label: 'Power Analysis', icon: '💪' },
] as const
</script>

<template>
  <div class="hypothesis-testing-simulator" data-testid="hypothesis-testing-simulator">
    <!-- Presets -->
    <div class="mb-6">
      <HypothesisPresets :presets="hypothesisTestPresets" @select="handlePresetSelect" />
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <div class="flex border-b border-border-primary" role="tablist" aria-label="Hypothesis testing options">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'flex-1 px-4 py-3 text-sm font-medium transition-colors min-h-[44px]',
            activeTab === tab.id
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary',
          ]"
          :aria-selected="activeTab === tab.id"
          :data-testid="`tab-${tab.id}`"
          role="tab"
          :tabindex="activeTab === tab.id ? 0 : -1"
          @click="setActiveTab(tab.id)"
        >
          <span class="mr-2" aria-hidden="true">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div role="tabpanel">
      <!-- Run Test Tab -->
      <template v-if="activeTab === 'test'">
        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Left Column: Configuration & Inputs -->
          <div class="space-y-6">
            <!-- Test Type & Configuration -->
            <div class="card p-4">
              <TestTypeSelector
                :selected-type="testType"
                :alternative="alternative"
                :alpha="alpha"
                @select-type="handleTestTypeSelect"
                @select-alternative="handleAlternativeSelect"
                @update-alpha="handleAlphaUpdate"
              />
            </div>

            <!-- Test Data Inputs -->
            <div class="card p-4">
              <TestInputs
                :test-type="testType"
                :one-sample-mean="oneSampleMean"
                :one-sample-std-dev="oneSampleStdDev"
                :one-sample-n="oneSampleN"
                :one-sample-hypothesized="oneSampleHypothesized"
                :two-sample-mean1="twoSampleMean1"
                :two-sample-std-dev1="twoSampleStdDev1"
                :two-sample-n1="twoSampleN1"
                :two-sample-mean2="twoSampleMean2"
                :two-sample-std-dev2="twoSampleStdDev2"
                :two-sample-n2="twoSampleN2"
                :one-prop-successes="onePropSuccesses"
                :one-prop-n="onePropN"
                :one-prop-hypothesized="onePropHypothesized"
                :two-prop-successes1="twoPropSuccesses1"
                :two-prop-n1="twoPropN1"
                :two-prop-successes2="twoPropSuccesses2"
                :two-prop-n2="twoPropN2"
                @update:one-sample-mean="setOneSampleMean"
                @update:one-sample-std-dev="setOneSampleStdDev"
                @update:one-sample-n="setOneSampleN"
                @update:one-sample-hypothesized="setOneSampleHypothesized"
                @update:two-sample-mean1="setTwoSampleMean1"
                @update:two-sample-std-dev1="setTwoSampleStdDev1"
                @update:two-sample-n1="setTwoSampleN1"
                @update:two-sample-mean2="setTwoSampleMean2"
                @update:two-sample-std-dev2="setTwoSampleStdDev2"
                @update:two-sample-n2="setTwoSampleN2"
                @update:one-prop-successes="setOnePropSuccesses"
                @update:one-prop-n="setOnePropN"
                @update:one-prop-hypothesized="setOnePropHypothesized"
                @update:two-prop-successes1="setTwoPropSuccesses1"
                @update:two-prop-n1="setTwoPropN1"
                @update:two-prop-successes2="setTwoPropSuccesses2"
                @update:two-prop-n2="setTwoPropN2"
              />
            </div>
          </div>

          <!-- Right Column: Results & Visualization -->
          <div class="space-y-6">
            <!-- Test Results -->
            <div class="card p-4">
              <TestResults
                :result="testResult"
                :test-type="testType"
                :formatted-p-value="formattedPValue"
                :significance-stars="significanceStars"
                :result-description="resultDescription"
                :assumption-warnings="assumptionWarnings"
              />
            </div>

            <!-- P-Value Visualization -->
            <div class="card p-4">
              <PValueVisualization
                :curve="distributionCurve"
                :test-statistic="testStatistic"
                :critical-values="criticalValues"
                :alternative="alternative"
                :p-value="testResult?.pValue ?? 1"
                :reject-null="testResult?.rejectNull ?? false"
                :is-t-test="isTTest"
                :degrees-of-freedom="degreesOfFreedom"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Type I/II Errors Tab -->
      <template v-else-if="activeTab === 'type-errors'">
        <div v-if="showTypeErrorDemo" class="card p-4">
          <TypeErrorDemo
            :alpha="typeErrorAlpha"
            :beta="beta"
            :power="typeErrorPower"
            :effect-size="typeErrorEffectSize"
            :sample-size="typeErrorSampleSize"
            :null-curve="nullDistributionCurve"
            :alternative-curve="alternativeDistributionCurve"
            @update:alpha="setTypeErrorAlpha"
            @update:effect-size="setTypeErrorEffectSize"
            @update:sample-size="setTypeErrorSampleSize"
          />
        </div>
      </template>

      <!-- Power Analysis Tab -->
      <template v-else-if="activeTab === 'power'">
        <div v-if="showPowerAnalysis" class="card p-4">
          <PowerAnalysis
            :effect-size="powerEffectSize"
            :desired-power="powerDesired"
            :alpha="alpha"
            :test-type="powerTestType"
            :required-sample-size="requiredSampleSize"
            :power-curve="powerCurve"
            :sample-size-for80-power="sampleSizeFor80Power"
            :sample-size-for90-power="sampleSizeFor90Power"
            @update:effect-size="setPowerEffectSize"
            @update:desired-power="setPowerDesired"
            @update:test-type="setPowerTestType"
          />
        </div>
      </template>
    </div>

    <!-- URL sync hint -->
    <p v-if="syncUrl" class="mt-4 text-xs text-text-muted text-center">
      <i class="fa-solid fa-link mr-1" aria-hidden="true" />
      Share this URL to show these settings to others
    </p>
  </div>
</template>

<style scoped>
.hypothesis-testing-simulator {
  --min-touch-target: 44px;
}
</style>
