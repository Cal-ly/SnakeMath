<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import { MatrixTransformations } from '@/components/widgets'

const relatedTopics = [
  { title: 'Linear Algebra Overview', path: '/linear-algebra', description: 'All linear algebra topics' },
  { title: 'Vectors in 2D', path: '/linear-algebra/vectors', description: 'What matrices transform' },
  { title: 'Unit Circle', path: '/trigonometry/unit-circle', description: 'Sin/cos power rotation matrices' },
  { title: 'Functions', path: '/basics/functions', description: 'Matrices as linear functions' },
]

// Code examples
const matrixBasicsCode = `import numpy as np

# Creating a 2×2 matrix
A = np.array([[1, 2],
              [3, 4]])

# Matrix as a transformation
# | a  b |   transforms   | x |   to   | ax + by |
# | c  d |                | y |        | cx + dy |

# Access elements
print(f"A[0,0] = {A[0,0]}")  # 1 (row 0, col 0)
print(f"A[1,0] = {A[1,0]}")  # 3 (row 1, col 0)
print(f"Shape: {A.shape}")   # (2, 2)`

const transformVectorCode = `import numpy as np

# 90° rotation matrix
theta = np.pi / 2  # 90 degrees in radians
R = np.array([[np.cos(theta), -np.sin(theta)],
              [np.sin(theta),  np.cos(theta)]])

# Transform a vector
v = np.array([1, 0])  # Points right
rotated = R @ v       # Matrix-vector multiplication
print(f"Original: {v}")     # [1 0]
print(f"Rotated:  {rotated}")  # [0 1] - now points up!

# The @ operator is matrix multiplication
# Same as: np.dot(R, v) or R.dot(v)`

const determinantCode = `import numpy as np

# The determinant tells you how area changes
A = np.array([[2, 0],
              [0, 3]])

det = np.linalg.det(A)
print(f"det(A) = {det}")  # 6.0

# Interpretation:
# - det > 0: preserves orientation
# - det < 0: flips orientation (reflection)
# - det = 0: "squishes" to lower dimension
# - |det| = area scaling factor

# Example: 2x scale doubles area
scale_2x = np.array([[2, 0], [0, 2]])
print(f"det(2x scale) = {np.linalg.det(scale_2x)}")  # 4.0 (area × 4)`

const compositionCode = `import numpy as np

# Composing transformations = matrix multiplication
# Order matters! Apply right-to-left.

# Rotation matrix (45°)
angle = np.pi / 4
R = np.array([[np.cos(angle), -np.sin(angle)],
              [np.sin(angle),  np.cos(angle)]])

# Scale matrix (2x)
S = np.array([[2, 0],
              [0, 2]])

# Rotate THEN scale
RS = S @ R  # Scale is applied to the rotated result

# Scale THEN rotate (different result!)
SR = R @ S  # Rotation is applied to the scaled result

v = np.array([1, 0])
print(f"Rotate then scale: {RS @ v}")
print(f"Scale then rotate: {SR @ v}")
# Same magnitude, but RS ≠ SR in general!`

const inverseCode = `import numpy as np

# The inverse matrix "undoes" a transformation
A = np.array([[2, 1],
              [1, 1]])

# Calculate inverse
A_inv = np.linalg.inv(A)
print(f"A⁻¹ = \\n{A_inv}")

# Verify: A × A⁻¹ = I (identity)
I = A @ A_inv
print(f"A × A⁻¹ = \\n{np.round(I, 10)}")  # [[1 0], [0 1]]

# Transform and "un-transform"
v = np.array([3, 2])
transformed = A @ v
recovered = A_inv @ transformed
print(f"Original: {v}")
print(f"Recovered: {recovered}")  # Same!`

const graphicsCode = `import numpy as np

def rotation_matrix(degrees):
    """Create 2D rotation matrix."""
    rad = np.radians(degrees)
    return np.array([[np.cos(rad), -np.sin(rad)],
                     [np.sin(rad),  np.cos(rad)]])

def scale_matrix(sx, sy):
    """Create 2D scale matrix."""
    return np.array([[sx, 0],
                     [0, sy]])

def shear_matrix(kx, ky):
    """Create 2D shear matrix."""
    return np.array([[1, kx],
                     [ky, 1]])

# Transform a sprite's vertices
sprite = np.array([[0, 0], [1, 0], [1, 1], [0, 1]])  # Unit square

# Create combined transformation
transform = rotation_matrix(30) @ scale_matrix(2, 1.5)

# Apply to all vertices at once
# Transpose for proper matrix multiplication
transformed_sprite = (transform @ sprite.T).T

print("Original vertices:")
print(sprite)
print("\\nTransformed vertices:")
print(transformed_sprite)`
</script>

<template>
  <TopicPage
    title="Matrices in 2D"
    description="2×2 arrays that transform vectors — the foundation of computer graphics and neural networks."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is a Matrix?" icon="fa-solid fa-table-cells">
        <p class="mb-4">
          A matrix is a <strong>grid of numbers</strong> arranged in rows and columns. For 2D transformations,
          we use 2×2 matrices — and they're surprisingly powerful. Every rotation, scale, shear, and
          reflection can be represented as matrix multiplication.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">Mathematical Notation</h4>
            <MathBlock formula="A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}" display />
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">Python Code</h4>
            <code class="text-sm font-mono">A = np.array([[a, b], [c, d]])</code>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            Key Insight
          </p>
          <p class="text-text-secondary">
            A 2×2 matrix transforms a vector by multiplying:
            <strong>the columns of the matrix tell you where the basis vectors î and ĵ land</strong>.
            This geometric view makes transformations intuitive.
          </p>
        </div>

        <CodeExample
          id="linalg-matrices-basics"
          title="matrix_basics.py"
          language="python"
          :code="matrixBasicsCode"
          :collapsible="true"
          :default-expanded="false"
        />

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mt-4 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-table mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Spreadsheets with superpowers. A spreadsheet stores data in rows and columns;
              a matrix does the same but can transform, rotate, and reshape other data.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              An array of arrays with mathematical operations. In NumPy,
              <code>A @ B</code> multiplies matrices—the same operation that powers
              every neural network layer.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-arrows-rotate mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Each column of a matrix shows where the basis vectors land after transformation.
              The first column is where (1,0) goes; the second is where (0,1) goes.
            </p>
          </div>
        </div>

        <div
          class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Don't Invert, Solve Instead
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            To solve <code>Ax = b</code>, use <code>np.linalg.solve(A, b)</code>, not
            <code>np.linalg.inv(A) @ b</code>. Computing the inverse is slower, less accurate,
            and can fail badly for nearly-singular matrices. Always prefer <code>solve()</code>.
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Transformation Explorer" icon="fa-solid fa-compass">
        <p class="mb-4 text-text-secondary">
          Watch how different matrices transform the unit square and basis vectors. Try rotation,
          scaling, shearing, and reflection to build intuition for what each matrix "does."
        </p>

        <MatrixTransformations sync-url />
      </ContentSection>

      <!-- Transformation Types -->
      <ContentSection
        id="transformations"
        title="Transformation Types"
        icon="fa-solid fa-wand-magic-sparkles"
        :default-expanded="false"
      >
        <p class="mb-4">
          Standard 2D transformations each have a characteristic matrix form:
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-rotate mr-2" aria-hidden="true" />
              Rotation
            </h4>
            <MathBlock formula="R(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}" display />
            <p class="text-sm text-text-muted mt-2">Rotates counter-clockwise by θ. Preserves lengths and area.</p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-expand mr-2" aria-hidden="true" />
              Scale
            </h4>
            <MathBlock formula="S = \begin{bmatrix} s_x & 0 \\ 0 & s_y \end{bmatrix}" display />
            <p class="text-sm text-text-muted mt-2">Stretches by sₓ horizontally and sᵧ vertically.</p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-italic mr-2" aria-hidden="true" />
              Shear
            </h4>
            <MathBlock formula="H_x = \begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}" display />
            <p class="text-sm text-text-muted mt-2">Slants horizontally. Area is preserved (det = 1).</p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">
              <i class="fa-solid fa-arrows-up-down mr-2" aria-hidden="true" />
              Reflection
            </h4>
            <MathBlock formula="F_x = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}" display />
            <p class="text-sm text-text-muted mt-2">Flips across x-axis. Negative determinant (orientation flip).</p>
          </div>
        </div>

        <CodeExample
          id="linalg-matrices-transform"
          title="matrix_transform.py"
          language="python"
          :code="transformVectorCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- The Determinant -->
      <ContentSection
        id="determinant"
        title="The Determinant"
        icon="fa-solid fa-square"
        :default-expanded="false"
      >
        <p class="mb-4">
          The <strong>determinant</strong> of a 2×2 matrix tells you how the transformation affects area:
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <MathBlock formula="\det(A) = \det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc" display />
        </div>

        <div class="space-y-3 mb-4">
          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-check text-green-500 text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">det = 1</h4>
              <p class="text-sm text-text-secondary">
                Area preserved. Rotations and shears have det = 1.
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-shuffle text-amber-500 text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">det &lt; 0</h4>
              <p class="text-sm text-text-secondary">
                Orientation is flipped (like looking in a mirror). Reflections have negative determinant.
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-compress text-red-500 text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">det = 0</h4>
              <p class="text-sm text-text-secondary">
                Space is "squished" to a line or point. The transformation loses information and can't be reversed.
              </p>
            </div>
          </div>
        </div>

        <CodeExample
          id="linalg-matrices-determinant"
          title="determinant.py"
          language="python"
          :code="determinantCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Matrix Multiplication / Composition -->
      <ContentSection
        id="composition"
        title="Composition of Transformations"
        icon="fa-solid fa-layer-group"
        :default-expanded="false"
      >
        <p class="mb-4">
          <strong>Matrix multiplication</strong> composes transformations. If you want to first apply
          transformation A, then apply transformation B, you compute <strong>B × A</strong> (right to left!).
        </p>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-exclamation-triangle mr-2" aria-hidden="true" />
            Order Matters!
          </p>
          <p class="text-text-secondary">
            Matrix multiplication is <strong>not commutative</strong>: A × B ≠ B × A in general.
            "Rotate then scale" gives a different result than "scale then rotate."
          </p>
        </div>

        <CodeExample
          id="linalg-matrices-composition"
          title="composition.py"
          language="python"
          :code="compositionCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Inverse Matrices -->
      <ContentSection
        id="inverse"
        title="Inverse Matrices"
        icon="fa-solid fa-undo"
        :default-expanded="false"
      >
        <p class="mb-4">
          The <strong>inverse matrix</strong> A⁻¹ "undoes" a transformation: A × A⁻¹ = I (identity).
          Not all matrices have inverses — a matrix is invertible if and only if its determinant is non-zero.
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <MathBlock
            formula="A^{-1} = \frac{1}{ad-bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}"
            display
          />
        </div>

        <CodeExample
          id="linalg-matrices-inverse"
          title="matrix_inverse.py"
          language="python"
          :code="inverseCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Applications -->
      <ContentSection
        id="applications"
        title="Graphics & ML Applications"
        icon="fa-solid fa-gamepad"
        :default-expanded="false"
      >
        <p class="mb-4">
          Matrices power modern graphics and machine learning:
        </p>

        <div class="space-y-3 mb-4">
          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-cube text-primary text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">2D/3D Graphics</h4>
              <p class="text-sm text-text-secondary">
                Sprite rotation, camera transforms, 3D projection — all matrix multiplication.
                Games apply thousands of matrix operations per frame.
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-brain text-primary text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">Neural Networks</h4>
              <p class="text-sm text-text-secondary">
                Each layer of a neural network is essentially: output = activation(W × input + b).
                The weight matrix W is learned during training.
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-image text-primary text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">Image Processing</h4>
              <p class="text-sm text-text-secondary">
                Blur, sharpen, and edge detection use convolution matrices (kernels) applied to images.
              </p>
            </div>
          </div>
        </div>

        <CodeExample
          id="linalg-matrices-graphics"
          title="graphics_transforms.py"
          language="python"
          :code="graphicsCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
