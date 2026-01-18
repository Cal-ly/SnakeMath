import { describe, it, expect } from 'vitest'
import { useIsometricProjection } from './useIsometricProjection'
import type { Vector3D } from '@/types/math'

describe('useIsometricProjection', () => {
  describe('toScreen', () => {
    it('projects origin to screen origin', () => {
      const { toScreen } = useIsometricProjection({ origin: { x: 200, y: 200 } })
      const result = toScreen({ x: 0, y: 0, z: 0 })
      expect(result.x).toBeCloseTo(200)
      expect(result.y).toBeCloseTo(200)
    })

    it('projects positive X to the right', () => {
      const { toScreen } = useIsometricProjection({ origin: { x: 200, y: 200 }, scale: 35 })
      const origin = toScreen({ x: 0, y: 0, z: 0 })
      const xPositive = toScreen({ x: 1, y: 0, z: 0 })
      expect(xPositive.x).toBeGreaterThan(origin.x)
    })

    it('projects positive Y upward (lower screen Y)', () => {
      const { toScreen } = useIsometricProjection({ origin: { x: 200, y: 200 }, scale: 35 })
      const origin = toScreen({ x: 0, y: 0, z: 0 })
      const yPositive = toScreen({ x: 0, y: 1, z: 0 })
      expect(yPositive.y).toBeLessThan(origin.y)
    })

    it('projects positive Z to the right (toward viewer)', () => {
      const { toScreen } = useIsometricProjection({ origin: { x: 200, y: 200 }, scale: 35 })
      const origin = toScreen({ x: 0, y: 0, z: 0 })
      const zPositive = toScreen({ x: 0, y: 0, z: 1 })
      // Z now goes to the right (toward viewer) in the new projection
      expect(zPositive.x).toBeGreaterThan(origin.x)
    })

    it('respects scale parameter', () => {
      const { toScreen: toScreen1 } = useIsometricProjection({
        origin: { x: 200, y: 200 },
        scale: 35,
      })
      const { toScreen: toScreen2 } = useIsometricProjection({
        origin: { x: 200, y: 200 },
        scale: 70,
      })

      const p1 = toScreen1({ x: 1, y: 0, z: 0 })
      const p2 = toScreen2({ x: 1, y: 0, z: 0 })

      // Point should be twice as far from origin with double scale
      expect(p2.x - 200).toBeCloseTo((p1.x - 200) * 2)
    })

    it('Y axis is straight up (constant X)', () => {
      const { toScreen } = useIsometricProjection({ origin: { x: 200, y: 200 } })
      const yPoint0 = toScreen({ x: 0, y: 0, z: 0 })
      const yPoint1 = toScreen({ x: 0, y: 1, z: 0 })
      const yPoint2 = toScreen({ x: 0, y: 2, z: 0 })
      // All X coordinates should be the same
      expect(yPoint1.x).toBeCloseTo(yPoint0.x)
      expect(yPoint2.x).toBeCloseTo(yPoint0.x)
    })

    it('X and Z have same horizontal displacement (symmetric isometric facing viewer)', () => {
      const { toScreen } = useIsometricProjection({ origin: { x: 200, y: 200 }, scale: 35 })
      const origin = toScreen({ x: 0, y: 0, z: 0 })
      const xUnit = toScreen({ x: 1, y: 0, z: 0 })
      const zUnit = toScreen({ x: 0, y: 0, z: 1 })

      const xDeltaX = xUnit.x - origin.x
      const xDeltaY = xUnit.y - origin.y
      const zDeltaX = zUnit.x - origin.x
      const zDeltaY = zUnit.y - origin.y

      // X and Z both go right with same horizontal displacement
      expect(xDeltaX).toBeCloseTo(zDeltaX)
      // But X goes down while Z goes up (mirrored vertically)
      expect(xDeltaY).toBeCloseTo(-zDeltaY)
    })
  })

  describe('toWorld', () => {
    it('round-trips origin correctly', () => {
      const { toScreen, toWorld } = useIsometricProjection({ origin: { x: 200, y: 200 } })
      const screen = toScreen({ x: 0, y: 0, z: 0 })
      const world = toWorld(screen.x, screen.y)
      expect(world.x).toBeCloseTo(0)
      expect(world.y).toBe(0) // Always 0 for XZ plane
      expect(world.z).toBeCloseTo(0)
    })

    it('round-trips point on XZ plane', () => {
      const { toScreen, toWorld } = useIsometricProjection({ origin: { x: 200, y: 200 } })
      const original: Vector3D = { x: 2, y: 0, z: 3 }
      const screen = toScreen(original)
      const recovered = toWorld(screen.x, screen.y)
      expect(recovered.x).toBeCloseTo(original.x)
      expect(recovered.y).toBe(0)
      expect(recovered.z).toBeCloseTo(original.z)
    })

    it('projects Y component to XZ plane', () => {
      const { toScreen, toWorld } = useIsometricProjection({ origin: { x: 200, y: 200 } })
      const withY: Vector3D = { x: 2, y: 5, z: 3 }
      const screen = toScreen(withY)
      const recovered = toWorld(screen.x, screen.y)
      // Result should be on XZ plane but NOT match original x,z
      // (because Y displacement affects screen position)
      expect(recovered.y).toBe(0)
    })
  })

  describe('generateGridLines', () => {
    it('generates correct number of grid lines', () => {
      const { generateGridLines } = useIsometricProjection()
      const lines = generateGridLines(3)
      // For size 3: -3 to +3 = 7 lines per direction, 2 directions
      expect(lines).toHaveLength(14)
    })

    it('generates grid lines with valid coordinates', () => {
      const { generateGridLines } = useIsometricProjection({ origin: { x: 200, y: 200 } })
      const lines = generateGridLines(2)
      for (const line of lines) {
        expect(Number.isFinite(line.x1)).toBe(true)
        expect(Number.isFinite(line.y1)).toBe(true)
        expect(Number.isFinite(line.x2)).toBe(true)
        expect(Number.isFinite(line.y2)).toBe(true)
      }
    })
  })

  describe('generateGridPath', () => {
    it('generates valid SVG path string', () => {
      const { generateGridPath } = useIsometricProjection()
      const path = generateGridPath(2)
      expect(path).toMatch(/^M[\d.]+,[\d.]+L[\d.]+,[\d.]+/)
      expect(path).toContain('M')
      expect(path).toContain('L')
    })

    it('contains correct number of path segments', () => {
      const { generateGridPath } = useIsometricProjection()
      const path = generateGridPath(2)
      // Count the number of M commands (one per line)
      const mCount = (path.match(/M/g) || []).length
      expect(mCount).toBe(10) // 5 lines per direction × 2 directions
    })
  })

  describe('generateMarkers', () => {
    it('generates markers for all three axes', () => {
      const { generateMarkers } = useIsometricProjection()
      const markers = generateMarkers(3)

      const xMarkers = markers.filter((m) => m.axis === 'x')
      const yMarkers = markers.filter((m) => m.axis === 'y')
      const zMarkers = markers.filter((m) => m.axis === 'z')

      expect(xMarkers.length).toBeGreaterThan(0)
      expect(yMarkers.length).toBeGreaterThan(0)
      expect(zMarkers.length).toBeGreaterThan(0)
    })

    it('excludes origin from markers', () => {
      const { generateMarkers } = useIsometricProjection()
      const markers = generateMarkers(3)

      const originMarkers = markers.filter((m) => m.label === '0')
      expect(originMarkers).toHaveLength(0)
    })

    it('includes both positive and negative values', () => {
      const { generateMarkers } = useIsometricProjection()
      const markers = generateMarkers(3)

      const positiveLabels = markers.filter((m) => parseInt(m.label) > 0)
      const negativeLabels = markers.filter((m) => parseInt(m.label) < 0)

      expect(positiveLabels.length).toBeGreaterThan(0)
      expect(negativeLabels.length).toBeGreaterThan(0)
    })

    it('generates correct number of markers', () => {
      const { generateMarkers } = useIsometricProjection()
      const markers = generateMarkers(3)
      // Range 3: -3 to +3, excluding 0 = 6 values per axis
      // 3 axes × 6 = 18 markers
      expect(markers).toHaveLength(18)
    })
  })

  describe('generateAxes', () => {
    it('generates positive and negative axes for all three axes', () => {
      const { generateAxes } = useIsometricProjection()
      const axes = generateAxes()

      expect(axes.positive.x).toBeDefined()
      expect(axes.positive.y).toBeDefined()
      expect(axes.positive.z).toBeDefined()
      expect(axes.negative.x).toBeDefined()
      expect(axes.negative.y).toBeDefined()
      expect(axes.negative.z).toBeDefined()
    })

    it('all axes start from origin', () => {
      const { generateAxes, toScreen } = useIsometricProjection({ origin: { x: 200, y: 200 } })
      const axes = generateAxes()
      const origin = toScreen({ x: 0, y: 0, z: 0 })

      expect(axes.positive.x.x1).toBeCloseTo(origin.x)
      expect(axes.positive.x.y1).toBeCloseTo(origin.y)
      expect(axes.positive.y.x1).toBeCloseTo(origin.x)
      expect(axes.positive.y.y1).toBeCloseTo(origin.y)
      expect(axes.positive.z.x1).toBeCloseTo(origin.x)
      expect(axes.positive.z.y1).toBeCloseTo(origin.y)
    })

    it('respects custom axis lengths', () => {
      const { generateAxes, toScreen } = useIsometricProjection({
        origin: { x: 200, y: 200 },
        scale: 35,
      })
      const axes = generateAxes({ positiveLength: 4, negativeLength: 2 })
      const xEnd = toScreen({ x: 4, y: 0, z: 0 })

      expect(axes.positive.x.x2).toBeCloseTo(xEnd.x)
      expect(axes.positive.x.y2).toBeCloseTo(xEnd.y)
    })
  })

  describe('generateVectorPath', () => {
    it('generates line and arrow paths', () => {
      const { generateVectorPath } = useIsometricProjection()
      const { line, arrow } = generateVectorPath({ x: 0, y: 0, z: 0 }, { x: 2, y: 1, z: 0 })

      expect(line).toMatch(/^M[\d.-]+,[\d.-]+L[\d.-]+,[\d.-]+$/)
      expect(arrow).toMatch(/^M[\d.-]+,[\d.-]+L[\d.-]+,[\d.-]+L[\d.-]+,[\d.-]+Z$/)
    })

    it('returns empty strings for zero-length vector', () => {
      const { generateVectorPath } = useIsometricProjection()
      const { line, arrow } = generateVectorPath({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 })

      expect(line).toBe('')
      expect(arrow).toBe('')
    })

    it('generates different paths for different vectors', () => {
      const { generateVectorPath } = useIsometricProjection()
      const origin = { x: 0, y: 0, z: 0 }

      const path1 = generateVectorPath(origin, { x: 1, y: 0, z: 0 })
      const path2 = generateVectorPath(origin, { x: 0, y: 1, z: 0 })

      expect(path1.line).not.toBe(path2.line)
    })
  })

  describe('projectToXZPlane', () => {
    it('sets Y to zero', () => {
      const { projectToXZPlane } = useIsometricProjection()
      const result = projectToXZPlane({ x: 3, y: 5, z: 2 })
      expect(result).toEqual({ x: 3, y: 0, z: 2 })
    })

    it('preserves X and Z', () => {
      const { projectToXZPlane } = useIsometricProjection()
      const result = projectToXZPlane({ x: -2, y: 10, z: 4 })
      expect(result.x).toBe(-2)
      expect(result.z).toBe(4)
    })
  })

  describe('generateDropLine', () => {
    it('generates line from point to XZ plane', () => {
      const { generateDropLine, toScreen } = useIsometricProjection()
      const point: Vector3D = { x: 2, y: 3, z: 1 }
      const line = generateDropLine(point)

      const pointScreen = toScreen(point)
      const projectionScreen = toScreen({ x: 2, y: 0, z: 1 })

      expect(line.x1).toBeCloseTo(pointScreen.x)
      expect(line.y1).toBeCloseTo(pointScreen.y)
      expect(line.x2).toBeCloseTo(projectionScreen.x)
      expect(line.y2).toBeCloseTo(projectionScreen.y)
    })

    it('returns same point for point on XZ plane', () => {
      const { generateDropLine } = useIsometricProjection()
      const point: Vector3D = { x: 2, y: 0, z: 1 }
      const line = generateDropLine(point)

      expect(line.x1).toBeCloseTo(line.x2)
      expect(line.y1).toBeCloseTo(line.y2)
    })
  })

  describe('config', () => {
    it('returns default config when no config provided', () => {
      const { config } = useIsometricProjection()
      expect(config.value.scale).toBe(35)
      expect(config.value.angle).toBeCloseTo(Math.PI / 6)
      expect(config.value.origin).toEqual({ x: 200, y: 200 })
    })

    it('merges partial config with defaults', () => {
      const { config } = useIsometricProjection({ scale: 50 })
      expect(config.value.scale).toBe(50)
      expect(config.value.angle).toBeCloseTo(Math.PI / 6) // Default
      expect(config.value.origin).toEqual({ x: 200, y: 200 }) // Default
    })

    it('uses all provided config values', () => {
      const { config } = useIsometricProjection({
        scale: 40,
        angle: Math.PI / 4,
        origin: { x: 300, y: 250 },
      })
      expect(config.value.scale).toBe(40)
      expect(config.value.angle).toBeCloseTo(Math.PI / 4)
      expect(config.value.origin).toEqual({ x: 300, y: 250 })
    })
  })
})
