<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from '@/composables'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

// Initialize theme
useTheme()

const isMobileMenuOpen = ref(false)

function openMobileMenu() {
  isMobileMenuOpen.value = true
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface transition-colors">
    <!-- Skip link for accessibility -->
    <a href="#main-content" class="skip-link"> Skip to main content </a>

    <AppHeader
      :is-mobile-menu-open="isMobileMenuOpen"
      @toggle-mobile-menu="isMobileMenuOpen ? closeMobileMenu() : openMobileMenu()"
    />

    <MobileMenu :is-open="isMobileMenuOpen" @close="closeMobileMenu" />

    <main id="main-content" class="flex-1 container mx-auto px-4 py-6">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
