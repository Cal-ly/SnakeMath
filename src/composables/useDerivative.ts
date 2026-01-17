/**
 * Composable for managing derivative exploration state
 *
 * Provides reactive state for function selection, point of tangency,
 * secant line parameters, and URL synchronization.
 *
 * D-116: Composable pattern for derivative state (consistent with useLimits)
 */

import { ref, computed, watch, onMounted, type Ref, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type {
  DerivativeFunctionPreset,
  DerivativeResult,
  TangentLine,
  SecantLine,
} from '@/types/math'
import {
  getDerivativePreset,
  evaluateDerivative,
  calculateTangentLine,
  calculateSecantLine,
  generateSecantSequence,
  DEFAULT_PRESET,
  DEFAULT_POINT,
  SECANT_H_VALUES,
} from '@/utils/math/derivative'

// ============================================================================
// Types
// ============================================================================

export interface UseDerivativeOptions {
  /** Initial preset function ID */
  initialPreset?: string
  /** Initial point of tangency */
  initialPoint?: number
  /** Whether to sync state to URL */
  syncUrl?: boolean
}

export interface UseDerivativeReturn {
  // State
  selectedPresetId: Ref<string>
  pointX: Ref<number>
  hValue: Ref<number>
  showSecantLines: Ref<boolean>
  showDerivativeCurve: Ref<boolean>
  viewDomain: Ref<{ min: number; max: number }>

  // Computed
  selectedPreset: ComputedRef<DerivativeFunctionPreset | undefined>
  derivativeResult: ComputedRef<DerivativeResult | null>
  tangentLine: ComputedRef<TangentLine | null>
  secantLine: ComputedRef<SecantLine | null>
  secantSequence: ComputedRef<SecantLine[]>
  functionPoints: ComputedRef<Array<{ x: number; y: number }>>
  derivativePoints: ComputedRef<Array<{ x: number; y: number }>>

  // Methods
  selectPreset: (id: string) => void
  setPointX: (x: number) => void
  setHValue: (h: number) => void
  setShowSecantLines: (show: boolean) => void
  setShowDerivativeCurve: (show: boolean) => void
  setViewDomain: (min: number, max: number) => void
  selectInterestingPoint: (index: number) => void
  resetToDefaults: () => void
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_H = 0.5
const POINTS_PER_UNIT = 50 // Resolution for function curve
const URL_UPDATE_DELAY = 300 // Debounce delay for URL updates

// ============================================================================
// Composable
// ============================================================================

export function useDerivative(options: UseDerivativeOptions = {}): UseDerivativeReturn {
  const route = useRoute()
  const router = useRouter()

  // ============================================================
  // STATE
  // ============================================================

  const selectedPresetId = ref(options.initialPreset ?? DEFAULT_PRESET)
  const pointX = ref(options.initialPoint ?? DEFAULT_POINT)
  const hValue = ref(DEFAULT_H)
  const showSecantLines = ref(false)
  const showDerivativeCurve = ref(false)
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
  const selectedPreset = computed<DerivativeFunctionPreset | undefined>(() => {
    return getDerivativePreset(selectedPresetId.value)
  })

  /**
   * Evaluate the derivative at the current point
   */
  const derivativeResult = computed<DerivativeResult | null>(() => {
    if (!selectedPreset.value) return null
    return evaluateDerivative(
      selectedPreset.value.fn,
      pointX.value,
      selectedPreset.value.derivative
    )
  })

  /**
   * Calculate the tangent line at the current point
   */
  const tangentLine = computed<TangentLine | null>(() => {
    if (!selectedPreset.value || !derivativeResult.value?.exists) return null
    return calculateTangentLine(
      selectedPreset.value.fn,
      pointX.value,
      derivativeResult.value.exactValue ?? derivativeResult.value.value
    )
  })

  /**
   * Calculate a single secant line with the current h value
   */
  const secantLine = computed<SecantLine | null>(() => {
    if (!selectedPreset.value) return null
    return calculateSecantLine(selectedPreset.value.fn, pointX.value, hValue.value)
  })

  /**
   * Generate a sequence of secant lines for animation
   */
  const secantSequence = computed<SecantLine[]>(() => {
    if (!selectedPreset.value) return []
    return generateSecantSequence(selectedPreset.value.fn, pointX.value, SECANT_H_VALUES)
  })

  /**
   * Generate points for rendering the function curve
   */
  const functionPoints = computed<Array<{ x: number; y: number }>>(() => {
    if (!selectedPreset.value) return []

    const fn = selectedPreset.value.fn
    const { min, max } = viewDomain.value
    const points: Array<{ x: number; y: number }> = []
    const totalPoints = POINTS_PER_UNIT * (max - min)
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

      points.push({ x, y })
      prevY = isFinite(y) ? y : null
    }

    return points
  })

  /**
   * Generate points for rendering the derivative curve
   */
  const derivativePoints = computed<Array<{ x: number; y: number }>>(() => {
    if (!selectedPreset.value) return []

    const derivative = selectedPreset.value.derivative
    const { min, max } = viewDomain.value
    const points: Array<{ x: number; y: number }> = []
    const totalPoints = POINTS_PER_UNIT * (max - min)
    const step = (max - min) / totalPoints

    let prevY: number | null = null

    for (let x = min; x <= max; x += step) {
      const y = derivative(x)

      // Detect large jumps and insert break
      if (prevY !== null && isFinite(y) && isFinite(prevY)) {
        const jump = Math.abs(y - prevY)
        if (jump > 10) {
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
    const preset = getDerivativePreset(id)
    if (!preset) return

    selectedPresetId.value = id

    // Update view domain to match preset
    viewDomain.value = { ...preset.domain }

    // Set point to first interesting point or center of domain
    if (preset.interestingPoints.length > 0) {
      pointX.value = preset.interestingPoints[0]?.x ?? 0
    } else {
      pointX.value = (preset.domain.min + preset.domain.max) / 2
    }

    // Reset h value
    hValue.value = DEFAULT_H
  }

  /**
   * Set the point of tangency
   */
  function setPointX(x: number): void {
    const { min, max } = viewDomain.value
    // Clamp to domain
    pointX.value = Math.max(min + 0.1, Math.min(max - 0.1, x))
  }

  /**
   * Set the h value for secant line
   */
  function setHValue(h: number): void {
    hValue.value = Math.max(0.001, Math.min(2, h))
  }

  /**
   * Toggle secant line visibility
   */
  function setShowSecantLines(show: boolean): void {
    showSecantLines.value = show
  }

  /**
   * Toggle derivative curve visibility
   */
  function setShowDerivativeCurve(show: boolean): void {
    showDerivativeCurve.value = show
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
      pointX.value = points[index]?.x ?? 0
    }
  }

  /**
   * Reset all values to defaults
   */
  function resetToDefaults(): void {
    selectPreset(DEFAULT_PRESET)
    showSecantLines.value = false
    showDerivativeCurve.value = false
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

    const { preset, point, h, secant, deriv } = route.query

    if (typeof preset === 'string' && getDerivativePreset(preset)) {
      selectPreset(preset)
    }

    if (typeof point === 'string') {
      const parsed = parseFloat(point)
      if (isFinite(parsed)) {
        pointX.value = parsed
      }
    }

    if (typeof h === 'string') {
      const parsed = parseFloat(h)
      if (isFinite(parsed) && parsed > 0) {
        hValue.value = parsed
      }
    }

    if (secant === 'true' || secant === '1') {
      showSecantLines.value = true
    }

    if (deriv === 'true' || deriv === '1') {
      showDerivativeCurve.value = true
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

      if (Math.abs(pointX.value - DEFAULT_POINT) > 0.01) {
        query.point = pointX.value.toFixed(2)
      }

      if (Math.abs(hValue.value - DEFAULT_H) > 0.01) {
        query.h = hValue.value.toFixed(3)
      }

      if (showSecantLines.value) {
        query.secant = '1'
      }

      if (showDerivativeCurve.value) {
        query.deriv = '1'
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
      [selectedPresetId, pointX, hValue, showSecantLines, showDerivativeCurve],
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
    pointX,
    hValue,
    showSecantLines,
    showDerivativeCurve,
    viewDomain,

    // Computed
    selectedPreset,
    derivativeResult,
    tangentLine,
    secantLine,
    secantSequence,
    functionPoints,
    derivativePoints,

    // Methods
    selectPreset,
    setPointX,
    setHValue,
    setShowSecantLines,
    setShowDerivativeCurve,
    setViewDomain,
    selectInterestingPoint,
    resetToDefaults,
  }
}
