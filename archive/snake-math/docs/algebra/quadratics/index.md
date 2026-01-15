---
title: "Quadratic Functions"
description: "Understanding quadratic functions and their parabolic graphs, from solving equations to modeling real-world phenomena"
tags: ["mathematics", "algebra", "functions", "optimization", "physics"]
difficulty: "intermediate"
category: "concept"
symbol: "f(x) = ax² + bx + c"
prerequisites: ["linear-functions", "basic-algebra", "coordinate-geometry"]
related_concepts: ["polynomials", "optimization", "calculus", "physics-motion"]
applications: ["physics", "optimization", "computer-graphics", "data-modeling"]
interactive: true
code_examples: true
complexity_analysis: true
real_world_examples: true
layout: "concept-page"
date_created: "2024-01-01"
last_updated: "2024-01-01"
author: "Snake Math Team"
reviewers: []
version: "1.0"
---

# Quadratic Functions (f(x) = ax² + bx + c)

Think of quadratic functions as the mathematical DNA of curves! They're everywhere - from the graceful arc of a basketball shot to the optimization curves that maximize profits. A quadratic function is nature's way of describing anything that accelerates or decelerates smoothly.

## What You'll Learn

Quadratic functions create the iconic U-shaped (or upside-down U) curve called a parabola. This comprehensive guide will teach you:

- **Fundamental concepts** and anatomy of quadratic functions
- **Solving techniques** including quadratic formula, completing the square, and factoring
- **Mathematical theory** behind why these methods work
- **Real-world applications** in physics, business optimization, and computer graphics

## Learning Path

### 1. [Fundamentals](./basics.md)
Master the core concepts of quadratic functions, including vertex form, standard form, and key features like vertex, axis of symmetry, and discriminant.

### 2. [Solving Methods](./solving.md)
Learn three essential techniques for solving quadratic equations: the quadratic formula, completing the square, and factoring, with their computational implementations.

### 3. [Theory & Patterns](./theory.md)
Understand the mathematical foundations, common patterns, and why the quadratic formula works through algebraic derivation.

### 4. [Real-World Applications](./applications.md)
Apply quadratic functions to practical scenarios including projectile motion, business optimization, and computer graphics animation.

## Quick Reference

### Standard Form
$$f(x) = ax^2 + bx + c \quad \text{where} \quad a \neq 0$$

### Vertex Form
$$f(x) = a(x - h)^2 + k \quad \text{where vertex is } (h, k)$$

### Key Formulas

| Feature | Formula |
|---------|---------|
| **Vertex** | $x = -\frac{b}{2a}$, $y = f(-\frac{b}{2a})$ |
| **Axis of Symmetry** | $x = -\frac{b}{2a}$ |
| **Discriminant** | $\Delta = b^2 - 4ac$ |
| **Quadratic Formula** | $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ |

## Interactive Tools

<QuadraticExplorer />

Explore how changing coefficients a, b, and c affects the graph, vertex, and roots of the quadratic function.

## Why This Matters for Programmers

Quadratic functions are the Swiss Army knife of mathematical modeling! They appear in:

- **Physics Simulations**: Projectile motion, acceleration modeling
- **Optimization Algorithms**: Finding maximum/minimum values
- **Computer Graphics**: Smooth curves and animation paths
- **Machine Learning**: Quadratic loss functions and feature engineering
- **Algorithm Analysis**: Complexity analysis (O(n²) algorithms)

Understanding quadratics enables you to build realistic physics engines, optimize business processes, create beautiful curves in graphics, and solve complex algorithmic problems efficiently.

## Quick Start Example

<CodeFold>

```python
import math
import matplotlib.pyplot as plt
import numpy as np

def quadratic_anatomy(a, b, c):
    """Dissect a quadratic function to reveal its key features"""
    
    print(f"Analyzing f(x) = {a}x² + {b}x + {c}")
    print("=" * 40)
    
    # Vertex coordinates
    vertex_x = -b / (2 * a)
    vertex_y = a * vertex_x**2 + b * vertex_x + c
    
    # Discriminant and roots
    discriminant = b**2 - 4*a*c
    
    print(f"Vertex: ({vertex_x:.2f}, {vertex_y:.2f})")
    print(f"Axis of symmetry: x = {vertex_x:.2f}")
    print(f"Opens: {'upward' if a > 0 else 'downward'}")
    print(f"Discriminant: {discriminant}")
    
    if discriminant > 0:
        root1 = (-b + math.sqrt(discriminant)) / (2*a)
        root2 = (-b - math.sqrt(discriminant)) / (2*a)
        print(f"Two real roots: x = {root1:.2f}, x = {root2:.2f}")
    elif discriminant == 0:
        root = -b / (2*a)
        print(f"One real root (double): x = {root:.2f}")
    else:
        real_part = -b / (2*a)
        imaginary_part = math.sqrt(abs(discriminant)) / (2*a)
        print(f"Complex roots: {real_part:.2f} ± {imaginary_part:.2f}i")
    
    return vertex_x, vertex_y, discriminant

# Example: Analyze the quadratic x² - 5x + 6
vertex_x, vertex_y, disc = quadratic_anatomy(1, -5, 6)
```

</CodeFold>

## Navigation

- **Start Learning**: [Fundamentals →](./basics.md)
- **Related**: [Linear Equations](../linear-equations/index.md) | [Functions](../../basics/functions.md)
- **Prerequisites**: [Variables & Expressions](../../basics/variables-expressions.md)

---

*Ready to master the curves that shape our mathematical world? Start with the [fundamentals](./basics.md) to build your foundation.*
