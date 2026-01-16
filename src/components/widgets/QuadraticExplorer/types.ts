import type { QuadraticCoefficients } from '@/utils/math/quadratic'

/** A preset configuration for the QuadraticExplorer */
export interface QuadraticPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** The coefficients for this preset */
  coefficients: QuadraticCoefficients
  /** Category for grouping in UI */
  category: 'basic' | 'real-world'
  /** Extended explanation shown when selected (optional) */
  explanation?: string
}

/** IDs for all available presets */
export type QuadraticPresetId =
  | 'standard'
  | 'wide'
  | 'narrow'
  | 'shifted'
  | 'inverted'
  | 'projectile'
  | 'profit'
  | 'reflector'
