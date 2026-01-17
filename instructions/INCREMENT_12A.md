# Increment 12A: Matrix Math Utilities

**Goal**: Create the mathematical foundation for matrix operations with comprehensive test coverage.

**Estimated Time**: 45 minutes

---

## Files to Create

### 1. `src/utils/math/matrix.ts`

Follow the pattern established in `vector.ts`. Create these exports:

```typescript
// ============================================================
// TYPES (also add to src/types/math.ts)
// ============================================================

/**
 * 2×2 Matrix represented as:
 * | a  b |
 * | c  d |
 */
export interface Matrix2x2 {
  a: number  // row 0, col 0
  b: number  // row 0, col 1
  c: number  // row 1, col 0
  d: number  // row 1, col 1
}

export type TransformationType =
  | 'identity'
  | 'rotation'
  | 'scale'
  | 'uniformScale'
  | 'shearX'
  | 'shearY'
  | 'reflectX'
  | 'reflectY'
  | 'reflectOrigin'
  | 'custom'

export interface TransformationPreset {
  id: string
  name: string
  description: string
  type: TransformationType
  matrix: Matrix2x2
  /** Parameter values used to generate this matrix (e.g., angle for rotation) */
  parameters?: Record<string, number>
}

// ============================================================
// CONSTANTS
// ============================================================

export const MATRIX_TOLERANCE = 1e-10

/** Standard transformation presets for the widget */
export const TRANSFORMATION_PRESETS: TransformationPreset[] = [
  {
    id: 'identity',
    name: 'Identity',
    description: 'No transformation - vectors unchanged',
    type: 'identity',
    matrix: { a: 1, b: 0, c: 0, d: 1 }
  },
  {
    id: 'rotate-45',
    name: 'Rotate 45°',
    description: 'Rotate counter-clockwise by 45 degrees',
    type: 'rotation',
    matrix: rotationMatrix(45),  // Will be computed
    parameters: { angle: 45 }
  },
  {
    id: 'rotate-90',
    name: 'Rotate 90°',
    description: 'Rotate counter-clockwise by 90 degrees',
    type: 'rotation',
    matrix: rotationMatrix(90),
    parameters: { angle: 90 }
  },
  {
    id: 'scale-2x',
    name: 'Scale 2×',
    description: 'Double the size uniformly',
    type: 'uniformScale',
    matrix: { a: 2, b: 0, c: 0, d: 2 },
    parameters: { k: 2 }
  },
  {
    id: 'scale-half',
    name: 'Scale 0.5×',
    description: 'Shrink to half size',
    type: 'uniformScale',
    matrix: { a: 0.5, b: 0, c: 0, d: 0.5 },
    parameters: { k: 0.5 }
  },
  {
    id: 'stretch-x',
    name: 'Stretch X',
    description: 'Stretch horizontally by 2, keep vertical',
    type: 'scale',
    matrix: { a: 2, b: 0, c: 0, d: 1 },
    parameters: { sx: 2, sy: 1 }
  },
  {
    id: 'shear-x',
    name: 'Shear X',
    description: 'Slant horizontally (shear factor 0.5)',
    type: 'shearX',
    matrix: { a: 1, b: 0.5, c: 0, d: 1 },
    parameters: { k: 0.5 }
  },
  {
    id: 'shear-y',
    name: 'Shear Y',
    description: 'Slant vertically (shear factor 0.5)',
    type: 'shearY',
    matrix: { a: 1, b: 0, c: 0.5, d: 1 },
    parameters: { k: 0.5 }
  },
  {
    id: 'reflect-x',
    name: 'Reflect X-axis',
    description: 'Flip over the x-axis',
    type: 'reflectX',
    matrix: { a: 1, b: 0, c: 0, d: -1 }
  },
  {
    id: 'reflect-y',
    name: 'Reflect Y-axis',
    description: 'Flip over the y-axis',
    type: 'reflectY',
    matrix: { a: -1, b: 0, c: 0, d: 1 }
  },
  {
    id: 'reflect-origin',
    name: 'Reflect Origin',
    description: 'Point reflection through origin (180° rotation)',
    type: 'reflectOrigin',
    matrix: { a: -1, b: 0, c: 0, d: -1 }
  }
]

// ============================================================
// VALIDATION
// ============================================================

/**
 * Type guard to check if a value is a valid Matrix2x2.
 */
export function isValidMatrix(m: unknown): m is Matrix2x2 {
  // Check structure and numeric values
  // Return false for null, undefined, NaN, Infinity
}

// ============================================================
// MATRIX GENERATORS
// ============================================================

/** Creates the 2×2 identity matrix */
export function identityMatrix(): Matrix2x2

/** Creates a rotation matrix for the given angle in DEGREES (D-090 pattern) */
export function rotationMatrix(angleDegrees: number): Matrix2x2

/** Creates a non-uniform scale matrix */
export function scaleMatrix(sx: number, sy: number): Matrix2x2

/** Creates a uniform scale matrix */
export function uniformScaleMatrix(k: number): Matrix2x2

/** Creates a horizontal shear matrix */
export function shearXMatrix(k: number): Matrix2x2

/** Creates a vertical shear matrix */
export function shearYMatrix(k: number): Matrix2x2

/** Creates a reflection matrix over the x-axis */
export function reflectionXMatrix(): Matrix2x2

/** Creates a reflection matrix over the y-axis */
export function reflectionYMatrix(): Matrix2x2

/** Creates a reflection matrix through the origin */
export function reflectionOriginMatrix(): Matrix2x2

// ============================================================
// MATRIX OPERATIONS
// ============================================================

/** Multiplies two 2×2 matrices: result = m1 × m2 */
export function matrixMultiply(m1: Matrix2x2, m2: Matrix2x2): Matrix2x2

/** Transforms a 2D vector by a matrix: result = M × v */
export function matrixVectorMultiply(m: Matrix2x2, v: Vector2D): Vector2D

/** Calculates the determinant: ad - bc */
export function determinant(m: Matrix2x2): number

/** Calculates the trace: a + d */
export function trace(m: Matrix2x2): number

/** Returns the transpose of the matrix */
export function transpose(m: Matrix2x2): Matrix2x2

/**
 * Returns the inverse matrix, or null if the matrix is singular (det = 0).
 * Inverse of | a  b | is (1/det) × | d  -b |
 *            | c  d |              | -c  a |
 */
export function inverse(m: Matrix2x2): Matrix2x2 | null

// ============================================================
// MATRIX ANALYSIS
// ============================================================

/** Checks if the matrix is the identity matrix (within tolerance) */
export function isIdentity(m: Matrix2x2, tolerance?: number): boolean

/**
 * Checks if the matrix is orthogonal (M × M^T = I).
 * Orthogonal matrices preserve lengths and angles (rotations/reflections).
 */
export function isOrthogonal(m: Matrix2x2, tolerance?: number): boolean

/**
 * Attempts to classify the transformation type of a matrix.
 * Returns 'custom' if no standard type matches.
 */
export function getTransformationType(m: Matrix2x2): TransformationType

/** Checks if the matrix is singular (determinant ≈ 0) */
export function isSingular(m: Matrix2x2, tolerance?: number): boolean

// ============================================================
// PRESET LOOKUP
// ============================================================

/** Finds a preset by ID */
export function getTransformationPreset(id: string): TransformationPreset | undefined
```

### 2. `src/utils/math/matrix.test.ts`

Create comprehensive tests following the `vector.test.ts` pattern:

```typescript
import { describe, it, expect } from 'vitest'
import {
  // Types
  type Matrix2x2,
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
  getTransformationType,
  isSingular,
  // Preset lookup
  getTransformationPreset,
} from './matrix'

// Target: 50+ tests

describe('Matrix2x2 Validation', () => {
  describe('isValidMatrix', () => {
    it('returns true for valid matrix', () => {})
    it('returns false for null', () => {})
    it('returns false for undefined', () => {})
    it('returns false for missing properties', () => {})
    it('returns false for NaN values', () => {})
    it('returns false for Infinity values', () => {})
    it('returns false for non-numeric values', () => {})
  })
})

describe('Matrix Generators', () => {
  describe('identityMatrix', () => {
    it('returns correct identity matrix', () => {})
    it('identity has determinant 1', () => {})
  })

  describe('rotationMatrix', () => {
    it('creates correct 0° rotation (identity)', () => {})
    it('creates correct 90° rotation', () => {})
    it('creates correct 45° rotation', () => {})
    it('creates correct 180° rotation', () => {})
    it('creates correct -90° rotation', () => {})
    it('rotation matrices have determinant 1', () => {})
    it('rotation matrices are orthogonal', () => {})
  })

  describe('scaleMatrix', () => {
    it('creates correct scale matrix', () => {})
    it('uniform scale when sx === sy', () => {})
    it('determinant equals sx * sy', () => {})
  })

  describe('uniformScaleMatrix', () => {
    it('creates correct uniform scale', () => {})
    it('determinant equals k²', () => {})
  })

  describe('shearXMatrix', () => {
    it('creates correct shear matrix', () => {})
    it('shear matrices have determinant 1', () => {})
  })

  describe('shearYMatrix', () => {
    it('creates correct shear matrix', () => {})
    it('shear matrices have determinant 1', () => {})
  })

  describe('reflectionXMatrix', () => {
    it('creates correct reflection matrix', () => {})
    it('has determinant -1', () => {})
    it('is orthogonal', () => {})
  })

  describe('reflectionYMatrix', () => {
    it('creates correct reflection matrix', () => {})
    it('has determinant -1', () => {})
  })

  describe('reflectionOriginMatrix', () => {
    it('creates correct reflection matrix', () => {})
    it('has determinant 1', () => {})
    it('equivalent to 180° rotation', () => {})
  })
})

describe('Matrix Operations', () => {
  describe('matrixMultiply', () => {
    it('multiplies identity correctly', () => {})
    it('computes standard multiplication', () => {})
    it('is associative: (AB)C = A(BC)', () => {})
    it('is NOT commutative: AB ≠ BA', () => {})
    it('rotation followed by rotation equals combined rotation', () => {})
  })

  describe('matrixVectorMultiply', () => {
    it('identity matrix leaves vector unchanged', () => {})
    it('correctly transforms vector', () => {})
    it('90° rotation transforms (1,0) to (0,1)', () => {})
    it('scale matrix scales vector components', () => {})
  })

  describe('determinant', () => {
    it('calculates identity determinant as 1', () => {})
    it('calculates standard determinant', () => {})
    it('singular matrix has determinant 0', () => {})
    it('det(AB) = det(A) * det(B)', () => {})
  })

  describe('trace', () => {
    it('calculates identity trace as 2', () => {})
    it('calculates standard trace', () => {})
  })

  describe('transpose', () => {
    it('transposes correctly', () => {})
    it('double transpose returns original', () => {})
    it('symmetric matrix equals its transpose', () => {})
  })

  describe('inverse', () => {
    it('returns null for singular matrix', () => {})
    it('calculates correct inverse', () => {})
    it('M × M⁻¹ = I', () => {})
    it('identity is its own inverse', () => {})
  })
})

describe('Matrix Analysis', () => {
  describe('isIdentity', () => {
    it('returns true for identity matrix', () => {})
    it('returns false for non-identity', () => {})
    it('respects tolerance', () => {})
  })

  describe('isOrthogonal', () => {
    it('returns true for rotation matrices', () => {})
    it('returns true for reflection matrices', () => {})
    it('returns false for scale matrices (k ≠ 1)', () => {})
    it('returns false for shear matrices', () => {})
  })

  describe('getTransformationType', () => {
    it('identifies identity', () => {})
    it('identifies rotation', () => {})
    it('identifies scale', () => {})
    it('identifies shear', () => {})
    it('identifies reflection', () => {})
    it('returns custom for unrecognized matrix', () => {})
  })

  describe('isSingular', () => {
    it('returns true for zero matrix', () => {})
    it('returns true for dependent rows', () => {})
    it('returns false for identity', () => {})
  })
})

describe('Transformation Presets', () => {
  it('all presets have valid matrices', () => {})
  it('all presets have required properties', () => {})
  it('getTransformationPreset finds existing preset', () => {})
  it('getTransformationPreset returns undefined for unknown', () => {})
  it('rotation presets match their angle parameter', () => {})
})
```

### 3. Update `src/types/math.ts`

Add the new types at the end of the file:

```typescript
// ============================================================
// Matrix Types (Phase 12)
// ============================================================

/**
 * 2×2 Matrix for 2D linear transformations.
 * Represented as: | a  b |
 *                 | c  d |
 */
export interface Matrix2x2 {
  /** Element at row 0, column 0 */
  a: number
  /** Element at row 0, column 1 */
  b: number
  /** Element at row 1, column 0 */
  c: number
  /** Element at row 1, column 1 */
  d: number
}

/**
 * Types of 2D linear transformations.
 */
export type TransformationType =
  | 'identity'
  | 'rotation'
  | 'scale'
  | 'uniformScale'
  | 'shearX'
  | 'shearY'
  | 'reflectX'
  | 'reflectY'
  | 'reflectOrigin'
  | 'custom'

/**
 * A preset transformation with its associated matrix and metadata.
 */
export interface TransformationPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Brief description of the transformation */
  description: string
  /** Classification of transformation type */
  type: TransformationType
  /** The 2×2 transformation matrix */
  matrix: Matrix2x2
  /** Optional parameters used to generate this matrix */
  parameters?: Record<string, number>
}
```

---

## Implementation Notes

### Mathematical Formulas

**Rotation Matrix** (angle θ in radians):
```
| cos(θ)  -sin(θ) |
| sin(θ)   cos(θ) |
```

**Determinant**:
```
det(M) = a*d - b*c
```

**Inverse** (when det ≠ 0):
```
M⁻¹ = (1/det) × | d  -b |
                | -c  a |
```

**Matrix Multiplication**:
```
| a₁  b₁ |   | a₂  b₂ |   | a₁a₂+b₁c₂  a₁b₂+b₁d₂ |
| c₁  d₁ | × | c₂  d₂ | = | c₁a₂+d₁c₂  c₁b₂+d₁d₂ |
```

**Matrix-Vector Multiplication**:
```
| a  b |   | x |   | ax + by |
| c  d | × | y | = | cx + dy |
```

### Pattern from vector.ts to follow

1. Use JSDoc comments for all exports
2. Reference decision records (D-096, D-097, etc.)
3. Import Vector2D from types for matrixVectorMultiply
4. Use toBeCloseTo() for floating-point test assertions
5. Test mathematical properties (associativity, orthogonality preservation)

---

## Success Criteria

- [ ] All types defined in `src/types/math.ts`
- [ ] All functions implemented in `src/utils/math/matrix.ts`
- [ ] 50+ tests pass in `src/utils/math/matrix.test.ts`
- [ ] All generators produce mathematically correct matrices
- [ ] `matrixMultiply` is associative (test)
- [ ] `matrixMultiply` is NOT commutative (test)
- [ ] Rotation matrices are orthogonal with determinant 1
- [ ] Reflection matrices are orthogonal with determinant -1
- [ ] `inverse()` returns null for singular matrices
- [ ] `M × M⁻¹ = I` for invertible matrices (test)
- [ ] ESLint and TypeScript pass
- [ ] Build succeeds

---

## Commands to Run

```bash
# Run tests during development
npm run test -- src/utils/math/matrix.test.ts --watch

# Type check
npm run type-check

# Lint
npm run lint

# Final verification
npm run test && npm run type-check && npm run lint && npm run build
```
