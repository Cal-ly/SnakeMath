import { describe, it, expect } from 'vitest'
import {
  arcsin,
  arccos,
  arctan,
  atan2,
  isInDomain,
  evaluateInverse,
  getExactInverseValue,
  findAllSolutions,
  getInverseFunctionInfo,
  formatAngleResult,
  getInverseTrigPreset,
  INVERSE_TRIG_PRESETS,
  INVERSE_FUNCTIONS,
  ARCSIN_DOMAIN,
  ARCSIN_RANGE,
  ARCCOS_DOMAIN,
  ARCCOS_RANGE,
  ARCTAN_DOMAIN,
  ARCTAN_RANGE,
} from './inverseTrig'

const TOLERANCE = 1e-6

// ============= arcsin Tests =============

describe('arcsin', () => {
  describe('special values', () => {
    it('should return 0° for arcsin(0)', () => {
      const result = arcsin(0)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(0, 6)
      expect(result.exactValue).toBe('0')
    })

    it('should return 30° for arcsin(0.5)', () => {
      const result = arcsin(0.5)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(30, 6)
      expect(result.exactValue).toBe('\\frac{\\pi}{6}')
    })

    it('should return 45° for arcsin(√2/2)', () => {
      const result = arcsin(Math.sqrt(2) / 2)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(45, 6)
      expect(result.exactValue).toBe('\\frac{\\pi}{4}')
    })

    it('should return 60° for arcsin(√3/2)', () => {
      const result = arcsin(Math.sqrt(3) / 2)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(60, 6)
      expect(result.exactValue).toBe('\\frac{\\pi}{3}')
    })

    it('should return 90° for arcsin(1)', () => {
      const result = arcsin(1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(90, 6)
      expect(result.exactValue).toBe('\\frac{\\pi}{2}')
    })

    it('should return -30° for arcsin(-0.5)', () => {
      const result = arcsin(-0.5)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(-30, 6)
      expect(result.exactValue).toBe('-\\frac{\\pi}{6}')
    })

    it('should return -90° for arcsin(-1)', () => {
      const result = arcsin(-1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(-90, 6)
      expect(result.exactValue).toBe('-\\frac{\\pi}{2}')
    })
  })

  describe('domain validation', () => {
    it('should return invalid for values > 1', () => {
      const result = arcsin(1.5)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('undefined')
    })

    it('should return invalid for values < -1', () => {
      const result = arcsin(-1.5)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('undefined')
    })

    it('should have correct domain and range', () => {
      const result = arcsin(0)
      expect(result.domain).toEqual(ARCSIN_DOMAIN)
      expect(result.range).toEqual(ARCSIN_RANGE)
    })
  })

  describe('all solutions in range', () => {
    it('should find both solutions for sin = 0.5', () => {
      const result = arcsin(0.5)
      expect(result.allSolutionsInRange.length).toBe(2)
      expect(result.allSolutionsInRange.some(s => Math.abs(s - 30) < TOLERANCE)).toBe(true)
      expect(result.allSolutionsInRange.some(s => Math.abs(s - 150) < TOLERANCE)).toBe(true)
    })

    it('should find single solution for sin = 1', () => {
      const result = arcsin(1)
      expect(result.allSolutionsInRange.length).toBe(1)
      expect(result.allSolutionsInRange[0]).toBeCloseTo(90, 6)
    })
  })

  describe('radians conversion', () => {
    it('should return correct radian value', () => {
      const result = arcsin(0.5)
      expect(result.value).toBeCloseTo(Math.PI / 6, 10)
    })
  })
})

// ============= arccos Tests =============

describe('arccos', () => {
  describe('special values', () => {
    it('should return 90° for arccos(0)', () => {
      const result = arccos(0)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(90, 6)
      expect(result.exactValue).toBe('\\frac{\\pi}{2}')
    })

    it('should return 60° for arccos(0.5)', () => {
      const result = arccos(0.5)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(60, 6)
      expect(result.exactValue).toBe('\\frac{\\pi}{3}')
    })

    it('should return 45° for arccos(√2/2)', () => {
      const result = arccos(Math.sqrt(2) / 2)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(45, 6)
      expect(result.exactValue).toBe('\\frac{\\pi}{4}')
    })

    it('should return 0° for arccos(1)', () => {
      const result = arccos(1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(0, 6)
      expect(result.exactValue).toBe('0')
    })

    it('should return 180° for arccos(-1)', () => {
      const result = arccos(-1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(180, 6)
      expect(result.exactValue).toBe('\\pi')
    })

    it('should return 120° for arccos(-0.5)', () => {
      const result = arccos(-0.5)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(120, 6)
      expect(result.exactValue).toBe('\\frac{2\\pi}{3}')
    })
  })

  describe('domain validation', () => {
    it('should return invalid for values > 1', () => {
      const result = arccos(2)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('undefined')
    })

    it('should return invalid for values < -1', () => {
      const result = arccos(-2)
      expect(result.isValid).toBe(false)
    })

    it('should have correct domain and range', () => {
      const result = arccos(0)
      expect(result.domain).toEqual(ARCCOS_DOMAIN)
      expect(result.range).toEqual(ARCCOS_RANGE)
    })
  })

  describe('all solutions in range', () => {
    it('should find both solutions for cos = 0.5', () => {
      const result = arccos(0.5)
      expect(result.allSolutionsInRange.length).toBe(2)
      expect(result.allSolutionsInRange.some(s => Math.abs(s - 60) < TOLERANCE)).toBe(true)
      expect(result.allSolutionsInRange.some(s => Math.abs(s - 300) < TOLERANCE)).toBe(true)
    })

    it('should find single solution for cos = 1', () => {
      const result = arccos(1)
      expect(result.allSolutionsInRange.length).toBe(1)
      expect(result.allSolutionsInRange[0]).toBeCloseTo(0, 6)
    })
  })
})

// ============= arctan Tests =============

describe('arctan', () => {
  describe('special values', () => {
    it('should return 0° for arctan(0)', () => {
      const result = arctan(0)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(0, 6)
      expect(result.exactValue).toBe('0')
    })

    it('should return 45° for arctan(1)', () => {
      const result = arctan(1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(45, 6)
      expect(result.exactValue).toBe('\\frac{\\pi}{4}')
    })

    it('should return 60° for arctan(√3)', () => {
      const result = arctan(Math.sqrt(3))
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(60, 6)
      expect(result.exactValue).toBe('\\frac{\\pi}{3}')
    })

    it('should return 30° for arctan(1/√3)', () => {
      const result = arctan(1 / Math.sqrt(3))
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(30, 6)
      expect(result.exactValue).toBe('\\frac{\\pi}{6}')
    })

    it('should return -45° for arctan(-1)', () => {
      const result = arctan(-1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(-45, 6)
      expect(result.exactValue).toBe('-\\frac{\\pi}{4}')
    })
  })

  describe('domain validation', () => {
    it('should accept any finite value', () => {
      expect(arctan(1000).isValid).toBe(true)
      expect(arctan(-1000).isValid).toBe(true)
      expect(arctan(0.001).isValid).toBe(true)
    })

    it('should return invalid for infinity', () => {
      const result = arctan(Infinity)
      expect(result.isValid).toBe(false)
    })

    it('should return invalid for NaN', () => {
      const result = arctan(NaN)
      expect(result.isValid).toBe(false)
    })

    it('should have correct domain and range', () => {
      const result = arctan(0)
      expect(result.domain).toEqual(ARCTAN_DOMAIN)
      expect(result.range).toEqual(ARCTAN_RANGE)
    })
  })

  describe('large values approach asymptotes', () => {
    it('should approach 90° for large positive values', () => {
      const result = arctan(1000000)
      expect(result.valueDegrees).toBeCloseTo(90, 2)
    })

    it('should approach -90° for large negative values', () => {
      const result = arctan(-1000000)
      expect(result.valueDegrees).toBeCloseTo(-90, 2)
    })
  })
})

// ============= atan2 Tests =============

describe('atan2', () => {
  describe('quadrant I', () => {
    it('should return 45° for atan2(1, 1)', () => {
      const result = atan2(1, 1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(45, 6)
      expect(result.quadrant).toBe(1)
    })

    it('should return 0° for atan2(0, 1)', () => {
      const result = atan2(0, 1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(0, 6)
      expect(result.quadrant).toBe(1)
    })

    it('should return 60° for atan2(√3, 1)', () => {
      const result = atan2(Math.sqrt(3), 1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(60, 6)
      expect(result.quadrant).toBe(1)
    })
  })

  describe('quadrant II', () => {
    it('should return 135° for atan2(1, -1)', () => {
      const result = atan2(1, -1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(135, 6)
      expect(result.quadrant).toBe(2)
    })

    it('should return 90° for atan2(1, 0)', () => {
      const result = atan2(1, 0)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(90, 6)
      expect(result.quadrant).toBe(2)
    })

    it('should return 120° for atan2(√3, -1)', () => {
      const result = atan2(Math.sqrt(3), -1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(120, 6)
      expect(result.quadrant).toBe(2)
    })
  })

  describe('quadrant III', () => {
    it('should return -135° for atan2(-1, -1)', () => {
      const result = atan2(-1, -1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(-135, 6)
      expect(result.quadrant).toBe(3)
    })

    it('should return 180° (or -180°) for atan2(0, -1)', () => {
      const result = atan2(0, -1)
      expect(result.isValid).toBe(true)
      expect(Math.abs(result.valueDegrees)).toBeCloseTo(180, 6)
      expect(result.quadrant).toBe(3)
    })
  })

  describe('quadrant IV', () => {
    it('should return -45° for atan2(-1, 1)', () => {
      const result = atan2(-1, 1)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(-45, 6)
      expect(result.quadrant).toBe(4)
    })

    it('should return -90° for atan2(-1, 0)', () => {
      const result = atan2(-1, 0)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(-90, 6)
      expect(result.quadrant).toBe(4)
    })
  })

  describe('comparison with regular atan', () => {
    it('should match atan in quadrant I', () => {
      const result = atan2(1, 1)
      expect(result.regularAtanIsWrong).toBe(false)
      expect(result.regularAtanWouldGive).toBeCloseTo(45, 6)
    })

    it('should differ from atan in quadrant II', () => {
      const result = atan2(1, -1)
      expect(result.regularAtanIsWrong).toBe(true)
      expect(result.regularAtanWouldGive).toBeCloseTo(-45, 6) // atan gives -45°, but answer is 135°
    })

    it('should differ from atan in quadrant III', () => {
      const result = atan2(-1, -1)
      expect(result.regularAtanIsWrong).toBe(true)
      expect(result.regularAtanWouldGive).toBeCloseTo(45, 6) // atan gives 45°, but answer is -135°
    })

    it('should match atan in quadrant IV', () => {
      const result = atan2(-1, 1)
      expect(result.regularAtanIsWrong).toBe(false)
      expect(result.regularAtanWouldGive).toBeCloseTo(-45, 6)
    })
  })

  describe('edge cases', () => {
    it('should return invalid for origin (0, 0)', () => {
      const result = atan2(0, 0)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('origin')
    })

    it('should handle very small values', () => {
      const result = atan2(1e-10, 1e-10)
      expect(result.isValid).toBe(true)
      expect(result.valueDegrees).toBeCloseTo(45, 6)
    })
  })

  describe('coordinates stored', () => {
    it('should store x and y coordinates', () => {
      const result = atan2(3, 4)
      expect(result.x).toBe(4)
      expect(result.y).toBe(3)
    })
  })
})

// ============= isInDomain Tests =============

describe('isInDomain', () => {
  it('should validate arcsin domain correctly', () => {
    expect(isInDomain('arcsin', 0.5)).toBe(true)
    expect(isInDomain('arcsin', 1)).toBe(true)
    expect(isInDomain('arcsin', -1)).toBe(true)
    expect(isInDomain('arcsin', 1.5)).toBe(false)
    expect(isInDomain('arcsin', -1.5)).toBe(false)
  })

  it('should validate arccos domain correctly', () => {
    expect(isInDomain('arccos', 0.5)).toBe(true)
    expect(isInDomain('arccos', 1.5)).toBe(false)
  })

  it('should validate arctan domain correctly', () => {
    expect(isInDomain('arctan', 1000)).toBe(true)
    expect(isInDomain('arctan', -1000)).toBe(true)
    expect(isInDomain('arctan', Infinity)).toBe(false)
  })

  it('should validate atan2 domain correctly', () => {
    expect(isInDomain('atan2', 1, 1)).toBe(true)
    expect(isInDomain('atan2', 0, 1)).toBe(true)
    expect(isInDomain('atan2', 1, 0)).toBe(true)
    expect(isInDomain('atan2', 0, 0)).toBe(false)
  })
})

// ============= evaluateInverse Tests =============

describe('evaluateInverse', () => {
  it('should evaluate arcsin correctly', () => {
    const result = evaluateInverse('arcsin', 0.5)
    expect(result.isValid).toBe(true)
    expect(result.valueDegrees).toBeCloseTo(30, 6)
  })

  it('should evaluate arccos correctly', () => {
    const result = evaluateInverse('arccos', 0.5)
    expect(result.isValid).toBe(true)
    expect(result.valueDegrees).toBeCloseTo(60, 6)
  })

  it('should evaluate arctan correctly', () => {
    const result = evaluateInverse('arctan', 1)
    expect(result.isValid).toBe(true)
    expect(result.valueDegrees).toBeCloseTo(45, 6)
  })

  it('should evaluate atan2 correctly', () => {
    const result = evaluateInverse('atan2', 1, 1)
    expect(result.isValid).toBe(true)
    expect(result.valueDegrees).toBeCloseTo(45, 6)
  })
})

// ============= getExactInverseValue Tests =============

describe('getExactInverseValue', () => {
  it('should return exact value for special angles', () => {
    expect(getExactInverseValue('arcsin', 0.5)).toBe('\\frac{\\pi}{6}')
    expect(getExactInverseValue('arccos', 0.5)).toBe('\\frac{\\pi}{3}')
    expect(getExactInverseValue('arctan', 1)).toBe('\\frac{\\pi}{4}')
  })

  it('should return null for non-special values', () => {
    expect(getExactInverseValue('arcsin', 0.3)).toBe(null)
    expect(getExactInverseValue('arccos', 0.7)).toBe(null)
  })
})

// ============= findAllSolutions Tests =============

describe('findAllSolutions', () => {
  it('should find all arcsin solutions in [0, 360)', () => {
    const solutions = findAllSolutions('arcsin', 0.5)
    expect(solutions.length).toBe(2)
    expect(solutions.some(s => Math.abs(s - 30) < TOLERANCE)).toBe(true)
    expect(solutions.some(s => Math.abs(s - 150) < TOLERANCE)).toBe(true)
  })

  it('should find all arccos solutions in [0, 360)', () => {
    const solutions = findAllSolutions('arccos', 0.5)
    expect(solutions.length).toBe(2)
    expect(solutions.some(s => Math.abs(s - 60) < TOLERANCE)).toBe(true)
    expect(solutions.some(s => Math.abs(s - 300) < TOLERANCE)).toBe(true)
  })

  it('should find all arctan solutions in [0, 360)', () => {
    const solutions = findAllSolutions('arctan', 1)
    expect(solutions.length).toBe(2)
    expect(solutions.some(s => Math.abs(s - 45) < TOLERANCE)).toBe(true)
    expect(solutions.some(s => Math.abs(s - 225) < TOLERANCE)).toBe(true)
  })

  it('should find solutions in custom range', () => {
    const solutions = findAllSolutions('arctan', 1, [-180, 180])
    expect(solutions.length).toBe(2)
    expect(solutions.some(s => Math.abs(s - 45) < TOLERANCE)).toBe(true)
    expect(solutions.some(s => Math.abs(s - (-135)) < TOLERANCE)).toBe(true)
  })

  it('should return empty array for invalid input', () => {
    const solutions = findAllSolutions('arcsin', 2)
    expect(solutions).toEqual([])
  })
})

// ============= getInverseFunctionInfo Tests =============

describe('getInverseFunctionInfo', () => {
  it('should return info for arcsin', () => {
    const info = getInverseFunctionInfo('arcsin')
    expect(info).toBeDefined()
    expect(info?.name).toBe('Arcsine')
    expect(info?.domain).toEqual(ARCSIN_DOMAIN)
    expect(info?.range).toEqual(ARCSIN_RANGE)
  })

  it('should return info for all functions', () => {
    for (const fn of INVERSE_FUNCTIONS) {
      const info = getInverseFunctionInfo(fn.id)
      expect(info).toBeDefined()
      expect(info?.id).toBe(fn.id)
    }
  })
})

// ============= formatAngleResult Tests =============

describe('formatAngleResult', () => {
  it('should format with exact value when available', () => {
    const formatted = formatAngleResult(30, '\\frac{\\pi}{6}')
    expect(formatted).toContain('30')
    expect(formatted).toContain('\\frac{\\pi}{6}')
  })

  it('should format with approximate radian value when no exact value', () => {
    const formatted = formatAngleResult(33, null)
    expect(formatted).toContain('33')
    expect(formatted).toContain('≈')
  })
})

// ============= Preset Tests =============

describe('Presets', () => {
  it('should have presets for all function types', () => {
    const functionIds = new Set(INVERSE_TRIG_PRESETS.map(p => p.fn))
    expect(functionIds.has('arcsin')).toBe(true)
    expect(functionIds.has('arccos')).toBe(true)
    expect(functionIds.has('arctan')).toBe(true)
    expect(functionIds.has('atan2')).toBe(true)
  })

  it('should have atan2 presets for all quadrants', () => {
    const atan2Presets = INVERSE_TRIG_PRESETS.filter(p => p.fn === 'atan2')
    expect(atan2Presets.length).toBeGreaterThanOrEqual(4)
  })

  it('should get preset by id', () => {
    const preset = getInverseTrigPreset('arcsin-half')
    expect(preset).toBeDefined()
    expect(preset?.fn).toBe('arcsin')
    expect(preset?.value).toBe(0.5)
  })

  it('should return undefined for invalid preset id', () => {
    const preset = getInverseTrigPreset('invalid-preset')
    expect(preset).toBeUndefined()
  })

  it('all presets should produce valid results', () => {
    for (const preset of INVERSE_TRIG_PRESETS) {
      const result = evaluateInverse(preset.fn, preset.value, preset.y)
      expect(result.isValid).toBe(true)
    }
  })
})

// ============= Edge Cases =============

describe('Edge Cases', () => {
  it('should handle boundary values for arcsin', () => {
    expect(arcsin(1).isValid).toBe(true)
    expect(arcsin(-1).isValid).toBe(true)
    expect(arcsin(1.0000001).isValid).toBe(false)
  })

  it('should handle boundary values for arccos', () => {
    expect(arccos(1).isValid).toBe(true)
    expect(arccos(-1).isValid).toBe(true)
    expect(arccos(-1.0000001).isValid).toBe(false)
  })

  it('should handle negative zero', () => {
    const result = arctan(-0)
    expect(result.isValid).toBe(true)
    expect(result.valueDegrees).toBeCloseTo(0, 6)
  })

  it('should handle special atan2 cases on axes', () => {
    // Positive x-axis
    expect(atan2(0, 1).valueDegrees).toBeCloseTo(0, 6)
    // Positive y-axis
    expect(atan2(1, 0).valueDegrees).toBeCloseTo(90, 6)
    // Negative x-axis
    expect(Math.abs(atan2(0, -1).valueDegrees)).toBeCloseTo(180, 6)
    // Negative y-axis
    expect(atan2(-1, 0).valueDegrees).toBeCloseTo(-90, 6)
  })
})

// ============= Consistency Tests =============

describe('Consistency', () => {
  it('arcsin and arccos should be complementary', () => {
    // arcsin(x) + arccos(x) = 90° for all x in [-1, 1]
    const testValues = [-1, -0.5, 0, 0.5, 1]
    for (const x of testValues) {
      const sinResult = arcsin(x)
      const cosResult = arccos(x)
      expect(sinResult.valueDegrees + cosResult.valueDegrees).toBeCloseTo(90, 6)
    }
  })

  it('atan2 should be consistent with arctan for positive x', () => {
    const testPairs: [number, number][] = [
      [1, 1],
      [2, 1],
      [1, 2],
      [0.5, 1],
    ]
    for (const [y, x] of testPairs) {
      const atan2Result = atan2(y, x)
      const atanResult = arctan(y / x)
      expect(atan2Result.valueDegrees).toBeCloseTo(atanResult.valueDegrees, 6)
    }
  })

  it('all inverse functions should have correct range metadata', () => {
    // arcsin result should be in [-90, 90]
    const asinResult = arcsin(0.5)
    expect(asinResult.valueDegrees).toBeGreaterThanOrEqual(-90)
    expect(asinResult.valueDegrees).toBeLessThanOrEqual(90)

    // arccos result should be in [0, 180]
    const acosResult = arccos(0.5)
    expect(acosResult.valueDegrees).toBeGreaterThanOrEqual(0)
    expect(acosResult.valueDegrees).toBeLessThanOrEqual(180)

    // arctan result should be in (-90, 90)
    const atanResult = arctan(1)
    expect(atanResult.valueDegrees).toBeGreaterThan(-90)
    expect(atanResult.valueDegrees).toBeLessThan(90)
  })
})
