# Content Review Progress

This document tracks progress on upgrading topic pages using legacy review/planning summaries.

---

## Completed: /statistics/descriptive

**Date**: 2026-01-17

### Files Modified
- `src/views/statistics/DescriptiveStatsView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: Introduction section, after "Three Questions, Three Answers" box

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): Restaurant review - mean is average experience, std dev is how opinions varied, median is the typical visit
- **Programming Analogy** (emerald): Data's metadata - like files have size/date/type, datasets have mean/median/std
- **Visual Intuition** (blue): Box plot as "5-number summary at a glance" - min, Q1, median, Q3, max plus outliers

#### 2. Added Misconception Callout
Location: Introduction section, after the analogies

Content: "Common Pitfall: Don't Use Mean for Skewed Data" - warns that mean gets pulled toward outliers in skewed data (like income). Uses the CEO salary example. Recommends median for skewed data.

Note: Page already had a "Common Pitfalls" list in Quick Reference section - this new callout provides a more prominent, focused warning on the most impactful mistake.

#### 3. Updated RelatedTopics
Expanded from 2 to 4 related topics:
- Statistics Overview (kept)
- Summation - improved description: "The math behind calculating means and totals"
- Functions (new) - "Understanding transformations like z-score normalization"
- Number Types (new) - "Integer vs float precision in statistical calculations"

Removed faIcon properties (RelatedTopics component handles icons automatically).

#### 4. Improved Navigation Description
Changed from: "Mean, median, variance, and data visualization"
Changed to: "Summarize any dataset's personality with a few key numbers"

This uses the "data's biography/personality" framing from legacy docs.

### Validation
- ✅ `npm run type-check` passed

### Follow-ups for Next Pass
- Consider adding Simpson's Paradox visual demo (from CONTENT_DESCRIPTIVE_STATS.md Phase 1)
- Could add streaming statistics section (Welford's algorithm) for real-time data
- Consider adding "correlation ≠ causation" callout in visualization context

---

## Completed: /calculus/limits

**Date**: 2026-01-17

### Files Modified
- `src/views/calculus/LimitsView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: Introduction section, replacing the 2-column "Mathematical/Programming Intuition" grid

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): "Stop sign" - watching a car approach a stop sign, predicting destination before arrival
- **Programming Analogy** (emerald): Convergence loop with tolerance check
- **Visual Intuition** (blue): Zooming in on a curve, seeing y-values cluster around L

#### 2. Added Misconception Callout
Location: Introduction section, after "Why Limits Matter" box

Content: "Common Pitfall: Approach ≠ Plug In" - warns that limits are about approaching, not substituting. Uses the (x²-1)/(x-1) example where the function is undefined at x=1 but the limit is 2.

#### 3. Updated RelatedTopics
Added Derivatives link at the top of the list:
- "Derivatives - Derivatives are defined using limits"

Also fixed typo: "L'Hopital" → "L'Hôpital"

#### 4. Improved Navigation Description
Changed from: "Understanding approaching values"
Changed to: "What happens when we get really, really close?"

This uses the engaging hook from the legacy docs and better captures the intuition.

### Validation
- ✅ `npm run type-check` passed

### Follow-ups for Next Pass
- Consider adding a "floating point pitfall" example showing catastrophic cancellation when h is too small (from CONTENT_LIMITS.md Phase 2 recommendations)
- Could add more "Try These Experiments" items for the LimitsExplorer
- The continuity connection could be strengthened with a brief mention of "no surprises" framing

---

## Queue

Topics with content planning docs available:
- /trigonometry/unit-circle (CONTENT_UNITCIRCLE.md)
- /linear-algebra/vectors (CONTENT_VECTORS_2D.md)
- /linear-algebra/matrices (CONTENT_MATRICES_2D.md)
- /probability (CONTENT_PROBABILITY.md) - no view exists yet
