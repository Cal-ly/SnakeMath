<script setup lang="ts">
import { topics } from '@/data/navigation'
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'

const topic = topics.find((t) => t.id === 'linear-algebra')!
</script>

<template>
  <TopicPage
    title="Linear Algebra"
    description="The mathematical foundation of machine learning, computer graphics, and data science."
  >
    <div class="space-y-8">
      <!-- Hero intro -->
      <ContentSection id="intro" title="The Language of ML" icon="fa-solid fa-brain">
        <p class="mb-4">
          Linear algebra is the <strong>mathematics of machine learning</strong>. Every neural network,
          every image transformation, every recommendation algorithm — they all run on vectors and
          matrices.
        </p>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Why Linear Algebra Matters
          </p>
          <p class="text-text-secondary">
            When you hear "embeddings" or "feature vectors" in ML, that's linear algebra. When
            you rotate an image or scale a 3D model, that's linear algebra. Understanding these
            concepts gives you intuition for how modern AI actually works.
          </p>
        </div>
      </ContentSection>

      <!-- Key Concepts Preview -->
      <ContentSection id="concepts" title="Core Concepts" icon="fa-solid fa-cubes">
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-arrow-right mr-2" aria-hidden="true" />
              Vectors
            </h4>
            <p class="text-sm text-text-secondary mb-2">
              Lists of numbers that represent points, directions, or features.
            </p>
            <MathBlock formula="\vec{v} = \begin{bmatrix} x \\ y \end{bmatrix}" />
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-table-cells mr-2" aria-hidden="true" />
              Matrices
            </h4>
            <p class="text-sm text-text-secondary mb-2">
              2D arrays that transform vectors and represent systems of equations.
            </p>
            <MathBlock formula="A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}" />
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-circle-dot mr-2" aria-hidden="true" />
              Dot Product
            </h4>
            <p class="text-sm text-text-secondary mb-2">
              Measures similarity between vectors — the foundation of cosine similarity.
            </p>
            <MathBlock formula="\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2" />
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-rotate mr-2" aria-hidden="true" />
              Transformations
            </h4>
            <p class="text-sm text-text-secondary mb-2">
              Rotations, reflections, and scaling — all expressed as matrix multiplication.
            </p>
            <MathBlock formula="T(\vec{v}) = A\vec{v}" />
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

      <!-- Python/NumPy Preview -->
      <ContentSection id="python" title="In Python" icon="fa-brands fa-python">
        <p class="mb-4 text-text-secondary">
          NumPy is the Python library for linear algebra. Everything we explore visually translates
          directly to NumPy code:
        </p>
        <div class="p-4 rounded-lg border border-border font-mono text-sm">
          <pre class="text-text-secondary"><span class="text-blue-500">import</span> numpy <span class="text-blue-500">as</span> np

<span class="text-text-muted"># Vectors</span>
v = np.array([<span class="text-amber-500">3</span>, <span class="text-amber-500">4</span>])
magnitude = np.linalg.norm(v)  <span class="text-text-muted"># 5.0</span>

<span class="text-text-muted"># Dot product</span>
a = np.array([<span class="text-amber-500">1</span>, <span class="text-amber-500">2</span>])
b = np.array([<span class="text-amber-500">3</span>, <span class="text-amber-500">4</span>])
dot = np.dot(a, b)  <span class="text-text-muted"># 11</span></pre>
        </div>
      </ContentSection>
    </div>
  </TopicPage>
</template>
