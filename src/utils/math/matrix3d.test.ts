import { describe, it, expect } from 'vitest'
import {
  identity,
  rotationX,
  rotationY,
  rotationZ,
  scale,
  uniformScale,
  multiply,
  multiplyVector,
  determinant,
  transpose,
  trace,
  isIdentity,
  isOrthogonal,
  isRotation,
  matrixEquals,
  fromEulerAngles,
  toEulerAngles,
  toString,
  isValidMatrix3x3,
  getRotation3DPreset,
  ROTATION3D_PRESETS,
  MATRIX3D_TOLERANCE,
} from './matrix3d'
import type { Vector3D, Matrix3x3 } from '@/types/math'

describe('identity', () => {
  it('creates correct identity matrix', () => {
    const I = identity()
    expect(I).toEqual([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ])
  })

  it('has determinant 1', () => {
    expect(determinant(identity())).toBe(1)
  })

  it('is orthogonal', () => {
    expect(isOrthogonal(identity())).toBe(true)
  })
})

describe('rotationX', () => {
  it('creates identity for 0 degrees', () => {
    const Rx = rotationX(0)
    expect(isIdentity(Rx)).toBe(true)
  })

  it('creates correct matrix for 90 degrees', () => {
    const Rx = rotationX(90)
    // Rotates Y to Z, Z to -Y
    expect(Rx[0][0]).toBeCloseTo(1)
    expect(Rx[1][1]).toBeCloseTo(0)
    expect(Rx[1][2]).toBeCloseTo(-1)
    expect(Rx[2][1]).toBeCloseTo(1)
    expect(Rx[2][2]).toBeCloseTo(0)
  })

  it('rotates ĵ to k̂ at 90 degrees', () => {
    const Rx = rotationX(90)
    const j: Vector3D = { x: 0, y: 1, z: 0 }
    const result = multiplyVector(Rx, j)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(0)
    expect(result.z).toBeCloseTo(1)
  })

  it('rotates k̂ to -ĵ at 90 degrees', () => {
    const Rx = rotationX(90)
    const k: Vector3D = { x: 0, y: 0, z: 1 }
    const result = multiplyVector(Rx, k)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(-1)
    expect(result.z).toBeCloseTo(0)
  })

  it('has determinant 1', () => {
    expect(determinant(rotationX(45))).toBeCloseTo(1)
    expect(determinant(rotationX(90))).toBeCloseTo(1)
    expect(determinant(rotationX(180))).toBeCloseTo(1)
  })

  it('is orthogonal', () => {
    expect(isOrthogonal(rotationX(30))).toBe(true)
    expect(isOrthogonal(rotationX(60))).toBe(true)
    expect(isOrthogonal(rotationX(90))).toBe(true)
  })

  it('leaves î unchanged', () => {
    const Rx = rotationX(45)
    const i: Vector3D = { x: 1, y: 0, z: 0 }
    const result = multiplyVector(Rx, i)
    expect(result.x).toBeCloseTo(1)
    expect(result.y).toBeCloseTo(0)
    expect(result.z).toBeCloseTo(0)
  })
})

describe('rotationY', () => {
  it('creates identity for 0 degrees', () => {
    const Ry = rotationY(0)
    expect(isIdentity(Ry)).toBe(true)
  })

  it('rotates î to -k̂ at 90 degrees', () => {
    const Ry = rotationY(90)
    const i: Vector3D = { x: 1, y: 0, z: 0 }
    const result = multiplyVector(Ry, i)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(0)
    expect(result.z).toBeCloseTo(-1)
  })

  it('rotates k̂ to î at 90 degrees', () => {
    const Ry = rotationY(90)
    const k: Vector3D = { x: 0, y: 0, z: 1 }
    const result = multiplyVector(Ry, k)
    expect(result.x).toBeCloseTo(1)
    expect(result.y).toBeCloseTo(0)
    expect(result.z).toBeCloseTo(0)
  })

  it('has determinant 1', () => {
    expect(determinant(rotationY(45))).toBeCloseTo(1)
    expect(determinant(rotationY(90))).toBeCloseTo(1)
  })

  it('is orthogonal', () => {
    expect(isOrthogonal(rotationY(30))).toBe(true)
    expect(isOrthogonal(rotationY(60))).toBe(true)
  })

  it('leaves ĵ unchanged', () => {
    const Ry = rotationY(45)
    const j: Vector3D = { x: 0, y: 1, z: 0 }
    const result = multiplyVector(Ry, j)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(1)
    expect(result.z).toBeCloseTo(0)
  })
})

describe('rotationZ', () => {
  it('creates identity for 0 degrees', () => {
    const Rz = rotationZ(0)
    expect(isIdentity(Rz)).toBe(true)
  })

  it('rotates î to ĵ at 90 degrees', () => {
    const Rz = rotationZ(90)
    const i: Vector3D = { x: 1, y: 0, z: 0 }
    const result = multiplyVector(Rz, i)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(1)
    expect(result.z).toBeCloseTo(0)
  })

  it('rotates ĵ to -î at 90 degrees', () => {
    const Rz = rotationZ(90)
    const j: Vector3D = { x: 0, y: 1, z: 0 }
    const result = multiplyVector(Rz, j)
    expect(result.x).toBeCloseTo(-1)
    expect(result.y).toBeCloseTo(0)
    expect(result.z).toBeCloseTo(0)
  })

  it('has determinant 1', () => {
    expect(determinant(rotationZ(45))).toBeCloseTo(1)
    expect(determinant(rotationZ(90))).toBeCloseTo(1)
  })

  it('is orthogonal', () => {
    expect(isOrthogonal(rotationZ(30))).toBe(true)
    expect(isOrthogonal(rotationZ(60))).toBe(true)
  })

  it('leaves k̂ unchanged', () => {
    const Rz = rotationZ(45)
    const k: Vector3D = { x: 0, y: 0, z: 1 }
    const result = multiplyVector(Rz, k)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(0)
    expect(result.z).toBeCloseTo(1)
  })
})

describe('scale', () => {
  it('creates uniform scale matrix', () => {
    const S = scale(2, 2, 2)
    expect(S[0][0]).toBe(2)
    expect(S[1][1]).toBe(2)
    expect(S[2][2]).toBe(2)
  })

  it('creates non-uniform scale matrix', () => {
    const S = scale(1, 2, 3)
    expect(S[0][0]).toBe(1)
    expect(S[1][1]).toBe(2)
    expect(S[2][2]).toBe(3)
  })

  it('scales vectors correctly', () => {
    const S = scale(2, 3, 4)
    const v: Vector3D = { x: 1, y: 1, z: 1 }
    const result = multiplyVector(S, v)
    expect(result).toEqual({ x: 2, y: 3, z: 4 })
  })

  it('has determinant equal to product of scale factors', () => {
    expect(determinant(scale(2, 3, 4))).toBeCloseTo(24)
    expect(determinant(scale(2, 2, 2))).toBeCloseTo(8)
  })
})

describe('uniformScale', () => {
  it('creates correct uniform scale matrix', () => {
    const S = uniformScale(3)
    expect(S).toEqual([
      [3, 0, 0],
      [0, 3, 0],
      [0, 0, 3],
    ])
  })

  it('has determinant k³', () => {
    expect(determinant(uniformScale(2))).toBeCloseTo(8)
    expect(determinant(uniformScale(0.5))).toBeCloseTo(0.125)
  })
})

describe('multiply', () => {
  it('multiplying by identity gives same matrix', () => {
    const A: Matrix3x3 = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    const I = identity()
    expect(multiply(A, I)).toEqual(A)
    expect(multiply(I, A)).toEqual(A)
  })

  it('multiplies rotation matrices correctly', () => {
    const Rx = rotationX(90)
    const Ry = rotationY(90)
    const combined = multiply(Ry, Rx)
    // The result should still be orthogonal
    expect(isOrthogonal(combined)).toBe(true)
  })

  it('matrix multiplication is associative', () => {
    const A = rotationX(30)
    const B = rotationY(45)
    const C = rotationZ(60)
    const AB_C = multiply(multiply(A, B), C)
    const A_BC = multiply(A, multiply(B, C))
    expect(matrixEquals(AB_C, A_BC)).toBe(true)
  })

  it('order of multiplication matters for rotations', () => {
    const Rx = rotationX(45)
    const Ry = rotationY(45)
    const RxRy = multiply(Rx, Ry)
    const RyRx = multiply(Ry, Rx)
    expect(matrixEquals(RxRy, RyRx)).toBe(false)
  })
})

describe('multiplyVector', () => {
  it('identity leaves vector unchanged', () => {
    const v: Vector3D = { x: 1, y: 2, z: 3 }
    const result = multiplyVector(identity(), v)
    expect(result).toEqual(v)
  })

  it('scales vector correctly', () => {
    const v: Vector3D = { x: 1, y: 2, z: 3 }
    const S = uniformScale(2)
    const result = multiplyVector(S, v)
    expect(result).toEqual({ x: 2, y: 4, z: 6 })
  })

  it('rotates vector correctly', () => {
    const v: Vector3D = { x: 1, y: 0, z: 0 }
    const Rz = rotationZ(90)
    const result = multiplyVector(Rz, v)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(1)
    expect(result.z).toBeCloseTo(0)
  })
})

describe('determinant', () => {
  it('computes determinant of identity as 1', () => {
    expect(determinant(identity())).toBe(1)
  })

  it('computes determinant of scale matrix', () => {
    expect(determinant(scale(2, 3, 4))).toBeCloseTo(24)
  })

  it('computes determinant of rotation matrix as 1', () => {
    expect(determinant(rotationX(45))).toBeCloseTo(1)
    expect(determinant(rotationY(60))).toBeCloseTo(1)
    expect(determinant(rotationZ(90))).toBeCloseTo(1)
  })

  it('computes determinant of product as product of determinants', () => {
    const A = rotationX(30)
    const B = scale(2, 2, 2)
    expect(determinant(multiply(A, B))).toBeCloseTo(determinant(A) * determinant(B))
  })
})

describe('transpose', () => {
  it('transposes identity to identity', () => {
    const I = identity()
    expect(transpose(I)).toEqual(I)
  })

  it('transposes correctly', () => {
    const A: Matrix3x3 = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    const AT: Matrix3x3 = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]
    expect(transpose(A)).toEqual(AT)
  })

  it('double transpose gives original', () => {
    const A: Matrix3x3 = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    expect(transpose(transpose(A))).toEqual(A)
  })
})

describe('trace', () => {
  it('computes trace of identity as 3', () => {
    expect(trace(identity())).toBe(3)
  })

  it('computes trace of scale matrix', () => {
    expect(trace(scale(2, 3, 4))).toBe(9)
  })

  it('computes trace correctly', () => {
    const A: Matrix3x3 = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    expect(trace(A)).toBe(15)
  })
})

describe('isIdentity', () => {
  it('returns true for identity matrix', () => {
    expect(isIdentity(identity())).toBe(true)
  })

  it('returns false for non-identity matrix', () => {
    expect(isIdentity(rotationX(45))).toBe(false)
    expect(isIdentity(scale(2, 2, 2))).toBe(false)
  })

  it('returns true for near-identity within tolerance', () => {
    const nearI: Matrix3x3 = [
      [1 + 1e-12, 1e-12, 0],
      [0, 1, 1e-12],
      [1e-12, 0, 1],
    ]
    expect(isIdentity(nearI)).toBe(true)
  })
})

describe('isOrthogonal', () => {
  it('returns true for identity', () => {
    expect(isOrthogonal(identity())).toBe(true)
  })

  it('returns true for rotation matrices', () => {
    expect(isOrthogonal(rotationX(45))).toBe(true)
    expect(isOrthogonal(rotationY(60))).toBe(true)
    expect(isOrthogonal(rotationZ(90))).toBe(true)
  })

  it('returns false for scale matrices (except uniform scale ±1)', () => {
    expect(isOrthogonal(scale(2, 2, 2))).toBe(false)
  })

  it('returns true for combined rotations', () => {
    const combined = multiply(rotationX(30), multiply(rotationY(45), rotationZ(60)))
    expect(isOrthogonal(combined)).toBe(true)
  })
})

describe('isRotation', () => {
  it('returns true for rotation matrices', () => {
    expect(isRotation(rotationX(45))).toBe(true)
    expect(isRotation(rotationY(60))).toBe(true)
    expect(isRotation(rotationZ(90))).toBe(true)
  })

  it('returns true for identity', () => {
    expect(isRotation(identity())).toBe(true)
  })

  it('returns false for scale matrices', () => {
    expect(isRotation(scale(2, 2, 2))).toBe(false)
  })

  it('returns true for combined rotations', () => {
    const combined = fromEulerAngles(30, 45, 60)
    expect(isRotation(combined)).toBe(true)
  })
})

describe('matrixEquals', () => {
  it('returns true for identical matrices', () => {
    const A = rotationX(45)
    expect(matrixEquals(A, A)).toBe(true)
  })

  it('returns false for different matrices', () => {
    const A = rotationX(45)
    const B = rotationY(45)
    expect(matrixEquals(A, B)).toBe(false)
  })

  it('returns true for matrices within tolerance', () => {
    const A = identity()
    const B: Matrix3x3 = [
      [1 + 1e-12, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
    expect(matrixEquals(A, B)).toBe(true)
  })
})

describe('fromEulerAngles', () => {
  it('creates identity for zero angles', () => {
    const R = fromEulerAngles(0, 0, 0)
    expect(isIdentity(R)).toBe(true)
  })

  it('matches single rotation for single axis', () => {
    expect(matrixEquals(fromEulerAngles(45, 0, 0), rotationX(45))).toBe(true)
    expect(matrixEquals(fromEulerAngles(0, 45, 0), rotationY(45))).toBe(true)
    expect(matrixEquals(fromEulerAngles(0, 0, 45), rotationZ(45))).toBe(true)
  })

  it('creates valid rotation matrix for combined angles', () => {
    const R = fromEulerAngles(30, 45, 60)
    expect(isRotation(R)).toBe(true)
  })
})

describe('toEulerAngles', () => {
  it('extracts zero angles from identity', () => {
    const angles = toEulerAngles(identity())
    expect(angles.rx).toBeCloseTo(0)
    expect(angles.ry).toBeCloseTo(0)
    expect(angles.rz).toBeCloseTo(0)
  })

  it('extracts single axis rotation correctly', () => {
    const anglesX = toEulerAngles(rotationX(45))
    expect(anglesX.rx).toBeCloseTo(45)
    expect(anglesX.ry).toBeCloseTo(0)
    expect(anglesX.rz).toBeCloseTo(0)

    const anglesY = toEulerAngles(rotationY(45))
    expect(anglesY.rx).toBeCloseTo(0)
    expect(anglesY.ry).toBeCloseTo(45)
    expect(anglesY.rz).toBeCloseTo(0)

    const anglesZ = toEulerAngles(rotationZ(45))
    expect(anglesZ.rx).toBeCloseTo(0)
    expect(anglesZ.ry).toBeCloseTo(0)
    expect(anglesZ.rz).toBeCloseTo(45)
  })

  it('round-trips for combined rotations', () => {
    const original = { rx: 30, ry: 45, rz: 60 }
    const R = fromEulerAngles(original.rx, original.ry, original.rz)
    const extracted = toEulerAngles(R)
    // Reconstruct and compare matrices (angles might differ due to gimbal lock)
    const R2 = fromEulerAngles(extracted.rx, extracted.ry, extracted.rz)
    expect(matrixEquals(R, R2)).toBe(true)
  })
})

describe('toString', () => {
  it('formats identity matrix correctly', () => {
    const str = toString(identity())
    expect(str).toBe('[1.00, 0.00, 0.00]\n[0.00, 1.00, 0.00]\n[0.00, 0.00, 1.00]')
  })

  it('respects precision parameter', () => {
    const str = toString(identity(), 0)
    expect(str).toBe('[1, 0, 0]\n[0, 1, 0]\n[0, 0, 1]')
  })
})

describe('isValidMatrix3x3', () => {
  it('returns true for valid matrix', () => {
    expect(isValidMatrix3x3(identity())).toBe(true)
    expect(isValidMatrix3x3(rotationX(45))).toBe(true)
  })

  it('returns false for null', () => {
    expect(isValidMatrix3x3(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isValidMatrix3x3(undefined)).toBe(false)
  })

  it('returns false for non-array', () => {
    expect(isValidMatrix3x3({ a: 1 })).toBe(false)
    expect(isValidMatrix3x3('matrix')).toBe(false)
  })

  it('returns false for wrong dimensions', () => {
    expect(isValidMatrix3x3([[1, 2], [3, 4]])).toBe(false)
    expect(isValidMatrix3x3([[1, 2, 3], [4, 5, 6]])).toBe(false)
    expect(isValidMatrix3x3([[1, 2, 3], [4, 5, 6], [7, 8]])).toBe(false)
  })

  it('returns false for NaN or Infinity', () => {
    expect(isValidMatrix3x3([[NaN, 0, 0], [0, 1, 0], [0, 0, 1]])).toBe(false)
    expect(isValidMatrix3x3([[Infinity, 0, 0], [0, 1, 0], [0, 0, 1]])).toBe(false)
  })
})

describe('getRotation3DPreset', () => {
  it('returns preset for valid ID', () => {
    const preset = getRotation3DPreset('identity')
    expect(preset).toBeDefined()
    expect(preset!.name).toBe('Identity')
    expect(isIdentity(preset!.matrix)).toBe(true)
  })

  it('returns undefined for invalid ID', () => {
    expect(getRotation3DPreset('nonexistent')).toBeUndefined()
  })

  it('returns all expected presets', () => {
    const expectedIds = [
      'identity', 'rotate-x-90', 'rotate-y-90', 'rotate-z-90',
      'rotate-x-45', 'rotate-y-45', 'combined-xy', 'combined-xyz',
      'scale-2x', 'scale-half',
    ]
    for (const id of expectedIds) {
      expect(getRotation3DPreset(id)).toBeDefined()
    }
  })
})

describe('ROTATION3D_PRESETS', () => {
  it('has 10 presets', () => {
    expect(ROTATION3D_PRESETS).toHaveLength(10)
  })

  it('rotation presets have determinant 1', () => {
    const rotationPresets = ROTATION3D_PRESETS.filter((p) =>
      ['identity', 'rotationX', 'rotationY', 'rotationZ', 'combined'].includes(p.type)
    )
    for (const preset of rotationPresets) {
      expect(determinant(preset.matrix)).toBeCloseTo(1)
    }
  })

  it('rotation presets are orthogonal', () => {
    const rotationPresets = ROTATION3D_PRESETS.filter((p) =>
      ['identity', 'rotationX', 'rotationY', 'rotationZ', 'combined'].includes(p.type)
    )
    for (const preset of rotationPresets) {
      expect(isOrthogonal(preset.matrix)).toBe(true)
    }
  })

  it('scale presets have correct determinants', () => {
    const scale2x = getRotation3DPreset('scale-2x')!
    expect(determinant(scale2x.matrix)).toBeCloseTo(8)

    const scaleHalf = getRotation3DPreset('scale-half')!
    expect(determinant(scaleHalf.matrix)).toBeCloseTo(0.125)
  })
})

describe('MATRIX3D_TOLERANCE', () => {
  it('is a very small positive number', () => {
    expect(MATRIX3D_TOLERANCE).toBeGreaterThan(0)
    expect(MATRIX3D_TOLERANCE).toBeLessThan(1e-6)
  })
})
