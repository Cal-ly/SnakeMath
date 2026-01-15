<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import { SummationExplorer } from '@/components/widgets'

const relatedTopics = [
  { title: 'Algebra Overview', path: '/algebra', description: 'All algebra topics' },
  { title: 'Number Types', path: '/basics/number-types', description: 'Number classification' },
]

// Code examples
const basicLoopCode = `# The secret: Σ is just a for loop!
# Mathematical: Σ(i=1 to 5) i
# Translation: "sum all i from 1 to 5"

total = 0
for i in range(1, 6):  # i = 1, 2, 3, 4, 5
    total += i

print(total)  # 15`

const pythonSumCode = `# Python has built-in tools for summation

# Using sum() with range
result = sum(range(1, 11))  # 1 + 2 + ... + 10 = 55

# Using sum() with generator expression
squares = sum(i**2 for i in range(1, 6))  # 1 + 4 + 9 + 16 + 25 = 55

# Using sum() with list comprehension
cubes = sum([i**3 for i in range(1, 5)])  # 1 + 8 + 27 + 64 = 100

print(f"Sum 1-10: {result}")
print(f"Sum of squares: {squares}")
print(f"Sum of cubes: {cubes}")`

const gaussStoryCode = `# The legend of young Gauss
# Teacher: "Add all numbers from 1 to 100"
# Gauss (age 7): "5050!"

# The slow way (what the teacher expected)
def slow_sum(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

# Gauss's formula: n(n+1)/2
def gauss_formula(n):
    return n * (n + 1) // 2

# Both give the same answer!
print(f"Loop: {slow_sum(100)}")      # 5050
print(f"Formula: {gauss_formula(100)}")  # 5050

# But the formula is O(1) vs O(n)!`

const closedFormsCode = `# Famous closed-form formulas

def sum_integers(n):
    """Σ(i=1 to n) i = n(n+1)/2"""
    return n * (n + 1) // 2

def sum_squares(n):
    """Σ(i=1 to n) i² = n(n+1)(2n+1)/6"""
    return n * (n + 1) * (2*n + 1) // 6

def sum_cubes(n):
    """Σ(i=1 to n) i³ = [n(n+1)/2]²"""
    return (n * (n + 1) // 2) ** 2

# Mind-blowing: sum of cubes = square of sum!
n = 5
print(f"Sum 1-{n}: {sum_integers(n)}")     # 15
print(f"Sum of squares: {sum_squares(n)}") # 55
print(f"Sum of cubes: {sum_cubes(n)}")     # 225

# Verify: 15² = 225 ✓
print(f"(Sum 1-{n})² = {sum_integers(n)**2}")  # 225`

const complexityCode = `import time

def compare_methods(n):
    """Compare O(n) loop vs O(1) formula"""

    # Method 1: Loop (O(n) time)
    start = time.perf_counter()
    loop_result = sum(range(1, n + 1))
    loop_time = time.perf_counter() - start

    # Method 2: Formula (O(1) time)
    start = time.perf_counter()
    formula_result = n * (n + 1) // 2
    formula_time = time.perf_counter() - start

    print(f"n = {n:,}")
    print(f"Loop:    {loop_result:,} in {loop_time:.6f}s")
    print(f"Formula: {formula_result:,} in {formula_time:.6f}s")
    print(f"Speedup: {loop_time/formula_time:.0f}x faster\\n")

compare_methods(1_000)
compare_methods(1_000_000)
compare_methods(100_000_000)`
</script>

<template>
  <TopicPage
    title="Summation Notation"
    description="Discover how the scary-looking Σ symbol is just a for loop in disguise."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is Summation Notation?" icon="fa-solid fa-sigma">
        <p class="mb-4">
          That big, scary Greek letter <MathBlock formula="\Sigma" /> (sigma) sitting in your
          textbook? It's just a fancy way of saying <strong>"add all these things up."</strong>
        </p>

        <p class="mb-4">
          Mathematicians love their shorthand. Instead of writing out
          <MathBlock formula="1 + 2 + 3 + 4 + 5" />, they write:
        </p>

        <MathBlock formula="\sum_{i=1}^{5} i = 15" display />

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mt-6">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            The Programmer's Secret
          </p>
          <p class="text-text-secondary">
            If you've ever written a <code class="text-primary">for</code> loop, you already
            understand sigma notation. They're the same thing!
          </p>
        </div>
      </ContentSection>

      <!-- The Big Reveal -->
      <ContentSection
        id="the-secret"
        title="Σ Is Just a For Loop"
        icon="fa-solid fa-wand-magic-sparkles"
      >
        <p class="mb-4">Here's the pattern that will change how you see math forever:</p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <!-- Math side -->
          <div class="p-4 bg-surface-alt rounded-lg">
            <p class="text-xs text-text-muted uppercase tracking-wide mb-2">Math Notation</p>
            <MathBlock formula="\sum_{i=1}^{n} \text{expression}" display />
          </div>

          <!-- Code side -->
          <div class="p-4 bg-surface-alt rounded-lg">
            <p class="text-xs text-text-muted uppercase tracking-wide mb-2">Python Code</p>
            <pre
              class="text-sm font-mono text-primary"
            ><code>total = 0
for i in range(1, n+1):
    total += expression</code></pre>
          </div>
        </div>

        <p class="mb-4">Every part of sigma notation maps directly to code:</p>

        <ul class="space-y-2 text-text-secondary">
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-arrow-down text-primary mt-1" aria-hidden="true" />
            <span>
              <MathBlock formula="i=1" /> (below sigma) = starting value =
              <code class="text-primary">range(1, ...)</code>
            </span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-arrow-up text-primary mt-1" aria-hidden="true" />
            <span>
              <MathBlock formula="n" /> (above sigma) = ending value =
              <code class="text-primary">range(..., n+1)</code>
            </span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-plus text-primary mt-1" aria-hidden="true" />
            <span>
              Expression after sigma = what to add =
              <code class="text-primary">total += ...</code>
            </span>
          </li>
        </ul>

        <CodeExample :code="basicLoopCode" language="python" title="sigma_as_loop.py" />
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Explorer" icon="fa-solid fa-flask">
        <p class="mb-4">
          Try it yourself! Change the preset formula, adjust the bounds, and watch how the math
          notation corresponds to code. The URL updates automatically so you can share interesting
          examples.
        </p>

        <SummationExplorer
          :initial-preset="'arithmetic'"
          :initial-start="1"
          :initial-end="10"
          :sync-url="true"
        />
      </ContentSection>

      <!-- Python's Built-in Tools -->
      <ContentSection id="python" title="Python's sum() Function" icon="fa-brands fa-python" collapsible>
        <p class="mb-4">
          Python makes summation even easier with its built-in <code>sum()</code> function:
        </p>

        <CodeExample :code="pythonSumCode" language="python" title="python_sum.py" />

        <p class="mt-4 text-text-secondary">
          The <code>sum()</code> function is highly optimized in C, so it's typically faster than a
          manual loop for the same calculation.
        </p>
      </ContentSection>

      <!-- The Gauss Story -->
      <ContentSection id="gauss" title="The Gauss Story" icon="fa-solid fa-graduation-cap" collapsible>
        <p class="mb-4">
          Legend has it that when mathematician Carl Friedrich Gauss was just 7 years old, his
          teacher asked the class to add all numbers from 1 to 100 to keep them busy. While other
          students laboriously added number by number, young Gauss immediately wrote down
          <strong>5050</strong>.
        </p>

        <p class="mb-4">His insight? Pair up the numbers:</p>

        <div class="p-4 bg-math-highlight rounded-lg mb-4">
          <p class="font-mono text-center">
            (1 + 100) + (2 + 99) + (3 + 98) + ... = 50 pairs of 101 = 5050
          </p>
        </div>

        <p class="mb-4">This gives us the famous formula:</p>

        <MathBlock formula="\sum_{i=1}^{n} i = \frac{n(n+1)}{2}" display />

        <CodeExample :code="gaussStoryCode" language="python" title="gauss_formula.py" />
      </ContentSection>

      <!-- Closed-Form Formulas -->
      <ContentSection id="formulas" title="Famous Closed-Form Formulas" icon="fa-solid fa-bolt" collapsible>
        <p class="mb-4">
          Mathematicians have discovered shortcuts for many common sums. These
          <em>closed-form formulas</em> let you calculate the answer in constant time:
        </p>

        <div class="overflow-x-auto mb-6">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b-2 border-border">
                <th class="text-left py-2 px-3">Sum Type</th>
                <th class="text-left py-2 px-3">Summation</th>
                <th class="text-left py-2 px-3">Formula</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3">Integers</td>
                <td class="py-2 px-3"><MathBlock formula="\sum_{i=1}^{n} i" /></td>
                <td class="py-2 px-3"><MathBlock formula="\frac{n(n+1)}{2}" /></td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3">Squares</td>
                <td class="py-2 px-3"><MathBlock formula="\sum_{i=1}^{n} i^2" /></td>
                <td class="py-2 px-3"><MathBlock formula="\frac{n(n+1)(2n+1)}{6}" /></td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3">Cubes</td>
                <td class="py-2 px-3"><MathBlock formula="\sum_{i=1}^{n} i^3" /></td>
                <td class="py-2 px-3">
                  <MathBlock formula="\left[\frac{n(n+1)}{2}\right]^2" />
                </td>
              </tr>
              <tr>
                <td class="py-2 px-3">Powers of 2</td>
                <td class="py-2 px-3"><MathBlock formula="\sum_{i=0}^{n} 2^i" /></td>
                <td class="py-2 px-3"><MathBlock formula="2^{n+1} - 1" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-math-highlight rounded-lg mb-4">
          <p class="font-medium text-primary mb-2">
            <i class="fa-solid fa-star mr-1" aria-hidden="true" />
            Mind-Blowing Fact
          </p>
          <p class="text-text-secondary">
            The sum of cubes equals the square of the sum of integers:
            <MathBlock formula="1^3 + 2^3 + ... + n^3 = (1 + 2 + ... + n)^2" />
          </p>
        </div>

        <CodeExample :code="closedFormsCode" language="python" title="closed_forms.py" />
      </ContentSection>

      <!-- Why Formulas Matter -->
      <ContentSection id="complexity" title="Why Formulas Matter: O(n) vs O(1)" icon="fa-solid fa-rocket" collapsible>
        <p class="mb-4">
          Understanding closed-form formulas isn't just about math — it's about writing faster code.
          The difference between using a loop and using a formula is the difference between O(n) and
          O(1) complexity.
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="font-medium text-red-700 dark:text-red-300 mb-2">
              <i class="fa-solid fa-repeat mr-1" aria-hidden="true" />
              Loop: O(n) Time
            </p>
            <p class="text-sm text-red-600 dark:text-red-400">
              For n = 1,000,000, you need 1,000,000 additions. For n = 1,000,000,000, you need a
              billion additions.
            </p>
          </div>

          <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p class="font-medium text-green-700 dark:text-green-300 mb-2">
              <i class="fa-solid fa-bolt mr-1" aria-hidden="true" />
              Formula: O(1) Time
            </p>
            <p class="text-sm text-green-600 dark:text-green-400">
              No matter how large n is, just one multiplication and one division. Same speed for n=10
              or n=1,000,000,000.
            </p>
          </div>
        </div>

        <CodeExample :code="complexityCode" language="python" title="complexity_comparison.py" />

        <p class="mt-4 text-text-muted">
          This is why algorithm analysis matters! Recognizing when a loop can be replaced by a
          formula is a key optimization skill.
        </p>
      </ContentSection>

      <!-- Quick Reference -->
      <ContentSection id="reference" title="Quick Reference" icon="fa-solid fa-list-check">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="p-4 bg-surface-alt rounded-lg">
            <h4 class="font-medium text-text-primary mb-3">Sigma Anatomy</h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <span class="w-20 font-mono text-primary">i = start</span>
                <span class="text-text-muted">Index variable and starting value</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-20 font-mono text-primary">end</span>
                <span class="text-text-muted">Upper bound (inclusive)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-20 font-mono text-primary">expr</span>
                <span class="text-text-muted">What to add each iteration</span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-surface-alt rounded-lg">
            <h4 class="font-medium text-text-primary mb-3">Common Patterns</h4>
            <div class="space-y-2 text-sm font-mono">
              <div class="flex justify-between">
                <span class="text-text-muted">Count:</span>
                <span><MathBlock formula="\sum 1 = n" /></span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-muted">Sum:</span>
                <span><MathBlock formula="\sum i = \frac{n(n+1)}{2}" /></span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-muted">Even:</span>
                <span><MathBlock formula="\sum 2i = n(n+1)" /></span>
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
            Sigma notation is just a <strong>compact way to write a for loop</strong>. The index
            variable iterates from the lower bound to the upper bound, and the expression tells you
            what to add at each step. That's all there is to it!
          </p>
        </div>
      </ContentSection>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
