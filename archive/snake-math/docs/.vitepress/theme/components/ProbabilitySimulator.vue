<!-- ProbabilitySimulator.vue 
 Component conceptualization:
Create an interactive probability distributions explorer where users can:
- Select different distribution types (normal, binomial, poisson, exponential, uniform) with parameter sliders
- Visualize probability density/mass functions with real-time parameter changes
- Compare multiple distributions side-by-side with overlay capabilities
- Demonstrate Central Limit Theorem with sample size and sample count controls
- Interactive A/B testing simulator with statistical significance calculations
- Bayes' theorem calculator with visual probability tree diagrams
- Confidence interval visualization showing coverage probability
- Monte Carlo simulation tools for complex probability scenarios
- Generate random samples and analyze their statistical properties
The component should provide both theoretical curves and empirical demonstrations.
-->
<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Probability Distribution Simulator</h3>
      
      <div class="input-group">
        <label class="input-group-title">Distribution Type:</label>
        <select v-model="distributionType" @change="updateSimulation" class="function-select">
          <option value="normal">Normal Distribution</option>
          <option value="binomial">Binomial Distribution</option>
          <option value="uniform">Uniform Distribution</option>
          <option value="exponential">Exponential Distribution</option>
        </select>
      </div>
      
      <div v-if="distributionType === 'normal'" class="interactive-card">
        <div class="input-group">
          <label>Mean (μ):</label>
          <input type="range" v-model="normalMean" min="-5" max="5" step="0.1" @input="updateSimulation" class="range-input">
          <span class="result-value">{{ normalMean }}</span>
        </div>
        <div class="input-group">
          <label>Standard Deviation (σ):</label>
          <input type="range" v-model="normalStd" min="0.1" max="3" step="0.1" @input="updateSimulation" class="range-input">
          <span class="result-value">{{ normalStd }}</span>
        </div>
      </div>
      
      <div v-if="distributionType === 'binomial'" class="interactive-card">
        <div class="input-group">
          <label>Number of trials (n):</label>
          <input type="range" v-model="binomialN" min="1" max="50" step="1" @input="updateSimulation" class="range-input">
          <span class="result-value">{{ binomialN }}</span>
        </div>
        <div class="input-group">
          <label>Probability of success (p):</label>
          <input type="range" v-model="binomialP" min="0" max="1" step="0.01" @input="updateSimulation" class="range-input">
          <span class="result-value">{{ binomialP }}</span>
        </div>
      </div>
      
      <div class="interactive-card">
        <div class="input-group">
          <label>Sample Size:</label>
          <input type="range" v-model="sampleSize" min="100" max="10000" step="100" @input="updateSimulation" class="range-input">
          <span class="result-value">{{ sampleSize }}</span>
        </div>
        
        <button @click="runSimulation" class="btn-primary">Generate New Sample</button>
      </div>
    </div>
    
    <div class="visualization-container">
      <canvas ref="histogramCanvas" width="600" height="400" class="visualization-canvas"></canvas>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Sample Statistics:</h4>
      <div class="results-grid">
        <div class="result-card">
          <div class="result-label">Sample Mean</div>
          <div class="result-value">{{ sampleStats.mean }}</div>
        </div>
        <div class="result-card">
          <div class="result-label">Sample Std Dev</div>
          <div class="result-value">{{ sampleStats.std }}</div>
        </div>
        <div class="result-card">
          <div class="result-label">Sample Min</div>
          <div class="result-value">{{ sampleStats.min }}</div>
        </div>
        <div class="result-card">
          <div class="result-label">Sample Max</div>
          <div class="result-value">{{ sampleStats.max }}</div>
        </div>
      </div>
      
      <div class="theoretical-comparison">
        <h4 class="input-group-title">Theoretical vs Sample:</h4>
        <div class="comparison-grid">
          <div class="comparison-item">
            <div class="comparison-label">Mean</div>
            <div class="comparison-values">
              <div>Theoretical: {{ theoreticalStats.mean }}</div>
              <div>Sample: {{ sampleStats.mean }}</div>
            </div>
          </div>
          <div class="comparison-item">
            <div class="comparison-label">Standard Deviation</div>
            <div class="comparison-values">
              <div>Theoretical: {{ theoreticalStats.std }}</div>
              <div>Sample: {{ sampleStats.std }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Probability Calculator:</h4>
      <div class="interactive-card">
        <div class="input-group">
          <label>P(X ≤ value):</label>
          <input type="number" v-model="probValue" @input="calculateProbability" step="0.1">
          <span class="prob-result">≈ {{ calculatedProbability }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const distributionType = ref('normal')
const normalMean = ref(0)
const normalStd = ref(1)
const binomialN = ref(20)
const binomialP = ref(0.5)
const sampleSize = ref(1000)
const probValue = ref(0)
const calculatedProbability = ref(50)
const samples = ref([])
const histogramCanvas = ref(null)

const theoreticalStats = computed(() => {
  switch (distributionType.value) {
    case 'normal':
      return {
        mean: parseFloat(normalMean.value.toFixed(3)),
        std: parseFloat(normalStd.value.toFixed(3))
      }
    case 'binomial':
      return {
        mean: parseFloat((binomialN.value * binomialP.value).toFixed(3)),
        std: parseFloat(Math.sqrt(binomialN.value * binomialP.value * (1 - binomialP.value)).toFixed(3))
      }
    case 'uniform':
      return {
        mean: 0.5,
        std: parseFloat((1 / Math.sqrt(12)).toFixed(3))
      }
    case 'exponential':
      return {
        mean: 1.0,
        std: 1.0
      }
    default:
      return { mean: 0, std: 1 }
  }
})

const sampleStats = computed(() => {
  if (samples.value.length === 0) return { mean: 0, std: 0, min: 0, max: 0 }
  
  const mean = samples.value.reduce((sum, val) => sum + val, 0) / samples.value.length
  const variance = samples.value.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.value.length
  const std = Math.sqrt(variance)
  const min = Math.min(...samples.value)
  const max = Math.max(...samples.value)
  
  return {
    mean: parseFloat(mean.toFixed(3)),
    std: parseFloat(std.toFixed(3)),
    min: parseFloat(min.toFixed(3)),
    max: parseFloat(max.toFixed(3))
  }
})

const generateSamples = () => {
  const newSamples = []
  
  switch (distributionType.value) {
    case 'normal':
      for (let i = 0; i < sampleSize.value; i++) {
        newSamples.push(normalRandom(normalMean.value, normalStd.value))
      }
      break
    case 'binomial':
      for (let i = 0; i < sampleSize.value; i++) {
        newSamples.push(binomialRandom(binomialN.value, binomialP.value))
      }
      break
    case 'uniform':
      for (let i = 0; i < sampleSize.value; i++) {
        newSamples.push(Math.random())
      }
      break
    case 'exponential':
      for (let i = 0; i < sampleSize.value; i++) {
        newSamples.push(-Math.log(1 - Math.random()))
      }
      break
  }
  
  samples.value = newSamples
}

const normalRandom = (mean, std) => {
  // Box-Muller transform
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + std * z
}

const binomialRandom = (n, p) => {
  let successes = 0
  for (let i = 0; i < n; i++) {
    if (Math.random() < p) successes++
  }
  return successes
}

const calculateProbability = () => {
  if (samples.value.length === 0) return
  
  const count = samples.value.filter(val => val <= probValue.value).length
  calculatedProbability.value = parseFloat(((count / samples.value.length) * 100).toFixed(1))
}

const drawHistogram = () => {
  const canvas = histogramCanvas.value
  if (!canvas || samples.value.length === 0) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  
  ctx.clearRect(0, 0, width, height)
  
  // Create bins
  const binCount = 30
  const min = Math.min(...samples.value)
  const max = Math.max(...samples.value)
  const binWidth = (max - min) / binCount
  
  const bins = new Array(binCount).fill(0)
  samples.value.forEach(value => {
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
  })
  
  // Draw theoretical curve overlay for normal distribution
  if (distributionType.value === 'normal') {
    ctx.strokeStyle = '#F44336'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    let first = true
    for (let x = min; x <= max; x += (max - min) / 200) {
      const density = normalPDF(x, normalMean.value, normalStd.value)
      const scaledDensity = (density * samples.value.length * binWidth / maxFreq) * plotHeight
      const canvasX = margin + ((x - min) / (max - min)) * plotWidth
      const canvasY = height - margin - scaledDensity
      
      if (first) {
        ctx.moveTo(canvasX, canvasY)
        first = false
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }
    ctx.stroke()
  }
  
  // Draw axes
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(margin, height - margin)
  ctx.lineTo(width - margin, height - margin)
  ctx.moveTo(margin, margin)
  ctx.lineTo(margin, height - margin)
  ctx.stroke()
  
  // Labels
  ctx.fillStyle = '#000000'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  
  // X-axis labels
  for (let i = 0; i <= 5; i++) {
    const value = min + (i / 5) * (max - min)
    const x = margin + (i / 5) * plotWidth
    ctx.fillText(value.toFixed(2), x, height - 5)
  }
  
  // Y-axis labels
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const value = (i / 5) * maxFreq
    const y = height - margin - (i / 5) * plotHeight
    ctx.fillText(Math.round(value), margin - 5, y + 3)
  }
}

const normalPDF = (x, mean, std) => {
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2))
}

const runSimulation = () => {
  generateSamples()
  drawHistogram()
  calculateProbability()
}

const updateSimulation = () => {
  setTimeout(() => {
    runSimulation()
  }, 100)
}

watch([distributionType, sampleSize], updateSimulation)

onMounted(() => {
  runSimulation()
})
</script>

<style scoped>
@import '../styles/components.css';
</style>