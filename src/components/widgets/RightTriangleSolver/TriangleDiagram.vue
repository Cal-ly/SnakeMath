<script setup lang="ts">
import { computed } from 'vue'
import type { RightTriangle } from '@/utils/math/rightTriangle'

interface Props {
  triangle: RightTriangle
  isValid: boolean
  enabledA?: boolean
  enabledB?: boolean
  enabledC?: boolean
  enabledAngleA?: boolean
  enabledAngleB?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enabledA: false,
  enabledB: false,
  enabledC: false,
  enabledAngleA: false,
  enabledAngleB: false,
})

// SVG dimensions
const svgWidth = 300
const svgHeight = 240
const padding = 40

// Calculate triangle vertices based on actual proportions (when valid)
// or use default proportions when not solved
const vertices = computed(() => {
  let aRatio: number, bRatio: number

  if (props.isValid && props.triangle.a && props.triangle.b) {
    // Use actual proportions
    const maxSide = Math.max(props.triangle.a, props.triangle.b)
    aRatio = props.triangle.a / maxSide
    bRatio = props.triangle.b / maxSide
  } else {
    // Default 3-4-5 proportions
    aRatio = 0.6
    bRatio = 0.8
  }

  // Calculate drawing dimensions
  const maxWidth = svgWidth - padding * 2
  const maxHeight = svgHeight - padding * 2

  // Scale to fit
  const scale = Math.min(maxWidth / bRatio, maxHeight / aRatio)
  const drawWidth = bRatio * scale
  const drawHeight = aRatio * scale

  // Position triangle (A at bottom left)
  const A = { x: padding, y: svgHeight - padding }
  const B = { x: padding + drawWidth, y: svgHeight - padding }
  const C = { x: padding + drawWidth, y: svgHeight - padding - drawHeight }

  return { A, B, C, drawWidth, drawHeight }
})

// Right angle square position
const rightAngleSquare = computed(() => {
  const size = 15
  const { B } = vertices.value
  return {
    x: B.x - size,
    y: B.y - size,
    size,
  }
})

// Angle arc for angle A (at vertex A)
const angleAArc = computed(() => {
  const { A, C } = vertices.value
  const arcRadius = 25

  // Calculate angle from horizontal
  const dx = C.x - A.x
  const dy = C.y - A.y
  const angle = Math.atan2(-dy, dx) // Negative dy because SVG y is inverted

  // Arc from 0 (right) to angle (toward C)
  const startX = A.x + arcRadius
  const startY = A.y
  const endX = A.x + arcRadius * Math.cos(angle)
  const endY = A.y - arcRadius * Math.sin(angle)

  return {
    path: `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 0 ${endX} ${endY}`,
    labelX: A.x + (arcRadius + 10) * Math.cos(angle / 2),
    labelY: A.y - (arcRadius + 10) * Math.sin(angle / 2),
  }
})

// Format number for display
function fmt(n: number | null, decimals = 2): string {
  if (n === null) return '?'
  return n.toFixed(decimals)
}

// Get color based on whether value is known (input) or calculated
function getColor(isEnabled: boolean): string {
  return isEnabled ? 'var(--color-primary)' : 'var(--color-secondary, #8b5cf6)'
}
</script>

<template>
  <div class="triangle-diagram" data-testid="triangle-diagram">
    <svg
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      class="triangle-svg"
      aria-label="Right triangle diagram showing sides a, b, c and angles A, B"
      role="img"
    >
      <!-- Triangle -->
      <polygon
        :points="`${vertices.A.x},${vertices.A.y} ${vertices.B.x},${vertices.B.y} ${vertices.C.x},${vertices.C.y}`"
        fill="none"
        class="stroke-text-secondary"
        stroke-width="2"
      />

      <!-- Right angle square at B -->
      <rect
        :x="rightAngleSquare.x"
        :y="rightAngleSquare.y"
        :width="rightAngleSquare.size"
        :height="rightAngleSquare.size"
        fill="none"
        class="stroke-text-muted"
        stroke-width="1"
      />

      <!-- Angle arc at A -->
      <path
        :d="angleAArc.path"
        fill="none"
        :stroke="getColor(enabledAngleA)"
        stroke-width="2"
      />

      <!-- Side labels -->
      <!-- Side a (opposite to A, vertical right side) -->
      <text
        :x="vertices.B.x + 20"
        :y="(vertices.B.y + vertices.C.y) / 2"
        class="text-xs font-mono"
        :fill="getColor(enabledA)"
        text-anchor="start"
        dominant-baseline="middle"
      >
        a = {{ fmt(triangle.a) }}
      </text>

      <!-- Side b (adjacent to A, horizontal bottom) -->
      <text
        :x="(vertices.A.x + vertices.B.x) / 2"
        :y="vertices.A.y + 20"
        class="text-xs font-mono"
        :fill="getColor(enabledB)"
        text-anchor="middle"
      >
        b = {{ fmt(triangle.b) }}
      </text>

      <!-- Side c (hypotenuse) -->
      <text
        :x="(vertices.A.x + vertices.C.x) / 2 - 25"
        :y="(vertices.A.y + vertices.C.y) / 2"
        class="text-xs font-mono"
        :fill="getColor(enabledC)"
        text-anchor="end"
        dominant-baseline="middle"
      >
        c = {{ fmt(triangle.c) }}
      </text>

      <!-- Vertex labels -->
      <text
        :x="vertices.A.x - 10"
        :y="vertices.A.y + 5"
        class="text-sm font-semibold fill-text-primary"
        text-anchor="end"
      >
        A
      </text>

      <text
        :x="vertices.B.x + 10"
        :y="vertices.B.y + 5"
        class="text-sm font-semibold fill-text-primary"
        text-anchor="start"
      >
        B
      </text>

      <text
        :x="vertices.C.x + 10"
        :y="vertices.C.y - 5"
        class="text-sm font-semibold fill-text-primary"
        text-anchor="start"
      >
        C
      </text>

      <!-- Angle A label -->
      <text
        :x="angleAArc.labelX + 5"
        :y="angleAArc.labelY"
        class="text-xs font-mono"
        :fill="getColor(enabledAngleA)"
        text-anchor="start"
        dominant-baseline="middle"
      >
        {{ triangle.A !== null ? fmt(triangle.A, 1) + '°' : '?' }}
      </text>

      <!-- Angle B label (near vertex C) -->
      <text
        :x="vertices.C.x - 5"
        :y="vertices.C.y + 25"
        class="text-xs font-mono"
        :fill="getColor(enabledAngleB)"
        text-anchor="end"
      >
        B = {{ triangle.B !== null ? fmt(triangle.B, 1) + '°' : '?' }}
      </text>

      <!-- Right angle label -->
      <text
        :x="vertices.B.x - 25"
        :y="vertices.B.y - 5"
        class="text-[10px] fill-text-muted"
        text-anchor="end"
      >
        90°
      </text>
    </svg>

    <!-- Legend -->
    <div class="flex gap-4 justify-center mt-2 text-xs text-text-muted">
      <div class="flex items-center gap-1">
        <span class="w-3 h-0.5 bg-primary" />
        Known (input)
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-0.5" style="background-color: #8b5cf6" />
        Calculated
      </div>
    </div>
  </div>
</template>

<style scoped>
.triangle-svg {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
