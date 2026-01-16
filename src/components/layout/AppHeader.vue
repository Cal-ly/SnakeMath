<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { topics } from '@/data/navigation'

interface Props {
  isMobileMenuOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isMobileMenuOpen: false,
})

const route = useRoute()

const emit = defineEmits<{
  toggleMobileMenu: []
}>()

function isActiveRoute(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <header class="bg-header-bg text-header-text sticky top-0 z-40 shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-14 md:h-16">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="flex items-center gap-2 text-xl font-bold hover:opacity-90 transition-opacity"
        >
          <span class="text-2xl" aria-hidden="true">🐍</span>
          <span>SnakeMath</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1" aria-label="Main navigation">
          <RouterLink
            v-for="topic in topics"
            :key="topic.id"
            :to="topic.path"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[
              isActiveRoute(topic.path)
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-white/10 hover:text-white',
            ]"
          >
            <i :class="topic.faIcon" class="mr-2" aria-hidden="true" />
            {{ topic.title }}
          </RouterLink>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          data-testid="mobile-menu-button"
          class="md:hidden p-2 -mr-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          :aria-expanded="props.isMobileMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="props.isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          @click="emit('toggleMobileMenu')"
        >
          <i
            :class="props.isMobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"
            class="text-xl w-6 text-center"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </header>
</template>
