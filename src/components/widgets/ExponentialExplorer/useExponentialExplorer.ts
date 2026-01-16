import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  evaluateExponential,
  evaluateLogarithm,
  analyzeGrowthDecay,
  generateExponentialPoints,
  generateLogarithmPoints,
  isValidExponentialBase,
  compareComplexities,
  complexityFunctions,
} from '@/utils/math/exponential'
import type { GrowthDecayResult, ComplexityClass } from '@/utils/math/exponential'
import { getBasePreset, getScenarioPreset, isValidScenarioPresetId, findMatchingBasePreset } from './presets'
import type { FunctionType, ExplorerTab, BasePresetId, ScenarioPresetId } from './types'

interface UseExponentialExplorerOptions {
  /** Enable URL state syncing */
  syncUrl?: boolean
  /** Initial tab */
  initialTab?: ExplorerTab
  /** Initial function type */
  initialFunctionType?: FunctionType
  /** Initial base value */
  initialBase?: number
  /** Initial complexity n value */
  initialN?: number
}

export function useExponentialExplorer(options: UseExponentialExplorerOptions = {}) {
  const {
    syncUrl = false,
    initialTab = 'function',
    initialFunctionType = 'exponential',
    initialBase = 2,
    initialN = 10,
  } = options

  const route = useRoute()
  const router = useRouter()

  // State
  const activeTab = ref<ExplorerTab>(initialTab)
  const functionType = ref<FunctionType>(initialFunctionType)
  const base = ref(initialBase)
  const complexityN = ref(initialN)

  // Current matching base preset (null if custom)
  const currentBasePreset = computed<BasePresetId | null>(() => findMatchingBasePreset(base.value))

  // Initialize from URL or defaults
  function initializeState() {
    if (syncUrl) {
      const urlTab = route.query.tab as string
      const urlType = route.query.type as string
      const urlBase = route.query.base as string
      const urlN = route.query.n as string
      const urlScenario = route.query.scenario as string

      // Check for scenario preset first
      if (urlScenario && isValidScenarioPresetId(urlScenario)) {
        loadScenario(urlScenario)
        return
      }

      // Otherwise load individual params
      if (urlTab === 'function' || urlTab === 'complexity') {
        activeTab.value = urlTab
      }
      if (urlType === 'exponential' || urlType === 'logarithm') {
        functionType.value = urlType
      }
      if (urlBase !== undefined) {
        const parsedBase = parseFloat(urlBase)
        if (isValidExponentialBase(parsedBase)) {
          base.value = parsedBase
        }
      }
      if (urlN !== undefined) {
        const parsedN = parseInt(urlN, 10)
        if (parsedN >= 1 && parsedN <= 1000) {
          complexityN.value = parsedN
        }
      }
    }
  }

  // Load a base preset
  function loadBasePreset(presetId: BasePresetId) {
    const preset = getBasePreset(presetId)
    if (preset) {
      base.value = preset.value
    }
  }

  // Load a scenario preset
  function loadScenario(scenarioId: ScenarioPresetId) {
    const scenario = getScenarioPreset(scenarioId)
    if (scenario) {
      activeTab.value = 'function'
      functionType.value = scenario.functionType
      base.value = scenario.base
    }
  }

  // Set custom base
  function setCustomBase(value: number) {
    if (isValidExponentialBase(value)) {
      base.value = value
    }
  }

  // URL update with debounce
  let urlUpdateTimeout: ReturnType<typeof setTimeout> | null = null

  function updateUrl() {
    if (!syncUrl) return

    if (urlUpdateTimeout) {
      clearTimeout(urlUpdateTimeout)
    }

    urlUpdateTimeout = setTimeout(() => {
      const query: Record<string, string> = {
        tab: activeTab.value,
      }

      if (activeTab.value === 'function') {
        query.type = functionType.value
        query.base = base.value.toString()
      } else {
        query.n = complexityN.value.toString()
      }

      router.replace({ query })
    }, 300)
  }

  // Watch for changes and update URL
  watch([activeTab, functionType, base, complexityN], () => {
    updateUrl()
  })

  // Derived values for function explorer
  const growthDecayAnalysis = computed<GrowthDecayResult | null>(() => {
    if (!isValidExponentialBase(base.value)) return null
    return analyzeGrowthDecay(base.value)
  })

  const isGrowth = computed(() => base.value > 1)
  const isDecay = computed(() => base.value > 0 && base.value < 1)

  // Function for plotting
  const plotFunction = computed(() => {
    if (!isValidExponentialBase(base.value)) {
      return () => 0
    }
    if (functionType.value === 'exponential') {
      return (x: number) => evaluateExponential(base.value, x)
    } else {
      return (x: number) => {
        if (x <= 0) return NaN
        return evaluateLogarithm(base.value, x)
      }
    }
  })

  // Generate plot points
  const plotPoints = computed(() => {
    if (!isValidExponentialBase(base.value)) return []

    if (functionType.value === 'exponential') {
      return generateExponentialPoints(base.value, bounds.value.xMin, bounds.value.xMax)
    } else {
      return generateLogarithmPoints(base.value, bounds.value.xMin, bounds.value.xMax)
    }
  })

  // Key points for the function
  const keyPoints = computed(() => {
    if (!isValidExponentialBase(base.value)) return []

    if (functionType.value === 'exponential') {
      // For exponential: (0, 1) and (1, b)
      return [
        { x: 0, y: 1, label: '(0, 1)' },
        { x: 1, y: base.value, label: `(1, ${base.value.toFixed(2)})` },
      ]
    } else {
      // For logarithm: (1, 0) and (b, 1)
      return [
        { x: 1, y: 0, label: '(1, 0)' },
        { x: base.value, y: 1, label: `(${base.value.toFixed(2)}, 1)` },
      ]
    }
  })

  // Graph bounds
  const bounds = computed(() => {
    if (functionType.value === 'exponential') {
      // Exponential: show x from -3 to 5, y from -2 to 20 (or more for growth)
      const maxY = Math.min(50, Math.max(20, evaluateExponential(base.value, 4)))
      return {
        xMin: -3,
        xMax: 5,
        yMin: -2,
        yMax: Math.ceil(maxY / 5) * 5,
      }
    } else {
      // Logarithm: show x from 0.1 to 20, y from -4 to 4
      return {
        xMin: 0,
        xMax: 20,
        yMin: -4,
        yMax: 4,
      }
    }
  })

  // Formula display
  const formulaLatex = computed(() => {
    const baseStr =
      Math.abs(base.value - Math.E) < 0.001 ? 'e' : base.value.toFixed(base.value % 1 === 0 ? 0 : 2)

    if (functionType.value === 'exponential') {
      return `f(x) = ${baseStr}^x`
    } else {
      if (Math.abs(base.value - Math.E) < 0.001) {
        return `f(x) = \\ln(x)`
      } else if (base.value === 10) {
        return `f(x) = \\log_{10}(x)`
      } else if (base.value === 2) {
        return `f(x) = \\log_2(x)`
      }
      return `f(x) = \\log_{${baseStr}}(x)`
    }
  })

  // Complexity comparison derived values
  const complexityComparison = computed(() => {
    if (complexityN.value < 1) return null
    return compareComplexities(complexityN.value)
  })

  // Generate complexity curve points for each class
  const complexityCurvePoints = computed(() => {
    const classes: ComplexityClass[] = [
      'constant',
      'logarithmic',
      'linear',
      'linearithmic',
      'quadratic',
      'exponential',
    ]
    const result: Record<ComplexityClass, Array<{ x: number; y: number }>> = {} as Record<
      ComplexityClass,
      Array<{ x: number; y: number }>
    >

    // Max n for curve generation (limit for exponential)
    const maxN = Math.min(complexityN.value, 25)
    const samples = 50

    for (const cls of classes) {
      const points: Array<{ x: number; y: number }> = []
      const fn = complexityFunctions[cls]

      for (let i = 0; i <= samples; i++) {
        const x = 1 + (i / samples) * (maxN - 1)
        let y = fn(x)

        // Cap exponential to avoid huge values
        if (cls === 'exponential' && y > 1e9) {
          y = 1e9
        }

        if (Number.isFinite(y)) {
          points.push({ x, y })
        }
      }
      result[cls] = points
    }

    return result
  })

  // Y-axis max for complexity graph
  const complexityYMax = computed(() => {
    if (!complexityComparison.value) return 100

    const n = complexityN.value
    // For small n, use quadratic as max; for larger n, cap based on what's visible
    if (n <= 10) {
      return Math.max(100, n * n * 1.2)
    } else if (n <= 30) {
      // Cap at exponential or 10^9, whichever is smaller
      const expVal = Math.pow(2, n)
      return Math.min(expVal * 1.1, 1e9)
    } else {
      // For large n, just show up to quadratic scale
      return n * n * 1.5
    }
  })

  // Dynamic insight for complexity
  const complexityInsight = computed(() => {
    const n = complexityN.value
    const values = complexityComparison.value?.values

    if (!values) return ''

    if (n <= 10) {
      return `At small inputs, even O(2^n) is manageable at ${values.exponential.toLocaleString()} operations. But watch what happens as n grows...`
    } else if (n <= 30) {
      const expVsLinear = Math.round(values.exponential / values.linear)
      return `O(2^n) is now ${expVsLinear.toLocaleString()}x slower than O(n). This is why brute force doesn't scale.`
    } else if (n <= 100) {
      return `O(2^n) would take ${values.exponential.toExponential(2)} operations - more than atoms in the universe for n>265!`
    } else {
      const logVsN = Math.round(values.linear / values.logarithmic)
      return `O(log n) = ${values.logarithmic.toFixed(1)} vs O(n) = ${n}. Binary search is ${logVsN}x faster than linear search!`
    }
  })

  // Validation
  const isValidBase = computed(() => isValidExponentialBase(base.value))

  return {
    // State
    activeTab,
    functionType,
    base,
    complexityN,
    currentBasePreset,

    // Actions
    initializeState,
    loadBasePreset,
    loadScenario,
    setCustomBase,

    // Function explorer derived
    growthDecayAnalysis,
    isGrowth,
    isDecay,
    plotFunction,
    plotPoints,
    keyPoints,
    bounds,
    formulaLatex,
    isValidBase,

    // Complexity derived
    complexityComparison,
    complexityCurvePoints,
    complexityYMax,
    complexityInsight,
  }
}
