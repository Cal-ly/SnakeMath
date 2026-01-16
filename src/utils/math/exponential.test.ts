import { describe, it, expect } from 'vitest'
import {
  evaluateExponential,
  evaluateLogarithm,
  analyzeGrowthDecay,
  calculateDoublingTime,
  calculateHalfLife,
  calculateCompoundInterest,
  calculateContinuousInterest,
  compareComplexities,
  generateExponentialPoints,
  generateLogarithmPoints,
  isValidExponentialBase,
  isValidLogarithmInput,
  formatExponentialNumber,
  getComplexityDescription,
  complexityFunctions,
  complexityLabels,
  complexityColors,
  complexityExamples,
} from './exponential'

describe('exponential utilities', () => {
  describe('evaluateExponential', () => {
    it('calculates 2^3 = 8', () => {
      expect(evaluateExponential(2, 3)).toBe(8)
    })

    it('calculates 10^2 = 100', () => {
      expect(evaluateExponential(10, 2)).toBe(100)
    })

    it('calculates e^1 ≈ 2.718', () => {
      expect(evaluateExponential(Math.E, 1)).toBeCloseTo(Math.E)
    })

    it('calculates b^0 = 1 for any valid base', () => {
      expect(evaluateExponential(2, 0)).toBe(1)
      expect(evaluateExponential(10, 0)).toBe(1)
      expect(evaluateExponential(Math.E, 0)).toBe(1)
    })

    it('calculates 2^(-1) = 0.5', () => {
      expect(evaluateExponential(2, -1)).toBe(0.5)
    })

    it('applies coefficient: 5 * 2^3 = 40', () => {
      expect(evaluateExponential(2, 3, 5)).toBe(40)
    })

    it('handles decimal exponents: 4^0.5 = 2', () => {
      expect(evaluateExponential(4, 0.5)).toBeCloseTo(2)
    })

    it('handles decay base: 0.5^2 = 0.25', () => {
      expect(evaluateExponential(0.5, 2)).toBe(0.25)
    })

    it('returns Infinity for very large results', () => {
      expect(evaluateExponential(10, 1000)).toBe(Infinity)
    })

    it('throws error for base = 0', () => {
      expect(() => evaluateExponential(0, 2)).toThrow('Base must be positive')
    })

    it('throws error for base = 1', () => {
      expect(() => evaluateExponential(1, 2)).toThrow('Base cannot be 1')
    })

    it('throws error for negative base', () => {
      expect(() => evaluateExponential(-2, 2)).toThrow('Base must be positive')
    })
  })

  describe('evaluateLogarithm', () => {
    it('calculates log₁₀(100) = 2', () => {
      expect(evaluateLogarithm(10, 100)).toBeCloseTo(2)
    })

    it('calculates log₂(8) = 3', () => {
      expect(evaluateLogarithm(2, 8)).toBeCloseTo(3)
    })

    it('calculates ln(e) = 1', () => {
      expect(evaluateLogarithm(Math.E, Math.E)).toBeCloseTo(1)
    })

    it('calculates log_b(1) = 0 for any valid base', () => {
      expect(evaluateLogarithm(10, 1)).toBeCloseTo(0)
      expect(evaluateLogarithm(2, 1)).toBeCloseTo(0)
      expect(evaluateLogarithm(Math.E, 1)).toBeCloseTo(0)
    })

    it('calculates log₂(0.5) = -1', () => {
      expect(evaluateLogarithm(2, 0.5)).toBeCloseTo(-1)
    })

    it('calculates log_b(b) = 1 for any valid base', () => {
      expect(evaluateLogarithm(5, 5)).toBeCloseTo(1)
      expect(evaluateLogarithm(3, 3)).toBeCloseTo(1)
    })

    it('throws error for log of 0', () => {
      expect(() => evaluateLogarithm(10, 0)).toThrow(
        'Logarithm input must be positive'
      )
    })

    it('throws error for log of negative number', () => {
      expect(() => evaluateLogarithm(10, -5)).toThrow(
        'Logarithm input must be positive'
      )
    })

    it('throws error for base = 1', () => {
      expect(() => evaluateLogarithm(1, 10)).toThrow('Base cannot be 1')
    })
  })

  describe('analyzeGrowthDecay', () => {
    it('identifies base 2 as growth', () => {
      const result = analyzeGrowthDecay(2)
      expect(result.type).toBe('growth')
      expect(result.doublingTime).toBeCloseTo(1)
      expect(result.halfLife).toBeNull()
      expect(result.percentChangePerUnit).toBe(100)
    })

    it('identifies base 0.5 as decay', () => {
      const result = analyzeGrowthDecay(0.5)
      expect(result.type).toBe('decay')
      expect(result.doublingTime).toBeNull()
      expect(result.halfLife).toBeCloseTo(1)
      expect(result.percentChangePerUnit).toBe(-50)
    })

    it('analyzes base e correctly', () => {
      const result = analyzeGrowthDecay(Math.E)
      expect(result.type).toBe('growth')
      expect(result.doublingTime).toBeCloseTo(Math.log(2))
      expect(result.percentChangePerUnit).toBeCloseTo((Math.E - 1) * 100)
    })

    it('handles 3% growth rate (base 1.03)', () => {
      const result = analyzeGrowthDecay(1.03)
      expect(result.type).toBe('growth')
      expect(result.percentChangePerUnit).toBeCloseTo(3)
    })

    it('throws error for base = 1', () => {
      expect(() => analyzeGrowthDecay(1)).toThrow('Base cannot be 1')
    })
  })

  describe('calculateDoublingTime', () => {
    it('returns 1 for base 2', () => {
      expect(calculateDoublingTime(2)).toBeCloseTo(1)
    })

    it('returns ln(2) ≈ 0.693 for base e', () => {
      expect(calculateDoublingTime(Math.E)).toBeCloseTo(Math.log(2))
    })

    it('returns null for decay (base < 1)', () => {
      expect(calculateDoublingTime(0.5)).toBeNull()
      expect(calculateDoublingTime(0.9)).toBeNull()
    })

    it('calculates correctly for 10% growth (base 1.1)', () => {
      // ln(2) / ln(1.1) ≈ 7.27
      expect(calculateDoublingTime(1.1)).toBeCloseTo(
        Math.log(2) / Math.log(1.1)
      )
    })
  })

  describe('calculateHalfLife', () => {
    it('returns 1 for base 0.5', () => {
      expect(calculateHalfLife(0.5)).toBeCloseTo(1)
    })

    it('returns null for growth (base > 1)', () => {
      expect(calculateHalfLife(2)).toBeNull()
      expect(calculateHalfLife(1.1)).toBeNull()
    })

    it('calculates correctly for 10% decay (base 0.9)', () => {
      // ln(0.5) / ln(0.9) ≈ 6.58
      expect(calculateHalfLife(0.9)).toBeCloseTo(Math.log(0.5) / Math.log(0.9))
    })
  })

  describe('calculateCompoundInterest', () => {
    it('calculates annual compounding: $1000 at 5% for 10 years', () => {
      const result = calculateCompoundInterest({
        principal: 1000,
        rate: 0.05,
        compoundingsPerYear: 1,
        years: 10,
      })
      expect(result.finalAmount).toBeCloseTo(1628.89, 2)
      expect(result.totalInterest).toBeCloseTo(628.89, 2)
    })

    it('calculates monthly compounding: $1000 at 5% for 10 years', () => {
      const result = calculateCompoundInterest({
        principal: 1000,
        rate: 0.05,
        compoundingsPerYear: 12,
        years: 10,
      })
      expect(result.finalAmount).toBeCloseTo(1647.01, 2)
    })

    it('calculates daily compounding: $1000 at 5% for 10 years', () => {
      const result = calculateCompoundInterest({
        principal: 1000,
        rate: 0.05,
        compoundingsPerYear: 365,
        years: 10,
      })
      expect(result.finalAmount).toBeCloseTo(1648.66, 2)
    })

    it('calculates effective rate for monthly compounding', () => {
      const result = calculateCompoundInterest({
        principal: 1000,
        rate: 0.05,
        compoundingsPerYear: 12,
        years: 1,
      })
      // Effective rate = (1 + 0.05/12)^12 - 1 ≈ 0.05116
      expect(result.effectiveRate).toBeCloseTo(0.05116, 4)
    })

    it('returns principal for 0 years', () => {
      const result = calculateCompoundInterest({
        principal: 1000,
        rate: 0.05,
        compoundingsPerYear: 12,
        years: 0,
      })
      expect(result.finalAmount).toBe(1000)
      expect(result.totalInterest).toBe(0)
    })

    it('throws error for negative principal', () => {
      expect(() =>
        calculateCompoundInterest({
          principal: -1000,
          rate: 0.05,
          compoundingsPerYear: 12,
          years: 10,
        })
      ).toThrow('Principal must be non-negative')
    })
  })

  describe('calculateContinuousInterest', () => {
    it('calculates continuous compounding: $1000 at 5% for 10 years', () => {
      const result = calculateContinuousInterest(1000, 0.05, 10)
      // A = 1000 * e^(0.05 * 10) = 1000 * e^0.5 ≈ 1648.72
      expect(result).toBeCloseTo(1648.72, 2)
    })

    it('returns principal for 0 years', () => {
      expect(calculateContinuousInterest(1000, 0.05, 0)).toBe(1000)
    })

    it('handles negative rate (decay)', () => {
      const result = calculateContinuousInterest(1000, -0.05, 10)
      expect(result).toBeCloseTo(606.53, 2)
    })
  })

  describe('compareComplexities', () => {
    it('compares at n=10', () => {
      const result = compareComplexities(10)
      expect(result.n).toBe(10)
      expect(result.values.constant).toBe(1)
      expect(result.values.logarithmic).toBeCloseTo(3.32, 1)
      expect(result.values.linear).toBe(10)
      expect(result.values.linearithmic).toBeCloseTo(33.2, 1)
      expect(result.values.quadratic).toBe(100)
      expect(result.values.exponential).toBe(1024)
    })

    it('compares at n=100', () => {
      const result = compareComplexities(100)
      expect(result.values.constant).toBe(1)
      expect(result.values.logarithmic).toBeCloseTo(6.64, 1)
      expect(result.values.linear).toBe(100)
      expect(result.values.quadratic).toBe(10000)
    })

    it('throws error for n < 1', () => {
      expect(() => compareComplexities(0)).toThrow(
        'Input size n must be at least 1'
      )
      expect(() => compareComplexities(-5)).toThrow(
        'Input size n must be at least 1'
      )
    })
  })

  describe('generateExponentialPoints', () => {
    it('generates correct number of points', () => {
      const points = generateExponentialPoints(2, -2, 4, 1, 60)
      expect(points.length).toBe(61) // 60 intervals = 61 points
    })

    it('points lie on the curve', () => {
      const points = generateExponentialPoints(2, 0, 4, 1, 10)
      points.forEach((point) => {
        const expected = evaluateExponential(2, point.x)
        expect(point.y).toBeCloseTo(expected)
      })
    })

    it('applies coefficient correctly', () => {
      const points = generateExponentialPoints(2, 0, 3, 5, 3)
      // At x=3: 5 * 2^3 = 40
      const lastPoint = points[points.length - 1]
      expect(lastPoint).toBeDefined()
      expect(lastPoint!.y).toBeCloseTo(40)
    })

    it('handles negative x values', () => {
      const points = generateExponentialPoints(2, -3, 0, 1, 3)
      // At x=-3: 2^(-3) = 0.125
      expect(points[0]).toBeDefined()
      expect(points[0]!.y).toBeCloseTo(0.125)
    })
  })

  describe('generateLogarithmPoints', () => {
    it('generates correct number of points', () => {
      const points = generateLogarithmPoints(2, 0.1, 10, 50)
      expect(points.length).toBe(51)
    })

    it('points lie on the curve', () => {
      const points = generateLogarithmPoints(2, 1, 16, 15)
      points.forEach((point) => {
        const expected = evaluateLogarithm(2, point.x)
        expect(point.y).toBeCloseTo(expected)
      })
    })

    it('handles x values near 0 by using minimum', () => {
      const points = generateLogarithmPoints(10, -5, 10, 100)
      // Should start at 0.001 instead of -5
      expect(points[0]).toBeDefined()
      expect(points[0]!.x).toBeGreaterThan(0)
    })

    it('calculates log₂(8) = 3 correctly', () => {
      const points = generateLogarithmPoints(2, 8, 8, 1)
      expect(points[0]).toBeDefined()
      expect(points[0]!.y).toBeCloseTo(3)
    })
  })

  describe('isValidExponentialBase', () => {
    it('returns true for valid bases', () => {
      expect(isValidExponentialBase(2)).toBe(true)
      expect(isValidExponentialBase(0.5)).toBe(true)
      expect(isValidExponentialBase(Math.E)).toBe(true)
      expect(isValidExponentialBase(10)).toBe(true)
    })

    it('returns false for base = 1', () => {
      expect(isValidExponentialBase(1)).toBe(false)
    })

    it('returns false for base <= 0', () => {
      expect(isValidExponentialBase(0)).toBe(false)
      expect(isValidExponentialBase(-2)).toBe(false)
    })

    it('returns false for non-finite values', () => {
      expect(isValidExponentialBase(Infinity)).toBe(false)
      expect(isValidExponentialBase(NaN)).toBe(false)
    })
  })

  describe('isValidLogarithmInput', () => {
    it('returns true for positive values', () => {
      expect(isValidLogarithmInput(1)).toBe(true)
      expect(isValidLogarithmInput(0.5)).toBe(true)
      expect(isValidLogarithmInput(100)).toBe(true)
    })

    it('returns false for non-positive values', () => {
      expect(isValidLogarithmInput(0)).toBe(false)
      expect(isValidLogarithmInput(-5)).toBe(false)
    })

    it('returns false for non-finite values', () => {
      expect(isValidLogarithmInput(Infinity)).toBe(false)
      expect(isValidLogarithmInput(NaN)).toBe(false)
    })
  })

  describe('formatExponentialNumber', () => {
    it('formats integers without decimals', () => {
      expect(formatExponentialNumber(5)).toBe('5')
      // Use regex to handle different locale separators (comma or period)
      expect(formatExponentialNumber(1000)).toMatch(/1[,.]000/)
    })

    it('uses scientific notation for very large numbers', () => {
      expect(formatExponentialNumber(1e10)).toMatch(/1\.00e\+10/i)
      expect(formatExponentialNumber(1.5e12)).toMatch(/1\.50e\+12/i)
    })

    it('handles Infinity', () => {
      expect(formatExponentialNumber(Infinity)).toBe('∞')
      expect(formatExponentialNumber(-Infinity)).toBe('-∞')
    })

    it('formats decimals appropriately', () => {
      const result = formatExponentialNumber(3.14159)
      // Handle different locale decimal separators
      expect(result).toMatch(/3[,.]142/)
    })
  })

  describe('getComplexityDescription', () => {
    it('returns descriptions for all complexity classes', () => {
      expect(getComplexityDescription('constant')).toContain('Constant')
      expect(getComplexityDescription('logarithmic')).toContain('Logarithmic')
      expect(getComplexityDescription('linear')).toContain('Linear')
      expect(getComplexityDescription('linearithmic')).toContain('Linearithmic')
      expect(getComplexityDescription('quadratic')).toContain('Quadratic')
      expect(getComplexityDescription('exponential')).toContain('Exponential')
    })
  })

  describe('exported constants', () => {
    it('complexityFunctions has all complexity classes', () => {
      expect(Object.keys(complexityFunctions)).toHaveLength(6)
      expect(complexityFunctions.constant(100)).toBe(1)
      expect(complexityFunctions.linear(100)).toBe(100)
    })

    it('complexityLabels has all complexity classes', () => {
      expect(Object.keys(complexityLabels)).toHaveLength(6)
      expect(complexityLabels.constant).toBe('O(1)')
      expect(complexityLabels.exponential).toBe('O(2^n)')
    })

    it('complexityColors has all complexity classes', () => {
      expect(Object.keys(complexityColors)).toHaveLength(6)
      // Colors should be hex format
      Object.values(complexityColors).forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    it('complexityExamples has examples for all classes', () => {
      expect(Object.keys(complexityExamples)).toHaveLength(6)
      Object.values(complexityExamples).forEach((examples) => {
        expect(examples.length).toBeGreaterThan(0)
      })
    })
  })
})
