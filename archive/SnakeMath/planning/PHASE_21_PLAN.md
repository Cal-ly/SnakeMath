# Phase 21: Integration (Integral Calculus)

**Theme**: *"Summation with infinitely small steps"*

**Goal**: Build an IntegrationExplorer widget that visualizes definite integrals as area under curves, demonstrates Riemann sum convergence as n → ∞, and connects numerical integration to familiar programming patterns (for loops, scipy.integrate, numpy.trapz).

---

## Strategic Context

Phase 21 completes the **Calculus Trinity**: Limits → Derivatives → Integrals. This progression follows the logical structure of calculus:

1. **Limits (Phase 13)**: Foundation — understanding "approaching" values
2. **Derivatives (Phase 14)**: Rates of change — slopes of tangent lines
3. **Integration (Phase 21)**: Accumulation — area under curves

The **Fundamental Theorem of Calculus** connects derivatives and integrals as inverse operations. With integration complete, users will see this duality demonstrated interactively.

### Why This Matters (Programmer Framing)

| Concept | Programming Analogy | Why It Matters |
|---------|---------------------|----------------|
| Definite integral | `sum(f(x) * dx for x in range(a, b, infinitesimal))` | Accumulation pattern with infinitely small steps |
| Riemann sum | `sum(f(x_i) * delta_x for i in range(n))` | Actual for-loop approximation |
| Antiderivative | Finding `F` where `F' = f` | Inverse function lookup |
| Numerical integration | `scipy.integrate.quad()`, `numpy.trapz()` | Production-ready implementations |
| Area under curve | Running total / accumulator | State accumulation in loops |

**ML/Data Science Applications**:
- Probability: Area under PDF = 1, CDF = integral of PDF
- Expected value: E[X] = ∫ x·f(x) dx
- Numerical optimization: Simpson's rule, quadrature methods
- Signal processing: Convolution, Fourier transforms

---

## Confirmed Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| **D-120** | Widget name: `IntegrationExplorer` | Consistent with `LimitsExplorer` (Phase 13) and `DerivativeVisualizer` (Phase 14); "Explorer" suggests interactive discovery |
| **D-121** | Single view with collapsible panels (not tabs) | Matches existing widget patterns; keeps all context visible |
| **D-122** | Preset-based functions only (no arbitrary input) | Consistent with D-107 (limits) and D-113 (derivatives); safer, teachable |
| **D-123** | Include Simpson's rule in core scope | Important for showing O(1/n⁴) convergence; demonstrates why method choice matters |
| **D-124** | Signed area: Use color differentiation (blue positive, red negative) | Clear visual distinction; standard mathematical convention |
| **D-125** | Animation: Smooth n increment with easing | Better UX than discrete steps; shows continuous convergence |
| **D-126** | Focus on geometric interpretation over symbolic rules | Consistent with D-112 (derivatives); visual understanding first |
| **D-127** | URL state sync for shareable configurations | Consistent with existing widgets; enables educators to share specific examples |

---

## Scope

### In Scope

- **IntegrationExplorer widget**: Visualizes definite integrals with Riemann sum approximations
- **Area visualization panel**: SVG rendering of function curve with shaded area (signed)
- **Riemann sum overlay**: Rectangles/trapezoids for left, right, midpoint, trapezoidal, Simpson's
- **Convergence animation**: Smooth transition as n increases, showing approximation → exact
- **Results panel**: Approximation value, exact value, absolute/relative error
- **Math utilities** (`src/utils/math/integration.ts`): Numerical integration functions
- **Composable** (`src/composables/useIntegration.ts`): State management with URL sync
- **Content page** (`src/views/calculus/IntegrationView.vue`): Three-analogy block, pitfall callouts, Python examples
- **E2E tests**: Widget interactions, preset loading, accessibility audits
- **Unit tests**: Target 70+ tests for integration utilities

### Out of Scope (Future Enhancement)

- Indefinite integrals / symbolic antiderivative computation
- Integration techniques (substitution, by parts, partial fractions)
- Multiple integrals (double, triple)
- Line integrals and surface integrals
- Improper integrals (infinite bounds) — complex edge cases
- Monte Carlo integration — different conceptual approach
- Adaptive quadrature — advanced numerical method

---

## Widget Design: IntegrationExplorer

### Architecture

```
src/components/widgets/IntegrationExplorer/
├── IntegrationExplorer.vue      # Main orchestrator
├── FunctionSelector.vue         # Preset dropdown with formula display
├── IntegrationCanvas.vue        # SVG visualization (curve + area + Riemann shapes)
├── BoundsControls.vue           # Lower/upper bound inputs + n slider
├── MethodSelector.vue           # Radio buttons for Riemann sum methods
├── ConvergenceAnimation.vue     # Animation panel with play/pause/reset
├── ResultsDisplay.vue           # Approximation, exact, error display
└── index.ts                     # Barrel exports
```

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Function: ▼ x²]  Formula: f(x) = x²                           │
├─────────────────────────────────────────────────────────────────┤
│  Lower bound: [0]    Upper bound: [2]    Subdivisions (n): [10] │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                              ││
│  │     SVG Canvas:                                              ││
│  │     - Function curve (blue)                                  ││
│  │     - Shaded area (blue positive, red negative)              ││
│  │     - Riemann rectangles/trapezoids overlay                  ││
│  │     - Axis labels, grid lines                                ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Approximation: 2.640    Exact: 2.667    Error: 0.027 (1.0%)    │
│  Formula: ∫₀² x² dx = [x³/3]₀² = 8/3 ≈ 2.667                    │
├─────────────────────────────────────────────────────────────────┤
│  Method: ○ Left  ○ Right  ● Midpoint  ○ Trapezoidal  ○ Simpson  │
├─────────────────────────────────────────────────────────────────┤
│  [▶ Animate Convergence]  [Reset]      Speed: [●━━━━━]          │
└─────────────────────────────────────────────────────────────────┘
```

### Controls / Parameters

| Control | Meaning | Constraints | Default |
|---------|---------|-------------|---------|
| Function preset | Which function to integrate | Dropdown of presets | `quadratic` (x²) |
| Lower bound (a) | Left integration limit | Real number, a < b | 0 |
| Upper bound (b) | Right integration limit | Real number, a < b | 2 |
| Subdivisions (n) | Number of Riemann rectangles | 1 ≤ n ≤ 200, integer | 10 |
| Method | Riemann sum method | Enum: left, right, midpoint, trapezoidal, simpson | midpoint |
| Animation speed | How fast n increases during animation | 0.5x to 3x | 1x |

### Presets

| ID | Name | Function | Default Bounds | Exact Integral | Teaching Point |
|------|------|----------|----------------|----------------|----------------|
| `linear` | Linear | 2x + 1 | [0, 3] | 12 | Simplest case — area of trapezoid |
| `quadratic` | Quadratic | x² | [0, 2] | 8/3 ≈ 2.667 | Basic polynomial integration |
| `sine` | Sine | sin(x) | [0, π] | 2 | Trig function, nice exact value |
| `exponential` | Exponential | eˣ | [0, 1] | e - 1 ≈ 1.718 | Exponential rule |
| `reciprocal` | Reciprocal | 1/x | [1, e] | 1 | Natural log connection |
| `cubic-signed` | Cubic (signed area) | x³ - x | [-1, 2] | 2.25 | **Key preset**: Shows positive + negative area |
| `semicircle` | Semicircle | √(1-x²) | [-1, 1] | π/2 ≈ 1.571 | Geometric area = πr²/2 |
| `constant` | Constant | 3 | [0, 4] | 12 | Trivial case — rectangle |

### Riemann Sum Methods

| Method ID | Name | Formula | Convergence | Visual Representation |
|-----------|------|---------|-------------|----------------------|
| `left` | Left Riemann | Σ f(xᵢ) · Δx | O(1/n) | Rectangles aligned left |
| `right` | Right Riemann | Σ f(xᵢ₊₁) · Δx | O(1/n) | Rectangles aligned right |
| `midpoint` | Midpoint | Σ f((xᵢ + xᵢ₊₁)/2) · Δx | O(1/n²) | Rectangles centered |
| `trapezoidal` | Trapezoidal | ½Σ(f(xᵢ) + f(xᵢ₊₁)) · Δx | O(1/n²) | Trapezoids |
| `simpson` | Simpson's | Parabolic fit, requires even n | O(1/n⁴) | (Complex — show as smooth fill) |

### Convergence Animation Panel

```
┌─────────────────────────────────────────────────────────────────┐
│  Convergence Animation                                           │
│                                                                  │
│  [▶ Play]  [⏸ Pause]  [↺ Reset]                                  │
│                                                                  │
│  n: [4] ━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ [200]               │
│                                                                  │
│  Current: n = 4     Approx: 2.500     Error: 6.2%               │
│  Target:  n = 200   Approx: 2.667     Error: 0.01%              │
│                                                                  │
│  Speed: [0.5x] [1x●] [2x] [3x]                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Math Utilities

### `src/utils/math/integration.ts`

```ts
// ============== Types ==============

export type RiemannMethod = 'left' | 'right' | 'midpoint' | 'trapezoidal' | 'simpson'

export interface RiemannSumResult {
  /** Computed approximation of the integral */
  approximation: number
  /** Individual rectangle/trapezoid areas */
  areas: number[]
  /** Sample points used for evaluation */
  samplePoints: Array<{ x: number; y: number; width: number }>
  /** Total number of subdivisions */
  n: number
  /** Width of each subdivision */
  deltaX: number
}

export interface IntegrationResult {
  /** Numerical approximation */
  approximation: number
  /** Exact value if known */
  exactValue?: number
  /** Absolute error |approx - exact| */
  absoluteError?: number
  /** Relative error |approx - exact| / |exact| */
  relativeError?: number
  /** Method used */
  method: RiemannMethod
  /** Number of subdivisions */
  n: number
}

export interface IntegrationFunctionPreset {
  id: string
  name: string
  description: string
  fn: (x: number) => number
  /** The antiderivative F(x) where F'(x) = f(x) */
  antiderivative: (x: number) => number
  /** Compute exact integral via F(b) - F(a) */
  exactIntegral: (a: number, b: number) => number
  latex: string
  antiderivativeLatex: string
  defaultBounds: { a: number; b: number }
  /** Points where the function behavior is notable */
  interestingPoints?: Array<{ x: number; description: string }>
}

// ============== Constants ==============

export const DEFAULT_N = 10
export const MAX_N = 200
export const MIN_N = 1
export const DEFAULT_METHOD: RiemannMethod = 'midpoint'

// ============== Core Functions ==============

/**
 * Compute Riemann sum using specified method
 */
export function riemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
  method: RiemannMethod
): RiemannSumResult

/**
 * Left Riemann sum: Σ f(xᵢ) · Δx
 */
export function leftRiemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number
): RiemannSumResult

/**
 * Right Riemann sum: Σ f(xᵢ₊₁) · Δx
 */
export function rightRiemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number
): RiemannSumResult

/**
 * Midpoint Riemann sum: Σ f((xᵢ + xᵢ₊₁)/2) · Δx
 */
export function midpointRiemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number
): RiemannSumResult

/**
 * Trapezoidal rule: ½Σ(f(xᵢ) + f(xᵢ₊₁)) · Δx
 */
export function trapezoidalSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number
): RiemannSumResult

/**
 * Simpson's rule (requires even n)
 * Uses parabolic approximation for O(1/n⁴) convergence
 */
export function simpsonsRule(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number
): RiemannSumResult

/**
 * Evaluate integration with comparison to exact value
 */
export function evaluateIntegration(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
  method: RiemannMethod,
  exactFn?: (a: number, b: number) => number
): IntegrationResult

// ============== Preset Functions ==============

export const INTEGRATION_PRESETS: IntegrationFunctionPreset[]

export function getIntegrationPreset(id: string): IntegrationFunctionPreset | undefined

export function getIntegrationPresetIds(): string[]
```

### Test Coverage Target

- **Unit tests**: 70+ tests
- Key scenarios:
  - **Known integrals**: Verify against exact values (∫x² from 0 to 2 = 8/3)
  - **Edge cases**: n=1, n=2, a=b (zero width), negative bounds
  - **Method comparison**: Left vs right should bound true value for monotonic functions
  - **Convergence order**: Verify midpoint/trapezoidal converge faster than left/right
  - **Simpson's edge cases**: Odd n should throw/adjust, even n required
  - **Signed area**: Functions crossing x-axis (cubic-signed preset)
  - **Singular points**: 1/x with bounds approaching 0

---

## Content Structure

### Page

- Route: `/calculus/integration`
- View: `IntegrationView.vue`

### Sections

1. **Introduction** (expanded)
   - Hook: "Integration is summation with infinitely small steps"
   - Three-analogy block (everyday, programming, visual)
   - Key formula: ∫ₐᵇ f(x)dx = lim(n→∞) Σf(xᵢ)Δx

2. **What is Area Under a Curve?** (expanded)
   - Signed area concept (positive above, negative below x-axis)
   - Connection to accumulation (running totals)

3. **Widget: IntegrationExplorer** (expanded)
   - Full interactive widget
   - "Try these experiments" suggestions

4. **Riemann Sums: The Programmer's Approach** (expanded)
   - Each method explained with code analogy
   - Convergence rate comparison table
   - Code example: implementing Riemann sum as a for loop

5. **The Fundamental Theorem of Calculus** (collapsed)
   - FTC Part 1: d/dx ∫ₐˣ f(t)dt = f(x)
   - FTC Part 2: ∫ₐᵇ f(x)dx = F(b) - F(a)
   - Visual: derivative ↔ integral duality

6. **Common Pitfalls** (collapsed)
   - Forgetting the constant of integration (+C)
   - Ignoring signed area (negative contributions)
   - Wrong bounds (a and b swapped)
   - Simpson's rule with odd n

7. **In Python** (collapsed)
   - `scipy.integrate.quad()` — general numerical integration
   - `numpy.trapz()` — trapezoidal rule for data arrays
   - Manual implementation comparison
   - Performance considerations

8. **Related Topics**
   - Limits (foundation for the limit definition)
   - Derivatives (inverse operation)
   - Calculus Overview (return to section)
   - Probability Distributions (area under PDF)

---

## Increments

### Increment 21A: Math Utilities & Types (~2-3 hours)

**Tasks**:
1. Create `src/types/integration.ts` with types (or extend `math.ts`)
2. Create `src/utils/math/integration.ts`
3. Implement left, right, midpoint Riemann sums
4. Implement trapezoidal and Simpson's rules
5. Implement `evaluateIntegration` with error calculation
6. Create preset functions with antiderivatives
7. Create `src/utils/math/integration.test.ts` (70+ tests)

**Files**:
- `src/types/math.ts` (extend with integration types)
- `src/utils/math/integration.ts` (new)
- `src/utils/math/integration.test.ts` (new)

**Success Criteria**:
- All Riemann methods produce correct approximations
- Known integrals match exact values within expected error bounds
- Simpson's rule requires even n (validates or adjusts)
- Tests cover edge cases and convergence behavior

---

### Increment 21B: Composable & State Management (~1-2 hours)

**Tasks**:
1. Create `src/composables/useIntegration.ts`
2. Implement state: preset, bounds, n, method
3. Implement computed: approximation, exact, error, sample points
4. Implement URL state synchronization (with debouncing per LL-015)
5. Implement validation (a < b, n in range)
6. Add composable tests

**Files**:
- `src/composables/useIntegration.ts` (new)
- `src/composables/useIntegration.test.ts` (new)

**Success Criteria**:
- State changes trigger recomputation
- URL reflects non-default values
- Invalid bounds rejected (a ≥ b)
- Preset selection updates bounds to defaults

---

### Increment 21C: Widget Core Components (~3-4 hours)

**Tasks**:
1. Create widget component directory structure
2. Build `FunctionSelector.vue` (dropdown + formula display)
3. Build `BoundsControls.vue` (a, b inputs + n slider)
4. Build `MethodSelector.vue` (radio buttons for methods)
5. Build `ResultsDisplay.vue` (approximation, exact, error)
6. Build `IntegrationCanvas.vue`:
   - SVG with function curve
   - Shaded area (signed color)
   - Riemann rectangles/trapezoids overlay
7. Wire up `IntegrationExplorer.vue` orchestrator

**Files**:
- `src/components/widgets/IntegrationExplorer/` (new directory)
  - `IntegrationExplorer.vue`
  - `FunctionSelector.vue`
  - `BoundsControls.vue`
  - `MethodSelector.vue`
  - `ResultsDisplay.vue`
  - `IntegrationCanvas.vue`
  - `index.ts`
- `src/components/widgets/index.ts` (add export)

**Success Criteria**:
- Widget renders and responds to interactions
- Riemann shapes correctly positioned on canvas
- Signed area displayed with correct colors
- All methods produce visually distinct outputs
- Responsive layout works on mobile

---

### Increment 21D: Convergence Animation (~1-2 hours)

**Tasks**:
1. Build `ConvergenceAnimation.vue` panel
2. Implement smooth n increment animation (requestAnimationFrame)
3. Add play/pause/reset controls
4. Add speed control (0.5x to 3x)
5. Show real-time approximation and error during animation

**Files**:
- `src/components/widgets/IntegrationExplorer/ConvergenceAnimation.vue` (new)
- Update `IntegrationExplorer.vue` to include animation panel

**Success Criteria**:
- Animation smoothly increases n from current to max
- Pause/resume works correctly
- Reset returns to initial n
- Speed control affects animation rate
- Error visibly decreases during animation

---

### Increment 21E: Content Page (~2-3 hours)

**Tasks**:
1. Create `src/views/calculus/IntegrationView.vue`
2. Write introduction with three-analogy block
3. Add "What is Area Under a Curve?" section
4. Embed IntegrationExplorer widget
5. Write Riemann sums explanation with code
6. Add FTC section (collapsed)
7. Add Common Pitfalls section (collapsed)
8. Add Python examples (collapsed)
9. Add Related Topics
10. Update router to add `/calculus/integration` route
11. Update `CalculusIndexView.vue` to mark Integration as available
12. Update navigation data if needed

**Files**:
- `src/views/calculus/IntegrationView.vue` (new)
- `src/router/index.ts` (add route)
- `src/views/calculus/CalculusIndexView.vue` (update available: true)
- `src/data/navigation.ts` (if needed)

**Success Criteria**:
- Page follows design system (three-analogy block, pitfall callout)
- All CodeExample components have unique IDs
- Related Topics links work
- Dark mode renders correctly

---

### Increment 21F: E2E Tests & Polish (~1-2 hours)

**Tasks**:
1. Create `e2e/widgets/integration-explorer.spec.ts`
2. Test preset selection, bounds changes, method changes
3. Test animation controls
4. Test URL state synchronization
5. Add accessibility audit for IntegrationView
6. Final polish: fix any visual issues, ensure ESLint passes

**Files**:
- `e2e/widgets/integration-explorer.spec.ts` (new)
- `e2e/accessibility/integration.spec.ts` (new or extend existing)

**Success Criteria**:
- All E2E tests pass
- Accessibility audit passes (WCAG 2.1 AA)
- `npm run lint` passes
- `npm run type-check` passes
- `npm run build` succeeds

---

## Lessons Learned to Apply

From `docs/LL_LI.md`:

| ID | Lesson | Application to Phase 21 |
|----|--------|------------------------|
| LL-015 | URL state sync requires debouncing | Debounce integration bound/n changes (300ms) |
| LL-041, LL-070 | Use HTML entities for `<` and `>` in templates | Use `&lt;` and `&gt;` in error comparisons |
| LL-068 | Computed properties need explicit returns | Add default cases to switch statements in composable |
| LL-069 | Import aliasing for unused exports | Use `as _name` for exports used only in tests |
| LI-011 | SVG for data visualizations | Use SVG for Riemann sum visualization |
| LI-017 | Preset data as single source of truth | Rich preset objects include fn, antiderivative, latex |
| LI-024 | Preset-based widget pattern | Don't allow arbitrary user function input |
| LI-033 | Composable for complex state | Create useIntegration composable |
| D-112 | Focus on geometric interpretation | Emphasize visual area, not symbolic rules |

---

## Archive References

For content inspiration (adapt, don't copy):

| Archive File | Relevant Content |
|--------------|-----------------|
| `archive/snake-math/docs/.vitepress/theme/components/SummationDemo.vue` | Discrete summation visualization pattern |
| `archive/snake-math/docs/basics/summation.md` | Summation explanation style |

The integral formula is already shown in `CalculusIndexView.vue`:
```
∫_a^b f(x) dx = lim_{n → ∞} Σ_{i=1}^n f(x_i) Δx
```

---

## Open Questions

1. **Simpson's visualization**: Should Simpson's rule show actual parabolic segments, or just show smooth fill like the exact area? (Tentative: smooth fill for simplicity)

2. **Mobile touch**: Should n slider support touch-drag on mobile? (Yes, use native range input)

3. **Error formatting**: Display absolute error, relative error, or both? (Tentative: both, with relative as percentage)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| SVG performance with high n | Sluggish animation for n > 100 | Limit max visible rectangles; aggregate for display |
| Simpson's rule complexity | Confusing for beginners | Mark as "Advanced" in UI; good tooltip explanation |
| Signed area confusion | Users misunderstand negative area | Clear color coding (blue/red) + explicit legend |
| Canvas coordinate math | Off-by-one errors in Riemann rectangles | Thorough unit tests; visual QA at n=1,2,3 |

---

## Success Criteria

Phase 21 is successful when:

1. ✅ User can visualize definite integrals as area under curves
2. ✅ User sees how Riemann sums converge to the integral as n → ∞
3. ✅ User understands numerical integration is "just a for loop with small steps"
4. ✅ User can compare different Riemann sum methods (left, right, midpoint, trapezoidal, Simpson's)
5. ✅ Signed area (negative below x-axis) is clearly visualized
6. ✅ Content page connects integration to programming (scipy, numpy)
7. ✅ All E2E tests pass including accessibility audits
8. ✅ Unit tests cover numerical integration functions (70+ tests)
9. ✅ `npm run type-check && npm run lint && npm run test && npm run build` all pass

---

**Ready for Implementation**: This plan provides all context needed to implement Phase 21 following the established patterns from Phases 13 and 14.
