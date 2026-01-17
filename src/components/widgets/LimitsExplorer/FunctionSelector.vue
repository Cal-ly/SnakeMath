<script setup lang="ts">
/**
 * FunctionSelector - Preset function selection buttons
 */

import type { LimitFunctionPreset } from '@/types/math'
import { LIMIT_PRESETS } from '@/utils/math/limits'
import MathBlock from '@/components/content/MathBlock.vue'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  selectedId: string
  selectedPreset?: LimitFunctionPreset
}

defineProps<Props>()

const emit = defineEmits<{
  select: [id: string]
}>()

// ============================================================================
// Methods
// ============================================================================

function handleSelect(id: string): void {
  emit('select', id)
}
</script>

<template>
  <div class="function-selector">
    <h4 class="text-sm font-semibold text-primary mb-2">
      <span class="mr-2" aria-hidden="true">ƒ</span>
      Select Function
    </h4>

    <!-- Function Buttons -->
    <div class="flex flex-wrap gap-2 mb-3" role="radiogroup" aria-label="Function selection">
      <button
        v-for="preset in LIMIT_PRESETS"
        :key="preset.id"
        role="radio"
        :aria-checked="selectedId === preset.id"
        :aria-label="`Select ${preset.name} function: ${preset.description}`"
        class="px-3 py-2 text-sm rounded-lg transition-colors border"
        :class="
          selectedId === preset.id
            ? 'bg-primary text-white border-primary'
            : 'bg-surface hover:bg-surface-alt border-border'
        "
        :title="preset.description"
        @click="handleSelect(preset.id)"
      >
        {{ preset.name }}
      </button>
    </div>

    <!-- Selected Function Formula -->
    <div v-if="selectedPreset" class="p-3 bg-surface rounded-lg border border-border">
      <MathBlock :formula="selectedPreset.latex" display />
    </div>
  </div>
</template>
