<!-- docs/.vitepress/theme/components/InteractiveSlider.vue -->
<template>
  <div class="interactive-component">
    <div class="component-inputs">
      <label>{{ label }}:</label>
      <input 
        type="range" 
        :min="min" 
        :max="max" 
        :step="step"
        v-model="currentValue"
        @input="handleInput"
        class="range-input"
      />
      <span class="result-value">{{ label.split(' ')[0] }} = {{ currentValue }}</span>
    </div>
    
    <div v-if="showCalculation" class="result-highlight" ref="calculationOutput">
      {{ calculationText }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Value' },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 10 },
  step: { type: Number, default: 1 },
  initialValue: { type: Number, default: 5 },
  showCalculation: { type: Boolean, default: false },
  calculationFunction: { type: [String, Function], default: null } // Function name or direct function
})

const emit = defineEmits(['valueChanged'])

const currentValue = ref(props.initialValue)
const calculationOutput = ref(null)
const calculationText = ref('')

const handleInput = () => {
  emit('valueChanged', parseInt(currentValue.value))
  
  // Call calculation function if provided
  if (props.calculationFunction) {
    let result
    
    if (typeof props.calculationFunction === 'function') {
      // Direct function reference
      result = props.calculationFunction(currentValue.value)
    } else if (typeof props.calculationFunction === 'string' && window[props.calculationFunction]) {
      // Function name as string (for global functions)
      result = window[props.calculationFunction](currentValue.value)
    }
    
    if (result !== undefined) {
      calculationText.value = result
    }
  }
}

// Watch for external value changes
watch(() => props.initialValue, (newVal) => {
  currentValue.value = newVal
  handleInput()
})

onMounted(() => {
  // Initial calculation
  setTimeout(() => {
    handleInput()
  }, 100)
})
</script>

<style scoped>
@import '../styles/components.css';

/* Component-specific styles only */
@media (max-width: 768px) {
  .component-inputs {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .range-input {
    width: 100%;
    max-width: none;
  }
}
</style>