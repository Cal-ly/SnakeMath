import { describe, it, expect } from 'vitest'
import {
  add,
  subtract,
  scale,
  dot,
  cross,
  magnitude,
  normalize,
  angleBetween,
  isZeroVector,
  isParallel,
  isPerpendicular,
  equals,
  isValidVector3D,
  clampToRange,
  toString,
  getVector3DPreset,
  VECTOR3D_PRESETS,
  VECTOR3D_TOLERANCE,
} from './vector3d'

describe('add', () => {
  it('adds two positive vectors', () => {
    const result = add({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })
    expect(result).toEqual({ x: 5, y: 7, z: 9 })
  })

  it('adds positive and negative vectors', () => {
    const result = add({ x: 5, y: -3, z: 2 }, { x: -2, y: 7, z: -4 })
    expect(result).toEqual({ x: 3, y: 4, z: -2 })
  })

  it('adds with zero vector (identity)', () => {
    const result = add({ x: 3, y: 4, z: 5 }, { x: 0, y: 0, z: 0 })
    expect(result).toEqual({ x: 3, y: 4, z: 5 })
  })

  it('is commutative: a + b = b + a', () => {
    const a = { x: 2, y: 5, z: -1 }
    const b = { x: 3, y: -1, z: 4 }
    expect(add(a, b)).toEqual(add(b, a))
  })
})

describe('subtract', () => {
  it('subtracts vectors correctly', () => {
    const result = subtract({ x: 5, y: 7, z: 9 }, { x: 2, y: 3, z: 4 })
    expect(result).toEqual({ x: 3, y: 4, z: 5 })
  })

  it('subtracting same vector gives zero', () => {
    const v = { x: 4, y: 5, z: 6 }
    const result = subtract(v, v)
    expect(result).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('subtracting zero vector (identity)', () => {
    const result = subtract({ x: 3, y: 4, z: 5 }, { x: 0, y: 0, z: 0 })
    expect(result).toEqual({ x: 3, y: 4, z: 5 })
  })

  it('handles negative results', () => {
    const result = subtract({ x: 1, y: 2, z: 3 }, { x: 5, y: 8, z: 10 })
    expect(result).toEqual({ x: -4, y: -6, z: -7 })
  })
})

describe('scale', () => {
  it('multiplies by positive scalar', () => {
    const result = scale({ x: 2, y: 3, z: 4 }, 3)
    expect(result).toEqual({ x: 6, y: 9, z: 12 })
  })

  it('multiplies by negative scalar (reverses direction)', () => {
    const result = scale({ x: 2, y: 3, z: 4 }, -1)
    expect(result).toEqual({ x: -2, y: -3, z: -4 })
  })

  it('multiplies by zero (becomes zero vector)', () => {
    const result = scale({ x: 5, y: 10, z: 15 }, 0)
    expect(result).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('multiplies by 1 (identity)', () => {
    const result = scale({ x: 3, y: 4, z: 5 }, 1)
    expect(result).toEqual({ x: 3, y: 4, z: 5 })
  })

  it('multiplies by fractional scalar', () => {
    const result = scale({ x: 4, y: 6, z: 8 }, 0.5)
    expect(result).toEqual({ x: 2, y: 3, z: 4 })
  })
})

describe('dot', () => {
  it('computes dot product of perpendicular vectors (should be 0)', () => {
    // (1, 2, 3) · (5, -4, 1) = 5 - 8 + 3 = 0
    const result = dot({ x: 1, y: 2, z: 3 }, { x: 5, y: -4, z: 1 })
    expect(result).toBe(0)
  })

  it('computes dot product of parallel vectors', () => {
    // (1, 2, 1) · (2, 4, 2) = 2 + 8 + 2 = 12
    const result = dot({ x: 1, y: 2, z: 1 }, { x: 2, y: 4, z: 2 })
    expect(result).toBe(12)
  })

  it('computes dot product of unit vectors î and ĵ', () => {
    const result = dot({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })
    expect(result).toBe(0)
  })

  it('computes dot product of same unit vector with itself', () => {
    const result = dot({ x: 1, y: 0, z: 0 }, { x: 1, y: 0, z: 0 })
    expect(result).toBe(1)
  })

  it('is commutative: a·b = b·a', () => {
    const a = { x: 3, y: 7, z: 2 }
    const b = { x: 2, y: -4, z: 5 }
    expect(dot(a, b)).toBe(dot(b, a))
  })

  it('dot product with zero vector is 0', () => {
    const result = dot({ x: 5, y: 10, z: 15 }, { x: 0, y: 0, z: 0 })
    expect(result).toBe(0)
  })
})

describe('cross', () => {
  it('computes î × ĵ = k̂', () => {
    const result = cross({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })
    expect(result).toEqual({ x: 0, y: 0, z: 1 })
  })

  it('computes ĵ × k̂ = î', () => {
    const result = cross({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 })
    expect(result).toEqual({ x: 1, y: 0, z: 0 })
  })

  it('computes k̂ × î = ĵ', () => {
    const result = cross({ x: 0, y: 0, z: 1 }, { x: 1, y: 0, z: 0 })
    expect(result).toEqual({ x: 0, y: 1, z: 0 })
  })

  it('computes ĵ × î = -k̂', () => {
    const result = cross({ x: 0, y: 1, z: 0 }, { x: 1, y: 0, z: 0 })
    expect(result).toEqual({ x: 0, y: 0, z: -1 })
  })

  it('is anti-commutative: a × b = -(b × a)', () => {
    const a = { x: 1, y: 2, z: 3 }
    const b = { x: 4, y: 5, z: 6 }
    const axb = cross(a, b)
    const bxa = cross(b, a)
    expect(axb.x).toBeCloseTo(-bxa.x)
    expect(axb.y).toBeCloseTo(-bxa.y)
    expect(axb.z).toBeCloseTo(-bxa.z)
  })

  it('cross product of parallel vectors is zero', () => {
    const result = cross({ x: 1, y: 2, z: 1 }, { x: 2, y: 4, z: 2 })
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(0)
    expect(result.z).toBeCloseTo(0)
  })

  it('cross product with itself is zero', () => {
    const v = { x: 3, y: 4, z: 5 }
    const result = cross(v, v)
    expect(result).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('result is perpendicular to both inputs', () => {
    const a = { x: 1, y: 2, z: 3 }
    const b = { x: 4, y: 5, z: 6 }
    const result = cross(a, b)
    expect(dot(result, a)).toBeCloseTo(0)
    expect(dot(result, b)).toBeCloseTo(0)
  })

  it('computes cross product for physical vectors preset (torque)', () => {
    // r = (3, 4, 0), F = (0, 0, 5)
    // torque = r × F = (4*5 - 0*0, 0*0 - 3*5, 3*0 - 4*0) = (20, -15, 0)
    const result = cross({ x: 3, y: 4, z: 0 }, { x: 0, y: 0, z: 5 })
    expect(result).toEqual({ x: 20, y: -15, z: 0 })
  })
})

describe('magnitude', () => {
  it('computes magnitude of unit vector', () => {
    expect(magnitude({ x: 1, y: 0, z: 0 })).toBe(1)
    expect(magnitude({ x: 0, y: 1, z: 0 })).toBe(1)
    expect(magnitude({ x: 0, y: 0, z: 1 })).toBe(1)
  })

  it('computes magnitude of zero vector', () => {
    expect(magnitude({ x: 0, y: 0, z: 0 })).toBe(0)
  })

  it('computes 3-4-5 variation: (1, 2, 2) has magnitude 3', () => {
    // √(1 + 4 + 4) = √9 = 3
    expect(magnitude({ x: 1, y: 2, z: 2 })).toBe(3)
  })

  it('handles negative components', () => {
    expect(magnitude({ x: -1, y: -2, z: -2 })).toBe(3)
  })

  it('computes √3 for (1, 1, 1)', () => {
    expect(magnitude({ x: 1, y: 1, z: 1 })).toBeCloseTo(Math.sqrt(3))
  })
})

describe('normalize', () => {
  it('normalizes unit vector (unchanged)', () => {
    const result = normalize({ x: 1, y: 0, z: 0 })
    expect(result).toEqual({ x: 1, y: 0, z: 0 })
  })

  it('normalizes non-unit vector (magnitude becomes 1)', () => {
    const result = normalize({ x: 1, y: 2, z: 2 })
    expect(result).not.toBeNull()
    expect(result!.x).toBeCloseTo(1 / 3)
    expect(result!.y).toBeCloseTo(2 / 3)
    expect(result!.z).toBeCloseTo(2 / 3)
    expect(magnitude(result!)).toBeCloseTo(1)
  })

  it('returns null for zero vector', () => {
    const result = normalize({ x: 0, y: 0, z: 0 })
    expect(result).toBeNull()
  })

  it('preserves direction after normalization', () => {
    const original = { x: 5, y: 5, z: 5 }
    const normalized = normalize(original)
    expect(normalized).not.toBeNull()
    // All components should be equal
    expect(normalized!.x).toBeCloseTo(normalized!.y)
    expect(normalized!.y).toBeCloseTo(normalized!.z)
  })

  it('handles very small vectors near zero', () => {
    const result = normalize({ x: 1e-15, y: 1e-15, z: 1e-15 })
    expect(result).toBeNull()
  })
})

describe('angleBetween', () => {
  it('returns 0° for parallel vectors (same direction)', () => {
    const result = angleBetween({ x: 1, y: 2, z: 1 }, { x: 2, y: 4, z: 2 })
    expect(result).toBeCloseTo(0)
  })

  it('returns 180° for opposite vectors', () => {
    const result = angleBetween({ x: 1, y: 2, z: 3 }, { x: -1, y: -2, z: -3 })
    expect(result).toBeCloseTo(180)
  })

  it('returns 90° for perpendicular vectors', () => {
    const result = angleBetween({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })
    expect(result).toBeCloseTo(90)
  })

  it('returns null when first vector is zero', () => {
    const result = angleBetween({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 })
    expect(result).toBeNull()
  })

  it('returns null when second vector is zero', () => {
    const result = angleBetween({ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 })
    expect(result).toBeNull()
  })

  it('returns 0° for same vector', () => {
    const result = angleBetween({ x: 3, y: 4, z: 5 }, { x: 3, y: 4, z: 5 })
    expect(result).toBeCloseTo(0)
  })

  it('computes correct angle for perpendicular preset', () => {
    // (1, 2, 3) · (5, -4, 1) = 0, so angle = 90°
    const result = angleBetween({ x: 1, y: 2, z: 3 }, { x: 5, y: -4, z: 1 })
    expect(result).toBeCloseTo(90)
  })
})

describe('isZeroVector', () => {
  it('returns true for exact zero (0, 0, 0)', () => {
    expect(isZeroVector({ x: 0, y: 0, z: 0 })).toBe(true)
  })

  it('returns true for very small values within tolerance', () => {
    expect(isZeroVector({ x: 1e-15, y: 1e-15, z: 1e-15 })).toBe(true)
  })

  it('returns false for non-zero vector', () => {
    expect(isZeroVector({ x: 1, y: 0, z: 0 })).toBe(false)
    expect(isZeroVector({ x: 0, y: 1, z: 0 })).toBe(false)
    expect(isZeroVector({ x: 0, y: 0, z: 1 })).toBe(false)
    expect(isZeroVector({ x: 0.001, y: 0, z: 0 })).toBe(false)
  })

  it('respects custom tolerance', () => {
    expect(isZeroVector({ x: 0.05, y: 0.05, z: 0.05 }, 0.1)).toBe(true)
    expect(isZeroVector({ x: 0.05, y: 0.05, z: 0.05 }, 0.01)).toBe(false)
  })
})

describe('isParallel', () => {
  it('returns true for same direction vectors', () => {
    expect(isParallel({ x: 1, y: 2, z: 1 }, { x: 2, y: 4, z: 2 })).toBe(true)
  })

  it('returns true for opposite direction vectors (still parallel)', () => {
    expect(isParallel({ x: 1, y: 2, z: 3 }, { x: -1, y: -2, z: -3 })).toBe(true)
  })

  it('returns false for perpendicular vectors', () => {
    expect(isParallel({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toBe(false)
  })

  it('returns false when first vector is zero', () => {
    expect(isParallel({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 })).toBe(false)
  })

  it('returns false when second vector is zero', () => {
    expect(isParallel({ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 })).toBe(false)
  })

  it('handles floating point precision', () => {
    expect(isParallel({ x: 1, y: 2, z: 3 }, { x: 2 + 1e-12, y: 4, z: 6 })).toBe(true)
  })
})

describe('isPerpendicular', () => {
  it('returns true for 90° angle (standard basis vectors)', () => {
    expect(isPerpendicular({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toBe(true)
    expect(isPerpendicular({ x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 })).toBe(true)
    expect(isPerpendicular({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 })).toBe(true)
  })

  it('returns true for perpendicular preset vectors', () => {
    expect(isPerpendicular({ x: 1, y: 2, z: 3 }, { x: 5, y: -4, z: 1 })).toBe(true)
  })

  it('returns false for non-perpendicular vectors', () => {
    expect(isPerpendicular({ x: 1, y: 1, z: 1 }, { x: 1, y: 0, z: 0 })).toBe(false)
  })

  it('returns false when first vector is zero', () => {
    expect(isPerpendicular({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 })).toBe(false)
  })

  it('returns false when second vector is zero', () => {
    expect(isPerpendicular({ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 })).toBe(false)
  })

  it('returns false for parallel vectors', () => {
    expect(isPerpendicular({ x: 1, y: 2, z: 1 }, { x: 2, y: 4, z: 2 })).toBe(false)
  })
})

describe('equals', () => {
  it('returns true for identical vectors', () => {
    expect(equals({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })).toBe(true)
  })

  it('returns true for vectors within tolerance', () => {
    expect(equals({ x: 1, y: 2, z: 3 }, { x: 1 + 1e-12, y: 2, z: 3 })).toBe(true)
  })

  it('returns false for different vectors', () => {
    expect(equals({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 4 })).toBe(false)
  })

  it('respects custom tolerance', () => {
    expect(equals({ x: 1, y: 2, z: 3 }, { x: 1.05, y: 2, z: 3 }, 0.1)).toBe(true)
    expect(equals({ x: 1, y: 2, z: 3 }, { x: 1.05, y: 2, z: 3 }, 0.01)).toBe(false)
  })
})

describe('isValidVector3D', () => {
  it('returns true for valid vector', () => {
    expect(isValidVector3D({ x: 1, y: 2, z: 3 })).toBe(true)
    expect(isValidVector3D({ x: 0, y: 0, z: 0 })).toBe(true)
    expect(isValidVector3D({ x: -5.5, y: 3.14, z: 2.71 })).toBe(true)
  })

  it('returns false for null', () => {
    expect(isValidVector3D(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isValidVector3D(undefined)).toBe(false)
  })

  it('returns false for missing x property', () => {
    expect(isValidVector3D({ y: 1, z: 2 })).toBe(false)
  })

  it('returns false for missing y property', () => {
    expect(isValidVector3D({ x: 1, z: 2 })).toBe(false)
  })

  it('returns false for missing z property', () => {
    expect(isValidVector3D({ x: 1, y: 2 })).toBe(false)
  })

  it('returns false for non-numeric values', () => {
    expect(isValidVector3D({ x: 'hello', y: 1, z: 2 })).toBe(false)
    expect(isValidVector3D({ x: 1, y: 'world', z: 2 })).toBe(false)
    expect(isValidVector3D({ x: 1, y: 2, z: 'test' })).toBe(false)
  })

  it('returns false for NaN values', () => {
    expect(isValidVector3D({ x: NaN, y: 1, z: 2 })).toBe(false)
    expect(isValidVector3D({ x: 1, y: NaN, z: 2 })).toBe(false)
    expect(isValidVector3D({ x: 1, y: 2, z: NaN })).toBe(false)
  })

  it('returns false for non-object types', () => {
    expect(isValidVector3D(42)).toBe(false)
    expect(isValidVector3D('vector')).toBe(false)
    expect(isValidVector3D([1, 2, 3])).toBe(false)
  })
})

describe('clampToRange', () => {
  it('returns unchanged vector when within range', () => {
    const result = clampToRange({ x: 2, y: 3, z: 4 }, -5, 5)
    expect(result).toEqual({ x: 2, y: 3, z: 4 })
  })

  it('clamps components when above max', () => {
    const result = clampToRange({ x: 10, y: 8, z: 12 }, -5, 5)
    expect(result).toEqual({ x: 5, y: 5, z: 5 })
  })

  it('clamps components when below min', () => {
    const result = clampToRange({ x: -10, y: -8, z: -12 }, -5, 5)
    expect(result).toEqual({ x: -5, y: -5, z: -5 })
  })

  it('clamps mixed components', () => {
    const result = clampToRange({ x: -100, y: 2, z: 100 }, -5, 5)
    expect(result).toEqual({ x: -5, y: 2, z: 5 })
  })
})

describe('toString', () => {
  it('formats vector with default precision', () => {
    expect(toString({ x: 1, y: 2, z: 3 })).toBe('(1.00, 2.00, 3.00)')
  })

  it('formats vector with custom precision', () => {
    // Note: toFixed uses banker's rounding, so 1.2345 -> 1.234
    expect(toString({ x: 1.2346, y: 2.3456, z: 3.4567 }, 3)).toBe('(1.235, 2.346, 3.457)')
  })

  it('formats negative values', () => {
    expect(toString({ x: -1, y: -2, z: -3 })).toBe('(-1.00, -2.00, -3.00)')
  })

  it('formats zero vector', () => {
    expect(toString({ x: 0, y: 0, z: 0 })).toBe('(0.00, 0.00, 0.00)')
  })
})

describe('getVector3DPreset', () => {
  it('returns preset for valid ID', () => {
    const preset = getVector3DPreset('unit-vectors')
    expect(preset).toBeDefined()
    expect(preset!.name).toBe('Unit Vectors (î × ĵ = k̂)')
    expect(preset!.vectorA).toEqual({ x: 1, y: 0, z: 0 })
    expect(preset!.vectorB).toEqual({ x: 0, y: 1, z: 0 })
  })

  it('returns undefined for invalid ID', () => {
    const preset = getVector3DPreset('nonexistent')
    expect(preset).toBeUndefined()
  })

  it('returns all expected presets', () => {
    const expectedIds = ['unit-vectors', 'perpendicular', 'parallel', 'negative-quadrant', 'physical-vectors']
    for (const id of expectedIds) {
      expect(getVector3DPreset(id)).toBeDefined()
    }
  })
})

describe('VECTOR3D_PRESETS', () => {
  it('has 5 presets', () => {
    expect(VECTOR3D_PRESETS).toHaveLength(5)
  })

  it('unit-vectors preset: î × ĵ = k̂', () => {
    const preset = VECTOR3D_PRESETS.find((p) => p.id === 'unit-vectors')!
    const result = cross(preset.vectorA, preset.vectorB)
    expect(result).toEqual({ x: 0, y: 0, z: 1 })
  })

  it('perpendicular preset vectors are actually perpendicular', () => {
    const preset = VECTOR3D_PRESETS.find((p) => p.id === 'perpendicular')!
    expect(isPerpendicular(preset.vectorA, preset.vectorB)).toBe(true)
  })

  it('parallel preset vectors are actually parallel', () => {
    const preset = VECTOR3D_PRESETS.find((p) => p.id === 'parallel')!
    expect(isParallel(preset.vectorA, preset.vectorB)).toBe(true)
  })

  it('parallel preset has cross product of zero', () => {
    const preset = VECTOR3D_PRESETS.find((p) => p.id === 'parallel')!
    const result = cross(preset.vectorA, preset.vectorB)
    expect(isZeroVector(result)).toBe(true)
  })

  it('physical-vectors preset gives meaningful cross product', () => {
    const preset = VECTOR3D_PRESETS.find((p) => p.id === 'physical-vectors')!
    const torque = cross(preset.vectorA, preset.vectorB)
    // (3, 4, 0) × (0, 0, 5) = (20, -15, 0)
    expect(torque).toEqual({ x: 20, y: -15, z: 0 })
  })
})

describe('VECTOR3D_TOLERANCE', () => {
  it('is a very small positive number', () => {
    expect(VECTOR3D_TOLERANCE).toBeGreaterThan(0)
    expect(VECTOR3D_TOLERANCE).toBeLessThan(1e-6)
  })
})
