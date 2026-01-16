# Phase 6: Basics Completion + Testing Infrastructure

## Context

This is the SnakeMath project, an educational math site for programmers built with Vue 3 + TypeScript + Tailwind CSS. Phase 5 completed the Algebra section with the SummationExplorer widget. Phase 6 completes the Basics section and adds E2E testing infrastructure.

**Project Philosophy**: Mathematical notation is just code programmers already know.

### Key Files to Reference
- `CLAUDE.md` — Project guidelines and patterns
- `docs/PHASE_5_COMPLETE.md` — Previous phase completion
- `docs/current_state.md` — Current project state
- `docs/decisions.md` — Architectural decisions (D-001 to D-050)
- `docs/ROADMAP.md` — Project roadmap
- `docs/archive_overview/archive_*.md` — Reference content from previous implementation

### Existing Patterns to Follow
- Widget architecture: `src/components/widgets/SummationExplorer.vue`
- URL state sync: `src/composables/useUrlState.ts`
- Content components: `src/components/content/`
- View structure: `src/views/algebra/SummationView.vue`
- Math utilities: `src/utils/math/`

---

## Phase 6 Increments

### 6A: Playwright Setup & Configuration

**Goal**: Establish E2E testing infrastructure with Playwright.

**Deliverables**:
1. Install Playwright: `npm install -D @playwright/test`
2. `playwright.config.ts` — Configuration file
3. `e2e/` — Test directory structure
4. Update `package.json` with test scripts
5. Update or create `.github/workflows/test.yml` for CI

**playwright.config.ts**:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
```

**package.json scripts**:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

**Directory structure**:
```
e2e/
├── navigation.spec.ts
├── basics/
│   └── number-types.spec.ts
├── algebra/
│   └── summation.spec.ts
└── accessibility/
    └── audit.spec.ts
```

**CI Workflow** (`.github/workflows/test.yml`):
```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

### 6B: E2E Tests for Existing Widgets

**Goal**: Cover critical user flows for NumberTypeExplorer and SummationExplorer.

**Pre-requisite**: Add `data-testid` attributes to widget components (see 6G for full list).

**e2e/navigation.spec.ts**:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Site Navigation', () => {
  test('homepage loads and has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/SnakeMath/)
  })

  test('can navigate to Basics section', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Basics')
    await expect(page).toHaveURL('/basics')
  })

  test('can navigate to Algebra section', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Algebra')
    await expect(page).toHaveURL('/algebra')
  })

  test('breadcrumbs show correct path', async ({ page }) => {
    await page.goto('/basics/number-types')
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]')
    await expect(breadcrumbs).toContainText('Home')
    await expect(breadcrumbs).toContainText('Basics')
    await expect(breadcrumbs).toContainText('Number Types')
  })

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Menu should be hidden initially
    const menu = page.locator('[data-testid="mobile-menu"]')
    await expect(menu).not.toBeVisible()
    
    // Open menu
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(menu).toBeVisible()
    
    // Close menu
    await page.click('[data-testid="mobile-menu-close"]')
    await expect(menu).not.toBeVisible()
  })
})
```

**e2e/basics/number-types.spec.ts**:
```typescript
import { test, expect } from '@playwright/test'

test.describe('NumberTypeExplorer Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/basics/number-types')
  })

  test('classifies natural numbers correctly', async ({ page }) => {
    await page.fill('[data-testid="number-input"]', '42')
    
    // Check set membership indicators
    await expect(page.locator('[data-testid="set-natural"]')).toHaveAttribute('data-member', 'true')
    await expect(page.locator('[data-testid="set-integer"]')).toHaveAttribute('data-member', 'true')
    await expect(page.locator('[data-testid="set-rational"]')).toHaveAttribute('data-member', 'true')
    await expect(page.locator('[data-testid="set-real"]')).toHaveAttribute('data-member', 'true')
  })

  test('classifies negative integers correctly', async ({ page }) => {
    await page.fill('[data-testid="number-input"]', '-5')
    
    await expect(page.locator('[data-testid="set-natural"]')).toHaveAttribute('data-member', 'false')
    await expect(page.locator('[data-testid="set-integer"]')).toHaveAttribute('data-member', 'true')
  })

  test('classifies complex numbers correctly', async ({ page }) => {
    await page.fill('[data-testid="number-input"]', '3+4i')
    
    await expect(page.locator('[data-testid="set-real"]')).toHaveAttribute('data-member', 'false')
    await expect(page.locator('[data-testid="set-complex"]')).toHaveAttribute('data-member', 'true')
  })

  test('URL state loads correctly', async ({ page }) => {
    await page.goto('/basics/number-types?n=42')
    await expect(page.locator('[data-testid="number-input"]')).toHaveValue('42')
  })

  test('URL updates when input changes', async ({ page }) => {
    await page.fill('[data-testid="number-input"]', '99')
    // Wait for debounced URL update
    await page.waitForTimeout(400)
    await expect(page).toHaveURL(/n=99/)
  })

  test('visualization toggle works', async ({ page }) => {
    const numberLine = page.locator('[data-testid="number-line"]')
    const toggle = page.locator('[data-testid="toggle-number-line"]')
    
    // Assuming visible by default
    await expect(numberLine).toBeVisible()
    
    // Toggle off
    await toggle.click()
    await expect(numberLine).not.toBeVisible()
    
    // Toggle on
    await toggle.click()
    await expect(numberLine).toBeVisible()
  })
})
```

**e2e/algebra/summation.spec.ts**:
```typescript
import { test, expect } from '@playwright/test'

test.describe('SummationExplorer Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/algebra/summation')
  })

  test('displays correct result for arithmetic sum', async ({ page }) => {
    // Default should be arithmetic preset
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '10')
    
    // Sum of 1 to 10 = 55
    await expect(page.locator('[data-testid="summation-total"]')).toContainText('55')
  })

  test('preset selector changes calculation', async ({ page }) => {
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '5')
    
    // Select squares preset
    await page.selectOption('[data-testid="preset-selector"]', 'squares')
    
    // Sum of squares 1+4+9+16+25 = 55
    await expect(page.locator('[data-testid="summation-total"]')).toContainText('55')
  })

  test('bar chart shows correct number of bars', async ({ page }) => {
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '5')
    
    const bars = page.locator('[data-testid="bar-chart"] rect[data-testid^="bar-"]')
    await expect(bars).toHaveCount(5)
  })

  test('animation button triggers sequential bar display', async ({ page }) => {
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '5')
    
    // Reset to 0 visible bars first (if there's a reset mechanism)
    const animateButton = page.locator('[data-testid="animate-button"]')
    await animateButton.click()
    
    // After animation starts, bars should appear
    // Wait for animation to progress
    await page.waitForTimeout(500)
    
    // At least some bars should be visible
    const visibleBars = page.locator('[data-testid="bar-chart"] rect[data-testid^="bar-"]:visible')
    const count = await visibleBars.count()
    expect(count).toBeGreaterThan(0)
  })

  test('code parallel shows Python code', async ({ page }) => {
    const codeBlock = page.locator('[data-testid="code-parallel-python"]')
    await expect(codeBlock).toContainText('for')
    await expect(codeBlock).toContainText('range')
  })

  test('URL state loads correctly', async ({ page }) => {
    await page.goto('/algebra/summation?preset=squares&start=1&end=10')
    
    await expect(page.locator('[data-testid="preset-selector"]')).toHaveValue('squares')
    await expect(page.locator('[data-testid="bounds-start"]')).toHaveValue('1')
    await expect(page.locator('[data-testid="bounds-end"]')).toHaveValue('10')
    
    // Sum of squares 1 to 10 = 385
    await expect(page.locator('[data-testid="summation-total"]')).toContainText('385')
  })

  test('formula comparison shows matching results', async ({ page }) => {
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '10')
    
    // Both loop and formula should show same result
    const comparison = page.locator('[data-testid="formula-comparison"]')
    await expect(comparison).toContainText('55')
  })
})
```

---

### 6C: Accessibility Audit Integration

**Goal**: Automated WCAG compliance checking with axe-core.

**Install**: `npm install -D @axe-core/playwright`

**e2e/accessibility/audit.spec.ts**:
```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const pagesToAudit = [
  { name: 'Home', path: '/' },
  { name: 'Basics Index', path: '/basics' },
  { name: 'Number Types', path: '/basics/number-types' },
  { name: 'Algebra Index', path: '/algebra' },
  { name: 'Summation', path: '/algebra/summation' },
]

test.describe('Accessibility Audits', () => {
  for (const { name, path } of pagesToAudit) {
    test(`${name} page passes WCAG 2.1 AA`, async ({ page }) => {
      await page.goto(path)
      
      // Wait for any dynamic content to load
      await page.waitForLoadState('networkidle')
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      // Log violations for debugging
      if (results.violations.length > 0) {
        console.log(`Accessibility violations on ${name}:`)
        results.violations.forEach(v => {
          console.log(`  - ${v.id}: ${v.description}`)
          v.nodes.forEach(n => console.log(`    ${n.html}`))
        })
      }
      
      expect(results.violations).toEqual([])
    })
  }

  test('Number Types widget maintains focus management', async ({ page }) => {
    await page.goto('/basics/number-types')
    
    // Tab to input
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to reach input via keyboard
    const input = page.locator('[data-testid="number-input"]')
    await expect(input).toBeFocused()
  })

  test('Summation widget is keyboard navigable', async ({ page }) => {
    await page.goto('/algebra/summation')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    
    // Should be able to reach preset selector
    const selector = page.locator('[data-testid="preset-selector"]')
    await expect(selector).toBeFocused()
  })
})
```

---

### 6D: Functions Content + SimpleFunctionDemo Widget

**Goal**: Complete Functions content page with an interactive function demonstrator.

**Deliverables**:
1. `src/views/basics/FunctionsView.vue` — Content page
2. `src/components/widgets/SimpleFunctionDemo.vue` — Interactive widget
3. Router update
4. Navigation update

**SimpleFunctionDemo Widget**:

A focused widget demonstrating how variables work in functions:
- Preset functions: linear (2x + 3), quadratic (x²), absolute (|x|)
- Slider for x value (-10 to 10)
- Step-by-step calculation display
- Simple coordinate point visualization (optional)

**src/components/widgets/SimpleFunctionDemo.vue**:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { MathBlock } from '@/components/content'

interface FunctionPreset {
  id: string
  name: string
  latex: string
  python: string
  evaluate: (x: number) => number
}

const presets: FunctionPreset[] = [
  {
    id: 'linear',
    name: 'Linear: f(x) = 2x + 3',
    latex: 'f(x) = 2x + 3',
    python: 'def f(x): return 2 * x + 3',
    evaluate: (x) => 2 * x + 3
  },
  {
    id: 'quadratic',
    name: 'Quadratic: f(x) = x²',
    latex: 'f(x) = x^2',
    python: 'def f(x): return x ** 2',
    evaluate: (x) => x * x
  },
  {
    id: 'absolute',
    name: 'Absolute: f(x) = |x|',
    latex: 'f(x) = |x|',
    python: 'def f(x): return abs(x)',
    evaluate: (x) => Math.abs(x)
  },
  {
    id: 'reciprocal',
    name: 'Reciprocal: f(x) = 1/x',
    latex: 'f(x) = \\frac{1}{x}',
    python: 'def f(x): return 1 / x',
    evaluate: (x) => x !== 0 ? 1 / x : NaN
  }
]

const selectedPresetId = ref('linear')
const xValue = ref(5)

const selectedPreset = computed(() => 
  presets.find(p => p.id === selectedPresetId.value) ?? presets[0]
)

const result = computed(() => selectedPreset.value.evaluate(xValue.value))

const isValidResult = computed(() => 
  Number.isFinite(result.value)
)

const substitutionLatex = computed(() => {
  const x = xValue.value
  const y = result.value
  const preset = selectedPreset.value
  
  if (preset.id === 'linear') {
    return `f(${x}) = 2(${x}) + 3 = ${2 * x} + 3 = ${y}`
  } else if (preset.id === 'quadratic') {
    return `f(${x}) = (${x})^2 = ${y}`
  } else if (preset.id === 'absolute') {
    return `f(${x}) = |${x}| = ${y}`
  } else if (preset.id === 'reciprocal') {
    if (x === 0) return `f(0) = \\frac{1}{0} = \\text{undefined}`
    return `f(${x}) = \\frac{1}{${x}} = ${y.toFixed(4)}`
  }
  return ''
})
</script>

<template>
  <div class="function-demo rounded-lg border border-border bg-surface p-4 md:p-6">
    <div class="space-y-6">
      <!-- Function Selector -->
      <div>
        <label for="function-select" class="block text-sm font-medium text-secondary mb-2">
          Choose a function:
        </label>
        <select
          id="function-select"
          v-model="selectedPresetId"
          data-testid="function-selector"
          class="w-full rounded-md border border-border bg-surface px-3 py-2"
        >
          <option v-for="preset in presets" :key="preset.id" :value="preset.id">
            {{ preset.name }}
          </option>
        </select>
      </div>

      <!-- Function Display -->
      <div class="text-center py-4 bg-muted/30 rounded-lg">
        <MathBlock :latex="selectedPreset.latex" />
      </div>

      <!-- X Value Slider -->
      <div>
        <label for="x-slider" class="block text-sm font-medium text-secondary mb-2">
          Choose a value for x:
        </label>
        <div class="flex items-center gap-4">
          <input
            id="x-slider"
            v-model.number="xValue"
            type="range"
            min="-10"
            max="10"
            step="1"
            data-testid="x-slider"
            class="flex-1"
          />
          <span 
            class="w-12 text-center font-mono text-lg"
            data-testid="x-value"
          >
            {{ xValue }}
          </span>
        </div>
      </div>

      <!-- Calculation Steps -->
      <div class="border-t border-border pt-4">
        <h4 class="text-sm font-medium text-secondary mb-3">Calculation:</h4>
        <div class="text-center py-3 bg-muted/30 rounded-lg">
          <MathBlock :latex="substitutionLatex" />
        </div>
      </div>

      <!-- Result -->
      <div class="text-center">
        <div class="text-sm text-secondary mb-1">Result:</div>
        <div 
          class="text-3xl font-bold"
          :class="isValidResult ? 'text-primary' : 'text-red-500'"
          data-testid="function-result"
        >
          {{ isValidResult ? result : 'undefined' }}
        </div>
      </div>

      <!-- Python Code -->
      <div class="bg-gray-900 rounded-lg p-4">
        <div class="text-xs text-gray-400 mb-2">Python:</div>
        <code class="text-green-400 font-mono text-sm">{{ selectedPreset.python }}</code>
        <div class="text-gray-400 font-mono text-sm mt-1">
          >>> f({{ xValue }})
          <br />
          {{ isValidResult ? result : 'ZeroDivisionError' }}
        </div>
      </div>
    </div>
  </div>
</template>
```

**FunctionsView.vue Content Sections**:

1. **What is a Function?**
   - The "machine" or "black box" analogy
   - Input → Process → Output
   - f(x) notation explained

2. **Try It: Interactive Function Demo**
   - SimpleFunctionDemo widget
   - Explanation of what's happening

3. **Function Notation**
   - f(x) vs y = ...
   - Multiple variables: f(x, y)
   - Function vs equation

4. **Functions in Python**
   - `def` keyword
   - Parameters and return values
   - Lambda functions

5. **Function Composition**
   - f(g(x)) concept
   - Nested function calls
   - Code example

6. **Why Functions Matter**
   - Reusability
   - Abstraction
   - Mathematical modeling

**Router Update** (`src/router/index.ts`):
```typescript
{
  path: 'functions',
  name: 'functions',
  component: () => import('@/views/basics/FunctionsView.vue'),
}
```

**Navigation Update** (`src/data/navigation.ts`):
Add to Basics children:
```typescript
{
  title: 'Functions',
  path: '/basics/functions',
  description: 'Input, output, and the f(x) notation',
  faIcon: 'fa-solid fa-arrow-right-arrow-left',
}
```

---

### 6E: Variables & Expressions Content

**Goal**: Complete Variables & Expressions content page.

**Deliverables**:
1. `src/views/basics/VariablesView.vue`
2. Router update
3. Navigation update

**Content Sections**:

1. **What is a Variable?**
   - Named storage for values
   - Math: "let x = 5"
   - Python: `x = 5`
   - The assignment concept

2. **Variable Naming**
   - Math conventions (x, y, z, Greek letters)
   - Python conventions (snake_case, descriptive names)
   - Reserved words

3. **Expressions**
   - Combining variables and operators
   - `2 * x + 3`
   - Evaluation order (preview of Order of Operations)

4. **Substitution**
   - "Plugging in" values
   - Step-by-step evaluation
   - Code example showing the process

5. **Multiple Variables**
   - Systems of equations preview
   - Python tuple unpacking
   - Practical example (geometry formulas)

6. **Python Variable Types**
   - Dynamic typing
   - type() function
   - Connection to Number Types

**Code Examples**:
```python
# Variable assignment
x = 5
y = 3
result = 2 * x + y  # 13

# Substitution step-by-step
# Given: 2x + 3 where x = 5
# Step 1: Replace x with 5
# Step 2: 2(5) + 3
# Step 3: 10 + 3
# Step 4: 13

# Multiple assignment
width, height = 10, 5
area = width * height  # 50

# Swap trick
a, b = 1, 2
a, b = b, a  # Now a=2, b=1
```

---

### 6F: Order of Operations Content

**Goal**: Complete Order of Operations content page.

**Deliverables**:
1. `src/views/basics/OrderOfOperationsView.vue`
2. Router update
3. Navigation update

**Content Sections**:

1. **Why Order Matters**
   - Ambiguity example: `2 + 3 * 4`
   - Different results with different orders
   - The need for rules

2. **PEMDAS / BODMAS**
   - Parentheses / Brackets
   - Exponents / Orders
   - Multiplication & Division (left to right)
   - Addition & Subtraction (left to right)

3. **Precedence in Python**
   - Operator precedence table
   - Same rules as math (mostly)
   - Using SymbolTable component for the table

4. **Parentheses Override**
   - Forcing evaluation order
   - Clarity over cleverness
   - Best practice: use parentheses when in doubt

5. **Common Mistakes**
   - Exponentiation associativity: `2 ** 3 ** 2` = 512, not 64
   - Unary minus: `-3 ** 2` = -9 in Python
   - Division chains

6. **Associativity**
   - Left-to-right: `10 - 5 - 2` = 3
   - Right-to-left: `2 ** 3 ** 2` = 512
   - When it matters

**Operator Precedence Table** (use SymbolTable pattern):
```typescript
const operatorPrecedence = [
  { operator: '**', name: 'Exponentiation', precedence: 'Highest', associativity: 'Right' },
  { operator: '+x, -x', name: 'Unary plus/minus', precedence: 'High', associativity: 'Right' },
  { operator: '*, /, //, %', name: 'Multiplication, Division', precedence: 'Medium', associativity: 'Left' },
  { operator: '+, -', name: 'Addition, Subtraction', precedence: 'Low', associativity: 'Left' },
]
```

**Code Examples**:
```python
# Order matters!
result1 = 2 + 3 * 4    # 14 (multiplication first)
result2 = (2 + 3) * 4  # 20 (parentheses first)

# Exponentiation is RIGHT-associative
result3 = 2 ** 3 ** 2  # 512
# Evaluated as: 2 ** (3 ** 2) = 2 ** 9 = 512
# NOT: (2 ** 3) ** 2 = 8 ** 2 = 64

# Unary minus gotcha
result4 = -3 ** 2      # -9 in Python!
# Evaluated as: -(3 ** 2) = -9
# Use (-3) ** 2 for 9

# Left-to-right for same precedence
result5 = 10 - 5 - 2   # 3
# Evaluated as: (10 - 5) - 2 = 5 - 2 = 3
```

---

### 6G: Data Types Section + Component Polish

**Goal**: Extend NumberTypesView with programming data types section; add data-testid attributes throughout.

**Part 1: Data Types Section**

Add new section to `NumberTypesView.vue` after the existing content:

**Section: "From Math to Code: Data Types"**

Content:
1. **Mathematical Sets → Programming Types**
   - ℕ (Natural) → `int` (positive)
   - ℤ (Integer) → `int`
   - ℚ (Rational) → `float` (approximation!)
   - ℝ (Real) → `float`
   - ℂ (Complex) → `complex`

2. **Python's Type System**
   - `type()` function
   - Dynamic typing
   - Type conversion: `int()`, `float()`, `complex()`

3. **Precision Warning**
   - Floats are approximations
   - `0.1 + 0.2 != 0.3` example
   - When it matters (finance, science)

4. **The `Decimal` Module**
   - For exact decimal arithmetic
   - When to use it

**Code Examples**:
```python
# Mathematical type → Python type
natural = 42        # int
integer = -5        # int  
rational = 0.5      # float (approximation of 1/2)
real = 3.14159      # float (approximation of π)
imaginary = 3 + 4j  # complex

# Check the type
print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type(3 + 4j))    # <class 'complex'>

# The infamous precision issue
print(0.1 + 0.2)       # 0.30000000000000004
print(0.1 + 0.2 == 0.3)  # False!

# Use Decimal for exact arithmetic
from decimal import Decimal
print(Decimal('0.1') + Decimal('0.2'))  # 0.3
```

**Part 2: Add data-testid Attributes**

Add `data-testid` attributes to all interactive elements in existing widgets for E2E testing.

**NumberTypeExplorer and children**:
```vue
<!-- NumberInput.vue -->
<input data-testid="number-input" ... />

<!-- SetMembershipDisplay.vue -->
<div 
  v-for="set in sets"
  :data-testid="`set-${set.symbol.toLowerCase()}`"
  :data-member="set.isMember"
>

<!-- NumberLine.vue -->
<svg data-testid="number-line" ... />

<!-- SetVennDiagram.vue -->
<svg data-testid="venn-diagram" ... />

<!-- VisualizationToggle.vue -->
<button data-testid="toggle-number-line" ... />
<button data-testid="toggle-venn-diagram" ... />
```

**SummationExplorer and children**:
```vue
<!-- PresetSelector.vue -->
<select data-testid="preset-selector" ... />

<!-- BoundsInput.vue -->
<input data-testid="bounds-start" ... />
<input data-testid="bounds-end" ... />

<!-- SummationResult.vue -->
<div data-testid="summation-total" ... />
<div data-testid="summation-terms" ... />

<!-- SummationBarChart.vue -->
<svg data-testid="bar-chart" ... />
<rect 
  v-for="(bar, i) in bars" 
  :data-testid="`bar-${i}`" 
  ... 
/>
<button data-testid="animate-button" ... />

<!-- SummationCodeParallel.vue -->
<div data-testid="code-parallel-python" ... />
<div data-testid="code-parallel-javascript" ... />

<!-- FormulaComparison.vue -->
<div data-testid="formula-comparison" ... />
```

**Layout Components**:
```vue
<!-- MobileMenu.vue -->
<div data-testid="mobile-menu" ... />
<button data-testid="mobile-menu-button" ... />
<button data-testid="mobile-menu-close" ... />
```

**Part 3: Component Polish**

Review and apply consistent patterns:

1. **Collapsible sections**: Ensure intro sections are NOT collapsible, deeper sections ARE
2. **JSDoc comments**: Add to widget props interfaces
3. **Timer cleanup**: Verify all animations clean up on unmount
4. **Focus management**: Ensure keyboard navigation works in all widgets

---

## Technical Constraints

### Must Follow
- All components use `<script setup lang="ts">`
- Props defined with TypeScript interfaces
- Emit types defined with `defineEmits<{...}>()`
- No `any` types
- All new utilities have co-located test files
- Use existing components: MathBlock, CodeExample, ContentSection, TopicPage
- Tailwind for all styling

### Testing Requirements
- E2E tests must pass locally before committing
- Accessibility audits must pass (0 violations)
- Existing 105 unit tests must still pass
- Target: ~15-20 E2E tests covering critical flows

### Accessibility Requirements
- All interactive elements keyboard accessible
- ARIA labels on visualizations and toggles
- Focus visible states
- `data-testid` attributes don't affect accessibility

---

## File Structure After Phase 6

```
e2e/                                    # NEW
├── navigation.spec.ts
├── basics/
│   └── number-types.spec.ts
├── algebra/
│   └── summation.spec.ts
└── accessibility/
    └── audit.spec.ts

src/
├── components/widgets/
│   ├── SimpleFunctionDemo.vue          # NEW
│   └── ... (existing, with data-testid added)
├── views/basics/
│   ├── BasicsIndex.vue
│   ├── FoundationsView.vue
│   ├── SymbolsView.vue
│   ├── NumberTypesView.vue             # UPDATED: Data Types section
│   ├── FunctionsView.vue               # NEW
│   ├── VariablesView.vue               # NEW
│   └── OrderOfOperationsView.vue       # NEW

playwright.config.ts                    # NEW
.github/workflows/test.yml              # NEW or UPDATED
```

---

## Verification Checklist

After each increment, verify:
```bash
npm run type-check   # No TypeScript errors
npm run lint         # Only expected v-html warnings
npm run test         # All unit tests pass
npm run build        # Production build succeeds
npm run test:e2e     # All E2E tests pass (after 6A)
```

Before marking Phase 6 complete:
- [ ] Playwright configured and running locally
- [ ] E2E tests pass for navigation
- [ ] E2E tests pass for NumberTypeExplorer
- [ ] E2E tests pass for SummationExplorer
- [ ] Accessibility audits pass for all pages (0 violations)
- [ ] CI runs E2E tests successfully
- [ ] Functions content page complete with SimpleFunctionDemo
- [ ] Variables & Expressions content page complete
- [ ] Order of Operations content page complete
- [ ] Data Types section added to Number Types page
- [ ] All widgets have data-testid attributes
- [ ] Navigation shows all Basics topics
- [ ] All 105+ unit tests still pass
- [ ] Build succeeds without errors

---

## Implementation Order

Execute increments in order: 6A → 6B → 6C → 6D → 6E → 6F → 6G

Each increment should be fully working before proceeding. Commit after each increment with message format: `feat(phase6): 6X - description`.

**Recommended approach**:
1. Start with 6A (Playwright setup) — establishes testing foundation
2. Add data-testid attributes early (part of 6G, but do it before 6B)
3. Then 6B/6C for testing existing widgets
4. Content pages (6D, 6E, 6F) can be done in parallel
5. Final polish in 6G

Start with 6A: Playwright Setup & Configuration.
