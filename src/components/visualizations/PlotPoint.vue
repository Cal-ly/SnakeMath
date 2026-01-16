<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** X coordinate (data space) */
  x: number
  /** Y coordinate (data space) */
  y: number
  /** Optional label to display */
  label?: string
  /** Point color */
  color?: string
  /** Point radius */
  size?: number
  /** Coordinate transform: data X to SVG X */
  toSvgX: (x: number) => number
  /** Coordinate transform: data Y to SVG Y */
  toSvgY: (y: number) => number
  /** Show a filled point (default) or outline only */
  filled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  color: 'var(--color-primary)',
  size: 5,
  filled: true,
})

const svgX = computed(() => props.toSvgX(props.x))
const svgY = computed(() => props.toSvgY(props.y))

// Position label above the point
const labelY = computed(() => svgY.value - props.size - 4)
</script>

<template>
  <g class="plot-point">
    <!-- Point circle -->
    <circle
      :cx="svgX"
      :cy="svgY"
      :r="size"
      :fill="filled ? color : 'none'"
      :stroke="color"
      :stroke-width="filled ? 0 : 2"
    />
    <!-- Optional label -->
    <text
      v-if="label"
      :x="svgX"
      :y="labelY"
      text-anchor="middle"
      class="fill-text-primary text-xs font-medium"
    >
      {{ label }}
    </text>
  </g>
</template>
