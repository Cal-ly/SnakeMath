# SnakeMath Current State

## Intent
This document outlines the current state of the project for easy resumption after a pause.

---

## Current Status: Phase 21 Complete

**Last Updated**: 2026-01-19

### Project Summary

SnakeMath is an educational mathematics website for programmers. Twenty-one phases of development have established:

| Phase | Focus | Key Deliverables | Status |
|-------|-------|------------------|--------|
| 1 | Foundation | Vite, Vue 3, TypeScript, Tailwind, Vitest | Complete |
| 2 | App Shell | Header, nav, breadcrumbs, theme toggle, footer | Complete |
| 3 | Content Components | MathBlock (KaTeX), CodeExample (Shiki), tabs, panels | Complete |
| 4 | Interactive Widgets | NumberTypeExplorer, visualizations, URL state | Complete |
| 5 | Algebra & Summation | SummationExplorer, bar chart, code parallel | Complete |
| 6 | Basics Completion | E2E tests, Functions, Variables, Order of Ops | Complete |
| 7 | Quadratics & Visual Regression | QuadraticExplorer, coordinate system, visual tests | Complete |
| 8 | Exponentials & Logarithms | ExponentialExplorer, complexity comparison | Complete |
| 9 | Trigonometry + Testing Refinement | UnitCircleExplorer, WaveGraphs, tiered CI | Complete |
| 10 | Statistics Foundation | StatisticsCalculator, histogram, box plot | Complete |
| 11 | Linear Algebra — Vectors | VectorOperations, SVG canvas, presets | Complete |
| 12 | Linear Algebra — Matrices | MatrixTransformations, unit square viz, presets | Complete |
| 13 | Calculus — Limits | LimitsExplorer, epsilon-delta viz, continuity | Complete |
| 14 | Calculus — Derivatives | DerivativeVisualizer, tangent lines, secant animation | Complete |
| — | Content Review | Three-analogy blocks, pitfall callouts, RelatedTopics | Complete |
| 15 | Trigonometry — Remaining Topics | Right Triangle, Identities, Inverse, Trig in Code | Complete |
| 16 | Linear Algebra — 3D | VectorOperations3D, MatrixTransformations3D, isometric projection | Complete |
| 17 | Statistics — Distributions | DistributionExplorer, CLTDemonstration, Distributions content page | Complete |
| 18 | Statistics — Sampling | SamplingSimulator, CI demo, bootstrap panel, Sampling content page | Complete |
| 19 | Statistics — Hypothesis Testing | HypothesisTestingSimulator, p-value viz, power analysis, Type I/II demo | Complete |
| 20 | Statistics — Correlation & Regression | CorrelationExplorer, scatter plot, residuals, Anscombe's quartet | Complete |
| 21 | Calculus — Integration | IntegrationExplorer, Riemann sums, convergence animation | Complete |

### What's Live

**Content Sections**:
- `/basics` - Complete section with 6 subtopics:
  - Foundations (The Basics)
  - Math Symbols
  - Number Types (with NumberTypeExplorer widget)
  - Functions (with SimpleFunctionDemo widget)
  - Variables & Expressions
  - Order of Operations (PEMDAS)
- `/algebra` - Five subtopics:
  - Summation notation (SummationExplorer widget)
  - Product Notation (Π) - factorial, permutations, combinations
  - Linear Equations - single equations, systems, NumPy integration
  - Quadratic Functions (QuadraticExplorer widget)
  - Exponentials & Logarithms (ExponentialExplorer widget)
- `/trigonometry` - Trigonometry section (5 subtopics):
  - Unit Circle (UnitCircleExplorer widget with WaveGraphs)
  - Right Triangle (RightTriangleSolver widget with SVG diagram)
  - Trig Identities (TrigIdentityExplorer widget with 21 identities)
  - **Inverse Functions (InverseTrigExplorer widget with atan2 vs atan comparison)**
  - **Trig in Code (TrigCodePlayground widget with 4 demo types)**
- `/linear-algebra` - Linear Algebra section:
  - Vectors (VectorOperations widget with SVG canvas)
  - Matrices (MatrixTransformations widget with unit square visualization)
  - **Vectors 3D (VectorOperations3D widget with isometric projection, cross product, right-hand rule)**
  - **Matrices 3D (MatrixTransformations3D widget with 3×3 rotation matrices, Euler angles)**
- `/statistics` - Statistics section (5 subtopics):
  - Descriptive Statistics (StatisticsCalculator widget with histogram & box plot)
  - Probability Distributions (DistributionExplorer widget with 5 distributions, CLT demo)
  - Sampling & Estimation (SamplingSimulator widget with 4 sampling methods, CI demo, bootstrap)
  - Hypothesis Testing (HypothesisTestingSimulator widget with 4 test types, p-value viz, power analysis)
  - **Correlation & Regression (CorrelationExplorer widget with scatter plot, regression line, residuals, Anscombe's quartet)**
- `/calculus` - Calculus section (3 subtopics):
  - Limits (LimitsExplorer widget with epsilon-delta visualization)
  - Derivatives (DerivativeVisualizer widget with tangent lines and secant animation)
  - **Integration (IntegrationExplorer widget with Riemann sums, convergence animation)**

**Interactive Widgets**:
- **NumberTypeExplorer**: Classify numbers, Venn diagram, number line, set membership
- **SummationExplorer**: Presets, bar chart animation, code parallel, formula comparison
- **SimpleFunctionDemo**: Function presets, slider input, substitution display
- **QuadraticExplorer**: Coefficient sliders, parabola graph, equation forms, real-world presets
- **ExponentialExplorer**: Function explorer tab (exp/log plotting, growth/decay analysis), complexity comparison tab (O(1) to O(2^n))
- **UnitCircleExplorer**: Angle controls (slider, input), special angle buttons, SVG unit circle with point/arc/projections, trig values display, quadrant/reference angle info, optional wave graphs (sin θ, cos θ)
- **StatisticsCalculator**: Dataset presets, custom data input, central tendency (mean/median/mode), spread (variance/std dev/range), quartiles (Q1/Q2/Q3/IQR), outlier detection (Tukey's fences), skewness analysis, histogram with adjustable bins, box plot visualization
- **VectorOperations**: Vector inputs with coordinate sliders, 7 operations (add, subtract, dot product, magnitude, angle, scalar multiply, normalize), SVG canvas with grid/arrows/parallelogram law, 5 educational presets, parallel/perpendicular badges, URL state sync
- **MatrixTransformations**: 10 transformation types (rotation, scale, shear, reflection, etc.), SVG canvas with unit square/basis vectors, custom matrix input, 8 educational presets, determinant-based property badges, URL state sync
- **LimitsExplorer**: 8 preset functions with different limit behaviors, SVG function curve rendering, approach point slider/drag, direction toggle (left/right/both), epsilon-delta band visualization with sliders, numerical approximation animation, continuity status display, URL state sync
- **DerivativeVisualizer**: 8 preset functions, SVG function curve with tangent line, movable point of tangency, secant line overlay with h-value slider, secant-to-tangent animation showing limit definition, derivative curve toggle, derivative value display with slope interpretation, URL state sync
- **RightTriangleSolver**: Input modes (side-side, side-angle), proportional SVG diagram with labeled sides/angles, step-by-step solution display, 5 educational presets, angle unit toggle (degrees/radians), solved values panel, URL state sync
- **TrigIdentityExplorer**: 21 identities across 6 categories (Pythagorean, Quotient, Reciprocal, Sum/Difference, Double Angle, Half Angle), category tabs, identity cards with expandable proof steps, numerical verification at custom angles, Python code examples, URL state sync
- **InverseTrigExplorer**: arcsin/arccos/arctan/atan2 functions, domain validation with error messages, exact angle detection (30°, 45°, 60°, etc.), unit circle visualization showing resulting angle, atan2 vs atan comparison display, 10 educational presets, quadrant indicator, Python code examples, URL state sync
- **TrigCodePlayground**: 4 demo types (rotation, wave, circular motion, projectile), tab-based navigation, rotation demo with angle slider and matrix display, wave demo with frequency/amplitude/phase controls, circular motion with play/pause animation, projectile physics with trajectory visualization, dynamic Python code generation, 12 presets across demo types, URL state sync
- **VectorOperations3D**: 3D vector inputs with coordinate sliders, 8 operations (add, subtract, dot product, cross product, magnitude, angle, scalar multiply, normalize), isometric SVG canvas with grid/arrows, cross product with right-hand rule demo, 5 educational presets, parallel/perpendicular badges, URL state sync
- **MatrixTransformations3D**: 6 transformation types (identity, rotateX, rotateY, rotateZ, combined, scale), isometric SVG canvas with unit cube and basis vectors, Euler angle composition, 8 educational presets, determinant-based property badges (orthogonal, rotation, orientation), URL state sync
- **DistributionExplorer**: 5 distributions (Normal, Binomial, Poisson, Exponential, Uniform), parameter sliders with real-time PDF/CDF updates, probability calculator (P(X < a), P(a < X < b)), histogram from random samples, distribution comparison tabs, URL state sync
- **CLTDemonstration**: Interactive Central Limit Theorem demo, source distribution selector (uniform, exponential, binomial, poisson), sample size slider, auto-run animation showing sample means converging to normal, histogram with normal curve overlay
- **SamplingSimulator**: 4 sampling methods (simple random, stratified, systematic, cluster), population grid visualization, animated sample drawing, sampling distribution histogram, CI coverage demonstration with capture rate, bootstrap confidence intervals, sample size calculator for mean and proportion, 5 educational presets, URL state sync
- **HypothesisTestingSimulator**: 4 test types (one-sample t, two-sample t, one-proportion z, two-proportion z), hypothesis setup (H₀, H₁, α), test statistic and p-value calculation, distribution visualization with rejection region shading, effect size (Cohen's d/h), Type I/II error interactive demo, power analysis with sample size calculator, 5 educational presets, URL state sync
- **CorrelationExplorer**: Interactive scatter plot with click-to-add points, draggable points, regression line overlay with equation (ŷ = mx + b), real-time correlation coefficient (r) and R² display, residual lines visualization, residual plot (residuals vs x), Anscombe's quartet demonstration, 8 correlation presets (strong positive/negative, no correlation, non-linear, outlier effect), causation warning component, statistics panel (n, r, R², slope, intercept, standard error), URL state sync
- **IntegrationExplorer**: 8 preset functions with interesting integration properties, 5 Riemann sum methods (left, right, midpoint, trapezoidal, Simpson's), SVG visualization with function curve and colored rectangles (blue positive, red negative), bounds controls (a, b) with n slider (1-200), convergence animation with play/pause/speed controls, real-time approximation, exact value, and error display, URL state sync

**Visualization Components**:
- **CoordinateSystem**: Reusable SVG coordinate system with axes, grid, labels
- **PlotCurve**: Plot mathematical functions as SVG paths
- **PlotPoint**: Render labeled points on coordinate system
- **PlotLine**: Vertical/horizontal lines (axis of symmetry, asymptotes)
- **HistogramChart**: SVG histogram with adjustable bin count
- **BoxPlotChart**: SVG box plot with quartiles, whiskers, and outlier markers

**Testing Infrastructure**:
- 1852 unit tests (Vitest) - including integration (76), useIntegration (32), correlation (70), hypothesis testing (103), sampling (110), distributions (209), vector3d (92), matrix3d (112), and isometricProjection tests
- E2E tests (Playwright) with tiered CI approach - including integration, correlation and hypothesis testing tests
- Visual regression tests (Playwright screenshot comparison) - local only
- WCAG 2.1 AA accessibility audits via axe-core
- **Tiered CI workflow**: quick-check (push), full-test (PR only)

**Supporting Infrastructure**:
- URL state sync for shareable widget links
- KaTeX math rendering, Shiki syntax highlighting
- Responsive design, dark/light theme
- GitHub Pages deployment
- `data-testid` attributes for test reliability

---

## Quick Reference

### Key Commands
```bash
npm run dev          # Start dev server
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests (grep-invert @visual)
npm run test:a11y    # Run accessibility tests only (@a11y)
npm run test:visual  # Run visual regression tests (@visual)
npm run test:visual:update  # Update visual baselines
npm run test:all     # Run unit + E2E + a11y tests
npm run build        # Production build
```

### Key Files
| Purpose | File |
|---------|------|
| Project guide | `CLAUDE.md` |
| Testing docs | `docs/TESTING.md` |
| Visual testing docs | `docs/VISUAL_TESTING.md` |
| Decisions | `docs/DECISIONS.md` |
| Lessons learned | `docs/LL_LI.md` |
| Routes | `src/router/index.ts` |
| Navigation data | `src/data/navigation.ts` |
| Type definitions | `src/types/index.ts` |
| E2E tests | `e2e/` directory |
| Playwright config | `playwright.config.ts` |
| Statistics utilities | `src/utils/math/statistics.ts` |
| Statistics composable | `src/composables/useStatistics.ts` |
| Product utilities | `src/utils/math/product.ts` |
| Vector utilities | `src/utils/math/vector.ts` |
| Vector composable | `src/composables/useVectors.ts` |
| Matrix utilities | `src/utils/math/matrix.ts` |
| Matrix composable | `src/composables/useMatrixTransformations.ts` |
| Limits utilities | `src/utils/math/limits.ts` |
| Limits composable | `src/composables/useLimits.ts` |
| Derivative utilities | `src/utils/math/derivative.ts` |
| Derivative composable | `src/composables/useDerivative.ts` |
| Right Triangle utilities | `src/utils/math/rightTriangle.ts` |
| Right Triangle composable | `src/composables/useRightTriangle.ts` |
| Trig Identities utilities | `src/utils/math/trigIdentities.ts` |
| Inverse Trig utilities | `src/utils/math/inverseTrig.ts` |
| Inverse Trig composable | `src/composables/useInverseTrig.ts` |
| Trig Applications utilities | `src/utils/math/trigApplications.ts` |
| Trig Playground composable | `src/composables/useTrigPlayground.ts` |
| Vector 3D utilities | `src/utils/math/vector3d.ts` |
| Vector 3D composable | `src/composables/useVectors3D.ts` |
| Matrix 3D utilities | `src/utils/math/matrix3d.ts` |
| Matrix 3D composable | `src/composables/useMatrixTransformations3D.ts` |
| Isometric projection composable | `src/composables/useIsometricProjection.ts` |
| Distributions utilities | `src/utils/math/distributions.ts` |
| Distributions composable | `src/composables/useDistributions.ts` |
| Sampling utilities | `src/utils/math/sampling.ts` |
| Sampling composable | `src/composables/useSamplingSimulator.ts` |
| Hypothesis testing utilities | `src/utils/math/hypothesis.ts` |
| Hypothesis testing composable | `src/composables/useHypothesisTesting.ts` |
| Correlation utilities | `src/utils/math/correlation.ts` |
| Correlation composable | `src/composables/useCorrelation.ts` |
| Integration utilities | `src/utils/math/integration.ts` |
| Integration composable | `src/composables/useIntegration.ts` |

### Archived Documentation
Phase completion summaries are in `docs/archive/`:
- `PHASE_3_COMPLETE.md` - Content components
- `PHASE_4_COMPLETE.md` - Interactive widgets
- `PHASE_5_COMPLETE.md` - Algebra & summation

---

## Test Coverage

### Unit Tests (1852 tests)
- Math utilities (number classification, parsing, quadratic, exponential, trigonometry, statistics, product, vector, matrix, limits, derivative, rightTriangle, trigIdentities, inverseTrig, trigApplications, vector3d, matrix3d, distributions, sampling, hypothesis, correlation, integration functions)
- Data validation (symbols, navigation)
- Component logic (via composables)

### E2E Tests
- Navigation (header links, breadcrumbs, mobile menu)
- NumberTypeExplorer (input, examples, visualizations, URL sync)
- SummationExplorer (presets, bounds, animation, URL sync)
- QuadraticExplorer (presets, coefficients, equation forms, roots)
- UnitCircleExplorer (angle controls, special angles, trig values, wave graphs)
- StatisticsCalculator (datasets, custom data, histograms, box plots, URL sync)
- **VectorOperations** (inputs, operations, presets, canvas, URL sync)
- **MatrixTransformations** (transformation types, sliders, presets, custom matrix, URL sync)
- **LimitsExplorer** (preset functions, approach point, direction toggle, epsilon-delta controls, animation, URL sync)
- **DerivativeVisualizer** (preset functions, point of tangency, secant controls, animation, derivative curve, URL sync)
- **VectorOperations3D** (inputs, operations, presets, canvas, cross product, right-hand rule, URL sync)
- **MatrixTransformations3D** (transformation types, sliders, presets, matrix display, unit cube, URL sync)
- **DistributionExplorer** (distribution tabs, parameters, probability calculator, histogram, URL sync)
- **CLTDemonstration** (samples, auto-run, reset, histogram, normal curve)
- **SamplingSimulator** (sampling methods, population grid, sample drawing, CI demo, bootstrap, URL sync)
- **HypothesisTestingSimulator** (test types, alternative hypotheses, alpha levels, presets, type error demo, power analysis, URL sync)
- **CorrelationExplorer** (scatter plot interactions, add/remove points, random data, presets, Anscombe's quartet, residuals toggle, URL sync)
- **IntegrationExplorer** (preset functions, bounds controls, n slider, method selection, canvas visualization, results display, convergence animation, URL sync)
- Accessibility (WCAG 2.1 AA audits for all pages including calculus integration)

### Visual Regression Tests (Local Only)
- All pages baseline screenshots
- Widget state snapshots (default, inputs, presets)
- Desktop (1280x720) and mobile (375x667) viewports
- **Not run in CI** - local validation only

---

## How to Resume Development

1. **Check todo list**: `docs/TODO.md` for known issues and ideas
2. **Read decisions**: `docs/DECISIONS.md` for architectural context
3. **Start dev server**: `npm run dev`
4. **Verify before commits**:
   ```bash
   npm run type-check && npm run lint && npm run test && npm run build
   ```
5. **Run E2E tests**:
   ```bash
   npm run build
   npm run test:e2e
   ```
6. **Update visual baselines** (if UI changed intentionally):
   ```bash
   npm run test:visual:update
   ```

---

## Known Build Notes

- **Chunk Size Warnings**: Shiki produces large language chunks (lazy-loaded, acceptable)
- **v-html Warnings**: ESLint warns about v-html in MathBlock/CodeExample (expected, trusted content)

---

## Phase 20 Completion Summary

Phase 20 implemented Correlation & Regression: the CorrelationExplorer widget with interactive scatter plot, regression line, residual visualization, Anscombe's quartet, and comprehensive content page. This completes the Statistics section and bridges toward ML foundations.

### Completed Increments

**Increment 20A: Correlation Math Utilities**
- Created `src/utils/math/correlation.ts` with 70 comprehensive tests
- Types: `Point`, `LinearRegressionResult`, `ResidualAnalysis`, `CorrelationPreset`, `AnscombeDataset`
- Functions: `pearsonCorrelation`, `interpretCorrelation`, `linearRegression`, `predictY`
- Functions: `calculateResiduals`, `analyzeResiduals`, `standardErrorOfEstimate`
- Functions: `cooksDistance`, `identifyOutliers`
- Helper functions: `mean`, `standardDeviation`, `pointsToArrays`, `arraysToPoints`
- Anscombe's Quartet data (4 famous datasets with identical r ≈ 0.816)
- 8 correlation presets: strong-positive, strong-negative, moderate-positive, weak-negative, no-correlation, quadratic, outlier-effect, heteroscedastic

**Increment 20B: useCorrelation Composable**
- Created `src/composables/useCorrelation.ts` for state management + URL sync
- Point management: add, remove, move, clear, generate random
- Computed statistics: correlation, regression, residuals, R²
- Preset and Anscombe dataset loading
- Toggle states for regression line, residuals, confidence intervals
- URL state synchronization with 300ms debounce (per LL-015)

**Increment 20C-20E: CorrelationExplorer Widget Components**
- Built widget in `src/components/widgets/CorrelationExplorer/`:
  - `CorrelationExplorer.vue` - main orchestrator with tabbed interface (Explorer, Presets, Anscombe)
  - `ScatterPlot.vue` - SVG canvas with click-to-add points, draggable points, regression line overlay
  - `CorrelationStats.vue` - statistics panel (n, r, R², slope, intercept, equation, standard error)
  - `ResidualPlot.vue` - residuals vs x visualization
  - `CorrelationPresets.vue` - preset selector with 8 correlation patterns
  - `AnscombeQuartet.vue` - Anscombe's quartet with educational explanation
  - `CausationWarning.vue` - prominent "Correlation ≠ Causation" warning
  - `index.ts` - barrel exports

**Increment 20F: Content Page**
- Created `src/views/statistics/CorrelationView.vue` content page
- Three-analogy blocks (everyday, programming, visual)
- Common pitfall callout (confusing correlation with causation)
- Sections: Introduction, Pearson Correlation, Linear Regression, R², Residuals, Multiple Regression & ML Bridge
- Python code examples throughout (numpy, scipy, scikit-learn)
- Code examples for correlation calculation, regression, and ML integration

**Increment 20G: E2E Tests**
- Created `e2e/statistics/correlation.spec.ts` with comprehensive E2E tests
- Tests cover page structure, widget interactions, scatter plot, presets, Anscombe's quartet
- Toggle controls (regression line, residuals, confidence intervals)
- URL state sync tests
- Accessibility tests (form controls, buttons, heading hierarchy)

### Key Architectural Decisions (Phase 20)
- D-155: Interactive scatter plot with click-to-add and draggable points
- D-156: Pearson correlation coefficient with interpretation thresholds
- D-157: Anscombe's quartet as separate tab demonstrating "always visualize data"
- D-158: Residual plot as toggle feature (not always shown)
- D-159: Composable pattern (useCorrelation) following established conventions
- D-160: "Correlation ≠ Causation" warning as dedicated component

### Lessons Learned (Phase 20)
- LL-066: SVG click-to-add requires coordinate transformation from screen to data space
- LL-067: Draggable points need throttled updates to prevent performance issues

### Lessons Identified (Phase 20)
- LI-085: Anscombe's quartet effectively demonstrates importance of visualization
- LI-086: Tabbed interface (Explorer, Presets, Anscombe) organizes correlation concepts well
- LI-087: Residual plot toggle allows focused learning progression

---

## Phase 21 Completion Summary

Phase 21 implemented Integration (Integral Calculus): the IntegrationExplorer widget with Riemann sum visualization, 5 approximation methods, convergence animation, and comprehensive content page. This completes the Calculus section's core topics.

### Completed Increments

**Increment 21A: Integration Math Utilities**
- Created `src/utils/math/integration.ts` with 76 comprehensive tests
- Types: `RiemannMethod`, `RiemannSumResult`, `RiemannSamplePoint`, `IntegrationResult`, `IntegrationFunctionPreset`, `IntegrationInterestingPoint`
- Riemann sum methods: `riemannSumLeft`, `riemannSumRight`, `riemannSumMidpoint`, `riemannSumTrapezoidal`, `riemannSumSimpson`
- Main dispatcher: `riemannSum(f, a, b, n, method)` routing to appropriate method
- 8 preset functions: linear, quadratic, sine, exponential, reciprocal, cubic-signed, semicircle, constant
- Utility functions: `clampN`, `validateBounds`, `isEffectivelyZero`
- Constants: `DEFAULT_N=10`, `MAX_N=200`, `MIN_N=1`, `DEFAULT_METHOD='midpoint'`

**Increment 21B: useIntegration Composable**
- Created `src/composables/useIntegration.ts` with 32 tests for state management + URL sync
- Reactive state: preset, bounds (a, b), subdivisions (n), method
- Computed: riemannResult, integrationResult, exactValue, relativeError, functionPoints
- Setter functions for all state updates
- URL state synchronization with 300ms debounce (per LL-015)

**Increment 21C: IntegrationExplorer Widget Components**
- Built widget in `src/components/widgets/IntegrationExplorer/`:
  - `IntegrationExplorer.vue` - main orchestrator with data-testid
  - `FunctionSelector.vue` - dropdown for preset selection with formula display
  - `BoundsControls.vue` - bounds inputs (a, b) and n slider (1-200)
  - `MethodSelector.vue` - radio buttons for 5 Riemann methods
  - `ResultsDisplay.vue` - approximation, exact value, error display
  - `IntegrationCanvas.vue` - SVG visualization with function curve and rectangles
  - `index.ts` - barrel exports

**Increment 21D: Convergence Animation**
- Created `ConvergenceAnimation.vue` component
- Play/pause/reset controls
- requestAnimationFrame animation with smooth n increment
- Speed control (0.5x to 3x)
- Progress bar and live stats (n, approximation, error)
- Real-time display of convergence to exact value

**Increment 21E: Content Page**
- Created `src/views/calculus/IntegrationView.vue` content page
- Three-analogy blocks (everyday: odometer, programming: accumulator, visual: area)
- Common pitfall callout (signed vs unsigned area)
- Sections: Introduction, Signed Area, Riemann Sums, Fundamental Theorem, Common Pitfalls
- Python code examples (scipy.integrate, numpy trapz/simps)
- Related topics linking to Limits, Derivatives, Summation

**Increment 21F: E2E Tests & Polish**
- Created `e2e/widgets/integration-explorer.spec.ts` with comprehensive E2E tests
- Created `e2e/accessibility/integration.spec.ts` for WCAG compliance
- Tests cover preset selection, bounds controls, method selection, canvas, results, animation, URL sync
- All 1852 unit tests pass, build succeeds

### Key Architectural Decisions (Phase 21)
- D-120: Widget named IntegrationExplorer (consistent with Limits/Derivatives pattern)
- D-121: Single view with collapsible panels (not tabs)
- D-122: Preset-based functions only (no arbitrary user input)
- D-123: Include Simpson's rule (demonstrates O(1/n⁴) convergence)
- D-124: Blue positive/red negative area visualization for signed area
- D-125: Smooth n increment animation using requestAnimationFrame
- D-126: Geometric interpretation focus (area, accumulation)
- D-127: URL state sync for preset, bounds, n, method

### Lessons Learned (Phase 21)
- LL-068: Simpson's rule requires even n; automatically adjust to next even number
- LL-069: Semicircle preset needs careful domain handling for negative sqrt

### Lessons Identified (Phase 21)
- LI-088: Convergence animation effectively demonstrates Riemann sum limit definition
- LI-089: Color-coded rectangles (blue/red) clearly show signed area concept
- LI-090: Error percentage display motivates increasing n for better approximation

---

## Phase 20 Completion Summary

Phase 20 implemented Correlation & Regression: the CorrelationExplorer widget with interactive scatter plot, regression line, residual visualization, Anscombe's quartet, and comprehensive content page. This completes the Statistics section and bridges toward ML foundations.

### Completed Increments

**Increment 19A: Hypothesis Testing Math Utilities**
- Created `src/utils/math/hypothesis.ts` with 103 comprehensive tests
- Types: `TestType`, `Alternative`, `TestResult`, `HypothesisTestPreset`, `PowerCurvePoint`, `DistributionCurvePoint`
- T-distribution functions: `tDistributionPDF`, `tDistributionCDF` (using log-gamma and regularized incomplete beta)
- One-sample t-test: `oneSampleTTest` with effect size calculation
- Two-sample t-test: `twoSampleTTest` (Welch's approach for unequal variances)
- One-proportion z-test: `oneProportionZTest` with Cohen's h effect size
- Two-proportion z-test: `twoProportionZTest` with pooled standard error
- Effect size: Cohen's d for t-tests, Cohen's h for proportion tests
- Power analysis: `calculatePower`, `requiredSampleSize`, `generatePowerCurve`
- Critical values: `getCriticalT`, `getCriticalZ`
- 5 educational presets: default, drug-efficacy, quality-control, benchmark-comparison, user-survey

**Increment 19B: useHypothesisTesting Composable**
- Created `src/composables/useHypothesisTesting.ts` for state management + URL sync
- Test type selection with alternative hypothesis options (two-sided, less, greater)
- Alpha level selection (0.01, 0.05, 0.10)
- State for all four test types with appropriate inputs
- Type I/II error demo state (alpha, effect size, sample size)
- Power analysis state (effect size, desired power, test type)
- Computed results for all tests with proper formula application
- URL state synchronization with 300ms debounce (per LL-015)

**Increment 19C: HypothesisTestingSimulator Widget Components**
- Built widget in `src/components/widgets/HypothesisTestingSimulator/`:
  - `HypothesisTestingSimulator.vue` - main orchestrator with tabbed interface
  - `TestTypeSelector.vue` - test type buttons, alternative hypothesis, alpha level
  - `TestInputs.vue` - dynamic inputs for each test type (means, std devs, n, proportions)
  - `TestResults.vue` - test statistic, p-value, effect size, decision, assumption warnings
  - `PValueVisualization.vue` - SVG distribution curve with rejection region shading
  - `HypothesisPresets.vue` - preset selector for different scenarios
  - `TypeErrorDemo.vue` - Type I/II error interactive visualization with alpha/effect/n sliders
  - `PowerAnalysis.vue` - power curve with sample size calculator
  - `index.ts` - barrel exports

**Increment 19D: Content Page**
- Created `src/views/statistics/HypothesisTestingView.vue` content page
- Three-analogy blocks (legal trial, anomaly detection, visual intuition)
- Common pitfall callout (p-value misinterpretation)
- Sections for hypothesis testing logic, p-values, Type I/II errors, power, effect size
- Python code examples throughout (scipy.stats, statsmodels)
- A/B testing section with practical example
- Related topics linking to Statistics Overview and Sampling

**Increment 19E: E2E Tests**
- Created `e2e/statistics/hypothesis-testing.spec.ts` with 35 comprehensive E2E tests
- Tests cover page content, widget interactions, test types, presets, tabs
- Type I/II error demo tests (sliders, displays)
- Power analysis tests (effect size, desired power, sample size calculation)
- Accessibility tests (axe-core WCAG 2.1 AA, ARIA roles)
- URL state sync tests
- Added data-testid attributes to all interactive elements

### Key Architectural Decisions (Phase 19)
- D-149: T-distribution implementation using log-gamma and regularized incomplete beta functions
- D-150: Four test types covering common hypothesis testing scenarios
- D-151: Effect size display (Cohen's d for t-tests, Cohen's h for proportion tests)
- D-152: Tabbed interface for test, type errors, and power analysis
- D-153: Power curve visualization with 80%/90% power reference lines
- D-154: Composable pattern (useHypothesisTesting) following established conventions

### Lessons Learned (Phase 19)
- LL-064: axe-core timing issues with Vue ARIA attributes require workarounds
- LL-065: Accessibility test exclusions for design decisions (color-contrast for dark theme)

### Lessons Identified (Phase 19)
- LI-082: Type I/II error visualization with dual distribution curves is highly educational
- LI-083: Power analysis calculator with reference lines (80%/90%) aids study design
- LI-084: Tabbed interface scales well for multi-panel statistical widgets

---

## Phase 18 Completion Summary

Phase 18 implemented Sampling & Estimation: the SamplingSimulator widget with 4 sampling methods, confidence interval demonstration, bootstrap resampling, and comprehensive content page.

### Completed Increments

**Increment 18A: Sampling Math Utilities**
- Created `src/utils/math/sampling.ts` with 110 comprehensive tests
- Types: `SamplingMethod`, `PopulationDistribution`, `PopulationConfig`, `SampleResult`, `ConfidenceInterval`, `BootstrapResult`, `SamplingPreset`
- Population generation: `generatePopulation` (normal, uniform, exponential distributions)
- Sampling methods: `simpleRandomSample`, `stratifiedSample`, `systematicSample`, `clusterSample`
- Statistics: `mean`, `standardDeviation`, `standardErrorMean`, `calculateSampleStatistics`
- Confidence intervals: `confidenceIntervalMean`, `confidenceIntervalProportion`, `tCriticalValue`, `zCriticalValue`
- Bootstrap: `bootstrap`, `bootstrapPercentileCI`
- Sample size: `sampleSizeForMean`, `sampleSizeForProportion`
- 5 educational presets: default, user-survey, quality-control, election-poll, website-ab-test

**Increment 18B: useSamplingSimulator Composable**
- Created `src/composables/useSamplingSimulator.ts` for state management + URL sync
- Population generation with configurable size and distribution
- Sample management with history tracking
- CI simulation state for coverage demonstration
- Bootstrap state with original sample preservation
- Sample size calculator state for mean and proportion
- URL state synchronization with 300ms debounce (per LL-015)

**Increment 18C: SamplingSimulator Widget Components**
- Built widget in `src/components/widgets/SamplingSimulator/`:
  - `SamplingSimulator.vue` - main orchestrator component
  - `PopulationGrid.vue` - SVG visualization of population with sampled items highlighted
  - `SamplingMethodSelector.vue` - radio group for 4 sampling methods
  - `SampleSizeControls.vue` - slider, buttons, animation toggle
  - `SamplingDistribution.vue` - histogram of sample means with normal curve overlay
  - `SamplingResults.vue` - current sample statistics and CI display
  - `ConfidenceIntervalDemo.vue` - CI coverage simulation with capture rate
  - `BootstrapPanel.vue` - bootstrap resampling demonstration
  - `SampleSizeCalculator.vue` - sample size formulas for mean and proportion
  - `SamplingPresets.vue` - preset selector for different scenarios
  - `index.ts` - barrel exports

**Increment 18D: Content Page**
- Created `src/views/statistics/SamplingView.vue` content page
- Three-analogy blocks (soup tasting, profiling, sample grid)
- Common pitfall callout (sample size vs. representativeness)
- Sections for sampling methods, standard error, confidence intervals, bootstrap
- Python code examples throughout
- Related topics linking to Statistics Overview and Probability Distributions

**Increment 18E: E2E Tests**
- Created `e2e/statistics/sampling-simulator.spec.ts` with comprehensive E2E tests
- Tests cover page content, widget interactions, sampling methods, CI demo, bootstrap panel
- Accessibility tests (axe-core WCAG 2.1 AA, ARIA roles)
- URL state sync tests
- Mobile responsiveness tests

### Key Architectural Decisions (Phase 18)
- D-142: Four sampling methods with visual distinction (simple=random, stratified=colored groups, systematic=regular intervals, cluster=grouped)
- D-143: Population grid uses SVG with individual circles for items
- D-144: CI coverage demo shows capture rate converging to confidence level
- D-145: Bootstrap panel requires sample before running (educational flow)
- D-146: t-distribution approximation using Cornish-Fisher expansion
- D-147: Composable pattern (useSamplingSimulator) following established conventions

### Lessons Learned (Phase 18)
- LL-062: t-critical value approximation requires Cornish-Fisher expansion for accuracy
- LL-063: Bootstrap percentile CI uses sorted resampled means for interval bounds

### Lessons Identified (Phase 18)
- LI-079: Population grid visualization effectively shows sampling selection
- LI-080: CI coverage demo with auto-run demonstrates capture rate convergence
- LI-081: Sample size calculator benefits from separate tabs for mean vs proportion

---

## Phase 17 Completion Summary

Phase 17 implemented Probability Distributions: the DistributionExplorer widget with 5 distributions, CLT demonstration component, and comprehensive content page.

### Completed Increments

**Increment 17A: Distribution Math Utilities**
- Created `src/utils/math/distributions.ts` with 209 comprehensive tests
- Types: `DistributionType`, `DistributionParams`, `DistributionConfig`, `HistogramBin`
- PDF/PMF functions: `normalPdf`, `binomialPmf`, `poissonPmf`, `exponentialPdf`, `uniformPdf`
- CDF functions: `normalCdf`, `binomialCdf`, `poissonCdf`, `exponentialCdf`, `uniformCdf`
- Quantile functions: `normalQuantile`, `binomialQuantile`, `poissonQuantile`, `exponentialQuantile`, `uniformQuantile`
- Sampling functions: `generateSamples`, `createHistogram`
- Statistics helpers: `getDistributionStats`, `calculateProbability`
- Error function implementation for normal distribution CDF

**Increment 17B: useDistributions Composable**
- Created `src/composables/useDistributions.ts` for state management + URL sync
- Distribution selection with type-safe parameter handling
- Computed PDF/CDF data points for visualization
- Probability calculator state (lower/upper bounds)
- Sample generation and histogram data
- URL state synchronization for shareable links

**Increment 17C: DistributionExplorer Widget Components**
- Built widget in `src/components/widgets/DistributionExplorer/`:
  - `DistributionExplorer.vue` - main orchestrator component with tabs
  - `DistributionSelector.vue` - distribution type tabs
  - `ParameterControls.vue` - distribution-specific parameter sliders
  - `DistributionChart.vue` - SVG PDF/CDF visualization with bars/curves
  - `ProbabilityCalculator.vue` - P(X < a), P(a < X < b) calculator
  - `DistributionStats.vue` - mean, variance, std dev, mode display
  - `SampleHistogram.vue` - histogram from random samples
  - `index.ts` - barrel exports

**Increment 17D: Testing**
- Type-check and lint passed
- All 1461 unit tests pass

**Increment 17E: CLT Demonstration**
- Created `CLTDemonstration.vue` component
- Source distribution selector (uniform, exponential, binomial, poisson)
- Sample size slider (5-100)
- Take samples, auto-run, and reset buttons
- Histogram visualization of sample means
- Normal curve overlay for comparison
- Theoretical mean and std dev display
- Educational explanation of CLT

**Increment 17F: Content Page & E2E Tests**
- Created `src/views/statistics/DistributionsView.vue` content page
- Three-analogy blocks (everyday, programming, visual)
- Sections for discrete vs continuous, each of 5 distributions
- Interactive DistributionExplorer widget with URL sync
- CLT demonstration section
- Code examples (Python) for all distributions
- Common pitfalls section
- Distribution quick reference table
- Related topics
- Created `e2e/statistics/distribution-explorer.spec.ts` with comprehensive E2E tests

### Key Architectural Decisions (Phase 17)
- D-134: Discriminated union pattern for distribution parameters
- D-135: Tab-based distribution selector with visual icons
- D-136: SVG bars for discrete distributions, smooth curves for continuous
- D-137: CLT as separate opt-in component (not embedded in main widget)
- D-138: Error function approximation for normal CDF (no external library)
- D-139: Composable pattern (useDistributions) following established conventions

### Lessons Learned (Phase 17)
- LL-060: Error function (erf) approximation is sufficient for educational purposes
- LL-061: Discriminated unions require careful type narrowing in Vue computed properties

### Lessons Identified (Phase 17)
- LI-075: Tab-based distribution selection scales well for multiple distributions
- LI-076: CLT demonstration benefits from auto-run animation with stop control
- LI-077: Histogram bin width calculation differs for discrete vs continuous distributions

---

## Phase 16 Completion Summary

Phase 16 implemented Linear Algebra in 3D: 3D vector operations with cross product and 3D matrix transformations with rotation matrices.

### Completed Increments

**Increment 16A: 3D Vector Math Utilities**
- Created `src/utils/math/vector3d.ts` with 92 comprehensive tests
- Types: `Vector3D`, `Vector3DOperation`, `Vector3DPreset`
- Functions: `vector3DAdd`, `vector3DSubtract`, `vector3DScalarMultiply`, `vector3DDotProduct`, `vector3DCrossProduct`
- Functions: `vector3DMagnitude`, `vector3DNormalize`, `vector3DAngleBetween`
- Functions: `isZeroVector3D`, `isParallel3D`, `isPerpendicular3D`, `isValidVector3D`, `clampVector3DToRange`
- 5 educational presets: standard-basis, cross-demo, dot-perpendicular, parallel, space-diagonal

**Increment 16B: VectorOperations3D Widget + Content Page**
- Created `src/composables/useVectors3D.ts` for state management + URL sync
- Built widget in `src/components/widgets/VectorOperations3D/`:
  - `VectorOperations3D.vue` - main orchestrator component
  - `Vector3DInputPanel.vue` - 3D coordinate inputs with color coding
  - `Operation3DSelector.vue` - 8 operation buttons with radio group semantics
  - `Result3DDisplay.vue` - results with LaTeX formulas and relationship badges
  - `Vector3DPresets.vue` - preset selector and swap button
  - `IsometricCanvas3D.vue` - SVG isometric projection canvas
  - `RightHandRuleDemo.vue` - visual demo for cross product orientation
- Created `src/views/linear-algebra/Vectors3DView.vue` content page
- Updated routes and navigation

**Increment 16C: 3D Matrix Math Utilities**
- Created `src/utils/math/matrix3d.ts` with 112 comprehensive tests
- Types: `Matrix3x3`, `Rotation3DType`, `Transform3DPreset`
- Functions: `identityMatrix3x3`, `rotationMatrixX`, `rotationMatrixY`, `rotationMatrixZ`, `combinedRotationMatrix`
- Functions: `scaleMatrix3x3`, `uniformScaleMatrix3x3`
- Functions: `matrix3x3Multiply`, `matrix3x3VectorMultiply`, `determinant3x3`
- Functions: `isOrthogonal3x3`, `isRotationMatrix`, `formatMatrix3x3`
- 8 educational presets: rotate-x-90, rotate-y-45, rotate-z-30, rotate-combined, scale-2x, scale-half, flip-y, custom

**Increment 16D: MatrixTransformations3D Widget + Content Page**
- Created `src/composables/useMatrixTransformations3D.ts` for state management + URL sync
- Built widget in `src/components/widgets/MatrixTransformations3D/`:
  - `MatrixTransformations3D.vue` - main orchestrator component
  - `Transform3DControls.vue` - transformation type buttons with sliders for angles/scale
  - `Matrix3DDisplay.vue` - 3×3 matrix display
  - `Transform3DInfo.vue` - determinant display with property badges
  - `UnitCubeCanvas3D.vue` - SVG isometric projection of unit cube transformation
  - `Transform3DPresets.vue` - preset selector
- Created `src/views/linear-algebra/Matrices3DView.vue` content page
- Updated routes and navigation

**Increment 16E: Isometric Projection Composable**
- Created `src/composables/useIsometricProjection.ts` with comprehensive tests
- Standard isometric projection (30° angles)
- Functions: `toScreen`, `toWorld`, `generateGridLines`, `generateGridPath`
- Functions: `generateMarkers`, `generateAxes`, `generateVectorPath`
- Functions: `projectToXZPlane`, `generateDropLine`
- Right-handed, Y-up coordinate system

**Increment 16F: E2E Tests**
- Created `e2e/widgets/vector-operations-3d.spec.ts` with comprehensive tests
- Created `e2e/widgets/matrix-transformations-3d.spec.ts` with comprehensive tests
- Tests cover widget rendering, operation selection, presets, canvas visualization, URL sync, responsive design

### Key Architectural Decisions (Phase 16)
- D-133: Isometric projection for 3D visualization (30° angles, Y-up coordinate system)
- D-134: Cross product as default operation for 3D vectors (unique to 3D)
- D-135: Right-hand rule demo component for cross product education
- D-136: Euler angle composition (Rx → Ry → Rz order)
- D-137: Unit cube visualization for 3D matrix transformations
- D-138: Reusable isometric projection composable

### Lessons Learned (Phase 16)
- LL-051: Isometric projection requires careful coordinate system handling (SVG Y-axis inverted)
- LL-052: Cross product visualization benefits from drop lines showing height above XZ plane

### Lessons Identified (Phase 16)
- LI-063: Isometric projection composable pattern for reusable 3D visualization
- LI-064: Unit cube with basis vectors effectively demonstrates 3D transformations
- LI-065: Right-hand rule demo essential for cross product understanding

---

## Phase 15 Completion Summary

Phase 15 implemented remaining trigonometry topics: Right Triangle Trigonometry, Trig Identities, Inverse Functions, and Trig in Code.

### Completed Increments

**Increment 15A: Right Triangle Math Utilities**
- Created `src/utils/math/rightTriangle.ts` with 30+ comprehensive tests
- Types: `RightTriangle`, `TriangleSolveResult`, `SolveStep`, `InputMode`, `RightTrianglePreset`
- Functions: `solveRightTriangle`, `solveFromTwoSides`, `solveFromSideAndAngle`
- Functions: `calculateArea`, `calculatePerimeter`, `isValidTriangle`, `formatAngle`, `formatSide`
- 5 educational presets: 3-4-5, isoceles-right, 30-60-90, 45-45-90, pythagorean-5-12-13

**Increment 15B: RightTriangleSolver Widget + Content Page**
- Created `src/composables/useRightTriangle.ts` for state management + URL sync
- Built widget in `src/components/widgets/RightTriangleSolver/`
- Created `src/views/trigonometry/RightTriangleView.vue` content page
- Updated routes and navigation

**Increment 15C: Trig Identities Utilities + Widget + Content Page**
- Created `src/utils/math/trigIdentities.ts` with 82 comprehensive tests
- 21 identities across 6 categories (Pythagorean, Quotient, Reciprocal, Sum/Difference, Double Angle, Half Angle)
- Built widget in `src/components/widgets/TrigIdentityExplorer/`
- Created `src/views/trigonometry/TrigIdentitiesView.vue` content page

**Increment 15D-15F: Inverse Trigonometric Functions**
- Created `src/utils/math/inverseTrig.ts` with 83 comprehensive tests
- Types: `InverseResult`, `Atan2Result`, `InverseFunctionId`, `ExactAngle`
- Functions: `arcsin`, `arccos`, `arctan`, `atan2`, `evaluateInverse`, `findAllSolutions`, `findExactAngle`
- Domain validation with clear error messages
- Exact angle detection for special values (0°, 30°, 45°, 60°, 90°, etc.)
- 10 educational presets covering all inverse functions
- Created `src/composables/useInverseTrig.ts` for state management + URL sync
- Built widget in `src/components/widgets/InverseTrigExplorer/`:
  - `InverseTrigExplorer.vue` - main orchestrator with function tabs
  - `FunctionSelector.vue` - arcsin/arccos/arctan/atan2 selector
  - `ValueInput.vue` - inputs with atan2 dual-input support
  - `InverseVisualization.vue` - SVG unit circle showing resulting angle
  - `ResultDisplay.vue` - results with atan2 vs atan comparison
  - `PresetSelector.vue` - quick example buttons
- Created `src/views/trigonometry/InverseTrigView.vue` content page with three-analogy block and atan2 pitfall

**Increment 15G-15K: Trig in Code / Applications**
- Created `src/utils/math/trigApplications.ts` with 83 comprehensive tests
- Types: `Point2D`, `Vector2D`, `WaveParams`, `ProjectileParams`, `ProjectileState`, `DemoType`
- Rotation functions: `rotatePoint`, `rotatePointAround`, `rotationMatrix`
- Circular motion: `circularMotion`, `orbitPosition`, `generateCirclePath`
- Wave functions: `sineWave`, `cosineWave`, `generateWavePoints`, `combineWaves`
- Angle functions: `angleToTarget`, `angleBetweenVectors`, `normalizeAngle`, `angularDifference`
- Projectile motion: `projectilePosition`, `projectileVelocity`, `projectileTrajectory`, `projectileRange`, `projectileMaxHeight`, `projectileFlightTime`
- Animation easing: `easeInOutSine`, `easeInSine`, `easeOutSine`, `bounce`, `pendulum`, `elastic`
- 12 presets across 4 demo types
- Created `src/composables/useTrigPlayground.ts` for multi-demo state management + animation + URL sync
- Built widget in `src/components/widgets/TrigCodePlayground/`:
  - `TrigCodePlayground.vue` - main orchestrator with demo tabs
  - `DemoTabs.vue` - rotation/wave/circular/projectile tab selector
  - `RotationDemo.vue` - interactive point rotation with matrix display
  - `WaveDemo.vue` - sine wave with frequency/amplitude/phase controls
  - `CircularDemo.vue` - orbital motion with play/pause animation
  - `ProjectileDemo.vue` - projectile trajectory with speed/angle controls
- Created `src/views/trigonometry/TrigInCodeView.vue` comprehensive content page with all practical applications

### Key Architectural Decisions (Phase 15)
- D-119 through D-126: Right Triangle and Trig Identities patterns
- D-127: Inverse trig function range conventions (standard mathematical)
- D-128: Exact angle detection for special inverse trig results
- D-129: atan2 vs atan comparison display for quadrant awareness
- D-130: Practical trig applications organized into 4 demo types
- D-131: Demo-specific Python code generation with current parameter values
- D-132: Composable animation pattern with requestAnimationFrame

---

## Phase 14 Completion Summary

Phase 14 accomplished:

1. **Derivative Math Utilities** (14A)
   - Created `src/utils/math/derivative.ts` with 67 comprehensive tests
   - Types: `DerivativeResult`, `TangentLine`, `SecantLine`, `DerivativeFunctionPreset`, `DerivativeInterestingPoint`, `CriticalPointType`, `CriticalPoint`
   - Functions: `centralDifference`, `forwardDifference`, `backwardDifference` (numerical differentiation)
   - Functions: `evaluateDerivative`, `calculateTangentLine`, `calculateSecantLine`, `generateSecantSequence`
   - Functions: `derivativeExists`, `findCriticalPoints`, `classifyCriticalPoint`, `analyzeCriticalPoints`
   - 8 preset functions: linear, quadratic, cubic, polynomial, sine, cosine, exponential, logarithm
   - Constants: `DEFAULT_H`, `DERIVATIVE_TOLERANCE`, `SECANT_H_VALUES`

2. **DerivativeVisualizer Widget Core** (14B)
   - Created `src/composables/useDerivative.ts` for state management + URL sync
   - Built modular component architecture in `src/components/widgets/DerivativeVisualizer/`:
     - `DerivativeVisualizer.vue` - main orchestrator component
     - `FunctionSelector.vue` - preset function selection with MathBlock display
     - `DerivativeCanvas.vue` - SVG canvas with function curve, tangent line, secant line
     - `DerivativeDisplay.vue` - derivative value with slope interpretation

3. **Secant Line & Animation** (14C)
   - Created `SecantControls.vue` - h-value slider with convergence indicator
   - Created `SecantAnimation.vue` - play/pause animation of secant→tangent limit
   - Visual demonstration of limit definition: lim(h→0) [f(x+h) - f(x)] / h

4. **Content Pages** (14D)
   - Updated `src/views/calculus/CalculusIndexView.vue` with derivatives link
   - Created `src/views/calculus/DerivativesView.vue` comprehensive content page
     - Three analogies: speedometer (everyday), finite difference (programming), tangent slope (visual)
     - Interactive DerivativeVisualizer widget with URL sync
     - Collapsible sections: Introduction, Secants to Tangents, Rules, Critical Points, Applications
     - Python code examples: numerical differentiation, gradient descent, linear approximation, autodiff
     - Gradient descent section highlighted for ML relevance

5. **E2E Tests & Polish** (14E)
   - Created `e2e/widgets/derivative-visualizer.spec.ts` with 40+ E2E tests
   - Added derivatives page to accessibility audits
   - Tests cover widget rendering, function selection, point interaction, secant controls, animation, URL sync

**Key Architectural Decisions**:
- D-112: Visual intuition over formal calculus
- D-113: Preset functions rather than arbitrary user input
- D-114: Numerical differentiation (central difference primary)
- D-115: Secant-to-tangent animation for limit definition
- D-116: Composable pattern for derivative state (useDerivative)
- D-117: Tangent line equation display with slope interpretation

**Lessons Learned**:
- LL-049: Numerical differentiation tolerance needs adjustment for different h values (forward/backward less precise than central)
- LL-050: vitest/no-conditional-expect rule requires restructuring tests to filter valid cases first

**Lessons Identified**:
- LI-056: Secant-to-tangent animation effectively demonstrates limit definition of derivative
- LI-057: Derivative value interpretation (increasing/decreasing/horizontal) aids understanding
- LI-058: Preset-based function selection pattern continues to work well for calculus widgets

---

## Content Review Summary

**Date**: 2026-01-18

This interim phase systematically reviewed and upgraded 15 existing topic pages with consistent patterns.

**Topics Reviewed**:
- `/basics`: foundations, number-types, variables, order-of-operations, functions
- `/algebra`: summation, product-notation, linear-equations, quadratics, exponentials
- `/trigonometry`: unit-circle
- `/linear-algebra`: vectors, matrices
- `/statistics`: descriptive
- `/calculus`: limits

**Patterns Applied to All Pages**:

1. **Three-Analogy Block** - Three perspectives on each concept:
   - Everyday Analogy (amber) - Real-world metaphors
   - Programming Analogy (emerald) - Code/CS connections
   - Visual Intuition (blue) - Geometric insights

2. **Common Pitfall Callout** - Warning box highlighting frequent errors:
   - Floating point precision (0.1 + 0.2 ≠ 0.3)
   - Assignment vs equality (= vs ==)
   - Operator precedence (-3**2 = -9)
   - Domain errors (log(0), negative discriminant)
   - Division edge cases

3. **RelatedTopics Enhancement** - Expanded to 3-4 items with cross-section links

4. **Navigation Descriptions** - Updated to engaging hooks under 60 characters

**Documentation Updated**:
- `docs/DESIGN_SYSTEM.md` - Added Content Page Patterns section
- `docs/LL_LI.md` - Added LI-059 through LI-062

**Lessons Identified**:
- LI-059: Three-analogy pattern serves different learning styles
- LI-060: Pitfall callouts prevent errors proactively
- LI-061: Navigation descriptions should be hooks, not summaries
- LI-062: Cross-section RelatedTopics links improve discoverability

---

## Phase 13 Completion Summary

Phase 13 accomplished:

1. **Limits Math Utilities** (13A)
   - Created `src/utils/math/limits.ts` with 58 comprehensive tests
   - Types: `LimitResult`, `ContinuityResult`, `LimitFunctionPreset`, `ApproachDirection`, `LimitApproximationStep`
   - Functions: `evaluateLeftLimit`, `evaluateRightLimit`, `evaluateLimit` (numerical approximation)
   - Functions: `checkContinuity` (detects removable, jump, infinite, oscillating discontinuities)
   - Functions: `numericalLimitApproximation`, `findDeltaForEpsilon`, `isValidApproachPoint`, `getLimitPreset`
   - 8 preset functions: polynomial, rational, step (floor), reciprocal, sinc, sign, oscillating, piecewise
   - Constants: `LIMIT_TOLERANCE`, `DEFAULT_EPSILON`, `DEFAULT_DELTA`

2. **LimitsExplorer Widget Core** (13B)
   - Created `src/composables/useLimits.ts` for state management + URL sync
   - Built modular component architecture in `src/components/widgets/LimitsExplorer/`:
     - `LimitsExplorer.vue` - main orchestrator component
     - `FunctionSelector.vue` - preset function selection with ARIA roles
     - `LimitCanvas.vue` - SVG function curve rendering with approach point
     - `LimitDisplay.vue` - limit value and continuity status display

3. **Epsilon-Delta Visualization** (13C)
   - Created `EpsilonDeltaControls.vue` - sliders for epsilon and delta with accessible labels
   - Created `EpsilonDeltaBands.vue` - SVG visualization of epsilon-delta bands
   - Created `ApproachAnimation.vue` - numerical approximation sequence animation
   - Visual indication of whether delta satisfies epsilon condition

4. **Content Pages** (13D)
   - Created `src/views/calculus/CalculusIndexView.vue` section landing page
     - Three pillars: limits, derivatives, integrals (latter two "Coming Soon")
     - Why programmers need calculus (ML, games, graphics, etc.)
     - Gradient descent Python example
   - Created `src/views/calculus/LimitsView.vue` comprehensive content page
     - Interactive LimitsExplorer widget with URL sync
     - Collapsible sections: Introduction, Epsilon-Delta, One-Sided Limits, Discontinuities, Famous Limits, Applications
     - Python code examples throughout

5. **E2E Tests & Polish** (13E)
   - Created `e2e/widgets/limits-explorer.spec.ts` with 50+ E2E tests
   - Created `e2e/accessibility/calculus.spec.ts` for WCAG compliance
   - Added ARIA labels and roles for accessibility
   - Added accessible slider labels with descriptions

**Key Architectural Decisions**:
- D-106: Visual intuition over formal proofs
- D-107: Preset functions rather than arbitrary user input (safer evaluation)
- D-108: Numerical limit approximation (not symbolic)
- D-109: Epsilon-delta visualization with toggle (advanced feature)
- D-110: Composable pattern for limits state (useLimits)
- D-111: Continuity classification (removable, jump, infinite, oscillating)

**Lessons Learned**:
- LL-047: Infinite limit detection requires checking monotonic divergence pattern
- LL-048: Numerical precision for limits needs both absolute and relative tolerance

**Lessons Identified**:
- LI-052: Preset-based function selection for safe limit evaluation
- LI-053: Epsilon-delta band visualization for formal definition intuition
- LI-054: Numerical approximation animation for approaching concept
- LI-055: Continuity classification based on one-sided limit comparison

---

## Phase 12 Completion Summary

Phase 12 accomplished:

1. **Matrix Math Utilities** (12A)
   - Created `src/utils/math/matrix.ts` with 50+ comprehensive tests
   - Types: `Matrix2x2`, `TransformationType`, `TransformationPreset`
   - Functions: `identityMatrix`, `rotationMatrix`, `scaleMatrix`, `uniformScaleMatrix`
   - Functions: `shearXMatrix`, `shearYMatrix`, `reflectionXMatrix`, `reflectionYMatrix`, `reflectionOriginMatrix`
   - Functions: `matrixMultiply`, `matrixVectorMultiply`, `determinant`, `isOrthogonal`
   - 8 presets: rotate-90, rotate-45, scale-2x, scale-half, flip-x, flip-y, shear-right, shear-up

2. **MatrixTransformations Widget Core** (12B)
   - Created `src/composables/useMatrixTransformations.ts` for state management + URL sync
   - Built modular component architecture in `src/components/widgets/MatrixTransformations/`:
     - `MatrixTransformations.vue` - main orchestrator component
     - `TransformationCanvas.vue` - SVG visualization with unit square, basis vectors

3. **Controls & Display** (12C)
   - Created `TransformationControls.vue` - 8 type buttons with sliders for parameters
   - Created `MatrixDisplay.vue` - 2×2 matrix display with edit mode for custom matrices
   - Created `TransformInfo.vue` - determinant display with property badges

4. **Content Pages** (12D)
   - Updated `src/views/linear-algebra/LinearAlgebraIndexView.vue` with matrices link
   - Created `src/views/linear-algebra/MatricesView.vue` comprehensive content page
     - Interactive MatrixTransformations widget with URL sync
     - 7 collapsible sections: Introduction, Transformation Types, Determinant, Applications, Composition, Python/NumPy
     - Python code examples throughout

5. **E2E Tests & Polish** (12E)
   - Created `e2e/linear-algebra/matrix-transformations.spec.ts` with 23 E2E tests
   - Added matrices page to accessibility audits
   - Added 3 keyboard accessibility tests for matrix widget

**Key Architectural Decisions**:
- D-096: Widget named "MatrixTransformations"
- D-097: 2×2 matrices only (no higher dimensions)
- D-098: Unit square as primary visualization
- D-099: Basis vectors with arrow markers (î blue, ĵ amber)
- D-100: Ten transformation types
- D-101: Determinant-based property badges
- D-102: Composable pattern for matrix state (useMatrixTransformations)
- D-103: Modular widget component architecture
- D-104: Educational presets with named transformations
- D-105: URL parameters use short names (sx, sy, type, angle, shear)

**Lessons Learned**:
- LL-045: URL parameter names must match composable implementation
- LL-046: Default values are not included in URL parameters

**Lessons Identified**:
- LI-048: Transformation type architecture with parameter mapping
- LI-049: Determinant-based property badges
- LI-050: Unit square transformation visualization
- LI-051: Preset system for educational transformations

---

## Phase 11 Completion Summary

Phase 11 accomplished:

1. **Vector Math Utilities** (11A)
   - Created `src/utils/math/vector.ts` with 78 comprehensive tests
   - Types: `Vector2D`, `VectorPreset`, `VectorOperation`
   - Functions: `vectorAdd`, `vectorSubtract`, `scalarMultiply`, `dotProduct`, `magnitude`, `normalize`, `angleBetween`
   - Functions: `isZeroVector`, `isParallel`, `isPerpendicular`, `isValidVector`, `clampVectorToRange`
   - Constants: `VECTOR_TOLERANCE = 1e-10`, `VECTOR_COORDINATE_RANGE = { min: -5, max: 5 }`
   - 5 presets: unit-vectors, perpendicular, parallel, opposite, arbitrary

2. **VectorOperations Widget Core** (11B)
   - Created `src/composables/useVectors.ts` for state management + URL sync
   - Built modular component architecture in `src/components/widgets/VectorOperations/`:
     - `VectorOperations.vue` - main orchestrator component
     - `VectorInputPanel.vue` - coordinate inputs with color coding
     - `VectorCanvas.vue` - SVG visualization with grid, arrows, parallelogram

3. **Operations & Results** (11C)
   - Created `OperationSelector.vue` - 7 operation buttons with radio group semantics
   - Created `ResultDisplay.vue` - results with LaTeX formulas and relationship badges
   - Created `VectorPresets.vue` - preset selector and swap button

4. **Content Pages** (11D)
   - Created `src/views/linear-algebra/LinearAlgebraIndexView.vue` section landing page
     - ML context: why linear algebra matters for machine learning
     - Core concepts preview (vectors, matrices, dot product, transformations)
     - Python/NumPy preview code
   - Created `src/views/linear-algebra/VectorsView.vue` comprehensive content page
     - Interactive VectorOperations widget with URL sync
     - Collapsible sections: Introduction, Addition, Dot Product, Magnitude, Angle, ML Applications
     - Python code examples throughout

5. **E2E Tests & Polish** (11E)
   - Created `e2e/linear-algebra/vector-operations.spec.ts` with 14 E2E tests
   - Added linear algebra pages to accessibility audits
   - Added keyboard accessibility tests for vector widget

**Key Architectural Decisions**:
- D-088: 2D vectors only (no 3D)
- D-089: Widget defaults to Addition operation
- D-090: Angles in degrees with radians in parentheses
- D-091: Fixed coordinate system range (-5 to +5)
- D-092: Composable pattern for vector state (useVectors)
- D-093: Modular widget component architecture
- D-094: Vector presets with educational context
- D-095: Parallelogram law visualization for addition

**Lessons Learned**:
- LL-043: Floating point precision at tolerance boundary
- LL-044: ESLint unused variables in composables

**Lessons Identified**:
- LI-044: SVG arrow markers for vector visualization
- LI-045: Parallelogram law visualization for vector addition
- LI-046: Operation result types with discriminated unions
- LI-047: Relationship badges for mathematical properties

---

## Algebra Expansion Summary (Post-Phase 10)

After Phase 10 completion, the Algebra section was expanded with two new content pages:

### Product Notation (Π)
- Created `src/utils/math/product.ts` with 22 comprehensive tests
- Functions: `evaluateProduct`, `factorial`, `permutations`, `combinations`, `doubleFactorial`
- Preset support: `getProductPresetExpression`, `getProductPresetLatex`, `getProductClosedFormDescription`
- Types: `ProductResult`, `ProductPresetId` added to `src/types/math.ts`
- Created `src/views/algebra/ProductNotationView.vue` with:
  - Interactive product explorer with preset formulas (factorial, even/odd numbers, powers, fractions)
  - Factorial, permutations, and combinations sections with code examples
  - Python implementations throughout
  - Related Topics linking to Summation and other algebra content

### Linear Equations
- Created `src/views/algebra/LinearEquationsView.vue` with:
  - Interactive single equation solver (ax + b = c)
  - Interactive 2×2 system of equations solver
  - Matrix form introduction
  - NumPy integration examples
  - Slope and intercept explanation
  - Real-world applications (economics, physics, chemistry)
  - Related Topics linking to Quadratics and other content

### Infrastructure Updates
- Updated `src/data/navigation.ts` with new subtopics (Product Notation, Linear Equations)
- Updated `src/router/index.ts` with new routes
- Removed "Coming Soon" section from AlgebraIndex.vue (all planned content now implemented)

**Key Decisions**:
- D-084: Preset-based product notation explorer (safer than arbitrary expressions)
- D-085: Interactive equation solvers with computed properties

**Lessons Learned**:
- LL-040: Vue template literals don't play well with Python f-strings (`${var}` conflicts)
- LL-041: HTML entities (`&lt;`, `&gt;`) required for comparison operators in Vue templates

**Lessons Identified**:
- LI-041: Computed properties for formula display (fullFormula pattern)
- LI-042: Related topics cross-linking improves content discoverability

---

## Phase 10 Completion Summary

Phase 10 accomplished:

1. **Statistics Math Utilities** (10A)
   - Created `src/utils/math/statistics.ts` with 105 tests
   - Descriptive stats: calculateSum, calculateMean, calculateMedian, calculateMode
   - Spread stats: calculateRange, calculateVariance, calculateStdDev
   - Quartiles: calculatePercentile, calculateQuartiles
   - Outliers: detectOutliers (Tukey's fences method)
   - Analysis: calculateSkewness, suggestBinCount (Sturges' rule)
   - Histograms: generateHistogramBins
   - Combined: calculateFullStatistics
   - Utilities: validateStatisticsInput, parseDataInput, formatStatValue
   - Types: DescriptiveStats, SpreadStats, Quartiles, OutlierAnalysis, SkewnessAnalysis, HistogramBin, HistogramData, FullStatistics, DatasetPreset, ParseResult, ValidationResult
   - 5 preset datasets: test-scores, heights, salaries, reaction-times, symmetric

2. **StatisticsCalculator Core Widget** (10B)
   - Created `src/composables/useStatistics.ts` for state management + URL sync
   - Built modular component architecture in `src/components/widgets/StatisticsCalculator/`:
     - `StatisticsCalculator.vue` - main orchestrator component
     - `DatasetSelector.vue` - preset buttons + custom toggle
     - `CustomDataInput.vue` - text area with validation
     - `StatisticsPanel.vue` - count, sum, mean, median, mode, min, max
     - `SpreadPanel.vue` - variance, std dev, range, skewness
     - `QuartilesPanel.vue` - Q1, Q2, Q3, IQR
     - `OutliersPanel.vue` - fences and outlier list

3. **Histogram Visualization** (10C)
   - Created `HistogramChart.vue` component
   - SVG histogram with adjustable bin count (3-20)
   - Frequency axis, bin labels, bar coloring
   - Responsive sizing, axis labeling

4. **Box Plot Visualization** (10D)
   - Created `BoxPlotChart.vue` component
   - SVG box plot with quartile box (Q1-Q3)
   - Whiskers extending to min/max (within fences)
   - Median line, outlier markers (red dots)
   - Min/max/quartile labels

5. **Statistics Content Pages** (10E)
   - Created `StatisticsIndexView.vue` section landing page
     - Three pillars of descriptive statistics
     - Why programmers need statistics
     - Coming soon sections (probability, inference)
   - Created `DescriptiveStatsView.vue` comprehensive content page
     - Interactive StatisticsCalculator widget with URL sync
     - Collapsible sections: Central Tendency, Spread, Quartiles, Outliers, Skewness, Histograms, Box Plots, Programmer Applications
     - Python code examples throughout
     - Quick reference table for outlier robustness

6. **E2E Tests & Polish** (10F)
   - Created `e2e/statistics/statistics-calculator.spec.ts` with 16 tests
   - Added statistics pages to accessibility audits
   - Added keyboard accessibility tests for statistics widget
   - Fixed color contrast issue (green-600 → green-700) for WCAG compliance

**Key Architectural Decisions**:
- D-077: Widget named "StatisticsCalculator"
- D-078: Preset datasets + custom data input
- D-079: Composable pattern (useStatistics) for state management
- D-080: Modular panel components for different stat categories
- D-081: Tukey's fences for outlier detection (1.5 × IQR)
- D-082: Sturges' rule for default bin count
- D-083: Green-700 for better color contrast (WCAG compliance)

**Lessons Learned**:
- LL-037: Linear interpolation method for quartile calculation differs from some implementations
- LL-038: green-600 fails WCAG contrast (3.29:1), green-700 passes (4.61:1)
- LL-039: SVG line elements may report as "hidden" in Playwright even when visible

**Lessons Identified**:
- LI-038: Composable pattern for statistics state with URL sync
- LI-039: Panel-based component architecture for organized statistics display
- LI-040: Use toHaveCount(1) instead of toBeVisible() for SVG line elements

---

## Previous Phase Summaries

### Phase 9 Completion Summary

Phase 9 accomplished:

1. **Testing Infrastructure Refinement** (9A)
   - Tiered CI workflow: quick-check (push), full-test (PR only)
   - Test scripts with grep patterns: `test:e2e`, `test:a11y`, `test:visual`
   - Test tags added to all E2E tests: `@e2e`, `@a11y`, `@visual`
   - Visual regression tests removed from CI (local only)
   - Created `docs/TESTING.md` comprehensive testing documentation
   - Updated `docs/VISUAL_TESTING.md` with local-only guidance

2. **Trigonometry Math Utilities** (9B)
   - Created `src/utils/math/trigonometry.ts` with 64 comprehensive tests
   - Types: AngleUnit, Quadrant, TrigValues, ExactTrigValues, QuadrantSigns, SpecialAngle, PointOnCircle, RadianDisplay
   - Functions: degreesToRadians, radiansToDegrees, normalizeAngle, getQuadrant
   - Functions: getQuadrantSigns, getReferenceAngle, calculateTrigValues, getPointOnCircle
   - Functions: isSpecialAngle, getExactTrigValues, getSpecialAngles, formatRadians
   - Special angles data: 0°, 30°, 45°, 60°, 90°, 120°, 135°, 150°, 180°, 210°, 225°, 240°, 270°, 300°, 315°, 330°

3. **UnitCircleExplorer Widget** (9C)
   - Created `src/composables/useUnitCircle.ts` for state management + URL sync
   - Built modular component architecture in `src/components/widgets/UnitCircleExplorer/`
   - SVG features: unit circle, angle arc, radius line, point on circle, sin/cos projections

4. **Wave Graphs Feature** (9D)
   - Created `WaveGraphs.vue` component showing sin θ and cos θ waves
   - Angle marker syncs with unit circle visualization

5. **Trigonometry Content Page** (9E)
   - Created `TrigonometryIndexView.vue` section landing page
   - Created `UnitCircleView.vue` comprehensive content page
   - Added routes and navigation for trigonometry section

6. **E2E Tests & Polish** (9F)
   - Created `e2e/trigonometry/unit-circle-explorer.spec.ts` with 18 tests
   - Added trigonometry pages to accessibility audits

### Phase 8 Completion Summary

Phase 8 accomplished exponential and logarithmic functions with complexity comparison.
See `docs/archive/` for detailed phase completion summaries.
