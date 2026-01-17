# SnakeMath Roadmap

## Vision

**SnakeMath** teaches mathematics to programmers by revealing that mathematical notation is just code they already know. The long-term trajectory leads from foundational concepts through calculus to AI/ML fundamentals.

**Core Philosophy**: "Sigma is just a for loop" â€” and every mathematical concept has a programming equivalent.

---

## Strategic Trajectory

```
Basics â†’ Algebra â†’ Trigonometry â†’ Statistics â†’ Linear Algebra â†’ Calculus â†’ AI/ML
```

Each topic builds toward machine learning foundations:

| Topic | ML Connection |
|-------|---------------|
| Summation (Î£) | Loss functions, gradient descent sums |
| Exponentials/Logarithms | Activation functions, cross-entropy loss |
| Statistics | Distributions, probability, Bayesian inference |
| Linear Algebra | Neural network operations, embeddings, transformations |
| Calculus | Backpropagation, optimization, gradients |

---

## Phase Overview

| Phase | Focus | Widget | Content | Status |
|-------|-------|--------|---------|--------|
| 1 | Project Foundation | â€” | â€” | âœ… Complete |
| 2 | Layout & Navigation | â€” | â€” | âœ… Complete |
| 3 | Content Components | â€” | â€” | âœ… Complete |
| 4 | Number Types | NumberTypeExplorer | Basics: Number Types | âœ… Complete |
| 5 | Summation Notation | SummationExplorer | Algebra: Summation | âœ… Complete |
| 6 | Basics Completion + Testing | SimpleFunctionDemo | Basics: Functions, Variables, Order of Ops | âœ… Complete |
| 7 | Quadratic Functions | QuadraticExplorer | Algebra: Quadratics | âœ… Complete |
| 8 | Exponentials & Logarithms | ExponentialExplorer | Algebra: Exp/Log | ✅ Complete |
| 9 | Trigonometry + Testing Refinement | UnitCircleExplorer | Trig: Unit Circle | ✅ Complete |
| 10 | Statistics Foundation + Algebra Expansion | StatisticsCalculator | Statistics: Descriptive + Product/Linear | ✅ Complete |
| **11** | **Linear Algebra: Vectors** | **VectorOperations** | **Linear Algebra: Vectors** | 🎯 Next |
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
| Content | Algebra section, Summation topic (intro â†’ formulas â†’ applications) |
| Widget | SummationExplorer: presets, bounds input, code parallel, bar chart, formula comparison |
| Polish | Widget component architecture, animation patterns |

**Key Features**:
- Side-by-side math notation â†” Python/JavaScript code
- Animated bar chart showing term accumulation
- Closed-form formula comparison (O(n) vs O(1))
- URL state sync for shareable configurations

**Success Metric**: User sees Î£ notation and immediately thinks "that's just a for loop!"

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
- `basics/functions.md` â€” Vending machine analogy, composition, inverse
- `basics/variables-expressions.md` â€” Expression building, implementation methods
- `basics/order-of-operations.md` â€” PEMDAS, precedence tables, AST concepts

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
- Form conversion display (standard â†” vertex â†” factored)
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
- **Algorithm complexity comparison** (O(1) â†’ O(log n) â†’ O(n) â†’ O(nÂ²) â†’ O(2^n))

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
- Parallel wave graphs (sin Î¸, cos Î¸)
- Special angle quick-select (0Â°, 30Â°, 45Â°, 60Â°, 90Â°)
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

### Phase 11: Linear Algebra â€” Vectors
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

### Phase 12: Linear Algebra â€” Matrices
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

### Phase 13: Calculus â€” Limits
*Approaching the Edge*

**Goal**: Visualize limits and continuity with Îµ-Î´ exploration.

| Track | Deliverables |
|-------|--------------|
| Content | Limit definition, one-sided limits, continuity, discontinuity types |
| Widget | LimitsExplorer: function selection, approach point, Îµ-Î´ visualization |

**Widget Features**:
- Function curve display
- Approach point selector
- Epsilon band visualization
- Delta interval display
- Left/right limit values
- Continuity classification

---

### Phase 14: Calculus â€” Derivatives
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
| Unit | Vitest | Math utilities, pure functions | Phase 1 âœ… |
| Component | Vitest + Vue Test Utils | Component logic, props, emits | Phase 4 âœ… |
| E2E | Playwright | User flows, integration | Phase 6 âœ… |
| Visual Regression | Playwright screenshots | UI consistency | Phase 7 âœ… |
| Accessibility | axe-core + Playwright | WCAG compliance | Phase 6 âœ… |

### Test File Structure

```
tests/
â”œâ”€â”€ unit/                    # Vitest unit tests (co-located with source)
e2e/
â”œâ”€â”€ navigation.spec.ts       # Site-wide navigation
â”œâ”€â”€ basics/
â”‚   â”œâ”€â”€ number-types.spec.ts
â”‚   â””â”€â”€ symbols.spec.ts
â”œâ”€â”€ algebra/
â”‚   â”œâ”€â”€ summation.spec.ts
â”‚   â””â”€â”€ quadratics.spec.ts
â””â”€â”€ visual/
    â”œâ”€â”€ widgets.spec.ts      # Widget screenshots
    â””â”€â”€ pages.spec.ts        # Full page screenshots
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
| R-007 | Coordinate system supports negative ranges | Parabolas extend below x-axis; roots can be negative |
| R-008 | Preset-based widgets (no arbitrary expressions) | Security, predictability, curated educational examples |
| R-009 | Complex roots link to Number Types | Educational progression without complex arithmetic on quadratics page |
| R-010 | Tiered CI workflow (Phase 9) | quick-check on push, full-test on PR only; balances speed and coverage |
| R-011 | Visual regression local-only | Flaky in CI; more reliable as local validation before commits |
| R-012 | Panel-based widget architecture (Phase 10) | Clear organization for complex widgets; single responsibility per panel |
| R-013 | Algebra expansion in Phase 10 | Product Notation + Linear Equations fill content gaps; complete algebra section |

---

## Parallel Tracks

### Content Progression
```
Phase:  4    5    6    7    8    9    10   11   12   13   14
        â”‚    â”‚    â”‚    â”‚    â”‚    â”‚    â”‚    â”‚    â”‚    â”‚    â”‚
Basics: â–ˆâ–ˆâ–ˆâ–ˆ â”€â”€â”€â”€â”€â–ˆâ–ˆâ–ˆâ–ˆ                                      
Algebra:     â–ˆâ–ˆâ–ˆâ–ˆ      â–ˆâ–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆâ–ˆ                            
Trig:                            â–ˆâ–ˆâ–ˆâ–ˆ                       
Stats:                                â–ˆâ–ˆâ–ˆâ–ˆ                  
LinAlg:                                    â–ˆâ–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆâ–ˆ        
Calc:                                                â–ˆâ–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆâ–ˆ
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
Phase 13: LimitsExplorer          (Îµ-Î´ visualization)
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

| After Phase | Evaluate | Outcome |
|-------------|----------|---------|
| 5 | Widget architecture solid? Animation approach correct? | âœ… Yes - preset-based architecture works well |
| 6 | Testing infrastructure working? Content density appropriate? | âœ… Playwright + axe-core working; content pacing good |
| 7 | Coordinate system reusable? Visual regression catching issues? | âœ… CoordinateSystem + PlotCurve/Point/Line reusable for Phase 8+ |
| 8 | Mobile experience acceptable? | ✅ Yes - widgets responsive; touch interactions work |
| 10 | Performance acceptable? Ready for more complex visualizations? | ✅ Yes - panel architecture scales well; histogram/box plot performant |
| 12 | Linear algebra approach working? Ready for calculus? | â€” |
| 14 | Calculus complete. Evaluate AI/ML phase scope. | â€” |

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
| 2026-01-16 | Phase 5 complete, Phase 6 marked as next |
| 2026-01-16 | Phase 6 complete: E2E testing, accessibility, Functions/Variables/OrderOfOps content |
| 2026-01-16 | Phase 7 complete: QuadraticExplorer, CoordinateSystem, visual regression testing |
| 2026-01-17 | Phase 8 complete: ExponentialExplorer, complexity comparison, growth/decay |
| 2026-01-17 | Phase 9 complete: UnitCircleExplorer, WaveGraphs, tiered CI workflow |
| 2026-01-17 | Phase 10 complete: StatisticsCalculator, histogram/box plot, algebra expansion (Product Notation, Linear Equations) |

---

*This is a living document. Update after each phase completion.*
