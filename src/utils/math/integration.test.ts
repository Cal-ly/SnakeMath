/**
 * Tests for integration utilities
 *
 * Target: 70+ tests covering:
 * - All Riemann sum methods
 * - Known integral values
 * - Edge cases
 * - Convergence behavior
 * - Preset functions
 */

import { describe, it, expect } from 'vitest'
import {
  // Core functions
  riemannSum,
  leftRiemannSum,
  rightRiemannSum,
  midpointRiemannSum,
  trapezoidalSum,
  simpsonsRule,
  evaluateIntegration,
  computeExactIntegral,
  // Presets
  INTEGRATION_PRESETS,
  getIntegrationPreset,
  getIntegrationPresetIds,
  computePresetExactIntegral,
  // Utilities
  clampN,
  validateBounds,
  isEffectivelyZero,
  // Constants
  DEFAULT_N,
  MAX_N,
  MIN_N,
  DEFAULT_METHOD,
  DEFAULT_PRESET,
} from './integration'

// ============================================================================
// Helper functions for tests
// ============================================================================

/** Simple function: f(x) = x, integral from 0 to 1 = 0.5 */
const identity = (x: number) => x

/** Constant function: f(x) = 2, integral from 0 to 3 = 6 */
const constant2 = () => 2

/** Quadratic: f(x) = x^2, integral from 0 to 1 = 1/3 */
const quadratic = (x: number) => x * x

/** Linear: f(x) = 2x + 1, integral from 0 to 2 = 6 */
const linear = (x: number) => 2 * x + 1

// ============================================================================
// Constants Tests
// ============================================================================

describe('Integration Constants', () => {
  it('has valid default values', () => {
    expect(DEFAULT_N).toBe(10)
    expect(MIN_N).toBe(1)
    expect(MAX_N).toBe(200)
    expect(DEFAULT_METHOD).toBe('midpoint')
    expect(DEFAULT_PRESET).toBe('quadratic')
  })

  it('MIN_N is less than MAX_N', () => {
    expect(MIN_N).toBeLessThan(MAX_N)
  })
})

// ============================================================================
// Left Riemann Sum Tests
// ============================================================================

describe('leftRiemannSum', () => {
  it('computes correct result for constant function', () => {
    const result = leftRiemannSum(constant2, 0, 3, 10)
    expect(result.approximation).toBeCloseTo(6, 10)
    expect(result.n).toBe(10)
    expect(result.deltaX).toBeCloseTo(0.3, 10)
  })

  it('computes correct result for identity function', () => {
    // ∫₀¹ x dx = 0.5
    // Left sum underestimates for increasing functions
    const result = leftRiemannSum(identity, 0, 1, 100)
    expect(result.approximation).toBeLessThan(0.5)
    expect(result.approximation).toBeCloseTo(0.495, 2)
  })

  it('returns correct number of sample points', () => {
    const result = leftRiemannSum(identity, 0, 1, 5)
    expect(result.samplePoints.length).toBe(5)
    expect(result.areas.length).toBe(5)
  })

  it('sample points have correct x values', () => {
    const result = leftRiemannSum(identity, 0, 1, 4)
    expect(result.samplePoints[0]?.x).toBeCloseTo(0, 10)
    expect(result.samplePoints[1]?.x).toBeCloseTo(0.25, 10)
    expect(result.samplePoints[2]?.x).toBeCloseTo(0.5, 10)
    expect(result.samplePoints[3]?.x).toBeCloseTo(0.75, 10)
  })

  it('handles negative function values', () => {
    const negative = (x: number) => -x
    const result = leftRiemannSum(negative, 0, 1, 10)
    expect(result.approximation).toBeLessThan(0)
  })

  it('handles single subdivision', () => {
    const result = leftRiemannSum(identity, 0, 1, 1)
    expect(result.approximation).toBe(0) // f(0) * 1 = 0
    expect(result.n).toBe(1)
  })
})

// ============================================================================
// Right Riemann Sum Tests
// ============================================================================

describe('rightRiemannSum', () => {
  it('computes correct result for constant function', () => {
    const result = rightRiemannSum(constant2, 0, 3, 10)
    expect(result.approximation).toBeCloseTo(6, 10)
  })

  it('overestimates for increasing function', () => {
    const result = rightRiemannSum(identity, 0, 1, 100)
    expect(result.approximation).toBeGreaterThan(0.5)
    expect(result.approximation).toBeCloseTo(0.505, 2)
  })

  it('sample points use right endpoints', () => {
    const result = rightRiemannSum(identity, 0, 1, 4)
    expect(result.samplePoints[0]?.x).toBeCloseTo(0.25, 10)
    expect(result.samplePoints[3]?.x).toBeCloseTo(1.0, 10)
  })

  it('handles single subdivision', () => {
    const result = rightRiemannSum(identity, 0, 1, 1)
    expect(result.approximation).toBe(1) // f(1) * 1 = 1
  })
})

// ============================================================================
// Midpoint Riemann Sum Tests
// ============================================================================

describe('midpointRiemannSum', () => {
  it('computes correct result for constant function', () => {
    const result = midpointRiemannSum(constant2, 0, 3, 10)
    expect(result.approximation).toBeCloseTo(6, 10)
  })

  it('is more accurate than left/right for smooth functions', () => {
    const leftResult = leftRiemannSum(quadratic, 0, 1, 10)
    const rightResult = rightRiemannSum(quadratic, 0, 1, 10)
    const midResult = midpointRiemannSum(quadratic, 0, 1, 10)
    const exact = 1 / 3

    const leftError = Math.abs(leftResult.approximation - exact)
    const rightError = Math.abs(rightResult.approximation - exact)
    const midError = Math.abs(midResult.approximation - exact)

    expect(midError).toBeLessThan(leftError)
    expect(midError).toBeLessThan(rightError)
  })

  it('sample points use midpoints', () => {
    const result = midpointRiemannSum(identity, 0, 1, 4)
    expect(result.samplePoints[0]?.x).toBeCloseTo(0.125, 10)
    expect(result.samplePoints[1]?.x).toBeCloseTo(0.375, 10)
  })

  it('converges at O(1/n^2) rate', () => {
    const exact = 1 / 3
    const error10 = Math.abs(midpointRiemannSum(quadratic, 0, 1, 10).approximation - exact)
    const error20 = Math.abs(midpointRiemannSum(quadratic, 0, 1, 20).approximation - exact)
    // Doubling n should reduce error by ~4x for O(1/n^2)
    expect(error10 / error20).toBeGreaterThan(3)
    expect(error10 / error20).toBeLessThan(5)
  })
})

// ============================================================================
// Trapezoidal Rule Tests
// ============================================================================

describe('trapezoidalSum', () => {
  it('computes correct result for constant function', () => {
    const result = trapezoidalSum(constant2, 0, 3, 10)
    expect(result.approximation).toBeCloseTo(6, 10)
  })

  it('is exact for linear functions', () => {
    const result = trapezoidalSum(linear, 0, 2, 5)
    // ∫₀² (2x + 1) dx = [x² + x]₀² = 6
    expect(result.approximation).toBeCloseTo(6, 10)
  })

  it('includes rightY in sample points', () => {
    const result = trapezoidalSum(identity, 0, 1, 4)
    expect(result.samplePoints[0]?.rightY).toBeDefined()
    expect(result.samplePoints[0]?.rightY).toBeCloseTo(0.25, 10)
  })

  it('converges at O(1/n^2) rate', () => {
    const exact = 1 / 3
    const error10 = Math.abs(trapezoidalSum(quadratic, 0, 1, 10).approximation - exact)
    const error20 = Math.abs(trapezoidalSum(quadratic, 0, 1, 20).approximation - exact)
    expect(error10 / error20).toBeGreaterThan(3)
    expect(error10 / error20).toBeLessThan(5)
  })
})

// ============================================================================
// Simpson's Rule Tests
// ============================================================================

describe('simpsonsRule', () => {
  it('computes correct result for constant function', () => {
    const result = simpsonsRule(constant2, 0, 3, 10)
    expect(result.approximation).toBeCloseTo(6, 10)
  })

  it('adjusts odd n to even', () => {
    const result = simpsonsRule(identity, 0, 1, 5)
    expect(result.n).toBe(6) // 5 -> 6
  })

  it('is exact for polynomials up to degree 3', () => {
    const cubic = (x: number) => x * x * x
    // ∫₀¹ x³ dx = 1/4
    const result = simpsonsRule(cubic, 0, 1, 2)
    expect(result.approximation).toBeCloseTo(0.25, 10)
  })

  it('is more accurate than trapezoidal for smooth functions', () => {
    const fn = (x: number) => Math.sin(x)
    // ∫₀^π sin(x) dx = 2
    const trapResult = trapezoidalSum(fn, 0, Math.PI, 10)
    const simpResult = simpsonsRule(fn, 0, Math.PI, 10)
    const exact = 2

    expect(Math.abs(simpResult.approximation - exact)).toBeLessThan(
      Math.abs(trapResult.approximation - exact)
    )
  })

  it('converges at O(1/n^4) rate', () => {
    const fn = (x: number) => Math.exp(x)
    const exact = Math.E - 1 // ∫₀¹ eˣ dx
    const error10 = Math.abs(simpsonsRule(fn, 0, 1, 10).approximation - exact)
    const error20 = Math.abs(simpsonsRule(fn, 0, 1, 20).approximation - exact)
    // Doubling n should reduce error by ~16x for O(1/n^4)
    expect(error10 / error20).toBeGreaterThan(10)
  })
})

// ============================================================================
// riemannSum Dispatcher Tests
// ============================================================================

describe('riemannSum', () => {
  it('dispatches to left method', () => {
    const direct = leftRiemannSum(identity, 0, 1, 10)
    const dispatched = riemannSum(identity, 0, 1, 10, 'left')
    expect(dispatched.approximation).toBe(direct.approximation)
  })

  it('dispatches to right method', () => {
    const direct = rightRiemannSum(identity, 0, 1, 10)
    const dispatched = riemannSum(identity, 0, 1, 10, 'right')
    expect(dispatched.approximation).toBe(direct.approximation)
  })

  it('dispatches to midpoint method', () => {
    const direct = midpointRiemannSum(identity, 0, 1, 10)
    const dispatched = riemannSum(identity, 0, 1, 10, 'midpoint')
    expect(dispatched.approximation).toBe(direct.approximation)
  })

  it('dispatches to trapezoidal method', () => {
    const direct = trapezoidalSum(identity, 0, 1, 10)
    const dispatched = riemannSum(identity, 0, 1, 10, 'trapezoidal')
    expect(dispatched.approximation).toBe(direct.approximation)
  })

  it('dispatches to simpson method', () => {
    const direct = simpsonsRule(identity, 0, 1, 10)
    const dispatched = riemannSum(identity, 0, 1, 10, 'simpson')
    expect(dispatched.approximation).toBe(direct.approximation)
  })

  it('clamps n below MIN_N', () => {
    const result = riemannSum(identity, 0, 1, 0, 'left')
    expect(result.n).toBe(1)
  })

  it('clamps n above MAX_N', () => {
    const result = riemannSum(identity, 0, 1, 1000, 'left')
    expect(result.n).toBe(200)
  })

  it('handles a === b edge case', () => {
    const result = riemannSum(identity, 1, 1, 10, 'left')
    expect(result.approximation).toBe(0)
    expect(result.areas.length).toBe(0)
  })

  it('defaults to midpoint for unknown method', () => {
    const result = riemannSum(identity, 0, 1, 10, 'unknown' as unknown as 'left')
    const midResult = midpointRiemannSum(identity, 0, 1, 10)
    expect(result.approximation).toBe(midResult.approximation)
  })
})

// ============================================================================
// evaluateIntegration Tests
// ============================================================================

describe('evaluateIntegration', () => {
  it('returns approximation without exact value', () => {
    const result = evaluateIntegration(identity, 0, 1, 10, 'midpoint')
    expect(result.approximation).toBeDefined()
    expect(result.exactValue).toBeUndefined()
    expect(result.absoluteError).toBeUndefined()
  })

  it('computes error when exact function provided', () => {
    const exactFn = () => 0.5 // ∫₀¹ x dx = 0.5
    const result = evaluateIntegration(identity, 0, 1, 10, 'midpoint', exactFn)
    expect(result.exactValue).toBe(0.5)
    expect(result.absoluteError).toBeDefined()
    expect(result.relativeError).toBeDefined()
  })

  it('absolute error is non-negative', () => {
    const exactFn = () => 0.5
    const result = evaluateIntegration(identity, 0, 1, 10, 'left', exactFn)
    expect(result.absoluteError).toBeGreaterThanOrEqual(0)
  })

  it('relative error is computed correctly', () => {
    const exactFn = () => 10
    const result = evaluateIntegration(() => 10, 0, 1, 10, 'midpoint', exactFn)
    expect(result.approximation).toBeCloseTo(10, 5)
    expect(result.relativeError).toBeLessThan(0.001)
  })

  it('handles zero exact value gracefully', () => {
    const exactFn = () => 0
    const result = evaluateIntegration(() => 0.001, 0, 1, 10, 'midpoint', exactFn)
    expect(result.relativeError).toBeDefined()
  })
})

// ============================================================================
// computeExactIntegral Tests
// ============================================================================

describe('computeExactIntegral', () => {
  it('computes F(b) - F(a) correctly', () => {
    const F = (x: number) => x * x // antiderivative of 2x
    const result = computeExactIntegral(F, 0, 3)
    expect(result).toBe(9) // 3² - 0² = 9
  })

  it('handles negative bounds', () => {
    const F = (x: number) => x * x
    const result = computeExactIntegral(F, -2, 2)
    expect(result).toBe(0) // 4 - 4 = 0
  })
})

// ============================================================================
// Preset Functions Tests
// ============================================================================

describe('INTEGRATION_PRESETS', () => {
  it('contains expected number of presets', () => {
    expect(INTEGRATION_PRESETS.length).toBe(8)
  })

  it('all presets have required fields', () => {
    INTEGRATION_PRESETS.forEach((preset) => {
      expect(preset.id).toBeDefined()
      expect(preset.name).toBeDefined()
      expect(preset.description).toBeDefined()
      expect(preset.fn).toBeInstanceOf(Function)
      expect(preset.antiderivative).toBeInstanceOf(Function)
      expect(preset.latex).toBeDefined()
      expect(preset.antiderivativeLatex).toBeDefined()
      expect(preset.defaultBounds.a).toBeDefined()
      expect(preset.defaultBounds.b).toBeDefined()
      expect(preset.viewDomain.min).toBeDefined()
      expect(preset.viewDomain.max).toBeDefined()
    })
  })

  it('preset IDs are unique', () => {
    const ids = INTEGRATION_PRESETS.map((p) => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('preset bounds are valid (a < b)', () => {
    INTEGRATION_PRESETS.forEach((preset) => {
      expect(preset.defaultBounds.a).toBeLessThan(preset.defaultBounds.b)
    })
  })
})

describe('getIntegrationPreset', () => {
  it('returns preset for valid ID', () => {
    const preset = getIntegrationPreset('quadratic')
    expect(preset).toBeDefined()
    expect(preset?.name).toBe('Quadratic')
  })

  it('returns undefined for invalid ID', () => {
    expect(getIntegrationPreset('nonexistent')).toBeUndefined()
  })
})

describe('getIntegrationPresetIds', () => {
  it('returns all preset IDs', () => {
    const ids = getIntegrationPresetIds()
    expect(ids).toContain('linear')
    expect(ids).toContain('quadratic')
    expect(ids).toContain('sine')
    expect(ids).toContain('exponential')
    expect(ids).toContain('reciprocal')
    expect(ids).toContain('cubic-signed')
    expect(ids).toContain('semicircle')
    expect(ids).toContain('constant')
  })
})

describe('computePresetExactIntegral', () => {
  it('computes exact integral for quadratic preset', () => {
    const result = computePresetExactIntegral('quadratic', 0, 2)
    expect(result).toBeCloseTo(8 / 3, 10)
  })

  it('returns null for invalid preset', () => {
    expect(computePresetExactIntegral('invalid', 0, 1)).toBeNull()
  })
})

// ============================================================================
// Preset Accuracy Tests
// ============================================================================

describe('Preset exact integrals', () => {
  it('linear: ∫₀³ (2x+1)dx = 12', () => {
    const preset = getIntegrationPreset('linear')!
    const exact = computeExactIntegral(preset.antiderivative, 0, 3)
    expect(exact).toBeCloseTo(12, 10)
  })

  it('quadratic: ∫₀² x²dx = 8/3', () => {
    const preset = getIntegrationPreset('quadratic')!
    const exact = computeExactIntegral(preset.antiderivative, 0, 2)
    expect(exact).toBeCloseTo(8 / 3, 10)
  })

  it('sine: ∫₀^π sin(x)dx = 2', () => {
    const preset = getIntegrationPreset('sine')!
    const exact = computeExactIntegral(preset.antiderivative, 0, Math.PI)
    expect(exact).toBeCloseTo(2, 10)
  })

  it('exponential: ∫₀¹ eˣdx = e - 1', () => {
    const preset = getIntegrationPreset('exponential')!
    const exact = computeExactIntegral(preset.antiderivative, 0, 1)
    expect(exact).toBeCloseTo(Math.E - 1, 10)
  })

  it('reciprocal: ∫₁^e (1/x)dx = 1', () => {
    const preset = getIntegrationPreset('reciprocal')!
    const exact = computeExactIntegral(preset.antiderivative, 1, Math.E)
    expect(exact).toBeCloseTo(1, 10)
  })

  it('cubic-signed: ∫₋₁² (x³-x)dx = 2.25', () => {
    const preset = getIntegrationPreset('cubic-signed')!
    const exact = computeExactIntegral(preset.antiderivative, -1, 2)
    expect(exact).toBeCloseTo(2.25, 10)
  })

  it('semicircle: ∫₋₁¹ √(1-x²)dx = π/2', () => {
    const preset = getIntegrationPreset('semicircle')!
    const exact = computeExactIntegral(preset.antiderivative, -1, 1)
    expect(exact).toBeCloseTo(Math.PI / 2, 10)
  })

  it('constant: ∫₀⁴ 3dx = 12', () => {
    const preset = getIntegrationPreset('constant')!
    const exact = computeExactIntegral(preset.antiderivative, 0, 4)
    expect(exact).toBeCloseTo(12, 10)
  })
})

// ============================================================================
// Utility Function Tests
// ============================================================================

describe('clampN', () => {
  it('returns n when in valid range', () => {
    expect(clampN(50)).toBe(50)
  })

  it('clamps below MIN_N', () => {
    expect(clampN(0)).toBe(1)
    expect(clampN(-5)).toBe(1)
  })

  it('clamps above MAX_N', () => {
    expect(clampN(500)).toBe(200)
  })

  it('floors non-integer values', () => {
    expect(clampN(10.7)).toBe(10)
    expect(clampN(10.2)).toBe(10)
  })
})

describe('validateBounds', () => {
  it('returns true for valid bounds', () => {
    expect(validateBounds(0, 1)).toBe(true)
    expect(validateBounds(-5, 5)).toBe(true)
  })

  it('returns false when a >= b', () => {
    expect(validateBounds(1, 1)).toBe(false)
    expect(validateBounds(2, 1)).toBe(false)
  })

  it('returns false for non-finite values', () => {
    expect(validateBounds(Infinity, 1)).toBe(false)
    expect(validateBounds(0, Infinity)).toBe(false)
    expect(validateBounds(NaN, 1)).toBe(false)
  })
})

describe('isEffectivelyZero', () => {
  it('returns true for zero', () => {
    expect(isEffectivelyZero(0)).toBe(true)
  })

  it('returns true for very small values', () => {
    expect(isEffectivelyZero(1e-15)).toBe(true)
    expect(isEffectivelyZero(-1e-15)).toBe(true)
  })

  it('returns false for non-zero values', () => {
    expect(isEffectivelyZero(0.001)).toBe(false)
    expect(isEffectivelyZero(-0.001)).toBe(false)
  })
})

// ============================================================================
// Signed Area Tests
// ============================================================================

describe('Signed area handling', () => {
  it('left Riemann handles negative function values', () => {
    const fn = (x: number) => x - 1 // negative on [0, 1)
    const result = leftRiemannSum(fn, 0, 2, 10)
    // Should have some negative areas
    const hasNegative = result.areas.some((a) => a < 0)
    expect(hasNegative).toBe(true)
  })

  it('correctly computes signed area for cubic-signed preset', () => {
    const preset = getIntegrationPreset('cubic-signed')!
    // x³ - x is negative on (-1, 0) and (0, 1)
    const result = midpointRiemannSum(preset.fn, -1, 2, 100)
    const exact = 2.25
    expect(result.approximation).toBeCloseTo(exact, 1)
  })
})

// ============================================================================
// Method Comparison Tests
// ============================================================================

describe('Method comparison for monotonic increasing function', () => {
  // For f(x) = x on [0, 1]:
  // Left underestimates, Right overestimates
  it('left underestimates, right overestimates', () => {
    const left = leftRiemannSum(identity, 0, 1, 10).approximation
    const right = rightRiemannSum(identity, 0, 1, 10).approximation
    const exact = 0.5

    expect(left).toBeLessThan(exact)
    expect(right).toBeGreaterThan(exact)
  })

  it('midpoint is between left and right for convex functions', () => {
    const left = leftRiemannSum(quadratic, 0, 1, 10).approximation
    const right = rightRiemannSum(quadratic, 0, 1, 10).approximation
    const mid = midpointRiemannSum(quadratic, 0, 1, 10).approximation

    expect(mid).toBeGreaterThan(left)
    expect(mid).toBeLessThan(right)
  })
})

// ============================================================================
// Edge Cases
// ============================================================================

describe('Edge cases', () => {
  it('handles very small intervals', () => {
    const result = midpointRiemannSum(identity, 0, 0.001, 10)
    expect(result.approximation).toBeCloseTo(0.0000005, 8)
  })

  it('handles negative intervals (a > b conceptually via swapped bounds)', () => {
    // Our functions expect a < b, but let's test behavior
    const result = midpointRiemannSum(identity, 1, 0, 10)
    // deltaX will be negative, so approximation will be negative
    expect(result.approximation).toBeLessThan(0)
  })

  it('handles functions with discontinuities gracefully', () => {
    const stepFn = (x: number) => (x < 0.5 ? 0 : 1)
    // Should not throw
    const result = midpointRiemannSum(stepFn, 0, 1, 100)
    expect(result.approximation).toBeCloseTo(0.5, 1)
  })

  it('handles very large n', () => {
    const result = midpointRiemannSum(identity, 0, 1, 200)
    expect(result.approximation).toBeCloseTo(0.5, 5)
  })
})
