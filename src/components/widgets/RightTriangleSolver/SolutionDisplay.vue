<script setup lang="ts">
import MathBlock from '@/components/content/MathBlock.vue'
import type { RightTriangle, SolutionStep, SpecialTriangle } from '@/utils/math/rightTriangle'

interface Props {
  triangle: RightTriangle
  steps: SolutionStep[]
  isValid: boolean
  errorMessage?: string
  area: number | null
  perimeter: number | null
  specialTriangle: SpecialTriangle | null
}

defineProps<Props>()

// Format number for display
function fmt(n: number | null, decimals = 4): string {
  if (n === null) return '—'
  return n.toFixed(decimals).replace(/\.?0+$/, '')
}
</script>

<template>
  <div class="solution-display" data-testid="solution-display">
    <!-- Error State -->
    <div
      v-if="errorMessage"
      class="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400"
    >
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true" />
        <span class="font-medium">{{ errorMessage }}</span>
      </div>
    </div>

    <!-- Valid Solution -->
    <template v-else-if="isValid">
      <!-- Results Summary -->
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          <i class="fa-solid fa-calculator mr-2" aria-hidden="true" />
          Solution
        </h4>

        <div class="grid grid-cols-2 gap-3 text-sm">
          <!-- Sides -->
          <div class="space-y-1">
            <div class="font-medium text-text-secondary">Sides</div>
            <div class="font-mono">a = {{ fmt(triangle.a) }}</div>
            <div class="font-mono">b = {{ fmt(triangle.b) }}</div>
            <div class="font-mono">c = {{ fmt(triangle.c) }}</div>
          </div>

          <!-- Angles -->
          <div class="space-y-1">
            <div class="font-medium text-text-secondary">Angles</div>
            <div class="font-mono">A = {{ fmt(triangle.A) }}°</div>
            <div class="font-mono">B = {{ fmt(triangle.B) }}°</div>
            <div class="font-mono text-text-muted">C = 90°</div>
          </div>
        </div>
      </div>

      <!-- Area and Perimeter -->
      <div class="mb-4 p-3 bg-surface-alt rounded border border-border">
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-text-muted">Area:</span>
            <span class="font-mono ml-2">{{ fmt(area) }}</span>
          </div>
          <div>
            <span class="text-text-muted">Perimeter:</span>
            <span class="font-mono ml-2">{{ fmt(perimeter) }}</span>
          </div>
        </div>
      </div>

      <!-- Special Triangle Badge -->
      <div
        v-if="specialTriangle"
        class="mb-4 p-3 bg-primary/10 border border-primary/30 rounded"
      >
        <div class="flex items-center gap-2 text-sm">
          <i class="fa-solid fa-star text-primary" aria-hidden="true" />
          <span class="font-medium text-primary">{{ specialTriangle.name }}</span>
        </div>
        <p class="text-xs text-text-muted mt-1">{{ specialTriangle.description }}</p>
      </div>

      <!-- Solution Steps -->
      <div v-if="steps.length > 0">
        <h4 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          <i class="fa-solid fa-list-ol mr-2" aria-hidden="true" />
          Steps Used
        </h4>

        <div class="space-y-3">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="p-3 bg-surface border border-border rounded"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                {{ index + 1 }}
              </span>
              <span class="text-sm font-medium">Finding {{ step.finding }}</span>
              <span class="text-xs text-text-muted">({{ step.formulaName }})</span>
            </div>

            <div class="pl-8 space-y-2">
              <div class="overflow-x-auto">
                <MathBlock :formula="step.formula" display />
              </div>
              <div class="text-sm font-mono text-text-secondary">
                {{ step.calculation }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Waiting for Input -->
    <div
      v-else
      class="p-4 bg-surface-alt border border-border rounded text-center"
    >
      <i class="fa-solid fa-triangle text-4xl text-text-muted mb-2" aria-hidden="true" />
      <p class="text-text-muted">
        Enter at least 2 known values to solve the triangle
      </p>
      <p class="text-xs text-text-muted mt-1">
        (One must be a side length)
      </p>
    </div>
  </div>
</template>
