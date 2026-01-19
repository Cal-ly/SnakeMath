<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Current sample size */
  sampleSize: number
  /** Maximum sample size (usually population size) */
  maxSize: number
  /** Minimum sample size */
  minSize?: number
  /** Whether sampling is currently animating */
  isAnimating?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  minSize: 2,
  isAnimating: false,
})

const emit = defineEmits<{
  'update:sampleSize': [size: number]
  takeSample: []
  takeMultiple: [count: number]
  reset: []
  startAnimation: []
  stopAnimation: []
}>()

// Effective max size (can't sample more than population)
const effectiveMax = computed(() => Math.min(props.maxSize, 1000))

function handleSliderChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:sampleSize', parseInt(target.value, 10))
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value, 10)
  if (!isNaN(value) && value >= props.minSize && value <= effectiveMax.value) {
    emit('update:sampleSize', value)
  }
}

function handleTakeSample() {
  emit('takeSample')
}

function handleTakeMultiple(count: number) {
  emit('takeMultiple', count)
}

function handleReset() {
  emit('reset')
}

function handleToggleAnimation() {
  if (props.isAnimating) {
    emit('stopAnimation')
  } else {
    emit('startAnimation')
  }
}

const samplingFraction = computed(() => {
  if (props.maxSize === 0) return 0
  return ((props.sampleSize / props.maxSize) * 100).toFixed(1)
})
</script>

<template>
  <div class="sample-size-controls" data-testid="sample-size-controls">
    <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-sliders mr-2" aria-hidden="true" />
      Sample Size
    </h4>

    <!-- Slider and input -->
    <div class="flex items-center gap-4 mb-4">
      <input
        type="range"
        :value="sampleSize"
        :min="minSize"
        :max="effectiveMax"
        class="flex-1 h-2 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
        aria-label="Sample size slider"
        data-testid="sample-size-slider"
        @input="handleSliderChange"
      />
      <div class="flex items-center gap-2">
        <span class="text-sm text-text-secondary">n =</span>
        <input
          type="number"
          :value="sampleSize"
          :min="minSize"
          :max="effectiveMax"
          class="w-20 px-2 py-1 text-sm text-center border border-border rounded-md
                 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Sample size input"
          data-testid="sample-size-input"
          @change="handleInputChange"
        />
      </div>
    </div>

    <!-- Sampling fraction indicator -->
    <div class="mb-4 text-xs text-text-secondary">
      Sampling {{ samplingFraction }}% of population ({{ sampleSize }} of {{ maxSize }})
    </div>

    <!-- Action buttons -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="px-4 py-2 rounded-md bg-primary text-white font-medium
               hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30
               transition-colors"
        data-testid="take-sample-btn"
        @click="handleTakeSample"
      >
        <i class="fa-solid fa-hand-pointer mr-2" aria-hidden="true" />
        Take Sample
      </button>

      <button
        type="button"
        class="px-3 py-2 rounded-md border border-border
               hover:border-primary hover:text-primary
               focus:outline-none focus:ring-2 focus:ring-primary/30
               transition-colors"
        data-testid="take-10-btn"
        @click="handleTakeMultiple(10)"
      >
        +10
      </button>

      <button
        type="button"
        class="px-3 py-2 rounded-md border border-border
               hover:border-primary hover:text-primary
               focus:outline-none focus:ring-2 focus:ring-primary/30
               transition-colors"
        data-testid="take-100-btn"
        @click="handleTakeMultiple(100)"
      >
        +100
      </button>

      <button
        type="button"
        class="px-3 py-2 rounded-md border transition-colors
               focus:outline-none focus:ring-2 focus:ring-primary/30"
        :class="
          isAnimating
            ? 'bg-amber-500 text-white border-amber-500'
            : 'border-border hover:border-primary hover:text-primary'
        "
        data-testid="animate-btn"
        @click="handleToggleAnimation"
      >
        <i v-if="isAnimating" class="fa-solid fa-pause mr-1" aria-hidden="true" />
        <i v-else class="fa-solid fa-play mr-1" aria-hidden="true" />
        {{ isAnimating ? 'Stop' : 'Auto' }}
      </button>

      <button
        type="button"
        class="px-3 py-2 rounded-md border border-border text-text-secondary
               hover:border-red-500 hover:text-red-500
               focus:outline-none focus:ring-2 focus:ring-red-500/30
               transition-colors"
        data-testid="reset-btn"
        @click="handleReset"
      >
        <i class="fa-solid fa-rotate-left mr-1" aria-hidden="true" />
        Reset
      </button>
    </div>
  </div>
</template>

<style scoped>
.sample-size-controls button {
  min-height: 44px;
}

/* Custom range slider styling */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type='range']::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
