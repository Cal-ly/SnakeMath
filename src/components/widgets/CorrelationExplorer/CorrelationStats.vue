<script setup lang="ts">
import type { LinearRegressionResult, RegressionConfidenceIntervals } from '@/composables/useCorrelation'

interface Props {
  n: number
  correlation: number | null
  formattedCorrelation: string
  correlationInterpretation: string
  rSquared: number | null
  formattedRSquared: string
  regression: LinearRegressionResult | null
  regressionEquation: string
  standardError: number
  confidenceIntervals: RegressionConfidenceIntervals | null
  showConfidenceIntervals: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="correlation-stats p-4 bg-surface border border-border rounded-lg" data-testid="correlation-stats">
    <h3 class="text-lg font-semibold text-text-primary mb-4">Statistics</h3>

    <div class="grid gap-4 md:grid-cols-2">
      <!-- Correlation Section -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-text-secondary uppercase tracking-wide">Correlation</h4>

        <div class="stat-row">
          <span class="stat-label">n (sample size)</span>
          <span class="stat-value" data-testid="stat-n">{{ n }}</span>
        </div>

        <div class="stat-row">
          <span class="stat-label">r (correlation)</span>
          <span
            :class="[
              'stat-value font-mono',
              correlation !== null && correlation > 0.5 ? 'text-emerald-600 dark:text-emerald-400' : '',
              correlation !== null && correlation < -0.5 ? 'text-red-600 dark:text-red-400' : '',
            ]"
            data-testid="stat-correlation"
          >
            {{ formattedCorrelation }}
          </span>
        </div>

        <div class="stat-row">
          <span class="stat-label">Interpretation</span>
          <span class="stat-value text-sm" data-testid="stat-interpretation">
            {{ correlationInterpretation || '-' }}
          </span>
        </div>

        <div class="stat-row">
          <span class="stat-label">R² (variance explained)</span>
          <span class="stat-value font-mono" data-testid="stat-r-squared">
            {{ formattedRSquared }}
          </span>
        </div>
      </div>

      <!-- Regression Section -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-text-secondary uppercase tracking-wide">Regression</h4>

        <div class="stat-row">
          <span class="stat-label">Equation</span>
          <span class="stat-value font-mono text-sm" data-testid="stat-equation">
            {{ regressionEquation }}
          </span>
        </div>

        <div class="stat-row">
          <span class="stat-label">Slope (m)</span>
          <span class="stat-value font-mono" data-testid="stat-slope">
            {{ regression?.slope.toFixed(4) ?? '-' }}
          </span>
        </div>

        <div class="stat-row">
          <span class="stat-label">Intercept (b)</span>
          <span class="stat-value font-mono" data-testid="stat-intercept">
            {{ regression?.intercept.toFixed(4) ?? '-' }}
          </span>
        </div>

        <div class="stat-row">
          <span class="stat-label">Std. Error</span>
          <span class="stat-value font-mono" data-testid="stat-std-error">
            {{ standardError > 0 ? standardError.toFixed(4) : '-' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Confidence Intervals -->
    <div
      v-if="showConfidenceIntervals && confidenceIntervals"
      class="mt-4 pt-4 border-t border-border"
    >
      <h4 class="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
        95% Confidence Intervals
      </h4>
      <div class="grid gap-2 md:grid-cols-2">
        <div class="stat-row">
          <span class="stat-label">Slope CI</span>
          <span class="stat-value font-mono text-sm" data-testid="stat-slope-ci">
            [{{ confidenceIntervals.slope.lower.toFixed(3) }},
            {{ confidenceIntervals.slope.upper.toFixed(3) }}]
          </span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Intercept CI</span>
          <span class="stat-value font-mono text-sm" data-testid="stat-intercept-ci">
            [{{ confidenceIntervals.intercept.lower.toFixed(3) }},
            {{ confidenceIntervals.intercept.upper.toFixed(3) }}]
          </span>
        </div>
      </div>
    </div>

    <!-- R² Explanation -->
    <div class="mt-4 p-3 bg-bg-secondary rounded-lg">
      <p class="text-sm text-text-secondary">
        <strong>R² = {{ formattedRSquared }}</strong> means that
        <span v-if="rSquared !== null && rSquared > 0">
          {{ (rSquared * 100).toFixed(1) }}% of the variance in y is explained by x.
        </span>
        <span v-else>
          we need at least 2 points to calculate correlation.
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.stat-row {
  @apply flex justify-between items-center py-1;
}

.stat-label {
  @apply text-sm text-text-secondary;
}

.stat-value {
  @apply text-text-primary;
}
</style>
