<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import { VectorOperations } from '@/components/widgets'

const relatedTopics = [
  { title: 'Linear Algebra Overview', path: '/linear-algebra', description: 'All linear algebra topics' },
  { title: 'Matrices in 2D', path: '/linear-algebra/matrices', description: 'Transform and rotate vectors' },
  { title: 'Unit Circle', path: '/trigonometry/unit-circle', description: 'Unit vectors and angle calculations' },
  { title: 'Summation', path: '/algebra/summation', description: 'Vector sums and sigma notation' },
]

// Code examples
const vectorBasicsCode = `import numpy as np

# Creating vectors
v1 = np.array([3, 4])        # 2D vector
v2 = np.array([1, 2, 3])     # 3D vector

# Vectors are just arrays of numbers!
features = np.array([0.5, 0.8, 0.2])  # A "feature vector"

print(f"v1 = {v1}")        # [3 4]
print(f"Shape: {v1.shape}")  # (2,)`

const vectorOpsCode = `import numpy as np

a = np.array([3, 2])
b = np.array([1, 4])

# Addition: component-wise
result = a + b
print(f"a + b = {result}")  # [4 6]

# Subtraction
diff = a - b
print(f"a - b = {diff}")    # [2 -2]

# Scalar multiplication
scaled = 2 * a
print(f"2 * a = {scaled}")  # [6 4]`

const dotProductCode = `import numpy as np

a = np.array([3, 2])
b = np.array([1, 4])

# Dot product: sum of component-wise products
dot = np.dot(a, b)  # 3*1 + 2*4 = 11
print(f"a · b = {dot}")

# Alternative syntax
dot2 = a @ b  # Also 11

# Geometric interpretation
# a · b = |a| |b| cos(θ)
# When vectors are perpendicular: a · b = 0
# When vectors are parallel: a · b = |a| |b|`

const magnitudeCode = `import numpy as np

v = np.array([3, 4])

# Magnitude (length) of a vector
magnitude = np.linalg.norm(v)
print(f"|v| = {magnitude}")  # 5.0 (3-4-5 triangle!)

# Normalize to unit vector
unit = v / magnitude
print(f"û = {unit}")         # [0.6 0.8]
print(f"|û| = {np.linalg.norm(unit)}")  # 1.0`

const angleCode = `import numpy as np

a = np.array([1, 0])  # Points right
b = np.array([1, 1])  # Points diagonally

# Angle between vectors
dot = np.dot(a, b)
mag_a = np.linalg.norm(a)
mag_b = np.linalg.norm(b)

cos_theta = dot / (mag_a * mag_b)
theta_rad = np.arccos(cos_theta)
theta_deg = np.degrees(theta_rad)

print(f"Angle: {theta_deg:.1f}°")  # 45.0°`

const mlApplicationsCode = `import numpy as np

# Cosine similarity: how "similar" are two vectors?
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Word embeddings example
# Imagine these represent words in a vector space
king = np.array([0.9, 0.2, 0.5])
queen = np.array([0.8, 0.3, 0.6])
apple = np.array([0.1, 0.9, 0.1])

# Similar words have high cosine similarity
print(f"king-queen: {cosine_similarity(king, queen):.3f}")  # ~0.98 (very similar!)
print(f"king-apple: {cosine_similarity(king, apple):.3f}")  # ~0.43 (not similar)

# This is how semantic search works!`
</script>

<template>
  <TopicPage
    title="Vectors in 2D"
    description="Arrows in 2D space, lists of numbers, and the foundation of machine learning."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="introduction" title="What is a Vector?" icon="fa-solid fa-arrow-right" collapsible>
        <p class="mb-4">
          A vector is just a <strong>list of numbers</strong>. That's it! In programming terms,
          it's an array. In math, we think of it geometrically as an <strong>arrow</strong> pointing
          from the origin to a point.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">Mathematical Notation</h4>
            <MathBlock formula="\vec{v} = \begin{bmatrix} 3 \\ 4 \end{bmatrix}" display />
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-primary mb-2">Python Code</h4>
            <code class="text-sm font-mono">v = np.array([3, 4])</code>
          </div>
        </div>

        <CodeExample
          id="linalg-vectors-basics"
          title="vector_basics.py"
          language="python"
          :code="vectorBasicsCode"
          :collapsible="true"
          :default-expanded="false"
        />

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mt-4 mb-4">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 mb-2">
              <i class="fa-solid fa-location-dot mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              "Walk 3 blocks north and 2 blocks east"—that's a vector! It tells you both
              <em>how far</em> and <em>which direction</em>. GPS directions are vectors.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Arrays with mathematical superpowers. A regular array is just numbers; a vector
              knows its length (magnitude) and can compute angles with other vectors.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 mb-2">
              <i class="fa-solid fa-arrow-up-right mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              An arrow from the origin to a point. The arrow's length is the magnitude,
              its direction is the angle. Same arrow, two perspectives: geometric and numeric.
            </p>
          </div>
        </div>

        <div
          class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Dividing by Zero Magnitude
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            Normalizing a vector divides by its magnitude. If the vector is
            <code>[0, 0]</code>, you'll get <code>NaN</code> or an error. Always check
            <code>if np.linalg.norm(v) > 0</code> before normalizing—the zero vector has no direction.
          </p>
        </div>
      </ContentSection>

      <!-- Interactive Explorer -->
      <ContentSection id="explorer" title="Interactive Explorer" icon="fa-solid fa-compass" collapsible>
        <p class="mb-4 text-text-secondary">
          Experiment with vector operations below. Try the presets to see special cases like
          perpendicular vectors (dot product = 0) or parallel vectors.
        </p>

        <VectorOperations sync-url />
      </ContentSection>

      <!-- Vector Addition -->
      <ContentSection
        id="addition"
        title="Vector Addition"
        icon="fa-solid fa-plus"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          Adding vectors is simple: <strong>add corresponding components</strong>. Geometrically,
          it's the "parallelogram law" — place vectors head-to-tail.
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <MathBlock
            formula="\vec{a} + \vec{b} = \begin{bmatrix} a_1 + b_1 \\ a_2 + b_2 \end{bmatrix}"
            display
          />
        </div>

        <CodeExample
          id="linalg-vectors-operations"
          title="vector_operations.py"
          language="python"
          :code="vectorOpsCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Dot Product -->
      <ContentSection
        id="dot-product"
        title="Dot Product"
        icon="fa-solid fa-circle-dot"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          The dot product is a <strong>single number</strong> that measures how much two vectors
          "align." It's computed by multiplying corresponding components and summing:
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-text-muted text-sm mb-2">Algebraic Form</h4>
            <MathBlock formula="\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2" display />
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-text-muted text-sm mb-2">Geometric Form</h4>
            <MathBlock formula="\vec{a} \cdot \vec{b} = |\vec{a}| |\vec{b}| \cos\theta" display />
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-key mr-2" aria-hidden="true" />
            Key Insight
          </p>
          <p class="text-text-secondary">
            <strong>Perpendicular vectors have a dot product of zero.</strong> This is how we
            detect orthogonality and why the dot product is so important in ML — it measures
            similarity between feature vectors.
          </p>
        </div>

        <CodeExample
          id="linalg-vectors-dotproduct"
          title="dot_product.py"
          language="python"
          :code="dotProductCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Magnitude & Unit Vectors -->
      <ContentSection
        id="magnitude"
        title="Magnitude & Unit Vectors"
        icon="fa-solid fa-ruler"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          The <strong>magnitude</strong> (length) of a vector comes from the Pythagorean theorem.
          A <strong>unit vector</strong> has magnitude 1 and points in the same direction.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-text-muted text-sm mb-2">Magnitude</h4>
            <MathBlock formula="|\vec{v}| = \sqrt{x^2 + y^2}" display />
          </div>
          <div class="p-4 rounded-lg border border-border">
            <h4 class="font-semibold text-text-muted text-sm mb-2">Unit Vector</h4>
            <MathBlock formula="\hat{v} = \frac{\vec{v}}{|\vec{v}|}" display />
          </div>
        </div>

        <CodeExample
          id="linalg-vectors-magnitude"
          title="magnitude_normalize.py"
          language="python"
          :code="magnitudeCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Angle Between Vectors -->
      <ContentSection
        id="angle"
        title="Angle Between Vectors"
        icon="fa-solid fa-angle-right"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          The angle between two vectors can be found by rearranging the geometric dot product formula:
        </p>

        <div class="p-4 rounded-lg border border-border mb-4">
          <MathBlock
            formula="\theta = \arccos\left(\frac{\vec{a} \cdot \vec{b}}{|\vec{a}| |\vec{b}|}\right)"
            display
          />
        </div>

        <CodeExample
          id="linalg-vectors-angle"
          title="vector_angle.py"
          language="python"
          :code="angleCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- ML Applications -->
      <ContentSection
        id="applications"
        title="ML Applications"
        icon="fa-solid fa-robot"
        collapsible
        :default-expanded="false"
      >
        <p class="mb-4">
          Vectors are everywhere in machine learning. Here's why they matter:
        </p>

        <div class="space-y-3 mb-4">
          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-font text-primary text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">Word Embeddings</h4>
              <p class="text-sm text-text-secondary">
                Words are represented as vectors in high-dimensional space. Similar words (king/queen)
                have similar vectors.
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-magnifying-glass text-primary text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">Cosine Similarity</h4>
              <p class="text-sm text-text-secondary">
                Measures how similar two vectors are, regardless of their magnitude. Powers
                semantic search and recommendations.
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-database text-primary text-sm" aria-hidden="true" />
            </span>
            <div>
              <h4 class="font-semibold">Feature Vectors</h4>
              <p class="text-sm text-text-secondary">
                Each data point in ML is a vector of features. Classification is finding which
                vectors are "close" to each other.
              </p>
            </div>
          </div>
        </div>

        <CodeExample
          id="linalg-vectors-cosinesim"
          title="cosine_similarity.py"
          language="python"
          :code="mlApplicationsCode"
          :collapsible="true"
          :default-expanded="false"
        />
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
