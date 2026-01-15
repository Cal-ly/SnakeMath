<!--
Component conceptualization:
Create an interactive limits and continuity explorer where users can:
- Input custom functions and explore their limits at different points
- Visualize function behavior with dynamic zooming around limit points
- See step-by-step numerical approximation of limits from both sides
- Compare continuous vs discontinuous functions side-by-side
- Explore L'Hôpital's rule for indeterminate forms interactively
- Test different types of discontinuities (removable, jump, infinite)
- Animate the process of x approaching the limit point
- Display epsilon-delta proofs visually with adjustable parameters
The component should provide real-time graphical feedback and numerical tables showing convergence.
-->
<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Interactive Limits Explorer</h3>
      
      <div class="input-group">
        <label class="input-group-title">Function Type:</label>
        <select v-model="functionType" @change="updateVisualization" class="function-select">
          <option value="polynomial">Polynomial: f(x) = x² + 1</option>
          <option value="rational">Rational: f(x) = (x² - 4)/(x - 2)</option>
          <option value="trigonometric">Trigonometric: f(x) = sin(x)/x</option>
          <option value="exponential">Exponential: f(x) = (e^x - 1)/x</option>
          <option value="piecewise">Piecewise Function</option>
        </select>
      </div>
      
      <div class="interactive-card">
        <div class="input-group">
          <label>Approach point (a):</label>
          <input type="number" v-model="approachPoint" @input="updateVisualization" step="0.1">
        </div>
        
        <div class="input-group">
          <label>Zoom level:</label>
          <input type="range" v-model="zoomLevel" min="1" max="10" step="1" @input="updateVisualization" class="range-input">
          <span class="result-value">{{ zoomLevel }}</span>
        </div>
      </div>
      
      <div class="interactive-card">
        <h4 class="input-group-title">ε-δ Definition:</h4>
        <div class="input-group">
          <label>Epsilon (ε):</label>
          <input type="range" v-model="epsilon" min="0.1" max="2" step="0.1" @input="updateVisualization" class="range-input">
          <span class="result-value">{{ epsilon }}</span>
        </div>
        
        <div class="input-group">
          <label>Delta (δ):</label>
          <input type="range" v-model="delta" min="0.1" max="2" step="0.1" @input="updateVisualization" class="range-input">
          <span class="result-value">{{ delta }}</span>
        </div>
      </div>
    </div>
    
    <div class="visualization-container">
      <canvas ref="limitsCanvas" width="600" height="400" class="visualization-canvas"></canvas>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Numerical Approach to Limit:</h4>
      <div class="approach-table">
        <div class="table-header">
          <div>x → {{ approachPoint }}</div>
          <div>f(x)</div>
          <div>Distance from limit</div>
        </div>
        <div v-for="entry in approachTable" :key="entry.x" class="table-row">
          <div>{{ entry.x }}</div>
          <div>{{ entry.fx }}</div>
          <div>{{ entry.distance }}</div>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Limit Analysis:</h4>
      <div class="results-grid">
        <div class="result-card">
          <div class="result-label">Left-hand limit</div>
          <div class="result-value">{{ leftLimit }}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Right-hand limit</div>
          <div class="result-value">{{ rightLimit }}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Two-sided limit</div>
          <div class="result-value">{{ twoSidedLimit }}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Function value at x = {{ approachPoint }}</div>
          <div class="result-value">{{ functionValue }}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Continuity</div>
          <div class="result-value">{{ continuityStatus }}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Type of discontinuity</div>
          <div class="result-value">{{ discontinuityType }}</div>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Limit Laws Applied:</h4>
      <div class="laws-explanation">
        <div v-if="functionType === 'polynomial'" class="law">
          <strong>Polynomial Continuity:</strong> For polynomial functions, lim[x→a] f(x) = f(a)
        </div>
        
        <div v-if="functionType === 'rational'" class="law">
          <strong>Indeterminate Form 0/0:</strong> Factor and cancel, or use L'Hôpital's rule
        </div>
        
        <div v-if="functionType === 'trigonometric'" class="law">
          <strong>Special Trigonometric Limit:</strong> lim[x→0] sin(x)/x = 1
        </div>
        
        <div v-if="functionType === 'exponential'" class="law">
          <strong>Special Exponential Limit:</strong> lim[x→0] (e^x - 1)/x = 1
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const functionType = ref('rational')
const approachPoint = ref(2)
const zoomLevel = ref(5)
const epsilon = ref(0.5)
const delta = ref(0.5)
const limitsCanvas = ref(null)

const evaluateFunction = (x) => {
  switch (functionType.value) {
    case 'polynomial':
      return x * x + 1
    case 'rational':
      if (Math.abs(x - 2) < 1e-10) return NaN // Hole at x = 2
      return (x * x - 4) / (x - 2)
    case 'trigonometric':
      if (Math.abs(x) < 1e-10) return NaN // Hole at x = 0
      return Math.sin(x) / x
    case 'exponential':
      if (Math.abs(x) < 1e-10) return NaN // Hole at x = 0
      return (Math.exp(x) - 1) / x
    case 'piecewise':
      if (x < approachPoint.value) return x
      else if (x > approachPoint.value) return x + 1
      else return NaN // Jump discontinuity
    default:
      return 0
  }
}

const getTheoreticalLimit = () => {
  switch (functionType.value) {
    case 'polynomial':
      return approachPoint.value * approachPoint.value + 1
    case 'rational':
      return approachPoint.value + 2 // After factoring: (x+2)(x-2)/(x-2) = x+2
    case 'trigonometric':
      return 1 // lim[x→0] sin(x)/x = 1
    case 'exponential':
      return 1 // lim[x→0] (e^x - 1)/x = 1
    case 'piecewise':
      return null // No limit exists
    default:
      return 0
  }
}

const approachTable = computed(() => {
  const table = []
  const theoreticalLimit = getTheoreticalLimit()
  
  for (let i = 1; i <= 6; i++) {
    const h = Math.pow(10, -i)
    
    // Right approach
    const xRight = approachPoint.value + h
    const fxRight = evaluateFunction(xRight)
    const distanceRight = theoreticalLimit !== null && !isNaN(fxRight) 
      ? Math.abs(fxRight - theoreticalLimit).toFixed(6)
      : 'N/A'
    
    table.push({
      x: xRight.toFixed(6),
      fx: isNaN(fxRight) ? 'undefined' : fxRight.toFixed(6),
      distance: distanceRight
    })
    
    // Left approach
    const xLeft = approachPoint.value - h
    const fxLeft = evaluateFunction(xLeft)
    const distanceLeft = theoreticalLimit !== null && !isNaN(fxLeft)
      ? Math.abs(fxLeft - theoreticalLimit).toFixed(6)
      : 'N/A'
    
    table.push({
      x: xLeft.toFixed(6),
      fx: isNaN(fxLeft) ? 'undefined' : fxLeft.toFixed(6),
      distance: distanceLeft
    })
  }
  
  return table.slice(0, 8) // Show first 8 entries
})

const leftLimit = computed(() => {
  const h = 1e-6
  const x = approachPoint.value - h
  const fx = evaluateFunction(x)
  return isNaN(fx) ? 'undefined' : fx.toFixed(3)
})

const rightLimit = computed(() => {
  const h = 1e-6
  const x = approachPoint.value + h
  const fx = evaluateFunction(x)
  return isNaN(fx) ? 'undefined' : fx.toFixed(3)
})

const twoSidedLimit = computed(() => {
  const left = parseFloat(leftLimit.value)
  const right = parseFloat(rightLimit.value)
  
  if (isNaN(left) || isNaN(right)) return 'undefined'
  if (Math.abs(left - right) < 1e-6) return left.toFixed(3)
  return 'does not exist'
})

const functionValue = computed(() => {
  const fx = evaluateFunction(approachPoint.value)
  return isNaN(fx) ? 'undefined' : fx.toFixed(3)
})

const continuityStatus = computed(() => {
  const limit = parseFloat(twoSidedLimit.value)
  const value = parseFloat(functionValue.value)
  
  if (isNaN(limit)) return 'Discontinuous'
  if (isNaN(value)) return 'Discontinuous'
  if (Math.abs(limit - value) < 1e-6) return 'Continuous'
  return 'Discontinuous'
})

const discontinuityType = computed(() => {
  if (continuityStatus.value === 'Continuous') return 'None'
  
  const limit = parseFloat(twoSidedLimit.value)
  const value = parseFloat(functionValue.value)
  
  if (!isNaN(limit) && isNaN(value)) return 'Removable'
  if (!isNaN(limit) && !isNaN(value) && Math.abs(limit - value) > 1e-6) return 'Jump'
  if (isNaN(limit)) return 'Essential'
  return 'Unknown'
})

const updateVisualization = () => {
  setTimeout(() => {
    drawLimitsGraph()
  }, 100)
}

const drawLimitsGraph = () => {
  const canvas = limitsCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  
  ctx.clearRect(0, 0, width, height)
  
  const range = 10 / zoomLevel.value
  const xMin = approachPoint.value - range
  const xMax = approachPoint.value + range
  const yMin = -range + (getTheoreticalLimit() || 0)
  const yMax = range + (getTheoreticalLimit() || 0)
  
  const xScale = width / (xMax - xMin)
  const yScale = height / (yMax - yMin)
  
  const toCanvasX = (x) => (x - xMin) * xScale
  const toCanvasY = (y) => height - (y - yMin) * yScale
  
  // Draw grid
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += 0.5) {
    ctx.beginPath()
    ctx.moveTo(toCanvasX(x), 0)
    ctx.lineTo(toCanvasX(x), height)
    ctx.stroke()
  }
  
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += 0.5) {
    ctx.beginPath()
    ctx.moveTo(0, toCanvasY(y))
    ctx.lineTo(width, toCanvasY(y))
    ctx.stroke()
  }
  
  // Draw axes
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  
  if (yMin <= 0 && yMax >= 0) {
    ctx.beginPath()
    ctx.moveTo(0, toCanvasY(0))
    ctx.lineTo(width, toCanvasY(0))
    ctx.stroke()
  }
  
  if (xMin <= approachPoint.value && xMax >= approachPoint.value) {
    ctx.beginPath()
    ctx.moveTo(toCanvasX(approachPoint.value), 0)
    ctx.lineTo(toCanvasX(approachPoint.value), height)
    ctx.stroke()
  }
  
  // Draw function
  ctx.strokeStyle = '#2196F3'
  ctx.lineWidth = 3
  ctx.beginPath()
  
  let prevX = null, prevY = null
  const step = (xMax - xMin) / 1000
  
  for (let x = xMin; x <= xMax; x += step) {
    if (Math.abs(x - approachPoint.value) < step) continue // Skip near discontinuity
    
    const y = evaluateFunction(x)
    if (isFinite(y) && y >= yMin && y <= yMax) {
      const canvasX = toCanvasX(x)
      const canvasY = toCanvasY(y)
      
      if (prevX !== null && Math.abs(x - prevX) < 2 * step) {
        ctx.lineTo(canvasX, canvasY)
      } else {
        ctx.moveTo(canvasX, canvasY)
      }
      
      prevX = x
      prevY = y
    } else {
      prevX = null
      prevY = null
    }
  }
  ctx.stroke()
  
  // Draw epsilon-delta visualization
  const theoreticalLimit = getTheoreticalLimit()
  if (theoreticalLimit !== null) {
    // Epsilon band
    ctx.fillStyle = 'rgba(76, 175, 80, 0.2)'
    ctx.fillRect(0, toCanvasY(theoreticalLimit + epsilon.value), width, 
                 toCanvasY(theoreticalLimit - epsilon.value) - toCanvasY(theoreticalLimit + epsilon.value))
    
    // Delta interval
    const deltaLeft = toCanvasX(approachPoint.value - delta.value)
    const deltaRight = toCanvasX(approachPoint.value + delta.value)
    ctx.fillStyle = 'rgba(255, 152, 0, 0.2)'
    ctx.fillRect(deltaLeft, 0, deltaRight - deltaLeft, height)
    
    // Limit point
    ctx.fillStyle = '#4CAF50'
    ctx.beginPath()
    ctx.arc(toCanvasX(approachPoint.value), toCanvasY(theoreticalLimit), 6, 0, 2 * Math.PI)
    ctx.fill()
  }
  
  // Draw hole if function is undefined at approach point
  if (isNaN(evaluateFunction(approachPoint.value)) && theoreticalLimit !== null) {
    ctx.strokeStyle = '#F44336'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(toCanvasX(approachPoint.value), toCanvasY(theoreticalLimit), 5, 0, 2 * Math.PI)
    ctx.stroke()
  }
  
  // Labels
  ctx.fillStyle = '#000000'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`x = ${approachPoint.value}`, toCanvasX(approachPoint.value), height - 10)
  
  if (theoreticalLimit !== null) {
    ctx.fillText(`L = ${theoreticalLimit.toFixed(3)}`, width - 80, toCanvasY(theoreticalLimit))
  }
}

watch([functionType, approachPoint, zoomLevel, epsilon, delta], updateVisualization)

onMounted(() => {
  updateVisualization()
})
</script>

<style scoped>
@import '../styles/components.css';
</style>