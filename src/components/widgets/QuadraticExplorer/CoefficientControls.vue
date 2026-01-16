<script setup lang="ts">
interface Props {
  a: number
  b: number
  c: number
}

defineProps<Props>()

const emit = defineEmits<{
  'update:a': [value: number]
  'update:b': [value: number]
  'update:c': [value: number]
}>()

// Slider configurations
const sliderConfigs = {
  a: { min: -3, max: 3, step: 0.1, label: 'a (x² coefficient)' },
  b: { min: -10, max: 10, step: 0.5, label: 'b (x coefficient)' },
  c: { min: -10, max: 10, step: 0.5, label: 'c (constant)' },
}

function handleAChange(event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value)
  emit('update:a', value)
}

function handleBChange(event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value)
  emit('update:b', value)
}

function handleCChange(event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value)
  emit('update:c', value)
}
</script>

<template>
  <div class="coefficient-controls space-y-4">
    <!-- Coefficient a -->
    <div class="slider-group">
      <div class="flex justify-between items-center mb-1">
        <label for="coefficient-a" class="text-sm font-medium text-text-primary">
          {{ sliderConfigs.a.label }}
        </label>
        <span class="text-sm font-mono text-primary">{{ a.toFixed(1) }}</span>
      </div>
      <input
        id="coefficient-a"
        type="range"
        :min="sliderConfigs.a.min"
        :max="sliderConfigs.a.max"
        :step="sliderConfigs.a.step"
        :value="a"
        class="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        data-testid="coefficient-a-slider"
        :aria-valuemin="sliderConfigs.a.min"
        :aria-valuemax="sliderConfigs.a.max"
        :aria-valuenow="a"
        @input="handleAChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-0.5">
        <span>{{ sliderConfigs.a.min }}</span>
        <span>{{ sliderConfigs.a.max }}</span>
      </div>
    </div>

    <!-- Coefficient b -->
    <div class="slider-group">
      <div class="flex justify-between items-center mb-1">
        <label for="coefficient-b" class="text-sm font-medium text-text-primary">
          {{ sliderConfigs.b.label }}
        </label>
        <span class="text-sm font-mono text-primary">{{ b.toFixed(1) }}</span>
      </div>
      <input
        id="coefficient-b"
        type="range"
        :min="sliderConfigs.b.min"
        :max="sliderConfigs.b.max"
        :step="sliderConfigs.b.step"
        :value="b"
        class="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        data-testid="coefficient-b-slider"
        :aria-valuemin="sliderConfigs.b.min"
        :aria-valuemax="sliderConfigs.b.max"
        :aria-valuenow="b"
        @input="handleBChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-0.5">
        <span>{{ sliderConfigs.b.min }}</span>
        <span>{{ sliderConfigs.b.max }}</span>
      </div>
    </div>

    <!-- Coefficient c -->
    <div class="slider-group">
      <div class="flex justify-between items-center mb-1">
        <label for="coefficient-c" class="text-sm font-medium text-text-primary">
          {{ sliderConfigs.c.label }}
        </label>
        <span class="text-sm font-mono text-primary">{{ c.toFixed(1) }}</span>
      </div>
      <input
        id="coefficient-c"
        type="range"
        :min="sliderConfigs.c.min"
        :max="sliderConfigs.c.max"
        :step="sliderConfigs.c.step"
        :value="c"
        class="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        data-testid="coefficient-c-slider"
        :aria-valuemin="sliderConfigs.c.min"
        :aria-valuemax="sliderConfigs.c.max"
        :aria-valuenow="c"
        @input="handleCChange"
      />
      <div class="flex justify-between text-xs text-text-muted mt-0.5">
        <span>{{ sliderConfigs.c.min }}</span>
        <span>{{ sliderConfigs.c.max }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
