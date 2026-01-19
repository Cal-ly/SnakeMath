<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import { VectorOperations3D } from '@/components/widgets'

const relatedTopics = [
  { title: 'Linear Algebra Overview', path: '/linear-algebra', description: 'All linear algebra topics' },
  { title: 'Vectors in 2D', path: '/linear-algebra/vectors', description: 'Foundations in 2D space' },
  { title: 'Matrices in 3D', path: '/linear-algebra/matrices-3d', description: 'Rotate and transform in 3D' },
  { title: 'Right Triangle Trig', path: '/trigonometry/right-triangles', description: 'Angles and distances' },
]

// Code examples
const vector3DBasicsCode = `import numpy as np

# Creating 3D vectors
v1 = np.array([3, 4, 5])        # 3D vector
v2 = np.array([1, 0, 0])        # Unit vector along X

# Position in 3D space
point = np.array([x, y, z])

# Direction and distance
direction = point / np.linalg.norm(point)
distance = np.linalg.norm(point)

print(f"v1 = {v1}")         # [3 4 5]
print(f"|v1| = {np.linalg.norm(v1):.2f}")  # 7.07`

const crossProductCode = `import numpy as np

a = np.array([1, 0, 0])  # Unit X
b = np.array([0, 1, 0])  # Unit Y

# Cross product: perpendicular to both!
c = np.cross(a, b)
print(f"a × b = {c}")     # [0 0 1] - Unit Z!

# Key properties:
# 1. Result is perpendicular to BOTH inputs
# 2. Magnitude = |a| |b| sin(θ) = area of parallelogram
# 3. Direction follows right-hand rule
# 4. NOT commutative: a × b = -(b × a)

# Verify perpendicularity
print(f"a · c = {np.dot(a, c)}")  # 0 (perpendicular!)
print(f"b · c = {np.dot(b, c)}")  # 0 (perpendicular!)`

const physicsApplicationsCode = `import numpy as np

# TORQUE: τ = r × F
# Position of force application
r = np.array([3, 0, 0])   # 3m along X-axis
# Force applied
F = np.array([0, 10, 0])  # 10N in Y direction

torque = np.cross(r, F)
print(f"Torque: {torque}")  # [0 0 30] - 30 N·m around Z

# ANGULAR MOMENTUM: L = r × p
mass = 2  # kg
velocity = np.array([0, 5, 0])
r_particle = np.array([1, 0, 0])

momentum = mass * velocity
L = np.cross(r_particle, momentum)
print(f"Angular momentum: {L}")  # [0 0 10]

# MAGNETIC FORCE: F = q(v × B)
charge = 1.6e-19  # electron charge
v_electron = np.array([1e6, 0, 0])  # m/s
B_field = np.array([0, 0, 1])       # 1 Tesla in Z

F_magnetic = charge * np.cross(v_electron, B_field)
print(f"Magnetic force: {F_magnetic}")`

const graphics3DCode = `import numpy as np

# Normal vectors for lighting
def surface_normal(p1, p2, p3):
    """Calculate normal of a triangle surface."""
    edge1 = p2 - p1
    edge2 = p3 - p1
    normal = np.cross(edge1, edge2)
    return normal / np.linalg.norm(normal)

# Triangle vertices
v0 = np.array([0, 0, 0])
v1 = np.array([1, 0, 0])
v2 = np.array([0, 1, 0])

normal = surface_normal(v0, v1, v2)
print(f"Surface normal: {normal}")  # [0 0 1]

# Diffuse lighting (Lambert)
light_dir = np.array([0, 0, 1])  # Light from above
intensity = max(0, np.dot(normal, light_dir))
print(f"Light intensity: {intensity}")  # 1.0 (max)`
</script>

<template>
  <TopicPage
    title="Vectors in 3D"
    description="Extend to three dimensions: cross products, right-hand rule, and real-world physics."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="From 2D to 3D" icon="fa-solid fa-cube" collapsible>
        <p class="mb-4">
          Everything you learned about 2D vectors extends naturally to 3D. But 3D gives us
          something new and powerful: the <strong>cross product</strong> &mdash; a way to find
          a vector perpendicular to two others.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">3D Vector</h4>
            <MathBlock formula="\vec{v} = \begin{bmatrix} x \\ y \\ z \end{bmatrix}" display />
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">Python Code</h4>
            <code class="text-sm font-mono">v = np.array([x, y, z])</code>
          </div>
        </div>

        <!-- Three Analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-compass mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Like giving directions: "go 3 blocks east, 4 blocks north, then up 2 floors."
              Three numbers describe any point in space.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              A 3D vector is just <code>[x, y, z]</code> &mdash; an array of three floats.
              Cross product is <code>np.cross()</code>, one function call.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              An arrow in 3D space with a head (direction) and length (magnitude).
              Cross product gives the "perpendicular up" direction.
            </p>
          </div>
        </div>

        <!-- Common Pitfall -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Cross Product Order Matters
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            Unlike the dot product, <code>a &times; b &ne; b &times; a</code>. In fact,
            <code>a &times; b = -(b &times; a)</code>. Swap the order and you flip the direction.
            This trips up many programmers when calculating surface normals!
          </p>
        </div>

        <CodeExample
          id="linalg-vectors3d-basics"
          title="vector3d_basics.py"
          language="python"
          :code="vector3DBasicsCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Explorer" icon="fa-solid fa-compass" collapsible>
        <p class="mb-4 text-text-secondary">
          Experiment with 3D vector operations. The <strong>cross product</strong> creates a
          vector perpendicular to both inputs &mdash; try the presets to see special cases!
        </p>

        <VectorOperations3D sync-url />
      </ContentSection>

      <!-- Cross Product -->
      <ContentSection
        id="cross-product"
        title="The Cross Product"
        icon="fa-solid fa-times"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          The <strong>cross product</strong> is unique to 3D (and 7D, but let's not go there).
          It takes two vectors and produces a third vector that is <strong>perpendicular to
          both</strong>.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-text-muted text-sm mb-2">Formula</h4>
            <MathBlock
              formula="\vec{a} \times \vec{b} = \begin{vmatrix} \hat{i} & \hat{j} & \hat{k} \\ a_x & a_y & a_z \\ b_x & b_y & b_z \end{vmatrix}"
              display
            />
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-text-muted text-sm mb-2">Components</h4>
            <MathBlock
              formula="\begin{bmatrix} a_y b_z - a_z b_y \\ a_z b_x - a_x b_z \\ a_x b_y - a_y b_x \end{bmatrix}"
              display
            />
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-hand mr-2" aria-hidden="true" />
            Right-Hand Rule
          </p>
          <p class="text-text-secondary">
            Point your fingers in the direction of <strong>A</strong>, curl them toward
            <strong>B</strong>, and your thumb points in the direction of
            <strong>A &times; B</strong>. This is why it's called the "right-hand rule"!
          </p>
        </div>

        <CodeExample
          id="linalg-vectors3d-cross"
          title="cross_product.py"
          language="python"
          :code="crossProductCode"
          :collapsible="true"
          :default-expanded="false"
        />

        <div
          class="mt-4 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Not Commutative!
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            Unlike the dot product, the cross product is <strong>anti-commutative</strong>:
            <code>a &times; b = -(b &times; a)</code>. Swap the order, flip the sign. This is
            because the right-hand rule gives opposite directions when you swap the vectors.
          </p>
        </div>
      </ContentSection>

      <!-- Physics Applications -->
      <ContentSection
        id="physics"
        title="Physics Applications"
        icon="fa-solid fa-atom"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          The cross product appears throughout physics. Here are some of the most important examples:
        </p>

        <div class="space-y-3 mb-4">
          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-rotate text-primary text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">Torque: &tau; = r &times; F</h4>
              <p class="text-sm text-text-secondary">
                The rotational effect of a force depends on where and how it's applied.
                The cross product gives both the magnitude and axis of rotation.
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-magnet text-primary text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">Magnetic Force: F = q(v &times; B)</h4>
              <p class="text-sm text-text-secondary">
                A moving charge in a magnetic field experiences a force perpendicular
                to both its velocity and the field. This is why electric motors work!
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-spinner text-primary text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">Angular Momentum: L = r &times; p</h4>
              <p class="text-sm text-text-secondary">
                The "spin" of a particle around a point. Like linear momentum, but
                for rotation. Conserved in closed systems.
              </p>
            </div>
          </div>
        </div>

        <CodeExample
          id="linalg-vectors3d-physics"
          title="physics_applications.py"
          language="python"
          :code="physicsApplicationsCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Graphics Applications -->
      <ContentSection
        id="graphics"
        title="3D Graphics Applications"
        icon="fa-solid fa-cube"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          In 3D graphics, the cross product is essential for calculating <strong>surface
          normals</strong> &mdash; vectors that point "outward" from a surface, used for lighting
          calculations.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-text-muted text-sm mb-2">Diffuse Lighting</h4>
            <MathBlock formula="I = \max(0, \vec{n} \cdot \vec{l})" display />
            <p class="text-xs text-text-muted mt-2">
              Intensity = dot product of surface normal and light direction
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-text-muted text-sm mb-2">Surface Normal</h4>
            <MathBlock formula="\vec{n} = \frac{(\vec{v_1} - \vec{v_0}) \times (\vec{v_2} - \vec{v_0})}{|...|}" display />
            <p class="text-xs text-text-muted mt-2">
              Cross product of two edges, normalized
            </p>
          </div>
        </div>

        <CodeExample
          id="linalg-vectors3d-graphics"
          title="graphics_normals.py"
          language="python"
          :code="graphics3DCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
