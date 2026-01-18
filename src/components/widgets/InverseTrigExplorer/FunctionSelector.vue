<script setup lang="ts">
import type { InverseFunctionId, InverseFunctionInfo } from '@/utils/math/inverseTrig'

interface Props {
  functions: InverseFunctionInfo[]
  selectedFunction: InverseFunctionId
}

defineProps<Props>()

const emit = defineEmits<{
  select: [fn: InverseFunctionId]
}>()
</script>

<template>
  <div class="function-selector" data-testid="function-selector">
    <div class="flex flex-wrap gap-2" role="tablist" aria-label="Inverse function selection">
      <button
        v-for="fn in functions"
        :key="fn.id"
        role="tab"
        :aria-selected="selectedFunction === fn.id"
        :aria-controls="`panel-${fn.id}`"
        class="px-4 py-2 rounded-lg border transition-all text-sm font-medium"
        :class="[
          selectedFunction === fn.id
            ? 'bg-primary text-white border-primary'
            : 'bg-surface-alt border-border hover:border-primary/50',
          fn.id === 'atan2' ? 'ring-2 ring-amber-400/50' : '',
        ]"
        @click="emit('select', fn.id)"
      >
        <span class="font-mono">{{ fn.id === 'atan2' ? 'atan2 ★' : fn.id }}</span>
      </button>
    </div>
  </div>
</template>
