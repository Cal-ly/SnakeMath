<script setup lang="ts">
import { ref, computed } from 'vue'
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import {
  evaluateProduct,
  factorial,
  permutations,
  combinations,
  getProductPresetExpression,
  getProductPresetLatex,
} from '@/utils/math/product'
import type { ProductPresetId } from '@/types/math'

const relatedTopics = [
  { title: 'Algebra Overview', path: '/algebra', description: 'All algebra topics' },
  { title: 'Summation', path: '/algebra/summation', description: 'Σ is the additive cousin of Π' },
  { title: 'Exponentials', path: '/algebra/exponentials', description: 'Logs convert products to sums' },
  { title: 'Descriptive Statistics', path: '/statistics/descriptive', description: 'Variance uses squared products' },
]

// Interactive explorer state
const selectedPreset = ref<ProductPresetId>('factorial')
const startValue = ref(1)
const endValue = ref(5)

const presetOptions: { id: ProductPresetId; name: string; description: string }[] = [
  { id: 'factorial', name: 'Factorial', description: '1 × 2 × 3 × ... × n' },
  { id: 'evenNumbers', name: 'Even Numbers', description: '2 × 4 × 6 × ... × 2n' },
  { id: 'oddNumbers', name: 'Odd Numbers', description: '1 × 3 × 5 × ... × (2n-1)' },
  { id: 'powers', name: 'Powers of 2', description: '2¹ × 2² × 2³ × ...' },
  { id: 'fractions', name: 'Telescoping', description: '(1/2) × (2/3) × (3/4) × ...' },
]

const result = computed(() => {
  const expression = getProductPresetExpression(selectedPreset.value)
  return evaluateProduct(expression, startValue.value, endValue.value)
})

const formulaLatex = computed(() => getProductPresetLatex(selectedPreset.value))

// Full product notation formula for display
const fullFormula = computed(() => {
  const latex = formulaLatex.value
  return `\\prod_{i=${startValue.value}}^{${endValue.value}} ${latex}`
})

// Example calculations for display
const factorialExample = computed(() => factorial(5))
const permExample = computed(() => permutations(5, 3))
const combExample = computed(() => combinations(5, 3))

// Code examples
const basicLoopCode = `# The secret: Π is just a for loop with multiplication!
# Mathematical: Π(i=1 to 5) i
# Translation: "multiply all i from 1 to 5"

product = 1
for i in range(1, 6):  # i = 1, 2, 3, 4, 5
    product *= i

print(product)  # 120 (that's 5!)`

const factorialCode = `import math

# Python's built-in factorial
result = math.factorial(5)  # 120

# Manual implementation
def my_factorial(n):
    """Π(i=1 to n) i"""
    if n < 0:
        raise ValueError("Factorial not defined for negatives")
    if n == 0 or n == 1:
        return 1

    product = 1
    for i in range(2, n + 1):
        product *= i
    return product

# Recursive version (classic but less efficient)
def factorial_recursive(n):
    if n <= 1:
        return 1
    return n * factorial_recursive(n - 1)

print(f"5! = {my_factorial(5)}")       # 120
print(f"10! = {my_factorial(10)}")     # 3628800
print(f"0! = {my_factorial(0)}")       # 1 (by definition)`

const permutationCode = `import math

# Permutations: P(n,r) = n! / (n-r)!
# "How many ways to ARRANGE r items from n items?"

def permutations(n, r):
    """
    Order matters: ABC ≠ BAC
    P(n,r) = n × (n-1) × ... × (n-r+1)
    """
    if r > n or r < 0:
        return 0

    # Using product notation:
    # Π(i=0 to r-1) (n-i)
    result = 1
    for i in range(r):
        result *= (n - i)
    return result

# Or use the built-in
from math import perm
print(perm(5, 3))  # 60

# Example: How many 3-letter "words" from ABCDE?
print(f"P(5,3) = {permutations(5, 3)}")  # 60
# ABC, ABD, ABE, ACB, ACD, ACE, ADB, ADC, ...`

const combinationCode = `import math

# Combinations: C(n,r) = n! / (r! × (n-r)!)
# "How many ways to CHOOSE r items from n items?"

def combinations(n, r):
    """
    Order doesn't matter: ABC = BAC = CAB
    C(n,r) = P(n,r) / r!
    """
    if r > n or r < 0:
        return 0

    # Optimization: C(n,r) = C(n, n-r)
    k = min(r, n - r)

    # Using product notation (optimized):
    result = 1
    for i in range(k):
        result = result * (n - i) // (i + 1)
    return result

# Or use the built-in
from math import comb
print(comb(5, 3))  # 10

# Example: How many ways to pick 3 people from 5?
print(f"C(5,3) = {combinations(5, 3)}")  # 10
# {A,B,C}, {A,B,D}, {A,B,E}, {A,C,D}, ...`

const telescopingCode = `# Telescoping products - terms cancel out!
# Π(i=1 to n) i/(i+1) = 1/2 × 2/3 × 3/4 × ... × n/(n+1)

def telescoping_product(n):
    """Most terms cancel, leaving just 1/(n+1)"""
    product = 1.0
    for i in range(1, n + 1):
        product *= i / (i + 1)
    return product

# Watch the cancellation:
# (1/2) × (2/3) × (3/4) × (4/5)
#   1     2   3   4
# = --- × - × - × ---
#   2     3   4   5
#      ↑cancel↑ cancel
# = 1/5

for n in [4, 10, 100]:
    result = telescoping_product(n)
    closed_form = 1 / (n + 1)
    print(f"n={n}: loop={result:.10f}, formula={closed_form:.10f}")`

const realWorldCode = `# Real-world applications of product notation

# 1. Probability - Independent events
def independent_probability(probs):
    """P(A AND B AND C) = P(A) × P(B) × P(C)"""
    result = 1.0
    for p in probs:
        result *= p
    return result

# Rolling a 6 three times in a row
prob = independent_probability([1/6, 1/6, 1/6])
print(f"Three 6s: {prob:.4f} = 1/216")  # 0.0046

# 2. Compound Interest (discrete)
def compound_interest(principal, rates):
    """Final value after varying interest rates"""
    # Π(1 + r_i) for each rate r_i
    for rate in rates:
        principal *= (1 + rate)
    return principal

# 1000 dollars with varying annual returns
final = compound_interest(1000, [0.05, 0.08, -0.02, 0.12])
print(f"Final: {final:.2f}")  # Growth over 4 years

# 3. Generating polynomials from roots
def polynomial_from_roots(roots, x):
    """(x-r1)(x-r2)(x-r3)... evaluated at x"""
    result = 1
    for root in roots:
        result *= (x - root)
    return result

# Polynomial with roots at 1, 2, 3
roots = [1, 2, 3]
print(f"P(4) = {polynomial_from_roots(roots, 4)}")  # (4-1)(4-2)(4-3) = 6`
</script>

<template>
  <TopicPage
    title="Product Notation"
    description="Learn how the Π symbol is just a for loop with multiplication."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is Product Notation?" unicode-icon="Π" collapsible>
        <p class="mb-4">
          Just like <MathBlock formula="\Sigma" /> (Sigma) means "add all these up,"
          <MathBlock formula="\Pi" /> (Pi, the capital Greek letter) means
          <strong>"multiply all these together."</strong>
        </p>

        <p class="mb-4">
          Instead of writing out <MathBlock formula="1 \times 2 \times 3 \times 4 \times 5" />,
          mathematicians write:
        </p>

        <MathBlock formula="\prod_{i=1}^{5} i = 120" display />

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mt-6">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            The Pattern
          </p>
          <p class="text-text-secondary">
            If you understood summation, you already understand products! Just replace
            <code class="text-primary">total += term</code> with
            <code class="text-primary">product *= factor</code>.
          </p>
        </div>

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-industry mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              An assembly line where each station multiplies by some factor. Raw material goes in,
              and the final output is everything multiplied together.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              A for-loop that uses <code>*=</code> instead of <code>+=</code>. Start with 1
              (not 0!), then multiply by each term. That's all Π means.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-link mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              A chain of multiplications. Each link is a factor; the product is the whole chain.
              Remove one link (factor = 0) and everything collapses to zero.
            </p>
          </div>
        </div>

        <div
          class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Underflow with Many Small Numbers
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            Multiplying many small probabilities (like 0.001 × 0.001 × ...) quickly underflows to 0.
            In ML and stats, use the <strong>log-sum trick</strong>: convert Π to Σ via
            <code>log(∏ aᵢ) = Σ log(aᵢ)</code>, then exponentiate at the end.
          </p>
        </div>
      </ContentSection>

      <!-- The Big Reveal -->
      <ContentSection
        id="the-secret"
        title="Π Is Just a For Loop"
        icon="fa-solid fa-wand-magic-sparkles"
        collapsible
      >
        <p class="mb-4">The same pattern as summation, just with multiplication:</p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <!-- Math side -->
          <div class="p-4 rounded-lg border border-border">
            <p class="text-xs text-text-muted uppercase tracking-wide mb-2">Math Notation</p>
            <MathBlock formula="\prod_{i=1}^{n} \text{expression}" display />
          </div>

          <!-- Code side -->
          <div class="p-4 rounded-lg border border-border">
            <p class="text-xs text-text-muted uppercase tracking-wide mb-2">Python Code</p>
            <pre
              class="text-sm font-mono text-primary"
            ><code>product = 1
for i in range(1, n+1):
    product *= expression</code></pre>
          </div>
        </div>

        <p class="mb-4">Notice the key differences from summation:</p>

        <ul class="space-y-2 text-text-secondary">
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-1 text-primary mt-1" aria-hidden="true" />
            <span>
              Start with <code class="text-primary">product = 1</code> (the multiplicative identity),
              not 0
            </span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-xmark text-primary mt-1" aria-hidden="true" />
            <span>
              Use <code class="text-primary">*=</code> instead of
              <code class="text-primary">+=</code>
            </span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-warning text-amber-500 mt-1" aria-hidden="true" />
            <span>
              Empty product = 1 (not 0!), just like how 0! = 1
            </span>
          </li>
        </ul>

        <CodeExample
          id="algebra-product-loop"
          :code="basicLoopCode"
          language="python"
          title="pi_as_loop.py"
        />
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Explorer" icon="fa-solid fa-flask" collapsible>
        <p class="mb-4">
          Try different product formulas and see how the factors multiply together:
        </p>

        <div class="card p-6">
          <div class="grid gap-6 md:grid-cols-2">
            <!-- Controls -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Formula</label>
                <select
                  v-model="selectedPreset"
                  class="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option v-for="opt in presetOptions" :key="opt.id" :value="opt.id">
                    {{ opt.name }} — {{ opt.description }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2">Start (i=)</label>
                  <input
                    v-model.number="startValue"
                    type="number"
                    min="1"
                    max="20"
                    class="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2">End</label>
                  <input
                    v-model.number="endValue"
                    type="number"
                    min="1"
                    max="20"
                    class="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <!-- Result -->
            <div class="p-4 rounded-lg border border-border">
              <p class="text-sm text-text-muted mb-2">Formula</p>
              <MathBlock :formula="fullFormula" display />

              <p class="text-sm text-text-muted mt-4 mb-2">Factors</p>
              <p class="font-mono text-text-secondary">
                {{ result.factors.join(' × ') || '(empty product)' }}
              </p>

              <p class="text-sm text-text-muted mt-4 mb-2">Result</p>
              <p class="text-2xl font-bold text-primary">
                {{ result.product.toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      <!-- Factorial -->
      <ContentSection id="factorial" title="Factorial: The Star of Product Notation" icon="fa-solid fa-star" collapsible>
        <p class="mb-4">
          The most famous use of product notation is the <strong>factorial</strong>:
        </p>

        <MathBlock formula="n! = \prod_{i=1}^{n} i = 1 \times 2 \times 3 \times \cdots \times n" display />

        <div class="grid gap-4 md:grid-cols-3 my-6">
          <div class="p-4 rounded-lg border border-border text-center">
            <p class="text-3xl font-bold text-primary mb-1">{{ factorialExample }}</p>
            <p class="text-sm text-text-muted">5! = 1×2×3×4×5</p>
          </div>
          <div class="p-4 rounded-lg border border-border text-center">
            <p class="text-3xl font-bold text-primary mb-1">1</p>
            <p class="text-sm text-text-muted">0! = 1 (by definition)</p>
          </div>
          <div class="p-4 rounded-lg border border-border text-center">
            <p class="text-3xl font-bold text-primary mb-1">3,628,800</p>
            <p class="text-sm text-text-muted">10!</p>
          </div>
        </div>

        <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-6">
          <p class="font-medium text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-1" aria-hidden="true" />
            Factorials Grow FAST
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            20! is already over 2 quintillion (2.4 × 10¹⁸). By 170!, you overflow a 64-bit float!
            This explosive growth is why factorials appear in complexity analysis.
          </p>
        </div>

        <CodeExample
          id="algebra-product-factorial"
          :code="factorialCode"
          language="python"
          title="factorial.py"
        />
      </ContentSection>

      <!-- Permutations and Combinations -->
      <ContentSection id="permutations" title="Permutations & Combinations" icon="fa-solid fa-shuffle" collapsible>
        <p class="mb-4">
          Factorials are the building blocks for counting problems. Two key formulas:
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              Permutations (order matters)
            </h4>
            <MathBlock formula="P(n,r) = \frac{n!}{(n-r)!} = \prod_{i=0}^{r-1}(n-i)" display />
            <p class="text-sm text-text-muted mt-2">
              "How many ways to <strong>arrange</strong> r items from n?"
            </p>
            <p class="text-lg font-bold text-primary mt-2">
              P(5,3) = {{ permExample }}
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              Combinations (order doesn't matter)
            </h4>
            <MathBlock formula="C(n,r) = \binom{n}{r} = \frac{n!}{r!(n-r)!}" display />
            <p class="text-sm text-text-muted mt-2">
              "How many ways to <strong>choose</strong> r items from n?"
            </p>
            <p class="text-lg font-bold text-primary mt-2">
              C(5,3) = {{ combExample }}
            </p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-6">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            The Key Insight
          </p>
          <p class="text-text-secondary">
            Combinations = Permutations ÷ (ways to rearrange the selection)<br />
            <MathBlock formula="C(n,r) = P(n,r) / r!" />
          </p>
        </div>

        <CodeExample
          id="algebra-product-permutation"
          :code="permutationCode"
          language="python"
          title="permutations.py"
        />

        <CodeExample
          id="algebra-product-combination"
          :code="combinationCode"
          language="python"
          title="combinations.py"
          class="mt-4"
        />
      </ContentSection>

      <!-- Telescoping Products -->
      <ContentSection id="telescoping" title="Telescoping Products" icon="fa-solid fa-minimize" collapsible :default-expanded="false">
        <p class="mb-4">
          Some products have a beautiful property: most factors cancel out, leaving a simple result.
        </p>

        <MathBlock
          formula="\prod_{i=1}^{n} \frac{i}{i+1} = \frac{1}{2} \cdot \frac{2}{3} \cdot \frac{3}{4} \cdots \frac{n}{n+1} = \frac{1}{n+1}"
          display
        />

        <p class="my-4">
          Watch the cancellation:
        </p>

        <div class="p-4 rounded-lg border border-border font-mono text-center mb-4">
          <p class="text-text-secondary">
            <span class="text-primary">1</span>/2 × <span class="line-through text-text-muted">2</span>/3 ×
            <span class="line-through text-text-muted">3</span>/4 × <span class="line-through text-text-muted">4</span>/5
            = <span class="text-primary">1</span>/5
          </p>
        </div>

        <CodeExample
          id="algebra-product-telescoping"
          :code="telescopingCode"
          language="python"
          title="telescoping.py"
        />
      </ContentSection>

      <!-- Real-World Applications -->
      <ContentSection id="applications" title="Real-World Applications" icon="fa-solid fa-rocket" collapsible :default-expanded="false">
        <p class="mb-4">
          Product notation appears throughout programming and data science:
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-dice text-primary mr-2" aria-hidden="true" />
              Probability
            </h4>
            <p class="text-sm text-text-muted">
              Independent events: P(A ∩ B ∩ C) = P(A) × P(B) × P(C)
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-chart-line text-primary mr-2" aria-hidden="true" />
              Compound Interest
            </h4>
            <p class="text-sm text-text-muted">
              Final = Principal × Π(1 + rate_i) for varying rates
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-brain text-primary mr-2" aria-hidden="true" />
              Machine Learning
            </h4>
            <p class="text-sm text-text-muted">
              Likelihood functions multiply probabilities across observations
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-wave-square text-primary mr-2" aria-hidden="true" />
              Polynomials
            </h4>
            <p class="text-sm text-text-muted">
              (x-r₁)(x-r₂)...(x-rₙ) defines a polynomial from its roots
            </p>
          </div>
        </div>

        <CodeExample
          id="algebra-product-applications"
          :code="realWorldCode"
          language="python"
          title="applications.py"
        />
      </ContentSection>

      <!-- Quick Reference -->
      <ContentSection id="reference" title="Quick Reference" icon="fa-solid fa-list-check" collapsible :default-expanded="false">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-3">Product Anatomy</h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <span class="w-24 font-mono text-primary">i = start</span>
                <span class="text-text-muted">Index variable and starting value</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 font-mono text-primary">end</span>
                <span class="text-text-muted">Upper bound (inclusive)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 font-mono text-primary">expression</span>
                <span class="text-text-muted">What to multiply each iteration</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24 font-mono text-primary">product = 1</span>
                <span class="text-text-muted">Initial value (multiplicative identity)</span>
              </div>
            </div>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-medium text-text-primary mb-3">Key Formulas</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-text-muted">Factorial:</span>
                <MathBlock formula="n! = \prod_{i=1}^{n} i" />
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text-muted">Permutation:</span>
                <MathBlock formula="P(n,r) = \frac{n!}{(n-r)!}" />
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text-muted">Combination:</span>
                <MathBlock formula="C(n,r) = \frac{n!}{r!(n-r)!}" />
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
            Product notation is just <strong>summation with multiplication</strong>. Start with 1,
            use *= instead of +=, and you're done. The same for loop pattern works!
          </p>
        </div>
      </ContentSection>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
