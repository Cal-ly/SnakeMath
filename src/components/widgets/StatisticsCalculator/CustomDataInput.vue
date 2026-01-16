<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  initialInput?: string
  errorMessage?: string | null
  dataCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialInput: '',
  errorMessage: null,
  dataCount: 0,
})

const emit = defineEmits<{
  apply: [input: string]
}>()

const inputText = ref(props.initialInput)

const placeholderText = '85, 92, 78, 96, 88, 73, 91, 84, 79, 95'

const hasContent = computed(() => inputText.value.trim().length > 0)

function handleApply() {
  emit('apply', inputText.value)
}

function handleKeydown(event: KeyboardEvent) {
  // Apply on Ctrl+Enter or Cmd+Enter
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    handleApply()
  }
}
</script>

<template>
  <div class="custom-data-input p-4 bg-surface-alt rounded-lg border border-border">
    <label for="custom-data" class="block text-sm font-medium text-text-secondary mb-2">
      <i class="fa-solid fa-keyboard mr-2" aria-hidden="true" />
      Enter values separated by commas, spaces, or newlines:
    </label>

    <textarea
      id="custom-data"
      v-model="inputText"
      data-testid="custom-data-input"
      :placeholder="placeholderText"
      class="w-full h-24 px-3 py-2 text-sm font-mono bg-surface border border-border rounded-lg
             text-text-primary placeholder-text-muted
             focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
             resize-none"
      @keydown="handleKeydown"
    />

    <div class="flex items-center justify-between mt-3">
      <button
        data-testid="custom-data-apply"
        :disabled="!hasContent"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors
               focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
               disabled:opacity-50 disabled:cursor-not-allowed
               bg-primary text-white hover:bg-primary-hover"
        @click="handleApply"
      >
        <i class="fa-solid fa-check mr-1" aria-hidden="true" />
        Apply
      </button>

      <div
        v-if="dataCount > 0 || errorMessage"
        data-testid="data-validation-message"
        :class="[
          'text-sm',
          errorMessage ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400',
        ]"
      >
        <template v-if="errorMessage">
          <i class="fa-solid fa-exclamation-circle mr-1" aria-hidden="true" />
          {{ errorMessage }}
        </template>
        <template v-else-if="dataCount > 0">
          <i class="fa-solid fa-check-circle mr-1" aria-hidden="true" />
          {{ dataCount }} valid numbers
        </template>
      </div>
    </div>

    <p class="mt-2 text-xs text-text-muted">
      Tip: Press Ctrl+Enter to apply
    </p>
  </div>
</template>
