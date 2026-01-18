<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import SimpleFunctionDemo from '@/components/widgets/SimpleFunctionDemo.vue'

const relatedTopics = [
  { title: 'Basics Overview', path: '/basics', description: 'All foundational topics' },
  { title: 'Variables', path: '/basics/variables', description: 'The values functions work with' },
  { title: 'Matrices', path: '/linear-algebra/matrices', description: 'Matrices as linear functions' },
  { title: 'Limits', path: '/calculus/limits', description: 'What happens as inputs approach a value' },
]

// Code examples
const basicFunctionCode = `# A function is like a machine:
# Input → Process → Output

def double(x):
    """Takes a number, returns twice that number"""
    return x * 2

# Using the function
result = double(5)  # Input 5, get 10
print(result)       # 10

# The same input always gives the same output
print(double(7))    # 14
print(double(7))    # 14 (always!)`

const notationCode = `# Math notation vs Python

# Math: f(x) = 2x + 3
# Python:
def f(x):
    return 2 * x + 3

# Math: g(x) = x²
# Python:
def g(x):
    return x ** 2

# Math: h(x) = |x| (absolute value)
# Python:
def h(x):
    return abs(x)

# Calling the function is the same in both:
# Math:   f(5) = 13
# Python: f(5)  # returns 13`

const multipleArgsCode = `# Functions can take multiple inputs
# Math: f(x, y) = x + y

def add(x, y):
    return x + y

print(add(3, 4))  # 7

# Area of a rectangle
# Math: A(w, h) = w × h
def area(width, height):
    return width * height

print(area(5, 3))  # 15

# Distance between two points
import math

# Math: d(x₁, y₁, x₂, y₂) = √((x₂-x₁)² + (y₂-y₁)²)
def distance(x1, y1, x2, y2):
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

print(distance(0, 0, 3, 4))  # 5.0`

const lambdaCode = `# Lambda: one-line functions
# Math: f(x) = x²
# Python:
f = lambda x: x ** 2

print(f(5))  # 25

# Useful with map, filter, etc.
numbers = [1, 2, 3, 4, 5]

# Square each number
squared = list(map(lambda x: x ** 2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# Keep only even numbers
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]`

const compositionCode = `# Function composition: f(g(x))
# "Apply g first, then apply f to the result"

def double(x):
    return x * 2

def add_one(x):
    return x + 1

# Compose them: double(add_one(x))
x = 5
result = double(add_one(x))  # add_one(5)=6, double(6)=12
print(result)  # 12

# Order matters!
result2 = add_one(double(x))  # double(5)=10, add_one(10)=11
print(result2)  # 11

# Math notation: (f ∘ g)(x) = f(g(x))
# Read as "f composed with g of x"`

const pureVsImpureCode = `# Pure functions: same input → same output (no side effects)
def pure_square(x):
    return x ** 2  # Only uses input, only returns output

# Impure: depends on or modifies external state
counter = 0

def impure_increment(x):
    global counter
    counter += 1  # Side effect: modifies external state
    return x + counter  # Result depends on counter

print(impure_increment(5))  # 6 (counter is now 1)
print(impure_increment(5))  # 7 (counter is now 2)
# Same input, different output!

# Pure functions are easier to test and debug
# They're a core concept in functional programming`
</script>

<template>
  <TopicPage
    title="Functions"
    description="Input, output, and the f(x) notation — from math to code."
  >
    <div class="space-y-8">
      <!-- What is a Function? -->
      <ContentSection id="what-is" title="What is a Function?" icon="fa-solid fa-box">
        <p class="mb-4">
          A <strong>function</strong> is like a machine: you put something in, it does some
          processing, and you get something out. The same input always produces the same output.
        </p>

        <div class="flex flex-col md:flex-row items-center justify-center gap-4 p-6 rounded-lg border border-border mb-4">
          <div class="text-center">
            <div class="text-3xl mb-2">📥</div>
            <div class="font-mono text-primary">Input (x)</div>
          </div>
          <div class="text-2xl text-text-muted">→</div>
          <div class="text-center px-6 py-4 bg-primary/10 rounded-lg border-2 border-primary/30">
            <div class="text-lg font-bold text-primary">f(x)</div>
            <div class="text-sm text-text-muted">Process</div>
          </div>
          <div class="text-2xl text-text-muted">→</div>
          <div class="text-center">
            <div class="text-3xl mb-2">📤</div>
            <div class="font-mono text-primary">Output (y)</div>
          </div>
        </div>

        <p class="mb-4">
          In mathematical notation, we write <MathBlock formula="f(x)" /> to mean "the function f
          applied to x". For example:
        </p>

        <MathBlock formula="f(x) = 2x + 3" display />

        <p class="mt-4">
          This means: "take x, multiply by 2, then add 3." If we input 5, we get
          <MathBlock formula="f(5) = 2(5) + 3 = 13" />.
        </p>

        <CodeExample id="basics-functions-basic" :code="basicFunctionCode" language="python" title="basic_function.py" />

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-cookie-bite mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              A vending machine: put in money (input), press a button (function), get a snack
              (output). Same button always gives the same snack.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              A <code>def</code> block with a <code>return</code>. Parameters go in, a value
              comes out. The body is the "how"—callers only see the "what."
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-diagram-project mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              A box with an arrow in and an arrow out. What happens inside the box is the rule;
              the arrows are input and output. f(x) = y.
            </p>
          </div>
        </div>

        <div
          class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Mutable Default Arguments
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            Never use <code>def f(items=[])</code>—the list is shared across calls! Use
            <code>def f(items=None)</code> and set <code>items = items or []</code> inside.
            This Python gotcha breaks the "same input, same output" rule.
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Demo -->
      <ContentSection id="try-it" title="Try It: Interactive Demo" icon="fa-solid fa-flask">
        <p class="mb-4">
          Experiment with different functions and see how changing the input affects the output.
          Watch the step-by-step calculation as x changes!
        </p>

        <SimpleFunctionDemo />

        <p class="mt-4 text-text-muted text-sm">
          <i class="fa-solid fa-lightbulb mr-1" aria-hidden="true" />
          Try the reciprocal function with x = 0 to see what happens when a function is undefined!
        </p>
      </ContentSection>

      <!-- Function Notation -->
      <ContentSection
        id="notation"
        title="Function Notation"
        icon="fa-solid fa-pen-fancy"
        collapsible
      >
        <p class="mb-4">
          The notation <MathBlock formula="f(x)" /> is read as "f of x". The letter
          <MathBlock formula="f" /> is the function's name, and <MathBlock formula="x" /> is the
          variable (the input).
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <p class="font-medium mb-2">Common notations you'll see:</p>
          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-center gap-3">
              <MathBlock formula="f(x) = x^2" />
              <span class="text-text-muted">— explicit function definition</span>
            </li>
            <li class="flex items-center gap-3">
              <MathBlock formula="y = x^2" />
              <span class="text-text-muted">— equivalent, using y for output</span>
            </li>
            <li class="flex items-center gap-3">
              <MathBlock formula="f: x \mapsto x^2" />
              <span class="text-text-muted">— "maps x to x squared"</span>
            </li>
          </ul>
        </div>

        <CodeExample id="basics-functions-notation" :code="notationCode" language="python" title="notation.py" />

        <p class="mt-4 p-3 bg-math-highlight rounded-lg">
          <strong>Key insight:</strong> In both math and Python, you call a function by writing its
          name followed by the argument(s) in parentheses: <code>f(5)</code>
        </p>
      </ContentSection>

      <!-- Multiple Arguments -->
      <ContentSection
        id="multiple-args"
        title="Functions with Multiple Inputs"
        icon="fa-solid fa-code-merge"
        collapsible
      >
        <p class="mb-4">
          Functions can take more than one input. In math, we write <MathBlock formula="f(x, y)" />
          for a function of two variables:
        </p>

        <MathBlock formula="f(x, y) = x + y" display />

        <p class="mt-4 mb-4">
          This is directly analogous to Python functions with multiple parameters:
        </p>

        <CodeExample id="basics-functions-multipleargs" :code="multipleArgsCode" language="python" title="multiple_args.py" />

        <p class="mt-4 text-text-secondary">
          Real-world functions often have many inputs — think of calculating loan payments
          (principal, rate, time) or 3D graphics (x, y, z coordinates).
        </p>
      </ContentSection>

      <!-- Lambda Functions -->
      <ContentSection
        id="lambda"
        title="Lambda Functions"
        icon="fa-solid fa-bolt"
        collapsible
      >
        <p class="mb-4">
          Python's <code>lambda</code> keyword creates small, anonymous functions in a single line.
          They're perfect for simple operations:
        </p>

        <MathBlock formula="f(x) = x^2 \quad \Leftrightarrow \quad \texttt{f = lambda x: x ** 2}" display />

        <CodeExample id="basics-functions-lambda" :code="lambdaCode" language="python" title="lambda_functions.py" />

        <p class="mt-4 text-text-muted">
          Lambdas are most useful when you need a quick function for things like sorting,
          filtering, or mapping — cases where defining a full function feels like overkill.
        </p>
      </ContentSection>

      <!-- Function Composition -->
      <ContentSection
        id="composition"
        title="Function Composition"
        icon="fa-solid fa-layer-group"
        collapsible
      >
        <p class="mb-4">
          <strong>Composition</strong> means applying one function's output as another function's
          input. In math notation:
        </p>

        <MathBlock formula="(f \circ g)(x) = f(g(x))" display />

        <p class="mt-4 mb-4">
          Read this as "f composed with g of x" — we apply g first, then f. This is exactly like
          nested function calls in programming:
        </p>

        <CodeExample id="basics-functions-composition" :code="compositionCode" language="python" title="composition.py" />

        <div class="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p class="font-medium text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-1" aria-hidden="true" />
            Order Matters!
          </p>
          <p class="text-text-secondary text-sm">
            <MathBlock formula="f(g(x))" /> is not the same as <MathBlock formula="g(f(x))" />.
            Just like in code: <code>double(add_one(x))</code> gives a different result than
            <code>add_one(double(x))</code>.
          </p>
        </div>
      </ContentSection>

      <!-- Pure vs Impure -->
      <ContentSection
        id="pure-functions"
        title="Pure vs Impure Functions"
        icon="fa-solid fa-flask-vial"
        collapsible
      >
        <p class="mb-4">
          In mathematics, functions are always <strong>pure</strong>: the same input always gives
          the same output, with no side effects. Python functions can be pure or impure.
        </p>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 class="font-medium text-green-700 dark:text-green-400 mb-2">
              <i class="fa-solid fa-check mr-1" aria-hidden="true" />
              Pure Functions
            </h4>
            <ul class="text-sm text-green-600 dark:text-green-300 space-y-1">
              <li>Same input → same output</li>
              <li>No side effects</li>
              <li>Easy to test and debug</li>
              <li>Can be memoized (cached)</li>
            </ul>
          </div>
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 class="font-medium text-yellow-700 dark:text-yellow-400 mb-2">
              <i class="fa-solid fa-exclamation-triangle mr-1" aria-hidden="true" />
              Impure Functions
            </h4>
            <ul class="text-sm text-yellow-600 dark:text-yellow-300 space-y-1">
              <li>May give different outputs</li>
              <li>May modify external state</li>
              <li>Harder to test</li>
              <li>Sometimes necessary (I/O, etc.)</li>
            </ul>
          </div>
        </div>

        <CodeExample id="basics-functions-purity" :code="pureVsImpureCode" language="python" title="pure_vs_impure.py" />
      </ContentSection>

      <!-- Why Functions Matter -->
      <ContentSection id="why-matter" title="Why Functions Matter" icon="fa-solid fa-star">
        <div class="grid md:grid-cols-3 gap-4">
          <div class="p-4 rounded-lg border border-border text-center">
            <div class="text-3xl mb-3">♻️</div>
            <h4 class="font-medium text-text-primary mb-2">Reusability</h4>
            <p class="text-sm text-text-secondary">
              Write once, use anywhere. No copy-paste needed.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border text-center">
            <div class="text-3xl mb-3">📦</div>
            <h4 class="font-medium text-text-primary mb-2">Abstraction</h4>
            <p class="text-sm text-text-secondary">
              Hide complexity behind a simple interface.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border text-center">
            <div class="text-3xl mb-3">🧪</div>
            <h4 class="font-medium text-text-primary mb-2">Testability</h4>
            <p class="text-sm text-text-secondary">
              Small, focused functions are easier to test.
            </p>
          </div>
        </div>

        <p class="mt-6 text-text-secondary">
          Functions are the building blocks of both mathematics and programming. Master them, and
          you'll find that complex problems become manageable — just compose simple functions
          together!
        </p>
      </ContentSection>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
