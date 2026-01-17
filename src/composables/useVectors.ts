import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Vector2D, VectorOperation } from '@/types/math'
import {
  vectorAdd,
  vectorSubtract,
  scalarMultiply,
  dotProduct,
  magnitude,
  normalize,
  angleBetween,
  isParallel,
  isPerpendicular,
  clampVectorToRange,
  VECTOR_COORDINATE_RANGE,
  VECTOR_PRESETS,
  getVectorPreset,
} from '@/utils/math/vector'

export interface UseVectorsOptions {
  initialVectorA?: Vector2D
  initialVectorB?: Vector2D
  initialOperation?: VectorOperation
  initialScalar?: number
  syncUrl?: boolean
}

export interface VectorOperationResult {
  resultVector?: Vector2D
  resultScalar?: number
  resultAngle?: number
  formula: string
  formulaResult: string
}

/**
 * Composable for managing vector operations state and calculations.
 * Optionally syncs state to URL for shareable links.
 */
export function useVectors(options: UseVectorsOptions = {}) {
  const {
    initialVectorA = { x: 3, y: 2 },
    initialVectorB = { x: 1, y: 4 },
    initialOperation = 'add',
    initialScalar = 2,
    syncUrl = true,
  } = options

  const route = useRoute()
  const router = useRouter()

  // State
  const vectorA = ref<Vector2D>({ ...initialVectorA })
  const vectorB = ref<Vector2D>({ ...initialVectorB })
  const operation = ref<VectorOperation>(initialOperation)
  const scalar = ref(initialScalar)

  // URL sync state
  let isUpdatingFromUrl = false
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // Computed: magnitudes
  const magnitudeA = computed(() => magnitude(vectorA.value))
  const magnitudeB = computed(() => magnitude(vectorB.value))

  // Computed: normalized vectors
  const normalizedA = computed(() => normalize(vectorA.value))
  const normalizedB = computed(() => normalize(vectorB.value))

  // Computed: relationship checks
  const areParallel = computed(() => isParallel(vectorA.value, vectorB.value))
  const arePerpendicular = computed(() => isPerpendicular(vectorA.value, vectorB.value))

  // Computed: angle between vectors
  const angle = computed(() => angleBetween(vectorA.value, vectorB.value))

  // Computed: current operation result
  const operationResult = computed<VectorOperationResult>(() => {
    const a = vectorA.value
    const b = vectorB.value
    const k = scalar.value

    switch (operation.value) {
      case 'add': {
        const result = vectorAdd(a, b)
        return {
          resultVector: result,
          formula: `\\vec{A} + \\vec{B} = (${a.x} + ${b.x}, ${a.y} + ${b.y})`,
          formulaResult: `(${result.x}, ${result.y})`,
        }
      }
      case 'subtract': {
        const result = vectorSubtract(a, b)
        return {
          resultVector: result,
          formula: `\\vec{A} - \\vec{B} = (${a.x} - ${b.x}, ${a.y} - ${b.y})`,
          formulaResult: `(${result.x}, ${result.y})`,
        }
      }
      case 'dot': {
        const result = dotProduct(a, b)
        return {
          resultScalar: result,
          formula: `\\vec{A} \\cdot \\vec{B} = (${a.x})(${b.x}) + (${a.y})(${b.y})`,
          formulaResult: `${result}`,
        }
      }
      case 'magnitude': {
        const magA = magnitude(a)
        return {
          resultScalar: magA,
          formula: `|\\vec{A}| = \\sqrt{${a.x}^2 + ${a.y}^2}`,
          formulaResult: `${magA.toFixed(4)}`,
        }
      }
      case 'angle': {
        const angleResult = angleBetween(a, b)
        if (angleResult === null) {
          return {
            formula: `\\theta = \\arccos\\left(\\frac{\\vec{A} \\cdot \\vec{B}}{|\\vec{A}| |\\vec{B}|}\\right)`,
            formulaResult: 'undefined (zero vector)',
          }
        }
        const angleRadians = (angleResult * Math.PI) / 180
        return {
          resultAngle: angleResult,
          formula: `\\theta = \\arccos\\left(\\frac{\\vec{A} \\cdot \\vec{B}}{|\\vec{A}| |\\vec{B}|}\\right)`,
          formulaResult: `${angleResult.toFixed(2)}° (${angleRadians.toFixed(4)} rad)`,
        }
      }
      case 'scalar': {
        const result = scalarMultiply(a, k)
        return {
          resultVector: result,
          formula: `${k}\\vec{A} = ${k}(${a.x}, ${a.y})`,
          formulaResult: `(${result.x}, ${result.y})`,
        }
      }
      case 'normalize': {
        const result = normalize(a)
        if (result === null) {
          return {
            formula: `\\hat{A} = \\frac{\\vec{A}}{|\\vec{A}|}`,
            formulaResult: 'undefined (zero vector)',
          }
        }
        return {
          resultVector: result,
          formula: `\\hat{A} = \\frac{\\vec{A}}{|\\vec{A}|} = \\frac{(${a.x}, ${a.y})}{${magnitude(a).toFixed(4)}}`,
          formulaResult: `(${result.x.toFixed(4)}, ${result.y.toFixed(4)})`,
        }
      }
      default:
        return {
          formula: '',
          formulaResult: '',
        }
    }
  })

  // Methods
  function setVectorA(v: Vector2D) {
    vectorA.value = clampVectorToRange(v, VECTOR_COORDINATE_RANGE.min, VECTOR_COORDINATE_RANGE.max)
  }

  function setVectorB(v: Vector2D) {
    vectorB.value = clampVectorToRange(v, VECTOR_COORDINATE_RANGE.min, VECTOR_COORDINATE_RANGE.max)
  }

  function setOperation(op: VectorOperation) {
    operation.value = op
  }

  function setScalar(k: number) {
    scalar.value = Math.max(-10, Math.min(10, k))
  }

  function loadPreset(presetId: string) {
    const preset = getVectorPreset(presetId)
    if (preset) {
      vectorA.value = { ...preset.vectorA }
      vectorB.value = { ...preset.vectorB }
    }
  }

  function swapVectors() {
    const temp = { ...vectorA.value }
    vectorA.value = { ...vectorB.value }
    vectorB.value = temp
  }

  function resetToDefaults() {
    vectorA.value = { ...initialVectorA }
    vectorB.value = { ...initialVectorB }
    operation.value = initialOperation
    scalar.value = initialScalar
  }

  // URL Sync
  function initFromUrl() {
    if (!syncUrl) return

    const urlAx = route.query.ax
    const urlAy = route.query.ay
    const urlBx = route.query.bx
    const urlBy = route.query.by
    const urlOp = route.query.op
    const urlK = route.query.k

    isUpdatingFromUrl = true

    if (typeof urlAx === 'string' && typeof urlAy === 'string') {
      const ax = parseFloat(urlAx)
      const ay = parseFloat(urlAy)
      if (!isNaN(ax) && !isNaN(ay)) {
        vectorA.value = clampVectorToRange(
          { x: ax, y: ay },
          VECTOR_COORDINATE_RANGE.min,
          VECTOR_COORDINATE_RANGE.max
        )
      }
    }

    if (typeof urlBx === 'string' && typeof urlBy === 'string') {
      const bx = parseFloat(urlBx)
      const by = parseFloat(urlBy)
      if (!isNaN(bx) && !isNaN(by)) {
        vectorB.value = clampVectorToRange(
          { x: bx, y: by },
          VECTOR_COORDINATE_RANGE.min,
          VECTOR_COORDINATE_RANGE.max
        )
      }
    }

    if (
      typeof urlOp === 'string' &&
      ['add', 'subtract', 'dot', 'magnitude', 'angle', 'scalar', 'normalize'].includes(urlOp)
    ) {
      operation.value = urlOp as VectorOperation
    }

    if (typeof urlK === 'string') {
      const k = parseFloat(urlK)
      if (!isNaN(k)) {
        scalar.value = Math.max(-10, Math.min(10, k))
      }
    }

    setTimeout(() => {
      isUpdatingFromUrl = false
    }, 0)
  }

  function updateUrl() {
    if (!syncUrl || isUpdatingFromUrl) return

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      const query: Record<string, string> = {}

      // Only include non-default values
      if (vectorA.value.x !== initialVectorA.x || vectorA.value.y !== initialVectorA.y) {
        query.ax = vectorA.value.x.toString()
        query.ay = vectorA.value.y.toString()
      }
      if (vectorB.value.x !== initialVectorB.x || vectorB.value.y !== initialVectorB.y) {
        query.bx = vectorB.value.x.toString()
        query.by = vectorB.value.y.toString()
      }
      if (operation.value !== initialOperation) {
        query.op = operation.value
      }
      if (scalar.value !== initialScalar && operation.value === 'scalar') {
        query.k = scalar.value.toString()
      }

      // Preserve other query params
      const existingQuery = { ...route.query }
      delete existingQuery.ax
      delete existingQuery.ay
      delete existingQuery.bx
      delete existingQuery.by
      delete existingQuery.op
      delete existingQuery.k

      const newQuery = { ...existingQuery, ...query }

      // Only update if changed
      if (JSON.stringify(newQuery) !== JSON.stringify(route.query)) {
        router.replace({ query: newQuery })
      }
    }, 300)
  }

  // Watch for changes and update URL
  if (syncUrl) {
    watch([vectorA, vectorB, operation, scalar], () => {
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
    vectorA,
    vectorB,
    operation,
    scalar,

    // Computed
    magnitudeA,
    magnitudeB,
    normalizedA,
    normalizedB,
    areParallel,
    arePerpendicular,
    angle,
    operationResult,

    // Constants
    presets: VECTOR_PRESETS,
    coordinateRange: VECTOR_COORDINATE_RANGE,

    // Methods
    setVectorA,
    setVectorB,
    setOperation,
    setScalar,
    loadPreset,
    swapVectors,
    resetToDefaults,
  }
}
