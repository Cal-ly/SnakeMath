<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'

const relatedTopics = [
  { title: 'Foundations', path: '/basics/foundations', description: 'Core concepts' },
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Notation guide' },
]

const numberSets = [
  {
    symbol: '\\mathbb{N}',
    name: 'Natural Numbers',
    description: 'Counting numbers: 1, 2, 3, ...',
    python: 'n > 0 and n == int(n)',
    examples: '1, 2, 3, 100, 1000000',
  },
  {
    symbol: '\\mathbb{Z}',
    name: 'Integers',
    description: 'Whole numbers including negatives',
    python: 'n == int(n)',
    examples: '-5, -1, 0, 1, 42',
  },
  {
    symbol: '\\mathbb{Q}',
    name: 'Rational Numbers',
    description: 'Numbers that can be written as fractions',
    python: 'from fractions import Fraction',
    examples: '1/2, -3/4, 0.25, 7',
  },
  {
    symbol: '\\mathbb{R}',
    name: 'Real Numbers',
    description: 'All numbers on the number line',
    python: 'float or int',
    examples: 'pi, sqrt(2), -3.14, 0',
  },
  {
    symbol: '\\mathbb{C}',
    name: 'Complex Numbers',
    description: 'Numbers with real and imaginary parts',
    python: 'complex(a, b) or a + bj',
    examples: '3+4i, -1+0i, 2i',
  },
]
</script>

<template>
  <TopicPage
    title="Number Types"
    description="Understanding N, Z, Q, R, and C - and how they map to code."
  >
    <div class="space-y-8">
      <ContentSection id="overview" title="The Number Hierarchy" icon="fa-solid fa-layer-group">
        <p class="mb-4">
          Mathematicians organize numbers into nested sets. Each set builds on the
          previous one, adding new capabilities:
        </p>

        <MathBlock
          formula="\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}"
          display
        />

        <p class="mt-4">
          Natural numbers are inside integers, which are inside rationals, and so on.
          This hierarchy maps surprisingly well to programming types!
        </p>
      </ContentSection>

      <ContentSection id="sets" title="Number Sets" icon="fa-solid fa-shapes">
        <div class="space-y-4">
          <div
            v-for="set in numberSets"
            :key="set.name"
            class="card p-4"
          >
            <div class="flex items-start gap-4">
              <div class="text-2xl w-12 text-center">
                <MathBlock :formula="set.symbol" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-text-primary">{{ set.name }}</h3>
                <p class="text-sm text-text-muted mt-1">{{ set.description }}</p>
                <p class="text-xs text-text-muted mt-2">
                  <span class="font-medium">Examples:</span> {{ set.examples }}
                </p>
                <p class="text-xs font-mono text-primary mt-1">
                  <span class="text-text-muted">Python:</span> {{ set.python }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection id="widget" title="Interactive Explorer" icon="fa-solid fa-sliders">
        <div class="card p-6 bg-surface-alt text-center">
          <i class="fa-solid fa-wrench text-4xl text-text-muted mb-4" aria-hidden="true" />
          <p class="text-text-muted">
            NumberTypeExplorer widget coming in Phase 4!
          </p>
          <p class="text-sm text-text-muted mt-2">
            Enter any number and see which sets it belongs to.
          </p>
        </div>
      </ContentSection>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
