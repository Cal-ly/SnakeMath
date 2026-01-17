# Phase 11: Linear Algebra — Vectors

**Theme**: *The Language of ML*

**Goal**: Visualize vector operations in 2D space with clear connections to programming and ML applications.

---

## Strategic Context

Linear Algebra is the mathematical foundation of machine learning:
- Neural networks are matrix operations
- Embeddings (word2vec, image features) are vectors
- Similarity measures use dot products
- Transformations use matrices

Phase 11 introduces vectors; Phase 12 builds to matrices.

---

## Scope Decision: 2D Only (Confirmed)

**Decision D-088**: Phase 11 is **2D only**. 3D deferred to future enhancement.

| Factor | 2D Only | 2D + 3D |
|--------|---------|---------|
| Complexity | Lower | Higher |
| Visualization | Clear SVG arrows | Requires 3D projection/perspective |
| Cross product | Determinant form (scalar result) | True cross product (vector result) |
| Educational focus | Clearer intuition | More complete but harder to grasp |
| Implementation time | ~3h | ~5-6h |

**Rationale**:
- 2D provides all core concepts (addition, dot product, magnitude, angle)
- 3D visualization is significantly more complex (isometric projection, z-ordering)
- Cross product in 2D still exists as a scalar (the z-component)
- Can extend to 3D in a future polish phase if needed

**Question 1**: Should Phase 11 be 2D-only, with 3D deferred? (Recommended: Yes)

---

## Widget Design: VectorOperations

### Architecture

```
src/components/widgets/VectorOperations/
├── VectorOperations.vue         # Main orchestrator
├── VectorCanvas.vue             # SVG visualization area
├── VectorInputPanel.vue         # Coordinate inputs for vectors A & B
├── OperationSelector.vue        # Operation selection (add, subtract, dot, etc.)
├── ResultDisplay.vue            # Operation result with formula
├── VectorPresets.vue            # Quick-select common vector pairs
└── index.ts                     # Exports
```

### Core Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Vector input (A & B) | Must | X, Y coordinate inputs for two vectors |
| Arrow visualization | Must | SVG arrows from origin, labeled |
| Addition | Must | A + B with parallelogram law visual |
| Subtraction | Must | A - B shown as head-to-head |
| Dot product | Must | A · B = \|A\| \|B\| cos θ |
| Magnitude | Must | \|A\| = √(x² + y²) |
| Angle between | Must | θ = arccos(A · B / (\|A\| \|B\|)) |
| Scalar multiplication | Should | kA visualization |
| Unit vector | Should | Â = A / \|A\| |
| Perpendicularity check | Nice | Highlight when dot product = 0 |
| URL state sync | Must | Share specific vector configurations |

### Preset Vector Pairs

| Name | Vector A | Vector B | Purpose |
|------|----------|----------|---------|
| Unit Vectors | (1, 0) | (0, 1) | Standard basis î, ĵ |
| Parallel | (2, 3) | (4, 6) | Same direction, scalar multiple |
| Perpendicular | (3, 4) | (-4, 3) | Dot product = 0 |
| 45° Angle | (1, 0) | (1, 1) | Clear angle calculation |
| Opposite | (2, 1) | (-2, -1) | 180° apart |

### Visualization Details

```
Canvas Layout (400x400 SVG):

          y
          ↑
          │    B (blue)
          │   ↗
          │  /
          │ /
          │/______→ A (emerald)
          └──────────→ x
        Origin
```

**Colors** (following design system):
- Vector A: `text-primary` (emerald)
- Vector B: `text-blue-600`
- Result vector: `text-amber-600`
- Grid: `border-border`
- Axes: `text-text-secondary`

---

## Math Utilities

### File: `src/utils/math/vector.ts`

```typescript
// Types
interface Vector2D {
  x: number
  y: number
}

interface VectorOperationResult {
  vector?: Vector2D
  scalar?: number
  angle?: number  // in degrees
}

// Core Operations
export function vectorAdd(a: Vector2D, b: Vector2D): Vector2D
export function vectorSubtract(a: Vector2D, b: Vector2D): Vector2D
export function scalarMultiply(v: Vector2D, k: number): Vector2D
export function dotProduct(a: Vector2D, b: Vector2D): number
export function magnitude(v: Vector2D): number
export function normalize(v: Vector2D): Vector2D | null  // null if zero vector
export function angleBetween(a: Vector2D, b: Vector2D): number | null  // degrees, null if either zero
export function isParallel(a: Vector2D, b: Vector2D, tolerance?: number): boolean
export function isPerpendicular(a: Vector2D, b: Vector2D, tolerance?: number): boolean

// Validation
export function isValidVector(v: unknown): v is Vector2D
export function isZeroVector(v: Vector2D, tolerance?: number): boolean
```

**Test Coverage Target**: 40+ tests covering:
- Basic operations
- Edge cases (zero vectors, unit vectors)
- Floating point tolerance
- Parallel/perpendicular detection

---

## Content Structure

### Linear Algebra Section Landing Page

`/linear-algebra` - `LinearAlgebraIndexView.vue`

**Content**:
- "Math of Machine Learning" introduction
- Why vectors and matrices matter for programmers
- Subsection links: Vectors (this phase), Matrices (coming soon)
- Python NumPy integration preview

### Vectors Content Page

`/linear-algebra/vectors` - `VectorsView.vue`

**Sections**:

1. **What is a Vector?** (Collapsed by default: No)
   - Math definition vs programming arrays
   - Geometric interpretation (arrow from origin)
   - Python: `[x, y]` list or `np.array([x, y])`

2. **Interactive Explorer** (Widget)
   - VectorOperations widget with URL sync
   - Code parallel showing NumPy equivalents

3. **Vector Addition** (Collapsible)
   - Parallelogram law visualization
   - Component-wise: `(a₁ + b₁, a₂ + b₂)`
   - Python: `a + b` with NumPy

4. **Dot Product** (Collapsible)
   - Formula: `a · b = a₁b₁ + a₂b₂`
   - Geometric: `|a| |b| cos θ`
   - Key insight: measures "alignment"
   - Python: `np.dot(a, b)`

5. **Magnitude & Unit Vectors** (Collapsible)
   - Pythagorean theorem connection
   - Normalization: dividing by magnitude
   - Python: `np.linalg.norm(v)`

6. **Angle Between Vectors** (Collapsible)
   - Derived from dot product
   - Perpendicular = 0° dot product
   - Python: `np.arccos(dot / (norm_a * norm_b))`

7. **ML Applications** (Key highlight section)
   - Word embeddings as vectors
   - Cosine similarity
   - Feature vectors in classification
   - Code example: simple similarity calculation

8. **Related Topics**
   - Link to Matrices (coming soon)
   - Link back to Summation (vector sums)
   - Link to Statistics (mean as centroid)

---

## Increments

### Increment 11A: Vector Math Utilities (~45 min)

**Tasks**:
1. Create `src/utils/math/vector.ts` with types and core operations
2. Create `src/utils/math/vector.test.ts` with 40+ tests
3. Add types to `src/types/math.ts`: `Vector2D`, `VectorPreset`

**Files**:
- `src/utils/math/vector.ts` (new)
- `src/utils/math/vector.test.ts` (new)
- `src/types/math.ts` (update)

**Success Criteria**:
- All 40+ tests pass
- Type-safe operations
- Zero vector and floating point edge cases handled

---

### Increment 11B: VectorOperations Widget Core (~60 min)

**Tasks**:
1. Create `src/composables/useVectors.ts` for state management + URL sync
2. Create widget component structure:
   - `VectorOperations.vue` (main)
   - `VectorInputPanel.vue` (coordinate inputs)
   - `VectorCanvas.vue` (SVG visualization)
3. Basic arrow rendering with grid

**Files**:
- `src/composables/useVectors.ts` (new)
- `src/components/widgets/VectorOperations/*.vue` (new)

**Success Criteria**:
- Can input two vectors
- Arrows render correctly in SVG
- Grid and axes display properly

---

### Increment 11C: Operations & Results (~45 min)

**Tasks**:
1. Create `OperationSelector.vue` with operation buttons
2. Create `ResultDisplay.vue` showing calculation and formula
3. Create `VectorPresets.vue` for quick-select
4. Add parallelogram visualization for addition
5. Implement all operations in composable

**Files**:
- `src/components/widgets/VectorOperations/OperationSelector.vue` (new)
- `src/components/widgets/VectorOperations/ResultDisplay.vue` (new)
- `src/components/widgets/VectorOperations/VectorPresets.vue` (new)

**Success Criteria**:
- All operations compute correctly
- Presets load vector pairs
- Results display with LaTeX formulas

---

### Increment 11D: Content Pages (~45 min)

**Tasks**:
1. Create `LinearAlgebraIndexView.vue` section landing page
2. Create `VectorsView.vue` comprehensive content page
3. Add routes and navigation
4. Include code examples (NumPy)

**Files**:
- `src/views/linear-algebra/LinearAlgebraIndexView.vue` (new)
- `src/views/linear-algebra/VectorsView.vue` (new)
- `src/router/index.ts` (update)
- `src/data/navigation.ts` (update)

**Success Criteria**:
- Navigation works
- Content renders properly
- Widget integrated with URL sync
- Related topics link correctly

---

### Increment 11E: E2E Tests & Polish (~30 min)

**Tasks**:
1. Create `e2e/linear-algebra/vector-operations.spec.ts`
2. Add accessibility tests for linear algebra pages
3. Visual regression baseline updates
4. Polish: mobile responsiveness, keyboard navigation

**Files**:
- `e2e/linear-algebra/vector-operations.spec.ts` (new)
- `e2e/accessibility.spec.ts` (update)

**Success Criteria**:
- 12+ E2E tests pass
- Accessibility audit passes
- Widget usable on mobile

---

## Estimated Total Time

| Increment | Time |
|-----------|------|
| 11A: Math Utilities | 45 min |
| 11B: Widget Core | 60 min |
| 11C: Operations & Results | 45 min |
| 11D: Content Pages | 45 min |
| 11E: E2E & Polish | 30 min |
| **Total** | **~3.75 hours** |

---

## Technical Decisions (Confirmed)

**D-088**: 2D vectors only in Phase 11; 3D deferred to future enhancement.

**D-089**: Widget defaults to Addition operation for immediate visual feedback.

**D-090**: Angles displayed in degrees with radians in parentheses.

**D-091**: Fixed coordinate system (-5 to +5) with input validation.

---

## Archive Reference

**Component reference**: `archive/snake-math/docs/.vitepress/theme/components/VectorOperations.vue`
- Canvas-based (we'll use SVG)
- Has parallelogram law visualization ✓
- Shows dot product, cross product, angle ✓
- Preset vectors ✓

**Utility reference**: `archive_utilities.md` section 8
- All core operations documented
- Good test case guidance

**Content reference**: `archive/snake-math/docs/linear-algebra/vectors/`
- basics.md, operations.md, advanced.md, applications.md
- Covers all planned content sections

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| SVG arrow rendering issues | Low | Medium | Use established PlotLine patterns |
| Floating point comparison bugs | Medium | Low | Use tolerance constants |
| Mobile touch on small vectors | Medium | Medium | Minimum arrow size, input-focused interaction |
| Scope creep (3D requests) | Medium | Low | Document as future enhancement |

---

## Success Metrics

- [ ] All unit tests pass (40+)
- [ ] All E2E tests pass (12+)
- [ ] Accessibility audit passes
- [ ] Widget URL sync works
- [ ] Mobile responsive
- [ ] Code examples compile (NumPy)
- [ ] ML applications section compelling

---

## Post-Phase Notes

After Phase 11:
- Update ROADMAP.md with completion notes
- Update current_state.md
- Archive phase summary to `docs/archive/PHASE_11_COMPLETE.md`
- Review: is 3D needed for Phase 12 (Matrices)?
