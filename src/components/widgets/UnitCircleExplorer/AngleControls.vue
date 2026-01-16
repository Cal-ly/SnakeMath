<script setup lang="ts">
import type { AngleUnit } from '@/utils/math/trigonometry'

interface Props {
  angle: number
  unit: AngleUnit
  radianSymbolic: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:angle': [value: number]
  'update:unit': [value: AngleUnit]
}>()

function handleSliderInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value)) {
    emit('update:angle', value)
  }
}

function handleNumberInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value) && value >= 0 && value < 360) {
    emit('update:angle', value)
  }
}
</script>

<template>
  <div class="angle-controls space-y-3">
    <!-- Angle Slider -->
    <div class="flex items-center gap-4">
      <label for="angle-slider" class="text-sm font-medium text-text-secondary w-16"> Angle: </label>
      <input
        id="angle-slider"
        type="range"
        min="0"
        max="359"
        step="1"
        :value="angle"
        data-testid="angle-slider"
        class="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
        @input="handleSliderInput"
      />
      <span class="text-sm font-mono text-text-primary w-16 text-right">
        {{ angle }}°
      </span>
    </div>

    <!-- Direct Input and Unit Toggle -->
    <div class="flex items-center gap-4">
      <label for="angle-input" class="text-sm font-medium text-text-secondary w-16"> Input: </label>
      <div class="flex items-center gap-2">
        <input
          id="angle-input"
          type="number"
          min="0"
          max="359"
          step="1"
          :value="angle"
          data-testid="angle-input"
          class="w-20 px-2 py-1 text-sm font-mono bg-surface border border-border rounded text-center focus:outline-none focus:ring-2 focus:ring-primary"
          @change="handleNumberInput"
        />
        <span class="text-sm text-text-muted">°</span>
      </div>

      <div class="flex-1" />

      <!-- Degrees/Radians Toggle -->
      <div class="flex items-center gap-2 text-sm">
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="unit"
            value="degrees"
            :checked="unit === 'degrees'"
            data-testid="unit-toggle-degrees"
            class="accent-primary"
            @change="emit('update:unit', 'degrees')"
          />
          <span :class="unit === 'degrees' ? 'text-text-primary' : 'text-text-muted'">Degrees</span>
        </label>
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="unit"
            value="radians"
            :checked="unit === 'radians'"
            data-testid="unit-toggle-radians"
            class="accent-primary"
            @change="emit('update:unit', 'radians')"
          />
          <span :class="unit === 'radians' ? 'text-text-primary' : 'text-text-muted'">Radians</span>
        </label>
      </div>
    </div>

    <!-- Radian display (when in radians mode) -->
    <div v-if="unit === 'radians'" class="text-sm text-text-muted pl-20">
      θ = {{ radianSymbolic }}
    </div>
  </div>
</template>
