<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  /** Calculated sample size for mean */
  sampleSizeMean: number | null
  /** Calculated sample size for proportion */
  sampleSizeProportion: number | null
  /** Margin of error */
  marginOfError: number
  /** Standard deviation (for mean estimation) */
  stdDev: number
  /** Expected proportion (for proportion estimation) */
  proportion: number
  /** Confidence level */
  confidenceLevel: number
}

defineProps<Props>()

const emit = defineEmits<{
  'update:marginOfError': [value: number]
  'update:stdDev': [value: number]
  'update:proportion': [value: number]
  'update:confidenceLevel': [value: number]
}>()

// Tab state
const activeTab = ref<'mean' | 'proportion'>('mean')

function handleMarginChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value) && value > 0) {
    emit('update:marginOfError', value)
  }
}

function handleStdDevChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value) && value > 0) {
    emit('update:stdDev', value)
  }
}

function handleProportionChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value) && value > 0 && value < 1) {
    emit('update:proportion', value)
  }
}

function handleConfidenceChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = parseFloat(target.value)
  emit('update:confidenceLevel', value)
}
</script>

<template>
  <div class="sample-size-calculator" data-testid="sample-size-calculator">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide">
        <i class="fa-solid fa-calculator mr-2" aria-hidden="true" />
        Sample Size Calculator
      </h4>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-4 p-1 bg-surface-alt rounded-lg">
      <button
        type="button"
        class="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
               focus:outline-none focus:ring-2 focus:ring-primary/30"
        :class="
          activeTab === 'mean'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-primary'
        "
        @click="activeTab = 'mean'"
      >
        Estimating Mean
      </button>
      <button
        type="button"
        class="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
               focus:outline-none focus:ring-2 focus:ring-primary/30"
        :class="
          activeTab === 'proportion'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-primary'
        "
        @click="activeTab = 'proportion'"
      >
        Estimating Proportion
      </button>
    </div>

    <!-- Mean estimation inputs -->
    <div v-if="activeTab === 'mean'" class="space-y-4">
      <div>
        <label class="block text-sm text-text-secondary mb-1">
          Desired Margin of Error (E)
        </label>
        <input
          type="number"
          :value="marginOfError"
          min="0.1"
          step="0.5"
          class="w-full px-3 py-2 border border-border rounded-md bg-surface
                 focus:outline-none focus:ring-2 focus:ring-primary/30"
          data-testid="margin-error-input"
          @input="handleMarginChange"
        />
        <p class="text-xs text-text-muted mt-1">How precise should the estimate be?</p>
      </div>

      <div>
        <label class="block text-sm text-text-secondary mb-1">
          Population Std Dev (σ) - estimate
        </label>
        <input
          type="number"
          :value="stdDev"
          min="0.1"
          step="1"
          class="w-full px-3 py-2 border border-border rounded-md bg-surface
                 focus:outline-none focus:ring-2 focus:ring-primary/30"
          data-testid="std-dev-input"
          @input="handleStdDevChange"
        />
        <p class="text-xs text-text-muted mt-1">Estimate from prior data or pilot study</p>
      </div>

      <div>
        <label class="block text-sm text-text-secondary mb-1">
          Confidence Level
        </label>
        <select
          :value="confidenceLevel"
          class="w-full px-3 py-2 border border-border rounded-md bg-surface
                 focus:outline-none focus:ring-2 focus:ring-primary/30"
          data-testid="confidence-select"
          @change="handleConfidenceChange"
        >
          <option :value="0.90">90%</option>
          <option :value="0.95">95%</option>
          <option :value="0.99">99%</option>
        </select>
      </div>

      <!-- Result -->
      <div class="p-4 bg-primary/10 rounded-lg border border-primary/30">
        <div class="text-sm text-text-secondary mb-1">Required Sample Size</div>
        <div class="text-3xl font-bold text-primary" data-testid="sample-size-mean-result">
          {{ sampleSizeMean !== null ? 'n = ' + sampleSizeMean : '—' }}
        </div>
        <p class="text-xs text-text-muted mt-2">
          Formula: n = (z × σ / E)²
        </p>
      </div>
    </div>

    <!-- Proportion estimation inputs -->
    <div v-else class="space-y-4">
      <div>
        <label class="block text-sm text-text-secondary mb-1">
          Desired Margin of Error (E) - percentage points
        </label>
        <input
          type="number"
          :value="marginOfError"
          min="0.5"
          step="0.5"
          class="w-full px-3 py-2 border border-border rounded-md bg-surface
                 focus:outline-none focus:ring-2 focus:ring-primary/30"
          data-testid="margin-error-prop-input"
          @input="handleMarginChange"
        />
        <p class="text-xs text-text-muted mt-1">e.g., 3 means ± 3 percentage points</p>
      </div>

      <div>
        <label class="block text-sm text-text-secondary mb-1">
          Expected Proportion (p)
        </label>
        <input
          type="number"
          :value="proportion"
          min="0.01"
          max="0.99"
          step="0.05"
          class="w-full px-3 py-2 border border-border rounded-md bg-surface
                 focus:outline-none focus:ring-2 focus:ring-primary/30"
          data-testid="proportion-input"
          @input="handleProportionChange"
        />
        <p class="text-xs text-text-muted mt-1">Use 0.5 for conservative (largest) sample size</p>
      </div>

      <div>
        <label class="block text-sm text-text-secondary mb-1">
          Confidence Level
        </label>
        <select
          :value="confidenceLevel"
          class="w-full px-3 py-2 border border-border rounded-md bg-surface
                 focus:outline-none focus:ring-2 focus:ring-primary/30"
          @change="handleConfidenceChange"
        >
          <option :value="0.90">90%</option>
          <option :value="0.95">95%</option>
          <option :value="0.99">99%</option>
        </select>
      </div>

      <!-- Result -->
      <div class="p-4 bg-primary/10 rounded-lg border border-primary/30">
        <div class="text-sm text-text-secondary mb-1">Required Sample Size</div>
        <div class="text-3xl font-bold text-primary" data-testid="sample-size-prop-result">
          {{ sampleSizeProportion !== null ? 'n = ' + sampleSizeProportion : '—' }}
        </div>
        <p class="text-xs text-text-muted mt-2">
          Formula: n = z² × p(1-p) / E²
        </p>
      </div>
    </div>

    <!-- Key insight -->
    <div class="mt-4 p-3 bg-surface-alt rounded-lg text-xs text-text-secondary">
      <i class="fa-solid fa-lightbulb text-amber-500 mr-2" aria-hidden="true" />
      <strong>The √n relationship:</strong> To halve your margin of error, you need 4× the sample size.
    </div>
  </div>
</template>

<style scoped>
.sample-size-calculator button,
.sample-size-calculator input,
.sample-size-calculator select {
  min-height: 44px;
}
</style>
