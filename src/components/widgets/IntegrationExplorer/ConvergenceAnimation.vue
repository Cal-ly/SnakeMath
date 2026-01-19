<script setup lang="ts">
/**
 * ConvergenceAnimation - Animated demonstration of Riemann sum convergence
 *
 * Features:
 * - Play/pause/reset controls
 * - Smooth n increment using requestAnimationFrame
 * - Speed control (0.5x to 3x)
 * - Real-time display of approximation and error
 *
 * D-125: Smooth n increment with easing
 */

import { ref, computed, watch, onUnmounted } from 'vue'
import { MAX_N } from '@/utils/math/integration'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  /** Current number of subdivisions */
  currentN: number
  /** Current approximation value */
  approximation: number | null
  /** Current exact value */
  exactValue: number | null
  /** Current relative error */
  relativeError: number | null
  /** Whether bounds are valid */
  isValid: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:n': [value: number]
}>()

// ============================================================================
// State
// ============================================================================

const isPlaying = ref(false)
const animationSpeed = ref(1) // 0.5, 1, 2, or 3
const startN = ref(4) // Starting n for animation
const targetN = ref(MAX_N) // Target n for animation

// Animation frame tracking
let animationFrameId: number | null = null
let lastTimestamp: number | null = null

// ============================================================================
// Computed
// ============================================================================

const progress = computed(() => {
  if (targetN.value <= startN.value) return 100
  return ((props.currentN - startN.value) / (targetN.value - startN.value)) * 100
})

const approximationDisplay = computed(() => {
  if (props.approximation === null) return '—'
  return props.approximation.toFixed(4)
})

const errorDisplay = computed(() => {
  if (props.relativeError === null) return '—'
  return (props.relativeError * 100).toFixed(2) + '%'
})

const isAtTarget = computed(() => props.currentN >= targetN.value)

// ============================================================================
// Animation Logic
// ============================================================================

/**
 * Start or resume the animation
 */
function play() {
  if (!props.isValid || isAtTarget.value) return

  isPlaying.value = true
  lastTimestamp = null
  animationFrameId = requestAnimationFrame(animate)
}

/**
 * Pause the animation
 */
function pause() {
  isPlaying.value = false
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

/**
 * Reset animation to starting n
 */
function reset() {
  pause()
  emit('update:n', startN.value)
}

/**
 * Animation frame callback
 */
function animate(timestamp: number) {
  if (!isPlaying.value) return

  if (lastTimestamp === null) {
    lastTimestamp = timestamp
  }

  const deltaTime = timestamp - lastTimestamp
  lastTimestamp = timestamp

  // Calculate n increment based on speed
  // Base rate: go from 4 to 200 in about 5 seconds at 1x speed
  const baseRate = (targetN.value - startN.value) / 5000 // n per ms
  const increment = baseRate * deltaTime * animationSpeed.value

  const newN = Math.min(targetN.value, props.currentN + increment)

  if (newN >= targetN.value) {
    emit('update:n', targetN.value)
    pause()
  } else {
    emit('update:n', Math.round(newN))
    animationFrameId = requestAnimationFrame(animate)
  }
}

/**
 * Toggle play/pause
 */
function togglePlay() {
  if (isPlaying.value) {
    pause()
  } else {
    if (isAtTarget.value) {
      // Reset first if at target
      emit('update:n', startN.value)
      // Small delay to let state update before playing
      setTimeout(() => play(), 50)
    } else {
      play()
    }
  }
}

/**
 * Set animation speed
 */
function setSpeed(speed: number) {
  animationSpeed.value = speed
}

// ============================================================================
// Watchers
// ============================================================================

// Stop animation if bounds become invalid
watch(() => props.isValid, (valid) => {
  if (!valid && isPlaying.value) {
    pause()
  }
})

// ============================================================================
// Cleanup
// ============================================================================

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="p-4 rounded-lg border border-border bg-surface-alt space-y-4">
    <h4 class="font-semibold text-primary flex items-center gap-2">
      <i class="fa-solid fa-play-circle" aria-hidden="true" />
      Convergence Animation
    </h4>

    <!-- Controls row -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Play/Pause button -->
      <button
        type="button"
        :disabled="!isValid"
        class="px-4 py-2 rounded-md font-medium transition-all
               disabled:opacity-50 disabled:cursor-not-allowed"
        :class="isPlaying
          ? 'bg-amber-500 text-white hover:bg-amber-600'
          : 'bg-primary text-white hover:bg-primary-dark'"
        @click="togglePlay"
      >
        <i
          :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
          class="mr-1.5"
          aria-hidden="true"
        />
        {{ isPlaying ? 'Pause' : (isAtTarget ? 'Replay' : 'Play') }}
      </button>

      <!-- Reset button -->
      <button
        type="button"
        :disabled="!isValid"
        class="px-3 py-2 rounded-md border border-border
               hover:border-primary hover:text-primary
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors"
        @click="reset"
      >
        <i class="fa-solid fa-rotate-left mr-1.5" aria-hidden="true" />
        Reset
      </button>

      <!-- Speed selector -->
      <div class="flex items-center gap-2 ml-auto">
        <span class="text-sm text-text-secondary">Speed:</span>
        <div class="flex rounded-md border border-border overflow-hidden">
          <button
            v-for="speed in [0.5, 1, 2, 3]"
            :key="speed"
            type="button"
            class="px-2 py-1 text-sm transition-colors"
            :class="animationSpeed === speed
              ? 'bg-primary text-white'
              : 'bg-surface hover:bg-surface-alt'"
            @click="setSpeed(speed)"
          >
            {{ speed }}x
          </button>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="space-y-1">
      <div class="flex justify-between text-xs text-text-secondary">
        <span>n = {{ startN }}</span>
        <span>n = {{ currentN }}</span>
        <span>n = {{ targetN }}</span>
      </div>
      <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary transition-all duration-100 ease-out"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- Live stats -->
    <div class="grid grid-cols-3 gap-3 text-sm">
      <div class="p-2 rounded bg-surface border border-border">
        <div class="text-xs text-text-muted mb-1">Subdivisions</div>
        <div class="font-mono font-semibold">n = {{ currentN }}</div>
      </div>
      <div class="p-2 rounded bg-surface border border-border">
        <div class="text-xs text-text-muted mb-1">Approximation</div>
        <div class="font-mono font-semibold">{{ approximationDisplay }}</div>
      </div>
      <div
        class="p-2 rounded border"
        :class="relativeError !== null && relativeError < 0.01
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-surface border-border'"
      >
        <div
class="text-xs mb-1"
          :class="relativeError !== null && relativeError < 0.01
            ? 'text-green-600 dark:text-green-400'
            : 'text-text-muted'">
          Error
        </div>
        <div
class="font-mono font-semibold"
          :class="relativeError !== null && relativeError < 0.01
            ? 'text-green-600 dark:text-green-400'
            : ''">
          {{ errorDisplay }}
        </div>
      </div>
    </div>

    <!-- Convergence hint -->
    <p class="text-xs text-text-muted">
      <i class="fa-solid fa-info-circle mr-1" aria-hidden="true" />
      Watch the error decrease as n increases. The approximation converges to the exact value!
    </p>
  </div>
</template>
