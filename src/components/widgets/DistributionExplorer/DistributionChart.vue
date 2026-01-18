<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PdfDataPoint } from '@/composables/useDistributionExplorer'

interface Props {
  pdfData: PdfDataPoint[]
  xRange: { min: number; max: number }
  maxPdfValue: number
  isDiscrete: boolean
  height?: number
  showCdf?: boolean
  cdfData?: PdfDataPoint[]
  /** Shaded region for probability visualization */
  shadedRegion?: { start: number; end: number } | null
  /** Stats to display on chart */
  mean?: number
  stdDev?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 280,
  showCdf: false,
  cdfData: () => [],
  shadedRegion: null,
  mean: undefined,
  stdDev: undefined,
})

// SVG dimensions
const svgWidth = 600
const padding = { top: 25, right: 30, bottom: 45, left: 55 }
const chartWidth = svgWidth - padding.left - padding.right
const chartHeight = computed(() => props.height - padding.top - padding.bottom)

// Hover state for discrete bars
const hoveredIndex = ref<number | null>(null)

// Scale helpers
function xToSvg(x: number): number {
  const range = props.xRange.max - props.xRange.min || 1
  return padding.left + ((x - props.xRange.min) / range) * chartWidth
}

function yToSvg(y: number, maxY: number = props.maxPdfValue): number {
  const scale = maxY > 0 ? maxY : 1
  return padding.top + chartHeight.value - (y / scale) * chartHeight.value
}

// Generate SVG path for continuous PDF
const pdfPath = computed(() => {
  if (props.isDiscrete || props.pdfData.length === 0) return ''

  const points = props.pdfData.map((p) => `${xToSvg(p.x)},${yToSvg(p.y)}`)
  return `M ${points.join(' L ')}`
})

// Generate filled area under the curve
const pdfAreaPath = computed(() => {
  if (props.isDiscrete || props.pdfData.length === 0) return ''

  const firstPoint = props.pdfData[0]
  const lastPoint = props.pdfData[props.pdfData.length - 1]
  if (!firstPoint || !lastPoint) return ''

  const baseline = padding.top + chartHeight.value
  const points = props.pdfData.map((p) => `${xToSvg(p.x)},${yToSvg(p.y)}`)

  return `M ${xToSvg(firstPoint.x)},${baseline} L ${points.join(' L ')} L ${xToSvg(lastPoint.x)},${baseline} Z`
})

// Generate shaded region path
const shadedPath = computed(() => {
  if (!props.shadedRegion || props.isDiscrete || props.pdfData.length === 0) return ''

  const { start, end } = props.shadedRegion
  const baseline = padding.top + chartHeight.value

  // Filter points within the shaded region
  const regionPoints = props.pdfData.filter((p) => p.x >= start && p.x <= end)
  if (regionPoints.length === 0) return ''

  // Interpolate start and end points
  const points = regionPoints.map((p) => `${xToSvg(p.x)},${yToSvg(p.y)}`)

  return `M ${xToSvg(start)},${baseline} L ${points.join(' L ')} L ${xToSvg(end)},${baseline} Z`
})

// Generate CDF path
const cdfPath = computed(() => {
  if (!props.showCdf || props.cdfData.length === 0) return ''

  const points = props.cdfData.map((p) => `${xToSvg(p.x)},${yToSvg(p.y, 1)}`)
  return `M ${points.join(' L ')}`
})

// Bar width for discrete distributions
const barWidth = computed(() => {
  if (!props.isDiscrete || props.pdfData.length <= 1) return 20
  return Math.min(30, (chartWidth / props.pdfData.length) * 0.8)
})

// X-axis ticks
const xTicks = computed(() => {
  const { min, max } = props.xRange
  const range = max - min || 1
  const tickCount = 7
  const step = range / tickCount

  const ticks: number[] = []
  for (let i = 0; i <= tickCount; i++) {
    ticks.push(min + i * step)
  }
  return ticks
})

// Y-axis ticks for PDF
const yTicks = computed(() => {
  const maxY = props.maxPdfValue
  if (maxY === 0) return [0]

  const tickCount = 5
  const step = maxY / tickCount
  const ticks: number[] = []
  for (let i = 0; i <= tickCount; i++) {
    ticks.push(i * step)
  }
  return ticks
})

// Format axis values
function formatValue(value: number): string {
  if (Math.abs(value) < 0.001) return '0'
  if (Math.abs(value) >= 100) return value.toFixed(0)
  if (Math.abs(value) >= 1) return value.toFixed(1)
  return value.toFixed(3)
}

function handleBarHover(index: number | null) {
  hoveredIndex.value = index
}
</script>

<template>
  <div class="distribution-chart" data-testid="distribution-chart">
    <div class="overflow-x-auto">
      <svg
        :width="svgWidth"
        :height="height"
        :viewBox="`0 0 ${svgWidth} ${height}`"
        class="distribution-svg w-full"
        role="img"
        :aria-label="isDiscrete ? 'Probability mass function bar chart' : 'Probability density function curve'"
      >
        <!-- Grid lines -->
        <g class="grid-lines" opacity="0.3">
          <line
            v-for="tick in yTicks"
            :key="`grid-y-${tick}`"
            :x1="padding.left"
            :y1="yToSvg(tick)"
            :x2="padding.left + chartWidth"
            :y2="yToSvg(tick)"
            class="stroke-border"
            stroke-width="0.5"
            stroke-dasharray="4 4"
          />
        </g>

        <!-- Shaded region for probability -->
        <path
          v-if="shadedPath"
          :d="shadedPath"
          class="fill-primary/30"
          data-testid="shaded-region"
        />

        <!-- PDF/PMF area fill (continuous only) -->
        <path
          v-if="!isDiscrete && pdfAreaPath"
          :d="pdfAreaPath"
          class="fill-primary/10"
        />

        <!-- PDF/PMF curve (continuous) -->
        <path
          v-if="!isDiscrete && pdfPath"
          :d="pdfPath"
          fill="none"
          class="stroke-primary"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-testid="pdf-curve"
        />

        <!-- PMF bars (discrete) -->
        <g v-if="isDiscrete" class="pmf-bars">
          <rect
            v-for="(point, index) in pdfData"
            :key="index"
            :x="xToSvg(point.x) - barWidth / 2"
            :y="yToSvg(point.y)"
            :width="barWidth"
            :height="chartHeight - (yToSvg(point.y) - padding.top)"
            :class="[
              'transition-colors cursor-pointer',
              hoveredIndex === index ? 'fill-primary-hover' : 'fill-primary',
            ]"
            :data-testid="`pmf-bar-${index}`"
            @mouseenter="handleBarHover(index)"
            @mouseleave="handleBarHover(null)"
          >
            <title>P(X = {{ point.x }}) = {{ formatValue(point.y) }}</title>
          </rect>
        </g>

        <!-- CDF curve (optional) -->
        <path
          v-if="showCdf && cdfPath"
          :d="cdfPath"
          fill="none"
          class="stroke-emerald-500"
          stroke-width="2"
          stroke-dasharray="6 3"
          opacity="0.8"
          data-testid="cdf-curve"
        />

        <!-- Mean line -->
        <line
          v-if="mean !== undefined"
          :x1="xToSvg(mean)"
          :y1="padding.top"
          :x2="xToSvg(mean)"
          :y2="padding.top + chartHeight"
          class="stroke-amber-500"
          stroke-width="2"
          stroke-dasharray="4 4"
          data-testid="mean-line"
        />

        <!-- Mean ± σ region (for normal-like distributions) -->
        <g v-if="mean !== undefined && stdDev !== undefined" opacity="0.5">
          <line
            :x1="xToSvg(mean - stdDev)"
            :y1="padding.top"
            :x2="xToSvg(mean - stdDev)"
            :y2="padding.top + chartHeight"
            class="stroke-amber-400"
            stroke-width="1"
            stroke-dasharray="2 2"
          />
          <line
            :x1="xToSvg(mean + stdDev)"
            :y1="padding.top"
            :x2="xToSvg(mean + stdDev)"
            :y2="padding.top + chartHeight"
            class="stroke-amber-400"
            stroke-width="1"
            stroke-dasharray="2 2"
          />
        </g>

        <!-- X-axis -->
        <line
          :x1="padding.left"
          :y1="padding.top + chartHeight"
          :x2="padding.left + chartWidth"
          :y2="padding.top + chartHeight"
          class="stroke-text-muted"
          stroke-width="1"
          data-testid="x-axis"
        />

        <!-- Y-axis -->
        <line
          :x1="padding.left"
          :y1="padding.top"
          :x2="padding.left"
          :y2="padding.top + chartHeight"
          class="stroke-text-muted"
          stroke-width="1"
          data-testid="y-axis"
        />

        <!-- X-axis ticks and labels -->
        <g class="x-ticks">
          <g v-for="tick in xTicks" :key="`x-${tick}`">
            <line
              :x1="xToSvg(tick)"
              :y1="padding.top + chartHeight"
              :x2="xToSvg(tick)"
              :y2="padding.top + chartHeight + 5"
              class="stroke-text-muted"
              stroke-width="1"
            />
            <text
              :x="xToSvg(tick)"
              :y="padding.top + chartHeight + 20"
              class="fill-text-muted text-xs"
              text-anchor="middle"
            >
              {{ formatValue(tick) }}
            </text>
          </g>
        </g>

        <!-- Y-axis ticks and labels -->
        <g class="y-ticks">
          <g v-for="tick in yTicks" :key="`y-${tick}`">
            <line
              :x1="padding.left - 5"
              :y1="yToSvg(tick)"
              :x2="padding.left"
              :y2="yToSvg(tick)"
              class="stroke-text-muted"
              stroke-width="1"
            />
            <text
              :x="padding.left - 10"
              :y="yToSvg(tick) + 4"
              class="fill-text-muted text-xs"
              text-anchor="end"
            >
              {{ formatValue(tick) }}
            </text>
          </g>
        </g>

        <!-- Axis labels -->
        <text
          :x="padding.left + chartWidth / 2"
          :y="height - 5"
          class="fill-text-muted text-xs"
          text-anchor="middle"
        >
          x
        </text>

        <text
          :x="15"
          :y="padding.top + chartHeight / 2"
          class="fill-text-muted text-xs"
          text-anchor="middle"
          :transform="`rotate(-90, 15, ${padding.top + chartHeight / 2})`"
        >
          {{ isDiscrete ? 'P(X = x)' : 'f(x)' }}
        </text>

        <!-- Legend -->
        <g :transform="`translate(${padding.left + chartWidth - 100}, ${padding.top + 5})`">
          <g v-if="mean !== undefined">
            <line x1="0" y1="5" x2="15" y2="5" class="stroke-amber-500" stroke-width="2" stroke-dasharray="4 4" />
            <text x="20" y="9" class="fill-text-muted text-[10px]">μ = {{ formatValue(mean) }}</text>
          </g>
          <g v-if="showCdf" :transform="mean !== undefined ? 'translate(0, 15)' : ''">
            <line x1="0" y1="5" x2="15" y2="5" class="stroke-emerald-500" stroke-width="2" stroke-dasharray="6 3" />
            <text x="20" y="9" class="fill-text-muted text-[10px]">CDF</text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.distribution-svg {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
