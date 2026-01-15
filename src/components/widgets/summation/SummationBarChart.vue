<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  /** Array of term values to visualize */
  terms: number[]
  /** Maximum number of terms to display */
  maxTerms?: number
  /** Whether to animate bars appearing */
  animated?: boolean
  /** Show running total line */
  showRunningTotal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxTerms: 20,
  animated: false,
  showRunningTotal: true,
})

const emit = defineEmits<{
  animationComplete: []
  barHover: [index: number, value: number]
}>()

// Animation state
const isAnimating = ref(false)
const visibleBars = ref(0)
const animationTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// Check if too many terms
const isTruncated = computed(() => props.terms.length > props.maxTerms)
const displayTerms = computed(() =>
  isTruncated.value ? props.terms.slice(0, props.maxTerms) : props.terms,
)

// Calculate bar heights and positions
const maxTerm = computed(() => Math.max(...displayTerms.value, 1))
const chartHeight = 200
const chartPadding = 20

// SVG dimensions
const svgWidth = computed(() => Math.max(displayTerms.value.length * 30 + chartPadding * 2, 300))

// Bar configurations
const bars = computed(() => {
  const barWidth = Math.max(15, Math.min(30, (svgWidth.value - chartPadding * 2) / displayTerms.value.length - 4))

  return displayTerms.value.map((term, index) => {
    const height = (term / maxTerm.value) * (chartHeight - chartPadding * 2)
    const x = chartPadding + index * (barWidth + 4)
    const y = chartHeight - chartPadding - height
    const isVisible = !props.animated || index < visibleBars.value

    return {
      index,
      term,
      x,
      y,
      width: barWidth,
      height,
      isVisible,
      opacity: isVisible ? 1 : 0,
    }
  })
})

// Running total path for animation
const runningTotalPath = computed(() => {
  if (!props.showRunningTotal || displayTerms.value.length === 0) return ''

  let total = 0
  const points: string[] = []
  const barWidth = bars.value[0]?.width || 20

  // Start at first bar position
  points.push(`M ${chartPadding} ${chartHeight - chartPadding}`)

  const termLimit = props.animated ? visibleBars.value : displayTerms.value.length

  for (let i = 0; i < termLimit; i++) {
    const term = displayTerms.value[i]
    if (term !== undefined) {
      total += term
    }
    const x = chartPadding + i * (barWidth + 4) + barWidth / 2
    const y = chartHeight - chartPadding - (total / (maxTerm.value * displayTerms.value.length)) * (chartHeight - chartPadding * 2)
    points.push(`L ${x} ${Math.max(chartPadding, y)}`)
  }

  return points.join(' ')
})

// Hover state
const hoveredBar = ref<number | null>(null)

function handleBarHover(index: number, value: number) {
  hoveredBar.value = index
  emit('barHover', index, value)
}

function handleBarLeave() {
  hoveredBar.value = null
}

// Animation controls
function startAnimation() {
  if (isAnimating.value) return

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    // Show all bars immediately
    visibleBars.value = displayTerms.value.length
    emit('animationComplete')
    return
  }

  isAnimating.value = true
  visibleBars.value = 0

  const animateNext = () => {
    if (visibleBars.value < displayTerms.value.length) {
      visibleBars.value++
      animationTimer.value = setTimeout(animateNext, 200)
    } else {
      isAnimating.value = false
      emit('animationComplete')
    }
  }

  animateNext()
}

function resetAnimation() {
  if (animationTimer.value) {
    clearTimeout(animationTimer.value)
    animationTimer.value = null
  }
  isAnimating.value = false
  visibleBars.value = props.animated ? 0 : displayTerms.value.length
}

// Initialize based on animated prop
watch(
  () => props.terms,
  () => {
    resetAnimation()
  },
  { immediate: true },
)

// Cleanup on unmount
function cleanup() {
  if (animationTimer.value) {
    clearTimeout(animationTimer.value)
  }
}

// Compute total for display
const currentTotal = computed(() => {
  const limit = props.animated ? visibleBars.value : displayTerms.value.length
  return displayTerms.value.slice(0, limit).reduce((sum, term) => sum + term, 0)
})

// Format number for display
function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toLocaleString()
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
}
</script>

<template>
  <div
    class="summation-bar-chart"
    @vue:unmounted="cleanup"
  >
    <!-- Controls -->
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-medium text-text-muted">
        <i class="fa-solid fa-chart-bar mr-1.5" aria-hidden="true" />
        Term Visualization
      </h4>

      <div class="flex items-center gap-2">
        <!-- Animation button -->
        <button
          v-if="animated || displayTerms.length > 0"
          type="button"
          class="px-3 py-1 text-xs rounded border transition-colors"
          :class="
            isAnimating
              ? 'border-red-500 text-red-500 hover:bg-red-50'
              : 'border-primary text-primary hover:bg-primary/10'
          "
          :disabled="displayTerms.length === 0"
          @click="isAnimating ? resetAnimation() : startAnimation()"
        >
          <i
            :class="isAnimating ? 'fa-solid fa-stop' : 'fa-solid fa-play'"
            class="mr-1"
            aria-hidden="true"
          />
          {{ isAnimating ? 'Stop' : 'Animate' }}
        </button>

        <!-- Running total badge -->
        <span
          v-if="showRunningTotal"
          class="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded"
        >
          Total: {{ formatNumber(currentTotal) }}
        </span>
      </div>
    </div>

    <!-- Too many terms warning -->
    <div
      v-if="isTruncated"
      class="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-700 dark:text-yellow-300"
    >
      <i class="fa-solid fa-exclamation-triangle mr-1" aria-hidden="true" />
      Showing first {{ maxTerms }} of {{ terms.length }} terms
    </div>

    <!-- Empty state -->
    <div
      v-if="displayTerms.length === 0"
      class="flex items-center justify-center h-[200px] bg-surface-alt rounded-lg"
    >
      <p class="text-text-muted">
        <i class="fa-solid fa-chart-bar mr-1" aria-hidden="true" />
        No terms to visualize
      </p>
    </div>

    <!-- Chart SVG -->
    <svg
      v-else
      :width="svgWidth"
      :height="chartHeight"
      class="w-full max-w-full"
      :viewBox="`0 0 ${svgWidth} ${chartHeight}`"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="`Bar chart showing ${displayTerms.length} terms of the sum, total ${formatNumber(currentTotal)}`"
    >
      <!-- Background -->
      <rect
        x="0"
        y="0"
        :width="svgWidth"
        :height="chartHeight"
        fill="currentColor"
        class="text-surface-alt"
        rx="8"
      />

      <!-- X-axis line -->
      <line
        :x1="chartPadding"
        :y1="chartHeight - chartPadding"
        :x2="svgWidth - chartPadding"
        :y2="chartHeight - chartPadding"
        stroke="currentColor"
        class="text-border"
        stroke-width="1"
      />

      <!-- Running total line -->
      <path
        v-if="showRunningTotal && runningTotalPath"
        :d="runningTotalPath"
        fill="none"
        stroke="currentColor"
        class="text-primary"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.5"
      />

      <!-- Bars -->
      <g v-for="bar in bars" :key="bar.index">
        <rect
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          fill="currentColor"
          class="text-primary transition-all duration-200"
          :class="{ 'opacity-30': !bar.isVisible }"
          :opacity="bar.isVisible ? (hoveredBar === bar.index ? 1 : 0.8) : 0"
          rx="2"
          @mouseenter="handleBarHover(bar.index, bar.term)"
          @mouseleave="handleBarLeave"
          @focus="handleBarHover(bar.index, bar.term)"
          @blur="handleBarLeave"
        />

        <!-- Index label -->
        <text
          v-if="bar.isVisible"
          :x="bar.x + bar.width / 2"
          :y="chartHeight - 5"
          text-anchor="middle"
          fill="currentColor"
          class="text-text-muted text-[10px]"
        >
          {{ bar.index + 1 }}
        </text>
      </g>

      <!-- Tooltip (appears on hover) -->
      <g
        v-if="hoveredBar !== null && hoveredBar < bars.length"
        :transform="`translate(${bars[hoveredBar]?.x ?? 0 + (bars[hoveredBar]?.width ?? 0) / 2}, ${(bars[hoveredBar]?.y ?? 0) - 10})`"
      >
        <rect
          x="-25"
          y="-20"
          width="50"
          height="20"
          fill="currentColor"
          class="text-text-primary"
          rx="4"
        />
        <text
          x="0"
          y="-6"
          text-anchor="middle"
          fill="currentColor"
          class="text-surface text-xs font-mono"
        >
          {{ formatNumber(bars[hoveredBar]?.term ?? 0) }}
        </text>
      </g>
    </svg>

    <!-- Accessibility text alternative -->
    <div class="sr-only">
      Bar chart showing {{ displayTerms.length }} terms.
      <template v-for="(term, index) in displayTerms" :key="index">
        Term {{ index + 1 }}: {{ term }}.
      </template>
      Total: {{ formatNumber(currentTotal) }}.
    </div>
  </div>
</template>
