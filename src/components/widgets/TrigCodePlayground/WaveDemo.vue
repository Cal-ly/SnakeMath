<script setup lang="ts">
import { computed } from 'vue'
import type { Point2D } from '@/utils/math/trigApplications'

interface Props {
  frequency: number
  amplitude: number
  phase: number
  wavePoints: Point2D[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:frequency': [value: number]
  'update:amplitude': [value: number]
  'update:phase': [value: number]
}>()

// SVG settings
const width = 400
const height = 200
const paddingX = 40
const paddingY = 20

// Scale wave points to SVG
const svgPath = computed(() => {
  if (props.wavePoints.length === 0) return ''

  const xScale = (width - 2 * paddingX) / 2 // 2 seconds duration
  const yScale = (height - 2 * paddingY) / (2 * Math.max(props.amplitude, 1))
  const centerY = height / 2

  const points = props.wavePoints.map((p, i) => {
    const x = paddingX + p.x * xScale
    const y = centerY - p.y * yScale
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  })

  return points.join(' ')
})

// Python code
const pythonCode = computed(() => `import math
import numpy as np

def sine_wave(t, frequency, amplitude, phase):
    """Generate sine wave value at time t."""
    return amplitude * math.sin(2 * math.pi * frequency * t + phase)

# Parameters
freq = ${props.frequency}      # Hz
amp = ${props.amplitude}       # Amplitude
phase = ${props.phase.toFixed(2)}  # Phase shift (radians)

# Generate wave
t = np.linspace(0, 2, 1000)  # 2 seconds
y = amp * np.sin(2 * np.pi * freq * t + phase)

# Sample value at t=0
y0 = sine_wave(0, freq, amp, phase)
print(f"Wave at t=0: {y0:.2f}")`)

function handleFrequencyInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:frequency', parseFloat(target.value) || 1)
}

function handleAmplitudeInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:amplitude', parseFloat(target.value) || 1)
}

function handlePhaseInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:phase', parseFloat(target.value) || 0)
}
</script>

<template>
  <div class="wave-demo" data-testid="wave-demo">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Visualization -->
      <div>
        <svg :width="width" :height="height" class="border border-border rounded-lg bg-surface w-full">
          <!-- Axes -->
          <line
            :x1="paddingX"
            :y1="height / 2"
            :x2="width - paddingX"
            :y2="height / 2"
            class="stroke-border"
            stroke-width="1"
          />
          <line
            :x1="paddingX"
            :y1="paddingY"
            :x2="paddingX"
            :y2="height - paddingY"
            class="stroke-border"
            stroke-width="1"
          />

          <!-- Wave path -->
          <path
            :d="svgPath"
            fill="none"
            class="stroke-primary"
            stroke-width="2"
          />

          <!-- Amplitude markers -->
          <line
            :x1="paddingX - 5"
            :y1="height / 2 - (height - 2 * paddingY) / 2"
            :x2="paddingX + 5"
            :y2="height / 2 - (height - 2 * paddingY) / 2"
            class="stroke-text-muted"
            stroke-width="1"
          />
          <text
            :x="paddingX - 10"
            :y="height / 2 - (height - 2 * paddingY) / 2 + 4"
            class="fill-text-muted text-xs"
            text-anchor="end"
          >
            +{{ amplitude }}
          </text>

          <line
            :x1="paddingX - 5"
            :y1="height / 2 + (height - 2 * paddingY) / 2"
            :x2="paddingX + 5"
            :y2="height / 2 + (height - 2 * paddingY) / 2"
            class="stroke-text-muted"
            stroke-width="1"
          />
          <text
            :x="paddingX - 10"
            :y="height / 2 + (height - 2 * paddingY) / 2 + 4"
            class="fill-text-muted text-xs"
            text-anchor="end"
          >
            -{{ amplitude }}
          </text>

          <!-- Time labels -->
          <text :x="paddingX" :y="height - 5" class="fill-text-muted text-xs">0s</text>
          <text :x="width - paddingX" :y="height - 5" class="fill-text-muted text-xs" text-anchor="end">2s</text>
        </svg>
      </div>

      <!-- Controls -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Frequency (Hz)
          </label>
          <div class="flex items-center gap-3">
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              :value="frequency"
              class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
              @input="handleFrequencyInput"
            />
            <input
              type="number"
              :value="frequency"
              step="0.5"
              min="0.1"
              class="w-20 px-2 py-1 text-center border border-border rounded bg-surface text-text-primary"
              @input="handleFrequencyInput"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Amplitude
          </label>
          <div class="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              :value="amplitude"
              class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
              @input="handleAmplitudeInput"
            />
            <input
              type="number"
              :value="amplitude"
              step="10"
              min="1"
              class="w-20 px-2 py-1 text-center border border-border rounded bg-surface text-text-primary"
              @input="handleAmplitudeInput"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Phase Shift (radians)
          </label>
          <div class="flex items-center gap-3">
            <input
              type="range"
              :min="0"
              :max="Math.PI * 2"
              :step="Math.PI / 4"
              :value="phase"
              class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
              @input="handlePhaseInput"
            />
            <span class="w-20 text-center font-mono text-sm">
              {{ (phase / Math.PI).toFixed(2) }}π
            </span>
          </div>
        </div>

        <div class="p-3 bg-surface-alt rounded border border-border text-sm">
          <div class="font-mono">
            y = {{ amplitude }} × sin(2π × {{ frequency }}t + {{ phase.toFixed(2) }})
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
