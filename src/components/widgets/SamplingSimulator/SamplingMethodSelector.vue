<script setup lang="ts">
import type { SamplingMethod } from '@/composables/useSamplingSimulator'

interface Props {
  /** Currently selected method */
  selectedMethod: SamplingMethod
}

defineProps<Props>()

const emit = defineEmits<{
  select: [method: SamplingMethod]
}>()

const methods: { id: SamplingMethod; label: string; icon: string; description: string }[] = [
  {
    id: 'simple',
    label: 'Simple Random',
    icon: 'fa-dice',
    description: 'Every item has equal chance',
  },
  {
    id: 'stratified',
    label: 'Stratified',
    icon: 'fa-layer-group',
    description: 'Proportional from subgroups',
  },
  {
    id: 'systematic',
    label: 'Systematic',
    icon: 'fa-bars-staggered',
    description: 'Every kth item',
  },
  {
    id: 'cluster',
    label: 'Cluster',
    icon: 'fa-object-group',
    description: 'Select entire groups',
  },
]

function handleSelect(method: SamplingMethod) {
  emit('select', method)
}
</script>

<template>
  <div class="sampling-method-selector" data-testid="sampling-method-selector">
    <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-shuffle mr-2" aria-hidden="true" />
      Sampling Method
    </h4>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Sampling method">
      <button
        v-for="method in methods"
        :key="method.id"
        type="button"
        role="radio"
        :aria-checked="selectedMethod === method.id"
        class="p-3 rounded-lg border transition-all duration-150 text-left
               focus:outline-none focus:ring-2 focus:ring-primary/30"
        :class="
          selectedMethod === method.id
            ? 'bg-primary text-white border-primary'
            : 'bg-surface-alt border-border hover:border-primary hover:text-primary'
        "
        :data-testid="`method-${method.id}`"
        @click="handleSelect(method.id)"
      >
        <div class="flex items-center gap-2 mb-1">
          <i class="fa-solid text-sm" :class="method.icon" aria-hidden="true" />
          <span class="font-medium text-sm">{{ method.label }}</span>
        </div>
        <p
          class="text-xs"
          :class="selectedMethod === method.id ? 'text-white/80' : 'text-text-secondary'"
        >
          {{ method.description }}
        </p>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sampling-method-selector button {
  min-height: 44px;
}
</style>
