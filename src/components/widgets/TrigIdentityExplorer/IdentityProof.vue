<script setup lang="ts">
import MathBlock from '@/components/content/MathBlock.vue'
import type { ProofStep } from '@/utils/math/trigIdentities'

interface Props {
  steps: ProofStep[]
}

defineProps<Props>()
</script>

<template>
  <div class="identity-proof" data-testid="identity-proof">
    <h5 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-list-ol mr-2" aria-hidden="true" />
      Algebraic Proof
    </h5>

    <div class="space-y-3">
      <div
        v-for="step in steps"
        :key="step.step"
        class="p-3 bg-surface rounded border border-border"
      >
        <div class="flex items-start gap-3">
          <!-- Step number -->
          <span class="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
            {{ step.step }}
          </span>

          <div class="flex-1 min-w-0">
            <!-- LaTeX formula -->
            <div class="overflow-x-auto mb-1">
              <MathBlock :formula="step.latex" />
            </div>

            <!-- Explanation -->
            <p class="text-sm text-text-muted">
              {{ step.explanation }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
