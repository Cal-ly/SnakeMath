<!--
Component conceptualization:
Create an interactive operator precedence explorer where users can:
- Input mathematical expressions and see step-by-step evaluation
- Compare expressions with and without parentheses
- Explore different programming language precedence rules side-by-side
- Build complex expressions with visual precedence highlighting
- Test edge cases and operator combinations
- See how expressions are parsed into abstract syntax trees
The component should provide real-time feedback showing which operations are evaluated first and why.
-->

<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Operator Precedence Explorer</h3>
      
      <div class="controls-grid">
        <div class="input-group">
          <label>Expression:</label>
          <input 
            type="text" 
            v-model="expression" 
            @input="evaluateExpression"
            placeholder="e.g., 2 + 3 * 4, (5 + 3) * 2, 2^3*4"
            class="eval-input"
          >
        </div>
        
        <div class="input-group">
          <label>Language:</label>
          <select v-model="selectedLanguage" @change="evaluateExpression" class="function-select">
            <option value="math">Mathematical</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c">C/C++</option>
          </select>
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showAST">
            Show Abstract Syntax Tree
          </label>
        </div>
        
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="showComparison">
            Compare Languages
          </label>
        </div>
      </div>
      
      <div v-if="parsedExpression" class="results-grid">
        <div class="result-card">
          <h4 class="input-group-title">Original Expression:</h4>
          <div class="result-highlight">{{ expression }}</div>
        </div>
        
        <div class="result-card">
          <h4 class="input-group-title">Result:</h4>
          <div class="result-value">{{ parsedExpression.result }}</div>
        </div>
        
        <div class="result-card">
          <h4 class="input-group-title">Fully Parenthesized:</h4>
          <div class="parenthesized-expression">{{ parsedExpression.fullyParenthesized }}</div>
        </div>
      </div>
    </div>
    
    <div v-if="parsedExpression" class="component-section">
      <h4 class="input-group-title">Step-by-Step Evaluation:</h4>
      <div class="evaluation-steps">
        <div v-for="(step, index) in parsedExpression.steps" :key="index" class="evaluation-step">
          <div class="step-number">Step {{ index + 1 }}:</div>
          <div class="step-expression">
            <span v-html="highlightOperation(step.expression, step.operation)"></span>
          </div>
          <div class="step-result">= {{ step.result }}</div>
          <div class="step-explanation">{{ step.explanation }}</div>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Operator Precedence Rules ({{ getLanguageName(selectedLanguage) }}):</h4>
      <div class="precedence-table">
        <div class="precedence-header">
          <div class="precedence-col">Precedence</div>
          <div class="precedence-col">Operator</div>
          <div class="precedence-col">Description</div>
          <div class="precedence-col">Associativity</div>
        </div>
        <div v-for="rule in precedenceRules" :key="rule.precedence" class="precedence-row"
             :class="{ highlighted: rule.highlighted }">
          <div class="precedence-col">{{ rule.precedence }}</div>
          <div class="precedence-col operator">{{ rule.operator }}</div>
          <div class="precedence-col">{{ rule.description }}</div>
          <div class="precedence-col">{{ rule.associativity }}</div>
        </div>
      </div>
    </div>
    
    <div v-if="showAST && parsedExpression" class="visualization-container">
      <h4 class="input-group-title">Abstract Syntax Tree:</h4>
      <canvas ref="astCanvas" width="600" height="400" class="visualization-canvas"></canvas>
      <div class="viz-description">
        Tree structure showing how the expression is parsed according to operator precedence.
      </div>
    </div>
    
    <div v-if="showComparison" class="component-section">
      <h4 class="input-group-title">Language Comparison:</h4>
      <div class="comparison-grid">
        <div v-for="lang in languages" :key="lang.id" class="comparison-item">
          <h5>{{ lang.name }}</h5>
          <div class="comparison-result">
            <div class="comparison-expression">{{ expression }}</div>
            <div class="comparison-value">Result: {{ evaluateForLanguage(expression, lang.id) }}</div>
            <div class="comparison-notes">{{ lang.notes }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Expression Builder:</h4>
      <div class="expression-builder">
        <div class="builder-controls">
          <div class="builder-group">
            <label>Operands:</label>
            <div class="builder-buttons">
              <button v-for="operand in operands" :key="operand" 
                      @click="addToExpression(operand)" class="builder-btn">
                {{ operand }}
              </button>
            </div>
          </div>
          
          <div class="builder-group">
            <label>Operators:</label>
            <div class="builder-buttons">
              <button v-for="operator in operators" :key="operator.symbol" 
                      @click="addToExpression(operator.symbol)" 
                      class="builder-btn operator-btn"
                      :title="operator.description">
                {{ operator.symbol }}
              </button>
            </div>
          </div>
          
          <div class="builder-group">
            <label>Grouping:</label>
            <div class="builder-buttons">
              <button @click="addToExpression('(')" class="builder-btn">(</button>
              <button @click="addToExpression(')')" class="builder-btn">)</button>
              <button @click="clearExpression" class="builder-btn clear-btn">Clear</button>
            </div>
          </div>
        </div>
        
        <div class="built-expression">
          <strong>Built Expression:</strong> {{ builtExpression }}
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Common Mistakes & Edge Cases:</h4>
      <div class="controls-grid">
        <button v-for="example in examples" :key="example.expression"
                @click="loadExample(example)" class="btn-secondary">
          {{ example.name }}
        </button>
      </div>
      
      <div v-if="currentExample" class="example-display">
        <h5>{{ currentExample.name }}</h5>
        <div class="example-content">
          <div class="example-expression">Expression: {{ currentExample.expression }}</div>
          <div class="example-mistake">Common Mistake: {{ currentExample.mistake }}</div>
          <div class="example-correct">Correct Understanding: {{ currentExample.explanation }}</div>
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Programming Equivalents:</h4>
      <div class="code-examples">
        <div class="code-example">
          <h5>{{ getLanguageName(selectedLanguage) }} Code</h5>
          <pre><code>{{ generateCode() }}</code></pre>
        </div>
        <div class="code-example">
          <h5>Explicit Precedence (Recommended)</h5>
          <pre><code>{{ generateExplicitCode() }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const expression = ref('2 + 3 * 4')
const selectedLanguage = ref('math')
const showAST = ref(false)
const showComparison = ref(false)
const builtExpression = ref('')
const currentExample = ref(null)
const astCanvas = ref(null)

const languages = [
  { id: 'math', name: 'Mathematical', notes: 'Standard mathematical precedence' },
  { id: 'javascript', name: 'JavaScript', notes: 'No integer division, ** for exponentiation' },
  { id: 'python', name: 'Python', notes: '** for exponentiation, // for integer division' },
  { id: 'c', name: 'C/C++', notes: 'Integer division, no exponentiation operator' }
]

const operands = ['1', '2', '3', '4', '5', '10', 'x', 'y']

const operators = [
  { symbol: '+', description: 'Addition' },
  { symbol: '-', description: 'Subtraction' },
  { symbol: '*', description: 'Multiplication' },
  { symbol: '/', description: 'Division' },
  { symbol: '^', description: 'Exponentiation (Math)' },
  { symbol: '**', description: 'Exponentiation (Programming)' },
  { symbol: '%', description: 'Modulo' }
]

const examples = [
  {
    name: 'Missing Parentheses',
    expression: '2 + 3 * 4',
    mistake: 'Thinking this equals (2 + 3) * 4 = 20',
    explanation: 'Actually equals 2 + (3 * 4) = 14 due to precedence'
  },
  {
    name: 'Exponentiation Chain',
    expression: '2^3^2',
    mistake: 'Evaluating left-to-right: (2^3)^2 = 64',
    explanation: 'Right-associative: 2^(3^2) = 2^9 = 512'
  },
  {
    name: 'Division and Multiplication',
    expression: '12 / 3 * 2',
    mistake: 'Thinking division has higher precedence',
    explanation: 'Same precedence, left-to-right: (12/3)*2 = 8'
  },
  {
    name: 'Negative Numbers',
    expression: '-2^4',
    mistake: 'Thinking this equals (-2)^4 = 16',
    explanation: 'Actually -(2^4) = -16 due to precedence'
  }
]

const parsedExpression = ref(null)

// Precedence rules for different languages
const precedenceRulesMap = {
  math: [
    { precedence: 1, operator: '^', description: 'Exponentiation', associativity: 'Right' },
    { precedence: 2, operator: '* /', description: 'Multiplication, Division', associativity: 'Left' },
    { precedence: 3, operator: '+ -', description: 'Addition, Subtraction', associativity: 'Left' }
  ],
  javascript: [
    { precedence: 1, operator: '**', description: 'Exponentiation', associativity: 'Right' },
    { precedence: 2, operator: '* / %', description: 'Multiplication, Division, Modulo', associativity: 'Left' },
    { precedence: 3, operator: '+ -', description: 'Addition, Subtraction', associativity: 'Left' }
  ],
  python: [
    { precedence: 1, operator: '**', description: 'Exponentiation', associativity: 'Right' },
    { precedence: 2, operator: '* / // %', description: 'Multiplication, Division, Floor Division, Modulo', associativity: 'Left' },
    { precedence: 3, operator: '+ -', description: 'Addition, Subtraction', associativity: 'Left' }
  ],
  c: [
    { precedence: 1, operator: '* / %', description: 'Multiplication, Division, Modulo', associativity: 'Left' },
    { precedence: 2, operator: '+ -', description: 'Addition, Subtraction', associativity: 'Left' }
  ]
}

const precedenceRules = computed(() => {
  const rules = precedenceRulesMap[selectedLanguage.value] || precedenceRulesMap.math
  return rules.map(rule => ({
    ...rule,
    highlighted: parsedExpression.value && 
                 parsedExpression.value.operatorsUsed.some(op => rule.operator.includes(op))
  }))
})

const getLanguageName = (langId) => {
  const lang = languages.find(l => l.id === langId)
  return lang ? lang.name : 'Mathematical'
}

// Simple expression parser and evaluator
const evaluateExpression = () => {
  if (!expression.value.trim()) {
    parsedExpression.value = null
    return
  }
  
  try {
    const result = parseAndEvaluate(expression.value, selectedLanguage.value)
    parsedExpression.value = result
    
    setTimeout(() => {
      if (showAST.value) {
        drawAST()
      }
    }, 100)
  } catch (error) {
    parsedExpression.value = {
      result: 'Error: ' + error.message,
      steps: [],
      fullyParenthesized: 'Invalid expression',
      operatorsUsed: []
    }
  }
}

const parseAndEvaluate = (expr, language) => {
  // Remove spaces and prepare expression
  const cleanExpr = expr.replace(/\s+/g, '')
  
  // Convert to postfix notation and evaluate
  const { postfix, steps, fullyParenthesized } = convertToPostfix(cleanExpr, language)
  const result = evaluatePostfix(postfix)
  
  // Extract operators used
  const operatorsUsed = [...new Set(postfix.filter(token => '+-*/%^'.includes(token)))]
  
  return {
    result: isNaN(result) ? 'Error' : result,
    steps,
    fullyParenthesized,
    operatorsUsed
  }
}

const getPrecedence = (operator, language) => {
  const precedenceMap = {
    math: { '^': 3, '*': 2, '/': 2, '+': 1, '-': 1, '%': 2 },
    javascript: { '**': 3, '*': 2, '/': 2, '%': 2, '+': 1, '-': 1 },
    python: { '**': 3, '*': 2, '/': 2, '//': 2, '%': 2, '+': 1, '-': 1 },
    c: { '*': 2, '/': 2, '%': 2, '+': 1, '-': 1 }
  }
  
  const map = precedenceMap[language] || precedenceMap.math
  return map[operator] || 0
}

const isRightAssociative = (operator, language) => {
  if (language === 'math') return operator === '^'
  return operator === '**'
}

const convertToPostfix = (expr, language) => {
  const output = []
  const operators = []
  const steps = []
  let currentExpr = expr
  
  // Tokenize
  const tokens = tokenize(expr)
  
  // Shunting yard algorithm
  for (let token of tokens) {
    if (isNumber(token)) {
      output.push(parseFloat(token))
    } else if (token === '(') {
      operators.push(token)
    } else if (token === ')') {
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        output.push(operators.pop())
      }
      operators.pop() // Remove '('
    } else if (isOperator(token)) {
      while (operators.length > 0 && 
             operators[operators.length - 1] !== '(' &&
             (getPrecedence(operators[operators.length - 1], language) > getPrecedence(token, language) ||
              (getPrecedence(operators[operators.length - 1], language) === getPrecedence(token, language) && 
               !isRightAssociative(token, language)))) {
        output.push(operators.pop())
      }
      operators.push(token)
    }
  }
  
  while (operators.length > 0) {
    output.push(operators.pop())
  }
  
  // Generate evaluation steps
  const evaluationSteps = generateEvaluationSteps(tokens, language)
  
  return {
    postfix: output,
    steps: evaluationSteps,
    fullyParenthesized: addParentheses(expr, language)
  }
}

const tokenize = (expr) => {
  const tokens = []
  let current = ''
  
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i]
    
    if (isDigit(char) || char === '.') {
      current += char
    } else {
      if (current) {
        tokens.push(current)
        current = ''
      }
      
      // Handle ** operator
      if (char === '*' && i + 1 < expr.length && expr[i + 1] === '*') {
        tokens.push('**')
        i++ // Skip next *
      } else if (char === '/' && i + 1 < expr.length && expr[i + 1] === '/') {
        tokens.push('//')
        i++ // Skip next /
      } else if ('+-*/()%^'.includes(char)) {
        tokens.push(char)
      }
    }
  }
  
  if (current) {
    tokens.push(current)
  }
  
  return tokens
}

const isDigit = (char) => /\d/.test(char)
const isNumber = (token) => /^\d+\.?\d*$/.test(token)
const isOperator = (token) => '+-*/%^'.includes(token) || token === '**' || token === '//'

const evaluatePostfix = (postfix) => {
  const stack = []
  
  for (let token of postfix) {
    if (typeof token === 'number') {
      stack.push(token)
    } else {
      const b = stack.pop()
      const a = stack.pop()
      
      switch (token) {
        case '+': stack.push(a + b); break
        case '-': stack.push(a - b); break
        case '*': stack.push(a * b); break
        case '/': stack.push(a / b); break
        case '%': stack.push(a % b); break
        case '^':
        case '**': stack.push(Math.pow(a, b)); break
        case '//': stack.push(Math.floor(a / b)); break
      }
    }
  }
  
  return stack[0]
}

const generateEvaluationSteps = (tokens, language) => {
  const steps = []
  let workingExpr = tokens.join(' ')
  
  // Simulate step-by-step evaluation based on precedence
  const precedenceOrder = language === 'c' ? ['*', '/', '%', '+', '-'] : 
                         language === 'javascript' ? ['**', '*', '/', '%', '+', '-'] :
                         language === 'python' ? ['**', '*', '/', '//', '%', '+', '-'] :
                         ['^', '*', '/', '%', '+', '-']
  
  let stepCount = 0
  for (let op of precedenceOrder) {
    while (workingExpr.includes(op) && stepCount < 10) {
      // Find first occurrence of this operator (considering associativity)
      const regex = isRightAssociative(op, language) ? 
        new RegExp(`(\\d+(?:\\.\\d+)?)\\s*\\${op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(\\d+(?:\\.\\d+)?)`) :
        new RegExp(`(\\d+(?:\\.\\d+)?)\\s*\\${op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(\\d+(?:\\.\\d+)?)`)
      
      const match = workingExpr.match(regex)
      if (!match) break
      
      const a = parseFloat(match[1])
      const b = parseFloat(match[2])
      let result
      
      switch (op) {
        case '+': result = a + b; break
        case '-': result = a - b; break
        case '*': result = a * b; break
        case '/': result = a / b; break
        case '%': result = a % b; break
        case '^':
        case '**': result = Math.pow(a, b); break
        case '//': result = Math.floor(a / b); break
      }
      
      steps.push({
        expression: workingExpr,
        operation: `${a} ${op} ${b}`,
        result: result,
        explanation: `Evaluate ${a} ${op} ${b} = ${result} (${getOperatorDescription(op)} has precedence)`
      })
      
      workingExpr = workingExpr.replace(match[0], result.toString())
      stepCount++
    }
  }
  
  return steps
}

const getOperatorDescription = (op) => {
  const descriptions = {
    '+': 'addition',
    '-': 'subtraction', 
    '*': 'multiplication',
    '/': 'division',
    '%': 'modulo',
    '^': 'exponentiation',
    '**': 'exponentiation',
    '//': 'floor division'
  }
  return descriptions[op] || op
}

const addParentheses = (expr, language) => {
  // Simple algorithm to add parentheses based on precedence
  const tokens = tokenize(expr)
  
  // This is a simplified version - a full implementation would require
  // building an actual parse tree
  let result = expr
  
  // Add parentheses around lower precedence operations
  if (language !== 'c') {
    result = result.replace(/(\d+(?:\.\d+)?)\s*([+\-])\s*(\d+(?:\.\d+)?)\s*([*/])\s*(\d+(?:\.\d+)?)/g, 
                           '($1 $2 $3) $4 $5')
  }
  
  return result
}

const highlightOperation = (expression, operation) => {
  if (!operation) return expression
  
  return expression.replace(operation, `<span class="highlighted-operation">${operation}</span>`)
}

const evaluateForLanguage = (expr, language) => {
  try {
    return parseAndEvaluate(expr, language).result
  } catch {
    return 'Error'
  }
}

const addToExpression = (token) => {
  builtExpression.value += token
  expression.value = builtExpression.value
  evaluateExpression()
}

const clearExpression = () => {
  builtExpression.value = ''
  expression.value = ''
  parsedExpression.value = null
}

const loadExample = (example) => {
  currentExample.value = example
  expression.value = example.expression
  builtExpression.value = example.expression
  evaluateExpression()
}

const generateCode = () => {
  const expr = expression.value
  
  switch (selectedLanguage.value) {
    case 'javascript':
      return `// JavaScript\nlet result = ${expr.replace(/\^/g, '**')};\nconsole.log(result);`
    case 'python':
      return `# Python\nresult = ${expr.replace(/\^/g, '**')}\nprint(result)`
    case 'c':
      return `// C/C++\n#include <stdio.h>\n#include <math.h>\n\nint main() {\n    double result = ${expr.replace(/\^/g, ', ')};\n    printf("%.2f\\n", result);\n    return 0;\n}`
    default:
      return `// Mathematical expression\n${expr}`
  }
}

const generateExplicitCode = () => {
  const fullyParenthesized = parsedExpression.value?.fullyParenthesized || expression.value
  
  switch (selectedLanguage.value) {
    case 'javascript':
      return `// JavaScript with explicit precedence\nlet result = ${fullyParenthesized.replace(/\^/g, '**')};\nconsole.log(result);`
    case 'python':
      return `# Python with explicit precedence\nresult = ${fullyParenthesized.replace(/\^/g, '**')}\nprint(result)`
    case 'c':
      return `// C/C++ with explicit precedence\ndouble result = ${fullyParenthesized};\nprintf("%.2f\\n", result);`
    default:
      return `// Explicit precedence\n${fullyParenthesized}`
  }
}

const drawAST = () => {
  const canvas = astCanvas.value
  if (!canvas || !parsedExpression.value) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  
  ctx.clearRect(0, 0, width, height)
  
  // Simple AST visualization
  // This is a simplified version - a full implementation would parse the actual tree
  
  ctx.fillStyle = '#333'
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  
  // Draw example tree structure for demonstration
  const nodes = [
    { x: width/2, y: 50, text: '+', isOp: true },
    { x: width/4, y: 150, text: '2', isOp: false },
    { x: 3*width/4, y: 150, text: '*', isOp: true },
    { x: 5*width/8, y: 250, text: '3', isOp: false },
    { x: 7*width/8, y: 250, text: '4', isOp: false }
  ]
  
  // Draw connections
  ctx.strokeStyle = '#666'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(width/2, 60)
  ctx.lineTo(width/4, 140)
  ctx.moveTo(width/2, 60)
  ctx.lineTo(3*width/4, 140)
  ctx.moveTo(3*width/4, 160)
  ctx.lineTo(5*width/8, 240)
  ctx.moveTo(3*width/4, 160)
  ctx.lineTo(7*width/8, 240)
  ctx.stroke()
  
  // Draw nodes
  nodes.forEach(node => {
    ctx.fillStyle = node.isOp ? '#FF6B6B' : '#4ECDC4'
    ctx.beginPath()
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.fillStyle = 'white'
    ctx.fillText(node.text, node.x, node.y + 5)
  })
}

watch([showAST, parsedExpression], () => {
  if (showAST.value && parsedExpression.value) {
    setTimeout(drawAST, 100)
  }
})

onMounted(() => {
  evaluateExpression()
})
</script>

<style scoped>
@import '../styles/components.css';

/* Component-specific styles */
.evaluation-steps {
  margin: 1rem 0;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.evaluation-step {
  display: grid;
  grid-template-columns: auto 1fr auto 2fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  align-items: center;
}

.evaluation-step:last-child {
  border-bottom: none;
}

.step-number {
  font-weight: bold;
  color: #2196F3;
  min-width: 60px;
}

.step-expression {
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
}

.highlighted-operation {
  background: #fff3cd;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  border: 2px solid #ffc107;
  font-weight: bold;
}

.step-result {
  font-weight: bold;
  color: #28a745;
  font-family: monospace;
}

.step-explanation {
  color: #666;
  font-style: italic;
  font-size: 0.9em;
}

.precedence-table {
  margin: 1rem 0;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.precedence-header {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr;
  background: #2196F3;
  color: white;
  font-weight: bold;
  padding: 0.75rem;
}

.precedence-row {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr;
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.3s ease;
}

.precedence-row:last-child {
  border-bottom: none;
}

.precedence-row.highlighted {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
}

.precedence-col {
  padding: 0.25rem;
  text-align: center;
}

.precedence-col.operator {
  font-family: monospace;
  font-weight: bold;
  color: #6f42c1;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.comparison-item {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
}

.comparison-item h5 {
  margin: 0 0 0.5rem 0;
  color: #2196F3;
}

.comparison-expression {
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
  margin: 0.5rem 0;
}

.comparison-value {
  font-weight: bold;
  color: #28a745;
  margin: 0.5rem 0;
}

.comparison-notes {
  font-size: 0.85em;
  color: #666;
  font-style: italic;
}

.expression-builder {
  margin: 1rem 0;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.builder-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.builder-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.builder-group label {
  font-weight: bold;
  color: #495057;
}

.builder-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.builder-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #6c757d;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: monospace;
}

.builder-btn:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.operator-btn {
  background: #e3f2fd;
  border-color: #2196F3;
  color: #2196F3;
  font-weight: bold;
}

.clear-btn {
  background: #ffebee;
  border-color: #f44336;
  color: #f44336;
}

.built-expression {
  padding: 1rem;
  background: white;
  border: 2px solid #2196F3;
  border-radius: 4px;
  font-family: 'Times New Roman', serif;
  font-size: 1.2em;
}

.example-display {
  margin: 1rem 0;
  padding: 1.5rem;
  border: 1px solid #ffc107;
  border-radius: 8px;
  background: #fff3cd;
}

.example-display h5 {
  margin: 0 0 1rem 0;
  color: #856404;
}

.example-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.example-expression {
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
  font-weight: bold;
}

.example-mistake {
  color: #dc3545;
  font-weight: 500;
}

.example-correct {
  color: #28a745;
  font-weight: 500;
}

.parenthesized-expression {
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
  color: #2196F3;
  font-weight: bold;
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
  
  .evaluation-step {
    grid-template-columns: 1fr;
    text-align: left;
    gap: 0.5rem;
  }
  
  .precedence-header,
  .precedence-row {
    grid-template-columns: 1fr;
    text-align: left;
  }
  
  .comparison-grid {
    grid-template-columns: 1fr;
  }
  
  .builder-controls {
    gap: 0.75rem;
  }
  
  .code-examples {
    grid-template-columns: 1fr;
  }
  
  .example-content {
    gap: 0.5rem;
  }
  
  .visualization-canvas {
    max-width: 100%;
    height: auto;
  }
}
</style>