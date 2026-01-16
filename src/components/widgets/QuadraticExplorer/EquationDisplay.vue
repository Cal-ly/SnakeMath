<script setup lang="ts">
import { computed } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'
import type { QuadraticCoefficients, VertexForm, FactoredForm } from '@/utils/math/quadratic'
import { formatNumber } from '@/utils/math/quadratic'

interface Props {
  coefficients: QuadraticCoefficients
  vertexForm: VertexForm
  factoredForm: FactoredForm | null
}

const props = defineProps<Props>()

// Build standard form LaTeX: y = ax² + bx + c
const standardFormLatex = computed(() => {
  const { a, b, c } = props.coefficients

  const terms: string[] = []

  // ax² term
  if (a !== 0) {
    if (a === 1) {
      terms.push('x^2')
    } else if (a === -1) {
      terms.push('-x^2')
    } else {
      terms.push(`${formatNumber(a)}x^2`)
    }
  }

  // bx term
  if (b !== 0) {
    if (terms.length === 0) {
      // First term
      if (b === 1) {
        terms.push('x')
      } else if (b === -1) {
        terms.push('-x')
      } else {
        terms.push(`${formatNumber(b)}x`)
      }
    } else {
      if (b === 1) {
        terms.push('+ x')
      } else if (b === -1) {
        terms.push('- x')
      } else if (b > 0) {
        terms.push(`+ ${formatNumber(b)}x`)
      } else {
        terms.push(`- ${formatNumber(Math.abs(b))}x`)
      }
    }
  }

  // c term
  if (c !== 0) {
    if (terms.length === 0) {
      terms.push(formatNumber(c))
    } else if (c > 0) {
      terms.push(`+ ${formatNumber(c)}`)
    } else {
      terms.push(`- ${formatNumber(Math.abs(c))}`)
    }
  }

  // Handle case where all terms are 0
  if (terms.length === 0) {
    terms.push('0')
  }

  return `y = ${terms.join(' ')}`
})

// Build vertex form LaTeX: y = a(x - h)² + k
const vertexFormLatex = computed(() => {
  const { a, h, k } = props.vertexForm

  let aStr = ''
  if (a === 1) {
    aStr = ''
  } else if (a === -1) {
    aStr = '-'
  } else {
    aStr = formatNumber(a)
  }

  let hStr = ''
  if (h === 0) {
    hStr = 'x'
  } else if (h > 0) {
    hStr = `(x - ${formatNumber(h)})`
  } else {
    hStr = `(x + ${formatNumber(Math.abs(h))})`
  }

  let kStr = ''
  if (k !== 0) {
    if (k > 0) {
      kStr = ` + ${formatNumber(k)}`
    } else {
      kStr = ` - ${formatNumber(Math.abs(k))}`
    }
  }

  return `y = ${aStr}${hStr}^2${kStr}`
})

// Build factored form LaTeX: y = a(x - r₁)(x - r₂)
const factoredFormLatex = computed(() => {
  if (!props.factoredForm) return null

  const { a, r1, r2 } = props.factoredForm

  let aStr = ''
  if (a === 1) {
    aStr = ''
  } else if (a === -1) {
    aStr = '-'
  } else {
    aStr = formatNumber(a)
  }

  function formatRoot(r: number): string {
    if (r === 0) return 'x'
    if (r > 0) return `(x - ${formatNumber(r)})`
    return `(x + ${formatNumber(Math.abs(r))})`
  }

  // If roots are the same (repeated), show as squared
  if (Math.abs(r1 - r2) < 0.0001) {
    return `y = ${aStr}${formatRoot(r1)}^2`
  }

  return `y = ${aStr}${formatRoot(r1)}${formatRoot(r2)}`
})
</script>

<template>
  <div class="equation-display space-y-3">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide">
      <i class="fa-solid fa-superscript mr-2" aria-hidden="true" />
      Equation Forms
    </h3>

    <!-- Standard Form -->
    <div class="equation-row" data-testid="equation-standard">
      <span class="text-xs text-text-muted">Standard:</span>
      <MathBlock :formula="standardFormLatex" class="text-lg" />
    </div>

    <!-- Vertex Form -->
    <div class="equation-row" data-testid="equation-vertex">
      <span class="text-xs text-text-muted">Vertex:</span>
      <MathBlock :formula="vertexFormLatex" class="text-lg" />
    </div>

    <!-- Factored Form (only if real roots) -->
    <div class="equation-row" data-testid="equation-factored">
      <span class="text-xs text-text-muted">Factored:</span>
      <template v-if="factoredFormLatex">
        <MathBlock :formula="factoredFormLatex" class="text-lg" />
      </template>
      <span v-else class="text-sm text-text-muted italic">
        Not available (complex roots)
      </span>
    </div>
  </div>
</template>

<style scoped>
.equation-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
