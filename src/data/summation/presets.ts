import type { SummationPresetId } from '@/types/math'

/**
 * Full preset definition with all display and computational information
 */
export interface SummationPreset {
  /** Unique identifier */
  id: SummationPresetId
  /** Display name */
  name: string
  /** Brief description */
  description: string
  /** LaTeX expression for the term (e.g., "i^2") */
  expressionLatex: string
  /** Python code expression */
  expressionPython: string
  /** JavaScript code expression */
  expressionJavaScript: string
  /** LaTeX formula for closed-form (null if none known) */
  closedFormLatex: string | null
  /** Name of the closed-form formula */
  closedFormName: string | null
  /** Function to evaluate a single term */
  evaluate: (i: number) => number
  /** Closed-form function (null if none known) */
  closedForm: ((n: number) => number) | null
}

/**
 * All summation presets
 */
export const summationPresets: Record<SummationPresetId, SummationPreset> = {
  arithmetic: {
    id: 'arithmetic',
    name: 'Sum of Integers',
    description: 'The sum of the first n natural numbers (1 + 2 + 3 + ... + n)',
    expressionLatex: 'i',
    expressionPython: 'i',
    expressionJavaScript: 'i',
    closedFormLatex: '\\frac{n(n+1)}{2}',
    closedFormName: "Gauss's Formula",
    evaluate: (i: number) => i,
    closedForm: (n: number) => (n * (n + 1)) / 2,
  },

  squares: {
    id: 'squares',
    name: 'Sum of Squares',
    description: 'The sum of squares from 1 to n (1² + 2² + 3² + ... + n²)',
    expressionLatex: 'i^2',
    expressionPython: 'i ** 2',
    expressionJavaScript: 'i ** 2',
    closedFormLatex: '\\frac{n(n+1)(2n+1)}{6}',
    closedFormName: 'Sum of Squares Formula',
    evaluate: (i: number) => i * i,
    closedForm: (n: number) => (n * (n + 1) * (2 * n + 1)) / 6,
  },

  cubes: {
    id: 'cubes',
    name: 'Sum of Cubes',
    description: 'The sum of cubes from 1 to n (1³ + 2³ + 3³ + ... + n³)',
    expressionLatex: 'i^3',
    expressionPython: 'i ** 3',
    expressionJavaScript: 'i ** 3',
    closedFormLatex: '\\left(\\frac{n(n+1)}{2}\\right)^2',
    closedFormName: "Nicomachus's Theorem",
    evaluate: (i: number) => i * i * i,
    closedForm: (n: number) => {
      const sum = (n * (n + 1)) / 2
      return sum * sum
    },
  },

  geometric: {
    id: 'geometric',
    name: 'Powers of 2',
    description: 'A geometric series with ratio 2 (1 + 2 + 4 + 8 + ...)',
    expressionLatex: '2^{i-1}',
    expressionPython: '2 ** (i - 1)',
    expressionJavaScript: '2 ** (i - 1)',
    closedFormLatex: '2^n - 1',
    closedFormName: 'Geometric Series Formula',
    evaluate: (i: number) => Math.pow(2, i - 1),
    closedForm: (n: number) => Math.pow(2, n) - 1,
  },

  constant: {
    id: 'constant',
    name: 'Constant Sum',
    description: 'Sum of n ones (1 + 1 + 1 + ... n times)',
    expressionLatex: '1',
    expressionPython: '1',
    expressionJavaScript: '1',
    closedFormLatex: 'n',
    closedFormName: 'Identity',
    evaluate: () => 1,
    closedForm: (n: number) => n,
  },
}

/**
 * Get a preset by ID
 */
export function getPreset(id: SummationPresetId): SummationPreset {
  return summationPresets[id]
}

/**
 * Get all preset IDs
 */
export function getPresetIds(): SummationPresetId[] {
  return Object.keys(summationPresets) as SummationPresetId[]
}
