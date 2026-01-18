/**
 * Tests for trigonometric identities utility functions.
 */

import { describe, it, expect } from 'vitest'
import {
  // Identity collections
  ALL_IDENTITIES,
  PYTHAGOREAN_IDENTITIES,
  QUOTIENT_IDENTITIES,
  RECIPROCAL_IDENTITIES,
  SUM_DIFFERENCE_IDENTITIES,
  DOUBLE_ANGLE_IDENTITIES,
  HALF_ANGLE_IDENTITIES,
  // Utility functions
  getIdentityById,
  getIdentitiesByCategory,
  verifyIdentity,
  verifyAllIdentities,
  getCategoryLabel,
  getAllCategories,
} from './trigIdentities'

// ============= Test Data =============

// Safe test angles (avoiding singularities)
const TEST_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 270, 315, 360]

// Angles to avoid for specific identities (where functions are undefined)
const AVOID_COS_ZERO = [90, 270] // cos θ = 0
const AVOID_SIN_ZERO = [0, 180, 360] // sin θ = 0
const AVOID_TAN_UNDEFINED = [90, 270] // tan undefined
const AVOID_DOUBLE_TAN = [45, 135, 225, 315] // tan²θ = 1

// ============= Helper Functions =============

function safeAngles(exclude: number[]): number[] {
  return TEST_ANGLES.filter(a => !exclude.includes(a))
}

// ============= Identity Collection Tests =============

describe('Identity Collections', () => {
  it('should have 3 Pythagorean identities', () => {
    expect(PYTHAGOREAN_IDENTITIES).toHaveLength(3)
    expect(PYTHAGOREAN_IDENTITIES.every(i => i.category === 'pythagorean')).toBe(true)
  })

  it('should have 2 Quotient identities', () => {
    expect(QUOTIENT_IDENTITIES).toHaveLength(2)
    expect(QUOTIENT_IDENTITIES.every(i => i.category === 'quotient')).toBe(true)
  })

  it('should have 3 Reciprocal identities', () => {
    expect(RECIPROCAL_IDENTITIES).toHaveLength(3)
    expect(RECIPROCAL_IDENTITIES.every(i => i.category === 'reciprocal')).toBe(true)
  })

  it('should have 5 Sum/Difference identities', () => {
    expect(SUM_DIFFERENCE_IDENTITIES).toHaveLength(5)
    expect(SUM_DIFFERENCE_IDENTITIES.every(i => i.category === 'sum-diff')).toBe(true)
  })

  it('should have 5 Double Angle identities', () => {
    expect(DOUBLE_ANGLE_IDENTITIES).toHaveLength(5)
    expect(DOUBLE_ANGLE_IDENTITIES.every(i => i.category === 'double')).toBe(true)
  })

  it('should have 3 Half Angle identities', () => {
    expect(HALF_ANGLE_IDENTITIES).toHaveLength(3)
    expect(HALF_ANGLE_IDENTITIES.every(i => i.category === 'half')).toBe(true)
  })

  it('ALL_IDENTITIES should contain all identity collections', () => {
    expect(ALL_IDENTITIES).toHaveLength(21)
    expect(ALL_IDENTITIES).toEqual(
      expect.arrayContaining([
        ...PYTHAGOREAN_IDENTITIES,
        ...QUOTIENT_IDENTITIES,
        ...RECIPROCAL_IDENTITIES,
        ...SUM_DIFFERENCE_IDENTITIES,
        ...DOUBLE_ANGLE_IDENTITIES,
        ...HALF_ANGLE_IDENTITIES,
      ])
    )
  })

  it('every identity should have all required properties', () => {
    for (const identity of ALL_IDENTITIES) {
      expect(identity.id).toBeTruthy()
      expect(identity.name).toBeTruthy()
      expect(identity.category).toBeTruthy()
      expect(identity.latex).toBeTruthy()
      expect(identity.latexLeft).toBeTruthy()
      expect(identity.latexRight).toBeTruthy()
      expect(identity.description).toBeTruthy()
      expect(identity.proofSteps.length).toBeGreaterThan(0)
      expect(typeof identity.verify).toBe('function')
      expect(identity.pythonCode).toBeTruthy()
    }
  })

  it('all identity IDs should be unique', () => {
    const ids = ALL_IDENTITIES.map(i => i.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})

// ============= Pythagorean Identity Tests =============

describe('Pythagorean Identities', () => {
  describe('sin²θ + cos²θ = 1', () => {
    it('should verify at all angles', () => {
      const identity = getIdentityById('pythagorean-main')!
      for (const angle of TEST_ANGLES) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
        expect(result.rightSide).toBe(1)
      }
    })

    it('should return exact 1 for special angles', () => {
      const identity = getIdentityById('pythagorean-main')!
      const result = identity.verify(45)
      expect(Math.abs(result.leftSide - 1)).toBeLessThan(1e-10)
    })
  })

  describe('1 + tan²θ = sec²θ', () => {
    it('should verify at angles where cos ≠ 0', () => {
      const identity = getIdentityById('pythagorean-tan')!
      for (const angle of safeAngles(AVOID_COS_ZERO)) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('should equal 2 at 45°', () => {
      const identity = getIdentityById('pythagorean-tan')!
      const result = identity.verify(45)
      expect(Math.abs(result.leftSide - 2)).toBeLessThan(1e-10)
      expect(Math.abs(result.rightSide - 2)).toBeLessThan(1e-10)
    })
  })

  describe('1 + cot²θ = csc²θ', () => {
    it('should verify at angles where sin ≠ 0', () => {
      const identity = getIdentityById('pythagorean-cot')!
      for (const angle of safeAngles(AVOID_SIN_ZERO)) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('should equal 2 at 45°', () => {
      const identity = getIdentityById('pythagorean-cot')!
      const result = identity.verify(45)
      expect(Math.abs(result.leftSide - 2)).toBeLessThan(1e-10)
      expect(Math.abs(result.rightSide - 2)).toBeLessThan(1e-10)
    })
  })
})

// ============= Quotient Identity Tests =============

describe('Quotient Identities', () => {
  describe('tan θ = sin θ / cos θ', () => {
    it('should verify at safe angles', () => {
      const identity = getIdentityById('quotient-tan')!
      for (const angle of safeAngles(AVOID_COS_ZERO)) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('should equal 1 at 45°', () => {
      const identity = getIdentityById('quotient-tan')!
      const result = identity.verify(45)
      expect(Math.abs(result.leftSide - 1)).toBeLessThan(1e-10)
    })

    it('should equal 0 at 0°', () => {
      const identity = getIdentityById('quotient-tan')!
      const result = identity.verify(0)
      expect(Math.abs(result.leftSide)).toBeLessThan(1e-10)
    })
  })

  describe('cot θ = cos θ / sin θ', () => {
    it('should verify at safe angles', () => {
      const identity = getIdentityById('quotient-cot')!
      for (const angle of safeAngles(AVOID_SIN_ZERO)) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('should equal 1 at 45°', () => {
      const identity = getIdentityById('quotient-cot')!
      const result = identity.verify(45)
      expect(Math.abs(result.leftSide - 1)).toBeLessThan(1e-10)
    })
  })
})

// ============= Reciprocal Identity Tests =============

describe('Reciprocal Identities', () => {
  describe('csc θ = 1 / sin θ', () => {
    it('should verify at safe angles', () => {
      const identity = getIdentityById('reciprocal-csc')!
      for (const angle of safeAngles(AVOID_SIN_ZERO)) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('should equal 2 at 30°', () => {
      const identity = getIdentityById('reciprocal-csc')!
      const result = identity.verify(30)
      expect(Math.abs(result.leftSide - 2)).toBeLessThan(1e-10)
    })
  })

  describe('sec θ = 1 / cos θ', () => {
    it('should verify at safe angles', () => {
      const identity = getIdentityById('reciprocal-sec')!
      for (const angle of safeAngles(AVOID_COS_ZERO)) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('should equal 2 at 60°', () => {
      const identity = getIdentityById('reciprocal-sec')!
      const result = identity.verify(60)
      expect(Math.abs(result.leftSide - 2)).toBeLessThan(1e-10)
    })
  })

  describe('cot θ = 1 / tan θ', () => {
    it('should verify at safe angles', () => {
      const identity = getIdentityById('reciprocal-cot')!
      for (const angle of safeAngles([...AVOID_SIN_ZERO, ...AVOID_TAN_UNDEFINED])) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })
  })
})

// ============= Sum/Difference Identity Tests =============

describe('Sum/Difference Identities', () => {
  describe('sin(A + B)', () => {
    it('should verify sin(45 + 30) = sin(75)', () => {
      const identity = getIdentityById('sum-sin')!
      const result = identity.verify(45, 30)
      expect(result.isEqual).toBe(true)
      // sin(75°) ≈ 0.9659
      expect(Math.abs(result.leftSide - 0.9659258262890683)).toBeLessThan(1e-10)
    })

    it('should verify at various angle combinations', () => {
      const identity = getIdentityById('sum-sin')!
      const testPairs = [
        [30, 45],
        [60, 30],
        [0, 45],
        [90, 0],
      ]
      for (const [a, b] of testPairs) {
        const result = identity.verify(a!, b)
        expect(result.isEqual).toBe(true)
      }
    })
  })

  describe('sin(A - B)', () => {
    it('should verify sin(45 - 30) = sin(15)', () => {
      const identity = getIdentityById('diff-sin')!
      const result = identity.verify(45, 30)
      expect(result.isEqual).toBe(true)
      // sin(15°) ≈ 0.2588
      expect(Math.abs(result.leftSide - 0.2588190451025207)).toBeLessThan(1e-10)
    })
  })

  describe('cos(A + B)', () => {
    it('should verify cos(45 + 30) = cos(75)', () => {
      const identity = getIdentityById('sum-cos')!
      const result = identity.verify(45, 30)
      expect(result.isEqual).toBe(true)
      // cos(75°) ≈ 0.2588
      expect(Math.abs(result.leftSide - 0.2588190451025207)).toBeLessThan(1e-10)
    })
  })

  describe('cos(A - B)', () => {
    it('should verify cos(45 - 30) = cos(15)', () => {
      const identity = getIdentityById('diff-cos')!
      const result = identity.verify(45, 30)
      expect(result.isEqual).toBe(true)
      // cos(15°) ≈ 0.9659
      expect(Math.abs(result.leftSide - 0.9659258262890683)).toBeLessThan(1e-10)
    })
  })

  describe('tan(A + B)', () => {
    it('should verify tan(45 + 30) = tan(75)', () => {
      const identity = getIdentityById('sum-tan')!
      const result = identity.verify(45, 30)
      expect(result.isEqual).toBe(true)
      // tan(75°) ≈ 3.732
      expect(Math.abs(result.leftSide - 3.7320508075688776)).toBeLessThan(1e-10)
    })
  })
})

// ============= Double Angle Identity Tests =============

describe('Double Angle Identities', () => {
  describe('sin(2θ) = 2sin(θ)cos(θ)', () => {
    it('should verify at all angles', () => {
      const identity = getIdentityById('double-sin')!
      for (const angle of TEST_ANGLES) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('sin(60) should equal sin(2×30)', () => {
      const identity = getIdentityById('double-sin')!
      const result = identity.verify(30)
      // sin(60°) ≈ 0.866
      expect(Math.abs(result.leftSide - Math.sqrt(3) / 2)).toBeLessThan(1e-10)
    })
  })

  describe('cos(2θ) = cos²θ - sin²θ', () => {
    it('should verify at all angles', () => {
      const identity = getIdentityById('double-cos-v1')!
      for (const angle of TEST_ANGLES) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('cos(60) should equal 0.5', () => {
      const identity = getIdentityById('double-cos-v1')!
      const result = identity.verify(30)
      expect(Math.abs(result.leftSide - 0.5)).toBeLessThan(1e-10)
    })
  })

  describe('cos(2θ) = 2cos²θ - 1', () => {
    it('should verify at all angles', () => {
      const identity = getIdentityById('double-cos-v2')!
      for (const angle of TEST_ANGLES) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })
  })

  describe('cos(2θ) = 1 - 2sin²θ', () => {
    it('should verify at all angles', () => {
      const identity = getIdentityById('double-cos-v3')!
      for (const angle of TEST_ANGLES) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })
  })

  describe('tan(2θ)', () => {
    it('should verify at safe angles', () => {
      const identity = getIdentityById('double-tan')!
      for (const angle of safeAngles([...AVOID_DOUBLE_TAN, ...AVOID_TAN_UNDEFINED])) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('tan(60) should equal √3', () => {
      const identity = getIdentityById('double-tan')!
      const result = identity.verify(30)
      expect(Math.abs(result.leftSide - Math.sqrt(3))).toBeLessThan(1e-10)
    })
  })
})

// ============= Half Angle Identity Tests =============

describe('Half Angle Identities', () => {
  describe('sin(θ/2)', () => {
    it('should verify at all angles', () => {
      const identity = getIdentityById('half-sin')!
      for (const angle of TEST_ANGLES) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('sin(30) = sin(60/2) = 0.5', () => {
      const identity = getIdentityById('half-sin')!
      const result = identity.verify(60)
      expect(Math.abs(result.leftSide - 0.5)).toBeLessThan(1e-10)
    })
  })

  describe('cos(θ/2)', () => {
    it('should verify at all angles', () => {
      const identity = getIdentityById('half-cos')!
      for (const angle of TEST_ANGLES) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('cos(30) = cos(60/2) ≈ 0.866', () => {
      const identity = getIdentityById('half-cos')!
      const result = identity.verify(60)
      expect(Math.abs(result.leftSide - Math.sqrt(3) / 2)).toBeLessThan(1e-10)
    })
  })

  describe('tan(θ/2)', () => {
    it('should verify at safe angles', () => {
      const identity = getIdentityById('half-tan')!
      for (const angle of safeAngles(AVOID_SIN_ZERO)) {
        const result = identity.verify(angle)
        expect(result.isEqual).toBe(true)
      }
    })

    it('tan(30) = tan(60/2) ≈ 0.577', () => {
      const identity = getIdentityById('half-tan')!
      const result = identity.verify(60)
      expect(Math.abs(result.leftSide - 1 / Math.sqrt(3))).toBeLessThan(1e-10)
    })
  })
})

// ============= Utility Function Tests =============

describe('getIdentityById', () => {
  it('should return the correct identity', () => {
    const identity = getIdentityById('pythagorean-main')
    expect(identity).toBeDefined()
    expect(identity!.name).toBe('Pythagorean Identity')
  })

  it('should return undefined for unknown id', () => {
    const identity = getIdentityById('nonexistent-identity')
    expect(identity).toBeUndefined()
  })

  it('should find all identities by their ids', () => {
    for (const identity of ALL_IDENTITIES) {
      const found = getIdentityById(identity.id)
      expect(found).toBe(identity)
    }
  })
})

describe('getIdentitiesByCategory', () => {
  it('should return Pythagorean identities', () => {
    const identities = getIdentitiesByCategory('pythagorean')
    expect(identities).toHaveLength(3)
    expect(identities).toEqual(PYTHAGOREAN_IDENTITIES)
  })

  it('should return Quotient identities', () => {
    const identities = getIdentitiesByCategory('quotient')
    expect(identities).toHaveLength(2)
    expect(identities).toEqual(QUOTIENT_IDENTITIES)
  })

  it('should return Reciprocal identities', () => {
    const identities = getIdentitiesByCategory('reciprocal')
    expect(identities).toHaveLength(3)
    expect(identities).toEqual(RECIPROCAL_IDENTITIES)
  })

  it('should return Sum/Difference identities', () => {
    const identities = getIdentitiesByCategory('sum-diff')
    expect(identities).toHaveLength(5)
    expect(identities).toEqual(SUM_DIFFERENCE_IDENTITIES)
  })

  it('should return Double Angle identities', () => {
    const identities = getIdentitiesByCategory('double')
    expect(identities).toHaveLength(5)
    expect(identities).toEqual(DOUBLE_ANGLE_IDENTITIES)
  })

  it('should return Half Angle identities', () => {
    const identities = getIdentitiesByCategory('half')
    expect(identities).toHaveLength(3)
    expect(identities).toEqual(HALF_ANGLE_IDENTITIES)
  })

  it('should return empty array for product-sum (not implemented)', () => {
    const identities = getIdentitiesByCategory('product-sum')
    expect(identities).toHaveLength(0)
  })
})

describe('verifyIdentity', () => {
  it('should verify an identity at a specific angle', () => {
    const identity = getIdentityById('pythagorean-main')!
    const result = verifyIdentity(identity, 45)
    expect(result.isEqual).toBe(true)
    expect(result.angleDeg).toBe(45)
  })

  it('should pass second angle for sum/diff identities', () => {
    const identity = getIdentityById('sum-sin')!
    const result = verifyIdentity(identity, 30, 45)
    expect(result.isEqual).toBe(true)
  })
})

describe('verifyAllIdentities', () => {
  it('should return results for all identities', () => {
    const results = verifyAllIdentities(30)
    expect(results.size).toBe(ALL_IDENTITIES.length)
  })

  it('should use the correct angle', () => {
    const results = verifyAllIdentities(60)
    for (const result of results.values()) {
      expect(result.angleDeg).toBe(60)
    }
  })

  it('most identities should verify at 30°', () => {
    const results = verifyAllIdentities(30)
    // Count how many verified successfully
    let verified = 0
    for (const result of results.values()) {
      if (result.isEqual) verified++
    }
    // All should verify at 30° (a safe angle)
    expect(verified).toBe(ALL_IDENTITIES.length)
  })
})

describe('getCategoryLabel', () => {
  it('should return correct label for pythagorean', () => {
    expect(getCategoryLabel('pythagorean')).toBe('Pythagorean Identities')
  })

  it('should return correct label for quotient', () => {
    expect(getCategoryLabel('quotient')).toBe('Quotient Identities')
  })

  it('should return correct label for reciprocal', () => {
    expect(getCategoryLabel('reciprocal')).toBe('Reciprocal Identities')
  })

  it('should return correct label for sum-diff', () => {
    expect(getCategoryLabel('sum-diff')).toBe('Sum & Difference Formulas')
  })

  it('should return correct label for double', () => {
    expect(getCategoryLabel('double')).toBe('Double Angle Formulas')
  })

  it('should return correct label for half', () => {
    expect(getCategoryLabel('half')).toBe('Half Angle Formulas')
  })

  it('should return correct label for product-sum', () => {
    expect(getCategoryLabel('product-sum')).toBe('Product-to-Sum Formulas')
  })
})

describe('getAllCategories', () => {
  it('should return all 6 implemented categories', () => {
    const categories = getAllCategories()
    expect(categories).toHaveLength(6)
    expect(categories).toContain('pythagorean')
    expect(categories).toContain('quotient')
    expect(categories).toContain('reciprocal')
    expect(categories).toContain('sum-diff')
    expect(categories).toContain('double')
    expect(categories).toContain('half')
  })
})

// ============= VerificationResult Tests =============

describe('VerificationResult', () => {
  it('should have correct structure', () => {
    const identity = getIdentityById('pythagorean-main')!
    const result = identity.verify(45)

    expect(typeof result.leftSide).toBe('number')
    expect(typeof result.rightSide).toBe('number')
    expect(typeof result.leftSideFormatted).toBe('string')
    expect(typeof result.rightSideFormatted).toBe('string')
    expect(typeof result.isEqual).toBe('boolean')
    expect(typeof result.tolerance).toBe('number')
    expect(typeof result.angleDeg).toBe('number')
  })

  it('should format small numbers as 0', () => {
    const identity = getIdentityById('quotient-tan')!
    const result = identity.verify(0)
    expect(result.leftSideFormatted).toBe('0')
  })

  it('should format 1 correctly', () => {
    const identity = getIdentityById('pythagorean-main')!
    const result = identity.verify(45)
    expect(result.leftSideFormatted).toBe('1')
    expect(result.rightSideFormatted).toBe('1')
  })
})

// ============= ProofStep Tests =============

describe('ProofSteps', () => {
  it('every identity should have at least 2 proof steps', () => {
    for (const identity of ALL_IDENTITIES) {
      expect(identity.proofSteps.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('proof steps should have required fields', () => {
    for (const identity of ALL_IDENTITIES) {
      for (const step of identity.proofSteps) {
        expect(typeof step.step).toBe('number')
        expect(step.latex).toBeTruthy()
        expect(step.explanation).toBeTruthy()
      }
    }
  })

  it('proof steps should be numbered sequentially', () => {
    for (const identity of ALL_IDENTITIES) {
      for (let i = 0; i < identity.proofSteps.length; i++) {
        expect(identity.proofSteps[i]!.step).toBe(i + 1)
      }
    }
  })
})

// ============= Edge Cases =============

describe('Edge Cases', () => {
  it('should handle 0 degrees', () => {
    const identity = getIdentityById('pythagorean-main')!
    const result = identity.verify(0)
    expect(result.isEqual).toBe(true)
    // sin(0) = 0, cos(0) = 1, so 0 + 1 = 1
    expect(Math.abs(result.leftSide - 1)).toBeLessThan(1e-10)
  })

  it('should handle 360 degrees', () => {
    const identity = getIdentityById('pythagorean-main')!
    const result = identity.verify(360)
    expect(result.isEqual).toBe(true)
  })

  it('should handle negative angles', () => {
    const identity = getIdentityById('pythagorean-main')!
    const result = identity.verify(-45)
    expect(result.isEqual).toBe(true)
  })

  it('should handle angles > 360', () => {
    const identity = getIdentityById('double-sin')!
    const result = identity.verify(405) // 405 = 360 + 45
    expect(result.isEqual).toBe(true)
  })

  it('sum identities should use default second angle when not provided', () => {
    const identity = getIdentityById('sum-sin')!
    const result = identity.verify(45) // Uses default B = 30
    expect(result.isEqual).toBe(true)
    // sin(45 + 30) = sin(75)
    const expected = Math.sin((75 * Math.PI) / 180)
    expect(Math.abs(result.leftSide - expected)).toBeLessThan(1e-10)
  })
})

// ============= Python Code Tests =============

describe('Python Code Examples', () => {
  it('every identity should have Python code', () => {
    for (const identity of ALL_IDENTITIES) {
      expect(identity.pythonCode).toBeTruthy()
      expect(identity.pythonCode.includes('import math')).toBe(true)
    }
  })

  it('Python code should include a function definition', () => {
    for (const identity of ALL_IDENTITIES) {
      expect(identity.pythonCode.includes('def ')).toBe(true)
    }
  })

  it('Python code should include an example', () => {
    for (const identity of ALL_IDENTITIES) {
      expect(identity.pythonCode.includes('print(')).toBe(true)
    }
  })
})
