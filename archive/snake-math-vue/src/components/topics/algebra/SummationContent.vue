<template>
  <!-- Introduction Card -->
  <div class="card mb-4">
    <div class="card-header bg-primary text-white">
      <h2 class="h4 mb-0"><i class="fas fa-sigma me-2"></i>Summation Notation</h2>
    </div>
    <div class="card-body">
      <p class="lead">Summation notation is the mathematical equivalent of a <code>for</code> loop—it's a compact way to express "add up all these values from i=start to i=end". Perfect for algorithm analysis!</p>
      
      <div class="alert alert-info" role="alert">
        <strong>Sigma Notation:</strong> Mathematical for-loop syntax
      </div>
      <div class="text-center mb-3">
        <MathJaxRenderer 
          expression="\\sum_{i=1}^{n} a_i = a_1 + a_2 + \\cdots + a_n" 
          :display-mode="true" 
        />
      </div>
      <p>This represents the sum from <code>i=1</code> to <code>n</code> of terms <code>a_i</code>.</p>
    </div>
  </div>

  <!-- Interactive Summation Explorer (Standard Layout) -->
  <div class="card mb-4">
    <div class="card-header bg-primary text-white">
      <h3 class="h5 mb-0"><i class="fas fa-sigma me-2"></i>Interactive Summation Explorer</h3>
    </div>
    <div class="card-body">
      <!-- 1. Generated Equation -->
      <div class="equation-section text-center p-3 bg-light rounded mb-4">
        <h6 class="text-muted mb-2">Current Summation:</h6>
        <MathJaxRenderer 
          :expression="summationExpression" 
          :display-mode="true" 
        />
        
        <div class="mt-3">
          <div class="alert alert-success mb-2">
            <strong>Result:</strong> {{ calculatedSum }}
            <span v-if="hasFormula" class="ms-3">
              <strong>Formula:</strong> {{ formulaResult }}
            </span>
          </div>
          
          <div class="small text-muted">
            <strong>Step-by-step:</strong> {{ terms.join(' + ') }} = {{ calculatedSum }}
          </div>
        </div>
      </div>
      
      <!-- 2. Visualization -->
      <div class="visualization-section mb-4">
        <div class="text-center">
          <canvas ref="graphCanvas" width="600" height="400" class="rounded" style="max-width: 100%; height: auto; background-color: #f8f9fa; border: 1px solid #dee2e6;"></canvas>
        </div>
        <p class="text-muted text-center mt-2 small">Bar chart visualization of summation terms</p>
        
        <!-- Programming Equivalent -->
        <div class="mt-3 p-3 bg-dark text-light rounded">
          <h6 class="text-light mb-2"><i class="fas fa-code me-2"></i>Programming Equivalent:</h6>
          <pre class="mb-0"><code>{{ codeEquivalent }}</code></pre>
        </div>
      </div>
      
      <!-- 3. Controls -->
      <div class="controls-section">
        <h6 class="text-primary mb-3"><i class="fas fa-sliders-h me-2"></i>Summation Parameters</h6>
        
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <label class="form-label">Start (lower limit): <span class="badge bg-primary">{{ startIndex }}</span></label>
            <input type="range" class="form-range" v-model.number="startIndex" min="1" max="10" step="1">
            <small class="text-muted">Starting index value</small>
          </div>
          <div class="col-md-4">
            <label class="form-label">End (upper limit): <span class="badge bg-primary">{{ endIndex }}</span></label>
            <input type="range" class="form-range" v-model.number="endIndex" :min="startIndex" max="20" step="1">
            <small class="text-muted">Ending index value</small>
          </div>
          <div class="col-md-4">
            <label class="form-label">Function type:</label>
            <select class="form-select" v-model="functionType">
              <option value="identity">i (identity)</option>
              <option value="square">i² (squares)</option>
              <option value="cube">i³ (cubes)</option>
              <option value="even">2i (even numbers)</option>
              <option value="geometric">2^i (powers of 2)</option>
            </select>
            <small class="text-muted">Function to sum over</small>
          </div>
        </div>
        
        <!-- Term Details & Formulas -->
        <div class="row g-4">
          <div class="col-md-6">
            <h6 class="small text-primary mb-2">Individual Terms:</h6>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>i</th>
                    <th>{{ functionLabel }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="i in termRange" :key="i">
                    <td>{{ i }}</td>
                    <td>{{ calculateTerm(i) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="col-md-6">
            <h6 class="small text-primary mb-2">Common Formulas & Applications:</h6>
            <div class="small">
              <ul class="mb-3">
                <li><MathJaxRenderer expression="\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}" /></li>
                <li><MathJaxRenderer expression="\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}" /></li>
                <li><MathJaxRenderer expression="\\sum_{i=0}^{n} r^i = \\frac{1-r^{n+1}}{1-r}" /></li>
              </ul>
              
              <p class="mb-2"><strong>Algorithm Analysis Applications:</strong></p>
              <ul class="mb-0">
                <li>Time complexity calculations</li>
                <li>Loop analysis</li>
                <li>Average case scenarios</li>
                <li>Data structure operations</li>
              </ul>
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

const startIndex = ref(1)
const endIndex = ref(5)
const functionType = ref('identity')
const graphCanvas = ref(null)

const functionConfig = {
  identity: { label: 'i', expr: 'i', calc: (i) => i },
  square: { label: 'i²', expr: 'i^2', calc: (i) => i * i },
  cube: { label: 'i³', expr: 'i^3', calc: (i) => i * i * i },
  even: { label: '2i', expr: '2i', calc: (i) => 2 * i },
  geometric: { label: '2^i', expr: '2^i', calc: (i) => Math.pow(2, i) }
}

const summationExpression = computed(() => {
  const config = functionConfig[functionType.value]
  return `\\sum_{i=${startIndex.value}}^{${endIndex.value}} ${config.expr}`
})

const functionLabel = computed(() => {
  return functionConfig[functionType.value].label
})

const termRange = computed(() => {
  const range = []
  for (let i = startIndex.value; i <= endIndex.value; i++) {
    range.push(i)
  }
  return range
})

const calculateTerm = (i) => {
  return functionConfig[functionType.value].calc(i)
}

const terms = computed(() => {
  return termRange.value.map(i => calculateTerm(i))
})

const calculatedSum = computed(() => {
  return terms.value.reduce((sum, term) => sum + term, 0)
})

const hasFormula = computed(() => {
  return functionType.value === 'identity' || functionType.value === 'square'
})

const formulaResult = computed(() => {
  const n = endIndex.value
  const start = startIndex.value
  
  if (functionType.value === 'identity' && start === 1) {
    return `${n}(${n}+1)/2 = ${n * (n + 1) / 2}`
  } else if (functionType.value === 'square' && start === 1) {
    return `${n}(${n}+1)(${2*n}+1)/6 = ${n * (n + 1) * (2*n + 1) / 6}`
  }
  return ''
})

const codeEquivalent = computed(() => {
  const config = functionConfig[functionType.value]
  return `let sum = 0;
for (let i = ${startIndex.value}; i <= ${endIndex.value}; i++) {
    sum += ${config.label.replace('i', 'i')};
}
// sum = ${calculatedSum.value}`
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
  
  const values = terms.value
  const maxValue = Math.max(...values)
  const numBars = values.length
  
  // Calculate bar dimensions
  const margin = 50
  const barWidth = (width - 2 * margin) / numBars
  const maxBarHeight = height - 2 * margin
  
  // Draw bars
  values.forEach((value, index) => {
    const barHeight = (value / maxValue) * maxBarHeight
    const x = margin + index * barWidth
    const y = height - margin - barHeight
    
    // Draw bar
    ctx.fillStyle = '#10b981'
    ctx.fillRect(x + barWidth * 0.1, y, barWidth * 0.8, barHeight)
    
    // Draw value label on bar
    ctx.fillStyle = '#495057'
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
    
    // Draw index label below bar
    ctx.fillText(`i=${startIndex.value + index}`, x + barWidth / 2, height - margin + 20)
  })
  
  // Draw title
  ctx.fillStyle = '#495057'
  ctx.font = '14px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${functionLabel.value} values from i=${startIndex.value} to i=${endIndex.value}`, width / 2, 25)
  
  // Draw sum result
  ctx.fillStyle = '#10b981'
  ctx.font = 'bold 16px Inter, sans-serif'
  ctx.fillText(`Sum = ${calculatedSum.value}`, width / 2, height - 10)
}

onMounted(() => {
  nextTick(() => {
    drawGraph()
  })
})

// Watch for changes and redraw
watch([startIndex, endIndex, functionType], () => {
  nextTick(() => {
    drawGraph()
  })
})
</script>

<style scoped>
pre code {
  font-size: 0.875rem;
  line-height: 1.4;
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
  
  .sticky-top {
    position: relative !important;
    top: auto !important;
  }
}
</style>