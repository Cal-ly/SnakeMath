/**
 * Sampling and estimation utility functions.
 * Includes population generation, sampling methods, standard error,
 * confidence intervals, bootstrap, and sample size calculations.
 *
 * Key concepts:
 * - Population: The complete set of items we want to learn about
 * - Sample: A subset of the population we actually measure
 * - Sampling Distribution: The distribution of sample statistics
 * - Standard Error: How much sample statistics vary from sample to sample
 * - Confidence Interval: Range that captures the true parameter with specified probability
 * - Bootstrap: Resampling technique for estimating variability
 */

import {
  sampleNormal,
  sampleUniform,
  sampleExponential,
  standardNormalQuantile,
} from './distributions'

// ============================================================================
// Types
// ============================================================================

export type SamplingMethod = 'simple' | 'stratified' | 'systematic' | 'cluster'

export type PopulationDistribution = 'normal' | 'uniform' | 'exponential' | 'binomial'

export interface PopulationConfig {
  size: number
  distribution: PopulationDistribution
  params: Record<string, number>
}

export interface SampleResult {
  indices: number[]
  values: number[]
  mean: number
  standardDeviation: number
  standardError: number
}

export interface StratumConfig {
  name: string
  proportion: number
  values: number[]
}

export interface ConfidenceInterval {
  lower: number
  upper: number
  pointEstimate: number
  marginOfError: number
  confidenceLevel: number
}

export interface BootstrapResult {
  bootstrapStatistics: number[]
  standardError: number
  percentileCI: ConfidenceInterval
  originalStatistic: number
}

export interface SamplingPreset {
  id: string
  name: string
  description: string
  populationConfig: PopulationConfig
  sampleSize: number
  scenario: string
}

// ============================================================================
// Population Generation
// ============================================================================

/**
 * Generate a population of values from a specified distribution.
 * @param config Population configuration
 * @returns Array of population values
 */
export function generatePopulation(config: PopulationConfig): number[] {
  const { size, distribution, params } = config

  if (size <= 0 || !Number.isInteger(size)) {
    throw new Error('Population size must be a positive integer')
  }

  const population: number[] = []

  for (let i = 0; i < size; i++) {
    switch (distribution) {
      case 'normal':
        population.push(sampleNormal(params.mu ?? 0, params.sigma ?? 1))
        break
      case 'uniform':
        population.push(sampleUniform(params.a ?? 0, params.b ?? 1))
        break
      case 'exponential':
        population.push(sampleExponential(params.lambda ?? 1))
        break
      case 'binomial':
        // For binomial, we treat each value as a success (1) or failure (0)
        population.push(Math.random() < (params.p ?? 0.5) ? 1 : 0)
        break
    }
  }

  return population
}

// ============================================================================
// Basic Statistics Functions
// ============================================================================

/**
 * Calculate the arithmetic mean of an array.
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
// Sampling Functions
// ============================================================================

/**
 * Simple random sample without replacement.
 * Every item in the population has an equal chance of being selected.
 *
 * @param population Array of population values
 * @param sampleSize Number of items to sample
 * @returns Sample result with indices, values, and statistics
 */
export function simpleRandomSample(population: number[], sampleSize: number): SampleResult {
  if (sampleSize <= 0 || !Number.isInteger(sampleSize)) {
    throw new Error('Sample size must be a positive integer')
  }
  if (sampleSize > population.length) {
    throw new Error('Sample size cannot exceed population size')
  }

  // Fisher-Yates shuffle approach for random selection without replacement
  const indices: number[] = []
  const available = [...Array(population.length).keys()]

  for (let i = 0; i < sampleSize; i++) {
    const randomIndex = Math.floor(Math.random() * available.length)
    indices.push(available[randomIndex]!)
    available.splice(randomIndex, 1)
  }

  const values = indices.map((i) => population[i]!)
  const sampleMean = mean(values)
  const sampleStdDev = standardDeviation(values)
  const se = standardErrorMean(sampleStdDev, sampleSize)

  return {
    indices,
    values,
    mean: sampleMean,
    standardDeviation: sampleStdDev,
    standardError: se,
  }
}

/**
 * Stratified sample - divide population into strata and sample proportionally.
 * Ensures representation from all subgroups.
 *
 * @param strata Array of stratum configurations
 * @param totalSampleSize Total number of items to sample
 * @param proportional If true, sample proportionally to stratum size (default: true)
 * @returns Sample result
 */
export function stratifiedSample(
  strata: StratumConfig[],
  totalSampleSize: number,
  proportional: boolean = true
): SampleResult {
  if (totalSampleSize <= 0 || !Number.isInteger(totalSampleSize)) {
    throw new Error('Sample size must be a positive integer')
  }
  if (strata.length === 0) {
    throw new Error('At least one stratum is required')
  }

  const indices: number[] = []
  const values: number[] = []
  let currentOffset = 0

  // Calculate sample sizes for each stratum
  const strataSampleSizes = strata.map((stratum, i) => {
    if (proportional) {
      // Proportional allocation
      let size = Math.round(stratum.proportion * totalSampleSize)
      // Ensure at least 1 from each stratum if possible
      if (size === 0 && stratum.values.length > 0) size = 1
      return Math.min(size, stratum.values.length)
    } else {
      // Equal allocation
      const equalSize = Math.floor(totalSampleSize / strata.length)
      // Last stratum gets remainder
      const remainder = i === strata.length - 1 ? totalSampleSize % strata.length : 0
      return Math.min(equalSize + remainder, stratum.values.length)
    }
  })

  // Sample from each stratum
  for (let i = 0; i < strata.length; i++) {
    const stratum = strata[i]!
    const sampleSize = strataSampleSizes[i]!

    const stratumSample = simpleRandomSample(stratum.values, sampleSize)
    // Adjust indices to account for stratum offset in combined population
    indices.push(...stratumSample.indices.map((idx) => idx + currentOffset))
    values.push(...stratumSample.values)

    currentOffset += stratum.values.length
  }

  const sampleMean = mean(values)
  const sampleStdDev = standardDeviation(values)
  const se = standardErrorMean(sampleStdDev, values.length)

  return {
    indices,
    values,
    mean: sampleMean,
    standardDeviation: sampleStdDev,
    standardError: se,
  }
}

/**
 * Systematic sample - select every kth item starting from a random position.
 *
 * @param population Array of population values
 * @param sampleSize Number of items to sample
 * @param randomStart If true, start from random position (default: true)
 * @returns Sample result
 */
export function systematicSample(
  population: number[],
  sampleSize: number,
  randomStart: boolean = true
): SampleResult {
  if (sampleSize <= 0 || !Number.isInteger(sampleSize)) {
    throw new Error('Sample size must be a positive integer')
  }
  if (sampleSize > population.length) {
    throw new Error('Sample size cannot exceed population size')
  }

  const k = Math.floor(population.length / sampleSize)
  const start = randomStart ? Math.floor(Math.random() * k) : 0

  const indices: number[] = []
  const values: number[] = []

  for (let i = 0; i < sampleSize; i++) {
    const index = start + i * k
    if (index < population.length) {
      indices.push(index)
      values.push(population[index]!)
    }
  }

  const sampleMean = mean(values)
  const sampleStdDev = standardDeviation(values)
  const se = standardErrorMean(sampleStdDev, values.length)

  return {
    indices,
    values,
    mean: sampleMean,
    standardDeviation: sampleStdDev,
    standardError: se,
  }
}

/**
 * Cluster sample - divide population into clusters, randomly select clusters.
 *
 * @param population Array of population values
 * @param numClusters Number of clusters to create
 * @param clustersToSelect Number of clusters to randomly select
 * @returns Sample result
 */
export function clusterSample(
  population: number[],
  numClusters: number,
  clustersToSelect: number
): SampleResult {
  if (numClusters <= 0 || !Number.isInteger(numClusters)) {
    throw new Error('Number of clusters must be a positive integer')
  }
  if (clustersToSelect <= 0 || !Number.isInteger(clustersToSelect)) {
    throw new Error('Clusters to select must be a positive integer')
  }
  if (clustersToSelect > numClusters) {
    throw new Error('Cannot select more clusters than available')
  }
  if (numClusters > population.length) {
    throw new Error('Cannot have more clusters than population size')
  }

  const clusterSize = Math.ceil(population.length / numClusters)

  // Create clusters
  const clusters: { indices: number[]; values: number[] }[] = []
  for (let c = 0; c < numClusters; c++) {
    const startIdx = c * clusterSize
    const endIdx = Math.min((c + 1) * clusterSize, population.length)
    const clusterIndices: number[] = []
    const clusterValues: number[] = []
    for (let i = startIdx; i < endIdx; i++) {
      clusterIndices.push(i)
      clusterValues.push(population[i]!)
    }
    clusters.push({ indices: clusterIndices, values: clusterValues })
  }

  // Randomly select clusters
  const selectedClusterIndices: number[] = []
  const availableClusters = [...Array(numClusters).keys()]
  for (let i = 0; i < clustersToSelect; i++) {
    const randomIndex = Math.floor(Math.random() * availableClusters.length)
    selectedClusterIndices.push(availableClusters[randomIndex]!)
    availableClusters.splice(randomIndex, 1)
  }

  // Collect all items from selected clusters
  const indices: number[] = []
  const values: number[] = []
  for (const clusterIdx of selectedClusterIndices) {
    const cluster = clusters[clusterIdx]!
    indices.push(...cluster.indices)
    values.push(...cluster.values)
  }

  const sampleMean = mean(values)
  const sampleStdDev = standardDeviation(values)
  const se = standardErrorMean(sampleStdDev, values.length)

  return {
    indices,
    values,
    mean: sampleMean,
    standardDeviation: sampleStdDev,
    standardError: se,
  }
}

// ============================================================================
// Standard Error Functions
// ============================================================================

/**
 * Standard error of the mean: SE = s / sqrt(n)
 * Measures how much sample means vary from sample to sample.
 *
 * @param sampleStdDev Sample standard deviation
 * @param sampleSize Sample size
 */
export function standardErrorMean(sampleStdDev: number, sampleSize: number): number {
  if (sampleSize <= 0) return 0
  return sampleStdDev / Math.sqrt(sampleSize)
}

/**
 * Standard error of a proportion: SE = sqrt(p(1-p)/n)
 *
 * @param proportion Sample proportion
 * @param sampleSize Sample size
 */
export function standardErrorProportion(proportion: number, sampleSize: number): number {
  if (sampleSize <= 0) return 0
  if (proportion < 0 || proportion > 1) {
    throw new Error('Proportion must be between 0 and 1')
  }
  return Math.sqrt((proportion * (1 - proportion)) / sampleSize)
}

/**
 * Finite population correction factor.
 * Adjusts SE when sampling without replacement from a finite population.
 *
 * FPC = sqrt((N - n) / (N - 1))
 *
 * @param sampleSize n
 * @param populationSize N
 */
export function finitePopulationCorrection(sampleSize: number, populationSize: number): number {
  if (populationSize <= 1) return 0
  if (sampleSize >= populationSize) return 0
  return Math.sqrt((populationSize - sampleSize) / (populationSize - 1))
}

// ============================================================================
// Critical Values
// ============================================================================

/**
 * Z critical value for a given alpha (two-tailed).
 * For 95% confidence, alpha = 0.05, returns ~1.96
 *
 * @param alpha Significance level (e.g., 0.05 for 95% CI)
 */
export function zCriticalValue(alpha: number): number {
  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Alpha must be between 0 and 1')
  }
  // For two-tailed, we need z such that P(Z > z) = alpha/2
  // standardNormalQuantile gives us z for P(Z < z) = p
  return -standardNormalQuantile(alpha / 2)
}

/**
 * T critical value approximation using Student's t-distribution.
 * Uses a polynomial approximation for accuracy.
 *
 * @param degreesOfFreedom Degrees of freedom (n - 1 for single sample)
 * @param alpha Significance level
 */
export function tCriticalValue(degreesOfFreedom: number, alpha: number): number {
  if (degreesOfFreedom <= 0) {
    throw new Error('Degrees of freedom must be positive')
  }
  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Alpha must be between 0 and 1')
  }

  const df = degreesOfFreedom

  // For large df, t approaches z
  if (df > 1000) {
    return zCriticalValue(alpha)
  }

  // Get z critical value as starting point
  const z = zCriticalValue(alpha)

  // Apply Cornish-Fisher expansion for t approximation
  // t ≈ z + (z³ + z)/(4*df) + (5z⁵ + 16z³ + 3z)/(96*df²) + ...
  const z2 = z * z
  const z3 = z2 * z
  const z5 = z3 * z2

  const term1 = (z3 + z) / (4 * df)
  const term2 = (5 * z5 + 16 * z3 + 3 * z) / (96 * df * df)
  const term3 = (3 * z5 + 19 * z3 + 17 * z - 15 * z) / (384 * df * df * df)

  return z + term1 + term2 + term3
}

// ============================================================================
// Confidence Intervals
// ============================================================================

/**
 * Confidence interval for the mean (t-distribution based).
 * Use when population standard deviation is unknown (usual case).
 *
 * @param sampleMean Sample mean (x̄)
 * @param sampleStdDev Sample standard deviation (s)
 * @param sampleSize Sample size (n)
 * @param confidenceLevel Confidence level (default: 0.95)
 */
export function confidenceIntervalMean(
  sampleMean: number,
  sampleStdDev: number,
  sampleSize: number,
  confidenceLevel: number = 0.95
): ConfidenceInterval {
  if (sampleSize <= 1) {
    throw new Error('Sample size must be greater than 1')
  }
  if (confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new Error('Confidence level must be between 0 and 1')
  }

  const alpha = 1 - confidenceLevel
  const df = sampleSize - 1
  const t = tCriticalValue(df, alpha)
  const se = standardErrorMean(sampleStdDev, sampleSize)
  const marginOfError = t * se

  return {
    lower: sampleMean - marginOfError,
    upper: sampleMean + marginOfError,
    pointEstimate: sampleMean,
    marginOfError,
    confidenceLevel,
  }
}

/**
 * Confidence interval for a proportion (normal approximation).
 * Valid when np >= 10 and n(1-p) >= 10.
 *
 * @param successes Number of successes
 * @param sampleSize Sample size
 * @param confidenceLevel Confidence level (default: 0.95)
 */
export function confidenceIntervalProportion(
  successes: number,
  sampleSize: number,
  confidenceLevel: number = 0.95
): ConfidenceInterval {
  if (sampleSize <= 0) {
    throw new Error('Sample size must be positive')
  }
  if (successes < 0 || successes > sampleSize) {
    throw new Error('Successes must be between 0 and sample size')
  }
  if (confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new Error('Confidence level must be between 0 and 1')
  }

  const proportion = successes / sampleSize
  const alpha = 1 - confidenceLevel
  const z = zCriticalValue(alpha)
  const se = standardErrorProportion(proportion, sampleSize)
  const marginOfError = z * se

  return {
    lower: Math.max(0, proportion - marginOfError),
    upper: Math.min(1, proportion + marginOfError),
    pointEstimate: proportion,
    marginOfError,
    confidenceLevel,
  }
}

// ============================================================================
// Bootstrap
// ============================================================================

/**
 * Generate a bootstrap resample (sample with replacement).
 *
 * @param sample Original sample
 */
export function bootstrapResample(sample: number[]): number[] {
  if (sample.length === 0) return []

  const resample: number[] = []
  for (let i = 0; i < sample.length; i++) {
    const randomIndex = Math.floor(Math.random() * sample.length)
    resample.push(sample[randomIndex]!)
  }
  return resample
}

/**
 * Bootstrap estimation of sampling distribution.
 * Resamples with replacement to estimate variability of a statistic.
 *
 * @param sample Original sample data
 * @param iterations Number of bootstrap iterations
 * @param statistic Function to compute statistic (default: mean)
 * @param confidenceLevel Confidence level for CI (default: 0.95)
 */
export function bootstrap(
  sample: number[],
  iterations: number,
  statistic: (data: number[]) => number = mean,
  confidenceLevel: number = 0.95
): BootstrapResult {
  if (sample.length === 0) {
    throw new Error('Sample cannot be empty')
  }
  if (iterations <= 0 || !Number.isInteger(iterations)) {
    throw new Error('Iterations must be a positive integer')
  }

  const originalStatistic = statistic(sample)
  const bootstrapStatistics: number[] = []

  for (let i = 0; i < iterations; i++) {
    const resample = bootstrapResample(sample)
    bootstrapStatistics.push(statistic(resample))
  }

  // Sort for percentile calculation
  bootstrapStatistics.sort((a, b) => a - b)

  // Bootstrap standard error
  const bootstrapMean = mean(bootstrapStatistics)
  const sumSquaredDiff = bootstrapStatistics.reduce((sum, v) => sum + (v - bootstrapMean) ** 2, 0)
  const bootstrapSE = Math.sqrt(sumSquaredDiff / (iterations - 1))

  // Percentile confidence interval
  const alpha = 1 - confidenceLevel
  const lowerIndex = Math.floor((alpha / 2) * iterations)
  const upperIndex = Math.floor((1 - alpha / 2) * iterations) - 1

  const percentileCI: ConfidenceInterval = {
    lower: bootstrapStatistics[lowerIndex] ?? bootstrapStatistics[0]!,
    upper: bootstrapStatistics[upperIndex] ?? bootstrapStatistics[bootstrapStatistics.length - 1]!,
    pointEstimate: originalStatistic,
    marginOfError: (bootstrapStatistics[upperIndex]! - bootstrapStatistics[lowerIndex]!) / 2,
    confidenceLevel,
  }

  return {
    bootstrapStatistics,
    standardError: bootstrapSE,
    percentileCI,
    originalStatistic,
  }
}

// ============================================================================
// Sample Size Calculations
// ============================================================================

/**
 * Calculate required sample size for estimating a mean.
 *
 * n = (z * σ / E)²
 *
 * @param marginOfError Desired margin of error
 * @param populationStdDev Population standard deviation (or estimate)
 * @param confidenceLevel Confidence level (default: 0.95)
 */
export function sampleSizeForMean(
  marginOfError: number,
  populationStdDev: number,
  confidenceLevel: number = 0.95
): number {
  if (marginOfError <= 0) {
    throw new Error('Margin of error must be positive')
  }
  if (populationStdDev <= 0) {
    throw new Error('Population standard deviation must be positive')
  }

  const alpha = 1 - confidenceLevel
  const z = zCriticalValue(alpha)
  const n = Math.pow((z * populationStdDev) / marginOfError, 2)
  return Math.ceil(n)
}

/**
 * Calculate required sample size for estimating a proportion.
 *
 * n = z² * p(1-p) / E²
 *
 * @param marginOfError Desired margin of error
 * @param expectedProportion Expected proportion (default: 0.5 for conservative estimate)
 * @param confidenceLevel Confidence level (default: 0.95)
 */
export function sampleSizeForProportion(
  marginOfError: number,
  expectedProportion: number = 0.5,
  confidenceLevel: number = 0.95
): number {
  if (marginOfError <= 0) {
    throw new Error('Margin of error must be positive')
  }
  if (expectedProportion <= 0 || expectedProportion >= 1) {
    throw new Error('Expected proportion must be between 0 and 1')
  }

  const alpha = 1 - confidenceLevel
  const z = zCriticalValue(alpha)
  const n = (z * z * expectedProportion * (1 - expectedProportion)) / (marginOfError * marginOfError)
  return Math.ceil(n)
}

/**
 * Calculate required sample size for desired power (comparing two means).
 * Two-sample t-test scenario.
 *
 * n per group = 2 * ((z_α + z_β) * σ / δ)²
 *
 * @param effectSize Minimum detectable difference
 * @param standardDeviation Population standard deviation
 * @param power Desired power (default: 0.8)
 * @param alpha Significance level (default: 0.05)
 */
export function sampleSizeForPower(
  effectSize: number,
  standardDeviation: number,
  power: number = 0.8,
  alpha: number = 0.05
): number {
  if (effectSize <= 0) {
    throw new Error('Effect size must be positive')
  }
  if (standardDeviation <= 0) {
    throw new Error('Standard deviation must be positive')
  }
  if (power <= 0 || power >= 1) {
    throw new Error('Power must be between 0 and 1')
  }
  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Alpha must be between 0 and 1')
  }

  const zAlpha = zCriticalValue(alpha)
  // For power, we use one-tailed z
  const zBeta = -standardNormalQuantile(1 - power)

  const n = 2 * Math.pow(((zAlpha + zBeta) * standardDeviation) / effectSize, 2)
  return Math.ceil(n)
}

// ============================================================================
// Sampling Presets
// ============================================================================

export const samplingPresets: SamplingPreset[] = [
  {
    id: 'user-survey',
    name: 'User Survey',
    description: 'Customer satisfaction survey with normal distribution',
    populationConfig: {
      size: 1000,
      distribution: 'normal',
      params: { mu: 50, sigma: 15 },
    },
    sampleSize: 50,
    scenario: 'Estimate average satisfaction score from a subset of users',
  },
  {
    id: 'quality-inspection',
    name: 'Quality Inspection',
    description: 'Manufacturing defect rate estimation',
    populationConfig: {
      size: 10000,
      distribution: 'binomial',
      params: { p: 0.02 },
    },
    sampleSize: 200,
    scenario: 'Estimate defect rate without inspecting every item',
  },
  {
    id: 'performance-benchmark',
    name: 'Performance Benchmark',
    description: 'API response times with exponential distribution',
    populationConfig: {
      size: 5000,
      distribution: 'exponential',
      params: { lambda: 0.01 }, // Mean of 100ms
    },
    sampleSize: 100,
    scenario: 'Profile API performance by sampling requests',
  },
  {
    id: 'election-poll',
    name: 'Election Poll',
    description: 'Voter preference estimation',
    populationConfig: {
      size: 100000,
      distribution: 'binomial',
      params: { p: 0.52 },
    },
    sampleSize: 1000,
    scenario: 'Estimate candidate support from a representative sample',
  },
  {
    id: 'ab-test',
    name: 'A/B Test',
    description: 'Website conversion rate experiment',
    populationConfig: {
      size: 50000,
      distribution: 'binomial',
      params: { p: 0.05 },
    },
    sampleSize: 5000,
    scenario: 'Estimate conversion rate to detect small improvements',
  },
]

/**
 * Get a sampling preset by ID.
 */
export function getSamplingPresetById(id: string): SamplingPreset | undefined {
  return samplingPresets.find((p) => p.id === id)
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate sample statistics for a given array of values.
 */
export function calculateSampleStatistics(values: number[]): {
  n: number
  mean: number
  stdDev: number
  se: number
  min: number
  max: number
} {
  if (values.length === 0) {
    return { n: 0, mean: 0, stdDev: 0, se: 0, min: 0, max: 0 }
  }

  const n = values.length
  const m = mean(values)
  const sd = standardDeviation(values)
  const se = standardErrorMean(sd, n)

  return {
    n,
    mean: m,
    stdDev: sd,
    se,
    min: Math.min(...values),
    max: Math.max(...values),
  }
}

/**
 * Create strata from a population based on a categorical variable.
 * For simplicity, this divides the population into equal-sized groups.
 *
 * @param population Population values
 * @param numStrata Number of strata to create
 */
export function createStrata(population: number[], numStrata: number): StratumConfig[] {
  if (numStrata <= 0 || !Number.isInteger(numStrata)) {
    throw new Error('Number of strata must be a positive integer')
  }

  const sorted = [...population].sort((a, b) => a - b)
  const strataSize = Math.ceil(sorted.length / numStrata)
  const strata: StratumConfig[] = []

  for (let i = 0; i < numStrata; i++) {
    const startIdx = i * strataSize
    const endIdx = Math.min((i + 1) * strataSize, sorted.length)
    const values = sorted.slice(startIdx, endIdx)

    strata.push({
      name: `Stratum ${i + 1}`,
      proportion: values.length / sorted.length,
      values,
    })
  }

  return strata
}
