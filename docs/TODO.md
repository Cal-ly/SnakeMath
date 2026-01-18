# SnakeMath ToDo List

**Last Updated**: 2026-01-18

---

## Current: Phase 17 Complete - Probability Distributions

Phase 17 (Probability Distributions) is complete. The Statistics section now includes distributions content:
- ✅ Distributions Math Utilities (PDF/PMF, CDF, quantiles, sampling)
- ✅ useDistributions composable with URL state sync
- ✅ DistributionExplorer widget (5 distributions, parameter controls, histogram, probability calculator)
- ✅ CLTDemonstration component (Central Limit Theorem interactive demo)
- ✅ DistributionsView content page with comprehensive educational content
- ✅ E2E tests for widget and CLT demonstration

New features include:
- 5 distributions: Normal, Binomial, Poisson, Exponential, Uniform
- Interactive parameter sliders with real-time PDF/CDF updates
- Probability calculator (P(X < a), P(a < X < b))
- Histogram from random samples
- Central Limit Theorem demonstration with auto-run animation
- 1461 total unit tests (209 new distribution tests)

---

## Next Up: Statistics Expansion (Continued)

The Statistics section now has Descriptive Statistics and Probability Distributions. The following three topics will complete the section and bridge toward ML/AI foundations.

### Topic 2: Sampling & Estimation (Phase 18)

**Core Philosophy**: "You can't measure everyone, so you measure some and estimate for all — but how confident can you be in that estimate?"

See detailed planning in Phase 18 plan.

---

### Topic 3: Hypothesis Testing (Phase 19)

**Core Philosophy**: "Hypothesis testing is the scientific method formalized — you assume nothing's happening (null hypothesis), then calculate how surprising your data would be under that assumption."

See detailed planning in Phase 19 plan.

---

### Topic 4: Correlation & Regression (Phase 20)

**Core Philosophy**: "Correlation measures 'do these variables move together?' — regression answers 'by how much and can I predict one from the other?'"

See detailed planning in Phase 20 plan.

---

### ✅ Topic 1: Probability Distributions (Phase 17 - Complete)

**Completed**: DistributionExplorer widget with 5 distributions, CLT demonstration, comprehensive content page.

---

## Fixes (Known Issues)

- [x] **Scroll position issue**: Fixed in router scrollBehavior - query param changes no longer scroll to top
- [x] **3D coordinate system orientation**: Fixed isometric projection to face the user - Z-axis now points toward viewer (lower-right) instead of away (upper-left)

---

## Review Items

- [ ] **Code example repetition**: In `algebra/summation`, the same code example appears three times in quick succession; consolidate or differentiate
- [x] **Trigonometry design system compliance**: Audited all 6 trig views against DESIGN_SYSTEM.md, fixed issues in UnitCircleView, InverseTrigView, TrigInCodeView

---

## Future Ideas

### Widgets
- [ ] Interactive summation: Let users see how changing numbers in code maps to mathematical notation and vice versa. The widget in `basics/functions` does something like this.

### Content Enhancements
- [ ] Q&A section for each topic
- [ ] "Code Equivalent" sections for all relevant code examples (like in `algebra/summation` where there is also a switch between Python and JavaScript)
- [ ] Write "for" in cursive to visually connect to for-loop concept or otherwise visually differentiate
- [ ] An Linear Algebra overview with Scalars, Vectors, Matrices and Tensors. Furhter, introduce "Rank" in matrices.
- [ ] A dedicated Tensor Topic with the Mathematical/Physics Tensor
- [ ] Tensors used in programming and how they differ from the Mathematical/Physics Tensor


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
| 16 | Linear Algebra — 3D | ✅ Complete |
| 17 | Statistics — Probability Distributions | ✅ Complete |
| — | Design System Standardization | ✅ Complete |
| — | Content Review (Three-Analogy, Pitfalls) | ✅ Complete |
| — | Algebra Expansion (Product Notation, Linear Equations) | ✅ Complete |

*Detailed completion summaries are in `docs/CURRENT_STATE.md`*

### Design System Standardization (Completed)
- Created `docs/DESIGN_SYSTEM.md` with comprehensive UI/UX guidelines
- Added unique IDs to all 53+ CodeExample components for cross-referencing
- Fixed card styling: navigational vs informational patterns
- Standardized collapsible behavior (teaching content expanded, supplementary collapsed)
- Added SVG hover affordances to UnitCircleExplorer

### Trigonometry Design System Audit (2026-01-18)
Fixed compliance issues in Trigonometry content:
- **UnitCircleView**: Added missing Common Pitfall callout (radians vs degrees)
- **InverseTrigView**: Fixed analogy backgrounds (`bg-surface-alt`), pitfall styling (amber), added TopicPage wrapper, fixed CodeExample props
- **TrigInCodeView**: Added three-analogy block, pitfall callout, RelatedTopics, made sections collapsible, added CodeExample id/title props

---

## Ideas on hold
- [ ] Expression builder widget for Variables & Expressions page
- [ ] PEMDAS step-by-step calculator widget for Order of Operations page
- [ ] Snake Math Game, a small Snake game in browser, where the user has to navigate the snake around and take the right answer to a proposed math question (e.g. 81 + 7 = ?, and then the user has to navigate to the Square with "88")
- [ ] Vectors and Matrices in n'th dimension
- [ ] Rename URL mapping between Vector 2D and Matrices 2D

## Archived

- Phase 1-9 instructions: `instructions/archive/`
- Phase completion docs: `docs/archive/`
