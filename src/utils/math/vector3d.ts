/**
 * Vector math utilities for 3D vectors
 *
 * Provides core 3D vector operations for the Linear Algebra section (Phase 16).
 * All angles are returned in degrees (D-090).
 * Uses right-handed, Y-up coordinate system (D-122).
 */

import type { Vector3D, Vector3DPreset } from '@/types/math'

// ============================================================================
// Constants
// ============================================================================

/** Tolerance for floating point comparisons */
export const VECTOR3D_TOLERANCE = 1e-10

/** Coordinate range for widget inputs */
export const VECTOR3D_COORDINATE_RANGE = { min: -5, max: 5 }

// ============================================================================
// Core Operations
// ============================================================================

/**
 * Add two 3D vectors component-wise
 * @param a First vector
 * @param b Second vector
 * @returns Sum vector (a + b)
 */
export function add(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  }
}

/**
 * Subtract vector b from vector a
 * @param a First vector
 * @param b Second vector (subtracted)
 * @returns Difference vector (a - b)
 */
export function subtract(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  }
}

/**
 * Multiply a vector by a scalar
 * @param v Vector to scale
 * @param s Scalar multiplier
 * @returns Scaled vector (s * v)
 */
export function scale(v: Vector3D, s: number): Vector3D {
  return {
    x: v.x * s,
    y: v.y * s,
    z: v.z * s,
  }
}

/**
 * Compute the dot product of two 3D vectors
 * @param a First vector
 * @param b Second vector
 * @returns Dot product (a · b = a₁b₁ + a₂b₂ + a₃b₃)
 */
export function dot(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

/**
 * Compute the cross product of two 3D vectors
 * The result is perpendicular to both input vectors.
 * Uses right-hand rule: a × b points in the direction your thumb points
 * when curling fingers from a to b.
 *
 * @param a First vector
 * @param b Second vector
 * @returns Cross product vector (a × b)
 */
export function cross(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

/**
 * Compute the magnitude (length) of a 3D vector
 * @param v Vector
 * @returns Magnitude |v| = √(x² + y² + z²)
 */
export function magnitude(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
}

/**
 * Normalize a vector to unit length
 * @param v Vector to normalize
 * @returns Unit vector in same direction, or null if zero vector
 */
export function normalize(v: Vector3D): Vector3D | null {
  const mag = magnitude(v)
  if (mag < VECTOR3D_TOLERANCE) {
    return null
  }
  return {
    x: v.x / mag,
    y: v.y / mag,
    z: v.z / mag,
  }
}

/**
 * Compute the angle between two vectors in degrees
 * @param a First vector
 * @param b Second vector
 * @returns Angle in degrees (0-180), or null if either vector is zero
 */
export function angleBetween(a: Vector3D, b: Vector3D): number | null {
  const magA = magnitude(a)
  const magB = magnitude(b)

  // Cannot compute angle with zero vector
  if (magA < VECTOR3D_TOLERANCE || magB < VECTOR3D_TOLERANCE) {
    return null
  }

  const dotProd = dot(a, b)
  // Clamp to [-1, 1] to avoid NaN from floating point errors
  const cosTheta = Math.max(-1, Math.min(1, dotProd / (magA * magB)))
  const radians = Math.acos(cosTheta)

  // Convert to degrees (D-090)
  return radians * (180 / Math.PI)
}

// ============================================================================
// Analysis Functions
// ============================================================================

/**
 * Check if a vector is the zero vector
 * @param v Vector to check
 * @param tolerance Comparison tolerance (default: VECTOR3D_TOLERANCE)
 * @returns True if vector is approximately (0, 0, 0)
 */
export function isZeroVector(v: Vector3D, tolerance: number = VECTOR3D_TOLERANCE): boolean {
  return Math.abs(v.x) < tolerance && Math.abs(v.y) < tolerance && Math.abs(v.z) < tolerance
}

/**
 * Check if two vectors are parallel (same or opposite direction)
 * Two 3D vectors are parallel if their cross product is the zero vector.
 *
 * @param a First vector
 * @param b Second vector
 * @param tolerance Comparison tolerance (default: VECTOR3D_TOLERANCE)
 * @returns True if vectors are parallel
 */
export function isParallel(a: Vector3D, b: Vector3D, tolerance: number = VECTOR3D_TOLERANCE): boolean {
  // Zero vectors are not considered parallel to anything
  if (isZeroVector(a, tolerance) || isZeroVector(b, tolerance)) {
    return false
  }

  const crossProduct = cross(a, b)
  return isZeroVector(crossProduct, tolerance)
}

/**
 * Check if two vectors are perpendicular
 * @param a First vector
 * @param b Second vector
 * @param tolerance Comparison tolerance (default: VECTOR3D_TOLERANCE)
 * @returns True if vectors are perpendicular (dot product ≈ 0)
 */
export function isPerpendicular(
  a: Vector3D,
  b: Vector3D,
  tolerance: number = VECTOR3D_TOLERANCE,
): boolean {
  // Zero vectors are not considered perpendicular to anything
  if (isZeroVector(a, tolerance) || isZeroVector(b, tolerance)) {
    return false
  }

  const dotProd = dot(a, b)
  return Math.abs(dotProd) < tolerance
}

/**
 * Check if two vectors are approximately equal
 * @param a First vector
 * @param b Second vector
 * @param tolerance Comparison tolerance (default: VECTOR3D_TOLERANCE)
 * @returns True if all components are within tolerance
 */
export function equals(a: Vector3D, b: Vector3D, tolerance: number = VECTOR3D_TOLERANCE): boolean {
  return (
    Math.abs(a.x - b.x) < tolerance &&
    Math.abs(a.y - b.y) < tolerance &&
    Math.abs(a.z - b.z) < tolerance
  )
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Type guard to check if a value is a valid Vector3D
 * @param v Value to check
 * @returns True if v is a valid Vector3D
 */
export function isValidVector3D(v: unknown): v is Vector3D {
  if (v === null || v === undefined || typeof v !== 'object') {
    return false
  }

  const obj = v as Record<string, unknown>

  if (!('x' in obj) || !('y' in obj) || !('z' in obj)) {
    return false
  }

  if (typeof obj.x !== 'number' || typeof obj.y !== 'number' || typeof obj.z !== 'number') {
    return false
  }

  // Check for NaN
  if (Number.isNaN(obj.x) || Number.isNaN(obj.y) || Number.isNaN(obj.z)) {
    return false
  }

  return true
}

/**
 * Clamp vector components to a range
 * @param v Vector to clamp
 * @param min Minimum value for each component
 * @param max Maximum value for each component
 * @returns Vector with clamped components
 */
export function clampToRange(v: Vector3D, min: number, max: number): Vector3D {
  return {
    x: Math.max(min, Math.min(max, v.x)),
    y: Math.max(min, Math.min(max, v.y)),
    z: Math.max(min, Math.min(max, v.z)),
  }
}

// ============================================================================
// Formatting
// ============================================================================

/**
 * Format a vector as a string
 * @param v Vector to format
 * @param precision Number of decimal places (default: 2)
 * @returns Formatted string like "(1.00, 2.00, 3.00)"
 */
export function toString(v: Vector3D, precision: number = 2): string {
  return `(${v.x.toFixed(precision)}, ${v.y.toFixed(precision)}, ${v.z.toFixed(precision)})`
}

// ============================================================================
// Preset Data
// ============================================================================

/**
 * Preset 3D vector pairs for educational demonstrations
 */
export const VECTOR3D_PRESETS: Vector3DPreset[] = [
  {
    id: 'unit-vectors',
    name: 'Unit Vectors (î × ĵ = k̂)',
    description: 'Standard basis vectors: cross product gives k̂',
    vectorA: { x: 1, y: 0, z: 0 },
    vectorB: { x: 0, y: 1, z: 0 },
  },
  {
    id: 'perpendicular',
    name: 'Perpendicular',
    description: 'Dot product = 0',
    vectorA: { x: 1, y: 2, z: 3 },
    vectorB: { x: 5, y: -4, z: 1 },
  },
  {
    id: 'parallel',
    name: 'Parallel',
    description: 'Cross product = 0 (scalar multiple)',
    vectorA: { x: 1, y: 2, z: 1 },
    vectorB: { x: 2, y: 4, z: 2 },
  },
  {
    id: 'negative-quadrant',
    name: 'Negative Quadrant',
    description: 'Shows negative coordinate space',
    vectorA: { x: -2, y: 3, z: -1 },
    vectorB: { x: 1, y: -2, z: 3 },
  },
  {
    id: 'physical-vectors',
    name: 'Physical Vectors',
    description: 'Torque example: r × F',
    vectorA: { x: 3, y: 4, z: 0 },
    vectorB: { x: 0, y: 0, z: 5 },
  },
]

/**
 * Get a 3D vector preset by ID
 * @param id Preset identifier
 * @returns The preset if found, undefined otherwise
 */
export function getVector3DPreset(id: string): Vector3DPreset | undefined {
  return VECTOR3D_PRESETS.find((preset) => preset.id === id)
}
