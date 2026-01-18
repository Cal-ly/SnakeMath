<script setup lang="ts">
import { computed } from 'vue'
import type { Matrix3x3 } from '@/types/math'
import MathBlock from '@/components/content/MathBlock.vue'

interface Props {
  matrix: Matrix3x3
}

const props = defineProps<Props>()

// Format matrix for KaTeX display
const matrixFormula = computed(() => {
  const m = props.matrix
  const format = (n: number) => {
    // Format with up to 3 decimal places, trim trailing zeros
    const formatted = n.toFixed(3).replace(/\.?0+$/, '')
    return formatted === '-0' ? '0' : formatted
  }

  return `\\begin{bmatrix}
${format(m[0][0])} & ${format(m[0][1])} & ${format(m[0][2])} \\\\
${format(m[1][0])} & ${format(m[1][1])} & ${format(m[1][2])} \\\\
${format(m[2][0])} & ${format(m[2][1])} & ${format(m[2][2])}
\\end{bmatrix}`
})
</script>

<template>
  <div class="matrix-3d-display">
    <h4 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      Transformation Matrix
    </h4>

    <div class="p-4 bg-surface rounded-lg border border-border" data-testid="matrix-3d-display">
      <MathBlock :formula="matrixFormula" display />
    </div>

    <!-- Matrix element reference -->
    <div class="mt-3 text-xs text-text-muted">
      <p class="mb-1">
        <strong>M</strong> transforms vectors: <code>v' = M &middot; v</code>
      </p>
      <p>
        Columns represent where basis vectors <span class="text-red-500">i</span>,
        <span class="text-green-500">j</span>, <span class="text-blue-500">k</span> go.
      </p>
    </div>
  </div>
</template>
