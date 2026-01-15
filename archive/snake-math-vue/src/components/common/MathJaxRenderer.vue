<template>
  <div class="math-renderer" :class="{ 'display-mode': displayMode }">
    <vue-mathjax :formula="processedExpression" @rendered="onRendered" @error="onError" />
    <div v-if="error" class="math-error">Math Error: {{ expression }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { VueMathjax } from 'vue-mathjax-next'

const props = defineProps({
  expression: {
    type: String,
    required: true
  },
  displayMode: {
    type: Boolean,
    default: false
  }
})

const error = ref(false)

const processedExpression = computed(() => {
  if (props.displayMode) {
    // Display mode - center and larger
    return `$$${props.expression}$$`
  } else {
    // Inline mode
    return `$${props.expression}$`
  }
})

const onRendered = () => {
  error.value = false
}

const onError = (err) => {
  console.error('MathJax rendering error:', err)
  error.value = true
}
</script>

<style scoped>
.math-renderer {
  margin: 0.5rem 0;
}

.display-mode {
  text-align: center;
  margin: 1rem 0;
}

.math-error {
  color: #ef4444;
  font-style: italic;
}
</style>