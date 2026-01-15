import { ref, shallowRef } from 'vue'
import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki'

// Singleton highlighter instance
let highlighterInstance: Highlighter | null = null
let highlighterPromise: Promise<Highlighter> | null = null

const isLoading = ref(false)
const loadError = ref<string | null>(null)

// Languages we support
const supportedLanguages: BundledLanguage[] = [
  'python',
  'javascript',
  'typescript',
  'json',
  'bash',
  'sql',
  'html',
  'css',
  'markdown',
]

/**
 * Get or create the Shiki highlighter instance (singleton)
 */
async function getHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) {
    return highlighterInstance
  }

  if (highlighterPromise) {
    return highlighterPromise
  }

  isLoading.value = true
  loadError.value = null

  highlighterPromise = createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: supportedLanguages,
  })
    .then((h) => {
      highlighterInstance = h
      isLoading.value = false
      return h
    })
    .catch((e) => {
      loadError.value = e instanceof Error ? e.message : 'Failed to load highlighter'
      isLoading.value = false
      highlighterPromise = null
      throw e
    })

  return highlighterPromise
}

/**
 * Composable for syntax highlighting with Shiki
 */
export function useHighlighter() {
  const highlighter = shallowRef<Highlighter | null>(null)

  async function highlight(
    code: string,
    language: BundledLanguage = 'python',
    theme: 'light' | 'dark' = 'light'
  ): Promise<string> {
    try {
      const h = await getHighlighter()
      highlighter.value = h

      return h.codeToHtml(code, {
        lang: language,
        theme: theme === 'dark' ? 'github-dark' : 'github-light',
      })
    } catch {
      // Fallback to plain code block
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return `<pre><code>${escaped}</code></pre>`
    }
  }

  return {
    highlight,
    highlighter,
    isLoading,
    loadError,
    supportedLanguages,
  }
}

export type { BundledLanguage }
