<script setup lang="ts">
import type { CorrelationPreset } from '@/composables/useCorrelation'

interface Props {
  presets: CorrelationPreset[]
  selectedPresetId: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  selectPreset: [presetId: string]
}>()
</script>

<template>
  <div class="correlation-presets" data-testid="correlation-presets">
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="preset in presets"
        :key="preset.id"
        :class="[
          'preset-card p-4 rounded-lg border text-left transition-colors',
          selectedPresetId === preset.id
            ? 'border-accent-primary bg-accent-primary/10'
            : 'border-border bg-surface hover:border-accent-primary/50',
        ]"
        :data-testid="`preset-${preset.id}`"
        @click="emit('selectPreset', preset.id)"
      >
        <h4 class="font-medium text-text-primary mb-1">{{ preset.name }}</h4>
        <p class="text-sm text-text-secondary mb-2">{{ preset.description }}</p>
        <p class="text-xs text-text-muted">
          Expected r ≈ {{ preset.expectedR.toFixed(2) }}
        </p>
      </button>
    </div>
  </div>
</template>
