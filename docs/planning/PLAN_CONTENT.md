
# PLAN_CONTENT.md

Future content suggestions for SnakeMath.

Minimum required fields per suggestion:
- **Topic name**
- **Scope** (what it covers / boundaries)
- **Programming framing** (how to explain it to programmers)
- **Possible widgets** (interactive components worth building)

This plan intentionally focuses on “what to build next” (content + widgets), not on writing the final lessons.

---

## Guiding principles (keep consistent with SnakeMath)

1. **Notation → code equivalence first** ("this symbol is a pattern you already code")
2. **Concrete before abstract** (numerical experiments + visualizations before proofs)
3. **One reusable widget pattern per topic** (with URL state + presets)
4. **Bridge to ML intentionally** (each topic should have at least one “why ML cares” anchor)
5. **Teach debugging instincts** (stability, edge cases, floating point, complexity)

---

## Proposed next topics (summary table)

| Topic | Scope (short) | Programming framing (short) | Widget candidates |
|---|---|---|---|
| Derivatives | slope, rate of change, rules, tangent, numerical differentiation | “diff = local linear approximation”; gradients as “sensitivity” | DerivativeVisualizer (secant→tangent, error plots) |
| Integrals | area, accumulation, FTC, numerical integration | “sum of tiny pieces”; Riemann sums as loops | IntegralExplorer (Riemann sums, trapezoid/Simpson) |
| Series & Taylor | sequences/series, convergence, Taylor polynomials, error | “approximations as progressive refinement”; “fast function eval” | TaylorApproximator (partial sums + error bounds) |
| Optimization | minima/maxima, convexity intuition, constraints (intro) | “minimize loss”; gradient descent as an update loop | GradientDescentPlayground (2D loss surface) |
| Multivariable calc | partial derivatives, gradients, directional derivatives | “Jacobian as function of functions”; gradients as vectors | GradientFieldVisualizer (contours + arrows) |
| Differential equations | ODE basics, Euler/RK intuition, stability | “state update rules”; simulation stepper | ODESimulator (phase plots, step size slider) |
| Linear algebra (advanced) | eigenvalues/vectors, PCA/SVD intuition, conditioning | “change of basis”; “compression + signal” | EigenExplorer, SVDExplorer |
| Probability (Bayes + inference) | Bayes rule, priors/posteriors, likelihood, conjugacy (light) | “update beliefs with evidence”; log-likelihood sums | BayesUpdater (sliders + live posterior) |
| Statistical inference | confidence intervals, hypothesis tests, p-values, power | “decision thresholds”; “false positives in monitoring” | HypothesisTestLab, CIVisualizer |
| Discrete math (combinatorics) | counting, permutations/combinations, recurrence relations | “counting states”; “DP recurrences” | CombinatoricsExplorer, RecurrenceVisualizer |
| Graph theory (core) | graphs, BFS/DFS, shortest paths, centrality intuition | “graphs are data structures”; complexity + visualization | GraphExplorer (BFS/DFS/Dijkstra animations) |
| Numerical methods | root finding, optimization numerics, stability, error | “iterative refinement”; tolerance-driven loops | RootFinderExplorer (bisection/Newton) |

---

## Topic proposals (detailed)

### 1) Derivatives

**Scope**
- Intuition: slope as “local rate of change”
- Definitions: secant slope → tangent slope (limit)
- Basic rules: power, sum, product/quotient, chain rule (conceptual + a few worked examples)
- Practical: numerical differentiation pitfalls (step size too small/large, noise amplification)
- Bridge: gradients as the core primitive for optimization/backprop (no heavy ML yet)

**Programming framing**
- “Derivative = best local linear model”: $f(x + \Delta) \approx f(x) + f'(x)\Delta$ is literally the first-order term you’d use in a prediction.
- “Sensitivity analysis”: change input a bit, see output change.
- Debug angle: show how finite differences fail when floating point precision dominates.

**Possible analogies**
- **Everyday**: Speedometer vs route — position is $f(x)$, derivative is “your current speed.”
- **Programming/System**: Profiler sensitivity — “if I tweak this input slightly, how much does output move?”
- **Visual/Intuition**: Tangent as a “good mock” — locally replace a complex curve with a line that behaves the same.

**Possible widgets**
- **DerivativeVisualizer**
	- Function presets (polynomial, trig, exp, abs/|x| kink)
	- Secant line with draggable $\Delta x$ that animates to tangent
	- Live numeric estimate vs analytic derivative
	- Error plot vs step size ($h$ sweep)
	- URL state: function preset, x0, h

**Nice-to-have content add-ons**
- “Derivative recipes” as quick reference, but keep the *intuition* primary.

---

### 2) Integrals

**Scope**
- Accumulation and signed area under curve
- Riemann sums → definite integral
- Fundamental Theorem of Calculus (conceptual: derivative and integral are inverses)
- Numerical integration: left/right/midpoint, trapezoid, Simpson (intro)

**Programming framing**
- “Integral = sum in the limit”: the most literal mapping from math notation to a loop.
- Performance angle: sampling resolution vs accuracy tradeoffs.
- Debug angle: oscillatory functions and cancellation.

**Possible analogies**
- **Everyday**: Odometer — distance is accumulated from changing speed.
- **Programming/System**: Billing meter — rate-in, total-out (integral as total cost from a rate function).
- **Visual/Intuition**: Pixel counting — finer rectangles ≈ higher render resolution.

**Possible widgets**
- **IntegralExplorer**
	- Riemann rectangles with adjustable $n$
	- Toggle methods (left/right/midpoint/trapezoid/Simpson)
	- Show convergence of estimate as $n$ increases
	- Presets: area, distance from velocity, probability density integration

---

### 3) Series & Taylor expansions

**Scope**
- Sequences vs series, partial sums
- Convergence intuition (geometric series, harmonic “why it diverges”)
- Taylor polynomials: approximate sin/exp/log near a point
- Remainder/error intuition (not too formal)

**Programming framing**
- “Approximation as progressive refinement”: compute partial sums until error < tolerance.
- “Why math libraries work”: show how functions can be computed from polynomials.
- Connect to performance: fewer terms vs accuracy.

**Possible analogies**
- **Everyday**: Progressive rendering — more terms like more samples/passes.
- **Programming/System**: Streaming partial results — partial sums are running estimates that converge.
- **Visual/Intuition**: Surrogate model — locally replace an expensive function with a cheap approximation.

**Possible widgets**
- **TaylorApproximator**
	- Choose function (sin, cos, exp, log(1+x))
	- Choose center point $a$ and degree $n$
	- Plot true vs approximation + error curve
	- “terms used” slider + auto mode (stop when below epsilon)

---

### 4) Optimization (single-variable → multi-variable)

**Scope**
- Minima/maxima, convex vs non-convex intuition
- Gradient descent as an algorithm (update rule, learning rate)
- Intro constraints (Lagrange multipliers later; keep this phase light)

**Programming framing**
- “Training = minimizing a loss function”
- Gradient descent is literally: `x -= lr * grad(x)`
- Debug angle: learning rate too big → divergence; too small → slow.

**Possible analogies**
- **Everyday**: Hill descent — the gradient is “which way is downhill.”
- **Programming/System**: Tuning knobs — adjust parameters to reduce error/latency; learning rate is aggressiveness.
- **Visual/Intuition**: Iterative patches — each step is a small change; too big breaks, too small stalls.

**Possible widgets**
- **GradientDescentPlayground**
	- 1D and 2D objectives (quadratic bowl, double-well)
	- Show steps as points marching downhill
	- Sliders: learning rate, iterations, momentum
	- Plot loss vs iteration

---

### 5) Multivariable calculus essentials

**Scope**
- Functions $f(x, y)$
- Partial derivatives and gradient vector
- Directional derivatives and interpretation
- Connect gradients to contour plots and optimization

**Programming framing**
- “Multiple inputs = multiple sensitivities”
- Jacobian as a matrix of partials (bridge to linear algebra)
- Gradients are just vectors (reusing VectorOperations patterns)

**Possible analogies**
- **Everyday**: Mixing console — each input is a slider; partial derivative is “what happens if I move only this one.”
- **Programming/System**: Sensitivity dashboard — gradient tells which input matters most right now.
- **Visual/Intuition**: “Walk this way” — directional derivative is slope along a chosen direction.

**Possible widgets**
- **GradientFieldVisualizer**
	- Contour map + gradient arrows
	- Pick a point and show local linear approximation plane
	- Direction slider: show directional derivative

---

### 6) Differential equations (ODEs)

**Scope**
- ODE as a rule for state change: $x' = f(x, t)$
- Euler method intuition; optionally RK4 as “better stepper”
- Stability (step size), and qualitative behavior (equilibria)

**Programming framing**
- “Simulation loop”: `state += dt * f(state, t)`
- Debug angle: dt too large causes numeric explosion.

**Possible analogies**
- **Everyday**: Thermostat feedback — the rule reacts to current state over time.
- **Programming/System**: Game loop / physics tick — `state += dt * f(state, t)` is literally an update loop.
- **Visual/Intuition**: Step size stability — big `dt` makes trajectories blow up like an unstable controller.

**Possible widgets**
- **ODESimulator**
	- Presets: exponential decay, logistic growth, pendulum (simple)
	- Time series plot + phase portrait for 2D systems
	- Sliders: dt, method (Euler/RK), parameters

---

### 7) Linear algebra (advanced extensions)

**Scope**
- Eigenvalues/vectors: repeated application and “special directions”
- PCA intuition (variance direction) and SVD as “universal factorization”
- Conditioning and numerical stability (light, visual)

**Programming framing**
- “Eigenvectors are fixed directions under transformation”
- PCA/SVD as “compression” and “feature extraction”
- Bridge to ML: embeddings, dimensionality reduction.

**Possible analogies**
- **Everyday**: Best camera angle — rotate to see the data’s main spread clearly (PCA).
- **Programming/System**: Universal adapter — decompose a complex transform into simple primitives (rotate/scale/rotate).
- **Visual/Intuition**: Repeated transform locks onto a direction — iterate a matrix and watch a vector align with the dominant eigenvector.

**Possible widgets**
- **EigenExplorer**: apply matrix repeatedly, show convergence to dominant eigenvector
- **SVDExplorer**: decompose 2D linear transform into rotate → scale → rotate; animate unit circle to ellipse

---

### 8) Bayes + inference (probability extension)

**Scope**
- Bayes rule as belief update
- Priors/posteriors and likelihood
- Log-likelihood (connect to Σ / logs / numerical stability)
- Keep it interactive and intuition-first; avoid deep measure theory

**Programming framing**
- “Monitoring and diagnosis”: update probability of a root cause given evidence.
- “Products become sums”: compute in log space to avoid underflow.

**Possible analogies**
- **Everyday**: Medical test / spam filter — start with a base rate (prior), update with evidence.
- **Programming/System**: Incident triage — logs/alerts update your belief about the likely root cause.
- **Visual/Intuition**: “Versioned beliefs” — priors are defaults; posteriors are the updated config after observing data.

**Possible widgets**
- **BayesUpdater**
	- Toggle scenarios: medical test, spam filter, incident triage
	- Sliders: base rate, sensitivity, specificity
	- Live posterior chart

---

### 9) Statistical inference (practical)

**Scope**
- Confidence intervals (bootstrap and/or analytic for mean)
- Hypothesis tests (z/t-test, two-proportion, chi-square as later extension)
- Power and sample size intuition

**Programming framing**
- “Decision thresholds under uncertainty”
- “False positive/negative” language maps to alerting systems
- Emphasize simulation-based checking (bootstrap) to reduce formula load.

**Possible analogies**
- **Everyday**: “Signal vs noise” — is an observed difference real or random luck?
- **Programming/System**: Monitoring alerts — tests are threshold rules; false positives vs missed incidents map cleanly.
- **Visual/Intuition**: A/B rollout uncertainty — confidence intervals are the “range of plausible wins,” not a single number.

**Possible widgets**
- **HypothesisTestLab**: pick test, generate samples, show p-value distribution
- **CIVisualizer**: repeated sampling animation to show coverage

---

### 10) Discrete math: combinatorics + recurrences

**Scope**
- Counting principles, permutations, combinations
- Binomial theorem (bridge to algebra)
- Recurrence relations + solving small ones (Fibonacci, DP)

**Programming framing**
- “Counting states” in brute force vs dynamic programming
- Recurrence = recursive function + memoization

**Possible analogies**
- **Everyday**: Grid paths — combinations are “count the routes.”
- **Programming/System**: State-space explosion — combinatorics predicts brute-force feasibility.
- **Visual/Intuition**: Recurrence as a cacheable function — memoization turns a recursion tree into a DP table.

**Possible widgets**
- **CombinatoricsExplorer**: `n choose k` with grid/paths interpretation
- **RecurrenceVisualizer**: recursion tree vs memoized DP table

---

### 11) Graph theory (programmer-first)

**Scope**
- Graph model, adjacency list/matrix
- BFS/DFS, shortest paths (Dijkstra), topological sort (optional)
- Complexity intuition + use cases

**Programming framing**
- “Graphs are everywhere”: dependency graphs, navigation, networks
- Tie into matrices via adjacency matrices + powers (walk counts)

**Possible analogies**
- **Everyday**: Routing map — shortest path is “least-cost travel.”
- **Programming/System**: Dependency DAG — build/import graphs; topological sort is “what must run first.”
- **Visual/Intuition**: Social network hops — BFS layers are friends-of-friends distance.

**Possible widgets**
- **GraphExplorer**
	- Build/edit small graph in UI
	- Animate BFS/DFS frontier
	- Dijkstra with priority queue visualization

---

### 12) Numerical methods (debuggable math)

**Scope**
- Root finding: bisection, Newton’s method
- Error/tolerance thinking, convergence rates
- Common failure modes (bad initial guess, derivative near zero)

**Programming framing**
- “Iterative refinement loops” with termination conditions
- Show instrumentation (iterations, residual, divergence detection)

**Possible analogies**
- **Everyday**: Autofocus — Newton’s method uses local slope to “snap” to the target.
- **Programming/System**: Retry with convergence criteria — iterate until residual is small or you time out.
- **Visual/Intuition**: Bisection as binary search — halve the interval until you bracket the root tightly.

**Possible widgets**
- **RootFinderExplorer**: pick function + initial bracket/guess; animate iterations; plot residual

---

## Cross-cutting content improvements (apply broadly)

- Add a small **“Code Equivalent”** panel wherever notation appears (Σ/Π already prove this works).
- Add **“Failure modes”** callouts for numerical topics (limits, derivatives, integrals, ODEs).
- Add a consistent **“Where this shows up in ML”** card at the end of each topic.
- Prefer **simulation-based intuition** where formulas would otherwise dominate.

