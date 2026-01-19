<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import CollapsiblePanel from '@/components/ui/CollapsiblePanel.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import { InverseTrigExplorer } from '@/components/widgets/InverseTrigExplorer'

const relatedTopics = [
  {
    title: 'Unit Circle',
    path: '/trigonometry/unit-circle',
    description: 'See how angles relate to coordinates',
  },
  {
    title: 'Right Triangle Trig',
    path: '/trigonometry/right-triangles',
    description: 'Finding angles from side ratios',
  },
  {
    title: 'Trig Identities',
    path: '/trigonometry/identities',
    description: 'Relationships between trig functions',
  },
  {
    title: 'Vectors',
    path: '/linear-algebra/vectors',
    description: 'Direction angles in vector math',
  },
]

const angleToTargetCode = `import math

def angle_to_target(x1, y1, x2, y2):
    """
    Calculate angle from point (x1, y1) to point (x2, y2).
    Returns angle in degrees, where:
    - 0° points right (+x direction)
    - 90° points up (+y direction)
    """
    dx = x2 - x1
    dy = y2 - y1
    return math.degrees(math.atan2(dy, dx))

# Example: Player at (0, 0), enemy at (3, 4)
player = (0, 0)
enemy = (3, 4)
angle = angle_to_target(*player, *enemy)
print(f"Angle to enemy: {angle:.2f}°")  # 53.13°`

const cartesianToPolarCode = `import math

def cartesian_to_polar(x, y):
    """
    Convert Cartesian (x, y) to polar (r, θ).
    Returns radius and angle in degrees.
    """
    r = math.sqrt(x**2 + y**2)
    theta = math.degrees(math.atan2(y, x))
    return r, theta

def polar_to_cartesian(r, theta_deg):
    """
    Convert polar (r, θ) to Cartesian (x, y).
    """
    theta_rad = math.radians(theta_deg)
    x = r * math.cos(theta_rad)
    y = r * math.sin(theta_rad)
    return x, y

# Round trip
x, y = 3, 4
r, theta = cartesian_to_polar(x, y)
print(f"({x}, {y}) → (r={r:.2f}, θ={theta:.2f}°)")

x2, y2 = polar_to_cartesian(r, theta)
print(f"(r={r:.2f}, θ={theta:.2f}°) → ({x2:.2f}, {y2:.2f})")`

const lookAtCode = `import math

def look_at(entity_x, entity_y, target_x, target_y):
    """
    Calculate the rotation needed for an entity to face a target.
    Returns rotation in degrees.
    """
    dx = target_x - entity_x
    dy = target_y - entity_y
    return math.degrees(math.atan2(dy, dx))

def move_toward(x, y, angle_deg, speed):
    """
    Move from (x, y) in the given direction by speed units.
    """
    angle_rad = math.radians(angle_deg)
    new_x = x + speed * math.cos(angle_rad)
    new_y = y + speed * math.sin(angle_rad)
    return new_x, new_y

# Enemy AI: face the player and move toward them
enemy_pos = [10.0, 10.0]
player_pos = (0.0, 0.0)
speed = 0.5

# Calculate angle to player
angle = look_at(*enemy_pos, *player_pos)
print(f"Enemy faces: {angle:.2f}°")

# Move toward player
enemy_pos[0], enemy_pos[1] = move_toward(
    enemy_pos[0], enemy_pos[1], angle, speed
)
print(f"New position: ({enemy_pos[0]:.2f}, {enemy_pos[1]:.2f})")`

const mouseAngleCode = `import math

def mouse_angle_from_center(mouse_x, mouse_y, center_x, center_y):
    """
    Calculate angle from screen center to mouse position.
    Useful for turret rotation, cursor-following effects, etc.
    """
    dx = mouse_x - center_x
    dy = center_y - mouse_y  # Flip Y because screen Y is inverted
    return math.degrees(math.atan2(dy, dx))

# Screen dimensions
screen_width = 800
screen_height = 600
center_x = screen_width // 2
center_y = screen_height // 2

# Mouse at top-right corner
mouse_x, mouse_y = 700, 100  # Screen coordinates (Y increases downward)
angle = mouse_angle_from_center(mouse_x, mouse_y, center_x, center_y)
print(f"Mouse angle: {angle:.2f}°")  # ~36.87° (toward top-right)`
</script>

<template>
  <TopicPage
    title="Inverse Trig Functions"
    description="Finding angles from coordinates - the reverse lookup that programmers actually need."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="From Coordinates to Angles" icon="fa-solid fa-rotate-left" collapsible>
      <p class="text-lg mb-4">
        The <strong>inverse trigonometric functions</strong> solve the reverse problem: given a trig
        value, find the angle that produced it. If <MathBlock formula="\sin(\theta) = 0.5" />, what is
        <MathBlock formula="\theta" />?
      </p>

      <!-- Three-analogy block -->
      <div class="grid gap-4 sm:grid-cols-3 my-6">
        <!-- Everyday analogy -->
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Everyday Analogy
          </h4>
          <p class="text-sm text-text-secondary">
            Like looking up a word by its definition instead of alphabetically. You know "happiness"
            means "joyful feeling"—but which word means "joyful feeling"? That's the reverse lookup.
          </p>
        </div>

        <!-- Programming analogy -->
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            <i class="fa-solid fa-code mr-2" aria-hidden="true" />
            Programming Analogy
          </h4>
          <p class="text-sm text-text-secondary">
            Forward lookup is <code>dict[key]</code> → value. Inverse is finding which key has that
            value. In games: given a player's (x, y), what angle are they facing?
          </p>
        </div>

        <!-- Visual intuition -->
        <div class="p-4 bg-surface-alt rounded-lg border border-border">
          <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <i class="fa-solid fa-eye mr-2" aria-hidden="true" />
            Visual Intuition
          </h4>
          <p class="text-sm text-text-secondary">
            On the unit circle, sin gives you the y-coordinate from an angle. Arcsin goes backward:
            given a y-coordinate, find which angle got you there.
          </p>
        </div>
      </div>

      <!-- Common pitfall -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg my-6">
        <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
          <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
          Common Pitfall: Principal Value Surprise
        </p>
        <p class="text-sm text-amber-600 dark:text-amber-400">
          <code>arcsin(sin(150°)) ≠ 150°</code>. It's 30°! Why? Because arcsin only returns
          values in [-90°, 90°]. The angle 150° is <em>not</em> in that range, so you get the
          "equivalent" angle 30° (since sin(150°) = sin(30°) = 0.5).
        </p>
      </div>
    </ContentSection>

      <!-- Interactive Widget -->
      <ContentSection id="explorer" title="Interactive Explorer" icon="fa-solid fa-sliders" collapsible>
        <p class="mb-4">
        Explore all four inverse trig functions. Notice how <strong>atan2</strong> (marked with ★)
        handles all quadrants correctly—it's the one programmers actually use!
      </p>
      <InverseTrigExplorer />
    </ContentSection>

    <!-- The Three Inverse Functions -->
    <CollapsiblePanel title="The Three Basic Inverse Functions" :default-open="true">
      <div class="space-y-6">
        <p>
          Each inverse function has a restricted range to make it a proper function (one output per
          input):
        </p>

        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left p-2">Function</th>
                <th class="text-left p-2">Domain (Input)</th>
                <th class="text-left p-2">Range (Output)</th>
                <th class="text-left p-2">Returns</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-border">
                <td class="p-2 font-mono">arcsin(x)</td>
                <td class="p-2">[-1, 1]</td>
                <td class="p-2">[-90°, 90°]</td>
                <td class="p-2">Angle whose sine is x</td>
              </tr>
              <tr class="border-b border-border">
                <td class="p-2 font-mono">arccos(x)</td>
                <td class="p-2">[-1, 1]</td>
                <td class="p-2">[0°, 180°]</td>
                <td class="p-2">Angle whose cosine is x</td>
              </tr>
              <tr class="border-b border-border">
                <td class="p-2 font-mono">arctan(x)</td>
                <td class="p-2">(-∞, ∞)</td>
                <td class="p-2">(-90°, 90°)</td>
                <td class="p-2">Angle whose tangent is x</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-surface-alt rounded border border-border">
          <p class="text-sm">
            <strong>Why these ranges?</strong> Without restrictions, each function would have
            infinitely many outputs. For example, sin(30°) = sin(150°) = 0.5, so arcsin(0.5) could be
            either 30° or 150° (or 30° + 360°, etc.). The "principal value" convention picks one
            consistent answer.
          </p>
        </div>
      </div>
    </CollapsiblePanel>

    <!-- atan2 - The Star -->
    <CollapsiblePanel title="The Star of the Show: atan2" :default-open="true">
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-300 dark:border-amber-700 mb-4">
        <div class="flex items-center gap-2 mb-2">
          <i class="fa-solid fa-star text-amber-500" aria-hidden="true" />
          <span class="font-bold text-amber-800 dark:text-amber-200">This is what programmers actually use</span>
        </div>
        <p class="text-sm text-amber-900 dark:text-amber-100">
          Forget arcsin, arccos, and regular arctan for practical programming. Use
          <code>atan2(y, x)</code> instead—it handles all four quadrants correctly.
        </p>
      </div>

      <div class="space-y-4">
        <h4 class="font-semibold">Why atan2 is better:</h4>

        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left p-2">Point (x, y)</th>
                <th class="text-left p-2">Quadrant</th>
                <th class="text-left p-2">atan(y/x)</th>
                <th class="text-left p-2">atan2(y, x)</th>
                <th class="text-left p-2">Correct?</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-border">
                <td class="p-2 font-mono">(1, 1)</td>
                <td class="p-2">I</td>
                <td class="p-2">45°</td>
                <td class="p-2">45°</td>
                <td class="p-2 text-green-600">✓ Both correct</td>
              </tr>
              <tr class="border-b border-border bg-amber-50 dark:bg-amber-900/20">
                <td class="p-2 font-mono">(-1, 1)</td>
                <td class="p-2">II</td>
                <td class="p-2 text-red-600">-45°</td>
                <td class="p-2 text-green-600">135°</td>
                <td class="p-2 text-red-600">✗ atan is wrong!</td>
              </tr>
              <tr class="border-b border-border bg-amber-50 dark:bg-amber-900/20">
                <td class="p-2 font-mono">(-1, -1)</td>
                <td class="p-2">III</td>
                <td class="p-2 text-red-600">45°</td>
                <td class="p-2 text-green-600">-135°</td>
                <td class="p-2 text-red-600">✗ atan is wrong!</td>
              </tr>
              <tr class="border-b border-border">
                <td class="p-2 font-mono">(1, -1)</td>
                <td class="p-2">IV</td>
                <td class="p-2">-45°</td>
                <td class="p-2">-45°</td>
                <td class="p-2 text-green-600">✓ Both correct</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-surface-alt rounded border border-border">
          <p class="text-sm mb-2">
            <strong>The problem with atan(y/x):</strong>
          </p>
          <ul class="text-sm list-disc pl-5 space-y-1">
            <li>Dividing by x fails when x = 0</li>
            <li>atan only returns angles in (-90°, 90°)—quadrants I and IV</li>
            <li>It can't distinguish (1, 1) from (-1, -1) because both have y/x = 1</li>
          </ul>
        </div>

        <div class="mt-4">
          <MathBlock
            formula="\text{atan2}(y, x) = \begin{cases} \arctan(y/x) & x > 0 \\ \arctan(y/x) + \pi & x < 0, y \geq 0 \\ \arctan(y/x) - \pi & x < 0, y < 0 \\ +\pi/2 & x = 0, y > 0 \\ -\pi/2 & x = 0, y < 0 \end{cases}"
            display
          />
        </div>
      </div>
    </CollapsiblePanel>

    <!-- Domain Visualization -->
    <CollapsiblePanel title="Domain Restrictions Visualized">
      <div class="space-y-4">
        <p>
          Why can't you take arcsin(2)? Because no angle has a sine of 2! The sine function only
          outputs values in [-1, 1], so arcsin can only accept inputs in that range.
        </p>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="p-3 bg-surface-alt rounded border border-border">
            <div class="font-mono font-bold mb-2">arcsin</div>
            <p class="text-sm text-text-muted">
              Input must be between -1 and 1 (inclusive). arcsin(2) is undefined because there's no
              angle whose sine is 2.
            </p>
          </div>

          <div class="p-3 bg-surface-alt rounded border border-border">
            <div class="font-mono font-bold mb-2">arccos</div>
            <p class="text-sm text-text-muted">
              Same domain restriction: [-1, 1]. Cosine values are also bounded by -1 and 1.
            </p>
          </div>

          <div class="p-3 bg-surface-alt rounded border border-border">
            <div class="font-mono font-bold mb-2">arctan</div>
            <p class="text-sm text-text-muted">
              Accepts any real number! Tangent can output any value from -∞ to ∞, so arctan has no
              domain restriction.
            </p>
          </div>
        </div>
      </div>
    </CollapsiblePanel>

    <!-- Programmer Applications -->
    <CollapsiblePanel title="Programmer Applications" :default-open="true">
      <div class="space-y-6">
        <h4 class="font-semibold">Angle to Target (Games, AI)</h4>
        <p class="text-sm text-text-muted mb-2">
          Calculate the angle from one point to another—essential for enemy AI, homing missiles, and
          "look at" mechanics.
        </p>
        <CodeExample id="trig-inverse-angle-target" title="angle_to_target.py" language="python" :code="angleToTargetCode" />

        <h4 class="font-semibold">Cartesian to Polar Coordinates</h4>
        <p class="text-sm text-text-muted mb-2">
          Convert between (x, y) and (r, θ) representations. Useful for circular UI elements, radar
          displays, and physics simulations.
        </p>
        <CodeExample id="trig-inverse-cartesian-polar" title="cartesian_polar.py" language="python" :code="cartesianToPolarCode" />

        <h4 class="font-semibold">Look At / Face Toward</h4>
        <p class="text-sm text-text-muted mb-2">
          Make game entities face and move toward targets. The foundation of most 2D game AI.
        </p>
        <CodeExample id="trig-inverse-look-at" title="look_at.py" language="python" :code="lookAtCode" />

        <h4 class="font-semibold">Mouse Angle from Screen Center</h4>
        <p class="text-sm text-text-muted mb-2">
          Calculate angle from screen center to mouse position—used for turret games, cursor
          effects, and radial menus.
        </p>
        <CodeExample id="trig-inverse-mouse-angle" title="mouse_angle.py" language="python" :code="mouseAngleCode" />
      </div>
    </CollapsiblePanel>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
