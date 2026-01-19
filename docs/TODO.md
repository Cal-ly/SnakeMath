# SnakeMath ToDo List

**Last Updated**: 2026-01-19

---

## Current: Phase 20 Complete - Correlation & Regression

Phase 20 (Correlation & Regression) is complete. The Statistics section is now fully implemented with 5 subtopics:
- ✅ Correlation Math Utilities (Pearson correlation, linear regression, residuals, Cook's distance)
- ✅ useCorrelation composable with URL state sync
- ✅ CorrelationExplorer widget (scatter plot, regression line, residuals, Anscombe's quartet)
- ✅ CorrelationView content page with ML bridge
- ✅ E2E tests for correlation explorer widget

New features include:
- Interactive scatter plot with click-to-add and draggable points
- Real-time correlation coefficient (r) and R² display
- Regression line overlay with equation (ŷ = mx + b)
- Residual visualization toggle
- Anscombe's quartet demonstration
- 8 correlation presets (strong positive/negative, no correlation, outlier effect, etc.)
- "Correlation ≠ Causation" warning component
- 1744 total unit tests (70 new correlation tests)

---

## Statistics Section Complete

The Statistics section is now fully implemented with all 5 planned subtopics:
1. ✅ Descriptive Statistics (StatisticsCalculator widget)
2. ✅ Probability Distributions (DistributionExplorer widget, CLT demo)
3. ✅ Sampling & Estimation (SamplingSimulator widget)
4. ✅ Hypothesis Testing (HypothesisTestingSimulator widget)
5. ✅ Correlation & Regression (CorrelationExplorer widget)

---

### ✅ Correlation & Regression (Phase 20 - Complete)

**Completed**: CorrelationExplorer widget with scatter plot, regression line, residuals, Anscombe's quartet, comprehensive content page bridging to ML.

---

### ✅ Hypothesis Testing (Phase 19 - Complete)

**Completed**: HypothesisTestingSimulator widget with 4 test types, p-value visualization, Type I/II error demo, power analysis, comprehensive content page.

---

### ✅ Sampling & Estimation (Phase 18 - Complete)

**Completed**: SamplingSimulator widget with 4 sampling methods, CI demonstration, bootstrap panel, sample size calculator, comprehensive content page.

---

### ✅ Probability Distributions (Phase 17 - Complete)

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
- [ ] An Linear Algebra overview with Scalars, Vectors, Matrices and Tensors
- [ ] A dedicated Tensor Topic with the Mathematical/Physics Tensor
- [ ] Tensors used in programming and how they differ from the Mathematical/Physics Tensor
- [ ] Either a seperate topic on e.g. Vector spaces, Rank, Covariance matrices and other subtopics or integrate into existing content
- [ ] Eigenvalue, Eigenvectors and Eigen decomposition

### Site Features
- [ ] Tech stack section with "why" documentation. The intent is for the site to double as a portfolio piece
- [ ] Add SEO (meta tags, structured data, sitemap)

### Analogies for future content
Below is a list of subjects and analogies, that could be used in future content.

- **Vector Spaces**: A vector space is simply a set of directions and combinations you can build using those directions. Let's make it even clearer: Vectors are like LEGO bricks. A vector space is the box of all possible LEGO structures you can build using certain types of bricks.

### Content Review Plan

#### Actionable Criteria
- [ ] Ensure all topics have at least three analogies (1x everyday, 1x programming/system and 1x visual/intuitive) that the reader connect to the topic.
- [ ] Ensure all mathematical terms are either explained, or reference their explanation.

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
| 18 | Statistics — Sampling & Estimation | ✅ Complete |
| 19 | Statistics — Hypothesis Testing | ✅ Complete |
| 20 | Statistics — Correlation & Regression | ✅ Complete |
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
