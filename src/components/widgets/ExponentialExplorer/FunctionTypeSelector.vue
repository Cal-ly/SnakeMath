<script setup lang="ts">
import type { FunctionType } from './types'

interface Props {
  modelValue: FunctionType
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: FunctionType]
}>()

function handleChange(type: FunctionType) {
  emit('update:modelValue', type)
}
</script>

<template>
  <fieldset class="function-type-selector">
    <legend class="text-sm text-text-muted mb-2">Function Type:</legend>

    <div class="flex gap-4">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="function-type"
          value="exponential"
          :checked="modelValue === 'exponential'"
          class="w-4 h-4 text-primary focus:ring-primary"
          data-testid="function-type-exponential"
          @change="handleChange('exponential')"
        />
        <span class="text-text-primary">
          Exponential <span class="text-text-muted text-sm">(b^x)</span>
        </span>
      </label>

      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="function-type"
          value="logarithm"
          :checked="modelValue === 'logarithm'"
          class="w-4 h-4 text-primary focus:ring-primary"
          data-testid="function-type-logarithm"
          @change="handleChange('logarithm')"
        />
        <span class="text-text-primary">
          Logarithm <span class="text-text-muted text-sm">(log_b(x))</span>
        </span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
input[type='radio'] {
  accent-color: var(--color-primary);
}
</style>
