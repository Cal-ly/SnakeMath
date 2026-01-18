/**
 * Right triangle trigonometry utility functions.
 * Solves right triangles given various combinations of sides and angles.
 *
 * Triangle labeling convention:
 * - Vertices: A (angle we're working with), B (other acute angle), C (right angle = 90°)
 * - Sides: a (opposite to A), b (adjacent to A), c (hypotenuse)
 *
 *          C
 *         /|
 *        / |
 *     c /  | a (opposite to A)
 *      /   |
 *     /θ   |
 *    A-----B
 *       b (adjacent to A)
 */

// Constants
const EPSILON = 1e-10
const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

/**
 * Represents a right triangle with sides a, b, c and angles A, B (C is always 90°).
 * All angles are in degrees.
 */
export interface RightTriangle {
  a: number | null // opposite to angle A
  b: number | null // adjacent to angle A
  c: number | null // hypotenuse
  A: number | null // angle in degrees (not the 90°)
  B: number | null // other angle (A + B = 90)
}

/**
 * Partial triangle with known values for solving.
 */
export type PartialTriangle = Partial<RightTriangle>

/**
 * A single step in the solution process.
 */
export interface SolutionStep {
  finding: 'a' | 'b' | 'c' | 'A' | 'B'
  formula: string // LaTeX formula
  formulaName: string // Name of the relationship used (e.g., "SOHCAHTOA - TOA")
  calculation: string // Numeric calculation shown
  result: number
}

/**
 * Complete solution for a right triangle.
 */
export interface TriangleSolution {
  triangle: RightTriangle // all values filled
  steps: SolutionStep[] // formulas and calculations used
  isValid: boolean
  error?: string
}

/**
 * Validation result for triangle input.
 */
export interface ValidationResult {
  isValid: boolean
  hasEnoughInfo: boolean
  hasSide: boolean
  error?: string
}

/**
 * Special right triangle ratios.
 */
export interface SpecialTriangle {
  name: string
  angles: [number, number, number] // A, B, C (C is always 90)
  sideRatios: [number, number, number] // a, b, c
  description: string
}

/**
 * Special right triangles (30-60-90 and 45-45-90).
 */
export const SPECIAL_TRIANGLES: Record<string, SpecialTriangle> = {
  '30-60-90': {
    name: '30-60-90 Triangle',
    angles: [30, 60, 90],
    sideRatios: [1, Math.sqrt(3), 2], // opposite 30°, opposite 60°, hypotenuse
    description: 'Half of an equilateral triangle. Sides are in ratio 1 : √3 : 2.',
  },
  '45-45-90': {
    name: '45-45-90 Triangle',
    angles: [45, 45, 90],
    sideRatios: [1, 1, Math.sqrt(2)], // legs are equal, hypotenuse is √2 times leg
    description: 'An isosceles right triangle. Legs are equal, hypotenuse is √2 times a leg.',
  },
}

// ============= Individual Calculation Functions =============

/**
 * Find the opposite side given hypotenuse and angle.
 * Uses: sin(A) = opposite / hypotenuse
 * Therefore: opposite = hypotenuse * sin(A)
 */
export function findOpposite(hypotenuse: number, angleDeg: number): number {
  return hypotenuse * Math.sin(angleDeg * DEG_TO_RAD)
}

/**
 * Find the adjacent side given hypotenuse and angle.
 * Uses: cos(A) = adjacent / hypotenuse
 * Therefore: adjacent = hypotenuse * cos(A)
 */
export function findAdjacent(hypotenuse: number, angleDeg: number): number {
  return hypotenuse * Math.cos(angleDeg * DEG_TO_RAD)
}

/**
 * Find the hypotenuse given opposite and adjacent sides.
 * Uses: c² = a² + b² (Pythagorean theorem)
 */
export function findHypotenuse(opposite: number, adjacent: number): number {
  return Math.sqrt(opposite * opposite + adjacent * adjacent)
}

/**
 * Find the hypotenuse given opposite side and angle.
 * Uses: sin(A) = opposite / hypotenuse
 * Therefore: hypotenuse = opposite / sin(A)
 */
export function findHypotenuseFromOpposite(opposite: number, angleDeg: number): number {
  const sinA = Math.sin(angleDeg * DEG_TO_RAD)
  if (Math.abs(sinA) < EPSILON) {
    throw new Error('Cannot calculate: angle is too close to 0°')
  }
  return opposite / sinA
}

/**
 * Find the hypotenuse given adjacent side and angle.
 * Uses: cos(A) = adjacent / hypotenuse
 * Therefore: hypotenuse = adjacent / cos(A)
 */
export function findHypotenuseFromAdjacent(adjacent: number, angleDeg: number): number {
  const cosA = Math.cos(angleDeg * DEG_TO_RAD)
  if (Math.abs(cosA) < EPSILON) {
    throw new Error('Cannot calculate: angle is too close to 90°')
  }
  return adjacent / cosA
}

/**
 * Find the opposite side given adjacent and angle.
 * Uses: tan(A) = opposite / adjacent
 * Therefore: opposite = adjacent * tan(A)
 */
export function findOppositeFromAdjacent(adjacent: number, angleDeg: number): number {
  return adjacent * Math.tan(angleDeg * DEG_TO_RAD)
}

/**
 * Find the adjacent side given opposite and angle.
 * Uses: tan(A) = opposite / adjacent
 * Therefore: adjacent = opposite / tan(A)
 */
export function findAdjacentFromOpposite(opposite: number, angleDeg: number): number {
  const tanA = Math.tan(angleDeg * DEG_TO_RAD)
  if (Math.abs(tanA) < EPSILON) {
    throw new Error('Cannot calculate: angle is too close to 0°')
  }
  return opposite / tanA
}

/**
 * Find angle A given opposite and adjacent sides.
 * Uses: tan(A) = opposite / adjacent
 */
export function findAngleFromSides(opposite: number, adjacent: number): number {
  return Math.atan2(opposite, adjacent) * RAD_TO_DEG
}

/**
 * Find angle A given opposite and hypotenuse.
 * Uses: sin(A) = opposite / hypotenuse
 */
export function findAngleFromOppositeHypotenuse(opposite: number, hypotenuse: number): number {
  const ratio = opposite / hypotenuse
  if (Math.abs(ratio) > 1) {
    throw new Error('Invalid triangle: opposite cannot be greater than hypotenuse')
  }
  return Math.asin(ratio) * RAD_TO_DEG
}

/**
 * Find angle A given adjacent and hypotenuse.
 * Uses: cos(A) = adjacent / hypotenuse
 */
export function findAngleFromAdjacentHypotenuse(adjacent: number, hypotenuse: number): number {
  const ratio = adjacent / hypotenuse
  if (Math.abs(ratio) > 1) {
    throw new Error('Invalid triangle: adjacent cannot be greater than hypotenuse')
  }
  return Math.acos(ratio) * RAD_TO_DEG
}

/**
 * Find adjacent side using Pythagorean theorem.
 * Uses: b² = c² - a²
 */
export function findAdjacentFromPythagorean(hypotenuse: number, opposite: number): number {
  const bSquared = hypotenuse * hypotenuse - opposite * opposite
  if (bSquared < 0) {
    throw new Error('Invalid triangle: opposite cannot be greater than hypotenuse')
  }
  return Math.sqrt(bSquared)
}

/**
 * Find opposite side using Pythagorean theorem.
 * Uses: a² = c² - b²
 */
export function findOppositeFromPythagorean(hypotenuse: number, adjacent: number): number {
  const aSquared = hypotenuse * hypotenuse - adjacent * adjacent
  if (aSquared < 0) {
    throw new Error('Invalid triangle: adjacent cannot be greater than hypotenuse')
  }
  return Math.sqrt(aSquared)
}

// ============= Validation Functions =============

/**
 * Count how many values are known (not null).
 */
function countKnown(known: PartialTriangle): number {
  let count = 0
  if (known.a != null) count++
  if (known.b != null) count++
  if (known.c != null) count++
  if (known.A != null) count++
  if (known.B != null) count++
  return count
}

/**
 * Check if at least one side is known.
 */
function hasSideKnown(known: PartialTriangle): boolean {
  return known.a != null || known.b != null || known.c != null
}

/**
 * Validate that known values are positive and angles are in valid range.
 */
function validateValues(known: PartialTriangle): string | null {
  if (known.a != null && known.a <= 0) return 'Side a must be positive'
  if (known.b != null && known.b <= 0) return 'Side b must be positive'
  if (known.c != null && known.c <= 0) return 'Side c must be positive'
  if (known.A != null && (known.A <= 0 || known.A >= 90)) return 'Angle A must be between 0° and 90°'
  if (known.B != null && (known.B <= 0 || known.B >= 90)) return 'Angle B must be between 0° and 90°'

  // If both angles known, they must sum to 90
  if (known.A != null && known.B != null) {
    if (Math.abs(known.A + known.B - 90) > EPSILON) {
      return 'Angles A and B must sum to 90°'
    }
  }

  // Hypotenuse must be larger than either leg
  if (known.c != null && known.a != null && known.c <= known.a) {
    return 'Hypotenuse must be larger than opposite side'
  }
  if (known.c != null && known.b != null && known.c <= known.b) {
    return 'Hypotenuse must be larger than adjacent side'
  }

  return null
}

/**
 * Check if the given known values can solve the triangle.
 */
export function canSolve(known: PartialTriangle): ValidationResult {
  const count = countKnown(known)
  const hasSide = hasSideKnown(known)
  const validationError = validateValues(known)

  if (validationError) {
    return { isValid: false, hasEnoughInfo: false, hasSide, error: validationError }
  }

  // Need at least 2 pieces of information (one must be a side)
  if (count < 2) {
    return {
      isValid: true,
      hasEnoughInfo: false,
      hasSide,
      error: 'Need at least 2 values to solve the triangle',
    }
  }

  if (!hasSide) {
    return {
      isValid: true,
      hasEnoughInfo: false,
      hasSide: false,
      error: 'Need at least one side length to determine the triangle size',
    }
  }

  return { isValid: true, hasEnoughInfo: true, hasSide: true }
}

/**
 * Validate a complete triangle.
 */
export function validateTriangle(triangle: RightTriangle): boolean {
  // Check all values are filled
  if (
    triangle.a == null ||
    triangle.b == null ||
    triangle.c == null ||
    triangle.A == null ||
    triangle.B == null
  ) {
    return false
  }

  // Check positive values
  if (triangle.a <= 0 || triangle.b <= 0 || triangle.c <= 0) return false
  if (triangle.A <= 0 || triangle.A >= 90) return false
  if (triangle.B <= 0 || triangle.B >= 90) return false

  // Check angle sum
  if (Math.abs(triangle.A + triangle.B - 90) > 0.01) return false

  // Check Pythagorean theorem
  const pythagorean = triangle.a * triangle.a + triangle.b * triangle.b
  if (Math.abs(pythagorean - triangle.c * triangle.c) > 0.01 * triangle.c * triangle.c) {
    return false
  }

  // Check trig relationships
  const sinA = triangle.a / triangle.c
  const expectedSinA = Math.sin(triangle.A * DEG_TO_RAD)
  if (Math.abs(sinA - expectedSinA) > 0.01) return false

  return true
}

// ============= Main Solving Function =============

/**
 * Solve a right triangle given known values.
 * Returns a complete triangle with all values and the steps used.
 */
export function solveRightTriangle(known: PartialTriangle): TriangleSolution {
  const validation = canSolve(known)

  if (!validation.isValid || !validation.hasEnoughInfo) {
    return {
      triangle: { a: null, b: null, c: null, A: null, B: null },
      steps: [],
      isValid: false,
      error: validation.error,
    }
  }

  const steps: SolutionStep[] = []
  const result: RightTriangle = {
    a: known.a ?? null,
    b: known.b ?? null,
    c: known.c ?? null,
    A: known.A ?? null,
    B: known.B ?? null,
  }

  // Helper to format numbers nicely
  const fmt = (n: number) => Number(n.toFixed(4))

  try {
    // First, try to get both angles if we have one
    if (result.A != null && result.B == null) {
      result.B = 90 - result.A
      steps.push({
        finding: 'B',
        formula: 'B = 90° - A',
        formulaName: 'Complementary angles',
        calculation: `B = 90° - ${fmt(result.A)}° = ${fmt(result.B)}°`,
        result: result.B,
      })
    } else if (result.B != null && result.A == null) {
      result.A = 90 - result.B
      steps.push({
        finding: 'A',
        formula: 'A = 90° - B',
        formulaName: 'Complementary angles',
        calculation: `A = 90° - ${fmt(result.B)}° = ${fmt(result.A)}°`,
        result: result.A,
      })
    }

    // Now solve for sides/angles based on what we have
    // The strategy is to keep iterating until we have all 5 values

    let iterations = 0
    const MAX_ITERATIONS = 10

    while (
      (result.a == null || result.b == null || result.c == null || result.A == null || result.B == null) &&
      iterations < MAX_ITERATIONS
    ) {
      iterations++
      const before = countKnownInResult(result)

      // Case: Have two sides, find the third using Pythagorean theorem
      if (result.a != null && result.b != null && result.c == null) {
        result.c = findHypotenuse(result.a, result.b)
        steps.push({
          finding: 'c',
          formula: 'c = \\sqrt{a^2 + b^2}',
          formulaName: 'Pythagorean theorem',
          calculation: `c = √(${fmt(result.a)}² + ${fmt(result.b)}²) = ${fmt(result.c)}`,
          result: result.c,
        })
      }

      if (result.a != null && result.c != null && result.b == null) {
        result.b = findAdjacentFromPythagorean(result.c, result.a)
        steps.push({
          finding: 'b',
          formula: 'b = \\sqrt{c^2 - a^2}',
          formulaName: 'Pythagorean theorem',
          calculation: `b = √(${fmt(result.c)}² - ${fmt(result.a)}²) = ${fmt(result.b)}`,
          result: result.b,
        })
      }

      if (result.b != null && result.c != null && result.a == null) {
        result.a = findOppositeFromPythagorean(result.c, result.b)
        steps.push({
          finding: 'a',
          formula: 'a = \\sqrt{c^2 - b^2}',
          formulaName: 'Pythagorean theorem',
          calculation: `a = √(${fmt(result.c)}² - ${fmt(result.b)}²) = ${fmt(result.a)}`,
          result: result.a,
        })
      }

      // Case: Have angle A and one side, find other sides
      if (result.A != null) {
        if (result.c != null && result.a == null) {
          result.a = findOpposite(result.c, result.A)
          steps.push({
            finding: 'a',
            formula: 'a = c \\cdot \\sin(A)',
            formulaName: 'SOH (sin = opposite/hypotenuse)',
            calculation: `a = ${fmt(result.c)} × sin(${fmt(result.A)}°) = ${fmt(result.a)}`,
            result: result.a,
          })
        }

        if (result.c != null && result.b == null) {
          result.b = findAdjacent(result.c, result.A)
          steps.push({
            finding: 'b',
            formula: 'b = c \\cdot \\cos(A)',
            formulaName: 'CAH (cos = adjacent/hypotenuse)',
            calculation: `b = ${fmt(result.c)} × cos(${fmt(result.A)}°) = ${fmt(result.b)}`,
            result: result.b,
          })
        }

        if (result.a != null && result.c == null) {
          result.c = findHypotenuseFromOpposite(result.a, result.A)
          steps.push({
            finding: 'c',
            formula: 'c = \\frac{a}{\\sin(A)}',
            formulaName: 'SOH (sin = opposite/hypotenuse)',
            calculation: `c = ${fmt(result.a)} / sin(${fmt(result.A)}°) = ${fmt(result.c)}`,
            result: result.c,
          })
        }

        if (result.b != null && result.c == null) {
          result.c = findHypotenuseFromAdjacent(result.b, result.A)
          steps.push({
            finding: 'c',
            formula: 'c = \\frac{b}{\\cos(A)}',
            formulaName: 'CAH (cos = adjacent/hypotenuse)',
            calculation: `c = ${fmt(result.b)} / cos(${fmt(result.A)}°) = ${fmt(result.c)}`,
            result: result.c,
          })
        }

        if (result.b != null && result.a == null) {
          result.a = findOppositeFromAdjacent(result.b, result.A)
          steps.push({
            finding: 'a',
            formula: 'a = b \\cdot \\tan(A)',
            formulaName: 'TOA (tan = opposite/adjacent)',
            calculation: `a = ${fmt(result.b)} × tan(${fmt(result.A)}°) = ${fmt(result.a)}`,
            result: result.a,
          })
        }

        if (result.a != null && result.b == null) {
          result.b = findAdjacentFromOpposite(result.a, result.A)
          steps.push({
            finding: 'b',
            formula: 'b = \\frac{a}{\\tan(A)}',
            formulaName: 'TOA (tan = opposite/adjacent)',
            calculation: `b = ${fmt(result.a)} / tan(${fmt(result.A)}°) = ${fmt(result.b)}`,
            result: result.b,
          })
        }
      }

      // Case: Have two sides but no angle, find angle A
      if (result.A == null) {
        if (result.a != null && result.b != null) {
          result.A = findAngleFromSides(result.a, result.b)
          steps.push({
            finding: 'A',
            formula: 'A = \\arctan\\left(\\frac{a}{b}\\right)',
            formulaName: 'Inverse tangent',
            calculation: `A = arctan(${fmt(result.a)} / ${fmt(result.b)}) = ${fmt(result.A)}°`,
            result: result.A,
          })
        } else if (result.a != null && result.c != null) {
          result.A = findAngleFromOppositeHypotenuse(result.a, result.c)
          steps.push({
            finding: 'A',
            formula: 'A = \\arcsin\\left(\\frac{a}{c}\\right)',
            formulaName: 'Inverse sine',
            calculation: `A = arcsin(${fmt(result.a)} / ${fmt(result.c)}) = ${fmt(result.A)}°`,
            result: result.A,
          })
        } else if (result.b != null && result.c != null) {
          result.A = findAngleFromAdjacentHypotenuse(result.b, result.c)
          steps.push({
            finding: 'A',
            formula: 'A = \\arccos\\left(\\frac{b}{c}\\right)',
            formulaName: 'Inverse cosine',
            calculation: `A = arccos(${fmt(result.b)} / ${fmt(result.c)}) = ${fmt(result.A)}°`,
            result: result.A,
          })
        }
      }

      // Calculate B if we now have A
      if (result.A != null && result.B == null) {
        result.B = 90 - result.A
        steps.push({
          finding: 'B',
          formula: 'B = 90° - A',
          formulaName: 'Complementary angles',
          calculation: `B = 90° - ${fmt(result.A)}° = ${fmt(result.B)}°`,
          result: result.B,
        })
      }

      // Check if we made progress
      const after = countKnownInResult(result)
      if (after === before) {
        // No progress made, we're stuck
        break
      }
    }

    // Verify the solution
    if (validateTriangle(result)) {
      return { triangle: result, steps, isValid: true }
    } else {
      return {
        triangle: result,
        steps,
        isValid: false,
        error: 'Could not solve triangle with given values',
      }
    }
  } catch (e) {
    return {
      triangle: result,
      steps,
      isValid: false,
      error: e instanceof Error ? e.message : 'Unknown error solving triangle',
    }
  }
}

function countKnownInResult(result: RightTriangle): number {
  let count = 0
  if (result.a != null) count++
  if (result.b != null) count++
  if (result.c != null) count++
  if (result.A != null) count++
  if (result.B != null) count++
  return count
}

// ============= Special Triangle Functions =============

/**
 * Check if a triangle is a special triangle (30-60-90 or 45-45-90).
 */
export function isSpecialTriangle(A: number, B: number): string | null {
  const tolerance = 0.01

  // 30-60-90 triangle
  if (
    (Math.abs(A - 30) < tolerance && Math.abs(B - 60) < tolerance) ||
    (Math.abs(A - 60) < tolerance && Math.abs(B - 30) < tolerance)
  ) {
    return '30-60-90'
  }

  // 45-45-90 triangle
  if (Math.abs(A - 45) < tolerance && Math.abs(B - 45) < tolerance) {
    return '45-45-90'
  }

  return null
}

/**
 * Get special triangle info if the given angles match.
 */
export function getSpecialTriangleInfo(A: number): SpecialTriangle | null {
  const tolerance = 0.01

  if (Math.abs(A - 30) < tolerance || Math.abs(A - 60) < tolerance) {
    return SPECIAL_TRIANGLES['30-60-90'] ?? null
  }

  if (Math.abs(A - 45) < tolerance) {
    return SPECIAL_TRIANGLES['45-45-90'] ?? null
  }

  return null
}

/**
 * Scale a special triangle to a given hypotenuse.
 */
export function scaleSpecialTriangle(type: '30-60-90' | '45-45-90', hypotenuse: number): RightTriangle {
  const special = SPECIAL_TRIANGLES[type]
  if (!special) {
    throw new Error(`Unknown special triangle type: ${type}`)
  }
  const scale = hypotenuse / special.sideRatios[2]

  if (type === '30-60-90') {
    return {
      a: scale * special.sideRatios[0], // opposite to 30°
      b: scale * special.sideRatios[1], // opposite to 60° (adjacent to 30°)
      c: hypotenuse,
      A: 30,
      B: 60,
    }
  } else {
    return {
      a: scale * special.sideRatios[0],
      b: scale * special.sideRatios[1],
      c: hypotenuse,
      A: 45,
      B: 45,
    }
  }
}

// ============= SOHCAHTOA Helper =============

/**
 * Get the SOHCAHTOA relationship description for educational purposes.
 */
export function getSOHCAHTOA(): Array<{
  mnemonic: string
  full: string
  formula: string
  formulaLatex: string
  description: string
}> {
  return [
    {
      mnemonic: 'SOH',
      full: 'Sine = Opposite / Hypotenuse',
      formula: 'sin(θ) = opposite / hypotenuse',
      formulaLatex: '\\sin(\\theta) = \\frac{\\text{opposite}}{\\text{hypotenuse}}',
      description: 'Sine relates the opposite side to the hypotenuse',
    },
    {
      mnemonic: 'CAH',
      full: 'Cosine = Adjacent / Hypotenuse',
      formula: 'cos(θ) = adjacent / hypotenuse',
      formulaLatex: '\\cos(\\theta) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}',
      description: 'Cosine relates the adjacent side to the hypotenuse',
    },
    {
      mnemonic: 'TOA',
      full: 'Tangent = Opposite / Adjacent',
      formula: 'tan(θ) = opposite / adjacent',
      formulaLatex: '\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}',
      description: 'Tangent relates the opposite side to the adjacent side',
    },
  ]
}

// ============= Triangle Area and Perimeter =============

/**
 * Calculate the area of a right triangle.
 */
export function triangleArea(a: number, b: number): number {
  return (a * b) / 2
}

/**
 * Calculate the perimeter of a right triangle.
 */
export function trianglePerimeter(a: number, b: number, c: number): number {
  return a + b + c
}
