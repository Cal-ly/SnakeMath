# CONTENT_BASICS.md

Goal: convert the archived “Basics” module into SnakeMath’s current content style, but keep this intentionally lightweight: a short overview per subject page, each with at least one citation + one exemplar.

Primary sources (archive only):

- `archive/snake-math/docs/basics/index.md`
- `archive/snake-math/docs/basics/foundations.md`
- `archive/snake-math/docs/basics/order-of-operations.md`
- `archive/snake-math/docs/basics/variables-expressions.md`
- `archive/snake-math/docs/basics/functions.md`
- `archive/snake-math/docs/basics/number-theory.md`

---

## Basics index (hub): “Mathematical Foundations”

**What it’s for**

- A landing page that frames Basics as a pragmatic “toolkit” and links out to the five concept pages.

**Keep (voice + framing)**

- “Think of this section as your mathematical toolkit…” (`archive/snake-math/docs/basics/index.md:L25`).

**Keep (structure)**

- The scan-friendly topic list with “What you’ll learn” and “Key concepts” per page is a good navigation primitive (`archive/snake-math/docs/basics/index.md:L31-L100`).

**Implementation note**

- In the current site, preserve the “index-page” feel: this page should stay a fast router to the interactive pages, not a long lesson.

---

## Foundations

**What it’s for**

- Establish that “math” is mostly operations + rules, then lower intimidation by rewriting something “advanced” (a differential equation) into repeated basic steps.
- Provide a compact “symbol dictionary” with programmer-friendly analogies.

**Keep (voice + hook)**

- “So everything has a start - a foundation… nearly all math can be broken down to four operators and a set of rules.” (`archive/snake-math/docs/basics/foundations.md:L26`).

**Keep (core teaching move)**

- The “differential equation → difference equation → iterative update” ladder is the strongest part of the page; the punchline is explicit and beginner-friendly (`archive/snake-math/docs/basics/foundations.md:L36-L88`).

**Exemplar to reuse (math → algorithm)**

Use the update rule as the key “math becomes a loop” bridge (`archive/snake-math/docs/basics/foundations.md:L62`). Then show the tiniest possible loop version:

```python
def euler_step_demo(dx: float = 1.0, steps: int = 5) -> None:
	x = 0.0
	y = 0.0
	for _ in range(steps):
		y = y + 2 * x * dx
		x = x + dx
		print(f"x={x:.0f}, y={y:.0f}")
```

- This directly corresponds to the text’s “rewrite as differences” (`archive/snake-math/docs/basics/foundations.md:L47-L55`) and “add the change” update rule (`archive/snake-math/docs/basics/foundations.md:L62`).
- The printed sequence intentionally mirrors the worked table in the page (`archive/snake-math/docs/basics/foundations.md:L68-L76`).

If you want to keep it even more conceptual, the two-line pseudocode is still useful as a callout:

```text
y_next = y_current + 2x * Δx
x_next = x_current + Δx
```

**Watch-outs**

- Tone: the “Matlab…” line reads as a drive-by; consider dropping or reframing to avoid unnecessary negativity (`archive/snake-math/docs/basics/foundations.md:L216`).

**What should be “lesson content” vs reusable “reference”**

- Keep on the Foundations page:
	- The four-operators framing + “skeptic” lead-in (`archive/snake-math/docs/basics/foundations.md:L26-L33`).
	- The differential-equation breakdown, but aggressively summarized into: “difference approximation → update rule → tiny loop” (`archive/snake-math/docs/basics/foundations.md:L36-L88`).
	- A *small* starter set of symbols that students hit immediately across Basics (e.g., `+`, `-`, `*`, `/`, `=`, `≠`, `<`, `>`, `≤`, `≥`, `Δ`, `Σ`).

- Extract into reusable reference tables/components (and link to them from Foundations):
	- The big grouped symbol tables (“Arithmetic & Basic Operators”, “Algebra & Sets”, “Calculus”, “Logic”, “Constants & Special Symbols”, “Exponentials & Logarithms”, “Greek Letters”, “ML & Data Science Symbols”) starting at the “Common Math Symbols — Grouped and Explained” section (`archive/snake-math/docs/basics/foundations.md:L90-L120` and onward).
	- The APL sidebar/story can live as an expandable “Why so many symbols?” aside (`archive/snake-math/docs/basics/foundations.md:L97-L99`).

- Optional polish:
	- Consider renaming the extracted reference to something discoverable like “Symbol Reference” and reusing it across other modules (Algebra, Calculus, Linear Algebra) so Foundations stays short.

---

## Order of Operations (PEMDAS/BODMAS)

**What it’s for**

- Teach evaluation order as a correctness tool (math and code), and explicitly connect precedence to debugging.

**Keep (voice + analogy)**

- “These rules prevent mathematical chaos…” (`archive/snake-math/docs/basics/order-of-operations.md:L25`).
- The “getting dressed” routine is memorable and non-mathy (`archive/snake-math/docs/basics/order-of-operations.md:L37`).

**Exemplar to reuse (minimal, high-signal)**

```python
result1 = 2 + 3 * 4      # 14
result2 = (2 + 3) * 4    # 20
result3 = 2 + 3 * 4**2 - 1
```

- This cluster demonstrates precedence + parentheses + exponent binding in three lines (`archive/snake-math/docs/basics/order-of-operations.md:L42-L52`).

**Keep (programmer framing)**

- “A misplaced operator or missing parentheses can turn your elegant algorithm into a bug-hunting nightmare!” (`archive/snake-math/docs/basics/order-of-operations.md:L56`).

**Interactive hook**

- `<OperatorPrecedenceExplorer />` is the right widget for this page (`archive/snake-math/docs/basics/order-of-operations.md:L62`).

**Secondary exemplar (readability by parentheses)**

- `calculate_compound_formula(...)` shows the “make intent explicit” habit (`archive/snake-math/docs/basics/order-of-operations.md:L78-L84`).

---

## Variables and Expressions

**What it’s for**

- Translate algebra notation into “state + computation” and make it feel like everyday code.

**Keep (voice + metaphor)**

- “Variables and expressions are like the nouns and sentences of mathematics…” (`archive/snake-math/docs/basics/variables-expressions.md:L25`).
- “Think of variables as labeled boxes… and expressions as recipes…” (`archive/snake-math/docs/basics/variables-expressions.md:L29`).

**Exemplar to reuse (print the meaning)**

```python
x = 5
y = 2 * x + 1
print(f"When x = {x}, y = {y}")
```

- This pattern matches SnakeMath’s “concept → code → output” teaching style (`archive/snake-math/docs/basics/variables-expressions.md:L42-L55`).

**Interactive hook**

- `<VariableExpressionExplorer />` belongs here (`archive/snake-math/docs/basics/variables-expressions.md:L64`).

**Secondary exemplar (parameterize the expression)**

- `linear_expression(x, m=2, b=1)` is a good bridge from “expression” to “reusable API” (`archive/snake-math/docs/basics/variables-expressions.md:L103-L115`).

---

## Functions

**What it’s for**

- Define “function = rule mapping inputs to outputs” with a programmer’s mental model, then introduce composition and inverses as tools.

**Keep (voice + analogy)**

- “Think of it like a vending machine…” (`archive/snake-math/docs/basics/functions.md:L33`).

**Exemplar to reuse (tiny function + printed evaluation)**

```python
def f(x):
	return 2 * x + 1

print(f"f(5) = {f(5)}")
```

- This is the “functions aren’t scary” on-ramp (`archive/snake-math/docs/basics/functions.md:L48-L54`).

**Keep (programmer relevance)**

- “Every algorithm or program uses functions…” (`archive/snake-math/docs/basics/functions.md:L65`).

**Interactive hook**

- `<FunctionPlotter />` is a natural anchor for domain/range intuition (`archive/snake-math/docs/basics/functions.md:L69`).

**Secondary exemplar (inverse as ‘undo’)**

- `find_linear_inverse(m, b)` is a clean “derive formula → implement” moment (`archive/snake-math/docs/basics/functions.md:L120-L128`).

---

## Number Types and Data Types (ℕ, ℤ, ℝ)

**What it’s for**

- Connect mathematical sets and programming number types, and explain why type choice affects correctness.

**Keep (voice + analogy)**

- “Just like a chef needs to know the difference between salt and sugar…” (`archive/snake-math/docs/basics/number-theory.md:L25`).

**Keep (why it matters)**

- “Using the wrong type can lead to bugs that are harder to find than a typo…” (`archive/snake-math/docs/basics/number-theory.md:L58`).

**Exemplar to reuse (concrete category examples)**

```python
students_in_class = 25
temperature = -5
height = 5.75
```

- The “three buckets” snippet is instantly legible (`archive/snake-math/docs/basics/number-theory.md:L42-L55`).

**Interactive hook**

- `<NumberTypeExplorer />` fits perfectly here (`archive/snake-math/docs/basics/number-theory.md:L64`).

**Secondary exemplar (guardrails)**

- `safe_division(a, b)` demonstrates defensive numeric programming (types + near-zero) (`archive/snake-math/docs/basics/number-theory.md:L97-L106`).

---

## Suggested ordering (Basics module)

- Order of Operations → Variables/Expressions → Functions → Number Types.
- Foundations can be either first (for confidence + symbols) or last (as “reference”); if first, keep it short and link out aggressively.

