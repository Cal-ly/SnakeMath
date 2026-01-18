<script setup lang="ts">
import type { Rotation3DType, Rotation3DPreset } from '@/types/math'

interface Props {
  selectedType: Rotation3DType
  presets: Rotation3DPreset[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:type': [type: Rotation3DType]
  selectPreset: [presetId: string]
}>()

const transformationTypes: Array<{ id: Rotation3DType; label: string; icon: string }> = [
  { id: 'identity', label: 'Identity', icon: 'I' },
  { id: 'rotationX', label: 'Rotate X', icon: 'Rx' },
  { id: 'rotationY', label: 'Rotate Y', icon: 'Ry' },
  { id: 'rotationZ', label: 'Rotate Z', icon: 'Rz' },
  { id: 'combined', label: 'Combined', icon: 'R' },
  { id: 'scale', label: 'Scale', icon: 'S' },
]

function handleTypeSelect(type: Rotation3DType) {
  emit('update:type', type)
}

function handlePresetChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value) {
    emit('selectPreset', value)
    ;(event.target as HTMLSelectElement).value = ''
  }
}
</script>

<template>
  <div class="transform-3d-selector">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      Transformation Type
    </h3>

    <div class="flex flex-wrap gap-2 mb-4" role="radiogroup" aria-label="Select 3D transformation type">
      <button
        v-for="type in transformationTypes"
        :key="type.id"
        type="button"
        role="radio"
        :aria-checked="selectedType === type.id"
        class="px-3 py-2 rounded-lg border text-sm font-medium transition-all"
        :class="
          selectedType === type.id
            ? 'bg-primary text-white border-primary shadow-sm'
            : 'bg-surface border-border hover:border-primary/50 hover:bg-surface-alt'
        "
        :data-testid="`transform-3d-${type.id}`"
        @click="handleTypeSelect(type.id)"
      >
        <span class="font-mono mr-1">{{ type.icon }}</span>
        {{ type.label }}
      </button>
    </div>

    <!-- Presets dropdown -->
    <div class="flex gap-2">
      <select
        class="px-3 py-2 border border-border rounded-lg bg-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
        data-testid="preset-3d-transform-select"
        aria-label="Load 3D transformation preset"
        @change="handlePresetChange"
      >
        <option value="">Load preset...</option>
        <option v-for="preset in presets" :key="preset.id" :value="preset.id">
          {{ preset.name }} &mdash; {{ preset.description }}
        </option>
      </select>
    </div>
  </div>
</template>
