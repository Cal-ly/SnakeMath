<!--
Component conceptualization:
Create an interactive summation notation explorer where users can:
- Input different summation expressions with start/end values and formulas
- Visualize step-by-step calculation process with running totals
- Compare different methods (loops, built-in functions, closed formulas)
- Performance benchmarking tools showing execution time differences
- Pattern recognition helper highlighting common summation formulas
- Real-time formula builder with drag-and-drop mathematical components
- Graph visualization showing summation results for different parameters
- Interactive examples from statistics, physics, and computer science
- Challenge mode with summation puzzles and optimization problems
The component should make the connection between mathematical notation and programming loops clear and intuitive.
-->
<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Summation Notation (∑) Explorer</h3>
      
      <div class="controls-grid">
        <div class="input-group">
          <label>Mode:</label>
          <select v-model="mode" @change="resetInputs" class="function-select">
            <option value="preset">Preset Formulas</option>
            <option value="custom">Custom Expression</option>
            <option value="challenge">Challenge Mode</option>
            <option value="comparison">Method Comparison</option>
          </select>
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showSteps">
            Show Step-by-Step
          </label>
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showVisualization">
            Show Graph Visualization
          </label>
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showPerformance">
            Performance Benchmarking
          </label>
        </div>
      </div>
      
      <div v-if="mode === 'custom'" class="interactive-card">
        <h4 class="input-group-title">Custom Summation Expression</h4>
        <div class="component-inputs">
          <div class="input-group">
            <label>Start value (i=):</label>
            <input type="number" v-model="customStart" min="0" max="100" class="eval-input">
          </div>
          <div class="input-group">
            <label>End value (to):</label>
            <input type="number" v-model="customEnd" min="1" max="100" class="eval-input">
          </div>
          <div class="input-group">
            <label>Expression f(i):</label>
            <select v-model="customExpression" class="function-select">
              <option value="i">i (arithmetic series)</option>
              <option value="i*i">i² (sum of squares)</option>
              <option value="i*i*i">i³ (sum of cubes)</option>
              <option value="2**i">2ⁱ (powers of 2)</option>
              <option value="1/i">1/i (harmonic series)</option>
              <option value="(-1)**(i+1)/i">(-1)^(i+1)/i (alternating harmonic)</option>
              <option value="fact(i)">i! (factorial sum)</option>
            </select>
          </div>
        </div>
        <div class="formula-display">
          <span class="formula-text">∑(i={{ customStart }} to {{ customEnd }}) {{ getExpressionDisplay() }}</span>
        </div>
      </div>
      
      <div v-if="mode === 'preset'" class="interactive-card">
        <h4 class="input-group-title">Preset Summation Formulas</h4>
        <div class="input-group">
          <label>Calculate up to n:</label>
          <input v-model.number="n" type="range" min="1" max="25" class="range-input">
          <span class="result-value">{{ n }}</span>
        </div>
        
        <div class="input-group">
          <label>Summation type:</label>
          <select v-model="summationType" class="function-select">
            <option value="arithmetic">Arithmetic: ∑i</option>
            <option value="squares">Sum of Squares: ∑i²</option>
            <option value="cubes">Sum of Cubes: ∑i³</option>
            <option value="even">Even Numbers: ∑(2i)</option>
            <option value="odd">Odd Numbers: ∑(2i-1)</option>
            <option value="geometric">Geometric: ∑(2ⁱ)</option>
            <option value="harmonic">Harmonic: ∑(1/i)</option>
          </select>
        </div>
      </div>
      
      <div v-if="mode === 'challenge'" class="interactive-card">
        <h4 class="input-group-title">Challenge: {{ currentChallenge.title }}</h4>
        <p class="challenge-description">{{ currentChallenge.description }}</p>
        <div class="input-group">
          <label>Your answer:</label>
          <input type="number" v-model="challengeAnswer" @input="checkChallenge" class="eval-input">
          <span v-if="challengeResult" :class="challengeResult.correct ? 'correct' : 'incorrect'">
            {{ challengeResult.message }}
          </span>
        </div>
        <div class="btn-group">
          <button @click="nextChallenge" class="btn-secondary">Next Challenge</button>
          <button @click="showChallengeHint" class="btn-secondary">Show Hint</button>
        </div>
      </div>
      
      <div v-if="mode === 'comparison'" class="interactive-card">
        <h4 class="input-group-title">Method Comparison for ∑(i=1 to {{ n }}) i</h4>
        <div class="method-comparison">
          <div class="method-item">
            <h5>1. Loop Method</h5>
            <pre><code>{{ loopMethod }}</code></pre>
          </div>
          <div class="method-item">
            <h5>2. Built-in Function</h5>
            <pre><code>{{ builtinMethod }}</code></pre>
          </div>
          <div class="method-item">
            <h5>3. Closed Formula</h5>
            <pre><code>{{ formulaMethod }}</code></pre>
          </div>
        </div>
      </div>
    </div>
    
    <div class="results-grid">
      <div class="result-card">
        <h4 class="input-group-title">Current Expression:</h4>
        <div class="result-highlight">{{ currentFormula }}</div>
      </div>
      
      <div class="result-card">
        <h4 class="input-group-title">Result:</h4>
        <div class="result-value">{{ currentResult }}</div>
      </div>
      
      <div v-if="mode === 'preset'" class="result-card">
        <h4 class="input-group-title">Closed Formula:</h4>
        <div class="formula-result">{{ closedFormula }}</div>
      </div>
    </div>
    
    <div v-if="showSteps && calculationSteps.length > 0" class="component-section">
      <h4 class="input-group-title">Step-by-Step Calculation:</h4>
      <div class="step-by-step">
        <div class="steps-header">
          <div class="step-col">Step</div>
          <div class="step-col">Term</div>
          <div class="step-col">Running Total</div>
          <div class="step-col">Expression</div>
        </div>
        <div v-for="(step, index) in calculationSteps" :key="index" class="calculation-step">
          <div class="step-col">{{ step.step }}</div>
          <div class="step-col">{{ step.term }}</div>
          <div class="step-col">{{ step.runningTotal }}</div>
          <div class="step-col expression">{{ step.expression }}</div>
        </div>
      </div>
    </div>
    
    <div v-if="showVisualization" class="visualization-container">
      <h4 class="input-group-title">Term Visualization:</h4>
      <canvas ref="plotCanvas" width="600" height="300" class="visualization-canvas"></canvas>
      <div class="viz-description">
        Each bar represents a term in the summation. Height corresponds to the value being added.
      </div>
    </div>
    
    <div v-if="showPerformance" class="component-section">
      <h4 class="input-group-title">Performance Analysis:</h4>
      <div class="performance-comparison">
        <div class="performance-item">
          <h5>Time Complexity</h5>
          <div class="complexity-info">
            <div>Loop method: O(n)</div>
            <div>Built-in: O(n)</div>
            <div>Formula: O(1)</div>
          </div>
        </div>
        <div class="performance-item">
          <h5>Space Complexity</h5>
          <div class="complexity-info">
            <div>Loop method: O(1)</div>
            <div>Built-in: O(n) for range</div>
            <div>Formula: O(1)</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Real-World Applications:</h4>
      <div class="controls-grid">
        <div class="interactive-card" @click="loadScenario('statistics')" :class="{ active: currentScenario === 'statistics' }">
          <h5 class="app-title">Statistics</h5>
          <p class="app-description">Mean, variance, standard deviation</p>
        </div>
        <div class="interactive-card" @click="loadScenario('physics')" :class="{ active: currentScenario === 'physics' }">
          <h5 class="app-title">Physics</h5>
          <p class="app-description">Work, center of mass, discrete integration</p>
        </div>
        <div class="interactive-card" @click="loadScenario('cs')" :class="{ active: currentScenario === 'cs' }">
          <h5 class="app-title">Computer Science</h5>
          <p class="app-description">Algorithm analysis, complexity theory</p>
        </div>
      </div>
      
      <div v-if="currentScenario" class="scenario-details">
        <h5>{{ scenarioDetails.title }}</h5>
        <p>{{ scenarioDetails.description }}</p>
        <div class="scenario-example">
          <strong>Example:</strong> {{ scenarioDetails.example }}
        </div>
      </div>
    </div>
    
    <div v-if="currentChallenge && mode === 'challenge' && showHint" class="hint-display">
      <h4 class="input-group-title">Hint:</h4>
      <div class="hint-content">
        <p>{{ currentChallenge.hint }}</p>
        <div class="hint-formula">Formula: {{ currentChallenge.formula }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Core summation parameters
const n = ref(10)
const summationType = ref('arithmetic')
const customStart = ref(1)
const customEnd = ref(10)
const customExpression = ref('i')

// UI state
const mode = ref('preset')
const showSteps = ref(false)
const showVisualization = ref(false)
const showPerformance = ref(false)
const currentScenario = ref(null)

// Challenge mode
const challengeAnswer = ref(null)
const challengeResult = ref(null)
const currentChallenge = ref({})
const challengeIndex = ref(0)
const showHint = ref(false)

// Calculation steps and visualization
const calculationSteps = ref([])
const plotCanvas = ref(null)

const challenges = [
  {
    title: "Arithmetic Series",
    description: "Calculate the sum: 1 + 2 + 3 + 4 + 5",
    answer: 15,
    hint: "Use the formula n(n+1)/2 where n=5",
    formula: "∑(i=1 to 5) i"
  },
  {
    title: "Sum of Squares",
    description: "Find: 1² + 2² + 3² + 4²",
    answer: 30,
    hint: "1 + 4 + 9 + 16 = ?",
    formula: "∑(i=1 to 4) i²"
  },
  {
    title: "Even Numbers",
    description: "Calculate: 2 + 4 + 6 + 8 + 10",
    answer: 30,
    hint: "Sum of first 5 even numbers: 2(1+2+3+4+5)",
    formula: "∑(i=1 to 5) 2i"
  },
  {
    title: "Geometric Series",
    description: "Find: 2¹ + 2² + 2³ + 2⁴",
    answer: 30,
    hint: "2 + 4 + 8 + 16 = ?",
    formula: "∑(i=1 to 4) 2ⁱ"
  }
]

const currentResult = computed(() => {
  if (mode.value === 'custom') {
    return calculateCustomSum()
  } else {
    return calculatePresetSum()
  }
})

const currentFormula = computed(() => {
  if (mode.value === 'custom') {
    return `∑(i=${customStart.value} to ${customEnd.value}) ${getExpressionDisplay()}`
  } else {
    return getSummationFormula()
  }
})

const closedFormula = computed(() => {
  switch (summationType.value) {
    case 'arithmetic':
      return `n(n+1)/2 = ${n.value}(${n.value}+1)/2 = ${n.value * (n.value + 1) / 2}`
    case 'squares':
      return `n(n+1)(2n+1)/6 = ${n.value}(${n.value}+1)(${2*n.value}+1)/6 = ${n.value * (n.value + 1) * (2 * n.value + 1) / 6}`
    case 'cubes':
      return `[n(n+1)/2]² = [${n.value}(${n.value}+1)/2]² = ${Math.pow(n.value * (n.value + 1) / 2, 2)}`
    case 'even':
      return `n(n+1) = ${n.value}(${n.value}+1) = ${n.value * (n.value + 1)}`
    case 'odd':
      return `n² = ${n.value}² = ${n.value * n.value}`
    case 'geometric':
      return `2^(n+1) - 2 = 2^(${n.value}+1) - 2 = ${Math.pow(2, n.value + 1) - 2}`
    case 'harmonic':
      return 'No closed form - approximation: ln(n) + γ ≈ ' + (Math.log(n.value) + 0.5772).toFixed(4)
    default:
      return ''
  }
})

const loopMethod = computed(() => {
  return `total = 0
for i in range(1, ${n.value + 1}):
    total += i
print(total)  # ${currentResult.value}`
})

const builtinMethod = computed(() => {
  return `total = sum(range(1, ${n.value + 1}))
print(total)  # ${currentResult.value}`
})

const formulaMethod = computed(() => {
  return `# Using closed formula
total = ${n.value} * (${n.value} + 1) // 2
print(total)  # ${currentResult.value}`
})

const scenarioDetails = computed(() => {
  switch (currentScenario.value) {
    case 'statistics':
      return {
        title: 'Statistical Applications',
        description: 'Summations are fundamental in calculating means, variances, and other statistical measures.',
        example: `Sample mean: x̄ = (1/n)∑xᵢ`
      }
    case 'physics':
      return {
        title: 'Physics Applications', 
        description: 'Used in calculating work, center of mass, and discrete integrations.',
        example: 'Work: W = ∑ F·Δx for discrete forces'
      }
    case 'cs':
      return {
        title: 'Computer Science Applications',
        description: 'Algorithm analysis, complexity calculations, and data processing.',
        example: `Time complexity: T(n) = ∑(i=1 to n) O(i)`
      }
    default:
      return null
  }
})

// Helper functions
const calculatePresetSum = () => {
  switch (summationType.value) {
    case 'arithmetic':
      return n.value * (n.value + 1) / 2
    case 'squares':
      return n.value * (n.value + 1) * (2 * n.value + 1) / 6
    case 'cubes':
      return Math.pow(n.value * (n.value + 1) / 2, 2)
    case 'even':
      return n.value * (n.value + 1)
    case 'odd':
      return n.value * n.value
    case 'geometric':
      return Math.pow(2, n.value + 1) - 2
    case 'harmonic':
      return harmonicSum(n.value)
    default:
      return 0
  }
}

const calculateCustomSum = () => {
  let total = 0
  for (let i = customStart.value; i <= customEnd.value; i++) {
    total += evaluateExpression(customExpression.value, i)
  }
  return total
}

const evaluateExpression = (expr, i) => {
  switch (expr) {
    case 'i': return i
    case 'i*i': return i * i
    case 'i*i*i': return i * i * i
    case '2**i': return Math.pow(2, i)
    case '1/i': return 1 / i
    case '(-1)**(i+1)/i': return Math.pow(-1, i + 1) / i
    case 'fact(i)': return factorial(i)
    default: return i
  }
}

const factorial = (n) => {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

const harmonicSum = (n) => {
  let sum = 0
  for (let i = 1; i <= n; i++) {
    sum += 1 / i
  }
  return parseFloat(sum.toFixed(6))
}

const getExpressionDisplay = () => {
  switch (customExpression.value) {
    case 'i': return 'i'
    case 'i*i': return 'i²'
    case 'i*i*i': return 'i³'
    case '2**i': return '2ⁱ'
    case '1/i': return '1/i'
    case '(-1)**(i+1)/i': return '(-1)^(i+1)/i'
    case 'fact(i)': return 'i!'
    default: return 'i'
  }
}

const getSummationFormula = () => {
  const formulas = {
    arithmetic: `∑(i=1 to ${n.value}) i`,
    squares: `∑(i=1 to ${n.value}) i²`,
    cubes: `∑(i=1 to ${n.value}) i³`,
    even: `∑(i=1 to ${n.value}) 2i`,
    odd: `∑(i=1 to ${n.value}) (2i-1)`,
    geometric: `∑(i=1 to ${n.value}) 2ⁱ`,
    harmonic: `∑(i=1 to ${n.value}) 1/i`
  }
  return formulas[summationType.value] || ''
}

const generateCalculationSteps = () => {
  const steps = []
  if (mode.value === 'preset' && summationType.value === 'arithmetic') {
    let running = 0
    for (let i = 1; i <= Math.min(n.value, 10); i++) {
      running += i
      steps.push({
        step: i,
        term: i,
        runningTotal: running,
        expression: i === 1 ? '1' : steps[steps.length-1]?.expression + ' + ' + i
      })
    }
    if (n.value > 10) {
      steps.push({
        step: '...',
        term: '...',
        runningTotal: '...',
        expression: '... continuing to n=' + n.value
      })
    }
  }
  calculationSteps.value = steps
}

const resetInputs = () => {
  challengeAnswer.value = null
  challengeResult.value = null
  showHint.value = false
  if (mode.value === 'challenge') {
    currentChallenge.value = challenges[challengeIndex.value]
  }
}

const checkChallenge = () => {
  if (challengeAnswer.value === currentChallenge.value.answer) {
    challengeResult.value = { correct: true, message: 'Correct! Excellent work!' }
  } else {
    challengeResult.value = { correct: false, message: 'Try again!' }
  }
}

const nextChallenge = () => {
  challengeIndex.value = (challengeIndex.value + 1) % challenges.length
  currentChallenge.value = challenges[challengeIndex.value]
  challengeAnswer.value = null
  challengeResult.value = null
  showHint.value = false
}

const showChallengeHint = () => {
  showHint.value = !showHint.value
}

const loadScenario = (scenario) => {
  currentScenario.value = currentScenario.value === scenario ? null : scenario
}

const updateVisualization = () => {
  setTimeout(() => {
    if (showSteps.value) {
      generateCalculationSteps()
    }
    if (showVisualization.value) {
      drawVisualization()
    }
  }, 100)
}

const drawVisualization = () => {
  const canvas = plotCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  
  ctx.clearRect(0, 0, width, height)
  
  // Draw bar chart of summation terms
  const maxTerm = Math.max(...Array.from({length: Math.min(n.value, 20)}, (_, i) => i + 1))
  const barWidth = width / Math.min(n.value, 20)
  const barScale = (height - 40) / maxTerm
  
  for (let i = 1; i <= Math.min(n.value, 20); i++) {
    const barHeight = i * barScale
    const x = (i - 1) * barWidth
    const y = height - barHeight - 20
    
    ctx.fillStyle = `hsl(${(i / n.value) * 240}, 70%, 60%)`
    ctx.fillRect(x + 2, y, barWidth - 4, barHeight)
    
    ctx.fillStyle = '#000'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(i.toString(), x + barWidth/2, height - 5)
  }
}

watch([mode, n, summationType, customStart, customEnd, customExpression], updateVisualization)

onMounted(() => {
  currentChallenge.value = challenges[0]
  updateVisualization()
})
</script>

<style scoped>
@import '../styles/components.css';

/* Component-specific styles */
.formula-display {
  margin: 1rem 0;
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  font-size: 1.2em;
  font-weight: 500;
}

.formula-text {
  font-family: 'Times New Roman', serif;
  color: #2196F3;
}

.challenge-description {
  margin: 1rem 0;
  padding: 1rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  color: #856404;
}

.correct {
  color: #28a745;
  font-weight: bold;
}

.incorrect {
  color: #dc3545;
  font-weight: bold;
}

.method-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.method-item {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  background: white;
}

.method-item h5 {
  margin-top: 0;
  color: #2196F3;
}

.step-by-step {
  margin: 1rem 0;
  overflow-x: auto;
}

.steps-header {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 3fr;
  gap: 1rem;
  padding: 0.5rem;
  background: #2196F3;
  color: white;
  font-weight: bold;
  border-radius: 4px 4px 0 0;
}

.calculation-step {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 3fr;
  gap: 1rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.calculation-step:last-child {
  border-radius: 0 0 4px 4px;
}

.step-col {
  text-align: center;
}

.step-col.expression {
  font-family: 'Times New Roman', serif;
  text-align: left;
}

.performance-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.performance-item {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  background: white;
}

.performance-item h5 {
  margin-top: 0;
  color: #2196F3;
}

.complexity-info div {
  margin: 0.5rem 0;
  padding: 0.25rem 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-family: monospace;
}

.scenario-details {
  margin: 1rem 0;
  padding: 1rem;
  background: #e8f5e8;
  border-radius: 4px;
  border: 1px solid #c3e6c3;
}

.scenario-example {
  margin-top: 1rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
}

.viz-description {
  text-align: center;
  margin: 1rem 0;
  color: #666;
  font-style: italic;
}

.hint-display {
  margin: 1rem 0;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 4px;
  border-left: 4px solid #2196F3;
}

.hint-content p {
  margin: 0.5rem 0;
  color: #666;
}

.hint-formula {
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
  color: #2196F3;
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .controls-grid {
    grid-template-columns: 1fr;
  }
  
  .method-comparison {
    grid-template-columns: 1fr;
  }
  
  .performance-comparison {
    grid-template-columns: 1fr;
  }
  
  .steps-header,
  .calculation-step {
    grid-template-columns: 1fr;
    text-align: left;
  }
  
  .step-col {
    text-align: left;
    padding: 0.25rem;
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