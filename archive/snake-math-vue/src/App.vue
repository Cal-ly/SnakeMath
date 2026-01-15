<template>
  <div id="app" class="app-container">
    <header class="app-header bg-light border-bottom">
      <div class="header-content container-fluid">
        <div class="header-left">
          <div class="header-title">
            <h3 class="text-primary mb-0">🐍 Snake Math</h3>
            <small class="text-muted d-none d-md-block">Interactive Mathematics Learning Platform</small>
          </div>
        </div>
        
        <div class="header-center">
          <TopicNavigation 
            :topics="mathTopics"
            :active-topic="activeTopic"
            @topic-change="handleTopicChange"
          />
        </div>
        
        <div class="header-right">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
    
    <div class="app-content">
      <main class="main-content container-fluid py-4" style="max-width: 1400px; margin: 0 auto;">
        <component 
          :is="currentTopicComponent" 
          :key="activeTopic"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TopicNavigation from '@/components/common/TopicNavigation.vue'
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'
import BasicsContent from '@/components/topics/BasicsContent.vue'
import AlgebraContent from '@/components/topics/AlgebraContent.vue'
import StatisticsContent from '@/components/topics/StatisticsContent.vue'
import TrigonometryContent from '@/components/topics/TrigonometryContent.vue'
import LinearAlgebraContent from '@/components/topics/LinearAlgebraContent.vue'
import CalculusContent from '@/components/topics/CalculusContent.vue'

const activeTopic = ref('basics')

const mathTopics = [
  { id: 'basics', title: 'Basics', icon: 'fas fa-book' },
  { id: 'algebra', title: 'Algebra', icon: 'fas fa-calculator' },
  { id: 'statistics', title: 'Statistics', icon: 'fas fa-chart-bar' },
  { id: 'trigonometry', title: 'Trigonometry', icon: 'fas fa-drafting-compass' },
  { id: 'linear-algebra', title: 'Linear Algebra', icon: 'fas fa-vector-square' },
  { id: 'calculus', title: 'Calculus', icon: 'fas fa-infinity' }
]

const topicComponents = {
  basics: BasicsContent,
  algebra: AlgebraContent,
  statistics: StatisticsContent,
  trigonometry: TrigonometryContent,
  'linear-algebra': LinearAlgebraContent,
  calculus: CalculusContent
}

const currentTopicComponent = computed(() => {
  return topicComponents[activeTopic.value] || BasicsContent
})

const handleTopicChange = (topicId) => {
  activeTopic.value = topicId
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: "left center right";
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1.5rem;
  min-height: 80px;
}

.header-left {
  grid-area: left;
  justify-self: start;
}

.header-center {
  grid-area: center;
  justify-self: center;
}

.header-right {
  grid-area: right;
  justify-self: end;
}

/* Bootstrap handles the styling through utility classes */

.app-content {
  flex: 1;
  width: 100%;
}

.main-content {
  /* Bootstrap handles padding through py-4 class */
  min-height: calc(100vh - 120px);
}

/* Tablet responsive */
@media (max-width: 1023px) and (min-width: 768px) {
  .main-content {
    min-height: calc(100vh - 120px);
  }
}

/* Mobile responsive */
@media (max-width: 767px) {
  .header-content {
    grid-template-columns: 1fr auto;
    grid-template-areas: 
      "left right"
      "center center";
    gap: 0.75rem;
    padding: 0.75rem;
    min-height: auto;
  }
  
  .header-left {
    text-align: left;
  }
  
  .header-center {
    justify-self: stretch;
    margin-top: 0.5rem;
  }
  
  .main-content {
    min-height: calc(100vh - 140px);
  }
}

/* Extra small mobile */
@media (max-width: 475px) {
  .header-content {
    padding: 0.5rem;
  }
  
  .main-content {
    min-height: calc(100vh - 140px);
  }
}

/* Large desktop optimization */
@media (min-width: 1536px) {
  .header-content {
    padding: 1.5rem 2rem;
  }
  
  .main-content {
    min-height: calc(100vh - 120px);
  }
}
</style>