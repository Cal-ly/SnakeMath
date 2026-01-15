<!-- ---
title: "Functions" 
description: "How functions map inputs to outputs and why they are essential in programming and math" 
tags: ["mathematics", "programming", "algorithms", "data-science"] 
difficulty: "beginner" 
category: "concept" 
symbol: "f(x) = y" 
prerequisites: [] 
related\_concepts: ["quadratic functions", "inverse functions", "function composition"] 
applications: ["programming", "data-analysis", "algorithms"] 
interactive: true 
code\_examples: true 
complexity\_analysis: true 
real\_world\_examples: true 
layout: "concept-page" 
date\_created: "2025-06-21" 
last\_updated: "2025-06-21" 
author: "" 
reviewers: [] 
version: "1.0"
--- -->

# Functions $f(x) = y$

What is the concept overall?

A **function** is a rule that assigns each input exactly one output. Mathematically:

$$
f(x) = y
$$

Think of it like a vending machine: put in an input (\$x\$), get a predictable output (\$y\$). The machine always responds the same way for the same input.

## Understanding Functions

A function describes how one quantity depends on another. It defines a relationship between variables.

$$
f(x) = \text{rule applied to } x
$$

Example of a simple linear function:

<CodeFold>

```python
# Simple function: f(x) = 2x + 1
def f(x):
    return 2 * x + 1

print(f"f(5) = {f(5)}")
```

</CodeFold>

## Why Functions Matter for Programmers

Functions are foundational in both math and code. They:

- Model behaviors and relationships
- Break problems into reusable parts
- Help visualize complex systems

Every algorithm or program uses functions—understanding them helps you write clear, efficient code.

## Interactive Exploration

<FunctionPlotter />

The user can learn how changing parameters affects the function's shape and behavior, observe domain/range visually, and experiment with composition and inverse.

## Function Techniques and Efficiency

### Method 1: Define a Simple Function

**Pros**: Easy to write and reuse\
**Complexity**: O(1)

<CodeFold>

```python
def linear(x, m=1, b=0):
    return m * x + b

print(linear(3, 2, 5))
```

</CodeFold>

### Method 2: Function Composition

**Pros**: Combine behaviors for complex outputs\
**Complexity**: O(1)

<CodeFold>

```python
def f(x):
    return 2 * x + 1

def g(x):
    return x**2

# Compose
print(f(g(3)))  # f(g(x))
print(g(f(3)))  # g(f(x))
```

</CodeFold>

### Method 3: Inverse Functions

**Pros**: Solve for input when given an output\
**Complexity**: O(1)

<CodeFold>

```python
def find_linear_inverse(m, b):
    if m == 0:
        return None
    return lambda y: (y - b) / m

inverse = find_linear_inverse(2, 3)
print(inverse(13))
```

</CodeFold>

## Why the Inverse Function Works

An inverse function "undoes" the original. For:

$$
f(x) = mx + b
$$

The inverse solves for \$x\$:

$$
x = \frac{y - b}{m}
$$

<CodeFold>

```python
def verify_inverse(f, f_inv, x):
    y = f(x)
    x_back = f_inv(y)
    print(f"x = {x}, y = {y}, inverse gives x_back = {x_back}")

verify_inverse(lambda x: 2 * x + 3, lambda y: (y - 3) / 2, 5)
```

</CodeFold>

## Common Function Patterns

- **Linear**: \(f(x) = mx + b\)
- **Quadratic**: \(f(x) = ax^2 + bx + c\)
- **Exponential**: \(f(x) = a \cdot b^x\)
- **Inverse Linear**: \(f^{-1}(y) = \frac{y - b}{m}\)

Python implementations demonstrating these patterns:

<CodeFold>

```python
def linear(x, m, b): return m*x + b
def quadratic(x, a, b, c): return a*x**2 + b*x + c
def exponential(x, a, b): return a * (b ** x)
```

</CodeFold>

## Practical Real-world Applications

### Application 1: Physics - Motion Functions

<CodeFold>

```python
def position(t, s0=0, v0=0, a=0):
    return s0 + v0*t + 0.5*a*t**2

def velocity(t, v0=0, a=0):
    return v0 + a*t
```

</CodeFold>

### Application 2: Economics - Cost Functions

<CodeFold>

```python
def total_cost(q, fixed=1000, variable=5):
    return fixed + variable * q

def break_even(fixed, variable, price):
    return fixed / (price - variable)
```

</CodeFold>

## Try it Yourself

- **Explore functions**: Define your own and visualize them.
- **Compose functions**: Create multi-step operations.
- **Inverse functions**: Implement inverses and test.

## Key Takeaways

- Functions map **inputs to outputs**.
- Python functions match math functions closely.
- **Composition** and **inverse** expand possibilities.
- Real-world modeling uses functions everywhere.

## Next Steps & Further Exploration

- Investigate **quadratics** and higher polynomials.
- Explore **exponentials** and **logarithms**.
- Study **domain/range** transformations.
- Apply functions in **interactive apps and simulations**.

