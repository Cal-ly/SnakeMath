/**
 * Quadratic function utilities for evaluating and analyzing ax² + bx + c.
 */

/** Coefficients for a quadratic function y = ax² + bx + c */
export interface QuadraticCoefficients {
  /** x² coefficient (must be non-zero for a true quadratic) */
  a: number
  /** x coefficient */
  b: number
  /** constant term */
  c: number
}

/** A point in 2D space */
export interface Vertex {
  x: number
  y: number
}

/** Result of discriminant calculation */
export interface DiscriminantResult {
  /** The discriminant value: b² - 4ac */
  value: number
  /** Classification of root type based on discriminant */
  rootType: 'two-real' | 'one-real' | 'two-complex'
}

/** Result of solving a quadratic equation */
export interface QuadraticRoots {
  /** Classification of root type */
  type: 'two-real' | 'one-real' | 'two-complex'
  /** Real roots (empty for complex, 1 for repeated, 2 for distinct) */
  roots: number[]
}

/** Vertex form: y = a(x - h)² + k */
export interface VertexForm {
  /** Same as standard form */
  a: number
  /** x-coordinate of vertex */
  h: number
  /** y-coordinate of vertex */
  k: number
}

/** Factored form: y = a(x - r1)(x - r2), or null if complex roots */
export interface FactoredForm {
  a: number
  r1: number
  r2: number
}

/**
 * Validate that coefficients represent a true quadratic (a ≠ 0).
 * @throws Error if a is zero
 */
function validateCoefficients(coeffs: QuadraticCoefficients): void {
  if (coeffs.a === 0) {
    throw new Error('Coefficient "a" cannot be zero for a quadratic function')
  }
}

/**
 * Calculate the vertex of a parabola.
 * Vertex x = -b/(2a), y = f(x)
 */
export function calculateVertex(coeffs: QuadraticCoefficients): Vertex {
  validateCoefficients(coeffs)
  const { a, b, c } = coeffs
  const x = -b / (2 * a)
  const y = a * x * x + b * x + c
  return { x, y }
}

/**
 * Calculate the discriminant and classify root type.
 * Δ = b² - 4ac
 */
export function calculateDiscriminant(coeffs: QuadraticCoefficients): DiscriminantResult {
  validateCoefficients(coeffs)
  const { a, b, c } = coeffs
  const value = b * b - 4 * a * c

  // Use small epsilon for floating-point comparison
  const epsilon = 1e-10
  let rootType: 'two-real' | 'one-real' | 'two-complex'

  if (value > epsilon) {
    rootType = 'two-real'
  } else if (Math.abs(value) <= epsilon) {
    rootType = 'one-real'
  } else {
    rootType = 'two-complex'
  }

  return { value, rootType }
}

/**
 * Find real roots using the quadratic formula.
 * Returns empty array for complex roots.
 */
export function solveQuadratic(coeffs: QuadraticCoefficients): QuadraticRoots {
  validateCoefficients(coeffs)
  const { a, b } = coeffs
  const discriminant = calculateDiscriminant(coeffs)

  if (discriminant.rootType === 'two-complex') {
    return { type: 'two-complex', roots: [] }
  }

  if (discriminant.rootType === 'one-real') {
    const x = -b / (2 * a)
    return { type: 'one-real', roots: [x] }
  }

  // Two distinct real roots
  const sqrtDisc = Math.sqrt(discriminant.value)
  const x1 = (-b + sqrtDisc) / (2 * a)
  const x2 = (-b - sqrtDisc) / (2 * a)

  // Return roots in order (smaller first)
  return {
    type: 'two-real',
    roots: x1 < x2 ? [x1, x2] : [x2, x1],
  }
}

/**
 * Convert standard form to vertex form.
 * y = a(x - h)² + k
 */
export function toVertexForm(coeffs: QuadraticCoefficients): VertexForm {
  validateCoefficients(coeffs)
  const vertex = calculateVertex(coeffs)
  return {
    a: coeffs.a,
    h: vertex.x,
    k: vertex.y,
  }
}

/**
 * Convert standard form to factored form (if real roots exist).
 * y = a(x - r1)(x - r2)
 * Returns null if roots are complex.
 */
export function toFactoredForm(coeffs: QuadraticCoefficients): FactoredForm | null {
  validateCoefficients(coeffs)
  const roots = solveQuadratic(coeffs)

  if (roots.type === 'two-complex') {
    return null
  }

  if (roots.type === 'one-real') {
    // Repeated root
    const root = roots.roots[0] as number
    return {
      a: coeffs.a,
      r1: root,
      r2: root,
    }
  }

  // Two distinct real roots
  const [r1, r2] = roots.roots as [number, number]
  return {
    a: coeffs.a,
    r1,
    r2,
  }
}

/**
 * Evaluate f(x) = ax² + bx + c at a given x value.
 */
export function evaluateQuadratic(coeffs: QuadraticCoefficients, x: number): number {
  validateCoefficients(coeffs)
  const { a, b, c } = coeffs
  return a * x * x + b * x + c
}

/**
 * Generate points for plotting the quadratic function.
 */
export function generateQuadraticPoints(
  coeffs: QuadraticCoefficients,
  xMin: number,
  xMax: number,
  samples: number = 100
): Array<{ x: number; y: number }> {
  validateCoefficients(coeffs)
  const points: Array<{ x: number; y: number }> = []
  const step = (xMax - xMin) / samples

  for (let i = 0; i <= samples; i++) {
    const x = xMin + i * step
    const y = evaluateQuadratic(coeffs, x)
    points.push({ x, y })
  }

  return points
}

/**
 * Calculate the axis of symmetry (x = -b/2a).
 */
export function getAxisOfSymmetry(coeffs: QuadraticCoefficients): number {
  validateCoefficients(coeffs)
  return -coeffs.b / (2 * coeffs.a)
}

/**
 * Calculate the y-intercept (0, c).
 */
export function getYIntercept(coeffs: QuadraticCoefficients): Vertex {
  return { x: 0, y: coeffs.c }
}

/**
 * Determine if parabola opens upward or downward.
 */
export function opensUpward(coeffs: QuadraticCoefficients): boolean {
  validateCoefficients(coeffs)
  return coeffs.a > 0
}

/**
 * Format a number for display, avoiding unnecessary decimals.
 */
export function formatNumber(value: number, precision: number = 4): string {
  // Check if it's effectively an integer
  if (Math.abs(value - Math.round(value)) < 1e-10) {
    return Math.round(value).toString()
  }
  // Otherwise format with precision and remove trailing zeros
  return parseFloat(value.toPrecision(precision)).toString()
}
