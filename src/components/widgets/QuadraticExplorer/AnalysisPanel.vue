<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import MathBlock from '@/components/content/MathBlock.vue'
import type { DiscriminantResult, QuadraticRoots, Vertex } from '@/utils/math/quadratic'
import { formatNumber } from '@/utils/math/quadratic'

interface Props {
  discriminant: DiscriminantResult
  roots: QuadraticRoots
  vertex: Vertex
  axisOfSymmetry: number
  isValidQuadratic: boolean
}

const props = defineProps<Props>()

const discriminantLabel = computed(() => {
  if (props.discriminant.rootType === 'two-real') {
    return 'Two distinct real roots'
  } else if (props.discriminant.rootType === 'one-real') {
    return 'One repeated real root'
  } else {
    return 'No real roots (complex)'
  }
})

const rootsDisplay = computed(() => {
  if (props.roots.type === 'two-complex') {
    return null
  }
  return props.roots.roots.map((r) => formatNumber(r)).join(', ')
})

const vertexLatex = computed(() => {
  return `(${formatNumber(props.vertex.x)}, ${formatNumber(props.vertex.y)})`
})

const axisLatex = computed(() => {
  return `x = ${formatNumber(props.axisOfSymmetry)}`
})
</script>

<template>
  <div class="analysis-panel space-y-4">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide">
      <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
      Analysis
    </h3>

    <div v-if="!isValidQuadratic" class="text-amber-600 dark:text-amber-400 text-sm">
      <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
      Not a quadratic (a = 0)
    </div>

    <template v-else>
      <!-- Discriminant -->
      <div class="analysis-item">
        <span class="label">Discriminant:</span>
        <div class="value" data-testid="discriminant-value">
          <MathBlock :formula="`\\Delta = ${formatNumber(discriminant.value)}`" />
          <span class="text-xs text-text-muted ml-2">({{ discriminantLabel }})</span>
        </div>
      </div>

      <!-- Roots -->
      <div class="analysis-item">
        <span class="label">Roots:</span>
        <div class="value" data-testid="roots-display">
          <template v-if="rootsDisplay">
            <MathBlock :formula="`x = ${rootsDisplay}`" />
          </template>
          <div v-else class="text-text-muted">
            <p>No real roots</p>
            <p class="text-xs mt-1">
              The roots are complex numbers. Learn more in
              <RouterLink to="/basics/number-types" class="text-primary hover:underline">
                Number Types
              </RouterLink>.
            </p>
          </div>
        </div>
      </div>

      <!-- Vertex -->
      <div class="analysis-item">
        <span class="label">Vertex:</span>
        <div class="value" data-testid="vertex-display">
          <MathBlock :formula="vertexLatex" />
        </div>
      </div>

      <!-- Axis of Symmetry -->
      <div class="analysis-item">
        <span class="label">Axis of Symmetry:</span>
        <div class="value" data-testid="axis-of-symmetry">
          <MathBlock :formula="axisLatex" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.analysis-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.value {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}
</style>
