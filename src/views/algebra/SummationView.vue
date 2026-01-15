<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
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
          The full SummationExplorer widget will be added here in subsequent increments.
        </p>
        <div
          class="border-2 border-dashed border-border rounded-lg p-8 text-center text-text-muted"
        >
          <i class="fa-solid fa-sigma text-4xl mb-2" aria-hidden="true" />
          <p>SummationExplorer Widget Coming Soon</p>
        </div>
      </ContentSection>
    </div>
  </TopicPage>
</template>
