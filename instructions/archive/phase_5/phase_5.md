# Phase 5: Summation Notation — "Sigma is a For Loop"

## Context

This is the SnakeMath project, an educational math site for programmers built with Vue 3 + TypeScript + Tailwind CSS. Phase 4 completed the NumberTypeExplorer widget. Phase 5 adds the Algebra section with the flagship Summation widget.

**Core Philosophy**: The central insight to convey is that sigma notation (Σ) is equivalent to a for loop with a running total. This is THE thesis statement of SnakeMath.

### Key Files to Reference
- `CLAUDE.md` — Project guidelines and patterns
- `docs/PHASE_4_COMPLETE.md` — Previous phase completion
- `docs/current_state.md` — Current project state
- `docs/decisions.md` — Architectural decisions
- `docs/archive_overview/archive_*.md` — Reference content from previous implementation

### Existing Patterns to Follow
- Widget architecture: `src/components/widgets/NumberTypeExplorer.vue`
- URL state sync: `src/composables/useUrlState.ts`
- Math utilities: `src/utils/math/numberClassification.ts`
- Content components: `src/components/content/`
- View structure: `src/views/basics/NumberTypesView.vue`

---

## Phase 5 Increments

### 5A: Algebra Section Foundation

**Goal**: Establish routing and navigation for Algebra section.

**Deliverables**:
1. `src/views/algebra/AlgebraIndex.vue` — Section landing page with topic cards
2. `src/views/algebra/SummationView.vue` — Summation topic page (shell initially)
3. Router updates in `src/router/index.ts`
4. Navigation updates in `src/data/navigation.ts`

**Requirements**:
- Follow existing Basics section pattern exactly
- Use TopicPage component for consistent layout
- AlgebraIndex should have cards linking to subtopics (only Summation for now, but structure for future topics)
- Lazy-load the algebra views

**Navigation Structure**:
```typescript
{
  title: 'Algebra',
  path: '/algebra',
  children: [
    { title: 'Overview', path: '/algebra' },
    { title: 'Summation Notation', path: '/algebra/summation', description: 'Sigma is just a for loop' }
  ]
}
```

---

### 5B: Summation Math Utilities

**Goal**: Pure TypeScript functions for summation calculations with comprehensive tests.

**Deliverables**:
1. `src/utils/math/summation.ts`
2. `src/utils/math/summation.test.ts`

**Types** (add to `src/types/math.ts`):
```typescript
export interface SummationResult {
  total: number
  terms: number[]
  termCount: number
}

export interface FormulaComparison {
  loopResult: number
  formulaResult: number
  match: boolean
  iterations: number
}

export type SummationPresetId = 'arithmetic' | 'squares' | 'cubes' | 'geometric' | 'constant'
```

**Functions to Implement**:

```typescript
/**
 * Evaluate a summation by iterating from start to end (inclusive).
 * Returns the total, individual terms, and term count.
 */
export function evaluateSummation(
  expression: (i: number) => number,
  start: number,
  end: number
): SummationResult

/**
 * Closed-form formula for sum of 1 to n: n(n+1)/2
 * Known as Gauss's formula or triangular numbers.
 */
export function sumArithmetic(n: number): number

/**
 * Closed-form formula for sum of squares 1² to n²: n(n+1)(2n+1)/6
 */
export function sumSquares(n: number): number

/**
 * Closed-form formula for sum of cubes 1³ to n³: [n(n+1)/2]²
 * Note: Sum of cubes equals square of sum of arithmetic!
 */
export function sumCubes(n: number): number

/**
 * Closed-form for geometric series: (r^(n+1) - 1) / (r - 1) for r ≠ 1
 * For r = 2: 2^(n+1) - 1 (sum of powers of 2)
 */
export function sumGeometric(r: number, n: number): number

/**
 * Compare loop evaluation vs closed-form formula.
 * Useful for demonstrating O(n) vs O(1) complexity.
 */
export function compareLoopVsFormula(
  presetId: SummationPresetId,
  n: number
): FormulaComparison
```

**Test Cases** (minimum):
- `evaluateSummation`: empty range (start > end), single term, typical range, negative indices
- `sumArithmetic`: n=0, n=1, n=10 (expect 55), n=100 (expect 5050, Gauss's problem)
- `sumSquares`: n=1, n=5 (expect 55), n=10 (expect 385)
- `sumCubes`: n=1, n=5 (expect 225), verify equals square of arithmetic sum
- `sumGeometric`: r=2 n=4 (expect 31), r=3 n=3 (expect 40)
- `compareLoopVsFormula`: verify match is true for all presets

**Constraints**:
- Handle edge case where start > end (return total=0, empty terms array)
- Handle n=0 cases gracefully (return 0)
- No floating point issues for integer inputs up to n=10000

---

### 5C: SummationExplorer Core Widget

**Goal**: Basic interactive widget with preset selection and result display.

**Deliverables**:
1. `src/components/widgets/SummationExplorer.vue` — Main orchestrator
2. `src/components/widgets/summation/BoundsInput.vue` — Start/end index inputs
3. `src/components/widgets/summation/SummationResult.vue` — Total and term display
4. `src/components/widgets/summation/PresetSelector.vue` — Dropdown for formula selection
5. `src/components/widgets/index.ts` — Update exports

**Component Structure**:
```
SummationExplorer.vue (orchestrator)
├── PresetSelector (dropdown)
├── BoundsInput (start/end inputs)
├── SummationCodeParallel (5D)
├── SummationResult (total + terms)
├── SummationBarChart (5E)
└── FormulaComparison (5F)
```

**SummationExplorer Props**:
```typescript
interface Props {
  initialPreset?: SummationPresetId
  initialStart?: number
  initialEnd?: number
  syncUrl?: boolean
  urlKeyPrefix?: string  // default: '' (uses 'preset', 'start', 'end')
  showVisualization?: boolean
  showCodeParallel?: boolean
  showFormulaComparison?: boolean
}
```

**BoundsInput Requirements**:
- Two number inputs: "From i =" and "to"
- Validation: integers only, start ≤ end, reasonable range (1-100 default max)
- Error state styling if invalid
- Emit validated values to parent

**PresetSelector Options**:
| ID | Label | Expression Display |
|----|-------|-------------------|
| arithmetic | "Sum of integers (1+2+3+...)" | i |
| squares | "Sum of squares (1²+2²+3²+...)" | i² |
| cubes | "Sum of cubes (1³+2³+3³+...)" | i³ |
| geometric | "Powers of 2 (1+2+4+8+...)" | 2^(i-1) |
| constant | "Constant (c+c+c+...)" | 1 |

**SummationResult Display**:
- Large total value prominently displayed
- Expandable/collapsible term breakdown: "1 + 4 + 9 + 16 + 25 = 55"
- For long sums (>10 terms), show first 5 + "..." + last 2
- Term count indicator

**State Management**:
- All state local to SummationExplorer
- Computed values derive from (preset, start, end)
- Use `useUrlState` composable if syncUrl=true

---

### 5D: Code Parallel Display

**Goal**: Side-by-side math notation and equivalent code — THE core insight.

**Deliverables**:
1. `src/components/widgets/summation/SummationCodeParallel.vue`

**Layout** (responsive):
- Desktop: Two columns side-by-side with visual connector
- Mobile: Stacked vertically with "equivalent to" label between

**Left Panel (Math Notation)**:
- KaTeX-rendered sigma notation
- Dynamic: updates when bounds/expression change
- Example for arithmetic, start=1, end=10:
  ```latex
  \sum_{i=1}^{10} i = 55
  ```

**Right Panel (Code)**:
- Syntax-highlighted Python (default) or JavaScript (toggle)
- Uses existing CodeExample component (no line numbers, no collapse)
- Dynamic: generates code string from current state

**Python Template**:
```python
total = 0
for i in range(1, 11):  # i = 1 to 10
    total += i
# total = 55
```

**JavaScript Template**:
```javascript
let total = 0;
for (let i = 1; i <= 10; i++) {
    total += i;
}
// total = 55
```

**Key Insight Callout**:
- Highlighted box/banner below or between panels
- Text: "Σ notation is just a for loop with a running total!"
- Use accent color, subtle animation on first render (optional)

**Props**:
```typescript
interface Props {
  preset: SummationPresetId
  start: number
  end: number
  total: number
  language: 'python' | 'javascript'
}
```

**Expression Mapping** (preset → code expression):
| Preset | Python | JavaScript |
|--------|--------|------------|
| arithmetic | `i` | `i` |
| squares | `i ** 2` | `i ** 2` |
| cubes | `i ** 3` | `i ** 3` |
| geometric | `2 ** (i - 1)` | `2 ** (i - 1)` |
| constant | `1` | `1` |

---

### 5E: Term Visualization (Bar Chart)

**Goal**: SVG bar chart showing individual terms with optional animation.

**Deliverables**:
1. `src/components/widgets/summation/SummationBarChart.vue`

**Features**:
- SVG-based (matches Phase 4 pattern)
- Each bar represents one term in the sum
- Bar height proportional to term value (scaled to fit)
- X-axis: index values (i)
- Y-axis: term values (implicit, no axis line needed for simplicity)
- Hover/focus shows tooltip with "i=3: 9" format
- Responsive width, fixed aspect ratio

**Animation**:
- Default: instant display (all bars visible immediately)
- Play button: animates bars appearing left-to-right, ~200ms per bar
- Running total line that grows as bars animate
- Stop/reset when animation complete
- Accessible: respects prefers-reduced-motion

**Constraints**:
- Max 20 bars displayed; if terms > 20, show message "Too many terms to visualize" with option to show first 20
- Minimum bar width for touch targets
- Color: use theme primary color with opacity gradient (darker = higher value)

**Props**:
```typescript
interface Props {
  terms: number[]
  maxTerms?: number  // default: 20
  animated?: boolean // default: false
  showRunningTotal?: boolean // default: true
}
```

**Emits**:
```typescript
defineEmits<{
  (e: 'animationComplete'): void
  (e: 'barHover', index: number, value: number): void
}>()
```

**Accessibility**:
- role="img" on SVG
- aria-label describing the chart: "Bar chart showing 10 terms of the sum, total 55"
- Individual bars should not be focusable (too many); provide text alternative

---

### 5F: Presets & Formula Comparison

**Goal**: Data file for presets and comparison component showing loop vs formula efficiency.

**Deliverables**:
1. `src/data/summation/presets.ts`
2. `src/components/widgets/summation/FormulaComparison.vue`

**Preset Data Structure**:
```typescript
export interface SummationPreset {
  id: SummationPresetId
  name: string
  description: string
  expressionLatex: string        // "i^2"
  expressionPython: string       // "i ** 2"
  expressionJavaScript: string   // "i ** 2"
  closedFormLatex: string | null // "\\frac{n(n+1)(2n+1)}{6}"
  closedFormName: string | null  // "Sum of squares formula"
  evaluate: (i: number) => number
  closedForm: ((n: number) => number) | null
}

export const summationPresets: Record<SummationPresetId, SummationPreset>
```

**FormulaComparison Component**:
- Shows loop result vs formula result
- Displays the closed-form formula in KaTeX
- Highlights that they match
- Educational note about computational complexity:
  - "Loop: n iterations"
  - "Formula: 1 calculation"
  - "For n = 1,000,000: loop needs 1,000,000 steps, formula needs 1"

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  Closed-Form Formula                            │
│                                                 │
│       n(n + 1)                                  │
│       ────────  =  55     ✓ matches loop        │
│          2                                      │
│                                                 │
│  Why use formulas?                              │
│  • Loop: 10 iterations                          │
│  • Formula: 1 calculation                       │
│                                                 │
│  For n = 1,000,000:                             │
│  Loop would need 1,000,000 additions!           │
└─────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface Props {
  preset: SummationPreset
  n: number  // end - start + 1 (term count)
  loopTotal: number
}
```

**Edge Case**:
- If preset has no closed form (e.g., custom in future), show "No closed-form formula known for this expression"

---

### 5G: Content & Polish

**Goal**: Complete educational content and final integration.

**Deliverables**:
1. Full content for `SummationView.vue`
2. Content for `AlgebraIndex.vue`
3. URL state synchronization in SummationExplorer
4. Final testing and polish

**SummationView Content Sections**:

1. **Introduction** — What is summation notation?
   - Brief explanation of sigma (Σ) symbol
   - "Mathematicians' shorthand for adding things up"
   - Simple example: 1 + 2 + 3 + 4 + 5

2. **The Programmer's Secret** — It's code you already know!
   - The big reveal with SummationCodeParallel
   - "If you've written a for loop, you already understand sigma notation"
   - Interactive explorer widget here

3. **Anatomy of Sigma Notation**
   - Breakdown of parts: index variable, lower bound, upper bound, expression
   - Diagram showing which part maps to which code element
   - MathBlock examples

4. **Common Formulas**
   - Arithmetic sum with Gauss story (optional sidebar about young Gauss)
   - Sum of squares
   - Sum of cubes (surprising: equals square of arithmetic sum!)
   - Geometric series (relevant to CS: binary)

5. **Why Formulas Matter**
   - FormulaComparison widget
   - Connection to algorithm analysis
   - O(n) vs O(1) intuition builder

6. **Try It Yourself**
   - Full SummationExplorer with all features enabled
   - URL state sync enabled
   - Encourage experimentation

**URL State Parameters**:
- `preset`: arithmetic | squares | cubes | geometric | constant
- `start`: integer (default: 1)
- `end`: integer (default: 10)
- `lang`: python | javascript (default: python)

**AlgebraIndex Content**:
- Hero section: "Algebra for Programmers"
- Topic cards grid (only Summation for now, but leave room for future)
- Brief description of what algebra topics are covered

---

## Technical Constraints

### Must Follow
- All components use `<script setup lang="ts">`
- Props defined with TypeScript interfaces
- Emit types defined with `defineEmits<{...}>()`
- No `any` types
- All new utilities have co-located test files
- Use existing components: MathBlock, CodeExample, ContentSection, TopicPage
- SVG for visualizations (not Canvas)
- Tailwind for all styling (no scoped CSS except when necessary)

### Testing Requirements
- All utility functions: comprehensive unit tests
- New widget components: at least one test file for BoundsInput validation
- Run full test suite before completing each increment
- Target: maintain 100% pass rate

### Accessibility Requirements
- All interactive elements keyboard accessible
- ARIA labels on visualizations
- Focus management in widget
- Respect prefers-reduced-motion for animations
- Color contrast compliance

### Performance Constraints
- Debounce rapid input changes (300ms, matching existing pattern)
- Limit visualization to 20 terms max
- Lazy evaluation: don't recalculate until inputs settle

---

## File Structure After Phase 5

```
src/
├── components/
│   └── widgets/
│       ├── index.ts (updated)
│       ├── NumberInput.vue
│       ├── NumberTypeExplorer.vue
│       ├── ... (existing)
│       ├── SummationExplorer.vue (new)
│       └── summation/
│           ├── index.ts (new)
│           ├── PresetSelector.vue (new)
│           ├── BoundsInput.vue (new)
│           ├── BoundsInput.test.ts (new)
│           ├── SummationResult.vue (new)
│           ├── SummationCodeParallel.vue (new)
│           ├── SummationBarChart.vue (new)
│           └── FormulaComparison.vue (new)
├── data/
│   ├── navigation.ts (updated)
│   └── summation/
│       ├── index.ts (new)
│       └── presets.ts (new)
├── types/
│   └── math.ts (updated with summation types)
├── utils/math/
│   ├── summation.ts (new)
│   └── summation.test.ts (new)
└── views/
    └── algebra/
        ├── AlgebraIndex.vue (new)
        └── SummationView.vue (new)
```

---

## Verification Checklist

After each increment, verify:
```bash
npm run type-check   # No TypeScript errors
npm run lint         # Only expected v-html warnings
npm run test         # All tests pass
npm run build        # Production build succeeds
npm run dev          # Visual verification in browser
```

Before marking Phase 5 complete:
- [ ] `/algebra` route shows AlgebraIndex with topic cards
- [ ] `/algebra/summation` shows full educational content
- [ ] SummationExplorer works with all presets
- [ ] Code parallel display shows Python and JavaScript
- [ ] Bar chart visualizes terms with animation option
- [ ] Formula comparison explains efficiency
- [ ] URL state sync works (test: change inputs, copy URL, open in new tab)
- [ ] Keyboard navigation works throughout widget
- [ ] Mobile layout is usable
- [ ] All tests pass
- [ ] Build succeeds without errors

---

## Implementation Order

Execute increments in order (5A → 5B → 5C → 5D → 5E → 5F → 5G). Each increment should be fully working before proceeding to the next. Commit after each increment with message format: `feat(phase5): 5X - description`.

Start with 5A: Algebra Section Foundation.