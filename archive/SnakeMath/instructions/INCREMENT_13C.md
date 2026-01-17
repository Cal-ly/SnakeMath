# Increment 13C: ε-δ Visualization

**Goal**: Add epsilon-delta band visualization and controls to the LimitsExplorer widget.

**Prerequisites**: Increment 13B complete (widget core)

---

## Files to Create/Modify

### 1. Create Epsilon-Delta Controls: `src/components/widgets/LimitsExplorer/EpsilonDeltaControls.vue`

```vue
<script setup lang="ts">
/**
 * EpsilonDeltaControls - Sliders for ε and δ parameters
 *
 * Allows users to interactively explore the ε-δ definition:
 * "For every ε > 0, there exists δ > 0 such that
 *  if 0 < |x - a| < δ then |f(x) - L| < ε"
 */

import { computed } from 'vue'
import MathBlock from '@/components/content/MathBlock.vue'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  epsilon: number
  delta: number
  limitValue: number | null
  approachPoint: number
  /** Whether a valid delta exists for current epsilon */
  deltaValid: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:epsilon': [value: number]
  'update:delta': [value: number]
  findDelta: []
}>()

// ============================================================================
// Constants
// ============================================================================

const MIN_VALUE = 0.01
const MAX_VALUE = 2
const STEP = 0.01

// ============================================================================
// Computed
// ============================================================================

/**
 * ε-δ condition display
 */
const epsilonCondition = computed(() => {
  if (props.limitValue === null || !isFinite(props.limitValue)) {
    return '|f(x) - L| < ε'
  }
  const L = props.limitValue.toFixed(2)
  const eps = props.epsilon.toFixed(2)
  return `|f(x) - ${L}| < ${eps}`
})

const deltaCondition = computed(() => {
  const a = props.approachPoint.toFixed(2)
  const del = props.delta.toFixed(2)
  return `0 < |x - ${a}| < ${del}`
})

// ============================================================================
// Methods
// ============================================================================

function handleEpsilonChange(event: Event): void {
  const value = parseFloat((event.target as HTMLInputElement).value)
  emit('update:epsilon', value)
}

function handleDeltaChange(event: Event): void {
  const value = parseFloat((event.target as HTMLInputElement).value)
  emit('update:delta', value)
}

function handleFindDelta(): void {
  emit('findDelta')
}
</script>

<template>
  <div class="epsilon-delta-controls p-4 bg-surface-alt rounded-lg border border-border">
    <h4 class="text-sm font-semibold text-primary mb-3">
      <i class="fa-solid fa-sliders mr-2" aria-hidden="true" />
      ε-δ Definition
    </h4>

    <!-- Formal Definition -->
    <div class="mb-4 p-3 bg-surface rounded-lg border border-border text-sm">
      <p class="text-text-secondary mb-2">
        For every <span class="text-blue-600 font-semibold">ε > 0</span>, there exists
        <span class="text-amber-600 font-semibold">δ > 0</span> such that:
      </p>
      <div class="text-center">
        <MathBlock
          :formula="`\\text{if } 0 < |x - a| < \\delta \\text{ then } |f(x) - L| < \\varepsilon`"
        />
      </div>
    </div>

    <!-- Epsilon Slider -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1">
        <label class="text-sm font-medium text-blue-600">
          ε (epsilon) = {{ epsilon.toFixed(2) }}
        </label>
        <span class="text-xs text-text-muted">
          {{ epsilonCondition }}
        </span>
      </div>
      <input
        type="range"
        :min="MIN_VALUE"
        :max="MAX_VALUE"
        :step="STEP"
        :value="epsilon"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer epsilon-slider"
        @input="handleEpsilonChange"
      />
      <p class="text-xs text-text-muted mt-1">
        How close f(x) must be to L (the limit value)
      </p>
    </div>

    <!-- Delta Slider -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1">
        <label class="text-sm font-medium text-amber-600">
          δ (delta) = {{ delta.toFixed(2) }}
        </label>
        <span class="text-xs text-text-muted">
          {{ deltaCondition }}
        </span>
      </div>
      <input
        type="range"
        :min="MIN_VALUE"
        :max="MAX_VALUE"
        :step="STEP"
        :value="delta"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer delta-slider"
        @input="handleDeltaChange"
      />
      <p class="text-xs text-text-muted mt-1">
        How close x must be to a (the approach point)
      </p>
    </div>

    <!-- Find Delta Button -->
    <div class="flex items-center gap-2">
      <button
        class="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        :disabled="limitValue === null || !isFinite(limitValue)"
        @click="handleFindDelta"
      >
        <i class="fa-solid fa-search mr-2" aria-hidden="true" />
        Find δ for this ε
      </button>
    </div>

    <!-- Delta Validity Indicator -->
    <div
      class="mt-3 p-2 rounded-lg text-sm"
      :class="deltaValid
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
    >
      <i
        :class="deltaValid ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle'"
        class="mr-2"
        aria-hidden="true"
      />
      <span v-if="deltaValid">
        This δ works: all points within δ of a have f(x) within ε of L
      </span>
      <span v-else>
        This δ is too large: some points within δ have f(x) outside ε band
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Epsilon slider (blue) */
.epsilon-slider {
  background: linear-gradient(to right, #dbeafe, #3b82f6);
}

.epsilon-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.epsilon-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Delta slider (amber) */
.delta-slider {
  background: linear-gradient(to right, #fef3c7, #f59e0b);
}

.delta-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #d97706;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.delta-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #d97706;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### 2. Create Epsilon-Delta Bands Component: `src/components/widgets/LimitsExplorer/EpsilonDeltaBands.vue`

```vue
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
      :class="deltaValid
        ? 'fill-green-300/50 dark:fill-green-600/40'
        : 'fill-red-300/50 dark:fill-red-600/40'"
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
        :y="epsilonLines[0].y - 3"
        text-anchor="end"
        class="fill-blue-600 dark:fill-blue-400 font-medium"
      >
        L + ε
      </text>
      <text
        :x="width - padding.right - 5"
        :y="epsilonLines[1].y + 12"
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
```

### 3. Create Approach Animation Component: `src/components/widgets/LimitsExplorer/ApproachAnimation.vue`

```vue
<script setup lang="ts">
/**
 * ApproachAnimation - Shows numerical approach sequence
 *
 * Displays the sequence of f(x) values as x approaches the limit point,
 * demonstrating numerical limit approximation.
 */

import { computed, ref, watch } from 'vue'
import type { LimitApproximationStep, ApproachDirection } from '@/types/math'
import { numericalLimitApproximation } from '@/utils/math/limits'

// ============================================================================
// Props
// ============================================================================

interface Props {
  fn: ((x: number) => number) | null
  approachPoint: number
  direction: ApproachDirection
}

const props = defineProps<Props>()

// ============================================================================
// State
// ============================================================================

const isPlaying = ref(false)
const currentStep = ref(0)
const animationInterval = ref<ReturnType<typeof setInterval> | null>(null)

// ============================================================================
// Computed
// ============================================================================

/**
 * Generate approximation sequences for both directions
 */
const leftSequence = computed<LimitApproximationStep[]>(() => {
  if (!props.fn || props.direction === 'right') return []
  return numericalLimitApproximation(props.fn, props.approachPoint, 'left', 8)
})

const rightSequence = computed<LimitApproximationStep[]>(() => {
  if (!props.fn || props.direction === 'left') return []
  return numericalLimitApproximation(props.fn, props.approachPoint, 'right', 8)
})

/**
 * Display sequence based on direction
 */
const displaySequence = computed(() => {
  if (props.direction === 'left') return leftSequence.value
  if (props.direction === 'right') return rightSequence.value
  // For 'both', interleave left and right
  const result: Array<LimitApproximationStep & { side: 'left' | 'right' }> = []
  const maxLen = Math.max(leftSequence.value.length, rightSequence.value.length)
  for (let i = 0; i < maxLen; i++) {
    if (leftSequence.value[i]) {
      result.push({ ...leftSequence.value[i], side: 'left' })
    }
    if (rightSequence.value[i]) {
      result.push({ ...rightSequence.value[i], side: 'right' })
    }
  }
  return result
})

/**
 * Visible steps based on animation progress
 */
const visibleSteps = computed(() => {
  if (!isPlaying.value) return displaySequence.value
  return displaySequence.value.slice(0, currentStep.value + 1)
})

// ============================================================================
// Methods
// ============================================================================

function startAnimation(): void {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = 0

  animationInterval.value = setInterval(() => {
    if (currentStep.value < displaySequence.value.length - 1) {
      currentStep.value++
    } else {
      stopAnimation()
    }
  }, 500) // 500ms between steps
}

function stopAnimation(): void {
  isPlaying.value = false
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
    animationInterval.value = null
  }
}

function resetAnimation(): void {
  stopAnimation()
  currentStep.value = 0
}

/**
 * Format number for display
 */
function formatNumber(n: number): string {
  if (!isFinite(n)) return n > 0 ? '+∞' : '-∞'
  if (isNaN(n)) return 'undefined'
  return n.toFixed(6)
}

// ============================================================================
// Watchers
// ============================================================================

// Reset animation when inputs change
watch([() => props.fn, () => props.approachPoint, () => props.direction], () => {
  resetAnimation()
})
</script>

<template>
  <div class="approach-animation p-4 bg-surface-alt rounded-lg border border-border">
    <div class="flex justify-between items-center mb-3">
      <h4 class="text-sm font-semibold text-primary">
        <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
        Numerical Approximation
      </h4>
      <div class="flex gap-2">
        <button
          class="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          :disabled="isPlaying"
          @click="startAnimation"
        >
          <i class="fa-solid fa-play mr-1" aria-hidden="true" />
          Play
        </button>
        <button
          class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          @click="resetAnimation"
        >
          <i class="fa-solid fa-rotate-left mr-1" aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>

    <!-- Sequence Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead>
          <tr class="border-b border-border">
            <th class="py-1 px-2 text-left text-text-muted">Step</th>
            <th v-if="direction === 'both'" class="py-1 px-2 text-left text-text-muted">
              Side
            </th>
            <th class="py-1 px-2 text-right text-text-muted">x</th>
            <th class="py-1 px-2 text-right text-text-muted">f(x)</th>
            <th class="py-1 px-2 text-right text-text-muted">|x - a|</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(step, i) in visibleSteps"
            :key="i"
            class="border-b border-border/50"
            :class="{ 'bg-primary/10': i === currentStep && isPlaying }"
          >
            <td class="py-1 px-2 font-mono">{{ i + 1 }}</td>
            <td
              v-if="direction === 'both'"
              class="py-1 px-2"
              :class="(step as typeof step & { side: string }).side === 'left' ? 'text-orange-600' : 'text-green-600'"
            >
              {{ (step as typeof step & { side: string }).side === 'left' ? '←' : '→' }}
            </td>
            <td class="py-1 px-2 text-right font-mono">{{ formatNumber(step.x) }}</td>
            <td class="py-1 px-2 text-right font-mono font-semibold">
              {{ formatNumber(step.fx) }}
            </td>
            <td class="py-1 px-2 text-right font-mono text-text-muted">
              {{ step.distance.toExponential(1) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Explanation -->
    <p class="text-xs text-text-muted mt-3">
      <i class="fa-solid fa-info-circle mr-1" aria-hidden="true" />
      As x gets closer to a (distance → 0), f(x) approaches the limit value.
    </p>
  </div>
</template>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### 4. Update LimitCanvas: `src/components/widgets/LimitsExplorer/LimitCanvas.vue`

Modify the existing LimitCanvas to include the ε-δ bands. Update the `<script setup>` and `<template>` sections:

**Add to script setup (after existing imports):**

```vue
<script setup lang="ts">
// Add these imports
import { findDeltaForEpsilon } from '@/utils/math/limits'
import EpsilonDeltaBands from './EpsilonDeltaBands.vue'

// ... existing code ...

// Add these new props
interface Props {
  functionPoints: Array<{ x: number; y: number }>
  approachPoint: number
  viewDomain: { min: number; max: number }
  epsilon: number
  delta: number
  limitResult: LimitResult | null
  preset?: LimitFunctionPreset
  showEpsilonDelta?: boolean  // NEW
}

const props = withDefaults(defineProps<Props>(), {
  showEpsilonDelta: true,  // Show ε-δ bands by default
})

// Add computed for delta validity
const deltaValid = computed(() => {
  if (!props.limitResult || props.limitResult.value === null) return false
  if (!isFinite(props.limitResult.value)) return false
  if (!props.preset) return false

  // Check if delta satisfies epsilon condition using utility
  const requiredDelta = findDeltaForEpsilon(
    props.preset.fn,
    props.approachPoint,
    props.limitResult.value,
    props.epsilon,
    props.delta
  )

  return requiredDelta !== null && requiredDelta <= props.delta
})

// Expose canvas config for bands component
const canvasConfig = computed(() => ({
  padding,
  width,
  height,
  xScale,
  yScale,
}))
</script>
```

**Update template to include bands:**

Replace the slot in the template with the actual component:

```vue
<template>
  <!-- ... existing SVG start ... -->

  <!-- ε-δ bands (rendered after grid, before curve) -->
  <EpsilonDeltaBands
    v-if="showEpsilonDelta && limitResult"
    :epsilon="epsilon"
    :delta="delta"
    :approach-point="approachPoint"
    :limit-result="limitResult"
    :x-scale="xScale"
    :y-scale="yScale"
    :padding="padding"
    :width="width"
    :height="height"
    :delta-valid="deltaValid"
  />

  <!-- ... rest of existing template ... -->
</template>
```

### 5. Update Main LimitsExplorer: `src/components/widgets/LimitsExplorer/LimitsExplorer.vue`

Add the new components and wire up the ε-δ controls:

**Add imports:**

```vue
<script setup lang="ts">
// Add these imports
import EpsilonDeltaControls from './EpsilonDeltaControls.vue'
import ApproachAnimation from './ApproachAnimation.vue'
import { findDeltaForEpsilon } from '@/utils/math/limits'

// ... existing code ...

// Add computed for delta validity
const deltaValid = computed(() => {
  if (!limitResult.value || limitResult.value.value === null) return false
  if (!isFinite(limitResult.value.value)) return false
  if (!selectedPreset.value) return false

  const requiredDelta = findDeltaForEpsilon(
    selectedPreset.value.fn,
    approachPoint.value,
    limitResult.value.value,
    epsilon.value,
    delta.value
  )

  return requiredDelta !== null && requiredDelta <= delta.value
})

// Add method to auto-find delta
function handleFindDelta(): void {
  if (!limitResult.value || limitResult.value.value === null) return
  if (!isFinite(limitResult.value.value)) return
  if (!selectedPreset.value) return

  const foundDelta = findDeltaForEpsilon(
    selectedPreset.value.fn,
    approachPoint.value,
    limitResult.value.value,
    epsilon.value,
    2 // max delta to search
  )

  if (foundDelta !== null) {
    setDelta(foundDelta * 0.95) // Slightly smaller for visual margin
  }
}

// Add state for showing advanced features
const showAdvanced = ref(false)
</script>
```

**Update template to include new sections:**

```vue
<template>
  <div class="limits-explorer space-y-4" data-testid="limits-explorer">
    <!-- Function Selection (existing) -->
    <FunctionSelector
      :selected-id="selectedPresetId"
      :selected-preset="selectedPreset"
      @select="selectPreset"
    />

    <!-- Description (existing) -->
    <div
      v-if="presetDescription"
      class="p-3 bg-surface-alt rounded-lg border border-border"
    >
      <p class="text-sm text-text-secondary">
        {{ presetDescription }}
      </p>
      <p class="text-xs text-text-muted mt-1 italic">
        {{ expectedBehavior }}
      </p>
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-4 lg:grid-cols-2">
      <!-- Canvas Column -->
      <div class="lg:col-span-1 space-y-4">
        <LimitCanvas
          :function-points="functionPoints"
          :approach-point="approachPoint"
          :view-domain="viewDomain"
          :epsilon="epsilon"
          :delta="delta"
          :limit-result="limitResult"
          :preset="selectedPreset"
          :show-epsilon-delta="true"
          @update:approach-point="setApproachPoint"
        />

        <!-- Toggle Advanced Features -->
        <button
          class="w-full px-3 py-2 text-sm bg-surface hover:bg-surface-alt border border-border rounded-lg transition-colors flex items-center justify-center gap-2"
          @click="showAdvanced = !showAdvanced"
        >
          <i
            :class="showAdvanced ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
            aria-hidden="true"
          />
          {{ showAdvanced ? 'Hide' : 'Show' }} ε-δ Controls & Animation
        </button>
      </div>

      <!-- Controls Column -->
      <div class="lg:col-span-1 space-y-4">
        <!-- Approach Point Controls (existing) -->
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="text-sm font-semibold text-primary mb-3">
            <i class="fa-solid fa-crosshairs mr-2" aria-hidden="true" />
            Approach Point
          </h4>

          <!-- Interesting Points Quick Select -->
          <div
            v-if="selectedPreset && selectedPreset.interestingPoints.length > 0"
            class="flex flex-wrap gap-2 mb-3"
          >
            <button
              v-for="(point, index) in selectedPreset.interestingPoints"
              :key="index"
              class="px-3 py-1 text-sm rounded-md transition-colors"
              :class="
                Math.abs(approachPoint - point) < 0.01
                  ? 'bg-primary text-white'
                  : 'bg-surface hover:bg-surface-alt border border-border'
              "
              @click="selectInterestingPoint(index)"
            >
              x → {{ point }}
            </button>
          </div>

          <!-- Manual Approach Point Slider -->
          <div>
            <label class="block text-xs text-text-muted mb-1">
              a = {{ approachPoint.toFixed(2) }}
            </label>
            <input
              type="range"
              :min="viewDomain.min"
              :max="viewDomain.max"
              :step="0.1"
              :value="approachPoint"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              @input="
                setApproachPoint(parseFloat(($event.target as HTMLInputElement).value))
              "
            />
          </div>

          <!-- Direction Toggle -->
          <div class="mt-3">
            <label class="block text-xs text-text-muted mb-1">
              Approach Direction
            </label>
            <div class="flex gap-2">
              <button
                v-for="dir in ['left', 'both', 'right'] as const"
                :key="dir"
                class="flex-1 px-2 py-1 text-xs rounded-md transition-colors"
                :class="
                  approachDirection === dir
                    ? 'bg-primary text-white'
                    : 'bg-surface hover:bg-surface-alt border border-border'
                "
                @click="setApproachDirection(dir)"
              >
                {{ dir === 'left' ? 'x → a⁻' : dir === 'right' ? 'x → a⁺' : 'Both' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Limit Result Display (existing) -->
        <LimitDisplay
          :limit-result="limitResult"
          :continuity-result="continuityResult"
          :approach-point="approachPoint"
          :approach-direction="approachDirection"
        />
      </div>
    </div>

    <!-- Advanced Features (ε-δ Controls and Animation) -->
    <div v-if="showAdvanced" class="grid gap-4 lg:grid-cols-2">
      <!-- ε-δ Controls -->
      <EpsilonDeltaControls
        :epsilon="epsilon"
        :delta="delta"
        :limit-value="limitResult?.value ?? null"
        :approach-point="approachPoint"
        :delta-valid="deltaValid"
        @update:epsilon="setEpsilon"
        @update:delta="setDelta"
        @find-delta="handleFindDelta"
      />

      <!-- Numerical Approximation Animation -->
      <ApproachAnimation
        :fn="selectedPreset?.fn ?? null"
        :approach-point="approachPoint"
        :direction="approachDirection"
      />
    </div>
  </div>
</template>
```

### 6. Update Composable for Delta Validity: `src/composables/useLimits.ts`

Add a computed property for checking delta validity:

```typescript
// Add to the return statement and create computed before it:

/**
 * Check if current delta satisfies the epsilon condition
 */
const deltaValid = computed(() => {
  if (!selectedPreset.value) return false
  if (!limitResult.value || limitResult.value.value === null) return false
  if (!isFinite(limitResult.value.value)) return false

  const requiredDelta = findDeltaForEpsilon(
    selectedPreset.value.fn,
    approachPoint.value,
    limitResult.value.value,
    epsilon.value,
    delta.value
  )

  return requiredDelta !== null
})

// Add to return object:
return {
  // ... existing returns ...
  deltaValid,
}
```

---

## Success Criteria

- [ ] `EpsilonDeltaControls.vue` created with ε and δ sliders
- [ ] `EpsilonDeltaBands.vue` renders bands correctly on canvas
- [ ] `ApproachAnimation.vue` shows numerical approximation sequence
- [ ] ε slider changes horizontal band size around L
- [ ] δ slider changes vertical interval size around a
- [ ] Intersection region highlights in green (valid) or red (invalid)
- [ ] "Find δ" button automatically finds working delta for given epsilon
- [ ] Numerical approximation table shows sequence approaching limit
- [ ] Animation plays step-by-step through approach sequence
- [ ] Advanced features toggle works (show/hide)
- [ ] Canvas correctly integrates EpsilonDeltaBands
- [ ] All bands clip correctly to canvas bounds
- [ ] Dark mode colors work correctly
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run dev` shows all features working

---

## Commands to Run

```bash
# Start dev server and test visually
npm run dev

# Verify types
npm run type-check

# Check linting
npm run lint

# Build verification
npm run build
```

---

## Implementation Notes

1. **Layer Order**: The SVG renders bands behind the function curve. Order in SVG determines z-index (earlier = back).

2. **Coordinate Transforms**: The bands receive `xScale` and `yScale` functions to convert data coordinates to SVG coordinates.

3. **Intersection Region**: The green/red highlighted area shows where both ε and δ conditions apply. Green means all points in this region satisfy |f(x) - L| < ε.

4. **Find Delta Algorithm**: Uses binary search to find the largest delta that satisfies the epsilon condition. We multiply by 0.95 to give visual margin.

5. **Numerical Approximation**: Shows how computers actually evaluate limits - by computing a sequence of values approaching the point.

6. **Animation Timing**: 500ms between steps gives users time to see each value. The animation auto-stops at the end.

7. **Responsive Design**: The grid layout puts canvas on left, controls on right for large screens. On mobile, they stack vertically.

---

## Testing the ε-δ Visualization

1. Select the `polynomial` preset (x²)
2. Set approach point to x = 2 (limit should be 4)
3. Adjust ε slider - epsilon band should grow/shrink vertically around y = 4
4. Adjust δ slider - delta interval should grow/shrink horizontally around x = 2
5. Click "Find δ" - should auto-adjust delta to a working value
6. When delta is too large, intersection region should turn red
7. When delta works, intersection region should turn green
8. Play the numerical approximation to see values converging

Test with discontinuous functions:
- `step` (floor): Bands won't work at integers (limit doesn't exist)
- `reciprocal` (1/x): At x=0, limit is infinite (no valid delta)
- `sine-over-x`: At x=0, limit is 1 (should find valid delta)
