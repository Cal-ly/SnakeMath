<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'

interface Props {
  /** LaTeX formula string */
  formula: string
  /** Display mode (centered, larger) vs inline */
  display?: boolean
  /** Additional CSS classes */
  class?: string
  /** Custom error message if rendering fails */
  errorText?: string
}

const props = withDefaults(defineProps<Props>(), {
  display: false,
  class: '',
  errorText: undefined,
})

interface RenderResult {
  html: string | null
  error: string | null
}

const renderResult = computed<RenderResult>(() => {
  try {
    const html = katex.renderToString(props.formula, {
      displayMode: props.display,
      throwOnError: true,
      strict: false,
      trust: false,
      // Enable some useful macros
      macros: {
        '\\R': '\\mathbb{R}',
        '\\N': '\\mathbb{N}',
        '\\Z': '\\mathbb{Z}',
        '\\Q': '\\mathbb{Q}',
        '\\C': '\\mathbb{C}',
      },
    })
    return { html, error: null }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    return { html: null, error: errorMessage }
  }
})

// Generate accessible description from formula
const ariaLabel = computed(() => {
  // Simple conversion for screen readers
  // Could be enhanced with a proper LaTeX-to-speech library
  return `Mathematical formula: ${props.formula}`
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- KaTeX output is safe, generated from LaTeX math -->
  <span
    v-if="renderResult.html && !renderResult.error"
    :class="[
      'math-block',
      display ? 'math-display' : 'math-inline',
      props.class,
    ]"
    role="img"
    :aria-label="ariaLabel"
    v-html="renderResult.html"
  />

  <span
    v-else
    :class="[
      'math-error',
      display ? 'block text-center my-4' : 'inline',
      props.class,
    ]"
    role="img"
    :aria-label="`Math formula error: ${renderResult.error}`"
  >
    <span class="text-red-500 dark:text-red-400">
      <i class="fa-solid fa-exclamation-triangle mr-1" aria-hidden="true" />
      <template v-if="errorText">{{ errorText }}</template>
      <template v-else>
        <code class="text-sm bg-red-50 dark:bg-red-900/20 px-1 rounded">{{ formula }}</code>
      </template>
    </span>
  </span>
</template>

<style scoped>
.math-display {
  display: block;
  text-align: center;
  margin: 1rem 0;
  overflow-x: auto;
}

.math-inline {
  display: inline;
}

/* Ensure KaTeX doesn't break layout */
.math-block :deep(.katex-display) {
  margin: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5rem 0;
}

/* Scrollbar styling for overflow */
.math-block :deep(.katex-display)::-webkit-scrollbar {
  height: 4px;
}

.math-block :deep(.katex-display)::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 2px;
}
</style>
