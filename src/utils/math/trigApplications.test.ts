import { describe, it, expect } from 'vitest'
import {
  // Rotation
  rotatePoint,
  rotatePointAround,
  rotationMatrix,
  // Circular motion
  circularMotion,
  orbitPosition,
  generateCirclePath,
  // Waves
  sineWave,
  cosineWave,
  generateWavePoints,
  combineWaves,
  // Angles
  angleToTarget,
  angleBetweenVectors,
  normalizeAngle,
  normalizeAngleSigned,
  angularDifference,
  // Projectile
  projectilePosition,
  projectileVelocity,
  projectileTrajectory,
  projectileRange,
  projectileMaxHeight,
  projectileFlightTime,
  optimalLaunchAngle,
  // Easing
  easeInOutSine,
  easeInSine,
  easeOutSine,
  bounce,
  pendulum,
  elastic,
  // Utility
  degreesToRadians,
  radiansToDegrees,
  distance,
  lerp,
  lerpPoint,
  // Presets
  TRIG_DEMO_PRESETS,
  getTrigDemoPreset,
  getPresetsByType,
  DEFAULT_GRAVITY,
} from './trigApplications'

const TOLERANCE = 1e-6

// ============= Rotation Tests =============

describe('rotatePoint', () => {
  it('should rotate (1, 0) by 90° to (0, 1)', () => {
    const result = rotatePoint({ x: 1, y: 0 }, 90)
    expect(result.x).toBeCloseTo(0, 6)
    expect(result.y).toBeCloseTo(1, 6)
  })

  it('should rotate (1, 0) by 180° to (-1, 0)', () => {
    const result = rotatePoint({ x: 1, y: 0 }, 180)
    expect(result.x).toBeCloseTo(-1, 6)
    expect(result.y).toBeCloseTo(0, 6)
  })

  it('should rotate (1, 0) by 45° correctly', () => {
    const result = rotatePoint({ x: 1, y: 0 }, 45)
    expect(result.x).toBeCloseTo(Math.sqrt(2) / 2, 6)
    expect(result.y).toBeCloseTo(Math.sqrt(2) / 2, 6)
  })

  it('should rotate (0, 1) by -90° to (1, 0)', () => {
    const result = rotatePoint({ x: 0, y: 1 }, -90)
    expect(result.x).toBeCloseTo(1, 6)
    expect(result.y).toBeCloseTo(0, 6)
  })

  it('should rotate by 360° back to original', () => {
    const original = { x: 3, y: 4 }
    const result = rotatePoint(original, 360)
    expect(result.x).toBeCloseTo(original.x, 6)
    expect(result.y).toBeCloseTo(original.y, 6)
  })

  it('should preserve distance from origin', () => {
    const point = { x: 3, y: 4 }
    const rotated = rotatePoint(point, 73)
    const originalDist = Math.sqrt(point.x ** 2 + point.y ** 2)
    const rotatedDist = Math.sqrt(rotated.x ** 2 + rotated.y ** 2)
    expect(rotatedDist).toBeCloseTo(originalDist, 6)
  })
})

describe('rotatePointAround', () => {
  it('should rotate around custom center', () => {
    const point = { x: 2, y: 0 }
    const center = { x: 1, y: 0 }
    const result = rotatePointAround(point, center, 90)
    expect(result.x).toBeCloseTo(1, 6)
    expect(result.y).toBeCloseTo(1, 6)
  })

  it('should return same point for 0° rotation', () => {
    const point = { x: 5, y: 3 }
    const center = { x: 2, y: 1 }
    const result = rotatePointAround(point, center, 0)
    expect(result.x).toBeCloseTo(point.x, 6)
    expect(result.y).toBeCloseTo(point.y, 6)
  })
})

describe('rotationMatrix', () => {
  it('should return identity-like matrix for 0°', () => {
    const matrix = rotationMatrix(0)
    expect(matrix[0][0]).toBeCloseTo(1, 6)
    expect(matrix[0][1]).toBeCloseTo(0, 6)
    expect(matrix[1][0]).toBeCloseTo(0, 6)
    expect(matrix[1][1]).toBeCloseTo(1, 6)
  })

  it('should return correct matrix for 90°', () => {
    const matrix = rotationMatrix(90)
    expect(matrix[0][0]).toBeCloseTo(0, 6)
    expect(matrix[0][1]).toBeCloseTo(-1, 6)
    expect(matrix[1][0]).toBeCloseTo(1, 6)
    expect(matrix[1][1]).toBeCloseTo(0, 6)
  })
})

// ============= Circular Motion Tests =============

describe('circularMotion', () => {
  it('should start at (radius, 0) for t=0', () => {
    const result = circularMotion(0, 100, 1)
    expect(result.x).toBeCloseTo(100, 6)
    expect(result.y).toBeCloseTo(0, 6)
  })

  it('should be at (0, radius) for t=π/2 with speed=1', () => {
    const result = circularMotion(Math.PI / 2, 100, 1)
    expect(result.x).toBeCloseTo(0, 6)
    expect(result.y).toBeCloseTo(100, 6)
  })

  it('should respect custom center', () => {
    const center = { x: 50, y: 50 }
    const result = circularMotion(0, 100, 1, center)
    expect(result.x).toBeCloseTo(150, 6)
    expect(result.y).toBeCloseTo(50, 6)
  })

  it('should complete full circle for t=2π', () => {
    const start = circularMotion(0, 100, 1)
    const end = circularMotion(2 * Math.PI, 100, 1)
    expect(end.x).toBeCloseTo(start.x, 6)
    expect(end.y).toBeCloseTo(start.y, 6)
  })
})

describe('orbitPosition', () => {
  it('should complete orbit in given period', () => {
    const period = 5
    const start = orbitPosition(0, 100, period)
    const end = orbitPosition(period, 100, period)
    expect(end.x).toBeCloseTo(start.x, 6)
    expect(end.y).toBeCloseTo(start.y, 6)
  })

  it('should be halfway around at half period', () => {
    const result = orbitPosition(2.5, 100, 5)
    expect(result.x).toBeCloseTo(-100, 6)
    expect(result.y).toBeCloseTo(0, 5)
  })
})

describe('generateCirclePath', () => {
  it('should generate correct number of points', () => {
    const points = generateCirclePath(100, 8)
    expect(points.length).toBe(8)
  })

  it('should place first point at (radius, 0)', () => {
    const points = generateCirclePath(100, 8)
    expect(points[0]!.x).toBeCloseTo(100, 6)
    expect(points[0]!.y).toBeCloseTo(0, 6)
  })

  it('should place points on circle', () => {
    const radius = 100
    const points = generateCirclePath(radius, 16)
    for (const point of points) {
      const dist = Math.sqrt(point.x ** 2 + point.y ** 2)
      expect(dist).toBeCloseTo(radius, 6)
    }
  })
})

// ============= Wave Tests =============

describe('sineWave', () => {
  it('should return 0 at t=0 with no phase', () => {
    const result = sineWave(0, { frequency: 1, amplitude: 1, phase: 0 })
    expect(result).toBeCloseTo(0, 6)
  })

  it('should return amplitude at t=1/(4*freq) (quarter period)', () => {
    const result = sineWave(0.25, { frequency: 1, amplitude: 2, phase: 0 })
    expect(result).toBeCloseTo(2, 6)
  })

  it('should respect amplitude', () => {
    const result = sineWave(0.25, { frequency: 1, amplitude: 5, phase: 0 })
    expect(result).toBeCloseTo(5, 6)
  })

  it('should respect frequency', () => {
    // At t=0.125 with freq=2, we're at quarter period
    const result = sineWave(0.125, { frequency: 2, amplitude: 1, phase: 0 })
    expect(result).toBeCloseTo(1, 6)
  })

  it('should respect phase shift', () => {
    // With phase=π/2, sine starts at peak
    const result = sineWave(0, { frequency: 1, amplitude: 1, phase: Math.PI / 2 })
    expect(result).toBeCloseTo(1, 6)
  })
})

describe('cosineWave', () => {
  it('should return amplitude at t=0 with no phase', () => {
    const result = cosineWave(0, { frequency: 1, amplitude: 1, phase: 0 })
    expect(result).toBeCloseTo(1, 6)
  })
})

describe('generateWavePoints', () => {
  it('should generate correct number of points', () => {
    const points = generateWavePoints({ frequency: 1, amplitude: 1, phase: 0 }, 1, 10)
    expect(points.length).toBe(11) // 0 to 10 inclusive
  })

  it('should have x values starting at 0', () => {
    const points = generateWavePoints({ frequency: 1, amplitude: 1, phase: 0 }, 1, 10)
    expect(points[0]!.x).toBeCloseTo(0, 6)
  })
})

describe('combineWaves', () => {
  it('should add waves together', () => {
    const waves = [
      { frequency: 1, amplitude: 1, phase: 0 },
      { frequency: 1, amplitude: 1, phase: 0 },
    ]
    const result = combineWaves(0.25, waves)
    expect(result).toBeCloseTo(2, 6) // Two waves at peak
  })

  it('should cancel opposite waves', () => {
    const waves = [
      { frequency: 1, amplitude: 1, phase: 0 },
      { frequency: 1, amplitude: 1, phase: Math.PI }, // Opposite phase
    ]
    const result = combineWaves(0.25, waves)
    expect(result).toBeCloseTo(0, 6)
  })
})

// ============= Angle Calculation Tests =============

describe('angleToTarget', () => {
  it('should return 0° for target to the right', () => {
    const result = angleToTarget({ x: 0, y: 0 }, { x: 1, y: 0 })
    expect(result).toBeCloseTo(0, 6)
  })

  it('should return 90° for target above', () => {
    const result = angleToTarget({ x: 0, y: 0 }, { x: 0, y: 1 })
    expect(result).toBeCloseTo(90, 6)
  })

  it('should return 180° for target to the left', () => {
    const result = angleToTarget({ x: 0, y: 0 }, { x: -1, y: 0 })
    expect(Math.abs(result)).toBeCloseTo(180, 6)
  })

  it('should return 45° for diagonal', () => {
    const result = angleToTarget({ x: 0, y: 0 }, { x: 1, y: 1 })
    expect(result).toBeCloseTo(45, 6)
  })
})

describe('angleBetweenVectors', () => {
  it('should return 0° for parallel vectors', () => {
    const result = angleBetweenVectors({ x: 1, y: 0 }, { x: 2, y: 0 })
    expect(result).toBeCloseTo(0, 6)
  })

  it('should return 90° for perpendicular vectors', () => {
    const result = angleBetweenVectors({ x: 1, y: 0 }, { x: 0, y: 1 })
    expect(result).toBeCloseTo(90, 6)
  })

  it('should return 180° for opposite vectors', () => {
    const result = angleBetweenVectors({ x: 1, y: 0 }, { x: -1, y: 0 })
    expect(result).toBeCloseTo(180, 6)
  })

  it('should handle zero vectors', () => {
    const result = angleBetweenVectors({ x: 0, y: 0 }, { x: 1, y: 0 })
    expect(result).toBe(0)
  })
})

describe('normalizeAngle', () => {
  it('should keep angles in [0, 360) unchanged', () => {
    expect(normalizeAngle(45)).toBe(45)
    expect(normalizeAngle(0)).toBe(0)
    expect(normalizeAngle(359)).toBe(359)
  })

  it('should wrap angles >= 360', () => {
    expect(normalizeAngle(360)).toBe(0)
    expect(normalizeAngle(450)).toBe(90)
    expect(normalizeAngle(720)).toBe(0)
  })

  it('should wrap negative angles', () => {
    expect(normalizeAngle(-90)).toBe(270)
    expect(normalizeAngle(-180)).toBe(180)
    expect(normalizeAngle(-360)).toBeCloseTo(0, 10) // Handle -0 vs 0
  })
})

describe('normalizeAngleSigned', () => {
  it('should return angles in [-180, 180)', () => {
    expect(normalizeAngleSigned(0)).toBe(0)
    expect(normalizeAngleSigned(90)).toBe(90)
    expect(normalizeAngleSigned(180)).toBe(-180)
    expect(normalizeAngleSigned(270)).toBe(-90)
  })
})

describe('angularDifference', () => {
  it('should return correct difference for simple cases', () => {
    expect(angularDifference(0, 90)).toBe(90)
    expect(angularDifference(90, 0)).toBe(-90)
  })

  it('should return shortest path across 0/360 boundary', () => {
    expect(angularDifference(350, 10)).toBe(20)
    expect(angularDifference(10, 350)).toBe(-20)
  })
})

// ============= Projectile Tests =============

describe('projectilePosition', () => {
  it('should start at origin by default', () => {
    const result = projectilePosition(0, { speed: 10, angleDeg: 45 })
    expect(result.x).toBeCloseTo(0, 6)
    expect(result.y).toBeCloseTo(0, 6)
  })

  it('should respect start position', () => {
    const result = projectilePosition(0, { speed: 10, angleDeg: 45, startX: 10, startY: 5 })
    expect(result.x).toBeCloseTo(10, 6)
    expect(result.y).toBeCloseTo(5, 6)
  })

  it('should move horizontally for 0° angle', () => {
    const result = projectilePosition(1, { speed: 10, angleDeg: 0, gravity: 0 })
    expect(result.x).toBeCloseTo(10, 6)
    expect(result.y).toBeCloseTo(0, 6)
  })
})

describe('projectileRange', () => {
  it('should be maximum at 45°', () => {
    const range45 = projectileRange({ speed: 20, angleDeg: 45 })
    const range30 = projectileRange({ speed: 20, angleDeg: 30 })
    const range60 = projectileRange({ speed: 20, angleDeg: 60 })
    expect(range45).toBeGreaterThan(range30)
    expect(range45).toBeGreaterThan(range60)
  })

  it('should be symmetric around 45°', () => {
    const range30 = projectileRange({ speed: 20, angleDeg: 30 })
    const range60 = projectileRange({ speed: 20, angleDeg: 60 })
    expect(range30).toBeCloseTo(range60, 6)
  })
})

describe('projectileMaxHeight', () => {
  it('should be 0 for 0° angle', () => {
    const height = projectileMaxHeight({ speed: 20, angleDeg: 0 })
    expect(height).toBeCloseTo(0, 6)
  })

  it('should increase with angle', () => {
    const height45 = projectileMaxHeight({ speed: 20, angleDeg: 45 })
    const height60 = projectileMaxHeight({ speed: 20, angleDeg: 60 })
    const height90 = projectileMaxHeight({ speed: 20, angleDeg: 90 })
    expect(height60).toBeGreaterThan(height45)
    expect(height90).toBeGreaterThan(height60)
  })
})

describe('projectileTrajectory', () => {
  it('should generate points', () => {
    const trajectory = projectileTrajectory({ speed: 20, angleDeg: 45 }, 10)
    expect(trajectory.length).toBeGreaterThan(0)
  })

  it('should start at origin', () => {
    const trajectory = projectileTrajectory({ speed: 20, angleDeg: 45 }, 10)
    expect(trajectory[0]!.x).toBeCloseTo(0, 6)
    expect(trajectory[0]!.y).toBeCloseTo(0, 6)
  })
})

describe('optimalLaunchAngle', () => {
  it('should return 45', () => {
    expect(optimalLaunchAngle()).toBe(45)
  })
})

// ============= Easing Tests =============

describe('easeInOutSine', () => {
  it('should return 0 at t=0', () => {
    expect(easeInOutSine(0)).toBeCloseTo(0, 6)
  })

  it('should return 1 at t=1', () => {
    expect(easeInOutSine(1)).toBeCloseTo(1, 6)
  })

  it('should return 0.5 at t=0.5', () => {
    expect(easeInOutSine(0.5)).toBeCloseTo(0.5, 6)
  })

  it('should be slow at start and end', () => {
    const earlySlope = easeInOutSine(0.1) - easeInOutSine(0)
    const midSlope = easeInOutSine(0.55) - easeInOutSine(0.45)
    expect(earlySlope).toBeLessThan(midSlope)
  })
})

describe('easeInSine', () => {
  it('should return 0 at t=0', () => {
    expect(easeInSine(0)).toBeCloseTo(0, 6)
  })

  it('should return 1 at t=1', () => {
    expect(easeInSine(1)).toBeCloseTo(1, 6)
  })
})

describe('easeOutSine', () => {
  it('should return 0 at t=0', () => {
    expect(easeOutSine(0)).toBeCloseTo(0, 6)
  })

  it('should return 1 at t=1', () => {
    expect(easeOutSine(1)).toBeCloseTo(1, 6)
  })
})

describe('bounce', () => {
  it('should return 0 at t=0', () => {
    expect(bounce(0)).toBeCloseTo(0, 6)
  })

  it('should return 0 at t=1', () => {
    expect(bounce(1)).toBeCloseTo(0, 6)
  })

  it('should have peaks in between', () => {
    const midValue = bounce(0.5)
    expect(midValue).toBeGreaterThan(0)
  })
})

describe('pendulum', () => {
  it('should return 0 at t=0', () => {
    expect(pendulum(0, 2, 1)).toBeCloseTo(0, 6)
  })

  it('should oscillate with given amplitude', () => {
    const amplitude = 5
    const maxValue = pendulum(0.5, 2, amplitude) // Half period
    expect(Math.abs(maxValue)).toBeLessThanOrEqual(amplitude + TOLERANCE)
  })
})

describe('elastic', () => {
  it('should return 0 at t=0', () => {
    expect(elastic(0)).toBe(0)
  })

  it('should return 1 at t=1', () => {
    expect(elastic(1)).toBe(1)
  })
})

// ============= Utility Tests =============

describe('degreesToRadians', () => {
  it('should convert 0° to 0', () => {
    expect(degreesToRadians(0)).toBe(0)
  })

  it('should convert 180° to π', () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 10)
  })

  it('should convert 90° to π/2', () => {
    expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 10)
  })
})

describe('radiansToDegrees', () => {
  it('should convert 0 to 0°', () => {
    expect(radiansToDegrees(0)).toBe(0)
  })

  it('should convert π to 180°', () => {
    expect(radiansToDegrees(Math.PI)).toBeCloseTo(180, 10)
  })
})

describe('distance', () => {
  it('should return 0 for same point', () => {
    expect(distance({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe(0)
  })

  it('should return correct distance for 3-4-5 triangle', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
  })
})

describe('lerp', () => {
  it('should return a at t=0', () => {
    expect(lerp(0, 10, 0)).toBe(0)
  })

  it('should return b at t=1', () => {
    expect(lerp(0, 10, 1)).toBe(10)
  })

  it('should return midpoint at t=0.5', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
  })
})

describe('lerpPoint', () => {
  it('should interpolate both coordinates', () => {
    const result = lerpPoint({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5)
    expect(result.x).toBe(5)
    expect(result.y).toBe(10)
  })
})

// ============= Preset Tests =============

describe('Presets', () => {
  it('should have presets for all demo types', () => {
    const types = new Set(TRIG_DEMO_PRESETS.map(p => p.demoType))
    expect(types.has('rotation')).toBe(true)
    expect(types.has('wave')).toBe(true)
    expect(types.has('circular')).toBe(true)
    expect(types.has('projectile')).toBe(true)
  })

  it('should get preset by id', () => {
    const preset = getTrigDemoPreset('rotate-45')
    expect(preset).toBeDefined()
    expect(preset?.demoType).toBe('rotation')
  })

  it('should return undefined for invalid id', () => {
    const preset = getTrigDemoPreset('invalid')
    expect(preset).toBeUndefined()
  })

  it('should filter presets by type', () => {
    const rotationPresets = getPresetsByType('rotation')
    expect(rotationPresets.length).toBeGreaterThan(0)
    expect(rotationPresets.every(p => p.demoType === 'rotation')).toBe(true)
  })
})
