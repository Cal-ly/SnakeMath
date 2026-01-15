# Archive Utilities Inventory

This document catalogs all utility functions found in the archive folder.

## Overview

**Important**: The archive contains **no standalone utility files**. All mathematical and algorithmic functions are embedded within Vue single-file components. This document catalogs these embedded functions for potential extraction.

| Implementation | Utility Organization |
|----------------|---------------------|
| snake-math | Functions embedded in component `<script>` sections |
| snake-math-vue | Minimal functions; mostly UI logic |

---

## Utility Functions by Category

### 1. Quadratic Mathematics

**Source**: `archive/snake-math/docs/.vitepress/theme/components/QuadraticExplorer.vue`

#### calculateVertex
- **Purpose**: Calculate parabola vertex from coefficients
- **Signature**: `(a: number, b: number, c: number) → { x: number, y: number }`
- **Test Coverage**: No
- **Migration Notes**: Pure function; extract to `utils/math/quadratic.ts`

#### calculateDiscriminant
- **Purpose**: Calculate discriminant and classify root count
- **Signature**: `(a: number, b: number, c: number) → { value: number, rootType: 'two' | 'one' | 'none' }`
- **Test Coverage**: No
- **Migration Notes**: Pure function; straightforward extraction

#### solveQuadratic
- **Purpose**: Find roots using quadratic formula
- **Signature**: `(a: number, b: number, c: number) → number[] | null`
- **Test Coverage**: No
- **Migration Notes**: Handle discriminant edge cases

#### convertToVertexForm
- **Purpose**: Convert standard form to vertex form
- **Signature**: `(a: number, b: number, c: number) → { a: number, h: number, k: number }`
- **Test Coverage**: No
- **Migration Notes**: Form conversion utility

#### convertToFactoredForm
- **Purpose**: Convert to factored form (when possible)
- **Signature**: `(a: number, b: number, c: number) → { a: number, r1: number, r2: number } | null`
- **Test Coverage**: No
- **Migration Notes**: Returns null for non-real roots

#### evaluateQuadratic
- **Purpose**: Calculate f(x) for given x
- **Signature**: `(a: number, b: number, c: number, x: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Simple evaluation function

---

### 2. Number Classification

**Source**: `archive/snake-math/docs/.vitepress/theme/components/NumberTypeExplorer.vue`

#### parseNumber
- **Purpose**: Parse string input to number with validation
- **Signature**: `(input: string) → { value: number, isValid: boolean, error?: string }`
- **Test Coverage**: No
- **Migration Notes**: Handles NaN, Infinity, scientific notation

#### classifyNumber
- **Purpose**: Determine number set membership
- **Signature**: `(value: number) → { isNatural: boolean, isWhole: boolean, isInteger: boolean, isRational: boolean, isReal: boolean }`
- **Test Coverage**: No
- **Migration Notes**: Core classification logic; similar to existing `numberClassification.ts`

#### detectPrecisionLoss
- **Purpose**: Compare original vs converted values
- **Signature**: `(original: string, converted: number) → { hasLoss: boolean, difference: number }`
- **Test Coverage**: No
- **Migration Notes**: Useful for floating-point education

#### testOverflow
- **Purpose**: Check if number fits in integer types
- **Signature**: `(value: number, bits: 8 | 16 | 32) → { fits: boolean, max: number, min: number }`
- **Test Coverage**: No
- **Migration Notes**: Memory representation utility

#### getVennPosition
- **Purpose**: Calculate Venn diagram position for number
- **Signature**: `(classification: NumberClassification) → { x: number, y: number, sets: string[] }`
- **Test Coverage**: No
- **Migration Notes**: Visualization helper; keep with component

---

### 3. Linear Systems

**Source**: `archive/snake-math/docs/.vitepress/theme/components/LinearSystemSolver.vue`

#### calculateDeterminant2x2
- **Purpose**: Calculate 2x2 matrix determinant
- **Signature**: `(a11: number, a12: number, a21: number, a22: number) → number`
- **Test Coverage**: No
- **Migration Notes**: `a11*a22 - a12*a21`; pure function

#### solveSystem2x2
- **Purpose**: Solve 2x2 linear system using Cramer's rule
- **Signature**: `(coefficients: number[][], constants: number[]) → { solution: number[] | null, type: 'unique' | 'none' | 'infinite' }`
- **Test Coverage**: No
- **Migration Notes**: Extract to `utils/math/linearSystems.ts`

#### classifySystem
- **Purpose**: Determine solution type from determinant
- **Signature**: `(determinant: number, augmentedDet: number) → 'unique' | 'none' | 'infinite'`
- **Test Coverage**: No
- **Migration Notes**: Educational classification

#### verifySolution
- **Purpose**: Check if solution satisfies both equations
- **Signature**: `(coefficients: number[][], constants: number[], solution: number[]) → boolean`
- **Test Coverage**: No
- **Migration Notes**: Validation utility

---

### 4. Statistics

**Source**: `archive/snake-math/docs/.vitepress/theme/components/StatisticsCalculator.vue`

#### calculateMean
- **Purpose**: Calculate arithmetic mean
- **Signature**: `(data: number[]) → number`
- **Test Coverage**: No
- **Migration Notes**: `sum(data) / data.length`

#### calculateMedian
- **Purpose**: Calculate median value
- **Signature**: `(data: number[]) → number`
- **Test Coverage**: No
- **Migration Notes**: Handle odd/even array lengths

#### calculateMode
- **Purpose**: Find most frequent value(s)
- **Signature**: `(data: number[]) → number[]`
- **Test Coverage**: No
- **Migration Notes**: May return multiple modes

#### calculateVariance
- **Purpose**: Calculate population/sample variance
- **Signature**: `(data: number[], sample?: boolean) → number`
- **Test Coverage**: No
- **Migration Notes**: Include sample variance option

#### calculateStdDev
- **Purpose**: Calculate standard deviation
- **Signature**: `(data: number[], sample?: boolean) → number`
- **Test Coverage**: No
- **Migration Notes**: `Math.sqrt(variance)`

#### calculateQuartiles
- **Purpose**: Calculate Q1, Q2 (median), Q3
- **Signature**: `(data: number[]) → { q1: number, q2: number, q3: number, iqr: number }`
- **Test Coverage**: No
- **Migration Notes**: Essential for box plots

#### detectOutliers
- **Purpose**: Find outliers using IQR method
- **Signature**: `(data: number[], quartiles: Quartiles) → number[]`
- **Test Coverage**: No
- **Migration Notes**: Values outside Q1-1.5*IQR to Q3+1.5*IQR

#### calculateSkewness
- **Purpose**: Measure distribution asymmetry
- **Signature**: `(data: number[]) → { value: number, interpretation: 'left' | 'symmetric' | 'right' }`
- **Test Coverage**: No
- **Migration Notes**: More advanced statistic

#### generateHistogramBins
- **Purpose**: Create histogram bin data
- **Signature**: `(data: number[], binCount: number) → { bins: Bin[], min: number, max: number }`
- **Test Coverage**: No
- **Migration Notes**: Visualization helper

---

### 5. Summation

**Source**: `archive/snake-math/docs/.vitepress/theme/components/SummationDemo.vue`

#### evaluateSummation
- **Purpose**: Calculate Σf(i) from start to end
- **Signature**: `(expression: (i: number) → number, start: number, end: number) → { total: number, terms: number[] }`
- **Test Coverage**: No
- **Migration Notes**: Core summation logic

#### getClosedForm
- **Purpose**: Return closed-form formula for common sums
- **Signature**: `(type: 'arithmetic' | 'squares' | 'cubes' | 'geometric' | 'harmonic', n: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Formulas:
  - Arithmetic: `n(n+1)/2`
  - Squares: `n(n+1)(2n+1)/6`
  - Cubes: `[n(n+1)/2]²`
  - Geometric: `2^(n+1) - 1`
  - Harmonic: Approximation

#### compareMethods
- **Purpose**: Compare loop vs built-in vs formula results
- **Signature**: `(type: string, n: number) → { loop: number, builtin: number, formula: number }`
- **Test Coverage**: No
- **Migration Notes**: Educational comparison

---

### 6. Product Notation

**Source**: `archive/snake-math/docs/.vitepress/theme/components/ProductNotationVisualizer.vue`

#### factorial
- **Purpose**: Calculate n!
- **Signature**: `(n: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Handle n=0 (returns 1)

#### doubleFactorial
- **Purpose**: Calculate n!!
- **Signature**: `(n: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Product of n, n-2, n-4, ...

#### productOfEvens
- **Purpose**: Calculate 2 × 4 × 6 × ... × 2n
- **Signature**: `(n: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Educational example

#### productOfOdds
- **Purpose**: Calculate 1 × 3 × 5 × ... × (2n-1)
- **Signature**: `(n: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Educational example

#### fibonacciProduct
- **Purpose**: Product of first n Fibonacci numbers
- **Signature**: `(n: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Interesting mathematical sequence

#### primeProduct
- **Purpose**: Product of primes up to n (primorial)
- **Signature**: `(n: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Requires isPrime helper

---

### 7. Trigonometry

**Source**: `archive/snake-math/docs/.vitepress/theme/components/UnitCircleExplorer.vue`

#### degreesToRadians
- **Purpose**: Convert degrees to radians
- **Signature**: `(degrees: number) → number`
- **Test Coverage**: No
- **Migration Notes**: `degrees * Math.PI / 180`

#### radiansToDegrees
- **Purpose**: Convert radians to degrees
- **Signature**: `(radians: number) → number`
- **Test Coverage**: No
- **Migration Notes**: `radians * 180 / Math.PI`

#### getQuadrant
- **Purpose**: Determine angle quadrant
- **Signature**: `(degrees: number) → 1 | 2 | 3 | 4`
- **Test Coverage**: No
- **Migration Notes**: Normalize angle first

#### getSignPattern
- **Purpose**: Get sin/cos/tan signs for quadrant
- **Signature**: `(quadrant: number) → { sin: 1 | -1, cos: 1 | -1, tan: 1 | -1 }`
- **Test Coverage**: No
- **Migration Notes**: ASTC rule implementation

#### getReferenceAngle
- **Purpose**: Calculate reference angle
- **Signature**: `(degrees: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Acute angle to x-axis

#### getExactTrigValues
- **Purpose**: Return exact values for special angles
- **Signature**: `(degrees: number) → { sin: string, cos: string, tan: string } | null`
- **Test Coverage**: No
- **Migration Notes**: 0°, 30°, 45°, 60°, 90° etc.

#### verifyPythagoreanIdentity
- **Purpose**: Check sin²θ + cos²θ = 1
- **Signature**: `(degrees: number) → { result: number, isValid: boolean }`
- **Test Coverage**: No
- **Migration Notes**: Educational verification

---

### 8. Vector Operations

**Source**: `archive/snake-math/docs/.vitepress/theme/components/VectorOperations.vue`

#### vectorAdd
- **Purpose**: Add two vectors
- **Signature**: `(a: Vector3D, b: Vector3D) → Vector3D`
- **Test Coverage**: No
- **Migration Notes**: Component-wise addition

#### vectorSubtract
- **Purpose**: Subtract two vectors
- **Signature**: `(a: Vector3D, b: Vector3D) → Vector3D`
- **Test Coverage**: No
- **Migration Notes**: Component-wise subtraction

#### dotProduct
- **Purpose**: Calculate dot product
- **Signature**: `(a: Vector3D, b: Vector3D) → number`
- **Test Coverage**: No
- **Migration Notes**: `a.x*b.x + a.y*b.y + a.z*b.z`

#### crossProduct
- **Purpose**: Calculate cross product (3D)
- **Signature**: `(a: Vector3D, b: Vector3D) → Vector3D`
- **Test Coverage**: No
- **Migration Notes**: Returns perpendicular vector

#### magnitude
- **Purpose**: Calculate vector length
- **Signature**: `(v: Vector3D) → number`
- **Test Coverage**: No
- **Migration Notes**: `Math.sqrt(x² + y² + z²)`

#### normalize
- **Purpose**: Get unit vector
- **Signature**: `(v: Vector3D) → Vector3D`
- **Test Coverage**: No
- **Migration Notes**: `v / magnitude(v)`

#### angleBetween
- **Purpose**: Calculate angle between vectors
- **Signature**: `(a: Vector3D, b: Vector3D) → number`
- **Test Coverage**: No
- **Migration Notes**: `acos(dot / (|a| * |b|))` in degrees

---

### 9. Exponential/Logarithmic

**Source**: `archive/snake-math/docs/.vitepress/theme/components/ExponentialCalculator.vue`

#### evaluateExponential
- **Purpose**: Calculate a × b^x
- **Signature**: `(a: number, b: number, x: number) → number`
- **Test Coverage**: No
- **Migration Notes**: General exponential

#### evaluateLogarithm
- **Purpose**: Calculate log_b(x)
- **Signature**: `(base: number, x: number) → number`
- **Test Coverage**: No
- **Migration Notes**: `Math.log(x) / Math.log(base)`

#### doublingTime
- **Purpose**: Calculate time to double
- **Signature**: `(base: number) → number`
- **Test Coverage**: No
- **Migration Notes**: `ln(2) / ln(base)`

#### halfLife
- **Purpose**: Calculate half-life
- **Signature**: `(base: number) → number`
- **Test Coverage**: No
- **Migration Notes**: `ln(0.5) / ln(base)`

#### compoundInterest
- **Purpose**: Calculate compound interest
- **Signature**: `(principal: number, rate: number, periods: number, time: number) → number`
- **Test Coverage**: No
- **Migration Notes**: `P(1 + r/n)^(nt)`

#### compareComplexities
- **Purpose**: Compare algorithm complexities
- **Signature**: `(n: number) → { constant: number, log: number, linear: number, nLogN: number, exponential: number }`
- **Test Coverage**: No
- **Migration Notes**: Educational comparison chart

---

### 10. Expression Parsing

**Source**: `archive/snake-math/docs/.vitepress/theme/components/OperatorPrecedenceExplorer.vue`

#### tokenize
- **Purpose**: Convert expression string to tokens
- **Signature**: `(expression: string) → Token[]`
- **Test Coverage**: No
- **Migration Notes**: Complex implementation; lexer logic

#### shuntingYard
- **Purpose**: Convert infix to postfix (RPN)
- **Signature**: `(tokens: Token[], precedenceRules: PrecedenceTable) → Token[]`
- **Test Coverage**: No
- **Migration Notes**: Dijkstra's algorithm

#### evaluatePostfix
- **Purpose**: Evaluate postfix expression
- **Signature**: `(tokens: Token[]) → number`
- **Test Coverage**: No
- **Migration Notes**: Stack-based evaluation

#### buildAST
- **Purpose**: Build abstract syntax tree
- **Signature**: `(tokens: Token[]) → ASTNode`
- **Test Coverage**: No
- **Migration Notes**: Tree construction for visualization

---

### 11. Matrix Operations

**Source**: `archive/snake-math/docs/.vitepress/theme/components/MatrixTransformations.vue`

#### matrixMultiply
- **Purpose**: Multiply 2x2 matrices
- **Signature**: `(a: Matrix2x2, b: Matrix2x2) → Matrix2x2`
- **Test Coverage**: No
- **Migration Notes**: Standard matrix multiplication

#### determinant2x2
- **Purpose**: Calculate 2x2 determinant
- **Signature**: `(m: Matrix2x2) → number`
- **Test Coverage**: No
- **Migration Notes**: `ad - bc`

#### applyTransformation
- **Purpose**: Transform a point by matrix
- **Signature**: `(matrix: Matrix2x2, point: Point2D) → Point2D`
- **Test Coverage**: No
- **Migration Notes**: Matrix-vector multiplication

#### getRotationMatrix
- **Purpose**: Create 2D rotation matrix
- **Signature**: `(angleDegrees: number) → Matrix2x2`
- **Test Coverage**: No
- **Migration Notes**: `[[cos, -sin], [sin, cos]]`

#### getScaleMatrix
- **Purpose**: Create scaling matrix
- **Signature**: `(sx: number, sy: number) → Matrix2x2`
- **Test Coverage**: No
- **Migration Notes**: `[[sx, 0], [0, sy]]`

#### getShearMatrix
- **Purpose**: Create shear matrix
- **Signature**: `(kx: number, ky: number) → Matrix2x2`
- **Test Coverage**: No
- **Migration Notes**: `[[1, kx], [ky, 1]]`

---

### 12. Probability

**Source**: `archive/snake-math/docs/.vitepress/theme/components/ProbabilitySimulator.vue`

#### generateNormalSamples
- **Purpose**: Generate normal distribution samples
- **Signature**: `(mean: number, stdDev: number, count: number) → number[]`
- **Test Coverage**: No
- **Migration Notes**: Box-Muller transform

#### generateBinomialSamples
- **Purpose**: Generate binomial distribution samples
- **Signature**: `(n: number, p: number, count: number) → number[]`
- **Test Coverage**: No
- **Migration Notes**: Bernoulli trial simulation

#### generateUniformSamples
- **Purpose**: Generate uniform distribution samples
- **Signature**: `(min: number, max: number, count: number) → number[]`
- **Test Coverage**: No
- **Migration Notes**: `Math.random()` scaled

#### generateExponentialSamples
- **Purpose**: Generate exponential distribution samples
- **Signature**: `(lambda: number, count: number) → number[]`
- **Test Coverage**: No
- **Migration Notes**: `-ln(U) / lambda`

#### normalPDF
- **Purpose**: Calculate normal probability density
- **Signature**: `(x: number, mean: number, stdDev: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Gaussian formula

#### normalCDF
- **Purpose**: Calculate cumulative probability P(X ≤ x)
- **Signature**: `(x: number, mean: number, stdDev: number) → number`
- **Test Coverage**: No
- **Migration Notes**: Approximation or erf function

---

## Summary Table

| Category | Functions | Source Component | Migration Priority |
|----------|-----------|------------------|-------------------|
| Number Classification | 5 | NumberTypeExplorer | High (core feature) |
| Statistics | 10 | StatisticsCalculator | High |
| Quadratic | 6 | QuadraticExplorer | High |
| Summation | 3 | SummationDemo | High |
| Vector Operations | 7 | VectorOperations | Medium |
| Trigonometry | 7 | UnitCircleExplorer | Medium |
| Linear Systems | 4 | LinearSystemSolver | Medium |
| Exponential/Log | 6 | ExponentialCalculator | Medium |
| Product Notation | 6 | ProductNotationVisualizer | Medium |
| Matrix Operations | 6 | MatrixTransformations | Low |
| Probability | 6 | ProbabilitySimulator | Low |
| Expression Parsing | 4 | OperatorPrecedenceExplorer | Low |

---

## Recommended Extraction Structure

```
src/utils/math/
├── numberClassification.ts     # Already exists; extend
├── quadratic.ts                # New: quadratic utilities
├── statistics.ts               # New: descriptive stats
├── summation.ts                # New: sum formulas
├── vectors.ts                  # New: vector operations
├── trigonometry.ts             # New: angle conversions, trig
├── linearSystems.ts            # New: system solving
├── exponential.ts              # New: exp/log functions
├── probability.ts              # New: distributions
└── matrix.ts                   # New: 2D transformations
```

---

## Migration Notes

### Can Use As-Is (Pure Functions)
- All arithmetic operations
- Basic statistics (mean, median, mode)
- Angle conversions
- Vector arithmetic
- Simple evaluations

### Need TypeScript Types
All functions need proper TypeScript signatures. Example:

```typescript
interface Vector3D {
  x: number
  y: number
  z: number
}

export function dotProduct(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}
```

### Need Tests
**None** of the archived functions have tests. All extracted functions should have comprehensive test coverage:

```typescript
// Example test structure
describe('dotProduct', () => {
  it('returns 0 for perpendicular vectors', () => {
    expect(dotProduct({x: 1, y: 0, z: 0}, {x: 0, y: 1, z: 0})).toBe(0)
  })

  it('returns magnitude squared for same vector', () => {
    const v = {x: 3, y: 4, z: 0}
    expect(dotProduct(v, v)).toBe(25)
  })
})
```

### Consider Library Alternatives
Some functions may be better served by existing libraries:
- **Statistics**: Consider simple-statistics or stdlib
- **Linear Algebra**: Consider gl-matrix for performance
- **Probability**: Consider jstat for distributions

However, educational value of custom implementations should be weighed against robustness.
