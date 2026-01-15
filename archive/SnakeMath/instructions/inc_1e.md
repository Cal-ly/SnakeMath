# Increment 1E: Vitest Configuration and Initial Tests

## Context
SnakeMath requires unit testing for mathematical utilities and component logic. Vitest is already installed from project initialization.

## Task
Configure Vitest properly and create initial test structure with example tests.

## Vitest Configuration
Update or create `vitest.config.ts` in the project root:

1. Configure path aliases to match `tsconfig.json` (the `@/` alias)
2. Set the test environment to `jsdom` for component testing
3. Configure coverage reporting (istanbul or v8)
4. Set up globals (describe, it, expect) to be available without imports
5. Include setup file path for future global test utilities

Create `src/test/setup.ts`:
- This file will hold global test setup (empty for now, but establish the pattern)

## Test Directory Structure
```
src/
├── test/
│   └── setup.ts           # Global test setup
├── utils/
│   └── math/
│       ├── numberClassification.ts      # Utility to test
│       └── numberClassification.test.ts # Co-located test
```

## Initial Utility: Number Classification
Create `src/utils/math/numberClassification.ts`:

This utility should provide a function `classifyNumber(input: string): NumberClassification` that:
1. Parses the input string as a number
2. Determines classification (natural, integer, rational, real, complex)
3. Returns appropriate warnings (precision loss, overflow, etc.)

Classification rules:
- Natural (ℕ): Positive integers (1, 2, 3, ...)
- Integer (ℤ): Whole numbers including zero and negatives
- Rational (ℚ): Numbers expressible as p/q - for our purposes, all parsed floats are "rational" in JS
- Real (ℝ): All non-complex numbers
- Complex (ℂ): Numbers with imaginary component (detect via "i" in input, e.g., "3+2i")

Handle edge cases:
- Empty string → invalid
- Non-numeric input → invalid
- "Infinity" and "-Infinity" → valid real, with warning
- Very large numbers → warning about precision
- Decimal representations of fractions (0.333...) → rational

## Initial Tests
Create `src/utils/math/numberClassification.test.ts` with tests for:

1. Natural number classification
   - "5" → isNatural: true, isInteger: true, isRational: true, isReal: true
   - "0" → isNatural: false (zero is not natural), isInteger: true
   - "-3" → isNatural: false, isInteger: true

2. Real number classification
   - "3.14" → isNatural: false, isInteger: false, isRational: true, isReal: true
   - "-0.5" → appropriate classifications

3. Complex number detection
   - "3+2i" → isComplex: true
   - "2i" → isComplex: true
   - "i" → isComplex: true

4. Invalid input handling
   - "" → isValid: false
   - "abc" → isValid: false
   - "12abc" → isValid: false

5. Edge cases
   - "Infinity" → isReal: true with warning
   - Very large number string → appropriate warning

## Success Criteria
- `npm run test` runs without errors
- All tests pass
- Coverage report generates
- Tests are discoverable via the `.test.ts` pattern
- Path aliases work in test files (`@/types` imports work)

## Constraints
- Co-locate tests with source files (not in separate `__tests__` folder)
- Use descriptive test names that read like specifications
- Keep the numberClassification utility focused - don't add UI concerns
- Handle the complex number case simply (regex detection of 'i') - we're not building a full complex number parser