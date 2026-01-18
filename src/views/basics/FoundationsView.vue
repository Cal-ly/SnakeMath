<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import ContentSection from '@/components/content/ContentSection.vue'

const relatedTopics = [
  { title: 'Basics Overview', path: '/basics', description: 'All basics topics' },
  { title: 'Math Symbols', path: '/basics/symbols', description: 'Translate notation to operations' },
  { title: 'Order of Operations', path: '/basics/order-of-operations', description: 'How to combine the four operators' },
  { title: 'Summation', path: '/algebra/summation', description: 'Σ is just repeated addition' },
]

const basicOperatorsCode = `# The four basic operators in Python
a = 10
b = 3

addition = a + b        # 13
subtraction = a - b     # 7
multiplication = a * b  # 30
division = a / b        # 3.333...

# Integer division and modulo
integer_div = a // b    # 3
remainder = a % b       # 1`

const summationCode = `# Summation: E is just a for loop!
def summation(n):
    """Sum from 1 to n: E(i=1 to n) i"""
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

# Or using Python's built-in
result = sum(range(1, n + 1))

# Formula: n(n+1)/2
def summation_formula(n):
    return n * (n + 1) // 2

print(summation(100))         # 5050
print(summation_formula(100)) # 5050`

const eulerMethodCode = `# Euler's method - solving differential equations
# with just addition and multiplication!

def euler_method(f, x0, y0, h, steps):
    """
    Solve dy/dx = f(x, y) numerically

    f: derivative function
    x0, y0: initial conditions
    h: step size
    steps: number of iterations
    """
    x, y = x0, y0
    points = [(x, y)]

    for _ in range(steps):
        y = y + h * f(x, y)  # Just addition and multiplication!
        x = x + h
        points.append((x, y))

    return points

# Example: dy/dx = 2x (solution: y = x^2)
solution = euler_method(
    f=lambda x, y: 2*x,
    x0=0, y0=0,
    h=0.1, steps=10
)
# Result approximates y = x^2`

const productCode = `# Product notation: P is multiplication in a loop
import math

def product(n):
    """Product from 1 to n: P(i=1 to n) i = n!"""
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

# Or using Python's math library
factorial = math.factorial(5)  # 120

# Using math.prod (Python 3.8+)
result = math.prod(range(1, 6))  # 120`
</script>

<template>
  <TopicPage
    title="Foundations"
    description="Everything in math breaks down to four operators and a set of rules."
  >
    <div class="space-y-8">
      <!-- Intro -->
      <ContentSection id="intro" title="The Core Insight" icon="fa-solid fa-lightbulb">
        <p class="mb-4">
          In a simple sense, nearly all math can be broken down to four operators:
          <strong>addition</strong>, <strong>subtraction</strong>,
          <strong>multiplication</strong>, and <strong>division</strong>.
          And a set of rules on how to apply these in different manners.
        </p>

        <p class="mb-4">
          Even the most intimidating mathematical notation - differential equations,
          integrals, matrix operations - ultimately reduces to combinations of these
          basic operations. The symbols are just shorthand.
        </p>

        <CodeExample
          id="basics-foundations-operators"
          :code="basicOperatorsCode"
          language="python"
          title="basic_operators.py"
        />

        <!-- Three Analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-hammer mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              A master chef uses just salt, acid, fat, and heat. A mathematician uses just +, -, ×, and ÷.
              Everything else is a recipe combining these basic ingredients.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Every program compiles to simple CPU instructions. Every math formula compiles to
              add/subtract/multiply/divide. Fancy notation is just syntactic sugar.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-building mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              A skyscraper looks complex, but it's built from simple bricks, steel, and concrete.
              Math symbols look complex, but they're built from the same four operations.
            </p>
          </div>
        </div>

        <!-- Pitfall Callout -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Division by Zero
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            Division is powerful but dangerous—you can't divide by zero. Python raises <code>ZeroDivisionError</code>,
            math says "undefined." Always guard divisions: <code>if b != 0: result = a / b</code>.
          </p>
        </div>
      </ContentSection>

      <!-- Summation -->
      <ContentSection
        id="summation"
        title="Summation: Σ = for loop"
        icon="fa-solid fa-plus"
        collapsible
      >
        <p class="mb-4">
          That big and scary-looking <MathBlock formula="\Sigma" /> is basically just
          a for loop adding all the variables together:
        </p>

        <MathBlock
          formula="\sum_{i=1}^{n} i = 1 + 2 + 3 + \cdots + n = \frac{n(n+1)}{2}"
          display
        />

        <p class="mb-4">
          The notation <MathBlock formula="\sum_{i=1}^{n}" /> means: "for i from 1 to n,
          add up all the values."
        </p>

        <CodeExample
          id="basics-foundations-summation"
          :code="summationCode"
          language="python"
          title="summation.py"
          line-numbers
          collapsible
        />
      </ContentSection>

      <!-- Product -->
      <ContentSection
        id="product"
        title="Product: Π = multiply loop"
        icon="fa-solid fa-xmark"
        collapsible
      >
        <p class="mb-4">
          Similarly, <MathBlock formula="\Pi" /> (capital pi) means "multiply them all together":
        </p>

        <MathBlock
          formula="\prod_{i=1}^{n} i = 1 \times 2 \times 3 \times \cdots \times n = n!"
          display
        />

        <p class="mb-4">
          This is exactly factorial! The product of all integers from 1 to n.
        </p>

        <CodeExample
          id="basics-foundations-product"
          :code="productCode"
          language="python"
          title="product.py"
          collapsible
        />
      </ContentSection>

      <!-- Differential Equations -->
      <ContentSection
        id="differential"
        title="Differential Equations - Broken Down"
        icon="fa-solid fa-chart-line"
        collapsible
      >
        <p class="mb-4">
          <em>"But what about differential equations?"</em> - Great question! Let's see how
          even these scary-looking equations reduce to simple arithmetic.
        </p>

        <p class="mb-4">A simple differential equation:</p>
        <MathBlock formula="\frac{dy}{dx} = 2x" display />

        <p class="mb-4">
          This says: "the rate of change of <MathBlock formula="y" /> with respect to
          <MathBlock formula="x" /> equals <MathBlock formula="2x" />."
        </p>

        <p class="mb-4">
          We can solve this step-by-step using <strong>Euler's method</strong>. The key
          insight is that <MathBlock formula="\frac{dy}{dx}" /> is just a ratio of tiny
          changes. If we take small steps:
        </p>

        <MathBlock formula="y_{new} = y_{old} + h \cdot f(x, y)" display />

        <p class="mb-4">
          Where <MathBlock formula="h" /> is a small step size. Just multiplication and
          addition!
        </p>

        <CodeExample
          id="basics-foundations-euler"
          :code="eulerMethodCode"
          language="python"
          title="euler_method.py"
          line-numbers
          collapsible
        />

        <div class="mt-6 p-4 bg-math-highlight rounded-lg">
          <p class="font-medium text-text-primary mb-2">
            <i class="fa-solid fa-key mr-2 text-primary" aria-hidden="true" />
            Key Takeaway
          </p>
          <p class="text-text-secondary">
            Even differential equations - at their core - can be solved step-by-step using
            just addition, subtraction, multiplication, and division. The "calculus" is
            really just a clever way of organizing these basic operations.
          </p>
        </div>
      </ContentSection>

      <!-- MATLAB joke -->
      <!-- <ContentSection
        id="matlab"
        title="Why not just use MATLAB?"
        icon="fa-solid fa-face-grin-wink"
        collapsible
        :default-expanded="false"
      >
        <p class="text-text-muted italic">
          MATLAB is an illegitimate programming language and it knows it!
        </p>
        <p class="mt-2 text-sm text-text-muted">
          (Just kidding. Use whatever tools work for you. But Python is pretty great.)
        </p>
      </ContentSection> -->
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
