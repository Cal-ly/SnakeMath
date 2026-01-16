# SnakeMath - Increment 4B: NumberTypeExplorer Widget

## Context
The main interactive widget for Phase 4. Uses the classification utility from Phase 1 to show which number sets a value belongs to.

## Design Decisions
- **Layout**: Responsive - vertical stack on mobile, two-column on desktop
- **Set display**: Checklist with visual indicators
- **Visualizations**: Toggleable (added in 4D)

## Archive Reference
Claude Code should review and adapt (don't copy directly):
- `archive/snake-math-vue/src/components/NumberTypeExplorer.vue` - Component structure
- `archive/snake-math/docs/number-theory.md` - Content and explanations

The new implementation should:
- Use the existing `numberClassification.ts` utility
- Follow the new component patterns (script setup, Tailwind)
- Integrate with the design system (colors, cards, etc.)

## Task
Create the NumberTypeExplorer widget with set membership display.

## Requirements

### 1. Create SetMembershipDisplay Component
Create `src/components/widgets/SetMembershipDisplay.vue`:

```vue
<script setup lang="ts">
import MathBlock from '@/components/content/MathBlock.vue'

interface NumberSet {
  symbol: string
  latex: string
  name: string
  description: string
  isMember: boolean
}

interface Props {
  sets: NumberSet[]
}

defineProps<Props>()
</script>

<template>
  <div class="set-membership space-y-2">
    <div
      v-for="set in sets"
      :key="set.symbol"
      class="flex items-center gap-3 p-3 rounded-lg transition-colors"
      :class="set.isMember ? 'bg-primary/10' : 'bg-surface-alt'"
    >
      <!-- Membership indicator -->
      <span 
        class="w-6 h-6 rounded-full flex items-center justify-center text-sm"
        :class="set.isMember ? 'bg-primary text-white' : 'bg-border text-text-muted'"
      >
        <i 
          :class="set.isMember ? 'fa-solid fa-check' : 'fa-solid fa-minus'" 
          aria-hidden="true"
        />
      </span>
      
      <!-- Set symbol -->
      <span class="text-xl w-8 text-center">
        <MathBlock :formula="set.latex" />
      </span>
      
      <!-- Set info -->
      <div class="flex-1 min-w-0">
        <span 
          class="font-medium"
          :class="set.isMember ? 'text-text-primary' : 'text-text-muted'"
        >
          {{ set.name }}
        </span>
        <span class="text-xs text-text-muted ml-2 hidden sm:inline">
          {{ set.description }}
        </span>
      </div>
      
      <!-- Membership text for screen readers -->
      <span class="sr-only">
        {{ set.isMember ? 'Member' : 'Not a member' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
```

### 2. Create NumberProperties Component
Create `src/components/widgets/NumberProperties.vue`:

```vue
<script setup lang="ts">
import type { NumberProperties as NumberPropsType } from '@/types'

interface Props {
  properties: NumberPropsType | null
  inputValue: string
}

const props = defineProps<Props>()

// Format property value for display
function formatValue(value: unknown): string {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return value.toString()
    return value.toFixed(6).replace(/\.?0+$/, '')
  }
  return String(value)
}
</script>

<template>
  <div v-if="properties" class="number-properties">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      Properties
    </h3>
    
    <div class="grid grid-cols-2 gap-2 text-sm">
      <!-- Type -->
      <div class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">Type:</span>
        <span class="ml-1 font-medium text-text-primary capitalize">
          {{ properties.type }}
        </span>
      </div>
      
      <!-- Sign -->
      <div v-if="properties.sign !== undefined" class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">Sign:</span>
        <span class="ml-1 font-medium text-text-primary">
          {{ properties.sign > 0 ? 'Positive' : properties.sign < 0 ? 'Negative' : 'Zero' }}
        </span>
      </div>
      
      <!-- Integer check -->
      <div v-if="properties.isInteger !== undefined" class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">Integer:</span>
        <span 
          class="ml-1 font-medium"
          :class="properties.isInteger ? 'text-primary' : 'text-text-muted'"
        >
          {{ formatValue(properties.isInteger) }}
        </span>
      </div>
      
      <!-- Even/Odd (for integers) -->
      <div v-if="properties.isEven !== undefined" class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">Parity:</span>
        <span class="ml-1 font-medium text-text-primary">
          {{ properties.isEven ? 'Even' : 'Odd' }}
        </span>
      </div>
      
      <!-- Prime (for positive integers) -->
      <div v-if="properties.isPrime !== undefined" class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">Prime:</span>
        <span 
          class="ml-1 font-medium"
          :class="properties.isPrime ? 'text-primary' : 'text-text-muted'"
        >
          {{ formatValue(properties.isPrime) }}
        </span>
      </div>
      
      <!-- Absolute value -->
      <div v-if="properties.absoluteValue !== undefined" class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">|x|:</span>
        <span class="ml-1 font-medium font-mono text-text-primary">
          {{ formatValue(properties.absoluteValue) }}
        </span>
      </div>
      
      <!-- Complex parts -->
      <template v-if="properties.type === 'complex'">
        <div class="p-2 rounded bg-surface-alt">
          <span class="text-text-muted">Real:</span>
          <span class="ml-1 font-medium font-mono text-text-primary">
            {{ formatValue(properties.realPart) }}
          </span>
        </div>
        <div class="p-2 rounded bg-surface-alt">
          <span class="text-text-muted">Imaginary:</span>
          <span class="ml-1 font-medium font-mono text-text-primary">
            {{ formatValue(properties.imaginaryPart) }}
          </span>
        </div>
      </template>
      
      <!-- Special value indicator -->
      <div v-if="properties.isSpecial" class="p-2 rounded bg-math-highlight col-span-2">
        <span class="text-text-muted">Special:</span>
        <span class="ml-1 font-medium text-text-primary">
          {{ properties.specialName || inputValue }}
        </span>
      </div>
    </div>
  </div>
</template>
```

### 3. Update Types for NumberProperties
Update `src/types/index.ts` to include NumberProperties if not present:

```typescript
// Add to existing types
export interface NumberProperties {
  type: 'natural' | 'integer' | 'rational' | 'irrational' | 'real' | 'complex' | 'special'
  value: number | { real: number; imag: number }
  sign?: number
  isInteger?: boolean
  isEven?: boolean
  isPrime?: boolean
  absoluteValue?: number
  realPart?: number
  imaginaryPart?: number
  isSpecial?: boolean
  specialName?: string
}
```

### 4. Create NumberTypeExplorer Widget
Create `src/components/widgets/NumberTypeExplorer.vue`:

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import NumberInput from './NumberInput.vue'
import SetMembershipDisplay from './SetMembershipDisplay.vue'
import NumberProperties from './NumberProperties.vue'
import { parseNumberInput, classifyNumber, getNumberProperties } from '@/utils/math/numberClassification'
import { exampleNumbers } from '@/data/exampleNumbers'

interface Props {
  /** Initial value to display */
  initialValue?: string
  /** Show example number buttons */
  showExamples?: boolean
  /** Sync value to URL (implemented in 4C) */
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialValue: '',
  showExamples: true,
  syncUrl: false,
})

const inputValue = ref(props.initialValue)
const isValid = ref(true)

// Parse and classify the input
const parsedNumber = computed(() => {
  if (!inputValue.value.trim()) return null
  try {
    return parseNumberInput(inputValue.value.trim())
  } catch {
    return null
  }
})

const classification = computed(() => {
  if (parsedNumber.value === null) return null
  return classifyNumber(parsedNumber.value)
})

const properties = computed(() => {
  if (parsedNumber.value === null) return null
  return getNumberProperties(parsedNumber.value, inputValue.value)
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
  { label: '1/2', value: '1/2' },
  { label: 'π', value: 'pi' },
  { label: '√2', value: 'sqrt(2)' },
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
            placeholder="e.g., 42, 3.14, 1/2, 2+3i, pi"
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
                :class="inputValue === example.value 
                  ? 'border-primary bg-primary text-white' 
                  : 'border-border hover:border-primary hover:text-primary'"
                @click="selectExample(example.value)"
              >
                {{ example.label }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Properties (shown below input on mobile, beside on desktop) -->
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
        
        <!-- Properties (desktop only - shown beside results) -->
        <div v-if="properties" class="card p-6 hidden lg:block">
          <NumberProperties :properties="properties" :input-value="inputValue" />
        </div>
      </div>
    </div>
    
    <!-- Visualization slots (populated in 4D) -->
    <div v-if="$slots.visualizations" class="mt-6">
      <slot name="visualizations" :value="parsedNumber" :classification="classification" />
    </div>
  </div>
</template>
```

### 5. Update Widgets Barrel Export
Update `src/components/widgets/index.ts`:

```typescript
export { default as NumberInput } from './NumberInput.vue'
export { default as SetMembershipDisplay } from './SetMembershipDisplay.vue'
export { default as NumberProperties } from './NumberProperties.vue'
export { default as NumberTypeExplorer } from './NumberTypeExplorer.vue'
```

### 6. Verify numberClassification Utility Has Required Functions
Check that `src/utils/math/numberClassification.ts` exports:
- `parseNumberInput(input: string): number | { real: number; imag: number } | null`
- `classifyNumber(value): { isNatural, isInteger, isRational, isReal, isComplex }`
- `getNumberProperties(value, input): NumberProperties`

If `getNumberProperties` doesn't exist, create it:

```typescript
export function getNumberProperties(
  value: number | { real: number; imag: number },
  input: string
): NumberProperties {
  // Complex number
  if (typeof value === 'object') {
    return {
      type: 'complex',
      value,
      realPart: value.real,
      imaginaryPart: value.imag,
      isSpecial: false,
    }
  }
  
  // Special values
  if (!Number.isFinite(value)) {
    return {
      type: 'special',
      value,
      isSpecial: true,
      specialName: value === Infinity ? '∞' : '-∞',
    }
  }
  
  const isInt = Number.isInteger(value)
  const sign = Math.sign(value)
  
  // Check for known constants
  const isSpecial = ['pi', 'π', 'e'].includes(input.toLowerCase())
  
  return {
    type: isInt ? (value >= 1 ? 'natural' : 'integer') : 'real',
    value,
    sign,
    isInteger: isInt,
    isEven: isInt ? value % 2 === 0 : undefined,
    isPrime: isInt && value > 1 ? isPrime(value) : undefined,
    absoluteValue: Math.abs(value),
    isSpecial,
    specialName: isSpecial ? input : undefined,
  }
}

function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}
```

### 7. Update NumberTypesView to Use Explorer
Update `src/views/basics/NumberTypesView.vue`:

```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import NumberTypeExplorer from '@/components/widgets/NumberTypeExplorer.vue'

const relatedTopics = [
  { title: 'Foundations', path: '/basics/foundations', description: 'Core concepts' },
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Notation guide' },
]

const numberSets = [
  { symbol: '\\mathbb{N}', name: 'Natural Numbers', description: 'Counting numbers: 1, 2, 3, ...', examples: '1, 2, 3, 100' },
  { symbol: '\\mathbb{Z}', name: 'Integers', description: 'Whole numbers including negatives', examples: '-5, -1, 0, 1, 42' },
  { symbol: '\\mathbb{Q}', name: 'Rational Numbers', description: 'Numbers expressible as fractions', examples: '1/2, -3/4, 0.25' },
  { symbol: '\\mathbb{R}', name: 'Real Numbers', description: 'All numbers on the number line', examples: 'π, √2, -3.14' },
  { symbol: '\\mathbb{C}', name: 'Complex Numbers', description: 'Numbers with real and imaginary parts', examples: '3+4i, 2i' },
]
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
          previous one:
        </p>
        
        <MathBlock 
          formula="\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}" 
          display 
        />
        
        <p class="mt-4">
          Natural numbers are inside integers, which are inside rationals, and so on. 
          This hierarchy maps to programming types!
        </p>
      </ContentSection>

      <ContentSection id="explorer" title="Interactive Explorer" icon="fa-solid fa-flask">
        <p class="mb-4">
          Enter any number below to see which sets it belongs to and its mathematical properties.
        </p>
        
        <NumberTypeExplorer initial-value="42" />
      </ContentSection>

      <ContentSection id="sets" title="Number Set Reference" icon="fa-solid fa-book" collapsible>
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
              </div>
            </div>
          </div>
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
- [ ] NumberTypeExplorer displays input and results side-by-side on desktop
- [ ] Results stack vertically on mobile
- [ ] Set membership shows correct sets for each number type
- [ ] Properties panel shows relevant properties (sign, parity, primality)
- [ ] Example buttons work and highlight when active
- [ ] Empty state shown when no input
- [ ] Error state shown for invalid input
- [ ] Complex numbers show real/imaginary parts
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Verification
1. Navigate to `/basics/number-types`
2. Enter `42` - should show ℕ, ℤ, ℚ, ℝ, ℂ membership
3. Enter `-7` - should show ℤ, ℚ, ℝ, ℂ (not ℕ)
4. Enter `1/2` - should show ℚ, ℝ, ℂ (not ℕ, ℤ)
5. Enter `pi` - should show ℝ, ℂ (irrational)
6. Enter `3+4i` - should show only ℂ
7. Resize browser - layout should adapt

## Next Increment
After completion, proceed to `inc_4c.md` for URL state synchronization.
