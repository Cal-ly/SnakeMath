/**
 * Inverse Trigonometric Functions
 *
 * Provides arcsin, arccos, arctan, and atan2 with:
 * - Principal value calculations
 * - Exact symbolic values for special angles
 * - Domain validation
 * - Alternative solutions
 * - Quadrant handling (atan2)
 */

// ============= Types =============

export interface InverseResult {
  /** Principal value in radians */
  value: number
  /** Principal value in degrees */
  valueDegrees: number
  /** Symbolic exact value if known (π/6, π/4, etc.) */
  exactValue: string | null
  /** Other solutions in [0, 360) degrees */
  allSolutionsInRange: number[]
  /** Function domain */
  domain: { min: number; max: number }
  /** Function range in degrees */
  range: { min: number; max: number }
  /** Whether input was valid */
  isValid: boolean
  /** Error message if invalid */
  error?: string
}

export interface Atan2Result extends InverseResult {
  /** Quadrant of the result (1-4) */
  quadrant: 1 | 2 | 3 | 4
  /** What regular atan(y/x) would give in degrees */
  regularAtanWouldGive: number
  /** Whether regular atan gives wrong quadrant */
  regularAtanIsWrong: boolean
  /** X coordinate input */
  x: number
  /** Y coordinate input */
  y: number
}

export type InverseFunctionId = 'arcsin' | 'arccos' | 'arctan' | 'atan2'

export interface InverseFunctionInfo {
  id: InverseFunctionId
  name: string
  latexName: string
  domain: { min: number; max: number }
  range: { min: number; max: number } // in degrees
  description: string
}

// ============= Constants =============

export const ARCSIN_DOMAIN = { min: -1, max: 1 }
export const ARCSIN_RANGE = { min: -90, max: 90 }

export const ARCCOS_DOMAIN = { min: -1, max: 1 }
export const ARCCOS_RANGE = { min: 0, max: 180 }

export const ARCTAN_DOMAIN = { min: -Infinity, max: Infinity }
export const ARCTAN_RANGE = { min: -90, max: 90 }

export const ATAN2_RANGE = { min: -180, max: 180 }

/** Tolerance for exact value matching */
const TOLERANCE = 1e-10

/** Function information for display */
export const INVERSE_FUNCTIONS: InverseFunctionInfo[] = [
  {
    id: 'arcsin',
    name: 'Arcsine',
    latexName: '\\arcsin',
    domain: ARCSIN_DOMAIN,
    range: ARCSIN_RANGE,
    description: 'Returns the angle whose sine is the given value',
  },
  {
    id: 'arccos',
    name: 'Arccosine',
    latexName: '\\arccos',
    domain: ARCCOS_DOMAIN,
    range: ARCCOS_RANGE,
    description: 'Returns the angle whose cosine is the given value',
  },
  {
    id: 'arctan',
    name: 'Arctangent',
    latexName: '\\arctan',
    domain: ARCTAN_DOMAIN,
    range: ARCTAN_RANGE,
    description: 'Returns the angle whose tangent is the given value',
  },
  {
    id: 'atan2',
    name: 'atan2',
    latexName: '\\text{atan2}',
    domain: { min: -Infinity, max: Infinity },
    range: ATAN2_RANGE,
    description: 'Returns the angle from (x, y) coordinates, handling all quadrants',
  },
]

// ============= Exact Values =============

/** Special values for arcsin with exact representations */
const ARCSIN_EXACT_VALUES: Map<number, { degrees: number; latex: string }> = new Map([
  [-1, { degrees: -90, latex: '-\\frac{\\pi}{2}' }],
  [-Math.sqrt(3) / 2, { degrees: -60, latex: '-\\frac{\\pi}{3}' }],
  [-Math.sqrt(2) / 2, { degrees: -45, latex: '-\\frac{\\pi}{4}' }],
  [-0.5, { degrees: -30, latex: '-\\frac{\\pi}{6}' }],
  [0, { degrees: 0, latex: '0' }],
  [0.5, { degrees: 30, latex: '\\frac{\\pi}{6}' }],
  [Math.sqrt(2) / 2, { degrees: 45, latex: '\\frac{\\pi}{4}' }],
  [Math.sqrt(3) / 2, { degrees: 60, latex: '\\frac{\\pi}{3}' }],
  [1, { degrees: 90, latex: '\\frac{\\pi}{2}' }],
])

/** Special values for arccos with exact representations */
const ARCCOS_EXACT_VALUES: Map<number, { degrees: number; latex: string }> = new Map([
  [-1, { degrees: 180, latex: '\\pi' }],
  [-Math.sqrt(3) / 2, { degrees: 150, latex: '\\frac{5\\pi}{6}' }],
  [-Math.sqrt(2) / 2, { degrees: 135, latex: '\\frac{3\\pi}{4}' }],
  [-0.5, { degrees: 120, latex: '\\frac{2\\pi}{3}' }],
  [0, { degrees: 90, latex: '\\frac{\\pi}{2}' }],
  [0.5, { degrees: 60, latex: '\\frac{\\pi}{3}' }],
  [Math.sqrt(2) / 2, { degrees: 45, latex: '\\frac{\\pi}{4}' }],
  [Math.sqrt(3) / 2, { degrees: 30, latex: '\\frac{\\pi}{6}' }],
  [1, { degrees: 0, latex: '0' }],
])

/** Special values for arctan with exact representations */
const ARCTAN_EXACT_VALUES: Map<number, { degrees: number; latex: string }> = new Map([
  [-Math.sqrt(3), { degrees: -60, latex: '-\\frac{\\pi}{3}' }],
  [-1, { degrees: -45, latex: '-\\frac{\\pi}{4}' }],
  [-1 / Math.sqrt(3), { degrees: -30, latex: '-\\frac{\\pi}{6}' }],
  [0, { degrees: 0, latex: '0' }],
  [1 / Math.sqrt(3), { degrees: 30, latex: '\\frac{\\pi}{6}' }],
  [1, { degrees: 45, latex: '\\frac{\\pi}{4}' }],
  [Math.sqrt(3), { degrees: 60, latex: '\\frac{\\pi}{3}' }],
])

// ============= Helper Functions =============

/**
 * Check if a value is in the domain of a function
 */
export function isInDomain(fn: InverseFunctionId, value: number, y?: number): boolean {
  switch (fn) {
    case 'arcsin':
    case 'arccos':
      return value >= -1 && value <= 1
    case 'arctan':
      return Number.isFinite(value)
    case 'atan2':
      // atan2 requires at least one of x, y to be non-zero
      return y !== undefined && (value !== 0 || y !== 0)
    default:
      return false
  }
}

/**
 * Find exact symbolic value if it exists
 */
function findExactValue(
  exactMap: Map<number, { degrees: number; latex: string }>,
  value: number
): { degrees: number; latex: string } | null {
  for (const [key, result] of exactMap) {
    if (Math.abs(key - value) < TOLERANCE) {
      return result
    }
  }
  return null
}

/**
 * Convert degrees to radians
 */
function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Convert radians to degrees
 */
function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * Normalize angle to [0, 360) range
 */
function normalizeAngle(degrees: number): number {
  let result = degrees % 360
  if (result < 0) result += 360
  return result
}

/**
 * Get quadrant from angle in degrees
 */
function getQuadrant(degrees: number): 1 | 2 | 3 | 4 {
  const normalized = normalizeAngle(degrees)
  if (normalized >= 0 && normalized < 90) return 1
  if (normalized >= 90 && normalized < 180) return 2
  if (normalized >= 180 && normalized < 270) return 3
  return 4
}

// ============= Core Functions =============

/**
 * Calculate arcsin (inverse sine)
 * Domain: [-1, 1]
 * Range: [-90°, 90°] or [-π/2, π/2]
 */
export function arcsin(value: number): InverseResult {
  // Validate domain
  if (value < -1 || value > 1) {
    return {
      value: NaN,
      valueDegrees: NaN,
      exactValue: null,
      allSolutionsInRange: [],
      domain: ARCSIN_DOMAIN,
      range: ARCSIN_RANGE,
      isValid: false,
      error: `arcsin(${value}) is undefined: input must be between -1 and 1`,
    }
  }

  // Calculate principal value
  const radians = Math.asin(value)
  const degrees = radiansToDegrees(radians)

  // Check for exact value
  const exact = findExactValue(ARCSIN_EXACT_VALUES, value)

  // Find all solutions in [0, 360)
  // If arcsin(x) = θ, then sin(θ) = x and sin(180° - θ) = x
  const allSolutions: number[] = []
  const primarySolution = normalizeAngle(degrees)
  const secondarySolution = normalizeAngle(180 - degrees)

  allSolutions.push(primarySolution)
  if (Math.abs(primarySolution - secondarySolution) > TOLERANCE && secondarySolution !== 360) {
    allSolutions.push(secondarySolution)
  }
  allSolutions.sort((a, b) => a - b)

  return {
    value: radians,
    valueDegrees: degrees,
    exactValue: exact?.latex ?? null,
    allSolutionsInRange: allSolutions,
    domain: ARCSIN_DOMAIN,
    range: ARCSIN_RANGE,
    isValid: true,
  }
}

/**
 * Calculate arccos (inverse cosine)
 * Domain: [-1, 1]
 * Range: [0°, 180°] or [0, π]
 */
export function arccos(value: number): InverseResult {
  // Validate domain
  if (value < -1 || value > 1) {
    return {
      value: NaN,
      valueDegrees: NaN,
      exactValue: null,
      allSolutionsInRange: [],
      domain: ARCCOS_DOMAIN,
      range: ARCCOS_RANGE,
      isValid: false,
      error: `arccos(${value}) is undefined: input must be between -1 and 1`,
    }
  }

  // Calculate principal value
  const radians = Math.acos(value)
  const degrees = radiansToDegrees(radians)

  // Check for exact value
  const exact = findExactValue(ARCCOS_EXACT_VALUES, value)

  // Find all solutions in [0, 360)
  // If arccos(x) = θ, then cos(θ) = x and cos(360° - θ) = x
  const allSolutions: number[] = []
  const primarySolution = normalizeAngle(degrees)
  const secondarySolution = normalizeAngle(360 - degrees)

  allSolutions.push(primarySolution)
  if (Math.abs(primarySolution - secondarySolution) > TOLERANCE && secondarySolution !== 360) {
    allSolutions.push(secondarySolution)
  }
  allSolutions.sort((a, b) => a - b)

  return {
    value: radians,
    valueDegrees: degrees,
    exactValue: exact?.latex ?? null,
    allSolutionsInRange: allSolutions,
    domain: ARCCOS_DOMAIN,
    range: ARCCOS_RANGE,
    isValid: true,
  }
}

/**
 * Calculate arctan (inverse tangent)
 * Domain: (-∞, ∞)
 * Range: (-90°, 90°) or (-π/2, π/2)
 */
export function arctan(value: number): InverseResult {
  // Validate domain (all finite numbers are valid)
  if (!Number.isFinite(value)) {
    return {
      value: NaN,
      valueDegrees: NaN,
      exactValue: null,
      allSolutionsInRange: [],
      domain: ARCTAN_DOMAIN,
      range: ARCTAN_RANGE,
      isValid: false,
      error: `arctan(${value}) is undefined: input must be a finite number`,
    }
  }

  // Calculate principal value
  const radians = Math.atan(value)
  const degrees = radiansToDegrees(radians)

  // Check for exact value
  const exact = findExactValue(ARCTAN_EXACT_VALUES, value)

  // Find all solutions in [0, 360)
  // If arctan(x) = θ, then tan(θ) = x and tan(θ + 180°) = x
  const allSolutions: number[] = []
  const primarySolution = normalizeAngle(degrees)
  const secondarySolution = normalizeAngle(degrees + 180)

  allSolutions.push(primarySolution)
  if (Math.abs(primarySolution - secondarySolution) > TOLERANCE && secondarySolution !== 360) {
    allSolutions.push(secondarySolution)
  }
  allSolutions.sort((a, b) => a - b)

  return {
    value: radians,
    valueDegrees: degrees,
    exactValue: exact?.latex ?? null,
    allSolutionsInRange: allSolutions,
    domain: ARCTAN_DOMAIN,
    range: ARCTAN_RANGE,
    isValid: true,
  }
}

/**
 * Calculate atan2(y, x) - the "correct" inverse tangent
 * Returns angle from positive x-axis to point (x, y)
 * Domain: any (x, y) except (0, 0)
 * Range: (-180°, 180°] or (-π, π]
 *
 * This is what programmers actually use because it:
 * - Handles all four quadrants correctly
 * - Doesn't have division by zero issues
 * - Returns angle in the correct direction
 */
export function atan2(y: number, x: number): Atan2Result {
  // Validate: at least one must be non-zero
  if (x === 0 && y === 0) {
    return {
      value: NaN,
      valueDegrees: NaN,
      exactValue: null,
      allSolutionsInRange: [],
      domain: { min: -Infinity, max: Infinity },
      range: ATAN2_RANGE,
      isValid: false,
      error: 'atan2(0, 0) is undefined: point cannot be at origin',
      quadrant: 1,
      regularAtanWouldGive: NaN,
      regularAtanIsWrong: true,
      x,
      y,
    }
  }

  // Calculate using built-in atan2
  const radians = Math.atan2(y, x)
  const degrees = radiansToDegrees(radians)

  // Determine quadrant
  let quadrant: 1 | 2 | 3 | 4
  if (x > 0 && y >= 0) quadrant = 1
  else if (x <= 0 && y > 0) quadrant = 2
  else if (x < 0 && y <= 0) quadrant = 3
  else quadrant = 4

  // Calculate what regular atan(y/x) would give
  let regularAtanDegrees: number
  let regularAtanIsWrong: boolean

  if (x === 0) {
    // atan(y/0) = atan(±∞) = ±90°
    regularAtanDegrees = y > 0 ? 90 : -90
    regularAtanIsWrong = false // atan2 gives same result at ±90°
  } else {
    regularAtanDegrees = radiansToDegrees(Math.atan(y / x))
    // Regular atan is wrong if we're in Q2 or Q3 (because it always returns Q1 or Q4)
    regularAtanIsWrong = x < 0
  }

  // Check for exact value (special angles)
  let exactValue: string | null = null
  const normalizedDegrees = normalizeAngle(degrees)

  // Check common special angles for atan2
  const specialAngles: Map<number, string> = new Map([
    [0, '0'],
    [30, '\\frac{\\pi}{6}'],
    [45, '\\frac{\\pi}{4}'],
    [60, '\\frac{\\pi}{3}'],
    [90, '\\frac{\\pi}{2}'],
    [120, '\\frac{2\\pi}{3}'],
    [135, '\\frac{3\\pi}{4}'],
    [150, '\\frac{5\\pi}{6}'],
    [180, '\\pi'],
    [210, '\\frac{7\\pi}{6}'],
    [225, '\\frac{5\\pi}{4}'],
    [240, '\\frac{4\\pi}{3}'],
    [270, '\\frac{3\\pi}{2}'],
    [300, '\\frac{5\\pi}{3}'],
    [315, '\\frac{7\\pi}{4}'],
    [330, '\\frac{11\\pi}{6}'],
  ])

  for (const [angle, latex] of specialAngles) {
    if (Math.abs(normalizedDegrees - angle) < TOLERANCE) {
      // Adjust for negative angles (atan2 range is -180 to 180)
      if (degrees < 0) {
        exactValue = `-${latex.replace('\\frac{', '\\frac{').replace(/(\d+)\\pi/, (_, num) => `${12 - parseInt(num)}\\pi`)}`
        // Simplified: just use the positive form with negative sign for Q3/Q4
        if (angle > 180) {
          exactValue = `-\\frac{${360 - angle > 180 ? '' : ''}${Math.round(((360 - angle) / 180) * 6)}\\pi}{6}`
        }
      } else {
        exactValue = latex
      }
      break
    }
  }

  // More accurate exact value calculation
  if (degrees < 0) {
    const posAngle = 360 + degrees
    for (const [angle, latex] of specialAngles) {
      if (Math.abs(posAngle - angle) < TOLERANCE) {
        // Express as negative angle
        const negAngle = angle - 360
        if (negAngle === -180) exactValue = '-\\pi'
        else if (negAngle === -150) exactValue = '-\\frac{5\\pi}{6}'
        else if (negAngle === -135) exactValue = '-\\frac{3\\pi}{4}'
        else if (negAngle === -120) exactValue = '-\\frac{2\\pi}{3}'
        else if (negAngle === -90) exactValue = '-\\frac{\\pi}{2}'
        else if (negAngle === -60) exactValue = '-\\frac{\\pi}{3}'
        else if (negAngle === -45) exactValue = '-\\frac{\\pi}{4}'
        else if (negAngle === -30) exactValue = '-\\frac{\\pi}{6}'
        break
      }
    }
  }

  return {
    value: radians,
    valueDegrees: degrees,
    exactValue,
    allSolutionsInRange: [normalizeAngle(degrees)],
    domain: { min: -Infinity, max: Infinity },
    range: ATAN2_RANGE,
    isValid: true,
    quadrant,
    regularAtanWouldGive: regularAtanDegrees,
    regularAtanIsWrong,
    x,
    y,
  }
}

// ============= Utility Functions =============

/**
 * Get the inverse function result for any function
 */
export function evaluateInverse(
  fn: InverseFunctionId,
  value: number,
  y?: number
): InverseResult | Atan2Result {
  switch (fn) {
    case 'arcsin':
      return arcsin(value)
    case 'arccos':
      return arccos(value)
    case 'arctan':
      return arctan(value)
    case 'atan2':
      return atan2(y ?? 0, value)
    default:
      throw new Error(`Unknown inverse function: ${fn}`)
  }
}

/**
 * Get exact symbolic value for a function and input
 */
export function getExactInverseValue(
  fn: InverseFunctionId,
  value: number,
  y?: number
): string | null {
  const result = evaluateInverse(fn, value, y)
  return result.exactValue
}

/**
 * Find all solutions in a given range
 */
export function findAllSolutions(
  fn: 'arcsin' | 'arccos' | 'arctan',
  value: number,
  range: [number, number] = [0, 360]
): number[] {
  const result = evaluateInverse(fn, value)
  if (!result.isValid) return []

  const [min, max] = range
  const solutions: number[] = []

  // Get the period based on function
  const period = fn === 'arctan' ? 180 : 360

  // Start from the primary solutions and extend to cover the range
  for (const baseSolution of result.allSolutionsInRange) {
    // Check multiples of period in both directions
    for (let k = -10; k <= 10; k++) {
      const solution = baseSolution + k * period
      if (solution >= min && solution < max) {
        // Avoid duplicates
        if (!solutions.some(s => Math.abs(s - solution) < TOLERANCE)) {
          solutions.push(solution)
        }
      }
    }
  }

  return solutions.sort((a, b) => a - b)
}

/**
 * Get function info by ID
 */
export function getInverseFunctionInfo(fn: InverseFunctionId): InverseFunctionInfo | undefined {
  return INVERSE_FUNCTIONS.find(f => f.id === fn)
}

/**
 * Format angle result with both degrees and radians
 */
export function formatAngleResult(degrees: number, exactValue: string | null): string {
  const radians = degreesToRadians(degrees)
  if (exactValue) {
    return `${degrees.toFixed(2)}° = ${exactValue} rad`
  }
  return `${degrees.toFixed(2)}° ≈ ${radians.toFixed(4)} rad`
}

/**
 * Presets for demonstration
 */
export interface InverseTrigPreset {
  id: string
  name: string
  description: string
  fn: InverseFunctionId
  value: number
  y?: number
}

export const INVERSE_TRIG_PRESETS: InverseTrigPreset[] = [
  {
    id: 'arcsin-half',
    name: 'arcsin(1/2)',
    description: 'Classic special angle: 30°',
    fn: 'arcsin',
    value: 0.5,
  },
  {
    id: 'arcsin-sqrt2',
    name: 'arcsin(√2/2)',
    description: 'Special angle: 45°',
    fn: 'arcsin',
    value: Math.sqrt(2) / 2,
  },
  {
    id: 'arccos-zero',
    name: 'arccos(0)',
    description: 'Perpendicular: 90°',
    fn: 'arccos',
    value: 0,
  },
  {
    id: 'arccos-neg-half',
    name: 'arccos(-1/2)',
    description: 'Obtuse angle: 120°',
    fn: 'arccos',
    value: -0.5,
  },
  {
    id: 'arctan-one',
    name: 'arctan(1)',
    description: 'Slope of 1: 45°',
    fn: 'arctan',
    value: 1,
  },
  {
    id: 'arctan-sqrt3',
    name: 'arctan(√3)',
    description: 'Steep slope: 60°',
    fn: 'arctan',
    value: Math.sqrt(3),
  },
  {
    id: 'atan2-q1',
    name: 'atan2(1, 1)',
    description: 'Quadrant I: 45°',
    fn: 'atan2',
    value: 1,
    y: 1,
  },
  {
    id: 'atan2-q2',
    name: 'atan2(1, -1)',
    description: 'Quadrant II: 135°',
    fn: 'atan2',
    value: -1,
    y: 1,
  },
  {
    id: 'atan2-q3',
    name: 'atan2(-1, -1)',
    description: 'Quadrant III: -135°',
    fn: 'atan2',
    value: -1,
    y: -1,
  },
  {
    id: 'atan2-q4',
    name: 'atan2(-1, 1)',
    description: 'Quadrant IV: -45°',
    fn: 'atan2',
    value: 1,
    y: -1,
  },
]

/**
 * Get preset by ID
 */
export function getInverseTrigPreset(id: string): InverseTrigPreset | undefined {
  return INVERSE_TRIG_PRESETS.find(p => p.id === id)
}
