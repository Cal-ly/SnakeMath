<script setup lang="ts">
import MathBlock from '@/components/content/MathBlock.vue'
import type { TrigIdentity, VerificationResult } from '@/utils/math/trigIdentities'

interface Props {
  identity: TrigIdentity
  angleDeg: number
  angleDeg2?: number
  verification: VerificationResult
}

const props = defineProps<Props>()

// Check if this is a two-angle identity (sum/difference)
const isTwoAngle = ['sum-sin', 'diff-sin', 'sum-cos', 'diff-cos', 'sum-tan'].includes(props.identity.id)
</script>

<template>
  <div class="identity-verifier" data-testid="identity-verifier">
    <div class="p-3 bg-surface-alt rounded border border-border">
      <div class="flex items-center gap-2 mb-2">
        <i
          class="fa-solid"
          :class="[
            verification.isEqual
              ? 'fa-circle-check text-green-500'
              : 'fa-circle-xmark text-red-500',
          ]"
          aria-hidden="true"
        />
        <span class="text-sm font-medium">
          Verification at
          <span v-if="isTwoAngle">
            A = {{ angleDeg }}°, B = {{ angleDeg2 }}°
          </span>
          <span v-else>
            θ = {{ angleDeg }}°
          </span>
        </span>
      </div>

      <div class="grid gap-2 text-sm">
        <!-- Left side -->
        <div class="flex items-center gap-2">
          <span class="text-text-muted w-20">Left side:</span>
          <div class="overflow-x-auto">
            <MathBlock :formula="identity.latexLeft" />
          </div>
          <span class="font-mono text-text-secondary">
            = {{ verification.leftSideFormatted }}
          </span>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-2">
          <span class="text-text-muted w-20">Right side:</span>
          <div class="overflow-x-auto">
            <MathBlock :formula="identity.latexRight" />
          </div>
          <span class="font-mono text-text-secondary">
            = {{ verification.rightSideFormatted }}
          </span>
        </div>
      </div>

      <!-- Result -->
      <div class="mt-2 pt-2 border-t border-border">
        <span
          class="text-sm font-medium"
          :class="verification.isEqual ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
        >
          {{ verification.isEqual ? 'Equal within tolerance' : 'Not equal (possible singularity)' }}
        </span>
      </div>
    </div>
  </div>
</template>
