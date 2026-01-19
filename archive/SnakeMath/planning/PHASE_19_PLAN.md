# Phase 19: Hypothesis Testing

**Theme**: *The Scientific Method, Formalized*

**Goal**: Build an interactive hypothesis testing simulator that teaches programmers the logic of statistical inference — null hypotheses, p-values, significance, and the trade-offs between Type I and Type II errors — with direct applications to A/B testing and quality assurance.

---

## Strategic Context

Hypothesis testing is the formal framework for data-driven decisions:

| Application | Test Type | What It Answers |
|-------------|-----------|-----------------|
| A/B Testing | Two-proportion z-test | "Is version B really better?" |
| Performance Benchmarks | Two-sample t-test | "Is the new algorithm faster?" |
| Quality Control | One-sample t-test | "Is defect rate within spec?" |
| Feature Rollout | Chi-square | "Does behavior differ by segment?" |
| Anomaly Detection | One-sample z-test | "Is this spike real or random?" |

This phase builds on Phase 17 (Distributions) and Phase 18 (Sampling) to complete the inferential statistics foundation.

---

## Confirmed Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| **D-150** | Four core tests: one-sample t, two-sample t, one-proportion z, two-proportion z | Most common programmer-relevant tests |
| **D-151** | Visual p-value representation (shaded tail area) | Makes abstract concept concrete |
| **D-152** | Interactive Type I/II error demonstration | Critical for understanding trade-offs |
| **D-153** | Power analysis calculator | Practical sample size planning |
| **D-154** | Effect size display alongside p-value | Combat "significant but tiny" problem |
| **D-155** | A/B testing preset with business framing | Most programmer-relevant application |
| **D-156** | Confidence interval duality shown | CI and hypothesis test relationship |

---

## Scope

### In Scope
- **HypothesisTestingSimulator widget**: Interactive test execution and visualization
- **p-value visualization**: Distribution with shaded rejection region
- **Type I/II error demonstration**: Interactive error trade-off explorer
- **Power analysis calculator**: Sample size for desired power
- **Confidence interval display**: Dual relationship with testing
- **Math utilities**: t-test, z-test, chi-square, power analysis
- **Content page**: Hypothesis Testing with programmer framing

### Out of Scope (Future Enhancement)
- ANOVA (multiple group comparison)
- Non-parametric tests (Mann-Whitney, Wilcoxon)
- Multiple comparisons correction (Bonferroni, FDR)
- Bayesian hypothesis testing

---

## Widget Design: HypothesisTestingSimulator

### Architecture

```
src/components/widgets/HypothesisTestingSimulator/
├── HypothesisTestingSimulator.vue  # Main orchestrator
├── TestTypeSelector.vue            # Test type tabs
├── HypothesisSetup.vue             # H₀, H₁ configuration
├── DataInputPanel.vue              # Sample statistics or raw data
├── TestVisualization.vue           # Distribution + p-value shading
├── ResultsPanel.vue                # Test statistic, p-value, decision
├── TypeErrorDemo.vue               # Type I/II error visualization
├── PowerAnalysis.vue               # Power calculator
├── EffectSizeDisplay.vue           # Cohen's d, practical significance
├── TestPresets.vue                 # Quick-select scenarios
└── index.ts
```

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Test Type: [One-sample t] [Two-sample t] [One-prop z] [Two-prop z] │
├─────────────────────────────────────────────────────────────────┤
│  Hypotheses                                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  H₀: μ = 100  (null hypothesis: no effect)                  ││
│  │  H₁: μ ≠ 100  (alternative: there is an effect)             ││
│  │                                                              ││
│  │  Significance level (α): [0.05 ▼]                           ││
│  │  Test type: [Two-tailed ▼]                                  ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Sample Data                                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Sample mean (x̄): [103.5]      Sample size (n): [30]       ││
│  │  Sample std dev (s): [15.2]                                 ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Test Distribution (t-distribution, df=29)                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ░░░░│                ████████                │░░░░         ││
│  │  ░░░░│              ████████████              │░░░░         ││
│  │  ░░░░│            ████████████████            │░░░░         ││
│  │  ░░░░│          ████████████████████          │░░░░         ││
│  │  ────┴──────────────────┬─────────────────────┴────         ││
│  │      -2.04          t=0  │  t=1.26          +2.04           ││
│  │                    observed test statistic    ▲              ││
│  │                                                              ││
│  │  ░░░░ = rejection region (α/2 = 0.025 each tail)            ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Results                                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Test statistic: t = 1.26                                   ││
│  │  p-value: 0.218                                             ││
│  │  Critical value: ±2.04                                      ││
│  │                                                              ││
│  │  Decision: FAIL TO REJECT H₀                                ││
│  │  Interpretation: Insufficient evidence that μ ≠ 100         ││
│  │                                                              ││
│  │  95% CI for μ: [97.8, 109.2]                               ││
│  │  Effect size (Cohen's d): 0.23 (small)                      ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Presets: [A/B Test] [Quality Control] [Drug Trial] [Benchmark]  │
└─────────────────────────────────────────────────────────────────┘
```

### Test Types

| Test | Parameters | Use Case |
|------|------------|----------|
| One-sample t | x̄, s, n, μ₀ | "Is mean different from target?" |
| Two-sample t | x̄₁, s₁, n₁, x̄₂, s₂, n₂ | "Are two group means different?" |
| One-proportion z | successes, n, p₀ | "Is proportion different from target?" |
| Two-proportion z | successes₁, n₁, successes₂, n₂ | "Are two proportions different?" |

### Type I/II Error Demo

```
┌─────────────────────────────────────────────────────────────────┐
│  Type I and Type II Error Visualization                          │
│                                                                  │
│        H₀ True                        H₁ True                    │
│  ┌──────────────────┐           ┌──────────────────┐            │
│  │    ████████      │           │      ████████    │            │
│  │  ████████████░░░░│           │░░░░████████████  │            │
│  │████████████████░░│           │░░████████████████│            │
│  └──────────────────┘           └──────────────────┘            │
│                                                                  │
│  ░░ = Type I Error (α)           ░░ = Type II Error (β)         │
│  "False Positive"                 "False Negative"               │
│  Reject H₀ when true              Fail to reject when false     │
│                                                                  │
│  α = 0.05 ─────●─────────        Effect size: ────●───── 0.5    │
│                                                                  │
│  Power = 1 - β = 0.80                                           │
│  "80% chance of detecting a real effect of this size"           │
│                                                                  │
│  Trade-off: Lower α → Higher β (harder to detect real effects)  │
└─────────────────────────────────────────────────────────────────┘
```

### Power Analysis Calculator

```
┌─────────────────────────────────────────────────────────────────┐
│  Sample Size Calculator (Power Analysis)                         │
│                                                                  │
│  I want to detect:                                               │
│    Effect size (Cohen's d): ───●─── 0.5 (medium)                │
│    Or: Difference of [5] units with σ = [10]                    │
│                                                                  │
│  With:                                                           │
│    Significance level (α): [0.05 ▼]                             │
│    Power (1 - β): ───●─── 0.80                                  │
│    Test type: [Two-tailed ▼]                                    │
│                                                                  │
│  Required sample size: n = 64 per group                         │
│  Total: 128 participants                                         │
│                                                                  │
│  Power Curve:                                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │          ─────────────────────── 1.0                        ││
│  │        ╱                                                     ││
│  │      ╱                           Power                       ││
│  │    ╱                                                         ││
│  │  ╱                                                           ││
│  │ ────────────────────────────────── 0                        ││
│  │  0    20    40    60    80   100  (sample size)             ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Presets

| Name | Test | Parameters | Scenario |
|------|------|------------|----------|
| A/B Test Conversion | Two-prop z | Control: 1000/20000, Treatment: 1100/20000 | Website conversion |
| Quality Control | One-sample t | x̄=2.1, s=0.3, n=50, μ₀=2.0 | Manufacturing spec |
| Drug Trial | Two-sample t | Treatment vs Placebo groups | Clinical trial |
| Performance Benchmark | Two-sample t | Old vs New algorithm times | Speed comparison |
| Survey Response | One-prop z | 520/1000, p₀=0.5 | Opinion poll |

---

## Math Utilities

### `src/utils/math/hypothesis.ts`

```typescript
// ============== Types ==============

export type TestType = 'one-sample-t' | 'two-sample-t' | 'one-proportion-z' | 'two-proportion-z';
export type TailType = 'two-tailed' | 'left-tailed' | 'right-tailed';

export interface HypothesisTestResult {
  testStatistic: number;
  pValue: number;
  criticalValue: number | [number, number];  // single or [lower, upper]
  degreesOfFreedom?: number;
  rejectNull: boolean;
  confidenceInterval: { lower: number; upper: number };
  effectSize?: number;
  effectSizeInterpretation?: 'negligible' | 'small' | 'medium' | 'large';
}

// ============== One-Sample t-Test ==============

export interface OneSampleTTestParams {
  sampleMean: number;
  sampleStdDev: number;
  sampleSize: number;
  nullMean: number;
  alpha?: number;      // default 0.05
  tail?: TailType;     // default 'two-tailed'
}

export function oneSampleTTest(params: OneSampleTTestParams): HypothesisTestResult;

// ============== Two-Sample t-Test ==============

export interface TwoSampleTTestParams {
  mean1: number;
  stdDev1: number;
  n1: number;
  mean2: number;
  stdDev2: number;
  n2: number;
  alpha?: number;
  tail?: TailType;
  equalVariance?: boolean;  // default false (Welch's t-test)
}

export function twoSampleTTest(params: TwoSampleTTestParams): HypothesisTestResult;

// ============== One-Proportion z-Test ==============

export interface OneProportionZTestParams {
  successes: number;
  sampleSize: number;
  nullProportion: number;
  alpha?: number;
  tail?: TailType;
}

export function oneProportionZTest(params: OneProportionZTestParams): HypothesisTestResult;

// ============== Two-Proportion z-Test ==============

export interface TwoProportionZTestParams {
  successes1: number;
  n1: number;
  successes2: number;
  n2: number;
  alpha?: number;
  tail?: TailType;
}

export function twoProportionZTest(params: TwoProportionZTestParams): HypothesisTestResult;

// ============== Effect Size ==============

// Cohen's d for means
export function cohensD(mean1: number, mean2: number, pooledStdDev: number): number;

// Cohen's d interpretation
export function interpretCohensD(d: number): 'negligible' | 'small' | 'medium' | 'large';

// Cohen's h for proportions
export function cohensH(p1: number, p2: number): number;

// ============== Power Analysis ==============

export interface PowerAnalysisParams {
  effectSize: number;
  alpha?: number;      // default 0.05
  power?: number;      // default 0.80
  tail?: TailType;
}

// Required sample size for given power
export function sampleSizeForPowerTTest(params: PowerAnalysisParams): number;

export function sampleSizeForPowerProportionTest(
  p1: number,
  p2: number,
  alpha?: number,
  power?: number
): number;

// Power for given sample size
export function powerForSampleSize(
  effectSize: number,
  sampleSize: number,
  alpha?: number,
  tail?: TailType
): number;

// ============== Distribution Functions ==============

// t-distribution PDF (for visualization)
export function tDistributionPdf(t: number, df: number): number;

// t-distribution CDF
export function tDistributionCdf(t: number, df: number): number;

// t-distribution critical value
export function tCriticalValue(df: number, alpha: number, tail: TailType): number | [number, number];

// ============== Utilities ==============

// Pooled standard deviation (for two-sample)
export function pooledStandardDeviation(s1: number, n1: number, s2: number, n2: number): number;

// Standard error for two-sample t-test
export function standardErrorTwoSample(s1: number, n1: number, s2: number, n2: number): number;

// Welch's degrees of freedom
export function welchDegreesOfFreedom(s1: number, n1: number, s2: number, n2: number): number;
```

**Test Coverage Target**: 80+ tests

Key test scenarios:
- Known p-values match (z=1.96 → p≈0.05 two-tailed)
- Effect size interpretations correct
- Power calculations match tables
- Edge cases: n=1, α=0, etc.
- Two-tailed vs one-tailed relationships

---

## Content Structure

### Hypothesis Testing Page
`/statistics/hypothesis-testing` - `HypothesisTestingView.vue`

**Sections**:

1. **Introduction** (expanded)
   - "The scientific method, formalized"
   - Innocent until proven guilty analogy
   - Three analogies block

2. **The Logic of Hypothesis Testing** (expanded)
   - Null hypothesis (status quo)
   - Alternative hypothesis (what we're testing)
   - Why we can't "prove" H₁, only reject H₀

3. **Widget: HypothesisTestingSimulator** (expanded)
   - Full interactive widget

4. **Understanding p-Values** (expanded)
   - What p-value really means
   - What p-value does NOT mean
   - The 0.05 threshold debate

5. **Type I and Type II Errors** (expanded)
   - False positives (Type I)
   - False negatives (Type II)
   - Trade-off visualization
   - Real-world consequences

6. **Statistical Power** (expanded)
   - Power = 1 - β
   - Sample size relationship
   - Effect size relationship
   - Power analysis calculator

7. **Common Tests** (collapsed)
   - One-sample t-test
   - Two-sample t-test
   - Proportion tests
   - When to use each

8. **Effect Size** (collapsed)
   - Cohen's d interpretation
   - Significant ≠ meaningful
   - Practical significance

9. **Confidence Intervals & Testing** (collapsed)
   - CI contains μ₀ ↔ fail to reject
   - The duality relationship

10. **Common Pitfalls** (collapsed)
    - p-value misinterpretation
    - p-hacking and multiple comparisons
    - Underpowered studies
    - "Not significant" ≠ "no effect"

11. **A/B Testing Application** (collapsed)
    - Business framing
    - Sample size planning
    - When to stop the test

12. **In Python** (collapsed)
    - `scipy.stats.ttest_ind`, `ttest_1samp`
    - `statsmodels` for power analysis
    - Code examples

13. **Related Topics**
    - Probability Distributions (foundation)
    - Sampling & Estimation (CI connection)
    - Correlation & Regression (next)

---

## Increments

### Increment 19A: Hypothesis Testing Math Utilities (~90 min)

**Tasks**:
1. Create `src/utils/math/hypothesis.ts`
2. Implement t-distribution PDF and CDF functions
3. Implement one-sample t-test
4. Implement two-sample t-test (Welch's)
5. Implement one-proportion z-test
6. Implement two-proportion z-test
7. Implement effect size functions (Cohen's d, h)
8. Create `src/utils/math/hypothesis.test.ts` (60+ tests)

**Files**:
- `src/utils/math/hypothesis.ts` (new)
- `src/utils/math/hypothesis.test.ts` (new)

**Success Criteria**:
- All 60+ tests pass
- Known p-values match
- Effect sizes calculated correctly
- Critical values accurate

---

### Increment 19B: Power Analysis Utilities (~45 min)

**Tasks**:
1. Implement sampleSizeForPowerTTest
2. Implement sampleSizeForPowerProportionTest
3. Implement powerForSampleSize
4. Add power curve generation function
5. Create tests (20+ tests)

**Files**:
- `src/utils/math/hypothesis.ts` (extend)
- Tests

**Success Criteria**:
- Power calculations match standard tables
- Sample size formulas verified
- Power curves generate correctly

---

### Increment 19C: Hypothesis Testing Composable & State (~45 min)

**Tasks**:
1. Create `src/composables/useHypothesisTesting.ts`
2. Implement test type switching
3. Implement hypothesis configuration state
4. Implement data input state
5. Implement URL state sync
6. Create tests for composable

**Files**:
- `src/composables/useHypothesisTesting.ts` (new)
- `src/composables/useHypothesisTesting.test.ts` (new)

**Success Criteria**:
- State management correct
- Test type switching preserves relevant data
- URL state syncs key parameters
- Presets load correctly

---

### Increment 19D: HypothesisTestingSimulator Widget - Core (~90 min)

**Tasks**:
1. Create widget component structure (10 files)
2. Implement TestTypeSelector (test type tabs)
3. Implement HypothesisSetup (H₀, H₁ configuration)
4. Implement DataInputPanel (sample statistics input)
5. Implement TestVisualization (distribution + p-value shading)
6. Implement ResultsPanel (test statistic, p-value, decision)
7. Implement TestPresets
8. Wire up main orchestrator

**Files**:
- `src/components/widgets/HypothesisTestingSimulator/*.vue` (10 files)

**Success Criteria**:
- All 4 test types work correctly
- p-value shading accurate
- Results display clearly
- Presets load correctly
- Mobile responsive

---

### Increment 19E: Type Error Demo & Power Analysis (~60 min)

**Tasks**:
1. Implement TypeErrorDemo
   - Two overlapping distributions
   - α slider affecting Type I region
   - Effect size slider affecting overlap
   - Power display
2. Implement PowerAnalysis panel
   - Effect size input
   - Power slider
   - Sample size calculator
   - Power curve visualization
3. Implement EffectSizeDisplay
   - Cohen's d/h calculation
   - Interpretation badge

**Files**:
- `src/components/widgets/HypothesisTestingSimulator/TypeErrorDemo.vue`
- `src/components/widgets/HypothesisTestingSimulator/PowerAnalysis.vue`
- `src/components/widgets/HypothesisTestingSimulator/EffectSizeDisplay.vue`

**Success Criteria**:
- Type I/II error visualization clear
- Power analysis calculator accurate
- Effect size interpretation correct
- Trade-offs visible when adjusting sliders

---

### Increment 19F: Content Page (~60 min)

**Tasks**:
1. Create `src/views/statistics/HypothesisTestingView.vue`
2. Write content sections with three analogies
3. Add code examples for each test type
4. Add common pitfalls callout (especially p-value misinterpretation)
5. Update `src/router/index.ts` with route
6. Update `src/data/navigation.ts` with subtopic
7. Update StatisticsIndexView.vue

**Files**:
- `src/views/statistics/HypothesisTestingView.vue` (new)
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

### Increment 19G: E2E Tests & Polish (~45 min)

**Tasks**:
1. Create `e2e/statistics/hypothesis-testing.spec.ts`
2. Test all 4 test types
3. Test hypothesis configuration
4. Test data input and results
5. Test Type error demo
6. Test power analysis
7. Test URL state persistence
8. Add accessibility tests
9. Polish: keyboard navigation, focus management

**Files**:
- `e2e/statistics/hypothesis-testing.spec.ts` (new)

**Success Criteria**:
- 20+ E2E tests pass
- Accessibility audit passes
- Keyboard navigation works
- Mobile interactions work

---

## Estimated Timeline

| Increment | Time |
|-----------|------|
| 19A: Hypothesis Testing Math Utilities | 90 min |
| 19B: Power Analysis Utilities | 45 min |
| 19C: Hypothesis Testing Composable & State | 45 min |
| 19D: HypothesisTestingSimulator Widget - Core | 90 min |
| 19E: Type Error Demo & Power Analysis | 60 min |
| 19F: Content Page | 60 min |
| 19G: E2E Tests & Polish | 45 min |
| **Total** | **~7.25 hours** |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| t-distribution CDF accuracy | Medium | High | Use well-tested approximation |
| Welch's df formula complexity | Low | Medium | Implement and test carefully |
| p-value visualization confusion | Medium | Medium | Clear labels and explanations |
| Power analysis accuracy | Medium | Medium | Verify against published tables |
| Misconception reinforcement | Medium | High | Emphasize correct interpretation |

---

## Connections to Prior Phases

| Connection | Phase | How It Connects |
|------------|-------|-----------------|
| Probability Distributions | 17 | t-distribution, normal distribution |
| Sampling & Estimation | 18 | Confidence intervals, standard error |
| Trigonometry | 15 | None direct |
| SVG visualization | 7+ | Distribution curves, shading |

---

## Archive Reference

**Content**: `archive/snake-math/docs/statistics/probability/applications.md`
- A/B testing examples
- Business applications

**Component**: References in PLAN_CONTENT.md
- HypothesisTestLab concept

---

## Post-Phase Updates

After Phase 19 completion, update:
- [ ] `docs/LL_LI.md` - Lessons learned about hypothesis testing visualization
- [ ] `docs/DECISIONS.md` - D-150 through D-156
- [ ] `docs/CURRENT_STATE.md` - Phase 19 summary
- [ ] `docs/ROADMAP.md` - Mark Phase 19 complete
- [ ] `docs/TODO.md` - Update Statistics expansion status

---

## Success Metrics

- [ ] All unit tests pass (80+)
- [ ] All E2E tests pass (20+)
- [ ] Accessibility audit passes
- [ ] Widget URL sync works
- [ ] Mobile responsive
- [ ] All 4 test types work correctly
- [ ] p-value visualization accurate and clear
- [ ] Type I/II error trade-off visible
- [ ] Power analysis calculator matches published values
- [ ] Effect size interpretation correct
- [ ] A/B testing preset demonstrates real-world usage
- [ ] Common misconceptions addressed in content

---

## Design System Compliance

This phase **must** adhere to patterns documented in `docs/DESIGN_SYSTEM.md`.

### Three-Analogy Block (Required)

Every content page requires a three-analogy block with amber/emerald/blue colors:

```vue
<div class="grid md:grid-cols-3 gap-4 my-6">
  <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
    <h4 class="font-semibold text-amber-800 dark:text-amber-200">🧑‍⚖️ Legal Trial</h4>
    <p class="text-sm text-amber-700 dark:text-amber-300">
      H₀ = "innocent until proven guilty." We don't prove innocence; we fail to find enough evidence of guilt.
    </p>
  </div>
  <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
    <h4 class="font-semibold text-emerald-800 dark:text-emerald-200">🔬 Unit Testing</h4>
    <p class="text-sm text-emerald-700 dark:text-emerald-300">
      H₀ = "code works correctly." A failing test (reject H₀) means we found a bug; passing tests don't prove bug-free code.
    </p>
  </div>
  <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
    <h4 class="font-semibold text-blue-800 dark:text-blue-200">🎯 Spam Filter</h4>
    <p class="text-sm text-blue-700 dark:text-blue-300">
      Type I error = marking real email as spam. Type II error = letting spam through. You choose which mistake is worse!
    </p>
  </div>
</div>
```

### Common Pitfall Callout (Required)

```vue
<div class="my-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
  <h4 class="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
    <span>⚠️</span> p-value Misconception
  </h4>
  <p class="text-amber-700 dark:text-amber-300 mt-2">
    p = 0.03 does NOT mean "3% chance the null hypothesis is true." It means "if H₀ were true,
    there's a 3% chance of seeing data this extreme." The difference is crucial!
  </p>
</div>
```

### CodeExample Component Requirements

All code examples must include `id` and `title` props:

```vue
<CodeExample
  id="hypothesis-scipy-example"
  title="Hypothesis Testing with SciPy"
  language="python"
  :code="pythonExample"
/>
```

### RelatedTopics Component

Must link to at least 2 related topics:

```vue
<RelatedTopics :topics="[
  { path: '/statistics/distributions', title: 'Probability Distributions', description: 'Foundation for test statistics' },
  { path: '/statistics/sampling', title: 'Sampling & Estimation', description: 'Confidence intervals and standard error' },
  { path: '/statistics/correlation', title: 'Correlation & Regression', description: 'Next step: relationships between variables' }
]" />
```

### Navigation Description Format

For `navigation.ts`, descriptions must be:
- 6-10 words
- Focus on programmer benefit
- Format: "Action + topic + benefit"

Example: `"Master statistical significance for A/B testing decisions"`

### Color Usage Rules

- Use semantic Tailwind classes (amber/emerald/blue for analogies)
- Never use `green-600` for text (use `green-700` for WCAG AA compliance)
- Widget controls: use neutral grays with accent colors for active states

---

## Applicable Lessons Learned

The following lessons from `docs/LL_LI.md` apply to Phase 19:

### Critical for This Phase

| ID | Lesson | Application in Phase 19 |
|----|--------|-------------------------|
| **LL-015** | KaTeX rendering in reactive context | Distribution curves with math annotations need careful KaTeX lifecycle management |
| **LL-019** | Touch interactions need larger targets | p-value sliders and α adjustment sliders need 44×44px minimum touch targets |
| **LL-021** | Formula simplification over precision | Show simplified t-statistic formula first, defer exact formula to expandable |
| **LL-024** | E2E tests need data-testid | Add `data-testid` to HypothesisTestingSimulator controls for reliable testing |
| **LL-025** | Component hydration timing | Ensure t-distribution visualization loads after composable state is ready |

### Patterns to Follow

| ID | Pattern | Application in Phase 19 |
|----|---------|-------------------------|
| **LI-012** | URL state sync pattern | Sync test type, α, sample stats to URL for shareable hypothesis tests |
| **LI-015** | Debounced input pattern | Use 300ms debounce on sample statistic inputs before recalculating |
| **LI-019** | Progressive disclosure | Show basic test result first, expand for confidence interval, effect size |
| **LI-025** | SVG visualization pattern | Use SVG for t-distribution with rejection region shading |
| **LI-031** | Preset-based widget architecture | Implement A/B test, quality control, benchmark presets |

### Testing Lessons

| ID | Lesson | Application in Phase 19 |
|----|--------|-------------------------|
| **LL-031** | Mathematical edge cases | Test df=1, df=∞, p=0, p=1, α=0.01, α=0.10 edge cases |
| **LL-032** | Statistical precision | Use appropriate epsilon for p-value comparisons (1e-4) |
| **LL-037** | Accessibility in visualizations | Ensure rejection region colors have sufficient contrast |
| **LL-039** | Animation performance | Power curve animation should use requestAnimationFrame |

---

## Implementation Checklist

Before marking any increment complete, verify:

### Content Page
- [ ] Three-analogy block present with correct colors
- [ ] Common pitfall callout present (p-value misconception)
- [ ] All CodeExample components have `id` and `title` props
- [ ] RelatedTopics links to at least 2 topics
- [ ] Navigation description is 6-10 words, action-focused

### Widget
- [ ] All interactive elements have `data-testid` attributes
- [ ] Touch targets are minimum 44×44px
- [ ] URL state syncs key parameters with 300ms debounce
- [ ] Presets work correctly
- [ ] SVG visualizations use semantic colors

### Testing
- [ ] Unit tests cover edge cases (df=1, extreme p-values)
- [ ] E2E tests use `data-testid` selectors
- [ ] Accessibility audit passes (axe-core)
- [ ] Mathematical precision verified (epsilon comparisons)
