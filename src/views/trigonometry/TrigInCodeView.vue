<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import { TrigCodePlayground } from '@/components/widgets/TrigCodePlayground'

const relatedTopics = [
  {
    title: 'Trigonometry Overview',
    path: '/trigonometry',
    description: 'All trigonometry topics',
  },
  {
    title: 'Unit Circle',
    path: '/trigonometry/unit-circle',
    description: 'The foundation - where sin and cos come from',
  },
  {
    title: 'Inverse Trig Functions',
    path: '/trigonometry/inverse-functions',
    description: 'Finding angles from coordinates with atan2',
  },
  {
    title: 'Vectors',
    path: '/linear-algebra/vectors',
    description: 'Direction and magnitude calculations',
  },
]

const rotationCode = `import math

def rotate_point(x, y, angle_deg):
    """Rotate a point around the origin."""
    rad = math.radians(angle_deg)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)

    new_x = x * cos_a - y * sin_a
    new_y = x * sin_a + y * cos_a
    return new_x, new_y

# Rotate (100, 0) by 45 degrees
x, y = rotate_point(100, 0, 45)
print(f"({x:.2f}, {y:.2f})")  # (70.71, 70.71)`

const waveCode = `import math

def sine_wave(t, frequency, amplitude, phase=0):
    """Generate sine wave value at time t."""
    return amplitude * math.sin(2 * math.pi * frequency * t + phase)

# Generate wave samples
samples = [sine_wave(t/100, frequency=2, amplitude=1)
           for t in range(100)]

# Audio: 440 Hz = A4 note
sample_rate = 44100
duration = 1.0
audio = [sine_wave(t/sample_rate, 440, 0.5)
         for t in range(int(sample_rate * duration))]`

const circularCode = `import math

def circular_motion(t, radius, angular_speed, center=(0, 0)):
    """Calculate position on a circular path at time t."""
    angle = angular_speed * t
    x = center[0] + radius * math.cos(angle)
    y = center[1] + radius * math.sin(angle)
    return x, y

def orbit_position(t, radius, period, center=(0, 0)):
    """Position for orbital motion with given period."""
    angular_speed = 2 * math.pi / period
    return circular_motion(t, radius, angular_speed, center)

# Moon orbiting Earth (simplified)
# Period: 27.3 days, Distance: 384,400 km
for day in range(28):
    x, y = orbit_position(day, 384400, 27.3)
    print(f"Day {day}: ({x:.0f}, {y:.0f}) km")`

const projectileCode = `import math

def projectile_position(t, speed, angle_deg, gravity=9.8):
    """Calculate projectile position at time t."""
    rad = math.radians(angle_deg)
    vx = speed * math.cos(rad)
    vy = speed * math.sin(rad)

    x = vx * t
    y = vy * t - 0.5 * gravity * t * t
    return x, y

def projectile_range(speed, angle_deg, gravity=9.8):
    """Calculate horizontal range."""
    rad = math.radians(angle_deg)
    return (speed ** 2 * math.sin(2 * rad)) / gravity

def max_height(speed, angle_deg, gravity=9.8):
    """Calculate maximum height."""
    rad = math.radians(angle_deg)
    vy = speed * math.sin(rad)
    return (vy ** 2) / (2 * gravity)

# Launch at 20 m/s, 45 degrees (optimal angle)
r = projectile_range(20, 45)
h = max_height(20, 45)
print(f"Range: {r:.2f}m, Max Height: {h:.2f}m")`

const easingCode = `import math

def ease_in_out_sine(t):
    """Smooth start and stop (0 <= t <= 1)."""
    return -(math.cos(math.pi * t) - 1) / 2

def ease_in_sine(t):
    """Slow start, fast end."""
    return 1 - math.cos((t * math.pi) / 2)

def ease_out_sine(t):
    """Fast start, slow end."""
    return math.sin((t * math.pi) / 2)

def bounce(t, bounces=3):
    """Bouncing effect."""
    return abs(math.sin(bounces * math.pi * t)) * (1 - t)

# Animation example
duration = 1.0
frames = 60
for frame in range(frames + 1):
    t = frame / frames
    progress = ease_in_out_sine(t)
    position = 0 + (100 - 0) * progress  # 0 to 100
    print(f"Frame {frame}: position = {position:.1f}")`
</script>

<template>
  <TopicPage
    title="Trig in Code"
    description="Practical trigonometry implementations that programmers actually use."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection id="intro" title="Trig is Everywhere in Code" icon="fa-solid fa-code" collapsible>
        <p class="mb-4">
          If you've ever wondered "when will I actually use trig?", here's the answer:
          <strong>constantly</strong>. Every rotation, every animation, every physics simulation,
          every game mechanic that involves angles or circles uses sine and cosine under the hood.
        </p>

        <!-- Three analogies -->
        <div class="grid gap-4 sm:grid-cols-3 mb-6">
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-gamepad mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Trig in code is like a universal translator between "which direction?" and "how far
              left/right and up/down?" Every time you aim in a game, that translation happens.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-text-secondary">
              Think of sin/cos as coordinate converters: <code>angle → (x, y)</code>. And atan2 as the
              reverse: <code>(x, y) → angle</code>. These are your core APIs for anything circular.
            </p>
          </div>
          <div class="p-4 bg-surface-alt rounded-lg border border-border">
            <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-circle-notch mr-2" aria-hidden="true" />
              Visual Intuition
            </h4>
            <p class="text-sm text-text-secondary">
              Picture a clock hand. As time passes, it sweeps in a circle. At any moment,
              cos(angle) tells you how far right it is, sin(angle) tells you how far up.
            </p>
          </div>
        </div>

        <!-- Common pitfall -->
        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg mb-6">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Common Pitfall: Screen Y is Inverted!
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            In math, Y increases upward. In most screen/canvas systems, Y increases <em>downward</em>.
            This flips your angles! A positive rotation in math goes counter-clockwise, but on screen
            it goes clockwise. Always check your coordinate system.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-sync text-primary mr-2" aria-hidden="true" />
              Rotation
            </p>
            <p class="text-sm text-text-muted">
              Spinning sprites, rotating UI elements, transforming coordinates between reference frames.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-wave-square text-primary mr-2" aria-hidden="true" />
              Waves & Oscillation
            </p>
            <p class="text-sm text-text-muted">
              Audio synthesis, pulsing animations, breathing effects, any periodic motion.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-circle-notch text-primary mr-2" aria-hidden="true" />
              Circular Motion
            </p>
            <p class="text-sm text-text-muted">
              Orbiting objects, radar sweeps, circular progress indicators, clock hands.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-basketball text-primary mr-2" aria-hidden="true" />
              Physics & Projectiles
            </p>
            <p class="text-sm text-text-muted">
              Throwing objects, ballistic trajectories, jump arcs, particle systems.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Interactive Playground -->
      <ContentSection id="playground" title="Interactive Playground" icon="fa-solid fa-play" collapsible>
        <p class="mb-4 text-text-secondary">
          Experiment with these four common trig applications. Each demo shows the math, the code,
          and the visual result together.
        </p>

        <TrigCodePlayground />
      </ContentSection>

      <!-- 2D Rotation -->
      <ContentSection
        id="rotation"
        title="2D Rotation"
        icon="fa-solid fa-sync"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          The rotation formula is one of the most useful things you'll learn. To rotate a point
          <MathBlock formula="(x, y)" /> by angle <MathBlock formula="\theta" /> around the origin:
        </p>

        <div class="p-4 bg-surface-alt rounded-lg border border-border mb-4">
          <MathBlock
            formula="x' = x \cos(\theta) - y \sin(\theta)"
            display
          />
          <MathBlock
            formula="y' = x \sin(\theta) + y \cos(\theta)"
            display
          />
        </div>

        <p class="mb-4">
          This is actually a matrix multiplication in disguise. The <strong>rotation matrix</strong> is:
        </p>

        <MathBlock
          formula="R(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}"
          display
        />

        <div class="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            Why This Pattern?
          </p>
          <p class="text-sm text-text-secondary">
            Remember, <MathBlock formula="\cos\theta" /> is the x-coordinate on the unit circle and
            <MathBlock formula="\sin\theta" /> is the y-coordinate. The rotation formula projects
            your point onto these rotated axes.
          </p>
        </div>

        <div class="mt-4">
          <CodeExample id="trig-code-rotation" title="rotate_point.py" language="python" :code="rotationCode" />
        </div>
      </ContentSection>

      <!-- Wave Generation -->
      <ContentSection
        id="waves"
        title="Wave Generation"
        icon="fa-solid fa-wave-square"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Sine waves are the building blocks of audio, animation, and signal processing.
          The general form is:
        </p>

        <MathBlock
          formula="y(t) = A \sin(2\pi f t + \phi)"
          display
        />

        <div class="grid gap-3 md:grid-cols-3 my-4">
          <div class="p-3 rounded border border-border">
            <p class="font-mono text-primary">A</p>
            <p class="text-sm text-text-muted">Amplitude (height)</p>
          </div>
          <div class="p-3 rounded border border-border">
            <p class="font-mono text-primary">f</p>
            <p class="text-sm text-text-muted">Frequency (cycles/sec)</p>
          </div>
          <div class="p-3 rounded border border-border">
            <p class="font-mono text-primary">&phi;</p>
            <p class="text-sm text-text-muted">Phase (starting offset)</p>
          </div>
        </div>

        <p class="mb-4">
          In audio, 440 Hz is the A4 note. In animation, low frequencies (0.5-2 Hz) create
          smooth pulsing effects.
        </p>

        <CodeExample id="trig-code-wave" title="sine_wave.py" language="python" :code="waveCode" />
      </ContentSection>

      <!-- Circular Motion -->
      <ContentSection
        id="circular"
        title="Circular Motion"
        icon="fa-solid fa-circle-notch"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Moving an object in a circle is just evaluating sine and cosine at increasing angles:
        </p>

        <MathBlock
          formula="x(t) = r \cos(\omega t), \quad y(t) = r \sin(\omega t)"
          display
        />

        <p class="mb-4">
          Where <MathBlock formula="r" /> is the radius and <MathBlock formula="\omega" /> (omega)
          is the angular speed in radians per second. For a specific period <MathBlock formula="T" />:
        </p>

        <MathBlock
          formula="\omega = \frac{2\pi}{T}"
          display
        />

        <div class="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
            <i class="fa-solid fa-clock mr-2" aria-hidden="true" />
            Real-World Example
          </p>
          <p class="text-sm text-text-secondary">
            A clock second hand completes one revolution in 60 seconds, so
            <MathBlock formula="\omega = 2\pi/60 \approx 0.105" /> rad/s. At <MathBlock formula="t = 15" /> seconds,
            the hand points at 3 o'clock: <MathBlock formula="(\cos(\pi/2), \sin(\pi/2)) = (0, 1)" />.
          </p>
        </div>

        <div class="mt-4">
          <CodeExample id="trig-code-circular" title="circular_motion.py" language="python" :code="circularCode" />
        </div>
      </ContentSection>

      <!-- Projectile Motion -->
      <ContentSection
        id="projectile"
        title="Projectile Motion"
        icon="fa-solid fa-basketball"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Every ball throw, arrow shot, or jump arc in games uses projectile physics.
          The key equations decompose velocity into horizontal and vertical components:
        </p>

        <MathBlock
          formula="v_x = v \cos(\theta), \quad v_y = v \sin(\theta)"
          display
        />

        <p class="mb-4">Position at time <MathBlock formula="t" />:</p>

        <div class="p-4 bg-surface-alt rounded-lg border border-border mb-4">
          <MathBlock formula="x(t) = v_x \cdot t" display />
          <MathBlock formula="y(t) = v_y \cdot t - \frac{1}{2}gt^2" display />
        </div>

        <p class="mb-4">Two useful derived formulas:</p>

        <div class="grid gap-3 md:grid-cols-2 mb-4">
          <div class="p-3 rounded border border-border">
            <p class="text-sm text-text-muted mb-1">Horizontal Range</p>
            <MathBlock formula="R = \frac{v^2 \sin(2\theta)}{g}" />
          </div>
          <div class="p-3 rounded border border-border">
            <p class="text-sm text-text-muted mb-1">Maximum Height</p>
            <MathBlock formula="H = \frac{v_y^2}{2g} = \frac{v^2 \sin^2(\theta)}{2g}" />
          </div>
        </div>

        <div class="p-3 bg-primary/10 border border-primary/30 rounded-lg mb-4">
          <p class="font-semibold text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            45&deg; is Optimal
          </p>
          <p class="text-sm text-text-secondary">
            For maximum range on flat ground, launch at 45&deg;. This is because
            <MathBlock formula="\sin(2 \times 45°) = \sin(90°) = 1" />, which maximizes the range formula.
          </p>
        </div>

        <CodeExample id="trig-code-projectile" title="projectile.py" language="python" :code="projectileCode" />
      </ContentSection>

      <!-- Animation Easing -->
      <ContentSection
        id="easing"
        title="Animation Easing"
        icon="fa-solid fa-bezier-curve"
        :default-expanded="false"
        collapsible
      >
        <p class="mb-4">
          Trig functions create smooth, natural-feeling animations. Linear motion looks robotic;
          easing makes things feel alive.
        </p>

        <div class="grid gap-4 md:grid-cols-2 mb-4">
          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">Ease In-Out Sine</p>
            <MathBlock formula="\frac{1 - \cos(\pi t)}{2}" />
            <p class="text-sm text-text-muted mt-2">
              Slow start, fast middle, slow end. Perfect for UI transitions.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">Ease In Sine</p>
            <MathBlock formula="1 - \cos\left(\frac{\pi t}{2}\right)" />
            <p class="text-sm text-text-muted mt-2">
              Slow start, fast end. Good for things accelerating.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">Ease Out Sine</p>
            <MathBlock formula="\sin\left(\frac{\pi t}{2}\right)" />
            <p class="text-sm text-text-muted mt-2">
              Fast start, slow end. Good for things decelerating.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border">
            <p class="font-medium text-text-primary mb-2">Bounce</p>
            <MathBlock formula="|\sin(n\pi t)| \cdot (1 - t)" />
            <p class="text-sm text-text-muted mt-2">
              Bouncing ball effect with <MathBlock formula="n" /> bounces.
            </p>
          </div>
        </div>

        <CodeExample id="trig-code-easing" title="easing.py" language="python" :code="easingCode" />
      </ContentSection>

      <!-- Summary -->
      <ContentSection id="summary" title="Key Takeaways" icon="fa-solid fa-check-circle" collapsible :default-expanded="false">
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 rounded-lg border border-border">
            <i class="fa-solid fa-arrow-right text-primary mt-1" aria-hidden="true" />
            <p class="text-text-secondary">
              <strong class="text-text-primary">Rotation</strong> uses the rotation matrix:
              multiply by <MathBlock formula="\cos\theta" /> and <MathBlock formula="\sin\theta" />
              to transform coordinates.
            </p>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-lg border border-border">
            <i class="fa-solid fa-arrow-right text-primary mt-1" aria-hidden="true" />
            <p class="text-text-secondary">
              <strong class="text-text-primary">Waves</strong> are parameterized by amplitude, frequency,
              and phase. Everything oscillating uses sine waves.
            </p>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-lg border border-border">
            <i class="fa-solid fa-arrow-right text-primary mt-1" aria-hidden="true" />
            <p class="text-text-secondary">
              <strong class="text-text-primary">Circular motion</strong> is just evaluating
              <MathBlock formula="(\cos\theta, \sin\theta)" /> as <MathBlock formula="\theta" /> increases over time.
            </p>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-lg border border-border">
            <i class="fa-solid fa-arrow-right text-primary mt-1" aria-hidden="true" />
            <p class="text-text-secondary">
              <strong class="text-text-primary">Projectile motion</strong> decomposes velocity into
              x and y components using <MathBlock formula="\cos" /> and <MathBlock formula="\sin" />.
            </p>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-lg border border-border">
            <i class="fa-solid fa-arrow-right text-primary mt-1" aria-hidden="true" />
            <p class="text-text-secondary">
              <strong class="text-text-primary">Easing functions</strong> based on trig create
              natural-feeling animations instead of robotic linear motion.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
