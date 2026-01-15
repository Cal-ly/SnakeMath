---
title: "Continuity Analysis"
description: "Understanding continuous and discontinuous functions and their behavior"
tags: ["continuity", "discontinuity", "limits", "function-analysis"]
difficulty: "intermediate"
category: "analysis"
symbol: "lim, →"
prerequisites: ["limits/basics", "functions"]
related_concepts: ["limits", "derivatives", "function-behavior"]
applications: ["function-analysis", "mathematical-modeling", "programming"]
interactive: true
code_examples: true
layout: "concept-page"
date_created: "2025-01-23"
last_updated: "2025-01-23"
author: "Snake Math Team"
reviewers: []
version: "1.0"
---

# Continuity Analysis

Continuity is the mathematical way of saying "no surprises" - it describes functions that behave predictably without sudden jumps, breaks, or infinite behavior. Understanding continuity helps you design robust algorithms and analyze function behavior.

## Navigation

- [Understanding Continuity](#understanding-continuity)
- [Types of Discontinuities](#types-of-discontinuities)
- [Continuity Testing Algorithm](#continuity-testing-algorithm)
- [Real-World Applications](#real-world-applications)
- [Advanced Continuity Concepts](#advanced-continuity-concepts)
- [Key Takeaways](#key-takeaways)

## Understanding Continuity

A function is **continuous** at a point when three conditions are met:

1. **The function is defined at the point**: f(a) exists
2. **The limit exists**: $\lim_{x \to a} f(x)$ exists  
3. **They are equal**: $\lim_{x \to a} f(x) = f(a)$

Think of continuity as being able to draw the function without lifting your pencil from the paper.

## Types of Discontinuities

<CodeFold>

```python
import numpy as np

def continuity_analysis():
    """Analyze different types of continuity and discontinuity"""
    
    print("Continuity Analysis")
    print("=" * 25)
    
    def test_continuity(func, point, func_name, epsilon=1e-6):
        """Test if a function is continuous at a given point"""
        
        print(f"\nTesting continuity of {func_name} at x = {point}")
        print("-" * 50)
        
        try:
            # Function value at the point
            f_at_point = func(point)
            print(f"f({point}) = {f_at_point}")
        except:
            print(f"f({point}) is undefined")
            f_at_point = None
        
        # Left limit
        try:
            x_left = point - epsilon
            left_limit = func(x_left)
            print(f"Left limit ≈ {left_limit:.6f}")
        except:
            left_limit = None
            print("Left limit does not exist")
        
        # Right limit  
        try:
            x_right = point + epsilon
            right_limit = func(x_right)
            print(f"Right limit ≈ {right_limit:.6f}")
        except:
            right_limit = None
            print("Right limit does not exist")
        
        # Check continuity conditions
        if left_limit is not None and right_limit is not None:
            if abs(left_limit - right_limit) < 1e-10:
                limit_exists = True
                limit_value = left_limit
                print(f"Limit exists: {limit_value:.6f}")
            else:
                limit_exists = False
                print("Limit does not exist (left ≠ right)")
        else:
            limit_exists = False
            print("Limit does not exist")
        
        # Determine continuity
        if limit_exists and f_at_point is not None:
            if abs(limit_value - f_at_point) < 1e-10:
                print("✓ CONTINUOUS: lim f(x) = f(a)")
                return "continuous"
            else:
                print("✗ DISCONTINUOUS: lim f(x) ≠ f(a) (removable)")
                return "removable"
        elif limit_exists and f_at_point is None:
            print("✗ DISCONTINUOUS: f(a) undefined (removable)")
            return "removable"
        else:
            print("✗ DISCONTINUOUS: limit does not exist")
            return "non-removable"
    
    # Test cases demonstrating different types
    
    # 1. Continuous function
    def f1(x):
        return x**2 + 2*x + 1
    
    test_continuity(f1, 1, "f(x) = x² + 2x + 1")
    
    # 2. Removable discontinuity
    def f2(x):
        if abs(x - 2) < 1e-15:
            return 10  # Different value at x = 2
        return (x**2 - 4) / (x - 2)
    
    test_continuity(f2, 2, "f(x) = (x² - 4)/(x - 2) with f(2) = 10")
    
    # 3. Jump discontinuity
    def f3(x):
        return 1 if x >= 0 else -1
    
    test_continuity(f3, 0, "f(x) = 1 if x ≥ 0, -1 if x < 0")
    
    # 4. Infinite discontinuity
    def f4(x):
        return 1 / (x - 1)
    
    test_continuity(f4, 1, "f(x) = 1/(x - 1)")
    
    # 5. Oscillatory behavior
    def f5(x):
        if x == 0:
            return 0
        return x * np.sin(1/x)
    
    test_continuity(f5, 0, "f(x) = x·sin(1/x) with f(0) = 0")

continuity_analysis()
```

</CodeFold>

## Continuity Testing Algorithm

Here's a systematic algorithm for testing continuity that you can implement in your own programs:

<CodeFold>

```python
def comprehensive_continuity_checker():
    """Advanced continuity checking with classification"""
    
    class ContinuityAnalyzer:
        def __init__(self, tolerance=1e-10):
            self.tolerance = tolerance
        
        def analyze_continuity(self, func, point, func_name="f"):
            """Complete continuity analysis with classification"""
            
            results = {
                'function_name': func_name,
                'point': point,
                'function_value': None,
                'left_limit': None,
                'right_limit': None,
                'limit_exists': False,
                'limit_value': None,
                'is_continuous': False,
                'discontinuity_type': None,
                'can_be_made_continuous': False
            }
            
            # 1. Check if function is defined at the point
            try:
                results['function_value'] = func(point)
                function_defined = True
            except:
                function_defined = False
            
            # 2. Calculate left and right limits
            results['left_limit'] = self._calculate_one_sided_limit(func, point, 'left')
            results['right_limit'] = self._calculate_one_sided_limit(func, point, 'right')
            
            # 3. Check if limit exists
            if (results['left_limit'] is not None and 
                results['right_limit'] is not None and
                abs(results['left_limit'] - results['right_limit']) < self.tolerance):
                results['limit_exists'] = True
                results['limit_value'] = results['left_limit']
            
            # 4. Classify continuity/discontinuity
            if results['limit_exists'] and function_defined:
                if abs(results['limit_value'] - results['function_value']) < self.tolerance:
                    results['is_continuous'] = True
                else:
                    results['discontinuity_type'] = 'removable'
                    results['can_be_made_continuous'] = True
            elif results['limit_exists'] and not function_defined:
                results['discontinuity_type'] = 'removable'
                results['can_be_made_continuous'] = True
            elif not results['limit_exists']:
                if (results['left_limit'] is not None and 
                    results['right_limit'] is not None):
                    results['discontinuity_type'] = 'jump'
                elif (results['left_limit'] is None or 
                      results['right_limit'] is None):
                    results['discontinuity_type'] = 'infinite'
                else:
                    results['discontinuity_type'] = 'oscillatory'
            
            return results
        
        def _calculate_one_sided_limit(self, func, point, side):
            """Calculate one-sided limit numerically"""
            try:
                for i in range(1, 15):
                    h = 10**(-i)
                    if side == 'left':
                        x = point - h
                    else:
                        x = point + h
                    
                    value = func(x)
                    if i > 5:  # Check for convergence
                        return value
                return value
            except:
                return None
        
        def print_analysis(self, results):
            """Print formatted analysis results"""
            print(f"\nContinuity Analysis: {results['function_name']} at x = {results['point']}")
            print("=" * 60)
            
            print(f"Function value: {results['function_value']}")
            print(f"Left limit: {results['left_limit']}")
            print(f"Right limit: {results['right_limit']}")
            print(f"Limit exists: {results['limit_exists']}")
            
            if results['limit_exists']:
                print(f"Limit value: {results['limit_value']}")
            
            if results['is_continuous']:
                print("✓ CONTINUOUS")
            else:
                print(f"✗ DISCONTINUOUS ({results['discontinuity_type']})")
                if results['can_be_made_continuous']:
                    print("  → Can be made continuous by redefining f(a)")
    
    # Example usage
    analyzer = ContinuityAnalyzer()
    
    # Test various functions
    test_functions = [
        (lambda x: x**2, 2, "x²"),
        (lambda x: (x**2 - 4)/(x - 2) if x != 2 else 10, 2, "(x²-4)/(x-2)"),
        (lambda x: 1 if x >= 0 else -1, 0, "step function"),
        (lambda x: 1/(x-1), 1, "1/(x-1)")
    ]
    
    for func, point, name in test_functions:
        results = analyzer.analyze_continuity(func, point, name)
        analyzer.print_analysis(results)

comprehensive_continuity_checker()
```

</CodeFold>

## Real-World Applications

Continuity analysis has practical applications in programming and mathematical modeling:

<CodeFold>

```python
def practical_continuity_applications():
    """Real-world applications of continuity analysis"""
    
    # 1. Signal Processing - Detecting Discontinuities
    print("1. Signal Processing: Discontinuity Detection")
    print("-" * 45)
    
    def signal_discontinuity_detector(signal_func, time_points):
        """Detect discontinuities in a signal"""
        discontinuities = []
        
        for t in time_points:
            # Check for jump discontinuities
            left_val = signal_func(t - 1e-6)
            right_val = signal_func(t + 1e-6)
            
            if abs(left_val - right_val) > 1e-3:  # Threshold for significance
                discontinuities.append({
                    'time': t,
                    'left_value': left_val,
                    'right_value': right_val,
                    'jump_size': abs(right_val - left_val)
                })
        
        return discontinuities
    
    # Example: Square wave signal
    def square_wave(t):
        return 1 if (t % 2) < 1 else -1
    
    test_times = [0.5, 1.0, 1.5, 2.0, 2.5]
    jumps = signal_discontinuity_detector(square_wave, test_times)
    
    print("Square wave discontinuities:")
    for jump in jumps:
        print(f"  t={jump['time']}: {jump['left_value']} → {jump['right_value']} (jump: {jump['jump_size']})")
    
    # 2. Financial Modeling - Price Gap Detection
    print(f"\n2. Financial Modeling: Price Gap Detection")
    print("-" * 45)
    
    def price_gap_analyzer(price_data):
        """Analyze price gaps in financial data"""
        gaps = []
        
        for i in range(1, len(price_data)):
            prev_close = price_data[i-1]['close']
            curr_open = price_data[i]['open']
            
            gap_percent = abs(curr_open - prev_close) / prev_close * 100
            
            if gap_percent > 2.0:  # Significant gap threshold
                gaps.append({
                    'day': i,
                    'gap_percent': gap_percent,
                    'gap_type': 'up' if curr_open > prev_close else 'down',
                    'prev_close': prev_close,
                    'curr_open': curr_open
                })
        
        return gaps
    
    # Example price data
    prices = [
        {'open': 100, 'close': 102},
        {'open': 102, 'close': 101},
        {'open': 105, 'close': 107},  # Gap up
        {'open': 104, 'close': 103},  # Gap down
        {'open': 103, 'close': 105}
    ]
    
    gaps = price_gap_analyzer(prices)
    print("Price gaps detected:")
    for gap in gaps:
        print(f"  Day {gap['day']}: {gap['prev_close']} → {gap['curr_open']} ({gap['gap_type']} {gap['gap_percent']:.1f}%)")
    
    # 3. Algorithm Robustness - Handling Edge Cases
    print(f"\n3. Algorithm Robustness: Edge Case Handling")
    print("-" * 45)
    
    def robust_function_evaluator(func, x, tolerance=1e-10):
        """Safely evaluate functions with continuity checks"""
        
        def safe_evaluate(f, point):
            try:
                return f(point), True
            except:
                return None, False
        
        # Direct evaluation
        value, success = safe_evaluate(func, x)
        
        if success:
            return {'value': value, 'method': 'direct', 'reliable': True}
        
        # Try nearby points if direct evaluation fails
        for delta in [1e-10, 1e-8, 1e-6]:
            left_val, left_ok = safe_evaluate(func, x - delta)
            right_val, right_ok = safe_evaluate(func, x + delta)
            
            if left_ok and right_ok and abs(left_val - right_val) < tolerance:
                return {
                    'value': (left_val + right_val) / 2,
                    'method': 'limit_approximation',
                    'reliable': True
                }
        
        return {'value': None, 'method': 'failed', 'reliable': False}
    
    # Test with problematic function
    def problematic_func(x):
        if abs(x - 1) < 1e-15:
            raise ZeroDivisionError("Division by zero")
        return (x**2 - 1) / (x - 1)
    
    result = robust_function_evaluator(problematic_func, 1)
    print(f"Robust evaluation at x=1: {result}")
    print(f"Expected value: 2 (since (x²-1)/(x-1) = x+1 for x≠1)")

practical_continuity_applications()
```

</CodeFold>

## Advanced Continuity Concepts

### Uniform Continuity

A function is uniformly continuous if it's continuous everywhere with the same "rate of continuity":

<CodeFold>

```python
def uniform_continuity_demo():
    """Demonstrate the concept of uniform continuity"""
    
    def test_uniform_continuity(func, interval, func_name):
        """Test if a function is uniformly continuous on an interval"""
        
        print(f"\nTesting uniform continuity: {func_name}")
        print(f"Interval: {interval}")
        
        # Sample points across the interval
        x_points = np.linspace(interval[0], interval[1], 100)
        
        # For each delta, find the maximum difference
        deltas = [0.1, 0.01, 0.001, 0.0001]
        
        print(f"{'δ':>8} {'max |f(x+δ)-f(x)|':>20} {'uniformly continuous?':>25}")
        print("-" * 55)
        
        for delta in deltas:
            max_diff = 0
            
            for x in x_points:
                if x + delta <= interval[1]:
                    try:
                        diff = abs(func(x + delta) - func(x))
                        max_diff = max(max_diff, diff)
                    except:
                        max_diff = float('inf')
                        break
            
            is_uniform = max_diff < 2 * delta  # Heuristic check
            status = "✓ Yes" if is_uniform else "✗ No"
            
            print(f"{delta:8.4f} {max_diff:20.6f} {status:>25}")
    
    # Test cases
    
    # 1. Uniformly continuous: f(x) = x
    test_uniform_continuity(lambda x: x, [0, 10], "f(x) = x")
    
    # 2. Uniformly continuous: f(x) = sin(x)
    test_uniform_continuity(lambda x: np.sin(x), [0, 2*np.pi], "f(x) = sin(x)")
    
    # 3. Not uniformly continuous: f(x) = x²
    test_uniform_continuity(lambda x: x**2, [0, 100], "f(x) = x²")

uniform_continuity_demo()
```

</CodeFold>

## Key Takeaways

- **Three Conditions**: Continuity requires function definition, limit existence, and equality
- **Discontinuity Types**: Removable, jump, infinite, and oscillatory discontinuities each have distinct characteristics
- **Testing Algorithm**: Systematic approach using left/right limits and function values
- **Practical Applications**: Signal processing, financial analysis, and algorithm robustness
- **Uniform Continuity**: Stronger condition requiring consistent behavior across entire intervals
- **Numerical Methods**: Approximation techniques when analytical evaluation is impossible
- **Programming Implications**: Continuity analysis helps design robust algorithms and handle edge cases

---

← [Methods and Techniques](methods.md) | [Applications](applications.md) →
