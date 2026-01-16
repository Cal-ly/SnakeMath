<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SummationResult } from '@/types/math'

interface Props {
  /** The summation result to display */
  result: SummationResult
  /** Maximum terms to show before collapsing */
  maxTermsToShow?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxTermsToShow: 10,
})

const showAllTerms = ref(false)

// Format terms for display
const termsDisplay = computed(() => {
  const { terms } = props.result

  if (terms.length === 0) {
    return { text: '(empty sum)', truncated: false }
  }

  if (terms.length <= props.maxTermsToShow || showAllTerms.value) {
    return {
      text: terms.join(' + '),
      truncated: false,
    }
  }

  // Show first 5 and last 2 with ellipsis
  const first = terms.slice(0, 5)
  const last = terms.slice(-2)
  return {
    text: `${first.join(' + ')} + ... + ${last.join(' + ')}`,
    truncated: true,
    hiddenCount: terms.length - 7,
  }
})

// Format large numbers with commas
function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toLocaleString()
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

function toggleShowAll() {
  showAllTerms.value = !showAllTerms.value
}
</script>

<template>
  <div class="summation-result">
    <!-- Total display -->
    <div class="flex items-baseline gap-3 mb-3">
      <span class="text-sm text-text-muted uppercase tracking-wide">Total:</span>
      <span class="text-3xl font-bold text-primary font-mono" data-testid="summation-total">
        {{ formatNumber(result.total) }}
      </span>
    </div>

    <!-- Term count -->
    <p class="text-sm text-text-muted mb-3">
      <i class="fa-solid fa-list-ol mr-1.5" aria-hidden="true" />
      {{ result.termCount }} term{{ result.termCount !== 1 ? 's' : '' }}
    </p>

    <!-- Terms breakdown -->
    <div v-if="result.termCount > 0" class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-text-muted">Term Breakdown:</span>
        <button
          v-if="result.terms.length > maxTermsToShow"
          type="button"
          class="text-xs text-primary hover:underline"
          @click="toggleShowAll"
        >
          {{ showAllTerms ? 'Show less' : `Show all ${result.terms.length} terms` }}
        </button>
      </div>

      <div
        class="p-3 bg-surface-alt rounded-lg font-mono text-sm overflow-x-auto"
        role="region"
        aria-label="Term breakdown"
        data-testid="summation-terms"
      >
        <p class="whitespace-nowrap">
          <span class="text-text-secondary">{{ termsDisplay.text }}</span>
          <span class="text-text-muted"> = </span>
          <span class="text-primary font-semibold">{{ formatNumber(result.total) }}</span>
        </p>
      </div>

      <p
        v-if="termsDisplay.truncated && !showAllTerms"
        class="mt-1 text-xs text-text-muted text-right"
      >
        {{ termsDisplay.hiddenCount }} terms hidden
      </p>
    </div>

    <!-- Empty sum message -->
    <div v-else class="mt-4 p-4 bg-surface-alt rounded-lg text-center">
      <p class="text-text-muted">
        <i class="fa-solid fa-info-circle mr-1.5" aria-hidden="true" />
        Empty sum (start > end)
      </p>
    </div>
  </div>
</template>
