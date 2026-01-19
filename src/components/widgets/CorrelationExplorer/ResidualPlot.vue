<script setup lang="ts">
import { computed } from 'vue'
import type { ResidualPoint } from '@/composables/useCorrelation'

interface Props {
  residualPoints: ResidualPoint[]
  width?: number
  height?: number
  padding?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 500,
  height: 200,
  padding: 50,
})

// Computed dimensions
const innerWidth = computed(() => props.width - props.padding * 2)
const innerHeight = computed(() => props.height - props.padding * 2)

// Calculate data bounds
const xMin = computed(() => {
  if (props.residualPoints.length === 0) return 0
  return Math.min(...props.residualPoints.map((p) => p.x))
})

const xMax = computed(() => {
  if (props.residualPoints.length === 0) return 10
  return Math.max(...props.residualPoints.map((p) => p.x))
})

const residualMax = computed(() => {
  if (props.residualPoints.length === 0) return 1
  const absMax = Math.max(...props.residualPoints.map((p) => Math.abs(p.residual)))
  return absMax * 1.2 // Add padding
})

// Scale functions
const xScale = computed(() => {
  const range = xMax.value - xMin.value
  return (value: number) => {
    if (range === 0) return props.padding + innerWidth.value / 2
    return props.padding + ((value - xMin.value) / range) * innerWidth.value
  }
})

const yScale = computed(() => {
  return (value: number) => {
    if (residualMax.value === 0) return props.padding + innerHeight.value / 2
    // Center at 0, scale to ±residualMax
    const normalizedValue = value / residualMax.value // -1 to +1
    return props.padding + innerHeight.value / 2 - (normalizedValue * innerHeight.value) / 2
  }
})

// Zero line Y position
const zeroLineY = computed(() => yScale.value(0))

// Scaled points for rendering
const scaledPoints = computed(() => {
  return props.residualPoints.map((p, index) => ({
    cx: xScale.value(p.x),
    cy: yScale.value(p.residual),
    originalX: p.x,
    originalResidual: p.residual,
    index,
    isPositive: p.residual >= 0,
  }))
})

// X axis ticks
const xTicks = computed(() => {
  const range = xMax.value - xMin.value
  const tickCount = 5
  const step = range / tickCount
  const ticks = []
  for (let i = 0; i <= tickCount; i++) {
    const value = xMin.value + i * step
    ticks.push({
      value,
      x: xScale.value(value),
      label: value.toFixed(1),
    })
  }
  return ticks
})

// Y axis ticks
const yTicks = computed(() => {
  const max = residualMax.value
  return [
    { value: max, y: yScale.value(max), label: max.toFixed(1) },
    { value: max / 2, y: yScale.value(max / 2), label: (max / 2).toFixed(1) },
    { value: 0, y: yScale.value(0), label: '0' },
    { value: -max / 2, y: yScale.value(-max / 2), label: (-max / 2).toFixed(1) },
    { value: -max, y: yScale.value(-max), label: (-max).toFixed(1) },
  ]
})
</script>

<template>
  <div class="residual-plot">
    <h4 class="text-sm font-medium text-text-secondary mb-2">Residual Plot (y - ŷ vs x)</h4>

    <svg
      :width="width"
      :height="height"
      class="bg-surface border border-border rounded-lg"
      data-testid="residual-plot"
    >
      <!-- Grid lines -->
      <g class="grid-lines opacity-20">
        <line
          v-for="tick in xTicks"
          :key="`x-grid-${tick.value}`"
          :x1="tick.x"
          :y1="padding"
          :x2="tick.x"
          :y2="height - padding"
          class="stroke-text-muted"
          stroke-dasharray="2,2"
        />
        <line
          v-for="tick in yTicks"
          :key="`y-grid-${tick.value}`"
          :x1="padding"
          :y1="tick.y"
          :x2="width - padding"
          :y2="tick.y"
          class="stroke-text-muted"
          stroke-dasharray="2,2"
        />
      </g>

      <!-- Zero line (should be horizontal at y=0) -->
      <line
        :x1="padding"
        :y1="zeroLineY"
        :x2="width - padding"
        :y2="zeroLineY"
        class="stroke-accent-primary"
        stroke-width="2"
        stroke-dasharray="5,5"
      />

      <!-- Axes -->
      <g class="axes">
        <line
          :x1="padding"
          :y1="height - padding"
          :x2="width - padding"
          :y2="height - padding"
          class="stroke-text-primary"
          stroke-width="1"
        />
        <line
          :x1="padding"
          :y1="padding"
          :x2="padding"
          :y2="height - padding"
          class="stroke-text-primary"
          stroke-width="1"
        />
      </g>

      <!-- X axis ticks and labels -->
      <g class="x-axis-labels">
        <g v-for="tick in xTicks" :key="`x-tick-${tick.value}`">
          <line
            :x1="tick.x"
            :y1="height - padding"
            :x2="tick.x"
            :y2="height - padding + 5"
            class="stroke-text-primary"
          />
          <text
            :x="tick.x"
            :y="height - padding + 16"
            text-anchor="middle"
            class="fill-text-secondary"
            style="font-size: 10px"
          >
            {{ tick.label }}
          </text>
        </g>
      </g>

      <!-- Y axis ticks and labels -->
      <g class="y-axis-labels">
        <g v-for="tick in yTicks" :key="`y-tick-${tick.value}`">
          <line
            :x1="padding - 5"
            :y1="tick.y"
            :x2="padding"
            :y2="tick.y"
            class="stroke-text-primary"
          />
          <text
            :x="padding - 8"
            :y="tick.y + 3"
            text-anchor="end"
            class="fill-text-secondary"
            style="font-size: 10px"
          >
            {{ tick.label }}
          </text>
        </g>
      </g>

      <!-- Residual points -->
      <g class="residual-points">
        <circle
          v-for="point in scaledPoints"
          :key="`residual-point-${point.index}`"
          :cx="point.cx"
          :cy="point.cy"
          r="5"
          :class="point.isPositive ? 'fill-emerald-500' : 'fill-red-500'"
          data-testid="residual-point"
        />
      </g>

      <!-- Axis labels -->
      <text
        :x="width / 2"
        :y="height - 4"
        text-anchor="middle"
        class="fill-text-primary text-xs"
      >
        x
      </text>
      <text
        :x="10"
        :y="height / 2"
        text-anchor="middle"
        class="fill-text-primary text-xs"
        :transform="`rotate(-90, 10, ${height / 2})`"
      >
        Residual
      </text>

      <!-- Empty state -->
      <text
        v-if="residualPoints.length === 0"
        :x="width / 2"
        :y="height / 2"
        text-anchor="middle"
        class="fill-text-muted text-sm"
      >
        No residuals to display
      </text>
    </svg>

    <p class="text-xs text-text-muted mt-2">
      Residuals should scatter randomly around zero. Patterns indicate the model may be inappropriate.
    </p>
  </div>
</template>
