import type { QuadraticPreset, QuadraticPresetId } from './types'

export const quadraticPresets: QuadraticPreset[] = [
  // Basic presets
  {
    id: 'standard',
    name: 'Standard',
    description: 'y = x²',
    coefficients: { a: 1, b: 0, c: 0 },
    category: 'basic',
  },
  {
    id: 'wide',
    name: 'Wide',
    description: 'Flatter curve',
    coefficients: { a: 0.5, b: 0, c: 0 },
    category: 'basic',
  },
  {
    id: 'narrow',
    name: 'Narrow',
    description: 'Steeper curve',
    coefficients: { a: 2, b: 0, c: 0 },
    category: 'basic',
  },
  {
    id: 'shifted',
    name: 'Shifted',
    description: 'Moved vertex',
    coefficients: { a: 1, b: -4, c: 3 },
    category: 'basic',
  },
  {
    id: 'inverted',
    name: 'Inverted',
    description: 'Opens downward',
    coefficients: { a: -1, b: 0, c: 4 },
    category: 'basic',
  },

  // Real-world presets
  {
    id: 'projectile',
    name: 'Projectile Motion',
    description: 'Ball thrown upward',
    coefficients: { a: -4.9, b: 20, c: 1.5 },
    category: 'real-world',
    explanation:
      'This models a ball thrown upward at 20 m/s from 1.5m height. The vertex represents maximum height, and the positive root shows when the ball lands.',
  },
  {
    id: 'profit',
    name: 'Profit Optimization',
    description: 'Revenue minus costs',
    coefficients: { a: -0.1, b: 50, c: -200 },
    category: 'real-world',
    explanation:
      'Revenue minus costs as a function of units sold. The vertex shows the maximum profit point, and the roots are break-even points.',
  },
  {
    id: 'reflector',
    name: 'Parabolic Reflector',
    description: 'Satellite dish cross-section',
    coefficients: { a: 0.25, b: 0, c: 0 },
    category: 'real-world',
    explanation:
      'Cross-section of a satellite dish or flashlight reflector. The focus point is at (0, 1/(4a)) = (0, 1).',
  },
]

/** Get a preset by its ID */
export function getPreset(id: QuadraticPresetId): QuadraticPreset | undefined {
  return quadraticPresets.find((p) => p.id === id)
}

/** Get all presets in a category */
export function getPresetsByCategory(category: 'basic' | 'real-world'): QuadraticPreset[] {
  return quadraticPresets.filter((p) => p.category === category)
}

/** Check if a string is a valid preset ID */
export function isValidPresetId(id: string): id is QuadraticPresetId {
  return quadraticPresets.some((p) => p.id === id)
}
