---
title: "Quadratic Functions - Solving Methods"
description: "Three essential techniques for solving quadratic equations: quadratic formula, completing the square, and factoring"
tags: ["quadratics", "solving", "quadratic-formula", "factoring", "completing-square"]
difficulty: "intermediate"
category: "concept-page"
prerequisites: ["quadratics-basics", "algebra"]
related_concepts: ["roots", "discriminant", "vertex-form"]
layout: "concept-page"
---

# Solving Quadratic Equations

Understanding different approaches to solving quadratic functions helps you choose the most efficient method for different scenarios and provides deeper insight into the mathematical structure.

## Method Comparison Overview

| Method | Best For | Complexity | Advantages |
|--------|----------|------------|------------|
| **Quadratic Formula** | Any quadratic | O(1) | Always works, handles complex roots |
| **Completing the Square** | Optimization problems | O(1) | Reveals vertex form, geometric insight |
| **Factoring** | Simple integer coefficients | O(1) | Fast when applicable, shows roots directly |

## Method 1: The Quadratic Formula

The universal solver that works for any quadratic equation:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

**When to use:** Any quadratic equation, especially when other methods fail.

<CodeFold>

```python
import math
import cmath

def quadratic_formula_comprehensive(a, b, c):
    """Solve quadratic equation using the quadratic formula"""
    
    print(f"Solving {a}x² + {b}x + {c} = 0")
    print("Using quadratic formula: x = [-b ± √(b² - 4ac)] / (2a)")
    
    discriminant = b**2 - 4*a*c
    print(f"Discriminant: {discriminant}")
    
    if discriminant > 0:
        # Two distinct real roots
        sqrt_disc = math.sqrt(discriminant)
        root1 = (-b + sqrt_disc) / (2*a)
        root2 = (-b - sqrt_disc) / (2*a)
        
        print(f"Two real roots:")
        print(f"  x₁ = {root1:.6f}")
        print(f"  x₂ = {root2:.6f}")
        
        # Verify solutions
        print(f"\\nVerification:")
        for i, x in enumerate([root1, root2], 1):
            result = a*x**2 + b*x + c
            print(f"  x{i}: {a}({x:.3f})² + {b}({x:.3f}) + {c} = {result:.10f}")
        
        return root1, root2
        
    elif discriminant == 0:
        # One repeated real root
        root = -b / (2*a)
        print(f"One repeated real root:")
        print(f"  x = {root:.6f}")
        
        # Verify solution
        result = a*root**2 + b*root + c
        print(f"Verification: {a}({root:.3f})² + {b}({root:.3f}) + {c} = {result:.10f}")
        
        return root, root
        
    else:
        # Complex conjugate roots
        sqrt_disc = cmath.sqrt(discriminant)
        root1 = (-b + sqrt_disc) / (2*a)
        root2 = (-b - sqrt_disc) / (2*a)
        
        print(f"Two complex roots:")
        print(f"  x₁ = {root1}")
        print(f"  x₂ = {root2}")
        
        return root1, root2

def quadratic_formula_examples():
    """Demonstrate quadratic formula with different cases"""
    
    print("QUADRATIC FORMULA EXAMPLES")
    print("=" * 50)
    
    print("\\nCase 1: Two distinct real roots")
    quadratic_formula_comprehensive(1, -5, 6)
    
    print("\\nCase 2: One repeated real root")
    quadratic_formula_comprehensive(1, -4, 4)
    
    print("\\nCase 3: Complex conjugate roots")
    quadratic_formula_comprehensive(1, 0, 1)
    
    print("\\nCase 4: Non-monic quadratic")
    quadratic_formula_comprehensive(2, -7, 3)

quadratic_formula_examples()
```

</CodeFold>

## Method 2: Completing the Square

Transforms any quadratic into vertex form, revealing the parabola's geometric properties:

**When to use:** Optimization problems, when you need vertex form, or for geometric insight.

<CodeFold>

```python
def complete_the_square_detailed(a, b, c):
    """Convert quadratic to vertex form by completing the square"""
    
    print(f"Converting {a}x² + {b}x + {c} to vertex form")
    print("=" * 50)
    
    print(f"Starting equation: {a}x² + {b}x + {c} = 0")
    
    # Step 1: Factor out 'a' if necessary
    if a != 1:
        print(f"\\nStep 1: Factor out {a} from first two terms")
        print(f"{a}(x² + {b/a:.3f}x) + {c} = 0")
        
        # Work with the expression inside parentheses
        b_over_a = b / a
        print(f"Focus on: x² + {b_over_a:.3f}x")
    else:
        b_over_a = b
        print(f"\\nStep 1: Already monic, working with x² + {b}x")
    
    # Step 2: Complete the square
    half_b = b_over_a / 2
    square_term = half_b**2
    
    print(f"\\nStep 2: Complete the square")
    print(f"Take half of linear coefficient: ({b_over_a:.3f})/2 = {half_b:.3f}")
    print(f"Square it: ({half_b:.3f})² = {square_term:.6f}")
    
    if a != 1:
        print(f"Add and subtract {square_term:.6f} inside parentheses:")
        print(f"{a}(x² + {b_over_a:.3f}x + {square_term:.6f} - {square_term:.6f}) + {c}")
        print(f"{a}((x + {half_b:.3f})² - {square_term:.6f}) + {c}")
    else:
        print(f"Add and subtract {square_term:.6f}:")
        print(f"x² + {b}x + {square_term:.6f} - {square_term:.6f} + {c}")
        print(f"(x + {half_b:.3f})² - {square_term:.6f} + {c}")
    
    # Step 3: Calculate vertex coordinates
    h = -b / (2*a)  # x-coordinate of vertex
    k = c - (b**2) / (4*a)  # y-coordinate of vertex
    
    print(f"\\nStep 3: Simplify to vertex form")
    if a != 1:
        print(f"{a}(x - ({h:.3f}))² + {a * (-square_term) + c:.6f}")
    
    print(f"\\nFinal vertex form: f(x) = {a}(x - {h:.3f})² + {k:.6f}")
    print(f"Vertex: ({h:.3f}, {k:.6f})")
    
    # Verification
    print(f"\\nVerification by expanding:")
    expanded_a = a
    expanded_b = -2*a*h
    expanded_c = a*h**2 + k
    
    print(f"{a}(x - {h:.3f})² + {k:.6f}")
    print(f"= {a}(x² - {2*h:.3f}x + {h**2:.6f}) + {k:.6f}")
    print(f"= {expanded_a}x² + {expanded_b:.6f}x + {expanded_c:.6f}")
    
    # Check accuracy
    tolerance = 1e-10
    matches = (abs(expanded_b - b) < tolerance and abs(expanded_c - c) < tolerance)
    print(f"Matches original: {matches}")
    
    return h, k

def completing_square_examples():
    """Examples of completing the square"""
    
    print("COMPLETING THE SQUARE EXAMPLES")
    print("=" * 40)
    
    print("\\nExample 1: Monic quadratic")
    complete_the_square_detailed(1, -6, 5)
    
    print("\\n" + "="*60)
    print("\\nExample 2: Non-monic quadratic")
    complete_the_square_detailed(2, -8, 6)
    
    print("\\n" + "="*60)
    print("\\nExample 3: Negative leading coefficient")
    complete_the_square_detailed(-1, 4, -3)

completing_square_examples()
```

</CodeFold>

## Method 3: Factoring

When quadratic equations have rational roots, factoring provides the fastest solution:

**When to use:** When discriminant is a perfect square, or coefficients suggest obvious factors.

<CodeFold>

```python
def factor_quadratic_comprehensive(a, b, c):
    """Attempt to factor quadratic into (px + q)(rx + s) form"""
    
    print(f"Attempting to factor {a}x² + {b}x + {c}")
    print("=" * 50)
    
    # Check if discriminant is a perfect square
    discriminant = b**2 - 4*a*c
    
    if discriminant < 0:
        print("❌ Cannot factor over real numbers (complex roots)")
        print("   Use quadratic formula for complex solutions")
        return None
    
    sqrt_disc = math.sqrt(discriminant)
    
    if not sqrt_disc.is_integer():
        print("⚠️  Roots are irrational - factoring produces messy expressions")
        print("   Quadratic formula recommended:")
        root1 = (-b + sqrt_disc) / (2*a)
        root2 = (-b - sqrt_disc) / (2*a)
        print(f"   f(x) = {a}(x - {root1:.6f})(x - {root2:.6f})")
        return root1, root2
    
    # Rational roots - factor nicely
    sqrt_disc = int(sqrt_disc)
    root1 = (-b + sqrt_disc) / (2*a)
    root2 = (-b - sqrt_disc) / (2*a)
    
    print(f"✅ Rational roots found!")
    print(f"   x = {root1}, x = {root2}")
    
    # Express in factored form
    if a == 1:
        print(f"\\nFactored form: (x - {root1})(x - {root2})")
    else:
        print(f"\\nFactored form: {a}(x - {root1})(x - {root2})")
    
    # Show alternative factoring methods for integer coefficients
    if all(isinstance(x, int) for x in [a, b, c]):
        print(f"\\nAlternative factoring approaches:")
        factoring_by_grouping(a, b, c)
        trial_and_error_factoring(a, b, c)
    
    return root1, root2

def factoring_by_grouping(a, b, c):
    """Demonstrate factoring by grouping (ac method)"""
    
    print(f"\\n📋 AC Method (Factoring by Grouping):")
    print(f"   1. Find factors of ac = {a}×{c} = {a*c}")
    print(f"   2. That add up to b = {b}")
    
    # Find factor pairs of ac
    ac = a * c
    factors = []
    for i in range(1, int(abs(ac)**0.5) + 1):
        if ac != 0 and ac % i == 0:
            factors.extend([(i, ac//i), (-i, -ac//i)])
    
    # Find pair that adds to b
    found_factors = None
    for f1, f2 in factors:
        if f1 + f2 == b:
            found_factors = (f1, f2)
            print(f"   3. Found factors: {f1} and {f2} (since {f1} + {f2} = {b})")
            print(f"   4. Rewrite: {a}x² + {f1}x + {f2}x + {c}")
            
            # Group terms
            print(f"   5. Group: ({a}x² + {f1}x) + ({f2}x + {c})")
            
            # Factor each group
            from math import gcd
            # This is simplified - full implementation would be more complex
            print(f"   6. Factor each group to find common binomial")
            break
    
    if not found_factors:
        print("   No integer factor pair found - try other methods")

def trial_and_error_factoring(a, b, c):
    """Demonstrate trial and error factoring for simple cases"""
    
    if a == 1:
        print(f"\\n🎯 Trial and Error (for x² + {b}x + {c}):")
        print(f"   Looking for (x + m)(x + n) where:")
        print(f"   • m × n = {c}")
        print(f"   • m + n = {b}")
        
        # Find factors of c
        factors_c = []
        for i in range(1, int(abs(c)**0.5) + 1):
            if c != 0 and c % i == 0:
                factors_c.extend([(i, c//i), (-i, -c//i)])
        
        for m, n in factors_c:
            if m + n == b:
                print(f"   Found: m = {m}, n = {n}")
                print(f"   Therefore: (x + {m})(x + {n})")
                break

def special_factoring_patterns():
    """Demonstrate special factoring patterns"""
    
    print("\\nSPECIAL FACTORING PATTERNS")
    print("=" * 40)
    
    patterns = [
        {
            'name': 'Difference of Squares',
            'pattern': 'a² - b² = (a - b)(a + b)',
            'example': (1, 0, -16),  # x² - 16
            'factored': '(x - 4)(x + 4)'
        },
        {
            'name': 'Perfect Square Trinomial',
            'pattern': 'a² ± 2ab + b² = (a ± b)²',
            'example': (1, 6, 9),  # x² + 6x + 9
            'factored': '(x + 3)²'
        },
        {
            'name': 'Sum/Difference of Cubes (extended)',
            'pattern': 'Special cases with higher patterns',
            'example': (1, 0, 8),  # x² + 8 (not factorable over reals)
            'factored': 'Complex factors only'
        }
    ]
    
    for pattern in patterns:
        print(f"\\n{pattern['name']}:")
        print(f"Pattern: {pattern['pattern']}")
        a, b, c = pattern['example']
        print(f"Example: {a}x² + {b}x + {c}")
        print(f"Factored: {pattern['factored']}")
        
        # Verify by expanding
        if pattern['name'] == 'Difference of Squares':
            print("Verification: (x - 4)(x + 4) = x² - 16 ✓")
        elif pattern['name'] == 'Perfect Square Trinomial':
            print("Verification: (x + 3)² = x² + 6x + 9 ✓")

def factoring_examples():
    """Complete factoring examples"""
    
    print("FACTORING EXAMPLES")
    print("=" * 30)
    
    examples = [
        (1, -5, 6),   # x² - 5x + 6 = (x-2)(x-3)
        (2, -7, 3),   # 2x² - 7x + 3 = (2x-1)(x-3)
        (1, 0, -16),  # x² - 16 = (x-4)(x+4)
        (1, 4, 4),    # x² + 4x + 4 = (x+2)²
        (1, 2, 5)     # x² + 2x + 5 (complex roots)
    ]
    
    for i, (a, b, c) in enumerate(examples, 1):
        print(f"\\nExample {i}:")
        factor_quadratic_comprehensive(a, b, c)
        print("-" * 50)
    
    # Show special patterns
    special_factoring_patterns()

factoring_examples()
```

</CodeFold>

## Choosing the Right Method

### Decision Tree for Method Selection

```
Is the discriminant a perfect square?
├─ Yes → Try Factoring
│   ├─ Simple integer coefficients? → Trial and Error
│   └─ Complex coefficients? → AC Method
├─ No → Check complexity
    ├─ Need vertex form? → Completing the Square
    ├─ Any quadratic? → Quadratic Formula
    └─ Complex roots expected? → Quadratic Formula
```

### Performance and Accuracy Considerations

<CodeFold>

```python
def method_comparison_demo():
    """Compare all three methods on the same equation"""
    
    # Test equation: 2x² - 7x + 3 = 0
    a, b, c = 2, -7, 3
    
    print(f"COMPARING METHODS for {a}x² + {b}x + {c} = 0")
    print("=" * 60)
    
    # Method 1: Quadratic Formula
    print("\\n1. QUADRATIC FORMULA:")
    discriminant = b**2 - 4*a*c
    sqrt_disc = math.sqrt(discriminant)
    x1_qf = (-b + sqrt_disc) / (2*a)
    x2_qf = (-b - sqrt_disc) / (2*a)
    print(f"   x₁ = {x1_qf:.6f}")
    print(f"   x₂ = {x2_qf:.6f}")
    
    # Method 2: Completing the Square
    print("\\n2. COMPLETING THE SQUARE:")
    h = -b / (2*a)
    k = c - (b**2) / (4*a)
    print(f"   Vertex form: {a}(x - {h:.3f})² + {k:.6f}")
    # Solve: a(x - h)² + k = 0
    # (x - h)² = -k/a
    if -k/a >= 0:
        sqrt_term = math.sqrt(-k/a)
        x1_cs = h + sqrt_term
        x2_cs = h - sqrt_term
        print(f"   x₁ = {x1_cs:.6f}")
        print(f"   x₂ = {x2_cs:.6f}")
    else:
        print("   Complex roots from vertex form")
    
    # Method 3: Factoring
    print("\\n3. FACTORING:")
    if discriminant >= 0 and sqrt_disc.is_integer():
        x1_f = (-b + sqrt_disc) / (2*a)
        x2_f = (-b - sqrt_disc) / (2*a)
        print(f"   Factored form: {a}(x - {x1_f})(x - {x2_f})")
        print(f"   x₁ = {x1_f:.6f}")
        print(f"   x₂ = {x2_f:.6f}")
    else:
        print("   Not easily factorable")
    
    # Verification
    print("\\n4. VERIFICATION:")
    for i, x in enumerate([x1_qf, x2_qf], 1):
        result = a*x**2 + b*x + c
        print(f"   x{i} = {x:.6f}: {a}({x:.3f})² + {b}({x:.3f}) + {c} = {result:.2e}")

method_comparison_demo()
```

</CodeFold>

## Advanced Solving Techniques

### Numerical Methods for Edge Cases

<CodeFold>

```python
def robust_quadratic_solver(a, b, c, method='auto'):
    """Robust solver that handles numerical edge cases"""
    
    # Handle degenerate cases
    if abs(a) < 1e-15:
        if abs(b) < 1e-15:
            if abs(c) < 1e-15:
                return "Infinite solutions (0 = 0)"
            else:
                return "No solution (contradiction)"
        else:
            # Linear equation: bx + c = 0
            return f"Linear solution: x = {-c/b:.6f}"
    
    discriminant = b**2 - 4*a*c
    
    # Choose method based on numerical stability
    if method == 'auto':
        if abs(b) > 1e6 * max(abs(a), abs(c)):
            # Use numerically stable version for large b
            method = 'stable'
        elif discriminant >= 0 and math.sqrt(discriminant).is_integer():
            method = 'factoring'
        else:
            method = 'standard'
    
    if method == 'standard':
        # Standard quadratic formula
        if discriminant >= 0:
            sqrt_disc = math.sqrt(discriminant)
            return [(-b + sqrt_disc)/(2*a), (-b - sqrt_disc)/(2*a)]
        else:
            sqrt_disc = math.sqrt(-discriminant)
            real_part = -b/(2*a)
            imag_part = sqrt_disc/(2*a)
            return [complex(real_part, imag_part), complex(real_part, -imag_part)]
    
    elif method == 'stable':
        # Numerically stable version (avoids cancellation)
        sqrt_disc = math.sqrt(abs(discriminant))
        if b >= 0:
            q = -(b + sqrt_disc) / 2
        else:
            q = -(b - sqrt_disc) / 2
        
        x1 = q / a
        x2 = c / q if abs(q) > 1e-15 else float('inf')
        return [x1, x2]
    
    elif method == 'factoring':
        # Direct factoring when possible
        sqrt_disc = int(math.sqrt(discriminant))
        x1 = (-b + sqrt_disc) / (2*a)
        x2 = (-b - sqrt_disc) / (2*a)
        return [x1, x2]

# Test numerical stability
print("Testing numerical stability:")
print("Standard case:", robust_quadratic_solver(1, -5, 6))
print("Large b case:", robust_quadratic_solver(1, -1e8, 1))
print("Small discriminant:", robust_quadratic_solver(1, 2, 1.0000001))
```

</CodeFold>

## Navigation

- **Next**: [Theory & Patterns →](./theory.md)
- **Previous**: [← Fundamentals](./basics.md)
- **Back**: [← Overview](./index.md)

---

*Master the mathematical foundations behind these methods? Continue with [theory and patterns](./theory.md) to deepen your understanding.*
