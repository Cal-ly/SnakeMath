/**
 * Composable for managing limit exploration state
 *
 * Provides reactive state for function selection, approach point,
 * epsilon-delta parameters, and URL synchronization.
 */

import { ref, computed, watch, onMounted, type Ref, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type {
  LimitFunctionPreset,
  ApproachDirection,
  LimitResult,
  ContinuityResult,
} from '@/types/math'
import {
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
  selectedPresetId: Ref<string>
  approachPoint: Ref<number>
  approachDirection: Ref<ApproachDirection>
  epsilon: Ref<number>
  delta: Ref<number>
  viewDomain: Ref<{ min: number; max: number }>

  // Computed
  selectedPreset: ComputedRef<LimitFunctionPreset | undefined>
  limitResult: ComputedRef<LimitResult | null>
  continuityResult: ComputedRef<ContinuityResult | null>
  functionPoints: ComputedRef<Array<{ x: number; y: number }>>

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
    const totalPoints = POINTS_PER_UNIT * (max - min)
    const step = (max - min) / totalPoints

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
      approachPoint.value = preset.interestingPoints[0] ?? 0
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
      approachPoint.value = points[index] ?? 0
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
    watch([selectedPresetId, approachPoint, approachDirection, epsilon, delta], () => {
      updateUrl()
    })

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
