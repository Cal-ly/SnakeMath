# Increment 21A: Math Utilities & Types

**Parent Plan**: [PHASE_21_PLAN.md](./PHASE_21_PLAN.md)
**Focus**: Core integration math utilities and comprehensive test suite

---

## Overview

This increment establishes the mathematical foundation for the IntegrationExplorer widget. It implements all Riemann sum methods, preset functions with known antiderivatives, and a thorough test suite ensuring numerical accuracy.

---

## Tasks

### Task 1: Extend Type Definitions

**File**: `src/types/math.ts`

Add the following types at the end of the file (after the Derivative Types section):

```ts
// ============================================================================
// Integration Types (Phase 21)
// ============================================================================

/**
 * Available Riemann sum methods for numerical integration
 */
export type RiemannMethod = 'left' | 'right' | 'midpoint' | 'trapezoidal' | 'simpson'

/**
 * Result of computing a Riemann sum
 */
export interface RiemannSumResult {
  /** Computed approximation of the integral */
  approximation: number
  /** Individual rectangle/trapezoid areas (signed) */
  areas: number[]
  /** Sample points used for evaluation, with height and width for visualization */
  samplePoints: RiemannSamplePoint[]
  /** Total number of subdivisions */
  n: number
  /** Width of each subdivision: (b - a) / n */
  deltaX: number
}

/**
 * A sample point in the Riemann sum, used for visualization
 */
export interface RiemannSamplePoint {
  /** X coordinate where function is sampled */
  x: number
  /** Y value: f(x) at sample point */
  y: number
  /** Left edge of the rectangle/trapezoid */
  leftX: number
  /** Width of this subdivision */
  width: number
  /** For trapezoidal: y value at right edge */
  rightY?: number
}

/**
 * Result of evaluating an integral with error analysis
 */
export interface IntegrationResult {
  /** Numerical approximation */
  approximation: number
  /** Exact value if known from antiderivative */
  exactValue?: number
  /** Absolute error: |approximation - exactValue| */
  absoluteError?: number
  /** Relative error: |approximation - exactValue| / |exactValue| */
  relativeError?: number
  /** Method used for computation */
  method: RiemannMethod
  /** Number of subdivisions */
  n: number
}

/**
 * A preset function for the IntegrationExplorer widget
 * D-122: Use preset functions only (no arbitrary input)
 */
export interface IntegrationFunctionPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Educational description */
  description: string
  /** The function f(x) to integrate */
  fn: (x: number) => number
  /** The antiderivative F(x) where F'(x) = f(x) */
  antiderivative: (x: number) => number
  /** LaTeX representation of f(x) */
  latex: string
  /** LaTeX representation of F(x) */
  antiderivativeLatex: string
  /** Default integration bounds */
  defaultBounds: { a: number; b: number }
  /** Recommended viewing domain for visualization */
  viewDomain: { min: number; max: number }
  /** Known exact integral value for default bounds (for display) */
  exactValueDisplay: string
  /** Points of interest for exploration */
  interestingPoints?: IntegrationInterestingPoint[]
}

/**
 * A point of interest for integration exploration
 */
export interface IntegrationInterestingPoint {
  /** X coordinate */
  x: number
  /** Description of what's notable here */
  description: string
}
```

---

### Task 2: Create Integration Utilities Module

**File**: `src/utils/math/integration.ts` (new)

```ts
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
```

---

### Task 3: Create Comprehensive Test Suite

**File**: `src/utils/math/integration.test.ts` (new)

```ts
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
    const result = riemannSum(identity, 0, 1, 10, 'unknown' as any)
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
```

---

## File Checklist

| File | Action | Status |
|------|--------|--------|
| `src/types/math.ts` | Extend with integration types | ⬜ |
| `src/utils/math/integration.ts` | Create new | ⬜ |
| `src/utils/math/integration.test.ts` | Create new | ⬜ |

---

## Success Criteria

- [ ] All types compile without errors (`npm run type-check`)
- [ ] All 70+ tests pass (`npm run test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Each Riemann method produces mathematically correct results
- [ ] Preset exact integrals match known values within tolerance
- [ ] Simpson's rule correctly handles odd n by adjusting to even
- [ ] Signed area (negative contributions) computed correctly

---

## Testing Commands

```bash
# Run only integration tests
npm run test -- integration

# Run with coverage
npm run test -- integration --coverage

# Type check
npm run type-check
```

---

## Notes

- The `RiemannSamplePoint` type includes all data needed for SVG visualization in Increment 21C
- Simpson's rule visualization uses midpoint-style rectangles since parabolic segments are complex to render
- Preset antiderivatives are manually verified against known mathematical results
- The test suite covers convergence rates to ensure methods behave as expected theoretically
