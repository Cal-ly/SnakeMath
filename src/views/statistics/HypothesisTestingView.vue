<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import { HypothesisTestingSimulator } from '@/components/widgets/HypothesisTestingSimulator'

const relatedTopics = [
  {
    title: 'Statistics Overview',
    path: '/statistics',
    description: 'All statistics topics',
  },
  {
    title: 'Probability Distributions',
    path: '/statistics/distributions',
    description: 'PDF, CDF, and the t-distribution',
  },
  {
    title: 'Sampling & Estimation',
    path: '/statistics/sampling',
    description: 'Confidence intervals and standard error',
  },
  {
    title: 'Descriptive Statistics',
    path: '/statistics/descriptive',
    description: 'Mean, variance, and data summaries',
  },
]

// Python code examples
const oneSampleTTestCode = `import numpy as np
from scipy import stats

# Sample data: response times for new feature
new_feature_times = [95, 102, 98, 105, 91, 103, 97, 99, 94, 101,
                     96, 100, 93, 98, 104, 92, 99, 97, 106, 95,
                     100, 98, 102, 96, 99, 94, 101, 97, 103, 98]

# Test: Is mean response time different from target of 100ms?
hypothesized_mean = 100

# Perform one-sample t-test
t_stat, p_value = stats.ttest_1samp(new_feature_times, hypothesized_mean)

# Effect size (Cohen's d)
sample_mean = np.mean(new_feature_times)
sample_std = np.std(new_feature_times, ddof=1)
cohens_d = (sample_mean - hypothesized_mean) / sample_std

print(f"Sample mean: {sample_mean:.2f} ms")
print(f"t-statistic: {t_stat:.3f}")
print(f"p-value: {p_value:.4f}")
print(f"Cohen's d: {cohens_d:.3f}")

# Decision at alpha = 0.05
alpha = 0.05
if p_value < alpha:
    print("Reject H₀: Response time differs from 100ms")
else:
    print("Fail to reject H₀: No significant difference from 100ms")`

const twoSampleTTestCode = `import numpy as np
from scipy import stats

# A/B Test: Click-through rates (transformed to appropriate metric)
control = [4.2, 3.8, 4.5, 4.1, 3.9, 4.3, 4.0, 4.4, 3.7, 4.2,
           4.1, 3.9, 4.0, 4.3, 3.8, 4.2, 4.1, 3.9, 4.4, 4.0]
treatment = [4.6, 4.3, 4.8, 4.5, 4.2, 4.7, 4.4, 4.9, 4.1, 4.6,
             4.5, 4.3, 4.4, 4.7, 4.2, 4.6, 4.5, 4.3, 4.8, 4.4]

# Welch's t-test (doesn't assume equal variances)
t_stat, p_value = stats.ttest_ind(control, treatment, equal_var=False)

# Effect size (Cohen's d with pooled SD)
n1, n2 = len(control), len(treatment)
mean1, mean2 = np.mean(control), np.mean(treatment)
var1, var2 = np.var(control, ddof=1), np.var(treatment, ddof=1)
pooled_std = np.sqrt(((n1-1)*var1 + (n2-1)*var2) / (n1+n2-2))
cohens_d = (mean2 - mean1) / pooled_std

print(f"Control mean: {mean1:.2f}, Treatment mean: {mean2:.2f}")
print(f"t-statistic: {t_stat:.3f}")
print(f"p-value: {p_value:.6f}")
print(f"Cohen's d: {cohens_d:.3f}")

# Confidence interval for the difference
from scipy.stats import t
se = np.sqrt(var1/n1 + var2/n2)
df = ((var1/n1 + var2/n2)**2) / ((var1/n1)**2/(n1-1) + (var2/n2)**2/(n2-1))
t_crit = t.ppf(0.975, df)
ci = (mean2 - mean1 - t_crit*se, mean2 - mean1 + t_crit*se)
print(f"95% CI for difference: ({ci[0]:.3f}, {ci[1]:.3f})")`

const proportionTestCode = `import numpy as np
from scipy import stats
from statsmodels.stats.proportion import proportions_ztest, proportion_confint

# A/B Test: Conversion rates
# Control: 450 conversions out of 10,000 visitors (4.5%)
# Treatment: 520 conversions out of 10,000 visitors (5.2%)
successes = np.array([450, 520])
n_obs = np.array([10000, 10000])

# Two-proportion z-test
z_stat, p_value = proportions_ztest(successes, n_obs, alternative='two-sided')

# Proportions
p1, p2 = successes / n_obs
diff = p2 - p1

# Cohen's h effect size
def cohens_h(p1, p2):
    return 2 * (np.arcsin(np.sqrt(p2)) - np.arcsin(np.sqrt(p1)))

h = cohens_h(p1, p2)

print(f"Control: {p1:.2%}, Treatment: {p2:.2%}")
print(f"Difference: {diff:.2%}")
print(f"z-statistic: {z_stat:.3f}")
print(f"p-value: {p_value:.4f}")
print(f"Cohen's h: {h:.3f}")

# Confidence interval for the difference
pooled_p = (successes[0] + successes[1]) / (n_obs[0] + n_obs[1])
se = np.sqrt(pooled_p * (1 - pooled_p) * (1/n_obs[0] + 1/n_obs[1]))
ci = (diff - 1.96 * se, diff + 1.96 * se)
print(f"95% CI for difference: ({ci[0]:.2%}, {ci[1]:.2%})")`

const powerAnalysisCode = `import numpy as np
from scipy import stats

def calculate_power(effect_size, n, alpha=0.05, test_type='two-sample'):
    """Calculate statistical power for a t-test."""
    if test_type == 'one-sample':
        noncentrality = effect_size * np.sqrt(n)
        df = n - 1
    else:  # two-sample
        noncentrality = effect_size * np.sqrt(n / 2)
        df = 2 * n - 2

    t_crit = stats.t.ppf(1 - alpha/2, df)
    # Power = P(|T| > t_crit | H1)
    power = 1 - stats.nct.cdf(t_crit, df, noncentrality) + \\
            stats.nct.cdf(-t_crit, df, noncentrality)
    return power

def sample_size_for_power(effect_size, power=0.8, alpha=0.05):
    """Find sample size needed for desired power (two-sample t-test)."""
    z_alpha = stats.norm.ppf(1 - alpha/2)
    z_beta = stats.norm.ppf(power)
    # Approximate formula
    n = 2 * ((z_alpha + z_beta) / effect_size) ** 2
    return int(np.ceil(n))

# Example: Planning an A/B test
# Want to detect d = 0.3 effect with 80% power
effect_size = 0.3
required_n = sample_size_for_power(effect_size, power=0.8)
print(f"For d = {effect_size}:")
print(f"  Required n per group: {required_n}")
print(f"  Total sample size: {required_n * 2}")

# Power curve
print("\\nPower at various sample sizes:")
for n in [50, 100, 150, 200, 300]:
    power = calculate_power(effect_size, n)
    print(f"  n = {n}: power = {power:.1%}")

# Using statsmodels (more precise)
from statsmodels.stats.power import TTestIndPower
analysis = TTestIndPower()
n_required = analysis.solve_power(effect_size=0.3, power=0.8, alpha=0.05)
print(f"\\nstatsmodels: n = {n_required:.1f} per group")`
</script>

<template>
  <TopicPage
    title="Hypothesis Testing"
    description="The scientific method, formalized — make decisions with quantified uncertainty."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is Hypothesis Testing?" icon="fa-solid fa-scale-balanced" collapsible>
        <p class="mb-4">
          <strong>Hypothesis testing</strong> is a framework for making decisions based on data.
          You start with a default assumption (null hypothesis), collect data, and decide whether
          the evidence is strong enough to reject that default.
        </p>

        <!-- Three analogies block -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 class="font-semibold text-amber-700 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-gavel mr-2" aria-hidden="true" />
              Legal Trial Analogy
            </h4>
            <p class="text-sm text-amber-600 dark:text-amber-300">
              H₀: "Innocent until proven guilty." You need sufficient evidence to reject the presumption of innocence.
              Failing to convict doesn't prove innocence — just insufficient evidence.
            </p>
          </div>
          <div class="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <h4 class="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-vial mr-2" aria-hidden="true" />
              Unit Testing Analogy
            </h4>
            <p class="text-sm text-emerald-600 dark:text-emerald-300">
              H₀: "The code works correctly." Each test tries to find evidence (bugs) to reject this.
              Tests passing doesn't prove correctness — just no bugs found yet.
            </p>
          </div>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 class="font-semibold text-blue-700 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-envelope mr-2" aria-hidden="true" />
              Spam Filter Analogy
            </h4>
            <p class="text-sm text-blue-600 dark:text-blue-300">
              H₀: "This email is legitimate." The filter looks for evidence of spam.
              False positive = blocking good email. False negative = spam gets through.
            </p>
          </div>
        </div>

        <!-- Common Pitfall Callout -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded-r-lg">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            The p-value Misconception
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            A p-value is <strong>NOT</strong> the probability that H₀ is true.
            It's the probability of seeing data this extreme (or more) <strong>if H₀ were true</strong>.
            A low p-value means the data is surprising under H₀, not that H₀ is false.
          </p>
        </div>
      </ContentSection>

      <!-- The Logic of Hypothesis Testing -->
      <ContentSection id="logic" title="The Logic of Hypothesis Testing" icon="fa-solid fa-diagram-project" collapsible :default-expanded="false">
        <p class="mb-4">
          Hypothesis testing follows a specific logical structure. Understanding this structure
          helps you interpret results correctly.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-6">
          <ol class="space-y-3">
            <li class="flex items-start gap-3">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white text-sm flex items-center justify-center">1</span>
              <div>
                <strong>State hypotheses:</strong> Define H₀ (null) and H₁ (alternative)
                <div class="text-sm text-text-muted mt-1">
                  H₀: μ = 100 (no effect) vs H₁: μ ≠ 100 (there is an effect)
                </div>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white text-sm flex items-center justify-center">2</span>
              <div>
                <strong>Choose significance level (α):</strong> Typically 0.05
                <div class="text-sm text-text-muted mt-1">
                  This is your tolerance for Type I errors (false positives)
                </div>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white text-sm flex items-center justify-center">3</span>
              <div>
                <strong>Collect data and compute test statistic:</strong>
                <div class="text-sm text-text-muted mt-1">
                  t = (x̄ - μ₀) / (s / √n) for a one-sample t-test
                </div>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white text-sm flex items-center justify-center">4</span>
              <div>
                <strong>Find the p-value:</strong> Probability of this extreme a result if H₀ is true
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white text-sm flex items-center justify-center">5</span>
              <div>
                <strong>Make a decision:</strong>
                <div class="text-sm text-text-muted mt-1">
                  If p &lt; α: Reject H₀ (statistically significant)<br />
                  If p ≥ α: Fail to reject H₀ (not statistically significant)
                </div>
              </div>
            </li>
          </ol>
        </div>

        <div class="p-4 rounded-lg border border-primary/30 bg-primary/10">
          <p class="font-medium text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Key Insight: Asymmetric Logic
          </p>
          <p class="text-text-secondary">
            You can <strong>reject</strong> H₀ (strong evidence against), but you can only
            <strong>fail to reject</strong> H₀ (insufficient evidence). You never "accept" or "prove" H₀ —
            absence of evidence is not evidence of absence.
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Widget -->
      <ContentSection id="explorer" title="Hypothesis Testing Simulator" icon="fa-solid fa-sliders" collapsible>
        <p class="mb-4">
          Explore how hypothesis testing works with real calculations. Try different test types,
          adjust your data, and see how p-values and effect sizes change.
        </p>

        <HypothesisTestingSimulator
          :sync-url="true"
          :show-type-error-demo="true"
          :show-power-analysis="true"
        />
      </ContentSection>

      <!-- P-Values -->
      <ContentSection id="p-values" title="Understanding p-Values" icon="fa-solid fa-percent" collapsible :default-expanded="false">
        <p class="mb-4">
          The <strong>p-value</strong> quantifies how surprised we should be by our data
          if the null hypothesis were true.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <MathBlock
            formula="p = P(\text{data this extreme or more} \mid H_0 \text{ is true})"
            display
          />
        </div>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
            <p class="font-medium text-emerald-600 dark:text-emerald-400 mb-2">Small p-value (e.g., p = 0.01)</p>
            <p class="text-sm text-text-secondary">
              "If H₀ were true, we'd only see data this extreme 1% of the time."
              Strong evidence against H₀ — the data is unlikely under the null hypothesis.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-amber-500/30 bg-amber-500/10">
            <p class="font-medium text-amber-600 dark:text-amber-400 mb-2">Large p-value (e.g., p = 0.35)</p>
            <p class="text-sm text-text-secondary">
              "If H₀ were true, we'd see data like this 35% of the time."
              Weak evidence against H₀ — the data is quite consistent with the null hypothesis.
            </p>
          </div>
        </div>

        <div class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <p class="font-semibold text-red-700 dark:text-red-300 mb-2">
            <i class="fa-solid fa-ban mr-2" aria-hidden="true" />
            What p-Values Are NOT
          </p>
          <ul class="text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
            <li>NOT the probability that H₀ is true</li>
            <li>NOT the probability that H₁ is true</li>
            <li>NOT the probability of making an error</li>
            <li>NOT a measure of effect size or practical importance</li>
          </ul>
        </div>

        <p class="text-text-secondary">
          <strong>Statistical significance ≠ practical importance.</strong>
          With large samples, tiny effects can be "significant." Always report and interpret effect sizes.
        </p>
      </ContentSection>

      <!-- Type I and II Errors -->
      <ContentSection id="errors" title="Type I & II Errors" icon="fa-solid fa-triangle-exclamation" collapsible :default-expanded="false">
        <p class="mb-4">
          Any decision has a chance of being wrong. Understanding these error types helps you
          design better experiments and interpret results appropriately.
        </p>

        <div class="overflow-x-auto mb-6">
          <table class="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead class="bg-bg-secondary">
              <tr>
                <th class="p-3 text-left"></th>
                <th class="p-3 text-center">H₀ is True (Reality)</th>
                <th class="p-3 text-center">H₀ is False (Reality)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-border">
                <td class="p-3 font-medium bg-bg-secondary">Reject H₀</td>
                <td class="p-3 text-center bg-red-500/10 text-red-600 dark:text-red-400">
                  <strong>Type I Error (α)</strong><br />
                  <span class="text-xs">False Positive</span>
                </td>
                <td class="p-3 text-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <strong>Correct! (Power = 1-β)</strong><br />
                  <span class="text-xs">True Positive</span>
                </td>
              </tr>
              <tr class="border-t border-border">
                <td class="p-3 font-medium bg-bg-secondary">Fail to Reject H₀</td>
                <td class="p-3 text-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <strong>Correct! (1-α)</strong><br />
                  <span class="text-xs">True Negative</span>
                </td>
                <td class="p-3 text-center bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <strong>Type II Error (β)</strong><br />
                  <span class="text-xs">False Negative</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
            <p class="font-medium text-red-600 dark:text-red-400 mb-2">
              <i class="fa-solid fa-bell mr-2" aria-hidden="true" />
              Type I Error (False Positive)
            </p>
            <p class="text-sm text-text-secondary mb-2">
              Rejecting H₀ when it's actually true. Like a fire alarm going off when there's no fire.
            </p>
            <ul class="text-sm text-text-muted list-disc list-inside">
              <li>Controlled by choosing α (significance level)</li>
              <li>α = 0.05 means we accept 5% false positive rate</li>
              <li>Lowering α reduces Type I errors but increases Type II</li>
            </ul>
          </div>
          <div class="p-4 rounded-lg border border-amber-500/30 bg-amber-500/10">
            <p class="font-medium text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-bell-slash mr-2" aria-hidden="true" />
              Type II Error (False Negative)
            </p>
            <p class="text-sm text-text-secondary mb-2">
              Failing to reject H₀ when it's actually false. Like missing a real fire.
            </p>
            <ul class="text-sm text-text-muted list-disc list-inside">
              <li>Probability = β</li>
              <li>Reduced by larger samples or larger effect sizes</li>
              <li>Power (1-β) is the ability to detect real effects</li>
            </ul>
          </div>
        </div>

        <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p class="font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <i class="fa-solid fa-balance-scale mr-2" aria-hidden="true" />
            The Tradeoff
          </p>
          <p class="text-sm text-blue-600 dark:text-blue-400">
            You can't minimize both errors simultaneously. Lower α → higher β (and vice versa).
            The solution is to <strong>increase sample size</strong>, which reduces both errors
            by increasing statistical power.
          </p>
        </div>
      </ContentSection>

      <!-- Common Tests -->
      <ContentSection id="tests" title="Common Hypothesis Tests" icon="fa-solid fa-list-check" collapsible :default-expanded="false">
        <p class="mb-4">
          Different scenarios require different tests. Here are the most common ones you'll use.
        </p>

        <div class="space-y-4 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-user text-primary mr-2" aria-hidden="true" />
              One-Sample t-Test
            </p>
            <p class="text-sm text-text-muted mb-2">
              Compare a sample mean to a known or hypothesized value.
            </p>
            <MathBlock formula="t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}" display class="my-2" />
            <p class="text-xs text-text-secondary">
              <strong>Example:</strong> Is our average response time different from the 100ms target?
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-users text-primary mr-2" aria-hidden="true" />
              Two-Sample t-Test (Welch's)
            </p>
            <p class="text-sm text-text-muted mb-2">
              Compare means between two independent groups. Welch's version doesn't assume equal variances.
            </p>
            <MathBlock formula="t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{s_1^2/n_1 + s_2^2/n_2}}" display class="my-2" />
            <p class="text-xs text-text-secondary">
              <strong>Example:</strong> A/B test — is treatment group different from control?
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-percent text-primary mr-2" aria-hidden="true" />
              One-Proportion z-Test
            </p>
            <p class="text-sm text-text-muted mb-2">
              Compare a sample proportion to a hypothesized value.
            </p>
            <MathBlock formula="z = \frac{\hat{p} - p_0}{\sqrt{p_0(1-p_0)/n}}" display class="my-2" />
            <p class="text-xs text-text-secondary">
              <strong>Example:</strong> Is our defect rate different from the 2% industry standard?
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-chart-pie text-primary mr-2" aria-hidden="true" />
              Two-Proportion z-Test
            </p>
            <p class="text-sm text-text-muted mb-2">
              Compare proportions between two groups.
            </p>
            <MathBlock formula="z = \frac{\hat{p}_1 - \hat{p}_2}{\sqrt{\bar{p}(1-\bar{p})(1/n_1 + 1/n_2)}}" display class="my-2" />
            <p class="text-xs text-text-secondary">
              <strong>Example:</strong> A/B test — is conversion rate higher in the new design?
            </p>
          </div>
        </div>

        <CodeExample
          id="statistics-hypothesis-one-sample"
          title="one_sample_ttest.py"
          language="python"
          :code="oneSampleTTestCode"
        />

        <div class="mt-6">
          <CodeExample
            id="statistics-hypothesis-two-sample"
            title="two_sample_ttest.py"
            language="python"
            :code="twoSampleTTestCode"
          />
        </div>

        <div class="mt-6">
          <CodeExample
            id="statistics-hypothesis-proportion"
            title="proportion_test.py"
            language="python"
            :code="proportionTestCode"
          />
        </div>
      </ContentSection>

      <!-- Effect Size -->
      <ContentSection id="effect-size" title="Effect Size" icon="fa-solid fa-ruler" collapsible :default-expanded="false">
        <p class="mb-4">
          <strong>Effect size</strong> measures the magnitude of an effect, independent of sample size.
          Statistical significance tells you IF there's an effect; effect size tells you HOW BIG.
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">Cohen's d (for means)</p>
            <MathBlock formula="d = \frac{\bar{x}_1 - \bar{x}_2}{s_{pooled}}" display />
            <div class="text-sm text-text-muted mt-3">
              <ul class="list-disc list-inside">
                <li>|d| &lt; 0.2: Negligible</li>
                <li>0.2 ≤ |d| &lt; 0.5: Small</li>
                <li>0.5 ≤ |d| &lt; 0.8: Medium</li>
                <li>|d| ≥ 0.8: Large</li>
              </ul>
            </div>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">Cohen's h (for proportions)</p>
            <MathBlock formula="h = 2 \arcsin(\sqrt{p_1}) - 2 \arcsin(\sqrt{p_2})" display />
            <div class="text-sm text-text-muted mt-3">
              <p>Same interpretation guidelines as Cohen's d.</p>
              <p class="mt-1">The arcsine transformation stabilizes variance.</p>
            </div>
          </div>
        </div>

        <div class="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p class="font-semibold text-purple-700 dark:text-purple-300 mb-2">
            <i class="fa-solid fa-star mr-2" aria-hidden="true" />
            Always Report Effect Sizes
          </p>
          <p class="text-sm text-purple-600 dark:text-purple-400">
            With large samples, even tiny, meaningless effects can be "statistically significant."
            Effect size tells you if the effect is <strong>practically meaningful</strong>.
            A 0.001% improvement that's "significant" at p = 0.001 might not be worth the effort.
          </p>
        </div>
      </ContentSection>

      <!-- Power Analysis -->
      <ContentSection id="power" title="Power Analysis" icon="fa-solid fa-bolt" collapsible :default-expanded="false">
        <p class="mb-4">
          <strong>Statistical power</strong> is the probability of detecting a real effect.
          Power analysis helps you determine sample size BEFORE collecting data.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-6">
          <MathBlock formula="\text{Power} = 1 - \beta = P(\text{Reject } H_0 \mid H_0 \text{ is false})" display />
          <p class="text-sm text-text-muted mt-3">
            Typically, we aim for 80% power (β = 0.20). This means we have an 80% chance of
            detecting a real effect if it exists.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-3 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface text-center">
            <p class="font-medium text-text-primary mb-1">Effect Size ↑</p>
            <p class="text-2xl text-emerald-500">→ Power ↑</p>
            <p class="text-xs text-text-muted mt-1">Larger effects are easier to detect</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface text-center">
            <p class="font-medium text-text-primary mb-1">Sample Size ↑</p>
            <p class="text-2xl text-emerald-500">→ Power ↑</p>
            <p class="text-xs text-text-muted mt-1">More data = more precision</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface text-center">
            <p class="font-medium text-text-primary mb-1">Alpha ↑</p>
            <p class="text-2xl text-emerald-500">→ Power ↑</p>
            <p class="text-xs text-text-muted mt-1">But also more false positives</p>
          </div>
        </div>

        <CodeExample
          id="statistics-hypothesis-power"
          title="power_analysis.py"
          language="python"
          :code="powerAnalysisCode"
        />
      </ContentSection>

      <!-- Confidence Interval Duality -->
      <ContentSection
        id="ci-duality"
        title="CI and Hypothesis Test Duality"
        icon="fa-solid fa-arrows-left-right"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Confidence intervals and hypothesis tests are two sides of the same coin.
          A 95% CI contains all values you would NOT reject at α = 0.05.
        </p>

        <div class="p-4 rounded-lg border border-primary/30 bg-primary/10 mb-4">
          <p class="font-medium text-primary mb-2">The Equivalence</p>
          <p class="text-text-secondary">
            If the hypothesized value μ₀ is <strong>inside</strong> the 95% CI → p-value &gt; 0.05 → Fail to reject H₀
            <br />
            If the hypothesized value μ₀ is <strong>outside</strong> the 95% CI → p-value &lt; 0.05 → Reject H₀
          </p>
        </div>

        <p class="text-text-secondary">
          <strong>Advantage of CIs:</strong> They give you the whole picture — not just "significant or not"
          but the range of plausible values. Many statisticians prefer reporting CIs over p-values alone.
        </p>
      </ContentSection>

      <!-- Practical Tips -->
      <ContentSection
        id="tips"
        title="Practical Tips"
        icon="fa-solid fa-lightbulb"
        :default-expanded="false"
        collapsible
      >
        <div class="space-y-4">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-1 text-primary mr-2" aria-hidden="true" />
              Plan Sample Size Before Collecting Data
            </p>
            <p class="text-sm text-text-secondary">
              Use power analysis to determine n. Running until you get p &lt; 0.05 is p-hacking
              and inflates false positive rates.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-2 text-primary mr-2" aria-hidden="true" />
              Report Effect Sizes and CIs
            </p>
            <p class="text-sm text-text-secondary">
              p-values alone are insufficient. Always include effect size and confidence intervals
              for practical interpretation.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-3 text-primary mr-2" aria-hidden="true" />
              Consider Multiple Testing Correction
            </p>
            <p class="text-sm text-text-secondary">
              Running 20 tests at α = 0.05 means ~1 false positive expected by chance.
              Use Bonferroni correction (α/k) or control the False Discovery Rate.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-4 text-primary mr-2" aria-hidden="true" />
              Don't Confuse Statistical and Practical Significance
            </p>
            <p class="text-sm text-text-secondary">
              A 0.1% improvement in click rate might be statistically significant with n=1M
              but not worth the engineering effort. Consider the business impact.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-5 text-primary mr-2" aria-hidden="true" />
              Check Assumptions
            </p>
            <p class="text-sm text-text-secondary">
              t-tests assume approximate normality (or n ≥ 30 by CLT). Proportion tests need
              np ≥ 10 and n(1-p) ≥ 10. Violations can invalidate your conclusions.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
