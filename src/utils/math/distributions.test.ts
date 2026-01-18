/**
 * Tests for probability distribution utility functions.
 * Target: 100+ tests covering all distributions and edge cases.
 */

import { describe, it, expect } from 'vitest'
import {
  // Utility functions
  factorial,
  logFactorial,
  binomialCoefficient,
  logBinomialCoefficient,
  erf,
  // Standard normal
  standardNormalPdf,
  standardNormalCdf,
  standardNormalQuantile,
  // Normal distribution
  normalPdf,
  normalCdf,
  normalQuantile,
  sampleNormal,
  // Binomial distribution
  binomialPmf,
  binomialCdf,
  binomialQuantile,
  sampleBinomial,
  // Poisson distribution
  poissonPmf,
  poissonCdf,
  poissonQuantile,
  samplePoisson,
  // Exponential distribution
  exponentialPdf,
  exponentialCdf,
  exponentialQuantile,
  sampleExponential,
  // Uniform distribution
  uniformPdf,
  uniformCdf,
  uniformQuantile,
  sampleUniform,
  // Unified interface
  getPdf,
  getCdf,
  getQuantile,
  sample,
  generateSamples,
  getDistributionStats,
  // Histogram
  createHistogram,
  getSuggestedRange,
  isDiscreteDistribution,
  getDiscreteXValues,
  // Presets
  distributionPresets,
  getPresetById,
  // Probability calculations
  probabilityLessThanOrEqual,
  probabilityLessThan,
  probabilityGreaterThan,
  probabilityBetween,
  // Validation
  validateParams,
  isValidParams,
  // Types
  type DistributionParams,
} from './distributions'

// ============================================================================
// Helper functions for testing
// ============================================================================

const EPSILON = 1e-6

function expectClose(actual: number, expected: number, tolerance = EPSILON) {
  expect(Math.abs(actual - expected)).toBeLessThan(tolerance)
}

// ============================================================================
// Utility Functions Tests
// ============================================================================

describe('factorial', () => {
  it('returns 1 for 0', () => {
    expect(factorial(0)).toBe(1)
  })

  it('returns 1 for 1', () => {
    expect(factorial(1)).toBe(1)
  })

  it('calculates small factorials correctly', () => {
    expect(factorial(2)).toBe(2)
    expect(factorial(3)).toBe(6)
    expect(factorial(4)).toBe(24)
    expect(factorial(5)).toBe(120)
    expect(factorial(6)).toBe(720)
    expect(factorial(10)).toBe(3628800)
  })

  it('calculates larger factorials correctly', () => {
    expect(factorial(20)).toBe(2432902008176640000)
  })

  it('returns Infinity for n > 170', () => {
    expect(factorial(171)).toBe(Infinity)
  })

  it('throws for negative numbers', () => {
    expect(() => factorial(-1)).toThrow('non-negative integer')
  })

  it('throws for non-integers', () => {
    expect(() => factorial(3.5)).toThrow('non-negative integer')
  })
})

describe('logFactorial', () => {
  it('returns 0 for 0 and 1', () => {
    expect(logFactorial(0)).toBe(0)
    expect(logFactorial(1)).toBe(0)
  })

  it('matches Math.log(factorial) for small n', () => {
    for (let n = 2; n <= 15; n++) {
      expectClose(logFactorial(n), Math.log(factorial(n)), 1e-10)
    }
  })

  it('uses Stirling approximation for large n', () => {
    // ln(100!) ≈ 363.74
    expectClose(logFactorial(100), 363.739, 0.001)
  })

  it('throws for negative numbers', () => {
    expect(() => logFactorial(-1)).toThrow('non-negative integer')
  })
})

describe('binomialCoefficient', () => {
  it('returns 1 for C(n,0) and C(n,n)', () => {
    expect(binomialCoefficient(5, 0)).toBe(1)
    expect(binomialCoefficient(5, 5)).toBe(1)
    expect(binomialCoefficient(10, 0)).toBe(1)
    expect(binomialCoefficient(10, 10)).toBe(1)
  })

  it('calculates known values correctly', () => {
    expect(binomialCoefficient(5, 2)).toBe(10)
    expect(binomialCoefficient(5, 3)).toBe(10)
    expect(binomialCoefficient(10, 3)).toBe(120)
    expect(binomialCoefficient(20, 10)).toBe(184756)
  })

  it('is symmetric: C(n,k) = C(n,n-k)', () => {
    expect(binomialCoefficient(10, 3)).toBe(binomialCoefficient(10, 7))
    expect(binomialCoefficient(20, 5)).toBe(binomialCoefficient(20, 15))
  })

  it('returns 0 for invalid inputs', () => {
    expect(binomialCoefficient(5, -1)).toBe(0)
    expect(binomialCoefficient(5, 6)).toBe(0)
    expect(binomialCoefficient(-5, 2)).toBe(0)
  })

  it('handles large coefficients without overflow', () => {
    // C(50,25) is about 1.26 * 10^14
    expect(binomialCoefficient(50, 25)).toBeCloseTo(126410606437752, -3)
  })
})

describe('logBinomialCoefficient', () => {
  it('returns 0 for C(n,0) and C(n,n)', () => {
    expect(logBinomialCoefficient(10, 0)).toBe(0)
    expect(logBinomialCoefficient(10, 10)).toBe(0)
  })

  it('matches Math.log(binomialCoefficient) for moderate values', () => {
    expectClose(logBinomialCoefficient(10, 3), Math.log(120), 1e-10)
    expectClose(logBinomialCoefficient(20, 10), Math.log(184756), 1e-6)
  })

  it('returns -Infinity for invalid inputs', () => {
    expect(logBinomialCoefficient(5, -1)).toBe(-Infinity)
    expect(logBinomialCoefficient(5, 6)).toBe(-Infinity)
  })
})

describe('erf', () => {
  it('returns 0 for x=0', () => {
    expectClose(erf(0), 0)
  })

  it('is antisymmetric: erf(-x) = -erf(x)', () => {
    expectClose(erf(-1), -erf(1))
    expectClose(erf(-2), -erf(2))
  })

  it('calculates known values approximately', () => {
    expectClose(erf(1), 0.8427, 0.001)
    expectClose(erf(2), 0.9953, 0.001)
    expectClose(erf(0.5), 0.5205, 0.001)
  })

  it('approaches 1 for large x', () => {
    expect(erf(5)).toBeGreaterThan(0.9999)
  })

  it('approaches -1 for large negative x', () => {
    expect(erf(-5)).toBeLessThan(-0.9999)
  })
})

// ============================================================================
// Standard Normal Distribution Tests
// ============================================================================

describe('standardNormalPdf', () => {
  it('returns maximum at z=0', () => {
    const peak = standardNormalPdf(0)
    expectClose(peak, 1 / Math.sqrt(2 * Math.PI))
    expect(standardNormalPdf(1)).toBeLessThan(peak)
    expect(standardNormalPdf(-1)).toBeLessThan(peak)
  })

  it('is symmetric around 0', () => {
    expectClose(standardNormalPdf(-1), standardNormalPdf(1))
    expectClose(standardNormalPdf(-2), standardNormalPdf(2))
    expectClose(standardNormalPdf(-3), standardNormalPdf(3))
  })

  it('decreases as |z| increases', () => {
    expect(standardNormalPdf(0)).toBeGreaterThan(standardNormalPdf(1))
    expect(standardNormalPdf(1)).toBeGreaterThan(standardNormalPdf(2))
    expect(standardNormalPdf(2)).toBeGreaterThan(standardNormalPdf(3))
  })

  it('approaches 0 for large |z|', () => {
    expect(standardNormalPdf(5)).toBeLessThan(0.0001)
    expect(standardNormalPdf(-5)).toBeLessThan(0.0001)
  })
})

describe('standardNormalCdf', () => {
  it('returns 0.5 at z=0', () => {
    expectClose(standardNormalCdf(0), 0.5)
  })

  it('calculates known quantiles correctly', () => {
    // z = 1.96 corresponds to p ≈ 0.975
    expectClose(standardNormalCdf(1.96), 0.975, 0.001)
    // z = -1.96 corresponds to p ≈ 0.025
    expectClose(standardNormalCdf(-1.96), 0.025, 0.001)
  })

  it('calculates standard deviations correctly', () => {
    // 68-95-99.7 rule
    expectClose(standardNormalCdf(1) - standardNormalCdf(-1), 0.6827, 0.001)
    expectClose(standardNormalCdf(2) - standardNormalCdf(-2), 0.9545, 0.001)
    expectClose(standardNormalCdf(3) - standardNormalCdf(-3), 0.9973, 0.001)
  })

  it('is monotonically increasing', () => {
    expect(standardNormalCdf(-2)).toBeLessThan(standardNormalCdf(-1))
    expect(standardNormalCdf(-1)).toBeLessThan(standardNormalCdf(0))
    expect(standardNormalCdf(0)).toBeLessThan(standardNormalCdf(1))
    expect(standardNormalCdf(1)).toBeLessThan(standardNormalCdf(2))
  })

  it('approaches 0 for large negative z', () => {
    expect(standardNormalCdf(-5)).toBeLessThan(0.0001)
  })

  it('approaches 1 for large positive z', () => {
    expect(standardNormalCdf(5)).toBeGreaterThan(0.9999)
  })
})

describe('standardNormalQuantile', () => {
  it('returns 0 for p=0.5', () => {
    expectClose(standardNormalQuantile(0.5), 0, 0.001)
  })

  it('calculates known quantiles correctly', () => {
    expectClose(standardNormalQuantile(0.975), 1.96, 0.01)
    expectClose(standardNormalQuantile(0.025), -1.96, 0.01)
    expectClose(standardNormalQuantile(0.95), 1.645, 0.01)
    expectClose(standardNormalQuantile(0.99), 2.326, 0.01)
  })

  it('is inverse of CDF', () => {
    for (const p of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      const z = standardNormalQuantile(p)
      expectClose(standardNormalCdf(z), p, 0.001)
    }
  })

  it('returns -Infinity for p=0', () => {
    expect(standardNormalQuantile(0)).toBe(-Infinity)
  })

  it('returns Infinity for p=1', () => {
    expect(standardNormalQuantile(1)).toBe(Infinity)
  })
})

// ============================================================================
// Normal Distribution Tests
// ============================================================================

describe('normalPdf', () => {
  it('matches standard normal when mu=0, sigma=1', () => {
    expectClose(normalPdf(0, 0, 1), standardNormalPdf(0))
    expectClose(normalPdf(1, 0, 1), standardNormalPdf(1))
  })

  it('shifts with mu', () => {
    expectClose(normalPdf(5, 5, 1), standardNormalPdf(0))
    expectClose(normalPdf(6, 5, 1), standardNormalPdf(1))
  })

  it('scales with sigma', () => {
    // Peak should be 1/(sigma*sqrt(2π))
    expectClose(normalPdf(0, 0, 2), standardNormalPdf(0) / 2)
    expectClose(normalPdf(0, 0, 0.5), standardNormalPdf(0) * 2)
  })

  it('throws for non-positive sigma', () => {
    expect(() => normalPdf(0, 0, 0)).toThrow('sigma > 0')
    expect(() => normalPdf(0, 0, -1)).toThrow('sigma > 0')
  })
})

describe('normalCdf', () => {
  it('matches standard normal when mu=0, sigma=1', () => {
    expectClose(normalCdf(0, 0, 1), 0.5)
    expectClose(normalCdf(1.96, 0, 1), 0.975, 0.001)
  })

  it('shifts with mu', () => {
    expectClose(normalCdf(5, 5, 1), 0.5)
    expectClose(normalCdf(100, 100, 15), 0.5) // IQ scores
  })

  it('calculates IQ probabilities correctly', () => {
    // P(IQ < 115) with μ=100, σ=15 corresponds to z=1
    expectClose(normalCdf(115, 100, 15), standardNormalCdf(1))
    // P(IQ < 130) corresponds to z=2
    expectClose(normalCdf(130, 100, 15), standardNormalCdf(2))
  })

  it('throws for non-positive sigma', () => {
    expect(() => normalCdf(0, 0, 0)).toThrow('sigma > 0')
  })
})

describe('normalQuantile', () => {
  it('returns mu for p=0.5', () => {
    expectClose(normalQuantile(0.5, 0, 1), 0, 0.001)
    expectClose(normalQuantile(0.5, 100, 15), 100, 0.001)
  })

  it('is inverse of CDF', () => {
    for (const p of [0.1, 0.25, 0.75, 0.9]) {
      const x = normalQuantile(p, 100, 15)
      expectClose(normalCdf(x, 100, 15), p, 0.001)
    }
  })

  it('throws for non-positive sigma', () => {
    expect(() => normalQuantile(0.5, 0, 0)).toThrow('sigma > 0')
  })
})

describe('sampleNormal', () => {
  it('generates values in the expected range', () => {
    // 99.7% should be within 3 standard deviations
    const samples = Array.from({ length: 1000 }, () => sampleNormal(0, 1))
    const min = Math.min(...samples)
    const max = Math.max(...samples)
    expect(min).toBeGreaterThan(-5)
    expect(max).toBeLessThan(5)
  })

  it('has approximately correct mean', () => {
    const samples = Array.from({ length: 1000 }, () => sampleNormal(100, 15))
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length
    expectClose(mean, 100, 3) // Allow ±3 for sampling variability
  })

  it('throws for non-positive sigma', () => {
    expect(() => sampleNormal(0, 0)).toThrow('sigma > 0')
  })
})

// ============================================================================
// Binomial Distribution Tests
// ============================================================================

describe('binomialPmf', () => {
  it('sums to 1 over all k', () => {
    let sum = 0
    for (let k = 0; k <= 20; k++) {
      sum += binomialPmf(k, 20, 0.5)
    }
    expectClose(sum, 1)
  })

  it('calculates known values correctly', () => {
    // P(X=0) for n=10, p=0.5 = 0.5^10 ≈ 0.000977
    expectClose(binomialPmf(0, 10, 0.5), Math.pow(0.5, 10))
    // P(X=10) for n=10, p=0.5 = 0.5^10
    expectClose(binomialPmf(10, 10, 0.5), Math.pow(0.5, 10))
    // P(X=5) for n=10, p=0.5 = C(10,5) * 0.5^10 = 252 * 0.5^10
    expectClose(binomialPmf(5, 10, 0.5), 252 * Math.pow(0.5, 10))
  })

  it('handles edge cases p=0 and p=1', () => {
    expect(binomialPmf(0, 10, 0)).toBe(1)
    expect(binomialPmf(5, 10, 0)).toBe(0)
    expect(binomialPmf(10, 10, 1)).toBe(1)
    expect(binomialPmf(5, 10, 1)).toBe(0)
  })

  it('returns 0 for k outside [0, n]', () => {
    expect(binomialPmf(-1, 10, 0.5)).toBe(0)
    expect(binomialPmf(11, 10, 0.5)).toBe(0)
    expect(binomialPmf(3.5, 10, 0.5)).toBe(0)
  })

  it('throws for invalid parameters', () => {
    expect(() => binomialPmf(5, -10, 0.5)).toThrow('n >= 0')
    expect(() => binomialPmf(5, 10, -0.1)).toThrow('0 <= p <= 1')
    expect(() => binomialPmf(5, 10, 1.1)).toThrow('0 <= p <= 1')
  })
})

describe('binomialCdf', () => {
  it('returns 0 for k < 0', () => {
    expect(binomialCdf(-1, 10, 0.5)).toBe(0)
  })

  it('returns 1 for k >= n', () => {
    expect(binomialCdf(10, 10, 0.5)).toBe(1)
    expect(binomialCdf(15, 10, 0.5)).toBe(1)
  })

  it('is monotonically increasing', () => {
    for (let k = 0; k < 10; k++) {
      expect(binomialCdf(k, 10, 0.5)).toBeLessThanOrEqual(binomialCdf(k + 1, 10, 0.5))
    }
  })

  it('calculates P(X <= 5) for fair coin correctly', () => {
    // P(X <= 5) = sum of P(X=k) for k=0 to 5
    let expected = 0
    for (let k = 0; k <= 5; k++) {
      expected += binomialPmf(k, 10, 0.5)
    }
    expectClose(binomialCdf(5, 10, 0.5), expected)
  })
})

describe('binomialQuantile', () => {
  it('returns 0 for p=0', () => {
    expect(binomialQuantile(0, 10, 0.5)).toBe(0)
  })

  it('returns n for p=1', () => {
    expect(binomialQuantile(1, 10, 0.5)).toBe(10)
  })

  it('returns median around n*p', () => {
    const q = binomialQuantile(0.5, 20, 0.5)
    expect(q).toBeGreaterThanOrEqual(9)
    expect(q).toBeLessThanOrEqual(11)
  })

  it('is consistent with CDF', () => {
    const k = binomialQuantile(0.75, 20, 0.5)
    expect(binomialCdf(k, 20, 0.5)).toBeGreaterThanOrEqual(0.75)
    expect(binomialCdf(k - 1, 20, 0.5)).toBeLessThan(0.75)
  })
})

describe('sampleBinomial', () => {
  it('generates values in [0, n]', () => {
    for (let i = 0; i < 100; i++) {
      const sample = sampleBinomial(20, 0.5)
      expect(sample).toBeGreaterThanOrEqual(0)
      expect(sample).toBeLessThanOrEqual(20)
      expect(Number.isInteger(sample)).toBe(true)
    }
  })

  it('has approximately correct mean', () => {
    const samples = Array.from({ length: 1000 }, () => sampleBinomial(100, 0.3))
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length
    expectClose(mean, 30, 3) // n*p = 30
  })

  it('throws for invalid parameters', () => {
    expect(() => sampleBinomial(-10, 0.5)).toThrow('n >= 0')
    expect(() => sampleBinomial(10, -0.1)).toThrow('0 <= p <= 1')
  })
})

// ============================================================================
// Poisson Distribution Tests
// ============================================================================

describe('poissonPmf', () => {
  it('sums approximately to 1', () => {
    let sum = 0
    for (let k = 0; k < 50; k++) {
      sum += poissonPmf(k, 5)
    }
    expectClose(sum, 1)
  })

  it('calculates known values correctly', () => {
    // P(X=0) for λ=5 = e^(-5) ≈ 0.00674
    expectClose(poissonPmf(0, 5), Math.exp(-5), 0.0001)
    // P(X=5) for λ=5 = (5^5 * e^(-5)) / 5! = 3125 * e^(-5) / 120
    expectClose(poissonPmf(5, 5), (Math.pow(5, 5) * Math.exp(-5)) / 120, 0.0001)
  })

  it('handles λ=0', () => {
    expect(poissonPmf(0, 0)).toBe(1)
    expect(poissonPmf(1, 0)).toBe(0)
    expect(poissonPmf(5, 0)).toBe(0)
  })

  it('returns 0 for negative k', () => {
    expect(poissonPmf(-1, 5)).toBe(0)
  })

  it('throws for negative lambda', () => {
    expect(() => poissonPmf(5, -1)).toThrow('lambda >= 0')
  })
})

describe('poissonCdf', () => {
  it('returns 0 for k < 0', () => {
    expect(poissonCdf(-1, 5)).toBe(0)
  })

  it('returns 1 for lambda=0', () => {
    expect(poissonCdf(0, 0)).toBe(1)
  })

  it('is monotonically increasing', () => {
    for (let k = 0; k < 20; k++) {
      expect(poissonCdf(k, 10)).toBeLessThanOrEqual(poissonCdf(k + 1, 10))
    }
  })

  it('approaches 1 as k increases', () => {
    expect(poissonCdf(30, 10)).toBeGreaterThan(0.999)
  })
})

describe('poissonQuantile', () => {
  it('returns 0 for p=0', () => {
    expect(poissonQuantile(0, 5)).toBe(0)
  })

  it('returns Infinity for p=1', () => {
    expect(poissonQuantile(1, 5)).toBe(Infinity)
  })

  it('returns median around λ', () => {
    const q = poissonQuantile(0.5, 10)
    expect(q).toBeGreaterThanOrEqual(8)
    expect(q).toBeLessThanOrEqual(12)
  })

  it('is consistent with CDF', () => {
    const k = poissonQuantile(0.75, 10)
    expect(poissonCdf(k, 10)).toBeGreaterThanOrEqual(0.75)
    expect(poissonCdf(k - 1, 10)).toBeLessThan(0.75)
  })
})

describe('samplePoisson', () => {
  it('generates non-negative integers', () => {
    for (let i = 0; i < 100; i++) {
      const s = samplePoisson(5)
      expect(s).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(s)).toBe(true)
    }
  })

  it('has approximately correct mean', () => {
    const samples = Array.from({ length: 1000 }, () => samplePoisson(10))
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length
    expectClose(mean, 10, 1)
  })

  it('returns 0 for lambda=0', () => {
    expect(samplePoisson(0)).toBe(0)
  })

  it('throws for negative lambda', () => {
    expect(() => samplePoisson(-1)).toThrow('lambda >= 0')
  })
})

// ============================================================================
// Exponential Distribution Tests
// ============================================================================

describe('exponentialPdf', () => {
  it('returns lambda at x=0', () => {
    expectClose(exponentialPdf(0, 1), 1)
    expectClose(exponentialPdf(0, 2), 2)
    expectClose(exponentialPdf(0, 0.5), 0.5)
  })

  it('returns 0 for x < 0', () => {
    expect(exponentialPdf(-1, 1)).toBe(0)
    expect(exponentialPdf(-100, 1)).toBe(0)
  })

  it('decreases exponentially', () => {
    expectClose(exponentialPdf(1, 1), Math.exp(-1))
    expectClose(exponentialPdf(2, 1), Math.exp(-2))
  })

  it('throws for non-positive lambda', () => {
    expect(() => exponentialPdf(1, 0)).toThrow('lambda > 0')
    expect(() => exponentialPdf(1, -1)).toThrow('lambda > 0')
  })
})

describe('exponentialCdf', () => {
  it('returns 0 for x < 0', () => {
    expect(exponentialCdf(-1, 1)).toBe(0)
  })

  it('returns 0 at x=0', () => {
    expect(exponentialCdf(0, 1)).toBe(0)
  })

  it('calculates known values correctly', () => {
    // F(x) = 1 - e^(-λx)
    expectClose(exponentialCdf(1, 1), 1 - Math.exp(-1))
    expectClose(exponentialCdf(2, 0.5), 1 - Math.exp(-1))
  })

  it('approaches 1 as x increases', () => {
    expect(exponentialCdf(10, 1)).toBeGreaterThan(0.9999)
  })

  it('is monotonically increasing', () => {
    for (let x = 0; x < 5; x += 0.5) {
      expect(exponentialCdf(x, 1)).toBeLessThanOrEqual(exponentialCdf(x + 0.5, 1))
    }
  })
})

describe('exponentialQuantile', () => {
  it('returns 0 for p=0', () => {
    expect(exponentialQuantile(0, 1)).toBe(0)
  })

  it('returns Infinity for p=1', () => {
    expect(exponentialQuantile(1, 1)).toBe(Infinity)
  })

  it('returns median = ln(2)/λ', () => {
    // Median of exponential(λ=1) is ln(2) ≈ 0.693
    expectClose(exponentialQuantile(0.5, 1), Math.LN2)
    expectClose(exponentialQuantile(0.5, 2), Math.LN2 / 2)
  })

  it('is inverse of CDF', () => {
    for (const p of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      const x = exponentialQuantile(p, 2)
      expectClose(exponentialCdf(x, 2), p, 0.0001)
    }
  })
})

describe('sampleExponential', () => {
  it('generates non-negative values', () => {
    for (let i = 0; i < 100; i++) {
      expect(sampleExponential(1)).toBeGreaterThanOrEqual(0)
    }
  })

  it('has approximately correct mean (1/λ)', () => {
    const samples = Array.from({ length: 1000 }, () => sampleExponential(2))
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length
    expectClose(mean, 0.5, 0.1) // Mean = 1/λ = 0.5
  })

  it('throws for non-positive lambda', () => {
    expect(() => sampleExponential(0)).toThrow('lambda > 0')
  })
})

// ============================================================================
// Uniform Distribution Tests
// ============================================================================

describe('uniformPdf', () => {
  it('returns 1/(b-a) inside range', () => {
    expectClose(uniformPdf(0.5, 0, 1), 1)
    expectClose(uniformPdf(3, 0, 10), 0.1)
  })

  it('returns 0 outside range', () => {
    expect(uniformPdf(-0.1, 0, 1)).toBe(0)
    expect(uniformPdf(1.1, 0, 1)).toBe(0)
  })

  it('returns correct value at boundaries', () => {
    expectClose(uniformPdf(0, 0, 1), 1)
    expectClose(uniformPdf(1, 0, 1), 1)
  })

  it('throws for a >= b', () => {
    expect(() => uniformPdf(0.5, 1, 0)).toThrow('a < b')
    expect(() => uniformPdf(0.5, 1, 1)).toThrow('a < b')
  })
})

describe('uniformCdf', () => {
  it('returns 0 for x < a', () => {
    expect(uniformCdf(-1, 0, 1)).toBe(0)
  })

  it('returns 1 for x > b', () => {
    expect(uniformCdf(2, 0, 1)).toBe(1)
  })

  it('returns 0.5 at midpoint', () => {
    expectClose(uniformCdf(0.5, 0, 1), 0.5)
    expectClose(uniformCdf(5, 0, 10), 0.5)
  })

  it('is linear between a and b', () => {
    expectClose(uniformCdf(0.25, 0, 1), 0.25)
    expectClose(uniformCdf(0.75, 0, 1), 0.75)
  })
})

describe('uniformQuantile', () => {
  it('returns a for p=0', () => {
    expect(uniformQuantile(0, 0, 1)).toBe(0)
    expect(uniformQuantile(0, 5, 10)).toBe(5)
  })

  it('returns b for p=1', () => {
    expect(uniformQuantile(1, 0, 1)).toBe(1)
    expect(uniformQuantile(1, 5, 10)).toBe(10)
  })

  it('returns midpoint for p=0.5', () => {
    expectClose(uniformQuantile(0.5, 0, 1), 0.5)
    expectClose(uniformQuantile(0.5, 0, 10), 5)
  })

  it('is inverse of CDF', () => {
    for (const p of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      const x = uniformQuantile(p, 2, 8)
      expectClose(uniformCdf(x, 2, 8), p, 0.0001)
    }
  })
})

describe('sampleUniform', () => {
  it('generates values in [a, b]', () => {
    for (let i = 0; i < 100; i++) {
      const s = sampleUniform(0, 1)
      expect(s).toBeGreaterThanOrEqual(0)
      expect(s).toBeLessThan(1)
    }
  })

  it('has approximately correct mean', () => {
    const samples = Array.from({ length: 1000 }, () => sampleUniform(0, 10))
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length
    expectClose(mean, 5, 0.5)
  })

  it('throws for a >= b', () => {
    expect(() => sampleUniform(1, 0)).toThrow('a < b')
  })
})

// ============================================================================
// Unified Interface Tests
// ============================================================================

describe('getPdf', () => {
  it('works for all distribution types', () => {
    const normalDist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    const binomialDist: DistributionParams = { type: 'binomial', params: { n: 10, p: 0.5 } }
    const poissonDist: DistributionParams = { type: 'poisson', params: { lambda: 5 } }
    const expDist: DistributionParams = { type: 'exponential', params: { lambda: 1 } }
    const uniformDist: DistributionParams = { type: 'uniform', params: { a: 0, b: 1 } }

    expectClose(getPdf(normalDist, 0), normalPdf(0, 0, 1))
    expectClose(getPdf(binomialDist, 5), binomialPmf(5, 10, 0.5))
    expectClose(getPdf(poissonDist, 3), poissonPmf(3, 5))
    expectClose(getPdf(expDist, 1), exponentialPdf(1, 1))
    expectClose(getPdf(uniformDist, 0.5), uniformPdf(0.5, 0, 1))
  })
})

describe('getCdf', () => {
  it('works for all distribution types', () => {
    const normalDist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    const uniformDist: DistributionParams = { type: 'uniform', params: { a: 0, b: 1 } }

    expectClose(getCdf(normalDist, 0), 0.5)
    expectClose(getCdf(uniformDist, 0.5), 0.5)
  })
})

describe('getQuantile', () => {
  it('works for all distribution types', () => {
    const normalDist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    const uniformDist: DistributionParams = { type: 'uniform', params: { a: 0, b: 1 } }

    expectClose(getQuantile(normalDist, 0.5), 0, 0.01)
    expectClose(getQuantile(uniformDist, 0.5), 0.5)
  })
})

describe('sample and generateSamples', () => {
  it('sample returns a number', () => {
    const normalDist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    const s = sample(normalDist)
    expect(typeof s).toBe('number')
    expect(Number.isFinite(s)).toBe(true)
  })

  it('generateSamples returns correct count', () => {
    const normalDist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    const samples = generateSamples(normalDist, 100)
    expect(samples.length).toBe(100)
  })
})

// ============================================================================
// Distribution Statistics Tests
// ============================================================================

describe('getDistributionStats', () => {
  it('returns correct stats for normal distribution', () => {
    const dist: DistributionParams = { type: 'normal', params: { mu: 100, sigma: 15 } }
    const stats = getDistributionStats(dist)
    expect(stats.mean).toBe(100)
    expect(stats.variance).toBe(225)
    expect(stats.stdDev).toBe(15)
    expect(stats.mode).toBe(100)
    expect(stats.skewness).toBe(0)
  })

  it('returns correct stats for binomial distribution', () => {
    const dist: DistributionParams = { type: 'binomial', params: { n: 20, p: 0.5 } }
    const stats = getDistributionStats(dist)
    expect(stats.mean).toBe(10)
    expect(stats.variance).toBe(5)
    expectClose(stats.stdDev, Math.sqrt(5))
    expect(stats.skewness).toBe(0) // p=0.5 is symmetric
  })

  it('returns correct stats for poisson distribution', () => {
    const dist: DistributionParams = { type: 'poisson', params: { lambda: 9 } }
    const stats = getDistributionStats(dist)
    expect(stats.mean).toBe(9)
    expect(stats.variance).toBe(9)
    expect(stats.stdDev).toBe(3)
    expectClose(stats.skewness, 1 / 3)
  })

  it('returns correct stats for exponential distribution', () => {
    const dist: DistributionParams = { type: 'exponential', params: { lambda: 2 } }
    const stats = getDistributionStats(dist)
    expect(stats.mean).toBe(0.5)
    expect(stats.variance).toBe(0.25)
    expect(stats.stdDev).toBe(0.5)
    expect(stats.mode).toBe(0)
    expect(stats.skewness).toBe(2)
  })

  it('returns correct stats for uniform distribution', () => {
    const dist: DistributionParams = { type: 'uniform', params: { a: 0, b: 12 } }
    const stats = getDistributionStats(dist)
    expect(stats.mean).toBe(6)
    expect(stats.variance).toBe(12)
    expectClose(stats.stdDev, Math.sqrt(12))
    expect(stats.mode).toBeNull() // All values equally likely
    expect(stats.skewness).toBe(0)
  })
})

// ============================================================================
// Histogram Tests
// ============================================================================

describe('createHistogram', () => {
  it('returns empty array for empty data', () => {
    expect(createHistogram([])).toEqual([])
  })

  it('creates single bin for identical values', () => {
    const bins = createHistogram([5, 5, 5, 5])
    expect(bins.length).toBe(1)
    expect(bins[0]?.count).toBe(4)
    expect(bins[0]?.density).toBe(1)
  })

  it('distributes values into bins correctly', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const bins = createHistogram(data, 5)
    expect(bins.length).toBe(5)

    // Total count should equal data length
    const totalCount = bins.reduce((sum, bin) => sum + bin.count, 0)
    expect(totalCount).toBe(10)
  })

  it('uses Sturges rule for default bin count', () => {
    const data = Array.from({ length: 100 }, (_, i) => i)
    const bins = createHistogram(data)
    // Sturges: ceil(log2(100) + 1) = ceil(6.64 + 1) = 8
    expect(bins.length).toBe(8)
  })

  it('density sums approximately to 1 / binWidth', () => {
    const data = Array.from({ length: 1000 }, () => sampleNormal(0, 1))
    const bins = createHistogram(data, 20)

    // Sum of (density * binWidth) should be approximately 1
    const binWidth = bins[0]!.end - bins[0]!.start
    const totalDensity = bins.reduce((sum, bin) => sum + bin.density * binWidth, 0)
    expectClose(totalDensity, 1, 0.01)
  })
})

describe('getSuggestedRange', () => {
  it('returns ±4σ for normal distribution', () => {
    const dist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    const range = getSuggestedRange(dist)
    expect(range.min).toBe(-4)
    expect(range.max).toBe(4)
  })

  it('returns [0, n] for binomial distribution', () => {
    const dist: DistributionParams = { type: 'binomial', params: { n: 20, p: 0.5 } }
    const range = getSuggestedRange(dist)
    expect(range.min).toBe(0)
    expect(range.max).toBe(20)
  })

  it('returns non-negative range for exponential', () => {
    const dist: DistributionParams = { type: 'exponential', params: { lambda: 1 } }
    const range = getSuggestedRange(dist)
    expect(range.min).toBe(0)
    expect(range.max).toBeGreaterThan(0)
  })
})

describe('isDiscreteDistribution', () => {
  it('returns true for binomial and poisson', () => {
    expect(isDiscreteDistribution('binomial')).toBe(true)
    expect(isDiscreteDistribution('poisson')).toBe(true)
  })

  it('returns false for continuous distributions', () => {
    expect(isDiscreteDistribution('normal')).toBe(false)
    expect(isDiscreteDistribution('exponential')).toBe(false)
    expect(isDiscreteDistribution('uniform')).toBe(false)
  })
})

describe('getDiscreteXValues', () => {
  it('returns integer values for binomial', () => {
    const dist: DistributionParams = { type: 'binomial', params: { n: 10, p: 0.5 } }
    const values = getDiscreteXValues(dist)
    expect(values.every((v) => Number.isInteger(v))).toBe(true)
    expect(values[0]).toBe(0)
    expect(values[values.length - 1]).toBe(10)
  })
})

// ============================================================================
// Presets Tests
// ============================================================================

describe('distributionPresets', () => {
  it('has expected presets', () => {
    expect(distributionPresets.length).toBeGreaterThan(5)
    expect(distributionPresets.some((p) => p.id === 'iq-scores')).toBe(true)
    expect(distributionPresets.some((p) => p.id === 'coin-flips')).toBe(true)
  })

  it('all presets have valid distributions', () => {
    for (const preset of distributionPresets) {
      expect(isValidParams(preset.distribution)).toBe(true)
    }
  })
})

describe('getPresetById', () => {
  it('returns preset when found', () => {
    const preset = getPresetById('iq-scores')
    expect(preset).toBeDefined()
    expect(preset?.distribution.type).toBe('normal')
  })

  it('returns undefined when not found', () => {
    expect(getPresetById('nonexistent')).toBeUndefined()
  })
})

// ============================================================================
// Probability Calculation Tests
// ============================================================================

describe('probabilityLessThanOrEqual', () => {
  it('equals CDF', () => {
    const dist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    expectClose(probabilityLessThanOrEqual(dist, 0), getCdf(dist, 0))
    expectClose(probabilityLessThanOrEqual(dist, 1.96), getCdf(dist, 1.96))
  })
})

describe('probabilityLessThan', () => {
  it('equals CDF for continuous', () => {
    const dist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    expectClose(probabilityLessThan(dist, 0), getCdf(dist, 0))
  })

  it('equals CDF(x-1) for discrete', () => {
    const dist: DistributionParams = { type: 'binomial', params: { n: 10, p: 0.5 } }
    expectClose(probabilityLessThan(dist, 5), binomialCdf(4, 10, 0.5))
  })
})

describe('probabilityGreaterThan', () => {
  it('equals 1 - CDF', () => {
    const dist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    expectClose(probabilityGreaterThan(dist, 0), 0.5)
  })
})

describe('probabilityBetween', () => {
  it('calculates correct interval probability', () => {
    const dist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    // P(-1 <= X <= 1) ≈ 0.6827
    expectClose(probabilityBetween(dist, -1, 1), 0.6827, 0.001)
  })

  it('returns 0 when a > b', () => {
    const dist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    expect(probabilityBetween(dist, 1, -1)).toBe(0)
  })
})

// ============================================================================
// Validation Tests
// ============================================================================

describe('validateParams', () => {
  it('returns empty array for valid normal params', () => {
    const dist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    expect(validateParams(dist)).toEqual([])
  })

  it('returns error for non-positive sigma', () => {
    const dist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 0 } }
    const errors = validateParams(dist)
    expect(errors.length).toBe(1)
    expect(errors[0]?.param).toBe('sigma')
  })

  it('returns error for invalid binomial params', () => {
    const dist: DistributionParams = { type: 'binomial', params: { n: -5, p: 1.5 } }
    const errors = validateParams(dist)
    expect(errors.length).toBe(2)
  })

  it('returns error for a >= b in uniform', () => {
    const dist: DistributionParams = { type: 'uniform', params: { a: 5, b: 3 } }
    const errors = validateParams(dist)
    expect(errors.length).toBe(1)
    expect(errors[0]?.param).toBe('a')
  })
})

describe('isValidParams', () => {
  it('returns true for valid params', () => {
    expect(isValidParams({ type: 'normal', params: { mu: 0, sigma: 1 } })).toBe(true)
    expect(isValidParams({ type: 'binomial', params: { n: 10, p: 0.5 } })).toBe(true)
    expect(isValidParams({ type: 'poisson', params: { lambda: 5 } })).toBe(true)
    expect(isValidParams({ type: 'exponential', params: { lambda: 1 } })).toBe(true)
    expect(isValidParams({ type: 'uniform', params: { a: 0, b: 1 } })).toBe(true)
  })

  it('returns false for invalid params', () => {
    expect(isValidParams({ type: 'normal', params: { mu: 0, sigma: -1 } })).toBe(false)
    expect(isValidParams({ type: 'binomial', params: { n: 10, p: 1.5 } })).toBe(false)
    expect(isValidParams({ type: 'poisson', params: { lambda: -1 } })).toBe(false)
    expect(isValidParams({ type: 'exponential', params: { lambda: 0 } })).toBe(false)
    expect(isValidParams({ type: 'uniform', params: { a: 5, b: 3 } })).toBe(false)
  })
})

// ============================================================================
// Additional Edge Case Tests
// ============================================================================

describe('edge cases', () => {
  it('handles very small probabilities', () => {
    // P(X=0) for Poisson(100) should be extremely small
    const prob = poissonPmf(0, 100)
    expect(prob).toBeGreaterThan(0)
    expect(prob).toBeLessThan(1e-40)
  })

  it('handles large n in binomial', () => {
    // Should not overflow
    const prob = binomialPmf(500, 1000, 0.5)
    expect(Number.isFinite(prob)).toBe(true)
    expect(prob).toBeGreaterThan(0)
  })

  it('handles extreme quantiles', () => {
    const dist: DistributionParams = { type: 'normal', params: { mu: 0, sigma: 1 } }
    expect(getQuantile(dist, 0.001)).toBeLessThan(-2.5)
    expect(getQuantile(dist, 0.999)).toBeGreaterThan(2.5)
  })

  it('histogram handles outliers', () => {
    const data = [1, 2, 3, 4, 5, 100] // 100 is an outlier
    const bins = createHistogram(data, 5)
    expect(bins.length).toBe(5)
    // Total count should still equal data length
    const totalCount = bins.reduce((sum, bin) => sum + bin.count, 0)
    expect(totalCount).toBe(6)
  })
})
