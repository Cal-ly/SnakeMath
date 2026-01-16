# SnakeMath - Increment 3A: KaTeX Integration & MathBlock Component

## Context
Phase 3 focuses on content components. This increment adds mathematical formula rendering using KaTeX, wrapped in a reusable MathBlock component.

## Design Decisions
- **Library**: KaTeX (smaller, faster than MathJax)
- **Copy LaTeX**: Deferred to future phase
- **Error handling**: Show error message with original formula

## Task
Install KaTeX and create the MathBlock component.

## Requirements

### 1. Install KaTeX

```bash
npm install katex@0.16
```

### 2. Import KaTeX CSS
Update `src/assets/styles/main.css` to import KaTeX styles at the top:

```css
/* KaTeX styles */
@import 'katex/dist/katex.min.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ... rest of file ... */
```

### 3. Create MathBlock Component
Create `src/components/content/MathBlock.vue`:

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import katex from 'katex'

interface Props {
  /** LaTeX formula string */
  formula: string
  /** Display mode (centered, larger) vs inline */
  display?: boolean
  /** Additional CSS classes */
  class?: string
  /** Custom error message if rendering fails */
  errorText?: string
}

const props = withDefaults(defineProps<Props>(), {
  display: false,
  class: '',
  errorText: undefined,
})

const error = ref<string | null>(null)

const renderedHtml = computed(() => {
  try {
    error.value = null
    return katex.renderToString(props.formula, {
      displayMode: props.display,
      throwOnError: true,
      strict: false,
      trust: false,
      // Enable some useful macros
      macros: {
        '\\R': '\\mathbb{R}',
        '\\N': '\\mathbb{N}',
        '\\Z': '\\mathbb{Z}',
        '\\Q': '\\mathbb{Q}',
        '\\C': '\\mathbb{C}',
      },
    })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    error.value = errorMessage
    return null
  }
})

// Generate accessible description from formula
const ariaLabel = computed(() => {
  // Simple conversion for screen readers
  // Could be enhanced with a proper LaTeX-to-speech library
  return `Mathematical formula: ${props.formula}`
})
</script>

<template>
  <span
    v-if="renderedHtml && !error"
    :class="[
      'math-block',
      display ? 'math-display' : 'math-inline',
      props.class,
    ]"
    role="img"
    :aria-label="ariaLabel"
    v-html="renderedHtml"
  />
  
  <span
    v-else
    :class="[
      'math-error',
      display ? 'block text-center my-4' : 'inline',
      props.class,
    ]"
    role="img"
    :aria-label="`Math formula error: ${error}`"
  >
    <span class="text-red-500 dark:text-red-400">
      <i class="fa-solid fa-exclamation-triangle mr-1" aria-hidden="true" />
      <template v-if="errorText">{{ errorText }}</template>
      <template v-else>
        <code class="text-sm bg-red-50 dark:bg-red-900/20 px-1 rounded">{{ formula }}</code>
      </template>
    </span>
  </span>
</template>

<style scoped>
.math-display {
  display: block;
  text-align: center;
  margin: 1rem 0;
  overflow-x: auto;
}

.math-inline {
  display: inline;
}

/* Ensure KaTeX doesn't break layout */
.math-block :deep(.katex-display) {
  margin: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5rem 0;
}

/* Scrollbar styling for overflow */
.math-block :deep(.katex-display)::-webkit-scrollbar {
  height: 4px;
}

.math-block :deep(.katex-display)::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 2px;
}
</style>
```

### 4. Create Type Export (if not exists)
Ensure `src/types/components.ts` has MathBlock props:

```typescript
/**
 * Props for MathBlock component
 */
export interface MathBlockProps {
  /** LaTeX formula string */
  formula: string
  /** Display mode (centered, larger) vs inline */
  display?: boolean
  /** Additional CSS classes */
  class?: string
  /** Custom error message if rendering fails */
  errorText?: string
}
```

### 5. Update Content Components Barrel Export
Update `src/components/content/index.ts`:

```typescript
export { default as TopicPage } from './TopicPage.vue'
export { default as RelatedTopics } from './RelatedTopics.vue'
export { default as MathBlock } from './MathBlock.vue'
```

### 6. Test MathBlock in a View
Update `src/views/basics/FoundationsView.vue` to test:

```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'

const relatedTopics = [
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Learn the notation' },
  { title: 'Number Types', path: '/basics/number-types', description: 'ℕ, ℤ, ℚ, ℝ, ℂ' },
]
</script>

<template>
  <TopicPage
    title="Foundations"
    description="Everything in math breaks down to four operators and a set of rules."
  >
    <section class="space-y-6">
      <div class="card p-6">
        <h2>The Basics</h2>
        <p>
          In a simple sense, nearly all math can be broken down to four operators:
          addition, subtraction, multiplication, and division.
        </p>
        
        <h3>Testing MathBlock</h3>
        
        <p>
          Inline math example: The Pythagorean theorem states that 
          <MathBlock formula="a^2 + b^2 = c^2" />.
        </p>
        
        <p>Display mode example:</p>
        <MathBlock formula="\sum_{i=1}^{n} i = \frac{n(n+1)}{2}" display />
        
        <p>Number sets with macros:</p>
        <MathBlock formula="\N \subset \Z \subset \Q \subset \R \subset \C" display />
        
        <p>A more complex example - the quadratic formula:</p>
        <MathBlock formula="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" display />
        
        <p>Error handling (intentionally broken):</p>
        <MathBlock formula="\invalid{command}" />
      </div>
    </section>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
```

## Success Criteria
- [ ] KaTeX package installed (`npm list katex` shows 0.16.x)
- [ ] KaTeX CSS is loaded (formulas have proper styling)
- [ ] Inline math renders correctly
- [ ] Display math renders centered and larger
- [ ] Number set macros work (ℕ, ℤ, ℚ, ℝ, ℂ)
- [ ] Invalid formulas show error with original formula
- [ ] Long formulas scroll horizontally on mobile
- [ ] Screen readers get accessible label
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Verification
1. Navigate to `/basics/foundations`
2. Verify inline formula appears in text flow
3. Verify display formula is centered
4. Verify error formula shows red warning
5. Resize to mobile width - long formulas should scroll

## Next Increment
After completion, proceed to `inc_3b.md` for CodeExample with Shiki syntax highlighting.
