<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Current angle in radians */
  angleRadians: number
  /** Show sine wave */
  showSin?: boolean
  /** Show cosine wave */
  showCos?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSin: true,
  showCos: true,
})

// SVG dimensions
const width = 400
const height = 120
const padding = 30
const graphWidth = width - padding * 2
const graphHeight = height - padding * 2

// X-axis range: 0 to 2π
const xMin = 0
const xMax = Math.PI * 2

// Y-axis range: -1.2 to 1.2 (slight padding)
const yMin = -1.2
const yMax = 1.2

// Coordinate transforms
function toSvgX(x: number): number {
  return padding + ((x - xMin) / (xMax - xMin)) * graphWidth
}

function toSvgY(y: number): number {
  return padding + ((yMax - y) / (yMax - yMin)) * graphHeight
}

// Generate wave path
function generateWavePath(fn: (x: number) => number): string {
  const points: string[] = []
  const samples = 100
  const step = (xMax - xMin) / samples

  for (let i = 0; i <= samples; i++) {
    const x = xMin + i * step
    const y = fn(x)
    const svgX = toSvgX(x)
    const svgY = toSvgY(y)

    if (i === 0) {
      points.push(`M ${svgX} ${svgY}`)
    } else {
      points.push(`L ${svgX} ${svgY}`)
    }
  }

  return points.join(' ')
}

const sinPath = computed(() => generateWavePath(Math.sin))
const cosPath = computed(() => generateWavePath(Math.cos))

// Current angle marker position
const markerX = computed(() => toSvgX(props.angleRadians))
const sinMarkerY = computed(() => toSvgY(Math.sin(props.angleRadians)))
const cosMarkerY = computed(() => toSvgY(Math.cos(props.angleRadians)))

// X-axis tick labels (multiples of π/2)
const xLabels = [
  { value: 0, label: '0' },
  { value: Math.PI / 2, label: 'π/2' },
  { value: Math.PI, label: 'π' },
  { value: (3 * Math.PI) / 2, label: '3π/2' },
  { value: 2 * Math.PI, label: '2π' },
]

// Y-axis tick labels
const yLabels = [-1, 0, 1]
</script>

<template>
  <div class="wave-graphs space-y-4">
    <!-- Sine Wave -->
    <div v-if="showSin" data-testid="wave-graph-sin">
      <div class="text-sm font-medium text-text-secondary mb-1">
        <span class="inline-block w-3 h-0.5 mr-2" style="background-color: #f59e0b" />
        sin(θ)
      </div>
      <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" class="wave-svg">
        <!-- Grid -->
        <g class="grid-lines">
          <!-- Horizontal line at y=0 -->
          <line
            :x1="padding"
            :y1="toSvgY(0)"
            :x2="width - padding"
            :y2="toSvgY(0)"
            class="stroke-border"
            stroke-width="1"
          />
          <!-- Vertical grid lines at π/2 intervals -->
          <line
            v-for="tick in xLabels"
            :key="`sin-grid-${tick.value}`"
            :x1="toSvgX(tick.value)"
            :y1="padding"
            :x2="toSvgX(tick.value)"
            :y2="height - padding"
            class="stroke-border"
            stroke-width="0.5"
          />
        </g>

        <!-- Sine curve -->
        <path
          :d="sinPath"
          fill="none"
          stroke="#f59e0b"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Current angle marker (vertical line) -->
        <line
          :x1="markerX"
          :y1="padding"
          :x2="markerX"
          :y2="height - padding"
          stroke="var(--color-primary)"
          stroke-width="1"
          stroke-dasharray="4 2"
        />

        <!-- Marker point on curve -->
        <circle
          :cx="markerX"
          :cy="sinMarkerY"
          r="5"
          fill="var(--color-primary)"
          data-testid="wave-marker-sin"
        />

        <!-- X-axis labels -->
        <text
          v-for="tick in xLabels"
          :key="`sin-label-${tick.value}`"
          :x="toSvgX(tick.value)"
          :y="height - 8"
          text-anchor="middle"
          class="fill-text-muted text-[10px]"
        >
          {{ tick.label }}
        </text>

        <!-- Y-axis labels -->
        <text
          v-for="y in yLabels"
          :key="`sin-y-${y}`"
          :x="padding - 8"
          :y="toSvgY(y) + 4"
          text-anchor="end"
          class="fill-text-muted text-[10px]"
        >
          {{ y }}
        </text>
      </svg>
    </div>

    <!-- Cosine Wave -->
    <div v-if="showCos" data-testid="wave-graph-cos">
      <div class="text-sm font-medium text-text-secondary mb-1">
        <span class="inline-block w-3 h-0.5 mr-2" style="background-color: #8b5cf6" />
        cos(θ)
      </div>
      <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" class="wave-svg">
        <!-- Grid -->
        <g class="grid-lines">
          <!-- Horizontal line at y=0 -->
          <line
            :x1="padding"
            :y1="toSvgY(0)"
            :x2="width - padding"
            :y2="toSvgY(0)"
            class="stroke-border"
            stroke-width="1"
          />
          <!-- Vertical grid lines at π/2 intervals -->
          <line
            v-for="tick in xLabels"
            :key="`cos-grid-${tick.value}`"
            :x1="toSvgX(tick.value)"
            :y1="padding"
            :x2="toSvgX(tick.value)"
            :y2="height - padding"
            class="stroke-border"
            stroke-width="0.5"
          />
        </g>

        <!-- Cosine curve -->
        <path
          :d="cosPath"
          fill="none"
          stroke="#8b5cf6"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Current angle marker (vertical line) -->
        <line
          :x1="markerX"
          :y1="padding"
          :x2="markerX"
          :y2="height - padding"
          stroke="var(--color-primary)"
          stroke-width="1"
          stroke-dasharray="4 2"
        />

        <!-- Marker point on curve -->
        <circle
          :cx="markerX"
          :cy="cosMarkerY"
          r="5"
          fill="var(--color-primary)"
          data-testid="wave-marker-cos"
        />

        <!-- X-axis labels -->
        <text
          v-for="tick in xLabels"
          :key="`cos-label-${tick.value}`"
          :x="toSvgX(tick.value)"
          :y="height - 8"
          text-anchor="middle"
          class="fill-text-muted text-[10px]"
        >
          {{ tick.label }}
        </text>

        <!-- Y-axis labels -->
        <text
          v-for="y in yLabels"
          :key="`cos-y-${y}`"
          :x="padding - 8"
          :y="toSvgY(y) + 4"
          text-anchor="end"
          class="fill-text-muted text-[10px]"
        >
          {{ y }}
        </text>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.wave-svg {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
