<script setup lang="ts">
/**
 * DerivativeCanvas - SVG canvas for function curve, tangent line, and secant line
 *
 * Renders:
 * - Coordinate axes with grid
 * - Function curve f(x) in emerald
 * - Derivative curve f'(x) in purple (optional)
 * - Tangent line at selected point in blue
 * - Secant line in amber (optional)
 * - Point of tangency marker
 */

import { computed, ref } from 'vue'
import type { DerivativeFunctionPreset, TangentLine, SecantLine } from '@/types/math'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  functionPoints: Array<{ x: number; y: number }>
  derivativePoints: Array<{ x: number; y: number }>
  pointX: number
  viewDomain: { min: number; max: number }
  tangentLine: TangentLine | null
  secantLine: SecantLine | null
  showSecant?: boolean
  showDerivativeCurve?: boolean
  preset?: DerivativeFunctionPreset
}

const props = withDefaults(defineProps<Props>(), {
  showSecant: false,
  showDerivativeCurve: false,
  preset: undefined,
})

const emit = defineEmits<{
  'update:pointX': [value: number]
}>()

// ============================================================================
// Canvas Configuration
// ============================================================================

const width = 400
const height = 300
const padding = { top: 20, right: 20, bottom: 30, left: 40 }

const plotWidth = width - padding.left - padding.right
const plotHeight = height - padding.top - padding.bottom

// ============================================================================
// Scales and Transforms
// ============================================================================

/**
 * Y-axis domain based on function values
 */
const yDomain = computed(() => {
  // Combine function and derivative points if derivative curve is shown
  let allPoints = props.functionPoints
  if (props.showDerivativeCurve) {
    allPoints = [...allPoints, ...props.derivativePoints]
  }

  const validY = allPoints.map((p) => p.y).filter((y) => isFinite(y) && Math.abs(y) < 100)

  if (validY.length === 0) return { min: -5, max: 5 }

  const minY = Math.min(...validY)
  const maxY = Math.max(...validY)
  const range = maxY - minY || 1
  const padAmount = range * 0.15

  return {
    min: Math.floor(minY - padAmount),
    max: Math.ceil(maxY + padAmount),
  }
})

/**
 * Convert data x to SVG x
 */
function xScale(x: number): number {
  const { min, max } = props.viewDomain
  return padding.left + ((x - min) / (max - min)) * plotWidth
}

/**
 * Convert data y to SVG y
 */
function yScale(y: number): number {
  const { min, max } = yDomain.value
  return padding.top + plotHeight - ((y - min) / (max - min)) * plotHeight
}

/**
 * Convert SVG x to data x
 */
function xScaleInverse(svgX: number): number {
  const { min, max } = props.viewDomain
  return min + ((svgX - padding.left) / plotWidth) * (max - min)
}

// ============================================================================
// Path Generation
// ============================================================================

/**
 * Generate SVG path from points, handling NaN values
 */
function generatePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return ''

  let path = ''
  let inPath = false

  for (const point of points) {
    const { x, y } = point

    // Skip NaN or out-of-range values
    if (!isFinite(y) || y < yDomain.value.min - 10 || y > yDomain.value.max + 10) {
      inPath = false
      continue
    }

    const sx = xScale(x)
    const sy = yScale(y)

    // Clamp to visible area
    if (sy < padding.top - 5 || sy > height - padding.bottom + 5) {
      inPath = false
      continue
    }

    if (!inPath) {
      path += `M ${sx} ${sy} `
      inPath = true
    } else {
      path += `L ${sx} ${sy} `
    }
  }

  return path
}

const functionPath = computed(() => generatePath(props.functionPoints))
const derivativePath = computed(() => generatePath(props.derivativePoints))

// ============================================================================
// Axis Generation
// ============================================================================

const xTicks = computed(() => {
  const { min, max } = props.viewDomain
  const step = Math.ceil((max - min) / 6)
  const ticks: number[] = []

  for (let x = Math.ceil(min); x <= max; x += step) {
    ticks.push(x)
  }

  return ticks
})

const yTicks = computed(() => {
  const { min, max } = yDomain.value
  const step = Math.ceil((max - min) / 5)
  const ticks: number[] = []

  for (let y = Math.ceil(min); y <= max; y += step) {
    ticks.push(y)
  }

  return ticks
})

// ============================================================================
// Point and Line Calculations
// ============================================================================

const pointSvgX = computed(() => xScale(props.pointX))

const pointOnCurve = computed(() => {
  if (!props.tangentLine) return null
  return {
    svgX: xScale(props.tangentLine.point.x),
    svgY: yScale(props.tangentLine.point.y),
  }
})

/**
 * Calculate tangent line endpoints within the view
 */
const tangentLineCoords = computed(() => {
  if (!props.tangentLine) return null

  const { slope, yIntercept } = props.tangentLine
  const { min, max } = props.viewDomain

  // Calculate y values at domain edges
  const y1 = slope * min + yIntercept
  const y2 = slope * max + yIntercept

  return {
    x1: xScale(min),
    y1: yScale(y1),
    x2: xScale(max),
    y2: yScale(y2),
  }
})

/**
 * Calculate secant line endpoints
 */
const secantLineCoords = computed(() => {
  if (!props.secantLine || !props.showSecant) return null

  const { point1, point2, slope } = props.secantLine

  // Extend the secant line beyond the two points
  const { min, max } = props.viewDomain
  const yIntercept = point1.y - slope * point1.x

  const y1 = slope * min + yIntercept
  const y2 = slope * max + yIntercept

  return {
    x1: xScale(min),
    y1: yScale(y1),
    x2: xScale(max),
    y2: yScale(y2),
    // The actual secant points for markers
    p1: { x: xScale(point1.x), y: yScale(point1.y) },
    p2: { x: xScale(point2.x), y: yScale(point2.y) },
  }
})

// ============================================================================
// Interaction
// ============================================================================

const isDragging = ref(false)
const canvasRef = ref<SVGSVGElement | null>(null)

function handleMouseDown(event: MouseEvent): void {
  isDragging.value = true
  updatePointFromMouse(event)
}

function handleMouseMove(event: MouseEvent): void {
  if (!isDragging.value) return
  updatePointFromMouse(event)
}

function handleMouseUp(): void {
  isDragging.value = false
}

function updatePointFromMouse(event: MouseEvent): void {
  if (!canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const svgX = event.clientX - rect.left
  const dataX = xScaleInverse(svgX)

  // Clamp to domain with small margin
  const { min, max } = props.viewDomain
  const clampedX = Math.max(min + 0.1, Math.min(max - 0.1, dataX))

  // Round to 2 decimal places
  const roundedX = Math.round(clampedX * 100) / 100

  emit('update:pointX', roundedX)
}
</script>

<template>
  <div class="derivative-canvas-container">
    <svg
      ref="canvasRef"
      :viewBox="`0 0 ${width} ${height}`"
      class="w-full h-auto bg-white dark:bg-gray-900 rounded-lg border border-border"
      role="img"
      :aria-label="`Graph of ${preset?.name || 'function'} with tangent line at x = ${pointX}`"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <!-- Grid lines -->
      <g class="grid-lines">
        <line
          v-for="x in xTicks"
          :key="`vgrid-${x}`"
          :x1="xScale(x)"
          :y1="padding.top"
          :x2="xScale(x)"
          :y2="height - padding.bottom"
          stroke="currentColor"
          class="text-gray-200 dark:text-gray-700"
          stroke-width="1"
        />
        <line
          v-for="y in yTicks"
          :key="`hgrid-${y}`"
          :x1="padding.left"
          :y1="yScale(y)"
          :x2="width - padding.right"
          :y2="yScale(y)"
          stroke="currentColor"
          class="text-gray-200 dark:text-gray-700"
          stroke-width="1"
        />
      </g>

      <!-- Axes -->
      <g class="axes">
        <line
          :x1="padding.left"
          :y1="yScale(0)"
          :x2="width - padding.right"
          :y2="yScale(0)"
          stroke="currentColor"
          class="text-gray-400"
          stroke-width="1.5"
        />
        <line
          :x1="xScale(0)"
          :y1="padding.top"
          :x2="xScale(0)"
          :y2="height - padding.bottom"
          stroke="currentColor"
          class="text-gray-400"
          stroke-width="1.5"
        />
      </g>

      <!-- Axis labels -->
      <g class="axis-labels text-xs fill-current text-gray-500">
        <text
          v-for="x in xTicks"
          :key="`xlabel-${x}`"
          :x="xScale(x)"
          :y="height - padding.bottom + 15"
          text-anchor="middle"
        >
          {{ x }}
        </text>
        <text
          v-for="y in yTicks"
          :key="`ylabel-${y}`"
          :x="padding.left - 8"
          :y="yScale(y) + 4"
          text-anchor="end"
        >
          {{ y }}
        </text>
      </g>

      <!-- Secant line (behind tangent) -->
      <g v-if="secantLineCoords" class="secant-line">
        <line
          :x1="secantLineCoords.x1"
          :y1="secantLineCoords.y1"
          :x2="secantLineCoords.x2"
          :y2="secantLineCoords.y2"
          stroke="currentColor"
          class="text-amber-500"
          stroke-width="2"
          stroke-dasharray="6,4"
          opacity="0.8"
        />
        <!-- Secant point markers -->
        <circle
          :cx="secantLineCoords.p1.x"
          :cy="secantLineCoords.p1.y"
          r="4"
          fill="currentColor"
          class="text-amber-500"
        />
        <circle
          :cx="secantLineCoords.p2.x"
          :cy="secantLineCoords.p2.y"
          r="4"
          fill="currentColor"
          class="text-amber-500"
        />
      </g>

      <!-- Tangent line -->
      <line
        v-if="tangentLineCoords"
        :x1="tangentLineCoords.x1"
        :y1="tangentLineCoords.y1"
        :x2="tangentLineCoords.x2"
        :y2="tangentLineCoords.y2"
        stroke="currentColor"
        class="text-blue-500"
        stroke-width="2"
      />

      <!-- Derivative curve (optional) -->
      <path
        v-if="showDerivativeCurve && derivativePath"
        :d="derivativePath"
        fill="none"
        stroke="currentColor"
        class="text-purple-500"
        stroke-width="2"
        stroke-dasharray="4,2"
        opacity="0.7"
      />

      <!-- Function curve -->
      <path
        :d="functionPath"
        fill="none"
        stroke="currentColor"
        class="text-emerald-600 dark:text-emerald-400"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Point of tangency vertical line -->
      <line
        :x1="pointSvgX"
        :y1="padding.top"
        :x2="pointSvgX"
        :y2="height - padding.bottom"
        stroke="currentColor"
        class="text-red-300"
        stroke-width="1"
        stroke-dasharray="3,3"
        opacity="0.6"
      />

      <!-- Point on curve marker -->
      <circle
        v-if="pointOnCurve"
        :cx="pointOnCurve.svgX"
        :cy="pointOnCurve.svgY"
        r="6"
        fill="currentColor"
        class="text-red-500 cursor-ew-resize"
        stroke="white"
        stroke-width="2"
      />

      <!-- Legend -->
      <g class="legend text-xs" transform="translate(50, 12)">
        <g transform="translate(0, 0)">
          <line x1="0" y1="0" x2="15" y2="0" stroke="currentColor" class="text-emerald-600" stroke-width="2" />
          <text x="20" y="4" fill="currentColor" class="text-gray-600 dark:text-gray-400">f(x)</text>
        </g>
        <g transform="translate(55, 0)">
          <line x1="0" y1="0" x2="15" y2="0" stroke="currentColor" class="text-blue-500" stroke-width="2" />
          <text x="20" y="4" fill="currentColor" class="text-gray-600 dark:text-gray-400">tangent</text>
        </g>
        <g v-if="showSecant" transform="translate(130, 0)">
          <line x1="0" y1="0" x2="15" y2="0" stroke="currentColor" class="text-amber-500" stroke-width="2" stroke-dasharray="4,2" />
          <text x="20" y="4" fill="currentColor" class="text-gray-600 dark:text-gray-400">secant</text>
        </g>
        <g v-if="showDerivativeCurve" transform="translate(200, 0)">
          <line x1="0" y1="0" x2="15" y2="0" stroke="currentColor" class="text-purple-500" stroke-width="2" stroke-dasharray="3,2" />
          <text x="20" y="4" fill="currentColor" class="text-gray-600 dark:text-gray-400">f'(x)</text>
        </g>
      </g>

      <!-- Point label -->
      <text
        :x="pointSvgX"
        :y="height - 5"
        text-anchor="middle"
        class="text-xs fill-current text-red-500 font-semibold"
      >
        x = {{ pointX.toFixed(2) }}
      </text>
    </svg>

    <!-- Interaction hint -->
    <p class="text-xs text-text-muted mt-1 text-center">
      <span class="mr-1" aria-hidden="true">↔</span>
      Drag the red point to explore different slopes
    </p>
  </div>
</template>

<style scoped>
.derivative-canvas-container {
  user-select: none;
}
</style>
