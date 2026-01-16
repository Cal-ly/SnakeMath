<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Minimum x value */
  xMin: number
  /** Maximum x value */
  xMax: number
  /** Minimum y value */
  yMin: number
  /** Maximum y value */
  yMax: number
  /** SVG width in pixels */
  width?: number
  /** SVG height in pixels */
  height?: number
  /** Show grid lines */
  showGrid?: boolean
  /** Grid line spacing */
  gridStep?: number
  /** Show numeric labels on axes */
  showAxisLabels?: boolean
  /** Show arrow heads on axes */
  showArrows?: boolean
  /** Accessibility label */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 400,
  showGrid: true,
  gridStep: 1,
  showAxisLabels: true,
  showArrows: true,
  ariaLabel: 'Coordinate system graph',
})

// Padding for labels and arrows
const padding = 30

// Calculate viewable area dimensions
const viewWidth = computed(() => props.width - padding * 2)
const viewHeight = computed(() => props.height - padding * 2)

// Calculate data ranges
const xRange = computed(() => props.xMax - props.xMin)
const yRange = computed(() => props.yMax - props.yMin)

// Coordinate transformation functions
function toSvgX(dataX: number): number {
  return padding + ((dataX - props.xMin) / xRange.value) * viewWidth.value
}

function toSvgY(dataY: number): number {
  // SVG Y is inverted (0 at top)
  return padding + ((props.yMax - dataY) / yRange.value) * viewHeight.value
}

function toDataX(svgX: number): number {
  return props.xMin + ((svgX - padding) / viewWidth.value) * xRange.value
}

function toDataY(svgY: number): number {
  return props.yMax - ((svgY - padding) / viewHeight.value) * yRange.value
}

// Origin position in SVG coordinates
const originX = computed(() => toSvgX(0))
const originY = computed(() => toSvgY(0))

// Check if origin is visible
const originInView = computed(() => {
  return props.xMin <= 0 && props.xMax >= 0 && props.yMin <= 0 && props.yMax >= 0
})

// X-axis position (at y=0 if visible, otherwise at edge)
const xAxisY = computed(() => {
  if (props.yMin > 0) return toSvgY(props.yMin) // Y range is positive, axis at bottom
  if (props.yMax < 0) return toSvgY(props.yMax) // Y range is negative, axis at top
  return toSvgY(0) // Y=0 is visible
})

// Y-axis position (at x=0 if visible, otherwise at edge)
const yAxisX = computed(() => {
  if (props.xMin > 0) return toSvgX(props.xMin) // X range is positive, axis at left
  if (props.xMax < 0) return toSvgX(props.xMax) // X range is negative, axis at right
  return toSvgX(0) // X=0 is visible
})

// Generate grid lines
const gridLinesX = computed(() => {
  const lines: number[] = []
  const step = props.gridStep
  // Start from a multiple of step
  const start = Math.ceil(props.xMin / step) * step
  for (let x = start; x <= props.xMax; x += step) {
    if (Math.abs(x) > 0.0001) {
      // Skip origin line (axis)
      lines.push(x)
    }
  }
  return lines
})

const gridLinesY = computed(() => {
  const lines: number[] = []
  const step = props.gridStep
  const start = Math.ceil(props.yMin / step) * step
  for (let y = start; y <= props.yMax; y += step) {
    if (Math.abs(y) > 0.0001) {
      // Skip origin line (axis)
      lines.push(y)
    }
  }
  return lines
})

// Generate axis labels
const xLabels = computed(() => {
  const labels: { value: number; x: number; y: number }[] = []
  const step = props.gridStep
  const start = Math.ceil(props.xMin / step) * step
  for (let x = start; x <= props.xMax; x += step) {
    if (Math.abs(x) > 0.0001) {
      // Skip 0
      labels.push({
        value: x,
        x: toSvgX(x),
        y: xAxisY.value + 15,
      })
    }
  }
  return labels
})

const yLabels = computed(() => {
  const labels: { value: number; x: number; y: number }[] = []
  const step = props.gridStep
  const start = Math.ceil(props.yMin / step) * step
  for (let y = start; y <= props.yMax; y += step) {
    if (Math.abs(y) > 0.0001) {
      // Skip 0
      labels.push({
        value: y,
        x: yAxisX.value - 8,
        y: toSvgY(y) + 4,
      })
    }
  }
  return labels
})

// Format label value (remove unnecessary decimals)
function formatLabel(value: number): string {
  if (Number.isInteger(value)) return value.toString()
  return value.toFixed(1)
}
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    :aria-label="ariaLabel"
    role="img"
    class="coordinate-system"
  >
    <!-- Grid lines -->
    <g v-if="showGrid" class="grid-lines">
      <!-- Vertical grid lines -->
      <line
        v-for="x in gridLinesX"
        :key="`grid-x-${x}`"
        :x1="toSvgX(x)"
        :y1="padding"
        :x2="toSvgX(x)"
        :y2="height - padding"
        class="stroke-border"
        stroke-width="0.5"
      />
      <!-- Horizontal grid lines -->
      <line
        v-for="y in gridLinesY"
        :key="`grid-y-${y}`"
        :x1="padding"
        :y1="toSvgY(y)"
        :x2="width - padding"
        :y2="toSvgY(y)"
        class="stroke-border"
        stroke-width="0.5"
      />
    </g>

    <!-- Axes -->
    <g class="axes">
      <!-- X-axis -->
      <line
        :x1="padding"
        :y1="xAxisY"
        :x2="width - padding"
        :y2="xAxisY"
        class="stroke-text-secondary"
        stroke-width="1.5"
      />
      <!-- Y-axis -->
      <line
        :x1="yAxisX"
        :y1="padding"
        :x2="yAxisX"
        :y2="height - padding"
        class="stroke-text-secondary"
        stroke-width="1.5"
      />

      <!-- Arrow heads -->
      <g v-if="showArrows">
        <!-- X-axis arrow (right) -->
        <polygon
          :points="`${width - padding},${xAxisY} ${width - padding - 8},${xAxisY - 4} ${width - padding - 8},${xAxisY + 4}`"
          class="fill-text-secondary"
        />
        <!-- Y-axis arrow (up) -->
        <polygon
          :points="`${yAxisX},${padding} ${yAxisX - 4},${padding + 8} ${yAxisX + 4},${padding + 8}`"
          class="fill-text-secondary"
        />
      </g>
    </g>

    <!-- Origin marker -->
    <circle
      v-if="originInView"
      :cx="originX"
      :cy="originY"
      r="3"
      class="fill-text-secondary"
    />

    <!-- Axis labels -->
    <g v-if="showAxisLabels" class="axis-labels">
      <!-- X-axis labels -->
      <text
        v-for="label in xLabels"
        :key="`label-x-${label.value}`"
        :x="label.x"
        :y="label.y"
        text-anchor="middle"
        class="fill-text-muted text-[10px]"
      >
        {{ formatLabel(label.value) }}
      </text>
      <!-- Y-axis labels -->
      <text
        v-for="label in yLabels"
        :key="`label-y-${label.value}`"
        :x="label.x"
        :y="label.y"
        text-anchor="end"
        class="fill-text-muted text-[10px]"
      >
        {{ formatLabel(label.value) }}
      </text>
    </g>

    <!-- Default slot for plotted content -->
    <slot :to-svg-x="toSvgX" :to-svg-y="toSvgY" :to-data-x="toDataX" :to-data-y="toDataY" />
  </svg>
</template>

<style scoped>
.coordinate-system {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
