<script setup lang="ts">
import type { TransformationType, TransformationPreset } from '@/types/math'

interface Props {
  selectedType: TransformationType
  presets: TransformationPreset[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:type': [type: TransformationType]
  'select-preset': [presetId: string]
}>()

const transformationTypes: { type: TransformationType; label: string; icon: string }[] = [
  { type: 'identity', label: 'Identity', icon: '=' },
  { type: 'rotation', label: 'Rotate', icon: '↻' },
  { type: 'scale', label: 'Scale', icon: '⤢' },
  { type: 'uniformScale', label: 'Uniform', icon: '⊕' },
  { type: 'shearX', label: 'Shear X', icon: '⇿' },
  { type: 'shearY', label: 'Shear Y', icon: '⇅' },
  { type: 'reflectX', label: 'Reflect X', icon: '↕' },
  { type: 'reflectY', label: 'Reflect Y', icon: '↔' },
]

function handleTypeClick(type: TransformationType) {
  emit('update:type', type)
}

function handlePresetChange(event: Event) {
  const select = event.target as HTMLSelectElement
  if (select.value) {
    emit('select-preset', select.value)
    select.value = '' // Reset to allow re-selecting same preset
  }
}
</script>

<template>
  <div class="transform-selector space-y-3">
    <!-- Transformation Type Buttons -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="{ type, label, icon } in transformationTypes"
        :key="type"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          'flex items-center gap-2',
          selectedType === type
            ? 'bg-primary text-white'
            : 'bg-surface-alt text-text-secondary hover:bg-surface-alt/80 border border-border',
        ]"
        :data-testid="`transform-${type}`"
        :aria-pressed="selectedType === type"
        @click="handleTypeClick(type)"
      >
        <span aria-hidden="true">{{ icon }}</span>
        {{ label }}
      </button>
    </div>

    <!-- Preset Dropdown -->
    <div class="flex items-center gap-3">
      <label for="preset-select" class="text-sm text-text-muted">Quick presets:</label>
      <select
        id="preset-select"
        class="px-3 py-1.5 rounded-lg bg-surface-alt border border-border text-sm"
        data-testid="preset-select"
        @change="handlePresetChange"
      >
        <option value="">Select a preset...</option>
        <option v-for="preset in presets" :key="preset.id" :value="preset.id">
          {{ preset.name }}
        </option>
      </select>
    </div>
  </div>
</template>
