<!--
Component conceptualization:
Create an interactive number type explorer where users can:
- Input a number and see how it's classified (Natural, Integer, Real)
- Visualize number sets as nested circles (Venn diagram style)
- Test type conversions and see potential precision loss
- Experiment with overflow scenarios in different data types
- Compare memory usage across different type representations
The component should provide real-time feedback and highlight edge cases.
-->

<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Number Type Explorer</h3>
      
      <div class="controls-grid">
        <div class="input-group">
          <label>Enter a number:</label>
          <input 
            type="text" 
            v-model="inputNumber" 
            @input="analyzeNumber"
            placeholder="e.g., 42, -3.14, 1.5e10, NaN"
            class="eval-input"
          >
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showVennDiagram">
            Show Venn Diagram
          </label>
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showMemoryUsage">
            Show Memory Analysis
          </label>
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showOverflowTest">
            Test Overflow Scenarios
          </label>
        </div>
      </div>
      
      <div v-if="currentNumber !== null" class="results-grid">
        <div class="result-card">
          <h4 class="input-group-title">Input Value:</h4>
          <div class="result-highlight">{{ formatNumber(currentNumber) }}</div>
        </div>
        
        <div class="result-card">
          <h4 class="input-group-title">Primary Classification:</h4>
          <div class="classification-badge" :class="primaryType.class">
            {{ primaryType.name }}
          </div>
        </div>
        
        <div class="result-card">
          <h4 class="input-group-title">JavaScript Type:</h4>
          <div class="js-type">{{ jsType }}</div>
        </div>
      </div>
    </div>
    
    <div v-if="currentNumber !== null" class="component-section">
      <h4 class="input-group-title">Number Set Classifications:</h4>
      <div class="classification-grid">
        <div 
          v-for="classification in classifications" 
          :key="classification.name"
          class="classification-item"
          :class="{ active: classification.matches }"
        >
          <div class="classification-header">
            <h5>{{ classification.name }}</h5>
            <span class="classification-status" :class="classification.matches ? 'match' : 'no-match'">
              {{ classification.matches ? '✓' : '✗' }}
            </span>
          </div>
          <p class="classification-description">{{ classification.description }}</p>
          <div class="classification-condition">
            <strong>Condition:</strong> {{ classification.condition }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showVennDiagram" class="visualization-container">
      <h4 class="input-group-title">Number Sets Venn Diagram:</h4>
      <canvas ref="vennCanvas" width="500" height="400" class="visualization-canvas"></canvas>
      <div class="viz-description">
        Your number {{ formatNumber(currentNumber) }} is highlighted in the appropriate sets.
      </div>
    </div>
    
    <div v-if="currentNumber !== null" class="component-section">
      <h4 class="input-group-title">Type Conversion Tests:</h4>
      <div class="conversion-grid">
        <div class="conversion-item">
          <h5>Integer Conversion</h5>
          <div class="conversion-result">
            <div class="original">Original: {{ formatNumber(currentNumber) }}</div>
            <div class="converted">parseInt(): {{ integerConversion.value }}</div>
            <div class="precision-loss" :class="integerConversion.lossClass">
              {{ integerConversion.message }}
            </div>
          </div>
        </div>
        
        <div class="conversion-item">
          <h5>Float Conversion</h5>
          <div class="conversion-result">
            <div class="original">Original: {{ formatNumber(currentNumber) }}</div>
            <div class="converted">parseFloat(): {{ floatConversion.value }}</div>
            <div class="precision-loss" :class="floatConversion.lossClass">
              {{ floatConversion.message }}
            </div>
          </div>
        </div>
        
        <div class="conversion-item">
          <h5>String Conversion</h5>
          <div class="conversion-result">
            <div class="original">Original: {{ formatNumber(currentNumber) }}</div>
            <div class="converted">toString(): "{{ stringConversion }}"</div>
            <div class="precision-loss no-loss">
              No precision loss
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showMemoryUsage" class="component-section">
      <h4 class="input-group-title">Memory Usage Analysis:</h4>
      <div class="memory-analysis">
        <div class="memory-item">
          <h5>JavaScript Number (64-bit float)</h5>
          <div class="memory-details">
            <div class="memory-size">8 bytes</div>
            <div class="memory-range">Range: ±1.7976931348623157e+308</div>
            <div class="memory-precision">Precision: ~15-17 decimal digits</div>
          </div>
        </div>
        
        <div class="memory-item">
          <h5>Hypothetical Integer Types</h5>
          <div class="integer-types">
            <div class="int-type">
              <strong>8-bit signed:</strong> 1 byte (-128 to 127)
              <span class="fit-indicator" :class="fitsIn8Bit ? 'fits' : 'overflow'">
                {{ fitsIn8Bit ? 'Fits' : 'Overflow' }}
              </span>
            </div>
            <div class="int-type">
              <strong>16-bit signed:</strong> 2 bytes (-32,768 to 32,767)
              <span class="fit-indicator" :class="fitsIn16Bit ? 'fits' : 'overflow'">
                {{ fitsIn16Bit ? 'Fits' : 'Overflow' }}
              </span>
            </div>
            <div class="int-type">
              <strong>32-bit signed:</strong> 4 bytes (-2,147,483,648 to 2,147,483,647)
              <span class="fit-indicator" :class="fitsIn32Bit ? 'fits' : 'overflow'">
                {{ fitsIn32Bit ? 'Fits' : 'Overflow' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showOverflowTest" class="component-section">
      <h4 class="input-group-title">Overflow & Edge Case Testing:</h4>
      <div class="controls-grid">
        <button @click="testOverflow('max')" class="btn-secondary">Test Max Safe Integer</button>
        <button @click="testOverflow('min')" class="btn-secondary">Test Min Safe Integer</button>
        <button @click="testOverflow('infinity')" class="btn-secondary">Test Infinity</button>
        <button @click="testOverflow('nan')" class="btn-secondary">Test NaN</button>
      </div>
      
      <div v-if="overflowTest" class="overflow-result">
        <h5>Overflow Test: {{ overflowTest.title }}</h5>
        <div class="test-details">
          <div class="test-value">Value: {{ overflowTest.value }}</div>
          <div class="test-safe">Is Safe Integer: {{ overflowTest.isSafe ? 'Yes' : 'No' }}</div>
          <div class="test-finite">Is Finite: {{ overflowTest.isFinite ? 'Yes' : 'No' }}</div>
          <div class="test-explanation">{{ overflowTest.explanation }}</div>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Programming Equivalents:</h4>
      <div class="code-examples">
        <div class="code-example">
          <h5>Python Type Checking</h5>
          <pre><code>{{ pythonCode }}</code></pre>
        </div>
        <div class="code-example">
          <h5>JavaScript Type Checking</h5>
          <pre><code>{{ javascriptCode }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const inputNumber = ref('42')
const currentNumber = ref(null)
const showVennDiagram = ref(true)
const showMemoryUsage = ref(false)
const showOverflowTest = ref(false)
const overflowTest = ref(null)
const vennCanvas = ref(null)

const analyzeNumber = () => {
  const input = inputNumber.value.trim()
  if (input === '') {
    currentNumber.value = null
    return
  }
  
  // Handle special cases
  if (input.toLowerCase() === 'nan') {
    currentNumber.value = NaN
  } else if (input.toLowerCase() === 'infinity' || input === '∞') {
    currentNumber.value = Infinity
  } else if (input.toLowerCase() === '-infinity' || input === '-∞') {
    currentNumber.value = -Infinity
  } else {
    const parsed = parseFloat(input)
    currentNumber.value = isNaN(parsed) ? null : parsed
  }
  
  if (showVennDiagram.value) {
    setTimeout(drawVennDiagram, 100)
  }
}

const jsType = computed(() => {
  if (currentNumber.value === null) return 'null'
  return typeof currentNumber.value
})

const primaryType = computed(() => {
  const num = currentNumber.value
  if (num === null) return { name: 'Invalid', class: 'invalid' }
  if (isNaN(num)) return { name: 'Not a Number (NaN)', class: 'nan' }
  if (!isFinite(num)) return { name: 'Infinity', class: 'infinity' }
  if (Number.isInteger(num)) {
    if (num > 0) return { name: 'Natural Number', class: 'natural' }
    if (num < 0) return { name: 'Negative Integer', class: 'negative' }
    return { name: 'Zero', class: 'zero' }
  }
  return { name: 'Real Number', class: 'real' }
})

const classifications = computed(() => {
  const num = currentNumber.value
  if (num === null) return []
  
  return [
    {
      name: 'Natural Numbers (ℕ)',
      description: 'Positive integers used for counting',
      condition: 'n > 0 and n is integer',
      matches: Number.isInteger(num) && num > 0
    },
    {
      name: 'Whole Numbers (ℕ₀)',
      description: 'Natural numbers including zero',
      condition: 'n ≥ 0 and n is integer',
      matches: Number.isInteger(num) && num >= 0
    },
    {
      name: 'Integers (ℤ)',
      description: 'Positive and negative whole numbers',
      condition: 'n has no fractional part',
      matches: Number.isInteger(num) && isFinite(num)
    },
    {
      name: 'Rational Numbers (ℚ)',
      description: 'Numbers expressible as fractions',
      condition: 'n = p/q where p,q are integers, q ≠ 0',
      matches: isFinite(num) && !isNaN(num)
    },
    {
      name: 'Real Numbers (ℝ)',
      description: 'All numbers on the number line',
      condition: 'n is finite and not NaN',
      matches: isFinite(num) && !isNaN(num)
    },
    {
      name: 'Complex Numbers (ℂ)',
      description: 'Numbers with real and imaginary parts',
      condition: 'n = a + bi (JavaScript only handles real part)',
      matches: !isNaN(num)
    }
  ]
})

const integerConversion = computed(() => {
  const num = currentNumber.value
  if (num === null) return { value: 'N/A', message: 'Invalid input', lossClass: 'invalid' }
  
  const intValue = parseInt(num)
  const hasLoss = num !== intValue
  
  return {
    value: isNaN(intValue) ? 'NaN' : intValue.toString(),
    message: hasLoss ? 'Precision lost!' : 'No precision loss',
    lossClass: hasLoss ? 'loss' : 'no-loss'
  }
})

const floatConversion = computed(() => {
  const num = currentNumber.value
  if (num === null) return { value: 'N/A', message: 'Invalid input', lossClass: 'invalid' }
  
  const floatValue = parseFloat(inputNumber.value)
  const hasLoss = Math.abs(num - floatValue) > Number.EPSILON
  
  return {
    value: isNaN(floatValue) ? 'NaN' : floatValue.toString(),
    message: hasLoss ? 'Precision lost!' : 'No precision loss',
    lossClass: hasLoss ? 'loss' : 'no-loss'
  }
})

const stringConversion = computed(() => {
  const num = currentNumber.value
  if (num === null) return 'null'
  return num.toString()
})

const fitsIn8Bit = computed(() => {
  const num = currentNumber.value
  return Number.isInteger(num) && num >= -128 && num <= 127
})

const fitsIn16Bit = computed(() => {
  const num = currentNumber.value
  return Number.isInteger(num) && num >= -32768 && num <= 32767
})

const fitsIn32Bit = computed(() => {
  const num = currentNumber.value
  return Number.isInteger(num) && num >= -2147483648 && num <= 2147483647
})

const pythonCode = computed(() => {
  const num = currentNumber.value
  if (num === null) return 'num = None'
  
  return `num = ${formatNumber(num)}

# Python type checking
print(f"Type: {type(num).__name__}")
print(f"Is integer: {isinstance(num, int)}")
print(f"Is float: {isinstance(num, float)}")

# Mathematical properties
import math
print(f"Is finite: {math.isfinite(num)}")
print(f"Is NaN: {math.isnan(num)}")
print(f"Is infinite: {math.isinf(num)}")`
})

const javascriptCode = computed(() => {
  const num = currentNumber.value
  if (num === null) return 'let num = null;'
  
  return `let num = ${formatNumber(num)};

// JavaScript type checking
console.log(\`Type: \${typeof num}\`);
console.log(\`Is integer: \${Number.isInteger(num)}\`);
console.log(\`Is safe integer: \${Number.isSafeInteger(num)}\`);

// Mathematical properties
console.log(\`Is finite: \${Number.isFinite(num)}\`);
console.log(\`Is NaN: \${Number.isNaN(num)}\`);
console.log(\`Value: \${num}\`);`
})

const formatNumber = (num) => {
  if (num === null) return 'null'
  if (isNaN(num)) return 'NaN'
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity'
  if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-4 && num !== 0)) {
    return num.toExponential(6)
  }
  return num.toString()
}

const testOverflow = (type) => {
  switch (type) {
    case 'max':
      const maxSafe = Number.MAX_SAFE_INTEGER
      inputNumber.value = maxSafe.toString()
      overflowTest.value = {
        title: 'Maximum Safe Integer',
        value: formatNumber(maxSafe),
        isSafe: Number.isSafeInteger(maxSafe),
        isFinite: Number.isFinite(maxSafe),
        explanation: 'Largest integer that can be represented exactly in JavaScript (2^53 - 1)'
      }
      break
      
    case 'min':
      const minSafe = Number.MIN_SAFE_INTEGER
      inputNumber.value = minSafe.toString()
      overflowTest.value = {
        title: 'Minimum Safe Integer',
        value: formatNumber(minSafe),
        isSafe: Number.isSafeInteger(minSafe),
        isFinite: Number.isFinite(minSafe),
        explanation: 'Smallest integer that can be represented exactly in JavaScript (-(2^53 - 1))'
      }
      break
      
    case 'infinity':
      inputNumber.value = 'Infinity'
      overflowTest.value = {
        title: 'Positive Infinity',
        value: 'Infinity',
        isSafe: false,
        isFinite: false,
        explanation: 'Result of overflow or division by zero; represents unbounded positive values'
      }
      break
      
    case 'nan':
      inputNumber.value = 'NaN'
      overflowTest.value = {
        title: 'Not a Number',
        value: 'NaN',
        isSafe: false,
        isFinite: false,
        explanation: 'Result of invalid mathematical operations like 0/0 or sqrt(-1)'
      }
      break
  }
  analyzeNumber()
}

const drawVennDiagram = () => {
  const canvas = vennCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  
  ctx.clearRect(0, 0, width, height)
  
  // Define circles for number sets
  const circles = [
    { x: width * 0.7, y: height * 0.7, r: 60, color: '#FF6B6B', label: 'ℕ', name: 'Natural' },
    { x: width * 0.6, y: height * 0.6, r: 80, color: '#4ECDC4', label: 'ℕ₀', name: 'Whole' },
    { x: width * 0.5, y: height * 0.5, r: 120, color: '#45B7D1', label: 'ℤ', name: 'Integer' },
    { x: width * 0.4, y: height * 0.4, r: 160, color: '#96CEB4', label: 'ℚ', name: 'Rational' },
    { x: width * 0.3, y: height * 0.3, r: 200, color: '#FFEAA7', label: 'ℝ', name: 'Real' }
  ]
  
  // Draw circles (outermost first)
  circles.reverse().forEach(circle => {
    ctx.globalAlpha = 0.3
    ctx.fillStyle = circle.color
    ctx.beginPath()
    ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.globalAlpha = 1
    ctx.strokeStyle = circle.color
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Label
    ctx.fillStyle = '#333'
    ctx.font = 'bold 16px Times New Roman'
    ctx.fillText(circle.label, circle.x - circle.r + 10, circle.y - circle.r + 25)
    ctx.font = '12px Arial'
    ctx.fillText(circle.name, circle.x - circle.r + 10, circle.y - circle.r + 40)
  })
  
  // Highlight current number
  const num = currentNumber.value
  if (num !== null && isFinite(num) && !isNaN(num)) {
    let highlightCircle
    if (Number.isInteger(num) && num > 0) {
      highlightCircle = circles.find(c => c.label === 'ℕ')
    } else if (Number.isInteger(num) && num >= 0) {
      highlightCircle = circles.find(c => c.label === 'ℕ₀')
    } else if (Number.isInteger(num)) {
      highlightCircle = circles.find(c => c.label === 'ℤ')
    } else {
      highlightCircle = circles.find(c => c.label === 'ℝ')
    }
    
    if (highlightCircle) {
      ctx.fillStyle = '#FF1744'
      ctx.beginPath()
      ctx.arc(highlightCircle.x, highlightCircle.y, 8, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.fillStyle = '#333'
      ctx.font = 'bold 12px Arial'
      ctx.fillText(`${formatNumber(num)}`, highlightCircle.x + 15, highlightCircle.y + 5)
    }
  }
}

watch([showVennDiagram, currentNumber], () => {
  if (showVennDiagram.value) {
    setTimeout(drawVennDiagram, 100)
  }
})

onMounted(() => {
  analyzeNumber()
})
</script>

<style scoped>
@import '../styles/components.css';

/* Component-specific styles */
.classification-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.classification-item {
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.classification-item.active {
  border-color: #28a745;
  background: #d4edda;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.2);
}

.classification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.classification-header h5 {
  margin: 0;
  color: #2196F3;
  font-size: 1.1em;
}

.classification-status {
  font-size: 1.2em;
  font-weight: bold;
}

.classification-status.match {
  color: #28a745;
}

.classification-status.no-match {
  color: #dc3545;
}

.classification-description {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9em;
}

.classification-condition {
  font-size: 0.85em;
  color: #495057;
  font-family: monospace;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.classification-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  text-align: center;
  font-size: 1.1em;
}

.classification-badge.natural {
  background: #FF6B6B;
  color: white;
}

.classification-badge.negative {
  background: #6C5CE7;
  color: white;
}

.classification-badge.zero {
  background: #74B9FF;
  color: white;
}

.classification-badge.real {
  background: #00B894;
  color: white;
}

.classification-badge.nan {
  background: #E17055;
  color: white;
}

.classification-badge.infinity {
  background: #A29BFE;
  color: white;
}

.classification-badge.invalid {
  background: #636E72;
  color: white;
}

.conversion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.conversion-item {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
}

.conversion-item h5 {
  margin: 0 0 1rem 0;
  color: #2196F3;
}

.conversion-result {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.original, .converted {
  font-family: monospace;
  font-size: 0.9em;
}

.precision-loss {
  font-weight: bold;
  font-size: 0.8em;
}

.precision-loss.loss {
  color: #dc3545;
}

.precision-loss.no-loss {
  color: #28a745;
}

.precision-loss.invalid {
  color: #6c757d;
}

.memory-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 1rem 0;
}

.memory-item {
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
}

.memory-item h5 {
  margin: 0 0 1rem 0;
  color: #2196F3;
}

.memory-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.memory-size {
  font-size: 1.2em;
  font-weight: bold;
  color: #28a745;
}

.memory-range, .memory-precision {
  font-size: 0.9em;
  color: #495057;
  font-family: monospace;
}

.integer-types {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.int-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9em;
}

.fit-indicator {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
}

.fit-indicator.fits {
  background: #d4edda;
  color: #155724;
}

.fit-indicator.overflow {
  background: #f8d7da;
  color: #721c24;
}

.overflow-result {
  margin: 1rem 0;
  padding: 1.5rem;
  border: 2px solid #ffc107;
  border-radius: 8px;
  background: #fff3cd;
}

.overflow-result h5 {
  margin: 0 0 1rem 0;
  color: #856404;
}

.test-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.test-value, .test-safe, .test-finite {
  font-family: monospace;
  font-weight: bold;
}

.test-explanation {
  grid-column: 1 / -1;
  font-style: italic;
  color: #856404;
  margin-top: 0.5rem;
}

.code-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin: 1rem 0;
}

.code-example {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
}

.code-example h5 {
  margin: 0 0 1rem 0;
  color: #2196F3;
}

.js-type {
  font-family: monospace;
  font-size: 1.1em;
  font-weight: bold;
  color: #6f42c1;
}

.viz-description {
  text-align: center;
  margin: 1rem 0;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .controls-grid {
    grid-template-columns: 1fr;
  }
  
  .classification-grid {
    grid-template-columns: 1fr;
  }
  
  .conversion-grid {
    grid-template-columns: 1fr;
  }
  
  .memory-analysis {
    grid-template-columns: 1fr;
  }
  
  .code-examples {
    grid-template-columns: 1fr;
  }
  
  .test-details {
    grid-template-columns: 1fr;
  }
  
  .int-type {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .visualization-canvas {
    max-width: 100%;
    height: auto;
  }
}
</style>