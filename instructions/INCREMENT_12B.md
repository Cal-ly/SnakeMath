# Increment 12B: MatrixTransformations Widget Core

**Goal**: Create the main widget structure with transformation canvas and selector.

**Estimated Time**: 60 minutes

**Prerequisites**: Increment 12A complete (matrix utilities exist and tests pass)

---

## Files to Create

### 1. `src/composables/useMatrixTransformations.ts`

Follow the pattern from `useVectors.ts`:

```typescript
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Matrix2x2, TransformationType, TransformationPreset, Vector2D } from '@/types'
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
  getTransformationType,
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

export interface TransformationState {
  type: TransformationType
  angle: number      // for rotation
  scaleX: number     // for scale
  scaleY: number     // for scale
  shear: number      // for shear
  customMatrix: Matrix2x2  // for custom mode
}

export function useMatrixTransformations(options: UseMatrixTransformationsOptions = {}) {
  const route = useRoute()
  const router = useRouter()

  // ============================================================
  // STATE
  // ============================================================

  const transformationType = ref<TransformationType>(options.initialType ?? 'identity')
  const angle = ref(options.initialAngle ?? 45)
  const scaleX = ref(options.initialScaleX ?? 2)
  const scaleY = ref(options.initialScaleY ?? 2)
  const shear = ref(options.initialShear ?? 0.5)
  const customMatrix = ref<Matrix2x2>(identityMatrix())

  // URL sync flag to prevent loops
  const isUpdatingFromUrl = ref(false)

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
    transformationType.value = 'identity'
    angle.value = 45
    scaleX.value = 2
    scaleY.value = 2
    shear.value = 0.5
    customMatrix.value = identityMatrix()
  }

  // ============================================================
  // URL SYNC (if enabled)
  // ============================================================

  let urlUpdateTimeout: ReturnType<typeof setTimeout> | null = null

  function initFromUrl() {
    if (!options.syncUrl) return

    const query = route.query
    isUpdatingFromUrl.value = true

    if (query.type && typeof query.type === 'string') {
      transformationType.value = query.type as TransformationType
    }
    if (query.angle) {
      angle.value = parseFloat(query.angle as string)
    }
    if (query.sx) {
      scaleX.value = parseFloat(query.sx as string)
    }
    if (query.sy) {
      scaleY.value = parseFloat(query.sy as string)
    }
    if (query.shear) {
      shear.value = parseFloat(query.shear as string)
    }

    isUpdatingFromUrl.value = false
  }

  function updateUrl() {
    if (!options.syncUrl || isUpdatingFromUrl.value) return

    if (urlUpdateTimeout) {
      clearTimeout(urlUpdateTimeout)
    }

    urlUpdateTimeout = setTimeout(() => {
      const query: Record<string, string> = {
        type: transformationType.value,
      }

      // Only include relevant parameters
      if (transformationType.value === 'rotation') {
        query.angle = angle.value.toString()
      }
      if (transformationType.value === 'scale') {
        query.sx = scaleX.value.toString()
        query.sy = scaleY.value.toString()
      }
      if (transformationType.value === 'uniformScale') {
        query.sx = scaleX.value.toString()
      }
      if (transformationType.value === 'shearX' || transformationType.value === 'shearY') {
        query.shear = shear.value.toString()
      }

      router.replace({ query })
    }, 300)
  }

  // Watch for changes to update URL
  if (options.syncUrl) {
    watch(
      [transformationType, angle, scaleX, scaleY, shear],
      () => updateUrl(),
      { deep: true }
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
```

### 2. Widget Directory Structure

Create the following files:

```
src/components/widgets/MatrixTransformations/
├── index.ts
├── MatrixTransformations.vue
├── TransformSelector.vue
└── TransformationCanvas.vue
```

### 3. `src/components/widgets/MatrixTransformations/index.ts`

```typescript
export { default as MatrixTransformations } from './MatrixTransformations.vue'
```

### 4. `src/components/widgets/MatrixTransformations/MatrixTransformations.vue`

Main orchestrator component:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { TransformationType } from '@/types'
import { useMatrixTransformations } from '@/composables/useMatrixTransformations'
import TransformSelector from './TransformSelector.vue'
import TransformationCanvas from './TransformationCanvas.vue'

interface Props {
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: false,
})

const {
  transformationType,
  angle,
  scaleX,
  scaleY,
  shear,
  currentMatrix,
  currentDeterminant,
  isCurrentOrthogonal,
  preservesOrientation,
  transformedSquare,
  transformedI,
  transformedJ,
  presets,
  setTransformationType,
  setAngle,
  setScale,
  setShear,
  loadPreset,
} = useMatrixTransformations({ syncUrl: props.syncUrl })

// Determine which controls to show based on transformation type
const showAngleControl = computed(() => transformationType.value === 'rotation')
const showScaleControls = computed(() =>
  transformationType.value === 'scale' || transformationType.value === 'uniformScale'
)
const showShearControl = computed(() =>
  transformationType.value === 'shearX' || transformationType.value === 'shearY'
)

function handleTypeChange(type: TransformationType) {
  setTransformationType(type)
}

function handlePresetChange(presetId: string) {
  loadPreset(presetId)
}
</script>

<template>
  <div
    class="matrix-transformations space-y-4"
    data-testid="matrix-transformations"
  >
    <!-- Transformation Type Selector -->
    <TransformSelector
      :selected-type="transformationType"
      :presets="presets"
      @update:type="handleTypeChange"
      @select-preset="handlePresetChange"
    />

    <!-- Canvas and Controls Grid -->
    <div class="grid gap-4 lg:grid-cols-2">
      <!-- Visualization Canvas -->
      <TransformationCanvas
        :transformed-square="transformedSquare"
        :transformed-i="transformedI"
        :transformed-j="transformedJ"
        :determinant="currentDeterminant"
        :is-orthogonal="isCurrentOrthogonal"
      />

      <!-- Controls Panel (placeholder for 12C) -->
      <div class="space-y-4">
        <!-- Matrix Display placeholder -->
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-text-primary mb-2">Current Matrix</h4>
          <div class="font-mono text-sm">
            <div class="flex gap-4">
              <span>| {{ currentMatrix.a.toFixed(2) }}</span>
              <span>{{ currentMatrix.b.toFixed(2) }} |</span>
            </div>
            <div class="flex gap-4">
              <span>| {{ currentMatrix.c.toFixed(2) }}</span>
              <span>{{ currentMatrix.d.toFixed(2) }} |</span>
            </div>
          </div>
          <p class="text-sm text-text-muted mt-2">
            det = {{ currentDeterminant.toFixed(3) }}
            <span v-if="isCurrentOrthogonal" class="ml-2 text-primary">(orthogonal)</span>
          </p>
        </div>

        <!-- Parameter Controls (basic for now, expanded in 12C) -->
        <div
          v-if="showAngleControl"
          class="p-4 bg-surface-alt rounded-lg border border-border"
        >
          <label class="block text-sm font-medium text-text-primary mb-2">
            Rotation Angle: {{ angle }}°
          </label>
          <input
            type="range"
            :value="angle"
            min="-180"
            max="180"
            step="1"
            class="w-full"
            data-testid="angle-slider"
            @input="setAngle(Number(($event.target as HTMLInputElement).value))"
          >
        </div>

        <div
          v-if="showScaleControls"
          class="p-4 bg-surface-alt rounded-lg border border-border"
        >
          <label class="block text-sm font-medium text-text-primary mb-2">
            Scale X: {{ scaleX.toFixed(1) }}
          </label>
          <input
            type="range"
            :value="scaleX"
            min="0.1"
            max="3"
            step="0.1"
            class="w-full mb-4"
            data-testid="scale-x-slider"
            @input="setScale(Number(($event.target as HTMLInputElement).value), scaleY)"
          >

          <label
            v-if="transformationType === 'scale'"
            class="block text-sm font-medium text-text-primary mb-2"
          >
            Scale Y: {{ scaleY.toFixed(1) }}
          </label>
          <input
            v-if="transformationType === 'scale'"
            type="range"
            :value="scaleY"
            min="0.1"
            max="3"
            step="0.1"
            class="w-full"
            data-testid="scale-y-slider"
            @input="setScale(scaleX, Number(($event.target as HTMLInputElement).value))"
          >
        </div>

        <div
          v-if="showShearControl"
          class="p-4 bg-surface-alt rounded-lg border border-border"
        >
          <label class="block text-sm font-medium text-text-primary mb-2">
            Shear Factor: {{ shear.toFixed(2) }}
          </label>
          <input
            type="range"
            :value="shear"
            min="-2"
            max="2"
            step="0.1"
            class="w-full"
            data-testid="shear-slider"
            @input="setShear(Number(($event.target as HTMLInputElement).value))"
          >
        </div>
      </div>
    </div>
  </div>
</template>
```

### 5. `src/components/widgets/MatrixTransformations/TransformSelector.vue`

```vue
<script setup lang="ts">
import type { TransformationType, TransformationPreset } from '@/types'

interface Props {
  selectedType: TransformationType
  presets: TransformationPreset[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:type': [type: TransformationType]
  'select-preset': [presetId: string]
}>()

const transformationTypes: { type: TransformationType; label: string; icon: string }[] = [
  { type: 'identity', label: 'Identity', icon: 'fa-solid fa-equals' },
  { type: 'rotation', label: 'Rotate', icon: 'fa-solid fa-rotate' },
  { type: 'scale', label: 'Scale', icon: 'fa-solid fa-up-right-and-down-left-from-center' },
  { type: 'uniformScale', label: 'Uniform', icon: 'fa-solid fa-expand' },
  { type: 'shearX', label: 'Shear X', icon: 'fa-solid fa-arrows-left-right' },
  { type: 'shearY', label: 'Shear Y', icon: 'fa-solid fa-arrows-up-down' },
  { type: 'reflectX', label: 'Reflect X', icon: 'fa-solid fa-arrows-up-down' },
  { type: 'reflectY', label: 'Reflect Y', icon: 'fa-solid fa-arrows-left-right' },
]

function handleTypeClick(type: TransformationType) {
  emit('update:type', type)
}

function handlePresetChange(event: Event) {
  const select = event.target as HTMLSelectElement
  if (select.value) {
    emit('select-preset', select.value)
    select.value = ''  // Reset to allow re-selecting same preset
  }
}
</script>

<template>
  <div class="transform-selector space-y-3">
    <!-- Transformation Type Buttons -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="{ type, label, icon } in transformationTypes"
        :key="type"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          'flex items-center gap-2',
          selectedType === type
            ? 'bg-primary text-white'
            : 'bg-surface-alt text-text-secondary hover:bg-surface-alt/80 border border-border'
        ]"
        :data-testid="`transform-${type}`"
        @click="handleTypeClick(type)"
      >
        <i :class="icon" aria-hidden="true" />
        {{ label }}
      </button>
    </div>

    <!-- Preset Dropdown -->
    <div class="flex items-center gap-3">
      <label class="text-sm text-text-muted">Quick presets:</label>
      <select
        class="px-3 py-1.5 rounded-lg bg-surface-alt border border-border text-sm"
        data-testid="preset-select"
        @change="handlePresetChange"
      >
        <option value="">Select a preset...</option>
        <option
          v-for="preset in presets"
          :key="preset.id"
          :value="preset.id"
        >
          {{ preset.name }}
        </option>
      </select>
    </div>
  </div>
</template>
```

### 6. `src/components/widgets/MatrixTransformations/TransformationCanvas.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { Vector2D } from '@/types'

interface TransformedSquare {
  origin: Vector2D
  corner1: Vector2D  // (1,0) transformed
  corner2: Vector2D  // (1,1) transformed
  corner3: Vector2D  // (0,1) transformed
}

interface Props {
  transformedSquare: TransformedSquare
  transformedI: Vector2D
  transformedJ: Vector2D
  determinant: number
  isOrthogonal: boolean
}

const props = defineProps<Props>()

// Canvas dimensions and scaling
const viewBox = { minX: -3, minY: -3, width: 6, height: 6 }
const canvasSize = 320

// Scale factor: canvas pixels per unit
const scale = canvasSize / viewBox.width

// Convert math coordinates to SVG coordinates
// SVG y-axis is inverted (positive down), so we flip y
function toSvg(v: Vector2D): { x: number; y: number } {
  return {
    x: (v.x - viewBox.minX) * scale,
    y: (viewBox.height - (v.y - viewBox.minY)) * scale,  // Flip y
  }
}

// Grid lines
const gridLines = computed(() => {
  const lines: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = []

  for (let i = Math.ceil(viewBox.minX); i <= viewBox.minX + viewBox.width; i++) {
    const start = toSvg({ x: i, y: viewBox.minY })
    const end = toSvg({ x: i, y: viewBox.minY + viewBox.height })
    lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, major: i === 0 })
  }

  for (let i = Math.ceil(viewBox.minY); i <= viewBox.minY + viewBox.height; i++) {
    const start = toSvg({ x: viewBox.minX, y: i })
    const end = toSvg({ x: viewBox.minX + viewBox.width, y: i })
    lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, major: i === 0 })
  }

  return lines
})

// Original unit square path
const originalSquarePath = computed(() => {
  const o = toSvg({ x: 0, y: 0 })
  const c1 = toSvg({ x: 1, y: 0 })
  const c2 = toSvg({ x: 1, y: 1 })
  const c3 = toSvg({ x: 0, y: 1 })
  return `M ${o.x} ${o.y} L ${c1.x} ${c1.y} L ${c2.x} ${c2.y} L ${c3.x} ${c3.y} Z`
})

// Transformed square path
const transformedSquarePath = computed(() => {
  const o = toSvg(props.transformedSquare.origin)
  const c1 = toSvg(props.transformedSquare.corner1)
  const c2 = toSvg(props.transformedSquare.corner2)
  const c3 = toSvg(props.transformedSquare.corner3)
  return `M ${o.x} ${o.y} L ${c1.x} ${c1.y} L ${c2.x} ${c2.y} L ${c3.x} ${c3.y} Z`
})

// Basis vectors (original)
const basisIEnd = computed(() => toSvg({ x: 1, y: 0 }))
const basisJEnd = computed(() => toSvg({ x: 0, y: 1 }))

// Transformed basis vectors
const transformedIEnd = computed(() => toSvg(props.transformedI))
const transformedJEnd = computed(() => toSvg(props.transformedJ))

// Origin in SVG coordinates
const originSvg = computed(() => toSvg({ x: 0, y: 0 }))

// Area interpretation
const areaInterpretation = computed(() => {
  const det = props.determinant
  if (Math.abs(det) < 0.001) return 'collapsed (area = 0)'
  if (det < 0) return `flipped, area × ${Math.abs(det).toFixed(2)}`
  return `area × ${det.toFixed(2)}`
})
</script>

<template>
  <div class="transformation-canvas">
    <svg
      :width="canvasSize"
      :height="canvasSize"
      class="bg-surface-alt rounded-lg border border-border"
      data-testid="transformation-canvas"
    >
      <!-- Arrow marker definitions -->
      <defs>
        <marker
          id="arrow-i-original"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" opacity="0.5" />
        </marker>
        <marker
          id="arrow-j-original"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" opacity="0.5" />
        </marker>
        <marker
          id="arrow-i-transformed"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
        </marker>
        <marker
          id="arrow-j-transformed"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" />
        </marker>
      </defs>

      <!-- Grid lines -->
      <line
        v-for="(line, idx) in gridLines"
        :key="`grid-${idx}`"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        :stroke="line.major ? 'var(--color-text-muted)' : 'var(--color-border)'"
        :stroke-width="line.major ? 1.5 : 0.5"
        :opacity="line.major ? 0.6 : 0.3"
      />

      <!-- Original unit square (light outline) -->
      <path
        :d="originalSquarePath"
        fill="none"
        stroke="var(--color-primary)"
        stroke-width="1"
        stroke-dasharray="4 2"
        opacity="0.4"
        data-testid="original-square"
      />

      <!-- Transformed square (filled) -->
      <path
        :d="transformedSquarePath"
        fill="var(--color-primary)"
        fill-opacity="0.2"
        stroke="var(--color-primary)"
        stroke-width="2"
        data-testid="transformed-square"
      />

      <!-- Original basis vector î (light) -->
      <line
        :x1="originSvg.x"
        :y1="originSvg.y"
        :x2="basisIEnd.x"
        :y2="basisIEnd.y"
        stroke="#3b82f6"
        stroke-width="2"
        opacity="0.4"
        stroke-dasharray="4 2"
        marker-end="url(#arrow-i-original)"
      />

      <!-- Original basis vector ĵ (light) -->
      <line
        :x1="originSvg.x"
        :y1="originSvg.y"
        :x2="basisJEnd.x"
        :y2="basisJEnd.y"
        stroke="#f59e0b"
        stroke-width="2"
        opacity="0.4"
        stroke-dasharray="4 2"
        marker-end="url(#arrow-j-original)"
      />

      <!-- Transformed basis vector î -->
      <line
        :x1="originSvg.x"
        :y1="originSvg.y"
        :x2="transformedIEnd.x"
        :y2="transformedIEnd.y"
        stroke="#3b82f6"
        stroke-width="2.5"
        marker-end="url(#arrow-i-transformed)"
        data-testid="transformed-i"
      />

      <!-- Transformed basis vector ĵ -->
      <line
        :x1="originSvg.x"
        :y1="originSvg.y"
        :x2="transformedJEnd.x"
        :y2="transformedJEnd.y"
        stroke="#f59e0b"
        stroke-width="2.5"
        marker-end="url(#arrow-j-transformed)"
        data-testid="transformed-j"
      />

      <!-- Origin marker -->
      <circle
        :cx="originSvg.x"
        :cy="originSvg.y"
        r="4"
        fill="var(--color-text-primary)"
      />

      <!-- Vector labels -->
      <text
        :x="transformedIEnd.x + 8"
        :y="transformedIEnd.y"
        class="text-xs fill-blue-500 font-semibold"
      >
        î
      </text>
      <text
        :x="transformedJEnd.x"
        :y="transformedJEnd.y - 8"
        class="text-xs fill-amber-500 font-semibold"
      >
        ĵ
      </text>
    </svg>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 mt-3 text-sm text-text-muted">
      <div class="flex items-center gap-2">
        <span class="w-4 h-0.5 bg-blue-500 inline-block" />
        <span>î (1,0)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-4 h-0.5 bg-amber-500 inline-block" />
        <span>ĵ (0,1)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-text-secondary">{{ areaInterpretation }}</span>
      </div>
    </div>
  </div>
</template>
```

### 7. Update Widget Index Export

Update `src/components/widgets/index.ts` to include the new widget:

```typescript
// Add to existing exports
export { MatrixTransformations } from './MatrixTransformations'
```

---

## Success Criteria

- [ ] `useMatrixTransformations` composable created and functional
- [ ] `MatrixTransformations.vue` renders without errors
- [ ] `TransformSelector.vue` allows switching transformation types
- [ ] `TransformationCanvas.vue` shows unit square and basis vectors
- [ ] Transformation type changes update the visualization
- [ ] Basic sliders work for rotation, scale, and shear
- [ ] Matrix values display correctly
- [ ] Determinant displays correctly
- [ ] Widget exported from `src/components/widgets/index.ts`
- [ ] ESLint and TypeScript pass
- [ ] Build succeeds

---

## Commands to Run

```bash
# Start dev server to test visually
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build verification
npm run build
```

---

## Testing Notes

For now, visual testing in the browser is sufficient. E2E tests will be added in Increment 12E.

Navigate to a test page to see the widget in action (or temporarily add it to an existing page like `/linear-algebra/vectors`).
