# Phase 16: Linear Algebra in 3D

**Theme**: *Vectors and Matrices Beyond Flatland*

**Goal**: Extend the 2D linear algebra foundation with interactive 3D vector and matrix visualizations using isometric SVG projection, focusing on concepts that only exist in 3D (cross product, rotation matrices around arbitrary axes).

---

## Strategic Context

Phase 16 builds on the 2D foundations from Phases 11 (Vectors) and 12 (Matrices) to cover essential 3D concepts:

| Concept | 2D (Phases 11-12) | 3D (Phase 16) | Why It Matters |
|---------|-------------------|---------------|----------------|
| Cross Product | Scalar (determinant) | Vector (perpendicular) | 3D graphics normals, physics torque |
| Rotation | Single angle | Roll, pitch, yaw (3 axes) | Game dev, robotics, VR |
| Coordinate System | X, Y | X, Y, Z + handedness | Industry standard conventions |
| Transformations | 2×2 matrices | 3×3 rotation matrices | Real-world applications |

---

## Confirmed Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| **D-120** | Use isometric SVG projection (not Three.js) | Maintains consistency with existing widgets; adequate for education |
| **D-121** | Single phase with multiple increments | Manageable scope, related content |
| **D-122** | Right-handed, Y-up coordinate system | Matches Three.js/Blender conventions |
| **D-123** | Include coordinate markers (1, 2, 3, -1, -2, etc.) | Aids comprehension and precision |
| **D-124** | Origin at center with negative space visible | Shows full coordinate system |
| **D-125** | XZ mesh grid on floor plane (dark grey) | Spatial reference; grey avoids color conflicts with vectors |
| **D-126** | Interactive right-hand rule demonstration | Visual aid for cross product direction |
| **D-127** | Unit cube visualization for 3D matrices | Enhances understanding of transformations |

---

## Scope

### In Scope
- **VectorOperations3D widget**: Cross product, 3D operations, right-hand rule demo
- **MatrixTransformations3D widget**: 3×3 rotation matrices with unit cube
- **Content pages**: Vectors in 3D, Matrices in 3D
- **Isometric projection utilities**: Reusable composable
- **3D math utilities**: Vector3D, Matrix3x3 operations
- **Right-hand rule animation**: Interactive demonstration for cross product

### Out of Scope (Future Enhancement)
- Full Three.js integration (camera rotation)
- 4×4 homogeneous coordinate matrices
- Quaternions
- Animation of transformations

---

## Widget Design: VectorOperations3D

### Architecture

```
src/components/widgets/VectorOperations3D/
├── VectorOperations3D.vue        # Main orchestrator
├── IsometricCanvas3D.vue         # SVG with 3D projection
├── Vector3DInputPanel.vue        # X, Y, Z coordinate inputs
├── Operation3DSelector.vue       # Operation buttons
├── Result3DDisplay.vue           # Results with formulas
├── Vector3DPresets.vue           # Quick-select presets
├── RightHandRuleDemo.vue         # Interactive right-hand rule animation
└── index.ts
```

### Right-Hand Rule Demonstration

Interactive component showing how cross product direction is determined:

```
┌─────────────────────────────────────┐
│  🖐️ Right-Hand Rule                 │
│                                     │
│  1. Point fingers along A           │
│  2. Curl fingers toward B           │
│  3. Thumb points in A × B direction │
│                                     │
│  [Animated SVG hand demonstration]  │
│                                     │
│  Try it: A × B = ?  vs  B × A = ?   │
└─────────────────────────────────────┘
```

Features:
- Animated hand SVG that follows the rule
- Toggle to show A × B vs B × A (opposite directions)
- Connects to current vector values from widget

### Visualization Features

```
Isometric SVG Canvas:
                    +Y
                     ↑
                     │    
            -X ←─────┼─────→ +X
                    /│\
                   / │ \
                +Z   │   -Z
                     ↓
                    -Y

Features:
- XZ mesh grid (floor plane)
- Coordinate markers (1, 2, 3, -1, -2, -3)
- Dashed lines for negative axis portions
- Vector arrows with labels
- Optional: projection shadows on XZ plane
```

### Operations

| Operation | Input | Output | Visualization |
|-----------|-------|--------|---------------|
| Addition | A, B | A + B | Parallelogram in 3D |
| Subtraction | A, B | A - B | Head-to-head |
| **Cross Product** | A, B | A × B | Perpendicular vector |
| Dot Product | A, B | scalar | Angle annotation |
| Magnitude | A | scalar | Length display |
| Normalize | A | unit vector | Unit sphere reference |

### Presets

| Name | Vector A | Vector B | Purpose |
|------|----------|----------|---------|
| Unit Vectors (î × ĵ = k̂) | (1, 0, 0) | (0, 1, 0) | Right-hand rule demo |
| Perpendicular | (1, 2, 3) | (5, -4, 1) | Dot product = 0 |
| Parallel | (1, 2, 1) | (2, 4, 2) | Cross product = 0 |
| Negative Quadrant | (-2, 3, -1) | (1, -2, 3) | Negative space demo |
| Physical Vectors | (3, 4, 0) | (0, 0, 5) | Torque example |

---

## Widget Design: MatrixTransformations3D

### Architecture

```
src/components/widgets/MatrixTransformations3D/
├── MatrixTransformations3D.vue   # Main orchestrator
├── IsometricTransformCanvas.vue  # Unit cube + axes visualization
├── UnitCubeRenderer.vue          # Draws the transformable unit cube
├── Rotation3DSelector.vue        # Rotation axis selection (X, Y, Z)
├── Matrix3DDisplay.vue           # 3×3 matrix values
├── EulerAngleControls.vue        # Angle sliders per axis
├── Transform3DInfo.vue           # Determinant, rotation info
└── index.ts
```

### Unit Cube Visualization

Show how a 3×3 rotation matrix transforms a unit cube (vertices at 0 and 1 on each axis):

```
Before (Identity):           After (Rotation around Y by 45°):
      ┌───────┐                    ┌───────┐
     /│      /│                   /│      /│
    ┌─┼─────┐ │                  / │     / │
    │ │     │ │                 ◇  │    ◇  │
    │ └─────┼─┘      ──→       │   └───│───┘
    │/      │/                  │  /    │  /
    └───────┘                   └◇──────└◇
    
    î, ĵ, k̂ aligned            î, k̂ rotated, ĵ unchanged
```

Features:
- Wireframe unit cube with colored edges (R/G/B for X/Y/Z-aligned edges)
- Original cube shown as ghost/outline for comparison
- Transformed basis vectors (î, ĵ, k̂) shown as arrows
- Vertices labeled (optional toggle)
- Face shading to show orientation (front vs back)

### Transformation Types

| Type | Matrix | Parameters |
|------|--------|------------|
| Rotation around X | Rx(θ) | Angle θ |
| Rotation around Y | Ry(θ) | Angle θ |
| Rotation around Z | Rz(θ) | Angle θ |
| Uniform Scale | sI | Scale factor s |
| Combined | Rz × Ry × Rx | Three angles (Euler) |

### Key Educational Points

1. **Gimbal Lock**: Demonstrate with sequential rotations
2. **Order Matters**: Rx × Ry ≠ Ry × Rx
3. **Determinant**: Still equals 1 for pure rotations
4. **Orthogonality**: Columns remain perpendicular

---

## Math Utilities

### `src/utils/math/vector3d.ts`

```typescript
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// Core operations
export function add(a: Vector3D, b: Vector3D): Vector3D;
export function subtract(a: Vector3D, b: Vector3D): Vector3D;
export function scale(v: Vector3D, s: number): Vector3D;
export function dot(a: Vector3D, b: Vector3D): number;
export function cross(a: Vector3D, b: Vector3D): Vector3D;
export function magnitude(v: Vector3D): number;
export function normalize(v: Vector3D): Vector3D | null;
export function angleBetween(a: Vector3D, b: Vector3D): number | null;

// Utility
export function isParallel(a: Vector3D, b: Vector3D, tolerance?: number): boolean;
export function isPerpendicular(a: Vector3D, b: Vector3D, tolerance?: number): boolean;
export function toString(v: Vector3D, precision?: number): string;
```

### `src/utils/math/matrix3d.ts`

```typescript
export type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

// Generators
export function identity(): Matrix3x3;
export function rotationX(angleDeg: number): Matrix3x3;
export function rotationY(angleDeg: number): Matrix3x3;
export function rotationZ(angleDeg: number): Matrix3x3;
export function scale(sx: number, sy: number, sz: number): Matrix3x3;

// Operations
export function multiply(a: Matrix3x3, b: Matrix3x3): Matrix3x3;
export function multiplyVector(m: Matrix3x3, v: Vector3D): Vector3D;
export function determinant(m: Matrix3x3): number;
export function transpose(m: Matrix3x3): Matrix3x3;

// Euler angles
export function fromEulerAngles(rx: number, ry: number, rz: number): Matrix3x3;
export function toEulerAngles(m: Matrix3x3): { rx: number; ry: number; rz: number };
```

### `src/composables/useIsometricProjection.ts`

```typescript
export interface IsometricConfig {
  scale: number;        // Pixels per unit (default: 35)
  angle: number;        // Isometric angle (default: π/6 = 30°)
  origin: { x: number; y: number };  // SVG origin
}

export function useIsometricProjection(config?: Partial<IsometricConfig>) {
  // Convert 3D point to 2D screen coordinates
  function toScreen(point: Vector3D): { x: number; y: number };
  
  // Convert screen point back to 3D (on XZ plane, y=0)
  function toWorld(screenX: number, screenY: number): Vector3D;
  
  // Generate SVG path for grid
  function generateGrid(size: number): string;
  
  // Generate SVG for coordinate markers
  function generateMarkers(range: number): string;
  
  // Generate SVG for axes
  function generateAxes(length: number): string;
  
  return { toScreen, toWorld, generateGrid, generateMarkers, generateAxes };
}
```

---

## Content Pages

### Vectors in 3D (`/linear-algebra/vectors-3d/`)

1. **From 2D to 3D** (Introduction)
   - Quick 2D review with link to Phase 11 content
   - Why the third dimension matters
   - Coordinate systems and handedness

2. **The Z Component** (Core concept)
   - Vector notation: **v** = (x, y, z)
   - Code: `np.array([x, y, z])`, `Vector3(x, y, z)`

3. **Widget: VectorOperations3D**

4. **Operations in 3D** (Expanding from 2D)
   - Addition, subtraction, scalar multiplication
   - Magnitude: √(x² + y² + z²)
   - Dot product (unchanged formula)

5. **The Cross Product** (Key 3D concept - highlighted)
   - Definition and formula (determinant form)
   - Geometric meaning: perpendicular vector
   - **Right-hand rule interactive demo** ← New feature
   - Properties: **a** × **b** = -(**b** × **a**)
   - Applications: surface normals, torque

6. **Programming Applications** (Collapsible)
   - 3D graphics: surface normals for lighting
   - Physics: torque = **r** × **F**
   - Game dev: camera look-at calculations
   - NumPy code examples

7. **Related Topics**
   - Link to 2D Vectors
   - Link to Matrices in 3D
   - Coming soon: Quaternions?

### Matrices in 3D (`/linear-algebra/matrices-3d/`)

1. **Why 3D Matrices?** (Introduction)
   - From 2D to 3D transformations
   - Applications preview

2. **3×3 Rotation Matrices** (Core concept)
   - Rotation around each axis: Rx, Ry, Rz
   - Formulas with sin/cos

3. **Widget: MatrixTransformations3D**
   - **Unit cube visualization** shows transformation clearly
   - Original cube as ghost reference

4. **Euler Angles** (Key concept - highlighted)
   - Roll, pitch, yaw
   - Order of application matters!
   - Gimbal lock problem (mention only)

5. **Determinant in 3D**
   - Volume scaling factor
   - Pure rotations: det = 1

6. **Programming Applications** (Collapsible)
   - Game engines: Transform components
   - WebGL/OpenGL model matrices
   - Robotics: forward kinematics
   - NumPy code examples

7. **What's Next?** (Collapsible)
   - 4×4 matrices for translation
   - Quaternions (avoiding gimbal lock)

---

## Increments

### Increment 16A: 3D Math Utilities (~60 min)

**Tasks**:
1. Create `src/utils/math/vector3d.ts` with all operations
2. Create `src/utils/math/vector3d.test.ts` (40+ tests)
3. Create `src/utils/math/matrix3d.ts` with rotation generators
4. Create `src/utils/math/matrix3d.test.ts` (40+ tests)
5. Add types to `src/types/math.ts`

**Success Criteria**:
- All 80+ tests pass
- Cross product verified perpendicular
- Rotation matrices verified orthogonal (det = 1)

---

### Increment 16B: Isometric Projection Composable (~45 min)

**Tasks**:
1. Create `src/composables/useIsometricProjection.ts`
2. Create `src/composables/useIsometricProjection.test.ts`
3. Implement: toScreen, toWorld, generateGrid, generateMarkers, generateAxes
4. Verify right-handed Y-up projection

**Success Criteria**:
- Projection mathematically correct
- Grid renders with coordinate markers
- Negative space properly handled

---

### Increment 16C: VectorOperations3D Widget (~90 min)

**Tasks**:
1. Create `src/composables/useVectors3D.ts` for state + URL sync
2. Create widget component structure (7 files including RightHandRuleDemo)
3. Implement isometric canvas with grid (dark grey), markers, axes
4. Implement vector arrow rendering
5. Implement all operations including cross product
6. Implement right-hand rule interactive demonstration
7. Add presets

**Success Criteria**:
- All operations compute correctly
- Cross product visualized perpendicular to inputs
- Right-hand rule demo animates correctly
- URL state syncs properly
- Mobile responsive

---

### Increment 16D: MatrixTransformations3D Widget (~90 min)

**Tasks**:
1. Create `src/composables/useMatrixTransformations3D.ts`
2. Create widget component structure (7 files including UnitCubeRenderer)
3. Implement unit cube wireframe visualization with colored edges
4. Implement ghost/outline for original cube comparison
5. Implement rotation controls per axis
6. Implement 3×3 matrix display
7. Show determinant and rotation info

**Success Criteria**:
- Unit cube transforms correctly with rotations
- Original cube shown as reference
- All rotation types work correctly
- Matrix updates reactively
- Combined rotations demonstrate order dependency
- Mobile responsive

---

### Increment 16E: Content Pages (~60 min)

**Tasks**:
1. Create `src/views/linear-algebra/Vectors3DView.vue`
2. Create `src/views/linear-algebra/Matrices3DView.vue`
3. Update `src/router/index.ts` with new routes
4. Update `src/data/navigation.ts`
5. Add cross-references to 2D content pages

**Success Criteria**:
- Navigation works
- Content renders properly
- Widgets integrated with URL sync
- Code examples are accurate
- Related topics link correctly

---

### Increment 16F: E2E Tests & Polish (~45 min)

**Tasks**:
1. Create `e2e/linear-algebra/vector-operations-3d.spec.ts`
2. Create `e2e/linear-algebra/matrix-transformations-3d.spec.ts`
3. Add accessibility tests
4. Visual regression baseline updates
5. Polish: keyboard navigation, mobile touch

**Success Criteria**:
- 24+ E2E tests pass (12 per widget)
- Accessibility audit passes
- Both widgets usable on mobile

---

## Estimated Timeline

| Increment | Time |
|-----------|------|
| 16A: 3D Math Utilities | 60 min |
| 16B: Isometric Projection Composable | 45 min |
| 16C: VectorOperations3D Widget + Right-Hand Rule | 90 min |
| 16D: MatrixTransformations3D Widget + Unit Cube | 90 min |
| 16E: Content Pages | 60 min |
| 16F: E2E Tests & Polish | 45 min |
| **Total** | **~6.5 hours** |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Isometric projection confusion | Medium | Medium | Clear axis labels, coordinate markers, tooltips |
| Cross product perpendicularity unclear | Low | Low | Dot product verification in UI |
| Z-ordering issues in SVG | Medium | Low | Careful layer management, consistent draw order |
| Mobile touch with 3D inputs | Medium | Medium | Larger touch targets, collapsible panels |
| Scope creep to quaternions | Low | Medium | Document as explicit future work |

---

## Connections to Prior Phases

| Connection | Phase | How It Connects |
|------------|-------|-----------------|
| 2D Vectors | 11 | Extension of same concepts |
| 2D Matrices | 12 | Extension of same concepts |
| Trigonometry | 9 | Rotation matrices use sin/cos |
| SVG patterns | 11, 12 | Reuse arrow drawing, styling |

---

## Archive Reference

**Component**: `archive/snake-math/docs/.vitepress/theme/components/VectorOperations.vue`
- Already used Vector3D types with z-component
- Had cross product implementation
- Canvas-based (we'll use SVG)

**Utilities**: `archive_utilities.md` section 8
- `vectorAdd`, `vectorSubtract`, `dotProduct`, `crossProduct`
- `magnitude`, `normalize`, `angleBetween`

**Content**: `archive/snake-math/docs/linear-algebra/vectors/`
- basics.md, operations.md, advanced.md, applications.md

---

## Post-Phase Updates

After Phase 16 completion, update:
- [ ] `docs/LL_LI.md` - Lessons learned about 3D visualization
- [ ] `docs/DECISIONS.md` - D-120 through D-127
- [ ] `docs/CURRENT_STATE.md` - Phase 16 summary
- [ ] `ROADMAP_V2.md` - Mark Phase 16 complete
- [ ] Consider: Is Three.js integration worth pursuing later?

---

## Success Metrics

- [ ] All unit tests pass (80+)
- [ ] All E2E tests pass (24+)
- [ ] Accessibility audit passes
- [ ] Both widgets URL sync works
- [ ] Mobile responsive
- [ ] Cross product clearly perpendicular
- [ ] Right-hand rule demo animates correctly
- [ ] Unit cube transforms visible and clear
- [ ] Coordinate markers visible and helpful
- [ ] XZ grid (dark grey) aids depth perception without color conflicts
- [ ] Negative space properly visualized
