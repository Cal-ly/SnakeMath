/**
 * Statistics utility functions.
 * Includes descriptive statistics, quartiles, outlier detection, and histogram generation.
 */

// ============================================================================
// Types
// ============================================================================

/** Basic descriptive statistics */
export interface DescriptiveStats {
  /** Number of values */
  count: number
  /** Sum of all values */
  sum: number
  /** Arithmetic mean (sum / count) */
  mean: number
  /** Middle value when sorted */
  median: number
  /** Most frequent value(s) - can have multiple modes */
  mode: number[]
  /** Smallest value */
  min: number
  /** Largest value */
  max: number
  /** Difference between max and min */
  range: number
}

/** Measures of spread/dispersion */
export interface SpreadStats {
  /** Population variance (divide by n) */
  variance: number
  /** Sample variance (divide by n-1) */
  sampleVariance: number
  /** Population standard deviation */
  stdDev: number
  /** Sample standard deviation */
  sampleStdDev: number
}

/** Quartile values for box plots */
export interface Quartiles {
  /** 25th percentile */
  q1: number
  /** 50th percentile (median) */
  q2: number
  /** 75th percentile */
  q3: number
  /** Interquartile range (Q3 - Q1) */
  iqr: number
  /** Minimum value */
  min: number
  /** Maximum value */
  max: number
}

/** Outlier detection results using IQR method */
export interface OutlierAnalysis {
  /** Values identified as outliers */
  outliers: number[]
  /** Lower fence: Q1 - 1.5 * IQR */
  lowerFence: number
  /** Upper fence: Q3 + 1.5 * IQR */
  upperFence: number
  /** Whether any outliers were found */
  hasOutliers: boolean
}

/** Skewness analysis result */
export interface SkewnessAnalysis {
  /** Pearson's moment coefficient of skewness */
  skewness: number
  /** Qualitative interpretation */
  interpretation: 'left-skewed' | 'symmetric' | 'right-skewed'
  /** Human-readable description */
  description: string
}

/** Single histogram bin */
export interface HistogramBin {
  /** Lower bound of bin (inclusive) */
  binStart: number
  /** Upper bound of bin (exclusive, except for last bin) */
  binEnd: number
  /** Number of values in this bin */
  count: number
  /** Relative frequency (count / total) */
  frequency: number
  /** Display label for the bin */
  label: string
}

/** Complete histogram data */
export interface HistogramData {
  /** Array of bins */
  bins: HistogramBin[]
  /** Width of each bin */
  binWidth: number
  /** Total number of values */
  totalCount: number
}

/** Combined statistics result */
export interface FullStatistics {
  descriptive: DescriptiveStats
  spread: SpreadStats
  quartiles: Quartiles
  outliers: OutlierAnalysis
  skewness: SkewnessAnalysis
}

/** Dataset preset for the widget */
export interface DatasetPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Brief description */
  description: string
  /** The data values */
  data: number[]
  /** Optional unit label (e.g., 'cm', 'ms', '$K') */
  unit?: string
}

/** Result of parsing user input */
export interface ParseResult {
  success: boolean
  data: number[]
  errors: string[]
}

/** Result of validating statistics input */
export interface ValidationResult {
  valid: boolean
  data: number[]
  errors: string[]
}

// ============================================================================
// Preset Datasets
// ============================================================================

export const datasetPresets: DatasetPreset[] = [
  {
    id: 'test-scores',
    name: 'Test Scores',
    description: 'Student test scores (0-100 scale)',
    data: [85, 92, 78, 96, 88, 73, 91, 84, 79, 95, 87, 82, 90, 76, 94],
    unit: 'points',
  },
  {
    id: 'heights',
    name: 'Heights',
    description: 'Adult heights in centimeters',
    data: [165, 172, 158, 180, 175, 162, 170, 168, 177, 160, 173, 169],
    unit: 'cm',
  },
  {
    id: 'salaries',
    name: 'Salaries',
    description: 'Annual salaries in thousands (includes outlier)',
    data: [45, 52, 48, 75, 62, 55, 120, 58, 51, 49, 53, 47],
    unit: '$K',
  },
  {
    id: 'reaction-times',
    name: 'Reaction Times',
    description: 'Human reaction time measurements',
    data: [245, 312, 278, 256, 289, 301, 267, 284, 259, 295],
    unit: 'ms',
  },
  {
    id: 'symmetric',
    name: 'Symmetric',
    description: 'Data with minimal skew (educational)',
    data: [10, 12, 14, 15, 15, 15, 15, 16, 16, 18, 20],
    unit: '',
  },
]

// ============================================================================
// Basic Descriptive Statistics
// ============================================================================

/**
 * Calculate the sum of an array of numbers.
 * @returns 0 for empty arrays
 */
export function calculateSum(data: number[]): number {
  if (data.length === 0) return 0
  return data.reduce((acc, val) => acc + val, 0)
}

/**
 * Calculate the arithmetic mean (average).
 * @throws Error if array is empty
 */
export function calculateMean(data: number[]): number {
  if (data.length === 0) {
    throw new Error('Cannot calculate mean of empty array')
  }
  return calculateSum(data) / data.length
}

/**
 * Calculate the median (middle value when sorted).
 * For even-length arrays, returns average of two middle values.
 * @throws Error if array is empty
 */
export function calculateMedian(data: number[]): number {
  if (data.length === 0) {
    throw new Error('Cannot calculate median of empty array')
  }

  const sorted = [...data].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    // Safe: we know data.length >= 1 and for even length, mid >= 1
    return (sorted[mid - 1]! + sorted[mid]!) / 2
  }
  // Safe: we know data.length >= 1
  return sorted[mid]!
}

/**
 * Calculate the mode(s) - most frequently occurring value(s).
 * Returns empty array if all values occur once (no mode).
 * Returns multiple values if there are ties (multimodal).
 */
export function calculateMode(data: number[]): number[] {
  if (data.length === 0) return []

  const frequency = new Map<number, number>()
  let maxFreq = 0

  for (const value of data) {
    const count = (frequency.get(value) ?? 0) + 1
    frequency.set(value, count)
    maxFreq = Math.max(maxFreq, count)
  }

  // If max frequency is 1, there's no mode
  if (maxFreq === 1) return []

  // Collect all values with max frequency
  const modes: number[] = []
  for (const [value, count] of frequency) {
    if (count === maxFreq) {
      modes.push(value)
    }
  }

  return modes.sort((a, b) => a - b)
}

/**
 * Calculate range statistics (min, max, and range).
 * @throws Error if array is empty
 */
export function calculateRange(data: number[]): { min: number; max: number; range: number } {
  if (data.length === 0) {
    throw new Error('Cannot calculate range of empty array')
  }

  const min = Math.min(...data)
  const max = Math.max(...data)

  return {
    min,
    max,
    range: max - min,
  }
}

// ============================================================================
// Spread Statistics
// ============================================================================

/**
 * Calculate variance.
 * @param sample If true, uses sample variance (n-1); if false, uses population variance (n)
 * @throws Error if array is empty or has only one value for sample variance
 */
export function calculateVariance(data: number[], sample: boolean = false): number {
  if (data.length === 0) {
    throw new Error('Cannot calculate variance of empty array')
  }
  if (sample && data.length === 1) {
    throw new Error('Cannot calculate sample variance with only one value')
  }

  const mean = calculateMean(data)
  const squaredDiffs = data.map((x) => Math.pow(x - mean, 2))
  const sumSquaredDiffs = calculateSum(squaredDiffs)

  const divisor = sample ? data.length - 1 : data.length
  return sumSquaredDiffs / divisor
}

/**
 * Calculate standard deviation.
 * @param sample If true, uses sample std dev (n-1); if false, uses population std dev (n)
 */
export function calculateStdDev(data: number[], sample: boolean = false): number {
  return Math.sqrt(calculateVariance(data, sample))
}

// ============================================================================
// Quartiles and Percentiles
// ============================================================================

/**
 * Calculate a specific percentile using linear interpolation.
 * Uses the same method as NumPy's default (linear interpolation).
 * @param percentile Value between 0 and 100
 * @throws Error if array is empty or percentile is out of range
 */
export function calculatePercentile(data: number[], percentile: number): number {
  if (data.length === 0) {
    throw new Error('Cannot calculate percentile of empty array')
  }
  if (percentile < 0 || percentile > 100) {
    throw new Error('Percentile must be between 0 and 100')
  }

  const sorted = [...data].sort((a, b) => a - b)
  const n = sorted.length

  // Safe: we checked data.length > 0 above
  if (n === 1) return sorted[0]!

  // Use linear interpolation (NumPy default)
  const index = (percentile / 100) * (n - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const fraction = index - lower

  if (lower === upper) {
    // Safe: lower is within bounds due to percentile constraints
    return sorted[lower]!
  }

  // Safe: both indices are within bounds
  return sorted[lower]! + fraction * (sorted[upper]! - sorted[lower]!)
}

/**
 * Calculate quartiles (Q1, Q2/median, Q3) and IQR.
 * @throws Error if array is empty
 */
export function calculateQuartiles(data: number[]): Quartiles {
  if (data.length === 0) {
    throw new Error('Cannot calculate quartiles of empty array')
  }

  const q1 = calculatePercentile(data, 25)
  const q2 = calculatePercentile(data, 50)
  const q3 = calculatePercentile(data, 75)
  const rangeStats = calculateRange(data)

  return {
    q1,
    q2,
    q3,
    iqr: q3 - q1,
    min: rangeStats.min,
    max: rangeStats.max,
  }
}

// ============================================================================
// Outlier Detection
// ============================================================================

/**
 * Detect outliers using the IQR method.
 * Outliers are values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR.
 * @param quartiles Optional pre-calculated quartiles (calculated if not provided)
 */
export function detectOutliers(data: number[], quartiles?: Quartiles): OutlierAnalysis {
  if (data.length === 0) {
    return {
      outliers: [],
      lowerFence: 0,
      upperFence: 0,
      hasOutliers: false,
    }
  }

  const q = quartiles ?? calculateQuartiles(data)
  const iqr = q.iqr
  const lowerFence = q.q1 - 1.5 * iqr
  const upperFence = q.q3 + 1.5 * iqr

  const outliers = data.filter((x) => x < lowerFence || x > upperFence).sort((a, b) => a - b)

  return {
    outliers,
    lowerFence,
    upperFence,
    hasOutliers: outliers.length > 0,
  }
}

// ============================================================================
// Skewness
// ============================================================================

/**
 * Calculate skewness using Pearson's moment coefficient (Fisher's definition).
 * Formula: (1/n) * Σ((x - mean) / stdDev)³
 * @throws Error if array has fewer than 3 values
 */
export function calculateSkewness(data: number[]): SkewnessAnalysis {
  if (data.length < 3) {
    throw new Error('Cannot calculate skewness with fewer than 3 values')
  }

  const mean = calculateMean(data)
  const stdDev = calculateStdDev(data, false) // Population std dev

  // Handle case where all values are the same (stdDev = 0)
  if (stdDev === 0) {
    return {
      skewness: 0,
      interpretation: 'symmetric',
      description: 'All values are identical - perfectly symmetric',
    }
  }

  // Calculate third moment
  const n = data.length
  const cubedDiffs = data.map((x) => Math.pow((x - mean) / stdDev, 3))
  const skewness = calculateSum(cubedDiffs) / n

  // Interpret skewness
  let interpretation: 'left-skewed' | 'symmetric' | 'right-skewed'
  let description: string

  if (skewness < -0.5) {
    interpretation = 'left-skewed'
    description = 'Tail extends to the left (negative skew) - mean < median'
  } else if (skewness > 0.5) {
    interpretation = 'right-skewed'
    description = 'Tail extends to the right (positive skew) - mean > median'
  } else {
    interpretation = 'symmetric'
    description = 'Data is approximately symmetric - mean ≈ median'
  }

  return {
    skewness,
    interpretation,
    description,
  }
}

// ============================================================================
// Histogram Generation
// ============================================================================

/**
 * Suggest optimal bin count using Sturges' rule: k = ceil(log2(n) + 1)
 * @returns Suggested bin count (minimum 3, maximum 20)
 */
export function suggestBinCount(data: number[]): number {
  if (data.length <= 1) return 3

  const sturges = Math.ceil(Math.log2(data.length) + 1)
  return Math.min(Math.max(sturges, 3), 20)
}

/**
 * Generate histogram bins for the given data.
 * @param binCount Number of bins to create (default: use Sturges' rule)
 * @throws Error if array is empty
 */
export function generateHistogramBins(data: number[], binCount?: number): HistogramData {
  if (data.length === 0) {
    throw new Error('Cannot generate histogram for empty array')
  }

  const effectiveBinCount = binCount ?? suggestBinCount(data)
  const { min, max } = calculateRange(data)

  // Handle case where all values are the same
  if (min === max) {
    return {
      bins: [
        {
          binStart: min,
          binEnd: min,
          count: data.length,
          frequency: 1,
          label: formatBinLabel(min, min),
        },
      ],
      binWidth: 0,
      totalCount: data.length,
    }
  }

  const binWidth = (max - min) / effectiveBinCount

  // Initialize bins
  const bins: HistogramBin[] = []
  for (let i = 0; i < effectiveBinCount; i++) {
    const binStart = min + i * binWidth
    const binEnd = min + (i + 1) * binWidth
    bins.push({
      binStart,
      binEnd,
      count: 0,
      frequency: 0,
      label: formatBinLabel(binStart, binEnd),
    })
  }

  // Count values in each bin
  for (const value of data) {
    // Find which bin this value belongs to
    let binIndex = Math.floor((value - min) / binWidth)

    // Handle edge case: max value should go in last bin
    if (binIndex >= effectiveBinCount) {
      binIndex = effectiveBinCount - 1
    }

    // Safe: binIndex is within [0, effectiveBinCount - 1]
    bins[binIndex]!.count++
  }

  // Calculate frequencies
  for (const bin of bins) {
    bin.frequency = bin.count / data.length
  }

  return {
    bins,
    binWidth,
    totalCount: data.length,
  }
}

/**
 * Format a bin label for display.
 */
function formatBinLabel(start: number, end: number): string {
  const formatNum = (n: number): string => {
    if (Number.isInteger(n)) return n.toString()
    return n.toFixed(1)
  }

  if (start === end) {
    return formatNum(start)
  }

  return `${formatNum(start)}-${formatNum(end)}`
}

// ============================================================================
// Combined Analysis
// ============================================================================

/**
 * Calculate all statistics for a dataset.
 * @throws Error if array has fewer than 2 values
 */
export function calculateFullStatistics(data: number[]): FullStatistics {
  if (data.length < 2) {
    throw new Error('Need at least 2 values for full statistics')
  }

  const rangeStats = calculateRange(data)
  const mean = calculateMean(data)
  const median = calculateMedian(data)
  const mode = calculateMode(data)

  const descriptive: DescriptiveStats = {
    count: data.length,
    sum: calculateSum(data),
    mean,
    median,
    mode,
    min: rangeStats.min,
    max: rangeStats.max,
    range: rangeStats.range,
  }

  const spread: SpreadStats = {
    variance: calculateVariance(data, false),
    sampleVariance: calculateVariance(data, true),
    stdDev: calculateStdDev(data, false),
    sampleStdDev: calculateStdDev(data, true),
  }

  const quartiles = calculateQuartiles(data)
  const outliers = detectOutliers(data, quartiles)

  // Skewness requires at least 3 values
  const skewness =
    data.length >= 3
      ? calculateSkewness(data)
      : {
          skewness: 0,
          interpretation: 'symmetric' as const,
          description: 'Insufficient data for skewness calculation',
        }

  return {
    descriptive,
    spread,
    quartiles,
    outliers,
    skewness,
  }
}

// ============================================================================
// Input Validation and Parsing
// ============================================================================

/**
 * Validate an array as valid statistics input.
 * Filters out non-numeric and non-finite values.
 */
export function validateStatisticsInput(data: unknown[]): ValidationResult {
  const errors: string[] = []
  const validData: number[] = []

  for (let i = 0; i < data.length; i++) {
    const value = data[i]

    if (typeof value === 'number' && Number.isFinite(value)) {
      validData.push(value)
    } else if (typeof value === 'string') {
      const parsed = parseFloat(value)
      if (Number.isFinite(parsed)) {
        validData.push(parsed)
      } else {
        errors.push(`Invalid value at position ${i + 1}: "${value}"`)
      }
    } else {
      errors.push(`Invalid value at position ${i + 1}: ${String(value)}`)
    }
  }

  return {
    valid: validData.length >= 2 && errors.length === 0,
    data: validData,
    errors,
  }
}

/**
 * Parse a string input into an array of numbers.
 * Accepts comma, space, newline, or semicolon separated values.
 */
export function parseDataInput(input: string): ParseResult {
  if (!input || input.trim() === '') {
    return {
      success: false,
      data: [],
      errors: ['Input is empty'],
    }
  }

  // Split by common delimiters: comma, semicolon, whitespace (including newlines)
  const parts = input
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  if (parts.length === 0) {
    return {
      success: false,
      data: [],
      errors: ['No valid values found'],
    }
  }

  const data: number[] = []
  const errors: string[] = []

  for (const part of parts) {
    const num = parseFloat(part)
    if (Number.isFinite(num)) {
      data.push(num)
    } else {
      errors.push(`"${part}" is not a valid number`)
    }
  }

  if (data.length === 0) {
    return {
      success: false,
      data: [],
      errors: errors.length > 0 ? errors : ['No valid numbers found'],
    }
  }

  if (data.length === 1) {
    return {
      success: false,
      data,
      errors: ['Need at least 2 values for statistics'],
    }
  }

  return {
    success: errors.length === 0,
    data,
    errors,
  }
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format a statistic value for display.
 * Shows integers as-is, decimals with appropriate precision.
 */
export function formatStatValue(value: number, precision: number = 2): string {
  if (!Number.isFinite(value)) {
    return '—'
  }

  // Check if effectively an integer
  if (Math.abs(value - Math.round(value)) < 1e-10) {
    const intVal = Math.round(value)
    // Add thousands separator manually to avoid locale issues
    return intVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // Format with fixed precision
  return value.toFixed(precision)
}
