<script setup lang="ts">
import { CoordinateSystem, PlotCurve, PlotPoint, PlotLine } from '@/components/visualizations'
import MathBlock from '@/components/content/MathBlock.vue'
import BaseSelector from './BaseSelector.vue'
import FunctionTypeSelector from './FunctionTypeSelector.vue'
import GrowthDecayPanel from './GrowthDecayPanel.vue'
import type { FunctionType, BasePresetId } from './types'
import type { GrowthDecayResult } from '@/utils/math/exponential'

interface Props {
  functionType: FunctionType
  base: number
  currentBasePreset: BasePresetId | null
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number }
  plotFunction: (x: number) => number
  keyPoints: Array<{ x: number; y: number; label: string }>
  formulaLatex: string
  growthDecayAnalysis: GrowthDecayResult | null
  isValidBase: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:functionType': [value: FunctionType]
  'update:base': [value: number]
  selectPreset: [presetId: BasePresetId]
}>()

function handleFunctionTypeChange(type: FunctionType) {
  emit('update:functionType', type)
}

function handleBaseChange(value: number) {
  emit('update:base', value)
}

function handlePresetSelect(presetId: BasePresetId) {
  emit('selectPreset', presetId)
}

// SVG dimensions
const svgWidth = 360
const svgHeight = 360
const svgPadding = 30
</script>

<template>
  <div class="function-explorer-tab" data-testid="function-explorer-tab">
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left: Graph -->
      <div class="card p-4" data-testid="exponential-graph">
        <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          <i class="fa-solid fa-chart-area mr-2" aria-hidden="true" />
          Graph
        </h3>

        <div class="flex justify-center">
          <CoordinateSystem
            :x-min="bounds.xMin"
            :x-max="bounds.xMax"
            :y-min="bounds.yMin"
            :y-max="bounds.yMax"
            :width="svgWidth"
            :height="svgHeight"
            :grid-step="functionType === 'exponential' ? 2 : 5"
            :aria-label="`${functionType === 'exponential' ? 'Exponential' : 'Logarithmic'} function graph`"
          >
            <template #default="{ toSvgX, toSvgY }">
              <!-- Asymptote line -->
              <PlotLine
                v-if="functionType === 'exponential'"
                type="horizontal"
                :value="0"
                :to-svg-x="toSvgX"
                :to-svg-y="toSvgY"
                :svg-x-min="svgPadding"
                :svg-x-max="svgWidth - svgPadding"
                :svg-y-min="svgPadding"
                :svg-y-max="svgHeight - svgPadding"
                :dashed="true"
                stroke-color="var(--color-text-muted)"
                :stroke-width="1"
              />
              <PlotLine
                v-else
                type="vertical"
                :value="0"
                :to-svg-x="toSvgX"
                :to-svg-y="toSvgY"
                :svg-x-min="svgPadding"
                :svg-x-max="svgWidth - svgPadding"
                :svg-y-min="svgPadding"
                :svg-y-max="svgHeight - svgPadding"
                :dashed="true"
                stroke-color="var(--color-text-muted)"
                :stroke-width="1"
              />

              <!-- Function curve -->
              <PlotCurve
                v-if="isValidBase"
                :fn="plotFunction"
                :x-min="functionType === 'logarithm' ? 0.01 : bounds.xMin"
                :x-max="bounds.xMax"
                :to-svg-x="toSvgX"
                :to-svg-y="toSvgY"
                :samples="150"
                stroke-color="var(--color-primary)"
                :stroke-width="2.5"
              />

              <!-- Key points -->
              <PlotPoint
                v-for="(point, index) in keyPoints"
                :key="`point-${index}`"
                :x="point.x"
                :y="point.y"
                :to-svg-x="toSvgX"
                :to-svg-y="toSvgY"
                color="var(--color-primary)"
                :size="6"
                :label="point.label"
              />
            </template>
          </CoordinateSystem>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap gap-4 justify-center mt-3 text-xs text-text-muted">
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-primary" />
            Key points
          </div>
          <div class="flex items-center gap-1">
            <span class="w-6 h-0.5 bg-text-muted" style="border-style: dashed" />
            Asymptote
          </div>
        </div>
      </div>

      <!-- Right: Controls and Analysis -->
      <div class="space-y-4">
        <!-- Function Type Selector -->
        <div class="card p-4">
          <FunctionTypeSelector :model-value="functionType" @update:model-value="handleFunctionTypeChange" />
        </div>

        <!-- Base Selector -->
        <div class="card p-4">
          <BaseSelector
            :model-value="base"
            :current-preset="currentBasePreset"
            @update:model-value="handleBaseChange"
            @select-preset="handlePresetSelect"
          />
        </div>

        <!-- Formula Display -->
        <div class="card p-4">
          <h4 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
            <i class="fa-solid fa-function mr-2" aria-hidden="true" />
            Function
          </h4>
          <div class="text-center py-2">
            <MathBlock :formula="formulaLatex" display />
          </div>
        </div>

        <!-- Growth/Decay Analysis -->
        <div v-if="functionType === 'exponential'" class="card p-4">
          <GrowthDecayPanel :analysis="growthDecayAnalysis" :function-type="functionType" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  @apply bg-surface border border-border rounded-lg;
}
</style>
