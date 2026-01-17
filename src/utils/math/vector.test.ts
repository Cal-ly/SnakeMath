import { describe, it, expect } from 'vitest'
import {
  vectorAdd,
  vectorSubtract,
  scalarMultiply,
  dotProduct,
  magnitude,
  normalize,
  angleBetween,
  isZeroVector,
  isParallel,
  isPerpendicular,
  isValidVector,
  clampVectorToRange,
  getVectorPreset,
  VECTOR_PRESETS,
  VECTOR_TOLERANCE,
} from './vector'

describe('vectorAdd', () => {
  it('adds two positive vectors', () => {
    const result = vectorAdd({ x: 1, y: 2 }, { x: 3, y: 4 })
    expect(result).toEqual({ x: 4, y: 6 })
  })

  it('adds positive and negative vectors', () => {
    const result = vectorAdd({ x: 5, y: -3 }, { x: -2, y: 7 })
    expect(result).toEqual({ x: 3, y: 4 })
  })

  it('adds with zero vector (identity)', () => {
    const result = vectorAdd({ x: 3, y: 4 }, { x: 0, y: 0 })
    expect(result).toEqual({ x: 3, y: 4 })
  })

  it('is commutative: a + b = b + a', () => {
    const a = { x: 2, y: 5 }
    const b = { x: 3, y: -1 }
    expect(vectorAdd(a, b)).toEqual(vectorAdd(b, a))
  })
})

describe('vectorSubtract', () => {
  it('subtracts vectors correctly', () => {
    const result = vectorSubtract({ x: 5, y: 7 }, { x: 2, y: 3 })
    expect(result).toEqual({ x: 3, y: 4 })
  })

  it('subtracting same vector gives zero', () => {
    const v = { x: 4, y: 5 }
    const result = vectorSubtract(v, v)
    expect(result).toEqual({ x: 0, y: 0 })
  })

  it('subtracting zero vector (identity)', () => {
    const result = vectorSubtract({ x: 3, y: 4 }, { x: 0, y: 0 })
    expect(result).toEqual({ x: 3, y: 4 })
  })

  it('handles negative results', () => {
    const result = vectorSubtract({ x: 1, y: 2 }, { x: 5, y: 8 })
    expect(result).toEqual({ x: -4, y: -6 })
  })
})

describe('scalarMultiply', () => {
  it('multiplies by positive scalar', () => {
    const result = scalarMultiply({ x: 2, y: 3 }, 4)
    expect(result).toEqual({ x: 8, y: 12 })
  })

  it('multiplies by negative scalar (reverses direction)', () => {
    const result = scalarMultiply({ x: 2, y: 3 }, -1)
    expect(result).toEqual({ x: -2, y: -3 })
  })

  it('multiplies by zero (becomes zero vector)', () => {
    const result = scalarMultiply({ x: 5, y: 10 }, 0)
    expect(result).toEqual({ x: 0, y: 0 })
  })

  it('multiplies by 1 (identity)', () => {
    const result = scalarMultiply({ x: 3, y: 4 }, 1)
    expect(result).toEqual({ x: 3, y: 4 })
  })

  it('multiplies by fractional scalar', () => {
    const result = scalarMultiply({ x: 4, y: 6 }, 0.5)
    expect(result).toEqual({ x: 2, y: 3 })
  })
})

describe('dotProduct', () => {
  it('computes dot product of perpendicular vectors (should be 0)', () => {
    // (3, 4) · (-4, 3) = -12 + 12 = 0
    const result = dotProduct({ x: 3, y: 4 }, { x: -4, y: 3 })
    expect(result).toBe(0)
  })

  it('computes dot product of parallel vectors', () => {
    // (2, 3) · (4, 6) = 8 + 18 = 26
    // |a| = √13, |b| = √52 = 2√13, |a||b| = 26
    const result = dotProduct({ x: 2, y: 3 }, { x: 4, y: 6 })
    expect(result).toBe(26)
  })

  it('computes dot product of opposite vectors', () => {
    // (2, 1) · (-2, -1) = -4 + -1 = -5
    const result = dotProduct({ x: 2, y: 1 }, { x: -2, y: -1 })
    expect(result).toBe(-5)
  })

  it('computes dot product of unit vectors î and ĵ', () => {
    const result = dotProduct({ x: 1, y: 0 }, { x: 0, y: 1 })
    expect(result).toBe(0)
  })

  it('is commutative: a·b = b·a', () => {
    const a = { x: 3, y: 7 }
    const b = { x: 2, y: -4 }
    expect(dotProduct(a, b)).toBe(dotProduct(b, a))
  })

  it('dot product with zero vector is 0', () => {
    const result = dotProduct({ x: 5, y: 10 }, { x: 0, y: 0 })
    expect(result).toBe(0)
  })
})

describe('magnitude', () => {
  it('computes magnitude of unit vector', () => {
    expect(magnitude({ x: 1, y: 0 })).toBe(1)
    expect(magnitude({ x: 0, y: 1 })).toBe(1)
  })

  it('computes magnitude of zero vector', () => {
    expect(magnitude({ x: 0, y: 0 })).toBe(0)
  })

  it('computes 3-4-5 right triangle: (3, 4) has magnitude 5', () => {
    expect(magnitude({ x: 3, y: 4 })).toBe(5)
  })

  it('handles negative components', () => {
    expect(magnitude({ x: -3, y: -4 })).toBe(5)
  })

  it('computes √2 for (1, 1)', () => {
    expect(magnitude({ x: 1, y: 1 })).toBeCloseTo(Math.sqrt(2))
  })
})

describe('normalize', () => {
  it('normalizes unit vector (unchanged)', () => {
    const result = normalize({ x: 1, y: 0 })
    expect(result).toEqual({ x: 1, y: 0 })
  })

  it('normalizes non-unit vector (magnitude becomes 1)', () => {
    const result = normalize({ x: 3, y: 4 })
    expect(result).not.toBeNull()
    expect(result!.x).toBeCloseTo(0.6)
    expect(result!.y).toBeCloseTo(0.8)
    expect(magnitude(result!)).toBeCloseTo(1)
  })

  it('returns null for zero vector', () => {
    const result = normalize({ x: 0, y: 0 })
    expect(result).toBeNull()
  })

  it('preserves direction after normalization', () => {
    const original = { x: 5, y: 5 }
    const normalized = normalize(original)
    expect(normalized).not.toBeNull()
    // Direction should be same: ratio of components preserved
    expect(normalized!.x / normalized!.y).toBeCloseTo(original.x / original.y)
  })

  it('handles very small vectors near zero', () => {
    const result = normalize({ x: 1e-15, y: 1e-15 })
    expect(result).toBeNull()
  })
})

describe('angleBetween', () => {
  it('returns 0° for parallel vectors (same direction)', () => {
    const result = angleBetween({ x: 2, y: 3 }, { x: 4, y: 6 })
    expect(result).toBeCloseTo(0)
  })

  it('returns 180° for opposite vectors', () => {
    const result = angleBetween({ x: 2, y: 1 }, { x: -2, y: -1 })
    expect(result).toBeCloseTo(180)
  })

  it('returns 90° for perpendicular vectors', () => {
    const result = angleBetween({ x: 1, y: 0 }, { x: 0, y: 1 })
    expect(result).toBeCloseTo(90)
  })

  it('returns 45° for (1, 0) and (1, 1)', () => {
    const result = angleBetween({ x: 1, y: 0 }, { x: 1, y: 1 })
    expect(result).toBeCloseTo(45)
  })

  it('returns null when first vector is zero', () => {
    const result = angleBetween({ x: 0, y: 0 }, { x: 1, y: 1 })
    expect(result).toBeNull()
  })

  it('returns null when second vector is zero', () => {
    const result = angleBetween({ x: 1, y: 1 }, { x: 0, y: 0 })
    expect(result).toBeNull()
  })

  it('returns 0° for same vector', () => {
    const result = angleBetween({ x: 3, y: 4 }, { x: 3, y: 4 })
    expect(result).toBeCloseTo(0)
  })

  it('handles arbitrary angles correctly', () => {
    // 60 degrees between (1, 0) and (0.5, √3/2)
    const result = angleBetween({ x: 1, y: 0 }, { x: 0.5, y: Math.sqrt(3) / 2 })
    expect(result).toBeCloseTo(60)
  })
})

describe('isZeroVector', () => {
  it('returns true for exact zero (0, 0)', () => {
    expect(isZeroVector({ x: 0, y: 0 })).toBe(true)
  })

  it('returns true for very small values within tolerance', () => {
    expect(isZeroVector({ x: 1e-15, y: 1e-15 })).toBe(true)
  })

  it('returns false for non-zero vector', () => {
    expect(isZeroVector({ x: 1, y: 0 })).toBe(false)
    expect(isZeroVector({ x: 0, y: 1 })).toBe(false)
    expect(isZeroVector({ x: 0.001, y: 0 })).toBe(false)
  })

  it('respects custom tolerance', () => {
    expect(isZeroVector({ x: 0.05, y: 0.05 }, 0.1)).toBe(true)
    expect(isZeroVector({ x: 0.05, y: 0.05 }, 0.01)).toBe(false)
  })
})

describe('isParallel', () => {
  it('returns true for same direction vectors', () => {
    expect(isParallel({ x: 2, y: 3 }, { x: 4, y: 6 })).toBe(true)
  })

  it('returns true for opposite direction vectors (still parallel)', () => {
    expect(isParallel({ x: 2, y: 1 }, { x: -2, y: -1 })).toBe(true)
  })

  it('returns false for perpendicular vectors', () => {
    expect(isParallel({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(false)
  })

  it('returns false when first vector is zero', () => {
    expect(isParallel({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe(false)
  })

  it('returns false when second vector is zero', () => {
    expect(isParallel({ x: 1, y: 1 }, { x: 0, y: 0 })).toBe(false)
  })

  it('handles floating point precision', () => {
    // Very slight imprecision within tolerance should still detect parallelism
    // Cross product of (1, 2) x (2 + ε, 4) = 1*4 - 2*(2 + ε) = 4 - 4 - 2ε = -2ε
    // With ε = 1e-12, cross = -2e-12, which is within tolerance 1e-10
    expect(isParallel({ x: 1, y: 2 }, { x: 2 + 1e-12, y: 4 })).toBe(true)
  })
})

describe('isPerpendicular', () => {
  it('returns true for 90° angle (standard basis vectors)', () => {
    expect(isPerpendicular({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(true)
  })

  it('returns true for perpendicular preset vectors', () => {
    expect(isPerpendicular({ x: 3, y: 4 }, { x: -4, y: 3 })).toBe(true)
  })

  it('returns false for non-perpendicular vectors', () => {
    expect(isPerpendicular({ x: 1, y: 1 }, { x: 1, y: 0 })).toBe(false)
  })

  it('returns false when first vector is zero', () => {
    expect(isPerpendicular({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe(false)
  })

  it('returns false when second vector is zero', () => {
    expect(isPerpendicular({ x: 1, y: 1 }, { x: 0, y: 0 })).toBe(false)
  })

  it('returns false for parallel vectors', () => {
    expect(isPerpendicular({ x: 2, y: 3 }, { x: 4, y: 6 })).toBe(false)
  })
})

describe('isValidVector', () => {
  it('returns true for valid vector', () => {
    expect(isValidVector({ x: 1, y: 2 })).toBe(true)
    expect(isValidVector({ x: 0, y: 0 })).toBe(true)
    expect(isValidVector({ x: -5.5, y: 3.14 })).toBe(true)
  })

  it('returns false for null', () => {
    expect(isValidVector(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isValidVector(undefined)).toBe(false)
  })

  it('returns false for missing x property', () => {
    expect(isValidVector({ y: 1 })).toBe(false)
  })

  it('returns false for missing y property', () => {
    expect(isValidVector({ x: 1 })).toBe(false)
  })

  it('returns false for non-numeric x value', () => {
    expect(isValidVector({ x: 'hello', y: 1 })).toBe(false)
  })

  it('returns false for non-numeric y value', () => {
    expect(isValidVector({ x: 1, y: 'world' })).toBe(false)
  })

  it('returns false for NaN values', () => {
    expect(isValidVector({ x: NaN, y: 1 })).toBe(false)
    expect(isValidVector({ x: 1, y: NaN })).toBe(false)
  })

  it('returns false for non-object types', () => {
    expect(isValidVector(42)).toBe(false)
    expect(isValidVector('vector')).toBe(false)
    expect(isValidVector([1, 2])).toBe(false)
  })
})

describe('clampVectorToRange', () => {
  it('returns unchanged vector when within range', () => {
    const result = clampVectorToRange({ x: 2, y: 3 }, -5, 5)
    expect(result).toEqual({ x: 2, y: 3 })
  })

  it('clamps x when above max', () => {
    const result = clampVectorToRange({ x: 10, y: 2 }, -5, 5)
    expect(result).toEqual({ x: 5, y: 2 })
  })

  it('clamps y when above max', () => {
    const result = clampVectorToRange({ x: 2, y: 10 }, -5, 5)
    expect(result).toEqual({ x: 2, y: 5 })
  })

  it('clamps x when below min', () => {
    const result = clampVectorToRange({ x: -10, y: 2 }, -5, 5)
    expect(result).toEqual({ x: -5, y: 2 })
  })

  it('clamps y when below min', () => {
    const result = clampVectorToRange({ x: 2, y: -10 }, -5, 5)
    expect(result).toEqual({ x: 2, y: -5 })
  })

  it('clamps both components when outside range', () => {
    const result = clampVectorToRange({ x: -100, y: 100 }, -5, 5)
    expect(result).toEqual({ x: -5, y: 5 })
  })
})

describe('getVectorPreset', () => {
  it('returns preset for valid ID', () => {
    const preset = getVectorPreset('unit-vectors')
    expect(preset).toBeDefined()
    expect(preset!.name).toBe('Unit Vectors')
    expect(preset!.vectorA).toEqual({ x: 1, y: 0 })
    expect(preset!.vectorB).toEqual({ x: 0, y: 1 })
  })

  it('returns undefined for invalid ID', () => {
    const preset = getVectorPreset('nonexistent')
    expect(preset).toBeUndefined()
  })

  it('returns all expected presets', () => {
    const expectedIds = ['unit-vectors', 'parallel', 'perpendicular', 'angle-45', 'opposite']
    for (const id of expectedIds) {
      expect(getVectorPreset(id)).toBeDefined()
    }
  })
})

describe('VECTOR_PRESETS', () => {
  it('has 5 presets', () => {
    expect(VECTOR_PRESETS).toHaveLength(5)
  })

  it('unit-vectors preset has correct properties', () => {
    const preset = VECTOR_PRESETS.find((p) => p.id === 'unit-vectors')!
    expect(preset.vectorA).toEqual({ x: 1, y: 0 })
    expect(preset.vectorB).toEqual({ x: 0, y: 1 })
    expect(dotProduct(preset.vectorA, preset.vectorB)).toBe(0)
  })

  it('parallel preset vectors are actually parallel', () => {
    const preset = VECTOR_PRESETS.find((p) => p.id === 'parallel')!
    expect(isParallel(preset.vectorA, preset.vectorB)).toBe(true)
  })

  it('perpendicular preset vectors are actually perpendicular', () => {
    const preset = VECTOR_PRESETS.find((p) => p.id === 'perpendicular')!
    expect(isPerpendicular(preset.vectorA, preset.vectorB)).toBe(true)
  })

  it('angle-45 preset has 45° between vectors', () => {
    const preset = VECTOR_PRESETS.find((p) => p.id === 'angle-45')!
    const angle = angleBetween(preset.vectorA, preset.vectorB)
    expect(angle).toBeCloseTo(45)
  })

  it('opposite preset vectors are 180° apart', () => {
    const preset = VECTOR_PRESETS.find((p) => p.id === 'opposite')!
    const angle = angleBetween(preset.vectorA, preset.vectorB)
    expect(angle).toBeCloseTo(180)
  })
})

describe('VECTOR_TOLERANCE', () => {
  it('is a very small positive number', () => {
    expect(VECTOR_TOLERANCE).toBeGreaterThan(0)
    expect(VECTOR_TOLERANCE).toBeLessThan(1e-6)
  })
})
