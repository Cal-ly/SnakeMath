<script setup lang="ts">
import { computed } from 'vue'
import type { InverseResult, Atan2Result, InverseFunctionId } from '@/utils/math/inverseTrig'

interface Props {
  fn: InverseFunctionId
  result: InverseResult | Atan2Result
  value: number
  y?: number
}

const props = defineProps<Props>()

// SVG dimensions
const width = 300
const height = 300
const centerX = width / 2
const centerY = height / 2
const radius = 100

// Compute angle in radians for visualization
const angleRad = computed(() => {
  if (!props.result.isValid) return 0
  return props.result.value
})

// Point on unit circle
const point = computed(() => {
  const rad = angleRad.value
  return {
    x: centerX + radius * Math.cos(rad),
    y: centerY - radius * Math.sin(rad), // Flip y for SVG coords
  }
})

// Arc path for the angle
const arcPath = computed(() => {
  if (!props.result.isValid) return ''

  const rad = angleRad.value
  const startX = centerX + radius * 0.3
  const startY = centerY
  const endX = centerX + radius * 0.3 * Math.cos(rad)
  const endY = centerY - radius * 0.3 * Math.sin(rad)

  // Determine if we need the large arc flag
  const largeArc = Math.abs(rad) > Math.PI ? 1 : 0
  const sweep = rad > 0 ? 0 : 1

  return `M ${startX} ${startY} A ${radius * 0.3} ${radius * 0.3} 0 ${largeArc} ${sweep} ${endX} ${endY}`
})

// For atan2, show the input point
const inputPoint = computed(() => {
  if (props.fn !== 'atan2') return null

  // Scale to fit in visualization
  const maxCoord = Math.max(Math.abs(props.value), Math.abs(props.y ?? 0), 1)
  const scale = radius * 0.8 / maxCoord

  return {
    x: centerX + props.value * scale,
    y: centerY - (props.y ?? 0) * scale,
  }
})

// For arcsin/arccos/arctan, show the value on appropriate axis
const valueMarker = computed(() => {
  if (props.fn === 'atan2') return null

  if (props.fn === 'arcsin') {
    // Value is sin, mark on y-axis and show horizontal line to circle
    const yPos = centerY - props.value * radius
    return {
      type: 'sin',
      x: centerX,
      y: yPos,
      lineToX: point.value.x,
      lineToY: yPos,
    }
  }

  if (props.fn === 'arccos') {
    // Value is cos, mark on x-axis and show vertical line to circle
    const xPos = centerX + props.value * radius
    return {
      type: 'cos',
      x: xPos,
      y: centerY,
      lineToX: xPos,
      lineToY: point.value.y,
    }
  }

  if (props.fn === 'arctan') {
    // Value is tan = sin/cos, show slope line
    return {
      type: 'tan',
      slope: props.value,
    }
  }

  return null
})

// Slope line for arctan visualization
const slopeLine = computed(() => {
  if (valueMarker.value?.type !== 'tan') return null

  const slope = props.value
  // Draw line through origin with given slope, limited to circle
  const x1 = centerX - radius
  const y1 = centerY + slope * radius
  const x2 = centerX + radius
  const y2 = centerY - slope * radius

  return { x1, y1, x2, y2 }
})
</script>

<template>
  <div class="inverse-visualization" data-testid="inverse-visualization">
    <svg :width="width" :height="height" class="border border-border rounded-lg bg-surface">
      <!-- Grid lines -->
      <line
        :x1="0" :y1="centerY"
        :x2="width" :y2="centerY"
        class="stroke-border"
        stroke-width="1"
      />
      <line
        :x1="centerX" :y1="0"
        :x2="centerX" :y2="height"
        class="stroke-border"
        stroke-width="1"
      />

      <!-- Unit circle -->
      <circle
        :cx="centerX"
        :cy="centerY"
        :r="radius"
        fill="none"
        class="stroke-text-muted"
        stroke-width="1"
        stroke-dasharray="4 4"
      />

      <!-- Value marker for arcsin/arccos -->
      <template v-if="valueMarker && valueMarker.type !== 'tan' && result.isValid">
        <!-- Value point on axis -->
        <circle
          :cx="valueMarker.x"
          :cy="valueMarker.y"
          r="4"
          class="fill-amber-500"
        />
        <!-- Line from axis to circle point -->
        <line
          :x1="valueMarker.x"
          :y1="valueMarker.y"
          :x2="valueMarker.lineToX"
          :y2="valueMarker.lineToY"
          class="stroke-amber-500"
          stroke-width="1"
          stroke-dasharray="4 4"
        />
      </template>

      <!-- Slope line for arctan -->
      <template v-if="slopeLine && result.isValid">
        <line
          :x1="slopeLine.x1"
          :y1="slopeLine.y1"
          :x2="slopeLine.x2"
          :y2="slopeLine.y2"
          class="stroke-amber-500"
          stroke-width="1"
          stroke-dasharray="4 4"
        />
      </template>

      <!-- For atan2: show input point and line from origin -->
      <template v-if="inputPoint && result.isValid">
        <!-- Line from origin to input point -->
        <line
          :x1="centerX"
          :y1="centerY"
          :x2="inputPoint.x"
          :y2="inputPoint.y"
          class="stroke-amber-500"
          stroke-width="2"
        />
        <!-- Input point -->
        <circle
          :cx="inputPoint.x"
          :cy="inputPoint.y"
          r="5"
          class="fill-amber-500"
        />
      </template>

      <!-- Angle arc -->
      <path
        v-if="result.isValid"
        :d="arcPath"
        fill="none"
        class="stroke-primary"
        stroke-width="2"
      />

      <!-- Radius line to point on circle -->
      <line
        v-if="result.isValid && fn !== 'atan2'"
        :x1="centerX"
        :y1="centerY"
        :x2="point.x"
        :y2="point.y"
        class="stroke-primary"
        stroke-width="2"
      />

      <!-- Point on unit circle -->
      <circle
        v-if="result.isValid && fn !== 'atan2'"
        :cx="point.x"
        :cy="point.y"
        r="6"
        class="fill-primary"
      />

      <!-- Angle label -->
      <text
        v-if="result.isValid"
        :x="centerX + 45"
        :y="centerY - 10"
        class="fill-text-primary text-xs"
        text-anchor="start"
      >
        {{ result.valueDegrees.toFixed(1) }}°
      </text>

      <!-- Axis labels -->
      <text :x="width - 15" :y="centerY - 5" class="fill-text-muted text-xs">x</text>
      <text :x="centerX + 5" :y="15" class="fill-text-muted text-xs">y</text>

      <!-- Invalid message -->
      <text
        v-if="!result.isValid"
        :x="centerX"
        :y="centerY"
        class="fill-red-500 text-sm"
        text-anchor="middle"
      >
        Undefined
      </text>
    </svg>
  </div>
</template>
