<template>
  <!-- Introduction Card -->
  <div class="card mb-4">
    <div class="card-header bg-primary text-white">
      <h2 class="h4 mb-0"><i class="fas fa-chart-area me-2"></i>Exponential Functions</h2>
    </div>
    <div class="card-body">
      <p class="lead">Exponentials are the "compound interest" of mathematics—small changes create massive effects over time. In programming, think of them as recursive functions that grow or shrink at accelerating rates.</p>
      
      <div class="alert alert-info" role="alert">
        <strong>General Form:</strong> Perfect for modeling growth and decay
      </div>
      <div class="text-center mb-3">
        <MathJaxRenderer 
          expression="f(x) = a \\cdot b^x" 
          :display-mode="true" 
        />
      </div>
      <p>Where <code>a > 0</code> (initial value) and <code>b > 0, b ≠ 1</code> (growth/decay factor).</p>
    </div>
  </div>

  <!-- Interactive Exponential Explorer (Standard Layout) -->
  <div class="card mb-4">
    <div class="card-header bg-primary text-white">
      <h3 class="h5 mb-0"><i class="fas fa-chart-area me-2"></i>Interactive Exponential Explorer</h3>
    </div>
    <div class="card-body">
      <!-- 1. Generated Equation -->
      <div class="equation-section text-center p-3 bg-light rounded mb-4">
        <h6 class="text-muted mb-2">Current Function:</h6>
        <MathJaxRenderer 
          :expression="`f(x) = ${a} \\\\cdot ${b}^x`" 
          :display-mode="true" 
        />
        
        <div class="mt-3">
          <div class="alert" :class="growthType.class" role="alert">
            <strong>{{ growthType.label }}:</strong> {{ growthType.description }}
          </div>
        </div>
      </div>
      
      <!-- 2. Graph Visualization -->
      <div class="visualization-section mb-4">
        <div class="text-center">
          <canvas ref="graphCanvas" width="600" height="400" class="rounded" style="max-width: 100%; height: auto; background-color: #f8f9fa; border: 1px solid #dee2e6;"></canvas>
        </div>
        <p class="text-muted text-center mt-2 small">Exponential function visualization with key points and asymptote</p>
        
        <!-- Programming Applications -->
        <div class="mt-3 row g-3">
          <div class="col-md-6">
            <div class="p-3 bg-light rounded">
              <h6 class="small text-primary mb-2"><i class="fas fa-server me-2"></i>Server Load Example</h6>
              <p class="small mb-1">If each user invites 2 friends:</p>
              <MathJaxRenderer expression="users(day) = 1 \\cdot 2^{day}" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-3 bg-light rounded">
              <h6 class="small text-primary mb-2"><i class="fas fa-memory me-2"></i>Cache Decay Example</h6>
              <p class="small mb-1">Memory cleanup over time:</p>
              <MathJaxRenderer expression="memory(t) = 100 \\cdot 0.9^t" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 3. Controls -->
      <div class="controls-section">
        <h6 class="text-primary mb-3"><i class="fas fa-sliders-h me-2"></i>Function Parameters</h6>
        
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <label class="form-label">Initial Value (a): <span class="badge bg-primary">{{ a }}</span></label>
            <input type="range" class="form-range" v-model.number="a" min="0.1" max="10" step="0.1">
            <small class="text-muted">Starting amount (y-intercept)</small>
          </div>
          <div class="col-md-6">
            <label class="form-label">Base (b): <span class="badge bg-primary">{{ b }}</span></label>
            <input type="range" class="form-range" v-model.number="b" min="0.1" max="3" step="0.1">
            <small class="text-muted">Growth factor (b > 1: growth, b < 1: decay)</small>
          </div>
        </div>
        
        <!-- Function Analysis -->
        <div class="row g-4">
          <div class="col-md-6">
            <h6 class="small text-primary mb-2">Sample Values:</h6>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>x</th>
                    <th>f(x)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="x in sampleXValues" :key="x">
                    <td>{{ x }}</td>
                    <td>{{ calculateFunctionValue(x) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="col-md-6">
            <h6 class="small text-primary mb-2">Key Properties:</h6>
            <ul class="small mb-3">
              <li><strong>Domain:</strong> All real numbers</li>
              <li><strong>Range:</strong> (0, ∞)</li>
              <li><strong>Y-intercept:</strong> {{ a }}</li>
              <li><strong>Horizontal asymptote:</strong> y = 0</li>
              <li><strong>Rate:</strong> {{ ((b - 1) * 100).toFixed(1) }}% per unit</li>
            </ul>
            
            <h6 class="small text-primary mb-2">Logarithmic Inverse:</h6>
            <div class="text-center p-2 bg-light rounded">
              <MathJaxRenderer 
                :expression="`\\\\log_${b}(y) = x`" 
                :display-mode="false" 
              />
            </div>
            <small class="text-muted">Useful for finding when f(x) = specific value</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import MathJaxRenderer from '@/components/common/MathJaxRenderer.vue'

const a = ref(2)
const b = ref(1.5)
const graphCanvas = ref(null)

const sampleXValues = [0, 1, 2, 3, 4, 5]

const growthType = computed(() => {
  if (b.value > 1) {
    return {
      label: 'Exponential Growth',
      description: 'Function increases rapidly as x increases',
      class: 'alert-success'
    }
  } else if (b.value < 1) {
    return {
      label: 'Exponential Decay', 
      description: 'Function decreases rapidly as x increases',
      class: 'alert-warning'
    }
  } else {
    return {
      label: 'Constant Function',
      description: 'Function remains constant (not exponential)',
      class: 'alert-info'
    }
  }
})

const calculateFunctionValue = (x) => {
  const result = a.value * Math.pow(b.value, x)
  return result.toFixed(2)
}

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
  const xMin = -3, xMax = 5
  const yMin = -2, yMax = 20
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
  for (let y = yMin; y <= yMax; y += 2) {
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
  
  // Draw exponential function
  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 3
  ctx.beginPath()
  
  let firstPoint = true
  for (let x = xMin; x <= xMax; x += 0.1) {
    const y = a.value * Math.pow(b.value, x)
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
  
  // Highlight y-intercept (when x = 0)
  const yIntercept = a.value
  if (yIntercept >= yMin && yIntercept <= yMax) {
    ctx.fillStyle = '#dc2626'
    ctx.beginPath()
    ctx.arc(toCanvasX(0), toCanvasY(yIntercept), 5, 0, 2 * Math.PI)
    ctx.fill()
  }
  
  // Highlight key points at integer x values
  ctx.fillStyle = '#2563eb'
  for (let x = Math.max(xMin, -2); x <= Math.min(xMax, 4); x++) {
    const y = a.value * Math.pow(b.value, x)
    if (y >= yMin && y <= yMax) {
      ctx.beginPath()
      ctx.arc(toCanvasX(x), toCanvasY(y), 3, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
  
  // Draw horizontal asymptote (y = 0)
  ctx.strokeStyle = '#6b7280'
  ctx.setLineDash([5, 5])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, toCanvasY(0))
  ctx.lineTo(width, toCanvasY(0))
  ctx.stroke()
  ctx.setLineDash([]) // Reset line dash
  
  // Add legend (theme-agnostic)
  ctx.fillStyle = '#495057'
  ctx.font = '12px Inter, sans-serif'
  ctx.fillText('Exponential Curve', 10, 20)
  ctx.fillStyle = '#dc2626'
  ctx.fillText('Y-intercept', 10, 35)
  ctx.fillStyle = '#2563eb'
  ctx.fillText('Key Points', 10, 50)
  ctx.fillStyle = '#6b7280'
  ctx.fillText('Asymptote (y=0)', 10, 65)
}

onMounted(() => {
  nextTick(() => {
    drawGraph()
  })
})

// Watch for changes and redraw
watch([a, b], () => {
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
  
  .sticky-top {
    position: relative !important;
    top: auto !important;
  }
}
</style>