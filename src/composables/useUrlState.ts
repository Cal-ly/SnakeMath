import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface UseUrlStateOptions {
  /** Debounce delay for URL updates (ms) */
  debounce?: number
  /** Replace history entry instead of push */
  replace?: boolean
}

/**
 * Sync a reactive value with a URL query parameter
 *
 * @param key - Query parameter name
 * @param defaultValue - Default value if param not in URL
 * @param options - Configuration options
 */
export function useUrlState(
  key: string,
  defaultValue: string = '',
  options: UseUrlStateOptions = {}
) {
  const { debounce = 300, replace = true } = options

  const route = useRoute()
  const router = useRouter()

  // Internal state
  const value = ref(defaultValue)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let isUpdatingFromUrl = false

  /**
   * Read initial value from URL on mount
   */
  function initFromUrl() {
    const urlValue = route.query[key]
    if (typeof urlValue === 'string' && urlValue) {
      value.value = decodeURIComponent(urlValue)
    }
  }

  /**
   * Update URL when value changes
   */
  function updateUrl(newValue: string) {
    if (isUpdatingFromUrl) return

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      const query = { ...route.query }

      if (newValue && newValue !== defaultValue) {
        query[key] = encodeURIComponent(newValue)
      } else {
        delete query[key]
      }

      // Only update if query actually changed
      const currentValue = route.query[key]
      const newEncodedValue = newValue ? encodeURIComponent(newValue) : undefined

      if (currentValue !== newEncodedValue) {
        if (replace) {
          router.replace({ query })
        } else {
          router.push({ query })
        }
      }
    }, debounce)
  }

  /**
   * Update value when URL changes (e.g., browser back/forward)
   */
  function handleRouteChange() {
    const urlValue = route.query[key]
    const decodedValue = typeof urlValue === 'string' ? decodeURIComponent(urlValue) : defaultValue

    if (decodedValue !== value.value) {
      isUpdatingFromUrl = true
      value.value = decodedValue
      // Reset flag after Vue's reactivity cycle
      setTimeout(() => {
        isUpdatingFromUrl = false
      }, 0)
    }
  }

  // Watch for value changes → update URL
  watch(value, (newValue) => {
    updateUrl(newValue)
  })

  // Watch for route changes → update value
  watch(() => route.query[key], handleRouteChange)

  // Initialize from URL on mount
  onMounted(() => {
    initFromUrl()
  })

  /**
   * Set value programmatically (also updates URL)
   */
  function setValue(newValue: string) {
    value.value = newValue
  }

  /**
   * Clear value (removes from URL)
   */
  function clearValue() {
    value.value = defaultValue
  }

  return {
    value,
    setValue,
    clearValue,
  }
}

/**
 * Sync multiple values with URL query params
 */
export function useUrlStateMultiple<T extends Record<string, string>>(
  defaults: T,
  options: UseUrlStateOptions = {}
) {
  const states: Record<string, ReturnType<typeof useUrlState>> = {}

  for (const [key, defaultValue] of Object.entries(defaults)) {
    states[key] = useUrlState(key, defaultValue, options)
  }

  return states
}
