<script setup lang="ts">
import { topics } from '@/data/navigation'

const features = [
  {
    icon: 'fa-solid fa-gamepad',
    emoji: '🎮',
    title: 'Interactive Learning',
    description:
      'Explore mathematical concepts through hands-on examples with interactive visualizations.',
  },
  {
    icon: 'fa-solid fa-layer-group',
    emoji: '📚',
    title: 'Progressive Curriculum',
    description:
      'Start with basics and gradually build up to advanced topics like calculus and linear algebra.',
  },
  {
    icon: 'fa-solid fa-flask',
    emoji: '🔬',
    title: 'Real-World Applications',
    description:
      'See how mathematical concepts apply to real programming problems and data science.',
  },
  {
    icon: 'fa-solid fa-chart-line',
    emoji: '📊',
    title: 'Visual Understanding',
    description:
      'Use charts, graphs, and interactive components to visualize mathematical relationships.',
  },
]

const siteStructure = [
  { name: 'Basics', description: 'Variables, functions, and data types' },
  { name: 'Algebra', description: 'Linear equations, quadratic functions, and summation' },
  { name: 'Statistics', description: 'Descriptive statistics, probability, and distributions' },
  { name: 'Trigonometry', description: 'Angles, unit circle, and periodic functions' },
  { name: 'Linear Algebra', description: 'Vectors, matrices, and transformations' },
  { name: 'Calculus', description: 'Limits, derivatives, and integration' },
]
</script>

<template>
  <div class="space-y-12 md:space-y-16">
    <!-- Hero Section -->
    <section class="text-center py-8 md:py-12">
      <div class="flex justify-center mb-6">
        <span class="text-6xl md:text-8xl" aria-hidden="true">🐍</span>
      </div>

      <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">Snake Math</h1>

      <p class="text-xl md:text-2xl text-primary font-medium mb-2">
        Learn Mathematics Through Python
      </p>

      <p class="text-lg text-text-secondary max-w-xl mx-auto mb-8">
        Master mathematical concepts while building your programming skills
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink
          to="/basics"
          class="inline-flex items-center justify-center gap-2 bg-primary text-text-inverse px-6 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors"
        >
          <i class="fa-solid fa-rocket" aria-hidden="true" />
          Get Started
        </RouterLink>
        <a
          href="https://github.com/Cal-ly/SnakeMath"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 border border-border text-text-primary px-6 py-3 rounded-lg font-medium hover:bg-surface-alt transition-colors"
        >
          <i class="fa-brands fa-github" aria-hidden="true" />
          View on GitHub
        </a>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="feature in features" :key="feature.title" class="card p-6 text-center">
        <div class="text-3xl mb-3" aria-hidden="true">
          {{ feature.emoji }}
        </div>
        <h2 class="font-semibold text-text-primary mb-2">{{ feature.title }}</h2>
        <p class="text-sm text-text-muted">
          {{ feature.description }}
        </p>
      </div>
    </section>

    <!-- The "Hrumph" Section - Personal Story -->
    <section class="card p-6 md:p-8">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-text-primary mb-4">
          <em>Hrumph!</em> What's the meaning of all this?
        </h2>

        <p class="text-text-secondary mb-4">
          The initial goal with this site was a personal cheatsheet on how to combine Python with
          mathematical concepts.
        </p>

        <img src="@/assets/dont-know-snake-math-small.gif" alt="Don't know Snake Math meme" class="w-full max-w-md mx-auto rounded-lg my-4">

        <h3 class="text-xl font-semibold text-text-primary mt-6 mb-3">...But wait, you can!</h3>

        <p class="text-text-secondary">
          Whether you're a programmer looking to strengthen your math skills or a math enthusiast
          wanting to see practical applications, this site tries to bridge the gap between theory
          and practice.
        </p>

        <p class="text-text-muted mt-4 italic">
          That big and scary-looking <code class="text-primary">Σ</code> is basically just a for
          loop adding all the variables together.
        </p>
      </div>
    </section>

    <!-- Site Structure -->
    <section>
      <h2 class="text-2xl font-bold text-text-primary mb-6">
        <i class="fa-solid fa-sitemap mr-2 text-primary" aria-hidden="true" />
        Site Structure
      </h2>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="item in siteStructure" :key="item.name" class="card p-4">
          <h3 class="font-semibold text-text-primary">{{ item.name }}</h3>
          <p class="text-sm text-text-muted mt-1">{{ item.description }}</p>
        </div>
      </div>
    </section>

    <!-- Topics Section -->
    <section>
      <h2 class="text-2xl font-bold text-text-primary mb-6">
        <i class="fa-solid fa-book-open mr-2 text-primary" aria-hidden="true" />
        Available Topics
      </h2>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="topic in topics"
          :key="topic.id"
          :to="topic.path"
          class="card p-6 hover:border-primary hover:shadow-md transition-all group"
        >
          <div class="flex items-start gap-4">
            <span class="text-3xl" aria-hidden="true">{{ topic.icon }}</span>
            <div class="flex-1">
              <h3
                class="font-semibold text-text-primary group-hover:text-primary transition-colors"
              >
                {{ topic.title }}
              </h3>
              <p class="text-sm text-text-muted mt-1">
                {{ topic.description }}
              </p>
              <div class="mt-3 text-sm text-text-muted">
                <span class="text-primary">{{ topic.subtopics.length }}</span> topics
              </div>
            </div>
            <i
              class="fa-solid fa-chevron-right text-text-muted group-hover:text-primary transition-colors mt-1"
              aria-hidden="true"
            />
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Prerequisites -->
    <section class="card p-6 md:p-8 bg-surface-alt">
      <h2 class="text-xl font-bold text-text-primary mb-4">
        <i class="fa-solid fa-clipboard-check mr-2 text-primary" aria-hidden="true" />
        Prerequisites
      </h2>

      <ul class="space-y-2 text-text-secondary">
        <li class="flex items-start gap-2">
          <i class="fa-solid fa-check text-primary mt-1" aria-hidden="true" />
          <span>Basic familiarity with Python (or willingness to learn)</span>
        </li>
        <li class="flex items-start gap-2">
          <i class="fa-solid fa-check text-primary mt-1" aria-hidden="true" />
          <span>High school level mathematics</span>
        </li>
        <li class="flex items-start gap-2">
          <i class="fa-solid fa-check text-primary mt-1" aria-hidden="true" />
          <span>Curiosity about how math and programming connect!</span>
        </li>
      </ul>
    </section>

    <!-- Call to Action -->
    <section class="text-center py-8">
      <h2 class="text-2xl font-bold text-text-primary mb-2">Ready to dive in?</h2>
      <p class="text-text-muted mb-6">
        Start with the Foundations section to learn how to express mathematical concepts in code.
      </p>
      <RouterLink
        to="/basics/foundations"
        class="inline-flex items-center gap-2 bg-primary text-text-inverse px-8 py-4 rounded-lg font-medium text-lg hover:bg-primary-hover transition-colors"
      >
        <i class="fa-solid fa-play" aria-hidden="true" />
        Start Learning
      </RouterLink>
    </section>
  </div>
</template>
