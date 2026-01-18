<script setup lang="ts">
import { ref, computed } from 'vue'
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'

const relatedTopics = [
  { title: 'Algebra Overview', path: '/algebra', description: 'All algebra topics' },
  { title: 'Matrices', path: '/linear-algebra/matrices', description: 'Systems become Ax = b' },
  { title: 'Quadratics', path: '/algebra/quadratics', description: 'When lines become curves' },
  { title: 'Variables', path: '/basics/variables', description: 'The building blocks of equations' },
]

// Interactive linear equation solver
const a = ref(2)
const b = ref(-4)
const c = ref(6)

const solution = computed(() => {
  if (a.value === 0) return null
  return (c.value - b.value) / a.value
})

// System of equations interactive
const sys = ref({
  a1: 2,
  b1: 1,
  c1: 5,
  a2: 1,
  b2: -1,
  c2: 1,
})

const systemSolution = computed(() => {
  const det = sys.value.a1 * sys.value.b2 - sys.value.a2 * sys.value.b1
  if (Math.abs(det) < 0.0001) return null

  const x = (sys.value.c1 * sys.value.b2 - sys.value.c2 * sys.value.b1) / det
  const y = (sys.value.a1 * sys.value.c2 - sys.value.a2 * sys.value.c1) / det
  return { x, y }
})

// Code examples
const basicLinearCode = `# Solving ax + b = c
# Solution: x = (c - b) / a

def solve_linear(a, b, c):
    """Solve ax + b = c for x"""
    if a == 0:
        if b == c:
            return "Infinite solutions (any x works)"
        else:
            return "No solution"
    return (c - b) / a

# Example: 2x + 3 = 7
x = solve_linear(2, 3, 7)
print(f"2x + 3 = 7 → x = {x}")  # x = 2.0

# Verify: 2(2) + 3 = 7 ✓
print(f"Check: 2({x}) + 3 = {2*x + 3}")`

const systemCode = `import numpy as np

# System of linear equations:
# 2x + y = 5
# x - y = 1

# Method 1: Substitution (manual)
def solve_substitution():
    """From equation 2: y = x - 1
    Substitute into equation 1: 2x + (x - 1) = 5
    3x - 1 = 5 → x = 2, y = 1"""
    x = (5 + 1) / 3  # Derived from substitution
    y = x - 1
    return x, y

# Method 2: Matrix form (Ax = b)
def solve_matrix():
    """
    [2  1] [x]   [5]
    [1 -1] [y] = [1]
    """
    A = np.array([[2, 1], [1, -1]])
    b = np.array([5, 1])
    solution = np.linalg.solve(A, b)
    return solution[0], solution[1]

# Method 3: Cramer's Rule
def solve_cramer(a1, b1, c1, a2, b2, c2):
    """
    x = |c1 b1| / |a1 b1|
        |c2 b2|   |a2 b2|
    """
    det = a1 * b2 - a2 * b1
    if det == 0:
        return None  # No unique solution

    x = (c1 * b2 - c2 * b1) / det
    y = (a1 * c2 - a2 * c1) / det
    return x, y

# All methods give the same answer
print(f"Substitution: {solve_substitution()}")
print(f"Matrix: {solve_matrix()}")
print(f"Cramer: {solve_cramer(2, 1, 5, 1, -1, 1)}")`

const numpyCode = `import numpy as np

# NumPy makes linear systems trivial!
# Ax = b → x = A⁻¹b

# System:
# 3x + 2y - z = 1
# 2x - 2y + 4z = -2
# -x + 0.5y - z = 0

A = np.array([
    [3, 2, -1],
    [2, -2, 4],
    [-1, 0.5, -1]
])

b = np.array([1, -2, 0])

# Solve using np.linalg.solve (preferred - numerically stable)
x = np.linalg.solve(A, b)
print(f"Solution: x={x[0]:.4f}, y={x[1]:.4f}, z={x[2]:.4f}")

# Verify: Ax should equal b
print(f"Verification: {np.allclose(A @ x, b)}")  # True

# Alternative: using inverse (less efficient, less stable)
x_inv = np.linalg.inv(A) @ b
print(f"Via inverse: {x_inv}")`

const applicationCode = `# Real-world linear equations

# 1. Currency conversion
def convert_currency(amount, rate):
    """Linear: new_amount = amount × rate"""
    return amount * rate

usd = 100
eur = convert_currency(usd, 0.85)  # $100 = €85

# 2. Temperature conversion
def celsius_to_fahrenheit(c):
    """Linear: F = (9/5)C + 32"""
    return (9/5) * c + 32

def fahrenheit_to_celsius(f):
    """Inverse: C = (5/9)(F - 32)"""
    return (5/9) * (f - 32)

print(f"100°C = {celsius_to_fahrenheit(100)}°F")  # 212
print(f"32°F = {fahrenheit_to_celsius(32)}°C")   # 0

# 3. Cost calculation with fixed + variable costs
def total_cost(units, fixed_cost, cost_per_unit):
    """Linear: total = fixed + (per_unit × quantity)"""
    return fixed_cost + cost_per_unit * units

# Break-even analysis: when does revenue = cost?
def break_even(fixed_cost, cost_per_unit, price_per_unit):
    """Solve: price × units = fixed + cost × units"""
    if price_per_unit <= cost_per_unit:
        return float('inf')  # Never breaks even
    return fixed_cost / (price_per_unit - cost_per_unit)

print(f"Break-even at {break_even(1000, 5, 15)} units")`

const graphCode = `import matplotlib.pyplot as plt
import numpy as np

# Visualizing linear equations
# y = mx + b  (slope-intercept form)

def plot_line(m, b, label, color):
    x = np.linspace(-5, 5, 100)
    y = m * x + b
    plt.plot(x, y, color=color, label=label)

plt.figure(figsize=(10, 8))

# Plot several lines
plot_line(2, 1, 'y = 2x + 1', 'blue')    # Steep positive
plot_line(0.5, -1, 'y = 0.5x - 1', 'green')  # Gentle positive
plot_line(-1, 2, 'y = -x + 2', 'red')    # Negative slope
plot_line(0, 1, 'y = 1 (horizontal)', 'purple')  # Horizontal

# Mark key features
plt.axhline(y=0, color='k', linewidth=0.5)
plt.axvline(x=0, color='k', linewidth=0.5)

plt.grid(True, alpha=0.3)
plt.legend()
plt.xlabel('x')
plt.ylabel('y')
plt.title('Linear Equations: y = mx + b')
plt.xlim(-5, 5)
plt.ylim(-5, 5)
plt.show()

# The slope m tells you:
# - Positive: line goes up (left to right)
# - Negative: line goes down
# - Zero: horizontal line
# - Larger |m|: steeper line`

const linearAlgebraCode = `import numpy as np

# Linear equations connect to linear algebra!

# A system of equations is just matrix multiplication:
# 2x + 3y = 8    →  [2 3] [x]   [8]
# 4x - y = 2        [4 -1][y] = [2]

A = np.array([[2, 3], [4, -1]])
b = np.array([8, 2])

# Key concepts:

# 1. Determinant - tells you if a unique solution exists
det = np.linalg.det(A)
print(f"Determinant: {det}")  # If ≠ 0, unique solution exists

# 2. Matrix inverse - solving x = A⁻¹b
if det != 0:
    A_inv = np.linalg.inv(A)
    x = A_inv @ b
    print(f"Solution via inverse: x={x[0]}, y={x[1]}")

# 3. Eigenvalues - important for stability analysis
eigenvalues = np.linalg.eigvals(A)
print(f"Eigenvalues: {eigenvalues}")

# 4. Rank - number of linearly independent equations
rank = np.linalg.matrix_rank(A)
print(f"Rank: {rank}")  # If rank = number of unknowns, unique solution

# This is the foundation of:
# - Machine learning (gradient descent)
# - Computer graphics (transformations)
# - Physics simulations
# - Optimization problems`
</script>

<template>
  <TopicPage
    title="Linear Equations"
    description="The building blocks of algebra and the gateway to linear algebra."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is a Linear Equation?" icon="fa-solid fa-equals">
        <p class="mb-4">
          A <strong>linear equation</strong> is any equation where the variables appear only to the
          first power (no x², no √x, no 1/x). The graph is always a straight line.
        </p>

        <MathBlock formula="ax + b = c" display />

        <p class="my-4">
          The most common forms you'll see:
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">Standard Form</h4>
            <MathBlock formula="ax + by = c" display />
            <p class="text-sm text-text-muted mt-2">
              Useful for systems and finding intercepts
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">Slope-Intercept Form</h4>
            <MathBlock formula="y = mx + b" display />
            <p class="text-sm text-text-muted mt-2">
              m = slope, b = y-intercept
            </p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            The Programmer's View
          </p>
          <p class="text-text-secondary">
            Linear equations are everywhere in code: unit conversions, cost calculations, physics,
            and interpolation. They're also the foundation of NumPy, machine learning, and computer
            graphics.
          </p>
        </div>

        <!-- Three Analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-location-crosshairs mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Linear equations are like GPS: given your starting point and speed, they tell you exactly
              where you'll be at any time. Constant rate of change means straight-line paths.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              A linear equation is a lookup function: <code>y = m*x + b</code>. Given any x, you get
              exactly one y. Systems of equations are just matrix multiplication: <code>A @ x = b</code>.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Every linear equation is a straight line. Two equations = two lines. Their intersection
              (if it exists) is the solution. Parallel lines mean no solution.
            </p>
          </div>
        </div>

        <!-- Pitfall Callout -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Division by Coefficient
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            When solving <code>ax + b = c</code>, you divide by <code>a</code>. If <code>a = 0</code>,
            you don't have a linear equation at all—it's either a contradiction (no solution) or an
            identity (infinite solutions). Always check <code>a ≠ 0</code> before dividing.
          </p>
        </div>
      </ContentSection>

      <!-- Solving Single Equations -->
      <ContentSection
        id="solving"
        title="Solving Linear Equations"
        icon="fa-solid fa-wand-magic-sparkles"
      >
        <p class="mb-4">
          Solving <MathBlock formula="ax + b = c" /> for x is like running operations in reverse:
        </p>

        <div class="p-4 bg-surface-alt rounded-lg mb-6">
          <ol class="space-y-2 text-text-secondary">
            <li class="flex items-start gap-2">
              <span class="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0">1</span>
              <span>Subtract b from both sides: <MathBlock formula="ax = c - b" /></span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0">2</span>
              <span>Divide both sides by a: <MathBlock formula="x = \frac{c - b}{a}" /></span>
            </li>
          </ol>
        </div>

        <!-- Interactive Solver -->
        <div class="card p-6 mb-6">
          <h4 class="font-medium text-text-primary mb-4">
            <i class="fa-solid fa-calculator mr-2 text-primary" aria-hidden="true" />
            Try It: Solve ax + b = c
          </h4>

          <div class="grid gap-4 md:grid-cols-4 mb-4">
            <div>
              <label class="block text-sm text-text-muted mb-1">a</label>
              <input
                v-model.number="a"
                type="number"
                class="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label class="block text-sm text-text-muted mb-1">b</label>
              <input
                v-model.number="b"
                type="number"
                class="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label class="block text-sm text-text-muted mb-1">c</label>
              <input
                v-model.number="c"
                type="number"
                class="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label class="block text-sm text-text-muted mb-1">Solution</label>
              <div class="px-3 py-2 rounded-md bg-primary/10 text-primary font-bold">
                <template v-if="solution !== null">
                  x = {{ solution }}
                </template>
                <template v-else>
                  <span class="text-red-500">a ≠ 0 required</span>
                </template>
              </div>
            </div>
          </div>

          <p class="text-sm text-text-muted">
            Equation: <MathBlock :formula="`${a}x + (${b}) = ${c}`" />
            <span v-if="solution !== null">
              → <MathBlock :formula="`x = \\frac{${c} - (${b})}{${a}} = ${solution}`" />
            </span>
          </p>
        </div>

        <CodeExample
          id="algebra-linear-basic"
          :code="basicLinearCode"
          language="python"
          title="solve_linear.py"
        />
      </ContentSection>

      <!-- Systems of Equations -->
      <ContentSection id="systems" title="Systems of Linear Equations" icon="fa-solid fa-layer-group">
        <p class="mb-4">
          When you have multiple equations with multiple unknowns, you have a
          <strong>system</strong>. The solution is where all equations are satisfied simultaneously.
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border">
            <p class="text-sm text-text-muted mb-2">System of 2 equations:</p>
            <MathBlock formula="\begin{cases} 2x + y = 5 \\ x - y = 1 \end{cases}" display />
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="text-sm text-text-muted mb-2">Geometrically:</p>
            <p class="text-text-secondary">
              Two lines that intersect at one point. The solution is that intersection point
              (x, y) = (2, 1).
            </p>
          </div>
        </div>

        <!-- Interactive System Solver -->
        <div class="card p-6 mb-6">
          <h4 class="font-medium text-text-primary mb-4">
            <i class="fa-solid fa-calculator mr-2 text-primary" aria-hidden="true" />
            Try It: Solve a 2×2 System
          </h4>

          <div class="grid gap-4 md:grid-cols-2 mb-4">
            <div>
              <p class="text-sm text-text-muted mb-2">
                Equation 1: <MathBlock :formula="`${sys.a1}x + ${sys.b1}y = ${sys.c1}`" />
              </p>
              <div class="grid grid-cols-3 gap-2">
                <input
                  v-model.number="sys.a1"
                  type="number"
                  placeholder="a₁"
                  class="px-2 py-1 rounded border border-border bg-surface text-text-primary text-center"
                />
                <input
                  v-model.number="sys.b1"
                  type="number"
                  placeholder="b₁"
                  class="px-2 py-1 rounded border border-border bg-surface text-text-primary text-center"
                />
                <input
                  v-model.number="sys.c1"
                  type="number"
                  placeholder="c₁"
                  class="px-2 py-1 rounded border border-border bg-surface text-text-primary text-center"
                />
              </div>
            </div>

            <div>
              <p class="text-sm text-text-muted mb-2">
                Equation 2: <MathBlock :formula="`${sys.a2}x + ${sys.b2}y = ${sys.c2}`" />
              </p>
              <div class="grid grid-cols-3 gap-2">
                <input
                  v-model.number="sys.a2"
                  type="number"
                  placeholder="a₂"
                  class="px-2 py-1 rounded border border-border bg-surface text-text-primary text-center"
                />
                <input
                  v-model.number="sys.b2"
                  type="number"
                  placeholder="b₂"
                  class="px-2 py-1 rounded border border-border bg-surface text-text-primary text-center"
                />
                <input
                  v-model.number="sys.c2"
                  type="number"
                  placeholder="c₂"
                  class="px-2 py-1 rounded border border-border bg-surface text-text-primary text-center"
                />
              </div>
            </div>
          </div>

          <div class="p-4 rounded-lg bg-primary/10 text-center">
            <template v-if="systemSolution">
              <p class="text-lg font-bold text-primary">
                x = {{ systemSolution.x.toFixed(4) }}, y = {{ systemSolution.y.toFixed(4) }}
              </p>
              <p class="text-sm text-text-muted mt-1">Unique solution (lines intersect)</p>
            </template>
            <template v-else>
              <p class="text-lg font-bold text-amber-600">No unique solution</p>
              <p class="text-sm text-text-muted mt-1">Lines are parallel or identical</p>
            </template>
          </div>
        </div>

        <CodeExample
          id="algebra-linear-system"
          :code="systemCode"
          language="python"
          title="system_solver.py"
        />
      </ContentSection>

      <!-- Matrix Form -->
      <ContentSection id="matrix" title="Matrix Form & NumPy" icon="fa-solid fa-table-cells">
        <p class="mb-4">
          Systems of linear equations can be written in matrix form: <MathBlock formula="Ax = b" />.
          This is where linear equations connect to <strong>linear algebra</strong>.
        </p>

        <div class="p-4 bg-surface-alt rounded-lg mb-6">
          <p class="text-sm text-text-muted mb-2">Example system:</p>
          <div class="flex flex-wrap items-center gap-4 justify-center">
            <div>
              <MathBlock
                formula="\begin{cases} 2x + 3y = 8 \\ 4x - y = 2 \end{cases}"
                display
              />
            </div>
            <span class="text-2xl text-text-muted">→</span>
            <div>
              <MathBlock
                formula="\begin{bmatrix} 2 & 3 \\ 4 & -1 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 8 \\ 2 \end{bmatrix}"
                display
              />
            </div>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-6">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            Why Matrices Matter
          </p>
          <p class="text-text-secondary">
            NumPy's <code class="text-primary">np.linalg.solve(A, b)</code> can solve systems with
            hundreds of variables in milliseconds. This is the foundation of machine learning,
            computer graphics, and scientific computing.
          </p>
        </div>

        <CodeExample
          id="algebra-linear-numpy"
          :code="numpyCode"
          language="python"
          title="numpy_solve.py"
        />
      </ContentSection>

      <!-- Slope and Intercept -->
      <ContentSection id="slope" title="Slope & Intercept" icon="fa-solid fa-chart-line" collapsible>
        <p class="mb-4">
          The slope-intercept form <MathBlock formula="y = mx + b" /> tells you everything about a line:
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              Slope (m)
            </h4>
            <p class="text-sm text-text-muted mb-2">
              Rate of change: "rise over run"
            </p>
            <MathBlock formula="m = \frac{\Delta y}{\Delta x} = \frac{y_2 - y_1}{x_2 - x_1}" display />
            <ul class="text-sm text-text-secondary mt-2 space-y-1">
              <li>• m &gt; 0: line goes up ↗</li>
              <li>• m &lt; 0: line goes down ↘</li>
              <li>• m = 0: horizontal line</li>
              <li>• |m| large: steep line</li>
            </ul>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              Y-Intercept (b)
            </h4>
            <p class="text-sm text-text-muted mb-2">
              Where the line crosses the y-axis
            </p>
            <MathBlock formula="b = y \text{ when } x = 0" display />
            <ul class="text-sm text-text-secondary mt-2 space-y-1">
              <li>• Starting point at x = 0</li>
              <li>• Vertical shift of the line</li>
              <li>• In physics: initial value</li>
            </ul>
          </div>
        </div>

        <CodeExample
          id="algebra-linear-graph"
          :code="graphCode"
          language="python"
          title="plot_lines.py"
        />
      </ContentSection>

      <!-- Applications -->
      <ContentSection id="applications" title="Real-World Applications" icon="fa-solid fa-rocket" collapsible>
        <p class="mb-4">
          Linear equations appear constantly in programming:
        </p>

        <div class="grid gap-4 md:grid-cols-3 mb-6">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-money-bill text-primary mr-2" aria-hidden="true" />
              Business
            </h4>
            <ul class="text-sm text-text-muted space-y-1">
              <li>• Break-even analysis</li>
              <li>• Cost projections</li>
              <li>• Linear depreciation</li>
            </ul>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-flask text-primary mr-2" aria-hidden="true" />
              Science
            </h4>
            <ul class="text-sm text-text-muted space-y-1">
              <li>• Unit conversions</li>
              <li>• Motion (v = d/t)</li>
              <li>• Ohm's law (V = IR)</li>
            </ul>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-code text-primary mr-2" aria-hidden="true" />
              Programming
            </h4>
            <ul class="text-sm text-text-muted space-y-1">
              <li>• Linear interpolation</li>
              <li>• Coordinate mapping</li>
              <li>• Animation timing</li>
            </ul>
          </div>
        </div>

        <CodeExample
          id="algebra-linear-applications"
          :code="applicationCode"
          language="python"
          title="applications.py"
        />
      </ContentSection>

      <!-- Connection to Linear Algebra -->
      <ContentSection id="linear-algebra" title="Gateway to Linear Algebra" icon="fa-solid fa-door-open" collapsible>
        <p class="mb-4">
          Linear equations are the foundation of <strong>linear algebra</strong>, one of the most
          important areas of mathematics for programmers. Here's how they connect:
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">Key Concepts</h4>
            <ul class="text-sm text-text-secondary space-y-1">
              <li>• <strong>Matrices</strong>: 2D arrays of numbers</li>
              <li>• <strong>Vectors</strong>: 1D arrays (columns or rows)</li>
              <li>• <strong>Determinant</strong>: tells if solution exists</li>
              <li>• <strong>Inverse</strong>: "undoes" a transformation</li>
              <li>• <strong>Eigenvalues</strong>: scaling factors of special directions</li>
            </ul>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">Where It's Used</h4>
            <ul class="text-sm text-text-secondary space-y-1">
              <li>• <strong>Machine Learning</strong>: weights, gradients</li>
              <li>• <strong>Graphics</strong>: 3D transformations</li>
              <li>• <strong>Data Science</strong>: PCA, regression</li>
              <li>• <strong>Physics</strong>: quantum mechanics, simulations</li>
              <li>• <strong>Optimization</strong>: linear programming</li>
            </ul>
          </div>
        </div>

        <CodeExample
          id="algebra-linear-linalg"
          :code="linearAlgebraCode"
          language="python"
          title="linear_algebra_preview.py"
        />
      </ContentSection>

      <!-- Quick Reference -->
      <ContentSection id="reference" title="Quick Reference" icon="fa-solid fa-list-check">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-3">Forms of Linear Equations</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-text-muted">Standard:</span>
                <MathBlock formula="ax + by = c" />
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text-muted">Slope-intercept:</span>
                <MathBlock formula="y = mx + b" />
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text-muted">Point-slope:</span>
                <MathBlock formula="y - y_1 = m(x - x_1)" />
              </div>
            </div>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-3">Python Solutions</h4>
            <div class="space-y-2 text-sm font-mono">
              <div>
                <span class="text-text-muted"># Single equation</span>
                <p class="text-primary">x = (c - b) / a</p>
              </div>
              <div>
                <span class="text-text-muted"># System (NumPy)</span>
                <p class="text-primary">x = np.linalg.solve(A, b)</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p class="font-medium text-primary mb-2">
            <i class="fa-solid fa-brain mr-2" aria-hidden="true" />
            Remember
          </p>
          <p class="text-text-secondary">
            Linear equations are the simplest equations to solve, but they're also the most
            powerful. When you understand them deeply, you unlock NumPy, machine learning, and
            computer graphics.
          </p>
        </div>
      </ContentSection>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
