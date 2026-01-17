/**
 * Tests for derivative utilities
 */

import { describe, it, expect } from 'vitest'
import {
  centralDifference,
  forwardDifference,
  backwardDifference,
  numericalDerivative,
  evaluateDerivative,
  calculateTangentLine,
  calculateSecantLine,
  generateSecantSequence,
  getLineEndpoints,
  findCriticalPoints,
  classifyCriticalPoint,
  analyzeCriticalPoints,
  derivativeExists,
  DERIVATIVE_PRESETS,
  getDerivativePreset,
  getDerivativePresetIds,
  DEFAULT_H,
  SECANT_H_VALUES,
  DEFAULT_PRESET,
  DEFAULT_POINT,
} from './derivative'

// ============================================================================
// Central Difference Tests
// ============================================================================

describe('centralDifference', () => {
  it('computes derivative of constant function as zero', () => {
    const f = () => 5
    expect(centralDifference(f, 0)).toBeCloseTo(0, 5)
    expect(centralDifference(f, 10)).toBeCloseTo(0, 5)
  })

  it('computes derivative of linear function as the slope', () => {
    const f = (x: number) => 3 * x + 2
    expect(centralDifference(f, 0)).toBeCloseTo(3, 6)
    expect(centralDifference(f, 5)).toBeCloseTo(3, 6)
    expect(centralDifference(f, -3)).toBeCloseTo(3, 6)
  })

  it('computes derivative of x² as 2x', () => {
    const f = (x: number) => x * x
    expect(centralDifference(f, 0)).toBeCloseTo(0, 6)
    expect(centralDifference(f, 1)).toBeCloseTo(2, 6)
    expect(centralDifference(f, 2)).toBeCloseTo(4, 6)
    expect(centralDifference(f, -3)).toBeCloseTo(-6, 6)
  })

  it('computes derivative of x³ as 3x²', () => {
    const f = (x: number) => x * x * x
    expect(centralDifference(f, 1)).toBeCloseTo(3, 5)
    expect(centralDifference(f, 2)).toBeCloseTo(12, 5)
    expect(centralDifference(f, -1)).toBeCloseTo(3, 5)
  })

  it('computes derivative of sin(x) as cos(x)', () => {
    const f = Math.sin
    expect(centralDifference(f, 0)).toBeCloseTo(Math.cos(0), 5)
    expect(centralDifference(f, Math.PI / 2)).toBeCloseTo(Math.cos(Math.PI / 2), 5)
    expect(centralDifference(f, Math.PI)).toBeCloseTo(Math.cos(Math.PI), 5)
  })

  it('computes derivative of cos(x) as -sin(x)', () => {
    const f = Math.cos
    expect(centralDifference(f, 0)).toBeCloseTo(-Math.sin(0), 5)
    expect(centralDifference(f, Math.PI / 2)).toBeCloseTo(-Math.sin(Math.PI / 2), 5)
  })

  it('computes derivative of e^x as e^x', () => {
    const f = Math.exp
    expect(centralDifference(f, 0)).toBeCloseTo(Math.exp(0), 5)
    expect(centralDifference(f, 1)).toBeCloseTo(Math.exp(1), 5)
    expect(centralDifference(f, -1)).toBeCloseTo(Math.exp(-1), 5)
  })

  it('computes derivative of ln(x) as 1/x', () => {
    const f = Math.log
    expect(centralDifference(f, 1)).toBeCloseTo(1, 5)
    expect(centralDifference(f, 2)).toBeCloseTo(0.5, 5)
    expect(centralDifference(f, 0.5)).toBeCloseTo(2, 5)
  })

  it('handles functions with non-finite values near the point', () => {
    // 1/x at x=0 evaluates to ±Infinity, central difference will return a large value
    const f = (x: number) => 1 / x
    const result = centralDifference(f, 0)
    // The result will be very large but not NaN (since 1/0.0001 and 1/-0.0001 are finite)
    expect(Math.abs(result)).toBeGreaterThan(1e6)
  })

  it('uses custom h value', () => {
    const f = (x: number) => x * x
    // With larger h, less accurate
    const largeH = centralDifference(f, 1, 0.1)
    const smallH = centralDifference(f, 1, 0.0001)
    // Both should be close to 2, but smallH should be more accurate
    expect(largeH).toBeCloseTo(2, 1)
    expect(smallH).toBeCloseTo(2, 6)
  })
})

// ============================================================================
// Forward Difference Tests
// ============================================================================

describe('forwardDifference', () => {
  it('computes derivative of linear function', () => {
    const f = (x: number) => 2 * x + 1
    expect(forwardDifference(f, 0)).toBeCloseTo(2, 5)
  })

  it('computes derivative of x²', () => {
    const f = (x: number) => x * x
    // Forward difference is less accurate than central difference
    expect(forwardDifference(f, 1)).toBeCloseTo(2, 3)
    expect(forwardDifference(f, 2)).toBeCloseTo(4, 3)
  })

  it('is less accurate than central difference', () => {
    const f = (x: number) => x * x * x
    const forward = forwardDifference(f, 1, 0.01)
    const central = centralDifference(f, 1, 0.01)
    // Exact derivative at x=1 is 3
    const forwardError = Math.abs(forward - 3)
    const centralError = Math.abs(central - 3)
    expect(centralError).toBeLessThan(forwardError)
  })

  it('returns NaN for non-finite values', () => {
    const f = () => Infinity
    expect(forwardDifference(f, 0)).toBeNaN()
  })
})

// ============================================================================
// Backward Difference Tests
// ============================================================================

describe('backwardDifference', () => {
  it('computes derivative of linear function', () => {
    const f = (x: number) => 2 * x + 1
    expect(backwardDifference(f, 0)).toBeCloseTo(2, 5)
  })

  it('computes derivative of x²', () => {
    const f = (x: number) => x * x
    // Backward difference is less accurate than central difference
    expect(backwardDifference(f, 1)).toBeCloseTo(2, 3)
  })

  it('returns NaN for non-finite values', () => {
    const f = () => NaN
    expect(backwardDifference(f, 0)).toBeNaN()
  })
})

// ============================================================================
// numericalDerivative Alias Tests
// ============================================================================

describe('numericalDerivative', () => {
  it('is an alias for centralDifference', () => {
    const f = (x: number) => x * x
    expect(numericalDerivative(f, 2)).toBe(centralDifference(f, 2))
  })
})

// ============================================================================
// evaluateDerivative Tests
// ============================================================================

describe('evaluateDerivative', () => {
  it('returns numerical derivative without exact function', () => {
    const f = (x: number) => x * x
    const result = evaluateDerivative(f, 2)

    expect(result.value).toBeCloseTo(4, 5)
    expect(result.method).toBe('numerical')
    expect(result.exists).toBe(true)
    expect(result.exactValue).toBeUndefined()
  })

  it('returns both numerical and exact values when exact derivative provided', () => {
    const f = (x: number) => x * x
    const fPrime = (x: number) => 2 * x
    const result = evaluateDerivative(f, 2, fPrime)

    expect(result.value).toBeCloseTo(4, 5)
    expect(result.exactValue).toBe(4)
    expect(result.method).toBe('exact')
    expect(result.exists).toBe(true)
  })

  it('reports non-existence when derivative is NaN', () => {
    const f = (x: number) => Math.sqrt(x)
    const result = evaluateDerivative(f, -1)

    expect(result.exists).toBe(false)
    expect(result.value).toBeNaN()
  })
})

// ============================================================================
// Tangent Line Tests
// ============================================================================

describe('calculateTangentLine', () => {
  it('calculates tangent line for x² at x=1', () => {
    const f = (x: number) => x * x
    const tangent = calculateTangentLine(f, 1)

    expect(tangent.slope).toBeCloseTo(2, 5)
    expect(tangent.point.x).toBe(1)
    expect(tangent.point.y).toBe(1)
    // y = 2x + b, at (1,1): 1 = 2*1 + b, so b = -1
    expect(tangent.yIntercept).toBeCloseTo(-1, 5)
  })

  it('calculates tangent line for sin(x) at x=0', () => {
    const f = Math.sin
    const tangent = calculateTangentLine(f, 0)

    expect(tangent.slope).toBeCloseTo(1, 5) // cos(0) = 1
    expect(tangent.point.x).toBe(0)
    expect(tangent.point.y).toBeCloseTo(0, 10)
    expect(tangent.yIntercept).toBeCloseTo(0, 5)
  })

  it('uses provided derivative value', () => {
    const f = (x: number) => x * x
    const tangent = calculateTangentLine(f, 1, 2)

    expect(tangent.slope).toBe(2)
  })

  it('calculates horizontal tangent at vertex of parabola', () => {
    const f = (x: number) => x * x
    const tangent = calculateTangentLine(f, 0)

    expect(tangent.slope).toBeCloseTo(0, 6)
    expect(tangent.yIntercept).toBeCloseTo(0, 6)
  })
})

// ============================================================================
// Secant Line Tests
// ============================================================================

describe('calculateSecantLine', () => {
  it('calculates secant line for x² from x=1 to x=2', () => {
    const f = (x: number) => x * x
    const secant = calculateSecantLine(f, 1, 1)

    expect(secant.h).toBe(1)
    expect(secant.point1).toEqual({ x: 1, y: 1 })
    expect(secant.point2).toEqual({ x: 2, y: 4 })
    expect(secant.slope).toBe(3) // (4-1)/(2-1) = 3
  })

  it('approaches tangent slope as h decreases', () => {
    const f = (x: number) => x * x
    const secant1 = calculateSecantLine(f, 1, 1)
    const secant2 = calculateSecantLine(f, 1, 0.1)
    const secant3 = calculateSecantLine(f, 1, 0.001)

    // Tangent slope at x=1 is 2
    expect(Math.abs(secant1.slope - 2)).toBeGreaterThan(Math.abs(secant2.slope - 2))
    expect(Math.abs(secant2.slope - 2)).toBeGreaterThan(Math.abs(secant3.slope - 2))
    expect(secant3.slope).toBeCloseTo(2, 2)
  })

  it('handles negative h values', () => {
    const f = (x: number) => x * x
    const secant = calculateSecantLine(f, 2, -1)

    expect(secant.point1).toEqual({ x: 2, y: 4 })
    expect(secant.point2).toEqual({ x: 1, y: 1 })
    expect(secant.slope).toBe(3) // (1-4)/(1-2) = 3
  })
})

// ============================================================================
// Secant Sequence Tests
// ============================================================================

describe('generateSecantSequence', () => {
  it('generates sequence with default h values', () => {
    const f = (x: number) => x * x
    const sequence = generateSecantSequence(f, 1)

    expect(sequence.length).toBe(SECANT_H_VALUES.length)
    expect(sequence[0]!.h).toBe(SECANT_H_VALUES[0])
    expect(sequence[sequence.length - 1]!.h).toBe(SECANT_H_VALUES[SECANT_H_VALUES.length - 1])
  })

  it('generates sequence with custom h values', () => {
    const f = (x: number) => x * x
    const customH = [0.5, 0.1]
    const sequence = generateSecantSequence(f, 1, customH)

    expect(sequence.length).toBe(2)
    expect(sequence[0]!.h).toBe(0.5)
    expect(sequence[1]!.h).toBe(0.1)
  })

  it('shows convergence to tangent slope', () => {
    const f = (x: number) => x * x
    const sequence = generateSecantSequence(f, 1)
    const targetSlope = 2 // Derivative of x² at x=1

    // Each successive secant should be closer to tangent
    let prevError = Infinity
    for (const secant of sequence) {
      const error = Math.abs(secant.slope - targetSlope)
      expect(error).toBeLessThanOrEqual(prevError)
      prevError = error
    }
  })
})

// ============================================================================
// Line Endpoints Tests
// ============================================================================

describe('getLineEndpoints', () => {
  it('calculates endpoints for y = 2x + 1', () => {
    const endpoints = getLineEndpoints(2, 1, { min: -2, max: 2 })

    expect(endpoints.x1).toBe(-2)
    expect(endpoints.y1).toBe(-3) // 2*(-2) + 1
    expect(endpoints.x2).toBe(2)
    expect(endpoints.y2).toBe(5) // 2*2 + 1
  })

  it('calculates endpoints for horizontal line', () => {
    const endpoints = getLineEndpoints(0, 3, { min: 0, max: 10 })

    expect(endpoints.y1).toBe(3)
    expect(endpoints.y2).toBe(3)
  })
})

// ============================================================================
// Critical Points Tests
// ============================================================================

describe('findCriticalPoints', () => {
  it('finds critical point of x² at x=0', () => {
    const f = (x: number) => x * x
    const fPrime = (x: number) => 2 * x
    const points = findCriticalPoints(f, fPrime, { min: -2, max: 2 })

    expect(points.length).toBe(1)
    expect(points[0]).toBeCloseTo(0, 4)
  })

  it('finds critical points of x³ - 3x', () => {
    const f = (x: number) => x * x * x - 3 * x
    const fPrime = (x: number) => 3 * x * x - 3
    const points = findCriticalPoints(f, fPrime, { min: -3, max: 3 })

    expect(points.length).toBe(2)
    // Critical points at x = ±1
    const sortedPoints = points.sort((a, b) => a - b)
    expect(sortedPoints[0]).toBeCloseTo(-1, 3)
    expect(sortedPoints[1]).toBeCloseTo(1, 3)
  })

  it('returns empty array when no critical points exist', () => {
    const f = (x: number) => 2 * x + 1
    const fPrime = () => 2
    const points = findCriticalPoints(f, fPrime, { min: -5, max: 5 })

    expect(points.length).toBe(0)
  })
})

// ============================================================================
// Classify Critical Point Tests
// ============================================================================

describe('classifyCriticalPoint', () => {
  it('classifies minimum of x² at x=0', () => {
    const f = (x: number) => x * x
    const fPrime = (x: number) => 2 * x
    const type = classifyCriticalPoint(f, fPrime, 0)

    expect(type).toBe('local-min')
  })

  it('classifies maximum of -x² at x=0', () => {
    const f = (x: number) => -x * x
    const fPrime = (x: number) => -2 * x
    const type = classifyCriticalPoint(f, fPrime, 0)

    expect(type).toBe('local-max')
  })

  it('classifies inflection point of x³ at x=0', () => {
    const f = (x: number) => x * x * x
    const fPrime = (x: number) => 3 * x * x
    const type = classifyCriticalPoint(f, fPrime, 0)

    expect(type).toBe('inflection')
  })

  it('classifies local max and min of x³ - 3x', () => {
    const f = (x: number) => x * x * x - 3 * x
    const fPrime = (x: number) => 3 * x * x - 3

    expect(classifyCriticalPoint(f, fPrime, -1)).toBe('local-max')
    expect(classifyCriticalPoint(f, fPrime, 1)).toBe('local-min')
  })
})

// ============================================================================
// Analyze Critical Points Tests
// ============================================================================

describe('analyzeCriticalPoints', () => {
  it('returns full analysis for x² parabola', () => {
    const f = (x: number) => x * x
    const fPrime = (x: number) => 2 * x
    const analysis = analyzeCriticalPoints(f, fPrime, { min: -2, max: 2 })

    expect(analysis.length).toBe(1)
    expect(analysis[0]!.x).toBeCloseTo(0, 4)
    expect(analysis[0]!.y).toBeCloseTo(0, 4)
    expect(analysis[0]!.type).toBe('local-min')
  })

  it('analyzes polynomial with multiple critical points', () => {
    const f = (x: number) => x * x * x - 3 * x
    const fPrime = (x: number) => 3 * x * x - 3
    const analysis = analyzeCriticalPoints(f, fPrime, { min: -2, max: 2 })

    expect(analysis.length).toBe(2)
    const sorted = analysis.sort((a, b) => a.x - b.x)
    expect(sorted[0]!.type).toBe('local-max')
    expect(sorted[1]!.type).toBe('local-min')
  })
})

// ============================================================================
// Derivative Existence Tests
// ============================================================================

describe('derivativeExists', () => {
  it('returns true for smooth functions', () => {
    const f = (x: number) => x * x
    expect(derivativeExists(f, 0)).toBe(true)
    expect(derivativeExists(f, 1)).toBe(true)
  })

  it('returns true for exponential', () => {
    expect(derivativeExists(Math.exp, 0)).toBe(true)
  })

  it('returns false for absolute value at x=0', () => {
    const f = Math.abs
    // At x=0, left derivative is -1, right derivative is +1
    expect(derivativeExists(f, 0)).toBe(false)
  })

  it('returns false at discontinuities', () => {
    const f = (x: number) => 1 / x
    expect(derivativeExists(f, 0)).toBe(false)
  })
})

// ============================================================================
// Preset Tests
// ============================================================================

describe('DERIVATIVE_PRESETS', () => {
  it('has 8 presets', () => {
    expect(DERIVATIVE_PRESETS.length).toBe(8)
  })

  it('each preset has required fields', () => {
    for (const preset of DERIVATIVE_PRESETS) {
      expect(preset.id).toBeTruthy()
      expect(preset.name).toBeTruthy()
      expect(preset.description).toBeTruthy()
      expect(typeof preset.fn).toBe('function')
      expect(typeof preset.derivative).toBe('function')
      expect(preset.latex).toBeTruthy()
      expect(preset.derivativeLatex).toBeTruthy()
      expect(preset.domain.min).toBeLessThan(preset.domain.max)
      expect(Array.isArray(preset.interestingPoints)).toBe(true)
    }
  })

  it('has unique IDs', () => {
    const ids = DERIVATIVE_PRESETS.map((p) => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('exact derivatives match numerical derivatives', () => {
    for (const preset of DERIVATIVE_PRESETS) {
      // Test at a few points in the domain
      const testPoints = [
        preset.domain.min + 0.5,
        (preset.domain.min + preset.domain.max) / 2,
        preset.domain.max - 0.5,
      ]

      // Filter to valid test points first (avoid conditional expects)
      const validTestPoints = testPoints.filter((x) => {
        const y = preset.fn(x)
        if (!isFinite(y)) return false
        const numerical = centralDifference(preset.fn, x)
        const exact = preset.derivative(x)
        return isFinite(numerical) && isFinite(exact)
      })

      // Run expects unconditionally on filtered points
      for (const x of validTestPoints) {
        const numerical = centralDifference(preset.fn, x)
        const exact = preset.derivative(x)
        expect(numerical).toBeCloseTo(exact, 3)
      }
    }
  })
})

describe('getDerivativePreset', () => {
  it('returns preset by ID', () => {
    const preset = getDerivativePreset('quadratic')
    expect(preset).toBeDefined()
    expect(preset!.name).toBe('Quadratic')
  })

  it('returns undefined for unknown ID', () => {
    expect(getDerivativePreset('nonexistent')).toBeUndefined()
  })
})

describe('getDerivativePresetIds', () => {
  it('returns all preset IDs', () => {
    const ids = getDerivativePresetIds()
    expect(ids.length).toBe(DERIVATIVE_PRESETS.length)
    expect(ids).toContain('linear')
    expect(ids).toContain('quadratic')
    expect(ids).toContain('sine')
  })
})

// ============================================================================
// Constants Tests
// ============================================================================

describe('constants', () => {
  it('DEFAULT_H is small positive number', () => {
    expect(DEFAULT_H).toBeGreaterThan(0)
    expect(DEFAULT_H).toBeLessThan(0.01)
  })

  it('SECANT_H_VALUES are decreasing', () => {
    for (let i = 1; i < SECANT_H_VALUES.length; i++) {
      expect(SECANT_H_VALUES[i]).toBeLessThan(SECANT_H_VALUES[i - 1]!)
    }
  })

  it('DEFAULT_PRESET is valid', () => {
    expect(getDerivativePreset(DEFAULT_PRESET)).toBeDefined()
  })

  it('DEFAULT_POINT is a number', () => {
    expect(typeof DEFAULT_POINT).toBe('number')
  })
})

// ============================================================================
// Edge Cases
// ============================================================================

describe('edge cases', () => {
  it('handles very large x values', () => {
    const f = (x: number) => x * x
    const deriv = centralDifference(f, 1000)
    expect(deriv).toBeCloseTo(2000, 0)
  })

  it('handles very small x values', () => {
    const f = (x: number) => x * x
    const deriv = centralDifference(f, 0.001)
    expect(deriv).toBeCloseTo(0.002, 6)
  })

  it('handles negative x values', () => {
    const f = (x: number) => x * x * x
    const deriv = centralDifference(f, -2)
    expect(deriv).toBeCloseTo(12, 5) // 3*(-2)² = 12
  })

  it('handles rapid oscillation', () => {
    const f = (x: number) => Math.sin(100 * x)
    const deriv = centralDifference(f, 0, 0.00001)
    // Derivative is 100*cos(100x), at x=0 that's 100
    expect(deriv).toBeCloseTo(100, 2)
  })
})

// ============================================================================
// Preset Function Behavior Tests
// ============================================================================

describe('preset function behaviors', () => {
  it('linear has constant derivative', () => {
    const preset = getDerivativePreset('linear')!
    expect(preset.derivative(0)).toBe(2)
    expect(preset.derivative(100)).toBe(2)
    expect(preset.derivative(-50)).toBe(2)
  })

  it('quadratic has zero derivative at vertex', () => {
    const preset = getDerivativePreset('quadratic')!
    expect(preset.derivative(0)).toBe(0)
  })

  it('sine and cosine derivatives are related', () => {
    const sine = getDerivativePreset('sine')!
    const cosine = getDerivativePreset('cosine')!

    // sin'(x) = cos(x)
    expect(sine.derivative(0)).toBeCloseTo(Math.cos(0), 10)
    // cos'(x) = -sin(x)
    expect(cosine.derivative(0)).toBeCloseTo(-Math.sin(0), 10)
  })

  it('exponential is its own derivative', () => {
    const preset = getDerivativePreset('exponential')!
    expect(preset.derivative(0)).toBeCloseTo(preset.fn(0), 10)
    expect(preset.derivative(1)).toBeCloseTo(preset.fn(1), 10)
  })

  it('logarithm derivative is 1/x', () => {
    const preset = getDerivativePreset('logarithm')!
    expect(preset.derivative(1)).toBe(1)
    expect(preset.derivative(2)).toBe(0.5)
    expect(preset.derivative(4)).toBe(0.25)
  })

  it('polynomial has expected critical points', () => {
    const preset = getDerivativePreset('polynomial')!
    // f(x) = x³ - 3x, f'(x) = 3x² - 3 = 0 at x = ±1
    expect(preset.derivative(1)).toBeCloseTo(0, 10)
    expect(preset.derivative(-1)).toBeCloseTo(0, 10)
  })
})
