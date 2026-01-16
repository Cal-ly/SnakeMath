# SnakeMath - Increment 3F: SymbolTable Component

## Context
Creating a searchable, filterable symbol table with responsive hybrid layout: table on desktop, cards on mobile.

## Design Decisions
- **Layout**: Responsive hybrid (table on md+, cards on mobile)
- **Search**: Real-time filtering with debounce
- **Accessibility**: Proper table semantics, live region for results

## Task
Create the SymbolTable component and SearchInput helper.

## Requirements

### 1. Create SearchInput Component
Create `src/components/ui/SearchInput.vue`:

```vue
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

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

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
input[type="search"]::-webkit-search-cancel-button {
  display: none;
}
</style>
```

### 2. Create SymbolTable Component
Create `src/components/content/SymbolTable.vue`:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MathSymbol } from '@/types'
import SearchInput from '@/components/ui/SearchInput.vue'
import MathBlock from '@/components/content/MathBlock.vue'

interface Props {
  /** Array of symbols to display */
  symbols: MathSymbol[]
  /** Enable search functionality */
  searchable?: boolean
  /** Columns to display */
  columns?: ('symbol' | 'name' | 'latex' | 'meaning' | 'programmingAnalogy' | 'pythonExample')[]
  /** Show LaTeX rendered instead of raw code */
  renderLatex?: boolean
  /** Search placeholder text */
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchable: true,
  columns: () => ['symbol', 'name', 'meaning', 'programmingAnalogy'],
  renderLatex: false,
  searchPlaceholder: 'Search symbols...',
})

const searchQuery = ref('')

// Column labels
const columnLabels: Record<string, string> = {
  symbol: 'Symbol',
  name: 'Name',
  latex: 'LaTeX',
  meaning: 'Meaning',
  programmingAnalogy: 'Python',
  pythonExample: 'Example',
}

// Filter symbols based on search query
const filteredSymbols = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.symbols
  }
  
  const q = searchQuery.value.toLowerCase()
  return props.symbols.filter(s => 
    s.symbol.includes(searchQuery.value) ||
    s.name.toLowerCase().includes(q) ||
    s.meaning.toLowerCase().includes(q) ||
    s.programmingAnalogy?.toLowerCase().includes(q) ||
    s.latex.toLowerCase().includes(q)
  )
})

// Result count for screen readers
const resultText = computed(() => {
  const count = filteredSymbols.value.length
  const total = props.symbols.length
  if (!searchQuery.value) return ''
  return `${count} of ${total} symbols`
})
</script>

<template>
  <div class="symbol-table">
    <!-- Search -->
    <div v-if="searchable" class="mb-4">
      <SearchInput
        v-model="searchQuery"
        :placeholder="searchPlaceholder"
        aria-label="Search symbols"
      />
      <!-- Live region for screen readers -->
      <div 
        v-if="resultText"
        class="sr-only" 
        role="status" 
        aria-live="polite"
      >
        {{ resultText }}
      </div>
      <p 
        v-if="searchQuery && filteredSymbols.length === 0" 
        class="mt-2 text-sm text-text-muted"
      >
        No symbols found for "{{ searchQuery }}"
      </p>
      <p 
        v-else-if="searchQuery"
        class="mt-2 text-sm text-text-muted"
      >
        Showing {{ filteredSymbols.length }} of {{ symbols.length }} symbols
      </p>
    </div>

    <!-- Desktop: Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b-2 border-border">
            <th 
              v-for="col in columns" 
              :key="col"
              scope="col"
              class="text-left py-3 px-3 font-semibold text-text-primary bg-surface-alt"
            >
              {{ columnLabels[col] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="symbol in filteredSymbols" 
            :key="symbol.symbol + symbol.name"
            class="border-b border-border/50 hover:bg-surface-alt/50 transition-colors"
          >
            <td 
              v-for="col in columns" 
              :key="col"
              class="py-3 px-3"
              :class="{
                'text-2xl': col === 'symbol',
                'font-mono text-primary text-xs': col === 'programmingAnalogy' || col === 'pythonExample' || col === 'latex',
                'text-text-muted': col === 'meaning',
              }"
            >
              <template v-if="col === 'symbol' && renderLatex">
                <MathBlock :formula="symbol.latex" />
              </template>
              <template v-else-if="col === 'latex'">
                <code class="bg-code-bg px-1.5 py-0.5 rounded">{{ symbol.latex }}</code>
              </template>
              <template v-else>
                {{ symbol[col] || '—' }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile: Card View -->
    <div class="md:hidden space-y-3">
      <div 
        v-for="symbol in filteredSymbols" 
        :key="symbol.symbol + symbol.name"
        class="card p-4"
      >
        <div class="flex items-start gap-4">
          <!-- Symbol -->
          <div class="text-3xl w-12 text-center shrink-0">
            <template v-if="renderLatex">
              <MathBlock :formula="symbol.latex" />
            </template>
            <template v-else>
              {{ symbol.symbol }}
            </template>
          </div>
          
          <!-- Details -->
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-text-primary">{{ symbol.name }}</h3>
            <p class="text-sm text-text-muted mt-1">{{ symbol.meaning }}</p>
            
            <!-- Programming analogy -->
            <div v-if="symbol.programmingAnalogy" class="mt-2">
              <code class="text-xs font-mono text-primary bg-code-bg px-2 py-1 rounded">
                {{ symbol.programmingAnalogy }}
              </code>
            </div>
            
            <!-- LaTeX (if in columns) -->
            <div v-if="columns.includes('latex')" class="mt-2 text-xs text-text-muted">
              LaTeX: <code class="bg-code-bg px-1 rounded">{{ symbol.latex }}</code>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div 
        v-if="filteredSymbols.length === 0 && searchQuery" 
        class="text-center py-8 text-text-muted"
      >
        <i class="fa-solid fa-search text-3xl mb-2 opacity-50" aria-hidden="true" />
        <p>No symbols match your search</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure table doesn't break layout */
table {
  table-layout: auto;
}

/* Screen reader only */
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

### 3. Update UI Components Barrel Export
Update `src/components/ui/index.ts`:

```typescript
export { default as FaIcon } from './FaIcon.vue'
export { default as CopyButton } from './CopyButton.vue'
export { default as CollapsiblePanel } from './CollapsiblePanel.vue'
export { default as TabGroup } from './TabGroup.vue'
export { default as SearchInput } from './SearchInput.vue'
```

### 4. Update Content Components Barrel Export
Update `src/components/content/index.ts`:

```typescript
export { default as TopicPage } from './TopicPage.vue'
export { default as RelatedTopics } from './RelatedTopics.vue'
export { default as MathBlock } from './MathBlock.vue'
export { default as CodeExample } from './CodeExample.vue'
export { default as ContentSection } from './ContentSection.vue'
export { default as SymbolTable } from './SymbolTable.vue'
```

### 5. Update SymbolsView to Use SymbolTable
Update `src/views/basics/SymbolsView.vue`:

```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import TabGroup from '@/components/ui/TabGroup.vue'
import SymbolTable from '@/components/content/SymbolTable.vue'
import { 
  arithmeticSymbols, 
  algebraSymbols, 
  calculusSymbols, 
  setSymbols,
  logicSymbols,
  constantSymbols,
  mlSymbols,
} from '@/data/symbols'
import { greekLetters } from '@/data/symbols/greek'
import type { MathSymbol } from '@/types'

const relatedTopics = [
  { title: 'Foundations', path: '/basics/foundations', description: 'Core concepts' },
  { title: 'Number Types', path: '/basics/number-types', description: 'ℕ, ℤ, ℚ, ℝ, ℂ' },
]

const tabs = [
  { label: 'Arithmetic', icon: 'fa-solid fa-plus-minus' },
  { label: 'Algebra', icon: 'fa-solid fa-superscript' },
  { label: 'Calculus', icon: 'fa-solid fa-wave-square' },
  { label: 'Sets & Logic', icon: 'fa-solid fa-diagram-project' },
  { label: 'Constants', icon: 'fa-solid fa-pi' },
  { label: 'Greek', icon: 'fa-solid fa-font' },
  { label: 'ML', icon: 'fa-solid fa-brain' },
]

// Convert Greek letters to MathSymbol format for the table
const greekAsSymbols: MathSymbol[] = greekLetters.map(g => ({
  symbol: `${g.lowercase} / ${g.uppercase}`,
  name: g.name,
  latex: g.latex,
  meaning: g.commonUses.join(', '),
  programmingAnalogy: `# ${g.latex} in LaTeX`,
  category: 'greek',
}))

// Combine sets and logic
const setsAndLogicSymbols = [...setSymbols, ...logicSymbols]
</script>

<template>
  <TopicPage
    title="Math Symbols"
    description="A programmer's guide to mathematical notation."
  >
    <div class="space-y-6">
      <div class="card p-6">
        <p class="mb-6">
          Mathematical notation can look intimidating, but most symbols have simple 
          programming equivalents. Use the tabs below to explore different categories, 
          and search to find specific symbols.
        </p>

        <TabGroup :tabs="tabs" default-tab="Arithmetic">
          <template #Arithmetic>
            <SymbolTable 
              :symbols="arithmeticSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
            />
          </template>

          <template #Algebra>
            <SymbolTable 
              :symbols="algebraSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
            />
          </template>

          <template #Calculus>
            <SymbolTable 
              :symbols="calculusSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
            />
          </template>

          <template #"Sets & Logic">
            <SymbolTable 
              :symbols="setsAndLogicSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
            />
          </template>

          <template #Constants>
            <SymbolTable 
              :symbols="constantSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
            />
          </template>

          <template #Greek>
            <SymbolTable 
              :symbols="greekAsSymbols"
              :columns="['symbol', 'name', 'latex', 'meaning']"
              search-placeholder="Search Greek letters..."
            />
          </template>

          <template #ML>
            <SymbolTable 
              :symbols="mlSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
              search-placeholder="Search ML symbols..."
            />
          </template>
        </TabGroup>
      </div>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
```

## Success Criteria
- [ ] SymbolTable displays symbols in table format on desktop (md+)
- [ ] SymbolTable displays symbols as cards on mobile
- [ ] Search filters symbols in real-time with debounce
- [ ] Clear button appears when search has input
- [ ] Result count updates as user types
- [ ] Screen readers announce result count changes
- [ ] Empty state shown when no results
- [ ] Table has proper semantic markup (thead, th scope)
- [ ] All tabs in SymbolsView work correctly
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Responsive Testing
1. Open `/basics/symbols` on desktop - should show table
2. Resize to mobile width - should show cards
3. Search "sum" - should filter results
4. Clear search - should show all symbols
5. Switch between tabs - each should have searchable content

## Next Increment
After completion, proceed to `inc_3g.md` for final content integration and testing.
