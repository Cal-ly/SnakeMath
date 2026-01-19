<script setup lang="ts">
/**
 * MethodSelector - Radio buttons for Riemann sum methods
 */

import { computed } from 'vue'
import type { RiemannMethod } from '@/types/math'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  modelValue: RiemannMethod
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: RiemannMethod]
}>()

// ============================================================================
// Data
// ============================================================================

interface MethodOption {
  id: RiemannMethod
  label: string
  description: string
  convergence: string
}

const methods: MethodOption[] = [
  {
    id: 'left',
    label: 'Left',
    description: 'Sample at left endpoint of each interval',
    convergence: 'O(1/n)',
  },
  {
    id: 'right',
    label: 'Right',
    description: 'Sample at right endpoint of each interval',
    convergence: 'O(1/n)',
  },
  {
    id: 'midpoint',
    label: 'Midpoint',
    description: 'Sample at center of each interval',
    convergence: 'O(1/n²)',
  },
  {
    id: 'trapezoidal',
    label: 'Trapezoidal',
    description: 'Use trapezoids instead of rectangles',
    convergence: 'O(1/n²)',
  },
  {
    id: 'simpson',
    label: "Simpson's",
    description: 'Parabolic approximation (requires even n)',
    convergence: 'O(1/n⁴)',
  },
]

// ============================================================================
// Computed
// ============================================================================

const selectedMethod = computed({
  get: () => props.modelValue,
  set: (value: RiemannMethod) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="space-y-2">
    <span class="text-sm font-medium text-text-secondary">Method:</span>

    <div class="flex flex-wrap gap-2">
      <label
        v-for="m in methods"
        :key="m.id"
        class="flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer
               transition-all"
        :class="selectedMethod === m.id
          ? 'bg-primary text-white border-primary'
          : 'bg-surface border-border hover:border-primary'"
        :title="`${m.description} — Convergence: ${m.convergence}`"
      >
        <input
          v-model="selectedMethod"
          type="radio"
          :value="m.id"
          class="sr-only"
          :name="'riemann-method'"
        />
        <span class="text-sm font-medium">{{ m.label }}</span>
      </label>
    </div>

    <!-- Method description -->
    <p class="text-xs text-text-muted">
      {{ methods.find(m => m.id === selectedMethod)?.description }}
      <span class="ml-2 text-primary">
        ({{ methods.find(m => m.id === selectedMethod)?.convergence }})
      </span>
    </p>
  </div>
</template>
