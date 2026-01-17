/**
 * Vector math utilities for 2D vectors
 *
 * Provides core vector operations for the Linear Algebra section.
 * All angles are returned in degrees (D-090).
 */

import type { Vector2D, VectorPreset } from '@/types/math'

// ============================================================================
// Constants
// ============================================================================

/** Tolerance for floating point comparisons */
export const VECTOR_TOLERANCE = 1e-10

/** Coordinate range for widget inputs (D-091) */
export const VECTOR_COORDINATE_RANGE = { min: -5, max: 5 }

// ============================================================================
// Core Operations
// ============================================================================

/**
 * Add two vectors component-wise
 * @param a First vector
 * @param b Second vector
 * @returns Sum vector (a + b)
 */
export function vectorAdd(a: Vector2D, b: Vector2D): Vector2D {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

/**
 * Subtract vector b from vector a
 * @param a First vector
 * @param b Second vector (subtracted)
 * @returns Difference vector (a - b)
 */
export function vectorSubtract(a: Vector2D, b: Vector2D): Vector2D {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}

/**
 * Multiply a vector by a scalar
 * @param v Vector to scale
 * @param k Scalar multiplier
 * @returns Scaled vector (k * v)
 */
export function scalarMultiply(v: Vector2D, k: number): Vector2D {
  return {
    x: v.x * k,
    y: v.y * k,
  }
}

/**
 * Compute the dot product of two vectors
 * @param a First vector
 * @param b Second vector
 * @returns Dot product (a · b = a₁b₁ + a₂b₂)
 */
export function dotProduct(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y
}

/**
 * Compute the magnitude (length) of a vector
 * @param v Vector
 * @returns Magnitude |v| = √(x² + y²)
 */
export function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

/**
 * Normalize a vector to unit length
 * @param v Vector to normalize
 * @returns Unit vector in same direction, or null if zero vector
 */
export function normalize(v: Vector2D): Vector2D | null {
  const mag = magnitude(v)
  if (mag < VECTOR_TOLERANCE) {
    return null
  }
  return {
    x: v.x / mag,
    y: v.y / mag,
  }
}

/**
 * Compute the angle between two vectors in degrees
 * @param a First vector
 * @param b Second vector
 * @returns Angle in degrees (0-180), or null if either vector is zero
 */
export function angleBetween(a: Vector2D, b: Vector2D): number | null {
  const magA = magnitude(a)
  const magB = magnitude(b)

  // Cannot compute angle with zero vector
  if (magA < VECTOR_TOLERANCE || magB < VECTOR_TOLERANCE) {
    return null
  }

  const dot = dotProduct(a, b)
  // Clamp to [-1, 1] to avoid NaN from floating point errors
  const cosTheta = Math.max(-1, Math.min(1, dot / (magA * magB)))
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
 * @param tolerance Comparison tolerance (default: VECTOR_TOLERANCE)
 * @returns True if vector is approximately (0, 0)
 */
export function isZeroVector(v: Vector2D, tolerance: number = VECTOR_TOLERANCE): boolean {
  return Math.abs(v.x) < tolerance && Math.abs(v.y) < tolerance
}

/**
 * Check if two vectors are parallel (same or opposite direction)
 * @param a First vector
 * @param b Second vector
 * @param tolerance Comparison tolerance (default: VECTOR_TOLERANCE)
 * @returns True if vectors are parallel
 */
export function isParallel(a: Vector2D, b: Vector2D, tolerance: number = VECTOR_TOLERANCE): boolean {
  // Zero vectors are not considered parallel to anything
  if (isZeroVector(a, tolerance) || isZeroVector(b, tolerance)) {
    return false
  }

  // Two 2D vectors are parallel if their cross product (z-component) is zero
  // Cross product z-component: a.x * b.y - a.y * b.x
  const cross = a.x * b.y - a.y * b.x
  return Math.abs(cross) < tolerance
}

/**
 * Check if two vectors are perpendicular
 * @param a First vector
 * @param b Second vector
 * @param tolerance Comparison tolerance (default: VECTOR_TOLERANCE)
 * @returns True if vectors are perpendicular (dot product ≈ 0)
 */
export function isPerpendicular(
  a: Vector2D,
  b: Vector2D,
  tolerance: number = VECTOR_TOLERANCE
): boolean {
  // Zero vectors are not considered perpendicular to anything
  if (isZeroVector(a, tolerance) || isZeroVector(b, tolerance)) {
    return false
  }

  const dot = dotProduct(a, b)
  return Math.abs(dot) < tolerance
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Type guard to check if a value is a valid Vector2D
 * @param v Value to check
 * @returns True if v is a valid Vector2D
 */
export function isValidVector(v: unknown): v is Vector2D {
  if (v === null || v === undefined || typeof v !== 'object') {
    return false
  }

  const obj = v as Record<string, unknown>

  if (!('x' in obj) || !('y' in obj)) {
    return false
  }

  if (typeof obj.x !== 'number' || typeof obj.y !== 'number') {
    return false
  }

  // Check for NaN
  if (Number.isNaN(obj.x) || Number.isNaN(obj.y)) {
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
export function clampVectorToRange(v: Vector2D, min: number, max: number): Vector2D {
  return {
    x: Math.max(min, Math.min(max, v.x)),
    y: Math.max(min, Math.min(max, v.y)),
  }
}

// ============================================================================
// Preset Data
// ============================================================================

/**
 * Preset vector pairs for educational demonstrations
 */
export const VECTOR_PRESETS: VectorPreset[] = [
  {
    id: 'unit-vectors',
    name: 'Unit Vectors',
    description: 'Standard basis î and ĵ',
    vectorA: { x: 1, y: 0 },
    vectorB: { x: 0, y: 1 },
  },
  {
    id: 'parallel',
    name: 'Parallel',
    description: 'Same direction, scalar multiple',
    vectorA: { x: 2, y: 3 },
    vectorB: { x: 4, y: 6 },
  },
  {
    id: 'perpendicular',
    name: 'Perpendicular',
    description: 'Dot product = 0',
    vectorA: { x: 3, y: 4 },
    vectorB: { x: -4, y: 3 },
  },
  {
    id: 'angle-45',
    name: '45° Angle',
    description: 'Clear angle calculation',
    vectorA: { x: 1, y: 0 },
    vectorB: { x: 1, y: 1 },
  },
  {
    id: 'opposite',
    name: 'Opposite',
    description: '180° apart',
    vectorA: { x: 2, y: 1 },
    vectorB: { x: -2, y: -1 },
  },
]

/**
 * Get a vector preset by ID
 * @param id Preset identifier
 * @returns The preset if found, undefined otherwise
 */
export function getVectorPreset(id: string): VectorPreset | undefined {
  return VECTOR_PRESETS.find((preset) => preset.id === id)
}
