import { describe, it, expect } from 'vitest'
import {
  evaluateLimit,
  evaluateLeftLimit,
  evaluateRightLimit,
  checkContinuity,
  numericalLimitApproximation,
  findDeltaForEpsilon,
  isValidApproachPoint,
  getLimitPreset,
  LIMIT_PRESETS,
  LIMIT_TOLERANCE,
  DEFAULT_EPSILON,
  DEFAULT_DELTA,
} from './limits'

// ============================================================================
// Constants Tests
// ============================================================================

describe('Limits Constants', () => {
  it('should export LIMIT_TOLERANCE as a small positive number', () => {
    expect(LIMIT_TOLERANCE).toBe(1e-8)
    expect(LIMIT_TOLERANCE).toBeGreaterThan(0)
  })

  it('should export DEFAULT_EPSILON', () => {
    expect(DEFAULT_EPSILON).toBe(0.5)
  })

  it('should export DEFAULT_DELTA', () => {
    expect(DEFAULT_DELTA).toBe(0.3)
  })
})

// ============================================================================
// Preset Functions Tests
// ============================================================================

describe('LIMIT_PRESETS', () => {
  it('should contain 8 preset functions', () => {
    expect(LIMIT_PRESETS).toHaveLength(8)
  })

  it('should have all required properties for each preset', () => {
    LIMIT_PRESETS.forEach((preset) => {
      expect(preset.id).toBeDefined()
      expect(preset.name).toBeDefined()
      expect(preset.description).toBeDefined()
      expect(preset.fn).toBeInstanceOf(Function)
      expect(preset.domain).toBeDefined()
      expect(preset.domain.min).toBeLessThan(preset.domain.max)
      expect(preset.interestingPoints).toBeDefined()
      expect(preset.latex).toBeDefined()
      expect(preset.expectedBehavior).toBeDefined()
    })
  })

  it('should have unique IDs', () => {
    const ids = LIMIT_PRESETS.map((p) => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})

describe('getLimitPreset', () => {
  it('should return preset by ID', () => {
    const preset = getLimitPreset('polynomial')
    expect(preset).toBeDefined()
    expect(preset?.name).toBe('Polynomial')
  })

  it('should return undefined for unknown ID', () => {
    const preset = getLimitPreset('nonexistent')
    expect(preset).toBeUndefined()
  })
})

// ============================================================================
// Polynomial (Continuous) Tests
// ============================================================================

describe('Polynomial f(x) = x²', () => {
  const fn = (x: number) => x * x

  it('should evaluate limit at x=2', () => {
    const result = evaluateLimit(fn, 2)
    expect(result.exists).toBe(true)
    expect(result.value).toBeCloseTo(4, 6)
  })

  it('should evaluate limit at x=0', () => {
    const result = evaluateLimit(fn, 0)
    expect(result.exists).toBe(true)
    expect(result.value).toBeCloseTo(0, 6)
  })

  it('should evaluate limit at x=-1', () => {
    const result = evaluateLimit(fn, -1)
    expect(result.exists).toBe(true)
    expect(result.value).toBeCloseTo(1, 6)
  })

  it('should have equal left and right limits', () => {
    const result = evaluateLimit(fn, 2)
    expect(result.leftLimit).toBeCloseTo(4, 6)
    expect(result.rightLimit).toBeCloseTo(4, 6)
  })

  it('should classify as finite limit', () => {
    const result = evaluateLimit(fn, 2)
    expect(result.limitType).toBe('finite')
  })

  it('should be continuous everywhere', () => {
    const result = checkContinuity(fn, 2)
    expect(result.isContinuous).toBe(true)
    expect(result.discontinuityType).toBe('none')
  })
})

// ============================================================================
// Rational (Removable Discontinuity) Tests
// ============================================================================

describe('Rational f(x) = (x²-1)/(x-1)', () => {
  const fn = (x: number) => {
    if (Math.abs(x - 1) < 1e-15) return NaN
    return (x * x - 1) / (x - 1)
  }

  it('should have limit 2 at x=1', () => {
    const result = evaluateLimit(fn, 1)
    expect(result.exists).toBe(true)
    expect(result.value).toBeCloseTo(2, 4)
  })

  it('should have removable discontinuity at x=1', () => {
    const result = checkContinuity(fn, 1)
    expect(result.isContinuous).toBe(false)
    expect(result.discontinuityType).toBe('removable')
  })

  it('should be continuous at other points', () => {
    const result = checkContinuity(fn, 2)
    expect(result.isContinuous).toBe(true)
  })

  it('should evaluate to x+1 away from x=1', () => {
    expect(fn(3)).toBeCloseTo(4, 10)
    expect(fn(0)).toBeCloseTo(1, 10)
  })
})

// ============================================================================
// Step Function (Jump Discontinuity) Tests
// ============================================================================

describe('Floor function f(x) = ⌊x⌋', () => {
  const fn = Math.floor

  it('should have left limit n-1 at integer n', () => {
    const left = evaluateLeftLimit(fn, 2)
    expect(left).toBeCloseTo(1, 4)
  })

  it('should have right limit n at integer n', () => {
    const right = evaluateRightLimit(fn, 2)
    expect(right).toBeCloseTo(2, 4)
  })

  it('should have jump discontinuity at integers', () => {
    const result = checkContinuity(fn, 2)
    expect(result.isContinuous).toBe(false)
    expect(result.discontinuityType).toBe('jump')
  })

  it('should be continuous between integers', () => {
    const result = checkContinuity(fn, 2.5)
    expect(result.isContinuous).toBe(true)
  })

  it('limit should not exist at integers (left ≠ right)', () => {
    const result = evaluateLimit(fn, 3)
    expect(result.exists).toBe(false)
  })
})

// ============================================================================
// Reciprocal (Infinite Discontinuity) Tests
// ============================================================================

describe('Reciprocal f(x) = 1/x', () => {
  const fn = (x: number) => 1 / x

  it('should have infinite limit at x=0', () => {
    const result = evaluateLimit(fn, 0)
    expect(result.limitType).toBe('infinite')
    expect(result.exists).toBe(false)
  })

  it('should have left limit -∞ at x=0', () => {
    const left = evaluateLeftLimit(fn, 0)
    expect(left).toBe(-Infinity)
  })

  it('should have right limit +∞ at x=0', () => {
    const right = evaluateRightLimit(fn, 0)
    expect(right).toBe(Infinity)
  })

  it('should have infinite discontinuity at x=0', () => {
    const result = checkContinuity(fn, 0)
    expect(result.isContinuous).toBe(false)
    expect(result.discontinuityType).toBe('infinite')
  })

  it('should be continuous at non-zero points', () => {
    const result = checkContinuity(fn, 2)
    expect(result.isContinuous).toBe(true)
  })
})

// ============================================================================
// Sin(x)/x (Famous Limit) Tests
// ============================================================================

describe('Famous limit f(x) = sin(x)/x', () => {
  const fn = (x: number) => {
    if (Math.abs(x) < 1e-15) return NaN
    return Math.sin(x) / x
  }

  it('should have limit 1 at x=0', () => {
    const result = evaluateLimit(fn, 0)
    expect(result.exists).toBe(true)
    expect(result.value).toBeCloseTo(1, 4)
  })

  it('should have removable discontinuity at x=0', () => {
    const result = checkContinuity(fn, 0)
    expect(result.isContinuous).toBe(false)
    expect(result.discontinuityType).toBe('removable')
  })

  it('should be continuous elsewhere', () => {
    const result = checkContinuity(fn, Math.PI)
    expect(result.isContinuous).toBe(true)
  })
})

// ============================================================================
// Sign Function (Jump at Origin) Tests
// ============================================================================

describe('Sign function f(x) = |x|/x', () => {
  const fn = (x: number) => {
    if (Math.abs(x) < 1e-15) return NaN
    return Math.abs(x) / x
  }

  it('should have left limit -1 at x=0', () => {
    const left = evaluateLeftLimit(fn, 0)
    expect(left).toBeCloseTo(-1, 4)
  })

  it('should have right limit +1 at x=0', () => {
    const right = evaluateRightLimit(fn, 0)
    expect(right).toBeCloseTo(1, 4)
  })

  it('should have jump discontinuity at x=0', () => {
    const result = checkContinuity(fn, 0)
    expect(result.isContinuous).toBe(false)
    expect(result.discontinuityType).toBe('jump')
  })

  it('limit should not exist at x=0', () => {
    const result = evaluateLimit(fn, 0)
    expect(result.exists).toBe(false)
    expect(result.limitType).toBe('does-not-exist')
  })
})

// ============================================================================
// Oscillating Function Tests
// ============================================================================

describe('Oscillating f(x) = sin(1/x)', () => {
  const fn = (x: number) => {
    if (Math.abs(x) < 1e-15) return NaN
    return Math.sin(1 / x)
  }

  it('should not have a limit at x=0', () => {
    const result = evaluateLimit(fn, 0)
    expect(result.exists).toBe(false)
  })

  it('should have oscillating discontinuity at x=0', () => {
    const result = checkContinuity(fn, 0)
    expect(result.isContinuous).toBe(false)
    expect(result.discontinuityType).toBe('oscillating')
  })

  it('should be continuous away from x=0', () => {
    const result = checkContinuity(fn, 1)
    expect(result.isContinuous).toBe(true)
  })
})

// ============================================================================
// Piecewise Function Tests
// ============================================================================

describe('Piecewise function', () => {
  const fn = (x: number) => {
    if (x < 0) return x + 1
    if (x > 0) return x * x
    return NaN
  }

  it('should have left limit 1 at x=0', () => {
    const left = evaluateLeftLimit(fn, 0)
    expect(left).toBeCloseTo(1, 4)
  })

  it('should have right limit 0 at x=0', () => {
    const right = evaluateRightLimit(fn, 0)
    expect(right).toBeCloseTo(0, 4)
  })

  it('should have jump discontinuity at x=0', () => {
    const result = checkContinuity(fn, 0)
    expect(result.isContinuous).toBe(false)
    expect(result.discontinuityType).toBe('jump')
  })
})

// ============================================================================
// Numerical Approximation Tests
// ============================================================================

describe('numericalLimitApproximation', () => {
  const fn = (x: number) => x * x

  it('should return correct number of steps', () => {
    const result = numericalLimitApproximation(fn, 2, 'left', 5)
    expect(result).toHaveLength(5)
  })

  it('should approach from left with decreasing x values', () => {
    const result = numericalLimitApproximation(fn, 2, 'left')
    expect(result[0]?.x).toBeLessThan(2)
    expect(result[1]?.x).toBeGreaterThan(result[0]?.x ?? 0) // Getting closer to 2
  })

  it('should approach from right with decreasing x values', () => {
    const result = numericalLimitApproximation(fn, 2, 'right')
    expect(result[0]?.x).toBeGreaterThan(2)
    expect(result[1]?.x).toBeLessThan(result[0]?.x ?? Infinity) // Getting closer to 2
  })

  it('should have decreasing distances', () => {
    const result = numericalLimitApproximation(fn, 2, 'left')
    for (let i = 1; i < result.length; i++) {
      expect(result[i]?.distance).toBeLessThan(result[i - 1]?.distance ?? Infinity)
    }
  })

  it('should compute correct function values', () => {
    const result = numericalLimitApproximation(fn, 2, 'left')
    result.forEach((step) => {
      expect(step.fx).toBeCloseTo(step.x * step.x, 10)
    })
  })
})

// ============================================================================
// Epsilon-Delta Tests
// ============================================================================

describe('findDeltaForEpsilon', () => {
  const fn = (x: number) => x * x

  it('should find delta for continuous function', () => {
    const delta = findDeltaForEpsilon(fn, 2, 4, 0.5)
    expect(delta).not.toBeNull()
    expect(delta).toBeGreaterThan(0)
  })

  it('should find smaller delta for smaller epsilon', () => {
    const delta1 = findDeltaForEpsilon(fn, 2, 4, 1.0)
    const delta2 = findDeltaForEpsilon(fn, 2, 4, 0.1)
    expect(delta1).toBeGreaterThan(delta2!)
  })

  it('should return null for infinite limit', () => {
    const delta = findDeltaForEpsilon((x) => 1 / x, 0, Infinity, 0.5)
    expect(delta).toBeNull()
  })

  it('should verify epsilon-delta relationship', () => {
    const a = 2
    const L = 4
    const epsilon = 0.5
    const delta = findDeltaForEpsilon(fn, a, L, epsilon)

    expect(delta).not.toBeNull()

    // Test multiple points within delta
    const testPoints = [a - delta! / 2, a + delta! / 2]
    testPoints.forEach((x) => {
      // All test points should satisfy the epsilon-delta condition
      expect(Math.abs(x - a) < delta! && x !== a).toBe(true)
      expect(Math.abs(fn(x) - L)).toBeLessThan(epsilon)
    })
  })
})

// ============================================================================
// Validation Tests
// ============================================================================

describe('isValidApproachPoint', () => {
  it('should return true for continuous function', () => {
    const fn = (x: number) => x * x
    expect(isValidApproachPoint(fn, 2)).toBe(true)
  })

  it('should return true for function with limit', () => {
    const fn = (x: number) => {
      if (Math.abs(x - 1) < 1e-15) return NaN
      return (x * x - 1) / (x - 1)
    }
    expect(isValidApproachPoint(fn, 1)).toBe(true)
  })

  it('should return true for asymptote (infinite values)', () => {
    const fn = (x: number) => 1 / x
    expect(isValidApproachPoint(fn, 0)).toBe(true)
  })
})

// ============================================================================
// One-Sided Limit Tests
// ============================================================================

describe('One-sided limits', () => {
  it('should evaluate left-only limit', () => {
    const fn = Math.floor
    const result = evaluateLimit(fn, 2, 'left')
    expect(result.leftLimit).toBeCloseTo(1, 4)
    expect(result.rightLimit).toBeNull()
  })

  it('should evaluate right-only limit', () => {
    const fn = Math.floor
    const result = evaluateLimit(fn, 2, 'right')
    expect(result.rightLimit).toBeCloseTo(2, 4)
    expect(result.leftLimit).toBeNull()
  })
})

// ============================================================================
// Edge Cases
// ============================================================================

describe('Edge cases', () => {
  it('should handle very small approach distances', () => {
    const fn = (x: number) => x * x
    const result = evaluateLimit(fn, 0)
    expect(result.value).toBeCloseTo(0, 8)
  })

  it('should handle negative approach points', () => {
    const fn = (x: number) => x * x
    const result = evaluateLimit(fn, -3)
    expect(result.value).toBeCloseTo(9, 6)
  })

  it('should handle large approach points', () => {
    const fn = (x: number) => 1 / x
    const result = evaluateLimit(fn, 100)
    expect(result.value).toBeCloseTo(0.01, 6)
  })
})
