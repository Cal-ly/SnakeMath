<script setup lang="ts">
import { topics } from '@/data/navigation'
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'

const topic = topics.find((t) => t.id === 'algebra')!
</script>

<template>
  <TopicPage
    title="Algebra"
    description="Mathematical patterns, equations, and the language of relationships."
  >
    <div class="space-y-8">
      <!-- Hero intro -->
      <ContentSection id="intro" title="Algebra for Programmers" icon="fa-solid fa-superscript">
        <p class="mb-4">
          Algebra is where math stops being just numbers and starts being about
          <strong>patterns and relationships</strong>. For programmers, algebra is your secret
          weapon — it's the math that most directly maps to the code you already write.
        </p>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            The Big Insight
          </p>
          <p class="text-text-secondary">
            Most algebraic notation is just <strong>programming in disguise</strong>. Variables,
            expressions, summations, functions — you use these every day in code. Here, we'll decode
            the mathematical notation so you can read textbooks and papers like they're written in
            Python.
          </p>
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
              <span
                v-if="subtopic.unicodeIcon"
                class="text-primary text-2xl font-bold"
                aria-hidden="true"
              >
                {{ subtopic.unicodeIcon }}
              </span>
              <i
                v-else
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
          We're constantly expanding our algebra coverage. Here's what's in the pipeline:
        </p>

        <div class="grid gap-3 md:grid-cols-2">
          <div class="p-3 rounded-lg border border-border">
            <p class="font-medium text-text-primary">
              <i class="fa-solid fa-pi text-text-muted mr-2" aria-hidden="true" />
              Product Notation (Π)
            </p>
            <p class="text-sm text-text-muted mt-1">
              Like summation but for multiplication — factorials, permutations, and more.
            </p>
          </div>

          <div class="p-3 rounded-lg border border-border">
            <p class="font-medium text-text-primary">
              <i class="fa-solid fa-chart-line text-text-muted mr-2" aria-hidden="true" />
              Quadratic Functions
            </p>
            <p class="text-sm text-text-muted mt-1">
              Parabolas, vertex form, and the famous quadratic formula.
            </p>
          </div>

          <div class="p-3 rounded-lg border border-border">
            <p class="font-medium text-text-primary">
              <i class="fa-solid fa-equals text-text-muted mr-2" aria-hidden="true" />
              Linear Equations
            </p>
            <p class="text-sm text-text-muted mt-1">
              Systems of equations and their connection to linear algebra.
            </p>
          </div>

          <div class="p-3 rounded-lg border border-border">
            <p class="font-medium text-text-primary">
              <i class="fa-solid fa-arrow-trend-up text-text-muted mr-2" aria-hidden="true" />
              Exponentials & Logarithms
            </p>
            <p class="text-sm text-text-muted mt-1">
              O(log n) complexity explained through the math behind it.
            </p>
          </div>
        </div>
      </ContentSection>
    </div>
  </TopicPage>
</template>
