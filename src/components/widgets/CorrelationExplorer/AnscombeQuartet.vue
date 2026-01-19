<script setup lang="ts">
import { computed } from 'vue'
import { pearsonCorrelation, linearRegression, pointsToArrays } from '@/utils/math/correlation'

interface AnscombeDataset {
  id: string
  name: string
  description: string
  points: { x: number; y: number }[]
}

interface Props {
  datasets: AnscombeDataset[]
  selectedDatasetId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectDataset: [datasetId: string]
}>()

// Calculate stats for all datasets
const datasetStats = computed(() => {
  return props.datasets.map((dataset) => {
    const { x, y } = pointsToArrays(dataset.points)
    const r = pearsonCorrelation(x, y)
    const reg = linearRegression(x, y)
    return {
      ...dataset,
      r,
      slope: reg.slope,
      intercept: reg.intercept,
      rSquared: reg.rSquared,
    }
  })
})
</script>

<template>
  <div class="anscombe-quartet" data-testid="anscombe-quartet">
    <!-- Introduction -->
    <div class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
      <h4 class="font-semibold text-amber-700 dark:text-amber-400 mb-2">
        <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
        Anscombe's Quartet: Why You Must Visualize Data
      </h4>
      <p class="text-sm text-amber-600 dark:text-amber-400">
        These four datasets have nearly identical statistical properties:
        <strong>same mean, same variance, same correlation (r ≈ 0.816), same regression line (y = 0.5x + 3)</strong>.
        Yet they look completely different when plotted!
      </p>
    </div>

    <!-- Dataset Cards -->
    <div class="grid gap-4 sm:grid-cols-2">
      <button
        v-for="stats in datasetStats"
        :key="stats.id"
        :class="[
          'dataset-card p-4 rounded-lg border text-left transition-colors',
          selectedDatasetId === stats.id
            ? 'border-accent-primary bg-accent-primary/10'
            : 'border-border bg-surface hover:border-accent-primary/50',
        ]"
        :data-testid="`anscombe-${stats.id}`"
        @click="emit('selectDataset', stats.id)"
      >
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-medium text-text-primary">{{ stats.name }}</h4>
          <span class="text-xs font-mono text-text-muted">
            r = {{ stats.r.toFixed(3) }}
          </span>
        </div>
        <p class="text-sm text-text-secondary mb-2">{{ stats.description }}</p>
        <p class="text-xs font-mono text-text-muted">
          ŷ = {{ stats.slope.toFixed(2) }}x + {{ stats.intercept.toFixed(2) }}
        </p>
      </button>
    </div>

    <!-- Stats Summary -->
    <div class="mt-6 p-4 bg-surface border border-border rounded-lg">
      <h4 class="font-medium text-text-primary mb-3">Identical Statistics Across All Four</h4>
      <div class="grid gap-2 sm:grid-cols-2 text-sm">
        <div class="flex justify-between">
          <span class="text-text-secondary">Mean of x:</span>
          <span class="font-mono text-text-primary">9.0</span>
        </div>
        <div class="flex justify-between">
          <span class="text-text-secondary">Mean of y:</span>
          <span class="font-mono text-text-primary">≈ 7.5</span>
        </div>
        <div class="flex justify-between">
          <span class="text-text-secondary">Correlation (r):</span>
          <span class="font-mono text-text-primary">≈ 0.816</span>
        </div>
        <div class="flex justify-between">
          <span class="text-text-secondary">R²:</span>
          <span class="font-mono text-text-primary">≈ 66.6%</span>
        </div>
        <div class="flex justify-between sm:col-span-2">
          <span class="text-text-secondary">Regression line:</span>
          <span class="font-mono text-text-primary">ŷ = 0.5x + 3</span>
        </div>
      </div>
    </div>

    <!-- Lesson -->
    <div class="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
      <p class="text-sm text-text-secondary">
        <strong class="text-primary">Lesson:</strong>
        Never trust summary statistics alone. A correlation of r = 0.8 could represent
        a clean linear relationship, a curve, or outlier-driven nonsense. <strong>Always plot your data!</strong>
      </p>
    </div>
  </div>
</template>
