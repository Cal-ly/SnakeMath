<!-- ---
title: "Foundations" 
description: "Foundations - the bacause everything must have a start" 
tags: ["mathematics", "programming"] 
difficulty: "beginner" 
category: "concept" 
symbol: "" 
prerequisites: [] 
related\_concepts: ["addition", "substraction", "multiplication", "division"] 
applications: ["programming"]
interactive: false 
code\_examples: true 
complexity\_analysis: false 
real\_world\_examples: true 
layout: "concept-page" 
date\_created: "2025-06-21" 
last\_updated: "2025-06-21" 
author: "" 
reviewers: [] 
version: "1.0"
--- -->

# Foundations

## The Basics
So everything has a start - a foundation. In a simple sense, nearly all math can be broken down to four operators and a set of rules. We have the four basic operators:
- Addition
- Substraction
- Multiplication
- Division

And a set of rules on how to apply these in different manners. Oh, I can feel your skepticisme, what about .. eh.. like differential equations. Well, let's look at that then.

### Differential Equations — Broken Down

Let's take a simple differential equation:

$$
\frac{dy}{dx} = 2x
$$
This says: the rate of change of $y$ with respect to $x$ is $2x$.

#### Step 1: Rewrite as a Difference

If we imagine $\frac{dy}{dx}$ as a very small change, we can write:

$$
\frac{\Delta y}{\Delta x} \approx 2x
$$

So, for a small step $\Delta x$:

$$
\Delta y \approx 2x \cdot \Delta x
$$

#### Step 2: Use Only Basic Operations

To find $y$ at the next step, just add the change:

$$
y_{\text{next}} = y_{\text{current}} + 2x \cdot \Delta x
$$

This is just addition and multiplication!

#### Step 3: Example Calculation

Suppose $y = 0$ when $x = 0$, and we use $\Delta x = 1$:

- At $x = 0$: $y = 0$
- At $x = 1$: $y = 0 + 2 \times 0 \times 1 = 0$
- At $x = 2$: $y = 0 + 2 \times 1 \times 1 = 2$
- At $x = 3$: $y = 2 + 2 \times 2 \times 1 = 6$
- At $x = 4$: $y = 6 + 2 \times 3 \times 1 = 12$

#### Step 4: General Solution

If you keep adding up all those little changes, you get the formula:

$$
y = x^2 + C
$$

But as you see, each step only used addition and multiplication!

**Summary:**  
Even differential equations, at their core, can be solved step-by-step using just addition, subtraction, multiplication, and division.

## Common Math Symbols — Grouped and Explained
The dear mathematicians, they do love their weird way of writing things. So think of math as a new programming language, but the inventor of this one, wanted to make it special. The inventor then made most of the keywords (those we know like `if` or `int`) in this the new language to be made of symbols partialy from philosophy, partially made-up and instead of english, to describe it's concepts, a dead language was used*. Now you're stuck some weird symbols, strange words and people insists, that it makes perfect, logical sense.

Here is a list of most of the symbols you'll encounter, their name, functions and what the analog to a programming language could be. 

*On a sidenote, this is basically the story of the programming language APL, and you had to buy the special keyboard to be able to write programs in it [APL on wiki](https://en.wikipedia.org/wiki/APL_(programming_language)).

### Arithmetic & Basic Operators

| Symbol      | Name                         | Meaning                            | Programming Analogy           |
|-------------|------------------------------|------------------------------------|------------------------------|
| +           | Plus                         | Addition                            | `+`                          |
| -           | Minus                        | Subtraction                         | `-`                          |
| ×, ·, *     | Multiplication               | Multiply                          | `*`                          |
| ÷, /        | Division                     | Divide                              | `/`                          |
| =           | Equals                       | Equality                             | `==` (compare), `=` (assign) |
| ≠           | Not equal                    | Not equal                            | `!=`                         |
| <, >        | Less than / Greater than     | Compare values                       | `<`, `>`                     |
| ≤, ≥        | Less than or equal / Greater than or equal | Compare with equality           | `<=`, `>=`                   |

### Algebra & Sets

| Symbol      | Name                         | Meaning                            | Programming Analogy           |
|-------------|------------------------------|------------------------------------|------------------------------|
| ∈           | Element of                   | "is in" set                         | `in`                         |
| ∉           | Not element of               | "not in" set                        | `not in`                     |
| ⊂, ⊆        | Subset / Subset or equal     | Subset                          |                              |
| ∪           | Union                        | Combine sets                        | `set.union()`                 |
| ∩           | Intersection                 | Common elements between sets        | `set.intersection()`          |
| ∅, ∅        | Empty set                    | No elements                      | `set()`                       |


### Calculus

| Symbol      | Name                         | Meaning                            | Programming Analogy           |
|-------------|------------------------------|------------------------------------|------------------------------|
| Σ           | Summation                    | Sum over a range                    | `sum()` / for loop            |
| ∏           | Product                      | Product over a range                | `math.prod()`                 |
| ∫           | Integral                     | Continuous sum / area under curve   | accumulate with small steps   |
| ∂           | Partial derivative           | Derivative with respect to one variable | function sensitivity         |
| ∇           | Gradient                     | Vector of derivatives               | `gradient()` in ML            |
| Δ           | Change / difference          | Δx = x₂ - x₁                        | diff(x)                       |

### Logic

| Symbol      | Name                         | Meaning                            | Programming Analogy           |
|-------------|------------------------------|------------------------------------|------------------------------|
| ∧           | And (logical)                | both true                           | `and`                        |
| ∨           | Or (logical)                 | either true                         | `or`                         |
| ¬, ¬        | Not (logical)                | invert truth                        | `not`                        |
| ⇒           | Implies                      | if A then B                         | `if A: B`                     |
| ⇔           | If and only if               | logical equivalence                 | A iff B                      |


### Constants & Special Symbols

| Symbol      | Name                         | Meaning                            | Programming Analogy           |
|-------------|------------------------------|------------------------------------|------------------------------|
| π           | Pi                           | Circle constant ≈ 3.14159           | `math.pi`                     |
| e           | Euler's number               | ≈ 2.71828, base of natural log      | `math.e`                      |
| i           | Imaginary unit               | √(-1)                               | complex numbers               |
| ∞           | Infinity                     | unbounded value                     | `float('inf')`                |
| ≈           | Approximately equal          | nearly equal                        | `~=` or `math.isclose()`      |

### Exponentials & Logarithms

| Symbol      | Name                         | Meaning                            | Programming Analogy           |
|-------------|------------------------------|------------------------------------|------------------------------|
| log, ln     | Logarithm / Natural logarithm | Solve for exponent               | `math.log()`                  |
| exp         | Exponential function         | eˣ, continuous growth              | `math.exp()`                  |
| aᵇ          | Exponentiation               | Raise to power                      | `**`                         |

### Greek Letters — Commonly used

| Name    | Lower | Upper | Common use lower                        | Commen use upper                    |
| ------- | ----- | ----- | --------------------------------------- | ----------------------------------- |
| alpha   | α     | Α     | angle, learning rate (ML)               |                                     |
| beta    | β     | Β     | regression coefficient                  |                                     |
| gamma   | γ     | Γ     | gamma function, discount in RL          | gamma function, Euler–Mascheroni    |
| delta   | δ     | Δ     | change, difference                      | discriminant, Laplace operator      |
| epsilon | ε     | Ε     | small positive number (tolerance)       |                                     |
| zeta    | ζ     | Ζ     | Riemann zeta function                   |                                     |
| eta     | η     | Η     | efficiency, learning rate               |                                     |
| theta   | θ     | Θ     | angle, model parameter                  | asymptotic tight bound (Θ-notation) |
| iota    | ι     | Ι     | unit vector, index                      |                                     |
| kappa   | κ     | Κ     | curvature, connectivity                 |                                     |
| lambda  | λ     | Λ     | eigenvalues, decay rate, regularization | cosmological constant, wavelength   |
| mu      | μ     | Μ     | mean of distribution                    |                                     |
| nu      | ν     | Ν     | frequency                               |                                     |
| xi      | ξ     | Ξ     | random variable                         | random variable, partition function |
| omicron | ο     | Ο     | rarely used                             | Big O notation (complexity)         |
| pi      | π     | Π     | circle constant, product operator       | product operator (∏)                |
| rho     | ρ     | Ρ     | correlation coefficient, density        |                                     |
| sigma   | σ     | Σ     | standard deviation, sum                 | sum operator (Σ)                    |
| tau     | τ     | Τ     | time constant, Kendall's tau            |                                     |
| upsilon | υ     | Υ     | rarely used                             |                                     |
| phi     | φ (ϕ) | Φ     | golden ratio, angle                     | work function, magnetic flux        |
| chi     | χ     | Χ     | characteristic function, chi-square     | chi-square distribution             |
| psi     | ψ     | Ψ     | wave function (quantum mechanics)       | wave function (quantum mechanics)   |
| omega   | ω     | Ω     | angular frequency                       | complexity lower bound (Ω-notation) |


### ML & Data Science Symbols

| Symbol       | Name                                 | Common Use in ML / DS                          |
|--------------|--------------------------------------|------------------------------------------------|
| θ            | theta                                | model parameters (linear, logistic regression) |
| w, b         | weights, bias                        | neural networks, linear models                 |
| ∇J(θ)        | gradient of loss wrt parameters      | gradient descent update                        |
| L, ℒ         | loss, likelihood                     | model objective                                |
| y, ŷ         | actual output, predicted output      | supervised learning                            |
| p(x), p(x\|y) | probability, conditional probability | probabilistic models                           |
| μ, σ²        | mean and variance                    | Gaussian models, distributions                 |
| 𝔼[X]        | expectation of X                     | expected value                                 |
| KL(P\||Q)    | Kullback-Leibler divergence          | measure difference between distributions       |
| 𝒩(μ, σ²)    | normal distribution                  | Gaussian probability density                   |
| R²           | coefficient of determination         | regression goodness of fit                     |



With that in mind, most math problems don't seem so scary.




## Why not just use Matlab?
Matlab is an illigitimate programming language and it knows!