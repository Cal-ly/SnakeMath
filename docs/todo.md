# SnakeMath ToDo List

**Last Updated**: 2026-01-16

---

## Current: Phase 10 - Statistics Foundation

**Planned Deliverables** (from ROADMAP.md):
- StatisticsCalculator widget
- Content: Mean, median, mode, variance, standard deviation, distributions
- Features: Data input, histogram, box plot, statistics display
- Preset datasets: Test scores, heights, salaries, reaction times

---

## Fixes (Known Issues)

- [ ] **Scroll position issue**: Algebra/Summation page jumps to top when recalculating
- [ ] **Missing Sigma symbol**: On algebra index page, the topic card for Summation lacks the Σ symbol
- [ ] **Naming inconsistency**: Change "Summation Notation" to "Summation" on algebra index page

---

## Review Items

- [ ] **Code example repetition**: In `algebra/summation`, the same code example appears three times in quick succession; consolidate or differentiate

---

## Future Ideas

### Widgets
- [ ] Interactive summation: Let users see how changing numbers in code maps to mathematical notation and vice versa. The widget in `basics/functions` does something like this.

### Content Enhancements
- [ ] Q&A section for each topic
- [ ] "Code Equivalent" sections for all relevant code examples (like in `algebra/summation` where there is also a switch between Python and JavaScript)
- [ ] Write "for" in cursive to visually connect to for-loop concept or otherwise visually differentiate

### Site Features
- [ ] Tech stack section with "why" documentation. The intent is for the site to double as a portfolio piece
- [ ] Add SEO (meta tags, structured data, sitemap)

---

## Completed Phases

| Phase | Focus | Status |
|-------|-------|--------|
| 1-5 | Foundation through Summation | ✅ Complete |
| 6 | Basics Completion + E2E Testing | ✅ Complete |
| 7 | Quadratics & Visual Regression | ✅ Complete |
| 8 | Exponentials & Logarithms | ✅ Complete |
| 9 | Trigonometry + Testing Refinement | ✅ Complete |
| — | Design System Standardization | ✅ Complete |

*Detailed completion summaries are in `docs/current_state.md`*

### Design System Standardization (Completed)
- Created `docs/design-system.md` with comprehensive UI/UX guidelines
- Added unique IDs to all 53+ CodeExample components for cross-referencing
- Fixed card styling: navigational vs informational patterns
- Standardized collapsible behavior (teaching content expanded, supplementary collapsed)
- Added SVG hover affordances to UnitCircleExplorer

---

## Ideas on hold
- [ ] Expression builder widget for Variables & Expressions page
- [ ] PEMDAS step-by-step calculator widget for Order of Operations page

## Archived

- Phase 1-9 instructions: `instructions/archive/`
- Phase completion docs: `docs/archive/`
