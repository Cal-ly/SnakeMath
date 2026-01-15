# SnakeMath - Increment 4C: URL State Synchronization

## Context
Adding URL query parameter synchronization so widget states can be shared via links.

## Design Decisions
- **Format**: Query params (`?n=42`)
- **Behavior**: Bi-directional sync (URL ↔ widget)
- **Encoding**: URI-encode special characters

## Task
Create useUrlState composable and integrate with NumberTypeExplorer.

## Requirements

### 1. Create useUrlState Composable
Create `src/composables/useUrlState.ts`:

```typescript
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface UseUrlStateOptions {
  /** Debounce delay for URL updates (ms) */
  debounce?: number
  /** Replace history entry instead of push */
  replace?: boolean
}

/**
 * Sync a reactive value with a URL query parameter
 * 
 * @param key - Query parameter name
 * @param defaultValue - Default value if param not in URL
 * @param options - Configuration options
 */
export function useUrlState(
  key: string,
  defaultValue: string = '',
  options: UseUrlStateOptions = {}
) {
  const { debounce = 300, replace = true } = options
  
  const route = useRoute()
  const router = useRouter()
  
  // Internal state
  const value = ref(defaultValue)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let isUpdatingFromUrl = false
  
  /**
   * Read initial value from URL on mount
   */
  function initFromUrl() {
    const urlValue = route.query[key]
    if (typeof urlValue === 'string' && urlValue) {
      value.value = decodeURIComponent(urlValue)
    }
  }
  
  /**
   * Update URL when value changes
   */
  function updateUrl(newValue: string) {
    if (isUpdatingFromUrl) return
    
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(() => {
      const query = { ...route.query }
      
      if (newValue && newValue !== defaultValue) {
        query[key] = encodeURIComponent(newValue)
      } else {
        delete query[key]
      }
      
      // Only update if query actually changed
      const currentValue = route.query[key]
      const newEncodedValue = newValue ? encodeURIComponent(newValue) : undefined
      
      if (currentValue !== newEncodedValue) {
        if (replace) {
          router.replace({ query })
        } else {
          router.push({ query })
        }
      }
    }, debounce)
  }
  
  /**
   * Update value when URL changes (e.g., browser back/forward)
   */
  function handleRouteChange() {
    const urlValue = route.query[key]
    const decodedValue = typeof urlValue === 'string' ? decodeURIComponent(urlValue) : defaultValue
    
    if (decodedValue !== value.value) {
      isUpdatingFromUrl = true
      value.value = decodedValue
      // Reset flag after Vue's reactivity cycle
      setTimeout(() => {
        isUpdatingFromUrl = false
      }, 0)
    }
  }
  
  // Watch for value changes → update URL
  watch(value, (newValue) => {
    updateUrl(newValue)
  })
  
  // Watch for route changes → update value
  watch(() => route.query[key], handleRouteChange)
  
  // Initialize from URL on mount
  onMounted(() => {
    initFromUrl()
  })
  
  /**
   * Set value programmatically (also updates URL)
   */
  function setValue(newValue: string) {
    value.value = newValue
  }
  
  /**
   * Clear value (removes from URL)
   */
  function clearValue() {
    value.value = defaultValue
  }
  
  return {
    value,
    setValue,
    clearValue,
  }
}

/**
 * Sync multiple values with URL query params
 */
export function useUrlStateMultiple<T extends Record<string, string>>(
  defaults: T,
  options: UseUrlStateOptions = {}
) {
  const states: Record<string, ReturnType<typeof useUrlState>> = {}
  
  for (const [key, defaultValue] of Object.entries(defaults)) {
    states[key] = useUrlState(key, defaultValue, options)
  }
  
  return states
}
```

### 2. Update Composables Barrel Export
Update `src/composables/index.ts`:

```typescript
export { useTheme } from './useTheme'
export type { ThemeMode } from './useTheme'
export { useBreadcrumbs } from './useBreadcrumbs'
export { useClipboard } from './useClipboard'
export { useHighlighter } from './useHighlighter'
export type { BundledLanguage } from './useHighlighter'
export { useUrlState, useUrlStateMultiple } from './useUrlState'
export type { UseUrlStateOptions } from './useUrlState'
```

### 3. Update NumberTypeExplorer to Use URL State
Update `src/components/widgets/NumberTypeExplorer.vue`:

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import NumberInput from './NumberInput.vue'
import SetMembershipDisplay from './SetMembershipDisplay.vue'
import NumberProperties from './NumberProperties.vue'
import { parseNumberInput, classifyNumber, getNumberProperties } from '@/utils/math/numberClassification'
import { exampleNumbers } from '@/data/exampleNumbers'
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
const urlState = props.syncUrl 
  ? useUrlState(props.urlKey, props.initialValue)
  : null

// Local state
const localValue = ref(props.initialValue)
const isValid = ref(true)

// Use URL state if enabled, otherwise local state
const inputValue = computed({
  get: () => urlState ? urlState.value.value : localValue.value,
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
  try {
    return parseNumberInput(trimmed)
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
    
    <!-- Visualization slots (populated in 4D) -->
    <div v-if="$slots.visualizations" class="mt-6">
      <slot name="visualizations" :value="parsedNumber" :classification="classification" />
    </div>
  </div>
</template>
```

### 4. Update NumberTypesView to Enable URL Sync
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
          Enter any number below to see which sets it belongs to. The URL updates 
          automatically so you can share specific numbers with others.
        </p>
        
        <!-- URL sync enabled! -->
        <NumberTypeExplorer 
          initial-value="42" 
          sync-url 
          url-key="n"
        />
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
- [ ] URL updates when entering a number (debounced)
- [ ] Page loads with number from URL param if present
- [ ] Browser back/forward updates the widget
- [ ] Sharing URL `?n=42` shows 42 on page load
- [ ] Special characters are URI-encoded (e.g., `?n=3%2B4i` for `3+4i`)
- [ ] Empty input removes param from URL
- [ ] Default value doesn't add param to URL
- [ ] URL updates use `replace` (no history spam)
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Verification
1. Navigate to `/basics/number-types`
2. Enter `42` - URL should update to `?n=42`
3. Enter `3+4i` - URL should show `?n=3%2B4i`
4. Copy URL, open in new tab - should show same number
5. Click browser back - should show previous number
6. Clear input - URL param should disappear

## Next Increment
After completion, proceed to `inc_4d.md` for visualizations (number line, Venn diagram).
