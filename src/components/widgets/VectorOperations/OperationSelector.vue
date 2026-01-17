<script setup lang="ts">
import type { VectorOperation } from '@/types/math'

interface Props {
  selectedOperation: VectorOperation
}

defineProps<Props>()

const emit = defineEmits<{
  select: [operation: VectorOperation]
}>()

const operations: Array<{ id: VectorOperation; label: string; icon: string; description: string }> = [
  { id: 'add', label: 'Add', icon: '+', description: 'A + B' },
  { id: 'subtract', label: 'Subtract', icon: '−', description: 'A − B' },
  { id: 'dot', label: 'Dot Product', icon: '·', description: 'A · B' },
  { id: 'magnitude', label: 'Magnitude', icon: '|v|', description: '|A|' },
  { id: 'angle', label: 'Angle', icon: '∠', description: 'θ between' },
  { id: 'scalar', label: 'Scalar ×', icon: 'k·', description: 'k × A' },
  { id: 'normalize', label: 'Normalize', icon: 'v̂', description: 'Unit vector' },
]

function handleSelect(op: VectorOperation) {
  emit('select', op)
}
</script>

<template>
  <div class="operation-selector">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      Operation
    </h3>
    <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Select vector operation">
      <button
        v-for="op in operations"
        :key="op.id"
        type="button"
        role="radio"
        :aria-checked="selectedOperation === op.id"
        class="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
        :class="
          selectedOperation === op.id
            ? 'bg-primary text-white border-primary shadow-sm'
            : 'bg-surface border-border hover:border-primary/50 hover:bg-surface-alt'
        "
        :data-testid="`op-${op.id}`"
        :title="op.description"
        @click="handleSelect(op.id)"
      >
        <span class="font-mono mr-1">{{ op.icon }}</span>
        {{ op.label }}
      </button>
    </div>
  </div>
</template>
