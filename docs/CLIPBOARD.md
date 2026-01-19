# Phase 20 Handover: Correlation & Regression

## Context

Phase 19 (Hypothesis Testing) is complete. SnakeMath now has:
- 1674 unit tests
- Statistics section with 4 subtopics: Descriptive Statistics, Probability Distributions, Sampling & Estimation, Hypothesis Testing
- Established patterns: composable-based widgets, URL state sync, tabbed interfaces, data-testid attributes

## Phase 20 Goal

Build an interactive **CorrelationExplorer** widget teaching programmers to identify relationships between variables and fit linear models — the final statistics topic that bridges directly to ML.

**Core Philosophy**: "Correlation measures 'do these variables move together?' — regression answers 'by how much and can I predict one from the other?'"

## Widget Requirements

### CorrelationExplorer Features

1. **Interactive Scatter Plot**
   - SVG canvas with draggable points
   - Add/remove points
   - Real-time correlation coefficient (r) display
   - Regression line overlay with equation (ŷ = mx + b)

2. **Residual Visualization**
   - Toggle to show residual lines from points to regression line
   - Residual plot (residuals vs x)
   - Helps visualize fit quality

3. **Statistics Display**
   - Correlation coefficient (r) with interpretation
   - R² (coefficient of determination)
   - Standard error of estimate
   - Slope (m) and intercept (b) with confidence intervals

4. **Educational Features**
   - Outlier impact demonstration (drag point to see r change)
   - "Correlation ≠ Causation" prominent warning
   - Anscombe's quartet preset (4 datasets, same r, different patterns)
   - Dataset presets (positive, negative, no correlation, non-linear)

5. **Multiple Regression Preview** (optional)
   - 2 predictors, 3D scatter
   - Show regression plane
   - Educational: "Multiple regression is literally a linear layer: ŷ = w₁x₁ + w₂x₂ + b"

## Math Utilities Needed

```typescript
// src/utils/math/correlation.ts
pearsonCorrelation(x: number[], y: number[]): number
linearRegression(x: number[], y: number[]): { slope: number; intercept: number; r: number; rSquared: number }
calculateResiduals(x: number[], y: number[], slope: number, intercept: number): number[]
standardErrorOfEstimate(residuals: number[], n: number): number
cooksDistance(x: number[], y: number[], i: number): number // outlier influence
predictY(x: number, slope: number, intercept: number): number

// Presets
anscombesQuartet: { x: number[]; y: number[] }[] // 4 famous datasets
correlationPresets: CorrelationPreset[]
```

## Composable Pattern

Follow established pattern (useDistributions, useSamplingSimulator, useHypothesisTesting):

```typescript
// src/composables/useCorrelation.ts
export function useCorrelation(options?: { syncUrl?: boolean }) {
  // Reactive state
  const points = ref<{ x: number; y: number }[]>([])
  const showRegressionLine = ref(true)
  const showResiduals = ref(false)
  const selectedPreset = ref<string | null>(null)

  // Computed statistics
  const correlation = computed(() => pearsonCorrelation(...))
  const regression = computed(() => linearRegression(...))
  const rSquared = computed(() => regression.value.rSquared)
  const residuals = computed(() => calculateResiduals(...))

  // Methods
  function addPoint(x: number, y: number) { ... }
  function removePoint(index: number) { ... }
  function movePoint(index: number, x: number, y: number) { ... }
  function loadPreset(presetId: string) { ... }
  function clearPoints() { ... }

  // URL sync with 300ms debounce
  return { points, correlation, regression, ... }
}
```

## Component Architecture

```
src/components/widgets/CorrelationExplorer/
├── CorrelationExplorer.vue      # Main orchestrator
├── ScatterPlot.vue              # SVG canvas with draggable points
├── RegressionLine.vue           # Line overlay with equation
├── ResidualLines.vue            # Residual visualization
├── CorrelationStats.vue         # r, R², SE, coefficients display
├── CorrelationPresets.vue       # Preset selector
├── ResidualPlot.vue             # Residual analysis chart
├── CausationWarning.vue         # Prominent warning component
└── index.ts
```

## Content Page Structure

```
src/views/statistics/CorrelationView.vue
├── Three-analogy block (everyday, programming, visual)
├── Sections:
│   ├── Introduction (scatter plots, relationships)
│   ├── Pearson Correlation (formula, interpretation, -1 to +1)
│   ├── Linear Regression (OLS, least squares, formula)
│   ├── R² (coefficient of determination, variance explained)
│   ├── Residuals (error analysis, assumptions)
│   ├── Outliers (influence, Cook's distance)
│   ├── Correlation ≠ Causation (critical warning)
│   ├── Multiple Regression Preview (ML connection)
│   └── Python/NumPy/Scikit-learn examples
├── Interactive CorrelationExplorer widget
├── Common pitfall callout (confusing correlation with causation)
└── Related topics
```

## Programmer Relevance

- **Feature selection**: "Which inputs relate to output?"
- **Linear regression = simplest baseline ML model**
- **Multiple regression = single linear layer**: "ŷ = w₁x₁ + w₂x₂ + b is literally `np.dot(X, weights) + bias`"
- **Residuals = model errors to analyze**
- **R² = how much variance your model explains**
- **Overfitting preview**: "Adding more predictors always increases R² on training data"

## Testing Requirements

1. **Unit Tests** (~100 tests)
   - Pearson correlation calculation
   - Linear regression coefficients
   - R² calculation
   - Residual calculations
   - Cook's distance
   - Edge cases (vertical line, all same y, etc.)

2. **E2E Tests** (~30 tests)
   - Widget rendering
   - Point dragging
   - Add/remove points
   - Preset loading
   - Statistics updates
   - Residual toggle
   - URL sync
   - Accessibility

## Reference Files

- `src/utils/math/hypothesis.ts` - Math utility pattern
- `src/composables/useHypothesisTesting.ts` - Composable pattern
- `src/components/widgets/HypothesisTestingSimulator/` - Widget structure
- `e2e/statistics/hypothesis-testing.spec.ts` - E2E test pattern
- `docs/ROADMAP.md` - Phase 20 description

## Success Criteria

1. CorrelationExplorer widget with draggable scatter plot
2. Real-time correlation and regression statistics
3. Residual visualization
4. Anscombe's quartet demonstration
5. "Correlation ≠ Causation" emphasized
6. Content page with ML bridge
7. ~100 unit tests
8. ~30 E2E tests
9. Accessibility compliance

## Estimated Increments

1. **20A**: Correlation math utilities (Pearson, regression, residuals, presets)
2. **20B**: useCorrelation composable with URL sync
3. **20C**: ScatterPlot with draggable points
4. **20D**: Regression line and statistics display
5. **20E**: Residual visualization
6. **20F**: Content page
7. **20G**: E2E tests and polish

This completes the Statistics section and bridges toward AI/ML foundations.
