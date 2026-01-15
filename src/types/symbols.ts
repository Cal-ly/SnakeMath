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
  /** Brief meaning/description */
  meaning: string
  /** Programming equivalent or analogy (e.g., 'sum()', 'for loop') */
  programmingAnalogy?: string
  /** Example usage */
  example?: string
  /** Category for filtering/grouping */
  category: SymbolCategory
}

/**
 * Greek letter with both cases
 */
export interface GreekLetter {
  /** English name (e.g., 'alpha', 'beta') */
  name: string
  /** Lowercase symbol (e.g., 'α') */
  lowercase: string
  /** Uppercase symbol (e.g., 'Α') */
  uppercase: string
  /** Common mathematical use of lowercase */
  commonUseLower?: string
  /** Common mathematical use of uppercase */
  commonUseUpper?: string
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
