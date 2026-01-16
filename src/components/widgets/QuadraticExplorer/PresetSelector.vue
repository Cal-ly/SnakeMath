<script setup lang="ts">
import { getPresetsByCategory } from './presets'
import type { QuadraticPresetId } from './types'

interface Props {
  modelValue: QuadraticPresetId | null
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: QuadraticPresetId]
}>()

const basicPresets = getPresetsByCategory('basic')
const realWorldPresets = getPresetsByCategory('real-world')

function handleChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as QuadraticPresetId
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="preset-selector">
    <label for="preset-select" class="block text-sm font-medium text-text-primary mb-2">
      <i class="fa-solid fa-sliders mr-1.5" aria-hidden="true" />
      Preset
    </label>

    <select
      id="preset-select"
      :value="modelValue || ''"
      class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary
             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      data-testid="preset-selector"
      @change="handleChange"
    >
      <option value="" disabled>Choose a preset...</option>

      <optgroup label="Basic">
        <option
          v-for="preset in basicPresets"
          :key="preset.id"
          :value="preset.id"
          :data-testid="`preset-${preset.id}`"
        >
          {{ preset.name }} - {{ preset.description }}
        </option>
      </optgroup>

      <optgroup label="Real World">
        <option
          v-for="preset in realWorldPresets"
          :key="preset.id"
          :value="preset.id"
          :data-testid="`preset-${preset.id}`"
        >
          {{ preset.name }} - {{ preset.description }}
        </option>
      </optgroup>
    </select>

    <!-- Custom indicator -->
    <p v-if="modelValue === null" class="text-xs text-text-muted mt-1">
      <i class="fa-solid fa-pen mr-1" aria-hidden="true" />
      Custom coefficients
    </p>
  </div>
</template>

<style scoped>
select {
  cursor: pointer;
}

select option {
  padding: 0.5rem;
}
</style>
