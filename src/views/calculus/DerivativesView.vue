<script setup lang="ts">
/**
 * DerivativesView - Comprehensive content page for derivatives
 *
 * Covers:
 * - Intuitive understanding of derivatives as slopes
 * - Interactive DerivativeVisualizer widget
 * - Secant-to-tangent convergence (limit definition)
 * - Common derivative rules
 * - Critical points and optimization
 * - Programming applications (gradient descent, numerical differentiation)
 *
 * D-112: Focus on geometric interpretation over symbolic rules
 */

import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import { DerivativeVisualizer } from '@/components/widgets'

// ============================================================================
// Data
// ============================================================================

const relatedTopics = [
  {
    title: 'Limits',
    path: '/calculus/limits',
    description: 'Derivatives are defined using limits',
  },
  {
    title: 'Exponentials',
    path: '/algebra/exponentials',
    description: 'e^x is its own derivative - a special property',
  },
  {
    title: 'Trigonometry',
    path: '/trigonometry',
    description: 'sin and cos derivatives cycle through each other',
  },
  {
    title: 'Calculus Overview',
    path: '/calculus',
    description: 'Return to the calculus section',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const numericalDerivativeCode = `# Numerical differentiation in Python
# Two main approaches: forward difference and central difference

def forward_difference(f, x, h=0.0001):
    """
    Forward difference: f'(x) approx [f(x+h) - f(x)] / h

    This is the literal limit definition!
    Less accurate but matches textbook formula.
    """
    return (f(x + h) - f(x)) / h

def central_difference(f, x, h=0.0001):
    """
    Central difference: f'(x) approx [f(x+h) - f(x-h)] / (2h)

    More accurate (O(h^2) error vs O(h) for forward).
    This is what NumPy and most libraries use internally.
    """
    return (f(x + h) - f(x - h)) / (2 * h)

# Example: derivative of x^2 at x=3 (should be 6)
f = lambda x: x**2

print("Forward difference:", forward_difference(f, 3))  # ~6.0001
print("Central difference:", central_difference(f, 3))  # ~6.0000

# Compare accuracy with different h values
print("\\nAccuracy comparison at x=3:")
for h in [0.1, 0.01, 0.001, 0.0001]:
    fwd = forward_difference(f, 3, h)
    ctr = central_difference(f, 3, h)
    print(f"h={h}: forward={fwd:.8f}, central={ctr:.8f}")`

const gradientDescentCode = `# Gradient Descent: Derivatives in Machine Learning
# The most important application of derivatives in programming!

def gradient_descent(f, df, x0, learning_rate=0.1, max_iter=100, tol=1e-8):
    """
    Find minimum of f(x) using its derivative df.

    The key insight: move OPPOSITE to the derivative direction.
    - If f'(x) > 0, function is increasing, so go LEFT (decrease x)
    - If f'(x) < 0, function is decreasing, so go RIGHT (increase x)

    Update rule: x_new = x - learning_rate * f'(x)
    """
    x = x0
    history = [x]

    for i in range(max_iter):
        slope = df(x)  # The derivative tells us which way is "uphill"

        # Move in the direction of steepest DESCENT
        x_new = x - learning_rate * slope

        history.append(x_new)

        # Check convergence (derivative near zero = at a minimum)
        if abs(slope) < tol:
            print(f"Converged after {i+1} iterations at x = {x_new:.6f}")
            return x_new, history

        x = x_new

    return x, history

# Example: Find minimum of f(x) = x^2 - 4x + 5
# Derivative: f'(x) = 2x - 4
# Minimum is where f'(x) = 0, so x = 2

f = lambda x: x**2 - 4*x + 5
df = lambda x: 2*x - 4

minimum, path = gradient_descent(f, df, x0=0)
print(f"Found minimum at x = {minimum}, f(x) = {f(minimum)}")
# Output: x = 2, f(x) = 1

# In ML, this scales to millions of parameters!
# x becomes a vector, and we compute partial derivatives`

const tangentApproxCode = `# Linear Approximation: The Tangent Line as a Shortcut
# Near a point, f(x) approx f(a) + f'(a) * (x - a)

def linear_approximation(f, df, a, x):
    """
    Approximate f(x) using the tangent line at x=a.

    This is why derivatives matter: they let us
    predict function values using simple arithmetic!
    """
    return f(a) + df(a) * (x - a)

# Example: Approximate sqrt(4.1) using tangent at sqrt(4) = 2
import math

f = math.sqrt
df = lambda x: 1 / (2 * math.sqrt(x))  # d/dx sqrt(x) = 1/(2*sqrt(x))

# Tangent line at x=4: y = 2 + 0.25*(x-4) = 0.25x + 1
a = 4
x = 4.1

exact = f(x)
approx = linear_approximation(f, df, a, x)
error = abs(exact - approx)

print(f"sqrt(4.1) exact:  {exact:.8f}")
print(f"sqrt(4.1) approx: {approx:.8f}")
print(f"Error: {error:.10f}")  # Incredibly small!

# This is the basis of Newton's method, Taylor series, and more`

const autoGradCode = `# Automatic Differentiation: How ML Frameworks Work
# PyTorch, TensorFlow, JAX all use this under the hood

# Simplified example of forward-mode autodiff
class DualNumber:
    """
    A dual number carries both value and derivative.
    x + epsilon*x' where epsilon^2 = 0

    Operations automatically compute derivatives!
    """
    def __init__(self, value, derivative=0):
        self.value = value
        self.derivative = derivative

    def __add__(self, other):
        if isinstance(other, DualNumber):
            return DualNumber(
                self.value + other.value,
                self.derivative + other.derivative
            )
        return DualNumber(self.value + other, self.derivative)

    def __mul__(self, other):
        if isinstance(other, DualNumber):
            # Product rule: (uv)' = u'v + uv'
            return DualNumber(
                self.value * other.value,
                self.derivative * other.value + self.value * other.derivative
            )
        return DualNumber(self.value * other, self.derivative * other)

    def __pow__(self, n):
        # Power rule: (x^n)' = n * x^(n-1) * x'
        return DualNumber(
            self.value ** n,
            n * (self.value ** (n-1)) * self.derivative
        )

    def __repr__(self):
        return f"DualNumber({self.value}, {self.derivative})"

# Example: compute d/dx(x^2 + 3x) at x=2
# f(x) = x^2 + 3x
# f'(x) = 2x + 3
# f'(2) = 7

x = DualNumber(2, 1)  # x with derivative 1 (we're differentiating wrt x)
result = x**2 + x*3

print(f"f(2) = {result.value}")       # 10
print(f"f'(2) = {result.derivative}") # 7

# Real ML frameworks are more sophisticated but this is the core idea!`
</script>

<template>
  <TopicPage :related-topics="relatedTopics">
    title="Derivatives"
    description="The slope of change - understanding rates, tangent lines, and the foundation of optimization"
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is a Derivative?" icon="fa-solid fa-chart-line" collapsible>
        <p class="mb-4">
          A <strong>derivative</strong> tells you how fast something is changing at a specific
          moment. It's the <em>slope of the tangent line</em> to a curve - the instantaneous rate of
          change.
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <MathBlock formula="f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" display />
          <p class="text-sm text-text-secondary text-center mt-2">
            "The derivative of f at x equals the limit as h approaches 0 of the difference quotient"
          </p>
        </div>

        <p class="mb-4">
          Don't let the formula intimidate you. The derivative is asking a simple question: if I
          move a tiny bit in x, how much does y change? The ratio of those tiny changes is the
          slope.
        </p>

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-car mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Your car's speedometer shows your <em>derivative</em> - how fast your position is
              changing right now. Not average speed, but instantaneous speed at this exact moment.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              It's like computing
              <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded"
                >(f(x+h) - f(x)) / h</code
              >
              with h so small it's practically zero. The "diff" of your function.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-mountain mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Draw a straight line that just touches the curve at one point. That line's slope is
              the derivative - it shows which way is "uphill" right there.
            </p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            Why Derivatives Matter
          </p>
          <p class="text-text-secondary">
            Derivatives are the backbone of optimization. Finding where f'(x) = 0 locates minimum
            and maximum points - this is exactly how machine learning trains neural networks!
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Derivative Explorer" icon="fa-solid fa-compass" collapsible>
        <p class="mb-4 text-text-secondary">
          Explore different functions and see how the derivative (slope of the tangent line) changes
          as you move along the curve. Toggle the secant line to see how it converges to the
          tangent!
        </p>

        <DerivativeVisualizer sync-url />

        <div class="mt-4 p-4 rounded-lg border border-border">
          <h4 class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Try These Experiments
          </h4>
          <ul class="text-sm text-text-secondary space-y-2 ml-4 list-disc">
            <li>
              <strong>Quadratic (x squared)</strong>: At x=0, the tangent is horizontal (slope = 0).
              This is the minimum!
            </li>
            <li>
              <strong>Polynomial (x cubed - 3x)</strong>: Find where the derivative equals zero -
              these are the local min/max points
            </li>
            <li>
              <strong>Sine</strong>: The derivative is cosine! Notice the slope is steepest where
              sin crosses zero
            </li>
            <li>
              <strong>Exponential (e to x)</strong>: Amazing fact - the slope always equals the
              y-value. e to x is its own derivative!
            </li>
            <li>
              <strong>Turn on Secant Line</strong>: Decrease h and watch the secant line approach
              the tangent
            </li>
          </ul>
        </div>
      </ContentSection>

      <!-- From Secants to Tangents -->
      <ContentSection
        id="secant-tangent"
        title="From Secants to Tangents"
        icon="fa-solid fa-arrows-down-to-line"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          The derivative is defined as a <strong>limit</strong>. We start with secant lines (which
          touch the curve at two points) and see what happens as those two points get closer and
          closer together.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h4 class="font-semibold text-amber-700 dark:text-amber-300 mb-2">Secant Line</h4>
            <MathBlock formula="\text{slope} = \frac{f(x+h) - f(x)}{h}" />
            <p class="text-sm text-amber-600 dark:text-amber-400 mt-2">
              Connects two points on the curve, separated by distance h
            </p>
          </div>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 class="font-semibold text-blue-700 dark:text-blue-300 mb-2">Tangent Line</h4>
            <MathBlock formula="\text{slope} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" />
            <p class="text-sm text-blue-600 dark:text-blue-400 mt-2">
              The limit as h approaches 0 - touches at exactly one point
            </p>
          </div>
        </div>

        <p class="mb-4">
          In the explorer above, toggle "Secant Line" and use the "Animation" panel to watch this
          convergence happen step by step. As h shrinks from 1 to 0.001, the secant slope approaches
          the tangent slope!
        </p>

        <CodeExample
          title="numerical_derivative.py"
          language="python"
          :code="numericalDerivativeCode"
          :collapsible="true"
          :default-expanded="true"
        />

        <p class="mt-4 text-text-secondary">
          The central difference formula is what numerical libraries actually use - it's more
          accurate because errors from above and below cancel out.
        </p>
      </ContentSection>

      <!-- Derivative Rules -->
      <ContentSection
        id="rules"
        title="Common Derivative Rules"
        icon="fa-solid fa-list-check"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          While visual understanding is key, knowing the rules helps you quickly reason about
          function behavior. Here are the most important ones:
        </p>

        <div class="overflow-x-auto mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="py-2 px-3 text-left font-medium">Rule</th>
                <th class="py-2 px-3 text-left font-medium">Formula</th>
                <th class="py-2 px-3 text-left font-medium">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-medium">Power Rule</td>
                <td class="py-2 px-3"><MathBlock formula="\frac{d}{dx}x^n = nx^{n-1}" /></td>
                <td class="py-2 px-3 text-text-secondary">d/dx(x cubed) = 3x squared</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-medium">Constant</td>
                <td class="py-2 px-3"><MathBlock formula="\frac{d}{dx}c = 0" /></td>
                <td class="py-2 px-3 text-text-secondary">d/dx(5) = 0</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-medium">Sum Rule</td>
                <td class="py-2 px-3"><MathBlock formula="(f + g)' = f' + g'" /></td>
                <td class="py-2 px-3 text-text-secondary">Derivatives add</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-medium">Product Rule</td>
                <td class="py-2 px-3"><MathBlock formula="(fg)' = f'g + fg'" /></td>
                <td class="py-2 px-3 text-text-secondary">d/dx(x sin(x)) = sin(x) + x cos(x)</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-medium">Chain Rule</td>
                <td class="py-2 px-3"><MathBlock formula="(f(g(x)))' = f'(g(x)) \cdot g'(x)" /></td>
                <td class="py-2 px-3 text-text-secondary">d/dx(sin(x squared)) = 2x cos(x squared)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 rounded-lg border border-border">
          <h4 class="font-semibold text-primary mb-2">Common Derivatives to Know</h4>
          <div class="grid gap-2 sm:grid-cols-2 text-sm">
            <div><MathBlock formula="\frac{d}{dx}\sin(x) = \cos(x)" /></div>
            <div><MathBlock formula="\frac{d}{dx}\cos(x) = -\sin(x)" /></div>
            <div><MathBlock formula="\frac{d}{dx}e^x = e^x" /></div>
            <div><MathBlock formula="\frac{d}{dx}\ln(x) = \frac{1}{x}" /></div>
          </div>
        </div>
      </ContentSection>

      <!-- Critical Points -->
      <ContentSection
        id="critical-points"
        title="Critical Points and Optimization"
        icon="fa-solid fa-location-dot"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          A <strong>critical point</strong> is where f'(x) = 0 (horizontal tangent) or where f'(x)
          doesn't exist. These are the candidates for local minima, maxima, or inflection points.
        </p>

        <div class="grid gap-4 sm:grid-cols-3 mb-4">
          <div class="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 class="font-semibold text-green-700 dark:text-green-300 mb-2">
              <i class="fa-solid fa-arrow-down mr-2" aria-hidden="true" />
              Local Minimum
            </h4>
            <p class="text-sm text-green-600 dark:text-green-400">
              f'(x) = 0 and f''(x) > 0 (concave up - like a smile)
            </p>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 class="font-semibold text-red-700 dark:text-red-300 mb-2">
              <i class="fa-solid fa-arrow-up mr-2" aria-hidden="true" />
              Local Maximum
            </h4>
            <p class="text-sm text-red-600 dark:text-red-400">
              f'(x) = 0 and f''(x) &lt; 0 (concave down - like a frown)
            </p>
          </div>
          <div class="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg">
            <h4 class="font-semibold text-purple-700 dark:text-purple-300 mb-2">
              <i class="fa-solid fa-arrows-up-down mr-2" aria-hidden="true" />
              Inflection Point
            </h4>
            <p class="text-sm text-purple-600 dark:text-purple-400">
              f'(x) = 0 and f''(x) = 0, curve changes concavity
            </p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-brain mr-2" aria-hidden="true" />
            Why This Matters for ML
          </p>
          <p class="text-text-secondary">
            Training a neural network means finding weights that minimize the loss function. We find
            minima by looking for where the gradient (vector of derivatives) equals zero. This is
            literally what "gradient descent" does - follow the slope downhill until it flattens
            out!
          </p>
        </div>
      </ContentSection>

      <!-- Gradient Descent -->
      <ContentSection
        id="gradient-descent"
        title="Gradient Descent in Action"
        icon="fa-solid fa-brain"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          <strong>Gradient descent</strong> is the workhorse of machine learning. The idea is
          beautifully simple: the derivative tells you which way is uphill, so go the opposite way
          to find the minimum.
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <MathBlock formula="x_{\text{new}} = x - \alpha \cdot f'(x)" display />
          <p class="text-sm text-text-secondary text-center mt-2">
            Update rule: move opposite to the derivative, scaled by learning rate alpha
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-gauge mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Imagine you're blindfolded on a hilly terrain trying to find the lowest point. You
              feel which way the ground slopes, then take a step in the opposite (downhill)
              direction. Repeat until it's flat.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-mountain-sun mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              In the explorer, watch the slope value. Where it's positive (uphill right), we'd move
              left. Where it's negative (downhill right), we'd move right. Zero slope = we've
              arrived!
            </p>
          </div>
        </div>

        <CodeExample
          title="gradient_descent.py"
          language="python"
          :code="gradientDescentCode"
          :collapsible="true"
          :default-expanded="true"
        />
      </ContentSection>

      <!-- Programming Applications -->
      <ContentSection
        id="applications"
        title="More Programming Applications"
        icon="fa-solid fa-laptop-code"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">Beyond gradient descent, derivatives appear everywhere in programming:</p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-ruler mr-2" aria-hidden="true" />
              Linear Approximation
            </h4>
            <p class="text-sm text-text-secondary">
              Near a point, f(x) is approximately f(a) + f'(a) times (x-a). The tangent line is a
              quick estimate!
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-bolt mr-2" aria-hidden="true" />
              Physics Simulations
            </h4>
            <p class="text-sm text-text-secondary">
              Position's derivative is velocity. Velocity's derivative is acceleration. This is how
              game physics work!
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-purple-600 mb-2">
              <i class="fa-solid fa-robot mr-2" aria-hidden="true" />
              Automatic Differentiation
            </h4>
            <p class="text-sm text-text-secondary">
              PyTorch, TensorFlow, JAX automatically compute derivatives. No manual math needed!
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-crosshairs mr-2" aria-hidden="true" />
              Sensitivity Analysis
            </h4>
            <p class="text-sm text-text-secondary">
              How much does output change when input changes slightly? That's exactly what
              derivatives measure.
            </p>
          </div>
        </div>

        <CodeExample
          title="linear_approximation.py"
          language="python"
          :code="tangentApproxCode"
          :collapsible="true"
          :default-expanded="false"
        />

        <div class="mt-4">
          <CodeExample
            title="autodiff_basics.py"
            language="python"
            :code="autoGradCode"
            :collapsible="true"
            :default-expanded="false"
          />
        </div>
      </ContentSection>

    </div>
  </TopicPage>
</template>
