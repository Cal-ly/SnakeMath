# SnakeMath Roadmap

## Vision

**SnakeMath** teaches mathematics to programmers by revealing that mathematical notation is just code they already know. The long-term trajectory leads from foundational concepts through calculus to AI/ML fundamentals.

**Core Philosophy**: "Sigma is just a for loop" — and every mathematical concept has a programming equivalent.

---

## Strategic Trajectory

```
Basics → Algebra → Trigonometry → Statistics → Linear Algebra → Calculus → AI/ML
```

Each topic builds toward machine learning foundations:

| Topic | ML Connection |
|-------|---------------|
| Summation (Σ) | Loss functions, gradient descent sums |
| Exponentials/Logarithms | Activation functions, cross-entropy loss |
| Statistics | Distributions, probability, Bayesian inference |
| Linear Algebra | Neural network operations, embeddings, transformations |
| Calculus | Backpropagation, optimization, gradients |

---

## Phase Overview

| Phase | Focus | Widget | Content | Status |
|-------|-------|--------|---------|--------|
| 1 | Project Foundation | — | — | ✅ Complete |
| 2 | Layout & Navigation | — | — | ✅ Complete |
| 3 | Content Components | — | — | ✅ Complete |
| 4 | Number Types | NumberTypeExplorer | Basics: Number Types | ✅ Complete |
| **5** | **Summation Notation** | **SummationExplorer** | **Algebra: Summation** | 🎯 Current |
| 6 | Basics Completion + Testing | — (minor) | Basics: Functions, Variables, Order of Ops | Planned |
| 7 | Quadratic Functions | QuadraticExplorer | Algebra: Quadratics | Planned |
| 8 | Exponentials & Logarithms | ExponentialCalculator | Algebra: Exp/Log | Planned |
| 9 | Trigonometry | UnitCircleExplorer | Trig: Unit Circle | Planned |
| 10 | Statistics Foundation | StatisticsCalculator | Statistics: Descriptive | Planned |
| 11 | Linear Algebra: Vectors | VectorOperations | Linear Algebra: Vectors | Planned |
| 12 | Linear Algebra: Matrices | MatrixTransformations | Linear Algebra: Matrices | Planned |
| 13 | Calculus: Limits | LimitsExplorer | Calculus: Limits | Planned |
| 14 | Calculus: Derivatives | DerivativeVisualizer | Calculus: Derivatives | Planned |
| 15+ | AI/ML Foundations | Various | ML Bridge Content | Future |

---

## Detailed Phase Descriptions

### Phase 5: Summation Notation
*"Sigma is a For Loop"*

**Goal**: Deliver the core thesis of SnakeMath through an interactive summation explorer.

| Track | Deliverables |
|-------|--------------|
| Content | Algebra section, Summation topic (intro → formulas → applications) |
| Widget | SummationExplorer: presets, bounds input, code parallel, bar chart, formula comparison |
| Polish | Widget component architecture, animation patterns |

**Key Features**:
- Side-by-side math notation ↔ Python/JavaScript code
- Animated bar chart showing term accumulation
- Closed-form formula comparison (O(n) vs O(1))
- URL state sync for shareable configurations

**Success Metric**: User sees Σ notation and immediately thinks "that's just a for loop!"

---

### Phase 6: Basics Completion + Testing Infrastructure
*Fill the Foundation, Add Safety Nets*

**Goal**: Complete Basics section content and establish automated testing.

| Track | Deliverables |
|-------|--------------|
| Content | Functions (composition, inverse), Variables & Expressions, Order of Operations |
| Widget | Minor enhancements only |
| Polish | Component library refinement, consistent patterns |
| Infrastructure | **E2E testing (Playwright), Accessibility audits (axe-core)** |

**Content Migration** (from archive):
- `basics/functions.md` — Vending machine analogy, composition, inverse
- `basics/variables-expressions.md` — Expression building, implementation methods
- `basics/order-of-operations.md` — PEMDAS, precedence tables, AST concepts

**Testing Additions**:
- Playwright setup and configuration
- E2E tests for navigation and existing widgets
- Accessibility audit integration
- CI workflow updates

---

### Phase 7: Quadratic Functions
*Visual Algebra*

**Goal**: Build rich graphing widget with coordinate system foundation.

| Track | Deliverables |
|-------|--------------|
| Content | Quadratics: standard/vertex/factored forms, solving methods, applications |
| Widget | QuadraticExplorer: coefficient sliders, parabola graph, roots visualization |
| Polish | Reusable coordinate system component, smooth transitions |
| Infrastructure | **Visual regression testing** |

**Widget Features**:
- Coefficient sliders (a, b, c)
- SVG parabola with vertex, roots, axis of symmetry
- Form conversion display (standard ↔ vertex ↔ factored)
- Discriminant analysis with root classification
- Real-world presets (projectile motion, profit optimization)
- Complex roots connection to NumberTypeExplorer

**Technical Foundation**: Coordinate system SVG component (reusable for future phases)

---

### Phase 8: Exponentials & Logarithms
*Growth, Decay, and Complexity*

**Goal**: Connect exponential/logarithmic functions to algorithm analysis.

| Track | Deliverables |
|-------|--------------|
| Content | Exponential functions, logarithms, growth/decay, complexity analysis |
| Widget | ExponentialCalculator: function plotting, complexity comparison |
| Polish | Mobile layout optimization, touch interactions |

**Widget Features**:
- Base selection (e, 2, 10, custom)
- Growth/decay curve visualization
- Doubling time / half-life calculator
- **Algorithm complexity comparison** (O(1) → O(log n) → O(n) → O(n²) → O(2^n))

**Programmer Relevance**:
- Binary logarithms and CS applications
- Why O(log n) is "almost as good as O(1)"
- Exponential blowup in brute-force algorithms

---

### Phase 9: Trigonometry
*The Classic Visualization*

**Goal**: Build the iconic unit circle explorer with synchronized wave displays.

| Track | Deliverables |
|-------|--------------|
| Content | Unit circle, trig functions, identities, applications |
| Widget | UnitCircleExplorer: angle control, sine/cosine waves, special angles |
| Polish | Animation system refinement, synchronized updates |

**Widget Features**:
- Interactive unit circle with draggable angle
- Real-time sin/cos/tan value display
- Parallel wave graphs (sin θ, cos θ)
- Special angle quick-select (0°, 30°, 45°, 60°, 90°)
- Quadrant sign indicators (ASTC mnemonic)
- Radian/degree toggle

**Applications Content**:
- Rotation in graphics
- Signal processing basics
- Oscillation and waves

---

### Phase 10: Statistics Foundation
*Data Science Beginnings*

**Goal**: Introduce descriptive statistics with interactive data exploration.

| Track | Deliverables |
|-------|--------------|
| Content | Mean, median, mode, variance, standard deviation, distributions |
| Widget | StatisticsCalculator: data input, histogram, box plot, statistics display |
| Polish | Performance audit, bundle optimization |

**Widget Features**:
- Data input (manual entry or preset datasets)
- Real-time statistics calculation
- Histogram visualization with adjustable bins
- Box plot with quartiles and outlier detection
- Skewness analysis

**Preset Datasets** (from archive):
- Test scores
- Heights
- Salaries (with outlier)
- Reaction times

---

### Phase 11: Linear Algebra — Vectors
*The Language of ML*

**Goal**: Visualize vector operations in 2D/3D space.

| Track | Deliverables |
|-------|--------------|
| Content | Vector fundamentals, operations, dot/cross product, applications |
| Widget | VectorOperations: coordinate input, arrow visualization, operation calculator |

**Widget Features**:
- Vector input (x, y, z coordinates)
- 2D/3D arrow diagram (SVG)
- Operations: addition, subtraction, scalar multiplication
- Dot product with angle calculation
- Cross product (3D)
- Magnitude and unit vector

**ML Bridge Content**:
- Word embeddings as vectors
- Cosine similarity
- Feature vectors in ML

---

### Phase 12: Linear Algebra — Matrices
*Transformations and Systems*

**Goal**: Visualize linear transformations and matrix operations.

| Track | Deliverables |
|-------|--------------|
| Content | Matrix fundamentals, operations, transformations, systems |
| Widget | MatrixTransformations: transformation selector, visual effect display |

**Widget Features**:
- Transformation type selector (rotate, scale, shear, reflect)
- Unit square visualization showing transformation effect
- Matrix display with determinant
- Composition of transformations
- Connection to graphics programming

---

### Phase 13: Calculus — Limits
*Approaching the Edge*

**Goal**: Visualize limits and continuity with ε-δ exploration.

| Track | Deliverables |
|-------|--------------|
| Content | Limit definition, one-sided limits, continuity, discontinuity types |
| Widget | LimitsExplorer: function selection, approach point, ε-δ visualization |

**Widget Features**:
- Function curve display
- Approach point selector
- Epsilon band visualization
- Delta interval display
- Left/right limit values
- Continuity classification

---

### Phase 14: Calculus — Derivatives
*Rate of Change*

**Goal**: Visualize derivatives as slopes and rates of change.

| Track | Deliverables |
|-------|--------------|
| Content | Derivative definition, rules, applications |
| Widget | DerivativeVisualizer: function plot, tangent line, derivative graph |

**Widget Features**:
- Function curve with movable point
- Tangent line at selected point
- Slope display (derivative value)
- Derivative function graph overlay
- Connection to optimization

**ML Bridge**: "Gradient descent is just following the derivative downhill"

---

## Future Horizons (Phase 15+)

Lower detail, higher flexibility. Evaluated after Phase 14.

| Phase | Possible Focus |
|-------|----------------|
| 15 | AI/ML Foundations: Neural network intuition |
| 16 | Probability distributions and sampling |
| 17 | Gradient descent visualization |
| 18 | PWA features: offline support, installability |
| 19 | Search functionality, content discovery |
| 20 | User progress tracking (local storage) |
| 21 | Practice problems / quiz system |
| 22 | Community contributions framework |

---

## Testing Strategy

### Testing Layers

| Layer | Tool | Purpose | Phase Added |
|-------|------|---------|-------------|
| Unit | Vitest | Math utilities, pure functions | Phase 1 ✅ |
| Component | Vitest + Vue Test Utils | Component logic, props, emits | Phase 4 ✅ |
| E2E | Playwright | User flows, integration | Phase 6 |
| Visual Regression | Playwright screenshots | UI consistency | Phase 7 |
| Accessibility | axe-core + Playwright | WCAG compliance | Phase 6 |

### Test File Structure

```
tests/
├── unit/                    # Vitest unit tests (co-located with source)
e2e/
├── navigation.spec.ts       # Site-wide navigation
├── basics/
│   ├── number-types.spec.ts
│   └── symbols.spec.ts
├── algebra/
│   ├── summation.spec.ts
│   └── quadratics.spec.ts
└── visual/
    ├── widgets.spec.ts      # Widget screenshots
    └── pages.spec.ts        # Full page screenshots
```

### CI Workflow

```yaml
jobs:
  unit:        # TypeScript, lint, unit tests
  e2e:         # Playwright functional tests
  visual:      # Playwright screenshot comparison
```

### Testing Conventions

**Data Test IDs**: All interactive elements get `data-testid` attributes:
```vue
<input data-testid="number-input" />
<div data-testid="set-natural" :data-member="isNatural" />
```

**Per-Widget Testing**: Each new widget includes:
1. Unit tests for utility functions
2. Component tests for props/emits/logic
3. E2E tests for user interactions
4. Visual regression baselines

---

## Decision Log

Decisions made during roadmap planning:

| ID | Decision | Rationale |
|----|----------|-----------|
| R-001 | Summation before Quadratics (Phase 5) | Core philosophy demonstration; unique value proposition |
| R-002 | Exponentials before Statistics (Phase 8) | Better algebra flow; complexity analysis is programmer-relevant |
| R-003 | Calculus in scope | Required for AI/ML trajectory (backpropagation, optimization) |
| R-004 | Playwright over Cypress | Better browser support, built-in visual testing, faster |
| R-005 | E2E testing in Phase 6 | Early investment before widget count grows |
| R-006 | Visual regression in Phase 7 | After coordinate system established; more visual complexity |

---

## Parallel Tracks

### Content Progression
```
Phase:  4    5    6    7    8    9    10   11   12   13   14
        │    │    │    │    │    │    │    │    │    │    │
Basics: ████ ─────████                                      
Algebra:     ████      ████ ████                            
Trig:                            ████                       
Stats:                                ████                  
LinAlg:                                    ████ ████        
Calc:                                                ████ ████
```

### Widget Progression
```
Phase 4:  NumberTypeExplorer      (Venn diagram, number line)
Phase 5:  SummationExplorer       (bar chart, code parallel)
Phase 7:  QuadraticExplorer       (parabola, coordinate system)
Phase 8:  ExponentialCalculator   (function curves, complexity)
Phase 9:  UnitCircleExplorer      (circle, synchronized waves)
Phase 10: StatisticsCalculator    (histogram, box plot)
Phase 11: VectorOperations        (arrow diagrams)
Phase 12: MatrixTransformations   (transformation visualization)
Phase 13: LimitsExplorer          (ε-δ visualization)
Phase 14: DerivativeVisualizer    (tangent lines, slopes)
```

### Technical Capability Building
```
Phase 5:  Animation system (play/pause), code generation
Phase 6:  E2E testing, accessibility audits
Phase 7:  Coordinate system, function plotting, visual regression
Phase 8:  Multiple function curves, comparison views
Phase 9:  Circular geometry, synchronized animations
Phase 10: Data visualization (histogram, box plot)
Phase 11: Vector arrows, 2D/3D representation
Phase 12: Transformation matrices, composition
Phase 13: Epsilon-delta bands, limit visualization  
Phase 14: Tangent lines, derivative graphs
```

---

## Success Metrics

| Metric | Target | Measured By |
|--------|--------|-------------|
| Content Coverage | All archive content migrated | Phase 14 |
| Widget Count | 10+ major interactive widgets | Phase 14 |
| Test Coverage | All utilities tested, E2E for all widgets | Ongoing |
| Accessibility | WCAG 2.1 AA compliance | axe-core audits |
| Performance | Lighthouse >90 | Phase 10 audit |
| Mobile Usability | All widgets functional on mobile | Phase 8 |

---

## Review Points

| After Phase | Evaluate |
|-------------|----------|
| 5 | Widget architecture solid? Animation approach correct? |
| 6 | Testing infrastructure working? Content density appropriate? |
| 7 | Coordinate system reusable? Visual regression catching issues? |
| 8 | Mobile experience acceptable? |
| 10 | Performance acceptable? Ready for more complex visualizations? |
| 12 | Linear algebra approach working? Ready for calculus? |
| 14 | Calculus complete. Evaluate AI/ML phase scope. |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Scope creep | Each phase has ONE primary widget maximum |
| Content without interactivity | Every content section references widgets |
| Technical debt | Phase 6 includes explicit polish time |
| Mobile neglected | Phase 8 includes mobile optimization focus |
| Performance degradation | Phase 10 includes performance audit |
| Testing gaps | E2E added in Phase 6, before widget proliferation |
| Visual regressions | Screenshot testing added in Phase 7 |

---

## Document History

| Date | Change |
|------|--------|
| 2025-01-15 | Initial roadmap created after Phase 4 completion |

---

*This is a living document. Update after each phase completion.*
