<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { topics } from '@/data/navigation'
import { useTheme } from '@/composables'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { isDark, toggleTheme, resetToSystem } = useTheme()
const router = useRouter()
const menuRef = ref<HTMLElement | null>(null)
const firstFocusableRef = ref<HTMLElement | null>(null)

// Close menu on route change
router.afterEach(() => {
  emit('close')
})

// Handle Escape key
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

// Focus trap - keep focus within menu when open
function handleFocusTrap(event: KeyboardEvent) {
  if (!props.isOpen || event.key !== 'Tab') return

  const focusableElements = menuRef.value?.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )

  if (!focusableElements || focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (!firstElement || !lastElement) return

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

// Lock body scroll when menu is open
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      nextTick(() => {
        firstFocusableRef.value?.focus()
      })
    } else {
      document.body.style.overflow = ''
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('keydown', handleFocusTrap)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('keydown', handleFocusTrap)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 z-40 md:hidden"
        aria-hidden="true"
        @click="emit('close')"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="slide">
      <nav
        v-if="isOpen"
        id="mobile-menu"
        ref="menuRef"
        class="fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] bg-surface z-50 shadow-xl md:hidden"
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-border">
            <span class="font-semibold text-text-primary">Menu</span>
            <button
              ref="firstFocusableRef"
              class="p-2 -mr-2 text-text-muted hover:text-text-primary hover:bg-surface-alt rounded-md transition-colors"
              aria-label="Close menu"
              @click="emit('close')"
            >
              <i class="fa-solid fa-xmark text-xl" aria-hidden="true" />
            </button>
          </div>

          <!-- Navigation Links -->
          <div class="flex-1 overflow-y-auto py-4">
            <div v-for="topic in topics" :key="topic.id" class="mb-4">
              <!-- Topic Header -->
              <RouterLink
                :to="topic.path"
                class="flex items-center gap-3 px-4 py-2 text-text-primary hover:bg-surface-alt transition-colors"
              >
                <i :class="topic.faIcon" class="w-5 text-center text-primary" aria-hidden="true" />
                <span class="font-medium">{{ topic.title }}</span>
              </RouterLink>

              <!-- Subtopics -->
              <div class="ml-4 border-l border-border">
                <RouterLink
                  v-for="subtopic in topic.subtopics"
                  :key="subtopic.id"
                  :to="subtopic.path"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
                >
                  <i
                    :class="subtopic.faIcon || 'fa-solid fa-chevron-right'"
                    class="w-4 text-center text-text-muted"
                    aria-hidden="true"
                  />
                  <span>{{ subtopic.title }}</span>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Footer with Theme Toggle -->
          <div class="border-t border-border p-4 space-y-3">
            <!-- Theme Toggle -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-text-secondary">
                <i class="fa-solid fa-palette mr-2" aria-hidden="true" />
                Theme
              </span>
              <div class="flex items-center gap-2">
                <button
                  class="p-2 rounded-md transition-colors"
                  :class="
                    !isDark
                      ? 'bg-primary text-text-inverse'
                      : 'text-text-muted hover:bg-surface-alt'
                  "
                  aria-label="Light mode"
                  @click="toggleTheme"
                >
                  <i class="fa-solid fa-sun" aria-hidden="true" />
                </button>
                <button
                  class="p-2 rounded-md transition-colors"
                  :class="
                    isDark
                      ? 'bg-primary text-text-inverse'
                      : 'text-text-muted hover:bg-surface-alt'
                  "
                  aria-label="Dark mode"
                  @click="toggleTheme"
                >
                  <i class="fa-solid fa-moon" aria-hidden="true" />
                </button>
              </div>
            </div>

            <!-- Reset to System -->
            <button
              class="w-full text-sm text-text-muted hover:text-text-secondary text-left px-2 py-1"
              @click="resetToSystem"
            >
              <i class="fa-solid fa-rotate-left mr-2" aria-hidden="true" />
              Use system theme
            </button>
          </div>
        </div>
      </nav>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Fade transition for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition for drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .slide-enter-active,
  .slide-leave-active {
    transition: none;
  }
}
</style>
