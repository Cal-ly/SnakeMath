/**
 * Trigonometric identities utility functions.
 * Provides identity definitions, proofs, and verification.
 */

// Constants
const DEG_TO_RAD = Math.PI / 180
const EPSILON = 1e-10

/**
 * A single step in an algebraic proof.
 */
export interface ProofStep {
  step: number
  latex: string
  explanation: string
}

/**
 * Result of verifying an identity at a specific angle.
 */
export interface VerificationResult {
  leftSide: number
  rightSide: number
  leftSideFormatted: string
  rightSideFormatted: string
  isEqual: boolean
  tolerance: number
  angleDeg: number
}

/**
 * Category of trigonometric identity.
 */
export type IdentityCategory = 'pythagorean' | 'quotient' | 'reciprocal' | 'sum-diff' | 'double' | 'half' | 'product-sum'

/**
 * A trigonometric identity with all its metadata.
 */
export interface TrigIdentity {
  id: string
  name: string
  category: IdentityCategory
  latex: string
  latexLeft: string
  latexRight: string
  description: string
  proofSteps: ProofStep[]
  verify: (angleDeg: number, angleDeg2?: number) => VerificationResult
  pythonCode: string
  notes?: string
}

// ============= Helper Functions =============

/**
 * Format a number for display, handling very small values.
 */
function formatNumber(n: number, decimals = 6): string {
  if (Math.abs(n) < EPSILON) return '0'
  if (Math.abs(n - 1) < EPSILON) return '1'
  if (Math.abs(n + 1) < EPSILON) return '-1'
  return n.toFixed(decimals).replace(/\.?0+$/, '')
}

/**
 * Check if two numbers are equal within tolerance.
 */
function isClose(a: number, b: number, tolerance = 1e-10): boolean {
  return Math.abs(a - b) < tolerance
}

/**
 * Create a verification result.
 */
function makeVerification(
  leftSide: number,
  rightSide: number,
  angleDeg: number,
  tolerance = 1e-10
): VerificationResult {
  return {
    leftSide,
    rightSide,
    leftSideFormatted: formatNumber(leftSide),
    rightSideFormatted: formatNumber(rightSide),
    isEqual: isClose(leftSide, rightSide, tolerance),
    tolerance,
    angleDeg,
  }
}

// ============= Pythagorean Identities =============

const pythagoreanMain: TrigIdentity = {
  id: 'pythagorean-main',
  name: 'Pythagorean Identity',
  category: 'pythagorean',
  latex: '\\sin^2\\theta + \\cos^2\\theta = 1',
  latexLeft: '\\sin^2\\theta + \\cos^2\\theta',
  latexRight: '1',
  description: 'The fundamental identity derived from the unit circle equation x² + y² = 1.',
  proofSteps: [
    {
      step: 1,
      latex: '(\\cos\\theta, \\sin\\theta) \\text{ lies on unit circle}',
      explanation: 'Any point on the unit circle has coordinates (cos θ, sin θ)',
    },
    {
      step: 2,
      latex: 'x^2 + y^2 = 1 \\text{ (unit circle equation)}',
      explanation: 'The equation of a unit circle centered at origin',
    },
    {
      step: 3,
      latex: '\\cos^2\\theta + \\sin^2\\theta = 1',
      explanation: 'Substitute x = cos θ and y = sin θ',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    return makeVerification(sin * sin + cos * cos, 1, angleDeg)
  },
  pythonCode: `import math

def verify_pythagorean(angle_deg):
    rad = math.radians(angle_deg)
    result = math.sin(rad)**2 + math.cos(rad)**2
    return result  # Always equals 1.0

# Example
print(verify_pythagorean(45))  # 1.0`,
}

const pythagoreanTan: TrigIdentity = {
  id: 'pythagorean-tan',
  name: 'Tangent Pythagorean Identity',
  category: 'pythagorean',
  latex: '1 + \\tan^2\\theta = \\sec^2\\theta',
  latexLeft: '1 + \\tan^2\\theta',
  latexRight: '\\sec^2\\theta',
  description: 'Derived by dividing the main Pythagorean identity by cos²θ.',
  proofSteps: [
    {
      step: 1,
      latex: '\\sin^2\\theta + \\cos^2\\theta = 1',
      explanation: 'Start with the fundamental Pythagorean identity',
    },
    {
      step: 2,
      latex: '\\frac{\\sin^2\\theta}{\\cos^2\\theta} + \\frac{\\cos^2\\theta}{\\cos^2\\theta} = \\frac{1}{\\cos^2\\theta}',
      explanation: 'Divide every term by cos²θ',
    },
    {
      step: 3,
      latex: '\\tan^2\\theta + 1 = \\sec^2\\theta',
      explanation: 'Simplify using tan = sin/cos and sec = 1/cos',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const tan = Math.tan(rad)
    const sec = 1 / Math.cos(rad)
    return makeVerification(1 + tan * tan, sec * sec, angleDeg)
  },
  pythonCode: `import math

def verify_tan_pythagorean(angle_deg):
    rad = math.radians(angle_deg)
    left = 1 + math.tan(rad)**2
    right = (1 / math.cos(rad))**2  # sec²θ
    return left, right  # Both equal

# Example (avoid 90° where tan is undefined)
print(verify_tan_pythagorean(45))  # (2.0, 2.0)`,
  notes: 'Undefined when cos θ = 0 (at 90°, 270°)',
}

const pythagoreanCot: TrigIdentity = {
  id: 'pythagorean-cot',
  name: 'Cotangent Pythagorean Identity',
  category: 'pythagorean',
  latex: '1 + \\cot^2\\theta = \\csc^2\\theta',
  latexLeft: '1 + \\cot^2\\theta',
  latexRight: '\\csc^2\\theta',
  description: 'Derived by dividing the main Pythagorean identity by sin²θ.',
  proofSteps: [
    {
      step: 1,
      latex: '\\sin^2\\theta + \\cos^2\\theta = 1',
      explanation: 'Start with the fundamental Pythagorean identity',
    },
    {
      step: 2,
      latex: '\\frac{\\sin^2\\theta}{\\sin^2\\theta} + \\frac{\\cos^2\\theta}{\\sin^2\\theta} = \\frac{1}{\\sin^2\\theta}',
      explanation: 'Divide every term by sin²θ',
    },
    {
      step: 3,
      latex: '1 + \\cot^2\\theta = \\csc^2\\theta',
      explanation: 'Simplify using cot = cos/sin and csc = 1/sin',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const cot = 1 / Math.tan(rad)
    const csc = 1 / Math.sin(rad)
    return makeVerification(1 + cot * cot, csc * csc, angleDeg)
  },
  pythonCode: `import math

def verify_cot_pythagorean(angle_deg):
    rad = math.radians(angle_deg)
    cot = 1 / math.tan(rad)
    csc = 1 / math.sin(rad)
    left = 1 + cot**2
    right = csc**2
    return left, right  # Both equal

# Example (avoid 0°, 180° where cot/csc are undefined)
print(verify_cot_pythagorean(45))  # (2.0, 2.0)`,
  notes: 'Undefined when sin θ = 0 (at 0°, 180°, 360°)',
}

// ============= Quotient Identities =============

const quotientTan: TrigIdentity = {
  id: 'quotient-tan',
  name: 'Tangent Quotient Identity',
  category: 'quotient',
  latex: '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}',
  latexLeft: '\\tan\\theta',
  latexRight: '\\frac{\\sin\\theta}{\\cos\\theta}',
  description: 'Tangent is the ratio of sine to cosine.',
  proofSteps: [
    {
      step: 1,
      latex: '\\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}}',
      explanation: 'Definition of tangent in a right triangle',
    },
    {
      step: 2,
      latex: '\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}, \\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}',
      explanation: 'Definitions of sine and cosine',
    },
    {
      step: 3,
      latex: '\\frac{\\sin\\theta}{\\cos\\theta} = \\frac{\\text{opp/hyp}}{\\text{adj/hyp}} = \\frac{\\text{opp}}{\\text{adj}} = \\tan\\theta',
      explanation: 'Divide sin by cos, hypotenuse cancels',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const tan = Math.tan(rad)
    const ratio = Math.sin(rad) / Math.cos(rad)
    return makeVerification(tan, ratio, angleDeg)
  },
  pythonCode: `import math

def verify_tan_quotient(angle_deg):
    rad = math.radians(angle_deg)
    left = math.tan(rad)
    right = math.sin(rad) / math.cos(rad)
    return left, right  # Both equal

# Example
print(verify_tan_quotient(45))  # (1.0, 1.0)`,
  notes: 'Undefined when cos θ = 0',
}

const quotientCot: TrigIdentity = {
  id: 'quotient-cot',
  name: 'Cotangent Quotient Identity',
  category: 'quotient',
  latex: '\\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}',
  latexLeft: '\\cot\\theta',
  latexRight: '\\frac{\\cos\\theta}{\\sin\\theta}',
  description: 'Cotangent is the ratio of cosine to sine (reciprocal of tangent).',
  proofSteps: [
    {
      step: 1,
      latex: '\\cot\\theta = \\frac{1}{\\tan\\theta}',
      explanation: 'Cotangent is the reciprocal of tangent',
    },
    {
      step: 2,
      latex: '\\cot\\theta = \\frac{1}{\\sin\\theta / \\cos\\theta}',
      explanation: 'Substitute tan = sin/cos',
    },
    {
      step: 3,
      latex: '\\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}',
      explanation: 'Simplify the complex fraction',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const cot = 1 / Math.tan(rad)
    const ratio = Math.cos(rad) / Math.sin(rad)
    return makeVerification(cot, ratio, angleDeg)
  },
  pythonCode: `import math

def verify_cot_quotient(angle_deg):
    rad = math.radians(angle_deg)
    left = 1 / math.tan(rad)  # cot
    right = math.cos(rad) / math.sin(rad)
    return left, right  # Both equal

# Example
print(verify_cot_quotient(45))  # (1.0, 1.0)`,
  notes: 'Undefined when sin θ = 0',
}

// ============= Reciprocal Identities =============

const reciprocalCsc: TrigIdentity = {
  id: 'reciprocal-csc',
  name: 'Cosecant Reciprocal Identity',
  category: 'reciprocal',
  latex: '\\csc\\theta = \\frac{1}{\\sin\\theta}',
  latexLeft: '\\csc\\theta',
  latexRight: '\\frac{1}{\\sin\\theta}',
  description: 'Cosecant is the reciprocal of sine.',
  proofSteps: [
    {
      step: 1,
      latex: '\\csc\\theta \\cdot \\sin\\theta = 1',
      explanation: 'Definition: csc and sin are reciprocals',
    },
    {
      step: 2,
      latex: '\\csc\\theta = \\frac{1}{\\sin\\theta}',
      explanation: 'Solve for csc θ',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const csc = 1 / Math.sin(rad)
    const reciprocal = 1 / Math.sin(rad)
    return makeVerification(csc, reciprocal, angleDeg)
  },
  pythonCode: `import math

def csc(angle_deg):
    """Cosecant function."""
    return 1 / math.sin(math.radians(angle_deg))

# Example
print(csc(30))  # 2.0 (since sin(30°) = 0.5)`,
  notes: 'Undefined when sin θ = 0',
}

const reciprocalSec: TrigIdentity = {
  id: 'reciprocal-sec',
  name: 'Secant Reciprocal Identity',
  category: 'reciprocal',
  latex: '\\sec\\theta = \\frac{1}{\\cos\\theta}',
  latexLeft: '\\sec\\theta',
  latexRight: '\\frac{1}{\\cos\\theta}',
  description: 'Secant is the reciprocal of cosine.',
  proofSteps: [
    {
      step: 1,
      latex: '\\sec\\theta \\cdot \\cos\\theta = 1',
      explanation: 'Definition: sec and cos are reciprocals',
    },
    {
      step: 2,
      latex: '\\sec\\theta = \\frac{1}{\\cos\\theta}',
      explanation: 'Solve for sec θ',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const sec = 1 / Math.cos(rad)
    const reciprocal = 1 / Math.cos(rad)
    return makeVerification(sec, reciprocal, angleDeg)
  },
  pythonCode: `import math

def sec(angle_deg):
    """Secant function."""
    return 1 / math.cos(math.radians(angle_deg))

# Example
print(sec(60))  # 2.0 (since cos(60°) = 0.5)`,
  notes: 'Undefined when cos θ = 0',
}

const reciprocalCot: TrigIdentity = {
  id: 'reciprocal-cot',
  name: 'Cotangent Reciprocal Identity',
  category: 'reciprocal',
  latex: '\\cot\\theta = \\frac{1}{\\tan\\theta}',
  latexLeft: '\\cot\\theta',
  latexRight: '\\frac{1}{\\tan\\theta}',
  description: 'Cotangent is the reciprocal of tangent.',
  proofSteps: [
    {
      step: 1,
      latex: '\\cot\\theta \\cdot \\tan\\theta = 1',
      explanation: 'Definition: cot and tan are reciprocals',
    },
    {
      step: 2,
      latex: '\\cot\\theta = \\frac{1}{\\tan\\theta}',
      explanation: 'Solve for cot θ',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const cot = 1 / Math.tan(rad)
    const reciprocal = 1 / Math.tan(rad)
    return makeVerification(cot, reciprocal, angleDeg)
  },
  pythonCode: `import math

def cot(angle_deg):
    """Cotangent function."""
    return 1 / math.tan(math.radians(angle_deg))

# Example
print(cot(45))  # 1.0 (since tan(45°) = 1)`,
  notes: 'Undefined when tan θ = 0 or undefined',
}

// ============= Sum and Difference Identities =============

const sumSin: TrigIdentity = {
  id: 'sum-sin',
  name: 'Sine of Sum',
  category: 'sum-diff',
  latex: '\\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B',
  latexLeft: '\\sin(A + B)',
  latexRight: '\\sin A \\cos B + \\cos A \\sin B',
  description: 'The sine of a sum of angles. Essential for rotation matrices.',
  proofSteps: [
    {
      step: 1,
      latex: '\\text{Consider two angles } A \\text{ and } B',
      explanation: 'We want to find sin(A + B) in terms of sin and cos of A and B separately',
    },
    {
      step: 2,
      latex: '\\text{Using rotation matrix composition}',
      explanation: 'The proof uses geometric or matrix rotation arguments',
    },
    {
      step: 3,
      latex: '\\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B',
      explanation: 'The final identity',
    },
  ],
  verify: (angleDegA: number, angleDegB?: number) => {
    const B = angleDegB ?? 30
    const radA = angleDegA * DEG_TO_RAD
    const radB = B * DEG_TO_RAD
    const left = Math.sin(radA + radB)
    const right = Math.sin(radA) * Math.cos(radB) + Math.cos(radA) * Math.sin(radB)
    return makeVerification(left, right, angleDegA)
  },
  pythonCode: `import math

def sin_sum(A_deg, B_deg):
    """Calculate sin(A + B) using the identity."""
    A, B = math.radians(A_deg), math.radians(B_deg)
    return math.sin(A) * math.cos(B) + math.cos(A) * math.sin(B)

# Example: sin(75°) = sin(45° + 30°)
print(sin_sum(45, 30))  # ≈ 0.9659`,
}

const diffSin: TrigIdentity = {
  id: 'diff-sin',
  name: 'Sine of Difference',
  category: 'sum-diff',
  latex: '\\sin(A - B) = \\sin A \\cos B - \\cos A \\sin B',
  latexLeft: '\\sin(A - B)',
  latexRight: '\\sin A \\cos B - \\cos A \\sin B',
  description: 'The sine of a difference of angles.',
  proofSteps: [
    {
      step: 1,
      latex: '\\sin(A - B) = \\sin(A + (-B))',
      explanation: 'Rewrite as sum with negative angle',
    },
    {
      step: 2,
      latex: '= \\sin A \\cos(-B) + \\cos A \\sin(-B)',
      explanation: 'Apply sine sum identity',
    },
    {
      step: 3,
      latex: '= \\sin A \\cos B - \\cos A \\sin B',
      explanation: 'Use cos(-B) = cos B and sin(-B) = -sin B',
    },
  ],
  verify: (angleDegA: number, angleDegB?: number) => {
    const B = angleDegB ?? 30
    const radA = angleDegA * DEG_TO_RAD
    const radB = B * DEG_TO_RAD
    const left = Math.sin(radA - radB)
    const right = Math.sin(radA) * Math.cos(radB) - Math.cos(radA) * Math.sin(radB)
    return makeVerification(left, right, angleDegA)
  },
  pythonCode: `import math

def sin_diff(A_deg, B_deg):
    """Calculate sin(A - B) using the identity."""
    A, B = math.radians(A_deg), math.radians(B_deg)
    return math.sin(A) * math.cos(B) - math.cos(A) * math.sin(B)

# Example: sin(15°) = sin(45° - 30°)
print(sin_diff(45, 30))  # ≈ 0.2588`,
}

const sumCos: TrigIdentity = {
  id: 'sum-cos',
  name: 'Cosine of Sum',
  category: 'sum-diff',
  latex: '\\cos(A + B) = \\cos A \\cos B - \\sin A \\sin B',
  latexLeft: '\\cos(A + B)',
  latexRight: '\\cos A \\cos B - \\sin A \\sin B',
  description: 'The cosine of a sum of angles. Note the minus sign!',
  proofSteps: [
    {
      step: 1,
      latex: '\\cos(A + B) = \\sin(90° - (A + B))',
      explanation: 'Use complementary angle relationship',
    },
    {
      step: 2,
      latex: '= \\sin((90° - A) - B)',
      explanation: 'Rearrange the argument',
    },
    {
      step: 3,
      latex: '\\cos(A + B) = \\cos A \\cos B - \\sin A \\sin B',
      explanation: 'The final identity (note the minus sign)',
    },
  ],
  verify: (angleDegA: number, angleDegB?: number) => {
    const B = angleDegB ?? 30
    const radA = angleDegA * DEG_TO_RAD
    const radB = B * DEG_TO_RAD
    const left = Math.cos(radA + radB)
    const right = Math.cos(radA) * Math.cos(radB) - Math.sin(radA) * Math.sin(radB)
    return makeVerification(left, right, angleDegA)
  },
  pythonCode: `import math

def cos_sum(A_deg, B_deg):
    """Calculate cos(A + B) using the identity."""
    A, B = math.radians(A_deg), math.radians(B_deg)
    return math.cos(A) * math.cos(B) - math.sin(A) * math.sin(B)

# Example: cos(75°) = cos(45° + 30°)
print(cos_sum(45, 30))  # ≈ 0.2588`,
}

const diffCos: TrigIdentity = {
  id: 'diff-cos',
  name: 'Cosine of Difference',
  category: 'sum-diff',
  latex: '\\cos(A - B) = \\cos A \\cos B + \\sin A \\sin B',
  latexLeft: '\\cos(A - B)',
  latexRight: '\\cos A \\cos B + \\sin A \\sin B',
  description: 'The cosine of a difference of angles. Note the plus sign!',
  proofSteps: [
    {
      step: 1,
      latex: '\\cos(A - B) = \\cos(A + (-B))',
      explanation: 'Rewrite as sum with negative angle',
    },
    {
      step: 2,
      latex: '= \\cos A \\cos(-B) - \\sin A \\sin(-B)',
      explanation: 'Apply cosine sum identity',
    },
    {
      step: 3,
      latex: '= \\cos A \\cos B + \\sin A \\sin B',
      explanation: 'Use cos(-B) = cos B and sin(-B) = -sin B',
    },
  ],
  verify: (angleDegA: number, angleDegB?: number) => {
    const B = angleDegB ?? 30
    const radA = angleDegA * DEG_TO_RAD
    const radB = B * DEG_TO_RAD
    const left = Math.cos(radA - radB)
    const right = Math.cos(radA) * Math.cos(radB) + Math.sin(radA) * Math.sin(radB)
    return makeVerification(left, right, angleDegA)
  },
  pythonCode: `import math

def cos_diff(A_deg, B_deg):
    """Calculate cos(A - B) using the identity."""
    A, B = math.radians(A_deg), math.radians(B_deg)
    return math.cos(A) * math.cos(B) + math.sin(A) * math.sin(B)

# Example: cos(15°) = cos(45° - 30°)
print(cos_diff(45, 30))  # ≈ 0.9659`,
}

const sumTan: TrigIdentity = {
  id: 'sum-tan',
  name: 'Tangent of Sum',
  category: 'sum-diff',
  latex: '\\tan(A + B) = \\frac{\\tan A + \\tan B}{1 - \\tan A \\tan B}',
  latexLeft: '\\tan(A + B)',
  latexRight: '\\frac{\\tan A + \\tan B}{1 - \\tan A \\tan B}',
  description: 'The tangent of a sum of angles.',
  proofSteps: [
    {
      step: 1,
      latex: '\\tan(A + B) = \\frac{\\sin(A + B)}{\\cos(A + B)}',
      explanation: 'Use tan = sin/cos',
    },
    {
      step: 2,
      latex: '= \\frac{\\sin A \\cos B + \\cos A \\sin B}{\\cos A \\cos B - \\sin A \\sin B}',
      explanation: 'Apply sum formulas',
    },
    {
      step: 3,
      latex: '= \\frac{\\tan A + \\tan B}{1 - \\tan A \\tan B}',
      explanation: 'Divide numerator and denominator by cos A cos B',
    },
  ],
  verify: (angleDegA: number, angleDegB?: number) => {
    const B = angleDegB ?? 30
    const radA = angleDegA * DEG_TO_RAD
    const radB = B * DEG_TO_RAD
    const left = Math.tan(radA + radB)
    const tanA = Math.tan(radA)
    const tanB = Math.tan(radB)
    const right = (tanA + tanB) / (1 - tanA * tanB)
    return makeVerification(left, right, angleDegA)
  },
  pythonCode: `import math

def tan_sum(A_deg, B_deg):
    """Calculate tan(A + B) using the identity."""
    A, B = math.radians(A_deg), math.radians(B_deg)
    tan_A, tan_B = math.tan(A), math.tan(B)
    return (tan_A + tan_B) / (1 - tan_A * tan_B)

# Example: tan(75°) = tan(45° + 30°)
print(tan_sum(45, 30))  # ≈ 3.732`,
  notes: 'Undefined when tan A · tan B = 1',
}

// ============= Double Angle Identities =============

const doubleSin: TrigIdentity = {
  id: 'double-sin',
  name: 'Sine Double Angle',
  category: 'double',
  latex: '\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta',
  latexLeft: '\\sin(2\\theta)',
  latexRight: '2\\sin\\theta\\cos\\theta',
  description: 'The sine of double an angle. Derived from the sum formula with A = B.',
  proofSteps: [
    {
      step: 1,
      latex: '\\sin(2\\theta) = \\sin(\\theta + \\theta)',
      explanation: 'Rewrite 2θ as θ + θ',
    },
    {
      step: 2,
      latex: '= \\sin\\theta\\cos\\theta + \\cos\\theta\\sin\\theta',
      explanation: 'Apply sine sum formula',
    },
    {
      step: 3,
      latex: '= 2\\sin\\theta\\cos\\theta',
      explanation: 'Combine like terms',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const left = Math.sin(2 * rad)
    const right = 2 * Math.sin(rad) * Math.cos(rad)
    return makeVerification(left, right, angleDeg)
  },
  pythonCode: `import math

def sin_double(angle_deg):
    """Calculate sin(2θ) using the identity."""
    rad = math.radians(angle_deg)
    return 2 * math.sin(rad) * math.cos(rad)

# Example: sin(60°) = sin(2 × 30°)
print(sin_double(30))  # ≈ 0.866`,
}

const doubleCosV1: TrigIdentity = {
  id: 'double-cos-v1',
  name: 'Cosine Double Angle (Form 1)',
  category: 'double',
  latex: '\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta',
  latexLeft: '\\cos(2\\theta)',
  latexRight: '\\cos^2\\theta - \\sin^2\\theta',
  description: 'The cosine of double an angle. This is the most symmetric form.',
  proofSteps: [
    {
      step: 1,
      latex: '\\cos(2\\theta) = \\cos(\\theta + \\theta)',
      explanation: 'Rewrite 2θ as θ + θ',
    },
    {
      step: 2,
      latex: '= \\cos\\theta\\cos\\theta - \\sin\\theta\\sin\\theta',
      explanation: 'Apply cosine sum formula',
    },
    {
      step: 3,
      latex: '= \\cos^2\\theta - \\sin^2\\theta',
      explanation: 'Simplify',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const left = Math.cos(2 * rad)
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    const right = cos * cos - sin * sin
    return makeVerification(left, right, angleDeg)
  },
  pythonCode: `import math

def cos_double_v1(angle_deg):
    """Calculate cos(2θ) using cos²θ - sin²θ."""
    rad = math.radians(angle_deg)
    return math.cos(rad)**2 - math.sin(rad)**2

# Example: cos(60°) = cos(2 × 30°)
print(cos_double_v1(30))  # 0.5`,
}

const doubleCosV2: TrigIdentity = {
  id: 'double-cos-v2',
  name: 'Cosine Double Angle (Form 2)',
  category: 'double',
  latex: '\\cos(2\\theta) = 2\\cos^2\\theta - 1',
  latexLeft: '\\cos(2\\theta)',
  latexRight: '2\\cos^2\\theta - 1',
  description: 'Alternative form using only cosine. Useful for power reduction.',
  proofSteps: [
    {
      step: 1,
      latex: '\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta',
      explanation: 'Start with form 1',
    },
    {
      step: 2,
      latex: '= \\cos^2\\theta - (1 - \\cos^2\\theta)',
      explanation: 'Substitute sin²θ = 1 - cos²θ',
    },
    {
      step: 3,
      latex: '= 2\\cos^2\\theta - 1',
      explanation: 'Simplify',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const left = Math.cos(2 * rad)
    const cos = Math.cos(rad)
    const right = 2 * cos * cos - 1
    return makeVerification(left, right, angleDeg)
  },
  pythonCode: `import math

def cos_double_v2(angle_deg):
    """Calculate cos(2θ) using 2cos²θ - 1."""
    rad = math.radians(angle_deg)
    return 2 * math.cos(rad)**2 - 1

# Example
print(cos_double_v2(30))  # 0.5`,
}

const doubleCosV3: TrigIdentity = {
  id: 'double-cos-v3',
  name: 'Cosine Double Angle (Form 3)',
  category: 'double',
  latex: '\\cos(2\\theta) = 1 - 2\\sin^2\\theta',
  latexLeft: '\\cos(2\\theta)',
  latexRight: '1 - 2\\sin^2\\theta',
  description: 'Alternative form using only sine.',
  proofSteps: [
    {
      step: 1,
      latex: '\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta',
      explanation: 'Start with form 1',
    },
    {
      step: 2,
      latex: '= (1 - \\sin^2\\theta) - \\sin^2\\theta',
      explanation: 'Substitute cos²θ = 1 - sin²θ',
    },
    {
      step: 3,
      latex: '= 1 - 2\\sin^2\\theta',
      explanation: 'Simplify',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const left = Math.cos(2 * rad)
    const sin = Math.sin(rad)
    const right = 1 - 2 * sin * sin
    return makeVerification(left, right, angleDeg)
  },
  pythonCode: `import math

def cos_double_v3(angle_deg):
    """Calculate cos(2θ) using 1 - 2sin²θ."""
    rad = math.radians(angle_deg)
    return 1 - 2 * math.sin(rad)**2

# Example
print(cos_double_v3(30))  # 0.5`,
}

const doubleTan: TrigIdentity = {
  id: 'double-tan',
  name: 'Tangent Double Angle',
  category: 'double',
  latex: '\\tan(2\\theta) = \\frac{2\\tan\\theta}{1 - \\tan^2\\theta}',
  latexLeft: '\\tan(2\\theta)',
  latexRight: '\\frac{2\\tan\\theta}{1 - \\tan^2\\theta}',
  description: 'The tangent of double an angle.',
  proofSteps: [
    {
      step: 1,
      latex: '\\tan(2\\theta) = \\tan(\\theta + \\theta)',
      explanation: 'Rewrite 2θ as θ + θ',
    },
    {
      step: 2,
      latex: '= \\frac{\\tan\\theta + \\tan\\theta}{1 - \\tan\\theta \\cdot \\tan\\theta}',
      explanation: 'Apply tangent sum formula with A = B = θ',
    },
    {
      step: 3,
      latex: '= \\frac{2\\tan\\theta}{1 - \\tan^2\\theta}',
      explanation: 'Simplify',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const left = Math.tan(2 * rad)
    const tan = Math.tan(rad)
    const right = (2 * tan) / (1 - tan * tan)
    return makeVerification(left, right, angleDeg)
  },
  pythonCode: `import math

def tan_double(angle_deg):
    """Calculate tan(2θ) using the identity."""
    rad = math.radians(angle_deg)
    tan = math.tan(rad)
    return (2 * tan) / (1 - tan**2)

# Example: tan(60°) = tan(2 × 30°)
print(tan_double(30))  # ≈ 1.732`,
  notes: 'Undefined when tan²θ = 1 (i.e., θ = 45°)',
}

// ============= Half Angle Identities =============

const halfSin: TrigIdentity = {
  id: 'half-sin',
  name: 'Sine Half Angle',
  category: 'half',
  latex: '\\sin\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1 - \\cos\\theta}{2}}',
  latexLeft: '\\sin\\frac{\\theta}{2}',
  latexRight: '\\pm\\sqrt{\\frac{1 - \\cos\\theta}{2}}',
  description: 'The sine of half an angle. Sign depends on the quadrant.',
  proofSteps: [
    {
      step: 1,
      latex: '\\cos(2\\alpha) = 1 - 2\\sin^2\\alpha',
      explanation: 'Start with double angle formula (form 3)',
    },
    {
      step: 2,
      latex: '\\sin^2\\alpha = \\frac{1 - \\cos(2\\alpha)}{2}',
      explanation: 'Solve for sin²α',
    },
    {
      step: 3,
      latex: '\\sin\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1 - \\cos\\theta}{2}}',
      explanation: 'Let θ = 2α, so α = θ/2',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const left = Math.abs(Math.sin(rad / 2))
    const right = Math.sqrt((1 - Math.cos(rad)) / 2)
    return makeVerification(left, right, angleDeg)
  },
  pythonCode: `import math

def sin_half(angle_deg):
    """Calculate |sin(θ/2)| using the identity."""
    rad = math.radians(angle_deg)
    return math.sqrt((1 - math.cos(rad)) / 2)

# Example: sin(30°) = sin(60°/2)
print(sin_half(60))  # 0.5`,
  notes: '± sign determined by the quadrant of θ/2',
}

const halfCos: TrigIdentity = {
  id: 'half-cos',
  name: 'Cosine Half Angle',
  category: 'half',
  latex: '\\cos\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1 + \\cos\\theta}{2}}',
  latexLeft: '\\cos\\frac{\\theta}{2}',
  latexRight: '\\pm\\sqrt{\\frac{1 + \\cos\\theta}{2}}',
  description: 'The cosine of half an angle. Sign depends on the quadrant.',
  proofSteps: [
    {
      step: 1,
      latex: '\\cos(2\\alpha) = 2\\cos^2\\alpha - 1',
      explanation: 'Start with double angle formula (form 2)',
    },
    {
      step: 2,
      latex: '\\cos^2\\alpha = \\frac{1 + \\cos(2\\alpha)}{2}',
      explanation: 'Solve for cos²α',
    },
    {
      step: 3,
      latex: '\\cos\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1 + \\cos\\theta}{2}}',
      explanation: 'Let θ = 2α, so α = θ/2',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const left = Math.abs(Math.cos(rad / 2))
    const right = Math.sqrt((1 + Math.cos(rad)) / 2)
    return makeVerification(left, right, angleDeg)
  },
  pythonCode: `import math

def cos_half(angle_deg):
    """Calculate |cos(θ/2)| using the identity."""
    rad = math.radians(angle_deg)
    return math.sqrt((1 + math.cos(rad)) / 2)

# Example: cos(30°) = cos(60°/2)
print(cos_half(60))  # ≈ 0.866`,
  notes: '± sign determined by the quadrant of θ/2',
}

const halfTan: TrigIdentity = {
  id: 'half-tan',
  name: 'Tangent Half Angle',
  category: 'half',
  latex: '\\tan\\frac{\\theta}{2} = \\frac{1 - \\cos\\theta}{\\sin\\theta} = \\frac{\\sin\\theta}{1 + \\cos\\theta}',
  latexLeft: '\\tan\\frac{\\theta}{2}',
  latexRight: '\\frac{1 - \\cos\\theta}{\\sin\\theta}',
  description: 'The tangent of half an angle. Two equivalent forms.',
  proofSteps: [
    {
      step: 1,
      latex: '\\tan\\frac{\\theta}{2} = \\frac{\\sin(\\theta/2)}{\\cos(\\theta/2)}',
      explanation: 'Definition of tangent',
    },
    {
      step: 2,
      latex: '= \\frac{\\sqrt{(1-\\cos\\theta)/2}}{\\sqrt{(1+\\cos\\theta)/2}}',
      explanation: 'Apply half-angle formulas',
    },
    {
      step: 3,
      latex: '= \\frac{1 - \\cos\\theta}{\\sin\\theta} = \\frac{\\sin\\theta}{1 + \\cos\\theta}',
      explanation: 'Simplify (both forms are valid)',
    },
  ],
  verify: (angleDeg: number) => {
    const rad = angleDeg * DEG_TO_RAD
    const left = Math.tan(rad / 2)
    const right = (1 - Math.cos(rad)) / Math.sin(rad)
    return makeVerification(left, right, angleDeg)
  },
  pythonCode: `import math

def tan_half(angle_deg):
    """Calculate tan(θ/2) using the identity."""
    rad = math.radians(angle_deg)
    return (1 - math.cos(rad)) / math.sin(rad)

# Example: tan(30°) = tan(60°/2)
print(tan_half(60))  # ≈ 0.577`,
  notes: 'Undefined when sin θ = 0',
}

// ============= Identity Collections =============

export const PYTHAGOREAN_IDENTITIES: TrigIdentity[] = [
  pythagoreanMain,
  pythagoreanTan,
  pythagoreanCot,
]

export const QUOTIENT_IDENTITIES: TrigIdentity[] = [
  quotientTan,
  quotientCot,
]

export const RECIPROCAL_IDENTITIES: TrigIdentity[] = [
  reciprocalCsc,
  reciprocalSec,
  reciprocalCot,
]

export const SUM_DIFFERENCE_IDENTITIES: TrigIdentity[] = [
  sumSin,
  diffSin,
  sumCos,
  diffCos,
  sumTan,
]

export const DOUBLE_ANGLE_IDENTITIES: TrigIdentity[] = [
  doubleSin,
  doubleCosV1,
  doubleCosV2,
  doubleCosV3,
  doubleTan,
]

export const HALF_ANGLE_IDENTITIES: TrigIdentity[] = [
  halfSin,
  halfCos,
  halfTan,
]

export const ALL_IDENTITIES: TrigIdentity[] = [
  ...PYTHAGOREAN_IDENTITIES,
  ...QUOTIENT_IDENTITIES,
  ...RECIPROCAL_IDENTITIES,
  ...SUM_DIFFERENCE_IDENTITIES,
  ...DOUBLE_ANGLE_IDENTITIES,
  ...HALF_ANGLE_IDENTITIES,
]

// ============= Utility Functions =============

/**
 * Get an identity by its ID.
 */
export function getIdentityById(id: string): TrigIdentity | undefined {
  return ALL_IDENTITIES.find(identity => identity.id === id)
}

/**
 * Get all identities in a category.
 */
export function getIdentitiesByCategory(category: IdentityCategory): TrigIdentity[] {
  return ALL_IDENTITIES.filter(identity => identity.category === category)
}

/**
 * Verify an identity at a specific angle.
 */
export function verifyIdentity(identity: TrigIdentity, angleDeg: number, angleDeg2?: number): VerificationResult {
  return identity.verify(angleDeg, angleDeg2)
}

/**
 * Verify all identities at a specific angle.
 */
export function verifyAllIdentities(angleDeg: number): Map<string, VerificationResult> {
  const results = new Map<string, VerificationResult>()
  for (const identity of ALL_IDENTITIES) {
    results.set(identity.id, identity.verify(angleDeg))
  }
  return results
}

/**
 * Get a category label for display.
 */
export function getCategoryLabel(category: IdentityCategory): string {
  switch (category) {
    case 'pythagorean':
      return 'Pythagorean Identities'
    case 'quotient':
      return 'Quotient Identities'
    case 'reciprocal':
      return 'Reciprocal Identities'
    case 'sum-diff':
      return 'Sum & Difference Formulas'
    case 'double':
      return 'Double Angle Formulas'
    case 'half':
      return 'Half Angle Formulas'
    case 'product-sum':
      return 'Product-to-Sum Formulas'
    default:
      return category
  }
}

/**
 * Get all unique categories.
 */
export function getAllCategories(): IdentityCategory[] {
  return ['pythagorean', 'quotient', 'reciprocal', 'sum-diff', 'double', 'half']
}
