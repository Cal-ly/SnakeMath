# SnakeMath ToDo List

**Last Updated**: 2026-01-18

---

## Current: Phase 15 Complete - Trigonometry Section Finished

Phase 15 (Trigonometry Remaining Topics) is complete. The Trigonometry section now has all 5 subtopics:
- ✅ Unit Circle (UnitCircleExplorer widget)
- ✅ Right Triangle (RightTriangleSolver widget)
- ✅ Trig Identities (TrigIdentityExplorer widget - 21 identities)
- ✅ Inverse Functions (InverseTrigExplorer widget - arcsin/arccos/arctan/atan2)
- ✅ Trig in Code (TrigCodePlayground widget - rotation, waves, circular motion, projectiles)

The "Coming Soon" section has been removed from TrigonometryIndexView.vue.

---

## Fixes (Known Issues)

- [x] **Scroll position issue**: Fixed in router scrollBehavior - query param changes no longer scroll to top
- [ ] Rename URL mapping between Vector 2D and Matrices 2D

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
| 10 | Statistics Foundation | ✅ Complete |
| 11 | Linear Algebra — Vectors | ✅ Complete |
| 12 | Linear Algebra — Matrices | ✅ Complete |
| 13 | Calculus — Limits | ✅ Complete |
| 14 | Calculus — Derivatives | ✅ Complete |
| 15 | Trigonometry — Remaining Topics | ✅ Complete |
| — | Design System Standardization | ✅ Complete |
| — | Content Review (Three-Analogy, Pitfalls) | ✅ Complete |
| — | Algebra Expansion (Product Notation, Linear Equations) | ✅ Complete |

*Detailed completion summaries are in `docs/CURRENT_STATE.md`*

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
- [ ] Snake Math Game, a small Snake game in browser, where the user has to navigate the snake around and take the right answer to a proposed math question (e.g. 81 + 7 = ?, and then the user has to navigate to the Square with "88")
- [ ] Vectors and Matrices in n'th dimension

## Archived

- Phase 1-9 instructions: `instructions/archive/`
- Phase completion docs: `docs/archive/`
