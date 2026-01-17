import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Matrix2x2, TransformationType, Vector2D } from '@/types/math'
import {
  identityMatrix,
  rotationMatrix,
  scaleMatrix,
  shearXMatrix,
  shearYMatrix,
  reflectionXMatrix,
  reflectionYMatrix,
  reflectionOriginMatrix,
  uniformScaleMatrix,
  matrixVectorMultiply,
  determinant,
  isOrthogonal,
  getTransformationPreset,
  TRANSFORMATION_PRESETS,
} from '@/utils/math/matrix'

export interface UseMatrixTransformationsOptions {
  /** Initial transformation type */
  initialType?: TransformationType
  /** Initial angle for rotation (degrees) */
  initialAngle?: number
  /** Initial scale factors */
  initialScaleX?: number
  initialScaleY?: number
  /** Initial shear factor */
  initialShear?: number
  /** Whether to sync state to URL */
  syncUrl?: boolean
}

/**
 * Composable for managing matrix transformation state and calculations.
 * Optionally syncs state to URL for shareable links.
 */
export function useMatrixTransformations(options: UseMatrixTransformationsOptions = {}) {
  const route = useRoute()
  const router = useRouter()

  // Default values
  const defaults = {
    type: 'identity' as TransformationType,
    angle: 45,
    scaleX: 2,
    scaleY: 2,
    shear: 0.5,
  }

  // ============================================================
  // STATE
  // ============================================================

  const transformationType = ref<TransformationType>(options.initialType ?? defaults.type)
  const angle = ref(options.initialAngle ?? defaults.angle)
  const scaleX = ref(options.initialScaleX ?? defaults.scaleX)
  const scaleY = ref(options.initialScaleY ?? defaults.scaleY)
  const shear = ref(options.initialShear ?? defaults.shear)
  const customMatrix = ref<Matrix2x2>(identityMatrix())

  // URL sync flag to prevent loops
  let isUpdatingFromUrl = false
  let urlUpdateTimeout: ReturnType<typeof setTimeout> | null = null

  // ============================================================
  // COMPUTED: Current Matrix
  // ============================================================

  const currentMatrix = computed<Matrix2x2>(() => {
    switch (transformationType.value) {
      case 'identity':
        return identityMatrix()
      case 'rotation':
        return rotationMatrix(angle.value)
      case 'scale':
        return scaleMatrix(scaleX.value, scaleY.value)
      case 'uniformScale':
        return uniformScaleMatrix(scaleX.value)
      case 'shearX':
        return shearXMatrix(shear.value)
      case 'shearY':
        return shearYMatrix(shear.value)
      case 'reflectX':
        return reflectionXMatrix()
      case 'reflectY':
        return reflectionYMatrix()
      case 'reflectOrigin':
        return reflectionOriginMatrix()
      case 'custom':
        return customMatrix.value
      default:
        return identityMatrix()
    }
  })

  // ============================================================
  // COMPUTED: Derived Values
  // ============================================================

  /** The determinant of the current matrix (area scaling factor) */
  const currentDeterminant = computed(() => determinant(currentMatrix.value))

  /** Whether the current matrix is orthogonal (preserves lengths) */
  const isCurrentOrthogonal = computed(() => isOrthogonal(currentMatrix.value))

  /** Whether the transformation preserves orientation (det > 0) */
  const preservesOrientation = computed(() => currentDeterminant.value > 0)

  /** Unit vectors before transformation */
  const basisI = computed<Vector2D>(() => ({ x: 1, y: 0 }))
  const basisJ = computed<Vector2D>(() => ({ x: 0, y: 1 }))

  /** Unit vectors after transformation */
  const transformedI = computed<Vector2D>(() =>
    matrixVectorMultiply(currentMatrix.value, basisI.value)
  )
  const transformedJ = computed<Vector2D>(() =>
    matrixVectorMultiply(currentMatrix.value, basisJ.value)
  )

  /** Unit square corners after transformation */
  const transformedSquare = computed(() => {
    const m = currentMatrix.value
    return {
      origin: { x: 0, y: 0 },
      corner1: matrixVectorMultiply(m, { x: 1, y: 0 }),
      corner2: matrixVectorMultiply(m, { x: 1, y: 1 }),
      corner3: matrixVectorMultiply(m, { x: 0, y: 1 }),
    }
  })

  // ============================================================
  // METHODS
  // ============================================================

  function setTransformationType(type: TransformationType) {
    transformationType.value = type
  }

  function setAngle(newAngle: number) {
    angle.value = newAngle
  }

  function setScale(sx: number, sy: number) {
    scaleX.value = sx
    scaleY.value = sy
  }

  function setUniformScale(k: number) {
    scaleX.value = k
    scaleY.value = k
  }

  function setShear(k: number) {
    shear.value = k
  }

  function setCustomMatrix(m: Matrix2x2) {
    customMatrix.value = m
    transformationType.value = 'custom'
  }

  function loadPreset(presetId: string) {
    const preset = getTransformationPreset(presetId)
    if (!preset) return

    transformationType.value = preset.type

    if (preset.parameters) {
      if ('angle' in preset.parameters) {
        angle.value = preset.parameters.angle
      }
      if ('sx' in preset.parameters) {
        scaleX.value = preset.parameters.sx
      }
      if ('sy' in preset.parameters) {
        scaleY.value = preset.parameters.sy
      }
      if ('k' in preset.parameters) {
        if (preset.type === 'uniformScale') {
          scaleX.value = preset.parameters.k
          scaleY.value = preset.parameters.k
        } else {
          shear.value = preset.parameters.k
        }
      }
    }
  }

  function resetToDefaults() {
    transformationType.value = defaults.type
    angle.value = defaults.angle
    scaleX.value = defaults.scaleX
    scaleY.value = defaults.scaleY
    shear.value = defaults.shear
    customMatrix.value = identityMatrix()
  }

  // ============================================================
  // URL SYNC (if enabled)
  // ============================================================

  function initFromUrl() {
    if (!options.syncUrl) return

    const query = route.query
    isUpdatingFromUrl = true

    if (query.type && typeof query.type === 'string') {
      const validTypes: TransformationType[] = [
        'identity',
        'rotation',
        'scale',
        'uniformScale',
        'shearX',
        'shearY',
        'reflectX',
        'reflectY',
        'reflectOrigin',
        'custom',
      ]
      if (validTypes.includes(query.type as TransformationType)) {
        transformationType.value = query.type as TransformationType
      }
    }
    if (query.angle && typeof query.angle === 'string') {
      const parsed = parseFloat(query.angle)
      if (!isNaN(parsed)) {
        angle.value = parsed
      }
    }
    if (query.sx && typeof query.sx === 'string') {
      const parsed = parseFloat(query.sx)
      if (!isNaN(parsed)) {
        scaleX.value = parsed
      }
    }
    if (query.sy && typeof query.sy === 'string') {
      const parsed = parseFloat(query.sy)
      if (!isNaN(parsed)) {
        scaleY.value = parsed
      }
    }
    if (query.shear && typeof query.shear === 'string') {
      const parsed = parseFloat(query.shear)
      if (!isNaN(parsed)) {
        shear.value = parsed
      }
    }

    setTimeout(() => {
      isUpdatingFromUrl = false
    }, 0)
  }

  function updateUrl() {
    if (!options.syncUrl || isUpdatingFromUrl) return

    if (urlUpdateTimeout) {
      clearTimeout(urlUpdateTimeout)
    }

    urlUpdateTimeout = setTimeout(() => {
      const query: Record<string, string> = {}

      // Only include non-default values
      if (transformationType.value !== defaults.type) {
        query.type = transformationType.value
      }

      // Only include relevant parameters
      if (transformationType.value === 'rotation') {
        query.type = transformationType.value
        if (angle.value !== defaults.angle) {
          query.angle = angle.value.toString()
        }
      }
      if (transformationType.value === 'scale') {
        query.type = transformationType.value
        if (scaleX.value !== defaults.scaleX) {
          query.sx = scaleX.value.toString()
        }
        if (scaleY.value !== defaults.scaleY) {
          query.sy = scaleY.value.toString()
        }
      }
      if (transformationType.value === 'uniformScale') {
        query.type = transformationType.value
        if (scaleX.value !== defaults.scaleX) {
          query.sx = scaleX.value.toString()
        }
      }
      if (transformationType.value === 'shearX' || transformationType.value === 'shearY') {
        query.type = transformationType.value
        if (shear.value !== defaults.shear) {
          query.shear = shear.value.toString()
        }
      }

      // Preserve other query params
      const existingQuery = { ...route.query }
      delete existingQuery.type
      delete existingQuery.angle
      delete existingQuery.sx
      delete existingQuery.sy
      delete existingQuery.shear

      const newQuery = { ...existingQuery, ...query }

      // Only update if changed
      if (JSON.stringify(newQuery) !== JSON.stringify(route.query)) {
        router.replace({ query: newQuery })
      }
    }, 300)
  }

  // Watch for changes to update URL
  if (options.syncUrl) {
    watch([transformationType, angle, scaleX, scaleY, shear], () => {
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

  onMounted(() => {
    if (options.syncUrl) {
      initFromUrl()
    }
  })

  // ============================================================
  // RETURN
  // ============================================================

  return {
    // State
    transformationType,
    angle,
    scaleX,
    scaleY,
    shear,
    customMatrix,

    // Computed
    currentMatrix,
    currentDeterminant,
    isCurrentOrthogonal,
    preservesOrientation,
    basisI,
    basisJ,
    transformedI,
    transformedJ,
    transformedSquare,

    // Constants
    presets: TRANSFORMATION_PRESETS,

    // Methods
    setTransformationType,
    setAngle,
    setScale,
    setUniformScale,
    setShear,
    setCustomMatrix,
    loadPreset,
    resetToDefaults,
  }
}
