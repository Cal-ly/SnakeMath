import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBreadcrumbs } from '@/data/navigation'

/**
 * Composable to get breadcrumbs for current route
 */
export function useBreadcrumbs() {
  const route = useRoute()

  const breadcrumbs = computed(() => getBreadcrumbs(route.path))

  return {
    breadcrumbs,
  }
}
