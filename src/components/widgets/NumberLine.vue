<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** The number to display on the line */
  value: number | null
  /** Minimum value to show */
  min?: number
  /** Maximum value to show */
  max?: number
  /** Whether to auto-zoom to fit the value */
  autoZoom?: boolean
  /** Show tick marks */
  showTicks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: -10,
  max: 10,
  autoZoom: true,
  showTicks: true,
})

// Calculate display range based on value
const displayRange = computed(() => {
  if (!props.autoZoom || props.value === null || !Number.isFinite(props.value)) {
    return { min: props.min, max: props.max }
  }

  const absValue = Math.abs(props.value)

  // If value fits in default range, use it
  if (absValue <= Math.max(Math.abs(props.min), Math.abs(props.max))) {
    return { min: props.min, max: props.max }
  }

  // Auto-scale with some padding
  const padding = absValue * 0.2
  const newMax = Math.ceil(absValue + padding)
  return { min: -newMax, max: newMax }
})

// Calculate position as percentage
const valuePosition = computed(() => {
  if (props.value === null || !Number.isFinite(props.value)) return null

  const { min, max } = displayRange.value
  const range = max - min
  const position = ((props.value - min) / range) * 100

  // Clamp to 0-100
  return Math.max(0, Math.min(100, position))
})

// Generate tick marks
const ticks = computed(() => {
  if (!props.showTicks) return []

  const { min, max } = displayRange.value
  const range = max - min

  // Determine nice tick interval
  const rawInterval = range / 10
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)))
  const normalized = rawInterval / magnitude

  let interval: number
  if (normalized < 1.5) interval = magnitude
  else if (normalized < 3) interval = 2 * magnitude
  else if (normalized < 7) interval = 5 * magnitude
  else interval = 10 * magnitude

  // Generate ticks
  const tickList: { value: number; position: number; label: string }[] = []
  const start = Math.ceil(min / interval) * interval

  for (let v = start; v <= max; v += interval) {
    const position = ((v - min) / range) * 100
    const label = Number.isInteger(v) ? v.toString() : v.toFixed(1)
    tickList.push({ value: v, position, label })
  }

  return tickList
})

// Check if value is out of bounds
const isOutOfBounds = computed(() => {
  if (props.value === null || !Number.isFinite(props.value)) return false
  const { min, max } = displayRange.value
  return props.value < min || props.value > max
})

// Format display value
const displayValue = computed(() => {
  if (props.value === null) return null
  if (!Number.isFinite(props.value)) return null
  if (Number.isInteger(props.value)) return props.value.toString()
  return props.value.toFixed(4).replace(/\.?0+$/, '')
})
</script>

<template>
  <div
    class="number-line"
    role="img"
    data-testid="number-line"
    :aria-label="value !== null ? `Number line showing ${value}` : 'Number line'"
  >
    <!-- Line container -->
    <div class="relative h-16 mx-4">
      <!-- Main line -->
      <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

      <!-- Zero marker (if in range) -->
      <div
        v-if="displayRange.min <= 0 && displayRange.max >= 0"
        class="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-text-muted"
        :style="{
          left: `${((0 - displayRange.min) / (displayRange.max - displayRange.min)) * 100}%`,
        }"
      />

      <!-- Tick marks -->
      <template v-if="showTicks">
        <div
          v-for="tick in ticks"
          :key="tick.value"
          class="absolute top-1/2"
          :style="{ left: `${tick.position}%` }"
        >
          <!-- Tick line -->
          <div
            class="w-px h-3 -translate-y-1/2"
            :class="tick.value === 0 ? 'bg-text-primary h-4' : 'bg-text-muted'"
          />
          <!-- Tick label -->
          <span
            class="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-text-muted whitespace-nowrap"
          >
            {{ tick.label }}
          </span>
        </div>
      </template>

      <!-- Value marker -->
      <div
        v-if="valuePosition !== null"
        class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
        :style="{ left: `${valuePosition}%` }"
      >
        <!-- Marker point -->
        <div class="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg" />

        <!-- Value label -->
        <div
          class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-white text-sm rounded whitespace-nowrap"
        >
          {{ displayValue }}
        </div>
      </div>

      <!-- Direction arrows -->
      <div class="absolute top-1/2 -translate-y-1/2 -left-2 text-text-muted">
        <i class="fa-solid fa-caret-left" aria-hidden="true" />
      </div>
      <div class="absolute top-1/2 -translate-y-1/2 -right-2 text-text-muted">
        <i class="fa-solid fa-caret-right" aria-hidden="true" />
      </div>
    </div>

    <!-- Out of bounds indicator -->
    <p v-if="isOutOfBounds" class="text-xs text-text-muted text-center mt-2">
      Value extends beyond visible range
    </p>

    <!-- No value indicator -->
    <p v-else-if="value === null" class="text-xs text-text-muted text-center mt-2">
      Enter a real number to see its position
    </p>

    <!-- Infinity/NaN indicator -->
    <p v-else-if="!Number.isFinite(value)" class="text-xs text-text-muted text-center mt-2">
      {{
        value === Infinity
          ? '∞ extends infinitely right'
          : value === -Infinity
            ? '-∞ extends infinitely left'
            : 'Not a finite number'
      }}
    </p>
  </div>
</template>

<style scoped>
.number-line {
  @apply py-4;
}
</style>
