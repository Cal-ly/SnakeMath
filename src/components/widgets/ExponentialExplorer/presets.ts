import type { BasePreset, ScenarioPreset, BasePresetId, ScenarioPresetId } from './types'

/** Base presets for quick selection */
export const basePresets: BasePreset[] = [
  {
    id: 'e',
    name: 'e',
    value: Math.E,
    description: 'Natural base (2.718...)',
  },
  {
    id: '2',
    name: '2',
    value: 2,
    description: 'Binary (CS applications)',
  },
  {
    id: '10',
    name: '10',
    value: 10,
    description: 'Common logarithm',
  },
]

/** Scenario presets with context */
export const scenarioPresets: ScenarioPreset[] = [
  // Math scenarios
  {
    id: 'natural-exp',
    name: 'Natural Exponential',
    description: 'e^x - fundamental in calculus',
    functionType: 'exponential',
    base: Math.E,
    category: 'math',
  },
  {
    id: 'binary-exp',
    name: 'Powers of 2',
    description: '2^x - binary doubling',
    functionType: 'exponential',
    base: 2,
    category: 'math',
  },
  {
    id: 'natural-log',
    name: 'Natural Logarithm',
    description: 'ln(x) - inverse of e^x',
    functionType: 'logarithm',
    base: Math.E,
    category: 'math',
  },
  {
    id: 'binary-log',
    name: 'Binary Logarithm',
    description: 'log2(x) - bits needed',
    functionType: 'logarithm',
    base: 2,
    category: 'math',
  },

  // Real-world scenarios
  {
    id: 'decay',
    name: 'Radioactive Decay',
    description: 'Half-life example (0.5)^x',
    functionType: 'exponential',
    base: 0.5,
    category: 'real-world',
  },
  {
    id: 'population',
    name: 'Population Growth',
    description: '1.03^x - 3% annual growth',
    functionType: 'exponential',
    base: 1.03,
    category: 'real-world',
  },
  {
    id: 'ph-scale',
    name: 'pH Scale',
    description: 'log10 for acidity',
    functionType: 'logarithm',
    base: 10,
    category: 'real-world',
  },
]

/** Get a base preset by ID */
export function getBasePreset(id: BasePresetId): BasePreset | undefined {
  return basePresets.find((p) => p.id === id)
}

/** Get a scenario preset by ID */
export function getScenarioPreset(id: ScenarioPresetId): ScenarioPreset | undefined {
  return scenarioPresets.find((p) => p.id === id)
}

/** Get scenarios by category */
export function getScenariosByCategory(category: 'math' | 'real-world'): ScenarioPreset[] {
  return scenarioPresets.filter((p) => p.category === category)
}

/** Check if a string is a valid base preset ID */
export function isValidBasePresetId(id: string): id is BasePresetId {
  return basePresets.some((p) => p.id === id)
}

/** Check if a string is a valid scenario preset ID */
export function isValidScenarioPresetId(id: string): id is ScenarioPresetId {
  return scenarioPresets.some((p) => p.id === id)
}

/** Find base preset that matches a value */
export function findMatchingBasePreset(value: number): BasePresetId | null {
  const match = basePresets.find((p) => Math.abs(p.value - value) < 0.001)
  return match ? (match.id as BasePresetId) : null
}
