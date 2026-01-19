/**
 * Correlation and regression utility functions.
 * Includes Pearson correlation, linear regression, residuals, and presets.
 *
 * Key concepts:
 * - Correlation (r): Measures the strength and direction of linear relationship (-1 to +1)
 * - Linear Regression: Fits a line ŷ = mx + b to minimize squared residuals
 * - R² (Coefficient of Determination): Proportion of variance explained by the model
 * - Residuals: Difference between observed and predicted values
 * - Cook's Distance: Measures influence of each observation on regression
 */

// ============================================================================
// Types
// ============================================================================

export interface Point {
  x: number
  y: number
}

export interface LinearRegressionResult {
  slope: number
  intercept: number
  r: number
  rSquared: number
  standardError: number
  slopeStandardError: number
  interceptStandardError: number
}

export interface RegressionConfidenceIntervals {
  slope: { lower: number; upper: number }
  intercept: { lower: number; upper: number }
}

export interface ResidualAnalysis {
  residuals: number[]
  sumOfSquaredResiduals: number
  standardError: number
  meanAbsoluteError: number
}

export interface CorrelationPreset {
  id: string
  name: string
  description: string
  points: Point[]
  expectedR: number
  lesson: string
}

// ============================================================================
// Basic Statistics (for arrays)
// ============================================================================

/**
 * Calculate the mean of an array.
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

/**
 * Calculate the sample standard deviation (using n-1 for Bessel's correction).
 */
export function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0
  const m = mean(values)
  const sumSquaredDiff = values.reduce((sum, v) => sum + (v - m) ** 2, 0)
  return Math.sqrt(sumSquaredDiff / (values.length - 1))
}

/**
 * Calculate the population standard deviation (using n).
 */
export function populationStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0
  const m = mean(values)
  const sumSquaredDiff = values.reduce((sum, v) => sum + (v - m) ** 2, 0)
  return Math.sqrt(sumSquaredDiff / values.length)
}

// ============================================================================
// Correlation Functions
// ============================================================================

/**
 * Calculate Pearson correlation coefficient.
 *
 * r = Σ[(xᵢ - x̄)(yᵢ - ȳ)] / √[Σ(xᵢ - x̄)² × Σ(yᵢ - ȳ)²]
 *
 * Returns a value between -1 and +1:
 * - r = +1: Perfect positive correlation
 * - r = 0: No linear correlation
 * - r = -1: Perfect negative correlation
 *
 * @param x Array of x values
 * @param y Array of y values
 * @throws Error if arrays have different lengths or less than 2 points
 */
export function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length')
  }
  if (x.length < 2) {
    throw new Error('Need at least 2 data points')
  }

  const n = x.length
  const xMean = mean(x)
  const yMean = mean(y)

  let numerator = 0
  let xSumSq = 0
  let ySumSq = 0

  for (let i = 0; i < n; i++) {
    const xDiff = x[i]! - xMean
    const yDiff = y[i]! - yMean
    numerator += xDiff * yDiff
    xSumSq += xDiff * xDiff
    ySumSq += yDiff * yDiff
  }

  const denominator = Math.sqrt(xSumSq * ySumSq)

  // Handle case where one variable has no variance
  if (denominator === 0) {
    return 0
  }

  return numerator / denominator
}

/**
 * Interpret the correlation coefficient strength.
 *
 * @param r Correlation coefficient
 * @returns Description of correlation strength
 */
export function interpretCorrelation(r: number): string {
  const absR = Math.abs(r)
  const direction = r >= 0 ? 'positive' : 'negative'

  if (absR < 0.1) return 'negligible'
  if (absR < 0.3) return `weak ${direction}`
  if (absR < 0.5) return `moderate ${direction}`
  if (absR < 0.7) return `strong ${direction}`
  if (absR < 0.9) return `very strong ${direction}`
  return `near-perfect ${direction}`
}

/**
 * Calculate the coefficient of determination (R²).
 * R² represents the proportion of variance in y explained by x.
 *
 * R² = r²
 *
 * @param r Correlation coefficient
 */
export function coefficientOfDetermination(r: number): number {
  return r * r
}

// ============================================================================
// Linear Regression Functions
// ============================================================================

/**
 * Perform simple linear regression using Ordinary Least Squares (OLS).
 * Fits a line ŷ = mx + b that minimizes the sum of squared residuals.
 *
 * Formulas:
 * - slope (m) = Σ[(xᵢ - x̄)(yᵢ - ȳ)] / Σ(xᵢ - x̄)²
 * - intercept (b) = ȳ - m × x̄
 *
 * @param x Array of x values
 * @param y Array of y values
 */
export function linearRegression(x: number[], y: number[]): LinearRegressionResult {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length')
  }
  if (x.length < 2) {
    throw new Error('Need at least 2 data points')
  }

  const n = x.length
  const xMean = mean(x)
  const yMean = mean(y)

  let numerator = 0
  let xSumSq = 0

  for (let i = 0; i < n; i++) {
    const xDiff = x[i]! - xMean
    const yDiff = y[i]! - yMean
    numerator += xDiff * yDiff
    xSumSq += xDiff * xDiff
  }

  // Handle case where x has no variance (vertical line of points)
  if (xSumSq === 0) {
    return {
      slope: 0,
      intercept: yMean,
      r: 0,
      rSquared: 0,
      standardError: standardDeviation(y),
      slopeStandardError: 0,
      interceptStandardError: 0,
    }
  }

  const slope = numerator / xSumSq
  const intercept = yMean - slope * xMean

  // Calculate correlation
  const r = pearsonCorrelation(x, y)
  const rSquared = r * r

  // Calculate residuals and standard error
  const residuals = calculateResiduals(x, y, slope, intercept)
  const sse = residuals.reduce((sum, r) => sum + r * r, 0)
  const standardError = n > 2 ? Math.sqrt(sse / (n - 2)) : 0

  // Standard errors for coefficients
  const slopeStandardError = xSumSq > 0 ? standardError / Math.sqrt(xSumSq) : 0
  const xSumSqFromMean = x.reduce((sum, xi) => sum + xi * xi, 0)
  const interceptStandardError = standardError * Math.sqrt(xSumSqFromMean / (n * xSumSq))

  return {
    slope,
    intercept,
    r,
    rSquared,
    standardError,
    slopeStandardError,
    interceptStandardError,
  }
}

/**
 * Predict y value for a given x using regression coefficients.
 *
 * ŷ = mx + b
 *
 * @param x X value to predict for
 * @param slope Regression slope (m)
 * @param intercept Regression intercept (b)
 */
export function predictY(x: number, slope: number, intercept: number): number {
  return slope * x + intercept
}

/**
 * Predict y values for an array of x values.
 */
export function predictYArray(
  xValues: number[],
  slope: number,
  intercept: number
): number[] {
  return xValues.map((x) => predictY(x, slope, intercept))
}

/**
 * Calculate confidence intervals for regression coefficients.
 * Uses t-distribution critical values.
 *
 * @param regression Linear regression result
 * @param n Sample size
 * @param alpha Significance level (default: 0.05 for 95% CI)
 */
export function regressionConfidenceIntervals(
  regression: LinearRegressionResult,
  n: number,
  alpha: number = 0.05
): RegressionConfidenceIntervals {
  // Approximate t critical value for 95% CI (df = n - 2)
  // Using approximation: for df > 30, t ≈ 1.96
  const df = n - 2
  let tCrit: number
  if (df <= 0) {
    tCrit = 12.71 // t for df=1, alpha=0.025
  } else if (df === 1) {
    tCrit = 12.71
  } else if (df === 2) {
    tCrit = 4.303
  } else if (df <= 5) {
    tCrit = 2.571
  } else if (df <= 10) {
    tCrit = 2.228
  } else if (df <= 20) {
    tCrit = 2.086
  } else if (df <= 30) {
    tCrit = 2.042
  } else {
    tCrit = 1.96
  }

  // Adjust for alpha != 0.05
  if (alpha !== 0.05) {
    // Simple approximation
    tCrit = 1.96 * (0.05 / alpha)
  }

  const slopeMargin = tCrit * regression.slopeStandardError
  const interceptMargin = tCrit * regression.interceptStandardError

  return {
    slope: {
      lower: regression.slope - slopeMargin,
      upper: regression.slope + slopeMargin,
    },
    intercept: {
      lower: regression.intercept - interceptMargin,
      upper: regression.intercept + interceptMargin,
    },
  }
}

// ============================================================================
// Residual Functions
// ============================================================================

/**
 * Calculate residuals (errors) for each point.
 * Residual = observed y - predicted y
 *
 * @param x Array of x values
 * @param y Array of y values
 * @param slope Regression slope
 * @param intercept Regression intercept
 */
export function calculateResiduals(
  x: number[],
  y: number[],
  slope: number,
  intercept: number
): number[] {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length')
  }

  return x.map((xi, i) => y[i]! - predictY(xi, slope, intercept))
}

/**
 * Perform full residual analysis.
 *
 * @param x Array of x values
 * @param y Array of y values
 * @param slope Regression slope
 * @param intercept Regression intercept
 */
export function analyzeResiduals(
  x: number[],
  y: number[],
  slope: number,
  intercept: number
): ResidualAnalysis {
  const residuals = calculateResiduals(x, y, slope, intercept)
  const n = residuals.length

  const sumOfSquaredResiduals = residuals.reduce((sum, r) => sum + r * r, 0)
  const standardError = n > 2 ? Math.sqrt(sumOfSquaredResiduals / (n - 2)) : 0
  const meanAbsoluteError = residuals.reduce((sum, r) => sum + Math.abs(r), 0) / n

  return {
    residuals,
    sumOfSquaredResiduals,
    standardError,
    meanAbsoluteError,
  }
}

/**
 * Calculate the standard error of the estimate (SEE).
 * Also known as root mean squared error (RMSE) for regression.
 *
 * SEE = √[Σ(yᵢ - ŷᵢ)² / (n - 2)]
 *
 * @param residuals Array of residuals
 * @param n Sample size
 */
export function standardErrorOfEstimate(residuals: number[], n: number): number {
  if (n <= 2) return 0
  const sse = residuals.reduce((sum, r) => sum + r * r, 0)
  return Math.sqrt(sse / (n - 2))
}

// ============================================================================
// Influence and Outlier Detection
// ============================================================================

/**
 * Calculate Cook's Distance for each observation.
 * Cook's D measures the influence of each point on the regression.
 * Values > 1 or > 4/n are typically considered influential.
 *
 * D_i = (residual_i² / (p × MSE)) × (h_ii / (1 - h_ii)²)
 *
 * Where h_ii (leverage) measures how far x_i is from the mean of x.
 *
 * @param x Array of x values
 * @param y Array of y values
 */
export function cooksDistance(x: number[], y: number[]): number[] {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length')
  }
  if (x.length < 3) {
    return x.map(() => 0)
  }

  const n = x.length
  const regression = linearRegression(x, y)
  const residuals = calculateResiduals(x, y, regression.slope, regression.intercept)

  // Calculate mean squared error
  const mse = residuals.reduce((sum, r) => sum + r * r, 0) / (n - 2)

  // Calculate leverage (h_ii) for each point
  const xMean = mean(x)
  const xSumSq = x.reduce((sum, xi) => sum + (xi - xMean) ** 2, 0)

  const leverages = x.map((xi) => {
    return 1 / n + (xi - xMean) ** 2 / xSumSq
  })

  // Calculate Cook's distance for each point
  // p = 2 (intercept + slope)
  const p = 2

  return residuals.map((residual, i) => {
    const h = leverages[i]!
    if (h >= 1) return Infinity
    const standardizedResidual = residual / Math.sqrt(mse * (1 - h))
    return (standardizedResidual ** 2 / p) * (h / (1 - h))
  })
}

/**
 * Identify potential outliers based on standardized residuals.
 * Points with |standardized residual| > 2 are flagged.
 *
 * @param x Array of x values
 * @param y Array of y values
 * @param threshold Threshold for flagging (default: 2)
 */
export function identifyOutliers(
  x: number[],
  y: number[],
  threshold: number = 2
): number[] {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length')
  }
  if (x.length < 3) {
    return []
  }

  const regression = linearRegression(x, y)
  const residuals = calculateResiduals(x, y, regression.slope, regression.intercept)
  const se = regression.standardError

  if (se === 0) return []

  const outlierIndices: number[] = []
  residuals.forEach((r, i) => {
    if (Math.abs(r / se) > threshold) {
      outlierIndices.push(i)
    }
  })

  return outlierIndices
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate the total sum of squares (TSS).
 * TSS = Σ(yᵢ - ȳ)²
 */
export function totalSumOfSquares(y: number[]): number {
  const yMean = mean(y)
  return y.reduce((sum, yi) => sum + (yi - yMean) ** 2, 0)
}

/**
 * Calculate R² from residuals and y values.
 * R² = 1 - (SSE / TSS)
 */
export function rSquaredFromResiduals(residuals: number[], y: number[]): number {
  const sse = residuals.reduce((sum, r) => sum + r * r, 0)
  const tss = totalSumOfSquares(y)
  if (tss === 0) return 1
  return 1 - sse / tss
}

/**
 * Generate points for the regression line within a given range.
 *
 * @param slope Regression slope
 * @param intercept Regression intercept
 * @param xMin Minimum x value
 * @param xMax Maximum x value
 * @param numPoints Number of points to generate
 */
export function generateRegressionLinePoints(
  slope: number,
  intercept: number,
  xMin: number,
  xMax: number,
  numPoints: number = 2
): Point[] {
  const points: Point[] = []
  const step = (xMax - xMin) / (numPoints - 1)

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * step
    points.push({ x, y: predictY(x, slope, intercept) })
  }

  return points
}

/**
 * Convert an array of Points to separate x and y arrays.
 */
export function pointsToArrays(points: Point[]): { x: number[]; y: number[] } {
  return {
    x: points.map((p) => p.x),
    y: points.map((p) => p.y),
  }
}

/**
 * Convert separate x and y arrays to an array of Points.
 */
export function arraysToPoints(x: number[], y: number[]): Point[] {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length')
  }
  return x.map((xi, i) => ({ x: xi, y: y[i]! }))
}

// ============================================================================
// Anscombe's Quartet
// ============================================================================

/**
 * Anscombe's Quartet: Four datasets with identical statistical properties
 * but very different patterns when visualized.
 *
 * All four have:
 * - Same mean of x: 9
 * - Same mean of y: ~7.5
 * - Same variance of x: 11
 * - Same variance of y: ~4.125
 * - Same correlation: ~0.816
 * - Same regression line: y = 0.5x + 3
 */
export const anscombesQuartet: { id: string; name: string; description: string; points: Point[] }[] = [
  {
    id: 'anscombe-1',
    name: 'Anscombe I',
    description: 'Linear relationship with normal scatter',
    points: [
      { x: 10, y: 8.04 },
      { x: 8, y: 6.95 },
      { x: 13, y: 7.58 },
      { x: 9, y: 8.81 },
      { x: 11, y: 8.33 },
      { x: 14, y: 9.96 },
      { x: 6, y: 7.24 },
      { x: 4, y: 4.26 },
      { x: 12, y: 10.84 },
      { x: 7, y: 4.82 },
      { x: 5, y: 5.68 },
    ],
  },
  {
    id: 'anscombe-2',
    name: 'Anscombe II',
    description: 'Curved (quadratic) relationship',
    points: [
      { x: 10, y: 9.14 },
      { x: 8, y: 8.14 },
      { x: 13, y: 8.74 },
      { x: 9, y: 8.77 },
      { x: 11, y: 9.26 },
      { x: 14, y: 8.1 },
      { x: 6, y: 6.13 },
      { x: 4, y: 3.1 },
      { x: 12, y: 9.13 },
      { x: 7, y: 7.26 },
      { x: 5, y: 4.74 },
    ],
  },
  {
    id: 'anscombe-3',
    name: 'Anscombe III',
    description: 'Linear with one influential outlier',
    points: [
      { x: 10, y: 7.46 },
      { x: 8, y: 6.77 },
      { x: 13, y: 12.74 },
      { x: 9, y: 7.11 },
      { x: 11, y: 7.81 },
      { x: 14, y: 8.84 },
      { x: 6, y: 6.08 },
      { x: 4, y: 5.39 },
      { x: 12, y: 8.15 },
      { x: 7, y: 6.42 },
      { x: 5, y: 5.73 },
    ],
  },
  {
    id: 'anscombe-4',
    name: 'Anscombe IV',
    description: 'No relationship except one high-leverage point',
    points: [
      { x: 8, y: 6.58 },
      { x: 8, y: 5.76 },
      { x: 8, y: 7.71 },
      { x: 8, y: 8.84 },
      { x: 8, y: 8.47 },
      { x: 8, y: 7.04 },
      { x: 8, y: 5.25 },
      { x: 19, y: 12.5 },
      { x: 8, y: 5.56 },
      { x: 8, y: 7.91 },
      { x: 8, y: 6.89 },
    ],
  },
]

// ============================================================================
// Correlation Presets
// ============================================================================

export const correlationPresets: CorrelationPreset[] = [
  {
    id: 'strong-positive',
    name: 'Strong Positive',
    description: 'Clear positive linear relationship',
    expectedR: 0.95,
    lesson: 'When r is close to +1, as x increases, y reliably increases.',
    points: [
      { x: 1, y: 2.1 },
      { x: 2, y: 4.2 },
      { x: 3, y: 5.8 },
      { x: 4, y: 8.1 },
      { x: 5, y: 9.9 },
      { x: 6, y: 12.2 },
      { x: 7, y: 13.8 },
      { x: 8, y: 16.1 },
      { x: 9, y: 17.9 },
      { x: 10, y: 20.2 },
    ],
  },
  {
    id: 'strong-negative',
    name: 'Strong Negative',
    description: 'Clear negative linear relationship',
    expectedR: -0.95,
    lesson: 'When r is close to -1, as x increases, y reliably decreases.',
    points: [
      { x: 1, y: 19.8 },
      { x: 2, y: 17.9 },
      { x: 3, y: 16.1 },
      { x: 4, y: 13.8 },
      { x: 5, y: 12.2 },
      { x: 6, y: 9.9 },
      { x: 7, y: 8.1 },
      { x: 8, y: 5.8 },
      { x: 9, y: 4.2 },
      { x: 10, y: 2.1 },
    ],
  },
  {
    id: 'no-correlation',
    name: 'No Correlation',
    description: 'Random scatter with no pattern',
    expectedR: 0,
    lesson: 'When r ≈ 0, knowing x tells you nothing about y. There\'s no linear relationship.',
    points: [
      { x: 1, y: 8 },
      { x: 2, y: 3 },
      { x: 3, y: 12 },
      { x: 4, y: 5 },
      { x: 5, y: 9 },
      { x: 6, y: 2 },
      { x: 7, y: 11 },
      { x: 8, y: 6 },
      { x: 9, y: 4 },
      { x: 10, y: 10 },
    ],
  },
  {
    id: 'moderate-positive',
    name: 'Moderate Positive',
    description: 'Positive trend with noticeable scatter',
    expectedR: 0.65,
    lesson: 'Moderate correlation shows a trend but with significant variability.',
    points: [
      { x: 1, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 5, y: 8 },
      { x: 6, y: 6 },
      { x: 7, y: 9 },
      { x: 8, y: 7 },
      { x: 9, y: 12 },
      { x: 10, y: 10 },
    ],
  },
  {
    id: 'nonlinear-quadratic',
    name: 'Non-Linear (Quadratic)',
    description: 'Curved relationship that linear regression misses',
    expectedR: 0,
    lesson: 'Correlation measures LINEAR relationship only. A perfect curve can have r ≈ 0!',
    points: [
      { x: 1, y: 10 },
      { x: 2, y: 5 },
      { x: 3, y: 2 },
      { x: 4, y: 1 },
      { x: 5, y: 0.5 },
      { x: 6, y: 1 },
      { x: 7, y: 2 },
      { x: 8, y: 5 },
      { x: 9, y: 10 },
      { x: 10, y: 17 },
    ],
  },
  {
    id: 'outlier-impact',
    name: 'Outlier Impact',
    description: 'One outlier dramatically affecting correlation',
    expectedR: 0.9,
    lesson: 'A single outlier can drastically change r. Always visualize your data!',
    points: [
      { x: 1, y: 2 },
      { x: 2, y: 2.1 },
      { x: 3, y: 1.9 },
      { x: 4, y: 2.2 },
      { x: 5, y: 1.8 },
      { x: 6, y: 2.1 },
      { x: 7, y: 2 },
      { x: 8, y: 1.9 },
      { x: 9, y: 2.1 },
      { x: 15, y: 15 }, // Outlier
    ],
  },
  {
    id: 'heteroscedasticity',
    name: 'Heteroscedasticity',
    description: 'Variance increases with x (fan shape)',
    expectedR: 0.7,
    lesson: 'When variance changes with x, regression assumptions are violated.',
    points: [
      { x: 1, y: 2 },
      { x: 2, y: 4.2 },
      { x: 3, y: 5.5 },
      { x: 4, y: 9 },
      { x: 5, y: 8 },
      { x: 6, y: 14 },
      { x: 7, y: 10 },
      { x: 8, y: 18 },
      { x: 9, y: 12 },
      { x: 10, y: 22 },
    ],
  },
  {
    id: 'clustering',
    name: 'Two Clusters',
    description: 'Two distinct groups creating false correlation',
    expectedR: 0.85,
    lesson: 'Aggregating different groups can create spurious correlations (Simpson\'s Paradox).',
    points: [
      // Cluster 1
      { x: 2, y: 3 },
      { x: 2.5, y: 2.5 },
      { x: 3, y: 3.5 },
      { x: 2.2, y: 2.8 },
      { x: 2.8, y: 3.2 },
      // Cluster 2
      { x: 8, y: 8 },
      { x: 8.5, y: 7.5 },
      { x: 9, y: 8.5 },
      { x: 8.2, y: 7.8 },
      { x: 8.8, y: 8.2 },
    ],
  },
]

/**
 * Get a correlation preset by ID.
 */
export function getCorrelationPresetById(id: string): CorrelationPreset | undefined {
  return correlationPresets.find((p) => p.id === id)
}

/**
 * Get Anscombe's quartet dataset by ID.
 */
export function getAnscombeDatasetById(
  id: string
): { id: string; name: string; description: string; points: Point[] } | undefined {
  return anscombesQuartet.find((d) => d.id === id)
}

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Format a correlation coefficient for display.
 */
export function formatCorrelation(r: number): string {
  return r.toFixed(3)
}

/**
 * Format R² for display as a percentage.
 */
export function formatRSquared(rSquared: number): string {
  return `${(rSquared * 100).toFixed(1)}%`
}

/**
 * Format the regression equation for display.
 */
export function formatRegressionEquation(slope: number, intercept: number): string {
  const slopeStr = slope.toFixed(3)
  const interceptStr = intercept >= 0 ? `+ ${intercept.toFixed(3)}` : `- ${Math.abs(intercept).toFixed(3)}`
  return `ŷ = ${slopeStr}x ${interceptStr}`
}
