/**
 * Matrix math utilities for 2×2 matrices
 *
 * Provides core matrix operations for 2D linear transformations.
 * All angles are in degrees (D-090).
 */

import type { Matrix2x2, TransformationType, TransformationPreset, Vector2D } from '@/types/math'

// ============================================================================
// Constants
// ============================================================================

/** Tolerance for floating point comparisons */
export const MATRIX_TOLERANCE = 1e-10

// ============================================================================
// Validation
// ============================================================================

/**
 * Type guard to check if a value is a valid Matrix2x2
 * @param m Value to check
 * @returns True if m is a valid Matrix2x2
 */
export function isValidMatrix(m: unknown): m is Matrix2x2 {
  if (m === null || m === undefined || typeof m !== 'object') {
    return false
  }

  const obj = m as Record<string, unknown>

  if (!('a' in obj) || !('b' in obj) || !('c' in obj) || !('d' in obj)) {
    return false
  }

  if (
    typeof obj.a !== 'number' ||
    typeof obj.b !== 'number' ||
    typeof obj.c !== 'number' ||
    typeof obj.d !== 'number'
  ) {
    return false
  }

  // Check for NaN and Infinity
  if (
    !Number.isFinite(obj.a) ||
    !Number.isFinite(obj.b) ||
    !Number.isFinite(obj.c) ||
    !Number.isFinite(obj.d)
  ) {
    return false
  }

  return true
}

// ============================================================================
// Matrix Generators
// ============================================================================

/**
 * Creates the 2×2 identity matrix
 * @returns Identity matrix I = | 1 0 |
 *                              | 0 1 |
 */
export function identityMatrix(): Matrix2x2 {
  return { a: 1, b: 0, c: 0, d: 1 }
}

/**
 * Creates a rotation matrix for the given angle in degrees
 * @param angleDegrees Rotation angle in degrees (counter-clockwise)
 * @returns Rotation matrix R(θ) = | cos(θ) -sin(θ) |
 *                                 | sin(θ)  cos(θ) |
 */
export function rotationMatrix(angleDegrees: number): Matrix2x2 {
  const radians = (angleDegrees * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return {
    a: cos,
    b: -sin,
    c: sin,
    d: cos,
  }
}

/**
 * Creates a non-uniform scale matrix
 * @param sx Scale factor in x direction
 * @param sy Scale factor in y direction
 * @returns Scale matrix S = | sx 0  |
 *                           | 0  sy |
 */
export function scaleMatrix(sx: number, sy: number): Matrix2x2 {
  return { a: sx, b: 0, c: 0, d: sy }
}

/**
 * Creates a uniform scale matrix
 * @param k Scale factor (applied to both axes)
 * @returns Uniform scale matrix S = | k 0 |
 *                                   | 0 k |
 */
export function uniformScaleMatrix(k: number): Matrix2x2 {
  return { a: k, b: 0, c: 0, d: k }
}

/**
 * Creates a horizontal shear matrix
 * @param k Shear factor
 * @returns Shear matrix Sx = | 1 k |
 *                            | 0 1 |
 */
export function shearXMatrix(k: number): Matrix2x2 {
  return { a: 1, b: k, c: 0, d: 1 }
}

/**
 * Creates a vertical shear matrix
 * @param k Shear factor
 * @returns Shear matrix Sy = | 1 0 |
 *                            | k 1 |
 */
export function shearYMatrix(k: number): Matrix2x2 {
  return { a: 1, b: 0, c: k, d: 1 }
}

/**
 * Creates a reflection matrix over the x-axis
 * @returns Reflection matrix Rx = | 1  0 |
 *                                 | 0 -1 |
 */
export function reflectionXMatrix(): Matrix2x2 {
  return { a: 1, b: 0, c: 0, d: -1 }
}

/**
 * Creates a reflection matrix over the y-axis
 * @returns Reflection matrix Ry = | -1 0 |
 *                                 |  0 1 |
 */
export function reflectionYMatrix(): Matrix2x2 {
  return { a: -1, b: 0, c: 0, d: 1 }
}

/**
 * Creates a reflection matrix through the origin (180° rotation)
 * @returns Reflection matrix Ro = | -1  0 |
 *                                 |  0 -1 |
 */
export function reflectionOriginMatrix(): Matrix2x2 {
  return { a: -1, b: 0, c: 0, d: -1 }
}

// ============================================================================
// Matrix Operations
// ============================================================================

/**
 * Multiplies two 2×2 matrices
 * @param m1 First matrix (left)
 * @param m2 Second matrix (right)
 * @returns Result matrix m1 × m2
 */
export function matrixMultiply(m1: Matrix2x2, m2: Matrix2x2): Matrix2x2 {
  return {
    a: m1.a * m2.a + m1.b * m2.c,
    b: m1.a * m2.b + m1.b * m2.d,
    c: m1.c * m2.a + m1.d * m2.c,
    d: m1.c * m2.b + m1.d * m2.d,
  }
}

/**
 * Transforms a 2D vector by a matrix
 * @param m Transformation matrix
 * @param v Vector to transform
 * @returns Transformed vector M × v
 */
export function matrixVectorMultiply(m: Matrix2x2, v: Vector2D): Vector2D {
  return {
    x: m.a * v.x + m.b * v.y,
    y: m.c * v.x + m.d * v.y,
  }
}

/**
 * Calculates the determinant of a 2×2 matrix
 * @param m Matrix
 * @returns Determinant det(M) = ad - bc
 */
export function determinant(m: Matrix2x2): number {
  return m.a * m.d - m.b * m.c
}

/**
 * Calculates the trace of a 2×2 matrix
 * @param m Matrix
 * @returns Trace tr(M) = a + d
 */
export function trace(m: Matrix2x2): number {
  return m.a + m.d
}

/**
 * Returns the transpose of a 2×2 matrix
 * @param m Matrix
 * @returns Transpose M^T where (M^T)_ij = M_ji
 */
export function transpose(m: Matrix2x2): Matrix2x2 {
  return {
    a: m.a,
    b: m.c,
    c: m.b,
    d: m.d,
  }
}

/**
 * Returns the inverse of a 2×2 matrix, or null if singular
 * @param m Matrix
 * @returns Inverse M^(-1) or null if determinant is 0
 */
export function inverse(m: Matrix2x2): Matrix2x2 | null {
  const det = determinant(m)
  if (Math.abs(det) < MATRIX_TOLERANCE) {
    return null
  }
  const invDet = 1 / det
  return {
    a: m.d * invDet,
    b: -m.b * invDet,
    c: -m.c * invDet,
    d: m.a * invDet,
  }
}

// ============================================================================
// Matrix Analysis
// ============================================================================

/**
 * Checks if the matrix is the identity matrix
 * @param m Matrix to check
 * @param tolerance Comparison tolerance (default: MATRIX_TOLERANCE)
 * @returns True if m ≈ I
 */
export function isIdentity(m: Matrix2x2, tolerance: number = MATRIX_TOLERANCE): boolean {
  return (
    Math.abs(m.a - 1) < tolerance &&
    Math.abs(m.b) < tolerance &&
    Math.abs(m.c) < tolerance &&
    Math.abs(m.d - 1) < tolerance
  )
}

/**
 * Checks if the matrix is orthogonal (M × M^T = I)
 * Orthogonal matrices preserve lengths and angles (rotations/reflections).
 * @param m Matrix to check
 * @param tolerance Comparison tolerance (default: MATRIX_TOLERANCE)
 * @returns True if M is orthogonal
 */
export function isOrthogonal(m: Matrix2x2, tolerance: number = MATRIX_TOLERANCE): boolean {
  const mt = transpose(m)
  const product = matrixMultiply(m, mt)
  return isIdentity(product, tolerance)
}

/**
 * Checks if the matrix is symmetric (M = M^T)
 * @param m Matrix to check
 * @param tolerance Comparison tolerance (default: MATRIX_TOLERANCE)
 * @returns True if M is symmetric
 */
export function isSymmetric(m: Matrix2x2, tolerance: number = MATRIX_TOLERANCE): boolean {
  return Math.abs(m.b - m.c) < tolerance
}

/**
 * Checks if the matrix is singular (determinant ≈ 0)
 * @param m Matrix to check
 * @param tolerance Comparison tolerance (default: MATRIX_TOLERANCE)
 * @returns True if det(M) ≈ 0
 */
export function isSingular(m: Matrix2x2, tolerance: number = MATRIX_TOLERANCE): boolean {
  return Math.abs(determinant(m)) < tolerance
}

/**
 * Checks if two matrices are approximately equal
 * @param m1 First matrix
 * @param m2 Second matrix
 * @param tolerance Comparison tolerance (default: MATRIX_TOLERANCE)
 * @returns True if all elements are within tolerance
 */
export function matrixEquals(
  m1: Matrix2x2,
  m2: Matrix2x2,
  tolerance: number = MATRIX_TOLERANCE
): boolean {
  return (
    Math.abs(m1.a - m2.a) < tolerance &&
    Math.abs(m1.b - m2.b) < tolerance &&
    Math.abs(m1.c - m2.c) < tolerance &&
    Math.abs(m1.d - m2.d) < tolerance
  )
}

/**
 * Attempts to classify the transformation type of a matrix
 * @param m Matrix to classify
 * @returns The detected transformation type, or 'custom' if unrecognized
 */
export function getTransformationType(m: Matrix2x2): TransformationType {
  const det = determinant(m)
  const tolerance = MATRIX_TOLERANCE

  // Check identity first
  if (isIdentity(m, tolerance)) {
    return 'identity'
  }

  // Check reflections (orthogonal with det = -1)
  if (isOrthogonal(m, tolerance) && Math.abs(det + 1) < tolerance) {
    // Reflect over x-axis: | 1  0 |
    //                      | 0 -1 |
    if (
      Math.abs(m.a - 1) < tolerance &&
      Math.abs(m.b) < tolerance &&
      Math.abs(m.c) < tolerance &&
      Math.abs(m.d + 1) < tolerance
    ) {
      return 'reflectX'
    }
    // Reflect over y-axis: | -1 0 |
    //                      |  0 1 |
    if (
      Math.abs(m.a + 1) < tolerance &&
      Math.abs(m.b) < tolerance &&
      Math.abs(m.c) < tolerance &&
      Math.abs(m.d - 1) < tolerance
    ) {
      return 'reflectY'
    }
  }

  // Check reflection through origin (det = 1, but -I)
  if (
    Math.abs(m.a + 1) < tolerance &&
    Math.abs(m.b) < tolerance &&
    Math.abs(m.c) < tolerance &&
    Math.abs(m.d + 1) < tolerance
  ) {
    return 'reflectOrigin'
  }

  // Check rotation (orthogonal with det = 1, not identity)
  if (isOrthogonal(m, tolerance) && Math.abs(det - 1) < tolerance) {
    // Rotation has form | cos -sin |
    //                   | sin  cos |
    // Check a = d and b = -c
    if (Math.abs(m.a - m.d) < tolerance && Math.abs(m.b + m.c) < tolerance) {
      return 'rotation'
    }
  }

  // Check shear (det = 1, one off-diagonal non-zero)
  if (Math.abs(det - 1) < tolerance) {
    // Shear X: | 1 k |
    //          | 0 1 |
    if (
      Math.abs(m.a - 1) < tolerance &&
      Math.abs(m.c) < tolerance &&
      Math.abs(m.d - 1) < tolerance &&
      Math.abs(m.b) > tolerance
    ) {
      return 'shearX'
    }
    // Shear Y: | 1 0 |
    //          | k 1 |
    if (
      Math.abs(m.a - 1) < tolerance &&
      Math.abs(m.b) < tolerance &&
      Math.abs(m.d - 1) < tolerance &&
      Math.abs(m.c) > tolerance
    ) {
      return 'shearY'
    }
  }

  // Check scale (diagonal matrix)
  if (Math.abs(m.b) < tolerance && Math.abs(m.c) < tolerance) {
    // Uniform scale: sx = sy
    if (Math.abs(m.a - m.d) < tolerance) {
      return 'uniformScale'
    }
    return 'scale'
  }

  return 'custom'
}

// ============================================================================
// Preset Data
// ============================================================================

/**
 * Standard transformation presets for the widget
 */
export const TRANSFORMATION_PRESETS: TransformationPreset[] = [
  {
    id: 'identity',
    name: 'Identity',
    description: 'No transformation - vectors unchanged',
    type: 'identity',
    matrix: { a: 1, b: 0, c: 0, d: 1 },
  },
  {
    id: 'rotate-45',
    name: 'Rotate 45°',
    description: 'Rotate counter-clockwise by 45 degrees',
    type: 'rotation',
    matrix: rotationMatrix(45),
    parameters: { angle: 45 },
  },
  {
    id: 'rotate-90',
    name: 'Rotate 90°',
    description: 'Rotate counter-clockwise by 90 degrees',
    type: 'rotation',
    matrix: rotationMatrix(90),
    parameters: { angle: 90 },
  },
  {
    id: 'rotate-180',
    name: 'Rotate 180°',
    description: 'Rotate by 180 degrees (half turn)',
    type: 'rotation',
    matrix: rotationMatrix(180),
    parameters: { angle: 180 },
  },
  {
    id: 'scale-2x',
    name: 'Scale 2×',
    description: 'Double the size uniformly',
    type: 'uniformScale',
    matrix: { a: 2, b: 0, c: 0, d: 2 },
    parameters: { k: 2 },
  },
  {
    id: 'scale-half',
    name: 'Scale 0.5×',
    description: 'Shrink to half size',
    type: 'uniformScale',
    matrix: { a: 0.5, b: 0, c: 0, d: 0.5 },
    parameters: { k: 0.5 },
  },
  {
    id: 'stretch-x',
    name: 'Stretch X',
    description: 'Stretch horizontally by 2, keep vertical',
    type: 'scale',
    matrix: { a: 2, b: 0, c: 0, d: 1 },
    parameters: { sx: 2, sy: 1 },
  },
  {
    id: 'stretch-y',
    name: 'Stretch Y',
    description: 'Stretch vertically by 2, keep horizontal',
    type: 'scale',
    matrix: { a: 1, b: 0, c: 0, d: 2 },
    parameters: { sx: 1, sy: 2 },
  },
  {
    id: 'shear-x',
    name: 'Shear X',
    description: 'Slant horizontally (shear factor 0.5)',
    type: 'shearX',
    matrix: { a: 1, b: 0.5, c: 0, d: 1 },
    parameters: { k: 0.5 },
  },
  {
    id: 'shear-y',
    name: 'Shear Y',
    description: 'Slant vertically (shear factor 0.5)',
    type: 'shearY',
    matrix: { a: 1, b: 0, c: 0.5, d: 1 },
    parameters: { k: 0.5 },
  },
  {
    id: 'reflect-x',
    name: 'Reflect X-axis',
    description: 'Flip over the x-axis',
    type: 'reflectX',
    matrix: { a: 1, b: 0, c: 0, d: -1 },
  },
  {
    id: 'reflect-y',
    name: 'Reflect Y-axis',
    description: 'Flip over the y-axis',
    type: 'reflectY',
    matrix: { a: -1, b: 0, c: 0, d: 1 },
  },
  {
    id: 'reflect-origin',
    name: 'Reflect Origin',
    description: 'Point reflection through origin (180° rotation)',
    type: 'reflectOrigin',
    matrix: { a: -1, b: 0, c: 0, d: -1 },
  },
]

/**
 * Get a transformation preset by ID
 * @param id Preset identifier
 * @returns The preset if found, undefined otherwise
 */
export function getTransformationPreset(id: string): TransformationPreset | undefined {
  return TRANSFORMATION_PRESETS.find((preset) => preset.id === id)
}
