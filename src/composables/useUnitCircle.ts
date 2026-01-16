import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { AngleUnit } from '@/utils/math/trigonometry'
import {
  degreesToRadians,
  normalizeAngle,
  calculateTrigValues,
  getExactTrigValues,
  getQuadrant,
  getQuadrantSigns,
  getReferenceAngle,
  getPointOnCircle,
  formatRadians,
  getFirstQuadrantAngles,
  getRemainingSpecialAngles,
} from '@/utils/math/trigonometry'

export interface UseUnitCircleOptions {
  initialAngle?: number
  initialUnit?: AngleUnit
  syncUrl?: boolean
}

/**
 * Composable for managing unit circle state and calculations.
 * Optionally syncs angle to URL for shareable links.
 */
export function useUnitCircle(options: UseUnitCircleOptions = {}) {
  const { initialAngle = 45, initialUnit = 'degrees', syncUrl = true } = options

  const route = useRoute()
  const router = useRouter()

  // State
  const angle = ref(initialAngle)
  const unit = ref<AngleUnit>(initialUnit)
  const showMoreAngles = ref(false)
  const showWaves = ref(false)

  // URL sync state
  let isUpdatingFromUrl = false
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // Computed values
  const angleRadians = computed(() => degreesToRadians(angle.value))

  const trigValues = computed(() => calculateTrigValues(angle.value))

  const exactValues = computed(() => getExactTrigValues(angle.value))

  const quadrant = computed(() => getQuadrant(angle.value))

  const quadrantSigns = computed(() => getQuadrantSigns(quadrant.value))

  const referenceAngle = computed(() => getReferenceAngle(angle.value))

  const pointOnCircle = computed(() => getPointOnCircle(angle.value))

  const radianDisplay = computed(() => formatRadians(angle.value))

  const firstQuadrantAngles = computed(() => getFirstQuadrantAngles())

  const remainingSpecialAngles = computed(() => getRemainingSpecialAngles())

  // Display formatted values
  const displayAngle = computed(() => {
    if (unit.value === 'radians') {
      return radianDisplay.value.symbolic
    }
    return `${angle.value}°`
  })

  /**
   * Set angle value (clamped and normalized)
   */
  function setAngle(degrees: number) {
    // Clamp to reasonable range (-3600 to 3600 for multiple rotations)
    const clamped = Math.max(-3600, Math.min(3600, degrees))
    angle.value = normalizeAngle(clamped)
  }

  /**
   * Increment angle by a delta
   */
  function incrementAngle(delta: number) {
    setAngle(angle.value + delta)
  }

  /**
   * Toggle between degrees and radians display
   */
  function toggleUnit() {
    unit.value = unit.value === 'degrees' ? 'radians' : 'degrees'
  }

  /**
   * Set unit explicitly
   */
  function setUnit(newUnit: AngleUnit) {
    unit.value = newUnit
  }

  // URL Sync
  function initFromUrl() {
    if (!syncUrl) return

    const urlAngle = route.query.angle
    const urlUnit = route.query.unit
    const urlWaves = route.query.waves

    if (typeof urlAngle === 'string') {
      const parsed = parseFloat(urlAngle)
      if (!isNaN(parsed)) {
        isUpdatingFromUrl = true
        angle.value = normalizeAngle(parsed)
        setTimeout(() => {
          isUpdatingFromUrl = false
        }, 0)
      }
    }

    if (urlUnit === 'radians' || urlUnit === 'degrees') {
      unit.value = urlUnit
    }

    if (urlWaves === 'true') {
      showWaves.value = true
    }
  }

  function updateUrl() {
    if (!syncUrl || isUpdatingFromUrl) return

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      const query: Record<string, string> = {}

      // Only include non-default values
      if (angle.value !== initialAngle) {
        query.angle = angle.value.toString()
      }
      if (unit.value !== initialUnit) {
        query.unit = unit.value
      }
      if (showWaves.value) {
        query.waves = 'true'
      }

      // Preserve other query params
      const existingQuery = { ...route.query }
      delete existingQuery.angle
      delete existingQuery.unit
      delete existingQuery.waves

      const newQuery = { ...existingQuery, ...query }

      // Only update if changed
      if (JSON.stringify(newQuery) !== JSON.stringify(route.query)) {
        router.replace({ query: newQuery })
      }
    }, 300)
  }

  // Watch for changes and update URL
  if (syncUrl) {
    watch([angle, unit, showWaves], () => {
      updateUrl()
    })

    // Handle browser back/forward
    watch(
      () => route.query,
      () => {
        if (!isUpdatingFromUrl) {
          initFromUrl()
        }
      }
    )
  }

  // Initialize from URL on mount
  onMounted(() => {
    initFromUrl()
  })

  return {
    // State
    angle,
    unit,
    showMoreAngles,
    showWaves,

    // Computed
    angleRadians,
    trigValues,
    exactValues,
    quadrant,
    quadrantSigns,
    referenceAngle,
    pointOnCircle,
    radianDisplay,
    displayAngle,
    firstQuadrantAngles,
    remainingSpecialAngles,

    // Methods
    setAngle,
    incrementAngle,
    toggleUnit,
    setUnit,
  }
}
