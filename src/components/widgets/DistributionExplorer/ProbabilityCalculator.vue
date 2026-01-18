<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ProbabilityResult } from '@/composables/useDistributionExplorer'

interface Props {
  mode: 'lessThan' | 'between'
  a: number
  b: number
  xRange: { min: number; max: number }
  result: ProbabilityResult | null
  isDiscrete: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:mode': [mode: 'lessThan' | 'between']
  'update:bounds': [a: number, b: number]
}>()

// Local state for inputs (to handle typing without immediate updates)
const localA = ref(props.a)
const localB = ref(props.b)

// Sync from props
watch(
  () => props.a,
  (val) => {
    localA.value = val
  }
)

watch(
  () => props.b,
  (val) => {
    localB.value = val
  }
)

function handleModeChange(mode: 'lessThan' | 'between') {
  emit('update:mode', mode)
}

function handleAChange(event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value)
  if (!isNaN(value)) {
    localA.value = value
    emit('update:bounds', value, localB.value)
  }
}

function handleBChange(event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value)
  if (!isNaN(value)) {
    localB.value = value
    emit('update:bounds', localA.value, value)
  }
}

function formatProbability(p: number): string {
  if (!Number.isFinite(p)) return '—'
  if (p < 0.0001) return p.toExponential(2)
  if (p > 0.9999) return (p * 100).toFixed(4) + '%'
  return (p * 100).toFixed(2) + '%'
}

function formatDecimal(p: number): string {
  if (!Number.isFinite(p)) return '—'
  return p.toFixed(4)
}
</script>

<template>
  <div class="probability-calculator" data-testid="probability-calculator">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-percentage mr-2" aria-hidden="true" />
      Probability Calculator
    </h3>

    <!-- Mode Selection -->
    <div class="flex gap-2 mb-4">
      <button
        :class="[
          'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary/30',
          mode === 'lessThan'
            ? 'bg-primary text-white border-primary'
            : 'bg-surface-alt border-border hover:border-primary hover:text-primary',
        ]"
        data-testid="prob-mode-less-than"
        @click="handleModeChange('lessThan')"
      >
        P(X ≤ x)
      </button>
      <button
        :class="[
          'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary/30',
          mode === 'between'
            ? 'bg-primary text-white border-primary'
            : 'bg-surface-alt border-border hover:border-primary hover:text-primary',
        ]"
        data-testid="prob-mode-between"
        @click="handleModeChange('between')"
      >
        P(a ≤ X ≤ b)
      </button>
    </div>

    <!-- Input Fields -->
    <div class="space-y-3 mb-4">
      <!-- Input A (only for between mode) -->
      <div v-if="mode === 'between'" class="flex items-center gap-3">
        <label for="prob-a" class="text-sm text-text-secondary w-16">a =</label>
        <input
          id="prob-a"
          type="number"
          :value="localA"
          :step="isDiscrete ? 1 : 0.1"
          class="flex-1 px-3 py-2 text-sm font-mono rounded border border-border
                 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          data-testid="prob-input-a"
          @change="handleAChange"
        />
      </div>

      <!-- Input B (shown as x for lessThan, b for between) -->
      <div class="flex items-center gap-3">
        <label for="prob-b" class="text-sm text-text-secondary w-16">
          {{ mode === 'lessThan' ? 'x =' : 'b =' }}
        </label>
        <input
          id="prob-b"
          type="number"
          :value="localB"
          :step="isDiscrete ? 1 : 0.1"
          class="flex-1 px-3 py-2 text-sm font-mono rounded border border-border
                 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          data-testid="prob-input-b"
          @change="handleBChange"
        />
      </div>
    </div>

    <!-- Result Display -->
    <div
      v-if="result"
      class="result-box p-4 rounded-lg bg-primary/10 border border-primary/30"
      data-testid="prob-result"
    >
      <div class="text-center">
        <div class="text-lg font-mono mb-1">
          <span v-if="result.type === 'lessThan'">
            P(X ≤ {{ result.b }})
          </span>
          <span v-else>
            P({{ result.a }} ≤ X ≤ {{ result.b }})
          </span>
        </div>
        <div class="text-3xl font-bold text-primary" data-testid="prob-value">
          {{ formatProbability(result.probability) }}
        </div>
        <div class="text-sm text-text-muted mt-1">
          = {{ formatDecimal(result.probability) }}
        </div>
      </div>
    </div>

    <!-- Help text -->
    <p class="mt-3 text-xs text-text-muted">
      <i class="fa-solid fa-info-circle mr-1" aria-hidden="true" />
      <span v-if="isDiscrete">
        For discrete distributions, P(X ≤ x) counts all integer values up to and including x.
      </span>
      <span v-else>
        For continuous distributions, P(X = exact value) = 0. Always use intervals.
      </span>
    </p>
  </div>
</template>
