<script setup lang="ts">
import { ref, computed } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'

interface FunctionPreset {
  id: string
  name: string
  latex: string
  python: string
  evaluate: (x: number) => number
}

const presets: FunctionPreset[] = [
  {
    id: 'linear',
    name: 'Linear: f(x) = 2x + 3',
    latex: 'f(x) = 2x + 3',
    python: 'def f(x): return 2 * x + 3',
    evaluate: (x) => 2 * x + 3,
  },
  {
    id: 'quadratic',
    name: 'Quadratic: f(x) = x\u00b2',
    latex: 'f(x) = x^2',
    python: 'def f(x): return x ** 2',
    evaluate: (x) => x * x,
  },
  {
    id: 'absolute',
    name: 'Absolute: f(x) = |x|',
    latex: 'f(x) = |x|',
    python: 'def f(x): return abs(x)',
    evaluate: (x) => Math.abs(x),
  },
  {
    id: 'reciprocal',
    name: 'Reciprocal: f(x) = 1/x',
    latex: 'f(x) = \\frac{1}{x}',
    python: 'def f(x): return 1 / x',
    evaluate: (x) => (x !== 0 ? 1 / x : NaN),
  },
]

const selectedPresetId = ref('linear')
const xValue = ref(5)

// Always returns a valid preset (fallback to first preset which always exists)
const selectedPreset = computed((): FunctionPreset => {
  // presets is a non-empty array defined above, so presets[0] is guaranteed to exist
  return presets.find((p) => p.id === selectedPresetId.value) ?? presets[0]!
})

const result = computed(() => selectedPreset.value.evaluate(xValue.value))

const isValidResult = computed(() => Number.isFinite(result.value))

const substitutionLatex = computed(() => {
  const x = xValue.value
  const y = result.value
  const presetId = selectedPreset.value.id

  if (presetId === 'linear') {
    return `f(${x}) = 2(${x}) + 3 = ${2 * x} + 3 = ${y}`
  } else if (presetId === 'quadratic') {
    return `f(${x}) = (${x})^2 = ${y}`
  } else if (presetId === 'absolute') {
    return `f(${x}) = |${x}| = ${y}`
  } else if (presetId === 'reciprocal') {
    if (x === 0) return `f(0) = \\frac{1}{0} = \\text{undefined}`
    return `f(${x}) = \\frac{1}{${x}} = ${y.toFixed(4).replace(/\.?0+$/, '')}`
  }
  return ''
})

// Format result for display
const formattedResult = computed(() => {
  if (!isValidResult.value) return 'undefined'
  if (Number.isInteger(result.value)) return result.value.toString()
  return result.value.toFixed(4).replace(/\.?0+$/, '')
})
</script>

<template>
  <div class="function-demo card p-4 md:p-6">
    <div class="space-y-6">
      <!-- Function Selector -->
      <div>
        <label for="function-select" class="block text-sm font-medium text-text-secondary mb-2">
          Choose a function:
        </label>
        <select
          id="function-select"
          v-model="selectedPresetId"
          data-testid="function-selector"
          class="w-full rounded-md border border-border bg-surface px-3 py-2 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        >
          <option v-for="preset in presets" :key="preset.id" :value="preset.id">
            {{ preset.name }}
          </option>
        </select>
      </div>

      <!-- Function Display -->
      <div class="text-center py-4 bg-math-highlight rounded-lg">
        <MathBlock :formula="selectedPreset.latex" display />
      </div>

      <!-- X Value Slider -->
      <div>
        <label for="x-slider" class="block text-sm font-medium text-text-secondary mb-2">
          Choose a value for x:
        </label>
        <div class="flex items-center gap-4">
          <input
            id="x-slider"
            v-model.number="xValue"
            type="range"
            min="-10"
            max="10"
            step="1"
            data-testid="x-slider"
            class="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span
            class="w-12 text-center font-mono text-lg font-bold text-primary"
            data-testid="x-value"
          >
            {{ xValue }}
          </span>
        </div>
        <div class="flex justify-between text-xs text-text-muted mt-1">
          <span>-10</span>
          <span>0</span>
          <span>10</span>
        </div>
      </div>

      <!-- Calculation Steps -->
      <div class="border-t border-border pt-4">
        <h4 class="text-sm font-medium text-text-secondary mb-3">
          <i class="fa-solid fa-calculator mr-2" aria-hidden="true" />
          Calculation:
        </h4>
        <div class="text-center py-3 bg-surface-alt rounded-lg">
          <MathBlock :formula="substitutionLatex" display />
        </div>
      </div>

      <!-- Result -->
      <div class="text-center">
        <div class="text-sm text-text-secondary mb-1">Result:</div>
        <div
          class="text-3xl font-bold"
          :class="isValidResult ? 'text-primary' : 'text-red-500'"
          data-testid="function-result"
        >
          {{ formattedResult }}
        </div>
      </div>

      <!-- Python Code -->
      <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm">
        <div class="text-gray-400 mb-2 text-xs">Python:</div>
        <code class="text-green-400">{{ selectedPreset.python }}</code>
        <div class="text-gray-400 mt-3">
          <span class="text-gray-500">&gt;&gt;&gt;</span> f({{ xValue }})
        </div>
        <div :class="isValidResult ? 'text-cyan-400' : 'text-red-400'">
          {{ isValidResult ? formattedResult : 'ZeroDivisionError: division by zero' }}
        </div>
      </div>
    </div>
  </div>
</template>
