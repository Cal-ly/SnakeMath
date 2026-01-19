<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import { TrigIdentityExplorer } from '@/components/widgets/TrigIdentityExplorer'

const relatedTopics = [
  {
    title: 'Unit Circle',
    path: '/trigonometry/unit-circle',
    description: 'The foundation for all trig identities',
  },
  {
    title: 'Right Triangle Trig',
    path: '/trigonometry/right-triangles',
    description: 'Where SOHCAHTOA comes from',
  },
  {
    title: 'Inverse Trig Functions',
    path: '/trigonometry/inverse-functions',
    description: 'Finding angles from ratios',
  },
  {
    title: 'Trig in Code',
    path: '/trigonometry/in-code',
    description: 'Practical programming applications',
  },
]

// Python code examples
const verifyCode = `import math

def verify_pythagorean(angle_deg):
    """
    Verify that sin²θ + cos²θ = 1 for any angle.
    This identity is fundamental to all of trigonometry.
    """
    rad = math.radians(angle_deg)
    sin_val = math.sin(rad)
    cos_val = math.cos(rad)
    result = sin_val**2 + cos_val**2
    return result  # Always 1.0 (within floating-point precision)

# Test at various angles
for angle in [0, 30, 45, 60, 90, 180, 270]:
    result = verify_pythagorean(angle)
    print(f"θ = {angle}°: sin²θ + cos²θ = {result:.10f}")`

const simplifyCode = `import math

def simplify_expression(angle_deg):
    """
    Use identities to simplify trigonometric expressions.

    Example: Simplify (1 - cos²θ) / sin θ
    Using sin²θ + cos²θ = 1, we know 1 - cos²θ = sin²θ
    So: sin²θ / sin θ = sin θ
    """
    rad = math.radians(angle_deg)

    # The "hard" way
    original = (1 - math.cos(rad)**2) / math.sin(rad)

    # The simplified way (using the identity)
    simplified = math.sin(rad)

    return original, simplified  # Both equal!

# Verify
orig, simp = simplify_expression(45)
print(f"Original: {orig:.6f}")
print(f"Simplified: {simp:.6f}")`

const rotationCode = `import math

def rotate_point(x, y, angle_deg):
    """
    Rotate a point (x, y) around the origin by angle degrees.

    Uses sum formulas internally:
    - x' = x cos θ - y sin θ
    - y' = x sin θ + y cos θ

    This is the foundation of 2D rotation in games/graphics.
    """
    rad = math.radians(angle_deg)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)

    new_x = x * cos_a - y * sin_a
    new_y = x * sin_a + y * cos_a

    return new_x, new_y

# Rotate the point (1, 0) by 45°
x, y = rotate_point(1, 0, 45)
print(f"(1, 0) rotated 45° = ({x:.3f}, {y:.3f})")
# Output: (0.707, 0.707) - on the unit circle at 45°`

const waveCode = `import math

def wave_interference(x, freq1, freq2):
    """
    Model wave interference using product-to-sum identities.

    When two waves of different frequencies combine, the result
    can be expressed as a sum of waves at the sum and difference
    frequencies. This is the basis of AM radio and beat frequencies.

    cos A cos B = ½[cos(A-B) + cos(A+B)]
    """
    # Two waves at different frequencies
    wave1 = math.cos(freq1 * x)
    wave2 = math.cos(freq2 * x)

    # Product (what actually happens when waves combine)
    product = wave1 * wave2

    # Using the identity (mathematically equivalent)
    A = freq1 * x
    B = freq2 * x
    identity = 0.5 * (math.cos(A - B) + math.cos(A + B))

    return product, identity  # Both equal!

# Example: Two audio tones
for x in [0, 0.5, 1.0]:
    prod, ident = wave_interference(x, 440, 442)  # 440 Hz and 442 Hz
    print(f"x={x}: product={prod:.4f}, identity={ident:.4f}")`
</script>

<template>
  <TopicPage
    title="Trigonometric Identities"
    description="The fundamental equations that relate trigonometric functions to each other."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="Why Identities Matter" icon="fa-solid fa-equals" collapsible>
        <p class="mb-4">
          Trig identities are equations that are <strong>always true</strong> for any angle.
          They're the "cheat codes" of trigonometry — ways to transform complex expressions into
          simpler ones, or to prove that two different-looking formulas actually mean the same thing.
        </p>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-6">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            The Big Picture
          </p>
          <p class="text-text-secondary">
            Every identity comes from the <strong>unit circle</strong>. Since a point on the unit
            circle has coordinates (cos θ, sin θ) and lies on x² + y² = 1, we get
            cos²θ + sin²θ = 1. All other identities flow from this foundation.
          </p>
        </div>

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mb-6">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-book-open mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              "A dozen" = "12". Different ways to express the same quantity. Similarly,
              sin²θ + cos²θ and 1 are different ways to write the same value.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Refactoring code that does the same thing more efficiently.
              <code class="text-xs">x*2</code> vs <code class="text-xs">x+x</code> vs
              <code class="text-xs">x&lt;&lt;1</code> — same result, different expressions.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-circle-notch mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Two different paths on the unit circle that arrive at the same point. The
              identities guarantee they'll always meet, no matter the starting angle.
            </p>
          </div>
        </div>

        <!-- Common pitfall -->
        <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Direction Matters!
          </p>
          <p class="text-text-secondary">
            Identities work in <em>both</em> directions, but the useful direction depends on context.
            Sometimes you want to simplify (sin²θ → 1 - cos²θ), sometimes expand (sin(2θ) → 2 sin θ cos θ).
            The goal is usually to match what you have to what you need.
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Identity Explorer" icon="fa-solid fa-calculator" collapsible>
        <p class="mb-4">
          Select a category and explore each identity. Adjust the angle slider to verify that
          both sides of the equation always equal each other. Expand the proofs to see the
          algebraic derivation.
        </p>

        <TrigIdentityExplorer :sync-url="true" />
      </ContentSection>

      <!-- Fundamental Identities -->
      <ContentSection
        id="fundamental"
        title="The Fundamental Identities"
        icon="fa-solid fa-star"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          These three categories form the foundation. Every other identity can be derived from them.
        </p>

        <div class="space-y-6">
          <!-- Pythagorean -->
          <div class="p-4 rounded-lg border border-primary bg-primary/5">
            <h4 class="font-semibold text-primary mb-3">
              <i class="fa-solid fa-square-root-variable mr-2" aria-hidden="true" />
              Pythagorean Identities
            </h4>
            <p class="text-sm text-text-muted mb-3">
              From the unit circle equation x² + y² = 1:
            </p>
            <div class="space-y-2 overflow-x-auto">
              <MathBlock formula="\sin^2\theta + \cos^2\theta = 1" display />
              <MathBlock formula="1 + \tan^2\theta = \sec^2\theta \quad \text{(divide by } \cos^2\theta \text{)}" display />
              <MathBlock formula="1 + \cot^2\theta = \csc^2\theta \quad \text{(divide by } \sin^2\theta \text{)}" display />
            </div>
          </div>

          <!-- Quotient -->
          <div class="p-4 rounded-lg border border-border bg-surface">
            <h4 class="font-semibold text-text-primary mb-3">
              <i class="fa-solid fa-divide mr-2" aria-hidden="true" />
              Quotient Identities
            </h4>
            <p class="text-sm text-text-muted mb-3">
              Tangent and cotangent as ratios:
            </p>
            <div class="space-y-2 overflow-x-auto">
              <MathBlock formula="\tan\theta = \frac{\sin\theta}{\cos\theta}" display />
              <MathBlock formula="\cot\theta = \frac{\cos\theta}{\sin\theta}" display />
            </div>
          </div>

          <!-- Reciprocal -->
          <div class="p-4 rounded-lg border border-border bg-surface">
            <h4 class="font-semibold text-text-primary mb-3">
              <i class="fa-solid fa-arrows-rotate mr-2" aria-hidden="true" />
              Reciprocal Identities
            </h4>
            <p class="text-sm text-text-muted mb-3">
              The "co-" functions are reciprocals:
            </p>
            <div class="space-y-2 overflow-x-auto">
              <MathBlock formula="\csc\theta = \frac{1}{\sin\theta}, \quad \sec\theta = \frac{1}{\cos\theta}, \quad \cot\theta = \frac{1}{\tan\theta}" display />
            </div>
          </div>
        </div>
      </ContentSection>

      <!-- Sum and Difference -->
      <ContentSection
        id="sum-difference"
        title="Sum & Difference Formulas"
        icon="fa-solid fa-plus-minus"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          These let you find the trig functions of a sum or difference of two angles. They're
          essential for rotation matrices in graphics and physics.
        </p>

        <div class="space-y-4 mb-6 overflow-x-auto">
          <MathBlock formula="\sin(A \pm B) = \sin A \cos B \pm \cos A \sin B" display />
          <MathBlock formula="\cos(A \pm B) = \cos A \cos B \mp \sin A \sin B" display />
          <MathBlock formula="\tan(A + B) = \frac{\tan A + \tan B}{1 - \tan A \tan B}" display />
        </div>

        <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <p class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            <i class="fa-solid fa-cube mr-2" aria-hidden="true" />
            Application: Rotation Matrices
          </p>
          <p class="text-text-secondary text-sm">
            When you rotate a point (x, y) by angle θ, the new coordinates use these formulas:
            x' = x cos θ - y sin θ, y' = x sin θ + y cos θ. This is the foundation of all 2D
            rotation in games and graphics.
          </p>
        </div>
      </ContentSection>

      <!-- Double Angle -->
      <ContentSection
        id="double-angle"
        title="Double Angle Formulas"
        icon="fa-solid fa-angles-right"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Special cases of sum formulas when both angles are the same (A = B = θ):
        </p>

        <div class="space-y-4 mb-6 overflow-x-auto">
          <MathBlock formula="\sin(2\theta) = 2\sin\theta\cos\theta" display />
          <MathBlock formula="\cos(2\theta) = \cos^2\theta - \sin^2\theta = 2\cos^2\theta - 1 = 1 - 2\sin^2\theta" display />
          <MathBlock formula="\tan(2\theta) = \frac{2\tan\theta}{1 - \tan^2\theta}" display />
        </div>

        <p class="text-sm text-text-muted">
          <strong>Note:</strong> The three forms of cos(2θ) come from substituting sin²θ = 1 - cos²θ
          or cos²θ = 1 - sin²θ. Each form is useful in different situations.
        </p>
      </ContentSection>

      <!-- Half Angle -->
      <ContentSection
        id="half-angle"
        title="Half Angle Formulas"
        icon="fa-solid fa-divide"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Derived from the double angle formulas by solving for the half-angle:
        </p>

        <div class="space-y-4 mb-6 overflow-x-auto">
          <MathBlock formula="\sin\frac{\theta}{2} = \pm\sqrt{\frac{1 - \cos\theta}{2}}" display />
          <MathBlock formula="\cos\frac{\theta}{2} = \pm\sqrt{\frac{1 + \cos\theta}{2}}" display />
          <MathBlock formula="\tan\frac{\theta}{2} = \frac{1 - \cos\theta}{\sin\theta} = \frac{\sin\theta}{1 + \cos\theta}" display />
        </div>

        <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
            <i class="fa-solid fa-plus-minus mr-2" aria-hidden="true" />
            The ± Sign
          </p>
          <p class="text-text-secondary text-sm">
            The ± in the half-angle formulas means you need to determine the correct sign based
            on which quadrant θ/2 is in. This is a common source of errors!
          </p>
        </div>
      </ContentSection>

      <!-- Code Examples -->
      <ContentSection
        id="code"
        title="Identities in Code"
        icon="fa-solid fa-code"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-6">
          Here's how these identities appear in practical programming:
        </p>

        <div class="space-y-6">
          <div>
            <h4 class="font-semibold text-text-primary mb-2">
              Verifying Identities Numerically
            </h4>
            <CodeExample id="trig-verify-identity" language="python" title="verify_identity.py" :code="verifyCode" />
          </div>

          <div>
            <h4 class="font-semibold text-text-primary mb-2">
              Simplifying Expressions
            </h4>
            <CodeExample id="trig-simplify" language="python" title="simplify.py" :code="simplifyCode" />
          </div>

          <div>
            <h4 class="font-semibold text-text-primary mb-2">
              2D Rotation (Game Dev)
            </h4>
            <CodeExample id="trig-rotation" language="python" title="rotate_point.py" :code="rotationCode" />
          </div>

          <div>
            <h4 class="font-semibold text-text-primary mb-2">
              Wave Interference (Audio/Signal Processing)
            </h4>
            <CodeExample id="trig-waves" language="python" title="wave_interference.py" :code="waveCode" />
          </div>
        </div>
      </ContentSection>

      <!-- Applications -->
      <ContentSection
        id="applications"
        title="Where Programmers Use This"
        icon="fa-solid fa-rocket"
        :default-expanded="false"
        collapsible
      >
        <div class="grid gap-4 md:grid-cols-2">
          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-gamepad text-primary mr-2" aria-hidden="true" />
              Physics Engines
            </p>
            <p class="text-sm text-text-muted">
              Rotation calculations in game physics use sum formulas. Simplifying with identities
              means fewer calculations per frame.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-music text-primary mr-2" aria-hidden="true" />
              Audio Synthesis
            </p>
            <p class="text-sm text-text-muted">
              Wave interference patterns use product-to-sum formulas. This is how synthesizers
              create complex sounds from simple waves.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-microchip text-primary mr-2" aria-hidden="true" />
              Shader Optimization
            </p>
            <p class="text-sm text-text-muted">
              GPUs have fast approximations for trig functions. Using identities to reduce the
              number of calls can significantly improve performance.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-wave-square text-primary mr-2" aria-hidden="true" />
              Signal Processing
            </p>
            <p class="text-sm text-text-muted">
              Fourier transforms decompose signals into sine waves. Understanding identities
              helps you work with the math behind audio, image, and data analysis.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
