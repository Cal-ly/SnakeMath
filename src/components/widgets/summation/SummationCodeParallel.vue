<script setup lang="ts">
import { computed, ref } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import type { SummationPresetId } from '@/types/math'

interface Props {
  /** Selected preset */
  preset: SummationPresetId
  /** Start index */
  start: number
  /** End index */
  end: number
  /** Computed total */
  total: number
  /** Language to display */
  language?: 'python' | 'javascript'
}

const props = withDefaults(defineProps<Props>(), {
  language: 'python',
})

const currentLanguage = ref(props.language)

// Expression mappings for LaTeX
const latexExpressions: Record<SummationPresetId, string> = {
  arithmetic: 'i',
  squares: 'i^2',
  cubes: 'i^3',
  geometric: '2^{i-1}',
  constant: '1',
}

// Expression mappings for code
const codeExpressions: Record<SummationPresetId, { python: string; javascript: string }> = {
  arithmetic: { python: 'i', javascript: 'i' },
  squares: { python: 'i ** 2', javascript: 'i ** 2' },
  cubes: { python: 'i ** 3', javascript: 'i ** 3' },
  geometric: { python: '2 ** (i - 1)', javascript: '2 ** (i - 1)' },
  constant: { python: '1', javascript: '1' },
}

// Generate LaTeX sigma notation
const sigmaLatex = computed(() => {
  const expr = latexExpressions[props.preset]
  return `\\sum_{i=${props.start}}^{${props.end}} ${expr} = ${props.total}`
})

// Generate Python code
const pythonCode = computed(() => {
  const expr = codeExpressions[props.preset].python
  const rangeEnd = props.end + 1 // Python range is exclusive
  return `total = 0
for i in range(${props.start}, ${rangeEnd}):  # i = ${props.start} to ${props.end}
    total += ${expr}
# total = ${props.total}`
})

// Generate JavaScript code
const javascriptCode = computed(() => {
  const expr = codeExpressions[props.preset].javascript
  return `let total = 0;
for (let i = ${props.start}; i <= ${props.end}; i++) {
    total += ${expr};
}
// total = ${props.total}`
})

const currentCode = computed(() => {
  return currentLanguage.value === 'python' ? pythonCode.value : javascriptCode.value
})

function setLanguage(lang: 'python' | 'javascript') {
  currentLanguage.value = lang
}
</script>

<template>
  <div class="summation-code-parallel">
    <!-- Main parallel display -->
    <div class="grid gap-4 md:grid-cols-2">
      <!-- Math notation panel -->
      <div class="math-panel card p-4">
        <div class="flex items-center gap-2 mb-3">
          <i class="fa-solid fa-square-root-variable text-primary" aria-hidden="true" />
          <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide">
            Math Notation
          </h4>
        </div>
        <div class="flex items-center justify-center min-h-[100px] bg-surface-alt rounded-lg p-4">
          <MathBlock :formula="sigmaLatex" display />
        </div>
      </div>

      <!-- Code panel -->
      <div class="code-panel card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-code text-primary" aria-hidden="true" />
            <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide">
              Code Equivalent
            </h4>
          </div>

          <!-- Language toggle -->
          <div class="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              class="px-3 py-1 text-xs font-medium transition-colors"
              :class="
                currentLanguage === 'python'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-muted hover:text-text-primary'
              "
              @click="setLanguage('python')"
            >
              <i class="fa-brands fa-python mr-1" aria-hidden="true" />
              Python
            </button>
            <button
              type="button"
              class="px-3 py-1 text-xs font-medium transition-colors border-l border-border"
              :class="
                currentLanguage === 'javascript'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-muted hover:text-text-primary'
              "
              @click="setLanguage('javascript')"
            >
              <i class="fa-brands fa-js mr-1" aria-hidden="true" />
              JS
            </button>
          </div>
        </div>

        <CodeExample :code="currentCode" :language="currentLanguage" />
      </div>
    </div>

    <!-- Key insight callout -->
    <div
      class="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg text-center"
      role="note"
    >
      <p class="text-primary font-medium">
        <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
        <span class="font-bold">The Key Insight:</span>
        Σ notation is just a for loop with a running total!
      </p>
    </div>

    <!-- Mobile stacked view indicator (hidden on desktop) -->
    <div
      class="md:hidden mt-4 text-center text-xs text-text-muted"
      aria-hidden="true"
    >
      <i class="fa-solid fa-arrows-up-down mr-1" />
      Scroll to compare both representations
    </div>
  </div>
</template>
