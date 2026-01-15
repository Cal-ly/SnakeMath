# SnakeMath - Increment 3G: Content Integration & Testing

## Context
Final increment of Phase 3. Wire all content components together, populate views with real content, and perform comprehensive testing.

## Task
Integrate all Phase 3 components, add content to views, and verify everything works together.

## Requirements

### 1. Update FoundationsView with Full Content
Update `src/views/basics/FoundationsView.vue` with comprehensive content:

```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import ContentSection from '@/components/content/ContentSection.vue'

const relatedTopics = [
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Symbol reference' },
  { title: 'Number Types', path: '/basics/number-types', description: 'ℕ, ℤ, ℚ, ℝ, ℂ' },
]

const basicOperatorsCode = `# The four basic operators in Python
a = 10
b = 3

addition = a + b        # 13
subtraction = a - b     # 7
multiplication = a * b  # 30
division = a / b        # 3.333...

# Integer division and modulo
integer_div = a // b    # 3
remainder = a % b       # 1`

const summationCode = `# Summation: ∑ is just a for loop!
def summation(n):
    """Sum from 1 to n: ∑(i=1 to n) i"""
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

# Or using Python's built-in
result = sum(range(1, n + 1))

# Formula: n(n+1)/2
def summation_formula(n):
    return n * (n + 1) // 2

print(summation(100))         # 5050
print(summation_formula(100)) # 5050`

const eulerMethodCode = `# Euler's method - solving differential equations
# with just addition and multiplication!

def euler_method(f, x0, y0, h, steps):
    """
    Solve dy/dx = f(x, y) numerically
    
    f: derivative function
    x0, y0: initial conditions
    h: step size
    steps: number of iterations
    """
    x, y = x0, y0
    points = [(x, y)]
    
    for _ in range(steps):
        y = y + h * f(x, y)  # Just addition and multiplication!
        x = x + h
        points.append((x, y))
    
    return points

# Example: dy/dx = 2x (solution: y = x²)
solution = euler_method(
    f=lambda x, y: 2*x,
    x0=0, y0=0,
    h=0.1, steps=10
)
# Result approximates y = x²`

const productCode = `# Product notation: ∏ is multiplication in a loop
import math

def product(n):
    """Product from 1 to n: ∏(i=1 to n) i = n!"""
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

# Or using Python's math library
factorial = math.factorial(5)  # 120

# Using math.prod (Python 3.8+)
result = math.prod(range(1, 6))  # 120`
</script>

<template>
  <TopicPage
    title="Foundations"
    description="Everything in math breaks down to four operators and a set of rules."
  >
    <div class="space-y-8">
      <!-- Intro -->
      <ContentSection id="intro" title="The Core Insight" icon="fa-solid fa-lightbulb">
        <p class="mb-4">
          In a simple sense, nearly all math can be broken down to four operators:
          <strong>addition</strong>, <strong>subtraction</strong>, 
          <strong>multiplication</strong>, and <strong>division</strong>.
          And a set of rules on how to apply these in different manners.
        </p>
        
        <p class="mb-4">
          Even the most intimidating mathematical notation—differential equations, 
          integrals, matrix operations—ultimately reduces to combinations of these 
          basic operations. The symbols are just shorthand.
        </p>

        <CodeExample
          :code="basicOperatorsCode"
          language="python"
          title="basic_operators.py"
        />
      </ContentSection>

      <!-- Summation -->
      <ContentSection id="summation" title="Summation: ∑ = for loop" icon="fa-solid fa-sigma">
        <p class="mb-4">
          That big and scary-looking <MathBlock formula="\Sigma" /> is basically just 
          a for loop adding all the variables together:
        </p>
        
        <MathBlock formula="\sum_{i=1}^{n} i = 1 + 2 + 3 + \cdots + n = \frac{n(n+1)}{2}" display />
        
        <p class="mb-4">
          The notation <MathBlock formula="\sum_{i=1}^{n}" /> means: "for i from 1 to n, 
          add up all the values."
        </p>

        <CodeExample
          :code="summationCode"
          language="python"
          title="summation.py"
          line-numbers
        />
      </ContentSection>

      <!-- Product -->
      <ContentSection id="product" title="Product: ∏ = multiply loop" icon="fa-solid fa-xmark">
        <p class="mb-4">
          Similarly, <MathBlock formula="\Pi" /> (capital pi) means "multiply them all together":
        </p>
        
        <MathBlock formula="\prod_{i=1}^{n} i = 1 \times 2 \times 3 \times \cdots \times n = n!" display />
        
        <p class="mb-4">
          This is exactly factorial! The product of all integers from 1 to n.
        </p>

        <CodeExample
          :code="productCode"
          language="python"
          title="product.py"
          collapsible
        />
      </ContentSection>

      <!-- Differential Equations -->
      <ContentSection 
        id="differential" 
        title="Differential Equations — Broken Down"
        icon="fa-solid fa-chart-line"
        collapsible
      >
        <p class="mb-4">
          <em>"But what about differential equations?"</em> — Great question! Let's see how 
          even these scary-looking equations reduce to simple arithmetic.
        </p>
        
        <p class="mb-4">A simple differential equation:</p>
        <MathBlock formula="\frac{dy}{dx} = 2x" display />
        
        <p class="mb-4">
          This says: "the rate of change of <MathBlock formula="y" /> with respect to 
          <MathBlock formula="x" /> equals <MathBlock formula="2x" />."
        </p>
        
        <p class="mb-4">
          We can solve this step-by-step using <strong>Euler's method</strong>. The key 
          insight is that <MathBlock formula="\frac{dy}{dx}" /> is just a ratio of tiny 
          changes. If we take small steps:
        </p>
        
        <MathBlock formula="y_{new} = y_{old} + h \cdot f(x, y)" display />
        
        <p class="mb-4">
          Where <MathBlock formula="h" /> is a small step size. Just multiplication and 
          addition!
        </p>

        <CodeExample
          :code="eulerMethodCode"
          language="python"
          title="Euler's Method"
          line-numbers
        />

        <div class="mt-6 p-4 bg-math-highlight rounded-lg">
          <p class="font-medium text-text-primary mb-2">
            <i class="fa-solid fa-key mr-2 text-primary" aria-hidden="true" />
            Key Takeaway
          </p>
          <p class="text-text-secondary">
            Even differential equations—at their core—can be solved step-by-step using 
            just addition, subtraction, multiplication, and division. The "calculus" is 
            really just a clever way of organizing these basic operations.
          </p>
        </div>
      </ContentSection>

      <!-- MATLAB joke -->
      <ContentSection 
        id="matlab" 
        title="Why not just use MATLAB?"
        icon="fa-solid fa-face-grin-wink"
        collapsible
        :default-expanded="false"
      >
        <p class="text-text-muted italic">
          MATLAB is an illegitimate programming language and it knows it!
        </p>
        <p class="mt-2 text-sm text-text-muted">
          (Just kidding. Use whatever tools work for you. But Python is pretty great.)
        </p>
      </ContentSection>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
```

### 2. Update NumberTypesView Placeholder
Update `src/views/basics/NumberTypesView.vue`:

```vue
<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'

const relatedTopics = [
  { title: 'Foundations', path: '/basics/foundations', description: 'Core concepts' },
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Notation guide' },
]

const numberSets = [
  { 
    symbol: '\\mathbb{N}', 
    name: 'Natural Numbers', 
    description: 'Counting numbers: 1, 2, 3, ...',
    python: 'n > 0 and n == int(n)',
    examples: '1, 2, 3, 100, 1000000',
  },
  { 
    symbol: '\\mathbb{Z}', 
    name: 'Integers', 
    description: 'Whole numbers including negatives',
    python: 'n == int(n)',
    examples: '-5, -1, 0, 1, 42',
  },
  { 
    symbol: '\\mathbb{Q}', 
    name: 'Rational Numbers', 
    description: 'Numbers that can be written as fractions',
    python: 'from fractions import Fraction',
    examples: '1/2, -3/4, 0.25, 7',
  },
  { 
    symbol: '\\mathbb{R}', 
    name: 'Real Numbers', 
    description: 'All numbers on the number line',
    python: 'float or int',
    examples: 'π, √2, -3.14, 0',
  },
  { 
    symbol: '\\mathbb{C}', 
    name: 'Complex Numbers', 
    description: 'Numbers with real and imaginary parts',
    python: 'complex(a, b) or a + bj',
    examples: '3+4i, -1+0i, 2i',
  },
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
          previous one, adding new capabilities:
        </p>
        
        <MathBlock 
          formula="\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}" 
          display 
        />
        
        <p class="mt-4">
          Natural numbers are inside integers, which are inside rationals, and so on. 
          This hierarchy maps surprisingly well to programming types!
        </p>
      </ContentSection>

      <ContentSection id="sets" title="Number Sets" icon="fa-solid fa-shapes">
        <div class="space-y-4">
          <div 
            v-for="set in numberSets" 
            :key="set.name"
            class="card p-4"
          >
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
                <p class="text-xs font-mono text-primary mt-1">
                  <span class="text-text-muted">Python:</span> {{ set.python }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection id="widget" title="Interactive Explorer" icon="fa-solid fa-sliders">
        <div class="card p-6 bg-surface-alt text-center">
          <i class="fa-solid fa-wrench text-4xl text-text-muted mb-4" aria-hidden="true" />
          <p class="text-text-muted">
            NumberTypeExplorer widget coming in Phase 4!
          </p>
          <p class="text-sm text-text-muted mt-2">
            Enter any number and see which sets it belongs to.
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

### 3. Run Full Verification

Execute all verification commands:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Run tests (should still pass)
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### 4. Manual Testing Checklist

#### MathBlock Component
- [ ] Inline formulas render within text flow
- [ ] Display formulas are centered
- [ ] Invalid formulas show error gracefully
- [ ] Long formulas scroll horizontally on mobile
- [ ] Theme change doesn't affect math rendering

#### CodeExample Component
- [ ] Syntax highlighting matches theme (light/dark)
- [ ] Copy button copies code to clipboard
- [ ] Copy button shows brief checkmark feedback
- [ ] Line numbers display when enabled
- [ ] Collapsible code blocks expand/collapse
- [ ] Code scrolls horizontally when too wide

#### CollapsiblePanel / ContentSection
- [ ] Click header to expand/collapse
- [ ] Chevron rotates on state change
- [ ] Keyboard navigation works (Enter/Space)
- [ ] Anchor links work (#summation, #differential)
- [ ] Reduced motion respects user preference

#### TabGroup Component
- [ ] Clicking tabs switches content
- [ ] Arrow keys navigate between tabs
- [ ] Home/End keys work
- [ ] Active tab has visual indicator
- [ ] Tab panels are properly associated

#### SymbolTable Component
- [ ] Desktop shows table layout
- [ ] Mobile shows card layout
- [ ] Search filters results in real-time
- [ ] Clear button resets search
- [ ] Empty state shown when no results
- [ ] Screen reader announces result count

#### Integration
- [ ] All three view pages render correctly
- [ ] Navigation between pages works
- [ ] Theme toggle affects all components
- [ ] No console errors
- [ ] Performance is acceptable

### 5. Update Phase 3 Documentation

Add to `docs/PHASE_3_COMPLETE.md`:

```markdown
# Phase 3: Content Components - Complete

## Summary
Phase 3 added the core content components for displaying educational material.

## Components Added

### Content Components (`src/components/content/`)
- **MathBlock**: KaTeX-powered math formula rendering
- **CodeExample**: Shiki syntax highlighting with copy, line numbers, collapsible
- **ContentSection**: Collapsible content sections with anchor links
- **SymbolTable**: Searchable, responsive symbol reference tables

### UI Components (`src/components/ui/`)
- **CollapsiblePanel**: Reusable expand/collapse panel
- **TabGroup**: Accessible tabbed interface
- **CopyButton**: Copy-to-clipboard with feedback
- **SearchInput**: Debounced search input

### Composables (`src/composables/`)
- **useClipboard**: Clipboard API wrapper
- **useHighlighter**: Shiki highlighter singleton
- **useMath**: LaTeX validation utilities

### Data (`src/data/symbols/`)
- Comprehensive symbol data split by category
- 80+ math symbols with Python equivalents
- 24 Greek letters with common uses

## Dependencies Added
- `katex@0.16` - Math rendering
- `shiki@1` - Syntax highlighting

## Views Updated
- **FoundationsView**: Full content with code examples, math, collapsible sections
- **SymbolsView**: Tabbed symbol tables with search
- **NumberTypesView**: Number set overview with placeholder for widget

## Next Phase
Phase 4 will add interactive widgets:
- NumberTypeExplorer
- Additional visualizations
- Content migration from archive
```

## Success Criteria
- [ ] All Phase 3 components working together
- [ ] FoundationsView has comprehensive content
- [ ] SymbolsView displays all symbol categories
- [ ] NumberTypesView shows number hierarchy
- [ ] All manual testing checklist items pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All existing tests still pass
- [ ] Production build succeeds
- [ ] No console errors in browser

## Phase 3 Complete! 🎉

After completing this increment, Phase 3 is complete. The project now has:

- ✅ KaTeX math rendering
- ✅ Shiki syntax highlighting
- ✅ Collapsible content sections
- ✅ Accessible tabbed interface
- ✅ Searchable symbol tables
- ✅ Comprehensive symbol data
- ✅ Rich content in views

## Next Phase

Phase 4 will focus on **Interactive Widgets**:
- NumberTypeExplorer widget
- Additional interactive visualizations
- Content migration from archive folder
- Performance optimization
