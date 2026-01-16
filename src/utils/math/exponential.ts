/**
 * Exponential and logarithmic function utilities.
 * Includes growth/decay analysis and algorithm complexity comparisons.
 */

// ============================================================================
// Types
// ============================================================================

/** Parameters for exponential function f(x) = a * b^x */
export interface ExponentialParams {
  /** Base b in f(x) = a * b^x (must be positive, not 1) */
  base: number
  /** Coefficient a in f(x) = a * b^x (default 1) */
  coefficient: number
  /** Exponent x for single evaluation */
  exponent?: number
}

/** Parameters for logarithm log_b(x) */
export interface LogarithmParams {
  /** Base b in log_b(x) (must be positive, not 1) */
  base: number
  /** Value x in log_b(x) (must be positive) */
  value: number
}

/** Result of growth/decay analysis */
export interface GrowthDecayResult {
  /** Whether function represents growth or decay */
  type: 'growth' | 'decay'
  /** Time to double for growth (base > 1), null for decay */
  doublingTime: number | null
  /** Time to halve for decay (0 < base < 1), null for growth */
  halfLife: number | null
  /** Percent change per unit: (base - 1) * 100 */
  percentChangePerUnit: number
}

/** Parameters for compound interest calculation */
export interface CompoundInterestParams {
  /** Principal amount (P) */
  principal: number
  /** Annual interest rate as decimal (r), e.g., 0.05 for 5% */
  rate: number
  /** Number of times interest compounds per year (n) */
  compoundingsPerYear: number
  /** Time in years (t) */
  years: number
}

/** Result of compound interest calculation */
export interface CompoundInterestResult {
  /** Final amount: A = P(1 + r/n)^(nt) */
  finalAmount: number
  /** Total interest earned: A - P */
  totalInterest: number
  /** Effective annual rate: (1 + r/n)^n - 1 */
  effectiveRate: number
}

/** Algorithm complexity classes */
export type ComplexityClass =
  | 'constant'
  | 'logarithmic'
  | 'linear'
  | 'linearithmic'
  | 'quadratic'
  | 'exponential'

/** Result of comparing complexity classes at a given n */
export interface ComplexityComparison {
  /** Input size */
  n: number
  /** Operation counts for each complexity class */
  values: Record<ComplexityClass, number>
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Check if base is valid for exponential (positive, not 1).
 */
export function isValidExponentialBase(base: number): boolean {
  return base > 0 && base !== 1 && Number.isFinite(base)
}

/**
 * Check if value is valid for logarithm (positive).
 */
export function isValidLogarithmInput(value: number): boolean {
  return value > 0 && Number.isFinite(value)
}

/**
 * Validate exponential base, throws if invalid.
 * @throws Error if base is not valid
 */
function validateBase(base: number): void {
  if (!Number.isFinite(base)) {
    throw new Error('Base must be a finite number')
  }
  if (base <= 0) {
    throw new Error('Base must be positive')
  }
  if (base === 1) {
    throw new Error('Base cannot be 1 (would be constant function)')
  }
}

/**
 * Validate logarithm input value, throws if invalid.
 * @throws Error if value is not valid
 */
function validateLogarithmValue(value: number): void {
  if (!Number.isFinite(value)) {
    throw new Error('Logarithm input must be a finite number')
  }
  if (value <= 0) {
    throw new Error('Logarithm input must be positive')
  }
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Evaluate exponential function: f(x) = a * b^x
 *
 * @example
 * evaluateExponential(2, 3)       // 8 (2^3)
 * evaluateExponential(2, 3, 5)    // 40 (5 * 2^3)
 * evaluateExponential(Math.E, 1)  // e ≈ 2.718
 */
export function evaluateExponential(
  base: number,
  x: number,
  coefficient: number = 1
): number {
  validateBase(base)
  const result = coefficient * Math.pow(base, x)

  // Cap extremely large values to Infinity
  if (!Number.isFinite(result)) {
    return result > 0 ? Infinity : -Infinity
  }
  return result
}

/**
 * Evaluate logarithm: log_b(x)
 * Uses change of base formula: log_b(x) = ln(x) / ln(b)
 *
 * @example
 * evaluateLogarithm(10, 100)     // 2 (log₁₀(100))
 * evaluateLogarithm(2, 8)        // 3 (log₂(8))
 * evaluateLogarithm(Math.E, Math.E) // 1 (ln(e))
 */
export function evaluateLogarithm(base: number, value: number): number {
  validateBase(base)
  validateLogarithmValue(value)
  return Math.log(value) / Math.log(base)
}

// ============================================================================
// Growth/Decay Analysis
// ============================================================================

/**
 * Analyze growth/decay characteristics of exponential function.
 *
 * @example
 * analyzeGrowthDecay(2)    // { type: 'growth', doublingTime: 1, halfLife: null, percentChangePerUnit: 100 }
 * analyzeGrowthDecay(0.5)  // { type: 'decay', doublingTime: null, halfLife: 1, percentChangePerUnit: -50 }
 */
export function analyzeGrowthDecay(base: number): GrowthDecayResult {
  validateBase(base)

  const type: 'growth' | 'decay' = base > 1 ? 'growth' : 'decay'
  const percentChangePerUnit = (base - 1) * 100

  return {
    type,
    doublingTime: type === 'growth' ? calculateDoublingTime(base) : null,
    halfLife: type === 'decay' ? calculateHalfLife(base) : null,
    percentChangePerUnit,
  }
}

/**
 * Calculate doubling time for exponential growth.
 * t_double = ln(2) / ln(base)
 *
 * @returns Doubling time, or null if not growth (base <= 1)
 *
 * @example
 * calculateDoublingTime(2)      // 1 (doubles every unit)
 * calculateDoublingTime(Math.E) // ≈0.693
 * calculateDoublingTime(0.5)    // null (decay, not growth)
 */
export function calculateDoublingTime(base: number): number | null {
  validateBase(base)
  if (base <= 1) {
    return null
  }
  return Math.log(2) / Math.log(base)
}

/**
 * Calculate half-life for exponential decay.
 * t_half = ln(0.5) / ln(base) = -ln(2) / ln(base)
 *
 * @returns Half-life, or null if not decay (base >= 1)
 *
 * @example
 * calculateHalfLife(0.5)  // 1 (halves every unit)
 * calculateHalfLife(0.9)  // ≈6.58
 * calculateHalfLife(2)    // null (growth, not decay)
 */
export function calculateHalfLife(base: number): number | null {
  validateBase(base)
  if (base >= 1) {
    return null
  }
  // ln(0.5) / ln(base) = -ln(2) / ln(base)
  // For base < 1, ln(base) < 0, so result is positive
  return Math.log(0.5) / Math.log(base)
}

// ============================================================================
// Compound Interest
// ============================================================================

/**
 * Calculate compound interest.
 * A = P(1 + r/n)^(nt)
 *
 * @example
 * calculateCompoundInterest({ principal: 1000, rate: 0.05, compoundingsPerYear: 12, years: 10 })
 * // { finalAmount: ~1647.01, totalInterest: ~647.01, effectiveRate: ~0.0512 }
 */
export function calculateCompoundInterest(
  params: CompoundInterestParams
): CompoundInterestResult {
  const { principal, rate, compoundingsPerYear, years } = params

  if (principal < 0) {
    throw new Error('Principal must be non-negative')
  }
  if (compoundingsPerYear <= 0) {
    throw new Error('Compoundings per year must be positive')
  }
  if (years < 0) {
    throw new Error('Years must be non-negative')
  }

  const ratePerPeriod = rate / compoundingsPerYear
  const totalPeriods = compoundingsPerYear * years

  const finalAmount = principal * Math.pow(1 + ratePerPeriod, totalPeriods)
  const totalInterest = finalAmount - principal
  const effectiveRate = Math.pow(1 + ratePerPeriod, compoundingsPerYear) - 1

  return {
    finalAmount,
    totalInterest,
    effectiveRate,
  }
}

/**
 * Calculate continuous compound interest.
 * A = P * e^(rt)
 *
 * @example
 * calculateContinuousInterest(1000, 0.05, 10)  // ~1648.72
 */
export function calculateContinuousInterest(
  principal: number,
  rate: number,
  years: number
): number {
  if (principal < 0) {
    throw new Error('Principal must be non-negative')
  }
  if (years < 0) {
    throw new Error('Years must be non-negative')
  }

  return principal * Math.exp(rate * years)
}

// ============================================================================
// Algorithm Complexity
// ============================================================================

/** Complexity class calculation functions */
export const complexityFunctions: Record<ComplexityClass, (n: number) => number> = {
  constant: () => 1,
  logarithmic: (n) => (n <= 0 ? 0 : Math.log2(n)),
  linear: (n) => n,
  linearithmic: (n) => (n <= 0 ? 0 : n * Math.log2(n)),
  quadratic: (n) => n * n,
  exponential: (n) => Math.pow(2, n),
}

/** Display labels for complexity classes */
export const complexityLabels: Record<ComplexityClass, string> = {
  constant: 'O(1)',
  logarithmic: 'O(log n)',
  linear: 'O(n)',
  linearithmic: 'O(n log n)',
  quadratic: 'O(n²)',
  exponential: 'O(2^n)',
}

/** Colors for complexity visualization */
export const complexityColors: Record<ComplexityClass, string> = {
  constant: '#22c55e', // green-500
  logarithmic: '#3b82f6', // blue-500
  linear: '#f59e0b', // amber-500
  linearithmic: '#8b5cf6', // violet-500
  quadratic: '#ef4444', // red-500
  exponential: '#dc2626', // red-600
}

/** Example algorithms for each complexity class */
export const complexityExamples: Record<ComplexityClass, string[]> = {
  constant: ['Array access', 'Hash lookup', 'Stack push/pop'],
  logarithmic: ['Binary search', 'Balanced tree ops', 'Binary lifting'],
  linear: ['Linear search', 'Single loop', 'Array traversal'],
  linearithmic: ['Merge sort', 'Heap sort', 'Quick sort (avg)'],
  quadratic: ['Nested loops', 'Bubble sort', 'Selection sort'],
  exponential: ['Brute force', 'Power set', 'Traveling salesman'],
}

/**
 * Compare algorithm complexities for given input size n.
 *
 * @example
 * compareComplexities(10)
 * // { n: 10, values: { constant: 1, logarithmic: 3.32, linear: 10, linearithmic: 33.2, quadratic: 100, exponential: 1024 } }
 */
export function compareComplexities(n: number): ComplexityComparison {
  if (n < 1) {
    throw new Error('Input size n must be at least 1')
  }

  const values = {} as Record<ComplexityClass, number>
  for (const [key, fn] of Object.entries(complexityFunctions)) {
    values[key as ComplexityClass] = fn(n)
  }

  return { n, values }
}

// ============================================================================
// Point Generation for Plotting
// ============================================================================

/**
 * Generate points for plotting exponential function y = a * b^x
 *
 * @example
 * generateExponentialPoints(2, -2, 4)
 * // [{ x: -2, y: 0.25 }, { x: -1.94, y: 0.26 }, ..., { x: 4, y: 16 }]
 */
export function generateExponentialPoints(
  base: number,
  xMin: number,
  xMax: number,
  coefficient: number = 1,
  samples: number = 100
): Array<{ x: number; y: number }> {
  validateBase(base)

  const points: Array<{ x: number; y: number }> = []
  const step = (xMax - xMin) / samples

  for (let i = 0; i <= samples; i++) {
    const x = xMin + i * step
    const y = evaluateExponential(base, x, coefficient)

    // Skip infinite values for plotting
    if (Number.isFinite(y)) {
      points.push({ x, y })
    }
  }

  return points
}

/**
 * Generate points for plotting logarithmic function y = log_b(x)
 * Only generates points for x > 0
 *
 * @example
 * generateLogarithmPoints(2, 0.1, 10)
 * // [{ x: 0.1, y: -3.32 }, ..., { x: 10, y: 3.32 }]
 */
export function generateLogarithmPoints(
  base: number,
  xMin: number,
  xMax: number,
  samples: number = 100
): Array<{ x: number; y: number }> {
  validateBase(base)

  // Ensure xMin is positive for logarithm
  const effectiveXMin = Math.max(xMin, 0.001)

  const points: Array<{ x: number; y: number }> = []
  const step = (xMax - effectiveXMin) / samples

  for (let i = 0; i <= samples; i++) {
    const x = effectiveXMin + i * step
    if (x > 0) {
      const y = evaluateLogarithm(base, x)
      if (Number.isFinite(y)) {
        points.push({ x, y })
      }
    }
  }

  return points
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format a number for display, avoiding unnecessary decimals.
 * Handles special cases like very large numbers and scientific notation.
 */
export function formatExponentialNumber(
  value: number,
  precision: number = 4
): string {
  if (!Number.isFinite(value)) {
    return value > 0 ? '∞' : '-∞'
  }

  // Very large numbers: use scientific notation
  if (Math.abs(value) >= 1e9) {
    return value.toExponential(2)
  }

  // Check if it's effectively an integer
  if (Math.abs(value - Math.round(value)) < 1e-10) {
    return Math.round(value).toLocaleString()
  }

  // Otherwise format with precision
  return parseFloat(value.toPrecision(precision)).toLocaleString()
}

/**
 * Get a human-readable description of a complexity class.
 */
export function getComplexityDescription(complexity: ComplexityClass): string {
  const descriptions: Record<ComplexityClass, string> = {
    constant: 'Constant time - same speed regardless of input size',
    logarithmic: 'Logarithmic time - grows slowly as input grows',
    linear: 'Linear time - grows proportionally with input',
    linearithmic: 'Linearithmic time - slightly more than linear',
    quadratic: 'Quadratic time - grows with the square of input',
    exponential: 'Exponential time - doubles with each additional input',
  }
  return descriptions[complexity]
}
