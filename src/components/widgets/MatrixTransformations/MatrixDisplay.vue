<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Matrix2x2 } from '@/types/math'
import { isValidMatrix } from '@/utils/math/matrix'

interface Props {
  matrix: Matrix2x2
  allowCustom?: boolean
  isCustomMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowCustom: false,
  isCustomMode: false,
})

const emit = defineEmits<{
  'update:matrix': [matrix: Matrix2x2]
  'toggle-custom': []
}>()

// Local editing state
const editMode = ref(false)
const editA = ref('')
const editB = ref('')
const editC = ref('')
const editD = ref('')

// Initialize edit values when entering edit mode
watch(
  () => editMode.value,
  (isEditing) => {
    if (isEditing) {
      editA.value = props.matrix.a.toString()
      editB.value = props.matrix.b.toString()
      editC.value = props.matrix.c.toString()
      editD.value = props.matrix.d.toString()
    }
  }
)

const parseError = computed(() => {
  if (!editMode.value) return null

  const a = parseFloat(editA.value)
  const b = parseFloat(editB.value)
  const c = parseFloat(editC.value)
  const d = parseFloat(editD.value)

  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
    return 'All values must be valid numbers'
  }

  return null
})

function formatValue(val: number): string {
  // Show cleaner numbers for common values
  if (Math.abs(val) < 0.0001) return '0'
  if (Math.abs(val - 1) < 0.0001) return '1'
  if (Math.abs(val + 1) < 0.0001) return '-1'
  if (Math.abs(val - 0.5) < 0.0001) return '0.5'
  if (Math.abs(val + 0.5) < 0.0001) return '-0.5'

  // Handle sqrt(2)/2 approx 0.707
  if (Math.abs(Math.abs(val) - 0.7071) < 0.001) {
    return val > 0 ? '0.71' : '-0.71'
  }

  return val.toFixed(3).replace(/\.?0+$/, '')
}

function startEdit() {
  if (props.allowCustom) {
    editMode.value = true
  }
}

function cancelEdit() {
  editMode.value = false
}

function applyEdit() {
  if (parseError.value) return

  const newMatrix: Matrix2x2 = {
    a: parseFloat(editA.value),
    b: parseFloat(editB.value),
    c: parseFloat(editC.value),
    d: parseFloat(editD.value),
  }

  if (isValidMatrix(newMatrix)) {
    emit('update:matrix', newMatrix)
    emit('toggle-custom')
    editMode.value = false
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    applyEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <div class="matrix-display">
    <div class="flex justify-between items-center mb-3">
      <h4 class="font-semibold text-text-primary">
        <span class="mr-2 text-primary" aria-hidden="true">▦</span>
        Transformation Matrix
      </h4>
      <button
        v-if="allowCustom && !editMode"
        class="text-xs text-primary hover:text-primary/80 transition-colors"
        data-testid="edit-matrix-btn"
        @click="startEdit"
      >
        <span class="mr-1" aria-hidden="true">✎</span>
        Edit
      </button>
    </div>

    <!-- Read-only display -->
    <div v-if="!editMode" class="matrix-bracket" data-testid="matrix-display">
      <div class="matrix-content">
        <div class="matrix-row">
          <span class="matrix-cell">{{ formatValue(matrix.a) }}</span>
          <span class="matrix-cell">{{ formatValue(matrix.b) }}</span>
        </div>
        <div class="matrix-row">
          <span class="matrix-cell">{{ formatValue(matrix.c) }}</span>
          <span class="matrix-cell">{{ formatValue(matrix.d) }}</span>
        </div>
      </div>
    </div>

    <!-- Edit mode -->
    <div v-else class="space-y-2">
      <div class="matrix-bracket editing">
        <div class="matrix-content">
          <div class="matrix-row">
            <input
              v-model="editA"
              type="text"
              class="matrix-input"
              data-testid="matrix-a-input"
              placeholder="a"
              @keydown="handleKeydown"
            />
            <input
              v-model="editB"
              type="text"
              class="matrix-input"
              data-testid="matrix-b-input"
              placeholder="b"
              @keydown="handleKeydown"
            />
          </div>
          <div class="matrix-row">
            <input
              v-model="editC"
              type="text"
              class="matrix-input"
              data-testid="matrix-c-input"
              placeholder="c"
              @keydown="handleKeydown"
            />
            <input
              v-model="editD"
              type="text"
              class="matrix-input"
              data-testid="matrix-d-input"
              placeholder="d"
              @keydown="handleKeydown"
            />
          </div>
        </div>
      </div>

      <p v-if="parseError" class="text-xs text-red-500">
        {{ parseError }}
      </p>

      <div class="flex gap-2">
        <button
          class="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          :disabled="!!parseError"
          data-testid="apply-matrix-btn"
          @click="applyEdit"
        >
          Apply
        </button>
        <button
          class="px-3 py-1 text-sm bg-surface-alt border border-border rounded hover:bg-surface-alt/80 transition-colors"
          data-testid="cancel-matrix-btn"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Custom mode indicator -->
    <p v-if="isCustomMode && !editMode" class="text-xs text-amber-500 mt-2">
      <span class="mr-1" aria-hidden="true">✦</span>
      Custom matrix
    </p>
  </div>
</template>

<style scoped>
.matrix-bracket {
  @apply relative inline-block font-mono text-lg p-4;
  @apply bg-surface rounded-lg border border-border;
}

.matrix-bracket::before,
.matrix-bracket::after {
  content: '';
  @apply absolute top-2 bottom-2 w-2;
  @apply border-2 border-text-secondary;
}

.matrix-bracket::before {
  @apply left-1;
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.matrix-bracket::after {
  @apply right-1;
  border-left: none;
  border-radius: 0 4px 4px 0;
}

.matrix-content {
  @apply px-4;
}

.matrix-row {
  @apply flex gap-6 justify-center;
}

.matrix-cell {
  @apply w-16 text-center text-text-primary;
}

.matrix-input {
  @apply w-16 text-center px-2 py-1;
  @apply bg-surface-alt border border-border rounded;
  @apply text-text-primary;
  @apply focus:outline-none focus:ring-2 focus:ring-primary;
}

.editing .matrix-content {
  @apply px-2;
}
</style>
