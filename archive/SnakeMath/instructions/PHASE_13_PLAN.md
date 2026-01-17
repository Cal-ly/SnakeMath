# Phase 13: Calculus — Limits

**Theme**: *Approaching the Edge*

**Goal**: Visualize limits with ε-δ bands and introduce continuity concepts, connecting to numerical methods and algorithm convergence.

---

## Strategic Context

Limits are the foundation of calculus and connect to programming in several ways:

| Concept | Programming Connection |
|---------|------------------------|
| Limit definition | Tolerance-based convergence (`abs(x - target) < epsilon`) |
| ε-δ definition | Error bounds in numerical methods |
| One-sided limits | Edge cases, boundary conditions |
| Continuity | Smooth functions vs. step functions |
| Discontinuities | Division by zero, undefined behavior |
| Rate of change | Derivative preview, instantaneous vs. average |

Phase 13 marks the beginning of calculus content, building toward derivatives (Phase 14) and eventually AI/ML optimization concepts.

---

## Scope Decisions

### D-106: Focus on Intuition Over Rigor

**Decision**: Emphasize visual/intuitive understanding of limits over formal ε-δ proofs.

**Rationale**:
- Programmers learn better through visualization and experimentation
- Formal proofs are available in textbooks; we provide the "aha moment"
- Interactive ε-δ bands let users discover the relationship
- Content can reference formal definitions without requiring proof construction

**Question 1**: Should we include formal ε-δ proof construction, or focus on visual demonstration? (Recommended: Visual demonstration with optional formal definition shown)

### D-107: Preset Functions Over Arbitrary Input

**Decision**: Use preset functions that demonstrate key limit behaviors rather than arbitrary function input.

**Rationale**:
- Consistent with established widget pattern (D-008/R-008)
- Curated examples ensure educational value
- Avoids expression parsing complexity and security concerns
- Each preset demonstrates a specific concept (continuous, removable discontinuity, jump, asymptote)

**Question 2**: Confirm preset-based approach? (Recommended: Yes)

---

## Widget Design: LimitsExplorer

### Visual Concept

Show a function curve with an approach point, epsilon band (horizontal), and delta interval (vertical):

```
    y
    ↑
    │         ╭───────╮  ← ε band (target ± ε)
    │    ●────┤  L    │
    │   ╱     ╰───────╯
    │  ╱        ↑
    │ ╱         │
    └───────────┼─────→ x
              a ± δ
              (delta interval)
```

### Architecture

```
src/components/widgets/LimitsExplorer/
├── LimitsExplorer.vue           # Main orchestrator
├── LimitCanvas.vue              # SVG with function, ε-δ bands
├── FunctionSelector.vue         # Preset function buttons
├── ApproachControls.vue         # Approach point (a), direction
├── EpsilonDeltaControls.vue     # ε and δ sliders
├── LimitDisplay.vue             # Limit values, continuity status
├── LimitPresets.vue             # Quick-select preset configurations
└── index.ts                     # Exports
```

### Core Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Function curve | Must | SVG path showing f(x) |
| Approach point selector | Must | Choose point a to approach |
| Epsilon band | Must | Horizontal band at L ± ε |
| Delta interval | Must | Vertical shading at a ± δ |
| Left/right limits | Must | Show lim x→a⁻ and lim x→a⁺ |
| Limit value display | Must | Show computed limit L |
| Continuity status | Must | Continuous, removable, jump, infinite |
| Preset functions | Must | 6-8 functions demonstrating behaviors |
| Zoom control | Should | Adjust view window |
| Animation | Nice | Animate ε shrinking, δ following |
| URL state sync | Must | Shareable configurations |

### Preset Functions

| ID | Function | Behavior | Educational Purpose |
|----|----------|----------|---------------------|
| `polynomial` | f(x) = x² | Continuous | Basic continuous function |
| `rational` | f(x) = (x²-1)/(x-1) | Removable discontinuity at x=1 | Limit exists but f(1) undefined |
| `step` | f(x) = ⌊x⌋ (floor) | Jump discontinuity | Left ≠ right limit |
| `reciprocal` | f(x) = 1/x | Vertical asymptote at x=0 | Infinite limit |
| `sine-over-x` | f(x) = sin(x)/x | Removable at x=0 | Famous limit (→1) |
| `absolute` | f(x) = \|x\|/x | Jump at x=0 | Sign function behavior |
| `oscillating` | f(x) = sin(1/x) | No limit at x=0 | Limit does not exist |
| `piecewise` | Custom piecewise | Various | Demonstrate continuity conditions |

### Visualization Details

**Canvas Layout** (reuse CoordinateSystem patterns):
- Function curve: Primary color (`emerald-600`)
- Approach point: Highlighted dot with vertical dashed line
- Epsilon band: Horizontal semi-transparent rectangle
- Delta interval: Vertical semi-transparent rectangle  
- Left limit indicator: Arrow from left
- Right limit indicator: Arrow from right

**Colors** (following design system):
- Function curve: `stroke-primary` (emerald)
- Epsilon band: `fill-blue-200/50` with `stroke-blue-500`
- Delta interval: `fill-amber-200/50` with `stroke-amber-500`
- Approach point: `fill-red-500`
- Limit value: `text-purple-600`

---

## Math Utilities

### File: `src/utils/math/limits.ts`

```typescript
// Types
export interface LimitResult {
  exists: boolean
  value: number | null
  leftLimit: number | null
  rightLimit: number | null
  limitType: 'finite' | 'infinite' | 'does-not-exist'
}

export interface ContinuityResult {
  isContinuous: boolean
  discontinuityType: 'none' | 'removable' | 'jump' | 'infinite' | 'oscillating'
  description: string
}

export interface FunctionPreset {
  id: string
  name: string
  description: string
  fn: (x: number) => number
  domain: { min: number; max: number }
  interestingPoints: number[]  // Points where limits are interesting
  latex: string
}

export type ApproachDirection = 'both' | 'left' | 'right'

// Core Functions
export function evaluateLimit(
  fn: (x: number) => number,
  approachPoint: number,
  direction: ApproachDirection,
  tolerance?: number
): LimitResult

export function evaluateLeftLimit(
  fn: (x: number) => number,
  approachPoint: number,
  tolerance?: number
): number | null

export function evaluateRightLimit(
  fn: (x: number) => number,
  approachPoint: number,
  tolerance?: number
): number | null

export function checkContinuity(
  fn: (x: number) => number,
  point: number,
  tolerance?: number
): ContinuityResult

// Numerical Methods
export function numericalLimitApproximation(
  fn: (x: number) => number,
  approachPoint: number,
  direction: 'left' | 'right',
  steps?: number
): number[]  // Returns sequence of f(x) values approaching

// Epsilon-Delta
export function findDeltaForEpsilon(
  fn: (x: number) => number,
  approachPoint: number,
  limitValue: number,
  epsilon: number,
  maxDelta?: number
): number | null  // Returns delta that works, or null

// Validation
export function isValidApproachPoint(
  fn: (x: number) => number,
  point: number
): boolean

// Presets
export const LIMIT_PRESETS: FunctionPreset[]
export function getLimitPreset(id: string): FunctionPreset | undefined

// Constants
export const LIMIT_TOLERANCE = 1e-8
export const DEFAULT_EPSILON = 0.5
export const DEFAULT_DELTA = 0.3
```

**Test Coverage Target**: 45+ tests covering:
- Limit evaluation for all preset functions
- Left/right limit detection
- Continuity classification
- Epsilon-delta relationship
- Edge cases (asymptotes, oscillating)
- Numerical approximation sequences

---

## Content Structure

### Calculus Index Page

`/calculus` - `CalculusIndexView.vue`

**Sections**:
1. **What is Calculus?** - Two branches: differential and integral
2. **Why Programmers Need Calculus** - Optimization, ML, physics simulations
3. **The Foundation: Limits** - Preview of what limits enable
4. **Topics** - Links to Limits (this phase), Derivatives (Phase 14)

### Limits Content Page

`/calculus/limits` - `LimitsView.vue`

**Sections**:

1. **What is a Limit?** (Intro, expanded by default)
   - Intuitive explanation: "What value does f(x) approach?"
   - Not about reaching, but approaching
   - Programming analogy: convergence tolerance

2. **Interactive Limit Explorer** (Widget)
   - LimitsExplorer widget with URL sync
   - Code parallel showing numerical approximation

3. **The ε-δ Definition** (Collapsible)
   - Formal definition (shown, not required to prove)
   - Visual explanation of "for every ε, there exists δ"
   - Python code: tolerance-based convergence check

4. **One-Sided Limits** (Collapsible)
   - Left limit (x → a⁻) and right limit (x → a⁺)
   - When they differ: limit does not exist
   - Code example: checking from both sides

5. **Types of Discontinuities** (Collapsible)
   - Removable: limit exists but f(a) ≠ L or undefined
   - Jump: left ≠ right limit
   - Infinite: vertical asymptote
   - Oscillating: no limit exists

6. **Famous Limits** (Collapsible)
   - lim (sin x)/x = 1 as x → 0
   - lim (1 + 1/n)^n = e as n → ∞
   - Connection to Taylor series (preview)

7. **Programmer Applications** (Key highlight)
   - Numerical methods convergence
   - Machine learning: gradient descent stopping criteria
   - Computer graphics: continuous vs. discrete
   - Error bounds and tolerances

8. **Related Topics**
   - Link to Exponentials (e appears in limits)
   - Link to Trigonometry (sin x/x)
   - Preview: Derivatives (next phase)

---

## Increments

### Increment 13A: Limits Math Utilities (~45 min)

**Tasks**:
1. Add limit types to `src/types/math.ts`
2. Create `src/utils/math/limits.ts` with:
   - `evaluateLimit`, `evaluateLeftLimit`, `evaluateRightLimit`
   - `checkContinuity`
   - `numericalLimitApproximation`
   - `findDeltaForEpsilon`
   - `LIMIT_PRESETS` (8 preset functions)
3. Create `src/utils/math/limits.test.ts` with 45+ tests

**Success Criteria**:
- All tests pass
- All preset functions evaluate correctly
- Continuity detection works for all discontinuity types

---

### Increment 13B: LimitsExplorer Widget Core (~60 min)

**Tasks**:
1. Create `src/composables/useLimits.ts` for state + URL sync
2. Create widget components:
   - `LimitsExplorer.vue` (main orchestrator)
   - `FunctionSelector.vue` (preset buttons)
   - `LimitCanvas.vue` (SVG with function curve)
3. Implement function curve rendering using PlotCurve patterns
4. Basic approach point selection

**Success Criteria**:
- Can select preset functions
- Function curve renders correctly
- Approach point can be set

---

### Increment 13C: ε-δ Visualization (~45 min)

**Tasks**:
1. Create `EpsilonDeltaControls.vue` (ε and δ sliders)
2. Create `ApproachControls.vue` (approach point, direction)
3. Create `LimitDisplay.vue` (limit values, continuity badges)
4. Add epsilon band and delta interval to canvas
5. Implement left/right limit indicators

**Success Criteria**:
- ε-δ sliders control band/interval sizes
- Bands render correctly
- Left/right limits display
- Continuity status shown with badges

---

### Increment 13D: Content Pages (~45 min)

**Tasks**:
1. Create `CalculusIndexView.vue` section landing page
2. Create `LimitsView.vue` comprehensive content page
3. Update navigation and routes
4. Include Python code examples for numerical limits
5. Add Related Topics section

**Success Criteria**:
- Navigation works
- Content renders properly
- Widget integrated with URL sync
- Code examples accurate

---

### Increment 13E: E2E Tests & Polish (~30 min)

**Tasks**:
1. Create `e2e/calculus/limits-explorer.spec.ts` (14+ tests)
2. Add accessibility tests for calculus pages
3. Visual regression baseline updates
4. Polish: mobile responsiveness, keyboard navigation

**Success Criteria**:
- All E2E tests pass
- Accessibility audit passes
- Widget usable on mobile

---

## Estimated Total Time

| Increment | Time |
|-----------|------|
| 13A: Limits Utilities | 45 min |
| 13B: Widget Core | 60 min |
| 13C: ε-δ Visualization | 45 min |
| 13D: Content Pages | 45 min |
| 13E: E2E & Polish | 30 min |
| **Total** | **~3.75 hours** |

---

## Technical Decisions (Confirmed)

### D-106: Visual Intuition Over Formal Proofs
*(Pending your confirmation)*

### D-107: Preset Functions
*(Pending your confirmation)*

### D-108: Numerical Limit Approximation

**Decision**: Use numerical approximation (sequence of values approaching) rather than symbolic computation.

**Rationale**:
- No symbolic math library dependency
- Demonstrates how computers actually compute limits
- Educational: shows the approximation process
- Matches programming reality (floating point)

**Implementation**:
```typescript
// Approach from left with decreasing steps
const sequence = [f(a - 0.1), f(a - 0.01), f(a - 0.001), ...]
// If sequence converges, that's the limit
```

---

## Archive Reference

**Component reference**: `archive/snake-math/docs/.vitepress/theme/components/LimitsExplorer.vue`
- Canvas-based (we'll use SVG for consistency)
- ε-δ visualization ✓
- Function type selection ✓
- Continuity detection ✓

**Content reference**: `archive/snake-math/docs/calculus/limits/`
- `basics.md` - Limit definition, intuition
- `continuity.md` - Continuity types
- `methods.md` - Evaluation techniques
- `applications.md` - Real-world uses

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Numerical precision issues | Medium | Medium | Use appropriate tolerance, test edge cases |
| Complex SVG for ε-δ bands | Low | Low | Reuse existing SVG patterns |
| Function domain handling | Medium | Medium | Validate approach points against domain |
| Oscillating function rendering | Medium | Low | Limit rendering resolution |

---

## Connections to Prior Phases

| Connection | Phase | How It Connects |
|------------|-------|-----------------|
| Coordinate System | 7+ | Reuse for function plotting |
| Trigonometry | 9 | sin(x)/x limit |
| Exponentials | 8 | e as limit definition |
| Functions | 6 | Function composition, evaluation |

---

## Success Metrics

- [ ] All unit tests pass (45+)
- [ ] All E2E tests pass (14+)
- [ ] Accessibility audit passes
- [ ] Widget URL sync works
- [ ] Mobile responsive
- [ ] ε-δ relationship clearly visualized
- [ ] All discontinuity types detectable
- [ ] Numerical approximation shown

---

## Post-Phase Evaluation

After Phase 13, evaluate:
- Is the limits visualization intuitive?
- Ready for derivatives (tangent line = limit of secant)?
- Should we add more limit examples?
- Performance with complex functions?
