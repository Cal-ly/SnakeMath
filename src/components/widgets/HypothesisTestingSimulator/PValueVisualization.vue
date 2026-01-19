<script setup lang="ts">
import { computed } from 'vue'
import type { DistributionCurvePoint } from '@/composables/useHypothesisTesting'
import type { AlternativeHypothesis } from '@/composables/useHypothesisTesting'

interface Props {
  curve: DistributionCurvePoint[]
  testStatistic: number
  criticalValues: { lower: number | null; upper: number | null }
  alternative: AlternativeHypothesis
  pValue: number
  rejectNull: boolean
  isTTest: boolean
  degreesOfFreedom: number | null
}

const props = defineProps<Props>()

// SVG dimensions
const width = 400
const height = 200
const padding = { top: 20, right: 30, bottom: 40, left: 40 }
const chartWidth = width - padding.left - padding.right
const chartHeight = height - padding.top - padding.bottom

// Scale functions
const xMin = -4
const xMax = 4

const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * chartWidth + padding.left
const yScale = (y: number, maxY: number) => padding.top + chartHeight - (y / maxY) * chartHeight

// Computed SVG elements
const maxY = computed(() => {
  if (props.curve.length === 0) return 0.4
  return Math.max(...props.curve.map((p) => p.y)) * 1.1
})

const curvePath = computed(() => {
  if (props.curve.length === 0) return ''

  return props.curve
    .map((point, i) => {
      const x = xScale(point.x)
      const y = yScale(point.y, maxY.value)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
})

// Rejection region paths (shaded areas under the curve)
const rejectionRegionPaths = computed(() => {
  const paths: { path: string; side: 'left' | 'right' }[] = []

  if (props.alternative === 'two-sided' || props.alternative === 'less') {
    const critLower = props.criticalValues.lower ?? -4
    const leftPoints = props.curve.filter((p) => p.x <= critLower)
    if (leftPoints.length > 0) {
      const pathD =
        `M ${xScale(leftPoints[0]!.x)} ${yScale(0, maxY.value)} ` +
        leftPoints.map((p) => `L ${xScale(p.x)} ${yScale(p.y, maxY.value)}`).join(' ') +
        ` L ${xScale(leftPoints[leftPoints.length - 1]!.x)} ${yScale(0, maxY.value)} Z`
      paths.push({ path: pathD, side: 'left' })
    }
  }

  if (props.alternative === 'two-sided' || props.alternative === 'greater') {
    const critUpper = props.criticalValues.upper ?? 4
    const rightPoints = props.curve.filter((p) => p.x >= critUpper)
    if (rightPoints.length > 0) {
      const pathD =
        `M ${xScale(rightPoints[0]!.x)} ${yScale(0, maxY.value)} ` +
        rightPoints.map((p) => `L ${xScale(p.x)} ${yScale(p.y, maxY.value)}`).join(' ') +
        ` L ${xScale(rightPoints[rightPoints.length - 1]!.x)} ${yScale(0, maxY.value)} Z`
      paths.push({ path: pathD, side: 'right' })
    }
  }

  return paths
})

// Observed value shading (p-value area)
const observedValuePath = computed(() => {
  const t = props.testStatistic

  if (props.alternative === 'two-sided') {
    // Shade both tails beyond |t|
    const absT = Math.abs(t)
    const leftPoints = props.curve.filter((p) => p.x <= -absT)
    const rightPoints = props.curve.filter((p) => p.x >= absT)

    let path = ''
    if (leftPoints.length > 0) {
      path +=
        `M ${xScale(leftPoints[0]!.x)} ${yScale(0, maxY.value)} ` +
        leftPoints.map((p) => `L ${xScale(p.x)} ${yScale(p.y, maxY.value)}`).join(' ') +
        ` L ${xScale(leftPoints[leftPoints.length - 1]!.x)} ${yScale(0, maxY.value)} Z `
    }
    if (rightPoints.length > 0) {
      path +=
        `M ${xScale(rightPoints[0]!.x)} ${yScale(0, maxY.value)} ` +
        rightPoints.map((p) => `L ${xScale(p.x)} ${yScale(p.y, maxY.value)}`).join(' ') +
        ` L ${xScale(rightPoints[rightPoints.length - 1]!.x)} ${yScale(0, maxY.value)} Z`
    }
    return path
  } else if (props.alternative === 'less') {
    const leftPoints = props.curve.filter((p) => p.x <= t)
    if (leftPoints.length === 0) return ''
    return (
      `M ${xScale(leftPoints[0]!.x)} ${yScale(0, maxY.value)} ` +
      leftPoints.map((p) => `L ${xScale(p.x)} ${yScale(p.y, maxY.value)}`).join(' ') +
      ` L ${xScale(leftPoints[leftPoints.length - 1]!.x)} ${yScale(0, maxY.value)} Z`
    )
  } else {
    const rightPoints = props.curve.filter((p) => p.x >= t)
    if (rightPoints.length === 0) return ''
    return (
      `M ${xScale(rightPoints[0]!.x)} ${yScale(0, maxY.value)} ` +
      rightPoints.map((p) => `L ${xScale(p.x)} ${yScale(p.y, maxY.value)}`).join(' ') +
      ` L ${xScale(rightPoints[rightPoints.length - 1]!.x)} ${yScale(0, maxY.value)} Z`
    )
  }
})

// Test statistic line position
const testStatisticX = computed(() => {
  const clampedT = Math.max(xMin, Math.min(xMax, props.testStatistic))
  return xScale(clampedT)
})

// Critical value lines
const criticalLines = computed(() => {
  const lines: { x: number; label: string }[] = []
  if (props.criticalValues.lower !== null) {
    lines.push({
      x: xScale(Math.max(xMin, props.criticalValues.lower)),
      label: props.criticalValues.lower.toFixed(2),
    })
  }
  if (props.criticalValues.upper !== null) {
    lines.push({
      x: xScale(Math.min(xMax, props.criticalValues.upper)),
      label: props.criticalValues.upper.toFixed(2),
    })
  }
  return lines
})

// X-axis ticks
const xTicks = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-lg font-semibold text-text-primary">
      {{ isTTest ? 't' : 'z' }}-Distribution
      <span v-if="isTTest && degreesOfFreedom" class="text-sm font-normal text-text-muted">
        (df = {{ degreesOfFreedom.toFixed(1) }})
      </span>
    </h3>

    <svg
      :viewBox="`0 0 ${width} ${height}`"
      class="w-full"
      role="img"
      :aria-label="`${isTTest ? 't' : 'z'}-distribution with p-value visualization`"
    >
      <!-- Rejection regions (alpha level) -->
      <path
        v-for="(region, index) in rejectionRegionPaths"
        :key="`region-${index}`"
        :d="region.path"
        class="fill-red-500/20"
      />

      <!-- P-value shading (observed) -->
      <path
        v-if="observedValuePath"
        :d="observedValuePath"
        :class="rejectNull ? 'fill-emerald-500/40' : 'fill-amber-500/40'"
      />

      <!-- Distribution curve -->
      <path :d="curvePath" fill="none" stroke="currentColor" stroke-width="2" class="text-accent-primary" />

      <!-- X-axis -->
      <line
        :x1="padding.left"
        :y1="padding.top + chartHeight"
        :x2="padding.left + chartWidth"
        :y2="padding.top + chartHeight"
        stroke="currentColor"
        class="text-border-primary"
      />

      <!-- X-axis ticks -->
      <g v-for="tick in xTicks" :key="tick">
        <line
          :x1="xScale(tick)"
          :y1="padding.top + chartHeight"
          :x2="xScale(tick)"
          :y2="padding.top + chartHeight + 5"
          stroke="currentColor"
          class="text-border-primary"
        />
        <text
          :x="xScale(tick)"
          :y="padding.top + chartHeight + 18"
          text-anchor="middle"
          class="text-xs fill-text-muted"
        >
          {{ tick }}
        </text>
      </g>

      <!-- Critical value lines -->
      <g v-for="(line, index) in criticalLines" :key="`crit-${index}`">
        <line
          :x1="line.x"
          :y1="padding.top"
          :x2="line.x"
          :y2="padding.top + chartHeight"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-dasharray="4 2"
          class="text-red-500"
        />
        <text
          :x="line.x"
          :y="padding.top - 5"
          text-anchor="middle"
          class="text-xs fill-red-500"
        >
          {{ line.label }}
        </text>
      </g>

      <!-- Test statistic line -->
      <line
        :x1="testStatisticX"
        :y1="padding.top"
        :x2="testStatisticX"
        :y2="padding.top + chartHeight"
        stroke="currentColor"
        stroke-width="2"
        :class="rejectNull ? 'text-emerald-500' : 'text-amber-500'"
      />

      <!-- Test statistic label -->
      <text
        :x="testStatisticX"
        :y="padding.top + chartHeight + 32"
        text-anchor="middle"
        :class="['text-sm font-bold', rejectNull ? 'fill-emerald-500' : 'fill-amber-500']"
      >
        {{ isTTest ? 't' : 'z' }} = {{ testStatistic.toFixed(2) }}
      </text>

      <!-- Y-axis label -->
      <text
        :x="12"
        :y="padding.top + chartHeight / 2"
        text-anchor="middle"
        transform="rotate(-90, 12, 110)"
        class="text-xs fill-text-muted"
      >
        Density
      </text>
    </svg>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 text-sm text-text-secondary">
      <div class="flex items-center gap-2">
        <span class="w-4 h-3 bg-red-500/20 rounded"></span>
        <span>Rejection region (α)</span>
      </div>
      <div class="flex items-center gap-2">
        <span :class="['w-4 h-3 rounded', rejectNull ? 'bg-emerald-500/40' : 'bg-amber-500/40']"></span>
        <span>p-value = {{ pValue.toFixed(4) }}</span>
      </div>
    </div>
  </div>
</template>
