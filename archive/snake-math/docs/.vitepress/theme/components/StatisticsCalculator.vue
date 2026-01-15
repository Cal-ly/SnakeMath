<!-- StatisticsCalculator.vue 
Component conceptualization:
Create an interactive descriptive statistics explorer where users can:
- Input datasets directly or load sample datasets from different domains
- Calculate and display all major statistics with real-time updates
- Visualize distributions with histograms, box plots, and violin plots
- Compare multiple datasets side-by-side with comparative statistics
- Demonstrate the effect of outliers on different measures interactively
- Show various distribution shapes (normal, skewed, bimodal) and their characteristics
- Interactive quartile and percentile exploration with visual indicators
- Step-by-step calculation breakdowns for educational purposes
- Export statistical summaries and visualizations for further analysis
The component should provide both numerical results and rich visualizations with interpretive guidance. 
-->
<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Interactive Statistics Calculator</h3>
      
      <div class="interactive-card">
        <h4 class="input-group-title">Enter Data:</h4>
        <div class="input-group">
          <label>Manual Input:</label>
          <input 
            type="text" 
            v-model="dataInput" 
            @input="parseData" 
            placeholder="Enter numbers separated by commas (e.g., 1,2,3,4,5)"
            class="data-input-field"
          >
        </div>
        <div class="controls-grid">
          <button @click="loadPreset('grades')" class="preset-btn">Test Scores</button>
          <button @click="loadPreset('heights')" class="preset-btn">Heights (cm)</button>
          <button @click="loadPreset('salaries')" class="preset-btn">Salaries ($k)</button>
          <button @click="generateRandom" class="preset-btn">Random Data</button>
        </div>
      </div>
      
      <div v-if="dataset.length > 0" class="interactive-card">
        <h4 class="input-group-title">Current Dataset ({{ dataset.length }} values):</h4>
        <div class="data-values">{{ dataset.slice(0, 20).join(', ') }}{{ dataset.length > 20 ? '...' : '' }}</div>
      </div>
    </div>
    
    <div v-if="dataset.length > 0" class="statistics-results">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Mean (μ)</div>
          <div class="stat-value">{{ statistics.mean }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Median</div>
          <div class="stat-value">{{ statistics.median }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Mode</div>
          <div class="stat-value">{{ statistics.mode }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Range</div>
          <div class="stat-value">{{ statistics.range }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Standard Deviation (σ)</div>
          <div class="stat-value">{{ statistics.stdDev }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Variance (σ²)</div>
          <div class="stat-value">{{ statistics.variance }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Q1 (25th percentile)</div>
          <div class="stat-value">{{ statistics.q1 }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Q3 (75th percentile)</div>
          <div class="stat-value">{{ statistics.q3 }}</div>
        </div>
      </div>
      
      <div class="visualizations">
        <div class="viz-section">
          <h4>Box Plot</h4>
          <canvas ref="boxPlotCanvas" width="500" height="150"></canvas>
        </div>
        
        <div class="viz-section">
          <h4>Histogram</h4>
          <canvas ref="histogramCanvas" width="500" height="300"></canvas>
          <div class="histogram-controls">
            <label>Bins:</label>
            <input type="range" v-model="histogramBins" min="5" max="20" @input="updateHistogram">
            <span>{{ histogramBins }}</span>
          </div>
        </div>
      </div>
      
      <div class="distribution-analysis">
        <h4>Distribution Analysis</h4>
        <div class="analysis-grid">
          <div class="analysis-item">
            <strong>Skewness:</strong> {{ distributionAnalysis.skewness }}
            <div class="description">{{ distributionAnalysis.skewnessDescription }}</div>
          </div>
          <div class="analysis-item">
            <strong>Outliers:</strong> {{ distributionAnalysis.outliers.length > 0 ? distributionAnalysis.outliers.join(', ') : 'None detected' }}
            <div class="description">Values beyond 1.5 × IQR from quartiles</div>
          </div>
          <div class="analysis-item">
            <strong>Shape:</strong> {{ distributionAnalysis.shape }}
            <div class="description">Based on mean vs median comparison</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="probability-calculator">
      <h4>Probability Calculator</h4>
      <div class="prob-controls">
        <div class="input-group">
          <label>Normal approximation (if n ≥ 30):</label>
          <div class="normal-info">
            μ = {{ statistics.mean }}, σ = {{ statistics.stdDev }}
          </div>
        </div>
        
        <div class="input-group">
          <label>Find P(X ≤ value):</label>
          <input type="number" v-model="probValue" @input="calculateProbability" step="0.1" class="prob-input">
          <span class="prob-result">≈ {{ probability }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const dataInput = ref('85, 92, 78, 96, 88, 91, 84, 89, 93, 87')
const dataset = ref([])
const histogramBins = ref(8)
const probValue = ref(90)
const probability = ref(0)
const boxPlotCanvas = ref(null)
const histogramCanvas = ref(null)

const statistics = computed(() => {
  if (dataset.value.length === 0) return {}
  
  const data = [...dataset.value].sort((a, b) => a - b)
  const n = data.length
  
  // Mean
  const mean = parseFloat((data.reduce((sum, val) => sum + val, 0) / n).toFixed(2))
  
  // Median
  const median = n % 2 === 0 
    ? parseFloat(((data[n/2 - 1] + data[n/2]) / 2).toFixed(2))
    : parseFloat(data[Math.floor(n/2)].toFixed(2))
  
  // Mode
  const freq = {}
  data.forEach(val => freq[val] = (freq[val] || 0) + 1)
  const maxFreq = Math.max(...Object.values(freq))
  const modes = Object.keys(freq).filter(key => freq[key] === maxFreq)
  const mode = maxFreq > 1 ? modes.join(', ') : 'No mode'
  
  // Range
  const range = parseFloat((data[n-1] - data[0]).toFixed(2))
  
  // Variance and Standard Deviation
  const variance = parseFloat((data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n).toFixed(2))
  const stdDev = parseFloat(Math.sqrt(variance).toFixed(2))
  
  // Quartiles
  const q1Index = Math.floor(n * 0.25)
  const q3Index = Math.floor(n * 0.75)
  const q1 = parseFloat(data[q1Index].toFixed(2))
  const q3 = parseFloat(data[q3Index].toFixed(2))
  
  return { mean, median, mode, range, variance, stdDev, q1, q3, min: data[0], max: data[n-1] }
})

const distributionAnalysis = computed(() => {
  if (dataset.value.length === 0) return {}
  
  const { mean, median, q1, q3 } = statistics.value
  const iqr = q3 - q1
  
  // Skewness (simplified)
  let skewness, skewnessDescription
  if (Math.abs(mean - median) < 0.5) {
    skewness = 'Approximately symmetric'
    skewnessDescription = 'Mean ≈ Median'
  } else if (mean > median) {
    skewness = 'Right-skewed (positive)'
    skewnessDescription = 'Mean > Median, tail extends right'
  } else {
    skewness = 'Left-skewed (negative)'
    skewnessDescription = 'Mean < Median, tail extends left'
  }
  
  // Outliers
  const lowerFence = q1 - 1.5 * iqr
  const upperFence = q3 + 1.5 * iqr
  const outliers = dataset.value.filter(val => val < lowerFence || val > upperFence)
  
  // Shape
  const shape = mean === median ? 'Symmetric' : mean > median ? 'Right-skewed' : 'Left-skewed'
  
  return { skewness, skewnessDescription, outliers, shape }
})

const parseData = () => {
  try {
    const values = dataInput.value
      .split(',')
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n))
    
    dataset.value = values
    updateVisualizations()
  } catch (error) {
    console.error('Error parsing data:', error)
  }
}

const loadPreset = (type) => {
  switch (type) {
    case 'grades':
      dataInput.value = '85, 92, 78, 96, 88, 91, 84, 89, 93, 87, 82, 95, 79, 90, 86'
      break
    case 'heights':
      dataInput.value = '165, 170, 175, 168, 172, 180, 163, 177, 169, 174, 166, 178, 171, 173, 167'
      break
    case 'salaries':
      dataInput.value = '45, 52, 48, 65, 58, 72, 44, 67, 55, 61, 49, 74, 53, 69, 57'
      break
  }
  parseData()
}

const generateRandom = () => {
  const data = []
  for (let i = 0; i < 20; i++) {
    data.push(Math.floor(Math.random() * 100) + 1)
  }
  dataInput.value = data.join(', ')
  parseData()
}

const calculateProbability = () => {
  if (dataset.value.length === 0) return
  
  const count = dataset.value.filter(val => val <= probValue.value).length
  probability.value = parseFloat(((count / dataset.value.length) * 100).toFixed(1))
}

const updateBoxPlot = () => {
  const canvas = boxPlotCanvas.value
  if (!canvas || dataset.value.length === 0) return
  
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  
  ctx.clearRect(0, 0, width, height)
  
  const { min, max, q1, median, q3 } = statistics.value
  const { outliers } = distributionAnalysis.value
  
  const margin = 50
  const plotWidth = width - 2 * margin
  const scale = plotWidth / (max - min)
  
  const toX = (value) => margin + (value - min) * scale
  const centerY = height / 2
  const boxHeight = 40
  
  // Draw box
  ctx.fillStyle = '#E3F2FD'
  ctx.strokeStyle = '#1976D2'
  ctx.lineWidth = 2
  
  const boxLeft = toX(q1)
  const boxRight = toX(q3)
  ctx.fillRect(boxLeft, centerY - boxHeight/2, boxRight - boxLeft, boxHeight)
  ctx.strokeRect(boxLeft, centerY - boxHeight/2, boxRight - boxLeft, boxHeight)
  
  // Draw median line
  ctx.beginPath()
  ctx.moveTo(toX(median), centerY - boxHeight/2)
  ctx.lineTo(toX(median), centerY + boxHeight/2)
  ctx.stroke()
  
  // Draw whiskers
  const lowerWhisker = Math.max(min, q1 - 1.5 * (q3 - q1))
  const upperWhisker = Math.min(max, q3 + 1.5 * (q3 - q1))
  
  ctx.beginPath()
  ctx.moveTo(toX(lowerWhisker), centerY)
  ctx.lineTo(boxLeft, centerY)
  ctx.moveTo(toX(upperWhisker), centerY)
  ctx.lineTo(boxRight, centerY)
  ctx.stroke()
  
  // Draw whisker caps
  ctx.beginPath()
  ctx.moveTo(toX(lowerWhisker), centerY - 10)
  ctx.lineTo(toX(lowerWhisker), centerY + 10)
  ctx.moveTo(toX(upperWhisker), centerY - 10)
  ctx.lineTo(toX(upperWhisker), centerY + 10)
  ctx.stroke()
  
  // Draw outliers
  ctx.fillStyle = '#F44336'
  outliers.forEach(outlier => {
    ctx.beginPath()
    ctx.arc(toX(outlier), centerY, 3, 0, 2 * Math.PI)
    ctx.fill()
  })
  
  // Labels
  ctx.fillStyle = '#000'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`Min: ${min}`, toX(min), height - 10)
  ctx.fillText(`Q1: ${q1}`, toX(q1), height - 10)
  ctx.fillText(`Median: ${median}`, toX(median), height - 10)
  ctx.fillText(`Q3: ${q3}`, toX(q3), height - 10)
  ctx.fillText(`Max: ${max}`, toX(max), height - 10)
}

const updateHistogram = () => {
  const canvas = histogramCanvas.value
  if (!canvas || dataset.value.length === 0) return
  
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  
  ctx.clearRect(0, 0, width, height)
  
  const { min, max } = statistics.value
  const binCount = parseInt(histogramBins.value)
  const binWidth = (max - min) / binCount
  
  // Create bins
  const bins = new Array(binCount).fill(0)
  dataset.value.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1)
    bins[binIndex]++
  })
  
  const maxFreq = Math.max(...bins)
  const margin = 40
  const plotWidth = width - 2 * margin
  const plotHeight = height - 2 * margin
  
  // Draw bars
  const barWidth = plotWidth / binCount
  
  bins.forEach((freq, i) => {
    const barHeight = (freq / maxFreq) * plotHeight
    const x = margin + i * barWidth
    const y = height - margin - barHeight
    
    ctx.fillStyle = '#2196F3'
    ctx.fillRect(x, y, barWidth - 2, barHeight)
    
    ctx.strokeStyle = '#1976D2'
    ctx.strokeRect(x, y, barWidth - 2, barHeight)
  })
  
  // Draw axes
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(margin, height - margin)
  ctx.lineTo(width - margin, height - margin)
  ctx.moveTo(margin, margin)
  ctx.lineTo(margin, height - margin)
  ctx.stroke()
  
  // Labels
  ctx.fillStyle = '#000'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  for (let i = 0; i <= binCount; i++) {
    const value = min + i * binWidth
    const x = margin + i * barWidth
    ctx.fillText(value.toFixed(1), x, height - 5)
  }
}

const updateVisualizations = () => {
  setTimeout(() => {
    updateBoxPlot()
    updateHistogram()
    calculateProbability()
  }, 100)
}

watch(histogramBins, updateHistogram)
watch(dataset, updateVisualizations, { deep: true })

onMounted(() => {
  parseData()
})
</script>

<style scoped>
.statistics-calculator {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
}

.controls h3 {
  margin-top: 0;
  color: #333;
}

.data-input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.preset-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 1rem 0;
}

.preset-btn {
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.preset-btn:hover {
  background: #45a049;
}

.dataset-display {
  margin: 1rem 0;
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 4px;
}

.data-values {
  font-family: monospace;
  font-size: 0.9em;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.stat-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  text-align: center;
}

.stat-label {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.3em;
  font-weight: bold;
  color: #2196F3;
}

.visualizations {
  margin: 1.5rem 0;
}

.viz-section {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.viz-section canvas {
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  display: block;
  margin: 0 auto;
}

.histogram-controls {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.histogram-controls input[type="range"] {
  width: 150px;
}

.distribution-analysis {
  margin: 1.5rem 0;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.analysis-item {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.description {
  font-size: 0.9em;
  color: #666;
  font-style: italic;
  margin-top: 0.5rem;
}

.probability-calculator {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.prob-controls {
  margin: 1rem 0;
}

.input-group {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.normal-info {
  font-family: monospace;
  color: #2196F3;
  font-weight: bold;
}

.prob-input {
  width: 80px;
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.prob-result {
  font-weight: bold;
  color: #FF5722;
}
</style>