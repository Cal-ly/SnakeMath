<script setup lang="ts">
  import { ref } from 'vue'
  import { RouterView } from 'vue-router'

  const isDark = ref(false)

  function toggleTheme() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }
</script>

<template>
  <div class="min-h-screen bg-surface transition-colors">
    <header class="bg-primary text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold">SnakeMath</h1>
        <button
          class="px-3 py-1 rounded bg-primary-hover hover:bg-emerald-800 transition-colors"
          @click="toggleTheme"
        >
          {{ isDark ? 'Light' : 'Dark' }}
        </button>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <div class="card p-6 mt-4">
        <h2 class="section-header">Tailwind CSS is Working!</h2>
        <p class="text-text-secondary mb-4">
          If you can see this styled card with the green header, Tailwind is configured correctly.
        </p>
        <p class="text-text-muted text-sm">Toggle the theme button to verify dark mode works.</p>
      </div>

      <RouterView />
    </main>
  </div>
</template>
