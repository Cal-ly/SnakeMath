# Phase 20: Correlation & Regression

**Theme**: *Do Variables Move Together?*

**Goal**: Build an interactive correlation and regression explorer that teaches programmers to identify relationships between variables, fit linear models, and understand the crucial distinction between correlation and causation — with direct applications to feature selection and baseline ML models.

---

## Strategic Context

Correlation and regression are the gateway to machine learning:

| Concept | ML Connection | Why It Matters |
|---------|---------------|----------------|
| Correlation | Feature selection | Which inputs relate to output? |
| Linear Regression | Baseline model | Simplest predictive model |
| R² | Model evaluation | How much variance explained? |
| Residuals | Error analysis | Where does the model fail? |
| Multiple Regression | Feature combination | Foundation for neural networks |

This phase completes the Statistics section and bridges directly to ML/AI content in future phases.

---

## Confirmed Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| **D-160** | Interactive scatter plot with draggable points | Builds intuition through manipulation |
| **D-161** | Real-time correlation coefficient display | Immediate feedback on relationship strength |
| **D-162** | Regression line with equation overlay | Shows the model explicitly |
| **D-163** | Residual visualization toggle | Understanding model errors |
| **D-164** | Outlier impact demonstration | One point can dramatically change results |
| **D-165** | Multiple regression preview (2 predictors max) | Connection to ML without complexity |
| **D-166** | "Correlation ≠ Causation" prominent warning | Combat the most common misconception |

---

## Scope

### In Scope
- **CorrelationExplorer widget**: Interactive scatter plot with correlation and regression
- **Draggable data points**: Manipulate data and see immediate effects
- **Residual visualization**: Toggle to show prediction errors
- **Outlier impact demo**: Add/remove outliers, see coefficient change
- **R² and standard error display**: Model quality metrics
- **Multiple regression preview**: 3D visualization with 2 predictors
- **Math utilities**: Correlation, covariance, least squares, R²
- **Content page**: Correlation & Regression with programmer framing

### Out of Scope (Future Enhancement)
- Polynomial regression
- Logistic regression
- Regularization (Ridge, Lasso)
- Correlation matrices for many variables
- Time series correlation (autocorrelation)

---

## Widget Design: CorrelationExplorer

### Architecture

```
src/components/widgets/CorrelationExplorer/
├── CorrelationExplorer.vue         # Main orchestrator
├── ScatterPlotCanvas.vue           # SVG scatter plot with draggable points
├── CorrelationDisplay.vue          # r value with interpretation
├── RegressionLineOverlay.vue       # Best-fit line with equation
├── ResidualVisualization.vue       # Vertical lines showing errors
├── DataPointControls.vue           # Add/remove/reset points
├── OutlierDemo.vue                 # Outlier impact demonstration
├── MultipleRegressionPreview.vue   # 3D surface visualization (2 predictors)
├── RegressionResults.vue           # R², SE, coefficients
├── CorrelationPresets.vue          # Quick-select datasets
└── index.ts
```

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Correlation & Regression Explorer                               │
├─────────────────────────────────────────────────────────────────┤
│  Data Controls                                                   │
│  [Add Point] [Remove Last] [Reset] [Generate Random]            │
│  Points: 25    [Show Residuals ☐] [Show Regression ☑]          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  y                                                           ││
│  │  ↑           ●                                               ││
│  │  │        ●    ●    ●                    y = 0.85x + 2.3    ││
│  │  │     ●    ●     ●                                          ││
│  │  │  ●    ●    ●  ●    ●                                      ││
│  │  │    ●  ●  ●  ●    ●                                        ││
│  │  │  ●    ●  ●    ●                                           ││
│  │  │────────────────────────────→ x                            ││
│  │                                                              ││
│  │  [Click to add point, drag to move]                         ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Statistics                                                      │
│  ┌────────────────────┬────────────────────┬───────────────────┐│
│  │ Correlation (r)    │ R² (explained)     │ Std Error         ││
│  │ 0.847 (strong +)   │ 0.717 (71.7%)      │ 4.23              ││
│  └────────────────────┴────────────────────┴───────────────────┘│
│                                                                  │
│  Regression: ŷ = 0.847x + 2.31                                  │
│  Interpretation: For each 1-unit increase in x, y increases by  │
│                  approximately 0.85 units                       │
├─────────────────────────────────────────────────────────────────┤
│  ⚠️ CORRELATION ≠ CAUSATION                                     │
│  Ice cream sales and drowning deaths are correlated (r=0.95)    │
│  because both increase in summer, not because one causes other! │
├─────────────────────────────────────────────────────────────────┤
│  Presets: [Height/Weight] [Study/Grade] [Ad Spend/Sales] [Random]│
└─────────────────────────────────────────────────────────────────┘
```

### Residual Visualization

```
When "Show Residuals" is enabled:
┌─────────────────────────────────────────────────────────────────┐
│  │                                                              │
│  │      ●←─┐                                                    │
│  │         │ residual (error)                                   │
│  │    ─────●─────────────────── regression line                │
│  │         │                                                    │
│  │      ●←─┘                                                    │
│  │                                                              │
│  │  Residual = actual y - predicted y                          │
│  │  Sum of squared residuals: 156.7 (minimized by OLS)         │
└─────────────────────────────────────────────────────────────────┘
```

### Outlier Impact Demo

```
┌─────────────────────────────────────────────────────────────────┐
│  Outlier Impact Demonstration                                    │
│                                                                  │
│  [Add Outlier] at position: x=[80] y=[10]                       │
│                                                                  │
│  Before outlier:  r = 0.95,  slope = 0.92                       │
│  After outlier:   r = 0.67,  slope = 0.58   ← dramatic change!  │
│                                                                  │
│  Leverage: high-x outliers affect slope more                    │
│  Influence: outliers far from line affect more                  │
│                                                                  │
│  [Remove Outlier] [Reset]                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Multiple Regression Preview (2 predictors)

```
┌─────────────────────────────────────────────────────────────────┐
│  Multiple Regression Preview                                     │
│                                                                  │
│  Equation: ŷ = 0.65x₁ + 0.32x₂ + 1.2                           │
│                                                                  │
│  3D Visualization:      (isometric view)                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │           ╱ y                                                ││
│  │          ╱                                                   ││
│  │    ●   ╱     ● data points                                  ││
│  │   ●  ╱  ●                                                    ││
│  │  ──╱────────────── x₁                                       ││
│  │   ╱  ╲                                                       ││
│  │  ╱    ╲ x₂                                                   ││
│  │                                                              ││
│  │  Regression plane shown as translucent surface               ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  R² = 0.83 (83% of variance explained by both predictors)       │
│  x₁ alone: R² = 0.65    x₂ alone: R² = 0.45                    │
│                                                                  │
│  Connection to ML: This is literally a linear layer!            │
│  ŷ = w₁x₁ + w₂x₂ + b  (weights and bias)                       │
└─────────────────────────────────────────────────────────────────┘
```

### Presets

| Name | Pattern | r (approx) | Scenario |
|------|---------|------------|----------|
| Height vs Weight | Strong positive | 0.85 | Physical relationship |
| Study Time vs Grade | Moderate positive | 0.65 | Effort → outcome |
| Ad Spend vs Sales | Positive | 0.75 | Business metric |
| Temperature vs Ice Cream | Strong positive | 0.90 | Correlation example |
| Random Noise | No correlation | ~0 | Null relationship |
| Perfect Linear | Perfect | 1.0 | Ideal case |
| Negative Correlation | Strong negative | -0.80 | Inverse relationship |
| Non-linear (Quadratic) | Low linear r | 0.3 | Shows limitation |
| Anscombe's Quartet #1 | Same r, different pattern | 0.82 | Famous statistical lesson |

---

## Math Utilities

### `src/utils/math/correlation.ts`

```typescript
// ============== Types ==============

export interface DataPoint {
  x: number;
  y: number;
}

export interface CorrelationResult {
  r: number;                    // Pearson correlation coefficient
  rSquared: number;             // Coefficient of determination
  interpretation: 'negligible' | 'weak' | 'moderate' | 'strong' | 'very-strong';
  direction: 'positive' | 'negative' | 'none';
  pValue?: number;              // Significance of correlation
}

export interface RegressionResult {
  slope: number;                // β₁
  intercept: number;            // β₀
  rSquared: number;
  standardError: number;        // SE of the estimate
  residuals: number[];
  sumSquaredResiduals: number;
  equation: string;             // "ŷ = 0.85x + 2.31"
}

export interface MultipleRegressionResult {
  coefficients: number[];       // [β₀, β₁, β₂, ...]
  rSquared: number;
  adjustedRSquared: number;
  standardError: number;
  equation: string;
}

// ============== Descriptive Statistics ==============

// These may already exist in descriptive stats, but ensure available
export function mean(values: number[]): number;
export function variance(values: number[], sample?: boolean): number;
export function standardDeviation(values: number[], sample?: boolean): number;

// ============== Correlation ==============

// Pearson correlation coefficient
export function pearsonCorrelation(data: DataPoint[]): number;

// Correlation with full analysis
export function analyzeCorrelation(data: DataPoint[]): CorrelationResult;

// Covariance
export function covariance(data: DataPoint[], sample?: boolean): number;

// Correlation interpretation
export function interpretCorrelation(r: number): {
  strength: 'negligible' | 'weak' | 'moderate' | 'strong' | 'very-strong';
  direction: 'positive' | 'negative' | 'none';
};

// Correlation significance (t-test)
export function correlationPValue(r: number, n: number): number;

// ============== Simple Linear Regression ==============

// Ordinary Least Squares regression
export function linearRegression(data: DataPoint[]): RegressionResult;

// Predict y for given x
export function predict(x: number, regression: RegressionResult): number;

// Calculate residual for a point
export function residual(point: DataPoint, regression: RegressionResult): number;

// Sum of squared residuals (SSR)
export function sumSquaredResiduals(data: DataPoint[], regression: RegressionResult): number;

// Total sum of squares (SST)
export function totalSumOfSquares(data: DataPoint[]): number;

// Standard error of the estimate
export function standardErrorEstimate(data: DataPoint[], regression: RegressionResult): number;

// ============== Multiple Regression (2 predictors) ==============

export interface DataPoint3D {
  x1: number;
  x2: number;
  y: number;
}

// Multiple regression with 2 predictors
export function multipleRegression(data: DataPoint3D[]): MultipleRegressionResult;

// Predict y for given x1, x2
export function predictMultiple(
  x1: number,
  x2: number,
  regression: MultipleRegressionResult
): number;

// ============== Outlier Analysis ==============

// Cook's distance (influence measure)
export function cooksDistance(
  data: DataPoint[],
  regression: RegressionResult,
  pointIndex: number
): number;

// Leverage (hat values)
export function leverage(data: DataPoint[], pointIndex: number): number;

// Identify influential points
export function findInfluentialPoints(
  data: DataPoint[],
  regression: RegressionResult,
  threshold?: number  // default 4/n for Cook's D
): number[];

// ============== Utilities ==============

// Generate data with specified correlation
export function generateCorrelatedData(
  n: number,
  targetR: number,
  meanX?: number,
  meanY?: number,
  sdX?: number,
  sdY?: number
): DataPoint[];

// Format equation string
export function formatEquation(regression: RegressionResult): string;

// Anscombe's quartet datasets
export function getAnscombeQuartet(): {
  set1: DataPoint[];
  set2: DataPoint[];
  set3: DataPoint[];
  set4: DataPoint[];
};
```

**Test Coverage Target**: 80+ tests

Key test scenarios:
- Known correlation values verified
- Regression coefficients match known data
- R² relationship to r verified (r² = R² for simple regression)
- Residuals sum to zero
- Perfect correlation gives R² = 1
- Anscombe's quartet all have same r but different patterns

---

## Content Structure

### Correlation & Regression Page
`/statistics/correlation` - `CorrelationView.vue`

**Sections**:

1. **Introduction** (expanded)
   - "Do these variables move together?"
   - Scatter plot intuition
   - Three analogies block

2. **Visualizing Relationships** (expanded)
   - Scatter plots
   - Positive, negative, no correlation
   - Linear vs non-linear

3. **Widget: CorrelationExplorer** (expanded)
   - Full interactive widget

4. **Correlation Coefficient** (expanded)
   - Pearson's r formula
   - Interpretation: -1 to +1 scale
   - Strength categories
   - Code: `np.corrcoef()`

5. **⚠️ CORRELATION ≠ CAUSATION** (expanded, highlighted)
   - Confounding variables
   - Spurious correlations
   - Famous examples (ice cream/drowning)
   - How to establish causation (experiments)

6. **Simple Linear Regression** (expanded)
   - Line of best fit
   - Least squares method
   - Slope and intercept interpretation
   - Code: `sklearn.linear_model.LinearRegression`

7. **R² and Model Quality** (expanded)
   - Coefficient of determination
   - "Percentage of variance explained"
   - When R² is high vs low
   - Adjusted R² preview

8. **Residual Analysis** (collapsed)
   - What residuals tell us
   - Patterns in residuals = problem
   - Heteroscedasticity (brief)

9. **Outliers and Influence** (collapsed)
   - How outliers affect correlation
   - Leverage and influence
   - Robust alternatives (mention)

10. **Multiple Regression Preview** (collapsed)
    - Adding more predictors
    - The ML connection
    - "This is literally a linear layer"

11. **Common Pitfalls** (collapsed)
    - Extrapolation beyond data range
    - Ignoring non-linear patterns
    - Overfitting with multiple predictors
    - Correlation without scatter plot

12. **In Python** (collapsed)
    - `numpy.corrcoef()`, `scipy.stats.pearsonr()`
    - `sklearn.linear_model.LinearRegression`
    - Visualization with matplotlib

13. **Related Topics**
    - Probability Distributions
    - Hypothesis Testing (correlation significance)
    - Matrices (for multiple regression)

---

## Increments

### Increment 20A: Correlation Math Utilities (~60 min)

**Tasks**:
1. Create `src/utils/math/correlation.ts`
2. Implement mean, variance, standardDeviation (or import)
3. Implement covariance
4. Implement pearsonCorrelation
5. Implement analyzeCorrelation with interpretation
6. Implement correlationPValue
7. Create `src/utils/math/correlation.test.ts` (40+ tests)

**Files**:
- `src/utils/math/correlation.ts` (new)
- `src/utils/math/correlation.test.ts` (new)

**Success Criteria**:
- All 40+ tests pass
- Known correlation values verified
- Interpretation categories correct
- P-value calculation accurate

---

### Increment 20B: Regression Math Utilities (~60 min)

**Tasks**:
1. Implement linearRegression (OLS)
2. Implement predict function
3. Implement residual calculation
4. Implement sumSquaredResiduals, totalSumOfSquares
5. Implement standardErrorEstimate
6. Implement formatEquation
7. Add Anscombe's quartet data
8. Create tests (40+ tests)

**Files**:
- `src/utils/math/correlation.ts` (extend)
- Tests

**Success Criteria**:
- Regression coefficients match known values
- R² = r² for simple regression
- Residuals sum to zero
- Anscombe's quartet verified

---

### Increment 20C: Multiple Regression & Outlier Utilities (~45 min)

**Tasks**:
1. Implement multipleRegression (2 predictors)
2. Implement predictMultiple
3. Implement cooksDistance
4. Implement leverage
5. Implement findInfluentialPoints
6. Implement generateCorrelatedData
7. Create tests (20+ tests)

**Files**:
- `src/utils/math/correlation.ts` (extend)
- Tests

**Success Criteria**:
- Multiple regression coefficients accurate
- Cook's distance identifies outliers
- Generated data matches target correlation

---

### Increment 20D: Correlation Composable & State (~45 min)

**Tasks**:
1. Create `src/composables/useCorrelationExplorer.ts`
2. Implement data points state with add/remove/drag
3. Implement regression calculation on data change
4. Implement URL state sync for presets
5. Implement view toggles (residuals, regression line)
6. Create tests for composable

**Files**:
- `src/composables/useCorrelationExplorer.ts` (new)
- `src/composables/useCorrelationExplorer.test.ts` (new)

**Success Criteria**:
- State management correct
- Dragging points updates correlation in real-time
- Presets load correctly
- URL state syncs

---

### Increment 20E: CorrelationExplorer Widget - Core (~90 min)

**Tasks**:
1. Create widget component structure (10 files)
2. Implement ScatterPlotCanvas (SVG with draggable points)
3. Implement CorrelationDisplay (r with interpretation)
4. Implement RegressionLineOverlay (best-fit line)
5. Implement DataPointControls (add/remove/reset)
6. Implement RegressionResults (R², SE, equation)
7. Implement CorrelationPresets
8. Wire up main orchestrator

**Files**:
- `src/components/widgets/CorrelationExplorer/*.vue` (10 files)

**Success Criteria**:
- Scatter plot renders correctly
- Points are draggable with real-time updates
- Regression line updates immediately
- Statistics display correctly
- Mobile responsive (touch drag)

---

### Increment 20F: Residuals, Outliers, Multiple Regression (~60 min)

**Tasks**:
1. Implement ResidualVisualization
   - Toggle to show/hide
   - Vertical lines from points to regression line
   - Color coding (positive/negative)
2. Implement OutlierDemo
   - Add outlier button with position control
   - Before/after comparison
   - Influence explanation
3. Implement MultipleRegressionPreview
   - 3D isometric visualization
   - Two predictor sliders
   - Regression plane

**Files**:
- `src/components/widgets/CorrelationExplorer/ResidualVisualization.vue`
- `src/components/widgets/CorrelationExplorer/OutlierDemo.vue`
- `src/components/widgets/CorrelationExplorer/MultipleRegressionPreview.vue`

**Success Criteria**:
- Residuals display correctly
- Outlier impact visible
- 3D preview renders
- ML connection clear

---

### Increment 20G: Content Page (~60 min)

**Tasks**:
1. Create `src/views/statistics/CorrelationView.vue`
2. Write content sections with three analogies
3. Write prominent "Correlation ≠ Causation" section
4. Add code examples
5. Add common pitfalls callout
6. Update `src/router/index.ts` with route
7. Update `src/data/navigation.ts` with subtopic
8. Update StatisticsIndexView.vue (remove from "Coming Soon")

**Files**:
- `src/views/statistics/CorrelationView.vue` (new)
- `src/router/index.ts`
- `src/data/navigation.ts`
- `src/views/statistics/StatisticsIndexView.vue`

**Success Criteria**:
- Navigation works
- Content renders properly
- Widget integrated
- Causation warning prominent
- Related topics linked

---

### Increment 20H: E2E Tests & Polish (~45 min)

**Tasks**:
1. Create `e2e/statistics/correlation-explorer.spec.ts`
2. Test point dragging
3. Test add/remove points
4. Test presets
5. Test residual toggle
6. Test outlier demo
7. Test URL state persistence
8. Add accessibility tests
9. Polish: keyboard navigation, focus management

**Files**:
- `e2e/statistics/correlation-explorer.spec.ts` (new)

**Success Criteria**:
- 20+ E2E tests pass
- Accessibility audit passes
- Keyboard navigation works
- Touch interactions work on mobile

---

## Estimated Timeline

| Increment | Time |
|-----------|------|
| 20A: Correlation Math Utilities | 60 min |
| 20B: Regression Math Utilities | 60 min |
| 20C: Multiple Regression & Outlier Utilities | 45 min |
| 20D: Correlation Composable & State | 45 min |
| 20E: CorrelationExplorer Widget - Core | 90 min |
| 20F: Residuals, Outliers, Multiple Regression | 60 min |
| 20G: Content Page | 60 min |
| 20H: E2E Tests & Polish | 45 min |
| **Total** | **~7.75 hours** |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Draggable points performance | Medium | Medium | Debounce calculations, optimize render |
| 3D regression plane complexity | Medium | Low | Keep simple isometric, optional feature |
| Matrix inversion for multiple regression | Low | Medium | Use well-tested algorithm |
| Touch drag on mobile | Medium | Medium | Test thoroughly, larger touch targets |
| Causation misconception persistence | Medium | High | Prominent warning, multiple examples |

---

## Connections to Prior Phases

| Connection | Phase | How It Connects |
|------------|-------|-----------------|
| Descriptive Statistics | 10 | Mean, std dev, scatter from histogram |
| Probability Distributions | 17 | Correlation significance uses t-distribution |
| Linear Algebra | 11, 12, 16 | Multiple regression is matrix operation |
| Isometric projection | 16 | Reuse for 3D regression plane |
| SVG interaction | 11, 12 | Draggable points pattern |

---

## Archive Reference

**Content**: `archive/snake-math/docs/statistics/probability/applications.md`
- Correlation examples in finance
- Regression in prediction

**Component**: No direct archive component

**Utilities**: Standard statistical formulas

---

## Post-Phase Updates

After Phase 20 completion, update:
- [ ] `docs/LL_LI.md` - Lessons learned about scatter plot interaction
- [ ] `docs/DECISIONS.md` - D-160 through D-166
- [ ] `docs/CURRENT_STATE.md` - Phase 20 summary (Statistics section complete!)
- [ ] `docs/ROADMAP.md` - Mark Phase 20 complete
- [ ] `docs/TODO.md` - Statistics expansion complete

---

## Success Metrics

- [ ] All unit tests pass (100+)
- [ ] All E2E tests pass (20+)
- [ ] Accessibility audit passes
- [ ] Widget URL sync works
- [ ] Mobile responsive (touch drag works)
- [ ] Point dragging updates correlation in real-time
- [ ] Regression line accurate
- [ ] Residual visualization clear
- [ ] Outlier impact demonstration effective
- [ ] Multiple regression preview shows ML connection
- [ ] "Correlation ≠ Causation" prominently displayed
- [ ] Statistics section now complete with 5 topics

---

## Statistics Section Completion Summary

After Phase 20, the Statistics section will include:

| Topic | Phase | Widget | Status |
|-------|-------|--------|--------|
| Descriptive Statistics | 10 | StatisticsCalculator | ✅ Complete |
| Probability Distributions | 17 | DistributionExplorer | 🎯 Planned |
| Sampling & Estimation | 18 | SamplingSimulator | 🎯 Planned |
| Hypothesis Testing | 19 | HypothesisTestingSimulator | 🎯 Planned |
| Correlation & Regression | 20 | CorrelationExplorer | 🎯 Planned |

**Total new tests**: ~360 unit tests + ~80 E2E tests across Phases 17-20
**Total new widgets**: 4 major interactive widgets
**ML Bridge**: Clear connections established for future AI/ML content

---

## Design System Compliance

This phase **must** adhere to patterns documented in `docs/DESIGN_SYSTEM.md`.

### Three-Analogy Block (Required)

Every content page requires a three-analogy block with amber/emerald/blue colors:

```vue
<div class="grid md:grid-cols-3 gap-4 my-6">
  <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
    <h4 class="font-semibold text-amber-800 dark:text-amber-200">📊 Stock Prices</h4>
    <p class="text-sm text-amber-700 dark:text-amber-300">
      Two stocks moving together (r=0.9) doesn't mean one causes the other—they might both follow the same market trends.
    </p>
  </div>
  <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
    <h4 class="font-semibold text-emerald-800 dark:text-emerald-200">🧪 Feature Engineering</h4>
    <p class="text-sm text-emerald-700 dark:text-emerald-300">
      Correlation helps find which features relate to your target. High correlation = potential predictor; zero correlation = probably not useful.
    </p>
  </div>
  <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
    <h4 class="font-semibold text-blue-800 dark:text-blue-200">🤖 Linear Layer</h4>
    <p class="text-sm text-blue-700 dark:text-blue-300">
      Multiple regression is literally a neural network linear layer: ŷ = w₁x₁ + w₂x₂ + b. Same math, different name!
    </p>
  </div>
</div>
```

### Common Pitfall Callout (Required)

```vue
<div class="my-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
  <h4 class="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
    <span>⚠️</span> CORRELATION ≠ CAUSATION
  </h4>
  <p class="text-amber-700 dark:text-amber-300 mt-2">
    Ice cream sales and drowning deaths correlate at r=0.95. Both increase in summer!
    Never conclude causation from correlation alone—always look for confounding variables.
  </p>
</div>
```

### CodeExample Component Requirements

All code examples must include `id` and `title` props:

```vue
<CodeExample
  id="correlation-numpy-example"
  title="Correlation with NumPy"
  language="python"
  :code="pythonExample"
/>
```

### RelatedTopics Component

Must link to at least 2 related topics:

```vue
<RelatedTopics :topics="[
  { path: '/statistics/hypothesis-testing', title: 'Hypothesis Testing', description: 'Test if correlation is significant' },
  { path: '/linear-algebra/matrices', title: 'Matrices', description: 'Multiple regression uses matrix math' },
  { path: '/statistics/distributions', title: 'Probability Distributions', description: 't-distribution for correlation significance' }
]" />
```

### Navigation Description Format

For `navigation.ts`, descriptions must be:
- 6-10 words
- Focus on programmer benefit
- Format: "Action + topic + benefit"

Example: `"Explore relationships between variables for ML feature selection"`

### Color Usage Rules

- Use semantic Tailwind classes (amber/emerald/blue for analogies)
- Never use `green-600` for text (use `green-700` for WCAG AA compliance)
- Widget controls: use neutral grays with accent colors for active states
- Positive correlation: emerald/green shades
- Negative correlation: rose/red shades
- No correlation: neutral gray

---

## Applicable Lessons Learned

The following lessons from `docs/LL_LI.md` apply to Phase 20:

### Critical for This Phase

| ID | Lesson | Application in Phase 20 |
|----|--------|-------------------------|
| **LL-015** | KaTeX rendering in reactive context | Regression equation overlay needs careful KaTeX lifecycle management |
| **LL-019** | Touch interactions need larger targets | Draggable points need 44×44px minimum touch/click targets |
| **LL-021** | Formula simplification over precision | Show ŷ = mx + b first, defer matrix notation to expandable |
| **LL-024** | E2E tests need data-testid | Add `data-testid` to scatter plot and controls for reliable testing |
| **LL-026** | SVG coordinate system | Remember SVG y-axis is inverted; use transform for mathematical coordinates |

### Patterns to Follow

| ID | Pattern | Application in Phase 20 |
|----|---------|-------------------------|
| **LI-012** | URL state sync pattern | Sync preset selection and view toggles to URL |
| **LI-015** | Debounced input pattern | Use 300ms debounce on point drag before recalculating correlation |
| **LI-019** | Progressive disclosure | Show r and regression line first, expand for residuals, outlier analysis |
| **LI-025** | SVG visualization pattern | Use SVG for scatter plot with draggable point handles |
| **LI-031** | Preset-based widget architecture | Implement dataset presets (height/weight, study/grade, etc.) |

### Interaction Lessons

| ID | Lesson | Application in Phase 20 |
|----|--------|-------------------------|
| **LL-028** | Drag interaction states | Visual feedback during point drag (larger point, shadow) |
| **LL-029** | SVG event handling | Use pointer events for cross-platform drag support |
| **LL-033** | Coordinate transforms | Handle SVG-to-data coordinate conversion for point positioning |

### Testing Lessons

| ID | Lesson | Application in Phase 20 |
|----|--------|-------------------------|
| **LL-031** | Mathematical edge cases | Test n=2 (minimum), n=1 (error), perfect correlation (r=±1) |
| **LL-032** | Statistical precision | Verify Anscombe's quartet all have same r≈0.816 |
| **LL-037** | Accessibility in visualizations | Ensure scatter plot colors meet contrast requirements |
| **LL-039** | Animation performance | Point drag updates should use requestAnimationFrame |

---

## Implementation Checklist

Before marking any increment complete, verify:

### Content Page
- [ ] Three-analogy block present with correct colors
- [ ] Common pitfall callout present (correlation ≠ causation)
- [ ] All CodeExample components have `id` and `title` props
- [ ] RelatedTopics links to at least 2 topics
- [ ] Navigation description is 6-10 words, action-focused

### Widget
- [ ] All interactive elements have `data-testid` attributes
- [ ] Draggable points have 44×44px touch targets
- [ ] URL state syncs preset selection with 300ms debounce
- [ ] Presets load correct datasets
- [ ] SVG coordinate system properly inverted for math display

### Testing
- [ ] Unit tests cover edge cases (n=2, r=±1, r=0)
- [ ] Anscombe's quartet verified (same r, different patterns)
- [ ] E2E tests use `data-testid` selectors
- [ ] Accessibility audit passes (axe-core)
- [ ] Drag interactions tested on mobile viewports
