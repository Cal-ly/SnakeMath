import { describe, it, expect } from 'vitest'
import {
  classifyNumber,
  parseNumberInput,
  getClassificationDescription,
  generatePythonCode,
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
  describe('natural numbers (N)', () => {
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

  describe('integers (Z)', () => {
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

  describe('real numbers (R)', () => {
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

  describe('complex numbers (C)', () => {
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
      expect(result.warnings.some((w) => w.includes('safe integer'))).toBe(true)
    })

    it('warns about infinity', () => {
      const result = classifyNumber('Infinity')
      expect(result.warnings.some((w) => w.includes('concept'))).toBe(true)
    })
  })
})

describe('getClassificationDescription', () => {
  it('describes natural numbers with set notation', () => {
    const classification = classifyNumber('5')
    const description = getClassificationDescription(classification)
    expect(description).toContain('N')
    expect(description).toContain('Z')
  })

  it('describes invalid input', () => {
    const classification = classifyNumber('')
    const description = getClassificationDescription(classification)
    expect(description).toContain('empty')
  })

  it('describes complex numbers', () => {
    const classification = classifyNumber('2i')
    const description = getClassificationDescription(classification)
    expect(description).toContain('C')
    expect(description).not.toContain('R (Real)')
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
