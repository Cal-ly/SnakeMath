# SnakeMath Current State

## Intent
This document outlines the current state of the project for easy resumption after a pause.

---

## Current Status: Phase 11 Complete - Linear Algebra Vectors

**Last Updated**: 2026-01-17

### Project Summary

SnakeMath is an educational mathematics website for programmers. Eleven phases of development have established:

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
- `/trigonometry` - Unit Circle (UnitCircleExplorer widget with WaveGraphs)
- `/linear-algebra` - **New section**:
  - **Vectors (VectorOperations widget with SVG canvas)**
- `/statistics` - Descriptive Statistics (StatisticsCalculator widget with histogram & box plot)

**Interactive Widgets**:
- **NumberTypeExplorer**: Classify numbers, Venn diagram, number line, set membership
- **SummationExplorer**: Presets, bar chart animation, code parallel, formula comparison
- **SimpleFunctionDemo**: Function presets, slider input, substitution display
- **QuadraticExplorer**: Coefficient sliders, parabola graph, equation forms, real-world presets
- **ExponentialExplorer**: Function explorer tab (exp/log plotting, growth/decay analysis), complexity comparison tab (O(1) to O(2^n))
- **UnitCircleExplorer**: Angle controls (slider, input), special angle buttons, SVG unit circle with point/arc/projections, trig values display, quadrant/reference angle info, optional wave graphs (sin θ, cos θ)
- **StatisticsCalculator**: Dataset presets, custom data input, central tendency (mean/median/mode), spread (variance/std dev/range), quartiles (Q1/Q2/Q3/IQR), outlier detection (Tukey's fences), skewness analysis, histogram with adjustable bins, box plot visualization
- **VectorOperations**: Vector inputs with coordinate sliders, 7 operations (add, subtract, dot product, magnitude, angle, scalar multiply, normalize), SVG canvas with grid/arrows/parallelogram law, 5 educational presets, parallel/perpendicular badges, URL state sync

**Visualization Components**:
- **CoordinateSystem**: Reusable SVG coordinate system with axes, grid, labels
- **PlotCurve**: Plot mathematical functions as SVG paths
- **PlotPoint**: Render labeled points on coordinate system
- **PlotLine**: Vertical/horizontal lines (axis of symmetry, asymptotes)
- **HistogramChart**: SVG histogram with adjustable bin count
- **BoxPlotChart**: SVG box plot with quartiles, whiskers, and outlier markers

**Testing Infrastructure**:
- 475+ unit tests (Vitest) - including 78 vector utility tests
- E2E tests (Playwright) with tiered CI approach
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
| Decisions | `docs/decisions.md` |
| Lessons learned | `docs/ll_li.md` |
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

### Archived Documentation
Phase completion summaries are in `docs/archive/`:
- `PHASE_3_COMPLETE.md` - Content components
- `PHASE_4_COMPLETE.md` - Interactive widgets
- `PHASE_5_COMPLETE.md` - Algebra & summation

---

## Test Coverage

### Unit Tests (475+ tests)
- Math utilities (number classification, parsing, quadratic, exponential, trigonometry, statistics, product, vector functions)
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
- Accessibility (WCAG 2.1 AA audits for all pages including linear algebra)

### Visual Regression Tests (Local Only)
- All pages baseline screenshots
- Widget state snapshots (default, inputs, presets)
- Desktop (1280x720) and mobile (375x667) viewports
- **Not run in CI** - local validation only

---

## How to Resume Development

1. **Check todo list**: `docs/todo.md` for known issues and ideas
2. **Read decisions**: `docs/decisions.md` for architectural context
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
