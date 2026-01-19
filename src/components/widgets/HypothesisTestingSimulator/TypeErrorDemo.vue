<script setup lang="ts">
import { computed } from 'vue'
import type { DistributionCurvePoint } from '@/composables/useHypothesisTesting'

interface Props {
  alpha: number
  beta: number
  power: number
  effectSize: number
  sampleSize: number
  nullCurve: DistributionCurvePoint[]
  alternativeCurve: DistributionCurvePoint[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:alpha': [value: number]
  'update:effectSize': [value: number]
  'update:sampleSize': [value: number]
}>()

// SVG dimensions
const width = 450
const height = 220
const padding = { top: 20, right: 30, bottom: 50, left: 40 }
const chartWidth = width - padding.left - padding.right
const chartHeight = height - padding.top - padding.bottom

// Calculate x range based on effect size
const xMin = computed(() => -3.5)
const xMax = computed(() => Math.max(4, props.effectSize + 3.5))

// Scale functions
const xScale = (x: number) =>
  ((x - xMin.value) / (xMax.value - xMin.value)) * chartWidth + padding.left

const yScale = (y: number, maxY: number) =>
  padding.top + chartHeight - (y / maxY) * chartHeight

// Max Y for both curves
const maxY = computed(() => {
  const nullMax = Math.max(...props.nullCurve.map((p) => p.y))
  const altMax = Math.max(...props.alternativeCurve.map((p) => p.y))
  return Math.max(nullMax, altMax) * 1.1
})

// Critical value (z for simplicity)
const _criticalZ = computed(() => {
  // Two-tailed critical value for given alpha
  // Using normal approximation
  return 1.96 * Math.sqrt(2 / props.sampleSize) * (props.alpha === 0.05 ? 1 : props.alpha === 0.01 ? 1.28 : 0.84)
})

// Curve paths
const nullPath = computed(() => {
  if (props.nullCurve.length === 0) return ''
  return props.nullCurve
    .filter((p) => p.x >= xMin.value && p.x <= xMax.value)
    .map((point, i) => {
      const x = xScale(point.x)
      const y = yScale(point.y, maxY.value)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
})

const altPath = computed(() => {
  if (props.alternativeCurve.length === 0) return ''
  return props.alternativeCurve
    .filter((p) => p.x >= xMin.value && p.x <= xMax.value)
    .map((point, i) => {
      const x = xScale(point.x)
      const y = yScale(point.y, maxY.value)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
})

// Alpha region (Type I error) - right tail of null
const alphaPath = computed(() => {
  const critX = 1.96 // Simplified critical z
  const points = props.nullCurve.filter((p) => p.x >= critX && p.x <= xMax.value)
  if (points.length === 0) return ''

  return (
    `M ${xScale(points[0]!.x)} ${yScale(0, maxY.value)} ` +
    points.map((p) => `L ${xScale(p.x)} ${yScale(p.y, maxY.value)}`).join(' ') +
    ` L ${xScale(points[points.length - 1]!.x)} ${yScale(0, maxY.value)} Z`
  )
})

// Beta region (Type II error) - left part of alternative under null
const betaPath = computed(() => {
  const critX = 1.96
  const points = props.alternativeCurve.filter((p) => p.x <= critX && p.x >= xMin.value)
  if (points.length === 0) return ''

  return (
    `M ${xScale(points[0]!.x)} ${yScale(0, maxY.value)} ` +
    points.map((p) => `L ${xScale(p.x)} ${yScale(p.y, maxY.value)}`).join(' ') +
    ` L ${xScale(points[points.length - 1]!.x)} ${yScale(0, maxY.value)} Z`
  )
})

// Power region (1-beta) - right part of alternative
const powerPath = computed(() => {
  const critX = 1.96
  const points = props.alternativeCurve.filter((p) => p.x >= critX && p.x <= xMax.value)
  if (points.length === 0) return ''

  return (
    `M ${xScale(points[0]!.x)} ${yScale(0, maxY.value)} ` +
    points.map((p) => `L ${xScale(p.x)} ${yScale(p.y, maxY.value)}`).join(' ') +
    ` L ${xScale(points[points.length - 1]!.x)} ${yScale(0, maxY.value)} Z`
  )
})

function handleAlphaChange(e: Event) {
  const value = parseFloat((e.target as HTMLInputElement).value)
  emit('update:alpha', value)
}

function handleEffectSizeChange(e: Event) {
  const value = parseFloat((e.target as HTMLInputElement).value)
  emit('update:effectSize', value)
}

function handleSampleSizeChange(e: Event) {
  const value = parseInt((e.target as HTMLInputElement).value, 10)
  emit('update:sampleSize', value)
}
</script>

<template>
  <div class="space-y-4" data-testid="type-error-demo">
    <h3 class="text-lg font-semibold text-text-primary">Type I & II Errors</h3>

    <p class="text-sm text-text-secondary">
      See how significance level (α), effect size, and sample size affect error rates.
    </p>

    <!-- Controls -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Alpha slider -->
      <div>
        <label for="alpha-slider" class="block text-sm text-text-secondary mb-1">
          Significance (α): {{ alpha.toFixed(2) }}
        </label>
        <input
          id="alpha-slider"
          type="range"
          :value="alpha"
          min="0.01"
          max="0.2"
          step="0.01"
          class="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent-primary"
          data-testid="type-error-alpha-slider"
          @input="handleAlphaChange"
        />
      </div>

      <!-- Effect size slider -->
      <div>
        <label for="effect-slider" class="block text-sm text-text-secondary mb-1">
          Effect Size (d): {{ effectSize.toFixed(2) }}
        </label>
        <input
          id="effect-slider"
          type="range"
          :value="effectSize"
          min="0.1"
          max="2"
          step="0.1"
          class="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent-primary"
          data-testid="type-error-effect-slider"
          @input="handleEffectSizeChange"
        />
      </div>

      <!-- Sample size slider -->
      <div>
        <label for="sample-slider" class="block text-sm text-text-secondary mb-1">
          Sample Size (n): {{ sampleSize }}
        </label>
        <input
          id="sample-slider"
          type="range"
          :value="sampleSize"
          min="10"
          max="200"
          step="5"
          class="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent-primary"
          data-testid="type-error-sample-slider"
          @input="handleSampleSizeChange"
        />
      </div>
    </div>

    <!-- Visualization -->
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      class="w-full"
      role="img"
      aria-label="Type I and Type II error visualization"
    >
      <!-- Alpha region (Type I Error) -->
      <path :d="alphaPath" class="fill-red-500/30" />

      <!-- Beta region (Type II Error) -->
      <path :d="betaPath" class="fill-amber-500/30" />

      <!-- Power region (1 - beta) -->
      <path :d="powerPath" class="fill-emerald-500/30" />

      <!-- Null distribution curve -->
      <path
        :d="nullPath"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="text-blue-400"
      />

      <!-- Alternative distribution curve -->
      <path
        :d="altPath"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="text-emerald-400"
      />

      <!-- Critical value line -->
      <line
        :x1="xScale(1.96)"
        :y1="padding.top"
        :x2="xScale(1.96)"
        :y2="padding.top + chartHeight"
        stroke="currentColor"
        stroke-width="2"
        stroke-dasharray="4 2"
        class="text-text-muted"
      />

      <!-- X-axis -->
      <line
        :x1="padding.left"
        :y1="padding.top + chartHeight"
        :x2="padding.left + chartWidth"
        :y2="padding.top + chartHeight"
        stroke="currentColor"
        class="text-border-primary"
      />

      <!-- Labels -->
      <text
        :x="xScale(0)"
        :y="padding.top + chartHeight + 15"
        text-anchor="middle"
        class="text-xs fill-blue-400"
      >
        H₀: μ = 0
      </text>

      <text
        :x="xScale(effectSize)"
        :y="padding.top + chartHeight + 15"
        text-anchor="middle"
        class="text-xs fill-emerald-400"
      >
        H₁: μ = {{ effectSize.toFixed(1) }}
      </text>

      <text
        :x="xScale(1.96)"
        :y="padding.top + chartHeight + 30"
        text-anchor="middle"
        class="text-xs fill-text-muted"
      >
        Critical Value
      </text>
    </svg>

    <!-- Error rate summary -->
    <div class="grid grid-cols-3 gap-4 text-center">
      <div class="p-3 bg-red-500/10 rounded-lg" data-testid="type-i-error">
        <div class="text-2xl font-bold text-red-400" data-testid="type-i-error-value">
          {{ (alpha * 100).toFixed(1) }}%
        </div>
        <div class="text-sm text-text-secondary">Type I (α)</div>
        <div class="text-xs text-text-muted mt-1">False positive</div>
      </div>
      <div class="p-3 bg-amber-500/10 rounded-lg" data-testid="type-ii-error">
        <div class="text-2xl font-bold text-amber-400" data-testid="type-ii-error-value">
          {{ (beta * 100).toFixed(1) }}%
        </div>
        <div class="text-sm text-text-secondary">Type II (β)</div>
        <div class="text-xs text-text-muted mt-1">False negative</div>
      </div>
      <div class="p-3 bg-emerald-500/10 rounded-lg" data-testid="power-display">
        <div class="text-2xl font-bold text-emerald-400" data-testid="power-value">
          {{ (power * 100).toFixed(1) }}%
        </div>
        <div class="text-sm text-text-secondary">Power (1-β)</div>
        <div class="text-xs text-text-muted mt-1">True positive</div>
      </div>
    </div>

    <!-- Explanation boxes -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      <div class="p-3 bg-red-500/5 border-l-4 border-red-500 rounded">
        <div class="font-semibold text-red-400 mb-1">Type I Error (False Positive)</div>
        <p class="text-text-secondary">
          Rejecting H₀ when it's true. Like convicting an innocent person.
          Controlled by choosing α.
        </p>
      </div>
      <div class="p-3 bg-amber-500/5 border-l-4 border-amber-500 rounded">
        <div class="font-semibold text-amber-400 mb-1">Type II Error (False Negative)</div>
        <p class="text-text-secondary">
          Failing to reject H₀ when it's false. Like failing to convict a guilty person.
          Reduced by larger samples or effect sizes.
        </p>
      </div>
    </div>
  </div>
</template>
