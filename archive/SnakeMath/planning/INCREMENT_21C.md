# Increment 21C: Widget Core Components

**Parent Plan**: [PHASE_21_PLAN.md](./PHASE_21_PLAN.md)
**Depends On**: [INCREMENT_21A.md](./INCREMENT_21A.md), [INCREMENT_21B.md](./INCREMENT_21B.md)
**Focus**: Build the IntegrationExplorer widget components and SVG visualization

---

## Overview

This increment creates the IntegrationExplorer widget with all its subcomponents. The widget visualizes definite integrals with Riemann sum approximations, following the component architecture established by DerivativeVisualizer (Phase 14).

---

## Component Architecture

```
src/components/widgets/IntegrationExplorer/
├── IntegrationExplorer.vue      # Main orchestrator
├── FunctionSelector.vue         # Preset dropdown with formula display
├── IntegrationCanvas.vue        # SVG visualization
├── BoundsControls.vue           # Lower/upper bound inputs + n slider
├── MethodSelector.vue           # Radio buttons for Riemann methods
├── ResultsDisplay.vue           # Approximation, exact, error display
└── index.ts                     # Barrel exports
```

---

## Tasks

### Task 1: Create Directory and Barrel Export

**File**: `src/components/widgets/IntegrationExplorer/index.ts` (new)

```ts
export { default as IntegrationExplorer } from './IntegrationExplorer.vue'
```

**File**: `src/components/widgets/index.ts` (update)

Add to existing exports:
```ts
export { IntegrationExplorer } from './IntegrationExplorer'
```

---

### Task 2: FunctionSelector Component

**File**: `src/components/widgets/IntegrationExplorer/FunctionSelector.vue` (new)

```vue
<script setup lang="ts">
/**
 * FunctionSelector - Dropdown for integration function presets
 *
 * Displays preset name in dropdown and shows LaTeX formula below.
 */

import { computed } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'
import { INTEGRATION_PRESETS } from '@/utils/math/integration'
import type { IntegrationFunctionPreset } from '@/types/math'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  modelValue: string
  preset?: IntegrationFunctionPreset
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// ============================================================================
// Computed
// ============================================================================

const selectedId = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-3">
      <label for="function-select" class="text-sm font-medium text-text-secondary">
        Function:
      </label>
      <select
        id="function-select"
        v-model="selectedId"
        class="px-3 py-1.5 rounded-md border border-border bg-surface text-text
               focus:ring-2 focus:ring-primary/30 focus:border-primary
               transition-colors"
      >
        <option
          v-for="p in INTEGRATION_PRESETS"
          :key="p.id"
          :value="p.id"
        >
          {{ p.name }}
        </option>
      </select>
    </div>

    <!-- Formula display -->
    <div v-if="preset" class="flex items-center gap-2 text-sm">
      <span class="text-text-secondary">Formula:</span>
      <MathBlock :formula="preset.latex" />
    </div>

    <!-- Description -->
    <p v-if="preset" class="text-xs text-text-muted">
      {{ preset.description }}
    </p>
  </div>
</template>
```

---

### Task 3: BoundsControls Component

**File**: `src/components/widgets/IntegrationExplorer/BoundsControls.vue` (new)

```vue
<script setup lang="ts">
/**
 * BoundsControls - Integration bounds and subdivision controls
 *
 * Provides:
 * - Lower bound (a) input
 * - Upper bound (b) input
 * - Subdivisions (n) slider + number input
 */

import { computed } from 'vue'
import { MIN_N, MAX_N } from '@/utils/math/integration'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  lowerBound: number
  upperBound: number
  subdivisions: number
  isValidBounds: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:lowerBound': [value: number]
  'update:upperBound': [value: number]
  'update:subdivisions': [value: number]
}>()

// ============================================================================
// Computed
// ============================================================================

const localLowerBound = computed({
  get: () => props.lowerBound,
  set: (value: number) => emit('update:lowerBound', value),
})

const localUpperBound = computed({
  get: () => props.upperBound,
  set: (value: number) => emit('update:upperBound', value),
})

const localSubdivisions = computed({
  get: () => props.subdivisions,
  set: (value: number) => emit('update:subdivisions', value),
})

// ============================================================================
// Handlers
// ============================================================================

function handleLowerBoundInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (isFinite(value)) {
    localLowerBound.value = value
  }
}

function handleUpperBoundInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (isFinite(value)) {
    localUpperBound.value = value
  }
}

function handleSubdivisionsInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value, 10)
  if (isFinite(value)) {
    localSubdivisions.value = Math.max(MIN_N, Math.min(MAX_N, value))
  }
}
</script>

<template>
  <div class="space-y-3">
    <!-- Bounds row -->
    <div class="flex flex-wrap items-center gap-4">
      <!-- Lower bound -->
      <div class="flex items-center gap-2">
        <label for="lower-bound" class="text-sm font-medium text-text-secondary whitespace-nowrap">
          Lower (a):
        </label>
        <input
          id="lower-bound"
          type="number"
          step="0.1"
          :value="lowerBound"
          @input="handleLowerBoundInput"
          class="w-20 px-2 py-1 rounded-md border text-center
                 focus:ring-2 focus:ring-primary/30 focus:border-primary
                 transition-colors"
          :class="isValidBounds ? 'border-border bg-surface' : 'border-red-500 bg-red-50 dark:bg-red-900/20'"
        />
      </div>

      <!-- Upper bound -->
      <div class="flex items-center gap-2">
        <label for="upper-bound" class="text-sm font-medium text-text-secondary whitespace-nowrap">
          Upper (b):
        </label>
        <input
          id="upper-bound"
          type="number"
          step="0.1"
          :value="upperBound"
          @input="handleUpperBoundInput"
          class="w-20 px-2 py-1 rounded-md border text-center
                 focus:ring-2 focus:ring-primary/30 focus:border-primary
                 transition-colors"
          :class="isValidBounds ? 'border-border bg-surface' : 'border-red-500 bg-red-50 dark:bg-red-900/20'"
        />
      </div>
    </div>

    <!-- Invalid bounds warning -->
    <p v-if="!isValidBounds" class="text-xs text-red-600 dark:text-red-400">
      <i class="fa-solid fa-triangle-exclamation mr-1" aria-hidden="true" />
      Lower bound must be less than upper bound (a &lt; b)
    </p>

    <!-- Subdivisions row -->
    <div class="flex flex-wrap items-center gap-3">
      <label for="subdivisions" class="text-sm font-medium text-text-secondary whitespace-nowrap">
        Subdivisions (n):
      </label>
      <input
        id="subdivisions-slider"
        type="range"
        :min="MIN_N"
        :max="MAX_N"
        :value="subdivisions"
        @input="handleSubdivisionsInput"
        class="flex-1 min-w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      <input
        id="subdivisions"
        type="number"
        :min="MIN_N"
        :max="MAX_N"
        :value="subdivisions"
        @input="handleSubdivisionsInput"
        class="w-16 px-2 py-1 rounded-md border border-border bg-surface text-center
               focus:ring-2 focus:ring-primary/30 focus:border-primary
               transition-colors"
      />
    </div>
  </div>
</template>
```

---

### Task 4: MethodSelector Component

**File**: `src/components/widgets/IntegrationExplorer/MethodSelector.vue` (new)

```vue
<script setup lang="ts">
/**
 * MethodSelector - Radio buttons for Riemann sum methods
 */

import { computed } from 'vue'
import type { RiemannMethod } from '@/types/math'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  modelValue: RiemannMethod
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: RiemannMethod]
}>()

// ============================================================================
// Data
// ============================================================================

interface MethodOption {
  id: RiemannMethod
  label: string
  description: string
  convergence: string
}

const methods: MethodOption[] = [
  {
    id: 'left',
    label: 'Left',
    description: 'Sample at left endpoint of each interval',
    convergence: 'O(1/n)',
  },
  {
    id: 'right',
    label: 'Right',
    description: 'Sample at right endpoint of each interval',
    convergence: 'O(1/n)',
  },
  {
    id: 'midpoint',
    label: 'Midpoint',
    description: 'Sample at center of each interval',
    convergence: 'O(1/n²)',
  },
  {
    id: 'trapezoidal',
    label: 'Trapezoidal',
    description: 'Use trapezoids instead of rectangles',
    convergence: 'O(1/n²)',
  },
  {
    id: 'simpson',
    label: "Simpson's",
    description: 'Parabolic approximation (requires even n)',
    convergence: 'O(1/n⁴)',
  },
]

// ============================================================================
// Computed
// ============================================================================

const selectedMethod = computed({
  get: () => props.modelValue,
  set: (value: RiemannMethod) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="space-y-2">
    <span class="text-sm font-medium text-text-secondary">Method:</span>

    <div class="flex flex-wrap gap-2">
      <label
        v-for="m in methods"
        :key="m.id"
        class="flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer
               transition-all"
        :class="selectedMethod === m.id
          ? 'bg-primary text-white border-primary'
          : 'bg-surface border-border hover:border-primary'"
        :title="`${m.description} — Convergence: ${m.convergence}`"
      >
        <input
          type="radio"
          :value="m.id"
          v-model="selectedMethod"
          class="sr-only"
          :name="'riemann-method'"
        />
        <span class="text-sm font-medium">{{ m.label }}</span>
      </label>
    </div>

    <!-- Method description -->
    <p class="text-xs text-text-muted">
      {{ methods.find(m => m.id === selectedMethod)?.description }}
      <span class="ml-2 text-primary">
        ({{ methods.find(m => m.id === selectedMethod)?.convergence }})
      </span>
    </p>
  </div>
</template>
```

---

### Task 5: ResultsDisplay Component

**File**: `src/components/widgets/IntegrationExplorer/ResultsDisplay.vue` (new)

```vue
<script setup lang="ts">
/**
 * ResultsDisplay - Shows approximation, exact value, and error
 */

import { computed } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'
import type { IntegrationResult, IntegrationFunctionPreset } from '@/types/math'

// ============================================================================
// Props
// ============================================================================

interface Props {
  result: IntegrationResult | null
  preset?: IntegrationFunctionPreset
  lowerBound: number
  upperBound: number
}

const props = defineProps<Props>()

// ============================================================================
// Computed
// ============================================================================

const approximationDisplay = computed(() => {
  if (!props.result) return '—'
  return props.result.approximation.toFixed(4)
})

const exactDisplay = computed(() => {
  if (!props.result?.exactValue) return '—'
  return props.result.exactValue.toFixed(4)
})

const absoluteErrorDisplay = computed(() => {
  if (!props.result?.absoluteError) return '—'
  return props.result.absoluteError.toFixed(6)
})

const relativeErrorDisplay = computed(() => {
  if (!props.result?.relativeError) return '—'
  return (props.result.relativeError * 100).toFixed(2) + '%'
})

const integralLatex = computed(() => {
  if (!props.preset) return ''
  const a = formatBound(props.lowerBound)
  const b = formatBound(props.upperBound)
  // Simple function name extraction (remove f(x) = prefix)
  const fnPart = props.preset.latex.replace('f(x) = ', '')
  return `\\int_{${a}}^{${b}} ${fnPart} \\, dx`
})

function formatBound(value: number): string {
  // Handle special values
  if (Math.abs(value - Math.PI) < 0.001) return '\\pi'
  if (Math.abs(value - Math.E) < 0.001) return 'e'
  if (Math.abs(value + Math.PI) < 0.001) return '-\\pi'
  // Format numbers nicely
  if (Number.isInteger(value)) return value.toString()
  return value.toFixed(2)
}
</script>

<template>
  <div class="space-y-3">
    <!-- Main results grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <!-- Approximation -->
      <div class="p-3 rounded-lg bg-primary/10 border border-primary/30">
        <div class="text-xs text-primary font-medium mb-1">Approximation</div>
        <div class="text-lg font-mono font-semibold text-primary">
          {{ approximationDisplay }}
        </div>
      </div>

      <!-- Exact value -->
      <div class="p-3 rounded-lg bg-surface-alt border border-border">
        <div class="text-xs text-text-secondary font-medium mb-1">Exact Value</div>
        <div class="text-lg font-mono font-semibold">
          {{ exactDisplay }}
        </div>
      </div>

      <!-- Absolute error -->
      <div class="p-3 rounded-lg bg-surface-alt border border-border">
        <div class="text-xs text-text-secondary font-medium mb-1">Abs. Error</div>
        <div class="text-lg font-mono font-semibold">
          {{ absoluteErrorDisplay }}
        </div>
      </div>

      <!-- Relative error -->
      <div
        class="p-3 rounded-lg border"
        :class="result && result.relativeError !== undefined && result.relativeError < 0.01
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-surface-alt border-border'"
      >
        <div class="text-xs font-medium mb-1"
          :class="result && result.relativeError !== undefined && result.relativeError < 0.01
            ? 'text-green-600 dark:text-green-400'
            : 'text-text-secondary'">
          Rel. Error
        </div>
        <div class="text-lg font-mono font-semibold"
          :class="result && result.relativeError !== undefined && result.relativeError < 0.01
            ? 'text-green-600 dark:text-green-400'
            : ''">
          {{ relativeErrorDisplay }}
        </div>
      </div>
    </div>

    <!-- Integral formula -->
    <div v-if="preset && result" class="p-3 rounded-lg bg-surface-alt border border-border">
      <div class="flex flex-wrap items-center gap-2">
        <MathBlock :formula="integralLatex" />
        <span class="text-text-muted">=</span>
        <span class="font-mono">{{ result.exactValue?.toFixed(4) ?? '?' }}</span>
        <span class="text-text-muted ml-2">
          ({{ preset.exactValueDisplay }})
        </span>
      </div>
    </div>
  </div>
</template>
```

---

### Task 6: IntegrationCanvas Component

**File**: `src/components/widgets/IntegrationExplorer/IntegrationCanvas.vue` (new)

This is the largest component — it renders the SVG visualization.

```vue
<script setup lang="ts">
/**
 * IntegrationCanvas - SVG visualization of function and Riemann sum
 *
 * Renders:
 * - Coordinate axes with grid
 * - Function curve
 * - Shaded area under curve (signed: blue positive, red negative)
 * - Riemann rectangles/trapezoids
 * - Integration bounds markers
 *
 * D-124: Use blue for positive area, red for negative
 * D-126: Focus on geometric interpretation
 */

import { computed, ref } from 'vue'
import type { RiemannSumResult, RiemannMethod } from '@/types/math'

// ============================================================================
// Props
// ============================================================================

interface Props {
  functionPoints: Array<{ x: number; y: number }>
  riemannResult: RiemannSumResult | null
  lowerBound: number
  upperBound: number
  viewDomain: { min: number; max: number }
  method: RiemannMethod
}

const props = defineProps<Props>()

// ============================================================================
// Constants
// ============================================================================

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400
const PADDING = { top: 20, right: 30, bottom: 40, left: 50 }
const PLOT_WIDTH = CANVAS_WIDTH - PADDING.left - PADDING.right
const PLOT_HEIGHT = CANVAS_HEIGHT - PADDING.top - PADDING.bottom

// ============================================================================
// Refs
// ============================================================================

const hoveredIndex = ref<number | null>(null)

// ============================================================================
// Scale Functions
// ============================================================================

const yRange = computed(() => {
  if (props.functionPoints.length === 0) {
    return { min: -1, max: 1 }
  }

  const yValues = props.functionPoints
    .filter(p => isFinite(p.y))
    .map(p => p.y)

  if (yValues.length === 0) {
    return { min: -1, max: 1 }
  }

  let min = Math.min(...yValues, 0) // Always include 0
  let max = Math.max(...yValues, 0)

  // Add padding
  const range = max - min || 1
  min -= range * 0.1
  max += range * 0.1

  return { min, max }
})

function scaleX(x: number): number {
  const { min, max } = props.viewDomain
  return PADDING.left + ((x - min) / (max - min)) * PLOT_WIDTH
}

function scaleY(y: number): number {
  const { min, max } = yRange.value
  return PADDING.top + PLOT_HEIGHT - ((y - min) / (max - min)) * PLOT_HEIGHT
}

// ============================================================================
// Computed SVG Data
// ============================================================================

/**
 * Generate SVG path for the function curve
 */
const curvePath = computed(() => {
  const points = props.functionPoints
  if (points.length === 0) return ''

  let path = ''
  let isDrawing = false

  for (const point of points) {
    if (!isFinite(point.y) || Math.abs(point.y) > 1000) {
      // Break in curve (discontinuity or out of range)
      isDrawing = false
      continue
    }

    const x = scaleX(point.x)
    const y = scaleY(point.y)

    // Clamp y to canvas
    const clampedY = Math.max(PADDING.top, Math.min(PADDING.top + PLOT_HEIGHT, y))

    if (!isDrawing) {
      path += `M ${x} ${clampedY} `
      isDrawing = true
    } else {
      path += `L ${x} ${clampedY} `
    }
  }

  return path
})

/**
 * Generate shaded area path (for exact area visualization)
 */
const shadedAreaPath = computed(() => {
  if (!props.riemannResult || props.functionPoints.length === 0) return ''

  const { min, max } = props.viewDomain
  const points = props.functionPoints.filter(
    p => p.x >= props.lowerBound && p.x <= props.upperBound && isFinite(p.y)
  )

  if (points.length === 0) return ''

  // Start from bottom left
  let path = `M ${scaleX(props.lowerBound)} ${scaleY(0)} `

  // Draw along curve
  for (const point of points) {
    const y = Math.max(yRange.value.min, Math.min(yRange.value.max, point.y))
    path += `L ${scaleX(point.x)} ${scaleY(y)} `
  }

  // Close back to x-axis
  path += `L ${scaleX(props.upperBound)} ${scaleY(0)} Z`

  return path
})

/**
 * Generate Riemann rectangles/trapezoids for visualization
 */
const riemannShapes = computed(() => {
  if (!props.riemannResult) return []

  return props.riemannResult.samplePoints.map((point, index) => {
    const leftX = scaleX(point.leftX)
    const rightX = scaleX(point.leftX + point.width)
    const width = rightX - leftX
    const y0 = scaleY(0)

    // Determine if area is positive or negative
    const isPositive = point.y >= 0

    if (props.method === 'trapezoidal' && point.rightY !== undefined) {
      // Trapezoid
      const leftY = scaleY(point.y)
      const rightY = scaleY(point.rightY)
      return {
        type: 'trapezoid' as const,
        points: `${leftX},${y0} ${leftX},${leftY} ${rightX},${rightY} ${rightX},${y0}`,
        isPositive,
        index,
        area: props.riemannResult!.areas[index] ?? 0,
      }
    } else {
      // Rectangle
      const sampleY = scaleY(point.y)
      const height = Math.abs(sampleY - y0)
      const top = Math.min(sampleY, y0)

      return {
        type: 'rectangle' as const,
        x: leftX,
        y: top,
        width,
        height,
        isPositive,
        index,
        area: props.riemannResult!.areas[index] ?? 0,
      }
    }
  })
})

/**
 * X-axis tick marks
 */
const xTicks = computed(() => {
  const { min, max } = props.viewDomain
  const range = max - min
  const step = calculateTickStep(range)
  const ticks: Array<{ value: number; x: number; label: string }> = []

  const start = Math.ceil(min / step) * step
  for (let value = start; value <= max; value += step) {
    ticks.push({
      value,
      x: scaleX(value),
      label: formatTickLabel(value),
    })
  }

  return ticks
})

/**
 * Y-axis tick marks
 */
const yTicks = computed(() => {
  const { min, max } = yRange.value
  const range = max - min
  const step = calculateTickStep(range)
  const ticks: Array<{ value: number; y: number; label: string }> = []

  const start = Math.ceil(min / step) * step
  for (let value = start; value <= max; value += step) {
    ticks.push({
      value,
      y: scaleY(value),
      label: formatTickLabel(value),
    })
  }

  return ticks
})

// ============================================================================
// Helper Functions
// ============================================================================

function calculateTickStep(range: number): number {
  const roughStep = range / 5
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
  const residual = roughStep / magnitude

  if (residual > 5) return 10 * magnitude
  if (residual > 2) return 5 * magnitude
  if (residual > 1) return 2 * magnitude
  return magnitude
}

function formatTickLabel(value: number): string {
  if (Math.abs(value - Math.PI) < 0.01) return 'π'
  if (Math.abs(value + Math.PI) < 0.01) return '-π'
  if (Math.abs(value - Math.E) < 0.01) return 'e'
  if (Math.abs(value) < 0.001) return '0'
  if (Math.abs(value) >= 100 || (Math.abs(value) < 0.01 && value !== 0)) {
    return value.toExponential(1)
  }
  return value.toFixed(1).replace(/\.0$/, '')
}

function handleShapeHover(index: number | null) {
  hoveredIndex.value = index
}
</script>

<template>
  <div class="relative">
    <svg
      :viewBox="`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`"
      class="w-full h-auto bg-white dark:bg-gray-900 rounded-lg border border-border"
      role="img"
      aria-label="Integration visualization showing function curve and Riemann sum approximation"
    >
      <!-- Grid lines -->
      <g class="grid-lines">
        <!-- Vertical grid -->
        <line
          v-for="tick in xTicks"
          :key="`vgrid-${tick.value}`"
          :x1="tick.x"
          :y1="PADDING.top"
          :x2="tick.x"
          :y2="PADDING.top + PLOT_HEIGHT"
          class="stroke-gray-200 dark:stroke-gray-700"
          stroke-width="1"
        />
        <!-- Horizontal grid -->
        <line
          v-for="tick in yTicks"
          :key="`hgrid-${tick.value}`"
          :x1="PADDING.left"
          :y1="tick.y"
          :x2="PADDING.left + PLOT_WIDTH"
          :y2="tick.y"
          class="stroke-gray-200 dark:stroke-gray-700"
          stroke-width="1"
        />
      </g>

      <!-- Shaded area (faint background) -->
      <path
        v-if="shadedAreaPath"
        :d="shadedAreaPath"
        class="fill-primary/10"
      />

      <!-- Riemann shapes -->
      <g class="riemann-shapes">
        <template v-for="shape in riemannShapes" :key="`shape-${shape.index}`">
          <!-- Rectangle -->
          <rect
            v-if="shape.type === 'rectangle'"
            :x="shape.x"
            :y="shape.y"
            :width="shape.width"
            :height="shape.height"
            :class="[
              'transition-opacity cursor-pointer',
              shape.isPositive
                ? 'fill-blue-500/40 stroke-blue-600 dark:fill-blue-400/40 dark:stroke-blue-400'
                : 'fill-red-500/40 stroke-red-600 dark:fill-red-400/40 dark:stroke-red-400',
              hoveredIndex === shape.index ? 'opacity-100' : 'opacity-70'
            ]"
            stroke-width="1"
            @mouseenter="handleShapeHover(shape.index)"
            @mouseleave="handleShapeHover(null)"
          />
          <!-- Trapezoid -->
          <polygon
            v-else-if="shape.type === 'trapezoid'"
            :points="shape.points"
            :class="[
              'transition-opacity cursor-pointer',
              shape.isPositive
                ? 'fill-blue-500/40 stroke-blue-600 dark:fill-blue-400/40 dark:stroke-blue-400'
                : 'fill-red-500/40 stroke-red-600 dark:fill-red-400/40 dark:stroke-red-400',
              hoveredIndex === shape.index ? 'opacity-100' : 'opacity-70'
            ]"
            stroke-width="1"
            @mouseenter="handleShapeHover(shape.index)"
            @mouseleave="handleShapeHover(null)"
          />
        </template>
      </g>

      <!-- X-axis (y = 0) -->
      <line
        :x1="PADDING.left"
        :y1="scaleY(0)"
        :x2="PADDING.left + PLOT_WIDTH"
        :y2="scaleY(0)"
        class="stroke-gray-400 dark:stroke-gray-500"
        stroke-width="1.5"
      />

      <!-- Y-axis (x = 0, if visible) -->
      <line
        v-if="viewDomain.min <= 0 && viewDomain.max >= 0"
        :x1="scaleX(0)"
        :y1="PADDING.top"
        :x2="scaleX(0)"
        :y2="PADDING.top + PLOT_HEIGHT"
        class="stroke-gray-400 dark:stroke-gray-500"
        stroke-width="1.5"
      />

      <!-- Function curve -->
      <path
        :d="curvePath"
        fill="none"
        class="stroke-primary"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Bound markers -->
      <line
        :x1="scaleX(lowerBound)"
        :y1="PADDING.top"
        :x2="scaleX(lowerBound)"
        :y2="PADDING.top + PLOT_HEIGHT"
        class="stroke-amber-500"
        stroke-width="2"
        stroke-dasharray="4,4"
      />
      <line
        :x1="scaleX(upperBound)"
        :y1="PADDING.top"
        :x2="scaleX(upperBound)"
        :y2="PADDING.top + PLOT_HEIGHT"
        class="stroke-amber-500"
        stroke-width="2"
        stroke-dasharray="4,4"
      />

      <!-- Bound labels -->
      <text
        :x="scaleX(lowerBound)"
        :y="PADDING.top + PLOT_HEIGHT + 20"
        class="fill-amber-600 dark:fill-amber-400 text-sm font-medium"
        text-anchor="middle"
      >
        a
      </text>
      <text
        :x="scaleX(upperBound)"
        :y="PADDING.top + PLOT_HEIGHT + 20"
        class="fill-amber-600 dark:fill-amber-400 text-sm font-medium"
        text-anchor="middle"
      >
        b
      </text>

      <!-- X-axis ticks and labels -->
      <g class="x-axis">
        <template v-for="tick in xTicks" :key="`xtick-${tick.value}`">
          <line
            :x1="tick.x"
            :y1="PADDING.top + PLOT_HEIGHT"
            :x2="tick.x"
            :y2="PADDING.top + PLOT_HEIGHT + 5"
            class="stroke-gray-500"
            stroke-width="1"
          />
          <text
            :x="tick.x"
            :y="PADDING.top + PLOT_HEIGHT + 18"
            class="fill-text-secondary text-xs"
            text-anchor="middle"
          >
            {{ tick.label }}
          </text>
        </template>
      </g>

      <!-- Y-axis ticks and labels -->
      <g class="y-axis">
        <template v-for="tick in yTicks" :key="`ytick-${tick.value}`">
          <line
            :x1="PADDING.left - 5"
            :y1="tick.y"
            :x2="PADDING.left"
            :y2="tick.y"
            class="stroke-gray-500"
            stroke-width="1"
          />
          <text
            :x="PADDING.left - 10"
            :y="tick.y + 4"
            class="fill-text-secondary text-xs"
            text-anchor="end"
          >
            {{ tick.label }}
          </text>
        </template>
      </g>
    </svg>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-4 mt-2 text-xs text-text-secondary">
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 bg-blue-500/60 border border-blue-600 rounded-sm" />
        <span>Positive area</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 bg-red-500/60 border border-red-600 rounded-sm" />
        <span>Negative area</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-0.5 bg-primary" />
        <span>f(x)</span>
      </div>
    </div>

    <!-- Hover tooltip -->
    <div
      v-if="hoveredIndex !== null && riemannShapes[hoveredIndex]"
      class="absolute top-2 right-2 px-2 py-1 bg-surface border border-border rounded shadow-lg text-xs"
    >
      <div>
        Rectangle {{ hoveredIndex + 1 }}:
        <span class="font-mono">{{ riemannShapes[hoveredIndex]?.area.toFixed(4) }}</span>
      </div>
    </div>
  </div>
</template>
```

---

### Task 7: Main IntegrationExplorer Component

**File**: `src/components/widgets/IntegrationExplorer/IntegrationExplorer.vue` (new)

```vue
<script setup lang="ts">
/**
 * IntegrationExplorer - Main widget for exploring definite integrals
 *
 * Orchestrates all subcomponents and manages state via useIntegration composable.
 *
 * D-120: Widget name IntegrationExplorer
 * D-121: Single view with collapsible panels
 * D-127: URL state sync for shareable configurations
 */

import { useIntegration } from '@/composables/useIntegration'
import FunctionSelector from './FunctionSelector.vue'
import BoundsControls from './BoundsControls.vue'
import MethodSelector from './MethodSelector.vue'
import ResultsDisplay from './ResultsDisplay.vue'
import IntegrationCanvas from './IntegrationCanvas.vue'

// ============================================================================
// Props
// ============================================================================

interface Props {
  /** Enable URL state synchronization */
  syncUrl?: boolean
  /** Initial preset ID */
  initialPreset?: string
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: false,
  initialPreset: undefined,
})

// ============================================================================
// State
// ============================================================================

const {
  // State
  selectedPresetId,
  lowerBound,
  upperBound,
  subdivisions,
  method,
  viewDomain,
  // Computed
  selectedPreset,
  riemannResult,
  integrationResult,
  functionPoints,
  isValidBounds,
  // Methods
  selectPreset,
  setLowerBound,
  setUpperBound,
  setSubdivisions,
  setMethod,
  resetToPresetDefaults,
} = useIntegration({
  initialPreset: props.initialPreset,
  syncUrl: props.syncUrl,
})

// ============================================================================
// Handlers
// ============================================================================

function handlePresetChange(id: string) {
  selectPreset(id)
}
</script>

<template>
  <div class="space-y-4 p-4 rounded-lg border border-border bg-surface">
    <!-- Header: Function selector -->
    <FunctionSelector
      :model-value="selectedPresetId"
      :preset="selectedPreset"
      @update:model-value="handlePresetChange"
    />

    <hr class="border-border" />

    <!-- Controls: Bounds and subdivisions -->
    <BoundsControls
      :lower-bound="lowerBound"
      :upper-bound="upperBound"
      :subdivisions="subdivisions"
      :is-valid-bounds="isValidBounds"
      @update:lower-bound="setLowerBound"
      @update:upper-bound="setUpperBound"
      @update:subdivisions="setSubdivisions"
    />

    <!-- Visualization -->
    <IntegrationCanvas
      :function-points="functionPoints"
      :riemann-result="riemannResult"
      :lower-bound="lowerBound"
      :upper-bound="upperBound"
      :view-domain="viewDomain"
      :method="method"
    />

    <!-- Results -->
    <ResultsDisplay
      :result="integrationResult"
      :preset="selectedPreset"
      :lower-bound="lowerBound"
      :upper-bound="upperBound"
    />

    <hr class="border-border" />

    <!-- Method selector -->
    <MethodSelector v-model="method" />

    <!-- Reset button -->
    <div class="flex justify-end">
      <button
        type="button"
        class="px-3 py-1.5 text-sm rounded-md border border-border
               hover:border-primary hover:text-primary
               transition-colors"
        @click="resetToPresetDefaults"
      >
        <i class="fa-solid fa-rotate-left mr-1.5" aria-hidden="true" />
        Reset to Defaults
      </button>
    </div>
  </div>
</template>
```

---

## File Checklist

| File | Action | Status |
|------|--------|--------|
| `src/components/widgets/IntegrationExplorer/index.ts` | Create new | ⬜ |
| `src/components/widgets/IntegrationExplorer/FunctionSelector.vue` | Create new | ⬜ |
| `src/components/widgets/IntegrationExplorer/BoundsControls.vue` | Create new | ⬜ |
| `src/components/widgets/IntegrationExplorer/MethodSelector.vue` | Create new | ⬜ |
| `src/components/widgets/IntegrationExplorer/ResultsDisplay.vue` | Create new | ⬜ |
| `src/components/widgets/IntegrationExplorer/IntegrationCanvas.vue` | Create new | ⬜ |
| `src/components/widgets/IntegrationExplorer/IntegrationExplorer.vue` | Create new | ⬜ |
| `src/components/widgets/index.ts` | Update exports | ⬜ |

---

## Success Criteria

- [ ] Widget compiles without errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Widget renders in browser (manual test)
- [ ] Preset selection works and updates all displays
- [ ] Bounds inputs update visualization
- [ ] n slider updates number of Riemann shapes
- [ ] Method selector changes shape appearance
- [ ] Signed area shows blue (positive) and red (negative)
- [ ] Results display shows approximation, exact, and errors
- [ ] Responsive layout works on mobile
- [ ] Keyboard navigation works for all controls

---

## Manual Testing Checklist

1. **Preset selection**
   - [ ] Changing preset updates formula display
   - [ ] Bounds update to preset defaults
   - [ ] Visualization updates immediately

2. **Bounds controls**
   - [ ] Lower bound input works
   - [ ] Upper bound input works
   - [ ] Invalid bounds show error styling
   - [ ] n slider drags smoothly
   - [ ] n number input accepts manual entry

3. **Method selector**
   - [ ] All 5 methods selectable
   - [ ] Description updates for each method
   - [ ] Visualization shows appropriate shapes

4. **Canvas visualization**
   - [ ] Function curve renders correctly
   - [ ] Riemann rectangles/trapezoids visible
   - [ ] Positive area is blue
   - [ ] Negative area is red
   - [ ] Bound markers (a, b) visible
   - [ ] Hovering shapes shows tooltip

5. **Results display**
   - [ ] Approximation updates with parameters
   - [ ] Exact value shows for all presets
   - [ ] Error decreases as n increases
   - [ ] Low error (< 1%) shows green styling

---

## Notes

- The Canvas component is the most complex; may need performance optimization for high n
- Trapezoid shapes use SVG `<polygon>` instead of `<rect>`
- Simpson's rule displays as rectangles since parabolic segments are complex to render
- Consider adding touch support for slider in future iteration
