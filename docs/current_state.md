# SnakeMath Current State

## Intent
This document outlines the current state of the project for easy resumption after a pause.

---

## Current Status: Phase 7 Complete, Phase 8 Next

**Last Updated**: 2026-01-16

### Project Summary

SnakeMath is an educational mathematics website for programmers. Seven phases of development have established:

| Phase | Focus | Key Deliverables | Status |
|-------|-------|------------------|--------|
| 1 | Foundation | Vite, Vue 3, TypeScript, Tailwind, Vitest | Complete |
| 2 | App Shell | Header, nav, breadcrumbs, theme toggle, footer | Complete |
| 3 | Content Components | MathBlock (KaTeX), CodeExample (Shiki), tabs, panels | Complete |
| 4 | Interactive Widgets | NumberTypeExplorer, visualizations, URL state | Complete |
| 5 | Algebra & Summation | SummationExplorer, bar chart, code parallel | Complete |
| 6 | Basics Completion | E2E tests, Functions, Variables, Order of Ops | Complete |
| 7 | Quadratics & Visual Regression | QuadraticExplorer, coordinate system, visual tests | Complete |
| **8** | **TBD** | **To be planned** | **Next** |

### What's Live

**Content Sections**:
- `/basics` - Complete section with 6 subtopics:
  - Foundations (The Basics)
  - Math Symbols
  - Number Types (with NumberTypeExplorer widget)
  - Functions (with SimpleFunctionDemo widget)
  - Variables & Expressions
  - Order of Operations (PEMDAS)
- `/algebra` - Two subtopics:
  - Summation notation (SummationExplorer widget)
  - Quadratic Functions (QuadraticExplorer widget)

**Interactive Widgets**:
- **NumberTypeExplorer**: Classify numbers, Venn diagram, number line, set membership
- **SummationExplorer**: Presets, bar chart animation, code parallel, formula comparison
- **SimpleFunctionDemo**: Function presets, slider input, substitution display
- **QuadraticExplorer**: Coefficient sliders, parabola graph, equation forms, real-world presets

**Visualization Components**:
- **CoordinateSystem**: Reusable SVG coordinate system with axes, grid, labels
- **PlotCurve**: Plot mathematical functions as SVG paths
- **PlotPoint**: Render labeled points on coordinate system
- **PlotLine**: Vertical/horizontal lines (axis of symmetry, asymptotes)

**Testing Infrastructure**:
- 137+ unit tests (Vitest)
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
| Coordinate system | `src/components/visualizations/` |

### Archived Documentation
Phase completion summaries are in `docs/archive/`:
- `PHASE_3_COMPLETE.md` - Content components
- `PHASE_4_COMPLETE.md` - Interactive widgets
- `PHASE_5_COMPLETE.md` - Algebra & summation

---

## Test Coverage

### Unit Tests (137+ tests)
- Math utilities (number classification, parsing, quadratic functions)
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

## Phase 7 Completion Summary

Phase 7 accomplished:

1. **Visual Regression Testing Infrastructure** (7A)
   - Configured Playwright for screenshot comparison
   - Created visual test file for all pages
   - Added `npm run test:visual` command
   - CI workflow for visual regression checks
   - Documentation in `docs/VISUAL_TESTING.md`

2. **Coordinate System Foundation** (7B)
   - Created reusable `CoordinateSystem.vue` SVG component
   - Built `PlotCurve.vue` for plotting functions
   - Built `PlotPoint.vue` for labeled points
   - Built `PlotLine.vue` for vertical/horizontal lines
   - Barrel export in `src/components/visualizations/`

3. **Quadratic Math Utilities** (7C)
   - Created `src/utils/math/quadratic.ts` with full test coverage
   - Functions: vertex, discriminant, roots, vertex form, factored form
   - Types: `QuadraticCoefficients`, `Vertex`, `DiscriminantResult`, etc.
   - 32 unit tests covering all functions and edge cases

4. **QuadraticExplorer Widget** (7D)
   - Built main `QuadraticExplorer.vue` component
   - `CoefficientControls.vue` - sliders for a, b, c
   - `EquationDisplay.vue` - standard, vertex, factored forms
   - `AnalysisPanel.vue` - discriminant, roots, vertex info
   - `PresetSelector.vue` - 8 presets (5 basic + 3 real-world)
   - `useQuadraticExplorer.ts` composable for state management
   - URL state sync for shareable links
   - Real-world presets with contextual explanations

5. **Quadratics Content Page** (7E)
   - Created `QuadraticsView.vue` with comprehensive content
   - Sections: Introduction, Explorer, Coefficients, Forms, Solving, Applications, Reference
   - Python code examples for each concept
   - Added to router and navigation

6. **Real-World Presets & Polish** (7F)
   - Added explanation text for real-world presets
   - Complex roots link to Number Types page
   - Visual regression tests for quadratics page
   - E2E tests for QuadraticExplorer widget

**Key Architectural Decisions**:
- D-059: Visual regression before new visuals
- D-060: Coordinate system supports negative domain/range
- D-061: Static form display (no animation) for MVP
- D-062: "No real roots" with link for Δ < 0
- D-063: 8 presets (5 basic + 3 real-world)
