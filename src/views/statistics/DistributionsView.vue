<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import { DistributionExplorer, CLTDemonstration } from '@/components/widgets/DistributionExplorer'

const relatedTopics = [
  {
    title: 'Statistics Overview',
    path: '/statistics',
    description: 'All statistics topics',
  },
  {
    title: 'Descriptive Statistics',
    path: '/statistics/descriptive',
    description: 'Mean, variance, and data summaries',
  },
  {
    title: 'Summation',
    path: '/algebra/summation',
    description: 'The math behind expected values',
  },
  {
    title: 'Functions',
    path: '/basics/functions',
    description: 'Understanding PDF and CDF as functions',
  },
]

// Python code examples
const normalCode = `import numpy as np
from scipy import stats

# Standard Normal Distribution (μ=0, σ=1)
normal = stats.norm(loc=0, scale=1)

# Probability density at x=0
pdf_at_0 = normal.pdf(0)  # 0.3989 (peak of bell curve)

# Cumulative probability P(X ≤ 1.96)
cdf_at_196 = normal.cdf(1.96)  # 0.975 (97.5%)

# Quantile: what x gives P(X ≤ x) = 0.975?
x_975 = normal.ppf(0.975)  # 1.96

# Generate random samples
samples = normal.rvs(size=1000)

# Custom normal: IQ scores (μ=100, σ=15)
iq = stats.norm(loc=100, scale=15)
prob_above_130 = 1 - iq.cdf(130)  # ~2.3% are "gifted"`

const binomialCode = `from scipy import stats

# Binomial: n trials, p probability of success
# Example: 20 coin flips, p=0.5 for fair coin
binom = stats.binom(n=20, p=0.5)

# P(X = 10) - exactly 10 heads
pmf_10 = binom.pmf(10)  # 0.176 (most likely outcome)

# P(X ≤ 10) - at most 10 heads
cdf_10 = binom.cdf(10)  # 0.588

# P(X ≥ 15) - at least 15 heads (rare!)
prob_15_plus = 1 - binom.cdf(14)  # 0.021 (~2%)

# A/B Testing example: 100 visitors, 5% conversion rate
ab_test = stats.binom(n=100, p=0.05)
expected_conversions = ab_test.mean()  # 5`

const poissonCode = `from scipy import stats

# Poisson: events per time/space interval
# Example: λ=10 server requests per second
poisson = stats.poisson(mu=10)

# P(X = 10) - exactly 10 requests
pmf_10 = poisson.pmf(10)  # 0.125

# P(X ≤ 5) - at most 5 requests (light traffic)
prob_light = poisson.cdf(5)  # 0.067

# P(X ≥ 15) - at least 15 requests (spike!)
prob_spike = 1 - poisson.cdf(14)  # 0.083

# Mean and variance are both λ
print(f"Mean: {poisson.mean()}, Var: {poisson.var()}")  # Both 10`

const exponentialCode = `from scipy import stats
import numpy as np

# Exponential: time between events
# λ=0.5 means average wait time = 1/λ = 2 units
# Note: scipy uses scale = 1/λ
exp = stats.expon(scale=2)  # scale = 1/λ = 2

# PDF: highest at x=0, decays exponentially
pdf_0 = exp.pdf(0)  # 0.5

# P(X ≤ 2) - probability within average wait time
prob_within_avg = exp.cdf(2)  # 0.632 (about 63%)

# Memoryless property: P(X > s+t | X > s) = P(X > t)
# "Given you've waited s time, the remaining wait
# distribution is the same as starting fresh!"

# API timeout modeling: 95th percentile wait time
timeout_95 = exp.ppf(0.95)  # ~6 time units`

const uniformCode = `import numpy as np
from scipy import stats

# Continuous Uniform: equal probability in [a, b]
uniform = stats.uniform(loc=0, scale=1)  # [0, 1]

# PDF is constant: 1/(b-a) = 1
pdf_anywhere = uniform.pdf(0.5)  # 1.0

# P(X ≤ 0.5) = 0.5 (linear CDF)
cdf_05 = uniform.cdf(0.5)  # 0.5

# Random number generation
rng = np.random.default_rng(42)
samples = rng.uniform(0, 1, size=1000)

# Monte Carlo simulation example
# Estimate π: random points in unit square
points = 10000
x = rng.uniform(0, 1, points)
y = rng.uniform(0, 1, points)
inside_circle = np.sum(x**2 + y**2 <= 1)
pi_estimate = 4 * inside_circle / points  # ~3.14`

const cltCode = `import numpy as np
import matplotlib.pyplot as plt

# Central Limit Theorem demonstration
# Take samples from ANY distribution, compute means,
# and the distribution of means → Normal!

rng = np.random.default_rng(42)

# Source: highly skewed exponential distribution
source = lambda n: rng.exponential(scale=2, size=n)

# Collect sample means
sample_sizes = [5, 30, 100]
n_samples = 1000

fig, axes = plt.subplots(1, 3, figsize=(12, 4))

for ax, n in zip(axes, sample_sizes):
    means = [source(n).mean() for _ in range(n_samples)]
    ax.hist(means, bins=30, density=True, alpha=0.7)
    ax.set_title(f'Sample size n={n}')
    ax.set_xlabel('Sample Mean')

# As n increases, distribution becomes more normal!
plt.tight_layout()
plt.show()`
</script>

<template>
  <TopicPage
    title="Probability Distributions"
    description="Each distribution is a personality profile for randomness - learn to recognize and use them."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What are Probability Distributions?" icon="fa-solid fa-dice">
        <p class="mb-4">
          A <strong>probability distribution</strong> describes how likely different outcomes are.
          Think of it as a "personality profile" for randomness — each distribution has its own
          characteristic shape and behavior.
        </p>

        <!-- Three analogies block -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-dice mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Distributions are like personality types — each describes a different "style" of randomness.
              Normal is the "average joe," Exponential is "forgetful," Poisson counts "rare events."
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Distributions are like random number generators with different probability profiles.
              <code class="text-xs">random.uniform()</code> vs <code class="text-xs">random.gauss()</code>
              — same interface, different behavior.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-chart-area mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              The shape of the curve tells you where values are likely to fall. Tall peaks mean
              "common," flat areas mean "unlikely," long tails mean "rare but possible."
            </p>
          </div>
        </div>

        <p class="text-text-secondary">
          For programmers, distributions are essential for simulation, A/B testing, ML feature engineering,
          and understanding model outputs.
        </p>
      </ContentSection>

      <!-- Discrete vs Continuous -->
      <ContentSection id="discrete-continuous" title="Discrete vs Continuous" icon="fa-solid fa-arrows-left-right">
        <p class="mb-4">
          The first question to ask about any distribution: <strong>discrete or continuous?</strong>
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-list-ol text-primary mr-2" aria-hidden="true" />
              Discrete Distributions
            </p>
            <p class="text-sm text-text-muted mb-2">
              Countable outcomes: 0, 1, 2, 3... You can ask "P(X = 5)" and get a non-zero answer.
            </p>
            <p class="text-xs text-text-muted">
              <strong>Examples:</strong> Binomial (successes in trials), Poisson (events per interval)
            </p>
            <p class="text-xs text-primary mt-2">
              Uses PMF: <MathBlock formula="P(X = k)" class="inline" />
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-wave-square text-primary mr-2" aria-hidden="true" />
              Continuous Distributions
            </p>
            <p class="text-sm text-text-muted mb-2">
              Infinite precision: any value in a range. P(X = exact value) = 0 — always use intervals!
            </p>
            <p class="text-xs text-text-muted">
              <strong>Examples:</strong> Normal (bell curve), Exponential (wait times), Uniform
            </p>
            <p class="text-xs text-primary mt-2">
              Uses PDF: <MathBlock formula="P(a \leq X \leq b) = \int_a^b f(x)\,dx" class="inline" />
            </p>
          </div>
        </div>

        <div
          class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Confusing Discrete and Continuous
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            For continuous distributions, P(X = exact value) = 0. A normally distributed height can't
            be "exactly 170.000...cm." Always ask P(169.5 ≤ X ≤ 170.5). The PDF value at a point is
            <em>density</em>, not probability!
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Widget -->
      <ContentSection id="explorer" title="Distribution Explorer" icon="fa-solid fa-sliders">
        <p class="mb-4">
          Select a distribution and adjust its parameters to see how the shape changes.
          Try the probability calculator to answer questions like "P(X ≤ 1.96)" for a standard normal.
        </p>

        <DistributionExplorer
          :sync-url="true"
          :show-prob-calc="true"
          :show-histogram="true"
          :show-c-l-t="false"
        />
      </ContentSection>

      <!-- Normal Distribution -->
      <ContentSection
        id="normal"
        title="Normal Distribution (Gaussian)"
        icon="fa-solid fa-bell"
        collapsible
      >
        <p class="mb-4">
          The <strong>normal distribution</strong> is the most important distribution in statistics.
          Its bell-shaped curve appears everywhere — heights, test scores, measurement errors, and
          as the limit of many other distributions (thanks to the Central Limit Theorem).
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <p class="font-medium mb-2">
            <MathBlock formula="f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}" display />
          </p>
          <div class="grid gap-4 md:grid-cols-2 text-sm text-text-muted mt-4">
            <div>
              <p><strong>Parameters:</strong></p>
              <ul class="list-disc list-inside">
                <li><MathBlock formula="\mu" class="inline" /> = mean (center)</li>
                <li><MathBlock formula="\sigma" class="inline" /> = standard deviation (spread)</li>
              </ul>
            </div>
            <div>
              <p><strong>68-95-99.7 Rule:</strong></p>
              <ul class="list-disc list-inside">
                <li>68% within 1σ of μ</li>
                <li>95% within 2σ of μ</li>
                <li>99.7% within 3σ of μ</li>
              </ul>
            </div>
          </div>
        </div>

        <p class="mb-4 text-text-secondary">
          <strong>Z-scores:</strong> Standardize any normal to the standard normal (μ=0, σ=1) using
          <MathBlock formula="z = \frac{x - \mu}{\sigma}" class="inline" />. This lets you use
          standard normal tables or <code>scipy.stats.norm</code>.
        </p>

        <CodeExample
          id="statistics-distributions-normal"
          title="normal_distribution.py"
          language="python"
          :code="normalCode"
        />
      </ContentSection>

      <!-- Binomial Distribution -->
      <ContentSection
        id="binomial"
        title="Binomial Distribution"
        icon="fa-solid fa-coins"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          The <strong>binomial distribution</strong> counts successes in a fixed number of independent
          trials. Think coin flips, A/B test conversions, or quality control inspections.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <p class="font-medium mb-2">
            <MathBlock formula="P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}" display />
          </p>
          <div class="text-sm text-text-muted mt-4">
            <p><strong>Parameters:</strong></p>
            <ul class="list-disc list-inside">
              <li><strong>n</strong> = number of trials</li>
              <li><strong>p</strong> = probability of success on each trial</li>
            </ul>
            <p class="mt-2">
              <strong>Mean:</strong> <MathBlock formula="E[X] = np" class="inline" /> |
              <strong>Variance:</strong> <MathBlock formula="Var(X) = np(1-p)" class="inline" />
            </p>
          </div>
        </div>

        <p class="mb-4 text-text-secondary">
          <strong>Use cases:</strong> A/B testing, click-through rates, defect rates, survey responses
          (yes/no questions).
        </p>

        <CodeExample
          id="statistics-distributions-binomial"
          title="binomial_distribution.py"
          language="python"
          :code="binomialCode"
        />
      </ContentSection>

      <!-- Poisson Distribution -->
      <ContentSection
        id="poisson"
        title="Poisson Distribution"
        icon="fa-solid fa-clock"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          The <strong>Poisson distribution</strong> models the count of events in a fixed interval
          when events occur independently at a constant average rate. Think server requests per second,
          emails per hour, or typos per page.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <p class="font-medium mb-2">
            <MathBlock formula="P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}" display />
          </p>
          <div class="text-sm text-text-muted mt-4">
            <p><strong>Parameter:</strong></p>
            <ul class="list-disc list-inside">
              <li><strong>λ</strong> = average rate (events per interval)</li>
            </ul>
            <p class="mt-2">
              <strong>Mean = Variance = λ</strong> (a unique property!)
            </p>
          </div>
        </div>

        <p class="mb-4 text-text-secondary">
          <strong>Use cases:</strong> Server load, rare event modeling, rate limiting, queuing theory.
        </p>

        <CodeExample
          id="statistics-distributions-poisson"
          title="poisson_distribution.py"
          language="python"
          :code="poissonCode"
        />
      </ContentSection>

      <!-- Exponential Distribution -->
      <ContentSection
        id="exponential"
        title="Exponential Distribution"
        icon="fa-solid fa-hourglass-half"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          The <strong>exponential distribution</strong> models the time between events in a Poisson
          process. It has a unique <em>memoryless property</em>: given you've already waited time s,
          the remaining wait time has the same distribution as if you just started!
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <p class="font-medium mb-2">
            <MathBlock formula="f(x) = \lambda e^{-\lambda x}, \quad x \geq 0" display />
          </p>
          <div class="text-sm text-text-muted mt-4">
            <p><strong>Parameter:</strong></p>
            <ul class="list-disc list-inside">
              <li><strong>λ</strong> = rate (events per time unit)</li>
              <li>Mean wait time = 1/λ</li>
            </ul>
            <p class="mt-2">
              <strong>Mean:</strong> <MathBlock formula="1/\lambda" class="inline" /> |
              <strong>Variance:</strong> <MathBlock formula="1/\lambda^2" class="inline" />
            </p>
          </div>
        </div>

        <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
          <p class="font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Memoryless Property
          </p>
          <p class="text-sm text-blue-600 dark:text-blue-400">
            <MathBlock formula="P(X > s + t \mid X > s) = P(X > t)" class="inline" />
            <br />
            "If you've already waited 5 minutes for a bus with exponential arrivals, your expected
            remaining wait is the same as when you started!" — This is great for retry logic modeling.
          </p>
        </div>

        <CodeExample
          id="statistics-distributions-exponential"
          title="exponential_distribution.py"
          language="python"
          :code="exponentialCode"
        />
      </ContentSection>

      <!-- Uniform Distribution -->
      <ContentSection
        id="uniform"
        title="Uniform Distribution"
        icon="fa-solid fa-equals"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          The <strong>uniform distribution</strong> is the simplest continuous distribution — all
          values in the range are equally likely. It's the foundation of random number generation
          and Monte Carlo methods.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <p class="font-medium mb-2">
            <MathBlock formula="f(x) = \frac{1}{b - a}, \quad a \leq x \leq b" display />
          </p>
          <div class="text-sm text-text-muted mt-4">
            <p><strong>Parameters:</strong></p>
            <ul class="list-disc list-inside">
              <li><strong>a</strong> = lower bound</li>
              <li><strong>b</strong> = upper bound</li>
            </ul>
            <p class="mt-2">
              <strong>Mean:</strong> <MathBlock formula="(a+b)/2" class="inline" /> |
              <strong>Variance:</strong> <MathBlock formula="(b-a)^2/12" class="inline" />
            </p>
          </div>
        </div>

        <p class="mb-4 text-text-secondary">
          <strong>Use cases:</strong> Random number generation, Monte Carlo simulation, hash functions,
          load balancing (random assignment).
        </p>

        <CodeExample
          id="statistics-distributions-uniform"
          title="uniform_distribution.py"
          language="python"
          :code="uniformCode"
        />
      </ContentSection>

      <!-- Central Limit Theorem -->
      <ContentSection id="clt" title="Central Limit Theorem" icon="fa-solid fa-chart-line">
        <p class="mb-4">
          The <strong>Central Limit Theorem (CLT)</strong> is one of the most remarkable results in
          statistics: no matter what shape the original distribution has, the distribution of
          <em>sample means</em> approaches a normal distribution as sample size increases!
        </p>

        <div class="p-4 rounded-lg border border-primary/30 bg-primary/10 mb-4">
          <p class="font-medium text-primary mb-2">
            <i class="fa-solid fa-star mr-2" aria-hidden="true" />
            The CLT Theorem
          </p>
          <p class="text-text-secondary">
            If you take random samples of size <em>n</em> from any distribution with mean μ and
            standard deviation σ, then as <em>n</em> increases:
          </p>
          <MathBlock
            formula="\bar{X} \sim N\left(\mu, \frac{\sigma}{\sqrt{n}}\right)"
            display
            class="my-3"
          />
          <p class="text-sm text-text-muted">
            The sample mean <MathBlock formula="\bar{X}" class="inline" /> is approximately normal
            with mean μ and standard error <MathBlock formula="\sigma/\sqrt{n}" class="inline" />.
          </p>
        </div>

        <p class="mb-4">
          <strong>Why does this matter?</strong> It explains why the normal distribution appears
          everywhere — many real-world quantities are sums or averages of many small independent
          effects. It also justifies using normal-based methods even for non-normal data.
        </p>

        <h4 class="font-semibold mb-3">Interactive CLT Demonstration</h4>
        <p class="mb-4 text-text-secondary">
          Try it yourself: select a source distribution (even highly skewed ones!) and watch the
          sample means converge to a normal distribution.
        </p>

        <CLTDemonstration source-distribution="exponential" :initial-sample-size="30" />

        <div class="mt-6">
          <CodeExample
            id="statistics-distributions-clt"
            title="central_limit_theorem.py"
            language="python"
            :code="cltCode"
          />
        </div>
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
              PDF vs Probability
            </p>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              For continuous distributions, the PDF value f(x) is <em>density</em>, not probability.
              P(X = exact value) = 0. Always compute P(a ≤ X ≤ b) using the CDF.
            </p>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              λ Confusion: Rate vs Scale
            </p>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              In exponential distributions, some libraries use λ (rate), others use scale = 1/λ.
              SciPy's <code>expon</code> uses scale! Always check the documentation.
            </p>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Assuming Normality
            </p>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              Many statistical tests assume normal data. For small samples from non-normal distributions,
              use non-parametric methods or bootstrap. Check your data's distribution first!
            </p>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Independence Assumption
            </p>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              Binomial requires independent trials. Poisson requires independent events. If your data
              has correlation (time series, clustered data), these distributions don't apply directly.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Quick Reference -->
      <ContentSection
        id="reference"
        title="Distribution Quick Reference"
        icon="fa-solid fa-book"
        :default-expanded="false"
        collapsible
      >
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left p-2 text-text-primary">Distribution</th>
                <th class="text-left p-2 text-text-primary">Type</th>
                <th class="text-left p-2 text-text-primary">Parameters</th>
                <th class="text-left p-2 text-text-primary">Use Case</th>
              </tr>
            </thead>
            <tbody class="text-text-secondary">
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Normal</td>
                <td class="p-2">Continuous</td>
                <td class="p-2">μ, σ</td>
                <td class="p-2">Heights, errors, averages</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Binomial</td>
                <td class="p-2">Discrete</td>
                <td class="p-2">n, p</td>
                <td class="p-2">Success counting, A/B tests</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Poisson</td>
                <td class="p-2">Discrete</td>
                <td class="p-2">λ</td>
                <td class="p-2">Event counts, rate limiting</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Exponential</td>
                <td class="p-2">Continuous</td>
                <td class="p-2">λ</td>
                <td class="p-2">Wait times, timeouts</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Uniform</td>
                <td class="p-2">Continuous</td>
                <td class="p-2">a, b</td>
                <td class="p-2">RNG, Monte Carlo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
