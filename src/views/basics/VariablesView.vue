<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'

const relatedTopics = [
  { title: 'Basics Overview', path: '/basics', description: 'All basics topics' },
  { title: 'Functions', path: '/basics/functions', description: 'Variables as inputs and outputs' },
  { title: 'Order of Operations', path: '/basics/order-of-operations', description: 'How expressions are evaluated' },
  { title: 'Number Types', path: '/basics/number-types', description: 'What values variables can hold' },
]

// Code examples
const basicAssignmentCode = `# In math: "let x = 5"
# In Python: same idea!

x = 5  # x now holds the value 5
y = 3  # y now holds the value 3

# Use the variables
print(x)      # 5
print(x + y)  # 8
print(x * y)  # 15

# Variables can change (that's why they're "variable"!)
x = 10  # x now holds 10
print(x + y)  # 13`

const namingConventionsCode = `# Math conventions: single letters
# x, y, z for unknowns
# a, b, c for constants
# n, m, i, j for integers
# Greek letters: α (alpha), β (beta), θ (theta)

# Python conventions: descriptive names
user_age = 25           # snake_case for variables
total_price = 99.99     # descriptive names
MAX_ATTEMPTS = 3        # SCREAMING_CASE for constants

# Bad Python names (but valid math notation):
# x = 5  # What does x mean?
# n = 100  # Count of what?

# Good Python names:
item_count = 100
temperature_celsius = 25.5`

const expressionsCode = `# An expression is a combination of values and operators
# Math: 2x + 3
# Python: 2 * x + 3

x = 5

# Simple expressions
result1 = x + 10      # 15
result2 = x * 2       # 10
result3 = x ** 2      # 25 (x squared)

# Complex expressions (same as math!)
result4 = 2 * x + 3   # 13
result5 = x ** 2 + 2 * x + 1  # 36 (this is (x+1)²)

# Expressions can include function calls
import math
result6 = math.sqrt(x ** 2 + 12 ** 2)  # 13.0 (Pythagorean!)`

const substitutionCode = `# Substitution: "plugging in" values
# Given: 2x + 3, evaluate when x = 5

# Step-by-step:
# Expression: 2x + 3
# Step 1: Replace x with 5
#         2(5) + 3
# Step 2: Multiply
#         10 + 3
# Step 3: Add
#         13

# In Python, this happens automatically:
x = 5
result = 2 * x + 3  # Python substitutes 5 for x
print(result)  # 13

# You can trace through with print:
print(f"2 * {x} + 3")       # "2 * 5 + 3"
print(f"= {2 * x} + 3")     # "= 10 + 3"
print(f"= {2 * x + 3}")     # "= 13"`

const multipleVariablesCode = `# Multiple variables work together
# Area of a rectangle: A = width × height

width = 10
height = 5
area = width * height
print(f"Area = {area}")  # Area = 50

# Multiple assignment (Python feature)
a, b, c = 1, 2, 3
print(a, b, c)  # 1 2 3

# Swap trick (no temp variable needed!)
x, y = 5, 10
x, y = y, x  # Swap!
print(x, y)  # 10 5

# Geometry: distance formula
# d = √((x₂-x₁)² + (y₂-y₁)²)
import math

x1, y1 = 0, 0
x2, y2 = 3, 4
distance = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
print(f"Distance = {distance}")  # Distance = 5.0`

const dynamicTypingCode = `# Python is dynamically typed
# Variables don't have fixed types

x = 5           # x is an int
print(type(x))  # <class 'int'>

x = 3.14        # Now x is a float
print(type(x))  # <class 'float'>

x = "hello"     # Now x is a string
print(type(x))  # <class 'str'>

# Math doesn't have "types" the same way
# But the number sets (ℕ, ℤ, ℚ, ℝ, ℂ) are similar!

# Check the type
value = 42
if isinstance(value, int):
    print("It's an integer!")

# Convert between types
float_value = float(42)    # 42.0
int_value = int(3.14)      # 3 (truncates)
str_value = str(42)        # "42"`
</script>

<template>
  <TopicPage
    title="Variables & Expressions"
    description="Named values and how to combine them — from math to code."
    :related-topics="relatedTopics"
  >
    <div class="space-y-8">
      <!-- What is a Variable? -->
      <ContentSection id="what-is" title="What is a Variable?" icon="fa-solid fa-box-archive" collapsible>
        <p class="mb-4">
          A <strong>variable</strong> is a named container for a value. In both math and
          programming, we use variables to store and work with data.
        </p>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-primary mb-2">
              <i class="fa-solid fa-square-root-variable mr-2" aria-hidden="true" />
              In Math
            </h4>
            <p class="text-text-secondary mb-2">We write "let x = 5" to mean:</p>
            <MathBlock formula="x = 5" display />
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-primary mb-2">
              <i class="fa-brands fa-python mr-2" aria-hidden="true" />
              In Python
            </h4>
            <p class="text-text-secondary mb-2">We write the assignment:</p>
            <div class="font-mono bg-gray-900 text-green-400 p-2 rounded">x = 5</div>
          </div>
        </div>

        <p class="mb-4">
          The <code>=</code> sign in programming is the <strong>assignment operator</strong> — it
          says "store the value on the right in the variable on the left."
        </p>

        <CodeExample id="basics-variables-assignment" :code="basicAssignmentCode" language="python" title="assignment.py" />

        <!-- Three Analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-box mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Think of variables as labeled boxes. The name is the label, the value is what's inside.
              You can look at the contents anytime and swap in new items.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Variables are like memory addresses with friendly names. Instead of "store 5 at address
              0x7fff", you write <code>x = 5</code>. Expressions are recipes that combine ingredients.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-pen-fancy mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Variables are nouns, expressions are sentences. <code>x = 5</code> defines a noun;
              <code>2*x + 3</code> is a sentence that says "double x, then add 3."
            </p>
          </div>
        </div>

        <!-- Pitfall Callout -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: = Means Assignment, Not Equality
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            In math, <code>x = 5</code> is a statement of fact. In Python, it's an action: "put 5 into x."
            For equality testing, use <code>==</code> (two equals signs). Writing <code>if x = 5:</code>
            is a syntax error—you want <code>if x == 5:</code>.
          </p>
        </div>
      </ContentSection>

      <!-- Variable Naming -->
      <ContentSection
        id="naming"
        title="Variable Naming"
        icon="fa-solid fa-tag"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          Mathematicians and programmers have different naming conventions:
        </p>

        <div class="overflow-x-auto mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b-2 border-border">
                <th class="text-left py-2 px-3">Context</th>
                <th class="text-left py-2 px-3">Typical Names</th>
                <th class="text-left py-2 px-3">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3">Math (unknowns)</td>
                <td class="py-2 px-3 font-mono">x, y, z</td>
                <td class="py-2 px-3"><MathBlock formula="x^2 + y^2 = z^2" /></td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3">Math (constants)</td>
                <td class="py-2 px-3 font-mono">a, b, c</td>
                <td class="py-2 px-3"><MathBlock formula="ax^2 + bx + c = 0" /></td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3">Math (indices)</td>
                <td class="py-2 px-3 font-mono">i, j, k, n, m</td>
                <td class="py-2 px-3"><MathBlock formula="\sum_{i=1}^{n}" /></td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3">Math (Greek)</td>
                <td class="py-2 px-3">α, β, θ, λ</td>
                <td class="py-2 px-3"><MathBlock formula="\sin(\theta)" /></td>
              </tr>
              <tr>
                <td class="py-2 px-3">Python</td>
                <td class="py-2 px-3 font-mono">snake_case</td>
                <td class="py-2 px-3 font-mono">user_age = 25</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeExample id="basics-variables-naming" :code="namingConventionsCode" language="python" title="naming.py" />

        <div class="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p class="font-medium text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-1" aria-hidden="true" />
            Pro Tip
          </p>
          <p class="text-text-secondary text-sm">
            In Python, use descriptive names in production code (<code>temperature_celsius</code>)
            but feel free to use math-style single letters (<code>x</code>, <code>y</code>) when
            implementing mathematical formulas.
          </p>
        </div>
      </ContentSection>

      <!-- Expressions -->
      <ContentSection
        id="expressions"
        title="Expressions"
        icon="fa-solid fa-calculator"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          An <strong>expression</strong> is a combination of variables, values, and operators that
          evaluates to a single value:
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <div class="flex flex-col md:flex-row items-center justify-center gap-4">
            <div class="text-center">
              <div class="text-sm text-text-muted mb-1">Math</div>
              <MathBlock formula="2x + 3" />
            </div>
            <div class="text-2xl text-text-muted">=</div>
            <div class="text-center">
              <div class="text-sm text-text-muted mb-1">Python</div>
              <code class="font-mono text-primary">2 * x + 3</code>
            </div>
          </div>
        </div>

        <CodeExample id="basics-variables-expressions" :code="expressionsCode" language="python" title="expressions.py" />

        <p class="mt-4 text-text-secondary">
          Notice that Python requires explicit multiplication (<code>*</code>). In math we write
          <MathBlock formula="2x" />, but Python needs <code>2 * x</code>.
        </p>
      </ContentSection>

      <!-- Substitution -->
      <ContentSection
        id="substitution"
        title="Substitution"
        icon="fa-solid fa-arrow-right-arrow-left"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          <strong>Substitution</strong> means replacing a variable with a specific value. This is
          exactly what Python does when it evaluates an expression:
        </p>

        <div class="p-4 bg-math-highlight rounded-lg mb-4">
          <p class="text-sm font-medium mb-2">Given: <MathBlock formula="2x + 3" /> when <MathBlock formula="x = 5" /></p>
          <div class="space-y-1 text-text-secondary">
            <p>Step 1: Replace x → <MathBlock formula="2(5) + 3" /></p>
            <p>Step 2: Multiply → <MathBlock formula="10 + 3" /></p>
            <p>Step 3: Add → <MathBlock formula="13" /></p>
          </div>
        </div>

        <CodeExample id="basics-variables-substitution" :code="substitutionCode" language="python" title="substitution.py" />

        <p class="mt-4 text-text-muted">
          Python performs substitution automatically. When you write <code>2 * x + 3</code> and x
          is 5, Python evaluates it step by step, just like you would on paper.
        </p>
      </ContentSection>

      <!-- Multiple Variables -->
      <ContentSection
        id="multiple"
        title="Multiple Variables"
        icon="fa-solid fa-cubes"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          Real problems often involve multiple variables working together:
        </p>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium mb-2">Area of Rectangle</h4>
            <MathBlock formula="A = w \times h" display />
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium mb-2">Distance Formula</h4>
            <MathBlock formula="d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}" display />
          </div>
        </div>

        <CodeExample id="basics-variables-multiple" :code="multipleVariablesCode" language="python" title="multiple_vars.py" />
      </ContentSection>

      <!-- Python's Dynamic Types -->
      <ContentSection
        id="types"
        title="Python's Dynamic Types"
        icon="fa-brands fa-python"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          Unlike statically typed languages, Python lets variables hold different types of values:
        </p>

        <CodeExample id="basics-variables-dynamictypes" :code="dynamicTypingCode" language="python" title="dynamic_types.py" />

        <div class="mt-4 p-4 rounded-lg border border-border">
          <h4 class="font-medium text-text-primary mb-2">Math Sets → Python Types</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div class="text-center p-2 bg-surface rounded">
              <MathBlock formula="\mathbb{Z}" />
              <div class="text-text-muted">→ <code>int</code></div>
            </div>
            <div class="text-center p-2 bg-surface rounded">
              <MathBlock formula="\mathbb{R}" />
              <div class="text-text-muted">→ <code>float</code></div>
            </div>
            <div class="text-center p-2 bg-surface rounded">
              <MathBlock formula="\mathbb{C}" />
              <div class="text-text-muted">→ <code>complex</code></div>
            </div>
            <div class="text-center p-2 bg-surface rounded">
              <MathBlock formula="\mathbb{B}" />
              <div class="text-text-muted">→ <code>bool</code></div>
            </div>
          </div>
        </div>
      </ContentSection>

      <!-- Key Takeaways -->
      <ContentSection id="summary" title="Key Takeaways" icon="fa-solid fa-list-check" collapsible :default-expanded="false">
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <i class="fa-solid fa-check text-primary mt-1" aria-hidden="true" />
            <span>
              <strong>Variables</strong> store values with names — same concept in math and code
            </span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fa-solid fa-check text-primary mt-1" aria-hidden="true" />
            <span>
              <strong>=</strong> means "assign" in Python, while math uses it for equality
            </span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fa-solid fa-check text-primary mt-1" aria-hidden="true" />
            <span>
              <strong>Expressions</strong> combine variables with operators to produce values
            </span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fa-solid fa-check text-primary mt-1" aria-hidden="true" />
            <span>
              <strong>Substitution</strong> happens automatically when Python evaluates expressions
            </span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fa-solid fa-check text-primary mt-1" aria-hidden="true" />
            <span>
              Python variables are <strong>dynamically typed</strong> — they can hold any value
            </span>
          </li>
        </ul>
      </ContentSection>
    </div>

  </TopicPage>
</template>
