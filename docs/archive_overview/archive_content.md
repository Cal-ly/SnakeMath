# Archive Content Inventory

This document catalogs all educational content found in the archive folder, organized by math topic.

## Overview

| Implementation | Location | Content Format | Total Files |
|----------------|----------|----------------|-------------|
| snake-math | `archive/snake-math/docs/` | Markdown (VitePress) | 62 files |
| snake-math-vue | `archive/snake-math-vue/src/components/topics/` | Vue components | 10 files |

The **snake-math** implementation contains the comprehensive content library. The **snake-math-vue** implementation has minimal content (mostly placeholders).

---

## Content Structure

All markdown files in `archive/snake-math/docs/` follow a consistent frontmatter pattern:

```yaml
title: string
description: string
tags: array
difficulty: beginner|intermediate|advanced
prerequisites: array
related_concepts: array
applications: array
interactive: boolean
code_examples: boolean
layout: concept-page|index-page
```

---

## 1. Basics

### Foundations
- **Location**: `archive/snake-math/docs/basics/foundations.md`
- **Completeness**: Complete
- **Content**: Core mathematical concepts, differential equations overview, symbol tables for mathematical notation
- **Code Examples**: Yes (Python) - Extensive examples covering differential equations, core concepts
- **Visualizations**: No dedicated visualizations
- **Migration Notes**: Good foundational content; notation tables valuable for symbol reference

### Functions
- **Location**: `archive/snake-math/docs/basics/functions.md`
- **Completeness**: Complete
- **Content**: Function concepts, linear functions, function composition, inverse functions. Uses vending machine analogy for intuition.
- **Code Examples**: Yes (Python) - Linear function examples, composition, inverse calculation
- **Visualizations**: References `<FunctionPlotter />` component
- **Migration Notes**: Strong pedagogical approach with real-world analogies (physics, economics)

### Variables and Expressions
- **Location**: `archive/snake-math/docs/basics/variables-expressions.md`
- **Completeness**: Complete
- **Content**: Variable concepts, expression building, 6+ implementation methods with complexity analysis
- **Code Examples**: Yes (Python) - Financial calculations, physics formulas, regression examples
- **Visualizations**: References `<VariableExpressionExplorer />` component
- **Migration Notes**: Excellent progression from simple to complex; good for migration

### Order of Operations
- **Location**: `archive/snake-math/docs/basics/order-of-operations.md`
- **Completeness**: Complete
- **Content**: PEMDAS/BODMAS rules, precedence tables, parsing algorithms, operator associativity
- **Code Examples**: Yes (Python) - Financial calculations, sensor data processing, binary search
- **Visualizations**: References `<OperatorPrecedenceExplorer />` component with AST visualization
- **Migration Notes**: Includes tokenizer and shunting yard algorithm implementations

### Number Types
- **Location**: `archive/snake-math/docs/basics/number-theory.md`
- **Completeness**: Complete
- **Content**: Number classification (Natural, Integer, Rational, Real, Complex), validation, conversion, arbitrary precision
- **Code Examples**: Yes (Python) - Type validation, financial precision, user input handling
- **Visualizations**: References `<NumberTypeExplorer />` component with Venn diagram
- **Migration Notes**: Comprehensive coverage; existing widget already ported to new system

### Index Page
- **Location**: `archive/snake-math/docs/basics/index.md`
- **Completeness**: Complete
- **Content**: Topic hub with learning path recommendations
- **Code Examples**: No
- **Visualizations**: No
- **Migration Notes**: Use structure for navigation design

---

## 2. Algebra

### Summation Notation

#### Summation Basics
- **Location**: `archive/snake-math/docs/algebra/summation-notation/basics.md`
- **Completeness**: Complete
- **Content**: Sigma notation fundamentals, connection to for-loops, index variables, bounds
- **Code Examples**: Yes (Python) - Loop implementations, list comprehensions
- **Visualizations**: References `<SummationDemo />` component
- **Migration Notes**: Core content for "Sigma is just a for loop" philosophy

#### Summation Properties
- **Location**: `archive/snake-math/docs/algebra/summation-notation/properties.md`
- **Completeness**: Complete
- **Content**: Linearity, splitting ranges, index shifting, constant extraction
- **Code Examples**: Yes (Python) - Property demonstrations
- **Visualizations**: No dedicated visualizations
- **Migration Notes**: Mathematical rigor with programming applications

#### Advanced Summation
- **Location**: `archive/snake-math/docs/algebra/summation-notation/advanced.md`
- **Completeness**: Complete
- **Content**: Nested sums, double summation, changing order, closed-form formulas
- **Code Examples**: Yes (Python) - Nested loop equivalents, optimization techniques
- **Visualizations**: No
- **Migration Notes**: Good progression from basic to advanced

#### Summation Applications
- **Location**: `archive/snake-math/docs/algebra/summation-notation/applications.md`
- **Completeness**: Complete
- **Content**: Real-world applications in statistics, finance, algorithms
- **Code Examples**: Yes (Python) - Mean calculation, compound interest, algorithm analysis
- **Visualizations**: No
- **Migration Notes**: Strong practical examples

### Product Notation

#### Product Basics
- **Location**: `archive/snake-math/docs/algebra/product-notation/basics.md`
- **Completeness**: Complete
- **Content**: Pi notation fundamentals, factorial as product, empty products
- **Code Examples**: Yes (Python) - Product implementations
- **Visualizations**: References `<ProductNotationVisualizer />` component
- **Migration Notes**: Parallel structure to summation content

#### Product Properties
- **Location**: `archive/snake-math/docs/algebra/product-notation/properties.md`
- **Completeness**: Complete
- **Content**: Product rules, exponent manipulation, splitting products
- **Code Examples**: Yes (Python)
- **Visualizations**: No
- **Migration Notes**: Mathematical properties with code equivalents

#### Advanced Products
- **Location**: `archive/snake-math/docs/algebra/product-notation/advanced.md`
- **Completeness**: Complete
- **Content**: Nested products, telescoping products, infinite products
- **Code Examples**: Yes (Python)
- **Visualizations**: No
- **Migration Notes**: Advanced mathematical content

#### Product Applications
- **Location**: `archive/snake-math/docs/algebra/product-notation/applications.md`
- **Completeness**: Complete
- **Content**: Combinatorics, probability, cryptography applications
- **Code Examples**: Yes (Python) - Factorial, permutations, combinations
- **Visualizations**: No
- **Migration Notes**: Good practical examples

### Linear Equations

#### Linear Basics
- **Location**: `archive/snake-math/docs/algebra/linear-equations/basics.md`
- **Completeness**: Complete
- **Content**: Single equation solving, case analysis (unique/infinite/no solutions), graphical interpretation
- **Code Examples**: Yes (Python) - Extensive NumPy implementations
- **Visualizations**: No direct visualizations in markdown
- **Migration Notes**: Very comprehensive; 500+ lines of examples

#### Systems of Equations
- **Location**: `archive/snake-math/docs/algebra/linear-equations/systems.md`
- **Completeness**: Complete
- **Content**: 2x2 and 3x3 systems, elimination method, substitution, matrix form
- **Code Examples**: Yes (Python) - NumPy linear algebra
- **Visualizations**: References `<LinearSystemSolver />` component
- **Migration Notes**: Multiple solution methods with complexity analysis

#### Linear Applications
- **Location**: `archive/snake-math/docs/algebra/linear-equations/applications.md`
- **Completeness**: Complete
- **Content**: Break-even analysis, mixture problems, age problems
- **Code Examples**: Yes (Python)
- **Visualizations**: No
- **Migration Notes**: Real-world word problem examples

### Quadratic Functions

#### Quadratic Basics
- **Location**: `archive/snake-math/docs/algebra/quadratics/basics.md`
- **Completeness**: Complete
- **Content**: Standard form, parabola shape, vertex, axis of symmetry
- **Code Examples**: Yes (Python)
- **Visualizations**: References `<QuadraticExplorer />` component
- **Migration Notes**: Interactive exploration emphasized

#### Solving Quadratics
- **Location**: `archive/snake-math/docs/algebra/quadratics/solving.md`
- **Completeness**: Complete
- **Content**: Quadratic formula, factoring, completing the square, discriminant
- **Code Examples**: Yes (Python) - Solver implementations
- **Visualizations**: No
- **Migration Notes**: Multiple solution methods

#### Quadratic Theory
- **Location**: `archive/snake-math/docs/algebra/quadratics/theory.md`
- **Completeness**: Complete
- **Content**: Vertex form, factored form, form conversions, discriminant analysis
- **Code Examples**: Yes (Python)
- **Visualizations**: No
- **Migration Notes**: Mathematical depth

#### Quadratic Applications
- **Location**: `archive/snake-math/docs/algebra/quadratics/applications.md`
- **Completeness**: Complete
- **Content**: Projectile motion, optimization, profit maximization
- **Code Examples**: Yes (Python) - Physics simulations
- **Visualizations**: No
- **Migration Notes**: Strong real-world connections

### Exponentials and Logarithms

#### Exponentials
- **Location**: `archive/snake-math/docs/algebra/exponentials-logarithms/exponentials.md`
- **Completeness**: Complete
- **Content**: Exponential functions, growth/decay, compound interest, e
- **Code Examples**: Yes (Python)
- **Visualizations**: References `<ExponentialCalculator />` component
- **Migration Notes**: Good progression from basics to applications

#### Logarithms
- **Location**: `archive/snake-math/docs/algebra/exponentials-logarithms/logarithms.md`
- **Completeness**: Complete
- **Content**: Logarithm definition, properties, change of base, natural log
- **Code Examples**: Yes (Python) - Log calculations, algorithm complexity
- **Visualizations**: No
- **Migration Notes**: Strong connection to algorithm analysis

#### Exponential/Log Applications
- **Location**: `archive/snake-math/docs/algebra/exponentials-logarithms/applications.md`
- **Completeness**: Complete
- **Content**: Compound interest, population growth, radioactive decay, algorithm complexity
- **Code Examples**: Yes (Python)
- **Visualizations**: No
- **Migration Notes**: Excellent O(log n) explanations for programmers

---

## 3. Calculus

### Limits

#### Limits Basics
- **Location**: `archive/snake-math/docs/calculus/limits/basics.md`
- **Completeness**: Complete
- **Content**: Limit definition, intuitive explanation, one-sided limits, limit notation
- **Code Examples**: Yes (Python) - Numerical limit approximation
- **Visualizations**: References `<LimitsExplorer />` component
- **Migration Notes**: Good foundation for calculus introduction

#### Continuity
- **Location**: `archive/snake-math/docs/calculus/limits/continuity.md`
- **Completeness**: Complete
- **Content**: Continuity definition, types of discontinuities, removable vs jump
- **Code Examples**: Yes (Python)
- **Visualizations**: References limits explorer with continuity mode
- **Migration Notes**: Builds on limits content

#### Limit Methods
- **Location**: `archive/snake-math/docs/calculus/limits/methods.md`
- **Completeness**: Complete
- **Content**: Direct substitution, factoring, L'Hôpital's rule, rationalization
- **Code Examples**: Yes (Python) - SymPy for symbolic limits
- **Visualizations**: No
- **Migration Notes**: Multiple evaluation techniques

#### Limit Applications
- **Location**: `archive/snake-math/docs/calculus/limits/applications.md`
- **Completeness**: Complete
- **Content**: Instantaneous rate of change, derivative preview, numerical methods
- **Code Examples**: Yes (Python)
- **Visualizations**: No
- **Migration Notes**: Bridge to derivatives

---

## 4. Linear Algebra

### Vectors

#### Vector Basics
- **Location**: `archive/snake-math/docs/linear-algebra/vectors/basics.md`
- **Completeness**: Complete
- **Content**: Vector definition, notation, geometric vs algebraic interpretation
- **Code Examples**: Yes (Python) - NumPy arrays
- **Visualizations**: References `<VectorOperations />` component
- **Migration Notes**: Clear distinction between math and CS vectors

#### Vector Operations
- **Location**: `archive/snake-math/docs/linear-algebra/vectors/operations.md`
- **Completeness**: Complete
- **Content**: Addition, subtraction, scalar multiplication, dot product, cross product
- **Code Examples**: Yes (Python) - NumPy operations
- **Visualizations**: Canvas-based arrow diagrams
- **Migration Notes**: Comprehensive operation coverage

#### Advanced Vectors
- **Location**: `archive/snake-math/docs/linear-algebra/vectors/advanced.md`
- **Completeness**: Complete
- **Content**: Projections, orthogonality, basis vectors, span
- **Code Examples**: Yes (Python)
- **Visualizations**: No
- **Migration Notes**: Good preparation for matrix content

#### Vector Applications
- **Location**: `archive/snake-math/docs/linear-algebra/vectors/applications.md`
- **Completeness**: Complete
- **Content**: Physics (forces, velocity), graphics (normals, lighting), machine learning (embeddings)
- **Code Examples**: Yes (Python)
- **Visualizations**: No
- **Migration Notes**: Strong practical applications

### Matrices

#### Matrix Basics
- **Location**: `archive/snake-math/docs/linear-algebra/matrices/basics.md`
- **Completeness**: Complete
- **Content**: Matrix definition, notation, special matrices (identity, zero, diagonal)
- **Code Examples**: Yes (Python) - NumPy arrays
- **Visualizations**: References `<MatrixTransformations />` component
- **Migration Notes**: Foundation for transformations

#### Matrix Operations
- **Location**: `archive/snake-math/docs/linear-algebra/matrices/operations.md`
- **Completeness**: Complete
- **Content**: Addition, multiplication, transpose, determinant, inverse
- **Code Examples**: Yes (Python) - NumPy linear algebra
- **Visualizations**: No
- **Migration Notes**: Essential matrix algebra

#### Matrix Applications
- **Location**: `archive/snake-math/docs/linear-algebra/matrices/applications.md`
- **Completeness**: Complete
- **Content**: Linear transformations, graphics, solving systems, eigenvalues preview
- **Code Examples**: Yes (Python)
- **Visualizations**: No
- **Migration Notes**: Good practical connections

---

## 5. Statistics

### Descriptive Statistics

#### Descriptive Basics
- **Location**: `archive/snake-math/docs/statistics/descriptive-stats/basics.md`
- **Completeness**: Complete
- **Content**: Mean, median, mode, range definitions
- **Code Examples**: Yes (Python) - Standard library and NumPy
- **Visualizations**: References `<StatisticsCalculator />` component
- **Migration Notes**: Foundational statistics

#### Statistical Methods
- **Location**: `archive/snake-math/docs/statistics/descriptive-stats/methods.md`
- **Completeness**: Complete
- **Content**: Variance, standard deviation, z-scores, quartiles, IQR
- **Code Examples**: Yes (Python) - NumPy/SciPy
- **Visualizations**: No
- **Migration Notes**: Comprehensive spread measures

#### Data Visualization
- **Location**: `archive/snake-math/docs/statistics/descriptive-stats/visualization.md`
- **Completeness**: Complete
- **Content**: Histograms, box plots, scatter plots, best practices
- **Code Examples**: Yes (Python) - Matplotlib references
- **Visualizations**: Canvas histograms and box plots
- **Migration Notes**: Good visualization guidance

#### Statistics Applications
- **Location**: `archive/snake-math/docs/statistics/descriptive-stats/applications.md`
- **Completeness**: Complete
- **Content**: Data analysis workflows, outlier detection, normalization
- **Code Examples**: Yes (Python) - pandas operations
- **Visualizations**: No
- **Migration Notes**: Practical data science applications

### Probability

#### Probability Basics
- **Location**: `archive/snake-math/docs/statistics/probability/basics.md`
- **Completeness**: Complete
- **Content**: Probability fundamentals, sample spaces, events, axioms
- **Code Examples**: Yes (Python)
- **Visualizations**: References `<ProbabilitySimulator />` component
- **Migration Notes**: Solid probability foundation

#### Distributions
- **Location**: `archive/snake-math/docs/statistics/probability/distributions.md`
- **Completeness**: Complete
- **Content**: Normal, binomial, uniform, exponential distributions
- **Code Examples**: Yes (Python) - SciPy stats
- **Visualizations**: Canvas distribution plots
- **Migration Notes**: Common distributions with parameters

#### Probability Applications
- **Location**: `archive/snake-math/docs/statistics/probability/applications.md`
- **Completeness**: Complete
- **Content**: Bayes theorem, Monte Carlo, expected value, risk analysis
- **Code Examples**: Yes (Python) - Simulation examples
- **Visualizations**: No
- **Migration Notes**: Strong practical applications

---

## 6. Trigonometry

### Unit Circle

#### Unit Circle Basics
- **Location**: `archive/snake-math/docs/trigonometry/unit-circle/basics.md`
- **Completeness**: Complete
- **Content**: Unit circle definition, coordinates, angle measurement
- **Code Examples**: Yes (Python)
- **Visualizations**: References `<UnitCircleExplorer />` component
- **Migration Notes**: Interactive exploration emphasized

#### Trigonometric Identities
- **Location**: `archive/snake-math/docs/trigonometry/unit-circle/identities.md`
- **Completeness**: Complete
- **Content**: Pythagorean identities, angle sum/difference, double angle
- **Code Examples**: Yes (Python) - Identity verification
- **Visualizations**: No
- **Migration Notes**: Comprehensive identity coverage

#### Trigonometry Applications
- **Location**: `archive/snake-math/docs/trigonometry/unit-circle/applications.md`
- **Completeness**: Complete
- **Content**: Graphics (rotation), signal processing, physics (waves), navigation
- **Code Examples**: Yes (Python)
- **Visualizations**: No
- **Migration Notes**: Strong programmer-relevant applications

---

## snake-math-vue Content (Minimal)

The `snake-math-vue` implementation contains placeholder content components:

| Component | Location | Status |
|-----------|----------|--------|
| BasicsContent.vue | `archive/snake-math-vue/src/components/topics/BasicsContent.vue` | Placeholder |
| AlgebraContent.vue | `archive/snake-math-vue/src/components/topics/AlgebraContent.vue` | Navigation only |
| CalculusContent.vue | `archive/snake-math-vue/src/components/topics/CalculusContent.vue` | Placeholder |
| LinearAlgebraContent.vue | `archive/snake-math-vue/src/components/topics/LinearAlgebraContent.vue` | Placeholder |
| StatisticsContent.vue | `archive/snake-math-vue/src/components/topics/StatisticsContent.vue` | Placeholder |
| TrigonometryContent.vue | `archive/snake-math-vue/src/components/topics/TrigonometryContent.vue` | Placeholder |

**Migration Notes**: These components have no content to migrate; use VitePress markdown content instead.

---

## Summary Statistics

| Topic Area | Files | Completeness | Code Examples | Interactive Components |
|------------|-------|--------------|---------------|------------------------|
| Basics | 6 | Complete | Extensive | 4 |
| Algebra | 24 | Complete | Extensive | 5 |
| Calculus | 5 | Complete | Good | 1 |
| Linear Algebra | 9 | Complete | Extensive | 2 |
| Statistics | 9 | Complete | Extensive | 2 |
| Trigonometry | 4 | Complete | Good | 1 |
| **Total** | **57+5 index** | **All Complete** | **1000+ lines** | **15 unique** |

---

## Migration Recommendations

### High Priority (Core Philosophy Content)
1. **Summation Notation** - Directly embodies "Sigma is just a for loop" philosophy
2. **Number Types** - Foundation content, widget already implemented
3. **Functions** - Core programming concept bridge
4. **Order of Operations** - Important for expression evaluation

### Medium Priority (Interactive-Heavy)
1. **Quadratic Functions** - Rich interactive exploration
2. **Linear Systems** - Good solver widget
3. **Trigonometry** - Unit circle explorer is compelling
4. **Statistics** - Useful calculator widget

### Lower Priority (Can Reference)
1. **Advanced topics** (nested sums, telescoping products)
2. **Calculus limits** - May be out of scope for initial phases
3. **Matrix transformations** - Complex visualization needs

### Content That Needs Restructuring
- **VitePress frontmatter** → Vue component props or route meta
- **PyScript code blocks** → Static code display (or consider Pyodide)
- **MathJax references** → KaTeX syntax (mostly compatible)
- **Component references** → New component system
