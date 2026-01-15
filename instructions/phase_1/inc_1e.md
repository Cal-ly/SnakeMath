# SnakeMath - Increment 1E: Vitest Configuration and Initial Tests

## Context
SnakeMath requires unit testing for mathematical utilities and component logic. Vitest is already installed from project initialization but needs proper configuration.

## Task
Configure Vitest properly and create the first tested utility: number classification.

## Requirements

### 1. Update `vitest.config.ts`
Create or update the Vitest configuration file in the project root:

```typescript
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'archive/**/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // Enable globals (describe, it, expect without imports)
      globals: true,
      // Setup file for global test utilities
      setupFiles: ['./src/test/setup.ts'],
      // Coverage configuration
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'archive/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/index.ts', // barrel exports
        ],
      },
    },
  })
)
```

### 2. Update `tsconfig.json` for Vitest Globals
Add Vitest types to the compiler options:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

Or if using `tsconfig.app.json`, add it there.

### 3. Create Test Setup File
Create `src/test/setup.ts`:

```typescript
/**
 * Global test setup for SnakeMath
 * 
 * This file runs before all tests. Use it for:
 * - Global mocks
 * - Custom matchers
 * - Test environment setup
 */

// Example: Suppress console.log in tests (uncomment if needed)
// beforeAll(() => {
//   vi.spyOn(console, 'log').mockImplementation(() => {})
// })

// Placeholder - add global setup as needed
export {}
```

### 4. Create Number Classification Utility
Create `src/utils/math/numberClassification.ts`:

```typescript
import type { NumberClassification, NumberInput, ComplexNumber } from '@/types'

/**
 * Parse a string input into a NumberInput structure
 */
export function parseNumberInput(input: string): NumberInput {
  const trimmed = input.trim()
  
  if (trimmed === '') {
    return {
      raw: input,
      isValid: false,
      errorMessage: 'Input is empty',
    }
  }

  // Check for complex number notation (e.g., "3+2i", "2i", "i", "-3-4i")
  const complexMatch = trimmed.match(/^([+-]?\d*\.?\d*)?([+-]?\d*\.?\d*)?i$/i)
  if (trimmed.includes('i')) {
    return parseComplexNumber(trimmed)
  }

  // Check for special values
  if (trimmed.toLowerCase() === 'infinity' || trimmed === '∞') {
    return {
      raw: input,
      parsedReal: Infinity,
      isValid: true,
    }
  }
  
  if (trimmed.toLowerCase() === '-infinity' || trimmed === '-∞') {
    return {
      raw: input,
      parsedReal: -Infinity,
      isValid: true,
    }
  }

  // Try to parse as a regular number
  const parsed = Number(trimmed)
  
  if (isNaN(parsed)) {
    return {
      raw: input,
      isValid: false,
      errorMessage: `Cannot parse "${trimmed}" as a number`,
    }
  }

  return {
    raw: input,
    parsedReal: parsed,
    isValid: true,
  }
}

/**
 * Parse complex number notation (e.g., "3+2i", "-4i", "i")
 */
function parseComplexNumber(input: string): NumberInput {
  const trimmed = input.trim().toLowerCase()
  
  // Handle pure imaginary: "i", "-i", "2i", "-3.5i"
  if (/^[+-]?(\d*\.?\d*)?i$/.test(trimmed)) {
    const imagPart = trimmed.replace('i', '') || '1'
    const imaginary = imagPart === '+' || imagPart === '' ? 1 
                    : imagPart === '-' ? -1 
                    : Number(imagPart)
    
    if (isNaN(imaginary)) {
      return { raw: input, isValid: false, errorMessage: 'Invalid imaginary part' }
    }
    
    return {
      raw: input,
      parsedReal: 0,
      parsedImaginary: imaginary,
      isValid: true,
    }
  }

  // Handle a+bi or a-bi format
  const match = trimmed.match(/^([+-]?\d*\.?\d+)([+-]\d*\.?\d*)?i$/)
  if (match) {
    const real = Number(match[1])
    let imagPart = match[2] || '1'
    if (imagPart === '+') imagPart = '1'
    if (imagPart === '-') imagPart = '-1'
    const imaginary = Number(imagPart)
    
    if (isNaN(real) || isNaN(imaginary)) {
      return { raw: input, isValid: false, errorMessage: 'Invalid complex number format' }
    }
    
    return {
      raw: input,
      parsedReal: real,
      parsedImaginary: imaginary,
      isValid: true,
    }
  }

  return {
    raw: input,
    isValid: false,
    errorMessage: 'Invalid complex number format. Use format like "3+2i" or "2i"',
  }
}

/**
 * Classify a number input into mathematical number sets
 */
export function classifyNumber(input: string): NumberClassification {
  const parsed = parseNumberInput(input)
  
  if (!parsed.isValid) {
    return {
      isNatural: false,
      isInteger: false,
      isRational: false,
      isReal: false,
      isComplex: false,
      pythonType: 'unknown',
      warnings: [],
      isValid: false,
      errorMessage: parsed.errorMessage,
    }
  }

  const warnings: string[] = []
  
  // Complex number case
  if (parsed.parsedImaginary !== undefined && parsed.parsedImaginary !== 0) {
    return {
      isNatural: false,
      isInteger: false,
      isRational: false,
      isReal: false,
      isComplex: true,
      pythonType: 'complex',
      warnings,
      isValid: true,
    }
  }

  const value = parsed.parsedReal!

  // Check for infinity
  if (!isFinite(value)) {
    warnings.push('Infinity is a concept, not a number in the traditional sense')
    return {
      isNatural: false,
      isInteger: false,
      isRational: false,
      isReal: true, // Extended reals include infinity
      isComplex: false,
      pythonType: 'float',
      warnings,
      isValid: true,
    }
  }

  // Check for precision issues with large numbers
  if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
    warnings.push(`Number exceeds safe integer range (±${Number.MAX_SAFE_INTEGER}). Precision may be lost.`)
  }

  // Determine classifications
  const isInteger = Number.isInteger(value)
  const isNatural = isInteger && value > 0
  
  // In JavaScript, all numbers are floats internally, but we can determine
  // the best Python type based on the value
  let pythonType: 'int' | 'float' | 'Decimal' = 'float'
  
  if (isInteger && Math.abs(value) <= Number.MAX_SAFE_INTEGER) {
    pythonType = 'int'
  }
  
  // Suggest Decimal for financial-like precision
  const decimalStr = String(value)
  if (decimalStr.includes('.') && decimalStr.split('.')[1]?.length > 10) {
    warnings.push('Consider using Decimal for high-precision calculations')
    pythonType = 'Decimal'
  }

  return {
    isNatural,
    isInteger,
    isRational: true, // All JS numbers are rational (finite decimal representations)
    isReal: true,
    isComplex: false,
    pythonType,
    warnings,
    isValid: true,
  }
}

/**
 * Get a human-readable description of a number's classification
 */
export function getClassificationDescription(classification: NumberClassification): string {
  if (!classification.isValid) {
    return classification.errorMessage || 'Invalid number'
  }

  const sets: string[] = []
  
  if (classification.isNatural) sets.push('ℕ (Natural)')
  if (classification.isInteger) sets.push('ℤ (Integer)')
  if (classification.isRational) sets.push('ℚ (Rational)')
  if (classification.isReal) sets.push('ℝ (Real)')
  if (classification.isComplex) sets.push('ℂ (Complex)')

  return sets.length > 0 ? sets.join(' ⊂ ') : 'Unknown classification'
}

/**
 * Generate Python code snippet for the given input
 */
export function generatePythonCode(input: string, classification: NumberClassification): string {
  if (!classification.isValid) {
    return `# Invalid input: ${classification.errorMessage}`
  }

  const parsed = parseNumberInput(input)
  
  if (classification.isComplex) {
    const real = parsed.parsedReal || 0
    const imag = parsed.parsedImaginary || 0
    return `value = complex(${real}, ${imag})  # ${real}${imag >= 0 ? '+' : ''}${imag}j
type(value)  # <class 'complex'>`
  }

  if (classification.pythonType === 'int') {
    return `value = ${Math.trunc(parsed.parsedReal!)}
type(value)  # <class 'int'>
value > 0  # ${classification.isNatural}  (natural number check)`
  }

  if (classification.pythonType === 'Decimal') {
    return `from decimal import Decimal
value = Decimal('${input.trim()}')
type(value)  # <class 'decimal.Decimal'>`
  }

  return `value = ${parsed.parsedReal}
type(value)  # <class 'float'>
value.is_integer()  # ${classification.isInteger}`
}
```

### 5. Create Tests
Create `src/utils/math/numberClassification.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { 
  classifyNumber, 
  parseNumberInput,
  getClassificationDescription,
  generatePythonCode 
} from './numberClassification'

describe('parseNumberInput', () => {
  describe('valid inputs', () => {
    it('parses positive integers', () => {
      const result = parseNumberInput('42')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(42)
    })

    it('parses negative integers', () => {
      const result = parseNumberInput('-17')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(-17)
    })

    it('parses decimal numbers', () => {
      const result = parseNumberInput('3.14159')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBeCloseTo(3.14159)
    })

    it('parses zero', () => {
      const result = parseNumberInput('0')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(0)
    })

    it('parses infinity', () => {
      const result = parseNumberInput('Infinity')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(Infinity)
    })

    it('parses negative infinity', () => {
      const result = parseNumberInput('-Infinity')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(-Infinity)
    })

    it('trims whitespace', () => {
      const result = parseNumberInput('  42  ')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(42)
    })
  })

  describe('complex numbers', () => {
    it('parses pure imaginary "i"', () => {
      const result = parseNumberInput('i')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(0)
      expect(result.parsedImaginary).toBe(1)
    })

    it('parses pure imaginary "-i"', () => {
      const result = parseNumberInput('-i')
      expect(result.isValid).toBe(true)
      expect(result.parsedImaginary).toBe(-1)
    })

    it('parses pure imaginary "2i"', () => {
      const result = parseNumberInput('2i')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(0)
      expect(result.parsedImaginary).toBe(2)
    })

    it('parses complex "3+2i"', () => {
      const result = parseNumberInput('3+2i')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(3)
      expect(result.parsedImaginary).toBe(2)
    })

    it('parses complex "3-2i"', () => {
      const result = parseNumberInput('3-2i')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(3)
      expect(result.parsedImaginary).toBe(-2)
    })

    it('parses complex with decimals "1.5+2.5i"', () => {
      const result = parseNumberInput('1.5+2.5i')
      expect(result.isValid).toBe(true)
      expect(result.parsedReal).toBe(1.5)
      expect(result.parsedImaginary).toBe(2.5)
    })
  })

  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      const result = parseNumberInput('')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toContain('empty')
    })

    it('rejects whitespace only', () => {
      const result = parseNumberInput('   ')
      expect(result.isValid).toBe(false)
    })

    it('rejects non-numeric strings', () => {
      const result = parseNumberInput('abc')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toContain('Cannot parse')
    })

    it('rejects mixed invalid input', () => {
      const result = parseNumberInput('12abc')
      expect(result.isValid).toBe(false)
    })
  })
})

describe('classifyNumber', () => {
  describe('natural numbers (ℕ)', () => {
    it('classifies positive integers as natural', () => {
      const result = classifyNumber('5')
      expect(result.isValid).toBe(true)
      expect(result.isNatural).toBe(true)
      expect(result.isInteger).toBe(true)
      expect(result.isRational).toBe(true)
      expect(result.isReal).toBe(true)
      expect(result.isComplex).toBe(false)
    })

    it('classifies 1 as natural', () => {
      const result = classifyNumber('1')
      expect(result.isNatural).toBe(true)
    })

    it('does not classify zero as natural', () => {
      const result = classifyNumber('0')
      expect(result.isNatural).toBe(false)
      expect(result.isInteger).toBe(true)
    })

    it('does not classify negative integers as natural', () => {
      const result = classifyNumber('-5')
      expect(result.isNatural).toBe(false)
      expect(result.isInteger).toBe(true)
    })
  })

  describe('integers (ℤ)', () => {
    it('classifies zero as integer', () => {
      const result = classifyNumber('0')
      expect(result.isInteger).toBe(true)
      expect(result.pythonType).toBe('int')
    })

    it('classifies negative integers', () => {
      const result = classifyNumber('-42')
      expect(result.isInteger).toBe(true)
      expect(result.pythonType).toBe('int')
    })

    it('does not classify decimals as integers', () => {
      const result = classifyNumber('3.14')
      expect(result.isInteger).toBe(false)
    })

    it('classifies whole number floats as integers', () => {
      const result = classifyNumber('5.0')
      expect(result.isInteger).toBe(true)
    })
  })

  describe('real numbers (ℝ)', () => {
    it('classifies decimals as real', () => {
      const result = classifyNumber('3.14159')
      expect(result.isReal).toBe(true)
      expect(result.isInteger).toBe(false)
      expect(result.pythonType).toBe('float')
    })

    it('classifies negative decimals', () => {
      const result = classifyNumber('-0.5')
      expect(result.isReal).toBe(true)
      expect(result.isInteger).toBe(false)
    })

    it('classifies infinity as real (extended)', () => {
      const result = classifyNumber('Infinity')
      expect(result.isReal).toBe(true)
      expect(result.warnings.length).toBeGreaterThan(0)
    })
  })

  describe('complex numbers (ℂ)', () => {
    it('classifies pure imaginary as complex', () => {
      const result = classifyNumber('2i')
      expect(result.isComplex).toBe(true)
      expect(result.isReal).toBe(false)
      expect(result.pythonType).toBe('complex')
    })

    it('classifies a+bi as complex', () => {
      const result = classifyNumber('3+2i')
      expect(result.isComplex).toBe(true)
      expect(result.isReal).toBe(false)
    })

    it('classifies "i" as complex', () => {
      const result = classifyNumber('i')
      expect(result.isComplex).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    it('returns invalid for empty input', () => {
      const result = classifyNumber('')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBeDefined()
    })

    it('returns invalid for non-numeric input', () => {
      const result = classifyNumber('hello')
      expect(result.isValid).toBe(false)
    })
  })

  describe('warnings', () => {
    it('warns about very large numbers', () => {
      const result = classifyNumber('9007199254740993') // > MAX_SAFE_INTEGER
      expect(result.warnings.some(w => w.includes('safe integer'))).toBe(true)
    })

    it('warns about infinity', () => {
      const result = classifyNumber('Infinity')
      expect(result.warnings.some(w => w.includes('concept'))).toBe(true)
    })
  })
})

describe('getClassificationDescription', () => {
  it('describes natural numbers with set notation', () => {
    const classification = classifyNumber('5')
    const description = getClassificationDescription(classification)
    expect(description).toContain('ℕ')
    expect(description).toContain('ℤ')
  })

  it('describes invalid input', () => {
    const classification = classifyNumber('')
    const description = getClassificationDescription(classification)
    expect(description).toContain('empty')
  })

  it('describes complex numbers', () => {
    const classification = classifyNumber('2i')
    const description = getClassificationDescription(classification)
    expect(description).toContain('ℂ')
    expect(description).not.toContain('ℝ')
  })
})

describe('generatePythonCode', () => {
  it('generates int code for integers', () => {
    const classification = classifyNumber('42')
    const code = generatePythonCode('42', classification)
    expect(code).toContain('value = 42')
    expect(code).toContain("'int'")
  })

  it('generates float code for decimals', () => {
    const classification = classifyNumber('3.14')
    const code = generatePythonCode('3.14', classification)
    expect(code).toContain('3.14')
    expect(code).toContain("'float'")
  })

  it('generates complex code for complex numbers', () => {
    const classification = classifyNumber('3+2i')
    const code = generatePythonCode('3+2i', classification)
    expect(code).toContain('complex')
  })

  it('handles invalid input gracefully', () => {
    const classification = classifyNumber('')
    const code = generatePythonCode('', classification)
    expect(code).toContain('Invalid')
  })
})
```

### 6. Create Barrel Export for Math Utils
Update `src/utils/math/index.ts`:

```typescript
export {
  classifyNumber,
  parseNumberInput,
  getClassificationDescription,
  generatePythonCode,
} from './numberClassification'
```

### 7. Update Package.json Scripts
Ensure these scripts exist in `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Success Criteria
- [ ] `npm run test` runs without configuration errors
- [ ] All tests pass (should be 25+ test cases)
- [ ] `npm run test:coverage` generates a coverage report
- [ ] Tests are discoverable via the `.test.ts` pattern
- [ ] Path aliases work in test files (`@/types` imports work)
- [ ] Vitest globals (describe, it, expect) work without imports
- [ ] Archive folder is excluded from test discovery

## Verification
Run:
```bash
npm run test:run
npm run test:coverage
```

All tests should pass and coverage should show the `numberClassification.ts` file.

## Constraints
- Co-locate tests with source files
- Use descriptive test names that read like specifications
- Test edge cases thoroughly (empty, invalid, boundary values)
- Keep the utility focused - no UI concerns in the math logic

## Next Increment
After completion, proceed to `inc_1f.md` for GitHub Pages deployment configuration.
