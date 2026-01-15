/**
 * Shared component prop types
 */

import type { MathSymbol } from './symbols'

/**
 * Props for MathBlock component
 */
export interface MathBlockProps {
  /** LaTeX formula string */
  formula: string
  /** Display mode (centered, larger) vs inline */
  display?: boolean
  /** Additional CSS classes */
  class?: string
  /** Custom error message if rendering fails */
  errorText?: string
}

/**
 * Props for CodeExample component
 */
export interface CodeExampleProps {
  /** Code content */
  code: string
  /** Programming language for syntax highlighting */
  language: 'python' | 'javascript' | 'typescript' | 'text'
  /** Optional title */
  title?: string
  /** Whether the code block is collapsible */
  collapsible?: boolean
  /** Whether collapsed by default (if collapsible) */
  defaultCollapsed?: boolean
  /** Whether to show line numbers */
  showLineNumbers?: boolean
}

/**
 * Props for ContentSection component
 */
export interface ContentSectionProps {
  /** Anchor ID for deep linking */
  id: string
  /** Section title */
  title: string
  /** Whether collapsible */
  collapsible?: boolean
  /** Whether expanded by default */
  defaultExpanded?: boolean
}

/**
 * Props for CollapsiblePanel component
 */
export interface CollapsiblePanelProps {
  /** Panel title */
  title: string
  /** Whether expanded by default */
  defaultExpanded?: boolean
  /** Icon to show (optional) */
  icon?: string
}

/**
 * Props for SymbolTable component
 */
export interface SymbolTableProps {
  /** Symbols to display */
  symbols: MathSymbol[]
  /** Whether to show search input */
  searchable?: boolean
  /** Whether to show category filter */
  filterable?: boolean
  /** Initial search query */
  initialSearch?: string
}
