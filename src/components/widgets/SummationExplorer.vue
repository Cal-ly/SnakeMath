<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BoundsInput, PresetSelector, SummationResult, SummationCodeParallel } from './summation'
import { evaluateSummation, getPresetExpression } from '@/utils/math/summation'
import { useUrlState } from '@/composables'
import type { SummationPresetId, SummationResult as SummationResultType } from '@/types/math'

interface Props {
  /** Initial preset to display */
  initialPreset?: SummationPresetId
  /** Initial start index */
  initialStart?: number
  /** Initial end index */
  initialEnd?: number
  /** Sync state to URL query params */
  syncUrl?: boolean
  /** Prefix for URL query param keys */
  urlKeyPrefix?: string
  /** Show the visualization bar chart (Phase 5E) */
  showVisualization?: boolean
  /** Show the code parallel display (Phase 5D) */
  showCodeParallel?: boolean
  /** Show the formula comparison (Phase 5F) */
  showFormulaComparison?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialPreset: 'arithmetic',
  initialStart: 1,
  initialEnd: 10,
  syncUrl: false,
  urlKeyPrefix: '',
  showVisualization: true,
  showCodeParallel: true,
  showFormulaComparison: true,
})

// URL state keys with prefix support
const presetKey = computed(() => (props.urlKeyPrefix ? `${props.urlKeyPrefix}preset` : 'preset'))
const startKey = computed(() => (props.urlKeyPrefix ? `${props.urlKeyPrefix}start` : 'start'))
const endKey = computed(() => (props.urlKeyPrefix ? `${props.urlKeyPrefix}end` : 'end'))

// URL state (only used if syncUrl is true)
const presetUrlState = props.syncUrl
  ? useUrlState(presetKey.value, props.initialPreset)
  : null
const startUrlState = props.syncUrl
  ? useUrlState(startKey.value, props.initialStart.toString())
  : null
const endUrlState = props.syncUrl
  ? useUrlState(endKey.value, props.initialEnd.toString())
  : null

// Local state
const localPreset = ref<SummationPresetId>(props.initialPreset)
const localStart = ref(props.initialStart)
const localEnd = ref(props.initialEnd)

// Use URL state if enabled, otherwise local state
const preset = computed({
  get: () => {
    if (presetUrlState) {
      const urlValue = presetUrlState.value.value as SummationPresetId
      return isValidPreset(urlValue) ? urlValue : props.initialPreset
    }
    return localPreset.value
  },
  set: (val: SummationPresetId) => {
    if (presetUrlState) {
      presetUrlState.setValue(val)
    } else {
      localPreset.value = val
    }
  },
})

const start = computed({
  get: () => {
    if (startUrlState) {
      const urlValue = parseInt(startUrlState.value.value, 10)
      return isNaN(urlValue) ? props.initialStart : urlValue
    }
    return localStart.value
  },
  set: (val: number) => {
    if (startUrlState) {
      startUrlState.setValue(val.toString())
    } else {
      localStart.value = val
    }
  },
})

const end = computed({
  get: () => {
    if (endUrlState) {
      const urlValue = parseInt(endUrlState.value.value, 10)
      return isNaN(urlValue) ? props.initialEnd : urlValue
    }
    return localEnd.value
  },
  set: (val: number) => {
    if (endUrlState) {
      endUrlState.setValue(val.toString())
    } else {
      localEnd.value = val
    }
  },
})

// Validate preset ID
function isValidPreset(value: string): value is SummationPresetId {
  return ['arithmetic', 'squares', 'cubes', 'geometric', 'constant'].includes(value)
}

// Initialize from URL if syncing
onMounted(() => {
  if (!props.syncUrl) return

  // URL values are already loaded via computed getters
})

// Compute the summation result
const result = computed<SummationResultType>(() => {
  const expression = getPresetExpression(preset.value)
  return evaluateSummation(expression, start.value, end.value)
})

// Validation state
const isValidRange = computed(() => start.value <= end.value)
const isInBounds = computed(
  () => start.value >= 0 && start.value <= 100 && end.value >= 0 && end.value <= 100,
)
const isValid = computed(() => isValidRange.value && isInBounds.value)

// Handlers for child component updates
function handleStartUpdate(val: number) {
  start.value = val
}

function handleEndUpdate(val: number) {
  end.value = val
}

function handlePresetUpdate(val: SummationPresetId) {
  preset.value = val
}
</script>

<template>
  <div class="summation-explorer">
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Controls Section -->
      <div class="controls-section space-y-6">
        <!-- Preset Selector -->
        <div class="card p-6">
          <PresetSelector :model-value="preset" @update:model-value="handlePresetUpdate" />
        </div>

        <!-- Bounds Input -->
        <div class="card p-6">
          <h3 class="text-sm font-medium text-text-primary mb-3">
            <i class="fa-solid fa-arrows-left-right mr-1.5" aria-hidden="true" />
            Summation Bounds
          </h3>
          <BoundsInput
            :start="start"
            :end="end"
            :min="0"
            :max="100"
            @update:start="handleStartUpdate"
            @update:end="handleEndUpdate"
          />
        </div>

        <!-- URL Share hint -->
        <p v-if="syncUrl && isValid" class="text-xs text-text-muted">
          <i class="fa-solid fa-link mr-1" aria-hidden="true" />
          Share this URL to show these settings to others
        </p>
      </div>

      <!-- Results Section -->
      <div class="results-section">
        <div class="card p-6">
          <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
            <i class="fa-solid fa-calculator mr-2" aria-hidden="true" />
            Result
          </h3>

          <div v-if="!isValid" class="text-center py-8 text-red-500">
            <i class="fa-solid fa-circle-exclamation text-2xl mb-2" aria-hidden="true" />
            <p v-if="!isValidRange">Start must be less than or equal to end</p>
            <p v-else-if="!isInBounds">Values must be between 0 and 100</p>
          </div>

          <SummationResult v-else :result="result" />
        </div>
      </div>
    </div>

    <!-- Code Parallel Display (5D) -->
    <div v-if="showCodeParallel && isValid" class="mt-6">
      <SummationCodeParallel
        :preset="preset"
        :start="start"
        :end="end"
        :total="result.total"
      />
    </div>

    <!-- Placeholder sections for future increments -->
    <div v-if="showVisualization || showFormulaComparison" class="mt-6">
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Visualization (5E) -->
        <div
          v-if="showVisualization"
          class="card p-4 border-2 border-dashed border-border text-center"
        >
          <p class="text-text-muted text-sm">
            <i class="fa-solid fa-chart-bar mr-1" aria-hidden="true" />
            Bar Chart (5E)
          </p>
        </div>

        <!-- Formula Comparison (5F) -->
        <div
          v-if="showFormulaComparison"
          class="card p-4 border-2 border-dashed border-border text-center"
        >
          <p class="text-text-muted text-sm">
            <i class="fa-solid fa-not-equal mr-1" aria-hidden="true" />
            Formula Comparison (5F)
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
