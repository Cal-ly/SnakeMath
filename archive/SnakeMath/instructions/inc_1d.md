# Increment 1D: TypeScript Type Definitions

## Context
SnakeMath needs shared type definitions for content structures, symbol data, and component props. Establishing these early ensures type safety throughout development.

## Task
Create TypeScript type definitions in `src/types/`.

## Required Type Files

### `src/types/content.ts`
Define types for content structure:

1. `Topic` - A major topic area (e.g., Basics, Algebra)
   - id: string (url slug)
   - title: string
   - description: string
   - icon: string (emoji or icon name)
   - subtopics: Subtopic[]

2. `Subtopic` - A page within a topic
   - id: string
   - title: string
   - description: string
   - path: string (full route path)

3. `ContentSection` - A collapsible section within a page
   - id: string (anchor)
   - title: string
   - defaultExpanded: boolean

4. `BreadcrumbItem` - Navigation breadcrumb
   - label: string
   - path: string (optional - omit for current page)

### `src/types/symbols.ts`
Define types for mathematical symbol data:

1. `MathSymbol` - A single symbol definition
   - symbol: string (the actual symbol, e.g., "∑")
   - name: string (e.g., "Summation")
   - meaning: string (brief description)
   - programmingAnalogy: string (optional - code equivalent)
   - example: string (optional - usage example)
   - category: SymbolCategory

2. `SymbolCategory` - Enum or union type
   - 'arithmetic' | 'algebra' | 'calculus' | 'logic' | 'constants' | 'greek' | 'ml'

3. `GreekLetter` - Special type for Greek letters
   - name: string (e.g., "alpha")
   - lowercase: string (e.g., "α")
   - uppercase: string (e.g., "Α")
   - commonUseLower: string (optional)
   - commonUseUpper: string (optional)

### `src/types/math.ts`
Define types for mathematical operations and widget state:

1. `NumberClassification` - Result of number type analysis
   - isNatural: boolean
   - isInteger: boolean
   - isRational: boolean
   - isReal: boolean
   - isComplex: boolean
   - pythonType: 'int' | 'float' | 'complex' | 'Decimal'
   - warnings: string[]

2. `NumberInput` - Parsed number input
   - raw: string (user input)
   - parsed: number | null
   - isValid: boolean
   - errorMessage: string | null

### `src/types/index.ts`
Create a barrel export that re-exports all types from the above files.

## Success Criteria
- All type files compile without errors
- Types are exported and importable via `@/types`
- `npm run type-check` passes
- Types are documented with JSDoc comments explaining their purpose

## Constraints
- Use `interface` for object shapes (extensible)
- Use `type` for unions and computed types
- Avoid `any` - use `unknown` if type is truly unknown
- Make optional properties explicit with `?`