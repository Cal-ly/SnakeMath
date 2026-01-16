<script setup lang="ts">
import { computed } from 'vue'
import { formatStatValue } from '@/utils/math/statistics'
import type { Quartiles, OutlierAnalysis } from '@/utils/math/statistics'

interface Props {
  quartiles: Quartiles | null
  outliers: OutlierAnalysis | null
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 120,
})

// SVG dimensions
const svgWidth = 600
const padding = { top: 30, right: 40, bottom: 40, left: 40 }
const chartWidth = svgWidth - padding.left - padding.right
const boxHeight = 40
const boxY = props.height / 2 - boxHeight / 2

// Calculate scale based on data
const dataRange = computed(() => {
  if (!props.quartiles || !props.outliers) {
    return { min: 0, max: 100, range: 100 }
  }

  // Include outliers in the range if present
  let min = Math.min(props.quartiles.min, props.outliers.lowerFence)
  let max = Math.max(props.quartiles.max, props.outliers.upperFence)

  if (props.outliers.outliers.length > 0) {
    min = Math.min(min, ...props.outliers.outliers)
    max = Math.max(max, ...props.outliers.outliers)
  }

  // Add some padding
  const range = max - min || 1
  const padded = range * 0.1
  return {
    min: min - padded,
    max: max + padded,
    range: range + 2 * padded,
  }
})

// Transform data value to SVG x coordinate
function xToSvg(value: number): number {
  return padding.left + ((value - dataRange.value.min) / dataRange.value.range) * chartWidth
}

// Whisker endpoints (actual min/max within fences)
const whiskerLeft = computed(() => {
  if (!props.quartiles || !props.outliers) return 0
  // Left whisker extends to min value within lower fence
  return Math.max(props.quartiles.min, props.outliers.lowerFence)
})

const whiskerRight = computed(() => {
  if (!props.quartiles || !props.outliers) return 0
  // Right whisker extends to max value within upper fence
  return Math.min(props.quartiles.max, props.outliers.upperFence)
})

// Determine actual whisker ends (smallest/largest non-outlier values)
const actualWhiskerLeft = computed(() => {
  if (!props.quartiles || !props.outliers) return props.quartiles?.min ?? 0
  // Find the minimum value that's not an outlier
  return props.quartiles.min >= props.outliers.lowerFence
    ? props.quartiles.min
    : whiskerLeft.value
})

const actualWhiskerRight = computed(() => {
  if (!props.quartiles || !props.outliers) return props.quartiles?.max ?? 0
  // Find the maximum value that's not an outlier
  return props.quartiles.max <= props.outliers.upperFence
    ? props.quartiles.max
    : whiskerRight.value
})
</script>

<template>
  <div class="boxplot-chart" data-testid="boxplot-chart">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-diagram-project mr-2" aria-hidden="true" />
      Box Plot
    </h3>

    <div v-if="quartiles && outliers" class="overflow-x-auto">
      <svg
        :width="svgWidth"
        :height="height"
        :viewBox="`0 0 ${svgWidth} ${height}`"
        class="boxplot-svg w-full"
        aria-label="Box plot showing data distribution with quartiles and outliers"
        role="img"
      >
        <!-- Axis line -->
        <line
          :x1="padding.left"
          :y1="boxY + boxHeight + 10"
          :x2="padding.left + chartWidth"
          :y2="boxY + boxHeight + 10"
          class="stroke-border"
          stroke-width="1"
          data-testid="boxplot-axis"
        />

        <!-- Left whisker (vertical cap) -->
        <line
          :x1="xToSvg(actualWhiskerLeft)"
          :y1="boxY + 10"
          :x2="xToSvg(actualWhiskerLeft)"
          :y2="boxY + boxHeight - 10"
          class="stroke-text-secondary"
          stroke-width="2"
          data-testid="boxplot-whisker-left"
        />

        <!-- Left whisker (horizontal line to box) -->
        <line
          :x1="xToSvg(actualWhiskerLeft)"
          :y1="boxY + boxHeight / 2"
          :x2="xToSvg(quartiles.q1)"
          :y2="boxY + boxHeight / 2"
          class="stroke-text-secondary"
          stroke-width="2"
        />

        <!-- Box (Q1 to Q3) -->
        <rect
          :x="xToSvg(quartiles.q1)"
          :y="boxY"
          :width="xToSvg(quartiles.q3) - xToSvg(quartiles.q1)"
          :height="boxHeight"
          class="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-600 dark:stroke-emerald-400"
          stroke-width="2"
          data-testid="boxplot-box"
        />

        <!-- Median line -->
        <line
          :x1="xToSvg(quartiles.q2)"
          :y1="boxY"
          :x2="xToSvg(quartiles.q2)"
          :y2="boxY + boxHeight"
          class="stroke-emerald-800 dark:stroke-emerald-200"
          stroke-width="3"
          data-testid="boxplot-median"
        />

        <!-- Right whisker (horizontal line from box) -->
        <line
          :x1="xToSvg(quartiles.q3)"
          :y1="boxY + boxHeight / 2"
          :x2="xToSvg(actualWhiskerRight)"
          :y2="boxY + boxHeight / 2"
          class="stroke-text-secondary"
          stroke-width="2"
        />

        <!-- Right whisker (vertical cap) -->
        <line
          :x1="xToSvg(actualWhiskerRight)"
          :y1="boxY + 10"
          :x2="xToSvg(actualWhiskerRight)"
          :y2="boxY + boxHeight - 10"
          class="stroke-text-secondary"
          stroke-width="2"
          data-testid="boxplot-whisker-right"
        />

        <!-- Outliers -->
        <circle
          v-for="(outlier, index) in outliers.outliers"
          :key="`outlier-${index}`"
          :cx="xToSvg(outlier)"
          :cy="boxY + boxHeight / 2"
          r="5"
          class="fill-red-500 dark:fill-red-400"
          :data-testid="`boxplot-outlier-${index}`"
        >
          <title>Outlier: {{ formatStatValue(outlier) }}</title>
        </circle>

        <!-- Labels -->
        <g class="labels text-[10px]">
          <!-- Q1 label -->
          <text
            :x="xToSvg(quartiles.q1)"
            :y="boxY - 5"
            class="fill-text-muted"
            text-anchor="middle"
            data-testid="boxplot-label-q1"
          >
            Q1: {{ formatStatValue(quartiles.q1) }}
          </text>

          <!-- Median label -->
          <text
            :x="xToSvg(quartiles.q2)"
            :y="boxY - 5"
            class="fill-text-primary font-medium"
            text-anchor="middle"
            data-testid="boxplot-label-median"
          >
            Median: {{ formatStatValue(quartiles.q2) }}
          </text>

          <!-- Q3 label -->
          <text
            :x="xToSvg(quartiles.q3)"
            :y="boxY - 5"
            class="fill-text-muted"
            text-anchor="middle"
            data-testid="boxplot-label-q3"
          >
            Q3: {{ formatStatValue(quartiles.q3) }}
          </text>

          <!-- Min/Max labels on axis -->
          <text
            :x="xToSvg(actualWhiskerLeft)"
            :y="boxY + boxHeight + 25"
            class="fill-text-muted"
            text-anchor="middle"
          >
            {{ formatStatValue(actualWhiskerLeft) }}
          </text>
          <text
            :x="xToSvg(actualWhiskerRight)"
            :y="boxY + boxHeight + 25"
            class="fill-text-muted"
            text-anchor="middle"
          >
            {{ formatStatValue(actualWhiskerRight) }}
          </text>
        </g>

        <!-- Legend -->
        <g class="legend" transform="translate(20, 10)">
          <circle cx="0" cy="0" r="4" class="fill-red-500 dark:fill-red-400" />
          <text x="10" y="4" class="fill-text-muted text-[9px]">Outliers</text>

          <line x1="60" y1="0" x2="75" y2="0" class="stroke-text-secondary" stroke-width="2" />
          <text x="80" y="4" class="fill-text-muted text-[9px]">Whiskers</text>

          <rect x="140" y="-6" width="12" height="12" class="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-600 dark:stroke-emerald-400" stroke-width="1" />
          <text x="157" y="4" class="fill-text-muted text-[9px]">IQR (Q1-Q3)</text>
        </g>
      </svg>
    </div>

    <div v-else class="h-32 flex items-center justify-center text-text-muted text-sm">
      No data to display
    </div>
  </div>
</template>

<style scoped>
.boxplot-svg {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
