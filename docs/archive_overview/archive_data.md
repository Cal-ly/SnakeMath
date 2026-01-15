# Archive Data Structures Inventory

This document catalogs all static data files and embedded data structures found in the archive folder.

## Overview

| Data Type | Location | Format |
|-----------|----------|--------|
| Navigation Structure | `config.js` | JavaScript object |
| Component Registry | `theme/index.js` | JavaScript imports |
| Preset Data | Embedded in components | JavaScript constants |
| Markdown Frontmatter | Content files | YAML |

**Note**: The archive does not contain dedicated data files (JSON, YAML, etc.). All data is either in configuration files or embedded within Vue components.

---

## 1. Navigation Structure

### Source
`archive/snake-math/docs/.vitepress/config.js`

### Top Navigation
```javascript
nav: [
  { text: 'Home', link: '/' },
  { text: 'Basics', link: '/basics/' },
  { text: 'Algebra', link: '/algebra/' },
  { text: 'Statistics', link: '/statistics/' },
  { text: 'Trigonometry', link: '/trigonometry/' },
  { text: 'Linear Algebra', link: '/linear-algebra/' },
  { text: 'Calculus', link: '/calculus/' }
]
```

### Sidebar Structure

#### Getting Started Section
```javascript
{
  text: 'Getting Started',
  items: [
    { text: 'Introduction', link: '/' },
    { text: 'Mathematical Foundations', link: '/basics/foundations' }
  ]
}
```

#### Basics Section
```javascript
{
  text: 'Basics',
  items: [
    { text: 'Overview', link: '/basics/' },
    { text: 'Mathematical Foundations', link: '/basics/foundations' },
    { text: 'Variables & Expressions', link: '/basics/variables-expressions' },
    { text: 'Functions & Plotting', link: '/basics/functions' },
    { text: 'Number Theory', link: '/basics/number-theory' },
    { text: 'Order of Operations', link: '/basics/order-of-operations' }
  ]
}
```

#### Algebra Section
```javascript
{
  text: 'Algebra',
  items: [
    { text: 'Overview', link: '/algebra/' },
    { text: 'Summation Notation (Σ)', link: '/algebra/summation-notation/' },
    { text: 'Product Notation (Π)', link: '/algebra/product-notation/' },
    { text: 'Linear Equations', link: '/algebra/linear-equations/' },
    { text: 'Quadratic Functions', link: '/algebra/quadratics/' },
    { text: 'Exponentials & Logarithms', link: '/algebra/exponentials-logarithms/' }
  ]
}
```

#### Statistics Section
```javascript
{
  text: 'Statistics',
  items: [
    { text: 'Overview', link: '/statistics/' },
    { text: 'Descriptive Statistics', link: '/statistics/descriptive-stats/' },
    { text: 'Probability Distributions', link: '/statistics/probability/' }
  ]
}
```

#### Trigonometry Section
```javascript
{
  text: 'Trigonometry',
  items: [
    { text: 'Overview', link: '/trigonometry/' },
    { text: 'Unit Circle & Trig Functions', link: '/trigonometry/unit-circle/' }
  ]
}
```

#### Linear Algebra Section
```javascript
{
  text: 'Linear Algebra',
  items: [
    { text: 'Overview', link: '/linear-algebra/' },
    { text: 'Vectors & Operations', link: '/linear-algebra/vectors/' },
    { text: 'Matrix Operations', link: '/linear-algebra/matrices/' }
  ]
}
```

#### Calculus Section
```javascript
{
  text: 'Calculus',
  items: [
    { text: 'Overview', link: '/calculus/' },
    { text: 'Limits & Continuity', link: '/calculus/limits/' }
  ]
}
```

### Migration Notes
- Structure maps well to Vue Router routes
- Consider flattening nested sections (e.g., `/algebra/summation-notation/` → `/algebra/summation/`)
- Navigation can be extracted to `src/data/navigation.ts`

---

## 2. Component Registry

### Source
`archive/snake-math/docs/.vitepress/theme/index.js`

### Registered Components (20 total)
```javascript
// Utility Components
'InteractiveSlider'          // Generic slider control
'MathDisplay'                // Math expression rendering
'CodeFold'                   // Collapsible code blocks

// Core Widgets
'SummationDemo'              // Summation notation explorer
'ProductNotationVisualizer'  // Product notation explorer
'VariableExpressionExplorer' // Variable demo
'NumberTypeExplorer'         // Number classification

// Function/Graph Widgets
'FunctionPlotter'            // General function plotting
'FunctionsVisualization'     // Function limits visualization
'QuadraticExplorer'          // Quadratic functions
'ExponentialCalculator'      // Exponential/logarithmic

// Linear Algebra Widgets
'LinearSystemSolver'         // System of equations
'VectorOperations'           // Vector arithmetic
'MatrixTransformations'      // 2D transformations

// Statistics Widgets
'StatisticsCalculator'       // Descriptive statistics
'ProbabilitySimulator'       // Distribution sampling

// Trigonometry Widgets
'UnitCircleExplorer'         // Unit circle visualization

// Calculus Widgets
'LimitsExplorer'             // Limits and continuity

// Utility Widgets
'OperatorPrecedenceExplorer' // Expression parsing/AST
```

### Build Chunk Strategy
```javascript
manualChunks: {
  'components': [
    'ExponentialCalculator',
    'LinearSystemSolver',
    'StatisticsCalculator',
    'ProbabilitySimulator'
  ],
  'math-viz': [
    'UnitCircleExplorer',
    'FunctionPlotter',
    'MatrixTransformations'
  ],
  'utils': [
    'InteractiveSlider',
    'MathDisplay'
  ]
}
```

### Migration Notes
- New system uses explicit imports per-page rather than global registration
- Chunk strategy can inform lazy loading decisions
- Consider which components are used frequently vs. rarely

---

## 3. Embedded Preset Data

### Number Set Definitions
**Source**: `NumberTypeExplorer.vue`

```javascript
const numberSets = [
  {
    label: 'ℕ',
    name: 'Natural',
    color: '#FF6B6B',
    description: 'Positive integers (1, 2, 3, ...)'
  },
  {
    label: 'ℕ₀',
    name: 'Whole',
    color: '#4ECDC4',
    description: 'Natural numbers with zero'
  },
  {
    label: 'ℤ',
    name: 'Integer',
    color: '#45B7D1',
    description: 'Whole numbers and negatives'
  },
  {
    label: 'ℚ',
    name: 'Rational',
    color: '#96CEB4',
    description: 'Fractions p/q where q ≠ 0'
  },
  {
    label: 'ℝ',
    name: 'Real',
    color: '#FFEAA7',
    description: 'All numbers on the number line'
  }
]
```

**Migration Notes**: Extract to `src/data/numbers/sets.ts`

---

### Quadratic Presets
**Source**: `QuadraticExplorer.vue`

```javascript
// Standard presets for exploring coefficient effects
const quadraticPresets = [
  { name: 'Standard', a: 1, b: 0, c: 0 },
  { name: 'Wide', a: 0.5, b: 0, c: 0 },
  { name: 'Narrow', a: 2, b: 0, c: 0 },
  { name: 'Shifted', a: 1, b: -4, c: 3 },
  { name: 'Inverted', a: -1, b: 0, c: 4 }
]

// Real-world scenario presets
const realWorldScenarios = [
  {
    name: 'Projectile Motion',
    a: -4.9, b: 20, c: 1.5,
    description: 'Ball thrown upward at 20 m/s from 1.5m height'
  },
  {
    name: 'Profit Optimization',
    a: -0.1, b: 50, c: -200,
    description: 'Revenue minus costs as function of units sold'
  },
  {
    name: 'Parabolic Reflector',
    a: 0.25, b: 0, c: 0,
    description: 'Cross-section of satellite dish'
  }
]
```

**Migration Notes**: Extract to `src/data/quadratic/presets.ts`

---

### Linear System Examples
**Source**: `LinearSystemSolver.vue`

```javascript
const systemExamples = [
  {
    name: 'Basic System',
    coefficients: [[2, 1], [1, 3]],
    constants: [8, 13],
    solution: [1, 4],
    type: 'unique'
  },
  {
    name: 'No Solution (Parallel)',
    coefficients: [[1, 2], [2, 4]],
    constants: [3, 7],
    solution: null,
    type: 'none'
  },
  {
    name: 'Infinite Solutions',
    coefficients: [[1, 2], [2, 4]],
    constants: [3, 6],
    solution: 'dependent',
    type: 'infinite'
  }
]

// Word problem templates
const wordProblems = [
  {
    name: 'Age Problem',
    description: 'John is twice as old as Mary. In 5 years, sum of ages is 40.',
    setup: 'j = 2m, (j+5) + (m+5) = 40'
  },
  {
    name: 'Mixture Problem',
    description: '10L of 20% solution + xL of 50% = 30% solution',
    setup: '0.2(10) + 0.5x = 0.3(10+x)'
  },
  {
    name: 'Break-Even',
    description: 'Fixed cost $1000, variable $5/unit, selling at $15/unit',
    setup: '1000 + 5x = 15x'
  }
]
```

**Migration Notes**: Extract to `src/data/linearSystems/examples.ts`

---

### Summation Formulas
**Source**: `SummationDemo.vue`

```javascript
const summationPresets = [
  {
    name: 'Arithmetic (1+2+3+...+n)',
    expression: (i) => i,
    closedForm: (n) => n * (n + 1) / 2,
    latex: '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}'
  },
  {
    name: 'Squares (1²+2²+3²+...+n²)',
    expression: (i) => i * i,
    closedForm: (n) => n * (n + 1) * (2 * n + 1) / 6,
    latex: '\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}'
  },
  {
    name: 'Cubes (1³+2³+3³+...+n³)',
    expression: (i) => i * i * i,
    closedForm: (n) => Math.pow(n * (n + 1) / 2, 2),
    latex: '\\sum_{i=1}^{n} i^3 = \\left[\\frac{n(n+1)}{2}\\right]^2'
  },
  {
    name: 'Geometric (1+2+4+8+...+2ⁿ)',
    expression: (i) => Math.pow(2, i),
    closedForm: (n) => Math.pow(2, n + 1) - 1,
    latex: '\\sum_{i=0}^{n} 2^i = 2^{n+1} - 1'
  },
  {
    name: 'Harmonic (1+1/2+1/3+...+1/n)',
    expression: (i) => 1 / i,
    closedForm: null, // No simple closed form
    latex: '\\sum_{i=1}^{n} \\frac{1}{i} \\approx \\ln(n) + \\gamma'
  }
]
```

**Migration Notes**:
- Extract to `src/data/summation/formulas.ts`
- Functions need to be serialized or kept as code
- LaTeX strings ready for KaTeX

---

### Product Notation Formulas
**Source**: `ProductNotationVisualizer.vue`

```javascript
const productPresets = [
  {
    name: 'Factorial (n!)',
    expression: (i) => i,
    start: 1,
    latex: '\\prod_{i=1}^{n} i = n!'
  },
  {
    name: 'Double Factorial (n!!)',
    expression: (i, n) => n % 2 === 0 ? 2 * i : 2 * i - 1,
    latex: 'n!! = n(n-2)(n-4)...'
  },
  {
    name: 'Even Numbers',
    expression: (i) => 2 * i,
    latex: '\\prod_{i=1}^{n} 2i = 2^n \\cdot n!'
  },
  {
    name: 'Fibonacci Product',
    expression: 'fibonacci',
    latex: '\\prod_{i=1}^{n} F_i'
  }
]
```

**Migration Notes**: Extract to `src/data/products/formulas.ts`

---

### Special Trigonometric Angles
**Source**: `UnitCircleExplorer.vue`

```javascript
const specialAngles = [
  { degrees: 0,   radians: 0,            sin: '0',      cos: '1',      tan: '0' },
  { degrees: 30,  radians: 'π/6',        sin: '1/2',    cos: '√3/2',   tan: '√3/3' },
  { degrees: 45,  radians: 'π/4',        sin: '√2/2',   cos: '√2/2',   tan: '1' },
  { degrees: 60,  radians: 'π/3',        sin: '√3/2',   cos: '1/2',    tan: '√3' },
  { degrees: 90,  radians: 'π/2',        sin: '1',      cos: '0',      tan: 'undefined' },
  { degrees: 120, radians: '2π/3',       sin: '√3/2',   cos: '-1/2',   tan: '-√3' },
  { degrees: 135, radians: '3π/4',       sin: '√2/2',   cos: '-√2/2',  tan: '-1' },
  { degrees: 150, radians: '5π/6',       sin: '1/2',    cos: '-√3/2',  tan: '-√3/3' },
  { degrees: 180, radians: 'π',          sin: '0',      cos: '-1',     tan: '0' },
  { degrees: 270, radians: '3π/2',       sin: '-1',     cos: '0',      tan: 'undefined' }
]

const quadrantSigns = [
  { quadrant: 1, sin: '+', cos: '+', tan: '+', mnemonic: 'All' },
  { quadrant: 2, sin: '+', cos: '-', tan: '-', mnemonic: 'Students' },
  { quadrant: 3, sin: '-', cos: '-', tan: '+', mnemonic: 'Take' },
  { quadrant: 4, sin: '-', cos: '+', tan: '-', mnemonic: 'Calculus' }
]
```

**Migration Notes**: Extract to `src/data/trigonometry/specialAngles.ts`

---

### Operator Precedence Rules
**Source**: `OperatorPrecedenceExplorer.vue`

```javascript
const precedenceRules = {
  javascript: [
    { operator: '**', precedence: 15, associativity: 'right', name: 'Exponentiation' },
    { operator: '*', precedence: 14, associativity: 'left', name: 'Multiplication' },
    { operator: '/', precedence: 14, associativity: 'left', name: 'Division' },
    { operator: '%', precedence: 14, associativity: 'left', name: 'Modulo' },
    { operator: '+', precedence: 13, associativity: 'left', name: 'Addition' },
    { operator: '-', precedence: 13, associativity: 'left', name: 'Subtraction' }
  ],
  python: [
    { operator: '**', precedence: 12, associativity: 'right', name: 'Exponentiation' },
    { operator: '*', precedence: 11, associativity: 'left', name: 'Multiplication' },
    { operator: '/', precedence: 11, associativity: 'left', name: 'Division' },
    { operator: '//', precedence: 11, associativity: 'left', name: 'Floor Division' },
    { operator: '%', precedence: 11, associativity: 'left', name: 'Modulo' },
    { operator: '+', precedence: 10, associativity: 'left', name: 'Addition' },
    { operator: '-', precedence: 10, associativity: 'left', name: 'Subtraction' }
  ]
}

const commonMistakes = [
  {
    name: 'Missing Parentheses',
    expression: '2 + 3 * 4',
    mistake: 'Thinking this equals (2 + 3) * 4 = 20',
    explanation: 'Actually equals 2 + (3 * 4) = 14 due to precedence'
  },
  {
    name: 'Exponent Associativity',
    expression: '2 ** 3 ** 2',
    mistake: 'Thinking this equals (2 ** 3) ** 2 = 64',
    explanation: 'Actually equals 2 ** (3 ** 2) = 512 (right associative)'
  }
]
```

**Migration Notes**: Extract to `src/data/operators/precedence.ts`

---

### Vector Presets
**Source**: `VectorOperations.vue`

```javascript
const vectorPresets = [
  {
    name: 'Unit Vectors',
    vectorA: { x: 1, y: 0, z: 0 },
    vectorB: { x: 0, y: 1, z: 0 },
    description: 'Standard basis vectors i and j'
  },
  {
    name: 'Orthogonal',
    vectorA: { x: 3, y: 4, z: 0 },
    vectorB: { x: 4, y: -3, z: 0 },
    description: 'Perpendicular vectors (dot product = 0)'
  },
  {
    name: 'Parallel',
    vectorA: { x: 2, y: 3, z: 1 },
    vectorB: { x: 4, y: 6, z: 2 },
    description: 'Parallel vectors (one is scalar multiple)'
  },
  {
    name: '3D Cross Product',
    vectorA: { x: 1, y: 0, z: 0 },
    vectorB: { x: 0, y: 1, z: 0 },
    description: 'Cross product gives k vector'
  }
]
```

**Migration Notes**: Extract to `src/data/vectors/presets.ts`

---

### Statistics Datasets
**Source**: `StatisticsCalculator.vue`

```javascript
const sampleDatasets = [
  {
    name: 'Test Scores',
    data: [85, 92, 78, 96, 88, 73, 91, 84, 79, 95, 87, 82, 90, 76, 94],
    description: 'Student test scores (0-100 scale)'
  },
  {
    name: 'Heights (cm)',
    data: [165, 172, 158, 180, 175, 162, 170, 168, 177, 160, 173, 169],
    description: 'Adult heights in centimeters'
  },
  {
    name: 'Salaries ($K)',
    data: [45, 52, 48, 75, 62, 55, 120, 58, 51, 49, 53, 47],
    description: 'Annual salaries in thousands (includes outlier)'
  },
  {
    name: 'Reaction Times (ms)',
    data: [245, 312, 278, 256, 289, 301, 267, 284, 259, 295],
    description: 'Human reaction time measurements'
  }
]
```

**Migration Notes**: Extract to `src/data/statistics/datasets.ts`

---

## 4. Markdown Frontmatter Schema

### Standard Content Page Frontmatter
```yaml
---
title: "Page Title"
description: "SEO description for the page"
tags:
  - tag1
  - tag2
difficulty: beginner | intermediate | advanced
prerequisites:
  - /path/to/prerequisite
related_concepts:
  - /path/to/related
applications:
  - "Application 1"
  - "Application 2"
interactive: true | false
code_examples: true | false
complexity_analysis: true | false
real_world_examples: true | false
layout: concept-page | index-page
date_created: 2024-01-01
last_updated: 2024-12-01
author: "Snake Math Team"
version: "1.0"
---
```

### Migration Notes
- Frontmatter can become route meta or page component props
- `difficulty` useful for filtering/badges
- `prerequisites` could power learning path recommendations
- `tags` useful for search/categorization
- Consider which metadata is still relevant

---

## 5. Color Schemes

### Material Design Colors (Used Throughout)
```javascript
const componentColors = {
  primary: '#2196F3',    // Blue
  error: '#F44336',      // Red
  success: '#4CAF50',    // Green
  warning: '#FF9800',    // Orange
  info: '#9C27B0',       // Purple

  // Number sets
  natural: '#FF6B6B',
  whole: '#4ECDC4',
  integer: '#45B7D1',
  rational: '#96CEB4',
  real: '#FFEAA7',

  // Canvas
  gridLine: '#e0e0e0',
  axis: '#333333',
  curve: '#2196F3'
}
```

### Migration Notes
- Map to Tailwind color palette
- Consider defining CSS variables for theme consistency
- Current system uses emerald as primary

---

## Summary: Recommended Data File Structure

```
src/data/
├── navigation.ts           # Sidebar/nav structure
├── numbers/
│   └── sets.ts            # Number set definitions
├── quadratic/
│   └── presets.ts         # Function presets & scenarios
├── linearSystems/
│   └── examples.ts        # System examples & word problems
├── summation/
│   └── formulas.ts        # Common summation formulas
├── products/
│   └── formulas.ts        # Product notation formulas
├── trigonometry/
│   └── specialAngles.ts   # Angle values & quadrant signs
├── operators/
│   └── precedence.ts      # Language precedence rules
├── vectors/
│   └── presets.ts         # Vector example pairs
└── statistics/
    └── datasets.ts        # Sample datasets
```

---

## Migration Priority

### High (Directly Usable)
1. **Navigation structure** - Maps to routes
2. **Number set definitions** - Reference data
3. **Special angles** - Trig reference table
4. **Summation formulas** - Core educational content

### Medium (Needs Adaptation)
1. **Quadratic presets** - Good examples but may want different scenarios
2. **Statistics datasets** - Useful for demos
3. **Vector presets** - Good for widget defaults

### Low (Consider Rebuilding)
1. **Operator precedence** - Complex; may simplify scope
2. **Color schemes** - Tailwind handles this differently
3. **Word problems** - May want fresh examples
