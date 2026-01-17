<script setup lang="ts">
import { computed } from 'vue'
import type { Vector2D, VectorOperation } from '@/types/math'

interface Props {
  vectorA: Vector2D
  vectorB: Vector2D
  resultVector?: Vector2D | null
  operation: VectorOperation
  showParallelogram?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  resultVector: undefined,
  showParallelogram: true,
})

// SVG dimensions
const svgSize = 360
const padding = 30
const gridSize = svgSize - padding * 2
const center = svgSize / 2
const scale = gridSize / 10 // -5 to +5 range = 10 units

// Convert vector coordinates to SVG coordinates
function toSvg(v: Vector2D): { x: number; y: number } {
  return {
    x: center + v.x * scale,
    y: center - v.y * scale, // Y is inverted in SVG
  }
}

// Arrow head path for a vector from origin to tip
function getArrowPath(tip: { x: number; y: number }): string {
  const headLength = 10
  const headAngle = Math.PI / 6 // 30 degrees

  const dx = tip.x - center
  const dy = tip.y - center
  const angle = Math.atan2(dy, dx)

  const x1 = tip.x - headLength * Math.cos(angle - headAngle)
  const y1 = tip.y - headLength * Math.sin(angle - headAngle)
  const x2 = tip.x - headLength * Math.cos(angle + headAngle)
  const y2 = tip.y - headLength * Math.sin(angle + headAngle)

  return `M ${tip.x} ${tip.y} L ${x1} ${y1} M ${tip.x} ${tip.y} L ${x2} ${y2}`
}

// SVG coordinates for vectors
const svgA = computed(() => toSvg(props.vectorA))
const svgB = computed(() => toSvg(props.vectorB))
const svgResult = computed(() => (props.resultVector ? toSvg(props.resultVector) : null))

// Arrow paths
const arrowPathA = computed(() => getArrowPath(svgA.value))
const arrowPathB = computed(() => getArrowPath(svgB.value))
const arrowPathResult = computed(() => (svgResult.value ? getArrowPath(svgResult.value) : ''))

// Parallelogram points for addition visualization
const parallelogramPath = computed(() => {
  if (props.operation !== 'add' || !props.showParallelogram) return ''

  // Parallelogram: origin -> A -> A+B -> B -> origin
  const a = svgA.value
  const b = svgB.value
  const ab = toSvg({
    x: props.vectorA.x + props.vectorB.x,
    y: props.vectorA.y + props.vectorB.y,
  })

  return `M ${center} ${center} L ${a.x} ${a.y} L ${ab.x} ${ab.y} L ${b.x} ${b.y} Z`
})

// For subtraction, show head-to-head visualization
const subtractionLine = computed(() => {
  if (props.operation !== 'subtract') return null

  return {
    x1: svgB.value.x,
    y1: svgB.value.y,
    x2: svgA.value.x,
    y2: svgA.value.y,
  }
})

// Grid lines
const gridLines = computed(() => {
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number; major: boolean }> = []

  for (let i = -5; i <= 5; i++) {
    const pos = center + i * scale
    // Vertical lines
    lines.push({
      x1: pos,
      y1: padding,
      x2: pos,
      y2: svgSize - padding,
      major: i === 0,
    })
    // Horizontal lines
    lines.push({
      x1: padding,
      y1: pos,
      x2: svgSize - padding,
      y2: pos,
      major: i === 0,
    })
  }

  return lines
})

// Axis tick labels
const tickLabels = computed(() => {
  const labels: Array<{ x: number; y: number; text: string }> = []

  for (let i = -5; i <= 5; i++) {
    if (i === 0) continue
    // X-axis labels
    labels.push({
      x: center + i * scale,
      y: center + 15,
      text: i.toString(),
    })
    // Y-axis labels
    labels.push({
      x: center - 15,
      y: center - i * scale + 4,
      text: i.toString(),
    })
  }

  return labels
})

// Whether to show each vector based on operation
const showVectorA = computed(() => true)
const showVectorB = computed(() => !['magnitude', 'normalize', 'scalar'].includes(props.operation))
const showResultVector = computed(() =>
  ['add', 'subtract', 'scalar', 'normalize'].includes(props.operation) && props.resultVector
)
</script>

<template>
  <div class="vector-canvas">
    <svg
      :width="svgSize"
      :height="svgSize"
      :viewBox="`0 0 ${svgSize} ${svgSize}`"
      class="vector-svg"
      aria-label="2D vector visualization showing vectors A, B, and operation results"
      role="img"
    >
      <!-- Grid -->
      <g class="grid-lines">
        <line
          v-for="(line, idx) in gridLines"
          :key="idx"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          :stroke-width="line.major ? 1.5 : 0.5"
          :class="line.major ? 'stroke-text-secondary' : 'stroke-border'"
        />
      </g>

      <!-- Tick labels -->
      <g class="tick-labels">
        <text
          v-for="(label, idx) in tickLabels"
          :key="idx"
          :x="label.x"
          :y="label.y"
          class="fill-text-muted text-[10px]"
          text-anchor="middle"
        >
          {{ label.text }}
        </text>
      </g>

      <!-- Axis labels -->
      <text :x="svgSize - padding + 10" :y="center + 4" class="fill-text-secondary text-xs">x</text>
      <text :x="center + 5" :y="padding - 10" class="fill-text-secondary text-xs">y</text>

      <!-- Parallelogram for addition -->
      <path
        v-if="parallelogramPath && operation === 'add'"
        :d="parallelogramPath"
        fill="rgba(16, 185, 129, 0.1)"
        stroke="rgba(16, 185, 129, 0.3)"
        stroke-width="1"
        stroke-dasharray="4 2"
      />

      <!-- Subtraction visualization: dashed line from B to A -->
      <line
        v-if="subtractionLine && operation === 'subtract'"
        :x1="subtractionLine.x1"
        :y1="subtractionLine.y1"
        :x2="subtractionLine.x2"
        :y2="subtractionLine.y2"
        stroke="rgba(245, 158, 11, 0.5)"
        stroke-width="2"
        stroke-dasharray="6 3"
      />

      <!-- Vector A -->
      <g v-if="showVectorA" class="vector-a" data-testid="vector-a">
        <line
          :x1="center"
          :y1="center"
          :x2="svgA.x"
          :y2="svgA.y"
          stroke="#10b981"
          stroke-width="2.5"
        />
        <path :d="arrowPathA" stroke="#10b981" stroke-width="2.5" fill="none" />
        <text
          :x="svgA.x + (svgA.x > center ? 8 : -8)"
          :y="svgA.y + (svgA.y < center ? -8 : 12)"
          class="fill-emerald-600 dark:fill-emerald-400 text-sm font-semibold"
          :text-anchor="svgA.x > center ? 'start' : 'end'"
        >
          A
        </text>
      </g>

      <!-- Vector B -->
      <g v-if="showVectorB" class="vector-b" data-testid="vector-b">
        <line
          :x1="center"
          :y1="center"
          :x2="svgB.x"
          :y2="svgB.y"
          stroke="#3b82f6"
          stroke-width="2.5"
        />
        <path :d="arrowPathB" stroke="#3b82f6" stroke-width="2.5" fill="none" />
        <text
          :x="svgB.x + (svgB.x > center ? 8 : -8)"
          :y="svgB.y + (svgB.y < center ? -8 : 12)"
          class="fill-blue-600 dark:fill-blue-400 text-sm font-semibold"
          :text-anchor="svgB.x > center ? 'start' : 'end'"
        >
          B
        </text>
      </g>

      <!-- Result Vector -->
      <g v-if="showResultVector && svgResult" class="vector-result" data-testid="vector-result">
        <line
          :x1="center"
          :y1="center"
          :x2="svgResult.x"
          :y2="svgResult.y"
          stroke="#f59e0b"
          stroke-width="3"
        />
        <path :d="arrowPathResult" stroke="#f59e0b" stroke-width="3" fill="none" />
        <text
          :x="svgResult.x + (svgResult.x > center ? 8 : -8)"
          :y="svgResult.y + (svgResult.y < center ? -8 : 12)"
          class="fill-amber-600 dark:fill-amber-400 text-sm font-bold"
          :text-anchor="svgResult.x > center ? 'start' : 'end'"
        >
          {{ operation === 'normalize' ? 'Â' : 'R' }}
        </text>
      </g>

      <!-- Origin point -->
      <circle :cx="center" :cy="center" r="4" class="fill-text-secondary" />
    </svg>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 justify-center mt-3 text-xs text-text-muted">
      <div class="flex items-center gap-1">
        <span class="w-3 h-0.5 bg-emerald-500" />
        <span>Vector A</span>
      </div>
      <div v-if="showVectorB" class="flex items-center gap-1">
        <span class="w-3 h-0.5 bg-blue-500" />
        <span>Vector B</span>
      </div>
      <div v-if="showResultVector" class="flex items-center gap-1">
        <span class="w-3 h-0.5 bg-amber-500" />
        <span>Result</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vector-svg {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
