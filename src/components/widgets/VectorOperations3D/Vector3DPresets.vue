<script setup lang="ts">
import type { Vector3DPreset } from '@/types/math'

interface Props {
  presets: Vector3DPreset[]
}

defineProps<Props>()

const emit = defineEmits<{
  select: [presetId: string]
  swap: []
}>()

function handlePresetChange(event: Event) {
  const target = event.target as HTMLSelectElement
  if (target.value) {
    emit('select', target.value)
    target.value = '' // Reset select after selection
  }
}

function handleSwap() {
  emit('swap')
}
</script>

<template>
  <div class="vector-3d-presets flex flex-wrap gap-3">
    <select
      class="px-3 py-2 border border-border rounded-lg bg-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
      data-testid="preset-3d-select"
      aria-label="Load 3D vector preset"
      @change="handlePresetChange"
    >
      <option value="">Load preset...</option>
      <option v-for="preset in presets" :key="preset.id" :value="preset.id">
        {{ preset.name }} &mdash; {{ preset.description }}
      </option>
    </select>

    <button
      type="button"
      class="px-3 py-2 border border-border rounded-lg bg-surface text-sm hover:bg-surface-alt transition-colors"
      data-testid="swap-vectors-3d-btn"
      title="Swap vectors A and B"
      @click="handleSwap"
    >
      &#8644; Swap A &harr; B
    </button>
  </div>
</template>
