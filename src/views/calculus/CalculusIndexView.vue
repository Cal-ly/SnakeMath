<script setup lang="ts">
/**
 * CalculusIndexView - Landing page for the Calculus section
 *
 * Introduces calculus concepts and links to topics:
 * - Limits (Phase 13)
 * - Derivatives (Phase 14)
 * - Integration (future)
 */

import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'

// ============================================================================
// Data
// ============================================================================

const topics = [
  {
    title: 'Limits',
    path: '/calculus/limits',
    description: 'The foundation of calculus - understanding approaching values',
    icon: 'fa-solid fa-arrows-to-dot',
    available: true,
  },
  {
    title: 'Derivatives',
    path: '/calculus/derivatives',
    description: 'Rates of change and slopes of curves',
    icon: 'fa-solid fa-chart-line',
    available: true,
  },
  {
    title: 'Integration',
    path: '/calculus/integration',
    description: 'Accumulation and area under curves',
    icon: 'fa-solid fa-chart-area',
    available: true,
  },
]

const relatedTopics = [
  {
    title: 'Functions',
    path: '/basics/functions',
    description: 'Foundation for understanding calculus',
  },
  {
    title: 'Trigonometry',
    path: '/trigonometry',
    description: 'Trig functions appear throughout calculus',
  },
  {
    title: 'Exponentials',
    path: '/algebra/exponentials',
    description: 'e and exponential growth in calculus',
  },
]
</script>

<template>
  <TopicPage
    title="Calculus"
    description="The mathematics of change - derivatives, integrals, and limits"
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is Calculus?" icon="fa-solid fa-infinity">
        <p class="mb-4">
          Calculus is the mathematics of <strong>change</strong> and
          <strong>accumulation</strong>. It provides tools to analyze how things change
          (derivatives) and how to add up infinitely many small pieces (integrals).
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
              Differential Calculus
            </h4>
            <p class="text-sm text-text-secondary mb-2">Study of rates of change and slopes</p>
            <MathBlock formula="\frac{df}{dx} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" />
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-chart-area mr-2" aria-hidden="true" />
              Integral Calculus
            </h4>
            <p class="text-sm text-text-secondary mb-2">Study of accumulation and areas</p>
            <MathBlock
              formula="\int_a^b f(x) \, dx = \lim_{n \to \infty} \sum_{i=1}^n f(x_i) \Delta x"
            />
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            The Fundamental Theorem of Calculus
          </p>
          <p class="text-text-secondary">
            Derivatives and integrals are inverse operations - like multiplication and division.
            This connection is why calculus is so powerful for solving real-world problems.
          </p>
        </div>
      </ContentSection>

      <!-- Why Programmers Need Calculus -->
      <ContentSection
        id="programming"
        title="Why Programmers Need Calculus"
        icon="fa-solid fa-laptop-code"
      >
        <p class="mb-4">
          If you're wondering "when will I ever use this?" - the answer is: constantly, if you work
          in these areas:
        </p>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <div class="p-4 rounded-lg border border-border">
            <h5 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-robot mr-2" aria-hidden="true" />
              Machine Learning
            </h5>
            <p class="text-sm text-text-secondary">
              Gradient descent, backpropagation, and optimization all use derivatives
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h5 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-gamepad mr-2" aria-hidden="true" />
              Game Development
            </h5>
            <p class="text-sm text-text-secondary">
              Physics simulations, smooth animations, collision detection
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h5 class="font-semibold text-green-600 mb-2">
              <i class="fa-solid fa-chart-pie mr-2" aria-hidden="true" />
              Data Science
            </h5>
            <p class="text-sm text-text-secondary">
              Probability distributions, statistical analysis, modeling
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h5 class="font-semibold text-purple-600 mb-2">
              <i class="fa-solid fa-bezier-curve mr-2" aria-hidden="true" />
              Computer Graphics
            </h5>
            <p class="text-sm text-text-secondary">
              Bezier curves, surface rendering, lighting calculations
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h5 class="font-semibold text-red-600 mb-2">
              <i class="fa-solid fa-signal mr-2" aria-hidden="true" />
              Signal Processing
            </h5>
            <p class="text-sm text-text-secondary">
              Audio processing, image filtering, Fourier transforms
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h5 class="font-semibold text-cyan-600 mb-2">
              <i class="fa-solid fa-microchip mr-2" aria-hidden="true" />
              Numerical Methods
            </h5>
            <p class="text-sm text-text-secondary">
              Solving equations, approximations, scientific computing
            </p>
          </div>
        </div>
        
        <!-- NOTE: Commented out; might move.
        <CodeExample
          title="Gradient Descent: Calculus in Machine Learning"
          language="python"
          :code="gradientDescentCode"
          :collapsible="true"
          :default-expanded="false"
        /> -->
      </ContentSection>

      <!-- Topics Grid -->
      <ContentSection id="topics" title="Topics" icon="fa-solid fa-list">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <router-link
            v-for="topic in topics"
            :key="topic.path"
            :to="topic.available ? topic.path : ''"
            class="block p-4 rounded-lg border transition-all"
            :class="
              topic.available
                ? 'bg-surface-alt border-border hover:border-primary hover:shadow-md cursor-pointer'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
            "
            :aria-disabled="!topic.available"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="
                  topic.available
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                "
              >
                <i :class="topic.icon" aria-hidden="true" />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold mb-1">
                  {{ topic.title }}
                  <span
                    v-if="!topic.available"
                    class="ml-2 text-xs font-normal text-text-muted"
                  >
                    (Coming Soon)
                  </span>
                </h4>
                <p class="text-sm text-text-secondary">
                  {{ topic.description }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
