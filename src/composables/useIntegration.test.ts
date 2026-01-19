/**
 * Tests for useIntegration composable
 */

import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {},
  }),
  useRouter: () => ({
    replace: vi.fn(),
  }),
}))

import { useIntegration } from './useIntegration'
import { DEFAULT_N, DEFAULT_METHOD, DEFAULT_PRESET, MAX_N, MIN_N } from '@/utils/math/integration'

describe('useIntegration', () => {
  describe('initialization', () => {
    it('initializes with default values', () => {
      const integration = useIntegration()

      expect(integration.selectedPresetId.value).toBe(DEFAULT_PRESET)
      expect(integration.subdivisions.value).toBe(DEFAULT_N)
      expect(integration.method.value).toBe(DEFAULT_METHOD)
    })

    it('accepts initial options', () => {
      const integration = useIntegration({
        initialPreset: 'sine',
        initialA: 0,
        initialB: Math.PI,
        initialN: 20,
        initialMethod: 'trapezoidal',
      })

      expect(integration.selectedPresetId.value).toBe('sine')
      expect(integration.lowerBound.value).toBe(0)
      expect(integration.upperBound.value).toBe(Math.PI)
      expect(integration.subdivisions.value).toBe(20)
      expect(integration.method.value).toBe('trapezoidal')
    })
  })

  describe('preset selection', () => {
    it('updates bounds when selecting preset', () => {
      const integration = useIntegration()

      integration.selectPreset('sine')

      expect(integration.selectedPresetId.value).toBe('sine')
      expect(integration.lowerBound.value).toBe(0)
      expect(integration.upperBound.value).toBeCloseTo(Math.PI, 5)
    })

    it('ignores invalid preset IDs', () => {
      const integration = useIntegration()
      const originalPreset = integration.selectedPresetId.value

      integration.selectPreset('nonexistent')

      expect(integration.selectedPresetId.value).toBe(originalPreset)
    })

    it('resets subdivisions when selecting new preset', () => {
      const integration = useIntegration()
      integration.setSubdivisions(50)

      integration.selectPreset('linear')

      expect(integration.subdivisions.value).toBe(DEFAULT_N)
    })
  })

  describe('bounds management', () => {
    it('sets lower bound', () => {
      const integration = useIntegration()

      integration.setLowerBound(-5)

      expect(integration.lowerBound.value).toBe(-5)
    })

    it('sets upper bound', () => {
      const integration = useIntegration()

      integration.setUpperBound(10)

      expect(integration.upperBound.value).toBe(10)
    })

    it('sets both bounds at once', () => {
      const integration = useIntegration()

      integration.setBounds(-2, 5)

      expect(integration.lowerBound.value).toBe(-2)
      expect(integration.upperBound.value).toBe(5)
    })

    it('rejects non-finite bounds', () => {
      const integration = useIntegration()
      const originalA = integration.lowerBound.value

      integration.setLowerBound(Infinity)

      expect(integration.lowerBound.value).toBe(originalA)
    })

    it('validates bounds correctly', () => {
      const integration = useIntegration()

      integration.setBounds(0, 2)
      expect(integration.isValidBounds.value).toBe(true)

      integration.setBounds(2, 0)
      expect(integration.isValidBounds.value).toBe(false)

      integration.setBounds(1, 1)
      expect(integration.isValidBounds.value).toBe(false)
    })
  })

  describe('subdivisions', () => {
    it('sets subdivisions within range', () => {
      const integration = useIntegration()

      integration.setSubdivisions(50)

      expect(integration.subdivisions.value).toBe(50)
    })

    it('clamps subdivisions below MIN_N', () => {
      const integration = useIntegration()

      integration.setSubdivisions(0)

      expect(integration.subdivisions.value).toBe(MIN_N)
    })

    it('clamps subdivisions above MAX_N', () => {
      const integration = useIntegration()

      integration.setSubdivisions(500)

      expect(integration.subdivisions.value).toBe(MAX_N)
    })

    it('floors non-integer subdivisions', () => {
      const integration = useIntegration()

      integration.setSubdivisions(10.7)

      expect(integration.subdivisions.value).toBe(10)
    })
  })

  describe('method selection', () => {
    it('sets Riemann method', () => {
      const integration = useIntegration()

      integration.setMethod('simpson')

      expect(integration.method.value).toBe('simpson')
    })

    it('accepts all valid methods', () => {
      const integration = useIntegration()
      const methods = ['left', 'right', 'midpoint', 'trapezoidal', 'simpson'] as const

      methods.forEach((m) => {
        integration.setMethod(m)
        expect(integration.method.value).toBe(m)
      })
    })
  })

  describe('computed values', () => {
    it('computes selected preset', () => {
      const integration = useIntegration({ initialPreset: 'quadratic' })

      expect(integration.selectedPreset.value).toBeDefined()
      expect(integration.selectedPreset.value?.id).toBe('quadratic')
      expect(integration.selectedPreset.value?.name).toBe('Quadratic')
    })

    it('computes Riemann sum result', () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 2,
        initialN: 10,
        initialMethod: 'midpoint',
      })

      const result = integration.riemannResult.value
      expect(result).not.toBeNull()
      expect(result?.approximation).toBeCloseTo(8 / 3, 1)
      expect(result?.n).toBe(10)
      expect(result?.samplePoints.length).toBe(10)
    })

    it('returns null Riemann result for invalid bounds', () => {
      const integration = useIntegration({
        initialA: 5,
        initialB: 1, // Invalid: a > b
      })

      expect(integration.riemannResult.value).toBeNull()
    })

    it('computes exact value from antiderivative', () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 2,
      })

      expect(integration.exactValue.value).toBeCloseTo(8 / 3, 10)
    })

    it('computes integration result with error', () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 2,
        initialN: 100,
        initialMethod: 'midpoint',
      })

      const result = integration.integrationResult.value
      expect(result).not.toBeNull()
      expect(result?.exactValue).toBeCloseTo(8 / 3, 10)
      expect(result?.absoluteError).toBeDefined()
      expect(result?.relativeError).toBeDefined()
      expect(result?.relativeError).toBeLessThan(0.01) // Less than 1% error with n=100
    })

    it('generates function points for curve', () => {
      const integration = useIntegration({ initialPreset: 'quadratic' })

      const points = integration.functionPoints.value
      expect(points.length).toBeGreaterThan(50)
      expect(points[0]).toHaveProperty('x')
      expect(points[0]).toHaveProperty('y')
    })
  })

  describe('view domain', () => {
    it('sets view domain', () => {
      const integration = useIntegration()

      integration.setViewDomain(-5, 5)

      expect(integration.viewDomain.value.min).toBe(-5)
      expect(integration.viewDomain.value.max).toBe(5)
    })

    it('rejects invalid view domain', () => {
      const integration = useIntegration()
      const original = { ...integration.viewDomain.value }

      integration.setViewDomain(5, 0) // min > max

      expect(integration.viewDomain.value).toEqual(original)
    })
  })

  describe('reset methods', () => {
    it('resets to preset defaults', () => {
      const integration = useIntegration({ initialPreset: 'sine' })
      integration.setBounds(1, 5)
      integration.setSubdivisions(50)
      integration.setMethod('left')

      integration.resetToPresetDefaults()

      expect(integration.lowerBound.value).toBe(0)
      expect(integration.upperBound.value).toBeCloseTo(Math.PI, 5)
      expect(integration.subdivisions.value).toBe(DEFAULT_N)
      expect(integration.method.value).toBe(DEFAULT_METHOD)
    })

    it('resets to global defaults', () => {
      const integration = useIntegration()
      integration.selectPreset('sine')
      integration.setSubdivisions(50)
      integration.setMethod('simpson')

      integration.resetToDefaults()

      expect(integration.selectedPresetId.value).toBe(DEFAULT_PRESET)
      expect(integration.method.value).toBe(DEFAULT_METHOD)
      expect(integration.subdivisions.value).toBe(DEFAULT_N)
    })
  })

  describe('reactive updates', () => {
    it('recomputes results when bounds change', async () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 1,
        initialN: 100,
      })

      const result1 = integration.exactValue.value
      expect(result1).toBeCloseTo(1 / 3, 5)

      integration.setUpperBound(2)
      await nextTick()

      const result2 = integration.exactValue.value
      expect(result2).toBeCloseTo(8 / 3, 5)
    })

    it('recomputes results when n changes', async () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 2,
        initialN: 10,
      })

      const error10 = integration.integrationResult.value?.relativeError ?? 1

      integration.setSubdivisions(100)
      await nextTick()

      const error100 = integration.integrationResult.value?.relativeError ?? 1
      expect(error100).toBeLessThan(error10)
    })

    it('recomputes results when method changes', async () => {
      const integration = useIntegration({
        initialPreset: 'quadratic',
        initialA: 0,
        initialB: 2,
        initialN: 10,
      })

      integration.setMethod('left')
      await nextTick()
      const leftApprox = integration.riemannResult.value?.approximation ?? 0

      integration.setMethod('right')
      await nextTick()
      const rightApprox = integration.riemannResult.value?.approximation ?? 0

      // Left and right should give different results for non-constant functions
      expect(leftApprox).not.toBeCloseTo(rightApprox, 5)
    })
  })
})

describe('useIntegration with preset-specific tests', () => {
  it('handles sine preset correctly', () => {
    // Initialize with explicit bounds from sine preset
    const integration = useIntegration({
      initialPreset: 'sine',
      initialA: 0,
      initialB: Math.PI,
    })

    expect(integration.selectedPreset.value?.id).toBe('sine')
    expect(integration.exactValue.value).toBeCloseTo(2, 5)
  })

  it('handles exponential preset correctly', () => {
    // Initialize with explicit bounds from exponential preset
    const integration = useIntegration({
      initialPreset: 'exponential',
      initialA: 0,
      initialB: 1,
    })

    expect(integration.exactValue.value).toBeCloseTo(Math.E - 1, 5)
  })

  it('handles cubic-signed preset (with negative area)', () => {
    // Initialize with explicit bounds from cubic-signed preset
    const integration = useIntegration({
      initialPreset: 'cubic-signed',
      initialA: -1,
      initialB: 2,
    })

    expect(integration.exactValue.value).toBeCloseTo(2.25, 5)

    // The Riemann sum should include some negative areas
    const result = integration.riemannResult.value
    expect(result).not.toBeNull()
    const hasNegative = result!.areas.some((a) => a < 0)
    expect(hasNegative).toBe(true)
  })
})
