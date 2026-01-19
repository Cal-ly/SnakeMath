import { describe, it, expect } from 'vitest'
import {
  mean,
  standardDeviation,
  populationStandardDeviation,
  pearsonCorrelation,
  interpretCorrelation,
  coefficientOfDetermination,
  linearRegression,
  predictY,
  predictYArray,
  regressionConfidenceIntervals,
  calculateResiduals,
  analyzeResiduals,
  standardErrorOfEstimate,
  cooksDistance,
  identifyOutliers,
  totalSumOfSquares,
  rSquaredFromResiduals,
  generateRegressionLinePoints,
  pointsToArrays,
  arraysToPoints,
  anscombesQuartet,
  correlationPresets,
  getCorrelationPresetById,
  getAnscombeDatasetById,
  formatCorrelation,
  formatRSquared,
  formatRegressionEquation,
} from './correlation'

// ============================================================================
// Basic Statistics Tests
// ============================================================================

describe('mean', () => {
  it('calculates mean correctly', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3)
    expect(mean([10, 20, 30])).toBe(20)
    expect(mean([5])).toBe(5)
  })

  it('returns 0 for empty array', () => {
    expect(mean([])).toBe(0)
  })

  it('handles negative numbers', () => {
    expect(mean([-2, -1, 0, 1, 2])).toBe(0)
  })
})

describe('standardDeviation', () => {
  it('calculates sample standard deviation correctly', () => {
    // Sample: [2, 4, 6, 8, 10], mean = 6
    // Variance = [(2-6)² + (4-6)² + (6-6)² + (8-6)² + (10-6)²] / (5-1)
    //          = [16 + 4 + 0 + 4 + 16] / 4 = 40 / 4 = 10
    // SD = √10 ≈ 3.162
    expect(standardDeviation([2, 4, 6, 8, 10])).toBeCloseTo(3.162, 2)
  })

  it('returns 0 for single value', () => {
    expect(standardDeviation([5])).toBe(0)
  })

  it('returns 0 for empty array', () => {
    expect(standardDeviation([])).toBe(0)
  })
})

describe('populationStandardDeviation', () => {
  it('calculates population standard deviation correctly', () => {
    // Same sample: [2, 4, 6, 8, 10], but divide by n instead of n-1
    // Variance = 40 / 5 = 8
    // SD = √8 ≈ 2.828
    expect(populationStandardDeviation([2, 4, 6, 8, 10])).toBeCloseTo(2.828, 2)
  })
})

// ============================================================================
// Correlation Tests
// ============================================================================

describe('pearsonCorrelation', () => {
  it('calculates perfect positive correlation', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [2, 4, 6, 8, 10]
    expect(pearsonCorrelation(x, y)).toBeCloseTo(1.0, 6)
  })

  it('calculates perfect negative correlation', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [10, 8, 6, 4, 2]
    expect(pearsonCorrelation(x, y)).toBeCloseTo(-1.0, 6)
  })

  it('calculates zero correlation for uncorrelated data', () => {
    // Perfectly orthogonal pattern
    const x = [1, 2, 3, 2, 1]
    const y = [1, 1, 1, 1, 1]
    expect(pearsonCorrelation(x, y)).toBe(0)
  })

  it('handles moderate correlation', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [2, 3, 5, 4, 6]
    const r = pearsonCorrelation(x, y)
    expect(r).toBeGreaterThan(0.5)
    expect(r).toBeLessThan(1)
  })

  it('throws for mismatched array lengths', () => {
    expect(() => pearsonCorrelation([1, 2, 3], [1, 2])).toThrow('same length')
  })

  it('throws for less than 2 points', () => {
    expect(() => pearsonCorrelation([1], [1])).toThrow('at least 2')
  })

  it('returns 0 when x has no variance', () => {
    const x = [5, 5, 5, 5, 5]
    const y = [1, 2, 3, 4, 5]
    expect(pearsonCorrelation(x, y)).toBe(0)
  })

  it('returns 0 when y has no variance', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [5, 5, 5, 5, 5]
    expect(pearsonCorrelation(x, y)).toBe(0)
  })
})

describe('interpretCorrelation', () => {
  it('interprets negligible correlation', () => {
    expect(interpretCorrelation(0.05)).toBe('negligible')
    expect(interpretCorrelation(-0.05)).toBe('negligible')
  })

  it('interprets weak correlation', () => {
    expect(interpretCorrelation(0.2)).toBe('weak positive')
    expect(interpretCorrelation(-0.2)).toBe('weak negative')
  })

  it('interprets moderate correlation', () => {
    expect(interpretCorrelation(0.4)).toBe('moderate positive')
    expect(interpretCorrelation(-0.4)).toBe('moderate negative')
  })

  it('interprets strong correlation', () => {
    expect(interpretCorrelation(0.6)).toBe('strong positive')
    expect(interpretCorrelation(-0.6)).toBe('strong negative')
  })

  it('interprets very strong correlation', () => {
    expect(interpretCorrelation(0.8)).toBe('very strong positive')
    expect(interpretCorrelation(-0.8)).toBe('very strong negative')
  })

  it('interprets near-perfect correlation', () => {
    expect(interpretCorrelation(0.95)).toBe('near-perfect positive')
    expect(interpretCorrelation(-0.95)).toBe('near-perfect negative')
  })
})

describe('coefficientOfDetermination', () => {
  it('calculates R² correctly', () => {
    expect(coefficientOfDetermination(0.9)).toBeCloseTo(0.81, 6)
    expect(coefficientOfDetermination(-0.8)).toBeCloseTo(0.64, 6)
    expect(coefficientOfDetermination(0)).toBe(0)
    expect(coefficientOfDetermination(1)).toBe(1)
  })
})

// ============================================================================
// Linear Regression Tests
// ============================================================================

describe('linearRegression', () => {
  it('calculates perfect linear relationship', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [3, 5, 7, 9, 11] // y = 2x + 1
    const result = linearRegression(x, y)

    expect(result.slope).toBeCloseTo(2, 6)
    expect(result.intercept).toBeCloseTo(1, 6)
    expect(result.r).toBeCloseTo(1, 6)
    expect(result.rSquared).toBeCloseTo(1, 6)
    expect(result.standardError).toBeCloseTo(0, 6)
  })

  it('calculates negative slope correctly', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [11, 9, 7, 5, 3] // y = -2x + 13
    const result = linearRegression(x, y)

    expect(result.slope).toBeCloseTo(-2, 6)
    expect(result.intercept).toBeCloseTo(13, 6)
    expect(result.r).toBeCloseTo(-1, 6)
  })

  it('handles noisy data', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [2.1, 3.9, 6.2, 7.8, 10.1] // Approximately y = 2x
    const result = linearRegression(x, y)

    expect(result.slope).toBeCloseTo(2, 0)
    expect(result.r).toBeGreaterThan(0.9)
    expect(result.rSquared).toBeGreaterThan(0.8)
    expect(result.standardError).toBeGreaterThan(0)
  })

  it('handles horizontal line (zero slope)', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [5, 5, 5, 5, 5]
    const result = linearRegression(x, y)

    expect(result.slope).toBeCloseTo(0, 6)
    expect(result.intercept).toBeCloseTo(5, 6)
    expect(result.r).toBe(0)
  })

  it('handles vertical points (no x variance)', () => {
    const x = [5, 5, 5, 5, 5]
    const y = [1, 2, 3, 4, 5]
    const result = linearRegression(x, y)

    expect(result.slope).toBe(0)
    expect(result.intercept).toBe(mean(y))
  })

  it('throws for mismatched arrays', () => {
    expect(() => linearRegression([1, 2, 3], [1, 2])).toThrow('same length')
  })

  it('throws for less than 2 points', () => {
    expect(() => linearRegression([1], [2])).toThrow('at least 2')
  })
})

describe('predictY', () => {
  it('predicts y values correctly', () => {
    expect(predictY(5, 2, 1)).toBe(11) // y = 2*5 + 1
    expect(predictY(0, 3, 5)).toBe(5) // y = 3*0 + 5
    expect(predictY(-2, 4, 10)).toBe(2) // y = 4*(-2) + 10
  })
})

describe('predictYArray', () => {
  it('predicts array of y values', () => {
    const xValues = [1, 2, 3, 4, 5]
    const predictions = predictYArray(xValues, 2, 1)
    expect(predictions).toEqual([3, 5, 7, 9, 11])
  })
})

describe('regressionConfidenceIntervals', () => {
  it('calculates confidence intervals', () => {
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const y = x.map((xi) => 2 * xi + 1 + (Math.random() - 0.5) * 2)
    const regression = linearRegression(x, y)
    const ci = regressionConfidenceIntervals(regression, x.length)

    // Slope CI should contain the true slope (approximately)
    expect(ci.slope.lower).toBeLessThan(ci.slope.upper)
    expect(ci.intercept.lower).toBeLessThan(ci.intercept.upper)
  })
})

// ============================================================================
// Residual Tests
// ============================================================================

describe('calculateResiduals', () => {
  it('calculates residuals correctly', () => {
    const x = [1, 2, 3]
    const y = [4, 5, 7] // Actual values
    // With slope=1.5, intercept=2: predictions are [3.5, 5, 6.5]
    // Residuals: [4-3.5, 5-5, 7-6.5] = [0.5, 0, 0.5]
    const residuals = calculateResiduals(x, y, 1.5, 2)
    expect(residuals[0]).toBeCloseTo(0.5, 6)
    expect(residuals[1]).toBeCloseTo(0, 6)
    expect(residuals[2]).toBeCloseTo(0.5, 6)
  })

  it('returns zero residuals for perfect fit', () => {
    const x = [1, 2, 3]
    const y = [3, 5, 7] // y = 2x + 1
    const residuals = calculateResiduals(x, y, 2, 1)
    residuals.forEach((r) => expect(r).toBeCloseTo(0, 6))
  })
})

describe('analyzeResiduals', () => {
  it('calculates residual statistics', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [2, 4.5, 5.5, 8, 10.5] // Noisy y = 2x
    const regression = linearRegression(x, y)
    const analysis = analyzeResiduals(x, y, regression.slope, regression.intercept)

    expect(analysis.residuals.length).toBe(5)
    expect(analysis.sumOfSquaredResiduals).toBeGreaterThan(0)
    expect(analysis.standardError).toBeGreaterThan(0)
    expect(analysis.meanAbsoluteError).toBeGreaterThan(0)
  })
})

describe('standardErrorOfEstimate', () => {
  it('calculates SEE correctly', () => {
    const residuals = [1, -1, 2, -2, 0]
    // SSE = 1 + 1 + 4 + 4 + 0 = 10
    // SEE = sqrt(10 / (5 - 2)) = sqrt(10/3) ≈ 1.826
    expect(standardErrorOfEstimate(residuals, 5)).toBeCloseTo(1.826, 2)
  })

  it('returns 0 for n <= 2', () => {
    expect(standardErrorOfEstimate([1, 2], 2)).toBe(0)
    expect(standardErrorOfEstimate([1], 1)).toBe(0)
  })
})

// ============================================================================
// Influence and Outlier Tests
// ============================================================================

describe('cooksDistance', () => {
  it('calculates Cook\'s distance for each point', () => {
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const y = [2, 4, 6, 8, 10, 12, 14, 16, 18, 100] // Last point is outlier
    const distances = cooksDistance(x, y)

    expect(distances.length).toBe(10)
    // The last point should have the highest Cook's distance
    expect(distances[9]).toBeGreaterThan(distances[0]!)
    expect(distances[9]).toBeGreaterThan(distances[4]!)
  })

  it('returns zeros for less than 3 points', () => {
    const distances = cooksDistance([1, 2], [2, 4])
    expect(distances).toEqual([0, 0])
  })
})

describe('identifyOutliers', () => {
  it('identifies outliers based on standardized residuals', () => {
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const y = [2, 4, 6, 8, 10, 12, 14, 16, 18, 100] // Last point is outlier
    const outliers = identifyOutliers(x, y, 2)

    expect(outliers).toContain(9) // Index of outlier
  })

  it('returns empty array when no outliers', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [2, 4, 6, 8, 10] // Perfect linear
    const outliers = identifyOutliers(x, y)

    expect(outliers).toEqual([])
  })

  it('returns empty array for less than 3 points', () => {
    expect(identifyOutliers([1, 2], [2, 4])).toEqual([])
  })
})

// ============================================================================
// Utility Function Tests
// ============================================================================

describe('totalSumOfSquares', () => {
  it('calculates TSS correctly', () => {
    const y = [2, 4, 6, 8, 10] // mean = 6
    // TSS = (2-6)² + (4-6)² + (6-6)² + (8-6)² + (10-6)²
    //     = 16 + 4 + 0 + 4 + 16 = 40
    expect(totalSumOfSquares(y)).toBeCloseTo(40, 6)
  })
})

describe('rSquaredFromResiduals', () => {
  it('calculates R² from residuals', () => {
    const y = [2, 4, 6, 8, 10]
    const residuals = [0, 0, 0, 0, 0] // Perfect fit
    expect(rSquaredFromResiduals(residuals, y)).toBeCloseTo(1, 6)
  })

  it('returns lower R² for larger residuals', () => {
    const y = [2, 4, 6, 8, 10]
    const residuals = [1, -1, 1, -1, 1]
    const rSq = rSquaredFromResiduals(residuals, y)
    expect(rSq).toBeGreaterThan(0)
    expect(rSq).toBeLessThan(1)
  })
})

describe('generateRegressionLinePoints', () => {
  it('generates line points correctly', () => {
    const points = generateRegressionLinePoints(2, 1, 0, 10, 3)

    expect(points.length).toBe(3)
    expect(points[0]).toEqual({ x: 0, y: 1 })
    expect(points[1]).toEqual({ x: 5, y: 11 })
    expect(points[2]).toEqual({ x: 10, y: 21 })
  })
})

describe('pointsToArrays', () => {
  it('converts points to arrays', () => {
    const points = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
    ]
    const { x, y } = pointsToArrays(points)

    expect(x).toEqual([1, 3, 5])
    expect(y).toEqual([2, 4, 6])
  })
})

describe('arraysToPoints', () => {
  it('converts arrays to points', () => {
    const x = [1, 3, 5]
    const y = [2, 4, 6]
    const points = arraysToPoints(x, y)

    expect(points).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
    ])
  })

  it('throws for mismatched arrays', () => {
    expect(() => arraysToPoints([1, 2, 3], [1, 2])).toThrow('same length')
  })
})

// ============================================================================
// Anscombe's Quartet Tests
// ============================================================================

describe('anscombesQuartet', () => {
  it('has four datasets', () => {
    expect(anscombesQuartet.length).toBe(4)
  })

  it('all datasets have 11 points', () => {
    anscombesQuartet.forEach((dataset) => {
      expect(dataset.points.length).toBe(11)
    })
  })

  it('all datasets have approximately the same statistics', () => {
    const stats = anscombesQuartet.map((dataset) => {
      const { x, y } = pointsToArrays(dataset.points)
      return {
        xMean: mean(x),
        yMean: mean(y),
        r: pearsonCorrelation(x, y),
        regression: linearRegression(x, y),
      }
    })

    // All should have similar means
    stats.forEach((s) => {
      expect(s.xMean).toBeCloseTo(9, 0)
      expect(s.yMean).toBeCloseTo(7.5, 0)
    })

    // All should have similar correlations (~0.816)
    stats.forEach((s) => {
      expect(Math.abs(s.r)).toBeCloseTo(0.816, 1)
    })

    // All should have similar regression lines (y ≈ 0.5x + 3)
    stats.forEach((s) => {
      expect(s.regression.slope).toBeCloseTo(0.5, 0)
      expect(s.regression.intercept).toBeCloseTo(3, 0)
    })
  })
})

describe('getAnscombeDatasetById', () => {
  it('returns dataset by ID', () => {
    const dataset = getAnscombeDatasetById('anscombe-1')
    expect(dataset?.name).toBe('Anscombe I')
  })

  it('returns undefined for invalid ID', () => {
    expect(getAnscombeDatasetById('invalid')).toBeUndefined()
  })
})

// ============================================================================
// Correlation Presets Tests
// ============================================================================

describe('correlationPresets', () => {
  it('has multiple presets', () => {
    expect(correlationPresets.length).toBeGreaterThan(5)
  })

  it('each preset has required properties', () => {
    correlationPresets.forEach((preset) => {
      expect(preset.id).toBeDefined()
      expect(preset.name).toBeDefined()
      expect(preset.description).toBeDefined()
      expect(preset.points.length).toBeGreaterThan(0)
      expect(preset.lesson).toBeDefined()
    })
  })

  it('strong positive preset has high correlation', () => {
    const preset = getCorrelationPresetById('strong-positive')
    expect(preset).toBeDefined()
    const { x, y } = pointsToArrays(preset!.points)
    const r = pearsonCorrelation(x, y)
    expect(r).toBeGreaterThan(0.8)
  })

  it('strong negative preset has negative correlation', () => {
    const preset = getCorrelationPresetById('strong-negative')
    expect(preset).toBeDefined()
    const { x, y } = pointsToArrays(preset!.points)
    const r = pearsonCorrelation(x, y)
    expect(r).toBeLessThan(-0.8)
  })

  it('no correlation preset has near-zero correlation', () => {
    const preset = getCorrelationPresetById('no-correlation')
    expect(preset).toBeDefined()
    const { x, y } = pointsToArrays(preset!.points)
    const r = pearsonCorrelation(x, y)
    expect(Math.abs(r)).toBeLessThan(0.3)
  })
})

describe('getCorrelationPresetById', () => {
  it('returns preset by ID', () => {
    const preset = getCorrelationPresetById('strong-positive')
    expect(preset?.name).toBe('Strong Positive')
  })

  it('returns undefined for invalid ID', () => {
    expect(getCorrelationPresetById('invalid')).toBeUndefined()
  })
})

// ============================================================================
// Formatting Function Tests
// ============================================================================

describe('formatCorrelation', () => {
  it('formats correlation to 3 decimal places', () => {
    expect(formatCorrelation(0.12345)).toBe('0.123')
    expect(formatCorrelation(-0.98765)).toBe('-0.988')
    expect(formatCorrelation(1)).toBe('1.000')
  })
})

describe('formatRSquared', () => {
  it('formats R² as percentage', () => {
    expect(formatRSquared(0.5)).toBe('50.0%')
    expect(formatRSquared(0.816)).toBe('81.6%')
    expect(formatRSquared(1)).toBe('100.0%')
  })
})

describe('formatRegressionEquation', () => {
  it('formats positive intercept', () => {
    expect(formatRegressionEquation(2, 3)).toBe('ŷ = 2.000x + 3.000')
  })

  it('formats negative intercept', () => {
    expect(formatRegressionEquation(2, -3)).toBe('ŷ = 2.000x - 3.000')
  })

  it('formats negative slope', () => {
    expect(formatRegressionEquation(-1.5, 10)).toBe('ŷ = -1.500x + 10.000')
  })
})

// ============================================================================
// Edge Cases and Error Handling
// ============================================================================

describe('edge cases', () => {
  it('handles two-point regression', () => {
    const x = [1, 5]
    const y = [2, 10]
    const result = linearRegression(x, y)

    expect(result.slope).toBeCloseTo(2, 6)
    expect(result.intercept).toBeCloseTo(0, 6)
    expect(result.r).toBeCloseTo(1, 6)
  })

  it('handles negative values', () => {
    const x = [-5, -3, -1, 1, 3, 5]
    const y = [-10, -6, -2, 2, 6, 10]
    const result = linearRegression(x, y)

    expect(result.slope).toBeCloseTo(2, 6)
    expect(result.intercept).toBeCloseTo(0, 6)
  })

  it('handles very small values', () => {
    const x = [0.001, 0.002, 0.003, 0.004, 0.005]
    const y = [0.002, 0.004, 0.006, 0.008, 0.010]
    const result = linearRegression(x, y)

    expect(result.slope).toBeCloseTo(2, 4)
    expect(result.r).toBeCloseTo(1, 6)
  })

  it('handles very large values', () => {
    const x = [1000000, 2000000, 3000000, 4000000, 5000000]
    const y = [2000000, 4000000, 6000000, 8000000, 10000000]
    const result = linearRegression(x, y)

    expect(result.slope).toBeCloseTo(2, 6)
    expect(result.r).toBeCloseTo(1, 6)
  })
})
