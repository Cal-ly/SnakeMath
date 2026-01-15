# SnakeMath - Increment 3D: TabGroup Component

## Context
Creating a tabbed interface component using a hybrid approach: props define tab labels (type-safe, controls order), slots provide content (maximum flexibility).

## Design Decisions
- **API**: Hybrid - props for tabs array, dynamic slots for content
- **Accessibility**: Full keyboard navigation (arrow keys, Home/End)
- **Styling**: Underline indicator, responsive

## Task
Create TabGroup and TabPanel components.

## Requirements

### 1. Create TabGroup Component
Create `src/components/ui/TabGroup.vue`:

```vue
<script setup lang="ts">
import { ref, computed, provide, onMounted } from 'vue'

interface Tab {
  /** Tab label (used for slot name) */
  label: string
  /** Optional icon class */
  icon?: string
  /** Disabled state */
  disabled?: boolean
}

interface Props {
  /** Array of tab definitions */
  tabs: (string | Tab)[]
  /** Initially active tab (label) */
  defaultTab?: string
  /** ID prefix for accessibility */
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultTab: undefined,
  id: undefined,
})

const emit = defineEmits<{
  change: [tab: string]
}>()

// Normalize tabs to consistent format
const normalizedTabs = computed(() => 
  props.tabs.map(tab => 
    typeof tab === 'string' 
      ? { label: tab, icon: undefined, disabled: false }
      : { label: tab.label, icon: tab.icon, disabled: tab.disabled ?? false }
  )
)

// Active tab state
const activeTab = ref(props.defaultTab || normalizedTabs.value[0]?.label || '')

// Generate unique IDs
const groupId = computed(() => props.id || `tabs-${Math.random().toString(36).slice(2, 9)}`)
const getTabId = (label: string) => `${groupId.value}-tab-${label.toLowerCase().replace(/\s+/g, '-')}`
const getPanelId = (label: string) => `${groupId.value}-panel-${label.toLowerCase().replace(/\s+/g, '-')}`

// Convert label to slot name (handle spaces)
const getSlotName = (label: string) => label

function selectTab(label: string) {
  const tab = normalizedTabs.value.find(t => t.label === label)
  if (tab && !tab.disabled) {
    activeTab.value = label
    emit('change', label)
  }
}

// Keyboard navigation
function handleKeydown(event: KeyboardEvent, index: number) {
  const enabledTabs = normalizedTabs.value.filter(t => !t.disabled)
  const currentEnabledIndex = enabledTabs.findIndex(t => t.label === normalizedTabs.value[index].label)
  
  let newIndex = currentEnabledIndex
  
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      newIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1
      break
    case 'ArrowRight':
      event.preventDefault()
      newIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0
      break
    case 'Home':
      event.preventDefault()
      newIndex = 0
      break
    case 'End':
      event.preventDefault()
      newIndex = enabledTabs.length - 1
      break
    default:
      return
  }
  
  const newTab = enabledTabs[newIndex]
  if (newTab) {
    selectTab(newTab.label)
    // Focus the new tab button
    const tabButton = document.getElementById(getTabId(newTab.label))
    tabButton?.focus()
  }
}

// Provide active tab to child components (if needed)
provide('activeTab', activeTab)
provide('groupId', groupId)
</script>

<template>
  <div class="tab-group">
    <!-- Tab List -->
    <div 
      role="tablist" 
      aria-label="Content tabs"
      class="tab-list flex border-b border-border overflow-x-auto scrollbar-hide"
    >
      <button
        v-for="(tab, index) in normalizedTabs"
        :key="tab.label"
        :id="getTabId(tab.label)"
        role="tab"
        :aria-selected="activeTab === tab.label"
        :aria-controls="getPanelId(tab.label)"
        :tabindex="activeTab === tab.label ? 0 : -1"
        :disabled="tab.disabled"
        class="tab-button relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors"
        :class="[
          activeTab === tab.label
            ? 'text-primary'
            : 'text-text-muted hover:text-text-primary',
          tab.disabled && 'opacity-50 cursor-not-allowed'
        ]"
        @click="selectTab(tab.label)"
        @keydown="handleKeydown($event, index)"
      >
        <span class="flex items-center gap-2">
          <i v-if="tab.icon" :class="tab.icon" aria-hidden="true" />
          {{ tab.label }}
        </span>
        
        <!-- Active indicator -->
        <span 
          v-if="activeTab === tab.label"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          aria-hidden="true"
        />
      </button>
    </div>

    <!-- Tab Panels -->
    <div class="tab-panels mt-4">
      <div
        v-for="tab in normalizedTabs"
        :key="tab.label"
        :id="getPanelId(tab.label)"
        role="tabpanel"
        :aria-labelledby="getTabId(tab.label)"
        :hidden="activeTab !== tab.label"
        :tabindex="activeTab === tab.label ? 0 : -1"
        class="tab-panel"
      >
        <slot 
          v-if="activeTab === tab.label" 
          :name="getSlotName(tab.label)" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-list {
  /* Fade edges on scroll */
  mask-image: linear-gradient(
    to right,
    transparent,
    black 1rem,
    black calc(100% - 1rem),
    transparent
  );
}

/* Remove mask on desktop where scroll is unlikely */
@media (min-width: 768px) {
  .tab-list {
    mask-image: none;
  }
}

/* Focus ring for accessibility */
.tab-button:focus-visible {
  @apply outline-none ring-2 ring-primary ring-offset-2 rounded;
}
</style>
```

### 2. Update UI Components Barrel Export
Update `src/components/ui/index.ts`:

```typescript
export { default as FaIcon } from './FaIcon.vue'
export { default as CopyButton } from './CopyButton.vue'
export { default as CollapsiblePanel } from './CollapsiblePanel.vue'
export { default as TabGroup } from './TabGroup.vue'
```

### 3. Test TabGroup in a View
Update `src/views/basics/SymbolsView.vue` to test tabs:

```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import TabGroup from '@/components/ui/TabGroup.vue'
import MathBlock from '@/components/content/MathBlock.vue'

const relatedTopics = [
  { title: 'Foundations', path: '/basics/foundations', description: 'Core concepts' },
  { title: 'Number Types', path: '/basics/number-types', description: 'ℕ, ℤ, ℚ, ℝ, ℂ' },
]

const tabs = [
  { label: 'Arithmetic', icon: 'fa-solid fa-plus-minus' },
  { label: 'Algebra', icon: 'fa-solid fa-superscript' },
  { label: 'Calculus', icon: 'fa-solid fa-wave-square' },
  { label: 'Greek', icon: 'fa-solid fa-font' },
]

// Sample symbols for testing (will be replaced with real data in 3E)
const arithmeticSymbols = [
  { symbol: '+', name: 'Plus', meaning: 'Addition', python: 'a + b' },
  { symbol: '−', name: 'Minus', meaning: 'Subtraction', python: 'a - b' },
  { symbol: '×', name: 'Times', meaning: 'Multiplication', python: 'a * b' },
  { symbol: '÷', name: 'Division', meaning: 'Division', python: 'a / b' },
]

const algebraSymbols = [
  { symbol: '∑', name: 'Sigma', meaning: 'Summation', python: 'sum(...)' },
  { symbol: '∏', name: 'Pi (product)', meaning: 'Product', python: 'math.prod(...)' },
  { symbol: '√', name: 'Square root', meaning: 'Square root', python: 'math.sqrt(x)' },
]

const calculusSymbols = [
  { symbol: '∫', name: 'Integral', meaning: 'Integration', python: 'scipy.integrate' },
  { symbol: 'd/dx', name: 'Derivative', meaning: 'Differentiation', python: 'sympy.diff()' },
  { symbol: '∂', name: 'Partial', meaning: 'Partial derivative', python: 'sympy.diff(f, x)' },
]

const greekSymbols = [
  { symbol: 'α', name: 'Alpha', latex: '\\alpha', common: 'Angles, coefficients' },
  { symbol: 'β', name: 'Beta', latex: '\\beta', common: 'Angles, coefficients' },
  { symbol: 'γ', name: 'Gamma', latex: '\\gamma', common: 'Angles' },
  { symbol: 'π', name: 'Pi', latex: '\\pi', common: '3.14159...' },
  { symbol: 'θ', name: 'Theta', latex: '\\theta', common: 'Angles, ML parameters' },
]
</script>

<template>
  <TopicPage
    title="Math Symbols"
    description="A programmer's guide to mathematical notation."
  >
    <div class="space-y-6">
      <div class="card p-6">
        <p class="mb-6">
          Mathematical notation can look intimidating at first, but most symbols 
          have simple programming equivalents. This reference shows you what each 
          symbol means and how to express it in Python.
        </p>

        <TabGroup :tabs="tabs" default-tab="Arithmetic">
          <template #Arithmetic>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Symbol</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Name</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Meaning</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Python</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in arithmeticSymbols" :key="s.symbol" class="border-b border-border/50">
                    <td class="py-2 px-3 text-lg">{{ s.symbol }}</td>
                    <td class="py-2 px-3">{{ s.name }}</td>
                    <td class="py-2 px-3 text-text-muted">{{ s.meaning }}</td>
                    <td class="py-2 px-3 font-mono text-primary">{{ s.python }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <template #Algebra>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Symbol</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Name</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Meaning</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Python</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in algebraSymbols" :key="s.symbol" class="border-b border-border/50">
                    <td class="py-2 px-3 text-lg">{{ s.symbol }}</td>
                    <td class="py-2 px-3">{{ s.name }}</td>
                    <td class="py-2 px-3 text-text-muted">{{ s.meaning }}</td>
                    <td class="py-2 px-3 font-mono text-primary">{{ s.python }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <template #Calculus>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Symbol</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Name</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Meaning</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Python</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in calculusSymbols" :key="s.symbol" class="border-b border-border/50">
                    <td class="py-2 px-3 text-lg">{{ s.symbol }}</td>
                    <td class="py-2 px-3">{{ s.name }}</td>
                    <td class="py-2 px-3 text-text-muted">{{ s.meaning }}</td>
                    <td class="py-2 px-3 font-mono text-primary">{{ s.python }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <template #Greek>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Symbol</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Name</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">LaTeX</th>
                    <th class="text-left py-2 px-3 font-medium text-text-muted">Common Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in greekSymbols" :key="s.symbol" class="border-b border-border/50">
                    <td class="py-2 px-3 text-lg">{{ s.symbol }}</td>
                    <td class="py-2 px-3">{{ s.name }}</td>
                    <td class="py-2 px-3 font-mono text-text-muted">{{ s.latex }}</td>
                    <td class="py-2 px-3 text-text-muted">{{ s.common }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="mt-4 text-sm text-text-muted">
              <i class="fa-solid fa-info-circle mr-1" aria-hidden="true" />
              Greek letters in math can be typed in LaTeX using backslash + name, 
              e.g., <MathBlock formula="\theta" /> is <code>\theta</code>.
            </p>
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
- [ ] Tabs display horizontally with active indicator
- [ ] Clicking a tab shows its content
- [ ] Arrow keys navigate between tabs
- [ ] Home/End keys jump to first/last tab
- [ ] Tab buttons have proper ARIA attributes
- [ ] Tab panels have proper ARIA attributes
- [ ] Focus is visible on tab buttons
- [ ] Content scrolls horizontally if tabs overflow on mobile
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Accessibility Testing
1. Tab to the tab list - first tab should receive focus
2. Press Right Arrow - next tab should activate and focus
3. Press Left Arrow - previous tab should activate
4. Press Home - first tab should activate
5. Press End - last tab should activate
6. Screen reader should announce "tab, 1 of 4, selected"

## Next Increment
After completion, proceed to `inc_3e.md` for Symbol Data files.
