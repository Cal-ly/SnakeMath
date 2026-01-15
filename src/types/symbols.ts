/**
 * Mathematical symbol definitions for reference tables
 */

/**
 * Categories for mathematical symbols
 */
export type SymbolCategory =
  | 'arithmetic'
  | 'algebra'
  | 'calculus'
  | 'logic'
  | 'constants'
  | 'greek'
  | 'sets'
  | 'ml'

/**
 * A single mathematical symbol definition
 */
export interface MathSymbol {
  /** The actual symbol (e.g., '∑', '∫', '≠') */
  symbol: string
  /** Name of the symbol (e.g., 'Summation', 'Integral') */
  name: string
  /** LaTeX command to produce this symbol */
  latex: string
  /** Brief meaning/description */
  meaning: string
  /** Programming equivalent or analogy (e.g., 'sum()', 'for loop') */
  programmingAnalogy?: string
  /** Python code example */
  pythonExample?: string
  /** Common use cases */
  commonUses?: string[]
  /** Related symbols */
  related?: string[]
  /** Category for filtering/grouping */
  category: SymbolCategory
}

/**
 * Greek letter with both cases
 */
export interface GreekLetter {
  /** Lowercase symbol (e.g., 'α') */
  lowercase: string
  /** Uppercase symbol (e.g., 'Α') */
  uppercase: string
  /** English name (e.g., 'alpha', 'beta') */
  name: string
  /** LaTeX command for lowercase */
  latex: string
  /** LaTeX command for uppercase */
  uppercaseLaTeX: string
  /** Common mathematical uses */
  commonUses: string[]
}

/**
 * Symbol table section for UI grouping
 */
export interface SymbolTableSection {
  /** Section title */
  title: string
  /** Category filter */
  category: SymbolCategory
  /** Symbols in this section */
  symbols: MathSymbol[]
}
