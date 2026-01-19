# Probability Rewrite Outline (Implementation Blueprint)

This document is the **rewrite outline** derived from [docs/content/CONTENT_PROBABILITY.md](../../../docs/content/docs/content/CONTENT_PROBABILITY.md). It’s intentionally compact (fewer examples) to keep the rewrite plan actionable without ballooning scope.

## Goals
- Preserve the strongest voice/analogies from the archive.
- Keep a **programmer-first** flow: concrete → code → interpretation → decisions.
- Ensure each page has:
  - A hook
  - 1–2 “core ideas” sections
  - 1 “worked code” block
  - A short “common pitfalls” callout
  - Clear next/previous navigation

## Page Set
- `probability/index` (hub)
- `probability/basics` (foundations)
- `probability/distributions` (models)
- `probability/applications` (case studies)

---

## Page 1: Probability Index (Hub)

### Purpose
Fast navigation + quick reference. The index should answer: “What is probability for?” and “Where do I start?”

### Outline
1. **Opening hook** (1 paragraph)
   - Keep: “probability is the mathematical language of uncertainty” ([archive/snake-math/docs/statistics/probability/index.md](../../../docs/content/archive/snake-math/docs/statistics/probability/index.md#L25)).
2. **Learning path cards** (3 cards)
   - Basics → Distributions → Applications.
   - Each card includes:
     - “You’ll learn…” (3 bullets)
     - “You’ll build…” (1 bullet)
     - Estimated time (rough)
3. **Quick reference**
   - $P(A)$, $P(A \mid B)$, Bayes, normal PDF (keep brief).
4. **Pitfalls teaser**
   - Independence assumptions
   - Base-rate fallacy
   - p-value misreads
5. **Navigation**
   - Next: Basics

### Keep / Change
- Keep the archive’s structure.
- Remove any stray markdown artifacts during migration (archive index ends with a dangling code fence).

---

## Page 2: Probability Basics (Concept)

### Purpose
Make learners comfortable with:
- events and sample spaces
- conditional probability and independence
- simulation as verification
- random variables + expectation/variance

### Outline
1. **Hook + definitions**
   - Keep: “mathematics of uncertainty” + weather forecast framing ([basics.md](../../../docs/content/archive/snake-math/docs/statistics/probability/basics.md#L25)).
   - Define: sample space $\Omega$, event $A$, probability $P(A)$.
2. **Micro-examples (fast wins)**
   - Coin, die, deck; 3–6 lines each; keep numbers concrete.
3. **Core rules**
   - complement rule
   - addition rule (mutually exclusive + general)
4. **Conditional probability + independence**
   - Worked example (keep deck-of-cards “without replacement”): [basics.md](../../../docs/content/archive/snake-math/docs/statistics/probability/basics.md#L116-L133)
   - Add “independence checklist” callout.
5. **Simulation vs theory (verification harness)**
   - Keep the coin flip simulation pattern: [basics.md](../../../docs/content/archive/snake-math/docs/statistics/probability/basics.md#L144-L178)
6. **Random variables (minimum viable)**
   - Define RV; show expected value + variance for die.
7. **Common pitfalls** (short callout)
   - Confusing $P(A\mid B)$ vs $P(B\mid A)$
   - Treating dependent events as independent
8. **Interactive**
   - Embed: `<ProbabilityBasicsSimulator />`
9. **Navigation**
   - Prev: Index, Next: Distributions

### “Fewer examples” choice
- Keep only **two** worked code exemplars on this page:
  - conditional probability (cards)
  - simulation vs theory

---

## Page 3: Probability Distributions (Concept)

### Purpose
Teach distributions as models you *choose* based on assumptions.

### Outline
1. **Hook + framing**
   - Keep: “personality profiles for randomness” ([distributions.md](../../../docs/content/archive/snake-math/docs/statistics/probability/distributions.md#L25)).
2. **Vocabulary (define once)**
   - PMF vs PDF vs CDF
   - discrete vs continuous
3. **Selection guide (decision tree)**
   - “Counting successes in $n$ trials?” → binomial
   - “Counting arrivals/events per interval?” → Poisson
   - “Waiting time until event?” → exponential / geometric
   - “Measurement noise / sums / averages?” → normal
4. **One deep-dive: Normal**
   - Keep the minimal manual PDF definition snippet: [distributions.md](../../../docs/content/archive/snake-math/docs/statistics/probability/distributions.md#L235-L244)
   - Mention Z-scores + CLT (conceptual, no long code).
5. **One discrete + one continuous exemplar**
   - Discrete: binomial coefficient (manual) snippet: [distributions.md](../../../docs/content/archive/snake-math/docs/statistics/probability/distributions.md#L423-L436)
   - Continuous: exponential memoryless demo (short): [distributions.md](../../../docs/content/archive/snake-math/docs/statistics/probability/distributions.md#L635-L647)
6. **Assumptions that break** (callouts)
   - binomial breaks if p changes / dependence
   - Poisson breaks if rate changes / burstiness
   - exponential breaks if non-memoryless
7. **Interactive**
   - Embed: `<ProbabilityDistributionSimulator />`
8. **Navigation**
   - Prev: Basics, Next: Applications

### “Fewer examples” choice
- Keep only **three** worked exemplars:
  - normal pdf
  - binomial coefficient
  - exponential memoryless

---

## Page 4: Probability Applications (Case Studies)

### Purpose
Show probability as a **decision engine**: quantify uncertainty, pick an action, measure error tradeoffs.

### Global structure
Use the same template in each case:
- Inputs → Model → Output → Decision → Pitfall

### Outline
1. **Hook**
   - Keep the “Netflix → medical diagnosis → A/B testing” motivation ([applications.md](../../../docs/content/archive/snake-math/docs/statistics/probability/applications.md#L25)).
2. **Case Study A: A/B testing (product)**
   - Keep: two-proportion z-test + CI snippet: [applications.md](../../../docs/content/archive/snake-math/docs/statistics/probability/applications.md#L63-L95)
   - Add one pitfall: “peeking inflates false positives” (no deep math, just guardrail).
3. **Case Study B: Diagnostics (Bayes)**
   - Keep: rare disease Bayes snippet: [applications.md](../../../docs/content/archive/snake-math/docs/statistics/probability/applications.md#L290-L313)
   - Emphasize base-rate effect.
4. **Case Study C: Quality control (alerts/monitoring)**
   - Keep: control limits + Type I/II framing snippet: [applications.md](../../../docs/content/archive/snake-math/docs/statistics/probability/applications.md#L655-L717)
   - Map to software monitoring (“false alarm” vs “missed incident”).
5. **Interactive**
   - Embed: `<ProbabilityApplicationsDemo />`
6. **Key takeaways**
   - 4–6 bullets max.
7. **Navigation**
   - Prev: Distributions, Next: (link out to inference/hypothesis testing topics)

### “Fewer examples” choice
- Reduce to **three** case studies for the first rewrite pass:
  - A/B testing
  - Bayes diagnostics
  - quality control

---

## Cross-page additions (do in the rewrite)

### Concept bridges (copy-ready)
- End of Basics → Distributions:
  - “Now that you can compute probabilities from counts and conditions, the next step is choosing models (distributions) that fit real-world randomness.”
- End of Distributions → Applications:
  - “Distributions are the models; applications are where those models drive decisions under uncertainty.”

### Shared pitfalls sidebar (use consistently)
- Independence is an assumption, not a default.
- $P(A\mid B)$ is not $P(B\mid A)$.
- ‘Statistically significant’ is not ‘meaningfully large’.

---

## Minimal new content (optional, Phase 2)
Keep this list short on purpose:
1. **Monitoring base-rate fallacy** (alerts)
2. **Retry/backoff intuition** (geometric/exponential)
3. **Birthday paradox** (ID collision sizing)
