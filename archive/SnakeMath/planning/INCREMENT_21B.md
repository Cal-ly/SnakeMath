# Increment 21B: Composable & State Management

**Parent Plan**: [PHASE_21_PLAN.md](./PHASE_21_PLAN.md)
**Depends On**: [INCREMENT_21A.md](./INCREMENT_21A.md)
**Focus**: Vue composable for integration state, URL synchronization, validation

---

## Overview

This increment creates the `useIntegration` composable that manages all widget state: selected preset, integration bounds, number of subdivisions, Riemann method, and computed results. It follows the pattern established by `useDerivative.ts` (Phase 14) and includes URL state synchronization with debouncing (per LL-015).

---

## Tasks

### Task 1: Create the useIntegration Composable

**File**: `src/composables/useIntegration.ts` (new)

```ts
/**
 * Composable for managing integration exploration state
 *
 * Provides reactive state for function selection, integration bounds,
 * subdivision count, Riemann method, and URL synchronization.
 *
 * D-127: URL state sync for shareable configurations
 * LL-015: Debounce URL state updates
 */

import { ref, computed, watch, onMounted, type Ref, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type {
  RiemannMethod,
  RiemannSumResult,
  IntegrationResult,
  IntegrationFunctionPreset,
} from '@/types/math'
import {
  getIntegrationPreset,
  riemannSum,
  evaluateIntegration,
  computeExactIntegral,
  clampN,
  validateBounds,
  DEFAULT_N,
  MAX_N,
  MIN_N,
  DEFAULT_METHOD,
  DEFAULT_PRESET,
} from '@/utils/math/integration'

// ============================================================================
// Types
// ============================================================================

export interface UseIntegrationOptions {
  /** Initial preset function ID */
  initialPreset?: string
  /** Initial lower bound */
  initialA?: number
  /** Initial upper bound */
  initialB?: number
  /** Initial number of subdivisions */
  initialN?: number
  /** Initial Riemann method */
  initialMethod?: RiemannMethod
  /** Whether to sync state to URL */
  syncUrl?: boolean
}

export interface UseIntegrationReturn {
  // State
  selectedPresetId: Ref<string>
  lowerBound: Ref<number>
  upperBound: Ref<number>
  subdivisions: Ref<number>
  method: Ref<RiemannMethod>
  viewDomain: Ref<{ min: number; max: number }>

  // Computed
  selectedPreset: ComputedRef<IntegrationFunctionPreset | undefined>
  riemannResult: ComputedRef<RiemannSumResult | null>
  integrationResult: ComputedRef<IntegrationResult | null>
  exactValue: ComputedRef<number | null>
  functionPoints: ComputedRef<Array<{ x: number; y: number }>>
  isValidBounds: ComputedRef<boolean>

  // Methods
  selectPreset: (id: string) => void
  setLowerBound: (a: number) => void
  setUpperBound: (b: number) => void
  setBounds: (a: number, b: number) => void
  setSubdivisions: (n: number) => void
  setMethod: (method: RiemannMethod) => void
  setViewDomain: (min: number, max: number) => void
  resetToDefaults: () => void
  resetToPresetDefaults: () => void
}

// ============================================================================
// Constants
// ============================================================================

const POINTS_PER_UNIT = 50 // Resolution for function curve
const URL_UPDATE_DELAY = 300 // Debounce delay for URL updates (LL-015)

// ============================================================================
// Composable
// ============================================================================

export function useIntegration(options: UseIntegrationOptions = {}): UseIntegrationReturn {
  const route = useRoute()
  const router = useRouter()

  // ============================================================
  // STATE
  // ============================================================

  const selectedPresetId = ref(options.initialPreset ?? DEFAULT_PRESET)
  const lowerBound = ref(options.initialA ?? 0)
  const upperBound = ref(options.initialB ?? 2)
  const subdivisions = ref(options.initialN ?? DEFAULT_N)
  const method = ref<RiemannMethod>(options.initialMethod ?? DEFAULT_METHOD)
  const viewDomain = ref({ min: -0.5, max: 2.5 })

  // Flag to prevent URL update loops
  const isUpdatingFromUrl = ref(false)
  let urlUpdateTimeout: ReturnType<typeof setTimeout> | null = null

  // ============================================================
  // COMPUTED
  // ============================================================

  /**
   * The currently selected preset configuration
   */
  const selectedPreset = computed<IntegrationFunctionPreset | undefined>(() => {
    return getIntegrationPreset(selectedPresetId.value)
  })

  /**
   * Whether current bounds are valid (a < b)
   */
  const isValidBounds = computed<boolean>(() => {
    return validateBounds(lowerBound.value, upperBound.value)
  })

  /**
   * Compute the Riemann sum result with visualization data
   */
  const riemannResult = computed<RiemannSumResult | null>(() => {
    if (!selectedPreset.value || !isValidBounds.value) return null

    return riemannSum(
      selectedPreset.value.fn,
      lowerBound.value,
      upperBound.value,
      subdivisions.value,
      method.value
    )
  })

  /**
   * Compute exact integral value using antiderivative
   */
  const exactValue = computed<number | null>(() => {
    if (!selectedPreset.value || !isValidBounds.value) return null

    return computeExactIntegral(
      selectedPreset.value.antiderivative,
      lowerBound.value,
      upperBound.value
    )
  })

  /**
   * Full integration result with error analysis
   */
  const integrationResult = computed<IntegrationResult | null>(() => {
    if (!selectedPreset.value || !isValidBounds.value) return null

    const exactFn = (a: number, b: number) =>
      computeExactIntegral(selectedPreset.value!.antiderivative, a, b)

    return evaluateIntegration(
      selectedPreset.value.fn,
      lowerBound.value,
      upperBound.value,
      subdivisions.value,
      method.value,
      exactFn
    )
  })

  /**
   * Generate points for rendering the function curve
   */
  const functionPoints = computed<Array<{ x: number; y: number }>>(() => {
    if (!selectedPreset.value) return []

    const fn = selectedPreset.value.fn
    const { min, max } = viewDomain.value
    const points: Array<{ x: number; y: number }> = []
    const totalPoints = Math.max(100, POINTS_PER_UNIT * (max - min))
    const step = (max - min) / totalPoints

    let prevY: number | null = null

    for (let x = min; x <= max; x += step) {
      const y = fn(x)

      // Detect large jumps (discontinuities) and insert break
      if (prevY !== null && isFinite(y) && isFinite(prevY)) {
        const jump = Math.abs(y - prevY)
        if (jump > 10) {
          points.push({ x: x - step / 2, y: NaN })
        }
      }

      if (isFinite(y)) {
        points.push({ x, y })
      }
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
    const preset = getIntegrationPreset(id)
    if (!preset) return

    selectedPresetId.value = id

    // Update bounds to preset defaults
    lowerBound.value = preset.defaultBounds.a
    upperBound.value = preset.defaultBounds.b

    // Update view domain to match preset
    viewDomain.value = { ...preset.viewDomain }

    // Reset subdivisions to default
    subdivisions.value = DEFAULT_N
  }

  /**
   * Set the lower bound with validation
   */
  function setLowerBound(a: number): void {
    if (!isFinite(a)) return
    lowerBound.value = a
  }

  /**
   * Set the upper bound with validation
   */
  function setUpperBound(b: number): void {
    if (!isFinite(b)) return
    upperBound.value = b
  }

  /**
   * Set both bounds at once
   */
  function setBounds(a: number, b: number): void {
    if (!isFinite(a) || !isFinite(b)) return
    lowerBound.value = a
    upperBound.value = b
  }

  /**
   * Set the number of subdivisions with clamping
   */
  function setSubdivisions(n: number): void {
    subdivisions.value = clampN(n)
  }

  /**
   * Set the Riemann method
   */
  function setMethod(newMethod: RiemannMethod): void {
    method.value = newMethod
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
   * Reset to preset's default bounds and settings
   */
  function resetToPresetDefaults(): void {
    const preset = selectedPreset.value
    if (!preset) return

    lowerBound.value = preset.defaultBounds.a
    upperBound.value = preset.defaultBounds.b
    viewDomain.value = { ...preset.viewDomain }
    subdivisions.value = DEFAULT_N
    method.value = DEFAULT_METHOD
  }

  /**
   * Reset everything to defaults
   */
  function resetToDefaults(): void {
    selectPreset(DEFAULT_PRESET)
    method.value = DEFAULT_METHOD
    subdivisions.value = DEFAULT_N
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

    const { preset, a, b, n, method: urlMethod } = route.query

    // Load preset first (sets default bounds)
    if (typeof preset === 'string' && getIntegrationPreset(preset)) {
      selectPreset(preset)
    }

    // Override bounds if specified in URL
    if (typeof a === 'string') {
      const parsed = parseFloat(a)
      if (isFinite(parsed)) {
        lowerBound.value = parsed
      }
    }

    if (typeof b === 'string') {
      const parsed = parseFloat(b)
      if (isFinite(parsed)) {
        upperBound.value = parsed
      }
    }

    if (typeof n === 'string') {
      const parsed = parseInt(n, 10)
      if (isFinite(parsed)) {
        subdivisions.value = clampN(parsed)
      }
    }

    if (typeof urlMethod === 'string') {
      const validMethods: RiemannMethod[] = ['left', 'right', 'midpoint', 'trapezoidal', 'simpson']
      if (validMethods.includes(urlMethod as RiemannMethod)) {
        method.value = urlMethod as RiemannMethod
      }
    }

    isUpdatingFromUrl.value = false
  }

  /**
   * Update URL query parameters from state (debounced)
   */
  function updateUrl(): void {
    if (!options.syncUrl || isUpdatingFromUrl.value) return

    // Clear existing timeout
    if (urlUpdateTimeout) {
      clearTimeout(urlUpdateTimeout)
    }

    // Debounce URL updates (LL-015)
    urlUpdateTimeout = setTimeout(() => {
      const query: Record<string, string> = {}
      const preset = selectedPreset.value

      // Only include non-default values
      if (selectedPresetId.value !== DEFAULT_PRESET) {
        query.preset = selectedPresetId.value
      }

      // Include bounds if different from preset defaults
      if (preset) {
        if (Math.abs(lowerBound.value - preset.defaultBounds.a) > 0.001) {
          query.a = lowerBound.value.toFixed(3)
        }
        if (Math.abs(upperBound.value - preset.defaultBounds.b) > 0.001) {
          query.b = upperBound.value.toFixed(3)
        }
      }

      if (subdivisions.value !== DEFAULT_N) {
        query.n = subdivisions.value.toString()
      }

      if (method.value !== DEFAULT_METHOD) {
        query.method = method.value
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
      [selectedPresetId, lowerBound, upperBound, subdivisions, method],
      () => {
        updateUrl()
      }
    )

    // Initialize from URL on mount
    onMounted(() => {
      initFromUrl()
    })
  }

  // Initialize preset on first use if needed
  onMounted(() => {
    if (!selectedPreset.value) {
      selectPreset(DEFAULT_PRESET)
    } else if (lowerBound.value === 0 && upperBound.value === 2 && !options.initialA && !options.initialB) {
      // Set to preset defaults if using default bounds
      const preset = selectedPreset.value
      lowerBound.value = preset.defaultBounds.a
      upperBound.value = preset.defaultBounds.b
      viewDomain.value = { ...preset.viewDomain }
    }
  })

  // ============================================================
  // RETURN
  // ============================================================

  return {
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
    setBounds,
    setSubdivisions,
    setMethod,
    setViewDomain,
    resetToDefaults,
    resetToPresetDefaults,
  }
}
```

---

### Task 2: Create Composable Tests

**File**: `src/composables/useIntegration.test.ts` (new)

```ts
/**
 * Tests for useIntegration composable
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {},
  }),
  useRouter: () => ({
    replace: vi.fn(),
  }),
}))

import { useIntegration } from './useIntegration'
import { DEFAULT_N, DEFAULT_METHOD, DEFAULT_PRESET, MAX_N, MIN_N } from '@/utils/math/integration'

describe('useIntegration', () => {
  describe('initialization', () => {
    it('initializes with default values', () => {
      const integration = useIntegration()

      expect(integration.selectedPresetId.value).toBe(DEFAULT_PRESET)
      expect(integration.subdivisions.value).toBe(DEFAULT_N)
      expect(integration.method.value).toBe(DEFAULT_METHOD)
    })

    it('accepts initial options', () => {
      const integration = useIntegration({
        initialPreset: 'sine',
        initialA: 0,
        initialB: Math.PI,
        initialN: 20,
        initialMethod: 'trapezoidal',
      })

      expect(integration.selectedPresetId.value).toBe('sine')
      expect(integration.lowerBound.value).toBe(0)
      expect(integration.upperBound.value).toBe(Math.PI)
      expect(integration.subdivisions.value).toBe(20)
      expect(integration.method.value).toBe('trapezoidal')
    })
  })

  describe('preset selection', () => {
    it('updates bounds when selecting preset', () => {
      const integration = useIntegration()

      integration.selectPreset('sine')

      expect(integration.selectedPresetId.value).toBe('sine')
      expect(integration.lowerBound.value).toBe(0)
      expect(integration.upperBound.value).toBeCloseTo(Math.PI, 5)
    })

    it('ignores invalid preset IDs', () => {
      const integration = useIntegration()
      const originalPreset = integration.selectedPresetId.value

      integration.selectPreset('nonexistent')

      expect(integration.selectedPresetId.value).toBe(originalPreset)
    })

    it('resets subdivisions when selecting new preset', () => {
      const integration = useIntegration()
      integration.setSubdivisions(50)

      integration.selectPreset('linear')

      expect(integration.subdivisions.value).toBe(DEFAULT_N)
    })
  })

  describe('bounds management', () => {
    it('sets lower bound', () => {
      const integration = useIntegration()

      integration.setLowerBound(-5)

      expect(integration.lowerBound.value).toBe(-5)
    })

    it('sets upper bound', () => {
      const integration = useIntegration()

      integration.setUpperBound(10)

      expect(integration.upperBound.value).toBe(10)
    })

    it('sets both bounds at once', () => {
      const integration = useIntegration()

      integration.setBounds(-2, 5)

      expect(integration.lowerBound.value).toBe(-2)
      expect(integration.upperBound.value).toBe(5)
    })

    it('rejects non-finite bounds', () => {
      const integration = useIntegration()
      const originalA = integration.lowerBound.value

      integration.setLowerBound(Infinity)

      expect(integration.lowerBound.value).toBe(originalA)
    })

    it('validates bounds correctly', () => {
      const integration = useIntegration()

      integration.setBounds(0, 2)
      expect(integration.isValidBounds.value).toBe(true)

      integration.setBounds(2, 0)
      expect(integration.isValidBounds.value).toBe(false)

      integration.setBounds(1, 1)
      expect(integration.isValidBounds.value).toBe(false)
    })
  })

  describe('subdivisions', () => {
    it('sets subdivisions within range', () => {
      const integration = useIntegration()

      integration.setSubdivisions(50)

      expect(integration.subdivisions.value).toBe(50)
    })

    it('clamps subdivisions below MIN_N', () => {
      const integration = useIntegration()

      integration.setSubdivisions(0)

      expect(integration.subdivisions.value).toBe(MIN_N)
    })

    it('clamps subdivisions above MAX_N', () => {
      const integration = useIntegration()

      integration.setSubdivisions(500)

      expect(integration.subdivisions.value).toBe(MAX_N)
    })

    it('floors non-integer subdivisions', () => {
      const integration = useIntegration()

      integration.setSubdivisions(10.7)

      expect(integration.subdivisions.value).toBe(10)
    })
  })

  describe('method selection', () => {
    it('sets Riemann method', () => {
      const integration = useIntegration()

      integration.setMethod('simpson')

      expect(integration.method.value).toBe('simpson')
    })

    it('accepts all valid methods', () => {
      const integration = useIntegration()
      const methods = ['left', 'right', 'midpoint', 'trapezoidal', 'simpson'] as const

      methods.forEach((m) => {
        integration.setMethod(m)
        expect(integration.method.value).toBe(m)
      })
    })
  })

  describe('computed values', () => {
    it('computes selected preset', () => {
      const integration = useIntegration({ initialPreset: 'quadratic' })

      expect(integration.selectedPreset.value).toBeDefined()
      expect(integration.selectedPreset.value?.id).toBe('quadratic')
      expect(integration.selectedPreset.value?.name).toBe('Quadratic')
    })

    it('computes Riemann sum result', () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 2,
        initialN: 10,
        initialMethod: 'midpoint',
      })

      const result = integration.riemannResult.value
      expect(result).not.toBeNull()
      expect(result?.approximation).toBeCloseTo(8 / 3, 1)
      expect(result?.n).toBe(10)
      expect(result?.samplePoints.length).toBe(10)
    })

    it('returns null Riemann result for invalid bounds', () => {
      const integration = useIntegration({
        initialA: 5,
        initialB: 1, // Invalid: a > b
      })

      expect(integration.riemannResult.value).toBeNull()
    })

    it('computes exact value from antiderivative', () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 2,
      })

      expect(integration.exactValue.value).toBeCloseTo(8 / 3, 10)
    })

    it('computes integration result with error', () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 2,
        initialN: 100,
        initialMethod: 'midpoint',
      })

      const result = integration.integrationResult.value
      expect(result).not.toBeNull()
      expect(result?.exactValue).toBeCloseTo(8 / 3, 10)
      expect(result?.absoluteError).toBeDefined()
      expect(result?.relativeError).toBeDefined()
      expect(result?.relativeError).toBeLessThan(0.01) // Less than 1% error with n=100
    })

    it('generates function points for curve', () => {
      const integration = useIntegration({ initialPreset: 'quadratic' })

      const points = integration.functionPoints.value
      expect(points.length).toBeGreaterThan(50)
      expect(points[0]).toHaveProperty('x')
      expect(points[0]).toHaveProperty('y')
    })
  })

  describe('view domain', () => {
    it('sets view domain', () => {
      const integration = useIntegration()

      integration.setViewDomain(-5, 5)

      expect(integration.viewDomain.value.min).toBe(-5)
      expect(integration.viewDomain.value.max).toBe(5)
    })

    it('rejects invalid view domain', () => {
      const integration = useIntegration()
      const original = { ...integration.viewDomain.value }

      integration.setViewDomain(5, 0) // min > max

      expect(integration.viewDomain.value).toEqual(original)
    })
  })

  describe('reset methods', () => {
    it('resets to preset defaults', () => {
      const integration = useIntegration({ initialPreset: 'sine' })
      integration.setBounds(1, 5)
      integration.setSubdivisions(50)
      integration.setMethod('left')

      integration.resetToPresetDefaults()

      expect(integration.lowerBound.value).toBe(0)
      expect(integration.upperBound.value).toBeCloseTo(Math.PI, 5)
      expect(integration.subdivisions.value).toBe(DEFAULT_N)
      expect(integration.method.value).toBe(DEFAULT_METHOD)
    })

    it('resets to global defaults', () => {
      const integration = useIntegration()
      integration.selectPreset('sine')
      integration.setSubdivisions(50)
      integration.setMethod('simpson')

      integration.resetToDefaults()

      expect(integration.selectedPresetId.value).toBe(DEFAULT_PRESET)
      expect(integration.method.value).toBe(DEFAULT_METHOD)
      expect(integration.subdivisions.value).toBe(DEFAULT_N)
    })
  })

  describe('reactive updates', () => {
    it('recomputes results when bounds change', async () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 1,
        initialN: 100,
      })

      const result1 = integration.exactValue.value
      expect(result1).toBeCloseTo(1 / 3, 5)

      integration.setUpperBound(2)
      await nextTick()

      const result2 = integration.exactValue.value
      expect(result2).toBeCloseTo(8 / 3, 5)
    })

    it('recomputes results when n changes', async () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 2,
        initialN: 10,
      })

      const error10 = integration.integrationResult.value?.relativeError ?? 1

      integration.setSubdivisions(100)
      await nextTick()

      const error100 = integration.integrationResult.value?.relativeError ?? 1
      expect(error100).toBeLessThan(error10)
    })

    it('recomputes results when method changes', async () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 2,
        initialN: 10,
      })

      integration.setMethod('left')
      await nextTick()
      const leftApprox = integration.riemannResult.value?.approximation ?? 0

      integration.setMethod('right')
      await nextTick()
      const rightApprox = integration.riemannResult.value?.approximation ?? 0

      // Left and right should give different results for non-constant functions
      expect(leftApprox).not.toBeCloseTo(rightApprox, 5)
    })
  })
})

describe('useIntegration with preset-specific tests', () => {
  it('handles sine preset correctly', () => {
    const integration = useIntegration({ initialPreset: 'sine' })

    expect(integration.selectedPreset.value?.id).toBe('sine')
    expect(integration.exactValue.value).toBeCloseTo(2, 5)
  })

  it('handles exponential preset correctly', () => {
    const integration = useIntegration({ initialPreset: 'exponential' })

    expect(integration.exactValue.value).toBeCloseTo(Math.E - 1, 5)
  })

  it('handles cubic-signed preset (with negative area)', () => {
    const integration = useIntegration({ initialPreset: 'cubic-signed' })

    expect(integration.exactValue.value).toBeCloseTo(2.25, 5)

    // The Riemann sum should include some negative areas
    const result = integration.riemannResult.value
    expect(result).not.toBeNull()
    const hasNegative = result!.areas.some((a) => a < 0)
    expect(hasNegative).toBe(true)
  })
})
```

---

## File Checklist

| File | Action | Status |
|------|--------|--------|
| `src/composables/useIntegration.ts` | Create new | ⬜ |
| `src/composables/useIntegration.test.ts` | Create new | ⬜ |

---

## Success Criteria

- [ ] Composable compiles without errors (`npm run type-check`)
- [ ] All tests pass (`npm run test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] State changes trigger reactive recomputation
- [ ] URL state synchronization works (manual testing):
  - Changing preset/bounds/n/method updates URL
  - Loading page with query params restores state
- [ ] Invalid bounds handled gracefully (return null results)
- [ ] Preset selection updates bounds and view domain

---

## Testing Commands

```bash
# Run only composable tests
npm run test -- useIntegration

# Run with coverage
npm run test -- useIntegration --coverage

# Type check
npm run type-check
```

---

## Notes

- URL sync is optional (`syncUrl` option) - only enable in widget when needed
- Debouncing (300ms) prevents excessive URL updates during slider drag
- The composable follows the same pattern as `useDerivative.ts` for consistency
- Computed values return `null` when inputs are invalid, allowing UI to show appropriate state
- View domain is separate from bounds to allow seeing context around integration region
