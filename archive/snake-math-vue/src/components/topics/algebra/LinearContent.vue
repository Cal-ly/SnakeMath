<template>
  <!-- Introduction Card -->
  <div class="card mb-4">
    <div class="card-header bg-primary text-white">
      <h2 class="h4 mb-0"><i class="fas fa-ruler me-2"></i>Linear Equations</h2>
    </div>
    <div class="card-body">
      <p class="lead">Linear equations are like the simplest algorithms—they take input <code>x</code>, apply a constant rate of change (slope), and produce predictable output. Think of them as <code>f(x) = rate * x + startingValue</code>.</p>
      
      <div class="alert alert-info" role="alert">
        <strong>Slope-Intercept Form:</strong> The most programmer-friendly format
      </div>
      <div class="text-center mb-3">
        <MathJaxRenderer 
          expression="y = mx + b" 
          :display-mode="true" 
        />
      </div>
      <p>Where <code>m</code> is the slope (rate of change) and <code>b</code> is the y-intercept (starting value).</p>
    </div>
  </div>

  <!-- Interactive Linear Explorer (Standard Layout) -->
  <div class="card mb-4">
    <div class="card-header bg-primary text-white">
      <h3 class="h5 mb-0"><i class="fas fa-ruler me-2"></i>Interactive Linear Explorer</h3>
    </div>
    <div class="card-body">
      <!-- 1. Generated Equation -->
      <div class="equation-section text-center p-3 bg-light rounded mb-4">
        <h6 class="text-muted mb-2">Current Function:</h6>
        <MathJaxRenderer 
          :expression="slopeInterceptForm" 
          :display-mode="true" 
        />
        
        <div v-if="usePoints" class="mt-3 text-start">
          <h6 class="small text-primary">Step-by-step calculation:</h6>
          <div class="small mb-1">
            <strong>1. Calculate slope:</strong>
            <MathJaxRenderer 
              :expression="`m = \\frac{${point2Y} - ${point1Y}}{${point2X} - ${point1X}} = ${calculatedSlope}`" 
              :display-mode="false" 
            />
          </div>
          <div class="small">
            <strong>2. Point-slope form:</strong>
            <MathJaxRenderer 
              :expression="pointSlopeForm" 
              :display-mode="false" 
            />
          </div>
        </div>
      </div>
      
      <!-- 2. Graph Visualization -->
      <div class="visualization-section mb-4">
        <div class="text-center">
          <canvas ref="graphCanvas" width="600" height="400" class="rounded" style="max-width: 100%; height: auto; background-color: #f8f9fa; border: 1px solid #dee2e6;"></canvas>
        </div>
        <p class="text-muted text-center mt-2 small">Linear equation visualization with key points highlighted</p>
      </div>
      
      <!-- 3. Controls -->
      <div class="controls-section">
        <h6 class="text-primary mb-3"><i class="fas fa-cogs me-2"></i>Method Selection & Controls</h6>
        
        <!-- Method Toggle -->
        <div class="btn-group w-100 mb-4" role="group">
          <input type="radio" class="btn-check" :value="false" v-model="usePoints" id="slope-intercept">
          <label class="btn btn-outline-primary" for="slope-intercept">
            <i class="fas fa-chart-line me-2"></i>Slope & Y-Intercept
          </label>
          
          <input type="radio" class="btn-check" :value="true" v-model="usePoints" id="two-points">
          <label class="btn btn-outline-primary" for="two-points">
            <i class="fas fa-map-pin me-2"></i>Two Points
          </label>
        </div>
        
        <!-- Parameter Controls -->
        <div v-if="!usePoints" class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Slope (m): <span class="badge bg-primary">{{ slope }}</span></label>
            <input type="range" class="form-range" v-model.number="slope" min="-5" max="5" step="0.1">
            <small class="text-muted">Rise over run - how steep the line is</small>
          </div>
          <div class="col-md-6">
            <label class="form-label">Y-Intercept (b): <span class="badge bg-primary">{{ yIntercept }}</span></label>
            <input type="range" class="form-range" v-model.number="yIntercept" min="-10" max="10" step="0.5">
            <small class="text-muted">Where line crosses the y-axis</small>
          </div>
        </div>
        
        <div v-else class="row g-3">
          <div class="col-md-6">
            <h6 class="small">Point 1</h6>
            <div class="row">
              <div class="col-6">
                <label class="form-label">X1: <span class="badge bg-secondary">{{ point1X }}</span></label>
                <input type="range" class="form-range" v-model.number="point1X" min="-10" max="10" step="0.5">
              </div>
              <div class="col-6">
                <label class="form-label">Y1: <span class="badge bg-secondary">{{ point1Y }}</span></label>
                <input type="range" class="form-range" v-model.number="point1Y" min="-10" max="10" step="0.5">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <h6 class="small">Point 2</h6>
            <div class="row">
              <div class="col-6">
                <label class="form-label">X2: <span class="badge bg-secondary">{{ point2X }}</span></label>
                <input type="range" class="form-range" v-model.number="point2X" min="-10" max="10" step="0.5">
              </div>
              <div class="col-6">
                <label class="form-label">Y2: <span class="badge bg-secondary">{{ point2Y }}</span></label>
                <input type="range" class="form-range" v-model.number="point2Y" min="-10" max="10" step="0.5">
              </div>
            </div>
          </div>
        </div>
        
        <!-- Properties Summary -->
        <div class="mt-4 p-3 bg-light rounded">
          <div class="row g-3">
            <div class="col-md-6">
              <h6 class="small mb-2 text-primary">Key Properties:</h6>
              <ul class="small mb-0">
                <li><strong>Slope:</strong> {{ usePoints ? calculatedSlope : slope }} (rate of change)</li>
                <li><strong>Y-intercept:</strong> {{ usePoints ? calculatedYIntercept : yIntercept }}</li>
                <li><strong>Domain:</strong> All real numbers</li>
                <li><strong>Range:</strong> All real numbers</li>
              </ul>
            </div>
            <div class="col-md-6">
              <h6 class="small mb-2 text-primary">Programming Analogy:</h6>
              <code class="small">function f(x) { return {{ usePoints ? calculatedSlope : slope }} * x + {{ usePoints ? calculatedYIntercept : yIntercept }}; }</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import MathJaxRenderer from '@/components/common/MathJaxRenderer.vue'

const slope = ref(2)
const yIntercept = ref(-1)
const point1X = ref(0)
const point1Y = ref(0)
const point2X = ref(3)
const point2Y = ref(5)
const usePoints = ref(false)
const graphCanvas = ref(null)

const calculatedSlope = computed(() => {
  if (point2X.value === point1X.value) return 'Undefined (vertical line)'
  const m = (point2Y.value - point1Y.value) / (point2X.value - point1X.value)
  return m.toFixed(2)
})

const calculatedYIntercept = computed(() => {
  if (usePoints.value) {
    const m = parseFloat(calculatedSlope.value)
    const b = point1Y.value - m * point1X.value
    return b.toFixed(2)
  }
  return yIntercept.value
})

const pointSlopeForm = computed(() => {
  return `y - ${point1Y.value} = ${calculatedSlope.value}(x - ${point1X.value})`
})

const slopeInterceptForm = computed(() => {
  if (usePoints.value) {
    const m = parseFloat(calculatedSlope.value)
    const b = point1Y.value - m * point1X.value
    return `y = ${m.toFixed(2)}x + ${b.toFixed(2)}`
  }
  return `y = ${slope.value}x + ${yIntercept.value}`
})

const drawGraph = () => {
  if (!graphCanvas.value) return
  
  const canvas = graphCanvas.value
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  
  // Clear canvas with light grey background (theme-agnostic)
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, width, height)
  
  // Set up coordinate system
  const xMin = -10, xMax = 10
  const yMin = -10, yMax = 10
  const xScale = width / (xMax - xMin)
  const yScale = height / (yMax - yMin)
  
  // Convert mathematical coordinates to canvas coordinates
  const toCanvasX = (x) => (x - xMin) * xScale
  const toCanvasY = (y) => height - (y - yMin) * yScale
  
  // Draw grid
  ctx.strokeStyle = '#dee2e6'
  ctx.lineWidth = 1
  
  // Vertical grid lines
  for (let x = xMin; x <= xMax; x++) {
    ctx.beginPath()
    ctx.moveTo(toCanvasX(x), 0)
    ctx.lineTo(toCanvasX(x), height)
    ctx.stroke()
  }
  
  // Horizontal grid lines
  for (let y = yMin; y <= yMax; y++) {
    ctx.beginPath()
    ctx.moveTo(0, toCanvasY(y))
    ctx.lineTo(width, toCanvasY(y))
    ctx.stroke()
  }
  
  // Draw axes
  ctx.strokeStyle = '#495057'
  ctx.lineWidth = 2
  
  // X-axis
  ctx.beginPath()
  ctx.moveTo(0, toCanvasY(0))
  ctx.lineTo(width, toCanvasY(0))
  ctx.stroke()
  
  // Y-axis
  ctx.beginPath()
  ctx.moveTo(toCanvasX(0), 0)
  ctx.lineTo(toCanvasX(0), height)
  ctx.stroke()
  
  // Get current slope and y-intercept
  const currentSlope = usePoints.value ? parseFloat(calculatedSlope.value) : slope.value
  const currentYIntercept = usePoints.value ? parseFloat(calculatedYIntercept.value) : yIntercept.value
  
  // Draw line
  if (calculatedSlope.value !== 'Undefined (vertical line)') {
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    const y1 = currentSlope * xMin + currentYIntercept
    const y2 = currentSlope * xMax + currentYIntercept
    
    ctx.moveTo(toCanvasX(xMin), toCanvasY(y1))
    ctx.lineTo(toCanvasX(xMax), toCanvasY(y2))
    ctx.stroke()
  }
  
  // Highlight y-intercept
  if (currentYIntercept >= yMin && currentYIntercept <= yMax) {
    ctx.fillStyle = '#dc2626'
    ctx.beginPath()
    ctx.arc(toCanvasX(0), toCanvasY(currentYIntercept), 5, 0, 2 * Math.PI)
    ctx.fill()
  }
  
  // Highlight points if using two-point method
  if (usePoints.value) {
    ctx.fillStyle = '#2563eb'
    
    // Point 1
    if (point1X.value >= xMin && point1X.value <= xMax && point1Y.value >= yMin && point1Y.value <= yMax) {
      ctx.beginPath()
      ctx.arc(toCanvasX(point1X.value), toCanvasY(point1Y.value), 5, 0, 2 * Math.PI)
      ctx.fill()
    }
    
    // Point 2
    if (point2X.value >= xMin && point2X.value <= xMax && point2Y.value >= yMin && point2Y.value <= yMax) {
      ctx.beginPath()
      ctx.arc(toCanvasX(point2X.value), toCanvasY(point2Y.value), 5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
  
  // Add legend (theme-agnostic)
  ctx.fillStyle = '#495057'
  ctx.font = '12px Inter, sans-serif'
  ctx.fillText('Line', 10, 20)
  ctx.fillStyle = '#dc2626'
  ctx.fillText('Y-intercept', 10, 35)
  if (usePoints.value) {
    ctx.fillStyle = '#2563eb'
    ctx.fillText('Input Points', 10, 50)
  }
}

onMounted(() => {
  nextTick(() => {
    drawGraph()
  })
})

// Watch for changes and redraw
watch([slope, yIntercept, point1X, point1Y, point2X, point2Y, usePoints], () => {
  nextTick(() => {
    drawGraph()
  })
})
</script>

<style scoped>
.btn-check:checked + .btn {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
}

/* Canvas responsiveness */
canvas {
  max-width: 100%;
  height: auto;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  canvas {
    width: 100%;
    height: 300px;
  }
}
</style>