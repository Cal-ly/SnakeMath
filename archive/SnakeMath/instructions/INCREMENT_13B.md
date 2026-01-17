# Increment 13B: LimitsExplorer Widget Core

**Goal**: Create the core LimitsExplorer widget with function curve rendering and preset selection.

**Prerequisites**: Increment 13A complete (limits math utilities)

---

## Files to Create

### 1. Create Composable: `src/composables/useLimits.ts`

```typescript
/**
 * Composable for managing limit exploration state
 *
 * Provides reactive state for function selection, approach point,
 * epsilon-delta parameters, and URL synchronization.
 */

import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LimitFunctionPreset, ApproachDirection, LimitResult, ContinuityResult } from '@/types/math'
import {
  LIMIT_PRESETS,
  getLimitPreset,
  evaluateLimit,
  checkContinuity,
  DEFAULT_EPSILON,
  DEFAULT_DELTA,
} from '@/utils/math/limits'

// ============================================================================
// Types
// ============================================================================

export interface UseLimitsOptions {
  /** Initial preset function ID */
  initialPreset?: string
  /** Initial approach point */
  initialApproachPoint?: number
  /** Whether to sync state to URL */
  syncUrl?: boolean
}

export interface UseLimitsReturn {
  // State
  selectedPresetId: ReturnType<typeof ref<string>>
  approachPoint: ReturnType<typeof ref<number>>
  approachDirection: ReturnType<typeof ref<ApproachDirection>>
  epsilon: ReturnType<typeof ref<number>>
  delta: ReturnType<typeof ref<number>>
  viewDomain: ReturnType<typeof ref<{ min: number; max: number }>>

  // Computed
  selectedPreset: ReturnType<typeof computed<LimitFunctionPreset | undefined>>
  limitResult: ReturnType<typeof computed<LimitResult | null>>
  continuityResult: ReturnType<typeof computed<ContinuityResult | null>>
  functionPoints: ReturnType<typeof computed<Array<{ x: number; y: number }>>>

  // Methods
  selectPreset: (id: string) => void
  setApproachPoint: (point: number) => void
  setApproachDirection: (direction: ApproachDirection) => void
  setEpsilon: (value: number) => void
  setDelta: (value: number) => void
  setViewDomain: (min: number, max: number) => void
  selectInterestingPoint: (index: number) => void
  resetToDefaults: () => void
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_PRESET = 'polynomial'
const DEFAULT_APPROACH_POINT = 1
const POINTS_PER_UNIT = 50 // Resolution for function curve
const URL_UPDATE_DELAY = 300 // Debounce delay for URL updates

// ============================================================================
// Composable
// ============================================================================

export function useLimits(options: UseLimitsOptions = {}): UseLimitsReturn {
  const route = useRoute()
  const router = useRouter()

  // ============================================================
  // STATE
  // ============================================================

  const selectedPresetId = ref(options.initialPreset ?? DEFAULT_PRESET)
  const approachPoint = ref(options.initialApproachPoint ?? DEFAULT_APPROACH_POINT)
  const approachDirection = ref<ApproachDirection>('both')
  const epsilon = ref(DEFAULT_EPSILON)
  const delta = ref(DEFAULT_DELTA)
  const viewDomain = ref({ min: -3, max: 3 })

  // Flag to prevent URL update loops
  const isUpdatingFromUrl = ref(false)
  let urlUpdateTimeout: ReturnType<typeof setTimeout> | null = null

  // ============================================================
  // COMPUTED
  // ============================================================

  /**
   * The currently selected preset configuration
   */
  const selectedPreset = computed<LimitFunctionPreset | undefined>(() => {
    return getLimitPreset(selectedPresetId.value)
  })

  /**
   * Evaluate the limit at the current approach point
   */
  const limitResult = computed<LimitResult | null>(() => {
    if (!selectedPreset.value) return null
    return evaluateLimit(
      selectedPreset.value.fn,
      approachPoint.value,
      approachDirection.value
    )
  })

  /**
   * Check continuity at the current approach point
   */
  const continuityResult = computed<ContinuityResult | null>(() => {
    if (!selectedPreset.value) return null
    return checkContinuity(selectedPreset.value.fn, approachPoint.value)
  })

  /**
   * Generate points for rendering the function curve
   * Handles discontinuities by inserting NaN breaks
   */
  const functionPoints = computed<Array<{ x: number; y: number }>>(() => {
    if (!selectedPreset.value) return []

    const fn = selectedPreset.value.fn
    const { min, max } = viewDomain.value
    const points: Array<{ x: number; y: number }> = []
    const step = (max - min) / (POINTS_PER_UNIT * (max - min))

    let prevY: number | null = null

    for (let x = min; x <= max; x += step) {
      const y = fn(x)

      // Detect large jumps (discontinuities) and insert break
      if (prevY !== null && isFinite(y) && isFinite(prevY)) {
        const jump = Math.abs(y - prevY)
        if (jump > 10) {
          // Insert NaN to break the line
          points.push({ x: x - step / 2, y: NaN })
        }
      }

      points.push({ x, y })
      prevY = isFinite(y) ? y : null
    }

    return points
  })

  // ============================================================
  // METHODS
  // ============================================================

  /**
   * Select a preset function
   */
  function selectPreset(id: string): void {
    const preset = getLimitPreset(id)
    if (!preset) return

    selectedPresetId.value = id

    // Update view domain to match preset
    viewDomain.value = { ...preset.domain }

    // Set approach point to first interesting point
    if (preset.interestingPoints.length > 0) {
      approachPoint.value = preset.interestingPoints[0]
    } else {
      approachPoint.value = (preset.domain.min + preset.domain.max) / 2
    }

    // Reset epsilon/delta to defaults
    epsilon.value = DEFAULT_EPSILON
    delta.value = DEFAULT_DELTA
  }

  /**
   * Set the approach point
   */
  function setApproachPoint(point: number): void {
    approachPoint.value = point
  }

  /**
   * Set approach direction
   */
  function setApproachDirection(direction: ApproachDirection): void {
    approachDirection.value = direction
  }

  /**
   * Set epsilon value
   */
  function setEpsilon(value: number): void {
    epsilon.value = Math.max(0.01, Math.min(5, value))
  }

  /**
   * Set delta value
   */
  function setDelta(value: number): void {
    delta.value = Math.max(0.01, Math.min(5, value))
  }

  /**
   * Set the view domain for zooming
   */
  function setViewDomain(min: number, max: number): void {
    if (min < max) {
      viewDomain.value = { min, max }
    }
  }

  /**
   * Jump to a preset's interesting point by index
   */
  function selectInterestingPoint(index: number): void {
    if (!selectedPreset.value) return
    const points = selectedPreset.value.interestingPoints
    if (index >= 0 && index < points.length) {
      approachPoint.value = points[index]
    }
  }

  /**
   * Reset all values to defaults
   */
  function resetToDefaults(): void {
    selectPreset(DEFAULT_PRESET)
  }

  // ============================================================
  // URL SYNC
  // ============================================================

  /**
   * Initialize state from URL query parameters
   */
  function initFromUrl(): void {
    if (!options.syncUrl) return

    isUpdatingFromUrl.value = true

    const { preset, point, dir, eps, del } = route.query

    if (typeof preset === 'string' && getLimitPreset(preset)) {
      selectPreset(preset)
    }

    if (typeof point === 'string') {
      const parsed = parseFloat(point)
      if (isFinite(parsed)) {
        approachPoint.value = parsed
      }
    }

    if (typeof dir === 'string' && ['both', 'left', 'right'].includes(dir)) {
      approachDirection.value = dir as ApproachDirection
    }

    if (typeof eps === 'string') {
      const parsed = parseFloat(eps)
      if (isFinite(parsed) && parsed > 0) {
        epsilon.value = parsed
      }
    }

    if (typeof del === 'string') {
      const parsed = parseFloat(del)
      if (isFinite(parsed) && parsed > 0) {
        delta.value = parsed
      }
    }

    isUpdatingFromUrl.value = false
  }

  /**
   * Update URL query parameters from state
   */
  function updateUrl(): void {
    if (!options.syncUrl || isUpdatingFromUrl.value) return

    // Clear existing timeout
    if (urlUpdateTimeout) {
      clearTimeout(urlUpdateTimeout)
    }

    // Debounce URL updates
    urlUpdateTimeout = setTimeout(() => {
      const query: Record<string, string> = {}

      // Only include non-default values
      if (selectedPresetId.value !== DEFAULT_PRESET) {
        query.preset = selectedPresetId.value
      }

      if (approachPoint.value !== DEFAULT_APPROACH_POINT) {
        query.point = approachPoint.value.toString()
      }

      if (approachDirection.value !== 'both') {
        query.dir = approachDirection.value
      }

      if (Math.abs(epsilon.value - DEFAULT_EPSILON) > 0.01) {
        query.eps = epsilon.value.toFixed(2)
      }

      if (Math.abs(delta.value - DEFAULT_DELTA) > 0.01) {
        query.del = delta.value.toFixed(2)
      }

      router.replace({ query })
    }, URL_UPDATE_DELAY)
  }

  // ============================================================
  // WATCHERS
  // ============================================================

  if (options.syncUrl) {
    // Watch all state and update URL
    watch(
      [selectedPresetId, approachPoint, approachDirection, epsilon, delta],
      () => {
        updateUrl()
      }
    )

    // Initialize from URL on mount
    onMounted(() => {
      initFromUrl()
    })
  }

  // ============================================================
  // RETURN
  // ============================================================

  return {
    // State
    selectedPresetId,
    approachPoint,
    approachDirection,
    epsilon,
    delta,
    viewDomain,

    // Computed
    selectedPreset,
    limitResult,
    continuityResult,
    functionPoints,

    // Methods
    selectPreset,
    setApproachPoint,
    setApproachDirection,
    setEpsilon,
    setDelta,
    setViewDomain,
    selectInterestingPoint,
    resetToDefaults,
  }
}
```

### 2. Create Widget Directory and Index: `src/components/widgets/LimitsExplorer/index.ts`

```typescript
export { default as LimitsExplorer } from './LimitsExplorer.vue'
```

### 3. Create Main Component: `src/components/widgets/LimitsExplorer/LimitsExplorer.vue`

```vue
<script setup lang="ts">
/**
 * LimitsExplorer - Interactive visualization of mathematical limits
 *
 * Features:
 * - Preset function selection
 * - Function curve rendering
 * - Approach point selection
 * - ε-δ band visualization (Increment 13C)
 * - URL state synchronization
 */

import { computed } from 'vue'
import { useLimits } from '@/composables/useLimits'
import FunctionSelector from './FunctionSelector.vue'
import LimitCanvas from './LimitCanvas.vue'
import LimitDisplay from './LimitDisplay.vue'

// ============================================================================
// Props
// ============================================================================

interface Props {
  /** Whether to sync state to URL */
  syncUrl?: boolean
  /** Initial preset function ID */
  initialPreset?: string
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: false,
  initialPreset: 'polynomial',
})

// ============================================================================
// State
// ============================================================================

const {
  selectedPresetId,
  approachPoint,
  approachDirection,
  epsilon,
  delta,
  viewDomain,
  selectedPreset,
  limitResult,
  continuityResult,
  functionPoints,
  selectPreset,
  setApproachPoint,
  setApproachDirection,
  setEpsilon,
  setDelta,
  selectInterestingPoint,
} = useLimits({
  syncUrl: props.syncUrl,
  initialPreset: props.initialPreset,
})

// ============================================================================
// Computed
// ============================================================================

const presetDescription = computed(() => {
  return selectedPreset.value?.description ?? ''
})

const expectedBehavior = computed(() => {
  return selectedPreset.value?.expectedBehavior ?? ''
})
</script>

<template>
  <div class="limits-explorer space-y-4" data-testid="limits-explorer">
    <!-- Function Selection -->
    <FunctionSelector
      :selected-id="selectedPresetId"
      :selected-preset="selectedPreset"
      @select="selectPreset"
    />

    <!-- Description -->
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
      <!-- Canvas -->
      <div class="lg:col-span-1">
        <LimitCanvas
          :function-points="functionPoints"
          :approach-point="approachPoint"
          :view-domain="viewDomain"
          :epsilon="epsilon"
          :delta="delta"
          :limit-result="limitResult"
          :preset="selectedPreset"
          @update:approach-point="setApproachPoint"
        />
      </div>

      <!-- Controls and Display -->
      <div class="lg:col-span-1 space-y-4">
        <!-- Approach Point Controls -->
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

        <!-- Limit Result Display -->
        <LimitDisplay
          :limit-result="limitResult"
          :continuity-result="continuityResult"
          :approach-point="approachPoint"
          :approach-direction="approachDirection"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Range slider styling */
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary, #10b981);
  border-radius: 50%;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--color-primary, #10b981);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
```

### 4. Create Function Selector: `src/components/widgets/LimitsExplorer/FunctionSelector.vue`

```vue
<script setup lang="ts">
/**
 * FunctionSelector - Preset function selection buttons
 */

import type { LimitFunctionPreset } from '@/types/math'
import { LIMIT_PRESETS } from '@/utils/math/limits'
import MathBlock from '@/components/content/MathBlock.vue'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  selectedId: string
  selectedPreset?: LimitFunctionPreset
}

defineProps<Props>()

const emit = defineEmits<{
  select: [id: string]
}>()

// ============================================================================
// Methods
// ============================================================================

function handleSelect(id: string): void {
  emit('select', id)
}
</script>

<template>
  <div class="function-selector">
    <h4 class="text-sm font-semibold text-primary mb-2">
      <i class="fa-solid fa-function mr-2" aria-hidden="true" />
      Select Function
    </h4>

    <!-- Function Buttons -->
    <div class="flex flex-wrap gap-2 mb-3">
      <button
        v-for="preset in LIMIT_PRESETS"
        :key="preset.id"
        class="px-3 py-2 text-sm rounded-lg transition-colors border"
        :class="
          selectedId === preset.id
            ? 'bg-primary text-white border-primary'
            : 'bg-surface hover:bg-surface-alt border-border'
        "
        :title="preset.description"
        @click="handleSelect(preset.id)"
      >
        {{ preset.name }}
      </button>
    </div>

    <!-- Selected Function Formula -->
    <div
      v-if="selectedPreset"
      class="p-3 bg-surface rounded-lg border border-border"
    >
      <MathBlock :formula="selectedPreset.latex" display />
    </div>
  </div>
</template>
```

### 5. Create Limit Canvas: `src/components/widgets/LimitsExplorer/LimitCanvas.vue`

```vue
<script setup lang="ts">
/**
 * LimitCanvas - SVG canvas for function curve and approach point
 *
 * Renders:
 * - Coordinate axes
 * - Function curve
 * - Approach point marker
 * - ε-δ bands (added in Increment 13C)
 */

import { computed, ref } from 'vue'
import type { LimitFunctionPreset, LimitResult } from '@/types/math'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  functionPoints: Array<{ x: number; y: number }>
  approachPoint: number
  viewDomain: { min: number; max: number }
  epsilon: number
  delta: number
  limitResult: LimitResult | null
  preset?: LimitFunctionPreset
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:approachPoint': [value: number]
}>()

// ============================================================================
// Canvas Configuration
// ============================================================================

const width = 400
const height = 300
const padding = { top: 20, right: 20, bottom: 30, left: 40 }

const plotWidth = width - padding.left - padding.right
const plotHeight = height - padding.top - padding.bottom

// ============================================================================
// Scales and Transforms
// ============================================================================

/**
 * Y-axis domain based on function values
 */
const yDomain = computed(() => {
  const validY = props.functionPoints
    .map((p) => p.y)
    .filter((y) => isFinite(y) && Math.abs(y) < 100)

  if (validY.length === 0) return { min: -5, max: 5 }

  const minY = Math.min(...validY)
  const maxY = Math.max(...validY)
  const range = maxY - minY || 1
  const pad = range * 0.1

  return {
    min: Math.floor(minY - pad),
    max: Math.ceil(maxY + pad),
  }
})

/**
 * Convert data x to SVG x
 */
function xScale(x: number): number {
  const { min, max } = props.viewDomain
  return padding.left + ((x - min) / (max - min)) * plotWidth
}

/**
 * Convert data y to SVG y
 */
function yScale(y: number): number {
  const { min, max } = yDomain.value
  return padding.top + plotHeight - ((y - min) / (max - min)) * plotHeight
}

/**
 * Convert SVG x to data x
 */
function xScaleInverse(svgX: number): number {
  const { min, max } = props.viewDomain
  return min + ((svgX - padding.left) / plotWidth) * (max - min)
}

// ============================================================================
// Path Generation
// ============================================================================

/**
 * Generate SVG path for function curve
 * Handles NaN values by breaking the path
 */
const functionPath = computed(() => {
  const points = props.functionPoints
  if (points.length === 0) return ''

  let path = ''
  let inPath = false

  for (const point of points) {
    const { x, y } = point

    // Skip NaN or out-of-range values
    if (!isFinite(y) || y < yDomain.value.min - 10 || y > yDomain.value.max + 10) {
      inPath = false
      continue
    }

    const sx = xScale(x)
    const sy = yScale(y)

    // Clamp to visible area
    if (sy < padding.top - 5 || sy > height - padding.bottom + 5) {
      inPath = false
      continue
    }

    if (!inPath) {
      path += `M ${sx} ${sy} `
      inPath = true
    } else {
      path += `L ${sx} ${sy} `
    }
  }

  return path
})

// ============================================================================
// Axis Generation
// ============================================================================

/**
 * Generate x-axis tick marks
 */
const xTicks = computed(() => {
  const { min, max } = props.viewDomain
  const step = Math.ceil((max - min) / 6)
  const ticks: number[] = []

  for (let x = Math.ceil(min); x <= max; x += step) {
    ticks.push(x)
  }

  return ticks
})

/**
 * Generate y-axis tick marks
 */
const yTicks = computed(() => {
  const { min, max } = yDomain.value
  const step = Math.ceil((max - min) / 5)
  const ticks: number[] = []

  for (let y = Math.ceil(min); y <= max; y += step) {
    ticks.push(y)
  }

  return ticks
})

// ============================================================================
// Approach Point Visualization
// ============================================================================

const approachPointSvgX = computed(() => xScale(props.approachPoint))

const limitValueSvgY = computed(() => {
  if (!props.limitResult || props.limitResult.value === null) return null
  if (!isFinite(props.limitResult.value)) return null
  return yScale(props.limitResult.value)
})

// ============================================================================
// Interaction
// ============================================================================

const isDragging = ref(false)
const canvasRef = ref<SVGSVGElement | null>(null)

function handleMouseDown(event: MouseEvent): void {
  isDragging.value = true
  updateApproachFromMouse(event)
}

function handleMouseMove(event: MouseEvent): void {
  if (!isDragging.value) return
  updateApproachFromMouse(event)
}

function handleMouseUp(): void {
  isDragging.value = false
}

function updateApproachFromMouse(event: MouseEvent): void {
  if (!canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const svgX = event.clientX - rect.left
  const dataX = xScaleInverse(svgX)

  // Clamp to domain
  const { min, max } = props.viewDomain
  const clampedX = Math.max(min, Math.min(max, dataX))

  // Round to 1 decimal place
  const roundedX = Math.round(clampedX * 10) / 10

  emit('update:approachPoint', roundedX)
}
</script>

<template>
  <div class="limit-canvas-container">
    <svg
      ref="canvasRef"
      :viewBox="`0 0 ${width} ${height}`"
      class="w-full h-auto bg-white dark:bg-gray-900 rounded-lg border border-border"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <!-- Grid lines -->
      <g class="grid-lines">
        <!-- Vertical grid lines -->
        <line
          v-for="x in xTicks"
          :key="`vgrid-${x}`"
          :x1="xScale(x)"
          :y1="padding.top"
          :x2="xScale(x)"
          :y2="height - padding.bottom"
          stroke="currentColor"
          class="text-gray-200 dark:text-gray-700"
          stroke-width="1"
        />
        <!-- Horizontal grid lines -->
        <line
          v-for="y in yTicks"
          :key="`hgrid-${y}`"
          :x1="padding.left"
          :y1="yScale(y)"
          :x2="width - padding.right"
          :y2="yScale(y)"
          stroke="currentColor"
          class="text-gray-200 dark:text-gray-700"
          stroke-width="1"
        />
      </g>

      <!-- Axes -->
      <g class="axes">
        <!-- X-axis -->
        <line
          :x1="padding.left"
          :y1="yScale(0)"
          :x2="width - padding.right"
          :y2="yScale(0)"
          stroke="currentColor"
          class="text-gray-400"
          stroke-width="1.5"
        />
        <!-- Y-axis -->
        <line
          :x1="xScale(0)"
          :y1="padding.top"
          :x2="xScale(0)"
          :y2="height - padding.bottom"
          stroke="currentColor"
          class="text-gray-400"
          stroke-width="1.5"
        />
      </g>

      <!-- Axis labels -->
      <g class="axis-labels text-xs fill-current text-gray-500">
        <!-- X-axis labels -->
        <text
          v-for="x in xTicks"
          :key="`xlabel-${x}`"
          :x="xScale(x)"
          :y="height - padding.bottom + 15"
          text-anchor="middle"
        >
          {{ x }}
        </text>
        <!-- Y-axis labels -->
        <text
          v-for="y in yTicks"
          :key="`ylabel-${y}`"
          :x="padding.left - 8"
          :y="yScale(y) + 4"
          text-anchor="end"
        >
          {{ y }}
        </text>
      </g>

      <!-- ε-δ bands will be added in Increment 13C -->
      <!-- Slot for epsilon-delta visualization -->
      <slot
        name="epsilon-delta"
        :x-scale="xScale"
        :y-scale="yScale"
        :approach-point-x="approachPointSvgX"
        :limit-value-y="limitValueSvgY"
      />

      <!-- Function curve -->
      <path
        :d="functionPath"
        fill="none"
        stroke="currentColor"
        class="text-emerald-600 dark:text-emerald-400"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Approach point vertical line -->
      <line
        :x1="approachPointSvgX"
        :y1="padding.top"
        :x2="approachPointSvgX"
        :y2="height - padding.bottom"
        stroke="currentColor"
        class="text-red-400"
        stroke-width="1.5"
        stroke-dasharray="4,4"
      />

      <!-- Approach point marker -->
      <circle
        :cx="approachPointSvgX"
        :cy="yScale(0)"
        r="6"
        fill="currentColor"
        class="text-red-500 cursor-ew-resize"
      />

      <!-- Limit value marker (if finite) -->
      <g v-if="limitValueSvgY !== null">
        <!-- Horizontal line to limit value -->
        <line
          :x1="padding.left"
          :y1="limitValueSvgY"
          :x2="approachPointSvgX"
          :y2="limitValueSvgY"
          stroke="currentColor"
          class="text-purple-400"
          stroke-width="1.5"
          stroke-dasharray="4,4"
        />

        <!-- Limit point marker -->
        <circle
          :cx="approachPointSvgX"
          :cy="limitValueSvgY"
          r="5"
          fill="currentColor"
          class="text-purple-500"
          stroke="white"
          stroke-width="2"
        />
      </g>

      <!-- Labels -->
      <g class="labels">
        <!-- Approach point label -->
        <text
          :x="approachPointSvgX"
          :y="height - 5"
          text-anchor="middle"
          class="text-xs fill-current text-red-500 font-semibold"
        >
          a = {{ approachPoint }}
        </text>

        <!-- Limit value label -->
        <text
          v-if="limitResult && limitResult.value !== null && isFinite(limitResult.value)"
          :x="padding.left + 5"
          :y="limitValueSvgY! - 5"
          class="text-xs fill-current text-purple-500 font-semibold"
        >
          L = {{ limitResult.value.toFixed(2) }}
        </text>
      </g>
    </svg>

    <!-- Interaction hint -->
    <p class="text-xs text-text-muted mt-1 text-center">
      <i class="fa-solid fa-arrows-left-right mr-1" aria-hidden="true" />
      Drag the red point to change approach value
    </p>
  </div>
</template>

<style scoped>
.limit-canvas-container {
  user-select: none;
}
</style>
```

### 6. Create Limit Display: `src/components/widgets/LimitsExplorer/LimitDisplay.vue`

```vue
<script setup lang="ts">
/**
 * LimitDisplay - Shows limit results and continuity status
 */

import { computed } from 'vue'
import type { LimitResult, ContinuityResult, ApproachDirection } from '@/types/math'
import MathBlock from '@/components/content/MathBlock.vue'

// ============================================================================
// Props
// ============================================================================

interface Props {
  limitResult: LimitResult | null
  continuityResult: ContinuityResult | null
  approachPoint: number
  approachDirection: ApproachDirection
}

const props = defineProps<Props>()

// ============================================================================
// Computed
// ============================================================================

/**
 * Format the limit notation based on direction
 */
const limitNotation = computed(() => {
  const a = props.approachPoint
  if (props.approachDirection === 'left') {
    return `\\lim_{x \\to ${a}^-}`
  }
  if (props.approachDirection === 'right') {
    return `\\lim_{x \\to ${a}^+}`
  }
  return `\\lim_{x \\to ${a}}`
})

/**
 * Format the limit value for display
 */
const limitValueDisplay = computed(() => {
  if (!props.limitResult) return 'N/A'

  if (props.limitResult.limitType === 'does-not-exist') {
    return '\\text{DNE}'
  }

  if (props.limitResult.value === Infinity) return '+\\infty'
  if (props.limitResult.value === -Infinity) return '-\\infty'

  if (props.limitResult.value !== null) {
    return props.limitResult.value.toFixed(4).replace(/\.?0+$/, '')
  }

  return '\\text{undefined}'
})

/**
 * Badge styling based on continuity type
 */
const continuityBadgeClass = computed(() => {
  if (!props.continuityResult) return ''

  switch (props.continuityResult.discontinuityType) {
    case 'none':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'removable':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'jump':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'infinite':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'oscillating':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
})

/**
 * Icon for continuity type
 */
const continuityIcon = computed(() => {
  if (!props.continuityResult) return ''

  switch (props.continuityResult.discontinuityType) {
    case 'none':
      return 'fa-solid fa-check-circle'
    case 'removable':
      return 'fa-solid fa-circle-dot'
    case 'jump':
      return 'fa-solid fa-stairs'
    case 'infinite':
      return 'fa-solid fa-arrows-up-down'
    case 'oscillating':
      return 'fa-solid fa-wave-square'
    default:
      return 'fa-solid fa-question-circle'
  }
})

/**
 * Format left/right limit display
 */
function formatSideLimit(value: number | null): string {
  if (value === null) return 'N/A'
  if (value === Infinity) return '+∞'
  if (value === -Infinity) return '-∞'
  if (!isFinite(value)) return 'undefined'
  return value.toFixed(4).replace(/\.?0+$/, '')
}
</script>

<template>
  <div class="limit-display space-y-4">
    <!-- Main Limit Result -->
    <div class="p-4 bg-surface-alt rounded-lg border border-border">
      <h4 class="text-sm font-semibold text-primary mb-3">
        <i class="fa-solid fa-equals mr-2" aria-hidden="true" />
        Limit Value
      </h4>

      <div class="text-center py-2">
        <MathBlock :formula="`${limitNotation} f(x) = ${limitValueDisplay}`" display />
      </div>

      <!-- One-sided limits (when both directions shown) -->
      <div
        v-if="approachDirection === 'both' && limitResult"
        class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border"
      >
        <div class="text-center">
          <p class="text-xs text-text-muted mb-1">Left limit</p>
          <p class="font-mono text-sm">
            lim x→{{ approachPoint }}⁻ = {{ formatSideLimit(limitResult.leftLimit) }}
          </p>
        </div>
        <div class="text-center">
          <p class="text-xs text-text-muted mb-1">Right limit</p>
          <p class="font-mono text-sm">
            lim x→{{ approachPoint }}⁺ = {{ formatSideLimit(limitResult.rightLimit) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Continuity Status -->
    <div class="p-4 bg-surface-alt rounded-lg border border-border">
      <h4 class="text-sm font-semibold text-primary mb-3">
        <i class="fa-solid fa-diagram-project mr-2" aria-hidden="true" />
        Continuity
      </h4>

      <div v-if="continuityResult" class="space-y-3">
        <!-- Status Badge -->
        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
            :class="continuityBadgeClass"
          >
            <i :class="continuityIcon" aria-hidden="true" />
            {{
              continuityResult.isContinuous
                ? 'Continuous'
                : continuityResult.discontinuityType.charAt(0).toUpperCase() +
                  continuityResult.discontinuityType.slice(1)
            }}
          </span>
        </div>

        <!-- Description -->
        <p class="text-sm text-text-secondary">
          {{ continuityResult.description }}
        </p>
      </div>
    </div>

    <!-- Limit Type Info -->
    <div
      v-if="limitResult"
      class="p-3 bg-primary/10 border border-primary/30 rounded-lg"
    >
      <p class="text-xs text-primary">
        <i class="fa-solid fa-info-circle mr-1" aria-hidden="true" />
        <span v-if="limitResult.limitType === 'finite'">
          The limit exists and is finite.
        </span>
        <span v-else-if="limitResult.limitType === 'infinite'">
          The function approaches infinity (vertical asymptote).
        </span>
        <span v-else>
          The limit does not exist (left and right limits differ or oscillate).
        </span>
      </p>
    </div>
  </div>
</template>
```

### 7. Update Widget Exports: `src/components/widgets/index.ts`

Add the new widget export (add to existing file):

```typescript
// Add to existing exports
export { LimitsExplorer } from './LimitsExplorer'
```

---

## Success Criteria

- [ ] `src/composables/useLimits.ts` created with all state and methods
- [ ] Widget directory structure created: `LimitsExplorer/`
- [ ] `LimitsExplorer.vue` renders and orchestrates sub-components
- [ ] `FunctionSelector.vue` shows all 8 preset functions
- [ ] `LimitCanvas.vue` renders function curves correctly
- [ ] `LimitDisplay.vue` shows limit values and continuity status
- [ ] Clicking preset buttons changes the function
- [ ] Approach point can be changed via slider
- [ ] Approach point can be changed by dragging on canvas
- [ ] Approach direction (left/right/both) can be toggled
- [ ] Limit values update reactively
- [ ] Continuity status displays with appropriate badges
- [ ] URL sync works when `sync-url` prop is true
- [ ] Widget is exported from `@/components/widgets`
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run dev` shows widget working

---

## Commands to Run

```bash
# Start dev server and test widget
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

1. **Composable Pattern**: The `useLimits` composable centralizes all state management. Components receive data and emit events but don't manage state directly.

2. **URL State**: Uses debounced URL updates (300ms) to prevent excessive history entries while dragging.

3. **Canvas Rendering**: Uses SVG for vector graphics consistency with existing widgets. The coordinate system transforms data coordinates to SVG coordinates.

4. **Discontinuity Handling**: The function path breaks at NaN values to avoid connecting across discontinuities.

5. **Interactive Dragging**: The canvas supports click-and-drag to set the approach point, with visual feedback.

6. **Responsive Grid**: Uses `lg:grid-cols-2` for side-by-side layout on larger screens.

7. **Slots for Extension**: The canvas includes a slot for ε-δ visualization (added in Increment 13C).

---

## Testing the Widget

After implementation, test manually:

1. Navigate to a page with the widget
2. Click each preset function - curve should update
3. Drag the approach point slider - values should update
4. Click and drag on the canvas - approach point should move
5. Toggle approach direction - one-sided limits should display
6. Check that discontinuous functions show appropriate types
7. Verify URL updates when `sync-url` is enabled
