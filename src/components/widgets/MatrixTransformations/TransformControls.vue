<script setup lang="ts">
import { computed } from 'vue'
import type { TransformationType } from '@/types/math'

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
const showScaleControls = computed(
  () => props.transformationType === 'scale' || props.transformationType === 'uniformScale'
)
const showShearControl = computed(
  () => props.transformationType === 'shearX' || props.transformationType === 'shearY'
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
    <div v-if="showAngleControl" class="control-group">
      <div class="flex justify-between items-center mb-2">
        <label for="angle-slider-ctrl" class="text-sm font-medium text-text-primary">
          <span class="mr-2 text-primary" aria-hidden="true">↻</span>
          Rotation Angle
        </label>
        <span class="text-sm font-mono text-text-secondary">{{ angle }}°</span>
      </div>
      <input
        id="angle-slider-ctrl"
        type="range"
        :value="angle"
        min="-180"
        max="180"
        step="1"
        class="w-full accent-primary"
        data-testid="angle-slider"
        aria-label="Rotation angle in degrees"
        @input="handleAngleChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>-180°</span>
        <span>0°</span>
        <span>180°</span>
      </div>
    </div>

    <!-- Scale Controls -->
    <div v-if="showScaleControls" class="control-group">
      <div class="flex justify-between items-center mb-2">
        <label for="scale-x-slider-ctrl" class="text-sm font-medium text-text-primary">
          <span class="mr-2 text-primary" aria-hidden="true">⊕</span>
          {{ isUniformScale ? 'Scale Factor' : 'Scale X' }}
        </label>
        <span class="text-sm font-mono text-text-secondary">{{ scaleX.toFixed(1) }}×</span>
      </div>
      <input
        id="scale-x-slider-ctrl"
        type="range"
        :value="scaleX"
        min="0.1"
        max="3"
        step="0.1"
        class="w-full accent-primary"
        data-testid="scale-x-slider"
        :aria-label="isUniformScale ? 'Uniform scale factor' : 'Scale factor for X axis'"
        @input="handleScaleXChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>0.1×</span>
        <span>1×</span>
        <span>3×</span>
      </div>

      <!-- Separate Y scale for non-uniform -->
      <template v-if="!isUniformScale">
        <div class="flex justify-between items-center mb-2 mt-4">
          <label for="scale-y-slider-ctrl" class="text-sm font-medium text-text-primary">
            Scale Y
          </label>
          <span class="text-sm font-mono text-text-secondary">{{ scaleY.toFixed(1) }}×</span>
        </div>
        <input
          id="scale-y-slider-ctrl"
          type="range"
          :value="scaleY"
          min="0.1"
          max="3"
          step="0.1"
          class="w-full accent-primary"
          data-testid="scale-y-slider"
          aria-label="Scale factor for Y axis"
          @input="handleScaleYChange"
        />
        <div class="flex justify-between text-xs text-text-muted mt-1">
          <span>0.1×</span>
          <span>1×</span>
          <span>3×</span>
        </div>
      </template>
    </div>

    <!-- Shear Control -->
    <div v-if="showShearControl" class="control-group">
      <div class="flex justify-between items-center mb-2">
        <label for="shear-slider-ctrl" class="text-sm font-medium text-text-primary">
          <span class="mr-2 text-primary" aria-hidden="true">⫽</span>
          Shear Factor
        </label>
        <span class="text-sm font-mono text-text-secondary">{{ shear.toFixed(2) }}</span>
      </div>
      <input
        id="shear-slider-ctrl"
        type="range"
        :value="shear"
        min="-2"
        max="2"
        step="0.1"
        class="w-full accent-primary"
        data-testid="shear-slider"
        aria-label="Shear factor"
        @input="handleShearChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-1">
        <span>-2</span>
        <span>0</span>
        <span>2</span>
      </div>
    </div>

    <!-- No controls message for fixed transformations -->
    <div
      v-if="!showAngleControl && !showScaleControls && !showShearControl"
      class="text-sm text-text-muted italic p-4 bg-surface rounded-lg border border-border"
    >
      <span class="mr-2" aria-hidden="true">ℹ</span>
      This transformation has no adjustable parameters.
    </div>
  </div>
</template>

<style scoped>
input[type='range'] {
  @apply h-2 rounded-lg appearance-none cursor-pointer bg-border;
}
</style>
