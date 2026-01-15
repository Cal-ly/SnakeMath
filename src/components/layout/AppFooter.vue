<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { topics } from '@/data/navigation'

const currentYear = new Date().getFullYear()

interface FooterLink {
  label: string
  path?: string
  href?: string
  external?: boolean
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    title: 'Topics',
    links: topics.map((t) => ({ label: t.title, path: t.path })),
  },
  {
    title: 'Resources',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Cal-ly/SnakeMath',
        external: true,
      },
      {
        label: 'Report Issue',
        href: 'https://github.com/Cal-ly/SnakeMath/issues',
        external: true,
      },
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
            Mathematics for programmers.<br />
            Interactive, intuitive, and connected to code.
          </p>
        </div>

        <!-- Link Columns -->
        <div v-for="section in footerLinks" :key="section.title" class="space-y-3">
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
                :to="link.path ?? '/'"
                class="text-sm text-text-muted hover:text-primary transition-colors"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p class="text-sm text-text-muted">
          © {{ currentYear }} SnakeMath. Open source under MIT license.
        </p>

        <div class="flex items-center gap-4">
          <!-- GitHub Link -->
          <a
            href="https://github.com/Cal-ly/SnakeMath"
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
