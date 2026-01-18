import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Matrix3x3, Vector3D, Rotation3DType } from '@/types/math'
import {
  identity,
  rotationX,
  rotationY,
  rotationZ,
  uniformScale,
  fromEulerAngles,
  multiplyVector,
  determinant,
  isOrthogonal,
  isRotation,
  getRotation3DPreset,
  ROTATION3D_PRESETS,
} from '@/utils/math/matrix3d'

export interface UseMatrixTransformations3DOptions {
  /** Initial transformation type */
  initialType?: Rotation3DType
  /** Initial rotation angle X (degrees) */
  initialAngleX?: number
  /** Initial rotation angle Y (degrees) */
  initialAngleY?: number
  /** Initial rotation angle Z (degrees) */
  initialAngleZ?: number
  /** Initial uniform scale factor */
  initialScale?: number
  /** Whether to sync state to URL */
  syncUrl?: boolean
}

/**
 * Composable for managing 3D matrix transformation state and calculations.
 * Optionally syncs state to URL for shareable links.
 */
export function useMatrixTransformations3D(options: UseMatrixTransformations3DOptions = {}) {
  const route = useRoute()
  const router = useRouter()

  // Default values
  const defaults = {
    type: 'identity' as Rotation3DType,
    angleX: 0,
    angleY: 0,
    angleZ: 0,
    scale: 1,
  }

  // ============================================================
  // STATE
  // ============================================================

  const transformationType = ref<Rotation3DType>(options.initialType ?? defaults.type)
  const angleX = ref(options.initialAngleX ?? defaults.angleX)
  const angleY = ref(options.initialAngleY ?? defaults.angleY)
  const angleZ = ref(options.initialAngleZ ?? defaults.angleZ)
  const scaleFactor = ref(options.initialScale ?? defaults.scale)

  // URL sync flag to prevent loops
  let isUpdatingFromUrl = false
  let urlUpdateTimeout: ReturnType<typeof setTimeout> | null = null

  // ============================================================
  // COMPUTED: Current Matrix
  // ============================================================

  const currentMatrix = computed<Matrix3x3>(() => {
    switch (transformationType.value) {
      case 'identity':
        return identity()
      case 'rotationX':
        return rotationX(angleX.value)
      case 'rotationY':
        return rotationY(angleY.value)
      case 'rotationZ':
        return rotationZ(angleZ.value)
      case 'combined':
        return fromEulerAngles(angleX.value, angleY.value, angleZ.value)
      case 'scale':
        return uniformScale(scaleFactor.value)
      default:
        return identity()
    }
  })

  // ============================================================
  // COMPUTED: Derived Values
  // ============================================================

  /** The determinant of the current matrix */
  const currentDeterminant = computed(() => determinant(currentMatrix.value))

  /** Whether the current matrix is orthogonal (preserves lengths and angles) */
  const isCurrentOrthogonal = computed(() => isOrthogonal(currentMatrix.value))

  /** Whether the current matrix is a pure rotation (orthogonal with det = 1) */
  const isCurrentRotation = computed(() => isRotation(currentMatrix.value))

  /** Whether the transformation preserves orientation (det > 0) */
  const preservesOrientation = computed(() => currentDeterminant.value > 0)

  /** Standard basis vectors */
  const basisI = computed<Vector3D>(() => ({ x: 1, y: 0, z: 0 }))
  const basisJ = computed<Vector3D>(() => ({ x: 0, y: 1, z: 0 }))
  const basisK = computed<Vector3D>(() => ({ x: 0, y: 0, z: 1 }))

  /** Transformed basis vectors (columns of the matrix) */
  const transformedI = computed<Vector3D>(() => multiplyVector(currentMatrix.value, basisI.value))
  const transformedJ = computed<Vector3D>(() => multiplyVector(currentMatrix.value, basisJ.value))
  const transformedK = computed<Vector3D>(() => multiplyVector(currentMatrix.value, basisK.value))

  /** Unit cube vertices after transformation */
  const transformedCube = computed(() => {
    const m = currentMatrix.value
    return {
      // Bottom face
      v000: multiplyVector(m, { x: 0, y: 0, z: 0 }),
      v100: multiplyVector(m, { x: 1, y: 0, z: 0 }),
      v110: multiplyVector(m, { x: 1, y: 1, z: 0 }),
      v010: multiplyVector(m, { x: 0, y: 1, z: 0 }),
      // Top face
      v001: multiplyVector(m, { x: 0, y: 0, z: 1 }),
      v101: multiplyVector(m, { x: 1, y: 0, z: 1 }),
      v111: multiplyVector(m, { x: 1, y: 1, z: 1 }),
      v011: multiplyVector(m, { x: 0, y: 1, z: 1 }),
    }
  })

  // ============================================================
  // METHODS
  // ============================================================

  function setTransformationType(type: Rotation3DType) {
    transformationType.value = type
  }

  function setAngleX(angle: number) {
    angleX.value = angle
  }

  function setAngleY(angle: number) {
    angleY.value = angle
  }

  function setAngleZ(angle: number) {
    angleZ.value = angle
  }

  function setAngles(rx: number, ry: number, rz: number) {
    angleX.value = rx
    angleY.value = ry
    angleZ.value = rz
  }

  function setScale(k: number) {
    scaleFactor.value = k
  }

  function loadPreset(presetId: string) {
    const preset = getRotation3DPreset(presetId)
    if (!preset) return

    transformationType.value = preset.type

    if (preset.parameters) {
      if ('rx' in preset.parameters) {
        angleX.value = preset.parameters.rx
      }
      if ('ry' in preset.parameters) {
        angleY.value = preset.parameters.ry
      }
      if ('rz' in preset.parameters) {
        angleZ.value = preset.parameters.rz
      }
      if ('sx' in preset.parameters) {
        scaleFactor.value = preset.parameters.sx
      }
    }
  }

  function resetToDefaults() {
    transformationType.value = defaults.type
    angleX.value = defaults.angleX
    angleY.value = defaults.angleY
    angleZ.value = defaults.angleZ
    scaleFactor.value = defaults.scale
  }

  // ============================================================
  // URL SYNC (if enabled)
  // ============================================================

  function initFromUrl() {
    if (!options.syncUrl) return

    const query = route.query
    isUpdatingFromUrl = true

    if (query.type && typeof query.type === 'string') {
      const validTypes: Rotation3DType[] = [
        'identity',
        'rotationX',
        'rotationY',
        'rotationZ',
        'combined',
        'scale',
      ]
      if (validTypes.includes(query.type as Rotation3DType)) {
        transformationType.value = query.type as Rotation3DType
      }
    }
    if (query.rx && typeof query.rx === 'string') {
      const parsed = parseFloat(query.rx)
      if (!isNaN(parsed)) {
        angleX.value = parsed
      }
    }
    if (query.ry && typeof query.ry === 'string') {
      const parsed = parseFloat(query.ry)
      if (!isNaN(parsed)) {
        angleY.value = parsed
      }
    }
    if (query.rz && typeof query.rz === 'string') {
      const parsed = parseFloat(query.rz)
      if (!isNaN(parsed)) {
        angleZ.value = parsed
      }
    }
    if (query.scale && typeof query.scale === 'string') {
      const parsed = parseFloat(query.scale)
      if (!isNaN(parsed)) {
        scaleFactor.value = parsed
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
      if (['rotationX', 'combined'].includes(transformationType.value)) {
        if (angleX.value !== defaults.angleX) {
          query.rx = angleX.value.toString()
        }
      }
      if (['rotationY', 'combined'].includes(transformationType.value)) {
        if (angleY.value !== defaults.angleY) {
          query.ry = angleY.value.toString()
        }
      }
      if (['rotationZ', 'combined'].includes(transformationType.value)) {
        if (angleZ.value !== defaults.angleZ) {
          query.rz = angleZ.value.toString()
        }
      }
      if (transformationType.value === 'scale') {
        if (scaleFactor.value !== defaults.scale) {
          query.scale = scaleFactor.value.toString()
        }
      }

      // Preserve other query params
      const existingQuery = { ...route.query }
      delete existingQuery.type
      delete existingQuery.rx
      delete existingQuery.ry
      delete existingQuery.rz
      delete existingQuery.scale

      const newQuery = { ...existingQuery, ...query }

      // Only update if changed
      if (JSON.stringify(newQuery) !== JSON.stringify(route.query)) {
        router.replace({ query: newQuery })
      }
    }, 300)
  }

  // Watch for changes to update URL
  if (options.syncUrl) {
    watch([transformationType, angleX, angleY, angleZ, scaleFactor], () => {
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
    angleX,
    angleY,
    angleZ,
    scaleFactor,

    // Computed
    currentMatrix,
    currentDeterminant,
    isCurrentOrthogonal,
    isCurrentRotation,
    preservesOrientation,
    basisI,
    basisJ,
    basisK,
    transformedI,
    transformedJ,
    transformedK,
    transformedCube,

    // Constants
    presets: ROTATION3D_PRESETS,

    // Methods
    setTransformationType,
    setAngleX,
    setAngleY,
    setAngleZ,
    setAngles,
    setScale,
    loadPreset,
    resetToDefaults,
  }
}
