---
title: "Probability Basics: Fundamentals of Uncertainty"
description: "Introduction to probability distributions, sample spaces, events, and fundamental probability rules"
tags: ["mathematics", "statistics", "probability", "basics", "fundamentals"]
difficulty: "beginner"
category: "concept"
symbol: "P(X)"
prerequisites: ["descriptive-stats", "basic-arithmetic"]
related_concepts: ["distributions", "bayes-theorem", "random-variables"]
applications: ["data-analysis", "decision-making", "risk-assessment"]
interactive: true
code_examples: true
complexity_analysis: false
real_world_examples: true
layout: "concept-page"
date_created: "2024-01-01"
last_updated: "2024-01-01"
author: "Snake Math Team"
reviewers: []
version: "1.0"
---

# Probability Basics: Fundamentals of Uncertainty

Think of probability as the mathematics of uncertainty! Just like weather forecasts predict the likelihood of rain, probability tells us how likely different outcomes are for any random process. It's our mathematical crystal ball for understanding and quantifying uncertainty.

## Understanding Probability

**Probability** measures how likely an event is to occur, expressed as a number between 0 and 1 (or 0% to 100%). It's the foundation for making informed decisions when we can't predict outcomes with certainty.

Key concepts include:
- **Sample Space (Ω)**: All possible outcomes
- **Event (A)**: A subset of possible outcomes  
- **Probability P(A)**: The likelihood of event A occurring

$$P(A) = \frac{\text{Number of favorable outcomes}}{\text{Total number of possible outcomes}}$$

<CodeFold>

```python
import random
import numpy as np
from collections import Counter

def probability_fundamentals():
    """Demonstrate fundamental probability concepts"""
    
    print("Probability Fundamentals")
    print("=" * 25)
    
    def basic_probability_examples():
        """Show basic probability calculations"""
        
        print("1. Basic Probability Examples:")
        
        # Coin flip
        print("   Single coin flip:")
        print(f"     P(Heads) = 1/2 = {1/2:.3f}")
        print(f"     P(Tails) = 1/2 = {1/2:.3f}")
        
        # Six-sided die
        print("\n   Six-sided die:")
        for outcome in range(1, 7):
            prob = 1/6
            print(f"     P(rolling {outcome}) = 1/6 = {prob:.3f}")
        
        # Card from standard deck
        print("\n   Card from standard deck:")
        print(f"     P(Ace) = 4/52 = {4/52:.3f}")
        print(f"     P(Heart) = 13/52 = {13/52:.3f}")
        print(f"     P(Face card) = 12/52 = {12/52:.3f}")
        print(f"     P(Red card) = 26/52 = {26/52:.3f}")
    
    def probability_rules():
        """Demonstrate fundamental probability rules"""
        
        print("\n2. Fundamental Probability Rules:")
        
        # Rule 1: Probability bounds
        print("   Rule 1: 0 ≤ P(A) ≤ 1")
        print("     • Impossible event: P(∅) = 0")
        print("     • Certain event: P(Ω) = 1")
        
        # Rule 2: Addition rule for mutually exclusive events
        print("\n   Rule 2: Addition Rule")
        print("     For mutually exclusive events: P(A or B) = P(A) + P(B)")
        
        # Example: rolling a die
        p_1 = 1/6  # P(rolling 1)
        p_2 = 1/6  # P(rolling 2)
        p_1_or_2 = p_1 + p_2  # P(rolling 1 or 2)
        
        print(f"     Example: P(rolling 1 or 2) = {p_1:.3f} + {p_2:.3f} = {p_1_or_2:.3f}")
        
        # Rule 3: Complement rule
        print("\n   Rule 3: Complement Rule")
        print("     P(not A) = 1 - P(A)")
        
        p_ace = 4/52  # P(drawing an Ace)
        p_not_ace = 1 - p_ace  # P(not drawing an Ace)
        
        print(f"     Example: P(not Ace) = 1 - {p_ace:.3f} = {p_not_ace:.3f}")
        
        # Rule 4: General addition rule
        print("\n   Rule 4: General Addition Rule")
        print("     P(A or B) = P(A) + P(B) - P(A and B)")
        
        # Example: drawing from deck
        p_ace = 4/52      # P(Ace)
        p_heart = 13/52   # P(Heart)
        p_ace_heart = 1/52  # P(Ace of Hearts)
        p_ace_or_heart = p_ace + p_heart - p_ace_heart
        
        print(f"     Example: P(Ace or Heart) = {p_ace:.3f} + {p_heart:.3f} - {p_ace_heart:.3f} = {p_ace_or_heart:.3f}")
    
    def conditional_probability():
        """Introduce conditional probability"""
        
        print("\n3. Conditional Probability:")
        print("   P(A|B) = P(A and B) / P(B)")
        print("   'Probability of A given that B has occurred'")
        
        # Example: drawing cards without replacement
        print("\n   Example: Drawing cards without replacement")
        print("   First card is an Ace. What's P(second card is also Ace)?")
        
        # After drawing one Ace, 3 Aces remain in 51 cards
        p_second_ace_given_first_ace = 3/51
        
        print(f"     P(2nd Ace | 1st Ace) = 3/51 = {p_second_ace_given_first_ace:.3f}")
        
        # Independence vs dependence
        print("\n   Independence:")
        print("   Events A and B are independent if P(A|B) = P(A)")
        print("   Example: coin flips are independent")
        
        print("\n   Dependence:")
        print("   Events A and B are dependent if P(A|B) ≠ P(A)")
        print("   Example: drawing cards without replacement")
    
    def simulation_vs_theory():
        """Compare theoretical vs simulated probabilities"""
        
        print("\n4. Simulation vs Theoretical Probability:")
        
        # Simulate coin flips
        n_flips = 10000
        random.seed(42)
        
        flips = [random.choice(['H', 'T']) for _ in range(n_flips)]
        heads_count = flips.count('H')
        simulated_prob = heads_count / n_flips
        theoretical_prob = 0.5
        
        print(f"   Coin flip simulation ({n_flips:,} flips):")
        print(f"     Theoretical P(Heads) = {theoretical_prob:.3f}")
        print(f"     Simulated P(Heads) = {simulated_prob:.3f}")
        print(f"     Difference = {abs(simulated_prob - theoretical_prob):.6f}")
        
        # Simulate die rolls
        n_rolls = 10000
        rolls = [random.randint(1, 6) for _ in range(n_rolls)]
        roll_counts = Counter(rolls)
        
        print(f"\n   Die roll simulation ({n_rolls:,} rolls):")
        print("     Face  Theoretical  Simulated   Difference")
        print("     " + "-" * 40)
        
        for face in range(1, 7):
            theoretical = 1/6
            simulated = roll_counts[face] / n_rolls
            difference = abs(theoretical - simulated)
            
            print(f"      {face}      {theoretical:.3f}      {simulated:.3f}      {difference:.6f}")
    
    # Run demonstrations
    basic_probability_examples()
    probability_rules()
    conditional_probability()
    simulation_vs_theory()
    
    print(f"\nKey Takeaways:")
    print(f"• Probability quantifies uncertainty with numbers from 0 to 1")
    print(f"• Addition rule handles 'or' scenarios")
    print(f"• Conditional probability handles dependence between events")
    print(f"• Simulation converges to theoretical probability with large samples")
    
    return True

probability_fundamentals()
```

</CodeFold>

## Sample Spaces and Events

Understanding sample spaces and events is crucial for calculating probabilities correctly:

<CodeFold>

```python
def sample_spaces_and_events():
    """Explore sample spaces, events, and their relationships"""
    
    print("Sample Spaces and Events")
    print("=" * 30)
    
    def simple_sample_spaces():
        """Define sample spaces for common scenarios"""
        
        print("1. Simple Sample Spaces:")
        
        # Coin flip
        coin_space = ['H', 'T']
        print(f"   Coin flip: Ω = {coin_space}")
        print(f"   |Ω| = {len(coin_space)}")
        
        # Die roll
        die_space = list(range(1, 7))
        print(f"\n   Die roll: Ω = {die_space}")
        print(f"   |Ω| = {len(die_space)}")
        
        # Two coin flips
        two_coins = ['HH', 'HT', 'TH', 'TT']
        print(f"\n   Two coin flips: Ω = {two_coins}")
        print(f"   |Ω| = {len(two_coins)}")
        
        # Playing card
        suits = ['♠', '♥', '♦', '♣']
        ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        card_space = [(rank, suit) for suit in suits for rank in ranks]
        print(f"\n   Playing card: |Ω| = {len(card_space)} cards")
        print(f"   Example outcomes: {card_space[:5]}...")
    
    def event_operations():
        """Demonstrate operations on events"""
        
        print("\n2. Event Operations:")
        
        # Define sample space for die roll
        sample_space = set(range(1, 7))
        
        # Define events
        A = {2, 4, 6}  # Even numbers
        B = {1, 2, 3}  # Numbers ≤ 3
        C = {4, 5, 6}  # Numbers ≥ 4
        
        print(f"   Sample space: Ω = {sorted(sample_space)}")
        print(f"   Event A (even): {sorted(A)}")
        print(f"   Event B (≤ 3): {sorted(B)}")
        print(f"   Event C (≥ 4): {sorted(C)}")
        
        # Union (or)
        union_AB = A.union(B)
        print(f"\n   A ∪ B (even OR ≤ 3): {sorted(union_AB)}")
        
        # Intersection (and)
        intersection_AB = A.intersection(B)
        print(f"   A ∩ B (even AND ≤ 3): {sorted(intersection_AB)}")
        
        # Complement
        complement_A = sample_space - A
        print(f"   A' (not even): {sorted(complement_A)}")
        
        # Difference
        difference_AB = A - B
        print(f"   A - B (even but not ≤ 3): {sorted(difference_AB)}")
        
        # Check mutual exclusivity
        intersection_AC = A.intersection(C)
        if intersection_AC:
            print(f"   A ∩ C: {sorted(intersection_AC)} (not mutually exclusive)")
        else:
            print(f"   A ∩ C: ∅ (mutually exclusive)")
    
    def probability_calculations():
        """Calculate probabilities using counting"""
        
        print("\n3. Probability Calculations:")
        
        # Die roll example
        sample_space = set(range(1, 7))
        
        events = {
            'Even': {2, 4, 6},
            'Odd': {1, 3, 5},
            '≤ 3': {1, 2, 3},
            '≥ 4': {4, 5, 6},
            'Prime': {2, 3, 5}
        }
        
        print(f"   Die roll probabilities:")
        print(f"   {'Event':<10} {'Outcomes':<15} {'Count':<8} {'Probability'}")
        print("   " + "-" * 50)
        
        for event_name, event_set in events.items():
            count = len(event_set)
            probability = count / len(sample_space)
            outcomes_str = str(sorted(event_set))
            
            print(f"   {event_name:<10} {outcomes_str:<15} {count:<8} {probability:.3f}")
        
        # Combined events
        print(f"\n   Combined events:")
        even = events['Even']
        le_3 = events['≤ 3']
        
        # P(even OR ≤ 3)
        union = even.union(le_3)
        p_union = len(union) / len(sample_space)
        print(f"   P(even OR ≤ 3) = |{sorted(union)}| / 6 = {p_union:.3f}")
        
        # P(even AND ≤ 3)
        intersection = even.intersection(le_3)
        p_intersection = len(intersection) / len(sample_space)
        print(f"   P(even AND ≤ 3) = |{sorted(intersection)}| / 6 = {p_intersection:.3f}")
        
        # Verify addition rule
        p_even = len(even) / len(sample_space)
        p_le_3 = len(le_3) / len(sample_space)
        p_union_calc = p_even + p_le_3 - p_intersection
        
        print(f"\n   Verification of addition rule:")
        print(f"   P(A) + P(B) - P(A∩B) = {p_even:.3f} + {p_le_3:.3f} - {p_intersection:.3f} = {p_union_calc:.3f}")
        print(f"   P(A∪B) = {p_union:.3f} ✓")
    
    # Run demonstrations
    simple_sample_spaces()
    event_operations()
    probability_calculations()
    
    return True

sample_spaces_and_events()
```

</CodeFold>

## Random Variables

Random variables assign numerical values to outcomes, making it easier to perform calculations:

<CodeFold>

```python
def random_variables_intro():
    """Introduction to random variables and their types"""
    
    print("Random Variables")
    print("=" * 20)
    
    def discrete_random_variables():
        """Demonstrate discrete random variables"""
        
        print("1. Discrete Random Variables:")
        print("   Countable outcomes (finite or infinite)")
        
        # Example: number of heads in 3 coin flips
        print("\n   Example: Number of heads in 3 coin flips")
        
        # List all possible outcomes
        outcomes = []
        for flip1 in ['H', 'T']:
            for flip2 in ['H', 'T']:
                for flip3 in ['H', 'T']:
                    outcome = flip1 + flip2 + flip3
                    heads_count = outcome.count('H')
                    outcomes.append((outcome, heads_count))
        
        # Count occurrences of each value
        from collections import Counter
        value_counts = Counter([count for _, count in outcomes])
        
        print(f"   {'Outcome':<8} {'X (# heads)'}")
        print("   " + "-" * 20)
        for outcome, heads in outcomes:
            print(f"   {outcome:<8} {heads}")
        
        print(f"\n   Probability distribution:")
        print(f"   {'X':<5} {'Count':<8} {'P(X = x)'}")
        print("   " + "-" * 25)
        
        total_outcomes = len(outcomes)
        for value in sorted(value_counts.keys()):
            count = value_counts[value]
            probability = count / total_outcomes
            print(f"   {value:<5} {count:<8} {probability:.3f}")
    
    def continuous_random_variables():
        """Demonstrate continuous random variables conceptually"""
        
        print("\n2. Continuous Random Variables:")
        print("   Uncountable outcomes (real numbers in an interval)")
        
        print("\n   Examples:")
        print("   • Height of a randomly selected person")
        print("   • Time until next customer arrives")
        print("   • Temperature at noon tomorrow")
        print("   • Stock price at market close")
        
        print("\n   Key difference from discrete:")
        print("   • P(X = exact value) = 0 for continuous variables")
        print("   • Instead, we calculate P(a ≤ X ≤ b) for intervals")
        print("   • Use probability density functions (PDFs)")
        
        # Demonstrate with simulation
        print("\n   Simulation example: Uniform[0, 1]")
        
        import random
        random.seed(42)
        n_samples = 10000
        
        samples = [random.uniform(0, 1) for _ in range(n_samples)]
        
        # Count samples in intervals
        intervals = [(0, 0.2), (0.2, 0.4), (0.4, 0.6), (0.6, 0.8), (0.8, 1.0)]
        
        print(f"   {'Interval':<12} {'Count':<8} {'Proportion'}")
        print("   " + "-" * 30)
        
        for a, b in intervals:
            count = sum(1 for x in samples if a <= x < b)
            proportion = count / n_samples
            print(f"   [{a:.1f}, {b:.1f})   {count:<8} {proportion:.3f}")
    
    def random_variable_functions():
        """Show expected value and variance calculations"""
        
        print("\n3. Random Variable Properties:")
        
        # Discrete example: die roll
        print("   Discrete example: Fair six-sided die")
        
        values = list(range(1, 7))
        probabilities = [1/6] * 6
        
        # Expected value
        expected_value = sum(x * p for x, p in zip(values, probabilities))
        
        # Variance
        variance = sum((x - expected_value)**2 * p for x, p in zip(values, probabilities))
        
        # Standard deviation
        std_deviation = variance ** 0.5
        
        print(f"   E[X] = Σ x·P(X=x) = {expected_value:.3f}")
        print(f"   Var(X) = Σ (x-μ)²·P(X=x) = {variance:.3f}")
        print(f"   σ = √Var(X) = {std_deviation:.3f}")
        
        # Show calculation details
        print(f"\n   Calculation details:")
        print(f"   {'x':<5} {'P(X=x)':<10} {'x·P(X=x)':<12} {'(x-μ)²·P(X=x)'}")
        print("   " + "-" * 45)
        
        for x, p in zip(values, probabilities):
            x_times_p = x * p
            var_contribution = (x - expected_value)**2 * p
            print(f"   {x:<5} {p:<10.3f} {x_times_p:<12.3f} {var_contribution:<12.3f}")
        
        print(f"   Sum:  {'1.000':<10} {expected_value:<12.3f} {variance:<12.3f}")
    
    # Run demonstrations
    discrete_random_variables()
    continuous_random_variables()
    random_variable_functions()
    
    print(f"\nKey Concepts:")
    print(f"• Random variables map outcomes to numbers")
    print(f"• Discrete: countable values, use PMF")
    print(f"• Continuous: uncountable values, use PDF")
    print(f"• Expected value measures central tendency")
    print(f"• Variance measures spread")
    
    return True

random_variables_intro()
```

</CodeFold>

## Interactive Exploration

<ProbabilityBasicsSimulator />

Experiment with basic probability concepts, sample spaces, and random variables to build intuition about uncertainty and randomness!

## Next Steps

Continue your probability journey with:

- **[Distributions](./distributions.md)** - Explore specific probability distributions like normal, binomial, and Poisson
- **[Applications](./applications.md)** - See how probability applies to real-world scenarios and decision-making
- **[Index](./index.md)** - Complete overview and learning path

## Related Concepts

- **Descriptive Statistics** - Summarizing data with measures of center and spread
- **Conditional Probability** - Understanding dependence between events
- **Bayes' Theorem** - Updating probabilities with new evidence
- **Central Limit Theorem** - Why normal distributions are so important
- **Hypothesis Testing** - Using probability for statistical inference
