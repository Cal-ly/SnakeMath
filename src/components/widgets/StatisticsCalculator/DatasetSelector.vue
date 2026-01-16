<script setup lang="ts">
import type { DatasetPreset } from '@/utils/math/statistics'

interface Props {
  presets: DatasetPreset[]
  selectedDataset: string
}

defineProps<Props>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <div class="dataset-selector" data-testid="dataset-selector">
    <label class="block text-sm font-medium text-text-secondary mb-2">
      <i class="fa-solid fa-database mr-2" aria-hidden="true" />
      Dataset
    </label>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.id"
        :data-testid="`dataset-${preset.id}`"
        :class="[
          'px-3 py-2 text-sm rounded-lg border transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          selectedDataset === preset.id
            ? 'bg-primary text-white border-primary'
            : 'bg-surface border-border text-text-secondary hover:border-primary hover:text-primary',
        ]"
        :title="preset.description"
        @click="emit('select', preset.id)"
      >
        {{ preset.name }}
      </button>

      <button
        data-testid="dataset-custom"
        :class="[
          'px-3 py-2 text-sm rounded-lg border transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          selectedDataset === 'custom'
            ? 'bg-primary text-white border-primary'
            : 'bg-surface border-border text-text-secondary hover:border-primary hover:text-primary',
        ]"
        title="Enter your own data"
        @click="emit('select', 'custom')"
      >
        <i class="fa-solid fa-pencil mr-1" aria-hidden="true" />
        Custom
      </button>
    </div>
  </div>
</template>
