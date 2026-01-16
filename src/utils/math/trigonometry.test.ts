import { describe, it, expect } from 'vitest'
import {
  degreesToRadians,
  radiansToDegrees,
  normalizeAngle,
  getQuadrant,
  getQuadrantSigns,
  getReferenceAngle,
  calculateTrigValues,
  getPointOnCircle,
  isSpecialAngle,
  getExactTrigValues,
  getSpecialAngles,
  getFirstQuadrantAngles,
  getRemainingSpecialAngles,
  formatRadians,
  verifyPythagoreanIdentity,
} from './trigonometry'

describe('trigonometry utilities', () => {
  describe('degreesToRadians', () => {
    it('converts 0° to 0', () => {
      expect(degreesToRadians(0)).toBe(0)
    })

    it('converts 90° to π/2', () => {
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2)
    })

    it('converts 180° to π', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI)
    })

    it('converts 360° to 2π', () => {
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI)
    })

    it('converts 45° to π/4', () => {
      expect(degreesToRadians(45)).toBeCloseTo(Math.PI / 4)
    })

    it('handles negative angles', () => {
      expect(degreesToRadians(-90)).toBeCloseTo(-Math.PI / 2)
    })
  })

  describe('radiansToDegrees', () => {
    it('converts 0 to 0°', () => {
      expect(radiansToDegrees(0)).toBe(0)
    })

    it('converts π/2 to 90°', () => {
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90)
    })

    it('converts π to 180°', () => {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180)
    })

    it('converts 2π to 360°', () => {
      expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360)
    })

    it('handles negative radians', () => {
      expect(radiansToDegrees(-Math.PI)).toBeCloseTo(-180)
    })
  })

  describe('normalizeAngle', () => {
    it('keeps angles in [0, 360) unchanged', () => {
      expect(normalizeAngle(0)).toBe(0)
      expect(normalizeAngle(45)).toBe(45)
      expect(normalizeAngle(180)).toBe(180)
      expect(normalizeAngle(359)).toBe(359)
    })

    it('normalizes 360 to 0', () => {
      expect(normalizeAngle(360)).toBe(0)
    })

    it('normalizes angles > 360', () => {
      expect(normalizeAngle(450)).toBe(90)
      expect(normalizeAngle(720)).toBe(0)
      expect(normalizeAngle(765)).toBe(45)
    })

    it('normalizes negative angles', () => {
      expect(normalizeAngle(-90)).toBe(270)
      expect(normalizeAngle(-180)).toBe(180)
      expect(normalizeAngle(-360)).toBeCloseTo(0) // Can be -0 due to floating point
      expect(normalizeAngle(-45)).toBe(315)
    })
  })

  describe('getQuadrant', () => {
    it('returns quadrant 1 for [0, 90)', () => {
      expect(getQuadrant(0)).toBe(1)
      expect(getQuadrant(45)).toBe(1)
      expect(getQuadrant(89)).toBe(1)
    })

    it('returns quadrant 2 for [90, 180)', () => {
      expect(getQuadrant(90)).toBe(2)
      expect(getQuadrant(135)).toBe(2)
      expect(getQuadrant(179)).toBe(2)
    })

    it('returns quadrant 3 for [180, 270)', () => {
      expect(getQuadrant(180)).toBe(3)
      expect(getQuadrant(225)).toBe(3)
      expect(getQuadrant(269)).toBe(3)
    })

    it('returns quadrant 4 for [270, 360)', () => {
      expect(getQuadrant(270)).toBe(4)
      expect(getQuadrant(315)).toBe(4)
      expect(getQuadrant(359)).toBe(4)
    })

    it('handles angles > 360', () => {
      expect(getQuadrant(450)).toBe(2) // 450 = 90
      expect(getQuadrant(405)).toBe(1) // 405 = 45
    })

    it('handles negative angles', () => {
      expect(getQuadrant(-45)).toBe(4) // -45 = 315
      expect(getQuadrant(-90)).toBe(4) // -90 = 270
    })
  })

  describe('getQuadrantSigns', () => {
    it('returns all positive for quadrant 1', () => {
      const signs = getQuadrantSigns(1)
      expect(signs.sin).toBe(1)
      expect(signs.cos).toBe(1)
      expect(signs.tan).toBe(1)
    })

    it('returns sin positive for quadrant 2', () => {
      const signs = getQuadrantSigns(2)
      expect(signs.sin).toBe(1)
      expect(signs.cos).toBe(-1)
      expect(signs.tan).toBe(-1)
    })

    it('returns tan positive for quadrant 3', () => {
      const signs = getQuadrantSigns(3)
      expect(signs.sin).toBe(-1)
      expect(signs.cos).toBe(-1)
      expect(signs.tan).toBe(1)
    })

    it('returns cos positive for quadrant 4', () => {
      const signs = getQuadrantSigns(4)
      expect(signs.sin).toBe(-1)
      expect(signs.cos).toBe(1)
      expect(signs.tan).toBe(-1)
    })
  })

  describe('getReferenceAngle', () => {
    it('returns angle unchanged for quadrant 1', () => {
      expect(getReferenceAngle(0)).toBe(0)
      expect(getReferenceAngle(30)).toBe(30)
      expect(getReferenceAngle(45)).toBe(45)
      expect(getReferenceAngle(60)).toBe(60)
      expect(getReferenceAngle(90)).toBe(90)
    })

    it('calculates reference angle for quadrant 2', () => {
      expect(getReferenceAngle(120)).toBe(60)
      expect(getReferenceAngle(135)).toBe(45)
      expect(getReferenceAngle(150)).toBe(30)
      expect(getReferenceAngle(180)).toBe(0)
    })

    it('calculates reference angle for quadrant 3', () => {
      expect(getReferenceAngle(210)).toBe(30)
      expect(getReferenceAngle(225)).toBe(45)
      expect(getReferenceAngle(240)).toBe(60)
      expect(getReferenceAngle(270)).toBe(90)
    })

    it('calculates reference angle for quadrant 4', () => {
      expect(getReferenceAngle(300)).toBe(60)
      expect(getReferenceAngle(315)).toBe(45)
      expect(getReferenceAngle(330)).toBe(30)
      expect(getReferenceAngle(360)).toBe(0)
    })
  })

  describe('calculateTrigValues', () => {
    it('calculates correct values for 0°', () => {
      const values = calculateTrigValues(0)
      expect(values.sin).toBeCloseTo(0)
      expect(values.cos).toBeCloseTo(1)
      expect(values.tan).toBeCloseTo(0)
    })

    it('calculates correct values for 45°', () => {
      const values = calculateTrigValues(45)
      expect(values.sin).toBeCloseTo(Math.SQRT2 / 2)
      expect(values.cos).toBeCloseTo(Math.SQRT2 / 2)
      expect(values.tan).toBeCloseTo(1)
    })

    it('calculates correct values for 90°', () => {
      const values = calculateTrigValues(90)
      expect(values.sin).toBeCloseTo(1)
      expect(values.cos).toBeCloseTo(0)
      expect(values.tan).toBeNull()
    })

    it('calculates correct values for 180°', () => {
      const values = calculateTrigValues(180)
      expect(values.sin).toBeCloseTo(0)
      expect(values.cos).toBeCloseTo(-1)
      expect(values.tan).toBeCloseTo(0)
    })

    it('calculates correct values for 270°', () => {
      const values = calculateTrigValues(270)
      expect(values.sin).toBeCloseTo(-1)
      expect(values.cos).toBeCloseTo(0)
      expect(values.tan).toBeNull()
    })

    it('returns null tan at both 90° and 270°', () => {
      expect(calculateTrigValues(90).tan).toBeNull()
      expect(calculateTrigValues(270).tan).toBeNull()
    })

    it('matches Math functions for arbitrary angles', () => {
      const angles = [15, 37, 123, 217, 301]
      for (const deg of angles) {
        const rad = (deg * Math.PI) / 180
        const values = calculateTrigValues(deg)
        expect(values.sin).toBeCloseTo(Math.sin(rad))
        expect(values.cos).toBeCloseTo(Math.cos(rad))
        expect(values.tan).toBeCloseTo(Math.tan(rad))
      }
    })
  })

  describe('getPointOnCircle', () => {
    it('returns (1, 0) for 0°', () => {
      const point = getPointOnCircle(0)
      expect(point.x).toBeCloseTo(1)
      expect(point.y).toBeCloseTo(0)
    })

    it('returns (0, 1) for 90°', () => {
      const point = getPointOnCircle(90)
      expect(point.x).toBeCloseTo(0)
      expect(point.y).toBeCloseTo(1)
    })

    it('returns (-1, 0) for 180°', () => {
      const point = getPointOnCircle(180)
      expect(point.x).toBeCloseTo(-1)
      expect(point.y).toBeCloseTo(0)
    })

    it('returns (0, -1) for 270°', () => {
      const point = getPointOnCircle(270)
      expect(point.x).toBeCloseTo(0)
      expect(point.y).toBeCloseTo(-1)
    })

    it('returns (√2/2, √2/2) for 45°', () => {
      const point = getPointOnCircle(45)
      expect(point.x).toBeCloseTo(Math.SQRT2 / 2)
      expect(point.y).toBeCloseTo(Math.SQRT2 / 2)
    })

    it('always lies on unit circle (x² + y² = 1)', () => {
      const angles = [0, 30, 45, 60, 90, 120, 180, 225, 270, 315]
      for (const deg of angles) {
        const point = getPointOnCircle(deg)
        expect(point.x * point.x + point.y * point.y).toBeCloseTo(1)
      }
    })
  })

  describe('isSpecialAngle', () => {
    it('returns true for all special angles', () => {
      const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]
      for (const deg of specialAngles) {
        expect(isSpecialAngle(deg)).toBe(true)
      }
    })

    it('returns false for non-special angles', () => {
      const nonSpecial = [10, 15, 25, 37, 50, 75, 100, 145, 200]
      for (const deg of nonSpecial) {
        expect(isSpecialAngle(deg)).toBe(false)
      }
    })

    it('handles normalized equivalents', () => {
      expect(isSpecialAngle(360)).toBe(true) // normalizes to 0
      expect(isSpecialAngle(405)).toBe(true) // normalizes to 45
      expect(isSpecialAngle(-45)).toBe(true) // normalizes to 315
    })
  })

  describe('getExactTrigValues', () => {
    it('returns exact values for 0°', () => {
      const exact = getExactTrigValues(0)
      expect(exact).not.toBeNull()
      expect(exact!.sin).toBe('0')
      expect(exact!.cos).toBe('1')
      expect(exact!.tan).toBe('0')
    })

    it('returns exact values for 30°', () => {
      const exact = getExactTrigValues(30)
      expect(exact).not.toBeNull()
      expect(exact!.sin).toBe('1/2')
      expect(exact!.cos).toBe('√3/2')
      expect(exact!.tan).toBe('√3/3')
    })

    it('returns exact values for 45°', () => {
      const exact = getExactTrigValues(45)
      expect(exact).not.toBeNull()
      expect(exact!.sin).toBe('√2/2')
      expect(exact!.cos).toBe('√2/2')
      expect(exact!.tan).toBe('1')
    })

    it('returns exact values for 60°', () => {
      const exact = getExactTrigValues(60)
      expect(exact).not.toBeNull()
      expect(exact!.sin).toBe('√3/2')
      expect(exact!.cos).toBe('1/2')
      expect(exact!.tan).toBe('√3')
    })

    it('returns "undefined" tan for 90°', () => {
      const exact = getExactTrigValues(90)
      expect(exact).not.toBeNull()
      expect(exact!.sin).toBe('1')
      expect(exact!.cos).toBe('0')
      expect(exact!.tan).toBe('undefined')
      expect(exact!.tanDecimal).toBeNull()
    })

    it('returns "undefined" tan for 270°', () => {
      const exact = getExactTrigValues(270)
      expect(exact).not.toBeNull()
      expect(exact!.tan).toBe('undefined')
      expect(exact!.tanDecimal).toBeNull()
    })

    it('returns null for non-special angles', () => {
      expect(getExactTrigValues(15)).toBeNull()
      expect(getExactTrigValues(37)).toBeNull()
      expect(getExactTrigValues(100)).toBeNull()
    })

    it('decimal values match calculated values', () => {
      const exact = getExactTrigValues(45)
      const calculated = calculateTrigValues(45)
      expect(exact!.sinDecimal).toBeCloseTo(calculated.sin)
      expect(exact!.cosDecimal).toBeCloseTo(calculated.cos)
      expect(exact!.tanDecimal).toBeCloseTo(calculated.tan!)
    })
  })

  describe('getSpecialAngles', () => {
    it('returns all 16 special angles', () => {
      const angles = getSpecialAngles()
      expect(angles).toHaveLength(16)
    })

    it('includes all expected degrees', () => {
      const angles = getSpecialAngles()
      const degrees = angles.map((a) => a.degrees)
      expect(degrees).toEqual([0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330])
    })
  })

  describe('getFirstQuadrantAngles', () => {
    it('returns 5 angles (0°, 30°, 45°, 60°, 90°)', () => {
      const angles = getFirstQuadrantAngles()
      expect(angles).toHaveLength(5)
      expect(angles.map((a) => a.degrees)).toEqual([0, 30, 45, 60, 90])
    })
  })

  describe('getRemainingSpecialAngles', () => {
    it('returns 11 angles (120° through 330°)', () => {
      const angles = getRemainingSpecialAngles()
      expect(angles).toHaveLength(11)
      expect(angles[0]?.degrees).toBe(120)
      expect(angles[angles.length - 1]?.degrees).toBe(330)
    })
  })

  describe('formatRadians', () => {
    it('formats special angles with symbolic form', () => {
      const formatted = formatRadians(45)
      expect(formatted.symbolic).toBe('π/4')
      expect(formatted.decimal).toBeCloseTo(Math.PI / 4)
      expect(formatted.formatted).toMatch(/π\/4.*≈.*0\.79/)
    })

    it('formats 0° correctly', () => {
      const formatted = formatRadians(0)
      expect(formatted.symbolic).toBe('0')
      expect(formatted.decimal).toBe(0)
    })

    it('formats 90° as π/2', () => {
      const formatted = formatRadians(90)
      expect(formatted.symbolic).toBe('π/2')
    })

    it('formats 180° as π', () => {
      const formatted = formatRadians(180)
      expect(formatted.symbolic).toBe('π')
    })

    it('formats non-special angles as decimals', () => {
      const formatted = formatRadians(37)
      expect(formatted.symbolic).toMatch(/^\d+\.\d+$/)
      expect(formatted.decimal).toBeCloseTo((37 * Math.PI) / 180)
    })
  })

  describe('verifyPythagoreanIdentity', () => {
    it('verifies identity for all special angles', () => {
      const angles = [0, 30, 45, 60, 90, 120, 180, 225, 270, 315]
      for (const deg of angles) {
        const verification = verifyPythagoreanIdentity(deg)
        expect(verification.result).toBeCloseTo(1)
        expect(verification.isValid).toBe(true)
      }
    })

    it('verifies identity for arbitrary angles', () => {
      const angles = [15, 37, 123, 217, 301]
      for (const deg of angles) {
        const verification = verifyPythagoreanIdentity(deg)
        expect(verification.result).toBeCloseTo(1)
        expect(verification.isValid).toBe(true)
      }
    })
  })
})
