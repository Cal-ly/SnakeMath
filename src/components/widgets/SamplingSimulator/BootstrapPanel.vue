<script setup lang="ts">
import { computed } from 'vue'
import type { BootstrapResult } from '@/composables/useSamplingSimulator'
import { createHistogram } from '@/utils/math/distributions'

interface Props {
  /** Bootstrap result from composable */
  result: BootstrapResult | null
  /** Number of bootstrap iterations */
  iterations: number
  /** Sample values used for bootstrap */
  sampleValues: number[]
  /** Confidence level */
  confidenceLevel: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  runBootstrap: []
  'update:iterations': [count: number]
}>()

// SVG dimensions
const width = 400
const height = 150
const padding = { top: 10, right: 20, bottom: 30, left: 40 }
const chartWidth = width - padding.left - padding.right
const chartHeight = height - padding.top - padding.bottom

// Histogram bins
const histogramBins = computed(() => {
  if (!props.result) return []
  return createHistogram(props.result.bootstrapStatistics, 30)
})

// X-axis range
const xRange = computed(() => {
  if (histogramBins.value.length === 0) {
    return { min: 0, max: 100 }
  }
  const min = Math.min(...histogramBins.value.map((b) => b.start))
  const max = Math.max(...histogramBins.value.map((b) => b.end))
  const margin = (max - min) * 0.1
  return { min: min - margin, max: max + margin }
})

// Y-axis max
const yMax = computed(() => {
  if (histogramBins.value.length === 0) return 1
  return Math.max(...histogramBins.value.map((b) => b.density)) * 1.1
})

// Scale functions
function xScale(value: number): number {
  const { min, max } = xRange.value
  return padding.left + ((value - min) / (max - min)) * chartWidth
}

function yScale(value: number): number {
  return height - padding.bottom - (value / yMax.value) * chartHeight
}

// Bar data
const barData = computed(() => {
  return histogramBins.value.map((bin) => ({
    x: xScale(bin.start),
    y: yScale(bin.density),
    width: Math.max(1, xScale(bin.end) - xScale(bin.start) - 1),
    height: Math.max(0, yScale(0) - yScale(bin.density)),
  }))
})

// CI bounds positions
const ciLowerX = computed(() => (props.result ? xScale(props.result.percentileCI.lower) : 0))
const ciUpperX = computed(() => (props.result ? xScale(props.result.percentileCI.upper) : 0))
const originalStatX = computed(() =>
  props.result ? xScale(props.result.originalStatistic) : 0
)

// Confidence level as percentage
const confPercent = computed(() => (props.confidenceLevel * 100).toFixed(0))

function handleRun() {
  emit('runBootstrap')
}

function handleIterationsChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value, 10)
  if (!isNaN(value) && value >= 100) {
    emit('update:iterations', value)
  }
}
</script>

<template>
  <div class="bootstrap-panel" data-testid="bootstrap-panel">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide">
        <i class="fa-solid fa-repeat mr-2" aria-hidden="true" />
        Bootstrap Resampling
      </h4>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap items-center gap-4 mb-4">
      <button
        type="button"
        class="px-4 py-2 rounded-md bg-primary text-white font-medium
               hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30
               transition-colors"
        :disabled="sampleValues.length === 0"
        :class="{ 'opacity-50 cursor-not-allowed': sampleValues.length === 0 }"
        data-testid="run-bootstrap-btn"
        @click="handleRun"
      >
        <i class="fa-solid fa-play mr-2" aria-hidden="true" />
        Run Bootstrap
      </button>

      <div class="flex items-center gap-2">
        <label class="text-sm text-text-secondary">Iterations:</label>
        <select
          :value="iterations"
          class="px-2 py-1 text-sm border border-border rounded-md bg-surface
                 focus:outline-none focus:ring-2 focus:ring-primary/30"
          data-testid="bootstrap-iterations"
          @change="handleIterationsChange"
        >
          <option :value="100">100</option>
          <option :value="500">500</option>
          <option :value="1000">1,000</option>
          <option :value="5000">5,000</option>
          <option :value="10000">10,000</option>
        </select>
      </div>
    </div>

    <!-- Sample info -->
    <div v-if="sampleValues.length === 0" class="p-4 bg-surface-alt rounded-lg text-center text-text-muted">
      <p>Take a sample first, then run bootstrap</p>
    </div>

    <!-- Bootstrap results -->
    <div v-else-if="result" class="space-y-4">
      <!-- Distribution chart -->
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        class="w-full max-w-lg"
        role="img"
        aria-label="Bootstrap distribution of sample means"
      >
        <!-- Background -->
        <rect
          :x="padding.left"
          :y="padding.top"
          :width="chartWidth"
          :height="chartHeight"
          class="fill-surface-alt"
        />

        <!-- Histogram bars -->
        <g>
          <rect
            v-for="(bar, i) in barData"
            :key="i"
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            class="fill-emerald-500/70"
          />
        </g>

        <!-- CI lower bound -->
        <line
          :x1="ciLowerX"
          :y1="padding.top"
          :x2="ciLowerX"
          :y2="height - padding.bottom"
          class="stroke-amber-500"
          stroke-width="2"
          stroke-dasharray="4,2"
        />

        <!-- CI upper bound -->
        <line
          :x1="ciUpperX"
          :y1="padding.top"
          :x2="ciUpperX"
          :y2="height - padding.bottom"
          class="stroke-amber-500"
          stroke-width="2"
          stroke-dasharray="4,2"
        />

        <!-- Original statistic -->
        <line
          :x1="originalStatX"
          :y1="padding.top"
          :x2="originalStatX"
          :y2="height - padding.bottom"
          class="stroke-primary"
          stroke-width="2"
        />

        <!-- X-axis -->
        <line
          :x1="padding.left"
          :y1="height - padding.bottom"
          :x2="width - padding.right"
          :y2="height - padding.bottom"
          class="stroke-border"
        />

        <!-- X-axis label -->
        <text
          :x="width / 2"
          :y="height - 5"
          class="fill-text-muted text-[10px]"
          text-anchor="middle"
        >
          Bootstrap Statistic
        </text>
      </svg>

      <!-- Statistics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div class="p-2 bg-surface-alt rounded-lg">
          <div class="text-xs text-text-muted mb-1">Original</div>
          <div class="font-semibold text-primary" data-testid="bootstrap-original">
            {{ result.originalStatistic.toFixed(2) }}
          </div>
        </div>

        <div class="p-2 bg-surface-alt rounded-lg">
          <div class="text-xs text-text-muted mb-1">Bootstrap SE</div>
          <div class="font-semibold" data-testid="bootstrap-se">
            {{ result.standardError.toFixed(3) }}
          </div>
        </div>

        <div class="p-2 bg-surface-alt rounded-lg">
          <div class="text-xs text-text-muted mb-1">{{ confPercent }}% CI Lower</div>
          <div class="font-semibold text-amber-600 dark:text-amber-400" data-testid="bootstrap-ci-lower">
            {{ result.percentileCI.lower.toFixed(2) }}
          </div>
        </div>

        <div class="p-2 bg-surface-alt rounded-lg">
          <div class="text-xs text-text-muted mb-1">{{ confPercent }}% CI Upper</div>
          <div class="font-semibold text-amber-600 dark:text-amber-400" data-testid="bootstrap-ci-upper">
            {{ result.percentileCI.upper.toFixed(2) }}
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap items-center justify-center gap-4 text-xs text-text-secondary">
        <div class="flex items-center gap-1">
          <span class="w-4 h-0.5 bg-primary" />
          <span>Original</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="w-4 h-0.5 bg-amber-500" style="border-style: dashed; border-width: 1px 0" />
          <span>{{ confPercent }}% CI bounds</span>
        </div>
      </div>
    </div>

    <!-- Waiting state -->
    <div v-else-if="sampleValues.length > 0" class="p-4 bg-surface-alt rounded-lg text-center text-text-muted">
      <p>Sample ready (n = {{ sampleValues.length }}). Click "Run Bootstrap" to resample.</p>
    </div>
  </div>
</template>

<style scoped>
.bootstrap-panel button {
  min-height: 44px;
}
</style>
