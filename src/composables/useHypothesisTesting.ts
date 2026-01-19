import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  oneSampleTTest,
  twoSampleTTest,
  onePropZTest,
  twoPropZTest,
  calculatePower,
  sampleSizeForPower,
  sampleSizeForProportions,
  generatePowerCurve,
  cohensD,
  cohensDTwoGroups,
  cohensH,
  interpretCohensD,
  interpretCohensH,
  tDistributionPdf,
  tCriticalValue,
  hypothesisTestPresets,
  getHypothesisTestPresetById,
  formatPValue,
  getSignificanceStars,
  describeTestResult,
  checkTestAssumptions,
} from '@/utils/math/hypothesis'
import type {
  TestType,
  AlternativeHypothesis,
  TTestResult,
  ZTestResult,
  HypothesisTestPreset,
} from '@/utils/math/hypothesis'
import { standardNormalPdf, standardNormalCdf } from '@/utils/math/distributions'

// ============================================================================
// Types
// ============================================================================

export interface UseHypothesisTestingOptions {
  /** Initial test type */
  initialTestType?: TestType
  /** Initial preset ID */
  initialPreset?: string
  /** Whether to sync state to URL */
  syncUrl?: boolean
}

export interface TypeErrorDemoState {
  alpha: number
  power: number
  effectSize: number
  sampleSize: number
}

export interface DistributionCurvePoint {
  x: number
  y: number
}

// ============================================================================
// Composable
// ============================================================================

/**
 * Composable for managing hypothesis testing simulator state and calculations.
 * Provides test execution, p-value visualization, Type I/II error demonstration,
 * power analysis, and effect size calculations with URL state sync.
 */
export function useHypothesisTesting(options: UseHypothesisTestingOptions = {}) {
  const { initialTestType = 'two-sample-t', initialPreset, syncUrl = true } = options

  const route = useRoute()
  const router = useRouter()

  // ============================================================================
  // State - Test Configuration
  // ============================================================================

  const testType = ref<TestType>(initialTestType)
  const alternative = ref<AlternativeHypothesis>('two-sided')
  const alpha = ref(0.05)

  // ============================================================================
  // State - One-Sample T-Test
  // ============================================================================

  const oneSampleMean = ref(105)
  const oneSampleStdDev = ref(15)
  const oneSampleN = ref(30)
  const oneSampleHypothesized = ref(100)

  // ============================================================================
  // State - Two-Sample T-Test
  // ============================================================================

  const twoSampleMean1 = ref(85)
  const twoSampleStdDev1 = ref(10)
  const twoSampleN1 = ref(30)
  const twoSampleMean2 = ref(80)
  const twoSampleStdDev2 = ref(12)
  const twoSampleN2 = ref(35)

  // ============================================================================
  // State - One-Proportion Z-Test
  // ============================================================================

  const onePropSuccesses = ref(55)
  const onePropN = ref(100)
  const onePropHypothesized = ref(0.5)

  // ============================================================================
  // State - Two-Proportion Z-Test
  // ============================================================================

  const twoPropSuccesses1 = ref(60)
  const twoPropN1 = ref(100)
  const twoPropSuccesses2 = ref(45)
  const twoPropN2 = ref(100)

  // ============================================================================
  // State - Type I/II Error Demo
  // ============================================================================

  const typeErrorAlpha = ref(0.05)
  const typeErrorEffectSize = ref(0.5)
  const typeErrorSampleSize = ref(50)

  // ============================================================================
  // State - Power Analysis
  // ============================================================================

  const powerEffectSize = ref(0.5)
  const powerDesired = ref(0.8)
  const powerTestType = ref<'one-sample' | 'two-sample'>('two-sample')

  // ============================================================================
  // State - UI
  // ============================================================================

  const activeTab = ref<'test' | 'type-errors' | 'power'>('test')

  // URL sync state
  let isUpdatingFromUrl = false
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // ============================================================================
  // Computed Properties - Test Results
  // ============================================================================

  /** Current test result */
  const testResult = computed<TTestResult | ZTestResult | null>(() => {
    try {
      switch (testType.value) {
        case 'one-sample-t':
          return oneSampleTTest({
            sampleMean: oneSampleMean.value,
            sampleStdDev: oneSampleStdDev.value,
            sampleSize: oneSampleN.value,
            hypothesizedMean: oneSampleHypothesized.value,
            alternative: alternative.value,
            alpha: alpha.value,
          })
        case 'two-sample-t':
          return twoSampleTTest({
            mean1: twoSampleMean1.value,
            stdDev1: twoSampleStdDev1.value,
            n1: twoSampleN1.value,
            mean2: twoSampleMean2.value,
            stdDev2: twoSampleStdDev2.value,
            n2: twoSampleN2.value,
            alternative: alternative.value,
            alpha: alpha.value,
          })
        case 'one-prop-z':
          return onePropZTest({
            successes: onePropSuccesses.value,
            sampleSize: onePropN.value,
            hypothesizedProportion: onePropHypothesized.value,
            alternative: alternative.value,
            alpha: alpha.value,
          })
        case 'two-prop-z':
          return twoPropZTest({
            successes1: twoPropSuccesses1.value,
            n1: twoPropN1.value,
            successes2: twoPropSuccesses2.value,
            n2: twoPropN2.value,
            alternative: alternative.value,
            alpha: alpha.value,
          })
      }
    } catch {
      return null
    }
  })

  /** Is the current test a t-test */
  const isTTest = computed(() =>
    testType.value === 'one-sample-t' || testType.value === 'two-sample-t'
  )

  /** Current test statistic (t or z) */
  const testStatistic = computed(() => {
    if (!testResult.value) return 0
    if ('tStatistic' in testResult.value) {
      return testResult.value.tStatistic
    }
    return testResult.value.zStatistic
  })

  /** Current degrees of freedom (only for t-tests) */
  const degreesOfFreedom = computed(() => {
    if (!testResult.value || !('degreesOfFreedom' in testResult.value)) return null
    return testResult.value.degreesOfFreedom
  })

  /** Formatted p-value */
  const formattedPValue = computed(() => {
    if (!testResult.value) return '-'
    return formatPValue(testResult.value.pValue)
  })

  /** Significance stars */
  const significanceStars = computed(() => {
    if (!testResult.value) return ''
    return getSignificanceStars(testResult.value.pValue)
  })

  /** Test result description */
  const resultDescription = computed(() => {
    if (!testResult.value) return ''
    return describeTestResult(testResult.value)
  })

  /** Assumption check warnings */
  const assumptionWarnings = computed(() => {
    const data: Record<string, number> = {}

    switch (testType.value) {
      case 'one-sample-t':
        data.sampleSize = oneSampleN.value
        break
      case 'two-sample-t':
        data.n1 = twoSampleN1.value
        data.n2 = twoSampleN2.value
        break
      case 'one-prop-z':
        data.sampleSize = onePropN.value
        data.hypothesizedProportion = onePropHypothesized.value
        break
      case 'two-prop-z':
        data.successes1 = twoPropSuccesses1.value
        data.n1 = twoPropN1.value
        data.successes2 = twoPropSuccesses2.value
        data.n2 = twoPropN2.value
        break
    }

    return checkTestAssumptions(testType.value, data).warnings
  })

  // ============================================================================
  // Computed Properties - Distribution Visualization
  // ============================================================================

  /** Critical value(s) for visualization */
  const criticalValues = computed(() => {
    if (isTTest.value && degreesOfFreedom.value) {
      const tCrit = tCriticalValue(degreesOfFreedom.value, alpha.value, true)
      switch (alternative.value) {
        case 'two-sided':
          return { lower: -tCrit, upper: tCrit }
        case 'less':
          return { lower: -tCrit, upper: null }
        case 'greater':
          return { lower: null, upper: tCrit }
      }
    } else {
      // Z-test critical values
      const zCrit = 1.96 // For alpha = 0.05
      switch (alternative.value) {
        case 'two-sided':
          return { lower: -zCrit, upper: zCrit }
        case 'less':
          return { lower: -zCrit, upper: null }
        case 'greater':
          return { lower: null, upper: zCrit }
      }
    }
  })

  /** Distribution curve points for visualization */
  const distributionCurve = computed<DistributionCurvePoint[]>(() => {
    const points: DistributionCurvePoint[] = []
    const range = 4 // ±4 standard units

    for (let i = -range; i <= range; i += 0.05) {
      let y: number
      if (isTTest.value && degreesOfFreedom.value) {
        y = tDistributionPdf(i, degreesOfFreedom.value)
      } else {
        y = standardNormalPdf(i)
      }
      points.push({ x: i, y })
    }

    return points
  })

  /** Maximum y value for distribution curve */
  const maxCurveY = computed(() => {
    if (distributionCurve.value.length === 0) return 0.4
    return Math.max(...distributionCurve.value.map((p) => p.y))
  })

  // ============================================================================
  // Computed Properties - Type I/II Error Demo
  // ============================================================================

  /** Type II error rate (beta) */
  const beta = computed(() => {
    const power = calculatePower(
      typeErrorEffectSize.value,
      typeErrorSampleSize.value,
      typeErrorAlpha.value,
      'two-sample'
    )
    return 1 - power
  })

  /** Power (1 - beta) */
  const typeErrorPower = computed(() => {
    return calculatePower(
      typeErrorEffectSize.value,
      typeErrorSampleSize.value,
      typeErrorAlpha.value,
      'two-sample'
    )
  })

  /** Null distribution curve */
  const nullDistributionCurve = computed<DistributionCurvePoint[]>(() => {
    const points: DistributionCurvePoint[] = []
    const stdDev = 1 / Math.sqrt(typeErrorSampleSize.value / 2)

    for (let x = -4; x <= 4; x += 0.05) {
      const y = standardNormalPdf(x / stdDev) / stdDev
      points.push({ x, y })
    }

    return points
  })

  /** Alternative distribution curve (shifted by effect size) */
  const alternativeDistributionCurve = computed<DistributionCurvePoint[]>(() => {
    const points: DistributionCurvePoint[] = []
    const shift = typeErrorEffectSize.value
    const stdDev = 1 / Math.sqrt(typeErrorSampleSize.value / 2)

    for (let x = -4; x <= 4 + shift; x += 0.05) {
      const y = standardNormalPdf((x - shift) / stdDev) / stdDev
      points.push({ x, y })
    }

    return points
  })

  // ============================================================================
  // Computed Properties - Power Analysis
  // ============================================================================

  /** Required sample size for desired power */
  const requiredSampleSize = computed(() => {
    try {
      return sampleSizeForPower(
        powerEffectSize.value,
        powerDesired.value,
        alpha.value,
        powerTestType.value
      )
    } catch {
      return null
    }
  })

  /** Power curve data */
  const powerCurve = computed(() => {
    return generatePowerCurve(powerEffectSize.value, alpha.value, powerTestType.value, 300)
  })

  /** Sample size to achieve 80% power */
  const sampleSizeFor80Power = computed(() => {
    try {
      return sampleSizeForPower(powerEffectSize.value, 0.8, alpha.value, powerTestType.value)
    } catch {
      return null
    }
  })

  /** Sample size to achieve 90% power */
  const sampleSizeFor90Power = computed(() => {
    try {
      return sampleSizeForPower(powerEffectSize.value, 0.9, alpha.value, powerTestType.value)
    } catch {
      return null
    }
  })

  // ============================================================================
  // Methods - Test Configuration
  // ============================================================================

  /** Set test type */
  function setTestType(type: TestType) {
    testType.value = type
  }

  /** Set alternative hypothesis */
  function setAlternative(alt: AlternativeHypothesis) {
    alternative.value = alt
  }

  /** Set significance level (alpha) */
  function setAlpha(value: number) {
    alpha.value = Math.max(0.001, Math.min(0.2, value))
  }

  /** Set active tab */
  function setActiveTab(tab: 'test' | 'type-errors' | 'power') {
    activeTab.value = tab
  }

  // ============================================================================
  // Methods - One-Sample T-Test
  // ============================================================================

  function setOneSampleMean(value: number) {
    oneSampleMean.value = value
  }

  function setOneSampleStdDev(value: number) {
    oneSampleStdDev.value = Math.max(0.01, value)
  }

  function setOneSampleN(value: number) {
    oneSampleN.value = Math.max(2, Math.round(value))
  }

  function setOneSampleHypothesized(value: number) {
    oneSampleHypothesized.value = value
  }

  // ============================================================================
  // Methods - Two-Sample T-Test
  // ============================================================================

  function setTwoSampleMean1(value: number) {
    twoSampleMean1.value = value
  }

  function setTwoSampleStdDev1(value: number) {
    twoSampleStdDev1.value = Math.max(0.01, value)
  }

  function setTwoSampleN1(value: number) {
    twoSampleN1.value = Math.max(2, Math.round(value))
  }

  function setTwoSampleMean2(value: number) {
    twoSampleMean2.value = value
  }

  function setTwoSampleStdDev2(value: number) {
    twoSampleStdDev2.value = Math.max(0.01, value)
  }

  function setTwoSampleN2(value: number) {
    twoSampleN2.value = Math.max(2, Math.round(value))
  }

  // ============================================================================
  // Methods - One-Proportion Z-Test
  // ============================================================================

  function setOnePropSuccesses(value: number) {
    onePropSuccesses.value = Math.max(0, Math.min(Math.round(value), onePropN.value))
  }

  function setOnePropN(value: number) {
    const newN = Math.max(1, Math.round(value))
    onePropN.value = newN
    // Adjust successes if needed
    if (onePropSuccesses.value > newN) {
      onePropSuccesses.value = newN
    }
  }

  function setOnePropHypothesized(value: number) {
    onePropHypothesized.value = Math.max(0.001, Math.min(0.999, value))
  }

  // ============================================================================
  // Methods - Two-Proportion Z-Test
  // ============================================================================

  function setTwoPropSuccesses1(value: number) {
    twoPropSuccesses1.value = Math.max(0, Math.min(Math.round(value), twoPropN1.value))
  }

  function setTwoPropN1(value: number) {
    const newN = Math.max(1, Math.round(value))
    twoPropN1.value = newN
    if (twoPropSuccesses1.value > newN) {
      twoPropSuccesses1.value = newN
    }
  }

  function setTwoPropSuccesses2(value: number) {
    twoPropSuccesses2.value = Math.max(0, Math.min(Math.round(value), twoPropN2.value))
  }

  function setTwoPropN2(value: number) {
    const newN = Math.max(1, Math.round(value))
    twoPropN2.value = newN
    if (twoPropSuccesses2.value > newN) {
      twoPropSuccesses2.value = newN
    }
  }

  // ============================================================================
  // Methods - Type Error Demo
  // ============================================================================

  function setTypeErrorAlpha(value: number) {
    typeErrorAlpha.value = Math.max(0.001, Math.min(0.2, value))
  }

  function setTypeErrorEffectSize(value: number) {
    typeErrorEffectSize.value = Math.max(0.1, Math.min(2, value))
  }

  function setTypeErrorSampleSize(value: number) {
    typeErrorSampleSize.value = Math.max(10, Math.min(500, Math.round(value)))
  }

  // ============================================================================
  // Methods - Power Analysis
  // ============================================================================

  function setPowerEffectSize(value: number) {
    powerEffectSize.value = Math.max(0.1, Math.min(2, value))
  }

  function setPowerDesired(value: number) {
    powerDesired.value = Math.max(0.5, Math.min(0.99, value))
  }

  function setPowerTestType(type: 'one-sample' | 'two-sample') {
    powerTestType.value = type
  }

  // ============================================================================
  // Methods - Presets
  // ============================================================================

  /** Load a preset by ID */
  function loadPreset(presetId: string) {
    const preset = getHypothesisTestPresetById(presetId)
    if (!preset) return

    testType.value = preset.testType
    alternative.value = 'two-sided'
    alpha.value = 0.05

    const data = preset.data

    switch (preset.testType) {
      case 'one-sample-t':
        oneSampleMean.value = data.sampleMean ?? 100
        oneSampleStdDev.value = data.sampleStdDev ?? 15
        oneSampleN.value = data.sampleSize ?? 30
        oneSampleHypothesized.value = data.hypothesizedMean ?? 100
        break
      case 'two-sample-t':
        twoSampleMean1.value = data.mean1 ?? 85
        twoSampleStdDev1.value = data.stdDev1 ?? 10
        twoSampleN1.value = data.n1 ?? 30
        twoSampleMean2.value = data.mean2 ?? 80
        twoSampleStdDev2.value = data.stdDev2 ?? 12
        twoSampleN2.value = data.n2 ?? 35
        break
      case 'one-prop-z':
        onePropSuccesses.value = data.successes ?? 55
        onePropN.value = data.sampleSize ?? 100
        onePropHypothesized.value = data.hypothesizedProportion ?? 0.5
        break
      case 'two-prop-z':
        twoPropSuccesses1.value = data.successes1 ?? 60
        twoPropN1.value = data.n1 ?? 100
        twoPropSuccesses2.value = data.successes2 ?? 45
        twoPropN2.value = data.n2 ?? 100
        break
    }
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
      const type = route.query.type as string
      if (type && ['one-sample-t', 'two-sample-t', 'one-prop-z', 'two-prop-z'].includes(type)) {
        testType.value = type as TestType
      }

      const alt = route.query.alt as string
      if (alt && ['two-sided', 'less', 'greater'].includes(alt)) {
        alternative.value = alt as AlternativeHypothesis
      }

      const alphaParam = parseFloat(route.query.alpha as string)
      if (!isNaN(alphaParam) && alphaParam > 0 && alphaParam < 1) {
        alpha.value = alphaParam
      }

      const tab = route.query.tab as string
      if (tab && ['test', 'type-errors', 'power'].includes(tab)) {
        activeTab.value = tab as 'test' | 'type-errors' | 'power'
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
      if (testType.value !== 'two-sample-t') {
        query.type = testType.value
      }
      if (alternative.value !== 'two-sided') {
        query.alt = alternative.value
      }
      if (alpha.value !== 0.05) {
        query.alpha = alpha.value.toString()
      }
      if (activeTab.value !== 'test') {
        query.tab = activeTab.value
      }

      // Preserve other query params
      const existingQuery = { ...route.query }
      delete existingQuery.type
      delete existingQuery.alt
      delete existingQuery.alpha
      delete existingQuery.tab
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
    watch([testType, alternative, alpha, activeTab], () => {
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
    }
  })

  // Cleanup timers on unmount (LI-019)
  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State - Test Configuration
    testType,
    alternative,
    alpha,
    activeTab,

    // State - One-Sample T-Test
    oneSampleMean,
    oneSampleStdDev,
    oneSampleN,
    oneSampleHypothesized,

    // State - Two-Sample T-Test
    twoSampleMean1,
    twoSampleStdDev1,
    twoSampleN1,
    twoSampleMean2,
    twoSampleStdDev2,
    twoSampleN2,

    // State - One-Proportion Z-Test
    onePropSuccesses,
    onePropN,
    onePropHypothesized,

    // State - Two-Proportion Z-Test
    twoPropSuccesses1,
    twoPropN1,
    twoPropSuccesses2,
    twoPropN2,

    // State - Type Error Demo
    typeErrorAlpha,
    typeErrorEffectSize,
    typeErrorSampleSize,

    // State - Power Analysis
    powerEffectSize,
    powerDesired,
    powerTestType,

    // Computed - Test Results
    testResult,
    isTTest,
    testStatistic,
    degreesOfFreedom,
    formattedPValue,
    significanceStars,
    resultDescription,
    assumptionWarnings,

    // Computed - Distribution Visualization
    criticalValues,
    distributionCurve,
    maxCurveY,

    // Computed - Type I/II Error Demo
    beta,
    typeErrorPower,
    nullDistributionCurve,
    alternativeDistributionCurve,

    // Computed - Power Analysis
    requiredSampleSize,
    powerCurve,
    sampleSizeFor80Power,
    sampleSizeFor90Power,

    // Static data
    hypothesisTestPresets,

    // Methods - Test Configuration
    setTestType,
    setAlternative,
    setAlpha,
    setActiveTab,

    // Methods - One-Sample T-Test
    setOneSampleMean,
    setOneSampleStdDev,
    setOneSampleN,
    setOneSampleHypothesized,

    // Methods - Two-Sample T-Test
    setTwoSampleMean1,
    setTwoSampleStdDev1,
    setTwoSampleN1,
    setTwoSampleMean2,
    setTwoSampleStdDev2,
    setTwoSampleN2,

    // Methods - One-Proportion Z-Test
    setOnePropSuccesses,
    setOnePropN,
    setOnePropHypothesized,

    // Methods - Two-Proportion Z-Test
    setTwoPropSuccesses1,
    setTwoPropN1,
    setTwoPropSuccesses2,
    setTwoPropN2,

    // Methods - Type Error Demo
    setTypeErrorAlpha,
    setTypeErrorEffectSize,
    setTypeErrorSampleSize,

    // Methods - Power Analysis
    setPowerEffectSize,
    setPowerDesired,
    setPowerTestType,

    // Methods - Presets
    loadPreset,
  }
}

// Re-export types for consumers
export type {
  TestType,
  AlternativeHypothesis,
  TTestResult,
  ZTestResult,
  HypothesisTestPreset,
}
