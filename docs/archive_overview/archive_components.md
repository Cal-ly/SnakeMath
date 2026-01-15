# Archive Components Inventory

This document catalogs all Vue components found in the archive folder.

## Overview

| Implementation | Location | Component Count | Framework |
|----------------|----------|-----------------|-----------|
| snake-math | `archive/snake-math/docs/.vitepress/theme/components/` | 19 | Vue 3 + VitePress |
| snake-math-vue | `archive/snake-math-vue/src/components/` | 14 | Vue 3 + Bootstrap |

---

## snake-math Components (VitePress Theme)

### QuadraticExplorer.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/QuadraticExplorer.vue`
- **Purpose**: Interactive quadratic function visualization with multiple forms and real-world scenarios
- **Inputs**: None (internal state) - coefficients a, b, c controlled via sliders
- **Output**:
  - Canvas parabola with vertex, roots, axis of symmetry marked
  - Equation display in standard, vertex, and factored forms
  - Discriminant analysis with root count
  - Transformation animations between forms
- **Interactive**: Yes - coefficient sliders, form switching, preset scenarios, animation controls
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: High - Core interactive widget, needs Canvas-to-modern visualization migration

### NumberTypeExplorer.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/NumberTypeExplorer.vue`
- **Purpose**: Number classification tool showing set membership (Natural, Integer, Rational, Real, Complex)
- **Inputs**: None (internal state) - number input via text field
- **Output**:
  - Canvas Venn diagram of number sets with highlighted membership
  - Classification table showing type membership
  - Programming equivalents (Python/JavaScript code)
  - Conversion loss detection
  - Memory overflow testing (8/16/32-bit)
- **Interactive**: Yes - number input, analysis checkboxes, overflow test buttons
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: High - Already has equivalent in new system; reference for feature parity

### SummationDemo.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/SummationDemo.vue`
- **Purpose**: Interactive summation notation explorer with presets and challenges
- **Inputs**: None (internal state)
- **Output**:
  - Canvas bar chart of summation terms
  - Running total display
  - Closed-form formula comparison
  - Method comparison (loop vs built-in vs formula)
- **Interactive**: Yes - mode selection (preset/custom/challenge/comparison), parameter sliders
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: High - Core "Sigma is a for loop" demonstration

### ProductNotationVisualizer.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/ProductNotationVisualizer.vue`
- **Purpose**: Interactive product notation (Π) explorer with preset formulas
- **Inputs**: None (internal state)
- **Output**:
  - Canvas plot of partial products
  - Challenge mode with hints
  - Animation of product growth
- **Interactive**: Yes - preset selection, custom expressions, challenge mode, animations
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: Medium - Parallel to SummationDemo; good companion widget

### LinearSystemSolver.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/LinearSystemSolver.vue`
- **Purpose**: Interactive system of equations solver with graphical representation
- **Inputs**: None (internal state) - coefficient inputs for 2x2 or 3x3 systems
- **Output**:
  - Canvas graph showing line intersections (for 2x2)
  - Matrix form display (Ax = b)
  - Solution with verification
  - Solution type classification (unique/no/infinite)
- **Interactive**: Yes - coefficient inputs, system size selection, method choice, preset examples
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: High - Useful educational tool for algebra

### LimitsExplorer.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/LimitsExplorer.vue`
- **Purpose**: Interactive limits and continuity explorer with ε-δ visualization
- **Inputs**: None (internal state) - function type, approach point, zoom level
- **Output**:
  - Canvas plot with function curve
  - Epsilon band and delta interval shading
  - Left/right limit values
  - Continuity status and discontinuity type detection
- **Interactive**: Yes - function type selection, parameter sliders, zoom control
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: Medium - Advanced calculus content; consider scope

### ExponentialCalculator.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/ExponentialCalculator.vue`
- **Purpose**: Exponential and logarithmic function explorer with complexity comparison
- **Inputs**: None (internal state) - function type, base, parameters
- **Output**:
  - Canvas plot (800x400) with grid and axes
  - Doubling time / half-life calculation
  - Algorithm complexity comparison visualization (O(1) to O(2^n))
- **Interactive**: Yes - function type selection, base selection, parameter sliders
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: High - Complexity comparison excellent for programmers

### StatisticsCalculator.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/StatisticsCalculator.vue`
- **Purpose**: Descriptive statistics explorer with data visualization
- **Inputs**: None (internal state) - data input via text field or presets
- **Output**:
  - Canvas box plot and histogram
  - Statistics table (mean, median, mode, std dev, quartiles)
  - Outlier detection
  - Skewness analysis
- **Interactive**: Yes - data input, preset loaders, bin slider for histogram
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: High - Practical statistics tool

### ProbabilitySimulator.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/ProbabilitySimulator.vue`
- **Purpose**: Interactive probability distribution explorer with sampling
- **Inputs**: None (internal state) - distribution type, parameters
- **Output**:
  - Canvas histogram with theoretical curve overlay
  - Theoretical vs empirical statistics comparison
  - Probability calculator
- **Interactive**: Yes - distribution type selection, parameter sliders, sample generation
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: Medium - Good for probability education

### VectorOperations.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/VectorOperations.vue`
- **Purpose**: Interactive vector operations with geometric visualization
- **Inputs**: None (internal state) - vector coordinates (x, y, z)
- **Output**:
  - Canvas vector arrows with parallelogram law visualization
  - Magnitude and unit vector display
  - Operation results (dot product, cross product, angle)
- **Interactive**: Yes - vector coordinate inputs, preset vectors, operation selection
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: High - Visual vector math is compelling

### MatrixTransformations.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/MatrixTransformations.vue`
- **Purpose**: Interactive linear transformation visualizer
- **Inputs**: None (internal state) - transformation type, parameters
- **Output**:
  - Canvas showing original and transformed unit square with vectors
  - Transformation matrix display
  - Determinant calculation
  - Effect description
- **Interactive**: Yes - transformation type selection (identity, scale, rotation, shear, reflection, custom), parameter sliders
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: Medium - Visual but advanced topic

### UnitCircleExplorer.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/UnitCircleExplorer.vue`
- **Purpose**: Interactive trigonometry visualizer with unit circle
- **Inputs**: None (internal state) - angle in degrees or radians
- **Output**:
  - Canvas unit circle with coordinate lines
  - Sine/cosine wave graphs
  - Trig values display (sin, cos, tan)
  - Quadrant analysis
  - Identity verification
- **Interactive**: Yes - angle controls (drag, buttons for special angles), animation with speed control
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: High - Classic educational visualization

### OperatorPrecedenceExplorer.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/OperatorPrecedenceExplorer.vue`
- **Purpose**: Expression evaluation and operator precedence tool with AST visualization
- **Inputs**: None (internal state) - expression string, language selection
- **Output**:
  - Canvas-based syntax tree drawing
  - Step-by-step evaluation display
  - Language-specific precedence rules
- **Interactive**: Yes - expression input/builder, language selection
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: Medium - Interesting for programmers but complex implementation

### FunctionPlotter.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/FunctionPlotter.vue`
- **Purpose**: General function plotting tool
- **Inputs**: None (internal state) - function type, parameters
- **Output**:
  - Canvas plot with grid and axes
  - Current equation display
  - Function properties list (domain, range, intercepts)
- **Interactive**: Yes - function type selection (linear, quadratic, exponential, trigonometric), parameter sliders, point evaluation
- **Dependencies**: Vue 3 Composition API, Canvas API
- **Test Coverage**: No
- **Reuse Potential**: High - General-purpose plotting utility

### FunctionsVisualization.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/FunctionsVisualization.vue`
- **Purpose**: Function limits and continuity visualization with custom functions
- **Inputs**: None (internal state) - function expression string
- **Output**:
  - Canvas plot with function curve
  - Limit calculation table
  - Continuity determination
- **Interactive**: Yes - text input for function, slider controls, preset function buttons
- **Dependencies**: Vue 3 Composition API, Canvas API, optional Pyodide integration
- **Test Coverage**: No
- **Reuse Potential**: Medium - Advanced; overlap with LimitsExplorer

### VariableExpressionExplorer.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/VariableExpressionExplorer.vue`
- **Purpose**: Minimal variable exploration demo
- **Inputs**: None (internal state)
- **Output**: Linear function calculation display (y = 2x + 3)
- **Interactive**: Yes - slider for variable x
- **Dependencies**: Vue 3 Composition API, InteractiveSlider component
- **Test Coverage**: No
- **Reuse Potential**: Low - Very simple; better to create new

### InteractiveSlider.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/InteractiveSlider.vue`
- **Purpose**: Generic slider component for mathematical exploration
- **Inputs**:
  - `label` (String) - Slider label
  - `min` (Number) - Minimum value
  - `max` (Number) - Maximum value
  - `step` (Number) - Step increment
  - `initialValue` (Number) - Starting value
  - `showCalculation` (Boolean) - Whether to show calculation result
  - `calculationFunction` (Function) - Function to apply to value
- **Output**: Range slider with optional calculated result
- **Interactive**: Yes - slider control
- **Dependencies**: Vue 3 Composition API
- **Test Coverage**: No
- **Reuse Potential**: High - Utility component, easy to recreate with Tailwind

### MathDisplay.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/MathDisplay.vue`
- **Purpose**: Mathematical expression and summation rendering
- **Inputs**:
  - `upperLimit`, `lowerLimit`, `expression`, `result` (for summation)
  - `mathExpression` (String) - LaTeX expression
  - `block` (Boolean) - Display vs inline mode
- **Output**: Rendered mathematical notation (summation or expression)
- **Interactive**: No - display only
- **Dependencies**: Vue 3, basic LaTeX processing
- **Test Coverage**: No
- **Reuse Potential**: Low - KaTeX will replace this functionality

### CodeFold.vue
- **Location**: `archive/snake-math/docs/.vitepress/theme/components/CodeFold.vue`
- **Purpose**: Collapsible code block wrapper
- **Inputs**: None (uses slot for content)
- **Output**: Expandable/collapsible code section with toggle button
- **Interactive**: Yes - toggle button
- **Dependencies**: Vue 3
- **Test Coverage**: No
- **Reuse Potential**: Medium - Simple utility; easy to recreate

---

## snake-math-vue Components

### Common Components

#### MathJaxRenderer.vue
- **Location**: `archive/snake-math-vue/src/components/common/MathJaxRenderer.vue`
- **Purpose**: MathJax mathematical expression wrapper
- **Inputs**:
  - `expression` (String) - Math expression to render
  - `displayMode` (Boolean) - Display vs inline rendering
- **Output**: Rendered MathJax expression
- **Interactive**: No - display only
- **Dependencies**: vue-mathjax-next library
- **Test Coverage**: No
- **Reuse Potential**: Low - KaTeX preferred in new system

#### ThemeSwitcher.vue
- **Location**: `archive/snake-math-vue/src/components/common/ThemeSwitcher.vue`
- **Purpose**: Light/dark theme toggle
- **Inputs**: None
- **Output**: Theme toggle button with icon
- **Interactive**: Yes - toggle button with animation
- **Dependencies**: Vue 3, localStorage for persistence
- **Test Coverage**: No
- **Reuse Potential**: Medium - Theme switching already implemented differently; reference for animation

#### TopicNavigation.vue
- **Location**: `archive/snake-math-vue/src/components/common/TopicNavigation.vue`
- **Purpose**: Topic navigation with responsive design
- **Inputs**:
  - `topics` (Array) - List of topic objects
  - `activeTopic` (String) - Currently active topic
- **Output**: Desktop button grid or mobile dropdown navigation
- **Interactive**: Yes - clickable navigation
- **Dependencies**: Vue 3, VueRouter
- **Test Coverage**: No
- **Reuse Potential**: Low - Navigation structure different in new system

### Topic Content Components

These are container/navigation components with minimal actual content:

#### AlgebraContent.vue
- **Location**: `archive/snake-math-vue/src/components/topics/AlgebraContent.vue`
- **Purpose**: Algebra topic navigation with subtopic cards
- **Inputs**: None
- **Output**: Card grid for subtopic selection, dynamic component loading
- **Interactive**: Yes - clickable subtopic cards
- **Dependencies**: Vue 3, Bootstrap, subtopic components
- **Test Coverage**: No
- **Reuse Potential**: Low - Structure pattern; no content to migrate

#### BasicsContent.vue
- **Location**: `archive/snake-math-vue/src/components/topics/BasicsContent.vue`
- **Purpose**: Placeholder for Basics content
- **Inputs**: None
- **Output**: "Coming soon" placeholder card
- **Interactive**: No
- **Dependencies**: Vue 3, Bootstrap
- **Test Coverage**: No
- **Reuse Potential**: None - Placeholder only

#### CalculusContent.vue
- **Location**: `archive/snake-math-vue/src/components/topics/CalculusContent.vue`
- **Purpose**: Placeholder for Calculus content
- **Inputs**: None
- **Output**: Placeholder content
- **Interactive**: No
- **Dependencies**: Vue 3, Bootstrap
- **Test Coverage**: No
- **Reuse Potential**: None - Placeholder only

#### LinearAlgebraContent.vue
- **Location**: `archive/snake-math-vue/src/components/topics/LinearAlgebraContent.vue`
- **Purpose**: Placeholder for Linear Algebra content
- **Inputs**: None
- **Output**: Placeholder content
- **Interactive**: No
- **Dependencies**: Vue 3, Bootstrap
- **Test Coverage**: No
- **Reuse Potential**: None - Placeholder only

#### StatisticsContent.vue
- **Location**: `archive/snake-math-vue/src/components/topics/StatisticsContent.vue`
- **Purpose**: Placeholder for Statistics content
- **Inputs**: None
- **Output**: Placeholder content
- **Interactive**: No
- **Dependencies**: Vue 3, Bootstrap
- **Test Coverage**: No
- **Reuse Potential**: None - Placeholder only

#### TrigonometryContent.vue
- **Location**: `archive/snake-math-vue/src/components/topics/TrigonometryContent.vue`
- **Purpose**: Placeholder for Trigonometry content
- **Inputs**: None
- **Output**: Placeholder content
- **Interactive**: No
- **Dependencies**: Vue 3, Bootstrap
- **Test Coverage**: No
- **Reuse Potential**: None - Placeholder only

### Algebra Subtopic Components

#### QuadraticsContent.vue
- **Location**: `archive/snake-math-vue/src/components/topics/algebra/QuadraticsContent.vue`
- **Purpose**: Quadratics subtopic content container
- **Inputs**: None
- **Output**: Quadratics educational content
- **Interactive**: Unknown - not fully analyzed
- **Dependencies**: Vue 3, Bootstrap
- **Test Coverage**: No
- **Reuse Potential**: Low - Use VitePress content instead

#### LinearContent.vue
- **Location**: `archive/snake-math-vue/src/components/topics/algebra/LinearContent.vue`
- **Purpose**: Linear equations subtopic content
- **Inputs**: None
- **Output**: Linear equations educational content
- **Interactive**: Unknown
- **Dependencies**: Vue 3, Bootstrap
- **Test Coverage**: No
- **Reuse Potential**: Low - Use VitePress content instead

#### ExponentialsContent.vue
- **Location**: `archive/snake-math-vue/src/components/topics/algebra/ExponentialsContent.vue`
- **Purpose**: Exponentials subtopic content
- **Inputs**: None
- **Output**: Exponentials educational content
- **Interactive**: Unknown
- **Dependencies**: Vue 3, Bootstrap
- **Test Coverage**: No
- **Reuse Potential**: Low - Use VitePress content instead

#### SummationContent.vue
- **Location**: `archive/snake-math-vue/src/components/topics/algebra/SummationContent.vue`
- **Purpose**: Summation notation subtopic content
- **Inputs**: None
- **Output**: Summation educational content
- **Interactive**: Unknown
- **Dependencies**: Vue 3, Bootstrap
- **Test Coverage**: No
- **Reuse Potential**: Low - Use VitePress content instead

---

## Component Summary by Category

### Interactive Widgets (High Value)

| Component | Topic | Visualization | Complexity |
|-----------|-------|---------------|------------|
| QuadraticExplorer | Algebra | Canvas parabola | High |
| NumberTypeExplorer | Basics | Canvas Venn diagram | High |
| SummationDemo | Algebra | Canvas bar chart | High |
| LinearSystemSolver | Algebra | Canvas line graph | Medium |
| UnitCircleExplorer | Trigonometry | Canvas unit circle + waves | High |
| StatisticsCalculator | Statistics | Canvas histogram + box plot | Medium |
| VectorOperations | Linear Algebra | Canvas vector arrows | Medium |
| ExponentialCalculator | Algebra | Canvas function plot | Medium |
| FunctionPlotter | General | Canvas function plot | Medium |

### Display Components (Low Complexity)

| Component | Purpose | Reuse Potential |
|-----------|---------|-----------------|
| MathDisplay | Summation/expression rendering | Low (use KaTeX) |
| CodeFold | Collapsible code blocks | Medium |
| InteractiveSlider | Reusable slider control | High |
| MathJaxRenderer | Math rendering | Low (use KaTeX) |

### Navigation/Layout (Reference Only)

| Component | Purpose | Reuse Potential |
|-----------|---------|-----------------|
| TopicNavigation | Topic menu | Low |
| ThemeSwitcher | Dark mode toggle | Medium |
| AlgebraContent | Subtopic navigation | Low |

---

## Technical Patterns Observed

### Canvas Rendering
All visualizations use HTML5 Canvas API directly. Components include:
- Grid drawing functions
- Axis rendering
- Function plotting algorithms
- Animation loops with requestAnimationFrame
- Color scheme: Material Design colors (#2196F3, #F44336, #4CAF50, #FF9800)

### State Management
- All state is local via `ref()` and `reactive()`
- Computed properties for derived values
- Watchers for reactive canvas updates
- No external state management

### Accessibility
Newer components (TopicNavigation, ThemeSwitcher) include:
- ARIA labels
- Keyboard navigation
- High contrast mode support
- Reduced motion support

Older components lack accessibility features.

---

## Migration Recommendations

### Priority 1: Core Educational Widgets
Extract and reimplement with modern tooling:
1. **NumberTypeExplorer** - Already has equivalent; verify feature parity
2. **SummationDemo** - Core philosophy demonstration
3. **QuadraticExplorer** - Rich interactive features
4. **UnitCircleExplorer** - Classic visualization

### Priority 2: Useful Tools
Consider for Phase 5+:
1. **StatisticsCalculator** - Practical utility
2. **LinearSystemSolver** - Good algebra tool
3. **VectorOperations** - Visual linear algebra
4. **ExponentialCalculator** - Complexity comparison valuable

### Priority 3: Consider Scope
Evaluate whether needed:
1. **LimitsExplorer** - Calculus may be out of initial scope
2. **MatrixTransformations** - Advanced topic
3. **ProbabilitySimulator** - Statistics depth
4. **OperatorPrecedenceExplorer** - Interesting but complex

### Not Recommended for Migration
- MathDisplay (KaTeX replaces)
- MathJaxRenderer (KaTeX replaces)
- All placeholder content components
- TopicNavigation (new nav system exists)

### Technical Migration Notes
- **Canvas → Consider alternatives**: Chart.js, D3.js, or CSS-based where possible
- **Material colors → Tailwind colors**: Map to design system
- **No tests → Add tests**: All new implementations should have tests
- **Accessibility → Required**: All new components must be accessible
