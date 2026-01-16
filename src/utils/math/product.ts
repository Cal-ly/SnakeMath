/**
 * Product notation math utilities
 *
 * Core functions for evaluating products (Π notation) and common product formulas.
 * These utilities support the thesis that "product notation is just a for loop with multiplication."
 */

import type { ProductResult, ProductPresetId } from '@/types/math'

/**
 * Evaluate a product by iterating from start to end (inclusive).
 * This is the "for loop" approach to computing a product.
 *
 * @param expression - Function that computes the factor value for each index
 * @param start - Starting index (inclusive)
 * @param end - Ending index (inclusive)
 * @returns Result containing product, individual factors, and factor count
 *
 * @example
 * // Product of 1 to 5: 1 × 2 × 3 × 4 × 5 = 120 (factorial)
 * evaluateProduct(i => i, 1, 5)
 * // => { product: 120, factors: [1, 2, 3, 4, 5], factorCount: 5 }
 */
export function evaluateProduct(
  expression: (i: number) => number,
  start: number,
  end: number,
): ProductResult {
  // Handle edge case where start > end (empty product = 1)
  if (start > end) {
    return {
      product: 1,
      factors: [],
      factorCount: 0,
    }
  }

  const factors: number[] = []
  let product = 1

  // The for loop that mirrors product notation
  for (let i = start; i <= end; i++) {
    const factor = expression(i)
    factors.push(factor)
    product *= factor
  }

  return {
    product,
    factors,
    factorCount: factors.length,
  }
}

/**
 * Calculate factorial: n! = 1 × 2 × 3 × ... × n
 *
 * @param n - The number (must be >= 0)
 * @returns n!
 *
 * @example
 * factorial(5)  // => 120
 * factorial(0)  // => 1 (by definition)
 * factorial(10) // => 3628800
 */
export function factorial(n: number): number {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1

  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

/**
 * Calculate permutations: P(n,r) = n! / (n-r)!
 * Number of ways to arrange r items from n items (order matters)
 *
 * @param n - Total number of items
 * @param r - Number of items to arrange
 * @returns P(n,r)
 *
 * @example
 * permutations(5, 3) // => 60 (ways to arrange 3 items from 5)
 * permutations(4, 4) // => 24 (same as 4!)
 */
export function permutations(n: number, r: number): number {
  if (r > n || r < 0 || n < 0) return 0
  if (r === 0) return 1

  // P(n,r) = n × (n-1) × ... × (n-r+1)
  let result = 1
  for (let i = n; i > n - r; i--) {
    result *= i
  }
  return result
}

/**
 * Calculate combinations: C(n,r) = n! / (r! × (n-r)!)
 * Number of ways to choose r items from n items (order doesn't matter)
 *
 * @param n - Total number of items
 * @param r - Number of items to choose
 * @returns C(n,r)
 *
 * @example
 * combinations(5, 3) // => 10 (ways to choose 3 from 5)
 * combinations(4, 2) // => 6
 */
export function combinations(n: number, r: number): number {
  if (r > n || r < 0 || n < 0) return 0
  if (r === 0 || r === n) return 1

  // Optimize: C(n,r) = C(n, n-r), use smaller r
  const k = Math.min(r, n - r)

  // C(n,r) = (n × (n-1) × ... × (n-k+1)) / (k!)
  let result = 1
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1)
  }
  return Math.round(result) // Handle floating point
}

/**
 * Calculate double factorial: n!!
 * Product of all integers from n down to 1 with same parity as n
 *
 * @param n - The number (must be >= 0)
 * @returns n!!
 *
 * @example
 * doubleFactorial(7) // => 105 (7 × 5 × 3 × 1)
 * doubleFactorial(6) // => 48 (6 × 4 × 2)
 */
export function doubleFactorial(n: number): number {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1

  let result = 1
  for (let i = n; i > 0; i -= 2) {
    result *= i
  }
  return result
}

/**
 * Get the expression function for a preset.
 *
 * @param presetId - The preset identifier
 * @returns Function that computes factor value for index i
 */
export function getProductPresetExpression(presetId: ProductPresetId): (i: number) => number {
  switch (presetId) {
    case 'factorial':
      return (i: number) => i
    case 'evenNumbers':
      return (i: number) => 2 * i
    case 'oddNumbers':
      return (i: number) => 2 * i - 1
    case 'powers':
      return (i: number) => Math.pow(2, i)
    case 'fractions':
      // For consecutive fractions: (1/2) × (2/3) × (3/4) × ... = 1/n
      return (i: number) => i / (i + 1)
  }
}

/**
 * Get the LaTeX formula for a preset.
 *
 * @param presetId - The preset identifier
 * @returns LaTeX string for the formula
 */
export function getProductPresetLatex(presetId: ProductPresetId): string {
  switch (presetId) {
    case 'factorial':
      return 'i'
    case 'evenNumbers':
      return '2i'
    case 'oddNumbers':
      return '(2i - 1)'
    case 'powers':
      return '2^i'
    case 'fractions':
      return '\\frac{i}{i+1}'
  }
}

/**
 * Get the closed-form result description for a preset.
 *
 * @param presetId - The preset identifier
 * @param n - End value
 * @returns Description of the closed-form result
 */
export function getProductClosedFormDescription(presetId: ProductPresetId, n: number): string {
  switch (presetId) {
    case 'factorial':
      return `${n}! = ${factorial(n)}`
    case 'evenNumbers':
      // 2^n × n!
      return `2^${n} × ${n}! = ${Math.pow(2, n) * factorial(n)}`
    case 'oddNumbers':
      // (2n)! / (2^n × n!)
      return `(2n-1)!! = ${doubleFactorial(2 * n - 1)}`
    case 'powers':
      // 2^(1+2+...+n) = 2^(n(n+1)/2)
      const exp = (n * (n + 1)) / 2
      return `2^{${exp}} = ${Math.pow(2, exp)}`
    case 'fractions':
      return `1/${n + 1}`
  }
}
