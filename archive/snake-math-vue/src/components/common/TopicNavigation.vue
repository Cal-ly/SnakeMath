<template>
  <nav class="topic-navigation">
    <div class="topic-nav-container">
      <div class="topic-nav-desktop">
        <button 
          v-for="topic in topics" 
          :key="topic.id"
          @click="$emit('topic-change', topic.id)"
          :class="[
            'btn', 
            activeTopic === topic.id ? 'btn-primary' : 'btn-outline-secondary',
            'me-2', 'mb-2', 'd-flex', 'align-items-center'
          ]"
        >
          <i :class="topic.icon" class="me-2"></i>
          <span>{{ topic.title }}</span>
        </button>
      </div>
      
      <div class="topic-nav-mobile">
        <button 
          @click="toggleMobileNav"
          :class="[
            'btn', 
            isMobileNavOpen ? 'btn-primary' : 'btn-outline-secondary',
            'w-100', 'd-flex', 'align-items-center', 'justify-content-between'
          ]"
          aria-label="Toggle navigation menu"
        >
          <span class="d-flex align-items-center">
            <i :class="isMobileNavOpen ? 'fas fa-times' : 'fas fa-bars'" class="me-2"></i>
            <span>{{ currentTopicTitle }}</span>
          </span>
          <i class="fas fa-chevron-down"></i>
        </button>
        
        <div 
          v-if="isMobileNavOpen" 
          class="dropdown-menu show w-100 mt-2"
          @click="closeMobileNav"
        >
          <button 
            v-for="topic in topics" 
            :key="topic.id"
            @click="handleMobileTopicChange(topic.id)"
            :class="[
              'dropdown-item', 
              'd-flex', 'align-items-center',
              { active: activeTopic === topic.id }
            ]"
          >
            <i :class="topic.icon" class="me-2"></i>
            <span>{{ topic.title }}</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  topics: {
    type: Array,
    required: true
  },
  activeTopic: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['topic-change'])

const isMobileNavOpen = ref(false)

const currentTopicTitle = computed(() => {
  const topic = props.topics.find(t => t.id === props.activeTopic)
  return topic ? topic.title : 'Topics'
})

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

const closeMobileNav = () => {
  isMobileNavOpen.value = false
}

const handleMobileTopicChange = (topicId) => {
  emit('topic-change', topicId)
  closeMobileNav()
}
</script>

<style scoped>
.topic-navigation {
  position: relative;
}

.topic-nav-container {
  width: 100%;
}

/* Desktop Navigation */
.topic-nav-desktop {
  display: flex;
  align-items: center;
  gap: var(--spacing-responsive-xs);
  padding: 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.topic-nav-desktop::-webkit-scrollbar {
  display: none;
}

.topic-nav-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-responsive-xs);
  padding: var(--spacing-responsive-xs) var(--spacing-responsive-sm);
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-primary);
  font-size: var(--font-size-responsive-sm);
  white-space: nowrap;
  min-height: var(--touch-target-min);
  flex-shrink: 0;
}

.topic-nav-button:hover {
  background: var(--bg-interactive);
  color: var(--primary-color);
}

.topic-nav-button:focus {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.topic-nav-button.active {
  background: var(--primary-color);
  color: var(--text-inverse);
  font-weight: 500;
}

.topic-icon {
  font-size: var(--font-size-responsive-base);
  min-width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topic-title {
  font-weight: 500;
  line-height: 1.3;
}

/* Mobile Navigation */
.topic-nav-mobile {
  display: none;
  position: relative;
}

.mobile-nav-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-responsive-sm);
  padding: var(--spacing-responsive-sm) var(--spacing-responsive-md);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  font-size: var(--font-size-responsive-base);
  width: 100%;
  min-height: var(--touch-target-comfortable);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.mobile-nav-toggle:hover {
  background: var(--bg-interactive);
}

.mobile-nav-toggle:focus {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.mobile-nav-toggle.active {
  background: var(--bg-interactive);
  color: var(--primary-color);
}

.toggle-icon {
  font-size: var(--font-size-responsive-lg);
  font-weight: bold;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-topic {
  flex: 1;
  text-align: left;
  font-weight: 500;
}

.mobile-nav-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 50vh;
  overflow-y: auto;
  margin-top: var(--spacing-responsive-xs);
}

.mobile-topic-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-responsive-sm);
  padding: var(--spacing-responsive-sm) var(--spacing-responsive-md);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  font-size: var(--font-size-responsive-sm);
  width: 100%;
  text-align: left;
  min-height: var(--touch-target-comfortable);
  transition: all 0.2s ease;
}

.mobile-topic-button:hover {
  background: var(--bg-interactive);
  color: var(--primary-color);
}

.mobile-topic-button:focus {
  outline: 2px solid var(--border-focus);
  outline-offset: -2px;
}

.mobile-topic-button.active {
  background: var(--primary-color);
  color: var(--text-inverse);
  font-weight: 500;
}

/* Tablet responsive */
@media (max-width: 1023px) and (min-width: 768px) {
  .topic-nav-button {
    padding: var(--spacing-responsive-xs);
    gap: var(--spacing-responsive-xs);
  }
  
  .topic-title {
    font-size: var(--font-size-responsive-xs);
  }
  
  .topic-icon {
    font-size: var(--font-size-responsive-sm);
    min-width: 18px;
  }
}

/* Mobile responsive */
@media (max-width: 767px) {
  .topic-nav-desktop {
    display: none;
  }
  
  .topic-nav-mobile {
    display: block;
  }
}

/* Extra small mobile */
@media (max-width: 475px) {
  .mobile-nav-toggle {
    padding: var(--spacing-responsive-xs) var(--spacing-responsive-sm);
  }
  
  .current-topic {
    font-size: var(--font-size-responsive-sm);
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .topic-nav-button {
    padding: var(--spacing-responsive-sm) var(--spacing-responsive-md);
    gap: var(--spacing-responsive-sm);
  }
  
  .topic-title {
    font-size: var(--font-size-responsive-base);
  }
  
  .topic-icon {
    font-size: var(--font-size-responsive-lg);
    min-width: 24px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .topic-nav-button,
  .mobile-topic-button {
    border: 1px solid transparent;
  }
  
  .topic-nav-button:hover,
  .topic-nav-button:focus,
  .mobile-topic-button:hover,
  .mobile-topic-button:focus {
    border-color: currentColor;
  }
  
  .topic-nav-button.active,
  .mobile-topic-button.active {
    border-color: var(--text-inverse);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .topic-nav-button,
  .mobile-nav-toggle,
  .mobile-topic-button {
    transition: none;
  }
}
</style>