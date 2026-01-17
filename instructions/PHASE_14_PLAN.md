# Phase 14: Calculus — Derivatives

**Theme**: *The Slope of Change*

**Goal**: Visualize derivatives as tangent line slopes, connect to limits, and demonstrate the foundation of optimization algorithms like gradient descent.

---

## Strategic Context

Derivatives are the bridge from limits to practical applications in machine learning and optimization:

| Concept | Programming Connection |
|---------|------------------------|
| Derivative definition | Limit of difference quotient → numerical differentiation |
| Tangent line | Linear approximation at a point |
| Slope | Rate of change → velocity, acceleration |
| Secant → Tangent | `(f(x+h) - f(x)) / h` as h→0 |
| Derivative rules | Automatic differentiation building blocks |
| Gradient | Vector of partial derivatives → gradient descent |
| Local minima/maxima | Optimization, loss function minimization |

Phase 14 completes the calculus section and directly connects to AI/ML foundations (Phase 15+).

---

## Connections to Phase 13 (Limits)

The derivative is defined as a limit:

$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

This phase builds directly on Phase 13's limit infrastructure:
- Reuse numerical approximation patterns
- Show h→0 visually (secant lines converging to tangent)
- Connect ε-δ intuition to derivative precision

---

## Scope Decisions

### D-112: Focus on Geometric Interpretation

**Decision**: Emphasize the visual/geometric meaning (tangent line slope) over symbolic differentiation rules.

**Rationale**:
- Programmers benefit from visual understanding
- Symbolic rules are well-covered in textbooks
- Numerical differentiation is more relevant to ML
- Tangent line visualization creates "aha moment"

**Question 1**: Confirm focus on geometry over symbolic rules? (Recommended: Yes, but include common rules as reference)

---

### D-113: Preset Functions (Consistent with D-107)

**Decision**: Use preset functions rather than arbitrary input, consistent with LimitsExplorer.

**Rationale**:
- Curated examples with known derivatives
- Safe evaluation without expression parsing
- Educational progression (linear → polynomial → trig → exponential)
- Can show exact vs. numerical derivative comparison

**Question 2**: Confirm preset-based approach? (Recommended: Yes)

---

### D-114: Secant-to-Tangent Animation

**Decision**: Include animation showing secant lines converging to tangent as h→0.

**Rationale**:
- Directly visualizes the limit definition
- Creates compelling visual demonstration
- Connects to Phase 13 concepts
- Shows why derivative is "instantaneous rate of change"

**Question 3**: Include secant-to-tangent animation? (Recommended: Yes)

---

## Widget Design: DerivativeVisualizer

### Visual Concept

```
    y
    ↑
    │      ╱ tangent line
    │    ●╱
    │   ╱│  secant lines (fading)
    │  ╱ │ ╲
    │ ╱  │  ╲
    │╱   │   ╲ f(x)
    └────┼────────→ x
         a
    
    Slope at x=a: f'(a) = 2.5
    
    [──●──] x slider
    [Play ▶] Animate h→0
```

### Architecture

```
src/components/widgets/DerivativeVisualizer/
├── DerivativeVisualizer.vue    # Main orchestrator
├── DerivativeCanvas.vue        # SVG with function, tangent, secants
├── FunctionSelector.vue        # Preset function buttons (reuse pattern)
├── PointSelector.vue           # X-value selection slider
├── TangentDisplay.vue          # Tangent line equation, slope value
├── SecantAnimation.vue         # Secant lines converging animation
├── DerivativeInfo.vue          # Derivative value, formula, interpretation
└── index.ts                    # Exports
```

### Core Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Function curve | Must | SVG path showing f(x) |
| Point selection | Must | Choose x-value for tangent |
| Tangent line | Must | Line tangent to curve at selected point |
| Slope display | Must | Show f'(x) value |
| Secant lines | Should | Show secant lines for various h values |
| Secant animation | Should | Animate h→0 showing convergence |
| Derivative function | Should | Toggle to show f'(x) curve overlay |
| Numerical vs exact | Nice | Compare numerical and symbolic derivative |
| URL state sync | Must | Shareable configurations |

### Preset Functions

| ID | Function f(x) | Derivative f'(x) | Educational Purpose |
|----|---------------|------------------|---------------------|
| `linear` | f(x) = 2x + 1 | f'(x) = 2 | Constant slope |
| `quadratic` | f(x) = x² | f'(x) = 2x | Variable slope, power rule |
| `cubic` | f(x) = x³ | f'(x) = 3x² | Inflection point |
| `sine` | f(x) = sin(x) | f'(x) = cos(x) | Trig derivatives |
| `cosine` | f(x) = cos(x) | f'(x) = -sin(x) | Phase shift |
| `exponential` | f(x) = eˣ | f'(x) = eˣ | Self-derivative |
| `logarithm` | f(x) = ln(x) | f'(x) = 1/x | Inverse relationship |
| `polynomial` | f(x) = x³ - 3x | f'(x) = 3x² - 3 | Local min/max |

### Visualization Details

**Canvas Layout** (reuse CoordinateSystem):
- Function curve: Primary color (`emerald-600`)
- Tangent line: Accent color (`blue-500`) with extended dashes
- Secant lines: Fading opacity (`gray-400` to `gray-200`)
- Point of tangency: Highlighted dot (`red-500`)
- Derivative curve (optional): Secondary color (`purple-500`)

**Animation**:
- Secant lines for h = 1, 0.5, 0.2, 0.1, 0.05, 0.01
- Each line fades as next appears
- Final tangent line emphasized
- Play/pause control

---

## Math Utilities

### File: `src/utils/math/derivative.ts`

```typescript
// Types
export interface DerivativeResult {
  value: number
  exactValue?: number  // If known symbolically
  method: 'numerical' | 'exact'
}

export interface TangentLine {
  slope: number
  yIntercept: number
  point: { x: number; y: number }
}

export interface SecantLine {
  slope: number
  h: number
  point1: { x: number; y: number }
  point2: { x: number; y: number }
}

export interface DerivativeFunctionPreset {
  id: string
  name: string
  description: string
  fn: (x: number) => number
  derivative: (x: number) => number  // Exact derivative
  derivativeLatex: string
  latex: string
  domain: { min: number; max: number }
  interestingPoints: number[]  // Critical points, inflection, etc.
}

// Core Functions
export function numericalDerivative(
  fn: (x: number) => number,
  x: number,
  h?: number
): number

export function centralDifference(
  fn: (x: number) => number,
  x: number,
  h?: number
): number  // More accurate: (f(x+h) - f(x-h)) / 2h

export function forwardDifference(
  fn: (x: number) => number,
  x: number,
  h?: number
): number  // (f(x+h) - f(x)) / h

export function calculateTangentLine(
  fn: (x: number) => number,
  x: number,
  derivative?: number
): TangentLine

export function calculateSecantLine(
  fn: (x: number) => number,
  x: number,
  h: number
): SecantLine

export function generateSecantSequence(
  fn: (x: number) => number,
  x: number,
  hValues?: number[]
): SecantLine[]

// Analysis
export function findCriticalPoints(
  derivative: (x: number) => number,
  domain: { min: number; max: number },
  tolerance?: number
): number[]

export function classifyPoint(
  fn: (x: number) => number,
  derivative: (x: number) => number,
  x: number
): 'local-min' | 'local-max' | 'inflection' | 'none'

// Presets
export const DERIVATIVE_PRESETS: DerivativeFunctionPreset[]
export function getDerivativePreset(id: string): DerivativeFunctionPreset | undefined

// Constants
export const DEFAULT_H = 0.0001
export const SECANT_H_VALUES = [1, 0.5, 0.2, 0.1, 0.05, 0.01]
```

**Test Coverage Target**: 50+ tests covering:
- Numerical derivative accuracy
- Central vs forward difference
- Tangent line calculation
- Secant sequence generation
- All preset functions
- Critical point detection
- Edge cases (discontinuities, vertical tangents)

---

## Content Structure

### Derivatives Content Page

`/calculus/derivatives` - `DerivativesView.vue`

**Sections**:

1. **What is a Derivative?** (Intro, expanded by default)
   - Rate of change intuition
   - Slope of tangent line
   - "Instantaneous velocity" analogy
   - Programming analogy: `delta_y / delta_x` as `delta_x → 0`

2. **Interactive Derivative Explorer** (Widget)
   - DerivativeVisualizer widget with URL sync
   - Code parallel showing numerical differentiation

3. **From Secants to Tangents** (Collapsible)
   - Secant line definition
   - Limit as h→0 (link to Limits page)
   - Animation explanation
   - Python code: forward/central difference

4. **The Derivative as a Function** (Collapsible)
   - f(x) → f'(x) transformation
   - Derivative curve visualization
   - Second derivative preview

5. **Common Derivative Rules** (Collapsible, reference)
   - Power rule: d/dx[xⁿ] = nxⁿ⁻¹
   - Constant rule: d/dx[c] = 0
   - Sum rule: d/dx[f+g] = f' + g'
   - Product rule (brief)
   - Chain rule (brief)
   - Table of common derivatives

6. **Critical Points** (Collapsible)
   - Where f'(x) = 0
   - Local minima and maxima
   - Connection to optimization

7. **Programmer Applications** (Key highlight)
   - **Numerical differentiation**: Forward, central, backward difference
   - **Gradient descent**: `x_new = x - learning_rate * f'(x)`
   - **Automatic differentiation**: How ML frameworks compute gradients
   - **Physics simulations**: Velocity = derivative of position
   - **Sensitivity analysis**: How outputs change with inputs

8. **Related Topics**
   - Link to Limits (foundation)
   - Link to Exponentials (e^x is its own derivative)
   - Link to Trigonometry (sin/cos derivatives)
   - Preview: Integrals (coming in future phase)

---

## Increments

### Increment 14A: Derivative Math Utilities (~45 min)

**Tasks**:
1. Add derivative types to `src/types/math.ts`
2. Create `src/utils/math/derivative.ts` with:
   - `numericalDerivative`, `centralDifference`, `forwardDifference`
   - `calculateTangentLine`, `calculateSecantLine`
   - `generateSecantSequence`
   - `findCriticalPoints`, `classifyPoint`
   - `DERIVATIVE_PRESETS` (8 preset functions with exact derivatives)
3. Create `src/utils/math/derivative.test.ts` with 50+ tests

**Success Criteria**:
- All tests pass
- Numerical derivatives accurate to 1e-6 for smooth functions
- All preset functions have verified exact derivatives

---

### Increment 14B: DerivativeVisualizer Widget Core (~60 min)

**Tasks**:
1. Create `src/composables/useDerivative.ts` for state + URL sync
2. Create widget components:
   - `DerivativeVisualizer.vue` (main orchestrator)
   - `FunctionSelector.vue` (preset buttons, can reuse LimitsExplorer pattern)
   - `DerivativeCanvas.vue` (SVG with function curve, tangent line)
   - `PointSelector.vue` (x-value slider)
3. Implement function curve and tangent line rendering

**Success Criteria**:
- Can select preset functions
- Function curve renders correctly
- Tangent line appears at selected point
- Slope value displayed

---

### Increment 14C: Secant Animation & Derivative Display (~45 min)

**Tasks**:
1. Create `SecantAnimation.vue` (secant lines with h→0 animation)
2. Create `TangentDisplay.vue` (tangent equation, slope, interpretation)
3. Create `DerivativeInfo.vue` (numerical vs exact comparison)
4. Add play/pause controls for animation
5. Optional: Toggle to show f'(x) curve overlay

**Success Criteria**:
- Secant animation shows convergence to tangent
- Play/pause works correctly
- Derivative info panel shows accurate values

---

### Increment 14D: Content Page (~45 min)

**Tasks**:
1. Create `DerivativesView.vue` comprehensive content page
2. Update routes and navigation
3. Update CalculusIndexView.vue to link to derivatives
4. Include Python code examples (numerical differentiation, gradient descent)
5. Add Related Topics section

**Success Criteria**:
- Navigation works
- Content renders properly
- Widget integrated with URL sync
- Code examples accurate and educational

---

### Increment 14E: E2E Tests & Polish (~30 min)

**Tasks**:
1. Create `e2e/calculus/derivative-visualizer.spec.ts` (15+ tests)
2. Add accessibility tests for derivatives page
3. Visual regression baseline updates
4. Polish: mobile responsiveness, keyboard navigation, animation timing

**Success Criteria**:
- All E2E tests pass
- Accessibility audit passes
- Widget usable on mobile
- Animation smooth and educational

---

## Estimated Total Time

| Increment | Time |
|-----------|------|
| 14A: Derivative Utilities | 45 min |
| 14B: Widget Core | 60 min |
| 14C: Secant Animation & Display | 45 min |
| 14D: Content Page | 45 min |
| 14E: E2E & Polish | 30 min |
| **Total** | **~3.75 hours** |

---

## Technical Decisions Summary

| ID | Decision | Status |
|----|----------|--------|
| D-112 | Geometric interpretation over symbolic rules | Pending confirmation |
| D-113 | Preset functions (consistent with D-107) | Pending confirmation |
| D-114 | Secant-to-tangent animation | Pending confirmation |
| D-115 | Numerical derivative using central difference | Confirmed |
| D-116 | Composable pattern (useDerivative) | Confirmed |

### D-115: Central Difference for Numerical Derivative

**Decision**: Use central difference `(f(x+h) - f(x-h)) / 2h` as primary numerical method.

**Rationale**:
- More accurate than forward difference (O(h²) vs O(h) error)
- Standard in numerical computing
- Forward difference shown for educational comparison
- Matches what ML frameworks actually use

---

### D-116: Composable Pattern for Derivative State

**Decision**: Create `useDerivative` composable following established patterns.

**Rationale**:
- Consistent with useLimits, useVectors, useMatrixTransformations
- Separates state logic from presentation
- Supports URL state synchronization
- Testable independently

---

## Archive Reference

**No direct derivative components in archive** - building from scratch using established patterns.

**Content reference** (limited):
- `archive/snake-math/docs/calculus/limits/applications.md` mentions derivative preview

**Reusable infrastructure from previous phases**:
- CoordinateSystem, PlotCurve, PlotPoint, PlotLine components
- Animation patterns from SummationExplorer, LimitsExplorer
- URL state sync patterns
- Composable architecture

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Animation timing issues | Medium | Low | Use requestAnimationFrame, test on various devices |
| Numerical precision for steep slopes | Medium | Medium | Use central difference, handle edge cases |
| Tangent line extending off canvas | Low | Low | Clip to viewBox bounds |
| Secant lines cluttering visualization | Medium | Low | Fade out old lines, limit display count |

---

## Success Metrics

- [ ] All unit tests pass (50+)
- [ ] All E2E tests pass (15+)
- [ ] Accessibility audit passes
- [ ] Widget URL sync works
- [ ] Mobile responsive
- [ ] Secant-to-tangent animation clearly shows convergence
- [ ] Numerical derivative matches exact within tolerance
- [ ] Gradient descent example in content is educational

---

## Post-Phase Evaluation

After Phase 14, evaluate:
- Is the derivative visualization intuitive?
- Does secant animation effectively show the limit concept?
- Ready for Phase 15+ (AI/ML foundations)?
- Should we add integrals before ML content?
- Performance with animation smooth?

---

## Phase 14 Completes Calculus Section

With Phase 14, the calculus section will have:
- **Limits** (Phase 13) - Foundation concept
- **Derivatives** (Phase 14) - Rate of change, optimization preview

Future phases can add:
- **Integrals** - Area under curve, fundamental theorem
- **Partial Derivatives** - Multivariate calculus for ML
- **Gradient Descent Deep Dive** - Bridge to AI/ML

---

## Numbering Reference

**Current counts** (Phase 14 starts here):
- Decisions: D-112 onwards (latest is D-111)
- Lessons Learned: LL-049 onwards (latest is LL-048)
- Lessons Identified: LI-056 onwards (latest is LI-055)
