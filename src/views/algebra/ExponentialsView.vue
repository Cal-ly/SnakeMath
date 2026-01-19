<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import { ExponentialExplorer } from '@/components/widgets/ExponentialExplorer'

const relatedTopics = [
  { title: 'Algebra Overview', path: '/algebra', description: 'All algebra topics' },
  { title: 'Product Notation', path: '/algebra/product-notation', description: 'Logs convert products to sums' },
  { title: 'Derivatives', path: '/calculus/derivatives', description: "e^x is its own derivative" },
  { title: 'Limits', path: '/calculus/limits', description: 'How e is defined' },
]

// Code examples
const basicExponentialCode = `def exponential(x, base=2):
    """Exponential function: b^x"""
    return base ** x

# Powers of 2 - fundamental in CS
for i in range(10):
    print(f"2^{i} = {exponential(i)}")  # 1, 2, 4, 8, 16, 32, 64, 128, 256, 512`

const specialBasesCode = `import math

# The three most important bases
print(f"2^10 = {2**10}")         # 1024 - "kilobyte"
print(f"10^6 = {10**6}")         # 1000000 - "million"
print(f"e^1 = {math.e:.4f}")     # 2.7183 - natural base

# Why e is special: derivative of e^x is e^x`

const doublingTimeCode = `import math

def doubling_time(growth_rate):
    """Time to double with given growth rate (as decimal)."""
    # Using the Rule of 70 approximation
    return 70 / (growth_rate * 100)

def exact_doubling_time(base):
    """Exact doubling time for f(x) = base^x."""
    return math.log(2) / math.log(base)

# 7% annual growth
print(f"Rule of 70: {doubling_time(0.07):.1f} years")  # 10.0
print(f"Exact: {exact_doubling_time(1.07):.1f} years")  # 10.2`

const logarithmBasicsCode = `import math

# Logarithm answers: "What power gives us x?"
print(f"log2(8) = {math.log2(8)}")    # 3, because 2^3 = 8
print(f"log10(1000) = {math.log10(1000)}")  # 3, because 10^3 = 1000
print(f"ln(e^2) = {math.log(math.e**2)}")    # 2, because e^2 = e^2

# The relationship: log_b(b^x) = x
base = 5
x = 3
print(f"log_{base}({base}^{x}) = {math.log(base**x, base)}")  # 3`

const logPropertiesCode = `import math

a, b = 100, 10

# Product rule: log(ab) = log(a) + log(b)
print(f"log10(100 * 10) = {math.log10(a * b)}")  # 3
print(f"log10(100) + log10(10) = {math.log10(a) + math.log10(b)}")  # 3

# Change of base formula
def log_base(x, base):
    """Calculate log_base(x) using natural log."""
    return math.log(x) / math.log(base)

print(f"log3(81) = {log_base(81, 3)}")  # 4, because 3^4 = 81`

const compoundInterestCode = `import math

def compound_interest(principal, rate, compounds_per_year, years):
    """
    Calculate compound interest.

    Args:
        principal: Initial amount (P)
        rate: Annual interest rate as decimal (r)
        compounds_per_year: Times interest compounds per year (n)
        years: Time in years (t)

    Returns:
        Final amount (A)
    """
    return principal * (1 + rate / compounds_per_year) ** (compounds_per_year * years)

# Compare compounding frequencies
principal = 10000
rate = 0.05  # 5% annual rate
years = 10

print("$10,000 at 5% for 10 years:")
print(f"  Annual:     \${compound_interest(principal, rate, 1, years):,.2f}")
print(f"  Monthly:    \${compound_interest(principal, rate, 12, years):,.2f}")
print(f"  Daily:      \${compound_interest(principal, rate, 365, years):,.2f}")
print(f"  Continuous: \${principal * math.e**(rate * years):,.2f}")`

const algorithmComplexityCode = `import time

def linear_search(arr, target):
    """O(n) - check every element"""
    for i, item in enumerate(arr):
        if item == target:
            return i
    return -1

def binary_search(arr, target):
    """O(log n) - divide and conquer"""
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Compare with 1 million elements
arr = list(range(1_000_000))
target = 999_999

# Linear: O(n) = 1,000,000 operations
# Binary: O(log n) = 20 operations

# That's 50,000x fewer operations!`

const binaryBitsCode = `import math

# How many bits to represent a number?
def bits_needed(n):
    """O(log2 n) bits needed to represent n."""
    if n == 0:
        return 1
    return math.floor(math.log2(n)) + 1

print(f"Bits for 255: {bits_needed(255)}")    # 8 (one byte)
print(f"Bits for 256: {bits_needed(256)}")    # 9
print(f"Bits for 1000: {bits_needed(1000)}")  # 10`

const phScaleCode = `import math

def ph_to_concentration(ph):
    """Convert pH to hydrogen ion concentration."""
    return 10 ** (-ph)

def concentration_to_ph(concentration):
    """Convert hydrogen ion concentration to pH."""
    return -math.log10(concentration)

# pH 7 (neutral) vs pH 4 (acidic)
print(f"pH 7 concentration: {ph_to_concentration(7):.0e}")  # 1e-7
print(f"pH 4 concentration: {ph_to_concentration(4):.0e}")  # 1e-4
# pH 4 is 1000x more acidic than pH 7!`

const decibelsCode = `import math

def watts_to_decibels(power, reference=1e-12):
    """Convert power to decibels (dB)."""
    return 10 * math.log10(power / reference)

# Whisper vs Rock concert
whisper = 1e-10  # watts
concert = 1e-1   # watts

print(f"Whisper: {watts_to_decibels(whisper):.0f} dB")  # 20 dB
print(f"Concert: {watts_to_decibels(concert):.0f} dB")  # 110 dB
# 90 dB difference = 10^9 = 1 billion times more power!`
</script>

<template>
  <TopicPage title="Exponentials & Logarithms">
    <!-- What are Exponential Functions? -->
    <ContentSection id="introduction" title="What are Exponential Functions?" collapsible>
      <p class="mb-4">
        An <strong>exponential function</strong> has the variable in the exponent. In its most
        general form:
      </p>

      <div class="my-6 text-center">
        <MathBlock formula="f(x) = b^x" display />
      </div>

      <p class="mb-4">
        where <MathBlock formula="b > 0" /> and <MathBlock formula="b \neq 1" /> (the
        <strong>base</strong>). Unlike polynomials where you multiply the variable by itself a
        fixed number of times, exponentials grow (or decay) at a rate proportional to their current
        value.
      </p>

      <p class="mb-4">
        The key property: <strong>constant multiplicative change</strong>. Each step multiplies the
        previous value by the base, rather than adding a fixed amount.
      </p>

      <ul class="list-disc list-inside space-y-2 mb-4 text-text-secondary">
        <li>
          <strong><MathBlock formula="b > 1" /></strong>: Exponential growth (curve rises steeply)
        </li>
        <li>
          <strong><MathBlock formula="0 < b < 1" /></strong>: Exponential decay (curve falls toward
          zero)
        </li>
      </ul>

      <h3 class="text-lg font-semibold mt-6 mb-3">Why Programmers Care</h3>

      <p class="mb-4">
        Exponentials are fundamental to algorithm analysis. The difference between
        <MathBlock formula="O(\log n)" /> and <MathBlock formula="O(2^n)" /> is the difference
        between a program that runs in milliseconds and one that takes longer than the age of the
        universe. Understanding exponential growth is essential for writing efficient code.
      </p>

      <CodeExample id="algebra-exponentials-basic" language="python" title="powers_of_2.py" :code="basicExponentialCode" />

      <!-- Three Analogies -->
      <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
            <i class="fa-solid fa-clock-rotate-left mr-2" aria-hidden="true" />
            Everyday Analogy
          </h4>
          <p class="text-sm text-text-secondary">
            Exponentials are "mathematical time machines"—they compress or expand time. Compound
            interest, population growth, and viral spread all use exponential mechanics.
          </p>
        </div>
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            <i class="fa-solid fa-magnifying-glass mr-2" aria-hidden="true" />
            Programming Analogy
          </h4>
          <p class="text-sm text-text-secondary">
            Logarithms are "mathematical detectives"—they answer "how many times did we multiply?"
            Binary search does log₂(n) comparisons because each step halves the search space.
          </p>
        </div>
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
            Visual Intuition
          </h4>
          <p class="text-sm text-text-secondary">
            Exponential curves start slow then explode upward (or decay toward zero). Log curves
            start steep then flatten. They're mirror images around the line y = x.
          </p>
        </div>
      </div>

      <!-- Pitfall Callout -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
          <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
          Common Pitfall: log(0) and log(negative)
        </p>
        <p class="text-sm text-amber-600 dark:text-amber-400">
          Logarithms are only defined for positive numbers. <code>math.log(0)</code> gives
          <code>-inf</code>, and <code>math.log(-1)</code> raises <code>ValueError</code>. Always
          check that your input is positive before taking logs—especially in ML loss functions!
        </p>
      </div>
    </ContentSection>

    <!-- Interactive Explorer -->
    <ContentSection id="explorer" title="Interactive Explorer" collapsible>
      <p class="mb-4">
        Use the <strong>Function Explorer</strong> tab to visualize exponential and logarithmic
        functions with different bases. Switch to <strong>Complexity Comparison</strong> to see
        why algorithm complexity matters.
      </p>

      <ExponentialExplorer :sync-url="true" />
    </ContentSection>

    <!-- Special Bases -->
    <ContentSection id="special-bases" title="Special Bases" collapsible :default-expanded="false">
      <div class="space-y-6">
        <div class="p-4 bg-surface-secondary rounded-lg">
          <h4 class="font-semibold mb-2">
            Base 2 - Binary
          </h4>
          <p class="text-text-secondary mb-2">
            The foundation of computing. Memory sizes, bit counts, and binary trees all work in
            powers of 2.
          </p>
          <ul class="list-disc list-inside text-sm text-text-muted">
            <li>
              <MathBlock formula="2^{10} = 1024" /> (kilobyte)
            </li>
            <li>
              <MathBlock formula="2^{20} = 1,048,576" /> (megabyte)
            </li>
            <li>
              <MathBlock formula="2^{32} = 4,294,967,296" /> (32-bit address space)
            </li>
          </ul>
        </div>

        <div class="p-4 bg-surface-secondary rounded-lg">
          <h4 class="font-semibold mb-2">
            Base 10 - Decimal
          </h4>
          <p class="text-text-secondary mb-2">
            Scientific notation and orders of magnitude. Each power of 10 is one "order of
            magnitude."
          </p>
          <ul class="list-disc list-inside text-sm text-text-muted">
            <li>
              <MathBlock formula="10^3 = 1,000" /> (thousand)
            </li>
            <li>
              <MathBlock formula="10^6 = 1,000,000" /> (million)
            </li>
            <li>
              <MathBlock formula="10^9 = 1,000,000,000" /> (billion)
            </li>
          </ul>
        </div>

        <div class="p-4 bg-surface-secondary rounded-lg">
          <h4 class="font-semibold mb-2">
            Base e - Natural
          </h4>
          <p class="text-text-secondary mb-2">
            Euler's number <MathBlock formula="e \approx 2.718" /> is special: the derivative of
            <MathBlock formula="e^x" /> is itself. This makes it fundamental in calculus and
            continuous growth.
          </p>
          <ul class="list-disc list-inside text-sm text-text-muted">
            <li>Natural logarithm: <MathBlock formula="\ln(x) = \log_e(x)" /></li>
            <li>Continuous compounding: <MathBlock formula="A = Pe^{rt}" /></li>
          </ul>
        </div>
      </div>

      <CodeExample id="algebra-exponentials-bases" language="python" title="special_bases.py" :code="specialBasesCode" />
    </ContentSection>

    <!-- Growth and Decay -->
    <ContentSection id="growth-decay" title="Growth and Decay" collapsible :default-expanded="false">
      <p class="mb-4">
        Exponential functions model processes where the rate of change is proportional to the
        current value.
      </p>

      <h4 class="font-semibold mb-2">Exponential Growth</h4>
      <p class="text-text-secondary mb-4">
        When <MathBlock formula="b > 1" />, the function grows without bound. Examples include:
        population growth, compound interest, and viral spread.
      </p>

      <h4 class="font-semibold mb-2">Exponential Decay</h4>
      <p class="text-text-secondary mb-4">
        When <MathBlock formula="0 < b < 1" />, the function approaches zero but never reaches it.
        Examples include: radioactive decay, depreciation, and cooling.
      </p>

      <h4 class="font-semibold mt-4 mb-2">Doubling Time and Half-Life</h4>
      <div class="space-y-2 mb-4">
        <p class="text-text-secondary">
          <strong>Doubling time</strong> (for growth):
          <MathBlock formula="t_{double} = \frac{\ln(2)}{\ln(b)}" />
        </p>
        <p class="text-text-secondary">
          <strong>Half-life</strong> (for decay):
          <MathBlock formula="t_{half} = \frac{\ln(0.5)}{\ln(b)}" />
        </p>
      </div>

      <CodeExample id="algebra-exponentials-doubling" language="python" title="doubling_time.py" :code="doublingTimeCode" />
    </ContentSection>

    <!-- What are Logarithms? -->
    <ContentSection id="logarithms" title="What are Logarithms?" collapsible :default-expanded="false">
      <p class="mb-4">
        The <strong>logarithm</strong> is the inverse of the exponential. If
        <MathBlock formula="b^y = x" />, then <MathBlock formula="\log_b(x) = y" />.
      </p>

      <div class="my-6 text-center">
        <MathBlock formula="\log_b(x) = y \Longleftrightarrow b^y = x" display />
      </div>

      <p class="mb-4">
        In words: "The logarithm base <em>b</em> of <em>x</em> is the power you raise <em>b</em>
        to get <em>x</em>."
      </p>

      <h4 class="font-semibold mt-4 mb-2">Key Property</h4>
      <p class="text-text-secondary mb-4">
        Logarithms turn <strong>multiplication into addition</strong>:
        <MathBlock formula="\log(a \cdot b) = \log(a) + \log(b)" />
      </p>

      <p>
        This is why logarithms were invented - before calculators, they made multiplication
        tractable by converting it to addition using log tables.
      </p>

      <CodeExample id="algebra-exponentials-logbasics" language="python" title="logarithm_basics.py" :code="logarithmBasicsCode" />
    </ContentSection>

    <!-- Logarithm Properties -->
    <ContentSection id="log-properties" title="Logarithm Properties" collapsible :default-expanded="false">
      <div class="space-y-4 mb-6">
        <div class="p-3 bg-surface-secondary rounded-lg">
          <h4 class="font-semibold mb-1">Product Rule</h4>
          <MathBlock formula="\log_b(xy) = \log_b(x) + \log_b(y)" display />
        </div>

        <div class="p-3 bg-surface-secondary rounded-lg">
          <h4 class="font-semibold mb-1">Quotient Rule</h4>
          <MathBlock formula="\log_b\left(\frac{x}{y}\right) = \log_b(x) - \log_b(y)" display />
        </div>

        <div class="p-3 bg-surface-secondary rounded-lg">
          <h4 class="font-semibold mb-1">Power Rule</h4>
          <MathBlock formula="\log_b(x^n) = n \cdot \log_b(x)" display />
        </div>

        <div class="p-3 bg-surface-secondary rounded-lg">
          <h4 class="font-semibold mb-1">Change of Base</h4>
          <MathBlock formula="\log_b(x) = \frac{\ln(x)}{\ln(b)} = \frac{\log(x)}{\log(b)}" display />
        </div>
      </div>

      <CodeExample id="algebra-exponentials-logprops" language="python" title="log_properties.py" :code="logPropertiesCode" />
    </ContentSection>

    <!-- Compound Interest -->
    <ContentSection id="compound-interest" title="Compound Interest" collapsible :default-expanded="false">
      <p class="mb-4">
        The compound interest formula is a classic application of exponentials:
      </p>

      <div class="my-6 text-center">
        <MathBlock formula="A = P\left(1 + \frac{r}{n}\right)^{nt}" display />
      </div>

      <ul class="list-disc list-inside space-y-1 mb-4 text-text-secondary">
        <li><MathBlock formula="A" /> = final amount</li>
        <li><MathBlock formula="P" /> = principal (initial amount)</li>
        <li><MathBlock formula="r" /> = annual interest rate (as decimal)</li>
        <li><MathBlock formula="n" /> = compoundings per year</li>
        <li><MathBlock formula="t" /> = time in years</li>
      </ul>

      <p class="mb-4">
        As <MathBlock formula="n \to \infty" />, we get <strong>continuous compounding</strong>:
        <MathBlock formula="A = Pe^{rt}" />
      </p>

      <CodeExample id="algebra-exponentials-interest" language="python" title="compound_interest.py" :code="compoundInterestCode" />
    </ContentSection>

    <!-- Algorithm Complexity -->
    <ContentSection id="complexity" title="Algorithm Complexity" collapsible :default-expanded="false">
      <p class="mb-4">
        This is where exponentials and logarithms become critical for programmers. The difference
        between <MathBlock formula="O(\log n)" /> and <MathBlock formula="O(n)" /> - or worse,
        <MathBlock formula="O(2^n)" /> - determines whether your code is practical.
      </p>

      <h4 class="font-semibold mb-3">Why O(log n) Matters</h4>

      <div class="overflow-x-auto mb-6">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-2 pr-4">n</th>
              <th class="text-left py-2 pr-4">O(n)</th>
              <th class="text-left py-2 pr-4">O(log n)</th>
              <th class="text-left py-2">Speedup</th>
            </tr>
          </thead>
          <tbody class="font-mono">
            <tr class="border-b border-border">
              <td class="py-2 pr-4">1,000</td>
              <td class="py-2 pr-4">1,000</td>
              <td class="py-2 pr-4">10</td>
              <td class="py-2">100x</td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">1,000,000</td>
              <td class="py-2 pr-4">1,000,000</td>
              <td class="py-2 pr-4">20</td>
              <td class="py-2">50,000x</td>
            </tr>
            <tr>
              <td class="py-2 pr-4">1,000,000,000</td>
              <td class="py-2 pr-4">1,000,000,000</td>
              <td class="py-2 pr-4">30</td>
              <td class="py-2">33,000,000x</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-text-secondary mb-4">
        Binary search, balanced tree operations, and divide-and-conquer algorithms all achieve
        logarithmic time because they eliminate half the remaining work at each step.
      </p>

      <CodeExample id="algebra-exponentials-complexity" language="python" title="binary_vs_linear.py" :code="algorithmComplexityCode" />
    </ContentSection>

    <!-- Real-World Examples -->
    <ContentSection id="real-world" title="Real-World Examples" collapsible :default-expanded="false">
      <div class="space-y-6">
        <div>
          <h4 class="font-semibold mb-2">Binary in Computing</h4>
          <p class="text-text-secondary mb-2">
            How many bits do you need to represent a number?
            <MathBlock formula="\lceil \log_2(n) \rceil + 1" /> bits.
          </p>
          <CodeExample id="algebra-exponentials-bits" language="python" title="bits_needed.py" :code="binaryBitsCode" />
        </div>

        <div>
          <h4 class="font-semibold mb-2">pH Scale</h4>
          <p class="text-text-secondary mb-2">
            The pH scale is logarithmic:
            <MathBlock formula="pH = -\log_{10}[H^+]" />. Each unit represents a 10x change in
            acidity.
          </p>
          <CodeExample id="algebra-exponentials-ph" language="python" title="ph_scale.py" :code="phScaleCode" />
        </div>

        <div>
          <h4 class="font-semibold mb-2">Decibels (Sound)</h4>
          <p class="text-text-secondary mb-2">
            Sound intensity is measured logarithmically:
            <MathBlock formula="dB = 10 \cdot \log_{10}\left(\frac{P}{P_0}\right)" />
          </p>
          <CodeExample id="algebra-exponentials-decibels" language="python" title="decibels.py" :code="decibelsCode" />
        </div>
      </div>
    </ContentSection>

    <!-- Key Formulas Reference -->
    <ContentSection id="reference" title="Key Formulas Reference" collapsible :default-expanded="false">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-2 pr-4">Formula</th>
              <th class="text-left py-2 pr-4">Expression</th>
              <th class="text-left py-2">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Exponential</td>
              <td class="py-2 pr-4">
                <MathBlock formula="f(x) = b^x" />
              </td>
              <td class="py-2">
                <MathBlock formula="2^3 = 8" />
              </td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Logarithm</td>
              <td class="py-2 pr-4">
                <MathBlock formula="\log_b(x) = y \Leftrightarrow b^y = x" />
              </td>
              <td class="py-2">
                <MathBlock formula="\log_2(8) = 3" />
              </td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Inverse</td>
              <td class="py-2 pr-4">
                <MathBlock formula="\log_b(b^x) = x" />
              </td>
              <td class="py-2">
                <MathBlock formula="\log_2(2^3) = 3" />
              </td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Inverse</td>
              <td class="py-2 pr-4">
                <MathBlock formula="b^{\log_b(x)} = x" />
              </td>
              <td class="py-2">
                <MathBlock formula="2^{\log_2(8)} = 8" />
              </td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Doubling time</td>
              <td class="py-2 pr-4">
                <MathBlock formula="t = \frac{\ln(2)}{\ln(b)}" />
              </td>
              <td class="py-2"></td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Half-life</td>
              <td class="py-2 pr-4">
                <MathBlock formula="t = \frac{\ln(0.5)}{\ln(b)}" />
              </td>
              <td class="py-2"></td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Compound interest</td>
              <td class="py-2 pr-4">
                <MathBlock formula="A = P(1 + r/n)^{nt}" />
              </td>
              <td class="py-2"></td>
            </tr>
            <tr class="border-b border-border">
              <td class="py-2 pr-4">Continuous interest</td>
              <td class="py-2 pr-4">
                <MathBlock formula="A = Pe^{rt}" />
              </td>
              <td class="py-2"></td>
            </tr>
            <tr>
              <td class="py-2 pr-4">Change of base</td>
              <td class="py-2 pr-4">
                <MathBlock formula="\log_b(x) = \frac{\ln(x)}{\ln(b)}" />
              </td>
              <td class="py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </ContentSection>

    <RelatedTopics :topics="relatedTopics" />
  </TopicPage>
</template>
