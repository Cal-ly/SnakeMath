<script setup lang="ts">
import { ref, computed } from 'vue'
import type { HistogramBin, DistributionType } from '@/utils/math/distributions'

interface Props {
  sampleData: number[]
  histogramBins: HistogramBin[]
  sampleCount: number
  distributionType: DistributionType
  xRange: { min: number; max: number }
  isValid: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  generate: [count: number]
  clear: []
}>()

const localSampleCount = ref(props.sampleCount)

// SVG dimensions
const svgWidth = 600
const height = 200
const padding = { top: 20, right: 20, bottom: 35, left: 45 }
const chartWidth = svgWidth - padding.left - padding.right
const chartHeight = height - padding.top - padding.bottom

// Max density for scaling
const maxDensity = computed(() => {
  if (props.histogramBins.length === 0) return 1
  return Math.max(...props.histogramBins.map((b) => b.density), 0.001)
})

// Scale functions
function xToSvg(x: number): number {
  const range = props.xRange.max - props.xRange.min || 1
  return padding.left + ((x - props.xRange.min) / range) * chartWidth
}

function yToSvg(density: number): number {
  return padding.top + chartHeight - (density / maxDensity.value) * chartHeight
}

// Bar width
const barWidth = computed(() => {
  if (props.histogramBins.length === 0) return 0
  const binWidth = props.histogramBins[0]!.end - props.histogramBins[0]!.start
  const range = props.xRange.max - props.xRange.min || 1
  return (binWidth / range) * chartWidth - 1
})

function handleGenerate() {
  emit('generate', localSampleCount.value)
}

function handleClear() {
  emit('clear')
}

function handleCountChange(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value, 10)
  if (!isNaN(value) && value > 0) {
    localSampleCount.value = value
  }
}

function formatValue(value: number): string {
  if (Math.abs(value) < 0.01) return value.toExponential(1)
  if (Math.abs(value) >= 100) return value.toFixed(0)
  return value.toFixed(1)
}
</script>

<template>
  <div class="sample-histogram" data-testid="sample-histogram">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide">
        <i class="fa-solid fa-dice mr-2" aria-hidden="true" />
        Random Samples
      </h3>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <label for="sample-count" class="text-sm text-text-muted">n =</label>
          <input
            id="sample-count"
            type="number"
            :value="localSampleCount"
            min="10"
            max="10000"
            step="100"
            class="w-24 px-2 py-1 text-sm font-mono rounded border border-border
                   bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="sample-count-input"
            @change="handleCountChange"
          />
        </div>

        <button
          class="px-3 py-1.5 text-sm rounded-lg border border-primary
                 bg-primary text-white hover:bg-primary-hover
                 focus:outline-none focus:ring-2 focus:ring-primary/30
                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!isValid"
          data-testid="generate-samples-btn"
          @click="handleGenerate"
        >
          <i class="fa-solid fa-random mr-1" aria-hidden="true" />
          Generate
        </button>

        <button
          v-if="sampleData.length > 0"
          class="px-3 py-1.5 text-sm rounded-lg border border-border
                 bg-surface-alt hover:border-red-500 hover:text-red-500
                 focus:outline-none focus:ring-2 focus:ring-primary/30
                 transition-colors"
          data-testid="clear-samples-btn"
          @click="handleClear"
        >
          <i class="fa-solid fa-trash mr-1" aria-hidden="true" />
          Clear
        </button>
      </div>
    </div>

    <!-- Histogram Chart -->
    <div v-if="histogramBins.length > 0" class="overflow-x-auto">
      <svg
        :width="svgWidth"
        :height="height"
        :viewBox="`0 0 ${svgWidth} ${height}`"
        class="histogram-svg w-full"
        role="img"
        aria-label="Histogram of random samples"
      >
        <!-- X-axis -->
        <line
          :x1="padding.left"
          :y1="padding.top + chartHeight"
          :x2="padding.left + chartWidth"
          :y2="padding.top + chartHeight"
          class="stroke-text-muted"
          stroke-width="1"
        />

        <!-- Y-axis -->
        <line
          :x1="padding.left"
          :y1="padding.top"
          :x2="padding.left"
          :y2="padding.top + chartHeight"
          class="stroke-text-muted"
          stroke-width="1"
        />

        <!-- Bars -->
        <rect
          v-for="(bin, index) in histogramBins"
          :key="index"
          :x="xToSvg(bin.start)"
          :y="yToSvg(bin.density)"
          :width="Math.max(barWidth, 2)"
          :height="chartHeight - (yToSvg(bin.density) - padding.top)"
          class="fill-emerald-500 hover:fill-emerald-600 transition-colors"
          :data-testid="`sample-bar-${index}`"
        >
          <title>{{ formatValue(bin.start) }} - {{ formatValue(bin.end) }}: {{ bin.count }} samples</title>
        </rect>

        <!-- X-axis labels -->
        <text
          :x="padding.left"
          :y="padding.top + chartHeight + 20"
          class="fill-text-muted text-xs"
          text-anchor="middle"
        >
          {{ formatValue(xRange.min) }}
        </text>
        <text
          :x="padding.left + chartWidth / 2"
          :y="padding.top + chartHeight + 20"
          class="fill-text-muted text-xs"
          text-anchor="middle"
        >
          {{ formatValue((xRange.min + xRange.max) / 2) }}
        </text>
        <text
          :x="padding.left + chartWidth"
          :y="padding.top + chartHeight + 20"
          class="fill-text-muted text-xs"
          text-anchor="middle"
        >
          {{ formatValue(xRange.max) }}
        </text>

        <!-- Y-axis label -->
        <text
          :x="15"
          :y="padding.top + chartHeight / 2"
          class="fill-text-muted text-[10px]"
          text-anchor="middle"
          :transform="`rotate(-90, 15, ${padding.top + chartHeight / 2})`"
        >
          Density
        </text>
      </svg>

      <!-- Sample Stats -->
      <div class="mt-2 flex items-center justify-center gap-6 text-sm text-text-muted">
        <span>
          <strong>{{ sampleData.length }}</strong> samples
        </span>
        <span>
          Mean: <strong class="font-mono">{{ (sampleData.reduce((a, b) => a + b, 0) / sampleData.length).toFixed(3) }}</strong>
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="h-48 flex flex-col items-center justify-center text-text-muted text-sm">
      <i class="fa-solid fa-dice text-3xl mb-3 opacity-50" aria-hidden="true" />
      <p>Click "Generate" to draw random samples</p>
      <p class="text-xs mt-1">from the {{ distributionType }} distribution</p>
    </div>
  </div>
</template>

<style scoped>
.histogram-svg {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
