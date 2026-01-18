# Phase 18: Sampling & Estimation

**Theme**: *Measure Some, Estimate All*

**Goal**: Build an interactive sampling simulator that teaches programmers how statistical inference works — from population to sample to estimate — with visual demonstrations of sampling distributions, confidence intervals, and the bootstrap method.

---

## Strategic Context

Sampling and estimation are the bridge between descriptive statistics and inferential statistics:

| Concept | Programming Analogy | Why It Matters |
|---------|---------------------|----------------|
| Population vs Sample | Full dataset vs query result | Can't always process everything |
| Sampling Distribution | Running a function many times | Understanding variability |
| Standard Error | Confidence in your profiler | How much can we trust the estimate? |
| Confidence Interval | Error bars on metrics | Reporting uncertainty |
| Bootstrap | Resampling for robustness | Distribution-free inference |

This phase builds directly on Phase 17 (Distributions) and prepares for Phase 19 (Hypothesis Testing).

---

## Confirmed Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| **D-140** | Four sampling methods: Simple Random, Stratified, Systematic, Cluster | Covers main approaches programmers encounter |
| **D-141** | Visual population grid with sampling animation | Makes abstract concepts concrete |
| **D-142** | Sampling distribution histogram (many samples → distribution of means) | Core insight: sample statistics vary |
| **D-143** | Bootstrap resampling demonstration | Modern, distribution-free approach |
| **D-144** | Confidence interval coverage simulation | Shows what "95% confidence" really means |
| **D-145** | Sample size calculator | Practical tool for planning |
| **D-146** | Population generator (define underlying distribution) | Controlled experiments |

---

## Scope

### In Scope
- **SamplingSimulator widget**: Interactive population sampling with multiple methods
- **Sampling distribution visualization**: Histogram of sample statistics
- **Confidence interval demonstration**: Coverage simulation
- **Bootstrap panel**: Resampling with percentile intervals
- **Sample size calculator**: Power/precision-based sizing
- **Math utilities**: Sampling functions, standard error, CI formulas
- **Content page**: Sampling & Estimation with programmer framing

### Out of Scope (Future Enhancement)
- Complex survey designs (multi-stage, weighted)
- Maximum likelihood estimation
- Bayesian credible intervals
- Missing data handling

---

## Widget Design: SamplingSimulator

### Architecture

```
src/components/widgets/SamplingSimulator/
├── SamplingSimulator.vue           # Main orchestrator
├── PopulationGrid.vue              # Visual grid representing population
├── SamplingMethodSelector.vue      # Method selection tabs
├── SampleSizeControls.vue          # Sample size slider + input
├── SamplingDistribution.vue        # Histogram of sample statistics
├── ConfidenceIntervalDemo.vue      # CI coverage simulation
├── BootstrapPanel.vue              # Bootstrap resampling demo
├── SampleSizeCalculator.vue        # Calculate required n
├── SamplingPresets.vue             # Quick-select scenarios
├── SamplingResults.vue             # Statistics display
└── index.ts
```

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Population                                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ○ ○ ● ○ ○ ○ ● ○ ○ ○ ○ ● ○ ○ ○ ○ ○ ● ○ ○   N = 500         ││
│  │ ○ ● ○ ○ ○ ○ ○ ○ ● ○ ○ ○ ○ ○ ● ○ ○ ○ ○ ○   μ = 50          ││
│  │ ○ ○ ○ ● ○ ○ ○ ○ ○ ○ ● ○ ○ ○ ○ ○ ○ ● ○ ○   σ = 15          ││
│  │ ● ○ ○ ○ ○ ● ○ ○ ○ ○ ○ ○ ● ○ ○ ○ ○ ○ ○ ●                    ││
│  │ ○ ○ ● ○ ○ ○ ○ ● ○ ○ ○ ○ ○ ○ ● ○ ○ ○ ○ ○   ● = sampled      ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Method: [Simple Random] [Stratified] [Systematic] [Cluster]     │
│  Sample Size: ──────●────────── 30     [Take Sample]            │
├─────────────────────────────────────────────────────────────────┤
│  Current Sample: n=30, x̄=51.2, s=14.8                           │
│  95% CI: [45.7, 56.7]                                           │
├─────────────────────────────────────────────────────────────────┤
│  Sampling Distribution (after 100 samples)                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    ████                                      ││
│  │                  ████████                                    ││
│  │                ████████████        Mean of means: 50.1      ││
│  │              ████████████████      Std error: 2.74          ││
│  │  ──────────████████████████████──────────                   ││
│  │         44    46    48    50    52    54    56               ││
│  └─────────────────────────────────────────────────────────────┘│
│  [Take 100 Samples] [Reset] [Show CI Coverage]                   │
└─────────────────────────────────────────────────────────────────┘
```

### Sampling Methods

| Method | Visual | Implementation |
|--------|--------|----------------|
| Simple Random | Random dots highlighted | `Math.random()` selection |
| Stratified | Groups colored, proportional selection | Divide by strata, sample from each |
| Systematic | Every kth item highlighted | Select every N/n item |
| Cluster | Clusters outlined, some fully selected | Group into clusters, select entire clusters |

### CI Coverage Simulation

```
┌─────────────────────────────────────────────────────────────────┐
│  95% Confidence Interval Coverage                                │
│                                                                  │
│  True μ = 50  [shown as vertical line]                          │
│                                                                  │
│  Sample 1:  ├────────●────────┤  ✓ captures μ                   │
│  Sample 2:  ├──────●──────┤      ✓ captures μ                   │
│  Sample 3:      ├────────●────────┤  ✓ captures μ               │
│  Sample 4:  ├────●────┤              ✗ misses μ                 │
│  Sample 5:    ├──────●──────┤    ✓ captures μ                   │
│  ...                                                            │
│                                                                  │
│  Coverage: 94/100 = 94% (expected ~95%)                         │
│                                                                  │
│  [Run 100 CIs] [Reset]                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Bootstrap Panel

```
┌─────────────────────────────────────────────────────────────────┐
│  Bootstrap Resampling                                            │
│                                                                  │
│  Original sample: [12, 45, 23, 67, 34, ...]  n=30               │
│  Bootstrap iterations: ──●── 1000                               │
│                                                                  │
│  Bootstrap Distribution of Means:                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              ████████                                        ││
│  │            ████████████                                      ││
│  │          ████████████████                                    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Bootstrap 95% CI (percentile method): [46.2, 55.8]             │
│  Bootstrap SE: 2.45                                              │
│                                                                  │
│  [Run Bootstrap] [Reset]                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Presets

| Name | Population | Sample Size | Scenario |
|------|------------|-------------|----------|
| User Survey | Normal(50, 15), N=1000 | 50 | Customer satisfaction |
| Quality Inspection | Binomial(0.02), N=10000 | 200 | Defect rate |
| Performance Benchmark | Exponential(100), N=5000 | 100 | Response times |
| Election Poll | Binomial(0.52), N=1000000 | 1000 | Voter preference |
| A/B Test | Binomial(0.05), N=50000 | 5000 | Conversion rate |

---

## Math Utilities

### `src/utils/math/sampling.ts`

```typescript
// ============== Types ==============

export type SamplingMethod = 'simple' | 'stratified' | 'systematic' | 'cluster';

export interface PopulationConfig {
  size: number;
  distribution: 'normal' | 'uniform' | 'binomial' | 'exponential';
  params: Record<string, number>;
}

export interface SampleResult {
  indices: number[];
  values: number[];
  mean: number;
  standardDeviation: number;
  standardError: number;
}

export interface StratumConfig {
  name: string;
  proportion: number;
  values: number[];
}

// ============== Population Generation ==============

export function generatePopulation(config: PopulationConfig): number[];

// ============== Sampling Functions ==============

export function simpleRandomSample(
  population: number[],
  sampleSize: number
): SampleResult;

export function stratifiedSample(
  strata: StratumConfig[],
  sampleSize: number,
  proportional?: boolean
): SampleResult;

export function systematicSample(
  population: number[],
  sampleSize: number,
  randomStart?: boolean
): SampleResult;

export function clusterSample(
  population: number[],
  clusterSize: number,
  numClusters: number
): SampleResult;

// ============== Standard Error ==============

// SE for mean: s / sqrt(n)
export function standardErrorMean(sampleStdDev: number, sampleSize: number): number;

// SE for proportion: sqrt(p(1-p)/n)
export function standardErrorProportion(proportion: number, sampleSize: number): number;

// Finite population correction
export function finitePopulationCorrection(n: number, N: number): number;

// ============== Confidence Intervals ==============

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  pointEstimate: number;
  marginOfError: number;
  confidenceLevel: number;
}

// CI for mean (t-distribution based)
export function confidenceIntervalMean(
  sampleMean: number,
  sampleStdDev: number,
  sampleSize: number,
  confidenceLevel?: number  // default 0.95
): ConfidenceInterval;

// CI for proportion (normal approximation)
export function confidenceIntervalProportion(
  successes: number,
  sampleSize: number,
  confidenceLevel?: number
): ConfidenceInterval;

// ============== Bootstrap ==============

export interface BootstrapResult {
  bootstrapMeans: number[];
  standardError: number;
  percentileCI: ConfidenceInterval;
  biasCorrectedCI?: ConfidenceInterval;
}

export function bootstrap(
  sample: number[],
  iterations: number,
  statistic?: (data: number[]) => number,  // default: mean
  confidenceLevel?: number
): BootstrapResult;

// Single bootstrap resample
export function bootstrapResample(sample: number[]): number[];

// ============== Sample Size Calculation ==============

// Sample size for mean estimation
export function sampleSizeForMean(
  marginOfError: number,
  populationStdDev: number,
  confidenceLevel?: number
): number;

// Sample size for proportion estimation
export function sampleSizeForProportion(
  marginOfError: number,
  expectedProportion?: number,  // default 0.5 (conservative)
  confidenceLevel?: number
): number;

// Sample size for power (comparing two means)
export function sampleSizeForPower(
  effectSize: number,
  standardDeviation: number,
  power?: number,      // default 0.8
  alpha?: number       // default 0.05
): number;

// ============== Utilities ==============

// t-distribution critical value (for CI)
export function tCriticalValue(degreesOfFreedom: number, alpha: number): number;

// z-critical value
export function zCriticalValue(alpha: number): number;
```

**Test Coverage Target**: 80+ tests

Key test scenarios:
- Sample sizes match requested
- Stratified preserves proportions
- Systematic spacing correct
- Bootstrap CI contains true mean (simulation)
- Standard error formula verified
- Sample size calculations round correctly

---

## Content Structure

### Sampling & Estimation Page
`/statistics/sampling` - `SamplingView.vue`

**Sections**:

1. **Introduction** (expanded)
   - "You can't measure everyone, so you measure some"
   - Population vs sample terminology
   - Three analogies block

2. **Why Sample?** (expanded)
   - Cost, time, feasibility constraints
   - Destructive testing example
   - Big data sampling necessity

3. **Widget: SamplingSimulator** (expanded)
   - Full interactive widget

4. **Sampling Methods** (expanded)
   - Simple random (gold standard)
   - Stratified (ensure representation)
   - Systematic (every kth)
   - Cluster (practical constraints)
   - When to use each

5. **Sampling Distribution** (expanded)
   - Sample statistics vary!
   - Standard error concept
   - Central Limit Theorem connection (from Phase 17)

6. **Point vs Interval Estimation** (expanded)
   - Point estimate: single number
   - Interval estimate: range with confidence
   - Why intervals are more honest

7. **Confidence Intervals** (expanded)
   - What 95% confidence really means
   - CI coverage demonstration
   - Common misconceptions

8. **Bootstrap Method** (collapsed)
   - Resampling philosophy
   - Percentile method
   - When bootstrap helps

9. **Sample Size Determination** (collapsed)
   - The √n relationship
   - Margin of error targets
   - Power considerations preview

10. **Common Pitfalls** (collapsed)
    - Selection bias
    - Survivorship bias
    - Convenience sampling dangers
    - "Larger is always better" myth

11. **In Python** (collapsed)
    - `random.sample()`, `numpy.random.choice()`
    - `scipy.stats` for CI
    - Bootstrap with `sklearn`

12. **Related Topics**
    - Probability Distributions (prerequisite)
    - Hypothesis Testing (next)
    - Descriptive Statistics (foundation)

---

## Increments

### Increment 18A: Sampling Math Utilities (~75 min)

**Tasks**:
1. Create `src/utils/math/sampling.ts`
2. Implement population generation
3. Implement all 4 sampling methods
4. Implement standard error functions
5. Implement confidence interval functions
6. Implement t-critical and z-critical value functions
7. Create `src/utils/math/sampling.test.ts` (60+ tests)

**Files**:
- `src/utils/math/sampling.ts` (new)
- `src/utils/math/sampling.test.ts` (new)

**Success Criteria**:
- All 60+ tests pass
- Sampling methods produce correct sizes
- CI formulas match known values
- Critical values accurate

---

### Increment 18B: Bootstrap Utilities (~45 min)

**Tasks**:
1. Implement bootstrap resampling function
2. Implement bootstrap confidence interval (percentile method)
3. Implement sample size calculation functions
4. Add to sampling.ts or create bootstrap.ts
5. Create tests (20+ tests)

**Files**:
- `src/utils/math/sampling.ts` (extend) or `src/utils/math/bootstrap.ts` (new)
- Tests

**Success Criteria**:
- Bootstrap CI coverage verified via simulation
- Sample size formulas match textbook values
- Resampling produces correct size samples

---

### Increment 18C: Sampling Composable & State (~45 min)

**Tasks**:
1. Create `src/composables/useSamplingSimulator.ts`
2. Implement population state management
3. Implement sampling method switching
4. Implement sample collection history
5. Implement URL state sync for key parameters
6. Create tests for composable

**Files**:
- `src/composables/useSamplingSimulator.ts` (new)
- `src/composables/useSamplingSimulator.test.ts` (new)

**Success Criteria**:
- State management correct
- History tracks multiple samples
- URL state syncs key parameters
- Presets load correctly

---

### Increment 18D: SamplingSimulator Widget - Core (~90 min)

**Tasks**:
1. Create widget component structure (10 files)
2. Implement PopulationGrid (visual representation)
3. Implement SamplingMethodSelector (method tabs)
4. Implement SampleSizeControls (slider + input)
5. Implement SamplingDistribution (histogram of sample means)
6. Implement SamplingResults (statistics display)
7. Implement SamplingPresets
8. Wire up main orchestrator with sampling animation

**Files**:
- `src/components/widgets/SamplingSimulator/*.vue` (10 files)

**Success Criteria**:
- Population grid renders and highlights samples
- All 4 sampling methods work visually
- Sampling distribution builds correctly
- Animation shows sampling process
- Mobile responsive

---

### Increment 18E: CI Demo & Bootstrap Panel (~60 min)

**Tasks**:
1. Implement ConfidenceIntervalDemo
   - CI coverage simulation with visual bars
   - True μ line and capture indication
   - Coverage percentage tracking
2. Implement BootstrapPanel
   - Bootstrap iterations slider
   - Resampling visualization
   - Percentile CI display
3. Implement SampleSizeCalculator
   - Margin of error input
   - Required sample size output

**Files**:
- `src/components/widgets/SamplingSimulator/ConfidenceIntervalDemo.vue`
- `src/components/widgets/SamplingSimulator/BootstrapPanel.vue`
- `src/components/widgets/SamplingSimulator/SampleSizeCalculator.vue`

**Success Criteria**:
- CI coverage demo shows ~95% capture rate
- Bootstrap produces reasonable intervals
- Sample size calculator gives sensible values
- All panels toggle correctly

---

### Increment 18F: Content Page (~60 min)

**Tasks**:
1. Create `src/views/statistics/SamplingView.vue`
2. Write content sections with three analogies
3. Add code examples for sampling methods
4. Add common pitfalls callout
5. Update `src/router/index.ts` with route
6. Update `src/data/navigation.ts` with subtopic
7. Update StatisticsIndexView.vue

**Files**:
- `src/views/statistics/SamplingView.vue` (new)
- `src/router/index.ts`
- `src/data/navigation.ts`
- `src/views/statistics/StatisticsIndexView.vue`

**Success Criteria**:
- Navigation works
- Content renders properly
- Widget integrated
- Code examples accurate
- Related topics linked

---

### Increment 18G: E2E Tests & Polish (~45 min)

**Tasks**:
1. Create `e2e/statistics/sampling-simulator.spec.ts`
2. Test sampling methods
3. Test sample collection and distribution
4. Test CI demo coverage
5. Test bootstrap panel
6. Test URL state persistence
7. Add accessibility tests
8. Polish: keyboard navigation, focus management

**Files**:
- `e2e/statistics/sampling-simulator.spec.ts` (new)

**Success Criteria**:
- 20+ E2E tests pass
- Accessibility audit passes
- Keyboard navigation works
- Mobile interactions work

---

## Estimated Timeline

| Increment | Time |
|-----------|------|
| 18A: Sampling Math Utilities | 75 min |
| 18B: Bootstrap Utilities | 45 min |
| 18C: Sampling Composable & State | 45 min |
| 18D: SamplingSimulator Widget - Core | 90 min |
| 18E: CI Demo & Bootstrap Panel | 60 min |
| 18F: Content Page | 60 min |
| 18G: E2E Tests & Polish | 45 min |
| **Total** | **~7 hours** |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| t-distribution implementation complexity | Medium | High | Use approximation or lookup table |
| Population grid performance with large N | Medium | Medium | Virtualize or sample representation |
| Bootstrap computation time | Low | Medium | Web Worker or limit iterations |
| Stratified sampling complexity | Medium | Low | Start with 2-3 strata, not arbitrary |
| CI coverage demo confusion | Medium | Medium | Clear explanation, interactive |

---

## Connections to Prior Phases

| Connection | Phase | How It Connects |
|------------|-------|-----------------|
| Probability Distributions | 17 | Population generation uses distributions |
| CLT | 17 | Sampling distribution demonstrates CLT |
| Descriptive Statistics | 10 | Mean, std dev, histogram reuse |
| SVG visualization | 7+ | Grid, histogram patterns |

---

## Archive Reference

**Content**: `archive/snake-math/docs/statistics/`
- References to sampling in applications
- No dedicated sampling content (new material)

**Component**: `archive/snake-math/docs/.vitepress/theme/components/StatisticsCalculator.vue`
- Histogram rendering patterns

---

## Post-Phase Updates

After Phase 18 completion, update:
- [ ] `docs/LL_LI.md` - Lessons learned about sampling visualization
- [ ] `docs/DECISIONS.md` - D-140 through D-146
- [ ] `docs/CURRENT_STATE.md` - Phase 18 summary
- [ ] `docs/ROADMAP.md` - Mark Phase 18 complete
- [ ] `docs/TODO.md` - Update Statistics expansion status

---

## Success Metrics

- [ ] All unit tests pass (80+)
- [ ] All E2E tests pass (20+)
- [ ] Accessibility audit passes
- [ ] Widget URL sync works
- [ ] Mobile responsive
- [ ] All 4 sampling methods visualize correctly
- [ ] Sampling distribution converges to normal shape
- [ ] CI coverage demo shows ~95% capture rate
- [ ] Bootstrap produces reasonable intervals
- [ ] Sample size calculator gives sensible values
- [ ] Population grid handles 1000+ items smoothly

---

## Design System Compliance

### Required Content Page Elements (per DESIGN_SYSTEM.md)

1. **TopicPage wrapper** with `title` and `description` props
2. **Three-Analogy Block** (required):
   ```vue
   <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
     <div class="p-4 bg-surface-alt rounded-lg border border-border">
       <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
         <i class="fa-solid fa-users mr-2" aria-hidden="true" />
         Everyday Analogy
       </h4>
       <p class="text-sm text-text-secondary">
         Sampling is like tasting soup — you don't need to drink the whole pot to know if it needs salt
       </p>
     </div>
     <div class="p-4 bg-surface-alt rounded-lg border border-border">
       <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
         <i class="fa-solid fa-code mr-2" aria-hidden="true" />
         Programming Analogy
       </h4>
       <p class="text-sm text-text-secondary">
         Sampling is like profiling — you can't trace every function call, so you sample to estimate behavior
       </p>
     </div>
     <div class="p-4 bg-surface-alt rounded-lg border border-border">
       <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
         <i class="fa-solid fa-chart-bar mr-2" aria-hidden="true" />
         Visual Intuition
       </h4>
       <p class="text-sm text-text-secondary">
         Sample means cluster around the true mean — the histogram of means converges to a bell curve
       </p>
     </div>
   </div>
   ```

3. **Common Pitfall Callout** (required):
   ```vue
   <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
     <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
       <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
       Common Pitfall: Bigger Isn't Always Better
     </p>
     <p class="text-sm text-amber-600 dark:text-amber-400">
       A biased sample of 10,000 is worse than a random sample of 100.
       Selection bias, survivorship bias, and convenience sampling can make
       even large samples misleading. Method matters more than size.
     </p>
   </div>
   ```

4. **CodeExample components** with required props:
   - `id`: Format `statistics-sampling-{descriptor}` (e.g., `statistics-sampling-random`)
   - `title`: Filename style (e.g., `random_sample.py`)

5. **RelatedTopics** at page bottom with 3-4 items including parent index

6. **Collapsible sections**: Primary content expanded, supplementary collapsed

### Navigation Description
Add engaging hook under 60 characters:
```typescript
{
  id: 'sampling',
  title: 'Sampling & Estimation',
  description: 'Measure some, estimate all — with confidence',
  // ...
}
```

### Color Usage
- Use `text-green-700 dark:text-green-400` for capture/success indicators (not green-600)
- Use `text-red-600 dark:text-red-400` for missed/error indicators
- Use semantic color classes for consistency

---

## Applicable Lessons Learned

### From Prior Phases (must apply)

| ID | Lesson | Application in Phase 18 |
|----|--------|-------------------------|
| **LL-015** | URL state sync requires debouncing | Debounce sample size slider updates to URL |
| **LL-019** | Animation timer cleanup | Clean up sampling animation timers on unmount |
| **LL-021** | TypeScript array access returns possibly undefined | Use optional chaining for sample array access |
| **LL-025** | Playwright test selector specificity | Use `exact: true` for method selector tests |
| **LL-026** | WCAG color contrast requirements | Use `text-green-700` for CI capture indicators |
| **LL-031** | Locale-dependent number formatting | Use regex patterns for CI value formatting tests |
| **LL-032** | TypeScript array access after length check | Add explicit `toBeDefined()` assertions for samples |
| **LL-037** | Statistical method variations | Document CI calculation method (t-based vs z-based) |
| **LL-039** | SVG line elements visibility in Playwright | Use `toHaveCount(1)` for CI bar/line assertions |

### Identified Patterns to Apply

| ID | Pattern | Application in Phase 18 |
|----|---------|-------------------------|
| **LI-011** | SVG for data visualizations | Use SVG for population grid and sampling distribution |
| **LI-017** | Preset data as single source of truth | Sampling presets contain population config and parameters |
| **LI-019** | Animation timer cleanup | Sampling animation must clear timers on unmount |
| **LI-022** | Axe-Core for accessibility testing | Include WCAG 2.1 AA audit in E2E tests |
| **LI-023** | Data-testid attributes | Add to population grid, sample indicators, CI bars |
| **LI-024** | Preset-based widget pattern | Use preset architecture for sampling scenarios |
| **LI-033** | Composable for complex widget state | Create `useSamplingSimulator` composable |
| **LI-038** | Composable pattern for statistics state | Follow established statistics composable pattern |
| **LI-039** | Panel-based component architecture | Organize into CI demo, bootstrap, calculator panels |
| **LI-040** | Use toHaveCount for SVG assertions | Apply to population grid and CI visualization tests |

---

## Implementation Checklist (Design System)

Before marking Phase 18 complete, verify:

### Content Page
- [ ] TopicPage wrapper with title/description
- [ ] Three-analogy block with correct colors (amber/emerald/blue)
- [ ] `bg-surface-alt` for analogy card backgrounds
- [ ] Common pitfall callout with amber styling
- [ ] All CodeExample components have `id` and `title` props
- [ ] CodeExample IDs follow format: `statistics-sampling-{descriptor}`
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
- [ ] Population grid virtualized for large N (>500)

### Testing
- [ ] E2E selectors use `data-testid` or `exact: true`
- [ ] SVG element assertions use `toHaveCount(1)` where needed
- [ ] Accessibility audit with axe-core
- [ ] CI calculation tests document which method is used
- [ ] Bootstrap tests verify ~95% coverage over many iterations
