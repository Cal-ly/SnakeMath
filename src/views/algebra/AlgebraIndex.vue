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
      <ContentSection id="intro" title="Algebra for Programmers" icon="fa-solid fa-superscript" collapsible>
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
      <ContentSection id="topics" title="Topics in This Section" icon="fa-solid fa-book-open" collapsible :default-expanded="false">
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

    </div>
  </TopicPage>
</template>
