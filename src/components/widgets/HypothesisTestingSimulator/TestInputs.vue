<script setup lang="ts">
import type { TestType } from '@/composables/useHypothesisTesting'

interface Props {
  testType: TestType

  // One-Sample T-Test
  oneSampleMean: number
  oneSampleStdDev: number
  oneSampleN: number
  oneSampleHypothesized: number

  // Two-Sample T-Test
  twoSampleMean1: number
  twoSampleStdDev1: number
  twoSampleN1: number
  twoSampleMean2: number
  twoSampleStdDev2: number
  twoSampleN2: number

  // One-Proportion Z-Test
  onePropSuccesses: number
  onePropN: number
  onePropHypothesized: number

  // Two-Proportion Z-Test
  twoPropSuccesses1: number
  twoPropN1: number
  twoPropSuccesses2: number
  twoPropN2: number
}

defineProps<Props>()

const emit = defineEmits<{
  // One-Sample T-Test
  'update:oneSampleMean': [value: number]
  'update:oneSampleStdDev': [value: number]
  'update:oneSampleN': [value: number]
  'update:oneSampleHypothesized': [value: number]
  // Two-Sample T-Test
  'update:twoSampleMean1': [value: number]
  'update:twoSampleStdDev1': [value: number]
  'update:twoSampleN1': [value: number]
  'update:twoSampleMean2': [value: number]
  'update:twoSampleStdDev2': [value: number]
  'update:twoSampleN2': [value: number]
  // One-Proportion Z-Test
  'update:onePropSuccesses': [value: number]
  'update:onePropN': [value: number]
  'update:onePropHypothesized': [value: number]
  // Two-Proportion Z-Test
  'update:twoPropSuccesses1': [value: number]
  'update:twoPropN1': [value: number]
  'update:twoPropSuccesses2': [value: number]
  'update:twoPropN2': [value: number]
}>()

function handleNumberInput(
  event: Event,
  emitEvent: (value: number) => void,
  allowFloat: boolean = true
) {
  const target = event.target as HTMLInputElement
  const value = allowFloat ? parseFloat(target.value) : parseInt(target.value, 10)
  if (!isNaN(value)) {
    emitEvent(value)
  }
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-text-primary">Test Data</h3>

    <!-- One-Sample T-Test -->
    <template v-if="testType === 'one-sample-t'">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="one-sample-mean" class="block text-sm text-text-secondary mb-1">
            Sample Mean (x̄)
          </label>
          <input
            id="one-sample-mean"
            type="number"
            :value="oneSampleMean"
            step="0.1"
            class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
            data-testid="input-one-sample-mean"
            @input="handleNumberInput($event, (v) => emit('update:oneSampleMean', v))"
          />
        </div>
        <div>
          <label for="one-sample-sd" class="block text-sm text-text-secondary mb-1">
            Sample SD (s)
          </label>
          <input
            id="one-sample-sd"
            type="number"
            :value="oneSampleStdDev"
            step="0.1"
            min="0.01"
            class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
            data-testid="input-one-sample-sd"
            @input="handleNumberInput($event, (v) => emit('update:oneSampleStdDev', v))"
          />
        </div>
        <div>
          <label for="one-sample-n" class="block text-sm text-text-secondary mb-1">
            Sample Size (n)
          </label>
          <input
            id="one-sample-n"
            type="number"
            :value="oneSampleN"
            min="2"
            step="1"
            class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
            data-testid="input-one-sample-n"
            @input="handleNumberInput($event, (v) => emit('update:oneSampleN', v), false)"
          />
        </div>
        <div>
          <label for="one-sample-hyp" class="block text-sm text-text-secondary mb-1">
            H<sub>0</sub>: μ =
          </label>
          <input
            id="one-sample-hyp"
            type="number"
            :value="oneSampleHypothesized"
            step="0.1"
            class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
            data-testid="input-one-sample-hyp"
            @input="handleNumberInput($event, (v) => emit('update:oneSampleHypothesized', v))"
          />
        </div>
      </div>
    </template>

    <!-- Two-Sample T-Test -->
    <template v-else-if="testType === 'two-sample-t'">
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-text-secondary">Group 1</h4>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label for="two-sample-mean1" class="block text-sm text-text-secondary mb-1">
              Mean (x̄₁)
            </label>
            <input
              id="two-sample-mean1"
              type="number"
              :value="twoSampleMean1"
              step="0.1"
              class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
              @input="handleNumberInput($event, (v) => emit('update:twoSampleMean1', v))"
            />
          </div>
          <div>
            <label for="two-sample-sd1" class="block text-sm text-text-secondary mb-1">
              SD (s₁)
            </label>
            <input
              id="two-sample-sd1"
              type="number"
              :value="twoSampleStdDev1"
              step="0.1"
              min="0.01"
              class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
              @input="handleNumberInput($event, (v) => emit('update:twoSampleStdDev1', v))"
            />
          </div>
          <div>
            <label for="two-sample-n1" class="block text-sm text-text-secondary mb-1">
              n₁
            </label>
            <input
              id="two-sample-n1"
              type="number"
              :value="twoSampleN1"
              min="2"
              step="1"
              class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
              @input="handleNumberInput($event, (v) => emit('update:twoSampleN1', v), false)"
            />
          </div>
        </div>

        <h4 class="text-sm font-medium text-text-secondary mt-2">Group 2</h4>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label for="two-sample-mean2" class="block text-sm text-text-secondary mb-1">
              Mean (x̄₂)
            </label>
            <input
              id="two-sample-mean2"
              type="number"
              :value="twoSampleMean2"
              step="0.1"
              class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
              @input="handleNumberInput($event, (v) => emit('update:twoSampleMean2', v))"
            />
          </div>
          <div>
            <label for="two-sample-sd2" class="block text-sm text-text-secondary mb-1">
              SD (s₂)
            </label>
            <input
              id="two-sample-sd2"
              type="number"
              :value="twoSampleStdDev2"
              step="0.1"
              min="0.01"
              class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
              @input="handleNumberInput($event, (v) => emit('update:twoSampleStdDev2', v))"
            />
          </div>
          <div>
            <label for="two-sample-n2" class="block text-sm text-text-secondary mb-1">
              n₂
            </label>
            <input
              id="two-sample-n2"
              type="number"
              :value="twoSampleN2"
              min="2"
              step="1"
              class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
              @input="handleNumberInput($event, (v) => emit('update:twoSampleN2', v), false)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- One-Proportion Z-Test -->
    <template v-else-if="testType === 'one-prop-z'">
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label for="one-prop-successes" class="block text-sm text-text-secondary mb-1">
            Successes (x)
          </label>
          <input
            id="one-prop-successes"
            type="number"
            :value="onePropSuccesses"
            min="0"
            :max="onePropN"
            step="1"
            class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
            @input="handleNumberInput($event, (v) => emit('update:onePropSuccesses', v), false)"
          />
        </div>
        <div>
          <label for="one-prop-n" class="block text-sm text-text-secondary mb-1">
            Sample Size (n)
          </label>
          <input
            id="one-prop-n"
            type="number"
            :value="onePropN"
            min="1"
            step="1"
            class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
            @input="handleNumberInput($event, (v) => emit('update:onePropN', v), false)"
          />
        </div>
        <div>
          <label for="one-prop-hyp" class="block text-sm text-text-secondary mb-1">
            H<sub>0</sub>: p =
          </label>
          <input
            id="one-prop-hyp"
            type="number"
            :value="onePropHypothesized"
            step="0.01"
            min="0.001"
            max="0.999"
            class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
            @input="handleNumberInput($event, (v) => emit('update:onePropHypothesized', v))"
          />
        </div>
      </div>
      <p class="text-sm text-text-muted mt-1">
        Sample proportion: {{ (onePropSuccesses / onePropN).toFixed(3) }}
      </p>
    </template>

    <!-- Two-Proportion Z-Test -->
    <template v-else-if="testType === 'two-prop-z'">
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-text-secondary">Group 1</h4>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="two-prop-successes1" class="block text-sm text-text-secondary mb-1">
              Successes (x₁)
            </label>
            <input
              id="two-prop-successes1"
              type="number"
              :value="twoPropSuccesses1"
              min="0"
              :max="twoPropN1"
              step="1"
              class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
              @input="handleNumberInput($event, (v) => emit('update:twoPropSuccesses1', v), false)"
            />
          </div>
          <div>
            <label for="two-prop-n1" class="block text-sm text-text-secondary mb-1">
              Sample Size (n₁)
            </label>
            <input
              id="two-prop-n1"
              type="number"
              :value="twoPropN1"
              min="1"
              step="1"
              class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
              @input="handleNumberInput($event, (v) => emit('update:twoPropN1', v), false)"
            />
          </div>
        </div>
        <p class="text-sm text-text-muted -mt-1">
          p̂₁ = {{ (twoPropSuccesses1 / twoPropN1).toFixed(3) }}
        </p>

        <h4 class="text-sm font-medium text-text-secondary mt-2">Group 2</h4>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="two-prop-successes2" class="block text-sm text-text-secondary mb-1">
              Successes (x₂)
            </label>
            <input
              id="two-prop-successes2"
              type="number"
              :value="twoPropSuccesses2"
              min="0"
              :max="twoPropN2"
              step="1"
              class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
              @input="handleNumberInput($event, (v) => emit('update:twoPropSuccesses2', v), false)"
            />
          </div>
          <div>
            <label for="two-prop-n2" class="block text-sm text-text-secondary mb-1">
              Sample Size (n₂)
            </label>
            <input
              id="two-prop-n2"
              type="number"
              :value="twoPropN2"
              min="1"
              step="1"
              class="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-primary text-text-primary min-h-[44px]"
              @input="handleNumberInput($event, (v) => emit('update:twoPropN2', v), false)"
            />
          </div>
        </div>
        <p class="text-sm text-text-muted -mt-1">
          p̂₂ = {{ (twoPropSuccesses2 / twoPropN2).toFixed(3) }}
        </p>
      </div>
    </template>
  </div>
</template>
