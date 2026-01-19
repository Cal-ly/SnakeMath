# Content Review Progress

This document tracks progress on upgrading topic pages using legacy review/planning summaries.

---

## Completed: /trigonometry/unit-circle

**Date**: 2026-01-17

### Files Modified
- `src/views/trigonometry/UnitCircleView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: Introduction section, after the math equation

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): Clock face - every "time" (angle) has a unique fingerprint, the hour hand traces the circle
- **Programming Analogy** (emerald): Lookup table from angle → (x, y) for rotation, animation, direction
- **Visual Intuition** (blue): Walking around circle traces cos/sin waves - circular motion = two waves in sync

#### 2. Pitfall Callout
Already existed in "Radians vs Degrees" section: warns that Python's math.sin()/cos() expect radians, not degrees. No additional callout needed.

#### 3. Updated RelatedTopics
Expanded from 2 to 4 related topics:
- Trigonometry Overview (kept)
- Vectors (new) - "Unit vectors and direction calculations use trig"
- Limits (new) - "The famous sin(x)/x limit equals 1"
- Functions (kept, improved description) - "Trig functions map angles to coordinates"

Removed faIcon properties.

#### 4. Improved Navigation Description
Changed from: "Sine, cosine, and angles on a circle"
Changed to: "Every angle tells a story through its coordinates"

This uses the "every angle tells a story" framing from legacy docs (CONTENT_UNITCIRCLE.md).

### Validation
- ✅ `npm run type-check` passed

### Follow-ups for Next Pass
- Consider adding polar↔cartesian conversion example (from CONTENT_UNITCIRCLE.md new examples)
- Could add angle normalization utility example
- Consider adding "rotation drift" warning for iterative rotation applications

---

## Completed: /statistics/descriptive

**Date**: 2026-01-17

### Files Modified
- `src/views/statistics/DescriptiveStatsView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: Introduction section, after "Three Questions, Three Answers" box

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): Restaurant review - mean is average experience, std dev is how opinions varied, median is the typical visit
- **Programming Analogy** (emerald): Data's metadata - like files have size/date/type, datasets have mean/median/std
- **Visual Intuition** (blue): Box plot as "5-number summary at a glance" - min, Q1, median, Q3, max plus outliers

#### 2. Added Misconception Callout
Location: Introduction section, after the analogies

Content: "Common Pitfall: Don't Use Mean for Skewed Data" - warns that mean gets pulled toward outliers in skewed data (like income). Uses the CEO salary example. Recommends median for skewed data.

Note: Page already had a "Common Pitfalls" list in Quick Reference section - this new callout provides a more prominent, focused warning on the most impactful mistake.

#### 3. Updated RelatedTopics
Expanded from 2 to 4 related topics:
- Statistics Overview (kept)
- Summation - improved description: "The math behind calculating means and totals"
- Functions (new) - "Understanding transformations like z-score normalization"
- Number Types (new) - "Integer vs float precision in statistical calculations"

Removed faIcon properties (RelatedTopics component handles icons automatically).

#### 4. Improved Navigation Description
Changed from: "Mean, median, variance, and data visualization"
Changed to: "Summarize any dataset's personality with a few key numbers"

This uses the "data's biography/personality" framing from legacy docs.

### Validation
- ✅ `npm run type-check` passed

### Follow-ups for Next Pass
- Consider adding Simpson's Paradox visual demo (from CONTENT_DESCRIPTIVE_STATS.md Phase 1)
- Could add streaming statistics section (Welford's algorithm) for real-time data
- Consider adding "correlation ≠ causation" callout in visualization context

---

## Completed: /calculus/limits

**Date**: 2026-01-17

### Files Modified
- `src/views/calculus/LimitsView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: Introduction section, replacing the 2-column "Mathematical/Programming Intuition" grid

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): "Stop sign" - watching a car approach a stop sign, predicting destination before arrival
- **Programming Analogy** (emerald): Convergence loop with tolerance check
- **Visual Intuition** (blue): Zooming in on a curve, seeing y-values cluster around L

#### 2. Added Misconception Callout
Location: Introduction section, after "Why Limits Matter" box

Content: "Common Pitfall: Approach ≠ Plug In" - warns that limits are about approaching, not substituting. Uses the (x²-1)/(x-1) example where the function is undefined at x=1 but the limit is 2.

#### 3. Updated RelatedTopics
Added Derivatives link at the top of the list:
- "Derivatives - Derivatives are defined using limits"

Also fixed typo: "L'Hopital" → "L'Hôpital"

#### 4. Improved Navigation Description
Changed from: "Understanding approaching values"
Changed to: "What happens when we get really, really close?"

This uses the engaging hook from the legacy docs and better captures the intuition.

### Validation
- ✅ `npm run type-check` passed

### Follow-ups for Next Pass
- Consider adding a "floating point pitfall" example showing catastrophic cancellation when h is too small (from CONTENT_LIMITS.md Phase 2 recommendations)
- Could add more "Try These Experiments" items for the LimitsExplorer
- The continuity connection could be strengthened with a brief mention of "no surprises" framing

---

## Completed: /linear-algebra/vectors

**Date**: 2026-01-17

### Files Modified
- `src/views/linear-algebra/VectorsView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: Introduction section, after the code example

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): GPS directions - "Walk 3 blocks north and 2 blocks east" tells you both how far and which direction
- **Programming Analogy** (emerald): Arrays with mathematical superpowers - a regular array is just numbers; a vector knows its length (magnitude) and can compute angles
- **Visual Intuition** (blue): Arrow from origin to a point - the arrow's length is magnitude, direction is angle. Same arrow, two perspectives (geometric and numeric)

#### 2. Added Misconception Callout
Location: Introduction section, after the analogies

Content: "Common Pitfall: Dividing by Zero Magnitude" - warns that normalizing a vector divides by its magnitude. If the vector is [0, 0], you'll get NaN. Always check `if np.linalg.norm(v) > 0` before normalizing—the zero vector has no direction.

#### 3. Updated RelatedTopics
Expanded from 3 to 4 related topics:
- Linear Algebra Overview (kept)
- Matrices (new) - "Transform and rotate vectors"
- Unit Circle (new) - "Unit vectors and angle calculations"
- Summation (kept)

Removed Descriptive Statistics (less relevant than trig/matrices connections).

#### 4. Improved Navigation Description
Changed from: "Points, directions, and operations in 2D space"
Changed to: "Arrows with purpose—magnitude and direction in one package"

This uses the "arrows with purpose" framing from legacy docs (CONTENT_VECTORS_2D.md).

### Validation
- ✅ `npm run type-check` passed

### Follow-ups for Next Pass
- Consider adding steering behaviors example (seek/flee from CONTENT_VECTORS_2D.md)
- Could add collision reflection demo for physics applications
- Consider adding 2D perpendicular vector utility (`perp(v) = [-v[1], v[0]]`)
- Could add lerp (linear interpolation) example for animation

---

## Completed: /linear-algebra/matrices

**Date**: 2026-01-17

### Files Modified
- `src/views/linear-algebra/MatricesView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: Introduction section, after the code example

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): Spreadsheets with superpowers - stores data in rows/columns but can transform, rotate, and reshape
- **Programming Analogy** (emerald): Array of arrays with mathematical operations - `A @ B` multiplies matrices, powers every neural network layer
- **Visual Intuition** (blue): Columns show where basis vectors land - first column is where (1,0) goes, second is where (0,1) goes

#### 2. Added Misconception Callout
Location: Introduction section, after the analogies

Content: "Common Pitfall: Don't Invert, Solve Instead" - warns to use `np.linalg.solve(A, b)` instead of `np.linalg.inv(A) @ b`. Computing inverse is slower, less accurate, and fails for nearly-singular matrices.

#### 3. Updated RelatedTopics
Expanded from 3 to 4 related topics:
- Linear Algebra Overview (kept)
- Vectors (kept, improved description) - "What matrices transform"
- Unit Circle (kept, improved description) - "Sin/cos power rotation matrices"
- Functions (new) - "Matrices as linear functions"

#### 4. Improved Navigation Description
Changed from: "2D transformations and operations"
Changed to: "Spreadsheets with superpowers—transform, rotate, reshape"

This uses the "spreadsheets with superpowers" framing from legacy docs (CONTENT_MATRICES_2D.md).

### Validation
- ✅ `npm run type-check` passed

### Follow-ups for Next Pass
- Consider adding nearly-singular matrix warning example (from CONTENT_MATRICES_2D.md)
- Could add blocked matrix multiplication for performance optimization
- Consider adding SVD image compression demo (visual and compelling)
- Could add condition number impact demo to show sensitivity to noise

---

## Completed: /algebra/summation

**Date**: 2026-01-17

### Files Modified
- `src/views/algebra/SummationView.vue`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: Introduction section, after "The Programmer's Secret" box

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): Adding up a receipt - start at zero, go through each item, add to running total
- **Programming Analogy** (emerald): Glorified for-loop with accumulator - lower bound is start, upper bound is end, expression is what you += each iteration
- **Visual Intuition** (blue): Stacking blocks one at a time - each term adds a block, total height is the sum

#### 2. Added Misconception Callout
Location: Introduction section, after the analogies

Content: "Common Pitfall: Off-by-One Errors" - warns that math Σ is inclusive (includes n) but Python range() excludes n. Always use range(1, n+1) to match mathematical convention.

#### 3. Updated RelatedTopics
Expanded from 2 to 4 related topics:
- Algebra Overview (kept)
- Product Notation (new) - "Π is the multiplicative cousin of Σ"
- Descriptive Statistics (new) - "Means and totals use summation"
- Vectors (new) - "Vector sums combine components"

#### 4. Navigation Description
Kept as-is: "Sigma is just a for loop" - already matches the "glorified for-loop" framing from CONTENT_ALGEBRA.md

### Validation
- ✅ `npm run type-check` passed

### Follow-ups for Next Pass
- Consider adding the "pairing trick" explanation for n(n+1)/2 formula (from CONTENT_ALGEBRA.md)
- Could add mathematical induction proof section (from archive advanced.md)
- Consider adding descriptive statistics worked example (mean calculation)

---

## Completed: /algebra/product-notation

**Date**: 2026-01-17

### Files Modified
- `src/views/algebra/ProductNotationView.vue`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: Introduction section, after "The Pattern" box

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): Assembly line - each station multiplies by a factor, final output is everything multiplied together
- **Programming Analogy** (emerald): For-loop with *= instead of +=, start with 1 (not 0!)
- **Visual Intuition** (blue): Chain of multiplications - each link is a factor, remove one (factor = 0) and everything collapses

#### 2. Added Misconception Callout
Location: Introduction section, after the analogies

Content: "Common Pitfall: Underflow with Many Small Numbers" - warns about multiplying many small probabilities underflowing to 0. Use log-sum trick: log(∏ aᵢ) = Σ log(aᵢ), then exponentiate.

#### 3. Updated RelatedTopics
Expanded from 2 to 4 related topics:
- Algebra Overview (kept)
- Summation (kept, improved description) - "Σ is the additive cousin of Π"
- Exponentials (new) - "Logs convert products to sums"
- Descriptive Statistics (new) - "Variance uses squared products"

#### 4. Navigation Description
Kept as-is: "Pi is just a for loop with multiplication" - already good

### Validation
- ✅ `npm run type-check` passed

### Follow-ups for Next Pass
- Consider adding log-stable product implementation example (from CONTENT_ALGEBRA.md)
- Could add Naive Bayes probability example (from archive applications.md)
- Consider adding numerical stability comparison demo

---

## Completed: /basics/functions

**Date**: 2026-01-17

### Files Modified
- `src/views/basics/FunctionsView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: After the first code example in "What is a Function?" section

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): Vending machine - put in money (input), press button (function), get snack (output)
- **Programming Analogy** (emerald): A def block with return - parameters in, value out, body is the "how"
- **Visual Intuition** (blue): Box with arrow in and out - what's inside is the rule, arrows are I/O

#### 2. Added Misconception Callout
Location: After the analogies

Content: "Common Pitfall: Mutable Default Arguments" - warns about `def f(items=[])` bug in Python where the list is shared across calls. Use `items=None` pattern instead.

#### 3. Updated RelatedTopics
Expanded from 2 to 4 related topics:
- Basics Overview (new)
- Variables (kept, improved description) - "The values functions work with"
- Matrices (new) - "Matrices as linear functions"
- Limits (new) - "What happens as inputs approach a value"

#### 4. Improved Navigation Description
Changed from: "Input, output, and the f(x) notation"
Changed to: "Math machines—same input, same output, every time"

### Validation
- ✅ `npm run type-check` passed

### Follow-ups for Next Pass
- Consider adding inverse function example (from CONTENT_BASICS.md)
- Could add function composition interactive demo
- Consider domain/range visualization

---

## Completed: /basics/number-types

**Date**: 2026-01-18

### Files Modified
- `src/views/basics/NumberTypesView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: Introduction section, after the hierarchy explanation

Three analogies added matching the DerivativesView pattern:
- **Everyday Analogy** (amber): Chef knowing salt from sugar - wrong type = disaster
- **Programming Analogy** (emerald): Container sizes - int/float/complex as different capacity boxes
- **Visual Intuition** (blue): Nesting dolls - each set contains all previous sets plus more

#### 2. Added Misconception Callout
Location: Introduction section, after the analogies

Content: "Common Pitfall: 0.1 + 0.2 ≠ 0.3" - warns about binary float representation, recommends math.isclose() or Decimal for financial calculations.

#### 3. Updated RelatedTopics
Expanded from 2 to 4 related topics:
- Basics Overview (new)
- Variables - "The containers that hold numbers"
- Functions - "Maps between number types"
- Math Symbols (kept)

#### 4. Improved Navigation Description
Changed from: "Understanding ℕ, ℤ, ℚ, ℝ, and ℂ"
Changed to: "Nested sets from counting numbers to complex—pick the right container"

### Validation
- ✅ `npm run type-check` passed

---

## Completed: /basics/variables

**Date**: 2026-01-18

### Files Modified
- `src/views/basics/VariablesView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: After the code example in "What is a Variable?" section

Three analogies added:
- **Everyday Analogy** (amber): Labeled boxes - name is label, value is contents
- **Programming Analogy** (emerald): Memory addresses with friendly names
- **Visual Intuition** (blue): Variables are nouns, expressions are sentences

#### 2. Added Misconception Callout
Location: After the analogies

Content: "Common Pitfall: = Means Assignment, Not Equality" - warns about the difference between = in math (statement of fact) vs Python (action). Use == for equality testing.

#### 3. Updated RelatedTopics
Expanded from 2 to 4 related topics:
- Basics Overview (new)
- Functions - "Variables as inputs and outputs"
- Order of Operations - "How expressions are evaluated"
- Number Types (new) - "What values variables can hold"

#### 4. Improved Navigation Description
Changed from: "Named values and how to combine them"
Changed to: "Labeled boxes for values, recipes that combine them"

### Validation
- ✅ `npm run type-check` passed

---

## Completed: /basics/order-of-operations

**Date**: 2026-01-18

### Files Modified
- `src/views/basics/OrderOfOperationsView.vue`
- `src/data/navigation.ts`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: After the "Why Order Matters" code example

Three analogies added:
- **Everyday Analogy** (amber): Getting dressed routine - underwear before pants, socks before shoes
- **Programming Analogy** (emerald): Function call nesting - higher precedence = called first
- **Visual Intuition** (blue): Expression tree - high precedence near leaves, low near root

#### 2. Added Misconception Callout
Location: After the analogies

Content: "Common Pitfall: -3**2 = -9, Not 9!" - warns that exponentiation has higher precedence than unary minus.

#### 3. Updated RelatedTopics
Expanded from 2 to 4 related topics:
- Basics Overview (new)
- Variables - "Expressions combine variables"
- Functions - "f(x) acts like high-precedence parentheses"
- Exponentials (new) - "Power and precedence"

#### 4. Improved Navigation Description
Changed from: "PEMDAS and operator precedence"
Changed to: "PEMDAS: the dressing order for math operations"

### Validation
- ✅ `npm run type-check` passed

---

## Completed: /basics/foundations

**Date**: 2026-01-18

### Files Modified
- `src/views/basics/FoundationsView.vue`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: After the basic operators code example

Three analogies added:
- **Everyday Analogy** (amber): Master chef uses salt, acid, fat, heat - math uses +, -, ×, ÷
- **Programming Analogy** (emerald): Programs compile to CPU instructions, formulas compile to basic operations
- **Visual Intuition** (blue): Skyscraper looks complex but built from simple bricks

#### 2. Added Misconception Callout
Location: After the analogies

Content: "Common Pitfall: Division by Zero" - warns about ZeroDivisionError and guarding divisions.

#### 3. Updated RelatedTopics
Expanded from 2 to 4 related topics:
- Basics Overview (new)
- Math Symbols - "Translate notation to operations"
- Order of Operations (new) - "How to combine the four operators"
- Summation (new) - "Σ is just repeated addition"

### Validation
- ✅ `npm run type-check` passed

---

## Completed: /algebra/linear-equations

**Date**: 2026-01-18

### Files Modified
- `src/views/algebra/LinearEquationsView.vue`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: After "The Programmer's View" box

Three analogies added:
- **Everyday Analogy** (amber): GPS - given starting point and speed, tells you where you'll be
- **Programming Analogy** (emerald): Lookup function y = m*x + b; systems are matrix multiplication A @ x = b
- **Visual Intuition** (blue): Straight lines - two equations = two lines, intersection is solution

#### 2. Added Misconception Callout
Location: After the analogies

Content: "Common Pitfall: Division by Coefficient" - warns that if a=0, it's not a linear equation.

#### 3. Updated RelatedTopics
Simplified format and added:
- Algebra Overview
- Matrices (new) - "Systems become Ax = b"
- Quadratics - "When lines become curves"
- Variables - "The building blocks of equations"

### Validation
- ✅ `npm run type-check` passed

---

## Completed: /algebra/quadratics

**Date**: 2026-01-18

### Files Modified
- `src/views/algebra/QuadraticsView.vue`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: After "Why Programmers Care" paragraph

Three analogies added:
- **Everyday Analogy** (amber): Throwing a ball - vertex is peak height, roots are departure/landing
- **Programming Analogy** (emerald): DNA of curves - simplest non-linear function, neural networks follow quadratic error surfaces
- **Visual Intuition** (blue): Symmetric parabola - vertex is max (frown) or min (smile) based on sign of a

#### 2. Added Misconception Callout
Location: After the analogies

Content: "Common Pitfall: Negative Discriminant" - warns that b² - 4ac < 0 gives complex roots, math.sqrt() will error.

#### 3. Updated RelatedTopics
Updated to 4 topics:
- Algebra Overview
- Linear Equations (new) - "Simpler: degree 1 polynomials"
- Number Types - "Complex numbers for imaginary roots"
- Derivatives (new) - "Finding the vertex via calculus"

### Validation
- ✅ `npm run type-check` passed

---

## Completed: /algebra/exponentials

**Date**: 2026-01-18

### Files Modified
- `src/views/algebra/ExponentialsView.vue`

### Changes Made

#### 1. Added 3-Analogy Block (Required Pattern)
Location: After the powers of 2 code example

Three analogies added:
- **Everyday Analogy** (amber): "Mathematical time machines" - compress or expand time
- **Programming Analogy** (emerald): Logarithms are "mathematical detectives" - how many times did we multiply?
- **Visual Intuition** (blue): Exponentials explode upward, logs flatten - mirror images around y = x

#### 2. Added Misconception Callout
Location: After the analogies

Content: "Common Pitfall: log(0) and log(negative)" - warns that logs only defined for positive numbers, math.log(0) gives -inf, math.log(-1) raises ValueError.

#### 3. Updated RelatedTopics
Updated to 4 topics:
- Algebra Overview
- Product Notation (new) - "Logs convert products to sums"
- Derivatives (new) - "e^x is its own derivative"
- Limits (new) - "How e is defined"

### Validation
- ✅ `npm run type-check` passed

---

## Completed: Design System Card Audit

**Date**: 2026-01-18

### Files Modified
- `src/views/calculus/CalculusIndexView.vue`
- `src/views/calculus/DerivativesView.vue`
- `src/views/calculus/LimitsView.vue`

### Issue Identified
Content cards (non-clickable) were incorrectly using `bg-surface-alt` (navigational card style) instead of border-only style.

Per DESIGN_SYSTEM.md:
- **Navigational cards** (clickable): Use `bg-surface-alt` + `hover:border-primary`
- **Content cards** (non-clickable): Use border-only (`rounded-lg p-4 border border-border`)
- **Three-Analogy Block**: Exception - uses `bg-surface-alt` (documented requirement)

### Changes Made

#### CalculusIndexView
1. Removed "Limits Preview" section entirely (duplicates dedicated /calculus/limits page)
2. Fixed Differential/Integral Calculus cards: removed `bg-surface-alt`
3. Fixed "Why Programmers Need Calculus" cards (6 cards): removed `bg-surface-alt`

#### DerivativesView
1. Fixed math formula display container: removed `bg-surface-alt`
2. Fixed "Try These Experiments" box: removed `bg-surface-alt`
3. Fixed "Common Derivatives to Know" box: removed `bg-surface-alt`
4. Fixed gradient descent formula + analogy cards: removed `bg-surface-alt`
5. Fixed "More Programming Applications" cards (4 cards): removed `bg-surface-alt`

Three-analogy block at lines 252-285 kept `bg-surface-alt` (correct per design system).

#### LimitsView
1. Fixed math formula display container: removed `bg-surface-alt`
2. Fixed "Try These Experiments" box: removed `bg-surface-alt`
3. Fixed epsilon-delta formula display: removed `bg-surface-alt`
4. Fixed one-sided limits cards: removed `bg-surface-alt`
5. Fixed "Famous Limits" cards (3 cards): removed `bg-surface-alt`
6. Fixed "Applications in Programming" cards (4 cards): removed `bg-surface-alt`

Three-analogy block at lines 247-280 kept `bg-surface-alt` (correct per design system).

#### Files Verified as Correct
- `src/views/statistics/StatisticsIndexView.vue` - Already compliant
- `src/views/statistics/DescriptiveStatsView.vue` - Already compliant

### Validation
- ✅ `npm run type-check` passed

---

## Queue

All CONTENT_ALGEBRA.md and CONTENT_BASICS.md topics completed!

Remaining:
- /probability (CONTENT_PROBABILITY.md) - no view exists yet
