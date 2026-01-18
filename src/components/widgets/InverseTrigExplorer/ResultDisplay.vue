<script setup lang="ts">
import MathBlock from '@/components/content/MathBlock.vue'
import type { InverseResult, Atan2Result, InverseFunctionId } from '@/utils/math/inverseTrig'

interface Props {
  fn: InverseFunctionId
  result: InverseResult | Atan2Result
  value: number
  y?: number
  angleUnit: 'degrees' | 'radians'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggleUnit: []
}>()

// Generate LaTeX for the function call
function getLatexExpression(): string {
  if (props.fn === 'atan2') {
    return `\\text{atan2}(${props.y?.toFixed(2)}, ${props.value.toFixed(2)})`
  }
  return `\\${props.fn}(${props.value.toFixed(4)})`
}

// Get the atan2 result with type checking
function getAtan2Result(): Atan2Result | null {
  if (props.fn === 'atan2' && 'regularAtanWouldGive' in props.result) {
    return props.result as Atan2Result
  }
  return null
}
</script>

<template>
  <div class="result-display" data-testid="result-display">
    <div class="p-4 bg-surface-alt rounded-lg border border-border">
      <!-- Main result -->
      <div class="mb-3">
        <div class="text-sm text-text-muted mb-1">Result</div>
        <div class="flex items-center gap-3">
          <MathBlock :formula="getLatexExpression()" />
          <span class="text-xl font-mono">=</span>
          <span
            v-if="result.isValid"
            class="text-xl font-bold text-primary"
          >
            {{ angleUnit === 'degrees' ? `${result.valueDegrees.toFixed(2)}°` : `${result.value.toFixed(4)} rad` }}
          </span>
          <span v-else class="text-xl font-bold text-red-500">
            undefined
          </span>
        </div>
      </div>

      <!-- Toggle unit button -->
      <button
        class="text-sm text-primary hover:underline mb-3"
        @click="emit('toggleUnit')"
      >
        Show in {{ angleUnit === 'degrees' ? 'radians' : 'degrees' }}
      </button>

      <!-- Additional info -->
      <div v-if="result.isValid" class="space-y-2 text-sm">
        <!-- Exact value if available -->
        <div v-if="result.exactValue" class="flex items-center gap-2">
          <span class="text-text-muted">Exact:</span>
          <MathBlock :formula="result.exactValue" />
        </div>

        <!-- All solutions in [0, 360) -->
        <div v-if="result.allSolutionsInRange.length > 0">
          <span class="text-text-muted">All solutions in [0°, 360°):</span>
          <span class="font-mono ml-2">
            {{ result.allSolutionsInRange.map(s => `${s.toFixed(1)}°`).join(', ') }}
          </span>
        </div>

        <!-- Range info -->
        <div class="text-text-muted">
          Principal range: [{{ result.range.min }}°, {{ result.range.max }}°]
        </div>
      </div>

      <!-- Error message -->
      <div v-if="!result.isValid && result.error" class="text-red-500 text-sm">
        {{ result.error }}
      </div>

      <!-- atan2 comparison -->
      <div
        v-if="getAtan2Result()"
        class="mt-4 p-3 rounded border"
        :class="getAtan2Result()?.regularAtanIsWrong ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'"
      >
        <div class="font-medium text-sm mb-2">
          <i
            class="fa-solid mr-2"
            :class="getAtan2Result()?.regularAtanIsWrong ? 'fa-triangle-exclamation text-amber-600' : 'fa-circle-check text-green-600'"
            aria-hidden="true"
          />
          atan2 vs atan Comparison
        </div>
        <div class="text-sm space-y-1">
          <div>
            <span class="text-text-muted">Regular atan(y/x) gives:</span>
            <span class="font-mono ml-2">{{ getAtan2Result()?.regularAtanWouldGive.toFixed(2) }}°</span>
          </div>
          <div>
            <span class="text-text-muted">Quadrant:</span>
            <span class="font-mono ml-2">{{ getAtan2Result()?.quadrant }}</span>
          </div>
          <div v-if="getAtan2Result()?.regularAtanIsWrong" class="text-amber-700 dark:text-amber-300 font-medium">
            Regular atan would give wrong quadrant!
          </div>
          <div v-else class="text-green-700 dark:text-green-300">
            Both give the same result in this quadrant.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
