# Increment 11A: Vector Math Utilities

## Context

Phase 11 introduces Linear Algebra vectors to SnakeMath. This increment creates the foundational math utilities for 2D vector operations.

**Decisions in effect**:
- D-088: 2D vectors only (no 3D)
- D-090: Angles in degrees with radians in parentheses (relevant for `angleBetween`)

## Tasks

### 1. Add Vector Types to `src/types/math.ts`

Add the following types:

```typescript
// Vector types
export interface Vector2D {
  x: number
  y: number
}

export interface VectorPreset {
  id: string
  name: string
  description: string
  vectorA: Vector2D
  vectorB: Vector2D
}

export type VectorOperation = 'add' | 'subtract' | 'dot' | 'magnitude' | 'angle' | 'scalar' | 'normalize'
```

### 2. Create `src/utils/math/vector.ts`

Implement the following functions:

**Core Operations**:
- `vectorAdd(a: Vector2D, b: Vector2D): Vector2D` - Component-wise addition
- `vectorSubtract(a: Vector2D, b: Vector2D): Vector2D` - Component-wise subtraction
- `scalarMultiply(v: Vector2D, k: number): Vector2D` - Multiply each component by k
- `dotProduct(a: Vector2D, b: Vector2D): number` - a₁b₁ + a₂b₂
- `magnitude(v: Vector2D): number` - √(x² + y²)
- `normalize(v: Vector2D): Vector2D | null` - Return unit vector, null if zero vector
- `angleBetween(a: Vector2D, b: Vector2D): number | null` - Angle in degrees, null if either is zero vector

**Analysis Functions**:
- `isZeroVector(v: Vector2D, tolerance?: number): boolean` - Check if vector is (0,0) within tolerance
- `isParallel(a: Vector2D, b: Vector2D, tolerance?: number): boolean` - Check if vectors point same/opposite direction
- `isPerpendicular(a: Vector2D, b: Vector2D, tolerance?: number): boolean` - Check if dot product ≈ 0

**Validation**:
- `isValidVector(v: unknown): v is Vector2D` - Type guard for Vector2D
- `clampVectorToRange(v: Vector2D, min: number, max: number): Vector2D` - Clamp components to range

**Preset Data**:
```typescript
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

export function getVectorPreset(id: string): VectorPreset | undefined
```

**Constants**:
```typescript
export const VECTOR_TOLERANCE = 1e-10  // For floating point comparisons
export const VECTOR_COORDINATE_RANGE = { min: -5, max: 5 }  // D-091
```

### 3. Create `src/utils/math/vector.test.ts`

Write comprehensive tests (target: 40+ tests) covering:

**vectorAdd tests**:
- Add two positive vectors
- Add positive and negative vectors
- Add with zero vector (identity)
- Commutativity: a + b = b + a

**vectorSubtract tests**:
- Subtract vectors
- Subtract same vector (should be zero)
- Subtract zero vector (identity)

**scalarMultiply tests**:
- Multiply by positive scalar
- Multiply by negative scalar (reverses direction)
- Multiply by zero (becomes zero vector)
- Multiply by 1 (identity)

**dotProduct tests**:
- Perpendicular vectors (should be 0)
- Parallel vectors (should be |a||b|)
- Opposite vectors (should be -|a||b|)
- Unit vectors
- Commutativity: a·b = b·a

**magnitude tests**:
- Unit vector (should be 1)
- Zero vector (should be 0)
- 3-4-5 right triangle: (3,4) has magnitude 5
- Negative components

**normalize tests**:
- Normalize unit vector (unchanged)
- Normalize non-unit vector (magnitude becomes 1)
- Normalize zero vector (returns null)
- Direction preserved after normalization

**angleBetween tests**:
- Parallel vectors (0°)
- Opposite vectors (180°)
- Perpendicular vectors (90°)
- 45° angle
- Zero vector input (returns null)
- Same vector (0°)

**isZeroVector tests**:
- Exact zero (0, 0)
- Very small values within tolerance
- Non-zero vector

**isParallel tests**:
- Same direction
- Opposite direction (still parallel)
- Perpendicular (not parallel)
- One zero vector

**isPerpendicular tests**:
- 90° angle
- Not perpendicular
- Zero vector cases

**isValidVector tests**:
- Valid vector
- Null/undefined
- Missing properties
- Non-numeric values
- NaN values

**clampVectorToRange tests**:
- Vector within range (unchanged)
- Vector outside range (clamped)
- Negative clamping

**getVectorPreset tests**:
- Valid preset ID returns preset
- Invalid ID returns undefined

## Implementation Notes

1. **Floating point tolerance**: Use `VECTOR_TOLERANCE` for comparisons, not exact equality
2. **Angle calculation**: Use `Math.acos` clamped to [-1, 1] to avoid NaN from floating point errors
3. **Degrees conversion**: `radians * (180 / Math.PI)`
4. **Zero vector checks**: Always check before division (normalize, angleBetween)

## File Checklist

- [ ] `src/types/math.ts` - Add Vector2D, VectorPreset, VectorOperation types
- [ ] `src/utils/math/vector.ts` - All functions and presets
- [ ] `src/utils/math/vector.test.ts` - 40+ tests

## Success Criteria

- All tests pass
- TypeScript compiles without errors
- ESLint passes
- Functions handle edge cases (zero vectors, floating point)
- Presets data is complete and accurate

## Verification Commands

```bash
npm run type-check
npm run lint
npm run test -- src/utils/math/vector.test.ts
```
