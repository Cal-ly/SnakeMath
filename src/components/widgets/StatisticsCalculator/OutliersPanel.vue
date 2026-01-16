<script setup lang="ts">
import { computed } from 'vue'
import { formatStatValue } from '@/utils/math/statistics'
import type { OutlierAnalysis } from '@/utils/math/statistics'

interface Props {
  outliers: OutlierAnalysis | null
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
})

const unitSuffix = computed(() => (props.unit ? ` ${props.unit}` : ''))

const formattedOutliers = computed(() => {
  if (!props.outliers || props.outliers.outliers.length === 0) return 'None'
  return props.outliers.outliers.map((o) => formatStatValue(o)).join(', ')
})
</script>

<template>
  <div class="outliers-panel">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-exclamation-triangle mr-2" aria-hidden="true" />
      Outliers
    </h3>

    <div v-if="outliers" class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <div class="text-text-muted">Lower fence:</div>
      <div class="font-mono text-text-primary" data-testid="outlier-lower-fence">
        {{ formatStatValue(outliers.lowerFence) }}{{ unitSuffix }}
      </div>

      <div class="text-text-muted">Upper fence:</div>
      <div class="font-mono text-text-primary" data-testid="outlier-upper-fence">
        {{ formatStatValue(outliers.upperFence) }}{{ unitSuffix }}
      </div>

      <div class="text-text-muted">Count:</div>
      <div class="font-mono text-text-primary" data-testid="outliers-count">
        {{ outliers.outliers.length }}
      </div>

      <div class="col-span-2 mt-2">
        <span class="text-text-muted text-xs block mb-1">Outliers:</span>
        <span
          data-testid="outliers-list"
          :class="[
            'font-mono text-sm',
            outliers.hasOutliers
              ? 'text-red-600 dark:text-red-400'
              : 'text-green-700 dark:text-green-400',
          ]"
        >
          {{ formattedOutliers }}{{ outliers.hasOutliers ? unitSuffix : '' }}
        </span>
      </div>
    </div>

    <div v-else class="text-sm text-text-muted italic">
      Enter at least 2 values to see outlier analysis
    </div>
  </div>
</template>
