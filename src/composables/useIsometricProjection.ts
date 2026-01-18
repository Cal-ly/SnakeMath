/**
 * Composable for isometric projection of 3D points to 2D screen coordinates
 *
 * Uses a standard isometric projection with configurable scale and origin.
 * Right-handed, Y-up coordinate system (D-122).
 *
 * Isometric projection angles (facing user):
 * - X-axis: 30° below horizontal, going right
 * - Y-axis: Straight up
 * - Z-axis: 30° below horizontal, going right (toward viewer)
 */

import { computed, unref, type MaybeRef } from 'vue'
import type { Vector3D } from '@/types/math'

// ============================================================================
// Types
// ============================================================================

export interface IsometricConfig {
  /** Pixels per unit (default: 35) */
  scale: number
  /** Isometric angle in radians (default: π/6 = 30°) */
  angle: number
  /** SVG origin point (center of the canvas) */
  origin: { x: number; y: number }
}

export interface ScreenPoint {
  x: number
  y: number
}

export interface GridLine {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface AxisConfig {
  /** Positive axis length in units */
  positiveLength: number
  /** Negative axis length in units (shown as dashed) */
  negativeLength: number
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_CONFIG: IsometricConfig = {
  scale: 35,
  angle: Math.PI / 6, // 30 degrees
  origin: { x: 200, y: 200 },
}

// ============================================================================
// Composable
// ============================================================================

export function useIsometricProjection(config?: MaybeRef<Partial<IsometricConfig>>) {
  // Merge config with defaults
  const resolvedConfig = computed<IsometricConfig>(() => {
    const userConfig = unref(config) || {}
    return {
      scale: userConfig.scale ?? DEFAULT_CONFIG.scale,
      angle: userConfig.angle ?? DEFAULT_CONFIG.angle,
      origin: userConfig.origin ?? DEFAULT_CONFIG.origin,
    }
  })

  // Pre-compute sin/cos for efficiency
  const cosAngle = computed(() => Math.cos(resolvedConfig.value.angle))
  const sinAngle = computed(() => Math.sin(resolvedConfig.value.angle))

  /**
   * Convert a 3D point to 2D screen coordinates
   *
   * Isometric projection formula (Y-up, right-handed, facing viewer):
   * screenX = origin.x + scale * (x * cos(angle) + z * cos(angle))
   * screenY = origin.y - scale * (y + x * sin(angle) - z * sin(angle))
   *
   * The Y is negated because SVG Y increases downward.
   * Z is added to X (not subtracted) so positive Z goes toward the viewer (lower-right).
   */
  function toScreen(point: Vector3D): ScreenPoint {
    const { scale, origin } = resolvedConfig.value
    const cos = cosAngle.value
    const sin = sinAngle.value

    return {
      x: origin.x + scale * (point.x * cos + point.z * cos),
      y: origin.y - scale * (point.y + point.x * sin - point.z * sin),
    }
  }

  /**
   * Convert screen coordinates back to 3D (on the XZ plane, y=0)
   * This is useful for interaction with the grid plane.
   */
  function toWorld(screenX: number, screenY: number): Vector3D {
    const { scale, origin } = resolvedConfig.value
    const cos = cosAngle.value
    const sin = sinAngle.value

    // Invert the projection equations for y=0 (facing viewer):
    // screenX - origin.x = scale * (x * cos + z * cos)
    // origin.y - screenY = scale * (x * sin - z * sin)
    //
    // Let dx = (screenX - origin.x) / scale
    // Let dy = (origin.y - screenY) / scale
    //
    // dx = x * cos + z * cos = (x + z) * cos
    // dy = x * sin - z * sin = (x - z) * sin
    //
    // From these: x + z = dx / cos
    //             x - z = dy / sin
    // Solving:    2x = dx/cos + dy/sin
    //             2z = dx/cos - dy/sin

    const dx = (screenX - origin.x) / scale
    const dy = (origin.y - screenY) / scale

    const x = (dx / cos + dy / sin) / 2
    const z = (dx / cos - dy / sin) / 2

    return { x, y: 0, z }
  }

  /**
   * Generate grid lines for the XZ plane (floor grid)
   * Grid lines are at integer coordinates from -size to +size
   */
  function generateGridLines(size: number): GridLine[] {
    const lines: GridLine[] = []

    // Lines parallel to X-axis (varying Z)
    for (let z = -size; z <= size; z++) {
      const start = toScreen({ x: -size, y: 0, z })
      const end = toScreen({ x: size, y: 0, z })
      lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y })
    }

    // Lines parallel to Z-axis (varying X)
    for (let x = -size; x <= size; x++) {
      const start = toScreen({ x, y: 0, z: -size })
      const end = toScreen({ x, y: 0, z: size })
      lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y })
    }

    return lines
  }

  /**
   * Generate SVG path string for the grid
   */
  function generateGridPath(size: number): string {
    const lines = generateGridLines(size)
    return lines.map((l) => `M${l.x1},${l.y1}L${l.x2},${l.y2}`).join(' ')
  }

  /**
   * Generate coordinate markers for each axis
   * Returns an array of { position: ScreenPoint, label: string, axis: 'x' | 'y' | 'z' }
   */
  function generateMarkers(range: number): Array<{
    position: ScreenPoint
    label: string
    axis: 'x' | 'y' | 'z'
  }> {
    const markers: Array<{ position: ScreenPoint; label: string; axis: 'x' | 'y' | 'z' }> = []

    // X-axis markers
    for (let i = -range; i <= range; i++) {
      if (i === 0) continue // Skip origin
      markers.push({
        position: toScreen({ x: i, y: 0, z: 0 }),
        label: String(i),
        axis: 'x',
      })
    }

    // Y-axis markers
    for (let i = -range; i <= range; i++) {
      if (i === 0) continue
      markers.push({
        position: toScreen({ x: 0, y: i, z: 0 }),
        label: String(i),
        axis: 'y',
      })
    }

    // Z-axis markers
    for (let i = -range; i <= range; i++) {
      if (i === 0) continue
      markers.push({
        position: toScreen({ x: 0, y: 0, z: i }),
        label: String(i),
        axis: 'z',
      })
    }

    return markers
  }

  /**
   * Generate axis line data for rendering
   */
  function generateAxes(config: AxisConfig = { positiveLength: 5, negativeLength: 3 }): {
    positive: { x: GridLine; y: GridLine; z: GridLine }
    negative: { x: GridLine; y: GridLine; z: GridLine }
  } {
    const origin3D = { x: 0, y: 0, z: 0 }
    const originScreen = toScreen(origin3D)

    const xPos = toScreen({ x: config.positiveLength, y: 0, z: 0 })
    const xNeg = toScreen({ x: -config.negativeLength, y: 0, z: 0 })
    const yPos = toScreen({ x: 0, y: config.positiveLength, z: 0 })
    const yNeg = toScreen({ x: 0, y: -config.negativeLength, z: 0 })
    const zPos = toScreen({ x: 0, y: 0, z: config.positiveLength })
    const zNeg = toScreen({ x: 0, y: 0, z: -config.negativeLength })

    return {
      positive: {
        x: { x1: originScreen.x, y1: originScreen.y, x2: xPos.x, y2: xPos.y },
        y: { x1: originScreen.x, y1: originScreen.y, x2: yPos.x, y2: yPos.y },
        z: { x1: originScreen.x, y1: originScreen.y, x2: zPos.x, y2: zPos.y },
      },
      negative: {
        x: { x1: originScreen.x, y1: originScreen.y, x2: xNeg.x, y2: xNeg.y },
        y: { x1: originScreen.x, y1: originScreen.y, x2: yNeg.x, y2: yNeg.y },
        z: { x1: originScreen.x, y1: originScreen.y, x2: zNeg.x, y2: zNeg.y },
      },
    }
  }

  /**
   * Generate an SVG path for a vector arrow
   * Returns path data for the line and arrowhead
   */
  function generateVectorPath(
    start: Vector3D,
    end: Vector3D,
    arrowSize: number = 8,
  ): { line: string; arrow: string } {
    const startScreen = toScreen(start)
    const endScreen = toScreen(end)

    const dx = endScreen.x - startScreen.x
    const dy = endScreen.y - startScreen.y
    const len = Math.sqrt(dx * dx + dy * dy)

    if (len < 0.001) {
      return { line: '', arrow: '' }
    }

    // Unit vector in direction of arrow
    const ux = dx / len
    const uy = dy / len

    // Perpendicular unit vector
    const px = -uy
    const py = ux

    // Arrowhead points
    const arrowBack = arrowSize
    const arrowWidth = arrowSize * 0.4

    const tip = { x: endScreen.x, y: endScreen.y }
    const left = {
      x: endScreen.x - ux * arrowBack + px * arrowWidth,
      y: endScreen.y - uy * arrowBack + py * arrowWidth,
    }
    const right = {
      x: endScreen.x - ux * arrowBack - px * arrowWidth,
      y: endScreen.y - uy * arrowBack - py * arrowWidth,
    }

    const line = `M${startScreen.x},${startScreen.y}L${endScreen.x - ux * arrowBack * 0.5},${endScreen.y - uy * arrowBack * 0.5}`
    const arrow = `M${tip.x},${tip.y}L${left.x},${left.y}L${right.x},${right.y}Z`

    return { line, arrow }
  }

  /**
   * Project a 3D point onto the XZ plane (shadow/projection)
   */
  function projectToXZPlane(point: Vector3D): Vector3D {
    return { x: point.x, y: 0, z: point.z }
  }

  /**
   * Generate a dashed line from a point to its projection on the XZ plane
   */
  function generateDropLine(point: Vector3D): GridLine {
    const top = toScreen(point)
    const bottom = toScreen(projectToXZPlane(point))
    return { x1: top.x, y1: top.y, x2: bottom.x, y2: bottom.y }
  }

  return {
    config: resolvedConfig,
    toScreen,
    toWorld,
    generateGridLines,
    generateGridPath,
    generateMarkers,
    generateAxes,
    generateVectorPath,
    projectToXZPlane,
    generateDropLine,
  }
}
