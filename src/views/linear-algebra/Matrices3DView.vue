<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import { MatrixTransformations3D } from '@/components/widgets'

const relatedTopics = [
  { title: 'Linear Algebra Overview', path: '/linear-algebra', description: 'All linear algebra topics' },
  { title: 'Matrices in 2D', path: '/linear-algebra/matrices', description: 'Foundations of matrix transformations' },
  { title: 'Vectors in 3D', path: '/linear-algebra/vectors-3d', description: 'Cross products and 3D operations' },
  { title: 'Trig in Code', path: '/trigonometry/trig-in-code', description: 'Rotation formulas and implementation' },
]

// Code examples
const rotationMatricesCode = `import numpy as np

def rotation_x(theta_deg):
    """Rotation matrix around X-axis."""
    theta = np.radians(theta_deg)
    c, s = np.cos(theta), np.sin(theta)
    return np.array([
        [1, 0, 0],
        [0, c, -s],
        [0, s, c]
    ])

def rotation_y(theta_deg):
    """Rotation matrix around Y-axis."""
    theta = np.radians(theta_deg)
    c, s = np.cos(theta), np.sin(theta)
    return np.array([
        [c, 0, s],
        [0, 1, 0],
        [-s, 0, c]
    ])

def rotation_z(theta_deg):
    """Rotation matrix around Z-axis."""
    theta = np.radians(theta_deg)
    c, s = np.cos(theta), np.sin(theta)
    return np.array([
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1]
    ])

# Rotate a point 45° around Y-axis
point = np.array([1, 0, 0])
Ry = rotation_y(45)
rotated = Ry @ point
print(f"Rotated: {rotated}")  # [0.707, 0, -0.707]`

const eulerAnglesCode = `import numpy as np
from scipy.spatial.transform import Rotation

# Euler angles: pitch, yaw, roll
# These describe orientation as three sequential rotations

def from_euler(rx, ry, rz):
    """Combined rotation from Euler angles (XYZ order)."""
    Rx = rotation_x(rx)
    Ry = rotation_y(ry)
    Rz = rotation_z(rz)
    # Apply in order: first Rx, then Ry, then Rz
    return Rz @ Ry @ Rx

# Or use scipy (more robust):
r = Rotation.from_euler('xyz', [30, 45, 60], degrees=True)
rotation_matrix = r.as_matrix()
print(rotation_matrix)

# WARNING: Gimbal lock!
# When pitch (X rotation) = ±90°, yaw and roll
# become indistinguishable. Use quaternions for robotics!`

const determinantCode = `import numpy as np

# The determinant tells us about the transformation:
# - det = 1 for pure rotations
# - |det| = scale factor cubed for uniform scaling
# - det < 0 for reflections (orientation flip)

R = rotation_y(45)
print(f"det(R) = {np.linalg.det(R):.4f}")  # 1.0000

# Scale matrix
S = np.diag([2, 2, 2])  # Scale 2x in all directions
print(f"det(S) = {np.linalg.det(S)}")  # 8 (= 2³)

# Orthogonal matrices preserve lengths
# R^T R = I (transpose equals inverse)
print(f"R^T @ R = \\n{R.T @ R}")  # Identity matrix`

const graphics3DCode = `import numpy as np

# Model-View-Projection in 3D graphics:
# 1. Model matrix: object space -> world space
# 2. View matrix: world space -> camera space
# 3. Projection matrix: camera space -> clip space

def look_at(eye, target, up):
    """Create view matrix looking from eye toward target."""
    f = target - eye
    f = f / np.linalg.norm(f)  # Forward

    r = np.cross(f, up)
    r = r / np.linalg.norm(r)  # Right

    u = np.cross(r, f)         # True up

    return np.array([
        [r[0], r[1], r[2], -np.dot(r, eye)],
        [u[0], u[1], u[2], -np.dot(u, eye)],
        [-f[0], -f[1], -f[2], np.dot(f, eye)],
        [0, 0, 0, 1]
    ])

# Position camera at (5,5,5) looking at origin
camera_pos = np.array([5, 5, 5])
target = np.array([0, 0, 0])
up = np.array([0, 1, 0])

view_matrix = look_at(camera_pos, target, up)
print("View matrix:")
print(view_matrix)`

const roboticsCode = `import numpy as np

# In robotics, we often combine rotation and translation
# using 4x4 homogeneous transformation matrices:

def transform_matrix(rotation, translation):
    """Create 4x4 transformation matrix."""
    T = np.eye(4)
    T[:3, :3] = rotation
    T[:3, 3] = translation
    return T

# Robot arm: rotate around Y, then translate along X
R = rotation_y(90)
t = np.array([1, 0, 0])  # 1 meter along X

T = transform_matrix(R, t)
print("Transformation matrix:")
print(T)

# Apply to a point (add homogeneous coordinate)
point = np.array([0, 0, 0, 1])
transformed = T @ point
print(f"Transformed point: {transformed[:3]}")  # [1, 0, 0]

# Chaining transformations: T_total = T2 @ T1
# Order matters! Matrix multiplication is not commutative.`
</script>

<template>
  <TopicPage
    title="Matrices in 3D"
    description="Rotation matrices, Euler angles, and transformations in three-dimensional space."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="3D Transformations" icon="fa-solid fa-cube">
        <p class="mb-4">
          3D matrices extend the power of 2D transformations to three dimensions. The key
          player is the <strong>3&times;3 rotation matrix</strong> &mdash; it rotates vectors
          around any axis while preserving their length.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">3&times;3 Matrix</h4>
            <MathBlock
              formula="M = \begin{bmatrix} m_{11} & m_{12} & m_{13} \\ m_{21} & m_{22} & m_{23} \\ m_{31} & m_{32} & m_{33} \end{bmatrix}"
              display
            />
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">Transform Vector</h4>
            <MathBlock formula="\vec{v}' = M \cdot \vec{v}" display />
            <p class="text-xs text-text-muted mt-2">Matrix multiplies column vector</p>
          </div>
        </div>

        <!-- Three Analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-plane mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Like an airplane: pitch tilts the nose up/down, yaw turns left/right,
              roll tilts the wings. Three rotations describe any orientation.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              A 3&times;3 array that transforms vectors: <code>np.array([[...],[...],[...]])</code>.
              Matrix multiplication chains transformations.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Watch how the unit cube transforms: rotation preserves shape and size,
              while scaling stretches. The determinant measures volume change.
            </p>
          </div>
        </div>

        <!-- Common Pitfall -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Rotation Order Matters
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            Matrix multiplication is not commutative: <code>Rx @ Ry &ne; Ry @ Rx</code>.
            Rotating 90&deg; around X then Y gives a different result than Y then X.
            Always be explicit about which order you apply rotations!
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-red-500 mb-2">
              <i class="fa-solid fa-rotate mr-2" aria-hidden="true" />
              Rx &mdash; Pitch
            </h4>
            <p class="text-sm text-text-secondary">
              Rotation around X-axis. Tilts up/down. Think: nodding your head.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-green-500 mb-2">
              <i class="fa-solid fa-rotate mr-2" aria-hidden="true" />
              Ry &mdash; Yaw
            </h4>
            <p class="text-sm text-text-secondary">
              Rotation around Y-axis. Turns left/right. Think: shaking your head.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-500 mb-2">
              <i class="fa-solid fa-rotate mr-2" aria-hidden="true" />
              Rz &mdash; Roll
            </h4>
            <p class="text-sm text-text-secondary">
              Rotation around Z-axis. Tilts sideways. Think: tilting your head.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Explorer" icon="fa-solid fa-compass">
        <p class="mb-4 text-text-secondary">
          Watch how rotation matrices transform the unit cube. The colored axes show the
          <strong>transformed basis vectors</strong> &mdash; where the standard X, Y, Z
          directions end up after transformation.
        </p>

        <MatrixTransformations3D sync-url />
      </ContentSection>

      <!-- Rotation Matrices -->
      <ContentSection
        id="rotation-matrices"
        title="Rotation Matrices"
        icon="fa-solid fa-sync-alt"
        :default-expanded="false"
      >
        <p class="mb-4">
          Each axis has its own rotation matrix. The pattern: the row/column for the axis of
          rotation stays as identity (1 on diagonal, 0 elsewhere), and the other 2&times;2
          block contains cos/sin.
        </p>

        <div class="grid gap-4 sm:grid-cols-3 mb-4">
          <div class="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <h4 class="font-semibold text-red-600 dark:text-red-400 text-sm mb-2">Rx (Pitch)</h4>
            <MathBlock
              formula="\begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos\theta & -\sin\theta \\ 0 & \sin\theta & \cos\theta \end{bmatrix}"
              display
            />
          </div>
          <div class="p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <h4 class="font-semibold text-green-600 dark:text-green-400 text-sm mb-2">Ry (Yaw)</h4>
            <MathBlock
              formula="\begin{bmatrix} \cos\theta & 0 & \sin\theta \\ 0 & 1 & 0 \\ -\sin\theta & 0 & \cos\theta \end{bmatrix}"
              display
            />
          </div>
          <div class="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 text-sm mb-2">Rz (Roll)</h4>
            <MathBlock
              formula="\begin{bmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{bmatrix}"
              display
            />
          </div>
        </div>

        <CodeExample
          id="linalg-matrices3d-rotations"
          title="rotation_matrices.py"
          language="python"
          :code="rotationMatricesCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Euler Angles -->
      <ContentSection
        id="euler-angles"
        title="Euler Angles"
        icon="fa-solid fa-compass"
        :default-expanded="false"
      >
        <p class="mb-4">
          <strong>Euler angles</strong> describe any 3D orientation using three sequential
          rotations. The most common convention is <strong>XYZ</strong> (pitch, yaw, roll),
          but there are 12 different conventions!
        </p>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Combined Rotation
          </p>
          <MathBlock formula="R = R_z(\text{roll}) \cdot R_y(\text{yaw}) \cdot R_x(\text{pitch})" display />
          <p class="text-sm text-text-secondary mt-2">
            The order matters! Rotations don't commute. This applies pitch first, then yaw,
            then roll (reading right to left).
          </p>
        </div>

        <CodeExample
          id="linalg-matrices3d-euler"
          title="euler_angles.py"
          language="python"
          :code="eulerAnglesCode"
          :collapsible="true"
          :default-expanded="false"
        />

        <div
          class="mt-4 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Gimbal Lock Warning
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            When pitch is &plusmn;90&deg;, yaw and roll become indistinguishable &mdash; one
            degree of freedom is lost. This is <strong>gimbal lock</strong>. For
            robotics and aerospace, use <strong>quaternions</strong> instead.
          </p>
        </div>
      </ContentSection>

      <!-- Matrix Properties -->
      <ContentSection
        id="properties"
        title="Matrix Properties"
        icon="fa-solid fa-info-circle"
        :default-expanded="false"
      >
        <p class="mb-4">
          The <strong>determinant</strong> of a transformation matrix tells us what happens
          to volume. For rotation matrices, it's always 1 (volume preserved).
        </p>

        <div class="space-y-3 mb-4">
          <div class="flex gap-3 items-start">
            <span class="px-3 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-mono text-sm">
              det = 1
            </span>
            <span class="text-text-secondary">Pure rotation (preserves volume and orientation)</span>
          </div>
          <div class="flex gap-3 items-start">
            <span class="px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-mono text-sm">
              det = k&sup3;
            </span>
            <span class="text-text-secondary">Uniform scale by k (volume scaled by k&sup3;)</span>
          </div>
          <div class="flex gap-3 items-start">
            <span class="px-3 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-mono text-sm">
              det &lt; 0
            </span>
            <span class="text-text-secondary">Reflection (orientation flipped, handedness changed)</span>
          </div>
        </div>

        <CodeExample
          id="linalg-matrices3d-det"
          title="determinant_properties.py"
          language="python"
          :code="determinantCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Graphics Applications -->
      <ContentSection
        id="graphics"
        title="3D Graphics Pipeline"
        icon="fa-solid fa-video"
        :default-expanded="false"
      >
        <p class="mb-4">
          In 3D graphics, we chain matrices to transform objects from their local coordinate
          system all the way to your screen:
        </p>

        <div class="p-4 rounded-lg border border-border mb-4 font-mono text-sm overflow-x-auto">
          <span class="text-emerald-600">Model</span> &rarr;
          <span class="text-blue-600">View</span> &rarr;
          <span class="text-violet-600">Projection</span> &rarr;
          <span class="text-amber-600">Screen</span>
        </div>

        <CodeExample
          id="linalg-matrices3d-graphics"
          title="graphics_pipeline.py"
          language="python"
          :code="graphics3DCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Robotics -->
      <ContentSection
        id="robotics"
        title="Robotics: Homogeneous Transforms"
        icon="fa-solid fa-robot"
        :default-expanded="false"
      >
        <p class="mb-4">
          In robotics, we often need both rotation <em>and</em> translation. The trick:
          use <strong>4&times;4 homogeneous transformation matrices</strong>.
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <MathBlock
            formula="T = \begin{bmatrix} R_{3\times3} & \vec{t} \\ 0\ 0\ 0 & 1 \end{bmatrix}"
            display
          />
          <p class="text-sm text-text-muted mt-2">
            R is the 3&times;3 rotation matrix, t is the translation vector
          </p>
        </div>

        <CodeExample
          id="linalg-matrices3d-robotics"
          title="robotics_transforms.py"
          language="python"
          :code="roboticsCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
