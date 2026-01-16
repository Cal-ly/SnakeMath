# SnakeMath - Increment 1D: TypeScript Type Definitions

## Context
SnakeMath needs shared type definitions for content structures, symbol data, and component props. Establishing these early ensures type safety throughout development.

## Task
Create TypeScript type definitions in `src/types/`.

## Requirements

### 1. Create `src/types/content.ts`

```typescript
/**
 * Content structure types for SnakeMath educational content
 */

/**
 * A major topic area (e.g., Basics, Algebra, Calculus)
 */
export interface Topic {
  /** URL-friendly identifier */
  id: string
  /** Display title */
  title: string
  /** Brief description for cards/previews */
  description: string
  /** Emoji or icon identifier */
  icon: string
  /** List of subtopics within this topic */
  subtopics: Subtopic[]
}

/**
 * A page within a topic
 */
export interface Subtopic {
  /** URL-friendly identifier */
  id: string
  /** Display title */
  title: string
  /** Brief description */
  description: string
  /** Full route path (e.g., '/basics/foundations') */
  path: string
}

/**
 * A collapsible section within a content page
 */
export interface ContentSection {
  /** Anchor ID for deep linking */
  id: string
  /** Section title */
  title: string
  /** Whether section is expanded by default */
  defaultExpanded: boolean
}

/**
 * Navigation breadcrumb item
 */
export interface BreadcrumbItem {
  /** Display label */
  label: string
  /** Route path (omit for current/last item) */
  path?: string
}

/**
 * Difficulty level for content
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

/**
 * Metadata for a content page
 */
export interface ContentMeta {
  title: string
  description: string
  difficulty: DifficultyLevel
  prerequisites: string[]
  relatedTopics: string[]
  hasInteractive: boolean
  hasCodeExamples: boolean
}
```

### 2. Create `src/types/symbols.ts`

```typescript
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
```

### 3. Create `src/types/math.ts`

```typescript
/**
 * Types for mathematical operations and widget state
 */

/**
 * Result of number type classification
 */
export interface NumberClassification {
  /** Whether the number is a natural number (ℕ): positive integers */
  isNatural: boolean
  /** Whether the number is an integer (ℤ): whole numbers including zero and negatives */
  isInteger: boolean
  /** Whether the number is rational (ℚ): expressible as p/q */
  isRational: boolean
  /** Whether the number is real (ℝ): all non-complex numbers */
  isReal: boolean
  /** Whether the number is complex (ℂ): has imaginary component */
  isComplex: boolean
  /** Python data type that would represent this number */
  pythonType: PythonNumberType
  /** Any warnings about the number (precision loss, overflow, etc.) */
  warnings: string[]
  /** Whether the input was successfully parsed */
  isValid: boolean
  /** Error message if parsing failed */
  errorMessage?: string
}

/**
 * Python number types
 */
export type PythonNumberType = 'int' | 'float' | 'complex' | 'Decimal' | 'unknown'

/**
 * Parsed number input from user
 */
export interface NumberInput {
  /** Original user input string */
  raw: string
  /** Parsed numeric value (null if invalid or complex) */
  parsedReal?: number
  /** Imaginary component for complex numbers */
  parsedImaginary?: number
  /** Whether parsing succeeded */
  isValid: boolean
  /** Error message if parsing failed */
  errorMessage?: string
}

/**
 * Complex number representation
 */
export interface ComplexNumber {
  /** Real part */
  real: number
  /** Imaginary part */
  imaginary: number
}

/**
 * Widget state that can be serialized to URL
 */
export interface WidgetState {
  /** Unique identifier for the widget instance */
  id: string
  /** Serializable parameters */
  params: Record<string, string | number | boolean>
}

/**
 * Mathematical operation result with steps
 */
export interface CalculationResult<T> {
  /** Final result */
  result: T
  /** Intermediate steps for educational display */
  steps: CalculationStep[]
  /** Whether calculation succeeded */
  success: boolean
  /** Error message if failed */
  error?: string
}

/**
 * A single step in a calculation
 */
export interface CalculationStep {
  /** Description of what this step does */
  description: string
  /** Mathematical expression (KaTeX format) */
  expression: string
  /** Result of this step */
  result: string
}
```

### 4. Create `src/types/components.ts`

```typescript
/**
 * Shared component prop types
 */

/**
 * Props for MathBlock component
 */
export interface MathBlockProps {
  /** KaTeX formula string */
  formula: string
  /** Whether to render in display mode (centered, larger) */
  display?: boolean
  /** Additional CSS classes */
  className?: string
  /** Error fallback text */
  errorFallback?: string
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
  symbols: import('./symbols').MathSymbol[]
  /** Whether to show search input */
  searchable?: boolean
  /** Whether to show category filter */
  filterable?: boolean
  /** Initial search query */
  initialSearch?: string
}
```

### 5. Create `src/types/index.ts` (Barrel Export)

```typescript
/**
 * Central export for all type definitions
 */

// Content types
export type {
  Topic,
  Subtopic,
  ContentSection,
  BreadcrumbItem,
  DifficultyLevel,
  ContentMeta,
} from './content'

// Symbol types
export type {
  SymbolCategory,
  MathSymbol,
  GreekLetter,
  SymbolTableSection,
} from './symbols'

// Math types
export type {
  NumberClassification,
  PythonNumberType,
  NumberInput,
  ComplexNumber,
  WidgetState,
  CalculationResult,
  CalculationStep,
} from './math'

// Component prop types
export type {
  MathBlockProps,
  CodeExampleProps,
  ContentSectionProps,
  CollapsiblePanelProps,
  SymbolTableProps,
} from './components'
```

## Success Criteria
- [ ] All type files compile without errors
- [ ] Types are exported and importable via `@/types`
- [ ] `npm run type-check` passes
- [ ] JSDoc comments are present on all exported types
- [ ] No use of `any` type
- [ ] Optional properties are marked with `?`

## Verification
Test imports work by adding to any view temporarily:

```typescript
import type { NumberClassification, MathSymbol, Topic } from '@/types'
```

## Constraints
- Use `interface` for object shapes (extensible)
- Use `type` for unions and computed types
- Avoid `any` - use `unknown` if truly unknown
- All types should be documented with JSDoc
- Keep types focused - don't over-engineer for future needs

## Next Increment
After completion, proceed to `inc_1e.md` for Vitest configuration and initial tests.
