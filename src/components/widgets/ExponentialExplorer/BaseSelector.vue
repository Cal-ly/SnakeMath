<script setup lang="ts">
import { ref, watch } from 'vue'
import { basePresets } from './presets'
import type { BasePresetId } from './types'

interface Props {
  modelValue: number
  currentPreset: BasePresetId | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  selectPreset: [presetId: BasePresetId]
}>()

// Local state for custom input
const customInput = ref('')
const showCustomInput = ref(false)
const customError = ref('')

// Initialize custom input from current value if not a preset
watch(
  () => props.modelValue,
  (newVal) => {
    if (!props.currentPreset) {
      customInput.value = newVal.toString()
    }
  },
  { immediate: true }
)

function handlePresetClick(presetId: BasePresetId) {
  showCustomInput.value = false
  customError.value = ''
  emit('selectPreset', presetId)
}

function handleCustomClick() {
  showCustomInput.value = true
  customInput.value = props.modelValue.toString()
}

function handleCustomInput() {
  const value = parseFloat(customInput.value)
  customError.value = ''

  if (isNaN(value)) {
    customError.value = 'Enter a valid number'
    return
  }

  if (value <= 0) {
    customError.value = 'Base must be positive'
    return
  }

  if (value === 1) {
    customError.value = 'Base cannot be 1'
    return
  }

  if (value < 0.1 || value > 100) {
    customError.value = 'Base must be between 0.1 and 100'
    return
  }

  emit('update:modelValue', value)
}

function formatBaseDisplay(value: number): string {
  if (Math.abs(value - Math.E) < 0.001) return 'e'
  if (value === Math.floor(value)) return value.toString()
  return value.toFixed(2)
}
</script>

<template>
  <div class="base-selector">
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm text-text-muted">Base:</span>

      <!-- Preset buttons -->
      <button
        v-for="preset in basePresets"
        :key="preset.id"
        :class="[
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-w-[44px] min-h-[44px]',
          currentPreset === preset.id
            ? 'bg-primary text-white'
            : 'bg-surface-raised hover:bg-surface-hover text-text-primary border border-border',
        ]"
        :title="preset.description"
        :data-testid="`base-preset-${preset.id}`"
        @click="handlePresetClick(preset.id as BasePresetId)"
      >
        {{ preset.name }}
      </button>

      <!-- Custom button -->
      <button
        :class="[
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-w-[44px] min-h-[44px]',
          showCustomInput || (!currentPreset && !showCustomInput)
            ? 'bg-primary text-white'
            : 'bg-surface-raised hover:bg-surface-hover text-text-primary border border-border',
        ]"
        data-testid="base-custom-button"
        @click="handleCustomClick"
      >
        Custom
      </button>
    </div>

    <!-- Custom input field -->
    <div v-if="showCustomInput || !currentPreset" class="mt-3">
      <div class="flex items-center gap-2">
        <input
          v-model="customInput"
          type="number"
          min="0.1"
          max="100"
          step="0.1"
          class="w-24 px-3 py-2 bg-surface border border-border rounded-lg text-text-primary
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="e.g., 3"
          data-testid="base-custom-input"
          @input="handleCustomInput"
          @keyup.enter="handleCustomInput"
        />
        <span class="text-sm text-text-muted">Range: 0.1 to 100</span>
      </div>
      <p v-if="customError" class="mt-1 text-sm text-red-500">
        {{ customError }}
      </p>
    </div>

    <!-- Current base display -->
    <p class="mt-2 text-xs text-text-muted">
      Current base: <strong>{{ formatBaseDisplay(modelValue) }}</strong>
      <span v-if="currentPreset"> ({{ basePresets.find((p) => p.id === currentPreset)?.description }})</span>
    </p>
  </div>
</template>
