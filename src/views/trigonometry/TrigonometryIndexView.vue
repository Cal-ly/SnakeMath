<script setup lang="ts">
import { topics } from '@/data/navigation'
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'

const topic = topics.find((t) => t.id === 'trigonometry')!
</script>

<template>
  <TopicPage
    title="Trigonometry"
    description="Circles, angles, and the mathematics of rotation and oscillation."
  >
    <div class="space-y-8">
      <!-- Hero intro -->
      <ContentSection id="intro" title="Trigonometry for Programmers" icon="fa-solid fa-circle-notch" collapsible>
        <p class="mb-4">
          Trigonometry might seem like "hard math," but for programmers it's actually one of the
          most <strong>practical and visual</strong> areas of mathematics. Any time you work with
          rotations, animations, physics, or graphics — trigonometry is behind the scenes.
        </p>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            The Big Insight
          </p>
          <p class="text-text-secondary">
            The <strong>unit circle</strong> is the key to everything. Once you understand that sin
            and cos are just the y and x coordinates of a point on a circle, all of trigonometry
            clicks into place.
          </p>
        </div>
      </ContentSection>

      <!-- Why It Matters -->
      <ContentSection id="why-it-matters" title="Why Programmers Need This" icon="fa-solid fa-rocket" collapsible>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-gamepad text-primary mr-2" aria-hidden="true" />
              Game Development
            </p>
            <p class="text-sm text-text-muted">
              Character movement, projectile trajectories, camera angles, collision detection — all
              use sin and cos for rotation and direction.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-palette text-primary mr-2" aria-hidden="true" />
              Graphics & Animation
            </p>
            <p class="text-sm text-text-muted">
              Smooth oscillating animations, rotating UI elements, circular progress indicators, and
              SVG transforms all rely on trig functions.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-wave-square text-primary mr-2" aria-hidden="true" />
              Signal Processing
            </p>
            <p class="text-sm text-text-muted">
              Audio synthesis, Fourier transforms, and any periodic data analysis uses sine waves as
              the fundamental building blocks.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-compass text-primary mr-2" aria-hidden="true" />
              Geolocation & Maps
            </p>
            <p class="text-sm text-text-muted">
              Calculating distances and bearings on Earth (a sphere!) requires trigonometry for
              accurate geographic computations.
            </p>
          </div>
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

    </div>
  </TopicPage>
</template>
