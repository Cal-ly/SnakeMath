import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  generatePopulation,
  simpleRandomSample,
  stratifiedSample,
  systematicSample,
  clusterSample,
  mean,
  standardDeviation,
  standardErrorMean,
  confidenceIntervalMean,
  bootstrap,
  sampleSizeForMean,
  sampleSizeForProportion,
  createStrata,
  samplingPresets,
  getSamplingPresetById,
} from '@/utils/math/sampling'
import type {
  SamplingMethod,
  PopulationDistribution,
  PopulationConfig,
  SampleResult,
  ConfidenceInterval,
  BootstrapResult,
  SamplingPreset,
} from '@/utils/math/sampling'
import { createHistogram } from '@/utils/math/distributions'
import type { HistogramBin } from '@/utils/math/distributions'

// ============================================================================
// Types
// ============================================================================

export interface UseSamplingSimulatorOptions {
  /** Initial sampling method */
  initialMethod?: SamplingMethod
  /** Initial preset ID */
  initialPreset?: string
  /** Whether to sync state to URL */
  syncUrl?: boolean
}

export interface PopulationStats {
  mean: number
  stdDev: number
  min: number
  max: number
}

export interface SampleHistoryEntry {
  id: number
  values: number[]
  indices: number[]
  mean: number
  stdDev: number
  se: number
  ci: ConfidenceInterval
}

export interface CISimulationResult {
  id: number
  ci: ConfidenceInterval
  capturesTrueMean: boolean
}

// ============================================================================
// Composable
// ============================================================================

/**
 * Composable for managing sampling simulator state and calculations.
 * Provides population generation, sampling methods, CI simulation,
 * bootstrap, and sample size calculations with URL state sync.
 */
export function useSamplingSimulator(options: UseSamplingSimulatorOptions = {}) {
  const { initialMethod = 'simple', initialPreset, syncUrl = true } = options

  const route = useRoute()
  const router = useRouter()

  // ============================================================================
  // State
  // ============================================================================

  // Population state
  const populationDistribution = ref<PopulationDistribution>('normal')
  const populationSize = ref(500)
  const populationParams = ref<Record<string, number>>({ mu: 50, sigma: 15 })
  const population = ref<number[]>([])

  // Sampling state
  const samplingMethod = ref<SamplingMethod>(initialMethod)
  const sampleSize = ref(30)
  const numClusters = ref(5)
  const clustersToSelect = ref(2)
  const numStrata = ref(3)

  // Current sample
  const currentSample = ref<SampleResult | null>(null)

  // Sample history (for sampling distribution visualization)
  const sampleHistory = ref<SampleHistoryEntry[]>([])
  const maxHistorySize = 500

  // CI simulation state
  const confidenceLevel = ref(0.95)
  const ciSimulationResults = ref<CISimulationResult[]>([])

  // Bootstrap state
  const bootstrapIterations = ref(1000)
  const bootstrapResult = ref<BootstrapResult | null>(null)

  // Sample size calculator state
  const calcMarginOfError = ref(3)
  const calcStdDev = ref(15)
  const calcProportion = ref(0.5)

  // Animation state
  const isAnimating = ref(false)
  let animationTimer: ReturnType<typeof setTimeout> | null = null

  // URL sync state
  let isUpdatingFromUrl = false
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // ============================================================================
  // Computed Properties
  // ============================================================================

  /** Current population configuration */
  const populationConfig = computed<PopulationConfig>(() => ({
    size: populationSize.value,
    distribution: populationDistribution.value,
    params: populationParams.value,
  }))

  /** Population statistics */
  const populationStats = computed<PopulationStats | null>(() => {
    if (population.value.length === 0) return null
    return {
      mean: mean(population.value),
      stdDev: standardDeviation(population.value),
      min: Math.min(...population.value),
      max: Math.max(...population.value),
    }
  })

  /** True population mean (for CI coverage checking) */
  const trueMean = computed(() => populationStats.value?.mean ?? 0)

  /** Histogram of sample means from history */
  const samplingDistributionBins = computed<HistogramBin[]>(() => {
    if (sampleHistory.value.length < 2) return []
    const means = sampleHistory.value.map((s) => s.mean)
    return createHistogram(means, 30)
  })

  /** Standard error of sample means (empirical) */
  const empiricalSE = computed(() => {
    if (sampleHistory.value.length < 2) return 0
    const means = sampleHistory.value.map((s) => s.mean)
    return standardDeviation(means)
  })

  /** Theoretical standard error */
  const theoreticalSE = computed(() => {
    if (!populationStats.value) return 0
    return standardErrorMean(populationStats.value.stdDev, sampleSize.value)
  })

  /** CI coverage rate from simulation */
  const ciCoverageRate = computed(() => {
    if (ciSimulationResults.value.length === 0) return 0
    const captured = ciSimulationResults.value.filter((r) => r.capturesTrueMean).length
    return captured / ciSimulationResults.value.length
  })

  /** Sample size for mean estimation */
  const calculatedSampleSizeMean = computed(() => {
    try {
      return sampleSizeForMean(calcMarginOfError.value, calcStdDev.value, confidenceLevel.value)
    } catch {
      return null
    }
  })

  /** Sample size for proportion estimation */
  const calculatedSampleSizeProportion = computed(() => {
    try {
      return sampleSizeForProportion(
        calcMarginOfError.value / 100, // Convert percentage to decimal
        calcProportion.value,
        confidenceLevel.value
      )
    } catch {
      return null
    }
  })

  // ============================================================================
  // Methods - Population
  // ============================================================================

  /** Generate a new population */
  function generateNewPopulation() {
    population.value = generatePopulation(populationConfig.value)
    // Reset sample data when population changes
    resetSamples()
  }

  /** Set population distribution type */
  function setPopulationDistribution(dist: PopulationDistribution) {
    populationDistribution.value = dist
    // Set default params for distribution
    switch (dist) {
      case 'normal':
        populationParams.value = { mu: 50, sigma: 15 }
        break
      case 'uniform':
        populationParams.value = { a: 0, b: 100 }
        break
      case 'exponential':
        populationParams.value = { lambda: 0.02 }
        break
      case 'binomial':
        populationParams.value = { p: 0.5 }
        break
    }
    generateNewPopulation()
  }

  /** Set population size */
  function setPopulationSize(size: number) {
    populationSize.value = Math.max(10, Math.min(10000, size))
    generateNewPopulation()
  }

  /** Set population parameters */
  function setPopulationParams(params: Record<string, number>) {
    populationParams.value = { ...populationParams.value, ...params }
    generateNewPopulation()
  }

  // ============================================================================
  // Methods - Sampling
  // ============================================================================

  /** Set sampling method */
  function setSamplingMethod(method: SamplingMethod) {
    samplingMethod.value = method
  }

  /** Set sample size */
  function setSampleSize(size: number) {
    sampleSize.value = Math.max(2, Math.min(population.value.length, size))
  }

  /** Take a single sample from the population */
  function takeSample(): SampleResult | null {
    if (population.value.length === 0) {
      generateNewPopulation()
    }
    if (population.value.length === 0) return null

    let result: SampleResult

    switch (samplingMethod.value) {
      case 'simple':
        result = simpleRandomSample(population.value, sampleSize.value)
        break
      case 'stratified': {
        const strata = createStrata(population.value, numStrata.value)
        result = stratifiedSample(strata, sampleSize.value)
        break
      }
      case 'systematic':
        result = systematicSample(population.value, sampleSize.value)
        break
      case 'cluster':
        result = clusterSample(population.value, numClusters.value, clustersToSelect.value)
        break
    }

    currentSample.value = result

    // Calculate CI for this sample
    const ci = confidenceIntervalMean(
      result.mean,
      result.standardDeviation,
      result.values.length,
      confidenceLevel.value
    )

    // Add to history
    const entry: SampleHistoryEntry = {
      id: sampleHistory.value.length,
      values: result.values,
      indices: result.indices,
      mean: result.mean,
      stdDev: result.standardDeviation,
      se: result.standardError,
      ci,
    }

    sampleHistory.value.push(entry)

    // Limit history size
    if (sampleHistory.value.length > maxHistorySize) {
      sampleHistory.value = sampleHistory.value.slice(-maxHistorySize)
    }

    return result
  }

  /** Take multiple samples */
  function takeMultipleSamples(count: number) {
    for (let i = 0; i < count; i++) {
      takeSample()
    }
  }

  /** Reset sample history */
  function resetSamples() {
    currentSample.value = null
    sampleHistory.value = []
    ciSimulationResults.value = []
    bootstrapResult.value = null
  }

  // ============================================================================
  // Methods - CI Simulation
  // ============================================================================

  /** Run CI coverage simulation */
  function runCISimulation(numSamples: number) {
    if (population.value.length === 0) {
      generateNewPopulation()
    }

    const results: CISimulationResult[] = []
    const trueMeanValue = trueMean.value

    for (let i = 0; i < numSamples; i++) {
      const sample = simpleRandomSample(population.value, sampleSize.value)
      const ci = confidenceIntervalMean(
        sample.mean,
        sample.standardDeviation,
        sample.values.length,
        confidenceLevel.value
      )

      results.push({
        id: ciSimulationResults.value.length + i,
        ci,
        capturesTrueMean: ci.lower <= trueMeanValue && trueMeanValue <= ci.upper,
      })
    }

    ciSimulationResults.value.push(...results)
  }

  /** Reset CI simulation */
  function resetCISimulation() {
    ciSimulationResults.value = []
  }

  // ============================================================================
  // Methods - Bootstrap
  // ============================================================================

  /** Run bootstrap on current sample */
  function runBootstrap() {
    if (!currentSample.value || currentSample.value.values.length === 0) {
      takeSample()
    }
    if (!currentSample.value) return

    bootstrapResult.value = bootstrap(
      currentSample.value.values,
      bootstrapIterations.value,
      mean,
      confidenceLevel.value
    )
  }

  /** Set bootstrap iterations */
  function setBootstrapIterations(iterations: number) {
    bootstrapIterations.value = Math.max(100, Math.min(10000, iterations))
  }

  // ============================================================================
  // Methods - Animation
  // ============================================================================

  /** Start sampling animation */
  function startAnimation(interval: number = 100) {
    if (isAnimating.value) return

    isAnimating.value = true
    const animate = () => {
      if (!isAnimating.value) return
      takeSample()
      animationTimer = setTimeout(animate, interval)
    }
    animate()
  }

  /** Stop sampling animation */
  function stopAnimation() {
    isAnimating.value = false
    if (animationTimer) {
      clearTimeout(animationTimer)
      animationTimer = null
    }
  }

  // ============================================================================
  // Methods - Presets
  // ============================================================================

  /** Load a preset by ID */
  function loadPreset(presetId: string) {
    const preset = getSamplingPresetById(presetId)
    if (!preset) return

    populationDistribution.value = preset.populationConfig.distribution
    populationSize.value = preset.populationConfig.size
    populationParams.value = { ...preset.populationConfig.params }
    sampleSize.value = preset.sampleSize
    samplingMethod.value = 'simple'

    generateNewPopulation()
    resetSamples()
  }

  // ============================================================================
  // Methods - Sample Size Calculator
  // ============================================================================

  /** Set margin of error for calculator */
  function setCalcMarginOfError(moe: number) {
    calcMarginOfError.value = Math.max(0.1, moe)
  }

  /** Set standard deviation for calculator */
  function setCalcStdDev(sd: number) {
    calcStdDev.value = Math.max(0.1, sd)
  }

  /** Set proportion for calculator */
  function setCalcProportion(p: number) {
    calcProportion.value = Math.max(0.01, Math.min(0.99, p))
  }

  /** Set confidence level */
  function setConfidenceLevel(level: number) {
    confidenceLevel.value = Math.max(0.8, Math.min(0.99, level))
  }

  // ============================================================================
  // URL State Sync
  // ============================================================================

  function initFromUrl() {
    if (!syncUrl) return

    isUpdatingFromUrl = true

    const urlPreset = route.query.preset
    if (typeof urlPreset === 'string') {
      loadPreset(urlPreset)
    } else {
      // Parse individual params
      const method = route.query.method as string
      if (method && ['simple', 'stratified', 'systematic', 'cluster'].includes(method)) {
        samplingMethod.value = method as SamplingMethod
      }

      const n = parseInt(route.query.n as string, 10)
      if (!isNaN(n) && n > 0) {
        sampleSize.value = n
      }

      const conf = parseFloat(route.query.conf as string)
      if (!isNaN(conf) && conf > 0 && conf < 1) {
        confidenceLevel.value = conf
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

      // Only add non-default values
      if (samplingMethod.value !== 'simple') {
        query.method = samplingMethod.value
      }
      if (sampleSize.value !== 30) {
        query.n = sampleSize.value.toString()
      }
      if (confidenceLevel.value !== 0.95) {
        query.conf = confidenceLevel.value.toString()
      }

      // Preserve other query params
      const existingQuery = { ...route.query }
      delete existingQuery.method
      delete existingQuery.n
      delete existingQuery.conf
      delete existingQuery.preset

      const newQuery = { ...existingQuery, ...query }

      // Only update if changed
      if (JSON.stringify(newQuery) !== JSON.stringify(route.query)) {
        router.replace({ query: newQuery })
      }
    }, 300) // 300ms debounce per LL-015
  }

  // ============================================================================
  // Watchers and Lifecycle
  // ============================================================================

  if (syncUrl) {
    watch([samplingMethod, sampleSize, confidenceLevel], () => {
      updateUrl()
    })

    watch(
      () => route.query,
      () => {
        if (!isUpdatingFromUrl) {
          initFromUrl()
        }
      }
    )
  }

  // Initialize
  onMounted(() => {
    if (initialPreset) {
      loadPreset(initialPreset)
    } else {
      initFromUrl()
      generateNewPopulation()
    }
  })

  // Cleanup timers on unmount (LI-019)
  onUnmounted(() => {
    stopAnimation()
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State - Population
    populationDistribution,
    populationSize,
    populationParams,
    population,

    // State - Sampling
    samplingMethod,
    sampleSize,
    numClusters,
    clustersToSelect,
    numStrata,
    currentSample,
    sampleHistory,

    // State - CI Simulation
    confidenceLevel,
    ciSimulationResults,

    // State - Bootstrap
    bootstrapIterations,
    bootstrapResult,

    // State - Calculator
    calcMarginOfError,
    calcStdDev,
    calcProportion,

    // State - Animation
    isAnimating,

    // Computed
    populationConfig,
    populationStats,
    trueMean,
    samplingDistributionBins,
    empiricalSE,
    theoreticalSE,
    ciCoverageRate,
    calculatedSampleSizeMean,
    calculatedSampleSizeProportion,

    // Static data
    samplingPresets,

    // Methods - Population
    generateNewPopulation,
    setPopulationDistribution,
    setPopulationSize,
    setPopulationParams,

    // Methods - Sampling
    setSamplingMethod,
    setSampleSize,
    takeSample,
    takeMultipleSamples,
    resetSamples,

    // Methods - CI Simulation
    runCISimulation,
    resetCISimulation,

    // Methods - Bootstrap
    runBootstrap,
    setBootstrapIterations,

    // Methods - Animation
    startAnimation,
    stopAnimation,

    // Methods - Presets
    loadPreset,

    // Methods - Calculator
    setCalcMarginOfError,
    setCalcStdDev,
    setCalcProportion,
    setConfidenceLevel,
  }
}

// Re-export types for consumers
export type {
  SamplingMethod,
  PopulationDistribution,
  PopulationConfig,
  SampleResult,
  ConfidenceInterval,
  BootstrapResult,
  SamplingPreset,
}
