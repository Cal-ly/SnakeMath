<script setup lang="ts">
import type { TestType, AlternativeHypothesis } from '@/composables/useHypothesisTesting'

interface Props {
  selectedType: TestType
  alternative: AlternativeHypothesis
  alpha: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectType: [type: TestType]
  selectAlternative: [alt: AlternativeHypothesis]
  updateAlpha: [value: number]
}>()

const testTypes: { id: TestType; name: string; description: string }[] = [
  {
    id: 'one-sample-t',
    name: 'One-Sample t',
    description: 'Compare sample mean to a known value',
  },
  {
    id: 'two-sample-t',
    name: 'Two-Sample t',
    description: 'Compare means of two groups',
  },
  {
    id: 'one-prop-z',
    name: 'One-Prop z',
    description: 'Compare sample proportion to a known value',
  },
  {
    id: 'two-prop-z',
    name: 'Two-Prop z',
    description: 'Compare proportions of two groups',
  },
]

const alternatives: { id: AlternativeHypothesis; label: string; symbol: string }[] = [
  { id: 'two-sided', label: 'Two-sided', symbol: '≠' },
  { id: 'less', label: 'Less than', symbol: '<' },
  { id: 'greater', label: 'Greater than', symbol: '>' },
]

const alphaOptions = [
  { value: 0.01, label: '0.01 (99%)' },
  { value: 0.05, label: '0.05 (95%)' },
  { value: 0.10, label: '0.10 (90%)' },
]
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-text-primary">Test Configuration</h3>

    <!-- Test Type -->
    <div>
      <label class="block text-sm font-medium text-text-secondary mb-2">
        Test Type
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="type in testTypes"
          :key="type.id"
          :class="[
            'px-3 py-2 text-sm rounded-md transition-colors min-h-[44px]',
            selectedType === type.id
              ? 'bg-accent-primary text-white'
              : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary',
          ]"
          :title="type.description"
          :aria-pressed="selectedType === type.id"
          :data-testid="`test-type-${type.id}`"
          @click="emit('selectType', type.id)"
        >
          {{ type.name }}
        </button>
      </div>
    </div>

    <!-- Alternative Hypothesis -->
    <div>
      <label class="block text-sm font-medium text-text-secondary mb-2">
        Alternative Hypothesis (H<sub>1</sub>)
      </label>
      <div class="flex gap-2">
        <button
          v-for="alt in alternatives"
          :key="alt.id"
          :class="[
            'flex-1 px-3 py-2 text-sm rounded-md transition-colors min-h-[44px]',
            alternative === alt.id
              ? 'bg-accent-primary text-white'
              : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary',
          ]"
          :aria-pressed="alternative === alt.id"
          :data-testid="`alternative-${alt.id}`"
          @click="emit('selectAlternative', alt.id)"
        >
          <span class="font-mono">{{ alt.symbol }}</span>
          <span class="ml-1 hidden sm:inline">{{ alt.label }}</span>
        </button>
      </div>
    </div>

    <!-- Significance Level -->
    <div>
      <label class="block text-sm font-medium text-text-secondary mb-2">
        Significance Level (α)
      </label>
      <div class="flex gap-2">
        <button
          v-for="option in alphaOptions"
          :key="option.value"
          :class="[
            'flex-1 px-3 py-2 text-sm rounded-md transition-colors min-h-[44px]',
            alpha === option.value
              ? 'bg-accent-primary text-white'
              : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary',
          ]"
          :aria-pressed="alpha === option.value"
          :data-testid="`alpha-${option.value}`"
          @click="emit('updateAlpha', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>
