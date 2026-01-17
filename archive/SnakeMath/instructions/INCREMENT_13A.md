# Increment 13A: Limits Math Utilities

**Goal**: Create comprehensive math utilities for limit evaluation, continuity checking, and preset functions.

**Prerequisites**: None (first increment of Phase 13)

---

## Files to Create

### 1. Update Types: `src/types/math.ts`

Add the following types at the end of the file:

```typescript
// ============================================================================
// Limits Types (Phase 13)
// ============================================================================

/**
 * Result of evaluating a limit
 */
export interface LimitResult {
  /** Whether the limit exists (left and right limits are equal) */
  exists: boolean
  /** The limit value if it exists, null otherwise */
  value: number | null
  /** The left-sided limit (x → a⁻) */
  leftLimit: number | null
  /** The right-sided limit (x → a⁺) */
  rightLimit: number | null
  /** Classification of the limit type */
  limitType: 'finite' | 'infinite' | 'does-not-exist'
}

/**
 * Result of checking continuity at a point
 */
export interface ContinuityResult {
  /** Whether the function is continuous at the point */
  isContinuous: boolean
  /** Type of discontinuity if not continuous */
  discontinuityType: 'none' | 'removable' | 'jump' | 'infinite' | 'oscillating'
  /** Human-readable description */
  description: string
}

/**
 * A preset function for the LimitsExplorer widget
 * D-107: Use preset functions rather than arbitrary input
 */
export interface LimitFunctionPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Educational description */
  description: string
  /** The function itself */
  fn: (x: number) => number
  /** Recommended viewing domain */
  domain: { min: number; max: number }
  /** Points where limits are interesting to explore */
  interestingPoints: number[]
  /** LaTeX representation for display */
  latex: string
  /** Expected behavior at interesting points */
  expectedBehavior: string
}

/**
 * Direction from which to approach the limit point
 */
export type ApproachDirection = 'both' | 'left' | 'right'

/**
 * A step in the numerical limit approximation sequence
 */
export interface LimitApproximationStep {
  /** The x value approaching the target */
  x: number
  /** The function value f(x) */
  fx: number
  /** Distance from the approach point |x - a| */
  distance: number
}
```

### 2. Create Limits Utilities: `src/utils/math/limits.ts`

```typescript
/**
 * Limits math utilities for calculus
 *
 * Provides numerical limit evaluation, continuity checking, and
 * epsilon-delta relationship functions.
 *
 * D-106: Focus on visual intuition over formal proofs
 * D-107: Use preset functions for consistent educational value
 * D-108: Use numerical approximation rather than symbolic computation
 */

import type {
  LimitResult,
  ContinuityResult,
  LimitFunctionPreset,
  ApproachDirection,
  LimitApproximationStep,
} from '@/types/math'

// ============================================================================
// Constants
// ============================================================================

/** Default tolerance for limit convergence */
export const LIMIT_TOLERANCE = 1e-8

/** Default epsilon for ε-δ visualization */
export const DEFAULT_EPSILON = 0.5

/** Default delta for ε-δ visualization */
export const DEFAULT_DELTA = 0.3

/** Maximum value before considering limit as infinite */
const INFINITY_THRESHOLD = 1e10

/** Number of steps for numerical approximation */
const DEFAULT_APPROXIMATION_STEPS = 10

/** Step reduction factor for approaching */
const STEP_FACTOR = 0.1

// ============================================================================
// Preset Functions
// ============================================================================

/**
 * Preset functions demonstrating various limit behaviors
 * Each preset shows a specific mathematical concept
 */
export const LIMIT_PRESETS: LimitFunctionPreset[] = [
  {
    id: 'polynomial',
    name: 'Polynomial',
    description: 'A simple continuous function where limits always exist',
    fn: (x: number) => x * x,
    domain: { min: -3, max: 3 },
    interestingPoints: [0, 1, -1, 2],
    latex: 'f(x) = x^2',
    expectedBehavior: 'Continuous everywhere - limit equals function value',
  },
  {
    id: 'rational',
    name: 'Rational (Removable)',
    description: 'Has a "hole" at x=1 where limit exists but function is undefined',
    fn: (x: number) => {
      if (Math.abs(x - 1) < 1e-15) return NaN
      return (x * x - 1) / (x - 1)
    },
    domain: { min: -2, max: 4 },
    interestingPoints: [1, 0, 2],
    latex: 'f(x) = \\frac{x^2 - 1}{x - 1}',
    expectedBehavior: 'Removable discontinuity at x=1: limit is 2 but f(1) undefined',
  },
  {
    id: 'step',
    name: 'Floor Function',
    description: 'Jumps at every integer - left and right limits differ',
    fn: (x: number) => Math.floor(x),
    domain: { min: -2, max: 4 },
    interestingPoints: [0, 1, 2, 3],
    latex: 'f(x) = \\lfloor x \\rfloor',
    expectedBehavior: 'Jump discontinuity at integers: left limit ≠ right limit',
  },
  {
    id: 'reciprocal',
    name: 'Reciprocal',
    description: 'Vertical asymptote at x=0 - limit is infinite',
    fn: (x: number) => {
      if (Math.abs(x) < 1e-15) return x > 0 ? Infinity : -Infinity
      return 1 / x
    },
    domain: { min: -3, max: 3 },
    interestingPoints: [0, 1, -1],
    latex: 'f(x) = \\frac{1}{x}',
    expectedBehavior: 'Infinite discontinuity at x=0: limit approaches ±∞',
  },
  {
    id: 'sine-over-x',
    name: 'Sine/x',
    description: 'Famous limit: approaches 1 as x→0 despite f(0) being undefined',
    fn: (x: number) => {
      if (Math.abs(x) < 1e-15) return NaN
      return Math.sin(x) / x
    },
    domain: { min: -10, max: 10 },
    interestingPoints: [0],
    latex: 'f(x) = \\frac{\\sin(x)}{x}',
    expectedBehavior: 'Removable discontinuity at x=0: limit is 1 (famous result)',
  },
  {
    id: 'absolute',
    name: 'Sign Function',
    description: 'Left limit is -1, right limit is +1 at x=0',
    fn: (x: number) => {
      if (Math.abs(x) < 1e-15) return NaN
      return Math.abs(x) / x
    },
    domain: { min: -3, max: 3 },
    interestingPoints: [0],
    latex: 'f(x) = \\frac{|x|}{x}',
    expectedBehavior: 'Jump discontinuity at x=0: left limit = -1, right limit = +1',
  },
  {
    id: 'oscillating',
    name: 'Oscillating',
    description: 'Oscillates infinitely fast near x=0 - limit does not exist',
    fn: (x: number) => {
      if (Math.abs(x) < 1e-15) return NaN
      return Math.sin(1 / x)
    },
    domain: { min: -2, max: 2 },
    interestingPoints: [0],
    latex: 'f(x) = \\sin\\left(\\frac{1}{x}\\right)',
    expectedBehavior: 'Oscillating: limit does not exist at x=0',
  },
  {
    id: 'piecewise',
    name: 'Piecewise',
    description: 'Different formulas for different regions',
    fn: (x: number) => {
      if (x < 0) return x + 1
      if (x > 0) return x * x
      return NaN // undefined at 0
    },
    domain: { min: -3, max: 3 },
    interestingPoints: [0, -1, 1],
    latex: 'f(x) = \\begin{cases} x+1 & x < 0 \\\\ x^2 & x > 0 \\end{cases}',
    expectedBehavior: 'Jump at x=0: left limit = 1, right limit = 0',
  },
]

/**
 * Get a preset function by ID
 */
export function getLimitPreset(id: string): LimitFunctionPreset | undefined {
  return LIMIT_PRESETS.find((preset) => preset.id === id)
}

// ============================================================================
// Core Limit Functions
// ============================================================================

/**
 * Evaluate the left-sided limit of a function as x approaches a point
 * Uses numerical approximation: f(a - 0.1), f(a - 0.01), f(a - 0.001), ...
 *
 * @param fn The function to evaluate
 * @param approachPoint The point to approach (a)
 * @param tolerance Convergence tolerance
 * @returns The left limit value, or null if it doesn't converge/exist
 */
export function evaluateLeftLimit(
  fn: (x: number) => number,
  approachPoint: number,
  tolerance: number = LIMIT_TOLERANCE
): number | null {
  const sequence = numericalLimitApproximation(fn, approachPoint, 'left')

  if (sequence.length < 3) return null

  // Check if sequence converges
  const lastValues = sequence.slice(-3).map((s) => s.fx)

  // Filter out NaN and Infinity values
  const validValues = lastValues.filter((v) => isFinite(v) && !isNaN(v))
  if (validValues.length < 2) {
    // Check if diverging to infinity
    if (lastValues.some((v) => v === Infinity)) return Infinity
    if (lastValues.some((v) => v === -Infinity)) return -Infinity
    return null
  }

  // Check convergence: differences should be decreasing
  const diff1 = Math.abs(validValues[1] - validValues[0])
  const diff2 =
    validValues.length > 2 ? Math.abs(validValues[2] - validValues[1]) : diff1

  if (diff2 < tolerance || (diff2 < diff1 && diff2 < 0.001)) {
    return validValues[validValues.length - 1]
  }

  // Check if values are very close (converged)
  const lastValue = validValues[validValues.length - 1]
  const allClose = validValues.every((v) => Math.abs(v - lastValue) < tolerance * 100)
  if (allClose) return lastValue

  return null
}

/**
 * Evaluate the right-sided limit of a function as x approaches a point
 *
 * @param fn The function to evaluate
 * @param approachPoint The point to approach (a)
 * @param tolerance Convergence tolerance
 * @returns The right limit value, or null if it doesn't converge/exist
 */
export function evaluateRightLimit(
  fn: (x: number) => number,
  approachPoint: number,
  tolerance: number = LIMIT_TOLERANCE
): number | null {
  const sequence = numericalLimitApproximation(fn, approachPoint, 'right')

  if (sequence.length < 3) return null

  const lastValues = sequence.slice(-3).map((s) => s.fx)

  const validValues = lastValues.filter((v) => isFinite(v) && !isNaN(v))
  if (validValues.length < 2) {
    if (lastValues.some((v) => v === Infinity)) return Infinity
    if (lastValues.some((v) => v === -Infinity)) return -Infinity
    return null
  }

  const diff1 = Math.abs(validValues[1] - validValues[0])
  const diff2 =
    validValues.length > 2 ? Math.abs(validValues[2] - validValues[1]) : diff1

  if (diff2 < tolerance || (diff2 < diff1 && diff2 < 0.001)) {
    return validValues[validValues.length - 1]
  }

  const lastValue = validValues[validValues.length - 1]
  const allClose = validValues.every((v) => Math.abs(v - lastValue) < tolerance * 100)
  if (allClose) return lastValue

  return null
}

/**
 * Evaluate the limit of a function at a point
 *
 * @param fn The function to evaluate
 * @param approachPoint The point to approach
 * @param direction Which direction to approach from
 * @param tolerance Convergence tolerance
 * @returns Complete limit result with left/right limits and classification
 */
export function evaluateLimit(
  fn: (x: number) => number,
  approachPoint: number,
  direction: ApproachDirection = 'both',
  tolerance: number = LIMIT_TOLERANCE
): LimitResult {
  if (direction === 'left') {
    const leftLimit = evaluateLeftLimit(fn, approachPoint, tolerance)
    return {
      exists: leftLimit !== null && isFinite(leftLimit),
      value: leftLimit,
      leftLimit,
      rightLimit: null,
      limitType: classifyLimitType(leftLimit, null),
    }
  }

  if (direction === 'right') {
    const rightLimit = evaluateRightLimit(fn, approachPoint, tolerance)
    return {
      exists: rightLimit !== null && isFinite(rightLimit),
      value: rightLimit,
      leftLimit: null,
      rightLimit,
      limitType: classifyLimitType(null, rightLimit),
    }
  }

  // Both directions
  const leftLimit = evaluateLeftLimit(fn, approachPoint, tolerance)
  const rightLimit = evaluateRightLimit(fn, approachPoint, tolerance)

  // Check if limit exists (both sides equal and finite)
  const exists = limitsAreEqual(leftLimit, rightLimit, tolerance)
  const value = exists ? leftLimit : null

  return {
    exists,
    value,
    leftLimit,
    rightLimit,
    limitType: classifyLimitType(leftLimit, rightLimit),
  }
}

/**
 * Check if two limit values are equal within tolerance
 */
function limitsAreEqual(
  left: number | null,
  right: number | null,
  tolerance: number
): boolean {
  if (left === null || right === null) return false
  if (!isFinite(left) || !isFinite(right)) return false
  return Math.abs(left - right) < tolerance
}

/**
 * Classify the type of limit based on left and right values
 */
function classifyLimitType(
  left: number | null,
  right: number | null
): 'finite' | 'infinite' | 'does-not-exist' {
  // If evaluating only one side
  if (left === null && right !== null) {
    if (!isFinite(right)) return 'infinite'
    return 'finite'
  }
  if (right === null && left !== null) {
    if (!isFinite(left)) return 'infinite'
    return 'finite'
  }

  // Both sides evaluated
  if (left === null && right === null) return 'does-not-exist'

  // Check for infinity
  if (!isFinite(left!) || !isFinite(right!)) return 'infinite'

  // Check if equal
  if (Math.abs(left! - right!) < LIMIT_TOLERANCE) return 'finite'

  return 'does-not-exist'
}

// ============================================================================
// Continuity Functions
// ============================================================================

/**
 * Check continuity of a function at a point
 *
 * A function is continuous at point a if:
 * 1. f(a) is defined
 * 2. lim(x→a) f(x) exists
 * 3. lim(x→a) f(x) = f(a)
 *
 * @param fn The function to check
 * @param point The point to check continuity at
 * @param tolerance Tolerance for comparisons
 * @returns Continuity result with classification
 */
export function checkContinuity(
  fn: (x: number) => number,
  point: number,
  tolerance: number = LIMIT_TOLERANCE
): ContinuityResult {
  // Evaluate function at the point
  const functionValue = fn(point)

  // Evaluate the limit
  const limitResult = evaluateLimit(fn, point, 'both', tolerance)

  // Check if function value is defined
  const functionDefined = isFinite(functionValue) && !isNaN(functionValue)

  // Case 1: Function is continuous
  if (
    functionDefined &&
    limitResult.exists &&
    limitResult.value !== null &&
    Math.abs(functionValue - limitResult.value) < tolerance * 100
  ) {
    return {
      isContinuous: true,
      discontinuityType: 'none',
      description: 'Function is continuous at this point',
    }
  }

  // Case 2: Removable discontinuity (limit exists but f(a) ≠ L or undefined)
  if (limitResult.exists && limitResult.value !== null) {
    if (!functionDefined) {
      return {
        isContinuous: false,
        discontinuityType: 'removable',
        description: `Removable discontinuity: limit is ${formatNumber(limitResult.value)} but f(${formatNumber(point)}) is undefined`,
      }
    }
    return {
      isContinuous: false,
      discontinuityType: 'removable',
      description: `Removable discontinuity: limit is ${formatNumber(limitResult.value)} but f(${formatNumber(point)}) = ${formatNumber(functionValue)}`,
    }
  }

  // Case 3: Jump discontinuity (left ≠ right, both finite)
  if (
    limitResult.leftLimit !== null &&
    limitResult.rightLimit !== null &&
    isFinite(limitResult.leftLimit) &&
    isFinite(limitResult.rightLimit) &&
    Math.abs(limitResult.leftLimit - limitResult.rightLimit) >= tolerance
  ) {
    return {
      isContinuous: false,
      discontinuityType: 'jump',
      description: `Jump discontinuity: left limit = ${formatNumber(limitResult.leftLimit)}, right limit = ${formatNumber(limitResult.rightLimit)}`,
    }
  }

  // Case 4: Infinite discontinuity
  if (
    (limitResult.leftLimit !== null && !isFinite(limitResult.leftLimit)) ||
    (limitResult.rightLimit !== null && !isFinite(limitResult.rightLimit))
  ) {
    return {
      isContinuous: false,
      discontinuityType: 'infinite',
      description: 'Infinite discontinuity: function approaches ±∞',
    }
  }

  // Case 5: Oscillating (limit doesn't exist and not infinite)
  return {
    isContinuous: false,
    discontinuityType: 'oscillating',
    description: 'Oscillating discontinuity: limit does not exist due to oscillation',
  }
}

/**
 * Format a number for display
 */
function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(4).replace(/\.?0+$/, '')
}

// ============================================================================
// Numerical Approximation
// ============================================================================

/**
 * Generate a sequence of function values approaching a point
 * Demonstrates how computers numerically compute limits
 *
 * @param fn The function to evaluate
 * @param approachPoint The point to approach
 * @param direction 'left' or 'right'
 * @param steps Number of approximation steps
 * @returns Array of approximation steps showing convergence
 */
export function numericalLimitApproximation(
  fn: (x: number) => number,
  approachPoint: number,
  direction: 'left' | 'right',
  steps: number = DEFAULT_APPROXIMATION_STEPS
): LimitApproximationStep[] {
  const result: LimitApproximationStep[] = []
  let distance = 1 // Start 1 unit away

  for (let i = 0; i < steps; i++) {
    const x =
      direction === 'left' ? approachPoint - distance : approachPoint + distance

    const fx = fn(x)

    result.push({
      x,
      fx,
      distance,
    })

    distance *= STEP_FACTOR // Get 10x closer each step
  }

  return result
}

// ============================================================================
// Epsilon-Delta Functions
// ============================================================================

/**
 * Find a delta value that works for a given epsilon
 * This demonstrates the ε-δ definition of limits
 *
 * For every ε > 0, there exists δ > 0 such that
 * if 0 < |x - a| < δ then |f(x) - L| < ε
 *
 * @param fn The function
 * @param approachPoint The point a
 * @param limitValue The limit L
 * @param epsilon The epsilon value
 * @param maxDelta Maximum delta to search
 * @returns A working delta value, or null if none found
 */
export function findDeltaForEpsilon(
  fn: (x: number) => number,
  approachPoint: number,
  limitValue: number,
  epsilon: number,
  maxDelta: number = 1
): number | null {
  // If limit is infinite or doesn't exist, no delta works
  if (!isFinite(limitValue)) return null

  // Binary search for the largest working delta
  let low = 0
  let high = maxDelta
  let workingDelta: number | null = null

  for (let iteration = 0; iteration < 50; iteration++) {
    const mid = (low + high) / 2

    if (deltaWorksForEpsilon(fn, approachPoint, limitValue, epsilon, mid)) {
      workingDelta = mid
      low = mid // Try to find a larger delta
    } else {
      high = mid // Need a smaller delta
    }

    if (high - low < 1e-10) break
  }

  return workingDelta
}

/**
 * Check if a given delta works for epsilon
 * Tests multiple points within the delta interval
 */
function deltaWorksForEpsilon(
  fn: (x: number) => number,
  approachPoint: number,
  limitValue: number,
  epsilon: number,
  delta: number
): boolean {
  const testPoints = 20
  const step = (2 * delta) / testPoints

  for (let i = 1; i < testPoints; i++) {
    // Test points on both sides, excluding the approach point itself
    const xLeft = approachPoint - delta + step * i
    const xRight = approachPoint + delta - step * i

    // Skip points too close to approach point (would test 0 < |x - a|)
    if (Math.abs(xLeft - approachPoint) < 1e-15) continue
    if (Math.abs(xRight - approachPoint) < 1e-15) continue

    // Only test points within the delta interval
    if (Math.abs(xLeft - approachPoint) >= delta) continue
    if (Math.abs(xRight - approachPoint) >= delta) continue

    const fxLeft = fn(xLeft)
    const fxRight = fn(xRight)

    // Check if |f(x) - L| < epsilon
    if (!isFinite(fxLeft) || Math.abs(fxLeft - limitValue) >= epsilon) return false
    if (!isFinite(fxRight) || Math.abs(fxRight - limitValue) >= epsilon) return false
  }

  return true
}

/**
 * Check if a point is valid for approaching (within function domain)
 *
 * @param fn The function
 * @param point The point to check
 * @returns Whether the point can be approached
 */
export function isValidApproachPoint(
  fn: (x: number) => number,
  point: number
): boolean {
  // Check if we can evaluate points near this point
  const nearLeft = fn(point - 0.001)
  const nearRight = fn(point + 0.001)

  // At least one side should have finite values
  const leftValid = isFinite(nearLeft) || nearLeft === Infinity || nearLeft === -Infinity
  const rightValid =
    isFinite(nearRight) || nearRight === Infinity || nearRight === -Infinity

  return leftValid || rightValid
}
```

### 3. Create Test File: `src/utils/math/limits.test.ts`

```typescript
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
    expect(result[0].x).toBeLessThan(2)
    expect(result[1].x).toBeGreaterThan(result[0].x) // Getting closer to 2
  })

  it('should approach from right with decreasing x values', () => {
    const result = numericalLimitApproximation(fn, 2, 'right')
    expect(result[0].x).toBeGreaterThan(2)
    expect(result[1].x).toBeLessThan(result[0].x) // Getting closer to 2
  })

  it('should have decreasing distances', () => {
    const result = numericalLimitApproximation(fn, 2, 'left')
    for (let i = 1; i < result.length; i++) {
      expect(result[i].distance).toBeLessThan(result[i - 1].distance)
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
      if (Math.abs(x - a) < delta! && x !== a) {
        expect(Math.abs(fn(x) - L)).toBeLessThan(epsilon)
      }
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
```

---

## Success Criteria

- [ ] Types added to `src/types/math.ts`
- [ ] `src/utils/math/limits.ts` created with all functions
- [ ] All 8 preset functions defined and working
- [ ] `evaluateLimit` correctly evaluates continuous functions
- [ ] `evaluateLeftLimit` and `evaluateRightLimit` work independently
- [ ] `checkContinuity` correctly classifies all discontinuity types
- [ ] `numericalLimitApproximation` generates correct sequences
- [ ] `findDeltaForEpsilon` finds valid delta values
- [ ] `isValidApproachPoint` validates approach points
- [ ] All 45+ tests pass
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

---

## Commands to Run

```bash
# Run unit tests in watch mode during development
npm run test -- src/utils/math/limits.test.ts --watch

# Verify types
npm run type-check

# Check linting
npm run lint

# Final build verification
npm run build
```

---

## Implementation Notes

1. **Numerical Approach (D-108)**: We use numerical approximation rather than symbolic math. This matches how computers actually compute limits and demonstrates the convergence process.

2. **Tolerance Handling**: Use `1e-8` as default tolerance. For floating-point comparisons, allow some wiggle room.

3. **Infinity Detection**: JavaScript's `Infinity` and `-Infinity` are valid number values. Check with `isFinite()`.

4. **NaN Handling**: Functions return `NaN` at undefined points. Always check with `isNaN()`.

5. **Preset Functions**: Each preset demonstrates a specific mathematical concept. The `interestingPoints` array tells the widget where to focus exploration.

6. **Test Organization**: Tests are grouped by function type (polynomial, rational, etc.) to verify each preset behavior.
