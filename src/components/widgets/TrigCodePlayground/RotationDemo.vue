<script setup lang="ts">
import { computed } from 'vue'
import type { Point2D } from '@/utils/math/trigApplications'

interface Props {
  angle: number
  pointX: number
  pointY: number
  rotatedPoint: Point2D
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:angle': [value: number]
  'update:pointX': [value: number]
  'update:pointY': [value: number]
}>()

// SVG settings
const width = 300
const height = 300
const centerX = width / 2
const centerY = height / 2
const scale = 1.2 // Pixels per unit

// Convert point coordinates to SVG coordinates
const originalSvgPoint = computed(() => ({
  x: centerX + props.pointX * scale,
  y: centerY - props.pointY * scale,
}))

const rotatedSvgPoint = computed(() => ({
  x: centerX + props.rotatedPoint.x * scale,
  y: centerY - props.rotatedPoint.y * scale,
}))

// Arc path for angle visualization
const arcPath = computed(() => {
  const rad = (props.angle * Math.PI) / 180
  const arcRadius = 30
  const endX = centerX + arcRadius * Math.cos(rad)
  const endY = centerY - arcRadius * Math.sin(rad)
  const largeArc = Math.abs(props.angle) > 180 ? 1 : 0
  const sweep = props.angle > 0 ? 0 : 1

  return `M ${centerX + arcRadius} ${centerY} A ${arcRadius} ${arcRadius} 0 ${largeArc} ${sweep} ${endX} ${endY}`
})

// Python code
const pythonCode = computed(() => `import math

def rotate_point(x, y, angle_deg):
    """Rotate point (x, y) by angle around origin."""
    rad = math.radians(angle_deg)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)
    return (
        x * cos_a - y * sin_a,
        x * sin_a + y * cos_a
    )

# Example
original = (${props.pointX}, ${props.pointY})
rotated = rotate_point(*original, ${props.angle})
print(f"Rotated: ({rotated[0]:.2f}, {rotated[1]:.2f})")`)

function handleAngleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:angle', parseFloat(target.value) || 0)
}

function handlePointXInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:pointX', parseFloat(target.value) || 0)
}

function handlePointYInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:pointY', parseFloat(target.value) || 0)
}
</script>

<template>
  <div class="rotation-demo" data-testid="rotation-demo">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Visualization -->
      <div class="flex justify-center">
        <svg :width="width" :height="height" class="border border-border rounded-lg bg-surface">
          <!-- Grid -->
          <line :x1="0" :y1="centerY" :x2="width" :y2="centerY" class="stroke-border" stroke-width="1" />
          <line :x1="centerX" :y1="0" :x2="centerX" :y2="height" class="stroke-border" stroke-width="1" />

          <!-- Angle arc -->
          <path :d="arcPath" fill="none" class="stroke-primary" stroke-width="2" />

          <!-- Line to original point -->
          <line
            :x1="centerX"
            :y1="centerY"
            :x2="originalSvgPoint.x"
            :y2="originalSvgPoint.y"
            class="stroke-text-muted"
            stroke-width="1"
            stroke-dasharray="4 4"
          />

          <!-- Line to rotated point -->
          <line
            :x1="centerX"
            :y1="centerY"
            :x2="rotatedSvgPoint.x"
            :y2="rotatedSvgPoint.y"
            class="stroke-primary"
            stroke-width="2"
          />

          <!-- Original point -->
          <circle
            :cx="originalSvgPoint.x"
            :cy="originalSvgPoint.y"
            r="6"
            class="fill-amber-500"
          />
          <text
            :x="originalSvgPoint.x + 10"
            :y="originalSvgPoint.y - 10"
            class="fill-amber-600 text-xs"
          >
            Original
          </text>

          <!-- Rotated point -->
          <circle
            :cx="rotatedSvgPoint.x"
            :cy="rotatedSvgPoint.y"
            r="6"
            class="fill-primary"
          />
          <text
            :x="rotatedSvgPoint.x + 10"
            :y="rotatedSvgPoint.y - 10"
            class="fill-primary text-xs"
          >
            Rotated
          </text>

          <!-- Angle label -->
          <text :x="centerX + 40" :y="centerY - 5" class="fill-text-primary text-xs">
            {{ angle }}°
          </text>
        </svg>
      </div>

      <!-- Controls -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Rotation Angle
          </label>
          <div class="flex items-center gap-3">
            <input
              type="range"
              min="-180"
              max="180"
              :value="angle"
              class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
              @input="handleAngleInput"
            />
            <input
              type="number"
              :value="angle"
              class="w-20 px-2 py-1 text-center border border-border rounded bg-surface text-text-primary"
              @input="handleAngleInput"
            />
            <span class="text-text-muted">°</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">
              Point X
            </label>
            <input
              type="number"
              :value="pointX"
              class="w-full px-2 py-1 border border-border rounded bg-surface text-text-primary"
              @input="handlePointXInput"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">
              Point Y
            </label>
            <input
              type="number"
              :value="pointY"
              class="w-full px-2 py-1 border border-border rounded bg-surface text-text-primary"
              @input="handlePointYInput"
            />
          </div>
        </div>

        <div class="p-3 bg-surface-alt rounded border border-border">
          <div class="text-sm">
            <span class="text-text-muted">Original:</span>
            <span class="font-mono ml-2">({{ pointX }}, {{ pointY }})</span>
          </div>
          <div class="text-sm mt-1">
            <span class="text-text-muted">Rotated:</span>
            <span class="font-mono ml-2 text-primary">
              ({{ rotatedPoint.x.toFixed(2) }}, {{ rotatedPoint.y.toFixed(2) }})
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
