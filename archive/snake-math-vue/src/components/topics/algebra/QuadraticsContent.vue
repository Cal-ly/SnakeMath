<template>
  <!-- Introduction Card -->
  <div class="card mb-4">
    <div class="card-header bg-primary text-white">
      <h2 class="h4 mb-0"><i class="fas fa-chart-line me-2"></i>Quadratic Functions</h2>
    </div>
    <div class="card-body">
      <p class="lead">Think of quadratics as the "for loops with nested loops" of mathematics—they create those characteristic curved patterns you see everywhere in programming, from algorithm complexity to graphics rendering.</p>
      
      <div class="alert alert-info" role="alert">
        <strong>Standard Form:</strong> Like defining a function signature in code
      </div>
      <div class="text-center mb-3">
        <MathJaxRenderer 
          expression="f(x) = ax^2 + bx + c" 
          :display-mode="true" 
        />
      </div>
      <p>Where <code>a ≠ 0</code> (otherwise it's just linear!), and the graph forms a parabola.</p>
    </div>
  </div>

  <!-- Interactive Quadratic Explorer (Standard Layout) -->
  <div class="card mb-4">
    <div class="card-header bg-primary text-white">
      <h3 class="h5 mb-0"><i class="fas fa-chart-line me-2"></i>Interactive Quadratic Explorer</h3>
    </div>
    <div class="card-body">
      <!-- 1. Generated Equation -->
      <div class="equation-section text-center p-3 bg-light rounded mb-4">
        <h6 class="text-muted mb-2">Current Function:</h6>
        <MathJaxRenderer 
          :expression="`f(x) = ${a}x^2 + ${b}x + ${c}`" 
          :display-mode="true" 
        />
      </div>
      
      <!-- 2. Graph Visualization -->
      <div class="visualization-section mb-4">
        <div class="text-center">
          <canvas ref="graphCanvas" width="600" height="400" class="rounded" style="max-width: 100%; height: auto; background-color: #f8f9fa; border: 1px solid #dee2e6;"></canvas>
        </div>
        <p class="text-muted text-center mt-2 small">Interactive parabola updates as you change coefficients</p>
      </div>
      
      <!-- 3. Controls -->
      <div class="controls-section">
        <h6 class="text-primary mb-3"><i class="fas fa-sliders-h me-2"></i>Parameter Controls</h6>
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Coefficient a: <span class="badge bg-primary">{{ a }}</span></label>
            <input type="range" class="form-range" v-model.number="a" min="-3" max="3" step="0.1">
            <small class="text-muted">Controls parabola direction and width</small>
          </div>
          <div class="col-md-4">
            <label class="form-label">Coefficient b: <span class="badge bg-primary">{{ b }}</span></label>
            <input type="range" class="form-range" v-model.number="b" min="-10" max="10" step="0.5">
            <small class="text-muted">Shifts the parabola horizontally</small>
          </div>
          <div class="col-md-4">
            <label class="form-label">Coefficient c: <span class="badge bg-primary">{{ c }}</span></label>
            <input type="range" class="form-range" v-model.number="c" min="-10" max="10" step="0.5">
            <small class="text-muted">Y-intercept (where parabola crosses y-axis)</small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Analysis and Solutions Card -->
  <div class="card mb-4">
    <div class="card-header">
      <h3 class="h5 mb-0"><i class="fas fa-calculator me-2"></i>Mathematical Analysis</h3>
    </div>
    <div class="card-body">
      <div class="row g-4">
        <div class="col-md-6">
          <h6>Key Properties:</h6>
          <div class="mb-3">
            <strong>Vertex:</strong> ({{ vertex.x }}, {{ vertex.y }})
            <br><small class="text-muted">Peak/valley of the parabola</small>
          </div>
          
          <div class="mb-3">
            <strong>Discriminant:</strong> 
            <span class="badge" :class="discriminant >= 0 ? 'bg-success' : 'bg-danger'">
              {{ discriminant.toFixed(2) }}
            </span>
            <br><small class="text-muted">{{ discriminant >= 0 ? 'Has real solutions' : 'No real solutions' }}</small>
          </div>
          
          <div class="mb-3">
            <strong>Solutions:</strong> {{ solutions }}
          </div>
        </div>
        
        <div class="col-md-6">
          <button 
            class="btn btn-outline-primary btn-sm w-100 mb-3" 
            @click="showSolution = !showSolution"
          >
            <i class="fas" :class="showSolution ? 'fa-eye-slash' : 'fa-eye'"></i>
            {{ showSolution ? 'Hide' : 'Show' }} Quadratic Formula Steps
          </button>
          
          <div v-if="showSolution" class="p-3 border rounded bg-light">
            <h6>Step-by-step solution:</h6>
            <div class="text-center mb-2">
              <MathJaxRenderer 
                expression="x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" 
                :display-mode="true" 
              />
            </div>
            <p class="small mb-2">Substituting values:</p>
            <div class="text-center mb-2">
              <MathJaxRenderer 
                :expression="`x = \\frac{-(${b}) \\pm \\sqrt{(${b})^2 - 4(${a})(${c})}}{2(${a})}`" 
                :display-mode="true" 
              />
            </div>
            <div class="text-center">
              <MathJaxRenderer 
                :expression="`x = \\frac{${-b} \\pm \\sqrt{${discriminant.toFixed(2)}}}{${2*a}}`" 
                :display-mode="true" 
              />
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

const a = ref(1)
const b = ref(-5)
const c = ref(6)
const showSolution = ref(false)
const graphCanvas = ref(null)

const discriminant = computed(() => {
  return b.value * b.value - 4 * a.value * c.value
})

const vertex = computed(() => {
  const x = -b.value / (2 * a.value)
  const y = a.value * x * x + b.value * x + c.value
  return { x: x.toFixed(2), y: y.toFixed(2) }
})

const solutions = computed(() => {
  if (discriminant.value < 0) return 'No real solutions'
  if (discriminant.value === 0) {
    const x = -b.value / (2 * a.value)
    return `x = ${x.toFixed(2)}`
  }
  const x1 = (-b.value + Math.sqrt(discriminant.value)) / (2 * a.value)
  const x2 = (-b.value - Math.sqrt(discriminant.value)) / (2 * a.value)
  return `x = ${x1.toFixed(2)} or x = ${x2.toFixed(2)}`
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
  const yMin = -15, yMax = 15
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
  
  // Draw parabola
  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 3
  ctx.beginPath()
  
  let firstPoint = true
  for (let x = xMin; x <= xMax; x += 0.1) {
    const y = a.value * x * x + b.value * x + c.value
    if (y >= yMin && y <= yMax) {
      if (firstPoint) {
        ctx.moveTo(toCanvasX(x), toCanvasY(y))
        firstPoint = false
      } else {
        ctx.lineTo(toCanvasX(x), toCanvasY(y))
      }
    }
  }
  ctx.stroke()
  
  // Highlight vertex
  const vertexX = parseFloat(vertex.value.x)
  const vertexY = parseFloat(vertex.value.y)
  if (vertexY >= yMin && vertexY <= yMax) {
    ctx.fillStyle = '#dc2626'
    ctx.beginPath()
    ctx.arc(toCanvasX(vertexX), toCanvasY(vertexY), 5, 0, 2 * Math.PI)
    ctx.fill()
  }
  
  // Mark x-intercepts if they exist
  if (discriminant.value >= 0) {
    ctx.fillStyle = '#2563eb'
    if (discriminant.value === 0) {
      const x = -b.value / (2 * a.value)
      if (x >= xMin && x <= xMax) {
        ctx.beginPath()
        ctx.arc(toCanvasX(x), toCanvasY(0), 4, 0, 2 * Math.PI)
        ctx.fill()
      }
    } else {
      const x1 = (-b.value + Math.sqrt(discriminant.value)) / (2 * a.value)
      const x2 = (-b.value - Math.sqrt(discriminant.value)) / (2 * a.value)
      
      if (x1 >= xMin && x1 <= xMax) {
        ctx.beginPath()
        ctx.arc(toCanvasX(x1), toCanvasY(0), 4, 0, 2 * Math.PI)
        ctx.fill()
      }
      
      if (x2 >= xMin && x2 <= xMax) {
        ctx.beginPath()
        ctx.arc(toCanvasX(x2), toCanvasY(0), 4, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }
  
  // Add legend (theme-agnostic)
  ctx.fillStyle = '#495057'
  ctx.font = '12px Inter, sans-serif'
  ctx.fillText('Parabola', 10, 20)
  ctx.fillStyle = '#dc2626'
  ctx.fillText('Vertex', 10, 35)
  ctx.fillStyle = '#2563eb'
  ctx.fillText('X-intercepts', 10, 50)
}

onMounted(() => {
  nextTick(() => {
    drawGraph()
  })
})

// Watch for changes and redraw
watch([a, b, c], () => {
  nextTick(() => {
    drawGraph()
  })
})
</script>

<style scoped>
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