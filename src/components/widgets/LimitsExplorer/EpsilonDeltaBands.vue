<script setup lang="ts">
/**
 * EpsilonDeltaBands - SVG visualization of ε-δ bands
 *
 * Renders:
 * - Horizontal epsilon band around limit value L
 * - Vertical delta interval around approach point a
 * - Visual indication of whether the ε-δ condition is satisfied
 */

import { computed } from 'vue'
import type { LimitResult } from '@/types/math'

// ============================================================================
// Props
// ============================================================================

interface Props {
  epsilon: number
  delta: number
  approachPoint: number
  limitResult: LimitResult | null
  /** Function to convert data x to SVG x */
  xScale: (x: number) => number
  /** Function to convert data y to SVG y */
  yScale: (y: number) => number
  /** Canvas dimensions */
  padding: { top: number; right: number; bottom: number; left: number }
  width: number
  height: number
  /** Whether the current delta satisfies the epsilon condition */
  deltaValid: boolean
}

const props = defineProps<Props>()

// ============================================================================
// Computed
// ============================================================================

/**
 * Limit value for the epsilon band center
 */
const limitValue = computed(() => {
  if (!props.limitResult || props.limitResult.value === null) return null
  if (!isFinite(props.limitResult.value)) return null
  return props.limitResult.value
})

/**
 * Epsilon band rectangle (horizontal band around L)
 */
const epsilonBand = computed(() => {
  if (limitValue.value === null) return null

  const L = limitValue.value
  const yTop = props.yScale(L + props.epsilon)
  const yBottom = props.yScale(L - props.epsilon)

  return {
    x: props.padding.left,
    y: Math.max(props.padding.top, Math.min(yTop, yBottom)),
    width: props.width - props.padding.left - props.padding.right,
    height: Math.abs(yBottom - yTop),
  }
})

/**
 * Delta interval rectangle (vertical band around a)
 */
const deltaBand = computed(() => {
  const a = props.approachPoint
  const xLeft = props.xScale(a - props.delta)
  const xRight = props.xScale(a + props.delta)

  return {
    x: Math.max(props.padding.left, xLeft),
    y: props.padding.top,
    width: Math.min(xRight - xLeft, props.width - props.padding.left - props.padding.right),
    height: props.height - props.padding.top - props.padding.bottom,
  }
})

/**
 * Intersection region (where both conditions apply)
 */
const intersectionRegion = computed(() => {
  if (!epsilonBand.value) return null

  return {
    x: deltaBand.value.x,
    y: epsilonBand.value.y,
    width: deltaBand.value.width,
    height: epsilonBand.value.height,
  }
})

/**
 * Epsilon bound lines (L ± ε)
 */
const epsilonLines = computed(() => {
  if (limitValue.value === null) return []

  const L = limitValue.value
  return [
    { y: props.yScale(L + props.epsilon), label: `L + ε` },
    { y: props.yScale(L - props.epsilon), label: `L - ε` },
  ]
})

/**
 * Delta bound lines (a ± δ)
 */
const deltaLines = computed(() => {
  const a = props.approachPoint
  return [
    { x: props.xScale(a - props.delta), label: `a - δ` },
    { x: props.xScale(a + props.delta), label: `a + δ` },
  ]
})
</script>

<template>
  <g class="epsilon-delta-bands">
    <!-- Delta interval (vertical band) - rendered first (bottom layer) -->
    <rect
      v-if="deltaBand"
      :x="deltaBand.x"
      :y="deltaBand.y"
      :width="deltaBand.width"
      :height="deltaBand.height"
      class="fill-amber-200/40 dark:fill-amber-700/30"
    />

    <!-- Epsilon band (horizontal band) -->
    <rect
      v-if="epsilonBand"
      :x="epsilonBand.x"
      :y="epsilonBand.y"
      :width="epsilonBand.width"
      :height="epsilonBand.height"
      class="fill-blue-200/40 dark:fill-blue-700/30"
    />

    <!-- Intersection region (highlighted) -->
    <rect
      v-if="intersectionRegion"
      :x="intersectionRegion.x"
      :y="intersectionRegion.y"
      :width="intersectionRegion.width"
      :height="intersectionRegion.height"
      :class="
        deltaValid
          ? 'fill-green-300/50 dark:fill-green-600/40'
          : 'fill-red-300/50 dark:fill-red-600/40'
      "
    />

    <!-- Epsilon bound lines -->
    <g v-for="(line, i) in epsilonLines" :key="`eps-${i}`">
      <line
        :x1="padding.left"
        :y1="line.y"
        :x2="width - padding.right"
        :y2="line.y"
        class="stroke-blue-500"
        stroke-width="1.5"
        stroke-dasharray="6,3"
      />
    </g>

    <!-- Delta bound lines -->
    <g v-for="(line, i) in deltaLines" :key="`del-${i}`">
      <line
        :x1="line.x"
        :y1="padding.top"
        :x2="line.x"
        :y2="height - padding.bottom"
        class="stroke-amber-500"
        stroke-width="1.5"
        stroke-dasharray="6,3"
      />
    </g>

    <!-- Epsilon labels -->
    <g v-if="epsilonLines.length > 0" class="text-xs">
      <text
        :x="width - padding.right - 5"
        :y="(epsilonLines[0]?.y ?? 0) - 3"
        text-anchor="end"
        class="fill-blue-600 dark:fill-blue-400 font-medium"
      >
        L + ε
      </text>
      <text
        :x="width - padding.right - 5"
        :y="(epsilonLines[1]?.y ?? 0) + 12"
        text-anchor="end"
        class="fill-blue-600 dark:fill-blue-400 font-medium"
      >
        L - ε
      </text>
    </g>

    <!-- Delta labels -->
    <g class="text-xs">
      <text
        v-for="(line, i) in deltaLines"
        :key="`del-label-${i}`"
        :x="line.x"
        :y="padding.top - 5"
        text-anchor="middle"
        class="fill-amber-600 dark:fill-amber-400 font-medium"
      >
        {{ i === 0 ? 'a - δ' : 'a + δ' }}
      </text>
    </g>
  </g>
</template>
