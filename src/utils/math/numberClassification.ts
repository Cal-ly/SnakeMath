import type { NumberClassification, NumberInput, NumberProperties } from '@/types'

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

  // Check for special values first (before complex number check since "Infinity" contains 'i')
  const lowerTrimmed = trimmed.toLowerCase()
  if (lowerTrimmed === 'infinity' || trimmed === '∞') {
    return {
      raw: input,
      parsedReal: Infinity,
      isValid: true,
    }
  }

  if (lowerTrimmed === '-infinity' || trimmed === '-∞') {
    return {
      raw: input,
      parsedReal: -Infinity,
      isValid: true,
    }
  }

  // Check for complex number notation (e.g., "3+2i", "2i", "i", "-3-4i")
  // Must come after infinity check
  if (trimmed.includes('i') || trimmed.includes('I')) {
    return parseComplexNumber(trimmed)
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
    const imaginary =
      imagPart === '+' || imagPart === '' ? 1 : imagPart === '-' ? -1 : Number(imagPart)

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
    warnings.push(
      `Number exceeds safe integer range (±${Number.MAX_SAFE_INTEGER}). Precision may be lost.`
    )
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
  const decimalPart = decimalStr.split('.')[1]
  if (decimalStr.includes('.') && decimalPart && decimalPart.length > 10) {
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

  if (classification.isNatural) sets.push('N (Natural)')
  if (classification.isInteger) sets.push('Z (Integer)')
  if (classification.isRational) sets.push('Q (Rational)')
  if (classification.isReal) sets.push('R (Real)')
  if (classification.isComplex) sets.push('C (Complex)')

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

/**
 * Check if a number is prime
 */
function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}

/**
 * Get detailed properties of a number for display
 */
export function getNumberProperties(
  parsed: NumberInput,
  input: string
): NumberProperties {
  // Complex number
  if (parsed.parsedImaginary !== undefined && parsed.parsedImaginary !== 0) {
    const real = parsed.parsedReal || 0
    const imag = parsed.parsedImaginary
    return {
      type: 'complex',
      value: { real, imag },
      realPart: real,
      imaginaryPart: imag,
      isSpecial: false,
    }
  }

  const value = parsed.parsedReal!

  // Special values (infinity)
  if (!Number.isFinite(value)) {
    return {
      type: 'special',
      value,
      isSpecial: true,
      specialName: value === Infinity ? '∞' : '-∞',
    }
  }

  const isInt = Number.isInteger(value)
  const sign = Math.sign(value)

  // Check for known constants
  const lowerInput = input.toLowerCase().trim()
  const isSpecialConstant = ['pi', 'π', 'e'].includes(lowerInput)

  // Determine the most specific type
  let type: NumberProperties['type']
  if (isInt && value >= 1) {
    type = 'natural'
  } else if (isInt) {
    type = 'integer'
  } else if (isSpecialConstant) {
    type = 'irrational'
  } else {
    type = 'rational'
  }

  return {
    type,
    value,
    sign,
    isInteger: isInt,
    isEven: isInt ? value % 2 === 0 : undefined,
    isPrime: isInt && value > 1 ? isPrime(value) : undefined,
    absoluteValue: Math.abs(value),
    isSpecial: isSpecialConstant,
    specialName: isSpecialConstant ? input.trim() : undefined,
  }
}
