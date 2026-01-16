# Phase 8: Exponentials & Logarithms

## Overview

**Goal**: Connect exponential and logarithmic functions to algorithm analysis, making the math directly relevant to programmers.

**Philosophy Alignment**: Logarithms are fundamental to algorithm complexity analysis—the reason binary search is O(log n), why balanced trees matter, and why exponential blowup makes brute-force algorithms impractical. This phase delivers programmer-relevant mathematics.

**Technical Foundation**: Reuses Phase 7's coordinate system components (CoordinateSystem, PlotCurve, PlotPoint, PlotLine) for function plotting.

---

## Decisions (Confirmed)

| ID | Decision | Rationale |
|----|----------|-----------|
| D-064 | Widget named "ExponentialExplorer" | Naming consistency with other explorers |
| D-065 | Presets + custom base input | Flexibility with quick-access buttons for e, 2, 10 |
| D-066 | Tabbed interface (Function Explorer \| Complexity Comparison) | Distinct features warrant separate focused views |
| D-067 | Core complexity set: O(1), O(log n), O(n), O(n log n), O(n²), O(2^n) | Six functions demonstrate patterns without overwhelming |
| D-068 | Single content page for exponentials + logarithms | Deeply connected topics; splitting fragments narrative |
| D-069 | Mobile optimization via responsive layouts | Foundation first; advanced gestures deferred |

---

## Increment 8A: Exponential/Log Math Utilities

**Effort**: 2-3 hours

### Objectives
1. Create utility functions for exponential and logarithmic calculations
2. Full TypeScript types
3. Comprehensive unit test coverage

### File: `src/utils/math/exponential.ts`

#### Types
```typescript
export interface ExponentialParams {
  base: number      // b in f(x) = a * b^x
  coefficient: number  // a in f(x) = a * b^x (default 1)
  exponent?: number    // For single evaluation
}

export interface LogarithmParams {
  base: number      // b in log_b(x)
  value: number     // x in log_b(x)
}

export interface GrowthDecayResult {
  type: 'growth' | 'decay'
  doublingTime: number | null    // Only for growth (base > 1)
  halfLife: number | null        // Only for decay (0 < base < 1)
  percentChangePerUnit: number   // (base - 1) * 100
}

export interface CompoundInterestParams {
  principal: number      // P
  rate: number           // r (as decimal, e.g., 0.05 for 5%)
  compoundingsPerYear: number  // n
  years: number          // t
}

export interface CompoundInterestResult {
  finalAmount: number    // A = P(1 + r/n)^(nt)
  totalInterest: number  // A - P
  effectiveRate: number  // (1 + r/n)^n - 1
}

export type ComplexityClass = 'constant' | 'logarithmic' | 'linear' | 'linearithmic' | 'quadratic' | 'exponential'

export interface ComplexityComparison {
  n: number
  values: Record<ComplexityClass, number>
}
```

#### Functions
```typescript
/**
 * Evaluate exponential function: f(x) = a * b^x
 */
export function evaluateExponential(base: number, x: number, coefficient?: number): number

/**
 * Evaluate logarithm: log_b(x)
 * Uses change of base formula: log_b(x) = ln(x) / ln(b)
 */
export function evaluateLogarithm(base: number, x: number): number

/**
 * Analyze growth/decay characteristics
 */
export function analyzeGrowthDecay(base: number): GrowthDecayResult

/**
 * Calculate doubling time for exponential growth
 * t_double = ln(2) / ln(base)
 */
export function calculateDoublingTime(base: number): number | null

/**
 * Calculate half-life for exponential decay
 * t_half = ln(0.5) / ln(base)
 */
export function calculateHalfLife(base: number): number | null

/**
 * Calculate compound interest
 * A = P(1 + r/n)^(nt)
 */
export function calculateCompoundInterest(params: CompoundInterestParams): CompoundInterestResult

/**
 * Calculate continuous compound interest
 * A = P * e^(rt)
 */
export function calculateContinuousInterest(principal: number, rate: number, years: number): number

/**
 * Compare algorithm complexities for given n
 */
export function compareComplexities(n: number): ComplexityComparison

/**
 * Generate points for plotting exponential function
 */
export function generateExponentialPoints(
  base: number,
  xMin: number,
  xMax: number,
  coefficient?: number,
  samples?: number
): Array<{ x: number; y: number }>

/**
 * Generate points for plotting logarithmic function
 */
export function generateLogarithmPoints(
  base: number,
  xMin: number,
  xMax: number,
  samples?: number
): Array<{ x: number; y: number }>

/**
 * Check if base is valid for exponential (positive, not 1)
 */
export function isValidExponentialBase(base: number): boolean

/**
 * Check if value is valid for logarithm (positive)
 */
export function isValidLogarithmInput(value: number): boolean
```

### Test Cases

#### evaluateExponential
- `evaluateExponential(2, 3)` → 8
- `evaluateExponential(10, 2)` → 100
- `evaluateExponential(Math.E, 1)` → Math.E
- `evaluateExponential(2, 0)` → 1
- `evaluateExponential(2, -1)` → 0.5
- `evaluateExponential(2, 3, 5)` → 40 (5 * 2^3)

#### evaluateLogarithm
- `evaluateLogarithm(10, 100)` → 2
- `evaluateLogarithm(2, 8)` → 3
- `evaluateLogarithm(Math.E, Math.E)` → 1
- `evaluateLogarithm(10, 1)` → 0
- `evaluateLogarithm(2, 0.5)` → -1

#### analyzeGrowthDecay
- Base 2: growth, doublingTime ≈ 1, halfLife null
- Base 0.5: decay, doublingTime null, halfLife = 1
- Base 1: throws error (not valid)
- Base e: growth, doublingTime ≈ 0.693

#### calculateCompoundInterest
- P=1000, r=0.05, n=12, t=10 → ~$1647.01
- P=1000, r=0.05, n=1, t=10 → ~$1628.89 (annual)
- P=1000, r=0.05, n=365, t=10 → ~$1648.66 (daily)

#### compareComplexities
- n=10: { constant: 1, logarithmic: ~3.32, linear: 10, linearithmic: ~33.2, quadratic: 100, exponential: 1024 }
- n=100: { constant: 1, logarithmic: ~6.64, linear: 100, linearithmic: ~664, quadratic: 10000, exponential: 1.27e30 }

### Success Criteria
- [ ] All functions implemented with correct math
- [ ] Edge cases handled (base ≤ 0, base = 1, log of non-positive)
- [ ] 100% test coverage
- [ ] JSDoc comments on all exports

### Constraints
- Pure functions only
- Handle floating-point precision gracefully
- Throw meaningful errors for invalid input
- Cap exponential results to avoid Infinity (or return Infinity with note)

---

## Increment 8B: ExponentialExplorer Widget

**Effort**: 5-6 hours

### Objectives
1. Build tabbed interface with Function Explorer and Complexity Comparison views
2. Implement function plotting using Phase 7 coordinate system
3. Create preset and custom base controls
4. URL state sync for shareable configurations

### Component Structure
```
src/components/widgets/ExponentialExplorer/
├── ExponentialExplorer.vue       # Main widget with tabs
├── FunctionExplorerTab.vue       # Exp/log function plotting
├── ComplexityComparisonTab.vue   # Algorithm complexity view
├── BaseSelector.vue              # Preset buttons + custom input
├── FunctionTypeSelector.vue      # Exponential vs Logarithm toggle
├── GrowthDecayPanel.vue          # Doubling time / half-life display
├── types.ts                      # Local types
├── presets.ts                    # Base presets and scenarios
└── useExponentialExplorer.ts     # Composable for state management
```

### Main Component: ExponentialExplorer.vue

#### Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────────┐
│ [Function Explorer] [Complexity Comparison]          (tabs)     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌── Function Explorer Tab ──────────────────────────────────┐ │
│  │                                                           │ │
│  │  ┌─────────────────────┐  ┌────────────────────────────┐ │ │
│  │  │                     │  │ Function Type:             │ │ │
│  │  │   [Coordinate       │  │ ○ Exponential  ○ Logarithm │ │ │
│  │  │    System with      │  ├────────────────────────────┤ │ │
│  │  │    Exp/Log Curve]   │  │ Base: [e] [2] [10] [___]   │ │ │
│  │  │                     │  ├────────────────────────────┤ │ │
│  │  │                     │  │ f(x) = 2^x                 │ │ │
│  │  │                     │  │                            │ │ │
│  │  │                     │  │ Growth Analysis:           │ │ │
│  │  │                     │  │ • Type: Growth             │ │ │
│  │  │                     │  │ • Doubling time: 1 unit    │ │ │
│  │  │                     │  │ • +100% per unit           │ │ │
│  │  └─────────────────────┘  └────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Layout (Mobile)
Stack vertically: Tabs → Graph → Controls → Analysis

### Tab 1: FunctionExplorerTab.vue

#### Features
1. **Function Type Toggle**: Switch between exponential (b^x) and logarithm (log_b(x))
2. **Base Selection**: 
   - Preset buttons: e (≈2.718), 2, 10
   - Custom input field with validation
3. **Graph Display**: 
   - Exponential: Plot y = b^x with appropriate y-range
   - Logarithm: Plot y = log_b(x) with x > 0
4. **Key Points Marked**:
   - Exponential: (0, 1), (1, b)
   - Logarithm: (1, 0), (b, 1)
5. **Growth/Decay Analysis Panel**:
   - Growth vs Decay classification
   - Doubling time (growth) or Half-life (decay)
   - Percent change per unit

#### Visual Elements on Graph
1. **Function curve**: Primary color
2. **Key points**: Labeled markers
3. **Asymptote**: Dashed line (y=0 for exp, x=0 for log)
4. **Reference point**: Where curve crosses y=1 (exp) or y=0 (log)

### Tab 2: ComplexityComparisonTab.vue

See Increment 8C for detailed specification.

### Presets (presets.ts)
```typescript
export interface BasePreset {
  id: string
  name: string
  value: number
  description: string
}

export const basePresets: BasePreset[] = [
  { id: 'e', name: 'e', value: Math.E, description: 'Natural base (≈2.718)' },
  { id: '2', name: '2', value: 2, description: 'Binary (CS applications)' },
  { id: '10', name: '10', value: 10, description: 'Common logarithm' },
]

export interface ScenarioPreset {
  id: string
  name: string
  description: string
  functionType: 'exponential' | 'logarithm'
  base: number
  category: 'math' | 'real-world'
}

export const scenarioPresets: ScenarioPreset[] = [
  // Math
  { id: 'natural-exp', name: 'Natural Exponential', description: 'e^x - fundamental in calculus', functionType: 'exponential', base: Math.E, category: 'math' },
  { id: 'binary-exp', name: 'Powers of 2', description: '2^x - binary doubling', functionType: 'exponential', base: 2, category: 'math' },
  { id: 'natural-log', name: 'Natural Logarithm', description: 'ln(x) - inverse of e^x', functionType: 'logarithm', base: Math.E, category: 'math' },
  { id: 'binary-log', name: 'Binary Logarithm', description: 'log₂(x) - bits needed', functionType: 'logarithm', base: 2, category: 'math' },
  
  // Real-world
  { id: 'decay', name: 'Radioactive Decay', description: 'Half-life example (0.5)^x', functionType: 'exponential', base: 0.5, category: 'real-world' },
  { id: 'population', name: 'Population Growth', description: '1.03^x - 3% annual growth', functionType: 'exponential', base: 1.03, category: 'real-world' },
  { id: 'ph-scale', name: 'pH Scale', description: 'log₁₀ for acidity', functionType: 'logarithm', base: 10, category: 'real-world' },
]
```

### URL State Sync
```typescript
// URL params: ?tab=function&type=exponential&base=2
// or: ?tab=complexity&n=100

const route = useRoute()
const router = useRouter()

// State
const activeTab = ref<'function' | 'complexity'>('function')
const functionType = ref<'exponential' | 'logarithm'>('exponential')
const base = ref(2)
const complexityN = ref(10)

// Initialize from URL
onMounted(() => {
  activeTab.value = (route.query.tab as string) || 'function'
  functionType.value = (route.query.type as string) || 'exponential'
  base.value = parseFloat(route.query.base as string) || 2
  complexityN.value = parseInt(route.query.n as string) || 10
})

// Update URL on change (debounced)
watch([activeTab, functionType, base, complexityN], () => {
  const query = activeTab.value === 'function'
    ? { tab: 'function', type: functionType.value, base: base.value }
    : { tab: 'complexity', n: complexityN.value }
  router.replace({ query })
}, { debounce: 300 })
```

### Data-testid Attributes
```
data-testid="tab-function"
data-testid="tab-complexity"
data-testid="function-type-exponential"
data-testid="function-type-logarithm"
data-testid="base-preset-e"
data-testid="base-preset-2"
data-testid="base-preset-10"
data-testid="base-custom-input"
data-testid="growth-decay-panel"
data-testid="doubling-time-display"
data-testid="half-life-display"
data-testid="exponential-graph"
```

### Success Criteria
- [ ] Tab switching works correctly
- [ ] All base presets work
- [ ] Custom base input validates and updates graph
- [ ] Growth/decay analysis is accurate
- [ ] Graph renders correctly for both function types
- [ ] URL state sync works
- [ ] Mobile layout is usable
- [ ] Accessible (keyboard navigation, screen reader)

### Constraints
- Base must be positive and ≠ 1
- Custom base input: range 0.1 to 100
- Graph auto-scales y-axis based on visible x-range
- Logarithm graph only shows x > 0

---

## Increment 8C: Complexity Comparison Feature

**Effort**: 4-5 hours

### Objectives
1. Build interactive complexity comparison visualization
2. Show how different complexity classes scale with input size
3. Make the "why O(log n) matters" viscerally clear

### Component: ComplexityComparisonTab.vue

#### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ Input Size (n): [=======●==========] 10                         │
│                 1              100              1000             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │   [Coordinate System showing all 6 complexity curves]   │   │
│  │                                                         │   │
│  │   Legend: ● O(1)  ● O(log n)  ● O(n)                   │   │
│  │           ● O(n log n)  ● O(n²)  ● O(2^n)              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Operations at n = 10:                                           │
│ ┌─────────────┬───────────────┬────────────────────────────┐   │
│ │ Complexity  │ Operations    │ Relative to O(n)           │   │
│ ├─────────────┼───────────────┼────────────────────────────┤   │
│ │ O(1)        │ 1             │ 10× faster                 │   │
│ │ O(log n)    │ 3.32          │ 3× faster                  │   │
│ │ O(n)        │ 10            │ baseline                   │   │
│ │ O(n log n)  │ 33.2          │ 3× slower                  │   │
│ │ O(n²)       │ 100           │ 10× slower                 │   │
│ │ O(2^n)      │ 1,024         │ 102× slower                │   │
│ └─────────────┴───────────────┴────────────────────────────┘   │
│                                                                 │
│ 💡 At n=10, O(2^n) is already 100× slower than O(n).           │
│    At n=20, it would be 100,000× slower!                        │
└─────────────────────────────────────────────────────────────────┘
```

#### Features

1. **Input Size Slider**
   - Range: 1 to 1000 (logarithmic scale for better UX)
   - Shows current value prominently
   - Updates graph and table in real-time

2. **Multi-Curve Graph**
   - All 6 complexity curves on same coordinate system
   - Different colors for each curve
   - Legend with color coding
   - Y-axis may need log scale for large n (auto-detect)

3. **Comparison Table**
   - Shows exact operation count for each complexity
   - Shows relative comparison to O(n) as baseline
   - Highlights the exponential blowup

4. **Educational Insight**
   - Dynamic insight text that changes based on n
   - Emphasizes the practical implications

#### Complexity Functions
```typescript
export const complexityFunctions: Record<ComplexityClass, (n: number) => number> = {
  constant: () => 1,
  logarithmic: (n) => Math.log2(n),
  linear: (n) => n,
  linearithmic: (n) => n * Math.log2(n),
  quadratic: (n) => n * n,
  exponential: (n) => Math.pow(2, n),
}

export const complexityLabels: Record<ComplexityClass, string> = {
  constant: 'O(1)',
  logarithmic: 'O(log n)',
  linear: 'O(n)',
  linearithmic: 'O(n log n)',
  quadratic: 'O(n²)',
  exponential: 'O(2^n)',
}

export const complexityColors: Record<ComplexityClass, string> = {
  constant: '#22c55e',      // green
  logarithmic: '#3b82f6',   // blue
  linear: '#f59e0b',        // amber
  linearithmic: '#8b5cf6',  // purple
  quadratic: '#ef4444',     // red
  exponential: '#dc2626',   // darker red
}

export const complexityExamples: Record<ComplexityClass, string[]> = {
  constant: ['Array access', 'Hash lookup', 'Stack push/pop'],
  logarithmic: ['Binary search', 'Balanced tree ops', 'Binary lifting'],
  linear: ['Linear search', 'Single loop', 'Array traversal'],
  linearithmic: ['Merge sort', 'Heap sort', 'Quick sort (avg)'],
  quadratic: ['Nested loops', 'Bubble sort', 'Selection sort'],
  exponential: ['Brute force', 'Power set', 'Traveling salesman'],
}
```

#### Dynamic Insights
```typescript
function getInsight(n: number): string {
  const log = complexityFunctions.logarithmic(n)
  const exp = complexityFunctions.exponential(n)
  const quad = complexityFunctions.quadratic(n)
  
  if (n <= 10) {
    return `At small inputs, even O(2^n) is manageable. But watch what happens as n grows...`
  } else if (n <= 30) {
    const expVsLinear = Math.round(exp / n)
    return `O(2^n) is now ${expVsLinear.toLocaleString()}× slower than O(n). This is why brute force doesn't scale.`
  } else if (n <= 100) {
    return `O(2^n) would take ${exp.toExponential(2)} operations—more than atoms in the universe for n>265!`
  } else {
    const logVsN = Math.round(n / log)
    return `O(log n) = ${log.toFixed(1)} vs O(n) = ${n}. Binary search is ${logVsN}× faster than linear search!`
  }
}
```

#### Graph Considerations
- **Y-axis scaling**: For small n (≤20), use linear scale. For larger n, may need to cap or use log scale.
- **Curve truncation**: O(2^n) explodes quickly; truncate at graph boundary with indicator.
- **Hover interaction**: Show exact value when hovering over a curve.

### Data-testid Attributes
```
data-testid="complexity-n-slider"
data-testid="complexity-n-value"
data-testid="complexity-graph"
data-testid="complexity-table"
data-testid="complexity-row-{class}"
data-testid="complexity-insight"
```

### E2E Tests
```typescript
test('slider updates comparison values', async ({ page }) => {
  await page.goto('/algebra/exponentials?tab=complexity')
  await page.locator('[data-testid="complexity-n-slider"]').fill('20')
  // Verify table updates
  await expect(page.locator('[data-testid="complexity-row-linear"]')).toContainText('20')
})

test('exponential blowup is visible', async ({ page }) => {
  await page.goto('/algebra/exponentials?tab=complexity&n=30')
  // Verify O(2^n) shows large number
  await expect(page.locator('[data-testid="complexity-row-exponential"]')).toContainText('1,073,741,824')
})
```

### Success Criteria
- [ ] Slider updates all visualizations in real-time
- [ ] All 6 complexity curves render correctly
- [ ] Table shows accurate calculations
- [ ] Insight text is dynamic and educational
- [ ] Graph handles large values gracefully
- [ ] Mobile layout works (may stack table below graph)

### Constraints
- Cap n slider at 1000 to prevent browser performance issues
- O(2^n) display capped at n=30 for calculations (show "> 10^9" beyond)
- Use number formatting for large values (toLocaleString, toExponential)

---

## Increment 8D: Exponentials & Logarithms Content

**Effort**: 4-5 hours

### Objectives
1. Create ExponentialsView with comprehensive content
2. Cover both exponential and logarithmic functions
3. Integrate ExponentialExplorer widget
4. Python code examples throughout

### Route Setup
Add to `src/router/index.ts`:
```typescript
{
  path: '/algebra/exponentials',
  name: 'exponentials',
  component: () => import('@/views/algebra/ExponentialsView.vue'),
}
```

Add to `src/data/navigation.ts`:
```typescript
// Under algebra section
{
  title: 'Exponentials & Logarithms',
  path: '/algebra/exponentials',
  description: 'Growth, decay, and algorithm complexity',
}
```

### Content Structure

#### Section 1: What are Exponential Functions? (NOT collapsible)
- Definition: f(x) = b^x where b > 0, b ≠ 1
- Key property: constant multiplicative change
- The base determines growth (b > 1) or decay (0 < b < 1)
- Why they matter in programming: compound growth, complexity analysis

```python
def exponential(x, base=2):
    """Exponential function: b^x"""
    return base ** x

# Powers of 2 - fundamental in CS
for i in range(10):
    print(f"2^{i} = {exponential(i)}")  # 1, 2, 4, 8, 16, 32, 64, 128, 256, 512
```

#### Section 2: Interactive Explorer (NOT collapsible)
- Embed ExponentialExplorer widget
- Brief instructions for both tabs

#### Section 3: Special Bases (collapsible)
- **Base 2**: Binary, computer science (bits, memory)
- **Base 10**: Scientific notation, orders of magnitude
- **Base e**: Natural exponential, calculus, continuous growth

```python
import math

# The three most important bases
print(f"2^10 = {2**10}")         # 1024 - "kilobyte"
print(f"10^6 = {10**6}")         # 1000000 - "million"
print(f"e^1 = {math.e:.4f}")     # 2.7183 - natural base

# Why e is special: derivative of e^x is e^x
```

#### Section 4: Growth and Decay (collapsible)
- Exponential growth: population, compound interest, viral spread
- Exponential decay: radioactive decay, depreciation, cooling
- Doubling time and half-life formulas

```python
import math

def doubling_time(growth_rate):
    """Time to double with given growth rate (as decimal)."""
    # Using the Rule of 70 approximation
    return 70 / (growth_rate * 100)

def exact_doubling_time(base):
    """Exact doubling time for f(x) = base^x."""
    return math.log(2) / math.log(base)

# 7% annual growth
print(f"Rule of 70: {doubling_time(0.07):.1f} years")  # 10.0
print(f"Exact: {exact_doubling_time(1.07):.1f} years")  # 10.2
```

#### Section 5: What are Logarithms? (collapsible)
- Definition: log_b(x) = y means b^y = x
- Logarithm as the inverse of exponential
- Key property: turns multiplication into addition

```python
import math

# Logarithm answers: "What power gives us x?"
print(f"log₂(8) = {math.log2(8)}")    # 3, because 2^3 = 8
print(f"log₁₀(1000) = {math.log10(1000)}")  # 3, because 10^3 = 1000
print(f"ln(e²) = {math.log(math.e**2)}")    # 2, because e^2 = e²

# The relationship: log_b(b^x) = x
base = 5
x = 3
print(f"log_{base}({base}^{x}) = {math.log(base**x, base)}")  # 3
```

#### Section 6: Logarithm Properties (collapsible)
- Product rule: log(ab) = log(a) + log(b)
- Quotient rule: log(a/b) = log(a) - log(b)
- Power rule: log(a^n) = n·log(a)
- Change of base: log_b(x) = ln(x) / ln(b)

```python
import math

a, b = 100, 10

# Product rule: log(ab) = log(a) + log(b)
print(f"log₁₀(100 × 10) = {math.log10(a * b)}")  # 3
print(f"log₁₀(100) + log₁₀(10) = {math.log10(a) + math.log10(b)}")  # 3

# Change of base formula
def log_base(x, base):
    """Calculate log_base(x) using natural log."""
    return math.log(x) / math.log(base)

print(f"log₃(81) = {log_base(81, 3)}")  # 4, because 3^4 = 81
```

#### Section 7: Key Formulas Reference (NOT collapsible)
Quick reference table:

| Formula | Expression | Example |
|---------|------------|---------|
| Exponential | f(x) = b^x | 2^3 = 8 |
| Logarithm | log_b(x) = y ⟺ b^y = x | log₂(8) = 3 |
| Inverse relationship | log_b(b^x) = x | log₂(2³) = 3 |
| Inverse relationship | b^(log_b(x)) = x | 2^(log₂8) = 8 |
| Doubling time | t = ln(2) / ln(b) | |
| Half-life | t = ln(0.5) / ln(b) | |
| Compound interest | A = P(1 + r/n)^(nt) | |
| Continuous interest | A = Pe^(rt) | |
| Change of base | log_b(x) = ln(x) / ln(b) | |

### Success Criteria
- [ ] Page renders with all sections
- [ ] Widget integrated and functional
- [ ] Code examples syntax-highlighted
- [ ] KaTeX renders all formulas
- [ ] Collapsible sections work
- [ ] Breadcrumbs correct
- [ ] Mobile responsive
- [ ] Added to navigation

---

## Increment 8E: Applications Content (Growth/Decay/Complexity)

**Effort**: 3-4 hours

### Objectives
1. Add dedicated applications section to the content page
2. Connect math to programming with concrete examples
3. Emphasize the "why this matters" for programmers

### Additional Content Sections

#### Section 8: Compound Interest in Code (collapsible)
Real financial calculation example:

```python
def compound_interest(principal, rate, compounds_per_year, years):
    """
    Calculate compound interest.
    
    Args:
        principal: Initial amount (P)
        rate: Annual interest rate as decimal (r)
        compounds_per_year: Times interest compounds per year (n)
        years: Time in years (t)
    
    Returns:
        Final amount (A)
    """
    return principal * (1 + rate / compounds_per_year) ** (compounds_per_year * years)

# Compare compounding frequencies
principal = 10000
rate = 0.05  # 5% annual rate
years = 10

print("$10,000 at 5% for 10 years:")
print(f"  Annual:     ${compound_interest(principal, rate, 1, years):,.2f}")
print(f"  Monthly:    ${compound_interest(principal, rate, 12, years):,.2f}")
print(f"  Daily:      ${compound_interest(principal, rate, 365, years):,.2f}")
print(f"  Continuous: ${principal * math.e**(rate * years):,.2f}")
```

#### Section 9: Algorithm Complexity in Practice (collapsible)
The flagship programmer content:

```python
import time

def linear_search(arr, target):
    """O(n) - check every element"""
    for i, item in enumerate(arr):
        if item == target:
            return i
    return -1

def binary_search(arr, target):
    """O(log n) - divide and conquer"""
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Compare with 1 million elements
arr = list(range(1_000_000))
target = 999_999

# Linear: O(n) = 1,000,000 operations
# Binary: O(log n) ≈ 20 operations

# That's 50,000× fewer operations!
```

Why O(log n) matters:

| n | O(n) | O(log n) | Speedup |
|---|------|----------|---------|
| 1,000 | 1,000 | 10 | 100× |
| 1,000,000 | 1,000,000 | 20 | 50,000× |
| 1,000,000,000 | 1,000,000,000 | 30 | 33,000,000× |

#### Section 10: Real-World Examples (collapsible)

**Binary in Computing**:
```python
# How many bits to represent a number?
def bits_needed(n):
    """O(log₂ n) bits needed to represent n."""
    if n == 0:
        return 1
    return math.floor(math.log2(n)) + 1

print(f"Bits for 255: {bits_needed(255)}")    # 8 (one byte)
print(f"Bits for 256: {bits_needed(256)}")    # 9
print(f"Bits for 1000: {bits_needed(1000)}")  # 10
```

**pH Scale**:
```python
def ph_to_concentration(ph):
    """Convert pH to hydrogen ion concentration."""
    return 10 ** (-ph)

def concentration_to_ph(concentration):
    """Convert hydrogen ion concentration to pH."""
    return -math.log10(concentration)

# pH 7 (neutral) vs pH 4 (acidic)
print(f"pH 7 concentration: {ph_to_concentration(7):.0e}")  # 1e-7
print(f"pH 4 concentration: {ph_to_concentration(4):.0e}")  # 1e-4
# pH 4 is 1000× more acidic than pH 7!
```

**Decibels (Sound)**:
```python
def watts_to_decibels(power, reference=1e-12):
    """Convert power to decibels (dB)."""
    return 10 * math.log10(power / reference)

# Whisper vs Rock concert
whisper = 1e-10  # watts
concert = 1e-1   # watts

print(f"Whisper: {watts_to_decibels(whisper):.0f} dB")  # 20 dB
print(f"Concert: {watts_to_decibels(concert):.0f} dB")  # 110 dB
# 90 dB difference = 10^9 = 1 billion times more power!
```

### Success Criteria
- [ ] All application sections added
- [ ] Code examples are runnable and educational
- [ ] Complexity comparison connects to widget
- [ ] Real-world examples span multiple domains

---

## Increment 8F: Mobile Optimization & Polish

**Effort**: 3-4 hours

### Objectives
1. Ensure all widgets work well on mobile devices
2. Proper touch targets and responsive layouts
3. Visual regression baselines for mobile
4. Final polish pass

### Tasks

#### 1. Mobile Layout Audit
Review each widget on 375px width (iPhone SE):

**ExponentialExplorer**:
- [ ] Tabs are touch-friendly (44px minimum height)
- [ ] Graph fills available width
- [ ] Controls stack vertically
- [ ] Analysis panel is readable
- [ ] No horizontal scroll

**ComplexityComparison**:
- [ ] Slider is usable on touch
- [ ] Table scrolls horizontally if needed (or stacks)
- [ ] Insight text wraps properly

**QuadraticExplorer** (from Phase 7):
- [ ] Coefficient sliders work on touch
- [ ] Graph is not too small
- [ ] Equation forms are readable

#### 2. Touch Target Sizes
Ensure all interactive elements meet 44x44px minimum:

```css
/* Example fixes */
.base-preset-button {
  min-width: 44px;
  min-height: 44px;
}

.slider-thumb {
  width: 44px;
  height: 44px;
}

.tab-button {
  min-height: 44px;
  padding: 12px 16px;
}
```

#### 3. Responsive Breakpoints
Verify layouts at:
- 375px (iPhone SE)
- 390px (iPhone 12/13/14)
- 768px (iPad portrait)
- 1024px (iPad landscape / small laptop)
- 1280px (desktop)

#### 4. Visual Regression Baselines
Add mobile snapshots:

```typescript
// e2e/visual/mobile.spec.ts
test.describe('Mobile Visual Regression', () => {
  test.use({ viewport: { width: 375, height: 667 } })
  
  test('exponentials page mobile', async ({ page }) => {
    await page.goto('/algebra/exponentials')
    await expect(page).toHaveScreenshot('exponentials-mobile.png')
  })
  
  test('quadratics page mobile', async ({ page }) => {
    await page.goto('/algebra/quadratics')
    await expect(page).toHaveScreenshot('quadratics-mobile.png')
  })
})
```

#### 5. Performance Check
Run Lighthouse on mobile preset:
- [ ] Performance > 80
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

#### 6. Polish Checklist
- [ ] Loading states for tab switches
- [ ] Smooth transitions between function types
- [ ] Error states for invalid inputs
- [ ] Console warnings cleaned up
- [ ] Focus visible on all interactive elements
- [ ] Hover states work (desktop only)

#### 7. Documentation Updates
- Update `docs/ROADMAP.md` with Phase 8 completion
- Add decisions D-064 through D-069 to `docs/decisions.md`
- Add any lessons learned to `docs/ll_li.md`
- Update `docs/current_state.md`

### Success Criteria
- [ ] All widgets usable on mobile
- [ ] Touch targets meet 44px minimum
- [ ] Visual regression baselines captured
- [ ] Lighthouse mobile score > 80
- [ ] Documentation updated

---

## Phase 8 Complete Checklist

Before marking Phase 8 complete:

### Testing
- [ ] All unit tests pass (`npm run test`)
- [ ] All E2E tests pass (`npm run test:e2e`)
- [ ] Visual regression baselines updated (desktop + mobile)
- [ ] Accessibility audit passes for new pages

### Quality
- [ ] TypeScript strict mode passes (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors in browser
- [ ] Lighthouse mobile score > 80

### Documentation
- [ ] `docs/decisions.md` updated with D-064 through D-069
- [ ] `docs/ll_li.md` updated with any lessons learned
- [ ] `docs/current_state.md` updated
- [ ] `docs/ROADMAP.md` Phase 8 marked complete

### Deployment
- [ ] Deployed to GitHub Pages
- [ ] Verified all pages work in production
- [ ] Tested on actual mobile device

---

## File Summary

### New Files
```
src/components/widgets/ExponentialExplorer/
├── ExponentialExplorer.vue
├── FunctionExplorerTab.vue
├── ComplexityComparisonTab.vue
├── BaseSelector.vue
├── FunctionTypeSelector.vue
├── GrowthDecayPanel.vue
├── types.ts
├── presets.ts
└── useExponentialExplorer.ts

src/utils/math/exponential.ts
src/utils/math/exponential.test.ts

src/views/algebra/ExponentialsView.vue

e2e/widgets/exponential-explorer.spec.ts
e2e/visual/mobile.spec.ts (or additions to existing)
```

### Modified Files
```
src/router/index.ts          # Add exponentials route
src/data/navigation.ts       # Add exponentials to nav
docs/decisions.md            # New decisions D-064 to D-069
docs/ll_li.md                # Lessons learned
docs/current_state.md        # Status update
docs/ROADMAP.md              # Phase 8 complete
```

---

## Estimated Total Effort

| Increment | Effort |
|-----------|--------|
| 8A: Math Utilities | 2-3 hours |
| 8B: ExponentialExplorer Widget | 5-6 hours |
| 8C: Complexity Comparison | 4-5 hours |
| 8D: Content | 4-5 hours |
| 8E: Applications Content | 3-4 hours |
| 8F: Mobile & Polish | 3-4 hours |
| **Total** | **21-27 hours** |

---

## Review Point (After Phase 8)

Per the roadmap, evaluate after Phase 8:

| Question | Evaluation Criteria |
|----------|---------------------|
| Mobile experience acceptable? | Lighthouse score > 80, usable on actual device |
| Widget architecture scaling well? | 5 widgets now, patterns still clear |
| Content pace appropriate? | Algebra section complete, ready for Trig |
| Testing catching issues? | Visual regression + E2E preventing regressions |
