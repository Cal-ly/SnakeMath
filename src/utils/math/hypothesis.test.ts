import { describe, it, expect } from 'vitest'
import {
  // T-distribution functions
  tDistributionPdf,
  tDistributionCdf,
  tDistributionQuantile,
  tCriticalValue,
  logGamma,
  regularizedIncompleteBeta,
  // Tests
  oneSampleTTest,
  twoSampleTTest,
  onePropZTest,
  twoPropZTest,
  // Effect size
  cohensD,
  cohensDTwoGroups,
  interpretCohensD,
  cohensH,
  interpretCohensH,
  // Power analysis
  calculatePower,
  sampleSizeForPower,
  sampleSizeForProportions,
  generatePowerCurve,
  // Presets and utilities
  hypothesisTestPresets,
  getHypothesisTestPresetById,
  formatPValue,
  getSignificanceStars,
  describeTestResult,
  checkTestAssumptions,
} from './hypothesis'

// ============================================================================
// T-Distribution Functions
// ============================================================================

describe('tDistributionPdf', () => {
  it('returns correct PDF at t=0 for various df', () => {
    // At t=0, PDF has its maximum
    expect(tDistributionPdf(0, 1)).toBeCloseTo(0.3183, 3) // Cauchy
    expect(tDistributionPdf(0, 10)).toBeCloseTo(0.3891, 3)
    expect(tDistributionPdf(0, 30)).toBeCloseTo(0.3957, 3)
  })

  it('is symmetric around zero', () => {
    expect(tDistributionPdf(-2, 10)).toBeCloseTo(tDistributionPdf(2, 10), 10)
    expect(tDistributionPdf(-1.5, 5)).toBeCloseTo(tDistributionPdf(1.5, 5), 10)
  })

  it('decreases as |t| increases', () => {
    expect(tDistributionPdf(0, 10)).toBeGreaterThan(tDistributionPdf(1, 10))
    expect(tDistributionPdf(1, 10)).toBeGreaterThan(tDistributionPdf(2, 10))
  })

  it('approaches standard normal as df increases', () => {
    const normalPdfAt0 = 1 / Math.sqrt(2 * Math.PI) // ~0.3989
    expect(tDistributionPdf(0, 1000)).toBeCloseTo(normalPdfAt0, 2)
  })

  it('throws for non-positive df', () => {
    expect(() => tDistributionPdf(0, 0)).toThrow()
    expect(() => tDistributionPdf(0, -1)).toThrow()
  })
})

describe('tDistributionCdf', () => {
  it('returns 0.5 at t=0 (symmetric)', () => {
    expect(tDistributionCdf(0, 1)).toBeCloseTo(0.5, 4)
    expect(tDistributionCdf(0, 10)).toBeCloseTo(0.5, 4)
    expect(tDistributionCdf(0, 100)).toBeCloseTo(0.5, 4)
  })

  it('returns correct values for known cases', () => {
    // t(10), t = 2.228 corresponds to 97.5th percentile
    expect(tDistributionCdf(2.228, 10)).toBeCloseTo(0.975, 2)
    // t(30), t = 2.042 corresponds to 97.5th percentile
    expect(tDistributionCdf(2.042, 30)).toBeCloseTo(0.975, 2)
  })

  it('is monotonically increasing', () => {
    expect(tDistributionCdf(-2, 10)).toBeLessThan(tDistributionCdf(0, 10))
    expect(tDistributionCdf(0, 10)).toBeLessThan(tDistributionCdf(2, 10))
  })

  it('approaches 0 for large negative t', () => {
    expect(tDistributionCdf(-10, 10)).toBeLessThan(0.001)
  })

  it('approaches 1 for large positive t', () => {
    expect(tDistributionCdf(10, 10)).toBeGreaterThan(0.999)
  })

  it('approaches standard normal CDF as df increases', () => {
    // For df=1000, should be very close to standard normal
    expect(tDistributionCdf(1.96, 1000)).toBeCloseTo(0.975, 2)
  })
})

describe('tDistributionQuantile', () => {
  it('returns 0 at p=0.5', () => {
    expect(tDistributionQuantile(0.5, 10)).toBeCloseTo(0, 4)
    expect(tDistributionQuantile(0.5, 30)).toBeCloseTo(0, 4)
  })

  it('returns correct values for known percentiles', () => {
    // t(10) at 97.5th percentile
    expect(tDistributionQuantile(0.975, 10)).toBeCloseTo(2.228, 2)
    // t(30) at 97.5th percentile
    expect(tDistributionQuantile(0.975, 30)).toBeCloseTo(2.042, 2)
  })

  it('is inverse of CDF', () => {
    const df = 15
    const t = 1.5
    const p = tDistributionCdf(t, df)
    expect(tDistributionQuantile(p, df)).toBeCloseTo(t, 3)
  })

  it('throws for invalid p', () => {
    expect(() => tDistributionQuantile(0, 10)).toThrow()
    expect(() => tDistributionQuantile(1, 10)).toThrow()
    expect(() => tDistributionQuantile(-0.1, 10)).toThrow()
    expect(() => tDistributionQuantile(1.1, 10)).toThrow()
  })
})

describe('tCriticalValue', () => {
  it('returns correct two-tailed critical values', () => {
    // df=10, alpha=0.05: t_crit ≈ 2.228
    expect(tCriticalValue(10, 0.05, true)).toBeCloseTo(2.228, 2)
    // df=30, alpha=0.05: t_crit ≈ 2.042
    expect(tCriticalValue(30, 0.05, true)).toBeCloseTo(2.042, 2)
  })

  it('returns correct one-tailed critical values', () => {
    // df=10, alpha=0.05, one-tailed: t_crit ≈ 1.812
    expect(tCriticalValue(10, 0.05, false)).toBeCloseTo(1.812, 2)
  })

  it('larger alpha means smaller critical value', () => {
    expect(tCriticalValue(10, 0.05)).toBeGreaterThan(tCriticalValue(10, 0.10))
  })

  it('throws for invalid alpha', () => {
    expect(() => tCriticalValue(10, 0)).toThrow()
    expect(() => tCriticalValue(10, 1)).toThrow()
  })

  it('throws for non-positive df', () => {
    expect(() => tCriticalValue(0, 0.05)).toThrow()
    expect(() => tCriticalValue(-5, 0.05)).toThrow()
  })
})

// ============================================================================
// Helper Functions
// ============================================================================

describe('logGamma', () => {
  it('returns correct values for positive integers', () => {
    // log(Γ(n)) = log((n-1)!)
    expect(logGamma(1)).toBeCloseTo(0, 5) // log(0!) = 0
    expect(logGamma(2)).toBeCloseTo(0, 5) // log(1!) = 0
    expect(logGamma(3)).toBeCloseTo(Math.log(2), 5) // log(2!)
    expect(logGamma(5)).toBeCloseTo(Math.log(24), 5) // log(4!)
  })

  it('returns correct values for half-integers', () => {
    // Γ(0.5) = √π
    expect(logGamma(0.5)).toBeCloseTo(Math.log(Math.sqrt(Math.PI)), 4)
    // Γ(1.5) = 0.5 * √π
    expect(logGamma(1.5)).toBeCloseTo(Math.log(0.5 * Math.sqrt(Math.PI)), 4)
  })
})

describe('regularizedIncompleteBeta', () => {
  it('returns 0 for x=0', () => {
    expect(regularizedIncompleteBeta(0, 2, 3)).toBe(0)
  })

  it('returns 1 for x=1', () => {
    expect(regularizedIncompleteBeta(1, 2, 3)).toBe(1)
  })

  it('returns correct values for known cases', () => {
    // I_{0.5}(1, 1) = 0.5 (uniform distribution)
    expect(regularizedIncompleteBeta(0.5, 1, 1)).toBeCloseTo(0.5, 4)
    // I_{0.5}(2, 2) = 0.5 (symmetric beta)
    expect(regularizedIncompleteBeta(0.5, 2, 2)).toBeCloseTo(0.5, 4)
  })

  it('throws for x outside [0, 1]', () => {
    expect(() => regularizedIncompleteBeta(-0.1, 2, 3)).toThrow()
    expect(() => regularizedIncompleteBeta(1.1, 2, 3)).toThrow()
  })
})

// ============================================================================
// One-Sample T-Test
// ============================================================================

describe('oneSampleTTest', () => {
  it('calculates correct t-statistic', () => {
    const result = oneSampleTTest({
      sampleMean: 105,
      sampleStdDev: 15,
      sampleSize: 25,
      hypothesizedMean: 100,
    })

    // t = (105 - 100) / (15 / √25) = 5 / 3 ≈ 1.667
    expect(result.tStatistic).toBeCloseTo(1.667, 2)
    expect(result.degreesOfFreedom).toBe(24)
  })

  it('detects significant difference', () => {
    const result = oneSampleTTest({
      sampleMean: 110,
      sampleStdDev: 10,
      sampleSize: 30,
      hypothesizedMean: 100,
    })

    expect(result.rejectNull).toBe(true)
    expect(result.pValue).toBeLessThan(0.05)
  })

  it('fails to reject when difference is small', () => {
    const result = oneSampleTTest({
      sampleMean: 101,
      sampleStdDev: 20,
      sampleSize: 20,
      hypothesizedMean: 100,
    })

    expect(result.rejectNull).toBe(false)
    expect(result.pValue).toBeGreaterThan(0.05)
  })

  it('respects alternative hypothesis: greater', () => {
    const result = oneSampleTTest({
      sampleMean: 105,
      sampleStdDev: 15,
      sampleSize: 30,
      hypothesizedMean: 100,
      alternative: 'greater',
    })

    expect(result.alternative).toBe('greater')
    // One-tailed p-value should be half of two-tailed for positive t
    const twoSided = oneSampleTTest({
      sampleMean: 105,
      sampleStdDev: 15,
      sampleSize: 30,
      hypothesizedMean: 100,
      alternative: 'two-sided',
    })
    expect(result.pValue).toBeCloseTo(twoSided.pValue / 2, 4)
  })

  it('respects alternative hypothesis: less', () => {
    const result = oneSampleTTest({
      sampleMean: 95,
      sampleStdDev: 15,
      sampleSize: 30,
      hypothesizedMean: 100,
      alternative: 'less',
    })

    expect(result.alternative).toBe('less')
    expect(result.pValue).toBeLessThan(0.5) // Should be significant in this direction
  })

  it('calculates correct confidence interval', () => {
    const result = oneSampleTTest({
      sampleMean: 100,
      sampleStdDev: 10,
      sampleSize: 25,
      hypothesizedMean: 95,
    })

    // CI should contain the sample mean
    expect(result.confidenceInterval.lower).toBeLessThan(100)
    expect(result.confidenceInterval.upper).toBeGreaterThan(100)
    expect(result.confidenceLevel).toBe(0.95)
  })

  it('calculates effect size (Cohen\'s d)', () => {
    const result = oneSampleTTest({
      sampleMean: 108,
      sampleStdDev: 10,
      sampleSize: 30,
      hypothesizedMean: 100,
    })

    // d = (108 - 100) / 10 = 0.8
    expect(result.effectSize).toBeCloseTo(0.8, 2)
    expect(result.effectSizeInterpretation).toBe('large')
  })

  it('handles zero standard deviation', () => {
    const result = oneSampleTTest({
      sampleMean: 100,
      sampleStdDev: 0,
      sampleSize: 10,
      hypothesizedMean: 100,
    })

    expect(result.tStatistic).toBe(0)
    expect(result.pValue).toBe(1)
    expect(result.rejectNull).toBe(false)
  })

  it('throws for invalid input', () => {
    expect(() =>
      oneSampleTTest({
        sampleMean: 100,
        sampleStdDev: 10,
        sampleSize: 1, // Too small
        hypothesizedMean: 95,
      })
    ).toThrow()

    expect(() =>
      oneSampleTTest({
        sampleMean: 100,
        sampleStdDev: -5, // Negative
        sampleSize: 30,
        hypothesizedMean: 95,
      })
    ).toThrow()
  })

  it('uses custom alpha level', () => {
    const result = oneSampleTTest({
      sampleMean: 103,
      sampleStdDev: 10,
      sampleSize: 30,
      hypothesizedMean: 100,
      alpha: 0.01,
    })

    expect(result.alpha).toBe(0.01)
    expect(result.confidenceLevel).toBe(0.99)
  })
})

// ============================================================================
// Two-Sample T-Test (Welch's)
// ============================================================================

describe('twoSampleTTest', () => {
  it('calculates correct t-statistic (Welch\'s)', () => {
    const result = twoSampleTTest({
      mean1: 85,
      stdDev1: 10,
      n1: 30,
      mean2: 80,
      stdDev2: 12,
      n2: 35,
    })

    // t = (85 - 80) / √(100/30 + 144/35) ≈ 1.87
    expect(result.tStatistic).toBeCloseTo(1.87, 1)
    expect(result.testType).toBe('two-sample-t')
  })

  it('calculates Welch-Satterthwaite degrees of freedom', () => {
    const result = twoSampleTTest({
      mean1: 85,
      stdDev1: 10,
      n1: 30,
      mean2: 80,
      stdDev2: 12,
      n2: 35,
    })

    // df should be between min(n1-1, n2-1) and n1+n2-2
    expect(result.degreesOfFreedom).toBeGreaterThan(29)
    expect(result.degreesOfFreedom).toBeLessThan(63)
  })

  it('detects significant difference', () => {
    const result = twoSampleTTest({
      mean1: 90,
      stdDev1: 8,
      n1: 50,
      mean2: 80,
      stdDev2: 10,
      n2: 50,
    })

    expect(result.rejectNull).toBe(true)
    expect(result.pValue).toBeLessThan(0.05)
  })

  it('fails to reject when groups are similar', () => {
    const result = twoSampleTTest({
      mean1: 80.5,
      stdDev1: 15,
      n1: 30,
      mean2: 80,
      stdDev2: 15,
      n2: 30,
    })

    expect(result.rejectNull).toBe(false)
    expect(result.pValue).toBeGreaterThan(0.05)
  })

  it('calculates confidence interval for difference', () => {
    const result = twoSampleTTest({
      mean1: 85,
      stdDev1: 10,
      n1: 30,
      mean2: 80,
      stdDev2: 10,
      n2: 30,
    })

    // Difference is 5, CI should contain 5
    const diff = 85 - 80
    expect(result.confidenceInterval.lower).toBeLessThan(diff)
    expect(result.confidenceInterval.upper).toBeGreaterThan(diff)
  })

  it('calculates Cohen\'s d with pooled SD', () => {
    const result = twoSampleTTest({
      mean1: 85,
      stdDev1: 10,
      n1: 30,
      mean2: 80,
      stdDev2: 10,
      n2: 30,
    })

    // d = (85 - 80) / 10 = 0.5
    expect(result.effectSize).toBeCloseTo(0.5, 1)
    expect(result.effectSizeInterpretation).toBe('medium')
  })

  it('handles equal variances (same as Welch\'s)', () => {
    const result = twoSampleTTest({
      mean1: 100,
      stdDev1: 15,
      n1: 25,
      mean2: 100,
      stdDev2: 15,
      n2: 25,
    })

    expect(result.tStatistic).toBeCloseTo(0, 4)
    expect(result.pValue).toBeCloseTo(1, 2)
  })

  it('handles unequal variances', () => {
    const result = twoSampleTTest({
      mean1: 100,
      stdDev1: 5,
      n1: 20,
      mean2: 100,
      stdDev2: 20,
      n2: 20,
    })

    // With very different variances, Welch's df adjustment should be notable
    expect(result.degreesOfFreedom).toBeLessThan(38) // Less than n1+n2-2
  })

  it('throws for invalid input', () => {
    expect(() =>
      twoSampleTTest({
        mean1: 100,
        stdDev1: 10,
        n1: 1, // Too small
        mean2: 100,
        stdDev2: 10,
        n2: 30,
      })
    ).toThrow()
  })
})

// ============================================================================
// One-Proportion Z-Test
// ============================================================================

describe('onePropZTest', () => {
  it('calculates correct z-statistic', () => {
    const result = onePropZTest({
      successes: 55,
      sampleSize: 100,
      hypothesizedProportion: 0.5,
    })

    // z = (0.55 - 0.5) / √(0.5 * 0.5 / 100) = 0.05 / 0.05 = 1
    expect(result.zStatistic).toBeCloseTo(1, 2)
    expect(result.testType).toBe('one-prop-z')
  })

  it('detects significant difference from hypothesized proportion', () => {
    const result = onePropZTest({
      successes: 65,
      sampleSize: 100,
      hypothesizedProportion: 0.5,
    })

    expect(result.rejectNull).toBe(true)
    expect(result.pValue).toBeLessThan(0.05)
  })

  it('fails to reject when close to hypothesized', () => {
    const result = onePropZTest({
      successes: 52,
      sampleSize: 100,
      hypothesizedProportion: 0.5,
    })

    expect(result.rejectNull).toBe(false)
    expect(result.pValue).toBeGreaterThan(0.05)
  })

  it('handles one-tailed alternative: greater', () => {
    const result = onePropZTest({
      successes: 60,
      sampleSize: 100,
      hypothesizedProportion: 0.5,
      alternative: 'greater',
    })

    expect(result.alternative).toBe('greater')
    // One-tailed should have lower p-value for positive effect
    const twoSided = onePropZTest({
      successes: 60,
      sampleSize: 100,
      hypothesizedProportion: 0.5,
      alternative: 'two-sided',
    })
    expect(result.pValue).toBeCloseTo(twoSided.pValue / 2, 4)
  })

  it('calculates confidence interval for proportion', () => {
    const result = onePropZTest({
      successes: 60,
      sampleSize: 100,
      hypothesizedProportion: 0.5,
    })

    // Sample proportion is 0.6
    expect(result.confidenceInterval.lower).toBeLessThan(0.6)
    expect(result.confidenceInterval.upper).toBeGreaterThan(0.6)
    // CI should be within [0, 1]
    expect(result.confidenceInterval.lower).toBeGreaterThanOrEqual(0)
    expect(result.confidenceInterval.upper).toBeLessThanOrEqual(1)
  })

  it('calculates Cohen\'s h effect size', () => {
    const result = onePropZTest({
      successes: 60,
      sampleSize: 100,
      hypothesizedProportion: 0.5,
    })

    // h = 2 * (arcsin(√0.6) - arcsin(√0.5)) ≈ 0.2
    expect(result.effectSize).toBeCloseTo(0.2, 1)
    expect(result.effectSizeInterpretation).toBe('small')
  })

  it('throws for invalid proportion', () => {
    expect(() =>
      onePropZTest({
        successes: 50,
        sampleSize: 100,
        hypothesizedProportion: 0, // Invalid
      })
    ).toThrow()

    expect(() =>
      onePropZTest({
        successes: 50,
        sampleSize: 100,
        hypothesizedProportion: 1, // Invalid
      })
    ).toThrow()
  })

  it('throws for invalid successes', () => {
    expect(() =>
      onePropZTest({
        successes: -5, // Invalid
        sampleSize: 100,
        hypothesizedProportion: 0.5,
      })
    ).toThrow()

    expect(() =>
      onePropZTest({
        successes: 150, // > n
        sampleSize: 100,
        hypothesizedProportion: 0.5,
      })
    ).toThrow()
  })
})

// ============================================================================
// Two-Proportion Z-Test
// ============================================================================

describe('twoPropZTest', () => {
  it('calculates correct z-statistic', () => {
    const result = twoPropZTest({
      successes1: 60,
      n1: 100,
      successes2: 40,
      n2: 100,
    })

    // Pooled p = 100/200 = 0.5
    // SE = √(0.5 * 0.5 * (1/100 + 1/100)) = √0.005 ≈ 0.0707
    // z = (0.6 - 0.4) / 0.0707 ≈ 2.83
    expect(result.zStatistic).toBeCloseTo(2.83, 1)
    expect(result.testType).toBe('two-prop-z')
  })

  it('detects significant difference between proportions', () => {
    const result = twoPropZTest({
      successes1: 65,
      n1: 100,
      successes2: 45,
      n2: 100,
    })

    expect(result.rejectNull).toBe(true)
    expect(result.pValue).toBeLessThan(0.05)
  })

  it('fails to reject when proportions are similar', () => {
    const result = twoPropZTest({
      successes1: 52,
      n1: 100,
      successes2: 48,
      n2: 100,
    })

    expect(result.rejectNull).toBe(false)
    expect(result.pValue).toBeGreaterThan(0.05)
  })

  it('calculates confidence interval for difference', () => {
    const result = twoPropZTest({
      successes1: 60,
      n1: 100,
      successes2: 50,
      n2: 100,
    })

    // Difference is 0.1 (10%)
    const diff = 0.6 - 0.5
    expect(result.confidenceInterval.lower).toBeLessThan(diff)
    expect(result.confidenceInterval.upper).toBeGreaterThan(diff)
  })

  it('calculates Cohen\'s h effect size', () => {
    const result = twoPropZTest({
      successes1: 60,
      n1: 100,
      successes2: 40,
      n2: 100,
    })

    // h should indicate medium effect (0.4 difference)
    expect(Math.abs(result.effectSize)).toBeGreaterThan(0.2)
    expect(result.effectSizeInterpretation).toBe('small') // or medium
  })

  it('handles A/B test scenario', () => {
    // Typical A/B test: 5% vs 5.5% conversion
    const result = twoPropZTest({
      successes1: 55,
      n1: 1000,
      successes2: 50,
      n2: 1000,
    })

    // Small effect, probably not significant with these sample sizes
    expect(result.effectSizeInterpretation).toBe('negligible')
  })

  it('handles unequal sample sizes', () => {
    const result = twoPropZTest({
      successes1: 30,
      n1: 50,
      successes2: 80,
      n2: 200,
    })

    // p1 = 0.6, p2 = 0.4, should be significant
    expect(result.rejectNull).toBe(true)
  })
})

// ============================================================================
// Effect Size Functions
// ============================================================================

describe('cohensD', () => {
  it('calculates correct d for simple case', () => {
    expect(cohensD(110, 100, 10)).toBe(1) // Large effect
    expect(cohensD(105, 100, 10)).toBe(0.5) // Medium effect
    expect(cohensD(102, 100, 10)).toBe(0.2) // Small effect
  })

  it('handles negative effects', () => {
    expect(cohensD(90, 100, 10)).toBe(-1)
  })

  it('returns 0 for zero stdDev', () => {
    expect(cohensD(100, 100, 0)).toBe(0)
  })
})

describe('cohensDTwoGroups', () => {
  it('calculates pooled d correctly', () => {
    // Equal variances, equal n
    const d = cohensDTwoGroups(110, 10, 30, 100, 10, 30)
    expect(d).toBeCloseTo(1, 2)
  })

  it('handles unequal variances', () => {
    const d = cohensDTwoGroups(110, 5, 30, 100, 15, 30)
    // Pooled SD = √((29*25 + 29*225)/58) = √125 ≈ 11.18
    // d = 10 / 11.18 ≈ 0.89
    expect(d).toBeCloseTo(0.89, 1)
  })
})

describe('interpretCohensD', () => {
  it('classifies effect sizes correctly', () => {
    expect(interpretCohensD(0.1)).toBe('negligible')
    expect(interpretCohensD(0.3)).toBe('small')
    expect(interpretCohensD(0.6)).toBe('medium')
    expect(interpretCohensD(1.0)).toBe('large')
  })

  it('handles negative values', () => {
    expect(interpretCohensD(-0.5)).toBe('medium')
  })
})

describe('cohensH', () => {
  it('calculates correct h for proportion differences', () => {
    // h = 2 * (arcsin(√0.6) - arcsin(√0.4))
    const h = cohensH(0.6, 0.4)
    expect(Math.abs(h)).toBeCloseTo(0.41, 1)
  })

  it('returns 0 for equal proportions', () => {
    expect(cohensH(0.5, 0.5)).toBe(0)
  })

  it('handles extreme proportions', () => {
    expect(() => cohensH(0.1, 0.9)).not.toThrow()
    expect(Math.abs(cohensH(0.1, 0.9))).toBeGreaterThan(1)
  })

  it('throws for invalid proportions', () => {
    expect(() => cohensH(-0.1, 0.5)).toThrow()
    expect(() => cohensH(0.5, 1.5)).toThrow()
  })
})

describe('interpretCohensH', () => {
  it('classifies effect sizes correctly', () => {
    expect(interpretCohensH(0.1)).toBe('negligible')
    expect(interpretCohensH(0.3)).toBe('small')
    expect(interpretCohensH(0.6)).toBe('medium')
    expect(interpretCohensH(1.0)).toBe('large')
  })
})

// ============================================================================
// Power Analysis
// ============================================================================

describe('calculatePower', () => {
  it('returns alpha when effect size is 0', () => {
    expect(calculatePower(0, 100, 0.05)).toBeCloseTo(0.05, 2)
  })

  it('increases with effect size', () => {
    const power1 = calculatePower(0.2, 100)
    const power2 = calculatePower(0.5, 100)
    const power3 = calculatePower(0.8, 100)

    expect(power1).toBeLessThan(power2)
    expect(power2).toBeLessThan(power3)
  })

  it('increases with sample size', () => {
    const power1 = calculatePower(0.5, 20)
    const power2 = calculatePower(0.5, 50)
    const power3 = calculatePower(0.5, 100)

    expect(power1).toBeLessThan(power2)
    expect(power2).toBeLessThan(power3)
  })

  it('approaches 1 for large samples and effects', () => {
    const power = calculatePower(1.0, 200)
    expect(power).toBeGreaterThan(0.99)
  })

  it('handles one-sample test', () => {
    const oneSample = calculatePower(0.5, 50, 0.05, 'one-sample')
    const twoSample = calculatePower(0.5, 50, 0.05, 'two-sample')

    // One-sample should have higher power for same n because all n in one group
    expect(oneSample).toBeGreaterThan(twoSample)
  })

  it('returns value between 0 and 1', () => {
    const power = calculatePower(0.3, 50)
    expect(power).toBeGreaterThanOrEqual(0)
    expect(power).toBeLessThanOrEqual(1)
  })
})

describe('sampleSizeForPower', () => {
  it('calculates sample size for 80% power', () => {
    const n = sampleSizeForPower(0.5, 0.8, 0.05, 'two-sample')
    // For d=0.5, 80% power, α=0.05, should need ~64 per group
    expect(n).toBeGreaterThan(50)
    expect(n).toBeLessThan(100)
  })

  it('larger effect needs smaller sample', () => {
    const n1 = sampleSizeForPower(0.2, 0.8)
    const n2 = sampleSizeForPower(0.5, 0.8)
    const n3 = sampleSizeForPower(0.8, 0.8)

    expect(n1).toBeGreaterThan(n2)
    expect(n2).toBeGreaterThan(n3)
  })

  it('higher power needs larger sample', () => {
    const n1 = sampleSizeForPower(0.5, 0.7)
    const n2 = sampleSizeForPower(0.5, 0.8)
    const n3 = sampleSizeForPower(0.5, 0.9)

    expect(n1).toBeLessThan(n2)
    expect(n2).toBeLessThan(n3)
  })

  it('achieves target power', () => {
    const n = sampleSizeForPower(0.5, 0.8, 0.05, 'two-sample')
    const achievedPower = calculatePower(0.5, n, 0.05, 'two-sample')
    expect(achievedPower).toBeGreaterThanOrEqual(0.8)
  })

  it('throws for zero effect size', () => {
    expect(() => sampleSizeForPower(0, 0.8)).toThrow()
  })

  it('throws for invalid power', () => {
    expect(() => sampleSizeForPower(0.5, 0)).toThrow()
    expect(() => sampleSizeForPower(0.5, 1)).toThrow()
  })
})

describe('sampleSizeForProportions', () => {
  it('calculates sample size for proportion comparison', () => {
    const n = sampleSizeForProportions(0.6, 0.5, 0.8, 0.05)
    // For 10% difference, should need substantial sample
    expect(n).toBeGreaterThan(100)
  })

  it('larger difference needs smaller sample', () => {
    const n1 = sampleSizeForProportions(0.55, 0.5, 0.8)
    const n2 = sampleSizeForProportions(0.6, 0.5, 0.8)
    const n3 = sampleSizeForProportions(0.7, 0.5, 0.8)

    expect(n1).toBeGreaterThan(n2)
    expect(n2).toBeGreaterThan(n3)
  })

  it('throws for equal proportions', () => {
    expect(() => sampleSizeForProportions(0.5, 0.5, 0.8)).toThrow()
  })

  it('throws for invalid proportions', () => {
    expect(() => sampleSizeForProportions(0, 0.5, 0.8)).toThrow()
    expect(() => sampleSizeForProportions(0.5, 1, 0.8)).toThrow()
  })
})

describe('generatePowerCurve', () => {
  it('returns array of power points', () => {
    const curve = generatePowerCurve(0.5)
    expect(curve.length).toBeGreaterThan(0)
    expect(curve[0]).toHaveProperty('n')
    expect(curve[0]).toHaveProperty('power')
  })

  it('power increases along curve', () => {
    const curve = generatePowerCurve(0.5)
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i]!.power).toBeGreaterThanOrEqual(curve[i - 1]!.power)
    }
  })

  it('respects maxN parameter', () => {
    const curve = generatePowerCurve(0.5, 0.05, 'two-sample', 50)
    const lastPoint = curve[curve.length - 1]!
    expect(lastPoint.n).toBeLessThanOrEqual(50)
  })
})

// ============================================================================
// Presets
// ============================================================================

describe('hypothesisTestPresets', () => {
  it('contains expected presets', () => {
    const ids = hypothesisTestPresets.map((p) => p.id)
    expect(ids).toContain('ab-test')
    expect(ids).toContain('quality-control')
    expect(ids).toContain('drug-trial')
    expect(ids).toContain('benchmark')
    expect(ids).toContain('survey')
  })

  it('presets have required properties', () => {
    for (const preset of hypothesisTestPresets) {
      expect(preset).toHaveProperty('id')
      expect(preset).toHaveProperty('name')
      expect(preset).toHaveProperty('description')
      expect(preset).toHaveProperty('testType')
      expect(preset).toHaveProperty('scenario')
      expect(preset).toHaveProperty('data')
    }
  })
})

describe('getHypothesisTestPresetById', () => {
  it('returns preset by ID', () => {
    const preset = getHypothesisTestPresetById('ab-test')
    expect(preset).toBeDefined()
    expect(preset!.name).toBe('A/B Test')
    expect(preset!.testType).toBe('two-prop-z')
  })

  it('returns undefined for unknown ID', () => {
    expect(getHypothesisTestPresetById('unknown')).toBeUndefined()
  })
})

// ============================================================================
// Utility Functions
// ============================================================================

describe('formatPValue', () => {
  it('formats normal p-values', () => {
    expect(formatPValue(0.05)).toBe('0.0500')
    expect(formatPValue(0.0123)).toBe('0.0123')
  })

  it('uses scientific notation for very small values', () => {
    expect(formatPValue(0.0005)).toMatch(/e/)
    expect(formatPValue(0.00001)).toBe('< 0.0001')
  })
})

describe('getSignificanceStars', () => {
  it('returns correct stars', () => {
    expect(getSignificanceStars(0.0005)).toBe('***')
    expect(getSignificanceStars(0.005)).toBe('**')
    expect(getSignificanceStars(0.03)).toBe('*')
    expect(getSignificanceStars(0.1)).toBe('')
  })
})

describe('describeTestResult', () => {
  it('describes significant result', () => {
    const result = oneSampleTTest({
      sampleMean: 110,
      sampleStdDev: 10,
      sampleSize: 30,
      hypothesizedMean: 100,
    })

    const description = describeTestResult(result)
    expect(description).toContain('statistically significant')
    expect(description).toContain('effect size')
  })

  it('describes non-significant result', () => {
    const result = oneSampleTTest({
      sampleMean: 101,
      sampleStdDev: 20,
      sampleSize: 20,
      hypothesizedMean: 100,
    })

    const description = describeTestResult(result)
    expect(description).toContain('not statistically significant')
  })
})

describe('checkTestAssumptions', () => {
  it('warns for small sample size in t-test', () => {
    const check = checkTestAssumptions('one-sample-t', { sampleSize: 15 })
    expect(check.warnings.length).toBeGreaterThan(0)
    expect(check.warnings[0]).toContain('Sample size < 30')
  })

  it('no warnings for adequate sample', () => {
    const check = checkTestAssumptions('one-sample-t', { sampleSize: 50 })
    expect(check.valid).toBe(true)
    expect(check.warnings.length).toBe(0)
  })

  it('warns for proportion test with small expected counts', () => {
    const check = checkTestAssumptions('one-prop-z', {
      sampleSize: 20,
      hypothesizedProportion: 0.05,
    })
    expect(check.warnings.length).toBeGreaterThan(0)
  })
})
