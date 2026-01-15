import { ref, type Ref } from 'vue'

export interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>
  copied: Ref<boolean>
  error: Ref<string | null>
}

/**
 * Composable for clipboard operations with feedback state
 */
export function useClipboard(resetDelay = 2000): UseClipboardReturn {
  const copied = ref(false)
  const error = ref<string | null>(null)

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      error.value = null

      // Reset copied state after delay
      setTimeout(() => {
        copied.value = false
      }, resetDelay)

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to copy'
      copied.value = false
      return false
    }
  }

  return {
    copy,
    copied,
    error,
  }
}
