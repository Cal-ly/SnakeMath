---
title: "Descriptive Statistics - Implementation Methods"
description: "Different approaches to calculating statistics from manual implementations to optimized algorithms and streaming methods"
tags: ["statistics", "numpy", "scipy", "algorithms", "optimization"]
difficulty: "intermediate"
category: "concept-page"
prerequisites: ["descriptive-stats-basics"]
related_concepts: ["algorithms", "performance-optimization"]
layout: "concept-page"
---

# Implementation Methods for Descriptive Statistics

Understanding different approaches to calculating and applying descriptive statistics helps optimize performance and choose appropriate methods for different types of data and constraints.

## Method Comparison Overview

| Method | Pros | Cons | Complexity | Best For |
|--------|------|------|------------|----------|
| **Manual** | Educational, full control | Slower, more code | O(n) to O(n log n) | Learning, custom needs |
| **NumPy/SciPy** | Fast, optimized, extensive | Dependency, memory | Optimized O(n) | Most applications |
| **Streaming** | Memory efficient, real-time | Approximate results | O(1) per update | Large/continuous data |

## Method 1: Manual Implementation

**Educational value, complete control, understanding of calculations**

<CodeFold>

```python
import math
from collections import Counter

def comprehensive_manual_statistics(data):
    """Calculate comprehensive descriptive statistics from scratch"""
    
    if not data:
        raise ValueError("Dataset cannot be empty")
    
    # Ensure data is numeric
    data = [float(x) for x in data]
    n = len(data)
    
    # Central Tendency
    mean = sum(data) / n
    
    # Median (requires sorting)
    sorted_data = sorted(data)
    if n % 2 == 0:
        median = (sorted_data[n//2 - 1] + sorted_data[n//2]) / 2
    else:
        median = sorted_data[n//2]
    
    # Mode
    counts = Counter(data)
    max_count = max(counts.values())
    modes = [value for value, count in counts.items() if count == max_count]
    mode = modes[0] if len(modes) == 1 else modes
    
    # Variability
    data_range = max(data) - min(data)
    
    # Variance (sample variance using n-1)
    mean_deviations_squared = [(x - mean)**2 for x in data]
    variance = sum(mean_deviations_squared) / (n - 1) if n > 1 else 0
    std_deviation = math.sqrt(variance)
    
    # Quartiles using interpolation method
    def calculate_quartile(sorted_data, q):
        n = len(sorted_data)
        index = q * (n - 1)
        lower_index = int(index)
        upper_index = lower_index + 1
        
        if upper_index >= n:
            return sorted_data[lower_index]
        
        weight = index - lower_index
        return sorted_data[lower_index] * (1 - weight) + sorted_data[upper_index] * weight
    
    q1 = calculate_quartile(sorted_data, 0.25)
    q3 = calculate_quartile(sorted_data, 0.75)
    iqr = q3 - q1
    
    # Shape measures
    def calculate_skewness():
        if std_deviation == 0:
            return 0
        skew_sum = sum(((x - mean) / std_deviation)**3 for x in data)
        return (n * skew_sum) / ((n - 1) * (n - 2)) if n > 2 else 0
    
    def calculate_kurtosis():
        if std_deviation == 0:
            return 0
        kurt_sum = sum(((x - mean) / std_deviation)**4 for x in data)
        if n > 3:
            return (n * (n + 1) * kurt_sum) / ((n - 1) * (n - 2) * (n - 3)) - (3 * (n - 1)**2) / ((n - 2) * (n - 3))
        return 0
    
    skewness = calculate_skewness()
    kurtosis = calculate_kurtosis()
    
    # Outlier detection using IQR method
    lower_fence = q1 - 1.5 * iqr
    upper_fence = q3 + 1.5 * iqr
    outliers = [x for x in data if x < lower_fence or x > upper_fence]
    
    return {
        'count': n,
        'mean': mean,
        'median': median,
        'mode': mode,
        'range': data_range,
        'min': min(data),
        'max': max(data),
        'q1': q1,
        'q3': q3,
        'iqr': iqr,
        'variance': variance,
        'std_deviation': std_deviation,
        'skewness': skewness,
        'kurtosis': kurtosis,
        'outliers': outliers,
        'outlier_bounds': (lower_fence, upper_fence)
    }

# Example usage
sample_data = [2, 4, 4, 4, 5, 5, 7, 9, 12, 15, 18, 100]  # Added outlier
stats = comprehensive_manual_statistics(sample_data)

print("Manual Implementation Results:")
print("=" * 35)
for key, value in stats.items():
    if isinstance(value, float):
        print(f"{key}: {value:.3f}")
    elif isinstance(value, list) and value:
        print(f"{key}: {[round(v, 3) if isinstance(v, float) else v for v in value]}")
    else:
        print(f"{key}: {value}")
```

</CodeFold>

## Method 2: NumPy/SciPy Optimized

**Highly optimized, handles large datasets efficiently, extensive functionality**

<CodeFold>

```python
import numpy as np
from scipy import stats
import time

def optimized_descriptive_statistics(data):
    """Calculate descriptive statistics using optimized NumPy/SciPy functions"""
    
    data = np.array(data, dtype=float)
    
    # Basic measures
    basic_stats = {
        'count': len(data),
        'mean': np.mean(data),
        'median': np.median(data),
        'std_deviation': np.std(data, ddof=1),
        'variance': np.var(data, ddof=1),
        'min': np.min(data),
        'max': np.max(data),
        'range': np.ptp(data),  # peak-to-peak (max - min)
    }
    
    # Percentiles and quartiles
    percentiles = np.percentile(data, [25, 50, 75])
    basic_stats.update({
        'q1': percentiles[0],
        'q3': percentiles[2],
        'iqr': percentiles[2] - percentiles[0]
    })
    
    # Mode (using scipy.stats)
    mode_result = stats.mode(data, keepdims=True)
    basic_stats['mode'] = mode_result.mode[0] if len(mode_result.mode) > 0 else None
    
    # Shape statistics
    basic_stats.update({
        'skewness': stats.skew(data),
        'kurtosis': stats.kurtosis(data)  # excess kurtosis
    })
    
    # Outlier detection
    q1, q3 = basic_stats['q1'], basic_stats['q3']
    iqr = basic_stats['iqr']
    lower_fence = q1 - 1.5 * iqr
    upper_fence = q3 + 1.5 * iqr
    outliers = data[(data < lower_fence) | (data > upper_fence)]
    
    basic_stats.update({
        'outliers': outliers.tolist(),
        'outlier_bounds': (lower_fence, upper_fence),
        'outlier_count': len(outliers)
    })
    
    return basic_stats

def performance_comparison():
    """Compare performance between manual and optimized implementations"""
    
    # Generate large dataset for performance testing
    np.random.seed(42)
    large_dataset = np.random.normal(100, 15, 100000)
    
    print("Performance Comparison (100,000 data points):")
    print("=" * 50)
    
    # Manual implementation timing
    start_time = time.time()
    manual_stats = comprehensive_manual_statistics(large_dataset)
    manual_time = time.time() - start_time
    
    # Optimized implementation timing
    start_time = time.time()
    optimized_stats = optimized_descriptive_statistics(large_dataset)
    optimized_time = time.time() - start_time
    
    print(f"Manual implementation: {manual_time:.4f} seconds")
    print(f"Optimized implementation: {optimized_time:.4f} seconds")
    print(f"Speedup: {manual_time/optimized_time:.1f}x faster")
    
    # Memory usage comparison
    import sys
    manual_memory = sys.getsizeof(manual_stats)
    optimized_memory = sys.getsizeof(optimized_stats)
    
    print(f"\nMemory usage:")
    print(f"Manual results: {manual_memory} bytes")
    print(f"Optimized results: {optimized_memory} bytes")
    
    return manual_time, optimized_time

performance_comparison()
```

</CodeFold>

## Method 3: Streaming/Online Statistics

**Memory efficient for large datasets, real-time updates, constant space complexity**

<CodeFold>

```python
class StreamingStatistics:
    """Calculate descriptive statistics for streaming data with constant memory"""
    
    def __init__(self):
        self.reset()
    
    def reset(self):
        """Reset all statistics"""
        self.n = 0
        self.sum = 0
        self.sum_squares = 0
        self.min_val = float('inf')
        self.max_val = float('-inf')
        
        # For running variance (Welford's algorithm)
        self.mean = 0
        self.m2 = 0  # sum of squares of deviations
        
        # For approximate quantiles (reservoir sampling)
        self.sorted_sample = []
        self.sample_size = 1000  # Maximum sample size for quantiles
    
    def update(self, value):
        """Add a new value and update statistics in O(1) time"""
        value = float(value)
        self.n += 1
        
        # Update basic statistics
        self.sum += value
        self.sum_squares += value * value
        self.min_val = min(self.min_val, value)
        self.max_val = max(self.max_val, value)
        
        # Update running mean and variance (Welford's algorithm)
        delta = value - self.mean
        self.mean += delta / self.n
        delta2 = value - self.mean
        self.m2 += delta * delta2
        
        # Maintain representative sample for quantile estimation
        if len(self.sorted_sample) < self.sample_size:
            self.sorted_sample.append(value)
            self.sorted_sample.sort()
        else:
            # Reservoir sampling: replace random element
            import random
            if random.random() < self.sample_size / self.n:
                replace_idx = random.randint(0, self.sample_size - 1)
                self.sorted_sample[replace_idx] = value
                self.sorted_sample.sort()
    
    def get_statistics(self):
        """Get current statistics"""
        if self.n == 0:
            return {}
        
        variance = self.m2 / (self.n - 1) if self.n > 1 else 0
        std_dev = math.sqrt(variance)
        
        # Approximate quantiles from sample
        if self.sorted_sample:
            sample_array = np.array(self.sorted_sample)
            q1 = np.percentile(sample_array, 25)
            median = np.percentile(sample_array, 50)
            q3 = np.percentile(sample_array, 75)
        else:
            q1 = median = q3 = self.mean
        
        return {
            'count': self.n,
            'mean': self.mean,
            'variance': variance,
            'std_deviation': std_dev,
            'min': self.min_val,
            'max': self.max_val,
            'range': self.max_val - self.min_val,
            'median_approx': median,
            'q1_approx': q1,
            'q3_approx': q3,
            'iqr_approx': q3 - q1
        }
    
    def merge(self, other):
        """Merge statistics from another StreamingStatistics instance"""
        if other.n == 0:
            return
        
        if self.n == 0:
            self.__dict__.update(other.__dict__)
            return
        
        # Combine counts and basic stats
        combined_n = self.n + other.n
        combined_mean = (self.mean * self.n + other.mean * other.n) / combined_n
        
        # Combine variance using parallel algorithm
        delta = other.mean - self.mean
        combined_m2 = self.m2 + other.m2 + delta**2 * self.n * other.n / combined_n
        
        # Update attributes
        self.n = combined_n
        self.mean = combined_mean
        self.m2 = combined_m2
        self.min_val = min(self.min_val, other.min_val)
        self.max_val = max(self.max_val, other.max_val)
        
        # Merge samples (simple approach)
        combined_sample = self.sorted_sample + other.sorted_sample
        if len(combined_sample) > self.sample_size:
            # Randomly subsample
            import random
            random.shuffle(combined_sample)
            combined_sample = combined_sample[:self.sample_size]
        
        self.sorted_sample = sorted(combined_sample)

def streaming_statistics_demo():
    """Demonstrate streaming statistics with simulated data stream"""
    
    print("Streaming Statistics Demo:")
    print("=" * 30)
    
    # Simulate streaming data
    np.random.seed(42)
    stream = StreamingStatistics()
    
    # Process data in chunks to simulate streaming
    chunk_sizes = [100, 500, 1000, 5000, 10000]
    
    for chunk_size in chunk_sizes:
        # Generate and process new data
        new_data = np.random.normal(50, 10, chunk_size)
        for value in new_data:
            stream.update(value)
        
        stats = stream.get_statistics()
        print(f"\nAfter {stats['count']:,} values:")
        print(f"  Mean: {stats['mean']:.2f}")
        print(f"  Std Dev: {stats['std_deviation']:.2f}")
        print(f"  Range: {stats['min']:.1f} - {stats['max']:.1f}")
        print(f"  Median (approx): {stats['median_approx']:.2f}")
    
    return stream

streaming_demo = streaming_statistics_demo()
```

</CodeFold>

## Robust Statistics for Real-World Data

Robust statistics are less sensitive to outliers and provide more reliable measures for real-world data:

<CodeFold>

```python
def demonstrate_robust_vs_traditional():
    """Show the difference between robust and traditional statistics"""
    
    print("Robust vs Traditional Statistics:")
    print("=" * 40)
    
    # Clean dataset
    clean_data = [12, 14, 15, 16, 17, 18, 19, 20, 21, 22]
    
    # Same dataset with outliers
    outlier_data = clean_data + [100, 150]  # Add extreme outliers
    
    datasets = {
        'Clean Data': clean_data,
        'Data with Outliers': outlier_data
    }
    
    for name, data in datasets.items():
        data_array = np.array(data)
        
        print(f"\n{name}: {data}")
        
        # Traditional statistics
        trad_mean = np.mean(data_array)
        trad_std = np.std(data_array, ddof=1)
        
        # Robust statistics
        robust_median = np.median(data_array)
        robust_mad = np.median(np.abs(data_array - robust_median))  # Median Absolute Deviation
        robust_iqr = np.percentile(data_array, 75) - np.percentile(data_array, 25)
        
        # Trimmed mean (remove top and bottom 10%)
        trim_percent = 0.1
        trimmed_mean = stats.trim_mean(data_array, trim_percent)
        
        print(f"Traditional - Mean: {trad_mean:.1f}, Std Dev: {trad_std:.1f}")
        print(f"Robust - Median: {robust_median:.1f}, MAD: {robust_mad:.1f}, IQR: {robust_iqr:.1f}")
        print(f"Trimmed Mean (10%): {trimmed_mean:.1f}")
        
        # Show impact of outliers
        if 'Outliers' in name:
            clean_mean = np.mean(clean_data)
            clean_median = np.median(clean_data)
            
            mean_change = abs(trad_mean - clean_mean)
            median_change = abs(robust_median - clean_median)
            
            print(f"Impact of outliers:")
            print(f"  Mean changed by: {mean_change:.1f}")
            print(f"  Median changed by: {median_change:.1f}")

demonstrate_robust_vs_traditional()
```

</CodeFold>

## Choosing the Right Method

### Use Manual Implementation When:
- Learning statistical concepts
- Need custom statistical measures
- Working with small datasets
- Implementing embedded systems with constraints

### Use NumPy/SciPy When:
- Working with medium to large datasets
- Need comprehensive statistical functions
- Performance is important but memory isn't constrained
- Building general-purpose data analysis tools

### Use Streaming Methods When:
- Processing very large datasets
- Memory is constrained
- Need real-time statistics
- Data arrives continuously
- Distributed computing scenarios

## Performance Considerations

### Time Complexity Comparison:
- **Basic statistics**: O(n) for all methods
- **Sorting-based (median, quartiles)**: O(n log n) manual, O(n) optimized
- **Streaming updates**: O(1) per new value

### Memory Complexity:
- **Manual/NumPy**: O(n) - stores entire dataset
- **Streaming**: O(1) - constant memory regardless of data size

### When to Choose Each:
1. **Small datasets (< 1K)**: Any method works fine
2. **Medium datasets (1K - 1M)**: NumPy/SciPy recommended
3. **Large datasets (> 1M)**: Consider streaming or chunked processing
4. **Real-time applications**: Streaming methods essential

## Navigation

- **Next**: [Visualization & Interpretation →](./visualization.md)
- **Previous**: [← Fundamentals](./basics.md)
- **Back**: [← Overview](./index.md)

---

*Ready to learn about data visualization? Continue with [visualization and interpretation techniques](./visualization.md).*
