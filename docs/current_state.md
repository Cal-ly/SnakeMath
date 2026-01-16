# SnakeMath Current State

## Intent
This document outlines the current state of the project for easy resumption after a pause.

---

## Current Status: Phase 9 Complete, Phase 10 Next

**Last Updated**: 2026-01-16

### Project Summary

SnakeMath is an educational mathematics website for programmers. Nine phases of development have established:

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
| **10** | **Statistics Foundation** | **StatisticsCalculator** | **Next** |

### What's Live

**Content Sections**:
- `/basics` - Complete section with 6 subtopics:
  - Foundations (The Basics)
  - Math Symbols
  - Number Types (with NumberTypeExplorer widget)
  - Functions (with SimpleFunctionDemo widget)
  - Variables & Expressions
  - Order of Operations (PEMDAS)
- `/algebra` - Three subtopics:
  - Summation notation (SummationExplorer widget)
  - Quadratic Functions (QuadraticExplorer widget)
  - Exponentials & Logarithms (ExponentialExplorer widget)
- `/trigonometry` - New section:
  - **Unit Circle (UnitCircleExplorer widget with WaveGraphs)**

**Interactive Widgets**:
- **NumberTypeExplorer**: Classify numbers, Venn diagram, number line, set membership
- **SummationExplorer**: Presets, bar chart animation, code parallel, formula comparison
- **SimpleFunctionDemo**: Function presets, slider input, substitution display
- **QuadraticExplorer**: Coefficient sliders, parabola graph, equation forms, real-world presets
- **ExponentialExplorer**: Function explorer tab (exp/log plotting, growth/decay analysis), complexity comparison tab (O(1) to O(2^n))
- **UnitCircleExplorer**: Angle controls (slider, input), special angle buttons, SVG unit circle with point/arc/projections, trig values display, quadrant/reference angle info, optional wave graphs (sin θ, cos θ)

**Visualization Components**:
- **CoordinateSystem**: Reusable SVG coordinate system with axes, grid, labels
- **PlotCurve**: Plot mathematical functions as SVG paths
- **PlotPoint**: Render labeled points on coordinate system
- **PlotLine**: Vertical/horizontal lines (axis of symmetry, asymptotes)

**Testing Infrastructure**:
- 270+ unit tests (Vitest) - including 64 new trigonometry tests
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
| Quadratic utilities | `src/utils/math/quadratic.ts` |
| Exponential utilities | `src/utils/math/exponential.ts` |
| Trigonometry utilities | `src/utils/math/trigonometry.ts` |
| Coordinate system | `src/components/visualizations/` |
| Unit circle composable | `src/composables/useUnitCircle.ts` |

### Archived Documentation
Phase completion summaries are in `docs/archive/`:
- `PHASE_3_COMPLETE.md` - Content components
- `PHASE_4_COMPLETE.md` - Interactive widgets
- `PHASE_5_COMPLETE.md` - Algebra & summation

---

## Test Coverage

### Unit Tests (270+ tests)
- Math utilities (number classification, parsing, quadratic, exponential, trigonometry functions)
- Data validation (symbols, navigation)
- Component logic (via composables)

### E2E Tests
- Navigation (header links, breadcrumbs, mobile menu)
- NumberTypeExplorer (input, examples, visualizations, URL sync)
- SummationExplorer (presets, bounds, animation, URL sync)
- QuadraticExplorer (presets, coefficients, equation forms, roots)
- **UnitCircleExplorer** (angle controls, special angles, trig values, wave graphs)
- Accessibility (WCAG 2.1 AA audits for all pages including trigonometry)

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

## Phase 8 Completion Summary

Phase 8 accomplished:

1. **Exponential Math Utilities** (8A)
   - Created `src/utils/math/exponential.ts` with 69 tests
   - Functions: evaluateExponential, evaluateLogarithm, analyzeGrowthDecay
   - Functions: calculateDoublingTime, calculateHalfLife
   - Functions: calculateCompoundInterest, calculateContinuousInterest
   - Functions: compareComplexities, generateExponentialPoints, generateLogarithmPoints
   - Types: ComplexityClass, ComplexityComparison, GrowthDecayResult, etc.
   - Exported complexity functions, labels, colors, examples for visualization

2. **ExponentialExplorer Widget** (8B)
   - Built main `ExponentialExplorer.vue` component with tabbed interface
   - `FunctionExplorerTab.vue` - exp/log function plotting
   - `ComplexityComparisonTab.vue` - O(1) to O(2^n) comparison
   - `BaseSelector.vue` - preset buttons (e, 2, 10) + custom input
   - `FunctionTypeSelector.vue` - exponential vs logarithm toggle
   - `GrowthDecayPanel.vue` - doubling time, half-life, percent change
   - `useExponentialExplorer.ts` composable for state management
   - URL state sync for shareable links (?tab=function&type=exp&base=2)

3. **Complexity Comparison Feature** (8C)
   - Logarithmic slider for n (1-1000 range)
   - Multi-curve graph showing all 6 complexity classes
   - Comparison table with operations count and relative speed
   - Dynamic insight text explaining the implications
   - Algorithm examples for each complexity class

4. **Exponentials Content Page** (8D)
   - Created `ExponentialsView.vue` with comprehensive content
   - Sections: Introduction, Explorer, Special Bases, Growth/Decay
   - Sections: Logarithms, Log Properties, Compound Interest
   - Sections: Algorithm Complexity, Real-World Examples, Reference
   - Python code examples throughout
   - Added to router and navigation

5. **Applications Content** (8E)
   - Compound interest calculator with frequency comparison
   - Linear vs binary search comparison with operation counts
   - Binary bits needed for number representation
   - pH scale logarithmic calculations
   - Decibel (sound) logarithmic calculations

6. **Mobile Optimization & Polish** (8F)
   - Minimum 44px touch targets for buttons and sliders
   - Responsive grid layouts (stack on mobile, side-by-side on desktop)
   - Data-testid attributes for E2E testing
   - Slider thumb enlargement on desktop

**Key Architectural Decisions**:
- D-064: Widget named "ExponentialExplorer"
- D-065: Presets + custom base input
- D-066: Tabbed interface (Function Explorer | Complexity Comparison)
- D-067: Core complexity set (6 classes)
- D-068: Single content page for exponentials + logarithms
- D-069: Mobile optimization via responsive layouts

---

## Phase 9 Completion Summary

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
   - Built modular component architecture in `src/components/widgets/UnitCircleExplorer/`:
     - `AngleControls.vue` - slider, direct input, unit toggle (degrees/radians)
     - `SpecialAngleButtons.vue` - first quadrant angles + expandable more angles
     - `TrigValuesDisplay.vue` - sin/cos/tan values with exact values for special angles
     - `UnitCircleExplorer.vue` - main component with SVG visualization
   - SVG features: unit circle, angle arc, radius line, point on circle, sin/cos projections

4. **Wave Graphs Feature** (9D)
   - Created `WaveGraphs.vue` component showing sin θ and cos θ waves
   - Angle marker syncs with unit circle visualization
   - X-axis labels in radians (π/2, π, 3π/2, 2π)
   - Toggle to show/hide wave graphs in main widget

5. **Trigonometry Content Page** (9E)
   - Created `TrigonometryIndexView.vue` section landing page
   - Created `UnitCircleView.vue` comprehensive content page with:
     - What is the Unit Circle section
     - Interactive Explorer (UnitCircleExplorer widget with URL sync)
     - Collapsible sections: Trig Functions, Special Angles, Quadrants, Radians, Applications, Identities
     - Python code examples throughout
   - Added routes and navigation for trigonometry section

6. **E2E Tests & Polish** (9F)
   - Created `e2e/trigonometry/unit-circle-explorer.spec.ts` with 18 tests
   - Added trigonometry pages to accessibility audits
   - Added keyboard accessibility tests for unit circle widget
   - Updated all documentation (ROADMAP, decisions, current_state)

**Key Architectural Decisions**:
- D-070: Tiered CI workflow (quick-check vs full-test)
- D-071: Visual regression tests local-only
- D-072: Test tag system (@e2e, @a11y, @visual)
- D-073: Composable pattern for widget state (useUnitCircle)
- D-074: Modular component architecture for widget
- D-075: Optional wave graphs (toggle, not always visible)
- D-076: Special angles data-driven (array of SpecialAngle objects)
