<script setup lang="ts">
import { computed } from 'vue'
import type { Vector3D } from '@/types/math'
import { useIsometricProjection } from '@/composables/useIsometricProjection'

interface TransformedCube {
  v000: Vector3D
  v100: Vector3D
  v110: Vector3D
  v010: Vector3D
  v001: Vector3D
  v101: Vector3D
  v111: Vector3D
  v011: Vector3D
}

interface Props {
  transformedCube: TransformedCube
  transformedI: Vector3D
  transformedJ: Vector3D
  transformedK: Vector3D
  showOriginal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showOriginal: true,
})

// SVG dimensions
const svgWidth = 400
const svgHeight = 400
const origin = { x: svgWidth / 2, y: svgHeight / 2 + 20 }

// Initialize isometric projection
const { toScreen, generateGridPath, generateAxes } = useIsometricProjection({
  scale: 50,
  origin,
})

// Grid configuration
const gridSize = 2
const axisLength = { positiveLength: 3, negativeLength: 1 }

// Generate grid path
const gridPath = computed(() => generateGridPath(gridSize))

// Generate axes
const axes = computed(() => generateAxes(axisLength))

// Origin screen position
const originScreen = computed(() => toScreen({ x: 0, y: 0, z: 0 }))

// Original unit cube vertices (before transformation)
const originalCube = {
  v000: { x: 0, y: 0, z: 0 },
  v100: { x: 1, y: 0, z: 0 },
  v110: { x: 1, y: 1, z: 0 },
  v010: { x: 0, y: 1, z: 0 },
  v001: { x: 0, y: 0, z: 1 },
  v101: { x: 1, y: 0, z: 1 },
  v111: { x: 1, y: 1, z: 1 },
  v011: { x: 0, y: 1, z: 1 },
}

// Screen coordinates for original cube
const originalScreen = computed(() => ({
  v000: toScreen(originalCube.v000),
  v100: toScreen(originalCube.v100),
  v110: toScreen(originalCube.v110),
  v010: toScreen(originalCube.v010),
  v001: toScreen(originalCube.v001),
  v101: toScreen(originalCube.v101),
  v111: toScreen(originalCube.v111),
  v011: toScreen(originalCube.v011),
}))

// Screen coordinates for transformed cube
const transformedScreen = computed(() => ({
  v000: toScreen(props.transformedCube.v000),
  v100: toScreen(props.transformedCube.v100),
  v110: toScreen(props.transformedCube.v110),
  v010: toScreen(props.transformedCube.v010),
  v001: toScreen(props.transformedCube.v001),
  v101: toScreen(props.transformedCube.v101),
  v111: toScreen(props.transformedCube.v111),
  v011: toScreen(props.transformedCube.v011),
}))

// Screen cube vertices type
interface ScreenCube {
  v000: { x: number; y: number }
  v100: { x: number; y: number }
  v110: { x: number; y: number }
  v010: { x: number; y: number }
  v001: { x: number; y: number }
  v101: { x: number; y: number }
  v111: { x: number; y: number }
  v011: { x: number; y: number }
}

// Generate cube face paths
function generateCubePath(vertices: ScreenCube): string {
  // Bottom face
  const bottom = `M${vertices.v000.x},${vertices.v000.y}L${vertices.v100.x},${vertices.v100.y}L${vertices.v110.x},${vertices.v110.y}L${vertices.v010.x},${vertices.v010.y}Z`
  // Top face
  const top = `M${vertices.v001.x},${vertices.v001.y}L${vertices.v101.x},${vertices.v101.y}L${vertices.v111.x},${vertices.v111.y}L${vertices.v011.x},${vertices.v011.y}Z`
  // Vertical edges
  const edges = [
    `M${vertices.v000.x},${vertices.v000.y}L${vertices.v001.x},${vertices.v001.y}`,
    `M${vertices.v100.x},${vertices.v100.y}L${vertices.v101.x},${vertices.v101.y}`,
    `M${vertices.v110.x},${vertices.v110.y}L${vertices.v111.x},${vertices.v111.y}`,
    `M${vertices.v010.x},${vertices.v010.y}L${vertices.v011.x},${vertices.v011.y}`,
  ].join(' ')
  return `${bottom} ${top} ${edges}`
}

const originalPath = computed(() => generateCubePath(originalScreen.value))
const transformedPath = computed(() => generateCubePath(transformedScreen.value))

// Transformed basis vectors (for showing direction)
const iEnd = computed(() => toScreen(props.transformedI))
const jEnd = computed(() => toScreen(props.transformedJ))
const kEnd = computed(() => toScreen(props.transformedK))
</script>

<template>
  <div class="unit-cube-canvas-3d" data-testid="unit-cube-canvas-3d">
    <svg
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      class="block max-w-full h-auto"
      aria-label="3D unit cube transformation visualization"
      role="img"
    >
      <!-- Floor grid (XZ plane) -->
      <path
        :d="gridPath"
        fill="none"
        stroke="currentColor"
        class="text-border"
        stroke-width="0.5"
        opacity="0.3"
      />

      <!-- Axes - Negative (dashed) -->
      <g class="axes-negative" opacity="0.4">
        <line
          :x1="axes.negative.x.x1"
          :y1="axes.negative.x.y1"
          :x2="axes.negative.x.x2"
          :y2="axes.negative.x.y2"
          stroke="#ef4444"
          stroke-width="1"
          stroke-dasharray="4 2"
        />
        <line
          :x1="axes.negative.y.x1"
          :y1="axes.negative.y.y1"
          :x2="axes.negative.y.x2"
          :y2="axes.negative.y.y2"
          stroke="#22c55e"
          stroke-width="1"
          stroke-dasharray="4 2"
        />
        <line
          :x1="axes.negative.z.x1"
          :y1="axes.negative.z.y1"
          :x2="axes.negative.z.x2"
          :y2="axes.negative.z.y2"
          stroke="#3b82f6"
          stroke-width="1"
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
          stroke-width="1.5"
        />
        <line
          :x1="axes.positive.y.x1"
          :y1="axes.positive.y.y1"
          :x2="axes.positive.y.x2"
          :y2="axes.positive.y.y2"
          stroke="#22c55e"
          stroke-width="1.5"
        />
        <line
          :x1="axes.positive.z.x1"
          :y1="axes.positive.z.y1"
          :x2="axes.positive.z.x2"
          :y2="axes.positive.z.y2"
          stroke="#3b82f6"
          stroke-width="1.5"
        />
      </g>

      <!-- Axis labels -->
      <text :x="axes.positive.x.x2 + 5" :y="axes.positive.x.y2 + 4" class="fill-red-500 text-xs font-semibold">
        X
      </text>
      <text :x="axes.positive.y.x2 + 5" :y="axes.positive.y.y2 - 3" class="fill-green-500 text-xs font-semibold">
        Y
      </text>
      <text :x="axes.positive.z.x2 - 10" :y="axes.positive.z.y2 + 4" class="fill-blue-500 text-xs font-semibold">
        Z
      </text>

      <!-- Original unit cube (ghost) -->
      <g v-if="showOriginal" class="original-cube" opacity="0.3">
        <path
          :d="originalPath"
          fill="none"
          stroke="currentColor"
          class="text-text-muted"
          stroke-width="1"
          stroke-dasharray="3 2"
        />
      </g>

      <!-- Transformed cube -->
      <g class="transformed-cube" data-testid="transformed-cube">
        <path
          :d="transformedPath"
          fill="none"
          stroke="#f59e0b"
          stroke-width="2"
        />
        <!-- Highlight transformed basis vectors -->
        <line
          :x1="originScreen.x"
          :y1="originScreen.y"
          :x2="iEnd.x"
          :y2="iEnd.y"
          stroke="#ef4444"
          stroke-width="2.5"
        />
        <line
          :x1="originScreen.x"
          :y1="originScreen.y"
          :x2="jEnd.x"
          :y2="jEnd.y"
          stroke="#22c55e"
          stroke-width="2.5"
        />
        <line
          :x1="originScreen.x"
          :y1="originScreen.y"
          :x2="kEnd.x"
          :y2="kEnd.y"
          stroke="#3b82f6"
          stroke-width="2.5"
        />
      </g>

      <!-- Origin point -->
      <circle :cx="originScreen.x" :cy="originScreen.y" r="4" class="fill-text-secondary" />
    </svg>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 justify-center mt-3 text-xs text-text-muted">
      <div v-if="showOriginal" class="flex items-center gap-1">
        <span class="w-4 h-0.5 border-t border-dashed border-text-muted" />
        <span>Original</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-4 h-0.5 bg-amber-500" />
        <span>Transformed</span>
      </div>
    </div>

    <!-- Axis legend -->
    <div class="flex gap-3 justify-center mt-2 text-[10px] text-text-muted">
      <span class="text-red-500">X (i)</span>
      <span class="text-green-500">Y (j)</span>
      <span class="text-blue-500">Z (k)</span>
    </div>
  </div>
</template>
