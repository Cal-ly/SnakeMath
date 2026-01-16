import { describe, it, expect } from 'vitest'
import {
  calculateVertex,
  calculateDiscriminant,
  solveQuadratic,
  toVertexForm,
  toFactoredForm,
  evaluateQuadratic,
  generateQuadraticPoints,
  getAxisOfSymmetry,
  getYIntercept,
  opensUpward,
  formatNumber,
} from './quadratic'

describe('quadratic utilities', () => {
  describe('calculateVertex', () => {
    it('calculates vertex for standard parabola y = x²', () => {
      const vertex = calculateVertex({ a: 1, b: 0, c: 0 })
      expect(vertex.x).toBeCloseTo(0)
      expect(vertex.y).toBeCloseTo(0)
    })

    it('calculates vertex for shifted parabola y = x² - 4x + 3', () => {
      const vertex = calculateVertex({ a: 1, b: -4, c: 3 })
      expect(vertex.x).toBeCloseTo(2)
      expect(vertex.y).toBeCloseTo(-1)
    })

    it('calculates vertex for inverted parabola y = -x² + 4', () => {
      const vertex = calculateVertex({ a: -1, b: 0, c: 4 })
      expect(vertex.x).toBeCloseTo(0)
      expect(vertex.y).toBeCloseTo(4)
    })

    it('calculates vertex for stretched parabola y = 2x² + 4x + 1', () => {
      const vertex = calculateVertex({ a: 2, b: 4, c: 1 })
      expect(vertex.x).toBeCloseTo(-1)
      expect(vertex.y).toBeCloseTo(-1)
    })

    it('throws error when a = 0', () => {
      expect(() => calculateVertex({ a: 0, b: 1, c: 0 })).toThrow(
        'Coefficient "a" cannot be zero'
      )
    })
  })

  describe('calculateDiscriminant', () => {
    it('identifies two real roots when Δ > 0', () => {
      // x² - 1 = 0 → Δ = 0 - 4(1)(-1) = 4
      const result = calculateDiscriminant({ a: 1, b: 0, c: -1 })
      expect(result.value).toBeCloseTo(4)
      expect(result.rootType).toBe('two-real')
    })

    it('identifies one real root when Δ = 0', () => {
      // x² - 2x + 1 = 0 → Δ = 4 - 4 = 0
      const result = calculateDiscriminant({ a: 1, b: -2, c: 1 })
      expect(result.value).toBeCloseTo(0)
      expect(result.rootType).toBe('one-real')
    })

    it('identifies complex roots when Δ < 0', () => {
      // x² + 1 = 0 → Δ = 0 - 4 = -4
      const result = calculateDiscriminant({ a: 1, b: 0, c: 1 })
      expect(result.value).toBeCloseTo(-4)
      expect(result.rootType).toBe('two-complex')
    })

    it('handles general case', () => {
      // 2x² + 5x - 3 = 0 → Δ = 25 + 24 = 49
      const result = calculateDiscriminant({ a: 2, b: 5, c: -3 })
      expect(result.value).toBeCloseTo(49)
      expect(result.rootType).toBe('two-real')
    })
  })

  describe('solveQuadratic', () => {
    it('finds two distinct real roots for x² - 1 = 0', () => {
      const result = solveQuadratic({ a: 1, b: 0, c: -1 })
      expect(result.type).toBe('two-real')
      expect(result.roots).toHaveLength(2)
      expect(result.roots[0]).toBeCloseTo(-1)
      expect(result.roots[1]).toBeCloseTo(1)
    })

    it('finds one repeated root for x² - 2x + 1 = 0', () => {
      const result = solveQuadratic({ a: 1, b: -2, c: 1 })
      expect(result.type).toBe('one-real')
      expect(result.roots).toHaveLength(1)
      expect(result.roots[0]).toBeCloseTo(1)
    })

    it('returns empty roots for x² + 1 = 0 (complex)', () => {
      const result = solveQuadratic({ a: 1, b: 0, c: 1 })
      expect(result.type).toBe('two-complex')
      expect(result.roots).toHaveLength(0)
    })

    it('solves x² - 5x + 6 = 0', () => {
      const result = solveQuadratic({ a: 1, b: -5, c: 6 })
      expect(result.type).toBe('two-real')
      expect(result.roots[0]).toBeCloseTo(2)
      expect(result.roots[1]).toBeCloseTo(3)
    })

    it('handles negative leading coefficient', () => {
      // -x² + 4 = 0 → x = ±2
      const result = solveQuadratic({ a: -1, b: 0, c: 4 })
      expect(result.type).toBe('two-real')
      expect(result.roots[0]).toBeCloseTo(-2)
      expect(result.roots[1]).toBeCloseTo(2)
    })
  })

  describe('toVertexForm', () => {
    it('converts y = x² to vertex form', () => {
      const form = toVertexForm({ a: 1, b: 0, c: 0 })
      expect(form.a).toBe(1)
      expect(form.h).toBeCloseTo(0)
      expect(form.k).toBeCloseTo(0)
    })

    it('converts y = x² - 4x + 3 to vertex form', () => {
      const form = toVertexForm({ a: 1, b: -4, c: 3 })
      expect(form.a).toBe(1)
      expect(form.h).toBeCloseTo(2)
      expect(form.k).toBeCloseTo(-1)
    })

    it('preserves the a coefficient', () => {
      const form = toVertexForm({ a: 3, b: 6, c: 1 })
      expect(form.a).toBe(3)
    })
  })

  describe('toFactoredForm', () => {
    it('converts x² - 1 to factored form', () => {
      const form = toFactoredForm({ a: 1, b: 0, c: -1 })
      expect(form).not.toBeNull()
      expect(form!.a).toBe(1)
      expect(form!.r1).toBeCloseTo(-1)
      expect(form!.r2).toBeCloseTo(1)
    })

    it('returns null for x² + 1 (complex roots)', () => {
      const form = toFactoredForm({ a: 1, b: 0, c: 1 })
      expect(form).toBeNull()
    })

    it('handles repeated root', () => {
      // x² - 2x + 1 = (x - 1)²
      const form = toFactoredForm({ a: 1, b: -2, c: 1 })
      expect(form).not.toBeNull()
      expect(form!.r1).toBeCloseTo(1)
      expect(form!.r2).toBeCloseTo(1)
    })
  })

  describe('evaluateQuadratic', () => {
    it('evaluates f(x) = x² at various points', () => {
      const coeffs = { a: 1, b: 0, c: 0 }
      expect(evaluateQuadratic(coeffs, 0)).toBeCloseTo(0)
      expect(evaluateQuadratic(coeffs, 1)).toBeCloseTo(1)
      expect(evaluateQuadratic(coeffs, 2)).toBeCloseTo(4)
      expect(evaluateQuadratic(coeffs, -2)).toBeCloseTo(4)
    })

    it('evaluates f(x) = 2x² - 4x + 1', () => {
      const coeffs = { a: 2, b: -4, c: 1 }
      expect(evaluateQuadratic(coeffs, 0)).toBeCloseTo(1)
      expect(evaluateQuadratic(coeffs, 1)).toBeCloseTo(-1)
      expect(evaluateQuadratic(coeffs, 2)).toBeCloseTo(1)
    })
  })

  describe('generateQuadraticPoints', () => {
    it('generates correct number of points', () => {
      const points = generateQuadraticPoints({ a: 1, b: 0, c: 0 }, -5, 5, 10)
      expect(points).toHaveLength(11) // 10 intervals = 11 points
    })

    it('points lie on the curve', () => {
      const coeffs = { a: 1, b: -2, c: 1 }
      const points = generateQuadraticPoints(coeffs, 0, 4, 4)
      points.forEach((point) => {
        const expected = evaluateQuadratic(coeffs, point.x)
        expect(point.y).toBeCloseTo(expected)
      })
    })
  })

  describe('getAxisOfSymmetry', () => {
    it('returns x = 0 for y = x²', () => {
      expect(getAxisOfSymmetry({ a: 1, b: 0, c: 0 })).toBeCloseTo(0)
    })

    it('returns x = 2 for y = x² - 4x + 3', () => {
      expect(getAxisOfSymmetry({ a: 1, b: -4, c: 3 })).toBeCloseTo(2)
    })
  })

  describe('getYIntercept', () => {
    it('returns (0, c) for any quadratic', () => {
      const intercept = getYIntercept({ a: 1, b: 2, c: 5 })
      expect(intercept.x).toBe(0)
      expect(intercept.y).toBe(5)
    })
  })

  describe('opensUpward', () => {
    it('returns true when a > 0', () => {
      expect(opensUpward({ a: 1, b: 0, c: 0 })).toBe(true)
      expect(opensUpward({ a: 0.5, b: 0, c: 0 })).toBe(true)
    })

    it('returns false when a < 0', () => {
      expect(opensUpward({ a: -1, b: 0, c: 0 })).toBe(false)
      expect(opensUpward({ a: -0.5, b: 0, c: 0 })).toBe(false)
    })
  })

  describe('formatNumber', () => {
    it('formats integers without decimals', () => {
      expect(formatNumber(5)).toBe('5')
      expect(formatNumber(-3)).toBe('-3')
      expect(formatNumber(0)).toBe('0')
    })

    it('formats near-integers as integers', () => {
      expect(formatNumber(5.0000000001)).toBe('5')
      expect(formatNumber(2.9999999999)).toBe('3')
    })

    it('formats decimals appropriately', () => {
      expect(formatNumber(3.14159)).toBe('3.142')
      expect(formatNumber(0.5)).toBe('0.5')
    })
  })
})
