<script setup lang="ts">
import { computed } from 'vue'
import type { HistogramBin } from '@/utils/math/distributions'

interface Props {
  /** Histogram bins of sample means */
  bins: HistogramBin[]
  /** Number of samples taken */
  sampleCount: number
  /** True population mean */
  trueMean: number
  /** Theoretical standard error */
  theoreticalSE: number
  /** Empirical standard error (from samples) */
  empiricalSE: number
  /** Mean of sample means */
  meanOfMeans?: number
}

const props = withDefaults(defineProps<Props>(), {
  meanOfMeans: undefined,
})

// SVG dimensions
const width = 400
const height = 200
const padding = { top: 20, right: 20, bottom: 40, left: 50 }
const chartWidth = width - padding.left - padding.right
const chartHeight = height - padding.top - padding.bottom

// X-axis range
const xRange = computed(() => {
  if (props.bins.length === 0) {
    return { min: props.trueMean - 10, max: props.trueMean + 10 }
  }
  const min = Math.min(...props.bins.map((b) => b.start))
  const max = Math.max(...props.bins.map((b) => b.end))
  const margin = (max - min) * 0.1
  return { min: min - margin, max: max + margin }
})

// Y-axis range (density)
const yMax = computed(() => {
  if (props.bins.length === 0) return 1
  return Math.max(...props.bins.map((b) => b.density)) * 1.1
})

// Scale functions
function xScale(value: number): number {
  const { min, max } = xRange.value
  return padding.left + ((value - min) / (max - min)) * chartWidth
}

function yScale(value: number): number {
  return height - padding.bottom - (value / yMax.value) * chartHeight
}

// Bar data for histogram
const barData = computed(() => {
  return props.bins.map((bin) => {
    const x = xScale(bin.start)
    const barWidth = xScale(bin.end) - xScale(bin.start)
    const y = yScale(bin.density)
    const barHeight = yScale(0) - y

    return {
      x,
      y,
      width: Math.max(1, barWidth - 1),
      height: Math.max(0, barHeight),
      count: bin.count,
      density: bin.density,
      start: bin.start,
      end: bin.end,
    }
  })
})

// True mean line position
const trueMeanX = computed(() => xScale(props.trueMean))

// Mean of means position
const meanOfMeansX = computed(() => {
  if (props.meanOfMeans === undefined) return null
  return xScale(props.meanOfMeans)
})

// X-axis ticks
const xTicks = computed(() => {
  const { min, max } = xRange.value
  const range = max - min
  const tickCount = 5
  const step = range / tickCount

  return Array.from({ length: tickCount + 1 }, (_, i) => {
    const value = min + i * step
    return {
      value,
      x: xScale(value),
      label: value.toFixed(1),
    }
  })
})

// Computed mean of means from bins
const computedMeanOfMeans = computed(() => {
  if (props.meanOfMeans !== undefined) return props.meanOfMeans
  if (props.bins.length === 0) return props.trueMean

  // Weighted average of bin centers
  let sum = 0
  let count = 0
  for (const bin of props.bins) {
    const center = (bin.start + bin.end) / 2
    sum += center * bin.count
    count += bin.count
  }
  return count > 0 ? sum / count : props.trueMean
})
</script>

<template>
  <div class="sampling-distribution" data-testid="sampling-distribution">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide">
        <i class="fa-solid fa-chart-bar mr-2" aria-hidden="true" />
        Sampling Distribution
      </h4>
      <span class="text-xs text-text-secondary">
        {{ sampleCount }} samples
      </span>
    </div>

    <!-- Chart -->
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      class="w-full max-w-lg mx-auto"
      role="img"
      :aria-label="`Sampling distribution histogram with ${sampleCount} samples`"
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
      <g data-testid="histogram-bars">
        <rect
          v-for="(bar, i) in barData"
          :key="i"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          class="fill-primary/70 hover:fill-primary transition-colors"
          data-testid="histogram-bar"
        >
          <title>
            {{ bar.start.toFixed(2) }} - {{ bar.end.toFixed(2) }}
            Count: {{ bar.count }}
          </title>
        </rect>
      </g>

      <!-- True mean line -->
      <line
        :x1="trueMeanX"
        :y1="padding.top"
        :x2="trueMeanX"
        :y2="height - padding.bottom"
        class="stroke-red-500"
        stroke-width="2"
        stroke-dasharray="4,4"
        data-testid="true-mean-line"
      />

      <!-- Mean of means line (if different from true mean) -->
      <line
        v-if="meanOfMeansX !== null && Math.abs(meanOfMeansX - trueMeanX) > 2"
        :x1="meanOfMeansX"
        :y1="padding.top"
        :x2="meanOfMeansX"
        :y2="height - padding.bottom"
        class="stroke-green-500"
        stroke-width="2"
        data-testid="mean-of-means-line"
      />

      <!-- X-axis -->
      <line
        :x1="padding.left"
        :y1="height - padding.bottom"
        :x2="width - padding.right"
        :y2="height - padding.bottom"
        class="stroke-border"
        stroke-width="1"
      />

      <!-- X-axis ticks and labels -->
      <g v-for="tick in xTicks" :key="tick.value">
        <line
          :x1="tick.x"
          :y1="height - padding.bottom"
          :x2="tick.x"
          :y2="height - padding.bottom + 5"
          class="stroke-text-muted"
          stroke-width="1"
        />
        <text
          :x="tick.x"
          :y="height - padding.bottom + 18"
          class="fill-text-secondary text-[10px]"
          text-anchor="middle"
        >
          {{ tick.label }}
        </text>
      </g>

      <!-- X-axis label -->
      <text
        :x="width / 2"
        :y="height - 5"
        class="fill-text-muted text-xs"
        text-anchor="middle"
      >
        Sample Mean (x̄)
      </text>

      <!-- Y-axis label -->
      <text
        :x="15"
        :y="height / 2"
        class="fill-text-muted text-xs"
        text-anchor="middle"
        transform="rotate(-90, 15, 100)"
      >
        Density
      </text>
    </svg>

    <!-- Legend and stats -->
    <div class="flex flex-wrap items-center justify-between gap-4 mt-3 text-xs">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
          <span class="w-4 h-0.5 bg-red-500" style="border-style: dashed; border-width: 1px 0" />
          <span class="text-text-secondary">True μ = {{ trueMean.toFixed(2) }}</span>
        </div>
        <div v-if="sampleCount > 0" class="flex items-center gap-1">
          <span class="w-4 h-0.5 bg-green-500" />
          <span class="text-text-secondary">Mean of x̄ = {{ computedMeanOfMeans.toFixed(2) }}</span>
        </div>
      </div>

      <div class="flex items-center gap-4 text-text-secondary">
        <span>SE (theoretical): {{ theoreticalSE.toFixed(3) }}</span>
        <span v-if="empiricalSE > 0">SE (empirical): {{ empiricalSE.toFixed(3) }}</span>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="sampleCount === 0"
      class="absolute inset-0 flex items-center justify-center bg-surface/50"
    >
      <p class="text-text-muted text-sm">Take samples to see the distribution</p>
    </div>
  </div>
</template>

<style scoped>
.sampling-distribution {
  position: relative;
}
</style>
