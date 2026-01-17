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

/** Maximum value before considering limit as infinite - used in divergence detection */
const _INFINITY_THRESHOLD = 1e10

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

  // Get all function values in order (from farthest to nearest)
  const allValues = sequence.map((s) => s.fx)

  // Check if diverging to infinity (absolute values consistently growing)
  const finiteValues = allValues.filter((v) => isFinite(v) && !isNaN(v))
  if (finiteValues.length >= 3) {
    const absValues = finiteValues.map(Math.abs)
    // Check if each value is larger than the previous (diverging)
    const isDiverging = absValues.slice(1).every((v, i) => v > (absValues[i] ?? 0) * 5)
    const lastAbsValue = absValues[absValues.length - 1]
    if (isDiverging && lastAbsValue !== undefined && lastAbsValue > 1e6) {
      // Check sign - all should have same sign for proper divergence
      const allPositive = finiteValues.every((v) => v > 0)
      const allNegative = finiteValues.every((v) => v < 0)
      if (allPositive) return Infinity
      if (allNegative) return -Infinity
    }
  }

  // Check last few values for convergence
  const lastValues = sequence.slice(-5).map((s) => s.fx)

  // Filter out NaN values
  const validValues = lastValues.filter((v) => !isNaN(v))
  if (validValues.length < 2) {
    return null
  }

  // Check if all values are infinite with same sign
  const infValues = validValues.filter((v) => !isFinite(v))
  if (infValues.length === validValues.length) {
    if (infValues.every((v) => v === Infinity)) return Infinity
    if (infValues.every((v) => v === -Infinity)) return -Infinity
    return null
  }

  // Filter to only finite values for convergence check
  const finiteOnly = validValues.filter((v) => isFinite(v))
  if (finiteOnly.length < 2) {
    if (validValues.some((v) => v === Infinity)) return Infinity
    if (validValues.some((v) => v === -Infinity)) return -Infinity
    return null
  }

  // Check convergence: differences should be decreasing
  // We know finiteOnly has at least 2 elements from the check above
  const diff1 = Math.abs((finiteOnly[1] ?? 0) - (finiteOnly[0] ?? 0))
  const diff2 =
    finiteOnly.length > 2 ? Math.abs((finiteOnly[2] ?? 0) - (finiteOnly[1] ?? 0)) : diff1

  if (diff2 < tolerance || (diff2 < diff1 && diff2 < 0.001)) {
    return finiteOnly[finiteOnly.length - 1] ?? null
  }

  // Check if values are very close (converged)
  const lastValue = finiteOnly[finiteOnly.length - 1]
  if (lastValue === undefined) return null
  const allClose = finiteOnly.every((v) => Math.abs(v - lastValue) < tolerance * 100)
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

  // Get all function values in order (from farthest to nearest)
  const allValues = sequence.map((s) => s.fx)

  // Check if diverging to infinity (absolute values consistently growing)
  const finiteValues = allValues.filter((v) => isFinite(v) && !isNaN(v))
  if (finiteValues.length >= 3) {
    const absValues = finiteValues.map(Math.abs)
    // Check if each value is larger than the previous (diverging)
    const isDiverging = absValues.slice(1).every((v, i) => v > (absValues[i] ?? 0) * 5)
    const lastAbsValue = absValues[absValues.length - 1]
    if (isDiverging && lastAbsValue !== undefined && lastAbsValue > 1e6) {
      // Check sign - all should have same sign for proper divergence
      const allPositive = finiteValues.every((v) => v > 0)
      const allNegative = finiteValues.every((v) => v < 0)
      if (allPositive) return Infinity
      if (allNegative) return -Infinity
    }
  }

  // Check last few values for convergence
  const lastValues = sequence.slice(-5).map((s) => s.fx)

  // Filter out NaN values
  const validValues = lastValues.filter((v) => !isNaN(v))
  if (validValues.length < 2) {
    return null
  }

  // Check if all values are infinite with same sign
  const infValues = validValues.filter((v) => !isFinite(v))
  if (infValues.length === validValues.length) {
    if (infValues.every((v) => v === Infinity)) return Infinity
    if (infValues.every((v) => v === -Infinity)) return -Infinity
    return null
  }

  // Filter to only finite values for convergence check
  const finiteOnly = validValues.filter((v) => isFinite(v))
  if (finiteOnly.length < 2) {
    if (validValues.some((v) => v === Infinity)) return Infinity
    if (validValues.some((v) => v === -Infinity)) return -Infinity
    return null
  }

  // Check convergence: differences should be decreasing
  // We know finiteOnly has at least 2 elements from the check above
  const diff1 = Math.abs((finiteOnly[1] ?? 0) - (finiteOnly[0] ?? 0))
  const diff2 =
    finiteOnly.length > 2 ? Math.abs((finiteOnly[2] ?? 0) - (finiteOnly[1] ?? 0)) : diff1

  if (diff2 < tolerance || (diff2 < diff1 && diff2 < 0.001)) {
    return finiteOnly[finiteOnly.length - 1] ?? null
  }

  const lastValue = finiteOnly[finiteOnly.length - 1]
  if (lastValue === undefined) return null
  const allClose = finiteOnly.every((v) => Math.abs(v - lastValue) < tolerance * 100)
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
 * Uses both absolute and relative tolerance for robustness
 */
function limitsAreEqual(
  left: number | null,
  right: number | null,
  tolerance: number
): boolean {
  if (left === null || right === null) return false
  if (!isFinite(left) || !isFinite(right)) return false

  const absDiff = Math.abs(left - right)
  // Use absolute tolerance for values near zero
  if (absDiff < tolerance * 1000) return true
  // Use relative tolerance for larger values
  const maxAbs = Math.max(Math.abs(left), Math.abs(right))
  return absDiff / maxAbs < tolerance * 1000
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

  // Check if equal (using relaxed tolerance for numerical precision)
  if (limitsAreEqual(left, right, LIMIT_TOLERANCE)) return 'finite'

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
