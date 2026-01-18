<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import type { DistributionType } from '@/utils/math/distributions'
import {
  generateSamples,
  createHistogram,
  normalPdf,
  getDistributionStats,
} from '@/utils/math/distributions'

interface Props {
  /** Starting distribution for CLT demo */
  sourceDistribution?: DistributionType
  /** Initial sample size */
  initialSampleSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  sourceDistribution: 'uniform',
  initialSampleSize: 30,
})

// Source distribution options for CLT demo
const sourceOptions: { type: DistributionType; label: string; params: Record<string, number> }[] = [
  { type: 'uniform', label: 'Uniform (0-10)', params: { a: 0, b: 10 } },
  { type: 'exponential', label: 'Exponential (λ=1)', params: { lambda: 1 } },
  { type: 'binomial', label: 'Binomial (n=10, p=0.3)', params: { n: 10, p: 0.3 } },
  { type: 'poisson', label: 'Poisson (λ=4)', params: { lambda: 4 } },
]

// State
const selectedSource = ref(props.sourceDistribution)
const sampleSize = ref(props.initialSampleSize)
const sampleMeans = ref<number[]>([])
const isRunning = ref(false)
const autoRun = ref(false)
const samplesPerBatch = 50

// Animation timer ref for cleanup
let animationTimer: ReturnType<typeof setTimeout> | null = null

// Get source distribution params
const sourceParams = computed(() => {
  const option = sourceOptions.find((o) => o.type === selectedSource.value)
  if (!option) return { type: 'uniform' as const, params: { a: 0, b: 10 } }
  return { type: option.type, params: option.params }
})

// Source distribution stats
const sourceStats = computed(() => {
  const { type, params } = sourceParams.value

  if (type === 'uniform') {
    const p = params as { a: number; b: number }
    return getDistributionStats({ type: 'uniform', params: p })
  } else if (type === 'exponential') {
    const p = params as { lambda: number }
    return getDistributionStats({ type: 'exponential', params: p })
  } else if (type === 'binomial') {
    const p = params as { n: number; p: number }
    return getDistributionStats({ type: 'binomial', params: p })
  } else if (type === 'poisson') {
    const p = params as { lambda: number }
    return getDistributionStats({ type: 'poisson', params: p })
  }

  return { mean: 5, variance: 8.33, stdDev: 2.89, mode: null, skewness: 0 }
})

// Theoretical mean of sample means (same as source mean)
const theoreticalMean = computed(() => sourceStats.value.mean)

// Theoretical std dev of sample means (source σ / √n)
const theoreticalStdDev = computed(
  () => sourceStats.value.stdDev / Math.sqrt(sampleSize.value)
)

// Create histogram from sample means
const histogram = computed(() => {
  if (sampleMeans.value.length < 2) return []
  return createHistogram(sampleMeans.value, 20)
})

// X range for chart
const xRange = computed(() => {
  if (histogram.value.length === 0) {
    const mu = theoreticalMean.value
    const sigma = theoreticalStdDev.value * 4
    return { min: mu - sigma, max: mu + sigma }
  }

  const firstBin = histogram.value[0]
  const lastBin = histogram.value[histogram.value.length - 1]
  if (!firstBin || !lastBin) {
    return { min: 0, max: 10 }
  }

  const padding = (lastBin.end - firstBin.start) * 0.1
  return {
    min: firstBin.start - padding,
    max: lastBin.end + padding,
  }
})

// Max density for scaling
const maxDensity = computed(() => {
  if (histogram.value.length === 0) return 1
  return Math.max(...histogram.value.map((b) => b.density), 0.1)
})

// Normal curve points for overlay
const normalCurvePoints = computed(() => {
  if (sampleMeans.value.length < 10) return []

  const points: { x: number; y: number }[] = []
  const steps = 100
  const { min, max } = xRange.value
  const step = (max - min) / steps

  for (let i = 0; i <= steps; i++) {
    const x = min + i * step
    const y = normalPdf(x, theoreticalMean.value, theoreticalStdDev.value)
    points.push({ x, y })
  }

  return points
})

// Max PDF value for curve scaling
const maxPdfValue = computed(() => {
  if (normalCurvePoints.value.length === 0) return 1
  return Math.max(...normalCurvePoints.value.map((p) => p.y), 0.1)
})

// SVG dimensions
const svgWidth = 500
const svgHeight = 200
const padding = { top: 20, right: 20, bottom: 35, left: 45 }
const chartWidth = svgWidth - padding.left - padding.right
const chartHeight = svgHeight - padding.top - padding.bottom

// Scale helpers
function xToSvg(x: number): number {
  const range = xRange.value.max - xRange.value.min || 1
  return padding.left + ((x - xRange.value.min) / range) * chartWidth
}

function yToSvg(y: number, maxY: number): number {
  const scale = maxY > 0 ? maxY : 1
  return padding.top + chartHeight - (y / scale) * chartHeight
}

// Bar width for histogram
const barWidth = computed(() => {
  if (histogram.value.length === 0) return 10
  return chartWidth / histogram.value.length - 1
})

// Generate normal curve SVG path
const normalCurvePath = computed(() => {
  if (normalCurvePoints.value.length === 0) return ''

  // Scale to match histogram density
  const scaleFactor = maxDensity.value / maxPdfValue.value

  const points = normalCurvePoints.value.map((p) => {
    const scaledY = p.y * scaleFactor
    return `${xToSvg(p.x)},${yToSvg(scaledY, maxDensity.value)}`
  })

  return `M ${points.join(' L ')}`
})

// Take samples and compute means
function takeSamples(count: number) {
  const { type, params } = sourceParams.value
  const newMeans: number[] = []

  for (let i = 0; i < count; i++) {
    let samples: number[]

    if (type === 'uniform') {
      const p = params as { a: number; b: number }
      samples = generateSamples({ type: 'uniform', params: p }, sampleSize.value)
    } else if (type === 'exponential') {
      const p = params as { lambda: number }
      samples = generateSamples({ type: 'exponential', params: p }, sampleSize.value)
    } else if (type === 'binomial') {
      const p = params as { n: number; p: number }
      samples = generateSamples({ type: 'binomial', params: p }, sampleSize.value)
    } else if (type === 'poisson') {
      const p = params as { lambda: number }
      samples = generateSamples({ type: 'poisson', params: p }, sampleSize.value)
    } else {
      samples = generateSamples({ type: 'uniform', params: { a: 0, b: 10 } }, sampleSize.value)
    }

    const mean = samples.reduce((a, b) => a + b, 0) / samples.length
    newMeans.push(mean)
  }

  sampleMeans.value = [...sampleMeans.value, ...newMeans]
}

// Control functions
function handleTakeSamples() {
  isRunning.value = true
  takeSamples(samplesPerBatch)
  isRunning.value = false
}

function handleReset() {
  stopAutoRun()
  sampleMeans.value = []
}

function toggleAutoRun() {
  if (autoRun.value) {
    stopAutoRun()
  } else {
    startAutoRun()
  }
}

function startAutoRun() {
  autoRun.value = true
  runAutoLoop()
}

function stopAutoRun() {
  autoRun.value = false
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
}

function runAutoLoop() {
  if (!autoRun.value) return

  takeSamples(10)

  // Stop at 1000 samples
  if (sampleMeans.value.length >= 1000) {
    stopAutoRun()
    return
  }

  animationTimer = setTimeout(runAutoLoop, 100)
}

// Reset when source or sample size changes
watch([selectedSource, sampleSize], () => {
  handleReset()
})

// Cleanup on unmount (LL-019, LI-019)
onUnmounted(() => {
  stopAutoRun()
})

// Format number for display
function formatNumber(value: number): string {
  return value.toFixed(3)
}
</script>

<template>
  <div class="clt-demonstration p-4 bg-surface-alt rounded-lg border border-border" data-testid="clt-demonstration">
    <h4 class="text-lg font-semibold mb-3 flex items-center gap-2">
      <i class="fa-solid fa-chart-line text-primary" aria-hidden="true" />
      Central Limit Theorem Demo
    </h4>

    <p class="text-sm text-text-secondary mb-4">
      Take samples from any distribution, compute their means, and watch the distribution of means converge to a normal distribution!
    </p>

    <!-- Controls -->
    <div class="grid gap-4 sm:grid-cols-2 mb-4">
      <!-- Source distribution -->
      <div>
        <label class="block text-sm font-medium mb-1" for="clt-source">
          Source Distribution
        </label>
        <select
          id="clt-source"
          v-model="selectedSource"
          class="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
          data-testid="clt-source-select"
        >
          <option v-for="option in sourceOptions" :key="option.type" :value="option.type">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Sample size -->
      <div>
        <label class="block text-sm font-medium mb-1" for="clt-sample-size">
          Sample Size (n): {{ sampleSize }}
        </label>
        <input
          id="clt-sample-size"
          v-model.number="sampleSize"
          type="range"
          min="5"
          max="100"
          step="5"
          class="w-full accent-primary"
          data-testid="clt-sample-size-slider"
        />
        <div class="flex justify-between text-xs text-text-muted mt-1">
          <span>5</span>
          <span>100</span>
        </div>
      </div>
    </div>

    <!-- Stats display -->
    <div class="flex flex-wrap gap-4 text-sm mb-4">
      <div class="px-3 py-1.5 bg-surface rounded border border-border">
        <span class="text-text-secondary">Samples taken:</span>
        <span class="font-mono ml-2" data-testid="clt-sample-count">{{ sampleMeans.length }}</span>
      </div>
      <div class="px-3 py-1.5 bg-surface rounded border border-border">
        <span class="text-text-secondary">Theoretical μ:</span>
        <span class="font-mono ml-2">{{ formatNumber(theoreticalMean) }}</span>
      </div>
      <div class="px-3 py-1.5 bg-surface rounded border border-border">
        <span class="text-text-secondary">Theoretical σ/√n:</span>
        <span class="font-mono ml-2">{{ formatNumber(theoreticalStdDev) }}</span>
      </div>
    </div>

    <!-- Histogram chart -->
    <div class="overflow-x-auto mb-4">
      <svg
        :width="svgWidth"
        :height="svgHeight"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        class="w-full"
        role="img"
        aria-label="Distribution of sample means histogram"
        data-testid="clt-histogram"
      >
        <!-- Empty state message -->
        <text
          v-if="histogram.length === 0"
          :x="svgWidth / 2"
          :y="svgHeight / 2"
          class="fill-text-muted text-sm"
          text-anchor="middle"
        >
          Click "Take Samples" to start
        </text>

        <!-- Histogram bars -->
        <g v-if="histogram.length > 0" class="histogram-bars">
          <rect
            v-for="(bin, index) in histogram"
            :key="index"
            :x="xToSvg(bin.start)"
            :y="yToSvg(bin.density, maxDensity)"
            :width="barWidth"
            :height="chartHeight - (yToSvg(bin.density, maxDensity) - padding.top)"
            class="fill-primary/60"
            :data-testid="`clt-bar-${index}`"
          />
        </g>

        <!-- Normal curve overlay -->
        <path
          v-if="normalCurvePath && sampleMeans.length >= 10"
          :d="normalCurvePath"
          fill="none"
          class="stroke-emerald-500"
          stroke-width="2.5"
          stroke-linecap="round"
          data-testid="clt-normal-curve"
        />

        <!-- Axes -->
        <line
          :x1="padding.left"
          :y1="padding.top + chartHeight"
          :x2="padding.left + chartWidth"
          :y2="padding.top + chartHeight"
          class="stroke-text-muted"
          stroke-width="1"
        />
        <line
          :x1="padding.left"
          :y1="padding.top"
          :x2="padding.left"
          :y2="padding.top + chartHeight"
          class="stroke-text-muted"
          stroke-width="1"
        />

        <!-- Axis labels -->
        <text
          :x="padding.left + chartWidth / 2"
          :y="svgHeight - 5"
          class="fill-text-muted text-xs"
          text-anchor="middle"
        >
          Sample Mean (x̄)
        </text>

        <!-- Legend -->
        <g v-if="sampleMeans.length >= 10" :transform="`translate(${padding.left + chartWidth - 90}, ${padding.top + 5})`">
          <line x1="0" y1="5" x2="15" y2="5" class="stroke-emerald-500" stroke-width="2.5" />
          <text x="20" y="9" class="fill-text-muted text-[10px]">Normal fit</text>
        </g>
      </svg>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
        :disabled="isRunning || autoRun"
        data-testid="clt-take-samples-btn"
        @click="handleTakeSamples"
      >
        <i class="fa-solid fa-play mr-2" aria-hidden="true" />
        Take {{ samplesPerBatch }} Samples
      </button>

      <button
        type="button"
        class="px-4 py-2 border border-border rounded-md hover:bg-surface-alt transition-colors focus:ring-2 focus:ring-primary/30"
        :class="autoRun ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800' : ''"
        data-testid="clt-auto-run-btn"
        @click="toggleAutoRun"
      >
        <i :class="autoRun ? 'fa-solid fa-stop' : 'fa-solid fa-forward'" class="mr-2" aria-hidden="true" />
        {{ autoRun ? 'Stop' : 'Auto-run' }}
      </button>

      <button
        type="button"
        class="px-4 py-2 border border-border rounded-md hover:bg-surface-alt transition-colors focus:ring-2 focus:ring-primary/30"
        data-testid="clt-reset-btn"
        @click="handleReset"
      >
        <i class="fa-solid fa-rotate-left mr-2" aria-hidden="true" />
        Reset
      </button>
    </div>

    <!-- CLT explanation -->
    <div class="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-md text-sm">
      <p class="text-emerald-700 dark:text-emerald-300">
        <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
        <strong>Central Limit Theorem:</strong> Regardless of the source distribution's shape,
        the distribution of sample means approaches a normal distribution as sample size increases.
        The larger the sample size (n), the closer to normal!
      </p>
    </div>
  </div>
</template>
