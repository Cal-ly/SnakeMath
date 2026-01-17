# Increment 13D: Content Pages

**Goal**: Create the Calculus index page and comprehensive Limits content page with navigation integration.

**Prerequisites**: Increments 13A-13C complete (utilities, widget, visualization)

---

## Files to Create/Modify

### 1. Create Calculus Index View: `src/views/calculus/CalculusIndexView.vue`

```vue
<script setup lang="ts">
/**
 * CalculusIndexView - Landing page for the Calculus section
 *
 * Introduces calculus concepts and links to topics:
 * - Limits (Phase 13)
 * - Derivatives (Phase 14 - future)
 * - Integration (future)
 */

import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'

// ============================================================================
// Data
// ============================================================================

const topics = [
  {
    title: 'Limits',
    path: '/calculus/limits',
    description: 'The foundation of calculus - understanding approaching values',
    icon: 'fa-solid fa-arrows-to-dot',
    available: true,
  },
  {
    title: 'Derivatives',
    path: '/calculus/derivatives',
    description: 'Rates of change and slopes of curves',
    icon: 'fa-solid fa-chart-line',
    available: false,
  },
  {
    title: 'Integration',
    path: '/calculus/integration',
    description: 'Accumulation and area under curves',
    icon: 'fa-solid fa-chart-area',
    available: false,
  },
]

const relatedTopics = [
  {
    title: 'Functions',
    path: '/algebra/functions',
    description: 'Foundation for understanding calculus',
  },
  {
    title: 'Trigonometry',
    path: '/geometry/trigonometry',
    description: 'Trig functions appear throughout calculus',
  },
  {
    title: 'Exponentials',
    path: '/algebra/exponentials',
    description: 'e and exponential growth in calculus',
  },
]

// Python code example
const gradientDescentCode = `# Calculus in action: Gradient Descent
# Used in machine learning to find optimal parameters

def gradient_descent(f, df, x0, learning_rate=0.01, iterations=100):
    """
    Find minimum of function f using its derivative df.

    The derivative tells us which direction is "downhill"
    - If df(x) > 0: function increasing, move left
    - If df(x) < 0: function decreasing, move right
    - If df(x) ≈ 0: at minimum (or maximum)
    """
    x = x0
    history = [x]

    for _ in range(iterations):
        gradient = df(x)      # Calculate slope at current point
        x = x - learning_rate * gradient  # Step opposite to slope
        history.append(x)

    return x, history

# Example: Find minimum of f(x) = x² - 4x + 5
# Derivative: f'(x) = 2x - 4
f = lambda x: x**2 - 4*x + 5
df = lambda x: 2*x - 4

minimum, path = gradient_descent(f, df, x0=0)
print(f"Minimum at x = {minimum:.4f}")  # Should be ~2.0
print(f"f(minimum) = {f(minimum):.4f}")  # Should be 1.0`
</script>

<template>
  <TopicPage
    title="Calculus"
    description="The mathematics of change - derivatives, integrals, and limits"
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is Calculus?" icon="fa-solid fa-infinity">
        <p class="mb-4">
          Calculus is the mathematics of <strong>change</strong> and <strong>accumulation</strong>.
          It provides tools to analyze how things change (derivatives) and how to add up infinitely
          many small pieces (integrals).
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-6">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
              Differential Calculus
            </h4>
            <p class="text-sm text-text-secondary mb-2">
              Study of rates of change and slopes
            </p>
            <MathBlock formula="\frac{df}{dx} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" />
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-chart-area mr-2" aria-hidden="true" />
              Integral Calculus
            </h4>
            <p class="text-sm text-text-secondary mb-2">
              Study of accumulation and areas
            </p>
            <MathBlock formula="\int_a^b f(x) \, dx = \lim_{n \to \infty} \sum_{i=1}^n f(x_i) \Delta x" />
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            The Fundamental Theorem of Calculus
          </p>
          <p class="text-text-secondary">
            Derivatives and integrals are inverse operations - like multiplication and division.
            This connection is why calculus is so powerful for solving real-world problems.
          </p>
        </div>
      </ContentSection>

      <!-- Why Programmers Need Calculus -->
      <ContentSection
        id="programming"
        title="Why Programmers Need Calculus"
        icon="fa-solid fa-laptop-code"
      >
        <p class="mb-4">
          If you're wondering "when will I ever use this?" - the answer is: constantly,
          if you work in these areas:
        </p>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h5 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-robot mr-2" aria-hidden="true" />
              Machine Learning
            </h5>
            <p class="text-sm text-text-secondary">
              Gradient descent, backpropagation, and optimization all use derivatives
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h5 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-gamepad mr-2" aria-hidden="true" />
              Game Development
            </h5>
            <p class="text-sm text-text-secondary">
              Physics simulations, smooth animations, collision detection
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h5 class="font-semibold text-green-600 mb-2">
              <i class="fa-solid fa-chart-pie mr-2" aria-hidden="true" />
              Data Science
            </h5>
            <p class="text-sm text-text-secondary">
              Probability distributions, statistical analysis, modeling
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h5 class="font-semibold text-purple-600 mb-2">
              <i class="fa-solid fa-bezier-curve mr-2" aria-hidden="true" />
              Computer Graphics
            </h5>
            <p class="text-sm text-text-secondary">
              Bezier curves, surface rendering, lighting calculations
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h5 class="font-semibold text-red-600 mb-2">
              <i class="fa-solid fa-signal mr-2" aria-hidden="true" />
              Signal Processing
            </h5>
            <p class="text-sm text-text-secondary">
              Audio processing, image filtering, Fourier transforms
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h5 class="font-semibold text-cyan-600 mb-2">
              <i class="fa-solid fa-microchip mr-2" aria-hidden="true" />
              Numerical Methods
            </h5>
            <p class="text-sm text-text-secondary">
              Solving equations, approximations, scientific computing
            </p>
          </div>
        </div>

        <CodeExample
          title="Gradient Descent: Calculus in Machine Learning"
          language="python"
          :code="gradientDescentCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- The Foundation: Limits -->
      <ContentSection
        id="limits-preview"
        title="The Foundation: Limits"
        icon="fa-solid fa-arrows-to-dot"
      >
        <p class="mb-4">
          Before we can define derivatives or integrals, we need <strong>limits</strong>.
          Limits answer the question: "What value does a function approach?"
        </p>

        <div class="p-4 bg-surface-alt rounded-lg border border-border mb-4">
          <MathBlock
            formula="\lim_{x \to a} f(x) = L"
            display
          />
          <p class="text-sm text-text-secondary text-center mt-2">
            "The limit of f(x) as x approaches a equals L"
          </p>
        </div>

        <p class="mb-4">
          Think of it like this: you can get as close to a point as you want, without
          actually reaching it. What happens to the function value?
        </p>

        <div class="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <p class="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
            <i class="fa-solid fa-code mr-2" aria-hidden="true" />
            Programming Intuition
          </p>
          <p class="text-emerald-600 dark:text-emerald-400 text-sm">
            Limits are like tolerance-based convergence checks:
            <code class="bg-emerald-100 dark:bg-emerald-800 px-1 rounded">
              while abs(x - target) &gt; epsilon: approach()
            </code>
          </p>
        </div>
      </ContentSection>

      <!-- Topics Grid -->
      <ContentSection id="topics" title="Topics" icon="fa-solid fa-list">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <router-link
            v-for="topic in topics"
            :key="topic.path"
            :to="topic.available ? topic.path : ''"
            class="block p-4 rounded-lg border transition-all"
            :class="
              topic.available
                ? 'bg-surface-alt border-border hover:border-primary hover:shadow-md cursor-pointer'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
            "
            :aria-disabled="!topic.available"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="
                  topic.available
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                "
              >
                <i :class="topic.icon" aria-hidden="true" />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold mb-1">
                  {{ topic.title }}
                  <span
                    v-if="!topic.available"
                    class="ml-2 text-xs font-normal text-text-muted"
                  >
                    (Coming Soon)
                  </span>
                </h4>
                <p class="text-sm text-text-secondary">
                  {{ topic.description }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
```

### 2. Create Limits View: `src/views/calculus/LimitsView.vue`

```vue
<script setup lang="ts">
/**
 * LimitsView - Comprehensive content page for mathematical limits
 *
 * Covers:
 * - Intuitive understanding of limits
 * - Interactive explorer widget
 * - ε-δ definition
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
    title: 'Exponentials',
    path: '/algebra/exponentials',
    description: 'The number e is defined as a limit',
  },
  {
    title: 'Trigonometry',
    path: '/geometry/trigonometry',
    description: 'sin(x)/x limit and L\'Hôpital applications',
  },
  {
    title: 'Functions',
    path: '/algebra/functions',
    description: 'Understanding function behavior',
  },
  {
    title: 'Derivatives',
    path: '/calculus/derivatives',
    description: 'Derivatives are defined using limits (coming soon)',
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

# Example: lim(x→0) sin(x)/x = 1
import math

def sinc(x):
    if x == 0:
        return float('nan')  # Undefined at 0
    return math.sin(x) / x

print("Approaching 0 from both sides:")
for side, x, fx, h in numerical_limit(sinc, 0, 'both', 5):
    print(f"  {side:5} x={x:12.9f}  f(x)={fx:.10f}")`

const epsilonDeltaCode = `# The ε-δ definition in code
# "For every ε > 0, there exists δ > 0 such that
#  if 0 < |x - a| < δ then |f(x) - L| < ε"

def find_delta_for_epsilon(f, a, L, epsilon, max_delta=1.0):
    """
    Find a delta that works for the given epsilon.

    This demonstrates the ε-δ definition:
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

# Example: f(x) = x², a = 2, L = 4
f = lambda x: x**2

for eps in [1.0, 0.5, 0.1, 0.01]:
    delta = find_delta_for_epsilon(f, a=2, L=4, epsilon=eps)
    print(f"ε = {eps:.2f} → δ = {delta:.4f}")`

const convergenceCode = `# Limits in practice: Convergence checking
# Many algorithms use limit-like convergence criteria

def iterative_solver(f, x0, tolerance=1e-8, max_iter=1000):
    """
    Generic iterative solver with convergence checking.

    The "limit" here is when successive values stop changing:
    |x_{n+1} - x_n| < tolerance

    This is exactly like lim(n→∞) x_n = L
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
print(f"√2 ≈ {result}")
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

    print(f"Left limit (x → {a}⁻):  {left_limit:.6f}")
    print(f"Right limit (x → {a}⁺): {right_limit:.6f}")

    if abs(left_limit - right_limit) < tolerance:
        print(f"✓ Two-sided limit exists: {left_limit:.6f}")
        return left_limit
    else:
        print("✗ Two-sided limit does NOT exist (jump discontinuity)")
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
          A <strong>limit</strong> answers the question: "What value does f(x) approach
          as x gets closer and closer to some point a?"
        </p>

        <div class="p-4 bg-surface-alt rounded-lg border border-border mb-4">
          <MathBlock
            formula="\lim_{x \to a} f(x) = L"
            display
          />
          <p class="text-sm text-text-secondary text-center mt-2">
            "The limit of f(x) as x approaches a equals L"
          </p>
        </div>

        <p class="mb-4">
          The key insight is that limits are about <em>approaching</em>, not <em>reaching</em>.
          We care about what happens as x gets arbitrarily close to a, even if f(a) itself
          is undefined or different from L.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">Mathematical Intuition</h4>
            <p class="text-sm text-text-secondary">
              As x gets closer to a, f(x) gets closer to L. We can make f(x) as close to L
              as we want by making x close enough to a.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">Programming Intuition</h4>
            <p class="text-sm text-text-secondary">
              It's like a convergence check:
              <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                while |f(x) - target| &gt; tolerance
              </code>
            </p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            Why Limits Matter
          </p>
          <p class="text-text-secondary">
            Limits are the foundation of calculus. Both derivatives and integrals are
            <em>defined</em> using limits. Understanding limits unlocks the rest of calculus.
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection
        id="explorer"
        title="Interactive Limit Explorer"
        icon="fa-solid fa-compass"
      >
        <p class="mb-4 text-text-secondary">
          Explore different functions and see how limits behave. Select a function,
          choose an approach point, and watch how f(x) approaches (or doesn't approach) a limit value.
        </p>

        <LimitsExplorer sync-url />

        <div class="mt-4 p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Try These Experiments
          </h4>
          <ul class="text-sm text-text-secondary space-y-2 ml-4 list-disc">
            <li>
              <strong>Polynomial (x²)</strong>: Continuous everywhere - limit always equals
              function value
            </li>
            <li>
              <strong>Rational ((x²-1)/(x-1))</strong>: At x=1, function is undefined but
              limit exists (equals 2)
            </li>
            <li>
              <strong>Floor (⌊x⌋)</strong>: Jump at every integer - left and right limits differ
            </li>
            <li>
              <strong>Reciprocal (1/x)</strong>: At x=0, function blows up to ±∞
            </li>
            <li>
              <strong>Oscillating (sin(1/x))</strong>: At x=0, no limit exists due to wild oscillation
            </li>
          </ul>
        </div>
      </ContentSection>

      <!-- Numerical Approximation -->
      <ContentSection
        id="numerical"
        title="How Computers Evaluate Limits"
        icon="fa-solid fa-calculator"
        :default-expanded="false"
      >
        <p class="mb-4">
          Computers can't do symbolic math like humans. Instead, they <em>numerically
          approximate</em> limits by computing a sequence of values that get closer and
          closer to the limit point.
        </p>

        <CodeExample
          title="Numerical Limit Approximation"
          language="python"
          :code="numericalLimitCode"
          :collapsible="true"
          :default-expanded="true"
        />

        <p class="mt-4 text-text-secondary">
          This is exactly how the explorer above works - it computes f(x) at points
          increasingly close to a and checks if the values converge.
        </p>
      </ContentSection>

      <!-- ε-δ Definition -->
      <ContentSection
        id="epsilon-delta"
        title="The ε-δ Definition"
        icon="fa-solid fa-ruler-combined"
        :default-expanded="false"
      >
        <p class="mb-4">
          The formal definition of a limit uses two parameters: ε (epsilon) for how close
          f(x) must be to L, and δ (delta) for how close x must be to a.
        </p>

        <div class="p-4 bg-surface-alt rounded-lg border border-border mb-4">
          <p class="text-sm text-text-secondary mb-3">
            We say <MathBlock formula="\lim_{x \to a} f(x) = L" /> if:
          </p>
          <MathBlock
            formula="\forall \varepsilon > 0, \exists \delta > 0 : 0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon"
            display
          />
          <p class="text-sm text-text-secondary text-center mt-3">
            "For every ε > 0, there exists δ > 0 such that if 0 < |x - a| < δ then |f(x) - L| < ε"
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 class="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              ε (Epsilon)
            </h4>
            <p class="text-sm text-blue-600 dark:text-blue-400">
              How close f(x) must be to L. The "tolerance" for the output.
            </p>
          </div>
          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h4 class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              δ (Delta)
            </h4>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              How close x must be to a. The "tolerance" for the input.
            </p>
          </div>
        </div>

        <p class="mb-4">
          The definition says: no matter how tight your epsilon requirement, you can always
          find a delta that works. Use the ε-δ controls in the explorer above to see this
          relationship in action!
        </p>

        <CodeExample
          title="Finding δ for a Given ε"
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
        :default-expanded="false"
      >
        <p class="mb-4">
          Sometimes we care about approaching a point from only one direction:
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-orange-600 mb-2">
              Left Limit (x → a⁻)
            </h4>
            <MathBlock formula="\lim_{x \to a^-} f(x)" />
            <p class="text-sm text-text-secondary mt-2">
              Approaching from values less than a
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-green-600 mb-2">
              Right Limit (x → a⁺)
            </h4>
            <MathBlock formula="\lim_{x \to a^+} f(x)" />
            <p class="text-sm text-text-secondary mt-2">
              Approaching from values greater than a
            </p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-exclamation-triangle mr-2" aria-hidden="true" />
            Key Insight
          </p>
          <p class="text-text-secondary">
            The two-sided limit <MathBlock formula="\lim_{x \to a} f(x)" /> exists
            <strong>only if</strong> both one-sided limits exist and are equal.
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
        :default-expanded="false"
      >
        <p class="mb-4">
          When a function isn't continuous at a point, we classify the type of discontinuity:
        </p>

        <div class="space-y-4 mb-4">
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 class="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
              <i class="fa-solid fa-circle-dot mr-2" aria-hidden="true" />
              Removable Discontinuity
            </h4>
            <p class="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
              The limit exists, but f(a) is either undefined or different from the limit.
            </p>
            <p class="text-xs text-yellow-600 dark:text-yellow-400">
              Example: f(x) = (x²-1)/(x-1) at x=1. Limit is 2, but f(1) is undefined.
            </p>
          </div>

          <div class="p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg">
            <h4 class="font-semibold text-orange-700 dark:text-orange-300 mb-2">
              <i class="fa-solid fa-stairs mr-2" aria-hidden="true" />
              Jump Discontinuity
            </h4>
            <p class="text-sm text-orange-600 dark:text-orange-400 mb-2">
              Both one-sided limits exist but are different.
            </p>
            <p class="text-xs text-orange-600 dark:text-orange-400">
              Example: Floor function ⌊x⌋ at integers. Left limit ≠ right limit.
            </p>
          </div>

          <div class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 class="font-semibold text-red-700 dark:text-red-300 mb-2">
              <i class="fa-solid fa-arrows-up-down mr-2" aria-hidden="true" />
              Infinite Discontinuity
            </h4>
            <p class="text-sm text-red-600 dark:text-red-400 mb-2">
              The function approaches ±∞ (vertical asymptote).
            </p>
            <p class="text-xs text-red-600 dark:text-red-400">
              Example: f(x) = 1/x at x=0. Function blows up to infinity.
            </p>
          </div>

          <div class="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg">
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
        :default-expanded="false"
      >
        <p class="mb-4">
          These limits appear throughout mathematics and have elegant, memorable results:
        </p>

        <div class="space-y-4 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-primary">The Sine Limit</h4>
              <span class="text-xs text-text-muted">Fundamental in calculus</span>
            </div>
            <MathBlock formula="\lim_{x \to 0} \frac{\sin x}{x} = 1" display />
            <p class="text-sm text-text-secondary mt-2">
              This limit is used to prove that the derivative of sin(x) is cos(x).
            </p>
          </div>

          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-primary">The Definition of e</h4>
              <span class="text-xs text-text-muted">Natural exponential base</span>
            </div>
            <MathBlock formula="\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e \approx 2.71828" display />
            <p class="text-sm text-text-secondary mt-2">
              This is how Euler's number e is defined - as a limit!
            </p>
          </div>

          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-primary">Exponential Growth Rate</h4>
              <span class="text-xs text-text-muted">Why e is special</span>
            </div>
            <MathBlock formula="\lim_{h \to 0} \frac{e^h - 1}{h} = 1" display />
            <p class="text-sm text-text-secondary mt-2">
              The only function whose derivative equals itself: d/dx(eˣ) = eˣ.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Programming Applications -->
      <ContentSection
        id="applications"
        title="Applications in Programming"
        icon="fa-solid fa-laptop-code"
      >
        <p class="mb-4">
          Limits aren't just abstract math - they appear constantly in practical programming:
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-repeat mr-2" aria-hidden="true" />
              Convergence Checks
            </h4>
            <p class="text-sm text-text-secondary">
              Iterative algorithms stop when values stop changing
              (<code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">|x_new - x| < tol</code>)
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-brain mr-2" aria-hidden="true" />
              Gradient Descent
            </h4>
            <p class="text-sm text-text-secondary">
              ML optimization uses derivatives (limits!) to find minimum loss
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-purple-600 mb-2">
              <i class="fa-solid fa-calculator mr-2" aria-hidden="true" />
              Numerical Methods
            </h4>
            <p class="text-sm text-text-secondary">
              Root finding, integration, solving ODEs all use limit-like approximations
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
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
```

### 3. Update Router: `src/router/index.ts`

Add the new routes:

```typescript
// Add these imports at the top (with existing imports)
// No new imports needed - using lazy loading

// Add these routes to the routes array, after existing routes:

// Calculus routes
{
  path: '/calculus',
  name: 'calculus',
  component: () => import('@/views/calculus/CalculusIndexView.vue'),
},
{
  path: '/calculus/limits',
  name: 'calculus-limits',
  component: () => import('@/views/calculus/LimitsView.vue'),
},
```

### 4. Update Navigation Data: `src/data/navigation.ts`

Add the calculus section to the navigation:

```typescript
// Add to the sections array or navigation data structure
{
  id: 'calculus',
  title: 'Calculus',
  description: 'The mathematics of change and accumulation',
  icon: 'fa-solid fa-infinity',
  path: '/calculus',
  topics: [
    {
      id: 'limits',
      title: 'Limits',
      description: 'Understanding approaching values',
      path: '/calculus/limits',
      faIcon: 'fa-solid fa-arrows-to-dot',
    },
  ],
},
```

### 5. Create Views Directory (if needed)

Ensure the directory exists:

```bash
mkdir -p src/views/calculus
```

---

## Success Criteria

- [ ] `src/views/calculus/CalculusIndexView.vue` created
- [ ] `src/views/calculus/LimitsView.vue` created
- [ ] Routes added to `src/router/index.ts`
- [ ] Navigation updated in `src/data/navigation.ts`
- [ ] `/calculus` shows section landing page
- [ ] `/calculus/limits` shows comprehensive limits content
- [ ] LimitsExplorer widget embedded with `sync-url`
- [ ] All code examples render with syntax highlighting
- [ ] All math blocks render with KaTeX
- [ ] Related topics links work
- [ ] Navigation sidebar shows Calculus section
- [ ] Breadcrumbs work correctly
- [ ] Content sections collapse/expand properly
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

---

## Commands to Run

```bash
# Start dev server and test navigation
npm run dev

# Verify types
npm run type-check

# Check linting
npm run lint

# Build verification
npm run build
```

---

## Implementation Notes

1. **Content Structure**: Follows established pattern from other views:
   - TopicPage wrapper
   - ContentSection components with icons
   - MathBlock for formulas
   - CodeExample for Python code
   - RelatedTopics at the bottom

2. **Widget Integration**: The LimitsExplorer is embedded with `sync-url` so users can share specific configurations via URL.

3. **Collapsible Sections**: Advanced topics (ε-δ definition, discontinuities) are collapsed by default to not overwhelm beginners.

4. **Code Examples**: All Python examples are practical and runnable. They demonstrate how limits concepts apply to real programming.

5. **Coming Soon**: The calculus index shows Derivatives and Integration as "Coming Soon" - these will be implemented in future phases.

6. **Programmer Focus**: Every concept connects back to programming (convergence checks, tolerances, gradient descent).

---

## Archive Content Reference

Refer to these archive files for content inspiration:

- `archive/snake-math/docs/calculus/limits/basics.md` - Basic limit definitions
- `archive/snake-math/docs/calculus/limits/continuity.md` - Continuity types
- `archive/snake-math/docs/calculus/limits/methods.md` - Evaluation techniques
- `archive/snake-math/docs/calculus/limits/applications.md` - Real-world uses

Transform the content to be more programmer-focused and use Vue components instead of Markdown.
