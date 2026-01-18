import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Vector3D, Vector3DOperation } from '@/types/math'
import {
  add,
  subtract,
  scale,
  dot,
  cross,
  magnitude,
  normalize,
  angleBetween,
  isParallel,
  isPerpendicular,
  clampToRange,
  toString,
  VECTOR3D_COORDINATE_RANGE,
  VECTOR3D_PRESETS,
  getVector3DPreset,
} from '@/utils/math/vector3d'

export interface UseVectors3DOptions {
  initialVectorA?: Vector3D
  initialVectorB?: Vector3D
  initialOperation?: Vector3DOperation
  initialScalar?: number
  syncUrl?: boolean
}

export interface Vector3DOperationResult {
  resultVector?: Vector3D
  resultScalar?: number
  resultAngle?: number
  formula: string
  formulaResult: string
}

/**
 * Composable for managing 3D vector operations state and calculations.
 * Optionally syncs state to URL for shareable links.
 */
export function useVectors3D(options: UseVectors3DOptions = {}) {
  const {
    initialVectorA = { x: 1, y: 0, z: 0 },
    initialVectorB = { x: 0, y: 1, z: 0 },
    initialOperation = 'cross',
    initialScalar = 2,
    syncUrl = true,
  } = options

  const route = useRoute()
  const router = useRouter()

  // State
  const vectorA = ref<Vector3D>({ ...initialVectorA })
  const vectorB = ref<Vector3D>({ ...initialVectorB })
  const operation = ref<Vector3DOperation>(initialOperation)
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

  // Computed: cross product (always calculated for verification display)
  const crossProduct = computed(() => cross(vectorA.value, vectorB.value))

  // Computed: current operation result
  const operationResult = computed<Vector3DOperationResult>(() => {
    const a = vectorA.value
    const b = vectorB.value
    const k = scalar.value

    switch (operation.value) {
      case 'add': {
        const result = add(a, b)
        return {
          resultVector: result,
          formula: `\\vec{A} + \\vec{B} = (${a.x} + ${b.x}, ${a.y} + ${b.y}, ${a.z} + ${b.z})`,
          formulaResult: toString(result),
        }
      }
      case 'subtract': {
        const result = subtract(a, b)
        return {
          resultVector: result,
          formula: `\\vec{A} - \\vec{B} = (${a.x} - ${b.x}, ${a.y} - ${b.y}, ${a.z} - ${b.z})`,
          formulaResult: toString(result),
        }
      }
      case 'cross': {
        const result = cross(a, b)
        return {
          resultVector: result,
          formula: `\\vec{A} \\times \\vec{B} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ ${a.x} & ${a.y} & ${a.z} \\\\ ${b.x} & ${b.y} & ${b.z} \\end{vmatrix}`,
          formulaResult: toString(result),
        }
      }
      case 'dot': {
        const result = dot(a, b)
        return {
          resultScalar: result,
          formula: `\\vec{A} \\cdot \\vec{B} = (${a.x})(${b.x}) + (${a.y})(${b.y}) + (${a.z})(${b.z})`,
          formulaResult: `${result.toFixed(2)}`,
        }
      }
      case 'magnitude': {
        const magA = magnitude(a)
        return {
          resultScalar: magA,
          formula: `|\\vec{A}| = \\sqrt{${a.x}^2 + ${a.y}^2 + ${a.z}^2}`,
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
        const result = scale(a, k)
        return {
          resultVector: result,
          formula: `${k}\\vec{A} = ${k}(${a.x}, ${a.y}, ${a.z})`,
          formulaResult: toString(result),
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
          formula: `\\hat{A} = \\frac{\\vec{A}}{|\\vec{A}|} = \\frac{${toString(a)}}{${magnitude(a).toFixed(4)}}`,
          formulaResult: toString(result, 4),
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
  function setVectorA(v: Vector3D) {
    vectorA.value = clampToRange(v, VECTOR3D_COORDINATE_RANGE.min, VECTOR3D_COORDINATE_RANGE.max)
  }

  function setVectorB(v: Vector3D) {
    vectorB.value = clampToRange(v, VECTOR3D_COORDINATE_RANGE.min, VECTOR3D_COORDINATE_RANGE.max)
  }

  function setOperation(op: Vector3DOperation) {
    operation.value = op
  }

  function setScalar(k: number) {
    scalar.value = Math.max(-10, Math.min(10, k))
  }

  function loadPreset(presetId: string) {
    const preset = getVector3DPreset(presetId)
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

    const query = route.query

    isUpdatingFromUrl = true

    // Parse vector A
    if (
      typeof query.ax === 'string' &&
      typeof query.ay === 'string' &&
      typeof query.az === 'string'
    ) {
      const ax = parseFloat(query.ax)
      const ay = parseFloat(query.ay)
      const az = parseFloat(query.az)
      if (!isNaN(ax) && !isNaN(ay) && !isNaN(az)) {
        vectorA.value = clampToRange(
          { x: ax, y: ay, z: az },
          VECTOR3D_COORDINATE_RANGE.min,
          VECTOR3D_COORDINATE_RANGE.max,
        )
      }
    }

    // Parse vector B
    if (
      typeof query.bx === 'string' &&
      typeof query.by === 'string' &&
      typeof query.bz === 'string'
    ) {
      const bx = parseFloat(query.bx)
      const by = parseFloat(query.by)
      const bz = parseFloat(query.bz)
      if (!isNaN(bx) && !isNaN(by) && !isNaN(bz)) {
        vectorB.value = clampToRange(
          { x: bx, y: by, z: bz },
          VECTOR3D_COORDINATE_RANGE.min,
          VECTOR3D_COORDINATE_RANGE.max,
        )
      }
    }

    // Parse operation
    if (
      typeof query.op === 'string' &&
      ['add', 'subtract', 'dot', 'cross', 'magnitude', 'angle', 'scalar', 'normalize'].includes(
        query.op,
      )
    ) {
      operation.value = query.op as Vector3DOperation
    }

    // Parse scalar
    if (typeof query.k === 'string') {
      const k = parseFloat(query.k)
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
      if (
        vectorA.value.x !== initialVectorA.x ||
        vectorA.value.y !== initialVectorA.y ||
        vectorA.value.z !== initialVectorA.z
      ) {
        query.ax = vectorA.value.x.toString()
        query.ay = vectorA.value.y.toString()
        query.az = vectorA.value.z.toString()
      }
      if (
        vectorB.value.x !== initialVectorB.x ||
        vectorB.value.y !== initialVectorB.y ||
        vectorB.value.z !== initialVectorB.z
      ) {
        query.bx = vectorB.value.x.toString()
        query.by = vectorB.value.y.toString()
        query.bz = vectorB.value.z.toString()
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
      delete existingQuery.az
      delete existingQuery.bx
      delete existingQuery.by
      delete existingQuery.bz
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
      },
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
    crossProduct,
    operationResult,

    // Constants
    presets: VECTOR3D_PRESETS,
    coordinateRange: VECTOR3D_COORDINATE_RANGE,

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
