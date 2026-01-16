<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'

const relatedTopics = [
  { title: 'Variables', path: '/basics/variables', description: 'Named values' },
  { title: 'Functions', path: '/basics/functions', description: 'f(x) notation' },
]

// Operator precedence data
const operatorPrecedence = [
  { operator: '**', name: 'Exponentiation', precedence: 'Highest', associativity: 'Right' },
  { operator: '+x, -x', name: 'Unary plus/minus', precedence: 'High', associativity: 'Right' },
  {
    operator: '*, /, //, %',
    name: 'Multiplication, Division',
    precedence: 'Medium',
    associativity: 'Left',
  },
  { operator: '+, -', name: 'Addition, Subtraction', precedence: 'Low', associativity: 'Left' },
]

// Code examples
const whyOrderMattersCode = `# Same numbers, different results!

result1 = 2 + 3 * 4
print(result1)  # 14 (not 20!)

# Why? Multiplication happens BEFORE addition
# 2 + 3 * 4
# = 2 + 12    (multiply first)
# = 14        (then add)

# If you want addition first, use parentheses:
result2 = (2 + 3) * 4
print(result2)  # 20

# Parentheses override the default order`

const pemdasCode = `# PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction
# (Also called BODMAS: Brackets, Orders, Division/Multiplication, Addition/Subtraction)

# P - Parentheses first
print((2 + 3) * 4)  # 20

# E - Exponents (powers)
print(2 + 3 ** 2)   # 11 (not 25!)
# = 2 + 9 = 11

# MD - Multiplication and Division (left to right)
print(10 / 2 * 5)   # 25 (not 1!)
# = 5 * 5 = 25

# AS - Addition and Subtraction (left to right)
print(10 - 3 + 2)   # 9 (not 5!)
# = 7 + 2 = 9`

const exponentAssociativityCode = `# Exponentiation is RIGHT-associative
# This is different from most operators!

result = 2 ** 3 ** 2
print(result)  # 512

# Python evaluates this as:
# 2 ** 3 ** 2
# = 2 ** (3 ** 2)  # Right to left!
# = 2 ** 9
# = 512

# NOT as:
# (2 ** 3) ** 2
# = 8 ** 2
# = 64

# If you want left-to-right, use parentheses:
result2 = (2 ** 3) ** 2
print(result2)  # 64`

const unaryMinusCode = `# GOTCHA: Unary minus and exponentiation

result = -3 ** 2
print(result)  # -9 (surprise!)

# Python evaluates this as:
# -(3 ** 2) = -(9) = -9

# NOT as:
# (-3) ** 2 = 9

# The exponent has higher precedence than unary minus!
# If you want to square -3:
result2 = (-3) ** 2
print(result2)  # 9

# This is one of the most common gotchas in Python!`

const leftToRightCode = `# Same-precedence operators: left to right

# Subtraction chain
result = 10 - 5 - 2
print(result)  # 3

# Evaluated as:
# (10 - 5) - 2
# = 5 - 2
# = 3

# NOT as:
# 10 - (5 - 2)
# = 10 - 3
# = 7

# Division chain
result2 = 24 / 4 / 2
print(result2)  # 3.0

# Evaluated as:
# (24 / 4) / 2
# = 6 / 2
# = 3.0`

const parenthesesCode = `# When in doubt, use parentheses!

# Clear and explicit:
result = (a + b) * (c - d)

# Compound interest: A = P(1 + r/n)^(nt)
P = 1000  # principal
r = 0.05  # annual rate
n = 12    # times compounded per year
t = 10    # years

# Without parentheses this would be wrong!
A = P * (1 + r/n) ** (n * t)
print(f"Future value: \${A:.2f}")  # $1,647.01

# The parentheses make the formula readable
# AND ensure correct evaluation`
</script>

<template>
  <TopicPage
    title="Order of Operations"
    description="PEMDAS, operator precedence, and why 2 + 3 × 4 = 14 (not 20)."
  >
    <div class="space-y-8">
      <!-- Why Order Matters -->
      <ContentSection id="why" title="Why Order Matters" icon="fa-solid fa-triangle-exclamation">
        <p class="mb-4">
          Consider this expression: <MathBlock formula="2 + 3 \times 4" />. What's the answer?
        </p>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 class="font-medium text-red-700 dark:text-red-400 mb-2">
              <i class="fa-solid fa-xmark mr-1" aria-hidden="true" />
              Wrong (left to right)
            </h4>
            <MathBlock formula="(2 + 3) \times 4 = 20" />
          </div>
          <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 class="font-medium text-green-700 dark:text-green-400 mb-2">
              <i class="fa-solid fa-check mr-1" aria-hidden="true" />
              Correct (multiplication first)
            </h4>
            <MathBlock formula="2 + (3 \times 4) = 14" />
          </div>
        </div>

        <p class="mb-4">
          Without rules, the same expression could give different results. That's why mathematicians
          (and programming languages) follow strict <strong>precedence rules</strong>.
        </p>

        <CodeExample id="basics-orderops-matters" :code="whyOrderMattersCode" language="python" title="order_matters.py" />
      </ContentSection>

      <!-- PEMDAS -->
      <ContentSection id="pemdas" title="PEMDAS / BODMAS" icon="fa-solid fa-list-ol">
        <p class="mb-4">
          The standard order of operations is remembered by the mnemonic <strong>PEMDAS</strong>
          (or BODMAS in some countries):
        </p>

        <div class="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
          <div class="p-3 bg-primary/10 rounded-lg text-center">
            <div class="text-2xl font-bold text-primary">P</div>
            <div class="text-xs text-text-muted">Parentheses</div>
          </div>
          <div class="p-3 bg-primary/10 rounded-lg text-center">
            <div class="text-2xl font-bold text-primary">E</div>
            <div class="text-xs text-text-muted">Exponents</div>
          </div>
          <div class="p-3 bg-primary/10 rounded-lg text-center">
            <div class="text-2xl font-bold text-primary">M</div>
            <div class="text-xs text-text-muted">Multiply</div>
          </div>
          <div class="p-3 bg-primary/10 rounded-lg text-center">
            <div class="text-2xl font-bold text-primary">D</div>
            <div class="text-xs text-text-muted">Divide</div>
          </div>
          <div class="p-3 bg-primary/10 rounded-lg text-center">
            <div class="text-2xl font-bold text-primary">A</div>
            <div class="text-xs text-text-muted">Add</div>
          </div>
          <div class="p-3 bg-primary/10 rounded-lg text-center">
            <div class="text-2xl font-bold text-primary">S</div>
            <div class="text-xs text-text-muted">Subtract</div>
          </div>
        </div>

        <div class="p-3 bg-math-highlight rounded-lg mb-4">
          <strong>Important:</strong> Multiplication and Division have the <em>same</em> precedence.
          So do Addition and Subtraction. Within the same level, evaluate left to right.
        </div>

        <CodeExample id="basics-orderops-pemdas" :code="pemdasCode" language="python" title="pemdas.py" />
      </ContentSection>

      <!-- Precedence Table -->
      <ContentSection
        id="precedence"
        title="Python Operator Precedence"
        icon="fa-solid fa-table"
        collapsible
      >
        <p class="mb-4">
          Python follows the same rules as mathematics, plus some extras for programming:
        </p>

        <div class="overflow-x-auto mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b-2 border-border">
                <th class="text-left py-2 px-3">Operator</th>
                <th class="text-left py-2 px-3">Name</th>
                <th class="text-left py-2 px-3">Precedence</th>
                <th class="text-left py-2 px-3">Associativity</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="op in operatorPrecedence"
                :key="op.operator"
                class="border-b border-border/50"
              >
                <td class="py-2 px-3 font-mono text-primary">{{ op.operator }}</td>
                <td class="py-2 px-3">{{ op.name }}</td>
                <td class="py-2 px-3">{{ op.precedence }}</td>
                <td class="py-2 px-3">{{ op.associativity }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-text-muted text-sm">
          Operators at the top of the table bind more tightly than those below.
        </p>
      </ContentSection>

      <!-- Associativity -->
      <ContentSection
        id="associativity"
        title="Associativity: Left vs Right"
        icon="fa-solid fa-arrows-left-right"
        collapsible
      >
        <p class="mb-4">
          When operators have the same precedence, <strong>associativity</strong> determines the
          order: left-to-right or right-to-left.
        </p>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg">
            <h4 class="font-medium text-primary mb-2">Left-to-Right (most operators)</h4>
            <MathBlock formula="10 - 5 - 2 = (10 - 5) - 2 = 3" display />
          </div>
          <div class="p-4 bg-surface-alt rounded-lg">
            <h4 class="font-medium text-primary mb-2">Right-to-Left (exponentiation)</h4>
            <MathBlock formula="2^{3^2} = 2^{(3^2)} = 512" display />
          </div>
        </div>

        <CodeExample id="basics-orderops-lefttoright" :code="leftToRightCode" language="python" title="left_to_right.py" />
      </ContentSection>

      <!-- Common Mistakes -->
      <ContentSection
        id="gotchas"
        title="Common Gotchas"
        icon="fa-solid fa-bug"
        collapsible
      >
        <h4 class="font-medium text-text-primary mb-3">1. Exponentiation is Right-Associative</h4>
        <p class="mb-4 text-text-secondary">
          Unlike most operators, <code>**</code> groups from right to left:
        </p>
        <CodeExample id="basics-orderops-exponent" :code="exponentAssociativityCode" language="python" title="exponent_associativity.py" />

        <h4 class="font-medium text-text-primary mb-3 mt-6">2. Unary Minus vs Exponentiation</h4>
        <p class="mb-4 text-text-secondary">
          This trips up almost everyone the first time:
        </p>
        <CodeExample id="basics-orderops-unaryminus" :code="unaryMinusCode" language="python" title="unary_minus.py" />

        <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="font-medium text-red-700 dark:text-red-400 mb-2">
            <i class="fa-solid fa-exclamation-triangle mr-1" aria-hidden="true" />
            Remember
          </p>
          <p class="text-red-600 dark:text-red-300 text-sm">
            <code>-3 ** 2</code> is <strong>-9</strong>, not 9. Use <code>(-3) ** 2</code> if you want 9.
          </p>
        </div>
      </ContentSection>

      <!-- Parentheses -->
      <ContentSection
        id="parentheses"
        title="Parentheses: Your Best Friend"
        icon="fa-solid fa-parentheses"
        collapsible
      >
        <p class="mb-4">
          Parentheses always override the default order. When in doubt, use them!
        </p>

        <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
          <p class="font-medium text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-1" aria-hidden="true" />
            Best Practice
          </p>
          <p class="text-text-secondary text-sm">
            Even when parentheses aren't needed, they make code <em>clearer</em>. Future you (and
            your teammates) will thank you.
          </p>
        </div>

        <CodeExample id="basics-orderops-parentheses" :code="parenthesesCode" language="python" title="parentheses.py" />
      </ContentSection>

      <!-- Quick Reference -->
      <ContentSection id="summary" title="Quick Reference" icon="fa-solid fa-list-check">
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 bg-surface-alt rounded-lg">
            <span class="font-bold text-primary w-8">1.</span>
            <div>
              <strong>Parentheses</strong> — Always evaluated first
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 bg-surface-alt rounded-lg">
            <span class="font-bold text-primary w-8">2.</span>
            <div>
              <strong>Exponents</strong> — Right-to-left! <code>2**3**2 = 512</code>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 bg-surface-alt rounded-lg">
            <span class="font-bold text-primary w-8">3.</span>
            <div>
              <strong>Unary ±</strong> — After exponents! <code>-3**2 = -9</code>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 bg-surface-alt rounded-lg">
            <span class="font-bold text-primary w-8">4.</span>
            <div>
              <strong>Multiplication & Division</strong> — Left-to-right, same precedence
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 bg-surface-alt rounded-lg">
            <span class="font-bold text-primary w-8">5.</span>
            <div>
              <strong>Addition & Subtraction</strong> — Left-to-right, same precedence
            </div>
          </div>
        </div>
      </ContentSection>
    </div>

    <template #related>
      <RelatedTopics :topics="relatedTopics" />
    </template>
  </TopicPage>
</template>
