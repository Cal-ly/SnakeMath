/**
 * Derivative utilities for Phase 14: Calculus — Derivatives
 *
 * Provides numerical differentiation, tangent/secant line calculations,
 * and preset functions for the DerivativeVisualizer widget.
 *
 * D-112: Focus on geometric interpretation (tangent slopes) over symbolic rules
 * D-113: Use preset functions consistent with LimitsExplorer (D-107)
 * D-115: Use central difference as primary numerical method
 */

import type {
  DerivativeResult,
  TangentLine,
  SecantLine,
  DerivativeFunctionPreset,
  CriticalPoint,
  CriticalPointType,
} from '@/types/math'

// ============================================================================
// Constants
// ============================================================================

/** Default step size for numerical differentiation */
export const DEFAULT_H = 0.0001

/** Tolerance for comparing numerical values */
export const DERIVATIVE_TOLERANCE = 1e-6

/** Standard h values for secant line animation (converging to tangent) */
export const SECANT_H_VALUES = [1, 0.5, 0.2, 0.1, 0.05, 0.01, 0.005, 0.001]

/** Default preset ID */
export const DEFAULT_PRESET = 'quadratic'

/** Default point of tangency */
export const DEFAULT_POINT = 1

// ============================================================================
// Numerical Differentiation
// ============================================================================

/**
 * Compute the derivative using the central difference method.
 * More accurate than forward difference: O(h²) error vs O(h).
 *
 * Formula: f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
 *
 * @param fn - The function to differentiate
 * @param x - The point at which to compute the derivative
 * @param h - Step size (default: 0.0001)
 * @returns The numerical derivative value
 */
export function centralDifference(
  fn: (x: number) => number,
  x: number,
  h: number = DEFAULT_H
): number {
  const fPlus = fn(x + h)
  const fMinus = fn(x - h)

  // Handle cases where function returns non-finite values
  if (!isFinite(fPlus) || !isFinite(fMinus)) {
    return NaN
  }

  return (fPlus - fMinus) / (2 * h)
}

/**
 * Compute the derivative using the forward difference method.
 * This is the definition of the derivative shown in textbooks.
 *
 * Formula: f'(x) ≈ (f(x+h) - f(x)) / h
 *
 * Less accurate than central difference but matches the limit definition.
 *
 * @param fn - The function to differentiate
 * @param x - The point at which to compute the derivative
 * @param h - Step size (default: 0.0001)
 * @returns The numerical derivative value
 */
export function forwardDifference(
  fn: (x: number) => number,
  x: number,
  h: number = DEFAULT_H
): number {
  const fX = fn(x)
  const fXPlusH = fn(x + h)

  if (!isFinite(fX) || !isFinite(fXPlusH)) {
    return NaN
  }

  return (fXPlusH - fX) / h
}

/**
 * Compute the derivative using the backward difference method.
 *
 * Formula: f'(x) ≈ (f(x) - f(x-h)) / h
 *
 * @param fn - The function to differentiate
 * @param x - The point at which to compute the derivative
 * @param h - Step size (default: 0.0001)
 * @returns The numerical derivative value
 */
export function backwardDifference(
  fn: (x: number) => number,
  x: number,
  h: number = DEFAULT_H
): number {
  const fX = fn(x)
  const fXMinusH = fn(x - h)

  if (!isFinite(fX) || !isFinite(fXMinusH)) {
    return NaN
  }

  return (fX - fXMinusH) / h
}

/**
 * Primary numerical derivative function using central difference.
 * Alias for centralDifference for convenience.
 */
export const numericalDerivative = centralDifference

/**
 * Evaluate the derivative with both numerical and (optionally) exact values.
 *
 * @param fn - The function to differentiate
 * @param x - The point at which to evaluate
 * @param exactDerivative - Optional exact derivative function for comparison
 * @param h - Step size for numerical computation
 * @returns DerivativeResult with value and existence info
 */
export function evaluateDerivative(
  fn: (x: number) => number,
  x: number,
  exactDerivative?: (x: number) => number,
  h: number = DEFAULT_H
): DerivativeResult {
  const numericalValue = centralDifference(fn, x, h)
  const exists = isFinite(numericalValue)

  if (exactDerivative) {
    const exactValue = exactDerivative(x)
    return {
      value: exists ? numericalValue : NaN,
      exactValue: isFinite(exactValue) ? exactValue : undefined,
      method: 'exact',
      exists: exists && isFinite(exactValue),
    }
  }

  return {
    value: exists ? numericalValue : NaN,
    method: 'numerical',
    exists,
  }
}

// ============================================================================
// Tangent and Secant Line Calculations
// ============================================================================

/**
 * Calculate the tangent line at a point on a curve.
 *
 * The tangent line equation: y = slope * (x - x₀) + y₀
 * which simplifies to: y = slope * x + (y₀ - slope * x₀)
 *
 * @param fn - The function
 * @param x - The x-coordinate of the point of tangency
 * @param derivative - Optional pre-computed derivative value
 * @returns TangentLine with slope, y-intercept, and point
 */
export function calculateTangentLine(
  fn: (x: number) => number,
  x: number,
  derivative?: number
): TangentLine {
  const y = fn(x)
  const slope = derivative ?? centralDifference(fn, x)
  const yIntercept = y - slope * x

  return {
    slope,
    yIntercept,
    point: { x, y },
  }
}

/**
 * Calculate a secant line between two points on a curve.
 *
 * The secant line connects (x, f(x)) and (x+h, f(x+h)).
 * Its slope is the difference quotient: (f(x+h) - f(x)) / h
 *
 * @param fn - The function
 * @param x - The starting x-coordinate
 * @param h - The distance to the second point
 * @returns SecantLine with slope, h, and both points
 */
export function calculateSecantLine(
  fn: (x: number) => number,
  x: number,
  h: number
): SecantLine {
  const y1 = fn(x)
  const y2 = fn(x + h)
  const slope = (y2 - y1) / h

  return {
    slope,
    h,
    point1: { x, y: y1 },
    point2: { x: x + h, y: y2 },
  }
}

/**
 * Generate a sequence of secant lines converging to the tangent.
 * This visualizes the limit definition of the derivative.
 *
 * @param fn - The function
 * @param x - The point of tangency
 * @param hValues - Array of h values (default: standard sequence)
 * @returns Array of SecantLine objects
 */
export function generateSecantSequence(
  fn: (x: number) => number,
  x: number,
  hValues: number[] = SECANT_H_VALUES
): SecantLine[] {
  return hValues.map((h) => calculateSecantLine(fn, x, h))
}

/**
 * Get the line endpoints for rendering within a domain.
 * Useful for extending tangent/secant lines across the canvas.
 *
 * @param slope - Line slope
 * @param yIntercept - Line y-intercept
 * @param domain - The x-domain to render within
 * @returns Start and end points of the line
 */
export function getLineEndpoints(
  slope: number,
  yIntercept: number,
  domain: { min: number; max: number }
): { x1: number; y1: number; x2: number; y2: number } {
  const x1 = domain.min
  const y1 = slope * x1 + yIntercept
  const x2 = domain.max
  const y2 = slope * x2 + yIntercept

  return { x1, y1, x2, y2 }
}

// ============================================================================
// Critical Points and Analysis
// ============================================================================

/**
 * Find critical points where f'(x) = 0 within a domain.
 * Uses numerical search with bisection refinement.
 *
 * @param fn - The function
 * @param derivative - The derivative function
 * @param domain - Search domain
 * @param tolerance - Tolerance for finding zeros (default: 1e-6)
 * @returns Array of x-values where f'(x) ≈ 0
 */
export function findCriticalPoints(
  fn: (x: number) => number,
  derivative: (x: number) => number,
  domain: { min: number; max: number },
  tolerance: number = DERIVATIVE_TOLERANCE
): number[] {
  const criticalPoints: number[] = []
  const step = (domain.max - domain.min) / 100
  let prevSign = Math.sign(derivative(domain.min))

  for (let x = domain.min + step; x <= domain.max; x += step) {
    const currentValue = derivative(x)
    const currentSign = Math.sign(currentValue)

    // Check for sign change (zero crossing)
    if (prevSign !== 0 && currentSign !== 0 && prevSign !== currentSign) {
      // Refine with bisection
      const refined = bisectionSearch(derivative, x - step, x, tolerance)
      if (refined !== null && !criticalPoints.some((p) => Math.abs(p - refined) < step)) {
        criticalPoints.push(refined)
      }
    }

    // Also check for values very close to zero
    if (Math.abs(currentValue) < tolerance) {
      if (!criticalPoints.some((p) => Math.abs(p - x) < step)) {
        criticalPoints.push(x)
      }
    }

    prevSign = currentSign
  }

  return criticalPoints.sort((a, b) => a - b)
}

/**
 * Bisection search to find where f(x) = 0.
 */
function bisectionSearch(
  fn: (x: number) => number,
  a: number,
  b: number,
  tolerance: number,
  maxIterations: number = 50
): number | null {
  let left = a
  let right = b
  let fLeft = fn(left)
  let fRight = fn(right)

  // Ensure we have a sign change
  if (fLeft * fRight > 0) return null

  for (let i = 0; i < maxIterations; i++) {
    const mid = (left + right) / 2
    const fMid = fn(mid)

    if (Math.abs(fMid) < tolerance || (right - left) / 2 < tolerance) {
      return mid
    }

    if (fMid * fLeft < 0) {
      right = mid
      fRight = fMid
    } else {
      left = mid
      fLeft = fMid
    }
  }

  return (left + right) / 2
}

/**
 * Classify a critical point using the second derivative test.
 *
 * @param fn - The function
 * @param derivative - The first derivative
 * @param x - The critical point
 * @returns Classification of the critical point
 */
export function classifyCriticalPoint(
  fn: (x: number) => number,
  derivative: (x: number) => number,
  x: number
): CriticalPointType {
  // Compute second derivative numerically
  const secondDerivative = centralDifference(derivative, x)

  if (!isFinite(secondDerivative)) {
    return 'none'
  }

  if (secondDerivative > DERIVATIVE_TOLERANCE) {
    return 'local-min'
  } else if (secondDerivative < -DERIVATIVE_TOLERANCE) {
    return 'local-max'
  } else {
    // Second derivative is zero - need higher order test
    // For simplicity, check third derivative
    const thirdDerivative = centralDifference((t) => centralDifference(derivative, t), x)
    if (Math.abs(thirdDerivative) > DERIVATIVE_TOLERANCE) {
      return 'inflection'
    }
    return 'saddle'
  }
}

/**
 * Get full information about critical points in a domain.
 */
export function analyzeCriticalPoints(
  fn: (x: number) => number,
  derivative: (x: number) => number,
  domain: { min: number; max: number }
): CriticalPoint[] {
  const xValues = findCriticalPoints(fn, derivative, domain)

  return xValues.map((x) => ({
    x,
    y: fn(x),
    type: classifyCriticalPoint(fn, derivative, x),
  }))
}

/**
 * Check if the derivative exists at a point.
 * The derivative exists if left and right derivatives are equal.
 *
 * Uses a larger tolerance since forward/backward differences have O(h) error.
 */
export function derivativeExists(
  fn: (x: number) => number,
  x: number,
  h: number = DEFAULT_H,
  tolerance: number = 0.01
): boolean {
  const leftDeriv = backwardDifference(fn, x, h)
  const rightDeriv = forwardDifference(fn, x, h)

  if (!isFinite(leftDeriv) || !isFinite(rightDeriv)) {
    return false
  }

  // Use relative tolerance for larger values
  const maxAbs = Math.max(Math.abs(leftDeriv), Math.abs(rightDeriv), 1)
  return Math.abs(leftDeriv - rightDeriv) / maxAbs < tolerance
}

// ============================================================================
// Preset Functions
// ============================================================================

/**
 * Preset functions for the DerivativeVisualizer widget.
 * Each preset includes the function, its exact derivative, and interesting points.
 */
export const DERIVATIVE_PRESETS: DerivativeFunctionPreset[] = [
  {
    id: 'linear',
    name: 'Linear',
    description: 'Constant slope - the derivative is always the same',
    fn: (x) => 2 * x + 1,
    derivative: () => 2,
    latex: 'f(x) = 2x + 1',
    derivativeLatex: "f'(x) = 2",
    domain: { min: -3, max: 3 },
    interestingPoints: [
      { x: 0, description: 'Slope is 2 everywhere' },
      { x: 1, description: 'Same slope at any point' },
    ],
  },
  {
    id: 'quadratic',
    name: 'Quadratic',
    description: 'Parabola - slope changes linearly, zero at vertex',
    fn: (x) => x * x,
    derivative: (x) => 2 * x,
    latex: 'f(x) = x^2',
    derivativeLatex: "f'(x) = 2x",
    domain: { min: -3, max: 3 },
    interestingPoints: [
      { x: 0, description: 'Minimum point - slope is zero' },
      { x: 1, description: 'Slope is positive (increasing)' },
      { x: -1, description: 'Slope is negative (decreasing)' },
    ],
  },
  {
    id: 'cubic',
    name: 'Cubic',
    description: 'S-curve with an inflection point',
    fn: (x) => x * x * x,
    derivative: (x) => 3 * x * x,
    latex: 'f(x) = x^3',
    derivativeLatex: "f'(x) = 3x^2",
    domain: { min: -2, max: 2 },
    interestingPoints: [
      { x: 0, description: 'Inflection point - slope is zero but not an extremum' },
      { x: 1, description: 'Slope is 3' },
    ],
  },
  {
    id: 'polynomial',
    name: 'Polynomial',
    description: 'Curve with local min and max',
    fn: (x) => x * x * x - 3 * x,
    derivative: (x) => 3 * x * x - 3,
    latex: 'f(x) = x^3 - 3x',
    derivativeLatex: "f'(x) = 3x^2 - 3",
    domain: { min: -2.5, max: 2.5 },
    interestingPoints: [
      { x: 1, description: 'Local minimum - slope is zero' },
      { x: -1, description: 'Local maximum - slope is zero' },
      { x: 0, description: 'Inflection point' },
    ],
  },
  {
    id: 'sine',
    name: 'Sine',
    description: 'Oscillating - derivative is cosine',
    fn: (x) => Math.sin(x),
    derivative: (x) => Math.cos(x),
    latex: 'f(x) = \\sin(x)',
    derivativeLatex: "f'(x) = \\cos(x)",
    domain: { min: -2 * Math.PI, max: 2 * Math.PI },
    interestingPoints: [
      { x: 0, description: 'Slope is 1 (steepest upward)' },
      { x: Math.PI / 2, description: 'Maximum - slope is zero' },
      { x: Math.PI, description: 'Slope is -1 (steepest downward)' },
      { x: (3 * Math.PI) / 2, description: 'Minimum - slope is zero' },
    ],
  },
  {
    id: 'cosine',
    name: 'Cosine',
    description: 'Oscillating - derivative is negative sine',
    fn: (x) => Math.cos(x),
    derivative: (x) => -Math.sin(x),
    latex: 'f(x) = \\cos(x)',
    derivativeLatex: "f'(x) = -\\sin(x)",
    domain: { min: -2 * Math.PI, max: 2 * Math.PI },
    interestingPoints: [
      { x: 0, description: 'Maximum - slope is zero' },
      { x: Math.PI / 2, description: 'Slope is -1 (steepest downward)' },
      { x: Math.PI, description: 'Minimum - slope is zero' },
    ],
  },
  {
    id: 'exponential',
    name: 'Exponential',
    description: 'Special: e^x is its own derivative!',
    fn: (x) => Math.exp(x),
    derivative: (x) => Math.exp(x),
    latex: 'f(x) = e^x',
    derivativeLatex: "f'(x) = e^x",
    domain: { min: -2, max: 2 },
    interestingPoints: [
      { x: 0, description: 'f(0) = 1, f\'(0) = 1' },
      { x: 1, description: 'f(1) = e ≈ 2.718, f\'(1) = e' },
    ],
  },
  {
    id: 'logarithm',
    name: 'Logarithm',
    description: 'Derivative is 1/x - gets flatter as x increases',
    fn: (x) => Math.log(x),
    derivative: (x) => 1 / x,
    latex: 'f(x) = \\ln(x)',
    derivativeLatex: "f'(x) = \\frac{1}{x}",
    domain: { min: 0.1, max: 5 },
    interestingPoints: [
      { x: 1, description: 'f(1) = 0, slope is 1' },
      { x: 2, description: 'Slope is 0.5' },
      { x: 0.5, description: 'Slope is 2 (steeper near zero)' },
    ],
  },
]

/**
 * Get a preset by its ID.
 */
export function getDerivativePreset(id: string): DerivativeFunctionPreset | undefined {
  return DERIVATIVE_PRESETS.find((p) => p.id === id)
}

/**
 * Get all preset IDs.
 */
export function getDerivativePresetIds(): string[] {
  return DERIVATIVE_PRESETS.map((p) => p.id)
}
