import { describe, it, expect } from 'vitest'
import {
  // Constants
  MATRIX_TOLERANCE,
  TRANSFORMATION_PRESETS,
  // Validation
  isValidMatrix,
  // Generators
  identityMatrix,
  rotationMatrix,
  scaleMatrix,
  uniformScaleMatrix,
  shearXMatrix,
  shearYMatrix,
  reflectionXMatrix,
  reflectionYMatrix,
  reflectionOriginMatrix,
  // Operations
  matrixMultiply,
  matrixVectorMultiply,
  determinant,
  trace,
  transpose,
  inverse,
  // Analysis
  isIdentity,
  isOrthogonal,
  isSymmetric,
  isSingular,
  matrixEquals,
  getTransformationType,
  // Preset lookup
  getTransformationPreset,
} from './matrix'
import type { Matrix2x2 } from '@/types/math'

// ============================================================================
// Validation Tests
// ============================================================================

describe('Matrix2x2 Validation', () => {
  describe('isValidMatrix', () => {
    it('returns true for valid matrix', () => {
      expect(isValidMatrix({ a: 1, b: 2, c: 3, d: 4 })).toBe(true)
    })

    it('returns true for identity matrix', () => {
      expect(isValidMatrix({ a: 1, b: 0, c: 0, d: 1 })).toBe(true)
    })

    it('returns true for matrix with negative values', () => {
      expect(isValidMatrix({ a: -1, b: -2, c: -3, d: -4 })).toBe(true)
    })

    it('returns true for matrix with decimal values', () => {
      expect(isValidMatrix({ a: 0.5, b: 0.25, c: 0.125, d: 0.0625 })).toBe(true)
    })

    it('returns false for null', () => {
      expect(isValidMatrix(null)).toBe(false)
    })

    it('returns false for undefined', () => {
      expect(isValidMatrix(undefined)).toBe(false)
    })

    it('returns false for missing properties', () => {
      expect(isValidMatrix({ a: 1, b: 2, c: 3 })).toBe(false)
      expect(isValidMatrix({ a: 1, b: 2, d: 4 })).toBe(false)
      expect(isValidMatrix({ a: 1, c: 3, d: 4 })).toBe(false)
      expect(isValidMatrix({ b: 2, c: 3, d: 4 })).toBe(false)
    })

    it('returns false for NaN values', () => {
      expect(isValidMatrix({ a: NaN, b: 2, c: 3, d: 4 })).toBe(false)
      expect(isValidMatrix({ a: 1, b: NaN, c: 3, d: 4 })).toBe(false)
      expect(isValidMatrix({ a: 1, b: 2, c: NaN, d: 4 })).toBe(false)
      expect(isValidMatrix({ a: 1, b: 2, c: 3, d: NaN })).toBe(false)
    })

    it('returns false for Infinity values', () => {
      expect(isValidMatrix({ a: Infinity, b: 2, c: 3, d: 4 })).toBe(false)
      expect(isValidMatrix({ a: 1, b: -Infinity, c: 3, d: 4 })).toBe(false)
    })

    it('returns false for non-numeric values', () => {
      expect(isValidMatrix({ a: '1', b: 2, c: 3, d: 4 })).toBe(false)
      expect(isValidMatrix({ a: 1, b: true, c: 3, d: 4 })).toBe(false)
    })

    it('returns false for arrays', () => {
      expect(isValidMatrix([1, 2, 3, 4])).toBe(false)
    })

    it('returns false for primitives', () => {
      expect(isValidMatrix(42)).toBe(false)
      expect(isValidMatrix('matrix')).toBe(false)
      expect(isValidMatrix(true)).toBe(false)
    })
  })
})

// ============================================================================
// Generator Tests
// ============================================================================

describe('Matrix Generators', () => {
  describe('identityMatrix', () => {
    it('returns correct identity matrix', () => {
      const identity = identityMatrix()
      expect(identity).toEqual({ a: 1, b: 0, c: 0, d: 1 })
    })

    it('identity has determinant 1', () => {
      expect(determinant(identityMatrix())).toBe(1)
    })

    it('identity has trace 2', () => {
      expect(trace(identityMatrix())).toBe(2)
    })
  })

  describe('rotationMatrix', () => {
    it('creates correct 0° rotation (identity)', () => {
      const m = rotationMatrix(0)
      expect(m.a).toBeCloseTo(1)
      expect(m.b).toBeCloseTo(0)
      expect(m.c).toBeCloseTo(0)
      expect(m.d).toBeCloseTo(1)
    })

    it('creates correct 90° rotation', () => {
      const m = rotationMatrix(90)
      expect(m.a).toBeCloseTo(0)
      expect(m.b).toBeCloseTo(-1)
      expect(m.c).toBeCloseTo(1)
      expect(m.d).toBeCloseTo(0)
    })

    it('creates correct 45° rotation', () => {
      const m = rotationMatrix(45)
      const sqrt2over2 = Math.sqrt(2) / 2
      expect(m.a).toBeCloseTo(sqrt2over2)
      expect(m.b).toBeCloseTo(-sqrt2over2)
      expect(m.c).toBeCloseTo(sqrt2over2)
      expect(m.d).toBeCloseTo(sqrt2over2)
    })

    it('creates correct 180° rotation', () => {
      const m = rotationMatrix(180)
      expect(m.a).toBeCloseTo(-1)
      expect(m.b).toBeCloseTo(0)
      expect(m.c).toBeCloseTo(0)
      expect(m.d).toBeCloseTo(-1)
    })

    it('creates correct -90° rotation', () => {
      const m = rotationMatrix(-90)
      expect(m.a).toBeCloseTo(0)
      expect(m.b).toBeCloseTo(1)
      expect(m.c).toBeCloseTo(-1)
      expect(m.d).toBeCloseTo(0)
    })

    it('creates correct 360° rotation (back to identity)', () => {
      const m = rotationMatrix(360)
      expect(m.a).toBeCloseTo(1)
      expect(m.b).toBeCloseTo(0)
      expect(m.c).toBeCloseTo(0)
      expect(m.d).toBeCloseTo(1)
    })

    it('rotation matrices have determinant 1', () => {
      expect(determinant(rotationMatrix(0))).toBeCloseTo(1)
      expect(determinant(rotationMatrix(45))).toBeCloseTo(1)
      expect(determinant(rotationMatrix(90))).toBeCloseTo(1)
      expect(determinant(rotationMatrix(180))).toBeCloseTo(1)
      expect(determinant(rotationMatrix(270))).toBeCloseTo(1)
    })

    it('rotation matrices are orthogonal', () => {
      expect(isOrthogonal(rotationMatrix(0))).toBe(true)
      expect(isOrthogonal(rotationMatrix(30))).toBe(true)
      expect(isOrthogonal(rotationMatrix(45))).toBe(true)
      expect(isOrthogonal(rotationMatrix(90))).toBe(true)
      expect(isOrthogonal(rotationMatrix(135))).toBe(true)
    })
  })

  describe('scaleMatrix', () => {
    it('creates correct scale matrix', () => {
      const m = scaleMatrix(2, 3)
      expect(m).toEqual({ a: 2, b: 0, c: 0, d: 3 })
    })

    it('uniform scale when sx === sy', () => {
      const m = scaleMatrix(2, 2)
      expect(m).toEqual({ a: 2, b: 0, c: 0, d: 2 })
    })

    it('scale by 1 produces identity', () => {
      const m = scaleMatrix(1, 1)
      expect(isIdentity(m)).toBe(true)
    })

    it('determinant equals sx * sy', () => {
      expect(determinant(scaleMatrix(2, 3))).toBe(6)
      expect(determinant(scaleMatrix(0.5, 4))).toBe(2)
      expect(determinant(scaleMatrix(-2, 3))).toBe(-6)
    })
  })

  describe('uniformScaleMatrix', () => {
    it('creates correct uniform scale', () => {
      const m = uniformScaleMatrix(3)
      expect(m).toEqual({ a: 3, b: 0, c: 0, d: 3 })
    })

    it('scale by 1 produces identity', () => {
      expect(isIdentity(uniformScaleMatrix(1))).toBe(true)
    })

    it('determinant equals k²', () => {
      expect(determinant(uniformScaleMatrix(2))).toBe(4)
      expect(determinant(uniformScaleMatrix(3))).toBe(9)
      expect(determinant(uniformScaleMatrix(0.5))).toBe(0.25)
    })
  })

  describe('shearXMatrix', () => {
    it('creates correct shear matrix', () => {
      const m = shearXMatrix(0.5)
      expect(m).toEqual({ a: 1, b: 0.5, c: 0, d: 1 })
    })

    it('shear by 0 produces identity', () => {
      expect(isIdentity(shearXMatrix(0))).toBe(true)
    })

    it('shear matrices have determinant 1', () => {
      expect(determinant(shearXMatrix(0.5))).toBe(1)
      expect(determinant(shearXMatrix(2))).toBe(1)
      expect(determinant(shearXMatrix(-1))).toBe(1)
    })
  })

  describe('shearYMatrix', () => {
    it('creates correct shear matrix', () => {
      const m = shearYMatrix(0.5)
      expect(m).toEqual({ a: 1, b: 0, c: 0.5, d: 1 })
    })

    it('shear by 0 produces identity', () => {
      expect(isIdentity(shearYMatrix(0))).toBe(true)
    })

    it('shear matrices have determinant 1', () => {
      expect(determinant(shearYMatrix(0.5))).toBe(1)
      expect(determinant(shearYMatrix(2))).toBe(1)
      expect(determinant(shearYMatrix(-1))).toBe(1)
    })
  })

  describe('reflectionXMatrix', () => {
    it('creates correct reflection matrix', () => {
      const m = reflectionXMatrix()
      expect(m).toEqual({ a: 1, b: 0, c: 0, d: -1 })
    })

    it('has determinant -1', () => {
      expect(determinant(reflectionXMatrix())).toBe(-1)
    })

    it('is orthogonal', () => {
      expect(isOrthogonal(reflectionXMatrix())).toBe(true)
    })

    it('is its own inverse (involutory)', () => {
      const m = reflectionXMatrix()
      const m2 = matrixMultiply(m, m)
      expect(isIdentity(m2)).toBe(true)
    })
  })

  describe('reflectionYMatrix', () => {
    it('creates correct reflection matrix', () => {
      const m = reflectionYMatrix()
      expect(m).toEqual({ a: -1, b: 0, c: 0, d: 1 })
    })

    it('has determinant -1', () => {
      expect(determinant(reflectionYMatrix())).toBe(-1)
    })

    it('is orthogonal', () => {
      expect(isOrthogonal(reflectionYMatrix())).toBe(true)
    })

    it('is its own inverse (involutory)', () => {
      const m = reflectionYMatrix()
      const m2 = matrixMultiply(m, m)
      expect(isIdentity(m2)).toBe(true)
    })
  })

  describe('reflectionOriginMatrix', () => {
    it('creates correct reflection matrix', () => {
      const m = reflectionOriginMatrix()
      expect(m).toEqual({ a: -1, b: 0, c: 0, d: -1 })
    })

    it('has determinant 1', () => {
      expect(determinant(reflectionOriginMatrix())).toBe(1)
    })

    it('is orthogonal', () => {
      expect(isOrthogonal(reflectionOriginMatrix())).toBe(true)
    })

    it('equivalent to 180° rotation', () => {
      const reflection = reflectionOriginMatrix()
      const rotation = rotationMatrix(180)
      expect(matrixEquals(reflection, rotation)).toBe(true)
    })
  })
})

// ============================================================================
// Operation Tests
// ============================================================================

describe('Matrix Operations', () => {
  describe('matrixMultiply', () => {
    it('multiplies identity correctly (left identity)', () => {
      const m: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const result = matrixMultiply(identityMatrix(), m)
      expect(result).toEqual(m)
    })

    it('multiplies identity correctly (right identity)', () => {
      const m: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const result = matrixMultiply(m, identityMatrix())
      expect(result).toEqual(m)
    })

    it('computes standard multiplication', () => {
      // | 1 2 | × | 5 6 | = | 1*5+2*7  1*6+2*8 | = | 19 22 |
      // | 3 4 |   | 7 8 |   | 3*5+4*7  3*6+4*8 |   | 43 50 |
      const m1: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const m2: Matrix2x2 = { a: 5, b: 6, c: 7, d: 8 }
      const result = matrixMultiply(m1, m2)
      expect(result).toEqual({ a: 19, b: 22, c: 43, d: 50 })
    })

    it('is associative: (AB)C = A(BC)', () => {
      const a: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const b: Matrix2x2 = { a: 5, b: 6, c: 7, d: 8 }
      const c: Matrix2x2 = { a: 9, b: 10, c: 11, d: 12 }

      const ab_c = matrixMultiply(matrixMultiply(a, b), c)
      const a_bc = matrixMultiply(a, matrixMultiply(b, c))

      expect(ab_c.a).toBeCloseTo(a_bc.a)
      expect(ab_c.b).toBeCloseTo(a_bc.b)
      expect(ab_c.c).toBeCloseTo(a_bc.c)
      expect(ab_c.d).toBeCloseTo(a_bc.d)
    })

    it('is NOT commutative: AB ≠ BA', () => {
      const m1: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const m2: Matrix2x2 = { a: 5, b: 6, c: 7, d: 8 }

      const ab = matrixMultiply(m1, m2)
      const ba = matrixMultiply(m2, m1)

      // Check that at least one element differs
      const isDifferent =
        ab.a !== ba.a || ab.b !== ba.b || ab.c !== ba.c || ab.d !== ba.d
      expect(isDifferent).toBe(true)
    })

    it('rotation followed by rotation equals combined rotation', () => {
      const r30 = rotationMatrix(30)
      const r45 = rotationMatrix(45)
      const r75 = rotationMatrix(75)

      const combined = matrixMultiply(r45, r30) // Apply r30 first, then r45
      expect(matrixEquals(combined, r75)).toBe(true)
    })
  })

  describe('matrixVectorMultiply', () => {
    it('identity matrix leaves vector unchanged', () => {
      const v = { x: 3, y: 4 }
      const result = matrixVectorMultiply(identityMatrix(), v)
      expect(result).toEqual(v)
    })

    it('correctly transforms vector', () => {
      // | 2 0 | × | 3 | = | 6  |
      // | 0 3 |   | 4 |   | 12 |
      const m: Matrix2x2 = { a: 2, b: 0, c: 0, d: 3 }
      const v = { x: 3, y: 4 }
      const result = matrixVectorMultiply(m, v)
      expect(result).toEqual({ x: 6, y: 12 })
    })

    it('90° rotation transforms (1,0) to (0,1)', () => {
      const m = rotationMatrix(90)
      const v = { x: 1, y: 0 }
      const result = matrixVectorMultiply(m, v)
      expect(result.x).toBeCloseTo(0)
      expect(result.y).toBeCloseTo(1)
    })

    it('90° rotation transforms (0,1) to (-1,0)', () => {
      const m = rotationMatrix(90)
      const v = { x: 0, y: 1 }
      const result = matrixVectorMultiply(m, v)
      expect(result.x).toBeCloseTo(-1)
      expect(result.y).toBeCloseTo(0)
    })

    it('scale matrix scales vector components', () => {
      const m = scaleMatrix(2, 3)
      const v = { x: 5, y: 7 }
      const result = matrixVectorMultiply(m, v)
      expect(result).toEqual({ x: 10, y: 21 })
    })

    it('shear X matrix transforms correctly', () => {
      // | 1 0.5 | × | 2 | = | 2 + 0.5*4 | = | 4 |
      // | 0 1   |   | 4 |   | 4         |   | 4 |
      const m = shearXMatrix(0.5)
      const v = { x: 2, y: 4 }
      const result = matrixVectorMultiply(m, v)
      expect(result).toEqual({ x: 4, y: 4 })
    })

    it('reflection X flips y component', () => {
      const m = reflectionXMatrix()
      const v = { x: 3, y: 4 }
      const result = matrixVectorMultiply(m, v)
      expect(result).toEqual({ x: 3, y: -4 })
    })

    it('reflection Y flips x component', () => {
      const m = reflectionYMatrix()
      const v = { x: 3, y: 4 }
      const result = matrixVectorMultiply(m, v)
      expect(result).toEqual({ x: -3, y: 4 })
    })
  })

  describe('determinant', () => {
    it('calculates identity determinant as 1', () => {
      expect(determinant(identityMatrix())).toBe(1)
    })

    it('calculates standard determinant', () => {
      // det(| 1 2 |) = 1*4 - 2*3 = -2
      //     | 3 4 |
      const m: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      expect(determinant(m)).toBe(-2)
    })

    it('singular matrix has determinant 0', () => {
      // Rows are linearly dependent
      const m: Matrix2x2 = { a: 1, b: 2, c: 2, d: 4 }
      expect(determinant(m)).toBe(0)
    })

    it('det(AB) = det(A) * det(B)', () => {
      const a: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const b: Matrix2x2 = { a: 5, b: 6, c: 7, d: 8 }

      const detA = determinant(a)
      const detB = determinant(b)
      const detAB = determinant(matrixMultiply(a, b))

      expect(detAB).toBeCloseTo(detA * detB)
    })

    it('det(kA) = k² * det(A) for 2x2', () => {
      const a: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const k = 3
      const kA: Matrix2x2 = { a: k * a.a, b: k * a.b, c: k * a.c, d: k * a.d }

      expect(determinant(kA)).toBeCloseTo(k * k * determinant(a))
    })
  })

  describe('trace', () => {
    it('calculates identity trace as 2', () => {
      expect(trace(identityMatrix())).toBe(2)
    })

    it('calculates standard trace', () => {
      const m: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      expect(trace(m)).toBe(5)
    })

    it('trace is sum of diagonal elements', () => {
      const m: Matrix2x2 = { a: 7, b: 99, c: 99, d: 3 }
      expect(trace(m)).toBe(10)
    })

    it('tr(A + B) = tr(A) + tr(B)', () => {
      const a: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const b: Matrix2x2 = { a: 5, b: 6, c: 7, d: 8 }
      const sum: Matrix2x2 = {
        a: a.a + b.a,
        b: a.b + b.b,
        c: a.c + b.c,
        d: a.d + b.d,
      }

      expect(trace(sum)).toBe(trace(a) + trace(b))
    })
  })

  describe('transpose', () => {
    it('transposes correctly', () => {
      const m: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const mt = transpose(m)
      expect(mt).toEqual({ a: 1, b: 3, c: 2, d: 4 })
    })

    it('double transpose returns original', () => {
      const m: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const mtt = transpose(transpose(m))
      expect(mtt).toEqual(m)
    })

    it('symmetric matrix equals its transpose', () => {
      const m: Matrix2x2 = { a: 1, b: 2, c: 2, d: 4 }
      expect(transpose(m)).toEqual(m)
    })

    it('identity is symmetric', () => {
      const identity = identityMatrix()
      expect(transpose(identity)).toEqual(identity)
    })
  })

  describe('inverse', () => {
    it('returns null for singular matrix', () => {
      const m: Matrix2x2 = { a: 1, b: 2, c: 2, d: 4 } // det = 0
      expect(inverse(m)).toBeNull()
    })

    it('returns null for zero matrix', () => {
      const m: Matrix2x2 = { a: 0, b: 0, c: 0, d: 0 }
      expect(inverse(m)).toBeNull()
    })

    it('calculates correct inverse', () => {
      // | 1 2 |  inverse = 1/det * | 4 -2 | = | -2  1   |
      // | 3 4 |                    | -3 1 |   | 1.5 -0.5 |
      // det = 1*4 - 2*3 = -2
      const m: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const inv = inverse(m)
      expect(inv).not.toBeNull()
      expect(inv!.a).toBeCloseTo(-2)
      expect(inv!.b).toBeCloseTo(1)
      expect(inv!.c).toBeCloseTo(1.5)
      expect(inv!.d).toBeCloseTo(-0.5)
    })

    it('M × M⁻¹ = I', () => {
      const m: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const inv = inverse(m)
      expect(inv).not.toBeNull()

      const product = matrixMultiply(m, inv!)
      expect(isIdentity(product)).toBe(true)
    })

    it('M⁻¹ × M = I', () => {
      const m: Matrix2x2 = { a: 2, b: 1, c: 1, d: 1 }
      const inv = inverse(m)
      expect(inv).not.toBeNull()

      const product = matrixMultiply(inv!, m)
      expect(isIdentity(product)).toBe(true)
    })

    it('identity is its own inverse', () => {
      const identity = identityMatrix()
      const inv = inverse(identity)
      expect(inv).not.toBeNull()
      expect(isIdentity(inv!)).toBe(true)
    })

    it('(AB)⁻¹ = B⁻¹A⁻¹', () => {
      const a: Matrix2x2 = { a: 2, b: 1, c: 1, d: 1 }
      const b: Matrix2x2 = { a: 1, b: 2, c: 0, d: 1 }

      const ab = matrixMultiply(a, b)
      const invAB = inverse(ab)
      const invA = inverse(a)
      const invB = inverse(b)

      expect(invAB).not.toBeNull()
      expect(invA).not.toBeNull()
      expect(invB).not.toBeNull()

      const invB_invA = matrixMultiply(invB!, invA!)
      expect(matrixEquals(invAB!, invB_invA)).toBe(true)
    })
  })
})

// ============================================================================
// Analysis Tests
// ============================================================================

describe('Matrix Analysis', () => {
  describe('isIdentity', () => {
    it('returns true for identity matrix', () => {
      expect(isIdentity(identityMatrix())).toBe(true)
    })

    it('returns false for non-identity', () => {
      expect(isIdentity({ a: 2, b: 0, c: 0, d: 1 })).toBe(false)
      expect(isIdentity({ a: 1, b: 1, c: 0, d: 1 })).toBe(false)
      expect(isIdentity({ a: 1, b: 0, c: 1, d: 1 })).toBe(false)
      expect(isIdentity({ a: 1, b: 0, c: 0, d: 2 })).toBe(false)
    })

    it('respects tolerance', () => {
      const almostIdentity: Matrix2x2 = {
        a: 1 + 1e-11,
        b: 1e-11,
        c: -1e-11,
        d: 1 - 1e-11,
      }
      expect(isIdentity(almostIdentity, MATRIX_TOLERANCE)).toBe(true)
      expect(isIdentity(almostIdentity, 1e-12)).toBe(false)
    })
  })

  describe('isOrthogonal', () => {
    it('returns true for rotation matrices', () => {
      expect(isOrthogonal(rotationMatrix(0))).toBe(true)
      expect(isOrthogonal(rotationMatrix(30))).toBe(true)
      expect(isOrthogonal(rotationMatrix(90))).toBe(true)
      expect(isOrthogonal(rotationMatrix(180))).toBe(true)
    })

    it('returns true for reflection matrices', () => {
      expect(isOrthogonal(reflectionXMatrix())).toBe(true)
      expect(isOrthogonal(reflectionYMatrix())).toBe(true)
      expect(isOrthogonal(reflectionOriginMatrix())).toBe(true)
    })

    it('returns true for identity', () => {
      expect(isOrthogonal(identityMatrix())).toBe(true)
    })

    it('returns false for scale matrices (k ≠ 1)', () => {
      expect(isOrthogonal(uniformScaleMatrix(2))).toBe(false)
      expect(isOrthogonal(scaleMatrix(2, 3))).toBe(false)
    })

    it('returns false for shear matrices', () => {
      expect(isOrthogonal(shearXMatrix(0.5))).toBe(false)
      expect(isOrthogonal(shearYMatrix(0.5))).toBe(false)
    })
  })

  describe('isSymmetric', () => {
    it('returns true for symmetric matrices', () => {
      expect(isSymmetric({ a: 1, b: 2, c: 2, d: 3 })).toBe(true)
      expect(isSymmetric(identityMatrix())).toBe(true)
      expect(isSymmetric(uniformScaleMatrix(2))).toBe(true)
    })

    it('returns false for non-symmetric matrices', () => {
      expect(isSymmetric({ a: 1, b: 2, c: 3, d: 4 })).toBe(false)
      expect(isSymmetric(rotationMatrix(45))).toBe(false)
    })
  })

  describe('isSingular', () => {
    it('returns true for zero matrix', () => {
      expect(isSingular({ a: 0, b: 0, c: 0, d: 0 })).toBe(true)
    })

    it('returns true for dependent rows', () => {
      // Second row is 2× first row
      expect(isSingular({ a: 1, b: 2, c: 2, d: 4 })).toBe(true)
    })

    it('returns true for dependent columns', () => {
      // Second column is 3× first column
      expect(isSingular({ a: 1, b: 3, c: 2, d: 6 })).toBe(true)
    })

    it('returns false for identity', () => {
      expect(isSingular(identityMatrix())).toBe(false)
    })

    it('returns false for invertible matrix', () => {
      expect(isSingular({ a: 1, b: 2, c: 3, d: 4 })).toBe(false)
    })
  })

  describe('matrixEquals', () => {
    it('returns true for equal matrices', () => {
      const m1: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const m2: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      expect(matrixEquals(m1, m2)).toBe(true)
    })

    it('returns false for different matrices', () => {
      const m1: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const m2: Matrix2x2 = { a: 1, b: 2, c: 3, d: 5 }
      expect(matrixEquals(m1, m2)).toBe(false)
    })

    it('respects tolerance', () => {
      const m1: Matrix2x2 = { a: 1, b: 2, c: 3, d: 4 }
      const m2: Matrix2x2 = { a: 1.0001, b: 2, c: 3, d: 4 }
      expect(matrixEquals(m1, m2, 0.001)).toBe(true)
      expect(matrixEquals(m1, m2, 0.00001)).toBe(false)
    })
  })

  describe('getTransformationType', () => {
    it('identifies identity', () => {
      expect(getTransformationType(identityMatrix())).toBe('identity')
    })

    it('identifies rotation', () => {
      expect(getTransformationType(rotationMatrix(45))).toBe('rotation')
      expect(getTransformationType(rotationMatrix(90))).toBe('rotation')
    })

    it('identifies uniform scale', () => {
      expect(getTransformationType(uniformScaleMatrix(2))).toBe('uniformScale')
      expect(getTransformationType(uniformScaleMatrix(0.5))).toBe('uniformScale')
    })

    it('identifies non-uniform scale', () => {
      expect(getTransformationType(scaleMatrix(2, 3))).toBe('scale')
    })

    it('identifies shear X', () => {
      expect(getTransformationType(shearXMatrix(0.5))).toBe('shearX')
    })

    it('identifies shear Y', () => {
      expect(getTransformationType(shearYMatrix(0.5))).toBe('shearY')
    })

    it('identifies reflect X', () => {
      expect(getTransformationType(reflectionXMatrix())).toBe('reflectX')
    })

    it('identifies reflect Y', () => {
      expect(getTransformationType(reflectionYMatrix())).toBe('reflectY')
    })

    it('identifies reflect origin', () => {
      expect(getTransformationType(reflectionOriginMatrix())).toBe('reflectOrigin')
    })

    it('returns custom for unrecognized matrix', () => {
      // A general matrix with no special structure
      const m: Matrix2x2 = { a: 1, b: 2, c: 3, d: 5 }
      expect(getTransformationType(m)).toBe('custom')
    })
  })
})

// ============================================================================
// Preset Tests
// ============================================================================

describe('Transformation Presets', () => {
  it('all presets have valid matrices', () => {
    for (const preset of TRANSFORMATION_PRESETS) {
      expect(isValidMatrix(preset.matrix)).toBe(true)
    }
  })

  it('all presets have required properties', () => {
    for (const preset of TRANSFORMATION_PRESETS) {
      expect(preset.id).toBeDefined()
      expect(preset.name).toBeDefined()
      expect(preset.description).toBeDefined()
      expect(preset.type).toBeDefined()
      expect(preset.matrix).toBeDefined()
    }
  })

  it('preset IDs are unique', () => {
    const ids = TRANSFORMATION_PRESETS.map((p) => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('getTransformationPreset finds existing preset', () => {
    const preset = getTransformationPreset('rotate-90')
    expect(preset).toBeDefined()
    expect(preset!.name).toBe('Rotate 90°')
  })

  it('getTransformationPreset returns undefined for unknown', () => {
    expect(getTransformationPreset('nonexistent')).toBeUndefined()
  })

  it('rotation presets match their angle parameter', () => {
    const rotate45 = getTransformationPreset('rotate-45')
    expect(rotate45).toBeDefined()
    expect(rotate45!.parameters?.angle).toBe(45)
    expect(matrixEquals(rotate45!.matrix, rotationMatrix(45))).toBe(true)

    const rotate90 = getTransformationPreset('rotate-90')
    expect(rotate90).toBeDefined()
    expect(rotate90!.parameters?.angle).toBe(90)
    expect(matrixEquals(rotate90!.matrix, rotationMatrix(90))).toBe(true)

    const rotate180 = getTransformationPreset('rotate-180')
    expect(rotate180).toBeDefined()
    expect(rotate180!.parameters?.angle).toBe(180)
    expect(matrixEquals(rotate180!.matrix, rotationMatrix(180))).toBe(true)
  })

  it('scale presets have correct parameters', () => {
    const scale2x = getTransformationPreset('scale-2x')
    expect(scale2x).toBeDefined()
    expect(scale2x!.parameters?.k).toBe(2)
    expect(scale2x!.matrix).toEqual({ a: 2, b: 0, c: 0, d: 2 })

    const scaleHalf = getTransformationPreset('scale-half')
    expect(scaleHalf).toBeDefined()
    expect(scaleHalf!.parameters?.k).toBe(0.5)
    expect(scaleHalf!.matrix).toEqual({ a: 0.5, b: 0, c: 0, d: 0.5 })
  })

  it('shear presets have correct parameters', () => {
    const shearX = getTransformationPreset('shear-x')
    expect(shearX).toBeDefined()
    expect(shearX!.parameters?.k).toBe(0.5)

    const shearY = getTransformationPreset('shear-y')
    expect(shearY).toBeDefined()
    expect(shearY!.parameters?.k).toBe(0.5)
  })

  it('identity preset is correct', () => {
    const identity = getTransformationPreset('identity')
    expect(identity).toBeDefined()
    expect(isIdentity(identity!.matrix)).toBe(true)
  })

  it('reflection presets have determinant -1', () => {
    const reflectX = getTransformationPreset('reflect-x')
    expect(reflectX).toBeDefined()
    expect(determinant(reflectX!.matrix)).toBe(-1)

    const reflectY = getTransformationPreset('reflect-y')
    expect(reflectY).toBeDefined()
    expect(determinant(reflectY!.matrix)).toBe(-1)
  })

  it('reflect origin preset has determinant 1', () => {
    const reflectOrigin = getTransformationPreset('reflect-origin')
    expect(reflectOrigin).toBeDefined()
    expect(determinant(reflectOrigin!.matrix)).toBe(1)
  })
})
