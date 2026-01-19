<script setup lang="ts">
/**
 * LimitsView - Comprehensive content page for mathematical limits
 *
 * Covers:
 * - Intuitive understanding of limits
 * - Interactive explorer widget
 * - Epsilon-delta definition
 * - One-sided limits
 * - Types of discontinuities
 * - Famous limits
 * - Programming applications
 */

import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import { LimitsExplorer } from '@/components/widgets'

// ============================================================================
// Data
// ============================================================================

const relatedTopics = [
  {
    title: 'Derivatives',
    path: '/calculus/derivatives',
    description: 'Derivatives are defined using limits',
  },
  {
    title: 'Exponentials',
    path: '/algebra/exponentials',
    description: 'The number e is defined as a limit',
  },
  {
    title: 'Trigonometry',
    path: '/trigonometry',
    description: "sin(x)/x limit and L'Hôpital applications",
  },
  {
    title: 'Functions',
    path: '/basics/functions',
    description: 'Understanding function behavior',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const numericalLimitCode = `# Numerical limit approximation
# This is how computers "evaluate" limits

def numerical_limit(f, a, direction='both', steps=10):
    """
    Approximate limit of f(x) as x approaches a.

    Args:
        f: The function to evaluate
        a: The point to approach
        direction: 'left', 'right', or 'both'
        steps: Number of approximation steps

    Returns:
        Approximation sequence showing convergence
    """
    results = []

    if direction in ('left', 'both'):
        # Approach from left: a - 0.1, a - 0.01, a - 0.001, ...
        h = 0.1
        for _ in range(steps):
            x = a - h
            fx = f(x)
            results.append(('left', x, fx, h))
            h /= 10

    if direction in ('right', 'both'):
        # Approach from right: a + 0.1, a + 0.01, a + 0.001, ...
        h = 0.1
        for _ in range(steps):
            x = a + h
            fx = f(x)
            results.append(('right', x, fx, h))
            h /= 10

    return results

# Example: lim(x->0) sin(x)/x = 1
import math

def sinc(x):
    if x == 0:
        return float('nan')  # Undefined at 0
    return math.sin(x) / x

print("Approaching 0 from both sides:")
for side, x, fx, h in numerical_limit(sinc, 0, 'both', 5):
    print(f"  {side:5} x={x:12.9f}  f(x)={fx:.10f}")`

const epsilonDeltaCode = `# The epsilon-delta definition in code
# "For every epsilon > 0, there exists delta > 0 such that
#  if 0 < |x - a| < delta then |f(x) - L| < epsilon"

def find_delta_for_epsilon(f, a, L, epsilon, max_delta=1.0):
    """
    Find a delta that works for the given epsilon.

    This demonstrates the epsilon-delta definition:
    - Given how close we want f(x) to L (epsilon)
    - Find how close x must be to a (delta)
    """
    delta = max_delta

    # Binary search for working delta
    while delta > 1e-10:
        # Test if this delta works
        works = True

        # Check many points within delta of a
        for x in [a - delta/2, a - delta/4, a + delta/4, a + delta/2]:
            if x == a:
                continue  # Skip the point itself

            fx = f(x)
            if abs(fx - L) >= epsilon:
                works = False
                break

        if works:
            return delta

        delta /= 2  # Try smaller delta

    return None  # No delta works (limit may not exist)

# Example: f(x) = x^2, a = 2, L = 4
f = lambda x: x**2

for eps in [1.0, 0.5, 0.1, 0.01]:
    delta = find_delta_for_epsilon(f, a=2, L=4, epsilon=eps)
    print(f"epsilon = {eps:.2f} -> delta = {delta:.4f}")`

const convergenceCode = `# Limits in practice: Convergence checking
# Many algorithms use limit-like convergence criteria

def iterative_solver(f, x0, tolerance=1e-8, max_iter=1000):
    """
    Generic iterative solver with convergence checking.

    The "limit" here is when successive values stop changing:
    |x_{n+1} - x_n| < tolerance

    This is exactly like lim(n->inf) x_n = L
    """
    x = x0

    for i in range(max_iter):
        x_new = f(x)

        # Check convergence (limit reached?)
        if abs(x_new - x) < tolerance:
            print(f"Converged after {i+1} iterations")
            return x_new

        x = x_new

    print(f"Warning: Did not converge after {max_iter} iterations")
    return x

# Example: Finding square root of 2 using Newton's method
# x_{n+1} = (x_n + 2/x_n) / 2

def newton_sqrt2(x):
    return (x + 2/x) / 2

result = iterative_solver(newton_sqrt2, x0=1.0)
print(f"sqrt(2) approx {result}")
print(f"Actual: {2**0.5}")`

const oneSidedCode = `# One-sided limits: approaching from different directions
# Important for detecting jump discontinuities

def check_one_sided_limits(f, a, tolerance=1e-6):
    """
    Compare left and right limits.
    If they're different, the two-sided limit doesn't exist.
    """
    # Left limit: approach from smaller values
    left_values = [f(a - 10**(-i)) for i in range(1, 8)]
    left_limit = left_values[-1]  # Most accurate approximation

    # Right limit: approach from larger values
    right_values = [f(a + 10**(-i)) for i in range(1, 8)]
    right_limit = right_values[-1]

    print(f"Left limit (x -> {a}-):  {left_limit:.6f}")
    print(f"Right limit (x -> {a}+): {right_limit:.6f}")

    if abs(left_limit - right_limit) < tolerance:
        print(f"Two-sided limit exists: {left_limit:.6f}")
        return left_limit
    else:
        print("Two-sided limit does NOT exist (jump discontinuity)")
        return None

# Example: Sign function at x = 0
def sign(x):
    if x > 0: return 1
    if x < 0: return -1
    return 0

print("sign(x) at x = 0:")
check_one_sided_limits(sign, 0)`
</script>

<template>
  <TopicPage
    title="Limits"
    description="Understanding what values functions approach - the foundation of calculus"
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is a Limit?" icon="fa-solid fa-arrows-to-dot">
        <p class="mb-4">
          A <strong>limit</strong> answers the question: "What value does f(x) approach as x gets
          closer and closer to some point a?"
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <MathBlock formula="\lim_{x \to a} f(x) = L" display />
          <p class="text-sm text-text-secondary text-center mt-2">
            "The limit of f(x) as x approaches a equals L"
          </p>
        </div>

        <p class="mb-4">
          The key insight is that limits are about <em>approaching</em>, not <em>reaching</em>. We
          care about what happens as x gets arbitrarily close to a, even if f(a) itself is undefined
          or different from L.
        </p>

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-car mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Watching a car approach a stop sign—you can predict where it's going even before it
              gets there. Limits ask: "What's the destination?" not "Has it arrived?"
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              It's like a convergence loop:
              <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                while |f(x) - target| > tolerance
              </code>
              —keep refining until you're close enough.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-magnifying-glass mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Zoom in on a curve near point a. No matter how much you zoom, the y-values cluster
              around L. That clustering is the limit.
            </p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            Why Limits Matter
          </p>
          <p class="text-text-secondary">
            Limits are the foundation of calculus. Both derivatives and integrals are
            <em>defined</em> using limits. Understanding limits unlocks the rest of calculus.
          </p>
        </div>

        <div
          class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Approach ≠ Plug In
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            A limit asks what value f(x) <em>approaches</em>, not what f(a) equals. The function
            might be undefined at a, or f(a) might be different from the limit. For example,
            <MathBlock formula="\frac{x^2 - 1}{x - 1}" />
            is undefined at x=1, but its limit as x→1 is 2. Always think "approaching," never "substituting."
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Limit Explorer" icon="fa-solid fa-compass">
        <p class="mb-4 text-text-secondary">
          Explore different functions and see how limits behave. Select a function, choose an
          approach point, and watch how f(x) approaches (or doesn't approach) a limit value.
        </p>

        <LimitsExplorer sync-url />

        <div class="mt-4 p-4 rounded-lg border border-border">
          <h4 class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Try These Experiments
          </h4>
          <ul class="text-sm text-text-secondary space-y-2 ml-4 list-disc">
            <li>
              <strong>Polynomial (x squared)</strong>: Continuous everywhere - limit always equals
              function value
            </li>
            <li>
              <strong>Rational ((x squared - 1)/(x-1))</strong>: At x=1, function is undefined but
              limit exists (equals 2)
            </li>
            <li>
              <strong>Floor (floor of x)</strong>: Jump at every integer - left and right limits
              differ
            </li>
            <li>
              <strong>Reciprocal (1/x)</strong>: At x=0, function blows up to plus/minus infinity
            </li>
            <li>
              <strong>Oscillating (sin(1/x))</strong>: At x=0, no limit exists due to wild
              oscillation
            </li>
          </ul>
        </div>
      </ContentSection>

      <!-- Numerical Approximation -->
      <ContentSection
        id="numerical"
        title="How Computers Evaluate Limits"
        icon="fa-solid fa-calculator"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          Computers can't do symbolic math like humans. Instead, they
          <em>numerically approximate</em> limits by computing a sequence of values that get closer
          and closer to the limit point.
        </p>

        <CodeExample
          title="Numerical Limit Approximation"
          language="python"
          :code="numericalLimitCode"
          :collapsible="true"
          :default-expanded="true"
        />

        <p class="mt-4 text-text-secondary">
          This is exactly how the explorer above works - it computes f(x) at points increasingly
          close to a and checks if the values converge.
        </p>
      </ContentSection>

      <!-- Epsilon-Delta Definition -->
      <ContentSection
        id="epsilon-delta"
        title="The Epsilon-Delta Definition"
        icon="fa-solid fa-ruler-combined"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          The formal definition of a limit uses two parameters: epsilon for how close f(x) must be
          to L, and delta for how close x must be to a.
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <p class="text-sm text-text-secondary mb-3">
            We say
            <MathBlock formula="\lim_{x \to a} f(x) = L" />
            if:
          </p>
          <MathBlock
            formula="\forall \varepsilon > 0, \exists \delta > 0 : 0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon"
            display
          />
          <p class="text-sm text-text-secondary text-center mt-3">
            "For every epsilon > 0, there exists delta > 0 such that if 0 &lt; |x - a| &lt; delta
            then |f(x) - L| &lt; epsilon"
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div
            class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <h4 class="font-semibold text-blue-700 dark:text-blue-300 mb-2">Epsilon</h4>
            <p class="text-sm text-blue-600 dark:text-blue-400">
              How close f(x) must be to L. The "tolerance" for the output.
            </p>
          </div>
          <div
            class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg"
          >
            <h4 class="font-semibold text-amber-700 dark:text-amber-300 mb-2">Delta</h4>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              How close x must be to a. The "tolerance" for the input.
            </p>
          </div>
        </div>

        <p class="mb-4">
          The definition says: no matter how tight your epsilon requirement, you can always find a
          delta that works. Use the epsilon-delta controls in the explorer above to see this
          relationship in action!
        </p>

        <CodeExample
          title="Finding delta for a Given epsilon"
          language="python"
          :code="epsilonDeltaCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- One-Sided Limits -->
      <ContentSection
        id="one-sided"
        title="One-Sided Limits"
        icon="fa-solid fa-arrows-left-right"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          Sometimes we care about approaching a point from only one direction:
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-orange-600 mb-2">Left Limit (x to a minus)</h4>
            <MathBlock formula="\lim_{x \to a^-} f(x)" />
            <p class="text-sm text-text-secondary mt-2">Approaching from values less than a</p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-green-600 mb-2">Right Limit (x to a plus)</h4>
            <MathBlock formula="\lim_{x \to a^+} f(x)" />
            <p class="text-sm text-text-secondary mt-2">Approaching from values greater than a</p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-exclamation-triangle mr-2" aria-hidden="true" />
            Key Insight
          </p>
          <p class="text-text-secondary">
            The two-sided limit
            <MathBlock formula="\lim_{x \to a} f(x)" />
            exists <strong>only if</strong> both one-sided limits exist and are equal.
          </p>
        </div>

        <CodeExample
          title="Checking One-Sided Limits"
          language="python"
          :code="oneSidedCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Types of Discontinuities -->
      <ContentSection
        id="discontinuities"
        title="Types of Discontinuities"
        icon="fa-solid fa-code-branch"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          When a function isn't continuous at a point, we classify the type of discontinuity:
        </p>

        <div class="space-y-4 mb-4">
          <div
            class="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <h4 class="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
              <i class="fa-solid fa-circle-dot mr-2" aria-hidden="true" />
              Removable Discontinuity
            </h4>
            <p class="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
              The limit exists, but f(a) is either undefined or different from the limit.
            </p>
            <p class="text-xs text-yellow-600 dark:text-yellow-400">
              Example: f(x) = (x squared - 1)/(x-1) at x=1. Limit is 2, but f(1) is undefined.
            </p>
          </div>

          <div
            class="p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg"
          >
            <h4 class="font-semibold text-orange-700 dark:text-orange-300 mb-2">
              <i class="fa-solid fa-stairs mr-2" aria-hidden="true" />
              Jump Discontinuity
            </h4>
            <p class="text-sm text-orange-600 dark:text-orange-400 mb-2">
              Both one-sided limits exist but are different.
            </p>
            <p class="text-xs text-orange-600 dark:text-orange-400">
              Example: Floor function floor(x) at integers. Left limit not equal to right limit.
            </p>
          </div>

          <div
            class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <h4 class="font-semibold text-red-700 dark:text-red-300 mb-2">
              <i class="fa-solid fa-arrows-up-down mr-2" aria-hidden="true" />
              Infinite Discontinuity
            </h4>
            <p class="text-sm text-red-600 dark:text-red-400 mb-2">
              The function approaches plus/minus infinity (vertical asymptote).
            </p>
            <p class="text-xs text-red-600 dark:text-red-400">
              Example: f(x) = 1/x at x=0. Function blows up to infinity.
            </p>
          </div>

          <div
            class="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg"
          >
            <h4 class="font-semibold text-purple-700 dark:text-purple-300 mb-2">
              <i class="fa-solid fa-wave-square mr-2" aria-hidden="true" />
              Oscillating Discontinuity
            </h4>
            <p class="text-sm text-purple-600 dark:text-purple-400 mb-2">
              The function oscillates infinitely without settling on a limit.
            </p>
            <p class="text-xs text-purple-600 dark:text-purple-400">
              Example: f(x) = sin(1/x) at x=0. Oscillates faster and faster.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Famous Limits -->
      <ContentSection
        id="famous"
        title="Famous Limits"
        icon="fa-solid fa-star"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          These limits appear throughout mathematics and have elegant, memorable results:
        </p>

        <div class="space-y-4 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-primary">The Sine Limit</h4>
              <span class="text-xs text-text-muted">Fundamental in calculus</span>
            </div>
            <MathBlock formula="\lim_{x \to 0} \frac{\sin x}{x} = 1" display />
            <p class="text-sm text-text-secondary mt-2">
              This limit is used to prove that the derivative of sin(x) is cos(x).
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-primary">The Definition of e</h4>
              <span class="text-xs text-text-muted">Natural exponential base</span>
            </div>
            <MathBlock
              formula="\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e \approx 2.71828"
              display
            />
            <p class="text-sm text-text-secondary mt-2">
              This is how Euler's number e is defined - as a limit!
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-primary">Exponential Growth Rate</h4>
              <span class="text-xs text-text-muted">Why e is special</span>
            </div>
            <MathBlock formula="\lim_{h \to 0} \frac{e^h - 1}{h} = 1" display />
            <p class="text-sm text-text-secondary mt-2">
              The only function whose derivative equals itself: d/dx(e to the x) = e to the x.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Programming Applications -->
      <ContentSection
        id="applications"
        title="Applications in Programming"
        icon="fa-solid fa-laptop-code"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          Limits aren't just abstract math - they appear constantly in practical programming:
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-repeat mr-2" aria-hidden="true" />
              Convergence Checks
            </h4>
            <p class="text-sm text-text-secondary">
              Iterative algorithms stop when values stop changing (
              <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                |x_new - x| &lt; tol
              </code>
              )
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-brain mr-2" aria-hidden="true" />
              Gradient Descent
            </h4>
            <p class="text-sm text-text-secondary">
              ML optimization uses derivatives (limits!) to find minimum loss
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-purple-600 mb-2">
              <i class="fa-solid fa-calculator mr-2" aria-hidden="true" />
              Numerical Methods
            </h4>
            <p class="text-sm text-text-secondary">
              Root finding, integration, solving ODEs all use limit-like approximations
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
              Error Bounds
            </h4>
            <p class="text-sm text-text-secondary">
              Tolerances and precision are fundamentally about limits and approximation
            </p>
          </div>
        </div>

        <CodeExample
          title="Limits in Action: Iterative Convergence"
          language="python"
          :code="convergenceCode"
          :collapsible="true"
          :default-expanded="true"
        />
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
