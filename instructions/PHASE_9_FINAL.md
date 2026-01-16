# Phase 9: Testing Refinement & Trigonometry — Final Plan

## Overview

**Goals**: 
1. Refine testing strategy based on Phase 1-8 learnings (reduce flakiness, improve CI efficiency)
2. Build the iconic unit circle explorer with synchronized wave displays

**Philosophy Alignment**: Trigonometry is fundamental for graphics programming, game development, signal processing, and physics simulations. The unit circle visualization is one of the most valuable mathematical visualizations for programmers working with rotations, animations, or any periodic phenomena.

**Estimated Total Effort**: 19-25 hours

---

## Confirmed Decisions

### Testing Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| D-070 | Remove visual regression tests from CI | Too flaky; false positives outweigh value; keep for local dev |
| D-071 | Keep E2E tests as blocking in CI | Stable enough, catches integration bugs |
| D-072 | Tiered CI: Quick on push, Full on PR | Saves CI minutes while catching issues before merge |
| D-073 | Accessibility tests always block | WCAG compliance non-negotiable for educational content |

### Trigonometry Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| D-074 | Slider + input only (no drag on circle) | Simpler MVP; dragging is Phase 10+ enhancement candidate |
| D-075 | Wave graphs hidden by toggle | Keeps initial view focused; reveals complexity on demand |
| D-076 | First quadrant special angles + "More" expander | Balances simplicity with completeness |
| D-077 | "More" expander reveals remaining angles as buttons | Simplest implementation; all 30°/45° family angles |
| D-078 | tan(θ) shows "undefined" at 90°, 270° | Clearest for educational purposes |
| D-079 | Radians display: symbolic primary with decimal (π/4 ≈ 0.79) | Best for learning the relationship |

---

## Increment 9A: Testing Infrastructure Refinement

**Effort**: 2-3 hours

### Objectives
1. Restructure CI workflow into tiered approach
2. Remove visual regression from CI (keep locally)
3. Update testing documentation
4. Clean up any flaky tests

### Deliverables

#### 1. Update `.github/workflows/ci.yml`

Replace with tiered workflow:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Tier 1: Always runs (fast feedback)
  quick-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test        # Unit tests only
      - run: npm run build

  # Tier 2: Runs on PR only (thorough testing)
  full-test:
    runs-on: ubuntu-latest
    needs: quick-check
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e    # E2E functional tests
      - run: npm run test:a11y   # Accessibility audits
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

#### 2. Update `package.json` Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test --grep-invert @visual",
    "test:a11y": "playwright test --grep @a11y",
    "test:visual": "playwright test --grep @visual",
    "test:visual:update": "playwright test --grep @visual --update-snapshots",
    "test:all": "npm run test && npm run test:e2e && npm run test:a11y"
  }
}
```

#### 3. Add Test Tags to Existing Test Files

Add appropriate tags to test descriptions:
- E2E tests: `test.describe('WidgetName @e2e', ...)`
- Accessibility tests: `test.describe('Accessibility @a11y', ...)`
- Visual tests: `test.describe('Visual Regression @visual', ...)`

#### 4. Update `playwright.config.ts`

- Remove Firefox/WebKit projects (Chromium only for faster CI)
- Set retries to 1 in CI, 0 locally
- Keep grep patterns undefined (set via CLI)

#### 5. Create `docs/TESTING.md`

Document overall testing strategy:
- Testing layers (Unit, Component, E2E, Visual, A11y)
- When to use each type
- How to run tests locally
- CI workflow explanation
- How to add tests for new features

#### 6. Update `docs/VISUAL_TESTING.md`

Update to reflect local-only status with explanation of why visual tests aren't in CI.

### Success Criteria
- [ ] Push triggers only quick-check (~30s)
- [ ] PR triggers quick-check + full-test (~3min total)
- [ ] Visual tests still work locally
- [ ] No flaky test failures in CI

---

## Increment 9B: Trigonometry Math Utilities

**Effort**: 2-3 hours

### Objectives
1. Create utility functions for trigonometric calculations
2. Handle angle conversions, quadrants, special angles
3. Full unit test coverage

### File: `src/utils/math/trigonometry.ts`

#### Types

```typescript
export type AngleUnit = 'degrees' | 'radians'

export type Quadrant = 1 | 2 | 3 | 4

export interface TrigValues {
  sin: number
  cos: number
  tan: number | null  // null when undefined (90°, 270°)
}

export interface ExactTrigValues {
  sin: string           // e.g., "√2/2"
  cos: string
  tan: string           // "undefined" for 90°, 270°
  sinDecimal: number
  cosDecimal: number
  tanDecimal: number | null
}

export interface QuadrantSigns {
  sin: 1 | -1
  cos: 1 | -1
  tan: 1 | -1
}

export interface SpecialAngle {
  degrees: number
  radiansSymbolic: string   // Display string like "π/4"
  radiansValue: number      // Actual numeric value
  exact: ExactTrigValues
}

export interface PointOnCircle {
  x: number  // cos(θ)
  y: number  // sin(θ)
}

export interface RadianDisplay {
  symbolic: string    // "π/4"
  decimal: number     // 0.7853981...
  formatted: string   // "π/4 ≈ 0.79"
}
```

#### Functions to Implement

```typescript
// Angle conversion
export function degreesToRadians(degrees: number): number
export function radiansToDegrees(radians: number): number
export function normalizeAngle(degrees: number): number  // Returns [0, 360)

// Quadrant utilities
export function getQuadrant(degrees: number): Quadrant
export function getQuadrantSigns(quadrant: Quadrant): QuadrantSigns
export function getReferenceAngle(degrees: number): number

// Trig calculations
export function calculateTrigValues(degrees: number): TrigValues
export function getPointOnCircle(degrees: number): PointOnCircle

// Special angles
export function isSpecialAngle(degrees: number): boolean
export function getExactTrigValues(degrees: number): ExactTrigValues | null
export function getSpecialAngles(): SpecialAngle[]
export function getFirstQuadrantAngles(): SpecialAngle[]  // 0°, 30°, 45°, 60°, 90°
export function getRemainingSpecialAngles(): SpecialAngle[]  // 120° through 330°

// Radian display (D-079)
export function formatRadians(degrees: number): RadianDisplay

// Identity verification (educational)
export function verifyPythagoreanIdentity(degrees: number): { 
  result: number
  isValid: boolean  // sin²θ + cos²θ ≈ 1
}
```

#### Special Angles Data

All 30° and 45° family angles:

| Degrees | Radians | sin | cos | tan |
|---------|---------|-----|-----|-----|
| 0° | 0 | 0 | 1 | 0 |
| 30° | π/6 | 1/2 | √3/2 | √3/3 |
| 45° | π/4 | √2/2 | √2/2 | 1 |
| 60° | π/3 | √3/2 | 1/2 | √3 |
| 90° | π/2 | 1 | 0 | undefined |
| 120° | 2π/3 | √3/2 | -1/2 | -√3 |
| 135° | 3π/4 | √2/2 | -√2/2 | -1 |
| 150° | 5π/6 | 1/2 | -√3/2 | -√3/3 |
| 180° | π | 0 | -1 | 0 |
| 210° | 7π/6 | -1/2 | -√3/2 | √3/3 |
| 225° | 5π/4 | -√2/2 | -√2/2 | 1 |
| 240° | 4π/3 | -√3/2 | -1/2 | √3 |
| 270° | 3π/2 | -1 | 0 | undefined |
| 300° | 5π/3 | -√3/2 | 1/2 | -√3 |
| 315° | 7π/4 | -√2/2 | √2/2 | -1 |
| 330° | 11π/6 | -1/2 | √3/2 | -√3/3 |

### Test File: `src/utils/math/trigonometry.test.ts`

Comprehensive tests for:
- Angle conversions (including edge cases like negative angles, angles > 360°)
- Quadrant determination
- Trig value calculations (compare to Math.sin/cos/tan)
- Special angle exact values
- Radian formatting
- Identity verification

### Success Criteria
- [ ] All functions implemented with TypeScript types
- [ ] 100% test coverage on utility functions
- [ ] Special angles return exact string values
- [ ] Radian display shows both symbolic and decimal (D-079)
- [ ] tan returns null/undefined string for 90°, 270° (D-078)

---

## Increment 9C: UnitCircleExplorer Core Widget

**Effort**: 5-6 hours

### Objectives
1. Build the core unit circle visualization
2. Implement angle controls (slider + input per D-074)
3. Display trig values with exact and decimal forms
4. Special angle quick-select buttons with expander (D-076, D-077)

### Component: `src/components/widgets/UnitCircleExplorer.vue`

#### Layout Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Unit Circle Explorer                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Angle: [====●=====] 45°  ──────────────────────┐                           │
│         [  45  ]°  ○ Degrees  ○ Radians          │                           │
│                                                  │                           │
│  Special Angles:                                 │                           │
│  [0°] [30°] [45°] [60°] [90°]  [▼ More]         │                           │
│                                                  │                           │
│  ┌─────────────────────────────────────────┐    │                           │
│  │              y                          │    │  ┌─────────────────────┐  │
│  │              │                          │    │  │ Trigonometric Values│  │
│  │              │    ╱                     │    │  ├─────────────────────┤  │
│  │              │   ╱                      │    │  │ sin(45°) = √2/2     │  │
│  │              │  ╱  ● (cos θ, sin θ)    │    │  │          ≈ 0.7071   │  │
│  │              │ ╱   │                    │    │  │                     │  │
│  │   ───────────┼─────┼──────── x          │    │  │ cos(45°) = √2/2     │  │
│  │              │     │                    │    │  │          ≈ 0.7071   │  │
│  │              │     │ sin θ              │    │  │                     │  │
│  │              │     │                    │    │  │ tan(45°) = 1        │  │
│  │              │  cos θ                   │    │  │          = 1.0000   │  │
│  │              │                          │    │  ├─────────────────────┤  │
│  │              │                          │    │  │ Quadrant: I         │  │
│  └─────────────────────────────────────────┘    │  │ sin +, cos +, tan + │  │
│                                                  │  │                     │  │
│                                                  │  │ Reference: 45°      │  │
│  ☐ Show wave graphs                             │  │                     │  │
│                                                  │  │ Radians: π/4 ≈ 0.79│  │
│                                                  │  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Props

```typescript
interface Props {
  initialAngle?: number        // Default: 45
  initialUnit?: AngleUnit      // Default: 'degrees'
}
```

#### State

```typescript
const angle = ref(45)                    // Current angle in degrees
const unit = ref<AngleUnit>('degrees')   // Display unit
const showMoreAngles = ref(false)        // Expander state (D-077)
const showWaves = ref(false)             // Wave graphs toggle (D-075)
```

#### Computed

```typescript
const angleRadians = computed(() => degreesToRadians(angle.value))
const trigValues = computed(() => calculateTrigValues(angle.value))
const exactValues = computed(() => getExactTrigValues(angle.value))
const quadrant = computed(() => getQuadrant(angle.value))
const quadrantSigns = computed(() => getQuadrantSigns(quadrant.value))
const referenceAngle = computed(() => getReferenceAngle(angle.value))
const pointOnCircle = computed(() => getPointOnCircle(angle.value))
const radianDisplay = computed(() => formatRadians(angle.value))
```

#### Unit Circle SVG Visualization

Reuse patterns from CoordinateSystem component:
- Circle with radius 1 (scaled to SVG viewport)
- X and Y axes
- Grid lines at 0.5 intervals
- Angle arc from positive x-axis
- Radius line to point on circle
- Point marker at (cos θ, sin θ)
- Dashed lines showing sin θ (vertical) and cos θ (horizontal) projections
- Labels for key values

#### Special Angles Implementation (D-076, D-077)

First quadrant buttons always visible:
```vue
<div class="flex flex-wrap gap-2">
  <button v-for="angle in firstQuadrantAngles" 
          :key="angle.degrees"
          @click="setAngle(angle.degrees)"
          :data-testid="`special-angle-${angle.degrees}`"
          class="...">
    {{ angle.degrees }}°
  </button>
  
  <button @click="showMoreAngles = !showMoreAngles"
          data-testid="special-angles-more"
          class="...">
    {{ showMoreAngles ? '▲ Less' : '▼ More' }}
  </button>
</div>

<div v-if="showMoreAngles" class="flex flex-wrap gap-2 mt-2">
  <button v-for="angle in remainingSpecialAngles"
          :key="angle.degrees"
          @click="setAngle(angle.degrees)"
          :data-testid="`special-angle-${angle.degrees}`"
          class="...">
    {{ angle.degrees }}°
  </button>
</div>
```

#### Trig Values Display (D-078, D-079)

```vue
<div class="space-y-3">
  <!-- Sin -->
  <div>
    <div class="font-mono">
      sin({{ angle }}°) = {{ exactValues?.sin ?? trigValues.sin.toFixed(4) }}
    </div>
    <div v-if="exactValues" class="text-sm text-gray-500">
      ≈ {{ trigValues.sin.toFixed(4) }}
    </div>
  </div>
  
  <!-- Cos -->
  <div>
    <div class="font-mono">
      cos({{ angle }}°) = {{ exactValues?.cos ?? trigValues.cos.toFixed(4) }}
    </div>
    <div v-if="exactValues" class="text-sm text-gray-500">
      ≈ {{ trigValues.cos.toFixed(4) }}
    </div>
  </div>
  
  <!-- Tan (D-078: show "undefined" at 90°, 270°) -->
  <div>
    <div class="font-mono">
      tan({{ angle }}°) = {{ exactValues?.tan ?? (trigValues.tan === null ? 'undefined' : trigValues.tan.toFixed(4)) }}
    </div>
    <div v-if="exactValues && exactValues.tan !== 'undefined'" class="text-sm text-gray-500">
      ≈ {{ trigValues.tan?.toFixed(4) }}
    </div>
  </div>
  
  <!-- Radians (D-079) -->
  <div class="pt-2 border-t">
    <div class="text-sm">
      Radians: {{ radianDisplay.formatted }}
    </div>
  </div>
</div>
```

#### URL State Sync

```typescript
// URL params: ?angle=45&unit=degrees&waves=false
// Use the same pattern as NumberTypeExplorer and other widgets
```

#### Data-testid Attributes

```
data-testid="angle-slider"
data-testid="angle-input"
data-testid="unit-toggle-degrees"
data-testid="unit-toggle-radians"
data-testid="special-angle-{degrees}"   (0, 30, 45, 60, 90, etc.)
data-testid="special-angles-more"
data-testid="unit-circle-svg"
data-testid="point-on-circle"
data-testid="angle-arc"
data-testid="trig-value-sin"
data-testid="trig-value-cos"
data-testid="trig-value-tan"
data-testid="quadrant-display"
data-testid="quadrant-signs"
data-testid="reference-angle-display"
data-testid="radians-display"
data-testid="show-waves-toggle"
```

### Composable: `src/composables/useUnitCircle.ts`

Extract reusable logic:

```typescript
export function useUnitCircle(initialAngle = 45, initialUnit: AngleUnit = 'degrees') {
  const angle = ref(initialAngle)
  const unit = ref(initialUnit)
  
  // All computed values
  const angleRadians = computed(...)
  const trigValues = computed(...)
  // ... etc
  
  // Methods
  function setAngle(degrees: number) { ... }
  function incrementAngle(delta: number) { ... }
  function toggleUnit() { ... }
  
  return {
    angle,
    unit,
    angleRadians,
    trigValues,
    exactValues,
    quadrant,
    quadrantSigns,
    referenceAngle,
    pointOnCircle,
    radianDisplay,
    setAngle,
    incrementAngle,
    toggleUnit,
  }
}
```

### Success Criteria
- [ ] Unit circle renders correctly with proper scaling
- [ ] Angle slider updates visualization in real-time
- [ ] Direct input field accepts numeric values
- [ ] Special angle buttons work (first quadrant visible)
- [ ] "More" expander reveals remaining angles (D-077)
- [ ] Trig values display with exact and decimal forms
- [ ] tan shows "undefined" at 90°, 270° (D-078)
- [ ] Radians show symbolic and decimal (D-079)
- [ ] Quadrant indicator shows correct quadrant and signs
- [ ] Degrees/radians toggle works
- [ ] URL state sync works
- [ ] Accessible (keyboard navigation, screen reader labels)

---

## Increment 9D: Wave Graphs Feature

**Effort**: 4-5 hours

### Objectives
1. Add synchronized sine and cosine wave graphs
2. Show relationship between circular motion and waves
3. Hidden by default, revealed via toggle (D-075)

### Component: `src/components/widgets/WaveGraphs.vue`

#### Props

```typescript
interface Props {
  angleRadians: number    // Current angle in radians
  showSin?: boolean       // Default: true
  showCos?: boolean       // Default: true
}
```

#### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  sin(θ)                                                         │
│    1 ┼────────────────────────────────────────────────          │
│      │      ╭──╮                    ╭──╮                        │
│    0 ┼────╱────╲──────────────────╱────╲──────────              │
│      │   ╱   │  ╲      ╭──╮      ╱      ╲                       │
│   -1 ┼─●     │   ╲────╯  ╰────╱                                 │
│      0  │  π/2    π    3π/2   2π                                │
│         │                                                       │
│         └── current angle marker                                │
├─────────────────────────────────────────────────────────────────┤
│  cos(θ)                                                         │
│    1 ┼●───╮                    ╭──╮                             │
│      │ │   ╲      ╭──╮        ╱    ╲                            │
│    0 ┼─┼────╲────╱────╲──────╱──────╲──────                     │
│      │ │     ╲──╯      ╰────╯                                   │
│   -1 ┼─┼────────────────────────────────────────                │
│      0 │  π/2    π    3π/2   2π                                 │
│        │                                                        │
│        └── current angle marker                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Implementation Approach

Reuse CoordinateSystem and PlotCurve components from Phase 7:

1. **CoordinateSystem** configured for:
   - X range: 0 to 2π (≈6.28)
   - Y range: -1.2 to 1.2 (slight padding)
   - Grid lines at π/2 intervals on x-axis
   - Grid lines at 0.5 intervals on y-axis

2. **PlotCurve** for wave:
   - Generate points from 0 to 2π
   - Apply sin() or cos() to each point

3. **Angle Marker**:
   - Vertical line at current angle position
   - Circle marker at intersection with curve
   - Syncs with unit circle angle changes

#### X-Axis Labels

Display radian values: 0, π/2, π, 3π/2, 2π

Use custom label formatting in CoordinateSystem or overlay text elements.

#### Responsive Behavior

- On mobile: Stack waves vertically, reduce height
- On desktop: Side-by-side or stacked based on available width

### Integration with UnitCircleExplorer

```vue
<!-- In UnitCircleExplorer.vue -->
<div class="mt-4">
  <label class="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" 
           v-model="showWaves" 
           data-testid="show-waves-toggle"
           class="..." />
    <span>Show wave graphs</span>
  </label>
</div>

<Transition name="fade">
  <div v-if="showWaves" class="mt-4" data-testid="wave-graphs">
    <WaveGraphs :angle-radians="angleRadians" />
  </div>
</Transition>
```

### Data-testid Attributes

```
data-testid="wave-graphs"
data-testid="wave-graph-sin"
data-testid="wave-graph-cos"
data-testid="wave-marker-sin"
data-testid="wave-marker-cos"
```

### Success Criteria
- [ ] Both sine and cosine waves render correctly
- [ ] Waves are mathematically accurate
- [ ] Current angle marker syncs with unit circle in real-time
- [ ] X-axis shows radian labels (0, π/2, π, 3π/2, 2π)
- [ ] Y-axis shows -1, 0, 1
- [ ] Graphs are readable on mobile (may stack vertically)
- [ ] Hidden by default, shown via toggle (D-075)
- [ ] Smooth transition when toggling

---

## Increment 9E: Trigonometry Content Page

**Effort**: 4-5 hours

### Objectives
1. Create TrigonometryIndexView as section landing page
2. Create UnitCircleView with comprehensive content
3. Integrate UnitCircleExplorer widget
4. Python code examples for trig calculations

### Route Setup

Add to `src/router/index.ts`:

```typescript
{
  path: '/trigonometry',
  name: 'trigonometry-index',
  component: () => import('@/views/trigonometry/TrigonometryIndexView.vue'),
  meta: {
    title: 'Trigonometry',
    section: 'trigonometry'
  }
},
{
  path: '/trigonometry/unit-circle',
  name: 'unit-circle',
  component: () => import('@/views/trigonometry/UnitCircleView.vue'),
  meta: {
    title: 'Unit Circle',
    section: 'trigonometry'
  }
}
```

### Navigation Update

Add Trigonometry section to sidebar navigation:

```typescript
{
  title: 'Trigonometry',
  basePath: '/trigonometry',
  items: [
    { title: 'Overview', path: '/trigonometry' },
    { title: 'Unit Circle', path: '/trigonometry/unit-circle' }
  ]
}
```

### TrigonometryIndexView.vue

Section landing page with:
- Brief introduction to trigonometry for programmers
- Links to subtopics (Unit Circle)
- Preview of what's covered
- Applications overview (graphics, games, signals)

### UnitCircleView.vue Content Structure

#### Section 1: What is the Unit Circle? (NOT collapsible)
- Definition: Circle with radius 1 centered at origin
- Key insight: Every point is (cos θ, sin θ)
- Why it matters: Foundation for all trigonometry
- Visual preview leading to widget

#### Section 2: Interactive Explorer (NOT collapsible)
- Full UnitCircleExplorer widget
- Brief usage instructions

#### Section 3: The Trigonometric Functions (collapsible, default closed)
- sin θ = y-coordinate (opposite/hypotenuse)
- cos θ = x-coordinate (adjacent/hypotenuse)
- tan θ = sin θ / cos θ (opposite/adjacent)
- Python code example:

```python
import math

def trig_values(angle_degrees):
    """Calculate trig values for an angle."""
    radians = math.radians(angle_degrees)
    return {
        'sin': math.sin(radians),
        'cos': math.cos(radians),
        'tan': math.tan(radians) if angle_degrees % 180 != 90 else None
    }

# Example
values = trig_values(45)
print(f"sin(45°) = {values['sin']:.4f}")  # ≈ 0.7071
print(f"cos(45°) = {values['cos']:.4f}")  # ≈ 0.7071
print(f"tan(45°) = {values['tan']:.4f}")  # = 1.0000
```

#### Section 4: Special Angles (collapsible, default closed)
- Table of exact values (reference table)
- Pattern recognition tips:
  - 30-60-90 triangle relationship
  - 45-45-90 triangle relationship
- Memory techniques

#### Section 5: Quadrants and Signs (collapsible, default closed)
- ASTC mnemonic: "All Students Take Calculus"
- Quadrant I: All positive
- Quadrant II: Sin positive
- Quadrant III: Tan positive
- Quadrant IV: Cos positive
- Python implementation:

```python
def get_quadrant(degrees):
    """Determine quadrant and signs for an angle."""
    normalized = degrees % 360
    
    if 0 <= normalized < 90:
        return 1, {'sin': '+', 'cos': '+', 'tan': '+'}
    elif 90 <= normalized < 180:
        return 2, {'sin': '+', 'cos': '-', 'tan': '-'}
    elif 180 <= normalized < 270:
        return 3, {'sin': '-', 'cos': '-', 'tan': '+'}
    else:
        return 4, {'sin': '-', 'cos': '+', 'tan': '-'}
```

#### Section 6: Radians vs Degrees (collapsible, default closed)
- Why two systems exist
- Conversion formulas
- Why radians for calculus (derivative of sin is cos only in radians)
- Python conversion:

```python
import math

def to_radians(degrees):
    return degrees * math.pi / 180

def to_degrees(radians):
    return radians * 180 / math.pi
```

#### Section 7: Programmer Applications (collapsible, default closed)
- **Rotation in graphics**: Rotating points around origin
- **Game development**: Character movement, projectiles, camera angles
- **Signal processing**: Sine waves, oscillation, frequency
- **Animation**: Smooth periodic motion with sin/cos

```python
import math

def rotate_point(x, y, angle_degrees):
    """Rotate a point around the origin."""
    radians = math.radians(angle_degrees)
    cos_a = math.cos(radians)
    sin_a = math.sin(radians)
    
    new_x = x * cos_a - y * sin_a
    new_y = x * sin_a + y * cos_a
    
    return new_x, new_y

# Rotate (1, 0) by 90° → (0, 1)
result = rotate_point(1, 0, 90)
print(f"Rotated point: ({result[0]:.2f}, {result[1]:.2f})")
```

#### Section 8: Key Identities (NOT collapsible)
- Quick reference table
- Pythagorean: sin²θ + cos²θ = 1
- Reciprocal identities
- Note: More identities in future content

### Success Criteria
- [ ] Index page renders with overview content
- [ ] Unit Circle page renders with all sections
- [ ] Widget integrated and fully functional
- [ ] Code examples syntax-highlighted
- [ ] Collapsible sections work correctly
- [ ] Navigation sidebar updated
- [ ] Breadcrumbs work
- [ ] Mobile responsive

---

## Increment 9F: E2E Tests & Polish

**Effort**: 2-3 hours

### Objectives
1. Write E2E tests for UnitCircleExplorer
2. Accessibility audit for new pages
3. Final polish and documentation updates

### E2E Tests

Create `e2e/widgets/unit-circle-explorer.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('UnitCircleExplorer @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trigonometry/unit-circle')
  })

  test('displays default angle of 45°', async ({ page }) => {
    await expect(page.locator('[data-testid="angle-input"]')).toHaveValue('45')
  })

  test('slider updates trig values', async ({ page }) => {
    await page.locator('[data-testid="angle-slider"]').fill('90')
    await expect(page.locator('[data-testid="trig-value-sin"]')).toContainText('1')
    await expect(page.locator('[data-testid="trig-value-cos"]')).toContainText('0')
    await expect(page.locator('[data-testid="trig-value-tan"]')).toContainText('undefined')
  })

  test('special angle buttons work', async ({ page }) => {
    await page.locator('[data-testid="special-angle-60"]').click()
    await expect(page.locator('[data-testid="angle-input"]')).toHaveValue('60')
  })

  test('more angles expander reveals additional buttons', async ({ page }) => {
    // Initially hidden
    await expect(page.locator('[data-testid="special-angle-120"]')).not.toBeVisible()
    
    // Click expander
    await page.locator('[data-testid="special-angles-more"]').click()
    
    // Now visible
    await expect(page.locator('[data-testid="special-angle-120"]')).toBeVisible()
    await expect(page.locator('[data-testid="special-angle-180"]')).toBeVisible()
  })

  test('wave graphs toggle works', async ({ page }) => {
    // Hidden by default
    await expect(page.locator('[data-testid="wave-graphs"]')).not.toBeVisible()
    
    // Toggle on
    await page.locator('[data-testid="show-waves-toggle"]').check()
    await expect(page.locator('[data-testid="wave-graphs"]')).toBeVisible()
    
    // Toggle off
    await page.locator('[data-testid="show-waves-toggle"]').uncheck()
    await expect(page.locator('[data-testid="wave-graphs"]')).not.toBeVisible()
  })

  test('degrees/radians toggle works', async ({ page }) => {
    // Default is degrees
    await expect(page.locator('[data-testid="unit-toggle-degrees"]')).toBeChecked()
    
    // Switch to radians
    await page.locator('[data-testid="unit-toggle-radians"]').click()
    await expect(page.locator('[data-testid="unit-toggle-radians"]')).toBeChecked()
  })

  test('URL state sync works', async ({ page }) => {
    // Change angle
    await page.locator('[data-testid="angle-slider"]').fill('60')
    
    // Check URL updated
    await expect(page).toHaveURL(/angle=60/)
    
    // Navigate directly with URL param
    await page.goto('/trigonometry/unit-circle?angle=30')
    await expect(page.locator('[data-testid="angle-input"]')).toHaveValue('30')
  })

  test('quadrant display updates correctly', async ({ page }) => {
    await page.locator('[data-testid="angle-slider"]').fill('45')
    await expect(page.locator('[data-testid="quadrant-display"]')).toContainText('I')
    
    await page.locator('[data-testid="angle-slider"]').fill('135')
    await expect(page.locator('[data-testid="quadrant-display"]')).toContainText('II')
    
    await page.locator('[data-testid="angle-slider"]').fill('225')
    await expect(page.locator('[data-testid="quadrant-display"]')).toContainText('III')
    
    await page.locator('[data-testid="angle-slider"]').fill('315')
    await expect(page.locator('[data-testid="quadrant-display"]')).toContainText('IV')
  })
})
```

### Accessibility Tests

Add trigonometry pages to accessibility audit in `e2e/accessibility/audit.spec.ts`:

```typescript
test('trigonometry index page has no accessibility violations @a11y', async ({ page }) => {
  await page.goto('/trigonometry')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('unit circle page has no accessibility violations @a11y', async ({ page }) => {
  await page.goto('/trigonometry/unit-circle')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

### Documentation Updates

#### Update `docs/ROADMAP.md`
- Mark Phase 9 as complete
- Update document history
- Verify Phase 10 is correctly described

#### Update `docs/decisions.md` (or create if doesn't exist)
Add all Phase 9 decisions:
- D-070 through D-079

#### Update `docs/current_state.md`
- Add Trigonometry section
- List UnitCircleExplorer features
- Update component count

### Final Checklist Review

Run through all success criteria from previous increments.

### Success Criteria
- [ ] All E2E tests pass
- [ ] Accessibility audit passes for new pages
- [ ] All documentation updated
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Production build succeeds
- [ ] No console errors in browser

---

## Phase 9 Complete Checklist

### Testing Infrastructure (9A)
- [ ] CI workflow updated with tiered approach
- [ ] Visual tests removed from CI (local only)
- [ ] Test tags working (@e2e, @a11y, @visual)
- [ ] `docs/TESTING.md` created
- [ ] `docs/VISUAL_TESTING.md` updated

### Math Utilities (9B)
- [ ] `trigonometry.ts` implemented
- [ ] All utility functions have tests
- [ ] Special angles return exact values
- [ ] Radian display shows symbolic + decimal

### UnitCircleExplorer Widget (9C)
- [ ] Unit circle SVG renders correctly
- [ ] Angle controls work (slider, input)
- [ ] Special angle buttons work
- [ ] "More" expander reveals additional angles
- [ ] Trig values display exact + decimal
- [ ] tan shows "undefined" at 90°, 270°
- [ ] Quadrant display works
- [ ] URL state sync works

### Wave Graphs (9D)
- [ ] Sin and cos waves render correctly
- [ ] Angle marker syncs with unit circle
- [ ] Radian labels on x-axis
- [ ] Hidden by default, toggle works
- [ ] Mobile responsive

### Content (9E)
- [ ] TrigonometryIndexView created
- [ ] UnitCircleView created with all sections
- [ ] Widget integrated
- [ ] Code examples highlighted
- [ ] Navigation updated

### Testing (9F)
- [ ] All E2E tests pass
- [ ] Accessibility audit passes
- [ ] Documentation updated

### Quality Gates
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] Production build succeeds
- [ ] No console errors

---

## Estimated Effort Summary

| Increment | Effort | Cumulative |
|-----------|--------|------------|
| 9A: Testing Infrastructure | 2-3 hours | 2-3 hours |
| 9B: Trigonometry Utilities | 2-3 hours | 4-6 hours |
| 9C: UnitCircleExplorer Core | 5-6 hours | 9-12 hours |
| 9D: Wave Graphs | 4-5 hours | 13-17 hours |
| 9E: Content Page | 4-5 hours | 17-22 hours |
| 9F: E2E Tests & Polish | 2-3 hours | 19-25 hours |

**Total Estimated Effort: 19-25 hours**

---

## File Creation Summary

### New Files
```
src/utils/math/trigonometry.ts
src/utils/math/trigonometry.test.ts
src/composables/useUnitCircle.ts
src/components/widgets/UnitCircleExplorer.vue
src/components/widgets/WaveGraphs.vue
src/views/trigonometry/TrigonometryIndexView.vue
src/views/trigonometry/UnitCircleView.vue
e2e/widgets/unit-circle-explorer.spec.ts
docs/TESTING.md
```

### Modified Files
```
.github/workflows/ci.yml
package.json
playwright.config.ts
src/router/index.ts
src/components/layout/Sidebar.vue (or navigation config)
docs/VISUAL_TESTING.md
docs/ROADMAP.md
docs/current_state.md
docs/decisions.md
e2e/accessibility/audit.spec.ts
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| SVG complexity | Reuse patterns from Phase 7 CoordinateSystem |
| Wave sync lag | Use computed properties, avoid watchers where possible |
| Mobile layout issues | Test early on mobile, use responsive breakpoints |
| CI flakiness persists | Increase timeouts, add retry logic, document known issues |
| Exact value edge cases | Comprehensive unit tests for all special angles |

---

## Post-Phase Review Questions

After Phase 9 completion, evaluate:

1. Is the tiered CI approach working well? Any adjustments needed?
2. Is the widget interaction model intuitive? Should drag-on-circle be prioritized for Phase 10?
3. Are wave graphs valuable enough to justify the complexity? User feedback needed.
4. Is the content depth appropriate? Too much/too little for programmers?
5. Performance acceptable with wave graph animations?

---

*This is the finalized Phase 9 plan with all decisions confirmed. Ready for implementation.*
