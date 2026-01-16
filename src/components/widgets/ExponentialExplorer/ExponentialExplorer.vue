<script setup lang="ts">
import { onMounted } from 'vue'
import FunctionExplorerTab from './FunctionExplorerTab.vue'
import ComplexityComparisonTab from './ComplexityComparisonTab.vue'
import { useExponentialExplorer } from './useExponentialExplorer'
import type { FunctionType, ExplorerTab, BasePresetId } from './types'

interface Props {
  /** Initial tab to show */
  initialTab?: ExplorerTab
  /** Initial function type */
  initialFunctionType?: FunctionType
  /** Initial base value */
  initialBase?: number
  /** Initial complexity n value */
  initialN?: number
  /** Sync state to URL */
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialTab: 'function',
  initialFunctionType: 'exponential',
  initialBase: 2,
  initialN: 10,
  syncUrl: false,
})

const {
  activeTab,
  functionType,
  base,
  complexityN,
  currentBasePreset,
  initializeState,
  loadBasePreset,
  setCustomBase,
  growthDecayAnalysis,
  plotFunction,
  keyPoints,
  bounds,
  formulaLatex,
  isValidBase,
  complexityComparison,
  complexityYMax,
  complexityInsight,
} = useExponentialExplorer({
  syncUrl: props.syncUrl,
  initialTab: props.initialTab,
  initialFunctionType: props.initialFunctionType,
  initialBase: props.initialBase,
  initialN: props.initialN,
})

onMounted(() => {
  initializeState()
})

function handleTabChange(tab: ExplorerTab) {
  activeTab.value = tab
}

function handleFunctionTypeChange(type: FunctionType) {
  functionType.value = type
}

function handleBaseChange(value: number) {
  setCustomBase(value)
}

function handlePresetSelect(presetId: BasePresetId) {
  loadBasePreset(presetId)
}

function handleNChange(value: number) {
  complexityN.value = value
}
</script>

<template>
  <div class="exponential-explorer" data-testid="exponential-explorer">
    <!-- Tab Navigation -->
    <div class="flex border-b border-border mb-6">
      <button
        :class="[
          'px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px min-h-[44px]',
          activeTab === 'function'
            ? 'border-primary text-primary'
            : 'border-transparent text-text-muted hover:text-text-primary',
        ]"
        data-testid="tab-function"
        @click="handleTabChange('function')"
      >
        <i class="fa-solid fa-chart-area mr-2" aria-hidden="true" />
        Function Explorer
      </button>
      <button
        :class="[
          'px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px min-h-[44px]',
          activeTab === 'complexity'
            ? 'border-primary text-primary'
            : 'border-transparent text-text-muted hover:text-text-primary',
        ]"
        data-testid="tab-complexity"
        @click="handleTabChange('complexity')"
      >
        <i class="fa-solid fa-stopwatch mr-2" aria-hidden="true" />
        Complexity Comparison
      </button>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'function'">
      <FunctionExplorerTab
        :function-type="functionType"
        :base="base"
        :current-base-preset="currentBasePreset"
        :bounds="bounds"
        :plot-function="plotFunction"
        :key-points="keyPoints"
        :formula-latex="formulaLatex"
        :growth-decay-analysis="growthDecayAnalysis"
        :is-valid-base="isValidBase"
        @update:function-type="handleFunctionTypeChange"
        @update:base="handleBaseChange"
        @select-preset="handlePresetSelect"
      />
    </div>

    <div v-else-if="activeTab === 'complexity'">
      <ComplexityComparisonTab
        :n="complexityN"
        :comparison="complexityComparison"
        :y-max="complexityYMax"
        :insight="complexityInsight"
        @update:n="handleNChange"
      />
    </div>

    <!-- Share Link hint -->
    <p v-if="syncUrl" class="mt-6 text-xs text-text-muted text-center">
      <i class="fa-solid fa-link mr-1" aria-hidden="true" />
      Share this URL to show these settings to others
    </p>
  </div>
</template>
