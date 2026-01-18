/**
 * Tests for useDistributionExplorer composable.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useDistributionExplorer } from './useDistributionExplorer'

// Mock vue-router
const mockRoute = {
  query: {},
}

const mockRouter = {
  replace: vi.fn(),
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}))

describe('useDistributionExplorer', () => {
  beforeEach(() => {
    mockRoute.query = {}
    mockRouter.replace.mockClear()
  })

  describe('initialization', () => {
    it('initializes with default normal distribution', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      expect(explorer.distributionType.value).toBe('normal')
      expect(explorer.normalParams.value).toEqual({ mu: 0, sigma: 1 })
    })

    it('initializes with specified type', () => {
      const explorer = useDistributionExplorer({ initialType: 'binomial', syncUrl: false })
      expect(explorer.distributionType.value).toBe('binomial')
    })

    it('initializes with preset', () => {
      const explorer = useDistributionExplorer({ initialPreset: 'iq-scores', syncUrl: false })
      // The preset is loaded in onMounted, so we test loadPreset directly
      explorer.loadPreset('iq-scores')
      expect(explorer.distributionType.value).toBe('normal')
      expect(explorer.normalParams.value).toEqual({ mu: 100, sigma: 15 })
    })
  })

  describe('currentDistribution', () => {
    it('returns correct distribution params for normal', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setNormalParams({ mu: 5, sigma: 2 })
      expect(explorer.currentDistribution.value).toEqual({
        type: 'normal',
        params: { mu: 5, sigma: 2 },
      })
    })

    it('returns correct distribution params for binomial', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('binomial')
      explorer.setBinomialParams({ n: 30, p: 0.3 })
      expect(explorer.currentDistribution.value).toEqual({
        type: 'binomial',
        params: { n: 30, p: 0.3 },
      })
    })

    it('returns correct distribution params for poisson', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('poisson')
      explorer.setPoissonParams({ lambda: 10 })
      expect(explorer.currentDistribution.value).toEqual({
        type: 'poisson',
        params: { lambda: 10 },
      })
    })

    it('returns correct distribution params for exponential', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('exponential')
      explorer.setExponentialParams({ lambda: 0.5 })
      expect(explorer.currentDistribution.value).toEqual({
        type: 'exponential',
        params: { lambda: 0.5 },
      })
    })

    it('returns correct distribution params for uniform', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('uniform')
      explorer.setUniformParams({ a: -5, b: 5 })
      expect(explorer.currentDistribution.value).toEqual({
        type: 'uniform',
        params: { a: -5, b: 5 },
      })
    })
  })

  describe('isValid', () => {
    it('returns true for valid parameters', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      expect(explorer.isValid.value).toBe(true)
    })

    it('returns false for invalid normal sigma', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setNormalParams({ sigma: -1 })
      expect(explorer.isValid.value).toBe(false)
    })

    it('returns false for invalid binomial p', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('binomial')
      explorer.setBinomialParams({ p: 1.5 })
      expect(explorer.isValid.value).toBe(false)
    })

    it('returns false for invalid uniform range', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('uniform')
      explorer.setUniformParams({ a: 5, b: 3 })
      expect(explorer.isValid.value).toBe(false)
    })
  })

  describe('stats', () => {
    it('calculates correct stats for normal', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setNormalParams({ mu: 100, sigma: 15 })
      const stats = explorer.stats.value
      expect(stats).not.toBeNull()
      expect(stats?.mean).toBe(100)
      expect(stats?.variance).toBe(225)
      expect(stats?.stdDev).toBe(15)
    })

    it('calculates correct stats for binomial', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('binomial')
      explorer.setBinomialParams({ n: 20, p: 0.5 })
      const stats = explorer.stats.value
      expect(stats).not.toBeNull()
      expect(stats?.mean).toBe(10)
      expect(stats?.variance).toBe(5)
    })

    it('returns null for invalid parameters', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setNormalParams({ sigma: 0 })
      expect(explorer.stats.value).toBeNull()
    })
  })

  describe('xRange', () => {
    it('returns appropriate range for normal', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setNormalParams({ mu: 0, sigma: 1 })
      const range = explorer.xRange.value
      expect(range.min).toBe(-4)
      expect(range.max).toBe(4)
    })

    it('returns [0, n] for binomial', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('binomial')
      explorer.setBinomialParams({ n: 30, p: 0.5 })
      const range = explorer.xRange.value
      expect(range.min).toBe(0)
      expect(range.max).toBe(30)
    })
  })

  describe('isDiscrete', () => {
    it('returns true for binomial', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('binomial')
      expect(explorer.isDiscrete.value).toBe(true)
    })

    it('returns true for poisson', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('poisson')
      expect(explorer.isDiscrete.value).toBe(true)
    })

    it('returns false for normal', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      expect(explorer.isDiscrete.value).toBe(false)
    })

    it('returns false for exponential', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('exponential')
      expect(explorer.isDiscrete.value).toBe(false)
    })
  })

  describe('pdfData', () => {
    it('generates PDF data points for continuous distribution', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      const data = explorer.pdfData.value
      expect(data.length).toBeGreaterThan(0)
      expect(data.every((p) => typeof p.x === 'number' && typeof p.y === 'number')).toBe(true)
    })

    it('generates PMF data points for discrete distribution', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('binomial')
      explorer.setBinomialParams({ n: 10, p: 0.5 })
      const data = explorer.pdfData.value
      expect(data.length).toBeGreaterThan(0)
      // All x values should be integers for discrete
      expect(data.every((p) => Number.isInteger(p.x))).toBe(true)
    })

    it('returns empty array for invalid parameters', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setNormalParams({ sigma: 0 })
      expect(explorer.pdfData.value).toEqual([])
    })
  })

  describe('maxPdfValue', () => {
    it('returns the maximum PDF value', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      const max = explorer.maxPdfValue.value
      expect(max).toBeGreaterThan(0)
      expect(max).toBeLessThanOrEqual(Math.max(...explorer.pdfData.value.map((p) => p.y)))
    })
  })

  describe('setDistributionType', () => {
    it('changes distribution type', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('poisson')
      expect(explorer.distributionType.value).toBe('poisson')
    })

    it('clears sample data when switching', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.generateNewSamples(100)
      expect(explorer.sampleData.value.length).toBe(100)
      explorer.setDistributionType('poisson')
      expect(explorer.sampleData.value.length).toBe(0)
    })

    it('preserves parameters when switching back', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setNormalParams({ mu: 50, sigma: 10 })
      explorer.setDistributionType('binomial')
      explorer.setDistributionType('normal')
      expect(explorer.normalParams.value).toEqual({ mu: 50, sigma: 10 })
    })
  })

  describe('loadPreset', () => {
    it('loads IQ scores preset', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.loadPreset('iq-scores')
      expect(explorer.distributionType.value).toBe('normal')
      expect(explorer.normalParams.value).toEqual({ mu: 100, sigma: 15 })
    })

    it('loads coin flips preset', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.loadPreset('coin-flips')
      expect(explorer.distributionType.value).toBe('binomial')
      expect(explorer.binomialParams.value).toEqual({ n: 20, p: 0.5 })
    })

    it('loads server requests preset', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.loadPreset('server-requests')
      expect(explorer.distributionType.value).toBe('poisson')
      expect(explorer.poissonParams.value).toEqual({ lambda: 10 })
    })

    it('ignores invalid preset ID', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      const originalType = explorer.distributionType.value
      explorer.loadPreset('nonexistent-preset')
      expect(explorer.distributionType.value).toBe(originalType)
    })
  })

  describe('generateNewSamples', () => {
    it('generates specified number of samples', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.generateNewSamples(200)
      expect(explorer.sampleData.value.length).toBe(200)
    })

    it('uses sampleCount when no argument provided', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.sampleCount.value = 300
      explorer.generateNewSamples()
      expect(explorer.sampleData.value.length).toBe(300)
    })

    it('generates samples within expected range', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setDistributionType('uniform')
      explorer.setUniformParams({ a: 0, b: 10 })
      explorer.generateNewSamples(100)
      expect(explorer.sampleData.value.every((s) => s >= 0 && s <= 10)).toBe(true)
    })
  })

  describe('clearSamples', () => {
    it('clears all sample data', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.generateNewSamples(100)
      expect(explorer.sampleData.value.length).toBe(100)
      explorer.clearSamples()
      expect(explorer.sampleData.value.length).toBe(0)
    })
  })

  describe('calculateQuantile', () => {
    it('calculates correct quantile for normal', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      const q50 = explorer.calculateQuantile(0.5)
      expect(q50).toBeCloseTo(0, 2)

      const q975 = explorer.calculateQuantile(0.975)
      expect(q975).toBeCloseTo(1.96, 1)
    })

    it('returns null for invalid probability', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      expect(explorer.calculateQuantile(-0.1)).toBeNull()
      expect(explorer.calculateQuantile(1.1)).toBeNull()
    })

    it('returns null for invalid parameters', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setNormalParams({ sigma: 0 })
      expect(explorer.calculateQuantile(0.5)).toBeNull()
    })
  })

  describe('probability calculator', () => {
    it('calculates P(X <= b) correctly', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setProbCalcMode('lessThan')
      explorer.setProbCalcBounds(0, 0)
      const result = explorer.probabilityResult.value
      expect(result?.type).toBe('lessThan')
      expect(result?.probability).toBeCloseTo(0.5, 2)
    })

    it('calculates P(a <= X <= b) correctly', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setProbCalcMode('between')
      explorer.setProbCalcBounds(-1, 1)
      const result = explorer.probabilityResult.value
      expect(result?.type).toBe('between')
      expect(result?.probability).toBeCloseTo(0.6827, 2)
    })
  })

  describe('CLT demonstration', () => {
    it('generates sample means', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.runCltSampling(100)
      expect(explorer.cltSampleMeans.value.length).toBe(100)
    })

    it('adds incremental samples', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.runCltSampling(50)
      explorer.addCltSamples(50)
      expect(explorer.cltSampleMeans.value.length).toBe(100)
    })

    it('resets CLT samples', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.runCltSampling(100)
      explorer.resetClt()
      expect(explorer.cltSampleMeans.value.length).toBe(0)
    })

    it('changes source distribution type', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setCltSourceType('exponential')
      expect(explorer.cltSourceType.value).toBe('exponential')
    })

    it('clamps sample size to valid range', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.setCltSampleSize(0)
      expect(explorer.cltSampleSize.value).toBe(1)
      explorer.setCltSampleSize(200)
      expect(explorer.cltSampleSize.value).toBe(100)
    })
  })

  describe('histogramBins', () => {
    it('returns empty array when no samples', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      expect(explorer.histogramBins.value).toEqual([])
    })

    it('returns histogram bins after generating samples', () => {
      const explorer = useDistributionExplorer({ syncUrl: false })
      explorer.generateNewSamples(500)
      const bins = explorer.histogramBins.value
      expect(bins.length).toBeGreaterThan(0)
      expect(bins[0]).toHaveProperty('start')
      expect(bins[0]).toHaveProperty('end')
      expect(bins[0]).toHaveProperty('count')
    })
  })

  describe('URL sync', () => {
    it('updates URL when distribution changes', async () => {
      const explorer = useDistributionExplorer({ syncUrl: true })
      explorer.setDistributionType('binomial')

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 350))

      expect(mockRouter.replace).toHaveBeenCalled()
      const calls = mockRouter.replace.mock.calls
      const lastCall = calls[calls.length - 1]?.[0] as { query: Record<string, string> }
      expect(lastCall.query.type).toBe('binomial')
    })

    it('updates URL when parameters change', async () => {
      const explorer = useDistributionExplorer({ syncUrl: true })
      explorer.setNormalParams({ mu: 50, sigma: 10 })

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 350))

      expect(mockRouter.replace).toHaveBeenCalled()
      const calls = mockRouter.replace.mock.calls
      const lastCall = calls[calls.length - 1]?.[0] as { query: Record<string, string> }
      expect(lastCall.query.mu).toBe('50')
      expect(lastCall.query.sigma).toBe('10')
    })

    it('does not include default parameters in URL', async () => {
      const explorer = useDistributionExplorer({ syncUrl: true })
      explorer.setNormalParams({ mu: 0, sigma: 1 }) // These are defaults

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 350))
      await nextTick()

      // Check that default values are not in the URL
      const calls = mockRouter.replace.mock.calls
      const lastCallArg = calls[calls.length - 1]?.[0] as
        | { query: Record<string, string> }
        | undefined

      // lastCallArg should exist and not have mu/sigma since they're defaults
      expect(lastCallArg).toBeDefined()
      expect(lastCallArg?.query.mu).toBeUndefined()
      expect(lastCallArg?.query.sigma).toBeUndefined()
    })
  })
})
