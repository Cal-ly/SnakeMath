<script setup lang="ts">
import { computed } from 'vue'
import { formatStatValue } from '@/utils/math/statistics'
import type { SpreadStats, SkewnessAnalysis, DescriptiveStats } from '@/utils/math/statistics'

interface Props {
  spread: SpreadStats | null
  skewness: SkewnessAnalysis | null
  descriptive: DescriptiveStats | null
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
})

const unitSuffix = computed(() => (props.unit ? ` ${props.unit}` : ''))

// Format skewness interpretation for display
const skewnessLabel = computed(() => {
  if (!props.skewness) return null
  switch (props.skewness.interpretation) {
    case 'left-skewed':
      return 'Left-skewed'
    case 'right-skewed':
      return 'Right-skewed'
    case 'symmetric':
      return 'Symmetric'
    default:
      return 'Unknown'
  }
})

const skewnessIcon = computed(() => {
  if (!props.skewness) return null
  switch (props.skewness.interpretation) {
    case 'left-skewed':
      return 'fa-arrow-left'
    case 'right-skewed':
      return 'fa-arrow-right'
    case 'symmetric':
      return 'fa-equals'
    default:
      return 'fa-question'
  }
})
</script>

<template>
  <div class="spread-panel">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-arrows-left-right mr-2" aria-hidden="true" />
      Spread
    </h3>

    <div v-if="spread && descriptive" class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <div class="text-text-muted">Variance:</div>
      <div class="font-mono text-text-primary" data-testid="stat-variance">
        {{ formatStatValue(spread.variance) }}
      </div>

      <div class="text-text-muted">Std Dev:</div>
      <div class="font-mono text-text-primary" data-testid="stat-stddev">
        {{ formatStatValue(spread.stdDev) }}{{ unitSuffix }}
      </div>

      <div class="text-text-muted">Range:</div>
      <div class="font-mono text-text-primary" data-testid="stat-range">
        {{ formatStatValue(descriptive.range) }}{{ unitSuffix }}
      </div>

      <template v-if="skewness">
        <div class="text-text-muted">Skewness:</div>
        <div class="font-mono text-text-primary" data-testid="stat-skewness">
          {{ formatStatValue(skewness.skewness) }}
        </div>

        <div class="col-span-2 mt-1">
          <span
            data-testid="skewness-interpretation"
            :class="[
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
              skewness.interpretation === 'symmetric'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
            ]"
          >
            <i :class="['fa-solid', skewnessIcon]" aria-hidden="true" />
            {{ skewnessLabel }}
          </span>
        </div>
      </template>
    </div>

    <div v-else class="text-sm text-text-muted italic">
      Enter at least 2 values to see statistics
    </div>
  </div>
</template>
