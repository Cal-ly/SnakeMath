---
title: "Quadratic Functions - Fundamentals"
description: "Core concepts and anatomy of quadratic functions including vertex, axis of symmetry, and discriminant"
tags: ["quadratics", "parabola", "vertex", "discriminant", "algebra"]
difficulty: "intermediate"
category: "concept-page"
prerequisites: ["linear-functions", "basic-algebra"]
related_concepts: ["functions", "graphing", "coordinate-geometry"]
layout: "concept-page"
---

# Quadratic Functions Fundamentals

A **quadratic function** is a mathematical expression that creates the iconic U-shaped (or upside-down U) curve called a parabola:

$$f(x) = ax^2 + bx + c \quad \text{where} \quad a \neq 0$$

Think of it like a mathematical recipe for curves: the **a** controls how "wide" or "narrow" the parabola is, **b** shifts it left or right, and **c** moves it up or down.

## Anatomy of a Parabola

The graph is a **parabola** — a symmetric curve that opens upward if **a > 0** (like a smile) or downward if **a < 0** (like a frown).

### Key Features

- **Vertex**: The tip of the parabola at x = -b/(2a) — the highest or lowest point
- **Axis of symmetry**: The vertical line x = -b/(2a) that splits the parabola in half
- **Y-intercept**: The point where the parabola crosses the y-axis at (0, c)
- **X-intercepts (roots)**: Points where the parabola crosses the x-axis
- **Discriminant**: Δ = b² - 4ac — tells us how many real solutions exist

### Interactive Analysis Tool

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
    print(f"Y-intercept: (0, {c})")
    print(f"Discriminant: {discriminant}")
    
    if discriminant > 0:
        root1 = (-b + math.sqrt(discriminant)) / (2*a)
        root2 = (-b - math.sqrt(discriminant)) / (2*a)
        print(f"Two real roots: x = {root1:.2f}, x = {root2:.2f}")
        print(f"X-intercepts: ({root1:.2f}, 0), ({root2:.2f}, 0)")
    elif discriminant == 0:
        root = -b / (2*a)
        print(f"One real root (double): x = {root:.2f}")
        print(f"X-intercept: ({root:.2f}, 0)")
    else:
        real_part = -b / (2*a)
        imaginary_part = math.sqrt(abs(discriminant)) / (2*a)
        print(f"Complex roots: {real_part:.2f} ± {imaginary_part:.2f}i")
        print("No real x-intercepts (parabola doesn't cross x-axis)")
    
    return vertex_x, vertex_y, discriminant

# Example: Analyze the quadratic x² - 5x + 6
print("Example 1: Classic quadratic")
vertex_x, vertex_y, disc = quadratic_anatomy(1, -5, 6)

print("\\nExample 2: Upward-opening parabola")
quadratic_anatomy(2, -4, 1)

print("\\nExample 3: Downward-opening parabola")
quadratic_anatomy(-1, 2, 3)
```

</CodeFold>

## Standard Form vs Vertex Form

### Standard Form
$$f(x) = ax^2 + bx + c$$

**Advantages:**
- Easy to identify coefficients
- Simple to evaluate for given x values
- Direct access to y-intercept (c)

### Vertex Form
$$f(x) = a(x - h)^2 + k$$

**Advantages:**
- Vertex coordinates (h, k) are immediately visible
- Transformations are obvious
- Ideal for optimization problems

### Converting Between Forms

<CodeFold>

```python
def convert_forms(a, b, c):
    """Convert between standard and vertex forms"""
    
    print(f"Standard form: f(x) = {a}x² + {b}x + {c}")
    
    # Convert to vertex form
    h = -b / (2*a)  # x-coordinate of vertex
    k = c - (b**2) / (4*a)  # y-coordinate of vertex
    
    print(f"Vertex form: f(x) = {a}(x - {h})² + {k}")
    print(f"Vertex: ({h}, {k})")
    
    # Convert back to verify
    expanded_a = a
    expanded_b = -2*a*h
    expanded_c = a*h**2 + k
    
    print(f"\\nVerification (expanding vertex form):")
    print(f"{a}(x - {h})² + {k}")
    print(f"= {a}(x² - {2*h}x + {h**2}) + {k}")
    print(f"= {expanded_a}x² + {expanded_b}x + {expanded_c}")
    
    # Check accuracy
    tolerance = 1e-10
    b_match = abs(expanded_b - b) < tolerance
    c_match = abs(expanded_c - c) < tolerance
    
    print(f"Coefficients match: a={expanded_a==a}, b={b_match}, c={c_match}")
    
    return h, k

# Examples
print("Converting x² - 6x + 8:")
convert_forms(1, -6, 8)

print("\\nConverting 2x² + 4x - 1:")
convert_forms(2, 4, -1)
```

</CodeFold>

## The Discriminant: Your Crystal Ball

The discriminant Δ = b² - 4ac reveals everything about the roots before you solve:

| Discriminant Value | Number of Real Roots | Graph Behavior |
|-------------------|---------------------|----------------|
| **Δ > 0** | Two distinct real roots | Crosses x-axis twice |
| **Δ = 0** | One repeated real root | Touches x-axis once (vertex on x-axis) |
| **Δ < 0** | No real roots (complex) | Never touches x-axis |

<CodeFold>

```python
def discriminant_analysis(a, b, c):
    """Analyze discriminant and predict root behavior"""
    
    discriminant = b**2 - 4*a*c
    
    print(f"For f(x) = {a}x² + {b}x + {c}:")
    print(f"Discriminant = {b}² - 4({a})({c}) = {discriminant}")
    
    if discriminant > 0:
        print("✓ Two distinct real roots")
        print("✓ Parabola crosses x-axis at two points")
        sqrt_disc = math.sqrt(discriminant)
        if sqrt_disc == int(sqrt_disc):
            print("✓ Roots are rational (nice numbers)")
        else:
            print("⚠ Roots are irrational")
            
    elif discriminant == 0:
        print("✓ One repeated real root (double root)")
        print("✓ Parabola touches x-axis at exactly one point")
        print("✓ Vertex lies on the x-axis")
        
    else:
        print("⚠ No real roots (complex conjugate pair)")
        print("⚠ Parabola never touches x-axis")
        if a > 0:
            print("✓ Parabola opens upward, entirely above x-axis")
        else:
            print("✓ Parabola opens downward, entirely below x-axis")
    
    return discriminant

# Test different discriminant cases
print("Case 1: Two real roots")
discriminant_analysis(1, -5, 6)  # Δ = 25 - 24 = 1

print("\\nCase 2: One repeated root")
discriminant_analysis(1, -4, 4)  # Δ = 16 - 16 = 0

print("\\nCase 3: Complex roots")
discriminant_analysis(1, 2, 5)   # Δ = 4 - 20 = -16
```

</CodeFold>

## Transformations and Graph Behavior

Understanding how coefficients affect the parabola's shape and position:

### Effect of Coefficient 'a'
- **|a| > 1**: Parabola is "narrow" (steep)
- **0 < |a| < 1**: Parabola is "wide" (gentle)
- **a > 0**: Opens upward (minimum at vertex)
- **a < 0**: Opens downward (maximum at vertex)

### Effect of Coefficient 'b'
- Controls horizontal shift of vertex
- **b = 0**: Vertex lies on y-axis
- **b ≠ 0**: Vertex shifts left or right

### Effect of Coefficient 'c'
- **c**: Direct vertical shift
- **c > 0**: Parabola shifted up
- **c < 0**: Parabola shifted down
- **c = 0**: Parabola passes through origin

<CodeFold>

```python
def transformation_demo():
    """Demonstrate how coefficients affect parabola shape"""
    
    # Create x values for plotting
    x = np.linspace(-5, 5, 100)
    
    plt.figure(figsize=(15, 10))
    
    # Effect of 'a' coefficient
    plt.subplot(2, 3, 1)
    for a_val in [0.5, 1, 2]:
        y = a_val * x**2
        plt.plot(x, y, label=f'a = {a_val}')
    plt.title('Effect of coefficient a\\n(width and direction)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.axhline(y=0, color='k', linewidth=0.5)
    plt.axvline(x=0, color='k', linewidth=0.5)
    
    # Effect of 'a' sign
    plt.subplot(2, 3, 2)
    for a_val in [-1, 1]:
        y = a_val * x**2
        plt.plot(x, y, label=f'a = {a_val}')
    plt.title('Effect of a sign\\n(opening direction)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.axhline(y=0, color='k', linewidth=0.5)
    plt.axvline(x=0, color='k', linewidth=0.5)
    
    # Effect of 'b' coefficient
    plt.subplot(2, 3, 3)
    for b_val in [-2, 0, 2]:
        y = x**2 + b_val * x
        plt.plot(x, y, label=f'b = {b_val}')
    plt.title('Effect of coefficient b\\n(horizontal shift)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.axhline(y=0, color='k', linewidth=0.5)
    plt.axvline(x=0, color='k', linewidth=0.5)
    
    # Effect of 'c' coefficient
    plt.subplot(2, 3, 4)
    for c_val in [-2, 0, 2]:
        y = x**2 + c_val
        plt.plot(x, y, label=f'c = {c_val}')
    plt.title('Effect of coefficient c\\n(vertical shift)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.axhline(y=0, color='k', linewidth=0.5)
    plt.axvline(x=0, color='k', linewidth=0.5)
    
    # Combined transformations
    plt.subplot(2, 3, 5)
    base_y = x**2
    transformed_y = 0.5 * (x - 1)**2 + 2
    plt.plot(x, base_y, 'b-', label='f(x) = x²', linewidth=2)
    plt.plot(x, transformed_y, 'r-', label='g(x) = 0.5(x-1)² + 2', linewidth=2)
    plt.title('Combined Transformations')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.axhline(y=0, color='k', linewidth=0.5)
    plt.axvline(x=0, color='k', linewidth=0.5)
    
    # Discriminant visualization
    plt.subplot(2, 3, 6)
    
    # Three different discriminants
    x_zoom = np.linspace(-3, 5, 100)
    
    # Δ > 0: Two real roots
    y1 = x_zoom**2 - 4*x_zoom + 3  # Δ = 16 - 12 = 4
    
    # Δ = 0: One root
    y2 = (x_zoom - 2)**2  # Δ = 0
    
    # Δ < 0: No real roots
    y3 = x_zoom**2 - 2*x_zoom + 2  # Δ = 4 - 8 = -4
    
    plt.plot(x_zoom, y1, 'g-', label='Δ > 0 (two roots)', linewidth=2)
    plt.plot(x_zoom, y2, 'orange', label='Δ = 0 (one root)', linewidth=2)
    plt.plot(x_zoom, y3, 'r-', label='Δ < 0 (no real roots)', linewidth=2)
    
    plt.axhline(y=0, color='k', linewidth=1)
    plt.title('Discriminant and Root Behavior')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.ylim(-1, 8)
    
    plt.tight_layout()
    plt.show()

transformation_demo()
```

</CodeFold>

## Interactive Learning

<QuadraticExplorer />

Use this interactive tool to explore how changing coefficients a, b, and c affects the graph, vertex, and roots of the quadratic function.

## Common Patterns and Special Cases

### Perfect Square Trinomials
- **Pattern**: $(x ± a)^2 = x^2 ± 2ax + a^2$
- **Example**: $x^2 + 6x + 9 = (x + 3)^2$

### Difference of Squares
- **Pattern**: $x^2 - a^2 = (x - a)(x + a)$
- **Example**: $x^2 - 16 = (x - 4)(x + 4)$

### Pure Quadratics
- **Pattern**: $ax^2 + c = 0$ (no linear term)
- **Solution**: $x = ±\sqrt{-c/a}$

<CodeFold>

```python
def identify_special_patterns(a, b, c):
    """Identify special quadratic patterns"""
    
    print(f"Analyzing f(x) = {a}x² + {b}x + {c}")
    
    # Perfect square trinomial
    if b != 0:
        expected_c = (b / (2 * math.sqrt(a)))**2 if a > 0 else None
        if expected_c and abs(c - expected_c) < 1e-10:
            sign = '+' if b > 0 else '-'
            sqrt_a = math.sqrt(abs(a))
            linear_coeff = abs(b) / (2 * sqrt_a)
            print(f"✓ Perfect square trinomial: ({sqrt_a}x {sign} {linear_coeff})²")
    
    # Difference of squares (b = 0, c < 0)
    if b == 0 and c < 0:
        sqrt_a = math.sqrt(abs(a))
        sqrt_c = math.sqrt(abs(c))
        print(f"✓ Difference of squares: ({sqrt_a}x - {sqrt_c})({sqrt_a}x + {sqrt_c})")
    
    # Pure quadratic (b = 0)
    if b == 0:
        print("✓ Pure quadratic (no linear term)")
        if c == 0:
            print("✓ Passes through origin")
    
    # Monic quadratic (a = 1)
    if a == 1:
        print("✓ Monic quadratic (leading coefficient is 1)")
    
    # Sum of squares (b = 0, same signs for a and c)
    if b == 0 and (a > 0 and c > 0):
        print("✓ Sum of squares (always positive)")
        sqrt_a = math.sqrt(a)
        sqrt_c = math.sqrt(c)
        print(f"  Minimum value: {c} at x = 0")

# Test pattern recognition
print("Testing x² + 6x + 9:")
identify_special_patterns(1, 6, 9)

print("\\nTesting x² - 16:")
identify_special_patterns(1, 0, -16)

print("\\nTesting 2x² + 8:")
identify_special_patterns(2, 0, 8)
```

</CodeFold>

## Navigation

- **Next**: [Solving Methods →](./solving.md)
- **Back**: [← Overview](./index.md)
- **Related**: [Linear Equations Basics](../linear-equations/basics.md)

---

*Ready to learn how to solve these beautiful curves? Continue with [solving methods](./solving.md) to master the techniques.*
