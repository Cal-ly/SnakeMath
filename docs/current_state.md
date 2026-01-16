# SnakeMath Current State

## Intent
This document outlines the current state of the project for easy resumption after a pause.

---

## Current Status: Phase 6 Complete, Phase 7 Next

**Last Updated**: 2026-01-16

### Project Summary

SnakeMath is an educational mathematics website for programmers. Six phases of development have established:

| Phase | Focus | Key Deliverables | Status |
|-------|-------|------------------|--------|
| 1 | Foundation | Vite, Vue 3, TypeScript, Tailwind, Vitest | ✅ Complete |
| 2 | App Shell | Header, nav, breadcrumbs, theme toggle, footer | ✅ Complete |
| 3 | Content Components | MathBlock (KaTeX), CodeExample (Shiki), tabs, panels | ✅ Complete |
| 4 | Interactive Widgets | NumberTypeExplorer, visualizations, URL state | ✅ Complete |
| 5 | Algebra & Summation | SummationExplorer, bar chart, code parallel | ✅ Complete |
| 6 | Basics Completion | E2E tests, Functions, Variables, Order of Ops | ✅ Complete |
| **7** | **TBD** | **To be planned** | 🎯 **Next** |

### What's Live

**Content Sections**:
- `/basics` - Complete section with 6 subtopics:
  - Foundations (The Basics)
  - Math Symbols
  - Number Types (with NumberTypeExplorer widget)
  - Functions (with SimpleFunctionDemo widget)
  - Variables & Expressions
  - Order of Operations (PEMDAS)
- `/algebra` - Summation notation (SummationExplorer widget)

**Interactive Widgets**:
- **NumberTypeExplorer**: Classify numbers, Venn diagram, number line, set membership
- **SummationExplorer**: Presets, bar chart animation, code parallel, formula comparison
- **SimpleFunctionDemo**: Function presets, slider input, substitution display

**Testing Infrastructure**:
- 105 unit tests (Vitest)
- 38 E2E tests (Playwright)
- WCAG 2.1 AA accessibility audits via axe-core
- CI workflow with E2E testing

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
npm run test:e2e     # Run E2E tests (requires dev server)
npm run build        # Production build
```

### Key Files
| Purpose | File |
|---------|------|
| Project guide | `CLAUDE.md` |
| Roadmap | `docs/ROADMAP.md` |
| Decisions | `docs/decisions.md` |
| Lessons learned | `docs/ll_li.md` |
| Routes | `src/router/index.ts` |
| Navigation data | `src/data/navigation.ts` |
| Type definitions | `src/types/index.ts` |
| E2E tests | `e2e/` directory |
| Playwright config | `playwright.config.ts` |

### Archived Documentation
Phase completion summaries are in `docs/archive/`:
- `PHASE_3_COMPLETE.md` - Content components
- `PHASE_4_COMPLETE.md` - Interactive widgets
- `PHASE_5_COMPLETE.md` - Algebra & summation

---

## Test Coverage

### Unit Tests (105 tests)
- Math utilities (number classification, parsing)
- Data validation (symbols, navigation)
- Component logic (via composables)

### E2E Tests (38 tests)
- Navigation (header links, breadcrumbs, mobile menu)
- NumberTypeExplorer (input, examples, visualizations, URL sync)
- SummationExplorer (presets, bounds, animation, URL sync)
- Accessibility (WCAG 2.1 AA audits for all pages)

---

## How to Resume Development

1. **Check todo list**: `instructions/todo.md` for known issues and ideas
2. **Read decisions**: `docs/decisions.md` for architectural context
3. **Start dev server**: `npm run dev`
4. **Verify before commits**:
   ```bash
   npm run type-check && npm run lint && npm run test && npm run build
   ```
5. **Run E2E tests**:
   ```bash
   npm run dev &  # Start dev server in background
   npm run test:e2e
   ```

---

## Known Build Notes

- **Chunk Size Warnings**: Shiki produces large language chunks (lazy-loaded, acceptable)
- **v-html Warnings**: ESLint warns about v-html in MathBlock/CodeExample (expected, trusted content)

---

## Phase 6 Completion Summary

Phase 6 accomplished:

1. **Playwright E2E Testing** (6A, 6B)
   - Set up Playwright with TypeScript
   - Created tests for navigation, widgets, accessibility
   - Added `data-testid` attributes for reliable selectors

2. **Accessibility Audits** (6C)
   - Integrated `@axe-core/playwright`
   - WCAG 2.1 AA compliance testing
   - Fixed color contrast issue in CodeExample

3. **Functions Content** (6D)
   - Created FunctionsView with comprehensive content
   - Built SimpleFunctionDemo widget (presets, slider, Python output)

4. **Variables & Expressions Content** (6E)
   - Created VariablesView with assignment, naming, expressions content
   - Code examples for substitution and multiple variables

5. **Order of Operations Content** (6F)
   - Created OrderOfOperationsView with PEMDAS content
   - Code examples for precedence, associativity, gotchas

6. **Number Types Enhancement** (6G)
   - Added Python Data Types section
   - Added Floating-Point Precision warning section

**Key Fixes**:
- Mathematical correctness: All real numbers now correctly marked as ∈ ℂ
- Color contrast: Fixed WCAG violation in CodeExample language badge
- Test reliability: Used exact matching for Playwright selectors
