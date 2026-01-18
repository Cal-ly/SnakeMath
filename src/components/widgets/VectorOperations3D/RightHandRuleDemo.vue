<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Vector3D } from '@/types/math'
import { cross, magnitude, normalize } from '@/utils/math/vector3d'
import { useIsometricProjection } from '@/composables/useIsometricProjection'

interface Props {
  vectorA: Vector3D
  vectorB: Vector3D
  /** Show animated hand gesture hint */
  showAnimation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAnimation: true,
})

const { toScreen } = useIsometricProjection({
  scale: 40,
  origin: { x: 100, y: 100 },
})

// Compute cross product
const crossProduct = computed(() => cross(props.vectorA, props.vectorB))
const crossMagnitude = computed(() => magnitude(crossProduct.value))
const isCrossZero = computed(() => crossMagnitude.value < 1e-10)

// Normalize for display (cap at 2 for visual clarity)
const displayA = computed(() => {
  const n = normalize(props.vectorA)
  return n ? { x: n.x * 2, y: n.y * 2, z: n.z * 2 } : props.vectorA
})

const displayB = computed(() => {
  const n = normalize(props.vectorB)
  return n ? { x: n.x * 2, y: n.y * 2, z: n.z * 2 } : props.vectorB
})

const displayCross = computed(() => {
  if (isCrossZero.value) return { x: 0, y: 0, z: 0 }
  const n = normalize(crossProduct.value)
  return n ? { x: n.x * 2, y: n.y * 2, z: n.z * 2 } : crossProduct.value
})

// Screen coordinates
const origin = computed(() => toScreen({ x: 0, y: 0, z: 0 }))
const endA = computed(() => toScreen(displayA.value))
const endB = computed(() => toScreen(displayB.value))
const endCross = computed(() => toScreen(displayCross.value))

// Animation state
const showStep = ref(1)
const animating = ref(false)

function startAnimation() {
  if (animating.value) return
  animating.value = true
  showStep.value = 1

  const steps = [
    () => { showStep.value = 2 },  // Show A
    () => { showStep.value = 3 },  // Curl to B
    () => { showStep.value = 4 },  // Show result
    () => { animating.value = false }, // Done
  ]

  steps.forEach((step, i) => {
    setTimeout(step, (i + 1) * 800)
  })
}
</script>

<template>
  <div class="right-hand-rule-demo" data-testid="right-hand-rule-demo">
    <div class="flex items-start gap-4">
      <!-- SVG Visualization -->
      <div class="flex-shrink-0">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          class="border border-border rounded-lg bg-surface"
          aria-label="Right-hand rule visualization showing vectors A, B, and their cross product"
        >
          <!-- Background grid hint -->
          <circle
            :cx="origin.x"
            :cy="origin.y"
            r="60"
            fill="none"
            stroke="currentColor"
            stroke-opacity="0.1"
          />

          <!-- Vector A (emerald) -->
          <g :class="{ 'opacity-30': showStep < 2 && animating }">
            <line
              :x1="origin.x"
              :y1="origin.y"
              :x2="endA.x"
              :y2="endA.y"
              stroke="#10b981"
              stroke-width="3"
              stroke-linecap="round"
            />
            <circle :cx="endA.x" :cy="endA.y" r="4" fill="#10b981" />
            <text
              :x="endA.x + 8"
              :y="endA.y"
              fill="#10b981"
              font-size="14"
              font-weight="bold"
            >
              A
            </text>
          </g>

          <!-- Vector B (violet) -->
          <g :class="{ 'opacity-30': showStep < 3 && animating }">
            <line
              :x1="origin.x"
              :y1="origin.y"
              :x2="endB.x"
              :y2="endB.y"
              stroke="#8b5cf6"
              stroke-width="3"
              stroke-linecap="round"
            />
            <circle :cx="endB.x" :cy="endB.y" r="4" fill="#8b5cf6" />
            <text
              :x="endB.x + 8"
              :y="endB.y"
              fill="#8b5cf6"
              font-size="14"
              font-weight="bold"
            >
              B
            </text>
          </g>

          <!-- Cross product (amber) -->
          <g v-if="!isCrossZero" :class="{ 'opacity-30': showStep < 4 && animating }">
            <line
              :x1="origin.x"
              :y1="origin.y"
              :x2="endCross.x"
              :y2="endCross.y"
              stroke="#f59e0b"
              stroke-width="3"
              stroke-linecap="round"
              stroke-dasharray="6,3"
            />
            <circle :cx="endCross.x" :cy="endCross.y" r="4" fill="#f59e0b" />
            <text
              :x="endCross.x + 8"
              :y="endCross.y"
              fill="#f59e0b"
              font-size="12"
              font-weight="bold"
            >
              A&times;B
            </text>
          </g>

          <!-- Origin marker -->
          <circle :cx="origin.x" :cy="origin.y" r="3" fill="currentColor" opacity="0.5" />
        </svg>
      </div>

      <!-- Instructions -->
      <div class="flex-1 min-w-0">
        <h4 class="font-semibold text-text-primary mb-2">
          <i class="fa-solid fa-hand mr-2 text-primary" aria-hidden="true" />
          Right-Hand Rule
        </h4>

        <ol class="space-y-2 text-sm text-text-secondary">
          <li :class="{ 'text-emerald-600 dark:text-emerald-400 font-medium': showStep === 2 && animating }">
            <span class="font-mono text-emerald-600 dark:text-emerald-400">1.</span>
            Point fingers in direction of <strong class="text-emerald-600">A</strong>
          </li>
          <li :class="{ 'text-violet-600 dark:text-violet-400 font-medium': showStep === 3 && animating }">
            <span class="font-mono text-violet-600 dark:text-violet-400">2.</span>
            Curl fingers toward <strong class="text-violet-600">B</strong>
          </li>
          <li :class="{ 'text-amber-600 dark:text-amber-400 font-medium': showStep === 4 && animating }">
            <span class="font-mono text-amber-600 dark:text-amber-400">3.</span>
            Thumb points in direction of <strong class="text-amber-600">A &times; B</strong>
          </li>
        </ol>

        <!-- Animate button -->
        <button
          v-if="showAnimation"
          type="button"
          class="mt-3 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          :disabled="animating"
          data-testid="animate-right-hand-btn"
          @click="startAnimation"
        >
          <i class="fa-solid fa-play mr-1" aria-hidden="true" />
          {{ animating ? 'Animating...' : 'Animate' }}
        </button>

        <!-- Parallel warning -->
        <div
          v-if="isCrossZero"
          class="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-700 dark:text-amber-300"
        >
          <i class="fa-solid fa-triangle-exclamation mr-1" aria-hidden="true" />
          Vectors are parallel &mdash; cross product is zero!
        </div>
      </div>
    </div>

    <!-- Key insight -->
    <div class="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
      <p class="text-sm text-text-secondary">
        <strong class="text-primary">Key Insight:</strong>
        The cross product <strong>A &times; B</strong> is always perpendicular to both
        <strong>A</strong> and <strong>B</strong>. Swapping order reverses direction:
        <strong>B &times; A = -(A &times; B)</strong>.
      </p>
    </div>
  </div>
</template>
