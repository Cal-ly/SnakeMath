<script setup lang="ts">
/**
 * IntegrationCanvas - SVG visualization of function and Riemann sum
 *
 * Renders:
 * - Coordinate axes with grid
 * - Function curve
 * - Shaded area under curve (signed: blue positive, red negative)
 * - Riemann rectangles/trapezoids
 * - Integration bounds markers
 *
 * D-124: Use blue for positive area, red for negative
 * D-126: Focus on geometric interpretation
 */

import { computed, ref } from 'vue'
import type { RiemannSumResult, RiemannMethod } from '@/types/math'

// ============================================================================
// Props
// ============================================================================

interface Props {
  functionPoints: Array<{ x: number; y: number }>
  riemannResult: RiemannSumResult | null
  lowerBound: number
  upperBound: number
  viewDomain: { min: number; max: number }
  method: RiemannMethod
}

const props = defineProps<Props>()

// ============================================================================
// Constants
// ============================================================================

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400
const PADDING = { top: 20, right: 30, bottom: 40, left: 50 }
const PLOT_WIDTH = CANVAS_WIDTH - PADDING.left - PADDING.right
const PLOT_HEIGHT = CANVAS_HEIGHT - PADDING.top - PADDING.bottom

// ============================================================================
// Refs
// ============================================================================

const hoveredIndex = ref<number | null>(null)

// ============================================================================
// Scale Functions
// ============================================================================

const yRange = computed(() => {
  if (props.functionPoints.length === 0) {
    return { min: -1, max: 1 }
  }

  const yValues = props.functionPoints
    .filter(p => isFinite(p.y))
    .map(p => p.y)

  if (yValues.length === 0) {
    return { min: -1, max: 1 }
  }

  let min = Math.min(...yValues, 0) // Always include 0
  let max = Math.max(...yValues, 0)

  // Add padding
  const range = max - min || 1
  min -= range * 0.1
  max += range * 0.1

  return { min, max }
})

function scaleX(x: number): number {
  const { min, max } = props.viewDomain
  return PADDING.left + ((x - min) / (max - min)) * PLOT_WIDTH
}

function scaleY(y: number): number {
  const { min, max } = yRange.value
  return PADDING.top + PLOT_HEIGHT - ((y - min) / (max - min)) * PLOT_HEIGHT
}

// ============================================================================
// Computed SVG Data
// ============================================================================

/**
 * Generate SVG path for the function curve
 */
const curvePath = computed(() => {
  const points = props.functionPoints
  if (points.length === 0) return ''

  let path = ''
  let isDrawing = false

  for (const point of points) {
    if (!isFinite(point.y) || Math.abs(point.y) > 1000) {
      // Break in curve (discontinuity or out of range)
      isDrawing = false
      continue
    }

    const x = scaleX(point.x)
    const y = scaleY(point.y)

    // Clamp y to canvas
    const clampedY = Math.max(PADDING.top, Math.min(PADDING.top + PLOT_HEIGHT, y))

    if (!isDrawing) {
      path += `M ${x} ${clampedY} `
      isDrawing = true
    } else {
      path += `L ${x} ${clampedY} `
    }
  }

  return path
})

/**
 * Generate shaded area path (for exact area visualization)
 */
const shadedAreaPath = computed(() => {
  if (!props.riemannResult || props.functionPoints.length === 0) return ''

  const points = props.functionPoints.filter(
    p => p.x >= props.lowerBound && p.x <= props.upperBound && isFinite(p.y)
  )

  if (points.length === 0) return ''

  // Start from bottom left
  let path = `M ${scaleX(props.lowerBound)} ${scaleY(0)} `

  // Draw along curve
  for (const point of points) {
    const y = Math.max(yRange.value.min, Math.min(yRange.value.max, point.y))
    path += `L ${scaleX(point.x)} ${scaleY(y)} `
  }

  // Close back to x-axis
  path += `L ${scaleX(props.upperBound)} ${scaleY(0)} Z`

  return path
})

/**
 * Generate Riemann rectangles/trapezoids for visualization
 */
const riemannShapes = computed(() => {
  if (!props.riemannResult) return []

  return props.riemannResult.samplePoints.map((point, index) => {
    const leftX = scaleX(point.leftX)
    const rightX = scaleX(point.leftX + point.width)
    const width = rightX - leftX
    const y0 = scaleY(0)

    // Determine if area is positive or negative
    const isPositive = point.y >= 0

    if (props.method === 'trapezoidal' && point.rightY !== undefined) {
      // Trapezoid
      const leftY = scaleY(point.y)
      const rightY = scaleY(point.rightY)
      return {
        type: 'trapezoid' as const,
        points: `${leftX},${y0} ${leftX},${leftY} ${rightX},${rightY} ${rightX},${y0}`,
        isPositive,
        index,
        area: props.riemannResult!.areas[index] ?? 0,
      }
    } else {
      // Rectangle
      const sampleY = scaleY(point.y)
      const height = Math.abs(sampleY - y0)
      const top = Math.min(sampleY, y0)

      return {
        type: 'rectangle' as const,
        x: leftX,
        y: top,
        width,
        height,
        isPositive,
        index,
        area: props.riemannResult!.areas[index] ?? 0,
      }
    }
  })
})

/**
 * X-axis tick marks
 */
const xTicks = computed(() => {
  const { min, max } = props.viewDomain
  const range = max - min
  const step = calculateTickStep(range)
  const ticks: Array<{ value: number; x: number; label: string }> = []

  const start = Math.ceil(min / step) * step
  for (let value = start; value <= max; value += step) {
    ticks.push({
      value,
      x: scaleX(value),
      label: formatTickLabel(value),
    })
  }

  return ticks
})

/**
 * Y-axis tick marks
 */
const yTicks = computed(() => {
  const { min, max } = yRange.value
  const range = max - min
  const step = calculateTickStep(range)
  const ticks: Array<{ value: number; y: number; label: string }> = []

  const start = Math.ceil(min / step) * step
  for (let value = start; value <= max; value += step) {
    ticks.push({
      value,
      y: scaleY(value),
      label: formatTickLabel(value),
    })
  }

  return ticks
})

// ============================================================================
// Helper Functions
// ============================================================================

function calculateTickStep(range: number): number {
  const roughStep = range / 5
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
  const residual = roughStep / magnitude

  if (residual > 5) return 10 * magnitude
  if (residual > 2) return 5 * magnitude
  if (residual > 1) return 2 * magnitude
  return magnitude
}

function formatTickLabel(value: number): string {
  if (Math.abs(value - Math.PI) < 0.01) return 'π'
  if (Math.abs(value + Math.PI) < 0.01) return '-π'
  if (Math.abs(value - Math.E) < 0.01) return 'e'
  if (Math.abs(value) < 0.001) return '0'
  if (Math.abs(value) >= 100 || (Math.abs(value) < 0.01 && value !== 0)) {
    return value.toExponential(1)
  }
  return value.toFixed(1).replace(/\.0$/, '')
}

function handleShapeHover(index: number | null) {
  hoveredIndex.value = index
}
</script>

<template>
  <div class="relative">
    <svg
      :viewBox="`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`"
      class="w-full h-auto bg-white dark:bg-gray-900 rounded-lg border border-border"
      role="img"
      aria-label="Integration visualization showing function curve and Riemann sum approximation"
    >
      <!-- Grid lines -->
      <g class="grid-lines">
        <!-- Vertical grid -->
        <line
          v-for="tick in xTicks"
          :key="`vgrid-${tick.value}`"
          :x1="tick.x"
          :y1="PADDING.top"
          :x2="tick.x"
          :y2="PADDING.top + PLOT_HEIGHT"
          class="stroke-gray-200 dark:stroke-gray-700"
          stroke-width="1"
        />
        <!-- Horizontal grid -->
        <line
          v-for="tick in yTicks"
          :key="`hgrid-${tick.value}`"
          :x1="PADDING.left"
          :y1="tick.y"
          :x2="PADDING.left + PLOT_WIDTH"
          :y2="tick.y"
          class="stroke-gray-200 dark:stroke-gray-700"
          stroke-width="1"
        />
      </g>

      <!-- Shaded area (faint background) -->
      <path
        v-if="shadedAreaPath"
        :d="shadedAreaPath"
        class="fill-primary/10"
      />

      <!-- Riemann shapes -->
      <g class="riemann-shapes">
        <template v-for="shape in riemannShapes" :key="`shape-${shape.index}`">
          <!-- Rectangle -->
          <rect
            v-if="shape.type === 'rectangle'"
            :x="shape.x"
            :y="shape.y"
            :width="shape.width"
            :height="shape.height"
            :class="[
              'transition-opacity cursor-pointer',
              shape.isPositive
                ? 'fill-blue-500/40 stroke-blue-600 dark:fill-blue-400/40 dark:stroke-blue-400'
                : 'fill-red-500/40 stroke-red-600 dark:fill-red-400/40 dark:stroke-red-400',
              hoveredIndex === shape.index ? 'opacity-100' : 'opacity-70'
            ]"
            stroke-width="1"
            @mouseenter="handleShapeHover(shape.index)"
            @mouseleave="handleShapeHover(null)"
          />
          <!-- Trapezoid -->
          <polygon
            v-else-if="shape.type === 'trapezoid'"
            :points="shape.points"
            :class="[
              'transition-opacity cursor-pointer',
              shape.isPositive
                ? 'fill-blue-500/40 stroke-blue-600 dark:fill-blue-400/40 dark:stroke-blue-400'
                : 'fill-red-500/40 stroke-red-600 dark:fill-red-400/40 dark:stroke-red-400',
              hoveredIndex === shape.index ? 'opacity-100' : 'opacity-70'
            ]"
            stroke-width="1"
            @mouseenter="handleShapeHover(shape.index)"
            @mouseleave="handleShapeHover(null)"
          />
        </template>
      </g>

      <!-- X-axis (y = 0) -->
      <line
        :x1="PADDING.left"
        :y1="scaleY(0)"
        :x2="PADDING.left + PLOT_WIDTH"
        :y2="scaleY(0)"
        class="stroke-gray-400 dark:stroke-gray-500"
        stroke-width="1.5"
      />

      <!-- Y-axis (x = 0, if visible) -->
      <line
        v-if="viewDomain.min <= 0 && viewDomain.max >= 0"
        :x1="scaleX(0)"
        :y1="PADDING.top"
        :x2="scaleX(0)"
        :y2="PADDING.top + PLOT_HEIGHT"
        class="stroke-gray-400 dark:stroke-gray-500"
        stroke-width="1.5"
      />

      <!-- Function curve -->
      <path
        :d="curvePath"
        fill="none"
        class="stroke-primary"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Bound markers -->
      <line
        :x1="scaleX(lowerBound)"
        :y1="PADDING.top"
        :x2="scaleX(lowerBound)"
        :y2="PADDING.top + PLOT_HEIGHT"
        class="stroke-amber-500"
        stroke-width="2"
        stroke-dasharray="4,4"
      />
      <line
        :x1="scaleX(upperBound)"
        :y1="PADDING.top"
        :x2="scaleX(upperBound)"
        :y2="PADDING.top + PLOT_HEIGHT"
        class="stroke-amber-500"
        stroke-width="2"
        stroke-dasharray="4,4"
      />

      <!-- Bound labels -->
      <text
        :x="scaleX(lowerBound)"
        :y="PADDING.top + PLOT_HEIGHT + 20"
        class="fill-amber-600 dark:fill-amber-400 text-sm font-medium"
        text-anchor="middle"
      >
        a
      </text>
      <text
        :x="scaleX(upperBound)"
        :y="PADDING.top + PLOT_HEIGHT + 20"
        class="fill-amber-600 dark:fill-amber-400 text-sm font-medium"
        text-anchor="middle"
      >
        b
      </text>

      <!-- X-axis ticks and labels -->
      <g class="x-axis">
        <template v-for="tick in xTicks" :key="`xtick-${tick.value}`">
          <line
            :x1="tick.x"
            :y1="PADDING.top + PLOT_HEIGHT"
            :x2="tick.x"
            :y2="PADDING.top + PLOT_HEIGHT + 5"
            class="stroke-gray-500"
            stroke-width="1"
          />
          <text
            :x="tick.x"
            :y="PADDING.top + PLOT_HEIGHT + 18"
            class="fill-text-secondary text-xs"
            text-anchor="middle"
          >
            {{ tick.label }}
          </text>
        </template>
      </g>

      <!-- Y-axis ticks and labels -->
      <g class="y-axis">
        <template v-for="tick in yTicks" :key="`ytick-${tick.value}`">
          <line
            :x1="PADDING.left - 5"
            :y1="tick.y"
            :x2="PADDING.left"
            :y2="tick.y"
            class="stroke-gray-500"
            stroke-width="1"
          />
          <text
            :x="PADDING.left - 10"
            :y="tick.y + 4"
            class="fill-text-secondary text-xs"
            text-anchor="end"
          >
            {{ tick.label }}
          </text>
        </template>
      </g>
    </svg>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-4 mt-2 text-xs text-text-secondary">
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 bg-blue-500/60 border border-blue-600 rounded-sm" />
        <span>Positive area</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 bg-red-500/60 border border-red-600 rounded-sm" />
        <span>Negative area</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-0.5 bg-primary" />
        <span>f(x)</span>
      </div>
    </div>

    <!-- Hover tooltip -->
    <div
      v-if="hoveredIndex !== null && riemannShapes[hoveredIndex]"
      class="absolute top-2 right-2 px-2 py-1 bg-surface border border-border rounded shadow-lg text-xs"
    >
      <div>
        Rectangle {{ hoveredIndex + 1 }}:
        <span class="font-mono">{{ riemannShapes[hoveredIndex]?.area.toFixed(4) }}</span>
      </div>
    </div>
  </div>
</template>
