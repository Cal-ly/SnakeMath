# Increment 21D: Convergence Animation

**Parent Plan**: [PHASE_21_PLAN.md](./PHASE_21_PLAN.md)
**Depends On**: [INCREMENT_21C.md](./INCREMENT_21C.md)
**Focus**: Animated demonstration of Riemann sum convergence as n → ∞

---

## Overview

This increment adds the convergence animation panel to the IntegrationExplorer widget. The animation smoothly increases n from a starting value to a maximum, visually demonstrating how the Riemann sum approximation converges to the exact integral.

---

## Tasks

### Task 1: Create ConvergenceAnimation Component

**File**: `src/components/widgets/IntegrationExplorer/ConvergenceAnimation.vue` (new)

```vue
<script setup lang="ts">
/**
 * ConvergenceAnimation - Animated demonstration of Riemann sum convergence
 *
 * Features:
 * - Play/pause/reset controls
 * - Smooth n increment using requestAnimationFrame
 * - Speed control (0.5x to 3x)
 * - Real-time display of approximation and error
 *
 * D-125: Smooth n increment with easing
 */

import { ref, computed, watch, onUnmounted } from 'vue'
import { MAX_N } from '@/utils/math/integration'

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  /** Current number of subdivisions */
  currentN: number
  /** Current approximation value */
  approximation: number | null
  /** Current exact value */
  exactValue: number | null
  /** Current relative error */
  relativeError: number | null
  /** Whether bounds are valid */
  isValid: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:n': [value: number]
}>()

// ============================================================================
// State
// ============================================================================

const isPlaying = ref(false)
const animationSpeed = ref(1) // 0.5, 1, 2, or 3
const startN = ref(4) // Starting n for animation
const targetN = ref(MAX_N) // Target n for animation

// Animation frame tracking
let animationFrameId: number | null = null
let lastTimestamp: number | null = null

// ============================================================================
// Computed
// ============================================================================

const progress = computed(() => {
  if (targetN.value <= startN.value) return 100
  return ((props.currentN - startN.value) / (targetN.value - startN.value)) * 100
})

const approximationDisplay = computed(() => {
  if (props.approximation === null) return '—'
  return props.approximation.toFixed(4)
})

const exactDisplay = computed(() => {
  if (props.exactValue === null) return '—'
  return props.exactValue.toFixed(4)
})

const errorDisplay = computed(() => {
  if (props.relativeError === null) return '—'
  return (props.relativeError * 100).toFixed(2) + '%'
})

const isAtTarget = computed(() => props.currentN >= targetN.value)

// ============================================================================
// Animation Logic
// ============================================================================

/**
 * Start or resume the animation
 */
function play() {
  if (!props.isValid || isAtTarget.value) return

  isPlaying.value = true
  lastTimestamp = null
  animationFrameId = requestAnimationFrame(animate)
}

/**
 * Pause the animation
 */
function pause() {
  isPlaying.value = false
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

/**
 * Reset animation to starting n
 */
function reset() {
  pause()
  emit('update:n', startN.value)
}

/**
 * Animation frame callback
 */
function animate(timestamp: number) {
  if (!isPlaying.value) return

  if (lastTimestamp === null) {
    lastTimestamp = timestamp
  }

  const deltaTime = timestamp - lastTimestamp
  lastTimestamp = timestamp

  // Calculate n increment based on speed
  // Base rate: go from 4 to 200 in about 5 seconds at 1x speed
  const baseRate = (targetN.value - startN.value) / 5000 // n per ms
  const increment = baseRate * deltaTime * animationSpeed.value

  const newN = Math.min(targetN.value, props.currentN + increment)

  if (newN >= targetN.value) {
    emit('update:n', targetN.value)
    pause()
  } else {
    emit('update:n', Math.round(newN))
    animationFrameId = requestAnimationFrame(animate)
  }
}

/**
 * Toggle play/pause
 */
function togglePlay() {
  if (isPlaying.value) {
    pause()
  } else {
    if (isAtTarget.value) {
      // Reset first if at target
      emit('update:n', startN.value)
      // Small delay to let state update before playing
      setTimeout(() => play(), 50)
    } else {
      play()
    }
  }
}

/**
 * Set animation speed
 */
function setSpeed(speed: number) {
  animationSpeed.value = speed
}

// ============================================================================
// Watchers
// ============================================================================

// Stop animation if bounds become invalid
watch(() => props.isValid, (valid) => {
  if (!valid && isPlaying.value) {
    pause()
  }
})

// ============================================================================
// Cleanup
// ============================================================================

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="p-4 rounded-lg border border-border bg-surface-alt space-y-4">
    <h4 class="font-semibold text-primary flex items-center gap-2">
      <i class="fa-solid fa-play-circle" aria-hidden="true" />
      Convergence Animation
    </h4>

    <!-- Controls row -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Play/Pause button -->
      <button
        type="button"
        :disabled="!isValid"
        class="px-4 py-2 rounded-md font-medium transition-all
               disabled:opacity-50 disabled:cursor-not-allowed"
        :class="isPlaying
          ? 'bg-amber-500 text-white hover:bg-amber-600'
          : 'bg-primary text-white hover:bg-primary-dark'"
        @click="togglePlay"
      >
        <i
          :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
          class="mr-1.5"
          aria-hidden="true"
        />
        {{ isPlaying ? 'Pause' : (isAtTarget ? 'Replay' : 'Play') }}
      </button>

      <!-- Reset button -->
      <button
        type="button"
        :disabled="!isValid"
        class="px-3 py-2 rounded-md border border-border
               hover:border-primary hover:text-primary
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors"
        @click="reset"
      >
        <i class="fa-solid fa-rotate-left mr-1.5" aria-hidden="true" />
        Reset
      </button>

      <!-- Speed selector -->
      <div class="flex items-center gap-2 ml-auto">
        <span class="text-sm text-text-secondary">Speed:</span>
        <div class="flex rounded-md border border-border overflow-hidden">
          <button
            v-for="speed in [0.5, 1, 2, 3]"
            :key="speed"
            type="button"
            class="px-2 py-1 text-sm transition-colors"
            :class="animationSpeed === speed
              ? 'bg-primary text-white'
              : 'bg-surface hover:bg-surface-alt'"
            @click="setSpeed(speed)"
          >
            {{ speed }}x
          </button>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="space-y-1">
      <div class="flex justify-between text-xs text-text-secondary">
        <span>n = {{ startN }}</span>
        <span>n = {{ currentN }}</span>
        <span>n = {{ targetN }}</span>
      </div>
      <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary transition-all duration-100 ease-out"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- Live stats -->
    <div class="grid grid-cols-3 gap-3 text-sm">
      <div class="p-2 rounded bg-surface border border-border">
        <div class="text-xs text-text-muted mb-1">Subdivisions</div>
        <div class="font-mono font-semibold">n = {{ currentN }}</div>
      </div>
      <div class="p-2 rounded bg-surface border border-border">
        <div class="text-xs text-text-muted mb-1">Approximation</div>
        <div class="font-mono font-semibold">{{ approximationDisplay }}</div>
      </div>
      <div
        class="p-2 rounded border"
        :class="relativeError !== null && relativeError < 0.01
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-surface border-border'"
      >
        <div class="text-xs mb-1"
          :class="relativeError !== null && relativeError < 0.01
            ? 'text-green-600 dark:text-green-400'
            : 'text-text-muted'">
          Error
        </div>
        <div class="font-mono font-semibold"
          :class="relativeError !== null && relativeError < 0.01
            ? 'text-green-600 dark:text-green-400'
            : ''">
          {{ errorDisplay }}
        </div>
      </div>
    </div>

    <!-- Convergence hint -->
    <p class="text-xs text-text-muted">
      <i class="fa-solid fa-info-circle mr-1" aria-hidden="true" />
      Watch the error decrease as n increases. The approximation converges to the exact value!
    </p>
  </div>
</template>
```

---

### Task 2: Integrate Animation into Main Widget

**File**: `src/components/widgets/IntegrationExplorer/IntegrationExplorer.vue` (update)

Add the ConvergenceAnimation component to the widget. Update the existing file:

```vue
<script setup lang="ts">
/**
 * IntegrationExplorer - Main widget for exploring definite integrals
 * ... (keep existing header comments)
 */

import { ref } from 'vue'
import { useIntegration } from '@/composables/useIntegration'
import FunctionSelector from './FunctionSelector.vue'
import BoundsControls from './BoundsControls.vue'
import MethodSelector from './MethodSelector.vue'
import ResultsDisplay from './ResultsDisplay.vue'
import IntegrationCanvas from './IntegrationCanvas.vue'
import ConvergenceAnimation from './ConvergenceAnimation.vue'
import CollapsiblePanel from '@/components/ui/CollapsiblePanel.vue'

// ... (keep existing Props interface)

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
  exactValue,
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

// Animation panel state
const showAnimationPanel = ref(false)

// ============================================================================
// Handlers
// ============================================================================

function handlePresetChange(id: string) {
  selectPreset(id)
}

function handleAnimationNChange(n: number) {
  setSubdivisions(n)
}

function toggleAnimationPanel() {
  showAnimationPanel.value = !showAnimationPanel.value
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

    <hr class="border-border" />

    <!-- Convergence Animation Panel (collapsible) -->
    <CollapsiblePanel
      title="Convergence Animation"
      :default-expanded="false"
    >
      <template #icon>
        <i class="fa-solid fa-play-circle text-primary" aria-hidden="true" />
      </template>
      <ConvergenceAnimation
        :current-n="subdivisions"
        :approximation="integrationResult?.approximation ?? null"
        :exact-value="exactValue"
        :relative-error="integrationResult?.relativeError ?? null"
        :is-valid="isValidBounds"
        @update:n="handleAnimationNChange"
      />
    </CollapsiblePanel>

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

### Task 3: Update Barrel Export

**File**: `src/components/widgets/IntegrationExplorer/index.ts` (update)

Add ConvergenceAnimation to exports (optional, for direct usage):

```ts
export { default as IntegrationExplorer } from './IntegrationExplorer.vue'
export { default as ConvergenceAnimation } from './ConvergenceAnimation.vue'
```

---

## File Checklist

| File | Action | Status |
|------|--------|--------|
| `src/components/widgets/IntegrationExplorer/ConvergenceAnimation.vue` | Create new | ⬜ |
| `src/components/widgets/IntegrationExplorer/IntegrationExplorer.vue` | Update | ⬜ |
| `src/components/widgets/IntegrationExplorer/index.ts` | Update | ⬜ |

---

## Success Criteria

- [ ] Animation compiles without errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Play button starts animation
- [ ] Pause button stops animation mid-way
- [ ] Reset button returns n to starting value (4)
- [ ] Speed control affects animation rate
- [ ] Animation stops automatically at n = 200
- [ ] Progress bar updates during animation
- [ ] Error display turns green when error < 1%
- [ ] Animation cleanup on component unmount
- [ ] Animation pauses if bounds become invalid

---

## Manual Testing Checklist

1. **Basic animation**
   - [ ] Click Play — animation starts
   - [ ] Watch n increase from 4 to 200
   - [ ] Animation stops at n = 200
   - [ ] Error decreases visibly during animation

2. **Controls**
   - [ ] Pause mid-animation — stops immediately
   - [ ] Play after pause — continues from current n
   - [ ] Reset — returns to n = 4
   - [ ] Replay (when at n = 200) — resets and starts

3. **Speed control**
   - [ ] 0.5x — noticeably slower
   - [ ] 1x — default speed
   - [ ] 2x — noticeably faster
   - [ ] 3x — very fast

4. **Edge cases**
   - [ ] Invalid bounds — animation disabled
   - [ ] Change preset during animation — animation continues with new function
   - [ ] Navigate away — no console errors (proper cleanup)

5. **Visual feedback**
   - [ ] Progress bar fills as animation progresses
   - [ ] Current n updates in real-time
   - [ ] Approximation updates in real-time
   - [ ] Error turns green when < 1%

---

## Animation Timing

| Speed | Time to complete (4 → 200) |
|-------|---------------------------|
| 0.5x  | ~10 seconds |
| 1x    | ~5 seconds |
| 2x    | ~2.5 seconds |
| 3x    | ~1.7 seconds |

---

## Notes

- Uses `requestAnimationFrame` for smooth 60fps animation
- Calculates delta time between frames for consistent speed regardless of frame rate
- The animation panel is collapsible by default to reduce visual clutter
- Animation automatically pauses when reaching target or when bounds become invalid
- Consider adding an "auto-play on load" option for embedded demos in future
