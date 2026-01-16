# SnakeMath - Increment 3B: Shiki Integration & CodeExample Component

## Context
Adding syntax highlighting for code examples using Shiki. The CodeExample component supports copy-to-clipboard, optional line numbers, titles, and collapsible state.

## Design Decisions
- **Library**: Shiki (VSCode-quality highlighting)
- **Features**: Copy button, line numbers (optional), title, collapsible
- **Copy feedback**: Subtle icon change with brief highlight
- **Theme**: GitHub light/dark to match site theme

## Task
Install Shiki, create clipboard composable, and build CodeExample component.

## Requirements

### 1. Install Shiki

```bash
npm install shiki@1
```

### 2. Create Clipboard Composable
Create `src/composables/useClipboard.ts`:

```typescript
import { ref } from 'vue'

export interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>
  copied: Ref<boolean>
  error: Ref<string | null>
}

/**
 * Composable for clipboard operations with feedback state
 */
export function useClipboard(resetDelay = 2000) {
  const copied = ref(false)
  const error = ref<string | null>(null)

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      error.value = null
      
      // Reset copied state after delay
      setTimeout(() => {
        copied.value = false
      }, resetDelay)
      
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to copy'
      copied.value = false
      return false
    }
  }

  return {
    copy,
    copied,
    error,
  }
}
```

### 3. Create Highlighter Composable
Create `src/composables/useHighlighter.ts`:

```typescript
import { ref, shallowRef } from 'vue'
import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki'

// Singleton highlighter instance
let highlighterInstance: Highlighter | null = null
let highlighterPromise: Promise<Highlighter> | null = null

const isLoading = ref(false)
const loadError = ref<string | null>(null)

// Languages we support
const supportedLanguages: BundledLanguage[] = [
  'python',
  'javascript',
  'typescript',
  'json',
  'bash',
  'sql',
  'html',
  'css',
  'markdown',
]

/**
 * Get or create the Shiki highlighter instance (singleton)
 */
async function getHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) {
    return highlighterInstance
  }

  if (highlighterPromise) {
    return highlighterPromise
  }

  isLoading.value = true
  loadError.value = null

  highlighterPromise = createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: supportedLanguages,
  })
    .then((h) => {
      highlighterInstance = h
      isLoading.value = false
      return h
    })
    .catch((e) => {
      loadError.value = e instanceof Error ? e.message : 'Failed to load highlighter'
      isLoading.value = false
      highlighterPromise = null
      throw e
    })

  return highlighterPromise
}

/**
 * Composable for syntax highlighting with Shiki
 */
export function useHighlighter() {
  const highlighter = shallowRef<Highlighter | null>(null)

  async function highlight(
    code: string,
    language: BundledLanguage = 'python',
    theme: 'light' | 'dark' = 'light'
  ): Promise<string> {
    try {
      const h = await getHighlighter()
      highlighter.value = h

      return h.codeToHtml(code, {
        lang: language,
        theme: theme === 'dark' ? 'github-dark' : 'github-light',
      })
    } catch {
      // Fallback to plain code block
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return `<pre><code>${escaped}</code></pre>`
    }
  }

  return {
    highlight,
    highlighter,
    isLoading,
    loadError,
    supportedLanguages,
  }
}

export type { BundledLanguage }
```

### 4. Create CopyButton Component
Create `src/components/ui/CopyButton.vue`:

```vue
<script setup lang="ts">
import { useClipboard } from '@/composables/useClipboard'

interface Props {
  text: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Copy to clipboard',
})

const { copy, copied } = useClipboard()

async function handleCopy() {
  await copy(props.text)
}
</script>

<template>
  <button
    type="button"
    :aria-label="copied ? 'Copied!' : ariaLabel"
    :class="[
      'copy-button p-1.5 rounded transition-all duration-200',
      'text-text-muted hover:text-text-primary hover:bg-surface-alt',
      { 'copy-success': copied }
    ]"
    @click="handleCopy"
  >
    <i 
      :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'" 
      class="text-sm"
      aria-hidden="true" 
    />
  </button>
</template>

<style scoped>
.copy-success {
  @apply text-primary bg-primary/10;
  animation: copy-pulse 0.3s ease-out;
}

@keyframes copy-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .copy-success {
    animation: none;
  }
}
</style>
```

### 5. Create CodeExample Component
Create `src/components/content/CodeExample.vue`:

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useHighlighter, type BundledLanguage } from '@/composables/useHighlighter'
import { useTheme } from '@/composables/useTheme'
import CopyButton from '@/components/ui/CopyButton.vue'

interface Props {
  /** Code content */
  code: string
  /** Programming language */
  language?: BundledLanguage
  /** Optional title/filename */
  title?: string
  /** Show line numbers */
  lineNumbers?: boolean
  /** Make collapsible */
  collapsible?: boolean
  /** Start collapsed (if collapsible) */
  defaultCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: 'python',
  title: undefined,
  lineNumbers: false,
  collapsible: false,
  defaultCollapsed: false,
})

const { highlight, isLoading } = useHighlighter()
const { isDark } = useTheme()

const highlightedCode = ref('')
const isCollapsed = ref(props.defaultCollapsed)
const codeId = `code-${Math.random().toString(36).slice(2, 9)}`

// Language display names
const languageNames: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  bash: 'Bash',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  markdown: 'Markdown',
}

const displayLanguage = computed(() => languageNames[props.language] || props.language)

// Line count for line numbers
const lineCount = computed(() => props.code.split('\n').length)

// Highlight code when props or theme change
async function updateHighlight() {
  highlightedCode.value = await highlight(
    props.code,
    props.language,
    isDark.value ? 'dark' : 'light'
  )
}

watch([() => props.code, () => props.language, isDark], updateHighlight)
onMounted(updateHighlight)

function toggleCollapse() {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<template>
  <div class="code-example rounded-lg border border-border overflow-hidden">
    <!-- Header -->
    <div 
      class="code-header flex items-center justify-between px-3 py-2 bg-surface-alt border-b border-border"
      :class="{ 'cursor-pointer hover:bg-border/50': collapsible }"
      @click="toggleCollapse"
    >
      <div class="flex items-center gap-2">
        <!-- Collapse toggle -->
        <button
          v-if="collapsible"
          type="button"
          class="text-text-muted hover:text-text-primary transition-colors"
          :aria-expanded="!isCollapsed"
          :aria-controls="codeId"
        >
          <i 
            :class="isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-down'" 
            class="text-xs w-3"
            aria-hidden="true" 
          />
        </button>
        
        <!-- Title or language badge -->
        <span class="text-sm font-medium text-text-secondary">
          {{ title || displayLanguage }}
        </span>
        
        <!-- Language badge (if title is shown) -->
        <span 
          v-if="title" 
          class="text-xs px-1.5 py-0.5 rounded bg-border text-text-muted"
        >
          {{ displayLanguage }}
        </span>
      </div>

      <!-- Copy button -->
      <CopyButton 
        :text="code" 
        aria-label="Copy code"
        @click.stop
      />
    </div>

    <!-- Code content -->
    <div
      v-show="!isCollapsed"
      :id="codeId"
      class="code-content relative"
    >
      <!-- Line numbers -->
      <div 
        v-if="lineNumbers" 
        class="line-numbers absolute left-0 top-0 bottom-0 w-10 bg-surface-alt border-r border-border text-right pr-2 pt-4 select-none"
        aria-hidden="true"
      >
        <div 
          v-for="n in lineCount" 
          :key="n" 
          class="text-xs text-text-muted leading-6"
        >
          {{ n }}
        </div>
      </div>

      <!-- Highlighted code -->
      <div 
        :class="['code-wrapper overflow-x-auto', { 'pl-12': lineNumbers }]"
      >
        <div 
          v-if="isLoading" 
          class="p-4 text-text-muted"
        >
          <i class="fa-solid fa-spinner fa-spin mr-2" aria-hidden="true" />
          Loading...
        </div>
        <div 
          v-else
          class="highlighted-code"
          v-html="highlightedCode"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-example {
  @apply text-sm;
}

/* Override Shiki's default styles */
.highlighted-code :deep(pre) {
  @apply m-0 p-4 bg-transparent overflow-x-auto;
}

.highlighted-code :deep(code) {
  @apply font-mono text-sm leading-6;
}

/* Ensure consistent line height for line numbers */
.highlighted-code :deep(pre code .line) {
  @apply leading-6;
}

/* Scrollbar styling */
.code-wrapper::-webkit-scrollbar {
  height: 6px;
}

.code-wrapper::-webkit-scrollbar-thumb {
  @apply bg-border rounded;
}

.code-wrapper::-webkit-scrollbar-track {
  @apply bg-transparent;
}
</style>
```

### 6. Update Composables Barrel Export
Update `src/composables/index.ts`:

```typescript
export { useTheme } from './useTheme'
export type { ThemeMode } from './useTheme'
export { useBreadcrumbs } from './useBreadcrumbs'
export { useClipboard } from './useClipboard'
export { useHighlighter } from './useHighlighter'
export type { BundledLanguage } from './useHighlighter'
```

### 7. Update UI Components Barrel Export
Update `src/components/ui/index.ts`:

```typescript
export { default as FaIcon } from './FaIcon.vue'
export { default as CopyButton } from './CopyButton.vue'
```

### 8. Update Content Components Barrel Export
Update `src/components/content/index.ts`:

```typescript
export { default as TopicPage } from './TopicPage.vue'
export { default as RelatedTopics } from './RelatedTopics.vue'
export { default as MathBlock } from './MathBlock.vue'
export { default as CodeExample } from './CodeExample.vue'
```

### 9. Test CodeExample in a View
Update `src/views/basics/FoundationsView.vue` to include code examples:

```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'

const relatedTopics = [
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Learn the notation' },
  { title: 'Number Types', path: '/basics/number-types', description: 'ℕ, ℤ, ℚ, ℝ, ℂ' },
]

const eulerMethodCode = `# Euler's method - solving differential equations
# with just addition and multiplication!

def euler_method(f, x0, y0, h, steps):
    """
    f: derivative function dy/dx = f(x, y)
    x0, y0: initial conditions
    h: step size
    steps: number of steps
    """
    x, y = x0, y0
    points = [(x, y)]
    
    for _ in range(steps):
        y = y + h * f(x, y)  # Just multiplication and addition!
        x = x + h
        points.append((x, y))
    
    return points

# Example: dy/dx = 2x
result = euler_method(lambda x, y: 2*x, 0, 0, 1, 4)
print(result)  # [(0, 0), (1, 0), (2, 2), (3, 6), (4, 12)]`

const simpleCode = `# The four basic operators in Python
a = 10
b = 3

addition = a + b        # 13
subtraction = a - b     # 7
multiplication = a * b  # 30
division = a / b        # 3.333...`
</script>

<template>
  <TopicPage
    title="Foundations"
    description="Everything in math breaks down to four operators and a set of rules."
  >
    <section class="space-y-6">
      <div class="card p-6 space-y-6">
        <div>
          <h2>The Basics</h2>
          <p>
            In a simple sense, nearly all math can be broken down to four operators:
            addition, subtraction, multiplication, and division.
          </p>
        </div>
        
        <CodeExample
          :code="simpleCode"
          language="python"
          title="basic_operators.py"
        />
        
        <div>
          <h2>Differential Equations — Broken Down</h2>
          <p>
            Let's take a simple differential equation:
          </p>
          <MathBlock formula="\frac{dy}{dx} = 2x" display />
          <p>
            This says: the rate of change of <MathBlock formula="y" /> with respect to 
            <MathBlock formula="x" /> is <MathBlock formula="2x" />.
          </p>
        </div>

        <CodeExample
          :code="eulerMethodCode"
          language="python"
          title="Euler's Method"
          line-numbers
          collapsible
        />

        <p>
          Each step only uses addition and multiplication! The scary-looking 
          <MathBlock formula="\frac{dy}{dx}" /> becomes simple arithmetic.
        </p>
      </div>
    </section>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
```

## Success Criteria
- [ ] Shiki package installed (`npm list shiki` shows 1.x)
- [ ] Code blocks have syntax highlighting matching theme (light/dark)
- [ ] Copy button works and shows brief visual feedback
- [ ] Line numbers display correctly when enabled
- [ ] Collapsible code blocks expand/collapse
- [ ] Header shows title and language badge
- [ ] Code scrolls horizontally when too wide
- [ ] Theme changes update code highlighting
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Verification
1. Navigate to `/basics/foundations`
2. Verify Python code has colored syntax
3. Click copy button - should show checkmark briefly
4. Toggle theme - code colors should update
5. Click collapsible header - code should hide/show
6. Resize to mobile - code should scroll horizontally

## Next Increment
After completion, proceed to `inc_3c.md` for CollapsiblePanel component.
