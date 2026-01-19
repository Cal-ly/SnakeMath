<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import { SamplingSimulator } from '@/components/widgets/SamplingSimulator'

const relatedTopics = [
  {
    title: 'Statistics Overview',
    path: '/statistics',
    description: 'All statistics topics',
  },
  {
    title: 'Probability Distributions',
    path: '/statistics/distributions',
    description: 'PDF, CDF, and common distributions',
  },
  {
    title: 'Descriptive Statistics',
    path: '/statistics/descriptive',
    description: 'Mean, variance, and data summaries',
  },
  {
    title: 'Summation',
    path: '/algebra/summation',
    description: 'The math behind sample means',
  },
]

// Python code examples
const simpleRandomCode = `import random
import numpy as np

population = list(range(1, 1001))  # Population of 1000 items

# Python built-in: simple random sample without replacement
sample = random.sample(population, k=50)

# NumPy: more efficient for large populations
pop_array = np.arange(1, 1001)
sample_indices = np.random.choice(len(pop_array), size=50, replace=False)
sample = pop_array[sample_indices]

# Calculate sample statistics
sample_mean = np.mean(sample)
sample_std = np.std(sample, ddof=1)  # ddof=1 for sample std dev
standard_error = sample_std / np.sqrt(len(sample))

print(f"Sample mean: {sample_mean:.2f}")
print(f"Sample std: {sample_std:.2f}")
print(f"Standard error: {standard_error:.2f}")`

const stratifiedCode = `import numpy as np
from sklearn.model_selection import StratifiedKFold

# Population with strata (e.g., user segments)
users = np.array([
    {'id': i, 'segment': 'free' if i < 700 else 'premium'}
    for i in range(1000)
])
segments = np.array(['free'] * 700 + ['premium'] * 300)

# Stratified sampling: proportional representation
def stratified_sample(data, strata, sample_size):
    """Sample proportionally from each stratum."""
    unique_strata = np.unique(strata)
    samples = []

    for stratum in unique_strata:
        # Get indices for this stratum
        mask = strata == stratum
        stratum_indices = np.where(mask)[0]

        # Proportional allocation
        stratum_n = int(sample_size * len(stratum_indices) / len(data))
        sampled_idx = np.random.choice(stratum_indices, stratum_n, replace=False)
        samples.extend(data[sampled_idx])

    return samples

sample = stratified_sample(users, segments, 100)
# Ensures ~70 free, ~30 premium (proportional to population)`

const confidenceIntervalCode = `import numpy as np
from scipy import stats

# Sample data
sample = np.random.normal(loc=100, scale=15, size=50)
n = len(sample)
sample_mean = np.mean(sample)
sample_std = np.std(sample, ddof=1)
standard_error = sample_std / np.sqrt(n)

# 95% Confidence Interval (t-distribution)
confidence_level = 0.95
alpha = 1 - confidence_level
t_critical = stats.t.ppf(1 - alpha/2, df=n-1)

margin_of_error = t_critical * standard_error
ci_lower = sample_mean - margin_of_error
ci_upper = sample_mean + margin_of_error

print(f"Sample mean: {sample_mean:.2f}")
print(f"95% CI: [{ci_lower:.2f}, {ci_upper:.2f}]")
print(f"Margin of error: ±{margin_of_error:.2f}")

# Or use scipy's built-in function
ci = stats.t.interval(confidence_level, df=n-1, loc=sample_mean, scale=standard_error)
print(f"scipy CI: [{ci[0]:.2f}, {ci[1]:.2f}]")`

const bootstrapCode = `import numpy as np

def bootstrap_ci(sample, n_iterations=1000, confidence=0.95):
    """Calculate bootstrap confidence interval for the mean."""
    n = len(sample)
    bootstrap_means = []

    for _ in range(n_iterations):
        # Resample with replacement
        resample = np.random.choice(sample, size=n, replace=True)
        bootstrap_means.append(np.mean(resample))

    # Percentile method for CI
    alpha = (1 - confidence) / 2
    lower_percentile = alpha * 100
    upper_percentile = (1 - alpha) * 100

    ci_lower = np.percentile(bootstrap_means, lower_percentile)
    ci_upper = np.percentile(bootstrap_means, upper_percentile)

    return ci_lower, ci_upper, np.std(bootstrap_means)

# Example usage
sample = np.random.exponential(scale=10, size=30)  # Skewed data!
ci_lower, ci_upper, bootstrap_se = bootstrap_ci(sample, n_iterations=10000)

print(f"Original mean: {np.mean(sample):.2f}")
print(f"Bootstrap 95% CI: [{ci_lower:.2f}, {ci_upper:.2f}]")
print(f"Bootstrap SE: {bootstrap_se:.2f}")`

const sampleSizeCode = `import numpy as np
from scipy import stats

def sample_size_for_mean(margin_of_error, std_dev, confidence=0.95):
    """
    Calculate required sample size for estimating a mean.
    n = (z * sigma / E)^2
    """
    alpha = 1 - confidence
    z = stats.norm.ppf(1 - alpha/2)
    n = (z * std_dev / margin_of_error) ** 2
    return int(np.ceil(n))

def sample_size_for_proportion(margin_of_error, p=0.5, confidence=0.95):
    """
    Calculate required sample size for estimating a proportion.
    n = z^2 * p(1-p) / E^2
    p=0.5 gives conservative (largest) estimate.
    """
    alpha = 1 - confidence
    z = stats.norm.ppf(1 - alpha/2)
    n = (z ** 2) * p * (1 - p) / (margin_of_error ** 2)
    return int(np.ceil(n))

# Examples
# Want mean within ±3 units, expect σ≈15
n_mean = sample_size_for_mean(margin_of_error=3, std_dev=15)
print(f"Sample size for mean: {n_mean}")  # ~97

# Want proportion within ±3%, unknown p (use 0.5)
n_prop = sample_size_for_proportion(margin_of_error=0.03)
print(f"Sample size for proportion: {n_prop}")  # ~1068`
</script>

<template>
  <TopicPage
    title="Sampling & Estimation"
    description="Measure some, estimate all — with confidence intervals and bootstrap."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="Why Sampling?" icon="fa-solid fa-users" collapsible>
        <p class="mb-4">
          <strong>Sampling</strong> is how we learn about large populations without measuring everyone.
          When you can't survey all 300 million Americans, you sample 1,000 and make inferences.
          When you can't test every API call, you profile a sample to estimate performance.
        </p>

        <!-- Three analogies block -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-bowl-food mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Sampling is like tasting soup — you stir it well and taste a spoonful.
              You don't need to drink the whole pot to know if it needs salt.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Sampling is like code profiling — you can't trace every function call,
              so you sample to estimate where time is spent. The sample reveals the population's behavior.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-chart-bar mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Picture a large grid of dots. Highlight a random subset — that's your sample.
              The sample's average gets close to the population average as you sample more.
            </p>
          </div>
        </div>

        <!-- Common Pitfall -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Bigger Isn't Always Better
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            A biased sample of 10,000 is worse than a random sample of 100.
            Selection bias, survivorship bias, and convenience sampling can make
            even large samples misleading. <strong>Method matters more than size.</strong>
          </p>
        </div>
      </ContentSection>

      <!-- Population vs Sample -->
      <ContentSection id="population-sample" title="Population vs Sample" icon="fa-solid fa-layer-group" collapsible :default-expanded="false">
        <p class="mb-4">
          The <strong>population</strong> is everything you want to learn about.
          The <strong>sample</strong> is the subset you actually measure.
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-globe text-primary mr-2" aria-hidden="true" />
              Population (N)
            </p>
            <ul class="text-sm text-text-muted list-disc list-inside">
              <li>All items of interest</li>
              <li>Parameters: μ (mean), σ (std dev)</li>
              <li>Usually unknown or impractical to measure</li>
            </ul>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-hand-pointer text-primary mr-2" aria-hidden="true" />
              Sample (n)
            </p>
            <ul class="text-sm text-text-muted list-disc list-inside">
              <li>Subset selected from population</li>
              <li>Statistics: x̄ (sample mean), s (sample std)</li>
              <li>Used to estimate population parameters</li>
            </ul>
          </div>
        </div>

        <p class="text-text-secondary">
          The goal is to make the sample <strong>representative</strong> — statistics from the sample
          should approximate the population parameters. Random sampling is the gold standard because
          every item has an equal chance of selection.
        </p>
      </ContentSection>

      <!-- Interactive Widget -->
      <ContentSection id="explorer" title="Sampling Simulator" icon="fa-solid fa-sliders" collapsible>
        <p class="mb-4">
          Explore how different sampling methods work. Take samples from a population,
          watch the sampling distribution of means emerge, and see confidence intervals in action.
        </p>

        <SamplingSimulator
          :sync-url="true"
          :show-c-i-demo="true"
          :show-bootstrap="true"
          :show-calculator="true"
        />
      </ContentSection>

      <!-- Sampling Methods -->
      <ContentSection id="methods" title="Sampling Methods" icon="fa-solid fa-shuffle" collapsible :default-expanded="false">
        <p class="mb-4">
          Different situations call for different sampling approaches.
          The key is ensuring every item has a known (ideally equal) probability of selection.
        </p>

        <div class="space-y-4 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-dice text-primary mr-2" aria-hidden="true" />
              Simple Random Sampling
            </p>
            <p class="text-sm text-text-muted mb-2">
              Every item has equal probability of selection. The gold standard.
              Use <code>random.sample()</code> or <code>numpy.random.choice(replace=False)</code>.
            </p>
            <p class="text-xs text-text-secondary">
              <strong>Best for:</strong> Homogeneous populations, when you have a complete list.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-layer-group text-primary mr-2" aria-hidden="true" />
              Stratified Sampling
            </p>
            <p class="text-sm text-text-muted mb-2">
              Divide population into subgroups (strata), sample from each proportionally.
              Ensures minority groups are represented.
            </p>
            <p class="text-xs text-text-secondary">
              <strong>Best for:</strong> Heterogeneous populations with known subgroups.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-bars-staggered text-primary mr-2" aria-hidden="true" />
              Systematic Sampling
            </p>
            <p class="text-sm text-text-muted mb-2">
              Select every k-th item after random start. Simple to implement but risky
              if the list has periodic patterns.
            </p>
            <p class="text-xs text-text-secondary">
              <strong>Best for:</strong> Ordered lists with no periodic structure.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-object-group text-primary mr-2" aria-hidden="true" />
              Cluster Sampling
            </p>
            <p class="text-sm text-text-muted mb-2">
              Divide population into clusters, randomly select entire clusters.
              Practical when complete population lists aren't available.
            </p>
            <p class="text-xs text-text-secondary">
              <strong>Best for:</strong> Geographically dispersed populations, cost constraints.
            </p>
          </div>
        </div>

        <CodeExample
          id="statistics-sampling-random"
          title="random_sampling.py"
          language="python"
          :code="simpleRandomCode"
        />

        <div class="mt-6">
          <CodeExample
            id="statistics-sampling-stratified"
            title="stratified_sampling.py"
            language="python"
            :code="stratifiedCode"
          />
        </div>
      </ContentSection>

      <!-- Sampling Distribution & Standard Error -->
      <ContentSection id="sampling-distribution" title="Sampling Distribution & Standard Error" icon="fa-solid fa-chart-line" collapsible :default-expanded="false">
        <p class="mb-4">
          If you took many samples and computed the mean of each, those means would form a distribution
          called the <strong>sampling distribution</strong>. This is the key insight that makes inference possible.
        </p>

        <div class="p-4 rounded-lg border border-primary/30 bg-primary/10 mb-4">
          <p class="font-medium text-primary mb-2">
            <i class="fa-solid fa-star mr-2" aria-hidden="true" />
            Central Limit Theorem Connection
          </p>
          <p class="text-text-secondary">
            No matter the shape of the population, the sampling distribution of means approaches
            a <strong>normal distribution</strong> as sample size increases!
          </p>
          <MathBlock
            formula="\bar{X} \sim N\left(\mu, \frac{\sigma}{\sqrt{n}}\right)"
            display
            class="my-3"
          />
        </div>

        <p class="mb-4">
          The <strong>standard error (SE)</strong> measures how much sample means vary:
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <MathBlock formula="\text{SE} = \frac{s}{\sqrt{n}}" display />
          <p class="text-sm text-text-muted mt-3">
            As n increases, SE decreases — larger samples give more precise estimates.
            <strong>The √n relationship:</strong> to halve your error, you need 4× the sample size!
          </p>
        </div>

        <p class="text-text-secondary">
          In the simulator above, watch the sampling distribution histogram. As you take more samples,
          it converges to a bell shape centered on the true mean μ, with spread determined by the SE.
        </p>
      </ContentSection>

      <!-- Confidence Intervals -->
      <ContentSection id="confidence-intervals" title="Confidence Intervals" icon="fa-solid fa-arrows-left-right-to-line" collapsible :default-expanded="false">
        <p class="mb-4">
          A <strong>confidence interval</strong> gives a range of plausible values for the population
          parameter, not just a single point estimate. It honestly communicates uncertainty.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <p class="font-medium mb-2">95% Confidence Interval for the Mean</p>
          <MathBlock formula="\bar{x} \pm t_{\alpha/2} \cdot \frac{s}{\sqrt{n}}" display />
          <div class="text-sm text-text-muted mt-3">
            <ul class="list-disc list-inside">
              <li><MathBlock formula="\bar{x}" class="inline" /> = sample mean</li>
              <li><MathBlock formula="t_{\alpha/2}" class="inline" /> = t critical value (df = n-1)</li>
              <li><MathBlock formula="s/\sqrt{n}" class="inline" /> = standard error</li>
            </ul>
          </div>
        </div>

        <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
          <p class="font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            What "95% Confidence" Really Means
          </p>
          <p class="text-sm text-blue-600 dark:text-blue-400">
            It does NOT mean "95% probability the true mean is in this interval."
            It means: if we repeated the study many times, 95% of the intervals would contain the true mean.
            <strong>The interval varies, the parameter is fixed.</strong>
          </p>
        </div>

        <p class="mb-4 text-text-secondary">
          Use the CI Coverage simulation in the widget above to see this in action — run 100 CIs
          and watch approximately 95% capture the true mean (vertical red line).
        </p>

        <CodeExample
          id="statistics-sampling-ci"
          title="confidence_interval.py"
          language="python"
          :code="confidenceIntervalCode"
        />
      </ContentSection>

      <!-- Bootstrap Method -->
      <ContentSection
        id="bootstrap"
        title="Bootstrap Method"
        icon="fa-solid fa-repeat"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          The <strong>bootstrap</strong> is a powerful resampling technique that lets you estimate
          the variability of any statistic without making distributional assumptions.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <p class="font-medium mb-2">Bootstrap Algorithm</p>
          <ol class="text-sm text-text-muted list-decimal list-inside space-y-1">
            <li>Start with your sample of n observations</li>
            <li>Draw n observations <strong>with replacement</strong> (bootstrap sample)</li>
            <li>Compute the statistic on the bootstrap sample</li>
            <li>Repeat steps 2-3 many times (e.g., 1000-10000)</li>
            <li>Use percentiles of bootstrap statistics for CI</li>
          </ol>
        </div>

        <p class="mb-4 text-text-secondary">
          <strong>When to use bootstrap:</strong> When your data is skewed, when you're estimating
          a complex statistic (median, ratio, correlation), or when you don't want to assume normality.
        </p>

        <CodeExample
          id="statistics-sampling-bootstrap"
          title="bootstrap.py"
          language="python"
          :code="bootstrapCode"
        />
      </ContentSection>

      <!-- Sample Size Determination -->
      <ContentSection
        id="sample-size"
        title="Sample Size Determination"
        icon="fa-solid fa-calculator"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Before collecting data, determine how large your sample needs to be.
          Sample size depends on desired precision (margin of error), variability (σ), and confidence level.
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">For Estimating a Mean</p>
            <MathBlock formula="n = \left(\frac{z \cdot \sigma}{E}\right)^2" display />
            <p class="text-xs text-text-muted mt-2">
              E = margin of error, σ = population std dev (estimate from pilot)
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">For Estimating a Proportion</p>
            <MathBlock formula="n = \frac{z^2 \cdot p(1-p)}{E^2}" display />
            <p class="text-xs text-text-muted mt-2">
              Use p = 0.5 for conservative (largest) sample size
            </p>
          </div>
        </div>

        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            The √n Tax
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            Because SE = σ/√n, reducing your margin of error by half requires <strong>quadrupling</strong>
            your sample size. Going from ±5% to ±2.5% error means 4× more data collection cost.
          </p>
        </div>

        <CodeExample
          id="statistics-sampling-size"
          title="sample_size.py"
          language="python"
          :code="sampleSizeCode"
        />
      </ContentSection>

      <!-- Common Pitfalls -->
      <ContentSection
        id="pitfalls"
        title="Common Pitfalls"
        icon="fa-solid fa-triangle-exclamation"
        :default-expanded="false"
        collapsible
      >
        <div class="space-y-4">
          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Selection Bias
            </p>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              Surveying only your website visitors misses non-visitors. Sampling only responders
              misses non-response patterns. The "sample" must represent the "population" you care about.
            </p>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Survivorship Bias
            </p>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              Analyzing only successful startups, active users, or soldiers who returned ignores
              the data you're missing. The surviving sample isn't representative of the original population.
            </p>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Convenience Sampling
            </p>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              Surveying your friends, testing on your team's devices, or using easily accessible data
              doesn't generalize. Random sampling is harder but necessary for valid inference.
            </p>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Misinterpreting Confidence Intervals
            </p>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              A 95% CI does NOT mean "95% chance the parameter is in this range."
              It means 95% of similarly constructed intervals would contain the parameter.
              The parameter is fixed; the interval is random.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
