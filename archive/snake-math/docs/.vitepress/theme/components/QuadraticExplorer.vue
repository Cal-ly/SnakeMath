<!--
Component conceptualization:
Create an interactive quadratic functions explorer where users can:
- Adjust coefficients a, b, c with sliders to see real-time parabola changes
- Visualize vertex, axis of symmetry, and roots with labeled markers
- Switch between different forms (standard, vertex, factored) with dynamic conversion
- Interactive discrimination analysis showing root types and calculations
- Real-world scenario selector (projectile motion, profit optimization, parabolic dishes)
- Transformation animation showing how each coefficient affects the graph shape
- Problem-solving mode with step-by-step quadratic formula derivation
- Graphing calculator functionality with multiple quadratic overlay
- Coefficient comparison tool showing how changing values affects key features
The component should make the connection between algebraic manipulation and geometric visualization clear and intuitive.
-->
<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Interactive Quadratic Function Explorer</h3>
      
      <div class="controls-grid">
        <div class="input-group">
          <label>Form:</label>
          <select v-model="currentForm" @change="switchForm" class="function-select">
            <option value="standard">Standard: ax² + bx + c</option>
            <option value="vertex">Vertex: a(x - h)² + k</option>
            <option value="factored">Factored: a(x - r₁)(x - r₂)</option>
          </select>
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showTransformation">
            Show Transformation Animation
          </label>
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showMultiple">
            Multiple Quadratics Overlay
          </label>
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showSteps">
            Show Problem-Solving Steps
          </label>
        </div>
      </div>
      
      <div v-if="currentForm === 'standard'" class="interactive-card">
        <h4 class="input-group-title">Standard Form: f(x) = ax² + bx + c</h4>
        <div class="component-inputs">
          <div class="input-group">
            <label>a coefficient:</label>
            <input type="range" v-model="a" min="-3" max="3" step="0.1" @input="updateQuadratic" class="range-input">
            <span class="result-value">{{ a }}</span>
            <span class="description">({{ getADescription() }})</span>
          </div>
          
          <div class="input-group">
            <label>b coefficient:</label>
            <input type="range" v-model="b" min="-5" max="5" step="0.1" @input="updateQuadratic" class="range-input">
            <span class="result-value">{{ b }}</span>
            <span class="description">({{ getBDescription() }})</span>
          </div>
          
          <div class="input-group">
            <label>c coefficient:</label>
            <input type="range" v-model="c" min="-10" max="10" step="0.1" @input="updateQuadratic" class="range-input">
            <span class="result-value">{{ c }}</span>
            <span class="description">(y-intercept)</span>
          </div>
        </div>
      </div>
      
      <div v-if="currentForm === 'vertex'" class="interactive-card">
        <h4 class="input-group-title">Vertex Form: f(x) = a(x - h)² + k</h4>
        <div class="component-inputs">
          <div class="input-group">
            <label>a coefficient:</label>
            <input type="range" v-model="vertexA" min="-3" max="3" step="0.1" @input="updateFromVertex" class="range-input">
            <span class="result-value">{{ vertexA }}</span>
          </div>
          
          <div class="input-group">
            <label>h (x-coordinate of vertex):</label>
            <input type="range" v-model="h" min="-5" max="5" step="0.1" @input="updateFromVertex" class="range-input">
            <span class="result-value">{{ h }}</span>
          </div>
          
          <div class="input-group">
            <label>k (y-coordinate of vertex):</label>
            <input type="range" v-model="k" min="-10" max="10" step="0.1" @input="updateFromVertex" class="range-input">
            <span class="result-value">{{ k }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="currentForm === 'factored'" class="interactive-card">
        <h4 class="input-group-title">Factored Form: f(x) = a(x - r₁)(x - r₂)</h4>
        <div class="component-inputs">
          <div class="input-group">
            <label>a coefficient:</label>
            <input type="range" v-model="factoredA" min="-3" max="3" step="0.1" @input="updateFromFactored" class="range-input">
            <span class="result-value">{{ factoredA }}</span>
          </div>
          
          <div class="input-group">
            <label>r₁ (first root):</label>
            <input type="range" v-model="r1" min="-5" max="5" step="0.1" @input="updateFromFactored" class="range-input">
            <span class="result-value">{{ r1 }}</span>
          </div>
          
          <div class="input-group">
            <label>r₂ (second root):</label>
            <input type="range" v-model="r2" min="-5" max="5" step="0.1" @input="updateFromFactored" class="range-input">
            <span class="result-value">{{ r2 }}</span>
          </div>
        </div>
      </div>
      
      <div class="controls-grid">
        <h4 class="input-group-title">Example Functions:</h4>
        <button @click="loadPreset('standard')" class="preset-btn">Standard Parabola</button>
        <button @click="loadPreset('wide')" class="preset-btn">Wide Parabola</button>
        <button @click="loadPreset('narrow')" class="preset-btn">Narrow Parabola</button>
        <button @click="loadPreset('shifted')" class="preset-btn">Shifted Parabola</button>
      </div>
      
      <div class="controls-grid">
        <h4 class="input-group-title">Real-World Scenarios:</h4>
        <button @click="loadScenario('projectile')" class="preset-btn">Projectile Motion</button>
        <button @click="loadScenario('profit')" class="preset-btn">Profit Optimization</button>
        <button @click="loadScenario('parabolic')" class="preset-btn">Parabolic Dish</button>
      </div>
    </div>
    
    <div class="forms-display">
      <div class="form-card" :class="{ active: currentForm === 'standard' }">
        <h4>Standard Form</h4>
        <div class="equation">f(x) = {{ formatCoefficient(a, 'x²') }}{{ formatCoefficient(b, 'x', true) }}{{ formatConstant(c) }}</div>
      </div>
      
      <div class="form-card" :class="{ active: currentForm === 'vertex' }">
        <h4>Vertex Form</h4>
        <div class="equation">f(x) = {{ a }}(x {{ h >= 0 ? '- ' + h : '+ ' + Math.abs(h) }})² {{ k >= 0 ? '+ ' + k : '- ' + Math.abs(k) }}</div>
      </div>
      
      <div v-if="hasRealRoots" class="form-card" :class="{ active: currentForm === 'factored' }">
        <h4>Factored Form</h4>
        <div class="equation">f(x) = {{ a }}(x {{ roots[0] >= 0 ? '- ' + roots[0] : '+ ' + Math.abs(roots[0]) }})(x {{ roots[1] >= 0 ? '- ' + roots[1] : '+ ' + Math.abs(roots[1]) }})</div>
      </div>
      
      <div v-else class="form-card disabled">
        <h4>Factored Form</h4>
        <div class="equation">No real roots - factored form not available</div>
      </div>
    </div>
    
    <div class="visualization-container">
      <canvas ref="plotCanvas" width="600px" height="500px" class="visualization-canvas"></canvas>
      <div class="plot-legend">
        <div class="legend-item">
          <div class="color-sample" style="background: #2196F3;"></div>
          <span>Parabola</span>
        </div>
        <div class="legend-item">
          <div class="color-sample" style="background: #FF5722;"></div>
          <span>Vertex ({{ vertex.x }}, {{ vertex.y }})</span>
        </div>
        <div class="legend-item">
          <div class="color-sample" style="background: #4CAF50;"></div>
          <span>Axis of Symmetry (x = {{ vertex.x }})</span>
        </div>
        <div v-if="hasRealRoots" class="legend-item">
          <div class="color-sample" style="background: #9C27B0;"></div>
          <span>Roots {{ roots.length === 1 ? '(' + roots[0] + ')' : '(' + roots[0] + ', ' + roots[1] + ')' }}</span>
        </div>
        <div class="legend-item">
          <div class="color-sample" style="background: #FF9800;"></div>
          <span>Y-Intercept (0, {{ c }})</span>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <div class="results-grid">
        <div class="result-card">
          <h4 class="result-label">Vertex</h4>
          <div class="vertex-info">
            <div>x = {{ vertex.x }}</div>
            <div>y = {{ vertex.y }}</div>
            <div class="point">({{ vertex.x }}, {{ vertex.y }})</div>
            <div class="vertex-type">{{ vertexType }}</div>
          </div>
        </div>
        
        <div class="result-card">
          <h4 class="result-label">Axis of Symmetry</h4>
          <div class="axis-info">
            <div>x = {{ vertex.x }}</div>
            <div class="description">Vertical line through vertex</div>
          </div>
        </div>
        
        <div class="result-card">
          <h4 class="result-label">Y-Intercept</h4>
          <div class="intercept-info">
            <div>(0, {{ c }})</div>
            <div class="description">Point where parabola crosses y-axis</div>
          </div>
        </div>
        
        <div class="result-card">
          <h4 class="result-label">Discriminant Analysis</h4>
          <div class="discriminant-info">
            <div class="discriminant-calc">Δ = b² - 4ac = {{ b }}² - 4({{ a }})({{ c }}) = {{ discriminant }}</div>
            <div class="discriminant-meaning" :class="getDiscriminantClass()">
              {{ getDiscriminantMeaning() }}
            </div>
            <div class="roots-info">{{ rootsDescription }}</div>
          </div>
        </div>
        
        <div v-if="hasRealRoots" class="result-card">
          <h4 class="result-label">X-Intercepts (Roots)</h4>
          <div class="roots-info">
            <div v-if="roots.length === 1">
              x = {{ roots[0] }} (repeated root)
            </div>
            <div v-else>
              <div>x₁ = {{ roots[0] }}</div>
              <div>x₂ = {{ roots[1] }}</div>
            </div>
          </div>
        </div>
        
        <div class="result-card">
          <h4 class="result-label">Domain & Range</h4>
          <div class="domain-range">
            <div><strong>Domain:</strong> (-∞, ∞)</div>
            <div><strong>Range:</strong> {{ rangeDescription }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showSteps" class="component-section">
      <h4 class="input-group-title">Step-by-Step Quadratic Formula Derivation</h4>
      <div class="step-by-step">
        <div v-for="(step, index) in solutionSteps" :key="index" class="solution-step">
          <div class="step-number">Step {{ index + 1 }}:</div>
          <div class="step-description">{{ step.description }}</div>
          <div class="step-equation">{{ step.equation }}</div>
        </div>
      </div>
    </div>
    
    <div v-if="currentScenario" class="component-section">
      <h4 class="input-group-title">Real-World Application: {{ scenarioDetails.title }}</h4>
      <div class="scenario-details">
        <p>{{ scenarioDetails.description }}</p>
        <div class="scenario-equation">
          <strong>Equation:</strong> {{ scenarioDetails.equation }}
        </div>
        <div class="scenario-interpretation">
          <strong>Interpretation:</strong>
          <ul>
            <li v-for="point in scenarioDetails.keyPoints" :key="point">{{ point }}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div v-if="showMultiple" class="component-section">
      <h4 class="input-group-title">Multiple Quadratics Comparison</h4>
      <div class="comparison-controls">
        <div class="input-group">
          <label>Add comparison function:</label>
          <button @click="addComparison" class="btn-primary">Add Function</button>
          <button @click="clearComparisons" class="btn-secondary">Clear All</button>
        </div>
      </div>
      <div class="comparison-list">
        <div v-for="(comp, index) in comparisons" :key="index" class="comparison-item">
          <span class="comparison-color" :style="{ background: comp.color }"></span>
          <span class="comparison-equation">f{{ index + 2 }}(x) = {{ comp.equation }}</span>
          <button @click="removeComparison(index)" class="remove-btn">&times;</button>
        </div>
      </div>
    </div>
    
    <div class="interactive-card">
      <h4 class="input-group-title">Function Calculator</h4>
      <div class="component-inputs">
        <label>Evaluate f(x) at x =</label>
        <input type="number" v-model="evalX" @input="evaluateFunction" step="0.1" class="eval-input">
        <span class="result-value">f({{ evalX }}) = {{ evalResult }}</span>
      </div>
      
      <div class="solver">
        <h4 class="input-group-title">Equation Solver</h4>
        <div class="component-inputs">
          <label>Solve f(x) =</label>
          <input type="number" v-model="solveY" @input="solveEquation" step="0.1" class="eval-input">
          <div class="solve-result">{{ solveResult }}</div>
        </div>
      </div>
      
      <div class="coefficient-comparison">
        <h4 class="input-group-title">Coefficient Impact Analysis</h4>
        <div class="impact-analysis">
          <div class="impact-item">
            <strong>Parameter 'a' ({{ a }}):</strong> {{ getAImpact() }}
          </div>
          <div class="impact-item">
            <strong>Parameter 'b' ({{ b }}):</strong> {{ getBImpact() }}
          </div>
          <div class="impact-item">
            <strong>Parameter 'c' ({{ c }}):</strong> {{ getCImpact() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Core quadratic parameters
const a = ref(1)
const b = ref(0)
const c = ref(0)

// Vertex form parameters
const vertexA = ref(1)
const h = ref(0)
const k = ref(0)

// Factored form parameters
const factoredA = ref(1)
const r1 = ref(-1)
const r2 = ref(1)

// UI state
const currentForm = ref('standard')
const showTransformation = ref(false)
const showMultiple = ref(false)
const showSteps = ref(false)
const currentScenario = ref(null)

// Calculator variables
const evalX = ref(0)
const evalResult = ref(0)
const solveY = ref(0)
const solveResult = ref('')
const plotCanvas = ref(null)

// Comparison functions
const comparisons = ref([])
const comparisonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']

const vertex = computed(() => {
  const x = parseFloat((-b.value / (2 * a.value)).toFixed(3))
  const y = parseFloat((a.value * x * x + b.value * x + c.value).toFixed(3))
  return { x, y }
})

const vertexType = computed(() => {
  if (a.value > 0) return 'Minimum point'
  else if (a.value < 0) return 'Maximum point'
  else return 'Not a parabola'
})

const discriminant = computed(() => {
  return parseFloat((b.value * b.value - 4 * a.value * c.value).toFixed(3))
})

const hasRealRoots = computed(() => discriminant.value >= 0)

const roots = computed(() => {
  if (!hasRealRoots.value) return []
  
  const sqrt_discriminant = Math.sqrt(discriminant.value)
  const denominator = 2 * a.value
  
  if (discriminant.value === 0) {
    return [parseFloat((-b.value / denominator).toFixed(3))]
  } else {
    const root1 = parseFloat(((-b.value + sqrt_discriminant) / denominator).toFixed(3))
    const root2 = parseFloat(((-b.value - sqrt_discriminant) / denominator).toFixed(3))
    return [Math.min(root1, root2), Math.max(root1, root2)]
  }
})

const rootsDescription = computed(() => {
  if (discriminant.value > 0) return '2 real roots (intersects x-axis twice)'
  else if (discriminant.value === 0) return '1 real root (touches x-axis once)'
  else return 'No real roots (does not intersect x-axis)'
})

const rangeDescription = computed(() => {
  if (a.value > 0) {
    return `[${vertex.value.y}, ∞)`
  } else if (a.value < 0) {
    return `(-∞, ${vertex.value.y}]`
  } else {
    return 'Not applicable (not a parabola)'
  }
})

const solutionSteps = computed(() => {
  if (!hasRealRoots.value) return []
  
  return [
    {
      description: "Start with the standard form",
      equation: `${a.value}x² + ${b.value}x + ${c.value} = 0`
    },
    {
      description: "Apply the quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)",
      equation: `x = (-(${b.value}) ± √((${b.value})² - 4(${a.value})(${c.value}))) / (2(${a.value}))`
    },
    {
      description: "Calculate the discriminant",
      equation: `Δ = (${b.value})² - 4(${a.value})(${c.value}) = ${discriminant.value}`
    },
    {
      description: "Substitute and solve",
      equation: discriminant.value === 0 
        ? `x = ${-b.value} / ${2 * a.value} = ${roots.value[0]}`
        : `x = ${-b.value} ± ${Math.sqrt(discriminant.value).toFixed(3)} / ${2 * a.value} = ${roots.value[0]} or ${roots.value[1]}`
    }
  ]
})

const scenarioDetails = computed(() => {
  switch (currentScenario.value) {
    case 'projectile':
      return {
        title: 'Projectile Motion',
        description: 'The height of a projectile follows a quadratic path. The equation h(t) = -4.9t² + v₀t + h₀ models height over time.',
        equation: `h(t) = ${a.value}t² + ${b.value}t + ${c.value}`,
        keyPoints: [
          `Initial height: ${c.value} meters`,
          `Vertex represents maximum height: ${vertex.value.y}m at t=${vertex.value.x}s`,
          hasRealRoots.value ? `Projectile hits ground at t=${roots.value.filter(r => r > 0)[0] || 'N/A'}s` : 'Projectile does not return to ground level'
        ]
      }
    case 'profit':
      return {
        title: 'Profit Optimization',
        description: 'Business profit often follows a quadratic model. The equation P(x) = ax² + bx + c represents profit based on units sold.',
        equation: `P(x) = ${a.value}x² + ${b.value}x + ${c.value}`,
        keyPoints: [
          `Fixed costs/initial profit: $${c.value}`,
          `Optimal production level: ${vertex.value.x} units`,
          `Maximum profit: $${vertex.value.y}`,
          a.value < 0 ? 'Decreasing returns after optimum' : 'Increasing returns (unusual but possible)'
        ]
      }
    case 'parabolic':
      return {
        title: 'Parabolic Dish Design',
        description: 'Parabolic reflectors focus signals at their focal point. The shape is described by y = ax² + bx + c.',
        equation: `y = ${a.value}x² + ${b.value}x + ${c.value}`,
        keyPoints: [
          `Vertex (focus area): (${vertex.value.x}, ${vertex.value.y})`,
          `Focal point calculation depends on coefficient 'a'`,
          a.value > 0 ? 'Upward-opening dish (satellite/solar)' : 'Downward-opening reflector',
          `Dish width varies with coefficient 'a': ${Math.abs(a.value) < 1 ? 'wide focus' : 'narrow focus'}`
        ]
      }
    default:
      return null
  }
})

const getADescription = () => {
  if (a.value > 0) return 'opens upward, has minimum'
  if (a.value < 0) return 'opens downward, has maximum'
  return 'degenerate (not a parabola)'
}

const getBDescription = () => {
  if (b.value === 0) return 'axis of symmetry at x=0'
  return `shifts axis of symmetry ${b.value > 0 ? 'left' : 'right'}`
}

const getDiscriminantClass = () => {
  if (discriminant.value > 0) return 'positive-discriminant'
  if (discriminant.value === 0) return 'zero-discriminant'
  return 'negative-discriminant'
}

const getDiscriminantMeaning = () => {
  if (discriminant.value > 0) return 'Positive: Two distinct real roots'
  if (discriminant.value === 0) return 'Zero: One repeated real root'
  return 'Negative: Two complex conjugate roots'
}

const getAImpact = () => {
  const absA = Math.abs(a.value)
  if (absA > 2) return 'Makes parabola very narrow/steep'
  if (absA > 1) return 'Makes parabola moderately narrow'
  if (absA < 0.5) return 'Makes parabola very wide/flat'
  return 'Standard parabola width'
}

const getBImpact = () => {
  if (b.value === 0) return 'No horizontal shift, axis at x=0'
  const shift = -b.value / (2 * a.value)
  return `Shifts vertex horizontally to x=${shift.toFixed(2)}`
}

const getCImpact = () => {
  return `Vertical shift: moves parabola ${c.value > 0 ? 'up' : 'down'} by ${Math.abs(c.value)} units`
}

const formatCoefficient = (coeff, variable, showPlus = false) => {
  const num = parseFloat(coeff)
  if (num === 0) return ''
  
  let result = ''
  if (showPlus && num > 0) result += ' + '
  else if (showPlus && num < 0) result += ' - '
  else if (num < 0) result += '-'
  
  const absNum = Math.abs(num)
  if (absNum === 1 && variable !== '') {
    result += variable
  } else {
    result += absNum + variable
  }
  
  return result
}

const formatConstant = (coeff) => {
  const num = parseFloat(coeff)
  if (num === 0) return ''
  else if (num > 0) return ' + ' + num
  else return ' - ' + Math.abs(num)
}

const evaluateFunction = () => {
  const x = parseFloat(evalX.value)
  const result = a.value * x * x + b.value * x + c.value
  evalResult.value = parseFloat(result.toFixed(3))
  updatePlot()
}

const solveEquation = () => {
  const targetY = parseFloat(solveY.value)
  const adjustedC = c.value - targetY
  const discriminantSolve = b.value * b.value - 4 * a.value * adjustedC
  
  if (discriminantSolve < 0) {
    solveResult.value = 'No real solutions'
  } else if (discriminantSolve === 0) {
    const x = -b.value / (2 * a.value)
    solveResult.value = `x = ${x.toFixed(3)}`
  } else {
    const sqrt_disc = Math.sqrt(discriminantSolve)
    const x1 = (-b.value + sqrt_disc) / (2 * a.value)
    const x2 = (-b.value - sqrt_disc) / (2 * a.value)
    solveResult.value = `x = ${Math.min(x1, x2).toFixed(3)} or x = ${Math.max(x1, x2).toFixed(3)}`
  }
}

const loadPreset = (preset) => {
  switch (preset) {
    case 'standard':
      a.value = 1; b.value = 0; c.value = 0
      break
    case 'wide':
      a.value = 0.5; b.value = 0; c.value = 0
      break
    case 'narrow':
      a.value = 2; b.value = 0; c.value = 0
      break
    case 'shifted':
      a.value = 1; b.value = -4; c.value = 3
      break
  }
  updateQuadratic()
}

const loadScenario = (scenario) => {
  currentScenario.value = currentScenario.value === scenario ? null : scenario
  
  switch (scenario) {
    case 'projectile':
      a.value = -4.9; b.value = 20; c.value = 1.5
      break
    case 'profit':
      a.value = -0.1; b.value = 50; c.value = -200
      break
    case 'parabolic':
      a.value = 0.25; b.value = 0; c.value = 0
      break
  }
  updateQuadratic()
}

const switchForm = () => {
  // Convert between forms when switching
  switch (currentForm.value) {
    case 'vertex':
      vertexA.value = a.value
      h.value = vertex.value.x
      k.value = vertex.value.y
      break
    case 'factored':
      if (hasRealRoots.value) {
        factoredA.value = a.value
        r1.value = roots.value[0]
        r2.value = roots.value[1] || roots.value[0]
      }
      break
  }
}

const updateFromVertex = () => {
  // Convert vertex form to standard form
  a.value = vertexA.value
  b.value = -2 * vertexA.value * h.value
  c.value = vertexA.value * h.value * h.value + k.value
  updateQuadratic()
}

const updateFromFactored = () => {
  // Convert factored form to standard form
  a.value = factoredA.value
  b.value = -factoredA.value * (r1.value + r2.value)
  c.value = factoredA.value * r1.value * r2.value
  updateQuadratic()
}

const addComparison = () => {
  if (comparisons.value.length < 6) {
    const colorIndex = comparisons.value.length
    comparisons.value.push({
      a: parseFloat((Math.random() * 4 - 2).toFixed(1)),
      b: parseFloat((Math.random() * 10 - 5).toFixed(1)),
      c: parseFloat((Math.random() * 20 - 10).toFixed(1)),
      color: comparisonColors[colorIndex],
      equation: ''
    })
    
    // Update equation display
    const comp = comparisons.value[comparisons.value.length - 1]
    comp.equation = `${comp.a}x² + ${comp.b}x + ${comp.c}`
    updatePlot()
  }
}

const removeComparison = (index) => {
  comparisons.value.splice(index, 1)
  updatePlot()
}

const clearComparisons = () => {
  comparisons.value = []
  updatePlot()
}

const updateQuadratic = () => {
  evaluateFunction()
  solveEquation()
  updatePlot()
}

const updatePlot = () => {
  const canvas = plotCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Set up coordinate system
  const xMin = -10
  const xMax = 10
  const yMin = -15
  const yMax = 15
  
  const xScale = width / (xMax - xMin)
  const yScale = height / (yMax - yMin)
  
  const toCanvasX = (x) => (x - xMin) * xScale
  const toCanvasY = (y) => height - (y - yMin) * yScale
  
  // Draw grid
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  
  for (let x = xMin; x <= xMax; x++) {
    ctx.beginPath()
    ctx.moveTo(toCanvasX(x), 0)
    ctx.lineTo(toCanvasX(x), height)
    ctx.stroke()
  }
  
  for (let y = yMin; y <= yMax; y += 5) {
    ctx.beginPath()
    ctx.moveTo(0, toCanvasY(y))
    ctx.lineTo(width, toCanvasY(y))
    ctx.stroke()
  }
  
  // Draw axes
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  
  ctx.beginPath()
  ctx.moveTo(0, toCanvasY(0))
  ctx.lineTo(width, toCanvasY(0))
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(toCanvasX(0), 0)
  ctx.lineTo(toCanvasX(0), height)
  ctx.stroke()
  
  // Draw comparison functions first (background)
  if (showMultiple.value) {
    comparisons.value.forEach((comp, index) => {
      ctx.strokeStyle = comp.color
      ctx.lineWidth = 2
      ctx.setLineDash([5, 3])
      ctx.beginPath()
      
      let firstPoint = true
      for (let x = xMin; x <= xMax; x += 0.1) {
        const y = comp.a * x * x + comp.b * x + comp.c
        
        if (y >= yMin && y <= yMax) {
          const canvasX = toCanvasX(x)
          const canvasY = toCanvasY(y)
          
          if (firstPoint) {
            ctx.moveTo(canvasX, canvasY)
            firstPoint = false
          } else {
            ctx.lineTo(canvasX, canvasY)
          }
        }
      }
      ctx.stroke()
      ctx.setLineDash([])
    })
  }
  
  // Draw main quadratic function
  ctx.strokeStyle = '#2196F3'
  ctx.lineWidth = 4
  ctx.beginPath()
  
  let firstPoint = true
  for (let x = xMin; x <= xMax; x += 0.05) {
    const y = a.value * x * x + b.value * x + c.value
    
    if (y >= yMin && y <= yMax) {
      const canvasX = toCanvasX(x)
      const canvasY = toCanvasY(y)
      
      if (firstPoint) {
        ctx.moveTo(canvasX, canvasY)
        firstPoint = false
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }
  }
  ctx.stroke()
  
  // Draw vertex
  const vertexX = toCanvasX(vertex.value.x)
  const vertexY = toCanvasY(vertex.value.y)
  
  ctx.fillStyle = '#FF5722'
  ctx.beginPath()
  ctx.arc(vertexX, vertexY, 6, 0, 2 * Math.PI)
  ctx.fill()
  
  // Draw axis of symmetry
  ctx.strokeStyle = '#4CAF50'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(vertexX, 0)
  ctx.lineTo(vertexX, height)
  ctx.stroke()
  ctx.setLineDash([])
  
  // Draw roots if they exist
  if (hasRealRoots.value) {
    ctx.fillStyle = '#9C27B0'
    roots.value.forEach(root => {
      const rootX = toCanvasX(root)
      const rootY = toCanvasY(0)
      ctx.beginPath()
      ctx.arc(rootX, rootY, 5, 0, 2 * Math.PI)
      ctx.fill()
    })
  }
  
  // Draw y-intercept
  ctx.fillStyle = '#FF9800'
  ctx.beginPath()
  ctx.arc(toCanvasX(0), toCanvasY(c.value), 5, 0, 2 * Math.PI)
  ctx.fill()
  
  // Draw evaluation point
  if (evalX.value >= xMin && evalX.value <= xMax) {
    const evalCanvasX = toCanvasX(evalX.value)
    const evalCanvasY = toCanvasY(evalResult.value)
    
    ctx.fillStyle = '#E91E63'
    ctx.beginPath()
    ctx.arc(evalCanvasX, evalCanvasY, 5, 0, 2 * Math.PI)
    ctx.fill()
    
    // Draw vertical line to x-axis
    ctx.strokeStyle = '#E91E63'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(evalCanvasX, evalCanvasY)
    ctx.lineTo(evalCanvasX, toCanvasY(0))
    ctx.stroke()
    ctx.setLineDash([])
  }
}

watch([a, b, c], updateQuadratic)

onMounted(() => {
  updateQuadratic()
})
</script>

<style scoped>
@import '../styles/components.css';

/* Component-specific styles */
.forms-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.form-card {
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.form-card.active {
  border-color: #2196F3;
  background: #e3f2fd;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
}

.form-card.disabled {
  opacity: 0.6;
  background: #f5f5f5;
}

.form-card h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1em;
}

.form-card .equation {
  font-family: 'Times New Roman', serif;
  font-size: 1.2em;
  color: #2196F3;
  font-weight: 500;
}

.plot-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9em;
}

.color-sample {
  width: 20px;
  height: 3px;
  border-radius: 2px;
}

.step-by-step {
  margin: 1rem 0;
}

.solution-step {
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #2196F3;
}

.step-number {
  font-weight: bold;
  color: #2196F3;
  margin-bottom: 0.5rem;
}

.step-description {
  margin-bottom: 0.5rem;
  color: #666;
}

.step-equation {
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
  color: #333;
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
}

.scenario-details {
  padding: 1rem;
  background: #e8f5e8;
  border-radius: 4px;
  border: 1px solid #c3e6c3;
}

.scenario-equation {
  margin: 1rem 0;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
}

.scenario-interpretation ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.comparison-controls {
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.comparison-list {
  margin: 1rem 0;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.comparison-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #ddd;
}

.comparison-equation {
  flex: 1;
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
}

.remove-btn {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
}

.remove-btn:hover {
  background: #d32f2f;
}

.coefficient-comparison {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.impact-analysis {
  margin: 1rem 0;
}

.impact-item {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #4CAF50;
}

.discriminant-calc {
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
  margin-bottom: 0.5rem;
}

.discriminant-meaning {
  font-weight: bold;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 4px;
}

.positive-discriminant {
  background: #d4edda;
  color: #155724;
}

.zero-discriminant {
  background: #fff3cd;
  color: #856404;
}

.negative-discriminant {
  background: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .forms-display {
    grid-template-columns: 1fr;
  }
  
  .controls-grid {
    grid-template-columns: 1fr;
  }
  
  .plot-legend {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .comparison-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .visualization-canvas {
    max-width: 100%;
    height: auto;
  }
  
  .component-inputs {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>