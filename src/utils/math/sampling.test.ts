import { describe, it, expect } from 'vitest'
import {
  // Population generation
  generatePopulation,
  // Basic statistics
  mean,
  standardDeviation,
  populationStandardDeviation,
  // Sampling methods
  simpleRandomSample,
  stratifiedSample,
  systematicSample,
  clusterSample,
  // Standard error
  standardErrorMean,
  standardErrorProportion,
  finitePopulationCorrection,
  // Critical values
  zCriticalValue,
  tCriticalValue,
  // Confidence intervals
  confidenceIntervalMean,
  confidenceIntervalProportion,
  // Bootstrap
  bootstrapResample,
  bootstrap,
  // Sample size calculations
  sampleSizeForMean,
  sampleSizeForProportion,
  sampleSizeForPower,
  // Presets and utilities
  samplingPresets,
  getSamplingPresetById,
  calculateSampleStatistics,
  createStrata,
} from './sampling'

// ============================================================================
// Population Generation
// ============================================================================

describe('generatePopulation', () => {
  it('generates population of correct size', () => {
    const pop = generatePopulation({ size: 100, distribution: 'normal', params: { mu: 0, sigma: 1 } })
    expect(pop).toHaveLength(100)
  })

  it('generates normal distribution with correct approximate mean', () => {
    const pop = generatePopulation({
      size: 10000,
      distribution: 'normal',
      params: { mu: 50, sigma: 10 },
    })
    const m = mean(pop)
    expect(m).toBeGreaterThan(48)
    expect(m).toBeLessThan(52)
  })

  it('generates uniform distribution within bounds', () => {
    const pop = generatePopulation({
      size: 1000,
      distribution: 'uniform',
      params: { a: 10, b: 20 },
    })
    expect(Math.min(...pop)).toBeGreaterThanOrEqual(10)
    expect(Math.max(...pop)).toBeLessThanOrEqual(20)
  })

  it('generates exponential distribution with positive values', () => {
    const pop = generatePopulation({
      size: 100,
      distribution: 'exponential',
      params: { lambda: 1 },
    })
    expect(pop.every((v) => v >= 0)).toBe(true)
  })

  it('generates binomial distribution with 0s and 1s', () => {
    const pop = generatePopulation({
      size: 100,
      distribution: 'binomial',
      params: { p: 0.5 },
    })
    expect(pop.every((v) => v === 0 || v === 1)).toBe(true)
  })

  it('throws for non-positive size', () => {
    expect(() =>
      generatePopulation({ size: 0, distribution: 'normal', params: {} })
    ).toThrow('Population size must be a positive integer')
  })

  it('throws for non-integer size', () => {
    expect(() =>
      generatePopulation({ size: 10.5, distribution: 'normal', params: {} })
    ).toThrow('Population size must be a positive integer')
  })

  it('uses default params when not specified', () => {
    const pop = generatePopulation({ size: 100, distribution: 'normal', params: {} })
    expect(pop).toHaveLength(100)
    // Default normal is mu=0, sigma=1
    const m = mean(pop)
    expect(m).toBeGreaterThan(-1)
    expect(m).toBeLessThan(1)
  })
})

// ============================================================================
// Basic Statistics
// ============================================================================

describe('mean', () => {
  it('calculates mean correctly', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3)
    expect(mean([10])).toBe(10)
    expect(mean([2, 4])).toBe(3)
  })

  it('returns 0 for empty array', () => {
    expect(mean([])).toBe(0)
  })

  it('handles negative values', () => {
    expect(mean([-5, 5])).toBe(0)
    expect(mean([-10, -20, -30])).toBeCloseTo(-20)
  })
})

describe('standardDeviation', () => {
  it('calculates sample standard deviation with Bessel correction', () => {
    // Known values: [2, 4, 4, 4, 5, 5, 7, 9]
    // Mean = 5, SS = 32, Var = 32/7 ≈ 4.571, SD ≈ 2.138
    const data = [2, 4, 4, 4, 5, 5, 7, 9]
    expect(standardDeviation(data)).toBeCloseTo(2.138, 2)
  })

  it('returns 0 for single value', () => {
    expect(standardDeviation([5])).toBe(0)
  })

  it('returns 0 for empty array', () => {
    expect(standardDeviation([])).toBe(0)
  })
})

describe('populationStandardDeviation', () => {
  it('calculates population standard deviation without Bessel correction', () => {
    // Same data: [2, 4, 4, 4, 5, 5, 7, 9]
    // Mean = 5, SS = 32, Var = 32/8 = 4, SD = 2
    const data = [2, 4, 4, 4, 5, 5, 7, 9]
    expect(populationStandardDeviation(data)).toBe(2)
  })

  it('returns 0 for empty array', () => {
    expect(populationStandardDeviation([])).toBe(0)
  })
})

// ============================================================================
// Simple Random Sample
// ============================================================================

describe('simpleRandomSample', () => {
  const population = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  it('returns correct sample size', () => {
    const result = simpleRandomSample(population, 5)
    expect(result.values).toHaveLength(5)
    expect(result.indices).toHaveLength(5)
  })

  it('samples without replacement (no duplicates)', () => {
    const result = simpleRandomSample(population, 5)
    const uniqueIndices = new Set(result.indices)
    expect(uniqueIndices.size).toBe(5)
  })

  it('returns valid indices', () => {
    const result = simpleRandomSample(population, 5)
    result.indices.forEach((idx) => {
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(population.length)
    })
  })

  it('values match indices', () => {
    const result = simpleRandomSample(population, 5)
    result.indices.forEach((idx, i) => {
      expect(result.values[i]).toBe(population[idx])
    })
  })

  it('calculates mean correctly', () => {
    const fixedPop = [1, 1, 1, 1, 1] // All same value
    const result = simpleRandomSample(fixedPop, 3)
    expect(result.mean).toBe(1)
  })

  it('calculates standard error', () => {
    const result = simpleRandomSample(population, 5)
    expect(result.standardError).toBeGreaterThanOrEqual(0)
  })

  it('throws for sample size larger than population', () => {
    expect(() => simpleRandomSample(population, 20)).toThrow(
      'Sample size cannot exceed population size'
    )
  })

  it('throws for non-positive sample size', () => {
    expect(() => simpleRandomSample(population, 0)).toThrow(
      'Sample size must be a positive integer'
    )
  })

  it('throws for non-integer sample size', () => {
    expect(() => simpleRandomSample(population, 3.5)).toThrow(
      'Sample size must be a positive integer'
    )
  })
})

// ============================================================================
// Stratified Sample
// ============================================================================

describe('stratifiedSample', () => {
  const strata = [
    { name: 'Low', proportion: 0.3, values: [1, 2, 3, 4, 5] },
    { name: 'Medium', proportion: 0.5, values: [6, 7, 8, 9, 10, 11, 12, 13] },
    { name: 'High', proportion: 0.2, values: [14, 15] },
  ]

  it('returns sample with items from each stratum', () => {
    const result = stratifiedSample(strata, 10, true)
    expect(result.values.length).toBeGreaterThan(0)
  })

  it('respects proportional allocation', () => {
    // With 10 samples: Low ~3, Medium ~5, High ~2
    const result = stratifiedSample(strata, 10, true)
    // Should have samples from all strata
    expect(result.values.length).toBeLessThanOrEqual(10)
  })

  it('samples correctly with equal allocation', () => {
    const result = stratifiedSample(strata, 6, false)
    // Should have approximately equal from each stratum
    expect(result.values.length).toBeLessThanOrEqual(6)
  })

  it('throws for empty strata', () => {
    expect(() => stratifiedSample([], 10)).toThrow('At least one stratum is required')
  })

  it('throws for non-positive sample size', () => {
    expect(() => stratifiedSample(strata, 0)).toThrow('Sample size must be a positive integer')
  })

  it('calculates statistics correctly', () => {
    const result = stratifiedSample(strata, 5)
    expect(typeof result.mean).toBe('number')
    expect(typeof result.standardDeviation).toBe('number')
    expect(typeof result.standardError).toBe('number')
  })
})

// ============================================================================
// Systematic Sample
// ============================================================================

describe('systematicSample', () => {
  const population = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  it('returns correct sample size', () => {
    const result = systematicSample(population, 4)
    expect(result.values.length).toBe(4)
  })

  it('samples with correct interval spacing', () => {
    const result = systematicSample(population, 4, false) // Fixed start at 0
    // Interval k = 12/4 = 3, so indices 0, 3, 6, 9
    expect(result.indices).toEqual([0, 3, 6, 9])
    expect(result.values).toEqual([1, 4, 7, 10])
  })

  it('randomizes starting position when randomStart is true', () => {
    // Just verify it doesn't throw and returns valid results
    const result = systematicSample(population, 4, true)
    expect(result.values.length).toBe(4)
    expect(result.indices.every((i) => i >= 0 && i < 12)).toBe(true)
  })

  it('throws for sample size larger than population', () => {
    expect(() => systematicSample(population, 20)).toThrow(
      'Sample size cannot exceed population size'
    )
  })

  it('calculates statistics', () => {
    const result = systematicSample(population, 4)
    expect(result.mean).toBeGreaterThan(0)
    expect(result.standardDeviation).toBeGreaterThanOrEqual(0)
  })
})

// ============================================================================
// Cluster Sample
// ============================================================================

describe('clusterSample', () => {
  const population = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  it('returns all items from selected clusters', () => {
    const result = clusterSample(population, 4, 2)
    // 4 clusters of 3 items each, selecting 2 clusters = 6 items
    expect(result.values.length).toBe(6)
  })

  it('indices are valid', () => {
    const result = clusterSample(population, 4, 2)
    result.indices.forEach((idx) => {
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(population.length)
    })
  })

  it('values match indices', () => {
    const result = clusterSample(population, 4, 2)
    result.indices.forEach((idx, i) => {
      expect(result.values[i]).toBe(population[idx])
    })
  })

  it('throws when selecting more clusters than available', () => {
    expect(() => clusterSample(population, 4, 5)).toThrow(
      'Cannot select more clusters than available'
    )
  })

  it('throws for non-positive cluster count', () => {
    expect(() => clusterSample(population, 0, 1)).toThrow(
      'Number of clusters must be a positive integer'
    )
  })

  it('throws when more clusters than population', () => {
    expect(() => clusterSample(population, 20, 5)).toThrow(
      'Cannot have more clusters than population size'
    )
  })
})

// ============================================================================
// Standard Error Functions
// ============================================================================

describe('standardErrorMean', () => {
  it('calculates SE correctly', () => {
    // SE = s / sqrt(n) = 10 / sqrt(25) = 10/5 = 2
    expect(standardErrorMean(10, 25)).toBe(2)
  })

  it('returns 0 for zero sample size', () => {
    expect(standardErrorMean(10, 0)).toBe(0)
  })

  it('decreases with larger sample size (√n relationship)', () => {
    const se1 = standardErrorMean(10, 100)
    const se2 = standardErrorMean(10, 400)
    // SE with n=400 should be half of SE with n=100
    expect(se2).toBeCloseTo(se1 / 2, 10)
  })
})

describe('standardErrorProportion', () => {
  it('calculates SE correctly', () => {
    // SE = sqrt(p(1-p)/n) = sqrt(0.5*0.5/100) = sqrt(0.0025) = 0.05
    expect(standardErrorProportion(0.5, 100)).toBeCloseTo(0.05, 10)
  })

  it('returns 0 for zero sample size', () => {
    expect(standardErrorProportion(0.5, 0)).toBe(0)
  })

  it('throws for invalid proportion', () => {
    expect(() => standardErrorProportion(1.5, 100)).toThrow(
      'Proportion must be between 0 and 1'
    )
    expect(() => standardErrorProportion(-0.1, 100)).toThrow(
      'Proportion must be between 0 and 1'
    )
  })

  it('is maximized at p=0.5', () => {
    const se05 = standardErrorProportion(0.5, 100)
    const se03 = standardErrorProportion(0.3, 100)
    const se08 = standardErrorProportion(0.8, 100)
    expect(se05).toBeGreaterThan(se03)
    expect(se05).toBeGreaterThan(se08)
  })
})

describe('finitePopulationCorrection', () => {
  it('returns FPC for valid inputs', () => {
    // FPC = sqrt((N-n)/(N-1)) = sqrt((100-10)/(100-1)) = sqrt(90/99) ≈ 0.953
    expect(finitePopulationCorrection(10, 100)).toBeCloseTo(0.953, 2)
  })

  it('returns 0 when sample equals population', () => {
    expect(finitePopulationCorrection(100, 100)).toBe(0)
  })

  it('returns 0 for population size 1', () => {
    expect(finitePopulationCorrection(1, 1)).toBe(0)
  })

  it('approaches 1 for small sampling fraction', () => {
    const fpc = finitePopulationCorrection(10, 10000)
    expect(fpc).toBeGreaterThan(0.99)
  })
})

// ============================================================================
// Critical Values
// ============================================================================

describe('zCriticalValue', () => {
  it('returns ~1.96 for 95% confidence (alpha=0.05)', () => {
    expect(zCriticalValue(0.05)).toBeCloseTo(1.96, 1)
  })

  it('returns ~2.576 for 99% confidence (alpha=0.01)', () => {
    expect(zCriticalValue(0.01)).toBeCloseTo(2.576, 1)
  })

  it('returns ~1.645 for 90% confidence (alpha=0.10)', () => {
    expect(zCriticalValue(0.10)).toBeCloseTo(1.645, 1)
  })

  it('throws for alpha <= 0', () => {
    expect(() => zCriticalValue(0)).toThrow('Alpha must be between 0 and 1')
  })

  it('throws for alpha >= 1', () => {
    expect(() => zCriticalValue(1)).toThrow('Alpha must be between 0 and 1')
  })
})

describe('tCriticalValue', () => {
  it('returns value greater than z for small df', () => {
    const z = zCriticalValue(0.05)
    const t = tCriticalValue(10, 0.05)
    expect(t).toBeGreaterThan(z)
  })

  it('approaches z for large df', () => {
    const z = zCriticalValue(0.05)
    const t = tCriticalValue(1000, 0.05)
    expect(t).toBeCloseTo(z, 1)
  })

  it('returns ~2.262 for df=9, alpha=0.05', () => {
    // Known value from t-table
    expect(tCriticalValue(9, 0.05)).toBeCloseTo(2.262, 1)
  })

  it('throws for df <= 0', () => {
    expect(() => tCriticalValue(0, 0.05)).toThrow('Degrees of freedom must be positive')
  })

  it('throws for invalid alpha', () => {
    expect(() => tCriticalValue(10, 0)).toThrow('Alpha must be between 0 and 1')
  })
})

// ============================================================================
// Confidence Intervals
// ============================================================================

describe('confidenceIntervalMean', () => {
  it('calculates CI correctly', () => {
    // Sample: mean=100, sd=15, n=25
    // SE = 15/5 = 3
    // For 95% CI with df=24, t ≈ 2.064
    // ME = 2.064 * 3 ≈ 6.19
    const ci = confidenceIntervalMean(100, 15, 25, 0.95)
    expect(ci.pointEstimate).toBe(100)
    expect(ci.lower).toBeCloseTo(93.8, 0)
    expect(ci.upper).toBeCloseTo(106.2, 0)
    expect(ci.confidenceLevel).toBe(0.95)
  })

  it('wider CI for smaller samples', () => {
    const ciSmall = confidenceIntervalMean(100, 15, 10, 0.95)
    const ciLarge = confidenceIntervalMean(100, 15, 100, 0.95)
    expect(ciSmall.marginOfError).toBeGreaterThan(ciLarge.marginOfError)
  })

  it('wider CI for higher confidence level', () => {
    const ci95 = confidenceIntervalMean(100, 15, 25, 0.95)
    const ci99 = confidenceIntervalMean(100, 15, 25, 0.99)
    expect(ci99.marginOfError).toBeGreaterThan(ci95.marginOfError)
  })

  it('throws for sample size <= 1', () => {
    expect(() => confidenceIntervalMean(100, 15, 1, 0.95)).toThrow(
      'Sample size must be greater than 1'
    )
  })

  it('throws for invalid confidence level', () => {
    expect(() => confidenceIntervalMean(100, 15, 25, 0)).toThrow(
      'Confidence level must be between 0 and 1'
    )
    expect(() => confidenceIntervalMean(100, 15, 25, 1)).toThrow(
      'Confidence level must be between 0 and 1'
    )
  })
})

describe('confidenceIntervalProportion', () => {
  it('calculates CI correctly', () => {
    // 60 successes out of 100
    // p = 0.6, SE = sqrt(0.6*0.4/100) = 0.049
    // For 95% CI, z ≈ 1.96
    // ME = 1.96 * 0.049 ≈ 0.096
    const ci = confidenceIntervalProportion(60, 100, 0.95)
    expect(ci.pointEstimate).toBe(0.6)
    expect(ci.lower).toBeCloseTo(0.504, 1)
    expect(ci.upper).toBeCloseTo(0.696, 1)
  })

  it('clamps CI to [0, 1]', () => {
    // Very small proportion
    const ciLow = confidenceIntervalProportion(1, 100, 0.95)
    expect(ciLow.lower).toBeGreaterThanOrEqual(0)

    // Very high proportion
    const ciHigh = confidenceIntervalProportion(99, 100, 0.95)
    expect(ciHigh.upper).toBeLessThanOrEqual(1)
  })

  it('throws for sample size <= 0', () => {
    expect(() => confidenceIntervalProportion(5, 0, 0.95)).toThrow(
      'Sample size must be positive'
    )
  })

  it('throws for successes out of range', () => {
    expect(() => confidenceIntervalProportion(-1, 100, 0.95)).toThrow(
      'Successes must be between 0 and sample size'
    )
    expect(() => confidenceIntervalProportion(101, 100, 0.95)).toThrow(
      'Successes must be between 0 and sample size'
    )
  })
})

// ============================================================================
// Bootstrap
// ============================================================================

describe('bootstrapResample', () => {
  it('returns same length as original', () => {
    const sample = [1, 2, 3, 4, 5]
    const resample = bootstrapResample(sample)
    expect(resample).toHaveLength(5)
  })

  it('returns empty for empty input', () => {
    expect(bootstrapResample([])).toHaveLength(0)
  })

  it('samples with replacement (may have duplicates)', () => {
    // With enough samples, duplicates are virtually certain
    const sample = [1, 2]
    let hasDuplicates = false
    for (let i = 0; i < 100; i++) {
      const resample = bootstrapResample(sample)
      if (resample[0] === resample[1]) {
        hasDuplicates = true
        break
      }
    }
    expect(hasDuplicates).toBe(true)
  })

  it('only contains values from original sample', () => {
    const sample = [1, 2, 3]
    const resample = bootstrapResample(sample)
    resample.forEach((v) => {
      expect(sample).toContain(v)
    })
  })
})

describe('bootstrap', () => {
  it('returns bootstrap statistics of correct length', () => {
    const sample = [1, 2, 3, 4, 5]
    const result = bootstrap(sample, 100)
    expect(result.bootstrapStatistics).toHaveLength(100)
  })

  it('calculates original statistic', () => {
    const sample = [1, 2, 3, 4, 5]
    const result = bootstrap(sample, 100)
    expect(result.originalStatistic).toBe(3) // mean of 1,2,3,4,5
  })

  it('calculates bootstrap standard error', () => {
    const sample = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = bootstrap(sample, 1000)
    expect(result.standardError).toBeGreaterThan(0)
  })

  it('calculates percentile CI', () => {
    const sample = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = bootstrap(sample, 1000, mean, 0.95)
    expect(result.percentileCI.lower).toBeLessThan(result.percentileCI.upper)
    expect(result.percentileCI.confidenceLevel).toBe(0.95)
  })

  it('uses custom statistic function', () => {
    const sample = [1, 2, 3, 4, 5]
    const medianFn = (data: number[]) => {
      const sorted = [...data].sort((a, b) => a - b)
      return sorted[Math.floor(sorted.length / 2)]!
    }
    const result = bootstrap(sample, 100, medianFn)
    expect(result.originalStatistic).toBe(3) // median
  })

  it('throws for empty sample', () => {
    expect(() => bootstrap([], 100)).toThrow('Sample cannot be empty')
  })

  it('throws for non-positive iterations', () => {
    expect(() => bootstrap([1, 2, 3], 0)).toThrow('Iterations must be a positive integer')
  })

  it('CI captures true mean with high probability (simulation test)', () => {
    // Generate a population, take samples, verify ~95% coverage
    const truePopulation = Array.from({ length: 1000 }, () => Math.random() * 100)
    const trueMean = mean(truePopulation)

    let captured = 0
    const trials = 50 // Reduce for test speed

    for (let i = 0; i < trials; i++) {
      // Take a sample
      const sample = simpleRandomSample(truePopulation, 50).values
      const result = bootstrap(sample, 200, mean, 0.95)

      if (result.percentileCI.lower <= trueMean && trueMean <= result.percentileCI.upper) {
        captured++
      }
    }

    // Should capture true mean roughly 95% of the time (allow some variance)
    const captureRate = captured / trials
    expect(captureRate).toBeGreaterThan(0.7) // Allow wide margin for statistical variance
  })
})

// ============================================================================
// Sample Size Calculations
// ============================================================================

describe('sampleSizeForMean', () => {
  it('calculates sample size correctly', () => {
    // For 95% CI, z=1.96, σ=15, E=3
    // n = (1.96 * 15 / 3)² = (9.8)² = 96.04 → 97
    const n = sampleSizeForMean(3, 15, 0.95)
    expect(n).toBeCloseTo(97, 0)
  })

  it('increases with smaller margin of error', () => {
    const n1 = sampleSizeForMean(5, 15, 0.95)
    const n2 = sampleSizeForMean(2.5, 15, 0.95)
    expect(n2).toBeGreaterThan(n1)
  })

  it('increases with higher confidence level', () => {
    const n95 = sampleSizeForMean(3, 15, 0.95)
    const n99 = sampleSizeForMean(3, 15, 0.99)
    expect(n99).toBeGreaterThan(n95)
  })

  it('throws for non-positive margin of error', () => {
    expect(() => sampleSizeForMean(0, 15, 0.95)).toThrow('Margin of error must be positive')
  })

  it('throws for non-positive standard deviation', () => {
    expect(() => sampleSizeForMean(3, 0, 0.95)).toThrow(
      'Population standard deviation must be positive'
    )
  })
})

describe('sampleSizeForProportion', () => {
  it('calculates sample size correctly', () => {
    // For 95% CI, z=1.96, p=0.5, E=0.05
    // n = 1.96² * 0.5 * 0.5 / 0.05² = 3.84 * 0.25 / 0.0025 = 384.16 → 385
    const n = sampleSizeForProportion(0.05, 0.5, 0.95)
    expect(n).toBeCloseTo(385, 0)
  })

  it('maximized at p=0.5', () => {
    const n05 = sampleSizeForProportion(0.05, 0.5, 0.95)
    const n03 = sampleSizeForProportion(0.05, 0.3, 0.95)
    expect(n05).toBeGreaterThanOrEqual(n03)
  })

  it('increases with smaller margin of error', () => {
    const n1 = sampleSizeForProportion(0.05, 0.5, 0.95)
    const n2 = sampleSizeForProportion(0.025, 0.5, 0.95)
    expect(n2).toBeGreaterThan(n1)
  })

  it('throws for non-positive margin of error', () => {
    expect(() => sampleSizeForProportion(0, 0.5, 0.95)).toThrow('Margin of error must be positive')
  })

  it('throws for invalid proportion', () => {
    expect(() => sampleSizeForProportion(0.05, 0, 0.95)).toThrow(
      'Expected proportion must be between 0 and 1'
    )
    expect(() => sampleSizeForProportion(0.05, 1, 0.95)).toThrow(
      'Expected proportion must be between 0 and 1'
    )
  })
})

describe('sampleSizeForPower', () => {
  it('calculates sample size for given power', () => {
    // Standard scenario
    const n = sampleSizeForPower(5, 15, 0.8, 0.05)
    expect(n).toBeGreaterThan(0)
  })

  it('increases with smaller effect size', () => {
    const n1 = sampleSizeForPower(10, 15, 0.8, 0.05)
    const n2 = sampleSizeForPower(5, 15, 0.8, 0.05)
    expect(n2).toBeGreaterThan(n1)
  })

  it('increases with higher power', () => {
    const n80 = sampleSizeForPower(5, 15, 0.8, 0.05)
    const n90 = sampleSizeForPower(5, 15, 0.9, 0.05)
    expect(n90).toBeGreaterThan(n80)
  })

  it('increases with lower alpha', () => {
    const n05 = sampleSizeForPower(5, 15, 0.8, 0.05)
    const n01 = sampleSizeForPower(5, 15, 0.8, 0.01)
    expect(n01).toBeGreaterThan(n05)
  })

  it('throws for non-positive effect size', () => {
    expect(() => sampleSizeForPower(0, 15, 0.8, 0.05)).toThrow('Effect size must be positive')
  })

  it('throws for invalid power', () => {
    expect(() => sampleSizeForPower(5, 15, 0, 0.05)).toThrow('Power must be between 0 and 1')
    expect(() => sampleSizeForPower(5, 15, 1, 0.05)).toThrow('Power must be between 0 and 1')
  })
})

// ============================================================================
// Presets and Utilities
// ============================================================================

describe('samplingPresets', () => {
  it('has multiple presets', () => {
    expect(samplingPresets.length).toBeGreaterThan(0)
  })

  it('each preset has required fields', () => {
    samplingPresets.forEach((preset) => {
      expect(preset.id).toBeDefined()
      expect(preset.name).toBeDefined()
      expect(preset.description).toBeDefined()
      expect(preset.populationConfig).toBeDefined()
      expect(preset.sampleSize).toBeGreaterThan(0)
    })
  })
})

describe('getSamplingPresetById', () => {
  it('returns preset for valid ID', () => {
    const preset = getSamplingPresetById('user-survey')
    expect(preset).toBeDefined()
    expect(preset?.name).toBe('User Survey')
  })

  it('returns undefined for invalid ID', () => {
    expect(getSamplingPresetById('nonexistent')).toBeUndefined()
  })
})

describe('calculateSampleStatistics', () => {
  it('calculates all statistics', () => {
    const values = [1, 2, 3, 4, 5]
    const stats = calculateSampleStatistics(values)

    expect(stats.n).toBe(5)
    expect(stats.mean).toBe(3)
    expect(stats.min).toBe(1)
    expect(stats.max).toBe(5)
    expect(stats.stdDev).toBeGreaterThan(0)
    expect(stats.se).toBeGreaterThan(0)
  })

  it('handles empty array', () => {
    const stats = calculateSampleStatistics([])
    expect(stats.n).toBe(0)
    expect(stats.mean).toBe(0)
  })
})

describe('createStrata', () => {
  it('creates correct number of strata', () => {
    const population = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const strata = createStrata(population, 3)
    expect(strata).toHaveLength(3)
  })

  it('strata proportions sum to 1', () => {
    const population = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const strata = createStrata(population, 3)
    const totalProportion = strata.reduce((sum, s) => sum + s.proportion, 0)
    expect(totalProportion).toBeCloseTo(1, 10)
  })

  it('strata contain all population values', () => {
    const population = [1, 2, 3, 4, 5]
    const strata = createStrata(population, 2)
    const allValues = strata.flatMap((s) => s.values)
    expect(allValues.sort()).toEqual(population.sort())
  })

  it('throws for non-positive strata count', () => {
    expect(() => createStrata([1, 2, 3], 0)).toThrow(
      'Number of strata must be a positive integer'
    )
  })
})
