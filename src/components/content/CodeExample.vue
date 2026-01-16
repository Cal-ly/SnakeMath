<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useHighlighter, type BundledLanguage } from '@/composables/useHighlighter'
import { useTheme } from '@/composables/useTheme'
import CopyButton from '@/components/ui/CopyButton.vue'

interface Props {
  /** Unique identifier for cross-referencing */
  id?: string
  /** Code content */
  code: string
  /** Programming language */
  language?: BundledLanguage
  /** Optional title/filename */
  title?: string
  /** Show line numbers */
  lineNumbers?: boolean
  /** Make collapsible */
  collapsible?: boolean
  /** Start collapsed (if collapsible) */
  defaultCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  language: 'python',
  title: undefined,
  lineNumbers: false,
  collapsible: false,
  defaultCollapsed: false,
})

const { highlight, isLoading } = useHighlighter()
const { isDark } = useTheme()

const highlightedCode = ref('')
const isCollapsed = ref(props.defaultCollapsed)
const codeId = `code-${Math.random().toString(36).slice(2, 9)}`

// Language display names
const languageNames: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  bash: 'Bash',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  markdown: 'Markdown',
}

const displayLanguage = computed(() => languageNames[props.language] || props.language)

// Line count for line numbers
const lineCount = computed(() => props.code.split('\n').length)

// Highlight code when props or theme change
async function updateHighlight() {
  highlightedCode.value = await highlight(
    props.code,
    props.language,
    isDark.value ? 'dark' : 'light'
  )
}

watch([() => props.code, () => props.language, isDark], updateHighlight)
onMounted(updateHighlight)

function toggleCollapse() {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<template>
  <div :id="id" class="code-example rounded-lg border border-border overflow-hidden">
    <!-- Header -->
    <div
      class="code-header flex items-center justify-between px-3 py-2 bg-surface-alt border-b border-border"
      :class="{ 'cursor-pointer hover:bg-border/50': collapsible }"
      @click="toggleCollapse"
    >
      <div class="flex items-center gap-2">
        <!-- Collapse toggle -->
        <button
          v-if="collapsible"
          type="button"
          class="text-text-muted hover:text-text-primary transition-colors"
          :aria-expanded="!isCollapsed"
          :aria-controls="codeId"
        >
          <i
            :class="isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-down'"
            class="text-xs w-3"
            aria-hidden="true"
          />
        </button>

        <!-- Title or language badge -->
        <span class="text-sm font-medium text-text-secondary">
          {{ title || displayLanguage }}
        </span>

        <!-- Language badge (if title is shown) -->
        <span
          v-if="title"
          class="text-xs px-1.5 py-0.5 rounded bg-border text-text-secondary"
        >
          {{ displayLanguage }}
        </span>
      </div>

      <!-- Copy button -->
      <CopyButton
        :text="code"
        aria-label="Copy code"
        @click.stop
      />
    </div>

    <!-- Code content -->
    <div
      v-show="!isCollapsed"
      :id="codeId"
      class="code-content relative"
    >
      <!-- Line numbers -->
      <div
        v-if="lineNumbers"
        class="line-numbers absolute left-0 top-0 bottom-0 w-10 bg-surface-alt border-r border-border text-right pr-2 pt-4 select-none"
        aria-hidden="true"
      >
        <div
          v-for="n in lineCount"
          :key="n"
          class="text-xs text-text-muted leading-6"
        >
          {{ n }}
        </div>
      </div>

      <!-- Highlighted code -->
      <div
        :class="['code-wrapper overflow-x-auto', { 'pl-12': lineNumbers }]"
      >
        <div
          v-if="isLoading"
          class="p-4 text-text-muted"
        >
          <i class="fa-solid fa-spinner fa-spin mr-2" aria-hidden="true" />
          Loading...
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -- Shiki output is safe -->
        <div
          v-else
          class="highlighted-code"
          v-html="highlightedCode"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-example {
  @apply text-sm;
}

/* Override Shiki's default styles */
.highlighted-code :deep(pre) {
  @apply m-0 p-4 bg-transparent overflow-x-auto;
}

.highlighted-code :deep(code) {
  @apply font-mono text-sm leading-6;
}

/* Ensure consistent line height for line numbers */
.highlighted-code :deep(pre code .line) {
  @apply leading-6;
}

/* Scrollbar styling */
.code-wrapper::-webkit-scrollbar {
  height: 6px;
}

.code-wrapper::-webkit-scrollbar-thumb {
  @apply bg-border rounded;
}

.code-wrapper::-webkit-scrollbar-track {
  @apply bg-transparent;
}
</style>
