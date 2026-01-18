<script setup lang="ts">
import { computed } from 'vue'
import type { Point2D } from '@/utils/math/trigApplications'

interface Props {
  speed: number
  angle: number
  trajectory: Point2D[]
  range: number
  maxHeight: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:speed': [value: number]
  'update:angle': [value: number]
}>()

// SVG settings
const width = 400
const height = 250
const paddingX = 40
const paddingY = 30

// Scale trajectory to fit SVG
const scaledTrajectory = computed(() => {
  if (props.trajectory.length === 0) return ''

  const maxX = Math.max(props.range, 1)
  const maxY = Math.max(props.maxHeight, 1)

  const xScale = (width - 2 * paddingX) / maxX
  const yScale = (height - 2 * paddingY) / maxY

  const points = props.trajectory.map((p, i) => {
    const x = paddingX + p.x * xScale
    const y = height - paddingY - p.y * yScale
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  })

  return points.join(' ')
})

// Launch vector line
const launchLine = computed(() => {
  const length = 50
  const rad = (props.angle * Math.PI) / 180
  const endX = paddingX + length * Math.cos(rad)
  const endY = height - paddingY - length * Math.sin(rad)
  return { x1: paddingX, y1: height - paddingY, x2: endX, y2: endY }
})

// Python code
const pythonCode = computed(() => `import math

def projectile_position(t, speed, angle_deg, gravity=9.8):
    """
    Calculate projectile position at time t.
    Returns (x, y) coordinates.
    """
    rad = math.radians(angle_deg)
    vx = speed * math.cos(rad)
    vy = speed * math.sin(rad)

    x = vx * t
    y = vy * t - 0.5 * gravity * t * t
    return x, y

def projectile_range(speed, angle_deg, gravity=9.8):
    """Calculate horizontal range."""
    rad = math.radians(angle_deg)
    return (speed ** 2 * math.sin(2 * rad)) / gravity

def max_height(speed, angle_deg, gravity=9.8):
    """Calculate maximum height."""
    rad = math.radians(angle_deg)
    vy = speed * math.sin(rad)
    return (vy ** 2) / (2 * gravity)

# Parameters
speed = ${props.speed}  # m/s
angle = ${props.angle}  # degrees

# Calculate
r = projectile_range(speed, angle)
h = max_height(speed, angle)
print(f"Range: {r:.2f}m, Max Height: {h:.2f}m")`)

function handleSpeedInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:speed', parseFloat(target.value) || 20)
}

function handleAngleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:angle', parseFloat(target.value) || 45)
}
</script>

<template>
  <div class="projectile-demo" data-testid="projectile-demo">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Visualization -->
      <div>
        <svg :width="width" :height="height" class="border border-border rounded-lg bg-surface w-full">
          <!-- Ground line -->
          <line
            :x1="paddingX"
            :y1="height - paddingY"
            :x2="width - paddingX"
            :y2="height - paddingY"
            class="stroke-text-muted"
            stroke-width="2"
          />

          <!-- Trajectory -->
          <path
            :d="scaledTrajectory"
            fill="none"
            class="stroke-primary"
            stroke-width="2"
          />

          <!-- Launch direction arrow -->
          <line
            :x1="launchLine.x1"
            :y1="launchLine.y1"
            :x2="launchLine.x2"
            :y2="launchLine.y2"
            class="stroke-amber-500"
            stroke-width="2"
            marker-end="url(#arrowhead)"
          />

          <!-- Arrow marker definition -->
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" class="fill-amber-500" />
            </marker>
          </defs>

          <!-- Launch point -->
          <circle
            :cx="paddingX"
            :cy="height - paddingY"
            r="5"
            class="fill-amber-500"
          />

          <!-- Angle arc -->
          <path
            :d="`M ${paddingX + 25} ${height - paddingY} A 25 25 0 0 0 ${paddingX + 25 * Math.cos(angle * Math.PI / 180)} ${height - paddingY - 25 * Math.sin(angle * Math.PI / 180)}`"
            fill="none"
            class="stroke-amber-500"
            stroke-width="1"
          />
          <text
            :x="paddingX + 35"
            :y="height - paddingY - 15"
            class="fill-amber-600 text-xs"
          >
            {{ angle }}°
          </text>

          <!-- Labels -->
          <text :x="paddingX" :y="height - 5" class="fill-text-muted text-xs">0</text>
          <text :x="width - paddingX" :y="height - 5" class="fill-text-muted text-xs" text-anchor="end">
            {{ range.toFixed(1) }}m
          </text>
        </svg>
      </div>

      <!-- Controls -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Launch Speed (m/s)
          </label>
          <div class="flex items-center gap-3">
            <input
              type="range"
              min="5"
              max="50"
              :value="speed"
              class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
              @input="handleSpeedInput"
            />
            <input
              type="number"
              :value="speed"
              min="1"
              class="w-20 px-2 py-1 text-center border border-border rounded bg-surface text-text-primary"
              @input="handleSpeedInput"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Launch Angle
          </label>
          <div class="flex items-center gap-3">
            <input
              type="range"
              min="5"
              max="85"
              :value="angle"
              class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
              @input="handleAngleInput"
            />
            <input
              type="number"
              :value="angle"
              min="1"
              max="89"
              class="w-20 px-2 py-1 text-center border border-border rounded bg-surface text-text-primary"
              @input="handleAngleInput"
            />
            <span class="text-text-muted">°</span>
          </div>
        </div>

        <div class="p-3 bg-surface-alt rounded border border-border">
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-text-muted">Range:</span>
              <span class="font-mono ml-2 text-primary">{{ range.toFixed(2) }}m</span>
            </div>
            <div>
              <span class="text-text-muted">Max Height:</span>
              <span class="font-mono ml-2 text-primary">{{ maxHeight.toFixed(2) }}m</span>
            </div>
          </div>
          <div class="mt-2 text-xs text-text-muted">
            <i class="fa-solid fa-lightbulb mr-1 text-amber-500" aria-hidden="true" />
            45° gives maximum range on flat ground!
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
