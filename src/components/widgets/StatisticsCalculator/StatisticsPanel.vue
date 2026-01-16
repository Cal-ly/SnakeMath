<script setup lang="ts">
import { computed } from 'vue'
import { formatStatValue } from '@/utils/math/statistics'
import type { DescriptiveStats } from '@/utils/math/statistics'

interface Props {
  stats: DescriptiveStats | null
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
})

const unitSuffix = computed(() => (props.unit ? ` ${props.unit}` : ''))

function formatMode(mode: number[]): string {
  if (mode.length === 0) return '— (no mode)'
  if (mode.length > 3) return `${mode.slice(0, 3).join(', ')}... (${mode.length} modes)`
  return mode.join(', ')
}
</script>

<template>
  <div class="statistics-panel">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-chart-simple mr-2" aria-hidden="true" />
      Central Tendency
    </h3>

    <div v-if="stats" class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <div class="text-text-muted">Count:</div>
      <div class="font-mono text-text-primary" data-testid="stat-count">
        {{ stats.count }}
      </div>

      <div class="text-text-muted">Sum:</div>
      <div class="font-mono text-text-primary" data-testid="stat-sum">
        {{ formatStatValue(stats.sum) }}{{ unitSuffix }}
      </div>

      <div class="text-text-muted">Mean:</div>
      <div class="font-mono text-text-primary" data-testid="stat-mean">
        {{ formatStatValue(stats.mean) }}{{ unitSuffix }}
      </div>

      <div class="text-text-muted">Median:</div>
      <div class="font-mono text-text-primary" data-testid="stat-median">
        {{ formatStatValue(stats.median) }}{{ unitSuffix }}
      </div>

      <div class="text-text-muted">Mode:</div>
      <div class="font-mono text-text-primary" data-testid="stat-mode">
        {{ formatMode(stats.mode) }}{{ stats.mode.length > 0 ? unitSuffix : '' }}
      </div>

      <div class="text-text-muted">Min:</div>
      <div class="font-mono text-text-primary" data-testid="stat-min">
        {{ formatStatValue(stats.min) }}{{ unitSuffix }}
      </div>

      <div class="text-text-muted">Max:</div>
      <div class="font-mono text-text-primary" data-testid="stat-max">
        {{ formatStatValue(stats.max) }}{{ unitSuffix }}
      </div>
    </div>

    <div v-else class="text-sm text-text-muted italic">
      Enter at least 2 values to see statistics
    </div>
  </div>
</template>
