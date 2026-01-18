# Phase 17: Probability Distributions

**Theme**: *Personality Profiles for Randomness*

**Goal**: Build an interactive probability distribution explorer that teaches programmers to recognize, understand, and apply common probability distributions through visual experimentation and code equivalents.

---

## Strategic Context

Probability distributions are foundational for:

| Application | Distribution | Why It Matters |
|-------------|--------------|----------------|
| A/B Testing | Binomial | Counting successes in fixed trials |
| Rate Limiting | Poisson | Events per time window |
| Retry Logic | Exponential | Memoryless waiting times |
| ML Feature Scaling | Normal | Standardization, error modeling |
| Random Generation | Uniform | Monte Carlo, simulations |

This phase establishes the statistical foundation needed for Phases 18-20 (Sampling, Hypothesis Testing, Regression).

---

## Confirmed Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| **D-130** | Five core distributions: Normal, Binomial, Poisson, Exponential, Uniform | Covers discrete/continuous, bounded/unbounded, most common use cases |
| **D-131** | Interactive histogram with curve overlay | Shows discrete bars converging to continuous curves |
| **D-132** | Probability calculator panel (CDF queries) | Practical tool: P(X ≤ x), P(a ≤ X ≤ b) |
| **D-133** | CLT demonstration mode | Sample means → normal is a key insight |
| **D-134** | Preset-based (no arbitrary distribution expressions) | Security, curated educational examples |
| **D-135** | Parameter sliders with mathematical constraints | μ > 0 for Poisson, 0 < p < 1 for Binomial, etc. |
| **D-136** | Code examples for each distribution (NumPy/SciPy) | Programmer relevance |

---

## Scope

### In Scope
- **DistributionExplorer widget**: Interactive visualization of 5 distributions
- **Probability calculator**: CDF, quantile, and interval queries
- **CLT demonstration**: Sampling simulation showing convergence to normal
- **Math utilities**: PDF/PMF, CDF, quantile functions for all distributions
- **Content page**: Probability Distributions with programmer framing
- **E2E tests**: Widget interactions and accessibility

### Out of Scope (Future Enhancement)
- Multivariate distributions (joint, marginal)
- Bayesian inference / posterior updates
- Custom distribution fitting
- Probability density estimation (KDE)

---

## Widget Design: DistributionExplorer

### Architecture

```
src/components/widgets/DistributionExplorer/
├── DistributionExplorer.vue      # Main orchestrator
├── DistributionHistogram.vue     # SVG histogram + curve overlay
├── DistributionSelector.vue      # Distribution type tabs/buttons
├── ParameterControls.vue         # Distribution-specific sliders
├── ProbabilityCalculator.vue     # CDF query interface
├── CLTDemonstration.vue          # Sampling simulation panel
├── DistributionPresets.vue       # Quick-select presets
├── DistributionInfo.vue          # Mean, variance, properties
└── index.ts
```

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Distribution: [Normal] [Binomial] [Poisson] [Exponential] [Uniform]  │
├─────────────────────────────────────────────────────────────────┤
│  Parameters                                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ μ (mean): ────●──────────────── 0       [input: 0]         ││
│  │ σ (std):  ──────●────────────── 1       [input: 1]         ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                              ││
│  │                      ████                                    ││
│  │                    ████████                                  ││
│  │                  ████████████          Histogram + PDF      ││
│  │                ████████████████                              ││
│  │              ████████████████████                            ││
│  │  ──────────████████████████████████──────────               ││
│  │         -3    -2    -1     0     1     2     3               ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Probability Calculator                                          │
│  P(X ≤ [1.96]) = 0.975    P([−1] ≤ X ≤ [1]) = 0.683            │
├─────────────────────────────────────────────────────────────────┤
│  Properties: E[X] = 0, Var(X) = 1, σ = 1                        │
├─────────────────────────────────────────────────────────────────┤
│  Presets: [IQ Scores] [Coin Flips] [Server Requests] [Wait Times]│
└─────────────────────────────────────────────────────────────────┘
```

### Distribution Parameters

| Distribution | Parameters | Constraints | Default |
|--------------|------------|-------------|---------|
| Normal | μ, σ | σ > 0 | μ=0, σ=1 |
| Binomial | n, p | n ≥ 1, 0 < p < 1 | n=20, p=0.5 |
| Poisson | λ | λ > 0 | λ=5 |
| Exponential | λ (rate) | λ > 0 | λ=1 |
| Uniform | a, b | a < b | a=0, b=1 |

### Presets

| Name | Distribution | Parameters | Use Case |
|------|--------------|------------|----------|
| IQ Scores | Normal | μ=100, σ=15 | Classic example |
| Coin Flips (20) | Binomial | n=20, p=0.5 | Fair coin |
| Biased Die | Binomial | n=60, p=0.167 | 10 rolls per face |
| Server Requests | Poisson | λ=10 | Requests per second |
| API Timeouts | Exponential | λ=0.5 | Time between events |
| Random Numbers | Uniform | a=0, b=1 | RNG simulation |
| Quality Control | Binomial | n=100, p=0.02 | Defect rate |

### CLT Demonstration Mode

```
┌─────────────────────────────────────────────────────────────────┐
│  Central Limit Theorem Demo                                      │
│                                                                  │
│  Source: [Uniform 0-10]  Sample size: ──●── 30                  │
│  Samples taken: 500                                              │
│                                                                  │
│  Sample Means Distribution:                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    ████                                      ││
│  │                  ████████                                    ││
│  │                ████████████                                  ││
│  │              ████████████████     ← Approaches Normal!      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [Take 100 Samples] [Reset] [Auto-run]                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Math Utilities

### `src/utils/math/distributions.ts`

```typescript
// ============== Types ==============

export type DistributionType = 'normal' | 'binomial' | 'poisson' | 'exponential' | 'uniform';

export interface NormalParams { mu: number; sigma: number }
export interface BinomialParams { n: number; p: number }
export interface PoissonParams { lambda: number }
export interface ExponentialParams { lambda: number }
export interface UniformParams { a: number; b: number }

export type DistributionParams =
  | { type: 'normal'; params: NormalParams }
  | { type: 'binomial'; params: BinomialParams }
  | { type: 'poisson'; params: PoissonParams }
  | { type: 'exponential'; params: ExponentialParams }
  | { type: 'uniform'; params: UniformParams };

export interface DistributionStats {
  mean: number;
  variance: number;
  stdDev: number;
  mode: number | number[] | null;
  skewness: number;
}

// ============== PDF/PMF Functions ==============

// Normal distribution (continuous)
export function normalPdf(x: number, mu: number, sigma: number): number;
export function normalCdf(x: number, mu: number, sigma: number): number;
export function normalQuantile(p: number, mu: number, sigma: number): number;

// Binomial distribution (discrete)
export function binomialPmf(k: number, n: number, p: number): number;
export function binomialCdf(k: number, n: number, p: number): number;
export function binomialQuantile(prob: number, n: number, p: number): number;

// Poisson distribution (discrete)
export function poissonPmf(k: number, lambda: number): number;
export function poissonCdf(k: number, lambda: number): number;
export function poissonQuantile(prob: number, lambda: number): number;

// Exponential distribution (continuous)
export function exponentialPdf(x: number, lambda: number): number;
export function exponentialCdf(x: number, lambda: number): number;
export function exponentialQuantile(p: number, lambda: number): number;

// Uniform distribution (continuous)
export function uniformPdf(x: number, a: number, b: number): number;
export function uniformCdf(x: number, a: number, b: number): number;
export function uniformQuantile(p: number, a: number, b: number): number;

// ============== Statistics ==============

export function getDistributionStats(dist: DistributionParams): DistributionStats;

// ============== Sampling ==============

export function sampleNormal(mu: number, sigma: number): number;
export function sampleBinomial(n: number, p: number): number;
export function samplePoisson(lambda: number): number;
export function sampleExponential(lambda: number): number;
export function sampleUniform(a: number, b: number): number;

// Generate n samples
export function generateSamples(dist: DistributionParams, n: number): number[];

// ============== Histogram Generation ==============

export interface HistogramBin {
  start: number;
  end: number;
  count: number;
  density: number;
}

export function createHistogram(data: number[], binCount?: number): HistogramBin[];

// ============== Utilities ==============

// Factorial (for Poisson, Binomial)
export function factorial(n: number): number;

// Binomial coefficient C(n, k)
export function binomialCoefficient(n: number, k: number): number;

// Error function (for normal CDF)
export function erf(x: number): number;

// Standard normal CDF (Phi)
export function standardNormalCdf(z: number): number;

// Inverse standard normal (probit)
export function standardNormalQuantile(p: number): number;
```

**Test Coverage Target**: 100+ tests

Key test scenarios:
- Edge cases: p=0, p=1, λ=0, n=0
- Known values: standard normal quantiles (1.96 → 0.975)
- Symmetry: normal PDF symmetric around μ
- CDF properties: monotonic, [0,1] range
- PMF sums to 1 for discrete
- PDF integrates to 1 (approximately)

---

## Content Structure

### Probability Distributions Page
`/statistics/distributions` - `DistributionsView.vue`

**Sections**:

1. **Introduction** (expanded)
   - "Distributions are personality profiles for randomness"
   - Discrete vs continuous distinction
   - Three analogies block

2. **Discrete vs Continuous** (expanded)
   - PMF vs PDF explanation
   - CDF as the universal connector
   - Code: counting vs measuring

3. **Widget: DistributionExplorer** (expanded)
   - Full interactive widget

4. **Normal Distribution** (expanded)
   - Bell curve, 68-95-99.7 rule
   - Z-scores and standardization
   - Code: `scipy.stats.norm`

5. **Binomial Distribution** (collapsed)
   - Fixed trials, success counting
   - A/B testing connection
   - Code: `scipy.stats.binom`

6. **Poisson Distribution** (collapsed)
   - Rare events in time/space
   - Rate limiting example
   - Code: `scipy.stats.poisson`

7. **Exponential Distribution** (collapsed)
   - Memoryless property
   - Retry/timeout modeling
   - Code: `scipy.stats.expon`

8. **Uniform Distribution** (collapsed)
   - Equal probability
   - Random number generation
   - Code: `random.uniform()`

9. **Central Limit Theorem** (expanded)
   - CLT demonstration mode
   - Why normal is everywhere
   - Connection to sampling/estimation

10. **Common Pitfalls** (collapsed)
    - Discrete vs continuous confusion
    - Parameter interpretation (λ as rate vs mean)
    - Assuming normality

11. **In Python** (collapsed)
    - NumPy/SciPy code examples
    - Practical usage patterns

12. **Related Topics**
    - Descriptive Statistics (prerequisite)
    - Sampling & Estimation (next)
    - Hypothesis Testing (uses distributions)

---

## Increments

### Increment 17A: Distribution Math Utilities (~90 min)

**Tasks**:
1. Create `src/utils/math/distributions.ts`
2. Implement factorial, binomial coefficient, erf, standard normal functions
3. Implement Normal: PDF, CDF, quantile, sample
4. Implement Binomial: PMF, CDF, quantile, sample
5. Implement Poisson: PMF, CDF, quantile, sample
6. Implement Exponential: PDF, CDF, quantile, sample
7. Implement Uniform: PDF, CDF, quantile, sample
8. Implement getDistributionStats for all types
9. Implement histogram generation utility
10. Create `src/utils/math/distributions.test.ts` (100+ tests)

**Files**:
- `src/utils/math/distributions.ts` (new)
- `src/utils/math/distributions.test.ts` (new)
- `src/types/statistics.ts` (new or extend)

**Success Criteria**:
- All 100+ tests pass
- Known quantiles match (z=1.96 → 0.975)
- PMF sums verified
- CDF monotonicity verified

---

### Increment 17B: Distribution Composable & State (~45 min)

**Tasks**:
1. Create `src/composables/useDistributionExplorer.ts`
2. Implement distribution type switching
3. Implement parameter state with validation
4. Implement URL state sync
5. Implement preset loading
6. Create tests for composable

**Files**:
- `src/composables/useDistributionExplorer.ts` (new)
- `src/composables/useDistributionExplorer.test.ts` (new)

**Success Criteria**:
- Distribution switching preserves valid state
- Parameter constraints enforced
- URL state syncs correctly
- Presets load with correct parameters

---

### Increment 17C: DistributionExplorer Widget - Core (~90 min)

**Tasks**:
1. Create widget component structure (8 files)
2. Implement DistributionSelector (tabs/buttons)
3. Implement ParameterControls (distribution-specific sliders)
4. Implement DistributionHistogram (SVG histogram + curve overlay)
5. Implement DistributionInfo (mean, variance, properties)
6. Implement DistributionPresets (quick-select buttons)
7. Wire up main orchestrator

**Files**:
- `src/components/widgets/DistributionExplorer/*.vue` (8 files)

**Success Criteria**:
- All 5 distributions render correctly
- Parameter sliders update visualization in real-time
- Histogram and curve overlay aligned
- Presets load correctly
- Mobile responsive

---

### Increment 17D: Probability Calculator & CLT Demo (~60 min)

**Tasks**:
1. Implement ProbabilityCalculator panel
   - P(X ≤ x) query with visual shading
   - P(a ≤ X ≤ b) interval query
   - Quantile lookup (inverse CDF)
2. Implement CLTDemonstration panel
   - Source distribution selector
   - Sample size slider
   - Sampling animation
   - Convergence visualization
3. Add togglable panels to main widget

**Files**:
- `src/components/widgets/DistributionExplorer/ProbabilityCalculator.vue`
- `src/components/widgets/DistributionExplorer/CLTDemonstration.vue`

**Success Criteria**:
- Probability queries return correct values
- Shaded regions match computed probabilities
- CLT demo shows convergence to normal
- Animation smooth and interruptible

---

### Increment 17E: Content Page (~60 min)

**Tasks**:
1. Create `src/views/statistics/DistributionsView.vue`
2. Write content sections with three analogies
3. Add code examples for each distribution
4. Add common pitfalls callout
5. Update `src/router/index.ts` with route
6. Update `src/data/navigation.ts` with subtopic
7. Update StatisticsIndexView.vue "Coming Soon" section

**Files**:
- `src/views/statistics/DistributionsView.vue` (new)
- `src/router/index.ts`
- `src/data/navigation.ts`
- `src/views/statistics/StatisticsIndexView.vue`

**Success Criteria**:
- Navigation works
- Content renders with proper styling
- Widget integrated with URL sync
- Code examples accurate
- Related topics linked

---

### Increment 17F: E2E Tests & Polish (~45 min)

**Tasks**:
1. Create `e2e/statistics/distribution-explorer.spec.ts`
2. Test distribution switching
3. Test parameter controls
4. Test probability calculator
5. Test presets
6. Test URL state persistence
7. Add accessibility tests
8. Polish: keyboard navigation, focus management

**Files**:
- `e2e/statistics/distribution-explorer.spec.ts` (new)

**Success Criteria**:
- 20+ E2E tests pass
- Accessibility audit passes
- Keyboard navigation works
- Mobile touch interactions work

---

## Estimated Timeline

| Increment | Time |
|-----------|------|
| 17A: Distribution Math Utilities | 90 min |
| 17B: Distribution Composable & State | 45 min |
| 17C: DistributionExplorer Widget - Core | 90 min |
| 17D: Probability Calculator & CLT Demo | 60 min |
| 17E: Content Page | 60 min |
| 17F: E2E Tests & Polish | 45 min |
| **Total** | **~6.5 hours** |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Normal CDF/quantile accuracy | Medium | High | Use proven algorithm (Abramowitz-Stegun or similar) |
| Performance with many samples | Low | Medium | Limit sample count, use Web Workers if needed |
| Histogram binning edge cases | Medium | Low | Test with edge cases (single value, extreme outliers) |
| CLT demo animation jank | Medium | Low | Use requestAnimationFrame, batch updates |
| Mobile slider precision | Medium | Medium | Larger touch targets, input fields as fallback |

---

## Connections to Prior Phases

| Connection | Phase | How It Connects |
|------------|-------|-----------------|
| Descriptive Statistics | 10 | StatisticsCalculator histogram patterns |
| SVG visualization | 7, 11, 12 | Coordinate system, histogram rendering |
| Animation patterns | 15 | requestAnimationFrame for CLT demo |
| URL state sync | 5+ | Established pattern |

---

## Archive Reference

**Component**: `archive/snake-math/docs/.vitepress/theme/components/ProbabilitySimulator.vue`
- Distribution selection and sampling
- Histogram rendering

**Content**: `archive/snake-math/docs/statistics/probability/`
- `distributions.md` - Comprehensive distribution coverage
- `basics.md` - Probability fundamentals
- `applications.md` - Real-world examples

**Utilities**: Archive uses scipy-style functions

---

## Post-Phase Updates

After Phase 17 completion, update:
- [ ] `docs/LL_LI.md` - Lessons learned about distribution implementation
- [ ] `docs/DECISIONS.md` - D-130 through D-136
- [ ] `docs/CURRENT_STATE.md` - Phase 17 summary
- [ ] `docs/ROADMAP.md` - Mark Phase 17 complete
- [ ] `docs/TODO.md` - Update Statistics expansion status

---

## Success Metrics

- [ ] All unit tests pass (100+)
- [ ] All E2E tests pass (20+)
- [ ] Accessibility audit passes
- [ ] Widget URL sync works
- [ ] Mobile responsive
- [ ] All 5 distributions visualize correctly
- [ ] Probability calculator returns accurate values
- [ ] CLT demo shows clear convergence to normal
- [ ] Code examples are copy-pasteable
- [ ] Parameter constraints enforced

---

## Design System Compliance

### Required Content Page Elements (per DESIGN_SYSTEM.md)

1. **TopicPage wrapper** with `title` and `description` props
2. **Three-Analogy Block** (required for all topic pages):
   ```vue
   <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
     <div class="p-4 bg-surface-alt rounded-lg border border-border">
       <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
         <i class="fa-solid fa-dice mr-2" aria-hidden="true" />
         Everyday Analogy
       </h4>
       <p class="text-sm text-text-secondary">
         Distributions are like personality types — each describes a different "style" of randomness
       </p>
     </div>
     <div class="p-4 bg-surface-alt rounded-lg border border-border">
       <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
         <i class="fa-solid fa-code mr-2" aria-hidden="true" />
         Programming Analogy
       </h4>
       <p class="text-sm text-text-secondary">
         Distributions are like random number generators with different probability profiles
       </p>
     </div>
     <div class="p-4 bg-surface-alt rounded-lg border border-border">
       <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
         <i class="fa-solid fa-chart-area mr-2" aria-hidden="true" />
         Visual Intuition
       </h4>
       <p class="text-sm text-text-secondary">
         The shape of the curve tells you where values are likely to fall
       </p>
     </div>
   </div>
   ```

3. **Common Pitfall Callout** (required):
   ```vue
   <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
     <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
       <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
       Common Pitfall: Confusing Discrete and Continuous
     </p>
     <p class="text-sm text-amber-600 dark:text-amber-400">
       Discrete distributions (binomial, Poisson) assign probability to exact values.
       Continuous distributions (normal, exponential) have P(X = exact value) = 0 —
       always use intervals P(a ≤ X ≤ b).
     </p>
   </div>
   ```

4. **CodeExample components** with required props:
   - `id`: Format `statistics-distributions-{descriptor}` (e.g., `statistics-distributions-normal`)
   - `title`: Filename style (e.g., `normal_distribution.py`)

5. **RelatedTopics** at page bottom with 3-4 items including parent index

6. **Collapsible sections**: Primary content expanded, supplementary collapsed

### Navigation Description
Add engaging hook under 60 characters:
```typescript
{
  id: 'distributions',
  title: 'Probability Distributions',
  description: 'Each distribution is a personality profile for randomness',
  // ...
}
```

### Color Usage
- Use `text-green-700 dark:text-green-400` for success states (not green-600 per LL-038)
- Use semantic color classes for consistency

---

## Applicable Lessons Learned

### From Prior Phases (must apply)

| ID | Lesson | Application in Phase 17 |
|----|--------|-------------------------|
| **LL-015** | URL state sync requires debouncing | Debounce parameter slider updates to URL |
| **LL-019** | Animation timer cleanup | Clean up CLT demo animation timers on unmount |
| **LL-021** | TypeScript array access returns possibly undefined | Use optional chaining for histogram bin access |
| **LL-024** | Mathematical set membership matters | Ensure statistical formulas are mathematically correct |
| **LL-025** | Playwright test selector specificity | Use `exact: true` for preset button tests |
| **LL-026** | WCAG color contrast requirements | Use `text-green-700` not `text-green-600` |
| **LL-031** | Locale-dependent number formatting | Use regex patterns for number formatting tests |
| **LL-032** | TypeScript array access after length check | Add explicit `toBeDefined()` assertions in tests |
| **LL-037** | Statistical method variations | Document which statistical method is used |
| **LL-039** | SVG line elements visibility in Playwright | Use `toHaveCount(1)` for SVG element assertions |

### Identified Patterns to Apply

| ID | Pattern | Application in Phase 17 |
|----|---------|-------------------------|
| **LI-011** | SVG for data visualizations | Use SVG for histogram and distribution curves |
| **LI-017** | Preset data as single source of truth | Distribution presets contain all display and evaluation data |
| **LI-019** | Animation timer cleanup | CLTDemonstration must clear timeouts on unmount |
| **LI-022** | Axe-Core for accessibility testing | Include WCAG 2.1 AA audit in E2E tests |
| **LI-023** | Data-testid attributes | Add to all interactive elements and key displays |
| **LI-024** | Preset-based widget pattern | Use preset architecture (safer than arbitrary expressions) |
| **LI-033** | Composable for complex widget state | Create `useDistributionExplorer` composable |
| **LI-038** | Composable pattern for statistics state | Follow established statistics composable pattern |
| **LI-039** | Panel-based component architecture | Organize stats display into category-specific panels |
| **LI-040** | Use toHaveCount for SVG assertions | Apply to histogram bar and curve element tests |

---

## Implementation Checklist (Design System)

Before marking Phase 17 complete, verify:

### Content Page
- [ ] TopicPage wrapper with title/description
- [ ] Three-analogy block with correct colors (amber/emerald/blue)
- [ ] `bg-surface-alt` for analogy card backgrounds
- [ ] Common pitfall callout with amber styling
- [ ] All CodeExample components have `id` and `title` props
- [ ] CodeExample IDs follow format: `statistics-distributions-{descriptor}`
- [ ] CodeExample titles use filename style: `{name}.py`
- [ ] RelatedTopics section at bottom with 3-4 items
- [ ] Primary content sections expanded, supplementary collapsed
- [ ] Dark mode variants for all colored text

### Widget
- [ ] URL state sync with debouncing (300ms)
- [ ] Animation cleanup on component unmount
- [ ] `data-testid` attributes on interactive elements
- [ ] Keyboard navigation support
- [ ] Focus states: `focus:ring-2 focus:ring-primary/30`
- [ ] Hover states on all interactive elements
- [ ] Mobile responsive (touch targets ≥ 44px)

### Testing
- [ ] E2E selectors use `data-testid` or `exact: true`
- [ ] SVG element assertions use `toHaveCount(1)` where needed
- [ ] Accessibility audit with axe-core
- [ ] Number formatting tests use locale-agnostic patterns
- [ ] Statistical tests document which method is used
