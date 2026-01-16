<script setup lang="ts">
import type { SpecialAngle } from '@/utils/math/trigonometry'

interface Props {
  firstQuadrantAngles: SpecialAngle[]
  remainingAngles: SpecialAngle[]
  showMore: boolean
  currentAngle: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectAngle: [degrees: number]
  toggleMore: []
}>()

function isActive(degrees: number): boolean {
  return Math.abs(props.currentAngle - degrees) < 0.5
}
</script>

<template>
  <div class="special-angles">
    <div class="text-sm font-medium text-text-secondary mb-2">Special Angles:</div>

    <!-- First Quadrant Angles (always visible) -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="angle in firstQuadrantAngles"
        :key="angle.degrees"
        :data-testid="`special-angle-${angle.degrees}`"
        :class="[
          'px-3 py-1 text-sm rounded border transition-colors',
          isActive(angle.degrees)
            ? 'bg-primary text-white border-primary'
            : 'bg-surface border-border text-text-primary hover:border-primary hover:bg-primary/10',
        ]"
        @click="emit('selectAngle', angle.degrees)"
      >
        {{ angle.degrees }}°
      </button>

      <button
        data-testid="special-angles-more"
        class="px-3 py-1 text-sm rounded border border-border bg-surface text-text-muted hover:bg-surface-hover transition-colors"
        @click="emit('toggleMore')"
      >
        {{ showMore ? '▲ Less' : '▼ More' }}
      </button>
    </div>

    <!-- Remaining Angles (visible when expanded) -->
    <div v-if="showMore" class="flex flex-wrap gap-2 mt-2">
      <button
        v-for="angle in remainingAngles"
        :key="angle.degrees"
        :data-testid="`special-angle-${angle.degrees}`"
        :class="[
          'px-3 py-1 text-sm rounded border transition-colors',
          isActive(angle.degrees)
            ? 'bg-primary text-white border-primary'
            : 'bg-surface border-border text-text-primary hover:border-primary hover:bg-primary/10',
        ]"
        @click="emit('selectAngle', angle.degrees)"
      >
        {{ angle.degrees }}°
      </button>
    </div>
  </div>
</template>
