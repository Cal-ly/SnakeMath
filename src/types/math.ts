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
