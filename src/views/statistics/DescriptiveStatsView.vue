<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import { StatisticsCalculator } from '@/components/widgets/StatisticsCalculator'

const relatedTopics = [
  {
    title: 'Statistics Overview',
    path: '/statistics',
    description: 'All statistics topics',
    faIcon: 'fa-solid fa-chart-pie',
  },
  {
    title: 'Summation',
    path: '/algebra/summation',
    description: 'The math behind calculating sums',
    faIcon: 'fa-solid fa-plus',
  },
]

// Python code examples
const centralTendencyCode = `import numpy as np
from collections import Counter

data = [85, 92, 78, 96, 88, 73, 91, 84, 79, 95]

# Mean - the arithmetic average
mean = np.mean(data)  # 86.1

# Median - the middle value when sorted
median = np.median(data)  # 86.5

# Mode - the most common value
counter = Counter(data)
mode = counter.most_common(1)[0][0] if counter else None

print(f"Mean: {mean:.1f}")
print(f"Median: {median}")
print(f"Mode: {mode}")`

const spreadCode = `import numpy as np

data = [85, 92, 78, 96, 88, 73, 91, 84, 79, 95]

# Range - difference between max and min
data_range = np.max(data) - np.min(data)  # 23

# Variance - average of squared deviations
variance = np.var(data)           # Population variance
sample_var = np.var(data, ddof=1) # Sample variance (n-1)

# Standard Deviation - square root of variance
std_dev = np.std(data)            # Population std dev
sample_std = np.std(data, ddof=1) # Sample std dev

# IQR - Interquartile Range (Q3 - Q1)
q1, q3 = np.percentile(data, [25, 75])
iqr = q3 - q1

print(f"Range: {data_range}")
print(f"Std Dev: {std_dev:.2f}")
print(f"IQR: {iqr:.2f}")`

const quartilesCode = `import numpy as np

data = [85, 92, 78, 96, 88, 73, 91, 84, 79, 95]

# Quartiles divide data into four parts
q1 = np.percentile(data, 25)   # 25th percentile
q2 = np.percentile(data, 50)   # 50th percentile (median)
q3 = np.percentile(data, 75)   # 75th percentile

# Any percentile
p90 = np.percentile(data, 90)  # 90th percentile

print(f"Q1: {q1}, Q2 (Median): {q2}, Q3: {q3}")
print(f"90th percentile: {p90}")`

const outlierCode = `import numpy as np

def detect_outliers_iqr(data):
    """Detect outliers using the IQR method."""
    q1 = np.percentile(data, 25)
    q3 = np.percentile(data, 75)
    iqr = q3 - q1

    lower_fence = q1 - 1.5 * iqr
    upper_fence = q3 + 1.5 * iqr

    outliers = [x for x in data if x < lower_fence or x > upper_fence]
    return outliers, lower_fence, upper_fence

# Salary data (includes outlier at 120)
salaries = [45, 52, 48, 75, 62, 55, 120, 58, 51, 49, 53, 47]
outliers, lower, upper = detect_outliers_iqr(salaries)

print(f"Fences: [{lower:.1f}, {upper:.1f}]")
print(f"Outliers: {outliers}")  # [120]`

const normalizationCode = `from sklearn.preprocessing import StandardScaler
import numpy as np

# Z-score normalization (standardization)
# Transforms data to have mean ≈ 0 and std ≈ 1
data = np.array([[85], [92], [78], [96], [88]])

scaler = StandardScaler()
normalized = scaler.fit_transform(data)

print(f"Original mean: {data.mean():.1f}, std: {data.std():.2f}")
print(f"Normalized mean: {normalized.mean():.4f}, std: {normalized.std():.4f}")`
</script>

<template>
  <TopicPage
    title="Descriptive Statistics"
    description="Summarizing and understanding data through numbers and visualizations."
  >
    <div class="space-y-8">
      <!-- What are Descriptive Statistics -->
      <ContentSection id="what-is" title="What are Descriptive Statistics?" icon="fa-solid fa-chart-simple">
        <p class="mb-4">
          Descriptive statistics are tools for <strong>summarizing and describing</strong> the main
          features of a dataset. Instead of looking at every individual data point, we use a few
          key numbers to understand the big picture.
        </p>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Three Questions, Three Answers
          </p>
          <div class="text-text-secondary space-y-2">
            <p><strong>1. Central Tendency</strong> — Where is the "center" of the data? (mean, median, mode)</p>
            <p><strong>2. Spread</strong> — How spread out is it? (variance, standard deviation, IQR)</p>
            <p><strong>3. Shape</strong> — What does the distribution look like? (histograms, box plots, skewness)</p>
          </div>
        </div>

        <p class="text-text-secondary">
          For programmers, descriptive statistics are essential for data preprocessing, exploratory
          data analysis, feature engineering, and understanding model outputs.
        </p>
      </ContentSection>

      <!-- Interactive Calculator -->
      <ContentSection id="calculator" title="Interactive Statistics Calculator" icon="fa-solid fa-calculator">
        <p class="mb-4">
          Select a preset dataset or enter your own values to see all the statistics in action.
          Adjust the histogram bins to see how it affects your perception of the data distribution.
        </p>

        <StatisticsCalculator :sync-url="true" />
      </ContentSection>

      <!-- Measures of Central Tendency -->
      <ContentSection
        id="central-tendency"
        title="Measures of Central Tendency"
        icon="fa-solid fa-bullseye"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Central tendency measures tell you where the "middle" of your data is. But "middle" can
          mean different things!
        </p>

        <div class="space-y-4 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <div class="flex items-center gap-2 mb-2">
              <MathBlock formula="\bar{x} = \frac{1}{n}\sum_{i=1}^{n}x_i" class="inline" />
              <span class="font-medium text-text-primary ml-2">Mean (Average)</span>
            </div>
            <p class="text-sm text-text-muted mb-2">
              The sum of all values divided by the count. Sensitive to outliers — one extreme value
              can dramatically shift the mean.
            </p>
            <p class="text-xs text-text-muted">
              <strong>Use when:</strong> Data is symmetric with no extreme outliers.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-arrows-left-right text-primary mr-2" aria-hidden="true" />
              Median (Middle Value)
            </p>
            <p class="text-sm text-text-muted mb-2">
              The middle value when data is sorted. Half the values are below, half are above.
              Robust to outliers — a single extreme value doesn't move the median much.
            </p>
            <p class="text-xs text-text-muted">
              <strong>Use when:</strong> Data is skewed or contains outliers.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-repeat text-primary mr-2" aria-hidden="true" />
              Mode (Most Common)
            </p>
            <p class="text-sm text-text-muted mb-2">
              The most frequently occurring value. Data can be unimodal (one mode), bimodal (two
              modes), or multimodal. May have no mode if all values are unique.
            </p>
            <p class="text-xs text-text-muted">
              <strong>Use when:</strong> Identifying the most typical value or with categorical data.
            </p>
          </div>
        </div>

        <CodeExample
          id="stats-descriptive-centraltendency"
          title="central_tendency.py"
          language="python"
          :code="centralTendencyCode"
        />
      </ContentSection>

      <!-- Measures of Spread -->
      <ContentSection
        id="spread"
        title="Measures of Spread"
        icon="fa-solid fa-arrows-left-right"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Spread (or dispersion) measures tell you how scattered the data is around the center.
        </p>

        <div class="space-y-4 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-ruler text-primary mr-2" aria-hidden="true" />
              Range (Max - Min)
            </p>
            <p class="text-sm text-text-muted">
              The simplest measure: the difference between the largest and smallest values. Very
              sensitive to outliers.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <div class="flex items-center gap-2 mb-2">
              <MathBlock formula="\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2" class="inline" />
              <span class="font-medium text-text-primary ml-2">Variance</span>
            </div>
            <p class="text-sm text-text-muted mb-2">
              The average of squared deviations from the mean. The "squared" makes units awkward
              (e.g., square cm), so we often take the square root...
            </p>
            <p class="text-xs text-text-muted">
              <strong>Note:</strong> Population variance divides by n. Sample variance divides by n-1
              (Bessel's correction).
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <div class="flex items-center gap-2 mb-2">
              <MathBlock formula="\sigma = \sqrt{\text{variance}}" class="inline" />
              <span class="font-medium text-text-primary ml-2">Standard Deviation</span>
            </div>
            <p class="text-sm text-text-muted mb-2">
              Square root of variance — back in the original units. In a normal distribution, about
              68% of data falls within 1 std dev of the mean.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-layer-group text-primary mr-2" aria-hidden="true" />
              Interquartile Range (IQR = Q3 - Q1)
            </p>
            <p class="text-sm text-text-muted">
              The range of the middle 50% of data. Robust to outliers since it ignores the extremes.
              Used in box plots and outlier detection.
            </p>
          </div>
        </div>

        <CodeExample
          id="stats-descriptive-spread"
          title="spread_measures.py"
          language="python"
          :code="spreadCode"
        />
      </ContentSection>

      <!-- Quartiles and Percentiles -->
      <ContentSection
        id="quartiles"
        title="Quartiles and Percentiles"
        icon="fa-solid fa-layer-group"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Percentiles tell you what proportion of data falls below a certain value.
        </p>

        <div class="grid gap-4 md:grid-cols-3 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface text-center">
            <p class="text-2xl font-bold text-primary mb-1">Q1</p>
            <p class="text-sm text-text-muted">25th percentile</p>
            <p class="text-xs text-text-muted mt-1">25% below, 75% above</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface text-center">
            <p class="text-2xl font-bold text-primary mb-1">Q2</p>
            <p class="text-sm text-text-muted">50th percentile (median)</p>
            <p class="text-xs text-text-muted mt-1">50% below, 50% above</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface text-center">
            <p class="text-2xl font-bold text-primary mb-1">Q3</p>
            <p class="text-sm text-text-muted">75th percentile</p>
            <p class="text-xs text-text-muted mt-1">75% below, 25% above</p>
          </div>
        </div>

        <p class="mb-4">
          The quartiles divide your data into four equal parts. Think of it like this: if your data
          were students lined up by height, Q1 is where the shortest 25% end, Q2 is the middle, and
          Q3 is where the tallest 25% begin.
        </p>

        <CodeExample
          id="stats-descriptive-quartiles"
          title="quartiles.py"
          language="python"
          :code="quartilesCode"
        />
      </ContentSection>

      <!-- Outlier Detection -->
      <ContentSection
        id="outliers"
        title="Outlier Detection"
        icon="fa-solid fa-exclamation-triangle"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          <strong>Outliers</strong> are values that are unusually far from the rest of the data.
          They can be errors, rare events, or genuinely extreme values — and handling them correctly
          is critical for analysis.
        </p>

        <div class="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
          <p class="font-semibold text-amber-800 dark:text-amber-200 mb-2">
            <i class="fa-solid fa-fence mr-2" aria-hidden="true" />
            The IQR Method (Tukey's Fences)
          </p>
          <p class="text-amber-700 dark:text-amber-300 text-sm mb-2">
            Values are outliers if they fall outside these "fences":
          </p>
          <ul class="text-sm text-amber-700 dark:text-amber-300 list-disc list-inside">
            <li><strong>Lower fence:</strong> Q1 - 1.5 × IQR</li>
            <li><strong>Upper fence:</strong> Q3 + 1.5 × IQR</li>
          </ul>
        </div>

        <p class="mb-4">
          <strong>Common approaches to outliers:</strong>
        </p>
        <ul class="list-disc list-inside text-text-secondary mb-6 space-y-1">
          <li><strong>Investigate</strong> — Is it a data entry error? A rare but valid event?</li>
          <li><strong>Remove</strong> — If it's clearly an error</li>
          <li><strong>Cap/Winsorize</strong> — Replace with fence values</li>
          <li><strong>Transform</strong> — Log transform can reduce impact</li>
          <li><strong>Keep</strong> — Sometimes outliers ARE the interesting data!</li>
        </ul>

        <CodeExample
          id="stats-descriptive-outliers"
          title="outlier_detection.py"
          language="python"
          :code="outlierCode"
        />
      </ContentSection>

      <!-- Distribution Shape -->
      <ContentSection
        id="skewness"
        title="Distribution Shape and Skewness"
        icon="fa-solid fa-mountain"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          The <strong>shape</strong> of your data distribution tells you important things about what
          you're measuring. Skewness measures asymmetry.
        </p>

        <div class="grid gap-4 md:grid-cols-3 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-arrow-left text-blue-500 mr-2" aria-hidden="true" />
              Left-Skewed (Negative)
            </p>
            <p class="text-sm text-text-muted">
              Tail extends to the left. Mean &lt; Median. Example: test scores with a ceiling effect.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-equals text-green-500 mr-2" aria-hidden="true" />
              Symmetric
            </p>
            <p class="text-sm text-text-muted">
              Mean ≈ Median. Example: heights in a population, measurement errors.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-arrow-right text-amber-500 mr-2" aria-hidden="true" />
              Right-Skewed (Positive)
            </p>
            <p class="text-sm text-text-muted">
              Tail extends to the right. Mean &gt; Median. Example: income distribution, response times.
            </p>
          </div>
        </div>

        <p class="text-text-secondary">
          <strong>Tip:</strong> When data is skewed, the median is often a better measure of central
          tendency than the mean, since the mean is "pulled" toward the tail.
        </p>
      </ContentSection>

      <!-- Understanding Histograms -->
      <ContentSection
        id="histograms"
        title="Understanding Histograms"
        icon="fa-solid fa-chart-bar"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          A histogram shows the <strong>frequency distribution</strong> of your data by grouping
          values into "bins" and counting how many fall into each bin.
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <p class="font-medium text-text-primary mb-2">
            <i class="fa-solid fa-sliders text-primary mr-2" aria-hidden="true" />
            Bin Count Matters!
          </p>
          <p class="text-sm text-text-muted">
            The number of bins dramatically affects how you perceive the data. Too few bins hide
            important patterns; too many create noise. Try adjusting the bins in the calculator above
            to see this effect.
          </p>
        </div>

        <p class="mb-4">
          Common patterns you might see in histograms:
        </p>
        <ul class="list-disc list-inside text-text-secondary space-y-1">
          <li><strong>Normal</strong> — Bell-shaped, symmetric around the mean</li>
          <li><strong>Uniform</strong> — Flat, all values equally likely</li>
          <li><strong>Bimodal</strong> — Two peaks (might indicate two distinct groups)</li>
          <li><strong>Skewed</strong> — Asymmetric with a long tail</li>
        </ul>
      </ContentSection>

      <!-- Understanding Box Plots -->
      <ContentSection
        id="boxplots"
        title="Understanding Box Plots"
        icon="fa-solid fa-diagram-project"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          A box plot (or box-and-whisker plot) is a compact way to visualize the distribution's
          key statistics at a glance.
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">What the Box Shows</p>
            <ul class="text-sm text-text-muted space-y-1">
              <li>• <strong>Box:</strong> Spans from Q1 to Q3 (the IQR)</li>
              <li>• <strong>Line in box:</strong> The median (Q2)</li>
              <li>• <strong>Whiskers:</strong> Extend to min/max within fences</li>
              <li>• <strong>Points:</strong> Outliers beyond the fences</li>
            </ul>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">What You Can Read</p>
            <ul class="text-sm text-text-muted space-y-1">
              <li>• Center (median) at a glance</li>
              <li>• Spread via box width (IQR)</li>
              <li>• Symmetry via median position in box</li>
              <li>• Outliers immediately visible</li>
            </ul>
          </div>
        </div>

        <p class="text-text-secondary text-sm">
          <strong>Histogram vs Box Plot:</strong> Histograms show the full distribution shape and
          are better for exploring single datasets. Box plots are compact and excel at comparing
          multiple groups side-by-side.
        </p>
      </ContentSection>

      <!-- Programmer Applications -->
      <ContentSection
        id="applications"
        title="Programmer Applications"
        icon="fa-solid fa-code"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Here's how descriptive statistics are used in real programming tasks:
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-brain text-primary mr-2" aria-hidden="true" />
              ML Data Preprocessing
            </p>
            <p class="text-sm text-text-muted">
              Standardization (z-score) transforms features to mean=0, std=1. Many algorithms
              require this for proper convergence.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-magnifying-glass-chart text-primary mr-2" aria-hidden="true" />
              Exploratory Data Analysis
            </p>
            <p class="text-sm text-text-muted">
              First step with any dataset: compute descriptives, check for outliers, visualize
              distributions. This informs all downstream decisions.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-flask text-primary mr-2" aria-hidden="true" />
              A/B Test Analysis
            </p>
            <p class="text-sm text-text-muted">
              Compare means, medians, and distributions between control and treatment groups to
              understand the impact of changes.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-bell text-primary mr-2" aria-hidden="true" />
              Anomaly Detection
            </p>
            <p class="text-sm text-text-muted">
              Use outlier detection to identify unusual patterns in metrics, potential security
              breaches, or data quality issues.
            </p>
          </div>
        </div>

        <CodeExample
          id="stats-descriptive-normalization"
          title="z_score_normalization.py"
          language="python"
          :code="normalizationCode"
        />
      </ContentSection>

      <!-- Quick Reference -->
      <ContentSection id="reference" title="Quick Reference" icon="fa-solid fa-book">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left p-2 text-text-primary">Measure</th>
                <th class="text-left p-2 text-text-primary">What it Tells You</th>
                <th class="text-left p-2 text-text-primary">Robust to Outliers?</th>
              </tr>
            </thead>
            <tbody class="text-text-secondary">
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Mean</td>
                <td class="p-2">Average value</td>
                <td class="p-2 text-red-600 dark:text-red-400">No</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Median</td>
                <td class="p-2">Middle value</td>
                <td class="p-2 text-green-700 dark:text-green-400">Yes</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Mode</td>
                <td class="p-2">Most common value</td>
                <td class="p-2 text-green-700 dark:text-green-400">Yes</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Range</td>
                <td class="p-2">Total spread</td>
                <td class="p-2 text-red-600 dark:text-red-400">No</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Variance / Std Dev</td>
                <td class="p-2">Average deviation from mean</td>
                <td class="p-2 text-red-600 dark:text-red-400">No</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="p-2 font-medium">Interquartile Range (IQR)</td>
                <td class="p-2">Middle 50% spread</td>
                <td class="p-2 text-green-700 dark:text-green-400">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 p-4 rounded-lg border border-border">
          <p class="font-medium text-text-primary mb-2">
            <i class="fa-solid fa-lightbulb text-amber-500 mr-2" aria-hidden="true" />
            Common Pitfalls
          </p>
          <ul class="text-sm text-text-muted space-y-1">
            <li>• Confusing population variance (n) with sample variance (n-1)</li>
            <li>• Using mean when data is skewed (use median instead)</li>
            <li>• Assuming outliers are errors (they might be valid!)</li>
            <li>• Over-interpreting histograms with too few or too many bins</li>
          </ul>
        </div>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
