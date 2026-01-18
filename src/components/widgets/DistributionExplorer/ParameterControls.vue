<script setup lang="ts">
import { computed } from 'vue'
import type {
  DistributionType,
  NormalParams,
  BinomialParams,
  PoissonParams,
  ExponentialParams,
  UniformParams,
} from '@/utils/math/distributions'

interface Props {
  distributionType: DistributionType
  normalParams: NormalParams
  binomialParams: BinomialParams
  poissonParams: PoissonParams
  exponentialParams: ExponentialParams
  uniformParams: UniformParams
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:normalParams': [params: Partial<NormalParams>]
  'update:binomialParams': [params: Partial<BinomialParams>]
  'update:poissonParams': [params: Partial<PoissonParams>]
  'update:exponentialParams': [params: Partial<ExponentialParams>]
  'update:uniformParams': [params: Partial<UniformParams>]
}>()

// Parameter configurations for each distribution type
const paramConfigs = computed(() => {
  switch (props.distributionType) {
    case 'normal':
      return [
        {
          key: 'mu',
          label: 'μ (mean)',
          value: props.normalParams.mu,
          min: -100,
          max: 100,
          step: 1,
          inputMin: -1000,
          inputMax: 1000,
        },
        {
          key: 'sigma',
          label: 'σ (std dev)',
          value: props.normalParams.sigma,
          min: 0.1,
          max: 50,
          step: 0.1,
          inputMin: 0.01,
          inputMax: 100,
        },
      ]
    case 'binomial':
      return [
        {
          key: 'n',
          label: 'n (trials)',
          value: props.binomialParams.n,
          min: 1,
          max: 100,
          step: 1,
          inputMin: 1,
          inputMax: 1000,
        },
        {
          key: 'p',
          label: 'p (probability)',
          value: props.binomialParams.p,
          min: 0.01,
          max: 0.99,
          step: 0.01,
          inputMin: 0,
          inputMax: 1,
        },
      ]
    case 'poisson':
      return [
        {
          key: 'lambda',
          label: 'λ (rate)',
          value: props.poissonParams.lambda,
          min: 0.1,
          max: 50,
          step: 0.5,
          inputMin: 0.01,
          inputMax: 100,
        },
      ]
    case 'exponential':
      return [
        {
          key: 'lambda',
          label: 'λ (rate)',
          value: props.exponentialParams.lambda,
          min: 0.1,
          max: 5,
          step: 0.1,
          inputMin: 0.01,
          inputMax: 10,
        },
      ]
    case 'uniform':
      return [
        {
          key: 'a',
          label: 'a (lower)',
          value: props.uniformParams.a,
          min: -100,
          max: 100,
          step: 1,
          inputMin: -1000,
          inputMax: 1000,
        },
        {
          key: 'b',
          label: 'b (upper)',
          value: props.uniformParams.b,
          min: -100,
          max: 100,
          step: 1,
          inputMin: -1000,
          inputMax: 1000,
        },
      ]
    default:
      return []
  }
})

function handleSliderChange(key: string, event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value)
  emitUpdate(key, value)
}

function handleInputChange(key: string, event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value)
  if (isNaN(value)) return
  emitUpdate(key, value)
}

function emitUpdate(key: string, value: number) {
  switch (props.distributionType) {
    case 'normal':
      emit('update:normalParams', { [key]: value })
      break
    case 'binomial':
      emit('update:binomialParams', { [key]: value })
      break
    case 'poisson':
      emit('update:poissonParams', { [key]: value })
      break
    case 'exponential':
      emit('update:exponentialParams', { [key]: value })
      break
    case 'uniform':
      emit('update:uniformParams', { [key]: value })
      break
  }
}

function formatValue(value: number, step: number): string {
  if (step >= 1) {
    return Math.round(value).toString()
  }
  const decimals = Math.max(0, -Math.floor(Math.log10(step)))
  return value.toFixed(decimals)
}
</script>

<template>
  <div class="parameter-controls" data-testid="parameter-controls">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-sliders mr-2" aria-hidden="true" />
      Parameters
    </h3>

    <div class="space-y-4">
      <div
        v-for="param in paramConfigs"
        :key="param.key"
        class="parameter-row"
      >
        <div class="flex items-center justify-between mb-1">
          <label
            :for="`param-${param.key}`"
            class="text-sm font-medium text-text-secondary"
          >
            {{ param.label }}
          </label>
          <input
            :id="`param-input-${param.key}`"
            type="number"
            :value="formatValue(param.value, param.step)"
            :min="param.inputMin"
            :max="param.inputMax"
            :step="param.step"
            class="w-20 px-2 py-1 text-sm text-right font-mono rounded border border-border
                   bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            :data-testid="`param-input-${param.key}`"
            @change="handleInputChange(param.key, $event)"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-text-muted w-12">{{ param.min }}</span>
          <input
            :id="`param-${param.key}`"
            type="range"
            :value="param.value"
            :min="param.min"
            :max="param.max"
            :step="param.step"
            class="flex-1 accent-primary h-2"
            :data-testid="`param-slider-${param.key}`"
            @input="handleSliderChange(param.key, $event)"
          />
          <span class="text-xs text-text-muted w-12 text-right">{{ param.max }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type='range']::-webkit-slider-runnable-track {
  background: var(--color-border);
  height: 6px;
  border-radius: 3px;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-primary);
  height: 18px;
  width: 18px;
  border-radius: 50%;
  margin-top: -6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

input[type='range']::-moz-range-track {
  background: var(--color-border);
  height: 6px;
  border-radius: 3px;
}

input[type='range']::-moz-range-thumb {
  background: var(--color-primary);
  height: 18px;
  width: 18px;
  border-radius: 50%;
  border: none;
}

input[type='range']:focus {
  outline: none;
}

input[type='range']:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.3);
}
</style>
