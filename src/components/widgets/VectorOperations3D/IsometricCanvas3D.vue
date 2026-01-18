<script setup lang="ts">
import { computed } from 'vue'
import type { Vector3D, Vector3DOperation } from '@/types/math'
import { useIsometricProjection } from '@/composables/useIsometricProjection'

interface Props {
  vectorA: Vector3D
  vectorB?: Vector3D
  resultVector?: Vector3D | null
  operation: Vector3DOperation
  showGrid?: boolean
  showDropLines?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  vectorB: undefined,
  resultVector: undefined,
  showGrid: true,
  showDropLines: false,
})

// SVG dimensions
const svgWidth = 400
const svgHeight = 400
const origin = { x: svgWidth / 2, y: svgHeight / 2 + 20 }

// Initialize isometric projection
const { toScreen, generateGridPath, generateMarkers, generateAxes, generateVectorPath, generateDropLine } =
  useIsometricProjection({
    scale: 35,
    origin,
  })

// Grid configuration
const gridSize = 3
const axisLength = { positiveLength: 4, negativeLength: 2 }

// Generate grid path
const gridPath = computed(() => generateGridPath(gridSize))

// Generate axis markers
const markers = computed(() => generateMarkers(3))

// Generate axes
const axes = computed(() => generateAxes(axisLength))

// Origin screen position
const originScreen = computed(() => toScreen({ x: 0, y: 0, z: 0 }))

// Vector paths
const vectorAPath = computed(() => {
  const { line, arrow } = generateVectorPath({ x: 0, y: 0, z: 0 }, props.vectorA, 10)
  return { line, arrow }
})

const vectorBPath = computed(() => {
  if (!props.vectorB) return { line: '', arrow: '' }
  const { line, arrow } = generateVectorPath({ x: 0, y: 0, z: 0 }, props.vectorB, 10)
  return { line, arrow }
})

const resultVectorPath = computed(() => {
  if (!props.resultVector) return { line: '', arrow: '' }
  return generateVectorPath({ x: 0, y: 0, z: 0 }, props.resultVector, 12)
})

// Drop lines (projection to XZ plane)
const dropLineA = computed(() => props.showDropLines ? generateDropLine(props.vectorA) : null)
const dropLineB = computed(() => props.showDropLines && props.vectorB ? generateDropLine(props.vectorB) : null)
const dropLineResult = computed(() =>
  props.showDropLines && props.resultVector ? generateDropLine(props.resultVector) : null
)

// Whether to show each vector based on operation
const showVectorA = computed(() => true)
const showVectorB = computed(() => !['magnitude', 'normalize', 'scalar'].includes(props.operation))
const showResultVector = computed(() =>
  ['add', 'subtract', 'scalar', 'normalize', 'cross'].includes(props.operation) && props.resultVector
)

// Vector end positions for labels
const vectorAEnd = computed(() => toScreen(props.vectorA))
const vectorBEnd = computed(() => props.vectorB ? toScreen(props.vectorB) : null)
const resultEnd = computed(() => props.resultVector ? toScreen(props.resultVector) : null)

// For cross product, show perpendicularity indicator
const showPerpendicularIndicator = computed(() =>
  props.operation === 'cross' && props.resultVector && props.vectorB &&
  (props.vectorA.x !== 0 || props.vectorA.y !== 0 || props.vectorA.z !== 0) &&
  (props.vectorB.x !== 0 || props.vectorB.y !== 0 || props.vectorB.z !== 0)
)
</script>

<template>
  <div class="isometric-canvas-3d" data-testid="isometric-canvas-3d">
    <svg
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      class="block max-w-full h-auto"
      aria-label="3D vector visualization using isometric projection"
      role="img"
    >
      <!-- Floor grid (XZ plane) -->
      <path
        v-if="showGrid"
        :d="gridPath"
        fill="none"
        stroke="currentColor"
        class="text-border"
        stroke-width="0.5"
        opacity="0.4"
      />

      <!-- Axes - Negative (dashed) -->
      <g class="axes-negative" opacity="0.5">
        <line
          :x1="axes.negative.x.x1"
          :y1="axes.negative.x.y1"
          :x2="axes.negative.x.x2"
          :y2="axes.negative.x.y2"
          stroke="#ef4444"
          stroke-width="1.5"
          stroke-dasharray="4 2"
        />
        <line
          :x1="axes.negative.y.x1"
          :y1="axes.negative.y.y1"
          :x2="axes.negative.y.x2"
          :y2="axes.negative.y.y2"
          stroke="#22c55e"
          stroke-width="1.5"
          stroke-dasharray="4 2"
        />
        <line
          :x1="axes.negative.z.x1"
          :y1="axes.negative.z.y1"
          :x2="axes.negative.z.x2"
          :y2="axes.negative.z.y2"
          stroke="#3b82f6"
          stroke-width="1.5"
          stroke-dasharray="4 2"
        />
      </g>

      <!-- Axes - Positive -->
      <g class="axes-positive">
        <line
          :x1="axes.positive.x.x1"
          :y1="axes.positive.x.y1"
          :x2="axes.positive.x.x2"
          :y2="axes.positive.x.y2"
          stroke="#ef4444"
          stroke-width="2"
        />
        <line
          :x1="axes.positive.y.x1"
          :y1="axes.positive.y.y1"
          :x2="axes.positive.y.x2"
          :y2="axes.positive.y.y2"
          stroke="#22c55e"
          stroke-width="2"
        />
        <line
          :x1="axes.positive.z.x1"
          :y1="axes.positive.z.y1"
          :x2="axes.positive.z.x2"
          :y2="axes.positive.z.y2"
          stroke="#3b82f6"
          stroke-width="2"
        />
      </g>

      <!-- Axis labels -->
      <text
        :x="axes.positive.x.x2 + 8"
        :y="axes.positive.x.y2 + 4"
        class="fill-red-500 text-sm font-semibold"
      >
        X
      </text>
      <text
        :x="axes.positive.y.x2 + 5"
        :y="axes.positive.y.y2 - 5"
        class="fill-green-500 text-sm font-semibold"
      >
        Y
      </text>
      <text
        :x="axes.positive.z.x2 - 12"
        :y="axes.positive.z.y2 + 4"
        class="fill-blue-500 text-sm font-semibold"
      >
        Z
      </text>

      <!-- Coordinate markers -->
      <g class="markers">
        <text
          v-for="(marker, idx) in markers"
          :key="idx"
          :x="marker.position.x + (marker.axis === 'y' ? -12 : 0)"
          :y="marker.position.y + (marker.axis === 'y' ? 4 : 12)"
          class="fill-text-muted text-[9px]"
          :text-anchor="marker.axis === 'y' ? 'end' : 'middle'"
        >
          {{ marker.label }}
        </text>
      </g>

      <!-- Drop lines (projections to XZ plane) -->
      <g v-if="showDropLines" class="drop-lines" opacity="0.3">
        <line
          v-if="dropLineA && showVectorA"
          :x1="dropLineA.x1"
          :y1="dropLineA.y1"
          :x2="dropLineA.x2"
          :y2="dropLineA.y2"
          stroke="#10b981"
          stroke-width="1"
          stroke-dasharray="3 2"
        />
        <line
          v-if="dropLineB && showVectorB"
          :x1="dropLineB.x1"
          :y1="dropLineB.y1"
          :x2="dropLineB.x2"
          :y2="dropLineB.y2"
          stroke="#8b5cf6"
          stroke-width="1"
          stroke-dasharray="3 2"
        />
        <line
          v-if="dropLineResult && showResultVector"
          :x1="dropLineResult.x1"
          :y1="dropLineResult.y1"
          :x2="dropLineResult.x2"
          :y2="dropLineResult.y2"
          stroke="#f59e0b"
          stroke-width="1"
          stroke-dasharray="3 2"
        />
      </g>

      <!-- Vector A -->
      <g v-if="showVectorA && vectorAPath.line" class="vector-a" data-testid="vector-a-3d">
        <path :d="vectorAPath.line" stroke="#10b981" stroke-width="2.5" fill="none" />
        <path :d="vectorAPath.arrow" fill="#10b981" stroke="none" />
        <text
          :x="vectorAEnd.x + 8"
          :y="vectorAEnd.y - 5"
          class="fill-emerald-600 dark:fill-emerald-400 text-sm font-semibold"
        >
          A
        </text>
      </g>

      <!-- Vector B -->
      <g v-if="showVectorB && vectorBPath.line && vectorBEnd" class="vector-b" data-testid="vector-b-3d">
        <path :d="vectorBPath.line" stroke="#8b5cf6" stroke-width="2.5" fill="none" />
        <path :d="vectorBPath.arrow" fill="#8b5cf6" stroke="none" />
        <text
          :x="vectorBEnd.x + 8"
          :y="vectorBEnd.y - 5"
          class="fill-violet-600 dark:fill-violet-400 text-sm font-semibold"
        >
          B
        </text>
      </g>

      <!-- Result Vector -->
      <g v-if="showResultVector && resultVectorPath.line && resultEnd" class="vector-result" data-testid="vector-result-3d">
        <path :d="resultVectorPath.line" stroke="#f59e0b" stroke-width="3" fill="none" />
        <path :d="resultVectorPath.arrow" fill="#f59e0b" stroke="none" />
        <text
          :x="resultEnd.x + 8"
          :y="resultEnd.y - 5"
          class="fill-amber-600 dark:fill-amber-400 text-sm font-bold"
        >
          {{ operation === 'cross' ? 'A×B' : operation === 'normalize' ? 'Â' : 'R' }}
        </text>
      </g>

      <!-- Cross product perpendicularity indicator -->
      <g v-if="showPerpendicularIndicator" class="perpendicular-indicator">
        <text
          :x="svgWidth - 10"
          :y="30"
          class="fill-text-muted text-[10px]"
          text-anchor="end"
        >
          A×B ⊥ A, B
        </text>
      </g>

      <!-- Origin point -->
      <circle :cx="originScreen.x" :cy="originScreen.y" r="4" class="fill-text-secondary" />
    </svg>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 justify-center mt-3 text-xs text-text-muted">
      <div class="flex items-center gap-1">
        <span class="w-3 h-0.5 bg-emerald-500" />
        <span>Vector A</span>
      </div>
      <div v-if="showVectorB" class="flex items-center gap-1">
        <span class="w-3 h-0.5 bg-violet-500" />
        <span>Vector B</span>
      </div>
      <div v-if="showResultVector" class="flex items-center gap-1">
        <span class="w-3 h-0.5 bg-amber-500" />
        <span>Result</span>
      </div>
    </div>

    <!-- Axis legend -->
    <div class="flex gap-3 justify-center mt-2 text-[10px] text-text-muted">
      <span class="text-red-500">X (right)</span>
      <span class="text-green-500">Y (up)</span>
      <span class="text-blue-500">Z (forward)</span>
    </div>
  </div>
</template>
