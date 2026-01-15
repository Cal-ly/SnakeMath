<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import { SummationExplorer } from '@/components/widgets'
</script>

<template>
  <TopicPage>
    <div class="space-y-8">
      <ContentSection id="introduction" title="What is Summation Notation?">
        <p class="text-text-secondary">
          Summation notation is mathematicians' shorthand for adding things up. That big, scary
          Greek letter Σ (sigma) is actually one of the most programmer-friendly concepts in
          mathematics.
        </p>
        <p class="text-text-secondary mt-4">
          <strong class="text-text-primary">The secret:</strong> If you've ever written a for
          loop, you already understand sigma notation.
        </p>
      </ContentSection>

      <ContentSection id="explorer" title="Interactive Explorer">
        <p class="text-text-secondary mb-4">
          Experiment with different summation formulas. Select an expression, adjust the bounds, and
          see how the sum is calculated.
        </p>
        <SummationExplorer
          :initial-preset="'arithmetic'"
          :initial-start="1"
          :initial-end="10"
          :sync-url="true"
        />
      </ContentSection>
    </div>
  </TopicPage>
</template>
