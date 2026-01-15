<!-- UnitCircleExplorer.vue 
 Component conceptualization:
Create an interactive unit circle and trigonometric functions explorer where users can:
- Visualize the unit circle with draggable point to explore angle relationships
- Display real-time sin, cos, and tan values as the angle changes
- Show animated graphs of sine, cosine, and tangent functions
- Demonstrate phase relationships between different trigonometric functions
- Interactive transformation controls (amplitude, frequency, phase shift)
- Special angle calculator with exact values (30°, 45°, 60°, etc.)
- Triangle overlay showing right triangle relationships
- Wave visualization showing how circular motion creates sinusoidal waves
- Angle conversion between radians and degrees with visual feedback
- Trigonometric identity verification with dynamic calculations
The component should provide both geometric intuition and analytical understanding.
-->
<template>
  <div class="interactive-component">
    <div class="component-section">
      <h3 class="section-title">Interactive Unit Circle Explorer</h3>
      
      <div class="angle-controls">
        <div class="slider-group">
          <label>Angle (degrees):</label>
          <input type="range" v-model="angleDegrees" min="0" max="360" step="1" @input="updateAngle">
          <span class="value">{{ angleDegrees }}°</span>
        </div>
        
        <div class="slider-group">
          <label>Angle (radians):</label>
          <input type="range" v-model="angleRadians" min="0" max="6.28" step="0.01" @input="updateAngleFromRadians">
          <span class="value">{{ angleRadians }}</span>
        </div>
        
        <div class="input-group">
          <label>Enter angle (degrees):</label>
          <input type="number" v-model="angleDegrees" @input="updateAngle" step="1" class="angle-input">
          <span>degrees</span>
        </div>
      </div>
      
      <div class="special-angles">
        <h4>Special Angles:</h4>
        <div class="angle-buttons">
          <button @click="setAngle(0)" class="angle-btn">0°</button>
          <button @click="setAngle(30)" class="angle-btn">30°</button>
          <button @click="setAngle(45)" class="angle-btn">45°</button>
          <button @click="setAngle(60)" class="angle-btn">60°</button>
          <button @click="setAngle(90)" class="angle-btn">90°</button>
          <button @click="setAngle(120)" class="angle-btn">120°</button>
          <button @click="setAngle(135)" class="angle-btn">135°</button>
          <button @click="setAngle(150)" class="angle-btn">150°</button>
          <button @click="setAngle(180)" class="angle-btn">180°</button>
          <button @click="setAngle(270)" class="angle-btn">270°</button>
        </div>
      </div>
      
      <div class="animation-controls">
        <button @click="toggleAnimation" class="control-btn">{{ isAnimating ? 'Stop' : 'Start' }} Animation</button>
        <div class="speed-control">
          <label>Speed:</label>
          <input type="range" v-model="animationSpeed" min="1" max="10" step="1">
          <span>{{ animationSpeed }}</span>
        </div>
      </div>
    </div>
    
    <div class="visualization-container">
      <canvas ref="circleCanvas" width="600" height="600" class="visualization-canvas"></canvas>
    </div>
    
    <div class="trig-values">
      <h4>Trigonometric Values</h4>
      <div class="values-grid">
        <div class="value-card sin">
          <div class="value-label">sin({{ angleDegrees }}°)</div>
          <div class="value-number">{{ trigValues.sin }}</div>
          <div class="value-description">y-coordinate</div>
        </div>
        
        <div class="value-card cos">
          <div class="value-label">cos({{ angleDegrees }}°)</div>
          <div class="value-number">{{ trigValues.cos }}</div>
          <div class="value-description">x-coordinate</div>
        </div>
        
        <div class="value-card tan">
          <div class="value-label">tan({{ angleDegrees }}°)</div>
          <div class="value-number">{{ trigValues.tan }}</div>
          <div class="value-description">sin/cos</div>
        </div>
        
        <div class="value-card">
          <div class="value-label">Distance from origin</div>
          <div class="value-number">1.000</div>
          <div class="value-description">radius of unit circle</div>
        </div>
      </div>
    </div>
    
    <div class="coordinates">
      <h4>Point Coordinates</h4>
      <div class="coord-display">
        <div class="coord-item">
          <strong>Cartesian:</strong> ({{ trigValues.cos }}, {{ trigValues.sin }})
        </div>
        <div class="coord-item">
          <strong>Polar:</strong> (1, {{ angleRadians }}π radians) = (1, {{ angleDegrees }}°)
        </div>
      </div>
    </div>
    
    <div class="quadrant-info">
      <h4>Quadrant Analysis</h4>
      <div class="quadrant-display">
        <div class="quadrant-item">
          <strong>Current Quadrant:</strong> {{ currentQuadrant }}
        </div>
        <div class="quadrant-item">
          <strong>Sign Pattern:</strong> {{ signPattern }}
        </div>
        <div class="quadrant-item">
          <strong>Reference Angle:</strong> {{ referenceAngle }}°
        </div>
      </div>
    </div>
    
    <div class="identities">
      <h4>Trigonometric Identities</h4>
      <div class="identity-checks">
        <div class="identity">
          <span>sin²θ + cos²θ = </span>
          <span class="identity-value">{{ identityCheck.pythagorean }}</span>
          <span class="identity-status">{{ identityCheck.pythagorean === '1.000' ? '✓' : '✗' }}</span>
        </div>
        
        <div class="identity">
          <span>tan θ = sin θ / cos θ = </span>
          <span class="identity-value">{{ identityCheck.tanRatio }}</span>
          <span class="identity-status">{{ Math.abs(parseFloat(identityCheck.tanRatio) - parseFloat(trigValues.tan)) < 0.001 ? '✓' : '✗' }}</span>
        </div>
      </div>
    </div>
    
    <div class="wave-functions">
      <h4>Sine and Cosine Waves</h4>
      <canvas ref="waveCanvas" width="600" height="300"></canvas>
      <div class="wave-info">
        <div class="current-point">
          <div class="point-indicator sin-point">● Current sin value</div>
          <div class="point-indicator cos-point">● Current cos value</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const angleDegrees = ref(45)
const angleRadians = ref(Math.PI / 4)
const isAnimating = ref(false)
const animationSpeed = ref(5)
const circleCanvas = ref(null)
const waveCanvas = ref(null)
let animationId = null

const trigValues = computed(() => {
  const radians = (angleDegrees.value * Math.PI) / 180
  const sin = parseFloat(Math.sin(radians).toFixed(3))
  const cos = parseFloat(Math.cos(radians).toFixed(3))
  const tan = Math.abs(cos) < 0.001 ? 'undefined' : parseFloat(Math.tan(radians).toFixed(3))
  
  return { sin, cos, tan }
})

const currentQuadrant = computed(() => {
  const angle = angleDegrees.value % 360
  if (angle >= 0 && angle < 90) return 'I'
  else if (angle >= 90 && angle < 180) return 'II'
  else if (angle >= 180 && angle < 270) return 'III'
  else return 'IV'
})

const signPattern = computed(() => {
  const quad = currentQuadrant.value
  const patterns = {
    'I': 'sin(+), cos(+), tan(+)',
    'II': 'sin(+), cos(-), tan(-)',
    'III': 'sin(-), cos(-), tan(+)',
    'IV': 'sin(-), cos(+), tan(-)'
  }
  return patterns[quad]
})

const referenceAngle = computed(() => {
  const angle = angleDegrees.value % 360
  if (angle <= 90) return angle
  else if (angle <= 180) return 180 - angle
  else if (angle <= 270) return angle - 180
  else return 360 - angle
})

const identityCheck = computed(() => {
  const sin2 = Math.pow(trigValues.value.sin, 2)
  const cos2 = Math.pow(trigValues.value.cos, 2)
  const pythagorean = (sin2 + cos2).toFixed(3)
  
  const tanRatio = Math.abs(trigValues.value.cos) < 0.001 
    ? 'undefined' 
    : (trigValues.value.sin / trigValues.value.cos).toFixed(3)
  
  return { pythagorean, tanRatio }
})

const updateAngle = () => {
  angleRadians.value = parseFloat(((angleDegrees.value * Math.PI) / 180).toFixed(3))
  drawUnitCircle()
  drawWaves()
}

const updateAngleFromRadians = () => {
  angleDegrees.value = Math.round((angleRadians.value * 180) / Math.PI)
  drawUnitCircle()
  drawWaves()
}

const setAngle = (degrees) => {
  angleDegrees.value = degrees
  updateAngle()
}

const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value
  if (isAnimating.value) {
    startAnimation()
  } else {
    stopAnimation()
  }
}

const startAnimation = () => {
  const animate = () => {
    angleDegrees.value = (angleDegrees.value + animationSpeed.value) % 360
    updateAngle()
    
    if (isAnimating.value) {
      animationId = requestAnimationFrame(animate)
    }
  }
  animate()
}

const stopAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const drawUnitCircle = () => {
  const canvas = circleCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 200
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Draw coordinate grid
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  
  for (let i = -2; i <= 2; i++) {
    if (i !== 0) {
      // Vertical lines
      ctx.beginPath()
      ctx.moveTo(centerX + i * radius/2, centerY - radius * 1.2)
      ctx.lineTo(centerX + i * radius/2, centerY + radius * 1.2)
      ctx.stroke()
      
      // Horizontal lines
      ctx.beginPath()
      ctx.moveTo(centerX - radius * 1.2, centerY + i * radius/2)
      ctx.lineTo(centerX + radius * 1.2, centerY + i * radius/2)
      ctx.stroke()
    }
  }
  
  // Draw axes
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  
  // X-axis
  ctx.beginPath()
  ctx.moveTo(centerX - radius * 1.2, centerY)
  ctx.lineTo(centerX + radius * 1.2, centerY)
  ctx.stroke()
  
  // Y-axis
  ctx.beginPath()
  ctx.moveTo(centerX, centerY - radius * 1.2)
  ctx.lineTo(centerX, centerY + radius * 1.2)
  ctx.stroke()
  
  // Draw unit circle
  ctx.strokeStyle = '#333333'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.stroke()
  
  // Calculate point position
  const radians = (angleDegrees.value * Math.PI) / 180
  const pointX = centerX + radius * Math.cos(radians)
  const pointY = centerY - radius * Math.sin(radians) // Negative because canvas Y increases downward
  
  // Draw radius line
  ctx.strokeStyle = '#2196F3'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(pointX, pointY)
  ctx.stroke()
  
  // Draw angle arc
  ctx.strokeStyle = '#4CAF50'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(centerX, centerY, 30, 0, -radians, radians > Math.PI)
  ctx.stroke()
  
  // Draw point on circle
  ctx.fillStyle = '#FF5722'
  ctx.beginPath()
  ctx.arc(pointX, pointY, 8, 0, 2 * Math.PI)
  ctx.fill()
  
  // Draw coordinate lines
  ctx.strokeStyle = '#FF9800'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  
  // Vertical line (sin)
  ctx.beginPath()
  ctx.moveTo(pointX, centerY)
  ctx.lineTo(pointX, pointY)
  ctx.stroke()
  
  // Horizontal line (cos)
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(pointX, centerY)
  ctx.stroke()
  
  ctx.setLineDash([])
  
  // Labels
  ctx.fillStyle = '#000000'
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  
  // Axis labels
  ctx.fillText('1', centerX + radius + 15, centerY + 5)
  ctx.fillText('-1', centerX - radius - 15, centerY + 5)
  ctx.fillText('1', centerX, centerY - radius - 10)
  ctx.fillText('-1', centerX, centerY + radius + 20)
  
  // Point coordinates
  ctx.fillStyle = '#FF5722'
  ctx.font = 'bold 14px Arial'
  ctx.fillText(`(${trigValues.value.cos}, ${trigValues.value.sin})`, pointX, pointY - 15)
  
  // Angle label
  ctx.fillStyle = '#4CAF50'
  ctx.fillText(`${angleDegrees.value}°`, centerX + 45, centerY - 10)
  
  // sin and cos labels
  ctx.fillStyle = '#FF9800'
  ctx.fillText(`cos = ${trigValues.value.cos}`, (centerX + pointX) / 2, centerY + 20)
  ctx.fillText(`sin = ${trigValues.value.sin}`, pointX + 20, (centerY + pointY) / 2)
}

const drawWaves = () => {
  const canvas = waveCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const centerY = height / 2
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Draw grid
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  
  // Horizontal grid lines
  for (let y = 0; y <= height; y += height / 4) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  
  // Vertical grid lines (every π/2)
  for (let x = 0; x <= width; x += width / 8) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  
  // Draw x-axis
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(width, centerY)
  ctx.stroke()
  
  // Draw sine wave
  ctx.strokeStyle = '#2196F3'
  ctx.lineWidth = 3
  ctx.beginPath()
  
  for (let x = 0; x <= width; x += 2) {
    const angle = (x / width) * 4 * Math.PI // 2 complete cycles
    const y = centerY - (Math.sin(angle) * centerY * 0.8)
    
    if (x === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()
  
  // Draw cosine wave
  ctx.strokeStyle = '#F44336'
  ctx.lineWidth = 3
  ctx.beginPath()
  
  for (let x = 0; x <= width; x += 2) {
    const angle = (x / width) * 4 * Math.PI // 2 complete cycles
    const y = centerY - (Math.cos(angle) * centerY * 0.8)
    
    if (x === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()
  
  // Draw current angle indicator
  const currentAngleX = (angleRadians.value / (4 * Math.PI)) * width
  
  if (currentAngleX <= width) {
    // Current sin value
    const currentSinY = centerY - (trigValues.value.sin * centerY * 0.8)
    ctx.fillStyle = '#2196F3'
    ctx.beginPath()
    ctx.arc(currentAngleX, currentSinY, 6, 0, 2 * Math.PI)
    ctx.fill()
    
    // Current cos value
    const currentCosY = centerY - (trigValues.value.cos * centerY * 0.8)
    ctx.fillStyle = '#F44336'
    ctx.beginPath()
    ctx.arc(currentAngleX, currentCosY, 6, 0, 2 * Math.PI)
    ctx.fill()
    
    // Vertical line at current angle
    ctx.strokeStyle = '#666666'
    ctx.lineWidth = 2
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(currentAngleX, 0)
    ctx.lineTo(currentAngleX, height)
    ctx.stroke()
    ctx.setLineDash([])
  }
  
  // Labels
  ctx.fillStyle = '#000000'
  ctx.font = '12px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('sin(x)', 10, 20)
  ctx.fillStyle = '#2196F3'
  ctx.fillRect(50, 12, 20, 3)
  
  ctx.fillStyle = '#000000'
  ctx.fillText('cos(x)', 80, 20)
  ctx.fillStyle = '#F44336'
  ctx.fillRect(120, 12, 20, 3)
}

watch([angleDegrees, animationSpeed], () => {
  updateAngle()
})

onMounted(() => {
  updateAngle()
})

onUnmounted(() => {
  stopAnimation()
})
</script>

<style>
@import '../styles/components.css';
</style>