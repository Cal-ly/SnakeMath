<script setup lang="ts">
import { computed } from 'vue'
import type { Vector2D } from '@/types/math'

interface TransformedSquare {
  origin: Vector2D
  corner1: Vector2D // (1,0) transformed
  corner2: Vector2D // (1,1) transformed
  corner3: Vector2D // (0,1) transformed
}

interface Props {
  transformedSquare: TransformedSquare
  transformedI: Vector2D
  transformedJ: Vector2D
  determinant: number
  isOrthogonal: boolean
}

const props = defineProps<Props>()

// Canvas dimensions and scaling
const viewBox = { minX: -3, minY: -3, width: 6, height: 6 }
const canvasSize = 320

// Scale factor: canvas pixels per unit
const scale = canvasSize / viewBox.width

// Convert math coordinates to SVG coordinates
// SVG y-axis is inverted (positive down), so we flip y
function toSvg(v: Vector2D): { x: number; y: number } {
  return {
    x: (v.x - viewBox.minX) * scale,
    y: (viewBox.height - (v.y - viewBox.minY)) * scale, // Flip y
  }
}

// Grid lines
const gridLines = computed(() => {
  const lines: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = []

  for (let i = Math.ceil(viewBox.minX); i <= viewBox.minX + viewBox.width; i++) {
    const start = toSvg({ x: i, y: viewBox.minY })
    const end = toSvg({ x: i, y: viewBox.minY + viewBox.height })
    lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, major: i === 0 })
  }

  for (let i = Math.ceil(viewBox.minY); i <= viewBox.minY + viewBox.height; i++) {
    const start = toSvg({ x: viewBox.minX, y: i })
    const end = toSvg({ x: viewBox.minX + viewBox.width, y: i })
    lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, major: i === 0 })
  }

  return lines
})

// Original unit square path
const originalSquarePath = computed(() => {
  const o = toSvg({ x: 0, y: 0 })
  const c1 = toSvg({ x: 1, y: 0 })
  const c2 = toSvg({ x: 1, y: 1 })
  const c3 = toSvg({ x: 0, y: 1 })
  return `M ${o.x} ${o.y} L ${c1.x} ${c1.y} L ${c2.x} ${c2.y} L ${c3.x} ${c3.y} Z`
})

// Transformed square path
const transformedSquarePath = computed(() => {
  const o = toSvg(props.transformedSquare.origin)
  const c1 = toSvg(props.transformedSquare.corner1)
  const c2 = toSvg(props.transformedSquare.corner2)
  const c3 = toSvg(props.transformedSquare.corner3)
  return `M ${o.x} ${o.y} L ${c1.x} ${c1.y} L ${c2.x} ${c2.y} L ${c3.x} ${c3.y} Z`
})

// Basis vectors (original)
const basisIEnd = computed(() => toSvg({ x: 1, y: 0 }))
const basisJEnd = computed(() => toSvg({ x: 0, y: 1 }))

// Transformed basis vectors
const transformedIEnd = computed(() => toSvg(props.transformedI))
const transformedJEnd = computed(() => toSvg(props.transformedJ))

// Origin in SVG coordinates
const originSvg = computed(() => toSvg({ x: 0, y: 0 }))

// Area interpretation
const areaInterpretation = computed(() => {
  const det = props.determinant
  if (Math.abs(det) < 0.001) return 'collapsed (area = 0)'
  if (det < 0) return `flipped, area × ${Math.abs(det).toFixed(2)}`
  return `area × ${det.toFixed(2)}`
})
</script>

<template>
  <div class="transformation-canvas">
    <svg
      :width="canvasSize"
      :height="canvasSize"
      class="bg-surface-alt rounded-lg border border-border"
      data-testid="transformation-canvas"
      role="img"
      aria-label="Visualization of matrix transformation showing unit square and basis vectors"
    >
      <!-- Arrow marker definitions -->
      <defs>
        <marker
          id="arrow-i-original"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" opacity="0.5" />
        </marker>
        <marker
          id="arrow-j-original"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" opacity="0.5" />
        </marker>
        <marker
          id="arrow-i-transformed"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
        </marker>
        <marker
          id="arrow-j-transformed"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" />
        </marker>
      </defs>

      <!-- Grid lines -->
      <line
        v-for="(line, idx) in gridLines"
        :key="`grid-${idx}`"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        :stroke="line.major ? 'var(--color-text-muted)' : 'var(--color-border)'"
        :stroke-width="line.major ? 1.5 : 0.5"
        :opacity="line.major ? 0.6 : 0.3"
      />

      <!-- Original unit square (light outline) -->
      <path
        :d="originalSquarePath"
        fill="none"
        stroke="var(--color-primary)"
        stroke-width="1"
        stroke-dasharray="4 2"
        opacity="0.4"
        data-testid="original-square"
      />

      <!-- Transformed square (filled) -->
      <path
        :d="transformedSquarePath"
        fill="var(--color-primary)"
        fill-opacity="0.2"
        stroke="var(--color-primary)"
        stroke-width="2"
        data-testid="transformed-square"
      />

      <!-- Original basis vector î (light) -->
      <line
        :x1="originSvg.x"
        :y1="originSvg.y"
        :x2="basisIEnd.x"
        :y2="basisIEnd.y"
        stroke="#3b82f6"
        stroke-width="2"
        opacity="0.4"
        stroke-dasharray="4 2"
        marker-end="url(#arrow-i-original)"
      />

      <!-- Original basis vector ĵ (light) -->
      <line
        :x1="originSvg.x"
        :y1="originSvg.y"
        :x2="basisJEnd.x"
        :y2="basisJEnd.y"
        stroke="#f59e0b"
        stroke-width="2"
        opacity="0.4"
        stroke-dasharray="4 2"
        marker-end="url(#arrow-j-original)"
      />

      <!-- Transformed basis vector î -->
      <line
        :x1="originSvg.x"
        :y1="originSvg.y"
        :x2="transformedIEnd.x"
        :y2="transformedIEnd.y"
        stroke="#3b82f6"
        stroke-width="2.5"
        marker-end="url(#arrow-i-transformed)"
        data-testid="transformed-i"
      />

      <!-- Transformed basis vector ĵ -->
      <line
        :x1="originSvg.x"
        :y1="originSvg.y"
        :x2="transformedJEnd.x"
        :y2="transformedJEnd.y"
        stroke="#f59e0b"
        stroke-width="2.5"
        marker-end="url(#arrow-j-transformed)"
        data-testid="transformed-j"
      />

      <!-- Origin marker -->
      <circle :cx="originSvg.x" :cy="originSvg.y" r="4" fill="var(--color-text-primary)" />

      <!-- Vector labels -->
      <text
        :x="transformedIEnd.x + 8"
        :y="transformedIEnd.y"
        class="text-xs fill-blue-500 font-semibold"
      >
        î
      </text>
      <text
        :x="transformedJEnd.x"
        :y="transformedJEnd.y - 8"
        class="text-xs fill-amber-500 font-semibold"
      >
        ĵ
      </text>
    </svg>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 mt-3 text-sm text-text-muted">
      <div class="flex items-center gap-2">
        <span class="w-4 h-0.5 bg-blue-500 inline-block" />
        <span>î (1,0)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-4 h-0.5 bg-amber-500 inline-block" />
        <span>ĵ (0,1)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-text-secondary">{{ areaInterpretation }}</span>
      </div>
    </div>
  </div>
</template>
