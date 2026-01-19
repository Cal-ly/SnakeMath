<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { Point } from '@/composables/useCorrelation'

interface Props {
  points: Point[]
  slope?: number
  intercept?: number
  showRegressionLine?: boolean
  showResiduals?: boolean
  outlierIndices?: number[]
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  width?: number
  height?: number
  padding?: number
  isDragging?: boolean
  draggedPointIndex?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  slope: 0,
  intercept: 0,
  showRegressionLine: true,
  showResiduals: false,
  outlierIndices: () => [],
  xMin: 0,
  xMax: 10,
  yMin: 0,
  yMax: 10,
  width: 500,
  height: 400,
  padding: 50,
  isDragging: false,
  draggedPointIndex: null,
})

const emit = defineEmits<{
  pointClick: [index: number]
  pointDragStart: [index: number]
  pointDrag: [x: number, y: number]
  pointDragEnd: []
  canvasClick: [x: number, y: number]
}>()

// Refs
const svgRef = ref<SVGSVGElement | null>(null)

// Computed dimensions
const innerWidth = computed(() => props.width - props.padding * 2)
const innerHeight = computed(() => props.height - props.padding * 2)

// Scale functions
const xScale = computed(() => {
  const range = props.xMax - props.xMin
  return (value: number) => {
    if (range === 0) return props.padding + innerWidth.value / 2
    return props.padding + ((value - props.xMin) / range) * innerWidth.value
  }
})

const yScale = computed(() => {
  const range = props.yMax - props.yMin
  return (value: number) => {
    if (range === 0) return props.padding + innerHeight.value / 2
    // Invert Y axis (SVG y increases downward)
    return props.height - props.padding - ((value - props.yMin) / range) * innerHeight.value
  }
})

// Inverse scale functions (for mouse position to data)
const inverseXScale = computed(() => {
  const range = props.xMax - props.xMin
  return (pixel: number) => {
    if (innerWidth.value === 0) return props.xMin
    return props.xMin + ((pixel - props.padding) / innerWidth.value) * range
  }
})

const inverseYScale = computed(() => {
  const range = props.yMax - props.yMin
  return (pixel: number) => {
    if (innerHeight.value === 0) return props.yMin
    return props.yMin + ((props.height - props.padding - pixel) / innerHeight.value) * range
  }
})

// Scaled points for rendering
const scaledPoints = computed(() => {
  return props.points.map((p, index) => ({
    cx: xScale.value(p.x),
    cy: yScale.value(p.y),
    originalX: p.x,
    originalY: p.y,
    index,
    isOutlier: props.outlierIndices.includes(index),
    isDragged: props.draggedPointIndex === index,
  }))
})

// Regression line endpoints
const regressionLine = computed(() => {
  if (!props.showRegressionLine) return null

  // Calculate line endpoints
  const x1 = props.xMin
  const x2 = props.xMax
  const y1 = props.slope * x1 + props.intercept
  const y2 = props.slope * x2 + props.intercept

  return {
    x1: xScale.value(x1),
    y1: yScale.value(y1),
    x2: xScale.value(x2),
    y2: yScale.value(y2),
  }
})

// Residual lines (from point to regression line)
const residualLines = computed(() => {
  if (!props.showResiduals) return []

  return props.points.map((p, index) => {
    const predictedY = props.slope * p.x + props.intercept
    return {
      x1: xScale.value(p.x),
      y1: yScale.value(p.y),
      x2: xScale.value(p.x),
      y2: yScale.value(predictedY),
      index,
    }
  })
})

// Axis ticks
const xTicks = computed(() => {
  const range = props.xMax - props.xMin
  const tickCount = 5
  const step = range / tickCount
  const ticks = []
  for (let i = 0; i <= tickCount; i++) {
    const value = props.xMin + i * step
    ticks.push({
      value,
      x: xScale.value(value),
      label: value.toFixed(1),
    })
  }
  return ticks
})

const yTicks = computed(() => {
  const range = props.yMax - props.yMin
  const tickCount = 5
  const step = range / tickCount
  const ticks = []
  for (let i = 0; i <= tickCount; i++) {
    const value = props.yMin + i * step
    ticks.push({
      value,
      y: yScale.value(value),
      label: value.toFixed(1),
    })
  }
  return ticks
})

// Event handlers
function handleSvgClick(event: MouseEvent) {
  if (props.isDragging) return

  const svg = svgRef.value
  if (!svg) return

  const rect = svg.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Check if click is within plot area
  if (
    x >= props.padding &&
    x <= props.width - props.padding &&
    y >= props.padding &&
    y <= props.height - props.padding
  ) {
    const dataX = inverseXScale.value(x)
    const dataY = inverseYScale.value(y)
    emit('canvasClick', dataX, dataY)
  }
}

function handlePointMouseDown(event: MouseEvent, index: number) {
  event.stopPropagation()
  emit('pointDragStart', index)
}

function handleMouseMove(event: MouseEvent) {
  if (!props.isDragging) return

  const svg = svgRef.value
  if (!svg) return

  const rect = svg.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Clamp to plot area
  const clampedX = Math.max(props.padding, Math.min(props.width - props.padding, x))
  const clampedY = Math.max(props.padding, Math.min(props.height - props.padding, y))

  const dataX = inverseXScale.value(clampedX)
  const dataY = inverseYScale.value(clampedY)
  emit('pointDrag', dataX, dataY)
}

function handleMouseUp() {
  if (props.isDragging) {
    emit('pointDragEnd')
  }
}

function handlePointClick(event: MouseEvent, index: number) {
  event.stopPropagation()
  emit('pointClick', index)
}

// Global mouse event handlers
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <svg
    ref="svgRef"
    :width="width"
    :height="height"
    class="scatter-plot bg-surface border border-border rounded-lg"
    data-testid="scatter-plot"
    @click="handleSvgClick"
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

    <!-- Axes -->
    <g class="axes">
      <!-- X axis -->
      <line
        :x1="padding"
        :y1="height - padding"
        :x2="width - padding"
        :y2="height - padding"
        class="stroke-text-primary"
        stroke-width="1"
      />
      <!-- Y axis -->
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
          :y="height - padding + 18"
          text-anchor="middle"
          class="fill-text-secondary text-xs"
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
          :x="padding - 10"
          :y="tick.y + 4"
          text-anchor="end"
          class="fill-text-secondary text-xs"
        >
          {{ tick.label }}
        </text>
      </g>
    </g>

    <!-- Residual lines -->
    <g v-if="showResiduals" class="residual-lines">
      <line
        v-for="line in residualLines"
        :key="`residual-${line.index}`"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        class="stroke-amber-500"
        stroke-width="1"
        stroke-dasharray="3,3"
        data-testid="residual-line"
      />
    </g>

    <!-- Regression line -->
    <line
      v-if="showRegressionLine && regressionLine && points.length >= 2"
      :x1="regressionLine.x1"
      :y1="regressionLine.y1"
      :x2="regressionLine.x2"
      :y2="regressionLine.y2"
      class="stroke-accent-primary"
      stroke-width="2"
      data-testid="regression-line"
    />

    <!-- Data points -->
    <g class="data-points">
      <g
        v-for="point in scaledPoints"
        :key="`point-${point.index}`"
        class="cursor-pointer"
        @mousedown="handlePointMouseDown($event, point.index)"
        @click="handlePointClick($event, point.index)"
      >
        <!-- Outer ring for outliers -->
        <circle
          v-if="point.isOutlier"
          :cx="point.cx"
          :cy="point.cy"
          :r="10"
          class="fill-red-500/20 stroke-red-500"
          stroke-width="2"
        />
        <!-- Main point -->
        <circle
          :cx="point.cx"
          :cy="point.cy"
          :r="point.isDragged ? 8 : 6"
          :class="[
            point.isOutlier ? 'fill-red-500' : 'fill-primary',
            point.isDragged ? 'stroke-accent-primary stroke-2' : '',
          ]"
          data-testid="data-point"
        />
      </g>
    </g>

    <!-- Axis labels -->
    <text
      :x="width / 2"
      :y="height - 8"
      text-anchor="middle"
      class="fill-text-primary text-sm font-medium"
    >
      x
    </text>
    <text
      :x="12"
      :y="height / 2"
      text-anchor="middle"
      transform="rotate(-90, 12, {{ height / 2 }})"
      class="fill-text-primary text-sm font-medium"
    >
      y
    </text>

    <!-- Instructions overlay -->
    <text
      v-if="points.length === 0"
      :x="width / 2"
      :y="height / 2"
      text-anchor="middle"
      class="fill-text-muted text-sm"
    >
      Click to add points
    </text>
  </svg>
</template>

<style scoped>
.scatter-plot {
  user-select: none;
}
</style>
