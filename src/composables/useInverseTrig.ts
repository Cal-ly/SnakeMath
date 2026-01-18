import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { InverseFunctionId, InverseResult, Atan2Result } from '@/utils/math/inverseTrig'
import {
  evaluateInverse,
  INVERSE_FUNCTIONS,
  getInverseTrigPreset,
  INVERSE_TRIG_PRESETS,
} from '@/utils/math/inverseTrig'

export interface UseInverseTrigOptions {
  initialFunction?: InverseFunctionId
  initialValue?: number
  initialY?: number
  syncUrl?: boolean
}

export function useInverseTrig(options: UseInverseTrigOptions = {}) {
  const route = useRoute()
  const router = useRouter()

  // ============= State =============

  const selectedFunction = ref<InverseFunctionId>(options.initialFunction ?? 'arcsin')
  const inputValue = ref(options.initialValue ?? 0.5)
  const inputY = ref(options.initialY ?? 1) // For atan2
  const angleUnit = ref<'degrees' | 'radians'>('degrees')

  // ============= Computed =============

  /** Current function info */
  const functionInfo = computed(() => {
    return INVERSE_FUNCTIONS.find(f => f.id === selectedFunction.value)
  })

  /** Whether the current function is atan2 (needs two inputs) */
  const isAtan2 = computed(() => selectedFunction.value === 'atan2')

  /** Calculate the result */
  const result = computed<InverseResult | Atan2Result>(() => {
    if (isAtan2.value) {
      return evaluateInverse('atan2', inputValue.value, inputY.value)
    }
    return evaluateInverse(selectedFunction.value, inputValue.value)
  })

  /** Result value formatted based on angle unit */
  const formattedValue = computed(() => {
    if (!result.value.isValid) return 'undefined'
    if (angleUnit.value === 'degrees') {
      return `${result.value.valueDegrees.toFixed(2)}°`
    }
    return `${result.value.value.toFixed(4)} rad`
  })

  /** Display label for the input (x for atan2, value otherwise) */
  const inputLabel = computed(() => {
    if (isAtan2.value) return 'x'
    return 'value'
  })

  /** Get presets for current function */
  const presetsForFunction = computed(() => {
    return INVERSE_TRIG_PRESETS.filter(p => p.fn === selectedFunction.value)
  })

  // ============= Methods =============

  function selectFunction(fn: InverseFunctionId) {
    selectedFunction.value = fn

    // Set sensible defaults for each function
    if (fn === 'arcsin' || fn === 'arccos') {
      inputValue.value = 0.5
    } else if (fn === 'arctan') {
      inputValue.value = 1
    } else if (fn === 'atan2') {
      inputValue.value = 1 // x
      inputY.value = 1 // y
    }

    updateUrl()
  }

  function setInputValue(value: number) {
    inputValue.value = value
    updateUrl()
  }

  function setInputY(value: number) {
    inputY.value = value
    updateUrl()
  }

  function applyPreset(presetId: string) {
    const preset = getInverseTrigPreset(presetId)
    if (!preset) return

    selectedFunction.value = preset.fn
    inputValue.value = preset.value
    if (preset.y !== undefined) {
      inputY.value = preset.y
    }
    updateUrl()
  }

  function toggleAngleUnit() {
    angleUnit.value = angleUnit.value === 'degrees' ? 'radians' : 'degrees'
    updateUrl()
  }

  // ============= URL State Sync =============

  function updateUrl() {
    if (options.syncUrl === false) return

    const params: Record<string, string> = {
      fn: selectedFunction.value,
      v: inputValue.value.toString(),
      unit: angleUnit.value,
    }

    if (isAtan2.value) {
      params.y = inputY.value.toString()
    }

    router.replace({
      query: params,
    })
  }

  function loadFromUrl() {
    if (options.syncUrl === false) return

    const { fn, v, y, unit } = route.query

    if (fn && ['arcsin', 'arccos', 'arctan', 'atan2'].includes(fn as string)) {
      selectedFunction.value = fn as InverseFunctionId
    }

    if (v) {
      const parsed = parseFloat(v as string)
      if (!isNaN(parsed)) {
        inputValue.value = parsed
      }
    }

    if (y) {
      const parsed = parseFloat(y as string)
      if (!isNaN(parsed)) {
        inputY.value = parsed
      }
    }

    if (unit && ['degrees', 'radians'].includes(unit as string)) {
      angleUnit.value = unit as 'degrees' | 'radians'
    }
  }

  // Load initial URL state
  loadFromUrl()

  // Watch for route changes (back/forward navigation)
  watch(
    () => route.query,
    () => loadFromUrl(),
    { deep: true }
  )

  return {
    // State
    selectedFunction,
    inputValue,
    inputY,
    angleUnit,

    // Computed
    functionInfo,
    isAtan2,
    result,
    formattedValue,
    inputLabel,
    presetsForFunction,

    // Methods
    selectFunction,
    setInputValue,
    setInputY,
    applyPreset,
    toggleAngleUnit,
    updateUrl,

    // Static
    INVERSE_FUNCTIONS,
    INVERSE_TRIG_PRESETS,
  }
}
