# SnakeMath - Increment 4A: NumberInput Component

## Context
Phase 4 focuses on interactive widgets. This increment creates a reusable number input component with validation feedback, used by the NumberTypeExplorer widget.

## Design Decisions
- **Validation feedback**: Inline below input
- **Supported formats**: Integers, decimals, fractions, complex numbers, special values

## Archive Reference
Claude Code should review for patterns (adapt, don't copy):
- `archive/snake-math-vue/src/components/NumberInput.vue` (if exists)
- `archive/snake-math/docs/number-theory.md` for supported number formats

## Task
Create a reusable NumberInput component with real-time validation.

## Requirements

### 1. Create NumberInput Component
Create `src/components/widgets/NumberInput.vue`:

```vue
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
watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

// Validation state
const validationResult = computed(() => {
  const trimmed = localValue.value.trim()
  
  if (!trimmed) {
    return { isValid: true, isEmpty: true, error: null, hint: null }
  }
  
  try {
    const parsed = parseNumberInput(trimmed)
    if (parsed !== null) {
      return { 
        isValid: true, 
        isEmpty: false, 
        error: null, 
        hint: getTypeHint(trimmed, parsed)
      }
    } else {
      return { 
        isValid: false, 
        isEmpty: false, 
        error: 'Could not parse as a number',
        hint: null
      }
    }
  } catch (e) {
    return { 
      isValid: false, 
      isEmpty: false, 
      error: e instanceof Error ? e.message : 'Invalid input',
      hint: null
    }
  }
})

// Generate helpful type hint
function getTypeHint(input: string, parsed: number | { real: number; imag: number }): string | null {
  if (typeof parsed === 'object') {
    return `Complex: ${parsed.real} + ${parsed.imag}i`
  }
  if (input.includes('/')) {
    return `Fraction: ${parsed}`
  }
  if (input.toLowerCase() === 'pi' || input === 'π') {
    return `π ≈ ${parsed.toFixed(6)}`
  }
  if (input.toLowerCase() === 'e') {
    return `e ≈ ${parsed.toFixed(6)}`
  }
  return null
}

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  localValue.value = value
  emit('update:modelValue', value)
}

// Emit validity changes
watch(() => validationResult.value.isValid, (isValid) => {
  emit('validChange', isValid)
})
</script>

<template>
  <div class="number-input">
    <!-- Label -->
    <label 
      :for="inputId"
      class="block text-sm font-medium text-text-primary mb-1.5"
    >
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
        class="w-full px-4 py-2.5 rounded-lg border bg-surface text-text-primary font-mono text-lg transition-colors"
        :class="[
          validationResult.isEmpty 
            ? 'border-border focus:border-primary' 
            : validationResult.isValid 
              ? 'border-primary/50 focus:border-primary' 
              : 'border-red-500 focus:border-red-500',
          disabled && 'opacity-50 cursor-not-allowed'
        ]"
        @input="handleInput"
      />
      
      <!-- Status icon -->
      <span 
        v-if="!validationResult.isEmpty"
        class="absolute right-3 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <i 
          v-if="validationResult.isValid"
          class="fa-solid fa-check text-primary"
        />
        <i 
          v-else
          class="fa-solid fa-xmark text-red-500"
        />
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
      <p 
        v-if="validationResult.error" 
        class="text-sm text-red-500 flex items-center gap-1"
      >
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true" />
        {{ validationResult.error }}
      </p>
      
      <!-- Type hint -->
      <p 
        v-else-if="validationResult.hint" 
        class="text-sm text-text-muted"
      >
        {{ validationResult.hint }}
      </p>
    </div>
  </div>
</template>
```

### 2. Create Widgets Barrel Export
Create `src/components/widgets/index.ts`:

```typescript
export { default as NumberInput } from './NumberInput.vue'
```

### 3. Add Example Numbers Data
Create `src/data/exampleNumbers.ts`:

```typescript
export interface ExampleNumber {
  label: string
  value: string
  description: string
  category: 'natural' | 'integer' | 'rational' | 'irrational' | 'complex' | 'special'
}

export const exampleNumbers: ExampleNumber[] = [
  // Natural numbers
  { label: '42', value: '42', description: 'A natural number', category: 'natural' },
  { label: '1', value: '1', description: 'The first natural number', category: 'natural' },
  { label: '0', value: '0', description: 'Zero (natural in some definitions)', category: 'natural' },
  
  // Integers
  { label: '-5', value: '-5', description: 'A negative integer', category: 'integer' },
  { label: '-1', value: '-1', description: 'Negative one', category: 'integer' },
  
  // Rational numbers
  { label: '1/2', value: '1/2', description: 'One half', category: 'rational' },
  { label: '3/4', value: '3/4', description: 'Three quarters', category: 'rational' },
  { label: '0.25', value: '0.25', description: 'Quarter (decimal)', category: 'rational' },
  { label: '-2/3', value: '-2/3', description: 'Negative fraction', category: 'rational' },
  
  // Irrational numbers
  { label: 'π', value: 'pi', description: '3.14159... (pi)', category: 'irrational' },
  { label: 'e', value: 'e', description: '2.71828... (Euler\'s number)', category: 'irrational' },
  { label: '√2', value: 'sqrt(2)', description: '1.41421... (square root of 2)', category: 'irrational' },
  
  // Complex numbers
  { label: 'i', value: 'i', description: 'The imaginary unit', category: 'complex' },
  { label: '3+4i', value: '3+4i', description: 'A complex number', category: 'complex' },
  { label: '-2i', value: '-2i', description: 'Pure imaginary', category: 'complex' },
  
  // Special values
  { label: '∞', value: 'infinity', description: 'Positive infinity', category: 'special' },
  { label: '-∞', value: '-infinity', description: 'Negative infinity', category: 'special' },
]

export const examplesByCategory = {
  natural: exampleNumbers.filter(e => e.category === 'natural'),
  integer: exampleNumbers.filter(e => e.category === 'integer'),
  rational: exampleNumbers.filter(e => e.category === 'rational'),
  irrational: exampleNumbers.filter(e => e.category === 'irrational'),
  complex: exampleNumbers.filter(e => e.category === 'complex'),
  special: exampleNumbers.filter(e => e.category === 'special'),
}
```

### 4. Test NumberInput in a Simple View
Create a temporary test in `src/views/basics/NumberTypesView.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import NumberInput from '@/components/widgets/NumberInput.vue'
import { exampleNumbers } from '@/data/exampleNumbers'

const relatedTopics = [
  { title: 'Foundations', path: '/basics/foundations', description: 'Core concepts' },
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Notation guide' },
]

const inputValue = ref('')

const numberSets = [
  { symbol: '\\mathbb{N}', name: 'Natural Numbers', description: 'Counting numbers: 1, 2, 3, ...', python: 'n > 0 and n == int(n)', examples: '1, 2, 3, 100' },
  { symbol: '\\mathbb{Z}', name: 'Integers', description: 'Whole numbers including negatives', python: 'n == int(n)', examples: '-5, -1, 0, 1, 42' },
  { symbol: '\\mathbb{Q}', name: 'Rational Numbers', description: 'Numbers expressible as fractions', python: 'from fractions import Fraction', examples: '1/2, -3/4, 0.25' },
  { symbol: '\\mathbb{R}', name: 'Real Numbers', description: 'All numbers on the number line', python: 'float or int', examples: 'π, √2, -3.14' },
  { symbol: '\\mathbb{C}', name: 'Complex Numbers', description: 'Numbers with real and imaginary parts', python: 'complex(a, b)', examples: '3+4i, 2i' },
]

function selectExample(value: string) {
  inputValue.value = value
}
</script>

<template>
  <TopicPage
    title="Number Types"
    description="Understanding ℕ, ℤ, ℚ, ℝ, and ℂ — and how they map to code."
  >
    <div class="space-y-8">
      <ContentSection id="overview" title="The Number Hierarchy" icon="fa-solid fa-layer-group">
        <p class="mb-4">
          Mathematicians organize numbers into nested sets. Each set builds on the 
          previous one, adding new capabilities:
        </p>
        
        <MathBlock 
          formula="\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}" 
          display 
        />
      </ContentSection>

      <ContentSection id="sets" title="Number Sets" icon="fa-solid fa-shapes">
        <div class="space-y-4">
          <div v-for="set in numberSets" :key="set.name" class="card p-4">
            <div class="flex items-start gap-4">
              <div class="text-2xl w-12 text-center">
                <MathBlock :formula="set.symbol" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-text-primary">{{ set.name }}</h3>
                <p class="text-sm text-text-muted mt-1">{{ set.description }}</p>
                <p class="text-xs text-text-muted mt-2">
                  <span class="font-medium">Examples:</span> {{ set.examples }}
                </p>
                <code class="text-xs font-mono text-primary mt-1 block">{{ set.python }}</code>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection id="explorer" title="Try It: Number Input" icon="fa-solid fa-keyboard">
        <div class="card p-6">
          <NumberInput
            v-model="inputValue"
            label="Enter any number"
            placeholder="Try: 42, 3.14, 1/2, 2+3i, pi"
          />
          
          <div class="mt-4">
            <p class="text-sm text-text-muted mb-2">Quick examples:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="example in exampleNumbers.slice(0, 8)"
                :key="example.value"
                class="px-3 py-1 text-sm rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                :title="example.description"
                @click="selectExample(example.value)"
              >
                {{ example.label }}
              </button>
            </div>
          </div>
          
          <p class="mt-4 text-sm text-text-muted">
            <i class="fa-solid fa-info-circle mr-1" aria-hidden="true" />
            Full NumberTypeExplorer widget coming in next increment!
          </p>
        </div>
      </ContentSection>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
```

## Success Criteria
- [ ] NumberInput renders with label and placeholder
- [ ] Valid numbers show green checkmark
- [ ] Invalid input shows red X and error message
- [ ] Type hints appear for special inputs (fractions, pi, complex)
- [ ] Example buttons populate the input
- [ ] Accessibility: label is associated, aria-invalid set, error described
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Verification
1. Navigate to `/basics/number-types`
2. Type `42` - should show green check
3. Type `abc` - should show red X and error
4. Type `1/2` - should show "Fraction: 0.5"
5. Type `pi` - should show "π ≈ 3.141593"
6. Click example buttons - should populate input

## Next Increment
After completion, proceed to `inc_4b.md` for the full NumberTypeExplorer widget.
