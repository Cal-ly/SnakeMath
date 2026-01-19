/**
 * Integration utilities for Phase 21: Calculus — Integration
 *
 * Provides numerical integration via Riemann sums (left, right, midpoint,
 * trapezoidal, Simpson's) and preset functions for the IntegrationExplorer widget.
 *
 * D-122: Preset-based functions only (no arbitrary user input)
 * D-123: Include Simpson's rule in core scope
 * D-126: Focus on geometric interpretation over symbolic rules
 */

import type {
  RiemannMethod,
  RiemannSumResult,
  RiemannSamplePoint,
  IntegrationResult,
  IntegrationFunctionPreset,
} from '@/types/math'

// ============================================================================
// Constants
// ============================================================================

/** Default number of subdivisions */
export const DEFAULT_N = 10

/** Maximum allowed subdivisions (performance limit) */
export const MAX_N = 200

/** Minimum subdivisions */
export const MIN_N = 1

/** Default Riemann method */
export const DEFAULT_METHOD: RiemannMethod = 'midpoint'

/** Default preset function */
export const DEFAULT_PRESET = 'quadratic'

/** Tolerance for floating point comparisons */
export const INTEGRATION_TOLERANCE = 1e-10

// ============================================================================
// Core Riemann Sum Functions
// ============================================================================

/**
 * Compute a Riemann sum using the specified method.
 *
 * @param fn - The function to integrate
 * @param a - Lower bound
 * @param b - Upper bound
 * @param n - Number of subdivisions (must be >= 1)
 * @param method - Which Riemann sum method to use
 * @returns RiemannSumResult with approximation and visualization data
 */
export function riemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
  method: RiemannMethod
): RiemannSumResult {
  // Validate inputs
  if (n < MIN_N) {
    n = MIN_N
  }
  if (n > MAX_N) {
    n = MAX_N
  }
  n = Math.floor(n)

  // Handle edge case where a === b
  if (Math.abs(b - a) < INTEGRATION_TOLERANCE) {
    return {
      approximation: 0,
      areas: [],
      samplePoints: [],
      n,
      deltaX: 0,
    }
  }

  // Dispatch to specific method
  switch (method) {
    case 'left':
      return leftRiemannSum(fn, a, b, n)
    case 'right':
      return rightRiemannSum(fn, a, b, n)
    case 'midpoint':
      return midpointRiemannSum(fn, a, b, n)
    case 'trapezoidal':
      return trapezoidalSum(fn, a, b, n)
    case 'simpson':
      return simpsonsRule(fn, a, b, n)
    default:
      return midpointRiemannSum(fn, a, b, n)
  }
}

/**
 * Left Riemann sum: Σ f(xᵢ) · Δx
 * Uses the left endpoint of each subinterval.
 */
export function leftRiemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number
): RiemannSumResult {
  const deltaX = (b - a) / n
  const areas: number[] = []
  const samplePoints: RiemannSamplePoint[] = []
  let approximation = 0

  for (let i = 0; i < n; i++) {
    const leftX = a + i * deltaX
    const x = leftX // sample at left endpoint
    const y = fn(x)
    const area = y * deltaX

    areas.push(area)
    samplePoints.push({
      x,
      y,
      leftX,
      width: deltaX,
    })
    approximation += area
  }

  return { approximation, areas, samplePoints, n, deltaX }
}

/**
 * Right Riemann sum: Σ f(xᵢ₊₁) · Δx
 * Uses the right endpoint of each subinterval.
 */
export function rightRiemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number
): RiemannSumResult {
  const deltaX = (b - a) / n
  const areas: number[] = []
  const samplePoints: RiemannSamplePoint[] = []
  let approximation = 0

  for (let i = 0; i < n; i++) {
    const leftX = a + i * deltaX
    const x = leftX + deltaX // sample at right endpoint
    const y = fn(x)
    const area = y * deltaX

    areas.push(area)
    samplePoints.push({
      x,
      y,
      leftX,
      width: deltaX,
    })
    approximation += area
  }

  return { approximation, areas, samplePoints, n, deltaX }
}

/**
 * Midpoint Riemann sum: Σ f((xᵢ + xᵢ₊₁)/2) · Δx
 * Uses the midpoint of each subinterval. O(1/n²) convergence.
 */
export function midpointRiemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number
): RiemannSumResult {
  const deltaX = (b - a) / n
  const areas: number[] = []
  const samplePoints: RiemannSamplePoint[] = []
  let approximation = 0

  for (let i = 0; i < n; i++) {
    const leftX = a + i * deltaX
    const x = leftX + deltaX / 2 // sample at midpoint
    const y = fn(x)
    const area = y * deltaX

    areas.push(area)
    samplePoints.push({
      x,
      y,
      leftX,
      width: deltaX,
    })
    approximation += area
  }

  return { approximation, areas, samplePoints, n, deltaX }
}

/**
 * Trapezoidal rule: (Δx/2) · Σ(f(xᵢ) + f(xᵢ₊₁))
 * Uses trapezoids instead of rectangles. O(1/n²) convergence.
 */
export function trapezoidalSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number
): RiemannSumResult {
  const deltaX = (b - a) / n
  const areas: number[] = []
  const samplePoints: RiemannSamplePoint[] = []
  let approximation = 0

  for (let i = 0; i < n; i++) {
    const leftX = a + i * deltaX
    const rightX = leftX + deltaX
    const leftY = fn(leftX)
    const rightY = fn(rightX)
    // Trapezoid area: (1/2)(h1 + h2) * base
    const area = ((leftY + rightY) / 2) * deltaX

    areas.push(area)
    samplePoints.push({
      x: leftX, // sample point is left edge for visualization
      y: leftY,
      leftX,
      width: deltaX,
      rightY, // include right y for trapezoid drawing
    })
    approximation += area
  }

  return { approximation, areas, samplePoints, n, deltaX }
}

/**
 * Simpson's rule: (Δx/3) · [f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) + ... + f(xₙ)]
 * Uses parabolic approximation. O(1/n⁴) convergence.
 * Requires even n; if odd, n is incremented by 1.
 */
export function simpsonsRule(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number
): RiemannSumResult {
  // Simpson's rule requires even n
  if (n % 2 !== 0) {
    n = n + 1
  }

  const deltaX = (b - a) / n
  const areas: number[] = []
  const samplePoints: RiemannSamplePoint[] = []

  // Build coefficient array: 1, 4, 2, 4, 2, ..., 4, 1
  let approximation = 0

  for (let i = 0; i <= n; i++) {
    const x = a + i * deltaX
    const y = fn(x)

    let coefficient: number
    if (i === 0 || i === n) {
      coefficient = 1
    } else if (i % 2 === 1) {
      coefficient = 4
    } else {
      coefficient = 2
    }

    approximation += coefficient * y

    // For visualization, store sample points (every point, not just rectangles)
    if (i < n) {
      const leftX = a + i * deltaX
      // Simpson's doesn't have simple rectangle areas, so store midpoint-style
      const midY = fn(leftX + deltaX / 2)
      areas.push(midY * deltaX) // Approximate area for display
      samplePoints.push({
        x: leftX + deltaX / 2,
        y: midY,
        leftX,
        width: deltaX,
      })
    }
  }

  approximation *= deltaX / 3

  return { approximation, areas, samplePoints, n, deltaX }
}

// ============================================================================
// Integration Evaluation
// ============================================================================

/**
 * Evaluate a definite integral and compute error if exact value is known.
 *
 * @param fn - Function to integrate
 * @param a - Lower bound
 * @param b - Upper bound
 * @param n - Number of subdivisions
 * @param method - Riemann sum method
 * @param exactIntegral - Optional function to compute exact integral
 * @returns IntegrationResult with approximation and error analysis
 */
export function evaluateIntegration(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
  method: RiemannMethod,
  exactIntegral?: (a: number, b: number) => number
): IntegrationResult {
  const result = riemannSum(fn, a, b, n, method)

  const integrationResult: IntegrationResult = {
    approximation: result.approximation,
    method,
    n: result.n,
  }

  if (exactIntegral) {
    const exactValue = exactIntegral(a, b)
    integrationResult.exactValue = exactValue
    integrationResult.absoluteError = Math.abs(result.approximation - exactValue)

    if (Math.abs(exactValue) > INTEGRATION_TOLERANCE) {
      integrationResult.relativeError = integrationResult.absoluteError / Math.abs(exactValue)
    } else {
      integrationResult.relativeError = integrationResult.absoluteError
    }
  }

  return integrationResult
}

/**
 * Compute the exact integral using the Fundamental Theorem of Calculus.
 * F(b) - F(a) where F is the antiderivative.
 */
export function computeExactIntegral(
  antiderivative: (x: number) => number,
  a: number,
  b: number
): number {
  return antiderivative(b) - antiderivative(a)
}

// ============================================================================
// Preset Functions
// ============================================================================

/**
 * Preset functions for the IntegrationExplorer widget.
 * Each preset includes the function, its antiderivative, and default bounds.
 */
export const INTEGRATION_PRESETS: IntegrationFunctionPreset[] = [
  {
    id: 'linear',
    name: 'Linear',
    description: 'Simplest case — area of a trapezoid',
    fn: (x) => 2 * x + 1,
    antiderivative: (x) => x * x + x,
    latex: 'f(x) = 2x + 1',
    antiderivativeLatex: 'F(x) = x^2 + x',
    defaultBounds: { a: 0, b: 3 },
    viewDomain: { min: -1, max: 4 },
    exactValueDisplay: '12',
    interestingPoints: [
      { x: 0, description: 'Lower bound: f(0) = 1' },
      { x: 3, description: 'Upper bound: f(3) = 7' },
    ],
  },
  {
    id: 'quadratic',
    name: 'Quadratic',
    description: 'Classic parabola — basic polynomial integration',
    fn: (x) => x * x,
    antiderivative: (x) => (x * x * x) / 3,
    latex: 'f(x) = x^2',
    antiderivativeLatex: 'F(x) = \\frac{x^3}{3}',
    defaultBounds: { a: 0, b: 2 },
    viewDomain: { min: -0.5, max: 2.5 },
    exactValueDisplay: '8/3 ≈ 2.667',
    interestingPoints: [
      { x: 0, description: 'Minimum of parabola' },
      { x: 1, description: 'f(1) = 1' },
      { x: 2, description: 'Upper bound: f(2) = 4' },
    ],
  },
  {
    id: 'sine',
    name: 'Sine',
    description: 'Trigonometric function — nice exact value',
    fn: (x) => Math.sin(x),
    antiderivative: (x) => -Math.cos(x),
    latex: 'f(x) = \\sin(x)',
    antiderivativeLatex: 'F(x) = -\\cos(x)',
    defaultBounds: { a: 0, b: Math.PI },
    viewDomain: { min: -0.5, max: Math.PI + 0.5 },
    exactValueDisplay: '2',
    interestingPoints: [
      { x: 0, description: 'sin(0) = 0' },
      { x: Math.PI / 2, description: 'Maximum: sin(π/2) = 1' },
      { x: Math.PI, description: 'sin(π) = 0' },
    ],
  },
  {
    id: 'exponential',
    name: 'Exponential',
    description: 'e^x is its own antiderivative!',
    fn: (x) => Math.exp(x),
    antiderivative: (x) => Math.exp(x),
    latex: 'f(x) = e^x',
    antiderivativeLatex: 'F(x) = e^x',
    defaultBounds: { a: 0, b: 1 },
    viewDomain: { min: -0.5, max: 1.5 },
    exactValueDisplay: 'e - 1 ≈ 1.718',
    interestingPoints: [
      { x: 0, description: 'e⁰ = 1' },
      { x: 1, description: 'e¹ ≈ 2.718' },
    ],
  },
  {
    id: 'reciprocal',
    name: 'Reciprocal',
    description: 'Integral is natural logarithm',
    fn: (x) => 1 / x,
    antiderivative: (x) => Math.log(x),
    latex: 'f(x) = \\frac{1}{x}',
    antiderivativeLatex: 'F(x) = \\ln(x)',
    defaultBounds: { a: 1, b: Math.E },
    viewDomain: { min: 0.5, max: Math.E + 0.5 },
    exactValueDisplay: '1',
    interestingPoints: [
      { x: 1, description: 'f(1) = 1, ln(1) = 0' },
      { x: Math.E, description: 'f(e) ≈ 0.368, ln(e) = 1' },
    ],
  },
  {
    id: 'cubic-signed',
    name: 'Cubic (signed area)',
    description: 'Shows positive and negative area regions',
    fn: (x) => x * x * x - x,
    antiderivative: (x) => (x * x * x * x) / 4 - (x * x) / 2,
    latex: 'f(x) = x^3 - x',
    antiderivativeLatex: 'F(x) = \\frac{x^4}{4} - \\frac{x^2}{2}',
    defaultBounds: { a: -1, b: 2 },
    viewDomain: { min: -1.5, max: 2.5 },
    exactValueDisplay: '2.25',
    interestingPoints: [
      { x: -1, description: 'f(-1) = 0, root' },
      { x: 0, description: 'f(0) = 0, root' },
      { x: 1, description: 'f(1) = 0, root' },
      { x: 2, description: 'f(2) = 6' },
    ],
  },
  {
    id: 'semicircle',
    name: 'Semicircle',
    description: 'Geometric area = πr²/2',
    fn: (x) => Math.sqrt(1 - x * x),
    antiderivative: (x) => (x * Math.sqrt(1 - x * x) + Math.asin(x)) / 2,
    latex: 'f(x) = \\sqrt{1 - x^2}',
    antiderivativeLatex: 'F(x) = \\frac{1}{2}(x\\sqrt{1-x^2} + \\arcsin(x))',
    defaultBounds: { a: -1, b: 1 },
    viewDomain: { min: -1.5, max: 1.5 },
    exactValueDisplay: 'π/2 ≈ 1.571',
    interestingPoints: [
      { x: -1, description: 'Left edge of semicircle' },
      { x: 0, description: 'Maximum: f(0) = 1' },
      { x: 1, description: 'Right edge of semicircle' },
    ],
  },
  {
    id: 'constant',
    name: 'Constant',
    description: 'Trivial case — just a rectangle',
    fn: () => 3,
    antiderivative: (x) => 3 * x,
    latex: 'f(x) = 3',
    antiderivativeLatex: 'F(x) = 3x',
    defaultBounds: { a: 0, b: 4 },
    viewDomain: { min: -1, max: 5 },
    exactValueDisplay: '12',
    interestingPoints: [{ x: 2, description: 'Constant height = 3' }],
  },
]

/**
 * Get a preset by its ID.
 */
export function getIntegrationPreset(id: string): IntegrationFunctionPreset | undefined {
  return INTEGRATION_PRESETS.find((p) => p.id === id)
}

/**
 * Get all preset IDs.
 */
export function getIntegrationPresetIds(): string[] {
  return INTEGRATION_PRESETS.map((p) => p.id)
}

/**
 * Compute exact integral for a preset given bounds.
 */
export function computePresetExactIntegral(presetId: string, a: number, b: number): number | null {
  const preset = getIntegrationPreset(presetId)
  if (!preset) return null
  return computeExactIntegral(preset.antiderivative, a, b)
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Clamp n to valid range.
 */
export function clampN(n: number): number {
  return Math.max(MIN_N, Math.min(MAX_N, Math.floor(n)))
}

/**
 * Validate integration bounds.
 * Returns true if bounds are valid (a < b and both finite).
 */
export function validateBounds(a: number, b: number): boolean {
  return isFinite(a) && isFinite(b) && a < b
}

/**
 * Check if a value is effectively zero (within tolerance).
 */
export function isEffectivelyZero(value: number): boolean {
  return Math.abs(value) < INTEGRATION_TOLERANCE
}
