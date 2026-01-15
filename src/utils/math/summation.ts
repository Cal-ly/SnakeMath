/**
 * Summation math utilities
 *
 * Core functions for evaluating summations and comparing loop vs formula approaches.
 * These utilities support the thesis that "sigma notation is just a for loop."
 */

import type { SummationResult, FormulaComparison, SummationPresetId } from '@/types/math'

/**
 * Evaluate a summation by iterating from start to end (inclusive).
 * This is the "for loop" approach to computing a sum.
 *
 * @param expression - Function that computes the term value for each index
 * @param start - Starting index (inclusive)
 * @param end - Ending index (inclusive)
 * @returns Result containing total, individual terms, and term count
 *
 * @example
 * // Sum of 1 to 5: 1 + 2 + 3 + 4 + 5 = 15
 * evaluateSummation(i => i, 1, 5)
 * // => { total: 15, terms: [1, 2, 3, 4, 5], termCount: 5 }
 */
export function evaluateSummation(
  expression: (i: number) => number,
  start: number,
  end: number,
): SummationResult {
  // Handle edge case where start > end (empty sum)
  if (start > end) {
    return {
      total: 0,
      terms: [],
      termCount: 0,
    }
  }

  const terms: number[] = []
  let total = 0

  // The for loop that mirrors sigma notation
  for (let i = start; i <= end; i++) {
    const term = expression(i)
    terms.push(term)
    total += term
  }

  return {
    total,
    terms,
    termCount: terms.length,
  }
}

/**
 * Closed-form formula for sum of first n natural numbers: 1 + 2 + 3 + ... + n
 * Also known as Gauss's formula or triangular numbers.
 *
 * Formula: n(n+1)/2
 *
 * @param n - Upper bound (must be >= 0)
 * @returns Sum of 1 to n
 *
 * @example
 * sumArithmetic(100) // => 5050 (Gauss's famous problem)
 * sumArithmetic(10)  // => 55
 */
export function sumArithmetic(n: number): number {
  if (n <= 0) return 0
  return (n * (n + 1)) / 2
}

/**
 * Closed-form formula for sum of squares: 1² + 2² + 3² + ... + n²
 *
 * Formula: n(n+1)(2n+1)/6
 *
 * @param n - Upper bound (must be >= 0)
 * @returns Sum of squares from 1 to n
 *
 * @example
 * sumSquares(5)  // => 55 (1 + 4 + 9 + 16 + 25)
 * sumSquares(10) // => 385
 */
export function sumSquares(n: number): number {
  if (n <= 0) return 0
  return (n * (n + 1) * (2 * n + 1)) / 6
}

/**
 * Closed-form formula for sum of cubes: 1³ + 2³ + 3³ + ... + n³
 *
 * Formula: [n(n+1)/2]²
 *
 * Fun fact: The sum of cubes equals the square of the sum of natural numbers!
 * This is known as Nicomachus's theorem.
 *
 * @param n - Upper bound (must be >= 0)
 * @returns Sum of cubes from 1 to n
 *
 * @example
 * sumCubes(5)  // => 225 (1 + 8 + 27 + 64 + 125)
 * sumCubes(10) // => 3025
 */
export function sumCubes(n: number): number {
  if (n <= 0) return 0
  const arithmetic = sumArithmetic(n)
  return arithmetic * arithmetic
}

/**
 * Closed-form formula for geometric series: r⁰ + r¹ + r² + ... + rⁿ
 *
 * Formula: (r^(n+1) - 1) / (r - 1) for r ≠ 1
 * For r = 1: returns n + 1 (sum of 1s)
 *
 * @param r - Common ratio
 * @param n - Number of terms minus 1 (exponent of last term)
 * @returns Sum of geometric series
 *
 * @example
 * sumGeometric(2, 4) // => 31 (1 + 2 + 4 + 8 + 16)
 * sumGeometric(3, 3) // => 40 (1 + 3 + 9 + 27)
 */
export function sumGeometric(r: number, n: number): number {
  if (n < 0) return 0
  if (r === 1) return n + 1 // Special case: sum of (n+1) ones
  return (Math.pow(r, n + 1) - 1) / (r - 1)
}

/**
 * Get the expression function for a preset.
 *
 * @param presetId - The preset identifier
 * @returns Function that computes term value for index i
 */
export function getPresetExpression(presetId: SummationPresetId): (i: number) => number {
  switch (presetId) {
    case 'arithmetic':
      return (i: number) => i
    case 'squares':
      return (i: number) => i * i
    case 'cubes':
      return (i: number) => i * i * i
    case 'geometric':
      return (i: number) => Math.pow(2, i - 1)
    case 'constant':
      return () => 1
  }
}

/**
 * Get the closed-form formula function for a preset.
 * Returns null if no closed-form formula is available.
 *
 * @param presetId - The preset identifier
 * @returns Function that computes sum directly, or null
 */
export function getPresetClosedForm(
  presetId: SummationPresetId,
): ((n: number) => number) | null {
  switch (presetId) {
    case 'arithmetic':
      return sumArithmetic
    case 'squares':
      return sumSquares
    case 'cubes':
      return sumCubes
    case 'geometric':
      // For geometric with r=2 starting from i=1: sum of 2^(i-1) from 1 to n
      // = 2^0 + 2^1 + ... + 2^(n-1) = 2^n - 1
      return (n: number) => Math.pow(2, n) - 1
    case 'constant':
      // Sum of n ones = n
      return (n: number) => n
  }
}

/**
 * Compare loop evaluation vs closed-form formula.
 * Demonstrates O(n) vs O(1) complexity while verifying correctness.
 *
 * @param presetId - The preset identifier
 * @param n - Number of terms (end index when starting from 1)
 * @returns Comparison object with both results and match status
 *
 * @example
 * compareLoopVsFormula('arithmetic', 100)
 * // => { loopResult: 5050, formulaResult: 5050, match: true, iterations: 100 }
 */
export function compareLoopVsFormula(presetId: SummationPresetId, n: number): FormulaComparison {
  const expression = getPresetExpression(presetId)
  const closedForm = getPresetClosedForm(presetId)

  // Loop evaluation (O(n))
  const loopResult = evaluateSummation(expression, 1, n)

  // Formula evaluation (O(1))
  const formulaResult = closedForm ? closedForm(n) : loopResult.total

  // Check if they match (with small tolerance for floating point)
  const match = Math.abs(loopResult.total - formulaResult) < 0.0001

  return {
    loopResult: loopResult.total,
    formulaResult,
    match,
    iterations: loopResult.termCount,
  }
}
