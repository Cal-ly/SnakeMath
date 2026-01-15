import { describe, it, expect } from 'vitest'
import {
  evaluateSummation,
  sumArithmetic,
  sumSquares,
  sumCubes,
  sumGeometric,
  getPresetExpression,
  getPresetClosedForm,
  compareLoopVsFormula,
} from './summation'
import type { SummationPresetId } from '@/types/math'

describe('evaluateSummation', () => {
  describe('basic functionality', () => {
    it('computes sum of integers from 1 to 5', () => {
      const result = evaluateSummation((i) => i, 1, 5)
      expect(result.total).toBe(15)
      expect(result.terms).toEqual([1, 2, 3, 4, 5])
      expect(result.termCount).toBe(5)
    })

    it('computes sum of squares from 1 to 4', () => {
      const result = evaluateSummation((i) => i * i, 1, 4)
      expect(result.total).toBe(30) // 1 + 4 + 9 + 16
      expect(result.terms).toEqual([1, 4, 9, 16])
      expect(result.termCount).toBe(4)
    })

    it('computes sum with constant expression', () => {
      const result = evaluateSummation(() => 5, 1, 4)
      expect(result.total).toBe(20) // 5 + 5 + 5 + 5
      expect(result.terms).toEqual([5, 5, 5, 5])
      expect(result.termCount).toBe(4)
    })
  })

  describe('edge cases', () => {
    it('handles empty range when start > end', () => {
      const result = evaluateSummation((i) => i, 5, 1)
      expect(result.total).toBe(0)
      expect(result.terms).toEqual([])
      expect(result.termCount).toBe(0)
    })

    it('handles single term when start equals end', () => {
      const result = evaluateSummation((i) => i, 5, 5)
      expect(result.total).toBe(5)
      expect(result.terms).toEqual([5])
      expect(result.termCount).toBe(1)
    })

    it('handles negative indices', () => {
      const result = evaluateSummation((i) => i, -2, 2)
      expect(result.total).toBe(0) // -2 + -1 + 0 + 1 + 2
      expect(result.terms).toEqual([-2, -1, 0, 1, 2])
      expect(result.termCount).toBe(5)
    })

    it('handles starting from zero', () => {
      const result = evaluateSummation((i) => i * i, 0, 3)
      expect(result.total).toBe(14) // 0 + 1 + 4 + 9
      expect(result.terms).toEqual([0, 1, 4, 9])
      expect(result.termCount).toBe(4)
    })
  })
})

describe('sumArithmetic', () => {
  it('returns 0 for n = 0', () => {
    expect(sumArithmetic(0)).toBe(0)
  })

  it('returns 1 for n = 1', () => {
    expect(sumArithmetic(1)).toBe(1)
  })

  it('returns 55 for n = 10', () => {
    expect(sumArithmetic(10)).toBe(55)
  })

  it('returns 5050 for n = 100 (Gauss problem)', () => {
    expect(sumArithmetic(100)).toBe(5050)
  })

  it('handles negative n by returning 0', () => {
    expect(sumArithmetic(-5)).toBe(0)
  })

  it('matches loop evaluation for various n', () => {
    for (const n of [1, 5, 10, 50, 100]) {
      const loopResult = evaluateSummation((i) => i, 1, n)
      expect(sumArithmetic(n)).toBe(loopResult.total)
    }
  })
})

describe('sumSquares', () => {
  it('returns 0 for n = 0', () => {
    expect(sumSquares(0)).toBe(0)
  })

  it('returns 1 for n = 1', () => {
    expect(sumSquares(1)).toBe(1)
  })

  it('returns 55 for n = 5', () => {
    // 1 + 4 + 9 + 16 + 25 = 55
    expect(sumSquares(5)).toBe(55)
  })

  it('returns 385 for n = 10', () => {
    expect(sumSquares(10)).toBe(385)
  })

  it('handles negative n by returning 0', () => {
    expect(sumSquares(-5)).toBe(0)
  })

  it('matches loop evaluation for various n', () => {
    for (const n of [1, 5, 10, 20]) {
      const loopResult = evaluateSummation((i) => i * i, 1, n)
      expect(sumSquares(n)).toBe(loopResult.total)
    }
  })
})

describe('sumCubes', () => {
  it('returns 0 for n = 0', () => {
    expect(sumCubes(0)).toBe(0)
  })

  it('returns 1 for n = 1', () => {
    expect(sumCubes(1)).toBe(1)
  })

  it('returns 225 for n = 5', () => {
    // 1 + 8 + 27 + 64 + 125 = 225
    expect(sumCubes(5)).toBe(225)
  })

  it('equals square of arithmetic sum (Nicomachus theorem)', () => {
    for (const n of [1, 5, 10, 20]) {
      const arithmetic = sumArithmetic(n)
      expect(sumCubes(n)).toBe(arithmetic * arithmetic)
    }
  })

  it('handles negative n by returning 0', () => {
    expect(sumCubes(-5)).toBe(0)
  })

  it('matches loop evaluation for various n', () => {
    for (const n of [1, 5, 10]) {
      const loopResult = evaluateSummation((i) => i * i * i, 1, n)
      expect(sumCubes(n)).toBe(loopResult.total)
    }
  })
})

describe('sumGeometric', () => {
  it('returns 0 for n < 0', () => {
    expect(sumGeometric(2, -1)).toBe(0)
  })

  it('returns 1 for n = 0 with any r', () => {
    expect(sumGeometric(2, 0)).toBe(1) // 2^0 = 1
    expect(sumGeometric(3, 0)).toBe(1) // 3^0 = 1
  })

  it('returns 31 for r = 2, n = 4', () => {
    // 1 + 2 + 4 + 8 + 16 = 31
    expect(sumGeometric(2, 4)).toBe(31)
  })

  it('returns 40 for r = 3, n = 3', () => {
    // 1 + 3 + 9 + 27 = 40
    expect(sumGeometric(3, 3)).toBe(40)
  })

  it('handles r = 1 (sum of ones)', () => {
    expect(sumGeometric(1, 4)).toBe(5) // 1 + 1 + 1 + 1 + 1
    expect(sumGeometric(1, 9)).toBe(10)
  })

  it('matches loop evaluation for r = 2', () => {
    for (const n of [0, 1, 4, 8]) {
      const loopResult = evaluateSummation((i) => Math.pow(2, i), 0, n)
      expect(sumGeometric(2, n)).toBe(loopResult.total)
    }
  })
})

describe('getPresetExpression', () => {
  it('returns correct expression for arithmetic', () => {
    const expr = getPresetExpression('arithmetic')
    expect(expr(5)).toBe(5)
    expect(expr(10)).toBe(10)
  })

  it('returns correct expression for squares', () => {
    const expr = getPresetExpression('squares')
    expect(expr(5)).toBe(25)
    expect(expr(10)).toBe(100)
  })

  it('returns correct expression for cubes', () => {
    const expr = getPresetExpression('cubes')
    expect(expr(3)).toBe(27)
    expect(expr(4)).toBe(64)
  })

  it('returns correct expression for geometric', () => {
    const expr = getPresetExpression('geometric')
    expect(expr(1)).toBe(1) // 2^0
    expect(expr(2)).toBe(2) // 2^1
    expect(expr(3)).toBe(4) // 2^2
    expect(expr(4)).toBe(8) // 2^3
  })

  it('returns correct expression for constant', () => {
    const expr = getPresetExpression('constant')
    expect(expr(1)).toBe(1)
    expect(expr(100)).toBe(1)
  })
})

describe('getPresetClosedForm', () => {
  it('returns function for all presets', () => {
    const presets: SummationPresetId[] = ['arithmetic', 'squares', 'cubes', 'geometric', 'constant']
    for (const preset of presets) {
      const closedForm = getPresetClosedForm(preset)
      expect(closedForm).not.toBeNull()
    }
  })

  it('arithmetic closed form matches sumArithmetic', () => {
    const closedForm = getPresetClosedForm('arithmetic')!
    expect(closedForm(10)).toBe(sumArithmetic(10))
  })

  it('squares closed form matches sumSquares', () => {
    const closedForm = getPresetClosedForm('squares')!
    expect(closedForm(10)).toBe(sumSquares(10))
  })

  it('cubes closed form matches sumCubes', () => {
    const closedForm = getPresetClosedForm('cubes')!
    expect(closedForm(10)).toBe(sumCubes(10))
  })

  it('geometric closed form computes 2^n - 1', () => {
    const closedForm = getPresetClosedForm('geometric')!
    expect(closedForm(4)).toBe(15) // 2^4 - 1 = 15
    expect(closedForm(10)).toBe(1023) // 2^10 - 1 = 1023
  })

  it('constant closed form returns n', () => {
    const closedForm = getPresetClosedForm('constant')!
    expect(closedForm(5)).toBe(5)
    expect(closedForm(100)).toBe(100)
  })
})

describe('compareLoopVsFormula', () => {
  it('shows match for arithmetic preset', () => {
    const result = compareLoopVsFormula('arithmetic', 100)
    expect(result.loopResult).toBe(5050)
    expect(result.formulaResult).toBe(5050)
    expect(result.match).toBe(true)
    expect(result.iterations).toBe(100)
  })

  it('shows match for squares preset', () => {
    const result = compareLoopVsFormula('squares', 10)
    expect(result.loopResult).toBe(385)
    expect(result.formulaResult).toBe(385)
    expect(result.match).toBe(true)
    expect(result.iterations).toBe(10)
  })

  it('shows match for cubes preset', () => {
    const result = compareLoopVsFormula('cubes', 5)
    expect(result.loopResult).toBe(225)
    expect(result.formulaResult).toBe(225)
    expect(result.match).toBe(true)
    expect(result.iterations).toBe(5)
  })

  it('shows match for geometric preset', () => {
    const result = compareLoopVsFormula('geometric', 4)
    expect(result.loopResult).toBe(15) // 1 + 2 + 4 + 8 = 15
    expect(result.formulaResult).toBe(15) // 2^4 - 1 = 15
    expect(result.match).toBe(true)
    expect(result.iterations).toBe(4)
  })

  it('shows match for constant preset', () => {
    const result = compareLoopVsFormula('constant', 10)
    expect(result.loopResult).toBe(10)
    expect(result.formulaResult).toBe(10)
    expect(result.match).toBe(true)
    expect(result.iterations).toBe(10)
  })

  it('handles n = 0 for all presets', () => {
    const presets: SummationPresetId[] = ['arithmetic', 'squares', 'cubes', 'geometric', 'constant']
    for (const preset of presets) {
      const result = compareLoopVsFormula(preset, 0)
      expect(result.match).toBe(true)
      expect(result.iterations).toBe(0)
    }
  })

  it('matches for large n values', () => {
    const result = compareLoopVsFormula('arithmetic', 10000)
    expect(result.match).toBe(true)
    expect(result.iterations).toBe(10000)
    expect(result.formulaResult).toBe(50005000) // n(n+1)/2 = 10000 * 10001 / 2
  })
})
