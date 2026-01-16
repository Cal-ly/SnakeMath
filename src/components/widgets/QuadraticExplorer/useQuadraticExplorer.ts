import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  calculateVertex,
  calculateDiscriminant,
  solveQuadratic,
  toVertexForm,
  toFactoredForm,
  evaluateQuadratic,
} from '@/utils/math/quadratic'
import type { QuadraticCoefficients } from '@/utils/math/quadratic'
import { getPreset, isValidPresetId } from './presets'
import type { QuadraticPresetId } from './types'

interface UseQuadraticExplorerOptions {
  /** Enable URL state syncing */
  syncUrl?: boolean
  /** Initial preset to load */
  initialPreset?: QuadraticPresetId
}

export function useQuadraticExplorer(options: UseQuadraticExplorerOptions = {}) {
  const { syncUrl = false, initialPreset = 'standard' } = options

  const route = useRoute()
  const router = useRouter()

  // Coefficient state
  const a = ref(1)
  const b = ref(0)
  const c = ref(0)

  // Current preset (null if custom values)
  const currentPreset = ref<QuadraticPresetId | null>(initialPreset)

  // Initialize from URL or preset
  function initializeState() {
    if (syncUrl) {
      const urlPreset = route.query.preset as string
      const urlA = route.query.a as string
      const urlB = route.query.b as string
      const urlC = route.query.c as string

      if (urlPreset && isValidPresetId(urlPreset)) {
        loadPreset(urlPreset)
        return
      }

      if (urlA !== undefined || urlB !== undefined || urlC !== undefined) {
        a.value = parseFloat(urlA) || 1
        b.value = parseFloat(urlB) || 0
        c.value = parseFloat(urlC) || 0
        currentPreset.value = null
        return
      }
    }

    // Default to initial preset
    loadPreset(initialPreset)
  }

  // Load a preset's coefficients
  function loadPreset(presetId: QuadraticPresetId) {
    const preset = getPreset(presetId)
    if (preset) {
      a.value = preset.coefficients.a
      b.value = preset.coefficients.b
      c.value = preset.coefficients.c
      currentPreset.value = presetId
    }
  }

  // Update URL when state changes (debounced via watch)
  let urlUpdateTimeout: ReturnType<typeof setTimeout> | null = null

  function updateUrl() {
    if (!syncUrl) return

    if (urlUpdateTimeout) {
      clearTimeout(urlUpdateTimeout)
    }

    urlUpdateTimeout = setTimeout(() => {
      if (currentPreset.value) {
        router.replace({ query: { preset: currentPreset.value } })
      } else {
        router.replace({
          query: {
            a: a.value.toString(),
            b: b.value.toString(),
            c: c.value.toString(),
          },
        })
      }
    }, 300)
  }

  // Watch for coefficient changes
  watch([a, b, c], () => {
    // Check if current values match a preset
    const matchingPreset = checkPresetMatch()
    if (matchingPreset) {
      currentPreset.value = matchingPreset
    } else {
      currentPreset.value = null
    }
    updateUrl()
  })

  // Check if current coefficients match any preset
  function checkPresetMatch(): QuadraticPresetId | null {
    const presetIds: QuadraticPresetId[] = [
      'standard',
      'wide',
      'narrow',
      'shifted',
      'inverted',
      'projectile',
      'profit',
      'reflector',
    ]

    for (const id of presetIds) {
      const preset = getPreset(id)
      if (
        preset &&
        Math.abs(preset.coefficients.a - a.value) < 0.001 &&
        Math.abs(preset.coefficients.b - b.value) < 0.001 &&
        Math.abs(preset.coefficients.c - c.value) < 0.001
      ) {
        return id
      }
    }
    return null
  }

  // Derived values
  const coefficients = computed<QuadraticCoefficients>(() => ({
    a: a.value,
    b: b.value,
    c: c.value,
  }))

  const vertex = computed(() => {
    if (a.value === 0) return { x: 0, y: c.value }
    return calculateVertex(coefficients.value)
  })

  const discriminant = computed(() => {
    if (a.value === 0) return { value: 0, rootType: 'one-real' as const }
    return calculateDiscriminant(coefficients.value)
  })

  const roots = computed(() => {
    if (a.value === 0) {
      // Linear: bx + c = 0 → x = -c/b
      if (b.value === 0) return { type: 'two-complex' as const, roots: [] }
      return { type: 'one-real' as const, roots: [-c.value / b.value] }
    }
    return solveQuadratic(coefficients.value)
  })

  const vertexForm = computed(() => {
    if (a.value === 0) return { a: 0, h: 0, k: c.value }
    return toVertexForm(coefficients.value)
  })

  const factoredForm = computed(() => {
    if (a.value === 0) return null
    return toFactoredForm(coefficients.value)
  })

  // Create the quadratic function for plotting
  const quadraticFn = computed(() => {
    return (x: number) => evaluateQuadratic(coefficients.value, x)
  })

  // Auto-scale coordinate system bounds
  const bounds = computed(() => {
    const v = vertex.value
    const r = roots.value.roots

    // Start with base padding around vertex
    let xMin = v.x - 5
    let xMax = v.x + 5
    let yMin = Math.min(-2, v.y - 5)
    let yMax = Math.max(10, v.y + 5)

    // Expand to include roots if they exist
    if (r.length > 0) {
      xMin = Math.min(xMin, ...r.map((root) => root - 2))
      xMax = Math.max(xMax, ...r.map((root) => root + 2))
    }

    // Include y-intercept
    yMin = Math.min(yMin, c.value - 2)
    yMax = Math.max(yMax, c.value + 2)

    // Round to nice values and ensure minimum range
    xMin = Math.floor(xMin)
    xMax = Math.ceil(xMax)
    yMin = Math.floor(yMin)
    yMax = Math.ceil(yMax)

    // Ensure minimum range of 10
    if (xMax - xMin < 10) {
      const mid = (xMin + xMax) / 2
      xMin = mid - 5
      xMax = mid + 5
    }
    if (yMax - yMin < 10) {
      const mid = (yMin + yMax) / 2
      yMin = mid - 5
      yMax = mid + 5
    }

    return { xMin, xMax, yMin, yMax }
  })

  // Y-intercept
  const yIntercept = computed(() => ({ x: 0, y: c.value }))

  // Axis of symmetry
  const axisOfSymmetry = computed(() => (a.value === 0 ? 0 : -b.value / (2 * a.value)))

  // Is this a valid quadratic?
  const isValidQuadratic = computed(() => a.value !== 0)

  // Get current preset object
  const preset = computed(() => (currentPreset.value ? getPreset(currentPreset.value) : null))

  return {
    // State
    a,
    b,
    c,
    currentPreset,

    // Actions
    loadPreset,
    initializeState,

    // Derived
    coefficients,
    vertex,
    discriminant,
    roots,
    vertexForm,
    factoredForm,
    quadraticFn,
    bounds,
    yIntercept,
    axisOfSymmetry,
    isValidQuadratic,
    preset,
  }
}
