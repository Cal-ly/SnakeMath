<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import { UnitCircleExplorer } from '@/components/widgets/UnitCircleExplorer'

const relatedTopics = [
  {
    title: 'Trigonometry Overview',
    path: '/trigonometry',
    description: 'All trigonometry topics',
  },
  {
    title: 'Vectors',
    path: '/linear-algebra/vectors',
    description: 'Unit vectors and direction calculations use trig',
  },
  {
    title: 'Limits',
    path: '/calculus/limits',
    description: 'The famous sin(x)/x limit equals 1',
  },
  {
    title: 'Functions',
    path: '/basics/functions',
    description: 'Trig functions map angles to coordinates',
  },
]

// Python code examples
const trigValuesCode = `import math

def trig_values(angle_degrees):
    """Calculate trig values for an angle."""
    radians = math.radians(angle_degrees)
    return {
        'sin': math.sin(radians),
        'cos': math.cos(radians),
        'tan': math.tan(radians) if angle_degrees % 180 != 90 else None
    }

# Example
values = trig_values(45)
print(f"sin(45°) = {values['sin']:.4f}")  # ≈ 0.7071
print(f"cos(45°) = {values['cos']:.4f}")  # ≈ 0.7071
print(f"tan(45°) = {values['tan']:.4f}")  # = 1.0000`

const quadrantCode = `def get_quadrant(degrees):
    """Determine quadrant and signs for an angle."""
    normalized = degrees % 360

    if 0 <= normalized < 90:
        return 1, {'sin': '+', 'cos': '+', 'tan': '+'}
    elif 90 <= normalized < 180:
        return 2, {'sin': '+', 'cos': '-', 'tan': '-'}
    elif 180 <= normalized < 270:
        return 3, {'sin': '-', 'cos': '-', 'tan': '+'}
    else:
        return 4, {'sin': '-', 'cos': '+', 'tan': '-'}

# Example
quadrant, signs = get_quadrant(135)
print(f"135° is in Quadrant {quadrant}")
print(f"Signs: sin {signs['sin']}, cos {signs['cos']}, tan {signs['tan']}")`

const conversionCode = `import math

def to_radians(degrees):
    return degrees * math.pi / 180

def to_degrees(radians):
    return radians * 180 / math.pi

# Examples
print(f"90° = {to_radians(90):.4f} radians")  # ≈ 1.5708
print(f"π radians = {to_degrees(math.pi)}°")   # = 180`

const rotatePointCode = `import math

def rotate_point(x, y, angle_degrees):
    """Rotate a point around the origin."""
    radians = math.radians(angle_degrees)
    cos_a = math.cos(radians)
    sin_a = math.sin(radians)

    new_x = x * cos_a - y * sin_a
    new_y = x * sin_a + y * cos_a

    return new_x, new_y

# Rotate (1, 0) by 90° → (0, 1)
result = rotate_point(1, 0, 90)
print(f"Rotated point: ({result[0]:.2f}, {result[1]:.2f})")`
</script>

<template>
  <TopicPage
    title="Unit Circle"
    description="The foundation of all trigonometry - understanding how angles map to coordinates."
  >
    <div class="space-y-8">
      <!-- What is the Unit Circle -->
      <ContentSection id="what-is-unit-circle" title="What is the Unit Circle?" icon="fa-solid fa-circle-notch" collapsible>
        <p class="mb-4">
          The <strong>unit circle</strong> is simply a circle with radius 1, centered at the origin
          (0, 0). What makes it special is the beautiful relationship between angles and coordinates:
        </p>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            The Key Insight
          </p>
          <p class="text-text-secondary">
            For any angle θ, the point on the unit circle is
            <strong>(cos θ, sin θ)</strong>. The x-coordinate is the cosine, and the y-coordinate is
            the sine. That's it — that's the entire foundation of trigonometry!
          </p>
        </div>

        <p class="mb-4">
          In Python terms: <code>point = (math.cos(angle), math.sin(angle))</code>
        </p>

        <div class="text-center mb-4">
          <MathBlock formula="(\cos\theta, \sin\theta) \text{ lies on the circle } x^2 + y^2 = 1" display />
        </div>

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-clock mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Think of it like a clock face where every "time" (angle) has a unique fingerprint given
              by its (x, y) coordinates. The hour hand's tip traces out the unit circle.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              It's a lookup table from angle → (x, y). Feed in any angle, get back the exact
              coordinates for rotation, animation, or direction calculations.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-wave-square mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              As you walk around the circle, the x-coordinate traces a cosine wave and the
              y-coordinate traces a sine wave. Circular motion = two waves in sync.
            </p>
          </div>
        </div>

        <!-- Common pitfall -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Radians vs Degrees
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            Python's <code>math.sin()</code> and <code>math.cos()</code> expect <strong>radians</strong>,
            not degrees! <code>math.sin(90)</code> does NOT give you 1 — it gives ~0.894.
            Always use <code>math.radians(90)</code> or <code>math.sin(math.pi/2)</code> to get the
            expected result.
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Explorer" icon="fa-solid fa-hand-pointer" collapsible>
        <p class="mb-4">
          Use the slider or click special angle buttons to explore how angles map to coordinates and
          trigonometric values. Toggle "Show wave graphs" to see how the sine and cosine functions
          relate to circular motion.
        </p>

        <UnitCircleExplorer :sync-url="true" />
      </ContentSection>

      <!-- The Trigonometric Functions -->
      <ContentSection
        id="trig-functions"
        title="The Trigonometric Functions"
        icon="fa-solid fa-calculator"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          The three primary trig functions each represent a different relationship:
        </p>

        <div class="space-y-4 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-1">
              <MathBlock formula="\sin\theta" class="inline" /> — The y-coordinate
            </p>
            <p class="text-sm text-text-muted">
              Sine gives you the vertical projection. In a right triangle, it's opposite/hypotenuse.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-1">
              <MathBlock formula="\cos\theta" class="inline" /> — The x-coordinate
            </p>
            <p class="text-sm text-text-muted">
              Cosine gives you the horizontal projection. In a right triangle, it's adjacent/hypotenuse.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-1">
              <MathBlock formula="\tan\theta = \frac{\sin\theta}{\cos\theta}" class="inline" /> — The ratio
            </p>
            <p class="text-sm text-text-muted">
              Tangent is the slope of the line from origin to the point. Undefined when cos θ = 0 (at 90° and 270°).
            </p>
          </div>
        </div>

        <CodeExample id="trig-unitcircle-values" language="python" title="trig_values.py" :code="trigValuesCode" />
      </ContentSection>

      <!-- Special Angles -->
      <ContentSection
        id="special-angles"
        title="Special Angles"
        icon="fa-solid fa-star"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Some angles have "nice" exact values that you'll see frequently. These come from the
          30-60-90 and 45-45-90 triangles:
        </p>

        <div class="overflow-x-auto mb-6">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-surface-alt">
                <th class="p-2 border border-border text-left">Angle</th>
                <th class="p-2 border border-border text-center">sin</th>
                <th class="p-2 border border-border text-center">cos</th>
                <th class="p-2 border border-border text-center">tan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-2 border border-border font-mono">0°</td>
                <td class="p-2 border border-border text-center font-mono">0</td>
                <td class="p-2 border border-border text-center font-mono">1</td>
                <td class="p-2 border border-border text-center font-mono">0</td>
              </tr>
              <tr>
                <td class="p-2 border border-border font-mono">30°</td>
                <td class="p-2 border border-border text-center font-mono">1/2</td>
                <td class="p-2 border border-border text-center font-mono">√3/2</td>
                <td class="p-2 border border-border text-center font-mono">√3/3</td>
              </tr>
              <tr>
                <td class="p-2 border border-border font-mono">45°</td>
                <td class="p-2 border border-border text-center font-mono">√2/2</td>
                <td class="p-2 border border-border text-center font-mono">√2/2</td>
                <td class="p-2 border border-border text-center font-mono">1</td>
              </tr>
              <tr>
                <td class="p-2 border border-border font-mono">60°</td>
                <td class="p-2 border border-border text-center font-mono">√3/2</td>
                <td class="p-2 border border-border text-center font-mono">1/2</td>
                <td class="p-2 border border-border text-center font-mono">√3</td>
              </tr>
              <tr>
                <td class="p-2 border border-border font-mono">90°</td>
                <td class="p-2 border border-border text-center font-mono">1</td>
                <td class="p-2 border border-border text-center font-mono">0</td>
                <td class="p-2 border border-border text-center font-mono text-text-muted">undef</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-sm text-text-muted">
          <strong>Pattern:</strong> Notice that sin values go 0, 1/2, √2/2, √3/2, 1 as you go from
          0° to 90°. Cos values are the same but reversed!
        </p>
      </ContentSection>

      <!-- Quadrants and Signs -->
      <ContentSection
        id="quadrants"
        title="Quadrants and Signs"
        icon="fa-solid fa-arrows-up-down-left-right"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          The coordinate plane is divided into four quadrants. Each quadrant has a pattern for which
          trig functions are positive:
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-primary bg-primary/5">
            <p class="font-semibold text-primary mb-1">Quadrant I (0° - 90°)</p>
            <p class="text-sm">All positive: sin +, cos +, tan +</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-semibold text-text-primary mb-1">Quadrant II (90° - 180°)</p>
            <p class="text-sm">Sin positive: sin +, cos −, tan −</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-semibold text-text-primary mb-1">Quadrant III (180° - 270°)</p>
            <p class="text-sm">Tan positive: sin −, cos −, tan +</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-semibold text-text-primary mb-1">Quadrant IV (270° - 360°)</p>
            <p class="text-sm">Cos positive: sin −, cos +, tan −</p>
          </div>
        </div>

        <p class="mb-4">
          <strong>Mnemonic:</strong> "All Students Take Calculus" — <strong>A</strong>ll,
          <strong>S</strong>in, <strong>T</strong>an, <strong>C</strong>os for quadrants I through IV.
        </p>

        <CodeExample id="trig-unitcircle-quadrants" language="python" title="quadrant_signs.py" :code="quadrantCode" />
      </ContentSection>

      <!-- Radians vs Degrees -->
      <ContentSection
        id="radians"
        title="Radians vs Degrees"
        icon="fa-solid fa-rotate"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Degrees (360° in a full circle) are intuitive but arbitrary. Radians (2π in a full circle)
          are mathematically natural — they measure the arc length on a unit circle.
        </p>

        <div class="text-center mb-4">
          <MathBlock formula="\text{radians} = \text{degrees} \times \frac{\pi}{180}" display />
        </div>

        <p class="mb-4">Key conversions to memorize:</p>

        <div class="flex flex-wrap gap-4 justify-center mb-6">
          <div class="px-4 py-2 rounded bg-surface border border-border font-mono text-sm">
            90° = π/2
          </div>
          <div class="px-4 py-2 rounded bg-surface border border-border font-mono text-sm">
            180° = π
          </div>
          <div class="px-4 py-2 rounded bg-surface border border-border font-mono text-sm">
            270° = 3π/2
          </div>
          <div class="px-4 py-2 rounded bg-surface border border-border font-mono text-sm">
            360° = 2π
          </div>
        </div>

        <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
          <p class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Important for Programming
          </p>
          <p class="text-text-secondary">
            Python's <code>math.sin()</code> and <code>math.cos()</code> expect radians! Always
            convert with <code>math.radians()</code> if you have degrees.
          </p>
        </div>

        <CodeExample id="trig-unitcircle-conversion" language="python" title="deg_rad_convert.py" :code="conversionCode" />
      </ContentSection>

      <!-- Programmer Applications -->
      <ContentSection
        id="applications"
        title="Programmer Applications"
        icon="fa-solid fa-code"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Here's where trig shows up in real programming tasks:
        </p>

        <div class="space-y-6">
          <div>
            <h4 class="font-semibold text-text-primary mb-2">
              <i class="fa-solid fa-rotate text-primary mr-2" aria-hidden="true" />
              Rotation
            </h4>
            <p class="text-sm text-text-muted mb-4">
              To rotate a point (x, y) around the origin by angle θ:
            </p>
            <div class="text-center mb-4">
              <MathBlock
                formula="x' = x \cos\theta - y \sin\theta \\ y' = x \sin\theta + y \cos\theta"
                display
              />
            </div>
            <CodeExample id="trig-unitcircle-rotation" language="python" title="rotate_point.py" :code="rotatePointCode" />
          </div>

          <div>
            <h4 class="font-semibold text-text-primary mb-2">
              <i class="fa-solid fa-wave-square text-primary mr-2" aria-hidden="true" />
              Smooth Animations
            </h4>
            <p class="text-sm text-text-muted">
              <code>sin(time * speed)</code> creates smooth oscillation between -1 and 1. Perfect
              for bouncing, pulsing, or breathing effects. The wave graphs in the explorer above
              show exactly how this works.
            </p>
          </div>

          <div>
            <h4 class="font-semibold text-text-primary mb-2">
              <i class="fa-solid fa-gamepad text-primary mr-2" aria-hidden="true" />
              Game Movement
            </h4>
            <p class="text-sm text-text-muted">
              To move a character in a direction: <code>x += speed * cos(angle)</code>,
              <code>y += speed * sin(angle)</code>. The unit circle tells you exactly how much of
              the speed goes in each direction.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Key Identities -->
      <ContentSection id="identities" title="Key Identities" icon="fa-solid fa-equals" collapsible :default-expanded="false">
        <p class="mb-4">
          These fundamental relationships are worth knowing:
        </p>

        <div class="space-y-3">
          <div class="p-3 rounded bg-surface border border-border">
            <p class="font-medium text-text-primary">Pythagorean Identity</p>
            <div class="text-center">
              <MathBlock formula="\sin^2\theta + \cos^2\theta = 1" />
            </div>
            <p class="text-xs text-text-muted mt-1">
              This comes directly from the unit circle equation x² + y² = 1
            </p>
          </div>

          <div class="p-3 rounded bg-surface border border-border">
            <p class="font-medium text-text-primary">Tangent Definition</p>
            <div class="text-center">
              <MathBlock formula="\tan\theta = \frac{\sin\theta}{\cos\theta}" />
            </div>
          </div>

          <div class="p-3 rounded bg-surface border border-border">
            <p class="font-medium text-text-primary">Complementary Angles</p>
            <div class="text-center">
              <MathBlock formula="\sin(90° - \theta) = \cos\theta" />
            </div>
            <p class="text-xs text-text-muted mt-1">
              This is why sin and cos are "co-functions"
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
