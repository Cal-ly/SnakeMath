# SnakeMath - Increment 2F: AppFooter Component

## Context
Creating a simple footer with links, attribution, and GitHub repository link.

## Task
Create the AppFooter component.

## Requirements

### 1. Create AppFooter Component
Create `src/components/layout/AppFooter.vue`:

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { topics } from '@/data/navigation'

const currentYear = new Date().getFullYear()

const footerLinks = [
  {
    title: 'Topics',
    links: topics.map(t => ({ label: t.title, path: t.path })),
  },
  {
    title: 'Resources',
    links: [
      { label: 'GitHub', href: 'https://github.com/YOUR_USERNAME/SnakeMath', external: true },
      { label: 'Report Issue', href: 'https://github.com/YOUR_USERNAME/SnakeMath/issues', external: true },
    ],
  },
]
</script>

<template>
  <footer class="bg-surface-alt border-t border-border mt-auto">
    <div class="container mx-auto px-4 py-8">
      <!-- Footer Content Grid -->
      <div class="grid gap-8 md:grid-cols-3">
        <!-- Brand Column -->
        <div>
          <RouterLink to="/" class="flex items-center gap-2 text-lg font-bold text-text-primary">
            <span class="text-xl" aria-hidden="true">🐍</span>
            <span>SnakeMath</span>
          </RouterLink>
          <p class="mt-2 text-sm text-text-muted">
            Mathematics for programmers.<br>
            Interactive, intuitive, and connected to code.
          </p>
        </div>

        <!-- Link Columns -->
        <div 
          v-for="section in footerLinks" 
          :key="section.title"
          class="space-y-3"
        >
          <h3 class="font-semibold text-text-primary text-sm uppercase tracking-wide">
            {{ section.title }}
          </h3>
          <ul class="space-y-2">
            <li v-for="link in section.links" :key="link.label">
              <!-- External Link -->
              <a
                v-if="link.external"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-text-muted hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                {{ link.label }}
                <i class="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true" />
                <span class="sr-only">(opens in new tab)</span>
              </a>
              <!-- Internal Link -->
              <RouterLink
                v-else
                :to="link.path"
                class="text-sm text-text-muted hover:text-primary transition-colors"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-text-muted">
          © {{ currentYear }} SnakeMath. Open source under MIT license.
        </p>
        
        <div class="flex items-center gap-4">
          <!-- GitHub Link -->
          <a
            href="https://github.com/YOUR_USERNAME/SnakeMath"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-muted hover:text-primary transition-colors"
            aria-label="View source on GitHub"
          >
            <i class="fa-brands fa-github text-xl" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username before deployment.

### 2. Update App.vue to Include Footer
Update `src/App.vue`:

```vue
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
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>

    <AppHeader 
      :is-mobile-menu-open="isMobileMenuOpen"
      @toggle-mobile-menu="isMobileMenuOpen ? closeMobileMenu() : openMobileMenu()" 
    />
    
    <MobileMenu 
      :is-open="isMobileMenuOpen" 
      @close="closeMobileMenu" 
    />
    
    <main id="main-content" class="flex-1 container mx-auto px-4 py-6">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
```

### 3. Add Screen Reader Utility Class
Add to `src/assets/styles/main.css` if not already present:

```css
@layer utilities {
  /* Screen reader only - visually hidden but accessible */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
```

## Success Criteria
- [ ] Footer appears at bottom of all pages
- [ ] Footer stays at bottom even on short pages (flex-1 on main)
- [ ] Topic links navigate correctly
- [ ] External links open in new tab
- [ ] External links have visual indicator and screen reader text
- [ ] GitHub icon links to repository
- [ ] Copyright year updates automatically
- [ ] Footer is responsive (stacks on mobile)
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Before Deployment
Remember to replace `YOUR_USERNAME` with your actual GitHub username in:
- GitHub repository URL
- Issues URL

## Next Increment
After completion, proceed to `inc_2g.md` for shell integration and accessibility checklist.
