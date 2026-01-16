# SnakeMath Current State

## Intent
This document outlines the current state of the project for easy resumption after a pause.

---

## Current Status: Phase 8 Complete, Phase 9 Next

**Last Updated**: 2026-01-16

### Project Summary

SnakeMath is an educational mathematics website for programmers. Eight phases of development have established:

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
| **9** | **TBD** | **To be planned** | **Next** |

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
  - **Exponentials & Logarithms (ExponentialExplorer widget)**

**Interactive Widgets**:
- **NumberTypeExplorer**: Classify numbers, Venn diagram, number line, set membership
- **SummationExplorer**: Presets, bar chart animation, code parallel, formula comparison
- **SimpleFunctionDemo**: Function presets, slider input, substitution display
- **QuadraticExplorer**: Coefficient sliders, parabola graph, equation forms, real-world presets
- **ExponentialExplorer**: Function explorer tab (exp/log plotting, growth/decay analysis), complexity comparison tab (O(1) to O(2^n))

**Visualization Components**:
- **CoordinateSystem**: Reusable SVG coordinate system with axes, grid, labels
- **PlotCurve**: Plot mathematical functions as SVG paths
- **PlotPoint**: Render labeled points on coordinate system
- **PlotLine**: Vertical/horizontal lines (axis of symmetry, asymptotes)

**Testing Infrastructure**:
- 206+ unit tests (Vitest)
- E2E tests (Playwright)
- Visual regression tests (Playwright screenshot comparison)
- WCAG 2.1 AA accessibility audits via axe-core
- CI workflow with E2E and visual regression testing

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
npm run test:e2e     # Run E2E tests (requires build)
npm run test:visual  # Run visual regression tests
npm run test:visual:update  # Update visual baselines
npm run build        # Production build
```

### Key Files
| Purpose | File |
|---------|------|
| Project guide | `CLAUDE.md` |
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
| Coordinate system | `src/components/visualizations/` |

### Archived Documentation
Phase completion summaries are in `docs/archive/`:
- `PHASE_3_COMPLETE.md` - Content components
- `PHASE_4_COMPLETE.md` - Interactive widgets
- `PHASE_5_COMPLETE.md` - Algebra & summation

---

## Test Coverage

### Unit Tests (206+ tests)
- Math utilities (number classification, parsing, quadratic, exponential functions)
- Data validation (symbols, navigation)
- Component logic (via composables)

### E2E Tests
- Navigation (header links, breadcrumbs, mobile menu)
- NumberTypeExplorer (input, examples, visualizations, URL sync)
- SummationExplorer (presets, bounds, animation, URL sync)
- QuadraticExplorer (presets, coefficients, equation forms, roots)
- Accessibility (WCAG 2.1 AA audits for all pages)

### Visual Regression Tests
- All pages baseline screenshots
- Widget state snapshots (default, inputs, presets)
- Desktop (1280x720) and mobile (375x667) viewports

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
