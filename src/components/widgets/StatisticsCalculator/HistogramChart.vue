<script setup lang="ts">
import { computed } from 'vue'
import { formatStatValue } from '@/utils/math/statistics'
import type { HistogramData } from '@/utils/math/statistics'

interface Props {
  histogramData: HistogramData | null
  binCount: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 250,
})

const emit = defineEmits<{
  'update:binCount': [count: number]
}>()

// SVG dimensions
const svgWidth = 600
const padding = { top: 20, right: 20, bottom: 50, left: 50 }
const chartWidth = svgWidth - padding.left - padding.right
const chartHeight = computed(() => props.height - padding.top - padding.bottom)

// Calculate scales based on data
const maxCount = computed(() => {
  if (!props.histogramData) return 1
  return Math.max(...props.histogramData.bins.map((b) => b.count), 1)
})

const xScale = computed(() => {
  if (!props.histogramData || props.histogramData.bins.length === 0) {
    return { min: 0, max: 1, range: 1 }
  }
  const bins = props.histogramData.bins
  const min = bins[0]!.binStart
  const max = bins[bins.length - 1]!.binEnd
  return { min, max, range: max - min || 1 }
})

// Transform data value to SVG x coordinate
function xToSvg(value: number): number {
  return padding.left + ((value - xScale.value.min) / xScale.value.range) * chartWidth
}

// Transform count to SVG y coordinate (inverted)
function yToSvg(count: number): number {
  return padding.top + chartHeight.value - (count / maxCount.value) * chartHeight.value
}

// Bar width based on bin width
const barWidth = computed(() => {
  if (!props.histogramData) return 0
  return chartWidth / props.histogramData.bins.length - 2 // 2px gap
})

// Y-axis tick values
const yTicks = computed(() => {
  const ticks: number[] = []
  const step = Math.ceil(maxCount.value / 5)
  for (let i = 0; i <= maxCount.value; i += step) {
    ticks.push(i)
  }
  if (ticks[ticks.length - 1] !== maxCount.value) {
    ticks.push(maxCount.value)
  }
  return ticks
})

function handleBinCountChange(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value, 10)
  if (!isNaN(value)) {
    emit('update:binCount', value)
  }
}
</script>

<template>
  <div class="histogram-chart" data-testid="histogram-chart">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide">
        <i class="fa-solid fa-chart-bar mr-2" aria-hidden="true" />
        Histogram
      </h3>

      <div class="flex items-center gap-2">
        <label for="bin-count" class="text-sm text-text-muted">Bins:</label>
        <input
          id="bin-count"
          type="range"
          min="3"
          max="20"
          :value="binCount"
          data-testid="bin-count-slider"
          class="w-24 accent-primary"
          @input="handleBinCountChange"
        />
        <span class="text-sm font-mono text-text-primary w-6 text-right" data-testid="bin-count-value">
          {{ binCount }}
        </span>
      </div>
    </div>

    <div v-if="histogramData && histogramData.bins.length > 0" class="overflow-x-auto">
      <svg
        :width="svgWidth"
        :height="height"
        :viewBox="`0 0 ${svgWidth} ${height}`"
        class="histogram-svg w-full"
        aria-label="Histogram showing frequency distribution"
        role="img"
      >
        <!-- Y-axis -->
        <line
          :x1="padding.left"
          :y1="padding.top"
          :x2="padding.left"
          :y2="padding.top + chartHeight"
          class="stroke-border"
          stroke-width="1"
          data-testid="histogram-y-axis"
        />

        <!-- X-axis -->
        <line
          :x1="padding.left"
          :y1="padding.top + chartHeight"
          :x2="padding.left + chartWidth"
          :y2="padding.top + chartHeight"
          class="stroke-border"
          stroke-width="1"
          data-testid="histogram-x-axis"
        />

        <!-- Y-axis ticks and labels -->
        <g v-for="tick in yTicks" :key="`y-${tick}`" class="y-tick">
          <line
            :x1="padding.left - 5"
            :y1="yToSvg(tick)"
            :x2="padding.left"
            :y2="yToSvg(tick)"
            class="stroke-border"
            stroke-width="1"
          />
          <text
            :x="padding.left - 10"
            :y="yToSvg(tick) + 4"
            class="fill-text-muted text-xs"
            text-anchor="end"
          >
            {{ tick }}
          </text>
          <!-- Grid line -->
          <line
            :x1="padding.left"
            :y1="yToSvg(tick)"
            :x2="padding.left + chartWidth"
            :y2="yToSvg(tick)"
            class="stroke-border"
            stroke-width="0.5"
            stroke-dasharray="4 4"
            opacity="0.3"
          />
        </g>

        <!-- Y-axis label -->
        <text
          :x="15"
          :y="padding.top + chartHeight / 2"
          class="fill-text-muted text-xs"
          text-anchor="middle"
          transform="rotate(-90, 15, 135)"
        >
          Frequency
        </text>

        <!-- Bars -->
        <g class="bars">
          <rect
            v-for="(bin, index) in histogramData.bins"
            :key="index"
            :x="xToSvg(bin.binStart) + 1"
            :y="yToSvg(bin.count)"
            :width="Math.max(barWidth, 1)"
            :height="chartHeight - (yToSvg(bin.count) - padding.top)"
            class="fill-primary hover:fill-primary-hover transition-colors cursor-pointer"
            :data-testid="`histogram-bar-${index}`"
            :aria-label="`Bin ${bin.label}: ${bin.count} values`"
          >
            <title>{{ bin.label }}: {{ bin.count }} ({{ (bin.frequency * 100).toFixed(1) }}%)</title>
          </rect>
        </g>

        <!-- X-axis labels (show every nth label based on bin count) -->
        <g class="x-labels">
          <template v-for="(bin, index) in histogramData.bins" :key="`x-${index}`">
            <text
              v-if="index === 0 || index === histogramData.bins.length - 1 || index % Math.ceil(binCount / 5) === 0"
              :x="xToSvg(bin.binStart)"
              :y="padding.top + chartHeight + 20"
              class="fill-text-muted text-[10px]"
              text-anchor="middle"
            >
              {{ formatStatValue(bin.binStart, 0) }}
            </text>
          </template>
          <!-- Last bin end label -->
          <text
            :x="xToSvg(histogramData.bins[histogramData.bins.length - 1]!.binEnd)"
            :y="padding.top + chartHeight + 20"
            class="fill-text-muted text-[10px]"
            text-anchor="middle"
          >
            {{ formatStatValue(histogramData.bins[histogramData.bins.length - 1]!.binEnd, 0) }}
          </text>
        </g>

        <!-- X-axis label -->
        <text
          :x="padding.left + chartWidth / 2"
          :y="height - 5"
          class="fill-text-muted text-xs"
          text-anchor="middle"
        >
          Value
        </text>
      </svg>
    </div>

    <div v-else class="h-48 flex items-center justify-center text-text-muted text-sm">
      No data to display
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
