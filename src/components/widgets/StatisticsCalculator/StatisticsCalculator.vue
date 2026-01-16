<script setup lang="ts">
import DatasetSelector from './DatasetSelector.vue'
import CustomDataInput from './CustomDataInput.vue'
import StatisticsPanel from './StatisticsPanel.vue'
import SpreadPanel from './SpreadPanel.vue'
import QuartilesPanel from './QuartilesPanel.vue'
import OutliersPanel from './OutliersPanel.vue'
import HistogramChart from './HistogramChart.vue'
import BoxPlotChart from './BoxPlotChart.vue'
import { useStatistics } from '@/composables/useStatistics'

interface Props {
  /** Initial dataset ID */
  initialDataset?: string
  /** Initial bin count */
  initialBinCount?: number
  /** Sync state to URL */
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialDataset: 'test-scores',
  initialBinCount: 10,
  syncUrl: false,
})

const {
  selectedDataset,
  binCount,
  customInput,
  customParseError,
  isCustomMode,
  currentPreset,
  currentData,
  dataUnit,
  hasValidData,
  statistics,
  histogramData,
  datasetPresets,
  selectDataset,
  applyCustomData,
  setBinCount,
} = useStatistics({
  initialDataset: props.initialDataset,
  initialBinCount: props.initialBinCount,
  syncUrl: props.syncUrl,
})

function handleSelectDataset(id: string) {
  selectDataset(id)
}

function handleApplyCustomData(input: string) {
  applyCustomData(input)
}

function handleBinCountUpdate(count: number) {
  setBinCount(count)
}
</script>

<template>
  <div class="statistics-calculator" data-testid="statistics-calculator">
    <!-- Dataset Selection -->
    <div class="mb-6">
      <DatasetSelector
        :presets="datasetPresets"
        :selected-dataset="selectedDataset"
        @select="handleSelectDataset"
      />

      <!-- Current dataset description -->
      <p v-if="currentPreset" class="mt-2 text-sm text-text-muted">
        <i class="fa-solid fa-info-circle mr-1" aria-hidden="true" />
        {{ currentPreset.description }}
      </p>
    </div>

    <!-- Custom Data Input -->
    <Transition name="slide-fade">
      <div v-if="isCustomMode" class="mb-6">
        <CustomDataInput
          :initial-input="customInput"
          :error-message="customParseError"
          :data-count="currentData.length"
          @apply="handleApplyCustomData"
        />
      </div>
    </Transition>

    <!-- Statistics Panels Grid -->
    <div class="grid gap-4 md:grid-cols-2 mb-6">
      <div class="card p-4">
        <StatisticsPanel
          :stats="statistics?.descriptive ?? null"
          :unit="dataUnit"
        />
      </div>

      <div class="card p-4">
        <SpreadPanel
          :spread="statistics?.spread ?? null"
          :skewness="statistics?.skewness ?? null"
          :descriptive="statistics?.descriptive ?? null"
          :unit="dataUnit"
        />
      </div>

      <div class="card p-4">
        <QuartilesPanel
          :quartiles="statistics?.quartiles ?? null"
          :unit="dataUnit"
        />
      </div>

      <div class="card p-4">
        <OutliersPanel
          :outliers="statistics?.outliers ?? null"
          :unit="dataUnit"
        />
      </div>
    </div>

    <!-- Visualizations -->
    <div v-if="hasValidData" class="space-y-6">
      <div class="card p-4">
        <HistogramChart
          :histogram-data="histogramData"
          :bin-count="binCount"
          @update:bin-count="handleBinCountUpdate"
        />
      </div>

      <div class="card p-4">
        <BoxPlotChart
          :quartiles="statistics?.quartiles ?? null"
          :outliers="statistics?.outliers ?? null"
        />
      </div>
    </div>

    <!-- Share link hint -->
    <p v-if="syncUrl" class="mt-4 text-xs text-text-muted text-center">
      <i class="fa-solid fa-link mr-1" aria-hidden="true" />
      Share this URL to show these settings to others
    </p>
  </div>
</template>

<style scoped>
.card {
  @apply bg-surface border border-border rounded-lg;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
