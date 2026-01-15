<!-- MatrixTransformations.vue 
Component conceptualization:
Create an interactive matrix operations explorer where users can:
- Build matrices by entering values and see real-time calculations
- Visualize matrix operations through animated transformations
- Compare different matrix multiplication orders and see non-commutativity
- Explore geometric transformations (rotation, scaling, reflection) as matrices
- See how matrix operations affect 2D/3D coordinate systems visually
- Interactive eigenvalue/eigenvector visualization with adjustable matrices
- Step-by-step matrix multiplication with highlighted calculation paths
- Linear system solving with matrix elimination visualization
- PCA demonstration with scatter plots and principal component overlays
The component should provide both numerical results and geometric intuition. 
-->
<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Interactive Matrix Transformations</h3>
      
      <div class="input-group">
        <label class="input-group-title">Transformation Type:</label>
        <select v-model="transformationType" @change="updateMatrix" class="function-select">
          <option value="identity">Identity</option>
          <option value="scale">Scale</option>
          <option value="rotation">Rotation</option>
          <option value="shear">Shear</option>
          <option value="reflection">Reflection</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      
      <div v-if="transformationType === 'scale'" class="interactive-card">
        <div class="input-group">
          <label>Scale X:</label>
          <input type="range" v-model="scaleX" min="0.1" max="3" step="0.1" @input="updateMatrix" class="range-input">
          <span class="result-value">{{ scaleX }}</span>
        </div>
        <div class="input-group">
          <label>Scale Y:</label>
          <input type="range" v-model="scaleY" min="0.1" max="3" step="0.1" @input="updateMatrix" class="range-input">
          <span class="result-value">{{ scaleY }}</span>
        </div>
      </div>
      
      <div v-if="transformationType === 'rotation'" class="interactive-card">
        <div class="input-group">
          <label>Angle (degrees):</label>
          <input type="range" v-model="rotationAngle" min="0" max="360" step="1" @input="updateMatrix" class="range-input">
          <span class="result-value">{{ rotationAngle }}°</span>
        </div>
      </div>
      
      <div v-if="transformationType === 'shear'" class="interactive-card">
        <div class="input-group">
          <label>Shear X:</label>
          <input type="range" v-model="shearX" min="-2" max="2" step="0.1" @input="updateMatrix" class="range-input">
          <span class="result-value">{{ shearX }}</span>
        </div>
        <div class="input-group">
          <label>Shear Y:</label>
          <input type="range" v-model="shearY" min="-2" max="2" step="0.1" @input="updateMatrix" class="range-input">
          <span class="result-value">{{ shearY }}</span>
        </div>
      </div>
      
      <div v-if="transformationType === 'custom'" class="interactive-card">
        <h4 class="input-group-title">Custom 2×2 Matrix:</h4>
        <div class="matrix-grid">
          <input type="number" v-model="customMatrix.a" @input="updateTransformation" step="0.1">
          <input type="number" v-model="customMatrix.b" @input="updateTransformation" step="0.1">
          <input type="number" v-model="customMatrix.c" @input="updateTransformation" step="0.1">
          <input type="number" v-model="customMatrix.d" @input="updateTransformation" step="0.1">
        </div>
      </div>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">Transformation Matrix:</h4>
      <div class="matrix-display">
        <div class="matrix">
          <div class="matrix-bracket">[</div>
          <div class="matrix-content">
            <div class="matrix-row">{{ matrix.a }} {{ matrix.b }}</div>
            <div class="matrix-row">{{ matrix.c }} {{ matrix.d }}</div>
          </div>
          <div class="matrix-bracket">]</div>
        </div>
        
        <div class="matrix-properties">
          <div class="property">
            <strong>Determinant:</strong> {{ determinant }}
          </div>
          <div class="property">
            <strong>Effect:</strong> {{ matrixEffect }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="visualization-container">
      <canvas ref="transformCanvas" width="600" height="400" class="visualization-canvas"></canvas>
    </div>
    
    <div class="component-section">
      <h4 class="input-group-title">How it works:</h4>
      <div class="result-highlight">
        Matrix multiplication transforms each point (x, y) to (x', y') where:<br>
        x' = {{ matrix.a }}x + {{ matrix.b }}y<br>
        y' = {{ matrix.c }}x + {{ matrix.d }}y
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const transformationType = ref('identity')
const scaleX = ref(1)
const scaleY = ref(1)
const rotationAngle = ref(45)
const shearX = ref(0.5)
const shearY = ref(0)
const customMatrix = ref({ a: 1, b: 0, c: 0, d: 1 })
const transformCanvas = ref(null)

const matrix = ref({ a: 1, b: 0, c: 0, d: 1 })

const determinant = computed(() => {
  return parseFloat((matrix.value.a * matrix.value.d - matrix.value.b * matrix.value.c).toFixed(3))
})

const matrixEffect = computed(() => {
  const det = determinant.value
  if (Math.abs(det) < 0.001) return 'Collapses to lower dimension'
  if (det > 0) return `Preserves orientation, scales area by ${Math.abs(det)}`
  return `Reverses orientation, scales area by ${Math.abs(det)}`
})

const updateMatrix = () => {
  switch (transformationType.value) {
    case 'identity':
      matrix.value = { a: 1, b: 0, c: 0, d: 1 }
      break
    case 'scale':
      matrix.value = { a: scaleX.value, b: 0, c: 0, d: scaleY.value }
      break
    case 'rotation':
      const rad = rotationAngle.value * Math.PI / 180
      matrix.value = {
        a: parseFloat(Math.cos(rad).toFixed(3)),
        b: parseFloat(-Math.sin(rad).toFixed(3)),
        c: parseFloat(Math.sin(rad).toFixed(3)),
        d: parseFloat(Math.cos(rad).toFixed(3))
      }
      break
    case 'shear':
      matrix.value = { a: 1, b: shearX.value, c: shearY.value, d: 1 }
      break
    case 'reflection':
      matrix.value = { a: 1, b: 0, c: 0, d: -1 } // Reflection across x-axis
      break
    case 'custom':
      matrix.value = { ...customMatrix.value }
      break
  }
  drawTransformation()
}

const updateTransformation = () => {
  if (transformationType.value === 'custom') {
    matrix.value = { ...customMatrix.value }
    drawTransformation()
  }
}

const drawTransformation = () => {
  const canvas = transformCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const centerX = width / 2
  const centerY = height / 2
  const scale = 50
  
  ctx.clearRect(0, 0, width, height)
  
  // Draw grid
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  for (let i = -5; i <= 5; i++) {
    ctx.beginPath()
    ctx.moveTo(centerX + i * scale, 0)
    ctx.lineTo(centerX + i * scale, height)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(0, centerY + i * scale)
    ctx.lineTo(width, centerY + i * scale)
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
  
  // Original unit square
  const square = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 }
  ]
  
  // Draw original square
  ctx.strokeStyle = '#2196F3'
  ctx.lineWidth = 2
  ctx.beginPath()
  square.forEach((point, i) => {
    const x = centerX + point.x * scale
    const y = centerY - point.y * scale
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
  
  // Transform and draw transformed square
  const transformed = square.map(point => ({
    x: matrix.value.a * point.x + matrix.value.b * point.y,
    y: matrix.value.c * point.x + matrix.value.d * point.y
  }))
  
  ctx.strokeStyle = '#F44336'
  ctx.lineWidth = 3
  ctx.beginPath()
  transformed.forEach((point, i) => {
    const x = centerX + point.x * scale
    const y = centerY - point.y * scale
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
  
  // Draw unit vectors
  const unitI = { x: 1, y: 0 }
  const unitJ = { x: 0, y: 1 }
  
  const transformedI = {
    x: matrix.value.a * unitI.x + matrix.value.b * unitI.y,
    y: matrix.value.c * unitI.x + matrix.value.d * unitI.y
  }
  
  const transformedJ = {
    x: matrix.value.a * unitJ.x + matrix.value.b * unitJ.y,
    y: matrix.value.c * unitJ.x + matrix.value.d * unitJ.y
  }
  
  // Draw original unit vectors
  ctx.strokeStyle = '#4CAF50'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX + scale, centerY)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX, centerY - scale)
  ctx.stroke()
  
  // Draw transformed unit vectors
  ctx.strokeStyle = '#FF9800'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX + transformedI.x * scale, centerY - transformedI.y * scale)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX + transformedJ.x * scale, centerY - transformedJ.y * scale)
  ctx.stroke()
  
  // Labels
  ctx.fillStyle = '#000000'
  ctx.font = '12px Arial'
  ctx.fillText('Original (blue)', 10, 20)
  ctx.fillStyle = '#2196F3'
  ctx.fillRect(120, 12, 20, 3)
  
  ctx.fillStyle = '#000000'
  ctx.fillText('Transformed (red)', 10, 40)
  ctx.fillStyle = '#F44336'
  ctx.fillRect(140, 32, 20, 3)
}

watch([transformationType, scaleX, scaleY, rotationAngle, shearX, shearY], updateMatrix)
watch(customMatrix, updateTransformation, { deep: true })

onMounted(() => {
  updateMatrix()
})
</script>

<style scoped>
@import '../styles/components.css';
</style>