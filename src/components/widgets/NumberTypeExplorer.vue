<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import NumberInput from './NumberInput.vue'
import SetMembershipDisplay from './SetMembershipDisplay.vue'
import NumberProperties from './NumberProperties.vue'
import NumberLine from './NumberLine.vue'
import SetVennDiagram from './SetVennDiagram.vue'
import VisualizationToggle from './VisualizationToggle.vue'
import {
  parseNumberInput,
  classifyNumber,
  getNumberProperties,
} from '@/utils/math/numberClassification'
import { useUrlState } from '@/composables'

interface Props {
  /** Initial value to display */
  initialValue?: string
  /** Show example number buttons */
  showExamples?: boolean
  /** Sync value to URL query param */
  syncUrl?: boolean
  /** URL query param key */
  urlKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialValue: '',
  showExamples: true,
  syncUrl: false,
  urlKey: 'n',
})

// URL state (only used if syncUrl is true)
const urlState = props.syncUrl ? useUrlState(props.urlKey, props.initialValue) : null

// Local state
const localValue = ref(props.initialValue)
const isValid = ref(true)

// Visualization toggles
const showNumberLine = ref(true)
const showVennDiagram = ref(true)

// Use URL state if enabled, otherwise local state
const inputValue = computed({
  get: () => (urlState ? urlState.value.value : localValue.value),
  set: (val: string) => {
    if (urlState) {
      urlState.setValue(val)
    } else {
      localValue.value = val
    }
  },
})

// Initialize from URL if syncing
onMounted(() => {
  if (urlState && urlState.value.value) {
    // URL has a value, use it
  } else if (props.initialValue) {
    inputValue.value = props.initialValue
  }
})

// Parse and classify the input
const parsedNumber = computed(() => {
  const trimmed = inputValue.value.trim()
  if (!trimmed) return null
  const parsed = parseNumberInput(trimmed)
  if (!parsed.isValid) return null
  return parsed
})

const classification = computed(() => {
  if (!inputValue.value.trim()) return null
  return classifyNumber(inputValue.value.trim())
})

const properties = computed(() => {
  if (!parsedNumber.value) return null
  return getNumberProperties(parsedNumber.value, inputValue.value)
})

// Get real part for number line (complex numbers use real part)
const realPartForLine = computed(() => {
  if (!parsedNumber.value) return null
  if (parsedNumber.value.parsedImaginary !== undefined && parsedNumber.value.parsedImaginary !== 0) {
    // Complex number - use real part
    return parsedNumber.value.parsedReal ?? 0
  }
  return parsedNumber.value.parsedReal ?? null
})

// Build set membership data for display
const numberSets = computed(() => {
  const c = classification.value
  return [
    {
      symbol: 'ℕ',
      latex: '\\mathbb{N}',
      name: 'Natural Numbers',
      description: 'Positive integers',
      isMember: c?.isNatural ?? false,
    },
    {
      symbol: 'ℤ',
      latex: '\\mathbb{Z}',
      name: 'Integers',
      description: 'Whole numbers',
      isMember: c?.isInteger ?? false,
    },
    {
      symbol: 'ℚ',
      latex: '\\mathbb{Q}',
      name: 'Rational Numbers',
      description: 'Fractions',
      isMember: c?.isRational ?? false,
    },
    {
      symbol: 'ℝ',
      latex: '\\mathbb{R}',
      name: 'Real Numbers',
      description: 'Number line',
      isMember: c?.isReal ?? false,
    },
    {
      symbol: 'ℂ',
      latex: '\\mathbb{C}',
      name: 'Complex Numbers',
      description: 'a + bi',
      isMember: c?.isComplex ?? false,
    },
  ]
})

// Is this a complex number?
const isComplexNumber = computed(() => {
  if (!parsedNumber.value) return false
  return (
    parsedNumber.value.parsedImaginary !== undefined && parsedNumber.value.parsedImaginary !== 0
  )
})

function selectExample(value: string) {
  inputValue.value = value
}

function handleValidChange(valid: boolean) {
  isValid.value = valid
}

// Quick example categories
const quickExamples = computed(() => [
  { label: '42', value: '42' },
  { label: '-7', value: '-7' },
  { label: '0.5', value: '0.5' },
  { label: '3.14159', value: '3.14159' },
  { label: '1.41421', value: '1.41421' },
  { label: '3+4i', value: '3+4i' },
])
</script>

<template>
  <div class="number-type-explorer">
    <!-- Main content grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Input Section -->
      <div class="input-section">
        <div class="card p-6">
          <NumberInput
            v-model="inputValue"
            label="Enter a number to classify"
            placeholder="e.g., 42, 3.14, -5, 2+3i, infinity"
            @valid-change="handleValidChange"
          />

          <!-- Quick examples -->
          <div v-if="showExamples" class="mt-4">
            <p class="text-sm text-text-muted mb-2">
              <i class="fa-solid fa-lightbulb mr-1" aria-hidden="true" />
              Try these examples:
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="example in quickExamples"
                :key="example.value"
                type="button"
                class="px-3 py-1.5 text-sm rounded-full border transition-colors"
                :class="
                  inputValue === example.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-border hover:border-primary hover:text-primary'
                "
                @click="selectExample(example.value)"
              >
                {{ example.label }}
              </button>
            </div>
          </div>

          <!-- Share link hint (when URL sync enabled) -->
          <p v-if="syncUrl && inputValue" class="mt-4 text-xs text-text-muted">
            <i class="fa-solid fa-link mr-1" aria-hidden="true" />
            Share this URL to show this number to others
          </p>
        </div>

        <!-- Properties (shown below input on mobile) -->
        <div v-if="properties" class="card p-6 mt-4 lg:hidden">
          <NumberProperties :properties="properties" :input-value="inputValue" />
        </div>
      </div>

      <!-- Results Section -->
      <div class="results-section space-y-4">
        <!-- Set Membership -->
        <div class="card p-6">
          <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
            <i class="fa-solid fa-layer-group mr-2" aria-hidden="true" />
            Set Membership
          </h3>

          <div v-if="!inputValue.trim()" class="text-center py-8 text-text-muted">
            <i class="fa-solid fa-arrow-left text-2xl mb-2 opacity-50" aria-hidden="true" />
            <p>Enter a number to see which sets it belongs to</p>
          </div>

          <div v-else-if="!isValid" class="text-center py-8 text-red-500">
            <i class="fa-solid fa-circle-exclamation text-2xl mb-2" aria-hidden="true" />
            <p>Please enter a valid number</p>
          </div>

          <SetMembershipDisplay v-else :sets="numberSets" />
        </div>

        <!-- Properties (desktop only) -->
        <div v-if="properties" class="card p-6 hidden lg:block">
          <NumberProperties :properties="properties" :input-value="inputValue" />
        </div>
      </div>
    </div>

    <!-- Visualizations Section -->
    <div v-if="parsedNumber !== null && isValid" class="mt-6">
      <!-- Toggle buttons -->
      <div class="flex flex-wrap gap-2 mb-4">
        <VisualizationToggle
          v-model="showNumberLine"
          label="Number Line"
          icon="fa-solid fa-ruler-horizontal"
          test-id="toggle-number-line"
        />
        <VisualizationToggle
          v-model="showVennDiagram"
          label="Set Diagram"
          icon="fa-solid fa-circle-nodes"
          test-id="toggle-venn-diagram"
        />
      </div>

      <!-- Visualization panels -->
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Number Line -->
        <div v-if="showNumberLine" class="card p-4">
          <h4 class="text-sm font-semibold text-text-muted mb-3">
            <i class="fa-solid fa-ruler-horizontal mr-2" aria-hidden="true" />
            Position on Number Line
          </h4>
          <NumberLine :value="realPartForLine" :auto-zoom="true" />
          <p v-if="isComplexNumber" class="text-xs text-text-muted mt-2 text-center">
            Showing real part only (complex numbers exist in 2D)
          </p>
        </div>

        <!-- Venn Diagram -->
        <div v-if="showVennDiagram" class="card p-4">
          <h4 class="text-sm font-semibold text-text-muted mb-3">
            <i class="fa-solid fa-circle-nodes mr-2" aria-hidden="true" />
            Set Membership
          </h4>
          <SetVennDiagram :membership="classification" :show-labels="true" />
        </div>
      </div>
    </div>
  </div>
</template>
