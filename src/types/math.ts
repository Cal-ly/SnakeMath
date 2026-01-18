/**
 * Types for mathematical operations and widget state
 */

/**
 * Result of number type classification
 */
export interface NumberClassification {
  /** Whether the number is a natural number (N): positive integers */
  isNatural: boolean
  /** Whether the number is an integer (Z): whole numbers including zero and negatives */
  isInteger: boolean
  /** Whether the number is rational (Q): expressible as p/q */
  isRational: boolean
  /** Whether the number is real (R): all non-complex numbers */
  isReal: boolean
  /** Whether the number is complex (C): has imaginary component */
  isComplex: boolean
  /** Python data type that would represent this number */
  pythonType: PythonNumberType
  /** Any warnings about the number (precision loss, overflow, etc.) */
  warnings: string[]
  /** Whether the input was successfully parsed */
  isValid: boolean
  /** Error message if parsing failed */
  errorMessage?: string
}

/**
 * Python number types
 */
export type PythonNumberType = 'int' | 'float' | 'complex' | 'Decimal' | 'unknown'

/**
 * Parsed number input from user
 */
export interface NumberInput {
  /** Original user input string */
  raw: string
  /** Parsed numeric value (null if invalid or complex) */
  parsedReal?: number
  /** Imaginary component for complex numbers */
  parsedImaginary?: number
  /** Whether parsing succeeded */
  isValid: boolean
  /** Error message if parsing failed */
  errorMessage?: string
}

/**
 * Complex number representation
 */
export interface ComplexNumber {
  /** Real part */
  real: number
  /** Imaginary part */
  imaginary: number
}

/**
 * Widget state that can be serialized to URL
 */
export interface WidgetState {
  /** Unique identifier for the widget instance */
  id: string
  /** Serializable parameters */
  params: Record<string, string | number | boolean>
}

/**
 * Mathematical operation result with steps
 */
export interface CalculationResult<T> {
  /** Final result */
  result: T
  /** Intermediate steps for educational display */
  steps: CalculationStep[]
  /** Whether calculation succeeded */
  success: boolean
  /** Error message if failed */
  error?: string
}

/**
 * A single step in a calculation
 */
export interface CalculationStep {
  /** Description of what this step does */
  description: string
  /** Mathematical expression (KaTeX format) */
  expression: string
  /** Result of this step */
  result: string
}

/**
 * Number properties for display
 */
export interface NumberProperties {
  type: 'natural' | 'integer' | 'rational' | 'irrational' | 'real' | 'complex' | 'special'
  value: number | { real: number; imag: number }
  sign?: number
  isInteger?: boolean
  isEven?: boolean
  isPrime?: boolean
  absoluteValue?: number
  realPart?: number
  imaginaryPart?: number
  isSpecial?: boolean
  specialName?: string
}

/**
 * Result of evaluating a summation
 */
export interface SummationResult {
  /** Total sum of all terms */
  total: number
  /** Individual term values */
  terms: number[]
  /** Number of terms in the sum */
  termCount: number
}

/**
 * Comparison between loop evaluation and closed-form formula
 */
export interface FormulaComparison {
  /** Result computed via iteration */
  loopResult: number
  /** Result computed via closed-form formula */
  formulaResult: number
  /** Whether the two results match */
  match: boolean
  /** Number of iterations performed by the loop */
  iterations: number
}

/**
 * Identifier for summation preset formulas
 */
export type SummationPresetId = 'arithmetic' | 'squares' | 'cubes' | 'geometric' | 'constant'

/**
 * Result of evaluating a product
 */
export interface ProductResult {
  /** Total product of all factors */
  product: number
  /** Individual factor values */
  factors: number[]
  /** Number of factors in the product */
  factorCount: number
}

/**
 * Identifier for product preset formulas
 */
export type ProductPresetId = 'factorial' | 'evenNumbers' | 'oddNumbers' | 'powers' | 'fractions'

/**
 * 2D Vector representation
 */
export interface Vector2D {
  x: number
  y: number
}

/**
 * Preset vector pair for educational demonstrations
 */
export interface VectorPreset {
  id: string
  name: string
  description: string
  vectorA: Vector2D
  vectorB: Vector2D
}

/**
 * Available vector operations
 */
export type VectorOperation =
  | 'add'
  | 'subtract'
  | 'dot'
  | 'magnitude'
  | 'angle'
  | 'scalar'
  | 'normalize'

// ============================================================================
// Matrix Types (Phase 12)
// ============================================================================

/**
 * 2×2 Matrix for 2D linear transformations.
 * Represented as: | a  b |
 *                 | c  d |
 */
export interface Matrix2x2 {
  /** Element at row 0, column 0 */
  a: number
  /** Element at row 0, column 1 */
  b: number
  /** Element at row 1, column 0 */
  c: number
  /** Element at row 1, column 1 */
  d: number
}

/**
 * Types of 2D linear transformations.
 */
export type TransformationType =
  | 'identity'
  | 'rotation'
  | 'scale'
  | 'uniformScale'
  | 'shearX'
  | 'shearY'
  | 'reflectX'
  | 'reflectY'
  | 'reflectOrigin'
  | 'custom'

/**
 * A preset transformation with its associated matrix and metadata.
 */
export interface TransformationPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Brief description of the transformation */
  description: string
  /** Classification of transformation type */
  type: TransformationType
  /** The 2×2 transformation matrix */
  matrix: Matrix2x2
  /** Optional parameters used to generate this matrix */
  parameters?: Record<string, number>
}

// ============================================================================
// 3D Vector Types (Phase 16)
// ============================================================================

/**
 * 3D Vector representation
 */
export interface Vector3D {
  x: number
  y: number
  z: number
}

/**
 * Preset 3D vector pair for educational demonstrations
 */
export interface Vector3DPreset {
  id: string
  name: string
  description: string
  vectorA: Vector3D
  vectorB: Vector3D
}

/**
 * Available 3D vector operations
 */
export type Vector3DOperation =
  | 'add'
  | 'subtract'
  | 'dot'
  | 'cross'
  | 'magnitude'
  | 'angle'
  | 'scalar'
  | 'normalize'

// ============================================================================
// 3D Matrix Types (Phase 16)
// ============================================================================

/**
 * 3×3 Matrix for 3D linear transformations.
 * Represented as a 2D array: [[row0], [row1], [row2]]
 */
export type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
]

/**
 * Types of 3D rotation transformations.
 */
export type Rotation3DType =
  | 'identity'
  | 'rotationX'
  | 'rotationY'
  | 'rotationZ'
  | 'combined'
  | 'scale'

/**
 * A preset 3D rotation transformation with its associated matrix and metadata.
 */
export interface Rotation3DPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Brief description of the transformation */
  description: string
  /** Classification of transformation type */
  type: Rotation3DType
  /** The 3×3 transformation matrix */
  matrix: Matrix3x3
  /** Optional parameters used to generate this matrix */
  parameters?: Record<string, number>
}

// ============================================================================
// Limits Types (Phase 13)
// ============================================================================

/**
 * Result of evaluating a limit
 */
export interface LimitResult {
  /** Whether the limit exists (left and right limits are equal) */
  exists: boolean
  /** The limit value if it exists, null otherwise */
  value: number | null
  /** The left-sided limit (x → a⁻) */
  leftLimit: number | null
  /** The right-sided limit (x → a⁺) */
  rightLimit: number | null
  /** Classification of the limit type */
  limitType: 'finite' | 'infinite' | 'does-not-exist'
}

/**
 * Result of checking continuity at a point
 */
export interface ContinuityResult {
  /** Whether the function is continuous at the point */
  isContinuous: boolean
  /** Type of discontinuity if not continuous */
  discontinuityType: 'none' | 'removable' | 'jump' | 'infinite' | 'oscillating'
  /** Human-readable description */
  description: string
}

/**
 * A preset function for the LimitsExplorer widget
 * D-107: Use preset functions rather than arbitrary input
 */
export interface LimitFunctionPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Educational description */
  description: string
  /** The function itself */
  fn: (x: number) => number
  /** Recommended viewing domain */
  domain: { min: number; max: number }
  /** Points where limits are interesting to explore */
  interestingPoints: number[]
  /** LaTeX representation for display */
  latex: string
  /** Expected behavior at interesting points */
  expectedBehavior: string
}

/**
 * Direction from which to approach the limit point
 */
export type ApproachDirection = 'both' | 'left' | 'right'

/**
 * A step in the numerical limit approximation sequence
 */
export interface LimitApproximationStep {
  /** The x value approaching the target */
  x: number
  /** The function value f(x) */
  fx: number
  /** Distance from the approach point |x - a| */
  distance: number
}

// ============================================================================
// Derivative Types (Phase 14)
// ============================================================================

/**
 * Result of computing a derivative at a point
 */
export interface DerivativeResult {
  /** The derivative value (numerical or exact) */
  value: number
  /** The exact derivative value if known symbolically */
  exactValue?: number
  /** Method used to compute the derivative */
  method: 'numerical' | 'exact'
  /** Whether the derivative exists at this point */
  exists: boolean
}

/**
 * Tangent line at a point on a curve
 * Equation: y = slope * (x - point.x) + point.y
 */
export interface TangentLine {
  /** Slope of the tangent line (the derivative value) */
  slope: number
  /** Y-intercept of the tangent line */
  yIntercept: number
  /** Point of tangency on the curve */
  point: { x: number; y: number }
}

/**
 * Secant line connecting two points on a curve
 * Used to visualize the limit definition of derivatives
 */
export interface SecantLine {
  /** Slope of the secant line: (f(x+h) - f(x)) / h */
  slope: number
  /** The h value (distance between points) */
  h: number
  /** First point on the curve */
  point1: { x: number; y: number }
  /** Second point on the curve */
  point2: { x: number; y: number }
}

/**
 * A preset function for the DerivativeVisualizer widget
 * D-113: Use preset functions consistent with D-107 (LimitsExplorer)
 */
export interface DerivativeFunctionPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Educational description */
  description: string
  /** The function itself */
  fn: (x: number) => number
  /** The exact derivative function (for comparison) */
  derivative: (x: number) => number
  /** LaTeX representation of f(x) */
  latex: string
  /** LaTeX representation of f'(x) */
  derivativeLatex: string
  /** Recommended viewing domain */
  domain: { min: number; max: number }
  /** Points with interesting derivative behavior */
  interestingPoints: DerivativeInterestingPoint[]
}

/**
 * A point of interest for exploring derivatives
 */
export interface DerivativeInterestingPoint {
  /** X coordinate */
  x: number
  /** Description of what's interesting at this point */
  description: string
}

/**
 * Classification of a critical point
 */
export type CriticalPointType = 'local-min' | 'local-max' | 'inflection' | 'saddle' | 'none'

/**
 * Information about a critical point where f'(x) = 0
 */
export interface CriticalPoint {
  /** X coordinate of the critical point */
  x: number
  /** Function value at the critical point */
  y: number
  /** Classification of the critical point */
  type: CriticalPointType
}
