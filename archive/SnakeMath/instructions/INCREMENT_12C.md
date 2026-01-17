# Increment 12C: Controls & Display Components

**Goal**: Create polished control components and matrix display panel with custom matrix input mode.

**Estimated Time**: 45 minutes

**Prerequisites**: Increment 12B complete (widget core functional)

---

## Files to Create

### 1. `src/components/widgets/MatrixTransformations/TransformControls.vue`

Parameter sliders with proper labels and value display:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { TransformationType } from '@/types'

interface Props {
  transformationType: TransformationType
  angle: number
  scaleX: number
  scaleY: number
  shear: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:angle': [value: number]
  'update:scaleX': [value: number]
  'update:scaleY': [value: number]
  'update:shear': [value: number]
}>()

const showAngleControl = computed(() => props.transformationType === 'rotation')
const showScaleControls = computed(() =>
  props.transformationType === 'scale' || props.transformationType === 'uniformScale'
)
const showShearControl = computed(() =>
  props.transformationType === 'shearX' || props.transformationType === 'shearY'
)
const isUniformScale = computed(() => props.transformationType === 'uniformScale')

function handleAngleChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:angle', value)
}

function handleScaleXChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:scaleX', value)
  // For uniform scale, also update Y
  if (isUniformScale.value) {
    emit('update:scaleY', value)
  }
}

function handleScaleYChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:scaleY', value)
}

function handleShearChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:shear', value)
}
</script>

<template>
  <div class="transform-controls space-y-4">
    <!-- Rotation Control -->
    <div
      v-if="showAngleControl"
      class="control-group"
    >
      <div class="flex justify-between items-center mb-2">
        <label class="text-sm font-medium text-text-primary">
          <i class="fa-solid fa-rotate mr-2 text-primary" aria-hidden="true" />
          Rotation Angle
        </label>
        <span class="text-sm font-mono text-text-secondary">{{ angle }}°</span>
      </div>
      <input
        type="range"
        :value="angle"
        min="-180"
        max="180"
        step="1"
        class="w-full accent-primary"
        data-testid="angle-slider"
        aria-label="Rotation angle in degrees"
        @input="handleAngleChange"
      >
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>-180°</span>
        <span>0°</span>
        <span>180°</span>
      </div>
    </div>

    <!-- Scale Controls -->
    <div
      v-if="showScaleControls"
      class="control-group"
    >
      <div class="flex justify-between items-center mb-2">
        <label class="text-sm font-medium text-text-primary">
          <i class="fa-solid fa-expand mr-2 text-primary" aria-hidden="true" />
          {{ isUniformScale ? 'Scale Factor' : 'Scale X' }}
        </label>
        <span class="text-sm font-mono text-text-secondary">{{ scaleX.toFixed(1) }}×</span>
      </div>
      <input
        type="range"
        :value="scaleX"
        min="0.1"
        max="3"
        step="0.1"
        class="w-full accent-primary"
        data-testid="scale-x-slider"
        :aria-label="isUniformScale ? 'Uniform scale factor' : 'Scale factor for X axis'"
        @input="handleScaleXChange"
      >
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>0.1×</span>
        <span>1×</span>
        <span>3×</span>
      </div>

      <!-- Separate Y scale for non-uniform -->
      <template v-if="!isUniformScale">
        <div class="flex justify-between items-center mb-2 mt-4">
          <label class="text-sm font-medium text-text-primary">
            Scale Y
          </label>
          <span class="text-sm font-mono text-text-secondary">{{ scaleY.toFixed(1) }}×</span>
        </div>
        <input
          type="range"
          :value="scaleY"
          min="0.1"
          max="3"
          step="0.1"
          class="w-full accent-primary"
          data-testid="scale-y-slider"
          aria-label="Scale factor for Y axis"
          @input="handleScaleYChange"
        >
        <div class="flex justify-between text-xs text-text-muted mt-1">
          <span>0.1×</span>
          <span>1×</span>
          <span>3×</span>
        </div>
      </template>
    </div>

    <!-- Shear Control -->
    <div
      v-if="showShearControl"
      class="control-group"
    >
      <div class="flex justify-between items-center mb-2">
        <label class="text-sm font-medium text-text-primary">
          <i class="fa-solid fa-italic mr-2 text-primary" aria-hidden="true" />
          Shear Factor
        </label>
        <span class="text-sm font-mono text-text-secondary">{{ shear.toFixed(2) }}</span>
      </div>
      <input
        type="range"
        :value="shear"
        min="-2"
        max="2"
        step="0.1"
        class="w-full accent-primary"
        data-testid="shear-slider"
        aria-label="Shear factor"
        @input="handleShearChange"
      >
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>-2</span>
        <span>0</span>
        <span>2</span>
      </div>
    </div>

    <!-- No controls message for fixed transformations -->
    <div
      v-if="!showAngleControl && !showScaleControls && !showShearControl"
      class="text-sm text-text-muted italic p-4 bg-surface-alt rounded-lg border border-border"
    >
      <i class="fa-solid fa-info-circle mr-2" aria-hidden="true" />
      This transformation has no adjustable parameters.
    </div>
  </div>
</template>

<style scoped>
input[type="range"] {
  @apply h-2 rounded-lg appearance-none cursor-pointer bg-border;
}
</style>
```

### 2. `src/components/widgets/MatrixTransformations/MatrixDisplay.vue`

Display the matrix with optional custom input mode:

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Matrix2x2 } from '@/types'
import { isValidMatrix } from '@/utils/math/matrix'

interface Props {
  matrix: Matrix2x2
  allowCustom?: boolean
  isCustomMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowCustom: false,
  isCustomMode: false,
})

const emit = defineEmits<{
  'update:matrix': [matrix: Matrix2x2]
  'toggle-custom': []
}>()

// Local editing state
const editMode = ref(false)
const editA = ref('')
const editB = ref('')
const editC = ref('')
const editD = ref('')

// Initialize edit values when entering edit mode
watch(() => editMode.value, (isEditing) => {
  if (isEditing) {
    editA.value = props.matrix.a.toString()
    editB.value = props.matrix.b.toString()
    editC.value = props.matrix.c.toString()
    editD.value = props.matrix.d.toString()
  }
})

const parseError = computed(() => {
  if (!editMode.value) return null

  const a = parseFloat(editA.value)
  const b = parseFloat(editB.value)
  const c = parseFloat(editC.value)
  const d = parseFloat(editD.value)

  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
    return 'All values must be valid numbers'
  }

  return null
})

function formatValue(val: number): string {
  // Show cleaner numbers for common values
  if (Math.abs(val) < 0.0001) return '0'
  if (Math.abs(val - 1) < 0.0001) return '1'
  if (Math.abs(val + 1) < 0.0001) return '-1'
  if (Math.abs(val - 0.5) < 0.0001) return '0.5'
  if (Math.abs(val + 0.5) < 0.0001) return '-0.5'

  // Handle √2/2 ≈ 0.707
  if (Math.abs(Math.abs(val) - 0.7071) < 0.001) {
    return val > 0 ? '√2/2' : '-√2/2'
  }

  return val.toFixed(3).replace(/\.?0+$/, '')
}

function startEdit() {
  if (props.allowCustom) {
    editMode.value = true
  }
}

function cancelEdit() {
  editMode.value = false
}

function applyEdit() {
  if (parseError.value) return

  const newMatrix: Matrix2x2 = {
    a: parseFloat(editA.value),
    b: parseFloat(editB.value),
    c: parseFloat(editC.value),
    d: parseFloat(editD.value),
  }

  if (isValidMatrix(newMatrix)) {
    emit('update:matrix', newMatrix)
    emit('toggle-custom')
    editMode.value = false
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    applyEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <div class="matrix-display">
    <div class="flex justify-between items-center mb-3">
      <h4 class="font-semibold text-text-primary">
        <i class="fa-solid fa-table-cells mr-2 text-primary" aria-hidden="true" />
        Transformation Matrix
      </h4>
      <button
        v-if="allowCustom && !editMode"
        class="text-xs text-primary hover:text-primary/80 transition-colors"
        data-testid="edit-matrix-btn"
        @click="startEdit"
      >
        <i class="fa-solid fa-pen mr-1" aria-hidden="true" />
        Edit
      </button>
    </div>

    <!-- Read-only display -->
    <div
      v-if="!editMode"
      class="matrix-bracket"
      data-testid="matrix-display"
    >
      <div class="matrix-content">
        <div class="matrix-row">
          <span class="matrix-cell">{{ formatValue(matrix.a) }}</span>
          <span class="matrix-cell">{{ formatValue(matrix.b) }}</span>
        </div>
        <div class="matrix-row">
          <span class="matrix-cell">{{ formatValue(matrix.c) }}</span>
          <span class="matrix-cell">{{ formatValue(matrix.d) }}</span>
        </div>
      </div>
    </div>

    <!-- Edit mode -->
    <div
      v-else
      class="space-y-2"
    >
      <div class="matrix-bracket editing">
        <div class="matrix-content">
          <div class="matrix-row">
            <input
              v-model="editA"
              type="text"
              class="matrix-input"
              data-testid="matrix-a-input"
              placeholder="a"
              @keydown="handleKeydown"
            >
            <input
              v-model="editB"
              type="text"
              class="matrix-input"
              data-testid="matrix-b-input"
              placeholder="b"
              @keydown="handleKeydown"
            >
          </div>
          <div class="matrix-row">
            <input
              v-model="editC"
              type="text"
              class="matrix-input"
              data-testid="matrix-c-input"
              placeholder="c"
              @keydown="handleKeydown"
            >
            <input
              v-model="editD"
              type="text"
              class="matrix-input"
              data-testid="matrix-d-input"
              placeholder="d"
              @keydown="handleKeydown"
            >
          </div>
        </div>
      </div>

      <p
        v-if="parseError"
        class="text-xs text-red-500"
      >
        {{ parseError }}
      </p>

      <div class="flex gap-2">
        <button
          class="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          :disabled="!!parseError"
          data-testid="apply-matrix-btn"
          @click="applyEdit"
        >
          Apply
        </button>
        <button
          class="px-3 py-1 text-sm bg-surface-alt border border-border rounded hover:bg-surface-alt/80 transition-colors"
          data-testid="cancel-matrix-btn"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Custom mode indicator -->
    <p
      v-if="isCustomMode && !editMode"
      class="text-xs text-amber-500 mt-2"
    >
      <i class="fa-solid fa-pen-fancy mr-1" aria-hidden="true" />
      Custom matrix
    </p>
  </div>
</template>

<style scoped>
.matrix-bracket {
  @apply relative inline-block font-mono text-lg p-4;
  @apply bg-surface-alt rounded-lg border border-border;
}

.matrix-bracket::before,
.matrix-bracket::after {
  content: '';
  @apply absolute top-2 bottom-2 w-2;
  @apply border-2 border-text-secondary;
}

.matrix-bracket::before {
  @apply left-1;
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.matrix-bracket::after {
  @apply right-1;
  border-left: none;
  border-radius: 0 4px 4px 0;
}

.matrix-content {
  @apply px-4;
}

.matrix-row {
  @apply flex gap-6 justify-center;
}

.matrix-cell {
  @apply w-16 text-center text-text-primary;
}

.matrix-input {
  @apply w-16 text-center px-2 py-1;
  @apply bg-surface border border-border rounded;
  @apply text-text-primary;
  @apply focus:outline-none focus:ring-2 focus:ring-primary;
}

.editing .matrix-content {
  @apply px-2;
}
</style>
```

### 3. `src/components/widgets/MatrixTransformations/TransformInfo.vue`

Display transformation properties and insights:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { TransformationType } from '@/types'

interface Props {
  transformationType: TransformationType
  determinant: number
  isOrthogonal: boolean
}

const props = defineProps<Props>()

// Determinant interpretation
const determinantInterpretation = computed(() => {
  const det = props.determinant

  if (Math.abs(det) < 0.001) {
    return {
      text: 'Collapsed to a line/point',
      class: 'text-red-500',
      icon: 'fa-solid fa-compress',
    }
  }

  if (det < 0) {
    return {
      text: `Area × ${Math.abs(det).toFixed(2)}, orientation flipped`,
      class: 'text-amber-500',
      icon: 'fa-solid fa-arrows-rotate',
    }
  }

  if (Math.abs(det - 1) < 0.001) {
    return {
      text: 'Area preserved (det = 1)',
      class: 'text-green-500',
      icon: 'fa-solid fa-check-circle',
    }
  }

  return {
    text: `Area × ${det.toFixed(2)}`,
    class: 'text-text-secondary',
    icon: 'fa-solid fa-expand',
  }
})

// Transformation type description
const typeDescription = computed(() => {
  switch (props.transformationType) {
    case 'identity':
      return 'No change to vectors'
    case 'rotation':
      return 'Rotates vectors around the origin'
    case 'scale':
      return 'Stretches or compresses along axes'
    case 'uniformScale':
      return 'Scales uniformly in all directions'
    case 'shearX':
      return 'Slants horizontally (x shifts based on y)'
    case 'shearY':
      return 'Slants vertically (y shifts based on x)'
    case 'reflectX':
      return 'Flips across the x-axis'
    case 'reflectY':
      return 'Flips across the y-axis'
    case 'reflectOrigin':
      return 'Reflects through the origin (180° rotation)'
    case 'custom':
      return 'User-defined transformation matrix'
    default:
      return ''
  }
})

// Properties badges
const propertyBadges = computed(() => {
  const badges: { label: string; class: string; icon: string }[] = []

  if (props.isOrthogonal) {
    badges.push({
      label: 'Orthogonal',
      class: 'bg-blue-500/20 text-blue-500',
      icon: 'fa-solid fa-ruler-combined',
    })
  }

  if (Math.abs(props.determinant - 1) < 0.001) {
    badges.push({
      label: 'Area Preserving',
      class: 'bg-green-500/20 text-green-500',
      icon: 'fa-solid fa-square',
    })
  }

  if (props.determinant < 0) {
    badges.push({
      label: 'Orientation Reversing',
      class: 'bg-amber-500/20 text-amber-500',
      icon: 'fa-solid fa-shuffle',
    })
  }

  if (Math.abs(props.determinant) < 0.001) {
    badges.push({
      label: 'Singular',
      class: 'bg-red-500/20 text-red-500',
      icon: 'fa-solid fa-exclamation-triangle',
    })
  }

  return badges
})
</script>

<template>
  <div class="transform-info space-y-4">
    <!-- Transformation Type -->
    <div>
      <h4 class="text-sm font-medium text-text-muted mb-1">Transformation</h4>
      <p class="text-text-primary">{{ typeDescription }}</p>
    </div>

    <!-- Determinant -->
    <div>
      <h4 class="text-sm font-medium text-text-muted mb-1">Determinant</h4>
      <div class="flex items-center gap-2">
        <span class="font-mono text-lg">{{ determinant.toFixed(3) }}</span>
        <span :class="determinantInterpretation.class" class="text-sm flex items-center gap-1">
          <i :class="determinantInterpretation.icon" aria-hidden="true" />
          {{ determinantInterpretation.text }}
        </span>
      </div>
    </div>

    <!-- Property Badges -->
    <div v-if="propertyBadges.length > 0">
      <h4 class="text-sm font-medium text-text-muted mb-2">Properties</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="badge in propertyBadges"
          :key="badge.label"
          :class="badge.class"
          class="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
          :data-testid="`badge-${badge.label.toLowerCase().replace(' ', '-')}`"
        >
          <i :class="badge.icon" aria-hidden="true" />
          {{ badge.label }}
        </span>
      </div>
    </div>

    <!-- Educational note -->
    <div class="p-3 bg-primary/10 border border-primary/30 rounded-lg">
      <p class="text-sm text-text-secondary">
        <i class="fa-solid fa-lightbulb text-primary mr-2" aria-hidden="true" />
        <span v-if="isOrthogonal">
          Orthogonal matrices preserve lengths and angles — they only rotate and/or reflect.
        </span>
        <span v-else-if="Math.abs(determinant) < 0.001">
          A determinant of zero means the transformation "squishes" space into a lower dimension.
        </span>
        <span v-else-if="determinant < 0">
          Negative determinant means the transformation includes a reflection (flips orientation).
        </span>
        <span v-else>
          The determinant tells you how much the area of shapes changes under this transformation.
        </span>
      </p>
    </div>
  </div>
</template>
```

### 4. Update `MatrixTransformations.vue`

Replace the placeholder controls with the new components:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { TransformationType, Matrix2x2 } from '@/types'
import { useMatrixTransformations } from '@/composables/useMatrixTransformations'
import TransformSelector from './TransformSelector.vue'
import TransformationCanvas from './TransformationCanvas.vue'
import TransformControls from './TransformControls.vue'
import MatrixDisplay from './MatrixDisplay.vue'
import TransformInfo from './TransformInfo.vue'

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
  customMatrix,
  currentMatrix,
  currentDeterminant,
  isCurrentOrthogonal,
  transformedSquare,
  transformedI,
  transformedJ,
  presets,
  setTransformationType,
  setAngle,
  setScale,
  setShear,
  setCustomMatrix,
  loadPreset,
} = useMatrixTransformations({ syncUrl: props.syncUrl })

const isCustomMode = computed(() => transformationType.value === 'custom')

function handleTypeChange(type: TransformationType) {
  setTransformationType(type)
}

function handlePresetChange(presetId: string) {
  loadPreset(presetId)
}

function handleAngleUpdate(value: number) {
  setAngle(value)
}

function handleScaleXUpdate(value: number) {
  setScale(value, scaleY.value)
}

function handleScaleYUpdate(value: number) {
  setScale(scaleX.value, value)
}

function handleShearUpdate(value: number) {
  setShear(value)
}

function handleMatrixUpdate(matrix: Matrix2x2) {
  setCustomMatrix(matrix)
}

function handleToggleCustom() {
  if (transformationType.value !== 'custom') {
    setTransformationType('custom')
  }
}
</script>

<template>
  <div
    class="matrix-transformations space-y-6"
    data-testid="matrix-transformations"
  >
    <!-- Transformation Type Selector -->
    <TransformSelector
      :selected-type="transformationType"
      :presets="presets"
      @update:type="handleTypeChange"
      @select-preset="handlePresetChange"
    />

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left: Canvas -->
      <div>
        <TransformationCanvas
          :transformed-square="transformedSquare"
          :transformed-i="transformedI"
          :transformed-j="transformedJ"
          :determinant="currentDeterminant"
          :is-orthogonal="isCurrentOrthogonal"
        />
      </div>

      <!-- Right: Controls & Info -->
      <div class="space-y-6">
        <!-- Matrix Display -->
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <MatrixDisplay
            :matrix="currentMatrix"
            :allow-custom="true"
            :is-custom-mode="isCustomMode"
            @update:matrix="handleMatrixUpdate"
            @toggle-custom="handleToggleCustom"
          />
        </div>

        <!-- Parameter Controls -->
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-text-primary mb-4">
            <i class="fa-solid fa-sliders mr-2 text-primary" aria-hidden="true" />
            Parameters
          </h4>
          <TransformControls
            :transformation-type="transformationType"
            :angle="angle"
            :scale-x="scaleX"
            :scale-y="scaleY"
            :shear="shear"
            @update:angle="handleAngleUpdate"
            @update:scale-x="handleScaleXUpdate"
            @update:scale-y="handleScaleYUpdate"
            @update:shear="handleShearUpdate"
          />
        </div>

        <!-- Transform Info -->
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-text-primary mb-4">
            <i class="fa-solid fa-info-circle mr-2 text-primary" aria-hidden="true" />
            Analysis
          </h4>
          <TransformInfo
            :transformation-type="transformationType"
            :determinant="currentDeterminant"
            :is-orthogonal="isCurrentOrthogonal"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## Success Criteria

- [ ] `TransformControls.vue` shows appropriate sliders for each transformation type
- [ ] Sliders update transformation parameters in real-time
- [ ] `MatrixDisplay.vue` shows formatted matrix values
- [ ] Custom matrix input mode works (edit → apply → shows custom transformation)
- [ ] `TransformInfo.vue` displays determinant with interpretation
- [ ] Property badges show correctly (Orthogonal, Area Preserving, etc.)
- [ ] Educational notes update based on transformation properties
- [ ] All components integrate smoothly in `MatrixTransformations.vue`
- [ ] ESLint and TypeScript pass
- [ ] Build succeeds

---

## Visual Testing Checklist

1. Select Rotation → angle slider appears
2. Drag angle slider → matrix and canvas update smoothly
3. Select Scale → both X and Y sliders appear
4. Select Uniform Scale → only one slider appears
5. Select Shear X → shear slider appears
6. Select Identity → "no parameters" message appears
7. Select Reflect X → negative determinant badge appears
8. Click "Edit" on matrix → input fields appear
9. Enter custom values → "Apply" enables when valid
10. Apply custom matrix → canvas shows custom transformation

---

## Commands to Run

```bash
# Start dev server for visual testing
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```
