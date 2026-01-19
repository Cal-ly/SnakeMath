<script setup lang="ts">
import { computed } from 'vue'
import type { SampleResult, ConfidenceInterval } from '@/composables/useSamplingSimulator'

interface Props {
  /** Current sample result */
  sample: SampleResult | null
  /** Confidence interval for current sample */
  ci: ConfidenceInterval | null
  /** True population mean */
  trueMean: number
  /** Confidence level */
  confidenceLevel: number
}

const props = defineProps<Props>()

// Check if CI captures true mean
const capturesTrueMean = computed(() => {
  if (!props.ci) return null
  return props.ci.lower <= props.trueMean && props.trueMean <= props.ci.upper
})

// Format number for display
function format(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}

// Confidence level as percentage
const confPercent = computed(() => (props.confidenceLevel * 100).toFixed(0))
</script>

<template>
  <div class="sampling-results" data-testid="sampling-results">
    <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-chart-simple mr-2" aria-hidden="true" />
      Current Sample
    </h4>

    <div v-if="sample" class="space-y-4">
      <!-- Basic statistics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="p-3 bg-surface-alt rounded-lg text-center">
          <div class="text-xs text-text-muted mb-1">Sample Size</div>
          <div class="text-lg font-semibold" data-testid="sample-n">
            n = {{ sample.values.length }}
          </div>
        </div>

        <div class="p-3 bg-surface-alt rounded-lg text-center">
          <div class="text-xs text-text-muted mb-1">Sample Mean</div>
          <div class="text-lg font-semibold text-primary" data-testid="sample-mean">
            x̄ = {{ format(sample.mean) }}
          </div>
        </div>

        <div class="p-3 bg-surface-alt rounded-lg text-center">
          <div class="text-xs text-text-muted mb-1">Sample Std Dev</div>
          <div class="text-lg font-semibold" data-testid="sample-stddev">
            s = {{ format(sample.standardDeviation) }}
          </div>
        </div>

        <div class="p-3 bg-surface-alt rounded-lg text-center">
          <div class="text-xs text-text-muted mb-1">Standard Error</div>
          <div class="text-lg font-semibold" data-testid="sample-se">
            SE = {{ format(sample.standardError, 3) }}
          </div>
        </div>
      </div>

      <!-- Confidence Interval -->
      <div
v-if="ci" class="p-4 rounded-lg border" :class="
        capturesTrueMean
          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
      ">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">{{ confPercent }}% Confidence Interval</span>
          <span
            class="text-xs font-medium px-2 py-0.5 rounded"
            :class="
              capturesTrueMean
                ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300'
                : 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300'
            "
          >
            <i
              class="fa-solid mr-1"
              :class="capturesTrueMean ? 'fa-check' : 'fa-xmark'"
              aria-hidden="true"
            />
            {{ capturesTrueMean ? 'Captures μ' : 'Misses μ' }}
          </span>
        </div>

        <div class="flex items-center justify-center gap-2 text-lg font-mono" data-testid="ci-display">
          <span>[</span>
          <span>{{ format(ci.lower) }}</span>
          <span class="text-text-muted">,</span>
          <span>{{ format(ci.upper) }}</span>
          <span>]</span>
        </div>

        <div class="mt-2 text-xs text-text-secondary text-center">
          Margin of Error: ± {{ format(ci.marginOfError) }}
        </div>

        <!-- Visual CI representation -->
        <div class="mt-3 relative h-6">
          <!-- CI bar background -->
          <div class="absolute inset-y-0 left-0 right-0 flex items-center">
            <div class="w-full h-1 bg-border rounded" />
          </div>

          <!-- CI interval bar -->
          <div
            class="absolute inset-y-0 flex items-center"
            :style="{
              left: `${Math.max(0, Math.min(100, ((ci.lower - (trueMean - 3 * ci.marginOfError)) / (6 * ci.marginOfError)) * 100))}%`,
              right: `${Math.max(0, 100 - Math.min(100, ((ci.upper - (trueMean - 3 * ci.marginOfError)) / (6 * ci.marginOfError)) * 100))}%`,
            }"
          >
            <div
              class="w-full h-2 rounded"
              :class="capturesTrueMean ? 'bg-green-500' : 'bg-red-500'"
              data-testid="ci-bar"
            />
          </div>

          <!-- True mean marker -->
          <div
            class="absolute inset-y-0 flex items-center"
            :style="{
              left: `${Math.max(0, Math.min(100, ((trueMean - (trueMean - 3 * ci.marginOfError)) / (6 * ci.marginOfError)) * 100))}%`,
            }"
          >
            <div class="w-0.5 h-4 bg-text -ml-px" />
          </div>
        </div>

        <div class="mt-1 text-xs text-center text-text-muted">
          True μ = {{ format(trueMean) }}
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="p-8 text-center text-text-muted bg-surface-alt rounded-lg">
      <i class="fa-solid fa-arrow-pointer text-2xl mb-2" aria-hidden="true" />
      <p>Click "Take Sample" to begin</p>
    </div>
  </div>
</template>

<style scoped>
.sampling-results {
  --min-touch-target: 44px;
}
</style>
