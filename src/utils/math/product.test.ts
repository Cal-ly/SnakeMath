import { describe, it, expect } from 'vitest'
import {
  evaluateProduct,
  factorial,
  permutations,
  combinations,
  doubleFactorial,
  getProductPresetExpression,
  getProductPresetLatex,
} from './product'

describe('evaluateProduct', () => {
  it('calculates factorial when expression is i', () => {
    const result = evaluateProduct((i) => i, 1, 5)
    expect(result.product).toBe(120) // 5!
    expect(result.factors).toEqual([1, 2, 3, 4, 5])
    expect(result.factorCount).toBe(5)
  })

  it('returns 1 for empty product (start > end)', () => {
    const result = evaluateProduct((i) => i, 5, 1)
    expect(result.product).toBe(1)
    expect(result.factors).toEqual([])
    expect(result.factorCount).toBe(0)
  })

  it('handles single-factor product', () => {
    const result = evaluateProduct((i) => i * 2, 3, 3)
    expect(result.product).toBe(6)
    expect(result.factors).toEqual([6])
    expect(result.factorCount).toBe(1)
  })

  it('calculates product of even numbers', () => {
    const result = evaluateProduct((i) => 2 * i, 1, 4)
    expect(result.product).toBe(384) // 2 * 4 * 6 * 8
    expect(result.factors).toEqual([2, 4, 6, 8])
  })
})

describe('factorial', () => {
  it('calculates small factorials correctly', () => {
    expect(factorial(0)).toBe(1)
    expect(factorial(1)).toBe(1)
    expect(factorial(2)).toBe(2)
    expect(factorial(3)).toBe(6)
    expect(factorial(4)).toBe(24)
    expect(factorial(5)).toBe(120)
  })

  it('calculates larger factorials', () => {
    expect(factorial(10)).toBe(3628800)
  })

  it('returns NaN for negative numbers', () => {
    expect(factorial(-1)).toBeNaN()
    expect(factorial(-5)).toBeNaN()
  })
})

describe('permutations', () => {
  it('calculates P(n,r) correctly', () => {
    expect(permutations(5, 3)).toBe(60) // 5 * 4 * 3
    expect(permutations(4, 4)).toBe(24) // 4!
    expect(permutations(6, 2)).toBe(30) // 6 * 5
  })

  it('handles edge cases', () => {
    expect(permutations(5, 0)).toBe(1) // Empty permutation
    expect(permutations(3, 5)).toBe(0) // r > n
    expect(permutations(0, 0)).toBe(1)
  })

  it('returns 0 for invalid inputs', () => {
    expect(permutations(-1, 2)).toBe(0)
    expect(permutations(5, -1)).toBe(0)
  })
})

describe('combinations', () => {
  it('calculates C(n,r) correctly', () => {
    expect(combinations(5, 3)).toBe(10)
    expect(combinations(4, 2)).toBe(6)
    expect(combinations(6, 3)).toBe(20)
  })

  it('handles symmetric property C(n,r) = C(n,n-r)', () => {
    expect(combinations(10, 3)).toBe(combinations(10, 7))
    expect(combinations(6, 2)).toBe(combinations(6, 4))
  })

  it('handles edge cases', () => {
    expect(combinations(5, 0)).toBe(1)
    expect(combinations(5, 5)).toBe(1)
    expect(combinations(0, 0)).toBe(1)
    expect(combinations(3, 5)).toBe(0) // r > n
  })
})

describe('doubleFactorial', () => {
  it('calculates odd double factorial', () => {
    expect(doubleFactorial(7)).toBe(105) // 7 * 5 * 3 * 1
    expect(doubleFactorial(5)).toBe(15) // 5 * 3 * 1
    expect(doubleFactorial(1)).toBe(1)
  })

  it('calculates even double factorial', () => {
    expect(doubleFactorial(6)).toBe(48) // 6 * 4 * 2
    expect(doubleFactorial(4)).toBe(8) // 4 * 2
    expect(doubleFactorial(2)).toBe(2)
  })

  it('handles edge cases', () => {
    expect(doubleFactorial(0)).toBe(1)
    expect(doubleFactorial(1)).toBe(1)
    expect(doubleFactorial(-1)).toBeNaN()
  })
})

describe('getProductPresetExpression', () => {
  it('returns correct expression for factorial preset', () => {
    const expr = getProductPresetExpression('factorial')
    expect(expr(5)).toBe(5)
    expect(expr(1)).toBe(1)
  })

  it('returns correct expression for evenNumbers preset', () => {
    const expr = getProductPresetExpression('evenNumbers')
    expect(expr(1)).toBe(2)
    expect(expr(3)).toBe(6)
  })

  it('returns correct expression for oddNumbers preset', () => {
    const expr = getProductPresetExpression('oddNumbers')
    expect(expr(1)).toBe(1)
    expect(expr(3)).toBe(5)
  })

  it('returns correct expression for powers preset', () => {
    const expr = getProductPresetExpression('powers')
    expect(expr(1)).toBe(2) // 2^1
    expect(expr(3)).toBe(8) // 2^3
  })

  it('returns correct expression for fractions preset', () => {
    const expr = getProductPresetExpression('fractions')
    expect(expr(1)).toBe(0.5) // 1/2
    expect(expr(2)).toBeCloseTo(0.6667, 3) // 2/3
  })
})

describe('getProductPresetLatex', () => {
  it('returns correct LaTeX for all presets', () => {
    expect(getProductPresetLatex('factorial')).toBe('i')
    expect(getProductPresetLatex('evenNumbers')).toBe('2i')
    expect(getProductPresetLatex('oddNumbers')).toBe('(2i - 1)')
    expect(getProductPresetLatex('powers')).toBe('2^i')
    expect(getProductPresetLatex('fractions')).toBe('\\frac{i}{i+1}')
  })
})
