<script setup lang="ts">
interface Props {
  modelValue: boolean
  label: string
  icon?: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <button
    type="button"
    class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors"
    :class="
      modelValue
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-border text-text-muted hover:border-primary hover:text-primary'
    "
    :aria-pressed="modelValue"
    @click="emit('update:modelValue', !modelValue)"
  >
    <i v-if="icon" :class="icon" aria-hidden="true" />
    {{ label }}
    <i
      :class="modelValue ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
      class="ml-1 opacity-60"
      aria-hidden="true"
    />
  </button>
</template>
