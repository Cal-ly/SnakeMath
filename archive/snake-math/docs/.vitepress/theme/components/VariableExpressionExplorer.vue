<!--
Component conceptualization:
Create an interactive variable and expression explorer where users can:
- Define variables with different values and see how expressions change
- Build expressions step-by-step and visualize the evaluation process
- Compare mathematical notation with equivalent programming code
- Experiment with different variable types (integers, floats, strings)
- Create functions from expressions and test them with various inputs
- Visualize how expressions create graphs when plotted over ranges
- Build compound expressions and see how they decompose into simpler parts
The component should provide real-time feedback and help users understand the relationship between mathematical variables and programming variables.
-->
<template>
  <div class="interactive-component">
    <InteractiveSlider 
      label="Adjust x value" 
      :min="0" 
      :max="10" 
      :initial-value="5"
      :show-calculation="true"
      :calculation-function="calculateLinearVariable"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const calculateLinearVariable = (x_val) => {
  const x = parseInt(x_val)
  const y = 2 * x + 1
  return `y = 2(${x}) + 1 = ${y}`
}

onMounted(() => {
  // Make the function globally available for the InteractiveSlider component
  window.calculateLinearVariable = calculateLinearVariable
  console.log("Variables JavaScript functions loaded")
})
</script>

<style>
@import '../styles/components.css';
</style>