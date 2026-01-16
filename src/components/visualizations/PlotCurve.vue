<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Function to plot: (x: number) => number */
  fn: (x: number) => number
  /** Minimum x value to plot */
  xMin: number
  /** Maximum x value to plot */
  xMax: number
  /** Number of sample points */
  samples?: number
  /** Stroke color (CSS value or Tailwind variable) */
  strokeColor?: string
  /** Stroke width */
  strokeWidth?: number
  /** Coordinate transform: data X to SVG X */
  toSvgX: (x: number) => number
  /** Coordinate transform: data Y to SVG Y */
  toSvgY: (y: number) => number
}

const props = withDefaults(defineProps<Props>(), {
  samples: 100,
  strokeColor: 'var(--color-primary)',
  strokeWidth: 2,
})

// Generate path data by sampling the function
const pathData = computed(() => {
  const points: string[] = []
  const step = (props.xMax - props.xMin) / props.samples

  for (let i = 0; i <= props.samples; i++) {
    const x = props.xMin + i * step
    const y = props.fn(x)

    // Skip invalid values (NaN, Infinity)
    if (!isFinite(y)) continue

    const svgX = props.toSvgX(x)
    const svgY = props.toSvgY(y)

    if (points.length === 0) {
      points.push(`M ${svgX} ${svgY}`)
    } else {
      points.push(`L ${svgX} ${svgY}`)
    }
  }

  return points.join(' ')
})
</script>

<template>
  <path
    :d="pathData"
    :stroke="strokeColor"
    :stroke-width="strokeWidth"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="plot-curve"
  />
</template>

<style scoped>
.plot-curve {
  vector-effect: non-scaling-stroke;
}
</style>
