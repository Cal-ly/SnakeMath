<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Type of line: vertical or horizontal */
  type: 'vertical' | 'horizontal'
  /** Value on the perpendicular axis (x for vertical, y for horizontal) */
  value: number
  /** Stroke color */
  strokeColor?: string
  /** Stroke width */
  strokeWidth?: number
  /** Use dashed line */
  dashed?: boolean
  /** Optional label */
  label?: string
  /** SVG bounds for line extent */
  svgXMin: number
  svgXMax: number
  svgYMin: number
  svgYMax: number
  /** Coordinate transform: data X to SVG X */
  toSvgX: (x: number) => number
  /** Coordinate transform: data Y to SVG Y */
  toSvgY: (y: number) => number
}

const props = withDefaults(defineProps<Props>(), {
  strokeColor: 'var(--color-text-muted)',
  strokeWidth: 1,
  dashed: false,
  label: '',
})

// Calculate line endpoints based on type
const lineCoords = computed(() => {
  if (props.type === 'vertical') {
    const x = props.toSvgX(props.value)
    return {
      x1: x,
      y1: props.svgYMin,
      x2: x,
      y2: props.svgYMax,
    }
  } else {
    const y = props.toSvgY(props.value)
    return {
      x1: props.svgXMin,
      y1: y,
      x2: props.svgXMax,
      y2: y,
    }
  }
})

// Label position
const labelPos = computed(() => {
  if (props.type === 'vertical') {
    return {
      x: props.toSvgX(props.value) + 4,
      y: props.svgYMin + 12,
    }
  } else {
    return {
      x: props.svgXMax - 4,
      y: props.toSvgY(props.value) - 4,
    }
  }
})

const dashArray = computed(() => (props.dashed ? '5,5' : 'none'))
</script>

<template>
  <g class="plot-line">
    <line
      :x1="lineCoords.x1"
      :y1="lineCoords.y1"
      :x2="lineCoords.x2"
      :y2="lineCoords.y2"
      :stroke="strokeColor"
      :stroke-width="strokeWidth"
      :stroke-dasharray="dashArray"
    />
    <text
      v-if="label"
      :x="labelPos.x"
      :y="labelPos.y"
      :text-anchor="type === 'vertical' ? 'start' : 'end'"
      class="fill-text-muted text-[10px]"
    >
      {{ label }}
    </text>
  </g>
</template>
