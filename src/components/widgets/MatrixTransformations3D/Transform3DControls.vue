<script setup lang="ts">
import { computed } from 'vue'
import type { Rotation3DType } from '@/types/math'

interface Props {
  transformationType: Rotation3DType
  angleX: number
  angleY: number
  angleZ: number
  scaleFactor: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:angleX': [value: number]
  'update:angleY': [value: number]
  'update:angleZ': [value: number]
  'update:scale': [value: number]
}>()

const showAngleX = computed(() =>
  ['rotationX', 'combined'].includes(props.transformationType)
)
const showAngleY = computed(() =>
  ['rotationY', 'combined'].includes(props.transformationType)
)
const showAngleZ = computed(() =>
  ['rotationZ', 'combined'].includes(props.transformationType)
)
const showScale = computed(() => props.transformationType === 'scale')
const hasNoControls = computed(() =>
  !showAngleX.value && !showAngleY.value && !showAngleZ.value && !showScale.value
)

function handleAngleXChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:angleX', value)
}

function handleAngleYChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:angleY', value)
}

function handleAngleZChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:angleZ', value)
}

function handleScaleChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:scale', value)
}
</script>

<template>
  <div class="transform-3d-controls space-y-4">
    <!-- Rotation X Control -->
    <div v-if="showAngleX" class="control-group">
      <div class="flex justify-between items-center mb-2">
        <label for="angle-x-slider" class="text-sm font-medium text-text-primary">
          <span class="mr-2 text-red-500" aria-hidden="true">X</span>
          Pitch (Rotation X)
        </label>
        <span class="text-sm font-mono text-text-secondary">{{ angleX }}&deg;</span>
      </div>
      <input
        id="angle-x-slider"
        type="range"
        :value="angleX"
        min="-180"
        max="180"
        step="5"
        class="w-full accent-red-500"
        data-testid="angle-x-slider"
        aria-label="Rotation angle around X-axis in degrees"
        @input="handleAngleXChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>-180&deg;</span>
        <span>0&deg;</span>
        <span>180&deg;</span>
      </div>
    </div>

    <!-- Rotation Y Control -->
    <div v-if="showAngleY" class="control-group">
      <div class="flex justify-between items-center mb-2">
        <label for="angle-y-slider" class="text-sm font-medium text-text-primary">
          <span class="mr-2 text-green-500" aria-hidden="true">Y</span>
          Yaw (Rotation Y)
        </label>
        <span class="text-sm font-mono text-text-secondary">{{ angleY }}&deg;</span>
      </div>
      <input
        id="angle-y-slider"
        type="range"
        :value="angleY"
        min="-180"
        max="180"
        step="5"
        class="w-full accent-green-500"
        data-testid="angle-y-slider"
        aria-label="Rotation angle around Y-axis in degrees"
        @input="handleAngleYChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>-180&deg;</span>
        <span>0&deg;</span>
        <span>180&deg;</span>
      </div>
    </div>

    <!-- Rotation Z Control -->
    <div v-if="showAngleZ" class="control-group">
      <div class="flex justify-between items-center mb-2">
        <label for="angle-z-slider" class="text-sm font-medium text-text-primary">
          <span class="mr-2 text-blue-500" aria-hidden="true">Z</span>
          Roll (Rotation Z)
        </label>
        <span class="text-sm font-mono text-text-secondary">{{ angleZ }}&deg;</span>
      </div>
      <input
        id="angle-z-slider"
        type="range"
        :value="angleZ"
        min="-180"
        max="180"
        step="5"
        class="w-full accent-blue-500"
        data-testid="angle-z-slider"
        aria-label="Rotation angle around Z-axis in degrees"
        @input="handleAngleZChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>-180&deg;</span>
        <span>0&deg;</span>
        <span>180&deg;</span>
      </div>
    </div>

    <!-- Scale Control -->
    <div v-if="showScale" class="control-group">
      <div class="flex justify-between items-center mb-2">
        <label for="scale-3d-slider" class="text-sm font-medium text-text-primary">
          <span class="mr-2 text-primary" aria-hidden="true">S</span>
          Scale Factor
        </label>
        <span class="text-sm font-mono text-text-secondary">{{ scaleFactor.toFixed(1) }}&times;</span>
      </div>
      <input
        id="scale-3d-slider"
        type="range"
        :value="scaleFactor"
        min="0.1"
        max="3"
        step="0.1"
        class="w-full accent-primary"
        data-testid="scale-slider"
        aria-label="Uniform scale factor"
        @input="handleScaleChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>0.1&times;</span>
        <span>1&times;</span>
        <span>3&times;</span>
      </div>
    </div>

    <!-- No controls message -->
    <div
      v-if="hasNoControls"
      class="text-sm text-text-muted italic p-4 bg-surface rounded-lg border border-border"
    >
      <i class="fa-solid fa-info-circle mr-2" aria-hidden="true" />
      This transformation has no adjustable parameters.
    </div>
  </div>
</template>

<style scoped>
input[type='range'] {
  @apply h-2 rounded-lg appearance-none cursor-pointer bg-border;
}
</style>
