<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import { QuadraticExplorer } from '@/components/widgets/QuadraticExplorer'

const relatedTopics = [
  { title: 'Algebra Overview', path: '/algebra', description: 'All algebra topics' },
  { title: 'Linear Equations', path: '/algebra/linear-equations', description: 'Simpler: degree 1 polynomials' },
  { title: 'Number Types', path: '/basics/number-types', description: 'Complex numbers for imaginary roots' },
  { title: 'Derivatives', path: '/calculus/derivatives', description: 'Finding the vertex via calculus' },
]

// Code examples
const basicQuadraticCode = `def quadratic(x, a=1, b=0, c=0):
    """Evaluate quadratic function at x."""
    return a * x**2 + b * x + c

# Example: f(x) = 2x² - 4x + 1
f = lambda x: quadratic(x, a=2, b=-4, c=1)
print(f(0))   # 1 (y-intercept)
print(f(1))   # -1
print(f(2))   # 1`

const vertexFormCode = `def standard_to_vertex(a, b, c):
    """Convert standard form to vertex form."""
    h = -b / (2 * a)
    k = a * h**2 + b * h + c
    return a, h, k

# Example: y = x² - 4x + 3
a, h, k = standard_to_vertex(1, -4, 3)
print(f"Vertex form: y = {a}(x - {h})² + {k}")
# Output: Vertex form: y = 1(x - 2)² + -1`

const solveQuadraticCode = `import math

def solve_quadratic(a, b, c):
    """Find roots of ax² + bx + c = 0."""
    discriminant = b**2 - 4*a*c

    if discriminant > 0:
        x1 = (-b + math.sqrt(discriminant)) / (2*a)
        x2 = (-b - math.sqrt(discriminant)) / (2*a)
        return [x1, x2]
    elif discriminant == 0:
        x = -b / (2*a)
        return [x]
    else:
        # Complex roots - see Number Types!
        return []

# Example: x² - 5x + 6 = 0
roots = solve_quadratic(1, -5, 6)
print(f"Roots: {roots}")  # [3.0, 2.0]`

const projectileCode = `def projectile_height(t, v0=20, h0=1.5, g=9.8):
    """
    Calculate height of projectile at time t.
    v0: initial velocity (m/s)
    h0: initial height (m)
    g: gravity (m/s²)
    """
    return -0.5 * g * t**2 + v0 * t + h0

# Find when ball hits ground (h = 0)
# Using quadratic formula with a=-4.9, b=20, c=1.5
import math
a, b, c = -4.9, 20, 1.5
t = (-b - math.sqrt(b**2 - 4*a*c)) / (2*a)
print(f"Ball hits ground at t = {t:.2f} seconds")`
</script>

<template>
  <TopicPage title="Quadratic Functions">
    <!-- What is a Quadratic Function? -->
    <ContentSection id="introduction" title="What is a Quadratic Function?">
      <p class="mb-4">
        A <strong>quadratic function</strong> is a polynomial of degree 2. In its most general form,
        it looks like this:
      </p>

      <div class="my-6 text-center">
        <MathBlock formula="y = ax^2 + bx + c" display />
      </div>

      <p class="mb-4">
        where <MathBlock formula="a \neq 0" /> (if <code>a</code> were zero, it would just be a
        linear function).
      </p>

      <p class="mb-4">
        The graph of a quadratic function is a <strong>parabola</strong> - a smooth, U-shaped
        curve. If <MathBlock formula="a > 0" />, the parabola opens upward (like a smile). If
        <MathBlock formula="a < 0" />, it opens downward (like a frown).
      </p>

      <h3 class="text-lg font-semibold mt-6 mb-3">Why Programmers Care</h3>

      <p class="mb-4">
        Quadratics appear everywhere in programming: physics engines use them for projectile
        motion, game developers use them for jump arcs and trajectories, and optimization
        algorithms often work with quadratic cost functions. Understanding how to analyze and
        manipulate parabolas is a fundamental skill.
      </p>

      <!-- Three Analogies -->
      <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
            <i class="fa-solid fa-basketball mr-2" aria-hidden="true" />
            Everyday Analogy
          </h4>
          <p class="text-sm text-text-secondary">
            Throwing a ball follows a parabola. The vertex is the peak height, the roots are where
            it leaves your hand and lands. Quadratics are the math of arcs.
          </p>
        </div>
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            <i class="fa-solid fa-code mr-2" aria-hidden="true" />
            Programming Analogy
          </h4>
          <p class="text-sm text-text-secondary">
            Quadratics are the "DNA of curves"—the simplest non-linear function. Neural networks
            learn by following quadratic error surfaces to find the minimum loss at the vertex.
          </p>
        </div>
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
            Visual Intuition
          </h4>
          <p class="text-sm text-text-secondary">
            The parabola is symmetric around its vertex. The vertex is either the max (frown) or
            min (smile) depending on whether a is negative or positive.
          </p>
        </div>
      </div>

      <!-- Pitfall Callout -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
          <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
          Common Pitfall: Negative Discriminant
        </p>
        <p class="text-sm text-amber-600 dark:text-amber-400">
          When <code>b² - 4ac < 0</code>, the roots are complex numbers—<code>math.sqrt()</code>
          will raise an error! Use <code>cmath.sqrt()</code> or check the discriminant first.
          Real parabolas that never cross the x-axis have imaginary roots.
        </p>
      </div>
    </ContentSection>

    <!-- Interactive Explorer -->
    <ContentSection id="explorer" title="Interactive Explorer">
      <p class="mb-4">
        Adjust the coefficients below to see how they affect the shape and position of the
        parabola. Try the presets to see common patterns.
      </p>

      <QuadraticExplorer :sync-url="true" initial-preset="standard" />
    </ContentSection>

    <!-- Understanding the Coefficients -->
    <ContentSection id="coefficients" title="Understanding the Coefficients" :default-expanded="false">
      <div class="space-y-6">
        <div>
          <h4 class="font-semibold mb-2">
            The <code>a</code> coefficient (x² term)
          </h4>
          <ul class="list-disc list-inside space-y-1 text-text-secondary">
            <li>
              <strong>|a| > 1</strong>: The parabola is <em>narrower</em> (stretched vertically)
            </li>
            <li>
              <strong>|a| &lt; 1</strong>: The parabola is <em>wider</em> (compressed vertically)
            </li>
            <li>
              <strong>a &lt; 0</strong>: The parabola opens <em>downward</em>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-2">
            The <code>b</code> coefficient (x term)
          </h4>
          <p class="text-text-secondary">
            The <code>b</code> coefficient, combined with <code>a</code>, determines the horizontal
            position of the vertex. The vertex x-coordinate is
            <MathBlock formula="x = -\frac{b}{2a}" />.
          </p>
        </div>

        <div>
          <h4 class="font-semibold mb-2">
            The <code>c</code> coefficient (constant term)
          </h4>
          <p class="text-text-secondary">
            This is simply the <strong>y-intercept</strong> - where the parabola crosses the y-axis.
            When <code>x = 0</code>, <code>y = c</code>.
          </p>
        </div>
      </div>

      <CodeExample id="algebra-quadratic-eval" language="python" title="quadratic_eval.py" :code="basicQuadraticCode" />
    </ContentSection>

    <!-- The Three Forms -->
    <ContentSection id="forms" title="The Three Forms" :default-expanded="false">
      <div class="space-y-6">
        <div class="p-4 bg-surface-secondary rounded-lg">
          <h4 class="font-semibold mb-2">Standard Form</h4>
          <MathBlock formula="y = ax^2 + bx + c" display class="mb-2" />
          <p class="text-sm text-text-muted">
            Easiest to read coefficients. Y-intercept is obvious (it's <code>c</code>).
          </p>
        </div>

        <div class="p-4 bg-surface-secondary rounded-lg">
          <h4 class="font-semibold mb-2">Vertex Form</h4>
          <MathBlock formula="y = a(x - h)^2 + k" display class="mb-2" />
          <p class="text-sm text-text-muted">
            The vertex <MathBlock formula="(h, k)" /> is immediately visible. Perfect for graphing
            transformations.
          </p>
        </div>

        <div class="p-4 bg-surface-secondary rounded-lg">
          <h4 class="font-semibold mb-2">Factored Form</h4>
          <MathBlock formula="y = a(x - r_1)(x - r_2)" display class="mb-2" />
          <p class="text-sm text-text-muted">
            Roots <MathBlock formula="r_1" /> and <MathBlock formula="r_2" /> are immediately
            visible. Only exists if the roots are real.
          </p>
        </div>
      </div>

      <CodeExample id="algebra-quadratic-vertex" language="python" title="vertex_form.py" :code="vertexFormCode" />
    </ContentSection>

    <!-- Solving Quadratic Equations -->
    <ContentSection id="solving" title="Solving Quadratic Equations" :default-expanded="false">
      <p class="mb-4">
        To find the <strong>roots</strong> (x-intercepts) of a quadratic, we set
        <MathBlock formula="y = 0" /> and solve using the <strong>quadratic formula</strong>:
      </p>

      <div class="my-6 text-center">
        <MathBlock formula="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" display />
      </div>

      <h4 class="font-semibold mt-6 mb-3">The Discriminant</h4>

      <p class="mb-4">
        The expression under the square root, <MathBlock formula="\Delta = b^2 - 4ac" />, is called
        the <strong>discriminant</strong>. It tells us how many real roots exist:
      </p>

      <ul class="list-disc list-inside space-y-2 mb-4 text-text-secondary">
        <li>
          <strong><MathBlock formula="\Delta > 0" /></strong>: Two distinct real roots (parabola
          crosses x-axis twice)
        </li>
        <li>
          <strong><MathBlock formula="\Delta = 0" /></strong>: One repeated real root (parabola
          touches x-axis once)
        </li>
        <li>
          <strong><MathBlock formula="\Delta < 0" /></strong>: No real roots (parabola doesn't
          touch x-axis) - the roots are complex numbers
        </li>
      </ul>

      <CodeExample id="algebra-quadratic-roots" language="python" title="solve_quadratic.py" :code="solveQuadraticCode" />
    </ContentSection>

    <!-- Real-World Applications -->
    <ContentSection id="applications" title="Real-World Applications" :default-expanded="false">
      <div class="space-y-6">
        <div>
          <h4 class="font-semibold mb-2">Projectile Motion</h4>
          <p class="text-text-secondary mb-2">
            The height of a thrown ball follows a parabola:
            <MathBlock formula="h(t) = -\frac{1}{2}gt^2 + v_0 t + h_0" />
          </p>
          <ul class="list-disc list-inside text-sm text-text-muted">
            <li>Vertex = maximum height</li>
            <li>Positive root = landing time</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-2">Profit Optimization</h4>
          <p class="text-text-secondary mb-2">
            Revenue minus costs as a function of units sold often forms a downward parabola:
            <MathBlock formula="P(x) = -ax^2 + bx - c" />
          </p>
          <ul class="list-disc list-inside text-sm text-text-muted">
            <li>Vertex = maximum profit point</li>
            <li>Roots = break-even points</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-2">Parabolic Reflectors</h4>
          <p class="text-text-secondary">
            Satellite dishes and flashlight reflectors use parabolic shapes because parallel rays
            converge at the focus point <MathBlock formula="(0, \frac{1}{4a})" />.
          </p>
        </div>
      </div>

      <CodeExample id="algebra-quadratic-projectile" language="python" title="projectile.py" :code="projectileCode" />
    </ContentSection>

    <!-- Key Formulas Reference -->
    <ContentSection id="reference" title="Key Formulas Reference">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-2 pr-4">Property</th>
              <th class="text-left py-2">Formula</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Vertex x-coordinate</td>
              <td class="py-2">
                <MathBlock formula="h = -\frac{b}{2a}" />
              </td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Vertex y-coordinate</td>
              <td class="py-2">
                <MathBlock formula="k = c - \frac{b^2}{4a}" />
              </td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Axis of symmetry</td>
              <td class="py-2">
                <MathBlock formula="x = -\frac{b}{2a}" />
              </td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Discriminant</td>
              <td class="py-2">
                <MathBlock formula="\Delta = b^2 - 4ac" />
              </td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Quadratic formula</td>
              <td class="py-2">
                <MathBlock formula="x = \frac{-b \pm \sqrt{\Delta}}{2a}" />
              </td>
            </tr>
            <tr>
              <td class="py-2 pr-4">Y-intercept</td>
              <td class="py-2">
                <MathBlock formula="(0, c)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ContentSection>

    <RelatedTopics :topics="relatedTopics" />
  </TopicPage>
</template>
