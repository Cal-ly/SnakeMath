<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  /** Start index value */
  start: number
  /** End index value */
  end: number
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
  /** Whether to disable inputs */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  disabled: false,
})

const emit = defineEmits<{
  'update:start': [value: number]
  'update:end': [value: number]
}>()

// Local state for immediate feedback
const localStart = ref(props.start.toString())
const localEnd = ref(props.end.toString())

// Sync with props
watch(
  () => props.start,
  (val) => {
    localStart.value = val.toString()
  },
)

watch(
  () => props.end,
  (val) => {
    localEnd.value = val.toString()
  },
)

// Validation
const startError = computed(() => {
  const num = parseInt(localStart.value, 10)
  if (isNaN(num)) return 'Must be a number'
  if (!Number.isInteger(num)) return 'Must be an integer'
  if (num < props.min) return `Min: ${props.min}`
  if (num > props.max) return `Max: ${props.max}`
  return null
})

const endError = computed(() => {
  const num = parseInt(localEnd.value, 10)
  if (isNaN(num)) return 'Must be a number'
  if (!Number.isInteger(num)) return 'Must be an integer'
  if (num < props.min) return `Min: ${props.min}`
  if (num > props.max) return `Max: ${props.max}`
  return null
})

const rangeError = computed(() => {
  if (startError.value || endError.value) return null
  const start = parseInt(localStart.value, 10)
  const end = parseInt(localEnd.value, 10)
  if (start > end) return 'Start must be ≤ end'
  return null
})

const isValid = computed(() => !startError.value && !endError.value && !rangeError.value)

function handleStartChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  localStart.value = value
  const num = parseInt(value, 10)
  if (!isNaN(num) && Number.isInteger(num) && num >= props.min && num <= props.max) {
    emit('update:start', num)
  }
}

function handleEndChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  localEnd.value = value
  const num = parseInt(value, 10)
  if (!isNaN(num) && Number.isInteger(num) && num >= props.min && num <= props.max) {
    emit('update:end', num)
  }
}
</script>

<template>
  <div class="bounds-input">
    <div class="flex items-center gap-3 flex-wrap">
      <!-- Start input -->
      <div class="flex items-center gap-2">
        <label for="bounds-start" class="text-sm text-text-muted whitespace-nowrap">
          From <span class="font-mono text-primary">i =</span>
        </label>
        <input
          id="bounds-start"
          type="number"
          :value="localStart"
          :min="min"
          :max="max"
          :disabled="disabled"
          :aria-invalid="!!startError || !!rangeError"
          data-testid="bounds-start"
          class="w-20 px-3 py-1.5 rounded-lg border bg-surface text-text-primary font-mono text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
          :class="[
            startError || rangeError
              ? 'border-red-500 focus:border-red-500'
              : 'border-border focus:border-primary',
            disabled && 'opacity-50 cursor-not-allowed',
          ]"
          @input="handleStartChange"
        />
      </div>

      <!-- To label -->
      <span class="text-sm text-text-muted">to</span>

      <!-- End input -->
      <div class="flex items-center gap-2">
        <input
          id="bounds-end"
          type="number"
          :value="localEnd"
          :min="min"
          :max="max"
          :disabled="disabled"
          :aria-invalid="!!endError || !!rangeError"
          aria-label="End index"
          data-testid="bounds-end"
          class="w-20 px-3 py-1.5 rounded-lg border bg-surface text-text-primary font-mono text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
          :class="[
            endError || rangeError
              ? 'border-red-500 focus:border-red-500'
              : 'border-border focus:border-primary',
            disabled && 'opacity-50 cursor-not-allowed',
          ]"
          @input="handleEndChange"
        />
      </div>

      <!-- Validity indicator -->
      <span
        v-if="localStart && localEnd"
        class="text-sm"
        :class="isValid ? 'text-primary' : 'text-red-500'"
        aria-hidden="true"
      >
        <i v-if="isValid" class="fa-solid fa-check" />
        <i v-else class="fa-solid fa-xmark" />
      </span>
    </div>

    <!-- Error messages -->
    <div v-if="startError || endError || rangeError" class="mt-2 text-sm text-red-500">
      <p v-if="startError">
        <i class="fa-solid fa-circle-exclamation mr-1" aria-hidden="true" />
        Start: {{ startError }}
      </p>
      <p v-if="endError">
        <i class="fa-solid fa-circle-exclamation mr-1" aria-hidden="true" />
        End: {{ endError }}
      </p>
      <p v-if="rangeError">
        <i class="fa-solid fa-circle-exclamation mr-1" aria-hidden="true" />
        {{ rangeError }}
      </p>
    </div>
  </div>
</template>
