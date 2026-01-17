<script setup lang="ts">
import { computed } from 'vue'
import type { TransformationType, Matrix2x2 } from '@/types/math'
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
  <div class="matrix-transformations space-y-6" data-testid="matrix-transformations">
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
            <span class="mr-2 text-primary" aria-hidden="true">☰</span>
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
            <span class="mr-2 text-primary" aria-hidden="true">ⓘ</span>
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
