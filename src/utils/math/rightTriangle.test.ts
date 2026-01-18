import { describe, it, expect } from 'vitest'
import {
  findOpposite,
  findAdjacent,
  findHypotenuse,
  findHypotenuseFromOpposite,
  findHypotenuseFromAdjacent,
  findOppositeFromAdjacent,
  findAdjacentFromOpposite,
  findAngleFromSides,
  findAngleFromOppositeHypotenuse,
  findAngleFromAdjacentHypotenuse,
  findAdjacentFromPythagorean,
  findOppositeFromPythagorean,
  canSolve,
  validateTriangle,
  solveRightTriangle,
  isSpecialTriangle,
  getSpecialTriangleInfo,
  scaleSpecialTriangle,
  getSOHCAHTOA,
  triangleArea,
  trianglePerimeter,
  SPECIAL_TRIANGLES,
  type RightTriangle,
} from './rightTriangle'

describe('rightTriangle utilities', () => {
  // ============= Individual Calculation Functions =============

  describe('findOpposite', () => {
    it('calculates opposite from hypotenuse and angle', () => {
      // sin(30°) = 0.5, so opposite = 10 * 0.5 = 5
      expect(findOpposite(10, 30)).toBeCloseTo(5)
    })

    it('calculates for 45° angle', () => {
      // sin(45°) = √2/2 ≈ 0.707
      expect(findOpposite(10, 45)).toBeCloseTo(10 * Math.SQRT2 / 2)
    })

    it('calculates for 60° angle', () => {
      // sin(60°) = √3/2 ≈ 0.866
      expect(findOpposite(10, 60)).toBeCloseTo(10 * Math.sqrt(3) / 2)
    })

    it('returns 0 for 0° angle', () => {
      expect(findOpposite(10, 0)).toBeCloseTo(0)
    })

    it('returns hypotenuse for 90° angle', () => {
      expect(findOpposite(10, 90)).toBeCloseTo(10)
    })
  })

  describe('findAdjacent', () => {
    it('calculates adjacent from hypotenuse and angle', () => {
      // cos(60°) = 0.5, so adjacent = 10 * 0.5 = 5
      expect(findAdjacent(10, 60)).toBeCloseTo(5)
    })

    it('calculates for 45° angle', () => {
      // cos(45°) = √2/2
      expect(findAdjacent(10, 45)).toBeCloseTo(10 * Math.SQRT2 / 2)
    })

    it('returns hypotenuse for 0° angle', () => {
      expect(findAdjacent(10, 0)).toBeCloseTo(10)
    })

    it('returns 0 for 90° angle', () => {
      expect(findAdjacent(10, 90)).toBeCloseTo(0)
    })
  })

  describe('findHypotenuse', () => {
    it('calculates using Pythagorean theorem', () => {
      // 3² + 4² = 9 + 16 = 25, √25 = 5
      expect(findHypotenuse(3, 4)).toBeCloseTo(5)
    })

    it('works for equal sides (isosceles)', () => {
      // 1² + 1² = 2, √2 ≈ 1.414
      expect(findHypotenuse(1, 1)).toBeCloseTo(Math.SQRT2)
    })

    it('works for 5-12-13 triangle', () => {
      expect(findHypotenuse(5, 12)).toBeCloseTo(13)
    })

    it('works for 8-15-17 triangle', () => {
      expect(findHypotenuse(8, 15)).toBeCloseTo(17)
    })
  })

  describe('findHypotenuseFromOpposite', () => {
    it('calculates hypotenuse from opposite and angle', () => {
      // sin(30°) = 0.5, so if opposite = 5, hypotenuse = 5/0.5 = 10
      expect(findHypotenuseFromOpposite(5, 30)).toBeCloseTo(10)
    })

    it('throws for 0° angle', () => {
      expect(() => findHypotenuseFromOpposite(5, 0)).toThrow()
    })
  })

  describe('findHypotenuseFromAdjacent', () => {
    it('calculates hypotenuse from adjacent and angle', () => {
      // cos(60°) = 0.5, so if adjacent = 5, hypotenuse = 5/0.5 = 10
      expect(findHypotenuseFromAdjacent(5, 60)).toBeCloseTo(10)
    })

    it('throws for 90° angle', () => {
      expect(() => findHypotenuseFromAdjacent(5, 90)).toThrow()
    })
  })

  describe('findOppositeFromAdjacent', () => {
    it('calculates opposite from adjacent and angle', () => {
      // tan(45°) = 1, so opposite = adjacent
      expect(findOppositeFromAdjacent(5, 45)).toBeCloseTo(5)
    })

    it('calculates for 60° angle', () => {
      // tan(60°) = √3
      expect(findOppositeFromAdjacent(5, 60)).toBeCloseTo(5 * Math.sqrt(3))
    })
  })

  describe('findAdjacentFromOpposite', () => {
    it('calculates adjacent from opposite and angle', () => {
      // tan(45°) = 1, so adjacent = opposite
      expect(findAdjacentFromOpposite(5, 45)).toBeCloseTo(5)
    })

    it('throws for 0° angle', () => {
      expect(() => findAdjacentFromOpposite(5, 0)).toThrow()
    })
  })

  describe('findAngleFromSides', () => {
    it('finds 45° from equal sides', () => {
      expect(findAngleFromSides(5, 5)).toBeCloseTo(45)
    })

    it('finds 30° from 1:√3 ratio', () => {
      expect(findAngleFromSides(1, Math.sqrt(3))).toBeCloseTo(30)
    })

    it('finds 60° from √3:1 ratio', () => {
      expect(findAngleFromSides(Math.sqrt(3), 1)).toBeCloseTo(60)
    })
  })

  describe('findAngleFromOppositeHypotenuse', () => {
    it('finds 30° from 1:2 ratio', () => {
      expect(findAngleFromOppositeHypotenuse(5, 10)).toBeCloseTo(30)
    })

    it('finds 90° when opposite equals hypotenuse', () => {
      expect(findAngleFromOppositeHypotenuse(10, 10)).toBeCloseTo(90)
    })

    it('throws when opposite > hypotenuse', () => {
      expect(() => findAngleFromOppositeHypotenuse(12, 10)).toThrow()
    })
  })

  describe('findAngleFromAdjacentHypotenuse', () => {
    it('finds 60° from 1:2 ratio', () => {
      expect(findAngleFromAdjacentHypotenuse(5, 10)).toBeCloseTo(60)
    })

    it('finds 0° when adjacent equals hypotenuse', () => {
      expect(findAngleFromAdjacentHypotenuse(10, 10)).toBeCloseTo(0)
    })

    it('throws when adjacent > hypotenuse', () => {
      expect(() => findAngleFromAdjacentHypotenuse(12, 10)).toThrow()
    })
  })

  describe('findAdjacentFromPythagorean', () => {
    it('finds adjacent in 3-4-5 triangle', () => {
      expect(findAdjacentFromPythagorean(5, 3)).toBeCloseTo(4)
    })

    it('throws when opposite > hypotenuse', () => {
      expect(() => findAdjacentFromPythagorean(5, 6)).toThrow()
    })
  })

  describe('findOppositeFromPythagorean', () => {
    it('finds opposite in 3-4-5 triangle', () => {
      expect(findOppositeFromPythagorean(5, 4)).toBeCloseTo(3)
    })

    it('throws when adjacent > hypotenuse', () => {
      expect(() => findOppositeFromPythagorean(5, 6)).toThrow()
    })
  })

  // ============= Validation Functions =============

  describe('canSolve', () => {
    it('returns false with no values', () => {
      const result = canSolve({})
      expect(result.hasEnoughInfo).toBe(false)
      expect(result.hasSide).toBe(false)
    })

    it('returns false with only one value', () => {
      expect(canSolve({ a: 3 }).hasEnoughInfo).toBe(false)
      expect(canSolve({ A: 30 }).hasEnoughInfo).toBe(false)
    })

    it('returns false with two angles but no side', () => {
      const result = canSolve({ A: 30, B: 60 })
      expect(result.hasEnoughInfo).toBe(false)
      expect(result.hasSide).toBe(false)
    })

    it('returns true with two sides', () => {
      const result = canSolve({ a: 3, b: 4 })
      expect(result.hasEnoughInfo).toBe(true)
      expect(result.hasSide).toBe(true)
    })

    it('returns true with angle and side', () => {
      const result = canSolve({ A: 30, c: 10 })
      expect(result.hasEnoughInfo).toBe(true)
    })

    it('rejects negative sides', () => {
      const result = canSolve({ a: -3, b: 4 })
      expect(result.isValid).toBe(false)
    })

    it('rejects angles >= 90', () => {
      const result = canSolve({ A: 90, c: 10 })
      expect(result.isValid).toBe(false)
    })

    it('rejects angles <= 0', () => {
      const result = canSolve({ A: 0, c: 10 })
      expect(result.isValid).toBe(false)
    })

    it('rejects if angles do not sum to 90', () => {
      const result = canSolve({ A: 30, B: 50 })
      expect(result.isValid).toBe(false)
    })

    it('rejects if hypotenuse <= leg', () => {
      const result = canSolve({ a: 5, c: 3 })
      expect(result.isValid).toBe(false)
    })
  })

  describe('validateTriangle', () => {
    it('validates a correct 3-4-5 triangle', () => {
      const triangle: RightTriangle = {
        a: 3,
        b: 4,
        c: 5,
        A: 36.87,
        B: 53.13,
      }
      expect(validateTriangle(triangle)).toBe(true)
    })

    it('validates a 45-45-90 triangle', () => {
      const triangle: RightTriangle = {
        a: 1,
        b: 1,
        c: Math.SQRT2,
        A: 45,
        B: 45,
      }
      expect(validateTriangle(triangle)).toBe(true)
    })

    it('rejects incomplete triangles', () => {
      const triangle: RightTriangle = {
        a: 3,
        b: null,
        c: 5,
        A: 36.87,
        B: 53.13,
      }
      expect(validateTriangle(triangle)).toBe(false)
    })

    it('rejects if angles do not sum to 90', () => {
      const triangle: RightTriangle = {
        a: 3,
        b: 4,
        c: 5,
        A: 30,
        B: 50,
      }
      expect(validateTriangle(triangle)).toBe(false)
    })
  })

  // ============= Main Solving Function =============

  describe('solveRightTriangle', () => {
    it('solves 3-4-5 triangle from two sides', () => {
      const result = solveRightTriangle({ a: 3, b: 4 })
      expect(result.isValid).toBe(true)
      expect(result.triangle.c).toBeCloseTo(5)
      expect(result.triangle.A).toBeCloseTo(36.87, 1)
      expect(result.triangle.B).toBeCloseTo(53.13, 1)
    })

    it('solves from hypotenuse and angle', () => {
      const result = solveRightTriangle({ c: 10, A: 30 })
      expect(result.isValid).toBe(true)
      expect(result.triangle.a).toBeCloseTo(5)
      expect(result.triangle.b).toBeCloseTo(10 * Math.sqrt(3) / 2)
      expect(result.triangle.B).toBeCloseTo(60)
    })

    it('solves from opposite side and angle', () => {
      const result = solveRightTriangle({ a: 5, A: 30 })
      expect(result.isValid).toBe(true)
      expect(result.triangle.c).toBeCloseTo(10)
      expect(result.triangle.b).toBeCloseTo(5 * Math.sqrt(3))
    })

    it('solves from adjacent side and angle', () => {
      const result = solveRightTriangle({ b: 5, A: 60 })
      expect(result.isValid).toBe(true)
      expect(result.triangle.a).toBeCloseTo(5 * Math.sqrt(3))
      expect(result.triangle.c).toBeCloseTo(10)
    })

    it('solves from hypotenuse and opposite', () => {
      const result = solveRightTriangle({ c: 10, a: 5 })
      expect(result.isValid).toBe(true)
      expect(result.triangle.b).toBeCloseTo(10 * Math.sqrt(3) / 2)
      expect(result.triangle.A).toBeCloseTo(30)
      expect(result.triangle.B).toBeCloseTo(60)
    })

    it('solves from hypotenuse and adjacent', () => {
      const result = solveRightTriangle({ c: 10, b: 5 })
      expect(result.isValid).toBe(true)
      expect(result.triangle.a).toBeCloseTo(10 * Math.sqrt(3) / 2)
      expect(result.triangle.A).toBeCloseTo(60)
    })

    it('handles 45-45-90 triangle', () => {
      const result = solveRightTriangle({ c: Math.SQRT2, A: 45 })
      expect(result.isValid).toBe(true)
      expect(result.triangle.a).toBeCloseTo(1)
      expect(result.triangle.b).toBeCloseTo(1)
      expect(result.triangle.B).toBeCloseTo(45)
    })

    it('returns error when not enough info', () => {
      const result = solveRightTriangle({ a: 5 })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('2 values')
    })

    it('returns error for invalid triangle', () => {
      const result = solveRightTriangle({ a: 10, c: 5 })
      expect(result.isValid).toBe(false)
    })

    it('includes solution steps', () => {
      const result = solveRightTriangle({ a: 3, b: 4 })
      expect(result.steps.length).toBeGreaterThan(0)
      expect(result.steps.some(s => s.formulaName === 'Pythagorean theorem')).toBe(true)
    })

    it('can solve from angle B', () => {
      const result = solveRightTriangle({ B: 60, c: 10 })
      expect(result.isValid).toBe(true)
      expect(result.triangle.A).toBeCloseTo(30)
      expect(result.triangle.a).toBeCloseTo(5)
    })
  })

  // ============= Special Triangle Functions =============

  describe('SPECIAL_TRIANGLES', () => {
    it('contains 30-60-90 triangle', () => {
      const triangle = SPECIAL_TRIANGLES['30-60-90']
      expect(triangle).toBeDefined()
      expect(triangle!.angles).toEqual([30, 60, 90])
      expect(triangle!.sideRatios[0]).toBe(1)
      expect(triangle!.sideRatios[1]).toBeCloseTo(Math.sqrt(3))
      expect(triangle!.sideRatios[2]).toBe(2)
    })

    it('contains 45-45-90 triangle', () => {
      const triangle = SPECIAL_TRIANGLES['45-45-90']
      expect(triangle).toBeDefined()
      expect(triangle!.angles).toEqual([45, 45, 90])
      expect(triangle!.sideRatios[0]).toBe(1)
      expect(triangle!.sideRatios[1]).toBe(1)
      expect(triangle!.sideRatios[2]).toBeCloseTo(Math.SQRT2)
    })
  })

  describe('isSpecialTriangle', () => {
    it('identifies 30-60-90 triangle', () => {
      expect(isSpecialTriangle(30, 60)).toBe('30-60-90')
      expect(isSpecialTriangle(60, 30)).toBe('30-60-90')
    })

    it('identifies 45-45-90 triangle', () => {
      expect(isSpecialTriangle(45, 45)).toBe('45-45-90')
    })

    it('returns null for non-special triangles', () => {
      expect(isSpecialTriangle(40, 50)).toBeNull()
      expect(isSpecialTriangle(20, 70)).toBeNull()
    })
  })

  describe('getSpecialTriangleInfo', () => {
    it('returns info for 30° angle', () => {
      const info = getSpecialTriangleInfo(30)
      expect(info).not.toBeNull()
      expect(info!.name).toBe('30-60-90 Triangle')
    })

    it('returns info for 60° angle', () => {
      const info = getSpecialTriangleInfo(60)
      expect(info).not.toBeNull()
      expect(info!.name).toBe('30-60-90 Triangle')
    })

    it('returns info for 45° angle', () => {
      const info = getSpecialTriangleInfo(45)
      expect(info).not.toBeNull()
      expect(info!.name).toBe('45-45-90 Triangle')
    })

    it('returns null for non-special angle', () => {
      expect(getSpecialTriangleInfo(40)).toBeNull()
    })
  })

  describe('scaleSpecialTriangle', () => {
    it('scales 30-60-90 triangle correctly', () => {
      const triangle = scaleSpecialTriangle('30-60-90', 10)
      expect(triangle.c).toBe(10)
      expect(triangle.a).toBeCloseTo(5) // opposite to 30°
      expect(triangle.b).toBeCloseTo(5 * Math.sqrt(3)) // adjacent to 30°
      expect(triangle.A).toBe(30)
      expect(triangle.B).toBe(60)
    })

    it('scales 45-45-90 triangle correctly', () => {
      const triangle = scaleSpecialTriangle('45-45-90', 10)
      expect(triangle.c).toBe(10)
      expect(triangle.a).toBeCloseTo(10 / Math.SQRT2)
      expect(triangle.b).toBeCloseTo(10 / Math.SQRT2)
      expect(triangle.A).toBe(45)
      expect(triangle.B).toBe(45)
    })
  })

  // ============= SOHCAHTOA =============

  describe('getSOHCAHTOA', () => {
    it('returns all three relationships', () => {
      const sohcahtoa = getSOHCAHTOA()
      expect(sohcahtoa).toHaveLength(3)
    })

    it('includes SOH', () => {
      const sohcahtoa = getSOHCAHTOA()
      const soh = sohcahtoa.find(r => r.mnemonic === 'SOH')
      expect(soh).toBeDefined()
      expect(soh!.full).toContain('Sine')
      expect(soh!.full).toContain('Opposite')
      expect(soh!.full).toContain('Hypotenuse')
    })

    it('includes CAH', () => {
      const sohcahtoa = getSOHCAHTOA()
      const cah = sohcahtoa.find(r => r.mnemonic === 'CAH')
      expect(cah).toBeDefined()
      expect(cah!.full).toContain('Cosine')
      expect(cah!.full).toContain('Adjacent')
    })

    it('includes TOA', () => {
      const sohcahtoa = getSOHCAHTOA()
      const toa = sohcahtoa.find(r => r.mnemonic === 'TOA')
      expect(toa).toBeDefined()
      expect(toa!.full).toContain('Tangent')
    })

    it('includes LaTeX formulas', () => {
      const sohcahtoa = getSOHCAHTOA()
      sohcahtoa.forEach(item => {
        expect(item.formulaLatex).toContain('\\')
      })
    })
  })

  // ============= Area and Perimeter =============

  describe('triangleArea', () => {
    it('calculates area correctly', () => {
      // Area = (1/2) * base * height = (1/2) * 3 * 4 = 6
      expect(triangleArea(3, 4)).toBe(6)
    })

    it('calculates area for unit triangle', () => {
      expect(triangleArea(1, 1)).toBe(0.5)
    })
  })

  describe('trianglePerimeter', () => {
    it('calculates perimeter correctly', () => {
      expect(trianglePerimeter(3, 4, 5)).toBe(12)
    })

    it('calculates perimeter for 45-45-90 triangle', () => {
      expect(trianglePerimeter(1, 1, Math.SQRT2)).toBeCloseTo(2 + Math.SQRT2)
    })
  })
})
