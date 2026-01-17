<script setup lang="ts">
/**
 * SecantAnimation - Animated visualization of secant lines converging to tangent
 *
 * Shows the limit definition of the derivative in action:
 * f'(x) = lim_{h→0} [f(x+h) - f(x)] / h
 *
 * D-114: Secant-to-tangent animation
 */

import { ref, computed, onUnmounted, watch } from 'vue'
import type { SecantLine } from '@/types/math'

// ============================================================================
// Props
// ============================================================================

interface Props {
  secantSequence: SecantLine[]
  tangentSlope: number | null
  pointX: number
}

const props = defineProps<Props>()

// ============================================================================
// Animation State
// ============================================================================

const isPlaying = ref(false)
const currentStep = ref(0)
let animationInterval: ReturnType<typeof setInterval> | null = null

const STEP_DURATION = 600 // ms per step

// ============================================================================
// Computed
// ============================================================================

const currentSecant = computed(() => props.secantSequence[currentStep.value] ?? null)

const displaySequence = computed(() => {
  return props.secantSequence.slice(0, currentStep.value + 1)
})

const progressPercent = computed(() => {
  if (props.secantSequence.length === 0) return 0
  return ((currentStep.value + 1) / props.secantSequence.length) * 100
})

const isComplete = computed(() => currentStep.value >= props.secantSequence.length - 1)

// ============================================================================
// Animation Controls
// ============================================================================

function startAnimation(): void {
  if (isPlaying.value) return

  // Reset if at end
  if (isComplete.value) {
    currentStep.value = 0
  }

  isPlaying.value = true
  animationInterval = setInterval(() => {
    if (currentStep.value < props.secantSequence.length - 1) {
      currentStep.value++
    } else {
      stopAnimation()
    }
  }, STEP_DURATION)
}

function stopAnimation(): void {
  isPlaying.value = false
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}

function resetAnimation(): void {
  stopAnimation()
  currentStep.value = 0
}

function stepForward(): void {
  if (currentStep.value < props.secantSequence.length - 1) {
    currentStep.value++
  }
}

function stepBackward(): void {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Reset animation when point changes
watch(
  () => props.pointX,
  () => {
    resetAnimation()
  }
)

// Cleanup on unmount
onUnmounted(() => {
  stopAnimation()
})
</script>

<template>
  <div class="secant-animation p-4 bg-surface-alt rounded-lg border border-border">
    <h4 class="text-sm font-semibold text-primary mb-3">
      <span class="mr-2" aria-hidden="true">▶</span>
      Secant → Tangent Animation
    </h4>

    <!-- Animation controls -->
    <div class="flex items-center gap-2 mb-4">
      <button
        class="p-2 rounded-lg transition-colors"
        :class="
          isPlaying
            ? 'bg-amber-500 text-white'
            : 'bg-primary text-white hover:bg-primary/90'
        "
        :aria-label="isPlaying ? 'Pause' : 'Play'"
        @click="isPlaying ? stopAnimation() : startAnimation()"
      >
        <span v-if="isPlaying">⏸</span>
        <span v-else>▶</span>
      </button>

      <button
        class="p-2 rounded-lg bg-surface hover:bg-surface-alt border border-border transition-colors"
        :disabled="currentStep === 0"
        :class="{ 'opacity-50 cursor-not-allowed': currentStep === 0 }"
        aria-label="Step backward"
        @click="stepBackward"
      >
        ◀
      </button>

      <button
        class="p-2 rounded-lg bg-surface hover:bg-surface-alt border border-border transition-colors"
        :disabled="isComplete"
        :class="{ 'opacity-50 cursor-not-allowed': isComplete }"
        aria-label="Step forward"
        @click="stepForward"
      >
        ▶
      </button>

      <button
        class="p-2 rounded-lg bg-surface hover:bg-surface-alt border border-border transition-colors"
        aria-label="Reset"
        @click="resetAnimation"
      >
        ↺
      </button>

      <!-- Progress bar -->
      <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary transition-all duration-300"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
    </div>

    <!-- Current h value display -->
    <div v-if="currentSecant" class="text-center mb-4">
      <p class="text-lg font-mono">
        h = <span class="font-bold text-amber-600">{{ currentSecant.h.toFixed(3) }}</span>
      </p>
    </div>

    <!-- Sequence table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border">
            <th class="py-2 px-3 text-left font-medium text-text-muted">h</th>
            <th class="py-2 px-3 text-left font-medium text-text-muted">Secant Slope</th>
            <th class="py-2 px-3 text-left font-medium text-text-muted">Difference</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(secant, index) in displaySequence"
            :key="index"
            class="border-b border-border/50 transition-colors"
            :class="{
              'bg-primary/10': index === currentStep,
              'opacity-50': index < currentStep,
            }"
          >
            <td class="py-2 px-3 font-mono">{{ secant.h.toFixed(3) }}</td>
            <td class="py-2 px-3 font-mono text-amber-600">
              {{ secant.slope.toFixed(6) }}
            </td>
            <td class="py-2 px-3 font-mono">
              <span
                v-if="tangentSlope !== null"
                :class="
                  Math.abs(secant.slope - tangentSlope) < 0.01
                    ? 'text-green-600'
                    : 'text-text-muted'
                "
              >
                {{ Math.abs(secant.slope - tangentSlope).toFixed(6) }}
              </span>
            </td>
          </tr>
          <!-- Target row -->
          <tr class="bg-blue-50 dark:bg-blue-900/20">
            <td class="py-2 px-3 font-mono font-bold">h → 0</td>
            <td class="py-2 px-3 font-mono font-bold text-blue-600">
              {{ tangentSlope !== null ? tangentSlope.toFixed(6) : '—' }}
            </td>
            <td class="py-2 px-3 font-mono text-blue-600 font-bold">
              0 (limit)
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Educational message -->
    <div class="mt-4 p-3 bg-primary/10 rounded-lg">
      <p class="text-sm text-text-secondary">
        <strong>Watch the pattern:</strong> As h decreases, the secant slope
        gets closer and closer to the tangent slope. The derivative
        <em>is</em> this limiting value — the instantaneous rate of change.
      </p>
    </div>
  </div>
</template>
