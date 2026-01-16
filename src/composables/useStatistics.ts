import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  calculateFullStatistics,
  generateHistogramBins,
  parseDataInput,
  datasetPresets,
  suggestBinCount,
} from '@/utils/math/statistics'
import type {
  FullStatistics,
  HistogramData,
  DatasetPreset,
  ParseResult,
} from '@/utils/math/statistics'

export interface UseStatisticsOptions {
  /** Initial dataset ID or 'custom' */
  initialDataset?: string
  /** Initial bin count for histogram */
  initialBinCount?: number
  /** Whether to sync state to URL */
  syncUrl?: boolean
}

/**
 * Composable for managing statistics calculator state and calculations.
 * Optionally syncs dataset and bin count to URL for shareable links.
 */
export function useStatistics(options: UseStatisticsOptions = {}) {
  const { initialDataset = 'test-scores', initialBinCount = 10, syncUrl = true } = options

  const route = useRoute()
  const router = useRouter()

  // State
  const selectedDataset = ref(initialDataset)
  const customData = ref<number[]>([])
  const customInput = ref('')
  const binCount = ref(initialBinCount)
  const customParseError = ref<string | null>(null)

  // URL sync state
  let isUpdatingFromUrl = false
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // Computed: Is custom mode
  const isCustomMode = computed(() => selectedDataset.value === 'custom')

  // Computed: Current preset info
  const currentPreset = computed<DatasetPreset | null>(() => {
    if (isCustomMode.value) return null
    return datasetPresets.find((p) => p.id === selectedDataset.value) ?? null
  })

  // Computed: Current active data
  const currentData = computed<number[]>(() => {
    if (isCustomMode.value) {
      return customData.value
    }
    return currentPreset.value?.data ?? []
  })

  // Computed: Data unit (for display)
  const dataUnit = computed<string>(() => {
    return currentPreset.value?.unit ?? ''
  })

  // Computed: Data validation status
  const hasValidData = computed(() => currentData.value.length >= 2)

  // Computed: Full statistics (null if insufficient data)
  const statistics = computed<FullStatistics | null>(() => {
    if (!hasValidData.value) return null
    try {
      return calculateFullStatistics(currentData.value)
    } catch {
      return null
    }
  })

  // Computed: Suggested bin count based on data
  const suggestedBinCount = computed(() => {
    if (!hasValidData.value) return 10
    return suggestBinCount(currentData.value)
  })

  // Computed: Histogram data
  const histogramData = computed<HistogramData | null>(() => {
    if (!hasValidData.value) return null
    try {
      return generateHistogramBins(currentData.value, binCount.value)
    } catch {
      return null
    }
  })

  /**
   * Select a dataset by ID
   */
  function selectDataset(id: string) {
    selectedDataset.value = id
    customParseError.value = null
  }

  /**
   * Apply custom data from text input
   */
  function applyCustomData(input: string): ParseResult {
    const result = parseDataInput(input)

    if (result.success) {
      customData.value = result.data
      customInput.value = input
      customParseError.value = null
    } else if (result.data.length >= 2) {
      // Partial success: some valid numbers but also errors
      customData.value = result.data
      customInput.value = input
      customParseError.value = result.errors.join('; ')
    } else {
      customParseError.value = result.errors.join('; ')
    }

    return result
  }

  /**
   * Set histogram bin count (clamped to 3-20 range)
   */
  function setBinCount(count: number) {
    binCount.value = Math.max(3, Math.min(20, count))
  }

  /**
   * Reset bin count to suggested value
   */
  function resetBinCount() {
    binCount.value = suggestedBinCount.value
  }

  // URL Sync
  function initFromUrl() {
    if (!syncUrl) return

    const urlDataset = route.query.dataset
    const urlBins = route.query.bins

    isUpdatingFromUrl = true

    if (typeof urlDataset === 'string') {
      // Check if it's a valid preset ID
      const isValidPreset = datasetPresets.some((p) => p.id === urlDataset)
      if (isValidPreset || urlDataset === 'custom') {
        selectedDataset.value = urlDataset
      }
    }

    if (typeof urlBins === 'string') {
      const parsed = parseInt(urlBins, 10)
      if (!isNaN(parsed) && parsed >= 3 && parsed <= 20) {
        binCount.value = parsed
      }
    }

    setTimeout(() => {
      isUpdatingFromUrl = false
    }, 0)
  }

  function updateUrl() {
    if (!syncUrl || isUpdatingFromUrl) return

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      const query: Record<string, string> = {}

      // Only include non-default values
      if (selectedDataset.value !== initialDataset) {
        query.dataset = selectedDataset.value
      }
      if (binCount.value !== initialBinCount) {
        query.bins = binCount.value.toString()
      }

      // Preserve other query params
      const existingQuery = { ...route.query }
      delete existingQuery.dataset
      delete existingQuery.bins

      const newQuery = { ...existingQuery, ...query }

      // Only update if changed
      if (JSON.stringify(newQuery) !== JSON.stringify(route.query)) {
        router.replace({ query: newQuery })
      }
    }, 300)
  }

  // Watch for changes and update URL
  if (syncUrl) {
    watch([selectedDataset, binCount], () => {
      updateUrl()
    })

    // Handle browser back/forward
    watch(
      () => route.query,
      () => {
        if (!isUpdatingFromUrl) {
          initFromUrl()
        }
      }
    )
  }

  // Initialize from URL on mount
  onMounted(() => {
    initFromUrl()
  })

  return {
    // State
    selectedDataset,
    customData,
    customInput,
    binCount,
    customParseError,

    // Computed
    isCustomMode,
    currentPreset,
    currentData,
    dataUnit,
    hasValidData,
    statistics,
    suggestedBinCount,
    histogramData,

    // Data
    datasetPresets,

    // Methods
    selectDataset,
    applyCustomData,
    setBinCount,
    resetBinCount,
  }
}
