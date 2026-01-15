<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  debounce?: number
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  debounce: 200,
  ariaLabel: 'Search',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal
  }
)

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  localValue.value = value

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    emit('update:modelValue', value)
  }, props.debounce)
}

function clear() {
  localValue.value = ''
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="search-input relative">
    <i
      class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm"
      aria-hidden="true"
    />
    <input
      type="search"
      :value="localValue"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      class="w-full pl-9 pr-9 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
      @input="handleInput"
    />
    <button
      v-if="localValue"
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
      aria-label="Clear search"
      @click="clear"
    >
      <i class="fa-solid fa-xmark text-sm" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
/* Hide native clear button in webkit */
input[type='search']::-webkit-search-cancel-button {
  display: none;
}
</style>
