<script setup lang="ts">
import { computed } from 'vue'
import type { TransformationType } from '@/types/math'

interface Props {
  transformationType: TransformationType
  determinant: number
  isOrthogonal: boolean
}

const props = defineProps<Props>()

// Determinant interpretation
const determinantInterpretation = computed(() => {
  const det = props.determinant

  if (Math.abs(det) < 0.001) {
    return {
      text: 'Collapsed to a line/point',
      class: 'text-red-500',
      icon: '⊘',
    }
  }

  if (det < 0) {
    return {
      text: `Area × ${Math.abs(det).toFixed(2)}, orientation flipped`,
      class: 'text-amber-500',
      icon: '⟲',
    }
  }

  if (Math.abs(det - 1) < 0.001) {
    return {
      text: 'Area preserved (det = 1)',
      class: 'text-green-500',
      icon: '✓',
    }
  }

  return {
    text: `Area × ${det.toFixed(2)}`,
    class: 'text-text-secondary',
    icon: '⤢',
  }
})

// Transformation type description
const typeDescription = computed(() => {
  switch (props.transformationType) {
    case 'identity':
      return 'No change to vectors'
    case 'rotation':
      return 'Rotates vectors around the origin'
    case 'scale':
      return 'Stretches or compresses along axes'
    case 'uniformScale':
      return 'Scales uniformly in all directions'
    case 'shearX':
      return 'Slants horizontally (x shifts based on y)'
    case 'shearY':
      return 'Slants vertically (y shifts based on x)'
    case 'reflectX':
      return 'Flips across the x-axis'
    case 'reflectY':
      return 'Flips across the y-axis'
    case 'reflectOrigin':
      return 'Reflects through the origin (180° rotation)'
    case 'custom':
      return 'User-defined transformation matrix'
    default:
      return ''
  }
})

// Properties badges
const propertyBadges = computed(() => {
  const badges: { label: string; class: string; icon: string; testId: string }[] = []

  if (props.isOrthogonal) {
    badges.push({
      label: 'Orthogonal',
      class: 'bg-blue-500/20 text-blue-500',
      icon: '⊾',
      testId: 'badge-orthogonal',
    })
  }

  if (Math.abs(props.determinant - 1) < 0.001) {
    badges.push({
      label: 'Area Preserving',
      class: 'bg-green-500/20 text-green-500',
      icon: '□',
      testId: 'badge-area-preserving',
    })
  }

  if (props.determinant < 0) {
    badges.push({
      label: 'Orientation Reversing',
      class: 'bg-amber-500/20 text-amber-500',
      icon: '⇆',
      testId: 'badge-orientation-reversing',
    })
  }

  if (Math.abs(props.determinant) < 0.001) {
    badges.push({
      label: 'Singular',
      class: 'bg-red-500/20 text-red-500',
      icon: '⚠',
      testId: 'badge-singular',
    })
  }

  return badges
})
</script>

<template>
  <div class="transform-info space-y-4">
    <!-- Transformation Type -->
    <div>
      <h4 class="text-sm font-medium text-text-muted mb-1">Transformation</h4>
      <p class="text-text-primary">{{ typeDescription }}</p>
    </div>

    <!-- Determinant -->
    <div>
      <h4 class="text-sm font-medium text-text-muted mb-1">Determinant</h4>
      <div class="flex items-center gap-2">
        <span class="font-mono text-lg">{{ determinant.toFixed(3) }}</span>
        <span :class="determinantInterpretation.class" class="text-sm flex items-center gap-1">
          <span aria-hidden="true">{{ determinantInterpretation.icon }}</span>
          {{ determinantInterpretation.text }}
        </span>
      </div>
    </div>

    <!-- Property Badges -->
    <div v-if="propertyBadges.length > 0">
      <h4 class="text-sm font-medium text-text-muted mb-2">Properties</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="badge in propertyBadges"
          :key="badge.label"
          :class="badge.class"
          class="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
          :data-testid="badge.testId"
        >
          <span aria-hidden="true">{{ badge.icon }}</span>
          {{ badge.label }}
        </span>
      </div>
    </div>

    <!-- Educational note -->
    <div class="p-3 bg-primary/10 border border-primary/30 rounded-lg">
      <p class="text-sm text-text-secondary">
        <span class="text-primary mr-2" aria-hidden="true">💡</span>
        <span v-if="isOrthogonal">
          Orthogonal matrices preserve lengths and angles — they only rotate and/or reflect.
        </span>
        <span v-else-if="Math.abs(determinant) < 0.001">
          A determinant of zero means the transformation "squishes" space into a lower dimension.
        </span>
        <span v-else-if="determinant < 0">
          Negative determinant means the transformation includes a reflection (flips orientation).
        </span>
        <span v-else>
          The determinant tells you how much the area of shapes changes under this transformation.
        </span>
      </p>
    </div>
  </div>
</template>
