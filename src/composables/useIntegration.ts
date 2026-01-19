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
