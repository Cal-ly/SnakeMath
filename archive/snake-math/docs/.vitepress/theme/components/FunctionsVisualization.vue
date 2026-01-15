<template>
  <div class="functions-visualization">
    <div class="control-panel">
      <div class="function-input">
        <label for="function-input">Function f(x):</label>
        <input 
          id="function-input"
          v-model="functionInput" 
          type="text" 
          placeholder="x**2, sin(x), (x**2-4)/(x-2), etc."
          @keyup.enter="updateFunction"
        />
        <button @click="updateFunction">Plot</button>
      </div>
      
      <div class="limit-controls">
        <label for="limit-point">Limit point (a):</label>
        <input 
          id="limit-point"
          v-model.number="limitPoint" 
          type="number" 
          step="0.1"
          @input="updateVisualization"
        />
        
        <label for="zoom-level">Zoom:</label>
        <input 
          id="zoom-level"
          v-model.number="zoomLevel" 
          type="range" 
          min="0.1" 
          max="5" 
          step="0.1"
          @input="updateVisualization"
        />
        <span>{{ zoomLevel }}x</span>
      </div>

      <div class="preset-functions">
        <label>Preset functions:</label>
        <button @click="loadPreset('x**2')" class="preset-btn">x�</button>
        <button @click="loadPreset('(x**2-4)/(x-2)')" class="preset-btn">(x�-4)/(x-2)</button>
        <button @click="loadPreset('sin(x)/x')" class="preset-btn">sin(x)/x</button>
        <button @click="loadPreset('(np.exp(x)-1)/x')" class="preset-btn">(e�-1)/x</button>
        <button @click="loadPreset('abs(x)')" class="preset-btn">|x|</button>
      </div>
    </div>

    <div class="visualization-container">
      <canvas 
        ref="canvas" 
        width="800" 
        height="600"
        @mousemove="onMouseMove"
        @click="onCanvasClick"
      ></canvas>
      
      <div class="function-info">
        <div class="limit-calculation">
          <h4>Limit Analysis at x = {{ limitPoint }}</h4>
          <div class="limit-values">
            <div>Left limit: {{ leftLimit }}</div>
            <div>Right limit: {{ rightLimit }}</div>
            <div>Function value: {{ functionValue }}</div>
            <div class="limit-result" :class="limitStatus.class">
              {{ limitStatus.text }}
            </div>
          </div>
        </div>
        
        <div class="mouse-info" v-if="mouseInfo.visible">
          <div>Mouse: ({{ mouseInfo.x.toFixed(3) }}, {{ mouseInfo.y.toFixed(3) }})</div>
          <div>f(x) H {{ mouseInfo.fx.toFixed(6) }}</div>
        </div>
      </div>
    </div>

    <div class="numerical-table" v-if="showNumericalData">
      <h4>Numerical Limit Calculation</h4>
      <table>
        <thead>
          <tr>
            <th>x</th>
            <th>f(x)</th>
            <th>Distance from {{ limitPoint }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="point in numericalData" :key="point.x">
            <td>{{ point.x.toFixed(6) }}</td>
            <td>{{ point.fx.toFixed(6) }}</td>
            <td>{{ point.distance.toExponential(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="error-message" v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FunctionsVisualization',
  data() {
    return {
      functionInput: 'x**2',
      limitPoint: 2,
      zoomLevel: 1,
      canvas: null,
      ctx: null,
      mouseInfo: {
        visible: false,
        x: 0,
        y: 0,
        fx: 0
      },
      leftLimit: null,
      rightLimit: null,
      functionValue: null,
      errorMessage: '',
      showNumericalData: false,
      numericalData: [],
      pyodideReady: false
    }
  },
  
  computed: {
    limitStatus() {
      if (this.leftLimit === null || this.rightLimit === null) {
        return { text: 'Calculating...', class: 'calculating' }
      }
      
      const tolerance = 1e-6
      const limitsEqual = Math.abs(this.leftLimit - this.rightLimit) < tolerance
      
      if (!limitsEqual) {
        return { text: 'Limit does not exist (left ` right)', class: 'no-limit' }
      }
      
      if (this.functionValue === null || isNaN(this.functionValue)) {
        return { text: `Limit = ${this.leftLimit.toFixed(6)} (removable discontinuity)`, class: 'removable' }
      }
      
      const limitValue = this.leftLimit
      const continuous = Math.abs(limitValue - this.functionValue) < tolerance
      
      if (continuous) {
        return { text: `Continuous: limit = f(${this.limitPoint}) = ${limitValue.toFixed(6)}`, class: 'continuous' }
      } else {
        return { text: `Jump discontinuity: limit = ${limitValue.toFixed(6)}, f(${this.limitPoint}) = ${this.functionValue.toFixed(6)}`, class: 'jump' }
      }
    }
  },
  
  mounted() {
    this.initializeCanvas()
    this.initializePyodide()
  },
  
  methods: {
    initializeCanvas() {
      this.canvas = this.$refs.canvas
      this.ctx = this.canvas.getContext('2d')
      this.updateVisualization()
    },
    
    async initializePyodide() {
      try {
        if (typeof pyodide === 'undefined') {
          console.log('Pyodide not available, using fallback math evaluation')
          this.pyodideReady = false
        } else {
          await pyodide.loadPackage(['numpy', 'matplotlib'])
          this.pyodideReady = true
        }
        this.updateVisualization()
      } catch (error) {
        console.error('Error initializing Pyodide:', error)
        this.pyodideReady = false
        this.updateVisualization()
      }
    },
    
    loadPreset(preset) {
      this.functionInput = preset
      this.updateFunction()
    },
    
    updateFunction() {
      this.errorMessage = ''
      this.updateVisualization()
    },
    
    evaluateFunction(x) {
      try {
        if (this.pyodideReady) {
          const code = `
import numpy as np
import math

def f(x):
    try:
        return ${this.functionInput.replace(/\*\*/g, '**')}
    except:
        return float('nan')

result = f(${x})
result
          `
          const result = pyodide.runPython(code)
          return result
        } else {
          return this.evaluateJavaScript(x)
        }
      } catch (error) {
        return NaN
      }
    },
    
    evaluateJavaScript(x) {
      try {
        let expr = this.functionInput
        expr = expr.replace(/\*\*/g, '**')
        expr = expr.replace(/np\./g, 'Math.')
        expr = expr.replace(/sin/g, 'Math.sin')
        expr = expr.replace(/cos/g, 'Math.cos')
        expr = expr.replace(/tan/g, 'Math.tan')
        expr = expr.replace(/exp/g, 'Math.exp')
        expr = expr.replace(/log/g, 'Math.log')
        expr = expr.replace(/sqrt/g, 'Math.sqrt')
        expr = expr.replace(/abs/g, 'Math.abs')
        expr = expr.replace(/\*\*/g, '**')
        
        if (expr.includes('**')) {
          expr = expr.replace(/(\w+|\([^)]+\))\*\*(\w+|\([^)]+\))/g, 'Math.pow($1, $2)')
        }
        
        const func = new Function('x', `return ${expr}`)
        return func(x)
      } catch (error) {
        return NaN
      }
    },
    
    calculateLimit(point, epsilon = 1e-8) {
      const leftValues = []
      const rightValues = []
      
      for (let i = 1; i <= 7; i++) {
        const h = Math.pow(10, -i)
        
        const leftX = point - h
        const rightX = point + h
        
        const leftFx = this.evaluateFunction(leftX)
        const rightFx = this.evaluateFunction(rightX)
        
        if (!isNaN(leftFx)) leftValues.push(leftFx)
        if (!isNaN(rightFx)) rightValues.push(rightFx)
      }
      
      const leftLimit = leftValues.length > 0 ? leftValues[leftValues.length - 1] : null
      const rightLimit = rightValues.length > 0 ? rightValues[rightValues.length - 1] : null
      
      return { leftLimit, rightLimit }
    },
    
    updateVisualization() {
      if (!this.ctx) return
      
      this.drawFunction()
      this.calculateLimitValues()
    },
    
    calculateLimitValues() {
      const { leftLimit, rightLimit } = this.calculateLimit(this.limitPoint)
      this.leftLimit = leftLimit
      this.rightLimit = rightLimit
      
      try {
        this.functionValue = this.evaluateFunction(this.limitPoint)
        if (!isFinite(this.functionValue)) {
          this.functionValue = null
        }
      } catch {
        this.functionValue = null
      }
      
      this.generateNumericalData()
    },
    
    generateNumericalData() {
      this.numericalData = []
      
      for (let i = 1; i <= 6; i++) {
        const h = Math.pow(10, -i)
        
        const leftX = this.limitPoint - h
        const rightX = this.limitPoint + h
        
        const leftFx = this.evaluateFunction(leftX)
        const rightFx = this.evaluateFunction(rightX)
        
        if (isFinite(leftFx)) {
          this.numericalData.push({
            x: leftX,
            fx: leftFx,
            distance: h
          })
        }
        
        if (isFinite(rightFx)) {
          this.numericalData.push({
            x: rightX,
            fx: rightFx,
            distance: h
          })
        }
      }
      
      this.numericalData.sort((a, b) => a.x - b.x)
    },
    
    drawFunction() {
      const { width, height } = this.canvas
      this.ctx.clearRect(0, 0, width, height)
      
      const xMin = this.limitPoint - 5 / this.zoomLevel
      const xMax = this.limitPoint + 5 / this.zoomLevel
      const yMin = -10 / this.zoomLevel
      const yMax = 10 / this.zoomLevel
      
      this.drawGrid(xMin, xMax, yMin, yMax)
      this.drawAxes(xMin, xMax, yMin, yMax)
      this.drawFunctionCurve(xMin, xMax, yMin, yMax)
      this.drawLimitPoint(xMin, xMax, yMin, yMax)
    },
    
    drawGrid(xMin, xMax, yMin, yMax) {
      const { width, height } = this.canvas
      this.ctx.strokeStyle = '#f0f0f0'
      this.ctx.lineWidth = 1
      
      const xStep = (xMax - xMin) / 20
      const yStep = (yMax - yMin) / 20
      
      for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        const canvasX = ((x - xMin) / (xMax - xMin)) * width
        this.ctx.beginPath()
        this.ctx.moveTo(canvasX, 0)
        this.ctx.lineTo(canvasX, height)
        this.ctx.stroke()
      }
      
      for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
        const canvasY = height - ((y - yMin) / (yMax - yMin)) * height
        this.ctx.beginPath()
        this.ctx.moveTo(0, canvasY)
        this.ctx.lineTo(width, canvasY)
        this.ctx.stroke()
      }
    },
    
    drawAxes(xMin, xMax, yMin, yMax) {
      const { width, height } = this.canvas
      this.ctx.strokeStyle = '#333'
      this.ctx.lineWidth = 2
      
      if (xMin <= 0 && xMax >= 0) {
        const canvasX = ((-xMin) / (xMax - xMin)) * width
        this.ctx.beginPath()
        this.ctx.moveTo(canvasX, 0)
        this.ctx.lineTo(canvasX, height)
        this.ctx.stroke()
      }
      
      if (yMin <= 0 && yMax >= 0) {
        const canvasY = height - ((-yMin) / (yMax - yMin)) * height
        this.ctx.beginPath()
        this.ctx.moveTo(0, canvasY)
        this.ctx.lineTo(width, canvasY)
        this.ctx.stroke()
      }
    },
    
    drawFunctionCurve(xMin, xMax, yMin, yMax) {
      const { width, height } = this.canvas
      this.ctx.strokeStyle = '#3b82f6'
      this.ctx.lineWidth = 2
      
      const numPoints = width * 2
      let prevX = null
      let prevY = null
      
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + (i / numPoints) * (xMax - xMin)
        const y = this.evaluateFunction(x)
        
        if (isFinite(y) && y >= yMin && y <= yMax) {
          const canvasX = ((x - xMin) / (xMax - xMin)) * width
          const canvasY = height - ((y - yMin) / (yMax - yMin)) * height
          
          if (prevX !== null && prevY !== null) {
            const dx = Math.abs(canvasX - prevX)
            const dy = Math.abs(canvasY - prevY)
            
            if (dx < 50 && dy < 200) {
              this.ctx.beginPath()
              this.ctx.moveTo(prevX, prevY)
              this.ctx.lineTo(canvasX, canvasY)
              this.ctx.stroke()
            }
          }
          
          prevX = canvasX
          prevY = canvasY
        } else {
          prevX = null
          prevY = null
        }
      }
    },
    
    drawLimitPoint(xMin, xMax, yMin, yMax) {
      const { width, height } = this.canvas
      const canvasX = ((this.limitPoint - xMin) / (xMax - xMin)) * width
      
      this.ctx.strokeStyle = '#ef4444'
      this.ctx.lineWidth = 2
      this.ctx.setLineDash([5, 5])
      this.ctx.beginPath()
      this.ctx.moveTo(canvasX, 0)
      this.ctx.lineTo(canvasX, height)
      this.ctx.stroke()
      this.ctx.setLineDash([])
      
      if (this.leftLimit !== null && this.rightLimit !== null) {
        const leftY = height - ((this.leftLimit - yMin) / (yMax - yMin)) * height
        const rightY = height - ((this.rightLimit - yMin) / (yMax - yMin)) * height
        
        this.ctx.fillStyle = '#ef4444'
        this.ctx.beginPath()
        this.ctx.arc(canvasX - 5, leftY, 4, 0, 2 * Math.PI)
        this.ctx.fill()
        
        this.ctx.beginPath()
        this.ctx.arc(canvasX + 5, rightY, 4, 0, 2 * Math.PI)
        this.ctx.fill()
      }
      
      if (this.functionValue !== null && isFinite(this.functionValue)) {
        const functionY = height - ((this.functionValue - yMin) / (yMax - yMin)) * height
        this.ctx.fillStyle = '#10b981'
        this.ctx.beginPath()
        this.ctx.arc(canvasX, functionY, 5, 0, 2 * Math.PI)
        this.ctx.fill()
      }
    },
    
    canvasToCoords(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect()
      const canvasX = clientX - rect.left
      const canvasY = clientY - rect.top
      
      const xMin = this.limitPoint - 5 / this.zoomLevel
      const xMax = this.limitPoint + 5 / this.zoomLevel
      const yMin = -10 / this.zoomLevel
      const yMax = 10 / this.zoomLevel
      
      const x = xMin + (canvasX / this.canvas.width) * (xMax - xMin)
      const y = yMax - (canvasY / this.canvas.height) * (yMax - yMin)
      
      return { x, y }
    },
    
    onMouseMove(event) {
      const { x, y } = this.canvasToCoords(event.clientX, event.clientY)
      const fx = this.evaluateFunction(x)
      
      this.mouseInfo = {
        visible: true,
        x,
        y,
        fx: isFinite(fx) ? fx : NaN
      }
    },
    
    onCanvasClick(event) {
      const { x } = this.canvasToCoords(event.clientX, event.clientY)
      this.limitPoint = Math.round(x * 100) / 100
      this.updateVisualization()
    }
  }
}
</script>

<style scoped>
.functions-visualization {
  max-width: 100%;
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.function-input {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.function-input input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.function-input button {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.function-input button:hover {
  background-color: #2563eb;
}

.limit-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.limit-controls input[type="number"] {
  width: 80px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.limit-controls input[type="range"] {
  width: 120px;
}

.preset-functions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 6px 12px;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.preset-btn:hover {
  background-color: #4b5563;
}

.visualization-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

canvas {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: crosshair;
  max-width: 100%;
  height: auto;
}

.function-info {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.limit-calculation {
  background-color: #f3f4f6;
  padding: 15px;
  border-radius: 6px;
  min-width: 250px;
}

.limit-calculation h4 {
  margin: 0 0 10px 0;
  color: #374151;
}

.limit-values {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.limit-result {
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  font-weight: bold;
}

.limit-result.continuous {
  background-color: #d1fae5;
  color: #065f46;
}

.limit-result.removable {
  background-color: #fef3c7;
  color: #92400e;
}

.limit-result.jump {
  background-color: #fecaca;
  color: #991b1b;
}

.limit-result.no-limit {
  background-color: #fecaca;
  color: #991b1b;
}

.limit-result.calculating {
  background-color: #e5e7eb;
  color: #6b7280;
}

.mouse-info {
  background-color: #f3f4f6;
  padding: 10px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.numerical-table {
  margin-top: 20px;
  width: 100%;
}

.numerical-table table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.numerical-table th,
.numerical-table td {
  padding: 8px 12px;
  text-align: right;
  border: 1px solid #d1d5db;
}

.numerical-table th {
  background-color: #f9fafb;
  font-weight: bold;
}

.error-message {
  color: #ef4444;
  background-color: #fef2f2;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .functions-visualization {
    padding: 15px;
  }
  
  .control-panel {
    padding: 10px;
  }
  
  .function-input,
  .limit-controls,
  .preset-functions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .function-input input {
    min-width: auto;
  }
  
  .function-info {
    flex-direction: column;
    gap: 15px;
  }
  
  canvas {
    width: 100%;
    height: 300px;
  }
}
</style>