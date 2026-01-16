# SnakeMath - Increment 3C: CollapsiblePanel Component

## Context
A reusable collapsible panel for content sections. This will be used for ContentSection (to collapse parts of educational content) and can be reused elsewhere.

## Design Decisions
- **Animation**: Smooth height transition with reduced motion support
- **Accessibility**: Full keyboard support, ARIA attributes
- **Customizable**: Icon, styling variants

## Task
Create the CollapsiblePanel UI component and ContentSection content component.

## Requirements

### 1. Create CollapsiblePanel Component
Create `src/components/ui/CollapsiblePanel.vue`:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  /** Panel title */
  title: string
  /** Start expanded */
  defaultExpanded?: boolean
  /** Icon class (Font Awesome) */
  icon?: string
  /** Variant styling */
  variant?: 'default' | 'card' | 'subtle'
  /** ID for ARIA (auto-generated if not provided) */
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: true,
  icon: undefined,
  variant: 'default',
  id: undefined,
})

const isExpanded = ref(props.defaultExpanded)
const contentId = computed(() => props.id || `panel-${Math.random().toString(36).slice(2, 9)}`)
const buttonId = computed(() => `${contentId.value}-button`)

function toggle() {
  isExpanded.value = !isExpanded.value
}

// Expose for parent components if needed
defineExpose({
  isExpanded,
  toggle,
  expand: () => { isExpanded.value = true },
  collapse: () => { isExpanded.value = false },
})
</script>

<template>
  <div 
    :class="[
      'collapsible-panel',
      `variant-${variant}`,
      { 'is-expanded': isExpanded }
    ]"
  >
    <!-- Header/Toggle Button -->
    <button
      :id="buttonId"
      type="button"
      class="panel-header w-full flex items-center gap-3 text-left"
      :class="{
        'p-4 rounded-lg border border-border hover:bg-surface-alt': variant === 'card',
        'py-3 hover:text-primary': variant === 'default',
        'py-2 text-sm': variant === 'subtle',
      }"
      :aria-expanded="isExpanded"
      :aria-controls="contentId"
      @click="toggle"
    >
      <!-- Expand/Collapse Icon -->
      <span 
        class="toggle-icon transition-transform duration-200"
        :class="{ 'rotate-90': isExpanded }"
        aria-hidden="true"
      >
        <i class="fa-solid fa-chevron-right text-xs text-text-muted" />
      </span>

      <!-- Custom Icon -->
      <span v-if="icon" class="text-primary" aria-hidden="true">
        <i :class="icon" />
      </span>

      <!-- Title -->
      <span 
        class="flex-1 font-medium"
        :class="{
          'text-text-primary': variant !== 'subtle',
          'text-text-secondary': variant === 'subtle',
        }"
      >
        {{ title }}
      </span>

      <!-- Optional slot for header extras (like badges) -->
      <slot name="header-extra" />
    </button>

    <!-- Collapsible Content -->
    <div
      :id="contentId"
      role="region"
      :aria-labelledby="buttonId"
      class="panel-content overflow-hidden transition-all duration-200"
      :class="{
        'max-h-0 opacity-0': !isExpanded,
        'max-h-[2000px] opacity-100': isExpanded,
      }"
    >
      <div 
        class="content-inner"
        :class="{
          'pt-4 pl-8': variant === 'default',
          'p-4 pt-0 border-t border-border mt-4': variant === 'card',
          'pt-2 pl-6': variant === 'subtle',
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth height animation */
.panel-content {
  will-change: max-height, opacity;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .panel-content,
  .toggle-icon {
    transition: none;
  }
}

/* Card variant enhancements */
.variant-card.is-expanded .panel-header {
  @apply rounded-b-none;
}

.variant-card .panel-content {
  @apply border border-t-0 border-border rounded-b-lg;
}

.variant-card .panel-content:not(.max-h-0) {
  @apply border-t-0;
}
</style>
```

### 2. Create ContentSection Component
Create `src/components/content/ContentSection.vue`:

```vue
<script setup lang="ts">
import CollapsiblePanel from '@/components/ui/CollapsiblePanel.vue'

interface Props {
  /** Section ID for deep linking */
  id: string
  /** Section title */
  title: string
  /** Font Awesome icon class */
  icon?: string
  /** Make section collapsible */
  collapsible?: boolean
  /** Start expanded (if collapsible) */
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  collapsible: false,
  defaultExpanded: true,
})
</script>

<template>
  <section :id="id" class="content-section scroll-mt-20">
    <!-- Non-collapsible version -->
    <template v-if="!collapsible">
      <h2 class="flex items-center gap-2 text-xl font-semibold text-text-primary mb-4">
        <i v-if="icon" :class="icon" class="text-primary" aria-hidden="true" />
        <a :href="`#${id}`" class="hover:text-primary transition-colors">
          {{ title }}
        </a>
      </h2>
      <div class="section-content">
        <slot />
      </div>
    </template>

    <!-- Collapsible version -->
    <CollapsiblePanel
      v-else
      :id="id"
      :title="title"
      :icon="icon"
      :default-expanded="defaultExpanded"
      variant="default"
    >
      <slot />
    </CollapsiblePanel>
  </section>
</template>

<style scoped>
/* Ensure anchor links account for sticky header */
.content-section {
  scroll-margin-top: 5rem;
}

/* Deep link indicator on hover */
.content-section h2 a:hover::before {
  content: '#';
  @apply absolute -ml-5 text-text-muted;
}

.content-section h2 {
  @apply relative;
}
</style>
```

### 3. Update UI Components Barrel Export
Update `src/components/ui/index.ts`:

```typescript
export { default as FaIcon } from './FaIcon.vue'
export { default as CopyButton } from './CopyButton.vue'
export { default as CollapsiblePanel } from './CollapsiblePanel.vue'
```

### 4. Update Content Components Barrel Export
Update `src/components/content/index.ts`:

```typescript
export { default as TopicPage } from './TopicPage.vue'
export { default as RelatedTopics } from './RelatedTopics.vue'
export { default as MathBlock } from './MathBlock.vue'
export { default as CodeExample } from './CodeExample.vue'
export { default as ContentSection } from './ContentSection.vue'
```

### 5. Test in FoundationsView
Update `src/views/basics/FoundationsView.vue` to use ContentSection:

```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import ContentSection from '@/components/content/ContentSection.vue'

const relatedTopics = [
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Learn the notation' },
  { title: 'Number Types', path: '/basics/number-types', description: 'ℕ, ℤ, ℚ, ℝ, ℂ' },
]

const simpleCode = `# The four basic operators in Python
a = 10
b = 3

addition = a + b        # 13
subtraction = a - b     # 7
multiplication = a * b  # 30
division = a / b        # 3.333...`

const eulerMethodCode = `# Euler's method - solving differential equations
def euler_method(f, x0, y0, h, steps):
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
</script>

<template>
  <TopicPage
    title="Foundations"
    description="Everything in math breaks down to four operators and a set of rules."
  >
    <div class="space-y-8">
      <ContentSection 
        id="basics" 
        title="The Basics"
        icon="fa-solid fa-cubes"
      >
        <p class="mb-4">
          In a simple sense, nearly all math can be broken down to four operators:
          addition, subtraction, multiplication, and division. And a set of rules
          on how to apply these in different manners.
        </p>
        
        <CodeExample
          :code="simpleCode"
          language="python"
          title="basic_operators.py"
        />
      </ContentSection>

      <ContentSection 
        id="diff-eq" 
        title="Differential Equations — Broken Down"
        icon="fa-solid fa-chart-line"
        collapsible
      >
        <p class="mb-4">
          Oh, I can feel your skepticism. What about... eh... differential equations?
          Well, let's look at that then.
        </p>
        
        <p class="mb-4">Let's take a simple differential equation:</p>
        <MathBlock formula="\frac{dy}{dx} = 2x" display />
        
        <p class="mb-4">
          This says: the rate of change of <MathBlock formula="y" /> with respect to 
          <MathBlock formula="x" /> is <MathBlock formula="2x" />.
        </p>

        <p class="mb-4">
          If we imagine <MathBlock formula="\frac{dy}{dx}" /> as a very small change,
          we can solve this step by step using only addition and multiplication:
        </p>

        <CodeExample
          :code="eulerMethodCode"
          language="python"
          title="Euler's Method"
          line-numbers
        />

        <p class="mt-4 p-4 bg-math-highlight rounded-lg">
          <strong>Summary:</strong> Even differential equations, at their core, can be 
          solved step-by-step using just addition, subtraction, multiplication, and division.
        </p>
      </ContentSection>

      <ContentSection 
        id="matlab-joke" 
        title="Why not just use MATLAB?"
        icon="fa-solid fa-face-grin-wink"
        collapsible
        :default-expanded="false"
      >
        <p class="text-text-muted italic">
          MATLAB is an illegitimate programming language and it knows it!
        </p>
      </ContentSection>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
```

## Success Criteria
- [ ] CollapsiblePanel expands/collapses smoothly
- [ ] Chevron icon rotates on expand/collapse
- [ ] Keyboard accessible (Enter/Space toggles)
- [ ] ARIA attributes are correct (`aria-expanded`, `aria-controls`)
- [ ] ContentSection renders with proper heading hierarchy
- [ ] Section anchor links work (`#diff-eq`)
- [ ] Collapsible sections can start collapsed
- [ ] Animations respect `prefers-reduced-motion`
- [ ] All three variants (default, card, subtle) work
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Verification
1. Navigate to `/basics/foundations`
2. Click section headers - should expand/collapse
3. Click anchor links in URL (`#diff-eq`) - should scroll and expand
4. Tab through page - collapsible headers should be focusable
5. Press Enter on focused header - should toggle

## Next Increment
After completion, proceed to `inc_3d.md` for TabGroup component.
