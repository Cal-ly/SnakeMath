# Phase 21 Planning Handover: Integration (Integral Calculus)

**Purpose**: This document provides all necessary context for planning Phase 21. The planning session should produce a comprehensive Phase Plan document following `docs/planning/PHASE_TEMPLATE_PLAN.md`.

---

## Current State Summary

**Phase 20 Complete** — The Statistics section is now finished with 5 subtopics. The codebase has:
- 1744 unit tests (Vitest)
- E2E tests (Playwright) with tiered CI approach
- 20 interactive widgets following established patterns
- Comprehensive documentation (DECISIONS.md, LL_LI.md, DESIGN_SYSTEM.md)

**Calculus Section Status**:
- `/calculus/limits` — ✅ Complete (LimitsExplorer widget, Phase 13)
- `/calculus/derivatives` — ✅ Complete (DerivativeVisualizer widget, Phase 14)
- `/calculus/integration` — 🎯 Phase 21 target (marked "Coming Soon" in CalculusIndexView.vue)

---

## Strategic Context

### Why Integration Now?

1. **Completes the Calculus Trinity**: Limits → Derivatives → Integrals forms the complete calculus foundation
2. **Fundamental Theorem Connection**: Integration is the inverse of differentiation — this duality should be demonstrated
3. **ML Pipeline Completion**: Integration is essential for:
   - Probability density functions (area under PDF = 1)
   - Cumulative distribution functions (CDF = integral of PDF)
   - Expected value calculations
   - Numerical optimization (Simpson's rule, etc.)

### Programmer Framing (Essential)

| Concept | Programming Analogy | Why It Matters |
|---------|---------------------|----------------|
| Definite integral | Summation with infinitely many infinitesimal terms | `sum(f(x) * dx for x in range(a, b, infinitesimal))` |
| Riemann sum | Actual summation loop | `sum(f(x_i) * delta_x for i in range(n))` |
| Antiderivative | Inverse function lookup | Finding `F` such that `F' = f` |
| Area under curve | Accumulator pattern | Running total of signed area |
| Numerical integration | For-loop approximation | `scipy.integrate.quad()`, `numpy.trapz()` |

---

## Existing Patterns to Follow

### Widget Architecture (from Phase 14 DerivativeVisualizer)

```
src/components/widgets/DerivativeVisualizer/
├── DerivativeVisualizer.vue    # Main orchestrator
├── FunctionSelector.vue        # Preset dropdown
├── DerivativeCanvas.vue        # SVG visualization
├── SecantControls.vue          # Parameter controls
├── SecantAnimation.vue         # Animation panel
├── DerivativeDisplay.vue       # Results panel
└── index.ts                    # Barrel exports
```

The IntegrationExplorer should follow a similar structure.

### Math Utilities Pattern (from derivative.ts)

```typescript
// Constants
export const DEFAULT_H = 0.0001
export const DERIVATIVE_TOLERANCE = 1e-6

// Core functions
export function centralDifference(fn, x, h): number
export function forwardDifference(fn, x, h): number

// Presets with consistent structure
export const derivativeFunctionPresets: DerivativeFunctionPreset[]
```

### Composable Pattern (from useDerivative.ts)

```typescript
export function useDerivative(options: UseDerivativeOptions = {}) {
  // State management with refs
  // Computed properties for derived values
  // URL state synchronization (optional)
  // Methods for user interactions

  return { /* reactive state and methods */ }
}
```

### Lessons Learned to Apply

From `docs/LL_LI.md`:

| ID | Lesson | Application to Phase 21 |
|----|--------|-------------------------|
| LL-015 | URL state sync requires debouncing | Debounce integration bound changes |
| LL-041, LL-070 | Use HTML entities for `<` and `>` in templates | Watch for `< 0` in effect size / area displays |
| LL-068 | Computed properties need explicit returns | Add default cases to switch statements |
| LL-069 | Import aliasing for unused exports | Use `as _name` for future-use imports |
| LI-011 | SVG for data visualizations | Use SVG for area visualization |
| LI-017 | Preset data as single source of truth | Rich preset objects with function, latex, description |
| LI-024 | Preset-based widget pattern | Don't allow arbitrary user expressions |
| LI-033 | Composable for complex state | Create useIntegration composable |
| D-112 | Focus on geometric interpretation | Emphasize area under curve visually |

---

## Scope Suggestions

### In Scope (Recommended)

1. **IntegrationExplorer Widget**
   - Definite integral visualization (area under curve)
   - Riemann sum demonstration (left, right, midpoint, trapezoidal)
   - Adjustable number of rectangles/trapezoids (n slider)
   - Real-time numerical approximation vs exact value
   - Animation showing convergence as n → ∞

2. **Math Utilities** (`src/utils/math/integration.ts`)
   - Numerical integration methods (trapezoidal, Simpson's, midpoint)
   - Riemann sum calculations
   - Preset functions with known antiderivatives
   - Exact vs approximate comparison

3. **Content Page** (`src/views/calculus/IntegrationView.vue`)
   - Three-analogy block (everyday, programming, visual)
   - Common pitfall callout (forgetting +C, negative area)
   - Fundamental Theorem of Calculus connection
   - Python code examples (scipy.integrate, numpy)

4. **E2E Tests**
   - Widget interactions
   - Preset loading
   - Animation controls
   - Accessibility audits

### Out of Scope (Future Enhancements)

- Indefinite integrals / antiderivative finding
- Integration techniques (substitution, by parts, partial fractions)
- Multiple integrals
- Line/surface integrals
- Improper integrals (infinite bounds)

---

## Design Suggestions

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Function Selector ▼]  [Integration Method ▼]                   │
├─────────────────────────────────────────────────────────────────┤
│  Lower bound: [a___]    Upper bound: [b___]    Subdivisions: [n]│
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                              ││
│  │     SVG Canvas: Function curve + shaded area under curve    ││
│  │     + Riemann rectangles/trapezoids overlay                 ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Approximation: 12.345    Exact: 12.333    Error: 0.012 (0.1%) │
│  Formula: ∫₀² x² dx = [x³/3]₀² = 8/3 ≈ 2.667                   │
├─────────────────────────────────────────────────────────────────┤
│  [▶ Animate]  [Reset]                                           │
│  ○ Left  ○ Right  ○ Midpoint  ○ Trapezoidal  ○ Simpson's        │
├─────────────────────────────────────────────────────────────────┤
│  [Preset: x²] [Preset: sin(x)] [Preset: e^x] [Preset: 1/x]     │
└─────────────────────────────────────────────────────────────────┘
```

### Presets (Recommended)

| Name | Function | Bounds | Exact Integral | Teaching Point |
|------|----------|--------|----------------|----------------|
| Quadratic | x² | [0, 2] | 8/3 | Basic polynomial integration |
| Linear | 2x + 1 | [0, 3] | 12 | Simplest case |
| Sine | sin(x) | [0, π] | 2 | Trig integration |
| Exponential | e^x | [0, 1] | e - 1 | Exponential rule |
| Reciprocal | 1/x | [1, e] | 1 | Natural logarithm connection |
| Cubic | x³ - x | [-1, 2] | 2.25 | Signed area (crosses axis) |
| Semicircle | √(1-x²) | [-1, 1] | π/2 | Area = πr²/2 |
| Constant | 3 | [0, 4] | 12 | Rectangle (trivial case) |

### Riemann Sum Methods

| Method | Description | Convergence | Visual |
|--------|-------------|-------------|--------|
| Left Riemann | Use f(xᵢ) at left endpoint | O(1/n) | Rectangles left-aligned |
| Right Riemann | Use f(xᵢ₊₁) at right endpoint | O(1/n) | Rectangles right-aligned |
| Midpoint | Use f((xᵢ + xᵢ₊₁)/2) | O(1/n²) | Rectangles centered |
| Trapezoidal | Average of left + right | O(1/n²) | Trapezoids |
| Simpson's | Parabolic approximation | O(1/n⁴) | (Advanced, optional) |

---

## Key Files to Reference

| Purpose | File Path |
|---------|-----------|
| Derivative utilities (pattern) | `src/utils/math/derivative.ts` |
| Derivative composable (pattern) | `src/composables/useDerivative.ts` |
| Derivative widget (pattern) | `src/components/widgets/DerivativeVisualizer/` |
| Limits utilities | `src/utils/math/limits.ts` |
| Calculus index page | `src/views/calculus/CalculusIndexView.vue` |
| Derivatives view (pattern) | `src/views/calculus/DerivativesView.vue` |
| Design system | `docs/DESIGN_SYSTEM.md` |
| Lessons learned | `docs/LL_LI.md` |
| Phase template | `docs/planning/PHASE_TEMPLATE_PLAN.md` |
| Navigation data | `src/data/navigation.ts` |
| Router config | `src/router/index.ts` |

---

## Decision Points for Planning

The planning session should make decisions on:

1. **Widget Name**: `IntegrationExplorer` vs `IntegralVisualizer` vs `RiemannSumExplorer`
2. **Tab Structure**: Single view vs tabbed (Explorer | Convergence Demo | Methods Comparison)
3. **Animation Approach**: Increment n smoothly vs step through n values
4. **Simpson's Rule**: Include in Phase 21 or defer?
5. **FTC Demo**: Dedicated panel showing derivative ↔ integral relationship?
6. **Signed Area Handling**: How to visualize negative area (below x-axis)?

---

## Success Criteria

Phase 21 is successful when:

1. User can visualize definite integrals as area under curves
2. User sees how Riemann sums converge to the integral as n → ∞
3. User understands numerical integration is "just a for loop with small steps"
4. User can compare different Riemann sum methods
5. Content page connects integration to programming (scipy, numpy)
6. All E2E tests pass including accessibility audits
7. Unit tests cover numerical integration functions (target: 60+ tests)

---

## Notes for the Planning Session

1. **Follow PHASE_TEMPLATE_PLAN.md structure** — Fill in all sections
2. **Reference DESIGN_SYSTEM.md** — Three-analogy blocks, pitfall callouts, CodeExample IDs
3. **Consider LL_LI.md lessons** — Especially LL-068, LL-069, LL-070 for ESLint issues
4. **Maintain consistency** with Phase 13 (Limits) and Phase 14 (Derivatives)
5. **Don't over-engineer** — Start with core visualization, add features incrementally
6. **URL state sync** — Enable shareable links for specific function/bounds/n configurations

---

## Archive References

For content inspiration (adapt, don't copy):
- `archive/snake-math/docs/.vitepress/theme/components/SummationDemo.vue` — Has discrete integration mention
- The integral formula is already shown in `CalculusIndexView.vue`

---

**Ready for Planning**: This handover provides all context needed to create a detailed Phase 21 Plan following the template structure.
