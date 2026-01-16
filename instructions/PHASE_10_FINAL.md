# Phase 10: Statistics Foundation — Final Plan

## Overview

**Goals**: 
1. Introduce descriptive statistics with interactive data exploration
2. Build StatisticsCalculator widget with histogram and box plot visualizations
3. Connect statistics to programming applications (data science, ML preprocessing)

**Philosophy Alignment**: Statistics is fundamental to data science and machine learning. Understanding measures of central tendency, spread, and distribution prepares programmers for data preprocessing, feature engineering, and model evaluation. The interactive calculator makes abstract concepts tangible.

**Estimated Total Effort**: 20-26 hours

---

## Confirmed Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| D-080 | Both histogram and box plot visualizations | Different purposes; commonly used together in data analysis |
| D-081 | Presets + custom data input | Follows established pattern; presets for exploration, custom for real use |
| D-082 | No data transformations (MVP) | Keep Phase 10 focused; transformations can be Phase 11+ enhancement |
| D-083 | Outliers shown both visually and as list | Most educational; clear visual + explicit values |
| D-084 | Python code in content page only | Cleaner widget; code examples belong with explanatory content |
| D-085 | User-adjustable histogram bin slider (3-20) | Enables exploration of how bin count affects perception |

---

## Increment Structure

| Increment | Focus | Effort |
|-----------|-------|--------|
| 10A | Statistics Math Utilities | 3-4 hours |
| 10B | StatisticsCalculator Core Widget | 5-6 hours |
| 10C | Histogram Visualization | 3-4 hours |
| 10D | Box Plot Visualization | 3-4 hours |
| 10E | Statistics Content Page | 4-5 hours |
| 10F | E2E Tests & Polish | 2-3 hours |

---

## Increment 10A: Statistics Math Utilities

**Effort**: 3-4 hours

### Objectives
1. Create comprehensive statistics utility functions
2. Handle edge cases (empty arrays, single values, ties in mode)
3. Full unit test coverage

### File: `src/utils/math/statistics.ts`

#### Types

```typescript
export interface DescriptiveStats {
  count: number
  sum: number
  mean: number
  median: number
  mode: number[]           // Can have multiple modes
  min: number
  max: number
  range: number
}

export interface SpreadStats {
  variance: number         // Population variance
  sampleVariance: number   // Sample variance (n-1)
  stdDev: number           // Population standard deviation
  sampleStdDev: number     // Sample standard deviation
}

export interface Quartiles {
  q1: number               // 25th percentile
  q2: number               // 50th percentile (median)
  q3: number               // 75th percentile
  iqr: number              // Interquartile range (Q3 - Q1)
  min: number              // Minimum (for box plot)
  max: number              // Maximum (for box plot)
}

export interface OutlierAnalysis {
  outliers: number[]
  lowerFence: number       // Q1 - 1.5 * IQR
  upperFence: number       // Q3 + 1.5 * IQR
  hasOutliers: boolean
}

export interface SkewnessAnalysis {
  skewness: number
  interpretation: 'left-skewed' | 'symmetric' | 'right-skewed'
  description: string
}

export interface HistogramBin {
  binStart: number
  binEnd: number
  count: number
  frequency: number        // count / total
  label: string            // e.g., "10-20"
}

export interface HistogramData {
  bins: HistogramBin[]
  binWidth: number
  totalCount: number
}

export interface FullStatistics {
  descriptive: DescriptiveStats
  spread: SpreadStats
  quartiles: Quartiles
  outliers: OutlierAnalysis
  skewness: SkewnessAnalysis
}

export interface DatasetPreset {
  id: string
  name: string
  description: string
  data: number[]
  unit?: string            // e.g., "cm", "ms", "$K"
}
```

#### Functions to Implement

```typescript
// Basic descriptive statistics
export function calculateSum(data: number[]): number
export function calculateMean(data: number[]): number
export function calculateMedian(data: number[]): number
export function calculateMode(data: number[]): number[]  // Returns array (can be multimodal)
export function calculateRange(data: number[]): { min: number; max: number; range: number }

// Spread statistics
export function calculateVariance(data: number[], sample?: boolean): number
export function calculateStdDev(data: number[], sample?: boolean): number

// Quartiles and IQR
export function calculateQuartiles(data: number[]): Quartiles
export function calculatePercentile(data: number[], percentile: number): number

// Outlier detection (IQR method)
export function detectOutliers(data: number[], quartiles?: Quartiles): OutlierAnalysis

// Skewness
export function calculateSkewness(data: number[]): SkewnessAnalysis

// Histogram generation
export function generateHistogramBins(data: number[], binCount: number): HistogramData
export function suggestBinCount(data: number[]): number  // Sturges' rule

// Combined analysis
export function calculateFullStatistics(data: number[]): FullStatistics

// Data validation
export function validateStatisticsInput(data: unknown[]): { 
  valid: boolean
  data: number[]
  errors: string[]
}

// Parsing
export function parseDataInput(input: string): {
  success: boolean
  data: number[]
  errors: string[]
}
```

#### Preset Datasets

```typescript
export const datasetPresets: DatasetPreset[] = [
  {
    id: 'test-scores',
    name: 'Test Scores',
    description: 'Student test scores (0-100 scale)',
    data: [85, 92, 78, 96, 88, 73, 91, 84, 79, 95, 87, 82, 90, 76, 94],
    unit: 'points'
  },
  {
    id: 'heights',
    name: 'Heights',
    description: 'Adult heights in centimeters',
    data: [165, 172, 158, 180, 175, 162, 170, 168, 177, 160, 173, 169],
    unit: 'cm'
  },
  {
    id: 'salaries',
    name: 'Salaries',
    description: 'Annual salaries in thousands (includes outlier)',
    data: [45, 52, 48, 75, 62, 55, 120, 58, 51, 49, 53, 47],
    unit: '$K'
  },
  {
    id: 'reaction-times',
    name: 'Reaction Times',
    description: 'Human reaction time measurements',
    data: [245, 312, 278, 256, 289, 301, 267, 284, 259, 295],
    unit: 'ms'
  },
  {
    id: 'symmetric',
    name: 'Symmetric',
    description: 'Data with minimal skew (educational)',
    data: [10, 12, 14, 15, 15, 16, 16, 16, 17, 17, 18, 20],
    unit: ''
  }
]
```

#### Edge Cases to Handle

1. **Empty array**: Return meaningful error or default values
2. **Single value**: Mean = value, variance = 0, no quartiles meaningful
3. **Two values**: Limited quartile calculation
4. **All same values**: Variance = 0, mode = that value
5. **Multiple modes**: Return all modes (multimodal)
6. **No mode**: All values appear once (return empty array)
7. **Non-numeric input**: Validation and error messages
8. **Negative numbers**: Valid for statistics
9. **Very large/small numbers**: Handle precision

### Test File: `src/utils/math/statistics.test.ts`

Comprehensive tests for:
- Each function with normal inputs
- Edge cases listed above
- Known statistical values (verify calculations against NumPy/pandas)
- Histogram bin boundaries
- Outlier detection accuracy
- Skewness calculation and interpretation

### Success Criteria
- [ ] All functions implemented with TypeScript types
- [ ] 100% test coverage on utility functions
- [ ] Edge cases handled gracefully
- [ ] Preset datasets defined and exported
- [ ] Input parsing handles various formats (comma, space, newline separated)

---

## Increment 10B: StatisticsCalculator Core Widget

**Effort**: 5-6 hours

### Objectives
1. Build main widget with data input and statistics display
2. Implement preset selection and custom input (D-081)
3. Create composable for state management
4. URL state sync for shareable links

### Component: `src/components/widgets/StatisticsCalculator/StatisticsCalculator.vue`

#### Layout Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Statistics Calculator                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Dataset: [Test Scores] [Heights] [Salaries] [Reaction Times] [Symmetric]   │
│           [Custom]                                                           │
│                                                                              │
│  ┌─ Custom Data Input (shown when Custom selected) ─────────────────────┐   │
│  │  Enter values separated by commas, spaces, or newlines:               │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │   │
│  │  │ 85, 92, 78, 96, 88, 73, 91, 84, 79, 95                          │  │   │
│  │  └─────────────────────────────────────────────────────────────────┘  │   │
│  │  [Apply] ✓ 15 valid numbers                                          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ Central Tendency ────────────┐  ┌─ Spread ─────────────────────────┐   │
│  │ Count:    15                  │  │ Variance:     47.84              │   │
│  │ Sum:      1,290               │  │ Std Dev:      6.92               │   │
│  │ Mean:     86.00               │  │ Range:        23                 │   │
│  │ Median:   87                  │  │ IQR:          13                 │   │
│  │ Mode:     — (no mode)         │  │                                  │   │
│  │ Min:      73                  │  │ Skewness:     -0.12              │   │
│  │ Max:      96                  │  │ (approximately symmetric)        │   │
│  └────────────────────────────────┘  └──────────────────────────────────┘   │
│                                                                              │
│  ┌─ Quartiles ───────────────────┐  ┌─ Outliers ───────────────────────┐   │
│  │ Q1 (25%):   79                │  │ Lower fence: 59.5                │   │
│  │ Q2 (50%):   87                │  │ Upper fence: 105.5               │   │
│  │ Q3 (75%):   92                │  │                                  │   │
│  │ IQR:        13                │  │ Outliers: None                   │   │
│  └────────────────────────────────┘  └──────────────────────────────────┘   │
│                                                                              │
│  [Histogram - see 10C]                                                       │
│  [Box Plot - see 10D]                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Component Structure

```
StatisticsCalculator/
├── StatisticsCalculator.vue    (main orchestrator)
├── DatasetSelector.vue         (preset buttons + custom toggle)
├── CustomDataInput.vue         (text area + validation + apply)
├── StatisticsPanel.vue         (count, mean, median, mode, min, max)
├── SpreadPanel.vue             (variance, std dev, range, skewness)
├── QuartilesPanel.vue          (Q1, Q2, Q3, IQR)
├── OutliersPanel.vue           (fences + outlier list per D-083)
├── HistogramChart.vue          (see 10C)
├── BoxPlotChart.vue            (see 10D)
└── index.ts                    (exports)
```

### Composable: `src/composables/useStatistics.ts`

```typescript
export interface UseStatisticsOptions {
  initialDataset?: string      // Preset ID or 'custom'
  initialData?: number[]       // For custom data
  initialBinCount?: number     // Default: 10
  syncUrl?: boolean            // URL state sync
}

export function useStatistics(options: UseStatisticsOptions = {}) {
  // State
  const selectedDataset = ref<string>(options.initialDataset ?? 'test-scores')
  const customData = ref<number[]>(options.initialData ?? [])
  const customInput = ref<string>('')
  const binCount = ref<number>(options.initialBinCount ?? 10)
  
  // Computed: Current active data
  const currentData = computed<number[]>(() => {
    if (selectedDataset.value === 'custom') {
      return customData.value
    }
    const preset = datasetPresets.find(p => p.id === selectedDataset.value)
    return preset?.data ?? []
  })
  
  // Computed: Full statistics (null if insufficient data)
  const statistics = computed<FullStatistics | null>(() => {
    if (currentData.value.length < 2) return null
    return calculateFullStatistics(currentData.value)
  })
  
  // Computed: Histogram data
  const histogramData = computed<HistogramData | null>(() => {
    if (currentData.value.length < 2) return null
    return generateHistogramBins(currentData.value, binCount.value)
  })
  
  // Computed: Current preset info
  const currentPreset = computed<DatasetPreset | null>(() => {
    if (selectedDataset.value === 'custom') return null
    return datasetPresets.find(p => p.id === selectedDataset.value) ?? null
  })
  
  // Computed: Is custom mode
  const isCustomMode = computed(() => selectedDataset.value === 'custom')
  
  // Computed: Data validation status
  const hasValidData = computed(() => currentData.value.length >= 2)
  
  // Methods
  function selectDataset(id: string) {
    selectedDataset.value = id
  }
  
  function applyCustomData(input: string) {
    const result = parseDataInput(input)
    if (result.success && result.data.length >= 2) {
      customData.value = result.data
      customInput.value = input
    }
    return result
  }
  
  function setBinCount(count: number) {
    binCount.value = Math.max(3, Math.min(20, count))
  }
  
  // URL sync (if enabled)
  if (options.syncUrl) {
    // Sync selectedDataset and binCount to URL
    // Custom data not encoded (too long for URL)
    // Pattern: ?dataset=test-scores&bins=10
  }
  
  return {
    // State
    selectedDataset,
    customData,
    customInput,
    binCount,
    // Computed
    currentData,
    statistics,
    histogramData,
    currentPreset,
    isCustomMode,
    hasValidData,
    // Methods
    selectDataset,
    applyCustomData,
    setBinCount,
  }
}
```

#### URL State Sync

```
?dataset=test-scores&bins=10
?dataset=salaries&bins=8
?dataset=custom&bins=10  (custom data not encoded - too long)
```

#### Data-testid Attributes

```
data-testid="dataset-selector"
data-testid="dataset-{id}"              (test-scores, heights, salaries, reaction-times, symmetric)
data-testid="dataset-custom"
data-testid="custom-data-input"
data-testid="custom-data-apply"
data-testid="data-validation-message"
data-testid="stat-count"
data-testid="stat-sum"
data-testid="stat-mean"
data-testid="stat-median"
data-testid="stat-mode"
data-testid="stat-min"
data-testid="stat-max"
data-testid="stat-range"
data-testid="stat-variance"
data-testid="stat-stddev"
data-testid="stat-q1"
data-testid="stat-q2"
data-testid="stat-q3"
data-testid="stat-iqr"
data-testid="stat-skewness"
data-testid="skewness-interpretation"
data-testid="outlier-lower-fence"
data-testid="outlier-upper-fence"
data-testid="outliers-list"
data-testid="outliers-count"
data-testid="bin-count-slider"
data-testid="bin-count-value"
```

### Success Criteria
- [ ] Preset selection works (5 presets)
- [ ] Custom data input parses correctly
- [ ] Validation messages display for invalid input
- [ ] All statistics calculate and display correctly
- [ ] Statistics update when data changes
- [ ] URL state sync works (dataset and bin count)
- [ ] Responsive layout (stats panels stack on mobile)
- [ ] Accessible (labels, keyboard navigation)

---

## Increment 10C: Histogram Visualization

**Effort**: 3-4 hours

### Objectives
1. Build SVG histogram with adjustable bin count (D-085)
2. Show frequency distribution clearly
3. Hover interaction with bin details

### Component: `HistogramChart.vue`

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Histogram                                              Bins: [====●====] 10 │
├─────────────────────────────────────────────────────────────────────────────┤
│  Frequency                                                                   │
│     5 ┤                                                                      │
│       │         ┌───┐                                                        │
│     4 ┤         │   │                                                        │
│       │    ┌───┐│   │┌───┐                                                   │
│     3 ┤    │   ││   ││   │                                                   │
│       │    │   ││   ││   │┌───┐                                              │
│     2 ┤┌───┤   ││   ││   ││   │                                              │
│       ││   │   ││   ││   ││   │┌───┐                                         │
│     1 ┤│   │   ││   ││   ││   ││   │                                         │
│       ││   │   ││   ││   ││   ││   │                                         │
│     0 ┴┴───┴───┴┴───┴┴───┴┴───┴┴───┴────────────────────                     │
│        73   78   83   88   93   98                                           │
│                      Value                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Props

```typescript
interface Props {
  histogramData: HistogramData
  width?: number       // Default: responsive (100% of container)
  height?: number      // Default: 250
}
```

#### Emits

```typescript
const emit = defineEmits<{
  'update:binCount': [count: number]
}>()
```

#### Features

1. **Bin count slider**: 3-20 bins (D-085), updates visualization in real-time
2. **Bar rendering**: SVG rectangles with proper scaling
3. **Axis labels**: X-axis (value ranges), Y-axis (frequency/count)
4. **Hover interaction**: Tooltip showing exact count and range for each bar
5. **Responsive**: Scales to container width

#### Implementation Notes

- Use SVG with viewBox for responsive scaling
- Computed dimensions based on container
- Smooth CSS transitions when bin count changes
- Y-axis auto-scales to max frequency
- X-axis shows bin boundary values
- Consider reusing patterns from CoordinateSystem if applicable

#### Data-testid Attributes

```
data-testid="histogram-chart"
data-testid="histogram-bar-{index}"
data-testid="histogram-tooltip"
data-testid="histogram-x-axis"
data-testid="histogram-y-axis"
```

### Success Criteria
- [ ] Histogram renders with correct bar heights
- [ ] Bin count slider adjusts visualization (3-20 range)
- [ ] Axis labels are readable
- [ ] Hover shows bin details (count, range)
- [ ] Responsive to container width
- [ ] Accessible (aria-labels for bars)

---

## Increment 10D: Box Plot Visualization

**Effort**: 3-4 hours

### Objectives
1. Build SVG box plot showing quartiles and outliers
2. Clear visual representation of data spread
3. Outliers displayed as individual points (D-083)

### Component: `BoxPlotChart.vue`

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Box Plot                                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                     Q1        Median       Q3                                │
│                     ↓           ↓           ↓                                │
│         ○    ├──────┬───────────┬───────────┬──────┤                        │
│              │      │███████████│███████████│      │                        │
│         ↑    ├──────┴───────────┴───────────┴──────┤                        │
│      outlier │                                     │                        │
│              min                                  max                        │
│              (whisker)                       (whisker)                       │
│                                                                              │
│   ────┬────────┬────────┬────────┬────────┬────────┬────                    │
│       45       55       65       75       85       95                        │
│                                                                              │
│   ○ Outliers    ├──┤ Whiskers (min/max within fences)    █ IQR (Q1-Q3)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Props

```typescript
interface Props {
  quartiles: Quartiles
  outliers: OutlierAnalysis
  width?: number       // Default: responsive
  height?: number      // Default: 120
}
```

#### Features

1. **Box**: Rectangle from Q1 to Q3 (the IQR)
2. **Median line**: Vertical line within the box at Q2
3. **Whiskers**: Lines extending to min/max values within fences
4. **Outliers**: Individual circles beyond the fences (D-083)
5. **Labels**: Q1, Median, Q3 values displayed above/below
6. **Axis**: Value scale below the plot
7. **Legend**: Simple legend explaining symbols

#### Implementation Notes

- Horizontal orientation (standard for single dataset)
- Scale values to fit container width with padding
- Outlier points positioned at their actual x-values
- Different colors: box fill, median line, whiskers, outliers
- Whiskers extend to actual min/max if within fences, otherwise to fence values

#### Color Scheme

```typescript
const colors = {
  box: 'fill-emerald-200 dark:fill-emerald-800',
  boxStroke: 'stroke-emerald-600 dark:stroke-emerald-400',
  median: 'stroke-emerald-800 dark:stroke-emerald-200',
  whisker: 'stroke-gray-600 dark:stroke-gray-400',
  outlier: 'fill-red-500 dark:fill-red-400',
}
```

#### Data-testid Attributes

```
data-testid="boxplot-chart"
data-testid="boxplot-box"
data-testid="boxplot-median"
data-testid="boxplot-whisker-left"
data-testid="boxplot-whisker-right"
data-testid="boxplot-outlier-{index}"
data-testid="boxplot-label-q1"
data-testid="boxplot-label-median"
data-testid="boxplot-label-q3"
data-testid="boxplot-axis"
```

### Success Criteria
- [ ] Box plot renders with correct proportions
- [ ] Median line positioned correctly within box
- [ ] Whiskers extend to correct values (min/max within fences)
- [ ] Outliers displayed as distinct points
- [ ] Labels are readable and positioned well
- [ ] Responsive to container width
- [ ] Accessible (aria-labels for components)
- [ ] Legend explains visual elements

---

## Increment 10E: Statistics Content Page

**Effort**: 4-5 hours

### Objectives
1. Create StatisticsIndexView as section landing page
2. Create DescriptiveStatsView with comprehensive content
3. Integrate StatisticsCalculator widget
4. Python code examples throughout (D-084)

### Route Setup

Add to `src/router/index.ts`:

```typescript
{
  path: '/statistics',
  name: 'statistics-index',
  component: () => import('@/views/statistics/StatisticsIndexView.vue'),
  meta: {
    title: 'Statistics',
    section: 'statistics'
  }
},
{
  path: '/statistics/descriptive',
  name: 'descriptive-stats',
  component: () => import('@/views/statistics/DescriptiveStatsView.vue'),
  meta: {
    title: 'Descriptive Statistics',
    section: 'statistics'
  }
}
```

### Navigation Update

Add Statistics section to `src/data/navigation.ts`:

```typescript
{
  title: 'Statistics',
  basePath: '/statistics',
  items: [
    { title: 'Overview', path: '/statistics' },
    { title: 'Descriptive Statistics', path: '/statistics/descriptive' }
  ]
}
```

### StatisticsIndexView.vue

Section landing page with:
- Brief introduction to statistics for programmers
- Why statistics matters: data science, ML, analytics
- The three pillars: Central tendency, Spread, Distribution shape
- Links to subtopics (Descriptive Statistics)
- Real-world applications preview

### DescriptiveStatsView.vue Content Structure

#### Section 1: What are Descriptive Statistics? (NOT collapsible)
- Definition: Summarizing and describing data characteristics
- Three pillars: Central tendency, Spread, Distribution shape
- Why programmers need this: Data preprocessing, feature engineering, outlier detection
- Brief overview of what you'll learn

#### Section 2: Interactive Calculator (NOT collapsible)
- Full StatisticsCalculator widget with URL sync
- Brief usage instructions

#### Section 3: Measures of Central Tendency (collapsible, default closed)
- **Mean**: Sum divided by count
  - Sensitive to outliers
  - Use when: data is symmetric, no extreme values
- **Median**: Middle value when sorted
  - Robust to outliers
  - Use when: data is skewed or has outliers
- **Mode**: Most frequent value
  - Can be multimodal (multiple modes)
  - Use when: categorical data or identifying common values

```python
import numpy as np
from collections import Counter

data = [85, 92, 78, 96, 88, 73, 91, 84, 79, 95]

# Mean
mean = np.mean(data)  # 86.1

# Median
median = np.median(data)  # 86.5

# Mode (most common value)
counter = Counter(data)
mode = counter.most_common(1)[0][0] if counter else None

print(f"Mean: {mean:.1f}")
print(f"Median: {median}")
print(f"Mode: {mode}")
```

#### Section 4: Measures of Spread (collapsible, default closed)
- **Range**: Max - Min (simplest, but sensitive to outliers)
- **Variance**: Average squared deviation from mean
  - Population vs Sample variance (n vs n-1)
- **Standard Deviation**: Square root of variance
  - Same units as original data
  - ~68% of data within 1 std dev (normal distribution)
- **IQR**: Q3 - Q1 (robust measure of spread)

```python
import numpy as np

data = [85, 92, 78, 96, 88, 73, 91, 84, 79, 95]

# Range
data_range = np.max(data) - np.min(data)  # 23

# Variance and Standard Deviation
variance = np.var(data)           # Population variance
sample_var = np.var(data, ddof=1) # Sample variance (n-1)
std_dev = np.std(data)            # Population std dev

# IQR
q1, q3 = np.percentile(data, [25, 75])
iqr = q3 - q1

print(f"Range: {data_range}")
print(f"Std Dev: {std_dev:.2f}")
print(f"IQR: {iqr}")
```

#### Section 5: Quartiles and Percentiles (collapsible, default closed)
- Q1, Q2 (median), Q3 explanation
- What percentiles mean
- How to interpret: "75th percentile means 75% of values are below"
- Connection to box plots

```python
import numpy as np

data = [85, 92, 78, 96, 88, 73, 91, 84, 79, 95]

# Quartiles
q1 = np.percentile(data, 25)   # 25th percentile
q2 = np.percentile(data, 50)   # 50th percentile (median)
q3 = np.percentile(data, 75)   # 75th percentile

# Any percentile
p90 = np.percentile(data, 90)  # 90th percentile

print(f"Q1: {q1}, Q2 (Median): {q2}, Q3: {q3}")
print(f"90th percentile: {p90}")
```

#### Section 6: Outlier Detection (collapsible, default closed)
- What are outliers and why they matter
- IQR method: values below Q1 - 1.5×IQR or above Q3 + 1.5×IQR
- Fences: lower fence and upper fence
- Handling strategies: investigate, remove, cap, transform
- Real example: Salary data with $120K outlier

```python
import numpy as np

def detect_outliers_iqr(data):
    """Detect outliers using the IQR method."""
    q1 = np.percentile(data, 25)
    q3 = np.percentile(data, 75)
    iqr = q3 - q1
    
    lower_fence = q1 - 1.5 * iqr
    upper_fence = q3 + 1.5 * iqr
    
    outliers = [x for x in data if x < lower_fence or x > upper_fence]
    return outliers, lower_fence, upper_fence

# Salary data (includes outlier at 120)
salaries = [45, 52, 48, 75, 62, 55, 120, 58, 51, 49, 53, 47]
outliers, lower, upper = detect_outliers_iqr(salaries)

print(f"Fences: [{lower:.1f}, {upper:.1f}]")
print(f"Outliers: {outliers}")  # [120]
```

#### Section 7: Distribution Shape and Skewness (collapsible, default closed)
- What skewness means
- Left-skewed (negative): tail extends left, mean < median
- Symmetric: mean ≈ median
- Right-skewed (positive): tail extends right, mean > median
- Real-world examples:
  - Income distribution: right-skewed
  - Heights: approximately symmetric
  - Test scores (with ceiling): often left-skewed

#### Section 8: Understanding Histograms (collapsible, default closed)
- What histograms show
- How bin count affects interpretation
- Reading distribution shape from histograms
- Common patterns: normal, uniform, bimodal

#### Section 9: Understanding Box Plots (collapsible, default closed)
- Box plot anatomy (box, median, whiskers, outliers)
- What you can read from a box plot
- Comparing distributions with multiple box plots
- When to use histogram vs box plot

#### Section 10: Programmer Applications (collapsible, default closed)
- **Data preprocessing**: Identifying and handling outliers before ML
- **Feature engineering**: Knowing when to normalize/standardize
- **Exploratory Data Analysis (EDA)**: First steps with any dataset
- **A/B testing**: Comparing distributions between groups
- **Model evaluation**: Understanding prediction distributions

```python
from sklearn.preprocessing import StandardScaler
import numpy as np

# Z-score normalization (standardization)
data = np.array([[85], [92], [78], [96], [88]])
scaler = StandardScaler()
normalized = scaler.fit_transform(data)

# Now mean ≈ 0, std ≈ 1
print(f"Original mean: {data.mean():.1f}, std: {data.std():.2f}")
print(f"Normalized mean: {normalized.mean():.4f}, std: {normalized.std():.4f}")
```

#### Section 11: Quick Reference (NOT collapsible)
- Summary table of all measures
- When to use mean vs median
- Common formulas
- Common pitfalls (confusing population vs sample variance, etc.)

### Success Criteria
- [ ] Index page renders with overview content
- [ ] Descriptive stats page renders with all sections
- [ ] Widget integrated and fully functional
- [ ] Code examples syntax-highlighted
- [ ] Collapsible sections work correctly
- [ ] Navigation sidebar updated
- [ ] Breadcrumbs work
- [ ] Mobile responsive

---

## Increment 10F: E2E Tests & Polish

**Effort**: 2-3 hours

### Objectives
1. Write E2E tests for StatisticsCalculator
2. Accessibility audit for new pages
3. Final polish and documentation updates

### E2E Tests

Create `e2e/widgets/statistics-calculator.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('StatisticsCalculator @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/statistics/descriptive')
  })

  test('displays default dataset (test-scores)', async ({ page }) => {
    await expect(page.locator('[data-testid="stat-count"]')).toContainText('15')
    await expect(page.locator('[data-testid="stat-mean"]')).toBeVisible()
  })

  test('switching dataset updates statistics', async ({ page }) => {
    await page.locator('[data-testid="dataset-salaries"]').click()
    await expect(page.locator('[data-testid="stat-count"]')).toContainText('12')
    // Salaries dataset has outlier at 120
    await expect(page.locator('[data-testid="outliers-list"]')).toContainText('120')
  })

  test('custom data input works', async ({ page }) => {
    await page.locator('[data-testid="dataset-custom"]').click()
    await page.locator('[data-testid="custom-data-input"]').fill('1, 2, 3, 4, 5')
    await page.locator('[data-testid="custom-data-apply"]').click()
    
    await expect(page.locator('[data-testid="stat-mean"]')).toContainText('3')
    await expect(page.locator('[data-testid="stat-median"]')).toContainText('3')
  })

  test('invalid custom data shows error', async ({ page }) => {
    await page.locator('[data-testid="dataset-custom"]').click()
    await page.locator('[data-testid="custom-data-input"]').fill('abc, def')
    await page.locator('[data-testid="custom-data-apply"]').click()
    
    await expect(page.locator('[data-testid="data-validation-message"]')).toBeVisible()
  })

  test('bin count slider updates histogram', async ({ page }) => {
    const slider = page.locator('[data-testid="bin-count-slider"]')
    await slider.fill('5')
    await expect(page.locator('[data-testid="bin-count-value"]')).toContainText('5')
  })

  test('box plot shows outliers for salary data', async ({ page }) => {
    await page.locator('[data-testid="dataset-salaries"]').click()
    await expect(page.locator('[data-testid="outliers-list"]')).toContainText('120')
    await expect(page.locator('[data-testid="outliers-count"]')).toContainText('1')
  })

  test('symmetric dataset shows no skew', async ({ page }) => {
    await page.locator('[data-testid="dataset-symmetric"]').click()
    await expect(page.locator('[data-testid="skewness-interpretation"]')).toContainText('symmetric')
  })

  test('URL state sync works', async ({ page }) => {
    await page.locator('[data-testid="dataset-heights"]').click()
    await expect(page).toHaveURL(/dataset=heights/)
    
    // Navigate directly with URL param
    await page.goto('/statistics/descriptive?dataset=salaries')
    await expect(page.locator('[data-testid="stat-count"]')).toContainText('12')
  })

  test('quartiles display correctly', async ({ page }) => {
    await expect(page.locator('[data-testid="stat-q1"]')).toBeVisible()
    await expect(page.locator('[data-testid="stat-q2"]')).toBeVisible()
    await expect(page.locator('[data-testid="stat-q3"]')).toBeVisible()
    await expect(page.locator('[data-testid="stat-iqr"]')).toBeVisible()
  })

  test('histogram chart renders', async ({ page }) => {
    await expect(page.locator('[data-testid="histogram-chart"]')).toBeVisible()
  })

  test('box plot chart renders', async ({ page }) => {
    await expect(page.locator('[data-testid="boxplot-chart"]')).toBeVisible()
  })
})
```

### Accessibility Tests

Add to `e2e/accessibility/audit.spec.ts`:

```typescript
test('statistics index page has no accessibility violations @a11y', async ({ page }) => {
  await page.goto('/statistics')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('descriptive stats page has no accessibility violations @a11y', async ({ page }) => {
  await page.goto('/statistics/descriptive')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

### Documentation Updates

#### Update `docs/ROADMAP.md`
- Mark Phase 10 as complete
- Update document history
- Verify Phase 11 description

#### Update `docs/decisions.md`
Add decisions D-080 through D-085:
- D-080: Both histogram and box plot
- D-081: Presets + custom input
- D-082: No transformations (MVP)
- D-083: Outliers shown visually and as list
- D-084: Python code in content page only
- D-085: User-adjustable bin slider (3-20)

#### Update `docs/current_state.md`
- Add Statistics section
- List StatisticsCalculator features
- Update component and test counts

#### Update `docs/ll_li.md`
Add any lessons learned during implementation

### Final Checklist

Run through all success criteria from previous increments.

### Success Criteria
- [ ] All E2E tests pass
- [ ] Accessibility audit passes for new pages
- [ ] All documentation updated
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Production build succeeds
- [ ] No console errors in browser

---

## Phase 10 Complete Checklist

### Math Utilities (10A)
- [ ] `statistics.ts` implemented with all functions
- [ ] All utility functions have comprehensive tests
- [ ] Edge cases handled gracefully
- [ ] Preset datasets defined and exported

### StatisticsCalculator Widget (10B)
- [ ] Dataset selector works (5 presets + custom)
- [ ] Custom data input parses and validates correctly
- [ ] All statistics panels display correctly
- [ ] Composable manages state properly
- [ ] URL state sync works (dataset, bins)

### Histogram (10C)
- [ ] Histogram renders with correct bar heights
- [ ] Bin count slider works (3-20 range)
- [ ] Axis labels readable
- [ ] Hover shows bin details
- [ ] Responsive sizing

### Box Plot (10D)
- [ ] Box plot renders with correct proportions
- [ ] Median, quartiles positioned correctly
- [ ] Whiskers extend to correct values
- [ ] Outliers displayed as points
- [ ] Labels and legend present

### Content (10E)
- [ ] StatisticsIndexView created
- [ ] DescriptiveStatsView created with all sections
- [ ] Widget integrated
- [ ] Code examples highlighted
- [ ] Navigation updated

### Testing (10F)
- [ ] All E2E tests pass
- [ ] Accessibility audit passes
- [ ] Documentation updated

### Quality Gates
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] Production build succeeds
- [ ] No console errors

---

## Estimated Effort Summary

| Increment | Effort | Cumulative |
|-----------|--------|------------|
| 10A: Statistics Utilities | 3-4 hours | 3-4 hours |
| 10B: StatisticsCalculator Core | 5-6 hours | 8-10 hours |
| 10C: Histogram Visualization | 3-4 hours | 11-14 hours |
| 10D: Box Plot Visualization | 3-4 hours | 14-18 hours |
| 10E: Content Page | 4-5 hours | 18-23 hours |
| 10F: E2E Tests & Polish | 2-3 hours | 20-26 hours |

**Total Estimated Effort: 20-26 hours**

---

## File Creation Summary

### New Files
```
src/utils/math/statistics.ts
src/utils/math/statistics.test.ts
src/composables/useStatistics.ts
src/components/widgets/StatisticsCalculator/
├── StatisticsCalculator.vue
├── DatasetSelector.vue
├── CustomDataInput.vue
├── StatisticsPanel.vue
├── SpreadPanel.vue
├── QuartilesPanel.vue
├── OutliersPanel.vue
├── HistogramChart.vue
├── BoxPlotChart.vue
└── index.ts
src/views/statistics/StatisticsIndexView.vue
src/views/statistics/DescriptiveStatsView.vue
e2e/widgets/statistics-calculator.spec.ts
```

### Modified Files
```
src/router/index.ts
src/data/navigation.ts
docs/ROADMAP.md
docs/current_state.md
docs/decisions.md
docs/ll_li.md
e2e/accessibility/audit.spec.ts
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Histogram scaling issues | Test with various data ranges (small values, large values, negative) |
| Box plot outlier positioning | Validate against known datasets; compare with Python/NumPy output |
| Custom data parsing edge cases | Comprehensive input validation with clear error messages |
| Performance with large datasets | Limit custom input to reasonable size (e.g., 1000 values max) |
| Mobile layout complexity | Test early; use stacked layout for charts on small screens |
| Quartile calculation methods | Document which method is used (there are multiple); match NumPy default |

---

## Post-Phase Review Questions

After Phase 10 completion, evaluate:

1. Is the statistics calculation accurate? Verified against NumPy/pandas?
2. Are the visualizations intuitive for users new to statistics?
3. Is the custom data input UX smooth?
4. Should we add data transformation features in Phase 11?
5. Performance acceptable with larger datasets?
6. Are there requests for additional statistical measures?

---

*This is the finalized Phase 10 plan with all decisions confirmed. Ready for implementation.*
