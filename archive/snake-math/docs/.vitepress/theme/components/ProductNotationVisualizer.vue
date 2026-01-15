<!-- 
Component conceptualization:
Create an interactive product notation explorer where users can:
- Input custom product expressions with start/end values and factor formulas
- Visualize step-by-step calculation process with running products
- Compare different implementation methods (loops, built-ins, NumPy)
- Performance benchmarking tools showing execution time differences
- Pattern recognition helper for common product formulas (factorials, combinations)
- Interactive graphing of partial products to show convergence/divergence behavior
- Real-world scenario selector (probability calculations, combinatorics problems)
- Formula builder with drag-and-drop mathematical components
- Challenge mode with product notation puzzles and optimization problems
The component should clearly show the relationship between mathematical notation and programming loops while highlighting practical applications.
-->

<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Product Notation (Π) Explorer</h3>
      
      <div class="controls-grid">
        <div class="input-group">
          <label>Mode:</label>
          <select v-model="mode" @change="resetInputs" class="function-select">
            <option value="preset">Preset Formulas</option>
            <option value="custom">Custom Expression</option>
            <option value="challenge">Challenge Mode</option>
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
            <input type="checkbox" v-model="showPerformance">
            Performance Comparison
          </label>
        </div>
      </div>
      
      <div v-if="mode === 'custom'" class="interactive-card">
        <h4 class="input-group-title">Custom Product Expression</h4>
        <div class="component-inputs">
          <div class="input-group">
            <label>Start value (i=):</label>
            <input type="number" v-model="customStart" min="1" max="20" class="eval-input">
          </div>
          <div class="input-group">
            <label>End value (to):</label>
            <input type="number" v-model="customEnd" min="1" max="20" class="eval-input">
          </div>
          <div class="input-group">
            <label>Factor formula f(i):</label>
            <select v-model="factorFormula" class="function-select">
              <option value="i">i (simple product)</option>
              <option value="2*i">2i (even multiples)</option>
              <option value="2*i-1">2i-1 (odd series)</option>
              <option value="i*i">i² (squares)</option>
              <option value="1/i">1/i (reciprocals)</option>
              <option value="i+1">i+1 (shifted)</option>
            </select>
          </div>
        </div>
        <div class="formula-display">
          <span class="formula-text">Π(i={{ customStart }} to {{ customEnd }}) {{ getFormulaDisplay() }}</span>
        </div>
      </div>
      
      <div v-if="mode === 'preset'" class="interactive-card">
        <h4 class="input-group-title">Preset Product Formulas</h4>
        <div class="input-group">
          <label>Calculate up to n:</label>
          <input v-model.number="n" type="range" min="1" max="15" class="range-input">
          <span class="result-value">{{ n }}</span>
        </div>
        
        <div class="input-group">
          <label>Product type:</label>
          <select v-model="productType" class="function-select">
            <option value="factorial">Factorial (n!)</option>
            <option value="double">Double factorial (n!!)</option>
            <option value="evens">Even numbers</option>
            <option value="odds">Odd numbers</option>
            <option value="fibonacci">Fibonacci products</option>
            <option value="primes">Prime products</option>
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
        <button @click="nextChallenge" class="btn-secondary">Next Challenge</button>
      </div>
    </div>

    <div v-if="mode !== 'challenge'" class="results-grid">
      <div class="result-card">
        <h4 class="input-group-title">Expression:</h4>
        <div class="result-highlight">{{ mathExpression }}</div>
      </div>
      
      <div class="result-card">
        <h4 class="input-group-title">Result:</h4>
        <div class="result-value" :class="{ 'large-number': result > 1000000 }">
          {{ formattedResult }}
        </div>
        <div class="result-info">
          <small>{{ resultInfo }}</small>
        </div>
      </div>
      
      <div class="result-card">
        <h4 class="input-group-title">Growth Rate:</h4>
        <div class="growth-indicator" :class="getGrowthClass()">
          {{ getGrowthDescription() }}
        </div>
      </div>
    </div>
    
    <div v-if="showSteps && calculationSteps.length > 0" class="component-section">
      <h4 class="input-group-title">Step-by-Step Calculation:</h4>
      <div class="step-by-step">
        <div v-for="(step, index) in calculationSteps" :key="index" class="calculation-step">
          <div class="step-number">Step {{ index + 1 }}:</div>
          <div class="step-calculation">{{ step.expression }}</div>
          <div class="step-result">= {{ step.result }}</div>
        </div>
      </div>
    </div>

    <div class="visualization-container">
      <h4 class="input-group-title">Partial Products Visualization:</h4>
      <canvas ref="plotCanvas" width="600" height="300" class="visualization-canvas"></canvas>
      <div class="plot-controls">
        <button @click="animateCalculation" class="btn-primary">Animate Calculation</button>
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showConvergence">
            Show Convergence Analysis
          </label>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Growth Comparison:</h4>
      <div class="comparison-grid">
        <div class="comparison-item">
          <div class="comparison-label">Sum (Σ): Linear Growth</div>
          <div class="comparison-value">{{ sumValue }}</div>
        </div>
        <div class="comparison-item">
          <div class="comparison-label">Product (Π): {{ getGrowthType() }}</div>
          <div class="comparison-value">{{ formattedResult }}</div>
        </div>
        <div class="comparison-item">
          <div class="comparison-label">Growth Ratio</div>
          <div class="comparison-value">{{ getGrowthRatio() }}x</div>
        </div>
      </div>
    </div>

    <div v-if="showPerformance" class="component-section">
      <h4 class="input-group-title">Implementation Comparison:</h4>
      <div class="performance-grid">
        <div class="performance-item">
          <h5>Loop Implementation</h5>
          <pre><code>{{ loopImplementation }}</code></pre>
          <div class="performance-stat">{{ performanceStats.loop }}</div>
        </div>
        <div class="performance-item">
          <h5>Built-in Function</h5>
          <pre><code>{{ builtinImplementation }}</code></pre>
          <div class="performance-stat">{{ performanceStats.builtin }}</div>
        </div>
        <div class="performance-item">
          <h5>NumPy Implementation</h5>
          <pre><code>{{ numpyImplementation }}</code></pre>
          <div class="performance-stat">{{ performanceStats.numpy }}</div>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Real-World Applications:</h4>
      <div class="controls-grid">
        <div class="interactive-card" @click="loadScenario('probability')" :class="{ active: currentScenario === 'probability' }">
          <h5 class="app-title">Probability Calculations</h5>
          <p class="app-description">Permutations and combinations</p>
        </div>
        <div class="interactive-card" @click="loadScenario('compound')" :class="{ active: currentScenario === 'compound' }">
          <h5 class="app-title">Compound Growth</h5>
          <p class="app-description">Investment and population models</p>
        </div>
        <div class="interactive-card" @click="loadScenario('physics')" :class="{ active: currentScenario === 'physics' }">
          <h5 class="app-title">Physics Applications</h5>
          <p class="app-description">Series resistance, optics</p>
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
    
    <div class="interactive-card">
      <h4 class="input-group-title">Generated Python Code:</h4>
      <pre><code>{{ pythonCode }}</code></pre>
      <div class="code-explanation">
        <p>{{ codeExplanation }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const mode = ref('preset')
const n = ref(5)
const productType = ref('factorial')
const customStart = ref(1)
const customEnd = ref(5)
const factorFormula = ref('i')
const showSteps = ref(false)
const showPerformance = ref(false)
const showConvergence = ref(false)
const challengeAnswer = ref(null)
const challengeResult = ref(null)
const currentChallenge = ref({})
const currentScenario = ref(null)
const calculationSteps = ref([])
const plotCanvas = ref(null)
const challengeIndex = ref(0)

const challenges = [
  {
    title: "Factorial Challenge",
    description: "Calculate 6! (6 factorial)",
    answer: 720,
    hint: "Multiply 1 × 2 × 3 × 4 × 5 × 6"
  },
  {
    title: "Even Product", 
    description: "Find the product of first 4 even numbers: 2 × 4 × 6 × 8",
    answer: 384,
    hint: "2 × 4 × 6 × 8"
  },
  {
    title: "Double Factorial",
    description: "Calculate 7!! (7 double factorial)",
    answer: 105,
    hint: "7 × 5 × 3 × 1"
  }
]

const result = computed(() => {
  if (mode.value === 'custom') {
    return calculateCustomProduct()
  } else {
    switch (productType.value) {
      case 'factorial':
        return factorial(n.value)
      case 'double':
        return doubleFactorial(n.value)
      case 'evens':
        return productEvens(n.value)
      case 'odds':
        return productOdds(n.value)
      case 'fibonacci':
        return fibonacciProduct(n.value)
      case 'primes':
        return primeProduct(n.value)
      default:
        return 0
    }
  }
})

const formattedResult = computed(() => {
  if (result.value > 1000000) {
    return result.value.toExponential(2)
  }
  return result.value.toLocaleString()
})

const resultInfo = computed(() => {
  const digits = result.value.toString().length
  if (result.value > 1000000) {
    return `${digits} digits - Growing exponentially!`
  } else if (result.value > 1000) {
    return `${digits} digits`
  }
  return ''
})

const mathExpression = computed(() => {
  if (mode.value === 'custom') {
    return getCustomExpression()
  } else {
    switch (productType.value) {
      case 'factorial':
        return getFactorialExpression()
      case 'double':
        return getDoubleFactorialExpression()
      case 'evens':
        return getEvensExpression()
      case 'odds':
        return getOddsExpression()
      case 'fibonacci':
        return getFibonacciExpression()
      case 'primes':
        return getPrimeExpression()
      default:
        return ''
    }
  }
})

const sumValue = computed(() => {
  return n.value * (n.value + 1) / 2
})

const pythonCode = computed(() => {
  if (mode.value === 'custom') {
    return getCustomPythonCode()
  } else {
    return getPresetPythonCode()
  }
})

const codeExplanation = computed(() => {
  if (mode.value === 'custom') {
    return `This code calculates the product from i=${customStart.value} to ${customEnd.value} using the formula ${factorFormula.value}.`
  } else {
    const explanations = {
      factorial: 'Factorial (n!) is the product of all positive integers up to n. Used in combinatorics and probability.',
      double: 'Double factorial (n!!) multiplies every second number. Used in probability and special functions.',
      evens: 'Product of even numbers shows rapid growth, common in mathematical series.',
      odds: 'Product of odd numbers, appears in special mathematical functions and series.'
    }
    return explanations[productType.value] || ''
  }
})

const scenarioDetails = computed(() => {
  switch (currentScenario.value) {
    case 'probability':
      return {
        title: 'Probability and Combinatorics',
        description: 'Products appear in permutations (n!) and combinations calculations.',
        example: 'Arranging 5 people in a line: 5! = 120 different arrangements'
      }
    case 'compound':
      return {
        title: 'Compound Growth Models',
        description: 'Products model exponential growth in finance and biology.',
        example: 'Investment growing at 10% annually: (1.1)^n after n years'
      }
    case 'physics':
      return {
        title: 'Physics Applications',
        description: 'Products in series resistance, lens equations, and wave interference.',
        example: 'Total resistance: R_total = R1 × R2 / (R1 + R2) for parallel resistors'
      }
    default:
      return null
  }
})

// Helper functions
const factorial = (num) => {
  if (num <= 1) return 1
  let result = 1
  for (let i = 2; i <= num; i++) {
    result *= i
  }
  return result
}

const doubleFactorial = (num) => {
  let result = 1
  for (let i = num; i > 0; i -= 2) {
    result *= i
  }
  return result
}

const productEvens = (num) => {
  let result = 1
  for (let i = 2; i <= 2 * num; i += 2) {
    result *= i
  }
  return result
}

const productOdds = (num) => {
  let result = 1
  for (let i = 1; i < 2 * num; i += 2) {
    result *= i
  }
  return result
}

const fibonacciProduct = (num) => {
  const fib = [1, 1]
  for (let i = 2; i < num; i++) {
    fib[i] = fib[i-1] + fib[i-2]
  }
  return fib.slice(0, num).reduce((a, b) => a * b, 1)
}

const primeProduct = (num) => {
  const primes = []
  let candidate = 2
  while (primes.length < num) {
    if (isPrime(candidate)) {
      primes.push(candidate)
    }
    candidate++
  }
  return primes.reduce((a, b) => a * b, 1)
}

const isPrime = (n) => {
  if (n < 2) return false
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false
  }
  return true
}

const calculateCustomProduct = () => {
  let result = 1
  for (let i = customStart.value; i <= customEnd.value; i++) {
    result *= evaluateFormula(factorFormula.value, i)
  }
  return result
}

const evaluateFormula = (formula, i) => {
  switch (formula) {
    case 'i': return i
    case '2*i': return 2 * i
    case '2*i-1': return 2 * i - 1
    case 'i*i': return i * i
    case '1/i': return 1 / i
    case 'i+1': return i + 1
    default: return i
  }
}

const getFactorialExpression = () => {
  const terms = []
  for (let i = 1; i <= n.value; i++) {
    terms.push(i.toString())
  }
  return terms.join(' × ')
}

const getCustomExpression = () => {
  const terms = []
  for (let i = customStart.value; i <= customEnd.value; i++) {
    terms.push(getFormulaDisplay(i))
  }
  return terms.join(' × ')
}

const getFormulaDisplay = (i = null) => {
  if (i === null) {
    return factorFormula.value.replace(/i/g, 'i')
  }
  return factorFormula.value.replace(/i/g, i.toString())
}

const getDoubleFactorialExpression = () => {
  const terms = []
  for (let i = n.value; i > 0; i -= 2) {
    terms.push(i.toString())
  }
  return terms.join(' × ')
}

const getEvensExpression = () => {
  const terms = []
  for (let i = 2; i <= 2 * n.value; i += 2) {
    terms.push(i.toString())
  }
  return terms.join(' × ')
}

const getOddsExpression = () => {
  const terms = []
  for (let i = 1; i < 2 * n.value; i += 2) {
    terms.push(i.toString())
  }
  return terms.join(' × ')
}

const getFibonacciExpression = () => {
  const fib = [1, 1]
  for (let i = 2; i < n.value; i++) {
    fib[i] = fib[i-1] + fib[i-2]
  }
  return fib.slice(0, n.value).join(' × ')
}

const getPrimeExpression = () => {
  const primes = []
  let candidate = 2
  while (primes.length < n.value) {
    if (isPrime(candidate)) {
      primes.push(candidate)
    }
    candidate++
  }
  return primes.join(' × ')
}

const getGrowthClass = () => {
  if (result.value < 100) return 'slow-growth'
  if (result.value < 10000) return 'moderate-growth'
  return 'fast-growth'
}

const getGrowthDescription = () => {
  if (result.value < 100) return 'Linear Growth'
  if (result.value < 10000) return 'Polynomial Growth'
  return 'Exponential Growth'
}

const getGrowthType = () => {
  if (productType.value === 'factorial') return 'Factorial Growth'
  if (result.value < 100) return 'Linear Growth'
  return 'Exponential Growth'
}

const getGrowthRatio = () => {
  if (sumValue.value === 0) return '∞'
  return (result.value / sumValue.value).toFixed(1)
}

const getCustomPythonCode = () => {
  return `# Custom product calculation
result = 1
for i in range(${customStart.value}, ${customEnd.value + 1}):
    result *= ${factorFormula.value}
print(f"Product = {result}")  # ${result.value}`
}

const getPresetPythonCode = () => {
  const codes = {
    factorial: `import math\n\nresult = math.factorial(${n.value})\nprint(f"${n.value}! = {result}")  # ${result.value}`,
    double: `# Double factorial\nresult = 1\nfor i in range(${n.value}, 0, -2):\n    result *= i\nprint(f"${n.value}!! = {result}")  # ${result.value}`,
    evens: `import math\n\nresult = math.prod(range(2, ${2*n.value + 1}, 2))\nprint(f"Product of first ${n.value} evens = {result}")  # ${result.value}`,
    odds: `import math\n\nresult = math.prod(range(1, ${2*n.value}, 2))\nprint(f"Product of first ${n.value} odds = {result}")  # ${result.value}`,
    fibonacci: `# Fibonacci product\nfib = [1, 1]\nfor i in range(2, ${n.value}):\n    fib.append(fib[i-1] + fib[i-2])\nresult = 1\nfor f in fib[:${n.value}]:\n    result *= f\nprint(f"Fibonacci product = {result}")  # ${result.value}`,
    primes: `# Prime product\ndef is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0: return False\n    return True\n\nprimes = []\nn = 2\nwhile len(primes) < ${n.value}:\n    if is_prime(n):\n        primes.append(n)\n    n += 1\nresult = 1\nfor p in primes:\n    result *= p\nprint(f"Product of first ${n.value} primes = {result}")  # ${result.value}`
  }
  return codes[productType.value] || ''
}

const resetInputs = () => {
  challengeAnswer.value = null
  challengeResult.value = null
  if (mode.value === 'challenge') {
    currentChallenge.value = challenges[challengeIndex.value]
  }
}

const checkChallenge = () => {
  if (challengeAnswer.value === currentChallenge.value.answer) {
    challengeResult.value = { correct: true, message: 'Correct! Well done!' }
  } else {
    challengeResult.value = { correct: false, message: `Try again. Hint: ${currentChallenge.value.hint}` }
  }
}

const nextChallenge = () => {
  challengeIndex.value = (challengeIndex.value + 1) % challenges.length
  currentChallenge.value = challenges[challengeIndex.value]
  challengeAnswer.value = null
  challengeResult.value = null
}

const loadScenario = (scenario) => {
  currentScenario.value = currentScenario.value === scenario ? null : scenario
}

const animateCalculation = () => {
  // Animation implementation would go here
  generateCalculationSteps()
}

const generateCalculationSteps = () => {
  const steps = []
  if (mode.value === 'preset' && productType.value === 'factorial') {
    let running = 1
    for (let i = 1; i <= n.value; i++) {
      running *= i
      steps.push({
        expression: `${i === 1 ? '1' : steps[steps.length-1]?.expression || '1'} × ${i}`,
        result: running.toLocaleString()
      })
    }
  }
  calculationSteps.value = steps
}

const updateVisualization = () => {
  setTimeout(() => {
    if (showSteps.value) {
      generateCalculationSteps()
    }
  }, 100)
}

watch([mode, n, productType, customStart, customEnd, factorFormula], updateVisualization)

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

.step-by-step {
  margin: 1rem 0;
}

.calculation-step {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #2196F3;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-number {
  font-weight: bold;
  color: #2196F3;
  min-width: 60px;
}

.step-calculation {
  font-family: 'Times New Roman', serif;
  flex: 1;
}

.step-result {
  font-weight: bold;
  color: #28a745;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

.performance-stat {
  margin-top: 0.5rem;
  font-size: 0.9em;
  color: #666;
  font-style: italic;
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
  font-family: monospace;
  font-size: 0.9em;
}

.plot-controls {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.growth-indicator {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
}

.slow-growth {
  background: #d4edda;
  color: #155724;
}

.moderate-growth {
  background: #fff3cd;
  color: #856404;
}

.fast-growth {
  background: #f8d7da;
  color: #721c24;
}

.code-explanation {
  margin: 1rem 0;
  padding: 1rem;
  background: #e8f4fd;
  border-radius: 4px;
  border-left: 4px solid #2196F3;
  font-style: italic;
  color: #0d47a1;
}

@media (max-width: 768px) {
  .controls-grid {
    grid-template-columns: 1fr;
  }
  
  .performance-grid {
    grid-template-columns: 1fr;
  }
  
  .calculation-step {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .visualization-canvas {
    max-width: 100%;
    height: auto;
  }
  
  .plot-controls {
    flex-direction: column;
  }
}
</style>