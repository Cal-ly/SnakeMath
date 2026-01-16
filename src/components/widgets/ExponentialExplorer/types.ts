/** Function type for the explorer */
export type FunctionType = 'exponential' | 'logarithm'

/** Active tab in the explorer */
export type ExplorerTab = 'function' | 'complexity'

/** A base preset for the function explorer */
export interface BasePreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Base value */
  value: number
  /** Short description */
  description: string
}

/** A scenario preset combining function type and base */
export interface ScenarioPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Description of the scenario */
  description: string
  /** Function type */
  functionType: FunctionType
  /** Base value */
  base: number
  /** Category for grouping */
  category: 'math' | 'real-world'
}

/** IDs for all available base presets */
export type BasePresetId = 'e' | '2' | '10'

/** IDs for all available scenario presets */
export type ScenarioPresetId =
  | 'natural-exp'
  | 'binary-exp'
  | 'natural-log'
  | 'binary-log'
  | 'decay'
  | 'population'
  | 'ph-scale'
