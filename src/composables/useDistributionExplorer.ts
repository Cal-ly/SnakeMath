import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getPdf,
  getCdf,
  getQuantile,
  generateSamples,
  getDistributionStats,
  createHistogram,
  getSuggestedRange,
  isDiscreteDistribution,
  getDiscreteXValues,
  distributionPresets,
  getPresetById,
  probabilityLessThanOrEqual,
  probabilityBetween,
  isValidParams,
} from '@/utils/math/distributions'
import type {
  DistributionType,
  DistributionParams,
  DistributionStats,
  HistogramBin,
  NormalParams,
  BinomialParams,
  PoissonParams,
  ExponentialParams,
  UniformParams,
} from '@/utils/math/distributions'

export interface UseDistributionExplorerOptions {
  /** Initial distribution type */
  initialType?: DistributionType
  /** Initial preset ID */
  initialPreset?: string
  /** Whether to sync state to URL */
  syncUrl?: boolean
}

/** Data point for PDF/PMF visualization */
export interface PdfDataPoint {
  x: number
  y: number
}

/** Probability calculation result */
export interface ProbabilityResult {
  type: 'lessThan' | 'between'
  a?: number
  b: number
  probability: number
}

// Default parameters for each distribution type
const defaultParams: Record<DistributionType, DistributionParams> = {
  normal: { type: 'normal', params: { mu: 0, sigma: 1 } },
  binomial: { type: 'binomial', params: { n: 20, p: 0.5 } },
  poisson: { type: 'poisson', params: { lambda: 5 } },
  exponential: { type: 'exponential', params: { lambda: 1 } },
  uniform: { type: 'uniform', params: { a: 0, b: 1 } },
}

/**
 * Composable for managing distribution explorer state and calculations.
 * Optionally syncs state to URL for shareable links.
 */
export function useDistributionExplorer(options: UseDistributionExplorerOptions = {}) {
  const { initialType = 'normal', initialPreset, syncUrl = true } = options

  const route = useRoute()
  const router = useRouter()

  // ============================================================================
  // State
  // ============================================================================

  const distributionType = ref<DistributionType>(initialType)

  // Parameters for each distribution type (stored separately for switching)
  const normalParams = ref<NormalParams>({ mu: 0, sigma: 1 })
  const binomialParams = ref<BinomialParams>({ n: 20, p: 0.5 })
  const poissonParams = ref<PoissonParams>({ lambda: 5 })
  const exponentialParams = ref<ExponentialParams>({ lambda: 1 })
  const uniformParams = ref<UniformParams>({ a: 0, b: 1 })

  // Sample data for histogram
  const sampleData = ref<number[]>([])
  const sampleCount = ref(500)

  // Probability calculator state
  const probCalcMode = ref<'lessThan' | 'between'>('lessThan')
  const probCalcA = ref(0)
  const probCalcB = ref(1)

  // CLT demonstration state
  const cltEnabled = ref(false)
  const cltSourceType = ref<DistributionType>('uniform')
  const cltSampleSize = ref(30)
  const cltSampleCount = ref(500)
  const cltSampleMeans = ref<number[]>([])

  // URL sync state
  let isUpdatingFromUrl = false
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // ============================================================================
  // Computed Properties
  // ============================================================================

  /** Current distribution parameters object */
  const currentDistribution = computed<DistributionParams>(() => {
    switch (distributionType.value) {
      case 'normal':
        return { type: 'normal', params: normalParams.value }
      case 'binomial':
        return { type: 'binomial', params: binomialParams.value }
      case 'poisson':
        return { type: 'poisson', params: poissonParams.value }
      case 'exponential':
        return { type: 'exponential', params: exponentialParams.value }
      case 'uniform':
        return { type: 'uniform', params: uniformParams.value }
      default:
        // TypeScript exhaustiveness check - this should never happen
        return { type: 'normal', params: normalParams.value }
    }
  })

  /** Whether current parameters are valid */
  const isValid = computed(() => isValidParams(currentDistribution.value))

  /** Distribution statistics (mean, variance, etc.) */
  const stats = computed<DistributionStats | null>(() => {
    if (!isValid.value) return null
    try {
      return getDistributionStats(currentDistribution.value)
    } catch {
      return null
    }
  })

  /** X-axis range for visualization */
  const xRange = computed(() => {
    if (!isValid.value) return { min: -4, max: 4 }
    return getSuggestedRange(currentDistribution.value)
  })

  /** Whether current distribution is discrete */
  const isDiscrete = computed(() => isDiscreteDistribution(distributionType.value))

  /** PDF/PMF data points for visualization */
  const pdfData = computed<PdfDataPoint[]>(() => {
    if (!isValid.value) return []

    const points: PdfDataPoint[] = []
    const { min, max } = xRange.value

    if (isDiscrete.value) {
      // For discrete distributions, use integer x values
      const xValues = getDiscreteXValues(currentDistribution.value)
      for (const x of xValues) {
        const y = getPdf(currentDistribution.value, x)
        if (y > 0) {
          points.push({ x, y })
        }
      }
    } else {
      // For continuous distributions, sample at regular intervals
      const numPoints = 200
      const step = (max - min) / numPoints
      for (let i = 0; i <= numPoints; i++) {
        const x = min + i * step
        const y = getPdf(currentDistribution.value, x)
        points.push({ x, y })
      }
    }

    return points
  })

  /** Maximum PDF/PMF value for scaling */
  const maxPdfValue = computed(() => {
    if (pdfData.value.length === 0) return 1
    return Math.max(...pdfData.value.map((p) => p.y))
  })

  /** CDF data points for visualization */
  const cdfData = computed<PdfDataPoint[]>(() => {
    if (!isValid.value) return []

    const points: PdfDataPoint[] = []
    const { min, max } = xRange.value
    const numPoints = 200
    const step = (max - min) / numPoints

    for (let i = 0; i <= numPoints; i++) {
      const x = min + i * step
      const y = getCdf(currentDistribution.value, x)
      points.push({ x, y })
    }

    return points
  })

  /** Histogram bins from sample data */
  const histogramBins = computed<HistogramBin[]>(() => {
    if (sampleData.value.length === 0) return []
    return createHistogram(sampleData.value, 30)
  })

  /** Probability calculation result */
  const probabilityResult = computed<ProbabilityResult | null>(() => {
    if (!isValid.value) return null

    try {
      if (probCalcMode.value === 'lessThan') {
        const prob = probabilityLessThanOrEqual(currentDistribution.value, probCalcB.value)
        return { type: 'lessThan', b: probCalcB.value, probability: prob }
      } else {
        const prob = probabilityBetween(
          currentDistribution.value,
          probCalcA.value,
          probCalcB.value
        )
        return {
          type: 'between',
          a: probCalcA.value,
          b: probCalcB.value,
          probability: prob,
        }
      }
    } catch {
      return null
    }
  })

  /** CLT histogram of sample means */
  const cltHistogramBins = computed<HistogramBin[]>(() => {
    if (cltSampleMeans.value.length === 0) return []
    return createHistogram(cltSampleMeans.value, 30)
  })

  /** Expected mean and std dev for CLT sample means */
  const cltExpectedStats = computed(() => {
    const sourceDist = defaultParams[cltSourceType.value]
    const sourceStats = getDistributionStats(sourceDist)
    return {
      mean: sourceStats.mean,
      stdDev: sourceStats.stdDev / Math.sqrt(cltSampleSize.value),
    }
  })

  // ============================================================================
  // Methods
  // ============================================================================

  /** Set distribution type (preserves parameters when switching back) */
  function setDistributionType(type: DistributionType) {
    distributionType.value = type
    sampleData.value = [] // Clear samples when switching
  }

  /** Set normal distribution parameters */
  function setNormalParams(params: Partial<NormalParams>) {
    normalParams.value = { ...normalParams.value, ...params }
  }

  /** Set binomial distribution parameters */
  function setBinomialParams(params: Partial<BinomialParams>) {
    binomialParams.value = { ...binomialParams.value, ...params }
  }

  /** Set Poisson distribution parameters */
  function setPoissonParams(params: Partial<PoissonParams>) {
    poissonParams.value = { ...poissonParams.value, ...params }
  }

  /** Set exponential distribution parameters */
  function setExponentialParams(params: Partial<ExponentialParams>) {
    exponentialParams.value = { ...exponentialParams.value, ...params }
  }

  /** Set uniform distribution parameters */
  function setUniformParams(params: Partial<UniformParams>) {
    uniformParams.value = { ...uniformParams.value, ...params }
  }

  /** Load a preset by ID */
  function loadPreset(presetId: string) {
    const preset = getPresetById(presetId)
    if (!preset) return

    const { distribution } = preset
    distributionType.value = distribution.type

    switch (distribution.type) {
      case 'normal':
        normalParams.value = { ...distribution.params }
        break
      case 'binomial':
        binomialParams.value = { ...distribution.params }
        break
      case 'poisson':
        poissonParams.value = { ...distribution.params }
        break
      case 'exponential':
        exponentialParams.value = { ...distribution.params }
        break
      case 'uniform':
        uniformParams.value = { ...distribution.params }
        break
    }

    sampleData.value = []
  }

  /** Generate new samples from current distribution */
  function generateNewSamples(count?: number) {
    const n = count ?? sampleCount.value
    if (!isValid.value) return

    sampleData.value = generateSamples(currentDistribution.value, n)
  }

  /** Clear sample data */
  function clearSamples() {
    sampleData.value = []
  }

  /** Calculate quantile (inverse CDF) */
  function calculateQuantile(p: number): number | null {
    if (!isValid.value || p < 0 || p > 1) return null
    try {
      return getQuantile(currentDistribution.value, p)
    } catch {
      return null
    }
  }

  /** Set probability calculator mode */
  function setProbCalcMode(mode: 'lessThan' | 'between') {
    probCalcMode.value = mode
  }

  /** Set probability calculator bounds */
  function setProbCalcBounds(a: number, b: number) {
    probCalcA.value = a
    probCalcB.value = b
  }

  // ============================================================================
  // CLT Demonstration Methods
  // ============================================================================

  /** Run CLT sampling simulation */
  function runCltSampling(numSamples?: number) {
    const count = numSamples ?? cltSampleCount.value
    const sourceDist = defaultParams[cltSourceType.value]
    const means: number[] = []

    for (let i = 0; i < count; i++) {
      const samples = generateSamples(sourceDist, cltSampleSize.value)
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length
      means.push(mean)
    }

    cltSampleMeans.value = means
  }

  /** Add more CLT samples (incremental) */
  function addCltSamples(count: number) {
    const sourceDist = defaultParams[cltSourceType.value]

    for (let i = 0; i < count; i++) {
      const samples = generateSamples(sourceDist, cltSampleSize.value)
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length
      cltSampleMeans.value.push(mean)
    }
  }

  /** Reset CLT demonstration */
  function resetClt() {
    cltSampleMeans.value = []
  }

  /** Set CLT source distribution type */
  function setCltSourceType(type: DistributionType) {
    cltSourceType.value = type
    cltSampleMeans.value = []
  }

  /** Set CLT sample size */
  function setCltSampleSize(size: number) {
    cltSampleSize.value = Math.max(1, Math.min(100, size))
    cltSampleMeans.value = []
  }

  // ============================================================================
  // URL State Sync
  // ============================================================================

  function initFromUrl() {
    if (!syncUrl) return

    const urlType = route.query.type
    const urlPreset = route.query.preset

    isUpdatingFromUrl = true

    if (typeof urlPreset === 'string') {
      loadPreset(urlPreset)
    } else if (typeof urlType === 'string' && isValidDistributionType(urlType)) {
      distributionType.value = urlType

      // Parse distribution-specific parameters
      switch (urlType) {
        case 'normal': {
          const mu = parseFloat(route.query.mu as string)
          const sigma = parseFloat(route.query.sigma as string)
          if (!isNaN(mu)) normalParams.value.mu = mu
          if (!isNaN(sigma) && sigma > 0) normalParams.value.sigma = sigma
          break
        }
        case 'binomial': {
          const n = parseInt(route.query.n as string, 10)
          const p = parseFloat(route.query.p as string)
          if (!isNaN(n) && n >= 0) binomialParams.value.n = n
          if (!isNaN(p) && p >= 0 && p <= 1) binomialParams.value.p = p
          break
        }
        case 'poisson': {
          const lambda = parseFloat(route.query.lambda as string)
          if (!isNaN(lambda) && lambda >= 0) poissonParams.value.lambda = lambda
          break
        }
        case 'exponential': {
          const lambda = parseFloat(route.query.lambda as string)
          if (!isNaN(lambda) && lambda > 0) exponentialParams.value.lambda = lambda
          break
        }
        case 'uniform': {
          const a = parseFloat(route.query.a as string)
          const b = parseFloat(route.query.b as string)
          if (!isNaN(a)) uniformParams.value.a = a
          if (!isNaN(b) && b > a) uniformParams.value.b = b
          break
        }
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

      // Add distribution type
      query.type = distributionType.value

      // Add distribution-specific parameters
      switch (distributionType.value) {
        case 'normal':
          if (normalParams.value.mu !== 0) query.mu = normalParams.value.mu.toString()
          if (normalParams.value.sigma !== 1) query.sigma = normalParams.value.sigma.toString()
          break
        case 'binomial':
          if (binomialParams.value.n !== 20) query.n = binomialParams.value.n.toString()
          if (binomialParams.value.p !== 0.5) query.p = binomialParams.value.p.toString()
          break
        case 'poisson':
          if (poissonParams.value.lambda !== 5) query.lambda = poissonParams.value.lambda.toString()
          break
        case 'exponential':
          if (exponentialParams.value.lambda !== 1)
            query.lambda = exponentialParams.value.lambda.toString()
          break
        case 'uniform':
          if (uniformParams.value.a !== 0) query.a = uniformParams.value.a.toString()
          if (uniformParams.value.b !== 1) query.b = uniformParams.value.b.toString()
          break
      }

      // Preserve other query params
      const existingQuery = { ...route.query }
      delete existingQuery.type
      delete existingQuery.preset
      delete existingQuery.mu
      delete existingQuery.sigma
      delete existingQuery.n
      delete existingQuery.p
      delete existingQuery.lambda
      delete existingQuery.a
      delete existingQuery.b

      const newQuery = { ...existingQuery, ...query }

      // Only update if changed
      if (JSON.stringify(newQuery) !== JSON.stringify(route.query)) {
        router.replace({ query: newQuery })
      }
    }, 300) // 300ms debounce per LL-015
  }

  function isValidDistributionType(type: string): type is DistributionType {
    return ['normal', 'binomial', 'poisson', 'exponential', 'uniform'].includes(type)
  }

  // ============================================================================
  // Watchers and Lifecycle
  // ============================================================================

  if (syncUrl) {
    // Watch for parameter changes and update URL
    watch(
      [
        distributionType,
        normalParams,
        binomialParams,
        poissonParams,
        exponentialParams,
        uniformParams,
      ],
      () => {
        updateUrl()
      },
      { deep: true }
    )

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
    if (initialPreset) {
      loadPreset(initialPreset)
    } else {
      initFromUrl()
    }
  })

  // Clean up debounce timer on unmount (LI-019)
  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    distributionType,
    normalParams,
    binomialParams,
    poissonParams,
    exponentialParams,
    uniformParams,
    sampleData,
    sampleCount,
    probCalcMode,
    probCalcA,
    probCalcB,
    cltEnabled,
    cltSourceType,
    cltSampleSize,
    cltSampleCount,
    cltSampleMeans,

    // Computed
    currentDistribution,
    isValid,
    stats,
    xRange,
    isDiscrete,
    pdfData,
    maxPdfValue,
    cdfData,
    histogramBins,
    probabilityResult,
    cltHistogramBins,
    cltExpectedStats,

    // Static data
    distributionPresets,
    defaultParams,

    // Methods - Distribution
    setDistributionType,
    setNormalParams,
    setBinomialParams,
    setPoissonParams,
    setExponentialParams,
    setUniformParams,
    loadPreset,

    // Methods - Sampling
    generateNewSamples,
    clearSamples,
    calculateQuantile,

    // Methods - Probability Calculator
    setProbCalcMode,
    setProbCalcBounds,

    // Methods - CLT
    runCltSampling,
    addCltSamples,
    resetClt,
    setCltSourceType,
    setCltSampleSize,
  }
}
