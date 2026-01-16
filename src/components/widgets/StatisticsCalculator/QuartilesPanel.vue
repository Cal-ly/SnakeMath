<script setup lang="ts">
import { computed } from 'vue'
import { formatStatValue } from '@/utils/math/statistics'
import type { Quartiles } from '@/utils/math/statistics'

interface Props {
  quartiles: Quartiles | null
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
})

const unitSuffix = computed(() => (props.unit ? ` ${props.unit}` : ''))
</script>

<template>
  <div class="quartiles-panel">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-layer-group mr-2" aria-hidden="true" />
      Quartiles
    </h3>

    <div v-if="quartiles" class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <div class="text-text-muted">Q1 (25%):</div>
      <div class="font-mono text-text-primary" data-testid="stat-q1">
        {{ formatStatValue(quartiles.q1) }}{{ unitSuffix }}
      </div>

      <div class="text-text-muted">Q2 (50%):</div>
      <div class="font-mono text-text-primary" data-testid="stat-q2">
        {{ formatStatValue(quartiles.q2) }}{{ unitSuffix }}
      </div>

      <div class="text-text-muted">Q3 (75%):</div>
      <div class="font-mono text-text-primary" data-testid="stat-q3">
        {{ formatStatValue(quartiles.q3) }}{{ unitSuffix }}
      </div>

      <div class="text-text-muted">IQR:</div>
      <div class="font-mono text-text-primary" data-testid="stat-iqr">
        {{ formatStatValue(quartiles.iqr) }}{{ unitSuffix }}
      </div>
    </div>

    <div v-else class="text-sm text-text-muted italic">
      Enter at least 2 values to see quartiles
    </div>
  </div>
</template>
