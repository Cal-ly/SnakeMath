<script setup lang="ts">
/**
 * FunctionSelector - Dropdown for integration function presets
 *
 * Displays preset name in dropdown and shows LaTeX formula below.
 */

import { computed } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'
import { INTEGRATION_PRESETS } from '@/utils/math/integration'
import type { IntegrationFunctionPreset } from '@/types/math'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  modelValue: string
  preset?: IntegrationFunctionPreset
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// ============================================================================
// Computed
// ============================================================================

const selectedId = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-3">
      <label for="function-select" class="text-sm font-medium text-text-secondary">
        Function:
      </label>
      <select
        id="function-select"
        v-model="selectedId"
        class="px-3 py-1.5 rounded-md border border-border bg-surface text-text
               focus:ring-2 focus:ring-primary/30 focus:border-primary
               transition-colors"
      >
        <option
          v-for="p in INTEGRATION_PRESETS"
          :key="p.id"
          :value="p.id"
        >
          {{ p.name }}
        </option>
      </select>
    </div>

    <!-- Formula display -->
    <div v-if="preset" class="flex items-center gap-2 text-sm">
      <span class="text-text-secondary">Formula:</span>
      <MathBlock :formula="preset.latex" />
    </div>

    <!-- Description -->
    <p v-if="preset" class="text-xs text-text-muted">
      {{ preset.description }}
    </p>
  </div>
</template>
