# Phase 15: Trigonometry — Remaining Topics

**Theme**: *Beyond the Unit Circle*

**Goal**: Complete the trigonometry section with Right Triangle Trig, Trig Identities, Inverse Functions, and practical code applications.

---

## Strategic Context

Phase 9 delivered a comprehensive Unit Circle implementation. The remaining topics expand from that foundation:

| Topic | Programming Connection | Builds On |
|-------|------------------------|-----------|
| Right Triangle Trig | Height/distance calculations, 3D graphics | Unit Circle basics |
| Trig Identities | Simplifying expressions, game physics optimization | sin/cos relationships |
| Inverse Trig Functions | atan2() in games, angle recovery from coordinates | Unit Circle coordinates |
| Trig in Code | Practical implementations programmers actually use | All above topics |

These topics complete the trigonometry section and bridge to linear algebra (vectors, rotations).

---

## Scope Decisions

### D-117: Right Triangle Trig Before Identities

**Decision**: Implement topics in this order: Right Triangle → Identities → Inverse Functions → Trig in Code

**Rationale**:
- Right triangles are more intuitive and grounded in geometry
- SOHCAHTOA is often where learners first encounter trig
- Identities build on understanding both unit circle AND triangles
- Inverse functions need solid forward-function understanding
- "Trig in Code" is a capstone applying everything

---

### D-118: Interactive Triangle Solver Widget

**Decision**: Create an interactive right triangle widget where users can set known values and solve for unknowns.

**Rationale**:
- Practical tool programmers can use as reference
- Demonstrates SOHCAHTOA in action
- Visual feedback reinforces learning
- Similar pattern to existing calculator widgets

---

### D-119: Identity Cards Over Complex Widget

**Decision**: For identities, use interactive "identity cards" rather than a complex expression simplifier.

**Rationale**:
- Expression parsing is complex and error-prone
- Identity cards allow exploration without input validation issues
- Each card can animate/demonstrate the identity
- Matches the educational approach (understanding over calculation)

---

### D-120: atan2 Focus for Inverse Functions

**Decision**: Emphasize `atan2(y, x)` over basic inverse functions.

**Rationale**:
- `atan2` is what programmers actually use
- Handles all four quadrants correctly
- Basic arcsin/arccos have limited domain that confuses learners
- atan2 directly relates to unit circle visualization

---

## Topic 1: Right Triangle Trigonometry

### Content Structure

**Route**: `/trigonometry/right-triangles` → `RightTrianglesView.vue`

**Sections**:

1. **Introduction & SOHCAHTOA** (Expanded by default)
   - The three primary ratios: sin, cos, tan
   - SOHCAHTOA mnemonic with visual
   - Three-Analogy Block:
     - Everyday: Ladder against a wall (angle determines height/reach)
     - Programming: 3D game camera pitch/yaw calculations
     - Visual: Right triangle inscribed in unit circle
   - Common Pitfall: Confusing adjacent vs opposite (depends on which angle!)

2. **Interactive Triangle Solver** (Widget)
   - RightTriangleSolver widget
   - URL state sync for sharing

3. **Solving Triangles** (Collapsible)
   - Given angle + side → find other sides
   - Given two sides → find angle
   - Python code examples using math.sin/cos/tan

4. **Special Right Triangles** (Collapsible)
   - 30-60-90 triangle (ratios: 1, √3, 2)
   - 45-45-90 triangle (ratios: 1, 1, √2)
   - Why these matter (exact values, no calculator needed)

5. **Applications** (Collapsible)
   - Height of a building (angle of elevation)
   - Distance across a river (surveying)
   - Game dev: Calculating projectile trajectories
   - Python code: `calculate_height()`, `distance_from_angle()`

6. **Connection to Unit Circle** (Collapsible)
   - Every right triangle fits in the unit circle
   - Why sin = opposite/hypotenuse = y/1 = y
   - Link back to Unit Circle page

7. **Related Topics**
   - Unit Circle
   - Inverse Trig Functions (to find angles)
   - Vectors (related via components)

### Widget Design: RightTriangleSolver

```
src/components/widgets/RightTriangleSolver/
├── RightTriangleSolver.vue      # Main orchestrator
├── TriangleDiagram.vue          # SVG right triangle with labels
├── ValueInputs.vue              # Input controls for sides/angles
├── SolutionDisplay.vue          # Calculated values and formulas used
└── index.ts
```

**Visual Concept**:
```
         C
        /|
       / |
    c /  | a (opposite to A)
     /   |
    /θ   |
   A-----B
      b (adjacent to A)

Known Values          Solve For
[●] Side a: [___]     Side b: 5.77
[ ] Side b: [___]     Side c: 6.67
[●] Angle A: [30°]    Angle B: 60°
[ ] Angle B: [___]
[ ] Side c: [___]

Formula used: b = a / tan(A)
```

**Features**:
- Toggle which values are "known" (at least 2 required, one must be a side)
- Real-time calculation of unknowns
- Shows formula used for each calculation
- Error states: "Need more information", "Invalid triangle"
- Visual triangle updates to match proportions

### Math Utilities

**File**: `src/utils/math/rightTriangle.ts`

```typescript
export interface RightTriangle {
  a: number | null  // opposite to angle A
  b: number | null  // adjacent to angle A
  c: number | null  // hypotenuse
  A: number | null  // angle in degrees (not the 90°)
  B: number | null  // other angle (A + B = 90)
}

export interface TriangleSolution {
  triangle: RightTriangle  // all values filled
  steps: SolutionStep[]    // formulas and calculations used
  isValid: boolean
  error?: string
}

export interface SolutionStep {
  finding: 'a' | 'b' | 'c' | 'A' | 'B'
  formula: string          // LaTeX formula
  calculation: string      // Numeric calculation
  result: number
}

// Solving functions
export function solveRightTriangle(known: Partial<RightTriangle>): TriangleSolution
export function canSolve(known: Partial<RightTriangle>): boolean
export function validateTriangle(triangle: RightTriangle): boolean

// Individual calculations
export function findOpposite(hypotenuse: number, angleDeg: number): number
export function findAdjacent(hypotenuse: number, angleDeg: number): number
export function findHypotenuse(opposite: number, adjacent: number): number
export function findAngleFromSides(opposite: number, adjacent: number): number

// Special triangles
export const SPECIAL_TRIANGLES = {
  '30-60-90': { sides: [1, Math.sqrt(3), 2], angles: [30, 60, 90] },
  '45-45-90': { sides: [1, 1, Math.sqrt(2)], angles: [45, 45, 90] },
}
```

---

## Topic 2: Trigonometric Identities

### Content Structure

**Route**: `/trigonometry/identities` → `TrigIdentitiesView.vue`

**Sections**:

1. **Why Identities Matter** (Expanded)
   - Simplifying complex expressions
   - Proving equivalences
   - Three-Analogy Block:
     - Everyday: Different ways to say the same thing (a dozen = 12)
     - Programming: Refactoring code that does the same thing more efficiently
     - Visual: Two paths on the unit circle that arrive at same point
   - Common Pitfall: Using identities in wrong direction (simplifying vs expanding)

2. **Interactive Identity Explorer** (Widget)
   - TrigIdentityExplorer widget
   - Visual proof animations

3. **Fundamental Identities** (Collapsible, expanded)
   - Pythagorean: sin²θ + cos²θ = 1
   - Quotient: tan θ = sin θ / cos θ
   - Reciprocal: csc θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ

4. **Pythagorean Family** (Collapsible)
   - sin²θ + cos²θ = 1
   - 1 + tan²θ = sec²θ (divide by cos²θ)
   - 1 + cot²θ = csc²θ (divide by sin²θ)
   - Visual derivation on unit circle

5. **Sum and Difference Formulas** (Collapsible)
   - sin(A ± B) = sin A cos B ± cos A sin B
   - cos(A ± B) = cos A cos B ∓ sin A sin B
   - tan(A ± B) formula
   - Use case: Rotation matrices in graphics

6. **Double Angle Formulas** (Collapsible)
   - sin(2θ) = 2 sin θ cos θ
   - cos(2θ) = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ
   - tan(2θ) formula
   - Derivation from sum formulas

7. **Half Angle Formulas** (Collapsible)
   - sin(θ/2), cos(θ/2), tan(θ/2)
   - Derivation from double angle

8. **Product-to-Sum & Sum-to-Product** (Collapsible)
   - Brief reference (used in signal processing)
   - Link to Fourier analysis concept

9. **Programmer Applications** (Collapsible)
   - Physics engines: Efficient rotation calculations
   - Audio synthesis: Wave interference patterns
   - Shader optimization: GPU trig approximations
   - Python code: verify_identity(), optimize_expression()

10. **Related Topics**
    - Unit Circle (foundation)
    - Right Triangle Trig
    - Inverse Functions

### Widget Design: TrigIdentityExplorer

```
src/components/widgets/TrigIdentityExplorer/
├── TrigIdentityExplorer.vue     # Main orchestrator
├── IdentityCard.vue             # Single identity with animation
├── IdentityProof.vue            # Step-by-step proof display
├── IdentityVerifier.vue         # Numerical verification at angle
└── index.ts
```

**Visual Concept**:
```
┌─────────────────────────────────────────────────────┐
│  Pythagorean Identity                               │
│  ─────────────────────────────────────────────────  │
│                                                     │
│       sin²θ + cos²θ = 1                             │
│                                                     │
│  [Unit Circle Animation showing sin² + cos² = 1]   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ At θ = 45°:                                  │   │
│  │ sin²(45°) + cos²(45°) = 0.5 + 0.5 = 1.00 ✓  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [θ slider: ──●──────────]  θ = 45°                │
│                                                     │
│  [Show Proof] [See in Python]                       │
└─────────────────────────────────────────────────────┘

Identity Categories:
[Pythagorean] [Sum/Diff] [Double Angle] [Half Angle]
```

**Features**:
- Category tabs for identity types
- Each identity card has:
  - LaTeX formula
  - Unit circle animation/visualization
  - Angle slider to verify numerically
  - Expandable algebraic proof
  - Python code snippet
- URL state: selected identity, angle

### Math Utilities

**File**: `src/utils/math/trigIdentities.ts`

```typescript
export interface TrigIdentity {
  id: string
  name: string
  category: 'pythagorean' | 'sum-diff' | 'double' | 'half' | 'product-sum'
  latex: string
  description: string
  proofSteps: ProofStep[]
  verify: (angleDeg: number) => VerificationResult
  pythonCode: string
}

export interface ProofStep {
  step: number
  latex: string
  explanation: string
}

export interface VerificationResult {
  leftSide: number
  rightSide: number
  isEqual: boolean  // within tolerance
  tolerance: number
}

// Identity collections
export const PYTHAGOREAN_IDENTITIES: TrigIdentity[]
export const SUM_DIFFERENCE_IDENTITIES: TrigIdentity[]
export const DOUBLE_ANGLE_IDENTITIES: TrigIdentity[]
export const HALF_ANGLE_IDENTITIES: TrigIdentity[]

// Verification
export function verifyIdentity(identity: TrigIdentity, angleDeg: number): VerificationResult
export function verifyAllIdentities(angleDeg: number): Map<string, VerificationResult>

// Utility
export function getIdentityById(id: string): TrigIdentity | undefined
export function getIdentitiesByCategory(category: string): TrigIdentity[]
```

---

## Topic 3: Inverse Trigonometric Functions

### Content Structure

**Route**: `/trigonometry/inverse-functions` → `InverseTrigView.vue`

**Sections**:

1. **From Coordinates to Angles** (Expanded)
   - The reverse problem: given sin θ = 0.5, what is θ?
   - Why there are infinitely many answers (periodicity)
   - Principal value ranges (how we pick "the" answer)
   - Three-Analogy Block:
     - Everyday: Looking up a word in a dictionary vs finding which word has a definition
     - Programming: Forward lookup vs reverse lookup in a hash map
     - Visual: Going from (x,y) point back to the angle that created it
   - Common Pitfall: arcsin(sin(150°)) ≠ 150° (principal value is 30°!)

2. **Interactive Inverse Function Explorer** (Widget)
   - InverseTrigExplorer widget
   - Shows both the value and why principal value is chosen

3. **The Three Inverse Functions** (Collapsible)
   - arcsin (sin⁻¹): Domain [-1,1], Range [-90°,90°]
   - arccos (cos⁻¹): Domain [-1,1], Range [0°,180°]
   - arctan (tan⁻¹): Domain (-∞,∞), Range (-90°,90°)
   - Why these ranges? (Making function invertible)

4. **The Star of the Show: atan2** (Expanded, highlighted)
   - Why atan2(y, x) is what you actually want
   - Handles all four quadrants
   - Returns angle in correct quadrant
   - Comparison: atan(y/x) vs atan2(y, x)
   - Python: math.atan2(y, x)

5. **Domain Restrictions Visualized** (Collapsible)
   - Why arcsin can't take 2 as input
   - Why arctan has no domain restriction
   - Graphs of inverse functions

6. **Programmer Applications** (Expanded)
   - Calculating angle to target in games
   - Homing missiles / AI movement
   - Converting Cartesian to polar coordinates
   - Mouse angle from center of screen
   - Python code: `angle_to_target()`, `cartesian_to_polar()`

7. **Related Topics**
    - Unit Circle
    - Trig Identities
    - Vectors (direction angles)
    - Complex Numbers (argument)

### Widget Design: InverseTrigExplorer

```
src/components/widgets/InverseTrigExplorer/
├── InverseTrigExplorer.vue      # Main orchestrator
├── FunctionSelector.vue         # arcsin/arccos/arctan/atan2 tabs
├── InverseVisualization.vue     # Unit circle with angle highlight
├── ValueInput.vue               # Input for value (or x,y for atan2)
├── ResultDisplay.vue            # Shows result and alternatives
└── index.ts
```

**Visual Concept**:
```
┌─────────────────────────────────────────────────────┐
│  Inverse Trig Functions                             │
│  [arcsin] [arccos] [arctan] [atan2 ★]              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐    Input:                        │
│  │   Unit       │    x: [0.5  ]  y: [0.866]        │
│  │   Circle     │                                  │
│  │   with       │    atan2(0.866, 0.5) = 60°       │
│  │   angle      │                                  │
│  │   shown      │    In radians: π/3 ≈ 1.047      │
│  └──────────────┘                                  │
│                                                     │
│  Why atan2?                                         │
│  Regular atan would give: 60° ✓ (same in Q1)       │
│  But for (-0.5, 0.866): atan gives 60°             │
│  atan2 correctly gives: 120° ✓                     │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ import math                                  │   │
│  │ angle = math.atan2(0.866, 0.5)  # radians   │   │
│  │ degrees = math.degrees(angle)    # 60.0     │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Features**:
- Tab selection for different inverse functions
- For atan2: two input fields (x, y)
- For others: single input with domain validation
- Unit circle shows the resulting angle
- Shows "other solutions" that are excluded by principal value
- Comparison panel showing atan vs atan2 difference
- URL state sync

### Math Utilities

**File**: `src/utils/math/inverseTrig.ts`

```typescript
export interface InverseResult {
  value: number            // Principal value in radians
  valueDegrees: number     // Principal value in degrees
  exactValue?: string      // Symbolic if known (π/6, π/4, etc.)
  allSolutions: number[]   // Other solutions in [0, 360)
  domain: { min: number; max: number }
  range: { min: number; max: number }  // In degrees
  isValid: boolean
  error?: string
}

export interface Atan2Result extends InverseResult {
  quadrant: 1 | 2 | 3 | 4
  regularAtanWouldGive: number
  regularAtanIsWrong: boolean
}

// Core functions
export function arcsin(value: number): InverseResult
export function arccos(value: number): InverseResult
export function arctan(value: number): InverseResult
export function atan2(y: number, x: number): Atan2Result

// Domain/range info
export const ARCSIN_DOMAIN = { min: -1, max: 1 }
export const ARCSIN_RANGE = { min: -90, max: 90 }
export const ARCCOS_DOMAIN = { min: -1, max: 1 }
export const ARCCOS_RANGE = { min: 0, max: 180 }
export const ARCTAN_DOMAIN = { min: -Infinity, max: Infinity }
export const ARCTAN_RANGE = { min: -90, max: 90 }

// Utility
export function isInDomain(fn: 'arcsin' | 'arccos' | 'arctan', value: number): boolean
export function getExactInverseValue(fn: string, value: number): string | null
export function findAllSolutions(fn: string, value: number, range?: [number, number]): number[]
```

---

## Topic 4: Trig in Code (Practical Applications)

### Content Structure

**Route**: `/trigonometry/in-code` → `TrigInCodeView.vue`

**Sections**:

1. **Trig Is Everywhere in Code** (Expanded)
   - Games, graphics, audio, physics, maps
   - Three-Analogy Block:
     - Everyday: Swiss army knife of programming math
     - Programming: The math behind every game engine's transform system
     - Visual: Show multiple applications: rotation, waves, circles
   - Common Pitfall: Forgetting to convert degrees to radians!

2. **2D Rotation** (Expanded, with mini-widget)
   - The rotation formula
   - Matrix representation (preview for linear algebra)
   - Interactive: rotate a point around origin
   - Code: `rotate_point(x, y, angle)`

3. **Circular Motion** (Collapsible)
   - Position on circle: (r*cos(θ), r*sin(θ))
   - Orbiting objects
   - Clock hands, radar sweeps, loading spinners
   - Code: `circular_motion(t, radius, speed)`

4. **Wave Generation** (Collapsible)
   - sin(t) for oscillation
   - Amplitude, frequency, phase shift
   - Audio synthesis basics
   - Code: `sine_wave(t, freq, amplitude, phase)`

5. **Smooth Animations** (Collapsible)
   - Easing with sin: smooth start/stop
   - Bouncing effects
   - Pendulum motion
   - CSS connection: `cubic-bezier` alternatives

6. **Angle Calculations** (Collapsible)
   - Angle between two points
   - Angle between two vectors (preview)
   - "Look at" / "face towards" in games
   - Code: `angle_to_target(x1, y1, x2, y2)`

7. **Projectile Motion** (Collapsible)
   - Launching at an angle
   - Trajectory calculation
   - Landing point prediction
   - Code: `launch_projectile(speed, angle)`

8. **Geolocation & Maps** (Collapsible)
   - Haversine formula for Earth distances
   - Bearing calculations
   - Brief overview (spherical trig)

9. **Code Recipes Collection**
   - Summary of all code snippets in one reference
   - Copy-paste ready functions

10. **Related Topics**
    - All other trig topics
    - Vectors (for game dev)
    - Matrices (for rotation matrices)

### Widget Design: TrigCodePlayground

```
src/components/widgets/TrigCodePlayground/
├── TrigCodePlayground.vue       # Main with tabs for different demos
├── RotationDemo.vue             # Interactive point rotation
├── WaveDemo.vue                 # Sine wave visualization
├── CircularMotionDemo.vue       # Point orbiting
├── ProjectileDemo.vue           # Projectile trajectory
└── index.ts
```

**Visual Concept**:
```
┌─────────────────────────────────────────────────────┐
│  Trig Code Playground                               │
│  [Rotation] [Waves] [Circular Motion] [Projectile]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │                    ●(rotated)                 │ │
│  │                   /                           │ │
│  │                  /  θ = 45°                   │ │
│  │                 /                             │ │
│  │        ───────●─────────                      │ │
│  │              origin   ●(original)             │ │
│  │                                               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Original Point: (100, 0)                           │
│  Rotation Angle: [──●──] 45°                        │
│  Rotated Point:  (70.7, 70.7)                       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ import math                                  │   │
│  │                                              │   │
│  │ def rotate_point(x, y, angle_deg):          │   │
│  │     rad = math.radians(angle_deg)           │   │
│  │     cos_a = math.cos(rad)                   │   │
│  │     sin_a = math.sin(rad)                   │   │
│  │     return (                                 │   │
│  │         x * cos_a - y * sin_a,              │   │
│  │         x * sin_a + y * cos_a               │   │
│  │     )                                        │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Features**:
- Tab-based demos for different applications
- Each demo is self-contained with:
  - Interactive visualization
  - Controls (sliders, inputs)
  - Live code example that updates
  - "Copy code" button
- URL state preserves active demo and settings

### Math Utilities

**File**: `src/utils/math/trigApplications.ts`

```typescript
export interface Point2D { x: number; y: number }
export interface Vector2D { x: number; y: number }

// Rotation
export function rotatePoint(point: Point2D, angleDeg: number, center?: Point2D): Point2D
export function rotationMatrix(angleDeg: number): [[number, number], [number, number]]

// Circular motion
export function circularMotion(t: number, radius: number, speed: number, center?: Point2D): Point2D
export function orbitPosition(t: number, radius: number, periodSeconds: number): Point2D

// Waves
export interface WaveParams {
  frequency: number
  amplitude: number
  phase: number
}
export function sineWave(t: number, params: WaveParams): number
export function generateWavePoints(params: WaveParams, duration: number, sampleRate: number): Point2D[]

// Angles
export function angleToTarget(from: Point2D, to: Point2D): number  // Uses atan2
export function angleBetweenVectors(v1: Vector2D, v2: Vector2D): number
export function normalizeAngle(angleDeg: number): number

// Projectile
export interface ProjectileParams {
  speed: number
  angleDeg: number
  gravity?: number
}
export interface ProjectileState {
  position: Point2D
  velocity: Vector2D
  time: number
}
export function projectilePosition(t: number, params: ProjectileParams): Point2D
export function projectileTrajectory(params: ProjectileParams, steps: number): Point2D[]
export function projectileRange(params: ProjectileParams): number
export function projectileMaxHeight(params: ProjectileParams): number

// Animation
export function easeInOutSine(t: number): number  // t in [0,1]
export function bounce(t: number, bounces: number): number
export function pendulum(t: number, period: number, amplitude: number): number
```

---

## Implementation Increments

### Increment 15A: Right Triangle Utilities & Widget (~60 min)

**Tasks**:
1. Create `src/utils/math/rightTriangle.ts` with:
   - Triangle solving logic
   - Validation functions
   - Special triangles data
2. Create `src/utils/math/rightTriangle.test.ts` (30+ tests)
3. Create `src/components/widgets/RightTriangleSolver/` components
4. Create `src/composables/useRightTriangle.ts` for state management

**Success Criteria**:
- All tests pass
- Widget solves triangles correctly
- Shows formulas used
- Handles edge cases (invalid inputs, not enough info)

---

### Increment 15B: Right Triangle Content Page (~30 min)

**Tasks**:
1. Create `RightTrianglesView.vue` with full content
2. Update routes and navigation
3. Update `TrigonometryIndexView.vue` to link to new page
4. Add Related Topics section

**Success Criteria**:
- Navigation works
- Content follows design system
- Three-analogy block present
- Common pitfall callout present
- SOHCAHTOA clearly explained

---

### Increment 15C: Trig Identities Utilities (~45 min)

**Tasks**:
1. Create `src/utils/math/trigIdentities.ts` with:
   - All identity definitions with proofs
   - Verification functions
   - Category organization
2. Create `src/utils/math/trigIdentities.test.ts` (40+ tests)

**Success Criteria**:
- All major identities defined
- Verification accurate to floating point tolerance
- Proof steps complete

---

### Increment 15D: Trig Identity Explorer Widget (~60 min)

**Tasks**:
1. Create `src/components/widgets/TrigIdentityExplorer/` components
2. Create `src/composables/useTrigIdentity.ts`
3. Implement identity cards with:
   - Category tabs
   - Angle verification slider
   - Expandable proofs
   - Unit circle animation (optional: start simple)

**Success Criteria**:
- Can browse identities by category
- Numerical verification works
- Proofs display correctly

---

### Increment 15E: Trig Identities Content Page (~30 min)

**Tasks**:
1. Create `TrigIdentitiesView.vue` with full content
2. Update routes and navigation
3. Include all identity categories
4. Python code examples for verification

**Success Criteria**:
- Navigation works
- All identity categories covered
- Programmer applications clear

---

### Increment 15F: Inverse Trig Utilities (~45 min)

**Tasks**:
1. Create `src/utils/math/inverseTrig.ts` with:
   - arcsin, arccos, arctan implementations
   - atan2 with full quadrant handling
   - Exact value detection
   - Alternative solutions calculation
2. Create `src/utils/math/inverseTrig.test.ts` (35+ tests)

**Success Criteria**:
- Correct principal values
- atan2 handles all quadrants
- Exact values for special angles
- Domain validation works

---

### Increment 15G: Inverse Trig Explorer Widget (~60 min)

**Tasks**:
1. Create `src/components/widgets/InverseTrigExplorer/` components
2. Create `src/composables/useInverseTrig.ts`
3. Implement:
   - Function selection tabs
   - atan2 dual input mode
   - Unit circle visualization
   - Comparison panel (atan vs atan2)

**Success Criteria**:
- All four functions work
- atan2 comparison shows why it's preferred
- Domain errors handled gracefully
- Unit circle shows angle correctly

---

### Increment 15H: Inverse Trig Content Page (~30 min)

**Tasks**:
1. Create `InverseTrigView.vue` with full content
2. Update routes and navigation
3. Emphasize atan2 importance
4. Include angle-to-target and coordinate conversion examples

**Success Criteria**:
- Navigation works
- atan2 clearly highlighted
- Programmer applications prominent

---

### Increment 15I: Trig Applications Utilities (~45 min)

**Tasks**:
1. Create `src/utils/math/trigApplications.ts` with:
   - Rotation functions
   - Circular motion
   - Wave generation
   - Projectile physics
   - Animation easing
2. Create `src/utils/math/trigApplications.test.ts` (40+ tests)

**Success Criteria**:
- All utility functions work correctly
- Edge cases handled
- Matches expected physics formulas

---

### Increment 15J: Trig Code Playground Widget (~75 min)

**Tasks**:
1. Create `src/components/widgets/TrigCodePlayground/` components
2. Create `src/composables/useTrigPlayground.ts`
3. Implement four demo tabs:
   - RotationDemo
   - WaveDemo
   - CircularMotionDemo
   - ProjectileDemo
4. Each demo has visualization + live code

**Success Criteria**:
- All demos interactive
- Code updates with parameters
- Copy button works
- URL state for active tab

---

### Increment 15K: Trig in Code Content Page (~30 min)

**Tasks**:
1. Create `TrigInCodeView.vue` with full content
2. Update routes and navigation
3. Code recipes section
4. Related Topics linking all trig pages

**Success Criteria**:
- Navigation works
- Comprehensive applications covered
- Code snippets copy-paste ready

---

### Increment 15L: E2E Tests & Polish (~45 min)

**Tasks**:
1. Create E2E tests for each new page (4 × 10+ tests)
2. Accessibility audit for all new content
3. Mobile responsiveness check
4. Cross-link all Related Topics sections
5. Update TrigonometryIndexView.vue "Coming Soon" section

**Success Criteria**:
- All E2E tests pass
- Accessibility audit passes
- No broken links
- "Coming Soon" section removed or updated

---

## Summary Table

| Increment | Topic | Time Est |
|-----------|-------|----------|
| 15A | Right Triangle Utilities & Widget | 60 min |
| 15B | Right Triangle Content | 30 min |
| 15C | Trig Identities Utilities | 45 min |
| 15D | Identity Explorer Widget | 60 min |
| 15E | Identities Content | 30 min |
| 15F | Inverse Trig Utilities | 45 min |
| 15G | Inverse Trig Explorer Widget | 60 min |
| 15H | Inverse Trig Content | 30 min |
| 15I | Trig Applications Utilities | 45 min |
| 15J | Trig Code Playground Widget | 75 min |
| 15K | Trig in Code Content | 30 min |
| 15L | E2E Tests & Polish | 45 min |
| **Total** | | **~9 hours** |

---

## Technical Decisions Summary

| ID | Decision | Status |
|----|----------|--------|
| D-117 | Topic order: Right Triangle → Identities → Inverse → Code | Confirmed |
| D-118 | Interactive triangle solver widget | Confirmed |
| D-119 | Identity cards over expression simplifier | Confirmed |
| D-120 | atan2 emphasis for inverse functions | Confirmed |
| D-121 | Reuse composable patterns from previous phases | Confirmed |
| D-122 | Tabbed demos for Trig in Code | Confirmed |

---

## Files Created Summary

### New Views (4)
- `src/views/trigonometry/RightTrianglesView.vue`
- `src/views/trigonometry/TrigIdentitiesView.vue`
- `src/views/trigonometry/InverseTrigView.vue`
- `src/views/trigonometry/TrigInCodeView.vue`

### New Widget Directories (4)
- `src/components/widgets/RightTriangleSolver/`
- `src/components/widgets/TrigIdentityExplorer/`
- `src/components/widgets/InverseTrigExplorer/`
- `src/components/widgets/TrigCodePlayground/`

### New Math Utilities (4)
- `src/utils/math/rightTriangle.ts` (+ test file)
- `src/utils/math/trigIdentities.ts` (+ test file)
- `src/utils/math/inverseTrig.ts` (+ test file)
- `src/utils/math/trigApplications.ts` (+ test file)

### New Composables (4)
- `src/composables/useRightTriangle.ts`
- `src/composables/useTrigIdentity.ts`
- `src/composables/useInverseTrig.ts`
- `src/composables/useTrigPlayground.ts`

### E2E Tests (4 files)
- `e2e/trigonometry/right-triangles.spec.ts`
- `e2e/trigonometry/trig-identities.spec.ts`
- `e2e/trigonometry/inverse-trig.spec.ts`
- `e2e/trigonometry/trig-in-code.spec.ts`

---

## Design System Compliance Checklist

For each new content page, verify:

- [ ] Three-Analogy Block with Amber/Emerald/Blue color coding
- [ ] Common Pitfall callout with specific error name
- [ ] Related Topics section at bottom (2-4 topics)
- [ ] Navigation description under 60 characters, engaging hook
- [ ] Code examples use `<CodeExample>` with proper IDs
- [ ] Navigational cards use `bg-surface-alt` + hover
- [ ] Content cards use border-only styling
- [ ] All interactive elements have hover/focus/active states
- [ ] Mobile responsive layout

---

## Post-Phase Evaluation

After Phase 15, evaluate:
- Is trigonometry section complete enough for programmers?
- Should we add more advanced topics (law of sines/cosines, polar coordinates)?
- How well do the widgets work on mobile?
- Are the "Trig in Code" examples useful as quick reference?
- Ready to proceed with other sections (Linear Algebra, more Calculus)?

---

## Archive Reference

Content inspiration from archive:
- `archive/snake-math/docs/.vitepress/theme/components/TrigIdentities.vue` (identity display patterns)
- `archive/snake-math/docs/trigonometry/` (any trig content)

Reusable infrastructure:
- UnitCircleExplorer patterns (SVG, composable, URL sync)
- ContentSection, CollapsiblePanel components
- CodeExample component with IDs
- MathBlock for LaTeX rendering
