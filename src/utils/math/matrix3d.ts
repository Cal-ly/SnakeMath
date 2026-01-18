/**
 * Matrix math utilities for 3×3 matrices
 *
 * Provides core 3D matrix operations for the Linear Algebra section (Phase 16).
 * All angles are in degrees (D-090).
 * Uses right-handed, Y-up coordinate system (D-122).
 */

import type { Matrix3x3, Rotation3DPreset, Vector3D } from '@/types/math'

// ============================================================================
// Constants
// ============================================================================

/** Tolerance for floating point comparisons */
export const MATRIX3D_TOLERANCE = 1e-10

// ============================================================================
// Validation
// ============================================================================

/**
 * Type guard to check if a value is a valid Matrix3x3
 * @param m Value to check
 * @returns True if m is a valid Matrix3x3
 */
export function isValidMatrix3x3(m: unknown): m is Matrix3x3 {
  if (m === null || m === undefined || !Array.isArray(m)) {
    return false
  }

  if (m.length !== 3) {
    return false
  }

  for (let i = 0; i < 3; i++) {
    if (!Array.isArray(m[i]) || m[i].length !== 3) {
      return false
    }
    for (let j = 0; j < 3; j++) {
      if (typeof m[i][j] !== 'number' || !Number.isFinite(m[i][j])) {
        return false
      }
    }
  }

  return true
}

// ============================================================================
// Matrix Generators
// ============================================================================

/**
 * Creates the 3×3 identity matrix
 * @returns Identity matrix I
 */
export function identity(): Matrix3x3 {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]
}

/**
 * Creates a rotation matrix around the X-axis
 * Rx(θ) rotates around the X-axis (pitch) using the right-hand rule.
 *
 * @param angleDegrees Rotation angle in degrees
 * @returns Rotation matrix Rx(θ)
 */
export function rotationX(angleDegrees: number): Matrix3x3 {
  const radians = (angleDegrees * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return [
    [1, 0, 0],
    [0, cos, -sin],
    [0, sin, cos],
  ]
}

/**
 * Creates a rotation matrix around the Y-axis
 * Ry(θ) rotates around the Y-axis (yaw) using the right-hand rule.
 *
 * @param angleDegrees Rotation angle in degrees
 * @returns Rotation matrix Ry(θ)
 */
export function rotationY(angleDegrees: number): Matrix3x3 {
  const radians = (angleDegrees * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return [
    [cos, 0, sin],
    [0, 1, 0],
    [-sin, 0, cos],
  ]
}

/**
 * Creates a rotation matrix around the Z-axis
 * Rz(θ) rotates around the Z-axis (roll) using the right-hand rule.
 *
 * @param angleDegrees Rotation angle in degrees
 * @returns Rotation matrix Rz(θ)
 */
export function rotationZ(angleDegrees: number): Matrix3x3 {
  const radians = (angleDegrees * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return [
    [cos, -sin, 0],
    [sin, cos, 0],
    [0, 0, 1],
  ]
}

/**
 * Creates a non-uniform scale matrix
 * @param sx Scale factor in x direction
 * @param sy Scale factor in y direction
 * @param sz Scale factor in z direction
 * @returns Scale matrix
 */
export function scale(sx: number, sy: number, sz: number): Matrix3x3 {
  return [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, sz],
  ]
}

/**
 * Creates a uniform scale matrix
 * @param k Scale factor (applied to all axes)
 * @returns Uniform scale matrix
 */
export function uniformScale(k: number): Matrix3x3 {
  return scale(k, k, k)
}

// ============================================================================
// Matrix Operations
// ============================================================================

/**
 * Multiplies two 3×3 matrices
 * @param a First matrix (left)
 * @param b Second matrix (right)
 * @returns Result matrix a × b
 */
export function multiply(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
      a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2],
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
      a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2],
    ],
    [
      a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
      a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
      a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2],
    ],
  ]
}

/**
 * Transforms a 3D vector by a matrix
 * @param m Transformation matrix
 * @param v Vector to transform
 * @returns Transformed vector M × v
 */
export function multiplyVector(m: Matrix3x3, v: Vector3D): Vector3D {
  return {
    x: m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z,
    y: m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z,
    z: m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z,
  }
}

/**
 * Calculates the determinant of a 3×3 matrix
 * @param m Matrix
 * @returns Determinant det(M)
 */
export function determinant(m: Matrix3x3): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  )
}

/**
 * Returns the transpose of a 3×3 matrix
 * @param m Matrix
 * @returns Transpose M^T
 */
export function transpose(m: Matrix3x3): Matrix3x3 {
  return [
    [m[0][0], m[1][0], m[2][0]],
    [m[0][1], m[1][1], m[2][1]],
    [m[0][2], m[1][2], m[2][2]],
  ]
}

/**
 * Returns the trace of a 3×3 matrix
 * @param m Matrix
 * @returns Trace tr(M) = sum of diagonal elements
 */
export function trace(m: Matrix3x3): number {
  return m[0][0] + m[1][1] + m[2][2]
}

// ============================================================================
// Matrix Analysis
// ============================================================================

/**
 * Checks if the matrix is the identity matrix
 * @param m Matrix to check
 * @param tolerance Comparison tolerance (default: MATRIX3D_TOLERANCE)
 * @returns True if m ≈ I
 */
export function isIdentity(m: Matrix3x3, tolerance: number = MATRIX3D_TOLERANCE): boolean {
  // Check diagonal elements are 1
  if (Math.abs(m[0][0] - 1) >= tolerance) return false
  if (Math.abs(m[1][1] - 1) >= tolerance) return false
  if (Math.abs(m[2][2] - 1) >= tolerance) return false

  // Check off-diagonal elements are 0
  if (Math.abs(m[0][1]) >= tolerance) return false
  if (Math.abs(m[0][2]) >= tolerance) return false
  if (Math.abs(m[1][0]) >= tolerance) return false
  if (Math.abs(m[1][2]) >= tolerance) return false
  if (Math.abs(m[2][0]) >= tolerance) return false
  if (Math.abs(m[2][1]) >= tolerance) return false

  return true
}

/**
 * Checks if the matrix is orthogonal (M × M^T = I)
 * Orthogonal matrices preserve lengths and angles (rotations/reflections).
 * @param m Matrix to check
 * @param tolerance Comparison tolerance (default: MATRIX3D_TOLERANCE)
 * @returns True if M is orthogonal
 */
export function isOrthogonal(m: Matrix3x3, tolerance: number = MATRIX3D_TOLERANCE): boolean {
  const mt = transpose(m)
  const product = multiply(m, mt)
  return isIdentity(product, tolerance)
}

/**
 * Checks if the matrix is a pure rotation (orthogonal with det = 1)
 * @param m Matrix to check
 * @param tolerance Comparison tolerance (default: MATRIX3D_TOLERANCE)
 * @returns True if M is a rotation matrix
 */
export function isRotation(m: Matrix3x3, tolerance: number = MATRIX3D_TOLERANCE): boolean {
  if (!isOrthogonal(m, tolerance)) {
    return false
  }
  const det = determinant(m)
  return Math.abs(det - 1) < tolerance
}

/**
 * Checks if two matrices are approximately equal
 * @param a First matrix
 * @param b Second matrix
 * @param tolerance Comparison tolerance (default: MATRIX3D_TOLERANCE)
 * @returns True if all elements are within tolerance
 */
export function matrixEquals(
  a: Matrix3x3,
  b: Matrix3x3,
  tolerance: number = MATRIX3D_TOLERANCE,
): boolean {
  // Row 0
  if (Math.abs(a[0][0] - b[0][0]) >= tolerance) return false
  if (Math.abs(a[0][1] - b[0][1]) >= tolerance) return false
  if (Math.abs(a[0][2] - b[0][2]) >= tolerance) return false

  // Row 1
  if (Math.abs(a[1][0] - b[1][0]) >= tolerance) return false
  if (Math.abs(a[1][1] - b[1][1]) >= tolerance) return false
  if (Math.abs(a[1][2] - b[1][2]) >= tolerance) return false

  // Row 2
  if (Math.abs(a[2][0] - b[2][0]) >= tolerance) return false
  if (Math.abs(a[2][1] - b[2][1]) >= tolerance) return false
  if (Math.abs(a[2][2] - b[2][2]) >= tolerance) return false

  return true
}

// ============================================================================
// Euler Angles
// ============================================================================

/**
 * Creates a rotation matrix from Euler angles (XYZ order)
 * The rotations are applied in order: Rz × Ry × Rx
 *
 * @param rx Rotation around X-axis in degrees (pitch)
 * @param ry Rotation around Y-axis in degrees (yaw)
 * @param rz Rotation around Z-axis in degrees (roll)
 * @returns Combined rotation matrix
 */
export function fromEulerAngles(rx: number, ry: number, rz: number): Matrix3x3 {
  const Rx = rotationX(rx)
  const Ry = rotationY(ry)
  const Rz = rotationZ(rz)
  // Apply in order: first Rx, then Ry, then Rz
  return multiply(Rz, multiply(Ry, Rx))
}

/**
 * Extracts Euler angles from a rotation matrix (XYZ order)
 * Note: This extraction can have gimbal lock issues when pitch is ±90°
 *
 * @param m Rotation matrix
 * @returns Euler angles in degrees { rx, ry, rz }
 */
export function toEulerAngles(m: Matrix3x3): { rx: number; ry: number; rz: number } {
  const toDegrees = (rad: number) => (rad * 180) / Math.PI

  // Extract angles assuming XYZ order (intrinsic)
  // This follows the convention: R = Rz * Ry * Rx

  // Check for gimbal lock (m[2][0] ≈ ±1)
  if (Math.abs(m[2][0]) > 1 - MATRIX3D_TOLERANCE) {
    // Gimbal lock: pitch is ±90°
    const ry = m[2][0] > 0 ? -90 : 90
    // Set rz to 0 and solve for rx
    const rx = toDegrees(Math.atan2(-m[0][1], m[1][1]))
    return { rx, ry, rz: 0 }
  }

  const ry = toDegrees(Math.asin(-m[2][0]))
  const rx = toDegrees(Math.atan2(m[2][1], m[2][2]))
  const rz = toDegrees(Math.atan2(m[1][0], m[0][0]))

  return { rx, ry, rz }
}

// ============================================================================
// Formatting
// ============================================================================

/**
 * Format a matrix as a multi-line string
 * @param m Matrix to format
 * @param precision Number of decimal places (default: 2)
 * @returns Formatted string representation
 */
export function toString(m: Matrix3x3, precision: number = 2): string {
  return m.map((row) => `[${row.map((v) => v.toFixed(precision)).join(', ')}]`).join('\n')
}

// ============================================================================
// Preset Data
// ============================================================================

/**
 * Preset 3D rotation transformations for educational demonstrations
 */
export const ROTATION3D_PRESETS: Rotation3DPreset[] = [
  {
    id: 'identity',
    name: 'Identity',
    description: 'No transformation',
    type: 'identity',
    matrix: identity(),
    parameters: { rx: 0, ry: 0, rz: 0 },
  },
  {
    id: 'rotate-x-90',
    name: 'Rotate X 90°',
    description: 'Rotate 90° around X-axis (pitch up)',
    type: 'rotationX',
    matrix: rotationX(90),
    parameters: { rx: 90, ry: 0, rz: 0 },
  },
  {
    id: 'rotate-y-90',
    name: 'Rotate Y 90°',
    description: 'Rotate 90° around Y-axis (yaw right)',
    type: 'rotationY',
    matrix: rotationY(90),
    parameters: { rx: 0, ry: 90, rz: 0 },
  },
  {
    id: 'rotate-z-90',
    name: 'Rotate Z 90°',
    description: 'Rotate 90° around Z-axis (roll)',
    type: 'rotationZ',
    matrix: rotationZ(90),
    parameters: { rx: 0, ry: 0, rz: 90 },
  },
  {
    id: 'rotate-x-45',
    name: 'Rotate X 45°',
    description: 'Rotate 45° around X-axis',
    type: 'rotationX',
    matrix: rotationX(45),
    parameters: { rx: 45, ry: 0, rz: 0 },
  },
  {
    id: 'rotate-y-45',
    name: 'Rotate Y 45°',
    description: 'Rotate 45° around Y-axis',
    type: 'rotationY',
    matrix: rotationY(45),
    parameters: { rx: 0, ry: 45, rz: 0 },
  },
  {
    id: 'combined-xy',
    name: 'Combined X+Y 30°',
    description: 'Rotate 30° around X then 30° around Y',
    type: 'combined',
    matrix: fromEulerAngles(30, 30, 0),
    parameters: { rx: 30, ry: 30, rz: 0 },
  },
  {
    id: 'combined-xyz',
    name: 'Combined XYZ 45°',
    description: 'Rotate 45° around all axes',
    type: 'combined',
    matrix: fromEulerAngles(45, 45, 45),
    parameters: { rx: 45, ry: 45, rz: 45 },
  },
  {
    id: 'scale-2x',
    name: 'Scale 2×',
    description: 'Double the size uniformly',
    type: 'scale',
    matrix: uniformScale(2),
    parameters: { sx: 2, sy: 2, sz: 2 },
  },
  {
    id: 'scale-half',
    name: 'Scale 0.5×',
    description: 'Shrink to half size',
    type: 'scale',
    matrix: uniformScale(0.5),
    parameters: { sx: 0.5, sy: 0.5, sz: 0.5 },
  },
]

/**
 * Get a 3D rotation preset by ID
 * @param id Preset identifier
 * @returns The preset if found, undefined otherwise
 */
export function getRotation3DPreset(id: string): Rotation3DPreset | undefined {
  return ROTATION3D_PRESETS.find((preset) => preset.id === id)
}
