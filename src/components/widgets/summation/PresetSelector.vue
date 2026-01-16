<script setup lang="ts">
import { computed } from 'vue'
import type { SummationPresetId } from '@/types/math'

interface Props {
  /** Currently selected preset */
  modelValue: SummationPresetId
  /** Whether to disable selection */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: SummationPresetId]
}>()

interface PresetOption {
  id: SummationPresetId
  label: string
  expression: string
}

const presets: PresetOption[] = [
  { id: 'arithmetic', label: 'Sum of integers (1+2+3+...)', expression: 'i' },
  { id: 'squares', label: 'Sum of squares (1²+2²+3²+...)', expression: 'i²' },
  { id: 'cubes', label: 'Sum of cubes (1³+2³+3³+...)', expression: 'i³' },
  { id: 'geometric', label: 'Powers of 2 (1+2+4+8+...)', expression: '2^(i-1)' },
  { id: 'constant', label: 'Constant (1+1+1+...)', expression: '1' },
]

function handleChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as SummationPresetId
  emit('update:modelValue', value)
}

const selectedPreset = computed(() => presets.find((p) => p.id === props.modelValue))
</script>

<template>
  <div class="preset-selector">
    <label for="preset-select" class="block text-sm font-medium text-text-primary mb-1.5">
      <i class="fa-solid fa-function mr-1.5" aria-hidden="true" />
      Expression
    </label>

    <div class="relative">
      <select
        id="preset-select"
        :value="modelValue"
        :disabled="disabled"
        data-testid="preset-selector"
        class="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-surface text-text-primary appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        :class="[disabled && 'opacity-50 cursor-not-allowed']"
        @change="handleChange"
      >
        <option v-for="preset in presets" :key="preset.id" :value="preset.id">
          {{ preset.label }}
        </option>
      </select>

      <!-- Dropdown arrow -->
      <span
        class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
        aria-hidden="true"
      >
        <i class="fa-solid fa-chevron-down text-sm" />
      </span>
    </div>

    <!-- Expression display -->
    <p v-if="selectedPreset" class="mt-2 text-sm text-text-muted">
      Each term:
      <span class="font-mono text-primary">{{ selectedPreset.expression }}</span>
    </p>
  </div>
</template>
