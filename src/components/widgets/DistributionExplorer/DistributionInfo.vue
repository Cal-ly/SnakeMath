<script setup lang="ts">
import type { DistributionStats, DistributionType } from '@/utils/math/distributions'

interface Props {
  stats: DistributionStats | null
  distributionType: DistributionType
}

defineProps<Props>()

function formatValue(value: number | null | number[]): string {
  if (value === null) return '—'
  if (Array.isArray(value)) {
    return value.map((v) => formatNumber(v)).join(', ')
  }
  return formatNumber(value)
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '—'
  if (Math.abs(value) < 0.0001) return '0'
  if (Math.abs(value) >= 1000) return value.toFixed(1)
  if (Math.abs(value) >= 1) return value.toFixed(3)
  return value.toFixed(5)
}

function getSkewnessLabel(skewness: number): string {
  if (skewness < -0.5) return 'Left-skewed'
  if (skewness > 0.5) return 'Right-skewed'
  return 'Symmetric'
}

function getSkewnessColor(skewness: number): string {
  if (skewness < -0.5) return 'text-blue-600 dark:text-blue-400'
  if (skewness > 0.5) return 'text-amber-600 dark:text-amber-400'
  return 'text-green-700 dark:text-green-400'
}
</script>

<template>
  <div class="distribution-info" data-testid="distribution-info">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-calculator mr-2" aria-hidden="true" />
      Properties
    </h3>

    <div v-if="stats" class="grid grid-cols-2 gap-3">
      <!-- Mean (Expected Value) -->
      <div class="stat-item">
        <span class="text-xs text-text-muted block">E[X] (Mean)</span>
        <span class="font-mono text-lg text-text-primary" data-testid="stat-mean">
          {{ formatValue(stats.mean) }}
        </span>
      </div>

      <!-- Variance -->
      <div class="stat-item">
        <span class="text-xs text-text-muted block">Var(X)</span>
        <span class="font-mono text-lg text-text-primary" data-testid="stat-variance">
          {{ formatValue(stats.variance) }}
        </span>
      </div>

      <!-- Standard Deviation -->
      <div class="stat-item">
        <span class="text-xs text-text-muted block">σ (Std Dev)</span>
        <span class="font-mono text-lg text-text-primary" data-testid="stat-stddev">
          {{ formatValue(stats.stdDev) }}
        </span>
      </div>

      <!-- Mode -->
      <div class="stat-item">
        <span class="text-xs text-text-muted block">Mode</span>
        <span class="font-mono text-lg text-text-primary" data-testid="stat-mode">
          {{ formatValue(stats.mode) }}
        </span>
      </div>

      <!-- Skewness -->
      <div class="stat-item col-span-2">
        <span class="text-xs text-text-muted block">Skewness</span>
        <div class="flex items-center gap-2">
          <span class="font-mono text-lg text-text-primary" data-testid="stat-skewness">
            {{ formatValue(stats.skewness) }}
          </span>
          <span :class="['text-sm', getSkewnessColor(stats.skewness)]">
            ({{ getSkewnessLabel(stats.skewness) }})
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-4 text-text-muted text-sm">
      <i class="fa-solid fa-exclamation-triangle mr-1" aria-hidden="true" />
      Invalid parameters
    </div>
  </div>
</template>

<style scoped>
.stat-item {
  padding: 0.5rem;
  background: var(--color-surface-alt);
  border-radius: 0.5rem;
}
</style>
