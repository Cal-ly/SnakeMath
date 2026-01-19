<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  effectSize: number
  desiredPower: number
  alpha: number
  testType: 'one-sample' | 'two-sample'
  requiredSampleSize: number | null
  powerCurve: { n: number; power: number }[]
  sampleSizeFor80Power: number | null
  sampleSizeFor90Power: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:effectSize': [value: number]
  'update:desiredPower': [value: number]
  'update:testType': [value: 'one-sample' | 'two-sample']
}>()

// SVG dimensions
const width = 450
const height = 220
const padding = { top: 20, right: 30, bottom: 50, left: 50 }
const chartWidth = width - padding.left - padding.right
const chartHeight = height - padding.top - padding.bottom

// Scale functions
const xMax = computed(() => Math.max(150, ...props.powerCurve.map((p) => p.n)))
const xScale = (x: number) => (x / xMax.value) * chartWidth + padding.left
const yScale = (y: number) => padding.top + chartHeight - y * chartHeight

// Power curve path
const curvePath = computed(() => {
  if (props.powerCurve.length === 0) return ''

  return props.powerCurve
    .map((point, i) => {
      const x = xScale(point.n)
      const y = yScale(point.power)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
})

// Horizontal lines for 80% and 90% power
const powerLines = [
  { power: 0.8, label: '80%', color: 'text-amber-500' },
  { power: 0.9, label: '90%', color: 'text-emerald-500' },
]

// X-axis ticks
const xTicks = computed(() => {
  const max = xMax.value
  const step = max <= 100 ? 20 : max <= 200 ? 50 : 100
  const ticks: number[] = []
  for (let i = 0; i <= max; i += step) {
    ticks.push(i)
  }
  return ticks
})

// Y-axis ticks
const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0]

// Effect size interpretation
const effectSizeLabel = computed(() => {
  const d = props.effectSize
  if (d < 0.2) return 'Negligible'
  if (d < 0.5) return 'Small'
  if (d < 0.8) return 'Medium'
  return 'Large'
})

function handleEffectSizeChange(e: Event) {
  const value = parseFloat((e.target as HTMLInputElement).value)
  emit('update:effectSize', value)
}

function handlePowerChange(e: Event) {
  const value = parseFloat((e.target as HTMLInputElement).value)
  emit('update:desiredPower', value)
}

function handleTestTypeChange(type: 'one-sample' | 'two-sample') {
  emit('update:testType', type)
}
</script>

<template>
  <div class="space-y-4" data-testid="power-analysis">
    <h3 class="text-lg font-semibold text-text-primary">Power Analysis</h3>

    <p class="text-sm text-text-secondary">
      Determine sample size needed to detect an effect with desired confidence.
    </p>

    <!-- Controls -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Effect size -->
      <div>
        <label for="power-effect" class="block text-sm text-text-secondary mb-1">
          Effect Size (Cohen's d): {{ effectSize.toFixed(2) }}
          <span class="text-text-muted">({{ effectSizeLabel }})</span>
        </label>
        <input
          id="power-effect"
          type="range"
          :value="effectSize"
          min="0.1"
          max="1.5"
          step="0.05"
          class="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent-primary"
          data-testid="power-effect-slider"
          @input="handleEffectSizeChange"
        />
      </div>

      <!-- Desired power -->
      <div>
        <label for="power-desired" class="block text-sm text-text-secondary mb-1">
          Desired Power: {{ (desiredPower * 100).toFixed(0) }}%
        </label>
        <input
          id="power-desired"
          type="range"
          :value="desiredPower"
          min="0.5"
          max="0.99"
          step="0.01"
          class="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent-primary"
          data-testid="power-desired-slider"
          @input="handlePowerChange"
        />
      </div>
    </div>

    <!-- Test type toggle -->
    <div>
      <label class="block text-sm text-text-secondary mb-2">Test Type</label>
      <div class="flex gap-2">
        <button
          :class="[
            'flex-1 px-3 py-2 text-sm rounded-md transition-colors min-h-[44px]',
            testType === 'one-sample'
              ? 'bg-accent-primary text-white'
              : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary',
          ]"
          data-testid="power-one-sample"
          @click="handleTestTypeChange('one-sample')"
        >
          One-Sample
        </button>
        <button
          :class="[
            'flex-1 px-3 py-2 text-sm rounded-md transition-colors min-h-[44px]',
            testType === 'two-sample'
              ? 'bg-accent-primary text-white'
              : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary',
          ]"
          data-testid="power-two-sample"
          @click="handleTestTypeChange('two-sample')"
        >
          Two-Sample
        </button>
      </div>
    </div>

    <!-- Power curve visualization -->
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      class="w-full"
      role="img"
      aria-label="Power curve showing relationship between sample size and statistical power"
    >
      <!-- Y-axis grid lines -->
      <g v-for="tick in yTicks" :key="`y-${tick}`">
        <line
          :x1="padding.left"
          :y1="yScale(tick)"
          :x2="padding.left + chartWidth"
          :y2="yScale(tick)"
          stroke="currentColor"
          stroke-opacity="0.2"
          class="text-border-primary"
        />
        <text
          :x="padding.left - 8"
          :y="yScale(tick) + 4"
          text-anchor="end"
          class="text-xs fill-text-muted"
        >
          {{ (tick * 100).toFixed(0) }}%
        </text>
      </g>

      <!-- 80% and 90% power horizontal lines -->
      <g v-for="line in powerLines" :key="line.power">
        <line
          :x1="padding.left"
          :y1="yScale(line.power)"
          :x2="padding.left + chartWidth"
          :y2="yScale(line.power)"
          stroke="currentColor"
          stroke-dasharray="4 2"
          :class="line.color"
        />
        <text
          :x="padding.left + chartWidth + 5"
          :y="yScale(line.power) + 4"
          :class="['text-xs', line.color.replace('text-', 'fill-')]"
        >
          {{ line.label }}
        </text>
      </g>

      <!-- Power curve -->
      <path
        :d="curvePath"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        class="text-accent-primary"
      />

      <!-- Required sample size marker -->
      <g v-if="requiredSampleSize && requiredSampleSize <= xMax">
        <line
          :x1="xScale(requiredSampleSize)"
          :y1="padding.top"
          :x2="xScale(requiredSampleSize)"
          :y2="yScale(desiredPower)"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-dasharray="4 2"
          class="text-purple-500"
        />
        <circle
          :cx="xScale(requiredSampleSize)"
          :cy="yScale(desiredPower)"
          r="5"
          class="fill-purple-500"
        />
      </g>

      <!-- X-axis -->
      <line
        :x1="padding.left"
        :y1="padding.top + chartHeight"
        :x2="padding.left + chartWidth"
        :y2="padding.top + chartHeight"
        stroke="currentColor"
        class="text-border-primary"
      />

      <!-- X-axis ticks -->
      <g v-for="tick in xTicks" :key="`x-${tick}`">
        <line
          :x1="xScale(tick)"
          :y1="padding.top + chartHeight"
          :x2="xScale(tick)"
          :y2="padding.top + chartHeight + 5"
          stroke="currentColor"
          class="text-border-primary"
        />
        <text
          :x="xScale(tick)"
          :y="padding.top + chartHeight + 18"
          text-anchor="middle"
          class="text-xs fill-text-muted"
        >
          {{ tick }}
        </text>
      </g>

      <!-- Axis labels -->
      <text
        :x="padding.left + chartWidth / 2"
        :y="padding.top + chartHeight + 38"
        text-anchor="middle"
        class="text-sm fill-text-secondary"
      >
        Sample Size (n{{ testType === 'two-sample' ? ' per group' : '' }})
      </text>

      <text
        :x="15"
        :y="padding.top + chartHeight / 2"
        text-anchor="middle"
        transform="rotate(-90, 15, 110)"
        class="text-sm fill-text-secondary"
      >
        Power
      </text>
    </svg>

    <!-- Results -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-4 bg-purple-500/10 rounded-lg text-center" data-testid="required-sample-size">
        <div class="text-3xl font-bold text-purple-400" data-testid="required-sample-size-value">
          {{ requiredSampleSize ?? '—' }}
        </div>
        <div class="text-sm text-text-secondary">
          Required n for {{ (desiredPower * 100).toFixed(0) }}% power
        </div>
        <div v-if="testType === 'two-sample'" class="text-xs text-text-muted mt-1">
          ({{ requiredSampleSize ? requiredSampleSize * 2 : '—' }} total)
        </div>
      </div>
      <div class="p-4 bg-amber-500/10 rounded-lg text-center" data-testid="sample-size-80">
        <div class="text-3xl font-bold text-amber-400" data-testid="sample-size-80-value">
          {{ sampleSizeFor80Power ?? '—' }}
        </div>
        <div class="text-sm text-text-secondary">n for 80% power</div>
      </div>
      <div class="p-4 bg-emerald-500/10 rounded-lg text-center" data-testid="sample-size-90">
        <div class="text-3xl font-bold text-emerald-400" data-testid="sample-size-90-value">
          {{ sampleSizeFor90Power ?? '—' }}
        </div>
        <div class="text-sm text-text-secondary">n for 90% power</div>
      </div>
    </div>

    <!-- Effect size guide -->
    <div class="p-3 bg-bg-secondary rounded-lg">
      <div class="text-sm font-medium text-text-secondary mb-2">Effect Size Guidelines</div>
      <div class="grid grid-cols-4 gap-2 text-xs text-center">
        <div class="p-2 bg-bg-tertiary rounded">
          <div class="font-bold text-gray-400">< 0.2</div>
          <div class="text-text-muted">Negligible</div>
        </div>
        <div class="p-2 bg-bg-tertiary rounded">
          <div class="font-bold text-teal-400">0.2 - 0.5</div>
          <div class="text-text-muted">Small</div>
        </div>
        <div class="p-2 bg-bg-tertiary rounded">
          <div class="font-bold text-blue-400">0.5 - 0.8</div>
          <div class="text-text-muted">Medium</div>
        </div>
        <div class="p-2 bg-bg-tertiary rounded">
          <div class="font-bold text-purple-400">≥ 0.8</div>
          <div class="text-text-muted">Large</div>
        </div>
      </div>
    </div>
  </div>
</template>
