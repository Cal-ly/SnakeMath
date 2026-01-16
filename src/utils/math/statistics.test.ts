import { describe, it, expect } from 'vitest'
import {
  calculateSum,
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateRange,
  calculateVariance,
  calculateStdDev,
  calculatePercentile,
  calculateQuartiles,
  detectOutliers,
  calculateSkewness,
  suggestBinCount,
  generateHistogramBins,
  calculateFullStatistics,
  validateStatisticsInput,
  parseDataInput,
  formatStatValue,
  datasetPresets,
} from './statistics'

// ============================================================================
// Test Data
// ============================================================================

const simpleData = [1, 2, 3, 4, 5]
const evenData = [1, 2, 3, 4, 5, 6]
const testScores = [85, 92, 78, 96, 88, 73, 91, 84, 79, 95, 87, 82, 90, 76, 94]
const salaries = [45, 52, 48, 75, 62, 55, 120, 58, 51, 49, 53, 47] // Has outlier at 120
const symmetricData = [10, 12, 14, 15, 15, 15, 15, 16, 16, 18, 20]
const multimodalData = [1, 2, 2, 3, 3, 4]

// ============================================================================
// calculateSum
// ============================================================================

describe('calculateSum', () => {
  it('calculates sum of simple array', () => {
    expect(calculateSum(simpleData)).toBe(15)
  })

  it('returns 0 for empty array', () => {
    expect(calculateSum([])).toBe(0)
  })

  it('handles single value', () => {
    expect(calculateSum([42])).toBe(42)
  })

  it('handles negative numbers', () => {
    expect(calculateSum([-1, -2, -3])).toBe(-6)
  })

  it('handles mixed positive and negative', () => {
    expect(calculateSum([-5, 10, -3, 8])).toBe(10)
  })

  it('handles decimals', () => {
    expect(calculateSum([0.1, 0.2, 0.3])).toBeCloseTo(0.6)
  })
})

// ============================================================================
// calculateMean
// ============================================================================

describe('calculateMean', () => {
  it('calculates mean of simple array', () => {
    expect(calculateMean(simpleData)).toBe(3)
  })

  it('calculates mean of test scores', () => {
    expect(calculateMean(testScores)).toBeCloseTo(86)
  })

  it('throws for empty array', () => {
    expect(() => calculateMean([])).toThrow('Cannot calculate mean of empty array')
  })

  it('handles single value', () => {
    expect(calculateMean([42])).toBe(42)
  })

  it('handles negative numbers', () => {
    expect(calculateMean([-2, 0, 2])).toBe(0)
  })
})

// ============================================================================
// calculateMedian
// ============================================================================

describe('calculateMedian', () => {
  it('calculates median of odd-length array', () => {
    expect(calculateMedian(simpleData)).toBe(3)
  })

  it('calculates median of even-length array', () => {
    expect(calculateMedian(evenData)).toBe(3.5)
  })

  it('handles unsorted input', () => {
    expect(calculateMedian([5, 1, 3, 2, 4])).toBe(3)
  })

  it('throws for empty array', () => {
    expect(() => calculateMedian([])).toThrow('Cannot calculate median of empty array')
  })

  it('handles single value', () => {
    expect(calculateMedian([42])).toBe(42)
  })

  it('handles two values', () => {
    expect(calculateMedian([10, 20])).toBe(15)
  })
})

// ============================================================================
// calculateMode
// ============================================================================

describe('calculateMode', () => {
  it('returns empty array when all values unique', () => {
    expect(calculateMode(simpleData)).toEqual([])
  })

  it('finds single mode', () => {
    expect(calculateMode([1, 2, 2, 3])).toEqual([2])
  })

  it('finds multiple modes (bimodal)', () => {
    expect(calculateMode(multimodalData)).toEqual([2, 3])
  })

  it('returns mode for symmetric data', () => {
    // symmetricData = [10, 12, 14, 15, 15, 15, 15, 16, 16, 18, 20] - mode is 15 (appears 4 times)
    expect(calculateMode(symmetricData)).toEqual([15])
  })

  it('returns empty array for empty input', () => {
    expect(calculateMode([])).toEqual([])
  })

  it('handles single value', () => {
    expect(calculateMode([5])).toEqual([])
  })

  it('handles all same values', () => {
    expect(calculateMode([7, 7, 7, 7])).toEqual([7])
  })
})

// ============================================================================
// calculateRange
// ============================================================================

describe('calculateRange', () => {
  it('calculates range of simple array', () => {
    const result = calculateRange(simpleData)
    expect(result.min).toBe(1)
    expect(result.max).toBe(5)
    expect(result.range).toBe(4)
  })

  it('calculates range with negative numbers', () => {
    const result = calculateRange([-10, 5, 20])
    expect(result.min).toBe(-10)
    expect(result.max).toBe(20)
    expect(result.range).toBe(30)
  })

  it('throws for empty array', () => {
    expect(() => calculateRange([])).toThrow('Cannot calculate range of empty array')
  })

  it('handles single value (range = 0)', () => {
    const result = calculateRange([42])
    expect(result.min).toBe(42)
    expect(result.max).toBe(42)
    expect(result.range).toBe(0)
  })
})

// ============================================================================
// calculateVariance
// ============================================================================

describe('calculateVariance', () => {
  it('calculates population variance', () => {
    // Variance of [1,2,3,4,5] = 2
    expect(calculateVariance(simpleData, false)).toBe(2)
  })

  it('calculates sample variance', () => {
    // Sample variance of [1,2,3,4,5] = 2.5
    expect(calculateVariance(simpleData, true)).toBe(2.5)
  })

  it('returns 0 for all same values', () => {
    expect(calculateVariance([5, 5, 5, 5], false)).toBe(0)
  })

  it('throws for empty array', () => {
    expect(() => calculateVariance([])).toThrow('Cannot calculate variance of empty array')
  })

  it('throws for sample variance with one value', () => {
    expect(() => calculateVariance([5], true)).toThrow(
      'Cannot calculate sample variance with only one value'
    )
  })

  it('handles population variance with one value', () => {
    expect(calculateVariance([5], false)).toBe(0)
  })
})

// ============================================================================
// calculateStdDev
// ============================================================================

describe('calculateStdDev', () => {
  it('calculates population standard deviation', () => {
    // StdDev of [1,2,3,4,5] = sqrt(2) ≈ 1.414
    expect(calculateStdDev(simpleData, false)).toBeCloseTo(Math.sqrt(2))
  })

  it('calculates sample standard deviation', () => {
    // Sample StdDev of [1,2,3,4,5] = sqrt(2.5) ≈ 1.581
    expect(calculateStdDev(simpleData, true)).toBeCloseTo(Math.sqrt(2.5))
  })

  it('returns 0 for all same values', () => {
    expect(calculateStdDev([5, 5, 5, 5])).toBe(0)
  })
})

// ============================================================================
// calculatePercentile
// ============================================================================

describe('calculatePercentile', () => {
  it('calculates 50th percentile (median)', () => {
    expect(calculatePercentile(simpleData, 50)).toBe(3)
  })

  it('calculates 0th percentile (min)', () => {
    expect(calculatePercentile(simpleData, 0)).toBe(1)
  })

  it('calculates 100th percentile (max)', () => {
    expect(calculatePercentile(simpleData, 100)).toBe(5)
  })

  it('calculates 25th percentile', () => {
    expect(calculatePercentile(simpleData, 25)).toBe(2)
  })

  it('calculates 75th percentile', () => {
    expect(calculatePercentile(simpleData, 75)).toBe(4)
  })

  it('interpolates for percentiles between values', () => {
    // For [1,2,3,4,5], 30th percentile should be between 2 and 3
    const p30 = calculatePercentile(simpleData, 30)
    expect(p30).toBeGreaterThan(2)
    expect(p30).toBeLessThan(3)
  })

  it('throws for empty array', () => {
    expect(() => calculatePercentile([], 50)).toThrow('Cannot calculate percentile of empty array')
  })

  it('throws for invalid percentile', () => {
    expect(() => calculatePercentile(simpleData, -1)).toThrow('Percentile must be between 0 and 100')
    expect(() => calculatePercentile(simpleData, 101)).toThrow(
      'Percentile must be between 0 and 100'
    )
  })

  it('handles single value', () => {
    expect(calculatePercentile([42], 50)).toBe(42)
  })
})

// ============================================================================
// calculateQuartiles
// ============================================================================

describe('calculateQuartiles', () => {
  it('calculates quartiles for simple data', () => {
    const q = calculateQuartiles(simpleData)
    expect(q.q1).toBe(2)
    expect(q.q2).toBe(3)
    expect(q.q3).toBe(4)
    expect(q.iqr).toBe(2)
    expect(q.min).toBe(1)
    expect(q.max).toBe(5)
  })

  it('calculates quartiles for test scores', () => {
    const q = calculateQuartiles(testScores)
    // Using linear interpolation (NumPy default)
    // testScores sorted: [73, 76, 78, 79, 82, 84, 85, 87, 88, 90, 91, 92, 94, 95, 96]
    // Q1 (25th percentile): index 3.5 -> between 79 and 82 = 80.5
    // Q2 (50th percentile): index 7 -> 87
    // Q3 (75th percentile): index 10.5 -> between 91 and 92 = 91.5
    expect(q.q1).toBeCloseTo(80.5, 1)
    expect(q.q2).toBeCloseTo(87, 1)
    expect(q.q3).toBeCloseTo(91.5, 1)
    expect(q.min).toBe(73)
    expect(q.max).toBe(96)
  })

  it('throws for empty array', () => {
    expect(() => calculateQuartiles([])).toThrow('Cannot calculate quartiles of empty array')
  })
})

// ============================================================================
// detectOutliers
// ============================================================================

describe('detectOutliers', () => {
  it('detects no outliers in simple data', () => {
    const result = detectOutliers(simpleData)
    expect(result.outliers).toEqual([])
    expect(result.hasOutliers).toBe(false)
  })

  it('detects outlier in salary data', () => {
    const result = detectOutliers(salaries)
    expect(result.outliers).toContain(120)
    expect(result.hasOutliers).toBe(true)
  })

  it('calculates correct fences', () => {
    const q = calculateQuartiles(simpleData)
    const result = detectOutliers(simpleData, q)
    expect(result.lowerFence).toBe(q.q1 - 1.5 * q.iqr)
    expect(result.upperFence).toBe(q.q3 + 1.5 * q.iqr)
  })

  it('returns empty for empty array', () => {
    const result = detectOutliers([])
    expect(result.outliers).toEqual([])
    expect(result.hasOutliers).toBe(false)
  })

  it('detects multiple outliers', () => {
    // Use data where both values are clearly outside the fences
    const dataWithOutliers = [10, 11, 12, 13, 14, 15, 16, 100, 200]
    const result = detectOutliers(dataWithOutliers)
    // Q1 ~ 11, Q3 ~ 15.5, IQR ~ 4.5, upper fence ~ 22.25
    expect(result.outliers).toContain(100)
    expect(result.outliers).toContain(200)
    expect(result.outliers.length).toBe(2)
  })
})

// ============================================================================
// calculateSkewness
// ============================================================================

describe('calculateSkewness', () => {
  it('detects approximately symmetric data', () => {
    const result = calculateSkewness(symmetricData)
    expect(result.interpretation).toBe('symmetric')
    expect(Math.abs(result.skewness)).toBeLessThan(0.5)
  })

  it('detects right-skewed data', () => {
    // Salary data has a high outlier, should be right-skewed
    const result = calculateSkewness(salaries)
    expect(result.interpretation).toBe('right-skewed')
    expect(result.skewness).toBeGreaterThan(0.5)
  })

  it('detects left-skewed data', () => {
    // Create left-skewed data
    const leftSkewed = [1, 5, 8, 9, 10, 10, 10]
    const result = calculateSkewness(leftSkewed)
    expect(result.interpretation).toBe('left-skewed')
    expect(result.skewness).toBeLessThan(-0.5)
  })

  it('throws for fewer than 3 values', () => {
    expect(() => calculateSkewness([1, 2])).toThrow('Cannot calculate skewness with fewer than 3 values')
  })

  it('handles all same values', () => {
    const result = calculateSkewness([5, 5, 5, 5])
    expect(result.skewness).toBe(0)
    expect(result.interpretation).toBe('symmetric')
  })
})

// ============================================================================
// suggestBinCount
// ============================================================================

describe('suggestBinCount', () => {
  it('returns minimum for small arrays', () => {
    expect(suggestBinCount([1])).toBe(3)
    expect(suggestBinCount([])).toBe(3)
  })

  it('uses Sturges rule for larger arrays', () => {
    // For n=100, Sturges suggests ceil(log2(100) + 1) = ceil(6.64 + 1) = 8
    const data = Array.from({ length: 100 }, (_, i) => i)
    expect(suggestBinCount(data)).toBe(8)
  })

  it('caps at 20 bins', () => {
    const largeData = Array.from({ length: 1000000 }, (_, i) => i)
    expect(suggestBinCount(largeData)).toBe(20)
  })
})

// ============================================================================
// generateHistogramBins
// ============================================================================

describe('generateHistogramBins', () => {
  it('generates correct number of bins', () => {
    const result = generateHistogramBins(simpleData, 5)
    expect(result.bins.length).toBe(5)
  })

  it('counts values correctly', () => {
    const result = generateHistogramBins(simpleData, 5)
    const totalCount = result.bins.reduce((sum, bin) => sum + bin.count, 0)
    expect(totalCount).toBe(simpleData.length)
  })

  it('calculates frequencies correctly', () => {
    const result = generateHistogramBins(simpleData, 5)
    const totalFreq = result.bins.reduce((sum, bin) => sum + bin.frequency, 0)
    expect(totalFreq).toBeCloseTo(1)
  })

  it('calculates correct bin width', () => {
    const result = generateHistogramBins(simpleData, 4)
    expect(result.binWidth).toBe(1) // range 4, 4 bins = width 1
  })

  it('handles all same values', () => {
    const result = generateHistogramBins([5, 5, 5, 5], 3)
    expect(result.bins.length).toBe(1)
    expect(result.bins[0]!.count).toBe(4)
  })

  it('throws for empty array', () => {
    expect(() => generateHistogramBins([])).toThrow('Cannot generate histogram for empty array')
  })

  it('uses Sturges rule when binCount not specified', () => {
    const result = generateHistogramBins(testScores)
    expect(result.bins.length).toBeGreaterThanOrEqual(3)
    expect(result.bins.length).toBeLessThanOrEqual(20)
  })
})

// ============================================================================
// calculateFullStatistics
// ============================================================================

describe('calculateFullStatistics', () => {
  it('calculates all statistics for test scores', () => {
    const stats = calculateFullStatistics(testScores)

    expect(stats.descriptive.count).toBe(15)
    expect(stats.descriptive.mean).toBeCloseTo(86)
    expect(stats.descriptive.min).toBe(73)
    expect(stats.descriptive.max).toBe(96)

    expect(stats.spread.variance).toBeGreaterThan(0)
    expect(stats.spread.stdDev).toBeGreaterThan(0)

    expect(stats.quartiles.q1).toBeDefined()
    expect(stats.quartiles.q2).toBeDefined()
    expect(stats.quartiles.q3).toBeDefined()

    expect(stats.outliers.hasOutliers).toBe(false)

    expect(stats.skewness.interpretation).toBeDefined()
  })

  it('detects outlier in salary data', () => {
    const stats = calculateFullStatistics(salaries)
    expect(stats.outliers.hasOutliers).toBe(true)
    expect(stats.outliers.outliers).toContain(120)
  })

  it('throws for fewer than 2 values', () => {
    expect(() => calculateFullStatistics([1])).toThrow('Need at least 2 values for full statistics')
  })

  it('handles exactly 2 values', () => {
    const stats = calculateFullStatistics([10, 20])
    expect(stats.descriptive.count).toBe(2)
    expect(stats.descriptive.mean).toBe(15)
    expect(stats.descriptive.median).toBe(15)
    // Skewness should have special handling for small n
    expect(stats.skewness.description).toContain('Insufficient')
  })
})

// ============================================================================
// validateStatisticsInput
// ============================================================================

describe('validateStatisticsInput', () => {
  it('validates array of numbers', () => {
    const result = validateStatisticsInput([1, 2, 3, 4, 5])
    expect(result.valid).toBe(true)
    expect(result.data).toEqual([1, 2, 3, 4, 5])
    expect(result.errors).toEqual([])
  })

  it('converts string numbers', () => {
    const result = validateStatisticsInput(['1', '2', '3'])
    expect(result.data).toEqual([1, 2, 3])
  })

  it('filters out invalid values', () => {
    const result = validateStatisticsInput([1, 'abc', 2, null, 3])
    expect(result.data).toEqual([1, 2, 3])
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('rejects Infinity', () => {
    const result = validateStatisticsInput([1, Infinity, 2])
    expect(result.data).toEqual([1, 2])
  })

  it('rejects NaN', () => {
    const result = validateStatisticsInput([1, NaN, 2])
    expect(result.data).toEqual([1, 2])
  })

  it('marks as invalid with fewer than 2 values', () => {
    const result = validateStatisticsInput([1])
    expect(result.valid).toBe(false)
  })
})

// ============================================================================
// parseDataInput
// ============================================================================

describe('parseDataInput', () => {
  it('parses comma-separated values', () => {
    const result = parseDataInput('1, 2, 3, 4, 5')
    expect(result.success).toBe(true)
    expect(result.data).toEqual([1, 2, 3, 4, 5])
  })

  it('parses space-separated values', () => {
    const result = parseDataInput('1 2 3 4 5')
    expect(result.success).toBe(true)
    expect(result.data).toEqual([1, 2, 3, 4, 5])
  })

  it('parses newline-separated values', () => {
    const result = parseDataInput('1\n2\n3')
    expect(result.success).toBe(true)
    expect(result.data).toEqual([1, 2, 3])
  })

  it('parses semicolon-separated values', () => {
    const result = parseDataInput('1; 2; 3')
    expect(result.success).toBe(true)
    expect(result.data).toEqual([1, 2, 3])
  })

  it('parses mixed delimiters', () => {
    const result = parseDataInput('1, 2; 3\n4 5')
    expect(result.success).toBe(true)
    expect(result.data).toEqual([1, 2, 3, 4, 5])
  })

  it('parses decimal numbers', () => {
    const result = parseDataInput('1.5, 2.7, 3.14')
    expect(result.success).toBe(true)
    expect(result.data).toEqual([1.5, 2.7, 3.14])
  })

  it('parses negative numbers', () => {
    const result = parseDataInput('-1, -2, 3')
    expect(result.success).toBe(true)
    expect(result.data).toEqual([-1, -2, 3])
  })

  it('returns error for empty input', () => {
    const result = parseDataInput('')
    expect(result.success).toBe(false)
    expect(result.errors).toContain('Input is empty')
  })

  it('returns error for whitespace-only input', () => {
    const result = parseDataInput('   ')
    expect(result.success).toBe(false)
  })

  it('reports invalid values', () => {
    const result = parseDataInput('1, abc, 2')
    expect(result.success).toBe(false)
    expect(result.errors.some((e) => e.includes('abc'))).toBe(true)
    expect(result.data).toEqual([1, 2]) // Still returns valid numbers
  })

  it('returns error for single value', () => {
    const result = parseDataInput('42')
    expect(result.success).toBe(false)
    expect(result.errors).toContain('Need at least 2 values for statistics')
  })
})

// ============================================================================
// formatStatValue
// ============================================================================

describe('formatStatValue', () => {
  it('formats integers without decimals', () => {
    expect(formatStatValue(42)).toBe('42')
  })

  it('formats decimals with precision', () => {
    expect(formatStatValue(3.14159, 2)).toBe('3.14')
  })

  it('formats large integers with thousands separator', () => {
    expect(formatStatValue(1000000)).toBe('1,000,000')
  })

  it('returns dash for non-finite values', () => {
    expect(formatStatValue(Infinity)).toBe('—')
    expect(formatStatValue(NaN)).toBe('—')
  })

  it('treats near-integers as integers', () => {
    // The tolerance is 1e-10, so 5.000000001 (1e-9) is not close enough
    // Use a value within the tolerance
    expect(formatStatValue(5.00000000001)).toBe('5')
  })
})

// ============================================================================
// datasetPresets
// ============================================================================

describe('datasetPresets', () => {
  it('has expected presets', () => {
    expect(datasetPresets.length).toBe(5)
    expect(datasetPresets.map((p) => p.id)).toEqual([
      'test-scores',
      'heights',
      'salaries',
      'reaction-times',
      'symmetric',
    ])
  })

  it('all presets have required fields', () => {
    for (const preset of datasetPresets) {
      expect(preset.id).toBeDefined()
      expect(preset.name).toBeDefined()
      expect(preset.description).toBeDefined()
      expect(preset.data.length).toBeGreaterThan(0)
    }
  })

  it('all preset data is valid for statistics', () => {
    for (const preset of datasetPresets) {
      expect(() => calculateFullStatistics(preset.data)).not.toThrow()
    }
  })

  it('salaries preset has an outlier', () => {
    const salariesPreset = datasetPresets.find((p) => p.id === 'salaries')!
    const outliers = detectOutliers(salariesPreset.data)
    expect(outliers.hasOutliers).toBe(true)
  })

  it('symmetric preset is approximately symmetric', () => {
    const symmetricPreset = datasetPresets.find((p) => p.id === 'symmetric')!
    const skewness = calculateSkewness(symmetricPreset.data)
    expect(skewness.interpretation).toBe('symmetric')
  })
})

// ============================================================================
// Edge Cases
// ============================================================================

describe('edge cases', () => {
  describe('very large numbers', () => {
    it('handles large numbers in calculations', () => {
      const largeData = [1e10, 2e10, 3e10]
      const stats = calculateFullStatistics(largeData)
      expect(stats.descriptive.mean).toBeCloseTo(2e10)
    })
  })

  describe('very small numbers', () => {
    it('handles small numbers in calculations', () => {
      const smallData = [1e-10, 2e-10, 3e-10]
      const stats = calculateFullStatistics(smallData)
      expect(stats.descriptive.mean).toBeCloseTo(2e-10)
    })
  })

  describe('negative numbers', () => {
    it('handles all negative data', () => {
      const negativeData = [-5, -3, -1, -4, -2]
      const stats = calculateFullStatistics(negativeData)
      expect(stats.descriptive.mean).toBe(-3)
      expect(stats.descriptive.min).toBe(-5)
      expect(stats.descriptive.max).toBe(-1)
    })
  })

  describe('mixed positive and negative', () => {
    it('handles mixed data correctly', () => {
      const mixedData = [-2, -1, 0, 1, 2]
      const stats = calculateFullStatistics(mixedData)
      expect(stats.descriptive.mean).toBe(0)
      expect(stats.descriptive.median).toBe(0)
      expect(stats.descriptive.range).toBe(4)
    })
  })

  describe('all same values', () => {
    it('handles all identical values', () => {
      const sameData = [7, 7, 7, 7, 7]
      const stats = calculateFullStatistics(sameData)
      expect(stats.descriptive.mean).toBe(7)
      expect(stats.descriptive.median).toBe(7)
      expect(stats.descriptive.mode).toEqual([7])
      expect(stats.spread.variance).toBe(0)
      expect(stats.spread.stdDev).toBe(0)
    })
  })
})
