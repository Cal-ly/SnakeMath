<script setup lang="ts">
import { ref, computed } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'
import type { TrigIdentity, VerificationResult } from '@/utils/math/trigIdentities'
import IdentityProof from './IdentityProof.vue'
import IdentityVerifier from './IdentityVerifier.vue'

interface Props {
  identity: TrigIdentity
  angleDeg: number
  angleDeg2?: number
  isSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  angleDeg2: 30,
})

const emit = defineEmits<{
  select: []
}>()

// Local state for expandable sections
const showProof = ref(false)
const showCode = ref(false)

// Compute verification result
const verification = computed<VerificationResult>(() => {
  return props.identity.verify(props.angleDeg, props.angleDeg2)
})
</script>

<template>
  <div
    class="identity-card p-4 rounded-lg border transition-all"
    :class="[
      isSelected
        ? 'bg-primary/10 border-primary'
        : 'bg-surface border-border hover:border-primary/50',
    ]"
    data-testid="identity-card"
  >
    <!-- Header -->
    <button
      class="w-full text-left"
      @click="emit('select')"
    >
      <h4 class="font-semibold text-text-primary mb-2">
        {{ identity.name }}
      </h4>

      <!-- Main formula -->
      <div class="overflow-x-auto py-2">
        <MathBlock :formula="identity.latex" display />
      </div>

      <p class="text-sm text-text-muted">
        {{ identity.description }}
      </p>
    </button>

    <!-- Expanded content when selected -->
    <div v-if="isSelected" class="mt-4 space-y-4">
      <!-- Verification section -->
      <IdentityVerifier
        :identity="identity"
        :angle-deg="angleDeg"
        :angle-deg2="angleDeg2"
        :verification="verification"
      />

      <!-- Toggle buttons -->
      <div class="flex gap-2 flex-wrap">
        <button
          class="px-3 py-1.5 text-sm rounded border transition-colors"
          :class="[
            showProof
              ? 'bg-primary text-white border-primary'
              : 'bg-surface-alt border-border hover:border-primary',
          ]"
          @click="showProof = !showProof"
        >
          <i class="fa-solid fa-graduation-cap mr-1" aria-hidden="true" />
          {{ showProof ? 'Hide Proof' : 'Show Proof' }}
        </button>

        <button
          class="px-3 py-1.5 text-sm rounded border transition-colors"
          :class="[
            showCode
              ? 'bg-primary text-white border-primary'
              : 'bg-surface-alt border-border hover:border-primary',
          ]"
          @click="showCode = !showCode"
        >
          <i class="fa-solid fa-code mr-1" aria-hidden="true" />
          {{ showCode ? 'Hide Python' : 'See in Python' }}
        </button>
      </div>

      <!-- Proof steps -->
      <IdentityProof
        v-if="showProof"
        :steps="identity.proofSteps"
      />

      <!-- Python code -->
      <div
        v-if="showCode"
        class="p-3 bg-surface-alt rounded border border-border"
      >
        <pre class="text-xs font-mono overflow-x-auto whitespace-pre-wrap text-text-secondary">{{ identity.pythonCode }}</pre>
      </div>

      <!-- Notes -->
      <p v-if="identity.notes" class="text-xs text-amber-600 dark:text-amber-400">
        <i class="fa-solid fa-triangle-exclamation mr-1" aria-hidden="true" />
        {{ identity.notes }}
      </p>
    </div>
  </div>
</template>
