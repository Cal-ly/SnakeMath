<script setup lang="ts">
import { topics } from '@/data/navigation'
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'

const topic = topics.find((t) => t.id === 'statistics')!
</script>

<template>
  <TopicPage
    title="Statistics"
    description="Describing, analyzing, and understanding data through numbers."
  >
    <div class="space-y-8">
      <!-- Hero intro -->
      <ContentSection id="intro" title="Statistics for Programmers" icon="fa-solid fa-chart-pie">
        <p class="mb-4">
          Statistics is the science of <strong>making sense of data</strong>. For programmers,
          statistics is essential for data science, machine learning, A/B testing, and building
          any data-driven application.
        </p>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            The Big Insight
          </p>
          <p class="text-text-secondary">
            Statistics answers two fundamental questions: <strong>"What does this data look like?"</strong>
            (descriptive statistics) and <strong>"Can I trust conclusions from this data?"</strong>
            (inferential statistics). Start with descriptive — it's the foundation for everything else.
          </p>
        </div>
      </ContentSection>

      <!-- The Three Pillars -->
      <ContentSection id="pillars" title="The Three Pillars of Descriptive Statistics" icon="fa-solid fa-landmark">
        <div class="grid gap-4 md:grid-cols-3">
          <div class="p-4 rounded-lg border border-border">
            <div class="w-12 h-12 mb-3 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <i class="fa-solid fa-bullseye text-emerald-600 dark:text-emerald-400 text-xl" aria-hidden="true" />
            </div>
            <p class="font-medium text-text-primary mb-2">Central Tendency</p>
            <p class="text-sm text-text-muted">
              Where is the "middle" of the data? Mean, median, and mode each give different answers
              to this question.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <div class="w-12 h-12 mb-3 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <i class="fa-solid fa-arrows-left-right text-blue-600 dark:text-blue-400 text-xl" aria-hidden="true" />
            </div>
            <p class="font-medium text-text-primary mb-2">Spread</p>
            <p class="text-sm text-text-muted">
              How spread out is the data? Variance, standard deviation, and IQR measure the
              dispersion around the center.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <div class="w-12 h-12 mb-3 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <i class="fa-solid fa-mountain text-purple-600 dark:text-purple-400 text-xl" aria-hidden="true" />
            </div>
            <p class="font-medium text-text-primary mb-2">Distribution Shape</p>
            <p class="text-sm text-text-muted">
              Is the data symmetric or skewed? Are there outliers? Histograms and box plots reveal
              the shape of your data.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Why It Matters -->
      <ContentSection id="why-it-matters" title="Why Programmers Need This" icon="fa-solid fa-rocket">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-brain text-primary mr-2" aria-hidden="true" />
              Machine Learning
            </p>
            <p class="text-sm text-text-muted">
              Feature scaling, outlier detection, and data preprocessing all depend on understanding
              your data's statistics.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-flask text-primary mr-2" aria-hidden="true" />
              A/B Testing
            </p>
            <p class="text-sm text-text-muted">
              Comparing metrics between groups requires statistical measures to know if differences
              are meaningful.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-magnifying-glass-chart text-primary mr-2" aria-hidden="true" />
              Data Exploration
            </p>
            <p class="text-sm text-text-muted">
              Before building models, understanding your data's distribution, outliers, and central
              tendencies is critical.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-bug text-primary mr-2" aria-hidden="true" />
              Debugging & Monitoring
            </p>
            <p class="text-sm text-text-muted">
              Detecting anomalies in metrics, identifying performance regressions, and setting
              alerting thresholds.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Topics in this section -->
      <ContentSection id="topics" title="Topics in This Section" icon="fa-solid fa-book-open">
        <div class="space-y-3">
          <RouterLink
            v-for="subtopic in topic.subtopics"
            :key="subtopic.id"
            :to="subtopic.path"
            class="flex items-center gap-4 bg-surface-alt rounded-lg p-4 border border-border/50 hover:border-primary transition-colors group"
          >
            <div
              class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
            >
              <i
                :class="subtopic.faIcon || 'fa-solid fa-file'"
                class="text-primary text-xl"
                aria-hidden="true"
              />
            </div>
            <div class="flex-1 min-w-0">
              <span
                class="font-medium text-text-primary group-hover:text-primary transition-colors block"
              >
                {{ subtopic.title }}
              </span>
              <p v-if="subtopic.description" class="text-sm text-text-muted mt-0.5">
                {{ subtopic.description }}
              </p>
            </div>
            <i
              class="fa-solid fa-chevron-right text-text-muted group-hover:text-primary transition-colors"
              aria-hidden="true"
            />
          </RouterLink>
        </div>
      </ContentSection>

      <!-- Coming Soon -->
      <ContentSection id="coming-soon" title="Coming Soon" icon="fa-solid fa-clock">
        <p class="mb-4 text-text-secondary">
          We're expanding our statistics coverage. Here's what's in the pipeline:
        </p>

        <div class="grid gap-3 md:grid-cols-2">
          <div class="p-3 rounded-lg border border-border">
            <p class="font-medium text-text-primary">
              <i class="fa-solid fa-bell-curve text-text-muted mr-2" aria-hidden="true" />
              Probability Distributions
            </p>
            <p class="text-sm text-text-muted mt-1">
              Normal, binomial, Poisson — the shapes of randomness.
            </p>
          </div>

          <div class="p-3 rounded-lg border border-border">
            <p class="font-medium text-text-primary">
              <i class="fa-solid fa-scale-balanced text-text-muted mr-2" aria-hidden="true" />
              Hypothesis Testing
            </p>
            <p class="text-sm text-text-muted mt-1">
              P-values, confidence intervals, and statistical significance.
            </p>
          </div>

          <div class="p-3 rounded-lg border border-border">
            <p class="font-medium text-text-primary">
              <i class="fa-solid fa-chart-mixed text-text-muted mr-2" aria-hidden="true" />
              Correlation & Regression
            </p>
            <p class="text-sm text-text-muted mt-1">
              Measuring relationships between variables.
            </p>
          </div>

          <div class="p-3 rounded-lg border border-border">
            <p class="font-medium text-text-primary">
              <i class="fa-solid fa-database text-text-muted mr-2" aria-hidden="true" />
              Sampling & Estimation
            </p>
            <p class="text-sm text-text-muted mt-1">
              Making inferences about populations from samples.
            </p>
          </div>
        </div>
      </ContentSection>
    </div>
  </TopicPage>
</template>
