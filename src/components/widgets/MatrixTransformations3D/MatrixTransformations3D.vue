<script setup lang="ts">
import type { Rotation3DType } from '@/types/math'
import { useMatrixTransformations3D } from '@/composables/useMatrixTransformations3D'
import Transform3DSelector from './Transform3DSelector.vue'
import UnitCubeCanvas3D from './UnitCubeCanvas3D.vue'
import Transform3DControls from './Transform3DControls.vue'
import Matrix3DDisplay from './Matrix3DDisplay.vue'
import Transform3DInfo from './Transform3DInfo.vue'

interface Props {
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: false,
})

const {
  transformationType,
  angleX,
  angleY,
  angleZ,
  scaleFactor,
  currentMatrix,
  currentDeterminant,
  isCurrentOrthogonal,
  isCurrentRotation,
  preservesOrientation,
  transformedI,
  transformedJ,
  transformedK,
  transformedCube,
  presets,
  setTransformationType,
  setAngleX,
  setAngleY,
  setAngleZ,
  setScale,
  loadPreset,
} = useMatrixTransformations3D({ syncUrl: props.syncUrl })

function handleTypeChange(type: Rotation3DType) {
  setTransformationType(type)
}

function handlePresetChange(presetId: string) {
  loadPreset(presetId)
}

function handleAngleXUpdate(value: number) {
  setAngleX(value)
}

function handleAngleYUpdate(value: number) {
  setAngleY(value)
}

function handleAngleZUpdate(value: number) {
  setAngleZ(value)
}

function handleScaleUpdate(value: number) {
  setScale(value)
}
</script>

<template>
  <div class="matrix-transformations-3d space-y-6" data-testid="matrix-transformations-3d">
    <!-- Transformation Type Selector -->
    <Transform3DSelector
      :selected-type="transformationType"
      :presets="presets"
      @update:type="handleTypeChange"
      @select-preset="handlePresetChange"
    />

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left: 3D Canvas -->
      <div class="card p-4">
        <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          3D Visualization
        </h3>
        <div class="flex justify-center">
          <UnitCubeCanvas3D
            :transformed-cube="transformedCube"
            :transformed-i="transformedI"
            :transformed-j="transformedJ"
            :transformed-k="transformedK"
            :show-original="true"
          />
        </div>
        <p class="mt-2 text-xs text-text-muted text-center">
          Unit cube transformation &bull;
          <span class="text-red-500">X</span> /
          <span class="text-green-500">Y</span> /
          <span class="text-blue-500">Z</span>
        </p>
      </div>

      <!-- Right: Controls & Info -->
      <div class="space-y-6">
        <!-- Matrix Display -->
        <div class="card p-4">
          <Matrix3DDisplay :matrix="currentMatrix" />
        </div>

        <!-- Parameter Controls -->
        <div class="card p-4">
          <h4 class="font-semibold text-text-primary mb-4">
            <i class="fa-solid fa-sliders mr-2 text-primary" aria-hidden="true" />
            Parameters
          </h4>
          <Transform3DControls
            :transformation-type="transformationType"
            :angle-x="angleX"
            :angle-y="angleY"
            :angle-z="angleZ"
            :scale-factor="scaleFactor"
            @update:angle-x="handleAngleXUpdate"
            @update:angle-y="handleAngleYUpdate"
            @update:angle-z="handleAngleZUpdate"
            @update:scale="handleScaleUpdate"
          />
        </div>

        <!-- Transform Info -->
        <div class="card p-4">
          <h4 class="font-semibold text-text-primary mb-4">
            <i class="fa-solid fa-info-circle mr-2 text-primary" aria-hidden="true" />
            Analysis
          </h4>
          <Transform3DInfo
            :transformation-type="transformationType"
            :determinant="currentDeterminant"
            :is-orthogonal="isCurrentOrthogonal"
            :is-rotation="isCurrentRotation"
            :preserves-orientation="preservesOrientation"
          />
        </div>
      </div>
    </div>

    <!-- Share hint -->
    <p v-if="syncUrl" class="text-xs text-text-muted text-center">
      Share this URL to show these settings to others
    </p>
  </div>
</template>

<style scoped>
.card {
  @apply bg-surface border border-border rounded-lg;
}
</style>
