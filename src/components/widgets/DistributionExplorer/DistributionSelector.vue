<script setup lang="ts">
import type { DistributionType } from '@/utils/math/distributions'

interface Props {
  selectedType: DistributionType
}

defineProps<Props>()

const emit = defineEmits<{
  select: [type: DistributionType]
}>()

const distributions: Array<{
  type: DistributionType
  name: string
  icon: string
  description: string
}> = [
  {
    type: 'normal',
    name: 'Normal',
    icon: 'fa-solid fa-chart-area',
    description: 'Bell curve (μ, σ)',
  },
  {
    type: 'binomial',
    name: 'Binomial',
    icon: 'fa-solid fa-dice',
    description: 'Success count (n, p)',
  },
  {
    type: 'poisson',
    name: 'Poisson',
    icon: 'fa-solid fa-clock',
    description: 'Event rate (λ)',
  },
  {
    type: 'exponential',
    name: 'Exponential',
    icon: 'fa-solid fa-hourglass',
    description: 'Wait time (λ)',
  },
  {
    type: 'uniform',
    name: 'Uniform',
    icon: 'fa-solid fa-square',
    description: 'Equal probability (a, b)',
  },
]

function handleSelect(type: DistributionType) {
  emit('select', type)
}
</script>

<template>
  <div class="distribution-selector" data-testid="distribution-selector">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="dist in distributions"
        :key="dist.type"
        :class="[
          'px-3 py-2 rounded-lg border text-sm font-medium transition-all min-w-[100px]',
          'focus:outline-none focus:ring-2 focus:ring-primary/30',
          selectedType === dist.type
            ? 'bg-primary text-white border-primary'
            : 'bg-surface-alt border-border hover:border-primary hover:text-primary',
        ]"
        :data-testid="`dist-btn-${dist.type}`"
        :aria-pressed="selectedType === dist.type"
        @click="handleSelect(dist.type)"
      >
        <i :class="dist.icon" aria-hidden="true" class="mr-1.5" />
        {{ dist.name }}
      </button>
    </div>

    <!-- Description of selected distribution -->
    <p class="mt-2 text-sm text-text-muted">
      <i class="fa-solid fa-info-circle mr-1" aria-hidden="true" />
      {{ distributions.find((d) => d.type === selectedType)?.description }}
    </p>
  </div>
</template>
