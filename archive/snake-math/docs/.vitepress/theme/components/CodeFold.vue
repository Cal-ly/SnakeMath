<template>
  <div class="code-fold">
    <button @click="folded = !folded" class="fold-btn">
      <span class="icon">{{ folded ? '▶' : '▼' }}</span>
      {{ folded ? 'Show Code' : 'Hide Code' }}
    </button>
    <div v-show="!folded" class="code-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const folded = ref(true)
</script>

<style scoped>
.code-fold {
  margin: 1.5em 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.fold-btn {
  width: 100%;
  padding: 12px 16px;
  background: #f8fafc;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.fold-btn:hover {
  background: #f1f5f9;
}

.fold-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

.icon {
  font-size: 12px;
  transition: transform 0.2s;
}

.code-content {
  padding: 0;
}

.code-content :deep(pre) {
  margin: 0 !important;
  border-radius: 0 !important;
  border: none !important;
}

.code-content :deep(.language-python) {
  margin: 0 !important;
  border-radius: 0 !important;
}

/* Dark theme support */
html.dark .fold-btn {
  background: #1f2937;
  color: #e5e7eb;
  border-bottom-color: #374151;
}

html.dark .fold-btn:hover {
  background: #374151;
}

html.dark .code-fold {
  border-color: #374151;
}
</style>
