<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import NumberTypeExplorer from '@/components/widgets/NumberTypeExplorer.vue'

const relatedTopics = [
  { title: 'Foundations', path: '/basics/foundations', description: 'Core concepts' },
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Notation guide' },
]

// Code examples
const naturalNumbersCode = `# Natural numbers in Python
# ℕ = {1, 2, 3, 4, ...}

def is_natural(n):
    """Check if a number is natural (positive integer)"""
    return isinstance(n, int) and n > 0

# Examples
print(is_natural(42))    # True
print(is_natural(0))     # False (zero isn't natural)
print(is_natural(-5))    # False
print(is_natural(3.14))  # False`

const integersCode = `# Integers in Python
# ℤ = {..., -2, -1, 0, 1, 2, ...}

def is_integer(n):
    """Check if a number is an integer"""
    if isinstance(n, int):
        return True
    if isinstance(n, float):
        return n.is_integer()
    return False

# Python's int handles arbitrarily large integers!
googol = 10 ** 100
print(type(googol))  # <class 'int'>`

const rationalsCode = `# Rational numbers in Python
# ℚ = {p/q : p, q ∈ ℤ, q ≠ 0}

from fractions import Fraction

# Creating fractions
half = Fraction(1, 2)
third = Fraction(1, 3)

# Arithmetic stays exact (no floating-point errors!)
result = half + third
print(result)  # 5/6

# Why not just use floats?
print(0.1 + 0.2)  # 0.30000000000000004 (!)
print(Fraction(1, 10) + Fraction(2, 10))  # 3/10 (exact)`

const realsCode = `import math

# Irrational numbers (approximated as floats)
pi = math.pi          # 3.141592653589793
e = math.e            # 2.718281828459045
sqrt2 = math.sqrt(2)  # 1.4142135623730951

# Note: These are approximations!
# The actual values have infinite, non-repeating decimals

# Checking if a float is "close enough" to an integer
def is_approximately_integer(x, tolerance=1e-9):
    return abs(x - round(x)) < tolerance

print(is_approximately_integer(2.0000000001))  # True
print(is_approximately_integer(2.5))           # False`

const complexCode = `# Complex numbers in Python
# ℂ = {a + bi : a, b ∈ ℝ}

# Creating complex numbers
z1 = 3 + 4j        # Using j suffix (Python convention)
z2 = complex(3, 4)  # Using complex() constructor

# Real and imaginary parts
print(z1.real)  # 3.0
print(z1.imag)  # 4.0

# Magnitude (absolute value)
print(abs(z1))  # 5.0 (because 3² + 4² = 25, √25 = 5)

# The imaginary unit
i = 1j
print(i * i)  # (-1+0j) - that's the definition of i!`

const typeHierarchyCode = `# Python type hierarchy mirrors math!
from numbers import Number, Complex, Real, Rational, Integral

# Check the hierarchy
print(isinstance(42, Integral))   # True
print(isinstance(42, Rational))   # True
print(isinstance(42, Real))       # True
print(isinstance(42, Complex))    # True

print(isinstance(3.14, Integral)) # False
print(isinstance(3.14, Real))     # True

print(isinstance(1+2j, Real))     # False
print(isinstance(1+2j, Complex))  # True`
</script>

<template>
  <TopicPage
    title="Number Types"
    description="Understanding ℕ, ℤ, ℚ, ℝ, and ℂ — and how they map to code."
  >
    <div class="space-y-8">
      <!-- Overview -->
      <ContentSection id="overview" title="The Number Hierarchy" icon="fa-solid fa-layer-group">
        <p class="mb-4">
          Mathematicians have organized numbers into a beautiful nested hierarchy. Each set contains
          all the numbers from the previous set, plus new ones:
        </p>

        <MathBlock
          formula="\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}"
          display
        />

        <p class="mt-4">
          This isn't just mathematical abstraction — it maps directly to how programming languages
          handle numbers! Understanding these sets helps you choose the right data types and avoid
          bugs.
        </p>
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Explorer" icon="fa-solid fa-flask">
        <p class="mb-4">
          Enter any number to see which sets it belongs to. The URL updates so you can share
          interesting numbers with others!
        </p>

        <NumberTypeExplorer initial-value="42" sync-url url-key="n" />
      </ContentSection>

      <!-- Natural Numbers -->
      <ContentSection
        id="natural"
        title="ℕ Natural Numbers"
        icon="fa-solid fa-seedling"
        collapsible
      >
        <p class="mb-4">
          The <strong>natural numbers</strong> are the counting numbers we learn as children:
        </p>

        <MathBlock formula="\mathbb{N} = \{1, 2, 3, 4, 5, ...\}" display />

        <p class="mt-4 mb-4 p-3 bg-math-highlight rounded-lg">
          <strong>Note:</strong> Some mathematicians include 0 in ℕ, others don't. In programming
          contexts, we often use the "positive integers" definition.
        </p>

        <CodeExample :code="naturalNumbersCode" language="python" title="natural_numbers.py" />

        <p class="mt-4 text-text-secondary">
          Natural numbers are used for counting, indexing, and anywhere you need "how many" without
          negative values.
        </p>
      </ContentSection>

      <!-- Integers -->
      <ContentSection
        id="integers"
        title="ℤ Integers"
        icon="fa-solid fa-arrows-left-right"
        collapsible
      >
        <p class="mb-4">
          <strong>Integers</strong> extend natural numbers with zero and negatives:
        </p>

        <MathBlock formula="\mathbb{Z} = \{..., -3, -2, -1, 0, 1, 2, 3, ...\}" display />

        <p class="mt-4 mb-4">
          The symbol <MathBlock formula="\mathbb{Z}" /> comes from the German word "Zahlen"
          (numbers). Integers allow us to represent debts, temperatures below zero, and relative
          positions.
        </p>

        <CodeExample :code="integersCode" language="python" title="integers.py" />
      </ContentSection>

      <!-- Rational Numbers -->
      <ContentSection id="rational" title="ℚ Rational Numbers" icon="fa-solid fa-divide" collapsible>
        <p class="mb-4">
          <strong>Rational numbers</strong> are any number that can be expressed as a fraction of
          two integers:
        </p>

        <MathBlock
          formula="\mathbb{Q} = \left\{ \frac{p}{q} : p, q \in \mathbb{Z}, q \neq 0 \right\}"
          display
        />

        <p class="mt-4 mb-4">
          The symbol <MathBlock formula="\mathbb{Q}" /> comes from "quotient." Every integer is
          rational (just put it over 1), but now we also have fractions like
          <MathBlock formula="\frac{1}{2}" /> and <MathBlock formula="\frac{3}{4}" />.
        </p>

        <CodeExample :code="rationalsCode" language="python" title="rational_numbers.py" />

        <p class="mt-4 p-3 bg-math-highlight rounded-lg">
          <strong>Pro tip:</strong> Use Python's <code>Fraction</code> class when you need exact
          arithmetic and can't afford floating-point errors!
        </p>
      </ContentSection>

      <!-- Real Numbers -->
      <ContentSection id="real" title="ℝ Real Numbers" icon="fa-solid fa-infinity" collapsible>
        <p class="mb-4">
          <strong>Real numbers</strong> include all rationals plus the
          <em>irrationals</em> — numbers that cannot be expressed as fractions:
        </p>

        <MathBlock formula="\mathbb{R} = \mathbb{Q} \cup \{\text{irrationals}\}" display />

        <p class="mt-4 mb-4">Famous irrational numbers include:</p>

        <ul class="list-disc list-inside space-y-2 mb-4 text-text-secondary">
          <li>
            <MathBlock formula="\pi \approx 3.14159..." /> — ratio of circumference to diameter
          </li>
          <li><MathBlock formula="e \approx 2.71828..." /> — base of natural logarithm</li>
          <li><MathBlock formula="\sqrt{2} \approx 1.41421..." /> — diagonal of a unit square</li>
        </ul>

        <CodeExample :code="realsCode" language="python" title="real_numbers.py" />

        <p class="mt-4 text-text-muted">
          Real numbers fill the entire number line with no gaps — a profound concept that took
          mathematicians centuries to formalize!
        </p>
      </ContentSection>

      <!-- Complex Numbers -->
      <ContentSection id="complex" title="ℂ Complex Numbers" icon="fa-solid fa-atom" collapsible>
        <p class="mb-4">
          <strong>Complex numbers</strong> extend the reals by introducing the
          <em>imaginary unit</em> <MathBlock formula="i" />, defined as:
        </p>

        <MathBlock formula="i^2 = -1 \quad \text{or} \quad i = \sqrt{-1}" display />

        <p class="mt-4 mb-4">Every complex number has a real part and an imaginary part:</p>

        <MathBlock formula="\mathbb{C} = \{a + bi : a, b \in \mathbb{R}\}" display />

        <CodeExample :code="complexCode" language="python" title="complex_numbers.py" />

        <p class="mt-4 text-text-secondary">
          Complex numbers are essential in signal processing, quantum mechanics, electrical
          engineering, and anywhere oscillations or rotations appear.
        </p>
      </ContentSection>

      <!-- Python Type Hierarchy -->
      <ContentSection
        id="python-types"
        title="Python Type Hierarchy"
        icon="fa-brands fa-python"
        collapsible
      >
        <p class="mb-4">
          Python's <code>numbers</code> module mirrors the mathematical hierarchy:
        </p>

        <CodeExample :code="typeHierarchyCode" language="python" title="type_hierarchy.py" />

        <p class="mt-4 text-text-secondary">
          This hierarchy is useful for writing generic functions that work with any numeric type.
          Check the abstract base classes when you need to verify what operations a number supports!
        </p>
      </ContentSection>

      <!-- Quick Reference -->
      <ContentSection id="summary" title="Quick Reference" icon="fa-solid fa-list-check">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b-2 border-border">
                <th class="text-left py-2 px-3">Set</th>
                <th class="text-left py-2 px-3">Contains</th>
                <th class="text-left py-2 px-3">Python Type</th>
                <th class="text-left py-2 px-3">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3"><MathBlock formula="\mathbb{N}" /></td>
                <td class="py-2 px-3">1, 2, 3, ...</td>
                <td class="py-2 px-3 font-mono text-primary">int (> 0)</td>
                <td class="py-2 px-3 font-mono">42</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3"><MathBlock formula="\mathbb{Z}" /></td>
                <td class="py-2 px-3">..., -1, 0, 1, ...</td>
                <td class="py-2 px-3 font-mono text-primary">int</td>
                <td class="py-2 px-3 font-mono">-7</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3"><MathBlock formula="\mathbb{Q}" /></td>
                <td class="py-2 px-3">p/q fractions</td>
                <td class="py-2 px-3 font-mono text-primary">Fraction</td>
                <td class="py-2 px-3 font-mono">Fraction(1, 2)</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3"><MathBlock formula="\mathbb{R}" /></td>
                <td class="py-2 px-3">Number line</td>
                <td class="py-2 px-3 font-mono text-primary">float</td>
                <td class="py-2 px-3 font-mono">3.14159</td>
              </tr>
              <tr>
                <td class="py-2 px-3"><MathBlock formula="\mathbb{C}" /></td>
                <td class="py-2 px-3">a + bi</td>
                <td class="py-2 px-3 font-mono text-primary">complex</td>
                <td class="py-2 px-3 font-mono">3+4j</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentSection>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
