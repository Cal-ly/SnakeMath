/**
 * Probability distribution utility functions.
 * Includes PDF/PMF, CDF, quantile, and sampling functions for common distributions.
 *
 * Supported distributions:
 * - Normal (continuous): μ, σ parameters
 * - Binomial (discrete): n, p parameters
 * - Poisson (discrete): λ parameter
 * - Exponential (continuous): λ parameter
 * - Uniform (continuous): a, b parameters
 */

// ============================================================================
// Types
// ============================================================================

export type DistributionType = 'normal' | 'binomial' | 'poisson' | 'exponential' | 'uniform'

export interface NormalParams {
  mu: number
  sigma: number
}

export interface BinomialParams {
  n: number
  p: number
}

export interface PoissonParams {
  lambda: number
}

export interface ExponentialParams {
  lambda: number
}

export interface UniformParams {
  a: number
  b: number
}

export type DistributionParams =
  | { type: 'normal'; params: NormalParams }
  | { type: 'binomial'; params: BinomialParams }
  | { type: 'poisson'; params: PoissonParams }
  | { type: 'exponential'; params: ExponentialParams }
  | { type: 'uniform'; params: UniformParams }

export interface DistributionStats {
  mean: number
  variance: number
  stdDev: number
  mode: number | number[] | null
  skewness: number
}

export interface HistogramBin {
  start: number
  end: number
  count: number
  density: number
}

export interface DistributionPreset {
  id: string
  name: string
  description: string
  distribution: DistributionParams
  useCase: string
}

// ============================================================================
// Mathematical Constants and Helpers
// ============================================================================

const SQRT_2 = Math.sqrt(2)
const SQRT_2_PI = Math.sqrt(2 * Math.PI)

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate factorial n!
 * Uses iterative approach to avoid stack overflow.
 * @throws Error if n < 0 or n is not an integer
 */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial requires non-negative integer')
  }
  if (n === 0 || n === 1) return 1
  if (n > 170) return Infinity // Overflow

  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

/**
 * Calculate log factorial ln(n!)
 * Uses Stirling's approximation for large n.
 */
export function logFactorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Log factorial requires non-negative integer')
  }
  if (n === 0 || n === 1) return 0

  // For small n, compute directly
  if (n <= 20) {
    return Math.log(factorial(n))
  }

  // Stirling's approximation for large n
  // ln(n!) ≈ n*ln(n) - n + 0.5*ln(2πn)
  return n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n)
}

/**
 * Calculate binomial coefficient C(n, k) = n! / (k!(n-k)!)
 * Uses multiplicative formula to avoid overflow.
 */
export function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n || !Number.isInteger(n) || !Number.isInteger(k)) {
    return 0
  }
  if (k === 0 || k === n) return 1

  // Use symmetry: C(n,k) = C(n, n-k)
  if (k > n - k) {
    k = n - k
  }

  // Multiplicative formula to avoid overflow
  let result = 1
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1)
  }
  return Math.round(result)
}

/**
 * Calculate log binomial coefficient ln(C(n, k))
 * More numerically stable for large n.
 */
export function logBinomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n || !Number.isInteger(n) || !Number.isInteger(k)) {
    return -Infinity
  }
  if (k === 0 || k === n) return 0

  return logFactorial(n) - logFactorial(k) - logFactorial(n - k)
}

/**
 * Error function erf(x).
 * Uses Horner form of the rational approximation (Abramowitz and Stegun).
 */
export function erf(x: number): number {
  // Constants for approximation
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  // A&S formula 7.1.26
  const t = 1 / (1 + p * x)
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}

// ============================================================================
// Standard Normal Distribution (μ=0, σ=1)
// ============================================================================

/**
 * Standard normal PDF: φ(z) = (1/√(2π)) * exp(-z²/2)
 */
export function standardNormalPdf(z: number): number {
  return Math.exp(-0.5 * z * z) / SQRT_2_PI
}

/**
 * Standard normal CDF: Φ(z)
 * Uses error function: Φ(z) = 0.5 * (1 + erf(z/√2))
 */
export function standardNormalCdf(z: number): number {
  return 0.5 * (1 + erf(z / SQRT_2))
}

/**
 * Standard normal quantile (inverse CDF): Φ⁻¹(p)
 * Uses Abramowitz and Stegun approximation 26.2.23.
 * @param p Probability in (0, 1)
 */
export function standardNormalQuantile(p: number): number {
  if (p <= 0) return -Infinity
  if (p >= 1) return Infinity

  // Constants for approximation
  const a0 = 2.515517
  const a1 = 0.802853
  const a2 = 0.010328
  const b1 = 1.432788
  const b2 = 0.189269
  const b3 = 0.001308

  const sign = p < 0.5 ? -1 : 1
  const q = p < 0.5 ? p : 1 - p

  // Rational approximation
  const t = Math.sqrt(-2 * Math.log(q))
  const c = t - (a0 + a1 * t + a2 * t * t) / (1 + b1 * t + b2 * t * t + b3 * t * t * t)

  return sign * c
}

// ============================================================================
// Normal Distribution
// ============================================================================

/**
 * Normal PDF: f(x; μ, σ) = (1/(σ√(2π))) * exp(-(x-μ)²/(2σ²))
 */
export function normalPdf(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) {
    throw new Error('Normal distribution requires sigma > 0')
  }
  const z = (x - mu) / sigma
  return standardNormalPdf(z) / sigma
}

/**
 * Normal CDF: F(x; μ, σ) = Φ((x-μ)/σ)
 */
export function normalCdf(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) {
    throw new Error('Normal distribution requires sigma > 0')
  }
  const z = (x - mu) / sigma
  return standardNormalCdf(z)
}

/**
 * Normal quantile: F⁻¹(p; μ, σ) = μ + σ * Φ⁻¹(p)
 */
export function normalQuantile(p: number, mu: number, sigma: number): number {
  if (sigma <= 0) {
    throw new Error('Normal distribution requires sigma > 0')
  }
  return mu + sigma * standardNormalQuantile(p)
}

/**
 * Sample from normal distribution using Box-Muller transform.
 */
export function sampleNormal(mu: number, sigma: number): number {
  if (sigma <= 0) {
    throw new Error('Normal distribution requires sigma > 0')
  }
  // Box-Muller transform
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mu + sigma * z
}

// ============================================================================
// Binomial Distribution
// ============================================================================

/**
 * Binomial PMF: P(X = k) = C(n,k) * p^k * (1-p)^(n-k)
 * Uses log space for numerical stability.
 */
export function binomialPmf(k: number, n: number, p: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('Binomial distribution requires n >= 0 integer')
  }
  if (p < 0 || p > 1) {
    throw new Error('Binomial distribution requires 0 <= p <= 1')
  }
  if (!Number.isInteger(k) || k < 0 || k > n) {
    return 0
  }

  // Handle edge cases
  if (p === 0) return k === 0 ? 1 : 0
  if (p === 1) return k === n ? 1 : 0

  // Use log space for numerical stability
  const logProb = logBinomialCoefficient(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)
  return Math.exp(logProb)
}

/**
 * Binomial CDF: P(X <= k) = Σ_{i=0}^{k} P(X = i)
 */
export function binomialCdf(k: number, n: number, p: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('Binomial distribution requires n >= 0 integer')
  }
  if (p < 0 || p > 1) {
    throw new Error('Binomial distribution requires 0 <= p <= 1')
  }

  if (k < 0) return 0
  if (k >= n) return 1

  let sum = 0
  const kInt = Math.floor(k)
  for (let i = 0; i <= kInt; i++) {
    sum += binomialPmf(i, n, p)
  }
  return Math.min(1, sum) // Clamp to handle floating point errors
}

/**
 * Binomial quantile: smallest k such that P(X <= k) >= prob
 * Uses binary search.
 */
export function binomialQuantile(prob: number, n: number, p: number): number {
  if (prob <= 0) return 0
  if (prob >= 1) return n

  // Binary search for the quantile
  let low = 0
  let high = n

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (binomialCdf(mid, n, p) < prob) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  return low
}

/**
 * Sample from binomial distribution.
 * Uses direct simulation for small n, normal approximation for large n.
 */
export function sampleBinomial(n: number, p: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('Binomial distribution requires n >= 0 integer')
  }
  if (p < 0 || p > 1) {
    throw new Error('Binomial distribution requires 0 <= p <= 1')
  }

  // For small n, simulate directly
  if (n <= 100) {
    let successes = 0
    for (let i = 0; i < n; i++) {
      if (Math.random() < p) successes++
    }
    return successes
  }

  // For large n, use normal approximation
  const mean = n * p
  const stdDev = Math.sqrt(n * p * (1 - p))
  const result = Math.round(sampleNormal(mean, stdDev))
  // Clamp to valid range
  return Math.max(0, Math.min(n, result))
}

// ============================================================================
// Poisson Distribution
// ============================================================================

/**
 * Poisson PMF: P(X = k) = (λ^k * e^(-λ)) / k!
 * Uses log space for numerical stability.
 */
export function poissonPmf(k: number, lambda: number): number {
  if (lambda < 0) {
    throw new Error('Poisson distribution requires lambda >= 0')
  }
  if (!Number.isInteger(k) || k < 0) {
    return 0
  }

  // Handle edge case
  if (lambda === 0) return k === 0 ? 1 : 0

  // Use log space: log(P) = k*log(λ) - λ - log(k!)
  const logProb = k * Math.log(lambda) - lambda - logFactorial(k)
  return Math.exp(logProb)
}

/**
 * Poisson CDF: P(X <= k) = Σ_{i=0}^{k} P(X = i)
 */
export function poissonCdf(k: number, lambda: number): number {
  if (lambda < 0) {
    throw new Error('Poisson distribution requires lambda >= 0')
  }

  if (k < 0) return 0
  if (lambda === 0) return 1

  let sum = 0
  const kInt = Math.floor(k)
  for (let i = 0; i <= kInt; i++) {
    sum += poissonPmf(i, lambda)
  }
  return Math.min(1, sum)
}

/**
 * Poisson quantile: smallest k such that P(X <= k) >= prob
 */
export function poissonQuantile(prob: number, lambda: number): number {
  if (prob <= 0) return 0
  if (prob >= 1) return Infinity

  // Search iteratively
  let k = 0
  let cumProb = poissonPmf(0, lambda)

  while (cumProb < prob && k < 1000) {
    k++
    cumProb += poissonPmf(k, lambda)
  }

  return k
}

/**
 * Sample from Poisson distribution.
 * Uses Knuth's algorithm for small lambda, normal approximation for large lambda.
 */
export function samplePoisson(lambda: number): number {
  if (lambda < 0) {
    throw new Error('Poisson distribution requires lambda >= 0')
  }
  if (lambda === 0) return 0

  // For large lambda, use normal approximation
  if (lambda > 30) {
    const result = Math.round(sampleNormal(lambda, Math.sqrt(lambda)))
    return Math.max(0, result)
  }

  // Knuth's algorithm for small lambda
  const L = Math.exp(-lambda)
  let k = 0
  let p = 1

  do {
    k++
    p *= Math.random()
  } while (p > L)

  return k - 1
}

// ============================================================================
// Exponential Distribution
// ============================================================================

/**
 * Exponential PDF: f(x; λ) = λ * e^(-λx) for x >= 0
 */
export function exponentialPdf(x: number, lambda: number): number {
  if (lambda <= 0) {
    throw new Error('Exponential distribution requires lambda > 0')
  }
  if (x < 0) return 0
  return lambda * Math.exp(-lambda * x)
}

/**
 * Exponential CDF: F(x; λ) = 1 - e^(-λx) for x >= 0
 */
export function exponentialCdf(x: number, lambda: number): number {
  if (lambda <= 0) {
    throw new Error('Exponential distribution requires lambda > 0')
  }
  if (x < 0) return 0
  return 1 - Math.exp(-lambda * x)
}

/**
 * Exponential quantile: F⁻¹(p; λ) = -ln(1-p) / λ
 */
export function exponentialQuantile(p: number, lambda: number): number {
  if (lambda <= 0) {
    throw new Error('Exponential distribution requires lambda > 0')
  }
  if (p <= 0) return 0
  if (p >= 1) return Infinity
  return -Math.log(1 - p) / lambda
}

/**
 * Sample from exponential distribution using inverse transform.
 */
export function sampleExponential(lambda: number): number {
  if (lambda <= 0) {
    throw new Error('Exponential distribution requires lambda > 0')
  }
  return -Math.log(Math.random()) / lambda
}

// ============================================================================
// Uniform Distribution
// ============================================================================

/**
 * Uniform PDF: f(x; a, b) = 1/(b-a) for a <= x <= b
 */
export function uniformPdf(x: number, a: number, b: number): number {
  if (a >= b) {
    throw new Error('Uniform distribution requires a < b')
  }
  if (x < a || x > b) return 0
  return 1 / (b - a)
}

/**
 * Uniform CDF: F(x; a, b) = (x-a)/(b-a) for a <= x <= b
 */
export function uniformCdf(x: number, a: number, b: number): number {
  if (a >= b) {
    throw new Error('Uniform distribution requires a < b')
  }
  if (x < a) return 0
  if (x > b) return 1
  return (x - a) / (b - a)
}

/**
 * Uniform quantile: F⁻¹(p; a, b) = a + p*(b-a)
 */
export function uniformQuantile(p: number, a: number, b: number): number {
  if (a >= b) {
    throw new Error('Uniform distribution requires a < b')
  }
  if (p <= 0) return a
  if (p >= 1) return b
  return a + p * (b - a)
}

/**
 * Sample from uniform distribution.
 */
export function sampleUniform(a: number, b: number): number {
  if (a >= b) {
    throw new Error('Uniform distribution requires a < b')
  }
  return a + Math.random() * (b - a)
}

// ============================================================================
// Unified Interface Functions
// ============================================================================

/**
 * Get PDF/PMF value for any distribution type.
 */
export function getPdf(dist: DistributionParams, x: number): number {
  switch (dist.type) {
    case 'normal':
      return normalPdf(x, dist.params.mu, dist.params.sigma)
    case 'binomial':
      return binomialPmf(Math.round(x), dist.params.n, dist.params.p)
    case 'poisson':
      return poissonPmf(Math.round(x), dist.params.lambda)
    case 'exponential':
      return exponentialPdf(x, dist.params.lambda)
    case 'uniform':
      return uniformPdf(x, dist.params.a, dist.params.b)
  }
}

/**
 * Get CDF value for any distribution type.
 */
export function getCdf(dist: DistributionParams, x: number): number {
  switch (dist.type) {
    case 'normal':
      return normalCdf(x, dist.params.mu, dist.params.sigma)
    case 'binomial':
      return binomialCdf(x, dist.params.n, dist.params.p)
    case 'poisson':
      return poissonCdf(x, dist.params.lambda)
    case 'exponential':
      return exponentialCdf(x, dist.params.lambda)
    case 'uniform':
      return uniformCdf(x, dist.params.a, dist.params.b)
  }
}

/**
 * Get quantile value for any distribution type.
 */
export function getQuantile(dist: DistributionParams, p: number): number {
  switch (dist.type) {
    case 'normal':
      return normalQuantile(p, dist.params.mu, dist.params.sigma)
    case 'binomial':
      return binomialQuantile(p, dist.params.n, dist.params.p)
    case 'poisson':
      return poissonQuantile(p, dist.params.lambda)
    case 'exponential':
      return exponentialQuantile(p, dist.params.lambda)
    case 'uniform':
      return uniformQuantile(p, dist.params.a, dist.params.b)
  }
}

/**
 * Sample a single value from any distribution type.
 */
export function sample(dist: DistributionParams): number {
  switch (dist.type) {
    case 'normal':
      return sampleNormal(dist.params.mu, dist.params.sigma)
    case 'binomial':
      return sampleBinomial(dist.params.n, dist.params.p)
    case 'poisson':
      return samplePoisson(dist.params.lambda)
    case 'exponential':
      return sampleExponential(dist.params.lambda)
    case 'uniform':
      return sampleUniform(dist.params.a, dist.params.b)
  }
}

/**
 * Generate n samples from any distribution type.
 */
export function generateSamples(dist: DistributionParams, n: number): number[] {
  const samples: number[] = []
  for (let i = 0; i < n; i++) {
    samples.push(sample(dist))
  }
  return samples
}

// ============================================================================
// Distribution Statistics
// ============================================================================

/**
 * Get distribution statistics (mean, variance, mode, skewness).
 */
export function getDistributionStats(dist: DistributionParams): DistributionStats {
  switch (dist.type) {
    case 'normal': {
      const { mu, sigma } = dist.params
      return {
        mean: mu,
        variance: sigma * sigma,
        stdDev: sigma,
        mode: mu,
        skewness: 0,
      }
    }

    case 'binomial': {
      const { n, p } = dist.params
      const mean = n * p
      const variance = n * p * (1 - p)
      // Mode can be floor((n+1)*p) or floor((n+1)*p) - 1
      const mode = Math.floor((n + 1) * p)
      // Skewness: (1-2p) / sqrt(np(1-p))
      const skewness = variance > 0 ? (1 - 2 * p) / Math.sqrt(variance) : 0
      return {
        mean,
        variance,
        stdDev: Math.sqrt(variance),
        mode: mode <= n ? mode : n,
        skewness,
      }
    }

    case 'poisson': {
      const { lambda } = dist.params
      // Mode is floor(lambda) or both floor(lambda) and floor(lambda)-1 if lambda is integer
      const mode = Math.floor(lambda)
      return {
        mean: lambda,
        variance: lambda,
        stdDev: Math.sqrt(lambda),
        mode: mode,
        skewness: lambda > 0 ? 1 / Math.sqrt(lambda) : 0,
      }
    }

    case 'exponential': {
      const { lambda } = dist.params
      const mean = 1 / lambda
      return {
        mean,
        variance: 1 / (lambda * lambda),
        stdDev: mean,
        mode: 0,
        skewness: 2,
      }
    }

    case 'uniform': {
      const { a, b } = dist.params
      const mean = (a + b) / 2
      const variance = ((b - a) * (b - a)) / 12
      return {
        mean,
        variance,
        stdDev: Math.sqrt(variance),
        mode: null, // All values are equally likely
        skewness: 0,
      }
    }
  }
}

// ============================================================================
// Histogram Generation
// ============================================================================

/**
 * Create histogram bins from sample data.
 * @param data Array of sample values
 * @param binCount Number of bins (default: use Sturges' rule)
 * @returns Array of histogram bins
 */
export function createHistogram(data: number[], binCount?: number): HistogramBin[] {
  if (data.length === 0) return []

  // Use Sturges' rule if binCount not specified: k = ceil(log2(n) + 1)
  const effectiveBinCount = binCount ?? Math.min(Math.ceil(Math.log2(data.length) + 1), 30)

  const min = Math.min(...data)
  const max = Math.max(...data)

  // Handle edge case: all values are the same
  if (min === max) {
    return [
      {
        start: min,
        end: max,
        count: data.length,
        density: 1,
      },
    ]
  }

  const binWidth = (max - min) / effectiveBinCount

  // Initialize bins
  const bins: HistogramBin[] = []
  for (let i = 0; i < effectiveBinCount; i++) {
    bins.push({
      start: min + i * binWidth,
      end: min + (i + 1) * binWidth,
      count: 0,
      density: 0,
    })
  }

  // Count values in each bin
  for (const value of data) {
    let binIndex = Math.floor((value - min) / binWidth)
    // Handle edge case: max value goes in last bin
    if (binIndex >= effectiveBinCount) {
      binIndex = effectiveBinCount - 1
    }
    bins[binIndex]!.count++
  }

  // Calculate density (count / total / binWidth)
  for (const bin of bins) {
    bin.density = bin.count / data.length / binWidth
  }

  return bins
}

/**
 * Get suggested x-axis range for visualization.
 */
export function getSuggestedRange(dist: DistributionParams): { min: number; max: number } {
  const stats = getDistributionStats(dist)

  switch (dist.type) {
    case 'normal': {
      // Show ±4 standard deviations
      return {
        min: stats.mean - 4 * stats.stdDev,
        max: stats.mean + 4 * stats.stdDev,
      }
    }

    case 'binomial': {
      // Show full range [0, n]
      return {
        min: 0,
        max: dist.params.n,
      }
    }

    case 'poisson': {
      // Show from 0 to mean + 4*stdDev
      return {
        min: 0,
        max: Math.ceil(stats.mean + 4 * stats.stdDev),
      }
    }

    case 'exponential': {
      // Show from 0 to mean + 4*stdDev (where most density lies)
      return {
        min: 0,
        max: stats.mean + 4 * stats.stdDev,
      }
    }

    case 'uniform': {
      // Show the full range with small padding
      const padding = (dist.params.b - dist.params.a) * 0.1
      return {
        min: dist.params.a - padding,
        max: dist.params.b + padding,
      }
    }
  }
}

/**
 * Check if a distribution is discrete (returns true for binomial/poisson).
 */
export function isDiscreteDistribution(type: DistributionType): boolean {
  return type === 'binomial' || type === 'poisson'
}

/**
 * Get integer x values for discrete distribution visualization.
 */
export function getDiscreteXValues(dist: DistributionParams): number[] {
  const range = getSuggestedRange(dist)
  const values: number[] = []

  const start = Math.max(0, Math.floor(range.min))
  const end = Math.ceil(range.max)

  for (let x = start; x <= end; x++) {
    values.push(x)
  }

  return values
}

// ============================================================================
// Distribution Presets
// ============================================================================

export const distributionPresets: DistributionPreset[] = [
  {
    id: 'iq-scores',
    name: 'IQ Scores',
    description: 'IQ scores follow a normal distribution with mean 100 and std dev 15',
    distribution: { type: 'normal', params: { mu: 100, sigma: 15 } },
    useCase: 'Classic normal distribution example',
  },
  {
    id: 'standard-normal',
    name: 'Standard Normal',
    description: 'The standard normal distribution with μ=0 and σ=1',
    distribution: { type: 'normal', params: { mu: 0, sigma: 1 } },
    useCase: 'Reference for z-scores',
  },
  {
    id: 'coin-flips',
    name: 'Coin Flips (20)',
    description: '20 fair coin flips, counting heads',
    distribution: { type: 'binomial', params: { n: 20, p: 0.5 } },
    useCase: 'Fair coin tossing',
  },
  {
    id: 'biased-die',
    name: 'Biased Die',
    description: '60 rolls of a fair die, counting sixes',
    distribution: { type: 'binomial', params: { n: 60, p: 1 / 6 } },
    useCase: 'Success counting with low probability',
  },
  {
    id: 'quality-control',
    name: 'Quality Control',
    description: '100 items with 2% defect rate',
    distribution: { type: 'binomial', params: { n: 100, p: 0.02 } },
    useCase: 'Manufacturing defect monitoring',
  },
  {
    id: 'server-requests',
    name: 'Server Requests',
    description: 'Average 10 requests per second',
    distribution: { type: 'poisson', params: { lambda: 10 } },
    useCase: 'Modeling arrival rates',
  },
  {
    id: 'rare-events',
    name: 'Rare Events',
    description: 'Average 2 events per time period',
    distribution: { type: 'poisson', params: { lambda: 2 } },
    useCase: 'Rare event counting',
  },
  {
    id: 'api-timeouts',
    name: 'API Timeouts',
    description: 'Time between failures with rate 0.5/hour',
    distribution: { type: 'exponential', params: { lambda: 0.5 } },
    useCase: 'Modeling wait times',
  },
  {
    id: 'component-lifetime',
    name: 'Component Lifetime',
    description: 'Component failure rate of 0.1/year',
    distribution: { type: 'exponential', params: { lambda: 0.1 } },
    useCase: 'Reliability engineering',
  },
  {
    id: 'random-numbers',
    name: 'Random Numbers',
    description: 'Uniform distribution between 0 and 1',
    distribution: { type: 'uniform', params: { a: 0, b: 1 } },
    useCase: 'Basic RNG simulation',
  },
  {
    id: 'dice-roll',
    name: 'Dice Roll',
    description: 'Single fair die (continuous approximation)',
    distribution: { type: 'uniform', params: { a: 1, b: 7 } },
    useCase: 'Uniform outcome selection',
  },
]

/**
 * Get a distribution preset by ID.
 */
export function getPresetById(id: string): DistributionPreset | undefined {
  return distributionPresets.find((p) => p.id === id)
}

// ============================================================================
// Probability Calculations
// ============================================================================

/**
 * Calculate P(X <= x).
 */
export function probabilityLessThanOrEqual(dist: DistributionParams, x: number): number {
  return getCdf(dist, x)
}

/**
 * Calculate P(X < x).
 * For continuous distributions, this equals P(X <= x).
 * For discrete distributions, this equals P(X <= x-1).
 */
export function probabilityLessThan(dist: DistributionParams, x: number): number {
  if (isDiscreteDistribution(dist.type)) {
    return getCdf(dist, x - 1)
  }
  return getCdf(dist, x)
}

/**
 * Calculate P(X >= x).
 */
export function probabilityGreaterThanOrEqual(dist: DistributionParams, x: number): number {
  if (isDiscreteDistribution(dist.type)) {
    return 1 - getCdf(dist, x - 1)
  }
  return 1 - getCdf(dist, x)
}

/**
 * Calculate P(X > x).
 */
export function probabilityGreaterThan(dist: DistributionParams, x: number): number {
  return 1 - getCdf(dist, x)
}

/**
 * Calculate P(a <= X <= b).
 */
export function probabilityBetween(dist: DistributionParams, a: number, b: number): number {
  if (a > b) return 0
  if (isDiscreteDistribution(dist.type)) {
    return getCdf(dist, b) - getCdf(dist, a - 1)
  }
  return getCdf(dist, b) - getCdf(dist, a)
}

// ============================================================================
// Parameter Validation
// ============================================================================

export interface ValidationError {
  param: string
  message: string
}

/**
 * Validate distribution parameters.
 */
export function validateParams(dist: DistributionParams): ValidationError[] {
  const errors: ValidationError[] = []

  switch (dist.type) {
    case 'normal':
      if (dist.params.sigma <= 0) {
        errors.push({ param: 'sigma', message: 'Standard deviation must be positive' })
      }
      break

    case 'binomial':
      if (!Number.isInteger(dist.params.n) || dist.params.n < 0) {
        errors.push({ param: 'n', message: 'Number of trials must be a non-negative integer' })
      }
      if (dist.params.p < 0 || dist.params.p > 1) {
        errors.push({ param: 'p', message: 'Probability must be between 0 and 1' })
      }
      break

    case 'poisson':
      if (dist.params.lambda < 0) {
        errors.push({ param: 'lambda', message: 'Rate parameter must be non-negative' })
      }
      break

    case 'exponential':
      if (dist.params.lambda <= 0) {
        errors.push({ param: 'lambda', message: 'Rate parameter must be positive' })
      }
      break

    case 'uniform':
      if (dist.params.a >= dist.params.b) {
        errors.push({ param: 'a', message: 'Lower bound must be less than upper bound' })
      }
      break
  }

  return errors
}

/**
 * Check if parameters are valid.
 */
export function isValidParams(dist: DistributionParams): boolean {
  return validateParams(dist).length === 0
}
