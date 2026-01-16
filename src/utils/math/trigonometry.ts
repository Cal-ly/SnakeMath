/**
 * Trigonometry utility functions for the UnitCircleExplorer widget.
 */

export type AngleUnit = 'degrees' | 'radians'

export type Quadrant = 1 | 2 | 3 | 4

export interface TrigValues {
  sin: number
  cos: number
  tan: number | null // null when undefined (90°, 270°)
}

export interface ExactTrigValues {
  sin: string // e.g., "√2/2"
  cos: string
  tan: string // "undefined" for 90°, 270°
  sinDecimal: number
  cosDecimal: number
  tanDecimal: number | null
}

export interface QuadrantSigns {
  sin: 1 | -1
  cos: 1 | -1
  tan: 1 | -1
}

export interface SpecialAngle {
  degrees: number
  radiansSymbolic: string // Display string like "π/4"
  radiansValue: number // Actual numeric value
  exact: ExactTrigValues
}

export interface PointOnCircle {
  x: number // cos(θ)
  y: number // sin(θ)
}

export interface RadianDisplay {
  symbolic: string // "π/4"
  decimal: number // 0.7853981...
  formatted: string // "π/4 ≈ 0.79"
}

// Constants
const SQRT2_OVER_2 = Math.SQRT2 / 2
const SQRT3_OVER_2 = Math.sqrt(3) / 2
const SQRT3_OVER_3 = Math.sqrt(3) / 3
const SQRT3 = Math.sqrt(3)

/**
 * Special angles data (all angles in the 30° and 45° family)
 */
const SPECIAL_ANGLES_DATA: SpecialAngle[] = [
  {
    degrees: 0,
    radiansSymbolic: '0',
    radiansValue: 0,
    exact: {
      sin: '0',
      cos: '1',
      tan: '0',
      sinDecimal: 0,
      cosDecimal: 1,
      tanDecimal: 0,
    },
  },
  {
    degrees: 30,
    radiansSymbolic: 'π/6',
    radiansValue: Math.PI / 6,
    exact: {
      sin: '1/2',
      cos: '√3/2',
      tan: '√3/3',
      sinDecimal: 0.5,
      cosDecimal: SQRT3_OVER_2,
      tanDecimal: SQRT3_OVER_3,
    },
  },
  {
    degrees: 45,
    radiansSymbolic: 'π/4',
    radiansValue: Math.PI / 4,
    exact: {
      sin: '√2/2',
      cos: '√2/2',
      tan: '1',
      sinDecimal: SQRT2_OVER_2,
      cosDecimal: SQRT2_OVER_2,
      tanDecimal: 1,
    },
  },
  {
    degrees: 60,
    radiansSymbolic: 'π/3',
    radiansValue: Math.PI / 3,
    exact: {
      sin: '√3/2',
      cos: '1/2',
      tan: '√3',
      sinDecimal: SQRT3_OVER_2,
      cosDecimal: 0.5,
      tanDecimal: SQRT3,
    },
  },
  {
    degrees: 90,
    radiansSymbolic: 'π/2',
    radiansValue: Math.PI / 2,
    exact: {
      sin: '1',
      cos: '0',
      tan: 'undefined',
      sinDecimal: 1,
      cosDecimal: 0,
      tanDecimal: null,
    },
  },
  {
    degrees: 120,
    radiansSymbolic: '2π/3',
    radiansValue: (2 * Math.PI) / 3,
    exact: {
      sin: '√3/2',
      cos: '-1/2',
      tan: '-√3',
      sinDecimal: SQRT3_OVER_2,
      cosDecimal: -0.5,
      tanDecimal: -SQRT3,
    },
  },
  {
    degrees: 135,
    radiansSymbolic: '3π/4',
    radiansValue: (3 * Math.PI) / 4,
    exact: {
      sin: '√2/2',
      cos: '-√2/2',
      tan: '-1',
      sinDecimal: SQRT2_OVER_2,
      cosDecimal: -SQRT2_OVER_2,
      tanDecimal: -1,
    },
  },
  {
    degrees: 150,
    radiansSymbolic: '5π/6',
    radiansValue: (5 * Math.PI) / 6,
    exact: {
      sin: '1/2',
      cos: '-√3/2',
      tan: '-√3/3',
      sinDecimal: 0.5,
      cosDecimal: -SQRT3_OVER_2,
      tanDecimal: -SQRT3_OVER_3,
    },
  },
  {
    degrees: 180,
    radiansSymbolic: 'π',
    radiansValue: Math.PI,
    exact: {
      sin: '0',
      cos: '-1',
      tan: '0',
      sinDecimal: 0,
      cosDecimal: -1,
      tanDecimal: 0,
    },
  },
  {
    degrees: 210,
    radiansSymbolic: '7π/6',
    radiansValue: (7 * Math.PI) / 6,
    exact: {
      sin: '-1/2',
      cos: '-√3/2',
      tan: '√3/3',
      sinDecimal: -0.5,
      cosDecimal: -SQRT3_OVER_2,
      tanDecimal: SQRT3_OVER_3,
    },
  },
  {
    degrees: 225,
    radiansSymbolic: '5π/4',
    radiansValue: (5 * Math.PI) / 4,
    exact: {
      sin: '-√2/2',
      cos: '-√2/2',
      tan: '1',
      sinDecimal: -SQRT2_OVER_2,
      cosDecimal: -SQRT2_OVER_2,
      tanDecimal: 1,
    },
  },
  {
    degrees: 240,
    radiansSymbolic: '4π/3',
    radiansValue: (4 * Math.PI) / 3,
    exact: {
      sin: '-√3/2',
      cos: '-1/2',
      tan: '√3',
      sinDecimal: -SQRT3_OVER_2,
      cosDecimal: -0.5,
      tanDecimal: SQRT3,
    },
  },
  {
    degrees: 270,
    radiansSymbolic: '3π/2',
    radiansValue: (3 * Math.PI) / 2,
    exact: {
      sin: '-1',
      cos: '0',
      tan: 'undefined',
      sinDecimal: -1,
      cosDecimal: 0,
      tanDecimal: null,
    },
  },
  {
    degrees: 300,
    radiansSymbolic: '5π/3',
    radiansValue: (5 * Math.PI) / 3,
    exact: {
      sin: '-√3/2',
      cos: '1/2',
      tan: '-√3',
      sinDecimal: -SQRT3_OVER_2,
      cosDecimal: 0.5,
      tanDecimal: -SQRT3,
    },
  },
  {
    degrees: 315,
    radiansSymbolic: '7π/4',
    radiansValue: (7 * Math.PI) / 4,
    exact: {
      sin: '-√2/2',
      cos: '√2/2',
      tan: '-1',
      sinDecimal: -SQRT2_OVER_2,
      cosDecimal: SQRT2_OVER_2,
      tanDecimal: -1,
    },
  },
  {
    degrees: 330,
    radiansSymbolic: '11π/6',
    radiansValue: (11 * Math.PI) / 6,
    exact: {
      sin: '-1/2',
      cos: '√3/2',
      tan: '-√3/3',
      sinDecimal: -0.5,
      cosDecimal: SQRT3_OVER_2,
      tanDecimal: -SQRT3_OVER_3,
    },
  },
]

// ============= Angle Conversion Functions =============

/**
 * Convert degrees to radians.
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees.
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Normalize angle to [0, 360) range.
 */
export function normalizeAngle(degrees: number): number {
  const normalized = degrees % 360
  return normalized < 0 ? normalized + 360 : normalized
}

// ============= Quadrant Utilities =============

/**
 * Get the quadrant (1-4) for an angle in degrees.
 */
export function getQuadrant(degrees: number): Quadrant {
  const normalized = normalizeAngle(degrees)

  if (normalized >= 0 && normalized < 90) return 1
  if (normalized >= 90 && normalized < 180) return 2
  if (normalized >= 180 && normalized < 270) return 3
  return 4
}

/**
 * Get the signs of trig functions in a given quadrant.
 * ASTC: All Students Take Calculus
 */
export function getQuadrantSigns(quadrant: Quadrant): QuadrantSigns {
  switch (quadrant) {
    case 1:
      return { sin: 1, cos: 1, tan: 1 }
    case 2:
      return { sin: 1, cos: -1, tan: -1 }
    case 3:
      return { sin: -1, cos: -1, tan: 1 }
    case 4:
      return { sin: -1, cos: 1, tan: -1 }
  }
}

/**
 * Get the reference angle (acute angle to x-axis) for a given angle.
 */
export function getReferenceAngle(degrees: number): number {
  const normalized = normalizeAngle(degrees)

  if (normalized <= 90) return normalized
  if (normalized <= 180) return 180 - normalized
  if (normalized <= 270) return normalized - 180
  return 360 - normalized
}

// ============= Trig Calculations =============

/**
 * Calculate sin, cos, tan for an angle in degrees.
 * Returns null for tan at 90° and 270° (undefined).
 */
export function calculateTrigValues(degrees: number): TrigValues {
  const radians = degreesToRadians(degrees)
  const normalized = normalizeAngle(degrees)

  const sin = Math.sin(radians)
  const cos = Math.cos(radians)

  // tan is undefined at 90° and 270°
  const isUndefined = Math.abs(normalized - 90) < 0.0001 || Math.abs(normalized - 270) < 0.0001
  const tan = isUndefined ? null : Math.tan(radians)

  return { sin, cos, tan }
}

/**
 * Get the point on the unit circle for an angle.
 */
export function getPointOnCircle(degrees: number): PointOnCircle {
  const radians = degreesToRadians(degrees)
  return {
    x: Math.cos(radians),
    y: Math.sin(radians),
  }
}

// ============= Special Angles =============

/**
 * Check if an angle is a special angle (30°/45° family).
 */
export function isSpecialAngle(degrees: number): boolean {
  const normalized = normalizeAngle(degrees)
  return SPECIAL_ANGLES_DATA.some((a) => Math.abs(a.degrees - normalized) < 0.0001)
}

/**
 * Get exact trig values for a special angle.
 * Returns null if not a special angle.
 */
export function getExactTrigValues(degrees: number): ExactTrigValues | null {
  const normalized = normalizeAngle(degrees)
  const special = SPECIAL_ANGLES_DATA.find((a) => Math.abs(a.degrees - normalized) < 0.0001)
  return special?.exact ?? null
}

/**
 * Get all special angles data.
 */
export function getSpecialAngles(): SpecialAngle[] {
  return [...SPECIAL_ANGLES_DATA]
}

/**
 * Get first quadrant special angles (0°, 30°, 45°, 60°, 90°).
 */
export function getFirstQuadrantAngles(): SpecialAngle[] {
  return SPECIAL_ANGLES_DATA.filter((a) => a.degrees <= 90)
}

/**
 * Get remaining special angles (120° through 330°).
 */
export function getRemainingSpecialAngles(): SpecialAngle[] {
  return SPECIAL_ANGLES_DATA.filter((a) => a.degrees > 90)
}

// ============= Radian Display =============

/**
 * Format radians display showing symbolic and decimal.
 * For special angles, shows symbolic form; otherwise shows decimal.
 */
export function formatRadians(degrees: number): RadianDisplay {
  const normalized = normalizeAngle(degrees)
  const radians = degreesToRadians(normalized)

  // Check if it's a special angle
  const special = SPECIAL_ANGLES_DATA.find((a) => Math.abs(a.degrees - normalized) < 0.0001)

  if (special) {
    return {
      symbolic: special.radiansSymbolic,
      decimal: special.radiansValue,
      formatted: `${special.radiansSymbolic} ≈ ${special.radiansValue.toFixed(2)}`,
    }
  }

  // For non-special angles, try to express as a fraction of π if possible
  const piMultiple = normalized / 180
  const decimalStr = radians.toFixed(4)

  // Simple fractions of π
  if (Math.abs(piMultiple - Math.round(piMultiple)) < 0.0001) {
    const mult = Math.round(piMultiple)
    if (mult === 0) {
      return { symbolic: '0', decimal: 0, formatted: '0' }
    } else if (mult === 1) {
      return { symbolic: 'π', decimal: Math.PI, formatted: `π ≈ ${Math.PI.toFixed(2)}` }
    } else {
      return {
        symbolic: `${mult}π`,
        decimal: mult * Math.PI,
        formatted: `${mult}π ≈ ${(mult * Math.PI).toFixed(2)}`,
      }
    }
  }

  // Just show decimal for non-special angles
  return {
    symbolic: decimalStr,
    decimal: radians,
    formatted: decimalStr,
  }
}

// ============= Identity Verification =============

/**
 * Verify the Pythagorean identity: sin²θ + cos²θ = 1
 */
export function verifyPythagoreanIdentity(degrees: number): {
  result: number
  isValid: boolean
} {
  const { sin, cos } = calculateTrigValues(degrees)
  const result = sin * sin + cos * cos
  return {
    result,
    isValid: Math.abs(result - 1) < 0.0001,
  }
}
