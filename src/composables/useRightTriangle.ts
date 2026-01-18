import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  solveRightTriangle,
  canSolve,
  getSpecialTriangleInfo,
  triangleArea,
  trianglePerimeter,
  type RightTriangle,
  type PartialTriangle,
  type TriangleSolution,
  type SolutionStep,
  type SpecialTriangle,
} from '@/utils/math/rightTriangle'

export interface KnownValue {
  key: keyof RightTriangle
  value: number
  enabled: boolean
}

export interface UseRightTriangleOptions {
  syncUrl?: boolean
}

/**
 * Composable for managing right triangle solver state.
 * Handles user input, solving, and URL synchronization.
 */
export function useRightTriangle(options: UseRightTriangleOptions = {}) {
  const { syncUrl = false } = options

  const route = useRoute()
  const router = useRouter()

  // Input values (strings for form inputs)
  const inputA = ref('')
  const inputB = ref('')
  const inputC = ref('')
  const inputAngleA = ref('')
  const inputAngleB = ref('')

  // Which fields are "known" (user wants to use them)
  const enabledA = ref(false)
  const enabledB = ref(false)
  const enabledC = ref(false)
  const enabledAngleA = ref(false)
  const enabledAngleB = ref(false)

  // URL sync state
  let isUpdatingFromUrl = false
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // Parse input string to number
  function parseInput(value: string): number | null {
    if (!value || value.trim() === '') return null
    const parsed = parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }

  // Build partial triangle from enabled inputs
  const knownValues = computed<PartialTriangle>(() => {
    const known: PartialTriangle = {}

    if (enabledA.value && inputA.value) {
      const val = parseInput(inputA.value)
      if (val !== null) known.a = val
    }

    if (enabledB.value && inputB.value) {
      const val = parseInput(inputB.value)
      if (val !== null) known.b = val
    }

    if (enabledC.value && inputC.value) {
      const val = parseInput(inputC.value)
      if (val !== null) known.c = val
    }

    if (enabledAngleA.value && inputAngleA.value) {
      const val = parseInput(inputAngleA.value)
      if (val !== null) known.A = val
    }

    if (enabledAngleB.value && inputAngleB.value) {
      const val = parseInput(inputAngleB.value)
      if (val !== null) known.B = val
    }

    return known
  })

  // Validation result
  const validation = computed(() => canSolve(knownValues.value))

  // Solution
  const solution = computed<TriangleSolution>(() => {
    if (!validation.value.hasEnoughInfo) {
      return {
        triangle: { a: null, b: null, c: null, A: null, B: null },
        steps: [],
        isValid: false,
        error: validation.value.error,
      }
    }
    return solveRightTriangle(knownValues.value)
  })

  // Solved triangle values (filled in from solution)
  const solvedTriangle = computed<RightTriangle>(() => solution.value.triangle)

  // Solution steps
  const steps = computed<SolutionStep[]>(() => solution.value.steps)

  // Is the solution valid?
  const isValid = computed(() => solution.value.isValid)

  // Error message
  const errorMessage = computed(() => solution.value.error ?? validation.value.error)

  // Count of known values
  const knownCount = computed(() => {
    let count = 0
    if (enabledA.value && parseInput(inputA.value) !== null) count++
    if (enabledB.value && parseInput(inputB.value) !== null) count++
    if (enabledC.value && parseInput(inputC.value) !== null) count++
    if (enabledAngleA.value && parseInput(inputAngleA.value) !== null) count++
    if (enabledAngleB.value && parseInput(inputAngleB.value) !== null) count++
    return count
  })

  // Has at least one side
  const hasSide = computed(() => {
    return (
      (enabledA.value && parseInput(inputA.value) !== null) ||
      (enabledB.value && parseInput(inputB.value) !== null) ||
      (enabledC.value && parseInput(inputC.value) !== null)
    )
  })

  // Special triangle info (if applicable)
  const specialTriangleInfo = computed<SpecialTriangle | null>(() => {
    if (solvedTriangle.value.A != null) {
      return getSpecialTriangleInfo(solvedTriangle.value.A)
    }
    return null
  })

  // Calculated area (if solution is valid)
  const area = computed<number | null>(() => {
    if (isValid.value && solvedTriangle.value.a && solvedTriangle.value.b) {
      return triangleArea(solvedTriangle.value.a, solvedTriangle.value.b)
    }
    return null
  })

  // Calculated perimeter (if solution is valid)
  const perimeter = computed<number | null>(() => {
    if (
      isValid.value &&
      solvedTriangle.value.a &&
      solvedTriangle.value.b &&
      solvedTriangle.value.c
    ) {
      return trianglePerimeter(
        solvedTriangle.value.a,
        solvedTriangle.value.b,
        solvedTriangle.value.c
      )
    }
    return null
  })

  // Set input value for a side/angle
  function setInput(key: keyof RightTriangle, value: string) {
    switch (key) {
      case 'a':
        inputA.value = value
        break
      case 'b':
        inputB.value = value
        break
      case 'c':
        inputC.value = value
        break
      case 'A':
        inputAngleA.value = value
        break
      case 'B':
        inputAngleB.value = value
        break
    }
  }

  // Toggle whether a value is enabled
  function toggleEnabled(key: keyof RightTriangle) {
    switch (key) {
      case 'a':
        enabledA.value = !enabledA.value
        break
      case 'b':
        enabledB.value = !enabledB.value
        break
      case 'c':
        enabledC.value = !enabledC.value
        break
      case 'A':
        enabledAngleA.value = !enabledAngleA.value
        break
      case 'B':
        enabledAngleB.value = !enabledAngleB.value
        break
    }
  }

  // Set enabled state directly
  function setEnabled(key: keyof RightTriangle, enabled: boolean) {
    switch (key) {
      case 'a':
        enabledA.value = enabled
        break
      case 'b':
        enabledB.value = enabled
        break
      case 'c':
        enabledC.value = enabled
        break
      case 'A':
        enabledAngleA.value = enabled
        break
      case 'B':
        enabledAngleB.value = enabled
        break
    }
  }

  // Reset all inputs
  function reset() {
    inputA.value = ''
    inputB.value = ''
    inputC.value = ''
    inputAngleA.value = ''
    inputAngleB.value = ''
    enabledA.value = false
    enabledB.value = false
    enabledC.value = false
    enabledAngleA.value = false
    enabledAngleB.value = false
  }

  // Set a preset triangle
  function setPreset(values: PartialTriangle) {
    reset()

    if (values.a != null) {
      inputA.value = values.a.toString()
      enabledA.value = true
    }
    if (values.b != null) {
      inputB.value = values.b.toString()
      enabledB.value = true
    }
    if (values.c != null) {
      inputC.value = values.c.toString()
      enabledC.value = true
    }
    if (values.A != null) {
      inputAngleA.value = values.A.toString()
      enabledAngleA.value = true
    }
    if (values.B != null) {
      inputAngleB.value = values.B.toString()
      enabledAngleB.value = true
    }
  }

  // URL sync functions
  function initFromUrl() {
    if (!syncUrl) return

    isUpdatingFromUrl = true

    try {
      const urlA = route.query.a as string
      const urlB = route.query.b as string
      const urlC = route.query.c as string
      const urlAngleA = route.query.A as string
      const urlAngleB = route.query.B as string

      if (urlA) {
        inputA.value = urlA
        enabledA.value = true
      }
      if (urlB) {
        inputB.value = urlB
        enabledB.value = true
      }
      if (urlC) {
        inputC.value = urlC
        enabledC.value = true
      }
      if (urlAngleA) {
        inputAngleA.value = urlAngleA
        enabledAngleA.value = true
      }
      if (urlAngleB) {
        inputAngleB.value = urlAngleB
        enabledAngleB.value = true
      }
    } finally {
      setTimeout(() => {
        isUpdatingFromUrl = false
      }, 0)
    }
  }

  function updateUrl() {
    if (!syncUrl || isUpdatingFromUrl) return

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      const query: Record<string, string> = {}

      if (enabledA.value && inputA.value) query.a = inputA.value
      if (enabledB.value && inputB.value) query.b = inputB.value
      if (enabledC.value && inputC.value) query.c = inputC.value
      if (enabledAngleA.value && inputAngleA.value) query.A = inputAngleA.value
      if (enabledAngleB.value && inputAngleB.value) query.B = inputAngleB.value

      // Preserve other query params
      const existingQuery = { ...route.query }
      delete existingQuery.a
      delete existingQuery.b
      delete existingQuery.c
      delete existingQuery.A
      delete existingQuery.B

      const newQuery = { ...existingQuery, ...query }

      if (JSON.stringify(newQuery) !== JSON.stringify(route.query)) {
        router.replace({ query: newQuery })
      }
    }, 300)
  }

  // Watch for changes and update URL
  if (syncUrl) {
    watch(
      [inputA, inputB, inputC, inputAngleA, inputAngleB, enabledA, enabledB, enabledC, enabledAngleA, enabledAngleB],
      () => {
        updateUrl()
      }
    )

    // Handle browser back/forward
    watch(
      () => route.query,
      () => {
        if (!isUpdatingFromUrl) {
          initFromUrl()
        }
      }
    )
  }

  // Initialize from URL on mount
  onMounted(() => {
    initFromUrl()
  })

  return {
    // Input values
    inputA,
    inputB,
    inputC,
    inputAngleA,
    inputAngleB,

    // Enabled states
    enabledA,
    enabledB,
    enabledC,
    enabledAngleA,
    enabledAngleB,

    // Computed
    knownValues,
    validation,
    solution,
    solvedTriangle,
    steps,
    isValid,
    errorMessage,
    knownCount,
    hasSide,
    specialTriangleInfo,
    area,
    perimeter,

    // Methods
    setInput,
    toggleEnabled,
    setEnabled,
    reset,
    setPreset,
  }
}
