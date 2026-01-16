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
- [ ] **UI/Design guideline**: A lot of the content has small differences in the design from subpage to sugpage. A guide would streamline the both the visual and how the user interacts with the sites functionality. This spans from how the `for` loop is visually represented to default behavior for what is collapsible and if it is collapsed by default.
- [ ] **References**: Add references to code examples, so they can be refered in other content on the site. Wether they should be hyperlinks for quick navigation by opening in a new tab or if we can make a toast with the code example upon hover, needs to brainstormed further. The "Mobile" view should be taken into account on this aspect.

---

## Review Items

- [ ] **Collapsible consistency**: Review which sections are collapsible across all pages; standardize the pattern
- [ ] **Code example repetition**: In `algebra/summation`, the same code example appears three times in quick succession; consolidate or differentiate

---

## Future Ideas

### Widgets
- [ ] Interactive summation: Let users see how changing numbers in code maps to mathematical notation and vice versa. The widget in `basics/functions` does something like this.

### Content Enhancements
- [ ] Q&A section for each topic
- [ ] "Code Equivalent" sections for all relevant code examples (like in `algebra/summation` where there is also a swithc between Python and JavaScript)
- [ ] Write "for" in cursive to visually connect to for-loop concept or otherwise visually differentiate.
- [ ] Ensure "clickable" cards differ visually from other cards. E.g. on the Trigonometry index page, the cards under "Why Programmers Needs This" and "Topics In This Section" don't differ enough visually, before you hover over the "clickable" card i.e. "The Unit Circle". Ensure this becomes part of the standard design for the whole website.

### UX Improvements
- [ ] Default behavior: Collapse code examples not directly used in teaching (keep "Code Equivalent" visible)

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

*Detailed completion summaries are in `docs/current_state.md`*

---

## Ideas on hold
- [ ] Expression builder widget for Variables & Expressions page
- [ ] PEMDAS step-by-step calculator widget for Order of Operations page

## Archived

- Phase 1-9 instructions: `instructions/archive/`
- Phase completion docs: `docs/archive/`
