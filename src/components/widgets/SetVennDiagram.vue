<script setup lang="ts">
import { computed } from 'vue'

interface SetMembership {
  isNatural: boolean
  isInteger: boolean
  isRational: boolean
  isReal: boolean
  isComplex: boolean
}

interface Props {
  /** Set membership data */
  membership: SetMembership | null
  /** Show labels on diagram */
  showLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLabels: true,
})

// Define set colors (using CSS variables where possible)
const sets = computed(() => [
  {
    id: 'complex',
    label: 'ℂ',
    name: 'Complex',
    color: '#8b5cf6', // purple
    isMember: props.membership?.isComplex ?? false,
    radius: 95,
    cx: 50,
    cy: 50,
  },
  {
    id: 'real',
    label: 'ℝ',
    name: 'Real',
    color: '#3b82f6', // blue
    isMember: props.membership?.isReal ?? false,
    radius: 75,
    cx: 45,
    cy: 50,
  },
  {
    id: 'rational',
    label: 'ℚ',
    name: 'Rational',
    color: '#22c55e', // green
    isMember: props.membership?.isRational ?? false,
    radius: 55,
    cx: 42,
    cy: 50,
  },
  {
    id: 'integer',
    label: 'ℤ',
    name: 'Integer',
    color: '#f59e0b', // amber
    isMember: props.membership?.isInteger ?? false,
    radius: 35,
    cx: 40,
    cy: 50,
  },
  {
    id: 'natural',
    label: 'ℕ',
    name: 'Natural',
    color: '#ef4444', // red
    isMember: props.membership?.isNatural ?? false,
    radius: 18,
    cx: 38,
    cy: 50,
  },
])

// Find the innermost set the number belongs to
const innermostSet = computed(() => {
  if (!props.membership) return null

  if (props.membership.isNatural) return 'natural'
  if (props.membership.isInteger) return 'integer'
  if (props.membership.isRational) return 'rational'
  if (props.membership.isReal) return 'real'
  if (props.membership.isComplex) return 'complex'

  return null
})

// Get the innermost set data for marker position
const markerSet = computed(() => {
  if (!innermostSet.value) return null
  return sets.value.find((s) => s.id === innermostSet.value)
})
</script>

<template>
  <div
    class="set-venn-diagram"
    role="img"
    data-testid="venn-diagram"
    :aria-label="
      innermostSet
        ? `Venn diagram showing number belongs to ${innermostSet} numbers and all containing sets`
        : 'Venn diagram of number sets'
    "
  >
    <svg viewBox="0 0 100 100" class="w-full max-w-md mx-auto">
      <defs>
        <!-- Gradient for each set -->
        <radialGradient v-for="set in sets" :id="`gradient-${set.id}`" :key="`gradient-${set.id}`">
          <stop offset="0%" :stop-color="set.color" :stop-opacity="set.isMember ? 0.3 : 0.05" />
          <stop offset="100%" :stop-color="set.color" :stop-opacity="set.isMember ? 0.15 : 0.02" />
        </radialGradient>
      </defs>

      <!-- Draw sets from largest to smallest -->
      <g v-for="set in sets" :key="set.id">
        <circle
          :cx="set.cx"
          :cy="set.cy"
          :r="set.radius"
          :fill="`url(#gradient-${set.id})`"
          :stroke="set.color"
          :stroke-width="set.isMember ? 2 : 0.5"
          :stroke-opacity="set.isMember ? 1 : 0.3"
          class="transition-all duration-300"
        />

        <!-- Set label -->
        <text
          v-if="showLabels"
          :x="set.cx - set.radius + 5"
          :y="set.cy - set.radius + 12"
          :fill="set.color"
          class="text-[8px] font-bold"
          :opacity="set.isMember ? 1 : 0.4"
        >
          {{ set.label }}
        </text>
      </g>

      <!-- Marker for the number's position -->
      <g v-if="markerSet" class="animate-pulse">
        <circle
          :cx="markerSet.cx"
          :cy="markerSet.cy"
          r="4"
          fill="white"
          stroke="currentColor"
          stroke-width="2"
          class="text-primary"
        />
        <circle :cx="markerSet.cx" :cy="markerSet.cy" r="2" class="fill-primary" />
      </g>
    </svg>

    <!-- Legend -->
    <div class="flex flex-wrap justify-center gap-3 mt-4 text-sm">
      <div
        v-for="set in sets"
        :key="`legend-${set.id}`"
        class="flex items-center gap-1.5"
        :class="set.isMember ? 'opacity-100' : 'opacity-40'"
      >
        <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: set.color }" />
        <span>{{ set.label }} {{ set.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
</style>
