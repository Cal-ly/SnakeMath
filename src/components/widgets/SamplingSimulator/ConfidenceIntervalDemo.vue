<script setup lang="ts">
import { computed } from 'vue'
import type { CISimulationResult } from '@/composables/useSamplingSimulator'

interface Props {
  /** CI simulation results */
  results: CISimulationResult[]
  /** True population mean */
  trueMean: number
  /** Confidence level */
  confidenceLevel: number
  /** Coverage rate (captured / total) */
  coverageRate: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  runSimulation: [count: number]
  reset: []
}>()

// Max CIs to display
const maxDisplay = 50

// CIs to display (most recent)
const displayResults = computed(() => {
  return props.results.slice(-maxDisplay)
})

// Calculate display range
const displayRange = computed(() => {
  if (props.results.length === 0) {
    return { min: props.trueMean - 10, max: props.trueMean + 10 }
  }

  let min = Infinity
  let max = -Infinity
  for (const r of displayResults.value) {
    min = Math.min(min, r.ci.lower)
    max = Math.max(max, r.ci.upper)
  }

  const padding = (max - min) * 0.1
  return { min: min - padding, max: max + padding }
})

// Scale value to percentage
function toPercent(value: number): number {
  const { min, max } = displayRange.value
  return ((value - min) / (max - min)) * 100
}

// Confidence level as percentage
const confPercent = computed(() => (props.confidenceLevel * 100).toFixed(0))

// Expected coverage
const expectedCoverage = computed(() => (props.confidenceLevel * 100).toFixed(0))

// Actual coverage as percentage
const actualCoverage = computed(() => (props.coverageRate * 100).toFixed(1))

// Captured and missed counts
const capturedCount = computed(() => props.results.filter((r) => r.capturesTrueMean).length)
const missedCount = computed(() => props.results.length - capturedCount.value)

function handleRun(count: number) {
  emit('runSimulation', count)
}

function handleReset() {
  emit('reset')
}
</script>

<template>
  <div class="confidence-interval-demo" data-testid="ci-demo">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide">
        <i class="fa-solid fa-arrows-left-right-to-line mr-2" aria-hidden="true" />
        {{ confPercent }}% CI Coverage Simulation
      </h4>
      <span v-if="results.length > 0" class="text-xs text-text-secondary">
        {{ results.length }} CIs
      </span>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <button
        type="button"
        class="px-4 py-2 rounded-md bg-primary text-white font-medium
               hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30
               transition-colors"
        data-testid="run-10-ci"
        @click="handleRun(10)"
      >
        +10 CIs
      </button>

      <button
        type="button"
        class="px-3 py-2 rounded-md border border-border
               hover:border-primary hover:text-primary
               focus:outline-none focus:ring-2 focus:ring-primary/30
               transition-colors"
        data-testid="run-100-ci"
        @click="handleRun(100)"
      >
        +100 CIs
      </button>

      <button
        type="button"
        class="px-3 py-2 rounded-md border border-border text-text-secondary
               hover:border-red-500 hover:text-red-500
               focus:outline-none focus:ring-2 focus:ring-red-500/30
               transition-colors"
        data-testid="reset-ci"
        @click="handleReset"
      >
        <i class="fa-solid fa-rotate-left mr-1" aria-hidden="true" />
        Reset
      </button>
    </div>

    <!-- CI Visualization -->
    <div class="relative bg-surface-alt rounded-lg p-4 border border-border">
      <!-- True mean vertical line -->
      <div
        class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
        :style="{ left: `${toPercent(trueMean)}%` }"
        data-testid="true-mean-line"
      />

      <!-- CI bars -->
      <div class="space-y-1" role="list" aria-label="Confidence intervals">
        <div
          v-for="result in displayResults"
          :key="result.id"
          class="relative h-1.5 rounded-full"
          :class="result.capturesTrueMean ? 'bg-green-500' : 'bg-red-500'"
          :style="{
            marginLeft: `${toPercent(result.ci.lower)}%`,
            width: `${toPercent(result.ci.upper) - toPercent(result.ci.lower)}%`,
          }"
          role="listitem"
          :aria-label="`CI: ${result.ci.lower.toFixed(2)} to ${result.ci.upper.toFixed(2)}, ${result.capturesTrueMean ? 'captures' : 'misses'} true mean`"
          data-testid="ci-bar"
        >
          <!-- Point estimate dot -->
          <div
            class="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white"
            :style="{
              left: `${((result.ci.pointEstimate - result.ci.lower) / (result.ci.upper - result.ci.lower)) * 100}%`,
            }"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="results.length === 0"
        class="py-8 text-center text-text-muted"
      >
        <p>Click "+10 CIs" to start the simulation</p>
      </div>

      <!-- Range labels -->
      <div class="flex justify-between mt-2 text-xs text-text-muted">
        <span>{{ displayRange.min.toFixed(1) }}</span>
        <span class="text-red-500">μ = {{ trueMean.toFixed(2) }}</span>
        <span>{{ displayRange.max.toFixed(1) }}</span>
      </div>
    </div>

    <!-- Coverage statistics -->
    <div v-if="results.length > 0" class="mt-4 grid grid-cols-3 gap-3 text-center">
      <div class="p-3 bg-surface-alt rounded-lg">
        <div class="text-xs text-text-muted mb-1">Expected</div>
        <div class="text-lg font-semibold">{{ expectedCoverage }}%</div>
      </div>

      <div class="p-3 bg-surface-alt rounded-lg">
        <div class="text-xs text-text-muted mb-1">Actual</div>
        <div
          class="text-lg font-semibold"
          :class="
            Math.abs(coverageRate - confidenceLevel) < 0.05
              ? 'text-green-600 dark:text-green-400'
              : 'text-amber-600 dark:text-amber-400'
          "
          data-testid="actual-coverage"
        >
          {{ actualCoverage }}%
        </div>
      </div>

      <div class="p-3 bg-surface-alt rounded-lg">
        <div class="text-xs text-text-muted mb-1">Captures / Misses</div>
        <div class="text-lg font-semibold">
          <span class="text-green-600 dark:text-green-400">{{ capturedCount }}</span>
          /
          <span class="text-red-500">{{ missedCount }}</span>
        </div>
      </div>
    </div>

    <!-- Explanation -->
    <p class="mt-4 text-xs text-text-secondary">
      Each bar is a {{ confPercent }}% confidence interval from a new sample.
      <span class="text-green-600 dark:text-green-400">Green</span> bars capture the true mean (μ),
      <span class="text-red-500">red</span> bars miss it.
      With enough samples, ~{{ expectedCoverage }}% should capture μ.
    </p>
  </div>
</template>

<style scoped>
.confidence-interval-demo button {
  min-height: 44px;
}
</style>
