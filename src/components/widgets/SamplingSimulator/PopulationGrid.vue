<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Population values */
  population: number[]
  /** Indices of sampled items (highlighted) */
  sampledIndices: number[]
  /** Maximum items to display (for performance) */
  maxDisplay?: number
  /** Population statistics */
  stats?: {
    mean: number
    stdDev: number
    min: number
    max: number
  } | null
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplay: 500,
  stats: null,
})

// Determine display mode - show representative sample for large populations
const displayMode = computed(() => {
  return props.population.length > props.maxDisplay ? 'sample' : 'full'
})

// Get display items
const displayItems = computed(() => {
  if (displayMode.value === 'full') {
    return props.population.map((value, index) => ({
      index,
      value,
      isSampled: props.sampledIndices.includes(index),
    }))
  }

  // For large populations, show a subset but include sampled items
  const sampledSet = new Set(props.sampledIndices)
  const items: { index: number; value: number; isSampled: boolean }[] = []

  // Always include sampled items first
  for (const idx of props.sampledIndices) {
    if (idx < props.population.length) {
      items.push({
        index: idx,
        value: props.population[idx]!,
        isSampled: true,
      })
    }
  }

  // Fill remaining slots with random non-sampled items
  const remaining = props.maxDisplay - items.length
  const step = Math.ceil(props.population.length / remaining)
  for (let i = 0; i < props.population.length && items.length < props.maxDisplay; i += step) {
    if (!sampledSet.has(i)) {
      items.push({
        index: i,
        value: props.population[i]!,
        isSampled: false,
      })
    }
  }

  return items
})

// Calculate grid dimensions based on item count
const gridCols = computed(() => {
  const count = displayItems.value.length
  if (count <= 100) return 10
  if (count <= 200) return 14
  return 20
})

// Calculate color based on value (normalized to range)
function getColor(value: number): string {
  if (!props.stats) return 'hsl(210, 70%, 50%)'

  const { min, max } = props.stats
  const range = max - min
  if (range === 0) return 'hsl(210, 70%, 50%)'

  // Normalize to 0-1
  const normalized = (value - min) / range
  // Map to hue: low values = blue (210), high values = red (0)
  const hue = 210 - normalized * 210
  return `hsl(${hue}, 70%, 50%)`
}

const populationSizeDisplay = computed(() => {
  const n = props.population.length
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
})
</script>

<template>
  <div class="population-grid" data-testid="population-grid">
    <!-- Header with stats -->
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide">
        <i class="fa-solid fa-users mr-2" aria-hidden="true" />
        Population
      </h4>
      <div class="flex items-center gap-4 text-xs text-text-secondary">
        <span>N = {{ populationSizeDisplay }}</span>
        <span v-if="stats">μ = {{ stats.mean.toFixed(1) }}</span>
        <span v-if="stats">σ = {{ stats.stdDev.toFixed(1) }}</span>
      </div>
    </div>

    <!-- Grid visualization -->
    <div
      class="grid gap-0.5 p-2 bg-surface-alt rounded-lg border border-border overflow-hidden"
      :style="{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }"
      role="img"
      :aria-label="`Population grid showing ${population.length} items, ${sampledIndices.length} sampled`"
    >
      <div
        v-for="item in displayItems"
        :key="item.index"
        class="aspect-square rounded-sm transition-all duration-150"
        :class="[
          item.isSampled
            ? 'ring-2 ring-primary ring-offset-1 ring-offset-surface scale-110 z-10'
            : 'opacity-60',
        ]"
        :style="{ backgroundColor: getColor(item.value) }"
        :title="`Value: ${item.value.toFixed(2)}${item.isSampled ? ' (sampled)' : ''}`"
        :data-testid="item.isSampled ? 'sampled-item' : 'population-item'"
      />
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-between mt-2 text-xs text-text-muted">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-sm bg-primary ring-2 ring-primary ring-offset-1" />
        <span>Sampled ({{ sampledIndices.length }})</span>
      </div>
      <div v-if="displayMode === 'sample'" class="text-right">
        Showing {{ displayItems.length }} of {{ population.length }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.population-grid {
  --min-touch-target: 44px;
}
</style>
