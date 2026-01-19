<script setup lang="ts">
import { computed } from 'vue'
import type { TTestResult, ZTestResult, TestType } from '@/composables/useHypothesisTesting'

interface Props {
  result: TTestResult | ZTestResult | null
  testType: TestType
  formattedPValue: string
  significanceStars: string
  resultDescription: string
  assumptionWarnings: string[]
}

const props = defineProps<Props>()

const isTTest = computed(() =>
  props.testType === 'one-sample-t' || props.testType === 'two-sample-t'
)

const testStatisticLabel = computed(() => (isTTest.value ? 't' : 'z'))

const testStatisticValue = computed(() => {
  if (!props.result) return '-'
  if ('tStatistic' in props.result) {
    return props.result.tStatistic.toFixed(3)
  }
  return props.result.zStatistic.toFixed(3)
})

const degreesOfFreedom = computed(() => {
  if (!props.result || !('degreesOfFreedom' in props.result)) return null
  return props.result.degreesOfFreedom.toFixed(1)
})

const confidenceInterval = computed(() => {
  if (!props.result) return null
  return {
    lower: props.result.confidenceInterval.lower.toFixed(3),
    upper: props.result.confidenceInterval.upper.toFixed(3),
    level: Math.round(props.result.confidenceLevel * 100),
  }
})

const effectSize = computed(() => {
  if (!props.result) return null
  return {
    value: props.result.effectSize.toFixed(3),
    interpretation: props.result.effectSizeInterpretation,
  }
})
</script>

<template>
  <div class="space-y-4" data-testid="test-results">
    <h3 class="text-lg font-semibold text-text-primary">Test Results</h3>

    <template v-if="result">
      <!-- Main statistics grid -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Test Statistic -->
        <div class="p-3 bg-bg-secondary rounded-lg" data-testid="test-statistic">
          <div class="text-sm text-text-secondary">{{ testStatisticLabel }}-statistic</div>
          <div class="text-2xl font-mono font-bold text-text-primary" data-testid="test-statistic-value">
            {{ testStatisticValue }}
          </div>
          <div v-if="degreesOfFreedom" class="text-xs text-text-muted mt-1" data-testid="degrees-of-freedom">
            df = {{ degreesOfFreedom }}
          </div>
        </div>

        <!-- P-Value -->
        <div
          :class="[
            'p-3 rounded-lg',
            result.rejectNull ? 'bg-emerald-500/10' : 'bg-amber-500/10',
          ]"
          data-testid="p-value"
        >
          <div class="text-sm text-text-secondary">p-value</div>
          <div
            :class="[
              'text-2xl font-mono font-bold',
              result.rejectNull ? 'text-emerald-500' : 'text-amber-500',
            ]"
            data-testid="p-value-display"
          >
            {{ formattedPValue }}
            <span v-if="significanceStars" class="text-lg">{{ significanceStars }}</span>
          </div>
          <div class="text-xs text-text-muted mt-1">
            {{ result.rejectNull ? 'Significant' : 'Not significant' }} at α = {{ result.alpha }}
          </div>
        </div>
      </div>

      <!-- Confidence Interval -->
      <div v-if="confidenceInterval" class="p-3 bg-bg-secondary rounded-lg">
        <div class="text-sm text-text-secondary mb-1">
          {{ confidenceInterval.level }}% Confidence Interval
        </div>
        <div class="font-mono text-text-primary">
          ({{ confidenceInterval.lower }}, {{ confidenceInterval.upper }})
        </div>
      </div>

      <!-- Effect Size -->
      <div v-if="effectSize" class="p-3 bg-bg-secondary rounded-lg" data-testid="effect-size">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-text-secondary">Effect Size (Cohen's {{ isTTest ? 'd' : 'h' }})</div>
            <div class="text-xl font-mono font-bold text-text-primary" data-testid="effect-size-value">
              {{ effectSize.value }}
            </div>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded text-sm font-medium',
              effectSize.interpretation === 'large'
                ? 'bg-purple-500/20 text-purple-400'
                : effectSize.interpretation === 'medium'
                  ? 'bg-blue-500/20 text-blue-400'
                  : effectSize.interpretation === 'small'
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'bg-gray-500/20 text-gray-400',
            ]"
            data-testid="effect-size-interpretation"
          >
            {{ effectSize.interpretation }}
          </span>
        </div>
      </div>

      <!-- Decision -->
      <div
        :class="[
          'p-4 rounded-lg border-l-4',
          result.rejectNull
            ? 'border-emerald-500 bg-emerald-500/5'
            : 'border-amber-500 bg-amber-500/5',
        ]"
        data-testid="test-decision"
      >
        <div class="font-semibold text-text-primary mb-1" data-testid="test-decision-text">
          {{ result.rejectNull ? 'Reject H₀' : 'Fail to Reject H₀' }}
        </div>
        <p class="text-sm text-text-secondary">
          {{ resultDescription }}
        </p>
      </div>

      <!-- Assumption Warnings -->
      <div
        v-if="assumptionWarnings.length > 0"
        class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
      >
        <div class="flex items-start gap-2">
          <span class="text-amber-500" aria-hidden="true">⚠</span>
          <div>
            <div class="text-sm font-medium text-amber-400 mb-1">Assumption Check</div>
            <ul class="text-sm text-text-secondary space-y-1">
              <li v-for="(warning, index) in assumptionWarnings" :key="index">
                {{ warning }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>

    <!-- No result placeholder -->
    <template v-else>
      <div class="p-8 text-center text-text-muted bg-bg-secondary rounded-lg">
        Enter data to see test results
      </div>
    </template>
  </div>
</template>
