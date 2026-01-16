<script setup lang="ts">
import { computed } from 'vue'
import type { GrowthDecayResult } from '@/utils/math/exponential'

interface Props {
  analysis: GrowthDecayResult | null
  functionType: 'exponential' | 'logarithm'
}

const props = defineProps<Props>()

const displayItems = computed(() => {
  if (!props.analysis) return []

  const items = []

  // Type
  items.push({
    label: 'Type',
    value: props.analysis.type === 'growth' ? 'Growth' : 'Decay',
    icon: props.analysis.type === 'growth' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down',
    color: props.analysis.type === 'growth' ? 'text-green-500' : 'text-red-500',
  })

  // Doubling time or half-life
  if (props.analysis.doublingTime !== null) {
    items.push({
      label: 'Doubling time',
      value: `${props.analysis.doublingTime.toFixed(3)} units`,
      icon: 'fa-forward',
      color: 'text-blue-500',
      testId: 'doubling-time-display',
    })
  }

  if (props.analysis.halfLife !== null) {
    items.push({
      label: 'Half-life',
      value: `${props.analysis.halfLife.toFixed(3)} units`,
      icon: 'fa-backward',
      color: 'text-amber-500',
      testId: 'half-life-display',
    })
  }

  // Percent change
  const sign = props.analysis.percentChangePerUnit >= 0 ? '+' : ''
  items.push({
    label: 'Change per unit',
    value: `${sign}${props.analysis.percentChangePerUnit.toFixed(1)}%`,
    icon: 'fa-percent',
    color: 'text-text-muted',
  })

  return items
})
</script>

<template>
  <div class="growth-decay-panel" data-testid="growth-decay-panel">
    <h4 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
      <template v-if="functionType === 'exponential'">Growth/Decay Analysis</template>
      <template v-else>Inverse Function Properties</template>
    </h4>

    <div v-if="!analysis" class="text-sm text-amber-500">
      <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
      Invalid base
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="item in displayItems"
        :key="item.label"
        class="flex items-center justify-between py-1"
        :data-testid="item.testId"
      >
        <span class="text-sm text-text-muted flex items-center gap-2">
          <i :class="['fa-solid', item.icon, item.color]" aria-hidden="true" />
          {{ item.label }}:
        </span>
        <span class="text-sm font-medium text-text-primary">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
