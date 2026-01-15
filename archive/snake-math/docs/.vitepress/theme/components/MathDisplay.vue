<!-- docs/.vitepress/theme/components/MathDisplay.vue -->
<template>
  <div class="result-highlight">
    <!-- Summation notation display -->
    <div v-if="isSummation" class="math-notation">
      <span class="sigma">Σ</span>
      <div class="limits">
        <div class="upper">{{ upperLimit }}</div>
        <div class="lower">i={{ lowerLimit }}</div>
      </div>
      <span class="expression">{{ expression }}</span>
      <span class="equals">=</span>
      <span class="expansion">{{ expansionText }}</span>
      <span class="equals">=</span>
      <span class="result-value">{{ result }}</span>
    </div>
    
    <!-- General mathematical expression display -->
    <div v-else class="math-expression" v-html="renderedMath"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // For summation notation
  upperLimit: { type: Number, default: 5 },
  lowerLimit: { type: Number, default: 1 },
  expression: { type: String, default: 'i' },
  result: { type: Number, default: 0 },
  
  // For general math expressions
  mathExpression: { type: String, default: '' },
  block: { type: Boolean, default: false }
})

const isSummation = computed(() => {
  return props.upperLimit !== undefined && props.lowerLimit !== undefined && !props.mathExpression
})

const expansionText = computed(() => {
  if (!isSummation.value) return ''
  
  const terms = []
  const limit = Math.min(props.upperLimit, 6)
  
  for (let i = props.lowerLimit; i <= limit; i++) {
    if (props.expression === 'i') {
      terms.push(i.toString())
    } else if (props.expression === 'i²') {
      terms.push(`${i}²`)
    } else {
      terms.push(`f(${i})`)
    }
  }
  
  if (props.upperLimit > 6) {
    terms.push('...')
    if (props.expression === 'i') {
      terms.push(props.upperLimit.toString())
    } else if (props.expression === 'i²') {
      terms.push(`${props.upperLimit}²`)
    } else {
      terms.push(`f(${props.upperLimit})`)
    }
  }
  
  return terms.join(' + ')
})

const renderedMath = computed(() => {
  if (isSummation.value || !props.mathExpression) return ''
  
  // Simple math rendering without KaTeX dependency
  // This is a basic implementation - you could enhance with a proper math renderer
  return props.mathExpression
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="fraction"><span class="numerator">$1</span><span class="denominator">$2</span></span>')
    .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '<span class="summation">Σ<sub>$1</sub><sup>$2</sup></span>')
    .replace(/\\ldots/g, '...')
    .replace(/\\\\/g, '<br>')
})
</script>

<style scoped>
@import '../styles/components.css';
</style>