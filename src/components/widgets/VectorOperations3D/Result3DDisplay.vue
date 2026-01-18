<script setup lang="ts">
import MathBlock from '@/components/content/MathBlock.vue'
import type { Vector3DOperationResult } from '@/composables/useVectors3D'
import type { Vector3D } from '@/types/math'

interface Props {
  result: Vector3DOperationResult
  magnitudeA: number
  magnitudeB?: number
  angle?: number | null
  areParallel?: boolean
  arePerpendicular?: boolean
  showVectorB?: boolean
  crossProduct?: Vector3D
  showCrossProductInfo?: boolean
}

withDefaults(defineProps<Props>(), {
  magnitudeB: 0,
  angle: null,
  areParallel: false,
  arePerpendicular: false,
  showVectorB: true,
  crossProduct: () => ({ x: 0, y: 0, z: 0 }),
  showCrossProductInfo: false,
})
</script>

<template>
  <div class="result-display" data-testid="result-3d-display">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      Result
    </h3>

    <!-- Formula -->
    <div class="mb-4 p-3 bg-surface-alt rounded-lg" data-testid="result-3d-formula">
      <MathBlock :formula="result.formula" display />
    </div>

    <!-- Result Value -->
    <div class="p-4 bg-primary/10 rounded-lg border border-primary/20" data-testid="result-3d-value">
      <div class="text-sm text-text-muted mb-1">Result:</div>
      <div class="text-xl font-mono font-bold text-primary">
        {{ result.formulaResult }}
      </div>
    </div>

    <!-- Vector Properties -->
    <div class="mt-4 space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-text-muted">|A| (magnitude):</span>
        <span class="font-mono" data-testid="magnitude-3d-a">{{ magnitudeA.toFixed(4) }}</span>
      </div>
      <div v-if="showVectorB" class="flex justify-between">
        <span class="text-text-muted">|B| (magnitude):</span>
        <span class="font-mono" data-testid="magnitude-3d-b">{{ magnitudeB.toFixed(4) }}</span>
      </div>
      <div v-if="showVectorB && angle !== null" class="flex justify-between">
        <span class="text-text-muted">Angle between:</span>
        <span class="font-mono" data-testid="angle-3d-between">{{ angle.toFixed(2) }}&deg;</span>
      </div>
    </div>

    <!-- Cross Product Info (for educational context) -->
    <div
      v-if="showCrossProductInfo && showVectorB"
      class="mt-4 p-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg"
      data-testid="cross-product-info"
    >
      <div class="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1">
        Cross Product (A &times; B):
      </div>
      <div class="font-mono text-violet-600 dark:text-violet-400">
        ({{ crossProduct.x.toFixed(2) }}, {{ crossProduct.y.toFixed(2) }}, {{ crossProduct.z.toFixed(2) }})
      </div>
      <p class="text-xs text-violet-600 dark:text-violet-500 mt-1">
        Perpendicular to both A and B (right-hand rule)
      </p>
    </div>

    <!-- Special Relationships -->
    <div v-if="showVectorB && (areParallel || arePerpendicular)" class="mt-4 flex flex-wrap gap-2">
      <span
        v-if="areParallel"
        class="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
        data-testid="parallel-3d-badge"
      >
        || Parallel (cross = 0)
      </span>
      <span
        v-if="arePerpendicular"
        class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
        data-testid="perpendicular-3d-badge"
      >
        &perp; Perpendicular (dot = 0)
      </span>
    </div>
  </div>
</template>
