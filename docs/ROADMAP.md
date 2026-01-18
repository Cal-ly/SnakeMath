# SnakeMath Roadmap

## Vision

**SnakeMath** teaches mathematics to programmers by revealing that mathematical notation is just code they already know. The long-term trajectory leads from foundational concepts through calculus to AI/ML fundamentals.

**Core Philosophy**: "Sigma is just a for loop" — and every mathematical concept has a programming equivalent.

---

## Strategic Trajectory

```
Basics → Algebra → Trigonometry → Statistics → Linear Algebra → Calculus → AI/ML
```

Each topic builds toward machine learning foundations:

| Topic | ML Connection |
|-------|---------------|
| Summation (Σ) | Loss functions, gradient descent sums |
| Exponentials/Logarithms | Activation functions, cross-entropy loss |
| Statistics | Distributions, probability, Bayesian inference |
| Linear Algebra | Neural network operations, embeddings, transformations |
| Calculus | Backpropagation, optimization, gradients |

---

## Phase Overview

| Phase | Focus | Widget | Content | Status |
|-------|-------|--------|---------|--------|
| 1 | Project Foundation | — | — | ✅ Complete |
| 2 | Layout & Navigation | — | — | ✅ Complete |
| 3 | Content Components | — | — | ✅ Complete |
| 4 | Number Types | NumberTypeExplorer | Basics: Number Types | ✅ Complete |
| 5 | Summation Notation | SummationExplorer | Algebra: Summation | ✅ Complete |
| 6 | Basics Completion + Testing | SimpleFunctionDemo | Basics: Functions, Variables, Order of Ops | ✅ Complete |
| 7 | Quadratic Functions | QuadraticExplorer | Algebra: Quadratics | ✅ Complete |
| 8 | Exponentials & Logarithms | ExponentialExplorer | Algebra: Exp/Log | ✅ Complete |
| 9 | Trigonometry + Testing Refinement | UnitCircleExplorer | Trig: Unit Circle | ✅ Complete |
| 10 | Statistics Foundation + Algebra Expansion | StatisticsCalculator | Statistics: Descriptive + Product/Linear | ✅ Complete |
| 11 | Linear Algebra: Vectors | VectorOperations | Linear Algebra: Vectors | ✅ Complete |
| 12 | Linear Algebra: Matrices | MatrixTransformations | Linear Algebra: Matrices | ✅ Complete |
| 13 | Calculus: Limits | LimitsExplorer | Calculus: Limits | ✅ Complete |
| 14 | Calculus: Derivatives | DerivativeVisualizer | Calculus: Derivatives | ✅ Complete |
| 15 | Trigonometry: Remaining Topics | InverseTrigExplorer, TrigCodePlayground | Trig: Identities, Inverse Functions, Trig in Code | ✅ Complete |
| 16 | Linear Algebra: 3D | VectorOperations3D, MatrixTransformations3D | LinAlg: Vectors 3D, Matrices 3D | ✅ Complete |
| 17 | Probability Distributions | DistributionExplorer | Statistics: Distributions, CLT | ✅ Complete |
| **18** | **Sampling & Estimation** | **SamplingSimulator** | **Statistics: Sampling, CI, Bootstrap** | 🎯 Next |
| **19** | **Hypothesis Testing** | **HypothesisTestingSimulator** | **Statistics: p-values, Power, A/B Testing** | 📋 Planned |
| **20** | **Correlation & Regression** | **CorrelationExplorer** | **Statistics: Correlation, Linear Regression** | 📋 Planned |

---

## Detailed Phase Descriptions

### Phase 5: Summation Notation
*"Sigma is a For Loop"*

**Goal**: Deliver the core thesis of SnakeMath through an interactive summation explorer.

| Track | Deliverables |
|-------|--------------|
| Content | Algebra section, Summation topic (intro → formulas → applications) |
| Widget | SummationExplorer: presets, bounds input, code parallel, bar chart, formula comparison |
| Polish | Widget component architecture, animation patterns |

**Key Features**:
- Side-by-side math notation ↔ Python/JavaScript code
- Animated bar chart showing term accumulation
- Closed-form formula comparison (O(n) vs O(1))
- URL state sync for shareable configurations

**Success Metric**: User sees Σ notation and immediately thinks "that's just a for loop!"

---

### Phase 6: Basics Completion + Testing Infrastructure
*Fill the Foundation, Add Safety Nets*

**Goal**: Complete Basics section content and establish automated testing.

| Track | Deliverables |
|-------|--------------|
| Content | Functions (composition, inverse), Variables & Expressions, Order of Operations |
| Widget | Minor enhancements only |
| Polish | Component library refinement, consistent patterns |
| Infrastructure | **E2E testing (Playwright), Accessibility audits (axe-core)** |

**Content Migration** (from archive):
- `basics/functions.md` — Vending machine analogy, composition, inverse
- `basics/variables-expressions.md` — Expression building, implementation methods
- `basics/order-of-operations.md` — PEMDAS, precedence tables, AST concepts

**Testing Additions**:
- Playwright setup and configuration
- E2E tests for navigation and existing widgets
- Accessibility audit integration
- CI workflow updates

---

### Phase 7: Quadratic Functions
*Visual Algebra*

**Goal**: Build rich graphing widget with coordinate system foundation.

| Track | Deliverables |
|-------|--------------|
| Content | Quadratics: standard/vertex/factored forms, solving methods, applications |
| Widget | QuadraticExplorer: coefficient sliders, parabola graph, roots visualization |
| Polish | Reusable coordinate system component, smooth transitions |
| Infrastructure | **Visual regression testing** |

**Widget Features**:
- Coefficient sliders (a, b, c)
- SVG parabola with vertex, roots, axis of symmetry
- Form conversion display (standard ↔ vertex ↔ factored)
- Discriminant analysis with root classification
- Real-world presets (projectile motion, profit optimization)
- Complex roots connection to NumberTypeExplorer

**Technical Foundation**: Coordinate system SVG component (reusable for future phases)

---

### Phase 8: Exponentials & Logarithms
*Growth, Decay, and Complexity*

**Goal**: Connect exponential/logarithmic functions to algorithm analysis.

| Track | Deliverables |
|-------|--------------|
| Content | Exponential functions, logarithms, growth/decay, complexity analysis |
| Widget | ExponentialCalculator: function plotting, complexity comparison |
| Polish | Mobile layout optimization, touch interactions |

**Widget Features**:
- Base selection (e, 2, 10, custom)
- Growth/decay curve visualization
- Doubling time / half-life calculator
- **Algorithm complexity comparison** (O(1) → O(log n) → O(n) → O(n²) → O(2^n))

**Programmer Relevance**:
- Binary logarithms and CS applications
- Why O(log n) is "almost as good as O(1)"
- Exponential blowup in brute-force algorithms

---

### Phase 9: Trigonometry
*The Classic Visualization*

**Goal**: Build the iconic unit circle explorer with synchronized wave displays.

| Track | Deliverables |
|-------|--------------|
| Content | Unit circle, trig functions, identities, applications |
| Widget | UnitCircleExplorer: angle control, sine/cosine waves, special angles |
| Polish | Animation system refinement, synchronized updates |

**Widget Features**:
- Interactive unit circle with draggable angle
- Real-time sin/cos/tan value display
- Parallel wave graphs (sin θ, cos θ)
- Special angle quick-select (0°, 30°, 45°, 60°, 90°)
- Quadrant sign indicators (ASTC mnemonic)
- Radian/degree toggle

**Applications Content**:
- Rotation in graphics
- Signal processing basics
- Oscillation and waves

---

### Phase 10: Statistics Foundation
*Data Science Beginnings*

**Goal**: Introduce descriptive statistics with interactive data exploration.

| Track | Deliverables |
|-------|--------------|
| Content | Mean, median, mode, variance, standard deviation, distributions |
| Widget | StatisticsCalculator: data input, histogram, box plot, statistics display |
| Polish | Performance audit, bundle optimization |

**Widget Features**:
- Data input (manual entry or preset datasets)
- Real-time statistics calculation
- Histogram visualization with adjustable bins
- Box plot with quartiles and outlier detection
- Skewness analysis

**Preset Datasets** (from archive):
- Test scores
- Heights
- Salaries (with outlier)
- Reaction times

---

### Phase 11: Linear Algebra — Vectors
*The Language of ML*

**Goal**: Visualize vector operations in 2D/3D space.

| Track | Deliverables |
|-------|--------------|
| Content | Vector fundamentals, operations, dot/cross product, applications |
| Widget | VectorOperations: coordinate input, arrow visualization, operation calculator |

**Widget Features**:
- Vector input (x, y, z coordinates)
- 2D/3D arrow diagram (SVG)
- Operations: addition, subtraction, scalar multiplication
- Dot product with angle calculation
- Cross product (3D)
- Magnitude and unit vector

**ML Bridge Content**:
- Word embeddings as vectors
- Cosine similarity
- Feature vectors in ML

---

### Phase 12: Linear Algebra — Matrices
*Transformations and Systems*

**Goal**: Visualize linear transformations and matrix operations.

| Track | Deliverables |
|-------|--------------|
| Content | Matrix fundamentals, operations, transformations, systems |
| Widget | MatrixTransformations: transformation selector, visual effect display |

**Widget Features**:
- Transformation type selector (rotate, scale, shear, reflect)
- Unit square visualization showing transformation effect
- Matrix display with determinant
- Composition of transformations
- Connection to graphics programming

---

### Phase 13: Calculus — Limits
*Approaching the Edge*

**Goal**: Visualize limits and continuity with ε-δ exploration.

| Track | Deliverables |
|-------|--------------|
| Content | Limit definition, one-sided limits, continuity, discontinuity types |
| Widget | LimitsExplorer: function selection, approach point, ε-δ visualization |

**Widget Features**:
- Function curve display
- Approach point selector
- Epsilon band visualization
- Delta interval display
- Left/right limit values
- Continuity classification

---

### Phase 14: Calculus — Derivatives
*Rate of Change*

**Goal**: Visualize derivatives as slopes and rates of change.

| Track | Deliverables |
|-------|--------------|
| Content | Derivative definition, rules, applications |
| Widget | DerivativeVisualizer: function plot, tangent line, derivative graph |

**Widget Features**:
- Function curve with movable point
- Tangent line at selected point
- Slope display (derivative value)
- Derivative function graph overlay
- Connection to optimization

**ML Bridge**: "Gradient descent is just following the derivative downhill"

---

### Phase 15: Trigonometry — Remaining Topics
*Completing the Circle*

**Goal**: Complete the trigonometry section with identities, inverse functions, and practical applications.

| Track | Deliverables |
|-------|--------------|
| Content | Trig Identities, Inverse Trig Functions, Trig in Code |
| Widget | TrigIdentityExplorer (21 identities), InverseTrigExplorer (arcsin/arccos/arctan/atan2), TrigCodePlayground (rotation/waves/circular motion/projectiles) |
| Polish | Multi-demo architecture, animation patterns |

**Widget Features**:

*TrigIdentityExplorer*:
- 21 identities across 6 categories (Pythagorean, reciprocal, quotient, cofunction, even/odd, sum/difference)
- Visual proof with unit circle
- Numerical verification at any angle
- Random angle testing

*InverseTrigExplorer*:
- Domain/range visualization for arcsin, arccos, arctan
- Principal value highlighting
- atan2 comparison with interactive quadrant display
- Exact angle detection (π/6, π/4, π/3, etc.)

*TrigCodePlayground*:
- Rotation demo: Point rotation around origin
- Wave demo: Sine wave generation with frequency/amplitude/phase
- Circular motion: Orbital animation with radius/period controls
- Projectile motion: Trajectory visualization with range/max height formulas

**Technical Achievements**:
- Multi-demo composable pattern (useTrigPlayground)
- requestAnimationFrame with delta time for smooth animations
- Domain validation for inverse functions
- Floating-point comparison with epsilon tolerance

---

### Phase 16: Linear Algebra — 3D
*Into the Third Dimension*

**Goal**: Extend linear algebra coverage with 3D vectors and 3D transformation matrices.

| Track | Deliverables |
|-------|--------------|
| Content | Vectors 3D (cross product, 3D operations), Matrices 3D (rotation matrices, Euler angles) |
| Widget | VectorOperations3D (isometric projection, cross product, right-hand rule), MatrixTransformations3D (3×3 rotation matrices, unit cube) |
| Polish | Isometric projection composable, reusable 3D visualization infrastructure |

**Widget Features**:

*VectorOperations3D*:
- 3D vector inputs with coordinate sliders
- 8 operations: add, subtract, dot product, cross product, magnitude, angle, scalar multiply, normalize
- Isometric SVG canvas with grid and vector arrows
- Cross product with right-hand rule demo
- 5 educational presets

*MatrixTransformations3D*:
- 6 transformation types: identity, rotateX, rotateY, rotateZ, combined, scale
- Isometric SVG canvas with unit cube and transformed cube
- Basis vector visualization (î, ĵ, k̂)
- Euler angle composition (Rx → Ry → Rz)
- 8 educational presets
- Determinant-based property badges (orthogonal, rotation, orientation)

**Technical Achievements**:
- Isometric projection composable (useIsometricProjection)
- Right-handed, Y-up coordinate system
- SVG-based 3D visualization without WebGL

---

### Phase 17: Probability Distributions
*The Shape of Randomness*

**Goal**: Build an interactive distribution explorer teaching programmers to recognize, parameterize, and apply probability distributions — with direct connections to random number generation and ML applications.

| Track | Deliverables |
|-------|--------------|
| Content | Normal, binomial, Poisson, exponential, uniform distributions; CLT |
| Widget | DistributionExplorer: distribution selector, parameter sliders, PDF/CDF visualization, probability calculator |
| Polish | Histogram + curve overlays, CLT demonstration |

**Widget Features**:

*DistributionExplorer*:
- 5 distributions: Normal, Binomial, Poisson, Exponential, Uniform
- Parameter sliders with real-time PDF/CDF updates
- Probability calculator (P(X < a), P(a < X < b))
- Histogram from random samples
- Distribution comparison mode
- CLT demonstration panel

**Math Utilities**: PDF/CDF functions, random sampling, quantiles (80+ tests)

**Programmer Relevance**:
- "Distributions are personality profiles for randomness"
- Normal → ML weight initialization, noise
- Binomial → A/B testing, feature flags
- Poisson → request rates, error counts
- Exponential → wait times, timeouts

**Estimated Time**: ~6.5 hours (6 increments)

---

### Phase 18: Sampling & Estimation
*Measure Some, Estimate All*

**Goal**: Build an interactive sampling simulator demonstrating how sample statistics estimate population parameters — with confidence intervals and bootstrapping.

| Track | Deliverables |
|-------|--------------|
| Content | Sampling methods, sampling distributions, standard error, confidence intervals, bootstrap |
| Widget | SamplingSimulator: population visualization, sample drawing, CI demonstration, bootstrap panel |
| Polish | Animation of sampling process, CI coverage demo |

**Widget Features**:

*SamplingSimulator*:
- Population grid visualization (1000 items)
- 4 sampling methods: simple random, systematic, stratified, cluster
- Animated sample drawing
- Sampling distribution histogram (many samples)
- CI demonstration with capture rate
- Bootstrap confidence intervals
- Sample size calculator

**Math Utilities**: Sampling functions, SE calculation, CI construction, bootstrap (60+ tests)

**Programmer Relevance**:
- "Sampling is like profiling — you can't trace every call"
- Confidence intervals for A/B test results
- Bootstrap for non-parametric estimation
- Sample size planning for experiments

**Estimated Time**: ~7 hours (7 increments)

---

### Phase 19: Hypothesis Testing
*The Scientific Method, Formalized*

**Goal**: Build an interactive hypothesis testing simulator teaching the logic of statistical inference — null hypotheses, p-values, significance, and Type I/II error trade-offs.

| Track | Deliverables |
|-------|--------------|
| Content | Null/alternative hypotheses, p-values, significance, Type I/II errors, power analysis |
| Widget | HypothesisTestingSimulator: test type selector, hypothesis setup, p-value visualization, power calculator |
| Polish | Type I/II error demo, effect size display |

**Widget Features**:

*HypothesisTestingSimulator*:
- 4 test types: one-sample t, two-sample t, one-proportion z, two-proportion z
- Hypothesis configuration (H₀, H₁, α)
- Distribution visualization with rejection region shading
- p-value and decision display
- Type I/II error interactive demo
- Power analysis calculator
- Effect size (Cohen's d) display
- A/B testing preset

**Math Utilities**: t-tests, z-tests, power analysis, effect size (80+ tests)

**Programmer Relevance**:
- "H₀ is like 'innocent until proven guilty'"
- A/B testing for feature decisions
- Type I = false positive (spam filter marking real email)
- Type II = false negative (missing a real bug)
- Power = probability of detecting a real effect

**Estimated Time**: ~7.25 hours (7 increments)

---

### Phase 20: Correlation & Regression
*Do Variables Move Together?*

**Goal**: Build an interactive correlation and regression explorer teaching programmers to identify relationships between variables and fit linear models — bridging directly to ML.

| Track | Deliverables |
|-------|--------------|
| Content | Correlation, causation, linear regression, R², residuals, multiple regression preview |
| Widget | CorrelationExplorer: scatter plot with draggable points, regression line, residual visualization, outlier demo |
| Polish | Real-time correlation updates, ML connection |

**Widget Features**:

*CorrelationExplorer*:
- Interactive scatter plot with draggable points
- Real-time correlation coefficient (r) display
- Regression line with equation overlay
- Residual visualization toggle
- R² and standard error display
- Outlier impact demonstration
- Multiple regression preview (2 predictors, 3D)
- "Correlation ≠ Causation" prominent warning
- Dataset presets (Anscombe's quartet)

**Math Utilities**: Pearson correlation, OLS regression, Cook's distance, R² (100+ tests)

**Programmer Relevance**:
- Feature selection: "Which inputs relate to output?"
- Linear regression = simplest baseline ML model
- "Multiple regression is literally a linear layer: ŷ = w₁x₁ + w₂x₂ + b"
- Residuals = model errors to analyze

**Estimated Time**: ~7.75 hours (8 increments)

---

## Future Horizons (Phase 21+)

Lower detail, higher flexibility. Evaluated after Phase 20.

| Phase | Possible Focus |
|-------|----------------|
| 21 | AI/ML Foundations: Neural network intuition, gradient descent visualization |
| 22 | Calculus: Integrals (area under curve, accumulation) |
| 23 | PWA features: offline support, installability |
| 24 | Search functionality, content discovery |
| 25 | User progress tracking (local storage) |
| 26 | Practice problems / quiz system |
| 27 | Community contributions framework |

---

## Testing Strategy

### Testing Layers

| Layer | Tool | Purpose | Phase Added |
|-------|------|---------|-------------|
| Unit | Vitest | Math utilities, pure functions | Phase 1 ✅ |
| Component | Vitest + Vue Test Utils | Component logic, props, emits | Phase 4 ✅ |
| E2E | Playwright | User flows, integration | Phase 6 ✅ |
| Visual Regression | Playwright screenshots | UI consistency | Phase 7 ✅ |
| Accessibility | axe-core + Playwright | WCAG compliance | Phase 6 ✅ |

### Test File Structure

```
tests/
├── unit/                    # Vitest unit tests (co-located with source)
e2e/
├── navigation.spec.ts       # Site-wide navigation
├── basics/
│   ├── number-types.spec.ts
│   └── symbols.spec.ts
├── algebra/
│   ├── summation.spec.ts
│   └── quadratics.spec.ts
├── statistics/
│   ├── distributions.spec.ts
│   ├── sampling.spec.ts
│   ├── hypothesis-testing.spec.ts
│   └── correlation.spec.ts
└── visual/
    ├── widgets.spec.ts      # Widget screenshots
    └── pages.spec.ts        # Full page screenshots
```

### CI Workflow

```yaml
jobs:
  unit:        # TypeScript, lint, unit tests
  e2e:         # Playwright functional tests
  visual:      # Playwright screenshot comparison
```

### Testing Conventions

**Data Test IDs**: All interactive elements get `data-testid` attributes:
```vue
<input data-testid="number-input" />
<div data-testid="set-natural" :data-member="isNatural" />
```

**Per-Widget Testing**: Each new widget includes:
1. Unit tests for utility functions
2. Component tests for props/emits/logic
3. E2E tests for user interactions
4. Visual regression baselines

---

## Decision Log

Decisions made during roadmap planning:

| ID | Decision | Rationale |
|----|----------|-----------|
| R-001 | Summation before Quadratics (Phase 5) | Core philosophy demonstration; unique value proposition |
| R-002 | Exponentials before Statistics (Phase 8) | Better algebra flow; complexity analysis is programmer-relevant |
| R-003 | Calculus in scope | Required for AI/ML trajectory (backpropagation, optimization) |
| R-004 | Playwright over Cypress | Better browser support, built-in visual testing, faster |
| R-005 | E2E testing in Phase 6 | Early investment before widget count grows |
| R-006 | Visual regression in Phase 7 | After coordinate system established; more visual complexity |
| R-007 | Coordinate system supports negative ranges | Parabolas extend below x-axis; roots can be negative |
| R-008 | Preset-based widgets (no arbitrary expressions) | Security, predictability, curated educational examples |
| R-009 | Complex roots link to Number Types | Educational progression without complex arithmetic on quadratics page |
| R-010 | Tiered CI workflow (Phase 9) | quick-check on push, full-test on PR only; balances speed and coverage |
| R-011 | Visual regression local-only | Flaky in CI; more reliable as local validation before commits |
| R-012 | Panel-based widget architecture (Phase 10) | Clear organization for complex widgets; single responsibility per panel |
| R-013 | Algebra expansion in Phase 10 | Product Notation + Linear Equations fill content gaps; complete algebra section |
| R-014 | 2D vectors only in Phase 11 | Clearer visualization; 3D deferred to future enhancement |
| R-015 | 2×2 matrices only in Phase 12 | Focus on 2D transformations; higher dimensions deferred |
| R-016 | Unit square visualization for matrix transformations | Intuitive demonstration of linear transformation effects |
| R-017 | Secant-to-tangent animation in Phase 14 | Directly visualizes limit definition of derivative; connects Phase 13→14 |
| R-018 | Multi-demo composable architecture (Phase 15) | Single useTrigPlayground composable manages rotation, waves, circular motion, projectile demos with shared state patterns |
| R-019 | Principal value convention for inverse trig (Phase 15) | Match standard library behavior: arcsin/arccos return [-π/2, π/2] and [0, π]; atan2 returns full [-π, π] |
| R-020 | Underscore prefix for intentionally unused variables | ESLint `@typescript-eslint/no-unused-vars` ignores variables matching `/^_/u`; prevents CI failures |
| R-021 | Isometric projection for 3D visualization | SVG-based approach avoids WebGL complexity; 30° angles provide clear depth cues |
| R-022 | Cross product as default 3D vector operation | Unique to 3D; demonstrates right-hand rule effectively |
| R-023 | Statistics expansion before AI/ML (Phases 17-20) | Complete inferential statistics foundation; direct bridge to ML concepts |
| R-024 | Four statistics phases in sequence | Each builds on previous: distributions → sampling → hypothesis testing → regression |

---

## Parallel Tracks

### Content Progression
```
Phase:  4    5    6    7    8    9    10   11   12   13   14   15   16   17   18   19   20
        │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │
Basics: ████ ─────████
Algebra:     ████      ████ ████
Trig:                            ████                     ████
Stats:                                ████                          ████ ████ ████ ████
LinAlg:                                    ████ ████                ████
Calc:                                                ████ ████
```

### Widget Progression
```
Phase 4:  NumberTypeExplorer      (Venn diagram, number line)
Phase 5:  SummationExplorer       (bar chart, code parallel)
Phase 7:  QuadraticExplorer       (parabola, coordinate system)
Phase 8:  ExponentialCalculator   (function curves, complexity)
Phase 9:  UnitCircleExplorer      (circle, synchronized waves)
Phase 10: StatisticsCalculator    (histogram, box plot)
Phase 11: VectorOperations        (arrow diagrams)
Phase 12: MatrixTransformations   (transformation visualization)
Phase 13: LimitsExplorer          (ε-δ visualization)
Phase 14: DerivativeVisualizer    (tangent lines, slopes)
Phase 15: InverseTrigExplorer     (arcsin/arccos/arctan, domain/range)
Phase 15: TrigCodePlayground      (rotation, waves, circular motion, projectiles)
Phase 16: VectorOperations3D      (3D vectors, cross product, isometric projection)
Phase 16: MatrixTransformations3D (3D rotation matrices, Euler angles, unit cube)
Phase 17: DistributionExplorer    (PDF/CDF curves, CLT demo)
Phase 18: SamplingSimulator       (population grid, CI demonstration)
Phase 19: HypothesisTestingSimulator (p-value shading, power curves)
Phase 20: CorrelationExplorer     (scatter plot, regression line, residuals)
```

### Technical Capability Building
```
Phase 5:  Animation system (play/pause), code generation
Phase 6:  E2E testing, accessibility audits
Phase 7:  Coordinate system, function plotting, visual regression
Phase 8:  Multiple function curves, comparison views
Phase 9:  Circular geometry, synchronized animations
Phase 10: Data visualization (histogram, box plot)
Phase 11: Vector arrows, 2D/3D representation
Phase 12: Transformation matrices, composition
Phase 13: Epsilon-delta bands, limit visualization
Phase 14: Tangent lines, derivative graphs
Phase 15: Multi-demo composables, requestAnimationFrame animations, domain validation
Phase 16: Isometric projection, 3D coordinate systems, SVG-based 3D visualization
Phase 17: Distribution curves, CLT convergence animation, probability shading
Phase 18: Population grid virtualization, bootstrap resampling, CI capture animation
Phase 19: Hypothesis test visualization, Type I/II error demo, power curves
Phase 20: Draggable scatter plot, real-time correlation, residual lines
```

---

## Success Metrics

| Metric | Target | Measured By |
|--------|--------|-------------|
| Content Coverage | All archive content migrated + Statistics expansion | Phase 20 |
| Widget Count | 18+ major interactive widgets | Phase 20 |
| Test Coverage | All utilities tested, E2E for all widgets | Ongoing |
| Accessibility | WCAG 2.1 AA compliance | axe-core audits |
| Performance | Lighthouse >90 | Phase 10 audit |
| Mobile Usability | All widgets functional on mobile | Phase 8 |
| Statistics Tests | ~360 new unit tests (Phases 17-20) | Phase 20 |

---

## Review Points

| After Phase | Evaluate | Outcome |
|-------------|----------|---------|
| 5 | Widget architecture solid? Animation approach correct? | ✅ Yes - preset-based architecture works well |
| 6 | Testing infrastructure working? Content density appropriate? | ✅ Playwright + axe-core working; content pacing good |
| 7 | Coordinate system reusable? Visual regression catching issues? | ✅ CoordinateSystem + PlotCurve/Point/Line reusable for Phase 8+ |
| 8 | Mobile experience acceptable? | ✅ Yes - widgets responsive; touch interactions work |
| 10 | Performance acceptable? Ready for more complex visualizations? | ✅ Yes - panel architecture scales well; histogram/box plot performant |
| 12 | Linear algebra approach working? Ready for calculus? | ✅ Yes - vectors + matrices complete; composable pattern proven |
| 13 | Limits visualization effective? Epsilon-delta approach working? | ✅ Yes - numerical approach intuitive; ε-δ bands educational |
| 14 | Derivatives visualization effective? Secant animation working? | ✅ Yes - tangent lines clear; secant→tangent animation demonstrates limit definition well |
| 15 | Trigonometry section complete? All subtopics covered? | ✅ Yes - 5 subtopics (Unit Circle, Right Triangle, Identities, Inverse Functions, Trig in Code); comprehensive coverage |
| 16 | 3D linear algebra effective? Isometric projection working? | ✅ Yes - isometric SVG visualization works well; cross product with right-hand rule demo; Euler angles clearly demonstrated |
| 17 | Distribution explorer effective? CLT demo clear? | ✅ Yes - DistributionExplorer with 5 distributions; CLT demo shows convergence to normal; 1461 tests total |
| 18 | Sampling visualization effective? CI demo working? | — |
| 19 | Hypothesis testing intuitive? p-value visualization clear? | — |
| 20 | Correlation/regression effective? ML bridge clear? Statistics section complete? | — |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Scope creep | Each phase has ONE primary widget maximum |
| Content without interactivity | Every content section references widgets |
| Technical debt | Phase 6 includes explicit polish time |
| Mobile neglected | Phase 8 includes mobile optimization focus |
| Performance degradation | Phase 10 includes performance audit |
| Testing gaps | E2E added in Phase 6, before widget proliferation |
| Visual regressions | Screenshot testing added in Phase 7 |
| Statistics complexity | Four focused phases (17-20) with clear increments |
| Population grid performance | Virtualization for large N in Phase 18 |

---

## Document History

| Date | Change |
|------|--------|
| 2025-01-15 | Initial roadmap created after Phase 4 completion |
| 2026-01-16 | Phase 5 complete, Phase 6 marked as next |
| 2026-01-16 | Phase 6 complete: E2E testing, accessibility, Functions/Variables/OrderOfOps content |
| 2026-01-16 | Phase 7 complete: QuadraticExplorer, CoordinateSystem, visual regression testing |
| 2026-01-17 | Phase 8 complete: ExponentialExplorer, complexity comparison, growth/decay |
| 2026-01-17 | Phase 9 complete: UnitCircleExplorer, WaveGraphs, tiered CI workflow |
| 2026-01-17 | Phase 10 complete: StatisticsCalculator, histogram/box plot, algebra expansion (Product Notation, Linear Equations) |
| 2026-01-17 | Phase 11 complete: VectorOperations widget, SVG canvas, vector utilities (78 tests), linear algebra section |
| 2026-01-17 | Phase 12 complete: MatrixTransformations widget, unit square visualization, matrix utilities (50+ tests), matrices content page |
| 2026-01-17 | Phase 13 complete: LimitsExplorer widget, ε-δ visualization, limits utilities (40+ tests), calculus section with Limits page |
| 2026-01-17 | Phase 14 complete: DerivativeVisualizer widget, tangent lines, secant-to-tangent animation, derivative utilities (67 tests), derivatives page with gradient descent focus |
| 2026-01-18 | Phase 15 complete: TrigIdentityExplorer (21 identities), InverseTrigExplorer (arcsin/arccos/arctan/atan2), TrigCodePlayground (rotation/waves/circular motion/projectiles); trigonometry section finished with 5 subtopics; 1048 tests total |
| 2026-01-18 | Phase 16 complete: VectorOperations3D (8 operations, cross product, right-hand rule), MatrixTransformations3D (3×3 rotation matrices, Euler angles, unit cube); isometric projection composable; 1252 tests total |
| 2026-01-18 | Statistics expansion planned: Phases 17-20 detailed (Probability Distributions, Sampling & Estimation, Hypothesis Testing, Correlation & Regression); ~28.5 hours estimated; ~360 new unit tests planned |
| 2026-01-18 | Phase 17 complete: DistributionExplorer widget (5 distributions), CLTDemonstration component, DistributionsView content page; 209 new unit tests; 1461 tests total |

---

*This is a living document. Update after each phase completion.*
