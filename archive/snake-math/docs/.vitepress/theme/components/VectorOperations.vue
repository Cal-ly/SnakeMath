<!-- VectorOperations.vue 
 Component conceptualization:
Create an interactive vector operations explorer where users can:
- Visualize vectors as arrows in 2D/3D coordinate systems
- Manipulate vector components with sliders and see real-time updates
- Perform vector addition and see the parallelogram law visually
- Explore scalar multiplication and its geometric effects
- Calculate and visualize dot products with angle indicators
- Demonstrate cross products in 3D with orthogonal result vectors
- Show vector projections with component breakdowns
- Interactive physics simulations (velocity, acceleration, forces)
- Compare manual calculations with NumPy operations side-by-side
- Unit vector normalization with magnitude preservation
The component should provide both numerical results and geometric intuition.
-->
<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Interactive Vector Operations</h3>
      
      <div class="component-section">
        <div class="input-group">
          <h4 class="input-group-title">Vector A:</h4>
          <div class="component-inputs">
            <label>x:</label>
            <input type="number" v-model="vectorA.x" @input="updateCalculations" step="0.1">
            <label>y:</label>
            <input type="number" v-model="vectorA.y" @input="updateCalculations" step="0.1">
            <label>z:</label>
            <input type="number" v-model="vectorA.z" @input="updateCalculations" step="0.1">
          </div>
        </div>
        
        <div class="input-group">
          <h4 class="input-group-title">Vector B:</h4>
          <div class="component-inputs">
            <label>x:</label>
            <input type="number" v-model="vectorB.x" @input="updateCalculations" step="0.1">
            <label>y:</label>
            <input type="number" v-model="vectorB.y" @input="updateCalculations" step="0.1">
            <label>z:</label>
            <input type="number" v-model="vectorB.z" @input="updateCalculations" step="0.1">
          </div>
        </div>
        
        <div class="btn-group">
          <button @click="loadPreset('unit')" class="preset-btn">Unit Vectors</button>
          <button @click="loadPreset('orthogonal')" class="preset-btn">Orthogonal</button>
          <button @click="loadPreset('parallel')" class="preset-btn">Parallel</button>
        </div>
      </div>
    </div>
    
    <div class="visualization-container">
      <canvas ref="vectorCanvas" width="500" height="400" class="visualization-canvas"></canvas>
    </div>
    
    <div class="component-section">
      <div class="results-grid">
        <div class="result-card">
          <h4 class="input-group-title">Vector Addition</h4>
          <div class="result-value">A + B = ({{ operations.addition.x }}, {{ operations.addition.y }}, {{ operations.addition.z }})</div>
          <div class="result-label">|A + B| = {{ operations.addition.magnitude }}</div>
        </div>
        
        <div class="result-card">
          <h4 class="input-group-title">Vector Subtraction</h4>
          <div class="result-value">A - B = ({{ operations.subtraction.x }}, {{ operations.subtraction.y }}, {{ operations.subtraction.z }})</div>
          <div class="result-label">|A - B| = {{ operations.subtraction.magnitude }}</div>
        </div>
        
        <div class="result-card">
          <h4 class="input-group-title">Dot Product</h4>
          <div class="result-value">A · B = {{ operations.dotProduct }}</div>
          <div class="result-label">Angle = {{ operations.angle }}°</div>
        </div>
        
        <div class="result-card">
          <h4 class="input-group-title">Cross Product</h4>
          <div class="result-value">A × B = ({{ operations.crossProduct.x }}, {{ operations.crossProduct.y }}, {{ operations.crossProduct.z }})</div>
          <div class="result-label">|A × B| = {{ operations.crossProduct.magnitude }}</div>
        </div>
        
        <div class="result-card">
          <h4 class="input-group-title">Vector A Properties</h4>
          <div class="result-value">Magnitude: {{ vectorProperties.A.magnitude }}</div>
          <div class="result-value">Unit vector: ({{ vectorProperties.A.unit.x }}, {{ vectorProperties.A.unit.y }}, {{ vectorProperties.A.unit.z }})</div>
        </div>
        
        <div class="result-card">
          <h4 class="input-group-title">Vector B Properties</h4>
          <div class="result-value">Magnitude: {{ vectorProperties.B.magnitude }}</div>
          <div class="result-value">Unit vector: ({{ vectorProperties.B.unit.x }}, {{ vectorProperties.B.unit.y }}, {{ vectorProperties.B.unit.z }})</div>
        </div>
      </div>
    </div>
    
    <div class="applications">
      <h4 class="input-group-title">Vector Applications</h4>
      <div class="controls-grid">
        <div class="interactive-card" @click="loadApplication('physics')" :class="{ active: currentApp === 'physics' }">
          <h5 class="app-title">Physics: Forces</h5>
          <p class="app-description">Calculate resultant force from multiple force vectors</p>
        </div>
        
        <div class="interactive-card" @click="loadApplication('navigation')" :class="{ active: currentApp === 'navigation' }">
          <h5 class="app-title">Navigation</h5>
          <p class="app-description">Find displacement and bearing from position vectors</p>
        </div>
        
        <div class="interactive-card" @click="loadApplication('graphics')" :class="{ active: currentApp === 'graphics' }">
          <h5 class="app-title">Computer Graphics</h5>
          <p class="app-description">Normal vectors for lighting calculations</p>
        </div>
      </div>
      
      <div v-if="applicationData" class="app-details fade-in">
        <h5 class="app-title">{{ applicationData.title }}</h5>
        <p class="app-description">{{ applicationData.description }}</p>
        <div class="app-result">{{ applicationData.result }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const vectorA = ref({ x: 3, y: 2, z: 1 })
const vectorB = ref({ x: 1, y: 4, z: 2 })
const currentApp = ref(null)
const vectorCanvas = ref(null)

const operations = computed(() => {
  const addition = {
    x: parseFloat((vectorA.value.x + vectorB.value.x).toFixed(3)),
    y: parseFloat((vectorA.value.y + vectorB.value.y).toFixed(3)),
    z: parseFloat((vectorA.value.z + vectorB.value.z).toFixed(3))
  }
  addition.magnitude = parseFloat(Math.sqrt(addition.x**2 + addition.y**2 + addition.z**2).toFixed(3))
  
  const subtraction = {
    x: parseFloat((vectorA.value.x - vectorB.value.x).toFixed(3)),
    y: parseFloat((vectorA.value.y - vectorB.value.y).toFixed(3)),
    z: parseFloat((vectorA.value.z - vectorB.value.z).toFixed(3))
  }
  subtraction.magnitude = parseFloat(Math.sqrt(subtraction.x**2 + subtraction.y**2 + subtraction.z**2).toFixed(3))
  
  const dotProduct = parseFloat((
    vectorA.value.x * vectorB.value.x + 
    vectorA.value.y * vectorB.value.y + 
    vectorA.value.z * vectorB.value.z
  ).toFixed(3))
  
  const magA = Math.sqrt(vectorA.value.x**2 + vectorA.value.y**2 + vectorA.value.z**2)
  const magB = Math.sqrt(vectorB.value.x**2 + vectorB.value.y**2 + vectorB.value.z**2)
  const angle = magA === 0 || magB === 0 ? 0 : parseFloat((Math.acos(dotProduct / (magA * magB)) * 180 / Math.PI).toFixed(1))
  
  const crossProduct = {
    x: parseFloat((vectorA.value.y * vectorB.value.z - vectorA.value.z * vectorB.value.y).toFixed(3)),
    y: parseFloat((vectorA.value.z * vectorB.value.x - vectorA.value.x * vectorB.value.z).toFixed(3)),
    z: parseFloat((vectorA.value.x * vectorB.value.y - vectorA.value.y * vectorB.value.x).toFixed(3))
  }
  crossProduct.magnitude = parseFloat(Math.sqrt(crossProduct.x**2 + crossProduct.y**2 + crossProduct.z**2).toFixed(3))
  
  return { addition, subtraction, dotProduct, angle, crossProduct }
})

const vectorProperties = computed(() => {
  const magA = parseFloat(Math.sqrt(vectorA.value.x**2 + vectorA.value.y**2 + vectorA.value.z**2).toFixed(3))
  const magB = parseFloat(Math.sqrt(vectorB.value.x**2 + vectorB.value.y**2 + vectorB.value.z**2).toFixed(3))
  
  const unitA = magA === 0 ? { x: 0, y: 0, z: 0 } : {
    x: parseFloat((vectorA.value.x / magA).toFixed(3)),
    y: parseFloat((vectorA.value.y / magA).toFixed(3)),
    z: parseFloat((vectorA.value.z / magA).toFixed(3))
  }
  
  const unitB = magB === 0 ? { x: 0, y: 0, z: 0 } : {
    x: parseFloat((vectorB.value.x / magB).toFixed(3)),
    y: parseFloat((vectorB.value.y / magB).toFixed(3)),
    z: parseFloat((vectorB.value.z / magB).toFixed(3))
  }
  
  return {
    A: { magnitude: magA, unit: unitA },
    B: { magnitude: magB, unit: unitB }
  }
})

const applicationData = computed(() => {
  if (!currentApp.value) return null
  
  switch (currentApp.value) {
    case 'physics':
      const resultantMag = operations.value.addition.magnitude
      return {
        title: 'Force Vectors in Physics',
        description: 'Two forces acting on an object combine to produce a resultant force.',
        result: `Resultant force: ${resultantMag} N at angle ${operations.value.angle}° between original forces`
      }
    case 'navigation':
      return {
        title: 'Navigation and Displacement',
        description: 'Calculate total displacement from multiple movement vectors.',
        result: `Total displacement: ${operations.value.addition.magnitude} units from origin`
      }
    case 'graphics':
      const normal = operations.value.crossProduct
      return {
        title: 'Surface Normal Calculation',
        description: 'Cross product gives normal vector for surface lighting.',
        result: `Normal vector: (${normal.x}, ${normal.y}, ${normal.z}) with magnitude ${normal.magnitude}`
      }
    default:
      return null
  }
})

const loadPreset = (type) => {
  switch (type) {
    case 'unit':
      vectorA.value = { x: 1, y: 0, z: 0 }
      vectorB.value = { x: 0, y: 1, z: 0 }
      break
    case 'orthogonal':
      vectorA.value = { x: 3, y: 4, z: 0 }
      vectorB.value = { x: 4, y: -3, z: 0 }
      break
    case 'parallel':
      vectorA.value = { x: 2, y: 3, z: 1 }
      vectorB.value = { x: 4, y: 6, z: 2 }
      break
  }
  updateCalculations()
}

const loadApplication = (app) => {
  currentApp.value = currentApp.value === app ? null : app
  
  switch (app) {
    case 'physics':
      vectorA.value = { x: 10, y: 0, z: 0 }  // 10N eastward
      vectorB.value = { x: 0, y: 8, z: 0 }   // 8N northward
      break
    case 'navigation':
      vectorA.value = { x: 5, y: 3, z: 0 }   // 5km east, 3km north
      vectorB.value = { x: -2, y: 4, z: 0 }  // 2km west, 4km north
      break
    case 'graphics':
      vectorA.value = { x: 1, y: 0, z: 0 }   // Edge vector 1
      vectorB.value = { x: 0, y: 1, z: 0 }   // Edge vector 2
      break
  }
  updateCalculations()
}

const updateCalculations = () => {
  setTimeout(() => {
    drawVectors()
  }, 100)
}

const drawVectors = () => {
  const canvas = vectorCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const centerX = width / 2
  const centerY = height / 2
  const scale = 20
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Draw grid
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  
  for (let x = 0; x <= width; x += 20) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  
  for (let y = 0; y <= height; y += 20) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  
  // Draw axes
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(width, centerY)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(centerX, 0)
  ctx.lineTo(centerX, height)
  ctx.stroke()
  
  // Draw vectors
  const drawVector = (vector, color, label, offset = 0) => {
    const endX = centerX + vector.x * scale
    const endY = centerY - vector.y * scale // Negative because canvas Y increases downward
    
    // Vector line
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    
    // Arrowhead
    const angle = Math.atan2(endY - centerY, endX - centerX)
    const arrowLength = 10
    
    ctx.beginPath()
    ctx.moveTo(endX, endY)
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - Math.PI / 6),
      endY - arrowLength * Math.sin(angle - Math.PI / 6)
    )
    ctx.moveTo(endX, endY)
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + Math.PI / 6),
      endY - arrowLength * Math.sin(angle + Math.PI / 6)
    )
    ctx.stroke()
    
    // Label
    ctx.fillStyle = color
    ctx.font = 'bold 14px Arial'
    ctx.fillText(label, endX + 10, endY - 10 + offset)
  }
  
  // Draw individual vectors
  drawVector(vectorA.value, '#2196F3', 'A')
  drawVector(vectorB.value, '#F44336', 'B', 15)
  
  // Draw addition result
  drawVector(operations.value.addition, '#4CAF50', 'A + B', 30)
  
  // Draw vector B from tip of A (for addition visualization)
  const tipAX = centerX + vectorA.value.x * scale
  const tipAY = centerY - vectorA.value.y * scale
  const tipBX = tipAX + vectorB.value.x * scale
  const tipBY = tipAY - vectorB.value.y * scale
  
  ctx.strokeStyle = '#F44336'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(tipAX, tipAY)
  ctx.lineTo(tipBX, tipBY)
  ctx.stroke()
  ctx.setLineDash([])
  
  // Labels
  ctx.fillStyle = '#000000'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('O', centerX - 10, centerY + 15)
}

watch([vectorA, vectorB], updateCalculations, { deep: true })

onMounted(() => {
  updateCalculations()
})
</script>

<style scoped>
@import '../styles/components.css';

/* Component-specific styles only */
.applications {
  margin: 1.5rem 0;
}
</style>