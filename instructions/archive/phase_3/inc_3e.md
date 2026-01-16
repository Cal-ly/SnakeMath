# SnakeMath - Increment 3E: Symbol Data Files

## Context
Populating the symbol data files with comprehensive math symbols. Data is split by category for maintainability and potential tree-shaking.

## Design Decisions
- **Structure**: Split by category in `src/data/symbols/`
- **Fields**: symbol, name, latex, meaning, programmingAnalogy, example
- **Categories**: arithmetic, algebra, calculus, sets, logic, constants, greek, ml

## Task
Create comprehensive symbol data files.

## Requirements

### 1. Create Symbol Type Definitions
Create `src/types/symbols.ts`:

```typescript
/**
 * A mathematical symbol with its metadata
 */
export interface MathSymbol {
  /** The symbol itself (Unicode character) */
  symbol: string
  /** Human-readable name */
  name: string
  /** LaTeX command to produce this symbol */
  latex: string
  /** What the symbol means in math */
  meaning: string
  /** Programming equivalent or analogy */
  programmingAnalogy?: string
  /** Python code example */
  pythonExample?: string
  /** Common use cases */
  commonUses?: string[]
  /** Related symbols */
  related?: string[]
  /** Category for filtering */
  category: SymbolCategory
}

/**
 * Symbol categories
 */
export type SymbolCategory = 
  | 'arithmetic'
  | 'algebra'
  | 'calculus'
  | 'sets'
  | 'logic'
  | 'constants'
  | 'greek'
  | 'ml'

/**
 * Greek letter with uppercase variant
 */
export interface GreekLetter {
  lowercase: string
  uppercase: string
  name: string
  latex: string
  uppercaseLaTeX: string
  commonUses: string[]
}
```

### 2. Update Types Barrel Export
Update `src/types/index.ts` to include symbol types:

```typescript
// ... existing exports ...
export type { MathSymbol, SymbolCategory, GreekLetter } from './symbols'
```

### 3. Create Arithmetic Symbols
Create `src/data/symbols/arithmetic.ts`:

```typescript
import type { MathSymbol } from '@/types'

export const arithmeticSymbols: MathSymbol[] = [
  {
    symbol: '+',
    name: 'Plus',
    latex: '+',
    meaning: 'Addition',
    programmingAnalogy: 'a + b',
    pythonExample: 'result = 5 + 3  # 8',
    category: 'arithmetic',
  },
  {
    symbol: '−',
    name: 'Minus',
    latex: '-',
    meaning: 'Subtraction',
    programmingAnalogy: 'a - b',
    pythonExample: 'result = 10 - 4  # 6',
    category: 'arithmetic',
  },
  {
    symbol: '×',
    name: 'Times',
    latex: '\\times',
    meaning: 'Multiplication',
    programmingAnalogy: 'a * b',
    pythonExample: 'result = 6 * 7  # 42',
    category: 'arithmetic',
  },
  {
    symbol: '÷',
    name: 'Division',
    latex: '\\div',
    meaning: 'Division',
    programmingAnalogy: 'a / b',
    pythonExample: 'result = 15 / 3  # 5.0',
    category: 'arithmetic',
  },
  {
    symbol: '=',
    name: 'Equals',
    latex: '=',
    meaning: 'Equality',
    programmingAnalogy: '== (comparison)',
    pythonExample: 'x == y  # True if equal',
    category: 'arithmetic',
  },
  {
    symbol: '≠',
    name: 'Not equal',
    latex: '\\neq',
    meaning: 'Inequality',
    programmingAnalogy: '!=',
    pythonExample: 'x != y  # True if not equal',
    category: 'arithmetic',
  },
  {
    symbol: '<',
    name: 'Less than',
    latex: '<',
    meaning: 'Less than',
    programmingAnalogy: '<',
    pythonExample: '3 < 5  # True',
    category: 'arithmetic',
  },
  {
    symbol: '>',
    name: 'Greater than',
    latex: '>',
    meaning: 'Greater than',
    programmingAnalogy: '>',
    pythonExample: '7 > 2  # True',
    category: 'arithmetic',
  },
  {
    symbol: '≤',
    name: 'Less than or equal',
    latex: '\\leq',
    meaning: 'Less than or equal to',
    programmingAnalogy: '<=',
    pythonExample: 'x <= 10',
    category: 'arithmetic',
  },
  {
    symbol: '≥',
    name: 'Greater than or equal',
    latex: '\\geq',
    meaning: 'Greater than or equal to',
    programmingAnalogy: '>=',
    pythonExample: 'x >= 0',
    category: 'arithmetic',
  },
  {
    symbol: '±',
    name: 'Plus-minus',
    latex: '\\pm',
    meaning: 'Plus or minus',
    programmingAnalogy: '[x + y, x - y]',
    pythonExample: '# Both roots: x = (-b ± sqrt(d)) / 2a',
    category: 'arithmetic',
  },
  {
    symbol: '≈',
    name: 'Approximately equal',
    latex: '\\approx',
    meaning: 'Approximately equal to',
    programmingAnalogy: 'math.isclose(a, b)',
    pythonExample: 'import math; math.isclose(0.1+0.2, 0.3)',
    category: 'arithmetic',
  },
]
```

### 4. Create Algebra Symbols
Create `src/data/symbols/algebra.ts`:

```typescript
import type { MathSymbol } from '@/types'

export const algebraSymbols: MathSymbol[] = [
  {
    symbol: '∑',
    name: 'Sigma (summation)',
    latex: '\\sum',
    meaning: 'Sum of a sequence',
    programmingAnalogy: 'sum() or for loop',
    pythonExample: 'sum(range(1, n+1))  # ∑i from 1 to n',
    commonUses: ['Series', 'Statistics', 'ML loss functions'],
    category: 'algebra',
  },
  {
    symbol: '∏',
    name: 'Pi (product)',
    latex: '\\prod',
    meaning: 'Product of a sequence',
    programmingAnalogy: 'math.prod() or for loop with *=',
    pythonExample: 'math.prod(range(1, n+1))  # n!',
    commonUses: ['Factorial', 'Probability'],
    category: 'algebra',
  },
  {
    symbol: '√',
    name: 'Square root',
    latex: '\\sqrt{}',
    meaning: 'Square root',
    programmingAnalogy: 'math.sqrt(x) or x ** 0.5',
    pythonExample: 'import math; math.sqrt(16)  # 4.0',
    category: 'algebra',
  },
  {
    symbol: 'ⁿ√',
    name: 'nth root',
    latex: '\\sqrt[n]{}',
    meaning: 'nth root',
    programmingAnalogy: 'x ** (1/n)',
    pythonExample: '27 ** (1/3)  # 3.0 (cube root)',
    category: 'algebra',
  },
  {
    symbol: '|x|',
    name: 'Absolute value',
    latex: '|x|',
    meaning: 'Absolute value / magnitude',
    programmingAnalogy: 'abs(x)',
    pythonExample: 'abs(-5)  # 5',
    category: 'algebra',
  },
  {
    symbol: 'xⁿ',
    name: 'Exponent',
    latex: 'x^n',
    meaning: 'x raised to power n',
    programmingAnalogy: 'x ** n or pow(x, n)',
    pythonExample: '2 ** 10  # 1024',
    category: 'algebra',
  },
  {
    symbol: 'log',
    name: 'Logarithm',
    latex: '\\log',
    meaning: 'Logarithm (base 10)',
    programmingAnalogy: 'math.log10(x)',
    pythonExample: 'math.log10(100)  # 2.0',
    category: 'algebra',
  },
  {
    symbol: 'ln',
    name: 'Natural logarithm',
    latex: '\\ln',
    meaning: 'Natural log (base e)',
    programmingAnalogy: 'math.log(x)',
    pythonExample: 'math.log(math.e)  # 1.0',
    category: 'algebra',
  },
  {
    symbol: '!',
    name: 'Factorial',
    latex: 'n!',
    meaning: 'n × (n-1) × ... × 1',
    programmingAnalogy: 'math.factorial(n)',
    pythonExample: 'math.factorial(5)  # 120',
    category: 'algebra',
  },
  {
    symbol: '(ⁿₖ)',
    name: 'Binomial coefficient',
    latex: '\\binom{n}{k}',
    meaning: 'n choose k',
    programmingAnalogy: 'math.comb(n, k)',
    pythonExample: 'math.comb(5, 2)  # 10',
    commonUses: ['Combinations', 'Probability', 'Pascal\'s triangle'],
    category: 'algebra',
  },
]
```

### 5. Create Calculus Symbols
Create `src/data/symbols/calculus.ts`:

```typescript
import type { MathSymbol } from '@/types'

export const calculusSymbols: MathSymbol[] = [
  {
    symbol: '∫',
    name: 'Integral',
    latex: '\\int',
    meaning: 'Integration',
    programmingAnalogy: 'scipy.integrate.quad()',
    pythonExample: 'from scipy import integrate; integrate.quad(f, a, b)',
    commonUses: ['Area under curve', 'Accumulation', 'Probability'],
    category: 'calculus',
  },
  {
    symbol: '∬',
    name: 'Double integral',
    latex: '\\iint',
    meaning: 'Integration over 2D region',
    programmingAnalogy: 'scipy.integrate.dblquad()',
    pythonExample: 'integrate.dblquad(f, a, b, g, h)',
    category: 'calculus',
  },
  {
    symbol: 'd/dx',
    name: 'Derivative',
    latex: '\\frac{d}{dx}',
    meaning: 'Derivative with respect to x',
    programmingAnalogy: 'sympy.diff(f, x)',
    pythonExample: 'from sympy import diff, symbols; x = symbols("x"); diff(x**2, x)',
    category: 'calculus',
  },
  {
    symbol: '∂',
    name: 'Partial derivative',
    latex: '\\partial',
    meaning: 'Partial derivative',
    programmingAnalogy: 'sympy.diff(f, x) with multiple vars',
    pythonExample: 'diff(x**2 + y**2, x)  # 2x',
    commonUses: ['Multivariable calc', 'Gradients', 'ML'],
    category: 'calculus',
  },
  {
    symbol: '∇',
    name: 'Nabla / Del',
    latex: '\\nabla',
    meaning: 'Gradient operator',
    programmingAnalogy: 'np.gradient() or manual partial derivatives',
    pythonExample: '# Gradient descent: θ = θ - α∇J(θ)',
    commonUses: ['Gradient', 'Divergence', 'ML optimization'],
    category: 'calculus',
  },
  {
    symbol: 'Δ',
    name: 'Delta',
    latex: '\\Delta',
    meaning: 'Change / difference',
    programmingAnalogy: 'new_value - old_value',
    pythonExample: 'delta_x = x2 - x1',
    category: 'calculus',
  },
  {
    symbol: 'lim',
    name: 'Limit',
    latex: '\\lim',
    meaning: 'Limit of a function',
    programmingAnalogy: 'sympy.limit()',
    pythonExample: 'from sympy import limit, oo; limit(1/x, x, oo)',
    category: 'calculus',
  },
  {
    symbol: '→',
    name: 'Approaches',
    latex: '\\to',
    meaning: 'Approaches / tends to',
    programmingAnalogy: 'while abs(f(x) - target) > epsilon',
    pythonExample: '# As x → ∞, 1/x → 0',
    category: 'calculus',
  },
  {
    symbol: 'f\'(x)',
    name: 'Prime notation',
    latex: "f'(x)",
    meaning: 'First derivative of f',
    programmingAnalogy: 'diff(f, x)',
    pythonExample: '# f(x) = x²  →  f\'(x) = 2x',
    category: 'calculus',
  },
]
```

### 6. Create Sets & Logic Symbols
Create `src/data/symbols/sets.ts`:

```typescript
import type { MathSymbol } from '@/types'

export const setSymbols: MathSymbol[] = [
  {
    symbol: '∈',
    name: 'Element of',
    latex: '\\in',
    meaning: 'Is an element of',
    programmingAnalogy: 'in',
    pythonExample: '3 in {1, 2, 3}  # True',
    category: 'sets',
  },
  {
    symbol: '∉',
    name: 'Not element of',
    latex: '\\notin',
    meaning: 'Is not an element of',
    programmingAnalogy: 'not in',
    pythonExample: '5 not in {1, 2, 3}  # True',
    category: 'sets',
  },
  {
    symbol: '⊂',
    name: 'Proper subset',
    latex: '\\subset',
    meaning: 'Is a proper subset of',
    programmingAnalogy: 'a < b (for sets)',
    pythonExample: '{1, 2} < {1, 2, 3}  # True',
    category: 'sets',
  },
  {
    symbol: '⊆',
    name: 'Subset',
    latex: '\\subseteq',
    meaning: 'Is a subset of',
    programmingAnalogy: 'a <= b (for sets)',
    pythonExample: '{1, 2}.issubset({1, 2, 3})',
    category: 'sets',
  },
  {
    symbol: '∪',
    name: 'Union',
    latex: '\\cup',
    meaning: 'Set union',
    programmingAnalogy: 'a | b or a.union(b)',
    pythonExample: '{1, 2} | {2, 3}  # {1, 2, 3}',
    category: 'sets',
  },
  {
    symbol: '∩',
    name: 'Intersection',
    latex: '\\cap',
    meaning: 'Set intersection',
    programmingAnalogy: 'a & b or a.intersection(b)',
    pythonExample: '{1, 2} & {2, 3}  # {2}',
    category: 'sets',
  },
  {
    symbol: '∅',
    name: 'Empty set',
    latex: '\\emptyset',
    meaning: 'The empty set',
    programmingAnalogy: 'set()',
    pythonExample: 'empty = set()  # or {}',
    category: 'sets',
  },
  {
    symbol: '\\',
    name: 'Set difference',
    latex: '\\setminus',
    meaning: 'Set difference (A minus B)',
    programmingAnalogy: 'a - b or a.difference(b)',
    pythonExample: '{1, 2, 3} - {2}  # {1, 3}',
    category: 'sets',
  },
  {
    symbol: '|A|',
    name: 'Cardinality',
    latex: '|A|',
    meaning: 'Number of elements in set',
    programmingAnalogy: 'len(A)',
    pythonExample: 'len({1, 2, 3})  # 3',
    category: 'sets',
  },
]

export const logicSymbols: MathSymbol[] = [
  {
    symbol: '∧',
    name: 'Logical AND',
    latex: '\\land',
    meaning: 'Logical conjunction',
    programmingAnalogy: 'and',
    pythonExample: 'True and False  # False',
    category: 'logic',
  },
  {
    symbol: '∨',
    name: 'Logical OR',
    latex: '\\lor',
    meaning: 'Logical disjunction',
    programmingAnalogy: 'or',
    pythonExample: 'True or False  # True',
    category: 'logic',
  },
  {
    symbol: '¬',
    name: 'Logical NOT',
    latex: '\\neg',
    meaning: 'Logical negation',
    programmingAnalogy: 'not',
    pythonExample: 'not True  # False',
    category: 'logic',
  },
  {
    symbol: '⇒',
    name: 'Implies',
    latex: '\\Rightarrow',
    meaning: 'Logical implication',
    programmingAnalogy: 'if A: then B',
    pythonExample: '# A ⇒ B means "if A then B"',
    category: 'logic',
  },
  {
    symbol: '⇔',
    name: 'If and only if',
    latex: '\\Leftrightarrow',
    meaning: 'Bi-conditional',
    programmingAnalogy: 'A == B (for booleans)',
    pythonExample: '# A ⇔ B means A and B are equivalent',
    category: 'logic',
  },
  {
    symbol: '∀',
    name: 'For all',
    latex: '\\forall',
    meaning: 'Universal quantifier',
    programmingAnalogy: 'all()',
    pythonExample: 'all(x > 0 for x in items)',
    category: 'logic',
  },
  {
    symbol: '∃',
    name: 'There exists',
    latex: '\\exists',
    meaning: 'Existential quantifier',
    programmingAnalogy: 'any()',
    pythonExample: 'any(x > 0 for x in items)',
    category: 'logic',
  },
]
```

### 7. Create Constants
Create `src/data/symbols/constants.ts`:

```typescript
import type { MathSymbol } from '@/types'

export const constantSymbols: MathSymbol[] = [
  {
    symbol: 'π',
    name: 'Pi',
    latex: '\\pi',
    meaning: 'Ratio of circumference to diameter',
    programmingAnalogy: 'math.pi',
    pythonExample: 'import math; math.pi  # 3.14159...',
    commonUses: ['Circles', 'Trigonometry', 'Waves'],
    category: 'constants',
  },
  {
    symbol: 'e',
    name: "Euler's number",
    latex: 'e',
    meaning: 'Base of natural logarithm',
    programmingAnalogy: 'math.e',
    pythonExample: 'math.e  # 2.71828...',
    commonUses: ['Exponential growth', 'Compound interest', 'Calculus'],
    category: 'constants',
  },
  {
    symbol: 'i',
    name: 'Imaginary unit',
    latex: 'i',
    meaning: 'Square root of -1',
    programmingAnalogy: '1j (complex number)',
    pythonExample: 'z = 3 + 4j  # Complex number',
    commonUses: ['Complex numbers', 'Signal processing', 'Quantum'],
    category: 'constants',
  },
  {
    symbol: '∞',
    name: 'Infinity',
    latex: '\\infty',
    meaning: 'Infinity',
    programmingAnalogy: 'float("inf") or math.inf',
    pythonExample: 'math.inf > 1e308  # True',
    commonUses: ['Limits', 'Asymptotes', 'Unbounded'],
    category: 'constants',
  },
  {
    symbol: 'φ',
    name: 'Golden ratio',
    latex: '\\phi',
    meaning: '(1 + √5) / 2 ≈ 1.618',
    programmingAnalogy: '(1 + math.sqrt(5)) / 2',
    pythonExample: 'phi = (1 + 5**0.5) / 2  # 1.618...',
    commonUses: ['Art', 'Nature', 'Fibonacci'],
    category: 'constants',
  },
]
```

### 8. Create Greek Letters
Create `src/data/symbols/greek.ts`:

```typescript
import type { GreekLetter } from '@/types'

export const greekLetters: GreekLetter[] = [
  { lowercase: 'α', uppercase: 'Α', name: 'Alpha', latex: '\\alpha', uppercaseLaTeX: 'A', commonUses: ['Angles', 'Coefficients', 'Learning rate (ML)'] },
  { lowercase: 'β', uppercase: 'Β', name: 'Beta', latex: '\\beta', uppercaseLaTeX: 'B', commonUses: ['Angles', 'Coefficients', 'Beta distribution'] },
  { lowercase: 'γ', uppercase: 'Γ', name: 'Gamma', latex: '\\gamma', uppercaseLaTeX: '\\Gamma', commonUses: ['Angles', 'Gamma function'] },
  { lowercase: 'δ', uppercase: 'Δ', name: 'Delta', latex: '\\delta', uppercaseLaTeX: '\\Delta', commonUses: ['Small change', 'Kronecker delta'] },
  { lowercase: 'ε', uppercase: 'Ε', name: 'Epsilon', latex: '\\epsilon', uppercaseLaTeX: 'E', commonUses: ['Small quantity', 'Error terms'] },
  { lowercase: 'ζ', uppercase: 'Ζ', name: 'Zeta', latex: '\\zeta', uppercaseLaTeX: 'Z', commonUses: ['Riemann zeta function'] },
  { lowercase: 'η', uppercase: 'Η', name: 'Eta', latex: '\\eta', uppercaseLaTeX: 'H', commonUses: ['Learning rate', 'Efficiency'] },
  { lowercase: 'θ', uppercase: 'Θ', name: 'Theta', latex: '\\theta', uppercaseLaTeX: '\\Theta', commonUses: ['Angles', 'ML parameters', 'Big-O notation'] },
  { lowercase: 'ι', uppercase: 'Ι', name: 'Iota', latex: '\\iota', uppercaseLaTeX: 'I', commonUses: ['Index', 'Inclusion map'] },
  { lowercase: 'κ', uppercase: 'Κ', name: 'Kappa', latex: '\\kappa', uppercaseLaTeX: 'K', commonUses: ['Curvature', 'Condition number'] },
  { lowercase: 'λ', uppercase: 'Λ', name: 'Lambda', latex: '\\lambda', uppercaseLaTeX: '\\Lambda', commonUses: ['Eigenvalues', 'Anonymous functions', 'Wavelength'] },
  { lowercase: 'μ', uppercase: 'Μ', name: 'Mu', latex: '\\mu', uppercaseLaTeX: 'M', commonUses: ['Mean', 'Micro prefix', 'Friction'] },
  { lowercase: 'ν', uppercase: 'Ν', name: 'Nu', latex: '\\nu', uppercaseLaTeX: 'N', commonUses: ['Frequency', 'Degrees of freedom'] },
  { lowercase: 'ξ', uppercase: 'Ξ', name: 'Xi', latex: '\\xi', uppercaseLaTeX: '\\Xi', commonUses: ['Random variable'] },
  { lowercase: 'ο', uppercase: 'Ο', name: 'Omicron', latex: 'o', uppercaseLaTeX: 'O', commonUses: ['Rarely used (looks like o)'] },
  { lowercase: 'π', uppercase: 'Π', name: 'Pi', latex: '\\pi', uppercaseLaTeX: '\\Pi', commonUses: ['3.14159...', 'Product notation'] },
  { lowercase: 'ρ', uppercase: 'Ρ', name: 'Rho', latex: '\\rho', uppercaseLaTeX: 'P', commonUses: ['Density', 'Correlation'] },
  { lowercase: 'σ', uppercase: 'Σ', name: 'Sigma', latex: '\\sigma', uppercaseLaTeX: '\\Sigma', commonUses: ['Standard deviation', 'Summation'] },
  { lowercase: 'τ', uppercase: 'Τ', name: 'Tau', latex: '\\tau', uppercaseLaTeX: 'T', commonUses: ['Time constant', 'Torque', '2π'] },
  { lowercase: 'υ', uppercase: 'Υ', name: 'Upsilon', latex: '\\upsilon', uppercaseLaTeX: '\\Upsilon', commonUses: ['Rarely used'] },
  { lowercase: 'φ', uppercase: 'Φ', name: 'Phi', latex: '\\phi', uppercaseLaTeX: '\\Phi', commonUses: ['Golden ratio', 'Angles', 'Normal distribution'] },
  { lowercase: 'χ', uppercase: 'Χ', name: 'Chi', latex: '\\chi', uppercaseLaTeX: 'X', commonUses: ['Chi-squared distribution'] },
  { lowercase: 'ψ', uppercase: 'Ψ', name: 'Psi', latex: '\\psi', uppercaseLaTeX: '\\Psi', commonUses: ['Wave function', 'Angles'] },
  { lowercase: 'ω', uppercase: 'Ω', name: 'Omega', latex: '\\omega', uppercaseLaTeX: '\\Omega', commonUses: ['Angular velocity', 'Ohms', 'Big-O notation'] },
]
```

### 9. Create ML/Data Science Symbols
Create `src/data/symbols/ml.ts`:

```typescript
import type { MathSymbol } from '@/types'

export const mlSymbols: MathSymbol[] = [
  {
    symbol: 'θ',
    name: 'Theta (parameters)',
    latex: '\\theta',
    meaning: 'Model parameters',
    programmingAnalogy: 'weights array',
    pythonExample: 'theta = np.random.randn(n_features)',
    category: 'ml',
  },
  {
    symbol: 'ŷ',
    name: 'Y-hat (prediction)',
    latex: '\\hat{y}',
    meaning: 'Predicted value',
    programmingAnalogy: 'model.predict(X)',
    pythonExample: 'y_hat = model.predict(X_test)',
    category: 'ml',
  },
  {
    symbol: 'J(θ)',
    name: 'Cost function',
    latex: 'J(\\theta)',
    meaning: 'Loss/cost function',
    programmingAnalogy: 'loss_function(y, y_hat)',
    pythonExample: 'J = np.mean((y - y_hat)**2)  # MSE',
    category: 'ml',
  },
  {
    symbol: '∇J(θ)',
    name: 'Gradient',
    latex: '\\nabla J(\\theta)',
    meaning: 'Gradient of cost function',
    programmingAnalogy: 'compute_gradient()',
    pythonExample: 'gradient = (2/m) * X.T @ (X @ theta - y)',
    category: 'ml',
  },
  {
    symbol: 'α',
    name: 'Learning rate',
    latex: '\\alpha',
    meaning: 'Step size for gradient descent',
    programmingAnalogy: 'learning_rate = 0.01',
    pythonExample: 'theta = theta - alpha * gradient',
    category: 'ml',
  },
  {
    symbol: 'σ(x)',
    name: 'Sigmoid',
    latex: '\\sigma(x)',
    meaning: 'Sigmoid activation function',
    programmingAnalogy: '1 / (1 + np.exp(-x))',
    pythonExample: 'def sigmoid(x): return 1 / (1 + np.exp(-x))',
    category: 'ml',
  },
  {
    symbol: 'softmax',
    name: 'Softmax',
    latex: '\\text{softmax}(x_i)',
    meaning: 'Normalize to probability distribution',
    programmingAnalogy: 'scipy.special.softmax()',
    pythonExample: 'probs = np.exp(x) / np.sum(np.exp(x))',
    category: 'ml',
  },
  {
    symbol: 'L',
    name: 'Loss',
    latex: 'L',
    meaning: 'Loss function value',
    programmingAnalogy: 'loss = criterion(output, target)',
    pythonExample: 'loss = nn.CrossEntropyLoss()(logits, labels)',
    category: 'ml',
  },
  {
    symbol: 'E[X]',
    name: 'Expected value',
    latex: 'E[X]',
    meaning: 'Expected value / mean',
    programmingAnalogy: 'np.mean(X)',
    pythonExample: 'expected = np.mean(samples)',
    category: 'ml',
  },
  {
    symbol: 'Var(X)',
    name: 'Variance',
    latex: '\\text{Var}(X)',
    meaning: 'Variance of random variable',
    programmingAnalogy: 'np.var(X)',
    pythonExample: 'variance = np.var(samples)',
    category: 'ml',
  },
  {
    symbol: 'P(A|B)',
    name: 'Conditional probability',
    latex: 'P(A|B)',
    meaning: 'Probability of A given B',
    programmingAnalogy: '# Bayes: P(A|B) = P(B|A)P(A)/P(B)',
    pythonExample: 'p_a_given_b = (p_b_given_a * p_a) / p_b',
    category: 'ml',
  },
]
```

### 10. Create Barrel Export
Create `src/data/symbols/index.ts`:

```typescript
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
  return allSymbols.filter(s => s.category === category)
}

/**
 * Search symbols by name, meaning, or programming analogy
 */
export function searchSymbols(query: string): MathSymbol[] {
  const q = query.toLowerCase()
  return allSymbols.filter(s => 
    s.name.toLowerCase().includes(q) ||
    s.meaning.toLowerCase().includes(q) ||
    s.programmingAnalogy?.toLowerCase().includes(q) ||
    s.symbol.includes(query)
  )
}
```

## Success Criteria
- [ ] All symbol files created with comprehensive data
- [ ] Types are properly defined and exported
- [ ] Barrel export works (`import { arithmeticSymbols } from '@/data/symbols'`)
- [ ] `searchSymbols` function works
- [ ] `getSymbolsByCategory` function works
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Data Verification
Quick test in a view or browser console:
```typescript
import { allSymbols, searchSymbols } from '@/data/symbols'
console.log('Total symbols:', allSymbols.length)
console.log('Search "sum":', searchSymbols('sum'))
```

## Next Increment
After completion, proceed to `inc_3f.md` for SymbolTable component with search and responsive layout.
