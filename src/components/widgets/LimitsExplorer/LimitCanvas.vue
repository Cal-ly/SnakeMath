<script setup lang="ts">
/**
 * LimitCanvas - SVG canvas for function curve and approach point
 *
 * Renders:
 * - Coordinate axes
 * - Function curve
 * - Approach point marker
 * - ε-δ bands (when showEpsilonDelta is true)
 */

import { computed, ref } from 'vue'
import type { LimitFunctionPreset, LimitResult } from '@/types/math'
import EpsilonDeltaBands from './EpsilonDeltaBands.vue'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  functionPoints: Array<{ x: number; y: number }>
  approachPoint: number
  viewDomain: { min: number; max: number }
  epsilon: number
  delta: number
  limitResult: LimitResult | null
  preset?: LimitFunctionPreset
  /** Whether to show ε-δ bands visualization */
  showEpsilonDelta?: boolean
  /** Whether the current delta satisfies the epsilon condition */
  deltaValid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  preset: undefined,
  showEpsilonDelta: false,
  deltaValid: false,
})

const emit = defineEmits<{
  'update:approachPoint': [value: number]
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
  const validY = props.functionPoints
    .map((p) => p.y)
    .filter((y) => isFinite(y) && Math.abs(y) < 100)

  if (validY.length === 0) return { min: -5, max: 5 }

  const minY = Math.min(...validY)
  const maxY = Math.max(...validY)
  const range = maxY - minY || 1
  const padAmount = range * 0.1

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
 * Generate SVG path for function curve
 * Handles NaN values by breaking the path
 */
const functionPath = computed(() => {
  const points = props.functionPoints
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
})

// ============================================================================
// Axis Generation
// ============================================================================

/**
 * Generate x-axis tick marks
 */
const xTicks = computed(() => {
  const { min, max } = props.viewDomain
  const step = Math.ceil((max - min) / 6)
  const ticks: number[] = []

  for (let x = Math.ceil(min); x <= max; x += step) {
    ticks.push(x)
  }

  return ticks
})

/**
 * Generate y-axis tick marks
 */
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
// Approach Point Visualization
// ============================================================================

const approachPointSvgX = computed(() => xScale(props.approachPoint))

const limitValueSvgY = computed(() => {
  if (!props.limitResult || props.limitResult.value === null) return null
  if (!isFinite(props.limitResult.value)) return null
  return yScale(props.limitResult.value)
})

// ============================================================================
// Interaction
// ============================================================================

const isDragging = ref(false)
const canvasRef = ref<SVGSVGElement | null>(null)

function handleMouseDown(event: MouseEvent): void {
  isDragging.value = true
  updateApproachFromMouse(event)
}

function handleMouseMove(event: MouseEvent): void {
  if (!isDragging.value) return
  updateApproachFromMouse(event)
}

function handleMouseUp(): void {
  isDragging.value = false
}

function updateApproachFromMouse(event: MouseEvent): void {
  if (!canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const svgX = event.clientX - rect.left
  const dataX = xScaleInverse(svgX)

  // Clamp to domain
  const { min, max } = props.viewDomain
  const clampedX = Math.max(min, Math.min(max, dataX))

  // Round to 1 decimal place
  const roundedX = Math.round(clampedX * 10) / 10

  emit('update:approachPoint', roundedX)
}
</script>

<template>
  <div class="limit-canvas-container">
    <svg
      ref="canvasRef"
      :viewBox="`0 0 ${width} ${height}`"
      class="w-full h-auto bg-white dark:bg-gray-900 rounded-lg border border-border"
      role="img"
      :aria-label="`Graph of ${preset?.name || 'function'} with approach point at x = ${approachPoint}`"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <!-- Grid lines -->
      <g class="grid-lines">
        <!-- Vertical grid lines -->
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
        <!-- Horizontal grid lines -->
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
        <!-- X-axis -->
        <line
          :x1="padding.left"
          :y1="yScale(0)"
          :x2="width - padding.right"
          :y2="yScale(0)"
          stroke="currentColor"
          class="text-gray-400"
          stroke-width="1.5"
        />
        <!-- Y-axis -->
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
        <!-- X-axis labels -->
        <text
          v-for="x in xTicks"
          :key="`xlabel-${x}`"
          :x="xScale(x)"
          :y="height - padding.bottom + 15"
          text-anchor="middle"
        >
          {{ x }}
        </text>
        <!-- Y-axis labels -->
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

      <!-- ε-δ bands visualization -->
      <EpsilonDeltaBands
        v-if="showEpsilonDelta"
        :epsilon="epsilon"
        :delta="delta"
        :approach-point="approachPoint"
        :limit-result="limitResult"
        :x-scale="xScale"
        :y-scale="yScale"
        :padding="padding"
        :width="width"
        :height="height"
        :delta-valid="deltaValid"
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

      <!-- Approach point vertical line -->
      <line
        :x1="approachPointSvgX"
        :y1="padding.top"
        :x2="approachPointSvgX"
        :y2="height - padding.bottom"
        stroke="currentColor"
        class="text-red-400"
        stroke-width="1.5"
        stroke-dasharray="4,4"
      />

      <!-- Approach point marker -->
      <circle
        :cx="approachPointSvgX"
        :cy="yScale(0)"
        r="6"
        fill="currentColor"
        class="text-red-500 cursor-ew-resize"
      />

      <!-- Limit value marker (if finite) -->
      <g v-if="limitValueSvgY !== null">
        <!-- Horizontal line to limit value -->
        <line
          :x1="padding.left"
          :y1="limitValueSvgY"
          :x2="approachPointSvgX"
          :y2="limitValueSvgY"
          stroke="currentColor"
          class="text-purple-400"
          stroke-width="1.5"
          stroke-dasharray="4,4"
        />

        <!-- Limit point marker -->
        <circle
          :cx="approachPointSvgX"
          :cy="limitValueSvgY"
          r="5"
          fill="currentColor"
          class="text-purple-500"
          stroke="white"
          stroke-width="2"
        />
      </g>

      <!-- Labels -->
      <g class="labels">
        <!-- Approach point label -->
        <text
          :x="approachPointSvgX"
          :y="height - 5"
          text-anchor="middle"
          class="text-xs fill-current text-red-500 font-semibold"
        >
          a = {{ approachPoint }}
        </text>

        <!-- Limit value label -->
        <text
          v-if="limitResult && limitResult.value !== null && isFinite(limitResult.value)"
          :x="padding.left + 5"
          :y="(limitValueSvgY ?? 0) - 5"
          class="text-xs fill-current text-purple-500 font-semibold"
        >
          L = {{ limitResult.value.toFixed(2) }}
        </text>
      </g>
    </svg>

    <!-- Interaction hint -->
    <p class="text-xs text-text-muted mt-1 text-center">
      <span class="mr-1" aria-hidden="true">↔</span>
      Drag the red point to change approach value
    </p>
  </div>
</template>

<style scoped>
.limit-canvas-container {
  user-select: none;
}
</style>
