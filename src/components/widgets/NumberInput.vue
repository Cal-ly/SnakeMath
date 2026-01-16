<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { parseNumberInput } from '@/utils/math/numberClassification'

interface Props {
  /** v-model value */
  modelValue: string
  /** Input label */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Show validation feedback */
  showValidation?: boolean
  /** Input ID (auto-generated if not provided) */
  id?: string
  /** Disable input */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Enter a number',
  placeholder: 'e.g., 42, 3.14, -5, 1/2, 2+3i',
  showValidation: true,
  id: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'validChange': [isValid: boolean]
}>()

const inputId = computed(() => props.id || `number-input-${Math.random().toString(36).slice(2, 9)}`)
const errorId = computed(() => `${inputId.value}-error`)

// Local input state for immediate feedback
const localValue = ref(props.modelValue)

// Sync with parent
watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal
  }
)

// Validation state
const validationResult = computed(() => {
  const trimmed = localValue.value.trim()

  if (!trimmed) {
    return { isValid: true, isEmpty: true, error: null, hint: null }
  }

  const parsed = parseNumberInput(trimmed)

  if (parsed.isValid) {
    return {
      isValid: true,
      isEmpty: false,
      error: null,
      hint: getTypeHint(trimmed, parsed),
    }
  } else {
    return {
      isValid: false,
      isEmpty: false,
      error: parsed.errorMessage || 'Could not parse as a number',
      hint: null,
    }
  }
})

// Generate helpful type hint
function getTypeHint(
  input: string,
  parsed: { parsedReal?: number; parsedImaginary?: number }
): string | null {
  // Complex number
  if (parsed.parsedImaginary !== undefined && parsed.parsedImaginary !== 0) {
    const real = parsed.parsedReal || 0
    const imag = parsed.parsedImaginary
    const sign = imag >= 0 ? '+' : ''
    return `Complex: ${real}${sign}${imag}i`
  }

  const value = parsed.parsedReal

  if (value === undefined) return null

  // Fraction input
  if (input.includes('/')) {
    return `Fraction: ${value}`
  }

  // Special constants
  const lowerInput = input.toLowerCase()
  if (lowerInput === 'pi' || input === 'π') {
    return `π ≈ ${value.toFixed(6)}`
  }
  if (lowerInput === 'e' && value === Math.E) {
    return `e ≈ ${value.toFixed(6)}`
  }

  // Infinity
  if (value === Infinity) {
    return '∞ (positive infinity)'
  }
  if (value === -Infinity) {
    return '-∞ (negative infinity)'
  }

  return null
}

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  localValue.value = value
  emit('update:modelValue', value)
}

// Emit validity changes
watch(
  () => validationResult.value.isValid,
  (isValid) => {
    emit('validChange', isValid)
  }
)
</script>

<template>
  <div class="number-input">
    <!-- Label -->
    <label :for="inputId" class="block text-sm font-medium text-text-primary mb-1.5">
      {{ label }}
    </label>

    <!-- Input -->
    <div class="relative">
      <input
        :id="inputId"
        type="text"
        :value="localValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="!validationResult.isValid && !validationResult.isEmpty"
        :aria-describedby="showValidation ? errorId : undefined"
        data-testid="number-input"
        class="w-full px-4 py-2.5 rounded-lg border bg-surface text-text-primary font-mono text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
        :class="[
          validationResult.isEmpty
            ? 'border-border focus:border-primary'
            : validationResult.isValid
              ? 'border-primary/50 focus:border-primary'
              : 'border-red-500 focus:border-red-500',
          disabled && 'opacity-50 cursor-not-allowed',
        ]"
        @input="handleInput"
      />

      <!-- Status icon -->
      <span
        v-if="!validationResult.isEmpty"
        class="absolute right-3 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <i v-if="validationResult.isValid" class="fa-solid fa-check text-primary" />
        <i v-else class="fa-solid fa-xmark text-red-500" />
      </span>
    </div>

    <!-- Validation feedback -->
    <div
      v-if="showValidation"
      :id="errorId"
      class="mt-1.5 min-h-[1.5rem]"
      :aria-live="validationResult.error ? 'polite' : 'off'"
    >
      <!-- Error message -->
      <p v-if="validationResult.error" class="text-sm text-red-500 flex items-center gap-1">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true" />
        {{ validationResult.error }}
      </p>

      <!-- Type hint -->
      <p v-else-if="validationResult.hint" class="text-sm text-text-muted">
        {{ validationResult.hint }}
      </p>
    </div>
  </div>
</template>
