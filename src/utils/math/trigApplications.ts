/**
 * Trigonometry Applications
 *
 * Practical trig functions that programmers actually use:
 * - 2D Rotation
 * - Circular motion
 * - Wave generation
 * - Angle calculations
 * - Projectile motion
 * - Animation easing
 */

// ============= Types =============

export interface Point2D {
  x: number
  y: number
}

export interface Vector2D {
  x: number
  y: number
}

export interface WaveParams {
  frequency: number
  amplitude: number
  phase: number
}

export interface ProjectileParams {
  speed: number
  angleDeg: number
  gravity?: number
  startX?: number
  startY?: number
}

export interface ProjectileState {
  position: Point2D
  velocity: Vector2D
  time: number
}

export type DemoType = 'rotation' | 'wave' | 'circular' | 'projectile'

// ============= Constants =============

/** Default gravity for projectile motion (m/s²) */
export const DEFAULT_GRAVITY = 9.8

/** Tolerance for floating point comparisons */
const TOLERANCE = 1e-10

// ============= Rotation Functions =============

/**
 * Rotate a point around the origin by a given angle
 */
export function rotatePoint(point: Point2D, angleDeg: number): Point2D {
  const rad = degreesToRadians(angleDeg)
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  }
}

/**
 * Rotate a point around a custom center point
 */
export function rotatePointAround(
  point: Point2D,
  center: Point2D,
  angleDeg: number
): Point2D {
  // Translate to origin
  const translated: Point2D = {
    x: point.x - center.x,
    y: point.y - center.y,
  }

  // Rotate
  const rotated = rotatePoint(translated, angleDeg)

  // Translate back
  return {
    x: rotated.x + center.x,
    y: rotated.y + center.y,
  }
}

/**
 * Get the 2x2 rotation matrix for a given angle
 */
export function rotationMatrix(angleDeg: number): [[number, number], [number, number]] {
  const rad = degreesToRadians(angleDeg)
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  return [
    [cos, -sin],
    [sin, cos],
  ]
}

// ============= Circular Motion =============

/**
 * Calculate position on a circle at time t
 * Position = center + (radius * cos(speed * t), radius * sin(speed * t))
 */
export function circularMotion(
  t: number,
  radius: number,
  speed: number,
  center: Point2D = { x: 0, y: 0 }
): Point2D {
  const angle = speed * t
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  }
}

/**
 * Calculate position for orbital motion with a given period
 */
export function orbitPosition(
  t: number,
  radius: number,
  periodSeconds: number,
  center: Point2D = { x: 0, y: 0 }
): Point2D {
  const angularSpeed = (2 * Math.PI) / periodSeconds
  return circularMotion(t, radius, angularSpeed, center)
}

/**
 * Generate points along a circular path
 */
export function generateCirclePath(
  radius: number,
  numPoints: number,
  center: Point2D = { x: 0, y: 0 }
): Point2D[] {
  const points: Point2D[] = []
  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints
    points.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    })
  }
  return points
}

// ============= Wave Functions =============

/**
 * Calculate sine wave value at time t
 * y = amplitude * sin(2π * frequency * t + phase)
 */
export function sineWave(t: number, params: WaveParams): number {
  return params.amplitude * Math.sin(2 * Math.PI * params.frequency * t + params.phase)
}

/**
 * Calculate cosine wave value at time t
 */
export function cosineWave(t: number, params: WaveParams): number {
  return params.amplitude * Math.cos(2 * Math.PI * params.frequency * t + params.phase)
}

/**
 * Generate wave points over a duration
 */
export function generateWavePoints(
  params: WaveParams,
  duration: number,
  sampleRate: number
): Point2D[] {
  const points: Point2D[] = []
  const numSamples = Math.floor(duration * sampleRate)

  for (let i = 0; i <= numSamples; i++) {
    const t = (i / sampleRate)
    points.push({
      x: t,
      y: sineWave(t, params),
    })
  }

  return points
}

/**
 * Combine multiple waves (additive synthesis)
 */
export function combineWaves(t: number, waves: WaveParams[]): number {
  return waves.reduce((sum, wave) => sum + sineWave(t, wave), 0)
}

// ============= Angle Calculations =============

/**
 * Calculate angle from one point to another using atan2
 */
export function angleToTarget(from: Point2D, to: Point2D): number {
  const dx = to.x - from.x
  const dy = to.y - from.y
  return radiansToDegrees(Math.atan2(dy, dx))
}

/**
 * Calculate angle between two vectors
 */
export function angleBetweenVectors(v1: Vector2D, v2: Vector2D): number {
  const dot = v1.x * v2.x + v1.y * v2.y
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y)
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y)

  if (mag1 < TOLERANCE || mag2 < TOLERANCE) {
    return 0
  }

  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)))
  return radiansToDegrees(Math.acos(cosAngle))
}

/**
 * Normalize an angle to [0, 360) range
 */
export function normalizeAngle(angleDeg: number): number {
  let result = angleDeg % 360
  if (result < 0) result += 360
  return result
}

/**
 * Normalize an angle to [-180, 180) range
 */
export function normalizeAngleSigned(angleDeg: number): number {
  let result = normalizeAngle(angleDeg)
  if (result >= 180) result -= 360
  return result
}

/**
 * Calculate the shortest angular difference between two angles
 */
export function angularDifference(angle1: number, angle2: number): number {
  const diff = normalizeAngle(angle2 - angle1)
  return diff > 180 ? diff - 360 : diff
}

// ============= Projectile Motion =============

/**
 * Calculate projectile position at time t
 */
export function projectilePosition(t: number, params: ProjectileParams): Point2D {
  const gravity = params.gravity ?? DEFAULT_GRAVITY
  const startX = params.startX ?? 0
  const startY = params.startY ?? 0
  const rad = degreesToRadians(params.angleDeg)

  const vx = params.speed * Math.cos(rad)
  const vy = params.speed * Math.sin(rad)

  return {
    x: startX + vx * t,
    y: startY + vy * t - 0.5 * gravity * t * t,
  }
}

/**
 * Calculate projectile velocity at time t
 */
export function projectileVelocity(t: number, params: ProjectileParams): Vector2D {
  const gravity = params.gravity ?? DEFAULT_GRAVITY
  const rad = degreesToRadians(params.angleDeg)

  const vx = params.speed * Math.cos(rad)
  const vy = params.speed * Math.sin(rad)

  return {
    x: vx,
    y: vy - gravity * t,
  }
}

/**
 * Generate trajectory points for a projectile
 */
export function projectileTrajectory(
  params: ProjectileParams,
  steps: number
): Point2D[] {
  const flightTime = projectileFlightTime(params)
  const points: Point2D[] = []

  for (let i = 0; i <= steps; i++) {
    const t = (flightTime * i) / steps
    const pos = projectilePosition(t, params)
    // Stop if projectile goes below starting height
    if (pos.y < (params.startY ?? 0) && i > 0) break
    points.push(pos)
  }

  return points
}

/**
 * Calculate horizontal range of projectile
 */
export function projectileRange(params: ProjectileParams): number {
  const gravity = params.gravity ?? DEFAULT_GRAVITY
  const rad = degreesToRadians(params.angleDeg)

  // Range formula: R = v² * sin(2θ) / g
  return (params.speed * params.speed * Math.sin(2 * rad)) / gravity
}

/**
 * Calculate maximum height of projectile
 */
export function projectileMaxHeight(params: ProjectileParams): number {
  const gravity = params.gravity ?? DEFAULT_GRAVITY
  const rad = degreesToRadians(params.angleDeg)
  const vy = params.speed * Math.sin(rad)

  // Max height: H = vy² / (2g)
  return (vy * vy) / (2 * gravity) + (params.startY ?? 0)
}

/**
 * Calculate total flight time of projectile
 */
export function projectileFlightTime(params: ProjectileParams): number {
  const gravity = params.gravity ?? DEFAULT_GRAVITY
  const rad = degreesToRadians(params.angleDeg)
  const vy = params.speed * Math.sin(rad)

  // Flight time: T = 2 * vy / g
  return (2 * vy) / gravity
}

/**
 * Calculate optimal launch angle for maximum range
 */
export function optimalLaunchAngle(): number {
  // 45 degrees gives maximum range on flat ground
  return 45
}

// ============= Animation Easing =============

/**
 * Ease in/out using sine curve
 * Smooth start and stop (slow at edges, fast in middle)
 */
export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

/**
 * Ease in using sine (slow start)
 */
export function easeInSine(t: number): number {
  return 1 - Math.cos((t * Math.PI) / 2)
}

/**
 * Ease out using sine (slow end)
 */
export function easeOutSine(t: number): number {
  return Math.sin((t * Math.PI) / 2)
}

/**
 * Bounce effect using sine
 */
export function bounce(t: number, bounces: number = 3): number {
  return Math.abs(Math.sin(bounces * Math.PI * t)) * (1 - t)
}

/**
 * Pendulum oscillation
 */
export function pendulum(t: number, period: number, amplitude: number): number {
  return amplitude * Math.sin((2 * Math.PI * t) / period)
}

/**
 * Elastic effect
 */
export function elastic(t: number): number {
  const c4 = (2 * Math.PI) / 3
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
}

// ============= Utility Functions =============

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Linear interpolation between two points
 */
export function lerpPoint(p1: Point2D, p2: Point2D, t: number): Point2D {
  return {
    x: lerp(p1.x, p2.x, t),
    y: lerp(p1.y, p2.y, t),
  }
}

// ============= Demo Presets =============

export interface TrigDemoPreset {
  id: string
  name: string
  description: string
  demoType: DemoType
  params: Record<string, number>
}

export const TRIG_DEMO_PRESETS: TrigDemoPreset[] = [
  // Rotation presets
  {
    id: 'rotate-45',
    name: 'Rotate 45°',
    description: 'Rotate point by 45 degrees',
    demoType: 'rotation',
    params: { x: 100, y: 0, angle: 45 },
  },
  {
    id: 'rotate-90',
    name: 'Rotate 90°',
    description: 'Rotate point by 90 degrees (quarter turn)',
    demoType: 'rotation',
    params: { x: 100, y: 0, angle: 90 },
  },
  {
    id: 'rotate-180',
    name: 'Rotate 180°',
    description: 'Rotate point by 180 degrees (half turn)',
    demoType: 'rotation',
    params: { x: 100, y: 0, angle: 180 },
  },

  // Wave presets
  {
    id: 'wave-simple',
    name: 'Simple Wave',
    description: 'Basic sine wave: 1 Hz, amplitude 1',
    demoType: 'wave',
    params: { frequency: 1, amplitude: 1, phase: 0 },
  },
  {
    id: 'wave-fast',
    name: 'Fast Wave',
    description: 'Higher frequency wave: 3 Hz',
    demoType: 'wave',
    params: { frequency: 3, amplitude: 1, phase: 0 },
  },
  {
    id: 'wave-shifted',
    name: 'Phase Shifted',
    description: 'Wave with π/2 phase shift (starts at peak)',
    demoType: 'wave',
    params: { frequency: 1, amplitude: 1, phase: Math.PI / 2 },
  },

  // Circular motion presets
  {
    id: 'orbit-slow',
    name: 'Slow Orbit',
    description: '10 second orbital period',
    demoType: 'circular',
    params: { radius: 80, period: 10 },
  },
  {
    id: 'orbit-fast',
    name: 'Fast Orbit',
    description: '2 second orbital period',
    demoType: 'circular',
    params: { radius: 80, period: 2 },
  },
  {
    id: 'orbit-ellipse',
    name: 'Elliptical',
    description: 'Elliptical orbit (different x/y radii)',
    demoType: 'circular',
    params: { radiusX: 100, radiusY: 50, period: 5 },
  },

  // Projectile presets
  {
    id: 'projectile-45',
    name: '45° Launch',
    description: 'Optimal angle for maximum range',
    demoType: 'projectile',
    params: { speed: 20, angle: 45 },
  },
  {
    id: 'projectile-high',
    name: 'High Arc',
    description: '70° launch - high but short range',
    demoType: 'projectile',
    params: { speed: 20, angle: 70 },
  },
  {
    id: 'projectile-low',
    name: 'Low Arc',
    description: '20° launch - low and fast',
    demoType: 'projectile',
    params: { speed: 20, angle: 20 },
  },
]

/**
 * Get preset by ID
 */
export function getTrigDemoPreset(id: string): TrigDemoPreset | undefined {
  return TRIG_DEMO_PRESETS.find(p => p.id === id)
}

/**
 * Get presets by demo type
 */
export function getPresetsByType(demoType: DemoType): TrigDemoPreset[] {
  return TRIG_DEMO_PRESETS.filter(p => p.demoType === demoType)
}
