<template>
  <div class="container-fluid py-4">
    <header class="text-center mb-5">
      <h1 class="display-4 text-primary mb-3">
        <i class="fas fa-calculator me-3"></i>Algebra
      </h1>
      <p class="lead text-muted">
        Master algebraic concepts from basic equations to advanced functions
      </p>
    </header>
    
    <div class="row justify-content-center mb-5">
      <div class="col-12" style="max-width: 1400px; margin: auto;">
        <div class="row g-3">
          <div 
            v-for="subtopic in subtopics" 
            :key="subtopic.id"
            class="col-lg-3 col-md-6 col-sm-6 col-12"
          >
            <div 
              class="card h-100 subtopic-card"
              :class="{ 'border-primary': activeSubtopic === subtopic.id }"
              @click="selectSubtopic(subtopic.id)"
              role="button"
              tabindex="0"
              @keyup.enter="selectSubtopic(subtopic.id)"
            >
              <div class="card-body text-center py-2">
                <div class="mb-1">
                  <i :class="subtopic.icon" class="text-primary" style="font-size: 1rem;"></i>
                </div>
                <h6 class="card-title mb-1" style="font-size: 0.875rem;">{{ subtopic.title }}</h6>
                <p class="card-text text-muted" style="font-size: 0.75rem;">{{ subtopic.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="content-section" style="max-width: 1400px; margin: auto;">
      <component 
        :is="currentSubtopicComponent" 
        v-if="activeSubtopic"
        :key="activeSubtopic"
      />
      <div v-else class="text-center py-5">
        <div class="mb-4">
          <i class="fas fa-hand-point-up text-primary" style="font-size: 3rem;"></i>
        </div>
        <h3 class="h4 mb-3">Select a topic above to begin learning</h3>
        <p class="text-muted">Choose from quadratics, linear equations, exponentials, or summation notation</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QuadraticsContent from './algebra/QuadraticsContent.vue'
import LinearContent from './algebra/LinearContent.vue'
import ExponentialsContent from './algebra/ExponentialsContent.vue'
import SummationContent from './algebra/SummationContent.vue'

const activeSubtopic = ref(null)

const subtopics = [
  {
    id: 'quadratics',
    title: 'Quadratic Functions',
    description: 'Explore parabolas and quadratic equations',
    icon: 'fas fa-chart-line'
  },
  {
    id: 'linear',
    title: 'Linear Equations',
    description: 'Master straight lines and systems',
    icon: 'fas fa-ruler'
  },
  {
    id: 'exponentials',
    title: 'Exponentials & Logs',
    description: 'Growth, decay, and logarithms',
    icon: 'fas fa-chart-area'
  },
  {
    id: 'summation',
    title: 'Summation Notation',
    description: 'Sum sequences with sigma notation',
    icon: 'fas fa-sigma'
  }
]

const subtopicComponents = {
  quadratics: QuadraticsContent,
  linear: LinearContent,
  exponentials: ExponentialsContent,
  summation: SummationContent
}

const currentSubtopicComponent = computed(() => {
  return subtopicComponents[activeSubtopic.value]
})

const selectSubtopic = (subtopicId) => {
  activeSubtopic.value = subtopicId
}
</script>

<style scoped>
/* Bootstrap-based styling with minimal custom overrides */
.subtopic-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.subtopic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.subtopic-card.border-primary {
  border-color: var(--bs-primary) !important;
  background-color: rgba(var(--bs-primary-rgb), 0.05);
}

/* Interactive elements enhancement */
.form-range:focus {
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.btn-check:checked + .btn {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
}

/* Ensure math rendering looks good */
.katex {
  font-size: 1.1em;
}

.katex-display {
  margin: 1rem 0;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .sticky-top {
    position: relative !important;
    top: auto !important;
  }
  
  .display-4 {
    font-size: 2rem;
  }
}
</style>