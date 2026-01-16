# SnakeMath ToDo List

**Last Updated**: 2026-01-16

---

## Phase 6: Basics Completion + Testing Infrastructure ✅ COMPLETE

### Content (from archive) ✅
- [x] Functions (composition, inverse, vending machine analogy)
- [x] Variables and expressions (expression building, implementation methods)
- [x] Order of operations (PEMDAS, precedence tables, AST concepts)

### Testing Infrastructure ✅
- [x] Playwright setup and configuration
- [x] E2E tests for navigation
- [x] E2E tests for NumberTypeExplorer
- [x] E2E tests for SummationExplorer
- [x] Accessibility audit integration (axe-core)
- [x] CI workflow updates for E2E

---

## Phase 7: Quadratic Functions & Visual Regression ✅ COMPLETE

### Visual Regression (7A) ✅
- [x] Configure Playwright for screenshot comparison
- [x] Create visual test file for all pages
- [x] Add npm scripts for visual testing
- [x] CI workflow for visual regression
- [x] Documentation (docs/VISUAL_TESTING.md)

### Coordinate System Foundation (7B) ✅
- [x] CoordinateSystem.vue (SVG axes, grid, labels)
- [x] PlotCurve.vue (function plotting)
- [x] PlotPoint.vue (labeled points)
- [x] PlotLine.vue (vertical/horizontal lines)
- [x] Barrel export in visualizations/

### Quadratic Math Utilities (7C) ✅
- [x] quadratic.ts with full test coverage
- [x] Types: QuadraticCoefficients, Vertex, etc.
- [x] Functions: vertex, discriminant, roots, forms
- [x] 32 unit tests

### QuadraticExplorer Widget (7D) ✅
- [x] CoefficientControls.vue (a, b, c sliders)
- [x] EquationDisplay.vue (three forms)
- [x] AnalysisPanel.vue (discriminant, roots, vertex)
- [x] PresetSelector.vue (8 presets)
- [x] useQuadraticExplorer.ts composable
- [x] URL state sync
- [x] data-testid attributes

### Quadratics Content Page (7E) ✅
- [x] QuadraticsView.vue with all sections
- [x] Python code examples
- [x] Route and navigation added

### Polish (7F) ✅
- [x] Real-world preset explanations
- [x] Complex roots link to Number Types
- [x] E2E tests for QuadraticExplorer
- [x] Documentation updates

---

## Phase 8: To Be Planned

*Next phase to be defined*

---

## Fixes (Known Issues)
- [ ] Algebra/Summation page jumps to top when recalculating (scroll position issue)
- On the algebra index page, the topic guiding to Summation Notation lacks it's big Sigma symbol. Further It should be chnaged from "Summation Notation" to just "Summation" 

---

## Review
- Review what is collapsible and what is not. It is currently not being done in a standardized fashion.
- Review the usage of code examples. An example: In `algebra/summation` we have the same code example showing up three times in quick succession.

---

## Future Ideas
- Q&A section for each topic
- Tech stack section, including "why" documentation (let site double as portfolio piece)
- Write "for" in cursive to visually connect to for-loop
- Add "Code Equivalent" to all/relevant code examples. Do it the same way, as been done in `algebra/summation`
- Make "Summation to code example" interactive. The idea is, that the user can see "I change this number, is equivalent to changing this number in the mathematical notation" and vice versa.
- Make it default behavior, that code examples that are not used directly in conveying the teaching material (e.g. "Code Equivalent" is directly used in conveying the content) collapsed.
- Expression builder widget for Variables & Expressions page
- PEMDAS step-by-step calculator widget for Order of Operations page
- Add SEO

---

## Archived
Phase 1-5 instructions moved to `instructions/archive/`
Phase 6 instructions: `instructions/archive/PHASE_6_PROMPT.md`
