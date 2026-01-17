# Phase 12: Linear Algebra — Matrices

**Theme**: *Transformations and Systems*

**Goal**: Visualize 2D linear transformations and introduce matrix operations, with connections to graphics programming and ML.

---

## Strategic Context

Matrices are fundamental to:
- **Graphics programming**: Rotations, scaling, translations
- **Machine learning**: Neural network layers, weight matrices, transformations
- **Data science**: Linear regression, PCA, dimensionality reduction
- **Game development**: Camera transforms, object positioning

Phase 12 builds on Phase 11's vector foundation to show how matrices transform vectors.

---

## Scope Decisions (Confirmed)

### D-096: 2D Only (Continuing Pattern)

**Decision**: Maintain 2D-only approach from Phase 11 (D-088).

**Rationale**:
- Consistent with vector widget
- 2D transformations are visually clear
- Core concepts transfer to higher dimensions
- 3D transformation matrices (4×4 with homogeneous coordinates) significantly more complex

### D-097: Transformation-Focused Widget

**Decision**: Focus primarily on **visual transformations** (rotate/scale/shear/reflect) with matrix operations as secondary educational content.

**Rationale**:
- Visual transformations are intuitive and engaging
- Seeing the unit square transform builds geometric intuition
- Matrix arithmetic covered in content, not widget interaction
- Keeps widget focused and learnable

---

## Widget Design: MatrixTransformations

### Visual Concept

Show how a 2×2 matrix transforms a unit square and its basis vectors:

```
Before Transform:      After Transform (Rotation 45°):
    y                      y
    ↑                      ↑    
    │  ┌──┐                │      ◇
    │  │  │                │    ╱   ╲
    │  └──┘                │  ╱       ╲
    └─────→ x              └───────────→ x
```

### Architecture

```
src/components/widgets/MatrixTransformations/
├── MatrixTransformations.vue    # Main orchestrator
├── TransformationCanvas.vue     # SVG with unit square & vectors
├── TransformSelector.vue        # Transformation type buttons
├── MatrixDisplay.vue            # Matrix values with editable cells
├── TransformControls.vue        # Sliders for angle, scale, etc.
├── TransformInfo.vue            # Properties: determinant, eigenvalues preview
└── index.ts                     # Exports
```

### Core Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Transformation types | Must | Rotation, Scale, Shear, Reflection |
| Unit square visualization | Must | Shows transformation effect |
| Basis vector display | Must | î, ĵ vectors before/after |
| Matrix display | Must | 2×2 matrix with current values |
| Determinant | Must | Area scaling factor |
| Angle/scale sliders | Must | Control transformation parameters |
| Custom matrix entry | Should | Direct matrix input for exploration |
| Composition preview | Nice | Chain two transformations |
| URL state sync | Must | Shareable configurations |

### Transformation Types

| Type | Matrix | Parameters | Visual Effect |
|------|--------|------------|---------------|
| Identity | [[1,0],[0,1]] | None | No change |
| Rotation | [[cos,-sin],[sin,cos]] | θ angle | Rotate around origin |
| Scale | [[sx,0],[0,sy]] | sx, sy | Stretch/compress |
| Uniform Scale | [[k,0],[0,k]] | k | Zoom in/out |
| Shear X | [[1,k],[0,1]] | k | Slant horizontally |
| Shear Y | [[1,0],[k,1]] | k | Slant vertically |
| Reflect X | [[1,0],[0,-1]] | None | Flip over x-axis |
| Reflect Y | [[-1,0],[0,1]] | None | Flip over y-axis |
| Reflect Origin | [[-1,0],[0,-1]] | None | 180° rotation |

### Visualization Details

**Canvas Layout** (similar scale to VectorOperations):
- Unit square: vertices at (0,0), (1,0), (1,1), (0,1)
- Transformed square: filled semi-transparent
- Basis vectors: î (1,0) and ĵ (0,1) with arrows
- Transformed basis vectors: shows where î and ĵ land
- Grid: reference lines for scale understanding

**Colors** (following design system):
- Original square: `border-primary/50` (light emerald outline)
- Transformed square: `fill-primary/20` (light emerald fill)
- î vector (original): `text-blue-500`
- ĵ vector (original): `text-amber-500`
- Transformed vectors: same colors, darker shade

---

## Math Utilities

### File: `src/utils/math/matrix.ts`

```typescript
// Types
export interface Matrix2x2 {
  a: number  // [0,0]
  b: number  // [0,1]
  c: number  // [1,0]
  d: number  // [1,1]
}
// Matrix: | a  b |
//         | c  d |

export interface TransformationPreset {
  id: string
  name: string
  description: string
  matrix: Matrix2x2
  parameters?: Record<string, number>
}

export type TransformationType = 
  | 'identity' 
  | 'rotation' 
  | 'scale' 
  | 'shearX' 
  | 'shearY' 
  | 'reflectX' 
  | 'reflectY'

// Matrix Operations
export function matrixMultiply(m1: Matrix2x2, m2: Matrix2x2): Matrix2x2
export function matrixVectorMultiply(m: Matrix2x2, v: Vector2D): Vector2D
export function determinant(m: Matrix2x2): number
export function trace(m: Matrix2x2): number
export function transpose(m: Matrix2x2): Matrix2x2
export function inverse(m: Matrix2x2): Matrix2x2 | null  // null if det = 0

// Transformation Generators
export function identityMatrix(): Matrix2x2
export function rotationMatrix(angleDegrees: number): Matrix2x2
export function scaleMatrix(sx: number, sy: number): Matrix2x2
export function uniformScaleMatrix(k: number): Matrix2x2
export function shearXMatrix(k: number): Matrix2x2
export function shearYMatrix(k: number): Matrix2x2
export function reflectionXMatrix(): Matrix2x2
export function reflectionYMatrix(): Matrix2x2

// Analysis
export function isIdentity(m: Matrix2x2, tolerance?: number): boolean
export function isOrthogonal(m: Matrix2x2, tolerance?: number): boolean  // rotation/reflection
export function getTransformationType(m: Matrix2x2): TransformationType | 'custom'

// Validation
export function isValidMatrix(m: unknown): m is Matrix2x2

// Constants
export const MATRIX_TOLERANCE = 1e-10
```

**Test Coverage Target**: 50+ tests covering:
- All matrix operations
- All transformation generators
- Edge cases (zero determinant, identity)
- Composition (multiply two matrices)
- Vector transformation

---

## Content Structure

### Matrices Content Page

`/linear-algebra/matrices` - `MatricesView.vue`

**Sections**:

1. **What is a Matrix?** (Intro)
   - Array of numbers arranged in rows and columns
   - 2×2 matrices for 2D transformations
   - Python: `np.array([[a, b], [c, d]])`

2. **Interactive Transformation Explorer** (Widget)
   - MatrixTransformations widget with URL sync
   - Code parallel showing NumPy/graphics equivalents

3. **Transformation Types** (Collapsible)
   - Rotation: angle parameter, preserves distances
   - Scaling: stretch/compress, changes area
   - Shearing: slants shape, parallelism preserved
   - Reflection: flip across axis

4. **Matrix Operations** (Collapsible)
   - Multiplication (composition of transforms)
   - Determinant (area scale factor)
   - Inverse (undo transformation)
   - Python examples

5. **The Determinant** (Key concept)
   - Geometric meaning: area scaling factor
   - det = 0 means "squished" to lower dimension
   - Sign indicates orientation flip
   - Formula: ad - bc

6. **Composition of Transformations** (Collapsible)
   - Matrix multiplication = chaining transforms
   - Order matters! (non-commutative)
   - Example: rotate then scale vs scale then rotate

7. **Programmer Applications** (Key highlight)
   - Graphics: 2D sprite transformations
   - Games: camera transforms, object placement
   - Image processing: filters as matrix operations
   - ML preview: linear layers as matrix multiplication

8. **Related Topics**
   - Link back to Vectors
   - Link to Linear Equations (systems ↔ matrices)
   - Coming soon: Eigenvalues (future phase?)

---

## Increments

### Increment 12A: Matrix Math Utilities (~45 min)

**Tasks**:
1. Create `src/utils/math/matrix.ts` with types and operations
2. Create `src/utils/math/matrix.test.ts` with 50+ tests
3. Add types to `src/types/math.ts`

**Files**:
- `src/utils/math/matrix.ts` (new)
- `src/utils/math/matrix.test.ts` (new)  
- `src/types/math.ts` (update)

**Success Criteria**:
- All 50+ tests pass
- All transformation generators produce correct matrices
- Matrix composition works correctly

---

### Increment 12B: MatrixTransformations Widget Core (~60 min)

**Tasks**:
1. Create `src/composables/useMatrixTransformations.ts` for state + URL sync
2. Create widget component structure:
   - `MatrixTransformations.vue` (main)
   - `TransformSelector.vue` (transformation type buttons)
   - `TransformationCanvas.vue` (SVG with unit square, vectors)
3. Implement unit square and basis vector rendering

**Files**:
- `src/composables/useMatrixTransformations.ts` (new)
- `src/components/widgets/MatrixTransformations/*.vue` (new)

**Success Criteria**:
- Can select transformation type
- Unit square renders and transforms
- Basis vectors show transformation effect

---

### Increment 12C: Controls & Display (~45 min)

**Tasks**:
1. Create `TransformControls.vue` with sliders (angle, scale factors, shear)
2. Create `MatrixDisplay.vue` showing matrix values
3. Create `TransformInfo.vue` showing determinant, type
4. Add custom matrix input mode

**Files**:
- `src/components/widgets/MatrixTransformations/TransformControls.vue` (new)
- `src/components/widgets/MatrixTransformations/MatrixDisplay.vue` (new)
- `src/components/widgets/MatrixTransformations/TransformInfo.vue` (new)

**Success Criteria**:
- Sliders control transformation parameters
- Matrix display updates reactively
- Determinant shows with interpretation

---

### Increment 12D: Content Page (~45 min)

**Tasks**:
1. Create `MatricesView.vue` comprehensive content page
2. Update navigation and routes
3. Include code examples (NumPy, graphics)
4. Add Related Topics section

**Files**:
- `src/views/linear-algebra/MatricesView.vue` (new)
- `src/router/index.ts` (update)
- `src/data/navigation.ts` (update)

**Success Criteria**:
- Navigation works
- Content renders properly
- Widget integrated with URL sync
- Code examples are accurate

---

### Increment 12E: E2E Tests & Polish (~30 min)

**Tasks**:
1. Create `e2e/linear-algebra/matrix-transformations.spec.ts`
2. Add accessibility tests for matrices page
3. Visual regression baseline updates
4. Polish: mobile responsiveness, keyboard navigation

**Files**:
- `e2e/linear-algebra/matrix-transformations.spec.ts` (new)
- `e2e/accessibility.spec.ts` (update)

**Success Criteria**:
- 12+ E2E tests pass
- Accessibility audit passes
- Widget usable on mobile

---

## Estimated Total Time

| Increment | Time |
|-----------|------|
| 12A: Matrix Utilities | 45 min |
| 12B: Widget Core | 60 min |
| 12C: Controls & Display | 45 min |
| 12D: Content Page | 45 min |
| 12E: E2E & Polish | 30 min |
| **Total** | **~3.75 hours** |

---

## Technical Decisions (Confirmed)

### D-098: Transformation Presets + Custom Matrix Mode

**Decision**: Provide both transformation presets (guided exploration) AND "Custom" mode for direct matrix entry.

**Rationale**:
- Presets guide users through standard transformations
- Custom mode helps users understand matrix-to-transformation relationship
- Entering matrix values and seeing the visual result builds intuition
- Consistent with other widgets offering both presets and custom input

### D-099: No Interactive Composition

**Decision**: Composition (chaining transformations) covered in content only, not as interactive widget feature.

**Rationale**:
- Interactive chaining adds significant widget complexity
- Order-matters demonstration works well with static examples
- Content can show "rotate then scale" vs "scale then rotate" clearly
- Keeps widget scope manageable

### D-100: Eigenvalues Deferred

**Decision**: Eigenvalues/eigenvectors not shown in Phase 12; deferred to future phase or "coming soon".

**Rationale**:
- Eigenvalues deserve dedicated coverage (significant concept)
- This phase focuses on transformations as the core visual story
- Can mention eigenvalues in content as "what makes rotation special"
- Avoids scope creep

---

## Archive Reference

**Component reference**: `archive/snake-math/docs/.vitepress/theme/components/MatrixTransformations.vue`
- Canvas-based (we'll use SVG)
- Has transformation type selector ✓
- Shows unit square transformation ✓
- Matrix display with determinant ✓

**Utility reference**: `archive_utilities.md` section 11
- `matrixMultiply`, `determinant2x2`, `applyTransformation`
- `getRotationMatrix`, `getScaleMatrix`, `getShearMatrix`

**Content reference**: `archive/snake-math/docs/linear-algebra/matrices/`
- basics.md, operations.md, applications.md
- Good foundation for content sections

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Complex SVG for animated transforms | Medium | Medium | Keep animations simple or omit |
| Determinant concept hard to visualize | Low | Low | Use area shading |
| Scope creep (3D, eigenvalues) | Medium | Low | Document as future work |
| Mobile touch on sliders | Low | Medium | Already solved in VectorOperations |

---

## Connections to Prior Phases

| Connection | Phase | How It Connects |
|------------|-------|-----------------|
| Vectors | 11 | Matrix-vector multiplication transforms vectors |
| Linear Equations | 10 (Algebra) | Ax = b, matrices represent systems |
| Trigonometry | 9 | Rotation matrices use sin/cos |
| Coordinate System | 7+ | Reuse visualization patterns |

---

## Success Metrics

- [ ] All unit tests pass (50+)
- [ ] All E2E tests pass (12+)
- [ ] Accessibility audit passes
- [ ] Widget URL sync works
- [ ] Mobile responsive
- [ ] Determinant visualization clear
- [ ] Transformation types all work

---

## Post-Phase Notes

After Phase 12:
- Update ROADMAP.md with completion notes
- Update current_state.md
- Evaluate: is eigenvalues content needed before calculus?
- Review Point: Linear algebra approach working? Ready for calculus?

---

## Increment Instructions

Detailed implementation instructions are available in separate files:

| Increment | File | Focus | Estimated Time |
|-----------|------|-------|----------------|
| 12A | [INCREMENT_12A.md](INCREMENT_12A.md) | Matrix math utilities & tests | 45 min |
| 12B | [INCREMENT_12B.md](INCREMENT_12B.md) | Widget core & composable | 60 min |
| 12C | [INCREMENT_12C.md](INCREMENT_12C.md) | Controls & display components | 45 min |
| 12D | [INCREMENT_12D.md](INCREMENT_12D.md) | Content page & navigation | 45 min |
| 12E | [INCREMENT_12E.md](INCREMENT_12E.md) | E2E tests & polish | 30 min |

### Quick Start

```bash
# Begin with Increment 12A
# Create matrix utilities and run tests:
npm run test -- src/utils/math/matrix.test.ts --watch

# After each increment:
npm run type-check && npm run lint && npm run build
```

### Patterns to Follow

Reference these existing files for established patterns:

| Pattern | Reference File |
|---------|----------------|
| Math utilities | `src/utils/math/vector.ts` |
| Composable with URL sync | `src/composables/useVectors.ts` |
| Widget structure | `src/components/widgets/VectorOperations/` |
| Content page | `src/views/linear-algebra/VectorsView.vue` |
| E2E tests | `e2e/linear-algebra/vector-operations.spec.ts` |
