<script setup lang="ts">
/**
 * IntegrationView - Content page for integral calculus
 *
 * Covers:
 * - Intuitive understanding of integrals as area under curves
 * - Riemann sums as programmer's approach
 * - Interactive IntegrationExplorer widget
 * - Fundamental Theorem of Calculus
 * - Common pitfalls
 * - Python implementations (scipy, numpy)
 *
 * D-126: Focus on geometric interpretation over symbolic rules
 */

import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import { IntegrationExplorer } from '@/components/widgets'

// ============================================================================
// Data
// ============================================================================

const relatedTopics = [
  {
    title: 'Limits',
    path: '/calculus/limits',
    description: 'Integrals are defined as limits of Riemann sums',
  },
  {
    title: 'Derivatives',
    path: '/calculus/derivatives',
    description: 'Integration is the inverse of differentiation',
  },
  {
    title: 'Calculus Overview',
    path: '/calculus',
    description: 'Return to the calculus section',
  },
  {
    title: 'Summation',
    path: '/algebra/summation',
    description: 'Integrals are continuous versions of discrete sums',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const riemannSumCode = `# Riemann Sum: Integration as a For Loop
# This is exactly what numerical integration does under the hood

def riemann_sum(f, a, b, n, method='midpoint'):
    """
    Approximate ∫[a,b] f(x) dx using n rectangles.

    This is integration demystified:
    - Chop the interval [a,b] into n pieces
    - Compute f(x) at sample points
    - Multiply by width and sum

    It's just sum(f(x_i) * dx for each interval)!
    """
    dx = (b - a) / n  # Width of each rectangle
    total = 0

    for i in range(n):
        if method == 'left':
            x = a + i * dx           # Left endpoint
        elif method == 'right':
            x = a + (i + 1) * dx     # Right endpoint
        elif method == 'midpoint':
            x = a + (i + 0.5) * dx   # Midpoint (most accurate)
        else:
            x = a + (i + 0.5) * dx

        total += f(x) * dx

    return total

# Example: ∫[0,2] x² dx = 8/3 ≈ 2.667
f = lambda x: x**2

print("Riemann sum approximations of ∫[0,2] x² dx:")
for n in [4, 10, 100, 1000]:
    approx = riemann_sum(f, 0, 2, n)
    error = abs(approx - 8/3)
    print(f"n={n:4d}: {approx:.6f}  (error: {error:.6f})")`

const trapezoidalCode = `# Trapezoidal Rule: Better Than Rectangles
# Uses trapezoids instead of rectangles for O(1/n²) convergence

def trapezoidal_rule(f, a, b, n):
    """
    Approximate ∫[a,b] f(x) dx using trapezoids.

    Each trapezoid has area = (1/2)(y_left + y_right) * width

    This converges faster than left/right Riemann sums
    because errors above and below cancel out.
    """
    dx = (b - a) / n
    total = 0.5 * (f(a) + f(b))  # Half of endpoints

    for i in range(1, n):
        x = a + i * dx
        total += f(x)  # Interior points count fully

    return total * dx

# Compare convergence rates
import math

f = lambda x: math.sin(x)
exact = 2  # ∫[0,π] sin(x) dx = 2

print("Comparison: Midpoint vs Trapezoidal")
print("n       Midpoint Error    Trapezoidal Error")
for n in [10, 20, 40, 80]:
    mid_err = abs(riemann_sum(f, 0, math.pi, n, 'midpoint') - exact)
    trap_err = abs(trapezoidal_rule(f, 0, math.pi, n) - exact)
    print(f"{n:3d}     {mid_err:.8f}       {trap_err:.8f}")

# Both are O(1/n²) - doubling n reduces error by ~4x`

const scipyCode = `# SciPy: Production-Ready Numerical Integration
# Don't reinvent the wheel - use scipy.integrate!

from scipy import integrate
import numpy as np

# ============================================
# Single integrals with quad()
# ============================================

# Basic usage: ∫[0,2] x² dx
result, error = integrate.quad(lambda x: x**2, 0, 2)
print(f"∫[0,2] x² dx = {result:.6f} (error estimate: {error:.2e})")
# Output: 2.666667 (exact is 8/3)

# With numpy functions
result, _ = integrate.quad(np.sin, 0, np.pi)
print(f"∫[0,π] sin(x) dx = {result:.6f}")
# Output: 2.000000

# Infinite bounds work too!
result, _ = integrate.quad(lambda x: np.exp(-x**2), -np.inf, np.inf)
print(f"∫[-∞,∞] e^(-x²) dx = {result:.6f}")
# Output: 1.772454 (= √π)

# ============================================
# numpy.trapz for discrete data
# ============================================

# When you have data points, not a function
x = np.linspace(0, 2, 101)  # 101 points from 0 to 2
y = x**2                      # y = x²

# Trapezoidal integration of data
area = np.trapz(y, x)
print(f"np.trapz result: {area:.6f}")
# Output: 2.666800 (close to 8/3)

# ============================================
# Simpson's rule with scipy
# ============================================

from scipy.integrate import simpson

area = simpson(y, x=x)
print(f"Simpson's rule: {area:.6f}")
# Output: 2.666667 (even more accurate)`

const signedAreaCode = `# Signed Area: Negative Contributions Matter!
# When f(x) < 0, that area SUBTRACTS from the total

import numpy as np
from scipy import integrate

# f(x) = x³ - x crosses the x-axis at x = -1, 0, 1
f = lambda x: x**3 - x

# Let's see the signed areas in different regions
print("Signed area analysis for f(x) = x³ - x:")
print()

# Region [-1, 0]: f(x) > 0 (positive area)
area1, _ = integrate.quad(f, -1, 0)
print(f"∫[-1,0] = {area1:.4f}  (positive, above x-axis)")

# Region [0, 1]: f(x) < 0 (negative area)
area2, _ = integrate.quad(f, 0, 1)
print(f"∫[0,1]  = {area2:.4f}  (negative, below x-axis)")

# Region [1, 2]: f(x) > 0 (positive area)
area3, _ = integrate.quad(f, 1, 2)
print(f"∫[1,2]  = {area3:.4f}  (positive, above x-axis)")

# Total from -1 to 2
total, _ = integrate.quad(f, -1, 2)
print()
print(f"Total ∫[-1,2] = {total:.4f}")
print(f"Sum of parts  = {area1 + area2 + area3:.4f}")

# The "geometric" (unsigned) area would be different:
unsigned_area = abs(area1) + abs(area2) + abs(area3)
print(f"Unsigned area = {unsigned_area:.4f}")`
</script>

<template>
  <TopicPage
    title="Integration"
    description="Area under curves - the inverse of differentiation and the foundation of accumulation"
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is Integration?" icon="fa-solid fa-chart-area">
        <p class="mb-4">
          <strong>Integration</strong> is the process of finding the area under a curve. Where
          derivatives tell you how fast something is changing, integrals tell you
          <em>how much has accumulated</em>.
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <MathBlock
            formula="\int_a^b f(x) \, dx = \lim_{n \to \infty} \sum_{i=1}^n f(x_i) \Delta x"
            display
          />
          <p class="text-sm text-text-secondary text-center mt-2">
            "The integral from a to b equals the limit of Riemann sums as n approaches infinity"
          </p>
        </div>

        <p class="mb-4">
          The key insight: integration is just <strong>summation with infinitely small steps</strong>.
          That scary-looking integral sign (∫) is really just an elongated "S" for "Sum"!
        </p>

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-gas-pump mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Your car's odometer integrates speed over time. If you drive 60 mph for 2 hours,
              you've traveled 120 miles — that's ∫(speed)dt = distance.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              It's a for loop with accumulation:
              <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                total += f(x) * dx
              </code>
              — just run it with infinitely many infinitely small steps.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-chart-area mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Draw rectangles under a curve and add up their areas. Make the rectangles thinner
              and thinner — the limit of that sum is the integral.
            </p>
          </div>
        </div>

        <!-- Pitfall callout -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Forgetting Signed Area
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            When f(x) &lt; 0 (below the x-axis), that area is <strong>negative</strong>!
            The integral ∫₋₁¹ x dx = 0 because the positive and negative areas cancel.
            If you want total geometric area, use ∫|f(x)|dx instead.
          </p>
        </div>
      </ContentSection>

      <!-- Signed Area Explanation -->
      <ContentSection
        id="signed-area"
        title="Understanding Signed Area"
        icon="fa-solid fa-plus-minus"
      >
        <p class="mb-4">
          The integral computes <strong>signed area</strong>: regions above the x-axis contribute
          positive area, while regions below contribute negative area. This is mathematically
          correct and has important applications in physics and probability.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 class="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              <i class="fa-solid fa-arrow-up mr-2" aria-hidden="true" />
              Positive Area (f(x) &gt; 0)
            </h4>
            <p class="text-sm text-blue-600 dark:text-blue-400">
              When the curve is above the x-axis, the rectangles have positive height,
              contributing positive area to the sum.
            </p>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 class="font-semibold text-red-700 dark:text-red-300 mb-2">
              <i class="fa-solid fa-arrow-down mr-2" aria-hidden="true" />
              Negative Area (f(x) &lt; 0)
            </h4>
            <p class="text-sm text-red-600 dark:text-red-400">
              When the curve is below the x-axis, the rectangles have negative height,
              subtracting from the total.
            </p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Try It!
          </p>
          <p class="text-text-secondary">
            In the explorer below, select "Cubic (signed area)" to see a function that crosses
            the x-axis. Notice how blue and red regions show positive and negative contributions.
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Integration Explorer" icon="fa-solid fa-compass">
        <p class="mb-4 text-text-secondary">
          Explore different functions and watch how Riemann sums approximate the integral.
          Increase n to see the approximation converge to the exact value!
        </p>

        <IntegrationExplorer sync-url />

        <div class="mt-4 p-4 rounded-lg border border-border">
          <h4 class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-flask mr-2" aria-hidden="true" />
            Try These Experiments
          </h4>
          <ul class="text-sm text-text-secondary space-y-2 ml-4 list-disc">
            <li>
              <strong>Quadratic (x²)</strong>: Start with n=4, then increase to n=100.
              Watch the error drop from ~10% to &lt;0.1%!
            </li>
            <li>
              <strong>Constant (3)</strong>: The simplest integral — area is just base × height.
              All methods give the exact answer.
            </li>
            <li>
              <strong>Cubic (signed area)</strong>: See positive (blue) and negative (red)
              regions. The integral is the net sum.
            </li>
            <li>
              <strong>Semicircle</strong>: Area = π/2. This is half of a unit circle's area (πr²/2)!
            </li>
            <li>
              <strong>Compare methods</strong>: Try Left, Right, and Midpoint with n=10.
              Notice how Midpoint is more accurate (O(1/n²) vs O(1/n)).
            </li>
            <li>
              <strong>Use the animation</strong>: Expand "Convergence Animation" and click Play
              to watch n increase from 4 to 200 and see the error shrink.
            </li>
          </ul>
        </div>
      </ContentSection>

      <!-- Riemann Sums -->
      <ContentSection id="riemann-sums" title="Riemann Sums: The Programmer's Approach" icon="fa-solid fa-code">
        <p class="mb-4">
          Riemann sums are the computational foundation of integration. Each method samples
          the function differently, affecting accuracy and convergence rate:
        </p>

        <div class="overflow-x-auto mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="py-2 px-3 text-left font-medium">Method</th>
                <th class="py-2 px-3 text-left font-medium">Sample Point</th>
                <th class="py-2 px-3 text-left font-medium">Convergence</th>
                <th class="py-2 px-3 text-left font-medium">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-medium">Left</td>
                <td class="py-2 px-3">f(xᵢ)</td>
                <td class="py-2 px-3">O(1/n)</td>
                <td class="py-2 px-3 text-text-secondary">Teaching, simplicity</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-medium">Right</td>
                <td class="py-2 px-3">f(xᵢ₊₁)</td>
                <td class="py-2 px-3">O(1/n)</td>
                <td class="py-2 px-3 text-text-secondary">Teaching, simplicity</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-medium">Midpoint</td>
                <td class="py-2 px-3">f((xᵢ+xᵢ₊₁)/2)</td>
                <td class="py-2 px-3 text-green-600 dark:text-green-400">O(1/n²)</td>
                <td class="py-2 px-3 text-text-secondary">General purpose</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-medium">Trapezoidal</td>
                <td class="py-2 px-3">Avg of left &amp; right</td>
                <td class="py-2 px-3 text-green-600 dark:text-green-400">O(1/n²)</td>
                <td class="py-2 px-3 text-text-secondary">Discrete data</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-medium">Simpson's</td>
                <td class="py-2 px-3">Parabolic fit</td>
                <td class="py-2 px-3 text-green-600 dark:text-green-400">O(1/n⁴)</td>
                <td class="py-2 px-3 text-text-secondary">Smooth functions</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="mb-4 text-text-secondary">
          The convergence rate tells you how fast the error decreases as you add more subdivisions.
          O(1/n²) means doubling n reduces error by ~4x. O(1/n⁴) means doubling n reduces error by ~16x!
        </p>

        <CodeExample
          id="calculus-integration-riemann"
          title="riemann_sum.py"
          language="python"
          :code="riemannSumCode"
          :collapsible="true"
          :default-expanded="true"
        />

        <div class="mt-4">
          <CodeExample
            id="calculus-integration-trapezoidal"
            title="trapezoidal_rule.py"
            language="python"
            :code="trapezoidalCode"
            :collapsible="true"
            :default-expanded="false"
          />
        </div>
      </ContentSection>

      <!-- Fundamental Theorem -->
      <ContentSection
        id="ftc"
        title="The Fundamental Theorem of Calculus"
        icon="fa-solid fa-link"
        :default-expanded="false"
      >
        <p class="mb-4">
          The <strong>Fundamental Theorem of Calculus</strong> connects derivatives and integrals
          as inverse operations — like multiplication and division, or addition and subtraction.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">Part 1: Differentiation undoes integration</h4>
            <MathBlock formula="\frac{d}{dx} \int_a^x f(t) \, dt = f(x)" display />
            <p class="text-sm text-text-secondary mt-2">
              If you integrate a function and then differentiate, you get the original function back.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">Part 2: Evaluate using antiderivatives</h4>
            <MathBlock formula="\int_a^b f(x) \, dx = F(b) - F(a)" display />
            <p class="text-sm text-text-secondary mt-2">
              To compute a definite integral, find an antiderivative F(x) and evaluate at the bounds.
            </p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            Why This Matters
          </p>
          <p class="text-text-secondary">
            The FTC is why symbolic integration (finding antiderivatives) is useful: instead of
            computing limits of sums, we can find F(x) and just subtract! For example,
            ∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 8/3.
          </p>
        </div>
      </ContentSection>

      <!-- Common Pitfalls -->
      <ContentSection
        id="pitfalls"
        title="Common Pitfalls"
        icon="fa-solid fa-triangle-exclamation"
        :default-expanded="false"
      >
        <div class="space-y-4">
          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h4 class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Forgetting +C in Indefinite Integrals
            </h4>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              ∫x dx = x²/2 + <strong>C</strong>, not just x²/2. The constant of integration
              matters because d/dx(x²/2 + 5) = x too. For definite integrals, C cancels out
              so we don't write it.
            </p>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h4 class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Ignoring Signed Area
            </h4>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              ∫₋₁¹ x³ dx = 0 (not ½). The positive area from 0 to 1 exactly cancels the negative
              area from -1 to 0. Use |f(x)| if you want total geometric area.
            </p>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h4 class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Swapping Bounds Changes Sign
            </h4>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              ∫ₐᵇ f(x)dx = -∫ᵇₐ f(x)dx. Integrating "backwards" negates the result.
              This follows from the definition: if a &gt; b, you're summing in the negative direction.
            </p>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h4 class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Simpson's Rule Requires Even n
            </h4>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              Simpson's rule fits parabolas through triplets of points, so n must be even.
              If you pass an odd n, most implementations either error or adjust to n+1.
            </p>
          </div>
        </div>

        <CodeExample
          id="calculus-integration-signed"
          title="signed_area.py"
          language="python"
          :code="signedAreaCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- In Python -->
      <ContentSection
        id="python"
        title="Integration in Python"
        icon="fa-brands fa-python"
        :default-expanded="false"
      >
        <p class="mb-4">
          For production code, use SciPy's integration functions instead of rolling your own.
          They handle edge cases, adaptive refinement, and error estimation automatically.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <code>scipy.integrate.quad()</code>
            </h4>
            <p class="text-sm text-text-secondary">
              General-purpose numerical integration. Works with any callable function.
              Returns both the result and an error estimate.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <code>numpy.trapz()</code>
            </h4>
            <p class="text-sm text-text-secondary">
              Trapezoidal integration for discrete data (arrays of x and y values).
              Perfect when you have measured data points, not a function.
            </p>
          </div>
        </div>

        <CodeExample
          id="calculus-integration-scipy"
          title="scipy_integration.py"
          language="python"
          :code="scipyCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
