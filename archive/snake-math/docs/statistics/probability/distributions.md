---
title: "Probability Distributions: Modeling Random Phenomena"
description: "Explore normal, binomial, Poisson, and other probability distributions used to model uncertainty in data and real-world processes"
tags: ["mathematics", "statistics", "distributions", "normal", "binomial", "poisson"]
difficulty: "intermediate"
category: "concept"
symbol: "f(x), P(X=k)"
prerequisites: ["probability-basics", "random-variables", "functions"]
related_concepts: ["central-limit-theorem", "hypothesis-testing", "confidence-intervals"]
applications: ["data-modeling", "machine-learning", "quality-control", "finance"]
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

# Probability Distributions: Modeling Random Phenomena

**Probability distributions** are like personality profiles for randomness! Each distribution has its own characteristic shape and behavior, making them perfect for modeling different types of real-world uncertainty - from the height of people (normal) to the number of customer arrivals (Poisson) to yes/no outcomes (binomial).

## Understanding Probability Distributions

**Probability distributions** describe how likely different outcomes are for a random variable. They come in two main flavors:

- **Discrete distributions**: Count things (number of successes, arrivals, defects)
- **Continuous distributions**: Measure things (height, weight, time, temperature)

The key types include:

$$
\begin{align}
\text{Normal (continuous): } f(x) &= \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{(x-\mu)^2}{2\sigma^2}} \\
\text{Binomial (discrete): } P(X = k) &= \binom{n}{k}p^k(1-p)^{n-k} \\
\text{Poisson (discrete): } P(X = k) &= \frac{\lambda^k e^{-\lambda}}{k!}
\end{align}
$$

<CodeFold>

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
import math

def distribution_personalities():
    """Show the 'personalities' of different distributions"""
    
    print("Distribution Personalities")
    print("=" * 30)
    
    # Set random seed for reproducibility
    np.random.seed(42)
    
    def normal_personality():
        """Normal: 'The Balanced Type' - loves the middle"""
        
        print("1. Normal Distribution - 'The Balanced Type'")
        print("   • Symmetric around the mean")
        print("   • Bell-shaped curve")
        print("   • 68-95-99.7 rule applies")
        print("   • Found everywhere due to Central Limit Theorem")
        
        mu, sigma = 100, 15
        normal_samples = np.random.normal(mu, sigma, 1000)
        
        print(f"\n   Example: IQ scores (μ={mu}, σ={sigma})")
        print(f"   Sample statistics:")
        print(f"     Mean: {np.mean(normal_samples):.1f}")
        print(f"     Std Dev: {np.std(normal_samples, ddof=1):.1f}")
        print(f"     Min: {np.min(normal_samples):.1f}")
        print(f"     Max: {np.max(normal_samples):.1f}")
        
        # Show empirical rule
        within_1_sigma = np.sum(np.abs(normal_samples - mu) <= sigma) / len(normal_samples)
        within_2_sigma = np.sum(np.abs(normal_samples - mu) <= 2*sigma) / len(normal_samples)
        
        print(f"   Empirical rule verification:")
        print(f"     Within 1σ: {within_1_sigma:.1%} (expected ~68%)")
        print(f"     Within 2σ: {within_2_sigma:.1%} (expected ~95%)")
    
    def uniform_personality():
        """Uniform: 'The Rebel' - all outcomes equally likely"""
        
        print(f"\n2. Uniform Distribution - 'The Rebel'")
        print("   • All outcomes equally likely")
        print("   • Flat, rectangular shape")
        print("   • No preference for any value")
        print("   • Random number generators often start here")
        
        a, b = 0, 10
        uniform_samples = np.random.uniform(a, b, 1000)
        
        print(f"\n   Example: Random number [0, 10]")
        print(f"   Sample statistics:")
        print(f"     Mean: {np.mean(uniform_samples):.1f} (expected {(a+b)/2})")
        print(f"     Std Dev: {np.std(uniform_samples, ddof=1):.1f}")
        print(f"     Min: {np.min(uniform_samples):.1f}")
        print(f"     Max: {np.max(uniform_samples):.1f}")
        
        # Check uniformity by counting in bins
        bins = np.linspace(a, b, 5)
        bin_counts = np.histogram(uniform_samples, bins=bins)[0]
        
        print(f"   Uniformity check (4 equal bins):")
        for i, count in enumerate(bin_counts):
            print(f"     Bin {i+1}: {count} samples ({count/len(uniform_samples):.1%})")
    
    def exponential_personality():
        """Exponential: 'The Dramatic Type' - many small, few large"""
        
        print(f"\n3. Exponential Distribution - 'The Dramatic Type'")
        print("   • Many small values, few large ones")
        print("   • Models waiting times, lifetimes")
        print("   • Memoryless property")
        print("   • Right-skewed (long tail)")
        
        rate = 0.5  # λ parameter
        exp_samples = np.random.exponential(1/rate, 1000)
        
        print(f"\n   Example: Time between customer arrivals (λ={rate})")
        print(f"   Sample statistics:")
        print(f"     Mean: {np.mean(exp_samples):.1f} (expected {1/rate})")
        print(f"     Std Dev: {np.std(exp_samples, ddof=1):.1f}")
        print(f"     Min: {np.min(exp_samples):.1f}")
        print(f"     Max: {np.max(exp_samples):.1f}")
        
        # Show the concentration at small values
        small_values = np.sum(exp_samples <= 2) / len(exp_samples)
        large_values = np.sum(exp_samples >= 5) / len(exp_samples)
        
        print(f"   Distribution shape:")
        print(f"     ≤ 2 units: {small_values:.1%}")
        print(f"     ≥ 5 units: {large_values:.1%}")
    
    def binomial_personality():
        """Binomial: 'The Counter' - counts successes"""
        
        print(f"\n4. Binomial Distribution - 'The Counter'")
        print("   • Counts successes in fixed trials")
        print("   • Each trial has same success probability")
        print("   • Discrete outcomes (0, 1, 2, ...)")
        print("   • Symmetric when p=0.5, skewed otherwise")
        
        n, p = 20, 0.3
        binomial_samples = np.random.binomial(n, p, 1000)
        
        print(f"\n   Example: Heads in {n} coin flips (p={p})")
        print(f"   Sample statistics:")
        print(f"     Mean: {np.mean(binomial_samples):.1f} (expected {n*p})")
        print(f"     Std Dev: {np.std(binomial_samples, ddof=1):.1f} (expected {math.sqrt(n*p*(1-p)):.1f})")
        print(f"     Min: {np.min(binomial_samples)}")
        print(f"     Max: {np.max(binomial_samples)}")
        
        # Show distribution of outcomes
        unique, counts = np.unique(binomial_samples, return_counts=True)
        most_common = unique[np.argmax(counts)]
        
        print(f"   Distribution shape:")
        print(f"     Most common outcome: {most_common} successes")
        print(f"     Range: {np.min(binomial_samples)} to {np.max(binomial_samples)}")
    
    def poisson_personality():
        """Poisson: 'The Event Counter' - rare events in time/space"""
        
        print(f"\n5. Poisson Distribution - 'The Event Counter'")
        print("   • Counts rare events in time/space")
        print("   • Events occur independently")
        print("   • Fixed average rate")
        print("   • Right-skewed for small λ, approaches normal for large λ")
        
        lam = 3  # λ parameter (average rate)
        poisson_samples = np.random.poisson(lam, 1000)
        
        print(f"\n   Example: Customer calls per hour (λ={lam})")
        print(f"   Sample statistics:")
        print(f"     Mean: {np.mean(poisson_samples):.1f} (expected {lam})")
        print(f"     Std Dev: {np.std(poisson_samples, ddof=1):.1f} (expected {math.sqrt(lam):.1f})")
        print(f"     Min: {np.min(poisson_samples)}")
        print(f"     Max: {np.max(poisson_samples)}")
        
        # Show probability of specific counts
        for k in range(6):
            theoretical_prob = stats.poisson.pmf(k, lam)
            sample_prob = np.sum(poisson_samples == k) / len(poisson_samples)
            print(f"     P(X = {k}): {sample_prob:.3f} (theoretical {theoretical_prob:.3f})")
    
    # Run all personality demonstrations
    normal_personality()
    uniform_personality()
    exponential_personality()
    binomial_personality()
    poisson_personality()
    
    print(f"\nChoosing the Right Distribution:")
    print(f"• Normal: Heights, weights, measurement errors")
    print(f"• Uniform: Random selection, round-off errors")
    print(f"• Exponential: Waiting times, equipment lifetimes")
    print(f"• Binomial: Success counts, quality testing")
    print(f"• Poisson: Rare event counts, defects, arrivals")

distribution_personalities()
```

</CodeFold>

## Normal Distribution: The Star of Statistics

The normal distribution is the most important distribution in statistics due to the Central Limit Theorem:

<CodeFold>

```python
def normal_distribution_deep_dive():
    """Comprehensive normal distribution analysis"""
    
    print("Normal Distribution Deep Dive")
    print("=" * 35)
    
    def normal_properties():
        """Key properties of normal distribution"""
        
        mu, sigma = 100, 15  # Mean and standard deviation
        
        print(f"Normal Distribution N(μ={mu}, σ={sigma})")
        print("-" * 40)
        
        # Probability density function
        def normal_pdf(x, mu, sigma):
            coefficient = 1 / (sigma * math.sqrt(2 * math.pi))
            exponent = -0.5 * ((x - mu) / sigma) ** 2
            return coefficient * math.exp(exponent)
        
        # Calculate probabilities at key points
        x_values = [70, 85, 100, 115, 130]
        
        print("Probability Density Function values:")
        print(f"{'x':<6} {'f(x)':<12} {'Height'}")
        print("-" * 30)
        
        for x in x_values:
            pdf_value = normal_pdf(x, mu, sigma)
            # Create simple visual representation
            height = int(pdf_value * 1000)  # Scale for display
            visual = "█" * height
            print(f"{x:<6} {pdf_value:<12.6f} {visual}")
        
        # Cumulative probabilities
        print(f"\nCumulative Distribution Function:")
        print(f"{'x':<6} {'P(X ≤ x)':<12} {'Percentile'}")
        print("-" * 32)
        
        for x in x_values:
            cdf_value = stats.norm.cdf(x, mu, sigma)
            percentile = cdf_value * 100
            print(f"{x:<6} {cdf_value:<12.4f} {percentile:<8.1f}%")
    
    def empirical_rule():
        """Demonstrate the 68-95-99.7 rule"""
        
        print(f"\nEmpirical Rule (68-95-99.7 Rule):")
        print("-" * 35)
        
        mu, sigma = 100, 15
        
        # Calculate intervals
        intervals = [
            (1, 68.27, mu - sigma, mu + sigma),
            (2, 95.45, mu - 2*sigma, mu + 2*sigma),
            (3, 99.73, mu - 3*sigma, mu + 3*sigma)
        ]
        
        print(f"{'Interval':<20} {'Range':<20} {'Percentage'}")
        print("-" * 50)
        
        for std_devs, percentage, lower, upper in intervals:
            interval_str = f"μ ± {std_devs}σ"
            range_str = f"[{lower:.0f}, {upper:.0f}]"
            
            # Verify with CDF
            actual_percentage = (stats.norm.cdf(upper, mu, sigma) - 
                               stats.norm.cdf(lower, mu, sigma)) * 100
            
            print(f"{interval_str:<20} {range_str:<20} {actual_percentage:.2f}%")
        
        # Practical interpretation
        print(f"\nPractical interpretation for IQ scores:")
        print(f"• About 68% of people have IQ between 85 and 115")
        print(f"• About 95% of people have IQ between 70 and 130")
        print(f"• About 99.7% of people have IQ between 55 and 145")
        print(f"• Only 0.3% have IQ below 55 or above 145 (very rare!)")
    
    def standardization():
        """Show Z-score standardization"""
        
        print(f"\nStandardization (Z-scores):")
        print("-" * 25)
        print("Convert any normal distribution to standard normal N(0,1)")
        print("Formula: Z = (X - μ) / σ")
        
        mu, sigma = 100, 15
        raw_scores = [70, 85, 100, 115, 130, 145]
        
        print(f"\n{'Raw Score':<12} {'Z-score':<12} {'Percentile':<12} {'Interpretation'}")
        print("-" * 60)
        
        for x in raw_scores:
            z = (x - mu) / sigma
            percentile = stats.norm.cdf(z) * 100
            
            # Interpretation
            if z < -2:
                interpretation = "Very low"
            elif z < -1:
                interpretation = "Low"
            elif z < 1:
                interpretation = "Average"
            elif z < 2:
                interpretation = "High"
            else:
                interpretation = "Very high"
            
            print(f"{x:<12} {z:<12.2f} {percentile:<12.1f}% {interpretation}")
        
        print(f"\nKey Z-score landmarks:")
        print(f"• Z = 0: Exactly average (50th percentile)")
        print(f"• Z = ±1: About 68% of data falls between these")
        print(f"• Z = ±2: About 95% of data falls between these")
        print(f"• Z = ±3: About 99.7% of data falls between these")
    
    def central_limit_theorem_demo():
        """Demonstrate Central Limit Theorem"""
        
        print(f"\nCentral Limit Theorem Demonstration:")
        print("-" * 40)
        print("Sample means approach normal distribution, regardless of original distribution")
        
        # Start with non-normal data (uniform)
        np.random.seed(42)
        
        sample_sizes = [1, 5, 10, 30, 50]
        n_samples = 1000
        
        print(f"\nSampling from Uniform[0, 10] distribution:")
        print(f"{'Sample Size':<12} {'Mean of Means':<15} {'Std of Means':<15} {'Normality'}")
        print("-" * 55)
        
        for sample_size in sample_sizes:
            # Generate many sample means
            sample_means = []
            for _ in range(n_samples):
                sample = np.random.uniform(0, 10, sample_size)
                sample_means.append(np.mean(sample))
            
            sample_means = np.array(sample_means)
            mean_of_means = np.mean(sample_means)
            std_of_means = np.std(sample_means, ddof=1)
            
            # Test normality (simplified)
            # For large samples, should approach normal
            if sample_size >= 30:
                normality = "Yes"
            elif sample_size >= 10:
                normality = "Approaching"
            else:
                normality = "Not yet"
            
            # Theoretical standard error
            theoretical_se = math.sqrt(10**2/12) / math.sqrt(sample_size)  # σ/√n for uniform
            
            print(f"{sample_size:<12} {mean_of_means:<15.3f} {std_of_means:<15.3f} {normality}")
        
        print(f"\nKey insights:")
        print(f"• Mean of sample means ≈ 5.0 (population mean)")
        print(f"• Standard error decreases as √n (law of large numbers)")
        print(f"• Distribution becomes more normal with larger samples")
        print(f"• Works for ANY original distribution!")
    
    # Run all demonstrations
    normal_properties()
    empirical_rule()
    standardization()
    central_limit_theorem_demo()
    
    return True

normal_distribution_deep_dive()
```

</CodeFold>

## Discrete Distributions: Counting Successes and Events

Discrete distributions model countable outcomes like successes, arrivals, or defects:

<CodeFold>

```python
def discrete_distributions_analysis():
    """Analyze key discrete probability distributions"""
    
    print("Discrete Distributions Analysis")
    print("=" * 35)
    
    def binomial_distribution():
        """Binomial: Count successes in fixed trials"""
        
        print("1. Binomial Distribution")
        print("   Models: Fixed trials, constant success probability")
        print("   Formula: P(X = k) = C(n,k) × p^k × (1-p)^(n-k)")
        
        n, p = 20, 0.3  # 20 trials, 30% success probability
        
        print(f"\n   Example: Quality control - test {n} items, {p*100:.0f}% defect rate")
        
        # Manual calculation function
        def binomial_coefficient(n, k):
            if k > n or k < 0:
                return 0
            if k == 0 or k == n:
                return 1
            
            result = 1
            for i in range(min(k, n - k)):
                result = result * (n - i) // (i + 1)
            return result
        
        def binomial_pmf(k, n, p):
            return binomial_coefficient(n, k) * (p ** k) * ((1 - p) ** (n - k))
        
        # Calculate key probabilities
        print(f"\n   Key probabilities:")
        print(f"   {'k':<5} {'P(X = k)':<12} {'Cumulative':<12} {'Description'}")
        print("   " + "-" * 45)
        
        cumulative = 0
        key_values = [0, 5, 6, 7, 10, 15, 20]
        
        for k in key_values:
            pmf = binomial_pmf(k, n, p)
            cumulative += pmf if k in range(0, 21) else 0
            
            if k == 0:
                desc = "No defects"
            elif k == int(n * p):
                desc = "Expected value"
            elif k == n:
                desc = "All defects"
            else:
                desc = f"{k} defects"
            
            print(f"   {k:<5} {pmf:<12.6f} {stats.binom.cdf(k, n, p):<12.4f} {desc}")
        
        # Distribution properties
        expected_value = n * p
        variance = n * p * (1 - p)
        std_dev = math.sqrt(variance)
        
        print(f"\n   Distribution properties:")
        print(f"     Expected value: E[X] = np = {expected_value:.1f}")
        print(f"     Variance: Var(X) = np(1-p) = {variance:.1f}")
        print(f"     Standard deviation: σ = {std_dev:.1f}")
        
        # Practical insights
        print(f"\n   Practical insights:")
        print(f"     • Most likely outcome: around {expected_value:.0f} defects")
        print(f"     • 95% of batches will have between {max(0, expected_value - 2*std_dev):.0f} and {min(n, expected_value + 2*std_dev):.0f} defects")
        print(f"     • P(no defects) = {binomial_pmf(0, n, p):.4f} ({binomial_pmf(0, n, p)*100:.1f}%)")
    
    def poisson_distribution():
        """Poisson: Count rare events"""
        
        print(f"\n2. Poisson Distribution")
        print("   Models: Rare events in time/space, arrivals, defects")
        print("   Formula: P(X = k) = (λ^k × e^(-λ)) / k!")
        
        lam = 3  # Average rate parameter
        
        print(f"\n   Example: Customer calls per hour (λ = {lam})")
        
        # Manual calculation
        def poisson_pmf(k, lam):
            return (lam ** k * math.exp(-lam)) / math.factorial(k)
        
        print(f"\n   Probability distribution:")
        print(f"   {'k':<5} {'P(X = k)':<12} {'Cumulative':<12} {'Description'}")
        print("   " + "-" * 50)
        
        for k in range(8):
            pmf = poisson_pmf(k, lam)
            cdf = stats.poisson.cdf(k, lam)
            
            if k == 0:
                desc = "No calls"
            elif k == lam:
                desc = "Expected rate"
            elif k == 1:
                desc = "One call"
            else:
                desc = f"{k} calls"
            
            print(f"   {k:<5} {pmf:<12.6f} {cdf:<12.4f} {desc}")
        
        # Properties
        print(f"\n   Distribution properties:")
        print(f"     Expected value: E[X] = λ = {lam}")
        print(f"     Variance: Var(X) = λ = {lam}")
        print(f"     Standard deviation: σ = √λ = {math.sqrt(lam):.2f}")
        
        # Business insights
        print(f"\n   Business insights:")
        prob_0 = poisson_pmf(0, lam)
        prob_5_plus = 1 - stats.poisson.cdf(4, lam)
        
        print(f"     • P(no calls) = {prob_0:.3f} ({prob_0*100:.1f}%)")
        print(f"     • P(5+ calls) = {prob_5_plus:.3f} ({prob_5_plus*100:.1f}%)")
        print(f"     • Need to staff for variability around average of {lam}")
    
    def geometric_distribution():
        """Geometric: Wait time until first success"""
        
        print(f"\n3. Geometric Distribution")
        print("   Models: Trials until first success")
        print("   Formula: P(X = k) = (1-p)^(k-1) × p")
        
        p = 0.1  # 10% success probability
        
        print(f"\n   Example: Sales calls until first sale (p = {p*100:.0f}%)")
        
        def geometric_pmf(k, p):
            """P(X = k) - k trials until first success"""
            return ((1 - p) ** (k - 1)) * p
        
        print(f"\n   Probability of first success on trial k:")
        print(f"   {'Trial k':<10} {'P(X = k)':<12} {'Cumulative':<12} {'Description'}")
        print("   " + "-" * 45)
        
        for k in [1, 2, 5, 10, 15, 20]:
            pmf = geometric_pmf(k, p)
            cdf = stats.geom.cdf(k, p)  # Note: scipy uses different parameterization
            
            if k == 1:
                desc = "First try!"
            elif k <= 5:
                desc = "Quick success"
            elif k <= 10:
                desc = "Moderate wait"
            else:
                desc = "Long wait"
            
            print(f"   {k:<10} {pmf:<12.6f} {cdf:<12.4f} {desc}")
        
        # Expected waiting time
        expected_trials = 1 / p
        
        print(f"\n   Distribution properties:")
        print(f"     Expected trials: E[X] = 1/p = {expected_trials:.1f}")
        print(f"     Standard deviation: σ = √((1-p)/p²) = {math.sqrt((1-p)/(p**2)):.1f}")
        
        print(f"\n   Business insights:")
        print(f"     • On average, need {expected_trials:.0f} calls per sale")
        print(f"     • 50% chance of sale within {math.log(0.5)/math.log(1-p):.1f} calls")
        print(f"     • Memoryless: each call has same {p*100:.0f}% chance")
    
    # Run all discrete distribution analyses
    binomial_distribution()
    poisson_distribution()
    geometric_distribution()
    
    print(f"\nChoosing Discrete Distributions:")
    print(f"• Binomial: Fixed trials, counting successes")
    print(f"• Poisson: Rare events, arrivals in time/space")
    print(f"• Geometric: Waiting time until first success")
    print(f"• All have discrete (countable) outcomes")

discrete_distributions_analysis()
```

</CodeFold>

## Continuous Distributions: Measuring the Unmeasurable

Continuous distributions model measurable quantities with infinite precision:

<CodeFold>

```python
def continuous_distributions_analysis():
    """Analyze key continuous probability distributions"""
    
    print("Continuous Distributions Analysis")
    print("=" * 40)
    
    def exponential_distribution():
        """Exponential: Waiting times and lifetimes"""
        
        print("1. Exponential Distribution")
        print("   Models: Waiting times, lifetimes, time between events")
        print("   Formula: f(x) = λe^(-λx) for x ≥ 0")
        print("   Key property: Memoryless")
        
        rate = 0.5  # λ parameter (rate)
        scale = 1 / rate  # Mean = 1/λ
        
        print(f"\n   Example: Time between customer arrivals (λ = {rate})")
        
        # Calculate probabilities for intervals
        intervals = [(0, 1), (1, 2), (2, 5), (5, 10)]
        
        print(f"\n   Probability densities and intervals:")
        print(f"   {'Interval':<12} {'P(X in interval)':<18} {'Density at midpoint'}")
        print("   " + "-" * 50)
        
        for a, b in intervals:
            prob_interval = stats.expon.cdf(b, scale=scale) - stats.expon.cdf(a, scale=scale)
            midpoint = (a + b) / 2
            density = stats.expon.pdf(midpoint, scale=scale)
            
            print(f"   [{a}, {b}]      {prob_interval:<18.4f} {density:.4f}")
        
        # Key percentiles
        print(f"\n   Key percentiles:")
        percentiles = [25, 50, 75, 90, 95, 99]
        
        for p in percentiles:
            value = stats.expon.ppf(p/100, scale=scale)
            print(f"     {p:2d}th percentile: {value:.2f} time units")
        
        # Memoryless property demonstration
        print(f"\n   Memoryless property:")
        print("   P(X > s+t | X > s) = P(X > t)")
        
        s, t = 2, 3
        prob_conditional = (1 - stats.expon.cdf(s + t, scale=scale)) / (1 - stats.expon.cdf(s, scale=scale))
        prob_fresh = 1 - stats.expon.cdf(t, scale=scale)
        
        print(f"     Example: s={s}, t={t}")
        print(f"     P(X > {s+t} | X > {s}) = {prob_conditional:.4f}")
        print(f"     P(X > {t}) = {prob_fresh:.4f}")
        print(f"     Difference: {abs(prob_conditional - prob_fresh):.6f} (should be ≈ 0)")
    
    def uniform_distribution():
        """Uniform: All values equally likely"""
        
        print(f"\n2. Uniform Distribution")
        print("   Models: Random selection, round-off errors, worst-case scenarios")
        print("   Formula: f(x) = 1/(b-a) for a ≤ x ≤ b")
        
        a, b = 10, 20  # Interval [a, b]
        
        print(f"\n   Example: Random process time between {a} and {b} minutes")
        
        # Properties
        mean = (a + b) / 2
        variance = (b - a) ** 2 / 12
        std_dev = math.sqrt(variance)
        
        print(f"\n   Distribution properties:")
        print(f"     Mean: μ = (a+b)/2 = {mean}")
        print(f"     Variance: σ² = (b-a)²/12 = {variance:.2f}")
        print(f"     Standard deviation: σ = {std_dev:.2f}")
        
        # Probability calculations
        print(f"\n   Probability calculations:")
        intervals = [(12, 15), (10, 12), (18, 20), (15, 25)]
        
        for start, end in intervals:
            # Clamp to [a, b]
            start_clamped = max(start, a)
            end_clamped = min(end, b)
            
            if start_clamped < end_clamped:
                prob = (end_clamped - start_clamped) / (b - a)
            else:
                prob = 0
            
            print(f"     P({start} ≤ X ≤ {end}) = {prob:.3f}")
        
        # Quartiles
        print(f"\n   Quartiles:")
        for p, name in [(25, "Q1"), (50, "Median"), (75, "Q3")]:
            value = a + (b - a) * (p / 100)
            print(f"     {name} ({p}th percentile): {value}")
    
    def normal_vs_others():
        """Compare normal with other continuous distributions"""
        
        print(f"\n3. Comparing Continuous Distributions")
        print("   Shape and behavior differences:")
        
        # Generate samples for comparison
        np.random.seed(42)
        n_samples = 10000
        
        normal_samples = np.random.normal(10, 2, n_samples)
        exponential_samples = np.random.exponential(2, n_samples)
        uniform_samples = np.random.uniform(5, 15, n_samples)
        
        distributions = [
            ("Normal(10, 2)", normal_samples),
            ("Exponential(scale=2)", exponential_samples),
            ("Uniform(5, 15)", uniform_samples)
        ]
        
        print(f"\n   {'Distribution':<20} {'Mean':<8} {'Std':<8} {'Min':<8} {'Max':<8} {'Skew'}")
        print("   " + "-" * 65)
        
        for name, samples in distributions:
            mean_val = np.mean(samples)
            std_val = np.std(samples, ddof=1)
            min_val = np.min(samples)
            max_val = np.max(samples)
            
            # Simple skewness measure
            skew = np.mean(((samples - mean_val) / std_val) ** 3)
            
            if abs(skew) < 0.5:
                skew_desc = "Symmetric"
            elif skew > 0:
                skew_desc = "Right-skewed"
            else:
                skew_desc = "Left-skewed"
            
            print(f"   {name:<20} {mean_val:<8.2f} {std_val:<8.2f} {min_val:<8.2f} {max_val:<8.2f} {skew_desc}")
        
        print(f"\n   Key differences:")
        print(f"   • Normal: Symmetric, bell-shaped, most data near center")
        print(f"   • Exponential: Right-skewed, many small values, few large")
        print(f"   • Uniform: Flat, all values equally likely in range")
    
    # Run all continuous distribution analyses
    exponential_distribution()
    uniform_distribution()
    normal_vs_others()
    
    print(f"\nChoosing Continuous Distributions:")
    print(f"• Normal: Measurements, errors, averages (CLT)")
    print(f"• Exponential: Waiting times, lifetimes")
    print(f"• Uniform: Random selection, worst-case analysis")
    print(f"• All have uncountable outcomes (real numbers)")

continuous_distributions_analysis()
```

</CodeFold>

## Interactive Exploration

<ProbabilityDistributionSimulator />

Experiment with different distributions and their parameters to see how they model various types of uncertainty and real-world phenomena!

## Next Steps

Continue your probability journey with:

- **[Basics](./basics.md)** - Review fundamental probability concepts and rules
- **[Applications](./applications.md)** - Explore real-world applications in business, science, and technology  
- **[Index](./index.md)** - Complete overview and learning path

## Related Concepts

- **Central Limit Theorem** - Why normal distributions are everywhere
- **Hypothesis Testing** - Using distributions to make statistical decisions
- **Confidence Intervals** - Quantifying uncertainty in estimates
- **Bayes' Theorem** - Updating probabilities with new evidence
- **Maximum Likelihood Estimation** - Finding best-fit distribution parameters
