/**
 * Hypothesis testing utility functions.
 * Includes t-tests, z-tests, effect size calculations, and power analysis.
 *
 * Key concepts:
 * - Null Hypothesis (H₀): The default assumption we're testing against
 * - Alternative Hypothesis (H₁): What we're trying to find evidence for
 * - p-value: Probability of seeing results this extreme if H₀ is true
 * - Type I Error (α): Rejecting H₀ when it's true (false positive)
 * - Type II Error (β): Failing to reject H₀ when it's false (false negative)
 * - Power (1-β): Probability of correctly rejecting a false H₀
 * - Effect Size: Standardized measure of the magnitude of an effect
 */

import { standardNormalCdf, standardNormalQuantile, erf as _erf } from './distributions'

// ============================================================================
// Types
// ============================================================================

export type AlternativeHypothesis = 'two-sided' | 'less' | 'greater'

export type TestType = 'one-sample-t' | 'two-sample-t' | 'one-prop-z' | 'two-prop-z'

export interface TTestResult {
  testType: 'one-sample-t' | 'two-sample-t'
  tStatistic: number
  degreesOfFreedom: number
  pValue: number
  alternative: AlternativeHypothesis
  confidenceInterval: { lower: number; upper: number }
  confidenceLevel: number
  effectSize: number // Cohen's d
  effectSizeInterpretation: string
  rejectNull: boolean
  alpha: number
}

export interface ZTestResult {
  testType: 'one-prop-z' | 'two-prop-z'
  zStatistic: number
  pValue: number
  alternative: AlternativeHypothesis
  confidenceInterval: { lower: number; upper: number }
  confidenceLevel: number
  effectSize: number // Cohen's h for proportions
  effectSizeInterpretation: string
  rejectNull: boolean
  alpha: number
}

export interface OneSampleTTestInput {
  sampleMean: number
  sampleStdDev: number
  sampleSize: number
  hypothesizedMean: number
  alternative?: AlternativeHypothesis
  alpha?: number
}

export interface TwoSampleTTestInput {
  mean1: number
  stdDev1: number
  n1: number
  mean2: number
  stdDev2: number
  n2: number
  alternative?: AlternativeHypothesis
  alpha?: number
}

export interface OnePropZTestInput {
  successes: number
  sampleSize: number
  hypothesizedProportion: number
  alternative?: AlternativeHypothesis
  alpha?: number
}

export interface TwoPropZTestInput {
  successes1: number
  n1: number
  successes2: number
  n2: number
  alternative?: AlternativeHypothesis
  alpha?: number
}

export interface PowerAnalysisInput {
  effectSize: number
  alpha?: number
  power?: number
  sampleSize?: number
  testType?: 'one-sample' | 'two-sample'
}

export interface PowerAnalysisResult {
  power: number
  sampleSize: number
  effectSize: number
  alpha: number
  beta: number
}

export interface HypothesisTestPreset {
  id: string
  name: string
  description: string
  testType: TestType
  scenario: string
  // Input data varies by test type
  data: Record<string, number>
}

// ============================================================================
// Constants
// ============================================================================

const _SQRT_2 = Math.sqrt(2)
const _SQRT_2_PI = Math.sqrt(2 * Math.PI)

// ============================================================================
// T-Distribution Functions
// ============================================================================

/**
 * T-distribution PDF.
 * f(t; ν) = Γ((ν+1)/2) / (√(νπ) Γ(ν/2)) * (1 + t²/ν)^(-(ν+1)/2)
 *
 * Uses the gamma function relationship for computation.
 * @param t - t statistic value
 * @param df - degrees of freedom
 */
export function tDistributionPdf(t: number, df: number): number {
  if (df <= 0) {
    throw new Error('Degrees of freedom must be positive')
  }

  // Use log-gamma for numerical stability
  const logCoeff =
    logGamma((df + 1) / 2) - logGamma(df / 2) - 0.5 * Math.log(df * Math.PI)
  const logBody = (-(df + 1) / 2) * Math.log(1 + (t * t) / df)

  return Math.exp(logCoeff + logBody)
}

/**
 * T-distribution CDF using numerical integration with Simpson's rule.
 * P(T ≤ t) for a t-distribution with given degrees of freedom.
 *
 * @param t - t statistic value
 * @param df - degrees of freedom
 */
export function tDistributionCdf(t: number, df: number): number {
  if (df <= 0) {
    throw new Error('Degrees of freedom must be positive')
  }

  // For very large df, t-distribution approaches standard normal
  if (df > 1000) {
    return standardNormalCdf(t)
  }

  // Use regularized incomplete beta function
  // P(T ≤ t) = 1 - 0.5 * I_{x}(df/2, 1/2) where x = df/(df + t²)
  // Or P(T ≤ t) = 0.5 + 0.5 * sign(t) * (1 - I_{x}(df/2, 1/2)) where x = df/(df + t²)
  const x = df / (df + t * t)
  const p = 0.5 * regularizedIncompleteBeta(x, df / 2, 0.5)

  if (t >= 0) {
    return 1 - p
  } else {
    return p
  }
}

/**
 * T-distribution quantile (inverse CDF).
 * Uses Newton-Raphson iteration.
 *
 * @param p - probability (0 < p < 1)
 * @param df - degrees of freedom
 */
export function tDistributionQuantile(p: number, df: number): number {
  if (p <= 0 || p >= 1) {
    throw new Error('Probability must be between 0 and 1')
  }
  if (df <= 0) {
    throw new Error('Degrees of freedom must be positive')
  }

  // For large df, use normal approximation
  if (df > 1000) {
    return standardNormalQuantile(p)
  }

  // Initial guess using normal approximation with correction
  let t = standardNormalQuantile(p)

  // Cornish-Fisher expansion for better initial guess
  const z = t
  const z2 = z * z
  const z3 = z2 * z
  const z5 = z3 * z2
  t = z + (z3 + z) / (4 * df) + (5 * z5 + 16 * z3 + 3 * z) / (96 * df * df)

  // Newton-Raphson refinement
  for (let i = 0; i < 10; i++) {
    const cdf = tDistributionCdf(t, df)
    const pdf = tDistributionPdf(t, df)

    if (Math.abs(pdf) < 1e-15) break

    const delta = (cdf - p) / pdf
    t -= delta

    if (Math.abs(delta) < 1e-10) break
  }

  return t
}

/**
 * T critical value for a given alpha and df.
 * For two-tailed test, returns the positive critical value.
 *
 * @param df - degrees of freedom
 * @param alpha - significance level (default: 0.05)
 * @param twoTailed - whether to use two-tailed test (default: true)
 */
export function tCriticalValue(
  df: number,
  alpha: number = 0.05,
  twoTailed: boolean = true
): number {
  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Alpha must be between 0 and 1')
  }
  if (df <= 0) {
    throw new Error('Degrees of freedom must be positive')
  }

  const p = twoTailed ? 1 - alpha / 2 : 1 - alpha
  return tDistributionQuantile(p, df)
}

// ============================================================================
// Log Gamma and Beta Functions
// ============================================================================

/**
 * Log gamma function using Lanczos approximation.
 * More numerically stable than computing gamma directly.
 */
export function logGamma(x: number): number {
  if (x <= 0 && Number.isInteger(x)) {
    return Infinity
  }

  // Lanczos approximation coefficients
  const g = 7
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ]

  if (x < 0.5) {
    // Reflection formula
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x)
  }

  x -= 1
  let a = c[0]!
  const t = x + g + 0.5

  for (let i = 1; i < g + 2; i++) {
    a += c[i]! / (x + i)
  }

  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a)
}

/**
 * Regularized incomplete beta function I_x(a, b).
 * Uses continued fraction expansion.
 */
export function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (x < 0 || x > 1) {
    throw new Error('x must be between 0 and 1')
  }
  if (a <= 0 || b <= 0) {
    throw new Error('a and b must be positive')
  }

  if (x === 0) return 0
  if (x === 1) return 1

  // Use symmetry for numerical stability
  if (x > (a + 1) / (a + b + 2)) {
    return 1 - regularizedIncompleteBeta(1 - x, b, a)
  }

  // Continued fraction using Lentz's method
  const maxIterations = 200
  const epsilon = 1e-15

  const qab = a + b
  const qap = a + 1
  const qam = a - 1

  let c = 1
  let d = 1 - (qab * x) / qap
  if (Math.abs(d) < epsilon) d = epsilon
  d = 1 / d
  let h = d

  for (let m = 1; m <= maxIterations; m++) {
    const m2 = 2 * m

    // Even step
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < epsilon) d = epsilon
    c = 1 + aa / c
    if (Math.abs(c) < epsilon) c = epsilon
    d = 1 / d
    h *= d * c

    // Odd step
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2))
    d = 1 + aa * d
    if (Math.abs(d) < epsilon) d = epsilon
    c = 1 + aa / c
    if (Math.abs(c) < epsilon) c = epsilon
    d = 1 / d
    const delta = d * c
    h *= delta

    if (Math.abs(delta - 1) < epsilon) break
  }

  // Multiply by the beta function terms
  const logBeta = logGamma(a) + logGamma(b) - logGamma(a + b)
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - logBeta) / a

  return front * h
}

// ============================================================================
// One-Sample T-Test
// ============================================================================

/**
 * One-sample t-test.
 * Tests whether a sample mean differs significantly from a hypothesized population mean.
 *
 * t = (x̄ - μ₀) / (s / √n)
 *
 * Use case: "Is our new feature's average load time different from 3 seconds?"
 */
export function oneSampleTTest(input: OneSampleTTestInput): TTestResult {
  const {
    sampleMean,
    sampleStdDev,
    sampleSize,
    hypothesizedMean,
    alternative = 'two-sided',
    alpha = 0.05,
  } = input

  if (sampleSize < 2) {
    throw new Error('Sample size must be at least 2')
  }
  if (sampleStdDev < 0) {
    throw new Error('Standard deviation must be non-negative')
  }
  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Alpha must be between 0 and 1')
  }

  const n = sampleSize
  const df = n - 1
  const standardError = sampleStdDev / Math.sqrt(n)

  // Handle zero standard deviation
  if (standardError === 0) {
    const tStatistic = sampleMean === hypothesizedMean ? 0 : sampleMean > hypothesizedMean ? Infinity : -Infinity
    return {
      testType: 'one-sample-t',
      tStatistic,
      degreesOfFreedom: df,
      pValue: sampleMean === hypothesizedMean ? 1 : 0,
      alternative,
      confidenceInterval: { lower: sampleMean, upper: sampleMean },
      confidenceLevel: 1 - alpha,
      effectSize: 0,
      effectSizeInterpretation: 'negligible',
      rejectNull: sampleMean !== hypothesizedMean,
      alpha,
    }
  }

  // Calculate t-statistic
  const tStatistic = (sampleMean - hypothesizedMean) / standardError

  // Calculate p-value based on alternative hypothesis
  let pValue: number
  switch (alternative) {
    case 'two-sided':
      pValue = 2 * (1 - tDistributionCdf(Math.abs(tStatistic), df))
      break
    case 'less':
      pValue = tDistributionCdf(tStatistic, df)
      break
    case 'greater':
      pValue = 1 - tDistributionCdf(tStatistic, df)
      break
  }

  // Ensure p-value is in valid range
  pValue = Math.max(0, Math.min(1, pValue))

  // Calculate confidence interval
  const tCrit = tCriticalValue(df, alpha, true)
  const marginOfError = tCrit * standardError
  const confidenceInterval = {
    lower: sampleMean - marginOfError,
    upper: sampleMean + marginOfError,
  }

  // Calculate effect size (Cohen's d)
  const effectSize = cohensD(sampleMean, hypothesizedMean, sampleStdDev)
  const effectSizeInterpretation = interpretCohensD(Math.abs(effectSize))

  return {
    testType: 'one-sample-t',
    tStatistic,
    degreesOfFreedom: df,
    pValue,
    alternative,
    confidenceInterval,
    confidenceLevel: 1 - alpha,
    effectSize,
    effectSizeInterpretation,
    rejectNull: pValue < alpha,
    alpha,
  }
}

// ============================================================================
// Two-Sample T-Test (Welch's)
// ============================================================================

/**
 * Two-sample t-test using Welch's method.
 * Tests whether two sample means differ significantly.
 * Does NOT assume equal variances (Welch's correction).
 *
 * t = (x̄₁ - x̄₂) / √(s₁²/n₁ + s₂²/n₂)
 *
 * Use case: "Is the A/B test treatment group different from control?"
 */
export function twoSampleTTest(input: TwoSampleTTestInput): TTestResult {
  const {
    mean1,
    stdDev1,
    n1,
    mean2,
    stdDev2,
    n2,
    alternative = 'two-sided',
    alpha = 0.05,
  } = input

  if (n1 < 2 || n2 < 2) {
    throw new Error('Both sample sizes must be at least 2')
  }
  if (stdDev1 < 0 || stdDev2 < 0) {
    throw new Error('Standard deviations must be non-negative')
  }
  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Alpha must be between 0 and 1')
  }

  const var1 = stdDev1 * stdDev1
  const var2 = stdDev2 * stdDev2

  // Standard error of the difference
  const standardError = Math.sqrt(var1 / n1 + var2 / n2)

  // Handle zero standard error
  if (standardError === 0) {
    const tStatistic = mean1 === mean2 ? 0 : mean1 > mean2 ? Infinity : -Infinity
    return {
      testType: 'two-sample-t',
      tStatistic,
      degreesOfFreedom: n1 + n2 - 2,
      pValue: mean1 === mean2 ? 1 : 0,
      alternative,
      confidenceInterval: { lower: mean1 - mean2, upper: mean1 - mean2 },
      confidenceLevel: 1 - alpha,
      effectSize: 0,
      effectSizeInterpretation: 'negligible',
      rejectNull: mean1 !== mean2,
      alpha,
    }
  }

  // Calculate t-statistic
  const tStatistic = (mean1 - mean2) / standardError

  // Welch-Satterthwaite degrees of freedom
  const numerator = Math.pow(var1 / n1 + var2 / n2, 2)
  const denominator =
    Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1)
  const df = numerator / denominator

  // Calculate p-value based on alternative hypothesis
  let pValue: number
  switch (alternative) {
    case 'two-sided':
      pValue = 2 * (1 - tDistributionCdf(Math.abs(tStatistic), df))
      break
    case 'less':
      pValue = tDistributionCdf(tStatistic, df)
      break
    case 'greater':
      pValue = 1 - tDistributionCdf(tStatistic, df)
      break
  }

  // Ensure p-value is in valid range
  pValue = Math.max(0, Math.min(1, pValue))

  // Calculate confidence interval for the difference
  const tCrit = tCriticalValue(df, alpha, true)
  const marginOfError = tCrit * standardError
  const diff = mean1 - mean2
  const confidenceInterval = {
    lower: diff - marginOfError,
    upper: diff + marginOfError,
  }

  // Calculate effect size (Cohen's d with pooled SD)
  const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2)
  const pooledStdDev = Math.sqrt(pooledVar)
  const effectSize = pooledStdDev > 0 ? (mean1 - mean2) / pooledStdDev : 0
  const effectSizeInterpretation = interpretCohensD(Math.abs(effectSize))

  return {
    testType: 'two-sample-t',
    tStatistic,
    degreesOfFreedom: df,
    pValue,
    alternative,
    confidenceInterval,
    confidenceLevel: 1 - alpha,
    effectSize,
    effectSizeInterpretation,
    rejectNull: pValue < alpha,
    alpha,
  }
}

// ============================================================================
// One-Proportion Z-Test
// ============================================================================

/**
 * One-proportion z-test.
 * Tests whether a sample proportion differs significantly from a hypothesized proportion.
 *
 * z = (p̂ - p₀) / √(p₀(1-p₀)/n)
 *
 * Use case: "Is our conversion rate different from the industry average of 3%?"
 */
export function onePropZTest(input: OnePropZTestInput): ZTestResult {
  const {
    successes,
    sampleSize,
    hypothesizedProportion,
    alternative = 'two-sided',
    alpha = 0.05,
  } = input

  if (sampleSize < 1) {
    throw new Error('Sample size must be at least 1')
  }
  if (successes < 0 || successes > sampleSize) {
    throw new Error('Successes must be between 0 and sample size')
  }
  if (hypothesizedProportion <= 0 || hypothesizedProportion >= 1) {
    throw new Error('Hypothesized proportion must be between 0 and 1')
  }
  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Alpha must be between 0 and 1')
  }

  const n = sampleSize
  const p0 = hypothesizedProportion
  const pHat = successes / n

  // Standard error under null hypothesis
  const standardError = Math.sqrt((p0 * (1 - p0)) / n)

  // Handle edge case
  if (standardError === 0) {
    return {
      testType: 'one-prop-z',
      zStatistic: 0,
      pValue: 1,
      alternative,
      confidenceInterval: { lower: pHat, upper: pHat },
      confidenceLevel: 1 - alpha,
      effectSize: 0,
      effectSizeInterpretation: 'negligible',
      rejectNull: false,
      alpha,
    }
  }

  // Calculate z-statistic
  const zStatistic = (pHat - p0) / standardError

  // Calculate p-value based on alternative hypothesis
  let pValue: number
  switch (alternative) {
    case 'two-sided':
      pValue = 2 * (1 - standardNormalCdf(Math.abs(zStatistic)))
      break
    case 'less':
      pValue = standardNormalCdf(zStatistic)
      break
    case 'greater':
      pValue = 1 - standardNormalCdf(zStatistic)
      break
  }

  // Ensure p-value is in valid range
  pValue = Math.max(0, Math.min(1, pValue))

  // Calculate confidence interval (using sample proportion SE)
  const seSample = Math.sqrt((pHat * (1 - pHat)) / n)
  const zCrit = -standardNormalQuantile(alpha / 2)
  const marginOfError = zCrit * seSample
  const confidenceInterval = {
    lower: Math.max(0, pHat - marginOfError),
    upper: Math.min(1, pHat + marginOfError),
  }

  // Calculate effect size (Cohen's h)
  const effectSize = cohensH(pHat, p0)
  const effectSizeInterpretation = interpretCohensH(Math.abs(effectSize))

  return {
    testType: 'one-prop-z',
    zStatistic,
    pValue,
    alternative,
    confidenceInterval,
    confidenceLevel: 1 - alpha,
    effectSize,
    effectSizeInterpretation,
    rejectNull: pValue < alpha,
    alpha,
  }
}

// ============================================================================
// Two-Proportion Z-Test
// ============================================================================

/**
 * Two-proportion z-test.
 * Tests whether two sample proportions differ significantly.
 *
 * z = (p̂₁ - p̂₂) / √(p̄(1-p̄)(1/n₁ + 1/n₂))
 *
 * Use case: "Is treatment group conversion rate different from control?"
 */
export function twoPropZTest(input: TwoPropZTestInput): ZTestResult {
  const {
    successes1,
    n1,
    successes2,
    n2,
    alternative = 'two-sided',
    alpha = 0.05,
  } = input

  if (n1 < 1 || n2 < 1) {
    throw new Error('Both sample sizes must be at least 1')
  }
  if (successes1 < 0 || successes1 > n1) {
    throw new Error('Successes1 must be between 0 and n1')
  }
  if (successes2 < 0 || successes2 > n2) {
    throw new Error('Successes2 must be between 0 and n2')
  }
  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Alpha must be between 0 and 1')
  }

  const p1 = successes1 / n1
  const p2 = successes2 / n2

  // Pooled proportion under null hypothesis
  const pPooled = (successes1 + successes2) / (n1 + n2)

  // Standard error under null (pooled)
  const standardError = Math.sqrt(pPooled * (1 - pPooled) * (1 / n1 + 1 / n2))

  // Handle edge case
  if (standardError === 0) {
    return {
      testType: 'two-prop-z',
      zStatistic: 0,
      pValue: 1,
      alternative,
      confidenceInterval: { lower: p1 - p2, upper: p1 - p2 },
      confidenceLevel: 1 - alpha,
      effectSize: 0,
      effectSizeInterpretation: 'negligible',
      rejectNull: false,
      alpha,
    }
  }

  // Calculate z-statistic
  const zStatistic = (p1 - p2) / standardError

  // Calculate p-value based on alternative hypothesis
  let pValue: number
  switch (alternative) {
    case 'two-sided':
      pValue = 2 * (1 - standardNormalCdf(Math.abs(zStatistic)))
      break
    case 'less':
      pValue = standardNormalCdf(zStatistic)
      break
    case 'greater':
      pValue = 1 - standardNormalCdf(zStatistic)
      break
  }

  // Ensure p-value is in valid range
  pValue = Math.max(0, Math.min(1, pValue))

  // Calculate confidence interval for difference (unpooled SE)
  const seUnpooled = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2)
  const zCrit = -standardNormalQuantile(alpha / 2)
  const marginOfError = zCrit * seUnpooled
  const diff = p1 - p2
  const confidenceInterval = {
    lower: Math.max(-1, diff - marginOfError),
    upper: Math.min(1, diff + marginOfError),
  }

  // Calculate effect size (Cohen's h)
  const effectSize = cohensH(p1, p2)
  const effectSizeInterpretation = interpretCohensH(Math.abs(effectSize))

  return {
    testType: 'two-prop-z',
    zStatistic,
    pValue,
    alternative,
    confidenceInterval,
    confidenceLevel: 1 - alpha,
    effectSize,
    effectSizeInterpretation,
    rejectNull: pValue < alpha,
    alpha,
  }
}

// ============================================================================
// Effect Size Functions
// ============================================================================

/**
 * Cohen's d for comparing a mean to a value.
 * d = (x̄ - μ) / s
 *
 * Interpretation:
 * - |d| < 0.2: negligible
 * - 0.2 ≤ |d| < 0.5: small
 * - 0.5 ≤ |d| < 0.8: medium
 * - |d| ≥ 0.8: large
 */
export function cohensD(mean: number, comparisonValue: number, stdDev: number): number {
  if (stdDev <= 0) return 0
  return (mean - comparisonValue) / stdDev
}

/**
 * Cohen's d for two groups with pooled standard deviation.
 */
export function cohensDTwoGroups(
  mean1: number,
  stdDev1: number,
  n1: number,
  mean2: number,
  stdDev2: number,
  n2: number
): number {
  const pooledVar =
    ((n1 - 1) * stdDev1 * stdDev1 + (n2 - 1) * stdDev2 * stdDev2) / (n1 + n2 - 2)
  const pooledStdDev = Math.sqrt(pooledVar)

  if (pooledStdDev <= 0) return 0
  return (mean1 - mean2) / pooledStdDev
}

/**
 * Interpret Cohen's d effect size.
 */
export function interpretCohensD(d: number): string {
  const absD = Math.abs(d)
  if (absD < 0.2) return 'negligible'
  if (absD < 0.5) return 'small'
  if (absD < 0.8) return 'medium'
  return 'large'
}

/**
 * Cohen's h for comparing proportions.
 * h = 2 * (arcsin(√p₁) - arcsin(√p₂))
 *
 * Interpretation same as Cohen's d.
 */
export function cohensH(p1: number, p2: number): number {
  if (p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1) {
    throw new Error('Proportions must be between 0 and 1')
  }

  const phi1 = 2 * Math.asin(Math.sqrt(p1))
  const phi2 = 2 * Math.asin(Math.sqrt(p2))

  return phi1 - phi2
}

/**
 * Interpret Cohen's h effect size.
 */
export function interpretCohensH(h: number): string {
  const absH = Math.abs(h)
  if (absH < 0.2) return 'negligible'
  if (absH < 0.5) return 'small'
  if (absH < 0.8) return 'medium'
  return 'large'
}

// ============================================================================
// Power Analysis
// ============================================================================

/**
 * Calculate statistical power for a one-sample or two-sample t-test.
 *
 * Power = P(reject H₀ | H₁ is true)
 *       = P(|T| > t_crit | δ = d * √n)
 *
 * @param effectSize - Cohen's d
 * @param sampleSize - total sample size (per group for two-sample)
 * @param alpha - significance level
 * @param testType - one-sample or two-sample
 */
export function calculatePower(
  effectSize: number,
  sampleSize: number,
  alpha: number = 0.05,
  testType: 'one-sample' | 'two-sample' = 'two-sample'
): number {
  if (sampleSize < 2) return 0
  if (effectSize === 0) return alpha // Power at null = alpha

  const n = sampleSize
  let noncentrality: number
  let df: number

  if (testType === 'one-sample') {
    // One-sample: δ = d * √n
    noncentrality = effectSize * Math.sqrt(n)
    df = n - 1
  } else {
    // Two-sample: δ = d * √(n/2) (n per group)
    // Total n divided between two groups
    noncentrality = effectSize * Math.sqrt(n / 2)
    df = 2 * n - 2
  }

  // Critical value for two-tailed test
  const tCrit = tCriticalValue(df, alpha, true)

  // Power = P(T > t_crit | noncentrality) + P(T < -t_crit | noncentrality)
  // For noncentral t-distribution, use approximation
  const power = noncentralTDistributionPower(tCrit, df, noncentrality)

  return Math.max(0, Math.min(1, power))
}

/**
 * Calculate approximate power using noncentral t-distribution.
 * Uses the normal approximation for the noncentral t.
 */
function noncentralTDistributionPower(
  tCrit: number,
  df: number,
  noncentrality: number
): number {
  // Approximate the noncentral t as shifted central t
  // P(T > t_crit | δ) ≈ P(T > t_crit - δ | 0)
  // This is a simplification; more accurate methods exist

  // For large df, use normal approximation
  if (df > 30) {
    // Power ≈ Φ(|δ| - z_α/2) + Φ(-|δ| - z_α/2)
    const zCrit = -standardNormalQuantile(0.025) // ~1.96 for α=0.05
    const upper = standardNormalCdf(Math.abs(noncentrality) - zCrit)
    const lower = standardNormalCdf(-Math.abs(noncentrality) - zCrit)
    return upper + lower
  }

  // For smaller df, use t-distribution approximation
  const upper = 1 - tDistributionCdf(tCrit - noncentrality, df)
  const lower = tDistributionCdf(-tCrit - noncentrality, df)

  return upper + lower
}

/**
 * Calculate required sample size to achieve desired power.
 *
 * @param effectSize - Cohen's d
 * @param power - desired power (default: 0.8)
 * @param alpha - significance level (default: 0.05)
 * @param testType - one-sample or two-sample
 * @returns sample size per group (for two-sample, multiply by 2 for total)
 */
export function sampleSizeForPower(
  effectSize: number,
  power: number = 0.8,
  alpha: number = 0.05,
  testType: 'one-sample' | 'two-sample' = 'two-sample'
): number {
  if (effectSize === 0) {
    throw new Error('Effect size must be non-zero')
  }
  if (power <= 0 || power >= 1) {
    throw new Error('Power must be between 0 and 1')
  }
  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Alpha must be between 0 and 1')
  }

  // Use normal approximation formula as starting point
  // n ≈ 2 * ((z_α/2 + z_β) / d)² for two-sample
  // n ≈ ((z_α/2 + z_β) / d)² for one-sample

  const zAlpha = -standardNormalQuantile(alpha / 2)
  const zBeta = -standardNormalQuantile(1 - power)

  let n: number
  if (testType === 'one-sample') {
    n = Math.pow((zAlpha + zBeta) / effectSize, 2)
  } else {
    n = 2 * Math.pow((zAlpha + zBeta) / effectSize, 2)
  }

  // Binary search to refine
  let low = Math.max(2, Math.floor(n * 0.5))
  let high = Math.ceil(n * 2)

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const achievedPower = calculatePower(effectSize, mid, alpha, testType)

    if (achievedPower < power) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  return Math.max(2, low)
}

/**
 * Calculate required sample size for proportion z-test.
 *
 * @param p1 - proportion in group 1
 * @param p2 - proportion in group 2 (or hypothesized for one-sample)
 * @param power - desired power
 * @param alpha - significance level
 */
export function sampleSizeForProportions(
  p1: number,
  p2: number,
  power: number = 0.8,
  alpha: number = 0.05
): number {
  if (p1 <= 0 || p1 >= 1 || p2 <= 0 || p2 >= 1) {
    throw new Error('Proportions must be between 0 and 1')
  }
  if (p1 === p2) {
    throw new Error('Proportions must be different')
  }

  const zAlpha = -standardNormalQuantile(alpha / 2)
  const zBeta = -standardNormalQuantile(1 - power)

  const pBar = (p1 + p2) / 2
  const diff = Math.abs(p1 - p2)

  // Standard formula for two-proportion test
  const n =
    Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2) /
    (diff * diff)

  return Math.ceil(n)
}

/**
 * Generate power curve data points.
 *
 * @param effectSize - Cohen's d
 * @param alpha - significance level
 * @param testType - one-sample or two-sample
 * @param maxN - maximum sample size to calculate
 */
export function generatePowerCurve(
  effectSize: number,
  alpha: number = 0.05,
  testType: 'one-sample' | 'two-sample' = 'two-sample',
  maxN: number = 200
): { n: number; power: number }[] {
  const points: { n: number; power: number }[] = []

  for (let n = 2; n <= maxN; n += Math.max(1, Math.floor(n / 20))) {
    points.push({
      n,
      power: calculatePower(effectSize, n, alpha, testType),
    })
  }

  return points
}

// ============================================================================
// Presets
// ============================================================================

export const hypothesisTestPresets: HypothesisTestPreset[] = [
  {
    id: 'ab-test',
    name: 'A/B Test',
    description: 'Compare conversion rates between control and treatment',
    testType: 'two-prop-z',
    scenario: 'Website A/B test: Is the new design better?',
    data: {
      successes1: 45,
      n1: 1000,
      successes2: 52,
      n2: 1000,
    },
  },
  {
    id: 'quality-control',
    name: 'Quality Control',
    description: 'Test if defect rate exceeds acceptable threshold',
    testType: 'one-prop-z',
    scenario: 'Manufacturing QC: Is defect rate above 2%?',
    data: {
      successes: 28,
      sampleSize: 1000,
      hypothesizedProportion: 0.02,
    },
  },
  {
    id: 'drug-trial',
    name: 'Drug Trial',
    description: 'Compare treatment effect between drug and placebo',
    testType: 'two-sample-t',
    scenario: 'Clinical trial: Does the drug reduce symptoms?',
    data: {
      mean1: 4.2,
      stdDev1: 1.5,
      n1: 50,
      mean2: 5.8,
      stdDev2: 1.7,
      n2: 50,
    },
  },
  {
    id: 'benchmark',
    name: 'Performance Benchmark',
    description: 'Test if new algorithm is faster than baseline',
    testType: 'one-sample-t',
    scenario: 'Algorithm optimization: Is response time under 100ms?',
    data: {
      sampleMean: 95,
      sampleStdDev: 15,
      sampleSize: 30,
      hypothesizedMean: 100,
    },
  },
  {
    id: 'survey',
    name: 'Survey Analysis',
    description: 'Compare satisfaction scores between groups',
    testType: 'two-sample-t',
    scenario: 'Customer satisfaction: Premium vs Free users',
    data: {
      mean1: 4.3,
      stdDev1: 0.8,
      n1: 100,
      mean2: 3.9,
      stdDev2: 1.0,
      n2: 150,
    },
  },
]

/**
 * Get a hypothesis test preset by ID.
 */
export function getHypothesisTestPresetById(id: string): HypothesisTestPreset | undefined {
  return hypothesisTestPresets.find((p) => p.id === id)
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format p-value for display.
 * Shows scientific notation for very small values.
 */
export function formatPValue(pValue: number): string {
  if (pValue < 0.0001) {
    return '< 0.0001'
  }
  if (pValue < 0.001) {
    return pValue.toExponential(2)
  }
  return pValue.toFixed(4)
}

/**
 * Get significance stars based on p-value.
 */
export function getSignificanceStars(pValue: number): string {
  if (pValue < 0.001) return '***'
  if (pValue < 0.01) return '**'
  if (pValue < 0.05) return '*'
  return ''
}

/**
 * Describe the test result in plain language.
 */
export function describeTestResult(
  result: TTestResult | ZTestResult,
  context?: string
): string {
  const significanceText = result.rejectNull
    ? 'statistically significant'
    : 'not statistically significant'

  const effectText = result.effectSize !== 0
    ? ` with a ${result.effectSizeInterpretation} effect size (${result.effectSize.toFixed(2)})`
    : ''

  let _directionText = ''
  if (result.alternative === 'two-sided') {
    _directionText = result.rejectNull ? 'significantly different from' : 'not significantly different from'
  } else if (result.alternative === 'greater') {
    _directionText = result.rejectNull ? 'significantly greater than' : 'not significantly greater than'
  } else {
    _directionText = result.rejectNull ? 'significantly less than' : 'not significantly less than'
  }

  const pValueText = formatPValue(result.pValue)
  const contextText = context ? ` ${context}` : ''

  return `The result is ${significanceText} (p = ${pValueText})${effectText}.${contextText}`
}

/**
 * Check if test assumptions are reasonably met.
 */
export function checkTestAssumptions(
  testType: TestType,
  data: Record<string, number>
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = []

  switch (testType) {
    case 'one-sample-t':
    case 'two-sample-t':
      // Check sample size (CLT typically needs n >= 30)
      if ((data.sampleSize ?? data.n1 ?? 0) < 30) {
        warnings.push('Sample size < 30: t-test may be less reliable. Ensure data is approximately normal.')
      }
      break

    case 'one-prop-z': {
      // Check np >= 10 and n(1-p) >= 10
      const sampleSize = data.sampleSize ?? 0
      const hypothesizedProportion = data.hypothesizedProportion ?? 0.5
      const np = sampleSize * hypothesizedProportion
      const nq = sampleSize * (1 - hypothesizedProportion)
      if (np < 10 || nq < 10) {
        warnings.push('Normal approximation may be poor. Recommend np ≥ 10 and n(1-p) ≥ 10.')
      }
      break
    }

    case 'two-prop-z': {
      // Check n1p1, n1(1-p1), n2p2, n2(1-p2) >= 5
      const n1 = data.n1 ?? 0
      const n2 = data.n2 ?? 0
      const successes1 = data.successes1 ?? 0
      const successes2 = data.successes2 ?? 0
      const p1 = n1 > 0 ? successes1 / n1 : 0
      const p2 = n2 > 0 ? successes2 / n2 : 0
      if (
        n1 * p1 < 5 ||
        n1 * (1 - p1) < 5 ||
        n2 * p2 < 5 ||
        n2 * (1 - p2) < 5
      ) {
        warnings.push('Some expected counts < 5. Normal approximation may be poor.')
      }
      break
    }
  }

  return { valid: warnings.length === 0, warnings }
}
