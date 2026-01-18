<script setup lang="ts">
import { computed } from 'vue'
import type { Point2D } from '@/utils/math/trigApplications'

interface Props {
  radius: number
  period: number
  time: number
  position: Point2D
  isAnimating: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:radius': [value: number]
  'update:period': [value: number]
  toggleAnimation: []
  reset: []
}>()

// SVG settings
const width = 300
const height = 300
const centerX = width / 2
const centerY = height / 2

// Convert position to SVG coordinates
const svgPosition = computed(() => ({
  x: centerX + props.position.x,
  y: centerY - props.position.y,
}))

// Trail points for visualization
const trailPath = computed(() => {
  const points: string[] = []
  const numPoints = 60
  const angularSpeed = (2 * Math.PI) / props.period

  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * props.period
    const angle = angularSpeed * t
    const x = centerX + props.radius * Math.cos(angle)
    const y = centerY - props.radius * Math.sin(angle)
    points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`)
  }

  return points.join(' ') + ' Z'
})

// Python code
const pythonCode = computed(() => `import math

def circular_motion(t, radius, period):
    """
    Position on circle at time t.
    Returns (x, y) coordinates.
    """
    angular_speed = 2 * math.pi / period
    angle = angular_speed * t
    x = radius * math.cos(angle)
    y = radius * math.sin(angle)
    return x, y

# Parameters
radius = ${props.radius}
period = ${props.period}  # seconds for one complete orbit

# Calculate position at t = ${props.time.toFixed(2)}
t = ${props.time.toFixed(2)}
x, y = circular_motion(t, radius, period)
print(f"Position: ({x:.2f}, {y:.2f})")`)

function handleRadiusInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:radius', parseFloat(target.value) || 80)
}

function handlePeriodInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:period', parseFloat(target.value) || 5)
}
</script>

<template>
  <div class="circular-demo" data-testid="circular-demo">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Visualization -->
      <div class="flex justify-center">
        <svg :width="width" :height="height" class="border border-border rounded-lg bg-surface">
          <!-- Axes -->
          <line :x1="0" :y1="centerY" :x2="width" :y2="centerY" class="stroke-border" stroke-width="1" />
          <line :x1="centerX" :y1="0" :x2="centerX" :y2="height" class="stroke-border" stroke-width="1" />

          <!-- Orbit path -->
          <path
            :d="trailPath"
            fill="none"
            class="stroke-text-muted"
            stroke-width="1"
            stroke-dasharray="4 4"
          />

          <!-- Line from center to position -->
          <line
            :x1="centerX"
            :y1="centerY"
            :x2="svgPosition.x"
            :y2="svgPosition.y"
            class="stroke-primary"
            stroke-width="2"
          />

          <!-- Center point -->
          <circle :cx="centerX" :cy="centerY" r="4" class="fill-text-muted" />

          <!-- Orbiting point -->
          <circle
            :cx="svgPosition.x"
            :cy="svgPosition.y"
            r="8"
            class="fill-primary"
          />

          <!-- Radius label -->
          <text
            :x="centerX + radius / 2"
            :y="centerY - 10"
            class="fill-text-muted text-xs"
          >
            r={{ radius }}
          </text>
        </svg>
      </div>

      <!-- Controls -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Radius
          </label>
          <div class="flex items-center gap-3">
            <input
              type="range"
              min="30"
              max="120"
              :value="radius"
              class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
              @input="handleRadiusInput"
            />
            <input
              type="number"
              :value="radius"
              min="10"
              class="w-20 px-2 py-1 text-center border border-border rounded bg-surface text-text-primary"
              @input="handleRadiusInput"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Period (seconds)
          </label>
          <div class="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              :value="period"
              class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
              @input="handlePeriodInput"
            />
            <input
              type="number"
              :value="period"
              step="0.5"
              min="0.5"
              class="w-20 px-2 py-1 text-center border border-border rounded bg-surface text-text-primary"
              @input="handlePeriodInput"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <button
            class="px-4 py-2 rounded border transition-colors"
            :class="[
              isAnimating
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-primary text-white border-primary',
            ]"
            @click="emit('toggleAnimation')"
          >
            <i :class="isAnimating ? 'fa-solid fa-pause' : 'fa-solid fa-play'" aria-hidden="true" class="mr-2" />
            {{ isAnimating ? 'Pause' : 'Play' }}
          </button>
          <button
            class="px-4 py-2 rounded border border-border hover:border-primary transition-colors"
            @click="emit('reset')"
          >
            <i class="fa-solid fa-rotate-left mr-2" aria-hidden="true" />
            Reset
          </button>
        </div>

        <div class="p-3 bg-surface-alt rounded border border-border">
          <div class="text-sm">
            <span class="text-text-muted">Time:</span>
            <span class="font-mono ml-2">{{ time.toFixed(2) }}s</span>
          </div>
          <div class="text-sm mt-1">
            <span class="text-text-muted">Position:</span>
            <span class="font-mono ml-2 text-primary">
              ({{ position.x.toFixed(2) }}, {{ position.y.toFixed(2) }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Python code -->
    <div class="mt-4 p-3 bg-surface-alt rounded border border-border">
      <div class="text-sm font-medium text-text-secondary mb-2">
        <i class="fa-brands fa-python mr-2" aria-hidden="true" />
        Python
      </div>
      <pre class="text-xs font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap">{{ pythonCode }}</pre>
    </div>
  </div>
</template>
