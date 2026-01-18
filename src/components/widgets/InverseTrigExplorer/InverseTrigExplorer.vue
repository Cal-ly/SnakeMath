<script setup lang="ts">
import { useInverseTrig } from '@/composables/useInverseTrig'
import FunctionSelector from './FunctionSelector.vue'
import ValueInput from './ValueInput.vue'
import InverseVisualization from './InverseVisualization.vue'
import ResultDisplay from './ResultDisplay.vue'
import PresetSelector from './PresetSelector.vue'

interface Props {
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: true,
})

const {
  selectedFunction,
  inputValue,
  inputY,
  angleUnit,
  functionInfo,
  isAtan2,
  result,
  presetsForFunction,
  selectFunction,
  setInputValue,
  setInputY,
  applyPreset,
  toggleAngleUnit,
  INVERSE_FUNCTIONS,
} = useInverseTrig({ syncUrl: props.syncUrl })
</script>

<template>
  <div class="inverse-trig-explorer" data-testid="inverse-trig-explorer">
    <div class="p-4 bg-surface rounded-lg border border-border">
      <!-- Function selector -->
      <div class="mb-4">
        <FunctionSelector
          :functions="INVERSE_FUNCTIONS"
          :selected-function="selectedFunction"
          @select="selectFunction"
        />
      </div>

      <!-- Function description -->
      <div v-if="functionInfo" class="mb-4 p-3 bg-surface-alt rounded border border-border">
        <div class="font-medium text-text-primary">{{ functionInfo.name }}</div>
        <div class="text-sm text-text-muted">{{ functionInfo.description }}</div>
        <div v-if="isAtan2" class="mt-2 text-sm text-amber-600 dark:text-amber-400">
          <i class="fa-solid fa-star mr-1" aria-hidden="true" />
          Recommended: Handles all four quadrants correctly!
        </div>
      </div>

      <!-- Main content grid -->
      <div class="grid md:grid-cols-2 gap-4">
        <!-- Left column: Inputs -->
        <div class="space-y-4">
          <ValueInput
            :fn="selectedFunction"
            :value="inputValue"
            :y="inputY"
            :domain="functionInfo?.domain ?? { min: -1, max: 1 }"
            @update:value="setInputValue"
            @update:y="setInputY"
          />

          <PresetSelector
            :presets="presetsForFunction"
            @select="applyPreset"
          />
        </div>

        <!-- Right column: Visualization -->
        <div>
          <InverseVisualization
            :fn="selectedFunction"
            :result="result"
            :value="inputValue"
            :y="inputY"
          />
        </div>
      </div>

      <!-- Result display -->
      <div class="mt-4">
        <ResultDisplay
          :fn="selectedFunction"
          :result="result"
          :value="inputValue"
          :y="inputY"
          :angle-unit="angleUnit"
          @toggle-unit="toggleAngleUnit"
        />
      </div>

      <!-- Python code example -->
      <div class="mt-4 p-3 bg-surface-alt rounded border border-border">
        <div class="text-sm font-medium text-text-secondary mb-2">
          <i class="fa-brands fa-python mr-2" aria-hidden="true" />
          Python
        </div>
        <pre class="text-xs font-mono text-text-secondary overflow-x-auto"><code v-if="isAtan2">import math

x, y = {{ inputValue }}, {{ inputY }}
angle_rad = math.atan2(y, x)  # Note: y first, then x!
angle_deg = math.degrees(angle_rad)
print(f"atan2({y}, {x}) = {angle_deg:.2f}°")</code><code v-else>import math

value = {{ inputValue }}
angle_rad = math.{{ selectedFunction === 'arcsin' ? 'asin' : selectedFunction === 'arccos' ? 'acos' : 'atan' }}(value)
angle_deg = math.degrees(angle_rad)
print(f"{{ selectedFunction }}({value}) = {angle_deg:.2f}°")</code></pre>
      </div>
    </div>
  </div>
</template>
