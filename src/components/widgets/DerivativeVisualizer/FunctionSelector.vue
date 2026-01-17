<script setup lang="ts">
/**
 * FunctionSelector - Preset function selection for DerivativeVisualizer
 */

import type { DerivativeFunctionPreset } from '@/types/math'
import MathBlock from '@/components/content/MathBlock.vue'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  presets: DerivativeFunctionPreset[]
  selectedId: string
  selectedPreset?: DerivativeFunctionPreset
}

defineProps<Props>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <div class="function-selector">
    <h4 class="text-sm font-semibold text-primary mb-2">
      <span class="mr-2" aria-hidden="true">f</span>
      Select Function
    </h4>

    <!-- Preset buttons -->
    <div class="flex flex-wrap gap-2 mb-3" role="radiogroup" aria-label="Function presets">
      <button
        v-for="preset in presets"
        :key="preset.id"
        role="radio"
        :aria-checked="selectedId === preset.id"
        class="px-3 py-1.5 text-sm rounded-md transition-colors"
        :class="
          selectedId === preset.id
            ? 'bg-primary text-white'
            : 'bg-surface-alt hover:bg-surface border border-border'
        "
        @click="emit('select', preset.id)"
      >
        {{ preset.name }}
      </button>
    </div>

    <!-- Selected function display -->
    <div v-if="selectedPreset" class="p-3 bg-surface rounded-lg border border-primary/30">
      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <div class="flex-1">
          <MathBlock :formula="selectedPreset.latex" />
        </div>
        <div class="text-text-muted text-sm" aria-hidden="true">→</div>
        <div class="flex-1">
          <MathBlock :formula="selectedPreset.derivativeLatex" />
        </div>
      </div>
    </div>
  </div>
</template>
