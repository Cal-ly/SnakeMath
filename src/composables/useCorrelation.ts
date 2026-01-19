import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  pearsonCorrelation,
  interpretCorrelation,
  linearRegression,
  calculateResiduals,
  analyzeResiduals,
  cooksDistance,
  identifyOutliers,
  correlationPresets,
  anscombesQuartet,
  getCorrelationPresetById,
  getAnscombeDatasetById,
  formatCorrelation,
  formatRSquared,
  formatRegressionEquation,
  regressionConfidenceIntervals,
} from '@/utils/math/correlation'
import type {
  Point,
  LinearRegressionResult,
  ResidualAnalysis,
  CorrelationPreset,
  RegressionConfidenceIntervals,
} from '@/utils/math/correlation'

// ============================================================================
// Types
// ============================================================================

export interface UseCorrelationOptions {
  /** Initial points to display */
  initialPoints?: Point[]
  /** Initial preset ID to load */
  initialPreset?: string
  /** Whether to sync state to URL */
  syncUrl?: boolean
}

export interface ResidualPoint {
  x: number
  residual: number
  predictedY: number
  actualY: number
}

// ============================================================================
// Composable
// ============================================================================

/**
 * Composable for managing correlation explorer state and calculations.
 * Provides scatter plot point management, correlation and regression statistics,
 * residual analysis, and URL state synchronization.
 */
export function useCorrelation(options: UseCorrelationOptions = {}) {
  const { initialPoints = [], initialPreset, syncUrl = true } = options

  const route = useRoute()
  const router = useRouter()

  // ============================================================================
  // State
  // ============================================================================

  // Points data
  const points = ref<Point[]>(initialPoints.length > 0 ? [...initialPoints] : [])

  // Display toggles
  const showRegressionLine = ref(true)
  const showResiduals = ref(false)
  const showConfidenceIntervals = ref(false)

  // Selected preset/dataset
  const selectedPreset = ref<string | null>(initialPreset ?? null)
  const selectedAnscombeId = ref<string | null>(null)

  // Active tab for the widget
  const activeTab = ref<'explorer' | 'anscombe' | 'presets'>('explorer')

  // Drag state (for point dragging)
  const isDragging = ref(false)
  const draggedPointIndex = ref<number | null>(null)

  // URL sync state
  let isUpdatingFromUrl = false
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // ============================================================================
  // Computed Properties - Basic Statistics
  // ============================================================================

  /** Extract x values from points */
  const xValues = computed(() => points.value.map((p) => p.x))

  /** Extract y values from points */
  const yValues = computed(() => points.value.map((p) => p.y))

  /** Number of points */
  const n = computed(() => points.value.length)

  /** Whether we have enough points for calculations (need at least 2) */
  const hasEnoughPoints = computed(() => n.value >= 2)

  /** Mean of x values */
  const xMean = computed(() => {
    if (n.value === 0) return 0
    return xValues.value.reduce((sum, x) => sum + x, 0) / n.value
  })

  /** Mean of y values */
  const yMean = computed(() => {
    if (n.value === 0) return 0
    return yValues.value.reduce((sum, y) => sum + y, 0) / n.value
  })

  // ============================================================================
  // Computed Properties - Correlation
  // ============================================================================

  /** Pearson correlation coefficient */
  const correlation = computed<number | null>(() => {
    if (!hasEnoughPoints.value) return null
    try {
      return pearsonCorrelation(xValues.value, yValues.value)
    } catch {
      return null
    }
  })

  /** Formatted correlation coefficient */
  const formattedCorrelation = computed(() => {
    if (correlation.value === null) return '-'
    return formatCorrelation(correlation.value)
  })

  /** Correlation interpretation (e.g., "strong positive") */
  const correlationInterpretation = computed(() => {
    if (correlation.value === null) return ''
    return interpretCorrelation(correlation.value)
  })

  /** R² (coefficient of determination) */
  const rSquared = computed<number | null>(() => {
    if (correlation.value === null) return null
    return correlation.value * correlation.value
  })

  /** Formatted R² */
  const formattedRSquared = computed(() => {
    if (rSquared.value === null) return '-'
    return formatRSquared(rSquared.value)
  })

  // ============================================================================
  // Computed Properties - Regression
  // ============================================================================

  /** Linear regression result */
  const regression = computed<LinearRegressionResult | null>(() => {
    if (!hasEnoughPoints.value) return null
    try {
      return linearRegression(xValues.value, yValues.value)
    } catch {
      return null
    }
  })

  /** Regression slope */
  const slope = computed(() => regression.value?.slope ?? 0)

  /** Regression intercept */
  const intercept = computed(() => regression.value?.intercept ?? 0)

  /** Formatted regression equation */
  const regressionEquation = computed(() => {
    if (regression.value === null) return '-'
    return formatRegressionEquation(regression.value.slope, regression.value.intercept)
  })

  /** Standard error of the estimate */
  const standardError = computed(() => regression.value?.standardError ?? 0)

  /** Confidence intervals for slope and intercept */
  const confidenceIntervals = computed<RegressionConfidenceIntervals | null>(() => {
    if (regression.value === null || n.value < 3) return null
    return regressionConfidenceIntervals(regression.value, n.value)
  })

  // ============================================================================
  // Computed Properties - Residuals
  // ============================================================================

  /** Residuals array */
  const residuals = computed<number[]>(() => {
    if (regression.value === null) return []
    return calculateResiduals(
      xValues.value,
      yValues.value,
      regression.value.slope,
      regression.value.intercept
    )
  })

  /** Residual analysis with statistics */
  const residualAnalysis = computed<ResidualAnalysis | null>(() => {
    if (regression.value === null) return null
    return analyzeResiduals(
      xValues.value,
      yValues.value,
      regression.value.slope,
      regression.value.intercept
    )
  })

  /** Residual points for plotting */
  const residualPoints = computed<ResidualPoint[]>(() => {
    if (regression.value === null) return []
    const { slope, intercept } = regression.value
    return points.value.map((p, i) => ({
      x: p.x,
      residual: residuals.value[i] ?? 0,
      predictedY: slope * p.x + intercept,
      actualY: p.y,
    }))
  })

  // ============================================================================
  // Computed Properties - Outliers
  // ============================================================================

  /** Cook's distance for each point */
  const cookDistances = computed<number[]>(() => {
    if (!hasEnoughPoints.value || n.value < 3) return []
    try {
      return cooksDistance(xValues.value, yValues.value)
    } catch {
      return []
    }
  })

  /** Indices of potential outliers */
  const outlierIndices = computed<number[]>(() => {
    if (!hasEnoughPoints.value || n.value < 3) return []
    try {
      return identifyOutliers(xValues.value, yValues.value, 2)
    } catch {
      return []
    }
  })

  /** Whether a point is an outlier */
  const isOutlier = computed(() => {
    const set = new Set(outlierIndices.value)
    return (index: number) => set.has(index)
  })

  // ============================================================================
  // Computed Properties - Data Bounds
  // ============================================================================

  /** Minimum x value */
  const xMin = computed(() => {
    if (n.value === 0) return 0
    return Math.min(...xValues.value)
  })

  /** Maximum x value */
  const xMax = computed(() => {
    if (n.value === 0) return 10
    return Math.max(...xValues.value)
  })

  /** Minimum y value */
  const yMin = computed(() => {
    if (n.value === 0) return 0
    return Math.min(...yValues.value)
  })

  /** Maximum y value */
  const yMax = computed(() => {
    if (n.value === 0) return 10
    return Math.max(...yValues.value)
  })

  /** Data range with padding for visualization */
  const dataRange = computed(() => {
    const xPadding = Math.max((xMax.value - xMin.value) * 0.1, 1)
    const yPadding = Math.max((yMax.value - yMin.value) * 0.1, 1)
    return {
      xMin: xMin.value - xPadding,
      xMax: xMax.value + xPadding,
      yMin: yMin.value - yPadding,
      yMax: yMax.value + yPadding,
    }
  })

  // ============================================================================
  // Computed Properties - Selected Preset
  // ============================================================================

  /** Currently selected preset data */
  const currentPreset = computed<CorrelationPreset | null>(() => {
    if (!selectedPreset.value) return null
    return getCorrelationPresetById(selectedPreset.value) ?? null
  })

  /** Currently selected Anscombe dataset */
  const currentAnscombeDataset = computed(() => {
    if (!selectedAnscombeId.value) return null
    return getAnscombeDatasetById(selectedAnscombeId.value) ?? null
  })

  // ============================================================================
  // Methods - Point Management
  // ============================================================================

  /** Add a new point */
  function addPoint(x: number, y: number) {
    points.value = [...points.value, { x, y }]
    updateUrl()
  }

  /** Remove a point by index */
  function removePoint(index: number) {
    if (index < 0 || index >= n.value) return
    points.value = points.value.filter((_, i) => i !== index)
    updateUrl()
  }

  /** Move/update a point position */
  function movePoint(index: number, x: number, y: number) {
    if (index < 0 || index >= n.value) return
    const newPoints = [...points.value]
    newPoints[index] = { x, y }
    points.value = newPoints
    updateUrl()
  }

  /** Clear all points */
  function clearPoints() {
    points.value = []
    selectedPreset.value = null
    selectedAnscombeId.value = null
    updateUrl()
  }

  /** Set all points at once */
  function setPoints(newPoints: Point[]) {
    points.value = [...newPoints]
    updateUrl()
  }

  // ============================================================================
  // Methods - Drag Handling
  // ============================================================================

  /** Start dragging a point */
  function startDrag(index: number) {
    isDragging.value = true
    draggedPointIndex.value = index
  }

  /** Update position while dragging */
  function drag(x: number, y: number) {
    if (!isDragging.value || draggedPointIndex.value === null) return
    movePoint(draggedPointIndex.value, x, y)
  }

  /** End dragging */
  function endDrag() {
    isDragging.value = false
    draggedPointIndex.value = null
    updateUrl()
  }

  // ============================================================================
  // Methods - Presets
  // ============================================================================

  /** Load a preset by ID */
  function loadPreset(presetId: string) {
    const preset = getCorrelationPresetById(presetId)
    if (!preset) return

    selectedPreset.value = presetId
    selectedAnscombeId.value = null
    points.value = [...preset.points]
    activeTab.value = 'explorer'
    updateUrl()
  }

  /** Load an Anscombe's quartet dataset by ID */
  function loadAnscombeDataset(datasetId: string) {
    const dataset = getAnscombeDatasetById(datasetId)
    if (!dataset) return

    selectedAnscombeId.value = datasetId
    selectedPreset.value = null
    points.value = [...dataset.points]
    activeTab.value = 'anscombe'
    updateUrl()
  }

  /** Generate random points */
  function generateRandomPoints(count: number = 10, correlation: number = 0.7) {
    // Generate points with approximate target correlation
    const newPoints: Point[] = []
    const xMin = 0
    const xMax = 10

    // Generate x values uniformly
    for (let i = 0; i < count; i++) {
      const x = xMin + (xMax - xMin) * (i / (count - 1))
      // y = correlation * x + noise
      const noise = (1 - Math.abs(correlation)) * (Math.random() - 0.5) * 5
      const baseY = x * (correlation > 0 ? 1 : -1)
      newPoints.push({ x, y: baseY + noise })
    }

    selectedPreset.value = null
    selectedAnscombeId.value = null
    points.value = newPoints
    updateUrl()
  }

  // ============================================================================
  // Methods - Display Toggles
  // ============================================================================

  function toggleRegressionLine() {
    showRegressionLine.value = !showRegressionLine.value
  }

  function toggleResiduals() {
    showResiduals.value = !showResiduals.value
  }

  function toggleConfidenceIntervals() {
    showConfidenceIntervals.value = !showConfidenceIntervals.value
  }

  function setActiveTab(tab: 'explorer' | 'anscombe' | 'presets') {
    activeTab.value = tab
    updateUrl()
  }

  // ============================================================================
  // URL State Sync
  // ============================================================================

  function initFromUrl() {
    if (!syncUrl) return

    isUpdatingFromUrl = true

    const presetParam = route.query.preset
    const anscombeParam = route.query.anscombe
    const tabParam = route.query.tab

    // Load preset from URL
    if (typeof presetParam === 'string' && presetParam) {
      loadPreset(presetParam)
    } else if (typeof anscombeParam === 'string' && anscombeParam) {
      loadAnscombeDataset(anscombeParam)
    }

    // Set tab from URL
    if (typeof tabParam === 'string' && ['explorer', 'anscombe', 'presets'].includes(tabParam)) {
      activeTab.value = tabParam as 'explorer' | 'anscombe' | 'presets'
    }

    // Parse custom points from URL if present
    const pointsParam = route.query.points
    if (typeof pointsParam === 'string' && pointsParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(pointsParam))
        if (Array.isArray(parsed) && parsed.every((p) => typeof p.x === 'number' && typeof p.y === 'number')) {
          points.value = parsed
          selectedPreset.value = null
          selectedAnscombeId.value = null
        }
      } catch {
        // Invalid points param, ignore
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

      // Add preset or anscombe to URL
      if (selectedPreset.value) {
        query.preset = selectedPreset.value
      } else if (selectedAnscombeId.value) {
        query.anscombe = selectedAnscombeId.value
      } else if (points.value.length > 0) {
        // Only encode custom points if not using a preset
        // Limit to reasonable number to avoid URL length issues
        if (points.value.length <= 50) {
          query.points = encodeURIComponent(JSON.stringify(points.value))
        }
      }

      // Add tab to URL if not default
      if (activeTab.value !== 'explorer') {
        query.tab = activeTab.value
      }

      // Preserve other query params
      const existingQuery = { ...route.query }
      delete existingQuery.preset
      delete existingQuery.anscombe
      delete existingQuery.points
      delete existingQuery.tab

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
    // State
    points,
    showRegressionLine,
    showResiduals,
    showConfidenceIntervals,
    selectedPreset,
    selectedAnscombeId,
    activeTab,
    isDragging,
    draggedPointIndex,

    // Computed - Basic Statistics
    xValues,
    yValues,
    n,
    hasEnoughPoints,
    xMean,
    yMean,

    // Computed - Correlation
    correlation,
    formattedCorrelation,
    correlationInterpretation,
    rSquared,
    formattedRSquared,

    // Computed - Regression
    regression,
    slope,
    intercept,
    regressionEquation,
    standardError,
    confidenceIntervals,

    // Computed - Residuals
    residuals,
    residualAnalysis,
    residualPoints,

    // Computed - Outliers
    cookDistances,
    outlierIndices,
    isOutlier,

    // Computed - Data Bounds
    xMin,
    xMax,
    yMin,
    yMax,
    dataRange,

    // Computed - Presets
    currentPreset,
    currentAnscombeDataset,

    // Static data
    correlationPresets,
    anscombesQuartet,

    // Methods - Point Management
    addPoint,
    removePoint,
    movePoint,
    clearPoints,
    setPoints,

    // Methods - Drag Handling
    startDrag,
    drag,
    endDrag,

    // Methods - Presets
    loadPreset,
    loadAnscombeDataset,
    generateRandomPoints,

    // Methods - Display Toggles
    toggleRegressionLine,
    toggleResiduals,
    toggleConfidenceIntervals,
    setActiveTab,
  }
}

// Re-export types for consumers
export type {
  Point,
  LinearRegressionResult,
  ResidualAnalysis,
  CorrelationPreset,
  RegressionConfidenceIntervals,
}
