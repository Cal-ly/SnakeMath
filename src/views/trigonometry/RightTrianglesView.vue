<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import { RightTriangleSolver } from '@/components/widgets/RightTriangleSolver'
import { getSOHCAHTOA, SPECIAL_TRIANGLES } from '@/utils/math/rightTriangle'

const sohcahtoa = getSOHCAHTOA()

// Get special triangles with non-null assertion (they always exist)
const triangle306090 = SPECIAL_TRIANGLES['30-60-90']!
const triangle454590 = SPECIAL_TRIANGLES['45-45-90']!

const relatedTopics = [
  {
    title: 'Unit Circle',
    path: '/trigonometry/unit-circle',
    description: 'Right triangles inscribed in the unit circle',
  },
  {
    title: 'Inverse Trig Functions',
    path: '/trigonometry/inverse-functions',
    description: 'Finding angles from side lengths',
  },
  {
    title: 'Vectors',
    path: '/linear-algebra/vectors',
    description: 'Components use right triangle trig',
  },
  {
    title: 'Trig in Code',
    path: '/trigonometry/in-code',
    description: 'Practical applications in programming',
  },
]

// Python code examples
const solvingCode = `import math

def solve_right_triangle(*, a=None, b=None, c=None, A=None):
    """
    Solve a right triangle given 2 pieces of information.
    Returns all sides (a, b, c) and angle A in degrees.
    """
    # If we have both legs, use Pythagorean theorem
    if a is not None and b is not None:
        c = math.sqrt(a**2 + b**2)
        A = math.degrees(math.atan(a / b))
    # Hypotenuse and one leg
    elif a is not None and c is not None:
        b = math.sqrt(c**2 - a**2)
        A = math.degrees(math.asin(a / c))
    elif b is not None and c is not None:
        a = math.sqrt(c**2 - b**2)
        A = math.degrees(math.acos(b / c))
    # One side and angle
    elif c is not None and A is not None:
        rad = math.radians(A)
        a = c * math.sin(rad)
        b = c * math.cos(rad)
    elif a is not None and A is not None:
        rad = math.radians(A)
        c = a / math.sin(rad)
        b = a / math.tan(rad)
    elif b is not None and A is not None:
        rad = math.radians(A)
        c = b / math.cos(rad)
        a = b * math.tan(rad)
    else:
        raise ValueError("Need 2 values to solve")

    B = 90 - A
    return {'a': a, 'b': b, 'c': c, 'A': A, 'B': B}

# Example: 3-4-5 triangle
result = solve_right_triangle(a=3, b=4)
print(f"Hypotenuse: {result['c']}")  # 5.0
print(f"Angle A: {result['A']:.1f}°")  # 36.9°`

const heightCode = `import math

def calculate_height(distance, angle_degrees):
    """
    Calculate height of an object from distance and angle of elevation.

    Example: You're 100m from a building, looking up at 60° angle.
    Height = distance * tan(angle)
    """
    radians = math.radians(angle_degrees)
    return distance * math.tan(radians)

# Example: Find building height
distance_to_building = 100  # meters
angle_of_elevation = 60     # degrees
height = calculate_height(distance_to_building, angle_of_elevation)
print(f"Building height: {height:.1f}m")  # ~173.2m`

const distanceCode = `import math

def distance_from_angle(height, angle_degrees):
    """
    Calculate horizontal distance given height and angle.

    Example: A plane is at 10,000ft altitude, you look up at 30°.
    Distance = height / tan(angle)
    """
    radians = math.radians(angle_degrees)
    return height / math.tan(radians)

# Example: How far is the plane?
altitude = 10000  # feet
angle = 30        # degrees
distance = distance_from_angle(altitude, angle)
print(f"Horizontal distance: {distance:.0f}ft")  # ~17,320ft`

const projectileCode = `import math

def launch_trajectory(speed, angle_degrees, gravity=9.8):
    """
    Calculate projectile trajectory.
    Returns max height and horizontal range.
    """
    rad = math.radians(angle_degrees)

    # Initial velocity components
    vx = speed * math.cos(rad)  # horizontal
    vy = speed * math.sin(rad)  # vertical

    # Time of flight
    time_of_flight = 2 * vy / gravity

    # Maximum height
    max_height = (vy ** 2) / (2 * gravity)

    # Horizontal range
    range_distance = vx * time_of_flight

    return {
        'max_height': max_height,
        'range': range_distance,
        'time': time_of_flight
    }

# Example: Launch at 45° with 50 m/s
result = launch_trajectory(50, 45)
print(f"Max height: {result['max_height']:.1f}m")  # ~63.8m
print(f"Range: {result['range']:.1f}m")            # ~255.1m`
</script>

<template>
  <TopicPage
    title="Right Triangle Trigonometry"
    description="SOHCAHTOA - the gateway to trigonometry through right triangle ratios."
  >
    <div class="space-y-8">
      <!-- Introduction & SOHCAHTOA -->
      <ContentSection id="introduction" title="SOHCAHTOA: The Foundation" icon="fa-solid fa-draw-polygon" collapsible>
        <p class="mb-4">
          Before the unit circle, there was the <strong>right triangle</strong>. The trigonometric
          functions were originally defined as ratios of sides in a right triangle, and this is
          still the most intuitive way to understand them.
        </p>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-6">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            The Three Ratios (SOHCAHTOA)
          </p>
          <div class="grid gap-4 sm:grid-cols-3">
            <div
              v-for="item in sohcahtoa"
              :key="item.mnemonic"
              class="p-3 bg-surface rounded border border-border"
            >
              <p class="font-bold text-lg text-primary">{{ item.mnemonic }}</p>
              <p class="text-sm font-medium mb-1">{{ item.full }}</p>
              <div class="overflow-x-auto">
                <MathBlock :formula="item.formulaLatex" />
              </div>
            </div>
          </div>
        </div>

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mb-6">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-ladder mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              A ladder against a wall forms a right triangle. The angle determines how much of the
              ladder's length goes toward height (sin) vs reach (cos).
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              In 3D graphics, camera pitch and yaw are angles. Trig ratios convert these angles
              into the actual (x, y, z) direction the camera faces.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-circle-notch mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Every right triangle fits inside the unit circle with its hypotenuse as a radius.
              sin θ = opposite/hypotenuse = y/1 = y-coordinate.
            </p>
          </div>
        </div>

        <!-- Common pitfall -->
        <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Which Side Is Which?
          </p>
          <p class="text-text-secondary">
            "Opposite" and "adjacent" are <em>relative to the angle you're working with</em>. The
            opposite side changes depending on which angle you choose! The hypotenuse is always
            the longest side (across from the 90° angle).
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Triangle Solver -->
      <ContentSection id="solver" title="Triangle Solver" icon="fa-solid fa-calculator" collapsible>
        <p class="mb-4">
          Enter any two known values (with at least one side) and this widget will calculate
          the rest. It shows which formulas are used for each step.
        </p>

        <RightTriangleSolver :sync-url="true" />
      </ContentSection>

      <!-- Solving Triangles -->
      <ContentSection
        id="solving"
        title="Solving Right Triangles"
        icon="fa-solid fa-gear"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          With SOHCAHTOA, you can find any unknown side or angle given two pieces of information
          (one must be a side). Here's how:
        </p>

        <div class="space-y-4 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">Given angle + side → find other sides</p>
            <ul class="list-disc list-inside text-sm text-text-muted space-y-1">
              <li>Use sin, cos, or tan depending on which side you have</li>
              <li>Example: Have hypotenuse and angle? Use sin/cos to find legs</li>
            </ul>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">Given two sides → find angle and third side</p>
            <ul class="list-disc list-inside text-sm text-text-muted space-y-1">
              <li>Use Pythagorean theorem for the third side: <MathBlock formula="c = \sqrt{a^2 + b^2}" class="inline" /></li>
              <li>Use inverse trig (arctan, arcsin, arccos) for the angle</li>
            </ul>
          </div>
        </div>

        <CodeExample id="trig-right-solving" language="python" title="solve_triangle.py" :code="solvingCode" />
      </ContentSection>

      <!-- Special Right Triangles -->
      <ContentSection
        id="special"
        title="Special Right Triangles"
        icon="fa-solid fa-star"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Two special triangles have "nice" exact ratios that appear constantly in math and
          programming. Memorizing these saves computation and gives exact answers.
        </p>

        <div class="grid gap-6 md:grid-cols-2 mb-6">
          <!-- 30-60-90 -->
          <div class="p-4 rounded-lg border border-primary bg-primary/5">
            <h4 class="font-semibold text-primary mb-2">
              30-60-90 Triangle
            </h4>
            <p class="text-sm text-text-muted mb-3">
              {{ triangle306090.description }}
            </p>
            <div class="text-center mb-2">
              <MathBlock formula="1 : \sqrt{3} : 2" display />
            </div>
            <p class="text-xs text-text-muted">
              Side opposite 30° : Side opposite 60° : Hypotenuse
            </p>
          </div>

          <!-- 45-45-90 -->
          <div class="p-4 rounded-lg border border-primary bg-primary/5">
            <h4 class="font-semibold text-primary mb-2">
              45-45-90 Triangle
            </h4>
            <p class="text-sm text-text-muted mb-3">
              {{ triangle454590.description }}
            </p>
            <div class="text-center mb-2">
              <MathBlock formula="1 : 1 : \sqrt{2}" display />
            </div>
            <p class="text-xs text-text-muted">
              Leg : Leg : Hypotenuse
            </p>
          </div>
        </div>

        <p class="text-sm text-text-muted">
          <strong>Why they matter:</strong> These ratios give exact values for sin/cos/tan of 30°, 45°, and 60°
          without needing a calculator. The exact values (√2/2, √3/2, 1/2) appear throughout math.
        </p>
      </ContentSection>

      <!-- Applications -->
      <ContentSection
        id="applications"
        title="Real-World Applications"
        icon="fa-solid fa-bullseye"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Right triangle trig is the foundation for many practical calculations:
        </p>

        <div class="space-y-6">
          <!-- Height calculation -->
          <div>
            <h4 class="font-semibold text-text-primary mb-2">
              <i class="fa-solid fa-building text-primary mr-2" aria-hidden="true" />
              Height of a Building (Angle of Elevation)
            </h4>
            <p class="text-sm text-text-muted mb-4">
              Stand a known distance from a building, measure the angle to the top, use tan:
            </p>
            <div class="text-center mb-4">
              <MathBlock formula="\text{height} = \text{distance} \times \tan(\text{angle})" display />
            </div>
            <CodeExample id="trig-right-height" language="python" title="calculate_height.py" :code="heightCode" />
          </div>

          <!-- Distance calculation -->
          <div>
            <h4 class="font-semibold text-text-primary mb-2">
              <i class="fa-solid fa-plane text-primary mr-2" aria-hidden="true" />
              Distance Across (Surveying)
            </h4>
            <p class="text-sm text-text-muted mb-4">
              Know the height of something and the angle you see it at? Find the horizontal distance:
            </p>
            <CodeExample id="trig-right-distance" language="python" title="distance_from_angle.py" :code="distanceCode" />
          </div>

          <!-- Projectile motion -->
          <div>
            <h4 class="font-semibold text-text-primary mb-2">
              <i class="fa-solid fa-rocket text-primary mr-2" aria-hidden="true" />
              Projectile Trajectories (Game Dev)
            </h4>
            <p class="text-sm text-text-muted mb-4">
              When launching a projectile, the angle splits the initial velocity into horizontal and
              vertical components using cos and sin:
            </p>
            <div class="text-center mb-4">
              <MathBlock formula="v_x = v \cos\theta, \quad v_y = v \sin\theta" display />
            </div>
            <CodeExample id="trig-right-projectile" language="python" title="projectile.py" :code="projectileCode" />
          </div>
        </div>
      </ContentSection>

      <!-- Connection to Unit Circle -->
      <ContentSection
        id="unit-circle-connection"
        title="Connection to the Unit Circle"
        icon="fa-solid fa-circle-notch"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Every right triangle can be inscribed in the unit circle with the hypotenuse as a radius.
          This is why the unit circle definitions and SOHCAHTOA are equivalent:
        </p>

        <div class="p-4 bg-surface-alt rounded-lg border border-border mb-4">
          <div class="text-center mb-4">
            <MathBlock formula="\sin\theta = \frac{\text{opposite}}{\text{hypotenuse}} = \frac{y}{1} = y" display />
            <MathBlock formula="\cos\theta = \frac{\text{adjacent}}{\text{hypotenuse}} = \frac{x}{1} = x" display />
          </div>
          <p class="text-sm text-text-muted text-center">
            When the hypotenuse equals 1 (unit circle), the opposite side <em>is</em> the sine,
            and the adjacent side <em>is</em> the cosine.
          </p>
        </div>

        <p class="text-sm text-text-muted">
          This is why the unit circle is so powerful — it unifies all these triangle relationships
          into a single, visual framework where coordinates directly give you trig values.
        </p>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
