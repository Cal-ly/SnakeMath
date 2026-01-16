<script setup lang="ts">
import { computed } from 'vue'
import { CoordinateSystem, PlotCurve } from '@/components/visualizations'
import {
  complexityLabels,
  complexityColors,
  complexityExamples,
  complexityFunctions,
  formatExponentialNumber,
} from '@/utils/math/exponential'
import type { ComplexityClass, ComplexityComparison } from '@/utils/math/exponential'

interface Props {
  n: number
  comparison: ComplexityComparison | null
  yMax: number
  insight: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:n': [value: number]
}>()

const complexityClasses: ComplexityClass[] = [
  'constant',
  'logarithmic',
  'linear',
  'linearithmic',
  'quadratic',
  'exponential',
]

// Table rows with comparison data
const tableRows = computed(() => {
  if (!props.comparison) return []

  const linearValue = props.comparison.values.linear

  return complexityClasses.map((cls) => {
    const value = props.comparison!.values[cls]
    let relative: string

    if (cls === 'linear') {
      relative = 'baseline'
    } else if (value < linearValue) {
      relative = `${(linearValue / value).toFixed(1)}x faster`
    } else if (value > linearValue) {
      relative = `${(value / linearValue).toFixed(1)}x slower`
    } else {
      relative = 'same'
    }

    return {
      complexity: cls,
      label: complexityLabels[cls],
      value: formatExponentialNumber(value),
      relative,
      color: complexityColors[cls],
      examples: complexityExamples[cls],
    }
  })
})

// Slider position (use logarithmic scale for better UX)
function handleSliderChange(event: Event) {
  const target = event.target as HTMLInputElement
  const logValue = parseFloat(target.value)
  // Convert from log scale (0-3) to linear (1-1000)
  const n = Math.round(Math.pow(10, logValue))
  emit('update:n', Math.max(1, Math.min(1000, n)))
}

const sliderValue = computed(() => {
  // Convert n to log scale for slider
  return Math.log10(Math.max(1, props.n))
})

// Graph bounds
const graphBounds = computed(() => {
  const maxN = Math.min(props.n, 25) // Cap at 25 for visualization
  let maxY = props.yMax

  // For very large exponential values, cap the y-axis
  if (maxY > 1e6) {
    maxY = 1e6
  }

  return {
    xMin: 0,
    xMax: maxN + 2,
    yMin: 0,
    yMax: maxY,
  }
})

// Create plot functions for each complexity class
function getPlotFunction(cls: ComplexityClass) {
  return complexityFunctions[cls]
}
</script>

<template>
  <div class="complexity-comparison-tab" data-testid="complexity-comparison-tab">
    <!-- N Slider -->
    <div class="mb-6 p-4 bg-surface-raised rounded-lg">
      <div class="flex items-center justify-between mb-2">
        <label for="complexity-slider" class="text-sm font-medium text-text-primary">
          Input Size (n):
        </label>
        <span class="text-2xl font-bold text-primary" data-testid="complexity-n-value">
          {{ n }}
        </span>
      </div>

      <input
        id="complexity-slider"
        type="range"
        min="0"
        max="3"
        step="0.01"
        :value="sliderValue"
        class="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider-thumb"
        data-testid="complexity-n-slider"
        @input="handleSliderChange"
      />

      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>1</span>
        <span>10</span>
        <span>100</span>
        <span>1000</span>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Graph -->
      <div class="card p-4" data-testid="complexity-graph">
        <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
          Complexity Curves
        </h3>

        <div class="flex justify-center">
          <CoordinateSystem
            :x-min="graphBounds.xMin"
            :x-max="graphBounds.xMax"
            :y-min="graphBounds.yMin"
            :y-max="graphBounds.yMax"
            :width="360"
            :height="300"
            :grid-step="5"
            aria-label="Algorithm complexity comparison graph"
          >
            <template #default="{ toSvgX, toSvgY }">
              <!-- Complexity curves -->
              <PlotCurve
                v-for="cls in complexityClasses"
                :key="cls"
                :fn="getPlotFunction(cls)"
                :x-min="1"
                :x-max="graphBounds.xMax"
                :to-svg-x="toSvgX"
                :to-svg-y="toSvgY"
                :samples="100"
                :stroke-color="complexityColors[cls]"
                :stroke-width="2"
              />
            </template>
          </CoordinateSystem>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap gap-3 justify-center mt-3 text-xs">
          <div v-for="cls in complexityClasses" :key="cls" class="flex items-center gap-1">
            <span class="w-3 h-0.5" :style="{ backgroundColor: complexityColors[cls] }" />
            <span class="text-text-muted">{{ complexityLabels[cls] }}</span>
          </div>
        </div>
      </div>

      <!-- Comparison Table -->
      <div class="card p-4" data-testid="complexity-table">
        <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          <i class="fa-solid fa-table mr-2" aria-hidden="true" />
          Operations at n = {{ n }}
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-text-muted border-b border-border">
                <th class="pb-2 pr-2">Complexity</th>
                <th class="pb-2 pr-2 text-right">Operations</th>
                <th class="pb-2 text-right">vs O(n)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in tableRows"
                :key="row.complexity"
                class="border-b border-border/50 last:border-0"
                :data-testid="`complexity-row-${row.complexity}`"
              >
                <td class="py-2 pr-2">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: row.color }" />
                    <span class="font-mono text-text-primary">{{ row.label }}</span>
                  </div>
                </td>
                <td class="py-2 pr-2 text-right font-mono text-text-primary">
                  {{ row.value }}
                </td>
                <td class="py-2 text-right text-text-muted text-xs">
                  {{ row.relative }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Insight -->
    <div class="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg" data-testid="complexity-insight">
      <p class="text-sm text-text-primary">
        <i class="fa-solid fa-lightbulb text-primary mr-2" aria-hidden="true" />
        {{ insight }}
      </p>
    </div>

    <!-- Algorithm Examples -->
    <div class="mt-4 p-4 bg-surface-raised rounded-lg">
      <h4 class="text-sm font-semibold text-text-muted mb-3">
        <i class="fa-solid fa-code mr-2" aria-hidden="true" />
        Example Algorithms
      </h4>
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="cls in complexityClasses" :key="cls" class="text-xs">
          <span class="font-mono text-text-muted">{{ complexityLabels[cls] }}:</span>
          <span class="text-text-primary ml-1">{{ complexityExamples[cls].join(', ') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  @apply bg-surface border border-border rounded-lg;
}

.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.slider-thumb::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

@media (min-width: 768px) {
  .slider-thumb::-webkit-slider-thumb {
    width: 44px;
    height: 44px;
  }

  .slider-thumb::-moz-range-thumb {
    width: 44px;
    height: 44px;
  }
}
</style>
