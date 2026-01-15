export { arithmeticSymbols } from './arithmetic'
export { algebraSymbols } from './algebra'
export { calculusSymbols } from './calculus'
export { setSymbols, logicSymbols } from './sets'
export { constantSymbols } from './constants'
export { greekLetters } from './greek'
export { mlSymbols } from './ml'

import { arithmeticSymbols } from './arithmetic'
import { algebraSymbols } from './algebra'
import { calculusSymbols } from './calculus'
import { setSymbols, logicSymbols } from './sets'
import { constantSymbols } from './constants'
import { mlSymbols } from './ml'
import type { MathSymbol } from '@/types'

/**
 * All symbols combined for search/filtering
 */
export const allSymbols: MathSymbol[] = [
  ...arithmeticSymbols,
  ...algebraSymbols,
  ...calculusSymbols,
  ...setSymbols,
  ...logicSymbols,
  ...constantSymbols,
  ...mlSymbols,
]

/**
 * Get symbols by category
 */
export function getSymbolsByCategory(category: string): MathSymbol[] {
  return allSymbols.filter((s) => s.category === category)
}

/**
 * Search symbols by name, meaning, or programming analogy
 */
export function searchSymbols(query: string): MathSymbol[] {
  const q = query.toLowerCase()
  return allSymbols.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.meaning.toLowerCase().includes(q) ||
      s.programmingAnalogy?.toLowerCase().includes(q) ||
      s.symbol.includes(query)
  )
}
